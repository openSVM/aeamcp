# Solana AI Registries Python SDK

[![PyPI version](https://badge.fury.io/py/solana-ai-registries.svg)](https://badge.fury.io/py/solana-ai-registries)
[![Python 3.8+](https://img.shields.io/badge/python-3.8+-blue.svg)](https://www.python.org/downloads/)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![Coverage](https://codecov.io/gh/openSVM/aeamcp/branch/main/graph/badge.svg)](https://codecov.io/gh/openSVM/aeamcp)

Python client library for interacting with the Solana AI Registries - a decentralized platform for agent and MCP server registration on the Solana blockchain.

## Features

- **Agent Registry**: Register, update, and manage autonomous AI agents
- **MCP Server Registry**: Register and manage Model Context Protocol servers  
- **Payment Integration**: Support for prepay, pay-as-you-go, and streaming payments
- **Type Safety**: Full type hints and dataclass-based APIs
- **Async/Await**: Modern async Python patterns throughout
- **Comprehensive Testing**: >90% test coverage with integration tests

## Installation

```bash
pip install solana-ai-registries
```

For development:
```bash
pip install solana-ai-registries[dev]
```

## Quick Start

### Initialize Client

```python
import asyncio
from solana_ai_registries import SolanaAIRegistriesClient, AgentRegistry
from solana.keypair import Keypair

async def main():
    # Initialize client (devnet)
    client = SolanaAIRegistriesClient("https://api.devnet.solana.com")
    agent_registry = AgentRegistry(client)
    
    # Your operations here
    
if __name__ == "__main__":
    asyncio.run(main())
```

### Register an Agent

```python
from solana_ai_registries import AgentRegistry, ServiceEndpoint

# Register new agent
owner_keypair = Keypair()
signature = await agent_registry.register_agent(
    agent_id="my-trading-agent",
    name="AI Trading Agent",
    description="Autonomous cryptocurrency trading agent",
    agent_version="1.0.0",
    owner=owner_keypair,
    service_endpoints=[
        ServiceEndpoint(
            protocol="https",
            url="https://api.myagent.com/v1",
            description="REST API endpoint"
        )
    ],
    tags=["trading", "crypto", "autonomous"]
)
print(f"Agent registered: {signature}")
```

### Register an MCP Server

```python
from solana_ai_registries import McpServerRegistry

mcp_registry = McpServerRegistry(client)
signature = await mcp_registry.register_server(
    server_id="weather-server",
    name="Weather Data Server", 
    endpoint_url="https://weather.example.com/mcp",
    server_version="2.1.0",
    owner=owner_keypair,
    tags=["weather", "data", "api"]
)
```

### Payment Operations

```python
from solana_ai_registries import PaymentManager
from decimal import Decimal

payment_manager = PaymentManager(client)

# Create prepaid escrow
await payment_manager.create_prepay_escrow(
    service_provider=provider_pubkey,
    amount=Decimal("100.0"),  # 100 A2AMPL tokens
    payer=payer_keypair
)

# Pay-as-you-go payment
await payment_manager.pay_per_usage(
    service_provider=provider_pubkey,
    usage_fee=Decimal("1.0"),  # 1 A2AMPL per usage
    payer=payer_keypair
)

# Streaming payments
async for payment in payment_manager.create_payment_stream(
    service_provider=provider_pubkey,
    rate_per_second=Decimal("0.1"),  # 0.1 A2AMPL per second
    payer=payer_keypair,
    duration_seconds=3600  # 1 hour
):
    print(f"Payment sent: {payment}")
```

## API Reference

### Core Classes

- **`SolanaAIRegistriesClient`**: Low-level RPC client and transaction builder
- **`AgentRegistry`**: High-level agent registry operations
- **`McpServerRegistry`**: High-level MCP server registry operations  
- **`PaymentManager`**: Payment flow management
- **`IdlLoader`**: Dynamic IDL loading and type generation

### Data Types

- **`AgentRegistryEntry`**: Complete agent registry data
- **`McpServerRegistryEntry`**: Complete MCP server registry data
- **`ServiceEndpoint`**: Agent service endpoint definition
- **`McpCapabilities`**: MCP server capabilities summary
- **`PaymentDetails`**: Payment transaction information

### Constants

All program constants are available in `solana_ai_registries.constants`:

```python
from solana_ai_registries.constants import (
    MAX_AGENT_ID_LEN,
    A2AMPL_TOKEN_MINT_DEVNET,
    AGENT_REGISTRATION_FEE,
    a2ampl_to_base_units,
)
```

## Development

### Setup

```bash
git clone https://github.com/openSVM/aeamcp.git
cd aeamcp/python
pip install -e .[dev]
```

### Testing

```bash
# Unit tests only
pytest tests/unit -v

# Integration tests (requires devnet)
pytest tests/integration -m devnet -v

# All tests with coverage
pytest --cov=solana_ai_registries
```

### Code Quality

```bash
# Format code
black .
isort .

# Type checking
mypy .

# Linting
flake8 .
```

## Configuration

### Environment Variables

```bash
export SOLANA_RPC_URL=https://api.devnet.solana.com
export A2AMPL_TOKEN_MINT=A2AMPLyncKHwfSnwRNsJ2qsjsetgo9fGkP8YZPsDZ9mE
```

### Network Support

- **Mainnet**: `https://api.mainnet-beta.solana.com`
- **Devnet**: `https://api.devnet.solana.com` 
- **Testnet**: `https://api.testnet.solana.com`

## Error Handling

```python
from solana_ai_registries.exceptions import (
    ValidationError,
    AgentExistsError,
    InsufficientFundsError,
    TransactionError,
)

try:
    await agent_registry.register_agent(...)
except AgentExistsError:
    print("Agent already registered")
except ValidationError as e:
    print(f"Validation failed: {e.message}")
except InsufficientFundsError as e:
    print(f"Insufficient funds: {e.required} required, {e.available} available")
except TransactionError as e:
    print(f"Transaction failed: {e.message}")
    if e.signature:
        print(f"Signature: {e.signature}")
```

## Examples

Complete examples are available in the `examples/` directory:

- `examples/agent_lifecycle.py` - Agent registration and management
- `examples/mcp_server_setup.py` - MCP server registration
- `examples/payment_flows.py` - All payment flow types
- `examples/error_handling.py` - Error handling patterns

## Documentation

- **Implementation Guidelines**: [`docs/PYTHON_SDK_IMPLEMENTATION_GUIDELINES.md`](../docs/PYTHON_SDK_IMPLEMENTATION_GUIDELINES.md)
- **Quick Start Guide**: [`docs/PYTHON_SDK_QUICK_START.md`](../docs/PYTHON_SDK_QUICK_START.md)
- **API Reference**: [`docs/sdk_refs/python_sdk_references.md`](../docs/sdk_refs/python_sdk_references.md)

## Contributing

1. Fork the repository
2. Create a feature branch: `git checkout -b feature/my-feature`
3. Make changes and add tests
4. Run the test suite: `pytest`
5. Submit a pull request

### Development Guidelines

- Follow PEP 8 style guidelines
- Add type hints to all public functions
- Write comprehensive docstrings
- Maintain >90% test coverage
- Update documentation for API changes

## License

This project is licensed under the MIT License - see the [LICENSE](../LICENSE) file for details.

## Support

- **Issues**: [GitHub Issues](https://github.com/openSVM/aeamcp/issues)
- **Documentation**: [AEAMCP Docs](https://aeamcp.readthedocs.io)
- **Discord**: [AEAMCP Community](https://discord.gg/aeamcp)

## Related Projects

- **Rust SDK**: [`rust/`](../rust/)
- **TypeScript SDK**: [`typescript/`](../typescript/)
- **Go SDK**: [`go/`](../go/)
- **On-chain Programs**: [`programs/`](../programs/)

---

Built with ❤️ by the AEAMCP Team