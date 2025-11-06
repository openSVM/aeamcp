# C SDK Implementation Guidelines for Solana AI Registries

This document provides comprehensive implementation guidelines for the C SDK (`libaireg`) for Solana AI Registries. All contributors must follow these guidelines to ensure consistent, memory-safe, and maintainable code.

## Table of Contents

1. [Overview](#overview)
2. [Atomic Implementation Tasks](#atomic-implementation-tasks)
3. [Memory-Safe Design Strategies](#memory-safe-design-strategies)
4. [Struct Generation and Validation](#struct-generation-and-validation)
5. [Test Framework and CI/CD Requirements](#test-framework-and-cicd-requirements)
6. [Code Style and Review Guidelines](#code-style-and-review-guidelines)
7. [Reference Documentation](#reference-documentation)

## Overview

The C SDK (`libaireg`) provides a memory-safe, high-performance interface for interacting with Solana AI Registries. The SDK follows strict C99/C11 standards and implements comprehensive error handling with zero-tolerance for memory leaks.

**Key Requirements:**
- All public API calls must succeed against Solana devnet
- Memory-safe implementation with zero memory leaks (validated by Valgrind)
- Comprehensive error handling using standard C error codes
- Full API documentation using Doxygen
- >90% test coverage
- Integration tests that are reproducible

**Reference:** [C SDK Atomic Execution Plan](./sdk_refs/c_sdk_references.md)

## Atomic Implementation Tasks

The C SDK implementation is broken down into the following atomic tasks, each with specific deliverables and acceptance criteria:

### Task 5.1: Core RPC and Transaction Builder (`solana_ai_registries.h` + `client.c`)

**Deliverables:**
- `include/solana_ai_registries.h` - Main header with 62 exported functions
- `src/client.c` - RPC client and transaction builder implementation
- Unit tests for all public functions

**Implementation Requirements:**
- **Devnet Compatibility:** All public API calls must work against live Solana devnet
- **Memory Safety:** Zero memory leaks detected by Valgrind
- **Error Handling:** Standard C error codes (`AI_ERR_*`) with clear messages
- **Documentation:** Comprehensive Doxygen comments for all public functions

**Acceptance Criteria:**
- Integration tests pass against Solana devnet
- Valgrind reports zero memory errors
- All functions return appropriate `AI_ERR_*` codes
- Doxygen generates complete API documentation

**Reference:** [C SDK References - Section 5.1](./sdk_refs/c_sdk_references.md#51-implement-solana_ai_registriesh--clientc-rpc--tx-builder)

### Task 5.2: High-Level Operations (`agent.h` / `mcp.h`)

**Deliverables:**
- `include/agent.h` - Agent registry CRUD operations
- `include/mcp.h` - MCP server registry CRUD operations
- `src/agent.c` - Agent operations implementation
- `src/mcp.c` - MCP operations implementation

**Implementation Requirements:**
- **CRUD Operations:** Complete create, read, update, delete functionality
- **Unit Testing:** Success and failure tests for each function
- **Memory Safety:** Proper allocation and deallocation
- **API Documentation:** Doxygen comments for all public interfaces

**Supported Operations:**
- Agent: register, update details, update status, deregister
- MCP Server: register, update details, update status, deregister

**Reference:** [Implementation Summary - Instructions](./IMPLEMENTATION_SUMMARY.md#instructions-implemented), [Agent Registry Instructions](../programs/agent-registry/src/instruction.rs)

### Task 5.3: Payment Flows (`payments.h`)

**Deliverables:**
- `include/payments.h` - Payment flow interfaces
- `src/payments.c` - Payment implementation
- Unit tests for all payment scenarios

**Implementation Requirements:**
- **Payment Types:** Prepay, pay-as-you-go, and stream payments (stream planned Q3)
- **Edge Case Handling:** Insufficient balance, invalid mint, unauthorized payer
- **Unit Testing:** Success and failure scenarios for each flow
- **Memory Safety:** No memory leaks in payment operations

**Payment Matrix:**
| Flow Type | Status | Notes |
|-----------|--------|-------|
| Pre-pay | ✓ Required | `payments::prepay` |
| Pay-as-you-go | ✓ Required | `payments::pyg` |
| Stream (Lights.so) | ✗ Planned Q3 | Future enhancement |

**Reference:** [SDK Roadmap - Payment Flows](./SDK_ROADMAP_DETAILED.md#7-payment-flow-support-matrix), [SVMAI Token](../programs/svmai-token/src/lib.rs)

### Task 5.4: IDL Struct Generation (`idl.h`)

**Deliverables:**
- `include/idl.h` - Generated C structures from Anchor IDL
- Code generation tooling for IDL-to-C conversion
- Documentation on struct usage

**Implementation Requirements:**
- **IDL Loading:** Compile-time conversion of Anchor IDL to C structures
- **Struct Mapping:** Exact correspondence between IDL and C structures
- **Code Generation:** Automated tooling for IDL updates
- **Usage Documentation:** Clear examples of struct usage

**IDL Sources:**
- `idl/agent_registry.json` - Agent registry structures
- `idl/mcp_server_registry.json` - MCP server structures

**Reference:** [IDL Documentation](../idl/README.md), [Anchor IDL Format](https://www.anchor-lang.com/docs/idl)

### Task 5.5: Integration Testing (`make test-integration`)

**Deliverables:**
- Complete integration test suite
- Makefile targets for test execution
- Coverage reporting setup

**Requirements:**
- **Test Coverage:** >90% using gcov
- **Memory Testing:** Zero Valgrind errors
- **Reproducibility:** Consistent results across multiple runs
- **Devnet Testing:** All tests pass against live Solana devnet

**Reference:** [C SDK References - Section 5.5](./sdk_refs/c_sdk_references.md#55-write-integration-test-make-test-integration)

## Memory-Safe Design Strategies

Memory safety is critical for the C SDK. All code must follow these mandatory strategies:

### 1. RAII-Style Resource Management

```c
// Example: Safe string allocation and cleanup
typedef struct {
    char* data;
    size_t length;
    size_t capacity;
} ai_string_t;

ai_result_t ai_string_create(ai_string_t** str, const char* initial_value) {
    if (!str) return AI_ERR_NULL_POINTER;
    
    *str = malloc(sizeof(ai_string_t));
    if (!*str) return AI_ERR_OUT_OF_MEMORY;
    
    // Initialize with proper error handling
    (*str)->capacity = strlen(initial_value) + 1;
    (*str)->data = malloc((*str)->capacity);
    if (!(*str)->data) {
        free(*str);
        *str = NULL;
        return AI_ERR_OUT_OF_MEMORY;
    }
    
    strcpy((*str)->data, initial_value);
    (*str)->length = strlen(initial_value);
    return AI_SUCCESS;
}

void ai_string_destroy(ai_string_t* str) {
    if (str) {
        free(str->data);
        free(str);
    }
}
```

### 2. Mandatory Error Checking

All allocations and operations must be checked:

```c
// Bad - no error checking
char* buffer = malloc(size);
strcpy(buffer, source);

// Good - comprehensive error checking  
char* buffer = malloc(size);
if (!buffer) return AI_ERR_OUT_OF_MEMORY;

if (strlen(source) >= size) {
    free(buffer);
    return AI_ERR_BUFFER_TOO_SMALL;
}

strcpy(buffer, source);
```

### 3. Valgrind Integration

All code must pass Valgrind analysis:

```bash
# Required Valgrind command for testing
valgrind --leak-check=full --error-exitcode=1 ./test_suite
```

**Valgrind Requirements:**
- Zero memory leaks
- Zero invalid memory accesses
- Zero uninitialized memory reads

**Reference:** [Valgrind Manual](https://valgrind.org/docs/manual/manual.html)

### 4. Safe String Handling

Use safe string functions and length checking:

```c
// Use strncpy, snprintf, and proper bounds checking
ai_result_t safe_string_copy(char* dest, size_t dest_size, const char* src) {
    if (!dest || !src || dest_size == 0) return AI_ERR_INVALID_PARAMETER;
    
    size_t src_len = strlen(src);
    if (src_len >= dest_size) return AI_ERR_BUFFER_TOO_SMALL;
    
    strncpy(dest, src, dest_size - 1);
    dest[dest_size - 1] = '\0';
    return AI_SUCCESS;
}
```

## Struct Generation and Validation

### IDL-to-C Structure Generation

The SDK uses automated code generation to convert Anchor IDL files to C structures:

#### Generation Process

1. **Parse IDL:** Load JSON IDL files using a C JSON parser
2. **Map Types:** Convert Anchor types to C equivalents
3. **Generate Headers:** Create C structure definitions
4. **Validation:** Ensure struct layouts match IDL exactly

#### Type Mapping Table

| Anchor IDL Type | C Type | Notes |
|-----------------|--------|-------|
| `string` | `char*` | NULL-terminated, length validated |
| `u8` | `uint8_t` | Standard integer types |
| `u16` | `uint16_t` | Standard integer types |
| `u32` | `uint32_t` | Standard integer types |
| `u64` | `uint64_t` | Standard integer types |
| `i64` | `int64_t` | For timestamps |
| `bool` | `bool` | C99 stdbool.h |
| `Vec<T>` | `struct { T* items; size_t count; }` | Dynamic arrays |
| `Option<T>` | `struct { T value; bool has_value; }` | Optional fields |
| `[u8; 32]` | `uint8_t[32]` | Fixed-size arrays |

#### Example Generated Structure

```c
// Generated from agent_registry.json IDL
typedef struct {
    char* agent_id;                    // string
    char* name;                        // string  
    char* description;                 // string
    char* agent_version;               // string
    struct {                           // Option<string>
        char* value;
        bool has_value;
    } provider_name;
    uint64_t capabilities_flags;       // u64
    int64_t created_at;               // i64 timestamp
    uint8_t status;                   // u8 enum
    uint8_t version_hash[32];         // [u8; 32]
} ai_agent_registry_entry_t;
```

### Structure Validation

All generated structures must include validation functions:

```c
ai_result_t ai_agent_validate(const ai_agent_registry_entry_t* agent) {
    if (!agent) return AI_ERR_NULL_POINTER;
    
    // Validate required fields
    if (!agent->agent_id || strlen(agent->agent_id) == 0) {
        return AI_ERR_INVALID_AGENT_ID;
    }
    
    if (strlen(agent->agent_id) > MAX_AGENT_ID_LENGTH) {
        return AI_ERR_AGENT_ID_TOO_LONG;
    }
    
    // Validate status enum
    if (agent->status > AI_AGENT_STATUS_MAX) {
        return AI_ERR_INVALID_STATUS;
    }
    
    return AI_SUCCESS;
}
```

**Reference:** [Common Error Types](../programs/common/src/error.rs)

## Test Framework and CI/CD Requirements

### Test Framework Setup

The C SDK uses the Unity Test Framework for unit testing:

#### Unity Test Integration

```c
// Example test structure
#include "unity.h"
#include "solana_ai_registries.h"

void setUp(void) {
    // Initialize test environment
    ai_client_init();
}

void tearDown(void) {
    // Cleanup after each test
    ai_client_cleanup();
}

void test_agent_register_success(void) {
    ai_agent_registry_entry_t agent = {0};
    agent.agent_id = "test-agent-001";
    agent.name = "Test Agent";
    
    ai_result_t result = ai_agent_register(&agent);
    TEST_ASSERT_EQUAL(AI_SUCCESS, result);
}

void test_agent_register_invalid_id(void) {
    ai_agent_registry_entry_t agent = {0};
    agent.agent_id = ""; // Invalid empty ID
    
    ai_result_t result = ai_agent_register(&agent);
    TEST_ASSERT_EQUAL(AI_ERR_INVALID_AGENT_ID, result);
}

int main(void) {
    UNITY_BEGIN();
    RUN_TEST(test_agent_register_success);
    RUN_TEST(test_agent_register_invalid_id);
    return UNITY_END();
}
```

**Reference:** [Unity Test Framework](http://www.throwtheswitch.org/unity)

### Coverage Requirements

Code coverage must exceed 90% using gcov:

```bash
# Build with coverage flags
gcc -fprofile-arcs -ftest-coverage -o test_suite src/*.c tests/*.c

# Run tests
./test_suite

# Generate coverage report
gcov src/*.c
gcov tests/*.c

# Coverage must be >90%
```

**Reference:** [gcov Documentation](https://gcc.gnu.org/onlinedocs/gcc/Gcov.html)

### Integration Testing

Integration tests must run against live Solana devnet:

```c
// Integration test example
void test_devnet_integration(void) {
    ai_client_t* client = NULL;
    ai_result_t result;
    
    // Connect to devnet
    result = ai_client_create(&client, AI_NETWORK_DEVNET);
    TEST_ASSERT_EQUAL(AI_SUCCESS, result);
    
    // Test agent registration on devnet
    ai_agent_registry_entry_t agent = create_test_agent();
    result = ai_agent_register_devnet(client, &agent);
    TEST_ASSERT_EQUAL(AI_SUCCESS, result);
    
    ai_client_destroy(client);
}
```

### CI/CD Pipeline Requirements

The C SDK requires automated CI/CD with the following specifications:

#### GitHub Actions Workflow (`.github/workflows/c-release.yml`)

**Required Features:**
- Multi-platform builds (Linux, macOS, Windows)
- Automated testing with memory leak detection
- Release creation with compiled binaries
- Test-first policy (no release without passing tests)

**Workflow Structure:**
```yaml
name: C SDK Release
on:
  push:
    tags: ['c-v*']

jobs:
  test:
    strategy:
      matrix:
        os: [ubuntu-latest, macos-latest, windows-latest]
    steps:
      - name: Build and Test
        run: |
          cmake -B build
          cmake --build build
          make test-integration
          
      - name: Memory Leak Check (Linux only)
        if: matrix.os == 'ubuntu-latest'
        run: |
          valgrind --leak-check=full --error-exitcode=1 ./build/test_suite
          
  release:
    needs: test
    steps:
      - name: Create Release
        uses: actions/create-release@v1
        with:
          tag_name: ${{ github.ref }}
          release_name: C SDK ${{ github.ref }}
```

**Reference:** [CI/CD References - C Release](./sdk_refs/cicd_references.md#75-create-githubworkflowsc-releaseyml-for-github-releases)

## Code Style and Review Guidelines

### Coding Standards

The C SDK follows strict C99/C11 coding standards:

#### Naming Conventions

```c
// Public API: ai_module_function
ai_result_t ai_agent_register(const ai_agent_registry_entry_t* agent);

// Private functions: static with module prefix
static ai_result_t agent_validate_inputs(const ai_agent_registry_entry_t* agent);

// Constants: ALL_CAPS with module prefix
#define AI_MAX_AGENT_ID_LENGTH 64
#define AI_ERR_INVALID_AGENT_ID 1001

// Types: module_type_t suffix
typedef struct ai_client ai_client_t;
typedef enum ai_result ai_result_t;
```

#### Error Handling Standards

All functions must return `ai_result_t` and use standard error codes:

```c
typedef enum {
    AI_SUCCESS = 0,
    AI_ERR_NULL_POINTER = 1000,
    AI_ERR_OUT_OF_MEMORY = 1001,
    AI_ERR_INVALID_PARAMETER = 1002,
    AI_ERR_INVALID_AGENT_ID = 2000,
    AI_ERR_AGENT_NOT_FOUND = 2001,
    // ... additional error codes
} ai_result_t;
```

**Reference:** [C Error Handling Best Practices](https://wiki.sei.cmu.edu/confluence/display/c/ERR00-C.+Adopt+and+implement+a+consistent+and+comprehensive+error-handling+policy)

#### Documentation Requirements

All public functions require comprehensive Doxygen documentation:

```c
/**
 * @brief Register a new agent in the Solana AI Registry
 * 
 * This function creates a new agent entry in the on-chain registry with the
 * provided details. The agent will be assigned a unique on-chain address
 * and can be queried using the registry RPC methods.
 * 
 * @param[in] client Initialized AI registry client
 * @param[in] agent Pointer to agent data structure (must not be NULL)
 * @param[out] registry_address Optional pointer to receive the assigned address
 * 
 * @returns AI_SUCCESS on successful registration
 * @returns AI_ERR_NULL_POINTER if client or agent is NULL
 * @returns AI_ERR_INVALID_AGENT_ID if agent ID is invalid
 * @returns AI_ERR_AGENT_ALREADY_EXISTS if agent ID is already registered
 * 
 * @note The agent structure must be fully validated before calling this function
 * @see ai_agent_validate() for validation requirements
 * 
 * @example
 * ```c
 * ai_agent_registry_entry_t agent = {0};
 * agent.agent_id = "my-agent-001";
 * agent.name = "My Test Agent";
 * 
 * ai_result_t result = ai_agent_register(client, &agent, NULL);
 * if (result != AI_SUCCESS) {
 *     fprintf(stderr, "Registration failed: %d\n", result);
 * }
 * ```
 */
ai_result_t ai_agent_register(
    ai_client_t* client,
    const ai_agent_registry_entry_t* agent,
    char* registry_address
);
```

**Reference:** [Doxygen Documentation](https://www.doxygen.nl/manual/docblocks.html)

### Code Review Checklist

All code must pass the following review criteria:

#### Memory Safety Review
- [ ] All malloc/calloc calls are checked for NULL return
- [ ] Every allocated pointer has a corresponding free()
- [ ] No double-free or use-after-free issues
- [ ] Buffer overrun protection in place
- [ ] Valgrind clean (zero leaks, zero errors)

#### Error Handling Review
- [ ] All functions return ai_result_t
- [ ] NULL pointer checks for all input parameters
- [ ] Proper error propagation through call stack
- [ ] Error messages are clear and actionable
- [ ] Edge cases are handled appropriately

#### API Design Review
- [ ] Function signatures follow naming conventions
- [ ] Const correctness for read-only parameters
- [ ] Proper input validation
- [ ] Thread safety considerations documented
- [ ] API is intuitive and consistent

#### Testing Review
- [ ] Unit tests cover success and failure paths
- [ ] Integration tests validate against devnet
- [ ] Memory leak tests pass
- [ ] Code coverage >90%
- [ ] Tests are reproducible

#### Documentation Review
- [ ] Doxygen comments for all public functions
- [ ] Parameter documentation is complete
- [ ] Return value documentation is clear
- [ ] Usage examples provided
- [ ] Error conditions documented

## Reference Documentation

This section provides links to all related documentation and external resources:

### Internal Documentation
- [C SDK Atomic Execution Plan](./sdk_refs/c_sdk_references.md) - Detailed requirements and references
- [SDK Master Plan](./SDK_ROADMAP_DETAILED.md) - Overall SDK architecture and roadmap
- [Implementation Summary](./IMPLEMENTATION_SUMMARY.md) - Current implementation status
- [CI/CD References](./sdk_refs/cicd_references.md) - Continuous integration requirements
- [IDL Documentation](../idl/README.md) - Interface definition language files
- [Error Types](../programs/common/src/error.rs) - Common error definitions

### External References
- [libsodium Crypto Library](https://doc.libsodium.org/) - Cryptographic functions
- [Valgrind Manual](https://valgrind.org/docs/manual/manual.html) - Memory debugging
- [Unity Test Framework](http://www.throwtheswitch.org/unity) - C unit testing
- [Doxygen Documentation](https://www.doxygen.nl/manual/docblocks.html) - API documentation
- [gcov Documentation](https://gcc.gnu.org/onlinedocs/gcc/Gcov.html) - Code coverage
- [Anchor IDL Format](https://www.anchor-lang.com/docs/idl) - IDL specifications

### Solana Development Resources
- [Solana Documentation](https://docs.solana.com/) - Solana blockchain documentation
- [Solana C SDK](https://github.com/solana-labs/solana-c-sdk) - Official C SDK reference
- [Solana Web3.js](https://solana-labs.github.io/solana-web3.js/) - JavaScript SDK for reference

### C Programming Standards
- [C Error Handling Best Practices](https://wiki.sei.cmu.edu/confluence/display/c/ERR00-C.+Adopt+and+implement+a+consistent+and+comprehensive+error-handling+policy)
- [C Testing Best Practices](https://stackoverflow.com/questions/65820/unit-testing-c-code)
- [GitHub Actions Syntax](https://docs.github.com/en/actions/using-workflows/workflow-syntax-for-github-actions)
- [GitHub Actions Matrix Builds](https://docs.github.com/en/actions/using-jobs/using-a-matrix-for-your-jobs)

---

## Conclusion

These implementation guidelines ensure that the C SDK for Solana AI Registries meets the highest standards for memory safety, performance, and maintainability. All contributors must adhere to these guidelines to maintain code quality and consistency.

For questions or clarifications, please refer to the atomic execution plan in [`docs/sdk_refs/c_sdk_references.md`](./sdk_refs/c_sdk_references.md) or create an issue in the repository.