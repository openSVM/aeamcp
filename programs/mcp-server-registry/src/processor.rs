//! Instruction processor for the MCP Server Registry program

use solana_program::{
    account_info::{next_account_info, AccountInfo},
    entrypoint::ProgramResult,
    program_error::ProgramError,
    pubkey::Pubkey,
    rent::Rent,
    system_instruction,
    sysvar::Sysvar,
    program::invoke,
    msg,
};
use borsh::{BorshDeserialize, BorshSerialize};
use aeamcp_common::{
    constants::*,
    error::RegistryError,
    utils::{get_current_timestamp, get_mcp_server_pda_secure, verify_account_owner},
    McpServerStatus,
    serialization::{
        McpToolDefinitionOnChainInput,
        McpResourceDefinitionOnChainInput, McpPromptDefinitionOnChainInput
    },
    token_utils::{
        transfer_tokens_with_pda_signer_account_info, StakingTier,
        is_stake_unlocked,
    },
    constants::{
        MIN_STAKE_AMOUNT, MIN_LOCK_PERIOD, MAX_LOCK_PERIOD, STAKING_VAULT_SEED,
        MCP_SERVER_REGISTRY_PDA_SEED,
    },
};

use crate::{
    instruction::{McpServerRegistryInstruction, McpServerUpdateDetailsInput, UsageType},
    state::McpServerRegistryEntryV1,
    validation::*,
};

/// Process MCP Server Registry instructions
pub fn process_instruction(
    program_id: &Pubkey,
    accounts: &[AccountInfo],
    instruction_data: &[u8],
) -> ProgramResult {
    let instruction = McpServerRegistryInstruction::try_from_slice(instruction_data)
        .map_err(|_| ProgramError::InvalidInstructionData)?;

    match instruction {
        McpServerRegistryInstruction::RegisterMcpServer {
            server_id,
            name,
            server_version,
            service_endpoint,
            documentation_url,
            server_capabilities_summary,
            supports_resources,
            supports_tools,
            supports_prompts,
            onchain_tool_definitions,
            onchain_resource_definitions,
            onchain_prompt_definitions,
            full_capabilities_uri,
            tags,
        } => {
            process_register_mcp_server(
                program_id,
                accounts,
                server_id,
                name,
                server_version,
                service_endpoint,
                documentation_url,
                server_capabilities_summary,
                supports_resources,
                supports_tools,
                supports_prompts,
                onchain_tool_definitions,
                onchain_resource_definitions,
                onchain_prompt_definitions,
                full_capabilities_uri,
                tags,
            )
        }
        McpServerRegistryInstruction::UpdateMcpServerDetails { details } => {
            process_update_mcp_server_details(program_id, accounts, details)
        }
        McpServerRegistryInstruction::UpdateMcpServerStatus { new_status } => {
            process_update_mcp_server_status(program_id, accounts, new_status)
        }
        McpServerRegistryInstruction::DeregisterMcpServer => {
            process_deregister_mcp_server(program_id, accounts)
        }
        McpServerRegistryInstruction::RegisterMcpServerWithToken {
            server_id,
            name,
            server_version,
            service_endpoint,
            documentation_url,
            server_capabilities_summary,
            supports_resources,
            supports_tools,
            supports_prompts,
            onchain_tool_definitions,
            onchain_resource_definitions,
            onchain_prompt_definitions,
            full_capabilities_uri,
            tags,
        } => {
            process_register_mcp_server_with_token(
                program_id,
                accounts,
                server_id,
                name,
                server_version,
                service_endpoint,
                documentation_url,
                server_capabilities_summary,
                supports_resources,
                supports_tools,
                supports_prompts,
                onchain_tool_definitions,
                onchain_resource_definitions,
                onchain_prompt_definitions,
                full_capabilities_uri,
                tags,
            )
        }
        McpServerRegistryInstruction::StakeForVerification { amount, lock_period } => {
            process_stake_for_verification(program_id, accounts, amount, lock_period)
        }
        McpServerRegistryInstruction::ConfigureUsageFees {
            tool_base_fee,
            resource_base_fee,
            prompt_base_fee,
            bulk_discount_threshold,
            bulk_discount_percentage
        } => {
            process_configure_usage_fees(program_id, accounts, tool_base_fee, resource_base_fee, prompt_base_fee, bulk_discount_threshold, bulk_discount_percentage)
        }
        McpServerRegistryInstruction::RecordUsageAndCollectFee {
            usage_type,
            count
        } => {
            process_record_usage_and_collect_fee(program_id, accounts, usage_type, count)
        }
        McpServerRegistryInstruction::UpdateQualityMetrics {
            uptime_percentage,
            avg_response_time,
            error_rate
        } => {
            process_update_quality_metrics(program_id, accounts, uptime_percentage, avg_response_time, error_rate)
        }
        McpServerRegistryInstruction::WithdrawPendingFees => {
            process_withdraw_pending_fees(program_id, accounts)
        }
    }
}

/// Process register MCP server instruction
fn process_register_mcp_server(
    program_id: &Pubkey,
    accounts: &[AccountInfo],
    server_id: String,
    name: String,
    server_version: String,
    service_endpoint: String,
    documentation_url: Option<String>,
    server_capabilities_summary: Option<String>,
    supports_resources: bool,
    supports_tools: bool,
    supports_prompts: bool,
    onchain_tool_definitions: Vec<McpToolDefinitionOnChainInput>,
    onchain_resource_definitions: Vec<McpResourceDefinitionOnChainInput>,
    onchain_prompt_definitions: Vec<McpPromptDefinitionOnChainInput>,
    full_capabilities_uri: Option<String>,
    tags: Vec<String>,
) -> ProgramResult {
    let accounts_iter = &mut accounts.iter();
    let mcp_server_entry_info = next_account_info(accounts_iter)?;
    let owner_authority_info = next_account_info(accounts_iter)?;
    let payer_info = next_account_info(accounts_iter)?;
    let system_program_info = next_account_info(accounts_iter)?;

    // Validate input
    validate_register_mcp_server(
        &server_id,
        &name,
        &server_version,
        &service_endpoint,
        &documentation_url,
        &server_capabilities_summary,
        &onchain_tool_definitions,
        &onchain_resource_definitions,
        &onchain_prompt_definitions,
        &full_capabilities_uri,
        &tags,
    ).map_err(|e| ProgramError::from(e))?;

    // Verify owner authority is signer
    if !owner_authority_info.is_signer {
        return Err(RegistryError::Unauthorized.into());
    }

    // Verify payer is signer
    if !payer_info.is_signer {
        return Err(ProgramError::MissingRequiredSignature);
    }

    // SECURITY FIX: Derive PDA with enhanced security
    let (expected_pda, bump) = get_mcp_server_pda_secure(&server_id, owner_authority_info.key, program_id);

    if *mcp_server_entry_info.key != expected_pda {
        return Err(ProgramError::InvalidSeeds);
    }

    // Create account
    let space = McpServerRegistryEntryV1::SPACE;
    let rent = Rent::get()?;
    let lamports = rent.minimum_balance(space);

    invoke(
        &system_instruction::create_account(
            payer_info.key,
            mcp_server_entry_info.key,
            lamports,
            space as u64,
            program_id,
        ),
        &[
            payer_info.clone(),
            mcp_server_entry_info.clone(),
            system_program_info.clone(),
        ],
    )?;

    // Initialize account data
    let timestamp = get_current_timestamp()?;
    let mcp_server_entry = McpServerRegistryEntryV1::new(
        bump,
        *owner_authority_info.key,
        server_id.clone(),
        name.clone(),
        server_version.clone(),
        service_endpoint.clone(),
        documentation_url.clone(),
        server_capabilities_summary.clone(),
        supports_resources,
        supports_tools,
        supports_prompts,
        onchain_tool_definitions.iter().map(|t| t.clone().into()).collect(),
        onchain_resource_definitions.iter().map(|r| r.clone().into()).collect(),
        onchain_prompt_definitions.iter().map(|p| p.clone().into()).collect(),
        full_capabilities_uri.clone(),
        tags.clone(),
        timestamp,
    );

    // Serialize and store
    let mut data = mcp_server_entry_info.try_borrow_mut_data()?;
    mcp_server_entry.serialize(&mut &mut data[..])?;

    // Log event
    msg!("EVENT: McpServerRegistered server_id={} name={}", server_id, name);

    Ok(())
}

/// Process update MCP server details instruction
fn process_update_mcp_server_details(
    program_id: &Pubkey,
    accounts: &[AccountInfo],
    details: McpServerUpdateDetailsInput,
) -> ProgramResult {
    let accounts_iter = &mut accounts.iter();
    let mcp_server_entry_info = next_account_info(accounts_iter)?;
    let owner_authority_info = next_account_info(accounts_iter)?;

    // Verify owner authority is signer
    if !owner_authority_info.is_signer {
        return Err(RegistryError::Unauthorized.into());
    }

    // SECURITY FIX: Verify account ownership BEFORE data access
    verify_account_owner(mcp_server_entry_info, program_id)?;

    // SECURITY FIX: Verify account ownership BEFORE data access
    verify_account_owner(mcp_server_entry_info, program_id)?;
    
    let mut data = mcp_server_entry_info.try_borrow_mut_data()?;
    let mut mcp_server_entry = McpServerRegistryEntryV1::try_from_slice(&data)?;

    // Verify ownership
    if mcp_server_entry.owner_authority != *owner_authority_info.key {
        return Err(RegistryError::Unauthorized.into());
    }

    // SECURITY FIX: Begin operation to prevent reentrancy
    mcp_server_entry.begin_operation()?;
    let current_version = mcp_server_entry.state_version;

    let mut changed_fields = Vec::new();

    // Update fields if provided
    if let Some(name) = details.name {
        validate_server_name(&name).map_err(|e| ProgramError::from(e))?;
        mcp_server_entry.name = name;
        changed_fields.push("name".to_string());
    }

    if let Some(server_version) = details.server_version {
        validate_server_version(&server_version).map_err(|e| ProgramError::from(e))?;
        mcp_server_entry.server_version = server_version;
        changed_fields.push("server_version".to_string());
    }

    if let Some(service_endpoint) = details.service_endpoint {
        validate_service_endpoint(&service_endpoint).map_err(|e| ProgramError::from(e))?;
        mcp_server_entry.service_endpoint = service_endpoint;
        changed_fields.push("service_endpoint".to_string());
    }

    // Handle optional fields with clear flags
    if let Some(documentation_url) = details.documentation_url {
        validate_documentation_url(&documentation_url).map_err(|e| ProgramError::from(e))?;
        mcp_server_entry.documentation_url = Some(documentation_url);
        changed_fields.push("documentation_url".to_string());
    } else if details.clear_documentation_url.unwrap_or(false) {
        mcp_server_entry.documentation_url = None;
        changed_fields.push("documentation_url".to_string());
    }

    if let Some(server_capabilities_summary) = details.server_capabilities_summary {
        validate_server_capabilities_summary(&server_capabilities_summary).map_err(|e| ProgramError::from(e))?;
        mcp_server_entry.server_capabilities_summary = Some(server_capabilities_summary);
        changed_fields.push("server_capabilities_summary".to_string());
    } else if details.clear_server_capabilities_summary.unwrap_or(false) {
        mcp_server_entry.server_capabilities_summary = None;
        changed_fields.push("server_capabilities_summary".to_string());
    }

    if let Some(full_capabilities_uri) = details.full_capabilities_uri {
        validate_full_capabilities_uri(&full_capabilities_uri).map_err(|e| ProgramError::from(e))?;
        mcp_server_entry.full_capabilities_uri = Some(full_capabilities_uri);
        changed_fields.push("full_capabilities_uri".to_string());
    } else if details.clear_full_capabilities_uri.unwrap_or(false) {
        mcp_server_entry.full_capabilities_uri = None;
        changed_fields.push("full_capabilities_uri".to_string());
    }

    // Update capability flags
    if let Some(supports_resources) = details.supports_resources {
        mcp_server_entry.supports_resources = supports_resources;
        changed_fields.push("supports_resources".to_string());
    }

    if let Some(supports_tools) = details.supports_tools {
        mcp_server_entry.supports_tools = supports_tools;
        changed_fields.push("supports_tools".to_string());
    }

    if let Some(supports_prompts) = details.supports_prompts {
        mcp_server_entry.supports_prompts = supports_prompts;
        changed_fields.push("supports_prompts".to_string());
    }

    // Update definitions
    if let Some(onchain_tool_definitions) = details.onchain_tool_definitions {
        validate_tool_definitions(&onchain_tool_definitions).map_err(|e| ProgramError::from(e))?;
        mcp_server_entry.onchain_tool_definitions = onchain_tool_definitions.iter().map(|t| t.clone().into()).collect();
        changed_fields.push("onchain_tool_definitions".to_string());
    }

    if let Some(onchain_resource_definitions) = details.onchain_resource_definitions {
        validate_resource_definitions(&onchain_resource_definitions).map_err(|e| ProgramError::from(e))?;
        mcp_server_entry.onchain_resource_definitions = onchain_resource_definitions.iter().map(|r| r.clone().into()).collect();
        changed_fields.push("onchain_resource_definitions".to_string());
    }

    if let Some(onchain_prompt_definitions) = details.onchain_prompt_definitions {
        validate_prompt_definitions(&onchain_prompt_definitions).map_err(|e| ProgramError::from(e))?;
        mcp_server_entry.onchain_prompt_definitions = onchain_prompt_definitions.iter().map(|p| p.clone().into()).collect();
        changed_fields.push("onchain_prompt_definitions".to_string());
    }

    if let Some(tags) = details.tags {
        validate_server_tags(&tags).map_err(|e| ProgramError::from(e))?;
        mcp_server_entry.tags = tags;
        changed_fields.push("tags".to_string());
    }

    // Return early if no changes
    if changed_fields.is_empty() {
        mcp_server_entry.end_operation();
        return Ok(());
    }

    // SECURITY FIX: Atomic update with timestamp
    let timestamp = get_current_timestamp()?;
    let update_result = mcp_server_entry.touch(timestamp, current_version);

    if let Err(e) = update_result {
        mcp_server_entry.end_operation();
        return Err(e.into());
    }

    // SECURITY FIX: Serialize safely after atomic update
    mcp_server_entry.serialize(&mut &mut data[..])?;

    // Log event
    msg!("EVENT: McpServerUpdated server_id={} fields={:?}", mcp_server_entry.server_id, changed_fields);

    Ok(())
}

/// Process update MCP server status instruction
fn process_update_mcp_server_status(
    program_id: &Pubkey,
    accounts: &[AccountInfo],
    new_status: u8,
) -> ProgramResult {
    let accounts_iter = &mut accounts.iter();
    let mcp_server_entry_info = next_account_info(accounts_iter)?;
    let owner_authority_info = next_account_info(accounts_iter)?;

    // Verify owner authority is signer
    if !owner_authority_info.is_signer {
        return Err(RegistryError::Unauthorized.into());
    }

    // Validate status
    validate_mcp_server_status(new_status).map_err(|e| ProgramError::from(e))?;

    // SECURITY FIX: Verify account ownership BEFORE data access
    verify_account_owner(mcp_server_entry_info, program_id)?;

    // SECURITY FIX: Verify account ownership BEFORE data access
    verify_account_owner(mcp_server_entry_info, program_id)?;
    
    let mut data = mcp_server_entry_info.try_borrow_mut_data()?;
    let mut mcp_server_entry = McpServerRegistryEntryV1::try_from_slice(&data)?;

    // Verify ownership
    if mcp_server_entry.owner_authority != *owner_authority_info.key {
        return Err(RegistryError::Unauthorized.into());
    }

    // Return early if status is the same
    if mcp_server_entry.status == new_status {
        return Ok(());
    }

    // SECURITY FIX: Atomic status update with version checking
    let timestamp = get_current_timestamp()?;
    let current_version = mcp_server_entry.state_version;
    
    let update_result = mcp_server_entry.update_status(new_status, timestamp, current_version);
    
    if let Err(e) = update_result {
        return Err(e.into());
    }

    // Serialize and store
    mcp_server_entry.serialize(&mut &mut data[..])?;

    // Log event
    msg!("EVENT: McpServerStatusChanged server_id={} new_status={}", mcp_server_entry.server_id, new_status);

    Ok(())
}

/// Process register MCP server with token instruction (stub)
fn process_register_mcp_server_with_token(
    program_id: &Pubkey,
    accounts: &[AccountInfo],
    server_id: String,
    name: String,
    server_version: String,
    service_endpoint: String,
    documentation_url: Option<String>,
    server_capabilities_summary: Option<String>,
    supports_resources: bool,
    supports_tools: bool,
    supports_prompts: bool,
    onchain_tool_definitions: Vec<McpToolDefinitionOnChainInput>,
    onchain_resource_definitions: Vec<McpResourceDefinitionOnChainInput>,
    onchain_prompt_definitions: Vec<McpPromptDefinitionOnChainInput>,
    full_capabilities_uri: Option<String>,
    tags: Vec<String>,
) -> ProgramResult {
    // TODO: Implement token-based registration logic
    process_register_mcp_server(
        program_id,
        accounts,
        server_id,
        name,
        server_version,
        service_endpoint,
        documentation_url,
        server_capabilities_summary,
        supports_resources,
        supports_tools,
        supports_prompts,
        onchain_tool_definitions,
        onchain_resource_definitions,
        onchain_prompt_definitions,
        full_capabilities_uri,
        tags,
    )
}

/// Process stake for verification instruction
fn process_stake_for_verification(
    program_id: &Pubkey,
    accounts: &[AccountInfo],
    amount: u64,
    lock_period: i64,
) -> ProgramResult {
    let accounts_iter = &mut accounts.iter();
    let mcp_server_entry_info = next_account_info(accounts_iter)?;
    let owner_authority_info = next_account_info(accounts_iter)?;
    let user_token_account_info = next_account_info(accounts_iter)?;
    let staking_vault_info = next_account_info(accounts_iter)?;
    let token_program_info = next_account_info(accounts_iter)?;

    // Verify accounts and authority
    verify_account_owner(mcp_server_entry_info, program_id)?;
    if !owner_authority_info.is_signer {
        return Err(RegistryError::Unauthorized.into());
    }

    // Load and verify server entry
    let mut data = mcp_server_entry_info.try_borrow_mut_data()?;
    let mut server_entry = McpServerRegistryEntryV1::try_from_slice(&data)?;

    if server_entry.owner_authority != *owner_authority_info.key {
        return Err(RegistryError::Unauthorized.into());
    }

    // Validate staking parameters
    if amount < MIN_STAKE_AMOUNT {
        return Err(RegistryError::InsufficientStake.into());
    }

    if lock_period < MIN_LOCK_PERIOD || lock_period > MAX_LOCK_PERIOD {
        return Err(RegistryError::InvalidLockPeriod.into());
    }

    // Calculate staking vault PDA
    let (vault_pda, vault_bump) = derive_mcp_staking_vault_pda(
        &server_entry.server_id,
        owner_authority_info.key,
        program_id,
    );

    if *staking_vault_info.key != vault_pda {
        return Err(RegistryError::InvalidPda.into());
    }

    // Transfer tokens to staking vault
    transfer_tokens_with_pda_signer_account_info(
        user_token_account_info,
        staking_vault_info,
        owner_authority_info,
        token_program_info,
        amount,
        &[&[vault_bump]],
    )?;

    // Update server entry with staking info
    let current_timestamp = get_current_timestamp()?;
    let stake_locked_until = current_timestamp + lock_period;
    
    // Calculate verification tier based on staked amount
    let verification_tier = match amount {
        a if a >= 1_000_000_000 => 2, // Premium: 1000+ SVMAI
        a if a >= 100_000_000 => 1,   // Verified: 100+ SVMAI
        _ => 0,                        // Basic: < 100 SVMAI
    };

    server_entry.update_verification_stake(
        amount,
        verification_tier,
        stake_locked_until,
        current_timestamp,
    );

    // Calculate and update quality score
    let quality_score = calculate_mcp_quality_score(
        server_entry.uptime_percentage,
        server_entry.avg_response_time,
        server_entry.error_rate,
        verification_tier,
    );
    server_entry.quality_score = quality_score;

    server_entry.serialize(&mut &mut data[..])?;

    msg!(
        "EVENT: StakeForVerification server_id={} amount={} lock_period={} tier={}",
        server_entry.server_id, amount, lock_period, verification_tier
    );

    Ok(())
}

/// Process configure usage fees instruction
fn process_configure_usage_fees(
    program_id: &Pubkey,
    accounts: &[AccountInfo],
    tool_base_fee: u64,
    resource_base_fee: u64,
    prompt_base_fee: u64,
    bulk_discount_threshold: u32,
    bulk_discount_percentage: u8,
) -> ProgramResult {
    let accounts_iter = &mut accounts.iter();
    let mcp_server_entry_info = next_account_info(accounts_iter)?;
    let owner_authority_info = next_account_info(accounts_iter)?;

    // Verify authority
    verify_account_owner(mcp_server_entry_info, program_id)?;
    if !owner_authority_info.is_signer {
        return Err(RegistryError::Unauthorized.into());
    }

    // Load server entry
    let mut data = mcp_server_entry_info.try_borrow_mut_data()?;
    let mut server_entry = McpServerRegistryEntryV1::try_from_slice(&data)?;

    if server_entry.owner_authority != *owner_authority_info.key {
        return Err(RegistryError::Unauthorized.into());
    }

    // Validate fee parameters
    validate_fee_configuration(
        tool_base_fee,
        resource_base_fee,
        prompt_base_fee,
        bulk_discount_threshold,
        bulk_discount_percentage,
    )?;

    // Update fee configuration
    let current_timestamp = get_current_timestamp()?;
    server_entry.update_usage_fees(
        tool_base_fee,
        resource_base_fee,
        prompt_base_fee,
        bulk_discount_threshold,
        bulk_discount_percentage,
        current_timestamp,
    );

    server_entry.serialize(&mut &mut data[..])?;

    msg!(
        "EVENT: FeeConfigurationUpdated server_id={} tool_fee={} resource_fee={} prompt_fee={}",
        server_entry.server_id, tool_base_fee, resource_base_fee, prompt_base_fee
    );

    Ok(())
}

/// Process record usage and collect fee instruction
fn process_record_usage_and_collect_fee(
    program_id: &Pubkey,
    accounts: &[AccountInfo],
    usage_type: UsageType,
    count: u32,
) -> ProgramResult {
    let accounts_iter = &mut accounts.iter();
    let mcp_server_entry_info = next_account_info(accounts_iter)?;
    let user_authority_info = next_account_info(accounts_iter)?;
    let user_token_account_info = next_account_info(accounts_iter)?;
    let server_fee_vault_info = next_account_info(accounts_iter)?;
    let token_program_info = next_account_info(accounts_iter)?;

    // Verify accounts
    verify_account_owner(mcp_server_entry_info, program_id)?;
    if !user_authority_info.is_signer {
        return Err(RegistryError::MissingRequiredSignature.into());
    }

    // Load server entry
    let mut data = mcp_server_entry_info.try_borrow_mut_data()?;
    let mut server_entry = McpServerRegistryEntryV1::try_from_slice(&data)?;

    // Ensure server is active
    if !server_entry.is_active() {
        return Err(RegistryError::InvalidMcpServerStatus.into());
    }

    // Calculate fee based on usage type and count
    let base_fee = match usage_type {
        UsageType::Tool => server_entry.tool_base_fee,
        UsageType::Resource => server_entry.resource_base_fee,
        UsageType::Prompt => server_entry.prompt_base_fee,
    };

    if base_fee == 0 {
        return Err(RegistryError::FeeTooLow.into());
    }

    // Calculate total fee with bulk discount
    let mut total_fee = base_fee * count as u64;
    
    // Apply bulk discount if applicable
    if count >= server_entry.bulk_discount_threshold && server_entry.bulk_discount_percentage > 0 {
        let discount = (total_fee * server_entry.bulk_discount_percentage as u64) / 100;
        total_fee = total_fee.saturating_sub(discount);
    }

    // Transfer fee from user to server vault
    transfer_tokens_with_pda_signer_account_info(
        user_token_account_info,
        server_fee_vault_info,
        user_authority_info,
        token_program_info,
        total_fee,
        &[], // No PDA signing needed for user-to-vault transfer
    )?;

    // Record usage and update metrics (convert instruction::UsageType to state::UsageType)
    use crate::instruction::UsageType as InstructionUsageType;
    use crate::state::UsageType as StateUsageType;
    
    let state_usage_type = match usage_type {
        InstructionUsageType::Tool => StateUsageType::Tool,
        InstructionUsageType::Resource => StateUsageType::Resource,
        InstructionUsageType::Prompt => StateUsageType::Prompt,
    };
    server_entry.record_usage(state_usage_type, count, total_fee);

    // Update quality score based on successful usage
    let quality_score = calculate_mcp_quality_score(
        server_entry.uptime_percentage,
        server_entry.avg_response_time,
        server_entry.error_rate,
        server_entry.verification_tier,
    );
    server_entry.quality_score = quality_score;

    server_entry.serialize(&mut &mut data[..])?;

    msg!(
        "EVENT: UsageRecorded server_id={} usage_type={:?} count={} fee_collected={}",
        server_entry.server_id, usage_type, count, total_fee
    );

    Ok(())
}

/// Process update quality metrics instruction
fn process_update_quality_metrics(
    program_id: &Pubkey,
    accounts: &[AccountInfo],
    uptime_percentage: u8,
    avg_response_time: u32,
    error_rate: u8,
) -> ProgramResult {
    let accounts_iter = &mut accounts.iter();
    let mcp_server_entry_info = next_account_info(accounts_iter)?;
    let owner_authority_info = next_account_info(accounts_iter)?;

    // Verify authority
    verify_account_owner(mcp_server_entry_info, program_id)?;
    if !owner_authority_info.is_signer {
        return Err(RegistryError::Unauthorized.into());
    }

    // Load server entry
    let mut data = mcp_server_entry_info.try_borrow_mut_data()?;
    let mut server_entry = McpServerRegistryEntryV1::try_from_slice(&data)?;

    if server_entry.owner_authority != *owner_authority_info.key {
        return Err(RegistryError::Unauthorized.into());
    }

    // Validate metrics parameters
    if uptime_percentage > 100 {
        return Err(RegistryError::InvalidAccountData.into());
    }
    
    if error_rate > 100 {
        return Err(RegistryError::InvalidAccountData.into());
    }

    // Calculate new quality score based on updated metrics
    let quality_score = calculate_mcp_quality_score(
        uptime_percentage,
        avg_response_time,
        error_rate,
        server_entry.verification_tier,
    );

    // Update quality metrics
    server_entry.update_quality_metrics(
        uptime_percentage,
        avg_response_time,
        error_rate,
        quality_score,
    );

    server_entry.serialize(&mut &mut data[..])?;

    msg!(
        "EVENT: QualityMetricsUpdated server_id={} uptime={}% response_time={}ms error_rate={}% quality_score={}",
        server_entry.server_id, uptime_percentage, avg_response_time, error_rate, quality_score
    );

    Ok(())
}

/// Process withdraw pending fees instruction
fn process_withdraw_pending_fees(
    program_id: &Pubkey,
    accounts: &[AccountInfo],
) -> ProgramResult {
    let accounts_iter = &mut accounts.iter();
    let mcp_server_entry_info = next_account_info(accounts_iter)?;
    let owner_authority_info = next_account_info(accounts_iter)?;
    let server_fee_vault_info = next_account_info(accounts_iter)?;
    let owner_token_account_info = next_account_info(accounts_iter)?;
    let token_program_info = next_account_info(accounts_iter)?;

    // Verify authority
    verify_account_owner(mcp_server_entry_info, program_id)?;
    if !owner_authority_info.is_signer {
        return Err(RegistryError::Unauthorized.into());
    }

    // Load server entry
    let mut data = mcp_server_entry_info.try_borrow_mut_data()?;
    let mut server_entry = McpServerRegistryEntryV1::try_from_slice(&data)?;

    if server_entry.owner_authority != *owner_authority_info.key {
        return Err(RegistryError::Unauthorized.into());
    }

    // Check if there are any pending fees to withdraw
    if server_entry.pending_fees == 0 {
        return Err(RegistryError::InsufficientFunds.into());
    }

    let withdrawal_amount = server_entry.withdraw_pending_fees();

    // Transfer fees from server vault to owner account
    // Note: This requires the server vault PDA to be properly derived and authorized
    let (vault_pda, vault_bump) = derive_mcp_staking_vault_pda(
        &server_entry.server_id,
        owner_authority_info.key,
        program_id,
    );

    if *server_fee_vault_info.key != vault_pda {
        return Err(RegistryError::InvalidPda.into());
    }

    transfer_tokens_with_pda_signer_account_info(
        server_fee_vault_info,
        owner_token_account_info,
        owner_authority_info,
        token_program_info,
        withdrawal_amount,
        &[&[vault_bump]],
    )?;

    // Update last fee collection timestamp
    server_entry.last_fee_collection = get_current_timestamp()?;
    server_entry.serialize(&mut &mut data[..])?;

    msg!(
        "EVENT: FeesWithdrawn server_id={} amount={}",
        server_entry.server_id, withdrawal_amount
    );

    Ok(())
}

/// Process deregister MCP server instruction
fn process_deregister_mcp_server(
    program_id: &Pubkey,
    accounts: &[AccountInfo],
) -> ProgramResult {
    let accounts_iter = &mut accounts.iter();
    let mcp_server_entry_info = next_account_info(accounts_iter)?;
    let owner_authority_info = next_account_info(accounts_iter)?;

    // Verify owner authority is signer
    if !owner_authority_info.is_signer {
        return Err(RegistryError::Unauthorized.into());
    }

    // SECURITY FIX: Verify account ownership BEFORE data access
    verify_account_owner(mcp_server_entry_info, program_id)?;

    // SECURITY FIX: Verify account ownership BEFORE data access
    verify_account_owner(mcp_server_entry_info, program_id)?;
    
    let mut data = mcp_server_entry_info.try_borrow_mut_data()?;
    let mut mcp_server_entry = McpServerRegistryEntryV1::try_from_slice(&data)?;

    // Verify ownership
    if mcp_server_entry.owner_authority != *owner_authority_info.key {
        return Err(RegistryError::Unauthorized.into());
    }

    // Return early if already deregistered
    if mcp_server_entry.status == McpServerStatus::Deregistered as u8 {
        return Ok(());
    }

    // SECURITY FIX: Atomic deregistration with version checking
    let timestamp = get_current_timestamp()?;
    let current_version = mcp_server_entry.state_version;
    
    let update_result = mcp_server_entry.update_status(
        McpServerStatus::Deregistered as u8,
        timestamp,
        current_version
    );
    
    if let Err(e) = update_result {
        return Err(e.into());
    }

    // Serialize and store
    mcp_server_entry.serialize(&mut &mut data[..])?;

    // Log event
    msg!("EVENT: McpServerDeregistered server_id={}", mcp_server_entry.server_id);

    Ok(())
}
// Utility functions for MCP Server Registry token integration

/// Derive MCP server staking vault PDA
fn derive_mcp_staking_vault_pda(
    server_id: &str,
    owner: &Pubkey,
    program_id: &Pubkey,
) -> (Pubkey, u8) {
    Pubkey::find_program_address(
        &[
            STAKING_VAULT_SEED,
            server_id.as_bytes(),
            owner.as_ref(),
        ],
        program_id,
    )
}

/// Calculate MCP server quality score based on performance metrics
fn calculate_mcp_quality_score(
    uptime_percentage: u8,
    avg_response_time: u32,
    error_rate: u8,
    verification_tier: u8,
) -> u64 {
    let mut score = 0u64;
    
    // Uptime component (40% of score)
    score += (uptime_percentage as u64 * 40) / 100;
    
    // Response time component (30% of score) - lower is better
    let response_score = if avg_response_time <= 100 {
        30
    } else if avg_response_time <= 250 {
        25
    } else if avg_response_time <= 500 {
        20
    } else if avg_response_time <= 1000 {
        15
    } else {
        10
    };
    score += response_score;
    
    // Error rate component (20% of score) - lower is better
    let error_score = if error_rate == 0 {
        20
    } else if error_rate <= 1 {
        18
    } else if error_rate <= 2 {
        15
    } else if error_rate <= 5 {
        10
    } else {
        5
    };
    score += error_score;
    
    // Verification tier bonus (10% of score)
    let tier_bonus = match verification_tier {
        2 => 10, // Premium
        1 => 7,  // Verified
        _ => 3,  // Basic
    };
    score += tier_bonus;
    
    // Convert to basis points (score * 100 for 2 decimal precision)
    score * 100
}

/// Validate fee configuration parameters
fn validate_fee_configuration(
    tool_base_fee: u64,
    resource_base_fee: u64,
    prompt_base_fee: u64,
    bulk_discount_threshold: u32,
    bulk_discount_percentage: u8,
) -> Result<(), RegistryError> {
    use aeamcp_common::constants::{MIN_TOOL_FEE, MIN_RESOURCE_FEE, MIN_PROMPT_FEE, MAX_BULK_DISCOUNT};
    
    // Validate minimum fees
    if tool_base_fee < MIN_TOOL_FEE {
        return Err(RegistryError::FeeTooLow);
    }
    
    if resource_base_fee < MIN_RESOURCE_FEE {
        return Err(RegistryError::FeeTooLow);
    }
    
    if prompt_base_fee < MIN_PROMPT_FEE {
        return Err(RegistryError::FeeTooLow);
    }
    
    // Validate bulk discount
    if bulk_discount_percentage > MAX_BULK_DISCOUNT {
        return Err(RegistryError::InvalidMultiplier);
    }
    
    // Validate bulk threshold is reasonable
    if bulk_discount_threshold == 0 || bulk_discount_threshold > 10000 {
        return Err(RegistryError::InvalidAccountData);
    }
    
    Ok(())
}

#[cfg(test)]
mod tests {
    use super::*;
    use solana_program::program_error::ProgramError;

    #[test]
    fn test_validate_register_inputs() {
        // Valid inputs
        let result = validate_register_mcp_server(
            "test-server",
            "Test Server",
            "1.0.0",
            "https://example.com/mcp",
            &None,
            &None,
            &vec![],
            &vec![],
            &vec![],
            &None,
            &vec!["test".to_string()],
        );
        assert!(result.is_ok());

        // Invalid server ID
        let result = validate_register_mcp_server(
            "", // Empty server ID
            "Test Server",
            "1.0.0",
            "https://example.com/mcp",
            &None,
            &None,
            &vec![],
            &vec![],
            &vec![],
            &None,
            &vec![],
        );
        assert!(result.is_err());
    }

    #[test]
    fn test_status_validation() {
        assert!(validate_mcp_server_status(0).is_ok()); // Pending
        assert!(validate_mcp_server_status(1).is_ok()); // Active
        assert!(validate_mcp_server_status(2).is_ok()); // Inactive
        assert!(validate_mcp_server_status(3).is_ok()); // Deregistered
        assert!(validate_mcp_server_status(4).is_err()); // Invalid
    }
}