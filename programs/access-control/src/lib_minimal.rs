use anchor_lang::prelude::*;

declare_id!("ACRLxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx");

#[program]
pub mod access_control {
    use super::*;
    
    pub fn initialize_access_control(
        ctx: Context<InitializeAccessControl>,
        resource_id: String,
        resource_program: Pubkey,
        initial_owner: Pubkey,
    ) -> Result<()> {
        Ok(())
    }
}

#[derive(Accounts)]
pub struct InitializeAccessControl<'info> {
    #[account(init, payer = payer, space = 8 + 100)]
    pub access_control_account: Account<'info, AccessControlAccount>,
    
    #[account(mut)]
    pub payer: Signer<'info>,
    pub system_program: Program<'info, System>,
}

#[account]
pub struct AccessControlAccount {
    pub resource_id: String,
    pub owner: Pubkey,
}