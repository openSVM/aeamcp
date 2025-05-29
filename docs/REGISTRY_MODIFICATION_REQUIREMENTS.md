# Registry Modification Requirements Document

## Executive Summary

This document details the specific modifications required to integrate SVMAI token functionality into the existing Agent Registry and MCP Server Registry programs. All modifications maintain backward compatibility while adding token-based features.

## 1. Agent Registry Modifications

### 1.1 State Structure Updates

#### Current State (programs/agent-registry/src/state.rs)
```rust
// Lines 15-68: Current AgentRegistryEntryV1 structure
pub struct AgentRegistryEntryV1 {
    pub bump: u8,
    pub registry_version: u8,
    pub state_version: u64,
    pub operation_in_progress: bool,
    pub owner_authority: Pubkey,
    // ... existing fields
}
```

#### Required Additions
```rust
// Add after line 67 in state.rs
// Token-related fields
pub staked_amount: u64,              // Amount of SVMAI tokens staked
pub staking_timestamp: i64,          // When tokens were staked
pub stake_locked_until: i64,         // Lock period end timestamp
pub staking_tier: u8,                // 0: None, 1: Bronze, 2: Silver, 3: Gold, 4: Platinum

// Economic tracking
pub total_earnings: u64,             // Total SVMAI earned from services
pub active_escrows: u8,              // Current number of active service escrows
pub completed_services: u32,         // Total completed services
pub dispute_count: u16,              // Total disputes (won + lost)
pub dispute_wins: u16,               // Disputes won by agent

// Reputation system
pub reputation_score: u64,           // Calculated reputation (0-10000)
pub quality_ratings: Vec<u8>,        // Last 10 service ratings (1-5)
pub response_time_avg: u32,          // Average response time in seconds

// Fee configuration
pub base_service_fee: u64,           // Minimum SVMAI fee for services
pub priority_multiplier: u8,         // 100 = 1x, 150 = 1.5x, etc.
pub accepts_escrow: bool,            // Whether agent uses escrow system

// Token integration metadata
pub registration_fee_paid: u64,      // Amount paid for registration
pub last_fee_update: i64,            // Timestamp of last fee update
```

#### Space Calculation Update
```rust
// Update line 72 in state.rs
pub const SPACE: usize = 8 // Discriminator
    + existing_size // ... current fields
    + 8  // staked_amount
    + 8  // staking_timestamp
    + 8  // stake_locked_until
    + 1  // staking_tier
    + 8  // total_earnings
    + 1  // active_escrows
    + 4  // completed_services
    + 2  // dispute_count
    + 2  // dispute_wins
    + 8  // reputation_score
    + 4 + (10 * 1) // quality_ratings (Vec<u8> max 10)
    + 4  // response_time_avg
    + 8  // base_service_fee
    + 1  // priority_multiplier
    + 1  // accepts_escrow
    + 8  // registration_fee_paid
    + 8; // last_fee_update
```

### 1.2 New Instructions

#### Add to programs/agent-registry/src/instruction.rs
```rust
#[derive(BorshSerialize, BorshDeserialize, Clone, Debug, PartialEq)]
pub enum AgentRegistryInstruction {
    // ... existing variants

    /// Stake SVMAI tokens for tier benefits
    /// Accounts:
    /// 0. [signer] Agent owner
    /// 1. [writable] Agent registry PDA
    /// 2. [writable] Agent's token account
    /// 3. [writable] Staking vault token account
    /// 4. [] Token program
    /// 5. [] Clock sysvar
    StakeTokens {
        amount: u64,
        lock_period: i64, // in seconds
    },

    /// Unstake tokens after lock period
    /// Accounts:
    /// 0. [signer] Agent owner
    /// 1. [writable] Agent registry PDA
    /// 2. [writable] Staking vault token account
    /// 3. [writable] Agent's token account
    /// 4. [] Token program
    /// 5. [] Clock sysvar
    UnstakeTokens {
        amount: u64,
    },

    /// Update service fee configuration
    /// Accounts:
    /// 0. [signer] Agent owner
    /// 1. [writable] Agent registry PDA
    /// 2. [] Clock sysvar
    UpdateServiceFees {
        base_fee: u64,
        priority_multiplier: u8,
        accepts_escrow: bool,
    },

    /// Record service completion (called by escrow)
    /// Accounts:
    /// 0. [signer] Escrow program
    /// 1. [writable] Agent registry PDA
    /// 2. [] Clock sysvar
    RecordServiceCompletion {
        earnings: u64,
        rating: u8,
        response_time: u32,
    },

    /// Record dispute outcome (called by DDR)
    /// Accounts:
    /// 0. [signer] DDR program
    /// 1. [writable] Agent registry PDA
    RecordDisputeOutcome {
        won: bool,
    },
}
```

### 1.3 Validation Updates

#### Add to programs/agent-registry/src/validation.rs
```rust
/// Validate staking amount meets tier requirements
pub fn validate_staking_tier(amount: u64) -> Result<u8, RegistryError> {
    match amount {
        0..=999 => Ok(0), // No tier
        1_000..=9_999 => Ok(1), // Bronze
        10_000..=49_999 => Ok(2), // Silver
        50_000..=99_999 => Ok(3), // Gold
        _ => Ok(4), // Platinum
    }
}

/// Validate service fee configuration
pub fn validate_service_fees(
    base_fee: u64,
    priority_multiplier: u8,
) -> Result<(), RegistryError> {
    if base_fee < MIN_SERVICE_FEE {
        return Err(RegistryError::FeeTooLow);
    }
    if priority_multiplier < 100 || priority_multiplier > 300 {
        return Err(RegistryError::InvalidMultiplier);
    }
    Ok(())
}

/// Calculate reputation score
pub fn calculate_reputation_score(
    completed_services: u32,
    quality_ratings: &[u8],
    dispute_wins: u16,
    dispute_count: u16,
) -> u64 {
    let avg_rating = if quality_ratings.is_empty() {
        0
    } else {
        quality_ratings.iter().map(|&r| r as u64).sum::<u64>() / quality_ratings.len() as u64
    };
    
    let dispute_ratio = if dispute_count == 0 {
        100
    } else {
        (dispute_wins as u64 * 100) / dispute_count as u64
    };
    
    // Weighted formula
    let base_score = completed_services as u64 * 10;
    let rating_bonus = avg_rating * 200;
    let dispute_bonus = dispute_ratio * 20;
    
    (base_score + rating_bonus + dispute_bonus).min(10000)
}
```

### 1.4 New Constants

#### Add to programs/common/src/constants.rs
```rust
// Token staking tiers (in SVMAI base units)
pub const BRONZE_TIER_STAKE: u64 = 1_000 * 1_000_000; // 1,000 SVMAI
pub const SILVER_TIER_STAKE: u64 = 10_000 * 1_000_000; // 10,000 SVMAI
pub const GOLD_TIER_STAKE: u64 = 50_000 * 1_000_000; // 50,000 SVMAI
pub const PLATINUM_TIER_STAKE: u64 = 100_000 * 1_000_000; // 100,000 SVMAI

// Lock periods (in seconds)
pub const BRONZE_LOCK_PERIOD: i64 = 30 * 24 * 60 * 60; // 30 days
pub const SILVER_LOCK_PERIOD: i64 = 90 * 24 * 60 * 60; // 90 days
pub const GOLD_LOCK_PERIOD: i64 = 180 * 24 * 60 * 60; // 180 days
pub const PLATINUM_LOCK_PERIOD: i64 = 365 * 24 * 60 * 60; // 365 days

## 2. MCP Server Registry Modifications

### 2.1 State Structure Updates

#### Current State (programs/mcp-server-registry/src/state.rs)
```rust
// Lines 19-64: Current McpServerRegistryEntryV1 structure
pub struct McpServerRegistryEntryV1 {
    pub bump: u8,
    pub registry_version: u8,
    pub state_version: u64,
    pub operation_in_progress: bool,
    pub owner_authority: Pubkey,
    // ... existing fields
}
```

#### Required Additions
```rust
// Add after line 63 in state.rs
// Token staking fields
pub verification_stake: u64,         // SVMAI staked for verification
pub staking_timestamp: i64,          // When tokens were staked
pub stake_locked_until: i64,         // Lock period end
pub verification_tier: u8,           // 0: Basic, 1: Verified, 2: Premium

// Usage tracking
pub total_tool_calls: u64,           // Total tool invocations
pub total_resource_accesses: u64,    // Total resource fetches
pub total_prompt_uses: u64,          // Total prompt executions
pub total_fees_collected: u64,       // Total SVMAI earned

// Quality metrics
pub quality_score: u64,              // Server quality metric (0-10000)
pub uptime_percentage: u8,           // Last 30 days uptime (0-100)
pub avg_response_time: u32,          // Average response time in ms
pub error_rate: u8,                  // Error percentage (0-100)

// Fee structures
pub tool_base_fee: u64,              // Base fee per tool call
pub resource_base_fee: u64,          // Base fee per resource access
pub prompt_base_fee: u64,            // Base fee per prompt use
pub bulk_discount_threshold: u32,    // Number of calls for discount
pub bulk_discount_percentage: u8,    // Discount percentage (0-50)

// Economic metadata
pub registration_fee_paid: u64,      // Amount paid for registration
pub last_fee_collection: i64,        // Timestamp of last fee collection
pub pending_fees: u64,               // Uncollected fees
```

#### Fee Structure Types
```rust
// Add new structs for fee management
#[derive(BorshSerialize, BorshDeserialize, Clone, Debug, PartialEq)]
pub struct UsageTier {
    pub calls_threshold: u32,        // Number of calls to reach tier
    pub discount_percentage: u8,     // Discount applied (0-50)
}

#[derive(BorshSerialize, BorshDeserialize, Clone, Debug, PartialEq)]
pub struct FeeConfiguration {
    pub base_fee: u64,               // Base fee in SVMAI
    pub priority_multiplier: u8,     // For priority requests
    pub tiers: Vec<UsageTier>,       // Volume discount tiers
}
```

### 2.2 New Instructions

#### Add to programs/mcp-server-registry/src/instruction.rs
```rust
#[derive(BorshSerialize, BorshDeserialize, Clone, Debug, PartialEq)]
pub enum McpServerRegistryInstruction {
    // ... existing variants

    /// Stake tokens for server verification
    /// Accounts:
    /// 0. [signer] Server owner
    /// 1. [writable] Server registry PDA
    /// 2. [writable] Owner's token account
    /// 3. [writable] Verification vault token account
    /// 4. [] Token program
    /// 5. [] Clock sysvar
    StakeForVerification {
        amount: u64,
        lock_period: i64,
    },

    /// Configure usage fees
    /// Accounts:
    /// 0. [signer] Server owner
    /// 1. [writable] Server registry PDA
    /// 2. [] Clock sysvar
    ConfigureUsageFees {
        tool_base_fee: u64,
        resource_base_fee: u64,
        prompt_base_fee: u64,
        bulk_discount_threshold: u32,
        bulk_discount_percentage: u8,
    },

    /// Record usage and collect fees
    /// Accounts:
    /// 0. [signer] User (caller)
    /// 1. [writable] Server registry PDA
    /// 2. [writable] User's token account
    /// 3. [writable] Server's token account
    /// 4. [] Token program
    /// 5. [] Clock sysvar
    RecordUsageAndCollectFee {
        usage_type: UsageType,
        count: u32,
    },

    /// Update quality metrics (oracle/monitoring service)
    /// Accounts:
    /// 0. [signer] Authorized oracle
    /// 1. [writable] Server registry PDA
    UpdateQualityMetrics {
        uptime_percentage: u8,
        avg_response_time: u32,
        error_rate: u8,
    },

    /// Withdraw pending fees
    /// Accounts:
    /// 0. [signer] Server owner
    /// 1. [writable] Server registry PDA
    /// 2. [writable] Fee vault token account
    /// 3. [writable] Owner's token account
    /// 4. [] Token program
    WithdrawPendingFees,
}

#[derive(BorshSerialize, BorshDeserialize, Clone, Debug, PartialEq)]
pub enum UsageType {
    Tool,
    Resource,
    Prompt,
}
```

### 2.3 Validation Updates

#### Add to programs/mcp-server-registry/src/validation.rs
```rust
/// Validate verification stake tier
pub fn validate_verification_tier(amount: u64) -> Result<u8, RegistryError> {
    match amount {
        0..=499 => Err(RegistryError::InsufficientStake),
        500..=4_999 => Ok(0), // Basic
        5_000..=24_999 => Ok(1), // Verified
        _ => Ok(2), // Premium
    }
}

/// Calculate usage fee with discounts
pub fn calculate_usage_fee(
    base_fee: u64,
    count: u32,
    bulk_threshold: u32,
    bulk_discount: u8,
    is_priority: bool,
) -> u64 {
    let mut fee = base_fee * count as u64;
    
    // Apply bulk discount if applicable
    if count >= bulk_threshold && bulk_discount > 0 {
        let discount = (fee * bulk_discount as u64) / 100;
        fee = fee.saturating_sub(discount);
    }
    
    // Apply priority multiplier
    if is_priority {
        fee = (fee * 150) / 100; // 1.5x for priority
    }
    
    fee
}

/// Calculate server quality score
pub fn calculate_quality_score(
    uptime: u8,
    avg_response_time: u32,
    error_rate: u8,
    total_uses: u64,
) -> u64 {
    // Base score from uptime (0-4000)
    let uptime_score = (uptime as u64 * 40).min(4000);
    
    // Response time score (0-3000)
    let response_score = match avg_response_time {
        0..=100 => 3000,
        101..=500 => 2000,
        501..=1000 => 1000,
        _ => 0,
    };
    
    // Error rate score (0-2000)
    let error_score = ((100 - error_rate.min(100)) as u64 * 20).min(2000);
    
    // Usage bonus (0-1000)
    let usage_bonus = (total_uses / 1000).min(1000);
    
    uptime_score + response_score + error_score + usage_bonus
}
```

### 2.4 New Constants

#### Add to programs/common/src/constants.rs
```rust
// MCP Server verification stakes (in SVMAI base units)
pub const BASIC_SERVER_STAKE: u64 = 500 * 1_000_000; // 500 SVMAI
pub const VERIFIED_SERVER_STAKE: u64 = 5_000 * 1_000_000; // 5,000 SVMAI
pub const PREMIUM_SERVER_STAKE: u64 = 25_000 * 1_000_000; // 25,000 SVMAI

// MCP Server fee limits
pub const MIN_TOOL_FEE: u64 = 1_000_000; // 1 SVMAI
pub const MIN_RESOURCE_FEE: u64 = 500_000; // 0.5 SVMAI
pub const MIN_PROMPT_FEE: u64 = 2_000_000; // 2 SVMAI
pub const MAX_BULK_DISCOUNT: u8 = 50; // 50% maximum discount

// MCP Server registration
pub const MCP_REGISTRATION_FEE: u64 = 50 * 1_000_000; // 50 SVMAI

// Quality metrics
pub const QUALITY_UPDATE_INTERVAL: i64 = 24 * 60 * 60; // 24 hours
pub const MIN_UPTIME_FOR_PREMIUM: u8 = 95; // 95% uptime required
```

## 3. Cross-Program Integration Requirements

### 3.1 Shared Token Accounts

Both registries need to interact with common token accounts:

```rust
// Program-derived addresses for token vaults
pub fn derive_staking_vault_address(program_id: &Pubkey) -> (Pubkey, u8) {
    Pubkey::find_program_address(
        &[b"staking_vault"],
        program_id,
    )
}

pub fn derive_fee_vault_address(program_id: &Pubkey) -> (Pubkey, u8) {
    Pubkey::find_program_address(
        &[b"fee_vault"],
        program_id,
    )
}

pub fn derive_escrow_vault_address(program_id: &Pubkey) -> (Pubkey, u8) {
    Pubkey::find_program_address(
        &[b"escrow_vault"],
        program_id,
    )
}
```

### 3.2 Cross-Program Invocations

The registries need to accept calls from:
- Escrow Program: To update service completion stats
- DDR Program: To record dispute outcomes
- Oracle Program: To update quality metrics

### 3.3 Event Emissions

Both registries must emit events for:
```rust
// Token-related events
#[derive(BorshSerialize, BorshDeserialize)]
pub struct TokensStakedEvent {
    pub registry_type: RegistryType, // Agent or MCP
    pub entity_id: String,
    pub owner: Pubkey,
    pub amount: u64,
    pub new_tier: u8,
    pub locked_until: i64,
}

#[derive(BorshSerialize, BorshDeserialize)]
pub struct FeesCollectedEvent {
    pub registry_type: RegistryType,
    pub entity_id: String,
    pub payer: Pubkey,
    pub amount: u64,
    pub fee_type: FeeType,
}

#[derive(BorshSerialize, BorshDeserialize)]
pub struct ServiceCompletedEvent {
    pub agent_id: String,
    pub escrow_id: [u8; 32],
    pub earnings: u64,
    pub rating: u8,
}
```

## 4. Migration Strategy

### 4.1 Backward Compatibility

All existing registry entries must remain functional:
1. New fields default to zero/empty values
2. Registration continues to work without token payment initially
3. Gradual enforcement of token requirements

### 4.2 Migration Steps

1. **Deploy Updated Programs**
   - Test on devnet with existing data
   - Ensure no breaking changes
   - Deploy with feature flags

2. **Initialize Token Vaults**
   - Create PDAs for each vault type
   - Fund with initial liquidity
   - Set up monitoring

3. **Enable Token Features**
   - Start with optional staking
   - Introduce registration fees
   - Activate usage fees

### 4.3 Data Migration

No data migration required - new fields are additive only.

## 5. Security Considerations

### 5.1 Access Control

```rust
// Add to both registries
pub fn verify_escrow_program(caller: &Pubkey) -> Result<(), RegistryError> {
    if caller != &ESCROW_PROGRAM_ID {
        return Err(RegistryError::UnauthorizedCaller);
    }
    Ok(())
}

pub fn verify_ddr_program(caller: &Pubkey) -> Result<(), RegistryError> {
    if caller != &DDR_PROGRAM_ID {
        return Err(RegistryError::UnauthorizedCaller);
    }
    Ok(())
}

pub fn verify_oracle_program(caller: &Pubkey) -> Result<(), RegistryError> {
    if caller != &ORACLE_PROGRAM_ID {
        return Err(RegistryError::UnauthorizedCaller);
    }
    Ok(())
}
```

### 5.2 Overflow Protection

All token calculations must use checked arithmetic:
```rust
amount.checked_add(fee)
    .ok_or(RegistryError::Overflow)?
```

### 5.3 Reentrancy Guards

Utilize existing `operation_in_progress` flag for all token operations.

## 6. Testing Requirements

### 6.1 Unit Tests

- Test all new validation functions
- Test fee calculations with edge cases
- Test tier determinations

### 6.2 Integration Tests

- Test token transfers between accounts
- Test cross-program invocations
- Test event emissions

### 6.3 Stress Tests

- Test with maximum stake amounts
- Test with high-frequency usage
- Test with concurrent operations

## 7. Monitoring and Analytics

### 7.1 Key Metrics to Track

- Total staked per tier
- Fee collection rates
- Service completion rates
- Dispute frequencies
- Quality score distributions

### 7.2 Indexer Requirements

The indexer must track:
- All token movements
- Tier changes
- Fee collections
- Service completions
- Quality updates

## Conclusion

These modifications enable comprehensive SVMAI token integration while maintaining the existing functionality of both registries. The phased implementation approach ensures smooth adoption with minimal disruption to current users.
// Fee limits
pub const MIN_SERVICE_FEE: u64 = 10 * 1_000_000; // 10 SVMAI minimum
pub const MIN_REGISTRATION_FEE: u64 = 100 * 1_000_000; // 100 SVMAI

// Reputation constants
pub const MAX_QUALITY_RATINGS: usize = 10;
pub const MAX_REPUTATION_SCORE: u64 = 10000;