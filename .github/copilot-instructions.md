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
npm run dev  # Starts dev server with Turbopack
```

**Building**:
```bash
cd frontend
npm run build  # Production build
npm start      # Run production server
```

**Linting**:
```bash
cd frontend
npm run lint  # Next.js ESLint
```

### Backend (Node.js/Express)

**Prerequisites**: Node.js 18+

**Setup**:
```bash
cd backend
npm install
```

**Development**:
```bash
cd backend
npm run dev    # Nodemon with ts-node
npm run build  # TypeScript compilation
npm start      # Run compiled JS
```

**Testing**:
```bash
cd backend
npm test
```

## GitHub Actions CI/CD

The repository has comprehensive CI workflows that you should understand:

### Rust CI (`.github/workflows/rust-ci.yml`)
- Triggers on: Changes to `rust/**`
- Runs on: Ubuntu latest with Rust stable and beta
- Steps: Format check, build (no-features and all-features), test, package check
- **Important**: Tests individual Rust SDK features (pyg, prepay, stream)

### Python CI (`.github/workflows/python-ci.yml`)
- Triggers on: Changes to `python/**`
- Runs on: Ubuntu latest with Python 3.12
- Jobs: test (format, type check, lint, unit tests), integration-tests (devnet), docs, security
- **Important**: Integration tests have retry logic for devnet instability
- Uses compatibility shim for pytest-xprocess in all jobs

### TypeScript CI (`.github/workflows/typescript-ci.yml`)
- Triggers on: Changes to `sdk/typescript/**`
- Runs on: Ubuntu latest with Node 18, 20, 22
- Steps: Format check, lint, type check, build, test (disabled), package check
- **Important**: Uses `npm ci --legacy-peer-deps` for installation

### Other Workflows
- `cpp_sdk.yml` - C++ SDK (separate component)
- `publish-rust-sdk.yml` - Publishes Rust SDK to crates.io
- `publish-typescript-sdk.yml` - Publishes TS SDK to npm
- `python-publish.yml` - Publishes Python SDK to PyPI

## Understanding the Protocol and Architecture

### Essential Documentation

Before making significant changes, familiarize yourself with these key documents:

**Core Specifications**:
- `docs/whitepaper/aeamcp-comprehensive-whitepaper.pdf` - Complete technical whitepaper covering architecture, tokenomics, security, and vision
- `docs/solana-ai-registries-implementation-plan.md` - Detailed implementation plan for native Solana programs
- `docs/DUAL_TOKENOMICS.md` - Comprehensive analysis of the AEA/SVMAI dual-token model
- `AUDIT_SUMMARY.md` - Security audit summary with critical findings and recommendations

**Protocol Compliance**:
- **A2A (Agent-to-Agent)**: Google's protocol for agent communication and discovery
- **AEA (Autonomous Economic Agent)**: Fetch.ai's framework for economic agent coordination
- **MCP (Model Context Protocol)**: Anthropic's protocol for LLM tool/resource discovery

**Architecture Documentation**:
- `docs/CROSS_CHAIN_BRIDGE_ARCHITECTURE.md` - Cross-chain expansion strategy
- `docs/GIT_REGISTRATION_ARCHITECTURE.md` - Git-based registration system for MCP servers
- `docs/TOKEN_INTEGRATION_ARCHITECTURE.md` - Token integration and economic flows

### Key Concepts to Understand

**Hybrid Data Model**: 
- On-chain: Agent IDs, ownership, endpoints, capability flags, cryptographic hashes
- Off-chain: Detailed metadata, full schemas, extended documentation (IPFS/Arweave)
- Integrity: Verified through on-chain hashes and event emission

**Program Derived Addresses (PDAs)**:
- Deterministic account generation using seeds (e.g., `[AGENT_REGISTRY_PDA_SEED, agent_id]`)
- Enables predictable agent coordination without centralized coordination
- Critical for security - only program can sign for PDA accounts

**Event-Driven Design**:
- All state changes emit structured program logs (JSON format)
- Enables off-chain indexing for scalable querying
- Events: AgentRegistered, AgentUpdated, AgentStatusChanged, AgentDeregistered (similar for MCP)

**Solana-Specific Optimizations**:
- Rent-exemption for permanent account storage
- Parallel transaction processing for multiple agents
- Low transaction costs (<$0.001) enable micro-economic interactions
- 400ms block times for near-real-time coordination

## Common Issues and Workarounds

### 1. Rust Build Failures
**Problem**: `cargo test --all` or `cargo build --all` fails
**Solution**: Always use `cargo test --package solana-a2a --package solana-mcp` to test only working programs

### 2. Python pytest-xprocess Error
**Problem**: `ModuleNotFoundError: No module named 'pytest_xprocess'`
**Solution**: Create the compatibility shim as shown in Python CI workflow

### 3. Solana CLI Not Found
**Problem**: `solana: command not found` when running build.sh
**Solution**: Install Solana CLI or only build/test core programs which don't require it:
```bash
cargo build --package solana-a2a --package solana-mcp
```

### 4. TypeScript Peer Dependency Conflicts
**Problem**: npm install fails with peer dependency errors
**Solution**: Always use `npm ci --legacy-peer-deps` or `npm install --legacy-peer-deps`

### 5. Unused Variable Warnings in Rust
**Problem**: Warnings about `clock_info`, `owner_token_account`, unused imports
**Solution**: These are known and acceptable warnings in development. They don't prevent successful builds.

## Key Configuration Files

- **Rust**: `Cargo.toml` (workspace), `programs/*/Cargo.toml` (individual programs)
- **Anchor**: `Anchor.toml` (Solana program configuration, program IDs for devnet)
- **Python**: `python/pyproject.toml` (all Python config including black, isort, mypy, pytest)
- **TypeScript SDK**: `sdk/typescript/package.json`, `sdk/typescript/tsconfig.json`
- **Frontend**: `frontend/package.json`, `frontend/next.config.js` (likely)
- **Backend**: `backend/package.json`, `backend/tsconfig.json`

## State Structure and Data Models

### Agent Registry Entry (AgentRegistryEntryV1)

Core fields stored on-chain:
- `owner_authority`: Pubkey controlling the agent entry
- `agent_id`: Unique identifier (string, max 64 chars)
- `name`: Display name (max 128 chars)
- `description`: Brief description (max 512 chars)
- `agent_version`: Version string (semver recommended)
- `service_endpoints`: Array of protocol/URL pairs for agent communication
- `skills`: Array of agent skills with IDs, names, description hashes, and tags
- `status`: Active, Inactive, Deprecated (u8 enum)
- `capabilities_flags`: Bitflags for streaming, async, etc.
- `extended_metadata_uri`: URI to off-chain detailed metadata (IPFS/Arweave)
- `registration_timestamp`: Unix timestamp
- `last_update_timestamp`: Unix timestamp

Account size: ~2.5KB optimized for rent-exemption (~0.02 SOL)

### MCP Server Registry Entry (McpServerRegistryEntryV1)

Core fields stored on-chain:
- `owner_authority`: Pubkey controlling the server entry
- `server_id`: Unique identifier (max 64 chars)
- `name`: Display name (max 128 chars)
- `server_version`: Version string
- `service_endpoint`: Primary endpoint URL
- `capabilities`: Boolean flags for resources, tools, prompts support
- `onchain_tool_definitions`: Array of tool names with hashes and tags
- `onchain_resource_definitions`: Array of URI patterns with hashes
- `onchain_prompt_definitions`: Array of prompt templates
- `full_capabilities_uri`: URI to complete off-chain capabilities
- `status`: Active, Inactive, Maintenance, Deprecated (u8 enum)

Account size: ~2.2KB optimized for rent-exemption

### Important Validation Rules

**Agent Registry**:
- Agent ID: Alphanumeric + hyphens/underscores only
- Max 10 service endpoints per agent
- Max 20 skills per agent
- Max 20 tags total across all skills
- All URLs must be valid HTTPS (or valid protocol for endpoints)

**MCP Server Registry**:
- Server ID: Alphanumeric + hyphens/underscores only
- Max 50 tool definitions on-chain
- Max 50 resource definitions on-chain
- Max 20 prompt definitions on-chain
- Service endpoint must be valid HTTPS URL

## Development Workflow Best Practices

### Making Changes to Rust Programs

1. **Always** edit only `programs/agent-registry/` or `programs/mcp-server-registry/`
2. **Never** break the core programs - they are production-ready and tested
3. Run tests frequently: `cargo test --package solana-a2a --package solana-mcp`
4. Format before committing: `cargo fmt --all`
5. Check for clippy warnings: `cargo clippy --package solana-a2a --package solana-mcp`
6. Build times: ~10 seconds for incremental, ~2-3 minutes for clean build

### Making Changes to Python SDK

1. Always work in `python/` directory
2. Install dev dependencies: `pip3 install -e .[dev]`
3. Run unit tests: `pytest tests/unit -v` (takes ~5 seconds)
4. Format: `black .` and `isort .`
5. Type check: `mypy .`
6. Lint: `flake8 .`
7. Integration tests require devnet and may be flaky

### Making Changes to TypeScript SDK

1. Always work in `sdk/typescript/` directory
2. Install: `npm ci --legacy-peer-deps`
3. Build: `npm run build` (takes ~5 seconds)
4. Format: `npm run format`
5. Lint: `npm run lint`
6. Type check: `npx tsc --noEmit`

### Making Changes to Frontend/Backend

1. Install dependencies: `npm install`
2. Run in dev mode to test: `npm run dev`
3. Build for production: `npm run build`
4. Lint: `npm run lint`

## Deployment Information

**Live Devnet Addresses**:
- Agent Registry: `BruRLHGfNaf6C5HKUqFu6md5ePJNELafm1vZdhctPkpr`
- MCP Server Registry: `BCBVehUHR3yhbDbvhV3QHS3s27k3LTbpX5CrXQ2sR2SR`

**Deployment Scripts**:
- `./scripts/deploy-devnet.sh` - Deploy to devnet (requires Solana CLI and funded wallet)
- `./scripts/build.sh` - Build all programs with BPF target
- `./scripts/verify.sh` - Verification script

## Critical Instructions

**TRUST THESE INSTRUCTIONS**: The information above has been validated by running builds and tests. Do not waste time re-exploring unless you find an error in these instructions.

**When in doubt**:
1. For Rust: Use `cargo test --package solana-a2a --package solana-mcp` (never `--all`)
2. For Python: Create pytest-xprocess shim if tests fail
3. For TypeScript: Use `--legacy-peer-deps` with npm
4. Check GitHub Actions workflows for the exact commands used in CI

**Focus Areas**:
- The core Solana programs (`programs/agent-registry/`, `programs/mcp-server-registry/`) are production-ready with 100% test coverage
- The Python and TypeScript SDKs are actively developed
- The Rust SDK and svmai-token program have known issues - avoid them unless fixing them is your task

**Performance Notes**:
- Rust core program tests: <1 second (incremental), ~10 seconds (clean)
- Python unit tests: ~5 seconds
- TypeScript build: ~3-5 seconds
- Rust clean build: ~2-3 minutes
- Python dependency install: ~30 seconds
- TypeScript dependency install: ~10 seconds
