# Solana AI Registries SDK – Atomic Execution Plan

**Overarching Objective:**  
Deliver a production-grade, multi-language SDK suite for Solana AI Registries, with 100% protocol and payment flow coverage, fully automated CI/CD, and comprehensive usage examples—enabling any developer to integrate, extend, and publish registry-compatible agents and MCP servers with zero friction.

---

| Task ID | Task Description | ETA (h) | Detailed Acceptance Criteria |
|---------|------------------|---------|-----------------------------|
| 0.1 | Implement and validate `idl/agent_registry.json` (Anchor IDL, v1 hash) | 2 | - File exists in `idl/`.<br>- Matches deployed on-chain program (hash check).<br>- Passes `verify-idl-hash` CI job.<br>- Validated by at least one integration test using this IDL. |
| 0.2 | Implement and validate `idl/mcp_server_registry.json` (Anchor IDL, v1 hash) | 2 | - File exists in `idl/`.<br>- Matches deployed on-chain program (hash check).<br>- Passes `verify-idl-hash` CI job.<br>- Validated by at least one integration test using this IDL. |
| 0.3 | Implement and validate `idl/svmai_token.json` (SPL-mint interface) | 1 | - File exists in `idl/`.<br>- Matches SPL-mint spec.<br>- Used in at least one payment flow test.<br>- Passes schema validation. |
| 0.4 | Author `schemas/payment-metadata.schema.json` (strict JSON Schema) | 1 | - Schema file exists.<br>- Validates all required payment metadata fields.<br>- All valid/invalid fixtures pass/fail as expected.<br>- CI job runs schema validation. |
| 0.5 | Author all fixtures in `fixtures/` (valid/invalid agent, MCP, pricing) | 2 | - All fixture files present.<br>- Each valid fixture passes schema validation.<br>- Each invalid fixture fails as expected.<br>- Used in at least one SDK test. |
| 0.6 | Implement `verify-idl-hash` CI job | 1 | - CI job present in `.github/workflows`.<br>- Fails on intentional IDL hash drift.<br>- Passes on correct IDL.<br>- Documented in contributing guide. |
| 1.1 | Implement `solana_ai_registries` crate: `lib.rs` (exports, feature gates) | 2 | - File compiles.<br>- All modules exported.<br>- Feature gates toggle code paths.<br>- Documented in crate README. |
| 1.2 | Implement `agent/mod.rs` (agent builder, typed requests) | 3 | - All agent CRUD ops implemented.<br>- Unit tests for each function.<br>- API documented with doc comments.<br>- 100% branch coverage. |
| 1.3 | Implement `mcp/mod.rs` (server builder, typed requests) | 3 | - All MCP CRUD ops implemented.<br>- Unit tests for each function.<br>- API documented.<br>- 100% branch coverage. |
| 1.4 | Implement `payments/mod.rs` (prepay, pyg, stream) | 3 | - All payment flows implemented.<br>- Unit tests for each flow.<br>- Handles edge cases (insufficient funds, etc).<br>- API documented. |
| 1.5 | Implement `client.rs` (RPC wrapper) | 2 | - All public API calls succeed against devnet.<br>- Handles errors gracefully.<br>- Integration test with devnet.<br>- API documented. |
| 1.6 | Implement `errors.rs` (error enums) | 1 | - All error codes match on-chain.<br>- Unit tests for error mapping.<br>- Documented in code. |
| 1.7 | Implement `idl.rs` (compile-time IDL inclusion) | 1 | - IDL loaded at compile time.<br>- No runtime errors.<br>- Documented usage. |
| 1.8 | Write `tests/agent_flow.rs` (agent CRUD, 26 cases) | 2 | - All tests present.<br>- 100% pass rate.<br>- Each test covers a unique code path.<br>- Test output reproducible. |
| 1.9 | Write `tests/payment_pyg.rs` (CU, balance) | 1 | - All payment edge cases tested.<br>- Tests pass.<br>- Output matches expected balances. |
| 1.10 | Write snapshot tests against devnet ledger | 2 | - Snapshots generated.<br>- Snapshots match expected ledger state.<br>- Test rerun produces identical output. |
| 1.11 | Implement feature flags: `stream`, `pyg`, `prepay` | 1 | - Flags toggle features.<br>- CI passes all flag combinations.<br>- Documented in README. |
| 1.12 | Implement `cargo publish` gating (deny, MSRV) | 1 | - CI blocks publish if deny/MSRV fails.<br>- Documented in contributing guide. |
| 2.1 | Implement `@svmai/registries` `src/agent.ts` (AgentAPI) | 2 | - All agent CRUD ops implemented.<br>- Unit tests for each.<br>- API documented with JSDoc.<br>- 100% branch coverage. |
| 2.2 | Implement `src/mcp.ts` (MCPAPI) | 2 | - All MCP CRUD ops implemented.<br>- Unit tests for each.<br>- API documented.<br>- 100% branch coverage. |
| 2.3 | Implement `payments/prepay.ts`, `pyg.ts`, `stream.ts` | 3 | - All payment flows implemented.<br>- Unit tests for each.<br>- Handles edge cases.<br>- API documented. |
| 2.4 | Implement `utils/idl.ts`, `borsh.ts` | 2 | - IDL loads.<br>- Borsh helpers pass serialization tests.<br>- Documented usage. |
| 2.5 | Write `examples/register-agent.ts`, `update-server.ts`, `pay-pyg.ts` | 2 | - All examples run.<br>- Output matches expected.<br>- Usage documented in README. |
| 2.6 | Implement Jest tests, local validator fixture | 2 | - All tests pass.<br>- Coverage >90%.<br>- Validator starts/stops cleanly. |
| 2.7 | Implement `npm run docs` (typedoc) | 1 | - Docs build.<br>- All public APIs covered.<br>- Output published to docs site. |
| 3.1 | Implement `client` (RPC + Tx builder) | 2 | - All public API calls succeed against devnet.<br>- Handles errors.<br>- API documented. |
| 3.2 | Implement `agent` / `mcp` (high-level ops) | 2 | - All CRUD ops implemented.<br>- Unit tests for each.<br>- API documented. |
| 3.3 | Implement `payments` (all flows) | 2 | - All payment flows implemented.<br>- Unit tests for each.<br>- Handles edge cases.<br>- API documented. |
| 3.4 | Implement `idl` (go:embed structs) | 1 | - IDL loads.<br>- Struct mapping correct.<br>- Documented usage. |
| 3.5 | Write integration test: `go test ./... -run TestIntegration -tags=devnet` | 2 | - All tests pass.<br>- Coverage >90%.<br>- Output reproducible. |
| 4.1 | Implement `ai_registries.agent` / `mcp` | 2 | - All CRUD ops implemented.<br>- Unit tests for each.<br>- API documented. |
| 4.2 | Implement `ai_registries.payments` (async) | 2 | - All payment flows implemented.<br>- Unit tests for each.<br>- Handles edge cases.<br>- API documented. |
| 4.3 | Implement `ai_registries.idl` (anchorpy.Idl) | 1 | - IDL loads.<br>- Struct mapping correct.<br>- Documented usage. |
| 4.4 | Write Jupyter notebook examples | 2 | - All examples run.<br>- Output matches expected.<br>- Usage documented in README. |
| 4.5 | Implement Sphinx docs, RTD publish | 2 | - Docs build.<br>- All public APIs covered.<br>- Output published to RTD. |
| 5.1 | Implement `libaireg` core: `include/aireg.h`, `src/agent.c`, `src/mcp.c`, `src/payments.c` | 4 | - All functions compile.<br>- Unit tests for each.<br>- API documented in header.<br>- 100% branch coverage. |
| 5.2 | Implement `bindings/solana/` (anchor-gen) | 1 | - Bindings generated.<br>- Compile without error.<br>- Used in at least one test. |
| 5.3 | Write `examples/register.c` | 1 | - Example compiles.<br>- Registers agent successfully.<br>- Output matches expected. |
| 5.4 | Implement CMake build, `cmake -B build && cmake --build build` | 1 | - Build completes.<br>- Artefacts produced.<br>- Output matches expected. |
| 5.5 | Validate ABI, pointer safety, error codes | 1 | - Fuzz tests pass.<br>- No memory errors.<br>- Error codes documented. |
| 6.1 | Implement header-only `aireg.hpp` (RAII, namespaces) | 2 | - Header compiles.<br>- All classes usable.<br>- API documented. |
| 6.2 | Implement bridge to `libaireg` via `extern "C"` | 1 | - Bridge compiles.<br>- All functions callable.<br>- Used in at least one test. |
| 6.3 | Write example usage | 1 | - Example compiles.<br>- Registers agent successfully.<br>- Output matches expected. |
| 7.1 | Implement `.github/workflows/sdk.yml` (CI matrix) | 2 | - All jobs run.<br>- Pass on Linux & macOS.<br>- Output matches expected. |
| 7.2 | Implement `.github/workflows/publish.yml` (publishing) | 2 | - All jobs publish to correct ecosystem on tag.<br>- Artefacts available in package manager.<br>- Output matches expected. |
| 7.3 | Validate tag conventions and OIDC secrets | 1 | - All secrets work.<br>- Test publish with dummy tag.<br>- Output matches expected. |
| 8.1 | Write `01_mint_svmai.sh` (mint + treasury ATA) | 1 | - Script runs.<br>- Mints SVMAI.<br>- Creates ATA.<br>- Output matches expected. |
| 8.2 | Write `02_register_mcp.<lang>` for each SDK | 2 | - Script runs.<br>- Registers MCP.<br>- Attaches pricing metadata.<br>- Output matches expected. |
| 8.3 | Write `03_client_pay_and_call.<lang>` for each SDK | 2 | - Script runs.<br>- Performs PYG payment.<br>- Calls HTTP endpoint.<br>- Parses response.<br>- Output matches expected. |

---

**All tasks are atomic, parallelizable, and have no hidden dependencies. Each has clear, objective acceptance criteria and realistic ETA.**