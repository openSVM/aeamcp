import { PublicKey } from '@solana/web3.js';
// Agent Registry Types
export var AgentStatus;
(function (AgentStatus) {
    AgentStatus[AgentStatus["Pending"] = 0] = "Pending";
    AgentStatus[AgentStatus["Active"] = 1] = "Active";
    AgentStatus[AgentStatus["Inactive"] = 2] = "Inactive";
    AgentStatus[AgentStatus["Deregistered"] = 3] = "Deregistered";
})(AgentStatus || (AgentStatus = {}));
export var AgentTier;
(function (AgentTier) {
    AgentTier["Bronze"] = "bronze";
    AgentTier["Silver"] = "silver";
    AgentTier["Gold"] = "gold";
    AgentTier["Platinum"] = "platinum";
})(AgentTier || (AgentTier = {}));
// MCP Server Registry Types
export var McpServerStatus;
(function (McpServerStatus) {
    McpServerStatus[McpServerStatus["Pending"] = 0] = "Pending";
    McpServerStatus[McpServerStatus["Active"] = 1] = "Active";
    McpServerStatus[McpServerStatus["Inactive"] = 2] = "Inactive";
    McpServerStatus[McpServerStatus["Deregistered"] = 3] = "Deregistered";
})(McpServerStatus || (McpServerStatus = {}));
// Payment Flow Types
export var PaymentMethod;
(function (PaymentMethod) {
    PaymentMethod["Prepay"] = "prepay";
    PaymentMethod["PayAsYouGo"] = "pay_as_you_go";
    PaymentMethod["Stream"] = "stream";
})(PaymentMethod || (PaymentMethod = {}));
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
export const TOKEN_MINTS = {
    mainnet: new PublicKey('Cpzvdx6pppc9TNArsGsqgShCsKC9NCCjA2gtzHvUpump'),
    devnet: new PublicKey('A2AMPLyncKHwfSnwRNsJ2qsjsetgo9fGkP8YZPsDZ9mE'),
};
// Program IDs (placeholders - to be updated with actual program IDs)
export const PROGRAM_IDS = {
    agentRegistry: new PublicKey('AgentReg11111111111111111111111111111111111'),
    mcpServerRegistry: new PublicKey('11111111111111111111111111111111'), // TBD
};
//# sourceMappingURL=types.js.map