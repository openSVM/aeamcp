use anchor_lang::prelude::*;
use anchor_spl::token::{self, Mint, Token, TokenAccount};
use solana_program_test::*;
use solana_sdk::{
    signature::{Keypair, Signer},
    transaction::Transaction,
};

#[cfg(test)]
mod tests {
    use super::*;
    use crate::*;

    #[tokio::test]
    async fn test_initialize_token() {
        let program_test = ProgramTest::new(
            "svmai_token",
            crate::id(),
            processor!(crate::process_instruction),
        );
        let (mut banks_client, payer, recent_blockhash) = program_test.start().await;

        // Create mint account
        let mint_keypair = Keypair::new();
        let mint_authority = Keypair::new();
        let freeze_authority = Keypair::new();

        // Initialize token
        let ix = instruction::initialize_token(
            &crate::id(),
            &mint_keypair.pubkey(),
            &mint_authority.pubkey(),
            &freeze_authority.pubkey(),
            &payer.pubkey(),
        );

        let mut transaction = Transaction::new_with_payer(&[ix], Some(&payer.pubkey()));
        transaction.sign(&[&payer, &mint_keypair], recent_blockhash);

        banks_client.process_transaction(transaction).await.unwrap();

        // Verify mint was created
        let mint_account = banks_client
            .get_account(mint_keypair.pubkey())
            .await
            .unwrap()
            .unwrap();

        let mint = Mint::unpack(&mint_account.data).unwrap();
        assert_eq!(mint.decimals, 9);
        assert_eq!(mint.supply, 0);
        assert_eq!(mint.mint_authority.unwrap(), mint_authority.pubkey());
        assert_eq!(mint.freeze_authority.unwrap(), freeze_authority.pubkey());
    }

    #[tokio::test]
    async fn test_mint_initial_supply() {
        let program_test = ProgramTest::new(
            "svmai_token",
            crate::id(),
            processor!(crate::process_instruction),
        );
        let (mut banks_client, payer, recent_blockhash) = program_test.start().await;

        // Setup
        let mint_keypair = Keypair::new();
        let mint_authority = Keypair::new();
        let freeze_authority = Keypair::new();
        let distribution_account = Keypair::new();

        // Initialize token first
        let init_ix = instruction::initialize_token(
            &crate::id(),
            &mint_keypair.pubkey(),
            &mint_authority.pubkey(),
            &freeze_authority.pubkey(),
            &payer.pubkey(),
        );

        let mut transaction = Transaction::new_with_payer(&[init_ix], Some(&payer.pubkey()));
        transaction.sign(&[&payer, &mint_keypair], recent_blockhash);
        banks_client.process_transaction(transaction).await.unwrap();

        // Mint initial supply
        let mint_ix = instruction::mint_initial_supply(
            &crate::id(),
            &mint_keypair.pubkey(),
            &distribution_account.pubkey(),
            &mint_authority.pubkey(),
            &payer.pubkey(),
        );

        let mut transaction = Transaction::new_with_payer(&[mint_ix], Some(&payer.pubkey()));
        transaction.sign(&[&payer, &mint_authority], recent_blockhash);
        banks_client.process_transaction(transaction).await.unwrap();

        // Verify supply
        let mint_account = banks_client
            .get_account(mint_keypair.pubkey())
            .await
            .unwrap()
            .unwrap();

        let mint = Mint::unpack(&mint_account.data).unwrap();
        assert_eq!(mint.supply, 1_000_000_000 * 10u64.pow(9)); // 1 billion with 9 decimals
    }

    #[tokio::test]
    async fn test_disable_freeze_authority() {
        let program_test = ProgramTest::new(
            "svmai_token",
            crate::id(),
            processor!(crate::process_instruction),
        );
        let (mut banks_client, payer, recent_blockhash) = program_test.start().await;

        // Setup
        let mint_keypair = Keypair::new();
        let mint_authority = Keypair::new();
        let freeze_authority = Keypair::new();

        // Initialize token
        let init_ix = instruction::initialize_token(
            &crate::id(),
            &mint_keypair.pubkey(),
            &mint_authority.pubkey(),
            &freeze_authority.pubkey(),
            &payer.pubkey(),
        );

        let mut transaction = Transaction::new_with_payer(&[init_ix], Some(&payer.pubkey()));
        transaction.sign(&[&payer, &mint_keypair], recent_blockhash);
        banks_client.process_transaction(transaction).await.unwrap();

        // Disable freeze authority
        let disable_ix = instruction::disable_freeze_authority(
            &crate::id(),
            &mint_keypair.pubkey(),
            &freeze_authority.pubkey(),
        );

        let mut transaction = Transaction::new_with_payer(&[disable_ix], Some(&payer.pubkey()));
        transaction.sign(&[&payer, &freeze_authority], recent_blockhash);
        banks_client.process_transaction(transaction).await.unwrap();

        // Verify freeze authority is None
        let mint_account = banks_client
            .get_account(mint_keypair.pubkey())
            .await
            .unwrap()
            .unwrap();

        let mint = Mint::unpack(&mint_account.data).unwrap();
        assert!(mint.freeze_authority.is_none());
    }

    #[tokio::test]
    async fn test_transfer_mint_authority() {
        let program_test = ProgramTest::new(
            "svmai_token",
            crate::id(),
            processor!(crate::process_instruction),
        );
        let (mut banks_client, payer, recent_blockhash) = program_test.start().await;

        // Setup
        let mint_keypair = Keypair::new();
        let mint_authority = Keypair::new();
        let freeze_authority = Keypair::new();
        let new_authority = Keypair::new();

        // Initialize token
        let init_ix = instruction::initialize_token(
            &crate::id(),
            &mint_keypair.pubkey(),
            &mint_authority.pubkey(),
            &freeze_authority.pubkey(),
            &payer.pubkey(),
        );

        let mut transaction = Transaction::new_with_payer(&[init_ix], Some(&payer.pubkey()));
        transaction.sign(&[&payer, &mint_keypair], recent_blockhash);
        banks_client.process_transaction(transaction).await.unwrap();

        // Transfer mint authority
        let transfer_ix = instruction::transfer_mint_authority(
            &crate::id(),
            &mint_keypair.pubkey(),
            &mint_authority.pubkey(),
            &new_authority.pubkey(),
        );

        let mut transaction = Transaction::new_with_payer(&[transfer_ix], Some(&payer.pubkey()));
        transaction.sign(&[&payer, &mint_authority], recent_blockhash);
        banks_client.process_transaction(transaction).await.unwrap();

        // Verify new mint authority
        let mint_account = banks_client
            .get_account(mint_keypair.pubkey())
            .await
            .unwrap()
            .unwrap();

        let mint = Mint::unpack(&mint_account.data).unwrap();
        assert_eq!(mint.mint_authority.unwrap(), new_authority.pubkey());
    }
}
// Critical Security Tests - Added after comprehensive security audit
#[cfg(test)]
mod critical_security_tests {
    use super::*;

    #[tokio::test]
    async fn test_prevent_double_minting_critical_vulnerability() {
        let program_test = ProgramTest::new(
            "svmai_token",
            crate::id(),
            processor!(crate::process_instruction),
        );
        let (mut banks_client, payer, recent_blockhash) = program_test.start().await;

        let mint_keypair = Keypair::new();
        let mint_authority = Keypair::new();
        let freeze_authority = Keypair::new();

        // Initialize token first
        let init_ix = instruction::initialize_token(
            &crate::id(),
            &mint_keypair.pubkey(),
            &mint_authority.pubkey(),
            &freeze_authority.pubkey(),
            &payer.pubkey(),
        );

        let mut transaction = Transaction::new_with_payer(&[init_ix], Some(&payer.pubkey()));
        transaction.sign(&[&payer, &mint_keypair], recent_blockhash);
        banks_client.process_transaction(transaction).await.unwrap();

        // Create distribution account
        let (distribution_account, _) = anchor_spl::associated_token::get_associated_token_address(
            &mint_authority.pubkey(),
            &mint_keypair.pubkey(),
        );

        // First minting operation - should succeed
        let mint_supply_ix = instruction::mint_initial_supply(
            &crate::id(),
            &mint_keypair.pubkey(),
            &distribution_account,
            &mint_authority.pubkey(),
            &payer.pubkey(),
        );

        let mut transaction = Transaction::new_with_payer(&[mint_supply_ix], Some(&payer.pubkey()));
        transaction.sign(&[&payer, &mint_authority], recent_blockhash);
        banks_client.process_transaction(transaction).await.unwrap();

        // Verify supply was minted correctly
        let mint_account = banks_client
            .get_account(mint_keypair.pubkey())
            .await
            .unwrap()
            .unwrap();
        let mint = Mint::unpack(&mint_account.data).unwrap();
        assert_eq!(mint.supply, 1_000_000_000_000_000_000u64); // 1B tokens with 9 decimals

        // CRITICAL TEST: Second minting operation - should FAIL
        let second_mint_ix = instruction::mint_initial_supply(
            &crate::id(),
            &mint_keypair.pubkey(),
            &distribution_account,
            &mint_authority.pubkey(),
            &payer.pubkey(),
        );

        let mut transaction = Transaction::new_with_payer(&[second_mint_ix], Some(&payer.pubkey()));
        transaction.sign(&[&payer, &mint_authority], recent_blockhash);
        
        // This should fail with DistributionCompleted error
        let result = banks_client.process_transaction(transaction).await;
        assert!(result.is_err(), "Second minting operation should fail but succeeded!");
        
        // Verify supply hasn't changed
        let mint_account = banks_client
            .get_account(mint_keypair.pubkey())
            .await
            .unwrap()
            .unwrap();
        let mint = Mint::unpack(&mint_account.data).unwrap();
        assert_eq!(mint.supply, 1_000_000_000_000_000_000u64, "Supply should remain at 1B tokens");
    }

    #[tokio::test]
    async fn test_authority_validation_security() {
        let program_test = ProgramTest::new(
            "svmai_token",
            crate::id(),
            processor!(crate::process_instruction),
        );
        let (mut banks_client, payer, recent_blockhash) = program_test.start().await;

        let mint_keypair = Keypair::new();
        let mint_authority = Keypair::new();
        let freeze_authority = Keypair::new();
        let wrong_authority = Keypair::new(); // Wrong authority for testing

        // Initialize token
        let init_ix = instruction::initialize_token(
            &crate::id(),
            &mint_keypair.pubkey(),
            &mint_authority.pubkey(),
            &freeze_authority.pubkey(),
            &payer.pubkey(),
        );

        let mut transaction = Transaction::new_with_payer(&[init_ix], Some(&payer.pubkey()));
        transaction.sign(&[&payer, &mint_keypair], recent_blockhash);
        banks_client.process_transaction(transaction).await.unwrap();

        // Create distribution account
        let (distribution_account, _) = anchor_spl::associated_token::get_associated_token_address(
            &wrong_authority.pubkey(),
            &mint_keypair.pubkey(),
        );

        // Test: Try minting with wrong authority - should FAIL
        let wrong_mint_ix = instruction::mint_initial_supply(
            &crate::id(),
            &mint_keypair.pubkey(),
            &distribution_account,
            &wrong_authority.pubkey(), // Using wrong authority
            &payer.pubkey(),
        );

        let mut transaction = Transaction::new_with_payer(&[wrong_mint_ix], Some(&payer.pubkey()));
        transaction.sign(&[&payer, &wrong_authority], recent_blockhash);
        
        let result = banks_client.process_transaction(transaction).await;
        assert!(result.is_err(), "Minting with wrong authority should fail!");
    }

    #[test]
    fn test_supply_calculation_safety() {
        // Test the supply calculation logic for safety
        let expected_supply = 1_000_000_000 * 10u64.pow(9);
        assert_eq!(expected_supply, 1_000_000_000_000_000_000u64);
        
        // Ensure no overflow in calculation
        let safe_calculation = 1_000_000_000u64
            .checked_mul(10u64.pow(9))
            .expect("Supply calculation should not overflow");
        assert_eq!(safe_calculation, expected_supply);
    }

    #[tokio::test]
    async fn test_freeze_authority_validation() {
        let program_test = ProgramTest::new(
            "svmai_token",
            crate::id(),
            processor!(crate::process_instruction),
        );
        let (mut banks_client, payer, recent_blockhash) = program_test.start().await;

        let mint_keypair = Keypair::new();
        let mint_authority = Keypair::new();
        let freeze_authority = Keypair::new();
        let wrong_freeze_authority = Keypair::new();

        // Initialize token
        let init_ix = instruction::initialize_token(
            &crate::id(),
            &mint_keypair.pubkey(),
            &mint_authority.pubkey(),
            &freeze_authority.pubkey(),
            &payer.pubkey(),
        );

        let mut transaction = Transaction::new_with_payer(&[init_ix], Some(&payer.pubkey()));
        transaction.sign(&[&payer, &mint_keypair], recent_blockhash);
        banks_client.process_transaction(transaction).await.unwrap();

        // Test: Try disabling freeze authority with wrong authority - should FAIL
        let wrong_disable_ix = instruction::disable_freeze_authority(
            &crate::id(),
            &mint_keypair.pubkey(),
            &wrong_freeze_authority.pubkey(), // Wrong freeze authority
        );

        let mut transaction = Transaction::new_with_payer(&[wrong_disable_ix], Some(&payer.pubkey()));
        transaction.sign(&[&payer, &wrong_freeze_authority], recent_blockhash);
        
        let result = banks_client.process_transaction(transaction).await;
        assert!(result.is_err(), "Disabling freeze authority with wrong authority should fail!");
    }
}

// Helper module for instruction creation
mod instruction {
    use super::*;
    use solana_program::instruction::{AccountMeta, Instruction};

    pub fn initialize_token(
        program_id: &Pubkey,
        mint: &Pubkey,
        mint_authority: &Pubkey,
        freeze_authority: &Pubkey,
        payer: &Pubkey,
    ) -> Instruction {
        let accounts = vec![
            AccountMeta::new(*mint, true),
            AccountMeta::new_readonly(*mint_authority, true),
            AccountMeta::new_readonly(*freeze_authority, false),
            AccountMeta::new(*payer, true),
            AccountMeta::new_readonly(spl_token::id(), false),
            AccountMeta::new_readonly(solana_program::system_program::id(), false),
            AccountMeta::new_readonly(solana_program::sysvar::rent::id(), false),
        ];

        Instruction {
            program_id: *program_id,
            accounts,
            data: crate::instruction::SvmaiTokenInstruction::InitializeToken.try_to_vec().unwrap(),
        }
    }

    pub fn mint_initial_supply(
        program_id: &Pubkey,
        mint: &Pubkey,
        distribution_account: &Pubkey,
        mint_authority: &Pubkey,
        payer: &Pubkey,
    ) -> Instruction {
        let accounts = vec![
            AccountMeta::new(*mint, false),
            AccountMeta::new(*distribution_account, false),
            AccountMeta::new_readonly(*mint_authority, true),
            AccountMeta::new(*payer, true),
            AccountMeta::new_readonly(spl_token::id(), false),
            AccountMeta::new_readonly(spl_associated_token_account::id(), false),
            AccountMeta::new_readonly(solana_program::system_program::id(), false),
            AccountMeta::new_readonly(solana_program::sysvar::rent::id(), false),
        ];

        Instruction {
            program_id: *program_id,
            accounts,
            data: crate::instruction::SvmaiTokenInstruction::MintInitialSupply.try_to_vec().unwrap(),
        }
    }

    pub fn disable_freeze_authority(
        program_id: &Pubkey,
        mint: &Pubkey,
        freeze_authority: &Pubkey,
    ) -> Instruction {
        let accounts = vec![
            AccountMeta::new(*mint, false),
            AccountMeta::new_readonly(*freeze_authority, true),
            AccountMeta::new_readonly(spl_token::id(), false),
        ];

        Instruction {
            program_id: *program_id,
            accounts,
            data: crate::instruction::SvmaiTokenInstruction::DisableFreezeAuthority.try_to_vec().unwrap(),
        }
    }

    pub fn transfer_mint_authority(
        program_id: &Pubkey,
        mint: &Pubkey,
        mint_authority: &Pubkey,
        new_authority: &Pubkey,
    ) -> Instruction {
        let accounts = vec![
            AccountMeta::new(*mint, false),
            AccountMeta::new_readonly(*mint_authority, true),
            AccountMeta::new_readonly(spl_token::id(), false),
        ];

        Instruction {
            program_id: *program_id,
            accounts,
            data: crate::instruction::SvmaiTokenInstruction::TransferMintAuthority {
                new_authority: *new_authority,
            }
            .try_to_vec()
            .unwrap(),
        }
    }
}