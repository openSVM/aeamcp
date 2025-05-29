//! State definitions for the Agent Registry program

use borsh::{BorshDeserialize, BorshSerialize};
use solana_program::pubkey::Pubkey;
use shank::ShankAccount;
use aeamcp_common::{
    constants::*,
    error::RegistryError,
    serialization::*,
    AgentStatus,
};

/// Agent Registry Entry (V1) - Solana account structure for storing agent data on-chain
#[derive(BorshSerialize, BorshDeserialize, Clone, Debug, PartialEq, ShankAccount)]
pub struct AgentRegistryEntryV1 {
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
    /// Unique identifier for the agent
    pub agent_id: String,
    /// Human-readable name of the agent
    pub name: String,
    /// Human-readable description of the agent (can use CommonMark)
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
    /// Optional URI to detailed security scheme definitions (e.g., OpenAPI format)
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
    
    // Token-related fields for Phase 1
    /// SVMAI Token mint address
    pub token_mint: Pubkey,
    /// Amount of SVMAI tokens staked
    pub staked_amount: u64,
    /// When tokens were staked
    pub staking_timestamp: i64,
    /// Lock period end timestamp
    pub stake_locked_until: i64,
    /// Staking tier (0: None, 1: Bronze, 2: Silver, 3: Gold, 4: Platinum)
    pub staking_tier: u8,
    /// Total SVMAI earned from services
    pub total_earnings: u64,
    /// Current number of active service escrows
    pub active_escrows: u8,
    /// Total completed services
    pub completed_services: u32,
    /// Total disputes (won + lost)
    pub dispute_count: u16,
    /// Disputes won by agent
    pub dispute_wins: u16,
    /// Calculated reputation (0-10000)
    pub reputation_score: u64,
    /// Last 10 service ratings (1-5)
    pub quality_ratings: Vec<u8>,
    /// Average response time in seconds
    pub response_time_avg: u32,
    /// Minimum SVMAI fee for services
    pub base_service_fee: u64,
    /// Fee multiplier for priority (100 = 1x, 150 = 1.5x, etc.)
    pub priority_multiplier: u8,
    /// Whether agent uses escrow system
    pub accepts_escrow: bool,
    /// Amount paid for registration
    pub registration_fee_paid: u64,
    /// Timestamp of last fee update
    pub last_fee_update: i64,
    /// Total fees collected in SVMAI
    pub total_fees_collected: u64,
}

impl AgentRegistryEntryV1 {
    /// Calculate the space required for this account
    pub const SPACE: usize = 8 // Discriminator
        + 1  // bump
        + 1  // registry_version
        + 8  // state_version
        + 1  // operation_in_progress
        + 32 // owner_authority
        + borsh_size_string(MAX_AGENT_ID_LEN)
        + borsh_size_string(MAX_AGENT_NAME_LEN)
        + borsh_size_string(MAX_AGENT_DESCRIPTION_LEN)
        + borsh_size_string(MAX_AGENT_VERSION_LEN)
        + borsh_size_option_string(MAX_PROVIDER_NAME_LEN)
        + borsh_size_option_string(MAX_PROVIDER_URL_LEN)
        + borsh_size_option_string(MAX_DOCUMENTATION_URL_LEN)
        + STRING_LEN_PREFIX_SIZE + (MAX_SERVICE_ENDPOINTS * ServiceEndpoint::SERIALIZED_SIZE)
        + 8  // capabilities_flags
        + borsh_size_vec_string(MAX_SUPPORTED_MODES, MAX_MODE_LEN) // supported_input_modes
        + borsh_size_vec_string(MAX_SUPPORTED_MODES, MAX_MODE_LEN) // supported_output_modes
        + STRING_LEN_PREFIX_SIZE + (MAX_SKILLS * AgentSkill::SERIALIZED_SIZE)
        + borsh_size_option_string(MAX_SECURITY_INFO_URI_LEN)
        + borsh_size_option_string(MAX_AEA_ADDRESS_LEN)
        + borsh_size_option_string(MAX_ECONOMIC_INTENT_LEN)
        + borsh_size_option_hash() // supported_aea_protocols_hash
        + 1  // status
        + 8  // registration_timestamp
        + 8  // last_update_timestamp
        + borsh_size_option_string(MAX_EXTENDED_METADATA_URI_LEN)
        + borsh_size_vec_string(MAX_AGENT_TAGS, MAX_AGENT_TAG_LEN)
        // Token-related fields
        + 32 // token_mint
        + 8  // staked_amount
        + 8  // staking_timestamp
        + 8  // stake_locked_until
        + 1  // staking_tier
        + 8  // total_earnings
        + 1  // active_escrows
        + 4  // completed_services
        + 2  // dispute_count
        + 2  // dispute_wins
        + 8  // reputation_score
        + STRING_LEN_PREFIX_SIZE + (10 * 1) // quality_ratings (Vec<u8> max 10)
        + 4  // response_time_avg
        + 8  // base_service_fee
        + 1  // priority_multiplier
        + 1  // accepts_escrow
        + 8  // registration_fee_paid
        + 8  // last_fee_update
        + 8; // total_fees_collected

    /// Create a new agent registry entry
    pub fn new(
        bump: u8,
        owner_authority: Pubkey,
        agent_id: String,
        name: String,
        description: String,
        agent_version: String,
        provider_name: Option<String>,
        provider_url: Option<String>,
        documentation_url: Option<String>,
        service_endpoints: Vec<ServiceEndpoint>,
        capabilities_flags: u64,
        supported_input_modes: Vec<String>,
        supported_output_modes: Vec<String>,
        skills: Vec<AgentSkill>,
        security_info_uri: Option<String>,
        aea_address: Option<String>,
        economic_intent_summary: Option<String>,
        supported_aea_protocols_hash: Option<[u8; HASH_SIZE]>,
        extended_metadata_uri: Option<String>,
        tags: Vec<String>,
        timestamp: i64,
    ) -> Self {
        Self {
            bump,
            registry_version: 1,
            state_version: 0,
            operation_in_progress: false,
            owner_authority,
            agent_id,
            name,
            description,
            agent_version,
            provider_name,
            provider_url,
            documentation_url,
            service_endpoints,
            capabilities_flags,
            supported_input_modes,
            supported_output_modes,
            skills,
            security_info_uri,
            aea_address,
            economic_intent_summary,
            supported_aea_protocols_hash,
            status: AgentStatus::Pending as u8,
            registration_timestamp: timestamp,
            last_update_timestamp: timestamp,
            extended_metadata_uri,
            tags,
            // Initialize token fields with defaults
            token_mint: Pubkey::default(),
            staked_amount: 0,
            staking_timestamp: 0,
            stake_locked_until: 0,
            staking_tier: 0,
            total_earnings: 0,
            active_escrows: 0,
            completed_services: 0,
            dispute_count: 0,
            dispute_wins: 0,
            reputation_score: 0,
            quality_ratings: Vec::new(),
            response_time_avg: 0,
            base_service_fee: 0,
            priority_multiplier: 100,
            accepts_escrow: false,
            registration_fee_paid: 0,
            last_fee_update: 0,
            total_fees_collected: 0,
        }
    }

    /// Update the last update timestamp with version check
    pub fn update_timestamp(&mut self, timestamp: i64, expected_version: u64) -> Result<(), RegistryError> {
        if self.state_version != expected_version {
            return Err(RegistryError::StateVersionMismatch);
        }
        self.last_update_timestamp = timestamp;
        self.state_version += 1;
        Ok(())
    }

    /// Update the status with version check
    pub fn update_status(&mut self, status: u8, timestamp: i64, expected_version: u64) -> Result<(), RegistryError> {
        if self.state_version != expected_version {
            return Err(RegistryError::StateVersionMismatch);
        }
        self.status = status;
        self.last_update_timestamp = timestamp;
        self.state_version += 1;
        Ok(())
    }

    /// Begin an operation (reentrancy guard)
    pub fn begin_operation(&mut self) -> Result<(), RegistryError> {
        if self.operation_in_progress {
            return Err(RegistryError::OperationInProgress);
        }
        self.operation_in_progress = true;
        Ok(())
    }

    /// End an operation (reentrancy guard)
    pub fn end_operation(&mut self) {
        self.operation_in_progress = false;
    }

    /// Atomic update with version checking
    pub fn atomic_update<F>(&mut self, expected_version: u64, update_fn: F) -> Result<(), RegistryError>
    where
        F: FnOnce(&mut Self) -> Result<(), RegistryError>
    {
        if self.state_version != expected_version {
            return Err(RegistryError::StateVersionMismatch);
        }
        self.begin_operation()?;
        
        let result = update_fn(self);
        
        if result.is_ok() {
            self.state_version += 1;
        }
        self.end_operation();
        result
    }

    /// Check if the agent is active
    pub fn is_active(&self) -> bool {
        self.status == AgentStatus::Active as u8
    }

    /// Check if the agent is deregistered
    pub fn is_deregistered(&self) -> bool {
        self.status == AgentStatus::Deregistered as u8
    }

    /// Get the agent status as enum
    pub fn get_status(&self) -> Option<AgentStatus> {
        AgentStatus::from_u8(self.status)
    }

    /// Validate service endpoints
    pub fn validate_service_endpoints(&self) -> bool {
        if self.service_endpoints.is_empty() {
            return true; // Empty is allowed
        }

        let default_count = self.service_endpoints.iter().filter(|ep| ep.is_default).count();
        default_count == 1 // Exactly one default endpoint required if any endpoints exist
    }

    /// Get the default service endpoint
    pub fn get_default_endpoint(&self) -> Option<&ServiceEndpoint> {
        self.service_endpoints.iter().find(|ep| ep.is_default)
    }

    /// Get skills by tag
    pub fn get_skills_by_tag(&self, tag: &str) -> Vec<&AgentSkill> {
        self.skills
            .iter()
            .filter(|skill| skill.tags.contains(&tag.to_string()))
            .collect()
    }

    /// Check if agent has a specific tag
    pub fn has_tag(&self, tag: &str) -> bool {
        self.tags.contains(&tag.to_string())
    }

    /// Check if agent has a specific skill
    pub fn has_skill(&self, skill_id: &str) -> bool {
        self.skills.iter().any(|skill| skill.id == skill_id)
    }
    
    /// Update staking information
    pub fn update_staking(
        &mut self,
        amount: u64,
        tier: u8,
        lock_until: i64,
        timestamp: i64,
    ) {
        self.staked_amount = amount;
        self.staking_tier = tier;
        self.stake_locked_until = lock_until;
        self.staking_timestamp = timestamp;
        self.last_update_timestamp = timestamp;
        self.state_version += 1;
    }
    
    /// Update service fees
    pub fn update_service_fees(
        &mut self,
        base_fee: u64,
        priority_multiplier: u8,
        accepts_escrow: bool,
        timestamp: i64,
    ) {
        self.base_service_fee = base_fee;
        self.priority_multiplier = priority_multiplier;
        self.accepts_escrow = accepts_escrow;
        self.last_fee_update = timestamp;
        self.last_update_timestamp = timestamp;
        self.state_version += 1;
    }
    
    /// Record service completion
    pub fn record_service_completion(
        &mut self,
        earnings: u64,
        rating: u8,
        response_time: u32,
    ) {
        self.completed_services += 1;
        self.total_earnings += earnings;
        
        // Update quality ratings (keep last 10)
        self.quality_ratings.push(rating);
        if self.quality_ratings.len() > 10 {
            self.quality_ratings.remove(0);
        }
        
        // Update average response time
        if self.response_time_avg == 0 {
            self.response_time_avg = response_time;
        } else {
            self.response_time_avg = (self.response_time_avg + response_time) / 2;
        }
        
        self.state_version += 1;
    }
    
    /// Record dispute outcome
    pub fn record_dispute_outcome(&mut self, won: bool) {
        self.dispute_count += 1;
        if won {
            self.dispute_wins += 1;
        }
        self.state_version += 1;
    }
    
    /// Check if stake can be unlocked
    pub fn can_unstake(&self, current_timestamp: i64) -> bool {
        current_timestamp >= self.stake_locked_until
    }
}

impl Default for AgentRegistryEntryV1 {
    fn default() -> Self {
        Self {
            bump: 0,
            registry_version: 1,
            state_version: 0,
            operation_in_progress: false,
            owner_authority: Pubkey::default(),
            agent_id: String::new(),
            name: String::new(),
            description: String::new(),
            agent_version: String::new(),
            provider_name: None,
            provider_url: None,
            documentation_url: None,
            service_endpoints: Vec::new(),
            capabilities_flags: 0,
            supported_input_modes: Vec::new(),
            supported_output_modes: Vec::new(),
            skills: Vec::new(),
            security_info_uri: None,
            aea_address: None,
            economic_intent_summary: None,
            supported_aea_protocols_hash: None,
            status: AgentStatus::Pending as u8,
            registration_timestamp: 0,
            last_update_timestamp: 0,
            extended_metadata_uri: None,
            tags: Vec::new(),
            // Token fields defaults
            token_mint: Pubkey::default(),
            staked_amount: 0,
            staking_timestamp: 0,
            stake_locked_until: 0,
            staking_tier: 0,
            total_earnings: 0,
            active_escrows: 0,
            completed_services: 0,
            dispute_count: 0,
            dispute_wins: 0,
            reputation_score: 0,
            quality_ratings: Vec::new(),
            response_time_avg: 0,
            base_service_fee: 0,
            priority_multiplier: 100,
            accepts_escrow: false,
            registration_fee_paid: 0,
            last_fee_update: 0,
            total_fees_collected: 0,
        }
    }
}

#[cfg(test)]
mod tests {
    use super::*;

    #[test]
    fn test_agent_registry_entry_creation() {
        let owner = Pubkey::new_unique();
        let timestamp = 1640995200; // 2022-01-01 00:00:00 UTC

        let entry = AgentRegistryEntryV1::new(
            255,
            owner,
            "test-agent".to_string(),
            "Test Agent".to_string(),
            "A test agent".to_string(),
            "1.0.0".to_string(),
            Some("Test Provider".to_string()),
            None,
            None,
            vec![],
            0,
            vec![],
            vec![],
            vec![],
            None,
            None,
            None,
            None,
            None,
            vec!["test".to_string()],
            timestamp,
        );

        assert_eq!(entry.bump, 255);
        assert_eq!(entry.registry_version, 1);
        assert_eq!(entry.owner_authority, owner);
        assert_eq!(entry.agent_id, "test-agent");
        assert_eq!(entry.name, "Test Agent");
        assert_eq!(entry.status, AgentStatus::Pending as u8);
        assert_eq!(entry.registration_timestamp, timestamp);
        assert_eq!(entry.last_update_timestamp, timestamp);
        assert!(entry.has_tag("test"));
        assert!(!entry.is_active());
        assert!(!entry.is_deregistered());
    }

    #[test]
    fn test_service_endpoint_validation() {
        let mut entry = AgentRegistryEntryV1::default();

        // Empty endpoints should be valid
        assert!(entry.validate_service_endpoints());

        // Single default endpoint should be valid
        entry.service_endpoints.push(ServiceEndpoint {
            protocol: "http".to_string(),
            url: "https://example.com".to_string(),
            is_default: true,
        });
        assert!(entry.validate_service_endpoints());

        // Multiple endpoints with one default should be valid
        entry.service_endpoints.push(ServiceEndpoint {
            protocol: "ws".to_string(),
            url: "wss://example.com".to_string(),
            is_default: false,
        });
        assert!(entry.validate_service_endpoints());

        // Multiple default endpoints should be invalid
        entry.service_endpoints[1].is_default = true;
        assert!(!entry.validate_service_endpoints());

        // No default endpoints should be invalid when endpoints exist
        entry.service_endpoints[0].is_default = false;
        entry.service_endpoints[1].is_default = false;
        assert!(!entry.validate_service_endpoints());
    }

    #[test]
    fn test_status_updates() {
        let mut entry = AgentRegistryEntryV1::default();
        let timestamp = 1640995200;

        // Test with version checking
        let result = entry.update_status(AgentStatus::Active as u8, timestamp, 0);
        assert!(result.is_ok());
        assert!(entry.is_active());
        assert_eq!(entry.last_update_timestamp, timestamp);
        assert_eq!(entry.state_version, 1);

        // Test another update with correct version
        let result = entry.update_status(AgentStatus::Deregistered as u8, timestamp + 100, 1);
        assert!(result.is_ok());
        assert!(entry.is_deregistered());
        assert_eq!(entry.last_update_timestamp, timestamp + 100);
        assert_eq!(entry.state_version, 2);
        
        // Test update with wrong version
        let result = entry.update_status(AgentStatus::Active as u8, timestamp + 200, 0);
        assert!(result.is_err());
    }

    #[test]
    fn test_serialization() {
        let entry = AgentRegistryEntryV1::default();
        let serialized = entry.try_to_vec().unwrap();
        let deserialized = AgentRegistryEntryV1::try_from_slice(&serialized).unwrap();
        assert_eq!(entry, deserialized);
    }

    #[test]
    fn test_skills_and_tags() {
        let mut entry = AgentRegistryEntryV1::default();
        
        entry.skills.push(AgentSkill {
            id: "skill1".to_string(),
            name: "Test Skill".to_string(),
            description_hash: None,
            tags: vec!["ai".to_string(), "nlp".to_string()],
        });

        entry.tags.push("agent".to_string());
        entry.tags.push("test".to_string());

        assert!(entry.has_skill("skill1"));
        assert!(!entry.has_skill("skill2"));
        assert!(entry.has_tag("agent"));
        assert!(!entry.has_tag("missing"));

        let ai_skills = entry.get_skills_by_tag("ai");
        assert_eq!(ai_skills.len(), 1);
        assert_eq!(ai_skills[0].id, "skill1");
    }
}