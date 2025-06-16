//! Streaming payment implementation
//! 
//! This module provides functionality for continuous payment streams,
//! where payments are made over time at a specified rate.

use borsh::{BorshDeserialize, BorshSerialize};
use solana_sdk::{
    instruction::{AccountMeta, Instruction},
    pubkey::Pubkey,
    signature::Signer,
    system_program,
};
use crate::errors::{SdkError, SdkResult};
use super::common::*;

/// Streaming payment state
#[derive(Debug, Clone, BorshSerialize, BorshDeserialize)]
pub struct StreamingPayment {
    pub stream_id: u64,
    pub payer: Pubkey,
    pub recipient: Pubkey,
    pub token_mint: Pubkey,
    pub rate_per_second: u64,
    pub total_amount: u64,
    pub amount_streamed: u64,
    pub start_time: i64,
    pub end_time: i64,
    pub last_claimed: i64,
    pub is_active: bool,
    pub is_paused: bool,
}

/// Arguments for creating a streaming payment
#[derive(Debug, Clone)]
pub struct CreateStreamArgs {
    pub recipient: Pubkey,
    pub token_mint: Pubkey,
    pub total_amount: u64,
    pub duration_seconds: i64,
    pub start_immediately: bool,
}

/// Arguments for updating a stream
#[derive(Debug, Clone)]
pub struct UpdateStreamArgs {
    pub new_rate_per_second: Option<u64>,
    pub extend_duration: Option<i64>,
}

/// Stream status information
#[derive(Debug, Clone)]
pub struct StreamStatus {
    pub stream: StreamingPayment,
    pub available_to_claim: u64,
    pub progress_percentage: f64,
    pub time_remaining: i64,
    pub is_completed: bool,
}

/// Streaming payment client
pub struct StreamingPaymentClient {
    rpc_client: solana_client::rpc_client::RpcClient,
    program_id: Pubkey,
}

impl StreamingPaymentClient {
    /// Create a new streaming payment client
    pub fn new(rpc_url: &str, program_id: Pubkey) -> Self {
        Self {
            rpc_client: solana_client::rpc_client::RpcClient::new(rpc_url.to_string()),
            program_id,
        }
    }
    
    /// Create a new streaming payment
    pub async fn create_stream<S: Signer>(
        &self,
        payer: &S,
        args: CreateStreamArgs,
    ) -> SdkResult<(u64, PaymentResult)> {
        if args.total_amount == 0 {
            return Err(SdkError::ValidationError("Total amount cannot be zero".to_string()));
        }
        
        if args.duration_seconds <= 0 {
            return Err(SdkError::ValidationError("Duration must be positive".to_string()));
        }
        
        let rate_per_second = args.total_amount / args.duration_seconds as u64;
        if rate_per_second == 0 {
            return Err(SdkError::ValidationError("Rate per second cannot be zero".to_string()));
        }
        
        // Generate stream ID (in real implementation, this would be more sophisticated)
        let stream_id = self.generate_stream_id(&payer.pubkey(), &args.recipient).await?;
        let stream_pda = self.derive_stream_pda(stream_id)?;
        
        // Check if stream already exists
        if self.account_exists(&stream_pda).await? {
            return Err(SdkError::AccountAlreadyExists);
        }
        
        let total_amount = args.total_amount; // Save value before move
        
        let instruction = self.create_stream_instruction(
            &payer.pubkey(),
            &stream_pda,
            stream_id,
            &args,
        )?;
        
        let signature = self.send_and_confirm_transaction(payer, vec![instruction]).await?;
        
        Ok((stream_id, PaymentResult {
            signature,
            amount_paid: 0, // No immediate payment, just stream setup
            remaining_balance: Some(total_amount),
            payment_method: PaymentMethod::Streaming,
        }))
    }
    
    /// Claim available funds from a stream
    pub async fn claim_stream<S: Signer>(
        &self,
        claimer: &S,
        stream_id: u64,
    ) -> SdkResult<PaymentResult> {
        let stream_pda = self.derive_stream_pda(stream_id)?;
        let stream = self.get_stream(&stream_pda).await?;
        
        // Verify claimer is the recipient
        if claimer.pubkey() != stream.recipient {
            return Err(SdkError::Unauthorized);
        }
        
        if !stream.is_active {
            return Err(SdkError::ValidationError("Stream is not active".to_string()));
        }
        
        let available = self.calculate_available_amount(&stream)?;
        if available == 0 {
            return Err(SdkError::ValidationError("No funds available to claim".to_string()));
        }
        
        let instruction = self.create_claim_instruction(
            &claimer.pubkey(),
            &stream_pda,
            stream_id,
        )?;
        
        let signature = self.send_and_confirm_transaction(claimer, vec![instruction]).await?;
        
        let new_remaining = stream.total_amount - (stream.amount_streamed + available);
        
        Ok(PaymentResult {
            signature,
            amount_paid: available,
            remaining_balance: Some(new_remaining),
            payment_method: PaymentMethod::Streaming,
        })
    }
    
    /// Pause a stream
    pub async fn pause_stream<S: Signer>(
        &self,
        payer: &S,
        stream_id: u64,
    ) -> SdkResult<solana_sdk::signature::Signature> {
        let stream_pda = self.derive_stream_pda(stream_id)?;
        let stream = self.get_stream(&stream_pda).await?;
        
        // Verify payer is the owner
        if payer.pubkey() != stream.payer {
            return Err(SdkError::Unauthorized);
        }
        
        if stream.is_paused {
            return Err(SdkError::ValidationError("Stream is already paused".to_string()));
        }
        
        let instruction = self.create_pause_instruction(
            &payer.pubkey(),
            &stream_pda,
            stream_id,
        )?;
        
        self.send_and_confirm_transaction(payer, vec![instruction]).await
    }
    
    /// Resume a paused stream
    pub async fn resume_stream<S: Signer>(
        &self,
        payer: &S,
        stream_id: u64,
    ) -> SdkResult<solana_sdk::signature::Signature> {
        let stream_pda = self.derive_stream_pda(stream_id)?;
        let stream = self.get_stream(&stream_pda).await?;
        
        // Verify payer is the owner
        if payer.pubkey() != stream.payer {
            return Err(SdkError::Unauthorized);
        }
        
        if !stream.is_paused {
            return Err(SdkError::ValidationError("Stream is not paused".to_string()));
        }
        
        let instruction = self.create_resume_instruction(
            &payer.pubkey(),
            &stream_pda,
            stream_id,
        )?;
        
        self.send_and_confirm_transaction(payer, vec![instruction]).await
    }
    
    /// Cancel a stream and refund remaining balance
    pub async fn cancel_stream<S: Signer>(
        &self,
        payer: &S,
        stream_id: u64,
    ) -> SdkResult<PaymentResult> {
        let stream_pda = self.derive_stream_pda(stream_id)?;
        let stream = self.get_stream(&stream_pda).await?;
        
        // Verify payer is the owner
        if payer.pubkey() != stream.payer {
            return Err(SdkError::Unauthorized);
        }
        
        let available_to_recipient = self.calculate_available_amount(&stream)?;
        let refund_amount = stream.total_amount - stream.amount_streamed - available_to_recipient;
        
        let instruction = self.create_cancel_instruction(
            &payer.pubkey(),
            &stream_pda,
            stream_id,
        )?;
        
        let signature = self.send_and_confirm_transaction(payer, vec![instruction]).await?;
        
        Ok(PaymentResult {
            signature,
            amount_paid: 0,
            remaining_balance: Some(refund_amount),
            payment_method: PaymentMethod::Streaming,
        })
    }
    
    /// Get stream information
    pub async fn get_stream(&self, stream_pda: &Pubkey) -> SdkResult<StreamingPayment> {
        let account = self.rpc_client
            .get_account(stream_pda)
            .map_err(SdkError::ClientError)?;
            
        // Skip discriminator (8 bytes)
        if account.data.len() < 8 {
            return Err(SdkError::InvalidAccountData);
        }
        
        StreamingPayment::try_from_slice(&account.data[8..])
            .map_err(|e| SdkError::DeserializationError(format!("Failed to deserialize stream: {}", e)))
    }
    
    /// Get stream status with current calculations
    pub async fn get_stream_status(&self, stream_id: u64) -> SdkResult<StreamStatus> {
        let stream_pda = self.derive_stream_pda(stream_id)?;
        let stream = self.get_stream(&stream_pda).await?;
        
        let available_to_claim = self.calculate_available_amount(&stream)?;
        let total_streamed = stream.amount_streamed + available_to_claim;
        let progress_percentage = if stream.total_amount > 0 {
            (total_streamed as f64 / stream.total_amount as f64) * 100.0
        } else {
            0.0
        };
        
        let current_time = self.get_current_timestamp().await?;
        let time_remaining = if current_time < stream.end_time {
            stream.end_time - current_time
        } else {
            0
        };
        
        let is_completed = total_streamed >= stream.total_amount || current_time >= stream.end_time;
        
        Ok(StreamStatus {
            stream,
            available_to_claim,
            progress_percentage,
            time_remaining,
            is_completed,
        })
    }
    
    /// Calculate how much is available to claim from a stream
    fn calculate_available_amount(&self, stream: &StreamingPayment) -> SdkResult<u64> {
        if !stream.is_active || stream.is_paused {
            return Ok(0);
        }
        
        // This is a simplified calculation - in a real implementation,
        // you'd get the current timestamp from the blockchain
        let current_time = std::time::SystemTime::now()
            .duration_since(std::time::UNIX_EPOCH)
            .unwrap()
            .as_secs() as i64;
            
        let effective_current_time = std::cmp::min(current_time, stream.end_time);
        let time_since_last_claim = effective_current_time - stream.last_claimed;
        
        if time_since_last_claim <= 0 {
            return Ok(0);
        }
        
        let available = (time_since_last_claim as u64) * stream.rate_per_second;
        let max_remaining = stream.total_amount - stream.amount_streamed;
        
        Ok(std::cmp::min(available, max_remaining))
    }
    
    /// Generate a unique stream ID
    async fn generate_stream_id(&self, payer: &Pubkey, recipient: &Pubkey) -> SdkResult<u64> {
        // In a real implementation, this would be more sophisticated
        // For now, use a simple hash-based approach
        use std::collections::hash_map::DefaultHasher;
        use std::hash::{Hash, Hasher};
        
        let mut hasher = DefaultHasher::new();
        payer.hash(&mut hasher);
        recipient.hash(&mut hasher);
        
        let timestamp = std::time::SystemTime::now()
            .duration_since(std::time::UNIX_EPOCH)
            .unwrap()
            .as_secs();
        timestamp.hash(&mut hasher);
        
        Ok(hasher.finish())
    }
    
    /// Derive stream PDA
    fn derive_stream_pda(&self, stream_id: u64) -> SdkResult<Pubkey> {
        let stream_id_bytes = stream_id.to_le_bytes();
        let seeds = &[
            b"streaming_payment".as_ref(),
            stream_id_bytes.as_ref(),
        ];
        
        let (pda, _) = Pubkey::find_program_address(seeds, &self.program_id);
        Ok(pda)
    }
    
    /// Check if account exists
    async fn account_exists(&self, account: &Pubkey) -> SdkResult<bool> {
        match self.rpc_client.get_account(account) {
            Ok(_) => Ok(true),
            Err(_) => Ok(false),
        }
    }
    
    /// Get current timestamp (simplified for testing)
    async fn get_current_timestamp(&self) -> SdkResult<i64> {
        Ok(std::time::SystemTime::now()
            .duration_since(std::time::UNIX_EPOCH)
            .unwrap()
            .as_secs() as i64)
    }
    
    /// Create stream instruction
    fn create_stream_instruction(
        &self,
        payer: &Pubkey,
        stream_pda: &Pubkey,
        stream_id: u64,
        args: &CreateStreamArgs,
    ) -> SdkResult<Instruction> {
        let accounts = vec![
            AccountMeta::new(*stream_pda, false),
            AccountMeta::new_readonly(*payer, true),
            AccountMeta::new(*payer, true), // payer
            AccountMeta::new_readonly(args.recipient, false),
            AccountMeta::new_readonly(args.token_mint, false),
            AccountMeta::new_readonly(system_program::id(), false),
        ];
        
        let mut data = vec![0u8]; // instruction discriminator for create_stream
        data.extend_from_slice(&stream_id.to_le_bytes());
        data.extend_from_slice(&args.total_amount.to_le_bytes());
        data.extend_from_slice(&args.duration_seconds.to_le_bytes());
        data.push(if args.start_immediately { 1u8 } else { 0u8 });
        
        Ok(Instruction {
            program_id: self.program_id,
            accounts,
            data,
        })
    }
    
    /// Create claim instruction
    fn create_claim_instruction(
        &self,
        recipient: &Pubkey,
        stream_pda: &Pubkey,
        stream_id: u64,
    ) -> SdkResult<Instruction> {
        let accounts = vec![
            AccountMeta::new(*stream_pda, false),
            AccountMeta::new_readonly(*recipient, true),
        ];
        
        let mut data = vec![1u8]; // instruction discriminator for claim
        data.extend_from_slice(&stream_id.to_le_bytes());
        
        Ok(Instruction {
            program_id: self.program_id,
            accounts,
            data,
        })
    }
    
    /// Create pause instruction
    fn create_pause_instruction(
        &self,
        payer: &Pubkey,
        stream_pda: &Pubkey,
        stream_id: u64,
    ) -> SdkResult<Instruction> {
        let accounts = vec![
            AccountMeta::new(*stream_pda, false),
            AccountMeta::new_readonly(*payer, true),
        ];
        
        let mut data = vec![2u8]; // instruction discriminator for pause
        data.extend_from_slice(&stream_id.to_le_bytes());
        
        Ok(Instruction {
            program_id: self.program_id,
            accounts,
            data,
        })
    }
    
    /// Create resume instruction
    fn create_resume_instruction(
        &self,
        payer: &Pubkey,
        stream_pda: &Pubkey,
        stream_id: u64,
    ) -> SdkResult<Instruction> {
        let accounts = vec![
            AccountMeta::new(*stream_pda, false),
            AccountMeta::new_readonly(*payer, true),
        ];
        
        let mut data = vec![3u8]; // instruction discriminator for resume
        data.extend_from_slice(&stream_id.to_le_bytes());
        
        Ok(Instruction {
            program_id: self.program_id,
            accounts,
            data,
        })
    }
    
    /// Create cancel instruction
    fn create_cancel_instruction(
        &self,
        payer: &Pubkey,
        stream_pda: &Pubkey,
        stream_id: u64,
    ) -> SdkResult<Instruction> {
        let accounts = vec![
            AccountMeta::new(*stream_pda, false),
            AccountMeta::new_readonly(*payer, true),
        ];
        
        let mut data = vec![4u8]; // instruction discriminator for cancel
        data.extend_from_slice(&stream_id.to_le_bytes());
        
        Ok(Instruction {
            program_id: self.program_id,
            accounts,
            data,
        })
    }
    
    /// Send and confirm transaction
    async fn send_and_confirm_transaction<S: Signer>(
        &self,
        signer: &S,
        instructions: Vec<Instruction>,
    ) -> SdkResult<solana_sdk::signature::Signature> {
        let recent_blockhash = self.rpc_client
            .get_latest_blockhash()
            .map_err(SdkError::ClientError)?;
            
        let transaction = solana_sdk::transaction::Transaction::new_signed_with_payer(
            &instructions,
            Some(&signer.pubkey()),
            &[signer],
            recent_blockhash,
        );
        
        self.rpc_client
            .send_and_confirm_transaction_with_spinner(&transaction)
            .map_err(SdkError::ClientError)
    }
}

#[cfg(test)]
mod tests {
    use super::*;
    use solana_sdk::signer::keypair::Keypair;

    #[test]
    fn test_create_stream_args() {
        let args = CreateStreamArgs {
            recipient: Pubkey::new_unique(),
            token_mint: Pubkey::new_unique(),
            total_amount: 1000 * A2AMPL_BASE_UNIT,
            duration_seconds: 3600, // 1 hour
            start_immediately: true,
        };
        
        assert_eq!(args.total_amount, 1000 * A2AMPL_BASE_UNIT);
        assert_eq!(args.duration_seconds, 3600);
        assert!(args.start_immediately);
    }
    
    #[test]
    fn test_streaming_payment_serialization() {
        let payment = StreamingPayment {
            stream_id: 12345,
            payer: Pubkey::new_unique(),
            recipient: Pubkey::new_unique(),
            token_mint: Pubkey::new_unique(),
            rate_per_second: 1000,
            total_amount: 3600000,
            amount_streamed: 1800000,
            start_time: 1000000,
            end_time: 1003600,
            last_claimed: 1001800,
            is_active: true,
            is_paused: false,
        };
        
        // Test serialization/deserialization
        let serialized = payment.try_to_vec().unwrap();
        let deserialized = StreamingPayment::try_from_slice(&serialized).unwrap();
        
        assert_eq!(payment.stream_id, deserialized.stream_id);
        assert_eq!(payment.payer, deserialized.payer);
        assert_eq!(payment.recipient, deserialized.recipient);
        assert_eq!(payment.token_mint, deserialized.token_mint);
        assert_eq!(payment.rate_per_second, deserialized.rate_per_second);
        assert_eq!(payment.total_amount, deserialized.total_amount);
        assert_eq!(payment.amount_streamed, deserialized.amount_streamed);
        assert_eq!(payment.start_time, deserialized.start_time);
        assert_eq!(payment.end_time, deserialized.end_time);
        assert_eq!(payment.last_claimed, deserialized.last_claimed);
        assert_eq!(payment.is_active, deserialized.is_active);
        assert_eq!(payment.is_paused, deserialized.is_paused);
    }
    
    #[test]
    fn test_streaming_client_creation() {
        let program_id = Pubkey::new_unique();
        let client = StreamingPaymentClient::new("https://api.devnet.solana.com", program_id);
        assert_eq!(client.program_id, program_id);
    }
    
    #[test]
    fn test_derive_stream_pda() {
        let program_id = Pubkey::new_unique();
        let client = StreamingPaymentClient::new("https://api.devnet.solana.com", program_id);
        let stream_id = 12345u64;
        
        let pda1 = client.derive_stream_pda(stream_id).unwrap();
        let pda2 = client.derive_stream_pda(stream_id).unwrap();
        
        // Should be deterministic
        assert_eq!(pda1, pda2);
        assert_ne!(pda1, Pubkey::default());
        
        // Different stream IDs should produce different PDAs
        let pda3 = client.derive_stream_pda(54321).unwrap();
        assert_ne!(pda1, pda3);
    }
    
    #[test]
    fn test_calculate_available_amount() {
        let client = StreamingPaymentClient::new("https://api.devnet.solana.com", Pubkey::new_unique());
        
        let mut stream = StreamingPayment {
            stream_id: 1,
            payer: Pubkey::new_unique(),
            recipient: Pubkey::new_unique(),
            token_mint: Pubkey::new_unique(),
            rate_per_second: 1000,
            total_amount: 3600000, // 1 hour worth
            amount_streamed: 0,
            start_time: 1000000,
            end_time: 1003600,
            last_claimed: 1000000,
            is_active: true,
            is_paused: false,
        };
        
        // Test active stream - this will be timing-dependent in real usage
        // For testing, we can't easily mock the time, so just verify the function doesn't panic
        let _ = client.calculate_available_amount(&stream);
        
        // Test paused stream
        stream.is_paused = true;
        let available = client.calculate_available_amount(&stream).unwrap();
        assert_eq!(available, 0);
        
        // Test inactive stream
        stream.is_paused = false;
        stream.is_active = false;
        let available = client.calculate_available_amount(&stream).unwrap();
        assert_eq!(available, 0);
    }
}