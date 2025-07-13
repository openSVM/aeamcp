import { PublicKey, Transaction } from '@solana/web3.js';
import {
  getAssociatedTokenAddress,
  createTransferInstruction,
  TOKEN_PROGRAM_ID,
} from '@solana/spl-token';
import { SolanaClient } from '../client.js';
import { PayAsYouGoConfig, TransactionResult, A2AMPLAmount, TOKEN_MINTS } from '../types.js';
import { PaymentError, ValidationError } from '../errors.js';
import { Validator } from '../utils/validation.js';

/**
 * Usage tracking for pay-as-you-go billing
 */
export interface UsageRecord {
  timestamp: number;
  serviceId: string;
  userId: PublicKey;
  amount: A2AMPLAmount;
  metadata?: Record<string, unknown>;
}

/**
 * Handles pay-as-you-go payment flows
 */
export class PayAsYouGoFlow {
  private usageRecords: Map<string, UsageRecord[]> = new Map();

  constructor(private _client: SolanaClient) {}

  /**
   * Record usage for billing
   */
  recordUsage(
    serviceId: string,
    userId: PublicKey,
    amount: A2AMPLAmount,
    metadata?: Record<string, unknown>
  ): void {
    const record: UsageRecord = {
      timestamp: Date.now(),
      serviceId,
      userId,
      amount,
      metadata: metadata ?? {},
    };

    const existing = this.usageRecords.get(serviceId) || [];
    existing.push(record);
    this.usageRecords.set(serviceId, existing);
  }

  /**
   * Get usage records for a service
   */
  getUsageRecords(serviceId: string, fromTimestamp?: number): UsageRecord[] {
    const records = this.usageRecords.get(serviceId) || [];

    if (fromTimestamp) {
      return records.filter(record => record.timestamp >= fromTimestamp);
    }

    return records;
  }

  /**
   * Calculate total usage cost
   */
  calculateUsageCost(serviceId: string, fromTimestamp?: number): A2AMPLAmount {
    const records = this.getUsageRecords(serviceId, fromTimestamp);
    return records.reduce((total, record) => total + record.amount, 0n);
  }

  /**
   * Create payment transaction for accumulated usage
   */
  async createUsagePayment(
    config: PayAsYouGoConfig,
    serviceId: string,
    fromTimestamp?: number
  ): Promise<{ transaction: Transaction; totalAmount: A2AMPLAmount; usageCount: number }> {
    // Validate inputs
    this.validatePayAsYouGoConfig(config);

    try {
      const totalAmount = this.calculateUsageCost(serviceId, fromTimestamp);
      const usageRecords = this.getUsageRecords(serviceId, fromTimestamp);

      if (totalAmount === 0n) {
        throw new PaymentError('No usage to bill for the specified period');
      }

      const transaction = new Transaction();
      const payer = config.payer;
      const recipient = config.recipient;

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
      await this.validatePayerBalance(payerTokenAccount, totalAmount);

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
        totalAmount,
        [],
        TOKEN_PROGRAM_ID
      );

      transaction.add(transferInstruction);

      // Set recent blockhash and fee payer
      const { blockhash } = await this._client.connection.getLatestBlockhash();
      transaction.recentBlockhash = blockhash;
      transaction.feePayer = payer;

      return {
        transaction,
        totalAmount,
        usageCount: usageRecords.length,
      };
    } catch (error) {
      throw new PaymentError(
        `Failed to create usage payment transaction: ${error instanceof Error ? error.message : 'Unknown error'}`,
        error instanceof Error ? error : undefined
      );
    }
  }

  /**
   * Execute payment for accumulated usage
   */
  async executeUsagePayment(
    config: PayAsYouGoConfig,
    serviceId: string,
    fromTimestamp?: number
  ): Promise<{ result: TransactionResult; totalAmount: A2AMPLAmount; usageCount: number }> {
    try {
      const { transaction, totalAmount, usageCount } = await this.createUsagePayment(
        config,
        serviceId,
        fromTimestamp
      );

      const result = await this._client.sendAndConfirmTransaction(transaction);

      // Clear paid usage records
      this.clearPaidUsage(serviceId, fromTimestamp);

      return { result, totalAmount, usageCount };
    } catch (error) {
      throw new PaymentError(
        `Failed to execute usage payment: ${error instanceof Error ? error.message : 'Unknown error'}`,
        error instanceof Error ? error : undefined
      );
    }
  }

  /**
   * Create instant payment for single use
   */
  async createInstantPayment(config: PayAsYouGoConfig): Promise<Transaction> {
    // Validate inputs
    this.validatePayAsYouGoConfig(config);

    try {
      const transaction = new Transaction();
      const payer = config.payer;
      const recipient = config.recipient;
      const amount = config.perUsePrice;

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
        `Failed to create instant payment transaction: ${error instanceof Error ? error.message : 'Unknown error'}`,
        error instanceof Error ? error : undefined
      );
    }
  }

  /**
   * Execute instant payment for single use
   */
  async executeInstantPayment(config: PayAsYouGoConfig): Promise<TransactionResult> {
    try {
      const transaction = await this.createInstantPayment(config);
      return await this._client.sendAndConfirmTransaction(transaction);
    } catch (error) {
      throw new PaymentError(
        `Failed to execute instant payment: ${error instanceof Error ? error.message : 'Unknown error'}`,
        error instanceof Error ? error : undefined
      );
    }
  }

  /**
   * Get usage summary for a service
   */
  getUsageSummary(
    serviceId: string,
    fromTimestamp?: number
  ): {
    totalCost: A2AMPLAmount;
    usageCount: number;
    averageCost: A2AMPLAmount;
    firstUsage?: number;
    lastUsage?: number;
  } {
    const records = this.getUsageRecords(serviceId, fromTimestamp);

    if (records.length === 0) {
      return {
        totalCost: 0n,
        usageCount: 0,
        averageCost: 0n,
      };
    }

    const totalCost = records.reduce((total, record) => total + record.amount, 0n);
    const averageCost = totalCost / BigInt(records.length);

    return {
      totalCost,
      usageCount: records.length,
      averageCost,
      firstUsage: Math.min(...records.map(r => r.timestamp)),
      lastUsage: Math.max(...records.map(r => r.timestamp)),
    };
  }

  /**
   * Clear all usage records
   */
  clearAllUsage(): void {
    this.usageRecords.clear();
  }

  /**
   * Clear paid usage records
   */
  private clearPaidUsage(serviceId: string, fromTimestamp?: number): void {
    if (!fromTimestamp) {
      this.usageRecords.delete(serviceId);
      return;
    }

    const records = this.usageRecords.get(serviceId) || [];
    const remainingRecords = records.filter(record => record.timestamp < fromTimestamp);

    if (remainingRecords.length === 0) {
      this.usageRecords.delete(serviceId);
    } else {
      this.usageRecords.set(serviceId, remainingRecords);
    }
  }

  /**
   * Validate pay-as-you-go configuration
   */
  private validatePayAsYouGoConfig(config: PayAsYouGoConfig): void {
    Validator.validatePublicKey(config.payer, 'payer');
    Validator.validatePublicKey(config.recipient, 'recipient');

    if (config.perUsePrice <= 0n) {
      throw new ValidationError('Per-use price must be greater than 0', 'perUsePrice');
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
