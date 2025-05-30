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
    sysvar::{clock::Clock, Sysvar},
};
use anchor_lang::prelude::*;
use anchor_spl::token::{self, Token, TokenAccount};
use aeamcp_common::{
    constants::*,
    error::RegistryError,
    serialization::{ServiceEndpoint, AgentSkill, ServiceEndpointInput, AgentSkillInput},
    utils::{
        get_agent_pda_secure, verify_account_owner, verify_signer_authority,
        get_current_timestamp,
    },
    token_utils::{
        transfer_tokens_with_pda, transfer_tokens_with_pda_signer, StakingTier,
        calculate_agent_quality_score, validate_fee_config, is_stake_unlocked,
        derive_staking_vault_pda, derive_registration_vault_pda,
        transfer_tokens_with_account_info, transfer_tokens_with_pda_signer_account_info,
    },
    authority::{
        verify_escrow_program_authority, verify_ddr_program_authority, get_authority_registry,
    },
    AgentStatus,
    AGENT_REGISTRATION_FEE, MIN_SERVICE_FEE,
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
            AgentRegistryInstruction::RegisterAgentWithToken {
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
            } => Self::process_register_agent_with_token(
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
            AgentRegistryInstruction::StakeTokens { amount, lock_period } => {
                Self::process_stake_tokens(program_id, accounts, amount, lock_period)
            }
            AgentRegistryInstruction::UnstakeTokens { amount } => {
                Self::process_unstake_tokens(program_id, accounts, amount)
            }
            AgentRegistryInstruction::UpdateServiceFees {
                base_fee,
                priority_multiplier,
                accepts_escrow
            } => {
                Self::process_update_service_fees(
                    program_id,
                    accounts,
                    base_fee,
                    priority_multiplier,
                    accepts_escrow,
                )
            }
            AgentRegistryInstruction::RecordServiceCompletion {
                earnings,
                rating,
                response_time
            } => {
                Self::process_record_service_completion(
                    program_id,
                    accounts,
                    earnings,
                    rating,
                    response_time,
                )
            }
            AgentRegistryInstruction::RecordDisputeOutcome { won } => {
                Self::process_record_dispute_outcome(program_id, accounts, won)
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

        // Verify PDA derivation with enhanced security
        let (expected_pda, bump) = get_agent_pda_secure(&agent_id, owner_authority_info.key, program_id);
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

        // SECURITY FIX: Verify account ownership BEFORE data access
        verify_account_owner(agent_entry_info, program_id)?;
        
        let mut data = agent_entry_info.try_borrow_mut_data()?;
        let mut agent_entry = AgentRegistryEntryV1::try_from_slice(&data)?;

        // Verify owner authority
        verify_signer_authority(owner_authority_info, &agent_entry.owner_authority)?;

        // SECURITY FIX: Begin operation to prevent reentrancy
        agent_entry.begin_operation()?;
        let current_version = agent_entry.state_version;

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
            agent_entry.end_operation();
            return Ok(());
        }

        // SECURITY FIX: Atomic update with timestamp
        let timestamp = get_current_timestamp()?;
        let update_result = agent_entry.update_timestamp(timestamp, current_version);

        if let Err(e) = update_result {
            agent_entry.end_operation();
            return Err(e.into());
        }

        // SECURITY FIX: Serialize safely after atomic update
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

        // SECURITY FIX: Verify account ownership BEFORE data access
        verify_account_owner(agent_entry_info, program_id)?;

        // SECURITY FIX: Verify account ownership BEFORE data access
        verify_account_owner(agent_entry_info, program_id)?;
        
        let mut data = agent_entry_info.try_borrow_mut_data()?;
        let mut agent_entry = AgentRegistryEntryV1::try_from_slice(&data)?;

        // Verify owner authority
        verify_signer_authority(owner_authority_info, &agent_entry.owner_authority)?;

        // Check if status is already the same
        if agent_entry.status == new_status {
            return Ok(());
        }

        let old_status = agent_entry.status;
        let timestamp = get_current_timestamp()?;
        let current_version = agent_entry.state_version;

        // SECURITY FIX: Atomic status update with version checking
        let update_result = agent_entry.update_status(new_status, timestamp, current_version);
        
        if let Err(e) = update_result {
            return Err(e.into());
        }

        // Serialize and store the updated data
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

        // SECURITY FIX: Verify account ownership BEFORE data access
        verify_account_owner(agent_entry_info, program_id)?;

        // SECURITY FIX: Verify account ownership BEFORE data access
        verify_account_owner(agent_entry_info, program_id)?;
        
        let mut data = agent_entry_info.try_borrow_mut_data()?;
        let mut agent_entry = AgentRegistryEntryV1::try_from_slice(&data)?;

        // Verify owner authority
        verify_signer_authority(owner_authority_info, &agent_entry.owner_authority)?;

        // Check if already deregistered
        if agent_entry.status == AgentStatus::Deregistered as u8 {
            return Ok(());
        }

        let timestamp = get_current_timestamp()?;
        let current_version = agent_entry.state_version;

        // SECURITY FIX: Atomic deregistration with version checking
        let update_result = agent_entry.update_status(
            AgentStatus::Deregistered as u8,
            timestamp,
            current_version
        );
        
        if let Err(e) = update_result {
            return Err(e.into());
        }

        // Serialize and store the updated data
        agent_entry.serialize(&mut &mut data[..])?;

        // Emit event
        let event = create_agent_deregistered_event(
            agent_entry.agent_id.clone(),
            agent_entry.last_update_timestamp,
        );
        emit_agent_deregistered(&event);

        Ok(())
    }

    /// Process register agent with token payment
    #[allow(clippy::too_many_arguments)]
    fn process_register_agent_with_token(
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
        let owner_token_account_info = next_account_info(account_info_iter)?;
        let registration_vault_info = next_account_info(account_info_iter)?;
        let token_mint_info = next_account_info(account_info_iter)?;
        let token_program_info = next_account_info(account_info_iter)?;
        let system_program_info = next_account_info(account_info_iter)?;
        let clock_info = next_account_info(account_info_iter)?;

        // First register the agent using existing logic
        Self::process_register_agent(
            program_id,
            &[
                agent_entry_info.clone(),
                owner_authority_info.clone(),
                payer_info.clone(),
                system_program_info.clone(),
            ],
            agent_id.clone(),
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
        )?;

        // Now handle the token payment
        let owner_token_account = TokenAccount::try_deserialize(&mut &owner_token_account_info.data.borrow()[..])?;
        
        // Verify registration vault PDA
        let (expected_vault, _) = derive_registration_vault_pda(program_id);
        if registration_vault_info.key != &expected_vault {
            return Err(RegistryError::InvalidPda.into());
        }

        // Transfer registration fee
        transfer_tokens_with_account_info(
            owner_token_account_info,
            registration_vault_info,
            owner_authority_info,
            token_program_info,
            AGENT_REGISTRATION_FEE,
        )?;

        // Update agent entry with token info
        let mut data = agent_entry_info.try_borrow_mut_data()?;
        let mut agent_entry = AgentRegistryEntryV1::try_from_slice(&data)?;
        
        agent_entry.token_mint = *token_mint_info.key;
        agent_entry.registration_fee_paid = AGENT_REGISTRATION_FEE;
        agent_entry.total_fees_collected += AGENT_REGISTRATION_FEE;
        
        agent_entry.serialize(&mut &mut data[..])?;

        // Emit event
        let event = create_agent_registered_with_token_event(
            agent_id,
            *owner_authority_info.key,
            AGENT_REGISTRATION_FEE,
        );
        emit_agent_registered_with_token(&event);

        Ok(())
    }

    /// Process stake tokens instruction
    fn process_stake_tokens(
        program_id: &Pubkey,
        accounts: &[AccountInfo],
        amount: u64,
        lock_period: i64,
    ) -> ProgramResult {
        let account_info_iter = &mut accounts.iter();
        let owner_info = next_account_info(account_info_iter)?;
        let agent_entry_info = next_account_info(account_info_iter)?;
        let owner_token_account_info = next_account_info(account_info_iter)?;
        let staking_vault_info = next_account_info(account_info_iter)?;
        let token_program_info = next_account_info(account_info_iter)?;
        let clock_info = next_account_info(account_info_iter)?;

        // Verify account ownership
        verify_account_owner(agent_entry_info, program_id)?;
        
        let mut data = agent_entry_info.try_borrow_mut_data()?;
        let mut agent_entry = AgentRegistryEntryV1::try_from_slice(&data)?;

        // Verify owner authority
        verify_signer_authority(owner_info, &agent_entry.owner_authority)?;

        // Verify staking vault PDA
        let (expected_vault, _) = derive_staking_vault_pda(program_id);
        if staking_vault_info.key != &expected_vault {
            return Err(RegistryError::InvalidPda.into());
        }

        // Get clock
        let clock = Clock::from_account_info(clock_info)?;

        // Calculate new staking tier
        let new_total_stake = agent_entry.staked_amount + amount;
        let new_tier = StakingTier::from_amount(new_total_stake);

        // Transfer tokens to staking vault
        transfer_tokens_with_account_info(
            owner_token_account_info,
            staking_vault_info,
            owner_info,
            token_program_info,
            amount,
        )?;

        // Update agent staking info
        agent_entry.update_staking(
            new_total_stake,
            new_tier.value(),
            clock.unix_timestamp + lock_period,
            clock.unix_timestamp,
        );

        agent_entry.serialize(&mut &mut data[..])?;

        // Emit event
        let event = create_tokens_staked_event(
            agent_entry.agent_id.clone(),
            *owner_info.key,
            amount,
            new_tier.value(),
            agent_entry.stake_locked_until,
        );
        emit_tokens_staked(&event);

        Ok(())
    }

    /// Process unstake tokens instruction
    fn process_unstake_tokens(
        program_id: &Pubkey,
        accounts: &[AccountInfo],
        amount: u64,
    ) -> ProgramResult {
        let account_info_iter = &mut accounts.iter();
        let owner_info = next_account_info(account_info_iter)?;
        let agent_entry_info = next_account_info(account_info_iter)?;
        let staking_vault_info = next_account_info(account_info_iter)?;
        let owner_token_account_info = next_account_info(account_info_iter)?;
        let token_program_info = next_account_info(account_info_iter)?;
        let clock_info = next_account_info(account_info_iter)?;

        // Verify account ownership
        verify_account_owner(agent_entry_info, program_id)?;
        
        let mut data = agent_entry_info.try_borrow_mut_data()?;
        let mut agent_entry = AgentRegistryEntryV1::try_from_slice(&data)?;

        // Verify owner authority
        verify_signer_authority(owner_info, &agent_entry.owner_authority)?;

        // Get clock
        let clock = Clock::from_account_info(clock_info)?;

        // Check if stake can be unlocked using the is_stake_unlocked utility
        if !is_stake_unlocked(agent_entry.stake_locked_until, clock.unix_timestamp) {
            return Err(RegistryError::StakeLocked.into());
        }

        // Check if sufficient stake available
        if amount > agent_entry.staked_amount {
            return Err(RegistryError::InsufficientStake.into());
        }

        // Verify staking vault PDA
        let (expected_vault, vault_bump) = derive_staking_vault_pda(program_id);
        if staking_vault_info.key != &expected_vault {
            return Err(RegistryError::InvalidPda.into());
        }

        // Transfer tokens from staking vault
        let vault_seeds = &[b"staking_vault".as_ref(), &[vault_bump]];
        
        transfer_tokens_with_pda_signer_account_info(
            staking_vault_info,
            owner_token_account_info,
            staking_vault_info,
            token_program_info,
            amount,
            &[vault_seeds],
        )?;

        // Update agent staking info
        let new_staked_amount = agent_entry.staked_amount - amount;
        let new_tier = StakingTier::from_amount(new_staked_amount);
        
        agent_entry.update_staking(
            new_staked_amount,
            new_tier.value(),
            if new_staked_amount > 0 { agent_entry.stake_locked_until } else { 0 },
            clock.unix_timestamp,
        );

        // Update quality score after tier change
        let quality_score = calculate_agent_quality_score(
            agent_entry.completed_services,
            &agent_entry.quality_ratings,
            agent_entry.dispute_wins,
            agent_entry.dispute_count,
            agent_entry.response_time_avg,
        );
        agent_entry.reputation_score = quality_score;

        agent_entry.serialize(&mut &mut data[..])?;

        // Emit event
        let event = create_tokens_unstaked_event(
            agent_entry.agent_id.clone(),
            *owner_info.key,
            amount,
            new_tier.value(),
        );
        emit_tokens_unstaked(&event);

        Ok(())
    }

    /// Process update service fees instruction
    fn process_update_service_fees(
        program_id: &Pubkey,
        accounts: &[AccountInfo],
        base_fee: u64,
        priority_multiplier: u8,
        accepts_escrow: bool,
    ) -> ProgramResult {
        let account_info_iter = &mut accounts.iter();
        let owner_info = next_account_info(account_info_iter)?;
        let agent_entry_info = next_account_info(account_info_iter)?;
        let clock_info = next_account_info(account_info_iter)?;

        // Validate fee configuration
        validate_fee_config(base_fee, MIN_SERVICE_FEE, priority_multiplier as u16)?;

        // Verify account ownership
        verify_account_owner(agent_entry_info, program_id)?;
        
        let mut data = agent_entry_info.try_borrow_mut_data()?;
        let mut agent_entry = AgentRegistryEntryV1::try_from_slice(&data)?;

        // Verify owner authority
        verify_signer_authority(owner_info, &agent_entry.owner_authority)?;

        // Get clock
        let clock = Clock::from_account_info(clock_info)?;

        // Update service fees
        agent_entry.update_service_fees(
            base_fee,
            priority_multiplier,
            accepts_escrow,
            clock.unix_timestamp,
        );

        agent_entry.serialize(&mut &mut data[..])?;

        // Emit event
        let event = create_service_fees_updated_event(
            agent_entry.agent_id.clone(),
            base_fee,
            priority_multiplier,
            accepts_escrow,
        );
        emit_service_fees_updated(&event);

        Ok(())
    }

    /// Process record service completion (called by escrow)
    fn process_record_service_completion(
        program_id: &Pubkey,
        accounts: &[AccountInfo],
        earnings: u64,
        rating: u8,
        response_time: u32,
    ) -> ProgramResult {
        let account_info_iter = &mut accounts.iter();
        let escrow_program_info = next_account_info(account_info_iter)?;
        let agent_entry_info = next_account_info(account_info_iter)?;
        let _clock_info = next_account_info(account_info_iter)?;

        // SECURITY FIX: Implement proper escrow program authority verification
        let authority_registry = get_authority_registry();
        verify_escrow_program_authority(escrow_program_info, &authority_registry)?;

        // Verify account ownership
        verify_account_owner(agent_entry_info, program_id)?;
        
        let mut data = agent_entry_info.try_borrow_mut_data()?;
        let mut agent_entry = AgentRegistryEntryV1::try_from_slice(&data)?;

        // Record service completion
        agent_entry.record_service_completion(earnings, rating, response_time);

        // Update reputation score
        agent_entry.reputation_score = calculate_agent_quality_score(
            agent_entry.completed_services,
            &agent_entry.quality_ratings,
            agent_entry.dispute_wins,
            agent_entry.dispute_count,
            agent_entry.response_time_avg,
        );

        agent_entry.serialize(&mut &mut data[..])?;

        // Emit event
        let event = create_service_completed_event(
            agent_entry.agent_id.clone(),
            earnings,
            rating,
            agent_entry.reputation_score,
        );
        emit_service_completed(&event);

        Ok(())
    }

    /// Process record dispute outcome (called by DDR)
    fn process_record_dispute_outcome(
        program_id: &Pubkey,
        accounts: &[AccountInfo],
        won: bool,
    ) -> ProgramResult {
        let account_info_iter = &mut accounts.iter();
        let ddr_program_info = next_account_info(account_info_iter)?;
        let agent_entry_info = next_account_info(account_info_iter)?;

        // SECURITY FIX: Implement proper DDR program authority verification
        let authority_registry = get_authority_registry();
        verify_ddr_program_authority(ddr_program_info, &authority_registry)?;

        // Verify account ownership
        verify_account_owner(agent_entry_info, program_id)?;
        
        let mut data = agent_entry_info.try_borrow_mut_data()?;
        let mut agent_entry = AgentRegistryEntryV1::try_from_slice(&data)?;

        // Record dispute outcome
        agent_entry.record_dispute_outcome(won);

        // Update reputation score
        agent_entry.reputation_score = calculate_agent_quality_score(
            agent_entry.completed_services,
            &agent_entry.quality_ratings,
            agent_entry.dispute_wins,
            agent_entry.dispute_count,
            agent_entry.response_time_avg,
        );

        agent_entry.serialize(&mut &mut data[..])?;

        // Emit event
        let event = create_dispute_recorded_event(
            agent_entry.agent_id.clone(),
            won,
            agent_entry.reputation_score,
        );
        emit_dispute_recorded(&event);

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