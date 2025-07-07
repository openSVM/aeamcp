# Solana Wallet Signature-Based Access Control Proposals

This document presents 4 different architectural approaches for implementing wallet signature-based access control directly at the Solana program level within the AEAMCP protocol.

## Background

The goal is to implement stateless, decentralized access control using wallet signatures that:
- Validates Ed25519 signatures on-chain within Solana programs
- Prevents replay attacks through nonce management
- Supports granular permissions for different operations
- Enables access rights transfer/lending between wallets
- Integrates seamlessly with existing AEAMCP programs

## Proposal 1: Extended Agent Registry with Access Control

### Overview
Extend the existing `agent-registry` program to include signature-based access control for agent operations.

### Architecture
```rust
// New instruction variants in AgentRegistryInstruction
pub enum AgentRegistryInstruction {
    // ... existing variants ...
    
    /// Execute agent operation with signature verification
    /// Message is reconstructed from canonical fields to prevent manipulation
    ExecuteWithSignature {
        operation: AgentOperation,
        signature: [u8; 64],
        nonce: u64,
        timestamp: i64,
        // Additional operation-specific data
        operation_data: Vec<u8>,
    },
    
    /// Grant access rights to another wallet with delegation controls
    GrantAccess {
        target_wallet: Pubkey,
        permissions: AccessPermissions,
        expiry: Option<i64>,
        can_delegate: bool,
        max_delegation_depth: u8,
    },
    
    /// Revoke access rights with explicit cleanup
    RevokeAccess {
        target_wallet: Pubkey,
        revoke_delegated: bool, // Also revoke any delegated permissions
    },
    
    /// Prune expired access grants to reclaim space
    PruneExpiredGrants {
        max_grants_to_prune: u8,
    },
}

#[derive(BorshSerialize, BorshDeserialize)]
pub struct AccessPermissions {
    pub can_read: bool,
    pub can_update: bool,
    pub can_transfer: bool,
    pub can_execute: bool,
    pub can_delegate: bool, // Whether this permission can be delegated
}

#[derive(BorshSerialize, BorshDeserialize)]
pub enum AgentOperation {
    ReadDetails,
    UpdateStatus,
    UpdateDetails,
    StakeTokens,
    UnstakeTokens,
    UpdateServiceFees,
}

// Timestamp drift validation constants
pub const MAX_TIMESTAMP_DRIFT_SECONDS: i64 = 30;
pub const MAX_SIGNATURE_AGE_SECONDS: i64 = 300; // 5 minutes
```

### Storage Structure
```rust
// Extend AgentRegistryEntry
pub struct AgentRegistryEntry {
    // ... existing fields ...
    pub access_control: AccessControlData,
}

// Sliding window nonce tracking for efficient replay prevention
#[derive(BorshSerialize, BorshDeserialize)]
pub struct NonceWindow {
    pub base_nonce: u64,
    pub window_bitmap: u64, // 64-bit bitmap for tracking used nonces in window
}

pub struct AccessControlData {
    pub owner: Pubkey,
    pub nonce_window: NonceWindow,
    pub granted_permissions: Vec<AccessGrant>,
    pub delegation_tree_depth: u8, // Track maximum delegation depth
}

#[derive(BorshSerialize, BorshDeserialize)]
pub struct AccessGrant {
    pub wallet: Pubkey,
    pub permissions: AccessPermissions,
    pub granted_at: i64,
    pub expires_at: Option<i64>,
    pub granted_by: Pubkey, // For delegation chain tracking
    pub delegation_depth: u8, // Depth in delegation chain
}

// Signature verification and message reconstruction
pub fn reconstruct_canonical_message(
    operation: &AgentOperation,
    agent_id: &str,
    nonce: u64,
    timestamp: i64,
    operation_data: &[u8],
) -> Vec<u8> {
    let mut message = Vec::new();
    // Create deterministic message format
    message.extend_from_slice(&operation.to_discriminant().to_le_bytes());
    message.extend_from_slice(agent_id.as_bytes());
    message.extend_from_slice(&nonce.to_le_bytes());
    message.extend_from_slice(&timestamp.to_le_bytes());
    message.extend_from_slice(operation_data);
    message
}

pub fn validate_timestamp_drift(timestamp: i64) -> Result<(), ProgramError> {
    let current_time = Clock::get()?.unix_timestamp;
    let time_diff = (current_time - timestamp).abs();
    
    if time_diff > MAX_TIMESTAMP_DRIFT_SECONDS {
        return Err(CustomError::TimestampDriftTooLarge.into());
    }
    
    if timestamp > current_time + MAX_TIMESTAMP_DRIFT_SECONDS {
        return Err(CustomError::TimestampFromFuture.into());
    }
    
    if current_time - timestamp > MAX_SIGNATURE_AGE_SECONDS {
        return Err(CustomError::SignatureExpired.into());
    }
    
    Ok(())
}

impl NonceWindow {
    pub fn is_nonce_used(&self, nonce: u64) -> bool {
        if nonce < self.base_nonce || nonce >= self.base_nonce + 64 {
            return false; // Outside current window
        }
        let bit_position = nonce - self.base_nonce;
        (self.window_bitmap & (1u64 << bit_position)) != 0
    }
    
    pub fn mark_nonce_used(&mut self, nonce: u64) -> Result<(), ProgramError> {
        if nonce < self.base_nonce {
            return Err(CustomError::NonceReplay.into());
        }
        
        if nonce >= self.base_nonce + 64 {
            // Slide window forward
            let shift = nonce - self.base_nonce - 63;
            self.window_bitmap >>= shift;
            self.base_nonce += shift;
        }
        
        let bit_position = nonce - self.base_nonce;
        if (self.window_bitmap & (1u64 << bit_position)) != 0 {
            return Err(CustomError::NonceReplay.into());
        }
        
        self.window_bitmap |= 1u64 << bit_position;
        Ok(())
    }
}
```

### PDA Structure
- Main agent: `["agent_registry", agent_id.as_bytes()]`
- Access control: Same PDA with embedded access control data
- Nonce tracking: Embedded in agent registry entry

### Advantages
- Leverages existing agent registry infrastructure
- Single program to maintain
- Direct integration with agent operations
- Familiar PDA patterns

### Disadvantages
- Increases complexity of agent registry program
- Larger account sizes
- Tightly coupled with agent-specific operations
- May not be suitable for other programs' access control needs

---

## Proposal 2: Dedicated Access Control Program

### Overview
Create a new standalone `access-control` program that can be used by any program in the AEAMCP ecosystem.

### Architecture
```rust
// New access-control program
pub enum AccessControlInstruction {
    /// Initialize access control for a resource
    InitializeAccessControl {
        resource_id: String,
        resource_program: Pubkey,
        initial_owner: Pubkey,
    },
    
    /// Verify signature and execute if authorized
    VerifyAndExecute {
        resource_id: String,
        operation: String,
        signature: [u8; 64],
        message: Vec<u8>,
        nonce: u64,
        timestamp: i64,
        target_program: Pubkey,
        target_instruction: Vec<u8>,
    },
    
    /// Grant access to another wallet
    GrantPermission {
        resource_id: String,
        target_wallet: Pubkey,
        permissions: Vec<String>,
        expiry: Option<i64>,
    },
    
    /// Transfer ownership
    TransferOwnership {
        resource_id: String,
        new_owner: Pubkey,
    },
}
```

### Storage Structure
```rust
#[account]
pub struct AccessControlAccount {
    pub resource_id: String,
    pub resource_program: Pubkey,
    pub owner: Pubkey,
    pub nonce_window: NonceWindow, // Sliding window bitmap instead of Vec
    pub permissions: Vec<PermissionGrant>,
    pub delegation_chain_limit: u8,
}

// Efficient nonce tracking using sliding window bitmap
#[derive(BorshSerialize, BorshDeserialize)]
pub struct NonceWindow {
    pub base_nonce: u64,
    pub window_bitmap: u64, // 64-bit bitmap for tracking used nonces
}

#[derive(BorshSerialize, BorshDeserialize)]
pub struct PermissionGrant {
    pub wallet: Pubkey,
    pub operations: Vec<String>,
    pub granted_at: i64,
    pub expires_at: Option<i64>,
    pub can_delegate: bool,
    pub granted_by: Pubkey, // For delegation chain tracking
    pub delegation_depth: u8,
}

// Timestamp validation implementation
pub fn validate_signature_timestamp(timestamp: i64) -> Result<(), ProgramError> {
    let current_time = Clock::get()?.unix_timestamp;
    
    // Check for future timestamps
    if timestamp > current_time + MAX_TIMESTAMP_DRIFT_SECONDS {
        return Err(CustomError::TimestampFromFuture.into());
    }
    
    // Check for expired signatures
    if current_time - timestamp > MAX_SIGNATURE_AGE_SECONDS {
        return Err(CustomError::SignatureExpired.into());
    }
    
    // Check for excessive drift
    let time_diff = (current_time - timestamp).abs();
    if time_diff > MAX_TIMESTAMP_DRIFT_SECONDS {
        return Err(CustomError::TimestampDriftTooLarge.into());
    }
    
    Ok(())
}

// Delegation chain validation
pub fn validate_delegation_chain(
    grant: &PermissionGrant,
    chain_limit: u8,
) -> Result<(), ProgramError> {
    if grant.delegation_depth > chain_limit {
        return Err(CustomError::DelegationChainTooDeep.into());
    }
    Ok(())
}

// Prune expired grants to reclaim account space
pub fn prune_expired_grants(
    grants: &mut Vec<PermissionGrant>,
    current_time: i64,
    max_to_prune: u8,
) -> u8 {
    let initial_len = grants.len();
    let mut pruned = 0;
    
    grants.retain(|grant| {
        if pruned >= max_to_prune {
            return true;
        }
        
        if let Some(expiry) = grant.expires_at {
            if current_time > expiry {
                pruned += 1;
                return false;
            }
        }
        true
    });
    
    pruned
}
```

### PDA Structure
- Access control: `["access_control", resource_program.as_ref(), resource_id.as_bytes()]`
- Nonce tracker: `["nonce_tracker", resource_program.as_ref(), resource_id.as_bytes(), wallet.as_ref()]`

### Cross-Program Integration
```rust
// Other programs use CPI to verify access
pub fn verify_access_and_continue(
    ctx: Context<VerifyAccess>,
    resource_id: String,
    operation: String,
    signature: [u8; 64],
    message: Vec<u8>,
    nonce: u64,
    timestamp: i64,
) -> Result<()> {
    // CPI to access-control program
    let cpi_program = ctx.accounts.access_control_program.to_account_info();
    let cpi_accounts = access_control::cpi::accounts::VerifySignature {
        access_control_account: ctx.accounts.access_control_account.to_account_info(),
        signer: ctx.accounts.signer.to_account_info(),
    };
    
    access_control::cpi::verify_signature(
        CpiContext::new(cpi_program, cpi_accounts),
        resource_id,
        operation,
        signature,
        message,
        nonce,
        timestamp,
    )?;
    
    // Continue with original operation
    Ok(())
}
```

### Advantages
- Reusable across all AEAMCP programs
- Clean separation of concerns
- Standardized access control interface
- Can be upgraded independently

### Disadvantages
- Additional program complexity
- Requires CPI calls (additional compute cost)
- More accounts to manage
- Cross-program dependency management

---

## Proposal 3: Hybrid Registry-Based Access Control

### Overview
Extend the existing `agent-registry` to include a separate access control registry that can be referenced by multiple programs.

### Architecture
```rust
// Extended agent-registry with access control registry
pub enum AgentRegistryInstruction {
    // ... existing variants ...
    
    /// Register access control for any resource
    RegisterAccessControl {
        resource_type: ResourceType,
        resource_id: String,
        owner: Pubkey,
        initial_permissions: Vec<Permission>,
    },
    
    /// Update access permissions
    UpdateAccessPermissions {
        resource_type: ResourceType,
        resource_id: String,
        target_wallet: Pubkey,
        permissions: Vec<Permission>,
        expiry: Option<i64>,
    },
    
    /// Verify signature for any resource
    VerifyResourceAccess {
        resource_type: ResourceType,
        resource_id: String,
        operation: String,
        signature: [u8; 64],
        message: Vec<u8>,
        nonce: u64,
        timestamp: i64,
    },
}

#[derive(BorshSerialize, BorshDeserialize)]
pub enum ResourceType {
    Agent,
    McpServer,
    Token,
    Custom(String),
}

#[derive(BorshSerialize, BorshDeserialize)]
pub struct Permission {
    pub operation: String,
    pub granted: bool,
    pub delegatable: bool,
}
```

### Storage Structure
```rust
// Separate access control entries with optimized storage
#[account]
pub struct AccessControlEntry {
    pub resource_type: ResourceType,
    pub resource_id: String,
    pub owner: Pubkey,
    pub nonce_window: NonceWindow, // Sliding window bitmap
    pub permissions_vec: Vec<(Pubkey, Vec<Permission>)>, // Replaced HashMap for serialization
    pub delegation_chain_limit: u8,
    pub created_at: i64,
    pub updated_at: i64,
}

// Nonce tracking per wallet per resource with bitmap optimization
#[account]
pub struct NonceTracker {
    pub resource_key: String, // Derived from resource_type + resource_id
    pub wallet: Pubkey,
    pub nonce_window: NonceWindow, // Bitmap instead of Vec
}

// Optimized permission lookup using linear scan or PDA indexing
impl AccessControlEntry {
    pub fn find_permissions(&self, wallet: &Pubkey) -> Option<&Vec<Permission>> {
        // Linear scan for small datasets, could use PDA indexing for larger ones
        for (pubkey, permissions) in &self.permissions_vec {
            if pubkey == wallet {
                return Some(permissions);
            }
        }
        None
    }
    
    pub fn add_permissions(&mut self, wallet: Pubkey, permissions: Vec<Permission>) {
        // Remove existing entry if present
        self.permissions_vec.retain(|(pk, _)| pk != &wallet);
        // Add new entry
        self.permissions_vec.push((wallet, permissions));
    }
    
    pub fn remove_permissions(&mut self, wallet: &Pubkey) {
        self.permissions_vec.retain(|(pk, _)| pk != wallet);
    }
    
    // For larger datasets, consider using PDA-based indexing:
    // PDA: ["permission_index", resource_key, wallet.as_ref()]
    pub fn get_permission_pda(
        resource_key: &str,
        wallet: &Pubkey,
        program_id: &Pubkey,
    ) -> (Pubkey, u8) {
        Pubkey::find_program_address(
            &[
                b"permission_index",
                resource_key.as_bytes(),
                wallet.as_ref(),
            ],
            program_id,
        )
    }
}
```

### PDA Structure
- Access control: `["access_control", resource_type.to_string(), resource_id.as_bytes()]`
- Nonce tracker: `["nonce_tracker", resource_type.to_string(), resource_id.as_bytes(), wallet.as_ref()]`

### Integration Pattern
```rust
// Programs query access control through the registry
impl Processor {
    pub fn process_with_access_control(
        program_id: &Pubkey,
        accounts: &[AccountInfo],
        instruction_data: &[u8],
    ) -> ProgramResult {
        // Parse signature verification data
        let access_data = AccessVerificationData::try_from_slice(instruction_data)?;
        
        // Verify signature against access control registry
        let access_control_account = Self::get_access_control_account(
            &access_data.resource_type,
            &access_data.resource_id,
            accounts,
        )?;
        
        Self::verify_signature_and_permissions(
            &access_control_account,
            &access_data,
        )?;
        
        // Execute original operation
        Self::execute_operation(program_id, accounts, &access_data.operation_data)
    }
}
```

### Advantages
- Leverages existing registry infrastructure
- Supports multiple resource types
- Centralized access control management
- Can grow to support new programs easily

### Disadvantages
- Still requires cross-program calls for verification
- More complex than agent-only access control
- Potential performance bottleneck
- Registry size could grow large

---

## Proposal 4: Signature Verification Library with Program-Specific Implementation

### Overview
Create a shared library (`common` crate enhancement) for signature verification while allowing each program to implement its own access control logic.

### Architecture
```rust
// Enhanced common crate with signature verification and macro utilities
pub mod signature_verification {
    use solana_program::pubkey::Pubkey;
    
    #[derive(Debug)]
    pub struct SignatureVerificationData {
        pub signature: [u8; 64],
        pub message: Vec<u8>,
        pub signer: Pubkey,
        pub nonce: u64,
        pub timestamp: i64,
    }
    
    pub fn verify_ed25519_signature(
        data: &SignatureVerificationData,
    ) -> Result<(), ProgramError> {
        // Timestamp drift validation
        validate_signature_timestamp(data.timestamp)?;
        
        // Ed25519 signature verification logic
        // Nonce validation using sliding window
        Ok(())
    }
    
    pub fn create_canonical_message(
        operation: &str,
        resource_id: &str,
        nonce: u64,
        timestamp: i64,
        additional_data: &[u8],
    ) -> Vec<u8> {
        // Create deterministic message format
        let mut message = Vec::new();
        message.extend_from_slice(operation.as_bytes());
        message.extend_from_slice(resource_id.as_bytes());
        message.extend_from_slice(&nonce.to_le_bytes());
        message.extend_from_slice(&timestamp.to_le_bytes());
        message.extend_from_slice(additional_data);
        message
    }
    
    // Timestamp validation with configurable drift
    pub fn validate_signature_timestamp(timestamp: i64) -> Result<(), ProgramError> {
        let current_time = Clock::get()?.unix_timestamp;
        
        if timestamp > current_time + MAX_TIMESTAMP_DRIFT_SECONDS {
            return Err(CustomError::TimestampFromFuture.into());
        }
        
        if current_time - timestamp > MAX_SIGNATURE_AGE_SECONDS {
            return Err(CustomError::SignatureExpired.into());
        }
        
        let time_diff = (current_time - timestamp).abs();
        if time_diff > MAX_TIMESTAMP_DRIFT_SECONDS {
            return Err(CustomError::TimestampDriftTooLarge.into());
        }
        
        Ok(())
    }
}

// Macro utilities to reduce boilerplate across programs
#[macro_export]
macro_rules! implement_signature_verification {
    ($struct_name:ident, $permission_type:ty, $resource_type:ty) => {
        impl $struct_name {
            pub fn verify_signature_and_access(
                &self,
                operation: &str,
                resource: &$resource_type,
                signature: &[u8; 64],
                signer: &Pubkey,
                nonce: u64,
                timestamp: i64,
                required_permission: &$permission_type,
            ) -> Result<(), ProgramError> {
                // Reconstruct canonical message
                let message = create_canonical_message(
                    operation,
                    &resource.to_string(),
                    nonce,
                    timestamp,
                    &[],
                );
                
                // Verify signature
                let verification_data = SignatureVerificationData {
                    signature: *signature,
                    message,
                    signer: *signer,
                    nonce,
                    timestamp,
                };
                
                verify_ed25519_signature(&verification_data)?;
                
                // Verify access permissions
                self.verify_access(signer, resource, required_permission)?;
                
                Ok(())
            }
        }
    };
}

#[macro_export]
macro_rules! implement_nonce_tracking {
    ($struct_name:ident) => {
        impl $struct_name {
            pub fn check_and_mark_nonce(&mut self, nonce: u64) -> Result<(), ProgramError> {
                self.nonce_window.mark_nonce_used(nonce)
            }
        }
    };
}

#[macro_export]
macro_rules! implement_delegation_validation {
    ($struct_name:ident, $permission_type:ty) => {
        impl $struct_name {
            pub fn validate_delegation_chain(
                &self,
                granter: &Pubkey,
                permission: &$permission_type,
                max_depth: u8,
            ) -> Result<(), ProgramError> {
                // Find granter's permissions
                let granter_permissions = self.find_permissions(granter)
                    .ok_or(CustomError::AccessDenied)?;
                
                // Check if granter has delegation rights
                if !granter_permissions.iter().any(|p| p.can_delegate) {
                    return Err(CustomError::CannotDelegate.into());
                }
                
                // Check delegation depth
                for grant in &self.access_grants {
                    if grant.wallet == *granter && grant.delegation_depth >= max_depth {
                        return Err(CustomError::DelegationChainTooDeep.into());
                    }
                }
                
                Ok(())
            }
        }
    };
}

// Scaffolding for new programs implementing access control
pub mod access_control_scaffolding {
    use super::*;
    
    /// Template for implementing access control in new programs
    pub struct AccessControlTemplate<P, R> {
        pub permissions: std::marker::PhantomData<P>,
        pub resource: std::marker::PhantomData<R>,
    }
    
    impl<P, R> AccessControlTemplate<P, R>
    where
        P: Clone + PartialEq,
        R: ToString,
    {
        pub fn new() -> Self {
            Self {
                permissions: std::marker::PhantomData,
                resource: std::marker::PhantomData,
            }
        }
        
        pub fn generate_access_control_account_template() -> String {
            r#"
            #[account]
            pub struct YourAccessControlAccount {
                pub owner: Pubkey,
                pub nonce_window: NonceWindow,
                pub permissions: Vec<AccessGrant<YourPermissionType>>,
                pub delegation_chain_limit: u8,
            }
            
            implement_signature_verification!(YourAccessControlAccount, YourPermissionType, YourResourceType);
            implement_nonce_tracking!(YourAccessControlAccount);
            implement_delegation_validation!(YourAccessControlAccount, YourPermissionType);
            "#.to_string()
        }
    }
}

pub mod access_control_traits {
    pub trait AccessControlled {
        type Permission;
        type Resource;
        
        fn verify_access(
            &self,
            wallet: &Pubkey,
            resource: &Self::Resource,
            permission: &Self::Permission,
        ) -> Result<(), ProgramError>;
        
        fn grant_access(
            &mut self,
            granter: &Pubkey,
            target: &Pubkey,
            resource: &Self::Resource,
            permission: &Self::Permission,
            expiry: Option<i64>,
        ) -> Result<(), ProgramError>;
    }
}
```

### Per-Program Implementation
```rust
// In agent-registry program
use aeamcp_common::signature_verification::*;
use aeamcp_common::access_control_traits::AccessControlled;

#[derive(BorshSerialize, BorshDeserialize)]
pub enum AgentPermission {
    Read,
    Update,
    Stake,
    Transfer,
    Execute,
}

impl AccessControlled for AgentRegistryEntry {
    type Permission = AgentPermission;
    type Resource = String; // agent_id
    
    fn verify_access(
        &self,
        wallet: &Pubkey,
        agent_id: &String,
        permission: &AgentPermission,
    ) -> Result<(), ProgramError> {
        // Check if wallet is owner
        if self.owner == *wallet {
            return Ok(());
        }
        
        // Check granted permissions
        for grant in &self.access_grants {
            if grant.wallet == *wallet && grant.has_permission(permission) {
                if let Some(expiry) = grant.expires_at {
                    let current_time = Clock::get()?.unix_timestamp;
                    if current_time > expiry {
                        return Err(CustomError::AccessExpired.into());
                    }
                }
                return Ok(());
            }
        }
        
        Err(CustomError::AccessDenied.into())
    }
}

// Instruction processing with signature verification
pub fn process_agent_operation_with_signature(
    program_id: &Pubkey,
    accounts: &[AccountInfo],
    instruction_data: &[u8],
) -> ProgramResult {
    let data = AgentOperationWithSignature::try_from_slice(instruction_data)?;
    
    // Verify signature
    let verification_data = SignatureVerificationData {
        signature: data.signature,
        message: create_canonical_message(
            &data.operation.to_string(),
            &data.agent_id,
            data.nonce,
            data.timestamp,
            &data.operation_data,
        ),
        signer: data.signer,
        nonce: data.nonce,
        timestamp: data.timestamp,
    };
    
    verify_ed25519_signature(&verification_data)?;
    
    // Verify access permissions
    let agent_account = &accounts[0];
    let mut agent_entry = AgentRegistryEntry::try_from_slice(&agent_account.data.borrow())?;
    
    agent_entry.verify_access(&data.signer, &data.agent_id, &data.required_permission)?;
    
    // Execute operation
    match data.operation {
        AgentOperation::UpdateStatus => process_update_status(&mut agent_entry, &data)?,
        AgentOperation::Stake => process_stake(&mut agent_entry, &data)?,
        // ... other operations
    }
    
    Ok(())
}
```

### Advantages
- Maximum flexibility for each program
- Shared signature verification logic
- No cross-program dependencies
- Each program optimizes for its use case
- Minimal performance overhead

### Disadvantages
- Duplicated access control logic across programs
- No standardized access control interface
- Harder to maintain consistency
- Each program needs its own access management UI

---

## Comparison Matrix

| Aspect | Proposal 1 | Proposal 2 | Proposal 3 | Proposal 4 |
|--------|------------|------------|------------|------------|
| **Reusability** | Low | High | Medium | High (w/ macros) |
| **Performance** | High | Medium | Medium | High |
| **Complexity** | Low | High | Medium | Medium |
| **Standardization** | Low | High | High | High (w/ macros) |
| **Maintenance** | Easy | Hard | Medium | Easy |
| **Flexibility** | Low | Medium | Medium | High |
| **Cross-program compatibility** | No | Yes | Yes | Yes (w/ macros) |
| **Development effort** | Low | High | Medium | Low |
| **Nonce Efficiency** | High (bitmap) | High (bitmap) | High (bitmap) | High (bitmap) |
| **Delegation Support** | Full | Full | Full | Full |
| **Security Robustness** | High | Highest | High | High |
| **Account Size Efficiency** | High | Medium | Medium | High |
| **Timestamp Validation** | ✓ | ✓ | ✓ | ✓ |
| **Pruning/Cleanup** | ✓ | ✓ | ✓ | ✓ |

## Recommendations

### For MVP (Minimum Viable Product)
**Proposal 1** - Extend agent registry with access control
- Fastest to implement
- Focused on agent operations
- Good for initial validation of signature-based access control

### For Production Scale
**Proposal 2** - Dedicated access control program
- Most robust and reusable solution
- Standardized interface across all programs
- Best for ecosystem growth

### For Performance-Critical Applications
**Proposal 4** - Shared library approach
- Minimal runtime overhead
- Maximum optimization potential
- Good for high-frequency operations

### For Balanced Approach
**Proposal 3** - Hybrid registry-based
- Good balance of reusability and simplicity
- Leverages existing infrastructure
- Easier migration path from current state

## Implementation Timeline

Each proposal includes these common components:
1. Ed25519 signature verification logic
2. Nonce management and replay protection
3. Timestamp validation with drift tolerance
4. Access permission data structures
5. Integration with existing programs
6. Comprehensive test suite

The estimated implementation time ranges from 2-3 weeks (Proposal 1) to 6-8 weeks (Proposal 2) depending on the chosen approach.

---

## Security Audit Checklist

### Pre-Implementation Security Review

Each proposal must pass the following security checklist before implementation:

#### **Replay Attack Protection**
- [ ] **Nonce Uniqueness**: Verify nonce values are strictly increasing or use sliding window bitmap
- [ ] **Nonce Window Size**: Confirm 64-bit bitmap provides adequate replay protection window
- [ ] **Nonce Overflow**: Handle nonce rollover scenarios gracefully
- [ ] **Cross-Resource Nonces**: Ensure nonces are scoped to specific resources to prevent cross-contamination
- [ ] **Nonce Persistence**: Verify nonce state persists across program restarts/upgrades

#### **Delegation Chain Security**
- [ ] **Chain Depth Limits**: Enforce maximum delegation depth (recommended: 3-5 levels)
- [ ] **Circular Delegation**: Prevent circular delegation chains (A→B→A)
- [ ] **Delegation Revocation**: Ensure revoking permissions also revokes all sub-delegations
- [ ] **Permission Escalation**: Verify delegated permissions cannot exceed delegator's permissions
- [ ] **Delegation Tracking**: Maintain complete audit trail of delegation chains

#### **Nonce Window Robustness**
- [ ] **Bitmap Efficiency**: Confirm 64-bit window provides optimal space/security tradeoff
- [ ] **Window Sliding**: Test sliding window behavior at boundaries
- [ ] **Performance Impact**: Measure bitmap operations impact on transaction costs
- [ ] **Concurrent Access**: Handle multiple simultaneous nonce updates safely
- [ ] **State Corruption**: Verify bitmap state remains consistent during failures

#### **Timestamp Validation**
- [ ] **Clock Drift Tolerance**: Set appropriate drift tolerance (default: 30 seconds)
- [ ] **Future Timestamps**: Reject signatures with timestamps too far in future
- [ ] **Signature Expiry**: Enforce signature expiration (default: 5 minutes)
- [ ] **Time Source**: Use reliable clock source (Solana's Clock sysvar)
- [ ] **Timezone Handling**: Ensure all timestamps use UTC/Unix time

#### **Signature Verification**
- [ ] **Ed25519 Implementation**: Use audited cryptographic libraries
- [ ] **Message Reconstruction**: Verify canonical message format is deterministic
- [ ] **Key Validation**: Validate public key format and constraints
- [ ] **Signature Malleability**: Prevent signature malleability attacks
- [ ] **Side-Channel Resistance**: Use constant-time signature verification

#### **Access Control Logic**
- [ ] **Permission Inheritance**: Verify permission inheritance rules are correct
- [ ] **Owner Privileges**: Ensure owners cannot be locked out of their resources
- [ ] **Permission Updates**: Handle permission changes without breaking existing grants
- [ ] **Expiration Cleanup**: Implement automatic cleanup of expired permissions
- [ ] **Race Conditions**: Prevent race conditions in permission updates

#### **Account Size Management**
- [ ] **Space Limits**: Monitor account size growth with permission grants
- [ ] **Pruning Logic**: Implement efficient expired permission cleanup
- [ ] **Fragmentation**: Handle account space fragmentation
- [ ] **Migration Path**: Plan for account structure upgrades
- [ ] **Cost Analysis**: Calculate ongoing maintenance costs

#### **Cross-Program Integration**
- [ ] **CPI Security**: Secure cross-program invocation patterns
- [ ] **Program Upgrades**: Handle program upgrades without breaking integrations
- [ ] **Dependency Management**: Manage program-to-program dependencies
- [ ] **Error Propagation**: Proper error handling across program boundaries
- [ ] **Authority Delegation**: Secure patterns for program-level authority

### Per-Proposal Specific Checks

#### **Proposal 1 (Extended Agent Registry)**
- [ ] **Backward Compatibility**: Existing agent registry functions remain unchanged
- [ ] **Account Size Growth**: Monitor impact on agent account sizes
- [ ] **Migration Strategy**: Plan for migrating existing agents to new structure

#### **Proposal 2 (Dedicated Access Control Program)**
- [ ] **CPI Overhead**: Measure performance impact of cross-program calls
- [ ] **Program Independence**: Ensure access control program can operate independently
- [ ] **Upgrade Coordination**: Plan for coordinated upgrades with dependent programs

#### **Proposal 3 (Hybrid Registry-Based)**
- [ ] **Registry Scalability**: Test registry performance with large numbers of resources
- [ ] **PDA Collision**: Verify PDA derivation prevents account collisions
- [ ] **Linear Scan Performance**: Benchmark permission lookup performance

#### **Proposal 4 (Shared Library)**
- [ ] **Code Duplication**: Minimize security-critical code duplication
- [ ] **Macro Safety**: Ensure macros generate secure code patterns
- [ ] **Library Versioning**: Handle library version incompatibilities

### Implementation Validation

#### **Unit Testing**
- [ ] Test all replay attack scenarios
- [ ] Test delegation chain limits and validation
- [ ] Test nonce window sliding and bitmap operations
- [ ] Test timestamp validation edge cases
- [ ] Test signature verification with malformed inputs

#### **Integration Testing**
- [ ] Test cross-program interactions
- [ ] Test account size limits and pruning
- [ ] Test permission inheritance and revocation
- [ ] Test concurrent access scenarios
- [ ] Test upgrade and migration paths

#### **Fuzzing and Stress Testing**
- [ ] Fuzz signature verification inputs
- [ ] Stress test nonce window implementation
- [ ] Load test permission lookup performance
- [ ] Test account space exhaustion scenarios
- [ ] Test delegation chain complexity limits

#### **Security Audit Requirements**
- [ ] External security audit by qualified blockchain security firm
- [ ] Code review by independent Solana experts
- [ ] Formal verification of critical security properties where applicable
- [ ] Bug bounty program for additional vulnerability discovery

### Deployment Checklist

#### **Mainnet Deployment**
- [ ] Comprehensive testnet validation
- [ ] Security audit completion and issue resolution
- [ ] Performance benchmarking and optimization
- [ ] Documentation and integration guides
- [ ] Emergency response procedures
- [ ] Monitoring and alerting infrastructure

This security checklist must be completed and verified before any access control proposal moves to implementation phase.