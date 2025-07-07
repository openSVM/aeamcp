# Rust SDK Implementation Guidelines

This document provides comprehensive implementation guidelines for the Solana AI Registries Rust SDK (`solana_ai_registries` crate). These guidelines are derived from the atomic execution plan in [`docs/sdk_refs/rust_sdk_references.md`](sdk_refs/rust_sdk_references.md) and provide actionable requirements for developers.

## Table of Contents

1. [Overview](#overview)
2. [Atomic Implementation Tasks](#atomic-implementation-tasks)
3. [Feature Gates and Payment Mode Flags](#feature-gates-and-payment-mode-flags)
4. [CI/CD Publishing Workflow](#cicd-publishing-workflow)
5. [Code Style and Review Requirements](#code-style-and-review-requirements)
6. [Reference Links](#reference-links)
7. [Testing Requirements](#testing-requirements)
8. [Documentation Standards](#documentation-standards)

## Overview

The Rust SDK provides type-safe access to Solana AI Registries with 100% coverage of on-chain instructions and payment flows. The implementation must maintain compile-time safety, comprehensive error handling, and feature flag compatibility.

### Core Architecture

- **Client Wrapper**: RPC client abstraction around `solana_client::rpc_client::RpcClient`
- **Type Builders**: Safe agent and MCP server configuration builders
- **Payment Modules**: Conditional payment flow implementations (stream, pyg, prepay)
- **Error Handling**: Mirrored on-chain error enums with comprehensive coverage
- **IDL Integration**: Compile-time IDL inclusion for deterministic program interaction

## Atomic Implementation Tasks

### Task 1.1: Core Library (`lib.rs`)

**Requirements:**
- File must compile without errors or warnings
- All public modules re-exported (`agent`, `mcp`, `payments`, `client`, `errors`, `idl`)
- Feature gates properly toggle code paths
- Complete documentation with usage examples

**Acceptance Criteria:**
- `cargo build` succeeds with no warnings
- All feature flag combinations compile successfully
- README documents all features with examples
- API follows Rust API Guidelines

**References:**
- [`rust/src/lib.rs`](../rust/src/lib.rs)
- [`docs/SDK_ROADMAP_DETAILED.md`](SDK_ROADMAP_DETAILED.md#L19-30)
- [Rust Book: Crates and Modules](https://doc.rust-lang.org/book/ch07-00-modules.html)

### Task 1.2: Agent Registry Module (`agent/mod.rs`)

**Requirements:**
- Complete CRUD operations for agent registry
- Type-safe agent builder with validation
- Unit tests for success and failure paths
- 100% branch coverage
- Comprehensive API documentation

**Implementation Checklist:**
- [ ] `AgentBuilder` with compile-time validation
- [ ] `register_agent()` function with proper error handling
- [ ] `update_agent()` with patch operations
- [ ] `delete_agent()` with ownership verification
- [ ] `get_agent()` with deserialization
- [ ] Constants validation (MAX_AGENT_ID_LEN, MAX_AGENT_NAME_LEN, etc.)
- [ ] Unit tests covering all code branches
- [ ] Integration tests against test programs

**References:**
- [`rust/src/agent/`](../rust/src/agent/)
- [`programs/agent-registry/src/instruction.rs`](../programs/agent-registry/src/instruction.rs)
- [`docs/IMPLEMENTATION_SUMMARY.md`](IMPLEMENTATION_SUMMARY.md#L153-162)

### Task 1.3: MCP Server Registry Module (`mcp/mod.rs`)

**Requirements:**
- Complete CRUD operations for MCP server registry
- Type-safe server builder with validation
- Unit tests for success and failure paths
- 100% branch coverage
- Comprehensive API documentation

**Implementation Checklist:**
- [ ] `McpServerBuilder` with compile-time validation
- [ ] `register_mcp_server()` function
- [ ] `update_mcp_server()` with patch operations
- [ ] `delete_mcp_server()` with ownership verification
- [ ] `get_mcp_server()` with deserialization
- [ ] Tool, resource, and prompt definition handling
- [ ] Unit tests covering all code branches
- [ ] Integration tests against test programs

**References:**
- [`rust/src/mcp/`](../rust/src/mcp/)
- [`programs/mcp-server-registry/src/instruction.rs`](../programs/mcp-server-registry/src/instruction.rs)
- [`docs/IMPLEMENTATION_SUMMARY.md`](IMPLEMENTATION_SUMMARY.md#L174-183)

### Task 1.4: Payment Modules (`payments/mod.rs`)

**Requirements:**
- Three payment flow implementations (prepay, pyg, stream)
- Feature flag conditional compilation
- Edge case handling (insufficient funds, invalid mint, etc.)
- Comprehensive unit tests
- API documentation

**Implementation Checklist:**
- [ ] `payments/prepay.rs` - Prepaid account management
- [ ] `payments/pyg.rs` - Pay-as-you-go with compute units
- [ ] `payments/stream.rs` - Streaming payments over time
- [ ] `payments/common.rs` - Shared utilities and types
- [ ] Feature flag conditional compilation working
- [ ] Unit tests for each payment flow
- [ ] Edge case testing (insufficient funds, etc.)
- [ ] Balance tracking and verification

**References:**
- [`rust/src/payments/`](../rust/src/payments/)
- [`docs/SDK_ROADMAP_DETAILED.md`](SDK_ROADMAP_DETAILED.md#L139-148)
- [`programs/svmai-token/src/lib.rs`](../programs/svmai-token/src/lib.rs)

### Task 1.5: RPC Client Wrapper (`client.rs`)

**Requirements:**
- Wrapper around `solana_client::rpc_client::RpcClient`
- All public API calls work against devnet
- Graceful error handling with no panics
- Integration tests with devnet
- Complete API documentation

**Implementation Checklist:**
- [ ] `SolanaAiRegistriesClient` struct
- [ ] Connection management and retry logic
- [ ] Account deserialization utilities
- [ ] Transaction building and signing
- [ ] Error mapping to SDK error types
- [ ] Integration tests against devnet
- [ ] Connection timeout and retry configuration

**References:**
- [`rust/src/client.rs`](../rust/src/client.rs)
- [Solana RPC Client](https://docs.rs/solana-client/)
- [Solana Test Validator](https://docs.solana.com/developing/test-validator)

### Task 1.6: Error Handling (`errors.rs`)

**Requirements:**
- Error enums matching on-chain program errors
- Unit tests for error mapping
- Comprehensive error documentation
- Proper error chain propagation

**Implementation Checklist:**
- [ ] `SdkError` enum with all variants
- [ ] Error code mapping from on-chain programs
- [ ] Error message localization support
- [ ] Unit tests for error scenarios
- [ ] Documentation for each error variant
- [ ] Integration with `anyhow` and `thiserror`

**References:**
- [`rust/src/errors.rs`](../rust/src/errors.rs)
- [`programs/common/src/error.rs`](../programs/common/src/error.rs)
- [`programs/agent-registry/src/error.rs`](../programs/agent-registry/src/error.rs)

### Task 1.7: IDL Integration (`idl.rs`)

**Requirements:**
- Compile-time IDL inclusion
- No runtime errors during IDL loading
- IDL hash verification
- Usage documentation

**Implementation Checklist:**
- [ ] Compile-time IDL inclusion using `include_str!`
- [ ] IDL parsing and validation
- [ ] Hash verification against known good IDLs
- [ ] Runtime IDL access functions
- [ ] Documentation for IDL usage patterns

**References:**
- [`rust/src/idl.rs`](../rust/src/idl.rs)
- [`idl/`](../idl/) directory
- [Anchor IDL Format](https://www.anchor-lang.com/docs/idl)

### Task 1.8: Agent Flow Tests (`tests/agent_flow.rs`)

**Requirements:**
- 26 distinct test cases covering all agent CRUD operations
- 100% pass rate in CI
- Each test covers unique code path
- Reproducible test output

**Implementation Checklist:**
- [ ] Tests 1-6: Agent registration (valid, minimal, full, empty ID fails, etc.)
- [ ] Tests 7-12: Agent updates (description, endpoints, skills, etc.)
- [ ] Tests 13-18: Agent deletion and status changes
- [ ] Tests 19-24: Error scenarios and edge cases
- [ ] Tests 25-26: Complex workflows and integration scenarios
- [ ] All tests pass consistently
- [ ] Tests isolated and don't depend on external state

**References:**
- [`rust/tests/agent_flow.rs`](../rust/tests/agent_flow.rs)
- [`docs/SDK_ROADMAP_DETAILED.md`](SDK_ROADMAP_DETAILED.md#L77)

### Task 1.9: Payment Tests (`tests/payment_pyg.rs`)

**Requirements:**
- Payment edge cases tested (normal, insufficient funds, overpayment)
- Tests pass in CI
- Balance verification after each test
- Compute unit budget testing

**Implementation Checklist:**
- [ ] Normal payment flow tests
- [ ] Insufficient funds scenarios
- [ ] Overpayment handling
- [ ] Compute unit budget calculations
- [ ] Priority fee calculations
- [ ] Balance tracking and verification
- [ ] Feature flag testing (pyg disabled/enabled)

**References:**
- [`rust/tests/payment_pyg.rs`](../rust/tests/payment_pyg.rs)
- [`docs/SDK_ROADMAP_DETAILED.md`](SDK_ROADMAP_DETAILED.md#L139-148)

### Task 1.10: Snapshot Testing

**Requirements:**
- Snapshot generation after test runs
- Snapshots match expected ledger state
- Deterministic test output
- Snapshot diff detection

**Implementation Checklist:**
- [ ] Integration with `insta` crate for snapshot testing
- [ ] Ledger state capture after operations
- [ ] Snapshot comparison and diff reporting
- [ ] CI integration for snapshot validation
- [ ] Documentation for snapshot workflow

**References:**
- [insta crate](https://docs.rs/insta/)
- [`docs/SDK_ROADMAP_DETAILED.md`](SDK_ROADMAP_DETAILED.md#L41)

### Task 1.11: Feature Flag Implementation

**Requirements:**
- Feature flags toggle code paths correctly
- CI tests all feature flag combinations
- README documents all features
- Conditional compilation working properly

**Implementation Checklist:**
- [ ] `stream` feature flag implementation
- [ ] `pyg` feature flag implementation  
- [ ] `prepay` feature flag implementation
- [ ] Feature combinations testing in CI
- [ ] Documentation updates for each feature
- [ ] Conditional module compilation

**References:**
- [`rust/Cargo.toml`](../rust/Cargo.toml) features section
- [Cargo Features](https://doc.rust-lang.org/cargo/reference/features.html)

### Task 1.12: Publishing Workflow

**Requirements:**
- `cargo publish` gated by `cargo deny` and MSRV checks
- CI blocks publish on failures
- Contributing guide documents process
- Version management and tagging

**Implementation Checklist:**
- [ ] `cargo deny` configuration and CI integration
- [ ] MSRV (1.74.0) verification in CI
- [ ] Dependency audit and security scanning
- [ ] Automated version bumping
- [ ] Release notes generation
- [ ] Publishing workflow documentation

**References:**
- [cargo-deny](https://embarkstudios.github.io/cargo-deny/)
- [rust-version](https://doc.rust-lang.org/cargo/reference/manifest.html#the-rust-version-field)

## Feature Gates and Payment Mode Flags

### Overview

The SDK uses feature flags to conditionally compile payment system code, allowing users to include only the payment flows they need.

### Feature Flags

| Feature | Description | Status |
|---------|-------------|---------|
| `stream` | Streaming payments over time | **Required** |
| `pyg` | Pay-as-you-go with compute unit budgets | **Required** |
| `prepay` | Prepaid account management with balance tracking | **Required** |

### Usage Guidelines

**Default Configuration (no payments):**
```toml
[dependencies]
solana_ai_registries = "0.1"
```

**Pay-as-you-go only:**
```toml
[dependencies]
solana_ai_registries = { version = "0.1", features = ["pyg"] }
```

**All payment features:**
```toml
[dependencies]
solana_ai_registries = { version = "0.1", features = ["stream", "pyg", "prepay"] }
```

### Implementation Requirements

1. **Conditional Compilation**: Use `#[cfg(feature = "...")]` for feature-specific code
2. **Re-exports**: Conditionally re-export types in `lib.rs`
3. **Testing**: Test all feature combinations in CI matrix
4. **Documentation**: Document feature requirements in README

### Example Implementation

```rust
// In lib.rs
#[cfg(feature = "pyg")]
pub use payments::pyg::*;

// In payments/mod.rs
#[cfg(feature = "pyg")]
pub mod pyg;

// In tests
#[cfg(feature = "pyg")]
mod pyg_tests {
    // Tests specific to pyg feature
}
```

## CI/CD Publishing Workflow

### Build Matrix

The CI system must test all feature flag combinations:

```yaml
strategy:
  matrix:
    features:
      - ""
      - "pyg"
      - "prepay" 
      - "stream"
      - "pyg,prepay"
      - "pyg,stream"
      - "prepay,stream"
      - "pyg,prepay,stream"
```

### Publishing Gates

Before publishing to crates.io, the following checks must pass:

1. **Security Audit**: `cargo deny check`
2. **MSRV Compliance**: Rust 1.74.0 minimum
3. **Test Coverage**: 100% for new code
4. **Documentation**: All public APIs documented
5. **Clippy**: No warnings on default configuration
6. **Integration Tests**: Pass against devnet

### Workflow Steps

1. **Pre-publish Checks**:
   ```bash
   cargo deny check
   cargo +1.74.0 check --all-features
   cargo test --all-features
   cargo clippy --all-features -- -D warnings
   cargo doc --all-features --no-deps
   ```

2. **Version Management**:
   - Semantic versioning (MAJOR.MINOR.PATCH)
   - Automated changelog generation
   - Git tag creation

3. **Publishing**:
   ```bash
   cargo publish --dry-run
   cargo publish
   ```

### Publishing Checklist

- [ ] All CI checks pass
- [ ] Documentation reviewed and updated
- [ ] Breaking changes documented
- [ ] Migration guide provided (if needed)
- [ ] Release notes prepared
- [ ] Version number updated
- [ ] Git tag created

## Code Style and Review Requirements

### Rust Style Guidelines

1. **Formatting**: Use `rustfmt` with default settings
2. **Linting**: Pass `clippy` with `-D warnings`
3. **Naming**: Follow Rust naming conventions
4. **Error Handling**: Use `Result<T, E>` consistently, avoid panics
5. **Documentation**: All public items must have doc comments

### Code Review Checklist

#### Functionality
- [ ] Code correctly implements requirements
- [ ] Error cases properly handled
- [ ] No panics in production code
- [ ] Thread safety considerations addressed

#### Testing
- [ ] Unit tests cover all code paths
- [ ] Integration tests pass
- [ ] Edge cases tested
- [ ] Test names are descriptive

#### Documentation
- [ ] All public APIs documented
- [ ] Examples provided for complex functions
- [ ] README updated if needed
- [ ] Changelog updated

#### Performance
- [ ] No unnecessary allocations
- [ ] Efficient algorithms used
- [ ] Consider async patterns where appropriate
- [ ] Memory usage reasonable

#### Security
- [ ] Input validation implemented
- [ ] No unsafe code without justification
- [ ] Cryptographic operations reviewed
- [ ] Dependency security checked

### Example Code Standards

```rust
/// Registers a new agent in the registry.
///
/// # Arguments
/// * `client` - The Solana RPC client
/// * `signer` - The account that will own the agent
/// * `agent` - Agent configuration built with AgentBuilder
///
/// # Returns
/// * `Ok(Signature)` - Transaction signature on success
/// * `Err(SdkError)` - Detailed error information
///
/// # Example
/// ```rust
/// use solana_ai_registries::{AgentBuilder, SolanaAiRegistriesClient};
/// 
/// # async fn example() -> Result<(), Box<dyn std::error::Error>> {
/// let client = SolanaAiRegistriesClient::new("https://api.devnet.solana.com");
/// let agent = AgentBuilder::new("my-agent", "My AI Agent")
///     .description("An AI agent that helps users")
///     .build()?;
/// 
/// let signature = client.register_agent(&keypair, agent).await?;
/// # Ok(())
/// # }
/// ```
pub async fn register_agent(
    client: &SolanaAiRegistriesClient,
    signer: &dyn Signer,
    agent: AgentArgs,
) -> SdkResult<Signature> {
    // Implementation here
}
```

## Reference Links

### IDLs and Schemas
- [Agent Registry IDL](../idl/agent_registry.json)
- [MCP Server Registry IDL](../idl/mcp_server_registry.json)
- [SVMAI Token IDL](../idl/svmai_token.json)
- [Payment Metadata Schema](../schemas/payment-metadata.schema.json)

### Constants and Limits
- [Agent Registry Constants](../programs/agent-registry/src/constants.rs)
- [MCP Server Registry Constants](../programs/mcp-server-registry/src/constants.rs)
- [Token Constants](../programs/svmai-token/src/constants.rs)

### Program References
- [Agent Registry Program](../programs/agent-registry/)
- [MCP Server Registry Program](../programs/mcp-server-registry/)
- [SVMAI Token Program](../programs/svmai-token/)

### Documentation
- [SDK Roadmap](SDK_ROADMAP_DETAILED.md)
- [Implementation Summary](IMPLEMENTATION_SUMMARY.md)
- [Deployment Guide](DEPLOYMENT_AND_TESTING_GUIDE.md)

### External References
- [Solana Documentation](https://docs.solana.com/)
- [Anchor Framework](https://www.anchor-lang.com/)
- [Rust API Guidelines](https://rust-lang.github.io/api-guidelines/)
- [SPL Token Program](https://spl.solana.com/token)

## Testing Requirements

### Unit Testing
- **Coverage**: Minimum 90% line coverage, target 100%
- **Scope**: Every public function must have unit tests
- **Edge Cases**: Test boundary conditions and error scenarios
- **Isolation**: Tests should not depend on external services

### Integration Testing
- **Environment**: Tests against local test validator and devnet
- **Scenarios**: End-to-end workflows covering common use cases
- **Data**: Use deterministic test data for reproducible results
- **Cleanup**: Tests must clean up created accounts/state

### Performance Testing
- **Benchmarks**: Critical paths should have performance benchmarks
- **Regression**: Monitor for performance regressions in CI
- **Memory**: Check for memory leaks in long-running operations
- **Concurrency**: Test thread safety and concurrent access patterns

### Security Testing
- **Input Validation**: Test malformed inputs and edge cases
- **Error Handling**: Ensure no sensitive data in error messages
- **Access Control**: Verify permission checks work correctly
- **Cryptography**: Test key generation and signature verification

## Documentation Standards

### API Documentation
- **Completeness**: All public items must have documentation
- **Examples**: Complex functions should include usage examples
- **Format**: Use standard Rustdoc format with proper sections
- **Testing**: Documentation examples must be tested with `cargo test`

### README Documentation
- **Quick Start**: Simple getting started example
- **Features**: Document all feature flags and their effects
- **Examples**: Real-world usage scenarios
- **Installation**: Clear installation and setup instructions

### Contributing Documentation
- **Process**: Clear contribution workflow
- **Standards**: Code style and review requirements
- **Testing**: How to run tests and check coverage
- **Release**: Release process and versioning guidelines

---

This document provides comprehensive guidelines for implementing the Rust SDK. Follow these requirements to ensure consistency, quality, and maintainability of the codebase.