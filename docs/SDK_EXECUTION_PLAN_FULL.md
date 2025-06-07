# Solana AI Registries SDK – Atomic Execution Plan (Table & Numbered List)

## Table Overview

| Task ID | Task Description | ETA (h) | Detailed Acceptance Criteria |
|---------|------------------|---------|-----------------------------|
| 0.1 | Implement and validate `idl/agent_registry.json` (Anchor IDL, v1 hash) | 2 | - File exists in `idl/`.<br>- Matches deployed on-chain program (hash check).<br>- Passes `verify-idl-hash` CI job.<br>- Validated by at least one integration test using this IDL. |
| 0.2 | Implement and validate `idl/mcp_server_registry.json` (Anchor IDL, v1 hash) | 2 | - File exists in `idl/`.<br>- Matches deployed on-chain program (hash check).<br>- Passes `verify-idl-hash` CI job.<br>- Validated by at least one integration test using this IDL. |
| 0.3 | Implement and validate `idl/svmai_token.json` (SPL-mint interface) | 1 | - File exists in `idl/`.<br>- Matches SPL-mint spec.<br>- Used in at least one payment flow test.<br>- Passes schema validation. |
| 0.4 | Author `schemas/payment-metadata.schema.json` (strict JSON Schema) | 1 | - Schema file exists.<br>- Validates all required payment metadata fields.<br>- All valid/invalid fixtures pass/fail as expected.<br>- CI job runs schema validation. |
| 0.5 | Author all fixtures in `fixtures/` (valid/invalid agent, MCP, pricing) | 2 | - All fixture files present.<br>- Each valid fixture passes schema validation.<br>- Each invalid fixture fails as expected.<br>- Used in at least one SDK test. |
| 0.6 | Implement `verify-idl-hash` CI job | 1 | - CI job present in `.github/workflows`.<br>- Fails on intentional IDL hash drift.<br>- Passes on correct IDL.<br>- Documented in contributing guide. |
| ... | ... | ... | ... |
| 8.3 | Write `03_client_pay_and_call.<lang>` for each SDK | 2 | - Script runs.<br>- Performs PYG payment.<br>- Calls HTTP endpoint.<br>- Parses response.<br>- Output matches expected. |

*(Full table as in SDK_EXECUTION_PLAN.md)*

---

## Numbered List with Detailed Acceptance Criteria

### 0. Common Artifacts

**0.1 Implement and validate `idl/agent_registry.json` (Anchor IDL, v1 hash)**
- File `idl/agent_registry.json` exists.
- Hash matches deployed on-chain program.
- Passes `verify-idl-hash` CI job.
- At least one integration test loads and uses this IDL successfully.

**0.2 Implement and validate `idl/mcp_server_registry.json` (Anchor IDL, v1 hash)**
- File `idl/mcp_server_registry.json` exists.
- Hash matches deployed on-chain program.
- Passes `verify-idl-hash` CI job.
- At least one integration test loads and uses this IDL successfully.

**0.3 Implement and validate `idl/svmai_token.json` (SPL-mint interface)**
- File `idl/svmai_token.json` exists.
- Matches SPL-mint spec.
- Used in at least one payment flow test.
- Passes schema validation.

**0.4 Author `schemas/payment-metadata.schema.json` (strict JSON Schema)**
- Schema file exists.
- Validates all required payment metadata fields.
- All valid/invalid fixtures pass/fail as expected.
- CI job runs schema validation.

**0.5 Author all fixtures in `fixtures/` (valid/invalid agent, MCP, pricing)**
- All fixture files present.
- Each valid fixture passes schema validation.
- Each invalid fixture fails as expected.
- Used in at least one SDK test.

**0.6 Implement `verify-idl-hash` CI job**
- CI job present in `.github/workflows`.
- Fails on intentional IDL hash drift.
- Passes on correct IDL.
- Documented in contributing guide.

### 1. Rust SDK

**1.1 Implement `solana_ai_registries` crate: `lib.rs` (exports, feature gates)**
- File compiles.
- All modules exported.
- Feature gates toggle code paths.
- Documented in crate README.

**1.2 Implement `agent/mod.rs` (agent builder, typed requests)**
- All agent CRUD ops implemented.
- Unit tests for each function.
- API documented with doc comments.
- 100% branch coverage.

**1.3 Implement `mcp/mod.rs` (server builder, typed requests)**
- All MCP CRUD ops implemented.
- Unit tests for each function.
- API documented.
- 100% branch coverage.

**1.4 Implement `payments/mod.rs` (prepay, pyg, stream)**
- All payment flows implemented.
- Unit tests for each flow.
- Handles edge cases (insufficient funds, etc).
- API documented.

**1.5 Implement `client.rs` (RPC wrapper)**
- All public API calls succeed against devnet.
- Handles errors gracefully.
- Integration test with devnet.
- API documented.

**1.6 Implement `errors.rs` (error enums)**
- All error codes match on-chain.
- Unit tests for error mapping.
- Documented in code.

**1.7 Implement `idl.rs` (compile-time IDL inclusion)**
- IDL loaded at compile time.
- No runtime errors.
- Documented usage.

**1.8 Write `tests/agent_flow.rs` (agent CRUD, 26 cases)**
- All tests present.
- 100% pass rate.
- Each test covers a unique code path.
- Test output reproducible.

**1.9 Write `tests/payment_pyg.rs` (CU, balance)**
- All payment edge cases tested.
- Tests pass.
- Output matches expected balances.

**1.10 Write snapshot tests against devnet ledger**
- Snapshots generated.
- Snapshots match expected ledger state.
- Test rerun produces identical output.

**1.11 Implement feature flags: `stream`, `pyg`, `prepay`**
- Flags toggle features.
- CI passes all flag combinations.
- Documented in README.

**1.12 Implement `cargo publish` gating (deny, MSRV)**
- CI blocks publish if deny/MSRV fails.
- Documented in contributing guide.

### 2. TypeScript SDK

**2.1 Implement `@svmai/registries` `src/agent.ts` (AgentAPI)**
- All agent CRUD ops implemented.
- Unit tests for each.
- API documented with JSDoc.
- 100% branch coverage.

**2.2 Implement `src/mcp.ts` (MCPAPI)**
- All MCP CRUD ops implemented.
- Unit tests for each.
- API documented.
- 100% branch coverage.

**2.3 Implement `payments/prepay.ts`, `pyg.ts`, `stream.ts`**
- All payment flows implemented.
- Unit tests for each.
- Handles edge cases.
- API documented.

**2.4 Implement `utils/idl.ts`, `borsh.ts`**
- IDL loads.
- Borsh helpers pass serialization tests.
- Documented usage.

**2.5 Write `examples/register-agent.ts`, `update-server.ts`, `pay-pyg.ts`**
- All examples run.
- Output matches expected.
- Usage documented in README.

**2.6 Implement Jest tests, local validator fixture**
- All tests pass.
- Coverage >90%.
- Validator starts/stops cleanly.

**2.7 Implement `npm run docs` (typedoc)**
- Docs build.
- All public APIs covered.
- Output published to docs site.

### 3. Go SDK

**3.1 Implement `client` (RPC + Tx builder)**
- All public API calls succeed against devnet.
- Handles errors.
- API documented.

**3.2 Implement `agent` / `mcp` (high-level ops)**
- All CRUD ops implemented.
- Unit tests for each.
- API documented.

**3.3 Implement `payments` (all flows)**
- All payment flows implemented.
- Unit tests for each.
- Handles edge cases.
- API documented.

**3.4 Implement `idl` (go:embed structs)**
- IDL loads.
- Struct mapping correct.
- Documented usage.

**3.5 Write integration test: `go test ./... -run TestIntegration -tags=devnet`**
- All tests pass.
- Coverage >90%.
- Output reproducible.

### 4. Python SDK

**4.1 Implement `ai_registries.agent` / `mcp`**
- All CRUD ops implemented.
- Unit tests for each.
- API documented.

**4.2 Implement `ai_registries.payments` (async)**
- All payment flows implemented.
- Unit tests for each.
- Handles edge cases.
- API documented.

**4.3 Implement `ai_registries.idl` (anchorpy.Idl)**
- IDL loads.
- Struct mapping correct.
- Documented usage.

**4.4 Write Jupyter notebook examples**
- All examples run.
- Output matches expected.
- Usage documented in README.

**4.5 Implement Sphinx docs, RTD publish**
- Docs build.
- All public APIs covered.
- Output published to RTD.

### 5. C SDK

**5.1 Implement `libaireg` core: `include/aireg.h`, `src/agent.c`, `src/mcp.c`, `src/payments.c`**
- All functions compile.
- Unit tests for each.
- API documented in header.
- 100% branch coverage.

**5.2 Implement `bindings/solana/` (anchor-gen)**
- Bindings generated.
- Compile without error.
- Used in at least one test.

**5.3 Write `examples/register.c`**
- Example compiles.
- Registers agent successfully.
- Output matches expected.

**5.4 Implement CMake build, `cmake -B build && cmake --build build`**
- Build completes.
- Artefacts produced.
- Output matches expected.

**5.5 Validate ABI, pointer safety, error codes**
- Fuzz tests pass.
- No memory errors.
- Error codes documented.

### 6. C++ SDK

**6.1 Implement header-only `aireg.hpp` (RAII, namespaces)**
- Header compiles.
- All classes usable.
- API documented.

**6.2 Implement bridge to `libaireg` via `extern "C"`**
- Bridge compiles.
- All functions callable.
- Used in at least one test.

**6.3 Write example usage**
- Example compiles.
- Registers agent successfully.
- Output matches expected.

### 7. CI/CD & Publishing

**7.1 Implement `.github/workflows/sdk.yml` (CI matrix)**
- All jobs run.
- Pass on Linux & macOS.
- Output matches expected.

**7.2 Implement `.github/workflows/publish.yml` (publishing)**
- All jobs publish to correct ecosystem on tag.
- Artefacts available in package manager.
- Output matches expected.

**7.3 Validate tag conventions and OIDC secrets**
- All secrets work.
- Test publish with dummy tag.
- Output matches expected.

### 8. Example Scenarios

**8.1 Write `01_mint_svmai.sh` (mint + treasury ATA)**
- Script runs.
- Mints SVMAI.
- Creates ATA.
- Output matches expected.

**8.2 Write `02_register_mcp.<lang>` for each SDK**
- Script runs.
- Registers MCP.
- Attaches pricing metadata.
- Output matches expected.

**8.3 Write `03_client_pay_and_call.<lang>` for each SDK**
- Script runs.
- Performs PYG payment.
- Calls HTTP endpoint.
- Parses response.
- Output matches expected.

---