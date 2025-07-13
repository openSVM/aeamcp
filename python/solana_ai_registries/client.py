"""
Low-level client for Solana AI Registries programs.

Provides async RPC client functionality and transaction building utilities
for interacting with on-chain Agent Registry and MCP Server Registry programs.
"""

import asyncio
import logging
from typing import Any, Dict, List, Optional

from solana.rpc.async_api import AsyncClient
from solana.rpc.commitment import Commitment
from solana.rpc.types import TxOpts
from solders.keypair import Keypair
from solders.pubkey import Pubkey as PublicKey
from solders.transaction import Transaction

from .constants import (
    AGENT_REGISTRY_PROGRAM_ID,
    DEFAULT_DEVNET_RPC,
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
    ) -> None:
        """
        Initialize client with RPC endpoint.

        Args:
            rpc_url: Solana RPC endpoint URL
            commitment: Transaction commitment level
        """
        self.rpc_url = rpc_url
        self.commitment = commitment or Commitment("confirmed")
        self._client: Optional[AsyncClient] = None
        self.agent_program_id = PublicKey.from_string(AGENT_REGISTRY_PROGRAM_ID)
        self.mcp_program_id = PublicKey.from_string(MCP_SERVER_REGISTRY_PROGRAM_ID)

    @property
    def client(self) -> AsyncClient:
        """Get or create async RPC client."""
        if self._client is None:
            self._client = AsyncClient(self.rpc_url, commitment=self.commitment)
        return self._client

    async def close(self) -> None:
        """Close the RPC client connection."""
        if self._client:
            await self._client.close()
            self._client = None

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
            if response.value is None:
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
        max_retries: int = 3,
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
                # Get recent blockhash
                blockhash_resp = await self.client.get_latest_blockhash(
                    commitment=self.commitment
                )
                # TODO: Update transaction with proper blockhash handling
                # transaction.recent_blockhash = blockhash_resp.value.blockhash
                # type: ignore[attr-defined]

                # Sign transaction
                transaction.sign(
                    signers, blockhash_resp.value.blockhash
                )  # type: ignore[arg-type]

                # Send transaction
                response = await self.client.send_transaction(transaction, opts=opts)

                signature = str(response.value)
                logger.info(f"Transaction sent successfully: {signature}")
                return signature

            except Exception as e:
                last_error = e
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
        self, transaction: Transaction, signers: List[Keypair]
    ) -> Dict[str, Any]:
        """
        Simulate transaction execution.

        Args:
            transaction: Transaction to simulate
            signers: List of keypairs to sign the transaction

        Returns:
            Simulation result

        Raises:
            TransactionError: If simulation fails
        """
        try:
            # Get recent blockhash and sign transaction
            blockhash_resp = await self.client.get_latest_blockhash()
            # TODO: Update transaction with proper blockhash handling
            # transaction.recent_blockhash = blockhash_resp.value.blockhash  # type: ignore[attr-defined]  # noqa: E501
            transaction.sign(
                signers, blockhash_resp.value.blockhash
            )  # type: ignore[arg-type]

            # Simulate
            response = await self.client.simulate_transaction(
                transaction, commitment=self.commitment
            )

            return {
                "logs": response.value.logs,
                "err": response.value.err,
                "accounts": response.value.accounts,
                "units_consumed": response.value.units_consumed,
            }

        except Exception as e:
            raise TransactionError(f"Transaction simulation failed: {e}")

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
            return response.value
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
            return {
                "amount": response.value.amount,
                "decimals": response.value.decimals,
                "ui_amount": response.value.ui_amount,
                "ui_amount_string": response.value.ui_amount_string,
            }
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
