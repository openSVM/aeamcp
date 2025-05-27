import { PublicKey, Commitment } from '@solana/web3.js';

// ============================================================================
// RPC CONFIGURATION INTERFACES
// ============================================================================

/**
 * RPC endpoint configuration for connection management
 */
export interface RPCEndpointConfig {
  /** Endpoint URL */
  url: string;
  /** Endpoint priority (lower = higher priority) */
  priority: number;
  /** Maximum connections for this endpoint */
  maxConnections: number;
  /** Request timeout in milliseconds */
  timeout: number;
  /** Maximum retry attempts */
  retryAttempts: number;
  /** Whether this endpoint supports WebSocket */
  supportsWebSocket: boolean;
  /** WebSocket endpoint URL (if different from HTTP) */
  websocketUrl?: string;
  /** Endpoint provider name for monitoring */
  provider: string;
  /** Geographic region (for latency optimization) */
  region?: string;
}

/**
 * Network-specific configuration
 */
export interface NetworkConfig {
  /** Network name */
  name: string;
  /** List of RPC endpoints for this network */
  endpoints: RPCEndpointConfig[];
  /** Default commitment level */
  commitment: Commitment;
  /** Network-specific timeout overrides */
  defaultTimeout: number;
  /** Maximum retry attempts for this network */
  maxRetries: number;
  /** Health check interval in milliseconds */
  healthCheckInterval: number;
  /** Whether this is a production network */
  isProduction: boolean;
}

// ============================================================================
// NETWORK CONFIGURATIONS
// ============================================================================

/**
 * Comprehensive RPC endpoint configurations for all Solana networks
 */
export const NETWORK_CONFIGS: Record<string, NetworkConfig> = {
  devnet: {
    name: 'devnet',
    commitment: 'confirmed',
    defaultTimeout: 30000,
    maxRetries: 3,
    healthCheckInterval: 30000,
    isProduction: false,
    endpoints: [
      {
        url: process.env.NEXT_PUBLIC_RPC_ENDPOINT || 'https://api.devnet.solana.com',
        priority: 1,
        maxConnections: 10,
        timeout: 30000,
        retryAttempts: 3,
        supportsWebSocket: true,
        provider: 'Solana Foundation',
        region: 'global'
      },
      {
        url: 'https://devnet.helius-rpc.com/?api-key=2eb1ae21-40d0-4b6d-adde-ccb3d56ad570',
        priority: 2,
        maxConnections: 8,
        timeout: 25000,
        retryAttempts: 3,
        supportsWebSocket: true,
        provider: 'dRPC',
        region: 'global'
      }
    ]
  },
  
  testnet: {
    name: 'testnet',
    commitment: 'confirmed',
    defaultTimeout: 25000,
    maxRetries: 3,
    healthCheckInterval: 30000,
    isProduction: false,
    endpoints: [
      {
        url: 'https://api.testnet.solana.com',
        priority: 1,
        maxConnections: 8,
        timeout: 25000,
        retryAttempts: 3,
        supportsWebSocket: true,
        provider: 'Solana Foundation',
        region: 'global'
      },
      {
        url: 'https://devnet.helius-rpc.com/?api-key=2eb1ae21-40d0-4b6d-adde-ccb3d56ad570',
        priority: 2,
        maxConnections: 6,
        timeout: 20000,
        retryAttempts: 3,
        supportsWebSocket: true,
        provider: 'dRPC',
        region: 'global'
      },
      {
        url: 'https://rpc.ankr.com/solana_testnet',
        priority: 3,
        maxConnections: 5,
        timeout: 20000,
        retryAttempts: 2,
        supportsWebSocket: true,
        provider: 'Ankr',
        region: 'global'
      }
    ]
  },
  
  'mainnet-beta': {
    name: 'mainnet-beta',
    commitment: 'confirmed',
    defaultTimeout: 20000,
    maxRetries: 5,
    healthCheckInterval: 15000,
    isProduction: true,
    endpoints: [
      {
        url: 'https://api.mainnet-beta.solana.com',
        priority: 3,
        maxConnections: 15,
        timeout: 20000,
        retryAttempts: 5,
        supportsWebSocket: true,
        provider: 'Solana Foundation',
        region: 'global'
      },
      {
        url: 'https://solana-mainnet.core.chainstack.com/3bf1bc5d6e5232077dbee1a6a172c4e2',
        priority: 1,
        maxConnections: 100,
        timeout: 1500,
        retryAttempts: 3,
        supportsWebSocket: true,
        provider: 'Chainstack',
        region: 'global'
      },
    ]
  }
};

// ============================================================================
// LEGACY COMPATIBILITY (Deprecated - Use NETWORK_CONFIGS instead)
// ============================================================================

/**
 * @deprecated Use getRPCConfiguration().getCurrentNetworkConfig().name instead
 */
export const SOLANA_NETWORK = process.env.NEXT_PUBLIC_SOLANA_NETWORK || 'devnet';

/**
 * @deprecated Use getRPCConfiguration().getPrimaryEndpoint().url instead
 */
export const RPC_ENDPOINT = process.env.NEXT_PUBLIC_RPC_ENDPOINT || 'https://api.devnet.solana.com';

// Program IDs (deployed program addresses)
export const AGENT_REGISTRY_PROGRAM_ID = new PublicKey(
  process.env.NEXT_PUBLIC_AGENT_PROGRAM_ID || 'BruRLHGfNaf6C5HKUqFu6md5ePJNELafm1vZdhctPkpr'
);

export const MCP_SERVER_REGISTRY_PROGRAM_ID = new PublicKey(
  process.env.NEXT_PUBLIC_MCP_PROGRAM_ID || 'BCBVehUHR3yhbDbvhV3QHS3s27k3LTbpX5CrXQ2sR2SR'
);


// PDA Seeds (must match Rust program constants)
export const AGENT_REGISTRY_PDA_SEED = 'agent_reg_v1';
export const MCP_SERVER_REGISTRY_PDA_SEED = 'mcp_srv_reg_v1';

// $SVMAI Token Configuration
export const SVMAI_TOKEN_MINT = new PublicKey('Cpzvdx6pppc9TNArsGsqgShCsKC9NCCjA2gtzHvUpump');
export const SVMAI_TOKEN_DECIMALS = 6; // Standard SPL token decimals
export const SVMAI_TOKEN_SYMBOL = 'SVMAI';
export const SVMAI_TOKEN_NAME = 'Solana Virtual Machine AI Token';

// Token Economics
export const SVMAI_TOTAL_SUPPLY = 1_000_000_000; // 1 billion tokens
export const SVMAI_MIN_STAKE_AGENT = 1_000; // Minimum stake for agent registration
export const SVMAI_MIN_STAKE_SERVER = 500; // Minimum stake for server registration
export const SVMAI_MIN_STAKING_AMOUNT = 1_000; // Minimum for staking rewards
export const SVMAI_STAKING_LOCK_PERIOD = 30; // Days
export const SVMAI_ANNUAL_YIELD_MIN = 8; // Percentage
export const SVMAI_ANNUAL_YIELD_MAX = 12; // Percentage

// Agent Status Enum
export const AgentStatus = {
  Pending: 0,
  Active: 1,
  Inactive: 2,
  Deregistered: 3,
} as const;

// MCP Server Status Enum
export const McpServerStatus = {
  Pending: 0,
  Active: 1,
  Inactive: 2,
  Deregistered: 3,
} as const;

// UI Constants
export const ITEMS_PER_PAGE = 12;
export const SEARCH_DEBOUNCE_MS = 300;

// External Links
export const EXTERNAL_LINKS = {
  SOLANA_DOCS: 'https://docs.solana.com',
  GITHUB: 'https://github.com/openSVM/aeamcp',
  DISCORD: 'https://discord.gg/aeamcp',
  TWITTER: 'https://twitter.com/aeamcp',
  SOLSCAN_TOKEN: `https://solscan.io/token/${SVMAI_TOKEN_MINT.toString()}`,
  JUPITER_SWAP: `https://jup.ag/swap/SOL-${SVMAI_TOKEN_MINT.toString()}`,
  RAYDIUM_POOL: `https://raydium.io/swap/?inputCurrency=sol&outputCurrency=${SVMAI_TOKEN_MINT.toString()}`,
} as const;

// Validation Rules
export const VALIDATION = {
  AGENT_ID_MIN_LENGTH: 3,
  AGENT_ID_MAX_LENGTH: 50,
  AGENT_NAME_MIN_LENGTH: 3,
  AGENT_NAME_MAX_LENGTH: 100,
  AGENT_DESCRIPTION_MIN_LENGTH: 10,
  AGENT_DESCRIPTION_MAX_LENGTH: 500,
  SERVER_ID_MIN_LENGTH: 3,
  SERVER_ID_MAX_LENGTH: 50,
  SERVER_NAME_MIN_LENGTH: 3,
  SERVER_NAME_MAX_LENGTH: 100,
  MAX_TAGS: 10,
  MAX_CAPABILITIES: 20,
} as const;

// Token Distribution (percentages)
export const TOKEN_DISTRIBUTION = {
  COMMUNITY_ECOSYSTEM: 40,
  DEVELOPMENT_TEAM: 20,
  TREASURY_DAO: 15,
  LIQUIDITY_MARKET_MAKING: 10,
  ADVISORS_PARTNERS: 10,
  RESERVE_FUND: 5,
} as const;
