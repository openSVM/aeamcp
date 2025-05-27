# Solana AI Registries Protocol Specification

## Overview

The Solana AI Registries protocol is designed to provide essential infrastructure for discovering, verifying, and interacting with autonomous AI agents and Model Context Protocol (MCP) servers. This protocol consists of two interconnected on-chain registries:

1. **Agent Registry**: A decentralized directory for autonomous agents operating on Solana, supporting the advertisement of agent capabilities, endpoints, identity, and metadata following the Autonomous Economic Agent (AEA) and Agent-to-Agent (A2A) paradigms.

2. **MCP Server Registry**: A directory for Model Context Protocol (MCP) compliant servers, enabling the discovery of AI tools, resources, and prompts following the MCP specification.

## Core Architecture

Both registries use a hybrid storage model:
- Essential verifiable data resides on-chain
- More extensive metadata is stored off-chain (e.g., on IPFS/Arweave) and linked via URIs
- On-chain hashes ensure data integrity of off-chain content
- Detailed events are emitted for robust off-chain indexing and query services

## Agent Registry Specification

### Data Structure

The Agent Registry stores `AgentRegistryEntryV1` structures with the following key components:

- **Identity Information**: agent_id, name, description, agent_version
- **Ownership**: owner_authority (Solana public key)
- **Contact Information**: provider_name, provider_url, documentation_url
- **Endpoints**: service_endpoints (protocol, URL, is_default)
- **Capabilities**: capabilities_flags, supported input/output modes
- **Skills**: Vector of AgentSkill structs (id, name, description_hash, tags)
- **Economic Identity**: aea_address, economic_intent_summary
- **Status**: operational status (Pending, Active, Inactive, Deregistered)
- **Metadata**: extended_metadata_uri, tags, registration/update timestamps

### Agent Registry Instructions

1. **register_agent**: Create a new agent entry
2. **update_agent_details**: Modify mutable fields of an existing agent
3. **update_agent_status**: Change an agent's operational status
4. **deregister_agent**: Mark an agent as deregistered

## MCP Server Registry Specification

### Data Structure

The MCP Server Registry stores `McpServerRegistryEntryV1` structures with the following key components:

- **Identity Information**: server_id, name, server_version
- **Ownership**: owner_authority (Solana public key)
- **Endpoint**: service_endpoint, documentation_url
- **Capabilities**: server_capabilities_summary, capability flags (resources, tools, prompts)
- **Offerings**: 
  - onchain_tool_definitions (name, hashes of description/input/output schemas, tags)
  - onchain_resource_definitions (uri_pattern, description_hash, tags)
  - onchain_prompt_definitions (name, description_hash, tags)
- **Status**: operational status (Pending, Active, Inactive, Deregistered)
- **Metadata**: full_capabilities_uri, tags, registration/update timestamps

### MCP Server Registry Instructions

1. **register_mcp_server**: Create a new MCP server entry
2. **update_mcp_server_details**: Modify mutable fields of an existing server
3. **update_mcp_server_status**: Change a server's operational status
4. **deregister_mcp_server**: Mark a server as deregistered

## Discoverability Mechanisms

The protocol supports three levels of discovery:

1. **Direct On-Chain Lookup**: Fetch an entry directly if its ID is known (O(1) complexity)
2. **Limited On-Chain Filtering**: Filter by attributes included in PDA seeds
3. **Advanced Off-Chain Querying**: Off-chain indexers listen to on-chain events to build rich, queryable databases of registry entries

### Event Emission

Events emitted by the registries include:

**Agent Registry Events**:
- AgentRegistered (full entry data)
- AgentUpdated (changed fields)
- AgentStatusChanged
- AgentDeregistered

**MCP Server Registry Events**:
- McpServerRegistered (full entry data)
- McpServerUpdated (changed fields)
- McpServerStatusChanged
- McpServerDeregistered

## Security Considerations

- **Access Control**: Only the owner_authority of an entry can modify or deregister it
- **Data Validation**: All input fields are validated against constraints (max length, format)
- **Hash Verification**: On-chain hashes allow verification of off-chain content
- **Rent Economics**: Entries must be rent-exempt, funded by the registrant

## Protocol Governance

The protocol is governed by the designated upgrade authority, which may eventually transition to a DAO or foundation. Protocol parameters (fees, max string lengths, limits on on-chain definitions) may be updated through governance.

## Integration with Standards

- **A2A Protocol**: The Agent Registry follows key concepts from Google's Agent-to-Agent protocol
- **MCP Specification**: The MCP Server Registry aligns with the Model Context Protocol specification
- **Autonomous Economic Agents**: Incorporates principles from the AEA framework

## Technical Specifications

- **Storage**: Program Derived Addresses (PDAs) for each registry entry
- **Serialization**: Borsh for on-chain data
- **Maximum Account Size**: 10MB per PDA (Solana constraint)
- **PDA Seeds**: 
  - Agent entries: `["agent_reg_v1", agent_id.as_bytes()]`
  - MCP Server entries: `["mcp_srv_reg_v1", server_id.as_bytes()]`