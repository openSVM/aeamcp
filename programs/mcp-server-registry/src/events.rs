//! Event definitions for the MCP Server Registry program

use solana_program::{pubkey::Pubkey, msg};
use aeamcp_common::serialization::{
    McpToolDefinitionOnChain, McpResourceDefinitionOnChain, McpPromptDefinitionOnChain
};

/// Event emitted when an MCP server is registered
#[derive(Debug, Clone)]
pub struct McpServerRegistered {
    /// Schema version of this entry (e.g., 1)
    pub registry_version: u8,
    /// Solana public key of the entry's owner/manager
    pub owner_authority: Pubkey,
    /// Unique identifier for the MCP server
    pub server_id: String,
    /// Human-readable server name
    pub name: String,
    /// Version of the MCP server software
    pub server_version: String,
    /// Primary URL for MCP communication
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

/// Event emitted when MCP server details are updated
#[derive(Debug, Clone)]
pub struct McpServerUpdated {
    /// Unique identifier for the MCP server
    pub server_id: String,
    /// List of field names that were updated
    pub changed_fields: Vec<String>,
    /// Timestamp of the update
    pub last_update_timestamp: i64,
}

/// Event emitted when MCP server status changes
#[derive(Debug, Clone)]
pub struct McpServerStatusChanged {
    /// Unique identifier for the MCP server
    pub server_id: String,
    /// New status value
    pub new_status: u8,
    /// Timestamp of the status change
    pub last_update_timestamp: i64,
}

/// Event emitted when an MCP server is deregistered
#[derive(Debug, Clone)]
pub struct McpServerDeregistered {
    /// Unique identifier for the MCP server
    pub server_id: String,
    /// Timestamp of deregistration
    pub deregistration_timestamp: i64,
}

/// Helper function to create and log a McpServerRegistered event
pub fn create_server_registered_event(
    registry_version: u8,
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
    status: u8,
    registration_timestamp: i64,
    last_update_timestamp: i64,
    full_capabilities_uri: Option<String>,
    tags: Vec<String>,
) -> McpServerRegistered {
    let event = McpServerRegistered {
        registry_version,
        owner_authority,
        server_id: server_id.clone(),
        name: name.clone(),
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
        status,
        registration_timestamp,
        last_update_timestamp,
        full_capabilities_uri,
        tags,
    };

    // Log event
    msg!("EVENT: McpServerRegistered server_id={} name={} owner={}", 
         server_id, name, owner_authority);

    event
}

/// Helper function to create and log a McpServerUpdated event
pub fn create_server_updated_event(
    server_id: String,
    changed_fields: Vec<String>,
    last_update_timestamp: i64,
) -> McpServerUpdated {
    let event = McpServerUpdated {
        server_id: server_id.clone(),
        changed_fields: changed_fields.clone(),
        last_update_timestamp,
    };

    // Log event
    msg!("EVENT: McpServerUpdated server_id={} fields={:?}", server_id, changed_fields);

    event
}

/// Helper function to create and log a McpServerStatusChanged event
pub fn create_server_status_changed_event(
    server_id: String,
    new_status: u8,
    last_update_timestamp: i64,
) -> McpServerStatusChanged {
    let event = McpServerStatusChanged {
        server_id: server_id.clone(),
        new_status,
        last_update_timestamp,
    };

    // Log event
    msg!("EVENT: McpServerStatusChanged server_id={} new_status={}", server_id, new_status);

    event
}

/// Helper function to create and log a McpServerDeregistered event
pub fn create_server_deregistered_event(
    server_id: String,
    deregistration_timestamp: i64,
) -> McpServerDeregistered {
    let event = McpServerDeregistered {
        server_id: server_id.clone(),
        deregistration_timestamp,
    };

    // Log event
    msg!("EVENT: McpServerDeregistered server_id={}", server_id);

    event
}

#[cfg(test)]
mod tests {
    use super::*;

    #[test]
    fn test_create_server_registered_event() {
        let owner = Pubkey::new_unique();
        let timestamp = 1640995200;

        let event = create_server_registered_event(
            1,
            owner,
            "test-server".to_string(),
            "Test Server".to_string(),
            "1.0.0".to_string(),
            "https://example.com/mcp".to_string(),
            Some("https://docs.example.com".to_string()),
            Some("A test server".to_string()),
            true,
            true,
            false,
            vec![],
            vec![],
            vec![],
            0,
            timestamp,
            timestamp,
            Some("https://example.com/capabilities.json".to_string()),
            vec!["test".to_string()],
        );

        assert_eq!(event.registry_version, 1);
        assert_eq!(event.owner_authority, owner);
        assert_eq!(event.server_id, "test-server");
        assert_eq!(event.name, "Test Server");
        assert_eq!(event.server_version, "1.0.0");
        assert_eq!(event.service_endpoint, "https://example.com/mcp");
        assert_eq!(event.documentation_url, Some("https://docs.example.com".to_string()));
        assert_eq!(event.server_capabilities_summary, Some("A test server".to_string()));
        assert!(event.supports_resources);
        assert!(event.supports_tools);
        assert!(!event.supports_prompts);
        assert_eq!(event.status, 0);
        assert_eq!(event.registration_timestamp, timestamp);
        assert_eq!(event.last_update_timestamp, timestamp);
        assert_eq!(event.full_capabilities_uri, Some("https://example.com/capabilities.json".to_string()));
        assert_eq!(event.tags, vec!["test"]);
    }

    #[test]
    fn test_create_server_updated_event() {
        let event = create_server_updated_event(
            "test-server".to_string(),
            vec!["name".to_string(), "version".to_string()],
            1640995200,
        );

        assert_eq!(event.server_id, "test-server");
        assert_eq!(event.changed_fields, vec!["name", "version"]);
        assert_eq!(event.last_update_timestamp, 1640995200);
    }

    #[test]
    fn test_create_server_status_changed_event() {
        let event = create_server_status_changed_event(
            "test-server".to_string(),
            1,
            1640995200,
        );

        assert_eq!(event.server_id, "test-server");
        assert_eq!(event.new_status, 1);
        assert_eq!(event.last_update_timestamp, 1640995200);
    }

    #[test]
    fn test_create_server_deregistered_event() {
        let event = create_server_deregistered_event(
            "test-server".to_string(),
            1640995200,
        );

        assert_eq!(event.server_id, "test-server");
        assert_eq!(event.deregistration_timestamp, 1640995200);
    }
}