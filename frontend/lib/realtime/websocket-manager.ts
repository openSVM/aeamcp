/**
 * WebSocket Connection Manager
 * 
 * Manages WebSocket connections to Solana RPC endpoints for real-time
 * account updates and program event subscriptions with automatic
 * reconnection and connection health monitoring.
 */

import { Connection, PublicKey, AccountChangeCallback, Logs } from '@solana/web3.js';
import { rpcConnectionManager } from '../rpc/connection-manager';
import { EventEmitter } from 'events';

/**
 * Subscription types for different kinds of real-time updates
 */
export type SubscriptionType = 
  | 'account' 
  | 'program' 
  | 'logs' 
  | 'slot' 
  | 'signature';

/**
 * Subscription configuration
 */
export interface SubscriptionConfig {
  /** Type of subscription */
  type: SubscriptionType;
  /** Target (account, program, or signature) */
  target: PublicKey | string;
  /** Callback function for updates */
  callback: (...args: any[]) => void;
  /** Subscription options */
  options?: any;
  /** Whether subscription is currently active */
  active: boolean;
  /** Subscription ID from Solana */
  subscriptionId?: number;
  /** Number of reconnection attempts */
  reconnectAttempts: number;
  /** Last update timestamp */
  lastUpdate: number;
}

/**
 * WebSocket connection state
 */
export interface WebSocketState {
  /** Whether WebSocket is connected */
  connected: boolean;
  /** Number of active subscriptions */
  activeSubscriptions: number;
  /** Connection quality (0-100) */
  connectionQuality: number;
  /** Last ping response time */
  lastPingTime: number;
  /** Number of reconnection attempts */
  reconnectAttempts: number;
  /** Current endpoint URL */
  currentEndpoint: string;
}

/**
 * Real-time update event data
 */
export interface RealtimeUpdateEvent {
  /** Type of update */
  type: SubscriptionType;
  /** Target identifier */
  target: string;
  /** Update data */
  data: any;
  /** Timestamp of update */
  timestamp: number;
  /** Subscription ID */
  subscriptionId: string;
}

/**
 * WebSocket Manager class
 * 
 * Handles real-time connections to Solana WebSocket endpoints
 * with automatic reconnection, subscription management, and
 * connection health monitoring.
 */
export class WebSocketManager extends EventEmitter {
  private connection: Connection | null = null;
  private subscriptions: Map<string, SubscriptionConfig> = new Map();
  private connectionState: WebSocketState = {
    connected: false,
    activeSubscriptions: 0,
    connectionQuality: 0,
    lastPingTime: 0,
    reconnectAttempts: 0,
    currentEndpoint: ''
  };
  
  private reconnectTimer: NodeJS.Timeout | null = null;
  private healthCheckTimer: NodeJS.Timeout | null = null;
  private pingInterval: NodeJS.Timeout | null = null;
  
  private readonly maxReconnectAttempts = 10;
  private readonly reconnectDelay = 1000; // 1 second
  private readonly healthCheckInterval = 30000; // 30 seconds
  private readonly pingInterval_ms = 10000; // 10 seconds
  
  constructor() {
    super();
    this.initializeConnection();
  }

  // ============================================================================
  // CONNECTION MANAGEMENT
  // ============================================================================

  /**
   * Initialize WebSocket connection
   */
  private async initializeConnection(): Promise<void> {
    try {
      // Get connection from RPC manager
      this.connection = await rpcConnectionManager.getConnection({
        commitment: 'confirmed',
        useCache: false
      });

      const endpoint = rpcConnectionManager.getPrimaryEndpoint();
      if (endpoint) {
        this.connectionState.currentEndpoint = endpoint;
        this.connectionState.connected = true;
        this.connectionState.reconnectAttempts = 0;
        
        // Start health monitoring
        this.startHealthMonitoring();
        
        // Resubscribe to all active subscriptions
        await this.resubscribeAll();
        
        this.emit('connected', this.connectionState);
        console.log('WebSocket connected to:', endpoint);
      }
      
    } catch (error) {
      console.error('Failed to initialize WebSocket connection:', error);
      this.handleConnectionError(error as Error);
    }
  }

  /**
   * Handle connection errors and attempt reconnection
   */
  private handleConnectionError(error: Error): void {
    this.connectionState.connected = false;
    this.connectionState.reconnectAttempts++;
    
    this.emit('error', {
      error,
      reconnectAttempts: this.connectionState.reconnectAttempts,
      willReconnect: this.connectionState.reconnectAttempts < this.maxReconnectAttempts
    });

    // Stop health monitoring
    this.stopHealthMonitoring();
    
    // Mark all subscriptions as inactive
    this.subscriptions.forEach(sub => {
      sub.active = false;
      sub.subscriptionId = undefined;
    });
    
    // Attempt reconnection if under limit
    if (this.connectionState.reconnectAttempts < this.maxReconnectAttempts) {
      const delay = this.reconnectDelay * Math.pow(2, this.connectionState.reconnectAttempts - 1);
      console.log(`Reconnecting in ${delay}ms (attempt ${this.connectionState.reconnectAttempts})`);
      
      this.reconnectTimer = setTimeout(() => {
        this.initializeConnection();
      }, delay);
    } else {
      console.error('Max reconnection attempts reached. WebSocket connection failed.');
      this.emit('maxReconnectAttemptsReached');
    }
  }

  /**
   * Manually reconnect WebSocket
   */
  async reconnect(): Promise<void> {
    this.disconnect();
    this.connectionState.reconnectAttempts = 0;
    await this.initializeConnection();
  }

  /**
   * Disconnect WebSocket
   */
  disconnect(): void {
    // Clear timers
    if (this.reconnectTimer) {
      clearTimeout(this.reconnectTimer);
      this.reconnectTimer = null;
    }
    
    this.stopHealthMonitoring();
    
    // Unsubscribe from all subscriptions
    this.subscriptions.forEach((sub, key) => {
      if (sub.subscriptionId && this.connection) {
        try {
          switch (sub.type) {
            case 'account':
              this.connection.removeAccountChangeListener(sub.subscriptionId);
              break;
            case 'program':
              this.connection.removeProgramAccountChangeListener(sub.subscriptionId);
              break;
            case 'logs':
              this.connection.removeOnLogsListener(sub.subscriptionId);
              break;
            case 'slot':
              this.connection.removeSlotChangeListener(sub.subscriptionId);
              break;
            case 'signature':
              this.connection.removeSignatureListener(sub.subscriptionId);
              break;
          }
        } catch (error) {
          console.warn(`Failed to remove subscription ${key}:`, error);
        }
      }
      sub.active = false;
      sub.subscriptionId = undefined;
    });
    
    this.connectionState.connected = false;
    this.connectionState.activeSubscriptions = 0;
    this.connection = null;
    
    this.emit('disconnected');
  }

  // ============================================================================
  // SUBSCRIPTION MANAGEMENT
  // ============================================================================

  /**
   * Subscribe to account changes
   */
  async subscribeToAccount(
    accountPubkey: PublicKey,
    callback: AccountChangeCallback,
    commitment: string = 'confirmed'
  ): Promise<string> {
    const subscriptionId = this.generateSubscriptionId('account', accountPubkey.toBase58());
    
    const config: SubscriptionConfig = {
      type: 'account',
      target: accountPubkey,
      callback,
      options: { commitment },
      active: false,
      reconnectAttempts: 0,
      lastUpdate: 0
    };

    this.subscriptions.set(subscriptionId, config);
    
    if (this.connection && this.connectionState.connected) {
      await this.activateSubscription(subscriptionId, config);
    }
    
    return subscriptionId;
  }

  /**
   * Subscribe to program account changes
   */
  async subscribeToProgramAccounts(
    programId: PublicKey,
    callback: (accountInfo: any) => void,
    commitment: string = 'confirmed',
    filters?: any[]
  ): Promise<string> {
    const subscriptionId = this.generateSubscriptionId('program', programId.toBase58());
    
    const config: SubscriptionConfig = {
      type: 'program',
      target: programId,
      callback,
      options: { commitment, filters },
      active: false,
      reconnectAttempts: 0,
      lastUpdate: 0
    };

    this.subscriptions.set(subscriptionId, config);
    
    if (this.connection && this.connectionState.connected) {
      await this.activateSubscription(subscriptionId, config);
    }
    
    return subscriptionId;
  }

  /**
   * Subscribe to program logs
   */
  async subscribeToLogs(
    filter: 'all' | 'allWithVotes' | { mentions: string[] },
    callback: (logs: Logs, context: any) => void,
    commitment: string = 'confirmed'
  ): Promise<string> {
    const subscriptionId = this.generateSubscriptionId('logs', JSON.stringify(filter));
    
    const config: SubscriptionConfig = {
      type: 'logs',
      target: JSON.stringify(filter),
      callback,
      options: { commitment },
      active: false,
      reconnectAttempts: 0,
      lastUpdate: 0
    };

    this.subscriptions.set(subscriptionId, config);
    
    if (this.connection && this.connectionState.connected) {
      await this.activateSubscription(subscriptionId, config);
    }
    
    return subscriptionId;
  }

  /**
   * Subscribe to slot changes
   */
  async subscribeToSlotChanges(
    callback: (slotInfo: any) => void
  ): Promise<string> {
    const subscriptionId = this.generateSubscriptionId('slot', 'slot_updates');
    
    const config: SubscriptionConfig = {
      type: 'slot',
      target: 'slot_updates',
      callback,
      options: {},
      active: false,
      reconnectAttempts: 0,
      lastUpdate: 0
    };

    this.subscriptions.set(subscriptionId, config);
    
    if (this.connection && this.connectionState.connected) {
      await this.activateSubscription(subscriptionId, config);
    }
    
    return subscriptionId;
  }

  /**
   * Activate a subscription
   */
  private async activateSubscription(
    subscriptionId: string,
    config: SubscriptionConfig
  ): Promise<void> {
    if (!this.connection) {
      throw new Error('No WebSocket connection available');
    }

    try {
      let solanaSubscriptionId: number;
      
      switch (config.type) {
        case 'account':
          solanaSubscriptionId = this.connection.onAccountChange(
            config.target as PublicKey,
            (accountInfo, context) => {
              config.lastUpdate = Date.now();
              config.callback(accountInfo);
              this.emitUpdate(config.type, config.target.toString(), accountInfo, subscriptionId);
            },
            config.options.commitment
          );
          break;
          
        case 'program':
          solanaSubscriptionId = this.connection.onProgramAccountChange(
            config.target as PublicKey,
            (accountInfo, context) => {
              config.lastUpdate = Date.now();
              config.callback(accountInfo);
              this.emitUpdate(config.type, config.target.toString(), accountInfo, subscriptionId);
            },
            config.options.commitment,
            config.options.filters
          );
          break;
          
        case 'logs':
          const filter = JSON.parse(config.target as string);
          solanaSubscriptionId = this.connection.onLogs(
            filter,
            (logs, context) => {
              config.lastUpdate = Date.now();
              config.callback(logs, context);
              this.emitUpdate(config.type, config.target.toString(), { logs, context }, subscriptionId);
            },
            config.options.commitment
          );
          break;
          
        case 'slot':
          solanaSubscriptionId = this.connection.onSlotChange(
            (slotInfo) => {
              config.lastUpdate = Date.now();
              config.callback(slotInfo);
              this.emitUpdate(config.type, config.target.toString(), slotInfo, subscriptionId);
            }
          );
          break;
          
        default:
          throw new Error(`Unsupported subscription type: ${config.type}`);
      }
      
      config.subscriptionId = solanaSubscriptionId;
      config.active = true;
      config.reconnectAttempts = 0;
      
      this.connectionState.activeSubscriptions = Array.from(this.subscriptions.values())
        .filter(sub => sub.active).length;
      
      console.log(`Activated subscription ${subscriptionId} (Solana ID: ${solanaSubscriptionId})`);
      
    } catch (error) {
      console.error(`Failed to activate subscription ${subscriptionId}:`, error);
      config.reconnectAttempts++;
      throw error;
    }
  }

  /**
   * Unsubscribe from updates
   */
  async unsubscribe(subscriptionId: string): Promise<void> {
    const config = this.subscriptions.get(subscriptionId);
    if (!config) {
      console.warn(`Subscription ${subscriptionId} not found`);
      return;
    }

    if (config.subscriptionId && this.connection) {
      try {
        switch (config.type) {
          case 'account':
            await this.connection.removeAccountChangeListener(config.subscriptionId);
            break;
          case 'program':
            await this.connection.removeProgramAccountChangeListener(config.subscriptionId);
            break;
          case 'logs':
            await this.connection.removeOnLogsListener(config.subscriptionId);
            break;
          case 'slot':
            await this.connection.removeSlotChangeListener(config.subscriptionId);
            break;
        }
      } catch (error) {
        console.warn(`Failed to remove subscription ${subscriptionId}:`, error);
      }
    }

    this.subscriptions.delete(subscriptionId);
    this.connectionState.activeSubscriptions = Array.from(this.subscriptions.values())
      .filter(sub => sub.active).length;
    
    console.log(`Unsubscribed from ${subscriptionId}`);
  }

  /**
   * Resubscribe to all active subscriptions
   */
  private async resubscribeAll(): Promise<void> {
    const subscriptions = Array.from(this.subscriptions.entries());
    
    for (const [subscriptionId, config] of subscriptions) {
      try {
        if (!config.active) {
          await this.activateSubscription(subscriptionId, config);
        }
      } catch (error) {
        console.error(`Failed to resubscribe ${subscriptionId}:`, error);
      }
    }
  }

  // ============================================================================
  // HEALTH MONITORING
  // ============================================================================

  /**
   * Start health monitoring
   */
  private startHealthMonitoring(): void {
    // Health check timer
    this.healthCheckTimer = setInterval(() => {
      this.performHealthCheck();
    }, this.healthCheckInterval);
    
    // Ping timer for connection quality
    this.pingInterval = setInterval(() => {
      this.pingConnection();
    }, this.pingInterval_ms);
  }

  /**
   * Stop health monitoring
   */
  private stopHealthMonitoring(): void {
    if (this.healthCheckTimer) {
      clearInterval(this.healthCheckTimer);
      this.healthCheckTimer = null;
    }
    
    if (this.pingInterval) {
      clearInterval(this.pingInterval);
      this.pingInterval = null;
    }
  }

  /**
   * Perform health check
   */
  private async performHealthCheck(): Promise<void> {
    if (!this.connection || !this.connectionState.connected) {
      return;
    }

    try {
      const startTime = Date.now();
      await this.connection.getSlot();
      const responseTime = Date.now() - startTime;
      
      // Update connection quality based on response time
      let quality = 100;
      if (responseTime > 5000) quality = 20;
      else if (responseTime > 2000) quality = 50;
      else if (responseTime > 1000) quality = 80;
      
      this.connectionState.connectionQuality = quality;
      this.connectionState.lastPingTime = responseTime;
      
    } catch (error) {
      console.warn('Health check failed:', error);
      this.connectionState.connectionQuality = 0;
      this.handleConnectionError(error as Error);
    }
  }

  /**
   * Ping connection for quality measurement
   */
  private async pingConnection(): Promise<void> {
    if (!this.connection || !this.connectionState.connected) {
      return;
    }

    try {
      const startTime = Date.now();
      await this.connection.getSlot('finalized');
      this.connectionState.lastPingTime = Date.now() - startTime;
    } catch (error) {
      // Ping failures are less critical than health checks
      console.debug('Ping failed:', error);
    }
  }

  // ============================================================================
  // UTILITY METHODS
  // ============================================================================

  /**
   * Generate unique subscription ID
   */
  private generateSubscriptionId(type: SubscriptionType, target: string): string {
    const timestamp = Date.now();
    const random = Math.random().toString(36).substr(2, 9);
    return `${type}_${target.slice(0, 8)}_${timestamp}_${random}`;
  }

  /**
   * Emit real-time update event
   */
  private emitUpdate(
    type: SubscriptionType,
    target: string,
    data: any,
    subscriptionId: string
  ): void {
    const updateEvent: RealtimeUpdateEvent = {
      type,
      target,
      data,
      timestamp: Date.now(),
      subscriptionId
    };
    
    this.emit('update', updateEvent);
    this.emit(`update:${type}`, updateEvent);
    this.emit(`update:${subscriptionId}`, updateEvent);
  }

  /**
   * Get current connection state
   */
  getConnectionState(): WebSocketState {
    return { ...this.connectionState };
  }

  /**
   * Get all subscriptions
   */
  getSubscriptions(): SubscriptionConfig[] {
    return Array.from(this.subscriptions.values());
  }

  /**
   * Get active subscriptions count
   */
  getActiveSubscriptionsCount(): number {
    return Array.from(this.subscriptions.values()).filter(sub => sub.active).length;
  }

  /**
   * Check if connected
   */
  isConnected(): boolean {
    return this.connectionState.connected;
  }

  /**
   * Force health check
   */
  async forceHealthCheck(): Promise<void> {
    await this.performHealthCheck();
  }

  /**
   * Cleanup resources
   */
  destroy(): void {
    this.disconnect();
    this.removeAllListeners();
  }
}

// Export singleton instance
export const webSocketManager = new WebSocketManager();