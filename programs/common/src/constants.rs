//! Constants defining size limits and PDA seeds for the registry protocols

/// ## Agent Registry Constants
/// Maximum allowed length for agent identifiers
pub const MAX_AGENT_ID_LEN: usize = 64;
/// Maximum allowed length for agent names
pub const MAX_AGENT_NAME_LEN: usize = 128;
/// Maximum allowed length for agent descriptions
pub const MAX_AGENT_DESCRIPTION_LEN: usize = 512;
/// Maximum allowed length for agent version strings
pub const MAX_AGENT_VERSION_LEN: usize = 32;
/// Maximum allowed length for provider names
pub const MAX_PROVIDER_NAME_LEN: usize = 128;
/// Maximum allowed length for provider URLs
pub const MAX_PROVIDER_URL_LEN: usize = 256;
/// Maximum allowed length for documentation URLs (shared by both registries)
pub const MAX_DOCUMENTATION_URL_LEN: usize = 256;
/// Maximum number of service endpoints an agent can register on-chain
pub const MAX_SERVICE_ENDPOINTS: usize = 3;
/// Maximum allowed length for endpoint protocol identifiers
pub const MAX_ENDPOINT_PROTOCOL_LEN: usize = 64;
/// Maximum allowed length for endpoint URLs
pub const MAX_ENDPOINT_URL_LEN: usize = 256;
/// Maximum number of supported input/output modes
pub const MAX_SUPPORTED_MODES: usize = 5;
/// Maximum allowed length for mode identifiers
pub const MAX_MODE_LEN: usize = 64;
/// Maximum number of skills an agent can register on-chain
pub const MAX_SKILLS: usize = 10;
/// Maximum allowed length for skill identifiers
pub const MAX_SKILL_ID_LEN: usize = 64;
/// Maximum allowed length for skill names
pub const MAX_SKILL_NAME_LEN: usize = 128;
/// Maximum number of tags per skill
pub const MAX_SKILL_TAGS: usize = 5;
/// Maximum allowed length for skill tags
pub const MAX_SKILL_TAG_LEN: usize = 32;
/// Maximum allowed length for security information URIs
pub const MAX_SECURITY_INFO_URI_LEN: usize = 256;
/// Maximum allowed length for Autonomous Economic Agent (AEA) addresses
pub const MAX_AEA_ADDRESS_LEN: usize = 128;
/// Maximum allowed length for economic intent summaries
pub const MAX_ECONOMIC_INTENT_LEN: usize = 256;
/// Maximum allowed length for extended metadata URIs
pub const MAX_EXTENDED_METADATA_URI_LEN: usize = 256;
/// Maximum number of tags per agent
pub const MAX_AGENT_TAGS: usize = 10;
/// Maximum allowed length for agent tags
pub const MAX_AGENT_TAG_LEN: usize = 32;

/// ## MCP Server Registry Constants
/// Maximum allowed length for MCP server identifiers
pub const MAX_SERVER_ID_LEN: usize = 64;
/// Maximum allowed length for server names
pub const MAX_SERVER_NAME_LEN: usize = 128;
/// Maximum allowed length for server version strings
pub const MAX_SERVER_VERSION_LEN: usize = 32;
/// Maximum allowed length for server endpoint URLs
pub const MAX_SERVER_ENDPOINT_URL_LEN: usize = 256;
/// Maximum allowed length for server capabilities summaries
pub const MAX_SERVER_CAPABILITIES_SUMMARY_LEN: usize = 256;
/// Maximum number of on-chain tool definitions per MCP server
pub const MAX_ONCHAIN_TOOL_DEFINITIONS: usize = 5;
/// Maximum allowed length for tool names
pub const MAX_TOOL_NAME_LEN: usize = 64;
/// Maximum number of tags per tool
pub const MAX_TOOL_TAGS: usize = 3;
/// Maximum allowed length for tool tags
pub const MAX_TOOL_TAG_LEN: usize = 32;
/// Maximum number of on-chain resource definitions per MCP server
pub const MAX_ONCHAIN_RESOURCE_DEFINITIONS: usize = 5;
/// Maximum allowed length for resource URI patterns
pub const MAX_RESOURCE_URI_PATTERN_LEN: usize = 128;
/// Maximum number of tags per resource
pub const MAX_RESOURCE_TAGS: usize = 3;
/// Maximum allowed length for resource tags
pub const MAX_RESOURCE_TAG_LEN: usize = 32;
/// Maximum number of on-chain prompt definitions per MCP server
pub const MAX_ONCHAIN_PROMPT_DEFINITIONS: usize = 5;
/// Maximum allowed length for prompt names
pub const MAX_PROMPT_NAME_LEN: usize = 64;
/// Maximum number of tags per prompt
pub const MAX_PROMPT_TAGS: usize = 3;
/// Maximum allowed length for prompt tags
pub const MAX_PROMPT_TAG_LEN: usize = 32;
/// Maximum allowed length for full capabilities URIs
pub const MAX_FULL_CAPABILITIES_URI_LEN: usize = 256;
/// Maximum number of tags per MCP server
pub const MAX_SERVER_TAGS: usize = 10;
/// Maximum allowed length for server tags
pub const MAX_SERVER_TAG_LEN: usize = 32;

/// Size of SHA256 hash in bytes
pub const HASH_SIZE: usize = 32;
/// Size of String/Vec length prefix in Borsh serialization
pub const STRING_LEN_PREFIX_SIZE: usize = 4;
/// Size of Option discriminator in Borsh serialization
pub const OPTION_DISCRIMINATOR_SIZE: usize = 1;

/// ## PDA Seed Prefixes
/// Seed prefix used to derive Agent Registry PDAs
pub const AGENT_REGISTRY_PDA_SEED: &[u8] = b"agent_reg_v1";
/// Seed prefix used to derive MCP Server Registry PDAs
pub const MCP_SERVER_REGISTRY_PDA_SEED: &[u8] = b"mcp_srv_reg_v1";

/// ## Status Enums
/// Agent status values
#[repr(u8)]
#[derive(Clone, Copy, Debug, PartialEq)]
pub enum AgentStatus {
    Pending = 0,
    Active = 1,
    Inactive = 2,
    Deregistered = 3,
}

impl AgentStatus {
    pub fn from_u8(value: u8) -> Option<Self> {
        match value {
            0 => Some(AgentStatus::Pending),
            1 => Some(AgentStatus::Active),
            2 => Some(AgentStatus::Inactive),
            3 => Some(AgentStatus::Deregistered),
            _ => None,
        }
    }
}

/// MCP Server status values
#[repr(u8)]
#[derive(Clone, Copy, Debug, PartialEq)]
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

/// ## Token Integration Constants

// Agent Registry Token Constants
/// Agent registration fee in A2AMPL (with 9 decimals)
pub const AGENT_REGISTRATION_FEE: u64 = 100 * 1_000_000_000; // 100 A2AMPL

// Token staking tiers for agents (in A2AMPL base units with 9 decimals)
pub const BRONZE_TIER_STAKE: u64 = 1_000 * 1_000_000_000; // 1,000 A2AMPL
pub const SILVER_TIER_STAKE: u64 = 10_000 * 1_000_000_000; // 10,000 A2AMPL
pub const GOLD_TIER_STAKE: u64 = 50_000 * 1_000_000_000; // 50,000 A2AMPL
pub const PLATINUM_TIER_STAKE: u64 = 100_000 * 1_000_000_000; // 100,000 A2AMPL

// Lock periods for agent staking tiers (in seconds)
pub const BRONZE_LOCK_PERIOD: i64 = 30 * 24 * 60 * 60; // 30 days
pub const SILVER_LOCK_PERIOD: i64 = 90 * 24 * 60 * 60; // 90 days
pub const GOLD_LOCK_PERIOD: i64 = 180 * 24 * 60 * 60; // 180 days
pub const PLATINUM_LOCK_PERIOD: i64 = 365 * 24 * 60 * 60; // 365 days

// MCP Server Registry Token Constants
/// MCP Server registration fee in A2AMPL (with 9 decimals)
pub const MCP_REGISTRATION_FEE: u64 = 50 * 1_000_000_000; // 50 A2AMPL

// MCP Server verification stakes (in A2AMPL base units with 9 decimals)
pub const BASIC_SERVER_STAKE: u64 = 500 * 1_000_000_000; // 500 A2AMPL
pub const VERIFIED_SERVER_STAKE: u64 = 5_000 * 1_000_000_000; // 5,000 A2AMPL
pub const PREMIUM_SERVER_STAKE: u64 = 25_000 * 1_000_000_000; // 25,000 A2AMPL

// MCP Server staking limits and periods
pub const MIN_STAKE_AMOUNT: u64 = BASIC_SERVER_STAKE; // Minimum stake = 500 A2AMPL
pub const MIN_LOCK_PERIOD: i64 = 7 * 24 * 60 * 60; // 7 days minimum lock
pub const MAX_LOCK_PERIOD: i64 = 730 * 24 * 60 * 60; // 2 years maximum lock

// Service fee limits
pub const MIN_SERVICE_FEE: u64 = 1 * 1_000_000_000; // 1 A2AMPL minimum service fee
pub const MIN_TOOL_FEE: u64 = 1_000_000_000; // 1 A2AMPL
pub const MIN_RESOURCE_FEE: u64 = 500_000_000; // 0.5 A2AMPL
pub const MIN_PROMPT_FEE: u64 = 2_000_000_000; // 2 A2AMPL
pub const MAX_BULK_DISCOUNT: u8 = 50; // 50% maximum discount

// Quality metrics
pub const QUALITY_UPDATE_INTERVAL: i64 = 24 * 60 * 60; // 24 hours
pub const MIN_UPTIME_FOR_PREMIUM: u8 = 95; // 95% uptime required

// Priority multiplier limits
pub const MIN_PRIORITY_MULTIPLIER: u16 = 100; // 1.0x
pub const MAX_PRIORITY_MULTIPLIER: u16 = 300; // 3.0x

// A2AMPL Token decimals
pub const A2AMPL_DECIMALS: u8 = 9;
pub const A2AMPL_BASE_UNIT: u64 = 1_000_000_000; // 1 A2AMPL = 10^9 base units

// A2AMPL Token Mint Address (network-specific)
pub const A2AMPL_TOKEN_MINT_MAINNET: &str = "Cpzvdx6pppc9TNArsGsqgShCsKC9NCCjA2gtzHvUpump";
pub const A2AMPL_TOKEN_MINT_DEVNET: &str = "A2AMPLyncKHwfSnwRNsJ2qsjsetgo9fGkP8YZPsDZ9mE";

// Token vault PDA seeds
pub const STAKING_VAULT_SEED: &[u8] = b"staking_vault";
pub const FEE_VAULT_SEED: &[u8] = b"fee_vault";
pub const REGISTRATION_VAULT_SEED: &[u8] = b"registration_vault";