import { PublicKey, Transaction } from '@solana/web3.js';
import { SolanaClient } from '../client.js';
import { PrepaymentConfig, TransactionResult, A2AMPLAmount } from '../types.js';
/**
 * Handles prepayment flows for services
 */
export declare class PrepaymentFlow {
    private _client;
    constructor(_client: SolanaClient);
    /**
     * Create a prepayment transaction
     */
    createPrepayment(config: PrepaymentConfig): Promise<Transaction>;
    /**
     * Execute prepayment
     */
    executePrepayment(config: PrepaymentConfig): Promise<TransactionResult>;
    /**
     * Get prepayment status
     */
    getPrepaymentStatus(signature: string): Promise<{
        confirmed: boolean;
        slot?: bigint;
        amount?: A2AMPLAmount;
        payer?: PublicKey;
        recipient?: PublicKey;
    }>;
    /**
     * Estimate prepayment cost (including network fees)
     */
    estimatePrepaymentCost(config: PrepaymentConfig): Promise<{
        paymentAmount: A2AMPLAmount;
        networkFee: bigint;
        totalCost: A2AMPLAmount;
    }>;
    /**
     * Validate prepayment configuration
     */
    private validatePrepaymentConfig;
    /**
     * Validate payer has sufficient balance
     */
    private validatePayerBalance;
    /**
     * Ensure recipient token account exists
     */
    private ensureRecipientTokenAccount;
}
//# sourceMappingURL=prepayment-flow.d.ts.map