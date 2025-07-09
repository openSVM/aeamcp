import { PublicKey, Transaction } from '@solana/web3.js';
import { SolanaClient } from '../client.js';
import { StreamConfig, TransactionResult, A2AMPLAmount } from '../types.js';
/**
 * Stream payment state
 */
export interface StreamState {
    id: string;
    payer: PublicKey;
    recipient: PublicKey;
    ratePerSecond: A2AMPLAmount;
    totalAmount: A2AMPLAmount;
    startTime: number;
    endTime: number;
    amountPaid: A2AMPLAmount;
    lastPaymentTime: number;
    active: boolean;
}
/**
 * Handles streaming payment flows
 */
export declare class StreamPaymentFlow {
    private _client;
    private streams;
    private timers;
    constructor(_client: SolanaClient);
    /**
     * Create a new payment stream
     */
    createStream(config: StreamConfig): Promise<{
        streamId: string;
        initialTransaction: Transaction;
    }>;
    /**
     * Start a payment stream
     */
    startStream(streamId: string): Promise<TransactionResult>;
    /**
     * Stop a payment stream
     */
    stopStream(streamId: string): Promise<{
        refund?: TransactionResult;
        finalAmount: A2AMPLAmount;
    }>;
    /**
     * Get stream status
     */
    getStreamStatus(streamId: string): StreamState & {
        currentAmount: A2AMPLAmount;
        remainingAmount: A2AMPLAmount;
        elapsedTime: number;
        remainingTime: number;
        progress: number;
    };
    /**
     * List all streams
     */
    listStreams(activeOnly?: boolean): StreamState[];
    /**
     * Get stream by payer
     */
    getStreamsByPayer(payer: PublicKey): StreamState[];
    /**
     * Get stream by recipient
     */
    getStreamsByRecipient(recipient: PublicKey): StreamState[];
    /**
     * Clean up completed streams
     */
    cleanupCompletedStreams(): number;
    /**
     * Generate unique stream ID
     */
    private generateStreamId;
    /**
     * Validate stream configuration
     */
    private validateStreamConfig;
    /**
     * Create payment transaction
     */
    private createPaymentTransaction;
    /**
     * Create refund transaction
     */
    private createRefundTransaction;
    /**
     * Start monitoring a stream
     */
    private startStreamMonitoring;
    /**
     * Stop monitoring a stream
     */
    private stopStreamMonitoring;
    /**
     * Validate payer has sufficient balance
     */
    private validatePayerBalance;
    /**
     * Ensure recipient token account exists
     */
    private ensureRecipientTokenAccount;
}
//# sourceMappingURL=stream-payment-flow.d.ts.map