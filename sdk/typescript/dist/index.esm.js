import { clusterApiUrl, Connection, VersionedTransaction, PublicKey, Transaction } from '@solana/web3.js';
import { AnchorProvider, Program } from '@coral-xyz/anchor';
import { readFileSync } from 'fs';
import { createHash } from 'crypto';
import { getAssociatedTokenAddress, TOKEN_PROGRAM_ID, createTransferInstruction } from '@solana/spl-token';

/**
 * Base SDK error class
 */
class SdkError extends Error {
    code;
    programErrorCode;
    transactionSignature;
    cause;
    constructor(details) {
        super(details.message);
        this.name = this.constructor.name;
        this.code = details.code;
        this.programErrorCode = details.programErrorCode ?? undefined;
        this.transactionSignature = details.transactionSignature ?? undefined;
        this.cause = details.cause ?? undefined;
        // Maintains proper stack trace for where our error was thrown (only available on V8)
        if (Error.captureStackTrace) {
            Error.captureStackTrace(this, this.constructor);
        }
    }
    toJSON() {
        return {
            name: this.name,
            message: this.message,
            code: this.code,
            programErrorCode: this.programErrorCode,
            transactionSignature: this.transactionSignature,
            stack: this.stack,
            cause: this.cause?.message,
        };
    }
}
/**
 * Validation errors for input parameters
 */
class ValidationError extends SdkError {
    constructor(message, field) {
        super({
            code: 'VALIDATION_ERROR',
            message: field ? `Validation failed for field '${field}': ${message}` : message,
        });
    }
}
/**
 * Network/RPC related errors
 */
class NetworkError extends SdkError {
    constructor(message, cause) {
        super({
            code: 'NETWORK_ERROR',
            message: `Network error: ${message}`,
            cause,
        });
    }
}
/**
 * Transaction related errors
 */
class TransactionError extends SdkError {
    constructor(message, signature, programErrorCode, cause) {
        super({
            code: 'TRANSACTION_ERROR',
            message: `Transaction error: ${message}`,
            transactionSignature: signature,
            programErrorCode,
            cause,
        });
    }
}
/**
 * Program execution errors
 */
class ProgramError extends SdkError {
    constructor(message, programErrorCode, signature, cause) {
        super({
            code: 'PROGRAM_ERROR',
            message: `Program error: ${message}`,
            programErrorCode,
            transactionSignature: signature,
            cause,
        });
    }
}
/**
 * Account related errors
 */
class AccountError extends SdkError {
    constructor(message, cause) {
        super({
            code: 'ACCOUNT_ERROR',
            message: `Account error: ${message}`,
            cause,
        });
    }
}
/**
 * IDL loading/parsing errors
 */
class IdlError extends SdkError {
    constructor(message, cause) {
        super({
            code: 'IDL_ERROR',
            message: `IDL error: ${message}`,
            cause,
        });
    }
}
/**
 * Payment flow related errors
 */
class PaymentError extends SdkError {
    constructor(message, cause) {
        super({
            code: 'PAYMENT_ERROR',
            message: `Payment error: ${message}`,
            cause,
        });
    }
}
/**
 * Configuration errors
 */
class ConfigError extends SdkError {
    constructor(message) {
        super({
            code: 'CONFIG_ERROR',
            message: `Configuration error: ${message}`,
        });
    }
}
/**
 * Registry specific errors
 */
class RegistryError extends SdkError {
    constructor(message, programErrorCode, signature, cause) {
        super({
            code: 'REGISTRY_ERROR',
            message: `Registry error: ${message}`,
            programErrorCode,
            transactionSignature: signature,
            cause,
        });
    }
}
/**
 * Maps Solana program error codes to meaningful error messages
 */
function mapProgramError(errorCode) {
    const errorMap = {
        // Common Anchor errors
        100: 'Invalid instruction data',
        101: 'Invalid account data',
        102: 'Invalid program id',
        103: 'Invalid account owner',
        104: 'Invalid account info',
        // Agent Registry specific errors (these would come from the actual program)
        6000: 'Agent ID already exists',
        6001: 'Agent ID too long',
        6002: 'Agent name too long',
        6003: 'Agent description too long',
        6004: 'Invalid agent status',
        6005: 'Unauthorized agent update',
        6006: 'Agent not found',
        6007: 'Invalid service endpoint',
        6008: 'Too many service endpoints',
        6009: 'Invalid skill definition',
        6010: 'Too many skills',
        6011: 'Invalid tag format',
        6012: 'Too many tags',
        6013: 'Invalid URL format',
        6014: 'Insufficient stake amount',
        6015: 'Invalid lock period',
        6016: 'Stake still locked',
        6017: 'Invalid tier for stake amount',
        // MCP Server Registry specific errors
        6100: 'Server ID already exists',
        6101: 'Server ID too long',
        6102: 'Server name too long',
        6103: 'Invalid server status',
        6104: 'Unauthorized server update',
        6105: 'Server not found',
        6106: 'Invalid endpoint URL',
        6107: 'Invalid capabilities summary',
        6108: 'Too many tool definitions',
        6109: 'Too many resource definitions',
        6110: 'Too many prompt definitions',
        6111: 'Invalid tool definition',
        6112: 'Invalid resource definition',
        6113: 'Invalid prompt definition',
        // Payment and fee errors
        6200: 'Insufficient balance',
        6201: 'Invalid payment amount',
        6202: 'Payment already completed',
        6203: 'Payment expired',
        6204: 'Invalid recipient',
        6205: 'Fee calculation error',
        6206: 'Invalid pricing configuration',
        // Token and staking errors
        6300: 'Invalid token mint',
        6301: 'Invalid token account',
        6302: 'Token transfer failed',
        6303: 'Invalid stake amount',
        6304: 'Stake account not found',
        6305: 'Staking period not elapsed',
        6306: 'Invalid unstake request',
    };
    return errorMap[errorCode] ?? `Unknown program error: ${errorCode}`;
}
/**
 * Error factory for creating appropriate error types
 */
class ErrorFactory {
    static createFromProgramError(errorCode, signature, cause) {
        const message = mapProgramError(errorCode);
        return new ProgramError(message, errorCode, signature, cause);
    }
    static createFromTransactionError(error, signature) {
        // Try to extract program error code from Solana transaction error
        const programErrorMatch = error.message.match(/custom program error: 0x([0-9a-fA-F]+)/);
        if (programErrorMatch) {
            const errorCode = parseInt(programErrorMatch[1], 16);
            return this.createFromProgramError(errorCode, signature, error);
        }
        return new TransactionError(error.message, signature, undefined, error);
    }
    static createFromNetworkError(error) {
        return new NetworkError(error.message, error);
    }
    static createValidationError(message, field) {
        return new ValidationError(message, field);
    }
}

/**
 * IDL loader with caching and hash verification
 */
class IdlLoader {
    static cache = new Map();
    static CACHE_TTL = 300_000; // 5 minutes
    /**
     * Load and cache IDL with hash verification
     */
    static async loadIdl(programName, expectedHash, forceFresh = false) {
        const cacheKey = `${programName}_idl`;
        // Check cache first (unless forcing fresh)
        if (!forceFresh) {
            const cached = this.cache.get(cacheKey);
            if (cached && Date.now() - cached.lastUpdated < this.CACHE_TTL) {
                return cached.idl;
            }
        }
        try {
            // Load IDL from file
            const idlPath = this.getIdlPath(programName);
            const idlContent = readFileSync(idlPath, 'utf8');
            const idl = JSON.parse(idlContent);
            // Verify hash if provided
            if (expectedHash) {
                const actualHash = this.calculateIdlHash(idlContent);
                if (actualHash !== expectedHash) {
                    throw new IdlError(`IDL hash mismatch for ${programName}. Expected: ${expectedHash}, Actual: ${actualHash}`);
                }
            }
            // Cache the IDL
            this.cache.set(cacheKey, {
                idl,
                hash: this.calculateIdlHash(idlContent),
                lastUpdated: Date.now(),
            });
            return idl;
        }
        catch (error) {
            if (error instanceof IdlError) {
                throw error;
            }
            throw new IdlError(`Failed to load IDL for ${programName}: ${error instanceof Error ? error.message : 'Unknown error'}`);
        }
    }
    /**
     * Get the cached IDL hash
     */
    static getCachedHash(programName) {
        const cacheKey = `${programName}_idl`;
        return this.cache.get(cacheKey)?.hash;
    }
    /**
     * Calculate SHA256 hash of IDL content
     */
    static calculateIdlHash(idlContent) {
        return createHash('sha256').update(idlContent, 'utf8').digest('hex');
    }
    /**
     * Get the file path for the IDL
     */
    static getIdlPath(programName) {
        // In a real implementation, these paths would be relative to the package root
        // or loaded from a remote source
        const basePath = process.env.IDL_BASE_PATH || '../../idl';
        switch (programName) {
            case 'agent_registry':
                return `${basePath}/agent_registry.json`;
            case 'mcp_server_registry':
                return `${basePath}/mcp_server_registry.json`;
            default:
                throw new IdlError(`Unknown program name: ${programName}`);
        }
    }
    /**
     * Clear the IDL cache
     */
    static clearCache() {
        this.cache.clear();
    }
    /**
     * Get cache statistics
     */
    static getCacheStats() {
        return {
            entries: this.cache.size,
            keys: Array.from(this.cache.keys()),
        };
    }
}
/**
 * Known IDL hashes for verification (these would be updated when IDLs change)
 */
const KNOWN_IDL_HASHES = {
    agent_registry: {
        // These would be the actual hashes of the IDL files
        mainnet: '0000000000000000000000000000000000000000000000000000000000000000', // placeholder
        devnet: '0000000000000000000000000000000000000000000000000000000000000000', // placeholder
        testnet: '0000000000000000000000000000000000000000000000000000000000000000', // placeholder
    },
    mcp_server_registry: {
        mainnet: '0000000000000000000000000000000000000000000000000000000000000000', // placeholder
        devnet: '0000000000000000000000000000000000000000000000000000000000000000', // placeholder
        testnet: '0000000000000000000000000000000000000000000000000000000000000000', // placeholder
    },
};
/**
 * Load IDL with network-specific hash verification
 */
async function loadIdlForNetwork(programName, network, forceFresh = false) {
    const networkKey = network === 'mainnet-beta' ? 'mainnet' : network;
    const expectedHash = KNOWN_IDL_HASHES[programName][networkKey];
    return IdlLoader.loadIdl(programName, expectedHash, forceFresh);
}

/**
 * Solana connection wrapper with Anchor integration
 */
class SolanaClient {
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

// Agent Registry Types
var AgentStatus;
(function (AgentStatus) {
    AgentStatus[AgentStatus["Pending"] = 0] = "Pending";
    AgentStatus[AgentStatus["Active"] = 1] = "Active";
    AgentStatus[AgentStatus["Inactive"] = 2] = "Inactive";
    AgentStatus[AgentStatus["Deregistered"] = 3] = "Deregistered";
})(AgentStatus || (AgentStatus = {}));
var AgentTier;
(function (AgentTier) {
    AgentTier["Bronze"] = "bronze";
    AgentTier["Silver"] = "silver";
    AgentTier["Gold"] = "gold";
    AgentTier["Platinum"] = "platinum";
})(AgentTier || (AgentTier = {}));
// MCP Server Registry Types
var McpServerStatus;
(function (McpServerStatus) {
    McpServerStatus[McpServerStatus["Pending"] = 0] = "Pending";
    McpServerStatus[McpServerStatus["Active"] = 1] = "Active";
    McpServerStatus[McpServerStatus["Inactive"] = 2] = "Inactive";
    McpServerStatus[McpServerStatus["Deregistered"] = 3] = "Deregistered";
})(McpServerStatus || (McpServerStatus = {}));
// Payment Flow Types
var PaymentMethod;
(function (PaymentMethod) {
    PaymentMethod["Prepay"] = "prepay";
    PaymentMethod["PayAsYouGo"] = "pay_as_you_go";
    PaymentMethod["Stream"] = "stream";
})(PaymentMethod || (PaymentMethod = {}));
// Constants from program
const CONSTANTS = {
    // Size limits
    MAX_AGENT_ID_LEN: 64,
    MAX_AGENT_NAME_LEN: 128,
    MAX_AGENT_DESCRIPTION_LEN: 512,
    MAX_AGENT_VERSION_LEN: 32,
    MAX_PROVIDER_NAME_LEN: 128,
    MAX_PROVIDER_URL_LEN: 256,
    MAX_DOCUMENTATION_URL_LEN: 256,
    MAX_SERVICE_ENDPOINTS: 3,
    MAX_ENDPOINT_PROTOCOL_LEN: 64,
    MAX_ENDPOINT_URL_LEN: 256,
    MAX_SUPPORTED_MODES: 5,
    MAX_MODE_LEN: 64,
    MAX_SKILLS: 10,
    MAX_SKILL_ID_LEN: 64,
    MAX_SKILL_NAME_LEN: 128,
    MAX_SKILL_TAGS: 5,
    MAX_SKILL_TAG_LEN: 32,
    MAX_SECURITY_INFO_URI_LEN: 256,
    MAX_AEA_ADDRESS_LEN: 128,
    MAX_ECONOMIC_INTENT_LEN: 256,
    MAX_EXTENDED_METADATA_URI_LEN: 256,
    MAX_AGENT_TAGS: 10,
    MAX_AGENT_TAG_LEN: 32,
    // MCP Server limits
    MAX_SERVER_ID_LEN: 64,
    MAX_SERVER_NAME_LEN: 128,
    MAX_SERVER_VERSION_LEN: 32,
    MAX_SERVER_ENDPOINT_URL_LEN: 256,
    MAX_SERVER_CAPABILITIES_SUMMARY_LEN: 256,
    MAX_ONCHAIN_TOOL_DEFINITIONS: 5,
    MAX_TOOL_NAME_LEN: 64,
    MAX_TOOL_TAGS: 3,
    MAX_TOOL_TAG_LEN: 32,
    MAX_ONCHAIN_RESOURCE_DEFINITIONS: 5,
    MAX_RESOURCE_URI_PATTERN_LEN: 128,
    MAX_RESOURCE_TAGS: 3,
    MAX_RESOURCE_TAG_LEN: 32,
    MAX_ONCHAIN_PROMPT_DEFINITIONS: 5,
    MAX_PROMPT_NAME_LEN: 64,
    MAX_PROMPT_TAGS: 3,
    MAX_PROMPT_TAG_LEN: 32,
    MAX_FULL_CAPABILITIES_URI_LEN: 256,
    MAX_SERVER_TAGS: 10,
    MAX_SERVER_TAG_LEN: 32,
    // Token amounts (in base units)
    A2AMPL_DECIMALS: 9,
    A2AMPL_BASE_UNIT: 1000000000n,
    AGENT_REGISTRATION_FEE: 100000000000n, // 100 A2AMPL
    MCP_REGISTRATION_FEE: 50000000000n, // 50 A2AMPL
    // Staking amounts
    BRONZE_TIER_STAKE: 1000000000000n, // 1,000 A2AMPL
    SILVER_TIER_STAKE: 10000000000000n, // 10,000 A2AMPL
    GOLD_TIER_STAKE: 50000000000000n, // 50,000 A2AMPL
    PLATINUM_TIER_STAKE: 100000000000000n, // 100,000 A2AMPL
    // Lock periods (seconds)
    BRONZE_LOCK_PERIOD: 2_592_000, // 30 days
    SILVER_LOCK_PERIOD: 7_776_000, // 90 days
    GOLD_LOCK_PERIOD: 15_552_000, // 180 days
    PLATINUM_LOCK_PERIOD: 31_536_000, // 365 days
    // Service fees
    MIN_SERVICE_FEE: 1000000000n, // 1.0 A2AMPL
    MIN_TOOL_FEE: 1000000000n, // 1.0 A2AMPL
    MIN_RESOURCE_FEE: 500000000n, // 0.5 A2AMPL
    MIN_PROMPT_FEE: 2000000000n, // 2.0 A2AMPL
    // Priority and quality
    MIN_PRIORITY_MULTIPLIER: 100, // 1.0x
    MAX_PRIORITY_MULTIPLIER: 300, // 3.0x
    MAX_BULK_DISCOUNT: 50, // 50%
    MIN_UPTIME_FOR_PREMIUM: 95, // 95%
    // PDA seeds
    AGENT_REGISTRY_PDA_SEED: 'agent_reg_v1',
    MCP_SERVER_REGISTRY_PDA_SEED: 'mcp_srv_reg_v1',
    STAKING_VAULT_SEED: 'staking_vault',
    FEE_VAULT_SEED: 'fee_vault',
    REGISTRATION_VAULT_SEED: 'registration_vault',
};
// Token mint addresses
const TOKEN_MINTS = {
    mainnet: new PublicKey('Cpzvdx6pppc9TNArsGsqgShCsKC9NCCjA2gtzHvUpump'),
    devnet: new PublicKey('A2AMPLyncKHwfSnwRNsJ2qsjsetgo9fGkP8YZPsDZ9mE'),
};
// Program IDs (placeholders - to be updated with actual program IDs)
const PROGRAM_IDS = {
    agentRegistry: new PublicKey('AgentReg11111111111111111111111111111111111'),
    mcpServerRegistry: new PublicKey('11111111111111111111111111111111'), // TBD
};

/**
 * Validation utilities for SDK inputs
 */
class Validator {
    /**
     * Validates string length
     */
    static validateStringLength(value, maxLength, fieldName) {
        if (value.length > maxLength) {
            throw new ValidationError(`${fieldName} exceeds maximum length of ${maxLength} characters`, fieldName);
        }
    }
    /**
     * Validates required string field
     */
    static validateRequiredString(value, fieldName, maxLength) {
        if (!value || value.trim().length === 0) {
            throw new ValidationError(`${fieldName} is required and cannot be empty`, fieldName);
        }
        if (maxLength) {
            this.validateStringLength(value, maxLength, fieldName);
        }
    }
    /**
     * Validates optional string field
     */
    static validateOptionalString(value, fieldName, maxLength) {
        if (value !== undefined) {
            this.validateStringLength(value, maxLength, fieldName);
        }
    }
    /**
     * Validates URL format
     */
    static validateUrl(url, fieldName, allowedProtocols = ['http:', 'https:']) {
        try {
            const urlObj = new URL(url);
            if (!allowedProtocols.includes(urlObj.protocol)) {
                throw new ValidationError(`${fieldName} must use one of the following protocols: ${allowedProtocols.join(', ')}`, fieldName);
            }
        }
        catch (error) {
            if (error instanceof ValidationError)
                throw error;
            throw new ValidationError(`${fieldName} is not a valid URL`, fieldName);
        }
    }
    /**
     * Validates array length
     */
    static validateArrayLength(array, maxLength, fieldName) {
        if (array.length > maxLength) {
            throw new ValidationError(`${fieldName} exceeds maximum of ${maxLength} items`, fieldName);
        }
    }
    /**
     * Validates PublicKey
     */
    static validatePublicKey(key, fieldName) {
        try {
            return typeof key === 'string' ? new PublicKey(key) : key;
        }
        catch (error) {
            throw new ValidationError(`${fieldName} is not a valid Solana public key`, fieldName);
        }
    }
    /**
     * Validates agent ID format (alphanumeric, hyphens, underscores only)
     */
    static validateAgentId(agentId) {
        this.validateRequiredString(agentId, 'agentId', CONSTANTS.MAX_AGENT_ID_LEN);
        const validPattern = /^[a-zA-Z0-9_-]+$/;
        if (!validPattern.test(agentId)) {
            throw new ValidationError('Agent ID can only contain alphanumeric characters, hyphens, and underscores', 'agentId');
        }
    }
    /**
     * Validates server ID format (same as agent ID)
     */
    static validateServerId(serverId) {
        this.validateRequiredString(serverId, 'serverId', CONSTANTS.MAX_SERVER_ID_LEN);
        const validPattern = /^[a-zA-Z0-9_-]+$/;
        if (!validPattern.test(serverId)) {
            throw new ValidationError('Server ID can only contain alphanumeric characters, hyphens, and underscores', 'serverId');
        }
    }
    /**
     * Validates service endpoint
     */
    static validateServiceEndpoint(endpoint, index) {
        const fieldPrefix = `serviceEndpoints[${index}]`;
        this.validateRequiredString(endpoint.protocol, `${fieldPrefix}.protocol`, CONSTANTS.MAX_ENDPOINT_PROTOCOL_LEN);
        this.validateRequiredString(endpoint.url, `${fieldPrefix}.url`, CONSTANTS.MAX_ENDPOINT_URL_LEN);
        this.validateUrl(endpoint.url, `${fieldPrefix}.url`);
    }
    /**
     * Validates agent skill
     */
    static validateAgentSkill(skill, index) {
        const fieldPrefix = `skills[${index}]`;
        this.validateRequiredString(skill.id, `${fieldPrefix}.id`, CONSTANTS.MAX_SKILL_ID_LEN);
        this.validateRequiredString(skill.name, `${fieldPrefix}.name`, CONSTANTS.MAX_SKILL_NAME_LEN);
        this.validateArrayLength(skill.tags, CONSTANTS.MAX_SKILL_TAGS, `${fieldPrefix}.tags`);
        skill.tags.forEach((tag, tagIndex) => {
            this.validateRequiredString(tag, `${fieldPrefix}.tags[${tagIndex}]`, CONSTANTS.MAX_SKILL_TAG_LEN);
        });
    }
    /**
     * Validates MCP tool definition
     */
    static validateMcpToolDefinition(tool, index) {
        const fieldPrefix = `onchainToolDefinitions[${index}]`;
        this.validateRequiredString(tool.name, `${fieldPrefix}.name`, CONSTANTS.MAX_TOOL_NAME_LEN);
        this.validateArrayLength(tool.tags, CONSTANTS.MAX_TOOL_TAGS, `${fieldPrefix}.tags`);
        tool.tags.forEach((tag, tagIndex) => {
            this.validateRequiredString(tag, `${fieldPrefix}.tags[${tagIndex}]`, CONSTANTS.MAX_TOOL_TAG_LEN);
        });
    }
    /**
     * Validates MCP resource definition
     */
    static validateMcpResourceDefinition(resource, index) {
        const fieldPrefix = `onchainResourceDefinitions[${index}]`;
        this.validateRequiredString(resource.uriPattern, `${fieldPrefix}.uriPattern`, CONSTANTS.MAX_RESOURCE_URI_PATTERN_LEN);
        this.validateArrayLength(resource.tags, CONSTANTS.MAX_RESOURCE_TAGS, `${fieldPrefix}.tags`);
        resource.tags.forEach((tag, tagIndex) => {
            this.validateRequiredString(tag, `${fieldPrefix}.tags[${tagIndex}]`, CONSTANTS.MAX_RESOURCE_TAG_LEN);
        });
    }
    /**
     * Validates MCP prompt definition
     */
    static validateMcpPromptDefinition(prompt, index) {
        const fieldPrefix = `onchainPromptDefinitions[${index}]`;
        this.validateRequiredString(prompt.name, `${fieldPrefix}.name`, CONSTANTS.MAX_PROMPT_NAME_LEN);
        this.validateArrayLength(prompt.tags, CONSTANTS.MAX_PROMPT_TAGS, `${fieldPrefix}.tags`);
        prompt.tags.forEach((tag, tagIndex) => {
            this.validateRequiredString(tag, `${fieldPrefix}.tags[${tagIndex}]`, CONSTANTS.MAX_PROMPT_TAG_LEN);
        });
    }
    /**
     * Validates agent registration data
     */
    static validateAgentRegistrationData(data) {
        // Basic required fields
        this.validateAgentId(data.agentId);
        this.validateRequiredString(data.name, 'name', CONSTANTS.MAX_AGENT_NAME_LEN);
        this.validateRequiredString(data.description, 'description', CONSTANTS.MAX_AGENT_DESCRIPTION_LEN);
        this.validateRequiredString(data.version, 'version', CONSTANTS.MAX_AGENT_VERSION_LEN);
        this.validateRequiredString(data.providerName, 'providerName', CONSTANTS.MAX_PROVIDER_NAME_LEN);
        this.validateRequiredString(data.providerUrl, 'providerUrl', CONSTANTS.MAX_PROVIDER_URL_LEN);
        // Validate provider URL format
        this.validateUrl(data.providerUrl, 'providerUrl');
        // Optional fields
        this.validateOptionalString(data.documentationUrl, 'documentationUrl', CONSTANTS.MAX_DOCUMENTATION_URL_LEN);
        if (data.documentationUrl) {
            this.validateUrl(data.documentationUrl, 'documentationUrl');
        }
        this.validateOptionalString(data.securityInfoUri, 'securityInfoUri', CONSTANTS.MAX_SECURITY_INFO_URI_LEN);
        if (data.securityInfoUri) {
            this.validateUrl(data.securityInfoUri, 'securityInfoUri', [
                'http:',
                'https:',
                'ipfs:',
                'ar:',
            ]);
        }
        this.validateOptionalString(data.aeaAddress, 'aeaAddress', CONSTANTS.MAX_AEA_ADDRESS_LEN);
        this.validateOptionalString(data.economicIntent, 'economicIntent', CONSTANTS.MAX_ECONOMIC_INTENT_LEN);
        this.validateOptionalString(data.extendedMetadataUri, 'extendedMetadataUri', CONSTANTS.MAX_EXTENDED_METADATA_URI_LEN);
        if (data.extendedMetadataUri) {
            this.validateUrl(data.extendedMetadataUri, 'extendedMetadataUri', [
                'http:',
                'https:',
                'ipfs:',
                'ar:',
            ]);
        }
        // Arrays
        this.validateArrayLength(data.serviceEndpoints, CONSTANTS.MAX_SERVICE_ENDPOINTS, 'serviceEndpoints');
        data.serviceEndpoints.forEach((endpoint, index) => {
            this.validateServiceEndpoint(endpoint, index);
        });
        this.validateArrayLength(data.supportedModes, CONSTANTS.MAX_SUPPORTED_MODES, 'supportedModes');
        data.supportedModes.forEach((mode, index) => {
            this.validateRequiredString(mode, `supportedModes[${index}]`, CONSTANTS.MAX_MODE_LEN);
        });
        this.validateArrayLength(data.skills, CONSTANTS.MAX_SKILLS, 'skills');
        data.skills.forEach((skill, index) => {
            this.validateAgentSkill(skill, index);
        });
        this.validateArrayLength(data.tags, CONSTANTS.MAX_AGENT_TAGS, 'tags');
        data.tags.forEach((tag, index) => {
            this.validateRequiredString(tag, `tags[${index}]`, CONSTANTS.MAX_AGENT_TAG_LEN);
        });
    }
    /**
     * Validates agent update data
     */
    static validateAgentUpdateData(data) {
        // Validate only the fields that are provided
        if (data.name !== undefined) {
            this.validateRequiredString(data.name, 'name', CONSTANTS.MAX_AGENT_NAME_LEN);
        }
        if (data.description !== undefined) {
            this.validateRequiredString(data.description, 'description', CONSTANTS.MAX_AGENT_DESCRIPTION_LEN);
        }
        if (data.version !== undefined) {
            this.validateRequiredString(data.version, 'version', CONSTANTS.MAX_AGENT_VERSION_LEN);
        }
        if (data.providerName !== undefined) {
            this.validateRequiredString(data.providerName, 'providerName', CONSTANTS.MAX_PROVIDER_NAME_LEN);
        }
        if (data.providerUrl !== undefined) {
            this.validateRequiredString(data.providerUrl, 'providerUrl', CONSTANTS.MAX_PROVIDER_URL_LEN);
            this.validateUrl(data.providerUrl, 'providerUrl');
        }
        if (data.documentationUrl !== undefined) {
            this.validateOptionalString(data.documentationUrl, 'documentationUrl', CONSTANTS.MAX_DOCUMENTATION_URL_LEN);
            if (data.documentationUrl) {
                this.validateUrl(data.documentationUrl, 'documentationUrl');
            }
        }
        if (data.securityInfoUri !== undefined) {
            this.validateOptionalString(data.securityInfoUri, 'securityInfoUri', CONSTANTS.MAX_SECURITY_INFO_URI_LEN);
            if (data.securityInfoUri) {
                this.validateUrl(data.securityInfoUri, 'securityInfoUri', [
                    'http:',
                    'https:',
                    'ipfs:',
                    'ar:',
                ]);
            }
        }
        if (data.aeaAddress !== undefined) {
            this.validateOptionalString(data.aeaAddress, 'aeaAddress', CONSTANTS.MAX_AEA_ADDRESS_LEN);
        }
        if (data.economicIntent !== undefined) {
            this.validateOptionalString(data.economicIntent, 'economicIntent', CONSTANTS.MAX_ECONOMIC_INTENT_LEN);
        }
        if (data.extendedMetadataUri !== undefined) {
            this.validateOptionalString(data.extendedMetadataUri, 'extendedMetadataUri', CONSTANTS.MAX_EXTENDED_METADATA_URI_LEN);
            if (data.extendedMetadataUri) {
                this.validateUrl(data.extendedMetadataUri, 'extendedMetadataUri', [
                    'http:',
                    'https:',
                    'ipfs:',
                    'ar:',
                ]);
            }
        }
        if (data.serviceEndpoints !== undefined) {
            this.validateArrayLength(data.serviceEndpoints, CONSTANTS.MAX_SERVICE_ENDPOINTS, 'serviceEndpoints');
            data.serviceEndpoints.forEach((endpoint, index) => {
                this.validateServiceEndpoint(endpoint, index);
            });
        }
        if (data.supportedModes !== undefined) {
            this.validateArrayLength(data.supportedModes, CONSTANTS.MAX_SUPPORTED_MODES, 'supportedModes');
            data.supportedModes.forEach((mode, index) => {
                this.validateRequiredString(mode, `supportedModes[${index}]`, CONSTANTS.MAX_MODE_LEN);
            });
        }
        if (data.skills !== undefined) {
            this.validateArrayLength(data.skills, CONSTANTS.MAX_SKILLS, 'skills');
            data.skills.forEach((skill, index) => {
                this.validateAgentSkill(skill, index);
            });
        }
        if (data.tags !== undefined) {
            this.validateArrayLength(data.tags, CONSTANTS.MAX_AGENT_TAGS, 'tags');
            data.tags.forEach((tag, index) => {
                this.validateRequiredString(tag, `tags[${index}]`, CONSTANTS.MAX_AGENT_TAG_LEN);
            });
        }
    }
    /**
     * Validates MCP server registration data
     */
    static validateMcpServerRegistrationData(data) {
        // Basic required fields
        this.validateServerId(data.serverId);
        this.validateRequiredString(data.name, 'name', CONSTANTS.MAX_SERVER_NAME_LEN);
        this.validateRequiredString(data.version, 'version', CONSTANTS.MAX_SERVER_VERSION_LEN);
        this.validateRequiredString(data.endpointUrl, 'endpointUrl', CONSTANTS.MAX_SERVER_ENDPOINT_URL_LEN);
        this.validateRequiredString(data.capabilitiesSummary, 'capabilitiesSummary', CONSTANTS.MAX_SERVER_CAPABILITIES_SUMMARY_LEN);
        // Validate endpoint URL format
        this.validateUrl(data.endpointUrl, 'endpointUrl');
        // Optional fields
        this.validateOptionalString(data.fullCapabilitiesUri, 'fullCapabilitiesUri', CONSTANTS.MAX_FULL_CAPABILITIES_URI_LEN);
        if (data.fullCapabilitiesUri) {
            this.validateUrl(data.fullCapabilitiesUri, 'fullCapabilitiesUri', [
                'http:',
                'https:',
                'ipfs:',
                'ar:',
            ]);
        }
        this.validateOptionalString(data.documentationUrl, 'documentationUrl', CONSTANTS.MAX_DOCUMENTATION_URL_LEN);
        if (data.documentationUrl) {
            this.validateUrl(data.documentationUrl, 'documentationUrl');
        }
        // Arrays
        this.validateArrayLength(data.onchainToolDefinitions, CONSTANTS.MAX_ONCHAIN_TOOL_DEFINITIONS, 'onchainToolDefinitions');
        data.onchainToolDefinitions.forEach((tool, index) => {
            this.validateMcpToolDefinition(tool, index);
        });
        this.validateArrayLength(data.onchainResourceDefinitions, CONSTANTS.MAX_ONCHAIN_RESOURCE_DEFINITIONS, 'onchainResourceDefinitions');
        data.onchainResourceDefinitions.forEach((resource, index) => {
            this.validateMcpResourceDefinition(resource, index);
        });
        this.validateArrayLength(data.onchainPromptDefinitions, CONSTANTS.MAX_ONCHAIN_PROMPT_DEFINITIONS, 'onchainPromptDefinitions');
        data.onchainPromptDefinitions.forEach((prompt, index) => {
            this.validateMcpPromptDefinition(prompt, index);
        });
        this.validateArrayLength(data.tags, CONSTANTS.MAX_SERVER_TAGS, 'tags');
        data.tags.forEach((tag, index) => {
            this.validateRequiredString(tag, `tags[${index}]`, CONSTANTS.MAX_SERVER_TAG_LEN);
        });
    }
    /**
     * Validates MCP server update data
     */
    static validateMcpServerUpdateData(data) {
        // Validate only the fields that are provided
        if (data.name !== undefined) {
            this.validateRequiredString(data.name, 'name', CONSTANTS.MAX_SERVER_NAME_LEN);
        }
        if (data.version !== undefined) {
            this.validateRequiredString(data.version, 'version', CONSTANTS.MAX_SERVER_VERSION_LEN);
        }
        if (data.endpointUrl !== undefined) {
            this.validateRequiredString(data.endpointUrl, 'endpointUrl', CONSTANTS.MAX_SERVER_ENDPOINT_URL_LEN);
            this.validateUrl(data.endpointUrl, 'endpointUrl');
        }
        if (data.capabilitiesSummary !== undefined) {
            this.validateRequiredString(data.capabilitiesSummary, 'capabilitiesSummary', CONSTANTS.MAX_SERVER_CAPABILITIES_SUMMARY_LEN);
        }
        if (data.fullCapabilitiesUri !== undefined) {
            this.validateOptionalString(data.fullCapabilitiesUri, 'fullCapabilitiesUri', CONSTANTS.MAX_FULL_CAPABILITIES_URI_LEN);
            if (data.fullCapabilitiesUri) {
                this.validateUrl(data.fullCapabilitiesUri, 'fullCapabilitiesUri', [
                    'http:',
                    'https:',
                    'ipfs:',
                    'ar:',
                ]);
            }
        }
        if (data.documentationUrl !== undefined) {
            this.validateOptionalString(data.documentationUrl, 'documentationUrl', CONSTANTS.MAX_DOCUMENTATION_URL_LEN);
            if (data.documentationUrl) {
                this.validateUrl(data.documentationUrl, 'documentationUrl');
            }
        }
        if (data.onchainToolDefinitions !== undefined) {
            this.validateArrayLength(data.onchainToolDefinitions, CONSTANTS.MAX_ONCHAIN_TOOL_DEFINITIONS, 'onchainToolDefinitions');
            data.onchainToolDefinitions.forEach((tool, index) => {
                this.validateMcpToolDefinition(tool, index);
            });
        }
        if (data.onchainResourceDefinitions !== undefined) {
            this.validateArrayLength(data.onchainResourceDefinitions, CONSTANTS.MAX_ONCHAIN_RESOURCE_DEFINITIONS, 'onchainResourceDefinitions');
            data.onchainResourceDefinitions.forEach((resource, index) => {
                this.validateMcpResourceDefinition(resource, index);
            });
        }
        if (data.onchainPromptDefinitions !== undefined) {
            this.validateArrayLength(data.onchainPromptDefinitions, CONSTANTS.MAX_ONCHAIN_PROMPT_DEFINITIONS, 'onchainPromptDefinitions');
            data.onchainPromptDefinitions.forEach((prompt, index) => {
                this.validateMcpPromptDefinition(prompt, index);
            });
        }
        if (data.tags !== undefined) {
            this.validateArrayLength(data.tags, CONSTANTS.MAX_SERVER_TAGS, 'tags');
            data.tags.forEach((tag, index) => {
                this.validateRequiredString(tag, `tags[${index}]`, CONSTANTS.MAX_SERVER_TAG_LEN);
            });
        }
    }
}

/**
 * Agent Registry API for managing autonomous agents
 */
class AgentAPI {
    client;
    constructor(client) {
        this.client = client;
    }
    /**
     * Register a new agent
     */
    async registerAgent(data, stakingTier) {
        // Validate input data
        Validator.validateAgentRegistrationData(data);
        try {
            const program = this.client.getAgentRegistryProgram();
            const provider = this.client.getProvider();
            // Derive PDA for agent account
            const [agentPda] = PublicKey.findProgramAddressSync([
                Buffer.from(CONSTANTS.AGENT_REGISTRY_PDA_SEED),
                Buffer.from(data.agentId),
                provider.wallet.publicKey.toBuffer(),
            ], program.programId);
            // Check if agent already exists
            if (await this.client.accountExists(agentPda)) {
                throw new RegistryError(`Agent with ID '${data.agentId}' already exists`);
            }
            // Calculate registration fee
            const registrationFee = CONSTANTS.AGENT_REGISTRATION_FEE;
            // Calculate staking amount if tier is specified
            let stakingAmount = 0n;
            if (stakingTier) {
                stakingAmount = this.getStakingAmountForTier(stakingTier);
            }
            // Build transaction
            const transaction = new Transaction();
            // Add agent registration instruction
            if (!program.methods) {
                throw new ValidationError('Program methods not available');
            }
            const registerInstruction = await program.methods
                .registerAgent({
                agentId: data.agentId,
                name: data.name,
                description: data.description,
                version: data.version,
                providerName: data.providerName,
                providerUrl: data.providerUrl,
                documentationUrl: data.documentationUrl,
                serviceEndpoints: data.serviceEndpoints,
                supportedModes: data.supportedModes,
                skills: data.skills,
                securityInfoUri: data.securityInfoUri,
                aeaAddress: data.aeaAddress,
                economicIntent: data.economicIntent,
                extendedMetadataUri: data.extendedMetadataUri,
                tags: data.tags,
            })
                .accounts({
                agentAccount: agentPda,
                owner: provider.wallet.publicKey,
                systemProgram: PublicKey.default, // SystemProgram.programId
            })
                .instruction();
            transaction.add(registerInstruction);
            // Add staking instruction if required
            if (stakingAmount > 0n) {
                const stakingInstruction = await this.createStakingInstruction(agentPda, stakingAmount, stakingTier);
                transaction.add(stakingInstruction);
            }
            return await this.client.sendAndConfirmTransaction(transaction);
        }
        catch (error) {
            throw new RegistryError(`Failed to register agent: ${error instanceof Error ? error.message : 'Unknown error'}`, undefined, undefined, error instanceof Error ? error : undefined);
        }
    }
    /**
     * Update an existing agent
     */
    async updateAgent(agentId, data) {
        // Validate inputs
        Validator.validateAgentId(agentId);
        Validator.validateAgentUpdateData(data);
        try {
            const program = this.client.getAgentRegistryProgram();
            const provider = this.client.getProvider();
            // Derive PDA for agent account
            const [agentPda] = PublicKey.findProgramAddressSync([
                Buffer.from(CONSTANTS.AGENT_REGISTRY_PDA_SEED),
                Buffer.from(agentId),
                provider.wallet.publicKey.toBuffer(),
            ], program.programId);
            // Check if agent exists
            if (!(await this.client.accountExists(agentPda))) {
                throw new RegistryError(`Agent with ID '${agentId}' not found`);
            }
            // Get current agent data for version checking
            const currentAgent = await this.getAgent(agentId);
            // Build update instruction
            if (!program.methods) {
                throw new ValidationError('Program methods not available');
            }
            const updateInstruction = await program.methods
                .updateAgent({
                name: data.name,
                description: data.description,
                version: data.version,
                providerName: data.providerName,
                providerUrl: data.providerUrl,
                documentationUrl: data.documentationUrl,
                serviceEndpoints: data.serviceEndpoints,
                supportedModes: data.supportedModes,
                skills: data.skills,
                securityInfoUri: data.securityInfoUri,
                aeaAddress: data.aeaAddress,
                economicIntent: data.economicIntent,
                extendedMetadataUri: data.extendedMetadataUri,
                tags: data.tags,
                expectedStateVersion: currentAgent.stateVersion,
            })
                .accounts({
                agentAccount: agentPda,
                owner: provider.wallet.publicKey,
            })
                .instruction();
            const transaction = new Transaction().add(updateInstruction);
            return await this.client.sendAndConfirmTransaction(transaction);
        }
        catch (error) {
            throw new RegistryError(`Failed to update agent: ${error instanceof Error ? error.message : 'Unknown error'}`, undefined, undefined, error instanceof Error ? error : undefined);
        }
    }
    /**
     * Deregister an agent
     */
    async deregisterAgent(agentId) {
        Validator.validateAgentId(agentId);
        try {
            const program = this.client.getAgentRegistryProgram();
            const provider = this.client.getProvider();
            // Derive PDA for agent account
            const [agentPda] = PublicKey.findProgramAddressSync([
                Buffer.from(CONSTANTS.AGENT_REGISTRY_PDA_SEED),
                Buffer.from(agentId),
                provider.wallet.publicKey.toBuffer(),
            ], program.programId);
            // Check if agent exists
            if (!(await this.client.accountExists(agentPda))) {
                throw new RegistryError(`Agent with ID '${agentId}' not found`);
            }
            const deregisterInstruction = await program.methods
                .deregisterAgent()
                .accounts({
                agentAccount: agentPda,
                owner: provider.wallet.publicKey,
            })
                .instruction();
            const transaction = new Transaction().add(deregisterInstruction);
            return await this.client.sendAndConfirmTransaction(transaction);
        }
        catch (error) {
            throw new RegistryError(`Failed to deregister agent: ${error instanceof Error ? error.message : 'Unknown error'}`, undefined, undefined, error instanceof Error ? error : undefined);
        }
    }
    /**
     * Get agent by ID
     */
    async getAgent(agentId) {
        Validator.validateAgentId(agentId);
        try {
            const program = this.client.getAgentRegistryProgram();
            const provider = this.client.getProvider();
            // Derive PDA for agent account
            const [agentPda] = PublicKey.findProgramAddressSync([
                Buffer.from(CONSTANTS.AGENT_REGISTRY_PDA_SEED),
                Buffer.from(agentId),
                provider.wallet.publicKey.toBuffer(),
            ], program.programId);
            const account = await program.account.agentRegistryEntryV1.fetch(agentPda);
            return this.parseAgentAccount(account, agentPda);
        }
        catch (error) {
            throw new AccountError(`Failed to get agent '${agentId}': ${error instanceof Error ? error.message : 'Agent not found'}`, error instanceof Error ? error : undefined);
        }
    }
    /**
     * List agents by owner
     */
    async listAgentsByOwner(owner) {
        try {
            const program = this.client.getAgentRegistryProgram();
            const provider = this.client.getProvider();
            const targetOwner = owner || provider.wallet.publicKey;
            const accounts = await program.account.agentRegistryEntryV1.all([
                {
                    memcmp: {
                        offset: 8 + 32, // discriminator + agentId offset
                        bytes: targetOwner.toBase58(),
                    },
                },
            ]);
            return accounts.map(account => ({
                publicKey: account.publicKey,
                account: this.parseAgentAccount(account.account, account.publicKey),
            }));
        }
        catch (error) {
            throw new AccountError(`Failed to list agents: ${error instanceof Error ? error.message : 'Unknown error'}`, error instanceof Error ? error : undefined);
        }
    }
    /**
     * List agents by status
     */
    async listAgentsByStatus(status) {
        try {
            const program = this.client.getAgentRegistryProgram();
            const accounts = await program.account.agentRegistryEntryV1.all([
                {
                    memcmp: {
                        offset: 8 + 64 + 128 + 512 + 32, // approximate offset to status field
                        bytes: Buffer.from([status]).toString('base64'),
                    },
                },
            ]);
            return accounts.map(account => ({
                publicKey: account.publicKey,
                account: this.parseAgentAccount(account.account, account.publicKey),
            }));
        }
        catch (error) {
            throw new AccountError(`Failed to list agents by status: ${error instanceof Error ? error.message : 'Unknown error'}`, error instanceof Error ? error : undefined);
        }
    }
    /**
     * Search agents by tags
     */
    async searchAgentsByTags(tags) {
        try {
            const program = this.client.getAgentRegistryProgram();
            // Get all agents (in a real implementation, this would be more efficient)
            const allAgents = await program.account.agentRegistryEntryV1.all();
            // Filter by tags
            const filteredAgents = allAgents.filter(account => {
                const agent = this.parseAgentAccount(account.account, account.publicKey);
                return tags.some(tag => agent.tags.includes(tag));
            });
            return filteredAgents.map(account => ({
                publicKey: account.publicKey,
                account: this.parseAgentAccount(account.account, account.publicKey),
            }));
        }
        catch (error) {
            throw new AccountError(`Failed to search agents by tags: ${error instanceof Error ? error.message : 'Unknown error'}`, error instanceof Error ? error : undefined);
        }
    }
    /**
     * Stake tokens for an agent
     */
    async stakeForAgent(agentId, amount, tier) {
        Validator.validateAgentId(agentId);
        if (amount < this.getMinStakeForTier(tier)) {
            throw new ValidationError(`Stake amount too low for ${tier} tier`, 'amount');
        }
        try {
            const stakingInstruction = await this.createStakingInstruction(await this.getAgentPda(agentId), amount, tier);
            const transaction = new Transaction().add(stakingInstruction);
            return await this.client.sendAndConfirmTransaction(transaction);
        }
        catch (error) {
            throw new RegistryError(`Failed to stake for agent: ${error instanceof Error ? error.message : 'Unknown error'}`, undefined, undefined, error instanceof Error ? error : undefined);
        }
    }
    /**
     * Get staking information for an agent
     */
    async getStakingInfo(agentId) {
        try {
            // This would fetch from a staking account associated with the agent
            // Implementation depends on the actual program structure
            const agentPda = await this.getAgentPda(agentId);
            // Derive staking PDA
            const program = this.client.getAgentRegistryProgram();
            const [stakingPda] = PublicKey.findProgramAddressSync([
                Buffer.from(CONSTANTS.STAKING_VAULT_SEED),
                agentPda.toBuffer(),
            ], program.programId);
            // Check if staking account exists
            if (!(await this.client.accountExists(stakingPda))) {
                return null;
            }
            // This would be replaced with actual staking account parsing
            return {
                amount: 0n, // placeholder
                tier: AgentTier.Bronze, // placeholder
                lockPeriod: 0, // placeholder
                lockEndSlot: 0n, // placeholder
            };
        }
        catch (error) {
            return null;
        }
    }
    /**
     * Get agent PDA
     */
    async getAgentPda(agentId) {
        const program = this.client.getAgentRegistryProgram();
        const provider = this.client.getProvider();
        const [agentPda] = PublicKey.findProgramAddressSync([
            Buffer.from(CONSTANTS.AGENT_REGISTRY_PDA_SEED),
            Buffer.from(agentId),
            provider.wallet.publicKey.toBuffer(),
        ], program.programId);
        return agentPda;
    }
    /**
     * Parse agent account data
     */
    parseAgentAccount(account, publicKey) {
        // This would parse the actual account data structure
        // For now, return a mock structure
        return {
            agentId: account.agentId || 'unknown',
            name: account.name || 'Unknown Agent',
            description: account.description || '',
            version: account.version || '1.0.0',
            status: account.status || AgentStatus.Pending,
            owner: account.owner || PublicKey.default,
            registrationSlot: BigInt(account.registrationSlot || 0),
            lastUpdateSlot: BigInt(account.lastUpdateSlot || 0),
            providerName: account.providerName || '',
            providerUrl: account.providerUrl || '',
            documentationUrl: account.documentationUrl,
            serviceEndpoints: account.serviceEndpoints || [],
            supportedModes: account.supportedModes || [],
            skills: account.skills || [],
            securityInfoUri: account.securityInfoUri,
            aeaAddress: account.aeaAddress,
            economicIntent: account.economicIntent,
            extendedMetadataUri: account.extendedMetadataUri,
            tags: account.tags || [],
            stateVersion: BigInt(account.stateVersion || 0),
        };
    }
    /**
     * Create staking instruction
     */
    async createStakingInstruction(agentPda, amount, tier) {
        // This would create the actual staking instruction
        // Implementation depends on the program structure
        throw new Error('Staking instruction creation not implemented');
    }
    /**
     * Get staking amount for tier
     */
    getStakingAmountForTier(tier) {
        switch (tier) {
            case AgentTier.Bronze:
                return CONSTANTS.BRONZE_TIER_STAKE;
            case AgentTier.Silver:
                return CONSTANTS.SILVER_TIER_STAKE;
            case AgentTier.Gold:
                return CONSTANTS.GOLD_TIER_STAKE;
            case AgentTier.Platinum:
                return CONSTANTS.PLATINUM_TIER_STAKE;
            default:
                throw new ValidationError(`Invalid tier: ${tier}`, 'tier');
        }
    }
    /**
     * Get minimum stake for tier
     */
    getMinStakeForTier(tier) {
        return this.getStakingAmountForTier(tier);
    }
}

/**
 * MCP Server Registry API for managing Model Context Protocol servers
 */
class McpAPI {
    client;
    constructor(client) {
        this.client = client;
    }
    /**
     * Register a new MCP server
     */
    async registerServer(data) {
        // Validate input data
        Validator.validateMcpServerRegistrationData(data);
        try {
            const program = this.client.getMcpRegistryProgram();
            const provider = this.client.getProvider();
            // Derive PDA for server account
            const [serverPda] = PublicKey.findProgramAddressSync([
                Buffer.from(CONSTANTS.MCP_SERVER_REGISTRY_PDA_SEED),
                Buffer.from(data.serverId),
                provider.wallet.publicKey.toBuffer(),
            ], program.programId);
            // Check if server already exists
            if (await this.client.accountExists(serverPda)) {
                throw new RegistryError(`MCP server with ID '${data.serverId}' already exists`);
            }
            // Calculate registration fee
            const registrationFee = CONSTANTS.MCP_REGISTRATION_FEE;
            // Build registration instruction
            const registerInstruction = await program.methods
                .registerServer({
                serverId: data.serverId,
                name: data.name,
                version: data.version,
                endpointUrl: data.endpointUrl,
                capabilitiesSummary: data.capabilitiesSummary,
                onchainToolDefinitions: data.onchainToolDefinitions,
                onchainResourceDefinitions: data.onchainResourceDefinitions,
                onchainPromptDefinitions: data.onchainPromptDefinitions,
                fullCapabilitiesUri: data.fullCapabilitiesUri,
                documentationUrl: data.documentationUrl,
                tags: data.tags,
            })
                .accounts({
                serverAccount: serverPda,
                owner: provider.wallet.publicKey,
                systemProgram: PublicKey.default, // SystemProgram.programId
            })
                .instruction();
            const transaction = new Transaction().add(registerInstruction);
            return await this.client.sendAndConfirmTransaction(transaction);
        }
        catch (error) {
            throw new RegistryError(`Failed to register MCP server: ${error instanceof Error ? error.message : 'Unknown error'}`, undefined, undefined, error instanceof Error ? error : undefined);
        }
    }
    /**
     * Update an existing MCP server
     */
    async updateServer(serverId, data) {
        // Validate inputs
        Validator.validateServerId(serverId);
        Validator.validateMcpServerUpdateData(data);
        try {
            const program = this.client.getMcpRegistryProgram();
            const provider = this.client.getProvider();
            // Derive PDA for server account
            const [serverPda] = PublicKey.findProgramAddressSync([
                Buffer.from(CONSTANTS.MCP_SERVER_REGISTRY_PDA_SEED),
                Buffer.from(serverId),
                provider.wallet.publicKey.toBuffer(),
            ], program.programId);
            // Check if server exists
            if (!(await this.client.accountExists(serverPda))) {
                throw new RegistryError(`MCP server with ID '${serverId}' not found`);
            }
            // Get current server data for version checking
            const currentServer = await this.getServer(serverId);
            // Build update instruction
            const updateInstruction = await program.methods
                .updateServer({
                name: data.name,
                version: data.version,
                endpointUrl: data.endpointUrl,
                capabilitiesSummary: data.capabilitiesSummary,
                onchainToolDefinitions: data.onchainToolDefinitions,
                onchainResourceDefinitions: data.onchainResourceDefinitions,
                onchainPromptDefinitions: data.onchainPromptDefinitions,
                fullCapabilitiesUri: data.fullCapabilitiesUri,
                documentationUrl: data.documentationUrl,
                tags: data.tags,
                expectedStateVersion: currentServer.stateVersion,
            })
                .accounts({
                serverAccount: serverPda,
                owner: provider.wallet.publicKey,
            })
                .instruction();
            const transaction = new Transaction().add(updateInstruction);
            return await this.client.sendAndConfirmTransaction(transaction);
        }
        catch (error) {
            throw new RegistryError(`Failed to update MCP server: ${error instanceof Error ? error.message : 'Unknown error'}`, undefined, undefined, error instanceof Error ? error : undefined);
        }
    }
    /**
     * Deregister an MCP server
     */
    async deregisterServer(serverId) {
        Validator.validateServerId(serverId);
        try {
            const program = this.client.getMcpRegistryProgram();
            const provider = this.client.getProvider();
            // Derive PDA for server account
            const [serverPda] = PublicKey.findProgramAddressSync([
                Buffer.from(CONSTANTS.MCP_SERVER_REGISTRY_PDA_SEED),
                Buffer.from(serverId),
                provider.wallet.publicKey.toBuffer(),
            ], program.programId);
            // Check if server exists
            if (!(await this.client.accountExists(serverPda))) {
                throw new RegistryError(`MCP server with ID '${serverId}' not found`);
            }
            const deregisterInstruction = await program.methods
                .deregisterServer()
                .accounts({
                serverAccount: serverPda,
                owner: provider.wallet.publicKey,
            })
                .instruction();
            const transaction = new Transaction().add(deregisterInstruction);
            return await this.client.sendAndConfirmTransaction(transaction);
        }
        catch (error) {
            throw new RegistryError(`Failed to deregister MCP server: ${error instanceof Error ? error.message : 'Unknown error'}`, undefined, undefined, error instanceof Error ? error : undefined);
        }
    }
    /**
     * Get MCP server by ID
     */
    async getServer(serverId) {
        Validator.validateServerId(serverId);
        try {
            const program = this.client.getMcpRegistryProgram();
            const provider = this.client.getProvider();
            // Derive PDA for server account
            const [serverPda] = PublicKey.findProgramAddressSync([
                Buffer.from(CONSTANTS.MCP_SERVER_REGISTRY_PDA_SEED),
                Buffer.from(serverId),
                provider.wallet.publicKey.toBuffer(),
            ], program.programId);
            const account = await program.account.mcpServerRegistryEntryV1.fetch(serverPda);
            return this.parseServerAccount(account, serverPda);
        }
        catch (error) {
            throw new AccountError(`Failed to get MCP server '${serverId}': ${error instanceof Error ? error.message : 'Server not found'}`, error instanceof Error ? error : undefined);
        }
    }
    /**
     * List MCP servers by owner
     */
    async listServersByOwner(owner) {
        try {
            const program = this.client.getMcpRegistryProgram();
            const provider = this.client.getProvider();
            const targetOwner = owner || provider.wallet.publicKey;
            const accounts = await program.account.mcpServerRegistryEntryV1.all([
                {
                    memcmp: {
                        offset: 8 + 32, // discriminator + serverId offset
                        bytes: targetOwner.toBase58(),
                    },
                },
            ]);
            return accounts.map(account => ({
                publicKey: account.publicKey,
                account: this.parseServerAccount(account.account, account.publicKey),
            }));
        }
        catch (error) {
            throw new AccountError(`Failed to list MCP servers: ${error instanceof Error ? error.message : 'Unknown error'}`, error instanceof Error ? error : undefined);
        }
    }
    /**
     * List MCP servers by status
     */
    async listServersByStatus(status) {
        try {
            const program = this.client.getMcpRegistryProgram();
            const accounts = await program.account.mcpServerRegistryEntryV1.all([
                {
                    memcmp: {
                        offset: 8 + 64 + 128 + 32, // approximate offset to status field
                        bytes: Buffer.from([status]).toString('base64'),
                    },
                },
            ]);
            return accounts.map(account => ({
                publicKey: account.publicKey,
                account: this.parseServerAccount(account.account, account.publicKey),
            }));
        }
        catch (error) {
            throw new AccountError(`Failed to list MCP servers by status: ${error instanceof Error ? error.message : 'Unknown error'}`, error instanceof Error ? error : undefined);
        }
    }
    /**
     * Search MCP servers by capabilities
     */
    async searchServersByCapabilities(keywords) {
        try {
            const program = this.client.getMcpRegistryProgram();
            // Get all servers (in a real implementation, this would be more efficient)
            const allServers = await program.account.mcpServerRegistryEntryV1.all();
            // Filter by capabilities keywords
            const filteredServers = allServers.filter(account => {
                const server = this.parseServerAccount(account.account, account.publicKey);
                const searchText = `${server.capabilitiesSummary} ${server.tags.join(' ')}`.toLowerCase();
                return keywords.some(keyword => searchText.includes(keyword.toLowerCase()));
            });
            return filteredServers.map(account => ({
                publicKey: account.publicKey,
                account: this.parseServerAccount(account.account, account.publicKey),
            }));
        }
        catch (error) {
            throw new AccountError(`Failed to search MCP servers by capabilities: ${error instanceof Error ? error.message : 'Unknown error'}`, error instanceof Error ? error : undefined);
        }
    }
    /**
     * Search MCP servers by tags
     */
    async searchServersByTags(tags) {
        try {
            const program = this.client.getMcpRegistryProgram();
            // Get all servers (in a real implementation, this would be more efficient)
            const allServers = await program.account.mcpServerRegistryEntryV1.all();
            // Filter by tags
            const filteredServers = allServers.filter(account => {
                const server = this.parseServerAccount(account.account, account.publicKey);
                return tags.some(tag => server.tags.includes(tag));
            });
            return filteredServers.map(account => ({
                publicKey: account.publicKey,
                account: this.parseServerAccount(account.account, account.publicKey),
            }));
        }
        catch (error) {
            throw new AccountError(`Failed to search MCP servers by tags: ${error instanceof Error ? error.message : 'Unknown error'}`, error instanceof Error ? error : undefined);
        }
    }
    /**
     * Get servers that provide specific tools
     */
    async getServersByTool(toolName) {
        try {
            const program = this.client.getMcpRegistryProgram();
            // Get all servers
            const allServers = await program.account.mcpServerRegistryEntryV1.all();
            // Filter by tool definitions
            const filteredServers = allServers.filter(account => {
                const server = this.parseServerAccount(account.account, account.publicKey);
                return server.onchainToolDefinitions.some(tool => tool.name.toLowerCase().includes(toolName.toLowerCase()));
            });
            return filteredServers.map(account => ({
                publicKey: account.publicKey,
                account: this.parseServerAccount(account.account, account.publicKey),
            }));
        }
        catch (error) {
            throw new AccountError(`Failed to get servers by tool: ${error instanceof Error ? error.message : 'Unknown error'}`, error instanceof Error ? error : undefined);
        }
    }
    /**
     * Get servers that provide specific resources
     */
    async getServersByResource(resourcePattern) {
        try {
            const program = this.client.getMcpRegistryProgram();
            // Get all servers
            const allServers = await program.account.mcpServerRegistryEntryV1.all();
            // Filter by resource definitions
            const filteredServers = allServers.filter(account => {
                const server = this.parseServerAccount(account.account, account.publicKey);
                return server.onchainResourceDefinitions.some(resource => resource.uriPattern.toLowerCase().includes(resourcePattern.toLowerCase()));
            });
            return filteredServers.map(account => ({
                publicKey: account.publicKey,
                account: this.parseServerAccount(account.account, account.publicKey),
            }));
        }
        catch (error) {
            throw new AccountError(`Failed to get servers by resource: ${error instanceof Error ? error.message : 'Unknown error'}`, error instanceof Error ? error : undefined);
        }
    }
    /**
     * Get servers that provide specific prompts
     */
    async getServersByPrompt(promptName) {
        try {
            const program = this.client.getMcpRegistryProgram();
            // Get all servers
            const allServers = await program.account.mcpServerRegistryEntryV1.all();
            // Filter by prompt definitions
            const filteredServers = allServers.filter(account => {
                const server = this.parseServerAccount(account.account, account.publicKey);
                return server.onchainPromptDefinitions.some(prompt => prompt.name.toLowerCase().includes(promptName.toLowerCase()));
            });
            return filteredServers.map(account => ({
                publicKey: account.publicKey,
                account: this.parseServerAccount(account.account, account.publicKey),
            }));
        }
        catch (error) {
            throw new AccountError(`Failed to get servers by prompt: ${error instanceof Error ? error.message : 'Unknown error'}`, error instanceof Error ? error : undefined);
        }
    }
    /**
     * Update server status (admin function)
     */
    async updateServerStatus(serverId, status) {
        Validator.validateServerId(serverId);
        try {
            const program = this.client.getMcpRegistryProgram();
            const provider = this.client.getProvider();
            // Derive PDA for server account
            const [serverPda] = PublicKey.findProgramAddressSync([
                Buffer.from(CONSTANTS.MCP_SERVER_REGISTRY_PDA_SEED),
                Buffer.from(serverId),
                provider.wallet.publicKey.toBuffer(),
            ], program.programId);
            const updateStatusInstruction = await program.methods
                .updateServerStatus(status)
                .accounts({
                serverAccount: serverPda,
                authority: provider.wallet.publicKey, // Assuming authority check
            })
                .instruction();
            const transaction = new Transaction().add(updateStatusInstruction);
            return await this.client.sendAndConfirmTransaction(transaction);
        }
        catch (error) {
            throw new RegistryError(`Failed to update server status: ${error instanceof Error ? error.message : 'Unknown error'}`, undefined, undefined, error instanceof Error ? error : undefined);
        }
    }
    /**
     * Get server PDA
     */
    async getServerPda(serverId) {
        const program = this.client.getMcpRegistryProgram();
        const provider = this.client.getProvider();
        const [serverPda] = PublicKey.findProgramAddressSync([
            Buffer.from(CONSTANTS.MCP_SERVER_REGISTRY_PDA_SEED),
            Buffer.from(serverId),
            provider.wallet.publicKey.toBuffer(),
        ], program.programId);
        return serverPda;
    }
    /**
     * Parse server account data
     */
    parseServerAccount(account, publicKey) {
        // This would parse the actual account data structure
        // For now, return a mock structure
        return {
            serverId: account.serverId || 'unknown',
            name: account.name || 'Unknown Server',
            version: account.version || '1.0.0',
            status: account.status || McpServerStatus.Pending,
            owner: account.owner || PublicKey.default,
            registrationSlot: BigInt(account.registrationSlot || 0),
            lastUpdateSlot: BigInt(account.lastUpdateSlot || 0),
            endpointUrl: account.endpointUrl || '',
            capabilitiesSummary: account.capabilitiesSummary || '',
            onchainToolDefinitions: account.onchainToolDefinitions || [],
            onchainResourceDefinitions: account.onchainResourceDefinitions || [],
            onchainPromptDefinitions: account.onchainPromptDefinitions || [],
            fullCapabilitiesUri: account.fullCapabilitiesUri,
            documentationUrl: account.documentationUrl,
            tags: account.tags || [],
            stateVersion: BigInt(account.stateVersion || 0),
        };
    }
}

/**
 * Handles prepayment flows for services
 */
class PrepaymentFlow {
    _client;
    constructor(_client) {
        this._client = _client;
    }
    /**
     * Create a prepayment transaction
     */
    async createPrepayment(config) {
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
            throw new PaymentError(`Failed to create prepayment transaction: ${error instanceof Error ? error.message : 'Unknown error'}`, error instanceof Error ? error : undefined);
        }
    }
    /**
     * Execute prepayment
     */
    async executePrepayment(config) {
        try {
            const transaction = await this.createPrepayment(config);
            return await this._client.sendAndConfirmTransaction(transaction);
        }
        catch (error) {
            throw new PaymentError(`Failed to execute prepayment: ${error instanceof Error ? error.message : 'Unknown error'}`, error instanceof Error ? error : undefined);
        }
    }
    /**
     * Get prepayment status
     */
    async getPrepaymentStatus(signature) {
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
        }
        catch (error) {
            throw new PaymentError(`Failed to get prepayment status: ${error instanceof Error ? error.message : 'Unknown error'}`, error instanceof Error ? error : undefined);
        }
    }
    /**
     * Estimate prepayment cost (including network fees)
     */
    async estimatePrepaymentCost(config) {
        try {
            // Create the transaction to estimate fees
            const transaction = await this.createPrepayment(config);
            // Get fee estimate
            const feeEstimate = await this._client.connection.getFeeForMessage(transaction.compileMessage(), 'confirmed');
            const networkFee = BigInt(feeEstimate.value || 5000); // Default 5000 lamports if estimation fails
            return {
                paymentAmount: config.amount,
                networkFee,
                totalCost: config.amount, // Token amount doesn't include SOL fees
            };
        }
        catch (error) {
            throw new PaymentError(`Failed to estimate prepayment cost: ${error instanceof Error ? error.message : 'Unknown error'}`, error instanceof Error ? error : undefined);
        }
    }
    /**
     * Validate prepayment configuration
     */
    validatePrepaymentConfig(config) {
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
    async validatePayerBalance(payerTokenAccount, _amount) {
        try {
            const accountInfo = await this._client.getAccountInfo(payerTokenAccount);
            if (!accountInfo) {
                throw new PaymentError('Payer token account does not exist');
            }
            // Parse token account data to get balance
            // This would require proper SPL token account parsing
            // For now, we'll assume the account exists and has sufficient balance
            // In a real implementation, you'd parse the account data properly
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

/**
 * Handles pay-as-you-go payment flows
 */
class PayAsYouGoFlow {
    _client;
    usageRecords = new Map();
    constructor(_client) {
        this._client = _client;
    }
    /**
     * Record usage for billing
     */
    recordUsage(serviceId, userId, amount, metadata) {
        const record = {
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
    getUsageRecords(serviceId, fromTimestamp) {
        const records = this.usageRecords.get(serviceId) || [];
        if (fromTimestamp) {
            return records.filter(record => record.timestamp >= fromTimestamp);
        }
        return records;
    }
    /**
     * Calculate total usage cost
     */
    calculateUsageCost(serviceId, fromTimestamp) {
        const records = this.getUsageRecords(serviceId, fromTimestamp);
        return records.reduce((total, record) => total + record.amount, 0n);
    }
    /**
     * Create payment transaction for accumulated usage
     */
    async createUsagePayment(config, serviceId, fromTimestamp) {
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
            const payerTokenAccount = await getAssociatedTokenAddress(tokenMint, payer, false, TOKEN_PROGRAM_ID);
            const recipientTokenAccount = await getAssociatedTokenAddress(tokenMint, recipient, false, TOKEN_PROGRAM_ID);
            // Check if payer token account exists and has sufficient balance
            await this.validatePayerBalance(payerTokenAccount, totalAmount);
            // Check if recipient token account exists, create if needed
            await this.ensureRecipientTokenAccount(transaction, recipient, recipientTokenAccount, tokenMint);
            // Create transfer instruction
            const transferInstruction = createTransferInstruction(payerTokenAccount, recipientTokenAccount, payer, totalAmount, [], TOKEN_PROGRAM_ID);
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
        }
        catch (error) {
            throw new PaymentError(`Failed to create usage payment transaction: ${error instanceof Error ? error.message : 'Unknown error'}`, error instanceof Error ? error : undefined);
        }
    }
    /**
     * Execute payment for accumulated usage
     */
    async executeUsagePayment(config, serviceId, fromTimestamp) {
        try {
            const { transaction, totalAmount, usageCount } = await this.createUsagePayment(config, serviceId, fromTimestamp);
            const result = await this._client.sendAndConfirmTransaction(transaction);
            // Clear paid usage records
            this.clearPaidUsage(serviceId, fromTimestamp);
            return { result, totalAmount, usageCount };
        }
        catch (error) {
            throw new PaymentError(`Failed to execute usage payment: ${error instanceof Error ? error.message : 'Unknown error'}`, error instanceof Error ? error : undefined);
        }
    }
    /**
     * Create instant payment for single use
     */
    async createInstantPayment(config) {
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
            throw new PaymentError(`Failed to create instant payment transaction: ${error instanceof Error ? error.message : 'Unknown error'}`, error instanceof Error ? error : undefined);
        }
    }
    /**
     * Execute instant payment for single use
     */
    async executeInstantPayment(config) {
        try {
            const transaction = await this.createInstantPayment(config);
            return await this._client.sendAndConfirmTransaction(transaction);
        }
        catch (error) {
            throw new PaymentError(`Failed to execute instant payment: ${error instanceof Error ? error.message : 'Unknown error'}`, error instanceof Error ? error : undefined);
        }
    }
    /**
     * Get usage summary for a service
     */
    getUsageSummary(serviceId, fromTimestamp) {
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
    clearAllUsage() {
        this.usageRecords.clear();
    }
    /**
     * Clear paid usage records
     */
    clearPaidUsage(serviceId, fromTimestamp) {
        if (!fromTimestamp) {
            this.usageRecords.delete(serviceId);
            return;
        }
        const records = this.usageRecords.get(serviceId) || [];
        const remainingRecords = records.filter(record => record.timestamp < fromTimestamp);
        if (remainingRecords.length === 0) {
            this.usageRecords.delete(serviceId);
        }
        else {
            this.usageRecords.set(serviceId, remainingRecords);
        }
    }
    /**
     * Validate pay-as-you-go configuration
     */
    validatePayAsYouGoConfig(config) {
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
    async validatePayerBalance(payerTokenAccount, _amount) {
        try {
            const accountInfo = await this._client.getAccountInfo(payerTokenAccount);
            if (!accountInfo) {
                throw new PaymentError('Payer token account does not exist');
            }
            // Parse token account data to get balance
            // This would require proper SPL token account parsing
            // For now, we'll assume the account exists and has sufficient balance
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

/**
 * Handles streaming payment flows
 */
class StreamPaymentFlow {
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

// Main SDK exports
/**
 * Main SDK class that provides access to all functionality
 */
class SolanaAIRegistriesSDK {
    client;
    agent;
    mcp;
    payments;
    constructor(config) {
        this.client = new SolanaClient(config);
        this.agent = new AgentAPI(this.client);
        this.mcp = new McpAPI(this.client);
        this.payments = {
            prepayment: new PrepaymentFlow(this.client),
            payAsYouGo: new PayAsYouGoFlow(this.client),
            stream: new StreamPaymentFlow(this.client),
        };
    }
    /**
     * Initialize the SDK with a wallet
     */
    async initialize(wallet) {
        await this.client.initialize(wallet);
    }
    /**
     * Health check for all SDK components
     */
    async healthCheck() {
        try {
            const clientHealth = await this.client.healthCheck();
            // Test agent API
            let agentHealthy = false;
            try {
                await this.agent.listAgentsByOwner();
                agentHealthy = true;
            }
            catch {
                agentHealthy = false;
            }
            // Test MCP API
            let mcpHealthy = false;
            try {
                await this.mcp.listServersByOwner();
                mcpHealthy = true;
            }
            catch {
                mcpHealthy = false;
            }
            return {
                client: clientHealth,
                agent: agentHealthy,
                mcp: mcpHealthy,
                overall: clientHealth.connected && agentHealthy && mcpHealthy,
            };
        }
        catch (error) {
            return {
                client: { connected: false, error: error instanceof Error ? error.message : 'Unknown error' },
                agent: false,
                mcp: false,
                overall: false,
            };
        }
    }
}
/**
 * Factory function to create SDK instance
 */
function createSdk(config) {
    return new SolanaAIRegistriesSDK(config);
}
/**
 * Default configuration for different networks
 */
const DEFAULT_CONFIGS = {
    mainnet: {
        cluster: 'mainnet-beta',
        commitment: 'confirmed',
    },
    devnet: {
        cluster: 'devnet',
        commitment: 'confirmed',
    },
    testnet: {
        cluster: 'testnet',
        commitment: 'confirmed',
    },
};

export { AccountError, AgentAPI, AgentStatus, AgentTier, CONSTANTS, ConfigError, DEFAULT_CONFIGS, ErrorFactory, IdlError, IdlLoader, KNOWN_IDL_HASHES, McpAPI, McpServerStatus, NetworkError, PROGRAM_IDS, PayAsYouGoFlow, PaymentError, PaymentMethod, PrepaymentFlow, ProgramError, RegistryError, SdkError, SolanaAIRegistriesSDK, SolanaClient, StreamPaymentFlow, TOKEN_MINTS, TransactionError, ValidationError, Validator, createSdk, loadIdlForNetwork, mapProgramError };
//# sourceMappingURL=index.esm.js.map
