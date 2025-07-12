# C SDK Integration Guide

This guide explains how to replace the current mock stub implementations with actual C SDK calls when the underlying C library becomes available.

## Table of Contents

1. [Current Architecture](#current-architecture)
2. [C SDK Interface Design](#c-sdk-interface-design)
3. [Integration Strategy](#integration-strategy)
4. [Implementation Steps](#implementation-steps)
5. [Testing and Validation](#testing-and-validation)
6. [Performance Considerations](#performance-considerations)

## Current Architecture

The current C++ SDK uses a layered architecture:

```
┌─────────────────────────────────────────────────────────────────┐
│                     C++ SDK (aireg++)                          │
│                   Header-only Library                          │
├─────────────────────────────────────────────────────────────────┤
│  SolanaAiRegistries::Client     │  SolanaAiRegistries::Agent    │
│  SolanaAiRegistries::Mcp        │  SolanaAiRegistries::Payments │
│  SolanaAiRegistries::Idl        │  Error Handling & RAII       │
├─────────────────────────────────────────────────────────────────┤
│                    Mock Stubs (stubs.cpp)                      │
│                  [TO BE REPLACED]                              │
├─────────────────────────────────────────────────────────────────┤
│                     C SDK (libaireg)                           │
│                   [TO BE IMPLEMENTED]                          │
└─────────────────────────────────────────────────────────────────┘
```

## C SDK Interface Design

### Expected C API Structure

The C SDK should provide a clean C interface that the C++ SDK can wrap. Here's the recommended structure:

```c
// aireg_client.h
typedef struct aireg_client aireg_client_t;
typedef struct aireg_config {
    const char* rpc_url;
    uint32_t timeout_ms;
    uint8_t cluster; // 0=devnet, 1=testnet, 2=mainnet
} aireg_config_t;

typedef struct aireg_result {
    int32_t error_code;
    char* error_message;
    void* data;
    size_t data_size;
} aireg_result_t;

// Client operations
aireg_client_t* aireg_client_create(const aireg_config_t* config);
void aireg_client_destroy(aireg_client_t* client);
aireg_result_t* aireg_client_get_account_info(aireg_client_t* client, const uint8_t* pubkey);
aireg_result_t* aireg_client_get_balance(aireg_client_t* client, const uint8_t* pubkey);
aireg_result_t* aireg_client_send_transaction(aireg_client_t* client, const uint8_t* tx_data, size_t tx_size);

// Memory management
void aireg_result_free(aireg_result_t* result);
```

### Agent Operations

```c
// aireg_agent.h
typedef struct aireg_agent_params {
    const char* name;
    const char* description;
    const char* version;
    const char* api_endpoint;
    uint8_t capabilities[16]; // Bitfield for capabilities
    uint8_t pricing_model;
    uint64_t price_per_token;
} aireg_agent_params_t;

aireg_result_t* aireg_agent_register(aireg_client_t* client, 
                                    const aireg_agent_params_t* params,
                                    const uint8_t* owner_keypair);

aireg_result_t* aireg_agent_get(aireg_client_t* client, const uint8_t* agent_id);
aireg_result_t* aireg_agent_search(aireg_client_t* client, 
                                  const char* filters_json,
                                  uint32_t limit, 
                                  uint32_t offset);
```

### MCP Operations

```c
// aireg_mcp.h
typedef struct aireg_mcp_params {
    const char* name;
    const char* description;
    const char* version;
    const char* endpoint;
    uint8_t protocol; // 0=http, 1=websocket, 2=stdio, 3=custom
    uint8_t capabilities[8]; // Bitfield for capabilities
} aireg_mcp_params_t;

aireg_result_t* aireg_mcp_register(aireg_client_t* client,
                                  const aireg_mcp_params_t* params,
                                  const uint8_t* owner_keypair);

aireg_result_t* aireg_mcp_get(aireg_client_t* client, const uint8_t* server_id);
```

### Payment Operations

```c
// aireg_payments.h
typedef struct aireg_payment_params {
    uint8_t agent_id[32];
    uint64_t amount;
    uint8_t method; // 0=sol, 1=svmai, 2=usdc, 3=custom
    uint8_t token_mint[32]; // For custom tokens
    uint8_t payment_type; // 0=prepay, 1=payasyougo, 2=subscription, 3=stream
} aireg_payment_params_t;

aireg_result_t* aireg_payment_create(aireg_client_t* client,
                                    const aireg_payment_params_t* params,
                                    const uint8_t* payer_keypair);

aireg_result_t* aireg_payment_get_balance(aireg_client_t* client,
                                         const uint8_t* account,
                                         uint8_t method);
```

## Integration Strategy

### Phase 1: C Interface Wrapper

Create a thin C++ wrapper around the C API that maintains the current C++ interface:

```cpp
// c_sdk_wrapper.hpp
#pragma once

extern "C" {
#include "aireg_client.h"
#include "aireg_agent.h"
#include "aireg_mcp.h"
#include "aireg_payments.h"
}

namespace SolanaAiRegistries {
namespace CSdk {

class ResultWrapper {
private:
    aireg_result_t* result_;
    
public:
    explicit ResultWrapper(aireg_result_t* result) : result_(result) {}
    
    ~ResultWrapper() {
        if (result_) {
            aireg_result_free(result_);
        }
    }
    
    // Move-only semantics
    ResultWrapper(const ResultWrapper&) = delete;
    ResultWrapper& operator=(const ResultWrapper&) = delete;
    
    ResultWrapper(ResultWrapper&& other) noexcept : result_(other.result_) {
        other.result_ = nullptr;
    }
    
    ResultWrapper& operator=(ResultWrapper&& other) noexcept {
        if (this != &other) {
            if (result_) aireg_result_free(result_);
            result_ = other.result_;
            other.result_ = nullptr;
        }
        return *this;
    }
    
    bool is_success() const { 
        return result_ && result_->error_code == 0; 
    }
    
    std::string get_error() const {
        return (result_ && result_->error_message) ? 
               std::string(result_->error_message) : 
               "Unknown error";
    }
    
    template<typename T>
    T* get_data() const {
        return is_success() ? static_cast<T*>(result_->data) : nullptr;
    }
    
    size_t get_data_size() const {
        return is_success() ? result_->data_size : 0;
    }
};

class ClientWrapper {
private:
    aireg_client_t* client_;
    
public:
    explicit ClientWrapper(const ClientConfig& config) {
        aireg_config_t c_config = {
            .rpc_url = cluster_to_url(config.cluster).c_str(),
            .timeout_ms = static_cast<uint32_t>(config.timeout.count()),
            .cluster = static_cast<uint8_t>(config.cluster)
        };
        
        client_ = aireg_client_create(&c_config);
        if (!client_) {
            throw SdkException("Failed to create C SDK client");
        }
    }
    
    ~ClientWrapper() {
        if (client_) {
            aireg_client_destroy(client_);
        }
    }
    
    // Move-only semantics
    ClientWrapper(const ClientWrapper&) = delete;
    ClientWrapper& operator=(const ClientWrapper&) = delete;
    
    ClientWrapper(ClientWrapper&& other) noexcept : client_(other.client_) {
        other.client_ = nullptr;
    }
    
    ClientWrapper& operator=(ClientWrapper&& other) noexcept {
        if (this != &other) {
            if (client_) aireg_client_destroy(client_);
            client_ = other.client_;
            other.client_ = nullptr;
        }
        return *this;
    }
    
    aireg_client_t* get() const { return client_; }
    
    ResultWrapper get_account_info(const PublicKey& public_key) {
        auto result = aireg_client_get_account_info(client_, public_key.bytes());
        return ResultWrapper(result);
    }
    
    ResultWrapper get_balance(const PublicKey& public_key) {
        auto result = aireg_client_get_balance(client_, public_key.bytes());
        return ResultWrapper(result);
    }
    
    ResultWrapper send_transaction(const std::vector<uint8_t>& tx_data) {
        auto result = aireg_client_send_transaction(client_, tx_data.data(), tx_data.size());
        return ResultWrapper(result);
    }
};

} // namespace CSdk
} // namespace SolanaAiRegistries
```

### Phase 2: Replace Mock Implementations

Update the implementation files to use the C SDK wrapper:

```cpp
// client.cpp (updated implementation)
#include "c_sdk_wrapper.hpp"

class Client::Impl {
public:
    CSdk::ClientWrapper c_client;
    
    Impl(const ClientConfig& config) : c_client(config) {}
};

std::optional<AccountInfo> Client::get_account_info(const PublicKey& public_key) {
    try {
        auto result = pimpl_->c_client.get_account_info(public_key);
        
        if (!result.is_success()) {
            throw RpcException(result.get_error());
        }
        
        // Parse the C result into C++ structure
        auto* c_account_info = result.get_data<aireg_account_info_t>();
        if (!c_account_info) {
            return std::nullopt;
        }
        
        AccountInfo info;
        info.lamports = c_account_info->lamports;
        info.owner = PublicKey(c_account_info->owner);
        info.data.assign(c_account_info->data, 
                        c_account_info->data + c_account_info->data_size);
        info.executable = c_account_info->executable;
        info.rent_epoch = c_account_info->rent_epoch;
        
        return info;
        
    } catch (const std::exception& e) {
        throw RpcException("Failed to get account info: " + std::string(e.what()));
    }
}
```

### Phase 3: Error Handling Integration

Map C error codes to C++ exceptions:

```cpp
// error_mapping.hpp
namespace SolanaAiRegistries {
namespace CSdk {

void check_result_and_throw(const ResultWrapper& result) {
    if (result.is_success()) {
        return;
    }
    
    // Map C error codes to C++ exceptions
    // This would need to be defined based on the actual C SDK error codes
    std::string error_msg = result.get_error();
    
    if (error_msg.find("RPC") != std::string::npos) {
        throw RpcException(error_msg);
    } else if (error_msg.find("Transaction") != std::string::npos) {
        throw TransactionException(error_msg);
    } else if (error_msg.find("Payment") != std::string::npos) {
        throw PaymentException(error_msg);
    } else if (error_msg.find("Registry") != std::string::npos) {
        throw RegistryException(error_msg);
    } else {
        throw SdkException(error_msg);
    }
}

template<typename T>
T extract_result_or_throw(ResultWrapper&& result) {
    check_result_and_throw(result);
    
    auto* data = result.get_data<T>();
    if (!data) {
        throw SdkException("No data in successful result");
    }
    
    return *data;
}

} // namespace CSdk
} // namespace SolanaAiRegistries
```

## Implementation Steps

### Step 1: Create C SDK Interface Headers

Create the expected C interface headers based on the current C++ API:

```bash
cpp_sdk/
├── include/
│   ├── aireg++/          # C++ headers (existing)
│   └── aireg/            # C interface headers (new)
│       ├── aireg_client.h
│       ├── aireg_agent.h
│       ├── aireg_mcp.h
│       ├── aireg_payments.h
│       └── aireg_idl.h
├── src/
│   ├── c_sdk_wrapper.hpp # C++ wrapper around C API
│   ├── c_sdk_wrapper.cpp # Implementation
│   └── stubs.cpp         # Replace with real implementations
```

### Step 2: Implement Wrapper Classes

Create RAII wrapper classes for each C SDK component:

```cpp
// agent_wrapper.cpp
#include "c_sdk_wrapper.hpp"

namespace SolanaAiRegistries {
namespace CSdk {

class AgentWrapper {
private:
    ClientWrapper& client_;
    
public:
    explicit AgentWrapper(ClientWrapper& client) : client_(client) {}
    
    PublicKey register_agent(const AgentRegistrationParams& params,
                           const std::vector<uint8_t>& owner_keypair) {
        // Convert C++ params to C struct
        aireg_agent_params_t c_params = {};
        c_params.name = params.name.c_str();
        c_params.description = params.description.c_str();
        c_params.version = params.version.c_str();
        c_params.api_endpoint = params.api_endpoint.c_str();
        
        // Convert capabilities to bitfield
        uint8_t capabilities_bitfield[16] = {0};
        for (auto cap : params.capabilities) {
            capabilities_bitfield[static_cast<int>(cap) / 8] |= 
                (1 << (static_cast<int>(cap) % 8));
        }
        memcpy(c_params.capabilities, capabilities_bitfield, 16);
        
        c_params.pricing_model = static_cast<uint8_t>(params.pricing_model);
        c_params.price_per_token = params.price_per_token;
        
        // Call C SDK
        auto result = aireg_agent_register(client_.get(), &c_params, owner_keypair.data());
        ResultWrapper wrapper(result);
        
        check_result_and_throw(wrapper);
        
        // Extract agent ID
        auto* agent_id_bytes = wrapper.get_data<uint8_t>();
        if (!agent_id_bytes || wrapper.get_data_size() != 32) {
            throw RegistryException("Invalid agent ID returned");
        }
        
        return PublicKey(agent_id_bytes);
    }
    
    std::optional<AgentInfo> get_agent(const PublicKey& agent_id) {
        auto result = aireg_agent_get(client_.get(), agent_id.bytes());
        ResultWrapper wrapper(result);
        
        if (!wrapper.is_success()) {
            // If agent not found, return nullopt instead of throwing
            if (wrapper.get_error().find("not found") != std::string::npos) {
                return std::nullopt;
            }
            check_result_and_throw(wrapper);
        }
        
        // Parse C result to C++ structure
        auto* c_agent_info = wrapper.get_data<aireg_agent_info_t>();
        if (!c_agent_info) {
            return std::nullopt;
        }
        
        AgentInfo info;
        info.agent_id = PublicKey(c_agent_info->agent_id);
        info.name = c_agent_info->name ? std::string(c_agent_info->name) : "";
        info.description = c_agent_info->description ? std::string(c_agent_info->description) : "";
        info.version = c_agent_info->version ? std::string(c_agent_info->version) : "";
        info.api_endpoint = c_agent_info->api_endpoint ? std::string(c_agent_info->api_endpoint) : "";
        
        // Convert bitfield back to capabilities vector
        for (int i = 0; i < 128; ++i) { // Max 128 capabilities
            if (c_agent_info->capabilities[i / 8] & (1 << (i % 8))) {
                info.capabilities.push_back(static_cast<AgentCapability>(i));
            }
        }
        
        info.pricing_model = static_cast<PricingModel>(c_agent_info->pricing_model);
        info.price_per_token = c_agent_info->price_per_token;
        info.is_active = c_agent_info->is_active;
        info.owner = PublicKey(c_agent_info->owner);
        
        return info;
    }
};

} // namespace CSdk
} // namespace SolanaAiRegistries
```

### Step 3: Update Implementation Files

Replace the mock implementations in stubs.cpp:

```cpp
// Updated stubs.cpp -> real_implementation.cpp
#include "c_sdk_wrapper.hpp"

class Agent::Impl {
public:
    CSdk::AgentWrapper agent_wrapper;
    
    Impl(Client& client) : agent_wrapper(client.pimpl_->c_client) {}
};

PublicKey Agent::register_agent(const AgentRegistrationParams& params, 
                               const std::vector<uint8_t>& owner_keypair) {
    validate_registration_params(params);
    return pimpl_->agent_wrapper.register_agent(params, owner_keypair);
}

std::optional<AgentInfo> Agent::get_agent(const PublicKey& agent_id) {
    return pimpl_->agent_wrapper.get_agent(agent_id);
}

// Similar updates for other classes...
```

### Step 4: Update CMakeLists.txt

Add the C SDK dependency:

```cmake
# Find the C SDK library
find_library(LIBAIREG_LIBRARY 
    NAMES aireg libaireg
    PATHS 
        ${CMAKE_SOURCE_DIR}/lib
        /usr/local/lib
        /usr/lib
)

if(NOT LIBAIREG_LIBRARY)
    message(FATAL_ERROR "libaireg not found. Please install the C SDK.")
endif()

# Add C include directories
include_directories(${CMAKE_CURRENT_SOURCE_DIR}/include/aireg)

# Link the C SDK
target_link_libraries(aireg++_impl PUBLIC 
    ${LIBAIREG_LIBRARY}
    ${LIBSODIUM_LIBRARIES}
)
```

## Testing and Validation

### Unit Test Updates

Update tests to work with real implementations:

```cpp
// test_integration_real.cpp
class RealImplementationTest : public ::testing::Test {
protected:
    void SetUp() override {
        // Set up real client connection
        ClientConfig config;
        config.cluster = Cluster::Devnet; // Use devnet for testing
        config.timeout = std::chrono::milliseconds(10000);
        
        client_ = std::make_unique<Client>(config);
        
        // Verify connection
        ASSERT_TRUE(client_->is_connected()) << "Failed to connect to devnet";
    }
    
    std::unique_ptr<Client> client_;
};

TEST_F(RealImplementationTest, AgentRegistrationRealNetwork) {
    Agent agent(*client_);
    
    // Use test keypair (never use real funds)
    auto test_keypair = generate_test_keypair();
    
    AgentRegistrationParams params;
    params.name = "Test Agent " + std::to_string(std::time(nullptr));
    params.description = "Test agent for integration testing";
    params.version = "1.0.0";
    params.capabilities = {AgentCapability::TextGeneration};
    params.api_endpoint = "https://test.example.com/api";
    params.pricing_model = PricingModel::Free;
    
    try {
        auto agent_id = agent.register_agent(params, test_keypair);
        EXPECT_FALSE(agent_id.to_base58().empty());
        
        // Verify the agent was registered
        auto agent_info = agent.get_agent(agent_id);
        ASSERT_TRUE(agent_info.has_value());
        EXPECT_EQ(agent_info->name, params.name);
        
    } catch (const SdkException& e) {
        FAIL() << "Agent registration failed: " << e.what();
    }
}
```

### Performance Benchmarks

Create benchmarks to compare mock vs real performance:

```cpp
// benchmark_real_vs_mock.cpp
#include <benchmark/benchmark.h>

static void BM_MockAgentGet(benchmark::State& state) {
    // Test with mock implementation
    for (auto _ : state) {
        // Mock operations
    }
}

static void BM_RealAgentGet(benchmark::State& state) {
    // Test with real C SDK
    for (auto _ : state) {
        // Real operations
    }
}

BENCHMARK(BM_MockAgentGet);
BENCHMARK(BM_RealAgentGet);
```

## Performance Considerations

### Memory Management

Ensure proper cleanup of C SDK resources:

```cpp
// Memory pool for frequent allocations
class CSdkMemoryPool {
private:
    std::vector<std::unique_ptr<uint8_t[]>> buffers_;
    std::mutex mutex_;
    
public:
    uint8_t* allocate(size_t size) {
        std::lock_guard<std::mutex> lock(mutex_);
        auto buffer = std::make_unique<uint8_t[]>(size);
        uint8_t* ptr = buffer.get();
        buffers_.push_back(std::move(buffer));
        return ptr;
    }
    
    void clear() {
        std::lock_guard<std::mutex> lock(mutex_);
        buffers_.clear();
    }
};
```

### Connection Pooling

Implement connection pooling for better performance:

```cpp
class ConnectionPool {
private:
    std::queue<std::unique_ptr<CSdk::ClientWrapper>> available_clients_;
    std::mutex mutex_;
    ClientConfig config_;
    size_t max_connections_;
    
public:
    ConnectionPool(const ClientConfig& config, size_t max_connections = 10)
        : config_(config), max_connections_(max_connections) {}
    
    std::unique_ptr<CSdk::ClientWrapper> get_client() {
        std::lock_guard<std::mutex> lock(mutex_);
        
        if (!available_clients_.empty()) {
            auto client = std::move(available_clients_.front());
            available_clients_.pop();
            return client;
        }
        
        // Create new client if under limit
        return std::make_unique<CSdk::ClientWrapper>(config_);
    }
    
    void return_client(std::unique_ptr<CSdk::ClientWrapper> client) {
        std::lock_guard<std::mutex> lock(mutex_);
        
        if (available_clients_.size() < max_connections_) {
            available_clients_.push(std::move(client));
        }
        // Otherwise, let it be destroyed
    }
};
```

This integration guide provides a comprehensive roadmap for replacing the mock implementations with actual C SDK calls while maintaining the existing C++ API and ensuring proper resource management and performance.