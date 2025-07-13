# TypeScript SDK (aea-sdk)

A comprehensive TypeScript SDK for interacting with Solana AI Registries - manage autonomous agents and Model Context Protocol (MCP) servers on Solana blockchain.

[![npm version](https://badge.fury.io/js/aea-sdk.svg)](https://www.npmjs.com/package/aea-sdk)
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
npm install aea-sdk
```

## Quick Start

```typescript
import { createSdk, DEFAULT_CONFIGS } from 'aea-sdk';
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
      type: 'api',
      url: 'https://api.mycompany.com/agent',
    }
  ],
  pricingInfo: {
    basePrice: BigInt(1000000), // 1 SVMAI in base units
    unitType: 'request'
  }
};

const result = await sdk.agent.register(agentData);
console.log(`Agent registered with PDA: ${result.agentPda.toString()}`);
```

## Core Components

### SolanaAiRegistriesClient

The main entry point for the SDK providing unified access to all registry operations.

```typescript
import { SolanaAiRegistriesClient } from 'aea-sdk';

// Static constructor methods (Rust-style API)
const client = SolanaAiRegistriesClient.new('https://api.devnet.solana.com');
const clientWithCommitment = SolanaAiRegistriesClient.newWithCommitment(
  'https://api.devnet.solana.com', 
  'confirmed'
);

// Initialize with wallet
await client.initialize(wallet);
```

### Agent Registry Operations

```typescript
// Register an agent
const agentData = AgentBuilder.new(agentId, agentName)
  .description('AI assistant for code generation')
  .version('2.0.0')
  .serviceEndpoint('api', 'https://api.example.com')
  .pricing(BigInt(500000), 'request')
  .build();

const result = await client.registerAgent(agentData);

// List agents
const agents = await client.listAgents({ 
  owner: ownerPublicKey,
  offset: 0,
  limit: 10 
});

// Get agent details
const agent = await client.getAgent(agentPda);

// Update agent
await client.updateAgent(agentPda, { 
  description: 'Updated description' 
});

// Update agent status
await client.updateAgentStatus(agentPda, { status: 'active' });
```

### MCP Server Registry Operations

```typescript
// Register MCP server
const mcpServerData = McpServerBuilder.new(serverId, serverName)
  .description('Model Context Protocol server')
  .version('1.5.0')
  .capability('filesystem', { readOnly: false })
  .serviceEndpoint('websocket', 'wss://mcp.example.com')
  .pricing(BigInt(250000), 'connection')
  .build();

const result = await client.registerMcpServer(mcpServerData);

// List MCP servers
const servers = await client.listMcpServers({
  owner: ownerPublicKey,
  offset: 0,
  limit: 10
});

// Get MCP server details
const server = await client.getMcpServer(mcpServerPda);

// Update MCP server status
await client.updateMcpServerStatus(mcpServerPda, { status: 'maintenance' });
```

### Payment Flows

The SDK supports three different payment models:

#### 1. Prepayment Flow

```typescript
import { PrepaymentFlow } from 'aea-sdk';

const prepayment = new PrepaymentFlow(client);

// Make upfront payment
const result = await prepayment.makePayment({
  resourcePda: agentPda,
  amount: BigInt(5000000), // 5 SVMAI
  resourceType: 'agent'
});

// Check prepaid balance
const balance = await prepayment.getBalance(agentPda);
```

#### 2. Pay-as-you-go Flow

```typescript
import { PayAsYouGoFlow } from 'aea-sdk';

const payAsYouGo = new PayAsYouGoFlow(client);

// Initialize usage tracking
await payAsYouGo.initializeUsageTracking(agentPda);

// Record usage and pay
const result = await payAsYouGo.recordUsageAndPay({
  resourcePda: agentPda,
  usageAmount: 1, // 1 request
  resourceType: 'agent'
});

// Get usage history
const history = await payAsYouGo.getUsageHistory(agentPda);
```

#### 3. Stream Payment Flow

```typescript
import { StreamPaymentFlow } from 'aea-sdk';

const streamPayment = new StreamPaymentFlow(client);

// Create payment stream
const stream = await streamPayment.createStream({
  resourcePda: agentPda,
  ratePerSecond: BigInt(100), // 100 base units per second
  duration: 3600, // 1 hour
  resourceType: 'agent'
});

// Start streaming
await streamPayment.startStream(stream.streamPda);

// Check stream status
const status = await streamPayment.getStreamStatus(stream.streamPda);
```

## Utility Classes

### Builder Patterns

```typescript
// Agent Builder
const agent = AgentBuilder.new('agent-id', 'Agent Name')
  .description('AI assistant')
  .version('1.0.0')
  .providerInfo('Company Name', 'https://company.com')
  .serviceEndpoint('api', 'https://api.company.com')
  .serviceEndpoint('websocket', 'wss://ws.company.com')
  .pricing(BigInt(1000000), 'request')
  .metadata({ customField: 'value' })
  .build();

// MCP Server Builder  
const mcpServer = McpServerBuilder.new('server-id', 'Server Name')
  .description('MCP server for file operations')
  .version('2.1.0')
  .capability('filesystem', { readOnly: false })
  .capability('database', { provider: 'postgresql' })
  .serviceEndpoint('websocket', 'wss://mcp.company.com')
  .pricing(BigInt(500000), 'connection')
  .build();
```

### Utility Methods

```typescript
// Check if account exists
const exists = await client.accountExists(agentPda);

// Get account balance
const balance = await client.getBalance(publicKey);

// Get minimum rent exemption
const rentExemption = await client.getMinimumRentExemption(dataSize);

// Get recent blockhash
const blockhash = await client.getRecentBlockhash();
```

## Error Handling

The SDK provides comprehensive error handling with specific error types:

```typescript
import { 
  AgentRegistryError, 
  McpServerRegistryError, 
  PaymentError,
  ValidationError 
} from 'aea-sdk';

try {
  await client.registerAgent(agentData);
} catch (error) {
  if (error instanceof ValidationError) {
    console.error('Validation failed:', error.details);
  } else if (error instanceof AgentRegistryError) {
    console.error('Agent registry error:', error.message);
    console.error('Error code:', error.code);
  } else if (error instanceof PaymentError) {
    console.error('Payment failed:', error.message);
  } else {
    console.error('Unexpected error:', error);
  }
}
```

## Configuration

### Network Configurations

```typescript
import { DEFAULT_CONFIGS, NetworkConfig } from 'aea-sdk';

// Use predefined configurations
const sdk = createSdk(DEFAULT_CONFIGS.devnet);   // Devnet
const sdk = createSdk(DEFAULT_CONFIGS.mainnet);  // Mainnet-beta
const sdk = createSdk(DEFAULT_CONFIGS.testnet);  // Testnet

// Custom configuration
const customConfig: NetworkConfig = {
  rpcUrl: 'https://your-custom-rpc.com',
  commitment: 'confirmed',
  programIds: {
    agentRegistry: 'YourAgentProgramId...',
    mcpServerRegistry: 'YourMcpProgramId...',
    tokenProgram: 'TokenkegQfeZyiNwAJbNbGKPFXCWuBvf9Ss623VQ5DA'
  },
  idlConfig: {
    agentRegistryUrl: 'https://your-site.com/idl/agent_registry.json',
    mcpServerRegistryUrl: 'https://your-site.com/idl/mcp_server_registry.json'
  }
};

const sdk = createSdk(customConfig);
```

## Testing

The SDK includes comprehensive testing infrastructure:

```bash
# Run all tests
npm test

# Run with coverage
npm run test:coverage

# Run specific test suites
npm test -- --testNamePattern="Agent"
npm test -- --testNamePattern="MCP"
npm test -- --testNamePattern="Payment"
```

### Test Structure

```
tests/
├── unit/                    # Unit tests for individual components
│   ├── agent-api.test.ts
│   ├── mcp-api.test.ts
│   ├── payment-flows.test.ts
│   └── validation.test.ts
├── integration/             # Integration tests with mock Solana
│   ├── agent-lifecycle.test.ts
│   ├── mcp-lifecycle.test.ts
│   └── payment-integration.test.ts
└── fixtures/                # Test data and mock utilities
    ├── mock-data.ts
    └── test-utils.ts
```

## Examples

Complete examples are available in the SDK repository:

- **[Agent Registration](../sdk/typescript/examples/register-agent.ts)**: Complete agent registration workflow
- **[MCP Server Management](../sdk/typescript/examples/mcp-server-management.ts)**: MCP server lifecycle management
- **[Payment Flows](../sdk/typescript/examples/payment-flows.ts)**: All three payment model examples
- **[Error Handling](../sdk/typescript/examples/error-handling.ts)**: Comprehensive error handling patterns

## API Documentation

The complete API documentation is generated automatically from the source code using TypeDoc.

### Generating Documentation

```bash
cd sdk/typescript
npm install
npm run docs
```

This generates HTML documentation in the `docs/` folder that you can open in a browser.

### Online Documentation

- **npm package**: [`aea-sdk`](https://www.npmjs.com/package/aea-sdk)
- **Repository**: [TypeScript SDK](https://github.com/openSVM/aeamcp/tree/main/sdk/typescript)
- **Issues**: [GitHub Issues](https://github.com/openSVM/aeamcp/issues)

## Development

### Building the SDK

```bash
# Install dependencies
npm install

# Build for production
npm run build

# Development mode with watch
npm run dev

# Lint and format
npm run lint
npm run lint:fix
npm run format
```

### Contributing

1. Fork the repository
2. Create a feature branch: `git checkout -b feature/my-feature`
3. Make your changes and add tests
4. Ensure all tests pass: `npm test`
5. Lint your code: `npm run lint:fix`
6. Commit your changes: `git commit -am 'Add some feature'`
7. Push to the branch: `git push origin feature/my-feature`
8. Submit a pull request

## License

This project is licensed under the MIT License - see the [LICENSE](../LICENSE) file for details.

## Support

For questions and support:

- **GitHub Issues**: [Create an issue](https://github.com/openSVM/aeamcp/issues)
- **Documentation**: [Full Documentation](https://github.com/openSVM/aeamcp/tree/main/docs)
- **Examples**: [Usage Examples](https://github.com/openSVM/aeamcp/tree/main/sdk/typescript/examples)

## Related Projects

- **[Rust SDK](../sdk/rust/)**: Rust implementation for server-side applications
- **[Agent Registry Program](../programs/agent-registry/)**: On-chain program for agent management
- **[MCP Server Registry Program](../programs/mcp-server-registry/)**: On-chain program for MCP server management