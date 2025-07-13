# TypeScript SDK API Reference

## Overview

The `aea-sdk` TypeScript SDK provides comprehensive access to the Solana AI Registries ecosystem, including Agent Registry and MCP Server Registry functionality.

## SDK Location

The TypeScript SDK is located at: [`sdk/typescript/`](../sdk/typescript/)

## API Documentation

The complete API documentation is generated automatically from the source code using TypeDoc.

### Local Development

To generate and view the API documentation locally:

```bash
cd sdk/typescript
npm install
npm run docs
```

This will generate HTML documentation in the `docs/` folder that you can open in a browser.

### Online Documentation

When the SDK is published to npm, the API documentation will be available at:
- npm package: `aea-sdk`
- Repository: [TypeScript SDK](../sdk/typescript/)

## Quick Start

```typescript
import { createSdk } from 'aea-sdk';

// Initialize the SDK
const sdk = await createSdk({
  network: 'devnet',
  commitmentLevel: 'confirmed'
});

// Register an agent
const agentData = {
  name: 'My AI Agent',
  description: 'A powerful AI agent',
  owner: myPublicKey,
  // ... other fields
};

const result = await sdk.agent.register(agentData);
```

## Key Components

### Core APIs
- **AgentAPI**: Agent registry operations (register, update, delete, list)
- **McpAPI**: MCP server registry operations
- **SolanaClient**: Solana blockchain interaction wrapper

### Payment Flows
- **PrepaymentFlow**: One-time upfront payment
- **PayAsYouGoFlow**: Usage-based billing
- **StreamPaymentFlow**: Continuous payment streams

### Utilities
- **IdlLoader**: Runtime IDL loading and caching
- **ErrorFactory**: Comprehensive error handling
- **Validator**: Input validation utilities

## Examples

Complete usage examples are available in the [`sdk/typescript/examples/`](../sdk/typescript/examples/) directory:

- [Agent Registration](../sdk/typescript/examples/register-agent.ts)
- [MCP Server Management](../sdk/typescript/examples/mcp-server-management.ts)

## Testing

The SDK includes comprehensive test coverage:

```bash
cd sdk/typescript
npm test              # Run all tests
npm run test:coverage # Run with coverage report
```

## Development

See the [TypeScript SDK Implementation Guidelines](./TYPESCRIPT_SDK_IMPLEMENTATION_GUIDELINES.md) for detailed development instructions.

## Related Documentation

- [SDK Implementation Guidelines](./TYPESCRIPT_SDK_IMPLEMENTATION_GUIDELINES.md)
- [SDK Roadmap](./SDK_ROADMAP_DETAILED.md)
- [TypeScript SDK References](./sdk_refs/typescript_sdk_references.md)

## Support

For issues and questions related to the TypeScript SDK:
- Create an issue in the [GitHub repository](https://github.com/openSVM/aeamcp/issues)
- Check the [examples](../sdk/typescript/examples/) for common patterns
- Review the generated TypeDoc documentation for detailed API reference