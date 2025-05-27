/**
 * UI-Compatible Types
 * 
 * These interfaces define the data structures used by the frontend UI components.
 * They are transformed from the on-chain data structures for optimal display
 * and user interaction while maintaining all necessary information.
 */

// ============================================================================
// UI AGENT TYPES
// ============================================================================

/**
 * Agent data structure optimized for UI display
 * Transformed from OnChainAgentEntry for better usability
 */
export interface UIAgentData {
  /** Unique identifier for the agent */
  id: string;
  /** Human-readable name of the agent */
  name: string;
  /** Detailed description of the agent's capabilities */
  description: string;
  /** Semantic version of the agent */
  version: string;
  /** Name of the agent provider/company */
  provider: string;
  /** URL of the agent provider (optional) */
  providerUrl?: string;
  /** Primary service endpoint URL */
  endpoint: string;
  /** List of parsed capabilities from flags */
  capabilities: string[];
  /** Combined supported input/output modes for display */
  supportedModes: string[];
  /** List of skills/capabilities the agent provides */
  skills: UIAgentSkill[];
  /** List of tags for categorization */
  tags: string[];
  /** Human-readable status */
  status: string;
  /** ISO date string of registration */
  registrationDate: string;
  /** ISO date string of last update */
  lastUpdate: string;
  /** Base58 encoded owner authority */
  ownerAuthority: string;
  /** Security information URI (optional) */
  securityInfoUri?: string;
  /** AEA address (optional) */
  aeaAddress?: string;
  /** Economic intent summary (optional) */
  economicIntent?: string;
  /** Extended metadata URI (optional) */
  extendedMetadataUri?: string;
  /** All service endpoints */
  serviceEndpoints: UIServiceEndpoint[];
  /** Calculated trust/security score (0-100) */
  trustScore?: number;
  /** Performance rating (0-5) */
  rating?: number;
  /** Number of users/interactions */
  users?: number;
  /** Stake required for usage */
  stakeRequired?: number;
}

/**
 * UI-friendly skill representation
 */
export interface UIAgentSkill {
  /** Unique identifier for the skill */
  skillId: string;
  /** Human-readable name of the skill */
  name: string;
  /** Tags associated with this skill */
  tags: string[];
  /** Optional description if available */
  description?: string;
}

/**
 * UI-friendly service endpoint representation
 */
export interface UIServiceEndpoint {
  /** Protocol identifier */
  protocol: string;
  /** Full URL of the endpoint */
  url: string;
  /** Whether this is the default endpoint */
  isDefault: boolean;
  /** Human-readable label for display */
  label: string;
}

// ============================================================================
// UI MCP SERVER TYPES
// ============================================================================

/**
 * MCP server data structure optimized for UI display
 * Transformed from OnChainMcpServerEntry for better usability
 */
export interface UIMcpServerData {
  /** Unique identifier for the server */
  id: string;
  /** Human-readable name of the server */
  name: string;
  /** Description of server capabilities */
  description: string;
  /** Semantic version of the server */
  version: string;
  /** Provider information (extracted from metadata) */
  provider?: string;
  /** Provider URL (extracted from metadata) */
  providerUrl?: string;
  /** Service endpoint URL */
  endpoint: string;
  /** List of tool names provided by this server */
  tools: string[];
  /** List of resource URI patterns handled */
  resources: string[];
  /** List of prompt names provided */
  prompts: string[];
  /** Capability summary object */
  capabilities: UIMcpCapabilities;
  /** Human-readable status */
  status: string;
  /** ISO date string of registration */
  registrationDate: string;
  /** ISO date string of last update */
  lastUpdate: string;
  /** Base58 encoded owner authority */
  ownerAuthority: string;
  /** List of tags for categorization */
  tags: string[];
  /** Full capabilities URI (optional) */
  fullCapabilitiesUri?: string;
  /** Documentation URL (optional) */
  documentationUrl?: string;
  /** Calculated trust/security score (0-100) */
  trustScore?: number;
  /** Performance rating (0-5) */
  rating?: number;
  /** Number of users/connections */
  users?: number;
}

/**
 * UI-friendly capabilities summary
 */
export interface UIMcpCapabilities {
  /** Whether the server supports tools */
  supportsTools: boolean;
  /** Whether the server supports resources */
  supportsResources: boolean;
  /** Whether the server supports prompts */
  supportsPrompts: boolean;
  /** Total count of tools */
  toolCount: number;
  /** Total count of resources */
  resourceCount: number;
  /** Total count of prompts */
  promptCount: number;
}

/**
 * UI-friendly tool definition
 */
export interface UIMcpTool {
  /** Name of the tool */
  name: string;
  /** Description if available from metadata */
  description?: string;
  /** Tags associated with this tool */
  tags: string[];
  /** Input schema information if available */
  inputSchema?: string;
  /** Output schema information if available */
  outputSchema?: string;
}

/**
 * UI-friendly resource definition
 */
export interface UIMcpResource {
  /** URI pattern that this resource handles */
  uriPattern: string;
  /** Description if available from metadata */
  description?: string;
  /** Tags associated with this resource */
  tags: string[];
  /** Example URIs that match the pattern */
  examples?: string[];
}

/**
 * UI-friendly prompt definition
 */
export interface UIMcpPrompt {
  /** Name of the prompt */
  name: string;
  /** Description if available from metadata */
  description?: string;
  /** Tags associated with this prompt */
  tags: string[];
  /** Template or example if available */
  template?: string;
}

// ============================================================================
// SEARCH AND FILTER TYPES
// ============================================================================

/**
 * Search and filtering parameters for agents
 */
export interface AgentSearchParams {
  /** Search term for name/description */
  query?: string;
  /** Filter by status */
  status?: string[];
  /** Filter by capabilities */
  capabilities?: string[];
  /** Filter by tags */
  tags?: string[];
  /** Filter by provider */
  provider?: string;
  /** Minimum trust score */
  minTrustScore?: number;
  /** Sort field */
  sortBy?: 'name' | 'registrationDate' | 'lastUpdate' | 'rating' | 'trustScore';
  /** Sort direction */
  sortOrder?: 'asc' | 'desc';
}

/**
 * Search and filtering parameters for MCP servers
 */
export interface McpServerSearchParams {
  /** Search term for name/description */
  query?: string;
  /** Filter by status */
  status?: string[];
  /** Filter by capabilities */
  capabilities?: ('tools' | 'resources' | 'prompts')[];
  /** Filter by tags */
  tags?: string[];
  /** Filter by tools */
  tools?: string[];
  /** Minimum trust score */
  minTrustScore?: number;
  /** Sort field */
  sortBy?: 'name' | 'registrationDate' | 'lastUpdate' | 'rating' | 'trustScore';
  /** Sort direction */
  sortOrder?: 'asc' | 'desc';
}

// ============================================================================
// PAGINATION TYPES
// ============================================================================

/**
 * Pagination options for data fetching
 */
export interface PaginationOptions {
  /** Number of items per page */
  limit?: number;
  /** Offset for pagination */
  offset?: number;
  /** Search/filter parameters */
  filters?: Record<string, any>;
}

/**
 * Paginated result structure
 */
export interface PaginatedResult<T> {
  /** Array of data items */
  data: T[];
  /** Total number of items available */
  total: number;
  /** Whether there are more items available */
  hasMore: boolean;
  /** Next offset for pagination */
  nextOffset?: number;
  /** Current page number (if using page-based pagination) */
  currentPage?: number;
  /** Total number of pages */
  totalPages?: number;
}

// ============================================================================
// UI STATE TYPES
// ============================================================================

/**
 * Loading state for async operations
 */
export interface LoadingState {
  /** Whether data is currently loading */
  isLoading: boolean;
  /** Type of loading operation */
  loadingType?: 'initial' | 'refresh' | 'loadMore' | 'search';
  /** Loading message for user feedback */
  message?: string;
}

/**
 * Error state for failed operations
 */
export interface ErrorState {
  /** Whether there is an error */
  hasError: boolean;
  /** Error message for display */
  message?: string;
  /** Error type for handling */
  type?: 'network' | 'blockchain' | 'validation' | 'permission' | 'unknown';
  /** Whether the error is recoverable */
  recoverable?: boolean;
  /** Timestamp of when the error occurred */
  timestamp?: number;
}

/**
 * Data freshness information
 */
export interface DataFreshness {
  /** When the data was last fetched */
  lastFetched: number;
  /** Whether the data is considered stale */
  isStale: boolean;
  /** Source of the data */
  source: 'blockchain' | 'cache' | 'fallback';
  /** Confidence level in the data (0-100) */
  confidence: number;
}

// ============================================================================
// DASHBOARD AND STATISTICS TYPES
// ============================================================================

/**
 * Registry statistics for dashboard display
 */
export interface RegistryStats {
  /** Agent statistics */
  agents: {
    total: number;
    active: number;
    inactive: number;
    recentRegistrations: number;
  };
  /** MCP server statistics */
  servers: {
    total: number;
    active: number;
    maintenance: number;
    recentRegistrations: number;
  };
  /** Network statistics */
  network: {
    blockHeight: number;
    tps: number;
    avgConfirmationTime: number;
  };
  /** Last update timestamp */
  lastUpdated: number;
}

/**
 * Trending data for discovery
 */
export interface TrendingData {
  /** Trending agents */
  agents: UIAgentData[];
  /** Trending MCP servers */
  servers: UIMcpServerData[];
  /** Popular tags */
  tags: Array<{ tag: string; count: number }>;
  /** Popular capabilities */
  capabilities: Array<{ capability: string; count: number }>;
}