use anchor_lang::prelude::*;
use anchor_spl::token::{self, Mint, Token, TokenAccount, SetAuthority};
use anchor_spl::associated_token::AssociatedToken;
use spl_token::instruction::AuthorityType;

declare_id!("SVMAitokenxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx");

/// SVMAI Token Program
/// This program manages the SVMAI token with 1 billion supply and 9 decimals.
/// After initial distribution, the mint authority is transferred to a DAO
/// and freeze authority is permanently disabled.
#[program]
pub mod svmai_token {
    use super::*;

    /// Initialize the SVMAI token mint with 1 billion supply
    /// - Total Supply: 1,000,000,000 SVMAI (with 9 decimals)
    /// - Mint Authority: Initially set to deployer, then transferred
    /// - Freeze Authority: Disabled after distribution
    pub fn initialize_token(
        ctx: Context<InitializeToken>,
    ) -> Result<()> {
        msg!("Initializing SVMAI token mint");
        
        // The mint is created through the Anchor constraints
        // Total supply will be minted in the `mint_initial_supply` instruction
        
        Ok(())
    }

    /// Mint the initial supply of 1 billion SVMAI tokens
    /// This should be called immediately after initialization
    /// SECURITY: Can only be called once - prevents multiple minting operations
    pub fn mint_initial_supply(
        ctx: Context<MintInitialSupply>,
    ) -> Result<()> {
        msg!("Minting initial SVMAI supply: 1,000,000,000 tokens");
        
        // CRITICAL SECURITY CHECK: Prevent multiple minting operations
        // If supply is already > 0, initial distribution was already completed
        if ctx.accounts.mint.supply > 0 {
            msg!("Error: Initial supply already minted. Current supply: {}", ctx.accounts.mint.supply);
            return Err(TokenError::DistributionCompleted.into());
        }
        
        // Mint 1 billion tokens (with 9 decimals)
        let amount = 1_000_000_000 * 10u64.pow(9);
        
        // Additional safety check: Verify amount doesn't exceed intended supply
        if amount != 1_000_000_000_000_000_000u64 {
            msg!("Error: Calculated amount {} doesn't match expected 1B tokens", amount);
            return Err(TokenError::DistributionCompleted.into());
        }
        
        token::mint_to(
            CpiContext::new(
                ctx.accounts.token_program.to_account_info(),
                token::MintTo {
                    mint: ctx.accounts.mint.to_account_info(),
                    to: ctx.accounts.distribution_account.to_account_info(),
                    authority: ctx.accounts.mint_authority.to_account_info(),
                },
            ),
            amount,
        )?;
        
        msg!("Successfully minted {} SVMAI tokens. Total supply: {}", amount, ctx.accounts.mint.supply + amount);
        Ok(())
    }

    /// Disable the freeze authority permanently
    /// This ensures tokens can never be frozen
    pub fn disable_freeze_authority(
        ctx: Context<DisableFreezeAuthority>,
    ) -> Result<()> {
        msg!("Disabling freeze authority for SVMAI token");
        
        token::set_authority(
            CpiContext::new(
                ctx.accounts.token_program.to_account_info(),
                SetAuthority {
                    account_or_mint: ctx.accounts.mint.to_account_info(),
                    current_authority: ctx.accounts.freeze_authority.to_account_info(),
                },
            ),
            AuthorityType::FreezeAccount,
            None,
        )?;
        
        msg!("Freeze authority successfully disabled");
        Ok(())
    }

    /// Transfer mint authority to a new authority (e.g., DAO)
    /// This should be done after initial distribution
    pub fn transfer_mint_authority(
        ctx: Context<TransferMintAuthority>,
        new_authority: Pubkey,
    ) -> Result<()> {
        msg!("Transferring mint authority to: {}", new_authority);
        
        token::set_authority(
            CpiContext::new(
                ctx.accounts.token_program.to_account_info(),
                SetAuthority {
                    account_or_mint: ctx.accounts.mint.to_account_info(),
                    current_authority: ctx.accounts.mint_authority.to_account_info(),
                },
            ),
            AuthorityType::MintTokens,
            Some(new_authority),
        )?;
        
        msg!("Mint authority successfully transferred");
        Ok(())
    }

    /// Helper function to create token accounts for distribution
    pub fn create_distribution_account(
        ctx: Context<CreateDistributionAccount>,
    ) -> Result<()> {
        msg!("Creating distribution account for address: {}", ctx.accounts.recipient.key());
        Ok(())
    }
}

#[derive(Accounts)]
pub struct InitializeToken<'info> {
    #[account(
        init,
        payer = payer,
        mint::decimals = 9,
        mint::authority = mint_authority.key(),
        mint::freeze_authority = freeze_authority.key(),
    )]
    pub mint: Account<'info, Mint>,
    
    #[account(mut)]
    pub mint_authority: Signer<'info>,
    
    /// CHECK: Freeze authority that will be disabled
    pub freeze_authority: AccountInfo<'info>,
    
    #[account(mut)]
    pub payer: Signer<'info>,
    
    pub token_program: Program<'info, Token>,
    pub system_program: Program<'info, System>,
    pub rent: Sysvar<'info, Rent>,
}

#[derive(Accounts)]
pub struct MintInitialSupply<'info> {
    #[account(
        mut,
        constraint = mint.mint_authority.is_some() @ TokenError::InvalidMintAuthority,
        constraint = mint.mint_authority.unwrap() == mint_authority.key() @ TokenError::InvalidMintAuthority
    )]
    pub mint: Account<'info, Mint>,
    
    #[account(
        init_if_needed,
        payer = payer,
        associated_token::mint = mint,
        associated_token::authority = mint_authority,
    )]
    pub distribution_account: Account<'info, TokenAccount>,
    
    pub mint_authority: Signer<'info>,
    
    #[account(mut)]
    pub payer: Signer<'info>,
    
    pub token_program: Program<'info, Token>,
    pub associated_token_program: Program<'info, anchor_spl::associated_token::AssociatedToken>,
    pub system_program: Program<'info, System>,
    pub rent: Sysvar<'info, Rent>,
}

#[derive(Accounts)]
pub struct DisableFreezeAuthority<'info> {
    #[account(
        mut,
        constraint = mint.freeze_authority.is_some() @ TokenError::InvalidFreezeAuthority,
        constraint = mint.freeze_authority.unwrap() == freeze_authority.key() @ TokenError::InvalidFreezeAuthority
    )]
    pub mint: Account<'info, Mint>,
    
    pub freeze_authority: Signer<'info>,
    pub token_program: Program<'info, Token>,
}

#[derive(Accounts)]
pub struct TransferMintAuthority<'info> {
    #[account(
        mut,
        constraint = mint.mint_authority.is_some() @ TokenError::InvalidMintAuthority,
        constraint = mint.mint_authority.unwrap() == mint_authority.key() @ TokenError::InvalidMintAuthority
    )]
    pub mint: Account<'info, Mint>,
    
    pub mint_authority: Signer<'info>,
    pub token_program: Program<'info, Token>,
}

#[derive(Accounts)]
pub struct CreateDistributionAccount<'info> {
    pub mint: Account<'info, Mint>,
    
    #[account(
        init,
        payer = payer,
        associated_token::mint = mint,
        associated_token::authority = recipient,
    )]
    pub token_account: Account<'info, TokenAccount>,
    
    /// CHECK: The recipient who will own the token account
    pub recipient: AccountInfo<'info>,
    
    #[account(mut)]
    pub payer: Signer<'info>,
    
    pub token_program: Program<'info, Token>,
    pub associated_token_program: Program<'info, anchor_spl::associated_token::AssociatedToken>,
    pub system_program: Program<'info, System>,
    pub rent: Sysvar<'info, Rent>,
}

#[error_code]
pub enum TokenError {
    #[msg("Invalid mint authority")]
    InvalidMintAuthority,
    #[msg("Invalid freeze authority")]
    InvalidFreezeAuthority,
    #[msg("Distribution already completed")]
    DistributionCompleted,
}

#[cfg(test)]
mod tests;