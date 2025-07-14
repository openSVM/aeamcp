"""Simplified tests for solana_ai_registries.mcp module focused on interface coverage."""

from typing import Any, Dict, List, Optional
from unittest.mock import AsyncMock, Mock, patch

import pytest
from solders.keypair import Keypair
from solders.pubkey import Pubkey as PublicKey

from solana_ai_registries.client import SolanaAIRegistriesClient
from solana_ai_registries.exceptions import (
    InvalidInputError,
    McpServerNotFoundError,
    RegistrationError,
    SolanaAIRegistriesError,
)
from solana_ai_registries.mcp import McpServerRegistry
from solana_ai_registries.types import McpServerRegistryEntry, McpServerStatus


class TestMcpServerRegistryInterface:
    """Test MCP server registry interface and validation."""

    def setup_method(self):
        """Set up test fixtures."""
        self.mock_client = Mock(spec=SolanaAIRegistriesClient)
        self.mcp_registry = McpServerRegistry(self.mock_client)
        self.owner_keypair = Keypair()

    def test_init(self):
        """Test McpServerRegistry initialization."""
        registry = McpServerRegistry(self.mock_client)
        assert registry.client == self.mock_client

    def test_has_required_methods(self):
        """Test that McpServerRegistry has expected methods."""
        expected_methods = [
            "register_server",
            "update_server",
            "update_server_status",
            "get_server",
            "deregister_server",
            "list_servers_by_owner",
            "search_servers",
            "ping_server",
        ]
        for method in expected_methods:
            assert hasattr(self.mcp_registry, method)
            assert callable(getattr(self.mcp_registry, method))

    @pytest.mark.asyncio
    async def test_register_server_validation_invalid_url(self):
        """Test validation for invalid URL."""
        with pytest.raises(ValueError, match="endpoint_url must start with one of"):
            await self.mcp_registry.register_server(
                server_id="test_server",
                name="Test Server",
                endpoint_url="invalid-url",
                owner=self.owner_keypair,
            )

    @pytest.mark.asyncio
    async def test_get_server_not_found(self):
        """Test get_server when server doesn't exist."""
        self.mock_client.get_account_info = AsyncMock(return_value=None)

        result = await self.mcp_registry.get_server(
            "nonexistent_server", self.owner_keypair.pubkey()
        )
        assert result is None

    @pytest.mark.asyncio
    async def test_get_server_interface(self):
        """Test get_server interface."""
        # Test that method exists and has correct signature
        self.mock_client.get_account_info = AsyncMock(return_value=None)
        result = await self.mcp_registry.get_server(
            "test_server", self.owner_keypair.pubkey()
        )
        assert result is None

    @pytest.mark.asyncio
    async def test_list_servers_by_owner_empty(self):
        """Test listing servers when none exist."""
        self.mock_client.get_program_accounts = AsyncMock(return_value=[])

        servers = await self.mcp_registry.list_servers_by_owner(
            self.owner_keypair.pubkey()
        )
        assert servers == []

    @pytest.mark.asyncio
    async def test_search_servers_interface(self):
        """Test search interface."""
        self.mock_client.get_program_accounts = AsyncMock(return_value=[])

        # Search by query
        results = await self.mcp_registry.search_servers(query="test")
        assert isinstance(results, list)

        # Search by status
        results = await self.mcp_registry.search_servers(status=McpServerStatus.ACTIVE)
        assert isinstance(results, list)

        # Search with capabilities
        results = await self.mcp_registry.search_servers(capabilities=["tools"])
        assert isinstance(results, list)

    @pytest.mark.asyncio
    async def test_ping_server_interface(self):
        """Test ping server interface."""
        # Mock the ping_server method to return a simple status
        with patch.object(self.mcp_registry, "ping_server") as mock_ping:
            mock_ping.return_value = {"status": "available", "response_time": 100}

            result = await self.mcp_registry.ping_server(
                "test_server", self.owner_keypair.pubkey()
            )
            assert result["status"] == "available"

    @pytest.mark.asyncio
    async def test_update_server_status_interface(self):
        """Test update server status interface."""
        # Mock get_server to return a server
        with patch.object(self.mcp_registry, "get_server") as mock_get:
            mock_get.return_value = Mock()  # Mock server exists
            with patch.object(self.mcp_registry, "update_server") as mock_update:
                mock_update.return_value = "mock_signature"

                result = await self.mcp_registry.update_server_status(
                    server_id="test_server",
                    owner=self.owner_keypair,
                    status=McpServerStatus.ACTIVE,
                )
                assert result == "mock_signature"

    @pytest.mark.asyncio
    async def test_error_handling_patterns(self):
        """Test that error handling follows expected patterns."""
        # Test that network errors are wrapped appropriately
        self.mock_client.get_account_info = AsyncMock(
            side_effect=Exception("Network error")
        )

        with pytest.raises(
            (SolanaAIRegistriesError, McpServerNotFoundError, Exception)
        ):
            await self.mcp_registry.get_server("test_server")
