// Main SDK exports
export { SolanaClient } from './client.js';
export { AgentAPI } from './agent.js';
export { McpAPI } from './mcp.js';

// Builder exports (matches Rust SDK)
export { AgentBuilder, McpServerBuilder } from './builders.js';

// Type exports
export * from './types.js';

// Error exports
export * from './errors.js';

// Payment flow exports
export * from './payments/index.js';

// IDL exports - specific exports to avoid conflicts
export { IdlLoader, KNOWN_IDL_HASHES, loadIdlForNetwork } from './idl/index.js';
export type { Idl, AgentRegistryIdl, McpServerRegistryIdl } from './idl/index.js';

// Utility exports
export { Validator } from './utils/validation.js';

// SDK class combining all APIs
import { Wallet } from '@coral-xyz/anchor';
import { PublicKey } from '@solana/web3.js';
import { SolanaClient } from './client.js';
import { AgentAPI } from './agent.js';
import { McpAPI } from './mcp.js';
import { PrepaymentFlow, PayAsYouGoFlow, StreamPaymentFlow } from './payments/index.js';
import { 
  SdkConfig, 
  AgentRegistrationData,
  AgentUpdateData,
  AgentRegistryEntry,
  AgentTier,
  AgentStatus,
  McpServerRegistrationData,
  McpServerUpdateData,
  McpServerRegistryEntry,
  McpServerStatus,
  TransactionResult
} from './types.js';

/**
 * Main SDK class that provides access to all functionality
 * Named to match Rust SDK: SolanaAiRegistriesClient
 */
export class SolanaAiRegistriesClient {
  public readonly client: SolanaClient;
  public readonly agent: AgentAPI;
  public readonly mcp: McpAPI;
  public readonly payments: {
    prepayment: PrepaymentFlow;
    payAsYouGo: PayAsYouGoFlow;
    stream: StreamPaymentFlow;
  };

  constructor(config: SdkConfig) {
    this.client = new SolanaClient(config);
    this.agent = new AgentAPI(this.client);
    this.mcp = new McpAPI(this.client);
    this.payments = {
      prepayment: new PrepaymentFlow(this.client),
      payAsYouGo: new PayAsYouGoFlow(this.client),
      stream: new StreamPaymentFlow(this.client),
    };
  }

  /**
   * Create a new client with the specified RPC endpoint (matches Rust SDK)
   */
  static new(rpcUrl: string): SolanaAiRegistriesClient {
    return new SolanaAiRegistriesClient({
      cluster: 'devnet',
      rpcUrl,
      commitment: 'confirmed',
    });
  }

  /**
   * Create a new client with custom commitment level (matches Rust SDK)
   */
  static newWithCommitment(rpcUrl: string, commitment: 'processed' | 'confirmed' | 'finalized'): SolanaAiRegistriesClient {
    return new SolanaAiRegistriesClient({
      cluster: 'devnet',
      rpcUrl,
      commitment,
    });
  }

  /**
   * Initialize the SDK with a wallet
   */
  async initialize(wallet: Wallet): Promise<void> {
    await this.client.initialize(wallet);
  }

  /**
   * Health check for all SDK components
   */
  async healthCheck(): Promise<{
    client: any;
    agent: boolean;
    mcp: boolean;
    overall: boolean;
  }> {
    try {
      const clientHealth = await this.client.healthCheck();
      
      // Test agent API
      let agentHealthy = false;
      try {
        await this.agent.listAgentsByOwner();
        agentHealthy = true;
      } catch {
        agentHealthy = false;
      }

      // Test MCP API
      let mcpHealthy = false;
      try {
        await this.mcp.listServersByOwner();
        mcpHealthy = true;
      } catch {
        mcpHealthy = false;
      }

      return {
        client: clientHealth,
        agent: agentHealthy,
        mcp: mcpHealthy,
        overall: clientHealth.connected && agentHealthy && mcpHealthy,
      };
    } catch (error) {
      return {
        client: { connected: false, error: error instanceof Error ? error.message : 'Unknown error' },
        agent: false,
        mcp: false,
        overall: false,
      };
    }
  }

  // Direct methods matching Rust SDK pattern
  
  /**
   * Register a new agent (matches Rust SDK signature)
   */
  async registerAgent(data: AgentRegistrationData, stakingTier?: AgentTier): Promise<TransactionResult> {
    return await this.agent.registerAgent(data, stakingTier);
  }

  /**
   * Update an existing agent (matches Rust SDK signature)
   */
  async updateAgent(agentId: string, data: AgentUpdateData): Promise<TransactionResult> {
    return await this.agent.updateAgent(agentId, data);
  }

  /**
   * Update agent status (matches Rust SDK signature)
   */
  async updateAgentStatus(agentId: string, status: AgentStatus): Promise<TransactionResult> {
    return await this.agent.updateAgentStatus(agentId, status);
  }

  /**
   * Deregister an agent (matches Rust SDK signature)
   */
  async deregisterAgent(agentId: string): Promise<TransactionResult> {
    return await this.agent.deregisterAgent(agentId);
  }

  /**
   * Get an agent by ID (matches Rust SDK signature, but owner is implicit)
   */
  async getAgent(agentId: string): Promise<AgentRegistryEntry> {
    return await this.agent.getAgent(agentId);
  }

  /**
   * Get an agent by ID with explicit owner (matches Rust SDK signature)
   */
  async getAgentByOwner(owner: PublicKey, agentId: string): Promise<AgentRegistryEntry | null> {
    return await this.agent.getAgentByOwner(owner, agentId);
  }

  /**
   * Register a new MCP server (matches Rust SDK signature)
   */
  async registerMcpServer(data: McpServerRegistrationData): Promise<TransactionResult> {
    return await this.mcp.registerServer(data);
  }

  /**
   * Update an existing MCP server (matches Rust SDK signature)
   */
  async updateMcpServer(serverId: string, data: McpServerUpdateData): Promise<TransactionResult> {
    return await this.mcp.updateServer(serverId, data);
  }

  /**
   * Update MCP server status (matches Rust SDK signature)
   */
  async updateMcpServerStatus(serverId: string, status: McpServerStatus): Promise<TransactionResult> {
    return await this.mcp.updateServerStatus(serverId, status);
  }

  /**
   * Deregister an MCP server (matches Rust SDK signature)
   */
  async deregisterMcpServer(serverId: string): Promise<TransactionResult> {
    return await this.mcp.deregisterServer(serverId);
  }

  /**
   * Get an MCP server by ID (matches Rust SDK signature, but owner is implicit)
   */
  async getMcpServer(serverId: string): Promise<McpServerRegistryEntry> {
    return await this.mcp.getServer(serverId);
  }

  /**
   * Get an MCP server by ID with explicit owner (matches Rust SDK signature)
   */
  async getMcpServerByOwner(owner: PublicKey, serverId: string): Promise<McpServerRegistryEntry | null> {
    return await this.mcp.getServerByOwner(owner, serverId);
  }

  /**
   * Check if an account exists (matches Rust SDK)
   */
  async accountExists(publicKey: PublicKey): Promise<boolean> {
    return await this.client.accountExists(publicKey);
  }

  /**
   * Get account balance in lamports (matches Rust SDK)
   */
  async getBalance(publicKey: PublicKey): Promise<bigint> {
    return await this.client.getBalance(publicKey);
  }

  /**
   * Get minimum rent exemption for account size (matches Rust SDK)
   */
  async getMinimumRentExemption(size: number): Promise<bigint> {
    return await this.client.getMinimumRentExemption(size);
  }

  /**
   * Get the Agent Registry program ID (matches Rust SDK)
   */
  agentRegistryProgramId(): PublicKey {
    return this.client.getAgentRegistryProgramId();
  }

  /**
   * Get the MCP Server Registry program ID (matches Rust SDK)
   */
  mcpServerRegistryProgramId(): PublicKey {
    return this.client.getMcpRegistryProgramId();
  }

  /**
   * Get the underlying RPC client (matches Rust SDK)
   */
  rpcClient(): SolanaClient {
    return this.client;
  }
}

/**
 * Factory function to create SDK instance
 * For consistency with TypeScript conventions, also export as createSdk
 */
export function createSdk(config: SdkConfig): SolanaAiRegistriesClient {
  return new SolanaAiRegistriesClient(config);
}

/**
 * Default configuration for different networks
 */
export const DEFAULT_CONFIGS = {
  mainnet: {
    cluster: 'mainnet-beta' as const,
    commitment: 'confirmed' as const,
  },
  devnet: {
    cluster: 'devnet' as const,
    commitment: 'confirmed' as const,
  },
  testnet: {
    cluster: 'testnet' as const,
    commitment: 'confirmed' as const,
  },
} as const;