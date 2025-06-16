//! Agent Registry SDK module
//! 
//! This module provides high-level functions for interacting with the Agent Registry,
//! including registration, updates, and queries for autonomous agents.

use borsh::{BorshDeserialize, BorshSerialize};
use solana_sdk::{
    instruction::{AccountMeta, Instruction},
    pubkey::Pubkey,
    system_program,
};
use crate::errors::{SdkError, SdkResult};

/// Maximum length constants (from the on-chain program)
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
pub const HASH_SIZE: usize = 32;

/// Agent status values
#[repr(u8)]
#[derive(Debug, Clone, Copy, PartialEq, Eq, BorshSerialize, BorshDeserialize)]
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

impl Default for AgentStatus {
    fn default() -> Self {
        AgentStatus::Pending
    }
}

/// Service endpoint configuration
#[derive(Debug, Clone, PartialEq, Eq, BorshSerialize, BorshDeserialize)]
pub struct ServiceEndpoint {
    pub protocol: String,
    pub url: String,
    pub is_default: bool,
}

impl ServiceEndpoint {
    pub fn new(protocol: String, url: String, is_default: bool) -> SdkResult<Self> {
        if protocol.is_empty() || protocol.len() > MAX_ENDPOINT_PROTOCOL_LEN {
            return Err(SdkError::InvalidEndpointProtocolLength);
        }
        if url.is_empty() || url.len() > MAX_ENDPOINT_URL_LEN {
            return Err(SdkError::InvalidEndpointUrlLength);
        }
        
        Ok(Self {
            protocol,
            url,
            is_default,
        })
    }
}

/// Agent skill definition
#[derive(Debug, Clone, PartialEq, Eq, BorshSerialize, BorshDeserialize)]
pub struct AgentSkill {
    pub skill_id: String,
    pub name: String,
    pub tags: Vec<String>,
}

impl AgentSkill {
    pub fn new(skill_id: String, name: String, tags: Vec<String>) -> SdkResult<Self> {
        if skill_id.is_empty() || skill_id.len() > MAX_SKILL_ID_LEN {
            return Err(SdkError::InvalidSkillIdLength);
        }
        if name.is_empty() || name.len() > MAX_SKILL_NAME_LEN {
            return Err(SdkError::InvalidSkillNameLength);
        }
        if tags.len() > MAX_SKILL_TAGS {
            return Err(SdkError::TooManySkillTags);
        }
        for tag in &tags {
            if tag.len() > MAX_SKILL_TAG_LEN {
                return Err(SdkError::InvalidSkillTagLength);
            }
        }
        
        Ok(Self {
            skill_id,
            name,
            tags,
        })
    }
}

/// Arguments for registering an agent
#[derive(Debug, Clone)]
pub struct AgentArgs {
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
    pub extended_metadata_uri: Option<String>,
    pub tags: Vec<String>,
}

/// Patch for updating agent details
#[derive(Debug, Clone, Default)]
pub struct AgentPatch {
    pub name: Option<String>,
    pub description: Option<String>,
    pub agent_version: Option<String>,
    pub provider_name: Option<String>,
    pub clear_provider_name: Option<bool>,
    pub provider_url: Option<String>,
    pub clear_provider_url: Option<bool>,
    pub documentation_url: Option<String>,
    pub clear_documentation_url: Option<bool>,
    pub service_endpoints: Option<Vec<ServiceEndpoint>>,
    pub capabilities_flags: Option<u64>,
    pub supported_input_modes: Option<Vec<String>>,
    pub supported_output_modes: Option<Vec<String>>,
    pub skills: Option<Vec<AgentSkill>>,
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

/// Agent registry entry (account data)
#[derive(Debug, Clone, BorshSerialize, BorshDeserialize)]
pub struct AgentEntry {
    pub bump: u8,
    pub registry_version: u8,
    pub state_version: u64,
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
    pub extended_metadata_uri: Option<String>,
    pub tags: Vec<String>,
    pub status: AgentStatus,
    pub registration_timestamp: i64,
    pub last_update_timestamp: i64,
}

impl AgentEntry {
    /// Try to deserialize from account data
    pub fn try_from_account_data(data: &[u8]) -> SdkResult<Self> {
        // Skip the 8-byte discriminator used by Anchor
        if data.len() < 8 {
            return Err(SdkError::InvalidAccountData);
        }
        
        let account_data = &data[8..];
        Self::try_from_slice(account_data)
            .map_err(|e| SdkError::DeserializationError(format!("Failed to deserialize agent entry: {}", e)))
    }
}

/// Builder for creating agent registration arguments
pub struct AgentBuilder {
    args: AgentArgs,
}

impl AgentBuilder {
    /// Create a new agent builder with required fields
    pub fn new(agent_id: impl Into<String>, name: impl Into<String>) -> Self {
        Self {
            args: AgentArgs {
                agent_id: agent_id.into(),
                name: name.into(),
                description: String::new(),
                agent_version: "1.0.0".to_string(),
                provider_name: None,
                provider_url: None,
                documentation_url: None,
                service_endpoints: vec![],
                capabilities_flags: 0,
                supported_input_modes: vec![],
                supported_output_modes: vec![],
                skills: vec![],
                security_info_uri: None,
                aea_address: None,
                economic_intent_summary: None,
                supported_aea_protocols_hash: None,
                extended_metadata_uri: None,
                tags: vec![],
            },
        }
    }
    
    /// Set the agent description
    pub fn description(mut self, description: impl Into<String>) -> Self {
        self.args.description = description.into();
        self
    }
    
    /// Set the agent version
    pub fn version(mut self, version: impl Into<String>) -> Self {
        self.args.agent_version = version.into();
        self
    }
    
    /// Set the provider name
    pub fn provider_name(mut self, name: impl Into<String>) -> Self {
        self.args.provider_name = Some(name.into());
        self
    }
    
    /// Set the provider URL
    pub fn provider_url(mut self, url: impl Into<String>) -> Self {
        self.args.provider_url = Some(url.into());
        self
    }
    
    /// Set the documentation URL
    pub fn documentation_url(mut self, url: impl Into<String>) -> Self {
        self.args.documentation_url = Some(url.into());
        self
    }
    
    /// Add a service endpoint
    pub fn add_service_endpoint(mut self, protocol: impl Into<String>, url: impl Into<String>, is_default: bool) -> SdkResult<Self> {
        let endpoint = ServiceEndpoint::new(protocol.into(), url.into(), is_default)?;
        self.args.service_endpoints.push(endpoint);
        Ok(self)
    }
    
    /// Set capabilities flags
    pub fn capabilities_flags(mut self, flags: u64) -> Self {
        self.args.capabilities_flags = flags;
        self
    }
    
    /// Add supported input modes
    pub fn supported_input_modes(mut self, modes: Vec<impl Into<String>>) -> Self {
        self.args.supported_input_modes = modes.into_iter().map(|m| m.into()).collect();
        self
    }
    
    /// Add supported output modes
    pub fn supported_output_modes(mut self, modes: Vec<impl Into<String>>) -> Self {
        self.args.supported_output_modes = modes.into_iter().map(|m| m.into()).collect();
        self
    }
    
    /// Add a skill
    pub fn add_skill(mut self, skill_id: impl Into<String>, name: impl Into<String>, tags: Vec<impl Into<String>>) -> SdkResult<Self> {
        let skill = AgentSkill::new(
            skill_id.into(),
            name.into(),
            tags.into_iter().map(|t| t.into()).collect(),
        )?;
        self.args.skills.push(skill);
        Ok(self)
    }
    
    /// Add tags
    pub fn tags(mut self, tags: Vec<impl Into<String>>) -> Self {
        self.args.tags = tags.into_iter().map(|t| t.into()).collect();
        self
    }
    
    /// Build and validate the agent arguments
    pub fn build(self) -> SdkResult<AgentArgs> {
        self.validate()?;
        Ok(self.args)
    }
    
    /// Validate the current arguments
    fn validate(&self) -> SdkResult<()> {
        let args = &self.args;
        
        // Validate required fields
        if args.agent_id.is_empty() || args.agent_id.len() > MAX_AGENT_ID_LEN {
            return Err(SdkError::InvalidAgentIdLength);
        }
        
        if args.name.is_empty() || args.name.len() > MAX_AGENT_NAME_LEN {
            return Err(SdkError::InvalidNameLength);
        }
        
        if args.description.len() > MAX_AGENT_DESCRIPTION_LEN {
            return Err(SdkError::InvalidDescriptionLength);
        }
        
        if args.agent_version.len() > MAX_AGENT_VERSION_LEN {
            return Err(SdkError::InvalidVersionLength);
        }
        
        // Validate optional fields
        if let Some(ref provider_name) = args.provider_name {
            if provider_name.len() > MAX_PROVIDER_NAME_LEN {
                return Err(SdkError::InvalidProviderNameLength);
            }
        }
        
        if let Some(ref provider_url) = args.provider_url {
            if provider_url.len() > MAX_PROVIDER_URL_LEN {
                return Err(SdkError::InvalidProviderUrlLength);
            }
        }
        
        if let Some(ref doc_url) = args.documentation_url {
            if doc_url.len() > MAX_DOCUMENTATION_URL_LEN {
                return Err(SdkError::InvalidDocumentationUrlLength);
            }
        }
        
        // Validate service endpoints
        if args.service_endpoints.len() > MAX_SERVICE_ENDPOINTS {
            return Err(SdkError::TooManyServiceEndpoints);
        }
        
        let default_endpoints = args.service_endpoints.iter().filter(|e| e.is_default).count();
        if default_endpoints > 1 {
            return Err(SdkError::MultipleDefaultEndpoints);
        }
        
        // Validate modes
        if args.supported_input_modes.len() > MAX_SUPPORTED_MODES {
            return Err(SdkError::TooManySupportedInputModes);
        }
        
        if args.supported_output_modes.len() > MAX_SUPPORTED_MODES {
            return Err(SdkError::TooManySupportedOutputModes);
        }
        
        for mode in &args.supported_input_modes {
            if mode.len() > MAX_MODE_LEN {
                return Err(SdkError::InvalidInputModeLength);
            }
        }
        
        for mode in &args.supported_output_modes {
            if mode.len() > MAX_MODE_LEN {
                return Err(SdkError::InvalidOutputModeLength);
            }
        }
        
        // Validate skills
        if args.skills.len() > MAX_SKILLS {
            return Err(SdkError::TooManySkills);
        }
        
        // Validate optional URIs
        if let Some(ref uri) = args.security_info_uri {
            if uri.len() > MAX_SECURITY_INFO_URI_LEN {
                return Err(SdkError::InvalidSecurityInfoUriLength);
            }
        }
        
        if let Some(ref address) = args.aea_address {
            if address.len() > MAX_AEA_ADDRESS_LEN {
                return Err(SdkError::InvalidAeaAddressLength);
            }
        }
        
        if let Some(ref summary) = args.economic_intent_summary {
            if summary.len() > MAX_ECONOMIC_INTENT_LEN {
                return Err(SdkError::InvalidEconomicIntentSummaryLength);
            }
        }
        
        if let Some(ref uri) = args.extended_metadata_uri {
            if uri.len() > MAX_EXTENDED_METADATA_URI_LEN {
                return Err(SdkError::InvalidExtendedMetadataUriLength);
            }
        }
        
        // Validate tags
        if args.tags.len() > MAX_AGENT_TAGS {
            return Err(SdkError::TooManyTags);
        }
        
        for tag in &args.tags {
            if tag.len() > MAX_AGENT_TAG_LEN {
                return Err(SdkError::InvalidTagLength);
            }
        }
        
        Ok(())
    }
}

/// Agent registry operations
pub struct AgentRegistry;

impl AgentRegistry {
    /// Create a register agent instruction
    pub fn register(
        program_id: &Pubkey,
        owner: &Pubkey,
        args: AgentArgs,
    ) -> SdkResult<Instruction> {
        create_register_agent_instruction(program_id, owner, args)
    }
    
    /// Create an update agent instruction
    pub fn update(
        program_id: &Pubkey,
        owner: &Pubkey,
        agent_id: &str,
        patch: AgentPatch,
    ) -> SdkResult<Instruction> {
        create_update_agent_instruction(program_id, owner, agent_id, patch)
    }
    
    /// Create an update agent status instruction
    pub fn update_status(
        program_id: &Pubkey,
        owner: &Pubkey,
        agent_id: &str,
        status: u8,
    ) -> SdkResult<Instruction> {
        create_update_agent_status_instruction(program_id, owner, agent_id, status)
    }
    
    /// Create a deregister agent instruction
    pub fn deregister(
        program_id: &Pubkey,
        owner: &Pubkey,
        agent_id: &str,
    ) -> SdkResult<Instruction> {
        create_deregister_agent_instruction(program_id, owner, agent_id)
    }
    
    /// Derive the PDA for an agent
    pub fn derive_pda(
        program_id: &Pubkey,
        owner: &Pubkey,
        agent_id: &str,
    ) -> SdkResult<(Pubkey, u8)> {
        derive_agent_pda_with_bump(program_id, owner, agent_id)
    }
}

/// Derive agent PDA
pub fn derive_agent_pda(program_id: &Pubkey, owner: &Pubkey, agent_id: &str) -> SdkResult<Pubkey> {
    let (pda, _) = derive_agent_pda_with_bump(program_id, owner, agent_id)?;
    Ok(pda)
}

/// Derive agent PDA with bump
pub fn derive_agent_pda_with_bump(program_id: &Pubkey, owner: &Pubkey, agent_id: &str) -> SdkResult<(Pubkey, u8)> {
    let seeds = &[
        b"agent_reg_v1",
        agent_id.as_bytes(),
        owner.as_ref(),
    ];
    
    let (pda, bump) = Pubkey::find_program_address(seeds, program_id);
    Ok((pda, bump))
}

/// Create register agent instruction
pub fn create_register_agent_instruction(
    program_id: &Pubkey,
    owner: &Pubkey,
    args: AgentArgs,
) -> SdkResult<Instruction> {
    let agent_pda = derive_agent_pda(program_id, owner, &args.agent_id)?;
    
    let accounts = vec![
        AccountMeta::new(agent_pda, false),
        AccountMeta::new_readonly(*owner, true),
        AccountMeta::new(*owner, true), // payer
        AccountMeta::new_readonly(system_program::id(), false),
    ];
    
    // Create instruction data (simplified - would need proper serialization)
    let mut data = vec![0u8]; // instruction discriminator
    data.extend_from_slice(&args.agent_id.as_bytes());
    
    Ok(Instruction {
        program_id: *program_id,
        accounts,
        data,
    })
}

/// Create update agent instruction
pub fn create_update_agent_instruction(
    program_id: &Pubkey,
    owner: &Pubkey,
    agent_id: &str,
    _patch: AgentPatch,
) -> SdkResult<Instruction> {
    let agent_pda = derive_agent_pda(program_id, owner, agent_id)?;
    
    let accounts = vec![
        AccountMeta::new(agent_pda, false),
        AccountMeta::new_readonly(*owner, true),
    ];
    
    let mut data = vec![1u8]; // instruction discriminator
    data.extend_from_slice(agent_id.as_bytes());
    
    Ok(Instruction {
        program_id: *program_id,
        accounts,
        data,
    })
}

/// Create update agent status instruction
pub fn create_update_agent_status_instruction(
    program_id: &Pubkey,
    owner: &Pubkey,
    agent_id: &str,
    status: u8,
) -> SdkResult<Instruction> {
    let agent_pda = derive_agent_pda(program_id, owner, agent_id)?;
    
    let accounts = vec![
        AccountMeta::new(agent_pda, false),
        AccountMeta::new_readonly(*owner, true),
    ];
    
    let data = vec![2u8, status]; // instruction discriminator + status
    
    Ok(Instruction {
        program_id: *program_id,
        accounts,
        data,
    })
}

/// Create deregister agent instruction
pub fn create_deregister_agent_instruction(
    program_id: &Pubkey,
    owner: &Pubkey,
    agent_id: &str,
) -> SdkResult<Instruction> {
    let agent_pda = derive_agent_pda(program_id, owner, agent_id)?;
    
    let accounts = vec![
        AccountMeta::new(agent_pda, false),
        AccountMeta::new_readonly(*owner, true),
    ];
    
    let data = vec![3u8]; // instruction discriminator
    
    Ok(Instruction {
        program_id: *program_id,
        accounts,
        data,
    })
}

#[cfg(test)]
mod tests {
    use super::*;
    use solana_sdk::signer::keypair::Keypair;
    use solana_sdk::signature::Signer;

    #[test]
    fn test_agent_builder() {
        let agent = AgentBuilder::new("test-agent", "Test Agent")
            .description("A test agent")
            .version("1.0.0")
            .build()
            .unwrap();
        
        assert_eq!(agent.agent_id, "test-agent");
        assert_eq!(agent.name, "Test Agent");
        assert_eq!(agent.description, "A test agent");
        assert_eq!(agent.agent_version, "1.0.0");
    }
    
    #[test]
    fn test_agent_builder_with_endpoints() {
        let agent = AgentBuilder::new("test-agent", "Test Agent")
            .add_service_endpoint("http", "http://localhost:8080", true)
            .unwrap()
            .build()
            .unwrap();
        
        assert_eq!(agent.service_endpoints.len(), 1);
        assert_eq!(agent.service_endpoints[0].protocol, "http");
        assert_eq!(agent.service_endpoints[0].url, "http://localhost:8080");
        assert!(agent.service_endpoints[0].is_default);
    }
    
    #[test]
    fn test_agent_builder_validation() {
        // Test empty agent ID
        let result = AgentBuilder::new("", "Test Agent").build();
        assert!(matches!(result, Err(SdkError::InvalidAgentIdLength)));
        
        // Test empty name
        let result = AgentBuilder::new("test-agent", "").build();
        assert!(matches!(result, Err(SdkError::InvalidNameLength)));
        
        // Test too long agent ID
        let long_id = "a".repeat(MAX_AGENT_ID_LEN + 1);
        let result = AgentBuilder::new(long_id, "Test Agent").build();
        assert!(matches!(result, Err(SdkError::InvalidAgentIdLength)));
    }
    
    #[test]
    fn test_derive_agent_pda() {
        let program_id = Pubkey::new_unique();
        let owner = Keypair::new().pubkey();
        let agent_id = "test-agent";
        
        let pda = derive_agent_pda(&program_id, &owner, agent_id).unwrap();
        assert_ne!(pda, Pubkey::default());
        
        // Should be deterministic
        let pda2 = derive_agent_pda(&program_id, &owner, agent_id).unwrap();
        assert_eq!(pda, pda2);
    }
    
    #[test]
    fn test_agent_status() {
        assert_eq!(AgentStatus::from_u8(0), Some(AgentStatus::Pending));
        assert_eq!(AgentStatus::from_u8(1), Some(AgentStatus::Active));
        assert_eq!(AgentStatus::from_u8(2), Some(AgentStatus::Inactive));
        assert_eq!(AgentStatus::from_u8(3), Some(AgentStatus::Deregistered));
        assert_eq!(AgentStatus::from_u8(4), None);
        
        assert_eq!(AgentStatus::default(), AgentStatus::Pending);
    }
    
    #[test]
    fn test_service_endpoint_validation() {
        // Valid endpoint
        let endpoint = ServiceEndpoint::new("http".to_string(), "http://localhost:8080".to_string(), true);
        assert!(endpoint.is_ok());
        
        // Empty protocol
        let endpoint = ServiceEndpoint::new("".to_string(), "http://localhost:8080".to_string(), true);
        assert!(matches!(endpoint, Err(SdkError::InvalidEndpointProtocolLength)));
        
        // Empty URL
        let endpoint = ServiceEndpoint::new("http".to_string(), "".to_string(), true);
        assert!(matches!(endpoint, Err(SdkError::InvalidEndpointUrlLength)));
        
        // Too long protocol
        let long_protocol = "a".repeat(MAX_ENDPOINT_PROTOCOL_LEN + 1);
        let endpoint = ServiceEndpoint::new(long_protocol, "http://localhost:8080".to_string(), true);
        assert!(matches!(endpoint, Err(SdkError::InvalidEndpointProtocolLength)));
    }
    
    #[test]
    fn test_agent_skill_validation() {
        // Valid skill
        let skill = AgentSkill::new("skill1".to_string(), "Test Skill".to_string(), vec!["tag1".to_string()]);
        assert!(skill.is_ok());
        
        // Empty skill ID
        let skill = AgentSkill::new("".to_string(), "Test Skill".to_string(), vec![]);
        assert!(matches!(skill, Err(SdkError::InvalidSkillIdLength)));
        
        // Empty skill name
        let skill = AgentSkill::new("skill1".to_string(), "".to_string(), vec![]);
        assert!(matches!(skill, Err(SdkError::InvalidSkillNameLength)));
        
        // Too many tags
        let too_many_tags = vec!["tag".to_string(); MAX_SKILL_TAGS + 1];
        let skill = AgentSkill::new("skill1".to_string(), "Test Skill".to_string(), too_many_tags);
        assert!(matches!(skill, Err(SdkError::TooManySkillTags)));
    }
}