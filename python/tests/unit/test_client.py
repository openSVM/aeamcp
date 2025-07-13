"""Tests for solana_ai_registries.client module."""

import pytest
from unittest.mock import Mock, patch

from solana_ai_registries.client import SolanaAIRegistriesClient
from solana_ai_registries.constants import DEFAULT_DEVNET_RPC


class TestSolanaAIRegistriesClient:
    """Test the SolanaAIRegistriesClient class."""

    def test_init_default_params(self):
        """Test client initialization with default parameters."""
        client = SolanaAIRegistriesClient()
        assert client.rpc_url == DEFAULT_DEVNET_RPC
        assert client._client is None

    def test_init_custom_params(self):
        """Test client initialization with custom parameters."""
        custom_url = "https://api.mainnet-beta.solana.com"
        
        client = SolanaAIRegistriesClient(rpc_url=custom_url)
        assert client.rpc_url == custom_url

    @pytest.mark.asyncio
    async def test_close_client(self):
        """Test closing the client connection."""
        client = SolanaAIRegistriesClient()
        # Should not raise an exception when closing non-connected client
        await client.close()

    @pytest.mark.asyncio 
    async def test_context_manager_usage(self):
        """Test using client as async context manager."""
        async with SolanaAIRegistriesClient() as client:
            assert isinstance(client, SolanaAIRegistriesClient)
        # Client should be cleaned up after context exit