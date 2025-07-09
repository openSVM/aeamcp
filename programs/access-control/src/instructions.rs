use anchor_lang::prelude::*;

/// Instructions for the access control program
#[derive(AnchorSerialize, AnchorDeserialize, Clone, Debug, PartialEq)]
pub enum AccessControlInstruction {
    /// Initialize access control for a resource
    InitializeAccessControl {
        resource_id: String,
        resource_program: Pubkey,
        initial_owner: Pubkey,
    },
    
    /// Verify signature only (separated from execution for auditability)
    VerifySignature {
        resource_id: String,
        operation: String,
        signature: [u8; 64],
        message: Vec<u8>,
        nonce: u64,
        timestamp: i64,
    },
    
    /// Execute operation after signature verification
    ExecuteOperation {
        resource_id: String,
        operation: String,
        target_program: Pubkey,
        target_instruction: Vec<u8>,
    },
    
    /// Grant permission to another wallet with delegation controls
    GrantPermission {
        resource_id: String,
        target_wallet: Pubkey,
        permissions: Vec<String>,
        expiry: Option<i64>,
        can_delegate: bool,
        max_delegation_depth: u8,
    },
    
    /// Revoke permissions with delegation cleanup
    RevokePermission {
        resource_id: String,
        target_wallet: Pubkey,
        revoke_delegated: bool,
    },
    
    /// Transfer ownership
    TransferOwnership {
        resource_id: String,
        new_owner: Pubkey,
    },
    
    /// Prune expired grants to reclaim space
    PruneExpiredGrants {
        resource_id: String,
        max_grants_to_prune: u8,
    },
    
    /// Update nonce safely with concurrency protection
    UpdateNonce {
        resource_id: String,
        new_nonce: u64,
    },
}

impl AccessControlInstruction {
    /// Get discriminant for instruction identification
    pub fn discriminant(&self) -> u8 {
        match self {
            AccessControlInstruction::InitializeAccessControl { .. } => 0,
            AccessControlInstruction::VerifySignature { .. } => 1,
            AccessControlInstruction::ExecuteOperation { .. } => 2,
            AccessControlInstruction::GrantPermission { .. } => 3,
            AccessControlInstruction::RevokePermission { .. } => 4,
            AccessControlInstruction::TransferOwnership { .. } => 5,
            AccessControlInstruction::PruneExpiredGrants { .. } => 6,
            AccessControlInstruction::UpdateNonce { .. } => 7,
        }
    }
    
    /// Get resource ID from any instruction variant
    pub fn resource_id(&self) -> &str {
        match self {
            AccessControlInstruction::InitializeAccessControl { resource_id, .. } => resource_id,
            AccessControlInstruction::VerifySignature { resource_id, .. } => resource_id,
            AccessControlInstruction::ExecuteOperation { resource_id, .. } => resource_id,
            AccessControlInstruction::GrantPermission { resource_id, .. } => resource_id,
            AccessControlInstruction::RevokePermission { resource_id, .. } => resource_id,
            AccessControlInstruction::TransferOwnership { resource_id, .. } => resource_id,
            AccessControlInstruction::PruneExpiredGrants { resource_id, .. } => resource_id,
            AccessControlInstruction::UpdateNonce { resource_id, .. } => resource_id,
        }
    }
}

/// CPI instruction helpers for other programs
pub mod cpi {
    use super::*;
    use anchor_lang::prelude::*;
    
    /// Accounts for verify_signature CPI call
    #[derive(Accounts)]
    pub struct VerifySignatureCpi<'info> {
        #[account(mut)]
        pub access_control_account: AccountInfo<'info>,
        #[account(mut)]
        pub nonce_tracker: AccountInfo<'info>,
        pub resource_program: AccountInfo<'info>,
        pub signer: AccountInfo<'info>,
    }
    
    /// CPI function for signature verification
    pub fn verify_signature(
        ctx: CpiContext<VerifySignatureCpi>,
        resource_id: String,
        operation: String,
        signature: [u8; 64],
        message: Vec<u8>,
        nonce: u64,
        timestamp: i64,
    ) -> Result<()> {
        let instruction = AccessControlInstruction::VerifySignature {
            resource_id,
            operation,
            signature,
            message,
            nonce,
            timestamp,
        };
        
        let mut data = Vec::new();
        instruction.serialize(&mut data)?;
        
        let instruction = anchor_lang::solana_program::instruction::Instruction {
            program_id: crate::ID,
            accounts: ctx.accounts_meta(),
            data,
        };
        
        anchor_lang::solana_program::program::invoke_signed(
            &instruction,
            &ctx.accounts_infos(),
            ctx.signer_seeds,
        )?;
        
        Ok(())
    }
    
    /// Accounts for grant_permission CPI call
    #[derive(Accounts)]
    pub struct GrantPermissionCpi<'info> {
        #[account(mut)]
        pub access_control_account: AccountInfo<'info>,
        #[account(mut)]
        pub permission_index: AccountInfo<'info>,
        pub resource_program: AccountInfo<'info>,
        pub target_wallet: AccountInfo<'info>,
        pub authority: AccountInfo<'info>,
        #[account(mut)]
        pub payer: AccountInfo<'info>,
        pub system_program: AccountInfo<'info>,
    }
    
    /// CPI function for granting permissions
    pub fn grant_permission(
        ctx: CpiContext<GrantPermissionCpi>,
        resource_id: String,
        target_wallet: Pubkey,
        permissions: Vec<String>,
        expiry: Option<i64>,
        can_delegate: bool,
        max_delegation_depth: u8,
    ) -> Result<()> {
        let instruction = AccessControlInstruction::GrantPermission {
            resource_id,
            target_wallet,
            permissions,
            expiry,
            can_delegate,
            max_delegation_depth,
        };
        
        let mut data = Vec::new();
        instruction.serialize(&mut data)?;
        
        let instruction = anchor_lang::solana_program::instruction::Instruction {
            program_id: crate::ID,
            accounts: ctx.accounts_meta(),
            data,
        };
        
        anchor_lang::solana_program::program::invoke_signed(
            &instruction,
            &ctx.accounts_infos(),
            ctx.signer_seeds,
        )?;
        
        Ok(())
    }
}

#[cfg(test)]
mod tests {
    use super::*;
    
    #[test]
    fn test_instruction_discriminant() {
        let init_instruction = AccessControlInstruction::InitializeAccessControl {
            resource_id: "test".to_string(),
            resource_program: Pubkey::default(),
            initial_owner: Pubkey::default(),
        };
        
        assert_eq!(init_instruction.discriminant(), 0);
        assert_eq!(init_instruction.resource_id(), "test");
    }
    
    #[test]
    fn test_instruction_serialization() {
        let instruction = AccessControlInstruction::VerifySignature {
            resource_id: "test_resource".to_string(),
            operation: "read".to_string(),
            signature: [0u8; 64],
            message: vec![1, 2, 3],
            nonce: 42,
            timestamp: 1000,
        };
        
        let mut data = Vec::new();
        instruction.serialize(&mut data).unwrap();
        
        assert!(!data.is_empty());
    }
}