import { PublicKey } from '@solana/web3.js';
import { 
  AGENT_REGISTRY_PDA_SEED, 
  MCP_SERVER_REGISTRY_PDA_SEED,
  AGENT_REGISTRY_PROGRAM_ID,
  MCP_SERVER_REGISTRY_PROGRAM_ID 
} from '@/lib/constants';

export const getAgentPDA = (agentId: string): [PublicKey, number] => {
  return PublicKey.findProgramAddressSync(
    [Buffer.from(AGENT_REGISTRY_PDA_SEED), Buffer.from(agentId)],
    AGENT_REGISTRY_PROGRAM_ID
  );
};

export const getMcpServerPDA = (serverId: string): [PublicKey, number] => {
  return PublicKey.findProgramAddressSync(
    [Buffer.from(MCP_SERVER_REGISTRY_PDA_SEED), Buffer.from(serverId)],
    MCP_SERVER_REGISTRY_PROGRAM_ID
  );
};

export const truncateAddress = (address: string, chars = 4): string => {
  return `${address.slice(0, chars)}...${address.slice(-chars)}`;
};

export const formatTimestamp = (timestamp: number): string => {
  return new Date(timestamp * 1000).toLocaleString();
};

export const isValidUrl = (url: string): boolean => {
  try {
    new URL(url);
    return true;
  } catch {
    return false;
  }
};

export const isValidSolanaAddress = (address: string): boolean => {
  try {
    new PublicKey(address);
    return true;
  } catch {
    return false;
  }
};