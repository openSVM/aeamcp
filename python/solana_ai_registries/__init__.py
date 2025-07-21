"""
Python SDK for Solana AI Registries.

This package provides client libraries for interacting with the Agent Registry
and MCP Server Registry programs on Solana blockchain.

Modules:
    client: Low-level RPC client and transaction builder
    agent: High-level agent registry operations
    mcp: High-level MCP server registry operations
    payments: Payment flow implementations
    idl: Dynamic IDL loading and type generation
    types: Data classes and type definitions
    exceptions: Custom exception hierarchy
    constants: Program constants and addresses
"""

__version__ = "0.1.0"
__author__ = "AEAMCP Team"
__email__ = "dev@aeamcp.org"

# Core API exports
from .agent import AgentRegistry
from .client import SolanaAIRegistriesClient
from .exceptions import (
    AgentExistsError,
    InsufficientFundsError,
    McpServerExistsError,
    SolanaAIRegistriesError,
    TransactionError,
    ValidationError,
)
from .idl import IDLLoader, idl_loader
from .mcp import McpServerRegistry
from .payments import PaymentManager
from .types import (
    AgentRegistryEntry,
    AgentSkill,
    AgentStatus,
    McpCapabilities,
    McpServerRegistryEntry,
    McpServerStatus,
    ServiceEndpoint,
)

__all__ = [
    # Core classes
    "SolanaAIRegistriesClient",
    "AgentRegistry",
    "McpServerRegistry",
    "PaymentManager",
    "IDLLoader",
    "idl_loader",
    # Data types
    "AgentRegistryEntry",
    "McpServerRegistryEntry",
    "AgentStatus",
    "McpServerStatus",
    "ServiceEndpoint",
    "AgentSkill",
    "McpCapabilities",
    # Exceptions
    "SolanaAIRegistriesError",
    "ValidationError",
    "AgentExistsError",
    "McpServerExistsError",
    "InsufficientFundsError",
    "TransactionError",
]
