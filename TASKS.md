# Implementation Tasks: MCP Registry Integration

## Task List (Ordered)

### Phase 1: Foundation
- [ ] T001: Create project directory structure
- [ ] T002: Create `libs/mcp-registry-client/Cargo.toml` with dependencies
- [ ] T003: Implement `McpRegistryClient` API client
- [ ] T004: Implement external server models
- [ ] T005: Implement data transformation layer
- [ ] T006: Write unit tests for transformation

### Phase 2: Sync Service
- [ ] T007: Create `services/registry-sync/Cargo.toml`
- [ ] T008: Implement sync service main logic
- [ ] T009: Add configuration handling
- [ ] T010: Add logging and error handling

### Phase 3: Backend Integration
- [ ] T011: Extend backend routes with registry endpoints
- [ ] T012: Add sync trigger endpoint
- [ ] T013: Add combined server listing endpoint

### Phase 4: Testing & Documentation
- [ ] T014: Run build verification
- [ ] T015: Write integration test
- [ ] T016: Update README with usage docs
- [ ] T017: Generate llms.txt

## Dependencies

- Phase 1 tasks can run in parallel after T001
- Phase 2 depends on Phase 1 completion
- Phase 3 depends on Phase 2 completion
- Testing runs after each phase

## Notes

- Use `reqwest` with `rustls-tls` for HTTP
- Follow existing code patterns in `programs/mcp-server-registry/`
- Reuse types from `McpServerRegistryEntryV1` state struct
- Keep service focused: sync external → on-chain only
