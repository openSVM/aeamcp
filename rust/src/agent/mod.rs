//! Agent Registry SDK module
//!
//! This module provides high-level functions for interacting with the Agent Registry,
//! including registration, updates, and queries for autonomous agents.

use crate::errors::{SdkError, SdkResult};
use borsh::{BorshDeserialize, BorshSerialize};
use solana_sdk::{
    instruction::{AccountMeta, Instruction},
    pubkey::Pubkey,
    system_program,
};

/// Service endpoint input for instruction serialization (matches on-chain format)
#[derive(Debug, Clone, BorshSerialize, BorshDeserialize, PartialEq)]
pub struct ServiceEndpointInput {
    pub protocol: String,
    pub url: String,
    pub is_default: bool,
}

/// Agent skill input for instruction serialization (matches on-chain format)  
#[derive(Debug, Clone, BorshSerialize, BorshDeserialize, PartialEq)]
pub struct AgentSkillInput {
    pub skill_id: String,
    pub name: String,
    pub description_hash: Option<[u8; HASH_SIZE]>,
    pub tags: Vec<String>,
}

/// Agent update details input for instruction serialization (matches on-chain format)
#[derive(Debug, Clone, BorshSerialize, BorshDeserialize, PartialEq, Default)]
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

/// Agent registry instruction enum (matches on-chain format exactly)
#[derive(Debug, Clone, BorshSerialize, BorshDeserialize, PartialEq)]
pub enum AgentRegistryInstruction {
    RegisterAgent {
        agent_id: String,
        name: String,
        description: String,
        agent_version: String,
        provider_name: Option<String>,
        provider_url: Option<String>,
        documentation_url: Option<String>,
        service_endpoints: Vec<ServiceEndpointInput>,
        capabilities_flags: u64,
        supported_input_modes: Vec<String>,
        supported_output_modes: Vec<String>,
        skills: Vec<AgentSkillInput>,
        security_info_uri: Option<String>,
        aea_address: Option<String>,
        economic_intent_summary: Option<String>,
        supported_aea_protocols_hash: Option<[u8; HASH_SIZE]>,
        extended_metadata_uri: Option<String>,
        tags: Vec<String>,
    },
    UpdateAgentDetails {
        details: AgentUpdateDetailsInput,
    },
    UpdateAgentStatus {
        new_status: u8,
    },
    DeregisterAgent,
}

/// Maximum length constants (from the on-chain program)
/// These limits are enforced by the Solana AI Registries program to ensure
/// efficient storage and consistent behavior across the network.
/// 
/// **References:**
/// - On-chain program constraints: [Agent Registry Program Documentation](https://docs.solana-ai-registries.org/program/agent-registry)
/// - Program source: `programs/agent-registry/src/lib.rs`

/// Maximum length for agent ID field (64 bytes)
/// This allows for reasonably descriptive identifiers while keeping storage efficient.
/// Must be unique within the owner's namespace.
pub const MAX_AGENT_ID_LEN: usize = 64;

/// Maximum length for agent name field (128 bytes)  
/// Provides space for human-readable agent names and titles.
pub const MAX_AGENT_NAME_LEN: usize = 128;

/// Maximum length for agent description field (512 bytes)
/// Allows for detailed descriptions while preventing excessive storage costs.
pub const MAX_AGENT_DESCRIPTION_LEN: usize = 512;

/// Maximum length for agent version string (32 bytes)
/// Follows semantic versioning conventions (e.g., "1.2.3-beta").
pub const MAX_AGENT_VERSION_LEN: usize = 32;

/// Maximum length for provider name field (128 bytes)
/// Name of the organization or individual providing the agent.
pub const MAX_PROVIDER_NAME_LEN: usize = 128;

/// Maximum length for provider URL field (256 bytes)
/// URL to the provider's website or profile page.
pub const MAX_PROVIDER_URL_LEN: usize = 256;

/// Maximum length for documentation URL field (256 bytes)
/// URL pointing to the agent's documentation or API reference.
pub const MAX_DOCUMENTATION_URL_LEN: usize = 256;

/// Maximum number of service endpoints per agent (3 endpoints)
/// Supports primary, fallback, and development endpoints without excessive complexity.
pub const MAX_SERVICE_ENDPOINTS: usize = 3;

/// Maximum length for service endpoint protocol field (64 bytes)
/// e.g., "http", "https", "websocket", "grpc"
pub const MAX_ENDPOINT_PROTOCOL_LEN: usize = 64;

/// Maximum length for service endpoint URL field (256 bytes)
/// Full URL including protocol, domain, port, and path.
pub const MAX_ENDPOINT_URL_LEN: usize = 256;

/// Maximum number of supported input/output modes per agent (5 modes)
/// Balances flexibility with storage efficiency.
pub const MAX_SUPPORTED_MODES: usize = 5;

/// Maximum length for input/output mode strings (64 bytes)
/// e.g., "text", "json", "image", "audio"
pub const MAX_MODE_LEN: usize = 64;

/// Maximum number of skills per agent (10 skills)
/// Allows comprehensive skill representation while preventing abuse.
pub const MAX_SKILLS: usize = 10;

/// Maximum length for skill ID field (64 bytes)
/// Unique identifier for the skill within the agent.
pub const MAX_SKILL_ID_LEN: usize = 64;

/// Maximum length for skill name field (128 bytes)
/// Human-readable name for the skill.
pub const MAX_SKILL_NAME_LEN: usize = 128;

/// Maximum number of tags per skill (5 tags)
/// Enables categorization and discovery without overwhelming metadata.
pub const MAX_SKILL_TAGS: usize = 5;

/// Maximum length for skill tag strings (32 bytes)
/// e.g., "nlp", "vision", "reasoning"
pub const MAX_SKILL_TAG_LEN: usize = 32;

/// Maximum length for security info URI field (256 bytes)
/// URL pointing to security audit reports or vulnerability disclosures.
pub const MAX_SECURITY_INFO_URI_LEN: usize = 256;

/// Maximum length for AEA (Autonomous Economic Agent) address field (128 bytes)
/// Address format specific to the AEA framework.
pub const MAX_AEA_ADDRESS_LEN: usize = 128;

/// Maximum length for economic intent summary field (256 bytes)
/// Brief description of the agent's economic model and objectives.
pub const MAX_ECONOMIC_INTENT_LEN: usize = 256;

/// Maximum length for extended metadata URI field (256 bytes)
/// URL pointing to additional metadata stored off-chain.
pub const MAX_EXTENDED_METADATA_URI_LEN: usize = 256;

/// Maximum number of tags per agent (10 tags)
/// Enables rich categorization for discovery and filtering.
pub const MAX_AGENT_TAGS: usize = 10;

/// Maximum length for agent tag strings (32 bytes)
/// e.g., "chatbot", "trading", "analytics"
pub const MAX_AGENT_TAG_LEN: usize = 32;

/// Hash size for content addressing (32 bytes)
/// SHA-256 hash size used for content verification.
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

impl From<ServiceEndpoint> for ServiceEndpointInput {
    fn from(endpoint: ServiceEndpoint) -> Self {
        Self {
            protocol: endpoint.protocol,
            url: endpoint.url,
            is_default: endpoint.is_default,
        }
    }
}

impl From<AgentSkill> for AgentSkillInput {
    fn from(skill: AgentSkill) -> Self {
        Self {
            skill_id: skill.skill_id,
            name: skill.name,
            description_hash: None, // SDK doesn't support description hashes yet
            tags: skill.tags,
        }
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

impl From<AgentPatch> for AgentUpdateDetailsInput {
    fn from(patch: AgentPatch) -> Self {
        Self {
            name: patch.name,
            description: patch.description,
            agent_version: patch.agent_version,
            provider_name: patch.provider_name,
            clear_provider_name: patch.clear_provider_name,
            provider_url: patch.provider_url,
            clear_provider_url: patch.clear_provider_url,
            documentation_url: patch.documentation_url,
            clear_documentation_url: patch.clear_documentation_url,
            service_endpoints: patch.service_endpoints.map(|endpoints| {
                endpoints.into_iter().map(|e| e.into()).collect()
            }),
            capabilities_flags: patch.capabilities_flags,
            supported_input_modes: patch.supported_input_modes,
            supported_output_modes: patch.supported_output_modes,
            skills: patch.skills.map(|skills| {
                skills.into_iter().map(|s| s.into()).collect()
            }),
            security_info_uri: patch.security_info_uri,
            clear_security_info_uri: patch.clear_security_info_uri,
            aea_address: patch.aea_address,
            clear_aea_address: patch.clear_aea_address,
            economic_intent_summary: patch.economic_intent_summary,
            clear_economic_intent_summary: patch.clear_economic_intent_summary,
            supported_aea_protocols_hash: patch.supported_aea_protocols_hash,
            clear_supported_aea_protocols_hash: patch.clear_supported_aea_protocols_hash,
            extended_metadata_uri: patch.extended_metadata_uri,
            clear_extended_metadata_uri: patch.clear_extended_metadata_uri,
            tags: patch.tags,
        }
    }
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
        crate::client::deserialize_account_data(data, "agent entry")
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
    pub fn add_service_endpoint(
        mut self,
        protocol: impl Into<String>,
        url: impl Into<String>,
        is_default: bool,
    ) -> SdkResult<Self> {
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
    pub fn add_skill(
        mut self,
        skill_id: impl Into<String>,
        name: impl Into<String>,
        tags: Vec<impl Into<String>>,
    ) -> SdkResult<Self> {
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

        let default_endpoints = args
            .service_endpoints
            .iter()
            .filter(|e| e.is_default)
            .count();
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
pub fn derive_agent_pda_with_bump(
    program_id: &Pubkey,
    owner: &Pubkey,
    agent_id: &str,
) -> SdkResult<(Pubkey, u8)> {
    let seeds = &[b"agent_reg_v1", agent_id.as_bytes(), owner.as_ref()];

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

    // Create proper instruction with Borsh serialization
    let instruction = AgentRegistryInstruction::RegisterAgent {
        agent_id: args.agent_id,
        name: args.name,
        description: args.description,
        agent_version: args.agent_version,
        provider_name: args.provider_name,
        provider_url: args.provider_url,
        documentation_url: args.documentation_url,
        service_endpoints: args.service_endpoints.into_iter().map(|e| e.into()).collect(),
        capabilities_flags: args.capabilities_flags,
        supported_input_modes: args.supported_input_modes,
        supported_output_modes: args.supported_output_modes,
        skills: args.skills.into_iter().map(|s| s.into()).collect(),
        security_info_uri: args.security_info_uri,
        aea_address: args.aea_address,
        economic_intent_summary: args.economic_intent_summary,
        supported_aea_protocols_hash: args.supported_aea_protocols_hash,
        extended_metadata_uri: args.extended_metadata_uri,
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

/// Create update agent instruction
pub fn create_update_agent_instruction(
    program_id: &Pubkey,
    owner: &Pubkey,
    agent_id: &str,
    patch: AgentPatch,
) -> SdkResult<Instruction> {
    let agent_pda = derive_agent_pda(program_id, owner, agent_id)?;

    let accounts = vec![
        AccountMeta::new(agent_pda, false),
        AccountMeta::new_readonly(*owner, true),
    ];

    let instruction = AgentRegistryInstruction::UpdateAgentDetails {
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

    let instruction = AgentRegistryInstruction::UpdateAgentStatus {
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

    let instruction = AgentRegistryInstruction::DeregisterAgent;

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
        let endpoint = ServiceEndpoint::new(
            "http".to_string(),
            "http://localhost:8080".to_string(),
            true,
        );
        assert!(endpoint.is_ok());

        // Empty protocol
        let endpoint =
            ServiceEndpoint::new("".to_string(), "http://localhost:8080".to_string(), true);
        assert!(matches!(
            endpoint,
            Err(SdkError::InvalidEndpointProtocolLength)
        ));

        // Empty URL
        let endpoint = ServiceEndpoint::new("http".to_string(), "".to_string(), true);
        assert!(matches!(endpoint, Err(SdkError::InvalidEndpointUrlLength)));

        // Too long protocol
        let long_protocol = "a".repeat(MAX_ENDPOINT_PROTOCOL_LEN + 1);
        let endpoint =
            ServiceEndpoint::new(long_protocol, "http://localhost:8080".to_string(), true);
        assert!(matches!(
            endpoint,
            Err(SdkError::InvalidEndpointProtocolLength)
        ));
    }

    #[test]
    fn test_agent_skill_validation() {
        // Valid skill
        let skill = AgentSkill::new(
            "skill1".to_string(),
            "Test Skill".to_string(),
            vec!["tag1".to_string()],
        );
        assert!(skill.is_ok());

        // Empty skill ID
        let skill = AgentSkill::new("".to_string(), "Test Skill".to_string(), vec![]);
        assert!(matches!(skill, Err(SdkError::InvalidSkillIdLength)));

        // Empty skill name
        let skill = AgentSkill::new("skill1".to_string(), "".to_string(), vec![]);
        assert!(matches!(skill, Err(SdkError::InvalidSkillNameLength)));

        // Too many tags
        let too_many_tags = vec!["tag".to_string(); MAX_SKILL_TAGS + 1];
        let skill = AgentSkill::new(
            "skill1".to_string(),
            "Test Skill".to_string(),
            too_many_tags,
        );
        assert!(matches!(skill, Err(SdkError::TooManySkillTags)));
    }
}
