"""
Targeted tests to achieve 95%+ coverage for all core modules.

Focuses on testing the specific missing lines identified in the coverage report.
"""

import pytest
from unittest.mock import AsyncMock, Mock, patch
from typing import Optional
from solders.keypair import Keypair
from solders.pubkey import Pubkey as PublicKey
from solders.transaction import Transaction
from solders.instruction import Instruction

from solana_ai_registries.agent import AgentRegistry
from solana_ai_registries.mcp import McpServerRegistry  
from solana_ai_registries.client import SolanaAIRegistriesClient
from solana_ai_registries.payments import PaymentManager
from solana_ai_registries.idl import IDLLoader
from solana_ai_registries.exceptions import (
    RegistrationError,
    AgentNotFoundError,
    McpServerNotFoundError,
    InvalidInputError,
    PaymentError,
    ConnectionError,
    TransactionError,
)
from solana_ai_registries.types import (
    AgentRegistryEntry,
    AgentStatus,
    McpServerRegistryEntry, 
    McpServerStatus,
    PaymentType,
)


class TestAgentRegistryTargetedCoverage:
    """Targeted tests for agent.py missing lines."""

    @pytest.fixture
    def mock_client(self):
        """Create a mock client."""
        client = Mock(spec=SolanaAIRegistriesClient)
        # Create a real Instruction for tests
        from solders.instruction import AccountMeta, Instruction
        from solders.pubkey import Pubkey as PublicKey
        mock_instruction = Instruction(
            program_id=PublicKey.from_string("11111111111111111111111111111112"),
            accounts=[],
            data=b"test_data"
        )
        client.build_register_agent_instruction = Mock(return_value=mock_instruction)
        client.build_update_agent_instruction = Mock(return_value=mock_instruction)
        client.build_deregister_agent_instruction = Mock(return_value=mock_instruction)
        client.send_transaction = AsyncMock(return_value="signature123")
        client.get_agent_registry_entry = AsyncMock(return_value=None)
        return client

    @pytest.fixture
    def agent_registry(self, mock_client):
        """Create an agent registry with mock client."""
        return AgentRegistry(mock_client)

    @pytest.fixture
    def mock_keypair(self):
        """Create a mock keypair."""
        keypair = Mock(spec=Keypair)
        keypair.pubkey.return_value = PublicKey.from_string("11111111111111111111111111111112")
        return keypair

    @pytest.mark.asyncio
    @pytest.mark.asyncio
    async def test_register_agent_validation_errors(self, agent_registry, mock_keypair):
        """Test agent registration validation - lines 82-84."""
        # Test agent_id too long
        with pytest.raises(ValueError):
            await agent_registry.register_agent(
                agent_id="a" * 65,  # Exceeds MAX_AGENT_ID_LEN
                name="Test Agent",
                description="Test description",
                owner=mock_keypair
            )

        # Test name too long  
        with pytest.raises(ValueError):
            await agent_registry.register_agent(
                agent_id="test-agent",
                name="a" * 129,  # Exceeds MAX_AGENT_NAME_LEN
                description="Test description", 
                owner=mock_keypair
            )

        # Test description too long
        with pytest.raises(ValueError):
            await agent_registry.register_agent(
                agent_id="test-agent",
                name="Test Agent",
                description="a" * 513,  # Exceeds MAX_AGENT_DESCRIPTION_LEN
                owner=mock_keypair
            )

    @pytest.mark.asyncio
    @pytest.mark.asyncio
    async def test_register_agent_metadata_uri_validation(self, agent_registry, mock_keypair):
        """Test metadata URI validation - lines 86-87."""
        # Test invalid metadata URI
        with pytest.raises(ValueError):
            await agent_registry.register_agent(
                agent_id="test-agent",
                name="Test Agent", 
                description="Test description",
                owner=mock_keypair,
                metadata_uri="invalid-url"
            )

    @pytest.mark.asyncio
    @pytest.mark.asyncio
    async def test_register_agent_already_exists(self, agent_registry, mock_keypair, mock_client):
        """Test agent already exists check - lines 90-94."""
        # Mock existing agent found - return a mock AgentRegistryEntry instead of raw dict
        from solana_ai_registries.types import AgentRegistryEntry, AgentStatus
        mock_agent = AgentRegistryEntry(
            agent_id="test-agent",
            name="Existing Agent",
            description="Existing description",
            agent_version="1.0.0",
            owner="11111111111111111111111111111112",
            status=AgentStatus.ACTIVE
        )
        
        # We need to mock get_agent directly instead of get_agent_registry_entry
        with patch.object(agent_registry, 'get_agent', return_value=mock_agent):
            with pytest.raises(RegistrationError, match="Agent with ID 'test-agent' already exists"):
                await agent_registry.register_agent(
                    agent_id="test-agent",
                    name="Test Agent",
                    description="Test description", 
                    owner=mock_keypair
                )

    @pytest.mark.asyncio
    @pytest.mark.asyncio
    async def test_register_agent_transaction_flow(self, agent_registry, mock_keypair, mock_client):
        """Test successful registration transaction flow - lines 96-116."""
        # Mock no existing agent by patching get_agent directly
        with patch.object(agent_registry, 'get_agent', return_value=None):
            signature = await agent_registry.register_agent(
                agent_id="test-agent",
                name="Test Agent",
                description="Test description",
                owner=mock_keypair
            )
            
            assert signature == "signature123"
            mock_client.build_register_agent_instruction.assert_called_once()
            mock_client.send_transaction.assert_called_once()

    @pytest.mark.asyncio
    @pytest.mark.asyncio
    async def test_register_agent_transaction_error(self, agent_registry, mock_keypair, mock_client):
        """Test transaction error handling - line 116."""
        # Mock no existing agent and transaction failure
        mock_client.send_transaction.side_effect = Exception("Transaction failed")
        
        with patch.object(agent_registry, 'get_agent', return_value=None):
            with pytest.raises(RegistrationError, match="Failed to register agent"):
                await agent_registry.register_agent(
                    agent_id="test-agent",
                    name="Test Agent", 
                    description="Test description",
                    owner=mock_keypair
                )

    @pytest.mark.asyncio
    @pytest.mark.asyncio
    async def test_update_agent_validation_and_flow(self, agent_registry, mock_keypair, mock_client):
        """Test update agent validation and flow - lines 140-174."""
        # Test successful update
        signature = await agent_registry.update_agent(
            agent_id="test-agent",
            owner=mock_keypair,
            name="Updated Name"
        )
        
        assert signature == "signature123"
        mock_client.build_update_agent_instruction.assert_called_once()

    @pytest.mark.asyncio
    @pytest.mark.asyncio
    async def test_get_agent_not_found(self, agent_registry):
        """Test get agent when not found - lines 192-231."""
        # Mock agent not found
        agent_registry.client.get_agent_registry_entry.return_value = None
        
        with pytest.raises(AgentNotFoundError):
            await agent_registry.get_agent("nonexistent", PublicKey.from_string("11111111111111111111111111111112"))

    @pytest.mark.asyncio
    @pytest.mark.asyncio
    async def test_get_agent_success(self, agent_registry, mock_client):
        """Test successful agent retrieval - lines 192-231."""
        # Mock successful agent retrieval
        mock_data = {
            "agent_id": "test-agent",
            "name": "Test Agent",
            "description": "Test description",
            "agent_version": "1.0.0",
            "owner": "11111111111111111111111111111112",
            "status": 1,
        }
        mock_client.get_agent_registry_entry.return_value = mock_data
        
        agent = await agent_registry.get_agent("test-agent", PublicKey.from_string("11111111111111111111111111111112"))
        assert agent is not None
        assert agent.agent_id == "test-agent"

    @pytest.mark.asyncio
    @pytest.mark.asyncio
    async def test_deregister_agent_flow(self, agent_registry, mock_keypair, mock_client):
        """Test deregister agent flow - lines 248-268."""
        signature = await agent_registry.deregister_agent("test-agent", mock_keypair)
        
        assert signature == "signature123"
        mock_client.build_deregister_agent_instruction.assert_called_once()
        mock_client.send_transaction.assert_called_once()

    @pytest.mark.asyncio
    @pytest.mark.asyncio
    async def test_list_agents_by_owner(self, agent_registry, mock_client):
        """Test list agents by owner - lines 286-296."""
        # Mock agent list
        mock_agents = [
            {"agent_id": "agent1", "name": "Agent 1"},
            {"agent_id": "agent2", "name": "Agent 2"}
        ]
        mock_client.get_multiple_accounts = AsyncMock(return_value=mock_agents)
        
        agents = await agent_registry.list_agents_by_owner(PublicKey.from_string("11111111111111111111111111111112"))
        assert len(agents) == 2

    @pytest.mark.asyncio
    @pytest.mark.asyncio
    async def test_search_agents(self, agent_registry):
        """Test search agents functionality - lines 317-330."""
        # Test search with various filters
        results = await agent_registry.search_agents(status=AgentStatus.ACTIVE)
        assert isinstance(results, list)

        results = await agent_registry.search_agents(capabilities=["ai"])
        assert isinstance(results, list)

    @pytest.mark.asyncio
    @pytest.mark.asyncio
    async def test_update_agent_status(self, agent_registry, mock_keypair, mock_client):
        """Test update agent status - line 349."""
        signature = await agent_registry.update_agent_status("test-agent", mock_keypair, AgentStatus.INACTIVE)
        
        assert signature == "signature123"
        mock_client.build_update_agent_instruction.assert_called_once()


class TestMcpServerRegistryTargetedCoverage:
    """Targeted tests for mcp.py missing lines."""

    @pytest.fixture
    def mock_client(self):
        """Create a mock client."""
        client = Mock(spec=SolanaAIRegistriesClient)
        client.build_register_mcp_server_instruction = Mock(return_value=Mock(spec=Instruction))
        client.build_deregister_mcp_server_instruction = Mock(return_value=Mock(spec=Instruction))
        client.send_transaction = AsyncMock(return_value="signature123")
        client.get_mcp_server_registry_entry = AsyncMock(return_value=None)
        return client

    @pytest.fixture
    def mcp_registry(self, mock_client):
        """Create an MCP registry with mock client."""
        return McpServerRegistry(mock_client)

    @pytest.fixture  
    def mock_keypair(self):
        """Create a mock keypair."""
        keypair = Mock(spec=Keypair)
        keypair.pubkey.return_value = PublicKey.from_string("11111111111111111111111111111112")
        return keypair

    @pytest.mark.asyncio
    async def test_register_server_validation_errors(self, mcp_registry, mock_keypair):
        """Test server registration validation - lines 80-114."""
        # Test server_id too long
        with pytest.raises(ValueError):
            await mcp_registry.register_server(
                server_id="s" * 65,  # Exceeds MAX_SERVER_ID_LEN
                name="Test Server",
                server_version="1.0.0",
                endpoint_url="https://api.example.com",
                owner=mock_keypair
            )

        # Test name too long
        with pytest.raises(ValueError):
            await mcp_registry.register_server(
                server_id="test-server",
                name="s" * 129,  # Exceeds MAX_SERVER_NAME_LEN  
                server_version="1.0.0",
                endpoint_url="https://api.example.com",
                owner=mock_keypair
            )

        # Test invalid endpoint URL
        with pytest.raises(ValueError):
            await mcp_registry.register_server(
                server_id="test-server",
                name="Test Server",
                server_version="1.0.0", 
                endpoint_url="invalid-url",
                owner=mock_keypair
            )

    @pytest.mark.asyncio
    async def test_register_server_transaction_flow(self, mcp_registry, mock_keypair, mock_client):
        """Test successful server registration - lines 80-114."""
        signature = await mcp_registry.register_server(
            server_id="test-server",
            name="Test Server", 
            server_version="1.0.0",
            endpoint_url="https://api.example.com",
            owner=mock_keypair
        )
        
        assert signature == "signature123"
        mock_client.build_register_mcp_server_instruction.assert_called_once()
        mock_client.send_transaction.assert_called_once()

    @pytest.mark.asyncio
    async def test_update_server_flow(self, mcp_registry, mock_keypair, mock_client):
        """Test update server flow - lines 138-173."""
        # Mock update instruction building
        mock_client.build_update_mcp_server_instruction = Mock(return_value=Mock(spec=Instruction))
        
        signature = await mcp_registry.update_server(
            server_id="test-server",
            owner=mock_keypair,
            name="Updated Server"
        )
        
        assert signature == "signature123"

    @pytest.mark.asyncio
    async def test_get_server_not_found(self, mcp_registry):
        """Test get server when not found - lines 191-234."""
        # Mock server not found
        mcp_registry.client.get_mcp_server_registry_entry.return_value = None
        
        with pytest.raises(McpServerNotFoundError):
            await mcp_registry.get_server("nonexistent", PublicKey.from_string("11111111111111111111111111111112"))

    @pytest.mark.asyncio
    async def test_get_server_success(self, mcp_registry, mock_client):
        """Test successful server retrieval - lines 191-234."""
        # Mock successful server retrieval
        mock_data = {
            "server_id": "test-server",
            "name": "Test Server",
            "server_version": "1.0.0",
            "endpoint_url": "https://api.example.com",
            "owner": "11111111111111111111111111111112",
            "status": 1,
        }
        mock_client.get_mcp_server_registry_entry.return_value = mock_data
        
        server = await mcp_registry.get_server("test-server", PublicKey.from_string("11111111111111111111111111111112"))
        assert server is not None
        assert server.server_id == "test-server"

    @pytest.mark.asyncio
    async def test_deregister_server_flow(self, mcp_registry, mock_keypair, mock_client):
        """Test deregister server flow - lines 251-275."""
        signature = await mcp_registry.deregister_server("test-server", mock_keypair)
        
        assert signature == "signature123"
        mock_client.build_deregister_mcp_server_instruction.assert_called_once()
        mock_client.send_transaction.assert_called_once()

    @pytest.mark.asyncio
    async def test_list_servers_by_owner(self, mcp_registry, mock_client):
        """Test list servers by owner - lines 293-303."""
        # Mock server list
        mock_servers = [
            {"server_id": "server1", "name": "Server 1"},
            {"server_id": "server2", "name": "Server 2"}
        ]
        mock_client.get_multiple_accounts = AsyncMock(return_value=mock_servers)
        
        servers = await mcp_registry.list_servers_by_owner(PublicKey.from_string("11111111111111111111111111111112"))
        assert len(servers) == 2

    @pytest.mark.asyncio
    async def test_search_servers(self, mcp_registry):
        """Test search servers functionality - lines 324-337."""
        # Test search with various filters
        results = await mcp_registry.search_servers(status=McpServerStatus.ACTIVE)
        assert isinstance(results, list)

        results = await mcp_registry.search_servers(capabilities=["mcp"])
        assert isinstance(results, list)

    @pytest.mark.asyncio
    async def test_update_server_status(self, mcp_registry, mock_keypair, mock_client):
        """Test update server status - line 356."""
        # Mock update instruction building 
        mock_client.build_update_mcp_server_instruction = Mock(return_value=Mock(spec=Instruction))
        
        signature = await mcp_registry.update_server_status("test-server", mock_keypair, McpServerStatus.INACTIVE)
        
        assert signature == "signature123"

    @pytest.mark.asyncio
    async def test_ping_server(self, mcp_registry):
        """Test ping server functionality - lines 372-390."""
        result = await mcp_registry.ping_server("test-server", PublicKey.from_string("11111111111111111111111111111112"))
        assert isinstance(result, dict)
        assert "status" in result


class TestPaymentManagerTargetedCoverage:
    """Targeted tests for payments.py missing lines."""

    @pytest.fixture
    def mock_client(self):
        """Create a mock client."""
        client = Mock(spec=SolanaAIRegistriesClient)
        client.send_transaction = AsyncMock(return_value="signature123")
        client.get_balance = AsyncMock(return_value=1000000000)  # 1 SOL
        client.get_token_account_balance = AsyncMock(return_value=1000000)  # 1 A2AMPL
        return client

    @pytest.fixture
    def payment_manager(self, mock_client):
        """Create a payment manager with mock client."""
        return PaymentManager(mock_client)

    @pytest.fixture
    def mock_keypair(self):
        """Create a mock keypair."""
        keypair = Mock(spec=Keypair)
        keypair.pubkey.return_value = PublicKey.from_string("11111111111111111111111111111112")
        return keypair

    @pytest.mark.asyncio
    async def test_create_prepay_escrow_flow(self, payment_manager, mock_keypair, mock_client):
        """Test create prepay escrow flow - lines 82-127."""
        # Mock validation passes
        mock_client.get_token_account_balance.return_value = 10000000  # Sufficient balance
        
        result = await payment_manager.create_prepay_escrow(
            service_provider=PublicKey.from_string("11111111111111111111111111111112"),
            amount=1.0,
            payer=mock_keypair
        )
        
        assert "escrow_address" in result
        assert "signature" in result
        mock_client.send_transaction.assert_called_once()

    @pytest.mark.asyncio
    async def test_create_prepay_escrow_insufficient_funds(self, payment_manager, mock_keypair, mock_client):
        """Test escrow creation with insufficient funds."""
        # Mock insufficient balance
        mock_client.get_token_account_balance.return_value = 100  # Insufficient balance
        
        with pytest.raises(Exception):  # Should raise insufficient funds error
            await payment_manager.create_prepay_escrow(
                service_provider=PublicKey.from_string("11111111111111111111111111111112"),
                amount=1.0,
                payer=mock_keypair
            )

    @pytest.mark.asyncio
    async def test_pay_per_usage_flow(self, payment_manager, mock_keypair, mock_client):
        """Test pay per usage flow - lines 154-201."""
        # Mock validation passes
        mock_client.get_token_account_balance.return_value = 10000000  # Sufficient balance
        
        result = await payment_manager.pay_per_usage(
            service_provider=PublicKey.from_string("11111111111111111111111111111112"),
            amount=0.5,
            usage_data={"requests": 10, "tokens": 500},
            payer=mock_keypair
        )
        
        assert "payment_id" in result
        assert "signature" in result
        mock_client.send_transaction.assert_called_once()

    @pytest.mark.asyncio
    async def test_create_payment_stream_flow(self, payment_manager, mock_keypair, mock_client):
        """Test create payment stream flow - lines 228-264."""
        # Mock validation passes
        mock_client.get_token_account_balance.return_value = 10000000  # Sufficient balance
        
        stream = payment_manager.create_payment_stream(
            service_provider=PublicKey.from_string("11111111111111111111111111111112"),
            rate_per_second=0.01,
            duration_seconds=60,
            payer=mock_keypair
        )
        
        # Test the async generator
        first_payment = await stream.__anext__()
        assert "payment_id" in first_payment
        assert "amount" in first_payment

    @pytest.mark.asyncio
    async def test_execute_payment_stream(self, payment_manager, mock_keypair, mock_client):
        """Test execute payment stream - lines 276-307."""
        # Mock validation passes
        mock_client.get_token_account_balance.return_value = 10000000  # Sufficient balance
        
        # Test direct call to internal method
        async for payment in payment_manager._execute_payment_stream(
            service_provider=PublicKey.from_string("11111111111111111111111111111112"),
            rate_per_second=0.01,
            duration_seconds=2,  # Short duration for testing
            payer=mock_keypair
        ):
            assert "payment_id" in payment
            break  # Just test one iteration

    @pytest.mark.asyncio
    async def test_get_escrow_balance(self, payment_manager):
        """Test get escrow balance - lines 325-340."""
        balance = await payment_manager.get_escrow_balance(
            payer=PublicKey.from_string("11111111111111111111111111111112"),
            service_provider=PublicKey.from_string("11111111111111111111111111111112")
        )
        
        assert isinstance(balance, float)

    @pytest.mark.asyncio
    async def test_withdraw_from_escrow(self, payment_manager, mock_keypair, mock_client):
        """Test withdraw from escrow - lines 363-415."""
        result = await payment_manager.withdraw_from_escrow(
            service_provider=PublicKey.from_string("11111111111111111111111111111112"),
            amount=0.5,
            payer=mock_keypair
        )
        
        assert "signature" in result
        mock_client.send_transaction.assert_called_once()

    @pytest.mark.asyncio
    async def test_get_payment_history(self, payment_manager):
        """Test get payment history - lines 436-448."""
        history = await payment_manager.get_payment_history(
            payer=PublicKey.from_string("11111111111111111111111111111112")
        )
        
        assert isinstance(history, list)

    @pytest.mark.asyncio
    async def test_validate_balance_insufficient(self, payment_manager, mock_client):
        """Test balance validation with insufficient funds - lines 475-493."""
        # Mock insufficient balance
        mock_client.get_token_account_balance.return_value = 100  # Insufficient
        
        with pytest.raises(Exception):  # Should raise insufficient funds error
            await payment_manager._validate_balance(
                PublicKey.from_string("11111111111111111111111111111112"),
                required_amount=10000000
            )

    @pytest.mark.asyncio
    async def test_get_associated_token_account(self, payment_manager, mock_client):
        """Test get associated token account - lines 507-518."""
        # Mock associated token account
        mock_client.get_account_info = AsyncMock(return_value=Mock())
        
        account = await payment_manager._get_associated_token_account(
            PublicKey.from_string("11111111111111111111111111111112")
        )
        
        assert isinstance(account, PublicKey)

    @pytest.mark.asyncio
    async def test_stop_payment_stream(self, payment_manager):
        """Test stop payment stream - lines 566-573."""
        # Add a mock active stream
        payment_manager._active_streams["test-stream"] = Mock()
        payment_manager._active_streams["test-stream"].cancel = Mock()
        
        await payment_manager.stop_payment_stream("test-stream")
        
        assert "test-stream" not in payment_manager._active_streams

    def test_calculate_stream_cost(self, payment_manager):
        """Test calculate stream cost - line 586."""
        cost = payment_manager._calculate_stream_cost(0.01, 60)
        assert cost == 0.6

    def test_validate_payment_amount_valid(self, payment_manager):
        """Test valid payment amount validation - line 623-628."""
        # Should not raise for valid amounts
        payment_manager._validate_payment_amount(1.0)
        payment_manager._validate_payment_amount(0.1)

    def test_validate_payment_amount_invalid(self, payment_manager):
        """Test invalid payment amount validation - line 632, 636."""
        with pytest.raises(PaymentError):
            payment_manager._validate_payment_amount(0.0)
        
        with pytest.raises(PaymentError):
            payment_manager._validate_payment_amount(-1.0)

    def test_generate_payment_id(self, payment_manager):
        """Test payment ID generation."""
        payment_id = payment_manager._generate_payment_id(
            PublicKey.from_string("11111111111111111111111111111112"),
            PublicKey.from_string("11111111111111111111111111111113"),
            "test-service"
        )
        
        assert isinstance(payment_id, str)
        assert len(payment_id) > 0

    @pytest.mark.asyncio
    async def test_context_manager(self, payment_manager):
        """Test async context manager."""
        async with payment_manager as pm:
            assert pm is payment_manager


class TestClientTargetedCoverage:
    """Targeted tests for client.py missing lines."""

    @pytest.fixture
    def client(self):
        """Create a client."""
        return SolanaAIRegistriesClient()

    @pytest.mark.asyncio
    async def test_get_account_info_error_handling(self, client):
        """Test get_account_info error handling - lines 95-112."""
        # Mock client to raise ConnectionError
        with patch.object(client._client, 'get_account_info', side_effect=Exception("Connection failed")):
            with pytest.raises(ConnectionError):
                await client.get_account_info(PublicKey.from_string("11111111111111111111111111111112"))

    @pytest.mark.asyncio
    async def test_get_agent_registry_entry_not_found(self, client):
        """Test get agent registry entry when not found - lines 130-147."""
        # Mock client to return None account
        with patch.object(client._client, 'get_account_info', return_value=Mock(value=None)):
            result = await client.get_agent_registry_entry("test-agent", PublicKey.from_string("11111111111111111111111111111112"))
            assert result is None

    @pytest.mark.asyncio
    async def test_get_mcp_server_registry_entry_not_found(self, client):
        """Test get MCP server registry entry when not found - lines 165-182."""
        # Mock client to return None account  
        with patch.object(client._client, 'get_account_info', return_value=Mock(value=None)):
            result = await client.get_mcp_server_registry_entry("test-server", PublicKey.from_string("11111111111111111111111111111112"))
            assert result is None

    @pytest.mark.asyncio
    async def test_send_transaction_error_handling(self, client):
        """Test send transaction error handling - lines 206-236."""
        # Mock client to raise exception
        with patch.object(client._client, 'send_transaction', side_effect=Exception("Transaction failed")):
            with pytest.raises(TransactionError):
                await client.send_transaction(Mock(spec=Transaction), [Mock(spec=Keypair)])

    @pytest.mark.asyncio
    async def test_simulate_transaction_error_handling(self, client):
        """Test simulate transaction error handling - lines 258-280."""
        # Mock client to raise exception
        with patch.object(client._client, 'simulate_transaction', side_effect=Exception("Simulation failed")):
            result = await client.simulate_transaction(Mock(spec=Transaction))
            assert result is None

    @pytest.mark.asyncio
    async def test_get_balance_error_handling(self, client):
        """Test get balance error handling - lines 295-299."""
        # Mock client to raise exception
        with patch.object(client._client, 'get_balance', side_effect=Exception("Balance fetch failed")):
            with pytest.raises(ConnectionError):
                await client.get_balance(PublicKey.from_string("11111111111111111111111111111112"))

    @pytest.mark.asyncio
    async def test_get_token_account_balance_error_handling(self, client):
        """Test get token account balance error handling - lines 316-327."""
        # Mock client to raise exception
        with patch.object(client._client, 'get_token_account_balance', side_effect=Exception("Token balance fetch failed")):
            with pytest.raises(ConnectionError):
                await client.get_token_account_balance(PublicKey.from_string("11111111111111111111111111111112"))

    @pytest.mark.asyncio
    async def test_deserialize_agent_account_error_handling(self, client):
        """Test deserialize agent account error handling - lines 673-731."""
        # Test with invalid data
        result = await client.deserialize_agent_account(b"invalid_data")
        assert result == {}

    @pytest.mark.asyncio
    async def test_deserialize_mcp_server_account_error_handling(self, client):
        """Test deserialize MCP server account error handling - lines 745-792.""" 
        # Test with invalid data
        result = await client.deserialize_mcp_server_account(b"invalid_data")
        assert result == {}


class TestIDLLoaderTargetedCoverage:
    """Targeted tests for idl.py missing lines."""

    @pytest.fixture
    def idl_loader(self):
        """Create an IDL loader."""
        return IDLLoader()

    def test_load_from_resources_error_handling(self, idl_loader):
        """Test load from resources error handling - lines 90-108."""
        # Test with non-existent program
        with pytest.raises(Exception):
            idl_loader._load_from_resources("nonexistent_program")

    def test_load_from_file_error_handling(self, idl_loader):
        """Test load from file error handling - lines 112-124."""
        # Test with non-existent file
        with pytest.raises(Exception):
            idl_loader._load_from_file("nonexistent_program")

    def test_parse_idl_error_handling(self, idl_loader):
        """Test parse IDL error handling - lines 129-146."""
        # Test with invalid IDL data
        invalid_idl = {"invalid": "data"}
        
        with pytest.raises(Exception):
            idl_loader._parse_idl(invalid_idl)

    def test_generate_types_coverage(self, idl_loader):
        """Test generate types coverage - lines 206-232."""
        # Create minimal valid parsed IDL
        from solana_ai_registries.idl import ParsedIdl, IdlInstruction, IdlAccount, IdlType
        
        parsed_idl = ParsedIdl(
            version="0.1.0",
            name="test_program",
            instructions=[],
            accounts=[],
            types=[],
            errors=[],
            metadata={}
        )
        
        types = idl_loader.generate_types(parsed_idl)
        assert isinstance(types, dict)

    def test_generate_account_class_coverage(self, idl_loader):
        """Test generate account class coverage - lines 236-246."""
        from solana_ai_registries.idl import IdlAccount
        
        account = IdlAccount(
            name="TestAccount",
            type={"kind": "struct", "fields": []},
            discriminant=1
        )
        
        account_class = idl_loader._generate_account_class(account)
        assert account_class is not None

    def test_generate_type_class_coverage(self, idl_loader):
        """Test generate type class coverage - lines 259-274."""
        from solana_ai_registries.idl import IdlType
        
        idl_type = IdlType(
            name="TestType", 
            type={"kind": "enum", "variants": []}
        )
        
        type_class = idl_loader._generate_type_class(idl_type)
        assert type_class is not None

    def test_generate_instruction_class_coverage(self, idl_loader):
        """Test generate instruction class coverage - lines 287-294."""
        from solana_ai_registries.idl import IdlInstruction
        
        instruction = IdlInstruction(
            name="test_instruction",
            accounts=[],
            args=[],
            discriminant=0
        )
        
        instruction_class = idl_loader._generate_instruction_class(instruction)
        assert instruction_class is not None

    def test_map_idl_type_to_python_complex_types(self, idl_loader):
        """Test complex type mapping - lines 342-354."""
        # Test option type
        result = idl_loader._map_idl_type_to_python({"option": "string"})
        assert result is not None
        
        # Test defined type
        result = idl_loader._map_idl_type_to_python({"defined": "CustomType"})
        assert result is not None

    def test_get_instruction_discriminant_coverage(self, idl_loader):
        """Test get instruction discriminant - lines 369-377."""
        # Create minimal parsed IDL with instruction
        from solana_ai_registries.idl import ParsedIdl, IdlInstruction
        
        instruction = IdlInstruction(
            name="test_instruction",
            accounts=[],
            args=[],
            discriminant=123
        )
        
        parsed_idl = ParsedIdl(
            version="0.1.0",
            name="test_program", 
            instructions=[instruction],
            accounts=[],
            types=[],
            errors=[],
            metadata={}
        )
        
        discriminant = idl_loader.get_instruction_discriminant(parsed_idl, "test_instruction")
        assert discriminant == 123

    def test_get_instruction_discriminant_not_found(self, idl_loader):
        """Test get instruction discriminant when not found - lines 369-377."""
        from solana_ai_registries.idl import ParsedIdl
        
        parsed_idl = ParsedIdl(
            version="0.1.0",
            name="test_program",
            instructions=[],
            accounts=[],
            types=[],
            errors=[],
            metadata={}
        )
        
        discriminant = idl_loader.get_instruction_discriminant(parsed_idl, "nonexistent")
        assert discriminant is None

    def test_get_account_layout_coverage(self, idl_loader):
        """Test get account layout - lines 392-400."""
        from solana_ai_registries.idl import ParsedIdl, IdlAccount
        
        account = IdlAccount(
            name="TestAccount",
            type={"kind": "struct", "fields": []},
            discriminant=1
        )
        
        parsed_idl = ParsedIdl(
            version="0.1.0",
            name="test_program",
            instructions=[],
            accounts=[account],
            types=[],
            errors=[],
            metadata={}
        )
        
        layout = idl_loader.get_account_layout(parsed_idl, "TestAccount")
        assert layout is not None

    def test_clear_cache_coverage(self, idl_loader):
        """Test clear cache - lines 404-406."""
        # Add something to cache first
        idl_loader._cache["test"] = "data"
        idl_loader._generated_types["test"] = str
        
        idl_loader.clear_cache()
        
        assert len(idl_loader._cache) == 0
        assert len(idl_loader._generated_types) == 0