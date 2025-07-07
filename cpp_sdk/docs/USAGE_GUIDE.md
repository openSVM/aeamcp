# C++ SDK Usage Guide

This comprehensive guide covers all aspects of using the Solana AI Registries C++ SDK, including common usage patterns, error handling, and edge cases.

## Table of Contents

1. [Getting Started](#getting-started)
2. [Client Configuration](#client-configuration)
3. [Agent Operations](#agent-operations)
4. [MCP Server Operations](#mcp-server-operations)
5. [Payment Flows](#payment-flows)
6. [IDL Operations](#idl-operations)
7. [Error Handling](#error-handling)
8. [Performance Considerations](#performance-considerations)
9. [Best Practices](#best-practices)
10. [Troubleshooting](#troubleshooting)

## Getting Started

### Basic Setup

```cpp
#include <aireg++/aireg++.hpp>

int main() {
    // Initialize the SDK
    SolanaAiRegistries::initialize();
    
    // Create client configuration
    SolanaAiRegistries::ClientConfig config;
    config.cluster = SolanaAiRegistries::Cluster::Devnet;
    config.timeout = std::chrono::milliseconds(5000);
    
    // Create client
    SolanaAiRegistries::Client client(config);
    
    // Use the SDK...
    
    // Cleanup
    SolanaAiRegistries::cleanup();
    return 0;
}
```

### RAII Resource Management

The SDK uses RAII principles for automatic resource management:

```cpp
{
    // Resources are automatically managed
    SolanaAiRegistries::Client client(config);
    SolanaAiRegistries::Agent agent(client);
    
    // Perform operations...
    
} // Resources automatically cleaned up here
```

## Client Configuration

### Cluster Selection

```cpp
// Development cluster (recommended for testing)
config.cluster = SolanaAiRegistries::Cluster::Devnet;

// Test cluster
config.cluster = SolanaAiRegistries::Cluster::Testnet;

// Production cluster
config.cluster = SolanaAiRegistries::Cluster::MainnetBeta;
```

### Timeout Configuration

```cpp
// Conservative timeout for slow networks
config.timeout = std::chrono::milliseconds(10000);

// Fast timeout for high-performance applications
config.timeout = std::chrono::milliseconds(1000);

// Default timeout
config.timeout = std::chrono::milliseconds(5000);
```

### Connection Testing

```cpp
SolanaAiRegistries::Client client(config);

if (!client.is_connected()) {
    std::cerr << "Failed to connect to " << client.get_rpc_url() << std::endl;
    return 1;
}

std::cout << "Connected to: " << client.get_rpc_url() << std::endl;
```

## Agent Operations

### Agent Registration

```cpp
#include <aireg++/agent.hpp>

try {
    SolanaAiRegistries::Agent agent(client);
    
    // Create registration parameters
    SolanaAiRegistries::AgentRegistrationParams params;
    params.name = "My AI Agent";
    params.description = "Advanced text generation agent";
    params.version = "1.0.0";
    params.capabilities = {
        SolanaAiRegistries::AgentCapability::TextGeneration,
        SolanaAiRegistries::AgentCapability::CodeGeneration
    };
    params.api_endpoint = "https://api.example.com/agent";
    params.pricing_model = SolanaAiRegistries::PricingModel::PerToken;
    params.price_per_token = 1000; // lamports
    
    // Load your keypair (32 bytes private key + 32 bytes public key)
    std::vector<uint8_t> owner_keypair = load_keypair_from_file("owner.key");
    
    // Register the agent
    SolanaAiRegistries::PublicKey agent_id = agent.register_agent(params, owner_keypair);
    
    std::cout << "Agent registered with ID: " << agent_id.to_base58() << std::endl;
    
} catch (const SolanaAiRegistries::RegistryException& e) {
    std::cerr << "Registration failed: " << e.what() << std::endl;
} catch (const SolanaAiRegistries::TransactionException& e) {
    std::cerr << "Transaction failed: " << e.what() << std::endl;
}
```

### Agent Query Operations

```cpp
// Get specific agent information
try {
    auto agent_info = agent.get_agent(agent_id);
    if (agent_info) {
        std::cout << "Agent Name: " << agent_info->name << std::endl;
        std::cout << "Version: " << agent_info->version << std::endl;
        std::cout << "Active: " << (agent_info->is_active ? "Yes" : "No") << std::endl;
    } else {
        std::cout << "Agent not found" << std::endl;
    }
} catch (const SolanaAiRegistries::RpcException& e) {
    std::cerr << "RPC error: " << e.what() << std::endl;
}

// Search agents by criteria
SolanaAiRegistries::AgentSearchFilters filters;
filters.capabilities = {SolanaAiRegistries::AgentCapability::TextGeneration};
filters.pricing_model = SolanaAiRegistries::PricingModel::PerToken;
filters.max_price_per_token = 2000; // lamports

auto agents = agent.search_agents(filters, 10, 0); // limit=10, offset=0
for (const auto& agent_info : agents) {
    std::cout << "Found agent: " << agent_info.name 
              << " (" << agent_info.agent_id.to_base58() << ")" << std::endl;
}
```

### Agent Updates

```cpp
// Update agent information
SolanaAiRegistries::AgentUpdateParams update_params;
update_params.description = "Updated description with new features";
update_params.price_per_token = 800; // Reduced price

try {
    auto signature = agent.update_agent(agent_id, update_params, owner_keypair);
    std::cout << "Agent updated. Transaction: " << signature.to_base58() << std::endl;
} catch (const SolanaAiRegistries::SdkException& e) {
    std::cerr << "Update failed: " << e.what() << std::endl;
}
```

### Agent Status Management

```cpp
// Deactivate agent temporarily
try {
    auto signature = agent.deactivate_agent(agent_id, owner_keypair);
    std::cout << "Agent deactivated" << std::endl;
    
    // Reactivate later
    signature = agent.reactivate_agent(agent_id, owner_keypair);
    std::cout << "Agent reactivated" << std::endl;
    
} catch (const SolanaAiRegistries::SdkException& e) {
    std::cerr << "Status change failed: " << e.what() << std::endl;
}

// Permanently delete agent
try {
    auto signature = agent.delete_agent(agent_id, owner_keypair);
    std::cout << "Agent permanently deleted" << std::endl;
} catch (const SolanaAiRegistries::SdkException& e) {
    std::cerr << "Deletion failed: " << e.what() << std::endl;
}
```

## MCP Server Operations

### MCP Server Registration

```cpp
#include <aireg++/mcp.hpp>

SolanaAiRegistries::Mcp mcp(client);

// Register MCP server
SolanaAiRegistries::McpRegistrationParams params;
params.name = "Data Analysis Server";
params.description = "Provides data analysis tools and resources";
params.version = "2.1.0";
params.protocol = SolanaAiRegistries::McpProtocol::Http;
params.endpoint = "https://mcp.example.com/api";
params.capabilities = {
    SolanaAiRegistries::McpCapability::Tools,
    SolanaAiRegistries::McpCapability::Resources
};

try {
    auto server_id = mcp.register_server(params, owner_keypair);
    std::cout << "MCP Server registered: " << server_id.to_base58() << std::endl;
} catch (const SolanaAiRegistries::SdkException& e) {
    std::cerr << "MCP registration failed: " << e.what() << std::endl;
}
```

### WebSocket MCP Servers

```cpp
// Register WebSocket-based MCP server
params.protocol = SolanaAiRegistries::McpProtocol::WebSocket;
params.endpoint = "wss://mcp.example.com/ws";

// Validate endpoint before registration
try {
    mcp.validate_endpoint(params.protocol, params.endpoint);
    auto server_id = mcp.register_server(params, owner_keypair);
} catch (const std::invalid_argument& e) {
    std::cerr << "Invalid endpoint: " << e.what() << std::endl;
}
```

### Custom Protocol Support

```cpp
// Register server with custom protocol
params.protocol = SolanaAiRegistries::McpProtocol::Custom;
params.endpoint = "tcp://mcp.example.com:9000";
params.protocol_details = "Custom binary protocol v1.2";

auto server_id = mcp.register_server(params, owner_keypair);
```

## Payment Flows

### Prepayment Flow

```cpp
#include <aireg++/payments.hpp>

SolanaAiRegistries::Payments payments(client);

// Create prepayment
SolanaAiRegistries::PrepayParams prepay_params;
prepay_params.agent_id = agent_id;
prepay_params.amount = 1000000; // 1 SOL in lamports
prepay_params.method = SolanaAiRegistries::PaymentMethod::Sol;

try {
    auto [payment_id, signature] = payments.create_prepayment(prepay_params, user_keypair);
    std::cout << "Prepayment created: " << payment_id.to_base58() << std::endl;
    std::cout << "Transaction: " << signature.to_base58() << std::endl;
} catch (const SolanaAiRegistries::PaymentException& e) {
    std::cerr << "Payment failed: " << e.what() << std::endl;
}
```

### Pay-as-You-Go

```cpp
// Setup pay-as-you-go payment
SolanaAiRegistries::PayAsYouGoParams payg_params;
payg_params.agent_id = agent_id;
payg_params.amount_per_request = 1000; // lamports per request
payg_params.method = SolanaAiRegistries::PaymentMethod::SvmaiToken;
payg_params.token_mint = svmai_token_mint; // SVMAI token mint address

auto [payment_id, signature] = payments.pay_as_you_go(payg_params, user_keypair);
```

### Subscription Payments

```cpp
// Create monthly subscription
SolanaAiRegistries::SubscriptionParams sub_params;
sub_params.agent_id = agent_id;
sub_params.amount_per_period = 5000000; // 5 SOL per month
sub_params.billing_period = std::chrono::hours(24 * 30); // 30 days
sub_params.method = SolanaAiRegistries::PaymentMethod::Sol;

auto [subscription_id, signature] = payments.create_subscription(sub_params, user_keypair);

// Cancel subscription later
auto cancel_signature = payments.cancel_subscription(subscription_id, user_keypair);
```

### Payment Streaming

```cpp
// Create payment stream
SolanaAiRegistries::StreamParams stream_params;
stream_params.recipient = agent_owner_id;
stream_params.rate_per_second = 100; // lamports per second
stream_params.duration = std::chrono::hours(24); // 24 hour stream
stream_params.method = SolanaAiRegistries::PaymentMethod::Usdc;
stream_params.token_mint = usdc_mint_address;

auto [stream_id, signature] = payments.start_stream(stream_params, user_keypair);

// Stop stream before completion
auto stop_signature = payments.stop_stream(stream_id, user_keypair);
```

### Balance Management

```cpp
// Check SOL balance
auto sol_balance = payments.get_balance(user_id, SolanaAiRegistries::PaymentMethod::Sol);
std::cout << "SOL Balance: " << sol_balance.balance << " lamports" << std::endl;

// Check all token balances
auto all_balances = payments.get_all_balances(user_id);
for (const auto& balance : all_balances) {
    std::string method = SolanaAiRegistries::Payments::payment_method_to_string(balance.method);
    std::cout << method << " Balance: " << balance.balance << std::endl;
}
```

## IDL Operations

### Loading and Parsing IDL

```cpp
#include <aireg++/idl.hpp>

SolanaAiRegistries::Idl idl;

// Load from JSON string
std::string idl_json = R"({
    "name": "agent_registry",
    "version": "1.0.0",
    "instructions": [...]
})";

try {
    auto idl_def = idl.parse_from_json(idl_json);
    std::cout << "Loaded IDL: " << idl_def.name << " v" << idl_def.version << std::endl;
} catch (const SolanaAiRegistries::SdkException& e) {
    std::cerr << "IDL parsing failed: " << e.what() << std::endl;
}

// Load from file
auto idl_def = idl.parse_from_file("agent_registry.json");
```

### Code Generation

```cpp
// Generate C++ code from IDL
SolanaAiRegistries::CodeGenOptions options;
options.namespace_name = "AgentRegistry";
options.include_guards = true;
options.generate_builders = true;

auto generated_code = idl.generate_cpp_code(idl_def, options);

// Write to files
std::ofstream header_file("agent_registry.hpp");
header_file << generated_code.header_content;

std::ofstream source_file("agent_registry.cpp");
source_file << generated_code.source_content;
```

### Built-in IDL Access

```cpp
// Load built-in IDL definitions
auto agent_idl = idl.load_agent_registry_idl();
auto mcp_idl = idl.load_mcp_server_registry_idl();
auto token_idl = idl.load_svmai_token_idl();

// Validate IDL definitions
auto errors = idl.validate_idl(agent_idl);
if (!errors.empty()) {
    for (const auto& error : errors) {
        std::cerr << "IDL Error: " << error << std::endl;
    }
}
```

## Error Handling

### Exception Hierarchy

The SDK uses a comprehensive exception hierarchy for different error types:

```cpp
try {
    // SDK operations...
} catch (const SolanaAiRegistries::RpcException& e) {
    // Network/RPC errors
    std::cerr << "RPC Error: " << e.what() << std::endl;
    // Retry logic here
} catch (const SolanaAiRegistries::TransactionException& e) {
    // Transaction building/signing errors
    std::cerr << "Transaction Error: " << e.what() << std::endl;
    // Check keypair, account balance, etc.
} catch (const SolanaAiRegistries::PaymentException& e) {
    // Payment-specific errors
    std::cerr << "Payment Error: " << e.what() << std::endl;
    // Check balance, token accounts, etc.
} catch (const SolanaAiRegistries::RegistryException& e) {
    // Registry operation errors
    std::cerr << "Registry Error: " << e.what() << std::endl;
    // Check agent/server existence, permissions, etc.
} catch (const SolanaAiRegistries::SdkException& e) {
    // Base SDK errors
    std::cerr << "SDK Error: " << e.what() << std::endl;
}
```

### Error Recovery Patterns

```cpp
// Retry pattern for network errors
template<typename Func>
auto retry_on_network_error(Func&& func, int max_retries = 3) {
    for (int attempt = 0; attempt < max_retries; ++attempt) {
        try {
            return func();
        } catch (const SolanaAiRegistries::RpcException& e) {
            if (attempt == max_retries - 1) {
                throw; // Re-throw on final attempt
            }
            std::this_thread::sleep_for(std::chrono::milliseconds(1000 * (attempt + 1)));
        }
    }
}

// Usage
auto agent_info = retry_on_network_error([&]() {
    return agent.get_agent(agent_id);
});
```

### Validation Errors

```cpp
// Validate parameters before operations
SolanaAiRegistries::AgentRegistrationParams params;
params.name = ""; // Invalid: empty name

try {
    agent.validate_registration_params(params);
} catch (const std::invalid_argument& e) {
    std::cerr << "Validation error: " << e.what() << std::endl;
    // Fix parameters and retry
    params.name = "Valid Agent Name";
    agent.validate_registration_params(params); // Should succeed
}
```

## Performance Considerations

### Connection Pooling

```cpp
// Reuse client instances
class SdkManager {
private:
    std::unique_ptr<SolanaAiRegistries::Client> client_;
    std::unique_ptr<SolanaAiRegistries::Agent> agent_;
    std::unique_ptr<SolanaAiRegistries::Mcp> mcp_;
    std::unique_ptr<SolanaAiRegistries::Payments> payments_;

public:
    SdkManager(const SolanaAiRegistries::ClientConfig& config) 
        : client_(std::make_unique<SolanaAiRegistries::Client>(config))
        , agent_(std::make_unique<SolanaAiRegistries::Agent>(*client_))
        , mcp_(std::make_unique<SolanaAiRegistries::Mcp>(*client_))
        , payments_(std::make_unique<SolanaAiRegistries::Payments>(*client_)) {}
    
    // Provide access to operations
    SolanaAiRegistries::Agent& agent() { return *agent_; }
    SolanaAiRegistries::Mcp& mcp() { return *mcp_; }
    SolanaAiRegistries::Payments& payments() { return *payments_; }
};
```

### Batch Operations

```cpp
// Batch multiple operations
std::vector<SolanaAiRegistries::PublicKey> agent_ids = {id1, id2, id3};
std::vector<SolanaAiRegistries::AgentInfo> agent_infos;

// Process in parallel (if thread-safe)
std::vector<std::future<std::optional<SolanaAiRegistries::AgentInfo>>> futures;
for (const auto& id : agent_ids) {
    futures.push_back(std::async(std::launch::async, [&agent, id]() {
        return agent.get_agent(id);
    }));
}

for (auto& future : futures) {
    if (auto info = future.get()) {
        agent_infos.push_back(*info);
    }
}
```

### Memory Management

```cpp
// Use move semantics for large objects
std::vector<uint8_t> large_keypair = load_large_keypair();
auto signature = agent.register_agent(params, std::move(large_keypair));

// RAII for automatic cleanup
{
    SolanaAiRegistries::Resource<FILE> file_resource(
        fopen("data.bin", "rb"), 
        [](FILE* f) { if (f) fclose(f); }
    );
    
    if (file_resource.is_valid()) {
        // Use file_resource.get()
    }
} // Automatic cleanup
```

## Best Practices

### Secure Keypair Management

```cpp
// Use secure memory for keypairs
class SecureKeypair {
private:
    std::vector<uint8_t> data_;
    
public:
    SecureKeypair() : data_(64) {
        // Initialize with secure random data
        if (crypto_sign_keypair(data_.data() + 32, data_.data()) != 0) {
            throw std::runtime_error("Failed to generate keypair");
        }
    }
    
    ~SecureKeypair() {
        // Securely clear memory
        sodium_memzero(data_.data(), data_.size());
    }
    
    const std::vector<uint8_t>& data() const { return data_; }
    
    // Prevent copying
    SecureKeypair(const SecureKeypair&) = delete;
    SecureKeypair& operator=(const SecureKeypair&) = delete;
    
    // Allow moving
    SecureKeypair(SecureKeypair&& other) noexcept : data_(std::move(other.data_)) {}
    SecureKeypair& operator=(SecureKeypair&& other) noexcept {
        if (this != &other) {
            sodium_memzero(data_.data(), data_.size());
            data_ = std::move(other.data_);
        }
        return *this;
    }
};
```

### Configuration Management

```cpp
// Environment-based configuration
SolanaAiRegistries::ClientConfig load_config_from_env() {
    SolanaAiRegistries::ClientConfig config;
    
    std::string cluster_env = std::getenv("SOLANA_CLUSTER") ?: "devnet";
    if (cluster_env == "mainnet") {
        config.cluster = SolanaAiRegistries::Cluster::MainnetBeta;
    } else if (cluster_env == "testnet") {
        config.cluster = SolanaAiRegistries::Cluster::Testnet;
    } else {
        config.cluster = SolanaAiRegistries::Cluster::Devnet;
    }
    
    std::string timeout_env = std::getenv("RPC_TIMEOUT") ?: "5000";
    config.timeout = std::chrono::milliseconds(std::stoi(timeout_env));
    
    return config;
}
```

### Logging Integration

```cpp
// Custom logging with SDK operations
#include <spdlog/spdlog.h>

void register_agent_with_logging(/* parameters */) {
    spdlog::info("Starting agent registration for: {}", params.name);
    
    try {
        auto agent_id = agent.register_agent(params, keypair);
        spdlog::info("Agent registered successfully: {}", agent_id.to_base58());
    } catch (const SolanaAiRegistries::SdkException& e) {
        spdlog::error("Agent registration failed: {}", e.what());
        throw;
    }
}
```

## Troubleshooting

### Common Issues

**1. Connection Timeouts**
```cpp
// Increase timeout for slow networks
config.timeout = std::chrono::milliseconds(15000);

// Test connection explicitly
if (!client.is_connected()) {
    std::cerr << "Cannot connect to: " << client.get_rpc_url() << std::endl;
    // Check network, firewall, RPC endpoint
}
```

**2. Transaction Failures**
```cpp
// Check account balance before transactions
auto balance = client.get_balance(payer_public_key);
auto min_balance = client.get_minimum_balance_for_rent_exemption(account_size);

if (balance < min_balance + estimated_fee) {
    std::cerr << "Insufficient balance for transaction" << std::endl;
    return;
}
```

**3. Base58 Encoding Issues**
```cpp
// Validate base58 strings before use
try {
    SolanaAiRegistries::PublicKey key(base58_string);
    // Valid base58
} catch (const SolanaAiRegistries::SdkException& e) {
    std::cerr << "Invalid base58 string: " << e.what() << std::endl;
}
```

**4. URL Validation Failures**
```cpp
// Test URL validation separately
try {
    agent.validate_registration_params(params);
} catch (const std::invalid_argument& e) {
    std::cerr << "Invalid URL format: " << e.what() << std::endl;
    // Check URL scheme, domain, port, path
}
```

### Debug Mode

```cpp
// Enable debug output
#ifdef DEBUG
    #define SDK_DEBUG(msg) std::cerr << "[DEBUG] " << msg << std::endl
#else
    #define SDK_DEBUG(msg) ((void)0)
#endif

void debug_transaction_building() {
    SolanaAiRegistries::TransactionBuilder builder(client);
    
    SDK_DEBUG("Setting payer");
    builder.set_payer(payer_key);
    
    SDK_DEBUG("Adding instruction");
    builder.add_instruction(program_id, accounts, data);
    
    SDK_DEBUG("Building transaction");
    auto tx_data = builder.build();
    
    SDK_DEBUG("Transaction size: " + std::to_string(tx_data.size()));
}
```

### Memory Debugging

```cpp
// Use with Valgrind or AddressSanitizer
void memory_test() {
    std::vector<std::unique_ptr<SolanaAiRegistries::Client>> clients;
    
    // Create and destroy many clients
    for (int i = 0; i < 1000; ++i) {
        clients.push_back(std::make_unique<SolanaAiRegistries::Client>(config));
        if (i % 100 == 0) {
            clients.clear(); // Force cleanup
        }
    }
}
```

This documentation provides comprehensive coverage of the C++ SDK with practical examples, error scenarios, and best practices for production use.