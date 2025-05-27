/**
 * RPC Configuration Manager
 * 
 * Centralized configuration management for Solana RPC endpoints with
 * environment-based network selection, endpoint validation, and
 * configuration hot-swapping capabilities.
 */

import { Commitment } from '@solana/web3.js';
import { 
  NETWORK_CONFIGS, 
  NetworkConfig, 
  RPCEndpointConfig,
  SOLANA_NETWORK 
} from '../constants';
import { ValidationResult, ErrorType } from '../types/validation-types';

/**
 * Configuration validation result
 */
export interface ConfigValidationResult extends ValidationResult {
  /** Configuration warnings */
  warnings?: string[];
  /** Missing environment variables */
  missingEnvVars?: string[];
  /** Invalid endpoint URLs */
  invalidEndpoints?: string[];
}

/**
 * Network switching options
 */
export interface NetworkSwitchOptions {
  /** Validate endpoints before switching */
  validateEndpoints?: boolean;
  /** Force switch even if validation fails */
  force?: boolean;
  /** Timeout for endpoint validation */
  validationTimeout?: number;
}

/**
 * Configuration statistics
 */
export interface ConfigurationStats {
  /** Current network name */
  currentNetwork: string;
  /** Total number of configured endpoints */
  totalEndpoints: number;
  /** Number of healthy endpoints */
  healthyEndpoints: number;
  /** Average expected response time */
  averageResponseTime: number;
  /** Configuration last updated timestamp */
  lastUpdated: number;
  /** Whether configuration is valid */
  isValid: boolean;
}

/**
 * RPC Configuration Manager class
 * 
 * Provides centralized access to RPC configuration with environment
 * variable support, validation, and hot-swapping capabilities.
 */
export class RPCConfigurationManager {
  private currentNetwork: string;
  private configCache: Map<string, NetworkConfig> = new Map();
  private lastValidation: ConfigValidationResult | null = null;
  private configLastUpdated: number = Date.now();

  constructor() {
    this.currentNetwork = this.determineCurrentNetwork();
    this.initializeConfiguration();
  }

  // ============================================================================
  // NETWORK MANAGEMENT
  // ============================================================================

  /**
   * Get current network name
   */
  getCurrentNetwork(): string {
    return this.currentNetwork;
  }

  /**
   * Get configuration for current network
   */
  getCurrentNetworkConfig(): NetworkConfig {
    return this.getNetworkConfig(this.currentNetwork);
  }

  /**
   * Get configuration for specific network
   */
  getNetworkConfig(network?: string): NetworkConfig {
    const targetNetwork = network || this.currentNetwork;
    
    // Check cache first
    if (this.configCache.has(targetNetwork)) {
      return this.configCache.get(targetNetwork)!;
    }

    // Get from constants
    const config = NETWORK_CONFIGS[targetNetwork];
    if (!config) {
      throw new Error(`Network configuration not found for: ${targetNetwork}`);
    }

    // Apply environment variable overrides
    const enhancedConfig = this.applyEnvironmentOverrides(config);
    
    // Cache the result
    this.configCache.set(targetNetwork, enhancedConfig);
    
    return enhancedConfig;
  }

  /**
   * Switch to different network
   */
  async switchNetwork(
    network: string, 
    options: NetworkSwitchOptions = {}
  ): Promise<void> {
    const opts = {
      validateEndpoints: true,
      force: false,
      validationTimeout: 10000,
      ...options
    };

    // Validate network exists
    if (!NETWORK_CONFIGS[network]) {
      throw new Error(`Unknown network: ${network}`);
    }

    // Validate endpoints if requested
    if (opts.validateEndpoints && !opts.force) {
      const validation = await this.validateNetworkEndpoints(network, opts.validationTimeout);
      if (!validation.valid && validation.severity === 'CRITICAL') {
        throw new Error(`Network validation failed: ${validation.error}`);
      }
    }

    const previousNetwork = this.currentNetwork;
    this.currentNetwork = network;
    
    // Clear cache to force reload
    this.configCache.delete(network);
    
    try {
      // Test the new configuration
      this.getNetworkConfig(network);
      this.configLastUpdated = Date.now();
      
      console.log(`Switched network from ${previousNetwork} to ${network}`);
    } catch (error) {
      // Rollback on failure
      this.currentNetwork = previousNetwork;
      throw new Error(`Failed to switch to network ${network}: ${(error as Error).message}`);
    }
  }

  /**
   * Get list of available networks
   */
  getAvailableNetworks(): string[] {
    return Object.keys(NETWORK_CONFIGS);
  }

  // ============================================================================
  // ENDPOINT MANAGEMENT
  // ============================================================================

  /**
   * Get primary endpoint for current network
   */
  getPrimaryEndpoint(network?: string): RPCEndpointConfig {
    const config = this.getNetworkConfig(network);
    const sortedEndpoints = this.getSortedEndpoints(config.endpoints);
    
    if (sortedEndpoints.length === 0) {
      throw new Error(`No endpoints configured for network: ${network || this.currentNetwork}`);
    }
    
    return sortedEndpoints[0];
  }

  /**
   * Get all endpoints for network sorted by priority
   */
  getAllEndpoints(network?: string): RPCEndpointConfig[] {
    const config = this.getNetworkConfig(network);
    return this.getSortedEndpoints(config.endpoints);
  }

  /**
   * Get WebSocket endpoint URL
   */
  getWebSocketEndpoint(network?: string): string {
    const primaryEndpoint = this.getPrimaryEndpoint(network);
    
    if (primaryEndpoint.websocketUrl) {
      return primaryEndpoint.websocketUrl;
    }
    
    // Convert HTTP URL to WebSocket URL
    return this.convertToWebSocketUrl(primaryEndpoint.url);
  }

  /**
   * Get endpoints by provider
   */
  getEndpointsByProvider(provider: string, network?: string): RPCEndpointConfig[] {
    const endpoints = this.getAllEndpoints(network);
    return endpoints.filter(endpoint => 
      endpoint.provider.toLowerCase().includes(provider.toLowerCase())
    );
  }

  /**
   * Get endpoints by region
   */
  getEndpointsByRegion(region: string, network?: string): RPCEndpointConfig[] {
    const endpoints = this.getAllEndpoints(network);
    return endpoints.filter(endpoint => 
      endpoint.region?.toLowerCase().includes(region.toLowerCase())
    );
  }

  // ============================================================================
  // CONFIGURATION UTILITIES
  // ============================================================================

  /**
   * Get network commitment level
   */
  getCommitment(network?: string): Commitment {
    const config = this.getNetworkConfig(network);
    return config.commitment;
  }

  /**
   * Get network timeout settings
   */
  getTimeoutSettings(network?: string) {
    const config = this.getNetworkConfig(network);
    return {
      defaultTimeout: config.defaultTimeout,
      maxRetries: config.maxRetries,
      healthCheckInterval: config.healthCheckInterval
    };
  }

  /**
   * Check if network is production
   */
  isProductionNetwork(network?: string): boolean {
    const config = this.getNetworkConfig(network);
    return config.isProduction;
  }

  /**
   * Get configuration for specific endpoint
   */
  getEndpointConfig(url: string, network?: string): RPCEndpointConfig | null {
    const endpoints = this.getAllEndpoints(network);
    return endpoints.find(endpoint => endpoint.url === url) || null;
  }

  // ============================================================================
  // VALIDATION
  // ============================================================================

  /**
   * Validate current configuration
   */
  async validateConfiguration(): Promise<ConfigValidationResult> {
    const errors: string[] = [];
    const warnings: string[] = [];
    const missingEnvVars: string[] = [];
    const invalidEndpoints: string[] = [];

    // Validate current network
    const currentConfig = this.getCurrentNetworkConfig();
    
    // Check for endpoints
    if (currentConfig.endpoints.length === 0) {
      errors.push(`No endpoints configured for network: ${this.currentNetwork}`);
    }

    // Validate each endpoint
    for (const endpoint of currentConfig.endpoints) {
      // URL validation
      try {
        new URL(endpoint.url);
      } catch {
        invalidEndpoints.push(endpoint.url);
        errors.push(`Invalid endpoint URL: ${endpoint.url}`);
      }

      // Timeout validation
      if (endpoint.timeout <= 0) {
        errors.push(`Invalid timeout for endpoint ${endpoint.url}: ${endpoint.timeout}`);
      }

      // Connection limits
      if (endpoint.maxConnections <= 0) {
        warnings.push(`Low connection limit for endpoint ${endpoint.url}: ${endpoint.maxConnections}`);
      }
    }

    // Check environment variables
    const envVars = ['NEXT_PUBLIC_SOLANA_NETWORK', 'NEXT_PUBLIC_RPC_ENDPOINT'];
    for (const envVar of envVars) {
      if (!process.env[envVar]) {
        missingEnvVars.push(envVar);
        warnings.push(`Environment variable not set: ${envVar}`);
      }
    }

    // Priority validation
    const priorities = currentConfig.endpoints.map(e => e.priority);
    const uniquePriorities = new Set(priorities);
    if (priorities.length !== uniquePriorities.size) {
      warnings.push('Duplicate endpoint priorities detected');
    }

    const result: ConfigValidationResult = {
      valid: errors.length === 0,
      error: errors.length > 0 ? errors.join('; ') : undefined,
      severity: errors.length > 0 ? 'HIGH' : warnings.length > 0 ? 'MEDIUM' : 'LOW',
      warnings,
      missingEnvVars,
      invalidEndpoints,
      details: {
        network: this.currentNetwork,
        endpointCount: currentConfig.endpoints.length,
        errorCount: errors.length,
        warningCount: warnings.length
      }
    };

    this.lastValidation = result;
    return result;
  }

  /**
   * Validate specific network endpoints
   */
  async validateNetworkEndpoints(
    network: string, 
    timeout: number = 10000
  ): Promise<ConfigValidationResult> {
    const config = this.getNetworkConfig(network);
    const errors: string[] = [];
    const invalidEndpoints: string[] = [];

    const validationPromises = config.endpoints.map(async (endpoint) => {
      try {
        // Basic URL validation
        new URL(endpoint.url);
        
        // TODO: Could add actual connectivity test here if needed
        // For now, just validate URL format
        return true;
      } catch (error) {
        invalidEndpoints.push(endpoint.url);
        errors.push(`Endpoint validation failed: ${endpoint.url}`);
        return false;
      }
    });

    await Promise.allSettled(validationPromises);

    return {
      valid: errors.length === 0,
      error: errors.length > 0 ? errors.join('; ') : undefined,
      severity: errors.length > 0 ? 'HIGH' : 'LOW',
      invalidEndpoints,
      details: {
        network,
        testedEndpoints: config.endpoints.length,
        validEndpoints: config.endpoints.length - invalidEndpoints.length
      }
    };
  }

  /**
   * Get last validation result
   */
  getLastValidation(): ConfigValidationResult | null {
    return this.lastValidation;
  }

  // ============================================================================
  // STATISTICS AND MONITORING
  // ============================================================================

  /**
   * Get configuration statistics
   */
  getConfigurationStats(): ConfigurationStats {
    const config = this.getCurrentNetworkConfig();
    const validation = this.lastValidation;
    
    // Calculate average response time from endpoint configurations
    const totalTimeout = config.endpoints.reduce((sum, endpoint) => sum + endpoint.timeout, 0);
    const averageResponseTime = config.endpoints.length > 0 ? totalTimeout / config.endpoints.length : 0;

    return {
      currentNetwork: this.currentNetwork,
      totalEndpoints: config.endpoints.length,
      healthyEndpoints: validation ? config.endpoints.length - (validation.invalidEndpoints?.length || 0) : config.endpoints.length,
      averageResponseTime,
      lastUpdated: this.configLastUpdated,
      isValid: validation?.valid ?? true
    };
  }

  /**
   * Get configuration cache stats
   */
  getCacheStats(): { size: number; networks: string[] } {
    return {
      size: this.configCache.size,
      networks: Array.from(this.configCache.keys())
    };
  }

  /**
   * Clear configuration cache
   */
  clearCache(): void {
    this.configCache.clear();
    this.configLastUpdated = Date.now();
  }

  // ============================================================================
  // PRIVATE HELPER METHODS
  // ============================================================================

  /**
   * Determine current network from environment
   */
  private determineCurrentNetwork(): string {
    const envNetwork = process.env.NEXT_PUBLIC_SOLANA_NETWORK || SOLANA_NETWORK;
    
    if (!NETWORK_CONFIGS[envNetwork]) {
      console.warn(`Unknown network in environment: ${envNetwork}, falling back to devnet`);
      return 'devnet';
    }
    
    return envNetwork;
  }

  /**
   * Initialize configuration with validation
   */
  private initializeConfiguration(): void {
    try {
      // Pre-load current network configuration
      this.getNetworkConfig();
      
      // Validate configuration
      this.validateConfiguration().catch(error => {
        console.warn('Configuration validation failed:', error);
      });
      
    } catch (error) {
      console.error('Failed to initialize RPC configuration:', error);
      throw error;
    }
  }

  /**
   * Apply environment variable overrides to configuration
   */
  private applyEnvironmentOverrides(config: NetworkConfig): NetworkConfig {
    const enhanced = JSON.parse(JSON.stringify(config)) as NetworkConfig;
    
    // Override primary endpoint URL if environment variable is set
    const customEndpoint = process.env.NEXT_PUBLIC_RPC_ENDPOINT;
    if (customEndpoint && enhanced.endpoints.length > 0) {
      enhanced.endpoints[0] = {
        ...enhanced.endpoints[0],
        url: customEndpoint
      };
    }

    // Override timeout settings
    const customTimeout = process.env.NEXT_PUBLIC_RPC_TIMEOUT;
    if (customTimeout) {
      const timeout = parseInt(customTimeout, 10);
      if (!isNaN(timeout)) {
        enhanced.defaultTimeout = timeout;
        enhanced.endpoints.forEach(endpoint => {
          endpoint.timeout = timeout;
        });
      }
    }

    // Override max retries
    const customMaxRetries = process.env.NEXT_PUBLIC_RPC_MAX_RETRIES;
    if (customMaxRetries) {
      const maxRetries = parseInt(customMaxRetries, 10);
      if (!isNaN(maxRetries)) {
        enhanced.maxRetries = maxRetries;
        enhanced.endpoints.forEach(endpoint => {
          endpoint.retryAttempts = maxRetries;
        });
      }
    }

    // Override max connections
    const customMaxConnections = process.env.NEXT_PUBLIC_RPC_MAX_CONNECTIONS;
    if (customMaxConnections) {
      const maxConnections = parseInt(customMaxConnections, 10);
      if (!isNaN(maxConnections)) {
        enhanced.endpoints.forEach(endpoint => {
          endpoint.maxConnections = maxConnections;
        });
      }
    }

    return enhanced;
  }

  /**
   * Sort endpoints by priority
   */
  private getSortedEndpoints(endpoints: RPCEndpointConfig[]): RPCEndpointConfig[] {
    return [...endpoints].sort((a, b) => a.priority - b.priority);
  }

  /**
   * Convert HTTP URL to WebSocket URL
   */
  private convertToWebSocketUrl(httpUrl: string): string {
    try {
      const url = new URL(httpUrl);
      url.protocol = url.protocol === 'https:' ? 'wss:' : 'ws:';
      return url.toString();
    } catch {
      // Fallback: simple string replacement
      return httpUrl.replace(/^https?:/, httpUrl.startsWith('https:') ? 'wss:' : 'ws:');
    }
  }
}

// Export singleton instance
export const rpcConfigurationManager = new RPCConfigurationManager();

// Export convenience functions
export const getRPCConfiguration = () => rpcConfigurationManager;
export const getCurrentNetworkConfig = () => rpcConfigurationManager.getCurrentNetworkConfig();
export const getPrimaryEndpoint = () => rpcConfigurationManager.getPrimaryEndpoint();
export const getAllEndpoints = () => rpcConfigurationManager.getAllEndpoints();
