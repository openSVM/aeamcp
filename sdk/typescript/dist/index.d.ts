export { SolanaClient } from './client.js';
export { AgentAPI } from './agent.js';
export { McpAPI } from './mcp.js';
export * from './types.js';
export * from './errors.js';
export * from './payments/index.js';
export { IdlLoader, KNOWN_IDL_HASHES, loadIdlForNetwork } from './idl/index.js';
export type { Idl, AgentRegistryIdl, McpServerRegistryIdl } from './idl/index.js';
export { Validator } from './utils/validation.js';
import { Wallet } from '@coral-xyz/anchor';
import { SolanaClient } from './client.js';
import { AgentAPI } from './agent.js';
import { McpAPI } from './mcp.js';
import { PrepaymentFlow, PayAsYouGoFlow, StreamPaymentFlow } from './payments/index.js';
import { SdkConfig } from './types.js';
/**
 * Main SDK class that provides access to all functionality
 */
export declare class SolanaAIRegistriesSDK {
    readonly client: SolanaClient;
    readonly agent: AgentAPI;
    readonly mcp: McpAPI;
    readonly payments: {
        prepayment: PrepaymentFlow;
        payAsYouGo: PayAsYouGoFlow;
        stream: StreamPaymentFlow;
    };
    constructor(config: SdkConfig);
    /**
     * Initialize the SDK with a wallet
     */
    initialize(wallet: Wallet): Promise<void>;
    /**
     * Health check for all SDK components
     */
    healthCheck(): Promise<{
        client: any;
        agent: boolean;
        mcp: boolean;
        overall: boolean;
    }>;
}
/**
 * Factory function to create SDK instance
 */
export declare function createSdk(config: SdkConfig): SolanaAIRegistriesSDK;
/**
 * Default configuration for different networks
 */
export declare const DEFAULT_CONFIGS: {
    readonly mainnet: {
        readonly cluster: "mainnet-beta";
        readonly commitment: "confirmed";
    };
    readonly devnet: {
        readonly cluster: "devnet";
        readonly commitment: "confirmed";
    };
    readonly testnet: {
        readonly cluster: "testnet";
        readonly commitment: "confirmed";
    };
};
//# sourceMappingURL=index.d.ts.map