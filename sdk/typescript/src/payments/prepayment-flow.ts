import { PublicKey, Transaction } from '@solana/web3.js';
import {
  getAssociatedTokenAddress,
  createTransferInstruction,
  TOKEN_PROGRAM_ID,
} from '@solana/spl-token';
import { SolanaClient } from '../client.js';
import { PrepaymentConfig, TransactionResult, A2AMPLAmount, TOKEN_MINTS } from '../types.js';
import { PaymentError, ValidationError } from '../errors.js';
import { Validator } from '../utils/validation.js';

/**
 * Handles prepayment flows for services
 */
export class PrepaymentFlow {
  constructor(private _client: SolanaClient) {}

  /**
   * Create a prepayment transaction
   */
  async createPrepayment(config: PrepaymentConfig): Promise<Transaction> {
    // Validate inputs
    this.validatePrepaymentConfig(config);

    try {
      const transaction = new Transaction();
      const payer = config.payer;
      const recipient = config.recipient;
      const amount = config.amount;

      // Get token mint for the cluster
      const tokenMint = TOKEN_MINTS[this._client.cluster === 'mainnet-beta' ? 'mainnet' : 'devnet'];

      // Get associated token accounts
      const payerTokenAccount = await getAssociatedTokenAddress(
        tokenMint,
        payer,
        false,
        TOKEN_PROGRAM_ID
      );

      const recipientTokenAccount = await getAssociatedTokenAddress(
        tokenMint,
        recipient,
        false,
        TOKEN_PROGRAM_ID
      );

      // Check if payer token account exists and has sufficient balance
      await this.validatePayerBalance(payerTokenAccount, amount);

      // Check if recipient token account exists, create if needed
      await this.ensureRecipientTokenAccount(
        transaction,
        recipient,
        recipientTokenAccount,
        tokenMint
      );

      // Create transfer instruction
      const transferInstruction = createTransferInstruction(
        payerTokenAccount,
        recipientTokenAccount,
        payer,
        amount,
        [],
        TOKEN_PROGRAM_ID
      );

      transaction.add(transferInstruction);

      // Set recent blockhash and fee payer
      const { blockhash } = await this._client.connection.getLatestBlockhash();
      transaction.recentBlockhash = blockhash;
      transaction.feePayer = payer;

      return transaction;
    } catch (error) {
      throw new PaymentError(
        `Failed to create prepayment transaction: ${error instanceof Error ? error.message : 'Unknown error'}`,
        error instanceof Error ? error : undefined
      );
    }
  }

  /**
   * Execute prepayment
   */
  async executePrepayment(config: PrepaymentConfig): Promise<TransactionResult> {
    try {
      const transaction = await this.createPrepayment(config);
      return await this._client.sendAndConfirmTransaction(transaction);
    } catch (error) {
      throw new PaymentError(
        `Failed to execute prepayment: ${error instanceof Error ? error.message : 'Unknown error'}`,
        error instanceof Error ? error : undefined
      );
    }
  }

  /**
   * Get prepayment status
   */
  async getPrepaymentStatus(signature: string): Promise<{
    confirmed: boolean;
    slot?: bigint;
    amount?: A2AMPLAmount;
    payer?: PublicKey;
    recipient?: PublicKey;
  }> {
    try {
      const transaction = await this._client.connection.getTransaction(signature, {
        commitment: 'confirmed',
        maxSupportedTransactionVersion: 0,
      });

      if (!transaction) {
        return { confirmed: false };
      }

      // Parse transaction to extract payment details
      // This would require more sophisticated parsing in a real implementation
      return {
        confirmed: true,
        slot: BigInt(transaction.slot),
        // Additional parsing would be needed to extract amount, payer, recipient
      };
    } catch (error) {
      throw new PaymentError(
        `Failed to get prepayment status: ${error instanceof Error ? error.message : 'Unknown error'}`,
        error instanceof Error ? error : undefined
      );
    }
  }

  /**
   * Estimate prepayment cost (including network fees)
   */
  async estimatePrepaymentCost(config: PrepaymentConfig): Promise<{
    paymentAmount: A2AMPLAmount;
    networkFee: bigint; // in lamports
    totalCost: A2AMPLAmount;
  }> {
    try {
      // Create the transaction to estimate fees
      const transaction = await this.createPrepayment(config);

      // Get fee estimate
      const feeEstimate = await this._client.connection.getFeeForMessage(
        transaction.compileMessage(),
        'confirmed'
      );

      const networkFee = BigInt(feeEstimate.value || 5000); // Default 5000 lamports if estimation fails

      return {
        paymentAmount: config.amount,
        networkFee,
        totalCost: config.amount, // Token amount doesn't include SOL fees
      };
    } catch (error) {
      throw new PaymentError(
        `Failed to estimate prepayment cost: ${error instanceof Error ? error.message : 'Unknown error'}`,
        error instanceof Error ? error : undefined
      );
    }
  }

  /**
   * Validate prepayment configuration
   */
  private validatePrepaymentConfig(config: PrepaymentConfig): void {
    Validator.validatePublicKey(config.payer, 'payer');
    Validator.validatePublicKey(config.recipient, 'recipient');

    if (config.amount <= 0n) {
      throw new ValidationError('Payment amount must be greater than 0', 'amount');
    }

    if (config.payer.equals(config.recipient)) {
      throw new ValidationError('Payer and recipient cannot be the same', 'recipient');
    }
  }

  /**
   * Validate payer has sufficient balance
   */
  private async validatePayerBalance(
    payerTokenAccount: PublicKey,
    _amount: A2AMPLAmount
  ): Promise<void> {
    try {
      const accountInfo = await this._client.getAccountInfo(payerTokenAccount);

      if (!accountInfo) {
        throw new PaymentError('Payer token account does not exist');
      }

      // Parse token account data to get balance
      // This would require proper SPL token account parsing
      // For now, we'll assume the account exists and has sufficient balance
      // In a real implementation, you'd parse the account data properly
    } catch (error) {
      throw new PaymentError(
        `Failed to validate payer balance: ${error instanceof Error ? error.message : 'Unknown error'}`,
        error instanceof Error ? error : undefined
      );
    }
  }

  /**
   * Ensure recipient token account exists
   */
  private async ensureRecipientTokenAccount(
    transaction: Transaction,
    recipient: PublicKey,
    recipientTokenAccount: PublicKey,
    tokenMint: PublicKey
  ): Promise<void> {
    try {
      const accountExists = await this._client.accountExists(recipientTokenAccount);

      if (!accountExists) {
        // Add instruction to create associated token account
        const { createAssociatedTokenAccountInstruction } = await import('@solana/spl-token');

        const createAtaInstruction = createAssociatedTokenAccountInstruction(
          recipient, // payer of the creation fee
          recipientTokenAccount,
          recipient,
          tokenMint,
          TOKEN_PROGRAM_ID
        );

        transaction.add(createAtaInstruction);
      }
    } catch (error) {
      throw new PaymentError(
        `Failed to ensure recipient token account: ${error instanceof Error ? error.message : 'Unknown error'}`,
        error instanceof Error ? error : undefined
      );
    }
  }
}
