# Solana AI Registries SDK – Atomic Execution Plan (Explained Numbered List)

**Each task below is atomic, parallelizable, and includes a fully explained, objective, and independently verifiable set of acceptance criteria.**

---

## 0. Common Artifacts

### 0.1 Implement and validate `idl/agent_registry.json` (Anchor IDL, v1 hash)
- **File `idl/agent_registry.json` exists:**  
  The JSON file must be present in the `idl/` directory of the repository.
- **Hash matches deployed on-chain program:**  
  Use the Solana CLI or Anchor tooling to fetch the deployed program’s IDL hash and compare it byte-for-byte with the local file. Any mismatch must be flagged.
- **Passes `verify-idl-hash` CI job:**  
  The CI pipeline must include a job that runs on every PR and fails if the IDL hash does not match the expected value. This prevents accidental or unauthorized changes.
- **Validated by at least one integration test using this IDL:**  
  Write and run an integration test that loads this IDL and successfully performs at least one registry operation (e.g., agent registration) against a local validator or devnet.

### 0.2 Implement and validate `idl/mcp_server_registry.json` (Anchor IDL, v1 hash)
- **File `idl/mcp_server_registry.json` exists:**  
  The JSON file must be present in the `idl/` directory.
- **Hash matches deployed on-chain program:**  
  Use CLI tooling to fetch and compare the hash as above.
- **Passes `verify-idl-hash` CI job:**  
  The CI pipeline must block merges if the hash is incorrect.
- **Validated by at least one integration test using this IDL:**  
  Write and run an integration test that loads this IDL and performs a registry operation (e.g., MCP server registration).

### 0.3 Implement and validate `idl/svmai_token.json` (SPL-mint interface)
- **File `idl/svmai_token.json` exists:**  
  The JSON file must be present in the `idl/` directory.
- **Matches SPL-mint spec:**  
  The file must conform to the SPL-mint interface as defined by Solana SPL documentation.
- **Used in at least one payment flow test:**  
  At least one test must use this IDL to mint, transfer, or check balances of SVMAI tokens.
- **Passes schema validation:**  
  The file must pass a JSON schema validation step in CI.

### 0.4 Author `schemas/payment-metadata.schema.json` (strict JSON Schema)
- **Schema file exists:**  
  The file must be present in the `schemas/` directory.
- **Validates all required payment metadata fields:**  
  The schema must define all required fields (e.g., mint, price_per_request, treasury, payment_type) and their types, formats, and constraints.
- **All valid/invalid fixtures pass/fail as expected:**  
  Run all fixtures through the schema validator; valid files must pass, invalid files must fail, and results must be logged.
- **CI job runs schema validation:**  
  The CI pipeline must include a job that validates all fixtures against the schema and fails if any do not meet expectations.

### 0.5 Author all fixtures in `fixtures/` (valid/invalid agent, MCP, pricing)
- **All fixture files present:**  
  The directory must contain at least one valid and one invalid example for each of agent, MCP, and pricing metadata.
- **Each valid fixture passes schema validation:**  
  Run the schema validator on all valid fixtures; all must pass.
- **Each invalid fixture fails as expected:**  
  Run the schema validator on all invalid fixtures; all must fail with the correct error.
- **Used in at least one SDK test:**  
  At least one SDK test must load and use these fixtures to verify real-world compatibility.

### 0.6 Implement `verify-idl-hash` CI job
- **CI job present in `.github/workflows`:**  
  The workflow YAML must exist and be referenced in the main pipeline.
- **Fails on intentional IDL hash drift:**  
  Manually change the IDL hash and verify that the CI job fails as expected.
- **Passes on correct IDL:**  
  Restore the correct hash and verify that the CI job passes.
- **Documented in contributing guide:**  
  The contributing guide must explain the purpose of this job and how to resolve failures.

---

## 1. Rust SDK

### 1.1 Implement `solana_ai_registries` crate: `lib.rs` (exports, feature gates)
- **File compiles:**  
  Running `cargo build` must succeed with no errors or warnings.
- **All modules exported:**  
  All public modules (`agent`, `mcp`, `payments`, etc.) must be re-exported in `lib.rs`.
- **Feature gates toggle code paths:**  
  Features such as `stream`, `pyg`, and `prepay` must enable/disable code as documented, and this must be tested by building with each feature flag combination.
- **Documented in crate README:**  
  The README must list all features and show example usage.

### 1.2 Implement `agent/mod.rs` (agent builder, typed requests)
- **All agent CRUD ops implemented:**  
  Functions for create, read, update, and delete agent registry entries must be present and callable.
- **Unit tests for each function:**  
  Each function must have at least one unit test that exercises both success and failure paths.
- **API documented with doc comments:**  
  All public functions and types must have Rustdoc comments explaining usage, parameters, and return values.
- **100% branch coverage:**  
  Run `cargo tarpaulin` or equivalent to verify that all code branches are tested.

### 1.3 Implement `mcp/mod.rs` (server builder, typed requests)
- **All MCP CRUD ops implemented:**  
  Functions for create, read, update, and delete MCP server registry entries must be present and callable.
- **Unit tests for each function:**  
  Each function must have at least one unit test for both success and failure.
- **API documented:**  
  All public functions and types must have Rustdoc comments.
- **100% branch coverage:**  
  Code coverage tool must report 100% branch coverage.

### 1.4 Implement `payments/mod.rs` (prepay, pyg, stream)
- **All payment flows implemented:**  
  Functions for prepay, pay-as-you-go, and stream payments must be present and callable.
- **Unit tests for each flow:**  
  Each payment flow must have at least one unit test for both success and failure.
- **Handles edge cases (insufficient funds, etc):**  
  Tests must cover scenarios like insufficient balance, invalid mint, and unauthorized payer.
- **API documented:**  
  All public functions and types must have Rustdoc comments.

### 1.5 Implement `client.rs` (RPC wrapper)
- **All public API calls succeed against devnet:**  
  Integration tests must demonstrate that all public API calls work against a live Solana devnet.
- **Handles errors gracefully:**  
  Error handling must be robust, with clear error messages and no panics.
- **Integration test with devnet:**  
  At least one integration test must run against devnet and pass.
- **API documented:**  
  All public functions and types must have Rustdoc comments.

### 1.6 Implement `errors.rs` (error enums)
- **All error codes match on-chain:**  
  The error enums must match the error codes defined in the on-chain program.
- **Unit tests for error mapping:**  
  Tests must verify that each error code is correctly mapped and handled.
- **Documented in code:**  
  Each error variant must have a doc comment explaining its meaning.

### 1.7 Implement `idl.rs` (compile-time IDL inclusion)
- **IDL loaded at compile time:**  
  The IDL must be included at compile time using Rust macros or build scripts.
- **No runtime errors:**  
  Tests must verify that the IDL loads without error at runtime.
- **Documented usage:**  
  The code must include comments or documentation explaining how the IDL is loaded and used.

### 1.8 Write `tests/agent_flow.rs` (agent CRUD, 26 cases)
- **All tests present:**  
  There must be 26 distinct test cases covering all agent CRUD operations and edge cases.
- **100% pass rate:**  
  All tests must pass in CI.
- **Each test covers a unique code path:**  
  No redundant tests; each exercises a different logic branch.
- **Test output reproducible:**  
  Running the tests multiple times yields the same results.

### 1.9 Write `tests/payment_pyg.rs` (CU, balance)
- **All payment edge cases tested:**  
  Tests must cover normal, insufficient funds, and overpayment scenarios.
- **Tests pass:**  
  All tests must pass in CI.
- **Output matches expected balances:**  
  After each test, balances must be checked and match expected values.

### 1.10 Write snapshot tests against devnet ledger
- **Snapshots generated:**  
  The test suite must generate ledger snapshots after running.
- **Snapshots match expected ledger state:**  
  Snapshots must be compared to a known-good state and differences flagged.
- **Test rerun produces identical output:**  
  Running the test suite again must produce the same snapshots.

### 1.11 Implement feature flags: `stream`, `pyg`, `prepay`
- **Flags toggle features:**  
  Building with each feature flag must enable/disable the corresponding code.
- **CI passes all flag combinations:**  
  The CI pipeline must build and test all combinations of feature flags.
- **Documented in README:**  
  The README must explain each feature flag and its effect.

### 1.12 Implement `cargo publish` gating (deny, MSRV)
- **CI blocks publish if deny/MSRV fails:**  
  The CI pipeline must run `cargo deny` and check MSRV; if either fails, publishing is blocked.
- **Documented in contributing guide:**  
  The contributing guide must explain these checks and how to resolve failures.

---

*(The same level of detail will be provided for all remaining tasks in the plan, including TypeScript, Go, Python, C, C++, CI/CD, and Example Scenarios. Each bullet point will be expanded to explain exactly what is required, how it is to be validated, and what constitutes objective completion.)*

---