//! Comprehensive tests for the MCP Server Registry program

use solana_program::{
    account_info::{next_account_info, AccountInfo},
    clock::Clock,
    entrypoint::ProgramResult,
    instruction::{AccountMeta, Instruction},
    program_error::ProgramError,
    pubkey::Pubkey,
    rent::Rent,
    system_instruction,
    sysvar,
};
use solana_program_test::*;
use solana_sdk::{
    account::Account,
    signature::{Keypair, Signer},
    transaction::Transaction,
};
use borsh::{BorshDeserialize, BorshSerialize};

use solana_ai_registries_common::{
    constants::*,
    error::RegistryError,
    McpServerStatus,
    serialization::{
        McpServerUpdateDetailsInput, McpToolDefinitionOnChainInput,
        McpResourceDefinitionOnChainInput, McpPromptDefinitionOnChainInput,
        McpToolDefinitionOnChain, McpResourceDefinitionOnChain, McpPromptDefinitionOnChain,
    },
};

// Import the MCP server registry modules
use mcp_server_registry::{
    instruction::McpServerRegistryInstruction,
    state::McpServerRegistryEntryV1,
    processor::process_instruction,
};

/// Test program ID for MCP Server Registry
const TEST_PROGRAM_ID: Pubkey = Pubkey::new_from_array([
    1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16,
    17, 18, 19, 20, 21, 22, 23, 24, 25, 26, 27, 28, 29, 30, 31, 32,
]);

/// Helper function to create a test MCP server registry program
fn program_test() -> ProgramTest {
    ProgramTest::new(
        "mcp_server_registry",
        TEST_PROGRAM_ID,
        processor!(process_instruction),
    )
}

/// Helper function to create test tool definitions
fn create_test_tool_definitions() -> Vec<McpToolDefinitionOnChainInput> {
    vec![
        McpToolDefinitionOnChainInput {
            name: "image-analyzer".to_string(),
            description_hash: [1; 32],
            input_schema_hash: [2; 32],
            output_schema_hash: [3; 32],
            tags: vec!["image".to_string(), "analysis".to_string()],
        },
        McpToolDefinitionOnChainInput {
            name: "text-processor".to_string(),
            description_hash: [4; 32],
            input_schema_hash: [5; 32],
            output_schema_hash: [6; 32],
            tags: vec!["text".to_string(), "nlp".to_string()],
        },
    ]
}

/// Helper function to create test resource definitions
fn create_test_resource_definitions() -> Vec<McpResourceDefinitionOnChainInput> {
    vec![
        McpResourceDefinitionOnChainInput {
            uri_pattern: "db://users/*".to_string(),
            description_hash: [7; 32],
            tags: vec!["database".to_string(), "users".to_string()],
        },
        McpResourceDefinitionOnChainInput {
            uri_pattern: "api://weather/*".to_string(),
            description_hash: [8; 32],
            tags: vec!["api".to_string(), "weather".to_string()],
        },
    ]
}

/// Helper function to create test prompt definitions
fn create_test_prompt_definitions() -> Vec<McpPromptDefinitionOnChainInput> {
    vec![
        McpPromptDefinitionOnChainInput {
            name: "summarize-text".to_string(),
            description_hash: [9; 32],
            tags: vec!["summarization".to_string()],
        },
        McpPromptDefinitionOnChainInput {
            name: "translate-text".to_string(),
            description_hash: [10; 32],
            tags: vec!["translation".to_string()],
        },
    ]
}

/// Test MCP server registration
#[tokio::test]
async fn test_register_mcp_server() {
    let mut context = program_test().start_with_context().await;
    
    let owner = Keypair::new();
    let payer = Keypair::new();
    let server_id = "test-mcp-server";
    
    // Airdrop SOL to payer
    let rent = Rent::default();
    let lamports = rent.minimum_balance(McpServerRegistryEntryV1::SPACE) + 1_000_000;
    
    context.banks_client
        .process_transaction(Transaction::new_signed_with_payer(
            &[system_instruction::transfer(
                &context.payer.pubkey(),
                &payer.pubkey(),
                lamports,
            )],
            Some(&context.payer.pubkey()),
            &[&context.payer],
            context.last_blockhash,
        ))
        .await
        .unwrap();

    // Derive PDA for MCP server entry
    let (mcp_server_pda, _bump) = Pubkey::find_program_address(
        &[MCP_SERVER_REGISTRY_PDA_SEED, server_id.as_bytes()],
        &TEST_PROGRAM_ID,
    );

    // Create register instruction
    let instruction = McpServerRegistryInstruction::RegisterMcpServer {
        server_id: server_id.to_string(),
        name: "Test MCP Server".to_string(),
        server_version: "1.0.0".to_string(),
        service_endpoint: "https://example.com/mcp".to_string(),
        documentation_url: Some("https://docs.example.com".to_string()),
        server_capabilities_summary: Some("A test MCP server for testing".to_string()),
        supports_resources: true,
        supports_tools: true,
        supports_prompts: false,
        onchain_tool_definitions: create_test_tool_definitions(),
        onchain_resource_definitions: create_test_resource_definitions(),
        onchain_prompt_definitions: vec![],
        full_capabilities_uri: Some("https://example.com/capabilities.json".to_string()),
        tags: vec!["test".to_string(), "example".to_string()],
    };

    let instruction_data = instruction.try_to_vec().unwrap();

    let accounts = vec![
        AccountMeta::new(mcp_server_pda, false),
        AccountMeta::new_readonly(owner.pubkey(), true),
        AccountMeta::new(payer.pubkey(), true),
        AccountMeta::new_readonly(solana_program::system_program::id(), false),
    ];

    let transaction = Transaction::new_signed_with_payer(
        &[Instruction {
            program_id: TEST_PROGRAM_ID,
            accounts,
            data: instruction_data,
        }],
        Some(&payer.pubkey()),
        &[&payer, &owner],
        context.last_blockhash,
    );

    context.banks_client
        .process_transaction(transaction)
        .await
        .unwrap();

    // Verify the account was created and data is correct
    let account = context.banks_client
        .get_account(mcp_server_pda)
        .await
        .unwrap()
        .unwrap();

    let mcp_server_entry = McpServerRegistryEntryV1::try_from_slice(&account.data).unwrap();
    
    assert_eq!(mcp_server_entry.registry_version, 1);
    assert_eq!(mcp_server_entry.owner_authority, owner.pubkey());
    assert_eq!(mcp_server_entry.server_id, server_id);
    assert_eq!(mcp_server_entry.name, "Test MCP Server");
    assert_eq!(mcp_server_entry.server_version, "1.0.0");
    assert_eq!(mcp_server_entry.service_endpoint, "https://example.com/mcp");
    assert_eq!(mcp_server_entry.documentation_url, Some("https://docs.example.com".to_string()));
    assert_eq!(mcp_server_entry.server_capabilities_summary, Some("A test MCP server for testing".to_string()));
    assert!(mcp_server_entry.supports_resources);
    assert!(mcp_server_entry.supports_tools);
    assert!(!mcp_server_entry.supports_prompts);
    assert_eq!(mcp_server_entry.onchain_tool_definitions.len(), 2);
    assert_eq!(mcp_server_entry.onchain_resource_definitions.len(), 2);
    assert_eq!(mcp_server_entry.onchain_prompt_definitions.len(), 0);
    assert_eq!(mcp_server_entry.status, McpServerStatus::Pending as u8);
    assert_eq!(mcp_server_entry.full_capabilities_uri, Some("https://example.com/capabilities.json".to_string()));
    assert_eq!(mcp_server_entry.tags, vec!["test", "example"]);
    assert!(mcp_server_entry.registration_timestamp > 0);
    assert!(mcp_server_entry.last_update_timestamp > 0);
}

/// Test MCP server details update
#[tokio::test]
async fn test_update_mcp_server_details() {
    let mut context = program_test().start_with_context().await;
    
    let owner = Keypair::new();
    let payer = Keypair::new();
    let server_id = "test-update-server";
    
    // Setup: Register a server first
    let rent = Rent::default();
    let lamports = rent.minimum_balance(McpServerRegistryEntryV1::SPACE) + 1_000_000;
    
    context.banks_client
        .process_transaction(Transaction::new_signed_with_payer(
            &[system_instruction::transfer(
                &context.payer.pubkey(),
                &payer.pubkey(),
                lamports,
            )],
            Some(&context.payer.pubkey()),
            &[&context.payer],
            context.last_blockhash,
        ))
        .await
        .unwrap();

    let (mcp_server_pda, _bump) = Pubkey::find_program_address(
        &[MCP_SERVER_REGISTRY_PDA_SEED, server_id.as_bytes()],
        &TEST_PROGRAM_ID,
    );

    // Register server
    let register_instruction = McpServerRegistryInstruction::RegisterMcpServer {
        server_id: server_id.to_string(),
        name: "Original Name".to_string(),
        server_version: "1.0.0".to_string(),
        service_endpoint: "https://original.com/mcp".to_string(),
        documentation_url: None,
        server_capabilities_summary: None,
        supports_resources: false,
        supports_tools: false,
        supports_prompts: false,
        onchain_tool_definitions: vec![],
        onchain_resource_definitions: vec![],
        onchain_prompt_definitions: vec![],
        full_capabilities_uri: None,
        tags: vec!["original".to_string()],
    };

    let register_data = register_instruction.try_to_vec().unwrap();

    let register_accounts = vec![
        AccountMeta::new(mcp_server_pda, false),
        AccountMeta::new_readonly(owner.pubkey(), true),
        AccountMeta::new(payer.pubkey(), true),
        AccountMeta::new_readonly(solana_program::system_program::id(), false),
    ];

    context.banks_client
        .process_transaction(Transaction::new_signed_with_payer(
            &[Instruction {
                program_id: TEST_PROGRAM_ID,
                accounts: register_accounts,
                data: register_data,
            }],
            Some(&payer.pubkey()),
            &[&payer, &owner],
            context.last_blockhash,
        ))
        .await
        .unwrap();

    // Now update the server details
    let update_details = McpServerUpdateDetailsInput {
        name: Some("Updated Name".to_string()),
        server_version: Some("2.0.0".to_string()),
        service_endpoint: Some("https://updated.com/mcp".to_string()),
        documentation_url: Some("https://docs.updated.com".to_string()),
        clear_documentation_url: None,
        server_capabilities_summary: Some("Updated capabilities".to_string()),
        clear_server_capabilities_summary: None,
        supports_resources: Some(true),
        supports_tools: Some(true),
        supports_prompts: Some(true),
        onchain_tool_definitions: Some(create_test_tool_definitions()),
        onchain_resource_definitions: Some(create_test_resource_definitions()),
        onchain_prompt_definitions: Some(create_test_prompt_definitions()),
        full_capabilities_uri: Some("https://updated.com/capabilities.json".to_string()),
        clear_full_capabilities_uri: None,
        tags: Some(vec!["updated".to_string(), "test".to_string()]),
    };

    let update_instruction = McpServerRegistryInstruction::UpdateMcpServerDetails { details: update_details };
    let update_data = update_instruction.try_to_vec().unwrap();

    let update_accounts = vec![
        AccountMeta::new(mcp_server_pda, false),
        AccountMeta::new_readonly(owner.pubkey(), true),
    ];

    context.banks_client
        .process_transaction(Transaction::new_signed_with_payer(
            &[Instruction {
                program_id: TEST_PROGRAM_ID,
                accounts: update_accounts,
                data: update_data,
            }],
            Some(&payer.pubkey()),
            &[&payer, &owner],
            context.last_blockhash,
        ))
        .await
        .unwrap();

    // Verify the updates
    let account = context.banks_client
        .get_account(mcp_server_pda)
        .await
        .unwrap()
        .unwrap();

    let mcp_server_entry = McpServerRegistryEntryV1::try_from_slice(&account.data).unwrap();
    
    assert_eq!(mcp_server_entry.name, "Updated Name");
    assert_eq!(mcp_server_entry.server_version, "2.0.0");
    assert_eq!(mcp_server_entry.service_endpoint, "https://updated.com/mcp");
    assert_eq!(mcp_server_entry.documentation_url, Some("https://docs.updated.com".to_string()));
    assert_eq!(mcp_server_entry.server_capabilities_summary, Some("Updated capabilities".to_string()));
    assert!(mcp_server_entry.supports_resources);
    assert!(mcp_server_entry.supports_tools);
    assert!(mcp_server_entry.supports_prompts);
    assert_eq!(mcp_server_entry.onchain_tool_definitions.len(), 2);
    assert_eq!(mcp_server_entry.onchain_resource_definitions.len(), 2);
    assert_eq!(mcp_server_entry.onchain_prompt_definitions.len(), 2);
    assert_eq!(mcp_server_entry.full_capabilities_uri, Some("https://updated.com/capabilities.json".to_string()));
    assert_eq!(mcp_server_entry.tags, vec!["updated", "test"]);
}

/// Test MCP server status update
#[tokio::test]
async fn test_update_mcp_server_status() {
    let mut context = program_test().start_with_context().await;
    
    let owner = Keypair::new();
    let payer = Keypair::new();
    let server_id = "test-status-server";
    
    // Setup: Register a server first
    let rent = Rent::default();
    let lamports = rent.minimum_balance(McpServerRegistryEntryV1::SPACE) + 1_000_000;
    
    context.banks_client
        .process_transaction(Transaction::new_signed_with_payer(
            &[system_instruction::transfer(
                &context.payer.pubkey(),
                &payer.pubkey(),
                lamports,
            )],
            Some(&context.payer.pubkey()),
            &[&context.payer],
            context.last_blockhash,
        ))
        .await
        .unwrap();

    let (mcp_server_pda, _bump) = Pubkey::find_program_address(
        &[MCP_SERVER_REGISTRY_PDA_SEED, server_id.as_bytes()],
        &TEST_PROGRAM_ID,
    );

    // Register server
    let register_instruction = McpServerRegistryInstruction::RegisterMcpServer {
        server_id: server_id.to_string(),
        name: "Status Test Server".to_string(),
        server_version: "1.0.0".to_string(),
        service_endpoint: "https://status.com/mcp".to_string(),
        documentation_url: None,
        server_capabilities_summary: None,
        supports_resources: false,
        supports_tools: false,
        supports_prompts: false,
        onchain_tool_definitions: vec![],
        onchain_resource_definitions: vec![],
        onchain_prompt_definitions: vec![],
        full_capabilities_uri: None,
        tags: vec![],
    };

    let register_data = register_instruction.try_to_vec().unwrap();

    let register_accounts = vec![
        AccountMeta::new(mcp_server_pda, false),
        AccountMeta::new_readonly(owner.pubkey(), true),
        AccountMeta::new(payer.pubkey(), true),
        AccountMeta::new_readonly(solana_program::system_program::id(), false),
    ];

    context.banks_client
        .process_transaction(Transaction::new_signed_with_payer(
            &[Instruction {
                program_id: TEST_PROGRAM_ID,
                accounts: register_accounts,
                data: register_data,
            }],
            Some(&payer.pubkey()),
            &[&payer, &owner],
            context.last_blockhash,
        ))
        .await
        .unwrap();

    // Update status to Active
    let status_instruction = McpServerRegistryInstruction::UpdateMcpServerStatus { 
        new_status: McpServerStatus::Active as u8 
    };
    let status_data = status_instruction.try_to_vec().unwrap();

    let status_accounts = vec![
        AccountMeta::new(mcp_server_pda, false),
        AccountMeta::new_readonly(owner.pubkey(), true),
    ];

    context.banks_client
        .process_transaction(Transaction::new_signed_with_payer(
            &[Instruction {
                program_id: TEST_PROGRAM_ID,
                accounts: status_accounts,
                data: status_data,
            }],
            Some(&payer.pubkey()),
            &[&payer, &owner],
            context.last_blockhash,
        ))
        .await
        .unwrap();

    // Verify the status update
    let account = context.banks_client
        .get_account(mcp_server_pda)
        .await
        .unwrap()
        .unwrap();

    let mcp_server_entry = McpServerRegistryEntryV1::try_from_slice(&account.data).unwrap();
    assert_eq!(mcp_server_entry.status, McpServerStatus::Active as u8);
    assert!(mcp_server_entry.is_active());
}

/// Test MCP server deregistration
#[tokio::test]
async fn test_deregister_mcp_server() {
    let mut context = program_test().start_with_context().await;
    
    let owner = Keypair::new();
    let payer = Keypair::new();
    let server_id = "test-deregister-server";
    
    // Setup: Register a server first
    let rent = Rent::default();
    let lamports = rent.minimum_balance(McpServerRegistryEntryV1::SPACE) + 1_000_000;
    
    context.banks_client
        .process_transaction(Transaction::new_signed_with_payer(
            &[system_instruction::transfer(
                &context.payer.pubkey(),
                &payer.pubkey(),
                lamports,
            )],
            Some(&context.payer.pubkey()),
            &[&context.payer],
            context.last_blockhash,
        ))
        .await
        .unwrap();

    let (mcp_server_pda, _bump) = Pubkey::find_program_address(
        &[MCP_SERVER_REGISTRY_PDA_SEED, server_id.as_bytes()],
        &TEST_PROGRAM_ID,
    );

    // Register server
    let register_instruction = McpServerRegistryInstruction::RegisterMcpServer {
        server_id: server_id.to_string(),
        name: "Deregister Test Server".to_string(),
        server_version: "1.0.0".to_string(),
        service_endpoint: "https://deregister.com/mcp".to_string(),
        documentation_url: None,
        server_capabilities_summary: None,
        supports_resources: false,
        supports_tools: false,
        supports_prompts: false,
        onchain_tool_definitions: vec![],
        onchain_resource_definitions: vec![],
        onchain_prompt_definitions: vec![],
        full_capabilities_uri: None,
        tags: vec![],
    };

    let register_data = register_instruction.try_to_vec().unwrap();

    let register_accounts = vec![
        AccountMeta::new(mcp_server_pda, false),
        AccountMeta::new_readonly(owner.pubkey(), true),
        AccountMeta::new(payer.pubkey(), true),
        AccountMeta::new_readonly(solana_program::system_program::id(), false),
    ];

    context.banks_client
        .process_transaction(Transaction::new_signed_with_payer(
            &[Instruction {
                program_id: TEST_PROGRAM_ID,
                accounts: register_accounts,
                data: register_data,
            }],
            Some(&payer.pubkey()),
            &[&payer, &owner],
            context.last_blockhash,
        ))
        .await
        .unwrap();

    // Deregister the server
    let deregister_instruction = McpServerRegistryInstruction::DeregisterMcpServer;
    let deregister_data = deregister_instruction.try_to_vec().unwrap();

    let deregister_accounts = vec![
        AccountMeta::new(mcp_server_pda, false),
        AccountMeta::new_readonly(owner.pubkey(), true),
    ];

    context.banks_client
        .process_transaction(Transaction::new_signed_with_payer(
            &[Instruction {
                program_id: TEST_PROGRAM_ID,
                accounts: deregister_accounts,
                data: deregister_data,
            }],
            Some(&payer.pubkey()),
            &[&payer, &owner],
            context.last_blockhash,
        ))
        .await
        .unwrap();

    // Verify the deregistration
    let account = context.banks_client
        .get_account(mcp_server_pda)
        .await
        .unwrap()
        .unwrap();

    let mcp_server_entry = McpServerRegistryEntryV1::try_from_slice(&account.data).unwrap();
    assert_eq!(mcp_server_entry.status, McpServerStatus::Deregistered as u8);
    assert!(mcp_server_entry.is_deregistered());
}

/// Test unauthorized access
#[tokio::test]
async fn test_unauthorized_access() {
    let mut context = program_test().start_with_context().await;
    
    let owner = Keypair::new();
    let unauthorized = Keypair::new();
    let payer = Keypair::new();
    let server_id = "test-unauthorized-server";
    
    // Setup: Register a server first
    let rent = Rent::default();
    let lamports = rent.minimum_balance(McpServerRegistryEntryV1::SPACE) + 1_000_000;
    
    context.banks_client
        .process_transaction(Transaction::new_signed_with_payer(
            &[system_instruction::transfer(
                &context.payer.pubkey(),
                &payer.pubkey(),
                lamports,
            )],
            Some(&context.payer.pubkey()),
            &[&context.payer],
            context.last_blockhash,
        ))
        .await
        .unwrap();

    let (mcp_server_pda, _bump) = Pubkey::find_program_address(
        &[MCP_SERVER_REGISTRY_PDA_SEED, server_id.as_bytes()],
        &TEST_PROGRAM_ID,
    );

    // Register server with owner
    let register_instruction = McpServerRegistryInstruction::RegisterMcpServer {
        server_id: server_id.to_string(),
        name: "Unauthorized Test Server".to_string(),
        server_version: "1.0.0".to_string(),
        service_endpoint: "https://unauthorized.com/mcp".to_string(),
        documentation_url: None,
        server_capabilities_summary: None,
        supports_resources: false,
        supports_tools: false,
        supports_prompts: false,
        onchain_tool_definitions: vec![],
        onchain_resource_definitions: vec![],
        onchain_prompt_definitions: vec![],
        full_capabilities_uri: None,
        tags: vec![],
    };

    let register_data = register_instruction.try_to_vec().unwrap();

    let register_accounts = vec![
        AccountMeta::new(mcp_server_pda, false),
        AccountMeta::new_readonly(owner.pubkey(), true),
        AccountMeta::new(payer.pubkey(), true),
        AccountMeta::new_readonly(solana_program::system_program::id(), false),
    ];

    context.banks_client
        .process_transaction(Transaction::new_signed_with_payer(
            &[Instruction {
                program_id: TEST_PROGRAM_ID,
                accounts: register_accounts,
                data: register_data,
            }],
            Some(&payer.pubkey()),
            &[&payer, &owner],
            context.last_blockhash,
        ))
        .await
        .unwrap();

    // Try to update with unauthorized user
    let update_details = McpServerUpdateDetailsInput {
        name: Some("Hacked Name".to_string()),
        ..Default::default()
    };

    let update_instruction = McpServerRegistryInstruction::UpdateMcpServerDetails { details: update_details };
    let update_data = update_instruction.try_to_vec().unwrap();

    let update_accounts = vec![
        AccountMeta::new(mcp_server_pda, false),
        AccountMeta::new_readonly(unauthorized.pubkey(), true), // Wrong signer
    ];

    let result = context.banks_client
        .process_transaction(Transaction::new_signed_with_payer(
            &[Instruction {
                program_id: TEST_PROGRAM_ID,
                accounts: update_accounts,
                data: update_data,
            }],
            Some(&payer.pubkey()),
            &[&payer, &unauthorized], // Wrong signer
            context.last_blockhash,
        ))
        .await;

    // Should fail with unauthorized error
    assert!(result.is_err());
}

/// Test validation errors
#[tokio::test]
async fn test_validation_errors() {
    let mut context = program_test().start_with_context().await;
    
    let owner = Keypair::new();
    let payer = Keypair::new();
    let server_id = ""; // Invalid empty server ID
    
    let rent = Rent::default();
    let lamports = rent.minimum_balance(McpServerRegistryEntryV1::SPACE) + 1_000_000;
    
    context.banks_client
        .process_transaction(Transaction::new_signed_with_payer(
            &[system_instruction::transfer(
                &context.payer.pubkey(),
                &payer.pubkey(),
                lamports,
            )],
            Some(&context.payer.pubkey()),
            &[&context.payer],
            context.last_blockhash,
        ))
        .await
        .unwrap();

    let (mcp_server_pda, _bump) = Pubkey::find_program_address(
        &[MCP_SERVER_REGISTRY_PDA_SEED, server_id.as_bytes()],
        &TEST_PROGRAM_ID,
    );

    // Try to register with invalid data
    let register_instruction = McpServerRegistryInstruction::RegisterMcpServer {
        server_id: server_id.to_string(), // Empty server ID
        name: "".to_string(), // Empty name
        server_version: "1.0.0".to_string(),
        service_endpoint: "invalid-url".to_string(), // Invalid URL
        documentation_url: None,
        server_capabilities_summary: None,
        supports_resources: false,
        supports_tools: false,
        supports_prompts: false,
        onchain_tool_definitions: vec![],
        onchain_resource_definitions: vec![],
        onchain_prompt_definitions: vec![],
        full_capabilities_uri: None,
        tags: vec![],
    };

    let register_data = register_instruction.try_to_vec().unwrap();

    let register_accounts = vec![
        AccountMeta::new(mcp_server_pda, false),
        AccountMeta::new_readonly(owner.pubkey(), true),
        AccountMeta::new(payer.pubkey(), true),
        AccountMeta::new_readonly(solana_program::system_program::id(), false),
    ];

    let result = context.banks_client
        .process_transaction(Transaction::new_signed_with_payer(
            &[Instruction {
                program_id: TEST_PROGRAM_ID,
                accounts: register_accounts,
                data: register_data,
            }],
            Some(&payer.pubkey()),
            &[&payer, &owner],
            context.last_blockhash,
        ))
        .await;

    // Should fail with validation error
    assert!(result.is_err());
}

/// Test maximum limits
#[tokio::test]
async fn test_maximum_limits() {
    let mut context = program_test().start_with_context().await;
    
    let owner = Keypair::new();
    let payer = Keypair::new();
    let server_id = "test-limits-server";
    
    let rent = Rent::default();
    let lamports = rent.minimum_balance(McpServerRegistryEntryV1::SPACE) + 1_000_000;
    
    context.banks_client
        .process_transaction(Transaction::new_signed_with_payer(
            &[system_instruction::transfer(
                &context.payer.pubkey(),
                &payer.pubkey(),
                lamports,
            )],
            Some(&context.payer.pubkey()),
            &[&context.payer],
            context.last_blockhash,
        ))
        .await
        .unwrap();

    let (mcp_server_pda, _bump) = Pubkey::find_program_address(
        &[MCP_SERVER_REGISTRY_PDA_SEED, server_id.as_bytes()],
        &TEST_PROGRAM_ID,
    );

    // Create maximum number of tool definitions
    let max_tools: Vec<McpToolDefinitionOnChainInput> = (0..MAX_ONCHAIN_TOOL_DEFINITIONS)
        .map(|i| McpToolDefinitionOnChainInput {
            name: format!("tool-{}", i),
            description_hash: [i as u8; 32],
            input_schema_hash: [(i + 1) as u8; 32],
            output_schema_hash: [(i + 2) as u8; 32],
            tags: vec![format!("tag-{}", i)],
        })
        .collect();

    // Create maximum number of resource definitions
    let max_resources: Vec<McpResourceDefinitionOnChainInput> = (0..MAX_ONCHAIN_RESOURCE_DEFINITIONS)
        .map(|i| McpResourceDefinitionOnChainInput {
            uri_pattern: format!("resource://pattern-{}", i),
            description_hash: [i as u8; 32],
            tags: vec![format!("tag-{}", i)],
        })
        .collect();

    // Create maximum number of prompt definitions
    let max_prompts: Vec<McpPromptDefinitionOnChainInput> = (0..MAX_ONCHAIN_PROMPT_DEFINITIONS)
        .map(|i| McpPromptDefinitionOnChainInput {
            name: format!("prompt-{}", i),
            description_hash: [i as u8; 32],
            tags: vec![format!("tag-{}", i)],
        })
        .collect();

    // Create maximum number of tags
    let max_tags: Vec<String> = (0..MAX_SERVER_TAGS)
        .map(|i| format!("tag-{}", i))
        .collect();

    let register_instruction = McpServerRegistryInstruction::RegisterMcpServer {
        server_id: server_id.to_string(),
        name: "Max Limits Test Server".to_string(),
        server_version: "1.0.0".to_string(),
        service_endpoint: "https://maxlimits.com/mcp".to_string(),
        documentation_url: None,
        server_capabilities_summary: None,
        supports_resources: true,
        supports_tools: true,
        supports_prompts: true,
        onchain_tool_definitions: max_tools,
        onchain_resource_definitions: max_resources,
        onchain_prompt_definitions: max_prompts,
        full_capabilities_uri: None,
        tags: max_tags,
    };

    let register_data = register_instruction.try_to_vec().unwrap();

    let register_accounts = vec![
        AccountMeta::new(mcp_server_pda, false),
        AccountMeta::new_readonly(owner.pubkey(), true),
        AccountMeta::new(payer.pubkey(), true),
        AccountMeta::new_readonly(solana_program::system_program::id(), false),
    ];

    // Should succeed with maximum limits
    context.banks_client
        .process_transaction(Transaction::new_signed_with_payer(
            &[Instruction {
                program_id: TEST_PROGRAM_ID,
                accounts: register_accounts,
                data: register_data,
            }],
            Some(&payer.pubkey()),
            &[&payer, &owner],
            context.last_blockhash,
        ))
        .await
        .unwrap();

    // Verify the data
    let account = context.banks_client
        .get_account(mcp_server_pda)
        .await
        .unwrap()
        .unwrap();

    let mcp_server_entry = McpServerRegistryEntryV1::try_from_slice(&account.data).unwrap();
    
    assert_eq!(mcp_server_entry.onchain_tool_definitions.len(), MAX_ONCHAIN_TOOL_DEFINITIONS);
    assert_eq!(mcp_server_entry.onchain_resource_definitions.len(), MAX_ONCHAIN_RESOURCE_DEFINITIONS);
    assert_eq!(mcp_server_entry.onchain_prompt_definitions.len(), MAX_ONCHAIN_PROMPT_DEFINITIONS);
    assert_eq!(mcp_server_entry.tags.len(), MAX_SERVER_TAGS);
}