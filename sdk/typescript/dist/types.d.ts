import { PublicKey } from '@solana/web3.js';
export type StringId = string;
export type SolanaPublicKey = PublicKey;
export type A2AMPLAmount = bigint;
export declare enum AgentStatus {
    Pending = 0,
    Active = 1,
    Inactive = 2,
    Deregistered = 3
}
export declare enum AgentTier {
    Bronze = "bronze",
    Silver = "silver",
    Gold = "gold",
    Platinum = "platinum"
}
export interface AgentServiceEndpoint {
    protocol: string;
    url: string;
}
export interface AgentSkill {
    id: string;
    name: string;
    tags: string[];
}
export interface AgentRegistrationData {
    agentId: StringId;
    name: string;
    description: string;
    version: string;
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
export declare enum McpServerStatus {
    Pending = 0,
    Active = 1,
    Inactive = 2,
    Deregistered = 3
}
export interface McpToolDefinition {
    name: string;
    tags: string[];
}
export interface McpResourceDefinition {
    uriPattern: string;
    tags: string[];
}
export interface McpPromptDefinition {
    name: string;
    tags: string[];
}
export interface McpServerRegistrationData {
    serverId: StringId;
    name: string;
    version: string;
    endpointUrl: string;
    capabilitiesSummary: string;
    onchainToolDefinitions: McpToolDefinition[];
    onchainResourceDefinitions: McpResourceDefinition[];
    onchainPromptDefinitions: McpPromptDefinition[];
    fullCapabilitiesUri?: string;
    documentationUrl?: string;
    tags: string[];
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
export interface PricingInfo {
    basePrice: A2AMPLAmount;
    currency: 'A2AMPL';
    tier?: AgentTier;
    bulkDiscountPercent?: number;
    priorityMultiplier?: number;
}
export interface ServicePricing extends PricingInfo {
    serviceType: 'agent_registration' | 'mcp_registration' | 'tool_usage' | 'resource_access' | 'prompt_usage';
}
export interface StakingInfo {
    amount: A2AMPLAmount;
    tier: AgentTier;
    lockPeriod: number;
    lockEndSlot: bigint;
}
export declare enum PaymentMethod {
    Prepay = "prepay",
    PayAsYouGo = "pay_as_you_go",
    Stream = "stream"
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
    duration: number;
}
export interface SdkConfig {
    cluster: 'mainnet-beta' | 'devnet' | 'testnet';
    rpcUrl?: string;
    commitment?: 'confirmed' | 'finalized';
    agentRegistryProgramId?: SolanaPublicKey;
    mcpRegistryProgramId?: SolanaPublicKey;
    a2amplTokenMint?: SolanaPublicKey;
}
export interface SdkErrorDetails {
    code: string;
    message: string;
    programErrorCode?: number;
    transactionSignature?: string;
    cause?: Error;
}
export interface IdlCacheEntry {
    idl: any;
    hash: string;
    lastUpdated: number;
}
export interface TransactionResult {
    signature: string;
    slot: bigint;
    confirmationStatus: 'processed' | 'confirmed' | 'finalized';
}
export interface ProgramAccount<T> {
    publicKey: SolanaPublicKey;
    account: T;
}
export declare const CONSTANTS: {
    readonly MAX_AGENT_ID_LEN: 64;
    readonly MAX_AGENT_NAME_LEN: 128;
    readonly MAX_AGENT_DESCRIPTION_LEN: 512;
    readonly MAX_AGENT_VERSION_LEN: 32;
    readonly MAX_PROVIDER_NAME_LEN: 128;
    readonly MAX_PROVIDER_URL_LEN: 256;
    readonly MAX_DOCUMENTATION_URL_LEN: 256;
    readonly MAX_SERVICE_ENDPOINTS: 3;
    readonly MAX_ENDPOINT_PROTOCOL_LEN: 64;
    readonly MAX_ENDPOINT_URL_LEN: 256;
    readonly MAX_SUPPORTED_MODES: 5;
    readonly MAX_MODE_LEN: 64;
    readonly MAX_SKILLS: 10;
    readonly MAX_SKILL_ID_LEN: 64;
    readonly MAX_SKILL_NAME_LEN: 128;
    readonly MAX_SKILL_TAGS: 5;
    readonly MAX_SKILL_TAG_LEN: 32;
    readonly MAX_SECURITY_INFO_URI_LEN: 256;
    readonly MAX_AEA_ADDRESS_LEN: 128;
    readonly MAX_ECONOMIC_INTENT_LEN: 256;
    readonly MAX_EXTENDED_METADATA_URI_LEN: 256;
    readonly MAX_AGENT_TAGS: 10;
    readonly MAX_AGENT_TAG_LEN: 32;
    readonly MAX_SERVER_ID_LEN: 64;
    readonly MAX_SERVER_NAME_LEN: 128;
    readonly MAX_SERVER_VERSION_LEN: 32;
    readonly MAX_SERVER_ENDPOINT_URL_LEN: 256;
    readonly MAX_SERVER_CAPABILITIES_SUMMARY_LEN: 256;
    readonly MAX_ONCHAIN_TOOL_DEFINITIONS: 5;
    readonly MAX_TOOL_NAME_LEN: 64;
    readonly MAX_TOOL_TAGS: 3;
    readonly MAX_TOOL_TAG_LEN: 32;
    readonly MAX_ONCHAIN_RESOURCE_DEFINITIONS: 5;
    readonly MAX_RESOURCE_URI_PATTERN_LEN: 128;
    readonly MAX_RESOURCE_TAGS: 3;
    readonly MAX_RESOURCE_TAG_LEN: 32;
    readonly MAX_ONCHAIN_PROMPT_DEFINITIONS: 5;
    readonly MAX_PROMPT_NAME_LEN: 64;
    readonly MAX_PROMPT_TAGS: 3;
    readonly MAX_PROMPT_TAG_LEN: 32;
    readonly MAX_FULL_CAPABILITIES_URI_LEN: 256;
    readonly MAX_SERVER_TAGS: 10;
    readonly MAX_SERVER_TAG_LEN: 32;
    readonly A2AMPL_DECIMALS: 9;
    readonly A2AMPL_BASE_UNIT: 1000000000n;
    readonly AGENT_REGISTRATION_FEE: 100000000000n;
    readonly MCP_REGISTRATION_FEE: 50000000000n;
    readonly BRONZE_TIER_STAKE: 1000000000000n;
    readonly SILVER_TIER_STAKE: 10000000000000n;
    readonly GOLD_TIER_STAKE: 50000000000000n;
    readonly PLATINUM_TIER_STAKE: 100000000000000n;
    readonly BRONZE_LOCK_PERIOD: 2592000;
    readonly SILVER_LOCK_PERIOD: 7776000;
    readonly GOLD_LOCK_PERIOD: 15552000;
    readonly PLATINUM_LOCK_PERIOD: 31536000;
    readonly MIN_SERVICE_FEE: 1000000000n;
    readonly MIN_TOOL_FEE: 1000000000n;
    readonly MIN_RESOURCE_FEE: 500000000n;
    readonly MIN_PROMPT_FEE: 2000000000n;
    readonly MIN_PRIORITY_MULTIPLIER: 100;
    readonly MAX_PRIORITY_MULTIPLIER: 300;
    readonly MAX_BULK_DISCOUNT: 50;
    readonly MIN_UPTIME_FOR_PREMIUM: 95;
    readonly AGENT_REGISTRY_PDA_SEED: "agent_reg_v1";
    readonly MCP_SERVER_REGISTRY_PDA_SEED: "mcp_srv_reg_v1";
    readonly STAKING_VAULT_SEED: "staking_vault";
    readonly FEE_VAULT_SEED: "fee_vault";
    readonly REGISTRATION_VAULT_SEED: "registration_vault";
};
export declare const TOKEN_MINTS: {
    readonly mainnet: PublicKey;
    readonly devnet: PublicKey;
};
export declare const PROGRAM_IDS: {
    readonly agentRegistry: PublicKey;
    readonly mcpServerRegistry: PublicKey;
};
//# sourceMappingURL=types.d.ts.map