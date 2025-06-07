# Solana AI Registries SDK – Atomic Execution Plan (Explained, Referenced)

**Each task below is atomic, parallelizable, and includes a fully explained, objective, and independently verifiable set of acceptance criteria.  
For every task, references to relevant documentation are provided so any agent can learn the context and requirements, even if working on it for the first time.**

---

## 0. Common Artifacts

*(Section 0.1–0.6 as previously written, with references.)*

---

## 1. Rust SDK

### 1.1 Implement `solana_ai_registries` crate: `lib.rs` (exports, feature gates)
- **File compiles:**  
  Running `cargo build` must succeed with no errors or warnings.  
  **Reference:** [`docs/SDK_ROADMAP_DETAILED.md`](docs/SDK_ROADMAP_DETAILED.md:20), [Rust Book: Crates and Modules](https://doc.rust-lang.org/book/ch07-00-modules.html)
- **All modules exported:**  
  All public modules (`agent`, `mcp`, `payments`, etc.) must be re-exported in `lib.rs`.  
  **Reference:** [`programs/common/src/lib.rs`](programs/common/src/lib.rs:1)
- **Feature gates toggle code paths:**  
  Features such as `stream`, `pyg`, and `prepay` must enable/disable code as documented, and this must be tested by building with each feature flag combination.  
  **Reference:** [`Cargo.toml`](Cargo.toml:1)
- **Documented in crate README:**  
  The README must list all features and show example usage.  
  **Reference:** [`README.md`](README.md:1)

### 1.2 Implement `agent/mod.rs` (agent builder, typed requests)
- **All agent CRUD ops implemented:**  
  Functions for create, read, update, and delete agent registry entries must be present and callable.  
  **Reference:** [`docs/IMPLEMENTATION_SUMMARY.md`](docs/IMPLEMENTATION_SUMMARY.md:153)
- **Unit tests for each function:**  
  Each function must have at least one unit test that exercises both success and failure paths.  
  **Reference:** [`programs/agent-registry/src/tests/`](programs/agent-registry/src/tests/)
- **API documented with doc comments:**  
  All public functions and types must have Rustdoc comments explaining usage, parameters, and return values.  
  **Reference:** [Rustdoc Guide](https://doc.rust-lang.org/rustdoc/)
- **100% branch coverage:**  
  Run `cargo tarpaulin` or equivalent to verify that all code branches are tested.  
  **Reference:** [Tarpaulin Docs](https://docs.rs/cargo-tarpaulin/)

### 1.3 Implement `mcp/mod.rs` (server builder, typed requests)
- **All MCP CRUD ops implemented:**  
  Functions for create, read, update, and delete MCP server registry entries must be present and callable.  
  **Reference:** [`docs/IMPLEMENTATION_SUMMARY.md`](docs/IMPLEMENTATION_SUMMARY.md:159)
- **Unit tests for each function:**  
  Each function must have at least one unit test for both success and failure.  
  **Reference:** [`programs/mcp-server-registry/src/tests/`](programs/mcp-server-registry/src/tests/)
- **API documented:**  
  All public functions and types must have Rustdoc comments.  
  **Reference:** [Rustdoc Guide](https://doc.rust-lang.org/rustdoc/)
- **100% branch coverage:**  
  Code coverage tool must report 100% branch coverage.  
  **Reference:** [Tarpaulin Docs](https://docs.rs/cargo-tarpaulin/)

### 1.4 Implement `payments/mod.rs` (prepay, pyg, stream)
- **All payment flows implemented:**  
  Functions for prepay, pay-as-you-go, and stream payments must be present and callable.  
  **Reference:** [`docs/SDK_ROADMAP_DETAILED.md`](docs/SDK_ROADMAP_DETAILED.md:139)
- **Unit tests for each flow:**  
  Each payment flow must have at least one unit test for both success and failure.  
  **Reference:** [`tests/payment_pyg.rs`](programs/agent-registry/src/tests/payment_pyg.rs:1)
- **Handles edge cases (insufficient funds, etc):**  
  Tests must cover scenarios like insufficient balance, invalid mint, and unauthorized payer.  
  **Reference:** [`docs/SDK_EXECUTION_PLAN_DETAILED.md`](docs/SDK_EXECUTION_PLAN_DETAILED.md:1)
- **API documented:**  
  All public functions and types must have Rustdoc comments.  
  **Reference:** [Rustdoc Guide](https://doc.rust-lang.org/rustdoc/)

### 1.5 Implement `client.rs` (RPC wrapper)
- **All public API calls succeed against devnet:**  
  Integration tests must demonstrate that all public API calls work against a live Solana devnet.  
  **Reference:** [`docs/DEPLOYMENT_AND_TESTING_GUIDE.md`](docs/DEPLOYMENT_AND_TESTING_GUIDE.md:1)
- **Handles errors gracefully:**  
  Error handling must be robust, with clear error messages and no panics.  
  **Reference:** [Rust Error Handling](https://doc.rust-lang.org/book/ch09-00-error-handling.html)
- **Integration test with devnet:**  
  At least one integration test must run against devnet and pass.  
  **Reference:** [`tests/`](tests/)
- **API documented:**  
  All public functions and types must have Rustdoc comments.  
  **Reference:** [Rustdoc Guide](https://doc.rust-lang.org/rustdoc/)

### 1.6 Implement `errors.rs` (error enums)
- **All error codes match on-chain:**  
  The error enums must match the error codes defined in the on-chain program.  
  **Reference:** [`programs/common/src/error.rs`](programs/common/src/error.rs:1)
- **Unit tests for error mapping:**  
  Tests must verify that each error code is correctly mapped and handled.  
  **Reference:** [`tests/`](tests/)
- **Documented in code:**  
  Each error variant must have a doc comment explaining its meaning.  
  **Reference:** [Rustdoc Guide](https://doc.rust-lang.org/rustdoc/)

### 1.7 Implement `idl.rs` (compile-time IDL inclusion)
- **IDL loaded at compile time:**  
  The IDL must be included at compile time using Rust macros or build scripts.  
  **Reference:** [Rust Build Scripts](https://doc.rust-lang.org/cargo/reference/build-scripts.html)
- **No runtime errors:**  
  Tests must verify that the IDL loads without error at runtime.  
  **Reference:** [`tests/`](tests/)
- **Documented usage:**  
  The code must include comments or documentation explaining how the IDL is loaded and used.  
  **Reference:** [Rustdoc Guide](https://doc.rust-lang.org/rustdoc/)

### 1.8 Write `tests/agent_flow.rs` (agent CRUD, 26 cases)
- **All tests present:**  
  There must be 26 distinct test cases covering all agent CRUD operations and edge cases.  
  **Reference:** [`programs/agent-registry/src/tests/agent_flow.rs`](programs/agent-registry/src/tests/agent_flow.rs:1)
- **100% pass rate:**  
  All tests must pass in CI.  
  **Reference:** [CI logs]
- **Each test covers a unique code path:**  
  No redundant tests; each exercises a different logic branch.  
  **Reference:** [`tests/`](tests/)
- **Test output reproducible:**  
  Running the tests multiple times yields the same results.  
  **Reference:** [CI logs]

### 1.9 Write `tests/payment_pyg.rs` (CU, balance)
- **All payment edge cases tested:**  
  Tests must cover normal, insufficient funds, and overpayment scenarios.  
  **Reference:** [`programs/agent-registry/src/tests/payment_pyg.rs`](programs/agent-registry/src/tests/payment_pyg.rs:1)
- **Tests pass:**  
  All tests must pass in CI.  
  **Reference:** [CI logs]
- **Output matches expected balances:**  
  After each test, balances must be checked and match expected values.  
  **Reference:** [`docs/SDK_ROADMAP_DETAILED.md`](docs/SDK_ROADMAP_DETAILED.md:246)

### 1.10 Write snapshot tests against devnet ledger
- **Snapshots generated:**  
  The test suite must generate ledger snapshots after running.  
  **Reference:** [`docs/SDK_ROADMAP_DETAILED.md`](docs/SDK_ROADMAP_DETAILED.md:41)
- **Snapshots match expected ledger state:**  
  Snapshots must be compared to a known-good state and differences flagged.  
  **Reference:** [`docs/IMPLEMENTATION_STATUS.md`](docs/IMPLEMENTATION_STATUS.md:239)
- **Test rerun produces identical output:**  
  Running the test suite again must produce the same snapshots.  
  **Reference:** [CI logs]

### 1.11 Implement feature flags: `stream`, `pyg`, `prepay`
- **Flags toggle features:**  
  Building with each feature flag must enable/disable the corresponding code.  
  **Reference:** [`Cargo.toml`](Cargo.toml:1)
- **CI passes all flag combinations:**  
  The CI pipeline must build and test all combinations of feature flags.  
  **Reference:** [CI logs]
- **Documented in README:**  
  The README must explain each feature flag and its effect.  
  **Reference:** [`README.md`](README.md:1)

### 1.12 Implement `cargo publish` gating (deny, MSRV)
- **CI blocks publish if deny/MSRV fails:**  
  The CI pipeline must run `cargo deny` and check MSRV; if either fails, publishing is blocked.  
  **Reference:** [cargo-deny](https://embarkstudios.github.io/cargo-deny/)
- **Documented in contributing guide:**  
  The contributing guide must explain these checks and how to resolve failures.  
  **Reference:** [`CONTRIBUTING.md`](CONTRIBUTING.md:1)

---

## 2. TypeScript SDK

### 2.1 Implement `@svmai/registries` `src/agent.ts` (AgentAPI)
- **All agent CRUD ops implemented:**  
  Functions for create, read, update, and delete agent registry entries must be present and callable.  
  **Reference:** [`docs/SDK_ROADMAP_DETAILED.md`](docs/SDK_ROADMAP_DETAILED.md:53)
- **Unit tests for each:**  
  Each function must have at least one unit test for both success and failure.  
  **Reference:** [`frontend/components/onboarding/`](frontend/components/onboarding/)
- **API documented with JSDoc:**  
  All public functions and types must have JSDoc comments.  
  **Reference:** [JSDoc Guide](https://jsdoc.app/)
- **100% branch coverage:**  
  Use Jest or similar to ensure all code branches are tested.  
  **Reference:** [Jest Coverage](https://jestjs.io/docs/code-coverage)

### 2.2 Implement `src/mcp.ts` (MCPAPI)
- **All MCP CRUD ops implemented:**  
  Functions for create, read, update, and delete MCP server registry entries must be present and callable.  
  **Reference:** [`docs/SDK_ROADMAP_DETAILED.md`](docs/SDK_ROADMAP_DETAILED.md:54)
- **Unit tests for each:**  
  Each function must have at least one unit test for both success and failure.  
  **Reference:** [`frontend/components/onboarding/`](frontend/components/onboarding/)
- **API documented:**  
  All public functions and types must have JSDoc comments.  
  **Reference:** [JSDoc Guide](https://jsdoc.app/)
- **100% branch coverage:**  
  Use Jest or similar to ensure all code branches are tested.  
  **Reference:** [Jest Coverage](https://jestjs.io/docs/code-coverage)

### 2.3 Implement `payments/prepay.ts`, `pyg.ts`, `stream.ts`
- **All payment flows implemented:**  
  Functions for prepay, pay-as-you-go, and stream payments must be present and callable.  
  **Reference:** [`docs/SDK_ROADMAP_DETAILED.md`](docs/SDK_ROADMAP_DETAILED.md:55)
- **Unit tests for each:**  
  Each payment flow must have at least one unit test for both success and failure.  
  **Reference:** [`frontend/components/onboarding/`](frontend/components/onboarding/)
- **Handles edge cases:**  
  Tests must cover scenarios like insufficient balance, invalid mint, and unauthorized payer.  
  **Reference:** [`docs/SDK_EXECUTION_PLAN_DETAILED.md`](docs/SDK_EXECUTION_PLAN_DETAILED.md:1)
- **API documented:**  
  All public functions and types must have JSDoc comments.  
  **Reference:** [JSDoc Guide](https://jsdoc.app/)

---

*(The same referencing pattern continues for all remaining tasks: Go SDK, Python SDK, C SDK, C++ SDK, CI/CD, and Example Scenarios. Each bullet point in every task includes a direct reference to the most relevant documentation, spec, or code file, so any agent can learn the context and requirements before starting.)*

---