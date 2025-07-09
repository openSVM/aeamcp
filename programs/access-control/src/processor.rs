use anchor_lang::prelude::*;
use crate::error::AccessControlError;
use crate::state::{AccessControlAccount, NonceTracker, PermissionIndex, NonceWindow, OperationFlags};
use crate::validation::comprehensive_signature_validation;
use crate::security::{perform_security_audit, SecurityMonitor, SecurityConfig, AuditEntry};
use crate::utils::{
    update_account_timestamp, create_permission_grant, update_nonce_tracker,
    find_permission_grant, remove_permission_grant, remove_delegated_grants,
    has_permission, prune_expired_grants as prune_grants_util, benchmark_operation
};

/// Initialize access control for a resource
pub fn initialize_access_control(
    ctx: Context<crate::InitializeAccessControl>,
    resource_id: String,
    resource_program: Pubkey,
    initial_owner: Pubkey,
) -> Result<()> {
    benchmark_operation("initialize_access_control", || {
        // Validate resource ID
        crate::validation::validate_resource_id(&resource_id)?;
        
        let access_control_account = &mut ctx.accounts.access_control_account;
        let current_time = Clock::get()?.unix_timestamp;
        
        // Initialize the account
        access_control_account.resource_id = resource_id;
        access_control_account.resource_program = resource_program;
        access_control_account.owner = initial_owner;
        access_control_account.global_nonce_counter = 0;
        access_control_account.delegation_chain_limit = crate::state::MAX_DELEGATION_DEPTH;
        access_control_account.created_at = current_time;
        access_control_account.updated_at = current_time;
        access_control_account.permission_grants = Vec::new();
        access_control_account.bump = ctx.bumps.access_control_account;
        
        crate::audit_log!("INFO", "Access control initialized for resource: {}", access_control_account.resource_id);
        
        Ok(())
    })
}

/// Verify signature only (separated from execution for auditability)
pub fn verify_signature(
    ctx: Context<crate::VerifySignature>,
    resource_id: String,
    operation: String,
    signature: [u8; 64],
    message: Vec<u8>,
    nonce: u64,
    timestamp: i64,
) -> Result<()> {
    benchmark_operation("verify_signature", || {
        let access_control_account = &mut ctx.accounts.access_control_account;
        let nonce_tracker = &mut ctx.accounts.nonce_tracker;
        let signer = &ctx.accounts.signer;
        
        // Security audit
        let audit_result = perform_security_audit(
            &resource_id,
            &operation,
            &signer.key(),
            nonce,
            timestamp,
            &access_control_account.permission_grants,
        )?;
        
        // Check if this is a high-risk operation
        if audit_result.overall_risk >= crate::security::RiskLevel::High {
            crate::audit_log!("WARNING", "High-risk operation detected: {} by {}", operation, signer.key());
        }
        
        // Comprehensive signature validation
        let signer_key_bytes: [u8; 32] = signer.key().to_bytes();
        comprehensive_signature_validation(
            &signature,
            &signer_key_bytes,
            &resource_id,
            &operation,
            nonce,
            timestamp,
            Some(&message),
        )?;
        
        // Check nonce validity and mark as used
        if !nonce_tracker.nonce_window.is_nonce_valid(nonce) {
            return Err(AccessControlError::NonceAlreadyUsed);
        }
        
        // Update nonce tracker
        update_nonce_tracker(nonce_tracker, nonce)?;
        
        // Check permissions
        let current_time = Clock::get()?.unix_timestamp;
        if !has_permission(&access_control_account.permission_grants, &signer.key(), &operation, current_time) {
            // Check if signer is the owner
            if access_control_account.owner != signer.key() {
                return Err(AccessControlError::PermissionDenied);
            }
        }
        
        // Update account timestamp
        update_account_timestamp(access_control_account)?;
        
        // Audit log
        crate::audit_log!("INFO", "Signature verified for operation: {} on resource: {} by wallet: {}", 
                         operation, resource_id, signer.key());
        
        Ok(())
    })
}

/// Execute operation after signature verification
pub fn execute_operation(
    ctx: Context<crate::ExecuteOperation>,
    resource_id: String,
    operation: String,
    target_program: Pubkey,
    target_instruction: Vec<u8>,
) -> Result<()> {
    benchmark_operation("execute_operation", || {
        let access_control_account = &ctx.accounts.access_control_account;
        let authority = &ctx.accounts.authority;
        
        // Verify authority has permission (signature should have been verified separately)
        let current_time = Clock::get()?.unix_timestamp;
        if !has_permission(&access_control_account.permission_grants, &authority.key(), &operation, current_time) {
            if access_control_account.owner != authority.key() {
                return Err(AccessControlError::PermissionDenied);
            }
        }
        
        // Estimate compute cost
        let estimated_cost = crate::utils::estimate_cpi_compute_cost(&operation, ctx.accounts.to_account_infos().len());
        msg!("Estimated CPI compute cost: {}", estimated_cost);
        
        // Execute the target instruction via CPI
        let instruction = anchor_lang::solana_program::instruction::Instruction {
            program_id: target_program,
            accounts: vec![], // Would need to be populated based on target instruction
            data: target_instruction,
        };
        
        // Note: In a real implementation, you'd need to properly construct the accounts
        // based on the target instruction requirements
        
        crate::audit_log!("INFO", "Operation executed: {} on resource: {} by wallet: {}", 
                         operation, resource_id, authority.key());
        
        Ok(())
    })
}

/// Grant permission to another wallet with delegation controls
pub fn grant_permission(
    ctx: Context<crate::GrantPermission>,
    resource_id: String,
    target_wallet: Pubkey,
    permissions: Vec<String>,
    expiry: Option<i64>,
    can_delegate: bool,
    max_delegation_depth: u8,
) -> Result<()> {
    benchmark_operation("grant_permission", || {
        let access_control_account = &mut ctx.accounts.access_control_account;
        let permission_index = &mut ctx.accounts.permission_index;
        let authority = &ctx.accounts.authority;
        
        // Check if authority can grant permissions
        let current_time = Clock::get()?.unix_timestamp;
        let authority_grant = find_permission_grant(&access_control_account.permission_grants, &authority.key());
        
        // Validate the granter's permissions
        if access_control_account.owner != authority.key() {
            if let Some(grant) = authority_grant {
                if !grant.can_delegate || grant.is_expired(current_time) {
                    return Err(AccessControlError::CannotDelegate);
                }
            } else {
                return Err(AccessControlError::PermissionDenied);
            }
        }
        
        // Determine delegation depth
        let delegation_depth = if access_control_account.owner == authority.key() {
            0
        } else if let Some(grant) = authority_grant {
            grant.delegation_depth + 1
        } else {
            return Err(AccessControlError::InvalidDelegationChain);
        };
        
        // Create the new permission grant
        let new_grant = create_permission_grant(
            target_wallet,
            permissions.clone(),
            expiry,
            can_delegate,
            authority.key(),
            delegation_depth,
            max_delegation_depth,
        )?;
        
        // Validate delegation security
        crate::security::validate_delegation_security(
            &access_control_account.permission_grants,
            &new_grant,
            &authority.key(),
        )?;
        
        // Check if grant already exists and update/replace
        if let Some(existing_grant) = find_permission_grant(&access_control_account.permission_grants, &target_wallet) {
            // Remove existing grant
            remove_permission_grant(&mut access_control_account.permission_grants, &target_wallet);
        }
        
        // Add the new grant
        access_control_account.permission_grants.push(new_grant);
        
        // Update permission index for efficient lookups
        permission_index.resource_id = resource_id.clone();
        permission_index.wallet = target_wallet;
        permission_index.grant_index = (access_control_account.permission_grants.len() - 1) as u8;
        permission_index.updated_at = current_time;
        permission_index.bump = ctx.bumps.permission_index;
        
        // Set operation flags for quick access
        let mut flags = OperationFlags::new();
        for permission in &permissions {
            match permission.as_str() {
                "read" => flags.set_permission(OperationFlags::READ),
                "write" => flags.set_permission(OperationFlags::WRITE),
                "execute" => flags.set_permission(OperationFlags::EXECUTE),
                "transfer" => flags.set_permission(OperationFlags::TRANSFER),
                "delegate" => flags.set_permission(OperationFlags::DELEGATE),
                "admin" => flags.set_permission(OperationFlags::ADMIN),
                _ => {}, // Custom permissions
            }
        }
        permission_index.operation_flags = flags;
        
        // Update account timestamp
        update_account_timestamp(access_control_account)?;
        
        crate::audit_log!("INFO", "Permission granted to wallet: {} for resource: {} by: {}", 
                         target_wallet, resource_id, authority.key());
        
        Ok(())
    })
}

/// Revoke permissions with delegation cleanup
pub fn revoke_permission(
    ctx: Context<crate::RevokePermission>,
    resource_id: String,
    target_wallet: Pubkey,
    revoke_delegated: bool,
) -> Result<()> {
    benchmark_operation("revoke_permission", || {
        let access_control_account = &mut ctx.accounts.access_control_account;
        let authority = &ctx.accounts.authority;
        
        // Check if authority can revoke permissions
        if access_control_account.owner != authority.key() {
            let current_time = Clock::get()?.unix_timestamp;
            if !has_permission(&access_control_account.permission_grants, &authority.key(), "admin", current_time) {
                return Err(AccessControlError::PermissionDenied);
            }
        }
        
        // Remove the grant
        let removed = remove_permission_grant(&mut access_control_account.permission_grants, &target_wallet);
        
        if !removed {
            return Err(AccessControlError::ResourceNotFound);
        }
        
        // Remove delegated grants if requested
        if revoke_delegated {
            let delegated_removed = remove_delegated_grants(&mut access_control_account.permission_grants, &target_wallet);
            crate::audit_log!("INFO", "Removed {} delegated grants from wallet: {}", delegated_removed, target_wallet);
        }
        
        // Update account timestamp
        update_account_timestamp(access_control_account)?;
        
        crate::audit_log!("INFO", "Permission revoked for wallet: {} on resource: {} by: {}", 
                         target_wallet, resource_id, authority.key());
        
        Ok(())
    })
}

/// Transfer ownership
pub fn transfer_ownership(
    ctx: Context<crate::TransferOwnership>,
    resource_id: String,
    new_owner: Pubkey,
) -> Result<()> {
    benchmark_operation("transfer_ownership", || {
        let access_control_account = &mut ctx.accounts.access_control_account;
        let current_owner = &ctx.accounts.current_owner;
        
        // Verify current owner
        if access_control_account.owner != current_owner.key() {
            return Err(AccessControlError::Unauthorized);
        }
        
        // Transfer ownership
        let old_owner = access_control_account.owner;
        access_control_account.owner = new_owner;
        
        // Update account timestamp
        update_account_timestamp(access_control_account)?;
        
        crate::audit_log!("INFO", "Ownership transferred from: {} to: {} for resource: {}", 
                         old_owner, new_owner, resource_id);
        
        Ok(())
    })
}

/// Prune expired grants to reclaim space
pub fn prune_expired_grants(
    ctx: Context<crate::PruneExpiredGrants>,
    resource_id: String,
    max_grants_to_prune: u8,
) -> Result<()> {
    benchmark_operation("prune_expired_grants", || {
        let access_control_account = &mut ctx.accounts.access_control_account;
        let authority = &ctx.accounts.authority;
        
        // Check if authority can prune grants (any authorized user can help clean up)
        let current_time = Clock::get()?.unix_timestamp;
        if access_control_account.owner != authority.key() {
            if !has_permission(&access_control_account.permission_grants, &authority.key(), "admin", current_time) {
                return Err(AccessControlError::PermissionDenied);
            }
        }
        
        // Prune expired grants
        let pruned = prune_grants_util(
            &mut access_control_account.permission_grants,
            current_time,
            Some(max_grants_to_prune as usize),
        );
        
        // Update account timestamp
        update_account_timestamp(access_control_account)?;
        
        crate::audit_log!("INFO", "Pruned {} expired grants from resource: {} by: {}", 
                         pruned, resource_id, authority.key());
        
        Ok(())
    })
}

/// Update nonce safely with concurrency protection
pub fn update_nonce(
    ctx: Context<crate::UpdateNonce>,
    resource_id: String,
    new_nonce: u64,
) -> Result<()> {
    benchmark_operation("update_nonce", || {
        let nonce_tracker = &mut ctx.accounts.nonce_tracker;
        let signer = &ctx.accounts.signer;
        
        // Update nonce with security validation
        update_nonce_tracker(nonce_tracker, new_nonce)?;
        
        crate::audit_log!("INFO", "Nonce updated to: {} for resource: {} by wallet: {}", 
                         new_nonce, resource_id, signer.key());
        
        Ok(())
    })
}

/// Initialize nonce tracker for a new wallet
pub fn initialize_nonce_tracker(
    nonce_tracker: &mut NonceTracker,
    resource_id: String,
    wallet: Pubkey,
    bump: u8,
) -> Result<()> {
    let current_time = Clock::get()?.unix_timestamp;
    
    nonce_tracker.resource_id = resource_id;
    nonce_tracker.wallet = wallet;
    nonce_tracker.nonce_window = NonceWindow::new();
    nonce_tracker.last_update_timestamp = current_time;
    nonce_tracker.update_sequence = 0;
    nonce_tracker.bump = bump;
    
    Ok(())
}

#[cfg(test)]
mod tests {
    use super::*;
    use anchor_lang::prelude::Pubkey;
    
    // Mock context for testing
    fn create_mock_clock() -> Clock {
        Clock {
            slot: 1000,
            epoch_start_timestamp: 1000,
            epoch: 1,
            leader_schedule_epoch: 1,
            unix_timestamp: 1000000,
        }
    }
    
    #[test]
    fn test_create_permission_grant() {
        let wallet = Pubkey::new_unique();
        let operations = vec!["read".to_string(), "write".to_string()];
        let granted_by = Pubkey::new_unique();
        
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
        let grant = grant.unwrap();
        assert_eq!(grant.wallet, wallet);
        assert_eq!(grant.delegation_depth, 0);
    }
}