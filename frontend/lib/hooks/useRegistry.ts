/**
 * Registry Data Hooks
 * 
 * React hooks for fetching and managing agent and MCP server registry data
 * with real-time updates, caching, and state management.
 */

import { useQuery, useQueryClient, UseQueryResult } from '@tanstack/react-query';
import { useState, useEffect, useCallback, useRef } from 'react';
import { PublicKey } from '@solana/web3.js';
import { registryRPCService } from '../rpc/registry-service';
import { webSocketManager } from '../realtime/websocket-manager';
import { AGENT_REGISTRY_PROGRAM_ID, MCP_SERVER_REGISTRY_PROGRAM_ID } from '../constants';
import {
  UIAgentData,
  UIMcpServerData,
  PaginatedResult,
  PaginationOptions,
  AgentSearchParams,
  McpServerSearchParams,
  LoadingState,
  ErrorState,
  DataFreshness
} from '../types/ui-types';
import {
  FallbackResult,
  UserFriendlyError,
  ErrorType
} from '../types/validation-types';

/**
 * Hook options for registry data fetching
 */
export interface UseRegistryOptions {
  /** Enable real-time updates */
  realtime?: boolean;
  /** Cache time in milliseconds */
  cacheTime?: number;
  /** Stale time in milliseconds */
  staleTime?: number;
  /** Enable automatic refetching */
  refetchOnWindowFocus?: boolean;
  /** Retry count for failed requests */
  retry?: number;
  /** Enable data validation */
  validateData?: boolean;
}

/**
 * Registry hook return type
 */
export interface UseRegistryResult<T> {
  /** The fetched data */
  data: T | undefined;
  /** Loading state information */
  loading: LoadingState;
  /** Error state information */
  error: ErrorState;
  /** Data freshness information */
  freshness: DataFreshness;
  /** Refetch function */
  refetch: () => Promise<void>;
  /** Invalidate cache function */
  invalidate: () => Promise<void>;
  /** Whether data is from cache */
  isFromCache: boolean;
  /** Connection quality (0-100) */
  connectionQuality: number;
}

/**
 * Default hook options
 */
const defaultOptions: UseRegistryOptions = {
  realtime: false,
  cacheTime: 5 * 60 * 1000, // 5 minutes
  staleTime: 30 * 1000, // 30 seconds
  refetchOnWindowFocus: false,
  retry: 3,
  validateData: true
};

/**
 * Hook for fetching paginated agents list
 */
export function useAgents(
  searchParams: AgentSearchParams = {},
  pagination: PaginationOptions = {},
  options: UseRegistryOptions = {}
): UseRegistryResult<PaginatedResult<UIAgentData>> {
  const opts = { ...defaultOptions, ...options };
  const queryClient = useQueryClient();
  const [freshness, setFreshness] = useState<DataFreshness>({
    lastFetched: 0,
    isStale: false,
    source: 'blockchain',
    confidence: 100
  });

  // Generate cache key
  const cacheKey = ['agents', searchParams, pagination];

  // React Query for data fetching
  const queryResult = useQuery({
    queryKey: cacheKey,
    queryFn: async (): Promise<PaginatedResult<UIAgentData>> => {
      const result = await registryRPCService.fetchAgents(
        searchParams,
        pagination,
        { validateData: opts.validateData }
      );
      
      setFreshness({
        lastFetched: Date.now(),
        isStale: false,
        source: result.source === 'blockchain' ? 'blockchain' : result.source.includes('cache') ? 'cache' : 'fallback',
        confidence: result.confidence
      });
      
      return result.data;
    },
    staleTime: opts.staleTime,
    gcTime: opts.cacheTime,
    refetchOnWindowFocus: opts.refetchOnWindowFocus,
    retry: opts.retry
  });

  // Real-time subscription setup
  useEffect(() => {
    if (!opts.realtime || !webSocketManager.isConnected()) {
      return;
    }

    let subscriptionId: string | null = null;

    const setupRealtimeSubscription = async () => {
      try {
        // Subscribe to agent registry program changes
        subscriptionId = await webSocketManager.subscribeToProgramAccounts(
          AGENT_REGISTRY_PROGRAM_ID,
          (accountInfo) => {
            // Invalidate and refetch when program accounts change
            queryClient.invalidateQueries({ queryKey: ['agents'] });
            setFreshness(prev => ({ ...prev, isStale: true }));
          },
          'confirmed'
        );
      } catch (error) {
        console.error('Failed to setup real-time subscription for agents:', error);
      }
    };

    setupRealtimeSubscription();

    return () => {
      if (subscriptionId) {
        webSocketManager.unsubscribe(subscriptionId);
      }
    };
  }, [opts.realtime, queryClient]);

  return useRegistryHookResult(queryResult, freshness, cacheKey, queryClient);
}

/**
 * Hook for fetching single agent by ID
 */
export function useAgent(
  agentId: string | null,
  options: UseRegistryOptions = {}
): UseRegistryResult<UIAgentData | null> {
  const opts = { ...defaultOptions, ...options };
  const queryClient = useQueryClient();
  const [freshness, setFreshness] = useState<DataFreshness>({
    lastFetched: 0,
    isStale: false,
    source: 'blockchain',
    confidence: 100
  });

  const cacheKey = ['agent', agentId];

  const queryResult = useQuery({
    queryKey: cacheKey,
    queryFn: async (): Promise<UIAgentData | null> => {
      if (!agentId) return null;
      
      const result = await registryRPCService.fetchAgent(
        agentId,
        { validateData: opts.validateData }
      );
      
      setFreshness({
        lastFetched: Date.now(),
        isStale: false,
        source: result.source === 'blockchain' ? 'blockchain' : result.source.includes('cache') ? 'cache' : 'fallback',
        confidence: result.confidence
      });
      
      return result.data;
    },
    enabled: !!agentId,
    staleTime: opts.staleTime,
    gcTime: opts.cacheTime,
    refetchOnWindowFocus: opts.refetchOnWindowFocus,
    retry: opts.retry
  });

  // Real-time subscription for specific agent
  useEffect(() => {
    if (!opts.realtime || !agentId || !webSocketManager.isConnected()) {
      return;
    }

    let subscriptionId: string | null = null;

    const setupRealtimeSubscription = async () => {
      try {
        // Derive agent account PDA
        const [agentPDA] = PublicKey.findProgramAddressSync(
          [Buffer.from('agent'), Buffer.from(agentId)],
          AGENT_REGISTRY_PROGRAM_ID
        );
        
        subscriptionId = await webSocketManager.subscribeToAccount(
          agentPDA,
          (accountInfo) => {
            // Invalidate specific agent query
            queryClient.invalidateQueries({ queryKey: cacheKey });
            setFreshness(prev => ({ ...prev, isStale: true }));
          },
          'confirmed'
        );
      } catch (error) {
        console.error(`Failed to setup real-time subscription for agent ${agentId}:`, error);
      }
    };

    setupRealtimeSubscription();

    return () => {
      if (subscriptionId) {
        webSocketManager.unsubscribe(subscriptionId);
      }
    };
  }, [opts.realtime, agentId, queryClient, cacheKey]);

  return useRegistryHookResult(queryResult, freshness, cacheKey, queryClient);
}

/**
 * Hook for fetching paginated MCP servers list
 */
export function useMcpServers(
  searchParams: McpServerSearchParams = {},
  pagination: PaginationOptions = {},
  options: UseRegistryOptions = {}
): UseRegistryResult<PaginatedResult<UIMcpServerData>> {
  const opts = { ...defaultOptions, ...options };
  const queryClient = useQueryClient();
  const [freshness, setFreshness] = useState<DataFreshness>({
    lastFetched: 0,
    isStale: false,
    source: 'blockchain',
    confidence: 100
  });

  const cacheKey = ['mcpServers', searchParams, pagination];

  const queryResult = useQuery({
    queryKey: cacheKey,
    queryFn: async (): Promise<PaginatedResult<UIMcpServerData>> => {
      const result = await registryRPCService.fetchMcpServers(
        searchParams,
        pagination,
        { validateData: opts.validateData }
      );
      
      setFreshness({
        lastFetched: Date.now(),
        isStale: false,
        source: result.source === 'blockchain' ? 'blockchain' : result.source.includes('cache') ? 'cache' : 'fallback',
        confidence: result.confidence
      });
      
      return result.data;
    },
    staleTime: opts.staleTime,
    gcTime: opts.cacheTime,
    refetchOnWindowFocus: opts.refetchOnWindowFocus,
    retry: opts.retry
  });

  // Real-time subscription setup
  useEffect(() => {
    if (!opts.realtime || !webSocketManager.isConnected()) {
      return;
    }

    let subscriptionId: string | null = null;

    const setupRealtimeSubscription = async () => {
      try {
        subscriptionId = await webSocketManager.subscribeToProgramAccounts(
          MCP_SERVER_REGISTRY_PROGRAM_ID,
          (accountInfo) => {
            queryClient.invalidateQueries({ queryKey: ['mcpServers'] });
            setFreshness(prev => ({ ...prev, isStale: true }));
          },
          'confirmed'
        );
      } catch (error) {
        console.error('Failed to setup real-time subscription for MCP servers:', error);
      }
    };

    setupRealtimeSubscription();

    return () => {
      if (subscriptionId) {
        webSocketManager.unsubscribe(subscriptionId);
      }
    };
  }, [opts.realtime, queryClient]);

  return useRegistryHookResult(queryResult, freshness, cacheKey, queryClient);
}

/**
 * Hook for fetching single MCP server by ID
 */
export function useMcpServer(
  serverId: string | null,
  options: UseRegistryOptions = {}
): UseRegistryResult<UIMcpServerData | null> {
  const opts = { ...defaultOptions, ...options };
  const queryClient = useQueryClient();
  const [freshness, setFreshness] = useState<DataFreshness>({
    lastFetched: 0,
    isStale: false,
    source: 'blockchain',
    confidence: 100
  });

  const cacheKey = ['mcpServer', serverId];

  const queryResult = useQuery({
    queryKey: cacheKey,
    queryFn: async (): Promise<UIMcpServerData | null> => {
      if (!serverId) return null;
      
      const result = await registryRPCService.fetchMcpServer(
        serverId,
        { validateData: opts.validateData }
      );
      
      setFreshness({
        lastFetched: Date.now(),
        isStale: false,
        source: result.source === 'blockchain' ? 'blockchain' : result.source.includes('cache') ? 'cache' : 'fallback',
        confidence: result.confidence
      });
      
      return result.data;
    },
    enabled: !!serverId,
    staleTime: opts.staleTime,
    gcTime: opts.cacheTime,
    refetchOnWindowFocus: opts.refetchOnWindowFocus,
    retry: opts.retry
  });

  // Real-time subscription for specific MCP server
  useEffect(() => {
    if (!opts.realtime || !serverId || !webSocketManager.isConnected()) {
      return;
    }

    let subscriptionId: string | null = null;

    const setupRealtimeSubscription = async () => {
      try {
        const [serverPDA] = PublicKey.findProgramAddressSync(
          [Buffer.from('mcp_server'), Buffer.from(serverId)],
          MCP_SERVER_REGISTRY_PROGRAM_ID
        );
        
        subscriptionId = await webSocketManager.subscribeToAccount(
          serverPDA,
          (accountInfo) => {
            queryClient.invalidateQueries({ queryKey: cacheKey });
            setFreshness(prev => ({ ...prev, isStale: true }));
          },
          'confirmed'
        );
      } catch (error) {
        console.error(`Failed to setup real-time subscription for MCP server ${serverId}:`, error);
      }
    };

    setupRealtimeSubscription();

    return () => {
      if (subscriptionId) {
        webSocketManager.unsubscribe(subscriptionId);
      }
    };
  }, [opts.realtime, serverId, queryClient, cacheKey]);

  return useRegistryHookResult(queryResult, freshness, cacheKey, queryClient);
}

/**
 * Hook for WebSocket connection status
 */
export function useWebSocketStatus() {
  const [connectionState, setConnectionState] = useState(webSocketManager.getConnectionState());
  const [subscriptionCount, setSubscriptionCount] = useState(
    webSocketManager.getActiveSubscriptionsCount()
  );

  useEffect(() => {
    const updateConnectionState = () => {
      setConnectionState(webSocketManager.getConnectionState());
      setSubscriptionCount(webSocketManager.getActiveSubscriptionsCount());
    };

    // Listen for connection events
    webSocketManager.on('connected', updateConnectionState);
    webSocketManager.on('disconnected', updateConnectionState);
    webSocketManager.on('error', updateConnectionState);

    // Update state periodically
    const interval = setInterval(updateConnectionState, 5000);

    return () => {
      webSocketManager.off('connected', updateConnectionState);
      webSocketManager.off('disconnected', updateConnectionState);
      webSocketManager.off('error', updateConnectionState);
      clearInterval(interval);
    };
  }, []);

  return {
    ...connectionState,
    subscriptionCount,
    reconnect: () => webSocketManager.reconnect(),
    forceHealthCheck: () => webSocketManager.forceHealthCheck()
  };
}

/**
 * Common hook result formatting
 */
function useRegistryHookResult<T>(
  queryResult: UseQueryResult<T>,
  freshness: DataFreshness,
  cacheKey: any[],
  queryClient: any
): UseRegistryResult<T> {
  const { data, isLoading, error, refetch, isError, isFetching } = queryResult;

  // Transform loading state
  const loading: LoadingState = {
    isLoading: isLoading || isFetching,
    loadingType: isLoading ? 'initial' : isFetching ? 'refresh' : undefined,
    message: isLoading ? 'Loading data...' : isFetching ? 'Refreshing...' : undefined
  };

  // Transform error state
  const errorState: ErrorState = {
    hasError: isError,
    message: error instanceof Error ? error.message : undefined,
    type: error instanceof Error ? getErrorType(error) : undefined,
    recoverable: error instanceof Error ? isRecoverableError(error) : false,
    timestamp: error ? Date.now() : undefined
  };

  // Get connection quality
  const connectionQuality = webSocketManager.getConnectionState().connectionQuality;

  const refetchData = useCallback(async () => {
    await refetch();
  }, [refetch]);

  const invalidateData = useCallback(async () => {
    await queryClient.invalidateQueries({ queryKey: cacheKey });
  }, [queryClient, cacheKey]);

  return {
    data,
    loading,
    error: errorState,
    freshness,
    refetch: refetchData,
    invalidate: invalidateData,
    isFromCache: freshness.source.includes('cache'),
    connectionQuality
  };
}

/**
 * Determine error type from error instance
 */
function getErrorType(error: Error): 'network' | 'blockchain' | 'validation' | 'permission' | 'unknown' {
  const message = error.message.toLowerCase();
  
  if (message.includes('network') || message.includes('connection') || message.includes('timeout')) {
    return 'network';
  }
  if (message.includes('account') || message.includes('blockchain') || message.includes('rpc')) {
    return 'blockchain';
  }
  if (message.includes('validation') || message.includes('schema') || message.includes('invalid')) {
    return 'validation';
  }
  if (message.includes('permission') || message.includes('unauthorized') || message.includes('forbidden')) {
    return 'permission';
  }
  
  return 'unknown';
}

/**
 * Check if error is recoverable
 */
function isRecoverableError(error: Error): boolean {
  const recoverableTypes = [
    'network',
    'timeout',
    'connection',
    'rate limit'
  ];
  
  const message = error.message.toLowerCase();
  return recoverableTypes.some(type => message.includes(type));
}
