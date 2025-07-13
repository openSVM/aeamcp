"""Tests for solana_ai_registries.agent module."""

import pytest
from unittest.mock import Mock

from solana_ai_registries.agent import AgentRegistry
from solana_ai_registries.client import SolanaAIRegistriesClient


class TestAgentRegistry:
    """Test the AgentRegistry class."""

    def setup_method(self):
        """Set up test fixtures."""
        self.mock_client = Mock(spec=SolanaAIRegistriesClient)
        self.agent_registry = AgentRegistry(self.mock_client)

    def test_init(self):
        """Test AgentRegistry initialization."""
        assert self.agent_registry.client == self.mock_client

    def test_agent_registry_has_required_methods(self):
        """Test that AgentRegistry has the expected methods."""
        assert hasattr(self.agent_registry, 'register_agent')
        assert hasattr(self.agent_registry, 'get_agent')
        assert hasattr(self.agent_registry, 'update_agent')
        assert hasattr(self.agent_registry, 'deregister_agent')