import { PublicKey, Transaction } from '@solana/web3.js';
import { SolanaClient } from '../client.js';
import { PayAsYouGoConfig, TransactionResult, A2AMPLAmount } from '../types.js';
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
export declare class PayAsYouGoFlow {
    private _client;
    private usageRecords;
    constructor(_client: SolanaClient);
    /**
     * Record usage for billing
     */
    recordUsage(serviceId: string, userId: PublicKey, amount: A2AMPLAmount, metadata?: Record<string, unknown>): void;
    /**
     * Get usage records for a service
     */
    getUsageRecords(serviceId: string, fromTimestamp?: number): UsageRecord[];
    /**
     * Calculate total usage cost
     */
    calculateUsageCost(serviceId: string, fromTimestamp?: number): A2AMPLAmount;
    /**
     * Create payment transaction for accumulated usage
     */
    createUsagePayment(config: PayAsYouGoConfig, serviceId: string, fromTimestamp?: number): Promise<{
        transaction: Transaction;
        totalAmount: A2AMPLAmount;
        usageCount: number;
    }>;
    /**
     * Execute payment for accumulated usage
     */
    executeUsagePayment(config: PayAsYouGoConfig, serviceId: string, fromTimestamp?: number): Promise<{
        result: TransactionResult;
        totalAmount: A2AMPLAmount;
        usageCount: number;
    }>;
    /**
     * Create instant payment for single use
     */
    createInstantPayment(config: PayAsYouGoConfig): Promise<Transaction>;
    /**
     * Execute instant payment for single use
     */
    executeInstantPayment(config: PayAsYouGoConfig): Promise<TransactionResult>;
    /**
     * Get usage summary for a service
     */
    getUsageSummary(serviceId: string, fromTimestamp?: number): {
        totalCost: A2AMPLAmount;
        usageCount: number;
        averageCost: A2AMPLAmount;
        firstUsage?: number;
        lastUsage?: number;
    };
    /**
     * Clear all usage records
     */
    clearAllUsage(): void;
    /**
     * Clear paid usage records
     */
    private clearPaidUsage;
    /**
     * Validate pay-as-you-go configuration
     */
    private validatePayAsYouGoConfig;
    /**
     * Validate payer has sufficient balance
     */
    private validatePayerBalance;
    /**
     * Ensure recipient token account exists
     */
    private ensureRecipientTokenAccount;
}
//# sourceMappingURL=pay-as-you-go-flow.d.ts.map