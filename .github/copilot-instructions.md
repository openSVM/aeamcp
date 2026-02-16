# Copilot Agent Instructions for Solana AI Registries (aeamcp)

## Repository Overview

This is the **AEA Network (Autonomous Economic Agent Network)** - a foundational infrastructure project for the emerging autonomous agent economy. The repository implements a comprehensive on-chain registry system for autonomous AI agents and Model Context Protocol (MCP) servers on the Solana blockchain. Repository size: ~4.3GB with 21,933 files, including a large set of npm dependencies.

### Project Vision and Purpose

The AEA Network addresses the critical need for **decentralized discovery and verification infrastructure** for autonomous economic agents and LLM applications that can operate at scale while maintaining security and economic sustainability. This is not just a registry - it's foundational infrastructure enabling:

- **Agent Discovery**: Open, permissionless discovery of AI agents and their capabilities
- **Economic Coordination**: Autonomous agents conducting high-frequency micro-transactions
- **Trust and Reputation**: Decentralized reputation tracking and verification
- **Protocol Compliance**: Industry-standard compatibility with A2A, AEA, and MCP specifications

### Core Components

**Two Interconnected On-Chain Registries**:
1. **Agent Registry** (`solana-a2a`) - Decentralized directory for autonomous agents following AEA (Autonomous Economic Agent) and A2A (Agent-to-Agent) paradigms with skills, capabilities, endpoints, and reputation tracking
2. **MCP Server Registry** (`solana-mcp`) - Directory for Model Context Protocol compliant servers with tools, resources, and prompts discovery

**Dual-Token Economics** (AEA/SVMAI):
- **SVMAI**: DAO governance token with revenue sharing and value accrual (similar to MKR in MakerDAO)
- **AEA**: Pure utility token for AI agent service payments (consumable, not investment)
- Designed to avoid the "single token dilemma" and conflicting optimization problems

### Key Architectural Innovations

1. **Hybrid Data Storage**: Core verifiable data on-chain, rich metadata off-chain (IPFS/Arweave) with cryptographic hashes for integrity
2. **Event-Driven Architecture**: Comprehensive event emission for off-chain indexing and real-time updates
3. **Program Derived Addresses (PDAs)**: Deterministic account management enabling predictable agent coordination
4. **Native Solana Optimization**: Leverages Solana's 400ms block times, parallel processing, and low transaction costs (<$0.001)
5. **Protocol Compliance**: 100% compatible with Google's A2A protocol, Fetch.ai's AEA framework, and Anthropic's MCP specification

### Technical Stack

- **Solana Programs**: Rust with Solana SDK v1.18 and Anchor Framework v0.29.0
- **SDKs**: Python 3.12+, TypeScript/Node 20+, Rust (client library)
- **Frontend**: Next.js 15 with React 19 (retro DOS/ASCII aesthetic)
- **Backend**: Node.js/TypeScript with Express for Git-based registration
- **Security**: Multiple audit cycles completed (see `docs/audits/` and `AUDIT_SUMMARY.md`)

## Project Structure

```
aeamcp/
├── programs/                       # Solana on-chain programs (Rust)
│   ├── agent-registry/            # Agent registry program (solana-a2a)
│   ├── mcp-server-registry/       # MCP server registry program (solana-mcp)
│   ├── common/                    # Shared utilities (aeamcp-common)
│   └── svmai-token/               # Token program (has compile issues)
├── tests/                         # Integration tests (Rust)
│   ├── agent_registry_tests.rs
│   └── mcp_server_registry_tests.rs
├── rust/                          # Rust client SDK (has compile issues)
├── python/                        # Python SDK (solana-ai-registries)
├── sdk/typescript/                # TypeScript SDK (aea-sdk)
├── frontend/                      # Next.js web application
├── backend/                       # Node.js backend service
├── scripts/                       # Build and deployment scripts
├── docs/                          # Comprehensive documentation
├── Cargo.toml                     # Rust workspace configuration
├── Anchor.toml                    # Anchor framework configuration
└── package.json                   # Root npm dependencies
```

## Build and Test Instructions

### Rust Solana Programs (CORE)

**Prerequisites**:
- Rust 1.90+ (`rustc --version`)
- Cargo 1.90+ (`cargo --version`)
- Solana CLI is NOT required for building/testing the core programs

**Building Core Programs** (ALWAYS WORKS):
```bash
# Build only the working core programs (agent-registry and mcp-server-registry)
cargo build --package solana-a2a --package solana-mcp

# Build with BPF target (for deployment) - requires Solana CLI
cargo build-sbf --manifest-path programs/agent-registry/Cargo.toml
cargo build-sbf --manifest-path programs/mcp-server-registry/Cargo.toml
```

**Testing Core Programs** (ALWAYS WORKS):
```bash
# Run unit tests for core programs only (takes ~10 seconds)
cargo test --package solana-a2a --package solana-mcp --lib

# Expected: 45 tests pass (20 for agent-registry, 25 for mcp-server-registry)
```

**IMPORTANT - Known Build Issues**:
- ⚠️ **DO NOT run `cargo test --all` or `cargo build --all`** - This will fail
- The `rust/` SDK has a syntax error in `rust/tests/agent_flow.rs` (line 6: `use aeamcp-sdk` should be `use aeamcp_sdk`)
- The `svmai-token` program has multiple compilation errors in its tests
- When testing, ALWAYS use: `cargo test --package solana-a2a --package solana-mcp`

**Build Script** (works if Solana CLI installed):
```bash
./scripts/build.sh
# This script builds BPF programs and runs tests
# Takes ~2-3 minutes on first run
```

**Linting**:
```bash
# Format code (always run before committing Rust changes)
cargo fmt --all

# Run clippy (fix all warnings)
cargo clippy --package solana-a2a --package solana-mcp -- -D warnings
```

### Python SDK

**Prerequisites**: Python 3.12+ required (verified with `python3 --version`)

**Setup** (takes ~30 seconds):
```bash
cd python
pip3 install -e .[dev]
```

**Known Issue - pytest-xprocess**:
The Python tests have a dependency issue with `pytest-xprocess`. The CI workflow includes a workaround:
```bash
# Create compatibility shim (if tests fail)
cat > pytest_xprocess.py << 'EOF'
"""Compatibility shim for pytest-xprocess."""
from xprocess.pytest_xprocess import *
EOF
```

**Testing**:
```bash
cd python
# Run unit tests only (integration tests require devnet)
pytest tests/unit -v --cov=solana_ai_registries --cov-report=xml --cov-fail-under=50

# Run all tests (requires Solana devnet access)
pytest -v
```

**Linting** (ALWAYS run before committing Python changes):
```bash
cd python
black --check --diff .           # Format checking
isort --check-only --diff .      # Import sorting
mypy .                           # Type checking
flake8 .                         # Style linting
```

### TypeScript SDK

**Prerequisites**: Node.js 20+ and npm 10+ (verified with `node --version`)

**Setup** (takes ~10 seconds with ci):
```bash
cd sdk/typescript
npm ci --legacy-peer-deps  # Use --legacy-peer-deps to avoid peer dependency issues
```

**Building** (takes ~5 seconds):
```bash
cd sdk/typescript
npm run build
# Creates dist/index.js and dist/index.esm.js
```

**Testing**:
```bash
cd sdk/typescript
npm test  # Currently disabled in CI ("Tests temporarily disabled for CI setup")
```

**Linting**:
```bash
cd sdk/typescript
npm run format -- --check  # Prettier formatting check
npm run lint              # ESLint
npx tsc --noEmit          # Type checking
```

### Frontend (Next.js)

**Prerequisites**: Node.js 20+

**Setup**:
```bash
cd frontend
npm install
```

**Development**:
```bash
cd frontend
npm run dev  # Starts dev server on http://localhost:3000
```

**Building** (takes ~30 seconds):
```bash
cd frontend
npm run build
```

**Linting**:
```bash
cd frontend
npm run lint              # ESLint with Next.js config
npx tsc --noEmit          # TypeScript type checking
```

**Known Issues**:
- The frontend has a `GhostInTheBrowser` component that triggers a React useEffect warning - this is a cosmetic issue and does not affect functionality
- The retro DOS/ASCII aesthetic intentionally uses monospace fonts and terminal-style UI

### Backend (Node.js/Express)

**Prerequisites**: Node.js 20+, npm 10+

**Setup**:
```bash
cd backend
npm install
```

**Running**:
```bash
cd backend
npm run dev  # Starts server on http://localhost:4000
```

**Building/Compiling**:
```bash
cd backend
npm run build  # Compiles TypeScript to JavaScript
```

**Testing**:
```bash
cd backend
npm test
```

### C++ SDK (Optional)

**Prerequisites**: CMake 3.21+, C++20 compiler with SIMD support

**Building**:
```bash
cd cpp_sdk
mkdir -p build && cd build
cmake ..
make
```

**Testing**:
```bash
cd cpp_sdk/build
ctest --output-on-failure
```

**Note**: The C++ SDK is for advanced use cases and is not required for core development.

## Important Notes

### Trust These Instructions
The information in this file has been validated through extensive testing. **Do not re-explore** the repository to verify build commands unless you find evidence that the information here is incorrect. The build instructions here represent tested, working commands.

### Avoid Common Pitfalls
1. **Never run `cargo test --all`** - This will fail due to known issues in `rust/` SDK
2. **Always use `--legacy-peer-deps`** with npm commands in TypeScript SDK
3. **Python tests require Python 3.12+** - Earlier versions will fail
4. **Solana CLI is optional** - Core programs build and test without it

### Repository Size and Performance
- Full repository: ~4.3GB, 21,933 files
- Core Rust programs: Build ~10s, test ~10s (incremental ~1s)
- TypeScript SDK: Build ~5s
- Frontend: Build ~30s, dev server ~5s
- Backend: Build ~10s

### When in Doubt
If a build fails, check if you're using the correct working directory and whether you've followed the instructions exactly. Common issues include:
- Using `cargo test --all` instead of specific packages
- Forgetting `--legacy-peer-deps` with npm
- Not having Python 3.12+ for Python SDK

## Additional Resources

### Documentation
- Full Technical Whitepaper: `docs/whitepaper/aeamcp-comprehensive-whitepaper.pdf`
- Dual-Token Economics: `docs/DUAL_TOKENOMICS.md`
- Security Audits: `docs/audits/` and `AUDIT_SUMMARY.md`
- Implementation Plan: `docs/solana-ai-registries-implementation-plan.md`

### Protocol Specifications
- AEA (Autonomous Economic Agent): Fetch.ai framework
- A2A (Agent-to-Agent): Google protocol
- MCP (Model Context Protocol): Anthropic specification

### Getting Help
- Check GitHub Issues for known bugs
- Review CI/CD workflows in `.github/workflows/`
- Examine test files in `tests/` for usage examples
