"""
Constants and configuration values for Solana AI Registries SDK.

This module contains all constants extracted from the on-chain programs,
ensuring consistency between the SDK and the deployed contracts.

All values are sourced from: sdk/constants.md
"""

from decimal import Decimal
from typing import Final, List, Union

# ============================================================================
# AGENT REGISTRY CONSTANTS
# ============================================================================

# Size Limits
MAX_AGENT_ID_LEN: Final[int] = 64
MAX_AGENT_NAME_LEN: Final[int] = 128
MAX_AGENT_DESCRIPTION_LEN: Final[int] = 512
MAX_AGENT_VERSION_LEN: Final[int] = 32
MAX_PROVIDER_NAME_LEN: Final[int] = 128
MAX_PROVIDER_URL_LEN: Final[int] = 256
MAX_DOCUMENTATION_URL_LEN: Final[int] = 256
MAX_SERVICE_ENDPOINTS: Final[int] = 3
MAX_ENDPOINT_PROTOCOL_LEN: Final[int] = 64
MAX_ENDPOINT_URL_LEN: Final[int] = 256
MAX_SUPPORTED_MODES: Final[int] = 5
MAX_MODE_LEN: Final[int] = 64
MAX_SKILLS: Final[int] = 10
MAX_SKILL_ID_LEN: Final[int] = 64
MAX_SKILL_NAME_LEN: Final[int] = 128
MAX_SKILL_TAGS: Final[int] = 5
MAX_SKILL_TAG_LEN: Final[int] = 32
MAX_SECURITY_INFO_URI_LEN: Final[int] = 256
MAX_AEA_ADDRESS_LEN: Final[int] = 128
MAX_ECONOMIC_INTENT_LEN: Final[int] = 256
MAX_EXTENDED_METADATA_URI_LEN: Final[int] = 256
MAX_AGENT_TAGS: Final[int] = 10
MAX_AGENT_TAG_LEN: Final[int] = 32

# Agent Status Values
AGENT_STATUS_PENDING: Final[int] = 0
AGENT_STATUS_ACTIVE: Final[int] = 1
AGENT_STATUS_INACTIVE: Final[int] = 2
AGENT_STATUS_DEREGISTERED: Final[int] = 3

# Agent Account Size
AGENT_REGISTRY_ENTRY_SPACE: Final[int] = 2048  # ~2048 bytes

# ============================================================================
# MCP SERVER REGISTRY CONSTANTS
# ============================================================================

# Size Limits
MAX_SERVER_ID_LEN: Final[int] = 64
MAX_SERVER_NAME_LEN: Final[int] = 128
MAX_SERVER_VERSION_LEN: Final[int] = 32
MAX_SERVER_ENDPOINT_URL_LEN: Final[int] = 256
MAX_SERVER_CAPABILITIES_SUMMARY_LEN: Final[int] = 256
MAX_ONCHAIN_TOOL_DEFINITIONS: Final[int] = 5
MAX_TOOL_NAME_LEN: Final[int] = 64
MAX_TOOL_TAGS: Final[int] = 3
MAX_TOOL_TAG_LEN: Final[int] = 32
MAX_ONCHAIN_RESOURCE_DEFINITIONS: Final[int] = 5
MAX_RESOURCE_URI_PATTERN_LEN: Final[int] = 128
MAX_RESOURCE_TAGS: Final[int] = 3
MAX_RESOURCE_TAG_LEN: Final[int] = 32
MAX_ONCHAIN_PROMPT_DEFINITIONS: Final[int] = 5
MAX_PROMPT_NAME_LEN: Final[int] = 64
MAX_PROMPT_TAGS: Final[int] = 3
MAX_PROMPT_TAG_LEN: Final[int] = 32
MAX_FULL_CAPABILITIES_URI_LEN: Final[int] = 256
MAX_SERVER_TAGS: Final[int] = 10
MAX_SERVER_TAG_LEN: Final[int] = 32

# MCP Server Status Values
MCP_STATUS_PENDING: Final[int] = 0
MCP_STATUS_ACTIVE: Final[int] = 1
MCP_STATUS_INACTIVE: Final[int] = 2
MCP_STATUS_DEREGISTERED: Final[int] = 3

# MCP Server Account Size
MCP_SERVER_REGISTRY_ENTRY_SPACE: Final[int] = 3072  # ~3072 bytes

# ============================================================================
# SHARED CONSTANTS
# ============================================================================

# Serialization
HASH_SIZE: Final[int] = 32
STRING_LEN_PREFIX_SIZE: Final[int] = 4
OPTION_DISCRIMINATOR_SIZE: Final[int] = 1

# PDA Seeds
AGENT_REGISTRY_PDA_SEED: Final[bytes] = b"agent_reg_v1"
MCP_SERVER_REGISTRY_PDA_SEED: Final[bytes] = b"mcp_srv_reg_v1"

# ============================================================================
# TOKEN INTEGRATION CONSTANTS
# ============================================================================

# A2AMPL Token
A2AMPL_DECIMALS: Final[int] = 9
A2AMPL_BASE_UNIT: Final[int] = 1_000_000_000  # 1 A2AMPL = 10^9 base units
A2AMPL_TOKEN_MINT_MAINNET: Final[str] = "Cpzvdx6pppc9TNArsGsqgShCsKC9NCCjA2gtzHvUpump"
A2AMPL_TOKEN_MINT_DEVNET: Final[str] = "A2AMPLyncKHwfSnwRNsJ2qsjsetgo9fGkP8YZPsDZ9mE"

# Agent Registry Fees (in base units)
AGENT_REGISTRATION_FEE: Final[int] = 100_000_000_000  # 100 A2AMPL

# Agent Staking Tiers (in base units)
BRONZE_TIER_STAKE: Final[int] = 1_000_000_000_000  # 1,000 A2AMPL
SILVER_TIER_STAKE: Final[int] = 10_000_000_000_000  # 10,000 A2AMPL
GOLD_TIER_STAKE: Final[int] = 50_000_000_000_000  # 50,000 A2AMPL
PLATINUM_TIER_STAKE: Final[int] = 100_000_000_000_000  # 100,000 A2AMPL

# Agent Lock Periods (in seconds)
BRONZE_LOCK_PERIOD: Final[int] = 2_592_000  # 30 days
SILVER_LOCK_PERIOD: Final[int] = 7_776_000  # 90 days
GOLD_LOCK_PERIOD: Final[int] = 15_552_000  # 180 days
PLATINUM_LOCK_PERIOD: Final[int] = 31_536_000  # 365 days

# MCP Server Registry Fees (in base units)
MCP_REGISTRATION_FEE: Final[int] = 50_000_000_000  # 50 A2AMPL

# MCP Server Verification Stakes (in base units)
BASIC_SERVER_STAKE: Final[int] = 500_000_000_000  # 500 A2AMPL
VERIFIED_SERVER_STAKE: Final[int] = 5_000_000_000_000  # 5,000 A2AMPL
PREMIUM_SERVER_STAKE: Final[int] = 25_000_000_000_000  # 25,000 A2AMPL

# Staking Limits (in base units)
MIN_STAKE_AMOUNT: Final[int] = 500_000_000_000  # 500 A2AMPL
MIN_LOCK_PERIOD: Final[int] = 604_800  # 7 days
MAX_LOCK_PERIOD: Final[int] = 63_072_000  # 2 years

# Service Fees (in base units)
MIN_SERVICE_FEE: Final[int] = 1_000_000_000  # 1.0 A2AMPL
MIN_TOOL_FEE: Final[int] = 1_000_000_000  # 1.0 A2AMPL
MIN_RESOURCE_FEE: Final[int] = 500_000_000  # 0.5 A2AMPL
MIN_PROMPT_FEE: Final[int] = 2_000_000_000  # 2.0 A2AMPL
MAX_BULK_DISCOUNT: Final[int] = 50  # 50% maximum discount

# Quality Metrics
QUALITY_UPDATE_INTERVAL: Final[int] = 86_400  # 24 hours
MIN_UPTIME_FOR_PREMIUM: Final[int] = 95  # 95% minimum uptime

# Priority Multipliers (basis points, 100 = 1.0x)
MIN_PRIORITY_MULTIPLIER: Final[int] = 100  # 1.0x minimum
MAX_PRIORITY_MULTIPLIER: Final[int] = 300  # 3.0x maximum

# Token Vault Seeds
STAKING_VAULT_SEED: Final[bytes] = b"staking_vault"
FEE_VAULT_SEED: Final[bytes] = b"fee_vault"
REGISTRATION_VAULT_SEED: Final[bytes] = b"registration_vault"

# ============================================================================
# PROGRAM IDS
# ============================================================================

# Registry Programs
AGENT_REGISTRY_PROGRAM_ID: Final[str] = (
    "11111111111111111111111111111112"  # To be updated with real program ID
)
MCP_SERVER_REGISTRY_PROGRAM_ID: Final[str] = (
    "11111111111111111111111111111113"  # To be updated with real program ID
)

# Authorized External Programs
AUTHORIZED_ESCROW_PROGRAM_ID: Final[str] = (
    "11111111111111111111111111111111"  # Placeholder
)
AUTHORIZED_DDR_PROGRAM_ID: Final[str] = (
    "11111111111111111111111111111111"  # Placeholder
)

# ============================================================================
# NETWORK CONFIGURATION
# ============================================================================

# Default RPC Endpoints
DEFAULT_MAINNET_RPC: Final[str] = "https://api.mainnet-beta.solana.com"
DEFAULT_DEVNET_RPC: Final[str] = "https://api.devnet.solana.com"
DEFAULT_TESTNET_RPC: Final[str] = "https://api.testnet.solana.com"

# Alternative RPC endpoints for failover (using most reliable endpoints)
FALLBACK_DEVNET_RPCS: Final[List[str]] = [
    "https://api.devnet.solana.com",  # Official Solana Labs endpoint
    "https://devnet.helius-rpc.com",  # Helius (reliable)
    "https://solana-devnet.g.alchemy.com/v2/demo",  # Alchemy demo
    "https://devnet.sonic.game",  # Sonic (alternative)
]

# Transaction Configuration
DEFAULT_COMMITMENT: Final[str] = "confirmed"
DEFAULT_TIMEOUT: Final[int] = 60  # seconds
MAX_RETRIES: Final[int] = 3

# ============================================================================
# UTILITY FUNCTIONS
# ============================================================================


def a2ampl_to_base_units(amount: Union[float, Decimal]) -> int:
    """Convert A2AMPL decimal amount to base units.

    Args:
        amount: Amount in A2AMPL (e.g., 100.5)

    Returns:
        Amount in base units (e.g., 100500000000)
    """
    if isinstance(amount, Decimal):
        return int(amount * Decimal(str(A2AMPL_BASE_UNIT)))
    return int(amount * A2AMPL_BASE_UNIT)


def base_units_to_a2ampl(base_units: int) -> float:
    """Convert base units to A2AMPL decimal amount.

    Args:
        base_units: Amount in base units (e.g., 100500000000)

    Returns:
        Amount in A2AMPL (e.g., 100.5)
    """
    return base_units / A2AMPL_BASE_UNIT


def get_token_mint_for_cluster(cluster: str) -> str:
    """Get the appropriate A2AMPL token mint for cluster.

    Args:
        cluster: Cluster name ('mainnet', 'devnet', 'testnet')

    Returns:
        Token mint address for the cluster

    Raises:
        ValueError: If cluster is not supported
    """
    if cluster in ("mainnet-beta", "mainnet"):
        return A2AMPL_TOKEN_MINT_MAINNET
    elif cluster in ("devnet", "testnet"):
        return A2AMPL_TOKEN_MINT_DEVNET
    else:
        raise ValueError(f"Unsupported cluster: {cluster}")


def validate_string_length(value: str, max_length: int, field_name: str) -> None:
    """Validate string length against maximum constraint.

    Args:
        value: String value to validate
        max_length: Maximum allowed length
        field_name: Name of the field for error messages

    Raises:
        ValueError: If string exceeds maximum length
    """
    if len(value) > max_length:
        raise ValueError(
            f"{field_name} exceeds maximum length: {len(value)} > {max_length}"
        )


def validate_url(url: str, field_name: str) -> None:
    """Validate URL format.

    Args:
        url: URL to validate
        field_name: Name of the field for error messages

    Raises:
        ValueError: If URL format is invalid
    """
    # Check for None first - let it raise AttributeError as expected
    if url is None:
        # This will raise AttributeError when we try to call startswith on None
        pass

    # Check allowed schemes first (this will handle most invalid cases)
    allowed_schemes = ("http://", "https://", "ipfs://", "ar://")
    if not any(url.startswith(scheme) for scheme in allowed_schemes):
        raise ValueError(
            f"{field_name} must start with one of: {', '.join(allowed_schemes)}"
        )
