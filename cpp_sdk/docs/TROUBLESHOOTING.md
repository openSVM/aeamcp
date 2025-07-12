# C++ SDK Troubleshooting Guide

This guide covers common issues, edge cases, and debugging techniques for the Solana AI Registries C++ SDK.

## Table of Contents

1. [Installation Issues](#installation-issues)
2. [Compilation Problems](#compilation-problems)
3. [Runtime Errors](#runtime-errors)
4. [Network and RPC Issues](#network-and-rpc-issues)
5. [Transaction Failures](#transaction-failures)
6. [Base58 Encoding Problems](#base58-encoding-problems)
7. [Memory Issues](#memory-issues)
8. [Performance Problems](#performance-problems)
9. [Platform-Specific Issues](#platform-specific-issues)
10. [Debugging Techniques](#debugging-techniques)

## Installation Issues

### Missing Dependencies

**Problem**: CMake cannot find libsodium or Google Test
```
CMake Error: The following required packages were not found:
- libsodium
```

**Solution**:
```bash
# Ubuntu/Debian
sudo apt-get install libsodium-dev libgtest-dev

# macOS
brew install libsodium googletest

# Windows (vcpkg)
vcpkg install libsodium:x64-windows gtest:x64-windows
```

### Version Compatibility

**Problem**: Compiler version incompatibility
```
error: 'std::optional' is not a member of 'std'
```

**Solution**: Ensure C++17 support
```cmake
# In CMakeLists.txt
set(CMAKE_CXX_STANDARD 17)
set(CMAKE_CXX_STANDARD_REQUIRED ON)

# Or compile with
g++ -std=c++17 your_code.cpp
```

## Compilation Problems

### Header Not Found

**Problem**:
```cpp
fatal error: aireg++/aireg++.hpp: No such file or directory
```

**Solution**:
```cmake
# Add include directory
target_include_directories(your_target PRIVATE 
    ${CMAKE_SOURCE_DIR}/cpp_sdk/include
)

# Or set manually
include_directories(${CMAKE_SOURCE_DIR}/cpp_sdk/include)
```

### Linking Errors

**Problem**:
```
undefined reference to `SolanaAiRegistries::initialize()'
```

**Solution**:
```cmake
# Link the implementation library
target_link_libraries(your_target aireg++_impl ${LIBSODIUM_LIBRARIES})
```

### Template Instantiation Errors

**Problem**:
```cpp
error: no matching function for call to 'SolanaAiRegistries::Resource<T>::Resource'
```

**Solution**: Provide explicit deleter
```cpp
// Correct usage
SolanaAiRegistries::Resource<FILE> file_resource(
    fopen("file.txt", "r"),
    [](FILE* f) { if (f) fclose(f); }
);

// Instead of
// auto file_resource = SolanaAiRegistries::Resource<FILE>(fopen("file.txt", "r"), fclose);
```

## Runtime Errors

### SDK Initialization Failures

**Problem**:
```cpp
SolanaAiRegistries::SdkException: Failed to initialize libsodium
```

**Solution**:
```cpp
// Check if already initialized
static bool sdk_initialized = false;
if (!sdk_initialized) {
    SolanaAiRegistries::initialize();
    sdk_initialized = true;
}

// Alternative: Check libsodium availability
#include <sodium.h>
if (sodium_init() < 0) {
    std::cerr << "libsodium initialization failed" << std::endl;
    return 1;
}
```

### Client Connection Issues

**Problem**: Client always reports as disconnected
```cpp
if (!client.is_connected()) {
    // Always enters here
}
```

**Solution**: Check network and RPC endpoint
```cpp
// Test with explicit endpoint
SolanaAiRegistries::ClientConfig config;
config.cluster = SolanaAiRegistries::Cluster::Devnet;

// Try alternative endpoints
config.custom_rpc_url = "https://api.devnet.solana.com";
// or
config.custom_rpc_url = "https://devnet.helius-rpc.com";

SolanaAiRegistries::Client client(config);
```

### Null Pointer Exceptions

**Problem**:
```cpp
SolanaAiRegistries::SdkException: Null pointer provided for public key bytes
```

**Solution**: Always validate pointers
```cpp
std::vector<uint8_t> key_bytes = get_key_bytes();
if (key_bytes.empty() || key_bytes.size() != 32) {
    throw std::invalid_argument("Invalid key bytes");
}

SolanaAiRegistries::PublicKey key(key_bytes.data());
```

## Network and RPC Issues

### Timeout Errors

**Problem**: Operations timeout frequently
```cpp
SolanaAiRegistries::RpcException: Request timed out
```

**Solution**: Adjust timeout and implement retry logic
```cpp
// Increase timeout
config.timeout = std::chrono::milliseconds(15000);

// Implement retry logic
template<typename Func>
auto retry_operation(Func&& func, int max_retries = 3) {
    for (int i = 0; i < max_retries; ++i) {
        try {
            return func();
        } catch (const SolanaAiRegistries::RpcException& e) {
            if (i == max_retries - 1) throw;
            std::this_thread::sleep_for(std::chrono::milliseconds(1000 * (i + 1)));
        }
    }
}
```

### Rate Limiting

**Problem**: RPC requests being rate limited
```cpp
SolanaAiRegistries::RpcException: Too Many Requests
```

**Solution**: Implement backoff and connection pooling
```cpp
class RateLimitedClient {
private:
    std::chrono::steady_clock::time_point last_request_;
    std::chrono::milliseconds min_interval_{100}; // 100ms between requests

public:
    template<typename Func>
    auto rate_limited_call(Func&& func) {
        auto now = std::chrono::steady_clock::now();
        auto elapsed = now - last_request_;
        
        if (elapsed < min_interval_) {
            std::this_thread::sleep_for(min_interval_ - elapsed);
        }
        
        auto result = func();
        last_request_ = std::chrono::steady_clock::now();
        return result;
    }
};
```

### Network Connectivity

**Problem**: Intermittent network failures
```cpp
SolanaAiRegistries::RpcException: Network unreachable
```

**Solution**: Test connectivity and fallback endpoints
```cpp
bool test_connectivity(const std::string& endpoint) {
    try {
        SolanaAiRegistries::ClientConfig test_config;
        test_config.custom_rpc_url = endpoint;
        test_config.timeout = std::chrono::milliseconds(2000);
        
        SolanaAiRegistries::Client test_client(test_config);
        return test_client.is_connected();
    } catch (...) {
        return false;
    }
}

std::vector<std::string> endpoints = {
    "https://api.devnet.solana.com",
    "https://devnet.helius-rpc.com",
    "https://rpc.ankr.com/solana_devnet"
};

for (const auto& endpoint : endpoints) {
    if (test_connectivity(endpoint)) {
        config.custom_rpc_url = endpoint;
        break;
    }
}
```

## Transaction Failures

### Insufficient Balance

**Problem**:
```cpp
SolanaAiRegistries::TransactionException: Insufficient funds
```

**Solution**: Check balance before transactions
```cpp
bool check_sufficient_balance(const SolanaAiRegistries::Client& client,
                             const SolanaAiRegistries::PublicKey& payer,
                             uint64_t required_amount) {
    try {
        auto balance = client.get_balance(payer);
        auto min_rent = client.get_minimum_balance_for_rent_exemption(0);
        
        return balance >= (required_amount + min_rent + 5000); // 5000 lamports for fees
    } catch (const SolanaAiRegistries::RpcException& e) {
        std::cerr << "Failed to check balance: " << e.what() << std::endl;
        return false;
    }
}
```

### Invalid Transaction Format

**Problem**:
```cpp
SolanaAiRegistries::TransactionException: Invalid transaction format
```

**Solution**: Validate transaction structure
```cpp
void validate_transaction_builder(SolanaAiRegistries::TransactionBuilder& builder) {
    // Ensure payer is set
    try {
        auto tx_data = builder.build();
        if (tx_data.empty()) {
            throw std::runtime_error("Transaction data is empty");
        }
        
        // Validate minimum transaction size
        if (tx_data.size() < 64) { // Minimum size for signature + basic message
            throw std::runtime_error("Transaction too small");
        }
    } catch (const SolanaAiRegistries::TransactionException& e) {
        std::cerr << "Transaction validation failed: " << e.what() << std::endl;
        throw;
    }
}
```

### Signature Verification Failures

**Problem**:
```cpp
SolanaAiRegistries::TransactionException: Invalid signature
```

**Solution**: Validate keypair format
```cpp
bool validate_keypair(const std::vector<uint8_t>& keypair) {
    if (keypair.size() != 64) {
        std::cerr << "Keypair must be 64 bytes (32 private + 32 public)" << std::endl;
        return false;
    }
    
    // Verify the public key matches the private key
    std::vector<uint8_t> derived_public(32);
    crypto_sign_ed25519_sk_to_pk(derived_public.data(), keypair.data());
    
    bool matches = std::memcmp(derived_public.data(), keypair.data() + 32, 32) == 0;
    if (!matches) {
        std::cerr << "Public key doesn't match private key" << std::endl;
        return false;
    }
    
    return true;
}
```

## Base58 Encoding Problems

### Invalid Characters

**Problem**:
```cpp
SolanaAiRegistries::SdkException: Invalid base58 character
```

**Solution**: Validate base58 strings
```cpp
bool is_valid_base58(const std::string& str) {
    const std::string base58_alphabet = "123456789ABCDEFGHJKLMNPQRSTUVWXYZabcdefghijkmnopqrstuvwxyz";
    
    for (char c : str) {
        if (base58_alphabet.find(c) == std::string::npos) {
            return false;
        }
    }
    return true;
}

// Usage
std::string public_key_str = "...";
if (!is_valid_base58(public_key_str)) {
    std::cerr << "Invalid base58 string: " << public_key_str << std::endl;
    return;
}

SolanaAiRegistries::PublicKey key(public_key_str);
```

### Length Validation Issues

**Problem**:
```cpp
SolanaAiRegistries::SdkException: Invalid base58 public key: decoded to X bytes, expected 32
```

**Solution**: Handle variable-length base58 encoding
```cpp
class SafePublicKey {
public:
    static std::optional<SolanaAiRegistries::PublicKey> from_base58(const std::string& str) {
        try {
            // Basic validation
            if (str.empty() || str.length() > 50) { // Reasonable upper bound
                return std::nullopt;
            }
            
            // Check for valid characters
            if (!is_valid_base58(str)) {
                return std::nullopt;
            }
            
            return SolanaAiRegistries::PublicKey(str);
        } catch (const SolanaAiRegistries::SdkException&) {
            return std::nullopt;
        }
    }
};

// Usage
auto maybe_key = SafePublicKey::from_base58(user_input);
if (!maybe_key) {
    std::cerr << "Invalid public key format" << std::endl;
    return;
}
```

### Round-trip Encoding Issues

**Problem**: Base58 round-trip produces different results
```cpp
// Original != decoded_key.to_base58()
```

**Solution**: Use canonical encoding
```cpp
void test_base58_roundtrip(const std::vector<uint8_t>& original_bytes) {
    SolanaAiRegistries::PublicKey key1(original_bytes.data());
    std::string base58_str = key1.to_base58();
    
    SolanaAiRegistries::PublicKey key2(base58_str);
    
    // Compare bytes, not base58 strings
    assert(key1 == key2);
    
    // If you need string comparison, normalize first
    std::string canonical_str = key2.to_base58();
    // canonical_str should equal base58_str
}
```

## Memory Issues

### Memory Leaks

**Problem**: Valgrind reports memory leaks
```
definitely lost: 1,024 bytes in 32 blocks
```

**Solution**: Use RAII and smart pointers
```cpp
// Instead of raw pointers
FILE* file = fopen("data.txt", "r");
// ... use file ...
fclose(file); // Easy to forget

// Use RAII wrapper
{
    SolanaAiRegistries::Resource<FILE> file_resource(
        fopen("data.txt", "r"),
        [](FILE* f) { if (f) fclose(f); }
    );
    
    if (file_resource.is_valid()) {
        // Use file_resource.get()
    }
} // Automatic cleanup
```

### Buffer Overflows

**Problem**: AddressSanitizer detects buffer overflow
```
AddressSanitizer: heap-buffer-overflow
```

**Solution**: Validate buffer sizes
```cpp
void safe_copy_key_bytes(const std::vector<uint8_t>& source, 
                        std::vector<uint8_t>& dest) {
    if (source.size() != 32) {
        throw std::invalid_argument("Source must be 32 bytes");
    }
    
    dest.resize(32);
    std::memcpy(dest.data(), source.data(), 32);
}
```

### Use After Free

**Problem**: Using objects after they've been destroyed
```cpp
SolanaAiRegistries::Client* client = new SolanaAiRegistries::Client(config);
SolanaAiRegistries::Agent agent(*client);
delete client; // Oops!
agent.get_agent(id); // Use after free
```

**Solution**: Proper lifetime management
```cpp
// Use automatic storage
{
    SolanaAiRegistries::Client client(config);
    SolanaAiRegistries::Agent agent(client);
    // ... use agent ...
} // client and agent destroyed together

// Or use smart pointers with proper ordering
auto client = std::make_unique<SolanaAiRegistries::Client>(config);
auto agent = std::make_unique<SolanaAiRegistries::Agent>(*client);
// agent destroyed before client due to declaration order
```

## Performance Problems

### Slow Base58 Operations

**Problem**: Base58 encoding/decoding is too slow
```cpp
// Taking too long for large numbers of operations
```

**Solution**: Cache and batch operations
```cpp
class Base58Cache {
private:
    std::unordered_map<std::string, SolanaAiRegistries::PublicKey> cache_;
    mutable std::mutex mutex_;
    
public:
    SolanaAiRegistries::PublicKey get_or_create(const std::string& base58_str) {
        std::lock_guard<std::mutex> lock(mutex_);
        
        auto it = cache_.find(base58_str);
        if (it != cache_.end()) {
            return it->second;
        }
        
        SolanaAiRegistries::PublicKey key(base58_str);
        cache_[base58_str] = key;
        return key;
    }
};
```

### High Memory Usage

**Problem**: Memory usage grows over time
```cpp
// Memory usage keeps increasing
```

**Solution**: Implement periodic cleanup
```cpp
class ResourceManager {
private:
    std::vector<std::unique_ptr<SolanaAiRegistries::Client>> clients_;
    std::chrono::steady_clock::time_point last_cleanup_;
    
public:
    void periodic_cleanup() {
        auto now = std::chrono::steady_clock::now();
        if (now - last_cleanup_ > std::chrono::minutes(5)) {
            // Remove unused clients
            clients_.erase(
                std::remove_if(clients_.begin(), clients_.end(),
                    [](const auto& client) { return !client->is_connected(); }),
                clients_.end()
            );
            last_cleanup_ = now;
        }
    }
};
```

## Platform-Specific Issues

### Windows Compilation

**Problem**: Windows-specific compilation errors
```cpp
error C2039: 'sleep_for' is not a member of 'std::this_thread'
```

**Solution**: Include proper headers and handle Windows differences
```cpp
#ifdef _WIN32
    #include <windows.h>
    #define sleep_ms(ms) Sleep(ms)
#else
    #include <unistd.h>
    #define sleep_ms(ms) usleep((ms) * 1000)
#endif

// Use cross-platform sleep
void cross_platform_sleep(int milliseconds) {
    std::this_thread::sleep_for(std::chrono::milliseconds(milliseconds));
}
```

### macOS Silicon Issues

**Problem**: Library compatibility on Apple Silicon
```cpp
ld: library not found for -lsodium
```

**Solution**: Use proper architecture flags
```bash
# Install for correct architecture
arch -arm64 brew install libsodium

# Or build universal binary
cmake -DCMAKE_OSX_ARCHITECTURES="arm64;x86_64" ..
```

### Linux Distribution Differences

**Problem**: Different package names across distributions
```bash
# Ubuntu/Debian
sudo apt-get install libsodium-dev

# CentOS/RHEL
sudo yum install libsodium-devel

# Fedora
sudo dnf install libsodium-devel

# Arch
sudo pacman -S libsodium
```

## Debugging Techniques

### Enable Debug Logging

```cpp
// Compile-time debug flags
#ifdef DEBUG
    #define SDK_LOG(level, msg) \
        std::cerr << "[" << level << "] " << __FILE__ << ":" << __LINE__ \
                  << " " << msg << std::endl
#else
    #define SDK_LOG(level, msg) ((void)0)
#endif

// Usage in SDK operations
void debug_agent_registration() {
    SDK_LOG("INFO", "Starting agent registration");
    
    try {
        auto agent_id = agent.register_agent(params, keypair);
        SDK_LOG("SUCCESS", "Agent registered: " + agent_id.to_base58());
    } catch (const SolanaAiRegistries::SdkException& e) {
        SDK_LOG("ERROR", "Registration failed: " + std::string(e.what()));
        throw;
    }
}
```

### Memory Debugging

```bash
# Compile with debug symbols and sanitizers
mkdir debug_build && cd debug_build
cmake .. -DCMAKE_BUILD_TYPE=Debug -DENABLE_SANITIZERS=ON
make

# Run with Valgrind
valgrind --leak-check=full --show-leak-kinds=all ./your_program

# Run with AddressSanitizer
export ASAN_OPTIONS=abort_on_error=1:check_initialization_order=1
./your_program
```

### Network Debugging

```cpp
// Log all RPC calls
class DebugClient : public SolanaAiRegistries::Client {
public:
    DebugClient(const SolanaAiRegistries::ClientConfig& config) 
        : SolanaAiRegistries::Client(config) {}
    
    std::optional<SolanaAiRegistries::AccountInfo> get_account_info(
        const SolanaAiRegistries::PublicKey& public_key) override {
        
        std::cerr << "RPC Call: get_account_info(" << public_key.to_base58() << ")" << std::endl;
        
        auto start = std::chrono::steady_clock::now();
        auto result = SolanaAiRegistries::Client::get_account_info(public_key);
        auto end = std::chrono::steady_clock::now();
        
        auto duration = std::chrono::duration_cast<std::chrono::milliseconds>(end - start);
        std::cerr << "RPC Response: " << (result ? "success" : "null") 
                  << " (took " << duration.count() << "ms)" << std::endl;
        
        return result;
    }
};
```

### State Inspection

```cpp
// Dump internal state for debugging
void dump_client_state(const SolanaAiRegistries::Client& client) {
    std::cerr << "=== Client State ===" << std::endl;
    std::cerr << "RPC URL: " << client.get_rpc_url() << std::endl;
    std::cerr << "Connected: " << (client.is_connected() ? "yes" : "no") << std::endl;
    
    try {
        auto blockhash = client.get_latest_blockhash();
        std::cerr << "Latest blockhash: " << blockhash << std::endl;
    } catch (const SolanaAiRegistries::RpcException& e) {
        std::cerr << "Failed to get blockhash: " << e.what() << std::endl;
    }
    std::cerr << "===================" << std::endl;
}
```

This troubleshooting guide should help developers identify and resolve common issues when working with the C++ SDK.