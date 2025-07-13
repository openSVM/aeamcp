"""Comprehensive tests for solana_ai_registries.mcp module."""

import pytest
from unittest.mock import AsyncMock, Mock, patch
from typing import List, Optional, Dict, Any

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
from solana_ai_registries.types import (
    McpServerRegistryEntry, 
    McpServerStatus, 
    McpCapabilities
)


class TestMcpServerRegistry:
    """Comprehensive test coverage for McpServerRegistry class."""

    def setup_method(self):
        """Set up test fixtures."""
        self.mock_client = Mock(spec=SolanaAIRegistriesClient)
        self.mcp_registry = McpServerRegistry(self.mock_client)
        
        # Create real keypair and public key
        self.owner_keypair = Keypair()
        self.other_pubkey = Keypair().pubkey()
        
        # Mock client methods
        self.mock_client.get_account_info = AsyncMock()
        self.mock_client.build_and_send_transaction = AsyncMock()
        self.mock_client.get_program_accounts = AsyncMock()
        
        # Sample MCP server data
        self.sample_server_data = {
            "server_id": "test_server",
            "name": "Test MCP Server",
            "description": "A test MCP server",
            "owner": self.owner_keypair.pubkey(),
            "status": McpServerStatus.ACTIVE,
            "endpoint_url": "https://api.example.com/mcp",
            "metadata_uri": "https://example.com/metadata.json",
            "created_at": 1640995200,
            "updated_at": 1640995200,
        }

    def test_init(self):
        """Test McpServerRegistry initialization."""
        registry = McpServerRegistry(self.mock_client)
        assert registry.client == self.mock_client

    def test_mcp_registry_has_required_methods(self):
        """Test that McpServerRegistry has the expected methods."""
        assert hasattr(self.mcp_registry, 'register_server')
        assert hasattr(self.mcp_registry, 'update_server')
        assert hasattr(self.mcp_registry, 'update_server_status')
        assert hasattr(self.mcp_registry, 'get_server')
        assert hasattr(self.mcp_registry, 'deregister_server')
        assert hasattr(self.mcp_registry, 'list_servers_by_owner')
        assert hasattr(self.mcp_registry, 'search_servers')
        assert hasattr(self.mcp_registry, 'ping_server')

    # Registration Tests
    @pytest.mark.asyncio
    async def test_register_server_success(self):
        """Test successful MCP server registration."""
        # Mock successful registration
        self.mock_client.build_and_send_transaction.return_value = "mock_tx_signature"
        
        result = await self.mcp_registry.register_server(
            server_id="test_server",
            name="Test MCP Server",
            endpoint_url="https://api.example.com/mcp",
            owner=self.owner_keypair
        )
        
        assert result == "mock_tx_signature"

    @pytest.mark.asyncio
    async def test_register_server_with_capabilities(self):
        """Test MCP server registration with capabilities."""
        capabilities = McpCapabilities(
            tools=True,
            resources=True,
            prompts=False
        )
        
        self.mock_client.build_and_send_transaction.return_value = "mock_tx_signature"
        
        result = await self.mcp_registry.register_server(
            server_id="test_server",
            name="Test MCP Server",
            endpoint_url="https://api.example.com/mcp",
            owner=self.owner_keypair,
            capabilities=capabilities,
            description="Test server with capabilities",
            metadata_uri="https://example.com/metadata.json"
        )
        
        assert result == "mock_tx_signature"

    @pytest.mark.asyncio
    async def test_register_server_invalid_server_id(self):
        """Test server registration with invalid server ID."""
        # Test empty server ID
        with pytest.raises(InvalidInputError, match="server_id cannot be empty"):
            await self.mcp_registry.register_server(
                server_id="",
                name="Test Server",
                endpoint_url="https://api.example.com/mcp",
                owner=self.owner_keypair
            )
        
        # Test server ID too long
        long_server_id = "x" * 65  # Exceeds MAX_SERVER_ID_LEN (64)
        with pytest.raises(InvalidInputError, match="server_id exceeds maximum length"):
            await self.mcp_registry.register_server(
                server_id=long_server_id,
                name="Test Server",
                endpoint_url="https://api.example.com/mcp",
                owner=self.owner_keypair
            )

    @pytest.mark.asyncio
    async def test_register_server_invalid_name(self):
        """Test server registration with invalid name."""
        with pytest.raises(InvalidInputError, match="name cannot be empty"):
            await self.mcp_registry.register_server(
                server_id="test_server",
                name="",
                endpoint_url="https://api.example.com/mcp",
                owner=self.owner_keypair
            )

    @pytest.mark.asyncio
    async def test_register_server_invalid_endpoint(self):
        """Test server registration with invalid endpoint URL."""
        with pytest.raises(InvalidInputError, match="endpoint_url must be a valid URL"):
            await self.mcp_registry.register_server(
                server_id="test_server",
                name="Test Server",
                endpoint_url="not-a-valid-url",
                owner=self.owner_keypair
            )

    @pytest.mark.asyncio
    async def test_register_server_already_exists(self):
        """Test server registration when server already exists."""
        # Mock account exists (server already registered)
        mock_account_info = Mock()
        mock_account_info.value = Mock()
        mock_account_info.value.data = b'\x00' * 100  # Mock account data
        self.mock_client.get_account_info.return_value = mock_account_info
        
        with pytest.raises(RegistrationError, match="already exists"):
            await self.mcp_registry.register_server(
                server_id="existing_server",
                name="Test Server",
                endpoint_url="https://api.example.com/mcp",
                owner=self.owner_keypair
            )

    @pytest.mark.asyncio
    async def test_register_server_transaction_failure(self):
        """Test server registration when transaction fails."""
        # Mock account doesn't exist (new registration)
        self.mock_client.get_account_info.return_value = None
        # Mock transaction failure
        self.mock_client.build_and_send_transaction.side_effect = Exception("Transaction failed")
        
        with pytest.raises(RegistrationError, match="Failed to register MCP server"):
            await self.mcp_registry.register_server(
                server_id="test_server",
                name="Test Server",
                endpoint_url="https://api.example.com/mcp",
                owner=self.owner_keypair
            )

    # Update Tests
    @pytest.mark.asyncio
    async def test_update_server_success(self):
        """Test successful server update."""
        # Mock server exists
        mock_server = McpServerRegistryEntry(**self.sample_server_data)
        
        with patch.object(self.mcp_registry, 'get_server', return_value=mock_server):
            self.mock_client.build_and_send_transaction.return_value = "mock_tx_signature"
            
            updates = {
                "name": "Updated Server Name",
                "description": "Updated description"
            }
            
            result = await self.mcp_registry.update_server(
                server_id="test_server",
                owner=self.owner_keypair,
                updates=updates
            )
            
            assert result == "mock_tx_signature"

    @pytest.mark.asyncio
    async def test_update_server_not_found(self):
        """Test server update when server not found."""
        with patch.object(self.mcp_registry, 'get_server', return_value=None):
            updates = {"name": "Updated Name"}
            
            with pytest.raises(McpServerNotFoundError):
                await self.mcp_registry.update_server(
                    server_id="nonexistent_server",
                    owner=self.owner_keypair,
                    updates=updates
                )

    @pytest.mark.asyncio
    async def test_update_server_status_success(self):
        """Test successful server status update."""
        # Mock server exists
        mock_server = McpServerRegistryEntry(**self.sample_server_data)
        
        with patch.object(self.mcp_registry, 'get_server', return_value=mock_server):
            self.mock_client.build_and_send_transaction.return_value = "mock_tx_signature"
            
            result = await self.mcp_registry.update_server_status(
                server_id="test_server",
                owner=self.owner_keypair,
                status=McpServerStatus.INACTIVE
            )
            
            assert result == "mock_tx_signature"

    @pytest.mark.asyncio
    async def test_update_server_invalid_updates(self):
        """Test server update with invalid updates."""
        mock_server = McpServerRegistryEntry(**self.sample_server_data)
        
        with patch.object(self.mcp_registry, 'get_server', return_value=mock_server):
            # Test empty updates
            with pytest.raises(InvalidInputError, match="updates cannot be empty"):
                await self.mcp_registry.update_server(
                    server_id="test_server",
                    owner=self.owner_keypair,
                    updates={}
                )
            
            # Test invalid field
            with pytest.raises(InvalidInputError, match="Invalid update field"):
                await self.mcp_registry.update_server(
                    server_id="test_server",
                    owner=self.owner_keypair,
                    updates={"invalid_field": "value"}
                )

    # Get Server Tests
    @pytest.mark.asyncio
    async def test_get_server_success(self):
        """Test successful server retrieval."""
        # Mock account exists with data
        mock_account_info = Mock()
        mock_account_info.value = Mock()
        mock_account_info.value.data = b'\x00' * 200  # Mock server account data
        self.mock_client.get_account_info.return_value = mock_account_info
        
        with patch('struct.unpack') as mock_unpack:
            # Mock unpacked data
            mock_unpack.return_value = (
                1,  # status
                b'test_server\x00' * 10,  # server_id (padded)
                b'Test Server\x00' * 10,  # name (padded)
                b'https://api.example.com/mcp\x00' * 10,  # endpoint_url (padded)
                1640995200,  # created_at
                1640995200,  # updated_at
            )
            
            result = await self.mcp_registry.get_server(
                server_id="test_server",
                owner=self.owner_keypair.pubkey()
            )
            
            assert result is not None
            assert isinstance(result, McpServerRegistryEntry)

    @pytest.mark.asyncio
    async def test_get_server_not_found(self):
        """Test server retrieval when server doesn't exist."""
        self.mock_client.get_account_info.return_value = None
        
        result = await self.mcp_registry.get_server(
            server_id="nonexistent_server",
            owner=self.owner_keypair.pubkey()
        )
        
        assert result is None

    @pytest.mark.asyncio
    async def test_get_server_invalid_data(self):
        """Test server retrieval with invalid account data."""
        # Mock account exists but with invalid data
        mock_account_info = Mock()
        mock_account_info.value = Mock()
        mock_account_info.value.data = b'\x00' * 10  # Too short
        self.mock_client.get_account_info.return_value = mock_account_info
        
        with pytest.raises(Exception):  # Should raise deserialization error
            await self.mcp_registry.get_server(
                server_id="test_server",
                owner=self.owner_keypair.pubkey()
            )

    # Deregister Tests
    @pytest.mark.asyncio
    async def test_deregister_server_success(self):
        """Test successful server deregistration."""
        # Mock server exists
        mock_server = McpServerRegistryEntry(**self.sample_server_data)
        
        with patch.object(self.mcp_registry, 'get_server', return_value=mock_server):
            self.mock_client.build_and_send_transaction.return_value = "mock_tx_signature"
            
            result = await self.mcp_registry.deregister_server(
                server_id="test_server",
                owner=self.owner_keypair
            )
            
            assert result == "mock_tx_signature"

    @pytest.mark.asyncio
    async def test_deregister_server_not_found(self):
        """Test server deregistration when server not found."""
        with patch.object(self.mcp_registry, 'get_server', return_value=None):
            with pytest.raises(McpServerNotFoundError):
                await self.mcp_registry.deregister_server(
                    server_id="nonexistent_server",
                    owner=self.owner_keypair
                )

    # List Servers Tests
    @pytest.mark.asyncio
    async def test_list_servers_by_owner_success(self):
        """Test successful listing of servers by owner."""
        # Mock multiple server accounts
        mock_accounts = [
            Mock(
                pubkey=Keypair().pubkey(),
                account=Mock(data=b'\x00' * 200)
            ),
            Mock(
                pubkey=Keypair().pubkey(),
                account=Mock(data=b'\x00' * 200)
            )
        ]
        self.mock_client.get_program_accounts.return_value = mock_accounts
        
        with patch('struct.unpack') as mock_unpack:
            mock_unpack.return_value = (
                1,  # status
                b'test_server\x00' * 10,
                b'Test Server\x00' * 10,
                b'https://api.example.com/mcp\x00' * 10,
                1640995200,
                1640995200,
            )
            
            result = await self.mcp_registry.list_servers_by_owner(
                owner=self.owner_keypair.pubkey()
            )
            
            assert isinstance(result, list)
            assert len(result) == 2

    @pytest.mark.asyncio
    async def test_list_servers_by_owner_empty(self):
        """Test listing servers when owner has no servers."""
        self.mock_client.get_program_accounts.return_value = []
        
        result = await self.mcp_registry.list_servers_by_owner(
            owner=self.owner_keypair.pubkey()
        )
        
        assert isinstance(result, list)
        assert len(result) == 0

    @pytest.mark.asyncio
    async def test_list_servers_by_owner_with_limit(self):
        """Test listing servers with limit."""
        # Mock many server accounts
        mock_accounts = [
            Mock(pubkey=Keypair().pubkey(), account=Mock(data=b'\x00' * 200))
            for _ in range(10)
        ]
        self.mock_client.get_program_accounts.return_value = mock_accounts
        
        with patch('struct.unpack') as mock_unpack:
            mock_unpack.return_value = (
                1, b'test\x00' * 20, b'Test\x00' * 20, 
                b'https://api.example.com\x00' * 10, 1640995200, 1640995200
            )
            
            result = await self.mcp_registry.list_servers_by_owner(
                owner=self.owner_keypair.pubkey(),
                limit=5
            )
            
            assert isinstance(result, list)
            assert len(result) == 5

    # Search Tests
    @pytest.mark.asyncio
    async def test_search_servers_by_name(self):
        """Test searching servers by name."""
        mock_accounts = [
            Mock(pubkey=Keypair().pubkey(), account=Mock(data=b'\x00' * 200))
        ]
        self.mock_client.get_program_accounts.return_value = mock_accounts
        
        with patch('struct.unpack') as mock_unpack:
            mock_unpack.return_value = (
                1, b'matching_server\x00' * 10, b'Matching Server\x00' * 10,
                b'https://api.example.com\x00' * 10, 1640995200, 1640995200
            )
            
            result = await self.mcp_registry.search_servers(
                query="Matching"
            )
            
            assert isinstance(result, list)
            assert len(result) >= 0

    @pytest.mark.asyncio
    async def test_search_servers_by_capabilities(self):
        """Test searching servers by capabilities."""
        mock_accounts = []
        self.mock_client.get_program_accounts.return_value = mock_accounts
        
        result = await self.mcp_registry.search_servers(
            capabilities=["tools", "resources"]
        )
        
        assert isinstance(result, list)

    @pytest.mark.asyncio
    async def test_search_servers_by_status(self):
        """Test searching servers by status."""
        mock_accounts = []
        self.mock_client.get_program_accounts.return_value = mock_accounts
        
        result = await self.mcp_registry.search_servers(
            status=McpServerStatus.ACTIVE
        )
        
        assert isinstance(result, list)

    @pytest.mark.asyncio
    async def test_search_servers_no_results(self):
        """Test searching servers with no results."""
        self.mock_client.get_program_accounts.return_value = []
        
        result = await self.mcp_registry.search_servers(
            query="nonexistent"
        )
        
        assert isinstance(result, list)
        assert len(result) == 0

    @pytest.mark.asyncio
    async def test_search_servers_with_limit(self):
        """Test searching servers with limit."""
        mock_accounts = [
            Mock(pubkey=Keypair().pubkey(), account=Mock(data=b'\x00' * 200))
            for _ in range(10)
        ]
        self.mock_client.get_program_accounts.return_value = mock_accounts
        
        with patch('struct.unpack') as mock_unpack:
            mock_unpack.return_value = (
                1, b'test\x00' * 20, b'Test\x00' * 20,
                b'https://api.example.com\x00' * 10, 1640995200, 1640995200
            )
            
            result = await self.mcp_registry.search_servers(
                limit=3
            )
            
            assert isinstance(result, list)
            assert len(result) == 3

    # Ping Tests
    @pytest.mark.asyncio
    async def test_ping_server_success(self):
        """Test successful server ping."""
        # Mock server exists
        mock_server = McpServerRegistryEntry(**self.sample_server_data)
        
        with patch.object(self.mcp_registry, 'get_server', return_value=mock_server):
            with patch('httpx.AsyncClient.get') as mock_get:
                mock_response = Mock()
                mock_response.status_code = 200
                mock_response.json.return_value = {"status": "healthy", "version": "1.0.0"}
                mock_response.elapsed.total_seconds.return_value = 0.123
                mock_get.return_value.__aenter__.return_value = mock_response
                
                result = await self.mcp_registry.ping_server(
                    server_id="test_server",
                    owner=self.owner_keypair.pubkey()
                )
                
                assert isinstance(result, dict)
                assert "status" in result
                assert "response_time_ms" in result

    @pytest.mark.asyncio
    async def test_ping_server_not_found(self):
        """Test ping when server not found."""
        with patch.object(self.mcp_registry, 'get_server', return_value=None):
            with pytest.raises(McpServerNotFoundError):
                await self.mcp_registry.ping_server(
                    server_id="nonexistent_server",
                    owner=self.owner_keypair.pubkey()
                )

    @pytest.mark.asyncio
    async def test_ping_server_unreachable(self):
        """Test ping when server is unreachable."""
        mock_server = McpServerRegistryEntry(**self.sample_server_data)
        
        with patch.object(self.mcp_registry, 'get_server', return_value=mock_server):
            with patch('httpx.AsyncClient.get') as mock_get:
                mock_get.side_effect = Exception("Connection timeout")
                
                result = await self.mcp_registry.ping_server(
                    server_id="test_server",
                    owner=self.owner_keypair.pubkey()
                )
                
                assert isinstance(result, dict)
                assert result["status"] == "unreachable"
                assert "error" in result

    @pytest.mark.asyncio
    async def test_ping_server_invalid_response(self):
        """Test ping with invalid server response."""
        mock_server = McpServerRegistryEntry(**self.sample_server_data)
        
        with patch.object(self.mcp_registry, 'get_server', return_value=mock_server):
            with patch('httpx.AsyncClient.get') as mock_get:
                mock_response = Mock()
                mock_response.status_code = 500
                mock_response.text = "Internal Server Error"
                mock_response.elapsed.total_seconds.return_value = 0.456
                mock_get.return_value.__aenter__.return_value = mock_response
                
                result = await self.mcp_registry.ping_server(
                    server_id="test_server",
                    owner=self.owner_keypair.pubkey()
                )
                
                assert isinstance(result, dict)
                assert result["status"] == "error"
                assert result["status_code"] == 500

    # Error Handling Tests
    @pytest.mark.asyncio
    async def test_register_server_network_error(self):
        """Test server registration with network error."""
        self.mock_client.get_account_info.return_value = None
        self.mock_client.build_and_send_transaction.side_effect = Exception("Network error")
        
        with pytest.raises(RegistrationError, match="Failed to register MCP server"):
            await self.mcp_registry.register_server(
                server_id="test_server",
                name="Test Server",
                endpoint_url="https://api.example.com/mcp",
                owner=self.owner_keypair
            )

    @pytest.mark.asyncio
    async def test_update_server_network_error(self):
        """Test server update with network error."""
        mock_server = McpServerRegistryEntry(**self.sample_server_data)
        
        with patch.object(self.mcp_registry, 'get_server', return_value=mock_server):
            self.mock_client.build_and_send_transaction.side_effect = Exception("Network error")
            
            with pytest.raises(Exception, match="Network error"):
                await self.mcp_registry.update_server(
                    server_id="test_server",
                    owner=self.owner_keypair,
                    updates={"name": "Updated Name"}
                )

    @pytest.mark.asyncio
    async def test_search_servers_rpc_error(self):
        """Test server search with RPC error."""
        self.mock_client.get_program_accounts.side_effect = Exception("RPC error")
        
        with pytest.raises(Exception, match="RPC error"):
            await self.mcp_registry.search_servers(query="test")

    # Edge Cases
    @pytest.mark.asyncio
    async def test_register_server_minimal_data(self):
        """Test server registration with minimal required data."""
        self.mock_client.get_account_info.return_value = None
        self.mock_client.build_and_send_transaction.return_value = "mock_tx_signature"
        
        result = await self.mcp_registry.register_server(
            server_id="minimal_server",
            name="Minimal Server",
            endpoint_url="https://minimal.example.com",
            owner=self.owner_keypair
        )
        
        assert result == "mock_tx_signature"

    @pytest.mark.asyncio
    async def test_update_server_single_field(self):
        """Test updating a single server field."""
        mock_server = McpServerRegistryEntry(**self.sample_server_data)
        
        with patch.object(self.mcp_registry, 'get_server', return_value=mock_server):
            self.mock_client.build_and_send_transaction.return_value = "mock_tx_signature"
            
            result = await self.mcp_registry.update_server(
                server_id="test_server",
                owner=self.owner_keypair,
                updates={"description": "New description only"}
            )
            
            assert result == "mock_tx_signature"

    @pytest.mark.asyncio
    async def test_list_servers_large_limit(self):
        """Test listing servers with very large limit."""
        mock_accounts = []
        self.mock_client.get_program_accounts.return_value = mock_accounts
        
        result = await self.mcp_registry.list_servers_by_owner(
            owner=self.owner_keypair.pubkey(),
            limit=10000  # Very large limit
        )
        
        assert isinstance(result, list)
        assert len(result) == 0  # No servers exist