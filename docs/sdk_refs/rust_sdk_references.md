# Rust SDK - Atomic Execution Plan with References

## 1. Rust SDK

### 1.1 Implement `solana_ai_registries` crate: `lib.rs` (exports, feature gates)
- **File compiles:**  
  Running `cargo build` must succeed with no errors or warnings.  
  **Reference:** [`docs/SDK_ROADMAP_DETAILED.md`](../SDK_ROADMAP_DETAILED.md:49-50), [Rust Book: Crates and Modules](https://doc.rust-lang.org/book/ch07-00-modules.html)
- **All modules exported:**  
  All public modules (`agent`, `mcp`, `payments`, etc.) must be re-exported in `lib.rs`.  
  **Reference:** [`programs/common/src/lib.rs`](../../programs/common/src/lib.rs), [Rust re-exports](https://doc.rust-lang.org/reference/items/use-declarations.html#use-visibility)
- **Feature gates toggle code paths:**  
  Features such as `stream`, `pyg`, and `prepay` must enable/disable code as documented, and this must be tested by building with each feature flag combination.  
  **Reference:** [`Cargo.toml`](../../Cargo.toml), [Cargo Features](https://doc.rust-lang.org/cargo/reference/features.html)
- **Documented in crate README:**  
  The README must list all features and show example usage.  
  **Reference:** [`README.md`](../../README.md), [Rust API Guidelines](https://rust-lang.github.io/api-guidelines/documentation.html)

### 1.2 Implement `agent/mod.rs` (agent builder, typed requests)
- **All agent CRUD ops implemented:**  
  Functions for create, read, update, and delete agent registry entries must be present and callable.  
  **Reference:** [`docs/IMPLEMENTATION_SUMMARY.md`](../IMPLEMENTATION_SUMMARY.md:153-162), [`programs/agent-registry/src/instruction.rs`](../../programs/agent-registry/src/instruction.rs)
- **Unit tests for each function:**  
  Each function must have at least one unit test that exercises both success and failure paths.  
  **Reference:** [`programs/agent-registry/src/tests/`](../../programs/agent-registry/src/tests/), [Rust Testing](https://doc.rust-lang.org/book/ch11-00-testing.html)
- **API documented with doc comments:**  
  All public functions and types must have Rustdoc comments explaining usage, parameters, and return values.  
  **Reference:** [Rustdoc Guide](https://doc.rust-lang.org/rustdoc/), [Rust API Guidelines](https://rust-lang.github.io/api-guidelines/documentation.html)
- **100% branch coverage:**  
  Run `cargo tarpaulin` or equivalent to verify that all code branches are tested.  
  **Reference:** [Tarpaulin Docs](https://github.com/xd009642/tarpaulin), [Code Coverage Best Practices](https://doc.rust-lang.org/rustc/instrument-coverage.html)

### 1.3 Implement `mcp/mod.rs` (server builder, typed requests)
- **All MCP CRUD ops implemented:**  
  Functions for create, read, update, and delete MCP server registry entries must be present and callable.  
  **Reference:** [`docs/IMPLEMENTATION_SUMMARY.md`](../IMPLEMENTATION_SUMMARY.md:174-183), [`programs/mcp-server-registry/src/instruction.rs`](../../programs/mcp-server-registry/src/instruction.rs)
- **Unit tests for each function:**  
  Each function must have at least one unit test for both success and failure.  
  **Reference:** [`programs/mcp-server-registry/src/tests/`](../../programs/mcp-server-registry/src/tests/), [Rust Testing](https://doc.rust-lang.org/book/ch11-00-testing.html)
- **API documented:**  
  All public functions and types must have Rustdoc comments.  
  **Reference:** [Rustdoc Guide](https://doc.rust-lang.org/rustdoc/), [Rust API Guidelines](https://rust-lang.github.io/api-guidelines/documentation.html)
- **100% branch coverage:**  
  Code coverage tool must report 100% branch coverage.  
  **Reference:** [Tarpaulin Docs](https://github.com/xd009642/tarpaulin), [Code Coverage Best Practices](https://doc.rust-lang.org/rustc/instrument-coverage.html)

### 1.4 Implement `payments/mod.rs` (prepay, pyg, stream)
- **All payment flows implemented:**  
  Functions for prepay, pay-as-you-go, and stream payments must be present and callable.  
  **Reference:** [`docs/SDK_ROADMAP_DETAILED.md`](../SDK_ROADMAP_DETAILED.md:139-148), [`programs/svmai-token/src/lib.rs`](../../programs/svmai-token/src/lib.rs)
- **Unit tests for each flow:**  
  Each payment flow must have at least one unit test for both success and failure.  
  **Reference:** [`tests/payment_pyg.rs`](../../programs/agent-registry/src/tests/payment_pyg.rs), [Rust Testing](https://doc.rust-lang.org/book/ch11-00-testing.html)
- **Handles edge cases (insufficient funds, etc):**  
  Tests must cover scenarios like insufficient balance, invalid mint, and unauthorized payer.  
  **Reference:** [`programs/svmai-token/src/lib.rs`](../../programs/svmai-token/src/lib.rs), [`docs/SDK_EXECUTION_PLAN_DETAILED.md`](../SDK_EXECUTION_PLAN_DETAILED.md)
- **API documented:**  
  All public functions and types must have Rustdoc comments.  
  **Reference:** [Rustdoc Guide](https://doc.rust-lang.org/rustdoc/), [Rust API Guidelines](https://rust-lang.github.io/api-guidelines/documentation.html)

### 1.5 Implement `client.rs` (RPC wrapper)
- **All public API calls succeed against devnet:**  
  Integration tests must demonstrate that all public API calls work against a live Solana devnet.  
  **Reference:** [`docs/SDK_ROADMAP_DETAILED.md`](../SDK_ROADMAP_DETAILED.md:65-66), [`docs/DEPLOYMENT_AND_TESTING_GUIDE.md`](../DEPLOYMENT_AND_TESTING_GUIDE.md)
- **Handles errors gracefully:**  
  Error handling must be robust, with clear error messages and no panics.  
  **Reference:** [Rust Error Handling](https://doc.rust-lang.org/book/ch09-00-error-handling.html), [anyhow crate](https://docs.rs/anyhow/)
- **Integration test with devnet:**  
  At least one integration test must run against devnet and pass.  
  **Reference:** [`tests/`](../../tests/), [Solana Test Validator](https://docs.solana.com/developing/test-validator)
- **API documented:**  
  All public functions and types must have Rustdoc comments.  
  **Reference:** [Rustdoc Guide](https://doc.rust-lang.org/rustdoc/), [Rust API Guidelines](https://rust-lang.github.io/api-guidelines/documentation.html)

### 1.6 Implement `errors.rs` (error enums)
- **All error codes match on-chain:**  
  The error enums must match the error codes defined in the on-chain program.  
  **Reference:** [`programs/common/src/error.rs`](../../programs/common/src/error.rs), [`programs/agent-registry/src/error.rs`](../../programs/agent-registry/src/error.rs)
- **Unit tests for error mapping:**  
  Tests must verify that each error code is correctly mapped and handled.  
  **Reference:** [`tests/`](../../tests/), [Rust Error Testing](https://doc.rust-lang.org/book/ch11-01-writing-tests.html#checking-for-panics-with-should_panic)
- **Documented in code:**  
  Each error variant must have a doc comment explaining its meaning.  
  **Reference:** [Rustdoc Guide](https://doc.rust-lang.org/rustdoc/), [thiserror crate](https://docs.rs/thiserror/)

### 1.7 Implement `idl.rs` (compile-time IDL inclusion)
- **IDL loaded at compile time:**  
  The IDL must be included at compile time using Rust macros or build scripts.  
  **Reference:** [Rust Build Scripts](https://doc.rust-lang.org/cargo/reference/build-scripts.html), [`idl/`](../../idl/)
- **No runtime errors:**  
  Tests must verify that the IDL loads without error at runtime.  
  **Reference:** [`tests/`](../../tests/), [include_str! macro](https://doc.rust-lang.org/std/macro.include_str.html)
- **Documented usage:**  
  The code must include comments or documentation explaining how the IDL is loaded and used.  
  **Reference:** [Rustdoc Guide](https://doc.rust-lang.org/rustdoc/), [Anchor IDL Format](https://www.anchor-lang.com/docs/idl)

### 1.8 Write `tests/agent_flow.rs` (agent CRUD, 26 cases)
- **All tests present:**  
  There must be 26 distinct test cases covering all agent CRUD operations and edge cases.  
  **Reference:** [`programs/agent-registry/src/tests/agent_flow.rs`](../../programs/agent-registry/src/tests/agent_flow.rs), [`docs/SDK_ROADMAP_DETAILED.md`](../SDK_ROADMAP_DETAILED.md:77)
- **100% pass rate:**  
  All tests must pass in CI.  
  **Reference:** [GitHub Actions](https://docs.github.com/en/actions), [Rust CI Best Practices](https://github.com/rust-lang/rust-clippy#travis-ci)
- **Each test covers a unique code path:**  
  No redundant tests; each exercises a different logic branch.  
  **Reference:** [`tests/`](../../tests/), [Test Organization](https://doc.rust-lang.org/book/ch11-03-test-organization.html)
- **Test output reproducible:**  
  Running the tests multiple times yields the same results.  
  **Reference:** [Deterministic Testing](https://doc.rust-lang.org/book/ch11-01-writing-tests.html)

### 1.9 Write `tests/payment_pyg.rs` (CU, balance)
- **All payment edge cases tested:**  
  Tests must cover normal, insufficient funds, and overpayment scenarios.  
  **Reference:** [`programs/agent-registry/src/tests/payment_pyg.rs`](../../programs/agent-registry/src/tests/payment_pyg.rs), [`docs/SDK_ROADMAP_DETAILED.md`](../SDK_ROADMAP_DETAILED.md:139-148)
- **Tests pass:**  
  All tests must pass in CI.  
  **Reference:** [GitHub Actions](https://docs.github.com/en/actions), [Rust CI Best Practices](https://github.com/rust-lang/rust-clippy#travis-ci)
- **Output matches expected balances:**  
  After each test, balances must be checked and match expected values.  
  **Reference:** [`docs/SDK_ROADMAP_DETAILED.md`](../SDK_ROADMAP_DETAILED.md:246), [Solana RPC getBalance](https://docs.solana.com/developing/clients/jsonrpc-api#getbalance)

### 1.10 Write snapshot tests against devnet ledger
- **Snapshots generated:**  
  The test suite must generate ledger snapshots after running.  
  **Reference:** [`docs/SDK_ROADMAP_DETAILED.md`](../SDK_ROADMAP_DETAILED.md:41), [insta crate](https://docs.rs/insta/)
- **Snapshots match expected ledger state:**  
  Snapshots must be compared to a known-good state and differences flagged.  
  **Reference:** [`docs/IMPLEMENTATION_STATUS.md`](../IMPLEMENTATION_STATUS.md:239-248), [Snapshot Testing](https://docs.rs/insta/latest/insta/#snapshot-testing)
- **Test rerun produces identical output:**  
  Running the test suite again must produce the same snapshots.  
  **Reference:** [Deterministic Testing](https://doc.rust-lang.org/book/ch11-01-writing-tests.html)

### 1.11 Implement feature flags: `stream`, `pyg`, `prepay`
- **Flags toggle features:**  
  Building with each feature flag must enable/disable the corresponding code.  
  **Reference:** [`Cargo.toml`](../../Cargo.toml), [Cargo Features](https://doc.rust-lang.org/cargo/reference/features.html)
- **CI passes all flag combinations:**  
  The CI pipeline must build and test all combinations of feature flags.  
  **Reference:** [GitHub Actions Matrix](https://docs.github.com/en/actions/using-jobs/using-a-matrix-for-your-jobs), [`docs/SDK_ROADMAP_DETAILED.md`](../SDK_ROADMAP_DETAILED.md:151-161)
- **Documented in README:**  
  The README must explain each feature flag and its effect.  
  **Reference:** [`README.md`](../../README.md), [Rust API Guidelines](https://rust-lang.github.io/api-guidelines/documentation.html)

### 1.12 Implement `cargo publish` gating (deny, MSRV)
- **CI blocks publish if deny/MSRV fails:**  
  The CI pipeline must run `cargo deny` and check MSRV; if either fails, publishing is blocked.  
  **Reference:** [cargo-deny](https://embarkstudios.github.io/cargo-deny/), [rust-version](https://doc.rust-lang.org/cargo/reference/manifest.html#the-rust-version-field)
- **Documented in contributing guide:**  
  The contributing guide must explain these checks and how to resolve failures.  
  **Reference:** [`CONTRIBUTING.md`](../../CONTRIBUTING.md), [Rust Release Guidelines](https://forge.rust-lang.org/infra/channel-layout.html)