//! Instruction processing for the Agent Registry program

use borsh::{BorshDeserialize, BorshSerialize};
use solana_program::{
    account_info::{next_account_info, AccountInfo},
    entrypoint::ProgramResult,
    program::invoke,
    program_error::ProgramError,
    pubkey::Pubkey,
    rent::Rent,
    system_instruction,
    sysvar::Sysvar,
};
use aeamcp_common::{
    constants::*,
    error::RegistryError,
    serialization::{ServiceEndpoint, AgentSkill, ServiceEndpointInput, AgentSkillInput},
    utils::{
        get_agent_pda, verify_account_owner, verify_signer_authority,
        get_current_timestamp,
    },
    AgentStatus,
};

use crate::{
    instruction::{AgentRegistryInstruction, AgentUpdateDetailsInput},
    state::AgentRegistryEntryV1,
    validation::*,
    events::*,
};

/// Instruction processor
pub struct Processor;

impl Processor {
    /// Process an instruction
    pub fn process(
        program_id: &Pubkey,
        accounts: &[AccountInfo],
        instruction_data: &[u8],
    ) -> ProgramResult {
        let instruction = AgentRegistryInstruction::unpack(instruction_data)?;
        match instruction {
            AgentRegistryInstruction::RegisterAgent {
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
            } => Self::process_register_agent(
                program_id,
                accounts,
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
            ),
            AgentRegistryInstruction::UpdateAgentDetails { details } => {
                Self::process_update_agent_details(program_id, accounts, details)
            }
            AgentRegistryInstruction::UpdateAgentStatus { new_status } => {
                Self::process_update_agent_status(program_id, accounts, new_status)
            }
            AgentRegistryInstruction::DeregisterAgent => {
                Self::process_deregister_agent(program_id, accounts)
            }
        }
    }

    /// Process register agent instruction
    #[allow(clippy::too_many_arguments)]
    fn process_register_agent(
        program_id: &Pubkey,
        accounts: &[AccountInfo],
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
    ) -> ProgramResult {
        let account_info_iter = &mut accounts.iter();
        let agent_entry_info = next_account_info(account_info_iter)?;
        let owner_authority_info = next_account_info(account_info_iter)?;
        let payer_info = next_account_info(account_info_iter)?;
        let system_program_info = next_account_info(account_info_iter)?;

        // Validate input data
        validate_register_agent(
            &agent_id,
            &name,
            &description,
            &agent_version,
            &provider_name,
            &provider_url,
            &documentation_url,
            &service_endpoints,
            &supported_input_modes,
            &supported_output_modes,
            &skills,
            &security_info_uri,
            &aea_address,
            &economic_intent_summary,
            &extended_metadata_uri,
            &tags,
        )?;

        // Verify PDA derivation
        let (expected_pda, bump) = get_agent_pda(&agent_id, program_id);
        if agent_entry_info.key != &expected_pda {
            return Err(RegistryError::InvalidPda.into());
        }

        // Verify signers
        verify_signer_authority(owner_authority_info, owner_authority_info.key)?;
        verify_signer_authority(payer_info, payer_info.key)?;

        // Verify system program
        if system_program_info.key != &solana_program::system_program::id() {
            return Err(ProgramError::IncorrectProgramId);
        }

        // Check if account already exists
        if !agent_entry_info.data_is_empty() {
            return Err(RegistryError::AccountAlreadyExists.into());
        }

        // Calculate rent exemption
        let rent = Rent::get()?;
        let required_lamports = rent.minimum_balance(AgentRegistryEntryV1::SPACE);

        // Create the account
        invoke(
            &system_instruction::create_account(
                payer_info.key,
                agent_entry_info.key,
                required_lamports,
                AgentRegistryEntryV1::SPACE as u64,
                program_id,
            ),
            &[
                payer_info.clone(),
                agent_entry_info.clone(),
                system_program_info.clone(),
            ],
        )?;

        // Convert input types to storage types
        let converted_endpoints: Vec<ServiceEndpoint> = service_endpoints
            .into_iter()
            .map(|ep| ServiceEndpoint {
                protocol: ep.protocol,
                url: ep.url,
                is_default: ep.is_default,
            })
            .collect();

        let converted_skills: Vec<AgentSkill> = skills
            .into_iter()
            .map(|skill| AgentSkill {
                id: skill.id,
                name: skill.name,
                description_hash: skill.description_hash,
                tags: skill.tags,
            })
            .collect();

        // Get current timestamp
        let timestamp = get_current_timestamp()?;

        // Create and serialize the agent entry
        let agent_entry = AgentRegistryEntryV1::new(
            bump,
            *owner_authority_info.key,
            agent_id.clone(),
            name.clone(),
            description.clone(),
            agent_version.clone(),
            provider_name.clone(),
            provider_url.clone(),
            documentation_url.clone(),
            converted_endpoints.clone(),
            capabilities_flags,
            supported_input_modes.clone(),
            supported_output_modes.clone(),
            converted_skills.clone(),
            security_info_uri.clone(),
            aea_address.clone(),
            economic_intent_summary.clone(),
            supported_aea_protocols_hash,
            extended_metadata_uri.clone(),
            tags.clone(),
            timestamp,
        );

        // Serialize and store the data
        let mut data = agent_entry_info.try_borrow_mut_data()?;
        agent_entry.serialize(&mut &mut data[..])?;

        // Emit event
        let event = create_agent_registered_event(
            agent_entry.registry_version,
            agent_entry.owner_authority,
            agent_id,
            name,
            description,
            agent_version,
            provider_name,
            provider_url,
            documentation_url,
            converted_endpoints,
            capabilities_flags,
            supported_input_modes,
            supported_output_modes,
            converted_skills,
            security_info_uri,
            aea_address,
            economic_intent_summary,
            supported_aea_protocols_hash,
            agent_entry.status,
            agent_entry.registration_timestamp,
            agent_entry.last_update_timestamp,
            extended_metadata_uri,
            tags,
        );
        emit_agent_registered(&event);

        Ok(())
    }

    /// Process update agent details instruction
    fn process_update_agent_details(
        program_id: &Pubkey,
        accounts: &[AccountInfo],
        details: AgentUpdateDetailsInput,
    ) -> ProgramResult {
        let account_info_iter = &mut accounts.iter();
        let agent_entry_info = next_account_info(account_info_iter)?;
        let owner_authority_info = next_account_info(account_info_iter)?;

        // Verify account ownership
        verify_account_owner(agent_entry_info, program_id)?;

        // Deserialize existing agent entry
        let mut agent_entry = AgentRegistryEntryV1::try_from_slice(&agent_entry_info.data.borrow())?;

        // Verify owner authority
        verify_signer_authority(owner_authority_info, &agent_entry.owner_authority)?;

        // Validate update details
        validate_update_details(
            &details.name,
            &details.description,
            &details.agent_version,
            &details.provider_name,
            &details.provider_url,
            &details.documentation_url,
            &details.service_endpoints,
            &details.supported_input_modes,
            &details.supported_output_modes,
            &details.skills,
            &details.security_info_uri,
            &details.aea_address,
            &details.economic_intent_summary,
            &details.extended_metadata_uri,
            &details.tags,
        )?;

        // Track changed fields
        let mut changed_fields = Vec::new();

        // Update fields if provided
        if let Some(val) = details.name {
            agent_entry.name = val;
            changed_fields.push("name".to_string());
        }
        if let Some(val) = details.description {
            agent_entry.description = val;
            changed_fields.push("description".to_string());
        }
        if let Some(val) = details.agent_version {
            agent_entry.agent_version = val;
            changed_fields.push("agent_version".to_string());
        }

        // Handle optional fields with clear flags
        Self::update_optional_field(
            &mut agent_entry.provider_name,
            details.provider_name,
            details.clear_provider_name.unwrap_or(false),
            &mut changed_fields,
            "provider_name",
        );
        Self::update_optional_field(
            &mut agent_entry.provider_url,
            details.provider_url,
            details.clear_provider_url.unwrap_or(false),
            &mut changed_fields,
            "provider_url",
        );
        Self::update_optional_field(
            &mut agent_entry.documentation_url,
            details.documentation_url,
            details.clear_documentation_url.unwrap_or(false),
            &mut changed_fields,
            "documentation_url",
        );
        Self::update_optional_field(
            &mut agent_entry.security_info_uri,
            details.security_info_uri,
            details.clear_security_info_uri.unwrap_or(false),
            &mut changed_fields,
            "security_info_uri",
        );
        Self::update_optional_field(
            &mut agent_entry.aea_address,
            details.aea_address,
            details.clear_aea_address.unwrap_or(false),
            &mut changed_fields,
            "aea_address",
        );
        Self::update_optional_field(
            &mut agent_entry.economic_intent_summary,
            details.economic_intent_summary,
            details.clear_economic_intent_summary.unwrap_or(false),
            &mut changed_fields,
            "economic_intent_summary",
        );
        Self::update_optional_field(
            &mut agent_entry.extended_metadata_uri,
            details.extended_metadata_uri,
            details.clear_extended_metadata_uri.unwrap_or(false),
            &mut changed_fields,
            "extended_metadata_uri",
        );

        // Update service endpoints
        if let Some(endpoints) = details.service_endpoints {
            agent_entry.service_endpoints = endpoints
                .into_iter()
                .map(|ep| ServiceEndpoint {
                    protocol: ep.protocol,
                    url: ep.url,
                    is_default: ep.is_default,
                })
                .collect();
            changed_fields.push("service_endpoints".to_string());
        }

        // Update other fields
        if let Some(val) = details.capabilities_flags {
            agent_entry.capabilities_flags = val;
            changed_fields.push("capabilities_flags".to_string());
        }
        if let Some(val) = details.supported_input_modes {
            agent_entry.supported_input_modes = val;
            changed_fields.push("supported_input_modes".to_string());
        }
        if let Some(val) = details.supported_output_modes {
            agent_entry.supported_output_modes = val;
            changed_fields.push("supported_output_modes".to_string());
        }
        if let Some(skills) = details.skills {
            agent_entry.skills = skills
                .into_iter()
                .map(|skill| AgentSkill {
                    id: skill.id,
                    name: skill.name,
                    description_hash: skill.description_hash,
                    tags: skill.tags,
                })
                .collect();
            changed_fields.push("skills".to_string());
        }
        if let Some(val) = details.tags {
            agent_entry.tags = val;
            changed_fields.push("tags".to_string());
        }

        // Handle supported_aea_protocols_hash
        if let Some(val) = details.supported_aea_protocols_hash {
            agent_entry.supported_aea_protocols_hash = Some(val);
            changed_fields.push("supported_aea_protocols_hash".to_string());
        } else if details.clear_supported_aea_protocols_hash.unwrap_or(false) {
            agent_entry.supported_aea_protocols_hash = None;
            changed_fields.push("supported_aea_protocols_hash".to_string());
        }

        // Return early if no changes
        if changed_fields.is_empty() {
            return Ok(());
        }

        // Update timestamp
        let timestamp = get_current_timestamp()?;
        agent_entry.update_timestamp(timestamp);

        // Serialize and store the updated data
        let mut data = agent_entry_info.try_borrow_mut_data()?;
        agent_entry.serialize(&mut &mut data[..])?;

        // Emit event
        let event = create_agent_updated_event(
            agent_entry.agent_id.clone(),
            changed_fields,
            agent_entry.last_update_timestamp,
        );
        emit_agent_updated(&event);

        Ok(())
    }

    /// Process update agent status instruction
    fn process_update_agent_status(
        program_id: &Pubkey,
        accounts: &[AccountInfo],
        new_status: u8,
    ) -> ProgramResult {
        let account_info_iter = &mut accounts.iter();
        let agent_entry_info = next_account_info(account_info_iter)?;
        let owner_authority_info = next_account_info(account_info_iter)?;

        // Validate status
        validate_agent_status(new_status)?;

        // Verify account ownership
        verify_account_owner(agent_entry_info, program_id)?;

        // Deserialize existing agent entry
        let mut agent_entry = AgentRegistryEntryV1::try_from_slice(&agent_entry_info.data.borrow())?;

        // Verify owner authority
        verify_signer_authority(owner_authority_info, &agent_entry.owner_authority)?;

        // Check if status is already the same
        if agent_entry.status == new_status {
            return Ok(());
        }

        let old_status = agent_entry.status;
        let timestamp = get_current_timestamp()?;

        // Update status
        agent_entry.update_status(new_status, timestamp);

        // Serialize and store the updated data
        let mut data = agent_entry_info.try_borrow_mut_data()?;
        agent_entry.serialize(&mut &mut data[..])?;

        // Emit event
        let event = create_agent_status_changed_event(
            agent_entry.agent_id.clone(),
            old_status,
            new_status,
            agent_entry.last_update_timestamp,
        );
        emit_agent_status_changed(&event);

        Ok(())
    }

    /// Process deregister agent instruction
    fn process_deregister_agent(program_id: &Pubkey, accounts: &[AccountInfo]) -> ProgramResult {
        let account_info_iter = &mut accounts.iter();
        let agent_entry_info = next_account_info(account_info_iter)?;
        let owner_authority_info = next_account_info(account_info_iter)?;

        // Verify account ownership
        verify_account_owner(agent_entry_info, program_id)?;

        // Deserialize existing agent entry
        let mut agent_entry = AgentRegistryEntryV1::try_from_slice(&agent_entry_info.data.borrow())?;

        // Verify owner authority
        verify_signer_authority(owner_authority_info, &agent_entry.owner_authority)?;

        // Check if already deregistered
        if agent_entry.status == AgentStatus::Deregistered as u8 {
            return Ok(());
        }

        let timestamp = get_current_timestamp()?;

        // Update status to deregistered
        agent_entry.update_status(AgentStatus::Deregistered as u8, timestamp);

        // Serialize and store the updated data
        let mut data = agent_entry_info.try_borrow_mut_data()?;
        agent_entry.serialize(&mut &mut data[..])?;

        // Emit event
        let event = create_agent_deregistered_event(
            agent_entry.agent_id.clone(),
            agent_entry.last_update_timestamp,
        );
        emit_agent_deregistered(&event);

        Ok(())
    }

    /// Helper function to update optional fields
    fn update_optional_field(
        field: &mut Option<String>,
        new_value: Option<String>,
        clear_flag: bool,
        changed_fields: &mut Vec<String>,
        field_name: &str,
    ) {
        if let Some(val) = new_value {
            *field = Some(val);
            changed_fields.push(field_name.to_string());
        } else if clear_flag {
            *field = None;
            changed_fields.push(field_name.to_string());
        }
    }
}

#[cfg(test)]
mod tests {
    use super::*;
    use solana_program::pubkey::Pubkey;
    use solana_program_test::*;
    use solana_sdk::{
        account::Account,
        signature::{Keypair, Signer},
        transaction::Transaction,
    };

    #[test]
    fn test_update_optional_field() {
        let mut field = Some("original".to_string());
        let mut changed_fields = Vec::new();

        // Test updating with new value
        Processor::update_optional_field(
            &mut field,
            Some("new".to_string()),
            false,
            &mut changed_fields,
            "test_field",
        );
        assert_eq!(field, Some("new".to_string()));
        assert_eq!(changed_fields, vec!["test_field"]);

        // Test clearing field
        changed_fields.clear();
        Processor::update_optional_field(
            &mut field,
            None,
            true,
            &mut changed_fields,
            "test_field",
        );
        assert_eq!(field, None);
        assert_eq!(changed_fields, vec!["test_field"]);

        // Test no change
        changed_fields.clear();
        Processor::update_optional_field(
            &mut field,
            None,
            false,
            &mut changed_fields,
            "test_field",
        );
        assert_eq!(field, None);
        assert!(changed_fields.is_empty());
    }
}