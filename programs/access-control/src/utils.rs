use anchor_lang::prelude::*;
use crate::error::AccessControlError;
use crate::state::{AccessControlAccount, PermissionGrant, NonceTracker};

/// Utility functions for access control operations

/// Calculate required space for access control account based on number of grants
pub fn calculate_access_control_space(num_grants: usize) -> Result<usize, AccessControlError> {
    if num_grants > crate::state::MAX_GRANTS_PER_RESOURCE {
        return Err(AccessControlError::TooManyPermissions);
    }
    
    let base_space = 8 + // discriminator
        (4 + crate::state::MAX_RESOURCE_ID_LENGTH) + // resource_id
        32 + // resource_program
        32 + // owner
        8 + // global_nonce_counter
        1 + // delegation_chain_limit
        8 + // created_at
        8 + // updated_at
        1; // bump
    
    let grants_space = 4 + (num_grants * PermissionGrant::SPACE);
    
    Ok(base_space + grants_space)
}

/// Generate PDA for access control account
pub fn get_access_control_pda(
    resource_program: &Pubkey,
    resource_id: &str,
    program_id: &Pubkey,
) -> (Pubkey, u8) {
    Pubkey::find_program_address(
        &[
            b"access_control",
            resource_program.as_ref(),
            resource_id.as_bytes(),
        ],
        program_id,
    )
}

/// Generate PDA for nonce tracker
pub fn get_nonce_tracker_pda(
    resource_program: &Pubkey,
    resource_id: &str,
    wallet: &Pubkey,
    program_id: &Pubkey,
) -> (Pubkey, u8) {
    Pubkey::find_program_address(
        &[
            b"nonce_tracker",
            resource_program.as_ref(),
            resource_id.as_bytes(),
            wallet.as_ref(),
        ],
        program_id,
    )
}

/// Generate PDA for permission index
pub fn get_permission_index_pda(
    resource_program: &Pubkey,
    resource_id: &str,
    wallet: &Pubkey,
    program_id: &Pubkey,
) -> (Pubkey, u8) {
    Pubkey::find_program_address(
        &[
            b"permission_index",
            resource_program.as_ref(),
            resource_id.as_bytes(),
            wallet.as_ref(),
        ],
        program_id,
    )
}

/// Find permission grant for a specific wallet
pub fn find_permission_grant<'a>(
    grants: &'a [PermissionGrant],
    wallet: &Pubkey,
) -> Option<&'a PermissionGrant> {
    grants.iter().find(|grant| grant.wallet == *wallet)
}

/// Find mutable permission grant for a specific wallet
pub fn find_permission_grant_mut<'a>(
    grants: &'a mut [PermissionGrant],
    wallet: &Pubkey,
) -> Option<&'a mut PermissionGrant> {
    grants.iter_mut().find(|grant| grant.wallet == *wallet)
}

/// Remove permission grant for a specific wallet
pub fn remove_permission_grant(
    grants: &mut Vec<PermissionGrant>,
    wallet: &Pubkey,
) -> bool {
    if let Some(pos) = grants.iter().position(|grant| grant.wallet == *wallet) {
        grants.remove(pos);
        true
    } else {
        false
    }
}

/// Remove all grants delegated by a specific wallet
pub fn remove_delegated_grants(
    grants: &mut Vec<PermissionGrant>,
    delegator: &Pubkey,
) -> usize {
    let initial_len = grants.len();
    grants.retain(|grant| grant.granted_by != *delegator);
    initial_len - grants.len()
}

/// Check if wallet has specific permission
pub fn has_permission(
    grants: &[PermissionGrant],
    wallet: &Pubkey,
    operation: &str,
    current_time: i64,
) -> bool {
    if let Some(grant) = find_permission_grant(grants, wallet) {
        !grant.is_expired(current_time) && grant.allows_operation(operation)
    } else {
        false
    }
}

/// Get effective permissions for a wallet (including delegation chain)
pub fn get_effective_permissions(
    grants: &[PermissionGrant],
    wallet: &Pubkey,
    current_time: i64,
) -> Vec<String> {
    let mut permissions = Vec::new();
    
    if let Some(grant) = find_permission_grant(grants, wallet) {
        if !grant.is_expired(current_time) {
            permissions.extend(grant.operations.clone());
        }
    }
    
    // Remove duplicates
    permissions.sort();
    permissions.dedup();
    
    permissions
}

/// Prune expired grants and return number of grants removed
pub fn prune_expired_grants(
    grants: &mut Vec<PermissionGrant>,
    current_time: i64,
    max_to_prune: Option<usize>,
) -> usize {
    let initial_len = grants.len();
    let mut pruned = 0;
    
    grants.retain(|grant| {
        if let Some(max) = max_to_prune {
            if pruned >= max {
                return true;
            }
        }
        
        if grant.is_expired(current_time) {
            pruned += 1;
            false
        } else {
            true
        }
    });
    
    initial_len - grants.len()
}

/// Validate and update account timestamps
pub fn update_account_timestamp(account: &mut AccessControlAccount) -> Result<(), AccessControlError> {
    let current_time = Clock::get()?.unix_timestamp;
    account.updated_at = current_time;
    Ok(())
}

/// Create a new permission grant with validation
pub fn create_permission_grant(
    wallet: Pubkey,
    operations: Vec<String>,
    expiry: Option<i64>,
    can_delegate: bool,
    granted_by: Pubkey,
    delegation_depth: u8,
    max_delegation_depth: u8,
) -> Result<PermissionGrant, AccessControlError> {
    // Validate operations
    crate::validation::validate_permissions(&operations)?;
    
    let current_time = Clock::get()?.unix_timestamp;
    
    // Validate expiry time
    if let Some(expiry_time) = expiry {
        if expiry_time <= current_time {
            return Err(AccessControlError::PermissionExpired);
        }
    }
    
    // Validate delegation depth
    if delegation_depth > max_delegation_depth {
        return Err(AccessControlError::DelegationChainTooDeep);
    }
    
    Ok(PermissionGrant {
        wallet,
        operations,
        granted_at: current_time,
        expires_at: expiry,
        can_delegate,
        granted_by,
        delegation_depth,
        max_delegation_depth,
    })
}

/// Update nonce tracker with concurrency protection
pub fn update_nonce_tracker(
    nonce_tracker: &mut NonceTracker,
    new_nonce: u64,
) -> Result<(), AccessControlError> {
    let current_time = Clock::get()?.unix_timestamp;
    
    // Validate nonce security
    crate::security::validate_nonce_security(
        &nonce_tracker.nonce_window,
        new_nonce,
        current_time,
        nonce_tracker.last_update_timestamp,
    )?;
    
    // Update nonce window
    nonce_tracker.nonce_window.mark_nonce_used(new_nonce)?;
    
    // Update timestamps and sequence
    nonce_tracker.last_update_timestamp = current_time;
    nonce_tracker.update_sequence = nonce_tracker.update_sequence
        .checked_add(1)
        .ok_or(AccessControlError::NonceOverflow)?;
    
    Ok(())
}

/// Estimate CPI compute cost for operations
pub fn estimate_cpi_compute_cost(operation: &str, num_accounts: usize) -> u32 {
    let base_cost = 5000; // Base CPI overhead
    let account_cost = num_accounts as u32 * 1000; // Cost per account
    let operation_cost = match operation {
        "verify_signature" => 10000, // Signature verification cost
        "grant_permission" => 5000,  // Permission grant cost
        "revoke_permission" => 3000, // Permission revocation cost
        "execute_operation" => 15000, // Operation execution cost
        _ => 2000, // Default operation cost
    };
    
    base_cost + account_cost + operation_cost
}

/// Performance monitoring helpers
pub struct PerformanceMonitor {
    start_time: i64,
    operation: String,
}

impl PerformanceMonitor {
    pub fn new(operation: String) -> Result<Self, AccessControlError> {
        let start_time = Clock::get()?.unix_timestamp;
        Ok(Self { start_time, operation })
    }
    
    pub fn finish(&self) -> Result<i64, AccessControlError> {
        let end_time = Clock::get()?.unix_timestamp;
        let duration = end_time - self.start_time;
        
        // Log performance metrics
        msg!("Performance: {} took {} seconds", self.operation, duration);
        
        Ok(duration)
    }
}

/// Benchmark helper for CPI operations
pub fn benchmark_operation<F, R>(operation_name: &str, operation: F) -> Result<R, AccessControlError>
where
    F: FnOnce() -> Result<R, AccessControlError>,
{
    let monitor = PerformanceMonitor::new(operation_name.to_string())?;
    let result = operation()?;
    monitor.finish()?;
    Ok(result)
}

/// Memory-efficient operations for large datasets
pub trait MemoryEfficient {
    fn memory_footprint(&self) -> usize;
    fn optimize_memory(&mut self) -> Result<usize, AccessControlError>;
}

impl MemoryEfficient for AccessControlAccount {
    fn memory_footprint(&self) -> usize {
        std::mem::size_of_val(self) + 
        self.resource_id.len() + 
        self.permission_grants.len() * PermissionGrant::SPACE
    }
    
    fn optimize_memory(&mut self) -> Result<usize, AccessControlError> {
        let initial_size = self.memory_footprint();
        
        // Remove expired grants
        let current_time = Clock::get()?.unix_timestamp;
        let pruned = prune_expired_grants(&mut self.permission_grants, current_time, None);
        
        // Optimize string storage
        self.resource_id.shrink_to_fit();
        
        let final_size = self.memory_footprint();
        
        msg!("Memory optimization: {} bytes saved, {} grants pruned", 
             initial_size - final_size, pruned);
        
        Ok(initial_size - final_size)
    }
}

#[cfg(test)]
mod tests {
    use super::*;
    
    #[test]
    fn test_calculate_access_control_space() {
        let space = calculate_access_control_space(10).unwrap();
        assert!(space > 0);
        
        let too_many = calculate_access_control_space(1000);
        assert!(too_many.is_err());
    }
    
    #[test]
    fn test_pda_generation() {
        let program_id = Pubkey::default();
        let resource_program = Pubkey::default();
        let resource_id = "test_resource";
        
        let (pda, _bump) = get_access_control_pda(&resource_program, resource_id, &program_id);
        assert_ne!(pda, Pubkey::default());
    }
    
    #[test]
    fn test_permission_grant_creation() {
        let wallet = Pubkey::default();
        let operations = vec!["read".to_string(), "write".to_string()];
        let granted_by = Pubkey::default();
        
        let grant = create_permission_grant(
            wallet,
            operations,
            None,
            false,
            granted_by,
            0,
            5,
        );
        
        assert!(grant.is_ok());
    }
}