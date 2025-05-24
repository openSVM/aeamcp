//! Integration tests for the Agent Registry program

use borsh::BorshDeserialize;
use solana_program::{
    instruction::{AccountMeta, Instruction},
    pubkey::Pubkey,
    system_program,
};
use solana_program_test::*;
use solana_sdk::{
    account::Account,
    signature::{Keypair, Signer},
    transaction::Transaction,
};
use solana_a2a::{
    constants::*,
    serialization::{ServiceEndpointInput, AgentSkillInput},
    utils::get_agent_pda,
    AgentStatus,
};

// Import the agent registry program
use solana_agent_registry::{
    instruction::{AgentRegistryInstruction, AgentUpdateDetailsInput},
    state::AgentRegistryEntryV1,
};

/// Helper function to create a register agent instruction
fn create_register_agent_instruction(
    program_id: &Pubkey,
    agent_entry: &Pubkey,
    owner_authority: &Pubkey,
    payer: &Pubkey,
    agent_id: String,
    name: String,
    description: String,
    agent_version: String,
) -> Instruction {
    let instruction_data = AgentRegistryInstruction::RegisterAgent {
        agent_id,
        name,
        description,
        agent_version,
        provider_name: Some("Test Provider".to_string()),
        provider_url: None,
        documentation_url: None,
        service_endpoints: vec![ServiceEndpointInput {
            protocol: "http".to_string(),
            url: "https://example.com".to_string(),
            is_default: true,
        }],
        capabilities_flags: 0,
        supported_input_modes: vec!["text/plain".to_string()],
        supported_output_modes: vec!["text/plain".to_string()],
        skills: vec![AgentSkillInput {
            id: "skill1".to_string(),
            name: "Test Skill".to_string(),
            description_hash: None,
            tags: vec!["test".to_string()],
        }],
        security_info_uri: None,
        aea_address: None,
        economic_intent_summary: None,
        supported_aea_protocols_hash: None,
        extended_metadata_uri: None,
        tags: vec!["test".to_string(), "agent".to_string()],
    };

    Instruction {
        program_id: *program_id,
        accounts: vec![
            AccountMeta::new(*agent_entry, false),
            AccountMeta::new_readonly(*owner_authority, true),
            AccountMeta::new(*payer, true),
            AccountMeta::new_readonly(system_program::id(), false),
        ],
        data: instruction_data.pack(),
    }
}

/// Helper function to create an update agent status instruction
fn create_update_status_instruction(
    program_id: &Pubkey,
    agent_entry: &Pubkey,
    owner_authority: &Pubkey,
    new_status: u8,
) -> Instruction {
    let instruction_data = AgentRegistryInstruction::UpdateAgentStatus { new_status };

    Instruction {
        program_id: *program_id,
        accounts: vec![
            AccountMeta::new(*agent_entry, false),
            AccountMeta::new_readonly(*owner_authority, true),
        ],
        data: instruction_data.pack(),
    }
}

/// Helper function to create an update agent details instruction
fn create_update_details_instruction(
    program_id: &Pubkey,
    agent_entry: &Pubkey,
    owner_authority: &Pubkey,
    details: AgentUpdateDetailsInput,
) -> Instruction {
    let instruction_data = AgentRegistryInstruction::UpdateAgentDetails { details };

    Instruction {
        program_id: *program_id,
        accounts: vec![
            AccountMeta::new(*agent_entry, false),
            AccountMeta::new_readonly(*owner_authority, true),
        ],
        data: instruction_data.pack(),
    }
}

/// Helper function to create a deregister agent instruction
fn create_deregister_instruction(
    program_id: &Pubkey,
    agent_entry: &Pubkey,
    owner_authority: &Pubkey,
) -> Instruction {
    let instruction_data = AgentRegistryInstruction::DeregisterAgent;

    Instruction {
        program_id: *program_id,
        accounts: vec![
            AccountMeta::new(*agent_entry, false),
            AccountMeta::new_readonly(*owner_authority, true),
        ],
        data: instruction_data.pack(),
    }
}

#[tokio::test]
async fn test_register_agent_success() {
    let program_id = Pubkey::new_unique();
    let mut program_test = ProgramTest::new(
        "solana_agent_registry",
        program_id,
        processor!(solana_agent_registry::process_instruction),
    );

    let (mut banks_client, payer, recent_blockhash) = program_test.start().await;

    let owner_authority = Keypair::new();
    let agent_id = "test-agent-001";
    let (agent_entry_pda, _bump) = get_agent_pda(agent_id, &program_id);

    // Create register agent instruction
    let instruction = create_register_agent_instruction(
        &program_id,
        &agent_entry_pda,
        &owner_authority.pubkey(),
        &payer.pubkey(),
        agent_id.to_string(),
        "Test Agent".to_string(),
        "A test agent for integration testing".to_string(),
        "1.0.0".to_string(),
    );

    // Create and send transaction
    let mut transaction = Transaction::new_with_payer(&[instruction], Some(&payer.pubkey()));
    transaction.sign(&[&payer, &owner_authority], recent_blockhash);

    let result = banks_client.process_transaction(transaction).await;
    assert!(result.is_ok(), "Failed to register agent: {:?}", result.err());

    // Verify the account was created and has correct data
    let account = banks_client
        .get_account(agent_entry_pda)
        .await
        .expect("Failed to get account")
        .expect("Account should exist");

    assert_eq!(account.owner, program_id);
    assert_eq!(account.data.len(), AgentRegistryEntryV1::SPACE);

    // Deserialize and verify the data
    let agent_entry = AgentRegistryEntryV1::try_from_slice(&account.data)
        .expect("Failed to deserialize agent entry");

    assert_eq!(agent_entry.agent_id, agent_id);
    assert_eq!(agent_entry.name, "Test Agent");
    assert_eq!(agent_entry.description, "A test agent for integration testing");
    assert_eq!(agent_entry.agent_version, "1.0.0");
    assert_eq!(agent_entry.owner_authority, owner_authority.pubkey());
    assert_eq!(agent_entry.status, AgentStatus::Pending as u8);
    assert_eq!(agent_entry.registry_version, 1);
    assert!(!agent_entry.service_endpoints.is_empty());
    assert!(agent_entry.service_endpoints[0].is_default);
    assert!(!agent_entry.skills.is_empty());
    assert_eq!(agent_entry.skills[0].id, "skill1");
    assert!(agent_entry.has_tag("test"));
    assert!(agent_entry.has_tag("agent"));
}

#[tokio::test]
async fn test_update_agent_status() {
    let program_id = Pubkey::new_unique();
    let mut program_test = ProgramTest::new(
        "solana_agent_registry",
        program_id,
        processor!(solana_agent_registry::process_instruction),
    );

    let (mut banks_client, payer, recent_blockhash) = program_test.start().await;

    let owner_authority = Keypair::new();
    let agent_id = "test-agent-002";
    let (agent_entry_pda, _bump) = get_agent_pda(agent_id, &program_id);

    // First register the agent
    let register_instruction = create_register_agent_instruction(
        &program_id,
        &agent_entry_pda,
        &owner_authority.pubkey(),
        &payer.pubkey(),
        agent_id.to_string(),
        "Test Agent 2".to_string(),
        "Another test agent".to_string(),
        "1.0.0".to_string(),
    );

    let mut transaction = Transaction::new_with_payer(&[register_instruction], Some(&payer.pubkey()));
    transaction.sign(&[&payer, &owner_authority], recent_blockhash);
    banks_client.process_transaction(transaction).await.unwrap();

    // Now update the status to Active
    let update_instruction = create_update_status_instruction(
        &program_id,
        &agent_entry_pda,
        &owner_authority.pubkey(),
        AgentStatus::Active as u8,
    );

    let mut transaction = Transaction::new_with_payer(&[update_instruction], Some(&payer.pubkey()));
    transaction.sign(&[&payer, &owner_authority], recent_blockhash);

    let result = banks_client.process_transaction(transaction).await;
    assert!(result.is_ok(), "Failed to update agent status: {:?}", result.err());

    // Verify the status was updated
    let account = banks_client
        .get_account(agent_entry_pda)
        .await
        .unwrap()
        .unwrap();

    let agent_entry = AgentRegistryEntryV1::try_from_slice(&account.data).unwrap();
    assert_eq!(agent_entry.status, AgentStatus::Active as u8);
    assert!(agent_entry.is_active());
}

#[tokio::test]
async fn test_update_agent_details() {
    let program_id = Pubkey::new_unique();
    let mut program_test = ProgramTest::new(
        "solana_agent_registry",
        program_id,
        processor!(solana_agent_registry::process_instruction),
    );

    let (mut banks_client, payer, recent_blockhash) = program_test.start().await;

    let owner_authority = Keypair::new();
    let agent_id = "test-agent-003";
    let (agent_entry_pda, _bump) = get_agent_pda(agent_id, &program_id);

    // First register the agent
    let register_instruction = create_register_agent_instruction(
        &program_id,
        &agent_entry_pda,
        &owner_authority.pubkey(),
        &payer.pubkey(),
        agent_id.to_string(),
        "Test Agent 3".to_string(),
        "Original description".to_string(),
        "1.0.0".to_string(),
    );

    let mut transaction = Transaction::new_with_payer(&[register_instruction], Some(&payer.pubkey()));
    transaction.sign(&[&payer, &owner_authority], recent_blockhash);
    banks_client.process_transaction(transaction).await.unwrap();

    // Now update the details
    let update_details = AgentUpdateDetailsInput {
        name: Some("Updated Test Agent 3".to_string()),
        description: Some("Updated description".to_string()),
        agent_version: Some("2.0.0".to_string()),
        tags: Some(vec!["updated".to_string(), "test".to_string()]),
        ..Default::default()
    };

    let update_instruction = create_update_details_instruction(
        &program_id,
        &agent_entry_pda,
        &owner_authority.pubkey(),
        update_details,
    );

    let mut transaction = Transaction::new_with_payer(&[update_instruction], Some(&payer.pubkey()));
    transaction.sign(&[&payer, &owner_authority], recent_blockhash);

    let result = banks_client.process_transaction(transaction).await;
    assert!(result.is_ok(), "Failed to update agent details: {:?}", result.err());

    // Verify the details were updated
    let account = banks_client
        .get_account(agent_entry_pda)
        .await
        .unwrap()
        .unwrap();

    let agent_entry = AgentRegistryEntryV1::try_from_slice(&account.data).unwrap();
    assert_eq!(agent_entry.name, "Updated Test Agent 3");
    assert_eq!(agent_entry.description, "Updated description");
    assert_eq!(agent_entry.agent_version, "2.0.0");
    assert!(agent_entry.has_tag("updated"));
    assert!(agent_entry.has_tag("test"));
}

#[tokio::test]
async fn test_deregister_agent() {
    let program_id = Pubkey::new_unique();
    let mut program_test = ProgramTest::new(
        "solana_agent_registry",
        program_id,
        processor!(solana_agent_registry::process_instruction),
    );

    let (mut banks_client, payer, recent_blockhash) = program_test.start().await;

    let owner_authority = Keypair::new();
    let agent_id = "test-agent-004";
    let (agent_entry_pda, _bump) = get_agent_pda(agent_id, &program_id);

    // First register the agent
    let register_instruction = create_register_agent_instruction(
        &program_id,
        &agent_entry_pda,
        &owner_authority.pubkey(),
        &payer.pubkey(),
        agent_id.to_string(),
        "Test Agent 4".to_string(),
        "Agent to be deregistered".to_string(),
        "1.0.0".to_string(),
    );

    let mut transaction = Transaction::new_with_payer(&[register_instruction], Some(&payer.pubkey()));
    transaction.sign(&[&payer, &owner_authority], recent_blockhash);
    banks_client.process_transaction(transaction).await.unwrap();

    // Now deregister the agent
    let deregister_instruction = create_deregister_instruction(
        &program_id,
        &agent_entry_pda,
        &owner_authority.pubkey(),
    );

    let mut transaction = Transaction::new_with_payer(&[deregister_instruction], Some(&payer.pubkey()));
    transaction.sign(&[&payer, &owner_authority], recent_blockhash);

    let result = banks_client.process_transaction(transaction).await;
    assert!(result.is_ok(), "Failed to deregister agent: {:?}", result.err());

    // Verify the agent was deregistered
    let account = banks_client
        .get_account(agent_entry_pda)
        .await
        .unwrap()
        .unwrap();

    let agent_entry = AgentRegistryEntryV1::try_from_slice(&account.data).unwrap();
    assert_eq!(agent_entry.status, AgentStatus::Deregistered as u8);
    assert!(agent_entry.is_deregistered());
}

#[tokio::test]
async fn test_unauthorized_update_fails() {
    let program_id = Pubkey::new_unique();
    let mut program_test = ProgramTest::new(
        "solana_agent_registry",
        program_id,
        processor!(solana_agent_registry::process_instruction),
    );

    let (mut banks_client, payer, recent_blockhash) = program_test.start().await;

    let owner_authority = Keypair::new();
    let unauthorized_user = Keypair::new();
    let agent_id = "test-agent-005";
    let (agent_entry_pda, _bump) = get_agent_pda(agent_id, &program_id);

    // First register the agent
    let register_instruction = create_register_agent_instruction(
        &program_id,
        &agent_entry_pda,
        &owner_authority.pubkey(),
        &payer.pubkey(),
        agent_id.to_string(),
        "Test Agent 5".to_string(),
        "Agent for unauthorized test".to_string(),
        "1.0.0".to_string(),
    );

    let mut transaction = Transaction::new_with_payer(&[register_instruction], Some(&payer.pubkey()));
    transaction.sign(&[&payer, &owner_authority], recent_blockhash);
    banks_client.process_transaction(transaction).await.unwrap();

    // Try to update status with unauthorized user (should fail)
    let update_instruction = create_update_status_instruction(
        &program_id,
        &agent_entry_pda,
        &unauthorized_user.pubkey(),
        AgentStatus::Active as u8,
    );

    let mut transaction = Transaction::new_with_payer(&[update_instruction], Some(&payer.pubkey()));
    transaction.sign(&[&payer, &unauthorized_user], recent_blockhash);

    let result = banks_client.process_transaction(transaction).await;
    assert!(result.is_err(), "Unauthorized update should have failed");
}

#[tokio::test]
async fn test_duplicate_registration_fails() {
    let program_id = Pubkey::new_unique();
    let mut program_test = ProgramTest::new(
        "solana_agent_registry",
        program_id,
        processor!(solana_agent_registry::process_instruction),
    );

    let (mut banks_client, payer, recent_blockhash) = program_test.start().await;

    let owner_authority = Keypair::new();
    let agent_id = "test-agent-006";
    let (agent_entry_pda, _bump) = get_agent_pda(agent_id, &program_id);

    // First registration (should succeed)
    let register_instruction = create_register_agent_instruction(
        &program_id,
        &agent_entry_pda,
        &owner_authority.pubkey(),
        &payer.pubkey(),
        agent_id.to_string(),
        "Test Agent 6".to_string(),
        "First registration".to_string(),
        "1.0.0".to_string(),
    );

    let mut transaction = Transaction::new_with_payer(&[register_instruction], Some(&payer.pubkey()));
    transaction.sign(&[&payer, &owner_authority], recent_blockhash);
    banks_client.process_transaction(transaction).await.unwrap();

    // Second registration with same ID (should fail)
    let register_instruction2 = create_register_agent_instruction(
        &program_id,
        &agent_entry_pda,
        &owner_authority.pubkey(),
        &payer.pubkey(),
        agent_id.to_string(),
        "Test Agent 6 Duplicate".to_string(),
        "Second registration".to_string(),
        "2.0.0".to_string(),
    );

    let mut transaction = Transaction::new_with_payer(&[register_instruction2], Some(&payer.pubkey()));
    transaction.sign(&[&payer, &owner_authority], recent_blockhash);

    let result = banks_client.process_transaction(transaction).await;
    assert!(result.is_err(), "Duplicate registration should have failed");
}