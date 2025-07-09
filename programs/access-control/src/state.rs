use anchor_lang::prelude::*;
use std::collections::HashSet;

/// Maximum limits for security and storage optimization
pub const MAX_RESOURCE_ID_LENGTH: usize = 64;
pub const MAX_OPERATION_LENGTH: usize = 32;
pub const MAX_PERMISSIONS_PER_GRANT: usize = 16;
pub const MAX_GRANTS_PER_RESOURCE: usize = 100;
pub const MAX_DELEGATION_DEPTH: u8 = 5;
pub const NONCE_WINDOW_SIZE: u64 = 64;

/// Timestamp validation constants
pub const MAX_TIMESTAMP_DRIFT_SECONDS: i64 = 30;
pub const MAX_SIGNATURE_AGE_SECONDS: i64 = 300; // 5 minutes

/// Main access control account
#[account]
pub struct AccessControlAccount {
    /// Resource identifier
    pub resource_id: String,
    
    /// Program that owns this resource
    pub resource_program: Pubkey,
    
    /// Current owner of the resource
    pub owner: Pubkey,
    
    /// Global nonce tracking for overflow protection
    pub global_nonce_counter: u64,
    
    /// Maximum allowed delegation depth
    pub delegation_chain_limit: u8,
    
    /// Creation timestamp
    pub created_at: i64,
    
    /// Last update timestamp
    pub updated_at: i64,
    
    /// Permission grants (limited for storage efficiency)
    pub permission_grants: Vec<PermissionGrant>,
    
    /// Account bump seed
    pub bump: u8,
}

impl AccessControlAccount {
    pub const SPACE: usize = 8 + // discriminator
        (4 + MAX_RESOURCE_ID_LENGTH) + // resource_id (String)
        32 + // resource_program (Pubkey)
        32 + // owner (Pubkey)
        8 + // global_nonce_counter (u64)
        1 + // delegation_chain_limit (u8)
        8 + // created_at (i64)
        8 + // updated_at (i64)
        (4 + MAX_GRANTS_PER_RESOURCE * PermissionGrant::SPACE) + // permission_grants (Vec)
        1; // bump (u8)
}

/// Sliding window nonce tracker for efficient replay prevention
#[account]
pub struct NonceTracker {
    /// Resource identifier
    pub resource_id: String,
    
    /// Wallet that owns this nonce tracker
    pub wallet: Pubkey,
    
    /// Sliding window nonce tracking
    pub nonce_window: NonceWindow,
    
    /// Last update timestamp for concurrency detection
    pub last_update_timestamp: i64,
    
    /// Update sequence number for atomic operations
    pub update_sequence: u64,
    
    /// Account bump seed
    pub bump: u8,
}

impl NonceTracker {
    pub const SPACE: usize = 8 + // discriminator
        (4 + MAX_RESOURCE_ID_LENGTH) + // resource_id (String)
        32 + // wallet (Pubkey)
        NonceWindow::SPACE + // nonce_window
        8 + // last_update_timestamp (i64)
        8 + // update_sequence (u64)
        1; // bump (u8)
}

/// Efficient nonce tracking using sliding window bitmap
#[derive(AnchorSerialize, AnchorDeserialize, Clone, Debug, PartialEq)]
pub struct NonceWindow {
    /// Base nonce for the window
    pub base_nonce: u64,
    
    /// 64-bit bitmap tracking used nonces in window
    pub window_bitmap: u64,
    
    /// Total nonces processed (for overflow detection)
    pub total_nonces_processed: u64,
}

impl NonceWindow {
    pub const SPACE: usize = 8 + 8 + 8; // base_nonce + window_bitmap + total_nonces_processed
    
    pub fn new() -> Self {
        Self {
            base_nonce: 0,
            window_bitmap: 0,
            total_nonces_processed: 0,
        }
    }
    
    /// Check if nonce is valid and not used
    pub fn is_nonce_valid(&self, nonce: u64) -> bool {
        // Check for nonce overflow
        if nonce == u64::MAX {
            return false;
        }
        
        // Nonce must be >= base_nonce
        if nonce < self.base_nonce {
            return false;
        }
        
        // Nonce must be within window
        let offset = nonce - self.base_nonce;
        if offset >= NONCE_WINDOW_SIZE {
            return false;
        }
        
        // Check if nonce bit is already set
        let bit_position = offset;
        (self.window_bitmap & (1u64 << bit_position)) == 0
    }
    
    /// Mark nonce as used with overflow protection
    pub fn mark_nonce_used(&mut self, nonce: u64) -> Result<(), crate::error::AccessControlError> {
        if !self.is_nonce_valid(nonce) {
            return Err(crate::error::AccessControlError::NonceAlreadyUsed);
        }
        
        // Check for potential overflow
        if self.total_nonces_processed == u64::MAX {
            return Err(crate::error::AccessControlError::NonceOverflow);
        }
        
        let offset = nonce - self.base_nonce;
        
        // If nonce is beyond current window, slide the window
        if offset >= NONCE_WINDOW_SIZE {
            let slide_amount = offset - NONCE_WINDOW_SIZE + 1;
            self.slide_window(slide_amount);
        }
        
        // Mark the nonce as used
        let bit_position = nonce - self.base_nonce;
        self.window_bitmap |= 1u64 << bit_position;
        
        // Update counter with overflow check
        self.total_nonces_processed = self.total_nonces_processed
            .checked_add(1)
            .ok_or(crate::error::AccessControlError::NonceOverflow)?;
        
        Ok(())
    }
    
    /// Slide the nonce window forward
    fn slide_window(&mut self, slide_amount: u64) {
        if slide_amount >= NONCE_WINDOW_SIZE {
            // Complete window reset
            self.base_nonce += slide_amount;
            self.window_bitmap = 0;
        } else {
            // Partial slide
            self.base_nonce += slide_amount;
            self.window_bitmap >>= slide_amount;
        }
    }
}

/// Permission grant with delegation tracking
#[derive(AnchorSerialize, AnchorDeserialize, Clone, Debug, PartialEq)]
pub struct PermissionGrant {
    /// Wallet that has the permission
    pub wallet: Pubkey,
    
    /// List of allowed operations
    pub operations: Vec<String>,
    
    /// When the permission was granted
    pub granted_at: i64,
    
    /// When the permission expires (None = never)
    pub expires_at: Option<i64>,
    
    /// Whether this permission can be delegated
    pub can_delegate: bool,
    
    /// Who granted this permission (for delegation chain)
    pub granted_by: Pubkey,
    
    /// Depth in delegation chain
    pub delegation_depth: u8,
    
    /// Maximum depth this permission can be delegated to
    pub max_delegation_depth: u8,
}

impl PermissionGrant {
    pub const SPACE: usize = 32 + // wallet (Pubkey)
        (4 + MAX_PERMISSIONS_PER_GRANT * (4 + MAX_OPERATION_LENGTH)) + // operations (Vec<String>)
        8 + // granted_at (i64)
        (1 + 8) + // expires_at (Option<i64>)
        1 + // can_delegate (bool)
        32 + // granted_by (Pubkey)
        1 + // delegation_depth (u8)
        1; // max_delegation_depth (u8)
    
    /// Check if permission has expired
    pub fn is_expired(&self, current_time: i64) -> bool {
        if let Some(expiry) = self.expires_at {
            current_time > expiry
        } else {
            false
        }
    }
    
    /// Check if permission allows specific operation
    pub fn allows_operation(&self, operation: &str) -> bool {
        self.operations.iter().any(|op| op == operation)
    }
    
    /// Check if permission can be delegated further
    pub fn can_delegate_further(&self) -> bool {
        self.can_delegate && self.delegation_depth < self.max_delegation_depth
    }
}

/// PDA-based permission index for efficient lookups
#[account]
pub struct PermissionIndex {
    /// Resource identifier
    pub resource_id: String,
    
    /// Wallet that has permissions
    pub wallet: Pubkey,
    
    /// Reference to the permission grant in the main account
    pub grant_index: u8,
    
    /// Quick access flags for common operations
    pub operation_flags: OperationFlags,
    
    /// Last update timestamp
    pub updated_at: i64,
    
    /// Account bump seed
    pub bump: u8,
}

impl PermissionIndex {
    pub const SPACE: usize = 8 + // discriminator
        (4 + MAX_RESOURCE_ID_LENGTH) + // resource_id (String)
        32 + // wallet (Pubkey)
        1 + // grant_index (u8)
        OperationFlags::SPACE + // operation_flags
        8 + // updated_at (i64)
        1; // bump (u8)
}

/// Bitflags for efficient operation checking
#[derive(AnchorSerialize, AnchorDeserialize, Clone, Debug, PartialEq)]
pub struct OperationFlags {
    pub flags: u32,
}

impl OperationFlags {
    pub const SPACE: usize = 4; // u32
    
    pub const READ: u32 = 1 << 0;
    pub const WRITE: u32 = 1 << 1;
    pub const EXECUTE: u32 = 1 << 2;
    pub const TRANSFER: u32 = 1 << 3;
    pub const DELEGATE: u32 = 1 << 4;
    pub const ADMIN: u32 = 1 << 5;
    
    pub fn new() -> Self {
        Self { flags: 0 }
    }
    
    pub fn has_permission(&self, permission: u32) -> bool {
        (self.flags & permission) != 0
    }
    
    pub fn set_permission(&mut self, permission: u32) {
        self.flags |= permission;
    }
    
    pub fn remove_permission(&mut self, permission: u32) {
        self.flags &= !permission;
    }
}

/// Delegation chain validation state
pub struct DelegationChainValidator {
    visited_wallets: HashSet<Pubkey>,
    max_depth: u8,
    current_depth: u8,
}

impl DelegationChainValidator {
    pub fn new(max_depth: u8) -> Self {
        Self {
            visited_wallets: HashSet::new(),
            max_depth,
            current_depth: 0,
        }
    }
    
    /// Validate delegation chain for circular references
    pub fn validate_delegation(&mut self, wallet: &Pubkey, granted_by: &Pubkey) -> Result<(), crate::error::AccessControlError> {
        // Check depth limit
        if self.current_depth >= self.max_depth {
            return Err(crate::error::AccessControlError::DelegationChainTooDeep);
        }
        
        // Check for circular delegation
        if self.visited_wallets.contains(wallet) {
            return Err(crate::error::AccessControlError::CircularDelegationDetected);
        }
        
        // Add to visited set
        self.visited_wallets.insert(*wallet);
        self.current_depth += 1;
        
        Ok(())
    }
}