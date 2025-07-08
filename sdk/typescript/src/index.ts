// Main SDK exports
export { SolanaClient } from './client.js';
export { AgentAPI } from './agent.js';
export { McpAPI } from './mcp.js';

// Type exports
export * from './types.js';

// Error exports
export * from './errors.js';

// Payment flow exports
export * from './payments/index.js';

// IDL exports
export * from './idl/index.js';

// Utility exports
export { Validator } from './utils/validation.js';

// SDK class combining all APIs
import { Wallet } from '@coral-xyz/anchor';
import { SolanaClient } from './client.js';
import { AgentAPI } from './agent.js';
import { McpAPI } from './mcp.js';
import { PrepaymentFlow, PayAsYouGoFlow, StreamPaymentFlow } from './payments/index.js';
import { SdkConfig } from './types.js';

/**
 * Main SDK class that provides access to all functionality
 */
export class SolanaAIRegistriesSDK {
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
}

/**
 * Factory function to create SDK instance
 */
export function createSdk(config: SdkConfig): SolanaAIRegistriesSDK {
  return new SolanaAIRegistriesSDK(config);
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