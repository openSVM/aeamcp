"""
High-level MCP server registry operations.

Provides async CRUD operations for MCP (Model Context Protocol) server
registry entries, including registration, updates, retrieval, and deregistration.
"""

import logging
from typing import Any, Dict, List, Optional

from solders.keypair import Keypair
from solders.pubkey import Pubkey as PublicKey
from solders.transaction import Transaction

from .client import SolanaAIRegistriesClient
from .constants import (
    MAX_SERVER_ID_LEN,
    MAX_SERVER_NAME_LEN,
    validate_string_length,
    validate_url,
)
from .exceptions import (
    McpServerNotFoundError,
    RegistrationError,
    SolanaAIRegistriesError,
)
from .types import (
    McpCapabilities,
    McpServerRegistryEntry,
    McpServerStatus,
)

logger = logging.getLogger(__name__)


class McpServerRegistry:
    """High-level async MCP server registry operations."""

    def __init__(self, client: SolanaAIRegistriesClient) -> None:
        """
        Initialize MCP server registry with client.

        Args:
            client: Low-level Solana client instance
        """
        self.client = client

    async def register_server(
        self,
        server_id: str,
        name: str,
        endpoint_url: str,
        owner: Keypair,
        capabilities: Optional[McpCapabilities] = None,
        description: Optional[str] = None,
        metadata_uri: Optional[str] = None,
        **kwargs: Any,
    ) -> str:
        """
        Register a new MCP server in the registry.

        Args:
            server_id: Unique server identifier
            name: Human-readable server name
            endpoint_url: Server endpoint URL
            owner: Server owner keypair for signing
            capabilities: Server capabilities configuration
            description: Server description
            metadata_uri: URI to additional metadata (IPFS, Arweave, etc.)
            **kwargs: Additional server properties

        Returns:
            Transaction signature

        Raises:
            InvalidInputError: If input validation fails
            RegistrationError: If registration fails
        """
        # Validate inputs
        validate_string_length(server_id, MAX_SERVER_ID_LEN, "server_id")
        validate_string_length(name, MAX_SERVER_NAME_LEN, "name")
        validate_url(endpoint_url, "endpoint_url")

        if metadata_uri:
            validate_url(metadata_uri, "metadata_uri")

        # Check if server already exists
        existing_server = await self.get_server(server_id, owner.pubkey())
        if existing_server is not None:
            raise RegistrationError(
                f"MCP server with ID '{server_id}' already exists for owner"
            )

        try:
            # Build register MCP server instruction
            instruction = self.client.build_register_mcp_server_instruction(
                server_id=server_id,
                name=name,
                endpoint_url=endpoint_url,
                owner=owner.pubkey(),
                description=description,
            )

            # Create transaction
            transaction = Transaction.new_with_payer([instruction], owner.pubkey())

            # Send transaction
            signature = await self.client.send_transaction(transaction, [owner])

            logger.info(f"MCP server {server_id} registered successfully: {signature}")
            return signature

        except Exception as e:
            raise RegistrationError(f"Failed to register MCP server: {e}")

    async def update_server(
        self,
        server_id: str,
        owner: Keypair,
        updates: Dict[str, Any],
    ) -> str:
        """
        Update an existing MCP server's details.

        Args:
            server_id: Unique server identifier
            owner: Server owner keypair for signing
            updates: Dictionary of fields to update

        Returns:
            Transaction signature

        Raises:
            McpServerNotFoundError: If server doesn't exist
            InvalidInputError: If update data is invalid
        """
        # Validate server exists
        existing_server = await self.get_server(server_id, owner.pubkey())
        if existing_server is None:
            raise McpServerNotFoundError(
                f"MCP server with ID '{server_id}' not found for owner"
            )

        # Validate update fields
        if "name" in updates:
            validate_string_length(updates["name"], MAX_SERVER_NAME_LEN, "name")
        if "endpoint_url" in updates:
            validate_url(updates["endpoint_url"], "endpoint_url")
        if "metadata_uri" in updates and updates["metadata_uri"]:
            validate_url(updates["metadata_uri"], "metadata_uri")

        try:
            # For now, using a simple approach since update instructions
            # aren't fully defined
            instruction = self.client.build_register_mcp_server_instruction(
                server_id=server_id,
                name=updates.get("name", "Updated Server"),
                endpoint_url=updates.get("endpoint_url", "https://example.com"),
                owner=owner.pubkey(),
                description=updates.get("description"),
            )

            # Create transaction
            transaction = Transaction.new_with_payer([instruction], owner.pubkey())

            # Send transaction
            signature = await self.client.send_transaction(transaction, [owner])

            logger.info(f"MCP server {server_id} updated successfully: {signature}")
            return signature

        except Exception as e:
            raise SolanaAIRegistriesError(f"Failed to update MCP server: {e}")

    async def get_server(
        self, server_id: str, owner: PublicKey
    ) -> Optional[McpServerRegistryEntry]:
        """
        Retrieve MCP server details by ID and owner.

        Args:
            server_id: Unique server identifier
            owner: Server owner's public key

        Returns:
            MCP server registry entry or None if not found

        Raises:
            InvalidInputError: If inputs are invalid
        """
        validate_string_length(server_id, MAX_SERVER_ID_LEN, "server_id")

        try:
            account_data = await self.client.get_mcp_server_registry_entry(
                server_id, owner
            )
            if account_data is None:
                return None

            # Deserialize account data using the client's deserialization method
            if "data" in account_data and isinstance(
                account_data["data"], (list, bytes)
            ):
                if isinstance(account_data["data"], list):
                    # Convert list to bytes if needed
                    account_bytes = bytes(account_data["data"])
                else:
                    account_bytes = account_data["data"]

                deserialized_data = await self.client.deserialize_mcp_server_account(
                    account_bytes
                )

                return McpServerRegistryEntry(
                    server_id=deserialized_data["server_id"],
                    name=deserialized_data["name"],
                    server_version="1.0.0",  # Default version
                    endpoint_url=deserialized_data["endpoint_url"],
                    owner=deserialized_data["owner"],
                    status=McpServerStatus(deserialized_data["status"]),
                    capabilities=McpCapabilities(
                        supports_tools=True,
                        supports_resources=True,
                        supports_prompts=False,
                    ),
                    created_at=deserialized_data.get("created_at", 0),
                    updated_at=deserialized_data.get("updated_at", 0),
                )
            else:
                return None

        except Exception as e:
            logger.error(f"Failed to retrieve MCP server {server_id}: {e}")
            return None

    async def deregister_server(self, server_id: str, owner: Keypair) -> str:
        """
        Deregister an MCP server from the registry.

        Args:
            server_id: Unique server identifier
            owner: Server owner keypair for signing

        Returns:
            Transaction signature

        Raises:
            McpServerNotFoundError: If server doesn't exist
        """
        # Validate server exists
        existing_server = await self.get_server(server_id, owner.pubkey())
        if existing_server is None:
            raise McpServerNotFoundError(
                f"MCP server with ID '{server_id}' not found for owner"
            )

        try:
            # Build deregister MCP server instruction
            instruction = self.client.build_deregister_mcp_server_instruction(
                server_id=server_id, owner=owner.pubkey()
            )

            # Create transaction
            transaction = Transaction.new_with_payer([instruction], owner.pubkey())

            # Send transaction
            signature = await self.client.send_transaction(transaction, [owner])

            logger.info(
                f"MCP server {server_id} deregistered successfully: {signature}"
            )
            return signature

        except Exception as e:
            raise SolanaAIRegistriesError(f"Failed to deregister MCP server: {e}")

    async def list_servers_by_owner(
        self, owner: PublicKey, limit: int = 100
    ) -> List[McpServerRegistryEntry]:
        """
        List all MCP servers owned by a specific owner.

        Args:
            owner: Owner's public key
            limit: Maximum number of servers to return

        Returns:
            List of MCP server registry entries

        Raises:
            ConnectionError: If RPC request fails
        """
        try:
            # TODO: Implement proper program account filtering
            # This would use getProgramAccounts with filters
            logger.info(f"Listing MCP servers for owner {owner} (limit: {limit})")

            # Mock implementation - return empty list for now
            return []

        except Exception as e:
            logger.error(f"Failed to list MCP servers for owner {owner}: {e}")
            return []

    async def search_servers(
        self,
        query: Optional[str] = None,
        capabilities: Optional[List[str]] = None,
        status: Optional[McpServerStatus] = None,
        limit: int = 100,
    ) -> List[McpServerRegistryEntry]:
        """
        Search MCP servers by various criteria.

        Args:
            query: Text search query for name/description
            capabilities: List of required capabilities
            status: Server status filter
            limit: Maximum number of results

        Returns:
            List of matching MCP server registry entries
        """
        try:
            # TODO: Implement proper search functionality
            # This would require indexing or client-side filtering
            logger.info(
                f"Searching MCP servers with query='{query}', "
                f"capabilities={capabilities}, status={status}"
            )

            # Mock implementation - return empty list for now
            return []

        except Exception as e:
            logger.error(f"Failed to search MCP servers: {e}")
            return []

    async def update_server_status(
        self, server_id: str, owner: Keypair, status: McpServerStatus
    ) -> str:
        """
        Update MCP server status (active/inactive/deregistered).

        Args:
            server_id: Unique server identifier
            owner: Server owner keypair for signing
            status: New server status

        Returns:
            Transaction signature

        Raises:
            McpServerNotFoundError: If server doesn't exist
        """
        return await self.update_server(server_id, owner, {"status": status.value})

    async def ping_server(self, server_id: str, owner: PublicKey) -> Dict[str, Any]:
        """
        Ping MCP server to check availability and response time.

        Args:
            server_id: Unique server identifier
            owner: Server owner's public key

        Returns:
            Ping result with status and response time

        Raises:
            McpServerNotFoundError: If server doesn't exist
        """
        server_entry = await self.get_server(server_id, owner)
        if server_entry is None:
            raise McpServerNotFoundError(f"MCP server with ID '{server_id}' not found")

        try:
            # TODO: Implement actual HTTP ping to server endpoint
            logger.info(f"Pinging MCP server {server_id}")

            # Mock implementation
            return {
                "status": "available",
                "response_time_ms": 150,
                "endpoint": server_entry.endpoint_url,
                "timestamp": 1640995200,  # Mock timestamp
            }

        except Exception as e:
            logger.error(f"Failed to ping MCP server {server_id}: {e}")
            return {
                "status": "unavailable",
                "error": str(e),
                "endpoint": server_entry.endpoint_url,
                "timestamp": 1640995200,  # Mock timestamp
            }
