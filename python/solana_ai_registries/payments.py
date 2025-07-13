"""
Payment flow implementations for Solana AI Registries.

Provides async payment functionality including prepay escrow, pay-as-you-go,
and streaming payments using A2AMPL tokens.
"""

import asyncio
import logging
from decimal import Decimal
from typing import Any, AsyncGenerator, Dict, List, Optional

from solders.keypair import Keypair
from solders.pubkey import Pubkey as PublicKey
from solders.transaction import Transaction

from .client import SolanaAIRegistriesClient
from .constants import (
    A2AMPL_DECIMALS,
    A2AMPL_TOKEN_MINT_DEVNET,
    A2AMPL_TOKEN_MINT_MAINNET,
    a2ampl_to_base_units,
    base_units_to_a2ampl,
)
from .exceptions import (
    InsufficientFundsError,
    InvalidInputError,
    PaymentError,
    SolanaAIRegistriesError,
)
from .types import PaymentType

logger = logging.getLogger(__name__)


class PaymentManager:
    """Manages all async payment flows for AI services."""

    def __init__(
        self,
        client: SolanaAIRegistriesClient,
        use_mainnet: bool = False,
    ) -> None:
        """
        Initialize payment manager with client.

        Args:
            client: Low-level Solana client instance
            use_mainnet: Use mainnet token mint (default: devnet)
        """
        self.client = client
        self.token_mint = PublicKey.from_string(
            A2AMPL_TOKEN_MINT_MAINNET if use_mainnet else A2AMPL_TOKEN_MINT_DEVNET
        )
        self._active_streams: Dict[str, asyncio.Task] = {}

    async def create_prepay_escrow(
        self,
        service_provider: PublicKey,
        amount: Decimal,
        payer: Keypair,
        duration_days: Optional[int] = None,
        metadata: Optional[Dict[str, Any]] = None,
    ) -> str:
        """
        Create prepaid escrow for service usage.

        Args:
            service_provider: Service provider's public key
            amount: Prepay amount in A2AMPL tokens
            payer: Payer keypair for signing
            duration_days: Optional escrow duration in days
            metadata: Additional escrow metadata

        Returns:
            Transaction signature

        Raises:
            InsufficientFundsError: If payer has insufficient balance
            PaymentError: If escrow creation fails
        """
        if amount <= 0:
            raise InvalidInputError("Prepay amount must be positive")

        try:
            # Convert to base units
            base_amount = a2ampl_to_base_units(amount)

            # Check payer balance
            await self._validate_balance(payer.public_key, base_amount)

            # Derive escrow PDA
            escrow_pda = self._derive_escrow_pda(payer.public_key, service_provider)

            # Create transaction
            transaction = Transaction()

            # TODO: Add proper instruction for escrow creation
            # This would use the actual payment program instruction
            logger.info(
                f"Creating prepay escrow: payer={payer.public_key}, "
                f"provider={service_provider}, amount={amount} A2AMPL"
            )

            # Send transaction
            signature = await self.client.send_transaction(transaction, [payer])

            logger.info(f"Prepay escrow created successfully: {signature}")
            return signature

        except InsufficientFundsError:
            raise
        except Exception as e:
            raise PaymentError(f"Failed to create prepay escrow: {e}")

    async def pay_per_usage(
        self,
        service_provider: PublicKey,
        usage_fee: Decimal,
        payer: Keypair,
        service_id: Optional[str] = None,
        usage_data: Optional[Dict[str, Any]] = None,
    ) -> str:
        """
        Execute pay-as-you-go payment.

        Args:
            service_provider: Service provider's public key
            usage_fee: Fee for this usage in A2AMPL tokens
            payer: Payer keypair for signing
            service_id: Optional service identifier
            usage_data: Optional usage metadata

        Returns:
            Transaction signature

        Raises:
            InsufficientFundsError: If payer has insufficient balance
            PaymentError: If payment fails
        """
        if usage_fee <= 0:
            raise InvalidInputError("Usage fee must be positive")

        try:
            # Convert to base units
            base_fee = a2ampl_to_base_units(usage_fee)

            # Check payer balance
            await self._validate_balance(payer.public_key, base_fee)

            # Create transaction
            transaction = Transaction()

            # TODO: Add proper instruction for pay-per-usage
            # This would use the actual payment program instruction
            logger.info(
                f"Processing pay-per-usage: payer={payer.public_key}, "
                f"provider={service_provider}, fee={usage_fee} A2AMPL"
            )

            # Send transaction
            signature = await self.client.send_transaction(transaction, [payer])

            logger.info(f"Pay-per-usage completed successfully: {signature}")
            return signature

        except InsufficientFundsError:
            raise
        except Exception as e:
            raise PaymentError(f"Failed to process pay-per-usage: {e}")

    async def create_payment_stream(
        self,
        service_provider: PublicKey,
        rate_per_second: Decimal,
        payer: Keypair,
        duration_seconds: int,
        start_immediately: bool = True,
    ) -> AsyncGenerator[str, None]:
        """
        Create streaming payment with asyncio background tasks.

        Args:
            service_provider: Service provider's public key
            rate_per_second: Payment rate in A2AMPL tokens per second
            payer: Payer keypair for signing
            duration_seconds: Total streaming duration
            start_immediately: Start streaming immediately

        Yields:
            Transaction signatures for each payment

        Raises:
            InvalidInputError: If parameters are invalid
            PaymentError: If streaming setup fails
        """
        if rate_per_second <= 0:
            raise InvalidInputError("Rate per second must be positive")
        if duration_seconds <= 0:
            raise InvalidInputError("Duration must be positive")

        stream_id = f"stream_{payer.public_key}_{service_provider}_{asyncio.get_event_loop().time()}"

        try:
            # Calculate total amount and validate balance
            total_amount = rate_per_second * duration_seconds
            base_amount = a2ampl_to_base_units(total_amount)
            await self._validate_balance(payer.public_key, base_amount)

            logger.info(
                f"Starting payment stream {stream_id}: "
                f"rate={rate_per_second}/sec, duration={duration_seconds}s"
            )

            if start_immediately:
                async for signature in self._execute_payment_stream(
                    stream_id,
                    service_provider,
                    rate_per_second,
                    payer,
                    duration_seconds,
                ):
                    yield signature

        except Exception as e:
            raise PaymentError(f"Failed to create payment stream: {e}")

    async def _execute_payment_stream(
        self,
        stream_id: str,
        service_provider: PublicKey,
        rate_per_second: Decimal,
        payer: Keypair,
        duration_seconds: int,
        payment_interval: int = 10,  # seconds
    ) -> AsyncGenerator[str, None]:
        """Execute the actual payment streaming logic."""
        try:
            start_time = asyncio.get_event_loop().time()
            end_time = start_time + duration_seconds
            next_payment_time = start_time + payment_interval

            while asyncio.get_event_loop().time() < end_time:
                current_time = asyncio.get_event_loop().time()
                if current_time >= next_payment_time:
                    # Calculate payment amount for this interval
                    payment_amount = rate_per_second * payment_interval

                    # Execute payment
                    signature = await self.pay_per_usage(
                        service_provider, payment_amount, payer
                    )

                    logger.debug(
                        f"Stream payment {stream_id}: {payment_amount} A2AMPL -> {signature}"
                    )
                    yield signature

                    next_payment_time += payment_interval

                # Sleep for a short interval
                await asyncio.sleep(0.1)

            logger.info(f"Payment stream {stream_id} completed")

        except Exception as e:
            logger.error(f"Payment stream {stream_id} failed: {e}")
            raise PaymentError(f"Payment stream execution failed: {e}")

    async def get_escrow_balance(
        self, payer: PublicKey, service_provider: PublicKey
    ) -> Decimal:
        """
        Get current escrow balance for a payer-provider pair.

        Args:
            payer: Payer's public key
            service_provider: Service provider's public key

        Returns:
            Escrow balance in A2AMPL tokens

        Raises:
            PaymentError: If balance retrieval fails
        """
        try:
            escrow_pda = self._derive_escrow_pda(payer, service_provider)
            account_info = await self.client.get_account_info(escrow_pda)

            if account_info is None:
                return Decimal("0")

            # TODO: Deserialize escrow account data to get balance
            # For now, return mock balance
            return Decimal("100.0")

        except Exception as e:
            raise PaymentError(f"Failed to get escrow balance: {e}")

    async def withdraw_from_escrow(
        self,
        service_provider: PublicKey,
        amount: Decimal,
        payer: Keypair,
    ) -> str:
        """
        Withdraw funds from escrow (by payer).

        Args:
            service_provider: Service provider's public key
            amount: Amount to withdraw in A2AMPL tokens
            payer: Payer keypair for signing

        Returns:
            Transaction signature

        Raises:
            InsufficientFundsError: If escrow has insufficient funds
            PaymentError: If withdrawal fails
        """
        if amount <= 0:
            raise InvalidInputError("Withdrawal amount must be positive")

        try:
            # Check escrow balance
            escrow_balance = await self.get_escrow_balance(
                payer.public_key, service_provider
            )
            if amount > escrow_balance:
                raise InsufficientFundsError(
                    required=a2ampl_to_base_units(amount),
                    available=a2ampl_to_base_units(escrow_balance),
                    token_mint=str(self.token_mint),
                )

            # Create transaction
            transaction = Transaction()

            # TODO: Add proper instruction for escrow withdrawal
            logger.info(
                f"Withdrawing from escrow: amount={amount} A2AMPL, "
                f"payer={payer.public_key}, provider={service_provider}"
            )

            # Send transaction
            signature = await self.client.send_transaction(transaction, [payer])

            logger.info(f"Escrow withdrawal completed: {signature}")
            return signature

        except (InsufficientFundsError, InvalidInputError):
            raise
        except Exception as e:
            raise PaymentError(f"Failed to withdraw from escrow: {e}")

    async def get_payment_history(
        self,
        payer: PublicKey,
        service_provider: Optional[PublicKey] = None,
        payment_type: Optional[PaymentType] = None,
        limit: int = 100,
    ) -> List[Dict[str, Any]]:
        """
        Get payment history for a payer.

        Args:
            payer: Payer's public key
            service_provider: Optional provider filter
            payment_type: Optional payment type filter
            limit: Maximum number of records

        Returns:
            List of payment records
        """
        try:
            # TODO: Implement proper transaction history fetching
            logger.info(
                f"Fetching payment history for {payer} "
                f"(provider={service_provider}, type={payment_type})"
            )

            # Mock implementation
            return []

        except Exception as e:
            logger.error(f"Failed to get payment history: {e}")
            return []

    def _derive_escrow_pda(
        self, payer: PublicKey, service_provider: PublicKey
    ) -> PublicKey:
        """Derive PDA for escrow account."""
        # TODO: Use actual program ID for escrow
        # For now, use agent registry program ID as placeholder
        pda_seeds = [
            b"escrow",
            bytes(payer),
            bytes(service_provider),
        ]
        pda, _ = PublicKey.find_program_address(pda_seeds, self.client.agent_program_id)
        return pda

    async def _validate_balance(self, payer: PublicKey, required_amount: int) -> None:
        """
        Validate that payer has sufficient token balance.

        Args:
            payer: Payer's public key
            required_amount: Required amount in base units

        Raises:
            InsufficientFundsError: If balance is insufficient
        """
        try:
            # TODO: Get actual token account and balance
            # For now, mock validation
            mock_balance = a2ampl_to_base_units(Decimal("1000"))  # Mock 1000 A2AMPL

            if required_amount > mock_balance:
                raise InsufficientFundsError(
                    required=required_amount,
                    available=mock_balance,
                    token_mint=str(self.token_mint),
                )

        except InsufficientFundsError:
            raise
        except Exception as e:
            raise PaymentError(f"Failed to validate balance: {e}")

    async def close(self) -> None:
        """Cancel all active payment streams and cleanup."""
        for stream_id, task in self._active_streams.items():
            if not task.done():
                task.cancel()
                logger.info(f"Cancelled payment stream: {stream_id}")

        self._active_streams.clear()

    async def __aenter__(self):
        """Async context manager entry."""
        return self

    async def __aexit__(self, exc_type, exc_val, exc_tb):
        """Async context manager exit."""
        await self.close()
