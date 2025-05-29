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
    
    // Token-related fields for Phase 1
    /// SVMAI Token mint address
    pub token_mint: Pubkey,
    /// SVMAI staked for verification
    pub verification_stake: u64,
    /// When tokens were staked
    pub staking_timestamp: i64,
    /// Lock period end
    pub stake_locked_until: i64,
    /// Verification tier (0: Basic, 1: Verified, 2: Premium)
    pub verification_tier: u8,
    /// Total tool invocations
    pub total_tool_calls: u64,
    /// Total resource fetches
    pub total_resource_accesses: u64,
    /// Total prompt executions
    pub total_prompt_uses: u64,
    /// Total SVMAI earned
    pub total_fees_collected: u64,
    /// Server quality metric (0-10000)
    pub quality_score: u64,
    /// Last 30 days uptime (0-100)
    pub uptime_percentage: u8,
    /// Average response time in ms
    pub avg_response_time: u32,
    /// Error percentage (0-100)
    pub error_rate: u8,
    /// Base fee per tool call
    pub tool_base_fee: u64,
    /// Base fee per resource access
    pub resource_base_fee: u64,
    /// Base fee per prompt use
    pub prompt_base_fee: u64,
    /// Number of calls for discount
    pub bulk_discount_threshold: u32,
    /// Discount percentage (0-50)
    pub bulk_discount_percentage: u8,
    /// Amount paid for registration
    pub registration_fee_paid: u64,
    /// Timestamp of last fee collection
    pub last_fee_collection: i64,
    /// Uncollected fees
    pub pending_fees: u64,
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
        + 4 + (MAX_SERVER_TAGS * (4 + MAX_SERVER_TAG_LEN)) // tags
        // Token-related fields
        + 32 // token_mint
        + 8  // verification_stake
        + 8  // staking_timestamp
        + 8  // stake_locked_until
        + 1  // verification_tier
        + 8  // total_tool_calls
        + 8  // total_resource_accesses
        + 8  // total_prompt_uses
        + 8  // total_fees_collected
        + 8  // quality_score
        + 1  // uptime_percentage
        + 4  // avg_response_time
        + 1  // error_rate
        + 8  // tool_base_fee
        + 8  // resource_base_fee
        + 8  // prompt_base_fee
        + 4  // bulk_discount_threshold
        + 1  // bulk_discount_percentage
        + 8  // registration_fee_paid
        + 8  // last_fee_collection
        + 8; // pending_fees

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
            // Initialize token fields with defaults
            token_mint: Pubkey::default(),
            verification_stake: 0,
            staking_timestamp: 0,
            stake_locked_until: 0,
            verification_tier: 0,
            total_tool_calls: 0,
            total_resource_accesses: 0,
            total_prompt_uses: 0,
            total_fees_collected: 0,
            quality_score: 0,
            uptime_percentage: 0,
            avg_response_time: 0,
            error_rate: 0,
            tool_base_fee: 0,
            resource_base_fee: 0,
            prompt_base_fee: 0,
            bulk_discount_threshold: 0,
            bulk_discount_percentage: 0,
            registration_fee_paid: 0,
            last_fee_collection: 0,
            pending_fees: 0,
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
    
    /// Update verification staking
    pub fn update_verification_stake(
        &mut self,
        amount: u64,
        tier: u8,
        lock_until: i64,
        timestamp: i64,
    ) {
        self.verification_stake = amount;
        self.verification_tier = tier;
        self.stake_locked_until = lock_until;
        self.staking_timestamp = timestamp;
        self.last_update_timestamp = timestamp;
        self.state_version += 1;
    }
    
    /// Update usage fees
    pub fn update_usage_fees(
        &mut self,
        tool_base_fee: u64,
        resource_base_fee: u64,
        prompt_base_fee: u64,
        bulk_discount_threshold: u32,
        bulk_discount_percentage: u8,
        timestamp: i64,
    ) {
        self.tool_base_fee = tool_base_fee;
        self.resource_base_fee = resource_base_fee;
        self.prompt_base_fee = prompt_base_fee;
        self.bulk_discount_threshold = bulk_discount_threshold;
        self.bulk_discount_percentage = bulk_discount_percentage;
        self.last_fee_collection = timestamp;
        self.last_update_timestamp = timestamp;
        self.state_version += 1;
    }
    
    /// Record usage and update metrics
    pub fn record_usage(
        &mut self,
        usage_type: UsageType,
        count: u32,
        fee_collected: u64,
    ) {
        match usage_type {
            UsageType::Tool => self.total_tool_calls += count as u64,
            UsageType::Resource => self.total_resource_accesses += count as u64,
            UsageType::Prompt => self.total_prompt_uses += count as u64,
        }
        self.pending_fees += fee_collected;
        self.state_version += 1;
    }
    
    /// Withdraw pending fees
    pub fn withdraw_pending_fees(&mut self) -> u64 {
        let fees = self.pending_fees;
        self.pending_fees = 0;
        self.total_fees_collected += fees;
        self.state_version += 1;
        fees
    }
    
    /// Update quality metrics
    pub fn update_quality_metrics(
        &mut self,
        uptime_percentage: u8,
        avg_response_time: u32,
        error_rate: u8,
        quality_score: u64,
    ) {
        self.uptime_percentage = uptime_percentage;
        self.avg_response_time = avg_response_time;
        self.error_rate = error_rate;
        self.quality_score = quality_score;
        self.state_version += 1;
    }
    
    /// Check if stake can be withdrawn
    pub fn can_unstake(&self, current_timestamp: i64) -> bool {
        current_timestamp >= self.stake_locked_until
    }
}

/// Usage type enum for tracking different service calls
#[derive(Debug, Clone, Copy, PartialEq)]
pub enum UsageType {
    Tool,
    Resource,
    Prompt,
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
            // Token fields defaults
            token_mint: Pubkey::default(),
            verification_stake: 0,
            staking_timestamp: 0,
            stake_locked_until: 0,
            verification_tier: 0,
            total_tool_calls: 0,
            total_resource_accesses: 0,
            total_prompt_uses: 0,
            total_fees_collected: 0,
            quality_score: 0,
            uptime_percentage: 0,
            avg_response_time: 0,
            error_rate: 0,
            tool_base_fee: 0,
            resource_base_fee: 0,
            prompt_base_fee: 0,
            bulk_discount_threshold: 0,
            bulk_discount_percentage: 0,
            registration_fee_paid: 0,
            last_fee_collection: 0,
            pending_fees: 0,
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

        let result = entry.touch(new_timestamp, 0);
        assert!(result.is_ok());
        assert_eq!(entry.last_update_timestamp, new_timestamp);
        assert_ne!(entry.last_update_timestamp, initial_timestamp);
        assert_eq!(entry.state_version, 1);
    }
    
    #[test]
    fn test_update_status_with_version() {
        let mut entry = McpServerRegistryEntryV1::default();
        let timestamp = 1640995200;
        
        // Test with correct version
        let result = entry.update_status(McpServerStatus::Active as u8, timestamp, 0);
        assert!(result.is_ok());
        assert_eq!(entry.status, McpServerStatus::Active as u8);
        assert_eq!(entry.state_version, 1);
        
        // Test with wrong version
        let result = entry.update_status(McpServerStatus::Inactive as u8, timestamp + 100, 0);
        assert!(result.is_err());
        assert_eq!(entry.status, McpServerStatus::Active as u8); // Should not change
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