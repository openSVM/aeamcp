use anchor_lang::prelude::*;
use anchor_spl::token::{self, Token, TokenAccount, Transfer};
use solana_program::pubkey::Pubkey;

/// Token utility functions for SVMAI token integration
/// Provides helpers for transfers, fee calculations, staking validation, and quality scores

/// Transfer helper with proper PDA derivation for fee collection
pub fn transfer_tokens_with_pda<'info>(
    from: &Account<'info, TokenAccount>,
    to: &Account<'info, TokenAccount>,
    authority: &Signer<'info>,
    token_program: &Program<'info, Token>,
    amount: u64,
) -> Result<()> {
    let cpi_accounts = Transfer {
        from: from.to_account_info(),
        to: to.to_account_info(),
        authority: authority.to_account_info(),
    };
    
    let cpi_ctx = CpiContext::new(token_program.to_account_info(), cpi_accounts);
    token::transfer(cpi_ctx, amount)?;
    
    Ok(())
}

/// Legacy transfer helper for manual account processing (AccountInfo)
pub fn transfer_tokens_with_account_info<'info>(
    from_info: &AccountInfo<'info>,
    to_info: &AccountInfo<'info>,
    authority_info: &AccountInfo<'info>,
    token_program_info: &AccountInfo<'info>,
    amount: u64,
) -> std::result::Result<(), anchor_lang::error::Error> {
    use solana_program::program::invoke;
    use spl_token::instruction::transfer;
    
    // Use raw SPL token transfer instruction for AccountInfo compatibility
    let transfer_instruction = transfer(
        token_program_info.key,
        from_info.key,
        to_info.key,
        authority_info.key,
        &[],
        amount,
    ).map_err(|_| anchor_lang::error::Error::from(anchor_lang::error::ErrorCode::InstructionMissing))?;
    
    invoke(
        &transfer_instruction,
        &[from_info.clone(), to_info.clone(), authority_info.clone()],
    ).map_err(|e| anchor_lang::error::Error::from(anchor_lang::error::ErrorCode::AccountNotInitialized))?;
    
    Ok(())
}

/// Legacy transfer helper with PDA signer for manual account processing (AccountInfo)
pub fn transfer_tokens_with_pda_signer_account_info<'info>(
    from_info: &AccountInfo<'info>,
    to_info: &AccountInfo<'info>,
    authority_info: &AccountInfo<'info>,
    token_program_info: &AccountInfo<'info>,
    amount: u64,
    signer_seeds: &[&[&[u8]]],
) -> std::result::Result<(), anchor_lang::error::Error> {
    use solana_program::program::invoke_signed;
    use spl_token::instruction::transfer;
    
    // Use raw SPL token transfer instruction for AccountInfo compatibility
    let transfer_instruction = transfer(
        token_program_info.key,
        from_info.key,
        to_info.key,
        authority_info.key,
        &[],
        amount,
    ).map_err(|_| anchor_lang::error::Error::from(anchor_lang::error::ErrorCode::InstructionMissing))?;
    
    invoke_signed(
        &transfer_instruction,
        &[from_info.clone(), to_info.clone(), authority_info.clone()],
        signer_seeds,
    ).map_err(|e| anchor_lang::error::Error::from(anchor_lang::error::ErrorCode::AccountNotInitialized))?;
    
    Ok(())
}

/// Transfer tokens using PDA seeds for authority
pub fn transfer_tokens_with_pda_signer<'info>(
    from: &Account<'info, TokenAccount>,
    to: &Account<'info, TokenAccount>,
    authority: &AccountInfo<'info>,
    token_program: &Program<'info, Token>,
    amount: u64,
    seeds: &[&[&[u8]]],
) -> Result<()> {
    let cpi_accounts = Transfer {
        from: from.to_account_info(),
        to: to.to_account_info(),
        authority: authority.to_account_info(),
    };
    
    let cpi_ctx = CpiContext::new_with_signer(
        token_program.to_account_info(),
        cpi_accounts,
        seeds,
    );
    token::transfer(cpi_ctx, amount)?;
    
    Ok(())
}

/// Calculate fee with priority multiplier
pub fn calculate_fee_with_priority(
    base_fee: u64,
    priority_multiplier: u8,
    is_priority: bool,
) -> u64 {
    if is_priority && priority_multiplier > 100 {
        (base_fee * priority_multiplier as u64) / 100
    } else {
        base_fee
    }
}

/// Staking tier validation for agents
#[derive(Debug, Clone, Copy, PartialEq)]
pub enum StakingTier {
    None = 0,
    Bronze = 1,
    Silver = 2,
    Gold = 3,
    Platinum = 4,
}

impl StakingTier {
    /// Get tier from staked amount (in base units with 9 decimals)
    pub fn from_amount(amount: u64) -> Self {
        match amount {
            0..=999_999_999_999 => StakingTier::None, // < 1,000 SVMAI
            1_000_000_000_000..=9_999_999_999_999 => StakingTier::Bronze, // 1K - 10K
            10_000_000_000_000..=49_999_999_999_999 => StakingTier::Silver, // 10K - 50K
            50_000_000_000_000..=99_999_999_999_999 => StakingTier::Gold, // 50K - 100K
            _ => StakingTier::Platinum, // >= 100K
        }
    }
    
    /// Get minimum stake required for tier
    pub fn min_stake(&self) -> u64 {
        match self {
            StakingTier::None => 0,
            StakingTier::Bronze => 1_000 * 1_000_000_000, // 1,000 SVMAI
            StakingTier::Silver => 10_000 * 1_000_000_000, // 10,000 SVMAI
            StakingTier::Gold => 50_000 * 1_000_000_000, // 50,000 SVMAI
            StakingTier::Platinum => 100_000 * 1_000_000_000, // 100,000 SVMAI
        }
    }
    
    /// Get lock period in seconds
    pub fn lock_period(&self) -> i64 {
        match self {
            StakingTier::None => 0,
            StakingTier::Bronze => 30 * 24 * 60 * 60, // 30 days
            StakingTier::Silver => 90 * 24 * 60 * 60, // 90 days
            StakingTier::Gold => 180 * 24 * 60 * 60, // 180 days
            StakingTier::Platinum => 365 * 24 * 60 * 60, // 365 days
        }
    }
    
    /// Get tier value as u8
    pub fn value(&self) -> u8 {
        *self as u8
    }
}

/// Server verification tier
#[derive(Debug, Clone, Copy, PartialEq)]
pub enum VerificationTier {
    Basic = 0,
    Verified = 1,
    Premium = 2,
}

impl VerificationTier {
    /// Get tier from staked amount (in base units with 9 decimals)
    pub fn from_amount(amount: u64) -> std::result::Result<Self, crate::error::RegistryError> {
        match amount {
            0..=499_999_999_999 => {
                return Err(crate::error::RegistryError::InsufficientStake);
            }
            500_000_000_000..=4_999_999_999_999 => Ok(VerificationTier::Basic), // 500 - 5K
            5_000_000_000_000..=24_999_999_999_999 => Ok(VerificationTier::Verified), // 5K - 25K
            _ => Ok(VerificationTier::Premium), // >= 25K
        }
    }
    
    /// Get minimum stake required for tier
    pub fn min_stake(&self) -> u64 {
        match self {
            VerificationTier::Basic => 500 * 1_000_000_000, // 500 SVMAI
            VerificationTier::Verified => 5_000 * 1_000_000_000, // 5,000 SVMAI
            VerificationTier::Premium => 25_000 * 1_000_000_000, // 25,000 SVMAI
        }
    }
    
    /// Get tier value as u8
    pub fn value(&self) -> u8 {
        *self as u8
    }
}

/// Calculate agent quality score based on performance metrics
pub fn calculate_agent_quality_score(
    completed_services: u32,
    quality_ratings: &[u8],
    dispute_wins: u16,
    dispute_count: u16,
    response_time_avg: u32,
) -> u64 {
    // Average rating calculation
    let avg_rating = if quality_ratings.is_empty() {
        0
    } else {
        let sum: u64 = quality_ratings.iter().map(|&r| r as u64).sum();
        sum / quality_ratings.len() as u64
    };
    
    // Dispute win ratio
    let dispute_ratio = if dispute_count == 0 {
        100
    } else {
        (dispute_wins as u64 * 100) / dispute_count as u64
    };
    
    // Response time score (faster is better)
    let response_score = match response_time_avg {
        0..=300 => 100, // < 5 min
        301..=900 => 80, // 5-15 min
        901..=3600 => 60, // 15-60 min
        3601..=86400 => 40, // 1-24 hours
        _ => 20, // > 24 hours
    };
    
    // Weighted formula
    let service_score = (completed_services as u64).min(1000) * 5; // Max 5000
    let rating_score = avg_rating * 600; // Max 3000 (5 * 600)
    let dispute_score = dispute_ratio * 10; // Max 1000
    let response_bonus = response_score * 10; // Max 1000
    
    (service_score + rating_score + dispute_score + response_bonus).min(10000)
}

/// Calculate server quality score based on performance metrics
pub fn calculate_server_quality_score(
    uptime_percentage: u8,
    avg_response_time: u32,
    error_rate: u8,
    total_uses: u64,
) -> u64 {
    // Uptime score (0-4000)
    let uptime_score = (uptime_percentage.min(100) as u64 * 40).min(4000);
    
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

/// Calculate bulk discount for MCP server usage
pub fn calculate_bulk_discount(
    base_fee: u64,
    count: u32,
    bulk_threshold: u32,
    bulk_discount_percentage: u8,
) -> u64 {
    let total_fee = base_fee * count as u64;
    
    if count >= bulk_threshold && bulk_discount_percentage > 0 {
        let discount = (total_fee * bulk_discount_percentage.min(50) as u64) / 100;
        total_fee.saturating_sub(discount)
    } else {
        total_fee
    }
}

/// Validate fee configuration
pub fn validate_fee_config(
    base_fee: u64,
    min_fee: u64,
    priority_multiplier: u16,
) -> std::result::Result<(), crate::error::RegistryError> {
    if base_fee < min_fee {
        return Err(crate::error::RegistryError::FeeTooLow);
    }
    
    if priority_multiplier < crate::constants::MIN_PRIORITY_MULTIPLIER || priority_multiplier > crate::constants::MAX_PRIORITY_MULTIPLIER {
        return Err(crate::error::RegistryError::InvalidMultiplier);
    }
    
    Ok(())
}

/// Derive PDA for token vaults
pub fn derive_staking_vault_pda(program_id: &Pubkey) -> (Pubkey, u8) {
    Pubkey::find_program_address(&[b"staking_vault"], program_id)
}

pub fn derive_fee_vault_pda(program_id: &Pubkey) -> (Pubkey, u8) {
    Pubkey::find_program_address(&[b"fee_vault"], program_id)
}

pub fn derive_registration_vault_pda(program_id: &Pubkey) -> (Pubkey, u8) {
    Pubkey::find_program_address(&[b"registration_vault"], program_id)
}

/// Check if stake lock period has expired
pub fn is_stake_unlocked(stake_locked_until: i64, current_timestamp: i64) -> bool {
    current_timestamp >= stake_locked_until
}

/// Calculate staking rewards based on tier and duration
pub fn calculate_staking_rewards(
    staked_amount: u64,
    staking_duration: i64, // in seconds
    tier: StakingTier,
) -> u64 {
    // Base APY: 8%
    const BASE_RATE: u64 = 8;
    // Max APY: 12%
    const MAX_RATE: u64 = 12;
    
    // Tier bonus
    let tier_bonus = match tier {
        StakingTier::None => 0,
        StakingTier::Bronze => 1,
        StakingTier::Silver => 2,
        StakingTier::Gold => 3,
        StakingTier::Platinum => 4,
    };
    
    let annual_rate = BASE_RATE + tier_bonus;
    let rate = annual_rate.min(MAX_RATE);
    
    // Calculate rewards: (amount * rate * duration) / (100 * seconds_per_year)
    let seconds_per_year = 365 * 24 * 60 * 60;
    (staked_amount * rate * staking_duration as u64) / (100 * seconds_per_year)
}

#[cfg(test)]
mod tests {
    use super::*;

    #[test]
    fn test_staking_tiers() {
        // Test tier boundaries
        assert_eq!(StakingTier::from_amount(0), StakingTier::None);
        assert_eq!(StakingTier::from_amount(999_999_999_999), StakingTier::None);
        assert_eq!(StakingTier::from_amount(1_000_000_000_000), StakingTier::Bronze);
        assert_eq!(StakingTier::from_amount(10_000_000_000_000), StakingTier::Silver);
        assert_eq!(StakingTier::from_amount(50_000_000_000_000), StakingTier::Gold);
        assert_eq!(StakingTier::from_amount(100_000_000_000_000), StakingTier::Platinum);
    }

    #[test]
    fn test_quality_score_calculation() {
        // Test perfect score
        let score = calculate_agent_quality_score(
            1000, // completed services
            &[5, 5, 5, 5, 5], // perfect ratings
            100, // all disputes won
            100, // total disputes
            60, // 1 minute response time
        );
        assert_eq!(score, 10000); // max score
        
        // Test average score
        let score = calculate_agent_quality_score(
            100,
            &[3, 4, 3, 4, 3],
            50,
            100,
            1800, // 30 min
        );
        assert!(score > 5000 && score < 7000);
    }

    #[test]
    fn test_bulk_discount() {
        // No discount
        let fee = calculate_bulk_discount(1_000_000_000, 10, 20, 10);
        assert_eq!(fee, 10_000_000_000);
        
        // With discount
        let fee = calculate_bulk_discount(1_000_000_000, 25, 20, 10);
        assert_eq!(fee, 22_500_000_000); // 10% discount
    }
}