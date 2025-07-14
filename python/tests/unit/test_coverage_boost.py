"""
Additional coverage tests for payments and MCP modules.
"""

from solana_ai_registries.payments import PaymentManager
from solana_ai_registries.mcp import McpServerRegistry
from solana_ai_registries.agent import AgentRegistry


class TestPaymentManagerBasics:
    """Basic tests for PaymentManager to improve coverage."""

    def test_payment_manager_init_devnet(self):
        """Test PaymentManager initialization for devnet."""
        from solana_ai_registries.client import SolanaAIRegistriesClient

        client = SolanaAIRegistriesClient()
        manager = PaymentManager(client, use_mainnet=False)

        assert manager.client == client

    def test_payment_manager_init_mainnet(self):
        """Test PaymentManager initialization for mainnet."""
        from solana_ai_registries.client import SolanaAIRegistriesClient

        client = SolanaAIRegistriesClient()
        manager = PaymentManager(client, use_mainnet=True)

        assert manager.client == client

    def test_get_token_mint_devnet(self):
        """Test getting token mint for devnet."""
        from solana_ai_registries.client import SolanaAIRegistriesClient

        client = SolanaAIRegistriesClient()
        manager = PaymentManager(client, use_mainnet=False)

        assert manager.token_mint is not None

    def test_get_token_mint_mainnet(self):
        """Test getting token mint for mainnet."""
        from solana_ai_registries.client import SolanaAIRegistriesClient

        client = SolanaAIRegistriesClient()
        manager = PaymentManager(client, use_mainnet=True)

        assert manager.token_mint is not None


class TestMcpServerRegistryBasics:
    """Basic tests for McpServerRegistry to improve coverage."""

    def test_mcp_registry_init(self):
        """Test McpServerRegistry initialization."""
        from solana_ai_registries.client import SolanaAIRegistriesClient

        client = SolanaAIRegistriesClient()
        registry = McpServerRegistry(client)

        assert registry.client == client


class TestAgentRegistryBasics:
    """Basic tests for AgentRegistry to improve coverage."""

    def test_agent_registry_init(self):
        """Test AgentRegistry initialization."""
        from solana_ai_registries.client import SolanaAIRegistriesClient

        client = SolanaAIRegistriesClient()
        registry = AgentRegistry(client)

        assert registry.client == client


class TestConstantsCoverage:
    """Test constants module for additional coverage."""

    def test_import_constants(self):
        """Test importing constants."""
        from solana_ai_registries.constants import (
            MAX_AGENT_ID_LEN,
            MAX_AGENT_NAME_LEN,
            A2AMPL_BASE_UNIT,
        )

        assert MAX_AGENT_ID_LEN > 0
        assert MAX_AGENT_NAME_LEN > 0
        assert A2AMPL_BASE_UNIT > 0

    def test_validation_functions(self):
        """Test validation functions."""
        from solana_ai_registries.constants import validate_string_length, validate_url

        # These should not raise
        validate_string_length("test", 10, "test field")
        validate_url("https://example.com", "test url")


class TestExceptionsCoverage:
    """Test exceptions module for additional coverage."""

    def test_exception_creation(self):
        """Test creating exceptions."""
        from solana_ai_registries.exceptions import (
            SolanaAIRegistriesError,
            AgentNotFoundError,
            McpServerNotFoundError,
        )

        base_error = SolanaAIRegistriesError("Base error")
        assert str(base_error) == "Base error"

        agent_error = AgentNotFoundError("test_agent", "test_owner")
        assert "test_agent" in str(agent_error)

        mcp_error = McpServerNotFoundError("test_server", "test_owner")
        assert "test_server" in str(mcp_error)
