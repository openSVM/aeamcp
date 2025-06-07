#[cfg(test)]
mod authority_verification_tests {
    use super::*;
    use solana_program::{
        account_info::AccountInfo,
        pubkey::Pubkey,
        program_error::ProgramError,
        system_program,
    };
    use aeamcp_common::{
        authority::{verify_escrow_program_authority, verify_ddr_program_authority, AuthorityRegistry},
        error::RegistryError,
    };
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

    // Unit Tests for Authority Registry

    #[test]
    fn test_registry_initialization() {
        let registry = AuthorityRegistry::new();
        
        // Verify authorized programs are correctly initialized
        let escrow_id = Pubkey::from_str("11111111111111111111111111111111").unwrap();
        let ddr_id = Pubkey::from_str("11111111111111111111111111111111").unwrap();
        
        assert!(registry.verify_escrow_authority(&escrow_id));
        assert!(registry.verify_ddr_authority(&ddr_id));
    }

    #[test]
    fn test_registry_unauthorized_programs() {
        let registry = AuthorityRegistry::new();
        
        // Random keys should not be authorized
        let random_key1 = Pubkey::new_unique();
        let random_key2 = Pubkey::new_unique();
        let system_program_id = system_program::id();
        
        assert!(!registry.verify_escrow_authority(&random_key1));
        assert!(!registry.verify_escrow_authority(&random_key2));
        assert!(!registry.verify_escrow_authority(&system_program_id));
        assert!(!registry.verify_ddr_authority(&random_key1));
        assert!(!registry.verify_ddr_authority(&random_key2));
        assert!(!registry.verify_ddr_authority(&system_program_id));
    }

    // Unit Tests for Escrow Authority Verification

    #[test]
    fn test_escrow_authority_verification_success() {
        let mut lamports = 0;
        let mut data = vec![];
        let owner = Pubkey::new_unique();
        
        let escrow_program_id = Pubkey::from_str("11111111111111111111111111111111").unwrap();
        let escrow_account = create_test_account_info(
            &escrow_program_id,
            true,  // is_signer
            false, // is_writable
            &mut lamports,
            &mut data,
            &owner,
            true,  // executable
            0,     // rent_epoch
        );

        let registry = AuthorityRegistry::new();
        
        assert!(verify_escrow_program_authority(&escrow_account, &registry).is_ok());
    }

    #[test]
    fn test_escrow_authority_verification_not_signer() {
        let mut lamports = 0;
        let mut data = vec![];
        let owner = Pubkey::new_unique();
        
        let escrow_program_id = Pubkey::from_str("11111111111111111111111111111111").unwrap();
        let escrow_account = create_test_account_info(
            &escrow_program_id,
            false, // not a signer
            false,
            &mut lamports,
            &mut data,
            &owner,
            true,
            0,
        );

        let registry = AuthorityRegistry::new();
        
        assert_eq!(
            verify_escrow_program_authority(&escrow_account, &registry),
            Err(RegistryError::MissingRequiredSignature)
        );
    }

    #[test]
    fn test_escrow_authority_verification_not_executable() {
        let mut lamports = 0;
        let mut data = vec![];
        let owner = Pubkey::new_unique();
        
        let escrow_program_id = Pubkey::from_str("11111111111111111111111111111111").unwrap();
        let escrow_account = create_test_account_info(
            &escrow_program_id,
            true,
            false,
            &mut lamports,
            &mut data,
            &owner,
            false, // not executable
            0,
        );

        let registry = AuthorityRegistry::new();
        
        assert_eq!(
            verify_escrow_program_authority(&escrow_account, &registry),
            Err(RegistryError::InvalidProgramAccount)
        );
    }

    #[test]
    fn test_escrow_authority_verification_unauthorized() {
        let mut lamports = 0;
        let mut data = vec![];
        let owner = Pubkey::new_unique();
        
        let unauthorized_id = Pubkey::new_unique();
        let escrow_account = create_test_account_info(
            &unauthorized_id,
            true,
            false,
            &mut lamports,
            &mut data,
            &owner,
            true,
            0,
        );

        let registry = AuthorityRegistry::new();
        
        assert_eq!(
            verify_escrow_program_authority(&escrow_account, &registry),
            Err(RegistryError::UnauthorizedProgram)
        );
    }

    // Unit Tests for DDR Authority Verification

    #[test]
    fn test_ddr_authority_verification_success() {
        let mut lamports = 0;
        let mut data = vec![];
        let owner = Pubkey::new_unique();
        
        let ddr_program_id = Pubkey::from_str("11111111111111111111111111111111").unwrap();
        let ddr_account = create_test_account_info(
            &ddr_program_id,
            true,
            false,
            &mut lamports,
            &mut data,
            &owner,
            true,
            0,
        );

        let registry = AuthorityRegistry::new();
        
        assert!(verify_ddr_program_authority(&ddr_account, &registry).is_ok());
    }

    #[test]
    fn test_ddr_authority_verification_not_signer() {
        let mut lamports = 0;
        let mut data = vec![];
        let owner = Pubkey::new_unique();
        
        let ddr_program_id = Pubkey::from_str("11111111111111111111111111111111").unwrap();
        let ddr_account = create_test_account_info(
            &ddr_program_id,
            false, // not a signer
            false,
            &mut lamports,
            &mut data,
            &owner,
            true,
            0,
        );

        let registry = AuthorityRegistry::new();
        
        assert_eq!(
            verify_ddr_program_authority(&ddr_account, &registry),
            Err(RegistryError::MissingRequiredSignature)
        );
    }

    #[test]
    fn test_ddr_authority_verification_not_executable() {
        let mut lamports = 0;
        let mut data = vec![];
        let owner = Pubkey::new_unique();
        
        let ddr_program_id = Pubkey::from_str("11111111111111111111111111111111").unwrap();
        let ddr_account = create_test_account_info(
            &ddr_program_id,
            true,
            false,
            &mut lamports,
            &mut data,
            &owner,
            false, // not executable
            0,
        );

        let registry = AuthorityRegistry::new();
        
        assert_eq!(
            verify_ddr_program_authority(&ddr_account, &registry),
            Err(RegistryError::InvalidProgramAccount)
        );
    }

    #[test]
    fn test_ddr_authority_verification_unauthorized() {
        let mut lamports = 0;
        let mut data = vec![];
        let owner = Pubkey::new_unique();
        
        let unauthorized_id = Pubkey::new_unique();
        let ddr_account = create_test_account_info(
            &unauthorized_id,
            true,
            false,
            &mut lamports,
            &mut data,
            &owner,
            true,
            0,
        );

        let registry = AuthorityRegistry::new();
        
        assert_eq!(
            verify_ddr_program_authority(&ddr_account, &registry),
            Err(RegistryError::UnauthorizedProgram)
        );
    }

    // Edge Cases Tests

    #[test]
    fn test_null_pubkey_verification() {
        let mut lamports = 0;
        let mut data = vec![];
        let owner = Pubkey::new_unique();
        
        // Create a pubkey with all zeros
        let null_pubkey = Pubkey::from_str("11111111111111111111111111111111").unwrap();
        let null_account = create_test_account_info(
            &null_pubkey,
            true,
            false,
            &mut lamports,
            &mut data,
            &owner,
            true,
            0,
        );

        let registry = AuthorityRegistry::new();
        
        // Should succeed as this is our test authorized program
        assert!(verify_escrow_program_authority(&null_account, &registry).is_ok());
    }

    #[test]
    fn test_empty_data_verification() {
        let mut lamports = 0;
        let mut data = vec![]; // Empty data
        let owner = Pubkey::new_unique();
        
        let program_id = Pubkey::from_str("11111111111111111111111111111111").unwrap();
        let account = create_test_account_info(
            &program_id,
            true,
            false,
            &mut lamports,
            &mut data,
            &owner,
            true,
            0,
        );

        let registry = AuthorityRegistry::new();
        
        // Should still succeed with empty data
        assert!(verify_escrow_program_authority(&account, &registry).is_ok());
    }

    #[test]
    fn test_malformed_pubkey_handling() {
        let mut lamports = 0;
        let mut data = vec![];
        let owner = Pubkey::new_unique();
        
        // Use system program ID as unauthorized
        let system_id = system_program::id();
        let system_account = create_test_account_info(
            &system_id,
            true,
            false,
            &mut lamports,
            &mut data,
            &owner,
            true,
            0,
        );

        let registry = AuthorityRegistry::new();
        
        assert_eq!(
            verify_escrow_program_authority(&system_account, &registry),
            Err(RegistryError::UnauthorizedProgram)
        );
    }

    // Integration Tests for CPI Verification

    #[test]
    fn test_cpi_escrow_verification_complete_flow() {
        let mut lamports = 1000000;
        let mut data = vec![0u8; 100];
        let owner = Pubkey::new_unique();
        
        let escrow_program_id = Pubkey::from_str("11111111111111111111111111111111").unwrap();
        let escrow_account = create_test_account_info(
            &escrow_program_id,
            true,
            false,
            &mut lamports,
            &mut data,
            &owner,
            true,
            0,
        );

        let registry = AuthorityRegistry::new();
        
        // Verify full CPI flow
        let result = verify_escrow_program_authority(&escrow_account, &registry);
        assert!(result.is_ok());
        
        // Verify account state remains unchanged
        assert_eq!(**escrow_account.lamports.borrow(), 1000000);
        assert_eq!(escrow_account.data.borrow().len(), 100);
    }

    #[test]
    fn test_cpi_ddr_verification_complete_flow() {
        let mut lamports = 2000000;
        let mut data = vec![1u8; 200];
        let owner = Pubkey::new_unique();
        
        let ddr_program_id = Pubkey::from_str("11111111111111111111111111111111").unwrap();
        let ddr_account = create_test_account_info(
            &ddr_program_id,
            true,
            false,
            &mut lamports,
            &mut data,
            &owner,
            true,
            0,
        );

        let registry = AuthorityRegistry::new();
        
        // Verify full CPI flow
        let result = verify_ddr_program_authority(&ddr_account, &registry);
        assert!(result.is_ok());
        
        // Verify account state remains unchanged
        assert_eq!(**ddr_account.lamports.borrow(), 2000000);
        assert_eq!(ddr_account.data.borrow().len(), 200);
    }

    #[test]
    fn test_malicious_program_rejection() {
        let mut lamports = 0;
        let mut data = vec![];
        let owner = Pubkey::new_unique();
        
        // Create multiple malicious program attempts
        let malicious_programs = vec![
            Pubkey::new_unique(),
            Pubkey::new_unique(),
            Pubkey::new_unique(),
            system_program::id(),
        ];

        let registry = AuthorityRegistry::new();
        
        for malicious_id in malicious_programs {
            let malicious_account = create_test_account_info(
                &malicious_id,
                true,
                false,
                &mut lamports,
                &mut data,
                &owner,
                true,
                0,
            );
            
            assert_eq!(
                verify_escrow_program_authority(&malicious_account, &registry),
                Err(RegistryError::UnauthorizedProgram)
            );
            
            assert_eq!(
                verify_ddr_program_authority(&malicious_account, &registry),
                Err(RegistryError::UnauthorizedProgram)
            );
        }
    }

    #[test]
    fn test_all_error_conditions() {
        let mut lamports = 0;
        let mut data = vec![];
        let owner = Pubkey::new_unique();
        let registry = AuthorityRegistry::new();
        
        // Test all possible error conditions for escrow
        let test_cases = vec![
            (false, true, Pubkey::from_str("11111111111111111111111111111111").unwrap(), RegistryError::MissingRequiredSignature),
            (true, false, Pubkey::from_str("11111111111111111111111111111111").unwrap(), RegistryError::InvalidProgramAccount),
            (true, true, Pubkey::new_unique(), RegistryError::UnauthorizedProgram),
        ];
        
        for (is_signer, is_executable, key, expected_error) in test_cases {
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

    // End-to-End Security Tests

    #[test]
    fn test_e2e_attack_unauthorized_program() {
        let mut lamports = 1000000;
        let mut data = vec![0u8; 100];
        let owner = Pubkey::new_unique();
        
        // Attacker creates a fake program
        let attacker_program = Pubkey::new_unique();
        let attacker_account = create_test_account_info(
            &attacker_program,
            true,
            true, // writable to simulate attack
            &mut lamports,
            &mut data,
            &owner,
            true,
            0,
        );

        let registry = AuthorityRegistry::new();
        
        // Attack should fail
        let escrow_result = verify_escrow_program_authority(&attacker_account, &registry);
        assert_eq!(escrow_result, Err(RegistryError::UnauthorizedProgram));
        
        let ddr_result = verify_ddr_program_authority(&attacker_account, &registry);
        assert_eq!(ddr_result, Err(RegistryError::UnauthorizedProgram));
        
        // Verify no state changes occurred
        assert_eq!(**attacker_account.lamports.borrow(), 1000000);
    }

    #[test]
    fn test_e2e_authority_bypass_attempt() {
        let mut lamports = 0;
        let mut data = vec![];
        let owner = Pubkey::new_unique();
        
        // Attempt 1: Try to bypass with non-signer authorized program
        let authorized_id = Pubkey::from_str("11111111111111111111111111111111").unwrap();
        let bypass_account1 = create_test_account_info(
            &authorized_id,
            false, // not signed
            false,
            &mut lamports,
            &mut data,
            &owner,
            true,
            0,
        );

        let registry = AuthorityRegistry::new();
        
        assert_eq!(
            verify_escrow_program_authority(&bypass_account1, &registry),
            Err(RegistryError::MissingRequiredSignature)
        );
        
        // Attempt 2: Try to bypass with non-executable authorized program
        let bypass_account2 = create_test_account_info(
            &authorized_id,
            true,
            false,
            &mut lamports,
            &mut data,
            &owner,
            false, // not executable
            0,
        );
        
        assert_eq!(
            verify_escrow_program_authority(&bypass_account2, &registry),
            Err(RegistryError::InvalidProgramAccount)
        );
    }

    #[test]
    fn test_e2e_error_propagation() {
        let mut lamports = 0;
        let mut data = vec![];
        let owner = Pubkey::new_unique();
        let registry = AuthorityRegistry::new();
        
        // Test that errors properly propagate through the system
        let unauthorized_id = Pubkey::new_unique();
        let account = create_test_account_info(
            &unauthorized_id,
            true,
            false,
            &mut lamports,
            &mut data,
            &owner,
            true,
            0,
        );
        
        // Verify specific error types are preserved
        match verify_escrow_program_authority(&account, &registry) {
            Err(RegistryError::UnauthorizedProgram) => {
                // Expected error
            }
            _ => panic!("Expected UnauthorizedProgram error"),
        }
        
        match verify_ddr_program_authority(&account, &registry) {
            Err(RegistryError::UnauthorizedProgram) => {
                // Expected error
            }
            _ => panic!("Expected UnauthorizedProgram error"),
        }
    }

    #[test]
    fn test_e2e_rollback_on_verification_failure() {
        let mut lamports_original = 5000000;
        let mut data_original = vec![42u8; 50];
        let owner = Pubkey::new_unique();
        
        // Clone original values for comparison
        let lamports_before = lamports_original;
        let data_before = data_original.clone();
        
        // Create unauthorized account
        let unauthorized_id = Pubkey::new_unique();
        let account = create_test_account_info(
            &unauthorized_id,
            true,
            true, // writable
            &mut lamports_original,
            &mut data_original,
            &owner,
            true,
            0,
        );

        let registry = AuthorityRegistry::new();
        
        // Attempt verification (should fail)
        let result = verify_escrow_program_authority(&account, &registry);
        assert!(result.is_err());
        
        // Verify no state changes occurred (rollback)
        assert_eq!(**account.lamports.borrow(), lamports_before);
        assert_eq!(*account.data.borrow(), data_before);
    }
}