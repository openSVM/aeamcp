//! MCP Server Registry SDK module
//!
//! This module provides high-level functions for interacting with the MCP Server Registry,
//! including registration, updates, and queries for Model Context Protocol servers.

use crate::errors::{SdkError, SdkResult};
use borsh::{BorshDeserialize, BorshSerialize};
use solana_sdk::{
    instruction::{AccountMeta, Instruction},
    pubkey::Pubkey,
    system_program,
};

/// Hash size constant
pub const HASH_SIZE: usize = 32;

/// MCP Tool Definition for instruction serialization (matches on-chain format)
#[derive(Debug, Clone, BorshSerialize, BorshDeserialize, PartialEq)]
pub struct McpToolDefinitionOnChainInput {
    pub name: String,
    pub description_hash: [u8; HASH_SIZE],
    pub input_schema_hash: [u8; HASH_SIZE],
    pub output_schema_hash: [u8; HASH_SIZE],
    pub tags: Vec<String>,
}

/// MCP Resource Definition for instruction serialization (matches on-chain format)
#[derive(Debug, Clone, BorshSerialize, BorshDeserialize, PartialEq)]
pub struct McpResourceDefinitionOnChainInput {
    pub uri_pattern: String,
    pub description_hash: [u8; HASH_SIZE],
    pub tags: Vec<String>,
}

/// MCP Prompt Definition for instruction serialization (matches on-chain format)
#[derive(Debug, Clone, BorshSerialize, BorshDeserialize, PartialEq)]
pub struct McpPromptDefinitionOnChainInput {
    pub name: String,
    pub description_hash: [u8; HASH_SIZE],
    pub tags: Vec<String>,
}

/// MCP Server update details input for instruction serialization (matches on-chain format)
#[derive(Debug, Clone, BorshSerialize, BorshDeserialize, PartialEq, Default)]
pub struct McpServerUpdateDetailsInput {
    pub name: Option<String>,
    pub server_version: Option<String>,
    pub service_endpoint: Option<String>,
    pub documentation_url: Option<String>,
    pub clear_documentation_url: Option<bool>,
    pub server_capabilities_summary: Option<String>,
    pub clear_server_capabilities_summary: Option<bool>,
    pub supports_resources: Option<bool>,
    pub supports_tools: Option<bool>,
    pub supports_prompts: Option<bool>,
    pub onchain_tool_definitions: Option<Vec<McpToolDefinitionOnChainInput>>,
    pub onchain_resource_definitions: Option<Vec<McpResourceDefinitionOnChainInput>>,
    pub onchain_prompt_definitions: Option<Vec<McpPromptDefinitionOnChainInput>>,
    pub full_capabilities_uri: Option<String>,
    pub clear_full_capabilities_uri: Option<bool>,
    pub tags: Option<Vec<String>>,
}

/// MCP Server Registry instruction enum (matches on-chain format exactly)
#[derive(Debug, Clone, BorshSerialize, BorshDeserialize, PartialEq)]
pub enum McpServerRegistryInstruction {
    RegisterMcpServer {
        server_id: String,
        name: String,
        server_version: String,
        service_endpoint: String,
        documentation_url: Option<String>,
        server_capabilities_summary: Option<String>,
        supports_resources: bool,
        supports_tools: bool,
        supports_prompts: bool,
        onchain_tool_definitions: Vec<McpToolDefinitionOnChainInput>,
        onchain_resource_definitions: Vec<McpResourceDefinitionOnChainInput>,
        onchain_prompt_definitions: Vec<McpPromptDefinitionOnChainInput>,
        full_capabilities_uri: Option<String>,
        tags: Vec<String>,
    },
    UpdateMcpServerDetails {
        details: McpServerUpdateDetailsInput,
    },
    UpdateMcpServerStatus {
        new_status: u8,
    },
    DeregisterMcpServer,
}

/// Maximum length constants (from the on-chain program)
pub const MAX_SERVER_ID_LEN: usize = 64;
pub const MAX_SERVER_NAME_LEN: usize = 128;
pub const MAX_SERVER_VERSION_LEN: usize = 32;
pub const MAX_SERVICE_ENDPOINT_URL_LEN: usize = 256;
pub const MAX_DOCUMENTATION_URL_LEN: usize = 256;
pub const MAX_SERVER_CAPABILITIES_SUMMARY_LEN: usize = 256;
pub const MAX_ONCHAIN_TOOL_DEFINITIONS: usize = 5;
pub const MAX_TOOL_NAME_LEN: usize = 64;
pub const MAX_TOOL_TAGS: usize = 3;
pub const MAX_TOOL_TAG_LEN: usize = 32;
pub const MAX_ONCHAIN_RESOURCE_DEFINITIONS: usize = 5;
pub const MAX_RESOURCE_URI_PATTERN_LEN: usize = 128;
pub const MAX_RESOURCE_TAGS: usize = 3;
pub const MAX_RESOURCE_TAG_LEN: usize = 32;
pub const MAX_ONCHAIN_PROMPT_DEFINITIONS: usize = 5;
pub const MAX_PROMPT_NAME_LEN: usize = 64;
pub const MAX_PROMPT_TAGS: usize = 3;
pub const MAX_PROMPT_TAG_LEN: usize = 32;
pub const MAX_FULL_CAPABILITIES_URI_LEN: usize = 256;
pub const MAX_SERVER_TAGS: usize = 10;
pub const MAX_SERVER_TAG_LEN: usize = 32;

/// MCP Server status values
#[repr(u8)]
#[derive(Debug, Clone, Copy, PartialEq, Eq, BorshSerialize, BorshDeserialize)]
pub enum McpServerStatus {
    Pending = 0,
    Active = 1,
    Inactive = 2,
    Deregistered = 3,
}

impl McpServerStatus {
    pub fn from_u8(value: u8) -> Option<Self> {
        match value {
            0 => Some(McpServerStatus::Pending),
            1 => Some(McpServerStatus::Active),
            2 => Some(McpServerStatus::Inactive),
            3 => Some(McpServerStatus::Deregistered),
            _ => None,
        }
    }
}

impl Default for McpServerStatus {
    fn default() -> Self {
        McpServerStatus::Pending
    }
}

/// MCP Tool definition for on-chain storage
#[derive(Debug, Clone, PartialEq, Eq, BorshSerialize, BorshDeserialize)]
pub struct McpToolDefinition {
    pub name: String,
    pub tags: Vec<String>,
}

impl McpToolDefinition {
    pub fn new(name: String, tags: Vec<String>) -> SdkResult<Self> {
        if name.is_empty() || name.len() > MAX_TOOL_NAME_LEN {
            return Err(SdkError::InvalidToolNameLength);
        }
        if tags.len() > MAX_TOOL_TAGS {
            return Err(SdkError::TooManyToolTags);
        }
        for tag in &tags {
            if tag.len() > MAX_TOOL_TAG_LEN {
                return Err(SdkError::InvalidToolTagLength);
            }
        }

        Ok(Self { name, tags })
    }
}

/// MCP Resource definition for on-chain storage
#[derive(Debug, Clone, PartialEq, Eq, BorshSerialize, BorshDeserialize)]
pub struct McpResourceDefinition {
    pub uri_pattern: String,
    pub tags: Vec<String>,
}

impl McpResourceDefinition {
    pub fn new(uri_pattern: String, tags: Vec<String>) -> SdkResult<Self> {
        if uri_pattern.len() > MAX_RESOURCE_URI_PATTERN_LEN {
            return Err(SdkError::InvalidResourceUriPatternLength);
        }
        if tags.len() > MAX_RESOURCE_TAGS {
            return Err(SdkError::TooManyResourceTags);
        }
        for tag in &tags {
            if tag.len() > MAX_RESOURCE_TAG_LEN {
                return Err(SdkError::InvalidResourceTagLength);
            }
        }

        Ok(Self { uri_pattern, tags })
    }
}

/// MCP Prompt definition for on-chain storage
#[derive(Debug, Clone, PartialEq, Eq, BorshSerialize, BorshDeserialize)]
pub struct McpPromptDefinition {
    pub name: String,
    pub tags: Vec<String>,
}

impl McpPromptDefinition {
    pub fn new(name: String, tags: Vec<String>) -> SdkResult<Self> {
        if name.is_empty() || name.len() > MAX_PROMPT_NAME_LEN {
            return Err(SdkError::InvalidPromptNameLength);
        }
        if tags.len() > MAX_PROMPT_TAGS {
            return Err(SdkError::TooManyPromptTags);
        }
        for tag in &tags {
            if tag.len() > MAX_PROMPT_TAG_LEN {
                return Err(SdkError::InvalidPromptTagLength);
            }
        }

        Ok(Self { name, tags })
    }
}

/// Conversion functions for instruction serialization
impl From<McpToolDefinition> for McpToolDefinitionOnChainInput {
    fn from(tool: McpToolDefinition) -> Self {
        Self {
            name: tool.name,
            description_hash: [0u8; HASH_SIZE], // SDK doesn't support description hashes yet
            input_schema_hash: [0u8; HASH_SIZE], // SDK doesn't support schema hashes yet
            output_schema_hash: [0u8; HASH_SIZE], // SDK doesn't support schema hashes yet
            tags: tool.tags,
        }
    }
}

impl From<McpResourceDefinition> for McpResourceDefinitionOnChainInput {
    fn from(resource: McpResourceDefinition) -> Self {
        Self {
            uri_pattern: resource.uri_pattern,
            description_hash: [0u8; HASH_SIZE], // SDK doesn't support description hashes yet
            tags: resource.tags,
        }
    }
}

impl From<McpPromptDefinition> for McpPromptDefinitionOnChainInput {
    fn from(prompt: McpPromptDefinition) -> Self {
        Self {
            name: prompt.name,
            description_hash: [0u8; HASH_SIZE], // SDK doesn't support description hashes yet
            tags: prompt.tags,
        }
    }
}

impl From<McpServerPatch> for McpServerUpdateDetailsInput {
    fn from(patch: McpServerPatch) -> Self {
        Self {
            name: patch.name,
            server_version: patch.server_version,
            service_endpoint: patch.service_endpoint,
            documentation_url: patch.documentation_url,
            clear_documentation_url: patch.clear_documentation_url,
            server_capabilities_summary: patch.server_capabilities_summary,
            clear_server_capabilities_summary: patch.clear_server_capabilities_summary,
            supports_resources: patch.supports_resources,
            supports_tools: patch.supports_tools,
            supports_prompts: patch.supports_prompts,
            onchain_tool_definitions: patch.onchain_tool_definitions.map(|tools| {
                tools.into_iter().map(|t| t.into()).collect()
            }),
            onchain_resource_definitions: patch.onchain_resource_definitions.map(|resources| {
                resources.into_iter().map(|r| r.into()).collect()
            }),
            onchain_prompt_definitions: patch.onchain_prompt_definitions.map(|prompts| {
                prompts.into_iter().map(|p| p.into()).collect()
            }),
            full_capabilities_uri: patch.full_capabilities_uri,
            clear_full_capabilities_uri: patch.clear_full_capabilities_uri,
            tags: patch.tags,
        }
    }
}

/// Arguments for registering an MCP server
#[derive(Debug, Clone)]
pub struct McpServerArgs {
    pub server_id: String,
    pub name: String,
    pub server_version: String,
    pub service_endpoint: String,
    pub documentation_url: Option<String>,
    pub server_capabilities_summary: Option<String>,
    pub supports_resources: bool,
    pub supports_tools: bool,
    pub supports_prompts: bool,
    pub onchain_tool_definitions: Vec<McpToolDefinition>,
    pub onchain_resource_definitions: Vec<McpResourceDefinition>,
    pub onchain_prompt_definitions: Vec<McpPromptDefinition>,
    pub full_capabilities_uri: Option<String>,
    pub tags: Vec<String>,
}

/// Patch for updating MCP server details
#[derive(Debug, Clone, Default)]
pub struct McpServerPatch {
    pub name: Option<String>,
    pub server_version: Option<String>,
    pub service_endpoint: Option<String>,
    pub documentation_url: Option<String>,
    pub clear_documentation_url: Option<bool>,
    pub server_capabilities_summary: Option<String>,
    pub clear_server_capabilities_summary: Option<bool>,
    pub supports_resources: Option<bool>,
    pub supports_tools: Option<bool>,
    pub supports_prompts: Option<bool>,
    pub onchain_tool_definitions: Option<Vec<McpToolDefinition>>,
    pub onchain_resource_definitions: Option<Vec<McpResourceDefinition>>,
    pub onchain_prompt_definitions: Option<Vec<McpPromptDefinition>>,
    pub full_capabilities_uri: Option<String>,
    pub clear_full_capabilities_uri: Option<bool>,
    pub tags: Option<Vec<String>>,
}

/// MCP Server registry entry (account data)
#[derive(Debug, Clone, BorshSerialize, BorshDeserialize)]
pub struct McpServerEntry {
    pub bump: u8,
    pub registry_version: u8,
    pub state_version: u64,
    pub owner_authority: Pubkey,
    pub server_id: String,
    pub name: String,
    pub server_version: String,
    pub service_endpoint: String,
    pub documentation_url: Option<String>,
    pub server_capabilities_summary: Option<String>,
    pub supports_resources: bool,
    pub supports_tools: bool,
    pub supports_prompts: bool,
    pub onchain_tool_definitions: Vec<McpToolDefinition>,
    pub onchain_resource_definitions: Vec<McpResourceDefinition>,
    pub onchain_prompt_definitions: Vec<McpPromptDefinition>,
    pub full_capabilities_uri: Option<String>,
    pub tags: Vec<String>,
    pub status: McpServerStatus,
    pub registration_timestamp: i64,
    pub last_update_timestamp: i64,
}

impl McpServerEntry {
    /// Try to deserialize from account data
    pub fn try_from_account_data(data: &[u8]) -> SdkResult<Self> {
        // Skip the 8-byte discriminator used by Anchor
        if data.len() < 8 {
            return Err(SdkError::InvalidAccountData);
        }

        let account_data = &data[8..];
        Self::try_from_slice(account_data).map_err(|e| {
            SdkError::DeserializationError(format!("Failed to deserialize MCP server entry: {}", e))
        })
    }
}

/// Builder for creating MCP server registration arguments
pub struct McpServerBuilder {
    args: McpServerArgs,
}

impl McpServerBuilder {
    /// Create a new MCP server builder with required fields
    pub fn new(
        server_id: impl Into<String>,
        name: impl Into<String>,
        service_endpoint: impl Into<String>,
    ) -> Self {
        Self {
            args: McpServerArgs {
                server_id: server_id.into(),
                name: name.into(),
                server_version: "1.0.0".to_string(),
                service_endpoint: service_endpoint.into(),
                documentation_url: None,
                server_capabilities_summary: None,
                supports_resources: false,
                supports_tools: false,
                supports_prompts: false,
                onchain_tool_definitions: vec![],
                onchain_resource_definitions: vec![],
                onchain_prompt_definitions: vec![],
                full_capabilities_uri: None,
                tags: vec![],
            },
        }
    }

    /// Set the server version
    pub fn version(mut self, version: impl Into<String>) -> Self {
        self.args.server_version = version.into();
        self
    }

    /// Set the documentation URL
    pub fn documentation_url(mut self, url: impl Into<String>) -> Self {
        self.args.documentation_url = Some(url.into());
        self
    }

    /// Set the server capabilities summary
    pub fn capabilities_summary(mut self, summary: impl Into<String>) -> Self {
        self.args.server_capabilities_summary = Some(summary.into());
        self
    }

    /// Enable resource support
    pub fn supports_resources(mut self, supports: bool) -> Self {
        self.args.supports_resources = supports;
        self
    }

    /// Enable tool support
    pub fn supports_tools(mut self, supports: bool) -> Self {
        self.args.supports_tools = supports;
        self
    }

    /// Enable prompt support
    pub fn supports_prompts(mut self, supports: bool) -> Self {
        self.args.supports_prompts = supports;
        self
    }

    /// Add a tool definition
    pub fn add_tool(
        mut self,
        name: impl Into<String>,
        tags: Vec<impl Into<String>>,
    ) -> SdkResult<Self> {
        let tool =
            McpToolDefinition::new(name.into(), tags.into_iter().map(|t| t.into()).collect())?;
        self.args.onchain_tool_definitions.push(tool);
        Ok(self)
    }

    /// Add a resource definition
    pub fn add_resource(
        mut self,
        uri_pattern: impl Into<String>,
        tags: Vec<impl Into<String>>,
    ) -> SdkResult<Self> {
        let resource = McpResourceDefinition::new(
            uri_pattern.into(),
            tags.into_iter().map(|t| t.into()).collect(),
        )?;
        self.args.onchain_resource_definitions.push(resource);
        Ok(self)
    }

    /// Add a prompt definition
    pub fn add_prompt(
        mut self,
        name: impl Into<String>,
        tags: Vec<impl Into<String>>,
    ) -> SdkResult<Self> {
        let prompt =
            McpPromptDefinition::new(name.into(), tags.into_iter().map(|t| t.into()).collect())?;
        self.args.onchain_prompt_definitions.push(prompt);
        Ok(self)
    }

    /// Set the full capabilities URI
    pub fn full_capabilities_uri(mut self, uri: impl Into<String>) -> Self {
        self.args.full_capabilities_uri = Some(uri.into());
        self
    }

    /// Add tags
    pub fn tags(mut self, tags: Vec<impl Into<String>>) -> Self {
        self.args.tags = tags.into_iter().map(|t| t.into()).collect();
        self
    }

    /// Build and validate the MCP server arguments
    pub fn build(self) -> SdkResult<McpServerArgs> {
        self.validate()?;
        Ok(self.args)
    }

    /// Validate the current arguments
    fn validate(&self) -> SdkResult<()> {
        let args = &self.args;

        // Validate required fields
        if args.server_id.is_empty() || args.server_id.len() > MAX_SERVER_ID_LEN {
            return Err(SdkError::InvalidServerIdLength);
        }

        // Validate server ID format (alphanumeric, hyphens, underscores only)
        if !args
            .server_id
            .chars()
            .all(|c| c.is_alphanumeric() || c == '-' || c == '_')
        {
            return Err(SdkError::InvalidServerIdFormat);
        }

        if args.name.is_empty() || args.name.len() > MAX_SERVER_NAME_LEN {
            return Err(SdkError::InvalidServerNameLength);
        }

        if args.server_version.len() > MAX_SERVER_VERSION_LEN {
            return Err(SdkError::InvalidServerVersionLength);
        }

        if args.service_endpoint.is_empty()
            || args.service_endpoint.len() > MAX_SERVICE_ENDPOINT_URL_LEN
        {
            return Err(SdkError::InvalidServiceEndpointUrlLength);
        }

        // Validate optional fields
        if let Some(ref doc_url) = args.documentation_url {
            if doc_url.len() > MAX_DOCUMENTATION_URL_LEN {
                return Err(SdkError::InvalidDocumentationUrlLength);
            }
        }

        if let Some(ref summary) = args.server_capabilities_summary {
            if summary.len() > MAX_SERVER_CAPABILITIES_SUMMARY_LEN {
                return Err(SdkError::InvalidServerCapabilitiesSummaryLength);
            }
        }

        // Validate tool definitions
        if args.onchain_tool_definitions.len() > MAX_ONCHAIN_TOOL_DEFINITIONS {
            return Err(SdkError::TooManyOnChainToolDefinitions);
        }

        // Validate resource definitions
        if args.onchain_resource_definitions.len() > MAX_ONCHAIN_RESOURCE_DEFINITIONS {
            return Err(SdkError::TooManyOnChainResourceDefinitions);
        }

        // Validate prompt definitions
        if args.onchain_prompt_definitions.len() > MAX_ONCHAIN_PROMPT_DEFINITIONS {
            return Err(SdkError::TooManyOnChainPromptDefinitions);
        }

        // Validate full capabilities URI
        if let Some(ref uri) = args.full_capabilities_uri {
            if uri.len() > MAX_FULL_CAPABILITIES_URI_LEN {
                return Err(SdkError::InvalidFullCapabilitiesUriLength);
            }
        }

        // Validate tags
        if args.tags.len() > MAX_SERVER_TAGS {
            return Err(SdkError::TooManyTags);
        }

        for tag in &args.tags {
            if tag.len() > MAX_SERVER_TAG_LEN {
                return Err(SdkError::InvalidTagLength);
            }
        }

        Ok(())
    }
}

/// MCP Server registry operations
pub struct McpServerRegistry;

impl McpServerRegistry {
    /// Create a register MCP server instruction
    pub fn register(
        program_id: &Pubkey,
        owner: &Pubkey,
        args: McpServerArgs,
    ) -> SdkResult<Instruction> {
        create_register_mcp_server_instruction(program_id, owner, args)
    }

    /// Create an update MCP server instruction
    pub fn update(
        program_id: &Pubkey,
        owner: &Pubkey,
        server_id: &str,
        patch: McpServerPatch,
    ) -> SdkResult<Instruction> {
        create_update_mcp_server_instruction(program_id, owner, server_id, patch)
    }

    /// Create an update MCP server status instruction
    pub fn update_status(
        program_id: &Pubkey,
        owner: &Pubkey,
        server_id: &str,
        status: u8,
    ) -> SdkResult<Instruction> {
        create_update_mcp_server_status_instruction(program_id, owner, server_id, status)
    }

    /// Create a deregister MCP server instruction
    pub fn deregister(
        program_id: &Pubkey,
        owner: &Pubkey,
        server_id: &str,
    ) -> SdkResult<Instruction> {
        create_deregister_mcp_server_instruction(program_id, owner, server_id)
    }

    /// Derive the PDA for an MCP server
    pub fn derive_pda(
        program_id: &Pubkey,
        owner: &Pubkey,
        server_id: &str,
    ) -> SdkResult<(Pubkey, u8)> {
        derive_mcp_server_pda_with_bump(program_id, owner, server_id)
    }
}

/// Derive MCP server PDA
pub fn derive_mcp_server_pda(
    program_id: &Pubkey,
    owner: &Pubkey,
    server_id: &str,
) -> SdkResult<Pubkey> {
    let (pda, _) = derive_mcp_server_pda_with_bump(program_id, owner, server_id)?;
    Ok(pda)
}

/// Derive MCP server PDA with bump
pub fn derive_mcp_server_pda_with_bump(
    program_id: &Pubkey,
    owner: &Pubkey,
    server_id: &str,
) -> SdkResult<(Pubkey, u8)> {
    let seeds = &[b"mcp_srv_reg_v1", server_id.as_bytes(), owner.as_ref()];

    let (pda, bump) = Pubkey::find_program_address(seeds, program_id);
    Ok((pda, bump))
}

/// Create register MCP server instruction
pub fn create_register_mcp_server_instruction(
    program_id: &Pubkey,
    owner: &Pubkey,
    args: McpServerArgs,
) -> SdkResult<Instruction> {
    let server_pda = derive_mcp_server_pda(program_id, owner, &args.server_id)?;

    let accounts = vec![
        AccountMeta::new(server_pda, false),
        AccountMeta::new_readonly(*owner, true),
        AccountMeta::new(*owner, true), // payer
        AccountMeta::new_readonly(system_program::id(), false),
    ];

    // Create proper instruction with Borsh serialization
    let instruction = McpServerRegistryInstruction::RegisterMcpServer {
        server_id: args.server_id,
        name: args.name,
        server_version: args.server_version,
        service_endpoint: args.service_endpoint,
        documentation_url: args.documentation_url,
        server_capabilities_summary: args.server_capabilities_summary,
        supports_resources: args.supports_resources,
        supports_tools: args.supports_tools,
        supports_prompts: args.supports_prompts,
        onchain_tool_definitions: args.onchain_tool_definitions.into_iter().map(|t| t.into()).collect(),
        onchain_resource_definitions: args.onchain_resource_definitions.into_iter().map(|r| r.into()).collect(),
        onchain_prompt_definitions: args.onchain_prompt_definitions.into_iter().map(|p| p.into()).collect(),
        full_capabilities_uri: args.full_capabilities_uri,
        tags: args.tags,
    };

    let data = instruction.try_to_vec()
        .map_err(|e| SdkError::SerializationError(format!("Failed to serialize instruction: {}", e)))?;

    Ok(Instruction {
        program_id: *program_id,
        accounts,
        data,
    })
}

/// Create update MCP server instruction
pub fn create_update_mcp_server_instruction(
    program_id: &Pubkey,
    owner: &Pubkey,
    server_id: &str,
    patch: McpServerPatch,
) -> SdkResult<Instruction> {
    let server_pda = derive_mcp_server_pda(program_id, owner, server_id)?;

    let accounts = vec![
        AccountMeta::new(server_pda, false),
        AccountMeta::new_readonly(*owner, true),
    ];

    let instruction = McpServerRegistryInstruction::UpdateMcpServerDetails {
        details: patch.into(),
    };

    let data = instruction.try_to_vec()
        .map_err(|e| SdkError::SerializationError(format!("Failed to serialize instruction: {}", e)))?;

    Ok(Instruction {
        program_id: *program_id,
        accounts,
        data,
    })
}

/// Create update MCP server status instruction
pub fn create_update_mcp_server_status_instruction(
    program_id: &Pubkey,
    owner: &Pubkey,
    server_id: &str,
    status: u8,
) -> SdkResult<Instruction> {
    let server_pda = derive_mcp_server_pda(program_id, owner, server_id)?;

    let accounts = vec![
        AccountMeta::new(server_pda, false),
        AccountMeta::new_readonly(*owner, true),
    ];

    let instruction = McpServerRegistryInstruction::UpdateMcpServerStatus {
        new_status: status,
    };

    let data = instruction.try_to_vec()
        .map_err(|e| SdkError::SerializationError(format!("Failed to serialize instruction: {}", e)))?;

    Ok(Instruction {
        program_id: *program_id,
        accounts,
        data,
    })
}

/// Create deregister MCP server instruction
pub fn create_deregister_mcp_server_instruction(
    program_id: &Pubkey,
    owner: &Pubkey,
    server_id: &str,
) -> SdkResult<Instruction> {
    let server_pda = derive_mcp_server_pda(program_id, owner, server_id)?;

    let accounts = vec![
        AccountMeta::new(server_pda, false),
        AccountMeta::new_readonly(*owner, true),
    ];

    let instruction = McpServerRegistryInstruction::DeregisterMcpServer;

    let data = instruction.try_to_vec()
        .map_err(|e| SdkError::SerializationError(format!("Failed to serialize instruction: {}", e)))?;

    Ok(Instruction {
        program_id: *program_id,
        accounts,
        data,
    })
}

#[cfg(test)]
mod tests {
    use super::*;
    use solana_sdk::signature::Signer;
    use solana_sdk::signer::keypair::Keypair;

    #[test]
    fn test_mcp_server_builder() {
        let server = McpServerBuilder::new("test-server", "Test Server", "http://localhost:8080")
            .version("1.0.0")
            .supports_tools(true)
            .build()
            .unwrap();

        assert_eq!(server.server_id, "test-server");
        assert_eq!(server.name, "Test Server");
        assert_eq!(server.service_endpoint, "http://localhost:8080");
        assert_eq!(server.server_version, "1.0.0");
        assert!(server.supports_tools);
        assert!(!server.supports_resources);
        assert!(!server.supports_prompts);
    }

    #[test]
    fn test_mcp_server_builder_with_tools() {
        let server = McpServerBuilder::new("test-server", "Test Server", "http://localhost:8080")
            .add_tool("search", vec!["query", "search"])
            .unwrap()
            .build()
            .unwrap();

        assert_eq!(server.onchain_tool_definitions.len(), 1);
        assert_eq!(server.onchain_tool_definitions[0].name, "search");
        assert_eq!(
            server.onchain_tool_definitions[0].tags,
            vec!["query", "search"]
        );
    }

    #[test]
    fn test_mcp_server_builder_validation() {
        // Test empty server ID
        let result = McpServerBuilder::new("", "Test Server", "http://localhost:8080").build();
        assert!(matches!(result, Err(SdkError::InvalidServerIdLength)));

        // Test empty name
        let result = McpServerBuilder::new("test-server", "", "http://localhost:8080").build();
        assert!(matches!(result, Err(SdkError::InvalidServerNameLength)));

        // Test empty service endpoint
        let result = McpServerBuilder::new("test-server", "Test Server", "").build();
        assert!(matches!(
            result,
            Err(SdkError::InvalidServiceEndpointUrlLength)
        ));

        // Test invalid server ID format
        let result =
            McpServerBuilder::new("test server!", "Test Server", "http://localhost:8080").build();
        assert!(matches!(result, Err(SdkError::InvalidServerIdFormat)));

        // Test too long server ID
        let long_id = "a".repeat(MAX_SERVER_ID_LEN + 1);
        let result = McpServerBuilder::new(long_id, "Test Server", "http://localhost:8080").build();
        assert!(matches!(result, Err(SdkError::InvalidServerIdLength)));
    }

    #[test]
    fn test_derive_mcp_server_pda() {
        let program_id = Pubkey::new_unique();
        let owner = Keypair::new().pubkey();
        let server_id = "test-server";

        let pda = derive_mcp_server_pda(&program_id, &owner, server_id).unwrap();
        assert_ne!(pda, Pubkey::default());

        // Should be deterministic
        let pda2 = derive_mcp_server_pda(&program_id, &owner, server_id).unwrap();
        assert_eq!(pda, pda2);
    }

    #[test]
    fn test_mcp_server_status() {
        assert_eq!(McpServerStatus::from_u8(0), Some(McpServerStatus::Pending));
        assert_eq!(McpServerStatus::from_u8(1), Some(McpServerStatus::Active));
        assert_eq!(McpServerStatus::from_u8(2), Some(McpServerStatus::Inactive));
        assert_eq!(
            McpServerStatus::from_u8(3),
            Some(McpServerStatus::Deregistered)
        );
        assert_eq!(McpServerStatus::from_u8(4), None);

        assert_eq!(McpServerStatus::default(), McpServerStatus::Pending);
    }

    #[test]
    fn test_mcp_tool_definition_validation() {
        // Valid tool
        let tool = McpToolDefinition::new("search".to_string(), vec!["query".to_string()]);
        assert!(tool.is_ok());

        // Empty name
        let tool = McpToolDefinition::new("".to_string(), vec![]);
        assert!(matches!(tool, Err(SdkError::InvalidToolNameLength)));

        // Too long name
        let long_name = "a".repeat(MAX_TOOL_NAME_LEN + 1);
        let tool = McpToolDefinition::new(long_name, vec![]);
        assert!(matches!(tool, Err(SdkError::InvalidToolNameLength)));

        // Too many tags
        let too_many_tags = vec!["tag".to_string(); MAX_TOOL_TAGS + 1];
        let tool = McpToolDefinition::new("search".to_string(), too_many_tags);
        assert!(matches!(tool, Err(SdkError::TooManyToolTags)));

        // Too long tag
        let long_tag = "a".repeat(MAX_TOOL_TAG_LEN + 1);
        let tool = McpToolDefinition::new("search".to_string(), vec![long_tag]);
        assert!(matches!(tool, Err(SdkError::InvalidToolTagLength)));
    }

    #[test]
    fn test_mcp_resource_definition_validation() {
        // Valid resource
        let resource =
            McpResourceDefinition::new("file:///*".to_string(), vec!["filesystem".to_string()]);
        assert!(resource.is_ok());

        // Too long URI pattern
        let long_pattern = "a".repeat(MAX_RESOURCE_URI_PATTERN_LEN + 1);
        let resource = McpResourceDefinition::new(long_pattern, vec![]);
        assert!(matches!(
            resource,
            Err(SdkError::InvalidResourceUriPatternLength)
        ));

        // Too many tags
        let too_many_tags = vec!["tag".to_string(); MAX_RESOURCE_TAGS + 1];
        let resource = McpResourceDefinition::new("file:///*".to_string(), too_many_tags);
        assert!(matches!(resource, Err(SdkError::TooManyResourceTags)));
    }

    #[test]
    fn test_mcp_prompt_definition_validation() {
        // Valid prompt
        let prompt =
            McpPromptDefinition::new("code-review".to_string(), vec!["review".to_string()]);
        assert!(prompt.is_ok());

        // Empty name
        let prompt = McpPromptDefinition::new("".to_string(), vec![]);
        assert!(matches!(prompt, Err(SdkError::InvalidPromptNameLength)));

        // Too long name
        let long_name = "a".repeat(MAX_PROMPT_NAME_LEN + 1);
        let prompt = McpPromptDefinition::new(long_name, vec![]);
        assert!(matches!(prompt, Err(SdkError::InvalidPromptNameLength)));

        // Too many tags
        let too_many_tags = vec!["tag".to_string(); MAX_PROMPT_TAGS + 1];
        let prompt = McpPromptDefinition::new("code-review".to_string(), too_many_tags);
        assert!(matches!(prompt, Err(SdkError::TooManyPromptTags)));
    }
}
