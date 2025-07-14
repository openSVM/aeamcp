"""Test suite for exception classes."""

from solana_ai_registries.exceptions import (
    AccountNotFoundError,
    AgentExistsError,
    AgentNotFoundError,
    ConfigurationError,
    ConnectionError,
    IDLError,
    IdlLoadError,
    InsufficientFundsError,
    InvalidInputError,
    InvalidPublicKeyError,
    McpServerExistsError,
    McpServerNotFoundError,
    PaymentError,
    RegistrationError,
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
        expected_msg = (
            "Failed to load IDL for program 'agent_registry': Network timeout"
        )
        assert str(error) == expected_msg
        assert error.program_name == "agent_registry"
        assert error.reason == "Network timeout"
        assert error.details["program_name"] == "agent_registry"
        assert error.details["reason"] == "Network timeout"


class TestConnectionError:
    """Test connection error class."""

    def test_init_message_only(self) -> None:
        """Test connection error with message only."""
        error = ConnectionError("Failed to connect to RPC")
        assert str(error) == "Failed to connect to RPC"
        assert error.endpoint is None
        assert error.details == {}

    def test_init_with_endpoint(self) -> None:
        """Test connection error with endpoint."""
        error = ConnectionError(
            "Connection timeout", "https://api.mainnet-beta.solana.com"
        )
        assert str(error) == "Connection timeout"
        assert error.endpoint == "https://api.mainnet-beta.solana.com"
        assert error.details["endpoint"] == "https://api.mainnet-beta.solana.com"


class TestInvalidPublicKeyError:
    """Test invalid public key error class."""

    def test_init(self) -> None:
        """Test invalid public key error initialization."""
        error = InvalidPublicKeyError("invalid_key")
        assert (
            str(error)
            == "Validation failed for field 'public_key': must be a valid base58 public key"
        )
        assert error.field == "public_key"
        assert error.value == "invalid_key"
        assert error.constraint == "must be a valid base58 public key"


class TestInvalidInputError:
    """Test invalid input error class."""

    def test_init(self) -> None:
        """Test invalid input error initialization."""
        error = InvalidInputError("amount", -100, "must be positive")
        assert str(error) == "Validation failed for field 'amount': must be positive"
        assert error.field == "amount"
        assert error.value == -100
        assert error.constraint == "must be positive"


class TestRegistrationError:
    """Test registration error class."""

    def test_init(self) -> None:
        """Test registration error initialization."""
        error = RegistrationError("Failed to register agent")
        assert str(error) == "Failed to register agent"
        assert error.details == {}


class TestAgentNotFoundError:
    """Test agent not found error class."""

    def test_init_agent_only(self) -> None:
        """Test agent not found error with agent ID only."""
        error = AgentNotFoundError("my-agent")
        assert str(error) == "Agent 'my-agent' not found"
        assert error.agent_id == "my-agent"
        assert error.owner is None
        assert error.details["agent_id"] == "my-agent"
        assert error.details["owner"] is None

    def test_init_with_owner(self) -> None:
        """Test agent not found error with owner."""
        error = AgentNotFoundError("my-agent", "owner123")
        assert str(error) == "Agent 'my-agent' not found for owner owner123"
        assert error.agent_id == "my-agent"
        assert error.owner == "owner123"
        assert error.details["agent_id"] == "my-agent"
        assert error.details["owner"] == "owner123"


class TestMcpServerNotFoundError:
    """Test MCP server not found error class."""

    def test_init_server_only(self) -> None:
        """Test MCP server not found error with server ID only."""
        error = McpServerNotFoundError("my-server")
        assert str(error) == "MCP server 'my-server' not found"
        assert error.server_id == "my-server"
        assert error.owner is None
        assert error.details["server_id"] == "my-server"
        assert error.details["owner"] is None

    def test_init_with_owner(self) -> None:
        """Test MCP server not found error with owner."""
        error = McpServerNotFoundError("my-server", "owner123")
        assert str(error) == "MCP server 'my-server' not found for owner owner123"
        assert error.server_id == "my-server"
        assert error.owner == "owner123"
        assert error.details["server_id"] == "my-server"
        assert error.details["owner"] == "owner123"


class TestPaymentError:
    """Test payment error class."""

    def test_init(self) -> None:
        """Test payment error initialization."""
        error = PaymentError("Payment processing failed")
        assert str(error) == "Payment processing failed"
        assert error.details == {}


class TestIDLError:
    """Test IDL error class."""

    def test_init(self) -> None:
        """Test IDL error initialization."""
        error = IDLError("Invalid IDL format")
        assert str(error) == "Invalid IDL format"
        assert error.details == {}


class TestConfigurationError:
    """Test configuration error class."""

    def test_init(self) -> None:
        """Test configuration error initialization."""
        error = ConfigurationError("rpc_url", "invalid-url", "valid HTTP/HTTPS URL")
        expected_msg = (
            "Invalid configuration for 'rpc_url': expected valid HTTP/HTTPS URL, "
            "got invalid-url"
        )
        assert str(error) == expected_msg
        assert error.setting == "rpc_url"
        assert error.value == "invalid-url"
        assert error.expected == "valid HTTP/HTTPS URL"
        assert error.details["setting"] == "rpc_url"
        assert error.details["value"] == "invalid-url"
        assert error.details["expected"] == "valid HTTP/HTTPS URL"
