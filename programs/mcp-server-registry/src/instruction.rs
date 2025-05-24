//! Instruction definitions for the MCP Server Registry program

use borsh::{BorshDeserialize, BorshSerialize};
use solana_program::program_error::ProgramError;
use aeamcp_common::serialization::{McpToolDefinitionOnChainInput, McpResourceDefinitionOnChainInput, McpPromptDefinitionOnChainInput};

/// Instructions supported by the MCP Server Registry program
#[derive(BorshSerialize, BorshDeserialize, Debug, Clone)]
pub enum McpServerRegistryInstruction {
    /// Register a new MCP server
    ///
    /// Accounts expected:
    /// 0. `[writable]` MCP server entry account (PDA)
    /// 1. `[signer]` Owner authority
    /// 2. `[signer, writable]` Payer account
    /// 3. `[]` System program
    RegisterMcpServer {
        /// Unique identifier for the MCP server
        server_id: String,
        /// Human-readable server name
        name: String,
        /// Version of the MCP server software
        server_version: String,
        /// Primary URL for MCP communication
        service_endpoint: String,
        /// Optional URL to human-readable documentation
        documentation_url: Option<String>,
        /// Optional brief summary of server offerings
        server_capabilities_summary: Option<String>,
        /// Whether server offers MCP Resources
        supports_resources: bool,
        /// Whether server offers MCP Tools
        supports_tools: bool,
        /// Whether server offers MCP Prompts
        supports_prompts: bool,
        /// Summary of key on-chain advertised tools
        onchain_tool_definitions: Vec<McpToolDefinitionOnChainInput>,
        /// Summary of key on-chain advertised resources
        onchain_resource_definitions: Vec<McpResourceDefinitionOnChainInput>,
        /// Summary of key on-chain advertised prompts
        onchain_prompt_definitions: Vec<McpPromptDefinitionOnChainInput>,
        /// Optional URI to off-chain JSON with full tool/resource/prompt definitions
        full_capabilities_uri: Option<String>,
        /// General discoverability tags for the server
        tags: Vec<String>,
    },

    /// Update details of an existing MCP server
    ///
    /// Accounts expected:
    /// 0. `[writable]` MCP server entry account (PDA)
    /// 1. `[signer]` Owner authority
    UpdateMcpServerDetails {
        /// Update details input
        details: McpServerUpdateDetailsInput,
    },

    /// Update the status of an existing MCP server
    ///
    /// Accounts expected:
    /// 0. `[writable]` MCP server entry account (PDA)
    /// 1. `[signer]` Owner authority
    UpdateMcpServerStatus {
        /// New status value (0: Pending, 1: Active, 2: Inactive, 3: Deregistered)
        new_status: u8,
    },

    /// Deregister an MCP server
    ///
    /// Accounts expected:
    /// 0. `[writable]` MCP server entry account (PDA)
    /// 1. `[signer]` Owner authority
    DeregisterMcpServer,
}

/// Input struct for updating MCP server details
#[derive(BorshSerialize, BorshDeserialize, Debug, Clone, Default)]
pub struct McpServerUpdateDetailsInput {
    /// New server name (if provided)
    pub name: Option<String>,
    /// New server version (if provided)
    pub server_version: Option<String>,
    /// New service endpoint (if provided)
    pub service_endpoint: Option<String>,
    /// New documentation URL (if provided)
    pub documentation_url: Option<String>,
    /// Whether to clear the documentation_url field
    pub clear_documentation_url: Option<bool>,
    /// New server capabilities summary (if provided)
    pub server_capabilities_summary: Option<String>,
    /// Whether to clear the server_capabilities_summary field
    pub clear_server_capabilities_summary: Option<bool>,
    /// New supports_resources flag (if provided)
    pub supports_resources: Option<bool>,
    /// New supports_tools flag (if provided)
    pub supports_tools: Option<bool>,
    /// New supports_prompts flag (if provided)
    pub supports_prompts: Option<bool>,
    /// New on-chain tool definitions (if provided)
    pub onchain_tool_definitions: Option<Vec<McpToolDefinitionOnChainInput>>,
    /// New on-chain resource definitions (if provided)
    pub onchain_resource_definitions: Option<Vec<McpResourceDefinitionOnChainInput>>,
    /// New on-chain prompt definitions (if provided)
    pub onchain_prompt_definitions: Option<Vec<McpPromptDefinitionOnChainInput>>,
    /// New full capabilities URI (if provided)
    pub full_capabilities_uri: Option<String>,
    /// Whether to clear the full_capabilities_uri field
    pub clear_full_capabilities_uri: Option<bool>,
    /// New tags (if provided)
    pub tags: Option<Vec<String>>,
}

impl McpServerRegistryInstruction {
    /// Pack instruction data
    pub fn pack(&self) -> Vec<u8> {
        self.try_to_vec().expect("Failed to serialize instruction")
    }

    /// Unpack instruction data
    pub fn unpack(input: &[u8]) -> Result<Self, ProgramError> {
        Self::try_from_slice(input).map_err(|_| ProgramError::InvalidInstructionData)
    }
}

#[cfg(test)]
mod tests {
    use super::*;

    #[test]
    fn test_instruction_serialization() {
        let instruction = McpServerRegistryInstruction::RegisterMcpServer {
            server_id: "test-server".to_string(),
            name: "Test Server".to_string(),
            server_version: "1.0.0".to_string(),
            service_endpoint: "https://example.com/mcp".to_string(),
            documentation_url: None,
            server_capabilities_summary: None,
            supports_resources: true,
            supports_tools: true,
            supports_prompts: false,
            onchain_tool_definitions: vec![],
            onchain_resource_definitions: vec![],
            onchain_prompt_definitions: vec![],
            full_capabilities_uri: None,
            tags: vec!["test".to_string()],
        };

        let packed = instruction.pack();
        let unpacked = McpServerRegistryInstruction::unpack(&packed).unwrap();

        match unpacked {
            McpServerRegistryInstruction::RegisterMcpServer { server_id, name, .. } => {
                assert_eq!(server_id, "test-server");
                assert_eq!(name, "Test Server");
            }
            _ => panic!("Wrong instruction type"),
        }
    }

    #[test]
    fn test_update_details_default() {
        let details = McpServerUpdateDetailsInput::default();
        assert!(details.name.is_none());
        assert!(details.server_version.is_none());
        assert!(details.clear_documentation_url.is_none());
    }

    #[test]
    fn test_update_status_instruction() {
        let instruction = McpServerRegistryInstruction::UpdateMcpServerStatus { new_status: 1 };
        let packed = instruction.pack();
        let unpacked = McpServerRegistryInstruction::unpack(&packed).unwrap();

        match unpacked {
            McpServerRegistryInstruction::UpdateMcpServerStatus { new_status } => {
                assert_eq!(new_status, 1);
            }
            _ => panic!("Wrong instruction type"),
        }
    }

    #[test]
    fn test_deregister_instruction() {
        let instruction = McpServerRegistryInstruction::DeregisterMcpServer;
        let packed = instruction.pack();
        let unpacked = McpServerRegistryInstruction::unpack(&packed).unwrap();

        match unpacked {
            McpServerRegistryInstruction::DeregisterMcpServer => {}
            _ => panic!("Wrong instruction type"),
        }
    }
}