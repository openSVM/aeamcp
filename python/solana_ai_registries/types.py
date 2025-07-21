"""
Data types and structures for Solana AI Registries SDK.

This module defines all data classes, enums, and type definitions used
throughout the SDK, providing type-safe interfaces for registry operations.
"""

from dataclasses import dataclass, field
from decimal import Decimal
from enum import Enum
from typing import Any, Dict, List, Optional, Union

from .constants import (
    MAX_AGENT_DESCRIPTION_LEN,
    MAX_AGENT_ID_LEN,
    MAX_AGENT_NAME_LEN,
    MAX_SERVER_ID_LEN,
    MAX_SERVER_NAME_LEN,
    validate_string_length,
    validate_url,
)

# ============================================================================
# ENUMS
# ============================================================================


class AgentStatus(Enum):
    """Agent operational status."""

    PENDING = 0
    ACTIVE = 1
    INACTIVE = 2
    DEREGISTERED = 3


class McpServerStatus(Enum):
    """MCP server operational status."""

    PENDING = 0
    ACTIVE = 1
    INACTIVE = 2
    DEREGISTERED = 3


class PaymentType(Enum):
    """Payment flow types."""

    PREPAY = "prepay"
    PAY_AS_YOU_GO = "pyg"
    PAY_PER_USAGE = "ppu"  # Alias for PAY_AS_YOU_GO
    STREAM = "stream"


class PaymentStatus(Enum):
    """Payment transaction status."""

    PENDING = 0
    COMPLETED = 1
    FAILED = 2
    CANCELLED = 3


class StakingTier(Enum):
    """Agent staking tiers."""

    BRONZE = "bronze"
    SILVER = "silver"
    GOLD = "gold"
    PLATINUM = "platinum"


# ============================================================================
# AGENT REGISTRY TYPES
# ============================================================================


@dataclass
class ServiceEndpoint:
    """Agent service endpoint definition."""

    url: str
    protocol: Optional[str] = None
    description: Optional[str] = None
    auth_type: Optional[str] = None
    auth_config: Optional[Dict[str, Any]] = None

    def __post_init__(self) -> None:
        """Validate endpoint data after initialization."""
        # Auto-detect protocol from URL if not provided
        if not self.protocol:
            if self.url.startswith("https://"):
                self.protocol = "https"
            elif self.url.startswith("http://"):
                self.protocol = "http"
            else:
                self.protocol = "unknown"

        validate_string_length(self.protocol, 64, "protocol")
        validate_string_length(self.url, 256, "endpoint URL")
        validate_url(self.url, "endpoint URL")
        if self.description:
            validate_string_length(self.description, 512, "endpoint description")
        if self.auth_type:
            validate_string_length(self.auth_type, 64, "auth_type")


@dataclass
class AgentSkill:
    """Agent skill definition."""

    skill_id: str
    name: str
    description: Optional[str] = None
    category: Optional[str] = None
    tags: List[str] = field(default_factory=list)
    metadata: Optional[Dict[str, Any]] = None

    def __post_init__(self) -> None:
        """Validate skill data after initialization."""
        validate_string_length(self.skill_id, 64, "skill ID")
        validate_string_length(self.name, 128, "skill name")
        if self.description:
            validate_string_length(self.description, 256, "skill description")
        if self.category:
            validate_string_length(self.category, 64, "skill category")
        if len(self.tags) > 5:
            raise ValueError("Maximum 5 tags allowed per skill")
        for tag in self.tags:
            validate_string_length(tag, 32, "skill tag")


@dataclass
class AgentRegistryEntry:
    """Complete agent registry entry."""

    agent_id: str
    name: str
    description: str = ""
    agent_version: str = "1.0.0"
    owner: str = ""  # PublicKey as string
    status: AgentStatus = AgentStatus.PENDING
    provider_name: Optional[str] = None
    provider_url: Optional[str] = None
    documentation_url: Optional[str] = None
    service_endpoints: List[ServiceEndpoint] = field(default_factory=list)
    capabilities_flags: int = 0
    supported_input_modes: List[str] = field(default_factory=list)
    supported_output_modes: List[str] = field(default_factory=list)
    skills: List[AgentSkill] = field(default_factory=list)
    security_info_uri: Optional[str] = None
    aea_address: Optional[str] = None
    economic_intent_summary: Optional[str] = None
    supported_aea_protocols_hash: Optional[bytes] = None
    extended_metadata_uri: Optional[str] = None
    tags: List[str] = field(default_factory=list)
    created_at: int = 0
    updated_at: int = 0
    state_version: int = 1

    def __post_init__(self) -> None:
        """Validate agent data after initialization."""
        # Validate required fields
        validate_string_length(self.agent_id, MAX_AGENT_ID_LEN, "agent_id")
        validate_string_length(self.name, MAX_AGENT_NAME_LEN, "name")
        validate_string_length(
            self.description, MAX_AGENT_DESCRIPTION_LEN, "description"
        )
        validate_string_length(self.agent_version, 32, "agent_version")

        # Validate optional fields
        if self.provider_name:
            validate_string_length(self.provider_name, 128, "provider_name")
        if self.provider_url:
            validate_string_length(self.provider_url, 256, "provider_url")
            validate_url(self.provider_url, "provider_url")
        if self.documentation_url:
            validate_string_length(self.documentation_url, 256, "documentation_url")
            validate_url(self.documentation_url, "documentation_url")

        # Validate collections
        if len(self.service_endpoints) > 3:
            raise ValueError("Maximum 3 service endpoints allowed")
        if len(self.skills) > 10:
            raise ValueError("Maximum 10 skills allowed")
        if len(self.tags) > 10:
            raise ValueError("Maximum 10 tags allowed")
        for tag in self.tags:
            validate_string_length(tag, 32, "agent tag")

    @classmethod
    def from_account_data(cls, data: Dict[str, Any]) -> "AgentRegistryEntry":
        """Create instance from on-chain account data.

        Args:
            data: Raw account data from Solana

        Returns:
            AgentRegistryEntry instance
        """
        return cls(
            agent_id=data["agent_id"],
            name=data["name"],
            description=data["description"],
            agent_version=data["agent_version"],
            owner=str(data["owner"]),
            status=AgentStatus(data["status"]),
            provider_name=data.get("provider_name"),
            provider_url=data.get("provider_url"),
            documentation_url=data.get("documentation_url"),
            service_endpoints=[
                ServiceEndpoint(
                    url=ep["url"],
                    protocol=ep.get("protocol"),
                    description=ep.get("description"),
                    auth_type=ep.get("auth_type"),
                    auth_config=ep.get("auth_config"),
                )
                for ep in data.get("service_endpoints", [])
            ],
            capabilities_flags=data.get("capabilities_flags", 0),
            supported_input_modes=data.get("supported_input_modes", []),
            supported_output_modes=data.get("supported_output_modes", []),
            skills=[
                AgentSkill(
                    skill_id=skill.get("skill_id", ""),
                    name=skill["name"],
                    description=skill.get("description"),
                    category=skill.get("category"),
                    tags=skill.get("tags", []),
                    metadata=skill.get("metadata"),
                )
                for skill in data.get("skills", [])
            ],
            security_info_uri=data.get("security_info_uri"),
            aea_address=data.get("aea_address"),
            economic_intent_summary=data.get("economic_intent_summary"),
            supported_aea_protocols_hash=data.get("supported_aea_protocols_hash"),
            extended_metadata_uri=data.get("extended_metadata_uri"),
            tags=data.get("tags", []),
            created_at=data.get("created_at", 0),
            updated_at=data.get("updated_at", 0),
            state_version=data.get("state_version", 1),
        )


# ============================================================================
# MCP SERVER REGISTRY TYPES
# ============================================================================


@dataclass
class McpTool:
    """MCP tool definition."""

    name: str
    description: Optional[str] = None
    tags: List[str] = field(default_factory=list)
    input_schema: Optional[str] = None
    output_schema: Optional[str] = None

    def __post_init__(self) -> None:
        """Validate tool data after initialization."""
        validate_string_length(self.name, 64, "tool name")
        if len(self.tags) > 3:
            raise ValueError("Maximum 3 tags allowed per tool")
        for tag in self.tags:
            validate_string_length(tag, 32, "tool tag")


@dataclass
class McpResource:
    """MCP resource definition."""

    uri_pattern: str
    name: Optional[str] = None
    description: Optional[str] = None
    tags: List[str] = field(default_factory=list)

    def __post_init__(self) -> None:
        """Validate resource data after initialization."""
        validate_string_length(self.uri_pattern, 128, "URI pattern")
        if len(self.tags) > 3:
            raise ValueError("Maximum 3 tags allowed per resource")
        for tag in self.tags:
            validate_string_length(tag, 32, "resource tag")


@dataclass
class McpPrompt:
    """MCP prompt definition."""

    name: str
    description: Optional[str] = None
    tags: List[str] = field(default_factory=list)

    def __post_init__(self) -> None:
        """Validate prompt data after initialization."""
        validate_string_length(self.name, 64, "prompt name")
        if len(self.tags) > 3:
            raise ValueError("Maximum 3 tags allowed per prompt")
        for tag in self.tags:
            validate_string_length(tag, 32, "prompt tag")


@dataclass
class McpCapabilities:
    """MCP server capabilities summary."""

    supports_tools: bool = False
    supports_resources: bool = False
    supports_prompts: bool = False
    tool_count: int = 0
    resource_count: int = 0
    prompt_count: int = 0
    tools: List[McpTool] = field(default_factory=list)
    resources: List[McpResource] = field(default_factory=list)
    prompts: List[McpPrompt] = field(default_factory=list)


@dataclass
class McpServerRegistryEntry:
    """Complete MCP server registry entry."""

    server_id: str
    name: str
    server_version: str
    endpoint_url: str
    owner: str  # PublicKey as string
    status: McpServerStatus
    description: Optional[str] = None
    capabilities_summary: Optional[str] = None
    capabilities: Optional[McpCapabilities] = None
    full_capabilities_uri: Optional[str] = None
    metadata_uri: Optional[str] = None
    tags: List[str] = field(default_factory=list)
    created_at: int = 0
    updated_at: int = 0
    state_version: int = 1

    def __post_init__(self) -> None:
        """Validate MCP server data after initialization."""
        validate_string_length(self.server_id, MAX_SERVER_ID_LEN, "server_id")
        validate_string_length(self.name, MAX_SERVER_NAME_LEN, "name")
        validate_string_length(self.server_version, 32, "server_version")
        validate_string_length(self.endpoint_url, 256, "endpoint_url")
        validate_url(self.endpoint_url, "endpoint_url")

        if self.description:
            validate_string_length(self.description, 512, "description")
        if self.capabilities_summary:
            validate_string_length(
                self.capabilities_summary, 256, "capabilities_summary"
            )
        if self.full_capabilities_uri:
            validate_string_length(
                self.full_capabilities_uri,
                256,
                "full_capabilities_uri",
            )
            validate_url(self.full_capabilities_uri, "full_capabilities_uri")
        if self.metadata_uri:
            validate_string_length(
                self.metadata_uri,
                256,
                "metadata_uri",
            )
            validate_url(self.metadata_uri, "metadata_uri")

        if len(self.tags) > 10:
            raise ValueError("Maximum 10 tags allowed")
        for tag in self.tags:
            validate_string_length(tag, 32, "server tag")

    @classmethod
    def from_account_data(cls, data: Dict[str, Any]) -> "McpServerRegistryEntry":
        """Create instance from on-chain account data.

        Args:
            data: Raw account data from Solana

        Returns:
            McpServerRegistryEntry instance
        """
        capabilities = None
        if data.get("capabilities"):
            cap_data = data["capabilities"]
            capabilities = McpCapabilities(
                supports_tools=cap_data.get("supports_tools", False),
                supports_resources=cap_data.get("supports_resources", False),
                supports_prompts=cap_data.get("supports_prompts", False),
                tool_count=cap_data.get("tool_count", 0),
                resource_count=cap_data.get("resource_count", 0),
                prompt_count=cap_data.get("prompt_count", 0),
                tools=[McpTool(**tool) for tool in cap_data.get("tools", [])],
                resources=[McpResource(**res) for res in cap_data.get("resources", [])],
                prompts=[McpPrompt(**prompt) for prompt in cap_data.get("prompts", [])],
            )

        return cls(
            server_id=data["server_id"],
            name=data["name"],
            server_version=data["server_version"],
            endpoint_url=data["endpoint_url"],
            owner=str(data["owner"]),
            status=McpServerStatus(data["status"]),
            description=data.get("description"),
            capabilities_summary=data.get("capabilities_summary"),
            capabilities=capabilities,
            full_capabilities_uri=data.get("full_capabilities_uri"),
            metadata_uri=data.get("metadata_uri"),
            tags=data.get("tags", []),
            created_at=data.get("created_at", 0),
            updated_at=data.get("updated_at", 0),
            state_version=data.get("state_version", 1),
        )


# ============================================================================
# PAYMENT TYPES
# ============================================================================


@dataclass
class PaymentRecord:
    """Payment transaction record."""

    payment_id: str
    payer: str
    recipient: str
    amount: int  # Amount in base units
    payment_type: PaymentType
    status: PaymentStatus
    timestamp: int
    signature: Optional[str] = None
    metadata: Optional[Dict[str, Any]] = None


@dataclass
class PaymentDetails:
    """Payment transaction details."""

    payment_type: PaymentType
    amount: Decimal
    token_mint: str
    payer: str
    recipient: str
    timestamp: int
    signature: Optional[str] = None
    metadata: Optional[Dict[str, Any]] = None


@dataclass
class EscrowAccount:
    """Prepaid escrow account details."""

    escrow_address: str
    owner: str
    service_provider: str
    balance: Decimal
    token_mint: str
    created_at: int
    last_used: int


@dataclass
class PaymentStream:
    """Streaming payment details."""

    stream_id: str
    payer: str
    recipient: str
    rate_per_second: Decimal
    total_amount: Decimal
    start_time: int
    end_time: int
    current_balance: Decimal
    is_active: bool


# ============================================================================
# TRANSACTION TYPES
# ============================================================================


@dataclass
class TransactionResult:
    """Result of a blockchain transaction."""

    signature: str
    success: bool
    slot: Optional[int] = None
    block_time: Optional[int] = None
    compute_units_consumed: Optional[int] = None
    logs: List[str] = field(default_factory=list)
    error: Optional[str] = None


@dataclass
class AccountInfo:
    """Solana account information."""

    address: str
    lamports: int
    owner: str
    executable: bool
    rent_epoch: int
    data: Optional[bytes] = None


# ============================================================================
# UTILITY TYPES
# ============================================================================


@dataclass
class PaginationOptions:
    """Pagination parameters for queries."""

    limit: int = 100
    offset: int = 0
    order_by: Optional[str] = None
    order_direction: str = "asc"  # "asc" or "desc"


@dataclass
class PaginatedResult:
    """Paginated query result."""

    items: List[Any]
    total_count: int
    has_next: bool
    has_previous: bool
    current_page: int
    total_pages: int


@dataclass
class NetworkConfig:
    """Network configuration."""

    rpc_url: str
    commitment: str = "confirmed"
    timeout: int = 60
    max_retries: int = 3


# Type aliases for commonly used types
PublicKey = str
Signature = str
Timestamp = int
TokenAmount = Union[int, Decimal]  # Base units or decimal amount
