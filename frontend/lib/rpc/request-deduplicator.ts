/**
 * Request Deduplicator
 * 
 * Eliminates redundant RPC requests by sharing promises for identical
 * concurrent requests and implementing intelligent request fingerprinting.
 */

import { Commitment } from '@solana/web3.js';
import { createHash } from 'crypto';

/**
 * Request parameters for fingerprinting
 */
export interface RequestParams {
  /** RPC method name */
  method: string;
  /** Request parameters */
  params: any[];
  /** Commitment level */
  commitment?: Commitment;
  /** Additional options */
  options?: Record<string, any>;
}

/**
 * In-flight request information
 */
interface InFlightRequest {
  /** Shared promise for the request */
  promise: Promise<any>;
  /** Request timestamp */
  timestamp: number;
  /** Number of times this request was deduplicated */
  deduplicationCount: number;
  /** Request timeout */
  timeout: NodeJS.Timeout;
}

/**
 * Deduplication statistics
 */
export interface DeduplicationStats {
  /** Total requests processed */
  totalRequests: number;
  /** Requests that were deduplicated */
  deduplicatedRequests: number;
  /** Currently in-flight requests */
  inFlightRequests: number;
  /** Deduplication hit rate (percentage) */
  hitRate: number;
  /** Average deduplication count per request */
  averageDeduplicationCount: number;
  /** Most frequently deduplicated fingerprints */
  topDeduplicatedFingerprints: Array<{ fingerprint: string; count: number }>;
}

/**
 * Request Deduplicator class
 * 
 * Provides intelligent request deduplication with promise sharing,
 * automatic cleanup, and comprehensive statistics.
 */
export class RequestDeduplicator {
  private inFlightRequests: Map<string, InFlightRequest> = new Map();
  private stats: DeduplicationStats;
  private readonly deduplicationWindow = 5000; // 5 seconds
  private readonly maxInFlightRequests = 500; // Prevent memory leaks
  private deduplicationCounts: Map<string, number> = new Map();
  private cleanupInterval: NodeJS.Timeout;

  constructor() {
    this.stats = {
      totalRequests: 0,
      deduplicatedRequests: 0,
      inFlightRequests: 0,
      hitRate: 0,
      averageDeduplicationCount: 0,
      topDeduplicatedFingerprints: []
    };

    // Start cleanup interval
    this.cleanupInterval = setInterval(() => {
      this.cleanupExpiredRequests();
    }, 1000); // Clean up every second
  }

  // ============================================================================
  // PUBLIC API
  // ============================================================================

  /**
   * Execute request with deduplication
   */
  async executeWithDeduplication<T>(
    requestParams: RequestParams,
    executor: () => Promise<T>,
    timeout: number = 30000
  ): Promise<T> {
    this.stats.totalRequests++;

    // Generate fingerprint for the request
    const fingerprint = this.generateFingerprint(requestParams);

    // Check if request is already in flight
    const existingRequest = this.inFlightRequests.get(fingerprint);
    if (existingRequest) {
      this.stats.deduplicatedRequests++;
      existingRequest.deduplicationCount++;
      
      // Update deduplication count statistics
      const currentCount = this.deduplicationCounts.get(fingerprint) || 0;
      this.deduplicationCounts.set(fingerprint, currentCount + 1);
      
      console.debug(`Request deduplicated: ${fingerprint} (count: ${existingRequest.deduplicationCount})`);
      
      // Return the shared promise
      return existingRequest.promise;
    }

    // Check if we're at the in-flight limit
    if (this.inFlightRequests.size >= this.maxInFlightRequests) {
      console.warn('Maximum in-flight requests reached, cleaning up oldest requests');
      this.cleanupOldestRequests(Math.floor(this.maxInFlightRequests * 0.1)); // Remove 10%
    }

    // Create new request
    const requestPromise = this.createRequest(executor, timeout);
    const requestTimeout = setTimeout(() => {
      this.removeRequest(fingerprint);
    }, timeout);

    const inFlightRequest: InFlightRequest = {
      promise: requestPromise,
      timestamp: Date.now(),
      deduplicationCount: 0,
      timeout: requestTimeout
    };

    this.inFlightRequests.set(fingerprint, inFlightRequest);
    this.updateStats();

    // Handle request completion
    requestPromise
      .finally(() => {
        this.removeRequest(fingerprint);
      })
      .catch(() => {
        // Error handling is done by the executor, just cleanup
      });

    return requestPromise;
  }

  /**
   * Check if a request would be deduplicated
   */
  wouldBeDeduplicated(requestParams: RequestParams): boolean {
    const fingerprint = this.generateFingerprint(requestParams);
    return this.inFlightRequests.has(fingerprint);
  }

  /**
   * Get estimated wait time for a deduplicated request
   */
  getEstimatedWaitTime(requestParams: RequestParams): number {
    const fingerprint = this.generateFingerprint(requestParams);
    const existingRequest = this.inFlightRequests.get(fingerprint);
    
    if (!existingRequest) return 0;
    
    const elapsed = Date.now() - existingRequest.timestamp;
    const estimatedTotal = 5000; // Assume 5 second average request time
    
    return Math.max(0, estimatedTotal - elapsed);
  }

  /**
   * Get current statistics
   */
  getStats(): DeduplicationStats {
    this.updateStats();
    return { ...this.stats };
  }

  /**
   * Clear all in-flight requests (emergency use)
   */
  clearAll(): void {
    // Clear all timeouts
    for (const request of this.inFlightRequests.values()) {
      clearTimeout(request.timeout);
    }
    
    this.inFlightRequests.clear();
    this.updateStats();
    
    console.log('All in-flight requests cleared');
  }

  /**
   * Get detailed information about in-flight requests
   */
  getInFlightRequestsInfo(): Array<{
    fingerprint: string;
    timestamp: number;
    deduplicationCount: number;
    age: number;
  }> {
    const now = Date.now();
    return Array.from(this.inFlightRequests.entries()).map(([fingerprint, request]) => ({
      fingerprint: this.truncateFingerprint(fingerprint),
      timestamp: request.timestamp,
      deduplicationCount: request.deduplicationCount,
      age: now - request.timestamp
    }));
  }

  /**
   * Force cleanup of expired requests
   */
  forceCleanup(): void {
    this.cleanupExpiredRequests();
  }

  /**
   * Cleanup resources
   */
  destroy(): void {
    if (this.cleanupInterval) {
      clearInterval(this.cleanupInterval);
    }
    
    this.clearAll();
    this.deduplicationCounts.clear();
  }

  // ============================================================================
  // PRIVATE METHODS
  // ============================================================================

  /**
   * Generate unique fingerprint for request
   */
  private generateFingerprint(requestParams: RequestParams): string {
    // Create a consistent object for hashing
    const fingerprintData = {
      method: requestParams.method,
      params: this.normalizeParams(requestParams.params),
      commitment: requestParams.commitment || 'confirmed',
      options: this.normalizeOptions(requestParams.options)
    };

    // Create hash from stringified data
    const dataString = JSON.stringify(fingerprintData, this.sortObjectKeys);
    return createHash('sha256').update(dataString).digest('hex').substring(0, 16);
  }

  /**
   * Normalize parameters for consistent fingerprinting
   */
  private normalizeParams(params: any[]): any[] {
    return params.map(param => {
      if (param === null || param === undefined) {
        return null;
      }
      
      if (typeof param === 'object') {
        // Sort object keys for consistent hashing
        return this.sortObjectDeep(param);
      }
      
      if (typeof param === 'string') {
        // Normalize string parameters
        return param.trim();
      }
      
      return param;
    });
  }

  /**
   * Normalize options for consistent fingerprinting
   */
  private normalizeOptions(options?: Record<string, any>): Record<string, any> {
    if (!options) return {};
    
    // Remove non-deterministic options that shouldn't affect deduplication
    const normalized = { ...options };
    delete normalized.timeout;
    delete normalized.signal;
    delete normalized.controller;
    
    return this.sortObjectDeep(normalized);
  }

  /**
   * Sort object keys recursively for consistent serialization
   */
  private sortObjectDeep(obj: any): any {
    if (obj === null || typeof obj !== 'object') {
      return obj;
    }
    
    if (Array.isArray(obj)) {
      return obj.map(item => this.sortObjectDeep(item));
    }
    
    const sortedKeys = Object.keys(obj).sort();
    const result: any = {};
    
    for (const key of sortedKeys) {
      result[key] = this.sortObjectDeep(obj[key]);
    }
    
    return result;
  }

  /**
   * Sort object keys function for JSON.stringify
   */
  private sortObjectKeys(key: string, value: any): any {
    if (typeof value === 'object' && value !== null && !Array.isArray(value)) {
      const sortedKeys = Object.keys(value).sort();
      const sortedObj: any = {};
      for (const sortedKey of sortedKeys) {
        sortedObj[sortedKey] = value[sortedKey];
      }
      return sortedObj;
    }
    return value;
  }

  /**
   * Create and execute request with proper error handling
   */
  private async createRequest<T>(
    executor: () => Promise<T>,
    timeout: number
  ): Promise<T> {
    // Create timeout promise
    const timeoutPromise = new Promise<never>((_, reject) => {
      setTimeout(() => {
        reject(new Error(`Request timeout after ${timeout}ms`));
      }, timeout);
    });

    // Race between executor and timeout
    return Promise.race([
      executor(),
      timeoutPromise
    ]);
  }

  /**
   * Remove request from in-flight map
   */
  private removeRequest(fingerprint: string): void {
    const request = this.inFlightRequests.get(fingerprint);
    if (request) {
      clearTimeout(request.timeout);
      this.inFlightRequests.delete(fingerprint);
      this.updateStats();
    }
  }

  /**
   * Clean up expired requests
   */
  private cleanupExpiredRequests(): void {
    const now = Date.now();
    const expiredFingerprints: string[] = [];

    for (const [fingerprint, request] of this.inFlightRequests.entries()) {
      if (now - request.timestamp > this.deduplicationWindow) {
        expiredFingerprints.push(fingerprint);
      }
    }

    for (const fingerprint of expiredFingerprints) {
      this.removeRequest(fingerprint);
    }

    if (expiredFingerprints.length > 0) {
      console.debug(`Cleaned up ${expiredFingerprints.length} expired requests`);
    }
  }

  /**
   * Clean up oldest requests when limit is reached
   */
  private cleanupOldestRequests(count: number): void {
    const requests = Array.from(this.inFlightRequests.entries())
      .sort((a, b) => a[1].timestamp - b[1].timestamp)
      .slice(0, count);

    for (const [fingerprint] of requests) {
      this.removeRequest(fingerprint);
    }

    console.debug(`Cleaned up ${count} oldest requests`);
  }

  /**
   * Update statistics
   */
  private updateStats(): void {
    this.stats.inFlightRequests = this.inFlightRequests.size;
    
    if (this.stats.totalRequests > 0) {
      this.stats.hitRate = (this.stats.deduplicatedRequests / this.stats.totalRequests) * 100;
    }

    // Calculate average deduplication count
    const deduplicationCounts = Array.from(this.deduplicationCounts.values());
    if (deduplicationCounts.length > 0) {
      this.stats.averageDeduplicationCount = 
        deduplicationCounts.reduce((a, b) => a + b, 0) / deduplicationCounts.length;
    }

    // Update top deduplicated fingerprints
    const sortedFingerprints = Array.from(this.deduplicationCounts.entries())
      .sort((a, b) => b[1] - a[1])
      .slice(0, 10)
      .map(([fingerprint, count]) => ({
        fingerprint: this.truncateFingerprint(fingerprint),
        count
      }));

    this.stats.topDeduplicatedFingerprints = sortedFingerprints;
  }

  /**
   * Truncate fingerprint for display
   */
  private truncateFingerprint(fingerprint: string): string {
    return fingerprint.length > 12 ? `${fingerprint.substring(0, 12)}...` : fingerprint;
  }
}

// Export singleton instance
export const requestDeduplicator = new RequestDeduplicator();

// Convenience function for creating request parameters
export function createRequestParams(
  method: string,
  params: any[],
  commitment?: Commitment,
  options?: Record<string, any>
): RequestParams {
  return {
    method,
    params,
    commitment,
    options
  };
}

// Convenience function for RPC method fingerprinting
export function createRPCRequestParams(
  method: string,
  params: any[],
  commitment?: Commitment
): RequestParams {
  return createRequestParams(method, params, commitment);
}
