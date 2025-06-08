# Chapter 1: Registry Entry Accounts

Welcome to the first chapter of the `aeamcp` tutorial! We're starting our journey by looking at the fundamental building blocks of our decentralized registry: **Registry Entry Accounts**.

Imagine you're looking for a specific AI agent on the Solana blockchain – perhaps one that can analyze market data, or maybe a server that provides powerful language model tools. Where does the information about these agents and servers live? How can you find out their name, what they do, or where to connect to them?

This is where **Registry Entry Accounts** come in. Think of each registered AI agent or MCP (Model Context Protocol) server as having its own unique digital passport or profile stored directly on the Solana blockchain. These "passports" are the Registry Entry Accounts.

## What are Registry Entry Accounts?

In simple terms, a Registry Entry Account is a dedicated space on the Solana blockchain that holds all the essential, verified information about a single registered entity – either an AI agent or an MCP server.

*   **For Agents:** They store details about a specific AI agent.
*   **For MCP Servers:** They store details about a specific MCP server.

Each account is carefully structured to hold specific types of data, like names, versions, network addresses (endpoints), what they are capable of, and links to more detailed information stored elsewhere (like on decentralized storage networks such as IPFS).

They serve as the official, permanent, on-chain record for every agent or server that registers with the `aeamcp` program.

## Two Types of Entries

Since the `aeamcp` program manages two different types of entities (AI Agents and MCP Servers), there are two main types of Registry Entry Accounts, each designed to hold the specific information relevant to that type:

*   **Agent Registry Entry:** An account storing data for an AI agent (`AgentRegistryEntryV1`).
*   **MCP Server Registry Entry:** An account storing data for an MCP server (`McpServerRegistryEntryV1`).

Let's look at the kind of information these accounts store.

### Agent Registry Entry (`AgentRegistryEntryV1`)

This account holds the core details for an AI agent. It's like the agent's business card on the blockchain.

Here are some key pieces of information you'd find in an `AgentRegistryEntryV1` account:

*   **`agent_id`**: A unique identifier for the agent.
*   **`name`**: A human-friendly name (like "Market Analyzer Agent").
*   **`description`**: What the agent does.
*   **`agent_version`**: Which version of the agent software this is.
*   **`service_endpoints`**: Where you can connect to the agent (e.g., an API URL).
*   **`skills`**: A summary of the agent's capabilities or skills.
*   **`status`**: The current state of the agent (like "Active", "Inactive", "Deregistered").
*   **`owner_authority`**: The Solana address that controls this entry.
*   **`extended_metadata_uri`**: A link to more detailed info stored off-chain.

You can see the structure defined in the program's Rust code. This tells us exactly what data fields are included and their types:

```rust
// from programs/agent-registry/src/state.rs
#[derive(BorshSerialize, BorshDeserialize, Clone, Debug, PartialEq, ShankAccount)]
pub struct AgentRegistryEntryV1 {
    pub bump: u8,
    pub registry_version: u8,
    pub state_version: u64,
    pub operation_in_progress: bool,
    pub owner_authority: Pubkey,
    pub agent_id: String,
    // ... many other fields like name, description, version, endpoints, skills ...
    pub status: u8, // Enum AgentStatus
    pub registration_timestamp: i64,
    pub last_update_timestamp: i64,
    pub extended_metadata_uri: Option<String>,
    pub tags: Vec<String>,
    // ... additional token-related fields ...
}
```
*This code shows the structure (`struct`) of the data stored in an Agent Registry Entry account. Each line starting with `pub` is a field that holds a specific piece of information.*

From a frontend (e.g., website or app) perspective, this data is represented by TypeScript interfaces, like this simplified view:

```typescript
// from frontend/lib/types/onchain-types.ts
export interface OnChainAgentEntry {
  bump: number;
  registryVersion: number;
  ownerAuthority: PublicKey;
  agentId: string;
  name: string;
  description: string;
  agentVersion: string;
  // ... other fields ...
  serviceEndpoints: ServiceEndpoint[];
  capabilitiesFlags: bigint;
  supportedInputModes: string[];
  supportedOutputModes: string[];
  skills: AgentSkill[];
  status: number; // Corresponds to AgentStatus enum
  registrationTimestamp: bigint;
  lastUpdateTimestamp: bigint;
  extendedMetadataUri?: string;
  tags: string[];
}
```
*This TypeScript code shows how the data from the on-chain account is represented in a web application, using familiar types like `string`, `number`, `boolean`, and arrays.*

### MCP Server Registry Entry (`McpServerRegistryEntryV1`)

Similarly, this account holds the core details for an MCP server, which provides AI tools, resources, or prompts.

Key pieces of information in an `McpServerRegistryEntryV1` account include:

*   **`server_id`**: A unique identifier for the server.
*   **`name`**: A human-friendly server name (like "Image Generation API").
*   **`server_version`**: Version of the server software.
*   **`service_endpoint`**: The main URL for MCP communication.
*   **`supports_resources`**, **`supports_tools`**, **`supports_prompts`**: Flags indicating what types of services it offers.
*   **`onchain_tool_definitions`**, etc.: Summaries of a few key tools, resources, or prompts available.
*   **`status`**: The current state of the server.
*   **`owner_authority`**: The Solana address that controls this entry.
*   **`full_capabilities_uri`**: A link to a complete list of services offered, stored off-chain.

Here's the Rust structure for the MCP Server Entry:

```rust
// from programs/mcp-server-registry/src/state.rs
#[derive(BorshSerialize, BorshDeserialize, Debug, Clone, PartialEq)]
pub struct McpServerRegistryEntryV1 {
    pub bump: u8,
    pub registry_version: u8,
    pub state_version: u64,
    pub operation_in_progress: bool,
    pub owner_authority: Pubkey,
    pub server_id: String,
    pub name: String,
    pub server_version: String,
    pub service_endpoint: String,
    // ... other fields ...
    pub supports_resources: bool,
    pub supports_tools: bool,
    pub supports_prompts: bool,
    pub onchain_tool_definitions: Vec<McpToolDefinitionOnChain>,
    pub onchain_resource_definitions: Vec<McpResourceDefinitionOnChain>,
    pub onchain_prompt_definitions: Vec<McpPromptDefinitionOnChain>,
    pub status: u8, // Enum McpServerStatus
    pub registration_timestamp: i64,
    pub last_update_timestamp: i64,
    pub full_capabilities_uri: Option<String>,
    pub tags: Vec<String>,
    // ... additional token-related fields ...
}
```
*Similar to the agent entry, this Rust code defines the structure of the data for an MCP Server Entry account on Solana.*

And the corresponding TypeScript interface for frontend applications:

```typescript
// from frontend/lib/types/onchain-types.ts
export interface OnChainMcpServerEntry {
  bump: number;
  registryVersion: number;
  ownerAuthority: PublicKey;
  serverId: string;
  name: string;
  serverVersion: string;
  serviceEndpoint: string;
  // ... other fields ...
  supportsResources: boolean;
  supportsTools: boolean;
  supportsPrompts: boolean;
  onchainToolDefinitions: McpToolDefinitionOnChain[];
  onchainResourceDefinitions: McpResourceDefinitionOnChain[];
  onchainPromptDefinitions: McpPromptDefinitionOnChain[];
  status: number; // Corresponds to McpServerStatus enum
  registrationTimestamp: bigint;
  lastUpdateTimestamp: bigint;
  fullCapabilitiesUri?: string;
  tags: string[];
}
```
*This is the TypeScript representation of the MCP Server Entry data for frontend use.*

## Why Separate Accounts?

In Solana, programs themselves don't store data directly within their code. Data is stored in separate **accounts**. When an AI agent or MCP server registers, the registry program doesn't just write information into its own code; it creates or uses a dedicated *data account* specifically for that agent or server.

These Registry Entry Accounts are owned and controlled by the registry program. This means only the program's code can modify the data inside them, ensuring that registration information is managed according to the program's rules (like requiring the owner's signature for updates).

## How Does This Help Find Agents/Servers?

To find an AI agent or MCP server, you need to be able to discover and read their Registry Entry Accounts.

Imagine a scenario where a user wants to find an "active" agent that has the "text analysis" skill.

1.  The user interacts with a frontend application (like a website).
2.  The frontend needs to query the Solana blockchain to find relevant Registry Entry Accounts.
3.  It asks the blockchain network for `AgentRegistryEntryV1` accounts.
4.  It then filters these accounts, looking for ones where the `status` is "Active" and the `skills` list includes "text analysis".
5.  The frontend reads the data (name, description, endpoints, etc.) from these matching accounts and presents it to the user.

The Registry Entry Account is the source of truth for the agent's or server's identity and key discovery information on the blockchain.

Here's a simplified flow for registering an entry:

```mermaid:diagrams/ch1-register-sequence.mmd
```
*This diagram shows how a new Registry Entry Account is created on Solana when someone registers an agent through the program.*

## Summary Table

Let's quickly compare the core purposes of the two account types:

| Feature           | Agent Registry Entry (`AgentRegistryEntryV1`)        | MCP Server Registry Entry (`McpServerRegistryEntryV1`)      |
| :---------------- | :--------------------------------------------------- | :---------------------------------------------------------- |
| **Purpose**       | Store info for an AI Agent                           | Store info for an MCP Server (AI tools, resources, prompts) |
| **Key Identifiers**| `agent_id`, `name`                                   | `server_id`, `name`                                         |
| **Connectivity Info** | `service_endpoints` (list, includes default)       | `service_endpoint` (single main URL)                        |
| **Capabilities Info**| `skills` (list of AgentSkill structs), `capabilities_flags` | `supports_resources`, `supports_tools`, `supports_prompts`, `onchain_tool_definitions`, etc. |
| **Off-chain Link**| `extended_metadata_uri`                              | `full_capabilities_uri`                                     |
| **Controlled By** | Program's `AgentRegistryEntryV1` definition          | Program's `McpServerRegistryEntryV1` definition             |

## Conclusion

Registry Entry Accounts are the backbone of the `aeamcp` project's registry. They are dedicated data containers on the Solana blockchain, controlled by the registry program, that hold the structured, on-chain information for each registered AI agent and MCP server. Understanding these accounts is the first step to understanding how the registry works, as they are where all the discoverable data resides.

In the next chapter, we'll dive into the **Agent Registry Program** itself, the smart contract that defines how these agent accounts are created, updated, and managed.

[Agent Registry Program](02_agent_registry_program_.md)

---
