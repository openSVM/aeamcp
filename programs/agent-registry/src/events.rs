//! Event definitions and emission for the Agent Registry program

use serde::{Deserialize, Serialize};
use solana_program::pubkey::Pubkey;
use aeamcp_common::{
    constants::HASH_SIZE,
    serialization::{ServiceEndpoint, AgentSkill},
    utils::emit_event,
};

/// Event emitted when an agent is registered
#[derive(Serialize, Deserialize, Debug, Clone, PartialEq)]
pub struct AgentRegisteredEvent {
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

/// Event emitted when agent details are updated
#[derive(Serialize, Deserialize, Debug, Clone, PartialEq)]
pub struct AgentUpdatedEvent {
    pub agent_id: String,
    pub changed_fields: Vec<String>,
    pub last_update_timestamp: i64,
}

/// Event emitted when agent status changes
#[derive(Serialize, Deserialize, Debug, Clone, PartialEq)]
pub struct AgentStatusChangedEvent {
    pub agent_id: String,
    pub old_status: u8,
    pub new_status: u8,
    pub last_update_timestamp: i64,
}

/// Event emitted when an agent is deregistered
#[derive(Serialize, Deserialize, Debug, Clone, PartialEq)]
pub struct AgentDeregisteredEvent {
    pub agent_id: String,
    pub deregistration_timestamp: i64,
}

/// Event emitted when an agent is registered with token payment
#[derive(Serialize, Deserialize, Debug, Clone, PartialEq)]
pub struct AgentRegisteredWithTokenEvent {
    pub agent_id: String,
    pub owner_authority: Pubkey,
    pub registration_fee: u64,
}

/// Event emitted when tokens are staked
#[derive(Serialize, Deserialize, Debug, Clone, PartialEq)]
pub struct TokensStakedEvent {
    pub agent_id: String,
    pub owner: Pubkey,
    pub amount: u64,
    pub new_tier: u8,
    pub locked_until: i64,
}

/// Event emitted when tokens are unstaked
#[derive(Serialize, Deserialize, Debug, Clone, PartialEq)]
pub struct TokensUnstakedEvent {
    pub agent_id: String,
    pub owner: Pubkey,
    pub amount: u64,
    pub new_tier: u8,
}

/// Event emitted when service fees are updated
#[derive(Serialize, Deserialize, Debug, Clone, PartialEq)]
pub struct ServiceFeesUpdatedEvent {
    pub agent_id: String,
    pub base_fee: u64,
    pub priority_multiplier: u8,
    pub accepts_escrow: bool,
}

/// Event emitted when a service is completed
#[derive(Serialize, Deserialize, Debug, Clone, PartialEq)]
pub struct ServiceCompletedEvent {
    pub agent_id: String,
    pub earnings: u64,
    pub rating: u8,
    pub reputation_score: u64,
}

/// Event emitted when a dispute is recorded
#[derive(Serialize, Deserialize, Debug, Clone, PartialEq)]
pub struct DisputeRecordedEvent {
    pub agent_id: String,
    pub won: bool,
    pub reputation_score: u64,
}

/// Emit an agent registered event
pub fn emit_agent_registered(event: &AgentRegisteredEvent) {
    let data = serde_json::to_value(event).unwrap();
    emit_event("AgentRegistered", &data);
}

/// Emit an agent updated event
pub fn emit_agent_updated(event: &AgentUpdatedEvent) {
    let data = serde_json::to_value(event).unwrap();
    emit_event("AgentUpdated", &data);
}

/// Emit an agent status changed event
pub fn emit_agent_status_changed(event: &AgentStatusChangedEvent) {
    let data = serde_json::to_value(event).unwrap();
    emit_event("AgentStatusChanged", &data);
}

/// Emit an agent deregistered event
pub fn emit_agent_deregistered(event: &AgentDeregisteredEvent) {
    let data = serde_json::to_value(event).unwrap();
    emit_event("AgentDeregistered", &data);
}

/// Emit an agent registered with token event
pub fn emit_agent_registered_with_token(event: &AgentRegisteredWithTokenEvent) {
    let data = serde_json::to_value(event).unwrap();
    emit_event("AgentRegisteredWithToken", &data);
}

/// Emit a tokens staked event
pub fn emit_tokens_staked(event: &TokensStakedEvent) {
    let data = serde_json::to_value(event).unwrap();
    emit_event("TokensStaked", &data);
}

/// Emit a tokens unstaked event
pub fn emit_tokens_unstaked(event: &TokensUnstakedEvent) {
    let data = serde_json::to_value(event).unwrap();
    emit_event("TokensUnstaked", &data);
}

/// Emit a service fees updated event
pub fn emit_service_fees_updated(event: &ServiceFeesUpdatedEvent) {
    let data = serde_json::to_value(event).unwrap();
    emit_event("ServiceFeesUpdated", &data);
}

/// Emit a service completed event
pub fn emit_service_completed(event: &ServiceCompletedEvent) {
    let data = serde_json::to_value(event).unwrap();
    emit_event("ServiceCompleted", &data);
}

/// Emit a dispute recorded event
pub fn emit_dispute_recorded(event: &DisputeRecordedEvent) {
    let data = serde_json::to_value(event).unwrap();
    emit_event("DisputeRecorded", &data);
}

/// Helper function to create an AgentRegisteredEvent from state
pub fn create_agent_registered_event(
    registry_version: u8,
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
    status: u8,
    registration_timestamp: i64,
    last_update_timestamp: i64,
    extended_metadata_uri: Option<String>,
    tags: Vec<String>,
) -> AgentRegisteredEvent {
    AgentRegisteredEvent {
        registry_version,
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
        status,
        registration_timestamp,
        last_update_timestamp,
        extended_metadata_uri,
        tags,
    }
}

/// Helper function to create an AgentUpdatedEvent
pub fn create_agent_updated_event(
    agent_id: String,
    changed_fields: Vec<String>,
    last_update_timestamp: i64,
) -> AgentUpdatedEvent {
    AgentUpdatedEvent {
        agent_id,
        changed_fields,
        last_update_timestamp,
    }
}

/// Helper function to create an AgentStatusChangedEvent
pub fn create_agent_status_changed_event(
    agent_id: String,
    old_status: u8,
    new_status: u8,
    last_update_timestamp: i64,
) -> AgentStatusChangedEvent {
    AgentStatusChangedEvent {
        agent_id,
        old_status,
        new_status,
        last_update_timestamp,
    }
}

/// Helper function to create an AgentDeregisteredEvent
pub fn create_agent_deregistered_event(
    agent_id: String,
    deregistration_timestamp: i64,
) -> AgentDeregisteredEvent {
    AgentDeregisteredEvent {
        agent_id,
        deregistration_timestamp,
    }
}

/// Helper function to create an AgentRegisteredWithTokenEvent
pub fn create_agent_registered_with_token_event(
    agent_id: String,
    owner_authority: Pubkey,
    registration_fee: u64,
) -> AgentRegisteredWithTokenEvent {
    AgentRegisteredWithTokenEvent {
        agent_id,
        owner_authority,
        registration_fee,
    }
}

/// Helper function to create a TokensStakedEvent
pub fn create_tokens_staked_event(
    agent_id: String,
    owner: Pubkey,
    amount: u64,
    new_tier: u8,
    locked_until: i64,
) -> TokensStakedEvent {
    TokensStakedEvent {
        agent_id,
        owner,
        amount,
        new_tier,
        locked_until,
    }
}

/// Helper function to create a TokensUnstakedEvent
pub fn create_tokens_unstaked_event(
    agent_id: String,
    owner: Pubkey,
    amount: u64,
    new_tier: u8,
) -> TokensUnstakedEvent {
    TokensUnstakedEvent {
        agent_id,
        owner,
        amount,
        new_tier,
    }
}

/// Helper function to create a ServiceFeesUpdatedEvent
pub fn create_service_fees_updated_event(
    agent_id: String,
    base_fee: u64,
    priority_multiplier: u8,
    accepts_escrow: bool,
) -> ServiceFeesUpdatedEvent {
    ServiceFeesUpdatedEvent {
        agent_id,
        base_fee,
        priority_multiplier,
        accepts_escrow,
    }
}

/// Helper function to create a ServiceCompletedEvent
pub fn create_service_completed_event(
    agent_id: String,
    earnings: u64,
    rating: u8,
    reputation_score: u64,
) -> ServiceCompletedEvent {
    ServiceCompletedEvent {
        agent_id,
        earnings,
        rating,
        reputation_score,
    }
}

/// Helper function to create a DisputeRecordedEvent
pub fn create_dispute_recorded_event(
    agent_id: String,
    won: bool,
    reputation_score: u64,
) -> DisputeRecordedEvent {
    DisputeRecordedEvent {
        agent_id,
        won,
        reputation_score,
    }
}

#[cfg(test)]
mod tests {
    use super::*;
    use solana_program::pubkey::Pubkey;

    #[test]
    fn test_agent_registered_event_creation() {
        let owner = Pubkey::new_unique();
        let timestamp = 1640995200;

        let event = create_agent_registered_event(
            1,
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
            0,
            timestamp,
            timestamp,
            None,
            vec!["test".to_string()],
        );

        assert_eq!(event.agent_id, "test-agent");
        assert_eq!(event.name, "Test Agent");
        assert_eq!(event.owner_authority, owner);
        assert_eq!(event.registration_timestamp, timestamp);
    }

    #[test]
    fn test_agent_updated_event_creation() {
        let event = create_agent_updated_event(
            "test-agent".to_string(),
            vec!["name".to_string(), "description".to_string()],
            1640995300,
        );

        assert_eq!(event.agent_id, "test-agent");
        assert_eq!(event.changed_fields.len(), 2);
        assert!(event.changed_fields.contains(&"name".to_string()));
        assert!(event.changed_fields.contains(&"description".to_string()));
    }

    #[test]
    fn test_agent_status_changed_event_creation() {
        let event = create_agent_status_changed_event(
            "test-agent".to_string(),
            0, // Pending
            1, // Active
            1640995400,
        );

        assert_eq!(event.agent_id, "test-agent");
        assert_eq!(event.old_status, 0);
        assert_eq!(event.new_status, 1);
    }

    #[test]
    fn test_agent_deregistered_event_creation() {
        let event = create_agent_deregistered_event(
            "test-agent".to_string(),
            1640995500,
        );

        assert_eq!(event.agent_id, "test-agent");
        assert_eq!(event.deregistration_timestamp, 1640995500);
    }

    #[test]
    fn test_event_serialization() {
        let event = AgentUpdatedEvent {
            agent_id: "test-agent".to_string(),
            changed_fields: vec!["name".to_string()],
            last_update_timestamp: 1640995200,
        };

        let json = serde_json::to_string(&event).unwrap();
        let deserialized: AgentUpdatedEvent = serde_json::from_str(&json).unwrap();

        assert_eq!(event, deserialized);
    }
}