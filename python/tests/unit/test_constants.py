"""Test suite for constants module."""

import pytest
from solana_ai_registries.constants import (
    A2AMPL_BASE_UNIT,
    A2AMPL_TOKEN_MINT_DEVNET,
    A2AMPL_TOKEN_MINT_MAINNET,
    AGENT_REGISTRY_PROGRAM_ID,
    DEFAULT_DEVNET_RPC,
    DEFAULT_MAINNET_RPC,
    MAX_AGENT_DESCRIPTION_LEN,
    MAX_AGENT_ID_LEN,
    MAX_AGENT_NAME_LEN,
    MAX_SERVER_ID_LEN,
    MAX_SERVER_NAME_LEN,
    MCP_SERVER_REGISTRY_PROGRAM_ID,
    a2ampl_to_base_units,
    base_units_to_a2ampl,
    get_token_mint_for_cluster,
    validate_string_length,
    validate_url,
)


class TestConstants:
    """Test constant values."""

    def test_program_ids_are_strings(self) -> None:
        """Test that program IDs are valid strings."""
        assert isinstance(AGENT_REGISTRY_PROGRAM_ID, str)
        assert isinstance(MCP_SERVER_REGISTRY_PROGRAM_ID, str)
        assert len(AGENT_REGISTRY_PROGRAM_ID) > 0
        assert len(MCP_SERVER_REGISTRY_PROGRAM_ID) > 0

    def test_rpc_endpoints_are_urls(self) -> None:
        """Test that RPC endpoints are valid URLs."""
        assert isinstance(DEFAULT_MAINNET_RPC, str)
        assert isinstance(DEFAULT_DEVNET_RPC, str)
        assert DEFAULT_MAINNET_RPC.startswith("https://")
        assert DEFAULT_DEVNET_RPC.startswith("https://")

    def test_token_mints_are_strings(self) -> None:
        """Test that token mints are valid strings."""
        assert isinstance(A2AMPL_TOKEN_MINT_MAINNET, str)
        assert isinstance(A2AMPL_TOKEN_MINT_DEVNET, str)
        assert len(A2AMPL_TOKEN_MINT_MAINNET) > 0
        assert len(A2AMPL_TOKEN_MINT_DEVNET) > 0

    def test_length_constants_are_positive(self) -> None:
        """Test that length constants are positive integers."""
        assert isinstance(MAX_AGENT_ID_LEN, int)
        assert isinstance(MAX_AGENT_NAME_LEN, int)
        assert isinstance(MAX_AGENT_DESCRIPTION_LEN, int)
        assert isinstance(MAX_SERVER_ID_LEN, int)
        assert isinstance(MAX_SERVER_NAME_LEN, int)
        assert MAX_AGENT_ID_LEN > 0
        assert MAX_AGENT_NAME_LEN > 0
        assert MAX_AGENT_DESCRIPTION_LEN > 0
        assert MAX_SERVER_ID_LEN > 0
        assert MAX_SERVER_NAME_LEN > 0

    def test_a2ampl_base_unit(self) -> None:
        """Test A2AMPL base unit constant."""
        assert isinstance(A2AMPL_BASE_UNIT, int)
        assert A2AMPL_BASE_UNIT == 10**9  # 9 decimal places


class TestA2AMPLConversion:
    """Test A2AMPL conversion functions."""

    def test_a2ampl_to_base_units(self) -> None:
        """Test converting A2AMPL to base units."""
        assert a2ampl_to_base_units(1.0) == 1_000_000_000
        assert a2ampl_to_base_units(100.5) == 100_500_000_000
        assert a2ampl_to_base_units(0.000000001) == 1  # Smallest unit
        assert a2ampl_to_base_units(0.0) == 0

    def test_base_units_to_a2ampl(self) -> None:
        """Test converting base units to A2AMPL."""
        assert base_units_to_a2ampl(1_000_000_000) == 1.0
        assert base_units_to_a2ampl(100_500_000_000) == 100.5
        assert base_units_to_a2ampl(1) == 0.000000001  # Smallest unit
        assert base_units_to_a2ampl(0) == 0.0

    def test_conversion_round_trip(self) -> None:
        """Test that conversions are reversible."""
        amounts = [1.0, 100.5, 0.123456789, 1000.0]
        for amount in amounts:
            base_units = a2ampl_to_base_units(amount)
            converted_back = base_units_to_a2ampl(base_units)
            assert abs(converted_back - amount) < 1e-9  # Allow for floating point precision


class TestClusterTokenMint:
    """Test cluster token mint resolution."""

    def test_mainnet_clusters(self) -> None:
        """Test mainnet cluster variations."""
        assert get_token_mint_for_cluster("mainnet") == A2AMPL_TOKEN_MINT_MAINNET
        assert get_token_mint_for_cluster("mainnet-beta") == A2AMPL_TOKEN_MINT_MAINNET

    def test_devnet_testnet_clusters(self) -> None:
        """Test devnet and testnet clusters."""
        assert get_token_mint_for_cluster("devnet") == A2AMPL_TOKEN_MINT_DEVNET
        assert get_token_mint_for_cluster("testnet") == A2AMPL_TOKEN_MINT_DEVNET

    def test_unsupported_cluster(self) -> None:
        """Test unsupported cluster raises error."""
        with pytest.raises(ValueError) as exc_info:
            get_token_mint_for_cluster("unsupported")
        assert "Unsupported cluster: unsupported" in str(exc_info.value)

    def test_empty_cluster(self) -> None:
        """Test empty cluster raises error."""
        with pytest.raises(ValueError) as exc_info:
            get_token_mint_for_cluster("")
        assert "Unsupported cluster:" in str(exc_info.value)


class TestStringValidation:
    """Test string validation functions."""

    def test_validate_string_length_valid(self) -> None:
        """Test string validation with valid lengths."""
        # These should not raise exceptions
        validate_string_length("", 10, "test_field")
        validate_string_length("hello", 10, "test_field")
        validate_string_length("exactly10c", 10, "test_field")

    def test_validate_string_length_too_long(self) -> None:
        """Test string validation with too long strings."""
        with pytest.raises(ValueError) as exc_info:
            validate_string_length("this_is_too_long", 10, "test_field")
        assert "test_field exceeds maximum length: 16 > 10" in str(exc_info.value)

    def test_validate_string_length_zero_max(self) -> None:
        """Test string validation with zero max length."""
        with pytest.raises(ValueError) as exc_info:
            validate_string_length("x", 0, "test_field")
        assert "test_field exceeds maximum length: 1 > 0" in str(exc_info.value)

        # Empty string should be valid for zero max length
        validate_string_length("", 0, "test_field")


class TestURLValidation:
    """Test URL validation functions."""

    def test_validate_url_valid_urls(self) -> None:
        """Test URL validation with valid URLs."""
        valid_urls = [
            "https://example.com",
            "http://localhost:8080",
            "https://api.example.com/v1/endpoint",
            "https://subdomain.example.com:443/path?query=value",
            "ipfs://QmExampleHash",
            "ar://ExampleArweaveHash",
            "https://",  # Minimal valid https URL
            "http://",   # Minimal valid http URL
        ]
        for url in valid_urls:
            # Should not raise exceptions
            validate_url(url, "test_url")

    def test_validate_url_invalid_urls(self) -> None:
        """Test URL validation with invalid URLs."""
        invalid_urls = [
            "not-a-url",
            "ftp://example.com",  # Only http/https/ipfs/ar allowed
            "",
            "javascript:alert('xss')",
        ]
        for url in invalid_urls:
            with pytest.raises(ValueError) as exc_info:
                validate_url(url, "test_url")
            assert "test_url must start with one of" in str(exc_info.value)

    def test_validate_url_none_value(self) -> None:
        """Test URL validation with None value."""
        # This would be caught by type checking, but test the behavior
        with pytest.raises(AttributeError):
            validate_url(None, "test_url")  # type: ignore