#[cfg(test)]
mod security_integration_tests {
    use super::*;
    use solana_program::{
        account_info::{AccountInfo, IntoAccountInfo},
        clock::Clock,
        entrypoint::ProgramResult,
        instruction::{AccountMeta, Instruction},
        program_error::ProgramError,
        program_pack::Pack,
        pubkey::Pubkey,
        rent::Rent,
        system_program,
        sysvar,
    };
    use aeamcp_common::{
        authority::{AuthorityRegistry, verify_escrow_program_authority, verify_ddr_program_authority},
        constants::*,
        error::RegistryError,
        serialization::*,
        token_utils,
    };
    use crate::{
        instruction::McpServerRegistryInstruction,
        processor::Processor,
        state::McpServerEntryV1,
    };
    use borsh::{BorshDeserialize, BorshSerialize};
    use spl_token::state::{Account as TokenAccount, Mint};
    use std::str::FromStr;

    // Test helper functions
    fn create_test_account_info<'a>(
        key: &'a Pubkey,
        is_signer: bool,
        is_writable: bool,
        lamports: &'a mut u64,
        data: &'a mut [u8],
        owner: &'a Pubkey,
        executable: bool,
        rent_epoch: u64,
    ) -> AccountInfo<'a> {
        AccountInfo::new(
            key,
            is_signer,
            is_writable,
            lamports,
            data,
            owner,
            executable,
            rent_epoch,
        )
    }

    // Security Integration Tests for Authority Verification

    #[test]
    fn test_authority_registry_in_mcp_context() {
        let registry = AuthorityRegistry::new();
        
        // Test that registry properly identifies authorized programs
        let escrow_id = Pubkey::from_str("11111111111111111111111111111111").unwrap();
        let ddr_id = Pubkey::from_str("11111111111111111111111111111111").unwrap();
        
        assert!(registry.verify_escrow_authority(&escrow_id));
        assert!(registry.verify_ddr_authority(&ddr_id));
        
        // Test rejection of unauthorized programs
        let malicious_id = Pubkey::new_unique();
        assert!(!registry.verify_escrow_authority(&malicious_id));
        assert!(!registry.verify_ddr_authority(&malicious_id));
    }

    #[test]
    fn test_mcp_server_registration_with_token_security() {
        let program_id = Pubkey::new_unique();
        let owner = Pubkey::new_unique();
        let server_key = Pubkey::new_unique();
        let mint_key = Pubkey::from_str("11111111111111111111111111111111").unwrap();
        
        // Create test data
        let mut server_lamports = 0;
        let mut server_data = vec![0u8; 2048];
        let mut owner_lamports = 0;
        let mut payer_lamports = 1000000;
        let mut system_lamports = 0;
        
        // Create server registration instruction
        let instruction_data = McpServerRegistryInstruction::RegisterMcpServer {
            server_id: "test-server".to_string(),
            name: "Test MCP Server".to_string(),
            description: "Test server for security testing".to_string(),
            server_version: "1.0.0".to_string(),
            provider_name: Some("Test Provider".to_string()),
            provider_url: Some("https://test.com".to_string()),
            documentation_url: Some("https://docs.test.com".to_string()),
            service_endpoints: vec![ServiceEndpointInput {
                transport: "http".to_string(),
                url: "https://api.test.com".to_string(),
                protocol: Some("MCP".to_string()),
                auth_scheme: None,
                auth_required: false,
                custom_headers: None,
                rate_limits: None,
            }],
            supported_protocols: vec!["MCP/1.0".to_string()],
            capabilities: vec!["test".to_string()],
            resource_types: vec!["file".to_string()],
            tool_categories: vec!["utility".to_string()],
            security_info_uri: None,
            extended_metadata_uri: None,
            tags: vec!["test".to_string()],
        }.try_to_vec().unwrap();
        
        // Create accounts
        let accounts = vec![
            create_test_account_info(
                &server_key,
                false,
                true,
                &mut server_lamports,
                &mut server_data,
                &system_program::id(),
                false,
                0,
            ),
            create_test_account_info(
                &owner,
                true,
                false,
                &mut owner_lamports,
                &mut vec![],
                &system_program::id(),
                false,
                0,
            ),
            create_test_account_info(
                &owner,
                true,
                false,
                &mut payer_lamports,
                &mut vec![],
                &system_program::id(),
                false,
                0,
            ),
            create_test_account_info(
                &system_program::id(),
                false,
                false,
                &mut system_lamports,
                &mut vec![],
                &system_program::id(),
                true,
                0,
            ),
        ];
        
        // Process registration
        let result = Processor::process(&program_id, &accounts, &instruction_data);
        
        // Should succeed
        assert!(result.is_ok());
        
        // Verify server data was created
        let server = McpServerEntryV1::try_from_slice(&accounts[0].data.borrow()).unwrap();
        assert_eq!(server.server_id, "test-server");
        assert_eq!(server.owner_authority, owner);
    }

    #[test]
    fn test_attack_vector_unauthorized_cpi() {
        let program_id = Pubkey::new_unique();
        let attacker_program = Pubkey::new_unique();
        let mut attacker_lamports = 0;
        let mut attacker_data = vec![];
        let attacker_owner = Pubkey::new_unique();
        
        // Create malicious program account
        let malicious_account = create_test_account_info(
            &attacker_program,
            true,
            false,
            &mut attacker_lamports,
            &mut attacker_data,
            &attacker_owner,
            true, // executable
            0,
        );
        
        let registry = AuthorityRegistry::new();
        
        // Should fail authority verification
        assert_eq!(
            verify_escrow_program_authority(&malicious_account, &registry),
            Err(RegistryError::UnauthorizedProgram)
        );
        
        assert_eq!(
            verify_ddr_program_authority(&malicious_account, &registry),
            Err(RegistryError::UnauthorizedProgram)
        );
    }

    #[test]
    fn test_attack_vector_signature_bypass() {
        let program_id = Pubkey::from_str("11111111111111111111111111111111").unwrap();
        let mut program_lamports = 0;
        let mut program_data = vec![];
        let program_owner = Pubkey::new_unique();
        
        // Create authorized program but without signature
        let unsigned_account = create_test_account_info(
            &program_id,
            false, // NOT signed - attack attempt
            false,
            &mut program_lamports,
            &mut program_data,
            &program_owner,
            true,
            0,
        );
        
        let registry = AuthorityRegistry::new();
        
        // Should fail due to missing signature
        assert_eq!(
            verify_escrow_program_authority(&unsigned_account, &registry),
            Err(RegistryError::MissingRequiredSignature)
        );
    }

    #[test]
    fn test_attack_vector_executable_bypass() {
        let program_id = Pubkey::from_str("11111111111111111111111111111111").unwrap();
        let mut program_lamports = 0;
        let mut program_data = vec![];
        let program_owner = Pubkey::new_unique();
        
        // Create authorized program but not executable
        let non_executable_account = create_test_account_info(
            &program_id,
            true,
            false,
            &mut program_lamports,
            &mut program_data,
            &program_owner,
            false, // NOT executable - attack attempt
            0,
        );
        
        let registry = AuthorityRegistry::new();
        
        // Should fail due to non-executable account
        assert_eq!(
            verify_escrow_program_authority(&non_executable_account, &registry),
            Err(RegistryError::InvalidProgramAccount)
        );
    }

    #[test]
    fn test_multiple_attack_vectors_combined() {
        let registry = AuthorityRegistry::new();
        let mut lamports = 0;
        let mut data = vec![];
        let owner = Pubkey::new_unique();
        
        // Test various attack combinations
        let attack_scenarios = vec![
            // (pubkey, is_signer, is_executable, expected_error)
            (Pubkey::new_unique(), true, true, RegistryError::UnauthorizedProgram),
            (Pubkey::new_unique(), false, true, RegistryError::UnauthorizedProgram),
            (Pubkey::from_str("11111111111111111111111111111111").unwrap(), false, true, RegistryError::MissingRequiredSignature),
            (Pubkey::from_str("11111111111111111111111111111111").unwrap(), true, false, RegistryError::InvalidProgramAccount),
        ];
        
        for (key, is_signer, is_executable, expected_error) in attack_scenarios {
            let account = create_test_account_info(
                &key,
                is_signer,
                false,
                &mut lamports,
                &mut data,
                &owner,
                is_executable,
                0,
            );
            
            assert_eq!(
                verify_escrow_program_authority(&account, &registry),
                Err(expected_error)
            );
        }
    }

    #[test]
    fn test_dos_resistance_mass_registration_attempt() {
        let program_id = Pubkey::new_unique();
        let owner = Pubkey::new_unique();
        let payer = Pubkey::new_unique();
        
        // Attempt to register many servers rapidly
        let mut successful_registrations = 0;
        
        for i in 0..50 {
            let server_key = Pubkey::new_unique();
            let mut server_lamports = 0;
            let mut server_data = vec![0u8; 2048];
            let mut owner_lamports = 0;
            let mut payer_lamports = 1000000;
            let mut system_lamports = 0;
            
            let instruction_data = McpServerRegistryInstruction::RegisterMcpServer {
                server_id: format!("dos-test-{}", i),
                name: format!("DOS Test Server {}", i),
                description: "Testing DOS resistance".to_string(),
                server_version: "1.0.0".to_string(),
                provider_name: None,
                provider_url: None,
                documentation_url: None,
                service_endpoints: vec![],
                supported_protocols: vec!["MCP/1.0".to_string()],
                capabilities: vec![],
                resource_types: vec![],
                tool_categories: vec![],
                security_info_uri: None,
                extended_metadata_uri: None,
                tags: vec![],
            }.try_to_vec().unwrap();
            
            let accounts = vec![
                create_test_account_info(
                    &server_key,
                    false,
                    true,
                    &mut server_lamports,
                    &mut server_data,
                    &system_program::id(),
                    false,
                    0,
                ),
                create_test_account_info(
                    &owner,
                    true,
                    false,
                    &mut owner_lamports,
                    &mut vec![],
                    &system_program::id(),
                    false,
                    0,
                ),
                create_test_account_info(
                    &payer,
                    true,
                    false,
                    &mut payer_lamports,
                    &mut vec![],
                    &system_program::id(),
                    false,
                    0,
                ),
                create_test_account_info(
                    &system_program::id(),
                    false,
                    false,
                    &mut system_lamports,
                    &mut vec![],
                    &system_program::id(),
                    true,
                    0,
                ),
            ];
            
            let result = Processor::process(&program_id, &accounts, &instruction_data);
            if result.is_ok() {
                successful_registrations += 1;
            }
        }
        
        // System should handle all registrations without DOS
        assert_eq!(successful_registrations, 50);
    }

    #[test]
    fn test_reentrancy_protection() {
        let program_id = Pubkey::new_unique();
        let server_key = Pubkey::new_unique();
        let owner = Pubkey::new_unique();
        
        // Create a server with operation_in_progress set
        let mut server_lamports = 1000000;
        let mut server_data = vec![0u8; 2048];
        
        let mut server = McpServerEntryV1 {
            bump: 1,
            registry_version: 1,
            state_version: 1,
            operation_in_progress: true, // Simulating reentrancy
            owner_authority: owner,
            server_id: "test-server".to_string(),
            name: "Test Server".to_string(),
            description: "Test".to_string(),
            server_version: "1.0.0".to_string(),
            provider_name: None,
            provider_url: None,
            documentation_url: None,
            service_endpoints: vec![],
            supported_protocols: vec![],
            capabilities: vec![],
            resource_types: vec![],
            tool_categories: vec![],
            security_info_uri: None,
            status: 1,
            registration_timestamp: 0,
            last_update_timestamp: 0,
            extended_metadata_uri: None,
            tags: vec![],
            token_mint: Pubkey::from_str("11111111111111111111111111111111").unwrap(),
            staked_amount: 0,
            staking_timestamp: 0,
            stake_locked_until: 0,
            staking_tier: 0,
            total_tools_provided: 0,
            total_resources_served: 0,
            successful_operations: 0,
            failed_operations: 0,
            reputation_score: 0,
            quality_ratings: vec![],
            uptime_percentage: 100,
            average_response_time: 0,
            base_access_fee: 0,
            priority_fee_multiplier: 100,
            accepts_token_payment: true,
            service_endpoints_hash: None,
        };
        server.serialize(&mut server_data.as_mut_slice()).unwrap();
        
        // Try to update while operation is in progress
        let instruction_data = McpServerRegistryInstruction::UpdateMcpServerDetails {
            details: McpServerUpdateDetailsInput {
                name: Some("Updated Name".to_string()),
                ..Default::default()
            }
        }.try_to_vec().unwrap();
        
        let accounts = vec![
            create_test_account_info(
                &server_key,
                false,
                true,
                &mut server_lamports,
                &mut server_data,
                &program_id,
                false,
                0,
            ),
            create_test_account_info(
                &owner,
                true,
                false,
                &mut 0,
                &mut vec![],
                &system_program::id(),
                false,
                0,
            ),
        ];
        
        let result = Processor::process(&program_id, &accounts, &instruction_data);
        
        // Should fail due to reentrancy guard
        assert!(result.is_err());
    }

    #[test]
    fn test_state_version_protection() {
        let program_id = Pubkey::new_unique();
        let server_key = Pubkey::new_unique();
        let owner = Pubkey::new_unique();
        
        // Create a server
        let mut server_lamports = 1000000;
        let mut server_data = vec![0u8; 2048];
        
        let server = McpServerEntryV1 {
            bump: 1,
            registry_version: 1,
            state_version: 5, // Current version
            operation_in_progress: false,
            owner_authority: owner,
            server_id: "test-server".to_string(),
            name: "Test Server".to_string(),
            description: "Test".to_string(),
            server_version: "1.0.0".to_string(),
            provider_name: None,
            provider_url: None,
            documentation_url: None,
            service_endpoints: vec![],
            supported_protocols: vec![],
            capabilities: vec![],
            resource_types: vec![],
            tool_categories: vec![],
            security_info_uri: None,
            status: 1,
            registration_timestamp: 0,
            last_update_timestamp: 0,
            extended_metadata_uri: None,
            tags: vec![],
            token_mint: Pubkey::from_str("11111111111111111111111111111111").unwrap(),
            staked_amount: 0,
            staking_timestamp: 0,
            stake_locked_until: 0,
            staking_tier: 0,
            total_tools_provided: 0,
            total_resources_served: 0,
            successful_operations: 0,
            failed_operations: 0,
            reputation_score: 0,
            quality_ratings: vec![],
            uptime_percentage: 100,
            average_response_time: 0,
            base_access_fee: 0,
            priority_fee_multiplier: 100,
            accepts_token_payment: true,
            service_endpoints_hash: None,
        };
        server.serialize(&mut server_data.as_mut_slice()).unwrap();
        
        // Try to update - this should increment state version
        let instruction_data = McpServerRegistryInstruction::UpdateMcpServerDetails {
            details: McpServerUpdateDetailsInput {
                name: Some("Updated Name".to_string()),
                ..Default::default()
            }
        }.try_to_vec().unwrap();
        
        let accounts = vec![
            create_test_account_info(
                &server_key,
                false,
                true,
                &mut server_lamports,
                &mut server_data,
                &program_id,
                false,
                0,
            ),
            create_test_account_info(
                &owner,
                true,
                false,
                &mut 0,
                &mut vec![],
                &system_program::id(),
                false,
                0,
            ),
        ];
        
        let result = Processor::process(&program_id, &accounts, &instruction_data);
        assert!(result.is_ok());
        
        // Verify state version was incremented
        let updated_server = McpServerEntryV1::try_from_slice(&accounts[0].data.borrow()).unwrap();
        assert_eq!(updated_server.state_version, 6);
    }

    #[test]
    fn test_error_propagation_through_layers() {
        let registry = AuthorityRegistry::new();
        let mut lamports = 0;
        let mut data = vec![];
        let owner = Pubkey::new_unique();
        
        // Test unauthorized program
        let unauthorized_account = create_test_account_info(
            &Pubkey::new_unique(),
            true,
            false,
            &mut lamports,
            &mut data,
            &owner,
            true,
            0,
        );
        
        // Verify error type is preserved through the system
        match verify_escrow_program_authority(&unauthorized_account, &registry) {
            Err(RegistryError::UnauthorizedProgram) => {
                // Expected - error properly propagated
            }
            other => panic!("Expected UnauthorizedProgram error, got: {:?}", other),
        }
    }

    #[test]
    fn test_backwards_compatibility_mcp_servers() {
        let program_id = Pubkey::new_unique();
        let server_key = Pubkey::new_unique();
        let owner = Pubkey::new_unique();
        
        // Create server with minimal required fields (backwards compatible)
        let mut server_lamports = 0;
        let mut server_data = vec![0u8; 2048];
        let mut owner_lamports = 0;
        let mut payer_lamports = 1000000;
        let mut system_lamports = 0;
        
        let instruction_data = McpServerRegistryInstruction::RegisterMcpServer {
            server_id: "legacy-server".to_string(),
            name: "Legacy Server".to_string(),
            description: "Backwards compatible server".to_string(),
            server_version: "0.1.0".to_string(),
            provider_name: None,
            provider_url: None,
            documentation_url: None,
            service_endpoints: vec![],
            supported_protocols: vec!["MCP/1.0".to_string()],
            capabilities: vec![],
            resource_types: vec![],
            tool_categories: vec![],
            security_info_uri: None,
            extended_metadata_uri: None,
            tags: vec![],
        }.try_to_vec().unwrap();
        
        let accounts = vec![
            create_test_account_info(
                &server_key,
                false,
                true,
                &mut server_lamports,
                &mut server_data,
                &system_program::id(),
                false,
                0,
            ),
            create_test_account_info(
                &owner,
                true,
                false,
                &mut owner_lamports,
                &mut vec![],
                &system_program::id(),
                false,
                0,
            ),
            create_test_account_info(
                &owner,
                true,
                false,
                &mut payer_lamports,
                &mut vec![],
                &system_program::id(),
                false,
                0,
            ),
            create_test_account_info(
                &system_program::id(),
                false,
                false,
                &mut system_lamports,
                &mut vec![],
                &system_program::id(),
                true,
                0,
            ),
        ];
        
        let result = Processor::process(&program_id, &accounts, &instruction_data);
        
        // Should work with minimal fields
        assert!(result.is_ok());
    }
}