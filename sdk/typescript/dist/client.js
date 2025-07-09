import { Connection, PublicKey, VersionedTransaction, clusterApiUrl, } from '@solana/web3.js';
import { Program, AnchorProvider } from '@coral-xyz/anchor';
import { NetworkError, ConfigError, IdlError } from './errors.js';
import { loadIdlForNetwork } from './idl/index.js';
/**
 * Solana connection wrapper with Anchor integration
 */
export class SolanaClient {
    connection;
    cluster;
    commitment;
    provider;
    agentRegistryProgram;
    mcpRegistryProgram;
    constructor(config) {
        this.cluster = config.cluster;
        this.commitment = config.commitment || 'confirmed';
        // Initialize connection
        const rpcUrl = config.rpcUrl || clusterApiUrl(this.cluster);
        this.connection = new Connection(rpcUrl, this.commitment);
    }
    /**
     * Initialize the client with a wallet
     */
    async initialize(wallet) {
        try {
            // Create Anchor provider
            this.provider = new AnchorProvider(this.connection, wallet, {
                commitment: this.commitment,
                skipPreflight: false,
            });
            // Load and initialize programs
            await this.initializePrograms();
        }
        catch (error) {
            throw new NetworkError(`Failed to initialize client: ${error instanceof Error ? error.message : 'Unknown error'}`, error instanceof Error ? error : undefined);
        }
    }
    /**
     * Get the Anchor provider
     */
    getProvider() {
        if (!this.provider) {
            throw new ConfigError('Client not initialized. Call initialize() first.');
        }
        return this.provider;
    }
    /**
     * Get the Agent Registry program
     */
    getAgentRegistryProgram() {
        if (!this.agentRegistryProgram) {
            throw new ConfigError('Agent Registry program not initialized');
        }
        return this.agentRegistryProgram;
    }
    /**
     * Get the MCP Server Registry program
     */
    getMcpRegistryProgram() {
        if (!this.mcpRegistryProgram) {
            throw new ConfigError('MCP Server Registry program not initialized');
        }
        return this.mcpRegistryProgram;
    }
    /**
     * Send and confirm transaction
     */
    async sendAndConfirmTransaction(transaction, signers) {
        if (!this.provider) {
            throw new ConfigError('Client not initialized');
        }
        try {
            let signature;
            if (transaction instanceof VersionedTransaction) {
                signature = await this.connection.sendTransaction(transaction);
            }
            else {
                signature = await this.provider.sendAndConfirm(transaction, signers);
            }
            // Get confirmation details
            const confirmation = await this.connection.getSignatureStatus(signature, {
                searchTransactionHistory: true,
            });
            return {
                signature,
                slot: BigInt(confirmation.value?.slot || 0),
                confirmationStatus: confirmation.value?.confirmationStatus || 'processed',
            };
        }
        catch (error) {
            throw new NetworkError(`Transaction failed: ${error instanceof Error ? error.message : 'Unknown error'}`, error instanceof Error ? error : undefined);
        }
    }
    /**
     * Get account info with retries
     */
    async getAccountInfo(publicKey, commitment) {
        try {
            const accountInfo = await this.connection.getAccountInfo(publicKey, commitment || this.commitment);
            return accountInfo;
        }
        catch (error) {
            throw new NetworkError(`Failed to get account info: ${error instanceof Error ? error.message : 'Unknown error'}`, error instanceof Error ? error : undefined);
        }
    }
    /**
     * Get multiple accounts with batching
     */
    async getMultipleAccountsInfo(publicKeys, commitment) {
        try {
            const accountsInfo = await this.connection.getMultipleAccountsInfo(publicKeys, commitment || this.commitment);
            return accountsInfo;
        }
        catch (error) {
            throw new NetworkError(`Failed to get multiple accounts info: ${error instanceof Error ? error.message : 'Unknown error'}`, error instanceof Error ? error : undefined);
        }
    }
    /**
     * Get current slot
     */
    async getCurrentSlot() {
        try {
            const slot = await this.connection.getSlot(this.commitment);
            return BigInt(slot);
        }
        catch (error) {
            throw new NetworkError(`Failed to get current slot: ${error instanceof Error ? error.message : 'Unknown error'}`, error instanceof Error ? error : undefined);
        }
    }
    /**
     * Check if account exists
     */
    async accountExists(publicKey) {
        try {
            const accountInfo = await this.getAccountInfo(publicKey);
            return accountInfo !== null;
        }
        catch (error) {
            // If it's a network error, rethrow. Otherwise, assume account doesn't exist.
            if (error instanceof NetworkError) {
                throw error;
            }
            return false;
        }
    }
    /**
     * Initialize programs with IDLs
     */
    async initializePrograms() {
        if (!this.provider) {
            throw new ConfigError('Provider not initialized');
        }
        try {
            // Load IDLs
            const agentRegistryIdl = await loadIdlForNetwork('agent_registry', this.cluster);
            const mcpRegistryIdl = await loadIdlForNetwork('mcp_server_registry', this.cluster);
            // Get program IDs from config or use defaults
            const agentRegistryProgramId = new PublicKey('AgentReg11111111111111111111111111111111111'); // placeholder
            const mcpRegistryProgramId = new PublicKey('11111111111111111111111111111111'); // placeholder
            // Initialize programs
            this.agentRegistryProgram = new Program(agentRegistryIdl, this.provider);
            this.mcpRegistryProgram = new Program(mcpRegistryIdl, this.provider);
        }
        catch (error) {
            throw new IdlError(`Failed to initialize programs: ${error instanceof Error ? error.message : 'Unknown error'}`, error instanceof Error ? error : undefined);
        }
    }
    /**
     * Health check for the connection
     */
    async healthCheck() {
        try {
            const [slot, version] = await Promise.all([
                this.getCurrentSlot(),
                this.connection.getVersion(),
                // this.connection.getHealth(), // Not available in @solana/web3.js
            ]);
            return {
                connected: true,
                slot,
                version,
                // health, // Not available
            };
        }
        catch (error) {
            return {
                connected: false,
                slot: 0n,
                version: null,
                // health: 'unhealthy', // Not available in @solana/web3.js
            };
        }
    }
}
//# sourceMappingURL=client.js.map