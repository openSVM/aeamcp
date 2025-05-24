# Solana AI Registries - Interface Definition Language (IDL) Files

This directory contains the IDL files for the Solana AI Registries programs. These files define the interface for interacting with the programs and can be used by client applications, SDKs, and tools to generate type-safe bindings.

## Files

### [`agent_registry.json`](./agent_registry.json)
IDL for the Agent Registry program that manages AI agent registrations on Solana.

**Program Address**: `AgentRegistryProgram11111111111111111111111`

**Instructions**:
- `registerAgent` - Register a new AI agent
- `updateAgentDetails` - Update agent information
- `updateAgentStatus` - Change agent status (Pending/Active/Inactive/Deregistered)
- `deregisterAgent` - Remove agent from registry

**Key Account Types**:
- `AgentRegistryEntryV1` - Main account storing agent data

**Key Data Types**:
- `ServiceEndpoint` - Agent service endpoint configuration
- `AgentSkill` - Agent capability/skill definition
- `AgentUpdateDetailsInput` - Update parameters for agent details

### [`mcp_server_registry.json`](./mcp_server_registry.json)
IDL for the MCP Server Registry program that manages Model Context Protocol server registrations.

**Program Address**: `McpServerRegistryProgram1111111111111111111`

**Instructions**:
- `registerMcpServer` - Register a new MCP server
- `updateMcpServerDetails` - Update server information
- `updateMcpServerStatus` - Change server status
- `deregisterMcpServer` - Remove server from registry

**Key Account Types**:
- `McpServerRegistryEntryV1` - Main account storing MCP server data

**Key Data Types**:
- `McpToolDefinitionOnChain` - On-chain tool definition summary
- `McpResourceDefinitionOnChain` - On-chain resource definition summary
- `McpPromptDefinitionOnChain` - On-chain prompt definition summary
- `McpServerUpdateDetailsInput` - Update parameters for server details

## Events

Both programs emit events for key operations:

### Agent Registry Events
- `AgentRegisteredEvent` - Emitted when an agent is registered
- `AgentUpdatedEvent` - Emitted when agent details are updated
- `AgentStatusChangedEvent` - Emitted when agent status changes
- `AgentDeregisteredEvent` - Emitted when an agent is deregistered

### MCP Server Registry Events
- `McpServerRegistered` - Emitted when a server is registered
- `McpServerUpdated` - Emitted when server details are updated
- `McpServerStatusChanged` - Emitted when server status changes
- `McpServerDeregistered` - Emitted when a server is deregistered

## Error Codes

Both programs define comprehensive error codes for validation and operational failures. See the `errors` section in each IDL file for the complete list.

## Usage

These IDL files can be used with:

1. **Anchor Framework** - For TypeScript/JavaScript client generation
2. **Solana Web3.js** - For direct program interaction
3. **Rust clients** - Using `anchor-client` or custom deserialization
4. **Other language SDKs** - Any tool that can parse Anchor IDL format

### Example Usage with Anchor

```typescript
import { Program, AnchorProvider } from '@coral-xyz/anchor';
import { AgentRegistry } from './types/agent_registry';
import agentRegistryIdl from './idl/agent_registry.json';

const program = new Program(agentRegistryIdl as AgentRegistry, provider);

// Register an agent
await program.methods
  .registerAgent({
    agentId: "my-agent",
    name: "My AI Agent",
    description: "An example AI agent",
    // ... other parameters
  })
  .accounts({
    agentEntry: agentEntryPda,
    ownerAuthority: wallet.publicKey,
    payer: wallet.publicKey,
    systemProgram: SystemProgram.programId,
  })
  .rpc();
```

## Schema Version

Both IDL files are for version 0.1.0 of the programs and follow the registry schema version 1.

## Verification

The IDL files have been verified for accuracy and compatibility using automated tools:

### Verification Scripts

- **[`../scripts/verify-idl-improved.js`](../scripts/verify-idl-improved.js)** - Verifies IDL accuracy against source code
- **[`../scripts/test-idl-usage.js`](../scripts/test-idl-usage.js)** - Tests IDL compatibility with Solana tooling

### Running Verification

```bash
# Verify IDL accuracy against source code
node scripts/verify-idl-improved.js

# Test IDL compatibility and usage
node scripts/test-idl-usage.js
```

Both scripts should pass with ✅ status, confirming that:
- All instructions, accounts, types, and events are present in source code
- IDL structure is valid for Anchor and other Solana tools
- Type definitions are correct and compatible
- JSON serialization works properly

## Notes

- All string fields have maximum length constraints defined in the program constants
- Optional fields use Rust's `Option<T>` type, represented as `{"option": "type"}` in the IDL
- Hash fields are 32-byte arrays (`[u8; 32]`)
- Timestamps are 64-bit signed integers (`i64`)
- Status fields use `u8` values with defined enum mappings (0=Pending, 1=Active, 2=Inactive, 3=Deregistered)