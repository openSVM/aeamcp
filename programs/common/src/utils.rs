//! Utility functions for the Solana AI Registries

use solana_program::{
    account_info::AccountInfo,
    clock::Clock,
    program_error::ProgramError,
    pubkey::Pubkey,
    sysvar::Sysvar,
    msg,
};
use serde_json::Value;
use crate::{constants::*, error::RegistryError};

/// Validate a string field
pub fn validate_string_field(
    value: &str,
    max_len: usize,
    allow_empty: bool,
    error: RegistryError,
) -> Result<(), RegistryError> {
    if !allow_empty && value.is_empty() {
        return Err(error);
    }
    if value.len() > max_len {
        return Err(error);
    }
    Ok(())
}

/// Validate an optional string field
pub fn validate_optional_string_field(
    value: &Option<String>,
    max_len: usize,
    error: RegistryError,
) -> Result<(), RegistryError> {
    if let Some(val) = value {
        if val.len() > max_len {
            return Err(error);
        }
    }
    Ok(())
}

/// Validate vector length
pub fn validate_vec_length<T>(
    vec: &[T],
    max_len: usize,
    error: RegistryError,
) -> Result<(), RegistryError> {
    if vec.len() > max_len {
        return Err(error);
    }
    Ok(())
}

/// Get agent PDA
pub fn get_agent_pda(agent_id: &str, program_id: &Pubkey) -> (Pubkey, u8) {
    Pubkey::find_program_address(
        &[AGENT_REGISTRY_PDA_SEED, agent_id.as_bytes()],
        program_id,
    )
}

/// Get MCP server PDA
pub fn get_mcp_server_pda(server_id: &str, program_id: &Pubkey) -> (Pubkey, u8) {
    Pubkey::find_program_address(
        &[MCP_SERVER_REGISTRY_PDA_SEED, server_id.as_bytes()],
        program_id,
    )
}

/// Verify PDA derivation
pub fn verify_pda(
    account_info: &AccountInfo,
    seeds: &[&[u8]],
    program_id: &Pubkey,
) -> Result<u8, ProgramError> {
    let (expected_pda, bump) = Pubkey::find_program_address(seeds, program_id);
    if account_info.key != &expected_pda {
        return Err(RegistryError::InvalidPda.into());
    }
    Ok(bump)
}

/// Verify account owner
pub fn verify_account_owner(
    account_info: &AccountInfo,
    expected_owner: &Pubkey,
) -> Result<(), ProgramError> {
    if account_info.owner != expected_owner {
        return Err(ProgramError::IncorrectProgramId);
    }
    Ok(())
}

/// Verify signer authority
pub fn verify_signer_authority(
    account_info: &AccountInfo,
    expected_authority: &Pubkey,
) -> Result<(), ProgramError> {
    if !account_info.is_signer {
        return Err(ProgramError::MissingRequiredSignature);
    }
    if account_info.key != expected_authority {
        return Err(RegistryError::Unauthorized.into());
    }
    Ok(())
}

/// Verify rent exemption
pub fn verify_rent_exemption(
    account_info: &AccountInfo,
    required_lamports: u64,
) -> Result<(), ProgramError> {
    if account_info.lamports() < required_lamports {
        return Err(ProgramError::InsufficientFunds);
    }
    Ok(())
}

/// Get current timestamp
pub fn get_current_timestamp() -> Result<i64, ProgramError> {
    let clock = Clock::get()?;
    Ok(clock.unix_timestamp)
}

/// Emit an event (simplified version for native programs)
pub fn emit_event(event_name: &str, data: &Value) {
    msg!("EVENT: {} {}", event_name, data.to_string());
}


#[cfg(test)]
mod tests {
    use super::*;

    #[test]
    fn test_validate_string_field() {
        // Valid string
        assert!(validate_string_field("test", 10, false, RegistryError::InvalidAgentIdLength).is_ok());

        // Empty string not allowed
        assert_eq!(
            validate_string_field("", 10, false, RegistryError::InvalidAgentIdLength),
            Err(RegistryError::InvalidAgentIdLength)
        );

        // Empty string allowed
        assert!(validate_string_field("", 10, true, RegistryError::InvalidAgentIdLength).is_ok());

        // Too long string
        assert_eq!(
            validate_string_field("toolongstring", 5, false, RegistryError::InvalidAgentIdLength),
            Err(RegistryError::InvalidAgentIdLength)
        );
    }

    #[test]
    fn test_validate_optional_string_field() {
        // None value
        assert!(validate_optional_string_field(&None, 10, RegistryError::InvalidAgentIdLength).is_ok());

        // Valid Some value
        assert!(validate_optional_string_field(&Some("test".to_string()), 10, RegistryError::InvalidAgentIdLength).is_ok());

        // Too long Some value
        assert_eq!(
            validate_optional_string_field(&Some("toolongstring".to_string()), 5, RegistryError::InvalidAgentIdLength),
            Err(RegistryError::InvalidAgentIdLength)
        );
    }

    #[test]
    fn test_validate_vec_length() {
        let vec = vec![1, 2, 3];
        
        // Valid length
        assert!(validate_vec_length(&vec, 5, RegistryError::TooManyAgentTags).is_ok());

        // Too long
        assert_eq!(
            validate_vec_length(&vec, 2, RegistryError::TooManyAgentTags),
            Err(RegistryError::TooManyAgentTags)
        );
    }

    #[test]
    fn test_pda_generation() {
        let program_id = Pubkey::new_unique();
        let agent_id = "test-agent";

        let (pda1, bump1) = get_agent_pda(agent_id, &program_id);
        let (pda2, bump2) = get_agent_pda(agent_id, &program_id);

        // Should be deterministic
        assert_eq!(pda1, pda2);
        assert_eq!(bump1, bump2);
    }

}