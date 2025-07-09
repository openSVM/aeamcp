use anchor_lang::prelude::*;
use ed25519_dalek::{Signature, VerifyingKey, Verifier};
use sha2::{Sha256, Digest};
use crate::error::AccessControlError;
use crate::state::{MAX_TIMESTAMP_DRIFT_SECONDS, MAX_SIGNATURE_AGE_SECONDS, PermissionGrant, DelegationChainValidator};

/// Validate signature timestamp with drift protection
pub fn validate_signature_timestamp(timestamp: i64) -> Result<(), AccessControlError> {
    let current_time = Clock::get()?.unix_timestamp;
    
    // Check for future timestamps (clock skew tolerance)
    if timestamp > current_time + MAX_TIMESTAMP_DRIFT_SECONDS {
        return Err(AccessControlError::TimestampFromFuture);
    }
    
    // Check for expired signatures
    if current_time - timestamp > MAX_SIGNATURE_AGE_SECONDS {
        return Err(AccessControlError::SignatureExpired);
    }
    
    // Check for excessive drift
    let time_diff = (current_time - timestamp).abs();
    if time_diff > MAX_TIMESTAMP_DRIFT_SECONDS {
        return Err(AccessControlError::TimestampDriftTooLarge);
    }
    
    Ok(())
}

/// Verify Ed25519 signature with comprehensive validation
pub fn verify_ed25519_signature(
    signature: &[u8; 64],
    message: &[u8],
    public_key: &[u8; 32],
) -> Result<(), AccessControlError> {
    // Parse the signature
    let signature = Signature::from_bytes(signature)
        .map_err(|_| AccessControlError::InvalidSignature)?;
    
    // Parse the public key
    let verifying_key = VerifyingKey::from_bytes(public_key)
        .map_err(|_| AccessControlError::InvalidSignature)?;
    
    // Verify the signature
    verifying_key
        .verify(message, &signature)
        .map_err(|_| AccessControlError::InvalidSignature)?;
    
    Ok(())
}

/// Reconstruct canonical message from operation components
pub fn reconstruct_canonical_message(
    resource_id: &str,
    operation: &str,
    nonce: u64,
    timestamp: i64,
    additional_data: Option<&[u8]>,
) -> Result<Vec<u8>, AccessControlError> {
    // Validate input lengths for security
    if resource_id.len() > crate::state::MAX_RESOURCE_ID_LENGTH {
        return Err(AccessControlError::ResourceIdTooLong);
    }
    
    if operation.len() > crate::state::MAX_OPERATION_LENGTH {
        return Err(AccessControlError::OperationTooLong);
    }
    
    let mut hasher = Sha256::new();
    
    // Create deterministic message format
    hasher.update(b"ACCESS_CONTROL_V1");
    hasher.update(resource_id.as_bytes());
    hasher.update(operation.as_bytes());
    hasher.update(&nonce.to_le_bytes());
    hasher.update(&timestamp.to_le_bytes());
    
    if let Some(data) = additional_data {
        hasher.update(data);
    }
    
    Ok(hasher.finalize().to_vec())
}

/// Validate delegation chain for circular references and depth limits
pub fn validate_delegation_chain(
    grants: &[PermissionGrant],
    starting_wallet: &Pubkey,
    max_depth: u8,
) -> Result<(), AccessControlError> {
    let mut validator = DelegationChainValidator::new(max_depth);
    
    // Trace delegation chain from starting wallet
    let mut current_wallet = *starting_wallet;
    
    loop {
        // Find the grant for current wallet
        let grant = grants.iter()
            .find(|g| g.wallet == current_wallet)
            .ok_or(AccessControlError::InvalidDelegationChain)?;
        
        // Validate this step in the chain
        validator.validate_delegation(&current_wallet, &grant.granted_by)?;
        
        // If this was granted by the owner or self, we're done
        if grant.granted_by == current_wallet {
            break;
        }
        
        // Move to the next link in the chain
        current_wallet = grant.granted_by;
    }
    
    Ok(())
}

/// Validate permission grant request
pub fn validate_permission_grant(
    grant: &PermissionGrant,
    granter: &Pubkey,
    granter_permissions: Option<&PermissionGrant>,
    current_time: i64,
) -> Result<(), AccessControlError> {
    // Check if grant has expired
    if grant.is_expired(current_time) {
        return Err(AccessControlError::PermissionExpired);
    }
    
    // If granter is not the owner, check their delegation rights
    if let Some(granter_perms) = granter_permissions {
        // Check if granter can delegate
        if !granter_perms.can_delegate {
            return Err(AccessControlError::CannotDelegate);
        }
        
        // Check delegation depth
        if grant.delegation_depth > granter_perms.max_delegation_depth {
            return Err(AccessControlError::MaxDelegationDepthReached);
        }
        
        // Check if granter has the permissions they're trying to grant
        for operation in &grant.operations {
            if !granter_perms.allows_operation(operation) {
                return Err(AccessControlError::PermissionDenied);
            }
        }
    }
    
    Ok(())
}

/// Validate resource ID format and constraints
pub fn validate_resource_id(resource_id: &str) -> Result<(), AccessControlError> {
    if resource_id.is_empty() {
        return Err(AccessControlError::InvalidResourceId);
    }
    
    if resource_id.len() > crate::state::MAX_RESOURCE_ID_LENGTH {
        return Err(AccessControlError::ResourceIdTooLong);
    }
    
    // Check for valid characters (alphanumeric, underscore, hyphen)
    if !resource_id.chars().all(|c| c.is_alphanumeric() || c == '_' || c == '-') {
        return Err(AccessControlError::InvalidResourceId);
    }
    
    Ok(())
}

/// Validate operation name format and constraints
pub fn validate_operation(operation: &str) -> Result<(), AccessControlError> {
    if operation.is_empty() {
        return Err(AccessControlError::InvalidOperation);
    }
    
    if operation.len() > crate::state::MAX_OPERATION_LENGTH {
        return Err(AccessControlError::OperationTooLong);
    }
    
    // Check for valid characters (alphanumeric, underscore)
    if !operation.chars().all(|c| c.is_alphanumeric() || c == '_') {
        return Err(AccessControlError::InvalidOperation);
    }
    
    Ok(())
}

/// Validate permissions list
pub fn validate_permissions(permissions: &[String]) -> Result<(), AccessControlError> {
    if permissions.is_empty() {
        return Err(AccessControlError::InvalidPermissionFormat);
    }
    
    if permissions.len() > crate::state::MAX_PERMISSIONS_PER_GRANT {
        return Err(AccessControlError::TooManyPermissions);
    }
    
    for permission in permissions {
        validate_operation(permission)?;
    }
    
    Ok(())
}

/// Security audit helper for timing attack protection
pub fn constant_time_compare(a: &[u8], b: &[u8]) -> bool {
    if a.len() != b.len() {
        return false;
    }
    
    let mut result = 0u8;
    for (x, y) in a.iter().zip(b.iter()) {
        result |= x ^ y;
    }
    
    result == 0
}

/// Comprehensive signature validation with all security checks
pub fn comprehensive_signature_validation(
    signature: &[u8; 64],
    public_key: &[u8; 32],
    resource_id: &str,
    operation: &str,
    nonce: u64,
    timestamp: i64,
    additional_data: Option<&[u8]>,
) -> Result<(), AccessControlError> {
    // Validate timestamp first (fail fast)
    validate_signature_timestamp(timestamp)?;
    
    // Validate input formats
    validate_resource_id(resource_id)?;
    validate_operation(operation)?;
    
    // Reconstruct the canonical message
    let message = reconstruct_canonical_message(
        resource_id,
        operation,
        nonce,
        timestamp,
        additional_data,
    )?;
    
    // Verify the cryptographic signature
    verify_ed25519_signature(signature, &message, public_key)?;
    
    Ok(())
}

#[cfg(test)]
mod tests {
    use super::*;
    
    #[test]
    fn test_validate_resource_id() {
        assert!(validate_resource_id("valid_resource-123").is_ok());
        assert!(validate_resource_id("").is_err());
        assert!(validate_resource_id("invalid@resource").is_err());
        assert!(validate_resource_id(&"a".repeat(100)).is_err());
    }
    
    #[test]
    fn test_validate_operation() {
        assert!(validate_operation("read_data").is_ok());
        assert!(validate_operation("").is_err());
        assert!(validate_operation("invalid-operation").is_err());
        assert!(validate_operation(&"a".repeat(50)).is_err());
    }
    
    #[test]
    fn test_constant_time_compare() {
        let a = [1, 2, 3, 4];
        let b = [1, 2, 3, 4];
        let c = [1, 2, 3, 5];
        
        assert!(constant_time_compare(&a, &b));
        assert!(!constant_time_compare(&a, &c));
        assert!(!constant_time_compare(&a, &[1, 2, 3]));
    }
}