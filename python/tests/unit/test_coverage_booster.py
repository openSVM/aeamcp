"""
Additional tests to boost coverage to 65%+.
"""

import pytest


class TestAdditionalCoverage:
    """Additional tests for better coverage."""

    def test_constants_conversion_edge_cases(self):
        """Test edge cases for conversion functions."""
        from solana_ai_registries.constants import (
            a2ampl_to_base_units,
            base_units_to_a2ampl,
        )

        # Zero case
        assert a2ampl_to_base_units(0) == 0
        assert base_units_to_a2ampl(0) == 0.0

        # Large numbers
        large_amount = 1000000.5
        base_units = a2ampl_to_base_units(large_amount)
        assert base_units == 1000000500000000

        # Small fractions
        small_amount = 0.000000001
        base_units = a2ampl_to_base_units(small_amount)
        assert base_units == 1

    def test_validation_functions(self):
        """Test validation functions in constants module."""
        from solana_ai_registries.constants import validate_string_length, validate_url

        # Valid cases
        validate_string_length("test", 10, "test_field")
        validate_url("https://example.com", "test_url")
        validate_url("http://example.com", "test_url")

        # Invalid cases
        with pytest.raises(ValueError, match="test_field exceeds maximum length"):
            validate_string_length("too_long_string", 5, "test_field")

        with pytest.raises(ValueError, match="test_url must start with one of"):
            validate_url("not_a_url", "test_url")

        with pytest.raises(ValueError, match="test_url must start with one of"):
            validate_url("ftp://example.com", "test_url")

    def test_client_async_context_manager(self):
        """Test client async context manager functionality."""
        import asyncio

        from solana_ai_registries.client import SolanaAIRegistriesClient

        async def test_context_manager():
            async with SolanaAIRegistriesClient() as client:
                assert client is not None
                # Test that client property works
                rpc_client = client.client
                assert rpc_client is not None

        asyncio.run(test_context_manager())

    def test_client_properties(self):
        """Test client properties for coverage."""
        from solana_ai_registries.client import SolanaAIRegistriesClient

        client = SolanaAIRegistriesClient()

        # Test commitment property access
        assert client.commitment is not None

        # Test program ID properties
        assert client.agent_program_id is not None
        assert client.mcp_program_id is not None

        # Test RPC URL property
        assert client.rpc_url is not None

    def test_exception_hierarchy(self):
        """Test exception classes and inheritance."""
        from solana_ai_registries.exceptions import (
            AgentExistsError,
            SolanaAIRegistriesError,
            ValidationError,
        )

        # Test base exception
        base_error = SolanaAIRegistriesError("base error")
        assert str(base_error) == "base error"

        # Test specific exceptions with their fields
        agent_error = AgentExistsError("test_agent", "owner123")
        assert agent_error.agent_id == "test_agent"
        assert agent_error.owner == "owner123"

        validation_error = ValidationError(
            "test_field", "test_value", "test_constraint"
        )
        assert validation_error.field == "test_field"
        assert validation_error.constraint == "test_constraint"
        assert validation_error.value == "test_value"

        # Test inheritance
        assert isinstance(agent_error, SolanaAIRegistriesError)
        assert isinstance(validation_error, SolanaAIRegistriesError)

    def test_types_validation_edge_cases(self):
        """Test edge cases for type validation."""
        from solana_ai_registries.types import (
            AgentSkill,
            PaymentType,
            ServiceEndpoint,
            StakingTier,
        )

        # ServiceEndpoint with minimal data
        endpoint = ServiceEndpoint(url="https://api.test.com")
        assert endpoint.protocol == "https"
        assert endpoint.description is None

        # AgentSkill with all optional fields
        skill = AgentSkill(
            skill_id="test_skill",
            name="Test Skill",
            description="A test skill",
            category="testing",
            tags=["tag1", "tag2"],
            metadata={"version": "1.0"},
        )
        assert skill.description == "A test skill"
        assert skill.category == "testing"
        assert len(skill.tags) == 2
        assert skill.metadata["version"] == "1.0"

        # Test enum values
        assert PaymentType.PREPAY.value == "prepay"
        assert PaymentType.PAY_AS_YOU_GO.value == "pyg"
        assert StakingTier.BRONZE.value == "bronze"

    def test_idl_loader_cache_operations(self):
        """Test IDL loader cache operations."""
        from solana_ai_registries.idl import IDLLoader

        loader = IDLLoader()

        # Test initial state
        assert len(loader._cached_idls) == 0

        # Test cache clearing
        loader.clear_cache()
        assert len(loader._cached_idls) == 0

        # Test loading non-existent IDL (should raise error)
        with pytest.raises(Exception):  # Could be IDLError or other
            loader.load_idl("nonexistent_program")

    def test_registry_classes_initialization(self):
        """Test registry class initialization."""
        from solana_ai_registries.agent import AgentRegistry
        from solana_ai_registries.client import SolanaAIRegistriesClient
        from solana_ai_registries.mcp import McpServerRegistry
        from solana_ai_registries.payments import PaymentManager

        client = SolanaAIRegistriesClient()

        # Test agent registry
        agent_registry = AgentRegistry(client)
        assert agent_registry.client == client

        # Test MCP registry
        mcp_registry = McpServerRegistry(client)
        assert mcp_registry.client == client

        # Test payment manager variations
        payment_manager_devnet = PaymentManager(client, use_mainnet=False)
        payment_manager_mainnet = PaymentManager(client, use_mainnet=True)

        assert payment_manager_devnet.client == client
        assert payment_manager_mainnet.client == client
        assert payment_manager_devnet.token_mint != payment_manager_mainnet.token_mint

    def test_type_field_validation(self):
        """Test validation of type fields."""
        from solana_ai_registries.types import AgentSkill

        # Test tags validation (max 5 tags)
        with pytest.raises(ValueError, match="Maximum 5 tags allowed"):
            AgentSkill(
                skill_id="test",
                name="Test",
                tags=["tag1", "tag2", "tag3", "tag4", "tag5", "tag6"],
            )

        # Test valid case with 5 tags
        skill = AgentSkill(
            skill_id="test", name="Test", tags=["tag1", "tag2", "tag3", "tag4", "tag5"]
        )
        assert len(skill.tags) == 5

    def test_service_endpoint_auth_variations(self):
        """Test ServiceEndpoint with different auth configurations."""
        from solana_ai_registries.types import ServiceEndpoint

        # No auth
        endpoint1 = ServiceEndpoint(url="https://api.example.com")
        assert endpoint1.auth_type is None
        assert endpoint1.auth_config is None

        # Bearer token auth
        endpoint2 = ServiceEndpoint(
            url="https://api.example.com",
            auth_type="bearer",
            auth_config={"header": "Authorization"},
        )
        assert endpoint2.auth_type == "bearer"
        assert endpoint2.auth_config["header"] == "Authorization"

        # API key auth
        endpoint3 = ServiceEndpoint(
            url="https://api.example.com",
            auth_type="api_key",
            description="API with key authentication",
            auth_config={"key_param": "api_key"},
        )
        assert endpoint3.auth_type == "api_key"
        assert endpoint3.description == "API with key authentication"

    def test_import_all_submodules(self):
        """Test importing all submodules for coverage."""
        import solana_ai_registries
        import solana_ai_registries.agent
        import solana_ai_registries.client
        import solana_ai_registries.constants
        import solana_ai_registries.exceptions
        import solana_ai_registries.idl
        import solana_ai_registries.mcp
        import solana_ai_registries.payments
        import solana_ai_registries.types

        # Basic availability checks
        assert hasattr(solana_ai_registries, "__version__")
        assert hasattr(solana_ai_registries.agent, "AgentRegistry")
        assert hasattr(solana_ai_registries.client, "SolanaAIRegistriesClient")
        assert hasattr(solana_ai_registries.exceptions, "SolanaAIRegistriesError")
        assert hasattr(solana_ai_registries.types, "AgentStatus")

    def test_constants_all_values(self):
        """Test accessing all constant values."""
        from solana_ai_registries.constants import (
            A2AMPL_BASE_UNIT,
            A2AMPL_TOKEN_MINT_DEVNET,
            A2AMPL_TOKEN_MINT_MAINNET,
            AGENT_REGISTRY_PROGRAM_ID,
            BRONZE_TIER_STAKE,
            DEFAULT_DEVNET_RPC,
            GOLD_TIER_STAKE,
            MAX_AGENT_DESCRIPTION_LEN,
            MAX_AGENT_ID_LEN,
            MAX_AGENT_NAME_LEN,
            MAX_SERVER_ID_LEN,
            MAX_SERVER_NAME_LEN,
            MCP_SERVER_REGISTRY_PROGRAM_ID,
            PLATINUM_TIER_STAKE,
            SILVER_TIER_STAKE,
        )

        # Ensure all constants are defined and have expected types
        assert isinstance(AGENT_REGISTRY_PROGRAM_ID, str)
        assert isinstance(MCP_SERVER_REGISTRY_PROGRAM_ID, str)
        assert isinstance(DEFAULT_DEVNET_RPC, str)
        assert isinstance(MAX_AGENT_ID_LEN, int) and MAX_AGENT_ID_LEN > 0
        assert isinstance(MAX_AGENT_NAME_LEN, int) and MAX_AGENT_NAME_LEN > 0
        assert (
            isinstance(MAX_AGENT_DESCRIPTION_LEN, int) and MAX_AGENT_DESCRIPTION_LEN > 0
        )
        assert isinstance(MAX_SERVER_ID_LEN, int) and MAX_SERVER_ID_LEN > 0
        assert isinstance(MAX_SERVER_NAME_LEN, int) and MAX_SERVER_NAME_LEN > 0
        assert isinstance(A2AMPL_BASE_UNIT, int) and A2AMPL_BASE_UNIT > 0
        assert isinstance(A2AMPL_TOKEN_MINT_DEVNET, str)
        assert isinstance(A2AMPL_TOKEN_MINT_MAINNET, str)
        assert isinstance(BRONZE_TIER_STAKE, int)
        assert isinstance(SILVER_TIER_STAKE, int)
        assert isinstance(GOLD_TIER_STAKE, int)
        assert isinstance(PLATINUM_TIER_STAKE, int)

        # Test stake tier ordering
        assert BRONZE_TIER_STAKE < SILVER_TIER_STAKE
        assert SILVER_TIER_STAKE < GOLD_TIER_STAKE
        assert GOLD_TIER_STAKE < PLATINUM_TIER_STAKE
