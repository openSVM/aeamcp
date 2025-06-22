# Solana AI Registries Rust SDK

A comprehensive Rust SDK for interacting with the Solana AI Registries, providing type-safe access to Agent Registry and MCP Server Registry protocols.

## Features

- **Agent Registry**: Register, update, and manage autonomous agents with full CRUD operations
- **MCP Server Registry**: Register, update, and manage Model Context Protocol servers
- **Payment Systems**: Support for prepaid, pay-as-you-go, and streaming payment flows
- **Type Safety**: Fully typed requests and responses with compile-time validation
- **Error Handling**: Comprehensive error types matching on-chain program errors
- **Feature Flags**: Conditional compilation for different payment methods

## Installation

Add this to your `Cargo.toml`:

```toml
[dependencies]
solana_ai_registries = "0.1.0"

# Enable specific payment features as needed
[features]
default = []
pyg = ["solana_ai_registries/pyg"]        # Pay-as-you-go payments
prepay = ["solana_ai_registries/prepay"]  # Prepaid account management
stream = ["solana_ai_registries/stream"]  # Streaming payments
```

## Quick Start

### Basic Agent Registration

```rust
use solana_ai_registries::{SolanaAiRegistriesClient, AgentBuilder};
use solana_sdk::signer::keypair::Keypair;

#[tokio::main]
async fn main() -> Result<(), Box<dyn std::error::Error>> {
    // Create client
    let client = SolanaAiRegistriesClient::new("https://api.devnet.solana.com");
    let keypair = Keypair::new();
    
    // Build agent configuration
    let agent = AgentBuilder::new("my-agent-id", "My AI Agent")
        .description("An AI agent that provides helpful services")
        .version("1.0.0")
        .add_service_endpoint("http", "https://my-agent.com/api", true)?
        .add_skill("coding", "Code Generation", vec!["rust", "python"])?
        .tags(vec!["ai", "assistant"])
        .build()?;
    
    // Register agent
    let signature = client.register_agent(&keypair, agent).await?;
    println!("Agent registered: {}", signature);
    
    Ok(())
}
```

### MCP Server Registration

```rust
use solana_ai_registries::{SolanaAiRegistriesClient, mcp::McpServerBuilder};
use solana_sdk::signer::keypair::Keypair;

#[tokio::main]
async fn main() -> Result<(), Box<dyn std::error::Error>> {
    let client = SolanaAiRegistriesClient::new("https://api.devnet.solana.com");
    let keypair = Keypair::new();
    
    // Build MCP server configuration
    let server = McpServerBuilder::new(
        "my-mcp-server", 
        "My MCP Server", 
        "https://my-server.com/mcp"
    )
    .version("1.0.0")
    .supports_tools(true)
    .supports_resources(true)
    .add_tool("search", vec!["query", "web"])?
    .add_resource("documents/*", vec!["pdf", "text"])?
    .tags(vec!["search", "documents"])
    .build()?;
    
    // Register MCP server
    let signature = client.register_mcp_server(&keypair, server).await?;
    println!("MCP server registered: {}", signature);
    
    Ok(())
}
```

### Pay-as-You-Go Payments (with `pyg` feature)

```rust
#[cfg(feature = "pyg")]
use solana_ai_registries::payments::pyg::{PygPaymentClient, estimate_pyg_cost};

#[cfg(feature = "pyg")]
#[tokio::main]
async fn main() -> Result<(), Box<dyn std::error::Error>> {
    let client = PygPaymentClient::new("https://api.devnet.solana.com");
    let payer = Keypair::new();
    let service_provider = Pubkey::new_unique();
    let token_mint = get_token_mint_for_network(false)?; // devnet
    
    // Estimate cost for agent service with priority fee
    let estimate = estimate_pyg_cost(
        convert_a2ampl_to_base_units(2.0), // 2 A2AMPL base fee
        Some(150), // 1.5x priority multiplier
        Some(10000), // 10K compute units
        Some(100) // 100 lamports per CU
    )?;
    
    println!("Estimated cost: {:.4} A2AMPL", estimate.to_a2ampl().total_cost);
    
    // Make payment
    let result = client.pay_agent_service(
        &payer,
        &service_provider,
        &token_mint,
        estimate.total_cost,
        Some(10000)
    ).await?;
    
    println!("Payment successful: {}", result.signature);
    Ok(())
}
```

## Feature Flags

The SDK uses feature flags to enable different payment systems:

- `pyg`: Pay-as-you-go payments with compute unit budgets
- `prepay`: Prepaid account management with balance tracking  
- `stream`: Streaming payments over time

## Error Handling

The SDK provides comprehensive error handling that mirrors the on-chain program errors:

```rust
use solana_ai_registries::{AgentBuilder, SdkError};

let result = AgentBuilder::new("", "Valid Name").build();
match result {
    Ok(agent) => println!("Agent created successfully"),
    Err(SdkError::InvalidAgentIdLength) => println!("Agent ID cannot be empty"),
    Err(e) => println!("Other error: {}", e),
}
```

## Testing

Run tests with different feature combinations:

```bash
# Test core functionality only
cargo test --no-default-features

# Test with specific payment features
cargo test --features pyg
cargo test --features prepay
cargo test --features stream

# Test all features
cargo test --all-features
```

The test suite includes:
- 26 comprehensive agent CRUD test cases
- 16 payment system tests with balance assertions
- 47 unit tests covering all modules
- Feature flag validation tests

## Architecture

### Core Components

- **`SolanaAiRegistriesClient`**: Main RPC client for interacting with registries
- **`AgentBuilder`**: Type-safe agent configuration builder
- **`McpServerBuilder`**: Type-safe MCP server configuration builder
- **Payment Modules**: Separate modules for different payment flows
- **Error Types**: Comprehensive error handling matching on-chain errors

### Program Integration

The SDK integrates with on-chain Solana programs:
- Agent Registry Program: Agent registration and management
- MCP Server Registry Program: MCP server registration and management
- Token Program: Payment processing with A2AMPL tokens

### Type Safety

All interactions are fully typed with compile-time validation:
- String length limits enforced at build time
- Required vs optional fields clearly defined
- Status enums prevent invalid state transitions
- PDA derivation is deterministic and validated

## Constants and Limits

The SDK enforces all on-chain program limits:

```rust
use solana_ai_registries::agent::*;

const MAX_AGENT_ID_LEN: usize = 64;
const MAX_AGENT_NAME_LEN: usize = 128;
const MAX_SERVICE_ENDPOINTS: usize = 3;
const MAX_SKILLS: usize = 10;
// ... and many more
```

## Examples

See the `tests/` directory for comprehensive examples:
- `agent_flow.rs`: 26 test cases covering all agent operations
- `payment_pyg.rs`: Payment system examples with compute unit budgets

## Contributing

This SDK follows the requirements specified in the [SDK Roadmap](../docs/SDK_ROADMAP_DETAILED.md). When contributing:

1. Ensure all tests pass across feature flag combinations
2. Maintain 100% type safety
3. Follow the existing error handling patterns
4. Add comprehensive test coverage for new features

## Publishing to crates.io

This project includes automated GitHub Actions workflows for publishing to crates.io:

### Automatic Publishing

The SDK is automatically published to crates.io when:
- A new release is created on GitHub
- A tag matching the pattern `rust-v*` is pushed (e.g., `rust-v0.1.0`, `rust-v1.2.0`)

### Required Setup

To enable automatic publishing, repository maintainers need to:

1. **Create a crates.io API token**:
   - Go to [crates.io](https://crates.io/me) and generate an API token
   - The token should have publish permissions for the `solana_ai_registries` crate

2. **Add the token as a GitHub secret**:
   - Go to repository Settings → Secrets and variables → Actions
   - Create a new secret named `CRATES_TOKEN`
   - Paste the crates.io API token as the value

### Manual Publishing

For manual publishing during development:

```bash
# Navigate to the rust directory
cd rust

# Test the package
cargo test --all-features

# Build and package
cargo package

# Publish to crates.io (requires CRATES_TOKEN environment variable)
cargo publish
```

### CI/CD Pipeline

The project includes two workflows:

- **`rust-ci.yml`**: Runs on PRs and pushes to test the SDK
- **`publish-rust-sdk.yml`**: Publishes to crates.io on releases/tags

Both workflows test all feature flag combinations to ensure reliability.

## License

This project is licensed under the MIT OR Apache-2.0 license.