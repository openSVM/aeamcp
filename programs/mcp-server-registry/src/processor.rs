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
};

use crate::{
    instruction::{McpServerRegistryInstruction, McpServerUpdateDetailsInput},
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