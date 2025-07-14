"""
Comprehensive coverage tests for core modules to achieve 95%+ test coverage.

This module contains targeted tests to cover the missing lines identified
in the coverage report for agent.py, client.py, mcp.py, payments.py, and idl.py.
"""

import asyncio
import json
from decimal import Decimal
from pathlib import Path
from typing import Any, Dict, List
from unittest.mock import AsyncMock, MagicMock, mock_open, patch

import pytest
from solders.keypair import Keypair
from solders.pubkey import Pubkey as PublicKey

from solana_ai_registries.agent import AgentRegistry
from solana_ai_registries.client import SolanaAIRegistriesClient
from solana_ai_registries.constants import (
    MAX_AGENT_DESCRIPTION_LEN,
    MAX_AGENT_ID_LEN,
    MAX_AGENT_NAME_LEN,
    MAX_SERVER_ID_LEN,
    MAX_SERVER_NAME_LEN,
)
from solana_ai_registries.exceptions import (
    AccountNotFoundError,
    InvalidInputError,
    RegistrationError,
    ValidationError,
)
from solana_ai_registries.idl import IDLLoader
from solana_ai_registries.mcp import McpServerRegistry
from solana_ai_registries.payments import PaymentManager
from solana_ai_registries.types import AgentRegistryEntry, AgentStatus

class TestAgentRegistryMissingLines:
    """Tests to cover missing lines in agent.py."""

    @pytest.fixture
    def mock_client(self):
        client = MagicMock()
        client.build_register_agent_instruction = MagicMock()
        client.build_update_agent_instruction = MagicMock()
        client.build_deregister_agent_instruction = MagicMock()
        client.send_transaction = AsyncMock()
        client.get_agent_registry_entry = AsyncMock()
        return client

    @pytest.fixture
    def agent_registry(self, mock_client):
        return AgentRegistry(mock_client)

    @pytest.fixture
    def keypair(self):
        return Keypair()

    @pytest.mark.asyncio
    async def test_register_agent_input_validation(self, agent_registry, keypair):
        """Test register_agent validation paths - covers lines 82-94."""
        # Mock get_agent to return None (agent doesn't exist)
        agent_registry.get_agent = AsyncMock(return_value=None)
        agent_registry.client.send_transaction = AsyncMock(return_value="signature123")

        # Test with metadata_uri to cover line 86-87
        result = await agent_registry.register_agent(
            agent_id="test_agent",
            name="Test Agent",
            description="Test description",
            owner=keypair,
            metadata_uri="https://example.com/metadata.json",
        )
        assert result == "signature123"

    @pytest.mark.asyncio
    async def test_register_agent_already_exists_error(self, agent_registry, keypair):
        """Test register_agent when agent exists - covers lines 90-94."""
        # Mock existing agent
        existing_agent = AgentRegistryEntry(
            agent_id="test_agent",
            name="Existing Agent",
            description="Existing description",
            owner=keypair.pubkey(),
            status=AgentStatus.ACTIVE,
        )
        agent_registry.get_agent = AsyncMock(return_value=existing_agent)

        with pytest.raises(RegistrationError, match="already exists"):
            await agent_registry.register_agent(
                agent_id="test_agent",
                name="Test Agent",
                description="Test description",
                owner=keypair,
            )

    @pytest.mark.asyncio
    async def test_register_agent_transaction_failure(self, agent_registry, keypair):
        """Test register_agent when transaction fails."""
        agent_registry.get_agent = AsyncMock(return_value=None)
        agent_registry.client.send_transaction = AsyncMock(
            side_effect=Exception("Transaction failed")
        )

        with pytest.raises(RegistrationError, match="Failed to register agent"):
            await agent_registry.register_agent(
                agent_id="test_agent",
                name="Test Agent",
                description="Test description",
                owner=keypair,
            )

    @pytest.mark.asyncio
    async def test_update_agent_full_flow(self, agent_registry, keypair):
        """Test update_agent with all update fields."""
        agent_registry.client.send_transaction = AsyncMock(return_value="signature123")

        updates = {
            "name": "Updated Name",
            "description": "Updated description",
            "metadata_uri": "https://example.com/updated.json",
            "status": AgentStatus.INACTIVE,
        }

        result = await agent_registry.update_agent(
            agent_id="test_agent", owner=keypair, updates=updates
        )

        assert result == "signature123"
        agent_registry.client.build_update_agent_instruction.assert_called_once()
        agent_registry.client.send_transaction.assert_called_once()

    @pytest.mark.asyncio
    async def test_update_agent_validation_errors(self, agent_registry, keypair):
        """Test update_agent with validation errors."""
        # Test invalid status
        updates = {"status": "invalid_status"}
        with pytest.raises(ValidationError):
            await agent_registry.update_agent(
                agent_id="test_agent", owner=keypair, updates=updates
            )

        # Test name too long
        updates = {"name": "a" * (MAX_AGENT_NAME_LEN + 1)}
        with pytest.raises(ValidationError):
            await agent_registry.update_agent(
                agent_id="test_agent", owner=keypair, updates=updates
            )

    @pytest.mark.asyncio
    async def test_update_agent_transaction_failure(self, agent_registry, keypair):
        """Test update_agent when transaction fails."""
        agent_registry.client.send_transaction = AsyncMock(
            side_effect=Exception("Transaction failed")
        )

        updates = {"name": "Updated Name"}
        with pytest.raises(RegistrationError, match="Failed to update agent"):
            await agent_registry.update_agent(
                agent_id="test_agent", owner=keypair, updates=updates
            )

    @pytest.mark.asyncio
    async def test_deregister_agent_success(self, agent_registry, keypair):
        """Test successful agent deregistration."""
        agent_registry.client.send_transaction = AsyncMock(return_value="signature123")

        result = await agent_registry.deregister_agent(
            agent_id="test_agent", owner=keypair
        )

        assert result == "signature123"
        agent_registry.client.build_deregister_agent_instruction.assert_called_once()
        agent_registry.client.send_transaction.assert_called_once()

    @pytest.mark.asyncio
    async def test_deregister_agent_failure(self, agent_registry, keypair):
        """Test agent deregistration failure."""
        agent_registry.client.send_transaction = AsyncMock(
            side_effect=Exception("Transaction failed")
        )

        with pytest.raises(RegistrationError, match="Failed to deregister agent"):
            await agent_registry.deregister_agent(
                agent_id="test_agent", owner=keypair
            )

    @pytest.mark.asyncio
    async def test_get_agent_account_not_found(self, agent_registry, keypair):
        """Test get_agent when account is not found."""
        agent_registry.client.get_account = AsyncMock(return_value=None)

        result = await agent_registry.get_agent("test_agent", keypair.pubkey())
        assert result is None

    @pytest.mark.asyncio
    async def test_list_agents_success(self, agent_registry):
        """Test successful agent listing."""
        mock_accounts = [
            MagicMock(account=MagicMock(data=b"mock_data1")),
            MagicMock(account=MagicMock(data=b"mock_data2")),
        ]
        agent_registry.client.get_multiple_accounts = AsyncMock(
            return_value=mock_accounts
        )

        with patch.object(
            agent_registry.client, "deserialize_agent_account"
        ) as mock_deserialize:
            mock_deserialize.side_effect = [
                AgentRegistryEntry(
                    agent_id="agent1",
                    name="Agent 1",
                    description="Description 1",
                    owner=PublicKey("11111111111111111111111111111111"),
                    status=AgentStatus.ACTIVE,
                ),
                AgentRegistryEntry(
                    agent_id="agent2",
                    name="Agent 2",
                    description="Description 2",
                    owner=PublicKey("11111111111111111111111111111111"),
                    status=AgentStatus.ACTIVE,
                ),
            ]

            result = await agent_registry.list_agents()
            assert len(result) == 2
            assert result[0].agent_id == "agent1"
            assert result[1].agent_id == "agent2"

    @pytest.mark.asyncio
    async def test_search_agents_with_filters(self, agent_registry):
        """Test agent search with filters."""
        mock_agents = [
            AgentRegistryEntry(
                agent_id="active_agent",
                name="Active Agent",
                description="Active description",
                owner=PublicKey("11111111111111111111111111111111"),
                status=AgentStatus.ACTIVE,
            ),
            AgentRegistryEntry(
                agent_id="inactive_agent",
                name="Inactive Agent",
                description="Inactive description",
                owner=PublicKey("11111111111111111111111111111111"),
                status=AgentStatus.INACTIVE,
            ),
        ]

        agent_registry.list_agents = AsyncMock(return_value=mock_agents)

        # Test status filter
        result = await agent_registry.search_agents(status=AgentStatus.ACTIVE)
        assert len(result) == 1
        assert result[0].agent_id == "active_agent"

        # Test name filter
        result = await agent_registry.search_agents(name_contains="Active")
        assert len(result) == 1
        assert result[0].agent_id == "active_agent"

        # Test owner filter
        owner = PublicKey("11111111111111111111111111111111")
        result = await agent_registry.search_agents(owner=owner)
        assert len(result) == 2


class TestMcpServerRegistryComprehensive:
    """Comprehensive tests for McpServerRegistry to achieve full coverage."""

    @pytest.fixture
    def mock_client(self):
        client = MagicMock(spec=SolanaAIRegistriesClient)
        client.build_register_mcp_server_instruction = MagicMock()
        client.build_update_mcp_server_instruction = MagicMock()
        client.build_deregister_mcp_server_instruction = MagicMock()
        client.send_transaction = AsyncMock()
        client.get_account = AsyncMock()
        client.get_multiple_accounts = AsyncMock()
        return client

    @pytest.fixture
    def mcp_registry(self, mock_client):
        return McpServerRegistry(mock_client)

    @pytest.fixture
    def keypair(self):
        return Keypair()

    @pytest.mark.asyncio
    async def test_register_server_validation_errors(self, mcp_registry, keypair):
        """Test register_server with validation errors."""
        # Test server_id too long
        with pytest.raises(ValidationError):
            await mcp_registry.register_server(
                server_id="a" * (MAX_SERVER_ID_LEN + 1),
                name="Test Server",
                endpoint_url="https://example.com",
                owner=keypair,
            )

        # Test name too long
        with pytest.raises(ValidationError):
            await mcp_registry.register_server(
                server_id="test_server",
                name="a" * (MAX_SERVER_NAME_LEN + 1),
                endpoint_url="https://example.com",
                owner=keypair,
            )

        # Test invalid endpoint URL
        with pytest.raises(ValidationError):
            await mcp_registry.register_server(
                server_id="test_server",
                name="Test Server",
                endpoint_url="invalid_url",
                owner=keypair,
            )

    @pytest.mark.asyncio
    async def test_register_server_with_metadata_uri(self, mcp_registry, keypair):
        """Test register_server with metadata URI validation."""
        mcp_registry.get_server = AsyncMock(return_value=None)
        mcp_registry.client.send_transaction = AsyncMock(return_value="signature123")

        # Test with valid metadata URI
        result = await mcp_registry.register_server(
            server_id="test_server",
            name="Test Server",
            endpoint_url="https://example.com",
            owner=keypair,
            description="Test description",
            metadata_uri="https://example.com/metadata.json",
        )

        assert result == "signature123"
        mcp_registry.client.build_register_mcp_server_instruction.assert_called_once()
        mcp_registry.client.send_transaction.assert_called_once()

    @pytest.mark.asyncio
    async def test_register_server_already_exists(self, mcp_registry, keypair):
        """Test register_server when server already exists."""
        # Mock existing server
        existing_server = MagicMock()
        mcp_registry.get_server = AsyncMock(return_value=existing_server)

        with pytest.raises(RegistrationError, match="already exists"):
            await mcp_registry.register_server(
                server_id="test_server",
                name="Test Server",
                endpoint_url="https://example.com",
                owner=keypair,
            )

    @pytest.mark.asyncio
    async def test_register_server_transaction_failure(self, mcp_registry, keypair):
        """Test register_server when transaction fails."""
        mcp_registry.get_server = AsyncMock(return_value=None)
        mcp_registry.client.send_transaction = AsyncMock(
            side_effect=Exception("Transaction failed")
        )

        with pytest.raises(RegistrationError, match="Failed to register MCP server"):
            await mcp_registry.register_server(
                server_id="test_server",
                name="Test Server",
                endpoint_url="https://example.com",
                owner=keypair,
            )

    @pytest.mark.asyncio
    async def test_update_server_full_flow(self, mcp_registry, keypair):
        """Test update_server with all update fields."""
        mcp_registry.client.send_transaction = AsyncMock(return_value="signature123")

        updates = {
            "name": "Updated Name",
            "description": "Updated description",
            "endpoint_url": "https://example.com/updated",
            "metadata_uri": "https://example.com/updated.json",
        }

        result = await mcp_registry.update_server(
            server_id="test_server", owner=keypair, updates=updates
        )

        assert result == "signature123"
        mcp_registry.client.build_update_mcp_server_instruction.assert_called_once()
        mcp_registry.client.send_transaction.assert_called_once()

    @pytest.mark.asyncio
    async def test_update_server_validation_errors(self, mcp_registry, keypair):
        """Test update_server with validation errors."""
        # Test name too long
        updates = {"name": "a" * (MAX_SERVER_NAME_LEN + 1)}
        with pytest.raises(ValidationError):
            await mcp_registry.update_server(
                server_id="test_server", owner=keypair, updates=updates
            )

        # Test invalid endpoint URL
        updates = {"endpoint_url": "invalid_url"}
        with pytest.raises(ValidationError):
            await mcp_registry.update_server(
                server_id="test_server", owner=keypair, updates=updates
            )

    @pytest.mark.asyncio
    async def test_update_server_transaction_failure(self, mcp_registry, keypair):
        """Test update_server when transaction fails."""
        mcp_registry.client.send_transaction = AsyncMock(
            side_effect=Exception("Transaction failed")
        )

        updates = {"name": "Updated Name"}
        with pytest.raises(RegistrationError, match="Failed to update MCP server"):
            await mcp_registry.update_server(
                server_id="test_server", owner=keypair, updates=updates
            )

    @pytest.mark.asyncio
    async def test_deregister_server_success(self, mcp_registry, keypair):
        """Test successful server deregistration."""
        mcp_registry.client.send_transaction = AsyncMock(return_value="signature123")

        result = await mcp_registry.deregister_server(
            server_id="test_server", owner=keypair
        )

        assert result == "signature123"
        mcp_registry.client.build_deregister_mcp_server_instruction.assert_called_once()
        mcp_registry.client.send_transaction.assert_called_once()

    @pytest.mark.asyncio
    async def test_deregister_server_failure(self, mcp_registry, keypair):
        """Test server deregistration failure."""
        mcp_registry.client.send_transaction = AsyncMock(
            side_effect=Exception("Transaction failed")
        )

        with pytest.raises(RegistrationError, match="Failed to deregister MCP server"):
            await mcp_registry.deregister_server(
                server_id="test_server", owner=keypair
            )

    @pytest.mark.asyncio
    async def test_get_server_account_not_found(self, mcp_registry, keypair):
        """Test get_server when account is not found."""
        mcp_registry.client.get_account = AsyncMock(return_value=None)

        result = await mcp_registry.get_server("test_server", keypair.pubkey())
        assert result is None

    @pytest.mark.asyncio
    async def test_list_servers_success(self, mcp_registry):
        """Test successful server listing."""
        mock_accounts = [
            MagicMock(account=MagicMock(data=b"mock_data1")),
            MagicMock(account=MagicMock(data=b"mock_data2")),
        ]
        mcp_registry.client.get_multiple_accounts = AsyncMock(
            return_value=mock_accounts
        )

        with patch.object(
            mcp_registry.client, "deserialize_mcp_server_account"
        ) as mock_deserialize:
            mock_deserialize.side_effect = [
                MagicMock(server_id="server1"),
                MagicMock(server_id="server2"),
            ]

            result = await mcp_registry.list_servers()
            assert len(result) == 2

    @pytest.mark.asyncio
    async def test_search_servers_with_filters(self, mcp_registry):
        """Test server search with filters."""
        mock_servers = [
            MagicMock(server_id="test_server", name="Test Server"),
            MagicMock(server_id="prod_server", name="Production Server"),
        ]

        mcp_registry.list_servers = AsyncMock(return_value=mock_servers)

        # Test name filter
        result = await mcp_registry.search_servers(name_contains="Test")
        assert len(result) == 1
        assert result[0].server_id == "test_server"

    @pytest.mark.asyncio
    async def test_ping_server_success(self, mcp_registry):
        """Test successful server ping."""
        with patch("httpx.AsyncClient") as mock_client:
            mock_response = MagicMock()
            mock_response.status_code = 200
            mock_response.json.return_value = {"status": "ok"}
            mock_client.return_value.__aenter__.return_value.get = AsyncMock(
                return_value=mock_response
            )

            result = await mcp_registry.ping_server("https://example.com")
            assert result is True

    @pytest.mark.asyncio
    async def test_ping_server_failure(self, mcp_registry):
        """Test server ping failure."""
        with patch("httpx.AsyncClient") as mock_client:
            mock_client.return_value.__aenter__.return_value.get = AsyncMock(
                side_effect=Exception("Connection failed")
            )

            result = await mcp_registry.ping_server("https://example.com")
            assert result is False


class TestPaymentManagerComprehensive:
    """Comprehensive tests for PaymentManager to achieve full coverage."""

    @pytest.fixture
    def mock_client(self):
        client = MagicMock(spec=SolanaAIRegistriesClient)
        client.build_prepay_escrow_instruction = MagicMock()
        client.build_pay_as_you_go_instruction = MagicMock()
        client.build_stream_payment_instruction = MagicMock()
        client.send_transaction = AsyncMock()
        return client

    @pytest.fixture
    def payment_manager_devnet(self, mock_client):
        return PaymentManager(mock_client, cluster="devnet")

    @pytest.fixture
    def payment_manager_mainnet(self, mock_client):
        return PaymentManager(mock_client, cluster="mainnet")

    @pytest.fixture
    def keypair(self):
        return Keypair()

    @pytest.mark.asyncio
    async def test_prepay_escrow_success(self, payment_manager_devnet, keypair):
        """Test successful prepay escrow."""
        payment_manager_devnet.client.send_transaction = AsyncMock(
            return_value="signature123"
        )

        result = await payment_manager_devnet.prepay_escrow(
            amount=Decimal("100.0"), payer=keypair, recipient=keypair.pubkey()
        )

        assert result == "signature123"
        payment_manager_devnet.client.build_prepay_escrow_instruction.assert_called_once()
        payment_manager_devnet.client.send_transaction.assert_called_once()

    @pytest.mark.asyncio
    async def test_prepay_escrow_failure(self, payment_manager_devnet, keypair):
        """Test prepay escrow failure."""
        payment_manager_devnet.client.send_transaction = AsyncMock(
            side_effect=Exception("Transaction failed")
        )

        with pytest.raises(Exception, match="Transaction failed"):
            await payment_manager_devnet.prepay_escrow(
                amount=Decimal("100.0"), payer=keypair, recipient=keypair.pubkey()
            )

    @pytest.mark.asyncio
    async def test_pay_as_you_go_success(self, payment_manager_devnet, keypair):
        """Test successful pay-as-you-go payment."""
        payment_manager_devnet.client.send_transaction = AsyncMock(
            return_value="signature123"
        )

        result = await payment_manager_devnet.pay_as_you_go(
            amount=Decimal("10.0"),
            payer=keypair,
            recipient=keypair.pubkey(),
            service_id="test_service",
        )

        assert result == "signature123"
        payment_manager_devnet.client.build_pay_as_you_go_instruction.assert_called_once()
        payment_manager_devnet.client.send_transaction.assert_called_once()

    @pytest.mark.asyncio
    async def test_pay_as_you_go_failure(self, payment_manager_devnet, keypair):
        """Test pay-as-you-go payment failure."""
        payment_manager_devnet.client.send_transaction = AsyncMock(
            side_effect=Exception("Transaction failed")
        )

        with pytest.raises(Exception, match="Transaction failed"):
            await payment_manager_devnet.pay_as_you_go(
                amount=Decimal("10.0"),
                payer=keypair,
                recipient=keypair.pubkey(),
                service_id="test_service",
            )

    @pytest.mark.asyncio
    async def test_start_streaming_payment_success(self, payment_manager_devnet, keypair):
        """Test successful streaming payment start."""
        payment_manager_devnet.client.send_transaction = AsyncMock(
            return_value="signature123"
        )

        result = await payment_manager_devnet.start_streaming_payment(
            rate_per_second=Decimal("1.0"),
            payer=keypair,
            recipient=keypair.pubkey(),
            duration_seconds=3600,
        )

        assert result == "signature123"
        payment_manager_devnet.client.build_stream_payment_instruction.assert_called_once()
        payment_manager_devnet.client.send_transaction.assert_called_once()

    @pytest.mark.asyncio
    async def test_start_streaming_payment_failure(self, payment_manager_devnet, keypair):
        """Test streaming payment start failure."""
        payment_manager_devnet.client.send_transaction = AsyncMock(
            side_effect=Exception("Transaction failed")
        )

        with pytest.raises(Exception, match="Transaction failed"):
            await payment_manager_devnet.start_streaming_payment(
                rate_per_second=Decimal("1.0"),
                payer=keypair,
                recipient=keypair.pubkey(),
                duration_seconds=3600,
            )

    @pytest.mark.asyncio
    async def test_stream_payments_generator(self, payment_manager_devnet, keypair):
        """Test streaming payments generator."""
        mock_generator_data = [
            {"signature": "sig1", "amount": Decimal("1.0")},
            {"signature": "sig2", "amount": Decimal("1.0")},
            {"signature": "sig3", "amount": Decimal("1.0")},
        ]

        async def mock_stream():
            for data in mock_generator_data:
                yield data

        with patch.object(
            payment_manager_devnet, "_execute_streaming_payments", return_value=mock_stream()
        ):
            payments = []
            async for payment in payment_manager_devnet.stream_payments(
                rate_per_second=Decimal("1.0"),
                payer=keypair,
                recipient=keypair.pubkey(),
                duration_seconds=3,
            ):
                payments.append(payment)

            assert len(payments) == 3
            assert payments[0]["signature"] == "sig1"

    @pytest.mark.asyncio
    async def test_calculate_payment_amount(self, payment_manager_devnet):
        """Test payment amount calculation."""
        # Test A2AMPL amount
        amount = payment_manager_devnet.calculate_payment_amount(usage_units=100)
        assert isinstance(amount, Decimal)
        assert amount > 0

        # Test custom rate
        amount = payment_manager_devnet.calculate_payment_amount(
            usage_units=100, rate_per_unit=Decimal("0.1")
        )
        assert amount == Decimal("10.0")

    def test_a2ampl_to_base_units(self, payment_manager_devnet):
        """Test A2AMPL to base units conversion."""
        result = payment_manager_devnet.a2ampl_to_base_units(Decimal("1.0"))
        assert isinstance(result, int)
        assert result > 0

    def test_base_units_to_a2ampl(self, payment_manager_devnet):
        """Test base units to A2AMPL conversion."""
        result = payment_manager_devnet.base_units_to_a2ampl(1000000)
        assert isinstance(result, Decimal)
        assert result > 0

    def test_token_mint_property(self, payment_manager_devnet, payment_manager_mainnet):
        """Test token_mint property for different clusters."""
        # Test devnet
        devnet_mint = payment_manager_devnet.token_mint
        assert isinstance(devnet_mint, PublicKey)

        # Test mainnet  
        mainnet_mint = payment_manager_mainnet.token_mint
        assert isinstance(mainnet_mint, PublicKey)
        assert devnet_mint != mainnet_mint


class TestIDLLoaderComprehensive:
    """Comprehensive tests for IDLLoader to achieve full coverage."""

    @pytest.fixture
    def idl_loader(self):
        return IDLLoader("test_program")

    @pytest.fixture
    def mock_idl_data(self):
        return {
            "name": "test_program",
            "version": "1.0.0",
            "instructions": [
                {
                    "name": "test_instruction",
                    "accounts": [
                        {"name": "signer", "isMut": False, "isSigner": True},
                        {"name": "account", "isMut": True, "isSigner": False},
                    ],
                    "args": [
                        {"name": "amount", "type": "u64"},
                        {"name": "data", "type": "string"},
                    ],
                }
            ],
            "accounts": [
                {
                    "name": "TestAccount",
                    "type": {
                        "kind": "struct",
                        "fields": [
                            {"name": "owner", "type": "publicKey"},
                            {"name": "amount", "type": "u64"},
                        ],
                    },
                }
            ],
            "types": [
                {
                    "name": "TestEnum",
                    "type": {
                        "kind": "enum",
                        "variants": [
                            {"name": "Variant1"},
                            {"name": "Variant2", "fields": [{"type": "u32"}]},
                        ],
                    },
                }
            ],
        }

    @pytest.mark.asyncio
    async def test_load_idl_from_file_success(self, idl_loader, mock_idl_data):
        """Test successful IDL loading from file."""
        with patch("pathlib.Path.exists", return_value=True), patch(
            "builtins.open", mock_open(read_data=json.dumps(mock_idl_data))
        ):
            result = await idl_loader.load_idl_from_file("test.json")
            assert result == mock_idl_data

    @pytest.mark.asyncio
    async def test_load_idl_from_file_not_found(self, idl_loader):
        """Test IDL loading when file not found."""
        with patch("pathlib.Path.exists", return_value=False):
            with pytest.raises(FileNotFoundError):
                await idl_loader.load_idl_from_file("nonexistent.json")

    @pytest.mark.asyncio
    async def test_load_idl_from_file_invalid_json(self, idl_loader):
        """Test IDL loading with invalid JSON."""
        with patch("pathlib.Path.exists", return_value=True), patch(
            "builtins.open", mock_open(read_data="invalid json")
        ):
            with pytest.raises(json.JSONDecodeError):
                await idl_loader.load_idl_from_file("invalid.json")

    @pytest.mark.asyncio
    async def test_load_idl_from_resources_success(self, idl_loader, mock_idl_data):
        """Test successful IDL loading from package resources."""
        with patch("importlib.resources.open_text") as mock_open_text:
            mock_open_text.return_value.__enter__.return_value.read.return_value = (
                json.dumps(mock_idl_data)
            )
            result = await idl_loader.load_idl_from_resources("test.json")
            assert result == mock_idl_data

    @pytest.mark.asyncio
    async def test_load_idl_from_resources_not_found(self, idl_loader):
        """Test IDL loading from resources when file not found."""
        with patch(
            "importlib.resources.open_text", side_effect=FileNotFoundError()
        ):
            with pytest.raises(FileNotFoundError):
                await idl_loader.load_idl_from_resources("nonexistent.json")

    @pytest.mark.asyncio
    async def test_generate_types_success(self, idl_loader, mock_idl_data):
        """Test successful type generation from IDL."""
        types = await idl_loader.generate_types(mock_idl_data)
        assert "TestAccount" in types
        assert "TestEnum" in types
        assert callable(types["TestAccount"])
        assert callable(types["TestEnum"])

    def test_map_idl_type_basic_types(self, idl_loader):
        """Test IDL type mapping for basic types."""
        assert idl_loader._map_idl_type("u8") == int
        assert idl_loader._map_idl_type("u16") == int
        assert idl_loader._map_idl_type("u32") == int
        assert idl_loader._map_idl_type("u64") == int
        assert idl_loader._map_idl_type("i8") == int
        assert idl_loader._map_idl_type("i16") == int
        assert idl_loader._map_idl_type("i32") == int
        assert idl_loader._map_idl_type("i64") == int
        assert idl_loader._map_idl_type("f32") == float
        assert idl_loader._map_idl_type("f64") == float
        assert idl_loader._map_idl_type("bool") == bool
        assert idl_loader._map_idl_type("string") == str
        assert idl_loader._map_idl_type("publicKey") == PublicKey

    def test_map_idl_type_complex_types(self, idl_loader):
        """Test IDL type mapping for complex types."""
        # Test array type
        array_type = {"array": ["u8", 32]}
        result = idl_loader._map_idl_type(array_type)
        assert result == List[int]

        # Test vec type
        vec_type = {"vec": "string"}
        result = idl_loader._map_idl_type(vec_type)
        assert result == List[str]

        # Test option type
        option_type = {"option": "u64"}
        result = idl_loader._map_idl_type(option_type)
        # For option types, we expect the inner type
        assert result == int

    def test_map_idl_type_unknown_type(self, idl_loader):
        """Test IDL type mapping for unknown types."""
        result = idl_loader._map_idl_type("unknown_type")
        assert result == Any

    @pytest.mark.asyncio
    async def test_build_instruction_success(self, idl_loader, mock_idl_data):
        """Test successful instruction building."""
        idl_loader.idl_data = mock_idl_data

        accounts = [
            PublicKey("11111111111111111111111111111111"),
            PublicKey("22222222222222222222222222222222"),
        ]
        args = {"amount": 1000, "data": "test"}

        instruction = await idl_loader.build_instruction(
            "test_instruction", accounts, args
        )

        assert instruction is not None
        assert len(instruction.accounts) == 2
        assert instruction.accounts[0].pubkey == accounts[0]
        assert instruction.accounts[1].pubkey == accounts[1]

    @pytest.mark.asyncio
    async def test_build_instruction_not_found(self, idl_loader, mock_idl_data):
        """Test instruction building when instruction not found."""
        idl_loader.idl_data = mock_idl_data

        with pytest.raises(ValueError, match="Instruction 'nonexistent' not found"):
            await idl_loader.build_instruction("nonexistent", [], {})

    @pytest.mark.asyncio
    async def test_build_instruction_no_idl(self, idl_loader):
        """Test instruction building when IDL not loaded."""
        with pytest.raises(ValueError, match="IDL not loaded"):
            await idl_loader.build_instruction("test_instruction", [], {})


class TestClientComprehensive:
    """Comprehensive tests for SolanaAIRegistriesClient to achieve full coverage."""

    @pytest.fixture
    def client(self):
        return SolanaAIRegistriesClient("https://api.devnet.solana.com")

    @pytest.fixture
    def keypair(self):
        return Keypair()

    @pytest.mark.asyncio
    async def test_get_account_success(self, client):
        """Test successful account retrieval."""
        mock_account_info = GetAccountInfoResp(
            context=RpcResponseContext(slot=1000, api_version="1.0"),
            value=MagicMock(data=b"mock_account_data", lamports=1000000),
        )

        with patch.object(client.client, "get_account_info", return_value=mock_account_info):
            result = await client.get_account(PublicKey("11111111111111111111111111111111"))
            assert result is not None
            assert result.lamports == 1000000

    @pytest.mark.asyncio
    async def test_get_account_not_found(self, client):
        """Test account retrieval when account not found."""
        mock_response = GetAccountInfoResp(
            context=RpcResponseContext(slot=1000, api_version="1.0"), value=None
        )

        with patch.object(client.client, "get_account_info", return_value=mock_response):
            result = await client.get_account(PublicKey("11111111111111111111111111111111"))
            assert result is None

    @pytest.mark.asyncio
    async def test_get_multiple_accounts_success(self, client):
        """Test successful multiple account retrieval."""
        mock_accounts = [
            MagicMock(account=MagicMock(data=b"mock_data1")),
            MagicMock(account=MagicMock(data=b"mock_data2")),
        ]

        with patch.object(client.client, "get_multiple_accounts", return_value=mock_accounts):
            addresses = [
                PublicKey("11111111111111111111111111111111"),
                PublicKey("22222222222222222222222222222222"),
            ]
            result = await client.get_multiple_accounts(addresses)
            assert len(result) == 2

    @pytest.mark.asyncio
    async def test_send_transaction_success(self, client, keypair):
        """Test successful transaction sending."""
        transaction = Transaction.new_with_payer([], keypair.pubkey())

        with patch.object(client.client, "get_latest_blockhash") as mock_blockhash, \
             patch.object(client.client, "send_transaction") as mock_send:
            
            mock_blockhash.return_value = MagicMock(value=MagicMock(blockhash="test_hash"))
            mock_send.return_value = MagicMock(value="signature123")

            result = await client.send_transaction(transaction, [keypair])
            assert result == "signature123"

    @pytest.mark.asyncio
    async def test_send_transaction_with_retry(self, client, keypair):
        """Test transaction sending with retry on failure."""
        transaction = Transaction.new_with_payer([], keypair.pubkey())

        with patch.object(client.client, "get_latest_blockhash") as mock_blockhash, \
             patch.object(client.client, "send_transaction") as mock_send:
            
            mock_blockhash.return_value = MagicMock(value=MagicMock(blockhash="test_hash"))
            # First call fails, second succeeds
            mock_send.side_effect = [
                Exception("Transaction failed"),
                MagicMock(value="signature123"),
            ]

            result = await client.send_transaction(transaction, [keypair], max_retries=2)
            assert result == "signature123"
            assert mock_send.call_count == 2

    @pytest.mark.asyncio
    async def test_send_transaction_max_retries_exceeded(self, client, keypair):
        """Test transaction sending when max retries exceeded."""
        transaction = Transaction.new_with_payer([], keypair.pubkey())

        with patch.object(client.client, "get_latest_blockhash") as mock_blockhash, \
             patch.object(client.client, "send_transaction") as mock_send:
            
            mock_blockhash.return_value = MagicMock(value=MagicMock(blockhash="test_hash"))
            mock_send.side_effect = Exception("Transaction failed")

            with pytest.raises(Exception, match="Transaction failed"):
                await client.send_transaction(transaction, [keypair], max_retries=2)

    def test_derive_agent_pda(self, client):
        """Test agent PDA derivation."""
        agent_id = "test_agent"
        owner = PublicKey("11111111111111111111111111111111")
        
        pda, bump = client.derive_agent_pda(agent_id, owner)
        assert isinstance(pda, PublicKey)
        assert isinstance(bump, int)

    def test_derive_mcp_server_pda(self, client):
        """Test MCP server PDA derivation."""
        server_id = "test_server"
        owner = PublicKey("11111111111111111111111111111111")
        
        pda, bump = client.derive_mcp_server_pda(server_id, owner)
        assert isinstance(pda, PublicKey)
        assert isinstance(bump, int)

    def test_instruction_building_methods(self, client):
        """Test instruction building methods."""
        owner = PublicKey("11111111111111111111111111111111")
        
        # Test register agent instruction
        instruction = client.build_register_agent_instruction(
            agent_id="test_agent",
            name="Test Agent",
            description="Test description",
            owner=owner,
        )
        assert instruction is not None

        # Test update agent instruction
        instruction = client.build_update_agent_instruction(
            agent_id="test_agent",
            owner=owner,
            updates={"name": "Updated Name"},
        )
        assert instruction is not None

        # Test deregister agent instruction
        instruction = client.build_deregister_agent_instruction(
            agent_id="test_agent", owner=owner
        )
        assert instruction is not None

    def test_serialization_methods(self, client):
        """Test serialization methods."""
        # Test serialize_agent_data
        agent_data = {
            "agent_id": "test_agent",
            "name": "Test Agent",
            "description": "Test description",
        }
        serialized = client.serialize_agent_data(agent_data)
        assert isinstance(serialized, bytes)

        # Test serialize_mcp_server_data
        server_data = {
            "server_id": "test_server",
            "name": "Test Server",
            "endpoint_url": "https://example.com",
        }
        serialized = client.serialize_mcp_server_data(server_data)
        assert isinstance(serialized, bytes)

    def test_deserialization_methods(self, client):
        """Test deserialization methods."""
        # Test deserialize_agent_account
        mock_data = b"mock_agent_data"
        with patch.object(client, "_deserialize_account_data") as mock_deserialize:
            mock_deserialize.return_value = {
                "agent_id": "test_agent",
                "name": "Test Agent",
                "description": "Test description",
                "owner": "11111111111111111111111111111111",
                "status": 1,
            }
            
            result = client.deserialize_agent_account(mock_data)
            assert result.agent_id == "test_agent"
            assert result.name == "Test Agent"

        # Test deserialize_mcp_server_account
        with patch.object(client, "_deserialize_account_data") as mock_deserialize:
            mock_deserialize.return_value = {
                "server_id": "test_server",
                "name": "Test Server",
                "endpoint_url": "https://example.com",
                "owner": "11111111111111111111111111111111",
            }
            
            result = client.deserialize_mcp_server_account(mock_data)
            assert result.server_id == "test_server"
            assert result.name == "Test Server"

    @pytest.mark.asyncio
    async def test_close_method(self, client):
        """Test client close method."""
        with patch.object(client.client, "close") as mock_close:
            await client.close()
            mock_close.assert_called_once()

    @pytest.mark.asyncio
    async def test_context_manager(self, client):
        """Test client as async context manager."""
        with patch.object(client, "close") as mock_close:
            async with client:
                pass
            mock_close.assert_called_once()