//! Serialization utilities and data structures for the Solana AI Registries

use borsh::{BorshDeserialize, BorshSerialize};
use crate::constants::*;

/// Calculate the Borsh serialization size of a String with a maximum length
pub const fn borsh_size_string(max_len: usize) -> usize {
    STRING_LEN_PREFIX_SIZE + max_len
}

/// Calculate the Borsh serialization size of an Option<String> with a maximum length
pub const fn borsh_size_option_string(max_len: usize) -> usize {
    OPTION_DISCRIMINATOR_SIZE + borsh_size_string(max_len)
}

/// Calculate the Borsh serialization size of an Option<[u8; HASH_SIZE]>
pub const fn borsh_size_option_hash() -> usize {
    OPTION_DISCRIMINATOR_SIZE + HASH_SIZE
}

/// Calculate the Borsh serialization size of a Vec<String> with a maximum number of items and maximum item length
pub const fn borsh_size_vec_string(max_items: usize, max_item_len: usize) -> usize {
    STRING_LEN_PREFIX_SIZE + (max_items * borsh_size_string(max_item_len))
}

/// Service Endpoint definition for agents
#[derive(BorshSerialize, BorshDeserialize, Clone, Debug, PartialEq, serde::Serialize, serde::Deserialize)]
pub struct ServiceEndpoint {
    /// Protocol type (e.g., "a2a_http_jsonrpc", "aea_p2p")
    pub protocol: String,
    /// Endpoint URL
    pub url: String,
    /// Indicates if this is the primary endpoint (only one can be true)
    pub is_default: bool,
}

impl ServiceEndpoint {
    pub const SERIALIZED_SIZE: usize = borsh_size_string(MAX_ENDPOINT_PROTOCOL_LEN)
        + borsh_size_string(MAX_ENDPOINT_URL_LEN)
        + 1; // is_default (bool)
}

/// Service Endpoint Input struct for instruction parameters
#[derive(BorshSerialize, BorshDeserialize, Clone, Debug, PartialEq)]
pub struct ServiceEndpointInput {
    pub protocol: String,
    pub url: String,
    pub is_default: bool,
}

impl From<ServiceEndpointInput> for ServiceEndpoint {
    fn from(input: ServiceEndpointInput) -> Self {
        ServiceEndpoint {
            protocol: input.protocol,
            url: input.url,
            is_default: input.is_default,
        }
    }
}

/// Agent Skill definition
#[derive(BorshSerialize, BorshDeserialize, Clone, Debug, PartialEq, serde::Serialize, serde::Deserialize)]
pub struct AgentSkill {
    /// Skill's unique ID within the agent
    pub id: String,
    /// Human-readable skill name
    pub name: String,
    /// Optional SHA256 hash of detailed skill description (full description off-chain)
    pub description_hash: Option<[u8; HASH_SIZE]>,
    /// Tags associated with the skill
    pub tags: Vec<String>,
}

impl AgentSkill {
    pub const SERIALIZED_SIZE: usize = borsh_size_string(MAX_SKILL_ID_LEN)
        + borsh_size_string(MAX_SKILL_NAME_LEN)
        + borsh_size_option_hash()
        + borsh_size_vec_string(MAX_SKILL_TAGS, MAX_SKILL_TAG_LEN);
}

/// Agent Skill Input struct for instruction parameters
#[derive(BorshSerialize, BorshDeserialize, Clone, Debug, PartialEq)]
pub struct AgentSkillInput {
    pub id: String,
    pub name: String,
    pub description_hash: Option<[u8; HASH_SIZE]>,
    pub tags: Vec<String>,
}

impl From<AgentSkillInput> for AgentSkill {
    fn from(input: AgentSkillInput) -> Self {
        AgentSkill {
            id: input.id,
            name: input.name,
            description_hash: input.description_hash,
            tags: input.tags,
        }
    }
}

/// MCP Tool Definition for on-chain storage
#[derive(BorshSerialize, BorshDeserialize, Clone, Debug, PartialEq)]
pub struct McpToolDefinitionOnChain {
    /// Tool name
    pub name: String,
    /// SHA256 hash of ToolDefinition.description
    pub description_hash: [u8; HASH_SIZE],
    /// SHA256 hash of ToolDefinition.inputSchema
    pub input_schema_hash: [u8; HASH_SIZE],
    /// SHA256 hash of ToolDefinition.outputSchema
    pub output_schema_hash: [u8; HASH_SIZE],
    /// Tags for tool discovery
    pub tags: Vec<String>,
}

impl McpToolDefinitionOnChain {
    pub const SERIALIZED_SIZE: usize = borsh_size_string(MAX_TOOL_NAME_LEN)
        + HASH_SIZE // description_hash
        + HASH_SIZE // input_schema_hash
        + HASH_SIZE // output_schema_hash
        + borsh_size_vec_string(MAX_TOOL_TAGS, MAX_TOOL_TAG_LEN);
    
    pub const SPACE: usize = Self::SERIALIZED_SIZE;
}

/// MCP Tool Definition Input struct for instruction parameters
#[derive(BorshSerialize, BorshDeserialize, Clone, Debug, PartialEq)]
pub struct McpToolDefinitionOnChainInput {
    pub name: String,
    pub description_hash: [u8; HASH_SIZE],
    pub input_schema_hash: [u8; HASH_SIZE],
    pub output_schema_hash: [u8; HASH_SIZE],
    pub tags: Vec<String>,
}

impl From<McpToolDefinitionOnChainInput> for McpToolDefinitionOnChain {
    fn from(input: McpToolDefinitionOnChainInput) -> Self {
        McpToolDefinitionOnChain {
            name: input.name,
            description_hash: input.description_hash,
            input_schema_hash: input.input_schema_hash,
            output_schema_hash: input.output_schema_hash,
            tags: input.tags,
        }
    }
}

/// MCP Resource Definition for on-chain storage
#[derive(BorshSerialize, BorshDeserialize, Clone, Debug, PartialEq)]
pub struct McpResourceDefinitionOnChain {
    /// Resource URI or pattern
    pub uri_pattern: String,
    /// SHA256 hash of ResourceDefinition.description
    pub description_hash: [u8; HASH_SIZE],
    /// Tags for resource discovery
    pub tags: Vec<String>,
}

impl McpResourceDefinitionOnChain {
    pub const SERIALIZED_SIZE: usize = borsh_size_string(MAX_RESOURCE_URI_PATTERN_LEN)
        + HASH_SIZE // description_hash
        + borsh_size_vec_string(MAX_RESOURCE_TAGS, MAX_RESOURCE_TAG_LEN);
    
    pub const SPACE: usize = Self::SERIALIZED_SIZE;
}

/// MCP Resource Definition Input struct for instruction parameters
#[derive(BorshSerialize, BorshDeserialize, Clone, Debug, PartialEq)]
pub struct McpResourceDefinitionOnChainInput {
    pub uri_pattern: String,
    pub description_hash: [u8; HASH_SIZE],
    pub tags: Vec<String>,
}

impl From<McpResourceDefinitionOnChainInput> for McpResourceDefinitionOnChain {
    fn from(input: McpResourceDefinitionOnChainInput) -> Self {
        McpResourceDefinitionOnChain {
            uri_pattern: input.uri_pattern,
            description_hash: input.description_hash,
            tags: input.tags,
        }
    }
}

/// MCP Prompt Definition for on-chain storage
#[derive(BorshSerialize, BorshDeserialize, Clone, Debug, PartialEq)]
pub struct McpPromptDefinitionOnChain {
    /// Prompt name
    pub name: String,
    /// SHA256 hash of PromptDefinition.description
    pub description_hash: [u8; HASH_SIZE],
    /// Tags for prompt discovery
    pub tags: Vec<String>,
}

impl McpPromptDefinitionOnChain {
    pub const SERIALIZED_SIZE: usize = borsh_size_string(MAX_PROMPT_NAME_LEN)
        + HASH_SIZE // description_hash
        + borsh_size_vec_string(MAX_PROMPT_TAGS, MAX_PROMPT_TAG_LEN);
    
    pub const SPACE: usize = Self::SERIALIZED_SIZE;
}

/// MCP Prompt Definition Input struct for instruction parameters
#[derive(BorshSerialize, BorshDeserialize, Clone, Debug, PartialEq)]
pub struct McpPromptDefinitionOnChainInput {
    pub name: String,
    pub description_hash: [u8; HASH_SIZE],
    pub tags: Vec<String>,
}

impl From<McpPromptDefinitionOnChainInput> for McpPromptDefinitionOnChain {
    fn from(input: McpPromptDefinitionOnChainInput) -> Self {
        McpPromptDefinitionOnChain {
            name: input.name,
            description_hash: input.description_hash,
            tags: input.tags,
        }
    }
}

#[cfg(test)]
mod tests {
    use super::*;

    #[test]
    fn test_service_endpoint_serialization() {
        let endpoint = ServiceEndpoint {
            protocol: "http".to_string(),
            url: "https://example.com".to_string(),
            is_default: true,
        };

        let serialized = endpoint.try_to_vec().unwrap();
        let deserialized = ServiceEndpoint::try_from_slice(&serialized).unwrap();

        assert_eq!(endpoint, deserialized);
    }

    #[test]
    fn test_agent_skill_serialization() {
        let skill = AgentSkill {
            id: "skill1".to_string(),
            name: "Test Skill".to_string(),
            description_hash: Some([1u8; 32]),
            tags: vec!["tag1".to_string(), "tag2".to_string()],
        };

        let serialized = skill.try_to_vec().unwrap();
        let deserialized = AgentSkill::try_from_slice(&serialized).unwrap();

        assert_eq!(skill, deserialized);
    }

    #[test]
    fn test_mcp_tool_definition_serialization() {
        let tool = McpToolDefinitionOnChain {
            name: "test_tool".to_string(),
            description_hash: [2u8; 32],
            input_schema_hash: [3u8; 32],
            output_schema_hash: [4u8; 32],
            tags: vec!["tool".to_string()],
        };

        let serialized = tool.try_to_vec().unwrap();
        let deserialized = McpToolDefinitionOnChain::try_from_slice(&serialized).unwrap();

        assert_eq!(tool, deserialized);
    }

    #[test]
    fn test_conversion_from_input() {
        let input = ServiceEndpointInput {
            protocol: "http".to_string(),
            url: "https://example.com".to_string(),
            is_default: true,
        };

        let endpoint: ServiceEndpoint = input.into();
        assert_eq!(endpoint.protocol, "http");
        assert_eq!(endpoint.url, "https://example.com");
        assert_eq!(endpoint.is_default, true);
    }
}