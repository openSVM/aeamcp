/**
 * On-Chain TypeScript Interfaces
 * 
 * These interfaces exactly match the IDL schema definitions for both
 * agent and MCP server registries, ensuring type safety between
 * blockchain data and frontend application.
 */

import { PublicKey } from '@solana/web3.js';

// ============================================================================
// AGENT REGISTRY TYPES (from agent_registry.json IDL)
// ============================================================================

/**
 * Service endpoint definition for agents
 * Maps to ServiceEndpoint struct in IDL
 */
export interface ServiceEndpoint {
  /** Protocol identifier (e.g., "https", "wss") */
  protocol: string;
  /** Full URL of the service endpoint */
  url: string;
  /** Whether this is the default endpoint for the agent */
  isDefault: boolean;
}

/**
 * Input version of service endpoint for registration
 * Maps to ServiceEndpointInput struct in IDL
 */
export interface ServiceEndpointInput {
  /** Protocol identifier (e.g., "https", "wss") */
  protocol: string;
  /** Full URL of the service endpoint */
  url: string;
  /** Whether this is the default endpoint for the agent */
  isDefault: boolean;
}

/**
 * Agent skill definition
 * Maps to AgentSkill struct in IDL
 */
export interface AgentSkill {
  /** Unique identifier for the skill */
  id: string;
  /** Human-readable name of the skill */
  name: string;
  /** Optional hash of the skill description for integrity */
  descriptionHash?: Uint8Array;
  /** Tags associated with this skill */
  tags: string[];
}

/**
 * Input version of agent skill for registration
 * Maps to AgentSkillInput struct in IDL
 */
export interface AgentSkillInput {
  /** Unique identifier for the skill */
  id: string;
  /** Human-readable name of the skill */
  name: string;
  /** Optional hash of the skill description for integrity */
  descriptionHash?: Uint8Array;
  /** Tags associated with this skill */
  tags: string[];
}

/**
 * Agent update details input for partial updates
 * Maps to AgentUpdateDetailsInput struct in IDL
 */
export interface AgentUpdateDetailsInput {
  /** Optional new name for the agent */
  name?: string;
  /** Optional new description for the agent */
  description?: string;
  /** Optional new version for the agent */
  agentVersion?: string;
  /** Optional new provider name */
  providerName?: string;
  /** Flag to clear the provider name */
  clearProviderName?: boolean;
  /** Optional new provider URL */
  providerUrl?: string;
  /** Flag to clear the provider URL */
  clearProviderUrl?: boolean;
  /** Optional new documentation URL */
  documentationUrl?: string;
  /** Flag to clear the documentation URL */
  clearDocumentationUrl?: boolean;
  /** Optional new service endpoints */
  serviceEndpoints?: ServiceEndpointInput[];
  /** Optional new capabilities flags */
  capabilitiesFlags?: bigint;
  /** Optional new supported input modes */
  supportedInputModes?: string[];
  /** Optional new supported output modes */
  supportedOutputModes?: string[];
  /** Optional new skills */
  skills?: AgentSkillInput[];
  /** Optional new security info URI */
  securityInfoUri?: string;
  /** Flag to clear the security info URI */
  clearSecurityInfoUri?: boolean;
  /** Optional new AEA address */
  aeaAddress?: string;
  /** Flag to clear the AEA address */
  clearAeaAddress?: boolean;
  /** Optional new economic intent summary */
  economicIntentSummary?: string;
  /** Flag to clear the economic intent summary */
  clearEconomicIntentSummary?: boolean;
  /** Optional new supported AEA protocols hash */
  supportedAeaProtocolsHash?: Uint8Array;
  /** Flag to clear the supported AEA protocols hash */
  clearSupportedAeaProtocolsHash?: boolean;
  /** Optional new extended metadata URI */
  extendedMetadataUri?: string;
  /** Flag to clear the extended metadata URI */
  clearExtendedMetadataUri?: boolean;
  /** Optional new tags */
  tags?: string[];
}

/**
 * Main agent registry entry stored on-chain
 * Maps to AgentRegistryEntryV1 struct in IDL
 * 
 * This is the complete structure stored in program accounts
 */
export interface OnChainAgentEntry {
  /** PDA bump seed */
  bump: number;
  /** Registry version for migration compatibility */
  registryVersion: number;
  /** Public key of the account that owns this agent entry */
  ownerAuthority: PublicKey;
  /** Unique identifier for the agent */
  agentId: string;
  /** Human-readable name of the agent */
  name: string;
  /** Detailed description of the agent's capabilities */
  description: string;
  /** Semantic version of the agent */
  agentVersion: string;
  /** Optional name of the agent provider/company */
  providerName?: string;
  /** Optional URL of the agent provider */
  providerUrl?: string;
  /** Optional URL to agent documentation */
  documentationUrl?: string;
  /** List of service endpoints where the agent can be accessed */
  serviceEndpoints: ServiceEndpoint[];
  /** Bitflags representing agent capabilities */
  capabilitiesFlags: bigint;
  /** List of supported input modes */
  supportedInputModes: string[];
  /** List of supported output modes */
  supportedOutputModes: string[];
  /** List of skills/capabilities the agent provides */
  skills: AgentSkill[];
  /** Optional URI containing security information */
  securityInfoUri?: string;
  /** Optional Autonomous Economic Agent address */
  aeaAddress?: string;
  /** Optional summary of economic intent/business model */
  economicIntentSummary?: string;
  /** Optional hash of supported AEA protocols */
  supportedAeaProtocolsHash?: Uint8Array;
  /** Current status of the agent (0=Inactive, 1=Active, 2=Suspended, 3=Deprecated) */
  status: number;
  /** Unix timestamp when the agent was first registered */
  registrationTimestamp: bigint;
  /** Unix timestamp when the agent was last updated */
  lastUpdateTimestamp: bigint;
  /** Optional URI containing extended metadata */
  extendedMetadataUri?: string;
  /** List of tags for categorization and discovery */
  tags: string[];
}

/**
 * Agent registration input data
 * Used when registering a new agent on-chain
 */
export interface AgentRegistrationData {
  /** Unique identifier for the agent */
  agentId: string;
  /** Human-readable name of the agent */
  name: string;
  /** Detailed description of the agent's capabilities */
  description: string;
  /** Semantic version of the agent */
  agentVersion: string;
  /** Optional name of the agent provider/company */
  providerName?: string;
  /** Optional URL of the agent provider */
  providerUrl?: string;
  /** Optional URL to agent documentation */
  documentationUrl?: string;
  /** List of service endpoints where the agent can be accessed */
  serviceEndpoints: ServiceEndpointInput[];
  /** Bitflags representing agent capabilities */
  capabilitiesFlags: bigint;
  /** List of supported input modes */
  supportedInputModes: string[];
  /** List of supported output modes */
  supportedOutputModes: string[];
  /** List of skills/capabilities the agent provides */
  skills: AgentSkillInput[];
  /** Optional URI containing security information */
  securityInfoUri?: string;
  /** Optional Autonomous Economic Agent address */
  aeaAddress?: string;
  /** Optional summary of economic intent/business model */
  economicIntentSummary?: string;
  /** Optional hash of supported AEA protocols */
  supportedAeaProtocolsHash?: Uint8Array;
  /** Optional URI containing extended metadata */
  extendedMetadataUri?: string;
  /** List of tags for categorization and discovery */
  tags: string[];
}

// ============================================================================
// AGENT STATUS ENUMS
// ============================================================================

/**
 * Agent status enumeration
 */
export enum AgentStatus {
  Inactive = 0,
  Active = 1,
  Suspended = 2,
  Deprecated = 3,
}

/**
 * Agent capability flags
 * These correspond to the bitflags used in capabilitiesFlags
 */
export enum AgentCapabilityFlags {
  None = 0,
  Trading = 1 << 0,
  Analysis = 1 << 1,
  Automation = 1 << 2,
  RiskManagement = 1 << 3,
  DataProcessing = 1 << 4,
  MachineLearning = 1 << 5,
  NaturalLanguage = 1 << 6,
  ImageProcessing = 1 << 7,
  AudioProcessing = 1 << 8,
  VideoProcessing = 1 << 9,
  // Add more capabilities as needed
}

// ============================================================================
// TYPE GUARDS FOR RUNTIME VALIDATION
// ============================================================================

/**
 * Type guard to check if a value is a valid PublicKey
 */
export function isPublicKey(value: any): value is PublicKey {
  try {
    if (value instanceof PublicKey) return true;
    if (typeof value === 'string') {
      new PublicKey(value);
      return true;
    }
    return false;
  } catch {
    return false;
  }
}

/**
 * Type guard to check if a value is a valid ServiceEndpoint
 */
export function isServiceEndpoint(value: any): value is ServiceEndpoint {
  return (
    typeof value === 'object' &&
    value !== null &&
    typeof value.protocol === 'string' &&
    typeof value.url === 'string' &&
    typeof value.isDefault === 'boolean'
  );
}

/**
 * Type guard to check if a value is a valid AgentSkill
 */
export function isAgentSkill(value: any): value is AgentSkill {
  return (
    typeof value === 'object' &&
    value !== null &&
    typeof value.id === 'string' &&
    typeof value.name === 'string' &&
    Array.isArray(value.tags) &&
    value.tags.every((tag: any) => typeof tag === 'string') &&
    (value.descriptionHash === undefined || value.descriptionHash instanceof Uint8Array)
  );
}

/**
 * Type guard to check if a value is a valid OnChainAgentEntry
 */
export function isOnChainAgentEntry(value: any): value is OnChainAgentEntry {
  return (
    typeof value === 'object' &&
    value !== null &&
    typeof value.bump === 'number' &&
    typeof value.registryVersion === 'number' &&
    isPublicKey(value.ownerAuthority) &&
    typeof value.agentId === 'string' &&
    typeof value.name === 'string' &&
    typeof value.description === 'string' &&
    typeof value.agentVersion === 'string' &&
    Array.isArray(value.serviceEndpoints) &&
    value.serviceEndpoints.every(isServiceEndpoint) &&
    typeof value.capabilitiesFlags === 'bigint' &&
    Array.isArray(value.supportedInputModes) &&
    value.supportedInputModes.every((mode: any) => typeof mode === 'string') &&
    Array.isArray(value.supportedOutputModes) &&
    value.supportedOutputModes.every((mode: any) => typeof mode === 'string') &&
    Array.isArray(value.skills) &&
    value.skills.every(isAgentSkill) &&
    typeof value.status === 'number' &&
    typeof value.registrationTimestamp === 'bigint' &&
    typeof value.lastUpdateTimestamp === 'bigint' &&
    Array.isArray(value.tags) &&
    value.tags.every((tag: any) => typeof tag === 'string')
  );
}
// ============================================================================
// MCP SERVER REGISTRY TYPES (from mcp_server_registry.json IDL)
// ============================================================================

/**
 * MCP tool definition stored on-chain
 * Maps to McpToolDefinitionOnChain struct in IDL
 */
export interface McpToolDefinitionOnChain {
  /** Name of the tool */
  name: string;
  /** Hash of the tool description for integrity verification */
  descriptionHash: Uint8Array;
  /** Hash of the input schema for validation */
  inputSchemaHash: Uint8Array;
  /** Hash of the output schema for validation */
  outputSchemaHash: Uint8Array;
  /** Tags associated with this tool */
  tags: string[];
}

/**
 * Input version of MCP tool definition for registration
 * Maps to McpToolDefinitionOnChainInput struct in IDL
 */
export interface McpToolDefinitionOnChainInput {
  /** Name of the tool */
  name: string;
  /** Hash of the tool description for integrity verification */
  descriptionHash: Uint8Array;
  /** Hash of the input schema for validation */
  inputSchemaHash: Uint8Array;
  /** Hash of the output schema for validation */
  outputSchemaHash: Uint8Array;
  /** Tags associated with this tool */
  tags: string[];
}

/**
 * MCP resource definition stored on-chain
 * Maps to McpResourceDefinitionOnChain struct in IDL
 */
export interface McpResourceDefinitionOnChain {
  /** URI pattern that this resource handles */
  uriPattern: string;
  /** Hash of the resource description for integrity verification */
  descriptionHash: Uint8Array;
  /** Tags associated with this resource */
  tags: string[];
}

/**
 * Input version of MCP resource definition for registration
 * Maps to McpResourceDefinitionOnChainInput struct in IDL
 */
export interface McpResourceDefinitionOnChainInput {
  /** URI pattern that this resource handles */
  uriPattern: string;
  /** Hash of the resource description for integrity verification */
  descriptionHash: Uint8Array;
  /** Tags associated with this resource */
  tags: string[];
}

/**
 * MCP prompt definition stored on-chain
 * Maps to McpPromptDefinitionOnChain struct in IDL
 */
export interface McpPromptDefinitionOnChain {
  /** Name of the prompt */
  name: string;
  /** Hash of the prompt description for integrity verification */
  descriptionHash: Uint8Array;
  /** Tags associated with this prompt */
  tags: string[];
}

/**
 * Input version of MCP prompt definition for registration
 * Maps to McpPromptDefinitionOnChainInput struct in IDL
 */
export interface McpPromptDefinitionOnChainInput {
  /** Name of the prompt */
  name: string;
  /** Hash of the prompt description for integrity verification */
  descriptionHash: Uint8Array;
  /** Tags associated with this prompt */
  tags: string[];
}

/**
 * MCP server update details input for partial updates
 * Maps to McpServerUpdateDetailsInput struct in IDL
 */
export interface McpServerUpdateDetailsInput {
  /** Optional new name for the server */
  name?: string;
  /** Optional new version for the server */
  serverVersion?: string;
  /** Optional new service endpoint */
  serviceEndpoint?: string;
  /** Optional new documentation URL */
  documentationUrl?: string;
  /** Flag to clear the documentation URL */
  clearDocumentationUrl?: boolean;
  /** Optional new server capabilities summary */
  serverCapabilitiesSummary?: string;
  /** Flag to clear the server capabilities summary */
  clearServerCapabilitiesSummary?: boolean;
  /** Optional new resources support flag */
  supportsResources?: boolean;
  /** Optional new tools support flag */
  supportsTools?: boolean;
  /** Optional new prompts support flag */
  supportsPrompts?: boolean;
  /** Optional new tool definitions */
  onchainToolDefinitions?: McpToolDefinitionOnChainInput[];
  /** Optional new resource definitions */
  onchainResourceDefinitions?: McpResourceDefinitionOnChainInput[];
  /** Optional new prompt definitions */
  onchainPromptDefinitions?: McpPromptDefinitionOnChainInput[];
  /** Optional new full capabilities URI */
  fullCapabilitiesUri?: string;
  /** Flag to clear the full capabilities URI */
  clearFullCapabilitiesUri?: boolean;
  /** Optional new tags */
  tags?: string[];
}

/**
 * Main MCP server registry entry stored on-chain
 * Maps to McpServerRegistryEntryV1 struct in IDL
 * 
 * This is the complete structure stored in program accounts
 */
export interface OnChainMcpServerEntry {
  /** PDA bump seed */
  bump: number;
  /** Registry version for migration compatibility */
  registryVersion: number;
  /** Public key of the account that owns this server entry */
  ownerAuthority: PublicKey;
  /** Unique identifier for the MCP server */
  serverId: string;
  /** Human-readable name of the server */
  name: string;
  /** Semantic version of the server */
  serverVersion: string;
  /** Service endpoint URL where the server can be accessed */
  serviceEndpoint: string;
  /** Optional URL to server documentation */
  documentationUrl?: string;
  /** Optional summary of server capabilities */
  serverCapabilitiesSummary?: string;
  /** Whether the server supports resources */
  supportsResources: boolean;
  /** Whether the server supports tools */
  supportsTools: boolean;
  /** Whether the server supports prompts */
  supportsPrompts: boolean;
  /** List of tool definitions provided by this server */
  onchainToolDefinitions: McpToolDefinitionOnChain[];
  /** List of resource definitions provided by this server */
  onchainResourceDefinitions: McpResourceDefinitionOnChain[];
  /** List of prompt definitions provided by this server */
  onchainPromptDefinitions: McpPromptDefinitionOnChain[];
  /** Current status of the server (0=Inactive, 1=Active, 2=Maintenance, 3=Deprecated) */
  status: number;
  /** Unix timestamp when the server was first registered */
  registrationTimestamp: bigint;
  /** Unix timestamp when the server was last updated */
  lastUpdateTimestamp: bigint;
  /** Optional URI containing full capabilities information */
  fullCapabilitiesUri?: string;
  /** List of tags for categorization and discovery */
  tags: string[];
}

/**
 * MCP server registration input data
 * Used when registering a new MCP server on-chain
 */
export interface McpServerRegistrationData {
  /** Unique identifier for the MCP server */
  serverId: string;
  /** Human-readable name of the server */
  name: string;
  /** Semantic version of the server */
  serverVersion: string;
  /** Service endpoint URL where the server can be accessed */
  serviceEndpoint: string;
  /** Optional URL to server documentation */
  documentationUrl?: string;
  /** Optional summary of server capabilities */
  serverCapabilitiesSummary?: string;
  /** Whether the server supports resources */
  supportsResources: boolean;
  /** Whether the server supports tools */
  supportsTools: boolean;
  /** Whether the server supports prompts */
  supportsPrompts: boolean;
  /** List of tool definitions provided by this server */
  onchainToolDefinitions: McpToolDefinitionOnChainInput[];
  /** List of resource definitions provided by this server */
  onchainResourceDefinitions: McpResourceDefinitionOnChainInput[];
  /** List of prompt definitions provided by this server */
  onchainPromptDefinitions: McpPromptDefinitionOnChainInput[];
  /** Optional URI containing full capabilities information */
  fullCapabilitiesUri?: string;
  /** List of tags for categorization and discovery */
  tags: string[];
}

// ============================================================================
// MCP SERVER STATUS ENUMS
// ============================================================================

/**
 * MCP server status enumeration
 */
export enum McpServerStatus {
  Inactive = 0,
  Active = 1,
  Maintenance = 2,
  Deprecated = 3,
}

// ============================================================================
// ADDITIONAL TYPE GUARDS FOR MCP SERVER TYPES
// ============================================================================

/**
 * Type guard to check if a value is a valid McpToolDefinitionOnChain
 */
export function isMcpToolDefinitionOnChain(value: any): value is McpToolDefinitionOnChain {
  return (
    typeof value === 'object' &&
    value !== null &&
    typeof value.name === 'string' &&
    value.descriptionHash instanceof Uint8Array &&
    value.inputSchemaHash instanceof Uint8Array &&
    value.outputSchemaHash instanceof Uint8Array &&
    Array.isArray(value.tags) &&
    value.tags.every((tag: any) => typeof tag === 'string')
  );
}

/**
 * Type guard to check if a value is a valid McpResourceDefinitionOnChain
 */
export function isMcpResourceDefinitionOnChain(value: any): value is McpResourceDefinitionOnChain {
  return (
    typeof value === 'object' &&
    value !== null &&
    typeof value.uriPattern === 'string' &&
    value.descriptionHash instanceof Uint8Array &&
    Array.isArray(value.tags) &&
    value.tags.every((tag: any) => typeof tag === 'string')
  );
}

/**
 * Type guard to check if a value is a valid McpPromptDefinitionOnChain
 */
export function isMcpPromptDefinitionOnChain(value: any): value is McpPromptDefinitionOnChain {
  return (
    typeof value === 'object' &&
    value !== null &&
    typeof value.name === 'string' &&
    value.descriptionHash instanceof Uint8Array &&
    Array.isArray(value.tags) &&
    value.tags.every((tag: any) => typeof tag === 'string')
  );
}

/**
 * Type guard to check if a value is a valid OnChainMcpServerEntry
 */
export function isOnChainMcpServerEntry(value: any): value is OnChainMcpServerEntry {
  return (
    typeof value === 'object' &&
    value !== null &&
    typeof value.bump === 'number' &&
    typeof value.registryVersion === 'number' &&
    isPublicKey(value.ownerAuthority) &&
    typeof value.serverId === 'string' &&
    typeof value.name === 'string' &&
    typeof value.serverVersion === 'string' &&
    typeof value.serviceEndpoint === 'string' &&
    typeof value.supportsResources === 'boolean' &&
    typeof value.supportsTools === 'boolean' &&
    typeof value.supportsPrompts === 'boolean' &&
    Array.isArray(value.onchainToolDefinitions) &&
    value.onchainToolDefinitions.every(isMcpToolDefinitionOnChain) &&
    Array.isArray(value.onchainResourceDefinitions) &&
    value.onchainResourceDefinitions.every(isMcpResourceDefinitionOnChain) &&
    Array.isArray(value.onchainPromptDefinitions) &&
    value.onchainPromptDefinitions.every(isMcpPromptDefinitionOnChain) &&
    typeof value.status === 'number' &&
    typeof value.registrationTimestamp === 'bigint' &&
    typeof value.lastUpdateTimestamp === 'bigint' &&
    Array.isArray(value.tags) &&
    value.tags.every((tag: any) => typeof tag === 'string')
  );
}