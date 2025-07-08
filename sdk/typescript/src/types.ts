import { PublicKey } from '@solana/web3.js';

// Base types
export type StringId = string;
export type SolanaPublicKey = PublicKey;
export type A2AMPLAmount = bigint; // Base units with 9 decimals

// Agent Registry Types
export enum AgentStatus {
  Pending = 0,
  Active = 1,
  Inactive = 2,
  Deregistered = 3,
}

export enum AgentTier {
  Bronze = 'bronze',
  Silver = 'silver', 
  Gold = 'gold',
  Platinum = 'platinum',
}

export interface AgentServiceEndpoint {
  protocol: string; // max 64 chars
  url: string; // max 256 chars
}

export interface AgentSkill {
  id: string; // max 64 chars
  name: string; // max 128 chars
  tags: string[]; // max 5 tags, each max 32 chars
}

export interface AgentRegistrationData {
  agentId: StringId; // max 64 chars
  name: string; // max 128 chars
  description: string; // max 512 chars
  version: string; // max 32 chars
  providerName: string; // max 128 chars
  providerUrl: string; // max 256 chars
  documentationUrl?: string; // max 256 chars
  serviceEndpoints: AgentServiceEndpoint[]; // max 3
  supportedModes: string[]; // max 5, each max 64 chars
  skills: AgentSkill[]; // max 10
  securityInfoUri?: string; // max 256 chars
  aeaAddress?: string; // max 128 chars
  economicIntent?: string; // max 256 chars
  extendedMetadataUri?: string; // max 256 chars
  tags: string[]; // max 10, each max 32 chars
}

export interface AgentUpdateData {
  name?: string;
  description?: string;
  version?: string;
  providerName?: string;
  providerUrl?: string;
  documentationUrl?: string;
  serviceEndpoints?: AgentServiceEndpoint[];
  supportedModes?: string[];
  skills?: AgentSkill[];
  securityInfoUri?: string;
  aeaAddress?: string;
  economicIntent?: string;
  extendedMetadataUri?: string;
  tags?: string[];
}

export interface AgentRegistryEntry {
  agentId: StringId;
  name: string;
  description: string;
  version: string;
  status: AgentStatus;
  owner: SolanaPublicKey;
  registrationSlot: bigint;
  lastUpdateSlot: bigint;
  providerName: string;
  providerUrl: string;
  documentationUrl?: string;
  serviceEndpoints: AgentServiceEndpoint[];
  supportedModes: string[];
  skills: AgentSkill[];
  securityInfoUri?: string;
  aeaAddress?: string;
  economicIntent?: string;
  extendedMetadataUri?: string;
  tags: string[];
  stateVersion: bigint;
}

// MCP Server Registry Types
export enum McpServerStatus {
  Pending = 0,
  Active = 1,
  Inactive = 2,
  Deregistered = 3,
}

export interface McpToolDefinition {
  name: string; // max 64 chars
  tags: string[]; // max 3, each max 32 chars
}

export interface McpResourceDefinition {
  uriPattern: string; // max 128 chars
  tags: string[]; // max 3, each max 32 chars
}

export interface McpPromptDefinition {
  name: string; // max 64 chars
  tags: string[]; // max 3, each max 32 chars
}

export interface McpServerRegistrationData {
  serverId: StringId; // max 64 chars
  name: string; // max 128 chars
  version: string; // max 32 chars
  endpointUrl: string; // max 256 chars
  capabilitiesSummary: string; // max 256 chars
  onchainToolDefinitions: McpToolDefinition[]; // max 5
  onchainResourceDefinitions: McpResourceDefinition[]; // max 5
  onchainPromptDefinitions: McpPromptDefinition[]; // max 5
  fullCapabilitiesUri?: string; // max 256 chars
  documentationUrl?: string; // max 256 chars
  tags: string[]; // max 10, each max 32 chars
}

export interface McpServerUpdateData {
  name?: string;
  version?: string;
  endpointUrl?: string;
  capabilitiesSummary?: string;
  onchainToolDefinitions?: McpToolDefinition[];
  onchainResourceDefinitions?: McpResourceDefinition[];
  onchainPromptDefinitions?: McpPromptDefinition[];
  fullCapabilitiesUri?: string;
  documentationUrl?: string;
  tags?: string[];
}

export interface McpServerRegistryEntry {
  serverId: StringId;
  name: string;
  version: string;
  status: McpServerStatus;
  owner: SolanaPublicKey;
  registrationSlot: bigint;
  lastUpdateSlot: bigint;
  endpointUrl: string;
  capabilitiesSummary: string;
  onchainToolDefinitions: McpToolDefinition[];
  onchainResourceDefinitions: McpResourceDefinition[];
  onchainPromptDefinitions: McpPromptDefinition[];
  fullCapabilitiesUri?: string;
  documentationUrl?: string;
  tags: string[];
  stateVersion: bigint;
}

// Pricing and Payment Types
export interface PricingInfo {
  basePrice: A2AMPLAmount; // in base units (9 decimals)
  currency: 'A2AMPL';
  tier?: AgentTier;
  bulkDiscountPercent?: number; // 0-50
  priorityMultiplier?: number; // 100-300 (1.0x-3.0x)
}

export interface ServicePricing extends PricingInfo {
  serviceType: 'agent_registration' | 'mcp_registration' | 'tool_usage' | 'resource_access' | 'prompt_usage';
}

export interface StakingInfo {
  amount: A2AMPLAmount;
  tier: AgentTier;
  lockPeriod: number; // seconds
  lockEndSlot: bigint;
}

// Payment Flow Types
export enum PaymentMethod {
  Prepay = 'prepay',
  PayAsYouGo = 'pay_as_you_go', 
  Stream = 'stream',
}

export interface PaymentFlowConfig {
  method: PaymentMethod;
  pricing: PricingInfo;
  payer: SolanaPublicKey;
  recipient: SolanaPublicKey;
}

export interface PrepaymentConfig extends PaymentFlowConfig {
  method: PaymentMethod.Prepay;
  amount: A2AMPLAmount;
}

export interface PayAsYouGoConfig extends PaymentFlowConfig {
  method: PaymentMethod.PayAsYouGo;
  perUsePrice: A2AMPLAmount;
}

export interface StreamConfig extends PaymentFlowConfig {
  method: PaymentMethod.Stream;
  ratePerSecond: A2AMPLAmount;
  duration: number; // seconds
}

// SDK Configuration Types
export interface SdkConfig {
  cluster: 'mainnet-beta' | 'devnet' | 'testnet';
  rpcUrl?: string;
  commitment?: 'confirmed' | 'finalized';
  agentRegistryProgramId?: SolanaPublicKey;
  mcpRegistryProgramId?: SolanaPublicKey;
  a2amplTokenMint?: SolanaPublicKey;
}

// Error Types
export interface SdkErrorDetails {
  code: string;
  message: string;
  programErrorCode?: number;
  transactionSignature?: string;
  cause?: Error;
}

// IDL Types
export interface IdlCacheEntry {
  idl: any; // TODO: Replace with specific IDL types
  hash: string;
  lastUpdated: number;
}

// Network and Transaction Types
export interface TransactionResult {
  signature: string;
  slot: bigint;
  confirmationStatus: 'processed' | 'confirmed' | 'finalized';
}

export interface ProgramAccount<T> {
  publicKey: SolanaPublicKey;
  account: T;
}

// Constants from program
export const CONSTANTS = {
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
  A2AMPL_BASE_UNIT: 1_000_000_000n,
  AGENT_REGISTRATION_FEE: 100_000_000_000n, // 100 A2AMPL
  MCP_REGISTRATION_FEE: 50_000_000_000n, // 50 A2AMPL
  
  // Staking amounts
  BRONZE_TIER_STAKE: 1_000_000_000_000n, // 1,000 A2AMPL
  SILVER_TIER_STAKE: 10_000_000_000_000n, // 10,000 A2AMPL
  GOLD_TIER_STAKE: 50_000_000_000_000n, // 50,000 A2AMPL
  PLATINUM_TIER_STAKE: 100_000_000_000_000n, // 100,000 A2AMPL

  // Lock periods (seconds)
  BRONZE_LOCK_PERIOD: 2_592_000, // 30 days
  SILVER_LOCK_PERIOD: 7_776_000, // 90 days
  GOLD_LOCK_PERIOD: 15_552_000, // 180 days
  PLATINUM_LOCK_PERIOD: 31_536_000, // 365 days

  // Service fees
  MIN_SERVICE_FEE: 1_000_000_000n, // 1.0 A2AMPL
  MIN_TOOL_FEE: 1_000_000_000n, // 1.0 A2AMPL
  MIN_RESOURCE_FEE: 500_000_000n, // 0.5 A2AMPL
  MIN_PROMPT_FEE: 2_000_000_000n, // 2.0 A2AMPL

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
} as const;

// Token mint addresses
export const TOKEN_MINTS = {
  mainnet: new PublicKey('Cpzvdx6pppc9TNArsGsqgShCsKC9NCCjA2gtzHvUpump'),
  devnet: new PublicKey('A2AMPLyncKHwfSnwRNsJ2qsjsetgo9fGkP8YZPsDZ9mE'),
} as const;

// Program IDs (placeholders - to be updated with actual program IDs)
export const PROGRAM_IDS = {
  agentRegistry: new PublicKey('AgentReg11111111111111111111111111111111111'),
  mcpServerRegistry: new PublicKey('11111111111111111111111111111111'), // TBD
} as const;