//! RPC client wrapper for Solana AI Registries
//! 
//! This module provides a high-level client interface for interacting
//! with the Agent Registry and MCP Server Registry programs.

use solana_client::rpc_client::RpcClient;
use solana_sdk::{
    commitment_config::CommitmentConfig,
    pubkey::Pubkey,
    signature::{Signature, Signer},
    transaction::Transaction,
};
use std::str::FromStr;
use crate::errors::{SdkError, SdkResult};
use crate::agent::{AgentArgs, AgentPatch, AgentEntry};
use crate::mcp::{McpServerArgs, McpServerPatch, McpServerEntry};

/// Program IDs for the registries (placeholders for testing)
pub const AGENT_REGISTRY_PROGRAM_ID: &str = "11111111111111111111111111111111";
pub const MCP_SERVER_REGISTRY_PROGRAM_ID: &str = "11111111111111111111111111111112";

/// Main client for interacting with Solana AI Registries
pub struct SolanaAiRegistriesClient {
    rpc_client: RpcClient,
    agent_registry_program_id: Pubkey,
    mcp_server_registry_program_id: Pubkey,
    commitment: CommitmentConfig,
}

impl SolanaAiRegistriesClient {
    /// Create a new client with the specified RPC endpoint
    pub fn new(rpc_url: &str) -> Self {
        Self::new_with_commitment(rpc_url, CommitmentConfig::confirmed())
    }
    
    /// Create a new client with custom commitment level
    pub fn new_with_commitment(rpc_url: &str, commitment: CommitmentConfig) -> Self {
        let rpc_client = RpcClient::new_with_commitment(rpc_url.to_string(), commitment);
        
        Self {
            rpc_client,
            agent_registry_program_id: Pubkey::from_str(AGENT_REGISTRY_PROGRAM_ID)
                .expect("Invalid agent registry program ID"),
            mcp_server_registry_program_id: Pubkey::from_str(MCP_SERVER_REGISTRY_PROGRAM_ID)
                .expect("Invalid MCP server registry program ID"),
            commitment,
        }
    }
    
    /// Get the underlying RPC client
    pub fn rpc_client(&self) -> &RpcClient {
        &self.rpc_client
    }
    
    /// Get the agent registry program ID
    pub fn agent_registry_program_id(&self) -> &Pubkey {
        &self.agent_registry_program_id
    }
    
    /// Get the MCP server registry program ID  
    pub fn mcp_server_registry_program_id(&self) -> &Pubkey {
        &self.mcp_server_registry_program_id
    }
    
    /// Register a new agent
    pub async fn register_agent<S: Signer>(
        &self,
        signer: &S,
        args: AgentArgs,
    ) -> SdkResult<Signature> {
        let instruction = crate::agent::create_register_agent_instruction(
            &self.agent_registry_program_id,
            &signer.pubkey(),
            args,
        )?;
        
        self.send_and_confirm_transaction(signer, vec![instruction]).await
    }
    
    /// Update an existing agent
    pub async fn update_agent<S: Signer>(
        &self,
        signer: &S,
        agent_id: &str,
        patch: AgentPatch,
    ) -> SdkResult<Signature> {
        let instruction = crate::agent::create_update_agent_instruction(
            &self.agent_registry_program_id,
            &signer.pubkey(),
            agent_id,
            patch,
        )?;
        
        self.send_and_confirm_transaction(signer, vec![instruction]).await
    }
    
    /// Update agent status
    pub async fn update_agent_status<S: Signer>(
        &self,
        signer: &S,
        agent_id: &str,
        status: u8,
    ) -> SdkResult<Signature> {
        let instruction = crate::agent::create_update_agent_status_instruction(
            &self.agent_registry_program_id,
            &signer.pubkey(),
            agent_id,
            status,
        )?;
        
        self.send_and_confirm_transaction(signer, vec![instruction]).await
    }
    
    /// Deregister an agent
    pub async fn deregister_agent<S: Signer>(
        &self,
        signer: &S,
        agent_id: &str,
    ) -> SdkResult<Signature> {
        let instruction = crate::agent::create_deregister_agent_instruction(
            &self.agent_registry_program_id,
            &signer.pubkey(),
            agent_id,
        )?;
        
        self.send_and_confirm_transaction(signer, vec![instruction]).await
    }
    
    /// Get an agent entry by ID
    pub async fn get_agent(&self, owner: &Pubkey, agent_id: &str) -> SdkResult<Option<AgentEntry>> {
        let agent_pda = crate::agent::derive_agent_pda(&self.agent_registry_program_id, owner, agent_id)?;
        
        match self.rpc_client.get_account(&agent_pda) {
            Ok(account) => {
                let entry = AgentEntry::try_from_account_data(&account.data)?;
                Ok(Some(entry))
            }
            Err(solana_client::client_error::ClientError {
                kind: solana_client::client_error::ClientErrorKind::RpcError(
                    solana_client::rpc_request::RpcError::RpcResponseError { .. }
                ),
                ..
            }) => Ok(None), // Account not found
            Err(e) => Err(SdkError::ClientError(e)),
        }
    }
    
    /// Register a new MCP server
    pub async fn register_mcp_server<S: Signer>(
        &self,
        signer: &S,
        args: McpServerArgs,
    ) -> SdkResult<Signature> {
        let instruction = crate::mcp::create_register_mcp_server_instruction(
            &self.mcp_server_registry_program_id,
            &signer.pubkey(),
            args,
        )?;
        
        self.send_and_confirm_transaction(signer, vec![instruction]).await
    }
    
    /// Update an existing MCP server
    pub async fn update_mcp_server<S: Signer>(
        &self,
        signer: &S,
        server_id: &str,
        patch: McpServerPatch,
    ) -> SdkResult<Signature> {
        let instruction = crate::mcp::create_update_mcp_server_instruction(
            &self.mcp_server_registry_program_id,
            &signer.pubkey(),
            server_id,
            patch,
        )?;
        
        self.send_and_confirm_transaction(signer, vec![instruction]).await
    }
    
    /// Update MCP server status
    pub async fn update_mcp_server_status<S: Signer>(
        &self,
        signer: &S,
        server_id: &str,
        status: u8,
    ) -> SdkResult<Signature> {
        let instruction = crate::mcp::create_update_mcp_server_status_instruction(
            &self.mcp_server_registry_program_id,
            &signer.pubkey(),
            server_id,
            status,
        )?;
        
        self.send_and_confirm_transaction(signer, vec![instruction]).await
    }
    
    /// Deregister an MCP server
    pub async fn deregister_mcp_server<S: Signer>(
        &self,
        signer: &S,
        server_id: &str,
    ) -> SdkResult<Signature> {
        let instruction = crate::mcp::create_deregister_mcp_server_instruction(
            &self.mcp_server_registry_program_id,
            &signer.pubkey(),
            server_id,
        )?;
        
        self.send_and_confirm_transaction(signer, vec![instruction]).await
    }
    
    /// Get an MCP server entry by ID
    pub async fn get_mcp_server(&self, owner: &Pubkey, server_id: &str) -> SdkResult<Option<McpServerEntry>> {
        let server_pda = crate::mcp::derive_mcp_server_pda(&self.mcp_server_registry_program_id, owner, server_id)?;
        
        match self.rpc_client.get_account(&server_pda) {
            Ok(account) => {
                let entry = McpServerEntry::try_from_account_data(&account.data)?;
                Ok(Some(entry))
            }
            Err(solana_client::client_error::ClientError {
                kind: solana_client::client_error::ClientErrorKind::RpcError(
                    solana_client::rpc_request::RpcError::RpcResponseError { .. }
                ),
                ..
            }) => Ok(None), // Account not found
            Err(e) => Err(SdkError::ClientError(e)),
        }
    }
    
    /// Check if an account exists
    pub async fn account_exists(&self, pubkey: &Pubkey) -> SdkResult<bool> {
        match self.rpc_client.get_account(pubkey) {
            Ok(_) => Ok(true),
            Err(solana_client::client_error::ClientError {
                kind: solana_client::client_error::ClientErrorKind::RpcError(
                    solana_client::rpc_request::RpcError::RpcResponseError { .. }
                ),
                ..
            }) => Ok(false),
            Err(e) => Err(SdkError::ClientError(e)),
        }
    }
    
    /// Get account balance in lamports
    pub async fn get_balance(&self, pubkey: &Pubkey) -> SdkResult<u64> {
        self.rpc_client
            .get_balance(pubkey)
            .map_err(SdkError::ClientError)
    }
    
    /// Send and confirm a transaction
    async fn send_and_confirm_transaction<S: Signer>(
        &self,
        signer: &S,
        instructions: Vec<solana_sdk::instruction::Instruction>,
    ) -> SdkResult<Signature> {
        // Get recent blockhash
        let recent_blockhash = self.rpc_client
            .get_latest_blockhash()
            .map_err(SdkError::ClientError)?;
            
        // Create transaction
        let transaction = Transaction::new_signed_with_payer(
            &instructions,
            Some(&signer.pubkey()),
            &[signer],
            recent_blockhash,
        );
        
        // Send and confirm transaction
        self.rpc_client
            .send_and_confirm_transaction_with_spinner(&transaction)
            .map_err(SdkError::ClientError)
    }
    
    /// Get the minimum rent exemption for an account of the given size
    pub async fn get_minimum_rent_exemption(&self, size: usize) -> SdkResult<u64> {
        self.rpc_client
            .get_minimum_balance_for_rent_exemption(size)
            .map_err(SdkError::ClientError)
    }
}

impl Default for SolanaAiRegistriesClient {
    fn default() -> Self {
        Self::new("https://api.devnet.solana.com")
    }
}

#[cfg(test)]
mod tests {
    use super::*;
    use solana_sdk::signer::keypair::Keypair;

    #[test]
    fn test_client_creation() {
        let client = SolanaAiRegistriesClient::new("https://api.devnet.solana.com");
        assert_eq!(client.commitment, CommitmentConfig::confirmed());
    }
    
    #[test]
    fn test_client_with_commitment() {
        let client = SolanaAiRegistriesClient::new_with_commitment(
            "https://api.devnet.solana.com",
            CommitmentConfig::finalized()
        );
        assert_eq!(client.commitment, CommitmentConfig::finalized());
    }
    
    #[test]
    fn test_program_ids() {
        let client = SolanaAiRegistriesClient::default();
        
        // Verify program IDs are valid
        assert_ne!(client.agent_registry_program_id(), &Pubkey::default());
        assert_ne!(client.mcp_server_registry_program_id(), &Pubkey::default());
    }
}