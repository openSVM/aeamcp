# Copilot Agent Instructions for Solana AI Registries (aeamcp)

## Repository Overview

This is the **Solana AI Registries** project - a comprehensive on-chain registry system for autonomous AI agents and Model Context Protocol (MCP) servers on the Solana blockchain. The repository is ~4.3GB with 21,933 files, including a large set of npm dependencies.

**Core Purpose**: Provides two interconnected on-chain registries:
1. **Agent Registry** (`solana-a2a`) - Decentralized directory for autonomous agents following AEA and A2A paradigms
2. **MCP Server Registry** (`solana-mcp`) - Directory for Model Context Protocol compliant servers

**Key Technologies**:
- **Solana Programs**: Rust with Solana SDK v1.18 and Anchor Framework v0.29.0
- **SDKs**: Python 3.12+, TypeScript/Node 20+, Rust (client library)
- **Frontend**: Next.js 15 with React 19
- **Backend**: Node.js/TypeScript with Express

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
