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
        constants::{AGENT_FEE_BPS, MAX_DESCRIPTION_LENGTH, MIN_AGENT_STAKE},
        error::RegistryError,
        token_utils,
    };
    use crate::{
        instruction::AgentRegistryInstruction,
        processor::Processor,
        state::{Agent, Service, ServiceStatus, DisputeResolution},
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

    fn create_token_account(owner: &Pubkey, amount: u64) -> (Pubkey, Vec<u8>) {
        let account_key = Pubkey::new_unique();
        let mut account_data = vec![0u8; TokenAccount::LEN];
        let token_account = TokenAccount {
            mint: Pubkey::from_str("11111111111111111111111111111111").unwrap(),
            owner: *owner,
            amount,
            delegate: None,
            state: spl_token::state::AccountState::Initialized,
            is_native: None,
            delegated_amount: 0,
            close_authority: None,
        };
        TokenAccount::pack(token_account, &mut account_data).unwrap();
        (account_key, account_data)
    }

    fn create_mint_account() -> (Pubkey, Vec<u8>) {
        let mint_key = Pubkey::from_str("11111111111111111111111111111111").unwrap();
        let mut mint_data = vec![0u8; Mint::LEN];
        let mint = Mint {
            mint_authority: Some(Pubkey::new_unique()),
            supply: 1_000_000_000_000,
            decimals: 9,
            is_initialized: true,
            freeze_authority: None,
        };
        Mint::pack(mint, &mut mint_data).unwrap();
        (mint_key, mint_data)
    }

    // Security Integration Tests

    #[test]
    fn test_complete_service_flow_with_security() {
        let program_id = Pubkey::new_unique();
        let mut rent_lamports = 0;
        let mut clock_lamports = 0;
        
        // Setup accounts
        let provider = Pubkey::new_unique();
        let consumer = Pubkey::new_unique();
        let agent_key = Pubkey::new_unique();
        let service_key = Pubkey::new_unique();
        let escrow_program = Pubkey::from_str("11111111111111111111111111111111").unwrap();
        let ddr_program = Pubkey::from_str("11111111111111111111111111111111").unwrap();
        
        // Create agent
        let mut agent_lamports = 1_000_000;
        let mut agent_data = vec![0u8; 1000];
        let agent = Agent {
            owner: provider,
            stake_amount: MIN_AGENT_STAKE,
            reputation_score: 100,
            total_services: 0,
            successful_services: 0,
            failed_services: 0,
            created_at: 0,
            last_active: 0,
            metadata: vec![],
            is_active: true,
        };
        agent.serialize(&mut agent_data.as_mut_slice()).unwrap();
        
        // Create service
        let mut service_lamports = 1_000_000;
        let mut service_data = vec![0u8; 2000];
        let service = Service {
            consumer,
            provider,
            agent: agent_key,
            description: "Test service".to_string(),
            amount: 100_000,
            fee_amount: 1_000,
            status: ServiceStatus::Active,
            created_at: 0,
            completed_at: None,
            dispute_resolution: None,
            metadata: vec![],
        };
        service.serialize(&mut service_data.as_mut_slice()).unwrap();
        
        // Setup token accounts
        let (provider_token_key, mut provider_token_data) = create_token_account(&provider, 1_000_000);
        let (consumer_token_key, mut consumer_token_data) = create_token_account(&consumer, 1_000_000);
        let (agent_token_key, mut agent_token_data) = create_token_account(&agent_key, 0);
        let (fee_vault_key, mut fee_vault_data) = create_token_account(&program_id, 0);
        let (mint_key, mut mint_data) = create_mint_account();
        
        let mut provider_token_lamports = 0;
        let mut consumer_token_lamports = 0;
        let mut agent_token_lamports = 0;
        let mut fee_vault_lamports = 0;
        let mut mint_lamports = 0;
        
        // Setup escrow program (authorized)
        let mut escrow_lamports = 0;
        let mut escrow_data = vec![];
        let escrow_owner = Pubkey::new_unique();
        
        // Setup clock
        let clock = Clock {
            slot: 100,
            epoch_start_timestamp: 0,
            epoch: 10,
            leader_schedule_epoch: 11,
            unix_timestamp: 1234567890,
        };
        let mut clock_data = clock.try_to_vec().unwrap();
        
        // Setup rent
        let rent = Rent::default();
        let mut rent_data = rent.try_to_vec().unwrap();
        
        // Create accounts
        let accounts = vec![
            create_test_account_info(
                &service_key,
                false,
                true,
                &mut service_lamports,
                &mut service_data,
                &program_id,
                false,
                0,
            ),
            create_test_account_info(
                &agent_key,
                false,
                true,
                &mut agent_lamports,
                &mut agent_data,
                &program_id,
                false,
                0,
            ),
            create_test_account_info(
                &consumer,
                true,
                false,
                &mut 0,
                &mut vec![],
                &system_program::id(),
                false,
                0,
            ),
            create_test_account_info(
                &provider,
                true,
                false,
                &mut 0,
                &mut vec![],
                &system_program::id(),
                false,
                0,
            ),
            create_test_account_info(
                &provider_token_key,
                false,
                true,
                &mut provider_token_lamports,
                &mut provider_token_data,
                &spl_token::id(),
                false,
                0,
            ),
            create_test_account_info(
                &consumer_token_key,
                false,
                true,
                &mut consumer_token_lamports,
                &mut consumer_token_data,
                &spl_token::id(),
                false,
                0,
            ),
            create_test_account_info(
                &agent_token_key,
                false,
                true,
                &mut agent_token_lamports,
                &mut agent_token_data,
                &spl_token::id(),
                false,
                0,
            ),
            create_test_account_info(
                &fee_vault_key,
                false,
                true,
                &mut fee_vault_lamports,
                &mut fee_vault_data,
                &spl_token::id(),
                false,
                0,
            ),
            create_test_account_info(
                &mint_key,
                false,
                false,
                &mut mint_lamports,
                &mut mint_data,
                &spl_token::id(),
                false,
                0,
            ),
            create_test_account_info(
                &escrow_program,
                true, // is_signer
                false,
                &mut escrow_lamports,
                &mut escrow_data,
                &escrow_owner,
                true, // executable
                0,
            ),
            create_test_account_info(
                &spl_token::id(),
                false,
                false,
                &mut 0,
                &mut vec![],
                &system_program::id(),
                true,
                0,
            ),
            create_test_account_info(
                &sysvar::clock::id(),
                false,
                false,
                &mut clock_lamports,
                &mut clock_data,
                &sysvar::id(),
                false,
                0,
            ),
        ];
        
        // Complete service with security check
        let instruction_data = AgentRegistryInstruction::CompleteService.try_to_vec().unwrap();
        let result = Processor::process(&program_id, &accounts, &instruction_data);
        
        // Should succeed with authorized escrow program
        assert!(result.is_ok(), "Complete service should succeed with authorized program");
        
        // Verify service status updated
        let updated_service = Service::try_from_slice(&accounts[0].data.borrow()).unwrap();
        assert_eq!(updated_service.status, ServiceStatus::Completed);
    }

    #[test]
    fn test_dispute_resolution_with_authority_checks() {
        let program_id = Pubkey::new_unique();
        let mut rent_lamports = 0;
        let mut clock_lamports = 0;
        
        // Setup accounts
        let provider = Pubkey::new_unique();
        let consumer = Pubkey::new_unique();
        let agent_key = Pubkey::new_unique();
        let service_key = Pubkey::new_unique();
        let ddr_program = Pubkey::from_str("11111111111111111111111111111111").unwrap();
        
        // Create service in disputed state
        let mut service_lamports = 1_000_000;
        let mut service_data = vec![0u8; 2000];
        let mut service = Service {
            consumer,
            provider,
            agent: agent_key,
            description: "Test service".to_string(),
            amount: 100_000,
            fee_amount: 1_000,
            status: ServiceStatus::Disputed,
            created_at: 0,
            completed_at: None,
            dispute_resolution: Some(DisputeResolution {
                resolver: ddr_program,
                resolution_fee: 500,
                resolved_at: None,
                outcome: None,
            }),
            metadata: vec![],
        };
        service.serialize(&mut service_data.as_mut_slice()).unwrap();
        
        // Setup DDR program (authorized)
        let mut ddr_lamports = 0;
        let mut ddr_data = vec![];
        let ddr_owner = Pubkey::new_unique();
        
        // Setup clock
        let clock = Clock {
            slot: 100,
            epoch_start_timestamp: 0,
            epoch: 10,
            leader_schedule_epoch: 11,
            unix_timestamp: 1234567890,
        };
        let mut clock_data = clock.try_to_vec().unwrap();
        
        // Create accounts
        let accounts = vec![
            create_test_account_info(
                &service_key,
                false,
                true,
                &mut service_lamports,
                &mut service_data,
                &program_id,
                false,
                0,
            ),
            create_test_account_info(
                &ddr_program,
                true, // is_signer
                false,
                &mut ddr_lamports,
                &mut ddr_data,
                &ddr_owner,
                true, // executable
                0,
            ),
            create_test_account_info(
                &sysvar::clock::id(),
                false,
                false,
                &mut clock_lamports,
                &mut clock_data,
                &sysvar::id(),
                false,
                0,
            ),
        ];
        
        // Resolve dispute with security check
        let instruction_data = AgentRegistryInstruction::ResolveDispute { 
            resolution_amount: 80_000 
        }.try_to_vec().unwrap();
        let result = Processor::process(&program_id, &accounts, &instruction_data);
        
        // Should succeed with authorized DDR program
        assert!(result.is_ok(), "Dispute resolution should succeed with authorized program");
        
        // Verify dispute resolved
        let updated_service = Service::try_from_slice(&accounts[0].data.borrow()).unwrap();
        assert_eq!(updated_service.status, ServiceStatus::Resolved);
    }

    #[test]
    fn test_attack_vector_program_impersonation() {
        let program_id = Pubkey::new_unique();
        
        // Setup malicious program trying to impersonate escrow
        let malicious_program = Pubkey::new_unique();
        let provider = Pubkey::new_unique();
        let consumer = Pubkey::new_unique();
        let agent_key = Pubkey::new_unique();
        let service_key = Pubkey::new_unique();
        
        // Create service
        let mut service_lamports = 1_000_000;
        let mut service_data = vec![0u8; 2000];
        let service = Service {
            consumer,
            provider,
            agent: agent_key,
            description: "Test service".to_string(),
            amount: 100_000,
            fee_amount: 1_000,
            status: ServiceStatus::Active,
            created_at: 0,
            completed_at: None,
            dispute_resolution: None,
            metadata: vec![],
        };
        service.serialize(&mut service_data.as_mut_slice()).unwrap();
        
        // Setup malicious program
        let mut malicious_lamports = 0;
        let mut malicious_data = vec![];
        let malicious_owner = Pubkey::new_unique();
        
        // Create minimal accounts for the attack
        let accounts = vec![
            create_test_account_info(
                &service_key,
                false,
                true,
                &mut service_lamports,
                &mut service_data,
                &program_id,
                false,
                0,
            ),
            create_test_account_info(
                &malicious_program,
                true, // is_signer (attacker controls this)
                false,
                &mut malicious_lamports,
                &mut malicious_data,
                &malicious_owner,
                true, // executable
                0,
            ),
        ];
        
        // Attempt to complete service with malicious program
        let instruction_data = AgentRegistryInstruction::CompleteService.try_to_vec().unwrap();
        let result = Processor::process(&program_id, &accounts, &instruction_data);
        
        // Should fail due to unauthorized program
        match result {
            Err(ProgramError::Custom(e)) => {
                assert_eq!(e, RegistryError::UnauthorizedProgram as u32);
            }
            _ => panic!("Expected UnauthorizedProgram error"),
        }
        
        // Verify service state unchanged
        let service_after = Service::try_from_slice(&accounts[0].data.borrow()).unwrap();
        assert_eq!(service_after.status, ServiceStatus::Active);
    }

    #[test]
    fn test_attack_vector_authority_bypass() {
        let program_id = Pubkey::new_unique();
        
        // Try various bypass attempts
        let authorized_program = Pubkey::from_str("11111111111111111111111111111111").unwrap();
        let service_key = Pubkey::new_unique();
        
        let mut service_lamports = 1_000_000;
        let mut service_data = vec![0u8; 2000];
        let service = Service {
            consumer: Pubkey::new_unique(),
            provider: Pubkey::new_unique(),
            agent: Pubkey::new_unique(),
            description: "Test service".to_string(),
            amount: 100_000,
            fee_amount: 1_000,
            status: ServiceStatus::Active,
            created_at: 0,
            completed_at: None,
            dispute_resolution: None,
            metadata: vec![],
        };
        service.serialize(&mut service_data.as_mut_slice()).unwrap();
        
        // Attempt 1: Authorized program but not signed
        let mut escrow_lamports = 0;
        let mut escrow_data = vec![];
        let escrow_owner = Pubkey::new_unique();
        
        let accounts = vec![
            create_test_account_info(
                &service_key,
                false,
                true,
                &mut service_lamports,
                &mut service_data,
                &program_id,
                false,
                0,
            ),
            create_test_account_info(
                &authorized_program,
                false, // NOT signed - bypass attempt
                false,
                &mut escrow_lamports,
                &mut escrow_data,
                &escrow_owner,
                true,
                0,
            ),
        ];
        
        let instruction_data = AgentRegistryInstruction::CompleteService.try_to_vec().unwrap();
        let result = Processor::process(&program_id, &accounts, &instruction_data);
        
        // Should fail due to missing signature
        assert!(result.is_err());
        match result {
            Err(ProgramError::Custom(e)) => {
                assert_eq!(e, RegistryError::MissingRequiredSignature as u32);
            }
            _ => panic!("Expected MissingRequiredSignature error"),
        }
    }

    #[test]
    fn test_attack_vector_reentrancy_with_security() {
        let program_id = Pubkey::new_unique();
        
        // Setup for reentrancy attempt
        let escrow_program = Pubkey::from_str("11111111111111111111111111111111").unwrap();
        let service_key = Pubkey::new_unique();
        let attacker = Pubkey::new_unique();
        
        // Create service that attacker will try to manipulate
        let mut service_lamports = 1_000_000;
        let mut service_data = vec![0u8; 2000];
        let mut service = Service {
            consumer: attacker,
            provider: Pubkey::new_unique(),
            agent: Pubkey::new_unique(),
            description: "Test service".to_string(),
            amount: 1_000_000, // Large amount
            fee_amount: 10_000,
            status: ServiceStatus::Active,
            created_at: 0,
            completed_at: None,
            dispute_resolution: None,
            metadata: vec![],
        };
        service.serialize(&mut service_data.as_mut_slice()).unwrap();
        
        // Setup escrow program
        let mut escrow_lamports = 0;
        let mut escrow_data = vec![];
        let escrow_owner = Pubkey::new_unique();
        
        // First call accounts
        let accounts = vec![
            create_test_account_info(
                &service_key,
                false,
                true,
                &mut service_lamports,
                &mut service_data,
                &program_id,
                false,
                0,
            ),
            create_test_account_info(
                &escrow_program,
                true,
                false,
                &mut escrow_lamports,
                &mut escrow_data,
                &escrow_owner,
                true,
                0,
            ),
        ];
        
        // First call to complete service
        let instruction_data = AgentRegistryInstruction::CompleteService.try_to_vec().unwrap();
        let result1 = Processor::process(&program_id, &accounts, &instruction_data);
        
        // Should succeed first time
        assert!(result1.is_ok());
        
        // Verify status changed
        let service_after = Service::try_from_slice(&accounts[0].data.borrow()).unwrap();
        assert_eq!(service_after.status, ServiceStatus::Completed);
        
        // Attempt reentrancy - try to complete again
        let result2 = Processor::process(&program_id, &accounts, &instruction_data);
        
        // Should fail on second attempt
        assert!(result2.is_err());
    }

    #[test]
    fn test_attack_vector_dos_resistance() {
        let program_id = Pubkey::new_unique();
        
        // Create many services to test DOS resistance
        let mut services = Vec::new();
        let provider = Pubkey::new_unique();
        let consumer = Pubkey::new_unique();
        let agent = Pubkey::new_unique();
        
        // Create 100 services
        for i in 0..100 {
            let service_key = Pubkey::new_unique();
            let mut service_lamports = 1_000_000;
            let mut service_data = vec![0u8; 2000];
            
            let service = Service {
                consumer,
                provider,
                agent,
                description: format!("Service {}", i),
                amount: 1000 + i as u64,
                fee_amount: 10 + i as u64,
                status: ServiceStatus::Active,
                created_at: i as i64,
                completed_at: None,
                dispute_resolution: None,
                metadata: vec![],
            };
            service.serialize(&mut service_data.as_mut_slice()).unwrap();
            
            services.push((service_key, service_lamports, service_data));
        }
        
        // Verify system can handle many operations without DOS
        let escrow_program = Pubkey::from_str("11111111111111111111111111111111").unwrap();
        let mut escrow_lamports = 0;
        let mut escrow_data = vec![];
        let escrow_owner = Pubkey::new_unique();
        
        // Process multiple services
        for (service_key, mut service_lamports, mut service_data) in services.iter_mut().take(10) {
            let accounts = vec![
                create_test_account_info(
                    service_key,
                    false,
                    true,
                    service_lamports,
                    service_data,
                    &program_id,
                    false,
                    0,
                ),
                create_test_account_info(
                    &escrow_program,
                    true,
                    false,
                    &mut escrow_lamports,
                    &mut escrow_data,
                    &escrow_owner,
                    true,
                    0,
                ),
            ];
            
            let instruction_data = AgentRegistryInstruction::CompleteService.try_to_vec().unwrap();
            let result = Processor::process(&program_id, &accounts, &instruction_data);
            
            // All should process successfully
            assert!(result.is_ok());
        }
    }

    #[test]
    fn test_regression_existing_functionality() {
        let program_id = Pubkey::new_unique();
        
        // Test that basic registration still works with security
        let owner = Pubkey::new_unique();
        let agent_key = Pubkey::new_unique();
        let agent_token_key = Pubkey::new_unique();
        let fee_vault_key = Pubkey::new_unique();
        let mint_key = Pubkey::from_str("11111111111111111111111111111111").unwrap();
        
        let mut agent_lamports = 0;
        let mut agent_data = vec![0u8; 1000];
        let mut owner_token_lamports = 0;
        let mut agent_token_lamports = 0;
        let mut fee_vault_lamports = 0;
        let mut mint_lamports = 0;
        let mut system_lamports = 0;
        let mut rent_lamports = 0;
        
        let (_, mut owner_token_data) = create_token_account(&owner, MIN_AGENT_STAKE + 1_000_000);
        let (_, mut agent_token_data) = create_token_account(&agent_key, 0);
        let (_, mut fee_vault_data) = create_token_account(&program_id, 0);
        let (_, mut mint_data) = create_mint_account();
        
        let rent = Rent::default();
        let mut rent_data = rent.try_to_vec().unwrap();
        
        let accounts = vec![
            create_test_account_info(
                &agent_key,
                false,
                true,
                &mut agent_lamports,
                &mut agent_data,
                &system_program::id(),
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
            create_test_account_info(
                &owner_token_key,
                false,
                true,
                &mut owner_token_lamports,
                &mut owner_token_data,
                &spl_token::id(),
                false,
                0,
            ),
            create_test_account_info(
                &agent_token_key,
                false,
                true,
                &mut agent_token_lamports,
                &mut agent_token_data,
                &spl_token::id(),
                false,
                0,
            ),
            create_test_account_info(
                &fee_vault_key,
                false,
                true,
                &mut fee_vault_lamports,
                &mut fee_vault_data,
                &spl_token::id(),
                false,
                0,
            ),
            create_test_account_info(
                &mint_key,
                false,
                false,
                &mut mint_lamports,
                &mut mint_data,
                &spl_token::id(),
                false,
                0,
            ),
            create_test_account_info(
                &spl_token::id(),
                false,
                false,
                &mut 0,
                &mut vec![],
                &system_program::id(),
                true,
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
            create_test_account_info(
                &sysvar::rent::id(),
                false,
                false,
                &mut rent_lamports,
                &mut rent_data,
                &sysvar::id(),
                false,
                0,
            ),
        ];
        
        // Register agent
        let instruction_data = AgentRegistryInstruction::RegisterAgent {
            stake_amount: MIN_AGENT_STAKE,
            metadata: vec![1, 2, 3],
        }.try_to_vec().unwrap();
        
        let result = Processor::process(&program_id, &accounts, &instruction_data);
        assert!(result.is_ok(), "Agent registration should still work");
        
        // Verify agent created
        let agent = Agent::try_from_slice(&accounts[0].data.borrow()).unwrap();
        assert_eq!(agent.owner, owner);
        assert_eq!(agent.stake_amount, MIN_AGENT_STAKE);
        assert!(agent.is_active);
    }

    #[test]
    fn test_backwards_compatibility() {
        // Test that old service formats still work
        let program_id = Pubkey::new_unique();
        let service_key = Pubkey::new_unique();
        let escrow_program = Pubkey::from_str("11111111111111111111111111111111").unwrap();
        
        // Create service with minimal data (backwards compatible)
        let mut service_lamports = 1_000_000;
        let mut service_data = vec![0u8; 2000];
        let service = Service {
            consumer: Pubkey::new_unique(),
            provider: Pubkey::new_unique(),
            agent: Pubkey::new_unique(),
            description: "Legacy service".to_string(),
            amount: 50_000,
            fee_amount: 500,
            status: ServiceStatus::Active,
            created_at: 0,
            completed_at: None,
            dispute_resolution: None,
            metadata: vec![], // Empty metadata for backwards compatibility
        };
        service.serialize(&mut service_data.as_mut_slice()).unwrap();
        
        let mut escrow_lamports = 0;
        let mut escrow_data = vec![];
        let escrow_owner = Pubkey::new_unique();
        
        let accounts = vec![
            create_test_account_info(
                &service_key,
                false,
                true,
                &mut service_lamports,
                &mut service_data,
                &program_id,
                false,
                0,
            ),
            create_test_account_info(
                &escrow_program,
                true,
                false,
                &mut escrow_lamports,
                &mut escrow_data,
                &escrow_owner,
                true,
                0,
            ),
        ];
        
        let instruction_data = AgentRegistryInstruction::CompleteService.try_to_vec().unwrap();
        let result = Processor::process(&program_id, &accounts, &instruction_data);
        
        // Should work with legacy format
        assert!(result.is_ok());
    }

    #[test]
    fn test_performance_no_regression() {
        use std::time::Instant;
        
        let program_id = Pubkey::new_unique();
        let escrow_program = Pubkey::from_str("11111111111111111111111111111111").unwrap();
        
        // Measure time for operations with security checks
        let mut total_time = std::time::Duration::new(0, 0);
        
        for _ in 0..100 {
            let service_key = Pubkey::new_unique();
            let mut service_lamports = 1_000_000;
            let mut service_data = vec![0u8; 2000];
            
            let service = Service {
                consumer: Pubkey::new_unique(),
                provider: Pubkey::new_unique(),
                agent: Pubkey::new_unique(),
                description: "Performance test".to_string(),
                amount: 100_000,
                fee_amount: 1_000,
                status: ServiceStatus::Active,
                created_at: 0,
                completed_at: None,
                dispute_resolution: None,
                metadata: vec![],
            };
            service.serialize(&mut service_data.as_mut_slice()).unwrap();
            
            let mut escrow_lamports = 0;
            let mut escrow_data = vec![];
            let escrow_owner = Pubkey::new_unique();
            
            let accounts = vec![
                create_test_account_info(
                    &service_key,
                    false,
                    true,
                    &mut service_lamports,
                    &mut service_data,
                    &program_id,
                    false,
                    0,
                ),
                create_test_account_info(
                    &escrow_program,
                    true,
                    false,
                    &mut escrow_lamports,
                    &mut escrow_data,
                    &escrow_owner,
                    true,
                    0,
                ),
            ];
            
            let instruction_data = AgentRegistryInstruction::CompleteService.try_to_vec().unwrap();
            
            let start = Instant::now();
            let _ = Processor::process(&program_id, &accounts, &instruction_data);
            total_time += start.elapsed();
        }
        
        // Average time should be reasonable (< 1ms per operation)
        let avg_time = total_time / 100;
        assert!(avg_time.as_micros() < 1000, "Performance regression detected");
    }

    #[test]
    fn test_edge_case_zero_amount_service() {
        let program_id = Pubkey::new_unique();
        let service_key = Pubkey::new_unique();
        
        // Create service with zero amount
        let mut service_lamports = 1_000_000;
        let mut service_data = vec![0u8; 2000];
        let service = Service {
            consumer: Pubkey::new_unique(),
            provider: Pubkey::new_unique(),
            agent: Pubkey::new_unique(),
            description: "Free service".to_string(),
            amount: 0, // Zero amount
            fee_amount: 0,
            status: ServiceStatus::Active,
            created_at: 0,
            completed_at: None,
            dispute_resolution: None,
            metadata: vec![],
        };
        service.serialize(&mut service_data.as_mut_slice()).unwrap();
        
        let escrow_program = Pubkey::from_str("11111111111111111111111111111111").unwrap();
        let mut escrow_lamports = 0;
        let mut escrow_data = vec![];
        let escrow_owner = Pubkey::new_unique();
        
        let accounts = vec![
            create_test_account_info(
                &service_key,
                false,
                true,
                &mut service_lamports,
                &mut service_data,
                &program_id,
                false,
                0,
            ),
            create_test_account_info(
                &escrow_program,
                true,
                false,
                &mut escrow_lamports,
                &mut escrow_data,
                &escrow_owner,
                true,
                0,
            ),
        ];
        
        let instruction_data = AgentRegistryInstruction::CompleteService.try_to_vec().unwrap();
        let result = Processor::process(&program_id, &accounts, &instruction_data);
        
        // Should handle zero amount gracefully
        assert!(result.is_ok());
    }

    #[test]
    fn test_edge_case_max_values() {
        let program_id = Pubkey::new_unique();
        let service_key = Pubkey::new_unique();
        
        // Create service with maximum values
        let mut service_lamports = u64::MAX / 2;
        let mut service_data = vec![0u8; 2000];
        let service = Service {
            consumer: Pubkey::new_unique(),
            provider: Pubkey::new_unique(),
            agent: Pubkey::new_unique(),
            description: "A".repeat(MAX_DESCRIPTION_LENGTH), // Max length description
            amount: u64::MAX / 10, // Large amount
            fee_amount: u64::MAX / 100,
            status: ServiceStatus::Active,
            created_at: i64::MAX / 2,
            completed_at: None,
            dispute_resolution: None,
            metadata: vec![0xff; 100], // Large metadata
        };
        service.serialize(&mut service_data.as_mut_slice()).unwrap();
        
        let escrow_program = Pubkey::from_str("11111111111111111111111111111111").unwrap();
        let mut escrow_lamports = 0;
        let mut escrow_data = vec![];
        let escrow_owner = Pubkey::new_unique();
        
        let accounts = vec![
            create_test_account_info(
                &service_key,
                false,
                true,
                &mut service_lamports,
                &mut service_data,
                &program_id,
                false,
                0,
            ),
            create_test_account_info(
                &escrow_program,
                true,
                false,
                &mut escrow_lamports,
                &mut escrow_data,
                &escrow_owner,
                true,
                0,
            ),
        ];
        
        let instruction_data = AgentRegistryInstruction::CompleteService.try_to_vec().unwrap();
        let result = Processor::process(&program_id, &accounts, &instruction_data);
        
        // Should handle maximum values
        assert!(result.is_ok());
    }
}