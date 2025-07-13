"""Tests for solana_ai_registries.mcp module."""

import pytest
from unittest.mock import Mock

from solana_ai_registries.mcp import McpServerRegistry
from solana_ai_registries.client import SolanaAIRegistriesClient


class TestMcpServerRegistry:
    """Test the McpServerRegistry class."""

    def setup_method(self):
        """Set up test fixtures."""
        self.mock_client = Mock(spec=SolanaAIRegistriesClient)
        self.mcp_registry = McpServerRegistry(self.mock_client)

    def test_init(self):
        """Test McpServerRegistry initialization."""
        assert self.mcp_registry.client == self.mock_client

    def test_mcp_registry_has_required_methods(self):
        """Test that McpServerRegistry has the expected methods."""
        assert hasattr(self.mcp_registry, 'register_server')
        assert hasattr(self.mcp_registry, 'get_server')
        assert hasattr(self.mcp_registry, 'update_server')
        assert hasattr(self.mcp_registry, 'deregister_server')