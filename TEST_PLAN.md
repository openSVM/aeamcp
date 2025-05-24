# Solana AI Registries Test Plan

## Overview

This document outlines the comprehensive testing strategy for the Solana AI Registries implementation, covering both the Agent Registry and MCP Server Registry programs.

## Test Environment Setup

### Prerequisites
- Rust toolchain (1.70+)
- Solana CLI (1.18+)
- Node.js (for client-side testing)
- Git

### Installation
```bash
# Install Rust
curl --proto '=https' --tlsv1.2 -sSf https://sh.rustup.rs | sh

# Install Solana CLI
sh -c "$(curl -sSfL https://release.solana.com/v1.18.0/install)"

# Install dependencies
cargo install --version 0.28.0 anchor-cli
```

## Unit Tests

### Agent Registry Tests
- [ ] **Registration Tests**
  - Valid agent registration
  - Invalid input validation (empty fields, oversized data)
  - Duplicate agent ID handling
  - PDA derivation correctness

- [ ] **Update Tests**
  - Valid field updates
  - Unauthorized update attempts
  - Partial field updates
  - Clear optional fields functionality

- [ ] **Status Management Tests**
  - Status transitions (Pending → Active → Inactive → Deregistered)
  - Invalid status values
  - Status change authorization

- [ ] **Deregistration Tests**
  - Proper deregistration flow
  - Authorization checks
  - Event emission verification

### MCP Server Registry Tests
- [ ] **Registration Tests**
  - Valid MCP server registration
  - Tool/Resource/Prompt definition validation
  - Hash verification for definitions
  - Capability flags validation

- [ ] **Update Tests**
  - Server details updates
  - Tool definitions updates
  - Resource definitions updates
  - Prompt definitions updates

- [ ] **Status Management Tests**
  - Server status transitions
  - Authorization checks
  - Event emission

### Common Library Tests
- [ ] **Serialization Tests**
  - Borsh serialization/deserialization
  - Input struct conversions
  - Size calculations

- [ ] **Validation Tests**
  - String length validations
  - Array size validations
  - Hash format validations
  - URI format validations

- [ ] **Utility Tests**
  - PDA derivation functions
  - Timestamp utilities
  - Error handling

## Integration Tests

### Cross-Program Tests
- [ ] **Agent-MCP Integration**
  - Agent referencing MCP servers
  - Cross-registry queries
  - Event correlation

### Client Integration Tests
- [ ] **JavaScript/TypeScript SDK**
  - Program interaction
  - Account fetching
  - Event listening
  - Error handling

- [ ] **Rust Client**
  - Direct program calls
  - Account deserialization
  - Transaction building

## Performance Tests

### Load Testing
- [ ] **Registration Load**
  - Concurrent agent registrations
  - Concurrent MCP server registrations
  - Memory usage under load

- [ ] **Query Performance**
  - Large registry queries
  - PDA derivation performance
  - Event processing performance

### Storage Tests
- [ ] **Account Size Limits**
  - Maximum data size testing
  - Rent calculation verification
  - Storage optimization validation

## Security Tests

### Access Control Tests
- [ ] **Authorization**
  - Owner-only modifications
  - Unauthorized access attempts
  - Signature verification

- [ ] **Input Validation**
  - Malformed input handling
  - Buffer overflow protection
  - Injection attack prevention

### Cryptographic Tests
- [ ] **Hash Verification**
  - SHA256 hash validation
  - Hash mismatch handling
  - Off-chain data integrity

## Network Tests

### Devnet Testing
- [ ] **Deployment**
  - Program deployment
  - Account creation
  - Basic functionality

- [ ] **End-to-End Flows**
  - Complete registration flows
  - Update operations
  - Query operations

### Testnet Testing
- [ ] **Production-like Environment**
  - Real SOL transactions
  - Network latency handling
  - Error recovery

### Mainnet Preparation
- [ ] **Security Audit**
  - Code review
  - Vulnerability assessment
  - Best practices compliance

- [ ] **Performance Validation**
  - Gas optimization
  - Transaction success rates
  - Network congestion handling

## Event Testing

### Event Emission Tests
- [ ] **Agent Events**
  - AgentRegistered event structure
  - AgentUpdated event data
  - AgentStatusChanged events
  - AgentDeregistered events

- [ ] **MCP Server Events**
  - McpServerRegistered events
  - McpServerUpdated events
  - McpServerStatusChanged events
  - McpServerDeregistered events

### Event Processing Tests
- [ ] **Off-chain Indexing**
  - Event parsing
  - Database updates
  - Real-time processing
  - Error recovery

## Compatibility Tests

### Version Compatibility
- [ ] **Schema Versioning**
  - Backward compatibility
  - Migration testing
  - Version detection

### Protocol Compliance
- [ ] **A2A Compliance**
  - AgentCard compatibility
  - Protocol adherence
  - Metadata validation

- [ ] **MCP Compliance**
  - MCP specification adherence
  - Tool/Resource/Prompt formats
  - Communication protocols

## Test Execution

### Automated Testing
```bash
# Run all unit tests
cargo test --workspace

# Run integration tests
cargo test --test integration_tests

# Run specific test suite
cargo test agent_registry_tests
cargo test mcp_server_registry_tests
```

### Manual Testing
1. Deploy to devnet
2. Register test agents and MCP servers
3. Perform update operations
4. Verify event emission
5. Test client integrations

## Test Data

### Sample Agent Data
```json
{
  "agent_id": "test-agent-001",
  "name": "Test Trading Agent",
  "description": "A test agent for DeFi trading",
  "agent_version": "1.0.0",
  "service_endpoints": [
    {
      "protocol": "a2a_http_jsonrpc",
      "url": "https://api.example.com/agent",
      "is_default": true
    }
  ],
  "skills": [
    {
      "id": "trading",
      "name": "DeFi Trading",
      "tags": ["defi", "trading", "solana"]
    }
  ],
  "tags": ["test", "trading", "defi"]
}
```

### Sample MCP Server Data
```json
{
  "server_id": "test-mcp-001",
  "name": "Test Financial Data Server",
  "server_version": "1.0.0",
  "service_endpoint": "https://api.example.com/mcp",
  "supports_tools": true,
  "supports_resources": true,
  "supports_prompts": false,
  "onchain_tool_definitions": [
    {
      "name": "get_price",
      "description_hash": "...",
      "input_schema_hash": "...",
      "output_schema_hash": "...",
      "tags": ["price", "data"]
    }
  ],
  "tags": ["financial", "data", "test"]
}
```

## Success Criteria

### Functional Requirements
- [ ] All programs compile without errors
- [ ] All unit tests pass
- [ ] Integration tests pass
- [ ] Events are properly emitted
- [ ] Client SDKs work correctly

### Performance Requirements
- [ ] Registration completes within 5 seconds
- [ ] Queries return within 1 second
- [ ] Memory usage stays within limits
- [ ] Gas costs are optimized

### Security Requirements
- [ ] No unauthorized access possible
- [ ] Input validation prevents attacks
- [ ] Cryptographic operations are secure
- [ ] Error handling doesn't leak information

## Test Schedule

### Phase 1: Unit Testing (Week 1)
- Implement and run all unit tests
- Fix any discovered issues
- Achieve 100% test coverage

### Phase 2: Integration Testing (Week 2)
- Set up integration test environment
- Run cross-program tests
- Test client integrations

### Phase 3: Network Testing (Week 3)
- Deploy to devnet
- Run end-to-end tests
- Performance testing

### Phase 4: Security Testing (Week 4)
- Security audit
- Penetration testing
- Final validation

## Risk Mitigation

### High-Risk Areas
1. **PDA Derivation**: Ensure consistent seed generation
2. **Event Emission**: Verify all events are properly structured
3. **Access Control**: Validate authorization checks
4. **Data Validation**: Prevent malformed input processing

### Mitigation Strategies
- Comprehensive test coverage
- Code review processes
- Security audits
- Gradual rollout (devnet → testnet → mainnet)

## Documentation

### Test Documentation
- [ ] Test case specifications
- [ ] Test execution reports
- [ ] Performance benchmarks
- [ ] Security assessment reports

### User Documentation
- [ ] API documentation
- [ ] SDK usage examples
- [ ] Deployment guides
- [ ] Troubleshooting guides