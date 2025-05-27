/**
 * Production Configuration for On-Chain Data Integration
 * 
 * Complete production deployment configuration including RPC endpoints,
 * performance optimization, caching strategies, and monitoring setup.
 */

import { Connection, Commitment } from '@solana/web3.js';

/**
 * Environment-specific configuration
 */
export interface EnvironmentConfig {
  /** Environment name */
  name: 'development' | 'staging' | 'production';
  /** Primary RPC endpoint */
  rpcEndpoint: string;
  /** Backup RPC endpoints for failover */
  backupEndpoints: string[];
  /** WebSocket endpoint for real-time updates */
  wsEndpoint: string;
  /** Program IDs for the deployed contracts */
  programIds: {
    agentRegistry: string;
    mcpServerRegistry: string;
  };
  /** Performance and caching configuration */
  performance: PerformanceConfig;
  /** Monitoring configuration */
  monitoring: MonitoringConfig;
}

/**
 * Performance optimization configuration
 */
export interface PerformanceConfig {
  /** Connection pool settings */
  connectionPool: {
    /** Maximum number of connections per endpoint */
    maxConnections: number;
    /** Connection timeout in milliseconds */
    timeoutMs: number;
    /** Keep-alive interval in milliseconds */
    keepAliveMs: number;
    /** Maximum retry attempts */
    maxRetries: number;
    /** Retry backoff multiplier */
    retryBackoffMs: number;
  };
  
  /** Caching configuration */
  cache: {
    /** Default TTL for cached data in milliseconds */
    defaultTtl: number;
    /** Maximum cache size in MB */
    maxSizeMb: number;
    /** Cache strategy */
    strategy: 'lru' | 'fifo' | 'lfu';
    /** Enable background refresh */
    backgroundRefresh: boolean;
    /** Stale while revalidate threshold */
    staleWhileRevalidate: number;
  };
  
  /** Virtual scrolling configuration */
  virtualScroll: {
    /** Default item height in pixels */
    itemHeight: number;
    /** Buffer size for rendering */
    bufferSize: number;
    /** Scroll threshold for loading more items */
    threshold: number;
    /** Maximum items to render at once */
    maxRendered: number;
  };
  
  /** Batch processing configuration */
  batching: {
    /** Maximum batch size for RPC requests */
    maxBatchSize: number;
    /** Batch timeout in milliseconds */
    batchTimeoutMs: number;
    /** Enable request deduplication */
    deduplication: boolean;
  };
}

/**
 * Monitoring and analytics configuration
 */
export interface MonitoringConfig {
  /** Performance monitoring settings */
  performance: {
    /** Enable performance monitoring */
    enabled: boolean;
    /** Sampling rate (0.0 to 1.0) */
    sampleRate: number;
    /** Performance alert thresholds */
    thresholds: {
      connectionLatency: number;
      rpcResponseTime: number;
      uiLoadTime: number;
      memoryUsage: number;
      errorRate: number;
    };
  };
  
  /** Error tracking settings */
  errorTracking: {
    /** Enable error tracking */
    enabled: boolean;
    /** Error reporting endpoint */
    endpoint?: string;
    /** Error sampling rate */
    sampleRate: number;
    /** Capture console errors */
    captureConsole: boolean;
  };
  
  /** Analytics settings */
  analytics: {
    /** Enable usage analytics */
    enabled: boolean;
    /** Analytics endpoint */
    endpoint?: string;
    /** Track user interactions */
    trackInteractions: boolean;
    /** Track performance metrics */
    trackPerformance: boolean;
  };
}

/**
 * Security configuration
 */
export interface SecurityConfig {
  /** Content Security Policy settings */
  csp: {
    /** Enable CSP */
    enabled: boolean;
    /** Report URI for CSP violations */
    reportUri?: string;
    /** Allowed script sources */
    scriptSrc: string[];
    /** Allowed style sources */
    styleSrc: string[];
    /** Allowed image sources */
    imgSrc: string[];
  };
  
  /** Data validation settings */
  validation: {
    /** Enable strict validation */
    strict: boolean;
    /** Maximum content length */
    maxContentLength: number;
    /** Allowed content types */
    allowedContentTypes: string[];
    /** Enable sanitization */
    sanitize: boolean;
  };
  
  /** Rate limiting */
  rateLimit: {
    /** Enable rate limiting */
    enabled: boolean;
    /** Requests per minute */
    requestsPerMinute: number;
    /** Burst limit */
    burstLimit: number;
  };
}

// ============================================================================
// ENVIRONMENT CONFIGURATIONS
// ============================================================================

/**
 * Development environment configuration
 */
export const developmentConfig: EnvironmentConfig = {
  name: 'development',
  rpcEndpoint: 'https://devnet.helius-rpc.com/?api-key=2eb1ae21-40d0-4b6d-adde-ccb3d56ad570',
  backupEndpoints: [
    'https://devnet.helius-rpc.com/?api-key=2eb1ae21-40d0-4b6d-adde-ccb3d56ad570',
  ],
  wsEndpoint: 'wss://solana-devnet.drpc.org',
  programIds: {
    agentRegistry: 'BruRLHGfNaf6C5HKUqFu6md5ePJNELafm1vZdhctPkpr',
    mcpServerRegistry: 'BCBVehUHR3yhbDbvhV3QHS3s27k3LTbpX5CrXQ2sR2SR'
  },
  performance: {
    connectionPool: {
      maxConnections: 3,
      timeoutMs: 10000,
      keepAliveMs: 30000,
      maxRetries: 2,
      retryBackoffMs: 1000
    },
    cache: {
      defaultTtl: 30000, // 30 seconds
      maxSizeMb: 50,
      strategy: 'lru',
      backgroundRefresh: true,
      staleWhileRevalidate: 10000
    },
    virtualScroll: {
      itemHeight: 120,
      bufferSize: 5,
      threshold: 0.8,
      maxRendered: 100
    },
    batching: {
      maxBatchSize: 10,
      batchTimeoutMs: 100,
      deduplication: true
    }
  },
  monitoring: {
    performance: {
      enabled: true,
      sampleRate: 1.0,
      thresholds: {
        connectionLatency: 2000,
        rpcResponseTime: 3000,
        uiLoadTime: 5000,
        memoryUsage: 200 * 1024 * 1024, // 200MB
        errorRate: 0.1
      }
    },
    errorTracking: {
      enabled: true,
      sampleRate: 1.0,
      captureConsole: true
    },
    analytics: {
      enabled: false,
      trackInteractions: true,
      trackPerformance: true
    }
  }
};

/**
 * Staging environment configuration
 */
export const stagingConfig: EnvironmentConfig = {
  name: 'staging',
  rpcEndpoint: 'https://api.devnet.solana.com',
  backupEndpoints: [
    'https://lb.drpc.org/ogrpc?network=solana-devnet&dkey=Asl_Au3ICkY_syI9tZ8Lf3j3AhbOOx8R8LMrbrRhIxXF',
  ],
  wsEndpoint: 'wss://solana-devnet.drpc.org',
  programIds: {
    agentRegistry: 'BruRLHGfNaf6C5HKUqFu6md5ePJNELafm1vZdhctPkpr',
    mcpServerRegistry: 'BCBVehUHR3yhbDbvhV3QHS3s27k3LTbpX5CrXQ2sR2SR'
  },
  performance: {
    connectionPool: {
      maxConnections: 4,
      timeoutMs: 8000,
      keepAliveMs: 30000,
      maxRetries: 3,
      retryBackoffMs: 1000
    },
    cache: {
      defaultTtl: 30000,
      maxSizeMb: 100,
      strategy: 'lru',
      backgroundRefresh: true,
      staleWhileRevalidate: 10000
    },
    virtualScroll: {
      itemHeight: 120,
      bufferSize: 8,
      threshold: 0.8,
      maxRendered: 500
    },
    batching: {
      maxBatchSize: 20,
      batchTimeoutMs: 50,
      deduplication: true
    }
  },
  monitoring: {
    performance: {
      enabled: true,
      sampleRate: 0.5,
      thresholds: {
        connectionLatency: 1500,
        rpcResponseTime: 2500,
        uiLoadTime: 4000,
        memoryUsage: 150 * 1024 * 1024,
        errorRate: 0.05
      }
    },
    errorTracking: {
      enabled: true,
      sampleRate: 1.0,
      captureConsole: true
    },
    analytics: {
      enabled: true,
      trackInteractions: true,
      trackPerformance: true
    }
  }
};

/**
 * Production environment configuration
 */
export const productionConfig: EnvironmentConfig = {
  name: 'production',
  rpcEndpoint: 'https://solana-mainnet.core.chainstack.com/263c9f53f4e4cdb897c0edc4a64cd007',
  backupEndpoints: [
    'https://solana-mainnet.core.chainstack.com/c488a8811c8e0c58a7b62e53e723f0c6',
    'https://solana-mainnet.core.chainstack.com/3bf1bc5d6e5232077dbee1a6a172c4e2',
    'https://rpc.ankr.com/solana'
  ],
  wsEndpoint: 'wss://solana-mainnet.core.chainstack.com/3bf1bc5d6e5232077dbee1a6a172c4e2',
  programIds: {
    agentRegistry: 'BruRLHGfNaf6C5HKUqFu6md5ePJNELafm1vZdhctPkpr',
    mcpServerRegistry: 'BCBVehUHR3yhbDbvhV3QHS3s27k3LTbpX5CrXQ2sR2SR'
  },
  performance: {
    connectionPool: {
      maxConnections: 5,
      timeoutMs: 5000,
      keepAliveMs: 30000,
      maxRetries: 3,
      retryBackoffMs: 1000
    },
    cache: {
      defaultTtl: 30000,
      maxSizeMb: 200,
      strategy: 'lru',
      backgroundRefresh: true,
      staleWhileRevalidate: 15000
    },
    virtualScroll: {
      itemHeight: 120,
      bufferSize: 10,
      threshold: 0.8,
      maxRendered: 1000
    },
    batching: {
      maxBatchSize: 50,
      batchTimeoutMs: 25,
      deduplication: true
    }
  },
  monitoring: {
    performance: {
      enabled: true,
      sampleRate: 0.1,
      thresholds: {
        connectionLatency: 1000,
        rpcResponseTime: 2000,
        uiLoadTime: 3000,
        memoryUsage: 100 * 1024 * 1024,
        errorRate: 0.01
      }
    },
    errorTracking: {
      enabled: false,
      endpoint: 'https://aeamcp.com/api/errors',
      sampleRate: 0.1,
      captureConsole: false
    },
    analytics: {
      enabled: false,
      endpoint: 'https://aeamcp.com/api/events',
      trackInteractions: true,
      trackPerformance: true
    }
  }
};

// ============================================================================
// CONFIGURATION UTILITIES
// ============================================================================

/**
 * Get configuration for current environment
 */
export function getEnvironmentConfig(): EnvironmentConfig {
  const env = process.env.NODE_ENV || 'development';
  const stage = process.env.NEXT_PUBLIC_STAGE || env;
  
  switch (stage) {
    case 'production':
      return productionConfig;
    case 'staging':
      return stagingConfig;
    case 'development':
    default:
      return developmentConfig;
  }
}

/**
 * Override configuration with environment variables
 */
export function applyEnvironmentOverrides(config: EnvironmentConfig): EnvironmentConfig {
  const overrides: Partial<EnvironmentConfig> = {};
  
  // RPC endpoint override
  if (process.env.NEXT_PUBLIC_RPC_ENDPOINT) {
    overrides.rpcEndpoint = process.env.NEXT_PUBLIC_RPC_ENDPOINT;
  }
  
  // WebSocket endpoint override
  if (process.env.NEXT_PUBLIC_WS_ENDPOINT) {
    overrides.wsEndpoint = process.env.NEXT_PUBLIC_WS_ENDPOINT;
  }
  
  // Program ID overrides
  if (process.env.NEXT_PUBLIC_AGENT_REGISTRY_PROGRAM_ID || process.env.NEXT_PUBLIC_MCP_SERVER_REGISTRY_PROGRAM_ID) {
    overrides.programIds = {
      agentRegistry: process.env.NEXT_PUBLIC_AGENT_REGISTRY_PROGRAM_ID || config.programIds.agentRegistry,
      mcpServerRegistry: process.env.NEXT_PUBLIC_MCP_SERVER_REGISTRY_PROGRAM_ID || config.programIds.mcpServerRegistry
    };
  }
  
  return { ...config, ...overrides };
}

/**
 * Validate configuration
 */
export function validateConfiguration(config: EnvironmentConfig): void {
  // Validate RPC endpoints
  if (!config.rpcEndpoint || !config.rpcEndpoint.startsWith('http')) {
    throw new Error('Invalid RPC endpoint configuration');
  }
  
  // Validate program IDs (should be base58 strings)
  const base58Regex = /^[1-9A-HJ-NP-Za-km-z]{32,44}$/;
  if (!base58Regex.test(config.programIds.agentRegistry)) {
    throw new Error('Invalid agent registry program ID');
  }
  if (!base58Regex.test(config.programIds.mcpServerRegistry)) {
    throw new Error('Invalid MCP server registry program ID');
  }
  
  // Validate performance settings
  if (config.performance.connectionPool.maxConnections < 1) {
    throw new Error('Connection pool must have at least 1 connection');
  }
  if (config.performance.cache.defaultTtl < 1000) {
    throw new Error('Cache TTL must be at least 1 second');
  }
  
  console.log(`✅ Configuration validated for ${config.name} environment`);
}

/**
 * Get optimized connection settings
 */
export function getConnectionSettings(config: EnvironmentConfig): {
  commitment: Commitment;
  confirmTransactionInitialTimeout: number;
  wsEndpointUrl: string;
  httpHeaders: Record<string, string>;
} {
  return {
    commitment: 'confirmed',
    confirmTransactionInitialTimeout: config.performance.connectionPool.timeoutMs,
    wsEndpointUrl: config.wsEndpoint,
    httpHeaders: {
      'Content-Type': 'application/json',
      'Cache-Control': 'no-cache'
    }
  };
}

/**
 * Export current configuration
 */
export const currentConfig = applyEnvironmentOverrides(getEnvironmentConfig());

// Validate configuration on load
validateConfiguration(currentConfig);

/**
 * Security configuration
 */
export const securityConfig: SecurityConfig = {
  csp: {
    enabled: true,
    scriptSrc: ["'self'", "'unsafe-inline'", 'https://cdn.jsdelivr.net'],
    styleSrc: ["'self'", "'unsafe-inline'"],
    imgSrc: ["'self'", 'data:', 'https:']
  },
  validation: {
    strict: true,
    maxContentLength: 10 * 1024 * 1024, // 10MB
    allowedContentTypes: ['application/json', 'text/plain'],
    sanitize: true
  },
  rateLimit: {
    enabled: currentConfig.name === 'production',
    requestsPerMinute: 100,
    burstLimit: 20
  }
};

/**
 * Feature flags configuration
 */
export const featureFlags = {
  /** Enable real-time updates */
  realTimeUpdates: true,
  /** Enable virtual scrolling */
  virtualScrolling: true,
  /** Enable advanced search */
  advancedSearch: true,
  /** Enable performance monitoring */
  performanceMonitoring: true,
  /** Enable transaction batching */
  transactionBatching: true,
  /** Enable offline support */
  offlineSupport: false,
  /** Enable experimental features */
  experimental: currentConfig.name !== 'production'
};

// All exports are already declared above

console.log(`🚀 Loaded ${currentConfig.name} configuration with ${currentConfig.performance.connectionPool.maxConnections} connections`);
