"""
Custom exception hierarchy for Solana AI Registries SDK.

This module defines all custom exceptions used throughout the SDK,
providing clear error messages and proper inheritance hierarchy.
"""

from typing import Any, Dict, List, Optional


class SolanaAIRegistriesError(Exception):
    """Base exception for all Solana AI Registries SDK errors."""

    def __init__(self, message: str, context: Optional[Dict[str, Any]] = None):
        """Initialize exception with message and optional context.

        Args:
            message: Human-readable error message
            context: Optional dictionary of additional error context
        """
        super().__init__(message)
        self.message = message
        self.context = context or {}
        # Keep details for backward compatibility
        self.details = context or {}


class ValidationError(SolanaAIRegistriesError):
    """Raised when input validation fails."""

    def __init__(self, field: str, value: Any, constraint: str):
        """Initialize validation error.

        Args:
            field: Name of the field that failed validation
            value: The invalid value
            constraint: Description of the validation constraint
        """
        message = f"Validation failed for field '{field}': {constraint}"
        details = {"field": field, "value": value, "constraint": constraint}
        super().__init__(message, details)
        self.field = field
        self.value = value
        self.constraint = constraint


class ConnectionError(SolanaAIRegistriesError):
    """Raised when RPC connection fails."""

    def __init__(self, message: str, endpoint: Optional[str] = None):
        """Initialize connection error.

        Args:
            message: Error message
            endpoint: Optional RPC endpoint that failed
        """
        details = {"endpoint": endpoint} if endpoint else {}
        super().__init__(message, details)
        self.endpoint = endpoint


class InvalidPublicKeyError(ValidationError):
    """Raised when a public key is invalid."""

    def __init__(self, pubkey: str):
        """Initialize invalid public key error.

        Args:
            pubkey: The invalid public key string
        """
        super().__init__(
            field="public_key",
            value=pubkey,
            constraint="must be a valid base58 public key",
        )


class InvalidInputError(ValidationError):
    """Raised when input parameters are invalid."""

    def __init__(self, parameter: str, value: Any, reason: str):
        """Initialize invalid input error.

        Args:
            parameter: Name of the invalid parameter
            value: The invalid value
            reason: Reason why the value is invalid
        """
        super().__init__(field=parameter, value=value, constraint=reason)


class RegistrationError(SolanaAIRegistriesError):
    """Raised when registry registration fails."""

    pass


class AgentNotFoundError(SolanaAIRegistriesError):
    """Raised when an agent is not found in the registry."""

    def __init__(self, agent_id: str, owner: Optional[str] = None):
        """Initialize agent not found error.

        Args:
            agent_id: The agent ID that was not found
            owner: Optional owner public key
        """
        message = f"Agent '{agent_id}' not found"
        if owner:
            message += f" for owner {owner}"
        details = {"agent_id": agent_id, "owner": owner}
        super().__init__(message, details)
        self.agent_id = agent_id
        self.owner = owner


class McpServerNotFoundError(SolanaAIRegistriesError):
    """Raised when an MCP server is not found in the registry."""

    def __init__(self, server_id: str, owner: Optional[str] = None):
        """Initialize MCP server not found error.

        Args:
            server_id: The server ID that was not found
            owner: Optional owner public key
        """
        message = f"MCP server '{server_id}' not found"
        if owner:
            message += f" for owner {owner}"
        details = {"server_id": server_id, "owner": owner}
        super().__init__(message, details)
        self.server_id = server_id
        self.owner = owner


class PaymentError(SolanaAIRegistriesError):
    """Raised when payment operations fail."""

    pass


class IDLError(SolanaAIRegistriesError):
    """Raised when IDL loading or parsing fails."""

    def __init__(self, message: str, program_name: Optional[str] = None):
        """Initialize IDL error.

        Args:
            message: Error message
            program_name: Optional program name that failed
        """
        details = {"program_name": program_name} if program_name else {}
        super().__init__(message, details)
        self.program_name = program_name


class TransactionError(SolanaAIRegistriesError):
    """Raised when a Solana transaction fails."""

    def __init__(
        self,
        message: str,
        signature: Optional[str] = None,
        logs: Optional[List[str]] = None,
    ):
        """Initialize transaction error.

        Args:
            message: Error message from transaction
            signature: Transaction signature if available
            logs: Transaction logs if available
        """
        details: Dict[str, Any] = {}
        if signature:
            details["signature"] = signature
        if logs:
            details["logs"] = logs
        super().__init__(message, details)
        self.signature = signature
        self.logs = logs


class AgentExistsError(SolanaAIRegistriesError):
    """Raised when trying to register an agent that already exists."""

    def __init__(self, agent_id: str, owner: str):
        """Initialize agent exists error.

        Args:
            agent_id: ID of the existing agent
            owner: Owner public key
        """
        message = f"Agent '{agent_id}' already exists for owner {owner}"
        details = {"agent_id": agent_id, "owner": owner}
        super().__init__(message, details)
        self.agent_id = agent_id
        self.owner = owner


class McpServerExistsError(SolanaAIRegistriesError):
    """Raised when trying to register an MCP server that already exists."""

    def __init__(self, server_id: str, owner: str):
        """Initialize MCP server exists error.

        Args:
            server_id: ID of the existing server
            owner: Owner public key
        """
        message = f"MCP server '{server_id}' already exists for owner {owner}"
        details = {"server_id": server_id, "owner": owner}
        super().__init__(message, details)
        self.server_id = server_id
        self.owner = owner


class InsufficientFundsError(SolanaAIRegistriesError):
    """Raised when account has insufficient funds for operation."""

    def __init__(self, required: int, available: int, token_mint: str):
        """Initialize insufficient funds error.

        Args:
            required: Required amount in base units
            available: Available amount in base units
            token_mint: Token mint address
        """
        message = f"Insufficient funds: required {required}, " f"available {available}"
        details = {
            "required": required,
            "available": available,
            "token_mint": token_mint,
        }
        super().__init__(message, details)
        self.required = required
        self.available = available
        self.token_mint = token_mint


class AccountNotFoundError(SolanaAIRegistriesError):
    """Raised when a required account is not found on-chain."""

    def __init__(self, account_type: str, identifier: str):
        """Initialize account not found error.

        Args:
            account_type: Type of account (e.g., 'agent', 'mcp_server')
            identifier: Account identifier
        """
        message = f"{account_type.title()} account not found: {identifier}"
        details = {"account_type": account_type, "identifier": identifier}
        super().__init__(message, details)
        self.account_type = account_type
        self.identifier = identifier


class IdlLoadError(SolanaAIRegistriesError):
    """Raised when IDL loading fails."""

    def __init__(self, program_name: str, reason: str):
        """Initialize IDL load error.

        Args:
            program_name: Name of the program whose IDL failed to load
            reason: Reason for the failure
        """
        message = f"Failed to load IDL for program '{program_name}': {reason}"
        details = {"program_name": program_name, "reason": reason}
        super().__init__(message, details)
        self.program_name = program_name
        self.reason = reason


class ConfigurationError(SolanaAIRegistriesError):
    """Raised when SDK configuration is invalid."""

    def __init__(self, setting: str, value: Any, expected: str):
        """Initialize configuration error.

        Args:
            setting: Name of the configuration setting
            value: Invalid value provided
            expected: Description of expected value
        """
        message = (
            f"Invalid configuration for '{setting}': "
            f"expected {expected}, got {value}"
        )
        details = {"setting": setting, "value": value, "expected": expected}
        super().__init__(message, details)
        self.setting = setting
        self.value = value
        self.expected = expected
