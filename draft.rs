/// # Solana Protocol for Agent and MCP Server Registries
/// 
/// This program implements two interconnected Solana-based registry protocols:
/// 
/// 1. **Agent Registry**: A decentralized directory for autonomous agents operating on Solana,
///    supporting the advertisement of agent capabilities, endpoints, identity, and metadata
///    following the Autonomous Economic Agent (AEA) and Agent-to-Agent (A2A) paradigms.
/// 
/// 2. **MCP Server Registry**: A directory for Model Context Protocol (MCP) compliant servers,
///    enabling the discovery of AI tools, resources, and prompts following the MCP specification.
///
/// Both registries use a hybrid storage model where essential verifiable data resides on-chain,
/// while more extensive metadata is stored off-chain (e.g., on IPFS/Arweave) and linked via URIs,
/// with on-chain hashes ensuring data integrity.
///
/// The registries emit detailed events designed to power off-chain indexing and query services
/// for advanced discovery capabilities.

use anchor_lang::prelude::*;
use anchor_lang::solana_program::system_program;

declare_id!("Fg6PaFpoGXkYsidMpWTK6W2BeZ7FEfcYkg476zPFsLnS"); // Replace with your program ID after deployment

/// Constants defining size limits and PDA seeds for the registry protocols
mod constants {
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
    pub const HASH_SIZE: usize = 32; // SHA256 hash size
    /// Size of String/Vec length prefix in Borsh serialization
    pub const STRING_LEN_PREFIX_SIZE: usize = 4; // u32 for String/Vec length
    /// Size of Option discriminator in Borsh serialization
    pub const OPTION_DISCRIMINATOR_SIZE: usize = 1; // 1 byte for Option discriminator

    /// ## PDA Seed Prefixes
    /// Seed prefix used to derive Agent Registry PDAs
    pub const AGENT_REGISTRY_PDA_SEED: &[u8] = b"agent_reg_v1";
    /// Seed prefix used to derive MCP Server Registry PDAs
    pub const MCP_SERVER_REGISTRY_PDA_SEED: &[u8] = b"mcp_srv_reg_v1";
}

use constants::*;

/// Calculate the Borsh serialization size of a String with a maximum length
///
/// Returns the size in bytes that a String will occupy when serialized with Borsh,
/// accounting for the length prefix and the maximum possible string content.
fn borsh_size_string(max_len: usize) -> usize {
    STRING_LEN_PREFIX_SIZE + max_len
}

/// Calculate the Borsh serialization size of an Option<String> with a maximum length
///
/// Returns the size in bytes that an Option<String> will occupy when serialized with Borsh,
/// accounting for the discriminator byte, length prefix, and the maximum possible string content.
fn borsh_size_option_string(max_len: usize) -> usize {
    OPTION_DISCRIMINATOR_SIZE + borsh_size_string(max_len)
}

/// Calculate the Borsh serialization size of an Option<[u8; HASH_SIZE]>
///
/// Returns the size in bytes that an Option<[u8; HASH_SIZE]> will occupy when serialized with Borsh,
/// accounting for the discriminator byte and the fixed-size hash.
fn borsh_size_option_hash() -> usize {
    OPTION_DISCRIMINATOR_SIZE + HASH_SIZE
}

/// Calculate the Borsh serialization size of a Vec<String> with a maximum number of items and maximum item length
///
/// Returns the size in bytes that a Vec<String> will occupy when serialized with Borsh,
/// accounting for the length prefix and the maximum possible number of strings each with their maximum length.
fn borsh_size_vec_string(max_items: usize, max_item_len: usize) -> usize {
    STRING_LEN_PREFIX_SIZE + (max_items * borsh_size_string(max_item_len))
}

/// Calculate the Borsh serialization size of a Vec<T> where T implements AccountSize
///
/// Returns the size in bytes that a Vec<T> will occupy when serialized with Borsh,
/// accounting for the length prefix and the maximum possible number of items each with their fixed size.
fn borsh_size_vec_struct<T: AccountSize>(max_items: usize) -> usize {
    STRING_LEN_PREFIX_SIZE + (max_items * T::ACCOUNT_SIZE)
}

/// Trait for determining the fixed size of a struct when serialized with Borsh
///
/// Used to calculate the space requirements for storing collections of structs in accounts.
trait AccountSize { // Trait to get struct size for Vec calculations
    /// The size in bytes that this type occupies when serialized with Borsh
    const ACCOUNT_SIZE: usize;
}

/// # Solana AI Registries Program
///
/// This program module implements the core functionality for both the Agent Registry and 
/// the MCP Server Registry protocols. It provides instructions for registering, updating,
/// and managing entities in each registry.
#[program]
pub mod solana_ai_registries {
    use super::*;

    // --- Agent Registry Instructions ---

    /// Register a new agent in the Agent Registry
    ///
    /// This instruction initializes a new PDA account for the agent and populates it with
    /// the provided details. The PDA is derived using the agent_id as a seed.
    /// The payer of the transaction funds the new PDA account with enough lamports to make
    /// it rent-exempt.
    ///
    /// Emits an `AgentRegistered` event containing the full agent data.
    ///
    /// # Parameters
    /// * `ctx` - The context containing accounts involved in the instruction
    /// * `agent_id` - Unique identifier for the agent
    /// * `name` - Human-readable name of the agent
    /// * `description` - Human-readable description of the agent
    /// * `agent_version` - Version of the agent software/implementation
    /// * `provider_name` - Optional name of the agent's provider organization
    /// * `provider_url` - Optional URL of the agent's provider
    /// * `documentation_url` - Optional URL to human-readable documentation
    /// * `service_endpoints_input` - List of service endpoints where the agent can be reached
    /// * `capabilities_flags` - Bitmask for core A2A capabilities
    /// * `supported_input_modes_input` - Default accepted input MIME types
    /// * `supported_output_modes_input` - Default produced output MIME types
    /// * `skills_input` - Summary of key agent skills
    /// * `security_info_uri` - Optional URI to detailed security scheme definitions
    /// * `aea_address` - Optional Fetch.ai AEA address/ID
    /// * `economic_intent_summary` - Optional brief summary of agent's economic goals
    /// * `supported_aea_protocols_hash` - Optional SHA256 hash of supported AEA protocol IDs
    /// * `extended_metadata_uri` - Optional URI to extensive off-chain metadata
    /// * `tags_input` - General discoverability tags for the agent
    ///
    /// # Returns
    /// * Result indicating success or providing error details
    pub fn register_agent(
        ctx: Context<RegisterAgent>,
        agent_id: String,
        name: String,
        description: String,
        agent_version: String,
        provider_name: Option<String>,
        provider_url: Option<String>,
        documentation_url: Option<String>,
        service_endpoints_input: Vec<ServiceEndpointInput>,
        capabilities_flags: u64,
        supported_input_modes_input: Vec<String>,
        supported_output_modes_input: Vec<String>,
        skills_input: Vec<AgentSkillInput>,
        security_info_uri: Option<String>,
        aea_address: Option<String>,
        economic_intent_summary: Option<String>,
        supported_aea_protocols_hash: Option<[u8; HASH_SIZE]>,
        extended_metadata_uri: Option<String>,
        tags_input: Vec<String>,
    ) -> Result<()> {
        // Exhaustive Input validations
        if agent_id.len() > MAX_AGENT_ID_LEN || agent_id.is_empty() { return err!(ErrorCode::InvalidAgentIdLength); }
        if name.len() > MAX_AGENT_NAME_LEN || name.is_empty() { return err!(ErrorCode::InvalidNameLength); }
        if description.len() > MAX_AGENT_DESCRIPTION_LEN { return err!(ErrorCode::InvalidDescriptionLength); } // Can be empty
        if agent_version.len() > MAX_AGENT_VERSION_LEN || agent_version.is_empty() { return err!(ErrorCode::InvalidVersionLength); }
        if let Some(ref val) = provider_name { if val.len() > MAX_PROVIDER_NAME_LEN { return err!(ErrorCode::InvalidProviderNameLength); }}
        if let Some(ref val) = provider_url { if val.len() > MAX_PROVIDER_URL_LEN { return err!(ErrorCode::InvalidProviderUrlLength); }}
        if let Some(ref val) = documentation_url { if val.len() > MAX_DOCUMENTATION_URL_LEN { return err!(ErrorCode::InvalidDocumentationUrlLength); }}
        
        if service_endpoints_input.len() > MAX_SERVICE_ENDPOINTS { return err!(ErrorCode::TooManyServiceEndpoints); }
        for se in &service_endpoints_input {
            if se.protocol.len() > MAX_ENDPOINT_PROTOCOL_LEN || se.protocol.is_empty() { return err!(ErrorCode::InvalidEndpointProtocolLength); }
            if se.url.len() > MAX_ENDPOINT_URL_LEN || se.url.is_empty() { return err!(ErrorCode::InvalidEndpointUrlLength); }
        }
        
        if supported_input_modes_input.len() > MAX_SUPPORTED_MODES { return err!(ErrorCode::TooManySupportedModes); }
        for mode in &supported_input_modes_input { if mode.len() > MAX_MODE_LEN || mode.is_empty() { return err!(ErrorCode::InvalidModeLength); }}
        
        if supported_output_modes_input.len() > MAX_SUPPORTED_MODES { return err!(ErrorCode::TooManySupportedModes); }
        for mode in &supported_output_modes_input { if mode.len() > MAX_MODE_LEN || mode.is_empty() { return err!(ErrorCode::InvalidModeLength); }}
        
        if skills_input.len() > MAX_SKILLS { return err!(ErrorCode::TooManySkills); }
        for skill in &skills_input {
            if skill.id.len() > MAX_SKILL_ID_LEN || skill.id.is_empty() { return err!(ErrorCode::InvalidSkillIdLength); }
            if skill.name.len() > MAX_SKILL_NAME_LEN || skill.name.is_empty() { return err!(ErrorCode::InvalidSkillNameLength); }
            if skill.tags.len() > MAX_SKILL_TAGS { return err!(ErrorCode::TooManySkillTags); }
            for tag in &skill.tags { if tag.len() > MAX_SKILL_TAG_LEN || tag.is_empty() { return err!(ErrorCode::InvalidSkillTagLength); }}
        }
        
        if let Some(ref val) = security_info_uri { if val.len() > MAX_SECURITY_INFO_URI_LEN { return err!(ErrorCode::InvalidSecurityInfoUriLength); }}
        if let Some(ref val) = aea_address { if val.len() > MAX_AEA_ADDRESS_LEN { return err!(ErrorCode::InvalidAeaAddressLength); }}
        if let Some(ref val) = economic_intent_summary { if val.len() > MAX_ECONOMIC_INTENT_LEN { return err!(ErrorCode::InvalidEconomicIntentLength); }}
        if let Some(ref val) = extended_metadata_uri { if val.len() > MAX_EXTENDED_METADATA_URI_LEN { return err!(ErrorCode::InvalidExtendedMetadataUriLength); }}
        
        if tags_input.len() > MAX_AGENT_TAGS { return err!(ErrorCode::TooManyAgentTags); }
        for tag in &tags_input { if tag.len() > MAX_AGENT_TAG_LEN || tag.is_empty() { return err!(ErrorCode::InvalidAgentTagLength); }}

        let agent_entry = &mut ctx.accounts.agent_entry;
        agent_entry.bump = *ctx.bumps.get("agent_entry").ok_or(ErrorCode::BumpSeedNotInHashMap)?;
        agent_entry.registry_version = 1;
        agent_entry.owner_authority = ctx.accounts.owner_authority.key();
        agent_entry.agent_id = agent_id.clone(); 
        agent_entry.name = name;
        agent_entry.description = description;
        agent_entry.agent_version = agent_version;
        agent_entry.provider_name = provider_name;
        agent_entry.provider_url = provider_url;
        agent_entry.documentation_url = documentation_url;
        
        agent_entry.service_endpoints = service_endpoints_input.into_iter().map(|sei| sei.into()).collect();
        let default_count = agent_entry.service_endpoints.iter().filter(|se| se.is_default).count();
        if default_count > 1 { return err!(ErrorCode::MultipleDefaultEndpoints); }
        if default_count == 0 && !agent_entry.service_endpoints.is_empty() { return err!(ErrorCode::MissingDefaultEndpoint); }

        agent_entry.capabilities_flags = capabilities_flags;
        agent_entry.supported_input_modes = supported_input_modes_input;
        agent_entry.supported_output_modes = supported_output_modes_input;
        agent_entry.skills = skills_input.into_iter().map(|asi| asi.into()).collect();
        agent_entry.security_info_uri = security_info_uri;
        agent_entry.aea_address = aea_address;
        agent_entry.economic_intent_summary = economic_intent_summary;
        agent_entry.supported_aea_protocols_hash = supported_aea_protocols_hash;
        agent_entry.status = AgentStatus::Pending as u8; 
        agent_entry.registration_timestamp = Clock::get()?.unix_timestamp;
        agent_entry.last_update_timestamp = Clock::get()?.unix_timestamp;
        agent_entry.extended_metadata_uri = extended_metadata_uri;
        agent_entry.tags = tags_input;

        emit!(AgentRegistered {
            registry_version: agent_entry.registry_version,
            owner_authority: agent_entry.owner_authority,
            agent_id: agent_entry.agent_id.clone(),
            name: agent_entry.name.clone(),
            description: agent_entry.description.clone(),
            agent_version: agent_entry.agent_version.clone(),
            provider_name: agent_entry.provider_name.clone(),
            provider_url: agent_entry.provider_url.clone(),
            documentation_url: agent_entry.documentation_url.clone(),
            service_endpoints: agent_entry.service_endpoints.clone(),
            capabilities_flags: agent_entry.capabilities_flags,
            supported_input_modes: agent_entry.supported_input_modes.clone(),
            supported_output_modes: agent_entry.supported_output_modes.clone(),
            skills: agent_entry.skills.clone(),
            security_info_uri: agent_entry.security_info_uri.clone(),
            aea_address: agent_entry.aea_address.clone(),
            economic_intent_summary: agent_entry.economic_intent_summary.clone(),
            supported_aea_protocols_hash: agent_entry.supported_aea_protocols_hash,
            status: agent_entry.status,
            registration_timestamp: agent_entry.registration_timestamp,
            last_update_timestamp: agent_entry.last_update_timestamp,
            extended_metadata_uri: agent_entry.extended_metadata_uri.clone(),
            tags: agent_entry.tags.clone(),
        });
        Ok(())
    }

    /// Update the details of an existing agent in the Agent Registry
    ///
    /// Allows the owner_authority to modify mutable fields of an existing agent entry.
    /// Only the fields provided in the input will be updated; other fields remain unchanged.
    /// The function performs validation on each provided field to ensure data integrity.
    ///
    /// Emits an `AgentUpdated` event, detailing the agent_id and the fields that were changed.
    ///
    /// # Parameters
    /// * `ctx` - The context containing accounts involved in the instruction
    /// * `details` - A struct containing optional fields to update; only provided fields will be changed
    ///
    /// # Returns
    /// * Result indicating success or providing error details
    pub fn update_agent_details(ctx: Context<UpdateAgent>, details: AgentUpdateDetailsInput) -> Result<()> {
        let agent_entry = &mut ctx.accounts.agent_entry;
        let mut changed_fields: Vec<String> = Vec::new();

        if let Some(val) = details.name {
            if val.len() > MAX_AGENT_NAME_LEN || val.is_empty() { return err!(ErrorCode::InvalidNameLength); }
            agent_entry.name = val; changed_fields.push("name".to_string());
        }
        if let Some(val) = details.description { // Description can be empty, but not exceed max length
            if val.len() > MAX_AGENT_DESCRIPTION_LEN { return err!(ErrorCode::InvalidDescriptionLength); }
            agent_entry.description = val; changed_fields.push("description".to_string());
        }
        if let Some(val) = details.agent_version {
            if val.len() > MAX_AGENT_VERSION_LEN || val.is_empty() { return err!(ErrorCode::InvalidVersionLength); }
            agent_entry.agent_version = val; changed_fields.push("agent_version".to_string());
        }
        
        macro_rules! update_optional_string_field {
            ($field_name:ident, $max_len:ident, $error_code:ident, $clear_flag:ident) => {
                if let Some(val) = details.$field_name {
                    if val.len() > $max_len { return err!(ErrorCode::$error_code); }
                    // Allow empty strings for optional fields if not explicitly disallowed by protocol for that field
                    agent_entry.$field_name = Some(val); changed_fields.push(stringify!($field_name).to_string());
                } else if details.$clear_flag.unwrap_or(false) {
                     agent_entry.$field_name = None; changed_fields.push(stringify!($field_name).to_string());
                }
            };
        }

        update_optional_string_field!(provider_name, MAX_PROVIDER_NAME_LEN, InvalidProviderNameLength, clear_provider_name);
        update_optional_string_field!(provider_url, MAX_PROVIDER_URL_LEN, InvalidProviderUrlLength, clear_provider_url);
        update_optional_string_field!(documentation_url, MAX_DOCUMENTATION_URL_LEN, InvalidDocumentationUrlLength, clear_documentation_url);
        update_optional_string_field!(security_info_uri, MAX_SECURITY_INFO_URI_LEN, InvalidSecurityInfoUriLength, clear_security_info_uri);
        update_optional_string_field!(aea_address, MAX_AEA_ADDRESS_LEN, InvalidAeaAddressLength, clear_aea_address);
        update_optional_string_field!(economic_intent_summary, MAX_ECONOMIC_INTENT_LEN, InvalidEconomicIntentLength, clear_economic_intent_summary);
        update_optional_string_field!(extended_metadata_uri, MAX_EXTENDED_METADATA_URI_LEN, InvalidExtendedMetadataUriLength, clear_extended_metadata_uri);


        if let Some(val) = details.service_endpoints {
            if val.len() > MAX_SERVICE_ENDPOINTS { return err!(ErrorCode::TooManyServiceEndpoints); }
            for se in &val {
                if se.protocol.len() > MAX_ENDPOINT_PROTOCOL_LEN || se.protocol.is_empty() { return err!(ErrorCode::InvalidEndpointProtocolLength); }
                if se.url.len() > MAX_ENDPOINT_URL_LEN || se.url.is_empty() { return err!(ErrorCode::InvalidEndpointUrlLength); }
            }
            let mapped_endpoints: Vec<ServiceEndpoint> = val.into_iter().map(|sei| sei.into()).collect();
            let default_count = mapped_endpoints.iter().filter(|se| se.is_default).count();
            if default_count > 1 { return err!(ErrorCode::MultipleDefaultEndpoints); }
            if default_count == 0 && !mapped_endpoints.is_empty() { return err!(ErrorCode::MissingDefaultEndpoint); }
            agent_entry.service_endpoints = mapped_endpoints; changed_fields.push("service_endpoints".to_string());
        }

        if let Some(val) = details.capabilities_flags { agent_entry.capabilities_flags = val; changed_fields.push("capabilities_flags".to_string());}
        
        if let Some(val) = details.supported_input_modes {
            if val.len() > MAX_SUPPORTED_MODES { return err!(ErrorCode::TooManySupportedModes); }
            for mode in &val { if mode.len() > MAX_MODE_LEN || mode.is_empty() { return err!(ErrorCode::InvalidModeLength); }}
            agent_entry.supported_input_modes = val; changed_fields.push("supported_input_modes".to_string());
        }
        if let Some(val) = details.supported_output_modes {
            if val.len() > MAX_SUPPORTED_MODES { return err!(ErrorCode::TooManySupportedModes); }
            for mode in &val { if mode.len() > MAX_MODE_LEN || mode.is_empty() { return err!(ErrorCode::InvalidModeLength); }}
            agent_entry.supported_output_modes = val; changed_fields.push("supported_output_modes".to_string());
        }

        if let Some(val) = details.skills {
            if val.len() > MAX_SKILLS { return err!(ErrorCode::TooManySkills); }
            for skill in &val {
                if skill.id.len() > MAX_SKILL_ID_LEN || skill.id.is_empty() { return err!(ErrorCode::InvalidSkillIdLength); }
                if skill.name.len() > MAX_SKILL_NAME_LEN || skill.name.is_empty() { return err!(ErrorCode::InvalidSkillNameLength); }
                if skill.tags.len() > MAX_SKILL_TAGS { return err!(ErrorCode::TooManySkillTags); }
                for tag in &skill.tags { if tag.len() > MAX_SKILL_TAG_LEN || tag.is_empty() { return err!(ErrorCode::InvalidSkillTagLength); }}
            }
            agent_entry.skills = val.into_iter().map(|asi| asi.into()).collect(); changed_fields.push("skills".to_string());
        }
        
        if let Some(val) = details.supported_aea_protocols_hash { 
            agent_entry.supported_aea_protocols_hash = Some(val); changed_fields.push("supported_aea_protocols_hash".to_string());
        } else if details.clear_supported_aea_protocols_hash.unwrap_or(false) { 
            agent_entry.supported_aea_protocols_hash = None; changed_fields.push("supported_aea_protocols_hash".to_string());
        }

        if let Some(val) = details.tags {
            if val.len() > MAX_AGENT_TAGS { return err!(ErrorCode::TooManyAgentTags); }
            for tag in &val { if tag.len() > MAX_AGENT_TAG_LEN || tag.is_empty() { return err!(ErrorCode::InvalidAgentTagLength); }}
            agent_entry.tags = val; changed_fields.push("tags".to_string());
        }

        if changed_fields.is_empty() { return Ok(()); } 

        agent_entry.last_update_timestamp = Clock::get()?.unix_timestamp;
        emit!(AgentUpdated {
            agent_id: agent_entry.agent_id.clone(),
            changed_fields: changed_fields,
            last_update_timestamp: agent_entry.last_update_timestamp,
        });
        Ok(())
    }

    /// Update the status of an existing agent in the Agent Registry
    ///
    /// A specialized instruction for changing the agent's operational status 
    /// (Pending, Active, Inactive, Deregistered).
    /// Requires owner_authority signature for authorization.
    ///
    /// Emits an `AgentStatusChanged` event with agent_id and the new_status.
    ///
    /// # Parameters
    /// * `ctx` - The context containing accounts involved in the instruction
    /// * `new_status_val` - The new status value (0: Pending, 1: Active, 2: Inactive, 3: Deregistered)
    ///
    /// # Returns
    /// * Result indicating success or providing error details
    pub fn update_agent_status(ctx: Context<UpdateAgent>, new_status_val: u8) -> Result<()> {
        let agent_entry = &mut ctx.accounts.agent_entry;
        let new_status = AgentStatus::from_u8(new_status_val).ok_or(ErrorCode::InvalidAgentStatus)?;
        if agent_entry.status == new_status as u8 { return Ok(()); } 
        agent_entry.status = new_status as u8;
        agent_entry.last_update_timestamp = Clock::get()?.unix_timestamp;
        emit!(AgentStatusChanged {
            agent_id: agent_entry.agent_id.clone(),
            new_status: agent_entry.status,
            last_update_timestamp: agent_entry.last_update_timestamp,
        });
        Ok(())
    }

    /// Deregister an agent from the Agent Registry
    ///
    /// Allows the owner_authority to mark an agent as deregistered.
    /// This changes the agent's status to Deregistered, preserving its history
    /// rather than completely removing the entry.
    ///
    /// Emits an `AgentDeregistered` event with agent_id and deregistration timestamp.
    ///
    /// # Parameters
    /// * `ctx` - The context containing accounts involved in the instruction
    ///
    /// # Returns
    /// * Result indicating success or providing error details
    pub fn deregister_agent(ctx: Context<UpdateAgent>) -> Result<()> {
        let agent_entry = &mut ctx.accounts.agent_entry;
        if agent_entry.status == AgentStatus::Deregistered as u8 { return Ok(()); } 

        agent_entry.status = AgentStatus::Deregistered as u8;
        agent_entry.last_update_timestamp = Clock::get()?.unix_timestamp;
        
        emit!(AgentDeregistered {
            agent_id: agent_entry.agent_id.clone(),
            deregistration_timestamp: agent_entry.last_update_timestamp,
        });
        Ok(())
    }

    // --- MCP Server Registry Instructions ---

    /// Register a new MCP server in the MCP Server Registry
    ///
    /// This instruction initializes a new PDA account for the MCP server and populates it with
    /// the provided details. The PDA is derived using the server_id as a seed.
    /// The payer of the transaction funds the new PDA account with enough lamports to make
    /// it rent-exempt.
    ///
    /// MCP servers follow the Model Context Protocol specification, enabling AI applications
    /// to discover and interact with external data sources and tools.
    ///
    /// Emits an `McpServerRegistered` event containing the full server data.
    ///
    /// # Parameters
    /// * `ctx` - The context containing accounts involved in the instruction
    /// * `server_id` - Unique identifier for the MCP server
    /// * `name` - Human-readable name of the server
    /// * `server_version` - Version of the MCP server software
    /// * `service_endpoint` - Primary URL for MCP communication 
    /// * `documentation_url` - Optional URL to human-readable documentation
    /// * `server_capabilities_summary` - Optional brief summary of server offerings
    /// * `supports_resources` - Whether server offers MCP Resources
    /// * `supports_tools` - Whether server offers MCP Tools
    /// * `supports_prompts` - Whether server offers MCP Prompts
    /// * `onchain_tool_definitions_input` - Summary of key on-chain advertised tools
    /// * `onchain_resource_definitions_input` - Summary of key on-chain advertised resources
    /// * `onchain_prompt_definitions_input` - Summary of key on-chain advertised prompts
    /// * `full_capabilities_uri` - Optional URI to off-chain JSON with full tool/resource/prompt definitions
    /// * `tags_input` - General discoverability tags for the server
    ///
    /// # Returns
    /// * Result indicating success or providing error details
    pub fn register_mcp_server(
        ctx: Context<RegisterMcpServer>,
        server_id: String,
        name: String,
        server_version: String,
        service_endpoint: String,
        documentation_url: Option<String>,
        server_capabilities_summary: Option<String>,
        supports_resources: bool,
        supports_tools: bool,
        supports_prompts: bool,
        onchain_tool_definitions_input: Vec<McpToolDefinitionOnChainInput>,
        onchain_resource_definitions_input: Vec<McpResourceDefinitionOnChainInput>,
        onchain_prompt_definitions_input: Vec<McpPromptDefinitionOnChainInput>,
        full_capabilities_uri: Option<String>,
        tags_input: Vec<String>,
    ) -> Result<()> {
        // Exhaustive Input validations
        if server_id.len() > MAX_SERVER_ID_LEN || server_id.is_empty() { return err!(ErrorCode::InvalidServerIdLength); }
        if name.len() > MAX_SERVER_NAME_LEN || name.is_empty() { return err!(ErrorCode::InvalidNameLength); }
        if server_version.len() > MAX_SERVER_VERSION_LEN || server_version.is_empty() { return err!(ErrorCode::InvalidVersionLength); }
        if service_endpoint.len() > MAX_SERVER_ENDPOINT_URL_LEN || service_endpoint.is_empty() { return err!(ErrorCode::InvalidEndpointUrlLength); }
        // Assuming HTTPS is a client-side or off-chain indexer validation for URIs, not strictly on-chain unless specified
        if let Some(ref val) = documentation_url { if val.len() > MAX_DOCUMENTATION_URL_LEN { return err!(ErrorCode::InvalidDocumentationUrlLength); }}
        if let Some(ref val) = server_capabilities_summary { if val.len() > MAX_SERVER_CAPABILITIES_SUMMARY_LEN { return err!(ErrorCode::InvalidServerCapabilitiesSummaryLength); }}
        
        if onchain_tool_definitions_input.len() > MAX_ONCHAIN_TOOL_DEFINITIONS {return err!(ErrorCode::TooManyToolDefinitions); }
        for tool_def in &onchain_tool_definitions_input {
            if tool_def.name.len() > MAX_TOOL_NAME_LEN || tool_def.name.is_empty() { return err!(ErrorCode::InvalidToolNameLength); }
            if tool_def.tags.len() > MAX_TOOL_TAGS { return err!(ErrorCode::TooManyToolTags); }
            for tag in &tool_def.tags { if tag.len() > MAX_TOOL_TAG_LEN || tag.is_empty() { return err!(ErrorCode::InvalidToolTagLength); }}
        }
        
        if onchain_resource_definitions_input.len() > MAX_ONCHAIN_RESOURCE_DEFINITIONS {return err!(ErrorCode::TooManyResourceDefinitions); }
        for res_def in &onchain_resource_definitions_input {
            if res_def.uri_pattern.len() > MAX_RESOURCE_URI_PATTERN_LEN || res_def.uri_pattern.is_empty() { return err!(ErrorCode::InvalidResourceUriPatternLength); }
            if res_def.tags.len() > MAX_RESOURCE_TAGS { return err!(ErrorCode::TooManyResourceTags); }
            for tag in &res_def.tags { if tag.len() > MAX_RESOURCE_TAG_LEN || tag.is_empty() { return err!(ErrorCode::InvalidResourceTagLength); }}
        }

        if onchain_prompt_definitions_input.len() > MAX_ONCHAIN_PROMPT_DEFINITIONS {return err!(ErrorCode::TooManyPromptDefinitions); }
         for prompt_def in &onchain_prompt_definitions_input {
            if prompt_def.name.len() > MAX_PROMPT_NAME_LEN || prompt_def.name.is_empty() { return err!(ErrorCode::InvalidPromptNameLength); }
            if prompt_def.tags.len() > MAX_PROMPT_TAGS { return err!(ErrorCode::TooManyPromptTags); }
            for tag in &prompt_def.tags { if tag.len() > MAX_PROMPT_TAG_LEN || tag.is_empty() { return err!(ErrorCode::InvalidPromptTagLength); }}
        }

        if let Some(ref val) = full_capabilities_uri { if val.len() > MAX_FULL_CAPABILITIES_URI_LEN { return err!(ErrorCode::InvalidFullCapabilitiesUriLength); }}
        
        if tags_input.len() > MAX_SERVER_TAGS { return err!(ErrorCode::TooManyServerTags); }
        for tag in &tags_input { if tag.len() > MAX_SERVER_TAG_LEN || tag.is_empty() { return err!(ErrorCode::InvalidServerTagLength); }}


        let mcp_server_entry = &mut ctx.accounts.mcp_server_entry;
        mcp_server_entry.bump = *ctx.bumps.get("mcp_server_entry").ok_or(ErrorCode::BumpSeedNotInHashMap)?;
        mcp_server_entry.registry_version = 1;
        mcp_server_entry.owner_authority = ctx.accounts.owner_authority.key();
        mcp_server_entry.server_id = server_id.clone();
        mcp_server_entry.name = name;
        mcp_server_entry.server_version = server_version;
        mcp_server_entry.service_endpoint = service_endpoint;
        mcp_server_entry.documentation_url = documentation_url;
        mcp_server_entry.server_capabilities_summary = server_capabilities_summary;
        mcp_server_entry.supports_resources = supports_resources;
        mcp_server_entry.supports_tools = supports_tools;
        mcp_server_entry.supports_prompts = supports_prompts;
        mcp_server_entry.onchain_tool_definitions = onchain_tool_definitions_input.into_iter().map(|i| i.into()).collect();
        mcp_server_entry.onchain_resource_definitions = onchain_resource_definitions_input.into_iter().map(|i| i.into()).collect();
        mcp_server_entry.onchain_prompt_definitions = onchain_prompt_definitions_input.into_iter().map(|i| i.into()).collect();
        mcp_server_entry.status = McpServerStatus::Pending as u8;
        mcp_server_entry.registration_timestamp = Clock::get()?.unix_timestamp;
        mcp_server_entry.last_update_timestamp = Clock::get()?.unix_timestamp;
        mcp_server_entry.full_capabilities_uri = full_capabilities_uri;
        mcp_server_entry.tags = tags_input;

        emit!(McpServerRegistered {
            registry_version: mcp_server_entry.registry_version,
            owner_authority: mcp_server_entry.owner_authority,
            server_id: mcp_server_entry.server_id.clone(),
            name: mcp_server_entry.name.clone(),
            server_version: mcp_server_entry.server_version.clone(),
            service_endpoint: mcp_server_entry.service_endpoint.clone(),
            documentation_url: mcp_server_entry.documentation_url.clone(),
            server_capabilities_summary: mcp_server_entry.server_capabilities_summary.clone(),
            supports_resources: mcp_server_entry.supports_resources,
            supports_tools: mcp_server_entry.supports_tools,
            supports_prompts: mcp_server_entry.supports_prompts,
            onchain_tool_definitions: mcp_server_entry.onchain_tool_definitions.clone(),
            onchain_resource_definitions: mcp_server_entry.onchain_resource_definitions.clone(),
            onchain_prompt_definitions: mcp_server_entry.onchain_prompt_definitions.clone(),
            status: mcp_server_entry.status,
            registration_timestamp: mcp_server_entry.registration_timestamp,
            last_update_timestamp: mcp_server_entry.last_update_timestamp,
            full_capabilities_uri: mcp_server_entry.full_capabilities_uri.clone(),
            tags: mcp_server_entry.tags.clone(),
        });
        Ok(())
    }
    
    /// Update the details of an existing MCP server in the MCP Server Registry
    ///
    /// Allows the owner_authority to modify mutable fields of an existing MCP server entry.
    /// Only the fields provided in the input will be updated; other fields remain unchanged.
    /// The function performs validation on each provided field to ensure data integrity.
    ///
    /// Emits an `McpServerUpdated` event, detailing the server_id and the fields that were changed.
    ///
    /// # Parameters
    /// * `ctx` - The context containing accounts involved in the instruction
    /// * `details` - A struct containing optional fields to update; only provided fields will be changed
    ///
    /// # Returns
    /// * Result indicating success or providing error details
    pub fn update_mcp_server_details(ctx: Context<UpdateMcpServer>, details: McpServerUpdateDetailsInput) -> Result<()> {
        let mcp_server_entry = &mut ctx.accounts.mcp_server_entry;
        let mut changed_fields: Vec<String> = Vec::new();

        if let Some(val) = details.name {
            if val.len() > MAX_SERVER_NAME_LEN || val.is_empty() { return err!(ErrorCode::InvalidNameLength); }
            mcp_server_entry.name = val; changed_fields.push("name".to_string());
        }
        if let Some(val) = details.server_version {
            if val.len() > MAX_SERVER_VERSION_LEN || val.is_empty() { return err!(ErrorCode::InvalidVersionLength); }
            mcp_server_entry.server_version = val; changed_fields.push("server_version".to_string());
        }
        if let Some(val) = details.service_endpoint {
            if val.len() > MAX_SERVER_ENDPOINT_URL_LEN || val.is_empty() { return err!(ErrorCode::InvalidEndpointUrlLength); }
            mcp_server_entry.service_endpoint = val; changed_fields.push("service_endpoint".to_string());
        }

        macro_rules! update_mcp_optional_string_field {
            ($field_name:ident, $max_len:ident, $error_code:ident, $clear_flag:ident) => {
                if let Some(val) = details.$field_name {
                    if val.len() > $max_len { return err!(ErrorCode::$error_code); }
                    mcp_server_entry.$field_name = Some(val); changed_fields.push(stringify!($field_name).to_string());
                } else if details.$clear_flag.unwrap_or(false) {
                     mcp_server_entry.$field_name = None; changed_fields.push(stringify!($field_name).to_string());
                }
            };
        }
        update_mcp_optional_string_field!(documentation_url, MAX_DOCUMENTATION_URL_LEN, InvalidDocumentationUrlLength, clear_documentation_url);
        update_mcp_optional_string_field!(server_capabilities_summary, MAX_SERVER_CAPABILITIES_SUMMARY_LEN, InvalidServerCapabilitiesSummaryLength, clear_server_capabilities_summary);
        update_mcp_optional_string_field!(full_capabilities_uri, MAX_FULL_CAPABILITIES_URI_LEN, InvalidFullCapabilitiesUriLength, clear_full_capabilities_uri);

        if let Some(val) = details.supports_resources { mcp_server_entry.supports_resources = val; changed_fields.push("supports_resources".to_string());}
        if let Some(val) = details.supports_tools { mcp_server_entry.supports_tools = val; changed_fields.push("supports_tools".to_string());}
        if let Some(val) = details.supports_prompts { mcp_server_entry.supports_prompts = val; changed_fields.push("supports_prompts".to_string());}

        if let Some(val) = details.onchain_tool_definitions {
            if val.len() > MAX_ONCHAIN_TOOL_DEFINITIONS {return err!(ErrorCode::TooManyToolDefinitions); }
            for tool_def in &val {
                if tool_def.name.len() > MAX_TOOL_NAME_LEN || tool_def.name.is_empty() { return err!(ErrorCode::InvalidToolNameLength); }
                if tool_def.tags.len() > MAX_TOOL_TAGS { return err!(ErrorCode::TooManyToolTags); }
                for tag in &tool_def.tags { if tag.len() > MAX_TOOL_TAG_LEN || tag.is_empty() { return err!(ErrorCode::InvalidToolTagLength); }}
            }
            mcp_server_entry.onchain_tool_definitions = val.into_iter().map(|i| i.into()).collect(); changed_fields.push("onchain_tool_definitions".to_string());
        }
        if let Some(val) = details.onchain_resource_definitions {
            if val.len() > MAX_ONCHAIN_RESOURCE_DEFINITIONS {return err!(ErrorCode::TooManyResourceDefinitions); }
            for res_def in &val {
                if res_def.uri_pattern.len() > MAX_RESOURCE_URI_PATTERN_LEN || res_def.uri_pattern.is_empty() { return err!(ErrorCode::InvalidResourceUriPatternLength); }
                if res_def.tags.len() > MAX_RESOURCE_TAGS { return err!(ErrorCode::TooManyResourceTags); }
                for tag in &res_def.tags { if tag.len() > MAX_RESOURCE_TAG_LEN || tag.is_empty() { return err!(ErrorCode::InvalidResourceTagLength); }}
            }
            mcp_server_entry.onchain_resource_definitions = val.into_iter().map(|i| i.into()).collect(); changed_fields.push("onchain_resource_definitions".to_string());
        }
        if let Some(val) = details.onchain_prompt_definitions {
            if val.len() > MAX_ONCHAIN_PROMPT_DEFINITIONS {return err!(ErrorCode::TooManyPromptDefinitions); }
            for prompt_def in &val {
                if prompt_def.name.len() > MAX_PROMPT_NAME_LEN || prompt_def.name.is_empty() { return err!(ErrorCode::InvalidPromptNameLength); }
                if prompt_def.tags.len() > MAX_PROMPT_TAGS { return err!(ErrorCode::TooManyPromptTags); }
                for tag in &prompt_def.tags { if tag.len() > MAX_PROMPT_TAG_LEN || tag.is_empty() { return err!(ErrorCode::InvalidPromptTagLength); }}
            }
            mcp_server_entry.onchain_prompt_definitions = val.into_iter().map(|i| i.into()).collect(); changed_fields.push("onchain_prompt_definitions".to_string());
        }
        
        if let Some(val) = details.tags {
            if val.len() > MAX_SERVER_TAGS { return err!(ErrorCode::TooManyServerTags); }
            for tag in &val { if tag.len() > MAX_SERVER_TAG_LEN || tag.is_empty() { return err!(ErrorCode::InvalidServerTagLength); }}
            mcp_server_entry.tags = val; changed_fields.push("tags".to_string());
        }

        if changed_fields.is_empty() { return Ok(()); }

        mcp_server_entry.last_update_timestamp = Clock::get()?.unix_timestamp;
        emit!(McpServerUpdated {
            server_id: mcp_server_entry.server_id.clone(),
            changed_fields: changed_fields,
            last_update_timestamp: mcp_server_entry.last_update_timestamp,
        });
        Ok(())
    }

    /// Update the status of an existing MCP server in the MCP Server Registry
    ///
    /// A specialized instruction for changing the MCP server's operational status
    /// (Pending, Active, Inactive, Deregistered).
    /// Requires owner_authority signature for authorization.
    ///
    /// Emits an `McpServerStatusChanged` event with server_id and the new_status.
    ///
    /// # Parameters
    /// * `ctx` - The context containing accounts involved in the instruction
    /// * `new_status_val` - The new status value (0: Pending, 1: Active, 2: Inactive, 3: Deregistered)
    ///
    /// # Returns
    /// * Result indicating success or providing error details
    pub fn update_mcp_server_status(ctx: Context<UpdateMcpServer>, new_status_val: u8) -> Result<()> {
        let mcp_server_entry = &mut ctx.accounts.mcp_server_entry;
        let new_status = McpServerStatus::from_u8(new_status_val).ok_or(ErrorCode::InvalidMcpServerStatus)?;
        if mcp_server_entry.status == new_status as u8 { return Ok(()); }
        mcp_server_entry.status = new_status as u8;
        mcp_server_entry.last_update_timestamp = Clock::get()?.unix_timestamp;
        emit!(McpServerStatusChanged {
            server_id: mcp_server_entry.server_id.clone(),
            new_status: mcp_server_entry.status,
            last_update_timestamp: mcp_server_entry.last_update_timestamp,
        });
        Ok(())
    }

    /// Deregister an MCP server from the MCP Server Registry
    ///
    /// Allows the owner_authority to mark an MCP server as deregistered.
    /// This changes the server's status to Deregistered, preserving its history
    /// rather than completely removing the entry.
    ///
    /// Emits an `McpServerDeregistered` event with server_id and deregistration timestamp.
    ///
    /// # Parameters
    /// * `ctx` - The context containing accounts involved in the instruction
    ///
    /// # Returns
    /// * Result indicating success or providing error details
    pub fn deregister_mcp_server(ctx: Context<UpdateMcpServer>) -> Result<()> {
        let mcp_server_entry = &mut ctx.accounts.mcp_server_entry;
        if mcp_server_entry.status == McpServerStatus::Deregistered as u8 { return Ok(()); }
        mcp_server_entry.status = McpServerStatus::Deregistered as u8;
        mcp_server_entry.last_update_timestamp = Clock::get()?.unix_timestamp;
        emit!(McpServerDeregistered {
            server_id: mcp_server_entry.server_id.clone(),
            deregistration_timestamp: mcp_server_entry.last_update_timestamp,
        });
        Ok(())
    }
}

// --- Account Context Structs ---

/// Accounts required for the register_agent instruction
///
/// This struct defines the accounts that must be provided when calling the register_agent instruction.
/// It creates a new PDA for the agent entry, using the agent_id as a seed.
#[derive(Accounts)]
#[instruction(agent_id: String)]
pub struct RegisterAgent<'info> {
    /// The agent registry entry account (PDA) to be created
    #[account(
        init,
        payer = payer,
        space = AgentRegistryEntryV1::ACCOUNT_SIZE, 
        seeds = [AGENT_REGISTRY_PDA_SEED, agent_id.as_bytes()],
        bump
    )]
    pub agent_entry: Account<'info, AgentRegistryEntryV1>,
    /// The authority that will own and control this agent entry
    #[account(mut)]
    pub owner_authority: Signer<'info>, 
    /// The account that will pay for the rent of the new agent entry account
    #[account(mut)]
    pub payer: Signer<'info>, 
    /// The system program to create the new account
    pub system_program: Program<'info, System>,
}

/// Accounts required for agent update instructions (update_agent_details, update_agent_status, deregister_agent)
///
/// This struct defines the accounts that must be provided when calling agent update instructions.
/// It verifies that the signer matches the owner_authority of the agent entry.
#[derive(Accounts)]
pub struct UpdateAgent<'info> {
    /// The existing agent registry entry account to be modified
    #[account(
        mut,
        seeds = [AGENT_REGISTRY_PDA_SEED, agent_entry.agent_id.as_bytes()],
        bump = agent_entry.bump,
        has_one = owner_authority @ ErrorCode::Unauthorized
    )]
    pub agent_entry: Account<'info, AgentRegistryEntryV1>,
    /// The authority that owns this agent entry, must sign to authorize changes
    #[account(mut)]
    pub owner_authority: Signer<'info>,
}

/// Accounts required for the register_mcp_server instruction
///
/// This struct defines the accounts that must be provided when calling the register_mcp_server instruction.
/// It creates a new PDA for the MCP server entry, using the server_id as a seed.
#[derive(Accounts)]
#[instruction(server_id: String)]
pub struct RegisterMcpServer<'info> {
    /// The MCP server registry entry account (PDA) to be created
    #[account(
        init,
        payer = payer,
        space = McpServerRegistryEntryV1::ACCOUNT_SIZE, 
        seeds = [MCP_SERVER_REGISTRY_PDA_SEED, server_id.as_bytes()],
        bump
    )]
    pub mcp_server_entry: Account<'info, McpServerRegistryEntryV1>,
    /// The authority that will own and control this MCP server entry
    #[account(mut)]
    pub owner_authority: Signer<'info>,
    /// The account that will pay for the rent of the new MCP server entry account
    #[account(mut)]
    pub payer: Signer<'info>,
    /// The system program to create the new account
    pub system_program: Program<'info, System>,
}

/// Accounts required for MCP server update instructions (update_mcp_server_details, update_mcp_server_status, deregister_mcp_server)
///
/// This struct defines the accounts that must be provided when calling MCP server update instructions.
/// It verifies that the signer matches the owner_authority of the MCP server entry.
#[derive(Accounts)]
pub struct UpdateMcpServer<'info> {
    /// The existing MCP server registry entry account to be modified
    #[account(
        mut,
        seeds = [MCP_SERVER_REGISTRY_PDA_SEED, mcp_server_entry.server_id.as_bytes()],
        bump = mcp_server_entry.bump,
        has_one = owner_authority @ ErrorCode::Unauthorized
    )]
    pub mcp_server_entry: Account<'info, McpServerRegistryEntryV1>,
    /// The authority that owns this MCP server entry, must sign to authorize changes
    #[account(mut)]
    pub owner_authority: Signer<'info>,
}


// --- State Structs (Accounts) ---

/// Agent Registry Entry (V1) - Solana account structure for storing agent data on-chain
///
/// This structure represents the on-chain data for a registered agent, following a hybrid approach:
/// - Core, frequently accessed data is stored directly on-chain
/// - Large or complex data can be referenced via off-chain URIs
/// - Verification hashes ensure integrity of off-chain data
///
/// The struct maps closely to concepts from the A2A AgentCard specification and AEA framework,
/// optimized for Solana's account model and storage constraints.
#[account]
#[derive(Default, Clone)]
pub struct AgentRegistryEntryV1 {
    /// Bump seed used for this PDA's derivation
    pub bump: u8,                           // 1
    /// Schema version of this entry (e.g., 1)
    pub registry_version: u8,               // 1
    /// Solana public key of the entry's owner/manager
    pub owner_authority: Pubkey,            // 32
    /// Unique identifier for the agent
    pub agent_id: String,                   // 4 + MAX_AGENT_ID_LEN
    /// Human-readable name of the agent
    pub name: String,                       // 4 + MAX_AGENT_NAME_LEN
    /// Human-readable description of the agent (can use CommonMark)
    pub description: String,                // 4 + MAX_AGENT_DESCRIPTION_LEN
    /// Version of the agent software/implementation
    pub agent_version: String,              // 4 + MAX_AGENT_VERSION_LEN
    /// Optional name of the agent's provider organization
    pub provider_name: Option<String>,      // 1 + (4 + MAX_PROVIDER_NAME_LEN)
    /// Optional URL of the agent's provider
    pub provider_url: Option<String>,       // 1 + (4 + MAX_PROVIDER_URL_LEN)
    /// Optional URL to human-readable documentation
    pub documentation_url: Option<String>,  // 1 + (4 + MAX_DOCUMENTATION_URL_LEN)
    /// List of service endpoints where the agent can be reached
    pub service_endpoints: Vec<ServiceEndpoint>, // 4 + MAX_SERVICE_ENDPOINTS * ServiceEndpoint::ACCOUNT_SIZE
    /// Bitmask for core A2A capabilities
    pub capabilities_flags: u64,            // 8
    /// Default accepted input MIME types
    pub supported_input_modes: Vec<String>, // 4 + MAX_SUPPORTED_MODES * (4 + MAX_MODE_LEN)
    /// Default produced output MIME types
    pub supported_output_modes: Vec<String>,// 4 + MAX_SUPPORTED_MODES * (4 + MAX_MODE_LEN)
    /// Summary of key agent skills
    pub skills: Vec<AgentSkill>,            // 4 + MAX_SKILLS * AgentSkill::ACCOUNT_SIZE
    /// Optional URI to detailed security scheme definitions (e.g., OpenAPI format)
    pub security_info_uri: Option<String>,  // 1 + (4 + MAX_SECURITY_INFO_URI_LEN)
    /// Optional Fetch.ai AEA address/ID
    pub aea_address: Option<String>,        // 1 + (4 + MAX_AEA_ADDRESS_LEN)
    /// Optional brief summary of the agent's economic goals
    pub economic_intent_summary: Option<String>, // 1 + (4 + MAX_ECONOMIC_INTENT_LEN)
    /// Optional SHA256 hash of a list of supported AEA protocol IDs
    pub supported_aea_protocols_hash: Option<[u8; HASH_SIZE]>, // 1 + HASH_SIZE
    /// Agent status (0:Pending, 1:Active, 2:Inactive, 3:Deregistered)
    pub status: u8,                         // 1 (Enum AgentStatus)
    /// Timestamp of initial registration
    pub registration_timestamp: i64,        // 8
    /// Timestamp of the last update
    pub last_update_timestamp: i64,         // 8
    /// Optional URI to extensive off-chain metadata (e.g., full AgentCard JSON)
    pub extended_metadata_uri: Option<String>,// 1 + (4 + MAX_EXTENDED_METADATA_URI_LEN)
    /// General discoverability tags for the agent
    pub tags: Vec<String>,                  // 4 + MAX_AGENT_TAGS * (4 + MAX_AGENT_TAG_LEN)
}

/// Implementation of the AccountSize trait for AgentRegistryEntryV1
///
/// Calculates the total space required for an AgentRegistryEntryV1 account when serialized with Borsh.
/// This includes the Anchor discriminator and all fields with their maximum possible sizes.
impl AccountSize for AgentRegistryEntryV1 { // Renamed from LEN to ACCOUNT_SIZE for consistency with trait
    const ACCOUNT_SIZE: usize = 8 // Anchor Discriminator
        + 1  // bump
        + 1  // registry_version
        + 32 // owner_authority
        + borsh_size_string(MAX_AGENT_ID_LEN)
        + borsh_size_string(MAX_AGENT_NAME_LEN)
        + borsh_size_string(MAX_AGENT_DESCRIPTION_LEN)
        + borsh_size_string(MAX_AGENT_VERSION_LEN)
        + borsh_size_option_string(MAX_PROVIDER_NAME_LEN)
        + borsh_size_option_string(MAX_PROVIDER_URL_LEN)
        + borsh_size_option_string(MAX_DOCUMENTATION_URL_LEN)
        + STRING_LEN_PREFIX_SIZE + (MAX_SERVICE_ENDPOINTS * ServiceEndpoint::ACCOUNT_SIZE) // service_endpoints
        + 8  // capabilities_flags
        + borsh_size_vec_string(MAX_SUPPORTED_MODES, MAX_MODE_LEN) // supported_input_modes
        + borsh_size_vec_string(MAX_SUPPORTED_MODES, MAX_MODE_LEN) // supported_output_modes
        + STRING_LEN_PREFIX_SIZE + (MAX_SKILLS * AgentSkill::ACCOUNT_SIZE) // skills
        + borsh_size_option_string(MAX_SECURITY_INFO_URI_LEN)
        + borsh_size_option_string(MAX_AEA_ADDRESS_LEN)
        + borsh_size_option_string(MAX_ECONOMIC_INTENT_LEN)
        + borsh_size_option_hash() // supported_aea_protocols_hash
        + 1  // status
        + 8  // registration_timestamp
        + 8  // last_update_timestamp
        + borsh_size_option_string(MAX_EXTENDED_METADATA_URI_LEN)
        + borsh_size_vec_string(MAX_AGENT_TAGS, MAX_AGENT_TAG_LEN); // tags
}


/// Service Endpoint definition for agents
///
/// Represents an endpoint where an agent can be accessed, including the protocol
/// type (e.g., "a2a_http_jsonrpc") and URL, with a flag indicating if this is
/// the default endpoint for the agent.
#[derive(AnchorSerialize, AnchorDeserialize, Clone, Default, Debug)]
pub struct ServiceEndpoint {
    /// Protocol type (e.g., "a2a_http_jsonrpc", "aea_p2p")
    pub protocol: String, 
    /// Endpoint URL
    pub url: String,      
    /// Indicates if this is the primary endpoint (only one can be true)
    pub is_default: bool,
}
/// Implementation of the AccountSize trait for ServiceEndpoint
impl AccountSize for ServiceEndpoint {
    const ACCOUNT_SIZE: usize = borsh_size_string(MAX_ENDPOINT_PROTOCOL_LEN) 
                              + borsh_size_string(MAX_ENDPOINT_URL_LEN) 
                              + 1; // is_default (bool)
}


/// Agent Skill definition
///
/// Represents a capability or function that an agent provides, including
/// an identifier, name, optional hash of a more detailed description (stored off-chain),
/// and associated tags for discovery and classification.
#[derive(AnchorSerialize, AnchorDeserialize, Clone, Default, Debug)]
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
/// Implementation of the AccountSize trait for AgentSkill
impl AccountSize for AgentSkill {
     const ACCOUNT_SIZE: usize = borsh_size_string(MAX_SKILL_ID_LEN) 
                               + borsh_size_string(MAX_SKILL_NAME_LEN) 
                               + borsh_size_option_hash() // description_hash
                               + borsh_size_vec_string(MAX_SKILL_TAGS, MAX_SKILL_TAG_LEN); // tags
}

/// MCP Server Registry Entry (V1) - Solana account structure for storing MCP server data on-chain
///
/// This structure represents the on-chain data for a registered Model Context Protocol (MCP) server,
/// using a hybrid approach similar to the Agent Registry:
/// - Core server information is stored on-chain
/// - A limited number of key tools, resources, and prompts are summarized on-chain
/// - Full definitions are accessible via the full_capabilities_uri, pointing to off-chain storage
///
/// The struct aligns with the MCP specification, particularly the information conveyed during
/// the MCP initialization handshake (ServerInfo, ServerCapabilities) and definitions
/// of offered tools, resources, and prompts.
#[account]
#[derive(Default, Clone)]
pub struct McpServerRegistryEntryV1 {
    /// Bump seed used for this PDA's derivation
    pub bump: u8,
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

/// Implementation of the AccountSize trait for McpServerRegistryEntryV1
///
/// Calculates the total space required for a McpServerRegistryEntryV1 account when serialized with Borsh.
/// This includes the Anchor discriminator and all fields with their maximum possible sizes.
impl AccountSize for McpServerRegistryEntryV1 {
    const ACCOUNT_SIZE: usize = 8 // Anchor Discriminator
        + 1  // bump
        + 1  // registry_version
        + 32 // owner_authority
        + borsh_size_string(MAX_SERVER_ID_LEN)
        + borsh_size_string(MAX_SERVER_NAME_LEN)
        + borsh_size_string(MAX_SERVER_VERSION_LEN)
        + borsh_size_string(MAX_SERVER_ENDPOINT_URL_LEN)
        + borsh_size_option_string(MAX_DOCUMENTATION_URL_LEN)
        + borsh_size_option_string(MAX_SERVER_CAPABILITIES_SUMMARY_LEN)
        + 1  // supports_resources (bool)
        + 1  // supports_tools (bool)
        + 1  // supports_prompts (bool)
        + STRING_LEN_PREFIX_SIZE + (MAX_ONCHAIN_TOOL_DEFINITIONS * McpToolDefinitionOnChain::ACCOUNT_SIZE)
        + STRING_LEN_PREFIX_SIZE + (MAX_ONCHAIN_RESOURCE_DEFINITIONS * McpResourceDefinitionOnChain::ACCOUNT_SIZE)
        + STRING_LEN_PREFIX_SIZE + (MAX_ONCHAIN_PROMPT_DEFINITIONS * McpPromptDefinitionOnChain::ACCOUNT_SIZE)
        + 1  // status
        + 8  // registration_timestamp
        + 8  // last_update_timestamp
        + borsh_size_option_string(MAX_FULL_CAPABILITIES_URI_LEN)
        + borsh_size_vec_string(MAX_SERVER_TAGS, MAX_SERVER_TAG_LEN); // tags
}


/// MCP Tool Definition for on-chain storage
///
/// Represents a summarized version of a tool offered by an MCP server.
/// Contains the name, hashes of detailed information (stored off-chain),
/// and tags for discovery.
///
/// This corresponds to the ToolDefinition in the MCP specification,
/// with complete details available via the server's full_capabilities_uri.
#[derive(AnchorSerialize, AnchorDeserialize, Clone, Default, Debug)]
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
/// Implementation of the AccountSize trait for McpToolDefinitionOnChain
impl AccountSize for McpToolDefinitionOnChain {
    const ACCOUNT_SIZE: usize = borsh_size_string(MAX_TOOL_NAME_LEN) 
                              + HASH_SIZE  // description_hash
                              + HASH_SIZE  // input_schema_hash
                              + HASH_SIZE  // output_schema_hash
                              + borsh_size_vec_string(MAX_TOOL_TAGS, MAX_TOOL_TAG_LEN); // tags
}


/// MCP Resource Definition for on-chain storage
///
/// Represents a summarized version of a resource offered by an MCP server.
/// Contains the URI pattern, hash of detailed description (stored off-chain),
/// and tags for discovery.
///
/// This corresponds to the ResourceDefinition in the MCP specification,
/// with complete details available via the server's full_capabilities_uri.
#[derive(AnchorSerialize, AnchorDeserialize, Clone, Default, Debug)]
pub struct McpResourceDefinitionOnChain {
    /// Resource URI or pattern
    pub uri_pattern: String, 
    /// SHA256 hash of ResourceDefinition.description
    pub description_hash: [u8; HASH_SIZE],
    /// Tags for resource discovery
    pub tags: Vec<String>, 
}
/// Implementation of the AccountSize trait for McpResourceDefinitionOnChain
impl AccountSize for McpResourceDefinitionOnChain {
     const ACCOUNT_SIZE: usize = borsh_size_string(MAX_RESOURCE_URI_PATTERN_LEN) 
                               + HASH_SIZE // description_hash
                               + borsh_size_vec_string(MAX_RESOURCE_TAGS, MAX_RESOURCE_TAG_LEN); // tags
}

/// MCP Prompt Definition for on-chain storage
///
/// Represents a summarized version of a prompt offered by an MCP server.
/// Contains the name, hash of detailed description (stored off-chain),
/// and tags for discovery.
///
/// This corresponds to the PromptDefinition in the MCP specification,
/// with complete details available via the server's full_capabilities_uri.
#[derive(AnchorSerialize, AnchorDeserialize, Clone, Default, Debug)]
pub struct McpPromptDefinitionOnChain {
    /// Prompt name
    pub name: String, 
    /// SHA256 hash of PromptDefinition.description
    pub description_hash: [u8; HASH_SIZE],
    /// Tags for prompt discovery
    pub tags: Vec<String>, 
}
/// Implementation of the AccountSize trait for McpPromptDefinitionOnChain
impl AccountSize for McpPromptDefinitionOnChain {
    const ACCOUNT_SIZE: usize = borsh_size_string(MAX_PROMPT_NAME_LEN) 
                              + HASH_SIZE // description_hash
                              + borsh_size_vec_string(MAX_PROMPT_TAGS, MAX_PROMPT_TAG_LEN); // tags
}


/// Service Endpoint Input struct 
///
/// Used for passing service endpoint data to the register_agent and update_agent_details instructions.
/// Converted to the ServiceEndpoint struct for storage.
#[derive(AnchorSerialize, AnchorDeserialize, Clone, Debug)]
pub struct ServiceEndpointInput {
    /// Protocol type (e.g., "a2a_http_jsonrpc", "aea_p2p")
    pub protocol: String,
    /// Endpoint URL
    pub url: String,
    /// Indicates if this is the primary endpoint (only one can be true)
    pub is_default: bool,
}
/// Implementation of From<ServiceEndpointInput> for ServiceEndpoint
impl From<ServiceEndpointInput> for ServiceEndpoint {
    fn from(item: ServiceEndpointInput) -> Self {
        ServiceEndpoint { protocol: item.protocol, url: item.url, is_default: item.is_default }
    }
}

/// Agent Skill Input struct
///
/// Used for passing agent skill data to the register_agent and update_agent_details instructions.
/// Converted to the AgentSkill struct for storage.
#[derive(AnchorSerialize, AnchorDeserialize, Clone, Debug)]
pub struct AgentSkillInput {
    /// Skill's unique ID within the agent
    pub id: String,
    /// Human-readable skill name
    pub name: String,
    /// Optional SHA256 hash of detailed skill description (full description off-chain)
    pub description_hash: Option<[u8; HASH_SIZE]>,
    /// Tags associated with the skill
    pub tags: Vec<String>,
}
/// Implementation of From<AgentSkillInput> for AgentSkill
impl From<AgentSkillInput> for AgentSkill {
    fn from(item: AgentSkillInput) -> Self {
        AgentSkill { id: item.id, name: item.name, description_hash: item.description_hash, tags: item.tags }
    }
}

/// Input struct for updating agent details
///
/// This structure contains all fields that can be updated in an agent entry.
/// All fields are optional - only the fields that should be updated need to be provided.
/// For optional string fields, there are associated "clear_*" boolean flags that can be
/// used to set those fields to None.
#[derive(AnchorSerialize, AnchorDeserialize, Clone, Debug, Default)]
pub struct AgentUpdateDetailsInput {
    /// New agent name (if provided)
    pub name: Option<String>,
    /// New agent description (if provided)
    pub description: Option<String>,
    /// New agent version (if provided)
    pub agent_version: Option<String>,
    /// New provider name (if provided)
    pub provider_name: Option<String>,
    /// Whether to clear the provider_name field
    pub clear_provider_name: Option<bool>,
    /// New provider URL (if provided)
    pub provider_url: Option<String>,
    /// Whether to clear the provider_url field
    pub clear_provider_url: Option<bool>,
    /// New documentation URL (if provided)
    pub documentation_url: Option<String>,
    /// Whether to clear the documentation_url field
    pub clear_documentation_url: Option<bool>,
    /// New service endpoints (if provided)
    pub service_endpoints: Option<Vec<ServiceEndpointInput>>,
    /// New capabilities flags (if provided)
    pub capabilities_flags: Option<u64>,
    /// New supported input modes (if provided)
    pub supported_input_modes: Option<Vec<String>>,
    /// New supported output modes (if provided)
    pub supported_output_modes: Option<Vec<String>>,
    /// New skills (if provided)
    pub skills: Option<Vec<AgentSkillInput>>,
    /// New security info URI (if provided)
    pub security_info_uri: Option<String>,
    /// Whether to clear the security_info_uri field
    pub clear_security_info_uri: Option<bool>,
    /// New AEA address (if provided)
    pub aea_address: Option<String>,
    /// Whether to clear the aea_address field
    pub clear_aea_address: Option<bool>,
    /// New economic intent summary (if provided)
    pub economic_intent_summary: Option<String>,
    /// Whether to clear the economic_intent_summary field
    pub clear_economic_intent_summary: Option<bool>,
    /// New supported AEA protocols hash (if provided)
    pub supported_aea_protocols_hash: Option<[u8; HASH_SIZE]>,
    /// Whether to clear the supported_aea_protocols_hash field
    pub clear_supported_aea_protocols_hash: Option<bool>,
    /// New extended metadata URI (if provided)
    pub extended_metadata_uri: Option<String>,
    /// Whether to clear the extended_metadata_uri field
    pub clear_extended_metadata_uri: Option<bool>,
    /// New tags (if provided)
    pub tags: Option<Vec<String>>,
}


/// MCP Tool Definition Input struct
///
/// Used for passing MCP tool definition data to the register_mcp_server and update_mcp_server_details instructions.
/// Converted to the McpToolDefinitionOnChain struct for storage.
#[derive(AnchorSerialize, AnchorDeserialize, Clone, Debug)]
pub struct McpToolDefinitionOnChainInput {
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
/// Implementation of From<McpToolDefinitionOnChainInput> for McpToolDefinitionOnChain
impl From<McpToolDefinitionOnChainInput> for McpToolDefinitionOnChain {
    fn from(item: McpToolDefinitionOnChainInput) -> Self { 
        McpToolDefinitionOnChain {
            name: item.name,
            description_hash: item.description_hash,
            input_schema_hash: item.input_schema_hash,
            output_schema_hash: item.output_schema_hash,
            tags: item.tags,
        }
    }
}

/// MCP Resource Definition Input struct
///
/// Used for passing MCP resource definition data to the register_mcp_server and update_mcp_server_details instructions.
/// Converted to the McpResourceDefinitionOnChain struct for storage.
#[derive(AnchorSerialize, AnchorDeserialize, Clone, Debug)]
pub struct McpResourceDefinitionOnChainInput {
    /// Resource URI or pattern
    pub uri_pattern: String,
    /// SHA256 hash of ResourceDefinition.description
    pub description_hash: [u8; HASH_SIZE],
    /// Tags for resource discovery
    pub tags: Vec<String>,
}
/// Implementation of From<McpResourceDefinitionOnChainInput> for McpResourceDefinitionOnChain
impl From<McpResourceDefinitionOnChainInput> for McpResourceDefinitionOnChain {
    fn from(item: McpResourceDefinitionOnChainInput) -> Self {
        McpResourceDefinitionOnChain {
            uri_pattern: item.uri_pattern,
            description_hash: item.description_hash,
            tags: item.tags,
        }
    }
}

/// MCP Prompt Definition Input struct
///
/// Used for passing MCP prompt definition data to the register_mcp_server and update_mcp_server_details instructions.
/// Converted to the McpPromptDefinitionOnChain struct for storage.
#[derive(AnchorSerialize, AnchorDeserialize, Clone, Debug)]
pub struct McpPromptDefinitionOnChainInput {
    /// Prompt name
    pub name: String,
    /// SHA256 hash of PromptDefinition.description
    pub description_hash: [u8; HASH_SIZE],
    /// Tags for prompt discovery
    pub tags: Vec<String>,
}
/// Implementation of From<McpPromptDefinitionOnChainInput> for McpPromptDefinitionOnChain
impl From<McpPromptDefinitionOnChainInput> for McpPromptDefinitionOnChain {
    fn from(item: McpPromptDefinitionOnChainInput) -> Self {
        McpPromptDefinitionOnChain {
            name: item.name,
            description_hash: item.description_hash,
            tags: item.tags,
        }
    }
}


/// Input struct for updating MCP server details
///
/// This structure contains all fields that can be updated in an MCP server entry.
/// All fields are optional - only the fields that should be updated need to be provided.
/// For optional string fields, there are associated "clear_*" boolean flags that can be
/// used to set those fields to None.
#[derive(AnchorSerialize, AnchorDeserialize, Clone, Debug, Default)]
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


// --- Enums ---

/// Status of an agent in the Agent Registry
///
/// Represents the current operational status of an agent.
#[repr(u8)]
#[derive(AnchorSerialize, AnchorDeserialize, Clone, Debug, PartialEq)]
pub enum AgentStatus {
    /// Agent is pending verification or initialization
    Pending = 0,
    /// Agent is active and operational
    Active = 1,
    /// Agent is temporarily inactive
    Inactive = 2,
    /// Agent has been deregistered and is no longer available
    Deregistered = 3, 
}
impl AgentStatus {
    /// Convert a u8 value to an AgentStatus enum variant
    ///
    /// Returns None if the value doesn't correspond to any valid status.
    fn from_u8(value: u8) -> Option<Self> {
        match value {
            0 => Some(AgentStatus::Pending), 1 => Some(AgentStatus::Active),
            2 => Some(AgentStatus::Inactive), 3 => Some(AgentStatus::Deregistered),
            _ => None,
        }
    }
}
impl Default for AgentStatus { fn default() -> Self { AgentStatus::Pending } }


/// Status of an MCP server in the MCP Server Registry
///
/// Represents the current operational status of an MCP server.
#[repr(u8)]
#[derive(AnchorSerialize, AnchorDeserialize, Clone, Debug, PartialEq)]
pub enum McpServerStatus {
    /// Server is pending verification or initialization
    Pending = 0,
    /// Server is active and operational
    Active = 1,
    /// Server is temporarily inactive
    Inactive = 2,
    /// Server has been deregistered and is no longer available
    Deregistered = 3,
}
impl McpServerStatus {
    /// Convert a u8 value to a McpServerStatus enum variant
    ///
    /// Returns None if the value doesn't correspond to any valid status.
     fn from_u8(value: u8) -> Option<Self> {
        match value {
            0 => Some(McpServerStatus::Pending), 1 => Some(McpServerStatus::Active),
            2 => Some(McpServerStatus::Inactive), 3 => Some(McpServerStatus::Deregistered),
            _ => None,
        }
    }
}
impl Default for McpServerStatus { fn default() -> Self { McpServerStatus::Pending } }


// --- Events ---

/// Event emitted when an agent is registered
///
/// This event contains the full data of the newly registered agent,
/// including all on-chain fields and the extended_metadata_uri pointing
/// to off-chain data. This enables real-time notification of new agent
/// registrations and allows off-chain indexers to capture complete agent details.
#[event]
pub struct AgentRegistered {
    /// Schema version of this entry (e.g., 1)
    pub registry_version: u8,
    /// Solana public key of the entry's owner/manager
    pub owner_authority: Pubkey,
    /// Unique identifier for the agent
    pub agent_id: String,
    /// Human-readable name of the agent
    pub name: String,
    /// Human-readable description of the agent
    pub description: String,
    /// Version of the agent software/implementation
    pub agent_version: String,
    /// Optional name of the agent's provider organization
    pub provider_name: Option<String>,
    /// Optional URL of the agent's provider
    pub provider_url: Option<String>,
    /// Optional URL to human-readable documentation
    pub documentation_url: Option<String>,
    /// List of service endpoints where the agent can be reached
    pub service_endpoints: Vec<ServiceEndpoint>,
    /// Bitmask for core A2A capabilities
    pub capabilities_flags: u64,
    /// Default accepted input MIME types
    pub supported_input_modes: Vec<String>,
    /// Default produced output MIME types
    pub supported_output_modes: Vec<String>,
    /// Summary of key agent skills
    pub skills: Vec<AgentSkill>,
    /// Optional URI to detailed security scheme definitions
    pub security_info_uri: Option<String>,
    /// Optional Fetch.ai AEA address/ID
    pub aea_address: Option<String>,
    /// Optional brief summary of the agent's economic goals
    pub economic_intent_summary: Option<String>,
    /// Optional SHA256 hash of a list of supported AEA protocol IDs
    pub supported_aea_protocols_hash: Option<[u8; HASH_SIZE]>,
    /// Agent status (0:Pending, 1:Active, 2:Inactive, 3:Deregistered)
    pub status: u8,
    /// Timestamp of initial registration
    pub registration_timestamp: i64,
    /// Timestamp of the last update
    pub last_update_timestamp: i64,
    /// Optional URI to extensive off-chain metadata (e.g., full AgentCard JSON)
    pub extended_metadata_uri: Option<String>,
    /// General discoverability tags for the agent
    pub tags: Vec<String>,
}

/// Event emitted when agent details are updated
///
/// Notifies listeners about updates to specific fields of an agent entry.
/// The changed_fields list identifies which fields were modified.
#[event]
pub struct AgentUpdated {
    /// Unique identifier for the agent
    pub agent_id: String,
    /// List of field names that were updated
    pub changed_fields: Vec<String>, 
    /// Timestamp of the update
    pub last_update_timestamp: i64,
}

/// Event emitted when agent status changes
///
/// Notifies listeners about a change in the agent's operational status.
#[event]
pub struct AgentStatusChanged {
    /// Unique identifier for the agent
    pub agent_id: String,
    /// New status value
    pub new_status: u8,
    /// Timestamp of the status change
    pub last_update_timestamp: i64,
}

/// Event emitted when an agent is deregistered
///
/// Notifies listeners when an agent is marked as deregistered.
#[event]
pub struct AgentDeregistered {
    /// Unique identifier for the agent
    pub agent_id: String,
    /// Timestamp of deregistration
    pub deregistration_timestamp: i64,
}


/// Event emitted when an MCP server is registered
///
/// This event contains the full data of the newly registered MCP server,
/// including all on-chain fields and the full_capabilities_uri pointing
/// to off-chain data. This enables real-time notification of new server
/// registrations and allows off-chain indexers to capture complete server details.
#[event]
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
///
/// Notifies listeners about updates to specific fields of an MCP server entry.
/// The changed_fields list identifies which fields were modified.
#[event]
pub struct McpServerUpdated {
    /// Unique identifier for the MCP server
    pub server_id: String,
    /// List of field names that were updated
    pub changed_fields: Vec<String>,
    /// Timestamp of the update
    pub last_update_timestamp: i64,
}

/// Event emitted when MCP server status changes
///
/// Notifies listeners about a change in the MCP server's operational status.
#[event]
pub struct McpServerStatusChanged {
    /// Unique identifier for the MCP server
    pub server_id: String,
    /// New status value
    pub new_status: u8,
    /// Timestamp of the status change
    pub last_update_timestamp: i64,
}

/// Event emitted when an MCP server is deregistered
///
/// Notifies listeners when an MCP server is marked as deregistered.
#[event]
pub struct McpServerDeregistered {
    /// Unique identifier for the MCP server
    pub server_id: String,
    /// Timestamp of deregistration
    pub deregistration_timestamp: i64,
}


// --- Errors ---

/// Error codes for the Solana AI Registries program
///
/// This enum defines all possible error conditions that can occur during
/// the execution of program instructions, with descriptive messages for
/// each error case.
#[error_code]
pub enum ErrorCode {
    /// Agent ID length is invalid (empty or exceeds maximum length)
    #[msg("Agent ID length is invalid (empty or exceeds max).")]
    InvalidAgentIdLength,
    /// Name length is invalid (empty or exceeds maximum length)
    #[msg("Name length is invalid (empty or exceeds max).")]
    InvalidNameLength,
    /// Description length exceeds maximum allowed
    #[msg("Description length exceeds max.")]
    InvalidDescriptionLength,
    /// Version length exceeds maximum allowed
    #[msg("Version length exceeds max.")]
    InvalidVersionLength,
    /// Provider name length exceeds maximum allowed
    #[msg("Provider name length exceeds max.")]
    InvalidProviderNameLength,
    /// Provider URL length exceeds maximum allowed
    #[msg("Provider URL length exceeds max.")]
    InvalidProviderUrlLength,
    /// Documentation URL length exceeds maximum allowed
    #[msg("Documentation URL length exceeds max.")]
    InvalidDocumentationUrlLength,
    /// Too many service endpoints provided (exceeds maximum allowed)
    #[msg("Too many service endpoints provided.")]
    TooManyServiceEndpoints,
    /// Service endpoint protocol length is invalid (empty or exceeds maximum)
    #[msg("Service endpoint protocol length is invalid (empty or exceeds max).")]
    InvalidEndpointProtocolLength,
    /// Service endpoint URL length is invalid (empty or exceeds maximum)
    #[msg("Service endpoint URL length is invalid (empty or exceeds max).")]
    InvalidEndpointUrlLength,
    /// Multiple endpoints are marked as default (only one allowed)
    #[msg("Only one service endpoint can be marked as default.")]
    MultipleDefaultEndpoints,
    /// No endpoint is marked as default when service endpoints are provided
    #[msg("If service endpoints are provided, one must be marked as default.")]
    MissingDefaultEndpoint,
    /// Too many supported modes (input/output) provided
    #[msg("Too many supported modes (input/output) provided.")]
    TooManySupportedModes,
    /// Supported mode string length is invalid (empty or exceeds maximum)
    #[msg("Supported mode string length is invalid (empty or exceeds max).")]
    InvalidModeLength,
    /// Too many skills provided (exceeds maximum allowed)
    #[msg("Too many skills provided.")]
    TooManySkills,
    /// Skill ID length is invalid (empty or exceeds maximum)
    #[msg("Skill ID length is invalid (empty or exceeds max).")]
    InvalidSkillIdLength,
    /// Skill name length is invalid (empty or exceeds maximum)
    #[msg("Skill name length is invalid (empty or exceeds max).")]
    InvalidSkillNameLength,
    /// Too many tags for a skill (exceeds maximum allowed)
    #[msg("Too many tags for a skill.")]
    TooManySkillTags,
    /// Skill tag length is invalid (empty or exceeds maximum)
    #[msg("Skill tag length is invalid (empty or exceeds max).")]
    InvalidSkillTagLength,
    /// Security info URI length exceeds maximum allowed
    #[msg("Security info URI length exceeds max.")]
    InvalidSecurityInfoUriLength,
    /// AEA address length exceeds maximum allowed
    #[msg("AEA address length exceeds max.")]
    InvalidAeaAddressLength,
    /// Economic intent summary length exceeds maximum allowed
    #[msg("Economic intent summary length exceeds max.")]
    InvalidEconomicIntentLength,
    /// Extended metadata URI length exceeds maximum allowed
    #[msg("Extended metadata URI length exceeds max.")]
    InvalidExtendedMetadataUriLength,
    /// Too many agent tags provided (exceeds maximum allowed)
    #[msg("Too many agent tags provided.")]
    TooManyAgentTags,
    /// Agent tag length is invalid (empty or exceeds maximum)
    #[msg("Agent tag length is invalid (empty or exceeds max).")]
    InvalidAgentTagLength,
    
    /// Server ID length is invalid (empty or exceeds maximum)
    #[msg("Server ID length is invalid (empty or exceeds max).")]
    InvalidServerIdLength,
    /// Server capabilities summary length exceeds maximum allowed
    #[msg("Server capabilities summary length exceeds max.")]
    InvalidServerCapabilitiesSummaryLength,
    /// Too many on-chain tool definitions (exceeds maximum allowed)
    #[msg("Too many on-chain tool definitions.")]
    TooManyToolDefinitions,
    /// Tool name length is invalid (empty or exceeds maximum)
    #[msg("Tool name length is invalid (empty or exceeds max).")]
    InvalidToolNameLength,
    /// Too many tags for a tool (exceeds maximum allowed)
    #[msg("Too many tags for a tool.")]
    TooManyToolTags,
    /// Tool tag length is invalid (empty or exceeds maximum)
    #[msg("Tool tag length is invalid (empty or exceeds max).")]
    InvalidToolTagLength,
    /// Too many on-chain resource definitions (exceeds maximum allowed)
    #[msg("Too many on-chain resource definitions.")]
    TooManyResourceDefinitions,
    /// Resource URI pattern length is invalid (empty or exceeds maximum)
    #[msg("Resource URI pattern length is invalid (empty or exceeds max).")]
    InvalidResourceUriPatternLength,
    /// Too many tags for a resource (exceeds maximum allowed)
    #[msg("Too many tags for a resource.")]
    TooManyResourceTags,
    /// Resource tag length is invalid (empty or exceeds maximum)
    #[msg("Resource tag length is invalid (empty or exceeds max).")]
    InvalidResourceTagLength,
    /// Too many on-chain prompt definitions (exceeds maximum allowed)
    #[msg("Too many on-chain prompt definitions.")]
    TooManyPromptDefinitions,
    /// Prompt name length is invalid (empty or exceeds maximum)
    #[msg("Prompt name length is invalid (empty or exceeds max).")]
    InvalidPromptNameLength,
    /// Too many tags for a prompt (exceeds maximum allowed)
    #[msg("Too many tags for a prompt.")]
    TooManyPromptTags,
    /// Prompt tag length is invalid (empty or exceeds maximum)
    #[msg("Prompt tag length is invalid (empty or exceeds max).")]
    InvalidPromptTagLength,
    /// Full capabilities URI length exceeds maximum allowed
    #[msg("Full capabilities URI length exceeds max.")]
    InvalidFullCapabilitiesUriLength,
    /// Too many server tags provided (exceeds maximum allowed)
    #[msg("Too many server tags provided.")]
    TooManyServerTags,
    /// Server tag length is invalid (empty or exceeds maximum)
    #[msg("Server tag length is invalid (empty or exceeds max).")]
    InvalidServerTagLength,

    /// Invalid agent status value (not in the range 0-3)
    #[msg("Invalid agent status value.")]
    InvalidAgentStatus,
    /// Invalid MCP server status value (not in the range 0-3)
    #[msg("Invalid MCP server status value.")]
    InvalidMcpServerStatus,
    /// Bump seed not found in hash map (internal error)
    #[msg("Bump seed not found in hash map.")]
    BumpSeedNotInHashMap,
    /// Signer is not the owner of the entry (unauthorized)
    #[msg("Unauthorized: Signer is not the owner of the entry.")]
    Unauthorized,
}

