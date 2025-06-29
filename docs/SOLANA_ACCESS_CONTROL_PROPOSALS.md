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
    ExecuteWithSignature {
        operation: AgentOperation,
        signature: [u8; 64],
        message: Vec<u8>,
        nonce: u64,
        timestamp: i64,
    },
    
    /// Grant access rights to another wallet
    GrantAccess {
        target_wallet: Pubkey,
        permissions: AccessPermissions,
        expiry: Option<i64>,
    },
    
    /// Revoke access rights
    RevokeAccess {
        target_wallet: Pubkey,
    },
}

#[derive(BorshSerialize, BorshDeserialize)]
pub struct AccessPermissions {
    pub can_read: bool,
    pub can_update: bool,
    pub can_transfer: bool,
    pub can_execute: bool,
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
```

### Storage Structure
```rust
// Extend AgentRegistryEntry
pub struct AgentRegistryEntry {
    // ... existing fields ...
    pub access_control: AccessControlData,
}

pub struct AccessControlData {
    pub owner: Pubkey,
    pub nonce_tracker: u64,
    pub granted_permissions: Vec<AccessGrant>,
}

pub struct AccessGrant {
    pub wallet: Pubkey,
    pub permissions: AccessPermissions,
    pub granted_at: i64,
    pub expires_at: Option<i64>,
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
    pub nonce_counter: u64,
    pub permissions: Vec<PermissionGrant>,
    pub used_nonces: Vec<u64>, // Or use a more efficient structure
}

#[derive(BorshSerialize, BorshDeserialize)]
pub struct PermissionGrant {
    pub wallet: Pubkey,
    pub operations: Vec<String>,
    pub granted_at: i64,
    pub expires_at: Option<i64>,
    pub can_delegate: bool,
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
// Separate access control entries
#[account]
pub struct AccessControlEntry {
    pub resource_type: ResourceType,
    pub resource_id: String,
    pub owner: Pubkey,
    pub nonce_tracker: u64,
    pub permissions_map: HashMap<Pubkey, Vec<Permission>>,
    pub created_at: i64,
    pub updated_at: i64,
}

// Nonce tracking per wallet per resource
#[account]
pub struct NonceTracker {
    pub resource_key: String, // Derived from resource_type + resource_id
    pub wallet: Pubkey,
    pub last_nonce: u64,
    pub used_nonces: Vec<u64>, // Recent nonces to prevent replay
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
// Enhanced common crate with signature verification
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
        // Ed25519 signature verification logic
        // Nonce validation
        // Timestamp validation
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
| **Reusability** | Low | High | Medium | Medium |
| **Performance** | High | Medium | Medium | High |
| **Complexity** | Low | High | Medium | Medium |
| **Standardization** | Low | High | High | Low |
| **Maintenance** | Easy | Hard | Medium | Medium |
| **Flexibility** | Low | Medium | Medium | High |
| **Cross-program compatibility** | No | Yes | Yes | No |
| **Development effort** | Low | High | Medium | Low |

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