# MCP Registry Integration Specification

## 1. Project Overview

**Goal:** Integrate the external MCP Registry server (https://github.com/modelcontextprotocol/registry) into the existing Solana-based MCP Server Registry program.

**Existing System:**
- Solana programs: `agent-registry`, `mcp-server-registry`, `svmai-token`
- On-chain storage of MCP server metadata
- Rust-based with Anchor framework

**External System:**
- Go-based HTTP service (MCP Registry)
- REST API for MCP server discovery
- Provides listing of available MCP servers

## 2. Integration Strategy

### Option A: Sync Bridge Service
Create a Rust service that:
1. Fetches servers from external MCP Registry API
2. Validates and transforms data
3. Stores validated servers on-chain via existing program instructions
4. Runs periodically to keep data in sync

### Option B: API Gateway Pattern
Extend the existing backend API to:
1. Proxy requests to external MCP Registry
2. Cache results for performance
3. Optionally store popular/verified servers on-chain

### Option C: Hybrid Approach
1. Use external registry as primary discovery source
2. Store verified/premium servers on-chain
3. Provide unified API to clients

## 3. Technical Requirements

### External Registry API (v0.1 - Frozen)
- List all servers: `GET /api/v0/servers`
- Get server details: `GET /api/v0/servers/{id}`
- Server schema includes: id, name, description, endpoint, capabilities

### Rust HTTP Client
- Use `reqwest` crate for HTTP calls
- Async/await pattern with tokio runtime
- Error handling and retry logic

### Data Transformation
- Map external registry server schema to on-chain `McpServerRegistryEntryV1`
- Handle field differences between systems

## 4. Implementation Phases

1. **Phase 1:** API client library for external registry
2. **Phase 2:** Data transformation layer
3. **Phase 3:** Sync service implementation
4. **Phase 4:** Backend API integration
5. **Phase 5:** Testing and documentation

## 5. Acceptance Criteria

- [ ] Can fetch server list from external MCP Registry
- [ ] Can transform external server data to on-chain format
- [ ] Sync service can add/update servers on-chain
- [ ] Backend API exposes combined registry data
- [ ] Unit tests pass for transformation logic
- [ ] Integration tests verify end-to-end flow
