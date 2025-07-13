"""Basic interface tests for core modules to improve coverage."""

import pytest
from unittest.mock import Mock, patch

from solana_ai_registries.agent import AgentRegistry
from solana_ai_registries.client import SolanaAIRegistriesClient
from solana_ai_registries.mcp import McpServerRegistry
from solana_ai_registries.payments import PaymentManager
from solana_ai_registries.idl import IDLLoader, IdlInstruction, IdlAccount, IdlType, IdlError, ParsedIdl


class TestAgentRegistryBasics:
    """Test basic AgentRegistry functionality."""

    def test_init(self):
        """Test AgentRegistry initialization."""
        mock_client = Mock()
        registry = AgentRegistry(mock_client)
        assert registry.client == mock_client

    def test_agent_registry_module_level_imports(self):
        """Test that module imports work correctly."""
        from solana_ai_registries.agent import logger
        assert logger is not None


class TestClientBasics:
    """Test basic SolanaAIRegistriesClient functionality."""

    def test_init_default(self):
        """Test client initialization with defaults."""
        client = SolanaAIRegistriesClient()
        assert client.rpc_url is not None
        assert client.commitment is not None
        assert client._client is None

    def test_init_custom(self):
        """Test client initialization with custom values."""
        from solana.rpc.commitment import Commitment
        client = SolanaAIRegistriesClient(
            rpc_url="https://custom-rpc.com",
            commitment=Commitment("finalized")
        )
        assert client.rpc_url == "https://custom-rpc.com"
        assert client.commitment == Commitment("finalized")

    def test_client_property(self):
        """Test client property creates AsyncClient."""
        client = SolanaAIRegistriesClient()
        async_client = client.client
        assert async_client is not None
        # Test that it returns the same instance
        assert client.client is async_client

    @pytest.mark.asyncio
    async def test_close_method(self):
        """Test close method."""
        client = SolanaAIRegistriesClient()
        # Test close with no client
        await client.close()
        
        # Test close with client
        _ = client.client  # Create client
        await client.close()
        assert client._client is None

    @pytest.mark.asyncio
    async def test_context_manager(self):
        """Test async context manager."""
        async with SolanaAIRegistriesClient() as client:
            assert isinstance(client, SolanaAIRegistriesClient)

    def test_pda_derivation_methods(self):
        """Test PDA derivation methods exist and work."""
        from solders.pubkey import Pubkey as PublicKey
        client = SolanaAIRegistriesClient()
        
        owner = PublicKey.from_string("11111111111111111111111111111112")
        
        # Test agent PDA derivation
        pda, bump = client.derive_agent_pda("test-agent", owner)
        assert isinstance(pda, PublicKey)
        assert isinstance(bump, int)
        
        # Test MCP server PDA derivation
        pda, bump = client.derive_mcp_server_pda("test-server", owner)
        assert isinstance(pda, PublicKey)
        assert isinstance(bump, int)
        
        # Test payment escrow PDA derivation
        pda, bump = client.derive_payment_escrow_pda("test-agent", owner)
        assert isinstance(pda, PublicKey)
        assert isinstance(bump, int)

    def test_instruction_building_methods(self):
        """Test instruction building methods exist."""
        from solders.pubkey import Pubkey as PublicKey
        client = SolanaAIRegistriesClient()
        owner = PublicKey.from_string("11111111111111111111111111111112")
        
        # Test agent instruction builders
        instruction = client.build_register_agent_instruction(
            agent_id="test-agent",
            name="Test Agent",
            description="Test description",
            owner=owner
        )
        assert instruction is not None
        
        instruction = client.build_update_agent_instruction(
            agent_id="test-agent",
            owner=owner,
            name="Updated Name"
        )
        assert instruction is not None
        
        instruction = client.build_deregister_agent_instruction(
            agent_id="test-agent",
            owner=owner
        )
        assert instruction is not None
        
        # Test MCP server instruction builders
        instruction = client.build_register_mcp_server_instruction(
            server_id="test-server",
            name="Test Server",
            description="Test description",
            endpoint_url="https://api.example.com",
            owner=owner
        )
        assert instruction is not None
        
        instruction = client.build_update_mcp_server_instruction(
            server_id="test-server",
            owner=owner,
            name="Updated Server"
        )
        assert instruction is not None
        
        instruction = client.build_deregister_mcp_server_instruction(
            server_id="test-server",
            owner=owner
        )
        assert instruction is not None

    def test_serialization_methods(self):
        """Test data serialization methods."""
        client = SolanaAIRegistriesClient()
        
        # Test agent data serialization
        data = client._serialize_agent_data(
            agent_id="test-agent",
            name="Test Agent",
            description="Test description"
        )
        assert isinstance(data, bytes)
        
        # Test MCP server data serialization
        data = client._serialize_mcp_server_data(
            server_id="test-server",
            name="Test Server",
            description="Test description",
            endpoint_url="https://api.example.com"
        )
        assert isinstance(data, bytes)
        
        # Test string serialization
        data = client._serialize_string("test")
        assert isinstance(data, bytes)
        
        # Test optional string serialization
        data = client._serialize_optional_string("test")
        assert isinstance(data, bytes)
        
        data = client._serialize_optional_string(None)
        assert isinstance(data, bytes)


class TestMcpRegistryBasics:
    """Test basic McpServerRegistry functionality."""

    def test_init(self):
        """Test McpServerRegistry initialization."""
        mock_client = Mock()
        registry = McpServerRegistry(mock_client)
        assert registry.client == mock_client


class TestPaymentManagerBasics:
    """Test basic PaymentManager functionality."""

    def test_init_devnet(self):
        """Test PaymentManager initialization for devnet."""
        mock_client = Mock()
        manager = PaymentManager(mock_client)
        assert manager.client == mock_client
        assert manager.use_mainnet is False

    def test_init_mainnet(self):
        """Test PaymentManager initialization for mainnet."""
        mock_client = Mock()
        manager = PaymentManager(mock_client, use_mainnet=True)
        assert manager.client == mock_client
        assert manager.use_mainnet is True

    def test_token_mint_property(self):
        """Test token mint property."""
        from solders.pubkey import Pubkey as PublicKey
        mock_client = Mock()
        
        # Test devnet
        manager = PaymentManager(mock_client)
        token_mint = manager.token_mint
        assert isinstance(token_mint, PublicKey)
        
        # Test mainnet
        manager_mainnet = PaymentManager(mock_client, use_mainnet=True)
        token_mint_mainnet = manager_mainnet.token_mint
        assert isinstance(token_mint_mainnet, PublicKey)
        assert token_mint != token_mint_mainnet

    def test_utility_methods(self):
        """Test payment utility methods."""
        from decimal import Decimal
        mock_client = Mock()
        manager = PaymentManager(mock_client)
        
        # Test payment amount calculation
        amount = manager._calculate_payment_amount(Decimal("2.0"), 30)
        assert amount == Decimal("60.0")
        
        # Test payment amount validation
        manager._validate_payment_amount(Decimal("10.0"))  # Should not raise
        
        with pytest.raises(Exception):  # Should raise for invalid amounts
            manager._validate_payment_amount(Decimal("0"))
        
        with pytest.raises(Exception):
            manager._validate_payment_amount(Decimal("-5"))
        
        # Test payment type methods
        payment_type = manager._get_payment_type_for_transaction("escrow")
        assert payment_type is not None
        
        payment_type = manager._get_payment_type_for_transaction("direct")
        assert payment_type is not None
        
        payment_type = manager._get_payment_type_for_transaction("streaming")
        assert payment_type is not None

    def test_instruction_building_methods(self):
        """Test payment instruction building methods."""
        from solders.pubkey import Pubkey as PublicKey
        mock_client = Mock()
        manager = PaymentManager(mock_client)
        
        pubkey = PublicKey.from_string("11111111111111111111111111111112")
        
        # Test transfer instruction building
        instruction = manager._build_transfer_instruction(
            from_pubkey=pubkey,
            to_pubkey=pubkey,
            amount=1000000000,
            token_mint=manager.token_mint
        )
        assert instruction is not None
        
        # Test escrow instruction building
        instruction = manager._build_create_escrow_instruction(
            user=pubkey,
            agent_id="test-agent",
            amount=1000000000
        )
        assert instruction is not None
        
        # Test streaming instruction building
        instruction = manager._build_streaming_instruction(
            user=pubkey,
            agent_owner=pubkey,
            rate_per_second=1000000,
            duration=60
        )
        assert instruction is not None


class TestIdlLoaderBasics:
    """Test basic IDL loader functionality."""

    def test_init(self):
        """Test IDLLoader initialization."""
        loader = IDLLoader()
        assert loader._cached_idls == {}
        assert loader._generated_types == {}

    def test_data_classes(self):
        """Test IDL data classes."""
        # Test IdlInstruction
        instruction = IdlInstruction(
            name="test_instruction",
            accounts=[],
            args=[],
            discriminant=0
        )
        assert instruction.name == "test_instruction"
        assert instruction.discriminant == 0
        
        # Test IdlAccount
        account = IdlAccount(
            name="TestAccount",
            type={"kind": "struct", "fields": []},
            discriminant=1
        )
        assert account.name == "TestAccount"
        assert account.discriminant == 1
        
        # Test IdlType
        idl_type = IdlType(
            name="TestType",
            type={"kind": "enum", "variants": []}
        )
        assert idl_type.name == "TestType"
        
        # Test IdlError
        idl_error = IdlError(
            code=6000,
            name="TestError",
            msg="Test error message"
        )
        assert idl_error.code == 6000
        assert idl_error.name == "TestError"
        
        # Test ParsedIdl
        parsed_idl = ParsedIdl(
            version="0.1.0",
            name="test_program",
            instructions=[instruction],
            accounts=[account],
            types=[idl_type],
            errors=[idl_error],
            metadata={}
        )
        assert parsed_idl.name == "test_program"
        assert len(parsed_idl.instructions) == 1

    def test_type_conversion_methods(self):
        """Test type conversion methods."""
        loader = IDLLoader()
        
        # Test basic type conversions
        assert loader._convert_type("string") == str
        assert loader._convert_type("u64") == int
        assert loader._convert_type("bool") == bool
        assert loader._convert_type("publicKey") == str
        assert loader._convert_type("bytes") == bytes
        
        # Test unknown type
        unknown_result = loader._convert_type("unknown_type")
        assert unknown_result is not None

    def test_name_formatting(self):
        """Test name formatting methods."""
        loader = IDLLoader()
        
        assert loader._format_name("test_name") == "TestName"
        assert loader._format_name("another_test") == "AnotherTest"
        assert loader._format_name("simple") == "Simple"

    def test_type_generation_methods(self):
        """Test type generation methods exist."""
        loader = IDLLoader()
        
        # Test struct type generation
        struct_type = loader._generate_struct_type(
            "TestStruct",
            [{"name": "field1", "type": "string"}]
        )
        assert struct_type is not None
        
        # Test enum type generation
        enum_type = loader._generate_enum_type(
            "TestEnum",
            [{"name": "Variant1"}, {"name": "Variant2"}]
        )
        assert enum_type is not None


class TestModuleImports:
    """Test that all modules can be imported and have expected attributes."""

    def test_agent_module_imports(self):
        """Test agent module imports."""
        from solana_ai_registries import agent
        assert hasattr(agent, 'AgentRegistry')
        assert hasattr(agent, 'logger')

    def test_client_module_imports(self):
        """Test client module imports."""
        from solana_ai_registries import client
        assert hasattr(client, 'SolanaAIRegistriesClient')
        assert hasattr(client, 'logger')

    def test_mcp_module_imports(self):
        """Test mcp module imports."""
        from solana_ai_registries import mcp
        assert hasattr(mcp, 'McpServerRegistry')
        assert hasattr(mcp, 'logger')

    def test_payments_module_imports(self):
        """Test payments module imports."""
        from solana_ai_registries import payments
        assert hasattr(payments, 'PaymentManager')
        assert hasattr(payments, 'logger')

    def test_idl_module_imports(self):
        """Test idl module imports."""
        from solana_ai_registries import idl
        assert hasattr(idl, 'IDLLoader')
        assert hasattr(idl, 'IdlInstruction')
        assert hasattr(idl, 'IdlAccount')
        assert hasattr(idl, 'IdlType')
        assert hasattr(idl, 'ParsedIdl')
        assert hasattr(idl, 'logger')


class TestErrorScenarios:
    """Test error handling in core modules."""

    def test_client_error_handling(self):
        """Test client error handling."""
        from solana_ai_registries.exceptions import ConnectionError, InvalidPublicKeyError
        
        # Test that exceptions are properly defined
        assert ConnectionError is not None
        assert InvalidPublicKeyError is not None

    def test_idl_error_handling(self):
        """Test IDL error handling."""
        from solana_ai_registries.exceptions import IDLError
        from solana_ai_registries.idl import IDLLoader
        
        loader = IDLLoader()
        
        # Test with invalid IDL structure
        invalid_idl = {"invalid": "structure"}
        
        with pytest.raises(IDLError):
            loader._parse_idl(invalid_idl)

    def test_payment_error_handling(self):
        """Test payment error handling."""
        from solana_ai_registries.exceptions import PaymentError, InsufficientFundsError
        from decimal import Decimal
        
        # Test that exceptions are properly defined
        assert PaymentError is not None
        assert InsufficientFundsError is not None
        
        # Test payment validation
        mock_client = Mock()
        manager = PaymentManager(mock_client)
        
        with pytest.raises(Exception):
            manager._validate_payment_amount(Decimal("0"))