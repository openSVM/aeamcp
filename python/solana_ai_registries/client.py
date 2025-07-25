"""
Low-level client for Solana AI Registries programs.

Provides async RPC client functionality and transaction building utilities
for interacting with on-chain Agent Registry and MCP Server Registry programs.
"""

import asyncio
import logging
import struct
from typing import Any, Dict, List, Optional

from solana.rpc.async_api import AsyncClient
from solana.rpc.commitment import Commitment
from solana.rpc.types import TxOpts
from solders.hash import Hash
from solders.instruction import AccountMeta, Instruction
from solders.keypair import Keypair
from solders.pubkey import Pubkey as PublicKey
from solders.system_program import ID as SYS_PROGRAM_ID
from solders.transaction import Transaction

from .constants import (
    AGENT_REGISTRY_PROGRAM_ID,
    DEFAULT_DEVNET_RPC,
    FALLBACK_DEVNET_RPCS,
    MCP_SERVER_REGISTRY_PROGRAM_ID,
)
from .exceptions import (
    ConnectionError,
    InvalidPublicKeyError,
    TransactionError,
)

logger = logging.getLogger(__name__)


class SolanaAIRegistriesClient:
    """Low-level async client for Solana AI Registries programs."""

    def __init__(
        self,
        rpc_url: str = DEFAULT_DEVNET_RPC,
        commitment: Optional[Commitment] = None,
        enable_rpc_failover: bool = True,
    ) -> None:
        """
        Initialize client with RPC endpoint.

        Args:
            rpc_url: Solana RPC endpoint URL
            commitment: Transaction commitment level
            enable_rpc_failover: Whether to use failover RPC endpoints
        """
        self.rpc_url = rpc_url
        self.enable_rpc_failover = enable_rpc_failover
        self.commitment = commitment or Commitment("confirmed")
        self._client: Optional[AsyncClient] = None
        self._current_rpc_index = 0
        self.agent_program_id = PublicKey.from_string(AGENT_REGISTRY_PROGRAM_ID)
        self.mcp_program_id = PublicKey.from_string(MCP_SERVER_REGISTRY_PROGRAM_ID)

    def _get_available_rpcs(self) -> List[str]:
        """Get list of available RPC endpoints for failover."""
        if not self.enable_rpc_failover or self.rpc_url not in FALLBACK_DEVNET_RPCS:
            return [self.rpc_url]
        return FALLBACK_DEVNET_RPCS

    def _parse_blockhash_response(self, response: Any, rpc_url: str) -> Optional[Hash]:
        """
        Parse blockhash response safely, handling various response types.

        Args:
            response: RPC response object
            rpc_url: RPC endpoint URL for logging

        Returns:
            Hash object if valid blockhash found, None otherwise
        """
        try:
            # Debug logging for response structure
            logger.debug(f"Blockhash response from {rpc_url}: type={type(response)}")
            if hasattr(response, "__dict__"):
                logger.debug(f"Response attributes: {list(response.__dict__.keys())}")

            # Check if response has expected structure
            if hasattr(response, "value") and response.value:
                logger.debug(f"Response.value type: {type(response.value)}")
                if hasattr(response.value, "__dict__"):
                    logger.debug(
                        f"Response.value attributes: "
                        f"{list(response.value.__dict__.keys())}"
                    )

                if hasattr(response.value, "blockhash"):
                    blockhash = response.value.blockhash
                    logger.debug(
                        f"Found blockhash: type={type(blockhash)}, value={blockhash}"
                    )
                    # Validate that blockhash is a Hash object (not int or other type)
                    if isinstance(blockhash, Hash):
                        return blockhash
                    else:
                        logger.warning(
                            f"Invalid blockhash type from {rpc_url}: "
                            f"{type(blockhash)} - expected Hash object"
                        )
                        return None
                else:
                    logger.warning(f"Response from {rpc_url} missing blockhash field")
                    return None
            else:
                logger.warning(
                    f"Invalid response structure from {rpc_url}: {type(response)}"
                )
                return None
        except Exception as e:
            logger.warning(f"Error parsing blockhash response from {rpc_url}: {e}")
            return None

    async def _get_fresh_blockhash(self, max_attempts: int = 3) -> Hash:
        """
        Get a fresh blockhash with robust retry logic and RPC failover.

        Args:
            max_attempts: Maximum number of attempts to fetch blockhash

        Returns:
            Fresh blockhash Hash object

        Raises:
            ConnectionError: If unable to fetch blockhash after all attempts
        """
        available_rpcs = self._get_available_rpcs()

        for attempt in range(max_attempts):
            # Try current RPC first, then failover to others
            rpc_to_try = available_rpcs[self._current_rpc_index % len(available_rpcs)]

            try:
                if self._client is None or self.rpc_url != rpc_to_try:
                    # Switch to different RPC if needed
                    if self._client:
                        await self._client.close()
                    self.rpc_url = rpc_to_try
                    self._client = AsyncClient(self.rpc_url, commitment=self.commitment)

                # Increased wait time for RPC to be ready and reduce rate limiting
                if attempt > 0:
                    wait_time = 2.5 + (
                        attempt * 2.0
                    )  # Start at 2.5s, increase by 2s each attempt
                    logger.debug(f"Waiting {wait_time}s before retry {attempt + 1}")
                    await asyncio.sleep(wait_time)

                logger.debug(
                    f"Fetching blockhash from {rpc_to_try} (attempt {attempt + 1})"
                )
                blockhash_resp = await self._client.get_latest_blockhash(
                    commitment=self.commitment
                )

                # Use robust parser to handle response
                parsed_blockhash = self._parse_blockhash_response(
                    blockhash_resp, rpc_to_try
                )
                if parsed_blockhash:
                    logger.debug(f"Fresh blockhash obtained from {rpc_to_try}")
                    return parsed_blockhash

                # If parsing failed, try next RPC
                logger.warning(
                    f"Failed to parse blockhash response from {rpc_to_try}, "
                    "trying next endpoint"
                )
                raise ConnectionError(
                    f"Blockhash response was invalid from {rpc_to_try}"
                )

            except Exception as e:
                # Log the specific error with more details
                error_msg = (
                    f"Failed to get blockhash from {rpc_to_try} "
                    f"(attempt {attempt + 1}/{max_attempts})"
                )
                if "429" in str(e) or "Too Many Requests" in str(e):
                    logger.warning(f"{error_msg}: Rate limited - {e}")
                elif "connect" in str(e).lower() or "dns" in str(e).lower():
                    logger.warning(f"{error_msg}: Connection error - {e}")
                elif hasattr(e, "response") and hasattr(e.response, "status_code"):
                    logger.warning(f"{error_msg}: HTTP {e.response.status_code} - {e}")
                else:
                    logger.warning(f"{error_msg}: {e}")
                    # Log the full exception for debugging
                    logger.debug(f"Full exception details: {repr(e)}")

                # Try next RPC endpoint on any error
                self._current_rpc_index += 1

                # Close current client to force reconnection with new RPC
                if self._client:
                    try:
                        await self._client.close()
                    except Exception:  # noqa: S110
                        pass  # Ignore close errors
                    self._client = None

                if attempt < max_attempts - 1:
                    continue

        # All attempts failed
        raise ConnectionError(
            f"Failed to get fresh blockhash after {max_attempts} attempts "
            f"across {len(available_rpcs)} RPC endpoints"
        )

    @property
    def client(self) -> AsyncClient:
        """Get or create async RPC client."""
        if self._client is None:
            self._client = AsyncClient(self.rpc_url, commitment=self.commitment)
        return self._client

    async def close(self) -> None:
        """Close the RPC client connection."""
        if self._client:
            try:
                await self._client.close()
            except Exception as e:
                # Ignore close errors to prevent test failures due to cleanup issues
                logger.debug(f"Error closing RPC client: {e}")
            finally:
                self._client = None

    async def health_check(self) -> bool:
        """
        Check if the Solana RPC connection is healthy and can fetch blockhashes.

        Returns:
            True if connection is healthy, False otherwise
        """
        try:
            # Test basic connection by getting epoch info (lightweight check)
            epoch_info = await self.client.get_epoch_info(commitment=self.commitment)
            if not hasattr(epoch_info, "value") or not epoch_info.value:
                logger.warning("Failed to fetch epoch info")
                return False

            # Test blockhash fetching (most common failure point)
            try:
                await self._get_fresh_blockhash(max_attempts=2)
                logger.debug("RPC connection health check passed")
                return True
            except ConnectionError as e:
                logger.warning(
                    f"Failed to fetch fresh blockhash during health check: {e}"
                )
                return False
        except Exception as e:
            logger.warning(f"RPC health check failed: {e}")
            return False
            return False

    async def __aenter__(self) -> "SolanaAIRegistriesClient":
        """Async context manager entry."""
        return self

    async def __aexit__(self, exc_type: Any, exc_val: Any, exc_tb: Any) -> None:
        """Async context manager exit."""
        await self.close()

    async def get_account_info(
        self, pubkey: PublicKey, encoding: str = "base64"
    ) -> Optional[Dict[str, Any]]:
        """
        Fetch account information from the blockchain.

        Args:
            pubkey: Public key of the account
            encoding: Data encoding format

        Returns:
            Account info dictionary or None if not found

        Raises:
            ConnectionError: If RPC request fails
            InvalidPublicKeyError: If public key is invalid
        """
        try:
            response = await self.client.get_account_info(
                pubkey, encoding=encoding, commitment=self.commitment
            )
            if not hasattr(response, "value") or response.value is None:
                return None

            return {
                "data": response.value.data,
                "executable": response.value.executable,
                "lamports": response.value.lamports,
                "owner": str(response.value.owner),
                "rent_epoch": response.value.rent_epoch,
            }
        except Exception as e:
            if "Invalid public key" in str(e):
                raise InvalidPublicKeyError(f"Invalid public key: {pubkey}")
            raise ConnectionError(f"Failed to fetch account info: {e}")

    async def get_agent_registry_entry(
        self, agent_id: str, owner: PublicKey
    ) -> Optional[Dict[str, Any]]:
        """
        Fetch agent registry entry by ID and owner.

        Args:
            agent_id: Unique agent identifier
            owner: Agent owner's public key

        Returns:
            Agent registry entry data or None if not found

        Raises:
            ConnectionError: If RPC request fails
        """
        try:
            # Derive PDA for agent registry entry
            pda_seeds = [
                b"agent_registry",
                agent_id.encode("utf-8"),
                bytes(owner),
            ]
            pda, _ = PublicKey.find_program_address(pda_seeds, self.agent_program_id)

            account_info = await self.get_account_info(pda)
            if account_info is None:
                return None

            # TODO: Deserialize account data based on IDL structure
            return account_info

        except Exception as e:
            raise ConnectionError(f"Failed to fetch agent registry entry: {e}")

    async def get_mcp_server_registry_entry(
        self, server_id: str, owner: PublicKey
    ) -> Optional[Dict[str, Any]]:
        """
        Fetch MCP server registry entry by ID and owner.

        Args:
            server_id: Unique server identifier
            owner: Server owner's public key

        Returns:
            MCP server registry entry data or None if not found

        Raises:
            ConnectionError: If RPC request fails
        """
        try:
            # Derive PDA for MCP server registry entry
            pda_seeds = [
                b"mcp_server_registry",
                server_id.encode("utf-8"),
                bytes(owner),
            ]
            pda, _ = PublicKey.find_program_address(pda_seeds, self.mcp_program_id)

            account_info = await self.get_account_info(pda)
            if account_info is None:
                return None

            # TODO: Deserialize account data based on IDL structure
            return account_info

        except Exception as e:
            raise ConnectionError(f"Failed to fetch MCP server registry entry: {e}")

    async def send_transaction(
        self,
        transaction: Transaction,
        signers: List[Keypair],
        opts: Optional[TxOpts] = None,
        max_retries: int = 5,
    ) -> str:
        """
        Send transaction with error handling and retry logic.

        Args:
            transaction: Transaction to send
            signers: List of keypairs to sign the transaction
            opts: Transaction options
            max_retries: Maximum number of retry attempts

        Returns:
            Transaction signature

        Raises:
            TransactionError: If transaction fails after retries
        """
        if opts is None:
            opts = TxOpts(skip_confirmation=False, skip_preflight=False)

        last_error = None
        for attempt in range(max_retries):
            try:
                # Get fresh blockhash for each attempt using robust method
                fresh_blockhash = await self._get_fresh_blockhash(max_attempts=3)

                # Wait longer to ensure blockhash propagated across network
                if attempt > 0:
                    await asyncio.sleep(
                        2.0 + (attempt * 1.5)
                    )  # Start at 2s, increase by 1.5s

                # Create a new transaction instance to avoid signature conflicts
                # Note: Cannot use deepcopy on Transaction objects as they
                # cannot be pickled. Use serialization instead.
                tx_copy = Transaction.from_bytes(bytes(transaction))

                # Sign transaction with fresh blockhash
                tx_copy.sign(signers, fresh_blockhash)

                # Send transaction with additional retry-friendly options
                response = await self.client.send_transaction(
                    tx_copy,
                    opts=TxOpts(
                        skip_confirmation=opts.skip_confirmation,
                        # Always run preflight to catch blockhash issues early
                        skip_preflight=False,
                        # Let our outer retry loop handle retries
                        max_retries=1,
                    ),
                )

                # Handle response type safely - sometimes response is int
                # instead of object with .value attribute
                signature = str(getattr(response, "value", response))
                logger.info(f"Transaction sent successfully: {signature}")
                return signature

            except Exception as e:
                last_error = e
                error_msg = str(e).lower()

                # Check if it's a blockhash-related error
                if "blockhash not found" in error_msg or "blockhash" in error_msg:
                    logger.warning(
                        f"Blockhash error on attempt {attempt + 1}/{max_retries}: {e}"
                    )
                    # For blockhash errors, wait longer and force RPC switch
                    if attempt < max_retries - 1:
                        self._current_rpc_index += 1  # Force RPC failover
                        await asyncio.sleep(
                            3.0 + (attempt * 2.0)
                        )  # Longer waits for blockhash issues
                else:
                    logger.warning(
                        f"Transaction attempt {attempt + 1}/{max_retries} failed: {e}"
                    )
                    if attempt < max_retries - 1:
                        await asyncio.sleep(1.0 * (attempt + 1))  # Exponential backoff

        # All retries failed
        raise TransactionError(
            f"Transaction failed after {max_retries} attempts: {last_error}",
            signature=None,
            logs=None,
        )

    async def simulate_transaction(
        self, transaction: Transaction, signers: List[Keypair], max_retries: int = 3
    ) -> Dict[str, Any]:
        """
        Simulate transaction execution with retry logic for blockhash issues.

        Args:
            transaction: Transaction to simulate
            signers: List of keypairs to sign the transaction
            max_retries: Maximum number of retry attempts

        Returns:
            Simulation result

        Raises:
            TransactionError: If simulation fails after retries
        """
        last_error = None

        for attempt in range(max_retries):
            try:
                # Get fresh blockhash for each attempt using robust method
                fresh_blockhash = await self._get_fresh_blockhash(max_attempts=2)

                # Wait longer for blockhash propagation on retries
                if attempt > 0:
                    await asyncio.sleep(
                        1.5 + (attempt * 1.0)
                    )  # Start at 1.5s, increase by 1s

                # Create a copy of the transaction to avoid conflicts
                tx_copy = Transaction.from_bytes(bytes(transaction))

                # Sign transaction with fresh blockhash
                tx_copy.sign(signers, fresh_blockhash)

                # Simulate
                response = await self.client.simulate_transaction(
                    tx_copy, commitment=self.commitment
                )

                # Handle response type safely
                if hasattr(response, "value") and response.value:
                    return {
                        "logs": response.value.logs,
                        "err": response.value.err,
                        "accounts": response.value.accounts,
                        "units_consumed": response.value.units_consumed,
                    }
                else:
                    raise TransactionError(
                        f"Invalid simulation response: {type(response)}"
                    )

            except Exception as e:
                last_error = e
                error_msg = str(e).lower()

                if "blockhash" in error_msg:
                    logger.warning(
                        f"Blockhash error in simulation attempt "
                        f"{attempt + 1}/{max_retries}: {e}"
                    )
                    # Force RPC failover on blockhash errors
                    if attempt < max_retries - 1:
                        self._current_rpc_index += 1
                        await asyncio.sleep(1.0 + (attempt * 0.5))
                else:
                    logger.warning(
                        f"Simulation attempt {attempt + 1}/{max_retries} failed: {e}"
                    )
                    if attempt < max_retries - 1:
                        await asyncio.sleep(0.5 * (attempt + 1))

        # All attempts failed
        raise TransactionError(
            f"Transaction simulation failed after {max_retries} attempts: {last_error}"
        )

    async def get_balance(self, pubkey: PublicKey) -> int:
        """
        Get SOL balance for a public key.

        Args:
            pubkey: Public key to check balance for

        Returns:
            Balance in lamports

        Raises:
            ConnectionError: If RPC request fails
        """
        try:
            response = await self.client.get_balance(pubkey, commitment=self.commitment)
            # Handle response type safely - cast response to int directly
            return int(getattr(response, "value", 0))  # type: ignore[arg-type]
        except Exception as e:
            raise ConnectionError(f"Failed to get balance: {e}")

    async def get_token_account_balance(
        self, token_account: PublicKey
    ) -> Dict[str, Any]:
        """
        Get SPL token account balance.

        Args:
            token_account: Token account public key

        Returns:
            Token balance information

        Raises:
            ConnectionError: If RPC request fails
        """
        try:
            response = await self.client.get_token_account_balance(
                token_account, commitment=self.commitment
            )
            if hasattr(response, "value") and response.value:
                return {
                    "amount": response.value.amount,
                    "decimals": response.value.decimals,
                    "ui_amount": response.value.ui_amount,
                    "ui_amount_string": response.value.ui_amount_string,
                }
            else:
                raise ConnectionError(
                    f"Invalid token balance response: {type(response)}"
                )
        except Exception as e:
            raise ConnectionError(f"Failed to get token balance: {e}")

    def derive_agent_pda(self, agent_id: str, owner: PublicKey) -> PublicKey:
        """
        Derive Program Derived Address for agent registry entry.

        Args:
            agent_id: Unique agent identifier
            owner: Agent owner's public key

        Returns:
            Derived PDA public key
        """
        pda_seeds = [
            b"agent_registry",
            agent_id.encode("utf-8"),
            bytes(owner),
        ]
        pda, _ = PublicKey.find_program_address(pda_seeds, self.agent_program_id)
        return pda

    def derive_mcp_server_pda(self, server_id: str, owner: PublicKey) -> PublicKey:
        """
        Derive Program Derived Address for MCP server registry entry.

        Args:
            server_id: Unique server identifier
            owner: Server owner's public key

        Returns:
            Derived PDA public key
        """
        pda_seeds = [
            b"mcp_server_registry",
            server_id.encode("utf-8"),
            bytes(owner),
        ]
        pda, _ = PublicKey.find_program_address(pda_seeds, self.mcp_program_id)
        return pda

    def build_register_agent_instruction(
        self,
        agent_id: str,
        name: str,
        description: str,
        owner: PublicKey,
        metadata_uri: Optional[str] = None,
    ) -> Instruction:
        """
        Build register agent instruction.

        Args:
            agent_id: Unique agent identifier
            name: Agent name
            description: Agent description
            owner: Agent owner's public key
            metadata_uri: Optional metadata URI

        Returns:
            Register agent instruction
        """
        # Derive PDA for agent registry entry
        agent_pda = self.derive_agent_pda(agent_id, owner)

        # Build instruction data
        instruction_data = self._encode_register_agent_data(
            agent_id, name, description, metadata_uri
        )

        # Create account metas
        accounts = [
            AccountMeta(pubkey=agent_pda, is_signer=False, is_writable=True),
            AccountMeta(pubkey=owner, is_signer=True, is_writable=True),
            AccountMeta(pubkey=SYS_PROGRAM_ID, is_signer=False, is_writable=False),
        ]

        return Instruction(
            program_id=self.agent_program_id,
            accounts=accounts,
            data=instruction_data,
        )

    def build_update_agent_instruction(
        self,
        agent_id: str,
        owner: PublicKey,
        name: Optional[str] = None,
        description: Optional[str] = None,
        status: Optional[int] = None,
    ) -> Instruction:
        """
        Build update agent instruction.

        Args:
            agent_id: Unique agent identifier
            owner: Agent owner's public key
            name: Optional new name
            description: Optional new description
            status: Optional new status

        Returns:
            Update agent instruction
        """
        # Derive PDA for agent registry entry
        agent_pda = self.derive_agent_pda(agent_id, owner)

        # Build instruction data
        instruction_data = self._encode_update_agent_data(name, description, status)

        # Create account metas
        accounts = [
            AccountMeta(pubkey=agent_pda, is_signer=False, is_writable=True),
            AccountMeta(pubkey=owner, is_signer=True, is_writable=False),
        ]

        return Instruction(
            program_id=self.agent_program_id,
            accounts=accounts,
            data=instruction_data,
        )

    def build_deregister_agent_instruction(
        self, agent_id: str, owner: PublicKey
    ) -> Instruction:
        """
        Build deregister agent instruction.

        Args:
            agent_id: Unique agent identifier
            owner: Agent owner's public key

        Returns:
            Deregister agent instruction
        """
        # Derive PDA for agent registry entry
        agent_pda = self.derive_agent_pda(agent_id, owner)

        # Build instruction data (deregister has no args)
        instruction_data = self._encode_deregister_agent_data()

        # Create account metas
        accounts = [
            AccountMeta(pubkey=agent_pda, is_signer=False, is_writable=True),
            AccountMeta(pubkey=owner, is_signer=True, is_writable=False),
        ]

        return Instruction(
            program_id=self.agent_program_id,
            accounts=accounts,
            data=instruction_data,
        )

    def build_register_mcp_server_instruction(
        self,
        server_id: str,
        name: str,
        endpoint_url: str,
        owner: PublicKey,
        description: Optional[str] = None,
    ) -> Instruction:
        """
        Build register MCP server instruction.

        Args:
            server_id: Unique server identifier
            name: Server name
            endpoint_url: Server endpoint URL
            owner: Server owner's public key
            description: Optional server description

        Returns:
            Register MCP server instruction
        """
        # Derive PDA for MCP server registry entry
        server_pda = self.derive_mcp_server_pda(server_id, owner)

        # Build instruction data
        instruction_data = self._encode_register_mcp_server_data(
            server_id, name, endpoint_url, description
        )

        # Create account metas
        accounts = [
            AccountMeta(pubkey=server_pda, is_signer=False, is_writable=True),
            AccountMeta(pubkey=owner, is_signer=True, is_writable=True),
            AccountMeta(pubkey=SYS_PROGRAM_ID, is_signer=False, is_writable=False),
        ]

        return Instruction(
            program_id=self.mcp_program_id,
            accounts=accounts,
            data=instruction_data,
        )

    def _encode_register_agent_data(
        self,
        agent_id: str,
        name: str,
        description: str,
        metadata_uri: Optional[str] = None,
    ) -> bytes:
        """Encode register agent instruction data."""
        # Instruction discriminant for registerAgent (index 0)
        data = struct.pack("<B", 0)

        # Encode agent_id
        agent_id_bytes = agent_id.encode("utf-8")
        data += struct.pack("<I", len(agent_id_bytes)) + agent_id_bytes

        # Encode name
        name_bytes = name.encode("utf-8")
        data += struct.pack("<I", len(name_bytes)) + name_bytes

        # Encode description
        description_bytes = description.encode("utf-8")
        data += struct.pack("<I", len(description_bytes)) + description_bytes

        # Encode optional metadata_uri
        if metadata_uri:
            data += struct.pack("<B", 1)  # Some
            metadata_bytes = metadata_uri.encode("utf-8")
            data += struct.pack("<I", len(metadata_bytes)) + metadata_bytes
        else:
            data += struct.pack("<B", 0)  # None

        return data

    def _encode_update_agent_data(
        self,
        name: Optional[str] = None,
        description: Optional[str] = None,
        status: Optional[int] = None,
    ) -> bytes:
        """Encode update agent instruction data."""
        # Instruction discriminant for updateAgent (index 1)
        data = struct.pack("<B", 1)

        # Encode optional name
        if name:
            data += struct.pack("<B", 1)  # Some
            name_bytes = name.encode("utf-8")
            data += struct.pack("<I", len(name_bytes)) + name_bytes
        else:
            data += struct.pack("<B", 0)  # None

        # Encode optional description
        if description:
            data += struct.pack("<B", 1)  # Some
            description_bytes = description.encode("utf-8")
            data += struct.pack("<I", len(description_bytes)) + description_bytes
        else:
            data += struct.pack("<B", 0)  # None

        # Encode optional status
        if status is not None:
            data += struct.pack("<B", 1)  # Some
            data += struct.pack("<B", status)
        else:
            data += struct.pack("<B", 0)  # None

        return data

    def _encode_deregister_agent_data(self) -> bytes:
        """Encode deregister agent instruction data."""
        # Instruction discriminant for deregisterAgent (index 2)
        return struct.pack("<B", 2)

    def _encode_register_mcp_server_data(
        self,
        server_id: str,
        name: str,
        endpoint_url: str,
        description: Optional[str] = None,
    ) -> bytes:
        """Encode register MCP server instruction data."""
        # Instruction discriminant for registerServer (index 0)
        data = struct.pack("<B", 0)

        # Encode server_id
        server_id_bytes = server_id.encode("utf-8")
        data += struct.pack("<I", len(server_id_bytes)) + server_id_bytes

        # Encode name
        name_bytes = name.encode("utf-8")
        data += struct.pack("<I", len(name_bytes)) + name_bytes

        # Encode endpoint_url
        endpoint_bytes = endpoint_url.encode("utf-8")
        data += struct.pack("<I", len(endpoint_bytes)) + endpoint_bytes

        # Encode optional description
        if description:
            data += struct.pack("<B", 1)  # Some
            description_bytes = description.encode("utf-8")
            data += struct.pack("<I", len(description_bytes)) + description_bytes
        else:
            data += struct.pack("<B", 0)  # None

        return data

    def build_deregister_mcp_server_instruction(
        self, server_id: str, owner: PublicKey
    ) -> Instruction:
        """
        Build deregister MCP server instruction.

        Args:
            server_id: Unique server identifier
            owner: Server owner's public key

        Returns:
            Deregister MCP server instruction
        """
        # Derive PDA for MCP server registry entry
        server_pda = self.derive_mcp_server_pda(server_id, owner)

        # Build instruction data (deregister has no args)
        instruction_data = self._encode_deregister_mcp_server_data()

        # Create account metas
        accounts = [
            AccountMeta(pubkey=server_pda, is_signer=False, is_writable=True),
            AccountMeta(pubkey=owner, is_signer=True, is_writable=False),
        ]

        return Instruction(
            program_id=self.mcp_program_id,
            accounts=accounts,
            data=instruction_data,
        )

    def _encode_deregister_mcp_server_data(self) -> bytes:
        """Encode deregister MCP server instruction data."""
        # Instruction discriminant for deregisterServer (index 2)
        return struct.pack("<B", 2)

    async def deserialize_agent_account(self, account_data: bytes) -> Dict[str, Any]:
        """
        Deserialize agent registry account data.

        Args:
            account_data: Raw account data

        Returns:
            Deserialized agent data
        """
        try:
            # Skip discriminator (first 8 bytes)
            data = account_data[8:]
            offset = 0

            # Read agent_id
            agent_id_len = struct.unpack("<I", data[offset : offset + 4])[0]
            offset += 4
            agent_id = data[offset : offset + agent_id_len].decode("utf-8")
            offset += agent_id_len

            # Read name
            name_len = struct.unpack("<I", data[offset : offset + 4])[0]
            offset += 4
            name = data[offset : offset + name_len].decode("utf-8")
            offset += name_len

            # Read description
            description_len = struct.unpack("<I", data[offset : offset + 4])[0]
            offset += 4
            description = data[offset : offset + description_len].decode("utf-8")
            offset += description_len

            # Read owner (32 bytes)
            owner = PublicKey.from_bytes(data[offset : offset + 32])
            offset += 32

            # Read status
            status = struct.unpack("<B", data[offset : offset + 1])[0]
            offset += 1

            # Read optional metadata_uri
            has_metadata = struct.unpack("<B", data[offset : offset + 1])[0] == 1
            offset += 1
            metadata_uri = None
            if has_metadata:
                metadata_len = struct.unpack("<I", data[offset : offset + 4])[0]
                offset += 4
                metadata_uri = data[offset : offset + metadata_len].decode("utf-8")
                offset += metadata_len

            # Read timestamps
            created_at = struct.unpack("<q", data[offset : offset + 8])[0]
            offset += 8
            updated_at = struct.unpack("<q", data[offset : offset + 8])[0]

            return {
                "agent_id": agent_id,
                "name": name,
                "description": description,
                "owner": str(owner),
                "status": status,
                "metadata_uri": metadata_uri,
                "created_at": created_at,
                "updated_at": updated_at,
            }

        except Exception as e:
            raise TransactionError(f"Failed to deserialize agent account: {e}")

    async def deserialize_mcp_server_account(
        self, account_data: bytes
    ) -> Dict[str, Any]:
        """
        Deserialize MCP server registry account data.

        Args:
            account_data: Raw account data

        Returns:
            Deserialized server data
        """
        try:
            # Skip discriminator (first 8 bytes)
            data = account_data[8:]
            offset = 0

            # Read server_id
            server_id_len = struct.unpack("<I", data[offset : offset + 4])[0]
            offset += 4
            server_id = data[offset : offset + server_id_len].decode("utf-8")
            offset += server_id_len

            # Read name
            name_len = struct.unpack("<I", data[offset : offset + 4])[0]
            offset += 4
            name = data[offset : offset + name_len].decode("utf-8")
            offset += name_len

            # Read endpoint_url
            endpoint_len = struct.unpack("<I", data[offset : offset + 4])[0]
            offset += 4
            endpoint_url = data[offset : offset + endpoint_len].decode("utf-8")
            offset += endpoint_len

            # Read owner (32 bytes)
            owner = PublicKey.from_bytes(data[offset : offset + 32])
            offset += 32

            # Read status
            status = struct.unpack("<B", data[offset : offset + 1])[0]
            offset += 1

            # Read timestamps
            created_at = struct.unpack("<q", data[offset : offset + 8])[0]
            offset += 8
            updated_at = struct.unpack("<q", data[offset : offset + 8])[0]

            return {
                "server_id": server_id,
                "name": name,
                "endpoint_url": endpoint_url,
                "owner": str(owner),
                "status": status,
                "created_at": created_at,
                "updated_at": updated_at,
            }

        except Exception as e:
            raise TransactionError(f"Failed to deserialize MCP server account: {e}")
