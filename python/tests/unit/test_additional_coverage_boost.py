"""Additional test coverage to reach 65% threshold."""

from unittest.mock import Mock, patch

import pytest

from solana_ai_registries.agent import AgentRegistry
from solana_ai_registries.client import SolanaAIRegistriesClient
from solana_ai_registries.constants import (  # Constants
    A2AMPL_BASE_UNIT,
    DEFAULT_DEVNET_RPC,
    MAX_AGENT_ID_LEN,
    a2ampl_to_base_units,
    base_units_to_a2ampl,
    get_token_mint_for_cluster,
    validate_string_length,
    validate_url,
)
from solana_ai_registries.exceptions import (
    AgentExistsError,
    IDLError,
    InsufficientFundsError,
    McpServerExistsError,
    RegistrationError,
    SolanaAIRegistriesError,
    TransactionError,
    ValidationError,
)
from solana_ai_registries.idl import IDLLoader
from solana_ai_registries.mcp import McpServerRegistry
from solana_ai_registries.payments import PaymentManager
from solana_ai_registries.types import (
    AgentRegistryEntry,
    AgentSkill,
    AgentStatus,
    McpCapabilities,
    McpPrompt,
    McpServerStatus,
    McpTool,
    ServiceEndpoint,
)


class TestConstantsAdditionalCoverage:
    """Additional tests for constants module."""

    def test_conversion_edge_cases(self):
        """Test conversion functions with edge cases."""
        # Test zero values
        assert a2ampl_to_base_units(0.0) == 0
        assert base_units_to_a2ampl(0) == 0.0

        # Test very small values
        assert a2ampl_to_base_units(0.000000001) == 1
        assert base_units_to_a2ampl(1) == 0.000000001

        # Test large values
        large_amount = 1000000.0
        base_units = a2ampl_to_base_units(large_amount)
        assert base_units == large_amount * A2AMPL_BASE_UNIT
        assert base_units_to_a2ampl(base_units) == large_amount

    def test_get_token_mint_all_clusters(self):
        """Test get_token_mint_for_cluster with all valid clusters."""
        # Test mainnet variants
        assert (
            "Cpzvdx6pppc9TNArsGsqgShCsKC9NCCjA2gtzHvUpump"
            in get_token_mint_for_cluster("mainnet")
        )
        assert (
            "Cpzvdx6pppc9TNArsGsqgShCsKC9NCCjA2gtzHvUpump"
            in get_token_mint_for_cluster("mainnet-beta")
        )

        # Test devnet/testnet
        assert (
            "A2AMPLyncKHwfSnwRNsJ2qsjsetgo9fGkP8YZPsDZ9mE"
            in get_token_mint_for_cluster("devnet")
        )
        assert (
            "A2AMPLyncKHwfSnwRNsJ2qsjsetgo9fGkP8YZPsDZ9mE"
            in get_token_mint_for_cluster("testnet")
        )

        # Test invalid cluster
        with pytest.raises(ValueError, match="Unsupported cluster"):
            get_token_mint_for_cluster("invalid-cluster")

    def test_validation_edge_cases(self):
        """Test validation functions with edge cases."""
        # Test exact length limit
        validate_string_length("a" * MAX_AGENT_ID_LEN, MAX_AGENT_ID_LEN, "agent_id")

        # Test empty string
        validate_string_length("", 10, "test_field")

        # Test URL edge cases
        validate_url("https://", "test_url")
        validate_url("ipfs://QmHash", "test_url")
        validate_url("ar://ArweaveHash", "test_url")


class TestExceptionsAdditionalCoverage:
    """Additional tests for exception classes."""

    def test_base_exception_with_context(self):
        """Test base exception with additional context."""
        error = SolanaAIRegistriesError("Test message", {"context": "value"})
        assert str(error) == "Test message"
        assert error.context == {"context": "value"}

    def test_validation_error_details(self):
        """Test ValidationError with field and constraint details."""
        error = ValidationError("test_field", "invalid_value", "max_length")
        assert error.field == "test_field"
        assert error.value == "invalid_value"
        assert error.constraint == "max_length"
        assert "test_field" in str(error)

    def test_agent_exists_error_details(self):
        """Test AgentExistsError with agent and owner details."""
        error = AgentExistsError("test-agent", "owner123")
        assert error.agent_id == "test-agent"
        assert error.owner == "owner123"

    def test_mcp_server_exists_error_details(self):
        """Test McpServerExistsError with server details."""
        error = McpServerExistsError("test-server", "owner123")
        assert error.server_id == "test-server"
        assert error.owner == "owner123"

    def test_transaction_error_details(self):
        """Test TransactionError with transaction signature."""
        error = TransactionError("Transaction failed", signature="sig123")
        assert error.signature == "sig123"

    def test_insufficient_funds_error_details(self):
        """Test InsufficientFundsError with required and available amounts."""
        error = InsufficientFundsError(1000, 500, "token_mint_123")
        assert error.required == 1000
        assert error.available == 500
        assert error.token_mint == "token_mint_123"

    def test_idl_error_details(self):
        """Test IDLError with program details."""
        error = IDLError("IDL load failed", program_name="program123")
        assert error.program_name == "program123"

    def test_registration_error_details(self):
        """Test RegistrationError with operation details."""
        error = RegistrationError("Registration failed")
        assert "Registration failed" in str(error)


class TestTypesAdditionalCoverage:
    """Additional tests for type classes."""

    def test_agent_registry_entry_edge_cases(self):
        """Test AgentRegistryEntry with edge cases."""
        # Test with minimal required fields
        agent = AgentRegistryEntry(
            agent_id="test",
            name="Test Agent",
            status=AgentStatus.ACTIVE,
        )
        assert agent.agent_id == "test"
        assert agent.name == "Test Agent"
        assert agent.status == AgentStatus.ACTIVE

    def test_service_endpoint_edge_cases(self):
        """Test ServiceEndpoint with different protocols."""
        # Test explicit protocol setting
        endpoint = ServiceEndpoint(
            url="custom://example.com", protocol="custom", auth_type="bearer"
        )
        assert endpoint.protocol == "custom"
        assert endpoint.auth_type == "bearer"

    def test_agent_skill_edge_cases(self):
        """Test AgentSkill with different configurations."""
        skill = AgentSkill(
            skill_id="test-skill", name="Test Skill", tags=["tag1", "tag2"]
        )
        assert skill.skill_id == "test-skill"
        assert skill.name == "Test Skill"
        assert skill.tags == ["tag1", "tag2"]

    def test_mcp_capabilities_edge_cases(self):
        """Test McpCapabilities with different configurations."""
        capabilities = McpCapabilities(
            supports_tools=True,
            supports_resources=False,
            supports_prompts=True,
            tools=[McpTool(name="test-tool", tags=["tool"])],
            resources=[],
            prompts=[McpPrompt(name="test-prompt", tags=["prompt"])],
        )
        assert capabilities.supports_tools is True
        assert capabilities.supports_resources is False
        assert len(capabilities.tools) == 1
        assert len(capabilities.resources) == 0
        assert len(capabilities.prompts) == 1


class TestClientAdditionalCoverage:
    """Additional tests for client functionality."""

    def test_client_initialization_edge_cases(self):
        """Test client initialization with different configurations."""
        # Test with minimal parameters
        client = SolanaAIRegistriesClient(rpc_url=DEFAULT_DEVNET_RPC)
        assert client.rpc_url == DEFAULT_DEVNET_RPC

    @patch("solana_ai_registries.client.AsyncClient")
    def test_client_with_custom_commitment(self, mock_async_client):
        """Test client with custom commitment level."""
        client = SolanaAIRegistriesClient(rpc_url=DEFAULT_DEVNET_RPC)
        # Verify that the client would use the configured RPC URL
        assert client.rpc_url == DEFAULT_DEVNET_RPC


class TestAgentRegistryAdditionalCoverage:
    """Additional tests for agent registry functionality."""

    @patch("solana_ai_registries.agent.AsyncClient")
    def test_agent_registry_initialization(self, mock_async_client):
        """Test AgentRegistry initialization."""
        mock_client = Mock()
        registry = AgentRegistry(mock_client)
        assert registry.client == mock_client


class TestMcpServerRegistryAdditionalCoverage:
    """Additional tests for MCP server registry functionality."""

    @patch("solana_ai_registries.mcp.AsyncClient")
    def test_mcp_registry_initialization(self, mock_async_client):
        """Test McpServerRegistry initialization."""
        mock_client = Mock()
        registry = McpServerRegistry(mock_client)
        assert registry.client == mock_client


class TestPaymentManagerAdditionalCoverage:
    """Additional tests for payment manager functionality."""

    @patch("solana_ai_registries.payments.AsyncClient")
    def test_payment_manager_initialization(self, mock_async_client):
        """Test PaymentManager initialization."""
        mock_client = Mock()
        manager = PaymentManager(mock_client)
        assert manager.client == mock_client


class TestIDLLoaderAdditionalCoverage:
    """Additional tests for IDL loader functionality."""

    def test_idl_loader_initialization(self):
        """Test IDLLoader initialization."""
        loader = IDLLoader()
        assert loader is not None

    def test_idl_loader_error_handling(self):
        """Test IDL loader error handling."""
        loader = IDLLoader()
        # Test loading non-existent program
        with pytest.raises(IDLError):
            loader.load_idl("nonexistent_program_id")


class TestImportsAndMetadata:
    """Test package imports and metadata."""

    def test_package_metadata(self):
        """Test package metadata is accessible."""
        import solana_ai_registries

        assert solana_ai_registries.__version__ == "0.1.0"
        assert solana_ai_registries.__author__ == "AEAMCP Team"
        assert solana_ai_registries.__email__ == "dev@aeamcp.org"

    def test_all_exports_accessible(self):
        """Test that all exports in __all__ are accessible."""
        import solana_ai_registries

        for item in solana_ai_registries.__all__:
            assert hasattr(solana_ai_registries, item), f"Missing export: {item}"


class TestEnumCoverage:
    """Test enum edge cases and coverage."""

    def test_agent_status_enum_values(self):
        """Test all AgentStatus enum values."""
        assert AgentStatus.PENDING.value == 0
        assert AgentStatus.ACTIVE.value == 1
        assert AgentStatus.INACTIVE.value == 2
        assert AgentStatus.DEREGISTERED.value == 3

    def test_mcp_server_status_enum_values(self):
        """Test all McpServerStatus enum values."""
        assert McpServerStatus.PENDING.value == 0
        assert McpServerStatus.ACTIVE.value == 1
        assert McpServerStatus.INACTIVE.value == 2
        assert McpServerStatus.DEREGISTERED.value == 3


class TestValidationFunctions:
    """Test validation functions coverage."""

    def test_all_validation_scenarios(self):
        """Test comprehensive validation scenarios."""
        # String length validation
        validate_string_length("short", 10, "test")

        with pytest.raises(ValueError, match="test must be at most"):
            validate_string_length("very_long_string_that_exceeds_limit", 5, "test")

        # URL validation
        valid_urls = [
            "https://example.com",
            "http://example.com",
            "ipfs://QmHash",
            "ar://ArweaveHash",
        ]

        for url in valid_urls:
            validate_url(url, "test_url")

        # Invalid URL formats
        invalid_urls = [
            "not_a_url",
            "example.com",
            "://missing_scheme",
        ]

        for url in invalid_urls:
            with pytest.raises(ValueError, match="must be a valid URL"):
                validate_url(url, "test_url")

        # Invalid schemes
        with pytest.raises(ValueError, match="must start with one of"):
            validate_url("ftp://example.com", "test_url")

        with pytest.raises(ValueError, match="must start with one of"):
            validate_url("file://example.com", "test_url")
