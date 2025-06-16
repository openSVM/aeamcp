//! Pay-as-you-go (PYG) payment implementation
//! 
//! This module provides functionality for direct payment per service call,
//! where users pay the exact amount for each transaction.

use borsh::{BorshDeserialize, BorshSerialize};
use solana_sdk::{
    instruction::{AccountMeta, Instruction},
    pubkey::Pubkey,
    signature::Signer,
    sysvar::{clock, rent},
    program_pack::Pack,
};
use spl_token;
use crate::errors::{SdkError, SdkResult};
use super::common::*;

/// Pay-as-you-go payment arguments
#[derive(Debug, Clone, BorshSerialize, BorshDeserialize)]
pub struct PygPaymentArgs {
    pub amount: u64,
    pub service_type: PygServiceType,
    pub compute_units: Option<u32>,
    pub priority_fee: Option<u64>,
}

/// Service types for pay-as-you-go payments
#[derive(Debug, Clone, Copy, PartialEq, Eq, BorshSerialize, BorshDeserialize)]
pub enum PygServiceType {
    AgentService,
    ToolUsage,
    ResourceAccess,
    PromptExecution,
}

impl PygServiceType {
    /// Get the minimum fee for this service type
    pub fn min_fee(&self) -> u64 {
        match self {
            PygServiceType::AgentService => MIN_SERVICE_FEE,
            PygServiceType::ToolUsage => MIN_TOOL_FEE,
            PygServiceType::ResourceAccess => MIN_RESOURCE_FEE,
            PygServiceType::PromptExecution => MIN_PROMPT_FEE,
        }
    }
}

/// Pay-as-you-go payment client
pub struct PygPaymentClient {
    rpc_client: solana_client::rpc_client::RpcClient,
    token_program_id: Pubkey,
}

impl PygPaymentClient {
    /// Create a new PYG payment client
    pub fn new(rpc_url: &str) -> Self {
        Self {
            rpc_client: solana_client::rpc_client::RpcClient::new(rpc_url.to_string()),
            token_program_id: spl_token::id(),
        }
    }
    
    /// Execute a pay-as-you-go payment
    pub async fn pay<S: Signer>(
        &self,
        payer: &S,
        recipient: &Pubkey,
        token_mint: &Pubkey,
        args: PygPaymentArgs,
    ) -> SdkResult<PaymentResult> {
        // Validate payment amount
        if args.amount < args.service_type.min_fee() {
            return Err(SdkError::FeeTooLow);
        }
        
        // Get or create token accounts
        let payer_token_account = self.get_or_create_token_account(payer, token_mint).await?;
        let recipient_token_account = self.get_or_create_token_account_for_owner(recipient, token_mint).await?;
        
        // Check payer balance
        let balance = self.get_token_balance(&payer_token_account).await?;
        if balance < args.amount {
            return Err(SdkError::InsufficientTokenBalance);
        }
        
        // Create transfer instruction
        let transfer_ix = self.create_transfer_instruction(
            &payer_token_account,
            &recipient_token_account,
            &payer.pubkey(),
            args.amount,
        )?;
        
        // Create compute budget instructions if specified
        let mut instructions = vec![];
        
        if let Some(compute_units) = args.compute_units {
            instructions.push(
                solana_sdk::compute_budget::ComputeBudgetInstruction::set_compute_unit_limit(compute_units)
            );
        }
        
        if let Some(priority_fee) = args.priority_fee {
            instructions.push(
                solana_sdk::compute_budget::ComputeBudgetInstruction::set_compute_unit_price(priority_fee)
            );
        }
        
        instructions.push(transfer_ix);
        
        // Send transaction
        let signature = self.send_and_confirm_transaction(payer, instructions).await?;
        
        // Get updated balance
        let remaining_balance = self.get_token_balance(&payer_token_account).await?;
        
        Ok(PaymentResult {
            signature,
            amount_paid: args.amount,
            remaining_balance: Some(remaining_balance),
            payment_method: PaymentMethod::PayAsYouGo,
        })
    }
    
    /// Pay for agent service
    pub async fn pay_agent_service<S: Signer>(
        &self,
        payer: &S,
        agent_owner: &Pubkey,
        token_mint: &Pubkey,
        amount: u64,
        compute_units: Option<u32>,
    ) -> SdkResult<PaymentResult> {
        let args = PygPaymentArgs {
            amount,
            service_type: PygServiceType::AgentService,
            compute_units,
            priority_fee: None,
        };
        
        self.pay(payer, agent_owner, token_mint, args).await
    }
    
    /// Pay for tool usage
    pub async fn pay_tool_usage<S: Signer>(
        &self,
        payer: &S,
        server_owner: &Pubkey,
        token_mint: &Pubkey,
        amount: u64,
        compute_units: Option<u32>,
    ) -> SdkResult<PaymentResult> {
        let args = PygPaymentArgs {
            amount,
            service_type: PygServiceType::ToolUsage,
            compute_units,
            priority_fee: None,
        };
        
        self.pay(payer, server_owner, token_mint, args).await
    }
    
    /// Pay for resource access
    pub async fn pay_resource_access<S: Signer>(
        &self,
        payer: &S,
        server_owner: &Pubkey,
        token_mint: &Pubkey,
        amount: u64,
        compute_units: Option<u32>,
    ) -> SdkResult<PaymentResult> {
        let args = PygPaymentArgs {
            amount,
            service_type: PygServiceType::ResourceAccess,
            compute_units,
            priority_fee: None,
        };
        
        self.pay(payer, server_owner, token_mint, args).await
    }
    
    /// Pay for prompt execution
    pub async fn pay_prompt_execution<S: Signer>(
        &self,
        payer: &S,
        server_owner: &Pubkey,
        token_mint: &Pubkey,
        amount: u64,
        compute_units: Option<u32>,
    ) -> SdkResult<PaymentResult> {
        let args = PygPaymentArgs {
            amount,
            service_type: PygServiceType::PromptExecution,
            compute_units,
            priority_fee: None,
        };
        
        self.pay(payer, server_owner, token_mint, args).await
    }
    
    /// Get token account balance
    pub async fn get_token_balance(&self, token_account: &Pubkey) -> SdkResult<u64> {
        let account = self.rpc_client
            .get_account(token_account)
            .map_err(SdkError::ClientError)?;
            
        let token_account_data = spl_token::state::Account::unpack(&account.data)
            .map_err(|_| SdkError::InvalidTokenAccount)?;
            
        Ok(token_account_data.amount)
    }
    
    /// Get or create token account for the signer
    async fn get_or_create_token_account<S: Signer>(
        &self,
        owner: &S,
        token_mint: &Pubkey,
    ) -> SdkResult<Pubkey> {
        let token_account = spl_associated_token_account::get_associated_token_address(
            &owner.pubkey(),
            token_mint,
        );
        
        // Check if account exists
        match self.rpc_client.get_account(&token_account) {
            Ok(_) => Ok(token_account),
            Err(_) => {
                // Create the account
                let create_ix = spl_associated_token_account::instruction::create_associated_token_account(
                    &owner.pubkey(),
                    &owner.pubkey(),
                    token_mint,
                    &spl_token::id(),
                );
                
                self.send_and_confirm_transaction(owner, vec![create_ix]).await?;
                Ok(token_account)
            }
        }
    }
    
    /// Get or create token account for a specific owner
    async fn get_or_create_token_account_for_owner(
        &self,
        owner: &Pubkey,
        token_mint: &Pubkey,
    ) -> SdkResult<Pubkey> {
        let token_account = spl_associated_token_account::get_associated_token_address(
            owner,
            token_mint,
        );
        
        // For recipient accounts, we assume they exist or will be created by the recipient
        // In a real implementation, you might want to handle account creation differently
        Ok(token_account)
    }
    
    /// Create a token transfer instruction
    fn create_transfer_instruction(
        &self,
        source: &Pubkey,
        destination: &Pubkey,
        owner: &Pubkey,
        amount: u64,
    ) -> SdkResult<Instruction> {
        Ok(spl_token::instruction::transfer(
            &self.token_program_id,
            source,
            destination,
            owner,
            &[],
            amount,
        ).map_err(|e| SdkError::ValidationError(format!("Failed to create transfer instruction: {}", e)))?)
    }
    
    /// Send and confirm a transaction
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

/// Estimate the cost of a pay-as-you-go transaction
pub fn estimate_pyg_cost(
    base_amount: u64,
    priority_multiplier: Option<u8>,
    compute_units: Option<u32>,
    priority_fee_per_cu: Option<u64>,
) -> SdkResult<PygCostEstimate> {
    let effective_multiplier = priority_multiplier.unwrap_or(100);
    if effective_multiplier < MIN_PRIORITY_MULTIPLIER || effective_multiplier > MAX_PRIORITY_MULTIPLIER {
        return Err(SdkError::InvalidPriorityMultiplier);
    }
    
    let service_fee = (base_amount * effective_multiplier as u64) / 100;
    
    let compute_cost = match (compute_units, priority_fee_per_cu) {
        (Some(cu), Some(fee_per_cu)) => cu as u64 * fee_per_cu,
        _ => 0,
    };
    
    Ok(PygCostEstimate {
        service_fee,
        compute_cost,
        total_cost: service_fee + compute_cost,
        effective_priority_multiplier: effective_multiplier,
    })
}

/// Cost estimate for pay-as-you-go payment
#[derive(Debug, Clone)]
pub struct PygCostEstimate {
    pub service_fee: u64,
    pub compute_cost: u64,
    pub total_cost: u64,
    pub effective_priority_multiplier: u8,
}

impl PygCostEstimate {
    /// Convert to human-readable A2AMPL amounts
    pub fn to_a2ampl(&self) -> PygCostEstimateA2ampl {
        PygCostEstimateA2ampl {
            service_fee: convert_base_units_to_a2ampl(self.service_fee),
            compute_cost: convert_base_units_to_a2ampl(self.compute_cost),
            total_cost: convert_base_units_to_a2ampl(self.total_cost),
            effective_priority_multiplier: self.effective_priority_multiplier,
        }
    }
}

/// Cost estimate in A2AMPL units (for display purposes)
#[derive(Debug, Clone)]
pub struct PygCostEstimateA2ampl {
    pub service_fee: f64,
    pub compute_cost: f64,
    pub total_cost: f64,
    pub effective_priority_multiplier: u8,
}

#[cfg(test)]
mod tests {
    use super::*;
    use solana_sdk::signer::keypair::Keypair;

    #[test]
    fn test_pyg_service_type_min_fees() {
        assert_eq!(PygServiceType::AgentService.min_fee(), MIN_SERVICE_FEE);
        assert_eq!(PygServiceType::ToolUsage.min_fee(), MIN_TOOL_FEE);
        assert_eq!(PygServiceType::ResourceAccess.min_fee(), MIN_RESOURCE_FEE);
        assert_eq!(PygServiceType::PromptExecution.min_fee(), MIN_PROMPT_FEE);
    }
    
    #[test]
    fn test_pyg_payment_args() {
        let args = PygPaymentArgs {
            amount: MIN_SERVICE_FEE,
            service_type: PygServiceType::AgentService,
            compute_units: Some(10000),
            priority_fee: Some(1000),
        };
        
        assert_eq!(args.amount, MIN_SERVICE_FEE);
        assert_eq!(args.service_type, PygServiceType::AgentService);
        assert_eq!(args.compute_units, Some(10000));
        assert_eq!(args.priority_fee, Some(1000));
    }
    
    #[test]
    fn test_estimate_pyg_cost() {
        let base_amount = MIN_SERVICE_FEE;
        
        // Test without priority or compute fees
        let estimate = estimate_pyg_cost(base_amount, None, None, None).unwrap();
        assert_eq!(estimate.service_fee, base_amount);
        assert_eq!(estimate.compute_cost, 0);
        assert_eq!(estimate.total_cost, base_amount);
        assert_eq!(estimate.effective_priority_multiplier, 100);
        
        // Test with priority multiplier
        let estimate = estimate_pyg_cost(base_amount, Some(150), None, None).unwrap();
        assert_eq!(estimate.service_fee, (base_amount * 150) / 100);
        assert_eq!(estimate.compute_cost, 0);
        assert_eq!(estimate.total_cost, (base_amount * 150) / 100);
        assert_eq!(estimate.effective_priority_multiplier, 150);
        
        // Test with compute fees
        let estimate = estimate_pyg_cost(base_amount, None, Some(10000), Some(100)).unwrap();
        assert_eq!(estimate.service_fee, base_amount);
        assert_eq!(estimate.compute_cost, 10000 * 100);
        assert_eq!(estimate.total_cost, base_amount + (10000 * 100));
        
        // Test with both
        let estimate = estimate_pyg_cost(base_amount, Some(200), Some(5000), Some(50)).unwrap();
        assert_eq!(estimate.service_fee, (base_amount * 200) / 100);
        assert_eq!(estimate.compute_cost, 5000 * 50);
        assert_eq!(estimate.total_cost, (base_amount * 200) / 100 + (5000 * 50));
    }
    
    #[test]
    fn test_estimate_pyg_cost_validation() {
        let base_amount = MIN_SERVICE_FEE;
        
        // Test invalid priority multiplier
        let result = estimate_pyg_cost(base_amount, Some(MIN_PRIORITY_MULTIPLIER - 1), None, None);
        assert!(matches!(result, Err(SdkError::InvalidPriorityMultiplier)));
        
        // Test at maximum (255 is the max for u8)
        let result = estimate_pyg_cost(base_amount, Some(MAX_PRIORITY_MULTIPLIER), None, None);
        assert!(result.is_ok());
    }
    
    #[test]
    fn test_cost_estimate_conversion() {
        let estimate = PygCostEstimate {
            service_fee: A2AMPL_BASE_UNIT,
            compute_cost: A2AMPL_BASE_UNIT / 2,
            total_cost: A2AMPL_BASE_UNIT + A2AMPL_BASE_UNIT / 2,
            effective_priority_multiplier: 150,
        };
        
        let a2ampl_estimate = estimate.to_a2ampl();
        assert_eq!(a2ampl_estimate.service_fee, 1.0);
        assert_eq!(a2ampl_estimate.compute_cost, 0.5);
        assert_eq!(a2ampl_estimate.total_cost, 1.5);
        assert_eq!(a2ampl_estimate.effective_priority_multiplier, 150);
    }
    
    #[test]
    fn test_pyg_client_creation() {
        let client = PygPaymentClient::new("https://api.devnet.solana.com");
        assert_eq!(client.token_program_id, spl_token::id());
    }
}