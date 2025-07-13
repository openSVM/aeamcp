"""
High-level agent registry operations.

Provides async CRUD operations for agent registry entries,
including registration, updates, retrieval, and deregistration.
"""

import logging
from typing import Any, Dict, List, Optional

from solders.keypair import Keypair
from solders.pubkey import Pubkey as PublicKey
from solders.transaction import Transaction

from .client import SolanaAIRegistriesClient
from .constants import (
    MAX_AGENT_DESCRIPTION_LEN,
    MAX_AGENT_ID_LEN,
    MAX_AGENT_NAME_LEN,
    validate_string_length,
    validate_url,
)
from .exceptions import (
    AgentNotFoundError,
    InvalidInputError,
    RegistrationError,
    SolanaAIRegistriesError,
)
from .types import (
    AgentRegistryEntry,
    AgentSkill,
    AgentStatus,
    ServiceEndpoint,
)

logger = logging.getLogger(__name__)


class AgentRegistry:
    """High-level async agent registry operations."""

    def __init__(self, client: SolanaAIRegistriesClient) -> None:
        """
        Initialize agent registry with client.

        Args:
            client: Low-level Solana client instance
        """
        self.client = client

    async def register_agent(
        self,
        agent_id: str,
        name: str,
        description: str,
        owner: Keypair,
        service_endpoint: Optional[ServiceEndpoint] = None,
        skills: Optional[List[AgentSkill]] = None,
        metadata_uri: Optional[str] = None,
        **kwargs: Any,
    ) -> str:
        """
        Register a new agent in the registry.

        Args:
            agent_id: Unique agent identifier
            name: Human-readable agent name
            description: Agent description
            owner: Agent owner keypair for signing
            service_endpoint: Service endpoint configuration
            skills: List of agent skills/capabilities
            metadata_uri: URI to additional metadata (IPFS, Arweave, etc.)
            **kwargs: Additional agent properties

        Returns:
            Transaction signature

        Raises:
            InvalidInputError: If input validation fails
            RegistrationError: If registration fails
        """
        # Validate inputs
        validate_string_length(agent_id, MAX_AGENT_ID_LEN, "agent_id")
        validate_string_length(name, MAX_AGENT_NAME_LEN, "name")
        validate_string_length(description, MAX_AGENT_DESCRIPTION_LEN, "description")

        if metadata_uri:
            validate_url(metadata_uri, "metadata_uri")

        # Check if agent already exists
        existing_agent = await self.get_agent(agent_id, owner.public_key)
        if existing_agent is not None:
            raise RegistrationError(
                f"Agent with ID '{agent_id}' already exists for owner"
            )

        try:
            # Derive PDA for agent registry entry
            agent_pda = self.client.derive_agent_pda(agent_id, owner.public_key)

            # Create transaction
            transaction = Transaction()

            # TODO: Add proper instruction for agent registration
            # This would use the actual program instruction from IDL
            # For now, we'll simulate the structure
            logger.info(
                f"Registering agent {agent_id} at PDA {agent_pda} "
                f"for owner {owner.public_key}"
            )

            # Send transaction
            signature = await self.client.send_transaction(transaction, [owner])

            logger.info(f"Agent {agent_id} registered successfully: {signature}")
            return signature

        except Exception as e:
            raise RegistrationError(f"Failed to register agent: {e}")

    async def update_agent(
        self,
        agent_id: str,
        owner: Keypair,
        updates: Dict[str, Any],
    ) -> str:
        """
        Update an existing agent's details.

        Args:
            agent_id: Unique agent identifier
            owner: Agent owner keypair for signing
            updates: Dictionary of fields to update

        Returns:
            Transaction signature

        Raises:
            AgentNotFoundError: If agent doesn't exist
            InvalidInputError: If update data is invalid
        """
        # Validate agent exists
        existing_agent = await self.get_agent(agent_id, owner.public_key)
        if existing_agent is None:
            raise AgentNotFoundError(f"Agent with ID '{agent_id}' not found for owner")

        # Validate update fields
        if "name" in updates:
            validate_string_length(updates["name"], MAX_AGENT_NAME_LEN, "name")
        if "description" in updates:
            validate_string_length(
                updates["description"], MAX_AGENT_DESCRIPTION_LEN, "description"
            )
        if "metadata_uri" in updates and updates["metadata_uri"]:
            validate_url(updates["metadata_uri"], "metadata_uri")

        try:
            # Derive PDA for agent registry entry
            agent_pda = self.client.derive_agent_pda(agent_id, owner.public_key)

            # Create transaction
            transaction = Transaction()

            # TODO: Add proper instruction for agent update
            logger.info(
                f"Updating agent {agent_id} at PDA {agent_pda} "
                f"with updates: {list(updates.keys())}"
            )

            # Send transaction
            signature = await self.client.send_transaction(transaction, [owner])

            logger.info(f"Agent {agent_id} updated successfully: {signature}")
            return signature

        except Exception as e:
            raise SolanaAIRegistriesError(f"Failed to update agent: {e}")

    async def get_agent(
        self, agent_id: str, owner: PublicKey
    ) -> Optional[AgentRegistryEntry]:
        """
        Retrieve agent details by ID and owner.

        Args:
            agent_id: Unique agent identifier
            owner: Agent owner's public key

        Returns:
            Agent registry entry or None if not found

        Raises:
            InvalidInputError: If inputs are invalid
        """
        validate_string_length(agent_id, MAX_AGENT_ID_LEN, "agent_id")

        try:
            account_data = await self.client.get_agent_registry_entry(agent_id, owner)
            if account_data is None:
                return None

            # TODO: Deserialize account data to AgentRegistryEntry
            # This would use the IDL to properly deserialize the account
            # For now, return a mock entry
            return AgentRegistryEntry(
                agent_id=agent_id,
                name=f"Agent {agent_id}",
                description="Mock agent entry",
                owner=owner,
                status=AgentStatus.ACTIVE,
                service_endpoint=None,
                skills=[],
                metadata_uri=None,
                created_at=0,
                updated_at=0,
            )

        except Exception as e:
            logger.error(f"Failed to retrieve agent {agent_id}: {e}")
            return None

    async def deregister_agent(self, agent_id: str, owner: Keypair) -> str:
        """
        Deregister an agent from the registry.

        Args:
            agent_id: Unique agent identifier
            owner: Agent owner keypair for signing

        Returns:
            Transaction signature

        Raises:
            AgentNotFoundError: If agent doesn't exist
        """
        # Validate agent exists
        existing_agent = await self.get_agent(agent_id, owner.public_key)
        if existing_agent is None:
            raise AgentNotFoundError(f"Agent with ID '{agent_id}' not found for owner")

        try:
            # Derive PDA for agent registry entry
            agent_pda = self.client.derive_agent_pda(agent_id, owner.public_key)

            # Create transaction
            transaction = Transaction()

            # TODO: Add proper instruction for agent deregistration
            logger.info(f"Deregistering agent {agent_id} at PDA {agent_pda}")

            # Send transaction
            signature = await self.client.send_transaction(transaction, [owner])

            logger.info(f"Agent {agent_id} deregistered successfully: {signature}")
            return signature

        except Exception as e:
            raise SolanaAIRegistriesError(f"Failed to deregister agent: {e}")

    async def list_agents_by_owner(
        self, owner: PublicKey, limit: int = 100
    ) -> List[AgentRegistryEntry]:
        """
        List all agents owned by a specific owner.

        Args:
            owner: Owner's public key
            limit: Maximum number of agents to return

        Returns:
            List of agent registry entries

        Raises:
            ConnectionError: If RPC request fails
        """
        try:
            # TODO: Implement proper program account filtering
            # This would use getProgramAccounts with filters
            logger.info(f"Listing agents for owner {owner} (limit: {limit})")

            # Mock implementation - return empty list for now
            return []

        except Exception as e:
            logger.error(f"Failed to list agents for owner {owner}: {e}")
            return []

    async def search_agents(
        self,
        query: Optional[str] = None,
        skills: Optional[List[str]] = None,
        status: Optional[AgentStatus] = None,
        limit: int = 100,
    ) -> List[AgentRegistryEntry]:
        """
        Search agents by various criteria.

        Args:
            query: Text search query for name/description
            skills: List of required skills
            status: Agent status filter
            limit: Maximum number of results

        Returns:
            List of matching agent registry entries
        """
        try:
            # TODO: Implement proper search functionality
            # This would require indexing or client-side filtering
            logger.info(
                f"Searching agents with query='{query}', "
                f"skills={skills}, status={status}"
            )

            # Mock implementation - return empty list for now
            return []

        except Exception as e:
            logger.error(f"Failed to search agents: {e}")
            return []

    async def update_agent_status(
        self, agent_id: str, owner: Keypair, status: AgentStatus
    ) -> str:
        """
        Update agent status (active/inactive/deregistered).

        Args:
            agent_id: Unique agent identifier
            owner: Agent owner keypair for signing
            status: New agent status

        Returns:
            Transaction signature

        Raises:
            AgentNotFoundError: If agent doesn't exist
        """
        return await self.update_agent(agent_id, owner, {"status": status.value})
