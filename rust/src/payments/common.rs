//! Common payment types and utilities

use crate::errors::{SdkError, SdkResult};
use borsh::{BorshDeserialize, BorshSerialize};
use solana_sdk::{
    instruction::{AccountMeta, Instruction},
    pubkey::Pubkey,
    system_program,
};

/// Token mint addresses for different networks
pub const A2AMPL_TOKEN_MINT_MAINNET: &str = "Cpzvdx6pppc9TNArsGsqgShCsKC9NCCjA2gtzHvUpump";
pub const A2AMPL_TOKEN_MINT_DEVNET: &str = "A2AMPLyncKHwfSnwRNsJ2qsjsetgo9fGkP8YZPsDZ9mE";

/// Token decimals
pub const A2AMPL_DECIMALS: u8 = 9;
pub const A2AMPL_BASE_UNIT: u64 = 1_000_000_000; // 10^9

/// Fee constants (in base units)
pub const AGENT_REGISTRATION_FEE: u64 = 100_000_000_000; // 100 A2AMPL
pub const MCP_REGISTRATION_FEE: u64 = 50_000_000_000; // 50 A2AMPL

/// Service fee constants (in base units)
pub const MIN_SERVICE_FEE: u64 = 1_000_000_000; // 1.0 A2AMPL
pub const MIN_TOOL_FEE: u64 = 1_000_000_000; // 1.0 A2AMPL
pub const MIN_RESOURCE_FEE: u64 = 500_000_000; // 0.5 A2AMPL
pub const MIN_PROMPT_FEE: u64 = 2_000_000_000; // 2.0 A2AMPL

/// Staking tier amounts (in base units)
pub const BRONZE_TIER_STAKE: u64 = 1_000_000_000_000; // 1,000 A2AMPL
pub const SILVER_TIER_STAKE: u64 = 10_000_000_000_000; // 10,000 A2AMPL
pub const GOLD_TIER_STAKE: u64 = 50_000_000_000_000; // 50,000 A2AMPL
pub const PLATINUM_TIER_STAKE: u64 = 100_000_000_000_000; // 100,000 A2AMPL

/// Lock periods (in seconds)
pub const BRONZE_LOCK_PERIOD: i64 = 2_592_000; // 30 days
pub const SILVER_LOCK_PERIOD: i64 = 7_776_000; // 90 days
pub const GOLD_LOCK_PERIOD: i64 = 15_552_000; // 180 days
pub const PLATINUM_LOCK_PERIOD: i64 = 31_536_000; // 365 days

/// Minimum and maximum limits
pub const MIN_STAKE_AMOUNT: u64 = 500_000_000_000; // 500 A2AMPL
pub const MIN_LOCK_PERIOD: i64 = 604_800; // 7 days
pub const MAX_LOCK_PERIOD: i64 = 63_072_000; // 2 years

/// Priority multipliers (percentage, 100 = 1.0x)
pub const MIN_PRIORITY_MULTIPLIER: u8 = 100; // 1.0x
pub const MAX_PRIORITY_MULTIPLIER: u8 = 255; // 2.55x (maximum for u8)

/// Staking tiers
#[derive(Debug, Clone, Copy, PartialEq, Eq, BorshSerialize, BorshDeserialize)]
pub enum StakingTier {
    Bronze,
    Silver,
    Gold,
    Platinum,
}

impl StakingTier {
    /// Get the required stake amount for this tier
    pub fn required_stake(&self) -> u64 {
        match self {
            StakingTier::Bronze => BRONZE_TIER_STAKE,
            StakingTier::Silver => SILVER_TIER_STAKE,
            StakingTier::Gold => GOLD_TIER_STAKE,
            StakingTier::Platinum => PLATINUM_TIER_STAKE,
        }
    }

    /// Get the lock period for this tier
    pub fn lock_period(&self) -> i64 {
        match self {
            StakingTier::Bronze => BRONZE_LOCK_PERIOD,
            StakingTier::Silver => SILVER_LOCK_PERIOD,
            StakingTier::Gold => GOLD_LOCK_PERIOD,
            StakingTier::Platinum => PLATINUM_LOCK_PERIOD,
        }
    }

    /// Determine tier from stake amount
    pub fn from_stake_amount(amount: u64) -> Option<Self> {
        if amount >= PLATINUM_TIER_STAKE {
            Some(StakingTier::Platinum)
        } else if amount >= GOLD_TIER_STAKE {
            Some(StakingTier::Gold)
        } else if amount >= SILVER_TIER_STAKE {
            Some(StakingTier::Silver)
        } else if amount >= BRONZE_TIER_STAKE {
            Some(StakingTier::Bronze)
        } else {
            None
        }
    }
}

/// Payment configuration
#[derive(Debug, Clone, BorshSerialize, BorshDeserialize)]
pub struct PaymentConfig {
    pub base_fee: u64,
    pub priority_multiplier: u8,
    pub accepts_escrow: bool,
}

impl PaymentConfig {
    pub fn new(base_fee: u64, priority_multiplier: u8, accepts_escrow: bool) -> SdkResult<Self> {
        if base_fee < MIN_SERVICE_FEE {
            return Err(SdkError::FeeTooLow);
        }

        if priority_multiplier < MIN_PRIORITY_MULTIPLIER
            || priority_multiplier > MAX_PRIORITY_MULTIPLIER
        {
            return Err(SdkError::InvalidPriorityMultiplier);
        }

        Ok(Self {
            base_fee,
            priority_multiplier,
            accepts_escrow,
        })
    }

    /// Calculate the effective fee with priority multiplier
    pub fn effective_fee(&self) -> u64 {
        (self.base_fee * self.priority_multiplier as u64) / 100
    }
}

/// Payment method types
#[derive(Debug, Clone, Copy, PartialEq, Eq, BorshSerialize, BorshDeserialize)]
pub enum PaymentMethod {
    /// Direct payment for each service call
    PayAsYouGo,
    /// Prepaid balance that gets decremented
    Prepaid,
    /// Streaming payment over time
    Streaming,
}

/// Payment transaction result
#[derive(Debug, Clone)]
pub struct PaymentResult {
    pub signature: solana_sdk::signature::Signature,
    pub amount_paid: u64,
    pub remaining_balance: Option<u64>,
    pub payment_method: PaymentMethod,
}

/// Token utility functions
pub fn convert_a2ampl_to_base_units(a2ampl_amount: f64) -> u64 {
    (a2ampl_amount * A2AMPL_BASE_UNIT as f64) as u64
}

pub fn convert_base_units_to_a2ampl(base_units: u64) -> f64 {
    base_units as f64 / A2AMPL_BASE_UNIT as f64
}

/// Get the appropriate token mint for the network
pub fn get_token_mint_for_network(is_mainnet: bool) -> SdkResult<Pubkey> {
    let mint_str = if is_mainnet {
        A2AMPL_TOKEN_MINT_MAINNET
    } else {
        A2AMPL_TOKEN_MINT_DEVNET
    };

    mint_str
        .parse()
        .map_err(|_| SdkError::InvalidConfiguration("Invalid token mint address".to_string()))
}

/// Validate stake amount and lock period
pub fn validate_staking_params(amount: u64, lock_period: i64) -> SdkResult<()> {
    if amount < MIN_STAKE_AMOUNT {
        return Err(SdkError::InsufficientStake);
    }

    if lock_period < MIN_LOCK_PERIOD {
        return Err(SdkError::LockPeriodTooShort);
    }

    if lock_period > MAX_LOCK_PERIOD {
        return Err(SdkError::LockPeriodTooLong);
    }

    Ok(())
}

/// Check if a stake is unlocked based on timestamp
pub fn is_stake_unlocked(stake_timestamp: i64, lock_period: i64, current_timestamp: i64) -> bool {
    current_timestamp >= stake_timestamp + lock_period
}

/// Calculate vault PDA
pub fn derive_vault_pda(program_id: &Pubkey, seed: &[u8]) -> SdkResult<(Pubkey, u8)> {
    let (pda, bump) = Pubkey::find_program_address(&[seed], program_id);
    Ok((pda, bump))
}

/// Derive staking vault PDA
pub fn derive_staking_vault_pda(program_id: &Pubkey) -> SdkResult<(Pubkey, u8)> {
    derive_vault_pda(program_id, b"staking_vault")
}

/// Derive registration vault PDA
pub fn derive_registration_vault_pda(program_id: &Pubkey) -> SdkResult<(Pubkey, u8)> {
    derive_vault_pda(program_id, b"registration_vault")
}

/// Derive fee vault PDA
pub fn derive_fee_vault_pda(program_id: &Pubkey) -> SdkResult<(Pubkey, u8)> {
    derive_vault_pda(program_id, b"fee_vault")
}

#[cfg(test)]
mod tests {
    use super::*;

    #[test]
    fn test_staking_tier_from_amount() {
        assert_eq!(
            StakingTier::from_stake_amount(BRONZE_TIER_STAKE),
            Some(StakingTier::Bronze)
        );
        assert_eq!(
            StakingTier::from_stake_amount(SILVER_TIER_STAKE),
            Some(StakingTier::Silver)
        );
        assert_eq!(
            StakingTier::from_stake_amount(GOLD_TIER_STAKE),
            Some(StakingTier::Gold)
        );
        assert_eq!(
            StakingTier::from_stake_amount(PLATINUM_TIER_STAKE),
            Some(StakingTier::Platinum)
        );

        // Test borderline cases
        assert_eq!(StakingTier::from_stake_amount(BRONZE_TIER_STAKE - 1), None);
        assert_eq!(
            StakingTier::from_stake_amount(SILVER_TIER_STAKE - 1),
            Some(StakingTier::Bronze)
        );
        assert_eq!(
            StakingTier::from_stake_amount(GOLD_TIER_STAKE - 1),
            Some(StakingTier::Silver)
        );
        assert_eq!(
            StakingTier::from_stake_amount(PLATINUM_TIER_STAKE - 1),
            Some(StakingTier::Gold)
        );
    }

    #[test]
    fn test_payment_config() {
        let config = PaymentConfig::new(MIN_SERVICE_FEE, 150, true).unwrap();
        assert_eq!(config.base_fee, MIN_SERVICE_FEE);
        assert_eq!(config.priority_multiplier, 150);
        assert!(config.accepts_escrow);

        // Test effective fee calculation
        assert_eq!(config.effective_fee(), (MIN_SERVICE_FEE * 150) / 100);
    }

    #[test]
    fn test_payment_config_validation() {
        // Test fee too low
        let result = PaymentConfig::new(MIN_SERVICE_FEE - 1, 100, false);
        assert!(matches!(result, Err(SdkError::FeeTooLow)));

        // Test invalid priority multiplier
        let result = PaymentConfig::new(MIN_SERVICE_FEE, MIN_PRIORITY_MULTIPLIER - 1, false);
        assert!(matches!(result, Err(SdkError::InvalidPriorityMultiplier)));

        // Test at maximum
        let result = PaymentConfig::new(MIN_SERVICE_FEE, MAX_PRIORITY_MULTIPLIER, false);
        assert!(result.is_ok());
    }

    #[test]
    fn test_token_conversion() {
        assert_eq!(convert_a2ampl_to_base_units(1.0), A2AMPL_BASE_UNIT);
        assert_eq!(convert_a2ampl_to_base_units(100.0), 100 * A2AMPL_BASE_UNIT);

        assert_eq!(convert_base_units_to_a2ampl(A2AMPL_BASE_UNIT), 1.0);
        assert_eq!(convert_base_units_to_a2ampl(100 * A2AMPL_BASE_UNIT), 100.0);
    }

    #[test]
    fn test_staking_validation() {
        // Valid params
        assert!(validate_staking_params(MIN_STAKE_AMOUNT, MIN_LOCK_PERIOD).is_ok());

        // Insufficient stake
        assert!(matches!(
            validate_staking_params(MIN_STAKE_AMOUNT - 1, MIN_LOCK_PERIOD),
            Err(SdkError::InsufficientStake)
        ));

        // Lock period too short
        assert!(matches!(
            validate_staking_params(MIN_STAKE_AMOUNT, MIN_LOCK_PERIOD - 1),
            Err(SdkError::LockPeriodTooShort)
        ));

        // Lock period too long
        assert!(matches!(
            validate_staking_params(MIN_STAKE_AMOUNT, MAX_LOCK_PERIOD + 1),
            Err(SdkError::LockPeriodTooLong)
        ));
    }

    #[test]
    fn test_stake_unlocked() {
        let stake_time = 1000;
        let lock_period = 500;

        // Still locked
        assert!(!is_stake_unlocked(
            stake_time,
            lock_period,
            stake_time + lock_period - 1
        ));

        // Just unlocked
        assert!(is_stake_unlocked(
            stake_time,
            lock_period,
            stake_time + lock_period
        ));

        // Unlocked for a while
        assert!(is_stake_unlocked(
            stake_time,
            lock_period,
            stake_time + lock_period + 100
        ));
    }

    #[test]
    fn test_get_token_mint() {
        let mainnet_mint = get_token_mint_for_network(true).unwrap();
        let devnet_mint = get_token_mint_for_network(false).unwrap();

        assert_ne!(mainnet_mint, devnet_mint);
        assert_ne!(mainnet_mint, Pubkey::default());
        assert_ne!(devnet_mint, Pubkey::default());
    }
}
