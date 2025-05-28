/**
 * Registry RPC Service
 * 
 * Provides high-level RPC operations for interacting with agent and MCP server
 * registries on the Solana blockchain with comprehensive error handling,
 * data validation, and transformation.
 */

import {
  Connection,
  PublicKey,
  AccountInfo,
  GetProgramAccountsFilter,
  Commitment
} from '@solana/web3.js';
import bs58 from 'bs58'; // Import bs58
import { rpcConnectionManager, RPCRequestOptions } from './connection-manager';
import { RequestPriority } from './rate-limiter';
import { registrySerializer } from '../solana/serialization';
import { DataTransformer } from '../transformers';
import { schemaValidator } from '../security/schema-validator';
import { contentSecurityValidator } from '../security/content-security';
import { cryptographicValidator } from '../security/cryptographic-validator';
import { AGENT_REGISTRY_PROGRAM_ID, MCP_SERVER_REGISTRY_PROGRAM_ID } from '../constants';
import {
  OnChainAgentEntry,
  OnChainMcpServerEntry,
  isOnChainAgentEntry,
  isOnChainMcpServerEntry
} from '../types/onchain-types';
import {
  UIAgentData,
  UIMcpServerData,
  PaginatedResult,
  PaginationOptions,
  AgentSearchParams,
  McpServerSearchParams
} from '../types/ui-types';
import {
  ValidationResult,
  UserFriendlyError,
  ErrorType,
  FallbackResult,
  DataOperation
} from '../types/validation-types';

/**
 * Registry fetch options
 */
export interface RegistryFetchOptions extends RPCRequestOptions {
  /** Whether to validate data integrity */
  validateData?: boolean;
  /** Whether to use cache if available */
  useCache?: boolean;
  /** Data freshness tolerance in milliseconds */
  freshnessThreshold?: number;
}

/**
 * Account fetch result
 */
interface AccountFetchResult<T> {
  /** Whether the fetch was successful */
  success: boolean;
  /** The fetched data (if successful) */
  data?: T;
  /** Error information (if failed) */
  error?: UserFriendlyError;
  /** Data source information */
  source: 'blockchain' | 'cache' | 'fallback';
  /** Validation results */
  validation?: ValidationResult;
}

/**
 * Registry RPC Service class
 * 
 * Provides methods for fetching and validating registry data from
 * the Solana blockchain with comprehensive error handling and fallbacks.
 */
export class RegistryRPCService {
  private cache: Map<string, { data: any; timestamp: number; ttl: number }> = new Map();
  private readonly defaultCacheTTL = 30000; // 30 seconds
  private readonly maxCacheSize = 1000;

  // ============================================================================
  // AGENT REGISTRY OPERATIONS
  // ============================================================================

  /**
   * Fetch all agent entries with pagination and filtering
   */
  async fetchAgents(
    searchParams: AgentSearchParams = {},
    pagination: PaginationOptions = {},
    options: RegistryFetchOptions = {}
  ): Promise<FallbackResult<PaginatedResult<UIAgentData>>> {
    const operation: DataOperation<PaginatedResult<UIAgentData>> = {
      cacheKey: `agents:${JSON.stringify({ searchParams, pagination })}`,
      getDefaultData: () => ({
        data: [],
        total: 0,
        hasMore: false,
        currentPage: 1,
        totalPages: 1
      }),
      timeout: options.timeout || 30000,
      retryConfig: options.retryConfig
    };

    return this.executeWithFallback(operation, async () => {
      // Get program accounts for agent registry
      const accounts = await this.fetchProgramAccounts(
        AGENT_REGISTRY_PROGRAM_ID,
        this.buildAgentFilters(searchParams),
        options
      );

      // Process and validate accounts
      const validAgents: UIAgentData[] = [];
      const errors: string[] = [];

      for (const account of accounts) {
        try {
          const result = await this.processAgentAccount(account, options);
          if (result.success && result.data) {
            validAgents.push(result.data);
          } else if (result.error) {
            errors.push(result.error.message);
          }
        } catch (error) {
          errors.push(`Failed to process agent account: ${(error as Error).message}`);
        }
      }

      // Apply additional filtering and sorting
      const filteredAgents = this.filterAndSortAgents(validAgents, searchParams);

      // Apply pagination
      const paginatedResult = this.paginateResults(filteredAgents, pagination);

      return {
        data: paginatedResult,
        source: 'blockchain' as const,
        confidence: errors.length === 0 ? 100 : Math.max(50, 100 - (errors.length * 10))
      };
    });
  }

  /**
   * Fetch single agent by ID
   */
  async fetchAgent(
    agentId: string,
    options: RegistryFetchOptions = {}
  ): Promise<FallbackResult<UIAgentData | null>> {
    const operation: DataOperation<UIAgentData | null> = {
      cacheKey: `agent:${agentId}`,
      getDefaultData: () => null,
      timeout: options.timeout || 15000,
      retryConfig: options.retryConfig
    };

    return this.executeWithFallback(operation, async () => {
      // Derive PDA for agent account
      const [agentPDA] = PublicKey.findProgramAddressSync(
        [Buffer.from('agent'), Buffer.from(agentId)],
        AGENT_REGISTRY_PROGRAM_ID
      );

      // Fetch account info
      const accountInfo = await this.fetchAccountInfo(agentPDA, options);
      if (!accountInfo) {
        return {
          data: null,
          source: 'blockchain' as const,
          confidence: 100
        };
      }

      // Process account
      const result = await this.processAgentAccount({
        pubkey: agentPDA,
        account: accountInfo
      }, options);

      if (result.success && result.data) {
        return {
          data: result.data,
          source: 'blockchain' as const,
          confidence: 100
        };
      }

      throw new Error(result.error?.message || 'Failed to process agent account');
    });
  }

  /**
   * Process individual agent account
   */
  private async processAgentAccount(
    account: { pubkey: PublicKey; account: AccountInfo<Buffer> },
    options: RegistryFetchOptions
  ): Promise<AccountFetchResult<UIAgentData>> {
    try {
      // Deserialize account data
      const deserializationResult = registrySerializer.safeDeserializeAgent(account.account.data);
      
      if (!deserializationResult.success) {
        return {
          success: false,
          error: {
            type: ErrorType.DESERIALIZATION_ERROR,
            message: deserializationResult.error || 'Failed to deserialize agent data',
            recoverable: false,
            technicalDetails: { account: account.pubkey.toBase58() }
          },
          source: 'blockchain'
        };
      }

      const onChainData = deserializationResult.data!;

      // Validate data if requested
      let validation: ValidationResult | undefined;
      if (options.validateData) {
        validation = await this.validateAgentData(onChainData);
        if (!validation.valid) {
          return {
            success: false,
            error: {
              type: ErrorType.VALIDATION_ERROR,
              message: validation.error || 'Data validation failed',
              recoverable: false,
              technicalDetails: validation.details
            },
            source: 'blockchain',
            validation
          };
        }
      }

      // Transform to UI format
      const uiData = DataTransformer.transformAgentEntry(onChainData);

      return {
        success: true,
        data: uiData,
        source: 'blockchain',
        validation
      };

    } catch (error) {
      return {
        success: false,
        error: {
          type: ErrorType.UNKNOWN_ERROR,
          message: 'Failed to process agent account',
          recoverable: true,
          technicalDetails: { 
            originalError: (error as Error).message,
            account: account.pubkey.toBase58()
          }
        },
        source: 'blockchain'
      };
    }
  }

  // ============================================================================
  // MCP SERVER REGISTRY OPERATIONS
  // ============================================================================

  /**
   * Fetch all MCP server entries with pagination and filtering
   */
  async fetchMcpServers(
    searchParams: McpServerSearchParams = {},
    pagination: PaginationOptions = {},
    options: RegistryFetchOptions = {}
  ): Promise<FallbackResult<PaginatedResult<UIMcpServerData>>> {
    const operation: DataOperation<PaginatedResult<UIMcpServerData>> = {
      cacheKey: `mcpServers:${JSON.stringify({ searchParams, pagination })}`,
      getDefaultData: () => ({
        data: [],
        total: 0,
        hasMore: false,
        currentPage: 1,
        totalPages: 1
      }),
      timeout: options.timeout || 30000,
      retryConfig: options.retryConfig
    };

    return this.executeWithFallback(operation, async () => {
      // Get program accounts for MCP server registry
      const accounts = await this.fetchProgramAccounts(
        MCP_SERVER_REGISTRY_PROGRAM_ID,
        this.buildMcpServerFilters(searchParams),
        options
      );

      // Process and validate accounts
      const validServers: UIMcpServerData[] = [];
      const errors: string[] = [];

      for (const account of accounts) {
        try {
          const result = await this.processMcpServerAccount(account, options);
          if (result.success && result.data) {
            validServers.push(result.data);
          } else if (result.error) {
            errors.push(result.error.message);
          }
        } catch (error) {
          errors.push(`Failed to process MCP server account: ${(error as Error).message}`);
        }
      }

      // Apply additional filtering and sorting
      const filteredServers = this.filterAndSortMcpServers(validServers, searchParams);

      // Apply pagination
      const paginatedResult = this.paginateResults(filteredServers, pagination);

      return {
        data: paginatedResult,
        source: 'blockchain' as const,
        confidence: errors.length === 0 ? 100 : Math.max(50, 100 - (errors.length * 10))
      };
    });
  }

  /**
   * Fetch single MCP server by ID
   */
  async fetchMcpServer(
    serverId: string,
    options: RegistryFetchOptions = {}
  ): Promise<FallbackResult<UIMcpServerData | null>> {
    const operation: DataOperation<UIMcpServerData | null> = {
      cacheKey: `mcpServer:${serverId}`,
      getDefaultData: () => null,
      timeout: options.timeout || 15000,
      retryConfig: options.retryConfig
    };

    return this.executeWithFallback(operation, async () => {
      // Derive PDA for MCP server account
      const [serverPDA] = PublicKey.findProgramAddressSync(
        [Buffer.from('mcp_server'), Buffer.from(serverId)],
        MCP_SERVER_REGISTRY_PROGRAM_ID
      );

      // Fetch account info
      const accountInfo = await this.fetchAccountInfo(serverPDA, options);
      if (!accountInfo) {
        return {
          data: null,
          source: 'blockchain' as const,
          confidence: 100
        };
      }

      // Process account
      const result = await this.processMcpServerAccount({
        pubkey: serverPDA,
        account: accountInfo
      }, options);

      if (result.success && result.data) {
        return {
          data: result.data,
          source: 'blockchain' as const,
          confidence: 100
        };
      }

      throw new Error(result.error?.message || 'Failed to process MCP server account');
    });
  }

  /**
   * Process individual MCP server account
   */
  private async processMcpServerAccount(
    account: { pubkey: PublicKey; account: AccountInfo<Buffer> },
    options: RegistryFetchOptions
  ): Promise<AccountFetchResult<UIMcpServerData>> {
    try {
      // Deserialize account data
      const deserializationResult = registrySerializer.safeDeserializeMcpServer(account.account.data);
      
      if (!deserializationResult.success) {
        return {
          success: false,
          error: {
            type: ErrorType.DESERIALIZATION_ERROR,
            message: deserializationResult.error || 'Failed to deserialize MCP server data',
            recoverable: false,
            technicalDetails: { account: account.pubkey.toBase58() }
          },
          source: 'blockchain'
        };
      }

      const onChainData = deserializationResult.data!;

      // Validate data if requested
      let validation: ValidationResult | undefined;
      if (options.validateData) {
        validation = await this.validateMcpServerData(onChainData);
        if (!validation.valid) {
          return {
            success: false,
            error: {
              type: ErrorType.VALIDATION_ERROR,
              message: validation.error || 'Data validation failed',
              recoverable: false,
              technicalDetails: validation.details
            },
            source: 'blockchain',
            validation
          };
        }
      }

      // Transform to UI format
      const uiData = DataTransformer.transformMcpServerEntry(onChainData);

      return {
        success: true,
        data: uiData,
        source: 'blockchain',
        validation
      };

    } catch (error) {
      return {
        success: false,
        error: {
          type: ErrorType.UNKNOWN_ERROR,
          message: 'Failed to process MCP server account',
          recoverable: true,
          technicalDetails: { 
            originalError: (error as Error).message,
            account: account.pubkey.toBase58()
          }
        },
        source: 'blockchain'
      };
    }
  }

  // ============================================================================
  // UTILITY METHODS
  // ============================================================================

  /**
   * Fetch account info with retry logic, rate limiting, and deduplication
   */
  private async fetchAccountInfo(
    pubkey: PublicKey,
    options: RegistryFetchOptions
  ): Promise<AccountInfo<Buffer> | null> {
    const rpcOptions: RPCRequestOptions = {
      ...options,
      priority: RequestPriority.HIGH, // Single account fetches are high priority
      method: 'getAccountInfo',
      params: [pubkey.toBase58(), { commitment: options.commitment || 'confirmed' }],
      enableDeduplication: true
    };

    return rpcConnectionManager.executeWithRetry(
      async (connection: Connection) => {
        return connection.getAccountInfo(pubkey, {
          commitment: options.commitment || 'confirmed'
        });
      },
      rpcOptions
    );
  }

  /**
   * Fetch program accounts with filtering, rate limiting, and deduplication
   */
  private async fetchProgramAccounts(
    programId: PublicKey,
    filters: GetProgramAccountsFilter[],
    options: RegistryFetchOptions
  ): Promise<Array<{ pubkey: PublicKey; account: AccountInfo<Buffer> }>> {
    const rpcOptions: RPCRequestOptions = {
      ...options,
      priority: RequestPriority.MEDIUM, // Program account fetches are medium priority
      method: 'getProgramAccounts',
      params: [
        programId.toBase58(),
        {
          filters,
          commitment: options.commitment || 'confirmed'
        }
      ],
      enableDeduplication: true
    };

    const result = await rpcConnectionManager.executeWithRetry(
      async (connection: Connection) => {
        return connection.getProgramAccounts(programId, {
          filters,
          commitment: options.commitment || 'confirmed'
        });
      },
      rpcOptions
    );
    
    // Create mutable copy to satisfy TypeScript
    return [...result];
  }

  /**
   * Execute operation with fallback handling
   */
  private async executeWithFallback<T>(
    operation: DataOperation<T>,
    primaryOperation: () => Promise<FallbackResult<T>>
  ): Promise<FallbackResult<T>> {
    try {
      // Check cache first
      const cached = this.getFromCache(operation.cacheKey);
      if (cached) {
        return {
          data: cached,
          source: 'cache-fresh',
          confidence: 90
        };
      }

      // Execute primary operation
      const result = await primaryOperation();
      
      // Cache the result if successful
      if (result.data) {
        this.setCache(operation.cacheKey, result.data);
      }
      
      return result;

    } catch (error) {
      console.error('Primary operation failed:', error);
      
      // Try stale cache
      const staleCache = this.getFromCache(operation.cacheKey, true);
      if (staleCache) {
        return {
          data: staleCache,
          source: 'cache-stale',
          confidence: 60,
          metadata: { 
            fallbackReason: 'Primary operation failed, using stale cache',
            originalError: (error as Error).message
          }
        };
      }

      // Return default data as last resort
      return {
        data: operation.getDefaultData(),
        source: 'default',
        confidence: 20,
        metadata: {
          fallbackReason: 'All operations failed, using default data',
          originalError: (error as Error).message
        }
      };
    }
  }

  // ============================================================================
  // FILTERING AND PAGINATION
  // ============================================================================

  /**
   * Build filters for agent search
   */
  private buildAgentFilters(searchParams: AgentSearchParams): GetProgramAccountsFilter[] {
    const filters: GetProgramAccountsFilter[] = [];
    
    // Add discriminator filter (first 8 bytes identify the account type)
    filters.push({
      memcmp: {
        offset: 0,
        bytes: bs58.encode(registrySerializer.getAccountDiscriminator('AgentRegistryEntryV1')) // Use bs58.encode
      }
    });

    // Add additional filters based on search parameters
    // Note: This is simplified - in practice you'd need to know the exact byte offsets
    // from your Rust struct layout to create effective filters
    
    return filters;
  }

  /**
   * Build filters for MCP server search
   */
  private buildMcpServerFilters(searchParams: McpServerSearchParams): GetProgramAccountsFilter[] {
    const filters: GetProgramAccountsFilter[] = [];
    
    // Add discriminator filter
    filters.push({
      memcmp: {
        offset: 0,
        bytes: bs58.encode(registrySerializer.getAccountDiscriminator('McpServerRegistryEntryV1')) // Use bs58.encode
      }
    });

    return filters;
  }

  /**
   * Filter and sort agents based on search parameters
   */
  private filterAndSortAgents(
    agents: UIAgentData[],
    searchParams: AgentSearchParams
  ): UIAgentData[] {
    let filtered = [...agents];

    // Apply text search
    if (searchParams.query) {
      const query = searchParams.query.toLowerCase();
      filtered = filtered.filter(agent =>
        agent.name.toLowerCase().includes(query) ||
        agent.description.toLowerCase().includes(query) ||
        agent.provider.toLowerCase().includes(query)
      );
    }

    // Apply status filter
    if (searchParams.status && searchParams.status.length > 0) {
      filtered = filtered.filter(agent =>
        searchParams.status!.includes(agent.status)
      );
    }

    // Apply capabilities filter
    if (searchParams.capabilities && searchParams.capabilities.length > 0) {
      filtered = filtered.filter(agent =>
        searchParams.capabilities!.some(cap =>
          agent.capabilities.includes(cap)
        )
      );
    }

    // Apply tags filter
    if (searchParams.tags && searchParams.tags.length > 0) {
      filtered = filtered.filter(agent =>
        searchParams.tags!.some(tag =>
          agent.tags.includes(tag)
        )
      );
    }

    // Apply trust score filter
    if (searchParams.minTrustScore !== undefined) {
      filtered = filtered.filter(agent =>
        (agent.trustScore || 0) >= searchParams.minTrustScore!
      );
    }

    // Apply sorting
    if (searchParams.sortBy) {
      filtered.sort((a, b) => {
        const sortOrder = searchParams.sortOrder === 'desc' ? -1 : 1;
        
        switch (searchParams.sortBy) {
          case 'name':
            return a.name.localeCompare(b.name) * sortOrder;
          case 'registrationDate':
            return (new Date(a.registrationDate).getTime() - new Date(b.registrationDate).getTime()) * sortOrder;
          case 'lastUpdate':
            return (new Date(a.lastUpdate).getTime() - new Date(b.lastUpdate).getTime()) * sortOrder;
          case 'rating':
            return ((a.rating || 0) - (b.rating || 0)) * sortOrder;
          case 'trustScore':
            return ((a.trustScore || 0) - (b.trustScore || 0)) * sortOrder;
          default:
            return 0;
        }
      });
    }

    return filtered;
  }

  /**
   * Filter and sort MCP servers based on search parameters
   */
  private filterAndSortMcpServers(
    servers: UIMcpServerData[],
    searchParams: McpServerSearchParams
  ): UIMcpServerData[] {
    let filtered = [...servers];

    // Apply text search
    if (searchParams.query) {
      const query = searchParams.query.toLowerCase();
      filtered = filtered.filter(server =>
        server.name.toLowerCase().includes(query) ||
        server.description.toLowerCase().includes(query) ||
        (server.provider && server.provider.toLowerCase().includes(query))
      );
    }

    // Apply status filter
    if (searchParams.status && searchParams.status.length > 0) {
      filtered = filtered.filter(server =>
        searchParams.status!.includes(server.status)
      );
    }

    // Apply capabilities filter
    if (searchParams.capabilities && searchParams.capabilities.length > 0) {
      filtered = filtered.filter(server => {
        const hasTools = searchParams.capabilities!.includes('tools') && server.capabilities.supportsTools;
        const hasResources = searchParams.capabilities!.includes('resources') && server.capabilities.supportsResources;
        const hasPrompts = searchParams.capabilities!.includes('prompts') && server.capabilities.supportsPrompts;
        return hasTools || hasResources || hasPrompts;
      });
    }

    // Apply tags filter
    if (searchParams.tags && searchParams.tags.length > 0) {
      filtered = filtered.filter(server =>
        searchParams.tags!.some(tag =>
          server.tags.includes(tag)
        )
      );
    }

    // Apply tools filter
    if (searchParams.tools && searchParams.tools.length > 0) {
      filtered = filtered.filter(server =>
        searchParams.tools!.some(tool =>
          server.tools.includes(tool)
        )
      );
    }

    // Apply trust score filter
    if (searchParams.minTrustScore !== undefined) {
      filtered = filtered.filter(server =>
        (server.trustScore || 0) >= searchParams.minTrustScore!
      );
    }

    // Apply sorting
    if (searchParams.sortBy) {
      filtered.sort((a, b) => {
        const sortOrder = searchParams.sortOrder === 'desc' ? -1 : 1;
        
        switch (searchParams.sortBy) {
          case 'name':
            return a.name.localeCompare(b.name) * sortOrder;
          case 'registrationDate':
            return (new Date(a.registrationDate).getTime() - new Date(b.registrationDate).getTime()) * sortOrder;
          case 'lastUpdate':
            return (new Date(a.lastUpdate).getTime() - new Date(b.lastUpdate).getTime()) * sortOrder;
          case 'rating':
            return ((a.rating || 0) - (b.rating || 0)) * sortOrder;
          case 'trustScore':
            return ((a.trustScore || 0) - (b.trustScore || 0)) * sortOrder;
          default:
            return 0;
        }
      });
    }

    return filtered;
  }

  /**
   * Paginate results
   */
  private paginateResults<T>(
    items: T[],
    pagination: PaginationOptions
  ): PaginatedResult<T> {
    const limit = pagination.limit || 20;
    const offset = pagination.offset || 0;
    
    const totalItems = items.length;
    const currentPage = Math.floor(offset / limit) + 1;
    const totalPages = Math.ceil(totalItems / limit);
    
    const paginatedItems = items.slice(offset, offset + limit);
    const hasMore = offset + limit < totalItems;
    const nextOffset = hasMore ? offset + limit : undefined;

    return {
      data: paginatedItems,
      total: totalItems,
      hasMore,
      nextOffset,
      currentPage,
      totalPages
    };
  }

  // ============================================================================
  // VALIDATION METHODS
  // ============================================================================

  /**
   * Validate agent data
   */
  private async validateAgentData(data: OnChainAgentEntry): Promise<ValidationResult> {
    // Schema validation
    const schemaValidation = schemaValidator.validateAgentEntry(data);
    if (!schemaValidation.valid) {
      return schemaValidation;
    }

    // Content security validation
    const contentValidation = contentSecurityValidator.validateFileContent(
      JSON.stringify(data),
      'json'
    );
    if (!contentValidation.valid) {
      return contentValidation;
    }

    // Cryptographic validation
    const securityValidation = await cryptographicValidator.performSecurityValidation(data, {
      authority: data.ownerAuthority,
      validateContent: true
    });

    return {
      valid: securityValidation.overall,
      error: securityValidation.overall ? undefined : 'Security validation failed',
      severity: securityValidation.riskLevel === 'CRITICAL' ? 'CRITICAL' : 'HIGH',
      details: {
        securityScore: securityValidation.securityScore,
        riskLevel: securityValidation.riskLevel,
        recommendations: securityValidation.recommendations
      }
    };
  }

  /**
   * Validate MCP server data
   */
  private async validateMcpServerData(data: OnChainMcpServerEntry): Promise<ValidationResult> {
    // Schema validation
    const schemaValidation = schemaValidator.validateMcpServerEntry(data);
    if (!schemaValidation.valid) {
      return schemaValidation;
    }

    // Content security validation
    const contentValidation = contentSecurityValidator.validateFileContent(
      JSON.stringify(data),
      'json'
    );
    if (!contentValidation.valid) {
      return contentValidation;
    }

    // Cryptographic validation
    const securityValidation = await cryptographicValidator.performSecurityValidation(data, {
      authority: data.ownerAuthority,
      validateContent: true
    });

    return {
      valid: securityValidation.overall,
      error: securityValidation.overall ? undefined : 'Security validation failed',
      severity: securityValidation.riskLevel === 'CRITICAL' ? 'CRITICAL' : 'HIGH',
      details: {
        securityScore: securityValidation.securityScore,
        riskLevel: securityValidation.riskLevel,
        recommendations: securityValidation.recommendations
      }
    };
  }

  // ============================================================================
  // CACHE MANAGEMENT
  // ============================================================================

  /**
   * Get data from cache
   */
  private getFromCache(key: string, allowStale: boolean = false): any | null {
    const entry = this.cache.get(key);
    if (!entry) return null;

    const now = Date.now();
    const isExpired = now > entry.timestamp + entry.ttl;

    if (isExpired && !allowStale) {
      this.cache.delete(key);
      return null;
    }

    return entry.data;
  }

  /**
   * Set data in cache
   */
  private setCache(key: string, data: any, ttl: number = this.defaultCacheTTL): void {
    // Implement cache size limit
    if (this.cache.size >= this.maxCacheSize) {
      // Remove oldest entries
      const entries = Array.from(this.cache.entries());
      entries.sort((a, b) => a[1].timestamp - b[1].timestamp);
      
      // Remove oldest 10% of entries
      const toRemove = Math.floor(this.maxCacheSize * 0.1);
      for (let i = 0; i < toRemove; i++) {
        this.cache.delete(entries[i][0]);
      }
    }

    this.cache.set(key, {
      data,
      timestamp: Date.now(),
      ttl
    });
  }

  /**
   * Clear cache
   */
  clearCache(): void {
    this.cache.clear();
  }

  /**
   * Get cache statistics
   */
  getCacheStats(): { size: number; maxSize: number; hitRatio?: number } {
    return {
      size: this.cache.size,
      maxSize: this.maxCacheSize
    };
  }
}

// Export singleton instance
export const registryRPCService = new RegistryRPCService();
