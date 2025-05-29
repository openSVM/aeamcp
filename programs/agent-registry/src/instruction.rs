//! Instruction types for the Agent Registry program

use borsh::{BorshDeserialize, BorshSerialize};
use solana_program::program_error::ProgramError;
use shank::ShankInstruction;
use aeamcp_common::{
    constants::HASH_SIZE,
    serialization::{ServiceEndpointInput, AgentSkillInput},
};

/// Instructions supported by the Agent Registry program
#[derive(BorshSerialize, BorshDeserialize, Debug, Clone, PartialEq, ShankInstruction)]
pub enum AgentRegistryInstruction {
    /// Register a new agent in the Agent Registry
    /// 
    /// Accounts expected:
    /// 0. `[writable, signer]` Agent entry PDA (to be created)
    /// 1. `[signer]` Owner authority
    /// 2. `[signer]` Payer
    /// 3. `[]` System program
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

    /// Update the details of an existing agent
    /// 
    /// Accounts expected:
    /// 0. `[writable]` Agent entry PDA
    /// 1. `[signer]` Owner authority
    UpdateAgentDetails {
        details: AgentUpdateDetailsInput,
    },

    /// Update the status of an existing agent
    /// 
    /// Accounts expected:
    /// 0. `[writable]` Agent entry PDA
    /// 1. `[signer]` Owner authority
    UpdateAgentStatus {
        new_status: u8,
    },

    /// Deregister an agent from the Agent Registry
    /// 
    /// Accounts expected:
    /// 0. `[writable]` Agent entry PDA
    /// 1. `[signer]` Owner authority
    DeregisterAgent,
    
    /// Register a new agent with SVMAI token payment
    ///
    /// Accounts expected:
    /// 0. `[writable, signer]` Agent entry PDA (to be created)
    /// 1. `[signer]` Owner authority
    /// 2. `[signer]` Payer
    /// 3. `[writable]` Owner's token account
    /// 4. `[writable]` Registration vault token account
    /// 5. `[]` Token mint (SVMAI)
    /// 6. `[]` Token program
    /// 7. `[]` System program
    /// 8. `[]` Clock sysvar
    RegisterAgentWithToken {
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
    
    /// Stake SVMAI tokens for tier benefits
    ///
    /// Accounts expected:
    /// 0. `[signer]` Agent owner
    /// 1. `[writable]` Agent registry PDA
    /// 2. `[writable]` Agent's token account
    /// 3. `[writable]` Staking vault token account
    /// 4. `[]` Token program
    /// 5. `[]` Clock sysvar
    StakeTokens {
        amount: u64,
        lock_period: i64, // in seconds
    },
    
    /// Unstake tokens after lock period
    ///
    /// Accounts expected:
    /// 0. `[signer]` Agent owner
    /// 1. `[writable]` Agent registry PDA
    /// 2. `[writable]` Staking vault token account
    /// 3. `[writable]` Agent's token account
    /// 4. `[]` Token program
    /// 5. `[]` Clock sysvar
    UnstakeTokens {
        amount: u64,
    },
    
    /// Update service fee configuration
    ///
    /// Accounts expected:
    /// 0. `[signer]` Agent owner
    /// 1. `[writable]` Agent registry PDA
    /// 2. `[]` Clock sysvar
    UpdateServiceFees {
        base_fee: u64,
        priority_multiplier: u8,
        accepts_escrow: bool,
    },
    
    /// Record service completion (called by escrow)
    ///
    /// Accounts expected:
    /// 0. `[signer]` Escrow program
    /// 1. `[writable]` Agent registry PDA
    /// 2. `[]` Clock sysvar
    RecordServiceCompletion {
        earnings: u64,
        rating: u8,
        response_time: u32,
    },
    
    /// Record dispute outcome (called by DDR)
    ///
    /// Accounts expected:
    /// 0. `[signer]` DDR program
    /// 1. `[writable]` Agent registry PDA
    RecordDisputeOutcome {
        won: bool,
    },
}

/// Input struct for updating agent details
#[derive(BorshSerialize, BorshDeserialize, Clone, Debug, Default, PartialEq)]
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

impl AgentRegistryInstruction {
    /// Unpacks a byte buffer into an AgentRegistryInstruction
    pub fn unpack(input: &[u8]) -> Result<Self, ProgramError> {
        let (&variant, rest) = input.split_first().ok_or(ProgramError::InvalidInstructionData)?;
        
        Ok(match variant {
            0 => {
                let data = RegisterAgentData::try_from_slice(rest)
                    .map_err(|_| ProgramError::InvalidInstructionData)?;
                Self::RegisterAgent {
                    agent_id: data.agent_id,
                    name: data.name,
                    description: data.description,
                    agent_version: data.agent_version,
                    provider_name: data.provider_name,
                    provider_url: data.provider_url,
                    documentation_url: data.documentation_url,
                    service_endpoints: data.service_endpoints,
                    capabilities_flags: data.capabilities_flags,
                    supported_input_modes: data.supported_input_modes,
                    supported_output_modes: data.supported_output_modes,
                    skills: data.skills,
                    security_info_uri: data.security_info_uri,
                    aea_address: data.aea_address,
                    economic_intent_summary: data.economic_intent_summary,
                    supported_aea_protocols_hash: data.supported_aea_protocols_hash,
                    extended_metadata_uri: data.extended_metadata_uri,
                    tags: data.tags,
                }
            }
            1 => {
                let details = AgentUpdateDetailsInput::try_from_slice(rest)
                    .map_err(|_| ProgramError::InvalidInstructionData)?;
                Self::UpdateAgentDetails { details }
            }
            2 => {
                let new_status = u8::try_from_slice(rest)
                    .map_err(|_| ProgramError::InvalidInstructionData)?;
                Self::UpdateAgentStatus { new_status }
            }
            3 => Self::DeregisterAgent,
            4 => {
                let data = RegisterAgentData::try_from_slice(rest)
                    .map_err(|_| ProgramError::InvalidInstructionData)?;
                Self::RegisterAgentWithToken {
                    agent_id: data.agent_id,
                    name: data.name,
                    description: data.description,
                    agent_version: data.agent_version,
                    provider_name: data.provider_name,
                    provider_url: data.provider_url,
                    documentation_url: data.documentation_url,
                    service_endpoints: data.service_endpoints,
                    capabilities_flags: data.capabilities_flags,
                    supported_input_modes: data.supported_input_modes,
                    supported_output_modes: data.supported_output_modes,
                    skills: data.skills,
                    security_info_uri: data.security_info_uri,
                    aea_address: data.aea_address,
                    economic_intent_summary: data.economic_intent_summary,
                    supported_aea_protocols_hash: data.supported_aea_protocols_hash,
                    extended_metadata_uri: data.extended_metadata_uri,
                    tags: data.tags,
                }
            }
            5 => {
                let data = StakeTokensData::try_from_slice(rest)
                    .map_err(|_| ProgramError::InvalidInstructionData)?;
                Self::StakeTokens {
                    amount: data.amount,
                    lock_period: data.lock_period,
                }
            }
            6 => {
                let amount = u64::try_from_slice(rest)
                    .map_err(|_| ProgramError::InvalidInstructionData)?;
                Self::UnstakeTokens { amount }
            }
            7 => {
                let data = UpdateServiceFeesData::try_from_slice(rest)
                    .map_err(|_| ProgramError::InvalidInstructionData)?;
                Self::UpdateServiceFees {
                    base_fee: data.base_fee,
                    priority_multiplier: data.priority_multiplier,
                    accepts_escrow: data.accepts_escrow,
                }
            }
            8 => {
                let data = RecordServiceCompletionData::try_from_slice(rest)
                    .map_err(|_| ProgramError::InvalidInstructionData)?;
                Self::RecordServiceCompletion {
                    earnings: data.earnings,
                    rating: data.rating,
                    response_time: data.response_time,
                }
            }
            9 => {
                let won = bool::try_from_slice(rest)
                    .map_err(|_| ProgramError::InvalidInstructionData)?;
                Self::RecordDisputeOutcome { won }
            }
            _ => return Err(ProgramError::InvalidInstructionData),
        })
    }

    /// Packs an AgentRegistryInstruction into a byte buffer
    pub fn pack(&self) -> Vec<u8> {
        let mut buf = Vec::new();
        match self {
            Self::RegisterAgent {
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
                extended_metadata_uri,
                tags,
            } => {
                buf.push(0);
                let data = RegisterAgentData {
                    agent_id: agent_id.clone(),
                    name: name.clone(),
                    description: description.clone(),
                    agent_version: agent_version.clone(),
                    provider_name: provider_name.clone(),
                    provider_url: provider_url.clone(),
                    documentation_url: documentation_url.clone(),
                    service_endpoints: service_endpoints.clone(),
                    capabilities_flags: *capabilities_flags,
                    supported_input_modes: supported_input_modes.clone(),
                    supported_output_modes: supported_output_modes.clone(),
                    skills: skills.clone(),
                    security_info_uri: security_info_uri.clone(),
                    aea_address: aea_address.clone(),
                    economic_intent_summary: economic_intent_summary.clone(),
                    supported_aea_protocols_hash: *supported_aea_protocols_hash,
                    extended_metadata_uri: extended_metadata_uri.clone(),
                    tags: tags.clone(),
                };
                buf.extend_from_slice(&data.try_to_vec().unwrap());
            }
            Self::UpdateAgentDetails { details } => {
                buf.push(1);
                buf.extend_from_slice(&details.try_to_vec().unwrap());
            }
            Self::UpdateAgentStatus { new_status } => {
                buf.push(2);
                buf.extend_from_slice(&new_status.try_to_vec().unwrap());
            }
            Self::DeregisterAgent => {
                buf.push(3);
            }
            Self::RegisterAgentWithToken {
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
                extended_metadata_uri,
                tags,
            } => {
                buf.push(4);
                let data = RegisterAgentData {
                    agent_id: agent_id.clone(),
                    name: name.clone(),
                    description: description.clone(),
                    agent_version: agent_version.clone(),
                    provider_name: provider_name.clone(),
                    provider_url: provider_url.clone(),
                    documentation_url: documentation_url.clone(),
                    service_endpoints: service_endpoints.clone(),
                    capabilities_flags: *capabilities_flags,
                    supported_input_modes: supported_input_modes.clone(),
                    supported_output_modes: supported_output_modes.clone(),
                    skills: skills.clone(),
                    security_info_uri: security_info_uri.clone(),
                    aea_address: aea_address.clone(),
                    economic_intent_summary: economic_intent_summary.clone(),
                    supported_aea_protocols_hash: *supported_aea_protocols_hash,
                    extended_metadata_uri: extended_metadata_uri.clone(),
                    tags: tags.clone(),
                };
                buf.extend_from_slice(&data.try_to_vec().unwrap());
            }
            Self::StakeTokens { amount, lock_period } => {
                buf.push(5);
                let data = StakeTokensData {
                    amount: *amount,
                    lock_period: *lock_period,
                };
                buf.extend_from_slice(&data.try_to_vec().unwrap());
            }
            Self::UnstakeTokens { amount } => {
                buf.push(6);
                buf.extend_from_slice(&amount.try_to_vec().unwrap());
            }
            Self::UpdateServiceFees { base_fee, priority_multiplier, accepts_escrow } => {
                buf.push(7);
                let data = UpdateServiceFeesData {
                    base_fee: *base_fee,
                    priority_multiplier: *priority_multiplier,
                    accepts_escrow: *accepts_escrow,
                };
                buf.extend_from_slice(&data.try_to_vec().unwrap());
            }
            Self::RecordServiceCompletion { earnings, rating, response_time } => {
                buf.push(8);
                let data = RecordServiceCompletionData {
                    earnings: *earnings,
                    rating: *rating,
                    response_time: *response_time,
                };
                buf.extend_from_slice(&data.try_to_vec().unwrap());
            }
            Self::RecordDisputeOutcome { won } => {
                buf.push(9);
                buf.extend_from_slice(&won.try_to_vec().unwrap());
            }
        }
        buf
    }
}

/// Helper struct for RegisterAgent instruction data
#[derive(BorshSerialize, BorshDeserialize, Debug, Clone)]
struct RegisterAgentData {
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
}

/// Helper struct for StakeTokens instruction data
#[derive(BorshSerialize, BorshDeserialize, Debug, Clone)]
struct StakeTokensData {
    amount: u64,
    lock_period: i64,
}

/// Helper struct for UpdateServiceFees instruction data
#[derive(BorshSerialize, BorshDeserialize, Debug, Clone)]
struct UpdateServiceFeesData {
    base_fee: u64,
    priority_multiplier: u8,
    accepts_escrow: bool,
}

/// Helper struct for RecordServiceCompletion instruction data
#[derive(BorshSerialize, BorshDeserialize, Debug, Clone)]
struct RecordServiceCompletionData {
    earnings: u64,
    rating: u8,
    response_time: u32,
}

#[cfg(test)]
mod tests {
    use super::*;

    #[test]
    fn test_instruction_packing_unpacking() {
        let instruction = AgentRegistryInstruction::RegisterAgent {
            agent_id: "test-agent".to_string(),
            name: "Test Agent".to_string(),
            description: "A test agent".to_string(),
            agent_version: "1.0.0".to_string(),
            provider_name: Some("Test Provider".to_string()),
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
        };

        let packed = instruction.pack();
        let unpacked = AgentRegistryInstruction::unpack(&packed).unwrap();

        assert_eq!(instruction, unpacked);
    }

    #[test]
    fn test_update_status_instruction() {
        let instruction = AgentRegistryInstruction::UpdateAgentStatus { new_status: 1 };
        let packed = instruction.pack();
        let unpacked = AgentRegistryInstruction::unpack(&packed).unwrap();

        assert_eq!(instruction, unpacked);
    }

    #[test]
    fn test_deregister_instruction() {
        let instruction = AgentRegistryInstruction::DeregisterAgent;
        let packed = instruction.pack();
        let unpacked = AgentRegistryInstruction::unpack(&packed).unwrap();

        assert_eq!(instruction, unpacked);
    }
}