# Integration Plan: MCP Registry Server

## Architecture

```
┌─────────────────┐     ┌─────────────────┐     ┌─────────────────┐
│ External MCP    │────▶│  Sync Service   │────▶│ Solana Program  │
│ Registry (Go)   │     │  (Rust)         │     │ (On-chain)      │
└─────────────────┘     └─────────────────┘     └─────────────────┘
                               │
                               ▼
                        ┌─────────────────┐
                        │  Backend API    │
                        │  (Unified View) │
                        └─────────────────┘
```

## Implementation Tasks

### Task 1: External Registry API Client
- Create `libs/mcp-registry-client/src/lib.rs`
- Implement `McpRegistryClient` struct
- Methods: `list_servers()`, `get_server(id)`
- Use `reqwest` with TLS support

### Task 2: Data Transformation Layer
- Create `libs/mcp-registry-client/src/transform.rs`
- Map external server schema → on-chain state
- Handle capability flags, endpoints, tags

### Task 3: Sync Service
- Create `services/registry-sync/src/main.rs`
- Periodic sync job (cron-like)
- Configurable interval
- Error handling and logging

### Task 4: Backend API Integration
- Extend `backend/src/routes/mcp.rs`
- Add `/api/registry/sync` endpoint
- Add `/api/registry/servers` (combined view)

### Task 5: Testing
- Unit tests for transformation
- Integration tests with mock registry
- API endpoint tests

## Files to Create

1. `libs/mcp-registry-client/Cargo.toml`
2. `libs/mcp-registry-client/src/lib.rs`
3. `libs/mcp-registry-client/src/models.rs`
4. `libs/mcp-registry-client/src/transform.rs`
5. `services/registry-sync/Cargo.toml`
6. `services/registry-sync/src/main.rs`
7. `services/registry-sync/config.toml`
8. Update `backend/src/routes/mcp.rs`
9. Tests and documentation

## Configuration

```toml
[registry_sync]
enabled = true
interval_seconds = 3600
registry_url = "https://registry.example.com"

[solana]
program_id = "..."
rpc_url = "..."
```
