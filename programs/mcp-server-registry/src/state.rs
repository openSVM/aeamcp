//! State definitions for the MCP Server Registry program

use borsh::{BorshDeserialize, BorshSerialize};
use solana_program::pubkey::Pubkey;
use aeamcp_common::{
    constants::*,
    serialization::{McpToolDefinitionOnChain, McpResourceDefinitionOnChain, McpPromptDefinitionOnChain},
    McpServerStatus,
};

/// MCP Server Registry Entry (V1) - Solana account structure for storing MCP server data on-chain
///
/// This structure represents the on-chain data for a registered Model Context Protocol (MCP) server,
/// using a hybrid approach similar to the Agent Registry:
/// - Core server information is stored on-chain
/// - A limited number of key tools, resources, and prompts are summarized on-chain
/// - Full definitions are accessible via the full_capabilities_uri, pointing to off-chain storage
#[derive(BorshSerialize, BorshDeserialize, Debug, Clone, PartialEq)]
pub struct McpServerRegistryEntryV1 {
    /// Bump seed used for this PDA's derivation
    pub bump: u8,
    /// Schema version of this entry (e.g., 1)
    pub registry_version: u8,
    /// State version for optimistic locking (prevents race conditions)
    pub state_version: u64,
    /// Operation guard to prevent reentrancy
    pub operation_in_progress: bool,
    /// Solana public key of the entry's owner/manager
    pub owner_authority: Pubkey,
    /// Unique identifier for the MCP server
    pub server_id: String,
    /// Human-readable server name
    pub name: String,
    /// Version of the MCP server software
    pub server_version: String,
    /// Primary URL for MCP communication (HTTP/SSE)
    pub service_endpoint: String,
    /// Optional URL to human-readable documentation
    pub documentation_url: Option<String>,
    /// Optional brief summary of server offerings
    pub server_capabilities_summary: Option<String>,
    /// Whether server offers MCP Resources
    pub supports_resources: bool,
    /// Whether server offers MCP Tools
    pub supports_tools: bool,
    /// Whether server offers MCP Prompts
    pub supports_prompts: bool,
    /// Summary of key on-chain advertised tools
    pub onchain_tool_definitions: Vec<McpToolDefinitionOnChain>,
    /// Summary of key on-chain advertised resources
    pub onchain_resource_definitions: Vec<McpResourceDefinitionOnChain>,
    /// Summary of key on-chain advertised prompts
    pub onchain_prompt_definitions: Vec<McpPromptDefinitionOnChain>,
    /// Server status (0:Pending, 1:Active, 2:Inactive, 3:Deregistered)
    pub status: u8,
    /// Timestamp of initial registration
    pub registration_timestamp: i64,
    /// Timestamp of the last update
    pub last_update_timestamp: i64,
    /// Optional URI to off-chain JSON with full tool/resource/prompt definitions
    pub full_capabilities_uri: Option<String>,
    /// General discoverability tags for the server
    pub tags: Vec<String>,
}

impl McpServerRegistryEntryV1 {
    /// Calculate the space required for this account
    pub const SPACE: usize = 8 // Anchor discriminator
        + 1  // bump
        + 1  // registry_version
        + 8  // state_version
        + 1  // operation_in_progress
        + 32 // owner_authority
        + 4 + MAX_SERVER_ID_LEN // server_id
        + 4 + MAX_SERVER_NAME_LEN // name
        + 4 + MAX_SERVER_VERSION_LEN // server_version
        + 4 + MAX_SERVER_ENDPOINT_URL_LEN // service_endpoint
        + 1 + 4 + MAX_DOCUMENTATION_URL_LEN // documentation_url (Option)
        + 1 + 4 + MAX_SERVER_CAPABILITIES_SUMMARY_LEN // server_capabilities_summary (Option)
        + 1  // supports_resources
        + 1  // supports_tools
        + 1  // supports_prompts
        + 4 + (MAX_ONCHAIN_TOOL_DEFINITIONS * McpToolDefinitionOnChain::SPACE) // onchain_tool_definitions
        + 4 + (MAX_ONCHAIN_RESOURCE_DEFINITIONS * McpResourceDefinitionOnChain::SPACE) // onchain_resource_definitions
        + 4 + (MAX_ONCHAIN_PROMPT_DEFINITIONS * McpPromptDefinitionOnChain::SPACE) // onchain_prompt_definitions
        + 1  // status
        + 8  // registration_timestamp
        + 8  // last_update_timestamp
        + 1 + 4 + MAX_FULL_CAPABILITIES_URI_LEN // full_capabilities_uri (Option)
        + 4 + (MAX_SERVER_TAGS * (4 + MAX_SERVER_TAG_LEN)); // tags

    /// Create a new MCP server registry entry
    pub fn new(
        bump: u8,
        owner_authority: Pubkey,
        server_id: String,
        name: String,
        server_version: String,
        service_endpoint: String,
        documentation_url: Option<String>,
        server_capabilities_summary: Option<String>,
        supports_resources: bool,
        supports_tools: bool,
        supports_prompts: bool,
        onchain_tool_definitions: Vec<McpToolDefinitionOnChain>,
        onchain_resource_definitions: Vec<McpResourceDefinitionOnChain>,
        onchain_prompt_definitions: Vec<McpPromptDefinitionOnChain>,
        full_capabilities_uri: Option<String>,
        tags: Vec<String>,
        timestamp: i64,
    ) -> Self {
        Self {
            bump,
            registry_version: 1,
            state_version: 0,
            operation_in_progress: false,
            owner_authority,
            server_id,
            name,
            server_version,
            service_endpoint,
            documentation_url,
            server_capabilities_summary,
            supports_resources,
            supports_tools,
            supports_prompts,
            onchain_tool_definitions,
            onchain_resource_definitions,
            onchain_prompt_definitions,
            status: McpServerStatus::Pending as u8,
            registration_timestamp: timestamp,
            last_update_timestamp: timestamp,
            full_capabilities_uri,
            tags,
        }
    }

    /// Get the current status as an enum
    pub fn get_status(&self) -> Option<McpServerStatus> {
        McpServerStatus::from_u8(self.status)
    }

    /// Set the status from an enum
    pub fn set_status(&mut self, status: McpServerStatus) {
        self.status = status as u8;
    }

    /// Check if the server is active
    pub fn is_active(&self) -> bool {
        self.status == McpServerStatus::Active as u8
    }

    /// Check if the server is deregistered
    pub fn is_deregistered(&self) -> bool {
        self.status == McpServerStatus::Deregistered as u8
    }

    /// Update the last update timestamp with version check
    pub fn touch(&mut self, timestamp: i64, expected_version: u64) -> Result<(), aeamcp_common::error::RegistryError> {
        if self.state_version != expected_version {
            return Err(aeamcp_common::error::RegistryError::StateVersionMismatch);
        }
        self.last_update_timestamp = timestamp;
        self.state_version += 1;
        Ok(())
    }

    /// Begin an operation (reentrancy guard)
    pub fn begin_operation(&mut self) -> Result<(), aeamcp_common::error::RegistryError> {
        if self.operation_in_progress {
            return Err(aeamcp_common::error::RegistryError::OperationInProgress);
        }
        self.operation_in_progress = true;
        Ok(())
    }

    /// End an operation (reentrancy guard)
    pub fn end_operation(&mut self) {
        self.operation_in_progress = false;
    }

    /// Atomic update with version checking
    pub fn atomic_update<F>(&mut self, expected_version: u64, update_fn: F) -> Result<(), aeamcp_common::error::RegistryError>
    where
        F: FnOnce(&mut Self) -> Result<(), aeamcp_common::error::RegistryError>
    {
        if self.state_version != expected_version {
            return Err(aeamcp_common::error::RegistryError::StateVersionMismatch);
        }
        self.begin_operation()?;
        
        let result = update_fn(self);
        
        if result.is_ok() {
            self.state_version += 1;
        }
        self.end_operation();
        result
    }

    /// Update status with version checking
    pub fn update_status(&mut self, status: u8, timestamp: i64, expected_version: u64) -> Result<(), aeamcp_common::error::RegistryError> {
        if self.state_version != expected_version {
            return Err(aeamcp_common::error::RegistryError::StateVersionMismatch);
        }
        self.status = status;
        self.last_update_timestamp = timestamp;
        self.state_version += 1;
        Ok(())
    }

    /// Get the number of tools defined on-chain
    pub fn tool_count(&self) -> usize {
        self.onchain_tool_definitions.len()
    }

    /// Get the number of resources defined on-chain
    pub fn resource_count(&self) -> usize {
        self.onchain_resource_definitions.len()
    }

    /// Get the number of prompts defined on-chain
    pub fn prompt_count(&self) -> usize {
        self.onchain_prompt_definitions.len()
    }

    /// Check if the server supports any capabilities
    pub fn has_capabilities(&self) -> bool {
        self.supports_resources || self.supports_tools || self.supports_prompts
    }

    /// Get a summary of supported capabilities
    pub fn capability_summary(&self) -> String {
        let mut capabilities = Vec::new();
        if self.supports_resources {
            capabilities.push("Resources");
        }
        if self.supports_tools {
            capabilities.push("Tools");
        }
        if self.supports_prompts {
            capabilities.push("Prompts");
        }
        capabilities.join(", ")
    }
}

impl Default for McpServerRegistryEntryV1 {
    fn default() -> Self {
        Self {
            bump: 0,
            registry_version: 1,
            state_version: 0,
            operation_in_progress: false,
            owner_authority: Pubkey::default(),
            server_id: String::new(),
            name: String::new(),
            server_version: String::new(),
            service_endpoint: String::new(),
            documentation_url: None,
            server_capabilities_summary: None,
            supports_resources: false,
            supports_tools: false,
            supports_prompts: false,
            onchain_tool_definitions: Vec::new(),
            onchain_resource_definitions: Vec::new(),
            onchain_prompt_definitions: Vec::new(),
            status: McpServerStatus::Pending as u8,
            registration_timestamp: 0,
            last_update_timestamp: 0,
            full_capabilities_uri: None,
            tags: Vec::new(),
        }
    }
}

#[cfg(test)]
mod tests {
    use super::*;
    use aeamcp_common::serialization::{
        McpToolDefinitionOnChainInput, McpResourceDefinitionOnChainInput, McpPromptDefinitionOnChainInput
    };

    #[test]
    fn test_mcp_server_entry_creation() {
        let owner = Pubkey::new_unique();
        let timestamp = 1640995200; // 2022-01-01

        let entry = McpServerRegistryEntryV1::new(
            255,
            owner,
            "test-server".to_string(),
            "Test Server".to_string(),
            "1.0.0".to_string(),
            "https://example.com/mcp".to_string(),
            Some("https://docs.example.com".to_string()),
            Some("A test MCP server".to_string()),
            true,
            true,
            false,
            vec![],
            vec![],
            vec![],
            Some("https://example.com/capabilities.json".to_string()),
            vec!["test".to_string(), "example".to_string()],
            timestamp,
        );

        assert_eq!(entry.bump, 255);
        assert_eq!(entry.registry_version, 1);
        assert_eq!(entry.owner_authority, owner);
        assert_eq!(entry.server_id, "test-server");
        assert_eq!(entry.name, "Test Server");
        assert_eq!(entry.server_version, "1.0.0");
        assert_eq!(entry.service_endpoint, "https://example.com/mcp");
        assert_eq!(entry.documentation_url, Some("https://docs.example.com".to_string()));
        assert_eq!(entry.server_capabilities_summary, Some("A test MCP server".to_string()));
        assert!(entry.supports_resources);
        assert!(entry.supports_tools);
        assert!(!entry.supports_prompts);
        assert_eq!(entry.status, McpServerStatus::Pending as u8);
        assert_eq!(entry.registration_timestamp, timestamp);
        assert_eq!(entry.last_update_timestamp, timestamp);
        assert_eq!(entry.full_capabilities_uri, Some("https://example.com/capabilities.json".to_string()));
        assert_eq!(entry.tags, vec!["test", "example"]);
    }

    #[test]
    fn test_status_methods() {
        let mut entry = McpServerRegistryEntryV1::default();

        // Test initial status
        assert_eq!(entry.get_status(), Some(McpServerStatus::Pending));
        assert!(!entry.is_active());
        assert!(!entry.is_deregistered());

        // Test setting active status
        entry.set_status(McpServerStatus::Active);
        assert_eq!(entry.get_status(), Some(McpServerStatus::Active));
        assert!(entry.is_active());
        assert!(!entry.is_deregistered());

        // Test setting deregistered status
        entry.set_status(McpServerStatus::Deregistered);
        assert_eq!(entry.get_status(), Some(McpServerStatus::Deregistered));
        assert!(!entry.is_active());
        assert!(entry.is_deregistered());
    }

    #[test]
    fn test_capability_methods() {
        let mut entry = McpServerRegistryEntryV1::default();

        // Test no capabilities
        assert!(!entry.has_capabilities());
        assert_eq!(entry.capability_summary(), "");

        // Test with resources
        entry.supports_resources = true;
        assert!(entry.has_capabilities());
        assert_eq!(entry.capability_summary(), "Resources");

        // Test with tools and prompts
        entry.supports_tools = true;
        entry.supports_prompts = true;
        assert_eq!(entry.capability_summary(), "Resources, Tools, Prompts");
    }

    #[test]
    fn test_count_methods() {
        let mut entry = McpServerRegistryEntryV1::default();

        assert_eq!(entry.tool_count(), 0);
        assert_eq!(entry.resource_count(), 0);
        assert_eq!(entry.prompt_count(), 0);

        // Add some definitions
        entry.onchain_tool_definitions.push(McpToolDefinitionOnChain {
            name: "test-tool".to_string(),
            description_hash: [0; 32],
            input_schema_hash: [0; 32],
            output_schema_hash: [0; 32],
            tags: vec!["test".to_string()],
        });

        entry.onchain_resource_definitions.push(McpResourceDefinitionOnChain {
            uri_pattern: "test://resource/*".to_string(),
            description_hash: [0; 32],
            tags: vec!["test".to_string()],
        });

        assert_eq!(entry.tool_count(), 1);
        assert_eq!(entry.resource_count(), 1);
        assert_eq!(entry.prompt_count(), 0);
    }

    #[test]
    fn test_touch_method() {
        let mut entry = McpServerRegistryEntryV1::default();
        let initial_timestamp = entry.last_update_timestamp;
        let new_timestamp = 1640995200;

        entry.touch(new_timestamp);
        assert_eq!(entry.last_update_timestamp, new_timestamp);
        assert_ne!(entry.last_update_timestamp, initial_timestamp);
    }

    #[test]
    fn test_serialization() {
        let entry = McpServerRegistryEntryV1::default();
        let serialized = entry.try_to_vec().unwrap();
        let deserialized = McpServerRegistryEntryV1::try_from_slice(&serialized).unwrap();
        assert_eq!(entry, deserialized);
    }

    #[test]
    fn test_space_calculation() {
        // Ensure the SPACE constant is reasonable
        assert!(McpServerRegistryEntryV1::SPACE > 1000);
        assert!(McpServerRegistryEntryV1::SPACE < 10000); // Should be under 10KB
    }
}