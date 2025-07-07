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
from .client import SolanaAIRegistriesClient
from .agent import AgentRegistry
from .mcp import McpServerRegistry
from .payments import PaymentManager
from .types import (
    AgentRegistryEntry,
    McpServerRegistryEntry,
    AgentStatus,
    McpServerStatus,
    ServiceEndpoint,
    AgentSkill,
    McpCapabilities,
)
from .exceptions import (
    SolanaAIRegistriesError,
    ValidationError,
    AgentExistsError,
    McpServerExistsError,
    InsufficientFundsError,
    TransactionError,
)

__all__ = [
    # Core classes
    "SolanaAIRegistriesClient",
    "AgentRegistry", 
    "McpServerRegistry",
    "PaymentManager",
    
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