# Developer Guide: Solana AI Registries

This guide provides developers with the information needed to interact with the Solana AI Registries protocol, including integrating with the Agent Registry and MCP Server Registry.

## Getting Started

### Prerequisites

- Basic understanding of Solana programming model (accounts, PDAs, transactions)
- Familiarity with Rust if you're developing on-chain integrations
- Solana CLI tools (`solana-cli`) installed for testing and deployment
- A Solana wallet with SOL for transaction fees

### Setting Up Your Environment

1. Install Rust and Solana toolchain
   ```bash
   curl --proto '=https' --tlsv1.2 -sSf https://sh.rustup.rs | sh
   sh -c "$(curl -sSfL https://release.solana.com/v1.14.18/install)"
   ```

2. Install Anchor framework for Solana development
   ```bash
   npm i -g @project-serum/anchor-cli
   ```

3. Clone the registry project (if available)
   ```bash
   git clone https://github.com/openSVM/aeamcp.git
   cd aeamcp
   ```

## Registry Protocol Overview

The Solana AI Registries protocol consists of two main components:

1. **Agent Registry**: For registering and discovering autonomous agents
2. **MCP Server Registry**: For registering and discovering Model Context Protocol servers

Both registries use Solana's Program Derived Addresses (PDAs) to store entries and emit events for off-chain indexing.

## Working with the Agent Registry

### Registering an Agent

```javascript
// JavaScript example using @solana/web3.js and anchor
const { PublicKey, SystemProgram } = require('@solana/web3.js');
const anchor = require('@project-serum/anchor');

async function registerAgent(
  program,
  wallet,
  agentId,
  name,
  description,
  agentVersion,
  // ... other parameters
) {
  // Generate the PDA for this agent
  const [agentPDA, bump] = await PublicKey.findProgramAddressSync(
    [
      Buffer.from('agent_reg_v1'),
      Buffer.from(agentId)
    ],
    program.programId
  );

  // Invoke the register_agent instruction
  await program.methods.registerAgent(
    agentId,
    name,
    description,
    agentVersion,
    // ... other parameters
  )
  .accounts({
    agentEntry: agentPDA,
    ownerAuthority: wallet.publicKey,
    payer: wallet.publicKey,
    systemProgram: SystemProgram.programId,
  })
  .rpc();
  
  console.log(`Agent registered with ID: ${agentId} at PDA: ${agentPDA.toString()}`);
}
```

### Updating Agent Details

```javascript
async function updateAgentDetails(
  program,
  wallet,
  agentId,
  updatedFields
) {
  const [agentPDA] = await PublicKey.findProgramAddressSync(
    [
      Buffer.from('agent_reg_v1'),
      Buffer.from(agentId)
    ],
    program.programId
  );

  // Create update details input object
  const updateDetailsInput = {
    // Set only the fields you want to update
    name: updatedFields.name || null,
    description: updatedFields.description || null,
    // ... other fields
  };

  await program.methods.updateAgentDetails(updateDetailsInput)
    .accounts({
      agentEntry: agentPDA,
      ownerAuthority: wallet.publicKey,
    })
    .rpc();
  
  console.log(`Agent ${agentId} details updated`);
}
```

### Fetching Agent Data

```javascript
async function getAgentData(
  program,
  agentId
) {
  const [agentPDA] = await PublicKey.findProgramAddressSync(
    [
      Buffer.from('agent_reg_v1'),
      Buffer.from(agentId)
    ],
    program.programId
  );

  // Fetch the account data
  const agentData = await program.account.agentRegistryEntryV1.fetch(agentPDA);
  return agentData;
}
```

## Working with the MCP Server Registry

### Registering an MCP Server

```javascript
async function registerMcpServer(
  program,
  wallet,
  serverId,
  name,
  serverVersion,
  serviceEndpoint,
  // ... other parameters
) {
  // Generate the PDA for this MCP server
  const [serverPDA, bump] = await PublicKey.findProgramAddressSync(
    [
      Buffer.from('mcp_srv_reg_v1'),
      Buffer.from(serverId)
    ],
    program.programId
  );

  // Invoke the register_mcp_server instruction
  await program.methods.registerMcpServer(
    serverId,
    name,
    serverVersion,
    serviceEndpoint,
    // ... other parameters
  )
  .accounts({
    mcpServerEntry: serverPDA,
    ownerAuthority: wallet.publicKey,
    payer: wallet.publicKey,
    systemProgram: SystemProgram.programId,
  })
  .rpc();
  
  console.log(`MCP Server registered with ID: ${serverId} at PDA: ${serverPDA.toString()}`);
}
```

### Updating MCP Server Details

```javascript
async function updateMcpServerDetails(
  program,
  wallet,
  serverId,
  updatedFields
) {
  const [serverPDA] = await PublicKey.findProgramAddressSync(
    [
      Buffer.from('mcp_srv_reg_v1'),
      Buffer.from(serverId)
    ],
    program.programId
  );

  // Create update details input object
  const updateDetailsInput = {
    // Set only the fields you want to update
    name: updatedFields.name || null,
    serverVersion: updatedFields.serverVersion || null,
    // ... other fields
  };

  await program.methods.updateMcpServerDetails(updateDetailsInput)
    .accounts({
      mcpServerEntry: serverPDA,
      ownerAuthority: wallet.publicKey,
    })
    .rpc();
  
  console.log(`MCP Server ${serverId} details updated`);
}
```

## Listening to Registry Events

Registry events can be monitored to keep track of changes in the ecosystem:

```javascript
async function setupEventListener(program) {
  // Listen for new agent registrations
  program.addEventListener('AgentRegistered', (event, slot) => {
    console.log(`New agent registered: ${event.agentId}`);
    console.log(`Agent details: ${JSON.stringify(event)}`);
  });
  
  // Listen for MCP server registrations
  program.addEventListener('McpServerRegistered', (event, slot) => {
    console.log(`New MCP server registered: ${event.serverId}`);
    console.log(`Server details: ${JSON.stringify(event)}`);
  });
}
```

## Building an Off-Chain Indexer

Off-chain indexers enhance discoverability by providing advanced search capabilities:

1. Listen for on-chain events from the registries
2. Fetch and parse on-chain data
3. Resolve off-chain metadata from URIs
4. Store in a queryable database
5. Expose search APIs

```javascript
// Example pseudocode for indexer setup
async function setupIndexer(connection, programId) {
  // Set up a websocket connection to listen for program logs
  connection.onLogs(programId, (logs) => {
    // Parse logs to extract events
    const events = parseEventsFromLogs(logs);
    
    // For each event, process accordingly
    for (const event of events) {
      if (event.name === 'AgentRegistered') {
        indexAgentData(event);
      } else if (event.name === 'McpServerRegistered') {
        indexMcpServerData(event);
      }
      // Handle other events...
    }
  });
}

async function indexAgentData(event) {
  // Store core data in database
  await db.agents.insert({
    agentId: event.agentId,
    name: event.name,
    skills: event.skills,
    // ... other fields
  });
  
  // If extended metadata URI is provided, fetch and index it
  if (event.extendedMetadataUri) {
    const extendedData = await fetchJsonFromUri(event.extendedMetadataUri);
    await db.agentExtendedMetadata.insert({
      agentId: event.agentId,
      extendedData
    });
  }
}
```

## Best Practices

### Data Size Management

- Keep on-chain data minimal to reduce costs
- Store larger assets off-chain with on-chain hashes for verification
- Use consistent off-chain metadata schemas for interoperability

### Security Considerations

- Always verify transaction signers match the owner_authority
- Validate off-chain content against on-chain hashes
- Implement proper error handling for failed transactions

### Performance Optimization

- Batch similar operations when possible
- Use getProgramAccounts efficiently with appropriate filters
- Implement caching for frequently accessed registry data

## Integration Examples

### Agent Framework Integration

```javascript
class AgentRegistryIntegration {
  constructor(agent, program, wallet) {
    this.agent = agent;
    this.program = program;
    this.wallet = wallet;
  }
  
  async registerWithRegistry() {
    // Convert agent capabilities to registry format
    const agentSkills = this.agent.capabilities.map(cap => ({
      id: cap.id,
      name: cap.name,
      descriptionHash: computeHash(cap.description),
      tags: cap.tags
    }));
    
    await registerAgent(
      this.program,
      this.wallet,
      this.agent.id,
      this.agent.name,
      this.agent.description,
      this.agent.version,
      null, // providerName
      null, // providerUrl
      this.agent.documentationUrl,
      this.agent.endpoints.map(e => ({
        protocol: e.protocol,
        url: e.url,
        isDefault: e.isDefault
      })),
      this.agent.capabilitiesFlags,
      this.agent.supportedInputModes,
      this.agent.supportedOutputModes,
      agentSkills,
      null, // securityInfoUri
      null, // aeaAddress
      null, // economicIntentSummary
      null, // supportedAeaProtocolsHash
      this.agent.extendedMetadataUri,
      this.agent.tags
    );
  }
}
```

## Troubleshooting

### Common Errors

1. **InvalidAgentIdLength / InvalidServerIdLength**: Ensure IDs are within length limits
2. **Unauthorized**: The signer must match the owner_authority of the entry
3. **TooManyServiceEndpoints / TooManySkills**: Respect the maximum array length limits
4. **MultipleDefaultEndpoints**: Only one service endpoint can be marked as default
5. **BumpSeedNotInHashMap**: Internal error related to PDA derivation

### Debugging Tips

- Use `program.simulate` to test transactions without submitting them
- Check transaction logs for detailed error information
- Verify PDA derivation matches expected seeds and program ID
- Ensure account data deserializes correctly to the expected structure