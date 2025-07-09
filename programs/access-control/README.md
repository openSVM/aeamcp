# Solana Access Control Program

A comprehensive, security-first access control system for Solana blockchain applications, implementing wallet signature-based authentication with advanced delegation, replay attack prevention, and performance optimizations.

## 🚀 Features

### Core Security
- **Ed25519 Signature Verification**: Cryptographically secure wallet signature validation
- **Replay Attack Prevention**: Sliding window bitmap nonce tracking with overflow protection
- **Timestamp Validation**: Clock skew tolerance with signature expiration
- **Delegation Security**: Circular delegation detection and privilege escalation prevention

### Performance Optimizations
- **PDA-Based Indexing**: O(1) permission lookups instead of linear scans
- **Bitmap Nonce Tracking**: 64-bit sliding window for efficient nonce management
- **CPI Optimization**: Bundled operations for reduced compute costs
- **Memory Efficiency**: Compact data structures and automatic pruning

### Developer Experience
- **Modular Architecture**: Clean separation of verification and execution phases
- **Comprehensive Testing**: Full test suite covering edge cases and security scenarios
- **Rich Documentation**: Security audit, performance benchmarks, and integration guides
- **Type Safety**: Strong Rust typing with compile-time security checks

## 📋 Quick Start

### Installation

Add to your `Cargo.toml`:

```toml
[dependencies]
access-control = { path = "../../programs/access-control" }
anchor-lang = "0.30.1"
```

### Basic Usage

```rust
use access_control::cpi;

// Verify signature and execute operation
let cpi_program = ctx.accounts.access_control_program.to_account_info();
let cpi_accounts = cpi::accounts::VerifySignatureCpi {
    access_control_account: ctx.accounts.access_control_account.to_account_info(),
    nonce_tracker: ctx.accounts.nonce_tracker.to_account_info(),
    resource_program: ctx.accounts.resource_program.to_account_info(),
    signer: ctx.accounts.signer.to_account_info(),
};

cpi::verify_signature(
    CpiContext::new(cpi_program, cpi_accounts),
    resource_id,
    operation,
    signature,
    message,
    nonce,
    timestamp,
)?;
```

## 🏗️ Architecture

### Program Structure

```
access-control/
├── src/
│   ├── lib.rs              # Main program entry point
│   ├── error.rs            # Error definitions
│   ├── instruction.rs      # Instruction enum and CPI helpers
│   ├── processor.rs        # Instruction handlers
│   ├── state.rs           # Account structures and data types
│   ├── validation.rs      # Signature and input validation
│   ├── security.rs        # Security monitoring and audit
│   └── utils.rs           # Utility functions and helpers
├── tests/
│   └── edge_cases.rs      # Comprehensive test suite
├── SECURITY_AUDIT.md      # Security audit checklist
├── CPI_OPTIMIZATION.md    # Performance optimization guide
└── README.md             # This file
```

### Core Components

#### 1. Access Control Account
```rust
pub struct AccessControlAccount {
    pub resource_id: String,
    pub resource_program: Pubkey,
    pub owner: Pubkey,
    pub global_nonce_counter: u64,
    pub delegation_chain_limit: u8,
    pub permission_grants: Vec<PermissionGrant>,
}
```

#### 2. Nonce Tracker
```rust
pub struct NonceTracker {
    pub resource_id: String,
    pub wallet: Pubkey,
    pub nonce_window: NonceWindow,
    pub last_update_timestamp: i64,
    pub update_sequence: u64,
}
```

#### 3. Permission Grant
```rust
pub struct PermissionGrant {
    pub wallet: Pubkey,
    pub operations: Vec<String>,
    pub granted_at: i64,
    pub expires_at: Option<i64>,
    pub can_delegate: bool,
    pub granted_by: Pubkey,
    pub delegation_depth: u8,
    pub max_delegation_depth: u8,
}
```

## 🔐 Security Features

### Replay Attack Prevention

- **Sliding Window Bitmap**: 64-bit bitmap tracks used nonces efficiently
- **Overflow Protection**: Explicit checks prevent nonce overflow attacks
- **Timestamp Validation**: 30-second drift tolerance with 5-minute expiry
- **Message Reconstruction**: Canonical format prevents manipulation

### Delegation Security

- **Circular Detection**: HashSet-based cycle detection in delegation chains
- **Depth Limiting**: Configurable maximum delegation depth (default: 5)
- **Privilege Controls**: Granters cannot grant more permissions than they have
- **Revocation Cascading**: Automatic cleanup of delegated permissions

### Cryptographic Security

- **Ed25519 Signatures**: Industry-standard elliptic curve digital signatures
- **SHA256 Hashing**: Cryptographic message integrity
- **Constant-Time Operations**: Timing attack protection
- **Key Validation**: Proper public key parsing and validation

## 📈 Performance

### Benchmarks

| Operation | Compute Units | Optimized | Savings |
|-----------|---------------|-----------|---------|
| Signature Verification | 25,000 | 18,000 | 28% |
| Permission Grant | 13,000 | 9,000 | 31% |
| Nonce Update | 4,000 | 2,500 | 38% |
| Delegation Check | 8,000 | 3,000 | 63% |

### Optimizations

- **PDA Indexing**: O(1) permission lookups vs O(n) linear scans
- **Bitmap Nonces**: 64-bit bitmap vs vector storage (90% memory reduction)
- **Instruction Bundling**: Combined verify+execute operations (25% cost reduction)
- **Account Pooling**: Reduced account allocation overhead

## 🧪 Testing

Run the comprehensive test suite:

```bash
# Unit tests
cargo test

# Integration tests with edge cases
cargo test --test edge_cases

# Security-focused tests
cargo test test_replay_attack_prevention
cargo test test_delegation_circular_detection
cargo test test_nonce_window_bitmap
```

### Test Coverage

- ✅ Replay attack scenarios
- ✅ Delegation chain validation
- ✅ Concurrency safety
- ✅ Nonce overflow protection
- ✅ Signature verification edge cases
- ✅ Memory optimization
- ✅ Performance benchmarks

## 🛡️ Security Audit

The program has undergone comprehensive security review:

- **Replay Protection**: ✅ Mitigated
- **Delegation Security**: ✅ Mitigated  
- **Nonce Robustness**: ✅ Mitigated
- **Privilege Escalation**: ✅ Mitigated
- **DoS Prevention**: ✅ Mitigated

See [SECURITY_AUDIT.md](./SECURITY_AUDIT.md) for complete audit details.

## 🔧 Configuration

### Environment Variables

```bash
# Security settings
ACCESS_CONTROL_MAX_DELEGATION_DEPTH=5
ACCESS_CONTROL_SIGNATURE_EXPIRY_SECONDS=300
ACCESS_CONTROL_TIMESTAMP_DRIFT_SECONDS=30

# Performance settings  
ACCESS_CONTROL_ENABLE_CPI_OPTIMIZATION=true
ACCESS_CONTROL_ENABLE_PERFORMANCE_MONITORING=true
ACCESS_CONTROL_NONCE_WINDOW_SIZE=64

# Monitoring settings
ACCESS_CONTROL_ENABLE_SECURITY_MONITORING=true
ACCESS_CONTROL_AUDIT_LOG_LEVEL=INFO
ACCESS_CONTROL_RATE_LIMIT_WINDOW=60
```

### Production Deployment

```toml
[profile.release]
overflow-checks = true
lto = true
codegen-units = 1
panic = "abort"

[profile.release.package.access-control]
opt-level = 3
debug = false
```

## 🔗 Integration Examples

### Basic Permission Check

```rust
// Check if wallet has permission for operation
let has_permission = access_control::utils::has_permission(
    &access_control_account.permission_grants,
    &wallet_pubkey,
    "read_data",
    current_timestamp,
);
```

### Delegation with Controls

```rust
// Grant permission with delegation controls
let grant = access_control::utils::create_permission_grant(
    target_wallet,
    vec!["read".to_string(), "write".to_string()],
    Some(expiry_timestamp),
    true, // can_delegate
    granter_wallet,
    delegation_depth,
    max_delegation_depth,
)?;
```

### Signature Verification

```rust
// Comprehensive signature validation
access_control::validation::comprehensive_signature_validation(
    &signature,
    &public_key,
    &resource_id,
    &operation,
    nonce,
    timestamp,
    Some(&additional_data),
)?;
```

## 📚 Advanced Usage

### Custom Operations

```rust
// Define custom operations
const CUSTOM_OPERATIONS: &[&str] = &[
    "create_post",
    "delete_post", 
    "moderate_content",
    "manage_users",
];

// Validate custom operation
access_control::validation::validate_operation("create_post")?;
```

### Performance Monitoring

```rust
// Monitor operation performance
let monitor = access_control::utils::PerformanceMonitor::new("grant_permission".to_string())?;

// ... perform operation ...

let duration = monitor.finish()?;
msg!("Operation completed in {} seconds", duration);
```

### Security Auditing

```rust
// Perform security audit
let audit_result = access_control::security::perform_security_audit(
    &resource_id,
    &operation,
    &wallet,
    nonce,
    timestamp,
    &permission_grants,
)?;

if audit_result.overall_risk >= RiskLevel::High {
    // Handle high-risk operation
}
```

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Run tests (`cargo test`)
4. Run security audit (`cargo audit`)
5. Commit changes (`git commit -m 'Add amazing feature'`)
6. Push to branch (`git push origin feature/amazing-feature`)
7. Open a Pull Request

### Development Setup

```bash
# Install dependencies
cargo install cargo-audit
cargo install cargo-tarpaulin

# Run full test suite
cargo test --all-features

# Security audit
cargo audit

# Coverage report
cargo tarpaulin --out Html
```

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- **Solana Foundation** for the blockchain infrastructure
- **Anchor Framework** for the development framework
- **ed25519-dalek** for cryptographic primitives
- **OpenZeppelin** for security best practices inspiration

## 📞 Support

- **Documentation**: [AEAMCP Docs](https://docs.aeamcp.io)
- **Discord**: [AEAMCP Community](https://discord.gg/aeamcp)
- **Issues**: [GitHub Issues](https://github.com/openSVM/aeamcp/issues)
- **Security**: security@aeamcp.io

---

**Built with ❤️ for the Solana ecosystem**