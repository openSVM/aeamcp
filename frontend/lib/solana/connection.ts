import { Connection, ConnectionConfig } from '@solana/web3.js';
import { DEFAULT_RPC } from '@/lib/constants';

const config: ConnectionConfig = {
  commitment: 'confirmed',
  confirmTransactionInitialTimeout: 60000,
};

export const connection = new Connection(DEFAULT_RPC, config);

export const getConnection = (endpoint?: string) => {
  if (endpoint) {
    return new Connection(endpoint, config);
  }
  return connection;
};