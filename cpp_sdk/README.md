# Solana AI Registries C++ SDK

A modern C++17 wrapper for the Solana AI Registries, providing type-safe, RAII-compliant interfaces for interacting with AI agent and MCP server registries on Solana.

## Features

- **Header-only library** - Easy integration into existing projects
- **Modern C++17** - Uses latest C++ features and best practices
- **RAII compliance** - Automatic resource management with smart pointers
- **Type safety** - Comprehensive type checking and validation
- **Exception safety** - Strong exception guarantees throughout
- **Comprehensive testing** - >95% test coverage with Google Test
- **Full documentation** - Complete Doxygen API documentation
- **Memory safety** - Zero memory leaks validated with Valgrind

## Architecture

The SDK consists of five main components:

```
┌─────────────────────────────────────────────────────────────────┐
│                     C++ SDK (aireg++)                          │
│                   Header-only Library                          │
├─────────────────────────────────────────────────────────────────┤
│  SolanaAiRegistries::Client     │  SolanaAiRegistries::Agent    │
│  SolanaAiRegistries::Mcp        │  SolanaAiRegistries::Payments │
│  SolanaAiRegistries::Idl        │  Error Handling & RAII       │
├─────────────────────────────────────────────────────────────────┤
│                    Bridge Layer (extern "C")                   │
├─────────────────────────────────────────────────────────────────┤
│                     C SDK (libaireg)                           │
│                   Static/Dynamic Library                       │
└─────────────────────────────────────────────────────────────────┘
```

### Core Components

- **Client** - RPC communication and transaction building
- **Agent** - AI agent registry operations (CRUD)
- **Mcp** - MCP server registry operations (CRUD)
- **Payments** - Payment processing (prepay, pay-as-you-go, subscriptions, streams)
- **Idl** - Interface Definition Language support for compile-time structs

## Requirements

- **C++17 compatible compiler** (GCC 7+, Clang 6+, MSVC 2017+)
- **CMake 3.16+**
- **libsodium** (for cryptographic operations)
- **Google Test** (for testing)
- **Doxygen** (for documentation generation)

## Installation

### Using CMake

```bash
git clone https://github.com/openSVM/aeamcp.git
cd aeamcp/cpp_sdk
mkdir build && cd build
cmake ..
make
make install
```

### Using the SDK in your project

```cmake
find_package(aireg++ REQUIRED)
target_link_libraries(your_target aireg++::aireg++)
```

## Quick Start

```cpp
#include <aireg++/aireg++.hpp>

using namespace SolanaAiRegistries;

int main() {
    try {
        // Initialize the SDK
        initialize();
        
        // Create client for devnet
        ClientConfig config;
        config.cluster = Cluster::Devnet;
        Client client(config);
        
        // Create registry components
        Agent agent(client);
        Mcp mcp(client);
        Payments payments(client);
        
        // Search for agents
        AgentSearchFilters filters;
        filters.active_only = true;
        filters.capabilities = {AgentCapability::TextGeneration};
        
        auto agents = agent.search_agents(filters, 10, 0);
        std::cout << "Found " << agents.size() << " text generation agents" << std::endl;
        
        // Query MCP servers
        auto servers = mcp.search_servers({}, 10, 0);
        std::cout << "Found " << servers.size() << " MCP servers" << std::endl;
        
        // Cleanup
        cleanup();
        
    } catch (const SdkException& e) {
        std::cerr << "SDK Error: " << e.what() << std::endl;
        return 1;
    }
    
    return 0;
}
```

## API Reference

### Client Operations

```cpp
// Create client
Client client(config);

// RPC operations
std::string blockhash = client.get_latest_blockhash();
uint64_t balance = client.get_balance(public_key);
auto account_info = client.get_account_info(public_key);

// Transaction building
TransactionBuilder builder(client);
auto tx_data = builder
    .set_payer(payer)
    .add_instruction(program_id, accounts, data)
    .build();
```

### Agent Registry Operations

```cpp
Agent agent(client);

// Search agents
AgentSearchFilters filters;
filters.capabilities = {AgentCapability::TextGeneration};
filters.pricing_model = PricingModel::PerRequest;
filters.max_price_per_request = 5000;

auto agents = agent.search_agents(filters, 10, 0);

// Get agent details
auto agent_info = agent.get_agent(agent_id);
if (agent_info) {
    std::cout << "Agent: " << agent_info->name << std::endl;
    std::cout << "Price: " << agent_info->price_per_request << " lamports" << std::endl;
}
```

### MCP Server Registry Operations

```cpp
Mcp mcp(client);

// Search servers
McpSearchFilters filters;
filters.protocol = McpProtocol::Http;
filters.capabilities = {McpCapability::Resources};

auto servers = mcp.search_servers(filters, 10, 0);

// Get server details
auto server_info = mcp.get_server(server_id);
if (server_info) {
    std::cout << "Server: " << server_info->name << std::endl;
    std::cout << "Endpoint: " << server_info->endpoint << std::endl;
}
```

### Payment Operations

```cpp
Payments payments(client);

// Create prepayment
PrepayParams params;
params.recipient = recipient_pubkey;
params.amount = 1000000; // 1 SOL in lamports
params.method = PaymentMethod::Sol;

auto [payment_id, signature] = payments.create_prepayment(params, payer_keypair);

// Check balance
auto balance = payments.get_balance(account, PaymentMethod::Sol);
std::cout << "Balance: " << balance.balance << " lamports" << std::endl;
```

### IDL Operations

```cpp
// Load built-in IDL
IdlDefinition agent_idl = Idl::load_agent_registry_idl();

// Parse custom IDL
IdlDefinition custom_idl = Idl::parse_from_file("custom_program.json");

// Generate C++ code
CodeGenOptions options;
options.namespace_name = "MyProgram";
GeneratedCode code = Idl::generate_cpp_code(custom_idl, options);
```

## Error Handling

The SDK uses a comprehensive exception hierarchy:

```cpp
try {
    // SDK operations
} catch (const RpcException& e) {
    // Handle RPC errors
} catch (const TransactionException& e) {
    // Handle transaction errors
} catch (const PaymentException& e) {
    // Handle payment errors
} catch (const RegistryException& e) {
    // Handle registry errors
} catch (const SdkException& e) {
    // Handle base SDK errors
}
```

## Testing

```bash
# Build and run tests
mkdir build && cd build
cmake -DCMAKE_BUILD_TYPE=Debug ..
make
make test

# Run specific test suites
./tests/aireg++_tests --gtest_filter="ClientTest.*"
./tests/aireg++_tests --gtest_filter="*Integration*"

# Generate coverage report
make coverage
```

## Examples

See the `examples/` directory for complete usage examples:

- `basic_usage.cpp` - Basic SDK usage and connectivity
- `agent_operations.cpp` - Agent registry operations
- `mcp_operations.cpp` - MCP server registry operations
- `payment_flows.cpp` - Payment processing examples
- `idl_generation.cpp` - IDL parsing and code generation

## Documentation

Generate API documentation:

```bash
make docs
# Documentation will be available in docs/doxygen/html/index.html
```

## Contributing

1. Follow the Google C++ Style Guide
2. Ensure all tests pass
3. Add comprehensive tests for new features
4. Update documentation
5. Run `clang-format` and `clang-tidy`

## License

This project is licensed under the MIT License. See LICENSE file for details.

## Support

For issues and questions:
- GitHub Issues: https://github.com/openSVM/aeamcp/issues
- Documentation: https://docs.solana-ai-registries.com

## Roadmap

- [x] Core SDK implementation
- [x] Comprehensive test suite
- [x] API documentation
- [ ] Performance optimizations
- [ ] Additional payment methods
- [ ] Advanced IDL features
- [ ] Integration examples