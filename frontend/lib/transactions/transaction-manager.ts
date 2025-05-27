/**
 * Transaction State Management System
 * 
 * Provides comprehensive transaction lifecycle management with optimistic updates,
 * rollback capabilities, and real-time status tracking for Solana transactions.
 */

import { Connection, PublicKey, Transaction, TransactionSignature, Commitment, SendOptions } from '@solana/web3.js';
import { rpcConnectionManager } from '../rpc/connection-manager';

/**
 * Transaction status types
 */
export type TransactionStatus = 
  | 'pending'      // Transaction created but not submitted
  | 'submitted'    // Transaction submitted to network
  | 'processing'   // Transaction being processed by validators
  | 'confirmed'    // Transaction confirmed by majority of validators
  | 'finalized'    // Transaction finalized and irreversible
  | 'failed'       // Transaction failed
  | 'timeout'      // Transaction timed out
  | 'cancelled';   // Transaction cancelled by user

/**
 * Transaction metadata
 */
export interface TransactionMetadata {
  /** Unique transaction ID */
  id: string;
  /** Transaction signature */
  signature?: TransactionSignature;
  /** Current status */
  status: TransactionStatus;
  /** Transaction type */
  type: 'register_agent' | 'register_mcp_server' | 'update_agent' | 'update_mcp_server' | 'stake' | 'unstake';
  /** Associated data for optimistic updates */
  optimisticData?: any;
  /** Original data before optimistic update */
  originalData?: any;
  /** Error information if failed */
  error?: {
    code: string;
    message: string;
    logs?: string[];
  };
  /** Timestamps */
  timestamps: {
    created: Date;
    submitted?: Date;
    confirmed?: Date;
    finalized?: Date;
    failed?: Date;
  };
  /** Retry information */
  retries: {
    count: number;
    maxRetries: number;
    lastRetry?: Date;
  };
  /** Transaction details */
  details: {
    slot?: number;
    blockTime?: number;
    confirmationStatus?: Commitment;
    computeUnitsConsumed?: number;
    fee?: number;
  };
}

/**
 * Optimistic update configuration
 */
export interface OptimisticUpdateConfig {
  /** Enable optimistic updates */
  enabled: boolean;
  /** Timeout for optimistic updates (ms) */
  timeout: number;
  /** Whether to rollback on failure */
  rollbackOnFailure: boolean;
  /** Data to apply optimistically */
  updateData: any;
  /** Function to apply optimistic update */
  applyUpdate?: (data: any) => void;
  /** Function to rollback optimistic update */
  rollbackUpdate?: (originalData: any) => void;
}

/**
 * Transaction configuration
 */
export interface TransactionConfig {
  /** Maximum number of retries */
  maxRetries?: number;
  /** Timeout for transaction confirmation (ms) */
  timeout?: number;
  /** Commitment level for confirmation */
  commitment?: Commitment;
  /** Whether to skip preflight checks */
  skipPreflight?: boolean;
  /** Optimistic update configuration */
  optimistic?: OptimisticUpdateConfig;
}

/**
 * Transaction event listener
 */
export type TransactionEventListener = (transaction: TransactionMetadata) => void;

/**
 * Transaction Manager class
 */
export class TransactionManager {
  private transactions = new Map<string, TransactionMetadata>();
  private listeners = new Map<string, Set<TransactionEventListener>>();
  private statusCheckIntervals = new Map<string, NodeJS.Timeout>();
  private connection!: Connection;

  // Default configuration
  private readonly defaultConfig: Required<TransactionConfig> = {
    maxRetries: 3,
    timeout: 60000, // 1 minute
    commitment: 'confirmed',
    skipPreflight: false,
    optimistic: {
      enabled: false,
      timeout: 30000,
      rollbackOnFailure: true,
      updateData: null
    }
  };

  constructor() {
    this.initializeConnection();
  }

  private async initializeConnection() {
    this.connection = await rpcConnectionManager.getConnection();
  }

  // ============================================================================
  // TRANSACTION LIFECYCLE
  // ============================================================================

  /**
   * Create a new transaction
   */
  createTransaction(
    type: TransactionMetadata['type'],
    config: TransactionConfig = {}
  ): string {
    const id = this.generateTransactionId();
    const finalConfig = { ...this.defaultConfig, ...config };
    
    const transaction: TransactionMetadata = {
      id,
      status: 'pending',
      type,
      timestamps: {
        created: new Date()
      },
      retries: {
        count: 0,
        maxRetries: finalConfig.maxRetries
      },
      details: {}
    };

    // Apply optimistic update if configured
    if (finalConfig.optimistic.enabled && finalConfig.optimistic.updateData) {
      transaction.optimisticData = finalConfig.optimistic.updateData;
      if (finalConfig.optimistic.applyUpdate) {
        finalConfig.optimistic.applyUpdate(finalConfig.optimistic.updateData);
      }
    }

    this.transactions.set(id, transaction);
    this.emitEvent(id, 'created');
    
    return id;
  }

  /**
   * Submit transaction to network
   */
  async submitTransaction(
    transactionId: string,
    transaction: Transaction,
    config: TransactionConfig = {}
  ): Promise<TransactionSignature> {
    const txMetadata = this.transactions.get(transactionId);
    if (!txMetadata) {
      throw new Error(`Transaction ${transactionId} not found`);
    }

    const finalConfig = { ...this.defaultConfig, ...config };

    try {
      // Update status to submitted
      this.updateTransactionStatus(transactionId, 'submitted', {
        submitted: new Date()
      });

      // Submit transaction
      const signature = await this.connection.sendTransaction(transaction, [], {
        skipPreflight: finalConfig.skipPreflight,
        maxRetries: 0 // We handle retries ourselves
      });

      // Update metadata with signature
      txMetadata.signature = signature;
      txMetadata.timestamps.submitted = new Date();
      this.transactions.set(transactionId, txMetadata);

      // Start monitoring transaction status
      this.startStatusMonitoring(transactionId, finalConfig);
      
      this.emitEvent(transactionId, 'submitted');
      
      return signature;
    } catch (error) {
      await this.handleTransactionError(transactionId, error, finalConfig);
      throw error;
    }
  }

  /**
   * Retry failed transaction
   */
  async retryTransaction(
    transactionId: string,
    transaction: Transaction,
    config: TransactionConfig = {}
  ): Promise<TransactionSignature> {
    const txMetadata = this.transactions.get(transactionId);
    if (!txMetadata) {
      throw new Error(`Transaction ${transactionId} not found`);
    }

    if (txMetadata.retries.count >= txMetadata.retries.maxRetries) {
      throw new Error('Maximum retries exceeded');
    }

    // Increment retry count
    txMetadata.retries.count++;
    txMetadata.retries.lastRetry = new Date();
    this.transactions.set(transactionId, txMetadata);

    // Calculate backoff delay
    const backoffDelay = Math.min(1000 * Math.pow(2, txMetadata.retries.count), 10000);
    await new Promise(resolve => setTimeout(resolve, backoffDelay));

    return this.submitTransaction(transactionId, transaction, config);
  }

  /**
   * Cancel transaction
   */
  cancelTransaction(transactionId: string): void {
    const txMetadata = this.transactions.get(transactionId);
    if (!txMetadata) return;

    // Stop status monitoring
    this.stopStatusMonitoring(transactionId);

    // Rollback optimistic updates if needed
    if (txMetadata.optimisticData && txMetadata.originalData) {
      // TODO: Implement rollback logic
    }

    // Update status
    this.updateTransactionStatus(transactionId, 'cancelled');
    this.emitEvent(transactionId, 'cancelled');
  }

  // ============================================================================
  // STATUS MONITORING
  // ============================================================================

  /**
   * Start monitoring transaction status
   */
  private startStatusMonitoring(transactionId: string, config: TransactionConfig): void {
    const txMetadata = this.transactions.get(transactionId);
    if (!txMetadata?.signature) return;

    const finalConfig = { ...this.defaultConfig, ...config };
    
    // Set timeout for transaction
    const timeoutId = setTimeout(() => {
      this.handleTransactionTimeout(transactionId);
    }, finalConfig.timeout);

    // Poll for status updates
    const intervalId = setInterval(async () => {
      try {
        await this.checkTransactionStatus(transactionId, finalConfig.commitment);
      } catch (error) {
        console.error(`Error checking transaction status for ${transactionId}:`, error);
      }
    }, 2000); // Check every 2 seconds

    // Store interval for cleanup
    this.statusCheckIntervals.set(transactionId, intervalId);

    // Clear interval when transaction is complete
    setTimeout(() => {
      clearTimeout(timeoutId);
      this.stopStatusMonitoring(transactionId);
    }, finalConfig.timeout);
  }

  /**
   * Stop monitoring transaction status
   */
  private stopStatusMonitoring(transactionId: string): void {
    const intervalId = this.statusCheckIntervals.get(transactionId);
    if (intervalId) {
      clearInterval(intervalId);
      this.statusCheckIntervals.delete(transactionId);
    }
  }

  /**
   * Check transaction status
   */
  private async checkTransactionStatus(
    transactionId: string,
    commitment: Commitment
  ): Promise<void> {
    const txMetadata = this.transactions.get(transactionId);
    if (!txMetadata?.signature) return;

    try {
      const status = await this.connection.getSignatureStatus(txMetadata.signature, {
        searchTransactionHistory: true
      });

      if (!status.value) {
        // Transaction not found yet, keep waiting
        return;
      }

      // Update transaction details
      txMetadata.details.slot = status.value.slot;
      txMetadata.details.confirmationStatus = status.value.confirmationStatus;

      // Check for errors
      if (status.value.err) {
        await this.handleTransactionError(transactionId, status.value.err);
        return;
      }

      // Update status based on confirmation level
      if (status.value.confirmationStatus === 'finalized') {
        this.updateTransactionStatus(transactionId, 'finalized', {
          finalized: new Date()
        });
        this.stopStatusMonitoring(transactionId);
      } else if (status.value.confirmationStatus === 'confirmed') {
        this.updateTransactionStatus(transactionId, 'confirmed', {
          confirmed: new Date()
        });
        
        // If we only need confirmed status, stop monitoring
        if (commitment === 'confirmed') {
          this.stopStatusMonitoring(transactionId);
        }
      } else {
        this.updateTransactionStatus(transactionId, 'processing');
      }

      // Get additional transaction details
      if (status.value.confirmationStatus) {
        try {
          const txDetails = await this.connection.getTransaction(txMetadata.signature, {
            commitment: 'confirmed'
          });
          
          if (txDetails) {
            txMetadata.details.blockTime = txDetails.blockTime || undefined;
            txMetadata.details.fee = txDetails.meta?.fee;
            txMetadata.details.computeUnitsConsumed = txDetails.meta?.computeUnitsConsumed;
          }
        } catch (error) {
          // Non-critical error, continue without additional details
          console.warn(`Could not get transaction details for ${transactionId}:`, error);
        }
      }

      this.transactions.set(transactionId, txMetadata);
    } catch (error) {
      console.error(`Error checking transaction status for ${transactionId}:`, error);
    }
  }

  /**
   * Handle transaction timeout
   */
  private handleTransactionTimeout(transactionId: string): void {
    this.updateTransactionStatus(transactionId, 'timeout');
    this.stopStatusMonitoring(transactionId);
    this.emitEvent(transactionId, 'timeout');
  }

  /**
   * Handle transaction error
   */
  private async handleTransactionError(
    transactionId: string,
    error: any,
    config?: TransactionConfig
  ): Promise<void> {
    const txMetadata = this.transactions.get(transactionId);
    if (!txMetadata) return;

    // Parse error information
    const errorInfo = {
      code: error.code || 'UNKNOWN_ERROR',
      message: error.message || 'Transaction failed',
      logs: error.logs || []
    };

    txMetadata.error = errorInfo;
    txMetadata.timestamps.failed = new Date();

    // Rollback optimistic updates if configured
    if (config?.optimistic?.rollbackOnFailure && txMetadata.originalData) {
      if (config.optimistic.rollbackUpdate) {
        config.optimistic.rollbackUpdate(txMetadata.originalData);
      }
    }

    this.updateTransactionStatus(transactionId, 'failed', {
      failed: new Date()
    });

    this.stopStatusMonitoring(transactionId);
    this.emitEvent(transactionId, 'failed');
  }

  // ============================================================================
  // UTILITY METHODS
  // ============================================================================

  /**
   * Update transaction status
   */
  private updateTransactionStatus(
    transactionId: string,
    status: TransactionStatus,
    timestamps: Partial<TransactionMetadata['timestamps']> = {}
  ): void {
    const txMetadata = this.transactions.get(transactionId);
    if (!txMetadata) return;

    txMetadata.status = status;
    Object.assign(txMetadata.timestamps, timestamps);
    
    this.transactions.set(transactionId, txMetadata);
    this.emitEvent(transactionId, 'statusChanged');
  }

  /**
   * Generate unique transaction ID
   */
  private generateTransactionId(): string {
    return `tx_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  }

  /**
   * Emit transaction event
   */
  private emitEvent(transactionId: string, eventType: string): void {
    const txMetadata = this.transactions.get(transactionId);
    if (!txMetadata) return;

    // Emit to specific transaction listeners
    const txListeners = this.listeners.get(transactionId);
    if (txListeners) {
      txListeners.forEach(listener => {
        try {
          listener(txMetadata);
        } catch (error) {
          console.error('Error in transaction event listener:', error);
        }
      });
    }

    // Emit to global listeners
    const globalListeners = this.listeners.get('*');
    if (globalListeners) {
      globalListeners.forEach(listener => {
        try {
          listener(txMetadata);
        } catch (error) {
          console.error('Error in global transaction event listener:', error);
        }
      });
    }
  }

  // ============================================================================
  // PUBLIC API
  // ============================================================================

  /**
   * Get transaction by ID
   */
  getTransaction(transactionId: string): TransactionMetadata | undefined {
    return this.transactions.get(transactionId);
  }

  /**
   * Get all transactions
   */
  getAllTransactions(): TransactionMetadata[] {
    return Array.from(this.transactions.values());
  }

  /**
   * Get transactions by status
   */
  getTransactionsByStatus(status: TransactionStatus): TransactionMetadata[] {
    return Array.from(this.transactions.values()).filter(tx => tx.status === status);
  }

  /**
   * Get transactions by type
   */
  getTransactionsByType(type: TransactionMetadata['type']): TransactionMetadata[] {
    return Array.from(this.transactions.values()).filter(tx => tx.type === type);
  }

  /**
   * Add transaction event listener
   */
  addEventListener(
    transactionId: string | '*',
    listener: TransactionEventListener
  ): () => void {
    if (!this.listeners.has(transactionId)) {
      this.listeners.set(transactionId, new Set());
    }
    
    const listeners = this.listeners.get(transactionId)!;
    listeners.add(listener);

    // Return cleanup function
    return () => {
      listeners.delete(listener);
      if (listeners.size === 0) {
        this.listeners.delete(transactionId);
      }
    };
  }

  /**
   * Clear completed transactions
   */
  clearCompletedTransactions(): void {
    const completedStatuses: TransactionStatus[] = ['confirmed', 'finalized', 'failed', 'cancelled', 'timeout'];
    
    for (const [id, tx] of this.transactions.entries()) {
      if (completedStatuses.includes(tx.status)) {
        this.transactions.delete(id);
        this.listeners.delete(id);
        this.stopStatusMonitoring(id);
      }
    }
  }

  /**
   * Get transaction statistics
   */
  getStatistics(): {
    total: number;
    byStatus: Record<TransactionStatus, number>;
    byType: Record<string, number>;
    averageConfirmationTime: number;
    successRate: number;
  } {
    const transactions = Array.from(this.transactions.values());
    const total = transactions.length;
    
    const byStatus = transactions.reduce((acc, tx) => {
      acc[tx.status] = (acc[tx.status] || 0) + 1;
      return acc;
    }, {} as Record<TransactionStatus, number>);

    const byType = transactions.reduce((acc, tx) => {
      acc[tx.type] = (acc[tx.type] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);

    // Calculate average confirmation time
    const confirmedTxs = transactions.filter(tx => 
      tx.timestamps.confirmed && tx.timestamps.submitted
    );
    
    const totalConfirmationTime = confirmedTxs.reduce((acc, tx) => {
      const submitted = tx.timestamps.submitted!.getTime();
      const confirmed = tx.timestamps.confirmed!.getTime();
      return acc + (confirmed - submitted);
    }, 0);

    const averageConfirmationTime = confirmedTxs.length > 0 
      ? totalConfirmationTime / confirmedTxs.length 
      : 0;

    // Calculate success rate
    const completedTxs = transactions.filter(tx => 
      ['confirmed', 'finalized', 'failed', 'timeout'].includes(tx.status)
    );
    const successfulTxs = transactions.filter(tx => 
      ['confirmed', 'finalized'].includes(tx.status)
    );
    
    const successRate = completedTxs.length > 0 
      ? successfulTxs.length / completedTxs.length 
      : 0;

    return {
      total,
      byStatus,
      byType,
      averageConfirmationTime,
      successRate
    };
  }
}

// Export singleton instance
export const transactionManager = new TransactionManager();

// Export transaction hooks for React components
export {
  useTransaction,
  useTransactionHistory,
  useCreateTransaction,
  useOptimisticTransaction,
  useTransactionPolling,
  useBatchTransactions
} from './transaction-hooks';