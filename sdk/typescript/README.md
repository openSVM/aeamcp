# @svmai/registries

A TypeScript SDK for interacting with Solana AI Registries - manage autonomous agents and Model Context Protocol (MCP) servers on Solana blockchain.

[![npm version](https://badge.fury.io/js/%40svmai%2Fregistries.svg)](https://www.npmjs.com/package/@svmai/registries)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.5+-blue.svg)](https://www.typescriptlang.org/)

## Features

- **🤖 Agent Registry**: Register, update, and manage autonomous AI agents
- **🖥️ MCP Server Registry**: Manage Model Context Protocol servers and their capabilities
- **💰 Payment Flows**: Support for prepayment, pay-as-you-go, and streaming payment models
- **🔒 Type Safety**: Full TypeScript support with comprehensive type definitions
- **⚡ Real-time**: Stream payments and usage tracking
- **🌐 Multi-network**: Support for mainnet, devnet, and testnet
- **✅ Comprehensive Testing**: >90% test coverage with unit and integration tests

## Installation

```bash
npm install @svmai/registries
```

## Quick Start

```typescript
import { createSdk, DEFAULT_CONFIGS } from '@svmai/registries';
import { Wallet } from '@coral-xyz/anchor';
import { Keypair } from '@solana/web3.js';

// Initialize SDK
const sdk = createSdk(DEFAULT_CONFIGS.devnet);

// Create wallet (use your actual wallet in production)
const keypair = Keypair.fromSecretKey(yourSecretKey);
const wallet = new Wallet(keypair);

// Initialize with wallet
await sdk.initialize(wallet);

// Register an AI agent
const agentData = {
  agentId: 'my-ai-agent',
  name: 'My AI Assistant',
  description: 'An intelligent AI assistant',
  version: '1.0.0',
  providerName: 'My Company',
  providerUrl: 'https://mycompany.com',
  serviceEndpoints: [
    {
      protocol: 'https',
      url: 'https://api.mycompany.com/agent',
    },
  ],
  supportedModes: ['text', 'multimodal'],
  skills: [
    {
      id: 'text-processing',
      name: 'Text Processing',
      tags: ['nlp', 'text'],
    },
  ],
  tags: ['ai', 'assistant'],
};

const result = await sdk.agent.registerAgent(agentData);
console.log('Agent registered:', result.signature);
```

## API Reference

### Core Classes

#### `SolanaAIRegistriesSDK`

Main SDK class providing access to all functionality.

```typescript
const sdk = createSdk({
  cluster: 'devnet', // 'mainnet-beta' | 'devnet' | 'testnet'
  commitment: 'confirmed', // Optional
  rpcUrl: 'https://api.devnet.solana.com', // Optional
});
```

#### `AgentAPI`

Manage AI agents on the registry.

```typescript
// Register agent
await sdk.agent.registerAgent(agentData, stakingTier?);

// Update agent
await sdk.agent.updateAgent(agentId, updateData);

// Get agent
const agent = await sdk.agent.getAgent(agentId);

// List agents
const agents = await sdk.agent.listAgentsByOwner();

// Search agents
const results = await sdk.agent.searchAgentsByTags(['ai', 'nlp']);

// Deregister agent
await sdk.agent.deregisterAgent(agentId);
```

#### `McpAPI`

Manage MCP servers and their capabilities.

```typescript
// Register server
await sdk.mcp.registerServer(serverData);

// Update server
await sdk.mcp.updateServer(serverId, updateData);

// Get server
const server = await sdk.mcp.getServer(serverId);

// Search by capabilities
const servers = await sdk.mcp.searchServersByCapabilities(['data', 'analysis']);

// Find servers by tool
const toolServers = await sdk.mcp.getServersByTool('analyze-data');

// Deregister server
await sdk.mcp.deregisterServer(serverId);
```

### Payment Flows

#### Prepayment Flow

For one-time upfront payments.

```typescript
const prepaymentConfig = {
  method: PaymentMethod.Prepay,
  payer: payerPublicKey,
  recipient: recipientPublicKey,
  amount: 1000000000n, // 1 A2AMPL (in base units)
  pricing: {
    basePrice: 1000000000n,
    currency: 'A2AMPL',
  },
};

const result = await sdk.payments.prepayment.executePrepayment(prepaymentConfig);
```

#### Pay-as-You-Go Flow

For usage-based billing.

```typescript
const payAsYouGoConfig = {
  method: PaymentMethod.PayAsYouGo,
  payer: payerPublicKey,
  recipient: recipientPublicKey,
  perUsePrice: 10000000n, // 0.01 A2AMPL per use
  pricing: {
    basePrice: 10000000n,
    currency: 'A2AMPL',
  },
};

// Record usage
sdk.payments.payAsYouGo.recordUsage(
  'service-id',
  userPublicKey,
  10000000n,
  { requestType: 'analysis' }
);

// Pay for accumulated usage
const result = await sdk.payments.payAsYouGo.executeUsagePayment(
  payAsYouGoConfig,
  'service-id'
);
```

#### Stream Payment Flow

For continuous time-based payments.

```typescript
const streamConfig = {
  method: PaymentMethod.Stream,
  payer: payerPublicKey,
  recipient: recipientPublicKey,
  ratePerSecond: 1000000n, // 0.001 A2AMPL per second
  duration: 3600, // 1 hour
  pricing: {
    basePrice: 3600000000n,
    currency: 'A2AMPL',
  },
};

// Create and start stream
const { streamId } = await sdk.payments.stream.createStream(streamConfig);
const result = await sdk.payments.stream.startStream(streamId);

// Monitor stream
const status = sdk.payments.stream.getStreamStatus(streamId);

// Stop stream
const stopResult = await sdk.payments.stream.stopStream(streamId);
```

## Types and Interfaces

### Agent Types

```typescript
interface AgentRegistrationData {
  agentId: string;
  name: string;
  description: string;
  version: string;
  providerName: string;
  providerUrl: string;
  documentationUrl?: string;
  serviceEndpoints: AgentServiceEndpoint[];
  supportedModes: string[];
  skills: AgentSkill[];
  securityInfoUri?: string;
  aeaAddress?: string;
  economicIntent?: string;
  extendedMetadataUri?: string;
  tags: string[];
}

interface AgentSkill {
  id: string;
  name: string;
  tags: string[];
}

enum AgentStatus {
  Pending = 0,
  Active = 1,
  Inactive = 2,
  Deregistered = 3,
}
```

### MCP Server Types

```typescript
interface McpServerRegistrationData {
  serverId: string;
  name: string;
  version: string;
  endpointUrl: string;
  capabilitiesSummary: string;
  onchainToolDefinitions: McpToolDefinition[];
  onchainResourceDefinitions: McpResourceDefinition[];
  onchainPromptDefinitions: McpPromptDefinition[];
  fullCapabilitiesUri?: string;
  documentationUrl?: string;
  tags: string[];
}

interface McpToolDefinition {
  name: string;
  tags: string[];
}
```

### Payment Types

```typescript
interface PricingInfo {
  basePrice: A2AMPLAmount; // bigint in base units
  currency: 'A2AMPL';
  tier?: AgentTier;
  bulkDiscountPercent?: number;
  priorityMultiplier?: number;
}

enum PaymentMethod {
  Prepay = 'prepay',
  PayAsYouGo = 'pay_as_you_go',
  Stream = 'stream',
}
```

## Error Handling

The SDK provides comprehensive error handling with specific error types:

```typescript
import { 
  ValidationError, 
  NetworkError, 
  TransactionError, 
  ProgramError,
  RegistryError,
  PaymentError 
} from '@svmai/registries';

try {
  await sdk.agent.registerAgent(agentData);
} catch (error) {
  if (error instanceof ValidationError) {
    console.error('Validation failed:', error.message);
  } else if (error instanceof NetworkError) {
    console.error('Network error:', error.message);
  } else if (error instanceof TransactionError) {
    console.error('Transaction failed:', error.message, error.transactionSignature);
  } else if (error instanceof ProgramError) {
    console.error('Program error:', error.programErrorCode, error.message);
  }
}
```

## Examples

See the `/examples` directory for complete working examples:

- [`register-agent.ts`](./examples/register-agent.ts) - Agent registration and management
- [`mcp-server-management.ts`](./examples/mcp-server-management.ts) - MCP server operations
- [`payment-flows.ts`](./examples/payment-flows.ts) - Payment flow implementations

## Configuration

### Network Configuration

```typescript
// Predefined configurations
import { DEFAULT_CONFIGS } from '@svmai/registries';

const mainnetSdk = createSdk(DEFAULT_CONFIGS.mainnet);
const devnetSdk = createSdk(DEFAULT_CONFIGS.devnet);
const testnetSdk = createSdk(DEFAULT_CONFIGS.testnet);

// Custom configuration
const customSdk = createSdk({
  cluster: 'devnet',
  rpcUrl: 'https://my-custom-rpc.com',
  commitment: 'finalized',
  agentRegistryProgramId: new PublicKey('...'),
  mcpRegistryProgramId: new PublicKey('...'),
});
```

### Token Configuration

The SDK uses A2AMPL tokens for payments:

- **Mainnet**: `Cpzvdx6pppc9TNArsGsqgShCsKC9NCCjA2gtzHvUpump`
- **Devnet**: `A2AMPLyncKHwfSnwRNsJ2qsjsetgo9fGkP8YZPsDZ9mE`

All amounts are in base units (9 decimals):
- 1 A2AMPL = 1,000,000,000 base units
- 0.001 A2AMPL = 1,000,000 base units

## Development

### Building

```bash
npm run build
```

### Testing

```bash
# Run all tests
npm test

# Run with coverage
npm run test:coverage

# Run specific test suite
npm test -- --testNamePattern="ValidationError"
```

### Linting and Formatting

```bash
# Lint code
npm run lint

# Fix linting issues
npm run lint:fix

# Format code
npm run format
```

### Documentation

```bash
# Generate TypeDoc documentation
npm run docs
```

## Constants and Limits

The SDK enforces the same limits as the on-chain programs:

```typescript
import { CONSTANTS } from '@svmai/registries';

// Agent limits
CONSTANTS.MAX_AGENT_ID_LEN; // 64
CONSTANTS.MAX_AGENT_NAME_LEN; // 128
CONSTANTS.MAX_SERVICE_ENDPOINTS; // 3
CONSTANTS.MAX_SKILLS; // 10

// MCP server limits
CONSTANTS.MAX_SERVER_ID_LEN; // 64
CONSTANTS.MAX_ONCHAIN_TOOL_DEFINITIONS; // 5
CONSTANTS.MAX_ONCHAIN_RESOURCE_DEFINITIONS; // 5

// Token amounts
CONSTANTS.AGENT_REGISTRATION_FEE; // 100 A2AMPL
CONSTANTS.MCP_REGISTRATION_FEE; // 50 A2AMPL
```

## Support

- **Documentation**: [Full API Documentation](https://docs.solana-ai-registries.com)
- **Issues**: [GitHub Issues](https://github.com/openSVM/aeamcp/issues)
- **Discussions**: [GitHub Discussions](https://github.com/openSVM/aeamcp/discussions)

## License

MIT License - see [LICENSE](../LICENSE) file for details.

## Contributing

We welcome contributions! Please see our [Contributing Guidelines](../CONTRIBUTING.md) for details on:

- Setting up the development environment
- Running tests
- Submitting pull requests
- Code style and conventions

## Changelog

See [CHANGELOG.md](./CHANGELOG.md) for version history and breaking changes.