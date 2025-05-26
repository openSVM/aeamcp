import { PublicKey } from '@solana/web3.js';

// Solana Network Configuration
export const SOLANA_NETWORK = process.env.NEXT_PUBLIC_SOLANA_NETWORK || 'devnet';
export const RPC_ENDPOINT = process.env.NEXT_PUBLIC_RPC_ENDPOINT || 'https://api.devnet.solana.com';

// Program IDs (replace with actual deployed program IDs)
export const AGENT_REGISTRY_PROGRAM_ID = new PublicKey(
  process.env.NEXT_PUBLIC_AGENT_PROGRAM_ID || '11111111111111111111111111111111'
);

export const MCP_SERVER_REGISTRY_PROGRAM_ID = new PublicKey(
  process.env.NEXT_PUBLIC_MCP_PROGRAM_ID || '11111111111111111111111111111111'
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