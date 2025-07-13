"""Test suite for exception classes."""

import pytest
from solana_ai_registries.exceptions import (
    AccountNotFoundError,
    AgentExistsError,
    ConfigurationError,
    IdlLoadError,
    InsufficientFundsError,
    McpServerExistsError,
    SolanaAIRegistriesError,
    TransactionError,
    ValidationError,
)


class TestSolanaAIRegistriesError:
    """Test the base exception class."""

    def test_init_message_only(self) -> None:
        """Test initialization with message only."""
        error = SolanaAIRegistriesError("Test error")
        assert str(error) == "Test error"
        assert error.message == "Test error"
        assert error.details == {}

    def test_init_with_details(self) -> None:
        """Test initialization with message and details."""
        details = {"code": 500, "context": "test"}
        error = SolanaAIRegistriesError("Test error", details)
        assert str(error) == "Test error"
        assert error.message == "Test error"
        assert error.details == details


class TestValidationError:
    """Test validation error class."""

    def test_init(self) -> None:
        """Test validation error initialization."""
        error = ValidationError("agent_id", "too_long_id", "max length 32")
        assert "Validation failed for field 'agent_id': max length 32" in str(error)
        assert error.field == "agent_id"
        assert error.value == "too_long_id"
        assert error.constraint == "max length 32"
        assert error.details["field"] == "agent_id"
        assert error.details["value"] == "too_long_id"
        assert error.details["constraint"] == "max length 32"


class TestTransactionError:
    """Test transaction error class."""

    def test_init_message_only(self) -> None:
        """Test initialization with message only."""
        error = TransactionError("Transaction failed")
        assert str(error) == "Transaction failed"
        assert error.signature is None
        assert error.logs is None

    def test_init_with_signature(self) -> None:
        """Test initialization with signature."""
        signature = "test_signature_123"
        error = TransactionError("Transaction failed", signature=signature)
        assert str(error) == "Transaction failed"
        assert error.signature == signature
        assert error.logs is None

    def test_init_with_logs(self) -> None:
        """Test initialization with logs."""
        logs = ["log1", "log2"]
        error = TransactionError("Transaction failed", logs=logs)
        assert str(error) == "Transaction failed"
        assert error.signature is None
        assert error.logs == logs

    def test_init_with_signature_and_logs(self) -> None:
        """Test initialization with both signature and logs."""
        signature = "test_signature_123"
        logs = ["log1", "log2"]
        error = TransactionError("Transaction failed", signature=signature, logs=logs)
        assert str(error) == "Transaction failed"
        assert error.signature == signature
        assert error.logs == logs


class TestAgentExistsError:
    """Test agent exists error class."""

    def test_init(self) -> None:
        """Test agent exists error initialization."""
        error = AgentExistsError("agent123", "owner_pubkey")
        expected_msg = "Agent 'agent123' already exists for owner owner_pubkey"
        assert str(error) == expected_msg
        assert error.agent_id == "agent123"
        assert error.owner == "owner_pubkey"
        assert error.details["agent_id"] == "agent123"
        assert error.details["owner"] == "owner_pubkey"


class TestMcpServerExistsError:
    """Test MCP server exists error class."""

    def test_init(self) -> None:
        """Test MCP server exists error initialization."""
        error = McpServerExistsError("server123", "owner_pubkey")
        expected_msg = "MCP server 'server123' already exists for owner owner_pubkey"
        assert str(error) == expected_msg
        assert error.server_id == "server123"
        assert error.owner == "owner_pubkey"
        assert error.details["server_id"] == "server123"
        assert error.details["owner"] == "owner_pubkey"


class TestAccountNotFoundError:
    """Test account not found error class."""

    def test_init(self) -> None:
        """Test account not found error initialization."""
        error = AccountNotFoundError("agent", "agent123")
        expected_msg = "Agent account not found: agent123"
        assert str(error) == expected_msg
        assert error.account_type == "agent"
        assert error.identifier == "agent123"
        assert error.details["account_type"] == "agent"
        assert error.details["identifier"] == "agent123"


class TestInsufficientFundsError:
    """Test insufficient funds error class."""

    def test_init(self) -> None:
        """Test insufficient funds error initialization."""
        error = InsufficientFundsError(1000, 500, "token_mint_123")
        expected_msg = "Insufficient funds: required 1000, available 500"
        assert str(error) == expected_msg
        assert error.required == 1000
        assert error.available == 500
        assert error.token_mint == "token_mint_123"
        assert error.details["required"] == 1000
        assert error.details["available"] == 500
        assert error.details["token_mint"] == "token_mint_123"


class TestIdlLoadError:
    """Test IDL load error class."""

    def test_init(self) -> None:
        """Test IDL load error initialization."""
        error = IdlLoadError("agent_registry", "Network timeout")
        expected_msg = "Failed to load IDL for program 'agent_registry': Network timeout"
        assert str(error) == expected_msg
        assert error.program_name == "agent_registry"
        assert error.reason == "Network timeout"
        assert error.details["program_name"] == "agent_registry"
        assert error.details["reason"] == "Network timeout"


class TestConfigurationError:
    """Test configuration error class."""

    def test_init(self) -> None:
        """Test configuration error initialization."""
        error = ConfigurationError("rpc_url", "invalid-url", "valid HTTP/HTTPS URL")
        expected_msg = "Invalid configuration for 'rpc_url': expected valid HTTP/HTTPS URL, got invalid-url"
        assert str(error) == expected_msg
        assert error.setting == "rpc_url"
        assert error.value == "invalid-url"
        assert error.expected == "valid HTTP/HTTPS URL"
        assert error.details["setting"] == "rpc_url"
        assert error.details["value"] == "invalid-url"
        assert error.details["expected"] == "valid HTTP/HTTPS URL"