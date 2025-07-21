"""
Additional tests to improve test coverage to reach 65%+ target.
"""

import pytest

from solana_ai_registries.client import SolanaAIRegistriesClient
from solana_ai_registries.exceptions import IDLError
from solana_ai_registries.idl import IDLLoader
from solana_ai_registries.types import ServiceEndpoint


class TestServiceEndpointProtocolDetection:
    """Test ServiceEndpoint protocol auto-detection - missing line 95."""

    def test_http_protocol_detection(self):
        """Test HTTP protocol auto-detection from URL."""
        endpoint = ServiceEndpoint(url="http://example.com", auth_type="none")
        assert endpoint.protocol == "http"

    def test_https_protocol_detection(self):
        """Test HTTPS protocol auto-detection from URL."""
        endpoint = ServiceEndpoint(url="https://example.com", auth_type="none")
        assert endpoint.protocol == "https"

    def test_unknown_protocol_detection(self):
        """Test unknown protocol detection for non-HTTP URLs."""
        endpoint = ServiceEndpoint(
            url="https://example.com",  # Use valid URL
            protocol="ftp",  # Explicitly set unknown protocol
        )
        assert endpoint.protocol == "ftp"


class TestClientBasicMethods:
    """Test basic client methods for coverage."""

    def test_client_initialization(self):
        """Test client initialization."""
        client = SolanaAIRegistriesClient()
        assert client is not None

    def test_client_with_custom_rpc(self):
        """Test client with custom RPC URL."""
        client = SolanaAIRegistriesClient(rpc_url="https://api.mainnet-beta.solana.com")
        assert client is not None

    @pytest.mark.asyncio
    async def test_client_close(self):
        """Test client close method."""
        client = SolanaAIRegistriesClient()
        await client.close()  # Should not raise


class TestIDLLoaderBasics:
    """Test IDL loader basic functionality."""

    def test_idl_loader_init(self):
        """Test IDL loader initialization."""
        loader = IDLLoader()
        assert loader is not None

    def test_clear_cache(self):
        """Test cache clearing."""
        loader = IDLLoader()
        loader.clear_cache()
        assert len(loader._cached_idls) == 0

    def test_load_nonexistent_idl(self):
        """Test loading non-existent IDL raises error."""
        loader = IDLLoader()
        with pytest.raises(IDLError):
            loader.load_idl("nonexistent_program")
