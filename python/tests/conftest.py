"""
Pytest configuration and shared fixtures for Solana AI Registries SDK tests.

This module provides common test fixtures and configuration used across
unit and integration tests.
"""

import asyncio
from typing import Any, AsyncGenerator, Dict
from unittest.mock import AsyncMock, Mock

import pytest
from solders.keypair import Keypair
from solders.pubkey import Pubkey

from solana_ai_registries import SolanaAIRegistriesClient
from solana_ai_registries.constants import DEFAULT_DEVNET_RPC
from solana_ai_registries.types import AgentRegistryEntry, McpServerRegistryEntry


@pytest.fixture(scope="session")  # type: ignore[misc]
def event_loop() -> Any:
    """Create an instance of the default event loop for the test session."""
    loop = asyncio.get_event_loop_policy().new_event_loop()
    yield loop
    loop.close()


@pytest.fixture
def test_keypair() -> Keypair:
    """Generate a test keypair for transactions."""
    return Keypair()


@pytest.fixture
def test_pubkey() -> Pubkey:
    """Generate a test public key."""
    return Keypair().pubkey()


@pytest.fixture
def mock_client() -> Mock:
    """Create a mock Solana AI Registries client."""
    client = Mock(spec=SolanaAIRegistriesClient)
    client.get_agent_registry_entry = AsyncMock()
    client.get_mcp_server_registry_entry = AsyncMock()
    client.send_transaction = AsyncMock()
    client.get_account_info = AsyncMock()
    client.get_balance = AsyncMock()
    return client


@pytest.fixture
async def devnet_client() -> AsyncGenerator[SolanaAIRegistriesClient, None]:
    """Create a real client connected to devnet for integration tests."""
    client = SolanaAIRegistriesClient()
    yield client
    # Cleanup if needed - client currently has no close method
    # await client.close()


@pytest.fixture
def mock_agent_data() -> Dict[str, Any]:
    """Mock agent registry data for testing."""
    return {
        "agent_id": "test-agent-001",
        "name": "Test Agent",
        "description": "An AI agent for testing purposes",
        "agent_version": "1.0.0",
        "owner": str(Keypair().pubkey()),
        "status": 1,  # ACTIVE
        "provider_name": "Test Provider",
        "provider_url": "https://test-provider.com",
        "documentation_url": "https://docs.test-provider.com",
        "service_endpoints": [
            {
                "protocol": "https",
                "url": "https://api.test-agent.com/v1",
                "description": "REST API endpoint",
            }
        ],
        "capabilities_flags": 0,
        "supported_input_modes": ["text", "voice"],
        "supported_output_modes": ["text", "audio"],
        "skills": [
            {
                "skill_id": "trading",
                "name": "Cryptocurrency Trading",
                "tags": ["crypto", "trading"],
                "metadata": {"risk_level": "medium"},
            }
        ],
        "security_info_uri": "https://security.test-agent.com",
        "aea_address": "test_aea_address",
        "economic_intent_summary": "Profit maximization through trading",
        "supported_aea_protocols_hash": None,
        "extended_metadata_uri": "https://metadata.test-agent.com",
        "tags": ["test", "trading", "ai"],
        "created_at": 1640995200,  # 2022-01-01 00:00:00 UTC
        "updated_at": 1640995200,
        "state_version": 1,
    }


@pytest.fixture
def mock_mcp_server_data() -> Dict[str, Any]:
    """Mock MCP server registry data for testing."""
    return {
        "server_id": "test-server-001",
        "name": "Test MCP Server",
        "server_version": "2.1.0",
        "endpoint_url": "https://mcp.test-server.com",
        "owner": str(Keypair().pubkey()),
        "status": 1,  # ACTIVE
        "capabilities_summary": "Weather data and forecasts",
        "capabilities": {
            "supports_tools": True,
            "supports_resources": True,
            "supports_prompts": False,
            "tool_count": 3,
            "resource_count": 2,
            "prompt_count": 0,
            "tools": [
                {
                    "name": "get_weather",
                    "description": "Get current weather for a location",
                    "tags": ["weather", "current"],
                    "input_schema": '{"location": "string"}',
                    "output_schema": '{"temperature": "number", "conditions": "string"}',
                }
            ],
            "resources": [
                {
                    "uri_pattern": "weather://current/{location}",
                    "name": "Current Weather",
                    "description": "Current weather data",
                    "tags": ["weather"],
                }
            ],
            "prompts": [],
        },
        "full_capabilities_uri": "https://capabilities.test-server.com",
        "tags": ["weather", "data", "test"],
        "created_at": 1640995200,
        "updated_at": 1640995200,
        "state_version": 1,
    }


@pytest.fixture
def mock_agent_entry(mock_agent_data: Dict[str, Any]) -> AgentRegistryEntry:
    """Create a mock AgentRegistryEntry instance."""
    return AgentRegistryEntry.from_account_data(mock_agent_data)


@pytest.fixture
def mock_mcp_server_entry(
    mock_mcp_server_data: Dict[str, Any],
) -> McpServerRegistryEntry:
    """Create a mock McpServerRegistryEntry instance."""
    return McpServerRegistryEntry.from_account_data(mock_mcp_server_data)


@pytest.fixture
def mock_transaction_signature() -> str:
    """Mock transaction signature for testing."""
    return "5j7XiLkBJbkzCqFbp8XjJ6Ci9k2YfRvB4Y6fJr8bNfQ9YmZrVs8P2V5zQqKpWqGrE8F4TtJzN7YzXvKgRrNfQ2"


@pytest.fixture
def mock_solana_account_info() -> Dict[str, Any]:
    """Mock Solana account info response."""
    return {
        "lamports": 1000000000,  # 1 SOL
        "owner": "11111111111111111111111111111111",
        "executable": False,
        "rentEpoch": 361,
        "data": ["", "base64"],
    }


@pytest.fixture
def mock_token_balance() -> Dict[str, Any]:
    """Mock token balance response."""
    return {
        "amount": "100000000000",  # 100 A2AMPL in base units
        "decimals": 9,
        "uiAmount": 100.0,
        "uiAmountString": "100.0",
    }


# Test markers for pytest
pytest_plugins = ["pytest_asyncio"]


def pytest_configure(config: Any) -> None:
    """Configure pytest with custom markers."""
    config.addinivalue_line(
        "markers", "unit: fast unit tests that don't require network"
    )
    config.addinivalue_line(
        "markers", "integration: integration tests requiring devnet"
    )
    config.addinivalue_line(
        "markers", "devnet: tests specifically for devnet environment"
    )
    config.addinivalue_line("markers", "slow: tests that take longer than 1 second")


@pytest.fixture(autouse=True)
def reset_environment_variables(monkeypatch: Any) -> None:
    """Reset environment variables for each test."""
    # Clear any environment variables that might affect tests
    monkeypatch.delenv("SOLANA_RPC_URL", raising=False)
    monkeypatch.delenv("A2AMPL_TOKEN_MINT", raising=False)


# Helper functions for tests
def assert_valid_signature(signature: str) -> None:
    """Assert that a signature is valid format."""
    assert isinstance(signature, str)
    assert len(signature) >= 87  # Minimum length for base58 signature
    assert len(signature) <= 88  # Maximum length for base58 signature


def assert_valid_pubkey(pubkey: str) -> None:
    """Assert that a public key is valid format."""
    assert isinstance(pubkey, str)
    assert len(pubkey) == 44  # Standard length for base58 public key
    # Verify it can be converted to Pubkey
    Pubkey.from_string(pubkey)
