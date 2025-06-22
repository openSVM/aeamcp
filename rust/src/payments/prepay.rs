//! Prepaid payment implementation
//!
//! This module provides functionality for prepaid balance management,
//! where users load credits that get decremented with each service call.

use super::common::*;
use crate::errors::{SdkError, SdkResult};
use borsh::{BorshDeserialize, BorshSerialize};
use solana_sdk::{
    instruction::{AccountMeta, Instruction},
    pubkey::Pubkey,
    signature::Signer,
    system_program,
};

/// Prepaid account state
#[derive(Debug, Clone, BorshSerialize, BorshDeserialize)]
pub struct PrepaidAccount {
    pub owner: Pubkey,
    pub balance: u64,
    pub total_deposited: u64,
    pub total_spent: u64,
    pub last_activity: i64,
    pub is_active: bool,
}

/// Arguments for creating a prepaid account
#[derive(Debug, Clone)]
pub struct CreatePrepaidAccountArgs {
    pub initial_deposit: u64,
}

/// Arguments for topping up a prepaid account
#[derive(Debug, Clone)]
pub struct TopUpArgs {
    pub amount: u64,
}

/// Arguments for spending from prepaid account
#[derive(Debug, Clone)]
pub struct SpendArgs {
    pub amount: u64,
    pub service_type: PrepaidServiceType,
    pub metadata: Option<String>,
}

/// Service types for prepaid spending
#[derive(Debug, Clone, Copy, PartialEq, Eq, BorshSerialize, BorshDeserialize)]
pub enum PrepaidServiceType {
    AgentService,
    ToolUsage,
    ResourceAccess,
    PromptExecution,
    RegistrationFee,
}

impl PrepaidServiceType {
    pub fn min_spend(&self) -> u64 {
        match self {
            PrepaidServiceType::AgentService => MIN_SERVICE_FEE,
            PrepaidServiceType::ToolUsage => MIN_TOOL_FEE,
            PrepaidServiceType::ResourceAccess => MIN_RESOURCE_FEE,
            PrepaidServiceType::PromptExecution => MIN_PROMPT_FEE,
            PrepaidServiceType::RegistrationFee => 0, // No minimum for registration fees
        }
    }
}

/// Prepaid payment client
pub struct PrepaidPaymentClient {
    rpc_client: solana_client::rpc_client::RpcClient,
    program_id: Pubkey,
}

impl PrepaidPaymentClient {
    /// Create a new prepaid payment client
    pub fn new(rpc_url: &str, program_id: Pubkey) -> Self {
        Self {
            rpc_client: solana_client::rpc_client::RpcClient::new(rpc_url.to_string()),
            program_id,
        }
    }

    /// Create a new prepaid account
    pub async fn create_prepaid_account<S: Signer>(
        &self,
        owner: &S,
        token_mint: &Pubkey,
        args: CreatePrepaidAccountArgs,
    ) -> SdkResult<(Pubkey, PaymentResult)> {
        if args.initial_deposit == 0 {
            return Err(SdkError::ValidationError(
                "Initial deposit cannot be zero".to_string(),
            ));
        }

        let prepaid_pda = self.derive_prepaid_account_pda(&owner.pubkey())?;

        // Check if account already exists
        if self.account_exists(&prepaid_pda).await? {
            return Err(SdkError::AccountAlreadyExists);
        }

        let instruction = self.create_prepaid_account_instruction(
            &owner.pubkey(),
            &prepaid_pda,
            token_mint,
            args.initial_deposit,
        )?;

        let signature = self
            .send_and_confirm_transaction(owner, vec![instruction])
            .await?;

        Ok((
            prepaid_pda,
            PaymentResult {
                signature,
                amount_paid: args.initial_deposit,
                remaining_balance: Some(args.initial_deposit),
                payment_method: PaymentMethod::Prepaid,
            },
        ))
    }

    /// Top up a prepaid account
    pub async fn top_up<S: Signer>(
        &self,
        owner: &S,
        token_mint: &Pubkey,
        args: TopUpArgs,
    ) -> SdkResult<PaymentResult> {
        if args.amount == 0 {
            return Err(SdkError::ValidationError(
                "Top up amount cannot be zero".to_string(),
            ));
        }

        let prepaid_pda = self.derive_prepaid_account_pda(&owner.pubkey())?;

        // Check account exists
        let account = self.get_prepaid_account(&prepaid_pda).await?;

        let instruction =
            self.create_top_up_instruction(&owner.pubkey(), &prepaid_pda, token_mint, args.amount)?;

        let signature = self
            .send_and_confirm_transaction(owner, vec![instruction])
            .await?;

        let new_balance = account.balance + args.amount;

        Ok(PaymentResult {
            signature,
            amount_paid: args.amount,
            remaining_balance: Some(new_balance),
            payment_method: PaymentMethod::Prepaid,
        })
    }

    /// Spend from prepaid account
    pub async fn spend<S: Signer>(
        &self,
        owner: &S,
        recipient: &Pubkey,
        args: SpendArgs,
    ) -> SdkResult<PaymentResult> {
        if args.amount < args.service_type.min_spend() {
            return Err(SdkError::FeeTooLow);
        }

        let prepaid_pda = self.derive_prepaid_account_pda(&owner.pubkey())?;
        let account = self.get_prepaid_account(&prepaid_pda).await?;

        if account.balance < args.amount {
            return Err(SdkError::InsufficientTokenBalance);
        }

        if !account.is_active {
            return Err(SdkError::ValidationError(
                "Prepaid account is not active".to_string(),
            ));
        }

        let instruction = self.create_spend_instruction(
            &owner.pubkey(),
            &prepaid_pda,
            recipient,
            args.amount,
            args.service_type,
        )?;

        let signature = self
            .send_and_confirm_transaction(owner, vec![instruction])
            .await?;

        let new_balance = account.balance - args.amount;

        Ok(PaymentResult {
            signature,
            amount_paid: args.amount,
            remaining_balance: Some(new_balance),
            payment_method: PaymentMethod::Prepaid,
        })
    }

    /// Get prepaid account information
    pub async fn get_prepaid_account(&self, account_pda: &Pubkey) -> SdkResult<PrepaidAccount> {
        let account = self
            .rpc_client
            .get_account(account_pda)
            .map_err(SdkError::ClientError)?;

        crate::client::deserialize_account_data(&account.data, "prepaid account")
    }

    /// Get account balance
    pub async fn get_balance(&self, owner: &Pubkey) -> SdkResult<u64> {
        let prepaid_pda = self.derive_prepaid_account_pda(owner)?;
        let account = self.get_prepaid_account(&prepaid_pda).await?;
        Ok(account.balance)
    }

    /// Check if account is active
    pub async fn is_account_active(&self, owner: &Pubkey) -> SdkResult<bool> {
        let prepaid_pda = self.derive_prepaid_account_pda(owner)?;
        match self.get_prepaid_account(&prepaid_pda).await {
            Ok(account) => Ok(account.is_active),
            Err(SdkError::ClientError(_)) => Ok(false), // Account doesn't exist
            Err(e) => Err(e),
        }
    }

    /// Activate/deactivate prepaid account
    pub async fn set_account_active<S: Signer>(
        &self,
        owner: &S,
        active: bool,
    ) -> SdkResult<solana_sdk::signature::Signature> {
        let prepaid_pda = self.derive_prepaid_account_pda(&owner.pubkey())?;

        let instruction =
            self.create_set_active_instruction(&owner.pubkey(), &prepaid_pda, active)?;

        self.send_and_confirm_transaction(owner, vec![instruction])
            .await
    }

    /// Withdraw remaining balance and close account
    pub async fn close_account<S: Signer>(
        &self,
        owner: &S,
        token_mint: &Pubkey,
    ) -> SdkResult<PaymentResult> {
        let prepaid_pda = self.derive_prepaid_account_pda(&owner.pubkey())?;
        let _account = self.get_prepaid_account(&prepaid_pda).await?;

        let instruction =
            self.create_close_account_instruction(&owner.pubkey(), &prepaid_pda, token_mint)?;

        let signature = self
            .send_and_confirm_transaction(owner, vec![instruction])
            .await?;

        Ok(PaymentResult {
            signature,
            amount_paid: 0,
            remaining_balance: Some(0),
            payment_method: PaymentMethod::Prepaid,
        })
    }

    /// Derive prepaid account PDA
    fn derive_prepaid_account_pda(&self, owner: &Pubkey) -> SdkResult<Pubkey> {
        let seeds = &[b"prepaid_account", owner.as_ref()];

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

    /// Create prepaid account instruction
    fn create_prepaid_account_instruction(
        &self,
        owner: &Pubkey,
        prepaid_pda: &Pubkey,
        token_mint: &Pubkey,
        initial_deposit: u64,
    ) -> SdkResult<Instruction> {
        let accounts = vec![
            AccountMeta::new(*prepaid_pda, false),
            AccountMeta::new_readonly(*owner, true),
            AccountMeta::new(*owner, true), // payer
            AccountMeta::new_readonly(*token_mint, false),
            AccountMeta::new_readonly(system_program::id(), false),
        ];

        let mut data = vec![0u8]; // instruction discriminator for create
        data.extend_from_slice(&initial_deposit.to_le_bytes());

        Ok(Instruction {
            program_id: self.program_id,
            accounts,
            data,
        })
    }

    /// Create top up instruction
    fn create_top_up_instruction(
        &self,
        owner: &Pubkey,
        prepaid_pda: &Pubkey,
        token_mint: &Pubkey,
        amount: u64,
    ) -> SdkResult<Instruction> {
        let accounts = vec![
            AccountMeta::new(*prepaid_pda, false),
            AccountMeta::new_readonly(*owner, true),
            AccountMeta::new_readonly(*token_mint, false),
        ];

        let mut data = vec![1u8]; // instruction discriminator for top_up
        data.extend_from_slice(&amount.to_le_bytes());

        Ok(Instruction {
            program_id: self.program_id,
            accounts,
            data,
        })
    }

    /// Create spend instruction
    fn create_spend_instruction(
        &self,
        owner: &Pubkey,
        prepaid_pda: &Pubkey,
        recipient: &Pubkey,
        amount: u64,
        service_type: PrepaidServiceType,
    ) -> SdkResult<Instruction> {
        let accounts = vec![
            AccountMeta::new(*prepaid_pda, false),
            AccountMeta::new_readonly(*owner, true),
            AccountMeta::new_readonly(*recipient, false),
        ];

        let mut data = vec![2u8]; // instruction discriminator for spend
        data.extend_from_slice(&amount.to_le_bytes());
        data.push(service_type as u8);

        Ok(Instruction {
            program_id: self.program_id,
            accounts,
            data,
        })
    }

    /// Create set active instruction
    fn create_set_active_instruction(
        &self,
        owner: &Pubkey,
        prepaid_pda: &Pubkey,
        active: bool,
    ) -> SdkResult<Instruction> {
        let accounts = vec![
            AccountMeta::new(*prepaid_pda, false),
            AccountMeta::new_readonly(*owner, true),
        ];

        let mut data = vec![3u8]; // instruction discriminator for set_active
        data.push(if active { 1u8 } else { 0u8 });

        Ok(Instruction {
            program_id: self.program_id,
            accounts,
            data,
        })
    }

    /// Create close account instruction
    fn create_close_account_instruction(
        &self,
        owner: &Pubkey,
        prepaid_pda: &Pubkey,
        token_mint: &Pubkey,
    ) -> SdkResult<Instruction> {
        let accounts = vec![
            AccountMeta::new(*prepaid_pda, false),
            AccountMeta::new_readonly(*owner, true),
            AccountMeta::new_readonly(*token_mint, false),
        ];

        let data = vec![4u8]; // instruction discriminator for close

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
        let recent_blockhash = self
            .rpc_client
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
    fn test_prepaid_service_type_min_spend() {
        assert_eq!(
            PrepaidServiceType::AgentService.min_spend(),
            MIN_SERVICE_FEE
        );
        assert_eq!(PrepaidServiceType::ToolUsage.min_spend(), MIN_TOOL_FEE);
        assert_eq!(
            PrepaidServiceType::ResourceAccess.min_spend(),
            MIN_RESOURCE_FEE
        );
        assert_eq!(
            PrepaidServiceType::PromptExecution.min_spend(),
            MIN_PROMPT_FEE
        );
        assert_eq!(PrepaidServiceType::RegistrationFee.min_spend(), 0);
    }

    #[test]
    fn test_create_prepaid_account_args() {
        let args = CreatePrepaidAccountArgs {
            initial_deposit: 1000 * A2AMPL_BASE_UNIT,
        };

        assert_eq!(args.initial_deposit, 1000 * A2AMPL_BASE_UNIT);
    }

    #[test]
    fn test_top_up_args() {
        let args = TopUpArgs {
            amount: 500 * A2AMPL_BASE_UNIT,
        };

        assert_eq!(args.amount, 500 * A2AMPL_BASE_UNIT);
    }

    #[test]
    fn test_spend_args() {
        let args = SpendArgs {
            amount: MIN_SERVICE_FEE,
            service_type: PrepaidServiceType::AgentService,
            metadata: Some("test metadata".to_string()),
        };

        assert_eq!(args.amount, MIN_SERVICE_FEE);
        assert_eq!(args.service_type, PrepaidServiceType::AgentService);
        assert_eq!(args.metadata, Some("test metadata".to_string()));
    }

    #[test]
    fn test_prepaid_account_serialization() {
        let account = PrepaidAccount {
            owner: Pubkey::new_unique(),
            balance: 1000 * A2AMPL_BASE_UNIT,
            total_deposited: 2000 * A2AMPL_BASE_UNIT,
            total_spent: 1000 * A2AMPL_BASE_UNIT,
            last_activity: 1234567890,
            is_active: true,
        };

        // Test serialization/deserialization
        let serialized = account.try_to_vec().unwrap();
        let deserialized = PrepaidAccount::try_from_slice(&serialized).unwrap();

        assert_eq!(account.owner, deserialized.owner);
        assert_eq!(account.balance, deserialized.balance);
        assert_eq!(account.total_deposited, deserialized.total_deposited);
        assert_eq!(account.total_spent, deserialized.total_spent);
        assert_eq!(account.last_activity, deserialized.last_activity);
        assert_eq!(account.is_active, deserialized.is_active);
    }

    #[test]
    fn test_prepaid_client_creation() {
        let program_id = Pubkey::new_unique();
        let client = PrepaidPaymentClient::new("https://api.devnet.solana.com", program_id);
        assert_eq!(client.program_id, program_id);
    }

    #[test]
    fn test_derive_prepaid_account_pda() {
        let program_id = Pubkey::new_unique();
        let client = PrepaidPaymentClient::new("https://api.devnet.solana.com", program_id);
        let owner = Keypair::new().pubkey();

        let pda1 = client.derive_prepaid_account_pda(&owner).unwrap();
        let pda2 = client.derive_prepaid_account_pda(&owner).unwrap();

        // Should be deterministic
        assert_eq!(pda1, pda2);
        assert_ne!(pda1, Pubkey::default());
    }
}
