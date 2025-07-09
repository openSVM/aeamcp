import { Connection, PublicKey, Transaction, VersionedTransaction, Commitment, Cluster } from '@solana/web3.js';
import { Program, AnchorProvider, Wallet } from '@coral-xyz/anchor';
import { SdkConfig, TransactionResult } from './types.js';
/**
 * Solana connection wrapper with Anchor integration
 */
export declare class SolanaClient {
    readonly connection: Connection;
    readonly cluster: Cluster;
    readonly commitment: Commitment;
    private provider?;
    private agentRegistryProgram?;
    private mcpRegistryProgram?;
    constructor(config: SdkConfig);
    /**
     * Initialize the client with a wallet
     */
    initialize(wallet: Wallet): Promise<void>;
    /**
     * Get the Anchor provider
     */
    getProvider(): AnchorProvider;
    /**
     * Get the Agent Registry program
     */
    getAgentRegistryProgram(): Program;
    /**
     * Get the MCP Server Registry program
     */
    getMcpRegistryProgram(): Program;
    /**
     * Send and confirm transaction
     */
    sendAndConfirmTransaction(transaction: Transaction | VersionedTransaction, signers?: any[]): Promise<TransactionResult>;
    /**
     * Get account info with retries
     */
    getAccountInfo(publicKey: PublicKey, commitment?: Commitment): Promise<any>;
    /**
     * Get multiple accounts with batching
     */
    getMultipleAccountsInfo(publicKeys: PublicKey[], commitment?: Commitment): Promise<any[]>;
    /**
     * Get current slot
     */
    getCurrentSlot(): Promise<bigint>;
    /**
     * Check if account exists
     */
    accountExists(publicKey: PublicKey): Promise<boolean>;
    /**
     * Initialize programs with IDLs
     */
    private initializePrograms;
    /**
     * Health check for the connection
     */
    healthCheck(): Promise<{
        connected: boolean;
        slot: bigint;
        version: any;
    }>;
}
//# sourceMappingURL=client.d.ts.map