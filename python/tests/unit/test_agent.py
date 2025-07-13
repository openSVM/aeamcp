"""Tests for solana_ai_registries.agent module."""

import pytest
from unittest.mock import AsyncMock, Mock, patch

from solders.keypair import Keypair
from solders.pubkey import Pubkey
from solders.transaction import Transaction

from solana_ai_registries.agent import AgentRegistry
from solana_ai_registries.client import SolanaAIRegistriesClient
from solana_ai_registries.exceptions import (
    AgentNotFoundError,
    InvalidInputError,
    RegistrationError,
    SolanaAIRegistriesError,
)
from solana_ai_registries.types import AgentRegistryEntry, AgentStatus


class TestAgentRegistry:
    """Test the AgentRegistry class."""

    def setup_method(self):
        """Set up test fixtures."""
        self.mock_client = Mock(spec=SolanaAIRegistriesClient)
        self.agent_registry = AgentRegistry(self.mock_client)
        
        # Mock keypair and public key
        self.mock_owner = Mock(spec=Keypair)
        self.mock_pubkey = Mock(spec=Pubkey)
        self.mock_owner.pubkey.return_value = self.mock_pubkey
        
        # Sample agent data
        self.sample_agent_data = {
            "agent_id": "test_agent",
            "name": "Test Agent",
            "description": "A test agent for unit tests",
            "owner": self.mock_pubkey,
            "status": 1,  # Active
            "metadata_uri": "https://example.com/metadata.json",
            "created_at": 1640995200,
            "updated_at": 1640995200,
        }

    def test_init(self):
        """Test AgentRegistry initialization."""
        assert self.agent_registry.client == self.mock_client

    def test_agent_registry_has_required_methods(self):
        """Test that AgentRegistry has the expected methods."""
        assert hasattr(self.agent_registry, 'register_agent')
        assert hasattr(self.agent_registry, 'get_agent')
        assert hasattr(self.agent_registry, 'update_agent')
        assert hasattr(self.agent_registry, 'deregister_agent')
        assert hasattr(self.agent_registry, 'list_agents_by_owner')
        assert hasattr(self.agent_registry, 'search_agents')

    @pytest.mark.asyncio
    async def test_register_agent_success(self):
        """Test successful agent registration."""
        # Mock successful registration
        self.mock_client.get_agent_registry_entry = AsyncMock(return_value=None)
        self.mock_client.build_register_agent_instruction = Mock()
        self.mock_client.send_transaction = AsyncMock(return_value="tx_signature")
        
        with patch('solders.transaction.Transaction.new_with_payer') as mock_transaction:
            mock_transaction.return_value = Mock(spec=Transaction)
            
            result = await self.agent_registry.register_agent(
                agent_id="test_agent",
                name="Test Agent",
                description="A test agent",
                owner=self.mock_owner
            )
            
            assert result == "tx_signature"
            self.mock_client.get_agent_registry_entry.assert_called_once()
            self.mock_client.build_register_agent_instruction.assert_called_once()
            self.mock_client.send_transaction.assert_called_once()

    @pytest.mark.asyncio
    async def test_register_agent_already_exists(self):
        """Test registration fails when agent already exists."""
        # Mock existing agent
        self.mock_client.get_agent_registry_entry = AsyncMock(
            return_value={"data": [1, 2, 3, 4]}
        )
        self.mock_client.deserialize_agent_account = AsyncMock(
            return_value=self.sample_agent_data
        )
        
        with pytest.raises(RegistrationError, match="already exists"):
            await self.agent_registry.register_agent(
                agent_id="test_agent",
                name="Test Agent",
                description="A test agent",
                owner=self.mock_owner
            )

    @pytest.mark.asyncio
    async def test_register_agent_invalid_inputs(self):
        """Test registration fails with invalid inputs."""
        with pytest.raises(InvalidInputError):
            await self.agent_registry.register_agent(
                agent_id="a" * 100,  # Too long
                name="Test Agent",
                description="A test agent",
                owner=self.mock_owner
            )
        
        with pytest.raises(InvalidInputError):
            await self.agent_registry.register_agent(
                agent_id="test_agent",
                name="n" * 100,  # Too long
                description="A test agent",
                owner=self.mock_owner
            )

    @pytest.mark.asyncio
    async def test_register_agent_transaction_failure(self):
        """Test registration fails when transaction fails."""
        self.mock_client.get_agent_registry_entry = AsyncMock(return_value=None)
        self.mock_client.build_register_agent_instruction = Mock()
        self.mock_client.send_transaction = AsyncMock(
            side_effect=Exception("Transaction failed")
        )
        
        with patch('solders.transaction.Transaction.new_with_payer'):
            with pytest.raises(RegistrationError, match="Failed to register agent"):
                await self.agent_registry.register_agent(
                    agent_id="test_agent",
                    name="Test Agent",
                    description="A test agent",
                    owner=self.mock_owner
                )

    @pytest.mark.asyncio
    async def test_update_agent_success(self):
        """Test successful agent update."""
        # Mock existing agent
        self.mock_client.get_agent_registry_entry = AsyncMock(
            return_value={"data": [1, 2, 3, 4]}
        )
        self.mock_client.deserialize_agent_account = AsyncMock(
            return_value=self.sample_agent_data
        )
        self.mock_client.build_update_agent_instruction = Mock()
        self.mock_client.send_transaction = AsyncMock(return_value="tx_signature")
        
        with patch('solders.transaction.Transaction.new_with_payer'):
            result = await self.agent_registry.update_agent(
                agent_id="test_agent",
                owner=self.mock_owner,
                updates={"name": "Updated Name"}
            )
            
            assert result == "tx_signature"
            self.mock_client.build_update_agent_instruction.assert_called_once()
            self.mock_client.send_transaction.assert_called_once()

    @pytest.mark.asyncio
    async def test_update_agent_not_found(self):
        """Test update fails when agent doesn't exist."""
        self.mock_client.get_agent_registry_entry = AsyncMock(return_value=None)
        
        with pytest.raises(AgentNotFoundError, match="not found"):
            await self.agent_registry.update_agent(
                agent_id="nonexistent_agent",
                owner=self.mock_owner,
                updates={"name": "Updated Name"}
            )

    @pytest.mark.asyncio
    async def test_update_agent_invalid_updates(self):
        """Test update fails with invalid update data."""
        # Mock existing agent
        self.mock_client.get_agent_registry_entry = AsyncMock(
            return_value={"data": [1, 2, 3, 4]}
        )
        self.mock_client.deserialize_agent_account = AsyncMock(
            return_value=self.sample_agent_data
        )
        
        with pytest.raises(InvalidInputError):
            await self.agent_registry.update_agent(
                agent_id="test_agent",
                owner=self.mock_owner,
                updates={"name": "n" * 100}  # Too long
            )

    @pytest.mark.asyncio
    async def test_get_agent_success(self):
        """Test successful agent retrieval."""
        self.mock_client.get_agent_registry_entry = AsyncMock(
            return_value={"data": [1, 2, 3, 4]}
        )
        self.mock_client.deserialize_agent_account = AsyncMock(
            return_value=self.sample_agent_data
        )
        
        result = await self.agent_registry.get_agent("test_agent", self.mock_pubkey)
        
        assert result is not None
        assert isinstance(result, AgentRegistryEntry)
        assert result.agent_id == "test_agent"
        assert result.name == "Test Agent"
        assert result.status == AgentStatus.ACTIVE

    @pytest.mark.asyncio
    async def test_get_agent_not_found(self):
        """Test agent retrieval when agent doesn't exist."""
        self.mock_client.get_agent_registry_entry = AsyncMock(return_value=None)
        
        result = await self.agent_registry.get_agent("nonexistent", self.mock_pubkey)
        assert result is None

    @pytest.mark.asyncio
    async def test_get_agent_invalid_data(self):
        """Test agent retrieval with invalid account data."""
        self.mock_client.get_agent_registry_entry = AsyncMock(
            return_value={"data": "invalid"}
        )
        
        result = await self.agent_registry.get_agent("test_agent", self.mock_pubkey)
        assert result is None

    @pytest.mark.asyncio
    async def test_get_agent_deserialization_error(self):
        """Test agent retrieval when deserialization fails."""
        self.mock_client.get_agent_registry_entry = AsyncMock(
            return_value={"data": [1, 2, 3, 4]}
        )
        self.mock_client.deserialize_agent_account = AsyncMock(
            side_effect=Exception("Deserialization failed")
        )
        
        result = await self.agent_registry.get_agent("test_agent", self.mock_pubkey)
        assert result is None

    @pytest.mark.asyncio
    async def test_deregister_agent_success(self):
        """Test successful agent deregistration."""
        # Mock existing agent
        self.mock_client.get_agent_registry_entry = AsyncMock(
            return_value={"data": [1, 2, 3, 4]}
        )
        self.mock_client.deserialize_agent_account = AsyncMock(
            return_value=self.sample_agent_data
        )
        self.mock_client.build_deregister_agent_instruction = Mock()
        self.mock_client.send_transaction = AsyncMock(return_value="tx_signature")
        
        with patch('solders.transaction.Transaction.new_with_payer'):
            result = await self.agent_registry.deregister_agent(
                agent_id="test_agent",
                owner=self.mock_owner
            )
            
            assert result == "tx_signature"
            self.mock_client.build_deregister_agent_instruction.assert_called_once()
            self.mock_client.send_transaction.assert_called_once()

    @pytest.mark.asyncio
    async def test_deregister_agent_not_found(self):
        """Test deregistration fails when agent doesn't exist."""
        self.mock_client.get_agent_registry_entry = AsyncMock(return_value=None)
        
        with pytest.raises(AgentNotFoundError, match="not found"):
            await self.agent_registry.deregister_agent(
                agent_id="nonexistent_agent",
                owner=self.mock_owner
            )

    @pytest.mark.asyncio
    async def test_list_agents_success(self):
        """Test successful agent listing."""
        mock_agents = [
            {"data": [1, 2, 3, 4]},
            {"data": [5, 6, 7, 8]},
        ]
        self.mock_client.list_agent_accounts = AsyncMock(return_value=mock_agents)
        self.mock_client.deserialize_agent_account = AsyncMock(
            return_value=self.sample_agent_data
        )
        
        result = await self.agent_registry.list_agents_by_owner(self.mock_pubkey)
        
        assert len(result) == 2
        assert all(isinstance(agent, AgentRegistryEntry) for agent in result)
        self.mock_client.list_agent_accounts.assert_called_once_with(self.mock_pubkey)

    @pytest.mark.asyncio
    async def test_list_agents_empty(self):
        """Test agent listing when no agents exist."""
        self.mock_client.list_agent_accounts = AsyncMock(return_value=[])
        
        result = await self.agent_registry.list_agents_by_owner(self.mock_pubkey)
        assert result == []

    @pytest.mark.asyncio
    async def test_search_agents_by_name(self):
        """Test agent search by name."""
        mock_agents = [
            {"data": [1, 2, 3, 4]},
            {"data": [5, 6, 7, 8]},
        ]
        self.mock_client.list_agent_accounts = AsyncMock(return_value=mock_agents)
        self.mock_client.deserialize_agent_account = AsyncMock(
            side_effect=[
                {"agent_id": "agent1", "name": "Trading Agent", "description": "desc", 
                 "owner": self.mock_pubkey, "status": 1, "created_at": 0, "updated_at": 0},
                {"agent_id": "agent2", "name": "Chat Agent", "description": "desc",
                 "owner": self.mock_pubkey, "status": 1, "created_at": 0, "updated_at": 0}
            ]
        )
        
        result = await self.agent_registry.search_agents(
            owner=self.mock_pubkey,
            name_contains="Trading"
        )
        
        assert len(result) == 1
        assert result[0].name == "Trading Agent"

    @pytest.mark.asyncio
    async def test_search_agents_by_status(self):
        """Test agent search by status."""
        mock_agents = [{"data": [1, 2, 3, 4]}]
        self.mock_client.list_agent_accounts = AsyncMock(return_value=mock_agents)
        self.mock_client.deserialize_agent_account = AsyncMock(
            return_value={
                "agent_id": "agent1", "name": "Active Agent", "description": "desc",
                "owner": self.mock_pubkey, "status": 1, "created_at": 0, "updated_at": 0
            }
        )
        
        result = await self.agent_registry.search_agents(
            owner=self.mock_pubkey,
            status=AgentStatus.ACTIVE
        )
        
        assert len(result) == 1
        assert result[0].status == AgentStatus.ACTIVE

    @pytest.mark.asyncio
    async def test_search_agents_no_results(self):
        """Test agent search with no matching results."""
        mock_agents = [{"data": [1, 2, 3, 4]}]
        self.mock_client.list_agent_accounts = AsyncMock(return_value=mock_agents)
        self.mock_client.deserialize_agent_account = AsyncMock(
            return_value={
                "agent_id": "agent1", "name": "Trading Agent", "description": "desc",
                "owner": self.mock_pubkey, "status": 1, "created_at": 0, "updated_at": 0
            }
        )
        
        result = await self.agent_registry.search_agents(
            owner=self.mock_pubkey,
            name_contains="NonExistent"
        )
        
        assert result == []