//! Authority Registry System for verifying external program permissions
//! 
//! This module implements a centralized authority registry to manage authorized 
//! external programs for Cross-Program Invocation (CPI) calls, addressing the
//! critical security vulnerability identified in the security audit.

use solana_program::{
    account_info::AccountInfo,
    pubkey::Pubkey,
    program_error::ProgramError,
    msg,
};
use crate::error::RegistryError;

/// Authority Registry manages authorized external programs for CPI calls
pub struct AuthorityRegistry {
    /// List of authorized escrow program IDs
    authorized_escrow_programs: Vec<Pubkey>,
    /// List of authorized DDR (Dispute Resolution) program IDs  
    authorized_ddr_programs: Vec<Pubkey>,
}

impl AuthorityRegistry {
    /// Create a new AuthorityRegistry with predefined authorized programs
    pub fn new() -> Self {
        Self {
            authorized_escrow_programs: vec![
                // TODO: Replace with actual escrow program IDs from production
                crate::constants::AUTHORIZED_ESCROW_PROGRAM_ID
                    .parse()
                    .expect("Invalid escrow program ID"),
                // Add more authorized escrow programs as needed
            ],
            authorized_ddr_programs: vec![
                // TODO: Replace with actual DDR program IDs from production
                crate::constants::AUTHORIZED_DDR_PROGRAM_ID
                    .parse()
                    .expect("Invalid DDR program ID"),
                // Add more authorized DDR programs as needed
            ],
        }
    }

    /// Verify if a program ID is authorized for escrow operations
    pub fn verify_escrow_authority(&self, program_id: &Pubkey) -> bool {
        self.authorized_escrow_programs.contains(program_id)
    }

    /// Verify if a program ID is authorized for DDR operations
    pub fn verify_ddr_authority(&self, program_id: &Pubkey) -> bool {
        self.authorized_ddr_programs.contains(program_id)
    }

    /// Get all authorized escrow program IDs
    pub fn get_authorized_escrow_programs(&self) -> &[Pubkey] {
        &self.authorized_escrow_programs
    }

    /// Get all authorized DDR program IDs
    pub fn get_authorized_ddr_programs(&self) -> &[Pubkey] {
        &self.authorized_ddr_programs
    }
}

impl Default for AuthorityRegistry {
    fn default() -> Self {
        Self::new()
    }
}

/// Verify escrow program authority for CPI calls
/// 
/// This function implements comprehensive authority verification:
/// 1. Checks if the account is a signer
/// 2. Verifies the program ID is in the authorized list
/// 3. Ensures the account is executable (valid program account)
pub fn verify_escrow_program_authority(
    escrow_program_info: &AccountInfo,
    authority_registry: &AuthorityRegistry,
) -> Result<(), RegistryError> {
    // Check if account is a signer
    if !escrow_program_info.is_signer {
        msg!("Escrow program authority verification failed: missing signature");
        return Err(RegistryError::MissingRequiredSignature);
    }

    // Verify program ID is in authorized list
    if !authority_registry.verify_escrow_authority(escrow_program_info.key) {
        msg!(
            "Escrow program authority verification failed: unauthorized program ID: {}",
            escrow_program_info.key
        );
        return Err(RegistryError::UnauthorizedProgram);
    }

    // Additional verification: Check if account is executable (program account)
    if !escrow_program_info.executable {
        msg!(
            "Escrow program authority verification failed: account not executable: {}",
            escrow_program_info.key
        );
        return Err(RegistryError::InvalidProgramAccount);
    }

    msg!(
        "Escrow program authority verification successful: {}",
        escrow_program_info.key
    );
    Ok(())
}

/// Verify DDR program authority for CPI calls
/// 
/// This function implements comprehensive authority verification:
/// 1. Checks if the account is a signer
/// 2. Verifies the program ID is in the authorized list
/// 3. Ensures the account is executable (valid program account)
pub fn verify_ddr_program_authority(
    ddr_program_info: &AccountInfo,
    authority_registry: &AuthorityRegistry,
) -> Result<(), RegistryError> {
    // Check if account is a signer
    if !ddr_program_info.is_signer {
        msg!("DDR program authority verification failed: missing signature");
        return Err(RegistryError::MissingRequiredSignature);
    }

    // Verify program ID is in authorized list
    if !authority_registry.verify_ddr_authority(ddr_program_info.key) {
        msg!(
            "DDR program authority verification failed: unauthorized program ID: {}",
            ddr_program_info.key
        );
        return Err(RegistryError::UnauthorizedProgram);
    }

    // Additional verification: Check if account is executable (program account)
    if !ddr_program_info.executable {
        msg!(
            "DDR program authority verification failed: account not executable: {}",
            ddr_program_info.key
        );
        return Err(RegistryError::InvalidProgramAccount);
    }

    msg!(
        "DDR program authority verification successful: {}",
        ddr_program_info.key
    );
    Ok(())
}

/// Global authority registry instance
/// 
/// This provides a singleton-like access pattern for the authority registry
/// throughout the program execution.
pub fn get_authority_registry() -> AuthorityRegistry {
    AuthorityRegistry::new()
}

#[cfg(test)]
mod tests {
    use super::*;
    use solana_program::pubkey::Pubkey;

    #[test]
    fn test_authority_registry_creation() {
        let registry = AuthorityRegistry::new();
        assert!(!registry.authorized_escrow_programs.is_empty());
        assert!(!registry.authorized_ddr_programs.is_empty());
    }

    #[test]
    fn test_escrow_authority_verification() {
        let registry = AuthorityRegistry::new();
        
        // Test with authorized program
        let authorized_program = registry.authorized_escrow_programs[0];
        assert!(registry.verify_escrow_authority(&authorized_program));
        
        // Test with unauthorized program
        let unauthorized_program = Pubkey::new_unique();
        assert!(!registry.verify_escrow_authority(&unauthorized_program));
    }

    #[test]
    fn test_ddr_authority_verification() {
        let registry = AuthorityRegistry::new();
        
        // Test with authorized program
        let authorized_program = registry.authorized_ddr_programs[0];
        assert!(registry.verify_ddr_authority(&authorized_program));
        
        // Test with unauthorized program
        let unauthorized_program = Pubkey::new_unique();
        assert!(!registry.verify_ddr_authority(&unauthorized_program));
    }

    #[test]
    fn test_get_authorized_programs() {
        let registry = AuthorityRegistry::new();
        
        let escrow_programs = registry.get_authorized_escrow_programs();
        let ddr_programs = registry.get_authorized_ddr_programs();
        
        assert!(!escrow_programs.is_empty());
        assert!(!ddr_programs.is_empty());
    }
}