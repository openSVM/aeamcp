/**
 * RPC Connection Manager
 * 
 * Manages multiple RPC connections with automatic failover, load balancing,
 * connection pooling, and health monitoring for optimal blockchain connectivity.
 */

import { Connection, ConnectionConfig, Commitment } from '@solana/web3.js';
import { RetryConfig, UserFriendlyError, ErrorType } from '../types/validation-types';
import { rpcConfigurationManager } from './configuration-manager';
import { RPCEndpointConfig } from '../constants';
import { rpcRateLimiter, RequestPriority, RateLimiterStats } from './rate-limiter';
import { requestDeduplicator, createRPCRequestParams, DeduplicationStats } from './request-deduplicator';

/**
 * RPC endpoint configuration
 */
export interface RPCEndpoint {
  /** Endpoint URL */
  url: string;
  /** Endpoint priority (lower = higher priority) */
  priority: number;
  /** Maximum connections for this endpoint */
  maxConnections: number;
  /** Whether this endpoint is currently healthy */
  isHealthy: boolean;
  /** Last health check timestamp */
  lastHealthCheck: number;
  /** Response time in milliseconds */
  responseTime: number;
  /** Error count for this endpoint */
  errorCount: number;
  /** Connection configuration */
  config?: ConnectionConfig;
}

/**
 * Connection pool statistics
 */
export interface ConnectionPoolStats {
  /** Total active connections */
  activeConnections: number;
  /** Total failed connections */
  failedConnections: number;
  /** Average response time across all endpoints */
  averageResponseTime: number;
  /** Number of healthy endpoints */
  healthyEndpoints: number;
  /** Total number of endpoints */
  totalEndpoints: number;
  /** Current primary endpoint */
  primaryEndpoint?: string;
}

/**
 * RPC request options
 */
export interface RPCRequestOptions {
  /** Commitment level for the request */
  commitment?: Commitment;
  /** Request timeout in milliseconds */
  timeout?: number;
  /** Retry configuration */
  retryConfig?: RetryConfig;
  /** Whether to use cached connection if available */
  useCache?: boolean;
  /** Preferred endpoint URL */
  preferredEndpoint?: string;
  /** Request priority for rate limiting */
  priority?: RequestPriority;
  /** RPC method name for deduplication */
  method?: string;
  /** Request parameters for deduplication */
  params?: any[];
  /** Whether to enable request deduplication */
  enableDeduplication?: boolean;
}

/**
 * RPC Connection Manager class
 * 
 * Handles connection pooling, load balancing, health monitoring,
 * and automatic failover for Solana RPC endpoints.
 */
export class RPCConnectionManager {
  private endpoints: Map<string, RPCEndpoint> = new Map();
  private connections: Map<string, Connection[]> = new Map();
  private healthCheckInterval: NodeJS.Timeout | null = null;
  private healthCheckFrequency: number = 30000; // 30 seconds
  private maxRetries: number = 3;
  private baseDelay: number = 1000; // 1 second
  private maxDelay: number = 10000; // 10 seconds
  private currentPrimaryEndpoint: string | null = null;

  constructor() {
    this.initializeFromConfiguration();
    this.startHealthMonitoring();
  }

  // ============================================================================
  // CONFIGURATION INTEGRATION
  // ============================================================================

  /**
   * Initialize endpoints from centralized configuration
   */
  private initializeFromConfiguration(): void {
    try {
      // Get current network configuration
      const networkConfig = rpcConfigurationManager.getCurrentNetworkConfig();
      const timeoutSettings = rpcConfigurationManager.getTimeoutSettings();
      
      // Clear existing endpoints
      this.endpoints.clear();
      this.connections.clear();
      
      // Update instance settings from configuration
      this.maxRetries = timeoutSettings.maxRetries;
      this.healthCheckFrequency = timeoutSettings.healthCheckInterval;
      
      // Add all configured endpoints
      networkConfig.endpoints.forEach((endpointConfig: RPCEndpointConfig) => {
        const rpcEndpoint: RPCEndpoint = {
          url: endpointConfig.url,
          priority: endpointConfig.priority,
          maxConnections: endpointConfig.maxConnections,
          isHealthy: true,
          lastHealthCheck: 0,
          responseTime: 0,
          errorCount: 0,
          config: {
            commitment: networkConfig.commitment,
            confirmTransactionInitialTimeout: endpointConfig.timeout,
            wsEndpoint: endpointConfig.websocketUrl || this.getWebSocketEndpoint(endpointConfig.url)
          }
        };
        
        this.addEndpoint(rpcEndpoint);
      });
      
      console.log(`Initialized RPC Connection Manager with ${networkConfig.endpoints.length} endpoints for ${networkConfig.name}`);
      
    } catch (error) {
      console.error('Failed to initialize RPC endpoints from configuration:', error);
      
      // Fallback: add basic endpoint to prevent total failure
      this.addEndpoint({
        url: 'https://api.devnet.solana.com',
        priority: 1,
        maxConnections: 5,
        isHealthy: true,
        lastHealthCheck: 0,
        responseTime: 0,
        errorCount: 0
      });
    }
  }

  /**
   * Reload configuration and reinitialize endpoints
   */
  async reloadConfiguration(): Promise<void> {
    console.log('Reloading RPC configuration...');
    
    // Stop health monitoring temporarily
    this.stopHealthMonitoring();
    
    try {
      // Reinitialize from updated configuration
      this.initializeFromConfiguration();
      
      // Restart health monitoring
      this.startHealthMonitoring();
      
      // Perform immediate health check
      await this.forceHealthCheck();
      
      console.log('RPC configuration reloaded successfully');
    } catch (error) {
      console.error('Failed to reload RPC configuration:', error);
      
      // Restart health monitoring even if reload failed
      this.startHealthMonitoring();
      throw error;
    }
  }

  // ============================================================================
  // ENDPOINT MANAGEMENT
  // ============================================================================

  /**
   * Add RPC endpoint to the pool
   */
  addEndpoint(endpoint: RPCEndpoint): void {
    this.endpoints.set(endpoint.url, {
      ...endpoint,
      isHealthy: true,
      lastHealthCheck: 0,
      responseTime: 0,
      errorCount: 0
    });

    // Initialize connection pool for this endpoint
    this.connections.set(endpoint.url, []);

    // Update primary endpoint if this is the first or higher priority
    this.updatePrimaryEndpoint();
  }

  /**
   * Remove endpoint from the pool
   */
  removeEndpoint(url: string): void {
    // Close all connections for this endpoint
    const connections = this.connections.get(url);
    if (connections) {
      connections.forEach(conn => {
        // Note: Solana Connection doesn't have explicit close method
        // The connections will be garbage collected
      });
    }

    this.endpoints.delete(url);
    this.connections.delete(url);
    this.updatePrimaryEndpoint();
  }

  /**
   * Get list of all endpoints
   */
  getEndpoints(): RPCEndpoint[] {
    return Array.from(this.endpoints.values());
  }

  /**
   * Get healthy endpoints sorted by priority and response time
   */
  getHealthyEndpoints(): RPCEndpoint[] {
    return Array.from(this.endpoints.values())
      .filter(endpoint => endpoint.isHealthy)
      .sort((a, b) => {
        // Sort by priority first, then by response time
        if (a.priority !== b.priority) {
          return a.priority - b.priority;
        }
        return a.responseTime - b.responseTime;
      });
  }

  // ============================================================================
  // CONNECTION MANAGEMENT
  // ============================================================================

  /**
   * Get connection from the pool
   */
  async getConnection(options: RPCRequestOptions = {}): Promise<Connection> {
    const endpoint = await this.selectEndpoint(options);
    if (!endpoint) {
      throw new Error('No healthy RPC endpoints available');
    }

    return this.getConnectionForEndpoint(endpoint.url, endpoint.config);
  }

  /**
   * Get connection for specific endpoint
   */
  private async getConnectionForEndpoint(
    endpointUrl: string,
    config?: ConnectionConfig
  ): Promise<Connection> {
    const connections = this.connections.get(endpointUrl);
    const endpoint = this.endpoints.get(endpointUrl);
    
    if (!connections || !endpoint) {
      throw new Error(`Endpoint ${endpointUrl} not found`);
    }

    // Check if we have available connections
    if (connections.length < endpoint.maxConnections) {
      // Create new connection
      const connection = new Connection(endpointUrl, config || {
        commitment: 'confirmed',
        wsEndpoint: this.getWebSocketEndpoint(endpointUrl)
      });

      connections.push(connection);
      return connection;
    }

    // Return existing connection (round-robin)
    const connectionIndex = Math.floor(Math.random() * connections.length);
    return connections[connectionIndex];
  }

  /**
   * Select best endpoint based on health and performance
   */
  private async selectEndpoint(options: RPCRequestOptions): Promise<RPCEndpoint | null> {
    // Use preferred endpoint if specified and healthy
    if (options.preferredEndpoint) {
      const preferred = this.endpoints.get(options.preferredEndpoint);
      if (preferred?.isHealthy) {
        return preferred;
      }
    }

    // Get healthy endpoints
    const healthyEndpoints = this.getHealthyEndpoints();
    if (healthyEndpoints.length === 0) {
      return null;
    }

    // Return the best endpoint (already sorted by priority and response time)
    return healthyEndpoints[0];
  }

  /**
   * Get WebSocket endpoint URL from HTTP URL
   */
  private getWebSocketEndpoint(httpUrl: string): string {
    try {
      const url = new URL(httpUrl);
      url.protocol = url.protocol === 'https:' ? 'wss:' : 'ws:';
      return url.toString();
    } catch {
      // Fallback: simple replacement
      return httpUrl.replace(/^https?:/, httpUrl.startsWith('https:') ? 'wss:' : 'ws:');
    }
  }

  // ============================================================================
  // HEALTH MONITORING
  // ============================================================================

  /**
   * Start health monitoring for all endpoints
   */
  private startHealthMonitoring(): void {
    this.healthCheckInterval = setInterval(() => {
      this.performHealthChecks();
    }, this.healthCheckFrequency);
  }

  /**
   * Stop health monitoring
   */
  stopHealthMonitoring(): void {
    if (this.healthCheckInterval) {
      clearInterval(this.healthCheckInterval);
      this.healthCheckInterval = null;
    }
  }

  /**
   * Perform health checks on all endpoints
   */
  private async performHealthChecks(): Promise<void> {
    const promises = Array.from(this.endpoints.values()).map(endpoint =>
      this.checkEndpointHealth(endpoint)
    );

    await Promise.allSettled(promises);
    this.updatePrimaryEndpoint();
  }

  /**
   * Check health of a single endpoint
   */
  private async checkEndpointHealth(endpoint: RPCEndpoint): Promise<void> {
    const startTime = Date.now();
    
    try {
      // Create a temporary connection for health check
      const connection = new Connection(endpoint.url, {
        commitment: 'confirmed'
      });

      // Simple health check: get slot
      await Promise.race([
        connection.getSlot(),
        new Promise((_, reject) => 
          setTimeout(() => reject(new Error('Health check timeout')), 5000)
        )
      ]);

      // Health check successful
      const responseTime = Date.now() - startTime;
      endpoint.responseTime = responseTime;
      endpoint.isHealthy = true;
      endpoint.errorCount = Math.max(0, endpoint.errorCount - 1); // Reduce error count on success
      endpoint.lastHealthCheck = Date.now();

    } catch (error) {
      // Health check failed
      endpoint.errorCount += 1;
      endpoint.responseTime = Date.now() - startTime;
      endpoint.lastHealthCheck = Date.now();

      // Mark as unhealthy if too many consecutive errors
      if (endpoint.errorCount >= 3) {
        endpoint.isHealthy = false;
      }

      console.warn(`Health check failed for ${endpoint.url}:`, error);
    }
  }

  /**
   * Update primary endpoint based on health and priority
   */
  private updatePrimaryEndpoint(): void {
    const healthyEndpoints = this.getHealthyEndpoints();
    this.currentPrimaryEndpoint = healthyEndpoints.length > 0 
      ? healthyEndpoints[0].url 
      : null;
  }

  // ============================================================================
  // RETRY LOGIC
  // ============================================================================

  /**
   * Execute RPC request with retry logic, rate limiting, and deduplication
   */
  async executeWithRetry<T>(
    operation: (connection: Connection) => Promise<T>,
    options: RPCRequestOptions = {}
  ): Promise<T> {
    // Setup defaults
    const priority = options.priority || RequestPriority.MEDIUM;
    const enableDeduplication = options.enableDeduplication !== false; // Default to true
    const timeout = options.timeout || 30000;
    
    // Create request parameters for deduplication if enabled
    const requestParams = enableDeduplication && options.method ? 
      createRPCRequestParams(options.method, options.params || [], options.commitment) : 
      null;

    // Determine provider name for rate limiting
    const endpoint = await this.selectEndpoint(options);
    const providerName = endpoint ? this.getProviderName(endpoint.url) : 'unknown';

    // Execute with deduplication if enabled and parameters available
    if (enableDeduplication && requestParams) {
      return requestDeduplicator.executeWithDeduplication(
        requestParams,
        () => this.executeWithRateLimitAndRetry(operation, options, providerName, priority, timeout),
        timeout
      );
    }

    // Execute with rate limiting and retry logic
    return this.executeWithRateLimitAndRetry(operation, options, providerName, priority, timeout);
  }

  /**
   * Execute request with rate limiting and retry logic
   */
  private async executeWithRateLimitAndRetry<T>(
    operation: (connection: Connection) => Promise<T>,
    options: RPCRequestOptions,
    providerName: string,
    priority: RequestPriority,
    timeout: number
  ): Promise<T> {
    return rpcRateLimiter.executeWithRateLimit(
      providerName,
      () => this.executeWithRetryLogic(operation, options, timeout),
      priority,
      timeout
    );
  }

  /**
   * Execute request with basic retry logic
   */
  private async executeWithRetryLogic<T>(
    operation: (connection: Connection) => Promise<T>,
    options: RPCRequestOptions,
    timeout: number
  ): Promise<T> {
    const retryConfig = options.retryConfig || {
      maxRetries: this.maxRetries,
      initialDelay: this.baseDelay,
      maxDelay: this.maxDelay,
      backoffMultiplier: 2,
      jitter: true
    };

    let lastError: Error | null = null;
    let delay = retryConfig.initialDelay;

    for (let attempt = 0; attempt <= retryConfig.maxRetries; attempt++) {
      try {
        const connection = await this.getConnection(options);
        
        // Execute operation with timeout
        const result = await this.executeWithTimeout(
          operation(connection),
          timeout
        );

        return result;

      } catch (error) {
        lastError = error as Error;
        
        // Don't retry on the last attempt
        if (attempt === retryConfig.maxRetries) {
          break;
        }

        // Check if error is retryable
        if (!this.isRetryableError(error as Error)) {
          break;
        }

        // Wait before retrying
        await this.delay(delay, retryConfig.jitter);
        
        // Calculate next delay with backoff
        delay = Math.min(
          delay * retryConfig.backoffMultiplier,
          retryConfig.maxDelay
        );

        console.warn(`RPC request attempt ${attempt + 1} failed, retrying in ${delay}ms:`, error);
      }
    }

    // All retries failed, throw the last error
    throw this.createUserFriendlyError(lastError || new Error('RPC request failed'));
  }

  /**
   * Get provider name from endpoint URL for rate limiting
   */
  private getProviderName(url: string): string {
    try {
      const urlObj = new URL(url);
      const hostname = urlObj.hostname.toLowerCase();
      
      // Map known providers
      if (hostname.includes('solana.com')) return 'Solana Foundation';
      if (hostname.includes('drpc.')) return 'dRPC';
      if (hostname.includes('ankr.')) return 'Ankr';
      if (hostname.includes('helius.')) return 'Helius';
      if (hostname.includes('quicknode.')) return 'QuickNode';
      if (hostname.includes('alchemy.')) return 'Alchemy';
      
      // Default to hostname
      return hostname;
    } catch {
      return 'unknown';
    }
  }

  /**
   * Execute operation with timeout
   */
  private async executeWithTimeout<T>(
    promise: Promise<T>,
    timeoutMs: number
  ): Promise<T> {
    return Promise.race([
      promise,
      new Promise<never>((_, reject) =>
        setTimeout(() => reject(new Error('RPC request timeout')), timeoutMs)
      )
    ]);
  }

  /**
   * Check if error is retryable
   */
  private isRetryableError(error: Error): boolean {
    const retryableErrors = [
      'network',
      'timeout',
      'connection',
      'ECONNRESET',
      'ENOTFOUND',
      'ETIMEDOUT',
      'rate limit',
      '429',
      '502',
      '503',
      '504'
    ];

    const errorMessage = error.message.toLowerCase();
    return retryableErrors.some(pattern => errorMessage.includes(pattern));
  }

  /**
   * Delay execution with optional jitter
   */
  private async delay(ms: number, jitter: boolean = false): Promise<void> {
    const actualDelay = jitter 
      ? ms + Math.random() * ms * 0.1  // Add up to 10% jitter
      : ms;
    
    return new Promise(resolve => setTimeout(resolve, actualDelay));
  }

  /**
   * Create user-friendly error from RPC error
   */
  private createUserFriendlyError(error: Error): UserFriendlyError {
    const message = error.message.toLowerCase();
    
    if (message.includes('timeout')) {
      return {
        type: ErrorType.RPC_TIMEOUT,
        message: 'Request timed out. Please try again.',
        suggestion: 'Check your internet connection and try again.',
        recoverable: true,
        technicalDetails: { originalError: error.message }
      };
    }
    
    if (message.includes('network') || message.includes('connection')) {
      return {
        type: ErrorType.NETWORK_ERROR,
        message: 'Network connection failed.',
        suggestion: 'Check your internet connection and try again.',
        recoverable: true,
        technicalDetails: { originalError: error.message }
      };
    }
    
    if (message.includes('rate limit') || message.includes('429')) {
      return {
        type: ErrorType.RATE_LIMIT_EXCEEDED,
        message: 'Too many requests. Please wait a moment.',
        suggestion: 'Wait a few seconds before trying again.',
        recoverable: true,
        technicalDetails: { originalError: error.message }
      };
    }
    
    return {
      type: ErrorType.UNKNOWN_ERROR,
      message: 'An unexpected error occurred.',
      suggestion: 'Please try again or contact support if the problem persists.',
      recoverable: true,
      technicalDetails: { originalError: error.message }
    };
  }

  // ============================================================================
  // STATISTICS AND MONITORING
  // ============================================================================

  /**
   * Get connection pool statistics
   */
  getStats(): ConnectionPoolStats {
    const endpoints = Array.from(this.endpoints.values());
    const totalConnections = Array.from(this.connections.values())
      .reduce((sum, connections) => sum + connections.length, 0);
    
    const healthyEndpoints = endpoints.filter(ep => ep.isHealthy);
    const averageResponseTime = healthyEndpoints.length > 0
      ? healthyEndpoints.reduce((sum, ep) => sum + ep.responseTime, 0) / healthyEndpoints.length
      : 0;
    
    const failedConnections = endpoints.reduce((sum, ep) => sum + ep.errorCount, 0);

    return {
      activeConnections: totalConnections,
      failedConnections,
      averageResponseTime,
      healthyEndpoints: healthyEndpoints.length,
      totalEndpoints: endpoints.length,
      primaryEndpoint: this.currentPrimaryEndpoint || undefined
    };
  }

  /**
   * Reset statistics
   */
  resetStats(): void {
    this.endpoints.forEach(endpoint => {
      endpoint.errorCount = 0;
      endpoint.responseTime = 0;
    });
  }

  /**
   * Get current primary endpoint
   */
  getPrimaryEndpoint(): string | null {
    return this.currentPrimaryEndpoint;
  }

  /**
   * Force health check on all endpoints
   */
  async forceHealthCheck(): Promise<void> {
    await this.performHealthChecks();
  }

  /**
   * Cleanup resources
   */
  destroy(): void {
    this.stopHealthMonitoring();
    this.connections.clear();
    this.endpoints.clear();
  }
}

// Export singleton instance (endpoints loaded from centralized configuration)
export const rpcConnectionManager = new RPCConnectionManager();
