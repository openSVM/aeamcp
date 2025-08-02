# Go SDK Implementation Guidelines for Solana AI Registries

## Overview

This document provides comprehensive implementation guidelines for the Go SDK (`github.com/svmai/registries`) for Solana AI Registries. The SDK provides Go developers with a complete toolkit for interacting with on-chain AI agent and MCP server registries, including payment flows and IDL-based type safety.

## 1. Project Structure and Setup

### 1.1 Module Layout

```
github.com/svmai/registries/
├── go.mod                          # Module definition
├── go.sum                          # Dependency checksums
├── README.md                       # Project documentation
├── LICENSE                         # MIT License
├── .github/
│   └── workflows/
│       └── go.yml                  # CI/CD pipeline
├── client/                         # RPC + Transaction builder
│   ├── client.go                   # Main RPC client wrapper
│   ├── client_test.go              # Unit tests
│   └── transaction_builder.go      # Transaction construction
├── agent/                          # Agent registry high-level operations
│   ├── agent.go                    # Agent CRUD operations
│   ├── agent_test.go               # Unit tests
│   └── types.go                    # Agent-specific types
├── mcp/                            # MCP server registry operations
│   ├── mcp.go                      # MCP CRUD operations
│   ├── mcp_test.go                 # Unit tests
│   └── types.go                    # MCP-specific types
├── payments/                       # Payment flow implementations
│   ├── prepay.go                   # Prepaid payment flow
│   ├── pyg.go                      # Pay-as-you-go flow
│   ├── stream.go                   # Stream payment flow
│   ├── payments_test.go            # Unit tests
│   └── types.go                    # Payment-specific types
├── idl/                            # IDL definitions and embedded structs
│   ├── idl.go                      # IDL loading and parsing
│   ├── idl_test.go                 # Unit tests
│   ├── agent_registry.json         # Embedded agent registry IDL
│   ├── mcp_server_registry.json    # Embedded MCP server registry IDL
│   └── types.go                    # Generated IDL types
├── errors/                         # Error handling
│   ├── errors.go                   # Error definitions
│   └── errors_test.go              # Unit tests
├── examples/                       # Usage examples
│   ├── basic_agent_registration.go
│   ├── mcp_server_setup.go
│   └── payment_flows.go
├── internal/                       # Internal utilities
│   ├── utils.go                    # Utility functions
│   └── constants.go                # Internal constants
└── tests/                          # Integration tests
    ├── integration_test.go         # Main integration test
    ├── devnet_test.go              # Devnet-specific tests
    └── testdata/                   # Test fixtures
```

### 1.2 Dependencies

**Core Dependencies:**
- `github.com/gagliardetto/solana-go` - Solana RPC client and utilities
- `github.com/gagliardetto/binary` - Binary serialization
- `github.com/mr-tron/base58` - Base58 encoding/decoding

**Development Dependencies:**
- `github.com/stretchr/testify` - Testing framework
- `github.com/golang/mock` - Mock generation for testing

## 2. Atomic Implementation Tasks

### 2.1 Implement `client` Package (RPC + Transaction Builder)

**File:** `client/client.go`

**Acceptance Criteria:**
- **All public API calls succeed against devnet:** Integration tests must demonstrate that all public API calls work against a live Solana devnet
- **Handles errors:** Error handling must be robust, with clear error messages and proper Go error patterns
- **API documented:** All public functions and types must have GoDoc comments

**Reference:** [`docs/SDK_ROADMAP_DETAILED.md`](SDK_ROADMAP_DETAILED.md:81-82), [solana-go docs](https://pkg.go.dev/github.com/gagliardetto/solana-go)

**Implementation Requirements:**
```go
// Client represents a connection to Solana RPC with AI Registry utilities
type Client struct {
    rpc    *rpc.Client
    config *Config
}

// Config holds client configuration
type Config struct {
    RPCEndpoint string
    Commitment  rpc.CommitmentType
    Timeout     time.Duration
}

// NewClient creates a new registry client
func NewClient(config *Config) (*Client, error) {
    // Implementation with error handling
}

// GetAccount retrieves account information with proper error handling
func (c *Client) GetAccount(ctx context.Context, pubkey solana.PublicKey) (*rpc.Account, error) {
    // Implementation with timeout and error handling
}
```

### 2.2 Implement `agent` Package (High-Level Operations)

**File:** `agent/agent.go`

**Acceptance Criteria:**
- **All CRUD ops implemented:** Functions for create, read, update, and delete registry entries must be present and callable
- **Unit tests for each:** Each function must have at least one unit test for both success and failure paths
- **API documented:** All public functions and types must have GoDoc comments

**Reference:** [`docs/IMPLEMENTATION_SUMMARY.md`](IMPLEMENTATION_SUMMARY.md:153-162), [`programs/agent-registry/src/instruction.rs`](../programs/agent-registry/src/instruction.rs)

**Implementation Requirements:**
```go
// Card represents an AI agent registry entry
type Card struct {
    ID          string
    Name        string
    Description string
    Version     string
    Provider    Provider
    // ... other fields from IDL
}

// Register creates a new agent registry entry
func Register(ctx context.Context, client *client.Client, signer solana.PrivateKey, card Card) (*solana.Signature, error) {
    // Implementation with transaction building and error handling
}

// Update modifies an existing agent registry entry
func Update(ctx context.Context, client *client.Client, signer solana.PrivateKey, card Card) (*solana.Signature, error) {
    // Implementation with proper authorization checks
}

// Delete removes an agent registry entry
func Delete(ctx context.Context, client *client.Client, signer solana.PrivateKey, agentID string) (*solana.Signature, error) {
    // Implementation with proper authorization checks
}

// Get retrieves an agent registry entry
func Get(ctx context.Context, client *client.Client, agentID string) (*Card, error) {
    // Implementation with account deserialization
}
```

### 2.3 Implement `mcp` Package (MCP Server Operations)

**File:** `mcp/mcp.go`

**Acceptance Criteria:**
- **All CRUD ops implemented:** Functions for create, read, update, and delete MCP server entries must be present and callable
- **Unit tests for each:** Each function must have at least one unit test for both success and failure paths
- **API documented:** All public functions and types must have GoDoc comments

**Reference:** [`docs/SDK_ROADMAP_DETAILED.md`](SDK_ROADMAP_DETAILED.md:83-84)

**Implementation Requirements:**
```go
// ServerCard represents an MCP server registry entry
type ServerCard struct {
    ID           string
    Name         string
    Version      string
    ServiceURL   string
    Capabilities []string
    Tools        []Tool
    Resources    []Resource
    // ... other fields from IDL
}

// RegisterServer creates a new MCP server registry entry
func RegisterServer(ctx context.Context, client *client.Client, signer solana.PrivateKey, server ServerCard) (*solana.Signature, error) {
    // Implementation with transaction building and error handling
}
```

### 2.4 Implement `payments` Package (Payment Flows)

**File:** `payments/payments.go`

**Acceptance Criteria:**
- **All payment flows implemented:** Functions for prepay, pay-as-you-go, and stream payments must be present and callable
- **Unit tests for each:** Each payment flow must have at least one unit test for both success and failure
- **Handles edge cases:** Tests must cover scenarios like insufficient balance, invalid mint, and unauthorized payer
- **API documented:** All public functions and types must have GoDoc comments

**Reference:** [`docs/SDK_ROADMAP_DETAILED.md`](SDK_ROADMAP_DETAILED.md:139-148)

**Implementation Requirements:**
```go
// Config holds payment configuration
type Config struct {
    Mint         solana.PublicKey
    Amount       uint64
    Recipient    solana.PublicKey
    PaymentType  PaymentType
}

// PaymentType represents different payment flow types
type PaymentType int

const (
    Prepay PaymentType = iota
    PayAsYouGo
    Stream
)

// PayPrepay executes a prepaid payment flow
func PayPrepay(ctx context.Context, client *client.Client, signer solana.PrivateKey, config Config) (*solana.Signature, error) {
    // Implementation with proper balance checks and error handling
}

// PayPYG executes a pay-as-you-go payment flow
func PayPYG(ctx context.Context, client *client.Client, signer solana.PrivateKey, config Config) (*solana.Signature, error) {
    // Implementation with usage tracking and metering
}

// PayStream executes a streaming payment flow
func PayStream(ctx context.Context, client *client.Client, signer solana.PrivateKey, config Config) (*solana.Signature, error) {
    // Implementation with stream payment logic
}
```

### 2.5 Implement `idl` Package (Go:embed Structs)

**File:** `idl/idl.go`

**Acceptance Criteria:**
- **IDL loads:** The IDL must be embedded at compile time using go:embed directive
- **Struct mapping correct:** Generated Go structs must match the Anchor IDL structure exactly
- **Documented usage:** The code must include comments explaining how the IDL is loaded and used

**Reference:** [go:embed package](https://pkg.go.dev/embed), [`idl/`](../idl/)

**Implementation Requirements:**
```go
package idl

import (
    _ "embed"
    "encoding/json"
)

// Embedded IDL files using go:embed directive
//go:embed agent_registry.json
var agentRegistryIDL []byte

//go:embed mcp_server_registry.json
var mcpServerRegistryIDL []byte

// IDL represents the structure of an Anchor IDL
type IDL struct {
    Version      string        `json:"version"`
    Name         string        `json:"name"`
    Instructions []Instruction `json:"instructions"`
    Accounts     []Account     `json:"accounts"`
    Types        []Type        `json:"types"`
    Events       []Event       `json:"events"`
    Errors       []Error       `json:"errors"`
    Constants    []Constant    `json:"constants"`
}

// LoadAgentRegistryIDL loads and parses the agent registry IDL
func LoadAgentRegistryIDL() (*IDL, error) {
    var idl IDL
    if err := json.Unmarshal(agentRegistryIDL, &idl); err != nil {
        return nil, fmt.Errorf("failed to unmarshal agent registry IDL: %w", err)
    }
    return &idl, nil
}

// LoadMCPServerRegistryIDL loads and parses the MCP server registry IDL
func LoadMCPServerRegistryIDL() (*IDL, error) {
    var idl IDL
    if err := json.Unmarshal(mcpServerRegistryIDL, &idl); err != nil {
        return nil, fmt.Errorf("failed to unmarshal MCP server registry IDL: %w", err)
    }
    return &idl, nil
}
```

## 3. Error Handling Guidelines

### 3.1 Error Type Definitions

**File:** `errors/errors.go`

**Reference:** [Effective Go - Errors](https://golang.org/doc/effective_go#errors), [`rust/src/errors.rs`](../rust/src/errors.rs)

```go
package errors

import (
    "fmt"
    "errors"
)

// RegistryError represents errors from the Solana AI Registries SDK
type RegistryError struct {
    Code    uint32
    Message string
    Cause   error
}

func (e *RegistryError) Error() string {
    if e.Cause != nil {
        return fmt.Sprintf("registry error %d: %s (caused by: %v)", e.Code, e.Message, e.Cause)
    }
    return fmt.Sprintf("registry error %d: %s", e.Code, e.Message)
}

func (e *RegistryError) Unwrap() error {
    return e.Cause
}

// Common error constructors
func NewInvalidAgentIDError(cause error) *RegistryError {
    return &RegistryError{
        Code:    1001,
        Message: "agent ID length is invalid (empty or exceeds max)",
        Cause:   cause,
    }
}

func NewInsufficientFundsError(cause error) *RegistryError {
    return &RegistryError{
        Code:    1002,
        Message: "insufficient funds for transaction",
        Cause:   cause,
    }
}

// Error type checking functions
func IsInvalidAgentIDError(err error) bool {
    var regErr *RegistryError
    return errors.As(err, &regErr) && regErr.Code == 1001
}

func IsInsufficientFundsError(err error) bool {
    var regErr *RegistryError
    return errors.As(err, &regErr) && regErr.Code == 1002
}
```

### 3.2 Error Handling Patterns

**Best Practices:**
1. **Wrap errors with context:** Always provide context when wrapping errors
2. **Use typed errors:** Create specific error types for different failure modes
3. **Handle timeouts:** Implement proper timeout handling for RPC calls
4. **Retry logic:** Implement exponential backoff for transient failures
5. **Logging:** Log errors with appropriate levels and context

**Example Implementation:**
```go
// WithRetry implements exponential backoff retry logic
func WithRetry(ctx context.Context, maxRetries int, operation func() error) error {
    var lastErr error
    for i := 0; i < maxRetries; i++ {
        if err := operation(); err != nil {
            lastErr = err
            if isRetryableError(err) {
                backoff := time.Duration(i) * time.Second
                select {
                case <-ctx.Done():
                    return ctx.Err()
                case <-time.After(backoff):
                    continue
                }
            }
            return err
        }
        return nil
    }
    return fmt.Errorf("operation failed after %d retries: %w", maxRetries, lastErr)
}
```

## 4. Testing Requirements

### 4.1 Unit Tests

**Coverage Requirement:** >90% code coverage using `go test -cover`

**Test Structure:**
```go
func TestAgent_Register(t *testing.T) {
    tests := []struct {
        name    string
        card    Card
        wantErr bool
        errType error
    }{
        {
            name: "valid agent registration",
            card: Card{
                ID:          "test-agent-001",
                Name:        "Test Agent",
                Description: "A test agent for unit testing",
                Version:     "1.0.0",
            },
            wantErr: false,
        },
        {
            name: "invalid agent ID - too long",
            card: Card{
                ID:          strings.Repeat("a", 65), // exceeds max length
                Name:        "Test Agent",
                Description: "A test agent for unit testing",
                Version:     "1.0.0",
            },
            wantErr: true,
            errType: &RegistryError{Code: 1001},
        },
    }

    for _, tt := range tests {
        t.Run(tt.name, func(t *testing.T) {
            // Test implementation
        })
    }
}
```

### 4.2 Integration Tests

**File:** `tests/integration_test.go`

**Acceptance Criteria:**
- **All tests pass:** Integration tests must run successfully against Solana devnet
- **Coverage >90%:** Use `go test -cover` to verify code coverage exceeds 90%
- **Output reproducible:** Running the tests multiple times yields the same results

**Reference:** [`docs/SDK_ROADMAP_DETAILED.md`](SDK_ROADMAP_DETAILED.md:93)

**Test Command:**
```bash
go test ./... -run TestIntegration -tags=devnet
```

**Example Integration Test:**
```go
//go:build devnet
// +build devnet

package tests

import (
    "context"
    "testing"
    "time"

    "github.com/stretchr/testify/require"
    "github.com/svmai/registries/agent"
    "github.com/svmai/registries/client"
)

func TestIntegration_AgentLifecycle(t *testing.T) {
    if testing.Short() {
        t.Skip("skipping integration test in short mode")
    }

    ctx, cancel := context.WithTimeout(context.Background(), 30*time.Second)
    defer cancel()

    // Setup client
    cfg := &client.Config{
        RPCEndpoint: "https://api.devnet.solana.com",
        Commitment:  rpc.CommitmentFinalized,
        Timeout:     10 * time.Second,
    }
    client, err := client.NewClient(cfg)
    require.NoError(t, err)

    // Test agent registration
    card := agent.Card{
        ID:          "integration-test-agent",
        Name:        "Integration Test Agent",
        Description: "Agent for integration testing",
        Version:     "1.0.0",
    }

    // Register agent
    sig, err := agent.Register(ctx, client, testSigner, card)
    require.NoError(t, err)
    require.NotEmpty(t, sig)

    // Verify registration
    retrievedCard, err := agent.Get(ctx, client, card.ID)
    require.NoError(t, err)
    require.Equal(t, card.ID, retrievedCard.ID)
    require.Equal(t, card.Name, retrievedCard.Name)

    // Update agent
    card.Description = "Updated description"
    sig, err = agent.Update(ctx, client, testSigner, card)
    require.NoError(t, err)
    require.NotEmpty(t, sig)

    // Verify update
    retrievedCard, err = agent.Get(ctx, client, card.ID)
    require.NoError(t, err)
    require.Equal(t, "Updated description", retrievedCard.Description)

    // Delete agent
    sig, err = agent.Delete(ctx, client, testSigner, card.ID)
    require.NoError(t, err)
    require.NotEmpty(t, sig)

    // Verify deletion
    _, err = agent.Get(ctx, client, card.ID)
    require.Error(t, err)
    require.True(t, errors.Is(err, &RegistryError{Code: 404}))
}
```

### 4.3 Performance Tests

**File:** `tests/performance_test.go`

**Benchmarks:**
```go
func BenchmarkAgent_Register(b *testing.B) {
    client := setupTestClient()
    card := agent.Card{
        ID:          "benchmark-agent",
        Name:        "Benchmark Agent",
        Description: "Agent for benchmarking",
        Version:     "1.0.0",
    }

    b.ResetTimer()
    for i := 0; i < b.N; i++ {
        _, err := agent.Register(context.Background(), client, testSigner, card)
        if err != nil {
            b.Fatal(err)
        }
    }
}
```

## 5. CI/CD Pipeline

### 5.1 GitHub Actions Workflow

**File:** `.github/workflows/go.yml`

**Reference:** [`docs/SDK_ROADMAP_DETAILED.md`](SDK_ROADMAP_DETAILED.md:164-174)

```yaml
name: Go SDK CI/CD

on:
  push:
    branches: [ main, develop ]
  pull_request:
    branches: [ main ]

jobs:
  test:
    runs-on: ubuntu-latest
    strategy:
      matrix:
        go-version: [ 1.21.x, 1.22.x ]
    
    steps:
    - uses: actions/checkout@v4
    
    - name: Set up Go
      uses: actions/setup-go@v4
      with:
        go-version: ${{ matrix.go-version }}
    
    - name: Cache Go modules
      uses: actions/cache@v3
      with:
        path: ~/go/pkg/mod
        key: ${{ runner.os }}-go-${{ hashFiles('**/go.sum') }}
        restore-keys: |
          ${{ runner.os }}-go-
    
    - name: Download dependencies
      run: go mod download
    
    - name: Run tests
      run: go test -v -race -coverprofile=coverage.out ./...
    
    - name: Run integration tests
      run: go test -v -tags=devnet ./tests/...
      env:
        SOLANA_RPC_URL: ${{ secrets.SOLANA_DEVNET_RPC_URL }}
    
    - name: Check coverage
      run: |
        go tool cover -func=coverage.out
        COVERAGE=$(go tool cover -func=coverage.out | grep total | awk '{print $3}' | sed 's/%//')
        if (( $(echo "$COVERAGE < 90" | bc -l) )); then
          echo "Coverage $COVERAGE% is below 90%"
          exit 1
        fi
    
    - name: Upload coverage to Codecov
      uses: codecov/codecov-action@v3
      with:
        file: ./coverage.out
        flags: unittests
        name: codecov-umbrella
        fail_ci_if_error: true

  lint:
    runs-on: ubuntu-latest
    steps:
    - uses: actions/checkout@v4
    
    - name: Set up Go
      uses: actions/setup-go@v4
      with:
        go-version: 1.22.x
    
    - name: golangci-lint
      uses: golangci/golangci-lint-action@v3
      with:
        version: latest
        args: --timeout=5m

  security:
    runs-on: ubuntu-latest
    steps:
    - uses: actions/checkout@v4
    
    - name: Run Gosec Security Scanner
      uses: securecodewarrior/github-action-gosec@master
      with:
        args: './...'

  publish:
    runs-on: ubuntu-latest
    needs: [test, lint, security]
    if: github.ref == 'refs/heads/main'
    steps:
    - uses: actions/checkout@v4
    
    - name: Set up Go
      uses: actions/setup-go@v4
      with:
        go-version: 1.22.x
    
    - name: Create release
      if: startsWith(github.ref, 'refs/tags/')
      uses: actions/create-release@v1
      env:
        GITHUB_TOKEN: ${{ secrets.GITHUB_TOKEN }}
      with:
        tag_name: ${{ github.ref }}
        release_name: Release ${{ github.ref }}
        draft: false
        prerelease: false
```

### 5.2 Quality Gates

**Pre-commit Requirements:**
- All tests pass
- Code coverage >90%
- No linting errors
- Security scan passes
- Documentation updated

**Release Requirements:**
- Integration tests pass on devnet
- Performance benchmarks meet targets
- API documentation generated
- Migration guide provided (if breaking changes)

## 6. Code Style and Review Guidelines

### 6.1 Code Style

**Reference:** [Effective Go](https://golang.org/doc/effective_go), [Go Code Review Comments](https://github.com/golang/go/wiki/CodeReviewComments)

**Key Requirements:**
1. **Formatting:** Use `gofmt` and `goimports`
2. **Naming:** Follow Go naming conventions
3. **Documentation:** All public APIs must have GoDoc comments
4. **Error handling:** Use proper error wrapping and context
5. **Concurrency:** Use channels and goroutines appropriately

**Example Code Style:**
```go
// RegisterAgent registers a new AI agent in the Solana registry.
//
// The agent card contains all necessary information for registry entry
// including ID, name, description, and service endpoints. The signer
// must be authorized to create registry entries.
//
// Returns the transaction signature on success or an error on failure.
// Common errors include invalid agent data, insufficient funds, and
// network connectivity issues.
func RegisterAgent(ctx context.Context, client *Client, signer PrivateKey, card AgentCard) (*Signature, error) {
    if err := validateAgentCard(card); err != nil {
        return nil, fmt.Errorf("invalid agent card: %w", err)
    }

    tx, err := buildRegisterTransaction(card, signer.PublicKey())
    if err != nil {
        return nil, fmt.Errorf("failed to build transaction: %w", err)
    }

    sig, err := client.SendTransaction(ctx, tx, signer)
    if err != nil {
        return nil, fmt.Errorf("failed to send transaction: %w", err)
    }

    return sig, nil
}
```

### 6.2 Review Guidelines

**Review Checklist:**
- [ ] Code follows Go style guidelines
- [ ] All public APIs are documented
- [ ] Error handling is appropriate
- [ ] Tests cover both success and failure cases
- [ ] Integration tests pass on devnet
- [ ] Performance impact is acceptable
- [ ] Security considerations are addressed
- [ ] Breaking changes are documented

**Review Process:**
1. **Automated checks:** CI pipeline validates code quality
2. **Peer review:** At least one team member reviews code
3. **Architecture review:** For significant changes, architecture review required
4. **Security review:** For payment or security-related changes

## 7. Versioning and Publishing

### 7.1 Semantic Versioning

**Reference:** [Semantic Versioning](https://semver.org/)

**Version Format:** `MAJOR.MINOR.PATCH`

- **MAJOR:** Incompatible API changes
- **MINOR:** Backwards-compatible functionality additions
- **PATCH:** Backwards-compatible bug fixes

**Pre-release Versions:**
- `v1.0.0-alpha.1` - Alpha releases
- `v1.0.0-beta.1` - Beta releases
- `v1.0.0-rc.1` - Release candidates

### 7.2 Release Process

**Steps:**
1. **Version bump:** Update version in `go.mod` and documentation
2. **Changelog:** Update `CHANGELOG.md` with release notes
3. **Tag creation:** Create git tag with version
4. **Release notes:** Generate release notes from changelog
5. **Publishing:** Publish to pkg.go.dev (automatic)

**Release Commands:**
```bash
# Update version
git tag v1.0.0

# Push tag to trigger release
git push origin v1.0.0

# Verify release
go list -m github.com/svmai/registries@v1.0.0
```

### 7.3 Backwards Compatibility

**Compatibility Promise:**
- Major versions maintain API compatibility
- Minor versions are backwards compatible
- Patch versions only contain bug fixes
- Deprecated features are marked and maintained for at least one major version

## 8. Reference Links

### 8.1 Repository Artifacts

**Core Documentation:**
- [SDK Master Plan](SDK_ROADMAP_DETAILED.md) - Overall SDK strategy and roadmap
- [SDK Execution Plan](SDK_EXECUTION_PLAN_DETAILED.md) - Detailed task breakdown
- [Go SDK References](sdk_refs/go_sdk_references.md) - Atomic task references

**IDL and Types:**
- [Agent Registry IDL](../idl/agent_registry.json) - Agent registry program interface
- [MCP Server Registry IDL](../idl/mcp_server_registry.json) - MCP server registry interface
- [Rust Error Types](../rust/src/errors.rs) - Reference error implementations

**Program Sources:**
- [Agent Registry Program](../programs/agent-registry/) - On-chain agent registry
- [MCP Server Registry Program](../programs/mcp-server-registry/) - On-chain MCP server registry
- [Token Program](../programs/svmai-token/) - Payment token implementation

### 8.2 External References

**Go Ecosystem:**
- [Go Documentation](https://golang.org/doc/) - Official Go documentation
- [Effective Go](https://golang.org/doc/effective_go) - Go best practices
- [Go Testing](https://golang.org/pkg/testing/) - Testing package documentation
- [Go Modules](https://golang.org/ref/mod) - Module system reference

**Solana Ecosystem:**
- [Solana Go SDK](https://pkg.go.dev/github.com/gagliardetto/solana-go) - Core Solana Go library
- [Solana RPC API](https://docs.solana.com/developing/clients/jsonrpc-api) - RPC interface documentation
- [Anchor Framework](https://www.anchor-lang.com/) - Solana development framework

**Development Tools:**
- [golangci-lint](https://golangci-lint.run/) - Go linter
- [testify](https://github.com/stretchr/testify) - Testing framework
- [Codecov](https://codecov.io/) - Code coverage reporting

### 8.3 Development Environment

**Prerequisites:**
- Go 1.21+ installed
- Git configured
- Access to Solana devnet RPC endpoint
- IDE with Go support (VS Code, GoLand, etc.)

**Setup Commands:**
```bash
# Clone repository
git clone https://github.com/svmai/registries.git
cd registries

# Install dependencies
go mod download

# Run tests
go test ./...

# Run integration tests
go test -tags=devnet ./tests/...

# Generate documentation
go doc -all
```

## 9. Migration and Maintenance

### 9.1 Breaking Changes

**When making breaking changes:**
1. Document the change in `CHANGELOG.md`
2. Provide migration guide
3. Update examples and documentation
4. Maintain deprecated APIs for one major version
5. Add deprecation warnings

### 9.2 Long-term Maintenance

**Maintenance Schedule:**
- **Security updates:** As needed
- **Dependency updates:** Monthly
- **Minor releases:** Quarterly
- **Major releases:** Annually

**Support Policy:**
- Current major version: Full support
- Previous major version: Security updates only
- Older versions: No support

This comprehensive guide provides the foundation for implementing a robust, production-ready Go SDK for Solana AI Registries. Contributors should follow these guidelines to ensure consistency, quality, and maintainability across the codebase.