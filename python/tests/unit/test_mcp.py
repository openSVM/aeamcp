"""Tests for solana_ai_registries.mcp module."""

import pytest
from unittest.mock import AsyncMock, Mock, patch

from solders.keypair import Keypair
from solders.pubkey import Pubkey
from solders.transaction import Transaction

from solana_ai_registries.mcp import McpServerRegistry
from solana_ai_registries.client import SolanaAIRegistriesClient
from solana_ai_registries.exceptions import (
    InvalidInputError,
    McpServerNotFoundError,
    RegistrationError,
    SolanaAIRegistriesError,
)
from solana_ai_registries.types import McpServerRegistryEntry, McpServerStatus


class TestMcpServerRegistry:
    """Test the McpServerRegistry class."""

    def setup_method(self):
        """Set up test fixtures."""
        self.mock_client = Mock(spec=SolanaAIRegistriesClient)
        self.mcp_registry = McpServerRegistry(self.mock_client)
        
        # Mock keypair and public key
        self.mock_owner = Mock(spec=Keypair)
        self.mock_pubkey = Mock(spec=Pubkey)
        self.mock_owner.pubkey.return_value = self.mock_pubkey
        
        # Sample MCP server data
        self.sample_server_data = {
            "server_id": "test_server",
            "name": "Test MCP Server",
            "description": "A test MCP server",
            "owner": self.mock_pubkey,
            "status": 1,  # Active
            "endpoint": "https://api.example.com/mcp",
            "metadata_uri": "https://example.com/metadata.json",
            "created_at": 1640995200,
            "updated_at": 1640995200,
        }

    def test_init(self):
        """Test McpServerRegistry initialization."""
        assert self.mcp_registry.client == self.mock_client

    def test_mcp_registry_has_required_methods(self):
        """Test that McpServerRegistry has the expected methods."""
        assert hasattr(self.mcp_registry, 'register_server')
        assert hasattr(self.mcp_registry, 'get_server')
        assert hasattr(self.mcp_registry, 'update_server')
        assert hasattr(self.mcp_registry, 'deregister_server')
        assert hasattr(self.mcp_registry, 'list_servers_by_owner')
        assert hasattr(self.mcp_registry, 'search_servers')
        assert hasattr(self.mcp_registry, 'ping_server')

    @pytest.mark.asyncio
    async def test_register_server_success(self):
        """Test successful MCP server registration."""
        # Mock successful registration
        self.mock_client.get_mcp_server_registry_entry = AsyncMock(return_value=None)
        self.mock_client.build_register_mcp_server_instruction = Mock()
        self.mock_client.send_transaction = AsyncMock(return_value="tx_signature")
        
        with patch('solders.transaction.Transaction.new_with_payer') as mock_transaction:
            mock_transaction.return_value = Mock(spec=Transaction)
            
            result = await self.mcp_registry.register_server(
                server_id="test_server",
                name="Test MCP Server",
                endpoint_url="https://api.example.com/mcp",
                owner=self.mock_owner,
                description="A test MCP server"
            )
            
            assert result == "tx_signature"
            self.mock_client.get_mcp_server_registry_entry.assert_called_once()
            self.mock_client.build_register_mcp_server_instruction.assert_called_once()
            self.mock_client.send_transaction.assert_called_once()

    @pytest.mark.asyncio
    async def test_register_server_already_exists(self):
        """Test registration fails when server already exists."""
        # Mock existing server
        self.mock_client.get_mcp_server_registry_entry = AsyncMock(
            return_value={"data": [1, 2, 3, 4]}
        )
        self.mock_client.deserialize_mcp_server_account = AsyncMock(
            return_value=self.sample_server_data
        )
        
        with pytest.raises(RegistrationError, match="already exists"):
            await self.mcp_registry.register_server(
                server_id="test_server",
                name="Test MCP Server",
                endpoint_url="https://api.example.com/mcp",
                owner=self.mock_owner,
                description="A test MCP server"
            )

    @pytest.mark.asyncio
    async def test_register_server_invalid_inputs(self):
        """Test registration fails with invalid inputs."""
        with pytest.raises(InvalidInputError):
            await self.mcp_registry.register_server(
                server_id="s" * 100,  # Too long
                name="Test Server",
                endpoint_url="https://api.example.com/mcp",
                owner=self.mock_owner,
                description="A test server"
            )
        
        with pytest.raises(InvalidInputError):
            await self.mcp_registry.register_server(
                server_id="test_server",
                name="Test Server",
                endpoint_url="invalid_url",  # Invalid URL
                owner=self.mock_owner,
                description="A test server"
            )

    @pytest.mark.asyncio
    async def test_update_server_success(self):
        """Test successful MCP server update."""
        # Mock existing server
        self.mock_client.get_mcp_server_registry_entry = AsyncMock(
            return_value={"data": [1, 2, 3, 4]}
        )
        self.mock_client.deserialize_mcp_server_account = AsyncMock(
            return_value=self.sample_server_data
        )
        self.mock_client.build_update_mcp_server_instruction = Mock()
        self.mock_client.send_transaction = AsyncMock(return_value="tx_signature")
        
        with patch('solders.transaction.Transaction.new_with_payer'):
            result = await self.mcp_registry.update_server(
                server_id="test_server",
                owner=self.mock_owner,
                updates={"name": "Updated Server Name"}
            )
            
            assert result == "tx_signature"
            self.mock_client.build_update_mcp_server_instruction.assert_called_once()
            self.mock_client.send_transaction.assert_called_once()

    @pytest.mark.asyncio
    async def test_update_server_not_found(self):
        """Test update fails when server doesn't exist."""
        self.mock_client.get_mcp_server_registry_entry = AsyncMock(return_value=None)
        
        with pytest.raises(McpServerNotFoundError, match="not found"):
            await self.mcp_registry.update_server(
                server_id="nonexistent_server",
                owner=self.mock_owner,
                updates={"name": "Updated Name"}
            )

    @pytest.mark.asyncio
    async def test_get_server_success(self):
        """Test successful MCP server retrieval."""
        self.mock_client.get_mcp_server_registry_entry = AsyncMock(
            return_value={"data": [1, 2, 3, 4]}
        )
        self.mock_client.deserialize_mcp_server_account = AsyncMock(
            return_value=self.sample_server_data
        )
        
        result = await self.mcp_registry.get_server("test_server", self.mock_pubkey)
        
        assert result is not None
        assert isinstance(result, McpServerRegistryEntry)
        assert result.server_id == "test_server"
        assert result.name == "Test MCP Server"
        assert result.status == McpServerStatus.ACTIVE

    @pytest.mark.asyncio
    async def test_get_server_not_found(self):
        """Test server retrieval when server doesn't exist."""
        self.mock_client.get_mcp_server_registry_entry = AsyncMock(return_value=None)
        
        result = await self.mcp_registry.get_server("nonexistent", self.mock_pubkey)
        assert result is None

    @pytest.mark.asyncio
    async def test_deregister_server_success(self):
        """Test successful MCP server deregistration."""
        # Mock existing server
        self.mock_client.get_mcp_server_registry_entry = AsyncMock(
            return_value={"data": [1, 2, 3, 4]}
        )
        self.mock_client.deserialize_mcp_server_account = AsyncMock(
            return_value=self.sample_server_data
        )
        self.mock_client.build_deregister_mcp_server_instruction = Mock()
        self.mock_client.send_transaction = AsyncMock(return_value="tx_signature")
        
        with patch('solders.transaction.Transaction.new_with_payer'):
            result = await self.mcp_registry.deregister_server(
                server_id="test_server",
                owner=self.mock_owner
            )
            
            assert result == "tx_signature"
            self.mock_client.build_deregister_mcp_server_instruction.assert_called_once()
            self.mock_client.send_transaction.assert_called_once()

    @pytest.mark.asyncio
    async def test_deregister_server_not_found(self):
        """Test deregistration fails when server doesn't exist."""
        self.mock_client.get_mcp_server_registry_entry = AsyncMock(return_value=None)
        
        with pytest.raises(McpServerNotFoundError, match="not found"):
            await self.mcp_registry.deregister_server(
                server_id="nonexistent_server",
                owner=self.mock_owner
            )

    @pytest.mark.asyncio
    async def test_list_servers_success(self):
        """Test successful server listing."""
        mock_servers = [
            {"data": [1, 2, 3, 4]},
            {"data": [5, 6, 7, 8]},
        ]
        self.mock_client.list_mcp_server_accounts = AsyncMock(return_value=mock_servers)
        self.mock_client.deserialize_mcp_server_account = AsyncMock(
            return_value=self.sample_server_data
        )
        
        result = await self.mcp_registry.list_servers_by_owner(self.mock_pubkey)
        
        assert len(result) == 2
        assert all(isinstance(server, McpServerRegistryEntry) for server in result)
        self.mock_client.list_mcp_server_accounts.assert_called_once_with(self.mock_pubkey)

    @pytest.mark.asyncio
    async def test_search_servers_by_name(self):
        """Test server search by name."""
        mock_servers = [{"data": [1, 2, 3, 4]}]
        self.mock_client.list_mcp_server_accounts = AsyncMock(return_value=mock_servers)
        self.mock_client.deserialize_mcp_server_account = AsyncMock(
            return_value={
                "server_id": "server1", "name": "API Server", "description": "desc",
                "owner": self.mock_pubkey, "status": 1, "endpoint": "https://api.com",
                "created_at": 0, "updated_at": 0
            }
        )
        
        result = await self.mcp_registry.search_servers(
            owner=self.mock_pubkey,
            name_contains="API"
        )
        
        assert len(result) == 1
        assert result[0].name == "API Server"

    @pytest.mark.asyncio
    async def test_ping_server_success(self):
        """Test successful server ping."""
        # Mock existing server
        self.mock_client.get_mcp_server_registry_entry = AsyncMock(
            return_value={"data": [1, 2, 3, 4]}
        )
        self.mock_client.deserialize_mcp_server_account = AsyncMock(
            return_value=self.sample_server_data
        )
        
        with patch('httpx.AsyncClient') as mock_http:
            mock_response = Mock()
            mock_response.status_code = 200
            mock_response.json.return_value = {"status": "ok"}
            mock_http.return_value.__aenter__.return_value.get.return_value = mock_response
            
            result = await self.mcp_registry.ping_server("test_server", self.mock_pubkey)
            
            assert result["status"] == "healthy"
            assert result["response_time"] > 0

    @pytest.mark.asyncio
    async def test_ping_server_not_found(self):
        """Test ping fails when server doesn't exist."""
        self.mock_client.get_mcp_server_registry_entry = AsyncMock(return_value=None)
        
        with pytest.raises(McpServerNotFoundError, match="not found"):
            await self.mcp_registry.ping_server("nonexistent_server", self.mock_pubkey)

    @pytest.mark.asyncio
    async def test_ping_server_unreachable(self):
        """Test ping when server is unreachable."""
        # Mock existing server
        self.mock_client.get_mcp_server_registry_entry = AsyncMock(
            return_value={"data": [1, 2, 3, 4]}
        )
        self.mock_client.deserialize_mcp_server_account = AsyncMock(
            return_value=self.sample_server_data
        )
        
        with patch('httpx.AsyncClient') as mock_http:
            mock_http.return_value.__aenter__.return_value.get.side_effect = Exception("Connection failed")
            
            result = await self.mcp_registry.ping_server("test_server", self.mock_pubkey)
            
            assert result["status"] == "unreachable"
            assert "error" in result