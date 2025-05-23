use anchor_lang::prelude::*;
use anchor_lang::solana_program::system_program;

declare_id!("Fg6PaFpoGXkYsidMpWTK6W2BeZ7FEfcYkg476zPFsLnS"); // Replace with your program ID after deployment

// Constants based on the report's constraints
mod constants {
    // Agent Registry Constants
    pub const MAX_AGENT_ID_LEN: usize = 64;
    pub const MAX_AGENT_NAME_LEN: usize = 128;
    pub const MAX_AGENT_DESCRIPTION_LEN: usize = 512;
    pub const MAX_AGENT_VERSION_LEN: usize = 32;
    pub const MAX_PROVIDER_NAME_LEN: usize = 128;
    pub const MAX_PROVIDER_URL_LEN: usize = 256;
    pub const MAX_DOCUMENTATION_URL_LEN: usize = 256;
    pub const MAX_SERVICE_ENDPOINTS: usize = 3;
    pub const MAX_ENDPOINT_PROTOCOL_LEN: usize = 64;
    pub const MAX_ENDPOINT_URL_LEN: usize = 256;
    pub const MAX_SUPPORTED_MODES: usize = 5;
    pub const MAX_MODE_LEN: usize = 64;
    pub const MAX_SKILLS: usize = 10;
    pub const MAX_SKILL_ID_LEN: usize = 64;
    pub const MAX_SKILL_NAME_LEN: usize = 128;
    pub const MAX_SKILL_TAGS: usize = 5;
    pub const MAX_SKILL_TAG_LEN: usize = 32;
    pub const MAX_SECURITY_INFO_URI_LEN: usize = 256;
    pub const MAX_AEA_ADDRESS_LEN: usize = 128;
    pub const MAX_ECONOMIC_INTENT_LEN: usize = 256;
    pub const MAX_EXTENDED_METADATA_URI_LEN: usize = 256;
    pub const MAX_AGENT_TAGS: usize = 10;
    pub const MAX_AGENT_TAG_LEN: usize = 32;

    // MCP Server Registry Constants
    pub const MAX_SERVER_ID_LEN: usize = 64;
    pub const MAX_SERVER_NAME_LEN: usize = 128;
    pub const MAX_SERVER_VERSION_LEN: usize = 32;
    pub const MAX_SERVER_ENDPOINT_URL_LEN: usize = 256;
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

    pub const HASH_SIZE: usize = 32; // SHA256 hash size

    // PDA Seed Prefixes
    pub const AGENT_REGISTRY_PDA_SEED: &[u8] = b"agent_reg_v1";
    pub const MCP_SERVER_REGISTRY_PDA_SEED: &[u8] = b"mcp_srv_reg_v1";
}

use constants::*;

#[program]
pub mod solana_ai_registries {
    use super::*;

    // --- Agent Registry Instructions ---

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
        // Input validations
        if agent_id.len() > MAX_AGENT_ID_LEN || agent_id.is_empty() { return err!(ErrorCode::InvalidAgentIdLength); }
        if name.len() > MAX_AGENT_NAME_LEN || name.is_empty() { return err!(ErrorCode::InvalidNameLength); }
        if description.len() > MAX_AGENT_DESCRIPTION_LEN { return err!(ErrorCode::InvalidDescriptionLength); }
        if agent_version.len() > MAX_AGENT_VERSION_LEN { return err!(ErrorCode::InvalidVersionLength); }
        if let Some(ref pn) = provider_name { if pn.len() > MAX_PROVIDER_NAME_LEN { return err!(ErrorCode::InvalidProviderNameLength); }}
        if let Some(ref pu) = provider_url { if pu.len() > MAX_PROVIDER_URL_LEN { return err!(ErrorCode::InvalidProviderUrlLength); }}
        if let Some(ref du) = documentation_url { if du.len() > MAX_DOCUMENTATION_URL_LEN { return err!(ErrorCode::InvalidDocumentationUrlLength); }}
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
        if let Some(ref siu) = security_info_uri { if siu.len() > MAX_SECURITY_INFO_URI_LEN { return err!(ErrorCode::InvalidSecurityInfoUriLength); }}
        if let Some(ref aa) = aea_address { if aa.len() > MAX_AEA_ADDRESS_LEN { return err!(ErrorCode::InvalidAeaAddressLength); }}
        if let Some(ref eis) = economic_intent_summary { if eis.len() > MAX_ECONOMIC_INTENT_LEN { return err!(ErrorCode::InvalidEconomicIntentLength); }}
        if let Some(ref emu) = extended_metadata_uri { if emu.len() > MAX_EXTENDED_METADATA_URI_LEN { return err!(ErrorCode::InvalidExtendedMetadataUriLength); }}
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

    pub fn update_agent_details(ctx: Context<UpdateAgent>, details: AgentUpdateDetailsInput) -> Result<()> {
        let agent_entry = &mut ctx.accounts.agent_entry;
        let mut changed_fields: Vec<String> = Vec::new();

        if let Some(val) = details.name {
            if val.len() > MAX_AGENT_NAME_LEN || val.is_empty() { return err!(ErrorCode::InvalidNameLength); }
            agent_entry.name = val; changed_fields.push("name".to_string());
        }
        if let Some(val) = details.description {
            if val.len() > MAX_AGENT_DESCRIPTION_LEN { return err!(ErrorCode::InvalidDescriptionLength); }
            agent_entry.description = val; changed_fields.push("description".to_string());
        }
        if let Some(val) = details.agent_version {
            if val.len() > MAX_AGENT_VERSION_LEN { return err!(ErrorCode::InvalidVersionLength); }
            agent_entry.agent_version = val; changed_fields.push("agent_version".to_string());
        }
        if details.provider_name.is_some() { 
            let val = details.provider_name.unwrap();
            if val.len() > MAX_PROVIDER_NAME_LEN { return err!(ErrorCode::InvalidProviderNameLength); }
            agent_entry.provider_name = Some(val); changed_fields.push("provider_name".to_string());
        } else if details.clear_provider_name.unwrap_or(false) {
            agent_entry.provider_name = None; changed_fields.push("provider_name".to_string());
        }
        // ... (Repeat for all Option<String> fields: provider_url, documentation_url, security_info_uri, aea_address, economic_intent_summary, extended_metadata_uri)

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
        // ... (Repeat for supported_output_modes, skills, tags with their respective validations)

        if let Some(val) = details.supported_aea_protocols_hash { agent_entry.supported_aea_protocols_hash = Some(val); changed_fields.push("supported_aea_protocols_hash".to_string());}
        else if details.clear_supported_aea_protocols_hash.unwrap_or(false) { agent_entry.supported_aea_protocols_hash = None; changed_fields.push("supported_aea_protocols_hash".to_string());}


        if changed_fields.is_empty() { return Ok(()); } // No actual changes

        agent_entry.last_update_timestamp = Clock::get()?.unix_timestamp;
        emit!(AgentUpdated {
            agent_id: agent_entry.agent_id.clone(),
            changed_fields: changed_fields,
            last_update_timestamp: agent_entry.last_update_timestamp,
        });
        Ok(())
    }

    pub fn update_agent_status(ctx: Context<UpdateAgent>, new_status_val: u8) -> Result<()> {
        let agent_entry = &mut ctx.accounts.agent_entry;
        let new_status = AgentStatus::from_u8(new_status_val).ok_or(ErrorCode::InvalidAgentStatus)?;
        if agent_entry.status == new_status as u8 { return Ok(()); } // No change
        agent_entry.status = new_status as u8;
        agent_entry.last_update_timestamp = Clock::get()?.unix_timestamp;
        emit!(AgentStatusChanged {
            agent_id: agent_entry.agent_id.clone(),
            new_status: agent_entry.status,
            last_update_timestamp: agent_entry.last_update_timestamp,
        });
        Ok(())
    }

    pub fn deregister_agent(ctx: Context<UpdateAgent>) -> Result<()> {
        let agent_entry = &mut ctx.accounts.agent_entry;
        if agent_entry.status == AgentStatus::Deregistered as u8 { return Ok(()); } // Already deregistered

        agent_entry.status = AgentStatus::Deregistered as u8;
        agent_entry.last_update_timestamp = Clock::get()?.unix_timestamp;
        
        emit!(AgentDeregistered {
            agent_id: agent_entry.agent_id.clone(),
            deregistration_timestamp: agent_entry.last_update_timestamp,
        });
        Ok(())
    }

    // --- MCP Server Registry Instructions ---

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
        // Input validations
        if server_id.len() > MAX_SERVER_ID_LEN || server_id.is_empty() { return err!(ErrorCode::InvalidServerIdLength); }
        if name.len() > MAX_SERVER_NAME_LEN || name.is_empty() { return err!(ErrorCode::InvalidNameLength); }
        if server_version.len() > MAX_SERVER_VERSION_LEN { return err!(ErrorCode::InvalidVersionLength); }
        if service_endpoint.len() > MAX_SERVER_ENDPOINT_URL_LEN || service_endpoint.is_empty() { return err!(ErrorCode::InvalidEndpointUrlLength); }
        // ... (similar validations for all other fields as in register_agent)
        if onchain_tool_definitions_input.len() > MAX_ONCHAIN_TOOL_DEFINITIONS {return err!(ErrorCode::TooManyToolDefinitions); }
        // ... more validations for nested structs ...


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
    
    pub fn update_mcp_server_details(ctx: Context<UpdateMcpServer>, details: McpServerUpdateDetailsInput) -> Result<()> {
        let mcp_server_entry = &mut ctx.accounts.mcp_server_entry;
        let mut changed_fields: Vec<String> = Vec::new();

        if let Some(val) = details.name {
            if val.len() > MAX_SERVER_NAME_LEN || val.is_empty() { return err!(ErrorCode::InvalidNameLength); }
            mcp_server_entry.name = val; changed_fields.push("name".to_string());
        }
        if let Some(val) = details.server_version {
            if val.len() > MAX_SERVER_VERSION_LEN { return err!(ErrorCode::InvalidVersionLength); }
            mcp_server_entry.server_version = val; changed_fields.push("server_version".to_string());
        }
        // ... (Repeat for all Option<String> and other updatable fields with validations)
        // Example for a boolean field:
        if let Some(val) = details.supports_tools { mcp_server_entry.supports_tools = val; changed_fields.push("supports_tools".to_string());}
        // ... (Repeat for onchain_tool_definitions, onchain_resource_definitions, onchain_prompt_definitions with their respective validations)


        if changed_fields.is_empty() { return Ok(()); }

        mcp_server_entry.last_update_timestamp = Clock::get()?.unix_timestamp;
        emit!(McpServerUpdated {
            server_id: mcp_server_entry.server_id.clone(),
            changed_fields: changed_fields,
            last_update_timestamp: mcp_server_entry.last_update_timestamp,
        });
        Ok(())
    }

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

#[derive(Accounts)]
#[instruction(agent_id: String)]
pub struct RegisterAgent<'info> {
    #[account(
        init,
        payer = payer,
        space = AgentRegistryEntryV1::LEN, 
        seeds = [AGENT_REGISTRY_PDA_SEED, agent_id.as_bytes()],
        bump
    )]
    pub agent_entry: Account<'info, AgentRegistryEntryV1>,
    #[account(mut)]
    pub owner_authority: Signer<'info>, 
    #[account(mut)]
    pub payer: Signer<'info>, 
    pub system_program: Program<'info, System>,
}

#[derive(Accounts)]
pub struct UpdateAgent<'info> {
    #[account(
        mut,
        seeds = [AGENT_REGISTRY_PDA_SEED, agent_entry.agent_id.as_bytes()],
        bump = agent_entry.bump,
        has_one = owner_authority @ ErrorCode::Unauthorized
    )]
    pub agent_entry: Account<'info, AgentRegistryEntryV1>,
    #[account(mut)]
    pub owner_authority: Signer<'info>,
}

#[derive(Accounts)]
#[instruction(server_id: String)]
pub struct RegisterMcpServer<'info> {
    #[account(
        init,
        payer = payer,
        space = McpServerRegistryEntryV1::LEN, 
        seeds = [MCP_SERVER_REGISTRY_PDA_SEED, server_id.as_bytes()],
        bump
    )]
    pub mcp_server_entry: Account<'info, McpServerRegistryEntryV1>,
    #[account(mut)]
    pub owner_authority: Signer<'info>,
    #[account(mut)]
    pub payer: Signer<'info>,
    pub system_program: Program<'info, System>,
}

#[derive(Accounts)]
pub struct UpdateMcpServer<'info> {
    #[account(
        mut,
        seeds = [MCP_SERVER_REGISTRY_PDA_SEED, mcp_server_entry.server_id.as_bytes()],
        bump = mcp_server_entry.bump,
        has_one = owner_authority @ ErrorCode::Unauthorized
    )]
    pub mcp_server_entry: Account<'info, McpServerRegistryEntryV1>,
    #[account(mut)]
    pub owner_authority: Signer<'info>,
}


// --- State Structs (Accounts) ---

#[account]
#[derive(Default, Clone)]
pub struct AgentRegistryEntryV1 {
    pub bump: u8,
    pub registry_version: u8,
    pub owner_authority: Pubkey,
    pub agent_id: String, 
    pub name: String, 
    pub description: String, 
    pub agent_version: String, 
    pub provider_name: Option<String>, 
    pub provider_url: Option<String>, 
    pub documentation_url: Option<String>, 
    pub service_endpoints: Vec<ServiceEndpoint>, 
    pub capabilities_flags: u64,
    pub supported_input_modes: Vec<String>, 
    pub supported_output_modes: Vec<String>, 
    pub skills: Vec<AgentSkill>, 
    pub security_info_uri: Option<String>, 
    pub aea_address: Option<String>, 
    pub economic_intent_summary: Option<String>, 
    pub supported_aea_protocols_hash: Option<[u8; HASH_SIZE]>,
    pub status: u8, 
    pub registration_timestamp: i64,
    pub last_update_timestamp: i64,
    pub extended_metadata_uri: Option<String>, 
    pub tags: Vec<String>, 
}

impl AgentRegistryEntryV1 {
    const LEN: usize = 8 + 1 + 1 + 32 + (4+MAX_AGENT_ID_LEN) + (4+MAX_AGENT_NAME_LEN) + (4+MAX_AGENT_DESCRIPTION_LEN)
        + (4+MAX_AGENT_VERSION_LEN) + (1+4+MAX_PROVIDER_NAME_LEN) + (1+4+MAX_PROVIDER_URL_LEN)
        + (1+4+MAX_DOCUMENTATION_URL_LEN)
        + (4 + MAX_SERVICE_ENDPOINTS * ServiceEndpoint::LEN_ITEM)
        + 8 
        + (4 + MAX_SUPPORTED_MODES * (4+MAX_MODE_LEN)) 
        + (4 + MAX_SUPPORTED_MODES * (4+MAX_MODE_LEN)) 
        + (4 + MAX_SKILLS * AgentSkill::LEN_ITEM)
        + (1+4+MAX_SECURITY_INFO_URI_LEN) + (1+4+MAX_AEA_ADDRESS_LEN) + (1+4+MAX_ECONOMIC_INTENT_LEN)
        + (1+HASH_SIZE) 
        + 1 
        + 8 + 8 
        + (1+4+MAX_EXTENDED_METADATA_URI_LEN)
        + (4 + MAX_AGENT_TAGS * (4+MAX_AGENT_TAG_LEN))
        + 200; // Increased Padding for safety, exact calculation is critical
}


#[derive(AnchorSerialize, AnchorDeserialize, Clone, Default, Debug)]
pub struct ServiceEndpoint {
    pub protocol: String, 
    pub url: String,      
    pub is_default: bool,
}
impl ServiceEndpoint {
    const LEN_ITEM: usize = (4+MAX_ENDPOINT_PROTOCOL_LEN) + (4+MAX_ENDPOINT_URL_LEN) + 1;
}


#[derive(AnchorSerialize, AnchorDeserialize, Clone, Default, Debug)]
pub struct AgentSkill {
    pub id: String, 
    pub name: String, 
    pub description_hash: Option<[u8; HASH_SIZE]>,
    pub tags: Vec<String>, 
}
impl AgentSkill {
     const LEN_ITEM: usize = (4+MAX_SKILL_ID_LEN) + (4+MAX_SKILL_NAME_LEN) + (1+HASH_SIZE)
        + (4 + MAX_SKILL_TAGS * (4+MAX_SKILL_TAG_LEN));
}

#[account]
#[derive(Default, Clone)]
pub struct McpServerRegistryEntryV1 {
    pub bump: u8,
    pub registry_version: u8,
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
    pub onchain_tool_definitions: Vec<McpToolDefinitionOnChain>, 
    pub onchain_resource_definitions: Vec<McpResourceDefinitionOnChain>, 
    pub onchain_prompt_definitions: Vec<McpPromptDefinitionOnChain>, 
    pub status: u8, 
    pub registration_timestamp: i64,
    pub last_update_timestamp: i64,
    pub full_capabilities_uri: Option<String>, 
    pub tags: Vec<String>, 
}

impl McpServerRegistryEntryV1 {
    const LEN: usize = 8 + 1 + 1 + 32 + (4+MAX_SERVER_ID_LEN) + (4+MAX_SERVER_NAME_LEN)
        + (4+MAX_SERVER_VERSION_LEN) + (4+MAX_SERVER_ENDPOINT_URL_LEN)
        + (1+4+MAX_DOCUMENTATION_URL_LEN) + (1+4+MAX_SERVER_CAPABILITIES_SUMMARY_LEN)
        + 1 + 1 + 1 
        + (4 + MAX_ONCHAIN_TOOL_DEFINITIONS * McpToolDefinitionOnChain::LEN_ITEM)
        + (4 + MAX_ONCHAIN_RESOURCE_DEFINITIONS * McpResourceDefinitionOnChain::LEN_ITEM)
        + (4 + MAX_ONCHAIN_PROMPT_DEFINITIONS * McpPromptDefinitionOnChain::LEN_ITEM)
        + 1 
        + 8 + 8 
        + (1+4+MAX_FULL_CAPABILITIES_URI_LEN)
        + (4 + MAX_SERVER_TAGS * (4+MAX_SERVER_TAG_LEN))
        + 200; // Increased Padding
}


#[derive(AnchorSerialize, AnchorDeserialize, Clone, Default, Debug)]
pub struct McpToolDefinitionOnChain {
    pub name: String, 
    pub description_hash: [u8; HASH_SIZE],
    pub input_schema_hash: [u8; HASH_SIZE],
    pub output_schema_hash: [u8; HASH_SIZE],
    pub tags: Vec<String>, 
}
impl McpToolDefinitionOnChain {
    const LEN_ITEM: usize = (4+MAX_TOOL_NAME_LEN) + HASH_SIZE + HASH_SIZE + HASH_SIZE
        + (4 + MAX_TOOL_TAGS * (4+MAX_TOOL_TAG_LEN));
}


#[derive(AnchorSerialize, AnchorDeserialize, Clone, Default, Debug)]
pub struct McpResourceDefinitionOnChain {
    pub uri_pattern: String, 
    pub description_hash: [u8; HASH_SIZE],
    pub tags: Vec<String>, 
}
impl McpResourceDefinitionOnChain {
     const LEN_ITEM: usize = (4+MAX_RESOURCE_URI_PATTERN_LEN) + HASH_SIZE
        + (4 + MAX_RESOURCE_TAGS * (4+MAX_RESOURCE_TAG_LEN));
}

#[derive(AnchorSerialize, AnchorDeserialize, Clone, Default, Debug)]
pub struct McpPromptDefinitionOnChain {
    pub name: String, 
    pub description_hash: [u8; HASH_SIZE],
    pub tags: Vec<String>, 
}
impl McpPromptDefinitionOnChain {
    const LEN_ITEM: usize = (4+MAX_PROMPT_NAME_LEN) + HASH_SIZE
        + (4 + MAX_PROMPT_TAGS * (4+MAX_PROMPT_TAG_LEN));
}


#[derive(AnchorSerialize, AnchorDeserialize, Clone, Debug)]
pub struct ServiceEndpointInput {
    pub protocol: String,
    pub url: String,
    pub is_default: bool,
}
impl From<ServiceEndpointInput> for ServiceEndpoint {
    fn from(item: ServiceEndpointInput) -> Self {
        ServiceEndpoint { protocol: item.protocol, url: item.url, is_default: item.is_default }
    }
}

#[derive(AnchorSerialize, AnchorDeserialize, Clone, Debug)]
pub struct AgentSkillInput {
    pub id: String,
    pub name: String,
    pub description_hash: Option<[u8; HASH_SIZE]>,
    pub tags: Vec<String>,
}
impl From<AgentSkillInput> for AgentSkill {
    fn from(item: AgentSkillInput) -> Self {
        AgentSkill { id: item.id, name: item.name, description_hash: item.description_hash, tags: item.tags }
    }
}

#[derive(AnchorSerialize, AnchorDeserialize, Clone, Debug, Default)]
pub struct AgentUpdateDetailsInput {
    pub name: Option<String>,
    pub description: Option<String>,
    pub agent_version: Option<String>,
    pub provider_name: Option<String>,
    pub clear_provider_name: Option<bool>,
    pub provider_url: Option<String>,
    pub clear_provider_url: Option<bool>,
    pub documentation_url: Option<String>,
    pub clear_documentation_url: Option<bool>,
    pub service_endpoints: Option<Vec<ServiceEndpointInput>>,
    pub capabilities_flags: Option<u64>,
    pub supported_input_modes: Option<Vec<String>>,
    pub supported_output_modes: Option<Vec<String>>,
    pub skills: Option<Vec<AgentSkillInput>>,
    pub security_info_uri: Option<String>,
    pub clear_security_info_uri: Option<bool>,
    pub aea_address: Option<String>,
    pub clear_aea_address: Option<bool>,
    pub economic_intent_summary: Option<String>,
    pub clear_economic_intent_summary: Option<bool>,
    pub supported_aea_protocols_hash: Option<[u8; HASH_SIZE]>,
    pub clear_supported_aea_protocols_hash: Option<bool>,
    pub extended_metadata_uri: Option<String>,
    pub clear_extended_metadata_uri: Option<bool>,
    pub tags: Option<Vec<String>>,
}


#[derive(AnchorSerialize, AnchorDeserialize, Clone, Debug)]
pub struct McpToolDefinitionOnChainInput {
    pub name: String, 
    pub description_hash: [u8; HASH_SIZE], 
    pub input_schema_hash: [u8; HASH_SIZE], 
    pub output_schema_hash: [u8; HASH_SIZE], 
    pub tags: Vec<String>,
}
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

#[derive(AnchorSerialize, AnchorDeserialize, Clone, Debug)]
pub struct McpResourceDefinitionOnChainInput {
    pub uri_pattern: String,
    pub description_hash: [u8; HASH_SIZE],
    pub tags: Vec<String>,
}
impl From<McpResourceDefinitionOnChainInput> for McpResourceDefinitionOnChain {
    fn from(item: McpResourceDefinitionOnChainInput) -> Self {
        McpResourceDefinitionOnChain {
            uri_pattern: item.uri_pattern,
            description_hash: item.description_hash,
            tags: item.tags,
        }
    }
}

#[derive(AnchorSerialize, AnchorDeserialize, Clone, Debug)]
pub struct McpPromptDefinitionOnChainInput {
    pub name: String,
    pub description_hash: [u8; HASH_SIZE],
    pub tags: Vec<String>,
}
impl From<McpPromptDefinitionOnChainInput> for McpPromptDefinitionOnChain {
    fn from(item: McpPromptDefinitionOnChainInput) -> Self {
        McpPromptDefinitionOnChain {
            name: item.name,
            description_hash: item.description_hash,
            tags: item.tags,
        }
    }
}


#[derive(AnchorSerialize, AnchorDeserialize, Clone, Debug, Default)]
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


// --- Enums ---
#[repr(u8)]
#[derive(AnchorSerialize, AnchorDeserialize, Clone, Debug, PartialEq)]
pub enum AgentStatus {
    Pending = 0,
    Active = 1,
    Inactive = 2,
    Deregistered = 3, 
}
impl AgentStatus {
    fn from_u8(value: u8) -> Option<Self> {
        match value {
            0 => Some(AgentStatus::Pending), 1 => Some(AgentStatus::Active),
            2 => Some(AgentStatus::Inactive), 3 => Some(AgentStatus::Deregistered),
            _ => None,
        }
    }
}
impl Default for AgentStatus { fn default() -> Self { AgentStatus::Pending } }


#[repr(u8)]
#[derive(AnchorSerialize, AnchorDeserialize, Clone, Debug, PartialEq)]
pub enum McpServerStatus {
    Pending = 0,
    Active = 1,
    Inactive = 2,
    Deregistered = 3,
}
impl McpServerStatus {
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
#[event]
pub struct AgentRegistered {
    pub registry_version: u8,
    pub owner_authority: Pubkey,
    pub agent_id: String,
    pub name: String,
    pub description: String,
    pub agent_version: String,
    pub provider_name: Option<String>,
    pub provider_url: Option<String>,
    pub documentation_url: Option<String>,
    pub service_endpoints: Vec<ServiceEndpoint>,
    pub capabilities_flags: u64,
    pub supported_input_modes: Vec<String>,
    pub supported_output_modes: Vec<String>,
    pub skills: Vec<AgentSkill>,
    pub security_info_uri: Option<String>,
    pub aea_address: Option<String>,
    pub economic_intent_summary: Option<String>,
    pub supported_aea_protocols_hash: Option<[u8; HASH_SIZE]>,
    pub status: u8,
    pub registration_timestamp: i64,
    pub last_update_timestamp: i64,
    pub extended_metadata_uri: Option<String>,
    pub tags: Vec<String>,
}

#[event]
pub struct AgentUpdated {
    pub agent_id: String,
    pub changed_fields: Vec<String>, // List of field names that were updated
    pub last_update_timestamp: i64,
}

#[event]
pub struct AgentStatusChanged {
    pub agent_id: String,
    pub new_status: u8,
    pub last_update_timestamp: i64,
}

#[event]
pub struct AgentDeregistered {
    pub agent_id: String,
    pub deregistration_timestamp: i64,
}


#[event]
pub struct McpServerRegistered {
    pub registry_version: u8,
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
    pub onchain_tool_definitions: Vec<McpToolDefinitionOnChain>,
    pub onchain_resource_definitions: Vec<McpResourceDefinitionOnChain>,
    pub onchain_prompt_definitions: Vec<McpPromptDefinitionOnChain>,
    pub status: u8,
    pub registration_timestamp: i64,
    pub last_update_timestamp: i64,
    pub full_capabilities_uri: Option<String>,
    pub tags: Vec<String>,
}

#[event]
pub struct McpServerUpdated {
    pub server_id: String,
    pub changed_fields: Vec<String>,
    pub last_update_timestamp: i64,
}

#[event]
pub struct McpServerStatusChanged {
    pub server_id: String,
    pub new_status: u8,
    pub last_update_timestamp: i64,
}

#[event]
pub struct McpServerDeregistered {
    pub server_id: String,
    pub deregistration_timestamp: i64,
}


// --- Errors ---
#[error_code]
pub enum ErrorCode {
    #[msg("Agent ID length is invalid (empty or exceeds max).")]
    InvalidAgentIdLength,
    #[msg("Name length is invalid (empty or exceeds max).")]
    InvalidNameLength,
    #[msg("Description length exceeds max.")]
    InvalidDescriptionLength,
    #[msg("Version length exceeds max.")]
    InvalidVersionLength,
    #[msg("Provider name length exceeds max.")]
    InvalidProviderNameLength,
    #[msg("Provider URL length exceeds max.")]
    InvalidProviderUrlLength,
    #[msg("Documentation URL length exceeds max.")]
    InvalidDocumentationUrlLength,
    #[msg("Too many service endpoints provided.")]
    TooManyServiceEndpoints,
    #[msg("Service endpoint protocol length is invalid (empty or exceeds max).")]
    InvalidEndpointProtocolLength,
    #[msg("Service endpoint URL length is invalid (empty or exceeds max).")]
    InvalidEndpointUrlLength,
    #[msg("Only one service endpoint can be marked as default.")]
    MultipleDefaultEndpoints,
    #[msg("If service endpoints are provided, one must be marked as default.")]
    MissingDefaultEndpoint,
    #[msg("Too many supported modes (input/output) provided.")]
    TooManySupportedModes,
    #[msg("Supported mode string length is invalid (empty or exceeds max).")]
    InvalidModeLength,
    #[msg("Too many skills provided.")]
    TooManySkills,
    #[msg("Skill ID length is invalid (empty or exceeds max).")]
    InvalidSkillIdLength,
    #[msg("Skill name length is invalid (empty or exceeds max).")]
    InvalidSkillNameLength,
    #[msg("Too many tags for a skill.")]
    TooManySkillTags,
    #[msg("Skill tag length is invalid (empty or exceeds max).")]
    InvalidSkillTagLength,
    #[msg("Security info URI length exceeds max.")]
    InvalidSecurityInfoUriLength,
    #[msg("AEA address length exceeds max.")]
    InvalidAeaAddressLength,
    #[msg("Economic intent summary length exceeds max.")]
    InvalidEconomicIntentLength,
    #[msg("Extended metadata URI length exceeds max.")]
    InvalidExtendedMetadataUriLength,
    #[msg("Too many agent tags provided.")]
    TooManyAgentTags,
    #[msg("Agent tag length is invalid (empty or exceeds max).")]
    InvalidAgentTagLength,
    
    #[msg("Server ID length is invalid (empty or exceeds max).")]
    InvalidServerIdLength,
    // Note: Reusing InvalidNameLength, InvalidVersionLength, InvalidEndpointUrlLength, InvalidDocumentationUrlLength for MCP Server
    #[msg("Server capabilities summary length exceeds max.")]
    InvalidServerCapabilitiesSummaryLength,
    #[msg("Too many on-chain tool definitions.")]
    TooManyToolDefinitions,
    #[msg("Tool name length is invalid (empty or exceeds max).")]
    InvalidToolNameLength,
    #[msg("Too many tags for a tool.")]
    TooManyToolTags,
    #[msg("Tool tag length is invalid (empty or exceeds max).")]
    InvalidToolTagLength,
    #[msg("Too many on-chain resource definitions.")]
    TooManyResourceDefinitions,
    #[msg("Resource URI pattern length is invalid (empty or exceeds max).")]
    InvalidResourceUriPatternLength,
    #[msg("Too many tags for a resource.")]
    TooManyResourceTags,
    #[msg("Resource tag length is invalid (empty or exceeds max).")]
    InvalidResourceTagLength,
    #[msg("Too many on-chain prompt definitions.")]
    TooManyPromptDefinitions,
    #[msg("Prompt name length is invalid (empty or exceeds max).")]
    InvalidPromptNameLength,
    #[msg("Too many tags for a prompt.")]
    TooManyPromptTags,
    #[msg("Prompt tag length is invalid (empty or exceeds max).")]
    InvalidPromptTagLength,
    #[msg("Full capabilities URI length exceeds max.")]
    InvalidFullCapabilitiesUriLength,
    #[msg("Too many server tags provided.")]
    TooManyServerTags,
    #[msg("Server tag length is invalid (empty or exceeds max).")]
    InvalidServerTagLength,

    #[msg("Invalid agent status value.")]
    InvalidAgentStatus,
    #[msg("Invalid MCP server status value.")]
    InvalidMcpServerStatus,
    #[msg("Bump seed not found in hash map.")]
    BumpSeedNotInHashMap,
    #[msg("Unauthorized: Signer is not the owner of the entry.")]
    Unauthorized,
}

