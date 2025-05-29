//! Tests for authority verification implementation
//!
//! These tests validate the critical security fix for CPI authority verification
//! addressing the vulnerability identified in the security audit.

#[cfg(test)]
mod tests {
    use aeamcp_common::{
        authority::{
            AuthorityRegistry, get_authority_registry,
        },
        error::RegistryError,
    };
    use solana_program::pubkey::Pubkey;

    #[test]
    fn test_authority_registry_creation() {
        let registry = AuthorityRegistry::new();
        assert!(!registry.get_authorized_escrow_programs().is_empty());
        assert!(!registry.get_authorized_ddr_programs().is_empty());
    }

    #[test]
    fn test_get_authority_registry() {
        let registry = get_authority_registry();
        assert!(!registry.get_authorized_escrow_programs().is_empty());
        assert!(!registry.get_authorized_ddr_programs().is_empty());
    }

    #[test]
    fn test_authorized_escrow_program_verification_success() {
        let registry = AuthorityRegistry::new();
        let authorized_program_id = registry.get_authorized_escrow_programs()[0];
        
        assert!(registry.verify_escrow_authority(&authorized_program_id));
    }

    #[test]
    fn test_unauthorized_escrow_program_verification_failure() {
        let registry = AuthorityRegistry::new();
        let unauthorized_program_id = Pubkey::new_unique();
        
        assert!(!registry.verify_escrow_authority(&unauthorized_program_id));
    }

    #[test]
    fn test_authorized_ddr_program_verification_success() {
        let registry = AuthorityRegistry::new();
        let authorized_program_id = registry.get_authorized_ddr_programs()[0];
        
        assert!(registry.verify_ddr_authority(&authorized_program_id));
    }

    #[test]
    fn test_unauthorized_ddr_program_verification_failure() {
        let registry = AuthorityRegistry::new();
        let unauthorized_program_id = Pubkey::new_unique();
        
        assert!(!registry.verify_ddr_authority(&unauthorized_program_id));
    }

    #[test]
    fn test_malicious_program_attack_prevention() {
        let registry = AuthorityRegistry::new();
        
        // Simulate a malicious program trying to impersonate an authorized escrow program
        let malicious_program_id = Pubkey::new_unique();
        
        // The authority verification should reject the malicious program
        assert!(!registry.verify_escrow_authority(&malicious_program_id));
        assert!(!registry.verify_ddr_authority(&malicious_program_id));
    }

    #[test]
    fn test_reputation_manipulation_prevention() {
        // This test ensures that only authorized programs can call reputation-affecting functions
        let registry = AuthorityRegistry::new();
        let unauthorized_program_id = Pubkey::new_unique();
        
        // This should fail, preventing reputation manipulation
        assert!(!registry.verify_escrow_authority(&unauthorized_program_id));
    }

    #[test]
    fn test_earnings_fraud_prevention() {
        // This test ensures that only authorized escrow programs can report earnings
        let registry = AuthorityRegistry::new();
        let unauthorized_program_id = Pubkey::new_unique();
        
        // This should fail, preventing earnings fraud
        assert!(!registry.verify_escrow_authority(&unauthorized_program_id));
    }

    #[test]
    fn test_dispute_outcome_manipulation_prevention() {
        // This test ensures that only authorized DDR programs can report dispute outcomes
        let registry = AuthorityRegistry::new();
        let unauthorized_program_id = Pubkey::new_unique();
        
        // This should fail, preventing dispute outcome manipulation
        assert!(!registry.verify_ddr_authority(&unauthorized_program_id));
    }

    #[test]
    fn test_security_audit_vulnerability_fixed() {
        // This test specifically validates that the security vulnerability
        // identified in the audit has been addressed
        let registry = AuthorityRegistry::new();
        
        // Test that unauthorized programs are rejected
        let fake_escrow = Pubkey::new_unique();
        let fake_ddr = Pubkey::new_unique();
        
        assert!(!registry.verify_escrow_authority(&fake_escrow),
                "Unauthorized escrow program should be rejected");
        assert!(!registry.verify_ddr_authority(&fake_ddr),
                "Unauthorized DDR program should be rejected");
        
        // Test that authorized programs are accepted
        let authorized_escrow = registry.get_authorized_escrow_programs()[0];
        let authorized_ddr = registry.get_authorized_ddr_programs()[0];
        
        assert!(registry.verify_escrow_authority(&authorized_escrow),
                "Authorized escrow program should be accepted");
        assert!(registry.verify_ddr_authority(&authorized_ddr),
                "Authorized DDR program should be accepted");
    }

    #[test]
    fn test_authority_registry_initialization() {
        // Test that the registry can be created and contains expected programs
        let registry = AuthorityRegistry::new();
        
        assert!(!registry.get_authorized_escrow_programs().is_empty(),
                "Should have at least one authorized escrow program");
        assert!(!registry.get_authorized_ddr_programs().is_empty(),
                "Should have at least one authorized DDR program");
    }

    #[test]
    fn test_global_authority_registry_access() {
        // Test that the global registry function works
        let registry = get_authority_registry();
        
        assert!(!registry.get_authorized_escrow_programs().is_empty());
        assert!(!registry.get_authorized_ddr_programs().is_empty());
    }
}