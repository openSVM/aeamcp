/**
 * React Hooks for Transaction Management
 * 
 * Provides React hooks for managing transaction state and history
 * with real-time updates and optimistic UI patterns.
 */

import { useState, useEffect, useCallback, useMemo } from 'react';
import { Transaction, TransactionSignature } from '@solana/web3.js';
import { 
  transactionManager, 
  TransactionMetadata, 
  TransactionStatus, 
  TransactionConfig 
} from './transaction-manager';

/**
 * Hook for managing a single transaction
 */
export function useTransaction(transactionId?: string) {
  const [transaction, setTransaction] = useState<TransactionMetadata | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Update transaction state when it changes
  useEffect(() => {
    if (!transactionId) return;

    const tx = transactionManager.getTransaction(transactionId);
    if (tx) {
      setTransaction(tx);
    }

    // Listen for transaction updates
    const cleanup = transactionManager.addEventListener(transactionId, (updatedTx) => {
      setTransaction(updatedTx);
      
      if (updatedTx.status === 'submitted' || updatedTx.status === 'processing') {
        setIsLoading(true);
        setError(null);
      } else if (updatedTx.status === 'confirmed' || updatedTx.status === 'finalized') {
        setIsLoading(false);
        setError(null);
      } else if (updatedTx.status === 'failed' || updatedTx.status === 'timeout') {
        setIsLoading(false);
        setError(updatedTx.error?.message || 'Transaction failed');
      }
    });

    return cleanup;
  }, [transactionId]);

  const submitTransaction = useCallback(async (
    transaction: Transaction,
    config?: TransactionConfig
  ): Promise<TransactionSignature> => {
    if (!transactionId) {
      throw new Error('No transaction ID provided');
    }

    try {
      setIsLoading(true);
      setError(null);
      
      const signature = await transactionManager.submitTransaction(
        transactionId,
        transaction,
        config
      );
      
      return signature;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Transaction failed';
      setError(errorMessage);
      setIsLoading(false);
      throw err;
    }
  }, [transactionId]);

  const retryTransaction = useCallback(async (
    transaction: Transaction,
    config?: TransactionConfig
  ): Promise<TransactionSignature> => {
    if (!transactionId) {
      throw new Error('No transaction ID provided');
    }

    try {
      setIsLoading(true);
      setError(null);
      
      const signature = await transactionManager.retryTransaction(
        transactionId,
        transaction,
        config
      );
      
      return signature;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Retry failed';
      setError(errorMessage);
      setIsLoading(false);
      throw err;
    }
  }, [transactionId]);

  const cancelTransaction = useCallback(() => {
    if (!transactionId) return;
    
    transactionManager.cancelTransaction(transactionId);
    setIsLoading(false);
    setError(null);
  }, [transactionId]);

  return {
    transaction,
    isLoading,
    error,
    submitTransaction,
    retryTransaction,
    cancelTransaction
  };
}

/**
 * Hook for creating and managing a new transaction
 */
export function useCreateTransaction() {
  const [transactions, setTransactions] = useState<Map<string, TransactionMetadata>>(new Map());

  const createTransaction = useCallback((
    type: TransactionMetadata['type'],
    config?: TransactionConfig
  ): string => {
    const txId = transactionManager.createTransaction(type, config);
    
    // Add to local state
    const tx = transactionManager.getTransaction(txId);
    if (tx) {
      setTransactions(prev => new Map(prev).set(txId, tx));
    }
    
    return txId;
  }, []);

  const getTransaction = useCallback((txId: string): TransactionMetadata | undefined => {
    return transactions.get(txId);
  }, [transactions]);

  return {
    createTransaction,
    getTransaction,
    transactions: Array.from(transactions.values())
  };
}

/**
 * Hook for transaction history and statistics
 */
export function useTransactionHistory(filters?: {
  status?: TransactionStatus[];
  type?: TransactionMetadata['type'][];
  limit?: number;
}) {
  const [transactions, setTransactions] = useState<TransactionMetadata[]>([]);
  const [statistics, setStatistics] = useState<ReturnType<typeof transactionManager.getStatistics> | null>(null);

  // Update transactions when they change
  useEffect(() => {
    const updateTransactions = () => {
      let allTransactions = transactionManager.getAllTransactions();
      
      // Apply filters
      if (filters?.status) {
        allTransactions = allTransactions.filter(tx => 
          filters.status!.includes(tx.status)
        );
      }
      
      if (filters?.type) {
        allTransactions = allTransactions.filter(tx => 
          filters.type!.includes(tx.type)
        );
      }
      
      // Sort by creation date (newest first)
      allTransactions.sort((a, b) => 
        b.timestamps.created.getTime() - a.timestamps.created.getTime()
      );
      
      // Apply limit
      if (filters?.limit) {
        allTransactions = allTransactions.slice(0, filters.limit);
      }
      
      setTransactions(allTransactions);
      setStatistics(transactionManager.getStatistics());
    };

    // Initial load
    updateTransactions();

    // Listen for all transaction changes
    const cleanup = transactionManager.addEventListener('*', updateTransactions);

    return cleanup;
  }, [filters]);

  const clearCompleted = useCallback(() => {
    transactionManager.clearCompletedTransactions();
  }, []);

  const getTransactionsByStatus = useCallback((status: TransactionStatus) => {
    return transactions.filter(tx => tx.status === status);
  }, [transactions]);

  const getTransactionsByType = useCallback((type: TransactionMetadata['type']) => {
    return transactions.filter(tx => tx.type === type);
  }, [transactions]);

  return {
    transactions,
    statistics,
    clearCompleted,
    getTransactionsByStatus,
    getTransactionsByType
  };
}

/**
 * Hook for optimistic updates
 */
export function useOptimisticTransaction<T>(
  initialData: T,
  updateFunction: (data: T, optimisticData: any) => T,
  rollbackFunction?: (data: T, originalData: T) => T
) {
  const [data, setData] = useState<T>(initialData);
  const [originalData, setOriginalData] = useState<T>(initialData);
  const [isOptimistic, setIsOptimistic] = useState(false);

  const applyOptimisticUpdate = useCallback((optimisticData: any) => {
    setOriginalData(data);
    setData(current => updateFunction(current, optimisticData));
    setIsOptimistic(true);
  }, [data, updateFunction]);

  const confirmUpdate = useCallback(() => {
    setIsOptimistic(false);
    setOriginalData(data);
  }, [data]);

  const rollbackUpdate = useCallback(() => {
    if (rollbackFunction) {
      setData(current => rollbackFunction(current, originalData));
    } else {
      setData(originalData);
    }
    setIsOptimistic(false);
  }, [originalData, rollbackFunction]);

  const resetData = useCallback((newData: T) => {
    setData(newData);
    setOriginalData(newData);
    setIsOptimistic(false);
  }, []);

  return {
    data,
    originalData,
    isOptimistic,
    applyOptimisticUpdate,
    confirmUpdate,
    rollbackUpdate,
    resetData
  };
}

/**
 * Hook for transaction polling
 */
export function useTransactionPolling(
  transactionId: string | null,
  options: {
    enabled?: boolean;
    interval?: number;
    timeout?: number;
  } = {}
) {
  const { enabled = true, interval = 2000, timeout = 60000 } = options;
  const [isPolling, setIsPolling] = useState(false);

  useEffect(() => {
    if (!transactionId || !enabled) {
      setIsPolling(false);
      return;
    }

    const tx = transactionManager.getTransaction(transactionId);
    if (!tx || ['confirmed', 'finalized', 'failed', 'timeout', 'cancelled'].includes(tx.status)) {
      setIsPolling(false);
      return;
    }

    setIsPolling(true);
    
    const startTime = Date.now();
    const pollInterval = setInterval(() => {
      const currentTx = transactionManager.getTransaction(transactionId);
      
      if (!currentTx) {
        setIsPolling(false);
        clearInterval(pollInterval);
        return;
      }

      // Check if transaction is complete
      if (['confirmed', 'finalized', 'failed', 'timeout', 'cancelled'].includes(currentTx.status)) {
        setIsPolling(false);
        clearInterval(pollInterval);
        return;
      }

      // Check timeout
      if (Date.now() - startTime > timeout) {
        setIsPolling(false);
        clearInterval(pollInterval);
        return;
      }
    }, interval);

    return () => {
      clearInterval(pollInterval);
      setIsPolling(false);
    };
  }, [transactionId, enabled, interval, timeout]);

  return { isPolling };
}

/**
 * Hook for batch transactions
 */
export function useBatchTransactions() {
  const [batch, setBatch] = useState<Array<{
    id: string;
    transaction: Transaction;
    config?: TransactionConfig;
  }>>([]);
  const [isExecuting, setIsExecuting] = useState(false);
  const [results, setResults] = useState<Array<{
    id: string;
    signature?: TransactionSignature;
    error?: string;
  }>>([]);

  const addToBatch = useCallback((
    type: TransactionMetadata['type'],
    transaction: Transaction,
    config?: TransactionConfig
  ) => {
    const id = transactionManager.createTransaction(type, config);
    setBatch(prev => [...prev, { id, transaction, config }]);
    return id;
  }, []);

  const removeFromBatch = useCallback((id: string) => {
    setBatch(prev => prev.filter(item => item.id !== id));
    transactionManager.cancelTransaction(id);
  }, []);

  const clearBatch = useCallback(() => {
    batch.forEach(item => transactionManager.cancelTransaction(item.id));
    setBatch([]);
    setResults([]);
  }, [batch]);

  const executeBatch = useCallback(async () => {
    if (batch.length === 0) return;

    setIsExecuting(true);
    const batchResults: Array<{ id: string; signature?: TransactionSignature; error?: string }> = [];

    try {
      // Execute transactions sequentially
      for (const item of batch) {
        try {
          const signature = await transactionManager.submitTransaction(
            item.id,
            item.transaction,
            item.config
          );
          batchResults.push({ id: item.id, signature });
        } catch (error) {
          const errorMessage = error instanceof Error ? error.message : 'Transaction failed';
          batchResults.push({ id: item.id, error: errorMessage });
        }
      }
    } finally {
      setResults(batchResults);
      setIsExecuting(false);
    }

    return batchResults;
  }, [batch]);

  const executeBatchParallel = useCallback(async () => {
    if (batch.length === 0) return;

    setIsExecuting(true);
    
    try {
      const promises = batch.map(async (item) => {
        try {
          const signature = await transactionManager.submitTransaction(
            item.id,
            item.transaction,
            item.config
          );
          return { id: item.id, signature };
        } catch (error) {
          const errorMessage = error instanceof Error ? error.message : 'Transaction failed';
          return { id: item.id, error: errorMessage };
        }
      });

      const batchResults = await Promise.all(promises);
      setResults(batchResults);
      return batchResults;
    } finally {
      setIsExecuting(false);
    }
  }, [batch]);

  return {
    batch,
    isExecuting,
    results,
    addToBatch,
    removeFromBatch,
    clearBatch,
    executeBatch,
    executeBatchParallel
  };
}