import { Transaction } from '@solana/web3.js';
import { getAssociatedTokenAddress, createTransferInstruction, TOKEN_PROGRAM_ID, } from '@solana/spl-token';
import { TOKEN_MINTS, PaymentMethod, } from '../types.js';
import { PaymentError, ValidationError } from '../errors.js';
import { Validator } from '../utils/validation.js';
/**
 * Handles streaming payment flows
 */
export class StreamPaymentFlow {
    _client;
    streams = new Map();
    timers = new Map();
    constructor(_client) {
        this._client = _client;
    }
    /**
     * Create a new payment stream
     */
    async createStream(config) {
        // Validate inputs
        this.validateStreamConfig(config);
        const streamId = this.generateStreamId();
        const startTime = Date.now();
        const endTime = startTime + config.duration * 1000;
        const totalAmount = config.ratePerSecond * BigInt(config.duration);
        try {
            // Create initial payment transaction
            const transaction = await this.createPaymentTransaction(config, totalAmount);
            // Create stream state
            const streamState = {
                id: streamId,
                payer: config.payer,
                recipient: config.recipient,
                ratePerSecond: config.ratePerSecond,
                totalAmount,
                startTime,
                endTime,
                amountPaid: 0n,
                lastPaymentTime: startTime,
                active: false,
            };
            this.streams.set(streamId, streamState);
            return { streamId, initialTransaction: transaction };
        }
        catch (error) {
            throw new PaymentError(`Failed to create payment stream: ${error instanceof Error ? error.message : 'Unknown error'}`, error instanceof Error ? error : undefined);
        }
    }
    /**
     * Start a payment stream
     */
    async startStream(streamId) {
        const stream = this.streams.get(streamId);
        if (!stream) {
            throw new PaymentError(`Stream not found: ${streamId}`);
        }
        if (stream.active) {
            throw new PaymentError(`Stream already active: ${streamId}`);
        }
        try {
            // Execute initial payment
            const transaction = await this.createPaymentTransaction({
                method: PaymentMethod.Stream,
                payer: stream.payer,
                recipient: stream.recipient,
                ratePerSecond: stream.ratePerSecond,
                duration: (stream.endTime - stream.startTime) / 1000,
                pricing: { basePrice: stream.totalAmount, currency: 'A2AMPL' },
            }, stream.totalAmount);
            const result = await this._client.sendAndConfirmTransaction(transaction);
            // Mark stream as active
            stream.active = true;
            stream.amountPaid = stream.totalAmount;
            stream.lastPaymentTime = Date.now();
            // Set up automatic stream monitoring
            this.startStreamMonitoring(streamId);
            return result;
        }
        catch (error) {
            throw new PaymentError(`Failed to start payment stream: ${error instanceof Error ? error.message : 'Unknown error'}`, error instanceof Error ? error : undefined);
        }
    }
    /**
     * Stop a payment stream
     */
    async stopStream(streamId) {
        const stream = this.streams.get(streamId);
        if (!stream) {
            throw new PaymentError(`Stream not found: ${streamId}`);
        }
        if (!stream.active) {
            throw new PaymentError(`Stream not active: ${streamId}`);
        }
        try {
            const currentTime = Date.now();
            const elapsedTime = Math.min(currentTime - stream.startTime, stream.endTime - stream.startTime);
            const actualAmount = stream.ratePerSecond * BigInt(Math.floor(elapsedTime / 1000));
            const refundAmount = stream.totalAmount - actualAmount;
            // Stop monitoring
            this.stopStreamMonitoring(streamId);
            // Mark stream as inactive
            stream.active = false;
            let refundResult;
            // Create refund transaction if there's excess payment
            if (refundAmount > 0n) {
                const refundTransaction = await this.createRefundTransaction(stream, refundAmount);
                refundResult = await this._client.sendAndConfirmTransaction(refundTransaction);
            }
            return {
                refund: refundResult ?? undefined,
                finalAmount: actualAmount,
            };
        }
        catch (error) {
            throw new PaymentError(`Failed to stop payment stream: ${error instanceof Error ? error.message : 'Unknown error'}`, error instanceof Error ? error : undefined);
        }
    }
    /**
     * Get stream status
     */
    getStreamStatus(streamId) {
        const stream = this.streams.get(streamId);
        if (!stream) {
            throw new PaymentError(`Stream not found: ${streamId}`);
        }
        const currentTime = Date.now();
        const elapsedTime = Math.min(currentTime - stream.startTime, stream.endTime - stream.startTime);
        const remainingTime = Math.max(stream.endTime - currentTime, 0);
        const currentAmount = stream.ratePerSecond * BigInt(Math.floor(elapsedTime / 1000));
        const remainingAmount = stream.totalAmount - currentAmount;
        const progress = elapsedTime / (stream.endTime - stream.startTime);
        return {
            ...stream,
            currentAmount,
            remainingAmount,
            elapsedTime,
            remainingTime,
            progress: Math.min(progress, 1),
        };
    }
    /**
     * List all streams
     */
    listStreams(activeOnly = false) {
        const streams = Array.from(this.streams.values());
        return activeOnly ? streams.filter(s => s.active) : streams;
    }
    /**
     * Get stream by payer
     */
    getStreamsByPayer(payer) {
        return Array.from(this.streams.values()).filter(s => s.payer.equals(payer));
    }
    /**
     * Get stream by recipient
     */
    getStreamsByRecipient(recipient) {
        return Array.from(this.streams.values()).filter(s => s.recipient.equals(recipient));
    }
    /**
     * Clean up completed streams
     */
    cleanupCompletedStreams() {
        const currentTime = Date.now();
        let cleaned = 0;
        for (const [streamId, stream] of this.streams.entries()) {
            if (!stream.active && currentTime > stream.endTime + 3600000) {
                // 1 hour after end
                this.streams.delete(streamId);
                this.stopStreamMonitoring(streamId);
                cleaned++;
            }
        }
        return cleaned;
    }
    /**
     * Generate unique stream ID
     */
    generateStreamId() {
        return `stream_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    }
    /**
     * Validate stream configuration
     */
    validateStreamConfig(config) {
        Validator.validatePublicKey(config.payer, 'payer');
        Validator.validatePublicKey(config.recipient, 'recipient');
        if (config.ratePerSecond <= 0n) {
            throw new ValidationError('Rate per second must be greater than 0', 'ratePerSecond');
        }
        if (config.duration <= 0) {
            throw new ValidationError('Duration must be greater than 0', 'duration');
        }
        if (config.duration > 86400) {
            // 24 hours max
            throw new ValidationError('Duration cannot exceed 24 hours', 'duration');
        }
        if (config.payer.equals(config.recipient)) {
            throw new ValidationError('Payer and recipient cannot be the same', 'recipient');
        }
    }
    /**
     * Create payment transaction
     */
    async createPaymentTransaction(config, amount) {
        try {
            const transaction = new Transaction();
            const payer = config.payer;
            const recipient = config.recipient;
            // Get token mint for the cluster
            const tokenMint = TOKEN_MINTS[this._client.cluster === 'mainnet-beta' ? 'mainnet' : 'devnet'];
            // Get associated token accounts
            const payerTokenAccount = await getAssociatedTokenAddress(tokenMint, payer, false, TOKEN_PROGRAM_ID);
            const recipientTokenAccount = await getAssociatedTokenAddress(tokenMint, recipient, false, TOKEN_PROGRAM_ID);
            // Check if payer token account exists and has sufficient balance
            await this.validatePayerBalance(payerTokenAccount, amount);
            // Check if recipient token account exists, create if needed
            await this.ensureRecipientTokenAccount(transaction, recipient, recipientTokenAccount, tokenMint);
            // Create transfer instruction
            const transferInstruction = createTransferInstruction(payerTokenAccount, recipientTokenAccount, payer, amount, [], TOKEN_PROGRAM_ID);
            transaction.add(transferInstruction);
            // Set recent blockhash and fee payer
            const { blockhash } = await this._client.connection.getLatestBlockhash();
            transaction.recentBlockhash = blockhash;
            transaction.feePayer = payer;
            return transaction;
        }
        catch (error) {
            throw new PaymentError(`Failed to create payment transaction: ${error instanceof Error ? error.message : 'Unknown error'}`, error instanceof Error ? error : undefined);
        }
    }
    /**
     * Create refund transaction
     */
    async createRefundTransaction(stream, refundAmount) {
        try {
            const transaction = new Transaction();
            // Get token mint for the cluster
            const tokenMint = TOKEN_MINTS[this._client.cluster === 'mainnet-beta' ? 'mainnet' : 'devnet'];
            // Get associated token accounts (reverse direction for refund)
            const recipientTokenAccount = await getAssociatedTokenAddress(tokenMint, stream.recipient, false, TOKEN_PROGRAM_ID);
            const payerTokenAccount = await getAssociatedTokenAddress(tokenMint, stream.payer, false, TOKEN_PROGRAM_ID);
            // Create transfer instruction (from recipient back to payer)
            const transferInstruction = createTransferInstruction(recipientTokenAccount, payerTokenAccount, stream.recipient, refundAmount, [], TOKEN_PROGRAM_ID);
            transaction.add(transferInstruction);
            // Set recent blockhash and fee payer
            const { blockhash } = await this._client.connection.getLatestBlockhash();
            transaction.recentBlockhash = blockhash;
            transaction.feePayer = stream.recipient;
            return transaction;
        }
        catch (error) {
            throw new PaymentError(`Failed to create refund transaction: ${error instanceof Error ? error.message : 'Unknown error'}`, error instanceof Error ? error : undefined);
        }
    }
    /**
     * Start monitoring a stream
     */
    startStreamMonitoring(streamId) {
        const stream = this.streams.get(streamId);
        if (!stream)
            return;
        // Set up timer to automatically stop stream when duration expires
        const timeout = setTimeout(() => {
            this.stopStream(streamId).catch(error => {
                console.error(`Failed to auto-stop stream ${streamId}:`, error);
            });
        }, stream.endTime - Date.now());
        this.timers.set(streamId, timeout);
    }
    /**
     * Stop monitoring a stream
     */
    stopStreamMonitoring(streamId) {
        const timeout = this.timers.get(streamId);
        if (timeout) {
            clearTimeout(timeout);
            this.timers.delete(streamId);
        }
    }
    /**
     * Validate payer has sufficient balance
     */
    async validatePayerBalance(payerTokenAccount, _amount) {
        try {
            const accountInfo = await this._client.getAccountInfo(payerTokenAccount);
            if (!accountInfo) {
                throw new PaymentError('Payer token account does not exist');
            }
            // Parse token account data to get balance
            // This would require proper SPL token account parsing
        }
        catch (error) {
            throw new PaymentError(`Failed to validate payer balance: ${error instanceof Error ? error.message : 'Unknown error'}`, error instanceof Error ? error : undefined);
        }
    }
    /**
     * Ensure recipient token account exists
     */
    async ensureRecipientTokenAccount(transaction, recipient, recipientTokenAccount, tokenMint) {
        try {
            const accountExists = await this._client.accountExists(recipientTokenAccount);
            if (!accountExists) {
                // Add instruction to create associated token account
                const { createAssociatedTokenAccountInstruction } = await import('@solana/spl-token');
                const createAtaInstruction = createAssociatedTokenAccountInstruction(recipient, // payer of the creation fee
                recipientTokenAccount, recipient, tokenMint, TOKEN_PROGRAM_ID);
                transaction.add(createAtaInstruction);
            }
        }
        catch (error) {
            throw new PaymentError(`Failed to ensure recipient token account: ${error instanceof Error ? error.message : 'Unknown error'}`, error instanceof Error ? error : undefined);
        }
    }
}
//# sourceMappingURL=stream-payment-flow.js.map