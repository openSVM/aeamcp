# Python SDK Quick Start Guide

## Overview

This guide provides a condensed, developer-friendly overview of implementing the Python SDK for Solana AI Registries. For complete details, see [`PYTHON_SDK_IMPLEMENTATION_GUIDELINES.md`](./PYTHON_SDK_IMPLEMENTATION_GUIDELINES.md).

## Prerequisites

- Python 3.9+
- Solana CLI tools
- Access to Solana devnet
- Basic understanding of Solana programs and transactions

## Quick Setup

### 1. Project Structure

```bash
mkdir python && cd python
mkdir -p solana_ai_registries/{idl,tests/{unit,integration}}
touch solana_ai_registries/{__init__.py,client.py,agent.py,mcp.py,payments.py,idl.py,types.py,exceptions.py,constants.py}
```

### 2. Dependencies

**Core Dependencies:**
```bash
pip install solana[async] anchorpy typing-extensions httpx
```

**Development Dependencies:**
```bash
pip install pytest pytest-asyncio pytest-cov black isort mypy flake8
```

### 3. Configuration Files

**pyproject.toml** (minimal):
```toml
[project]
name = "solana-ai-registries"
version = "0.1.0"
dependencies = [
    "solana[async]>=0.30.0",
    "anchorpy>=0.18.0",
    "typing-extensions>=4.0.0",
]
```

**pytest.ini**:
```ini
[tool:pytest]
markers = 
    unit: fast unit tests
    integration: integration tests requiring devnet
    devnet: tests specifically for devnet environment
```

## Implementation Checklist

### ✅ Task 4.1: Client Module (`client.py`)
- [ ] `SolanaAIRegistriesClient` class with async RPC methods
- [ ] `TransactionBuilder` for type-safe transaction construction
- [ ] Error handling with custom exceptions
- [ ] Integration tests against devnet
- [ ] Complete API documentation

**Key Functions:**
- `get_agent_registry_entry()`
- `get_mcp_server_registry_entry()`
- `send_transaction()`
- `get_account_info()`

### ✅ Task 4.2: Registry Modules (`agent.py`, `mcp.py`)
- [ ] `AgentRegistry` class with full CRUD operations
- [ ] `McpServerRegistry` class with full CRUD operations
- [ ] Unit tests for success and failure paths
- [ ] Type-safe data structures using dataclasses
- [ ] Proper error handling and validation

**Key Functions:**
- `register_agent()` / `register_server()`
- `update_agent()` / `update_server()`
- `get_agent()` / `get_server()`
- `deregister_agent()` / `deregister_server()`

### ✅ Task 4.3: Payments Module (`payments.py`)
- [ ] `PaymentManager` class with all payment flows
- [ ] Prepay escrow functionality
- [ ] Pay-as-you-go transactions
- [ ] Streaming payments with asyncio
- [ ] Edge case handling (insufficient funds, etc.)

**Key Functions:**
- `create_prepay_escrow()`
- `pay_per_usage()`
- `create_payment_stream()`
- `get_balance()`

### ✅ Task 4.4: IDL Module (`idl.py`)
- [ ] `IdlLoader` class for dynamic IDL loading
- [ ] Type generation from IDL structures
- [ ] Runtime validation of IDL integrity
- [ ] Support for multiple program IDLs

**Key Functions:**
- `load_idl()`
- `generate_types()`
- `validate_idl()`

### ✅ Task 4.5: Integration Tests
- [ ] Complete test suite in `tests/integration/test_integration.py`
- [ ] Tests run against live devnet
- [ ] Code coverage >90%
- [ ] Reproducible test results

**Test Categories:**
- Agent lifecycle (register → update → deregister)
- MCP server lifecycle  
- Payment flows (all three types)
- Error handling and edge cases

## Development Workflow

### 1. Setup Development Environment

```bash
# Clone and setup
git clone <repo-url>
cd aeamcp/python
pip install -e .[dev]

# Setup pre-commit hooks
pre-commit install
```

### 2. Development Commands

```bash
# Run tests
pytest tests/unit -v                    # Unit tests only
pytest tests/integration -m devnet -v   # Integration tests
pytest --cov=solana_ai_registries       # With coverage

# Code quality
black .                                 # Format code
isort .                                 # Sort imports
flake8 .                               # Lint code
mypy .                                 # Type checking
```

### 3. Testing Against Devnet

```bash
# Set environment
export SOLANA_RPC_URL=https://api.devnet.solana.com

# Run integration tests
pytest tests/integration -m devnet -v
```

## Code Templates

### Basic Client Usage
```python
from solana_ai_registries import SolanaAIRegistriesClient, AgentRegistry
from solana.keypair import Keypair

# Initialize client
client = SolanaAIRegistriesClient("https://api.devnet.solana.com")
agent_registry = AgentRegistry(client)

# Register agent
owner = Keypair()
signature = await agent_registry.register_agent(
    agent_id="my-agent",
    name="My AI Agent",
    description="An autonomous trading agent",
    owner=owner
)
```

### Error Handling Pattern
```python
from solana_ai_registries.exceptions import (
    AgentExistsError,
    InsufficientFundsError,
    ValidationError
)

try:
    await agent_registry.register_agent(...)
except AgentExistsError:
    print("Agent already registered")
except ValidationError as e:
    print(f"Validation failed: {e}")
except Exception as e:
    print(f"Unexpected error: {e}")
```

### Payment Flow Example
```python
from solana_ai_registries import PaymentManager
from decimal import Decimal

payment_manager = PaymentManager(client)

# Prepay escrow
await payment_manager.create_prepay_escrow(
    service_provider=provider_pubkey,
    amount=Decimal("100.0"),  # 100 A2AMPL
    payer=payer_keypair
)

# Pay-as-you-go
await payment_manager.pay_per_usage(
    service_provider=provider_pubkey,
    usage_fee=Decimal("1.0"),  # 1 A2AMPL per usage
    payer=payer_keypair
)
```

## Constants Reference

All constants from [`sdk/constants.md`](../sdk/constants.md) must be implemented:

```python
# constants.py
MAX_AGENT_ID_LEN = 64
MAX_AGENT_NAME_LEN = 128
MAX_AGENT_DESCRIPTION_LEN = 512

A2AMPL_DECIMALS = 9
A2AMPL_BASE_UNIT = 1_000_000_000
A2AMPL_TOKEN_MINT_DEVNET = "A2AMPLyncKHwfSnwRNsJ2qsjsetgo9fGkP8YZPsDZ9mE"

AGENT_REGISTRATION_FEE = 100_000_000_000  # 100 A2AMPL in base units
```

## Publishing Checklist

### Pre-publish Verification
- [ ] All tests pass locally
- [ ] Code coverage ≥ 90%
- [ ] Type checking passes (mypy)
- [ ] Linting passes (flake8)
- [ ] Documentation complete
- [ ] Version bumped in pyproject.toml

### CI/CD Pipeline
- [ ] GitHub Actions workflow configured
- [ ] PyPI publishing workflow setup
- [ ] Tag format: `sdk/py/v0.1.0`
- [ ] Secrets configured: `PYPI_TOKEN`

### Release Process
```bash
# Create release tag
git tag sdk/py/v0.1.0
git push origin sdk/py/v0.1.0

# GitHub Actions will automatically:
# 1. Run all tests
# 2. Build package
# 3. Publish to PyPI
```

## Support Resources

### Documentation
- **Complete Guidelines:** [`PYTHON_SDK_IMPLEMENTATION_GUIDELINES.md`](./PYTHON_SDK_IMPLEMENTATION_GUIDELINES.md)
- **API Reference:** [`docs/sdk_refs/python_sdk_references.md`](./sdk_refs/python_sdk_references.md)
- **Constants:** [`sdk/constants.md`](../sdk/constants.md)

### External Resources
- **Solana Python:** https://michaelhly.github.io/solana-py/
- **AnchorPy:** https://kevinheavey.github.io/anchorpy/
- **pytest:** https://docs.pytest.org/
- **Type Hints:** https://docs.python.org/3/library/typing.html

### Program References
- **Agent Registry:** [`programs/agent-registry/src/instruction.rs`](../programs/agent-registry/src/instruction.rs)
- **MCP Server Registry:** [`programs/mcp-server-registry/src/instruction.rs`](../programs/mcp-server-registry/src/instruction.rs)
- **IDL Files:** [`idl/`](../idl/)

---

**Next Steps:**
1. Set up development environment
2. Start with Task 4.1 (Client module)
3. Follow TDD approach: write tests first, then implementation
4. Regular commits and code reviews
5. Integration testing against devnet

For detailed implementation guidance, see the complete [`PYTHON_SDK_IMPLEMENTATION_GUIDELINES.md`](./PYTHON_SDK_IMPLEMENTATION_GUIDELINES.md) document.