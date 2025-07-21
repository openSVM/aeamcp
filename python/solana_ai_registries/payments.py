"""
Payment flow implementations for Solana AI Registries.

Provides async payment functionality including prepay escrow, pay-as-you-go,
and streaming payments using A2AMPL tokens.
"""

import asyncio
import logging
from decimal import Decimal
from typing import Any, AsyncGenerator, Dict, List, Optional

from solders.instruction import AccountMeta, Instruction
from solders.keypair import Keypair
from solders.pubkey import Pubkey as PublicKey
from solders.transaction import Transaction
from spl.token.constants import TOKEN_PROGRAM_ID

from .client import SolanaAIRegistriesClient
from .constants import (
    A2AMPL_TOKEN_MINT_DEVNET,
    A2AMPL_TOKEN_MINT_MAINNET,
    a2ampl_to_base_units,
    base_units_to_a2ampl,
)
from .exceptions import (
    InsufficientFundsError,
    InvalidInputError,
    PaymentError,
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
            raise InvalidInputError("amount", amount, "Prepay amount must be positive")

        try:
            # Convert to base units
            base_amount = a2ampl_to_base_units(float(amount))

            # Check payer balance
            await self._validate_balance(payer.pubkey(), base_amount)

            # Get or create associated token accounts
            payer_token_account = await self._get_associated_token_account(
                payer.pubkey()
            )
            provider_token_account = await self._get_associated_token_account(
                service_provider
            )

            # Create SPL token transfer instruction
            transfer_instruction = self._create_spl_transfer_instruction(
                source=payer_token_account,
                destination=provider_token_account,
                owner=payer.pubkey(),
                amount=base_amount,
            )

            # Create transaction
            transaction = Transaction.new_with_payer(
                [transfer_instruction], payer.pubkey()
            )

            logger.info(
                f"Creating prepay escrow: payer={payer.pubkey()}, "
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
            raise InvalidInputError(
                "usage_fee", usage_fee, "Usage fee must be positive"
            )

        try:
            # Convert to base units
            base_fee = a2ampl_to_base_units(float(usage_fee))

            # Check payer balance
            await self._validate_balance(payer.pubkey(), base_fee)

            # Get or create associated token accounts
            payer_token_account = await self._get_associated_token_account(
                payer.pubkey()
            )
            provider_token_account = await self._get_associated_token_account(
                service_provider
            )

            # Create SPL token transfer instruction
            transfer_instruction = self._create_spl_transfer_instruction(
                source=payer_token_account,
                destination=provider_token_account,
                owner=payer.pubkey(),
                amount=base_fee,
            )

            # Create transaction
            transaction = Transaction.new_with_payer(
                [transfer_instruction], payer.pubkey()
            )

            logger.info(
                f"Processing pay-per-usage: payer={payer.pubkey()}, "
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
            raise InvalidInputError(
                "rate_per_second", rate_per_second, "Rate per second must be positive"
            )
        if duration_seconds <= 0:
            raise InvalidInputError(
                "duration_seconds", duration_seconds, "Duration must be positive"
            )

        stream_id = (
            f"stream_{payer.pubkey()}_{service_provider}_"
            f"{asyncio.get_event_loop().time()}"
        )

        try:
            # Calculate total amount and validate balance
            total_amount = rate_per_second * duration_seconds
            base_amount = a2ampl_to_base_units(float(total_amount))
            await self._validate_balance(payer.pubkey(), base_amount)

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
                        f"Stream payment {stream_id}: {payment_amount} A2AMPL "
                        f"-> {signature}"
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
            # Get payer's token account
            payer_token_account = await self._get_associated_token_account(payer)

            # Get token balance
            balance_info = await self.client.get_token_account_balance(
                payer_token_account
            )
            balance_base_units = int(balance_info["amount"])

            # Convert to A2AMPL tokens
            balance_a2ampl = base_units_to_a2ampl(balance_base_units)
            return Decimal(str(balance_a2ampl))

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
            raise InvalidInputError(
                "amount", amount, "Withdrawal amount must be positive"
            )

        try:
            # Check escrow balance
            escrow_balance = await self.get_escrow_balance(
                payer.pubkey(), service_provider
            )
            if amount > escrow_balance:
                raise InsufficientFundsError(
                    required=a2ampl_to_base_units(float(amount)),
                    available=a2ampl_to_base_units(float(escrow_balance)),
                    token_mint=str(self.token_mint),
                )

            # Get or create associated token accounts
            payer_token_account = await self._get_associated_token_account(
                payer.pubkey()
            )
            provider_token_account = await self._get_associated_token_account(
                service_provider
            )

            # Create SPL token transfer instruction (withdrawal)
            transfer_instruction = self._create_spl_transfer_instruction(
                source=provider_token_account,  # From provider back to payer
                destination=payer_token_account,
                owner=payer.pubkey(),  # Payer authorizes the withdrawal
                amount=a2ampl_to_base_units(float(amount)),
            )

            # Create transaction
            transaction = Transaction.new_with_payer(
                [transfer_instruction], payer.pubkey()
            )

            logger.info(
                f"Withdrawing from escrow: amount={amount} A2AMPL, "
                f"payer={payer.pubkey()}, provider={service_provider}"
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
            # Get token account
            token_account = await self._get_associated_token_account(payer)

            # Get token balance
            balance_info = await self.client.get_token_account_balance(token_account)
            available_balance = int(balance_info["amount"])

            if required_amount > available_balance:
                raise InsufficientFundsError(
                    required=required_amount,
                    available=available_balance,
                    token_mint=str(self.token_mint),
                )

        except InsufficientFundsError:
            raise
        except Exception as e:
            raise PaymentError(f"Failed to validate balance: {e}")

    async def _get_associated_token_account(self, owner: PublicKey) -> PublicKey:
        """
        Get or derive associated token account for owner.

        Args:
            owner: Token account owner

        Returns:
            Associated token account public key
        """
        # Derive associated token account address
        # This is a simplified version - in practice you'd use spl-token utilities
        pda_seeds = [
            bytes(owner),
            bytes(TOKEN_PROGRAM_ID),
            bytes(self.token_mint),
        ]

        # Using a placeholder derivation - in real implementation would use
        # proper ATA derivation
        ata_pda, _ = PublicKey.find_program_address(
            pda_seeds[:2], TOKEN_PROGRAM_ID  # Simplified
        )
        return ata_pda

    def _create_spl_transfer_instruction(
        self,
        source: PublicKey,
        destination: PublicKey,
        owner: PublicKey,
        amount: int,
    ) -> Instruction:
        """
        Create SPL token transfer instruction.

        Args:
            source: Source token account
            destination: Destination token account
            owner: Token account owner
            amount: Amount to transfer in base units

        Returns:
            SPL token transfer instruction
        """
        # SPL Token Transfer instruction
        # Instruction discriminant for Transfer (index 3)
        instruction_data = bytes([3]) + amount.to_bytes(8, "little")

        accounts = [
            AccountMeta(pubkey=source, is_signer=False, is_writable=True),
            AccountMeta(pubkey=destination, is_signer=False, is_writable=True),
            AccountMeta(pubkey=owner, is_signer=True, is_writable=False),
        ]

        return Instruction(
            program_id=TOKEN_PROGRAM_ID,
            accounts=accounts,
            data=instruction_data,
        )

    async def stop_payment_stream(
        self, payer: PublicKey, recipient: PublicKey, service_id: str
    ) -> None:
        """
        Stop an active payment stream.

        Args:
            payer: Payer's public key
            recipient: Recipient's public key
            service_id: Service identifier
        """
        stream_id = f"{payer}:{recipient}:{service_id}"

        if stream_id in self._active_streams:
            task = self._active_streams[stream_id]
            if not task.done():
                task.cancel()
                logger.info(f"Stopped payment stream: {stream_id}")
            del self._active_streams[stream_id]

    def _calculate_stream_cost(
        self, rate_per_second: float, duration_seconds: int
    ) -> float:
        """
        Calculate total cost for a payment stream.

        Args:
            rate_per_second: Payment rate per second
            duration_seconds: Stream duration in seconds

        Returns:
            Total cost in A2AMPL units
        """
        return rate_per_second * duration_seconds

    def _validate_payment_amount(self, amount: float) -> None:
        """
        Validate payment amount is positive.

        Args:
            amount: Payment amount in A2AMPL units

        Raises:
            PaymentError: If amount is invalid
        """
        if amount <= 0:
            raise PaymentError("Amount must be positive")

    def _generate_payment_id(
        self, payer: PublicKey, recipient: PublicKey, service_id: str
    ) -> str:
        """
        Generate unique payment ID.

        Args:
            payer: Payer's public key
            recipient: Recipient's public key
            service_id: Service identifier

        Returns:
            Unique payment ID
        """
        import hashlib
        import time

        data = f"{payer}:{recipient}:{service_id}:{time.time()}"
        return hashlib.sha256(data.encode()).hexdigest()[:16]

    async def close(self) -> None:
        """Cancel all active payment streams and cleanup."""
        for stream_id, task in self._active_streams.items():
            if not task.done():
                task.cancel()
                logger.info(f"Cancelled payment stream: {stream_id}")

        self._active_streams.clear()

    async def __aenter__(self) -> "PaymentManager":
        """Async context manager entry."""
        return self

    async def __aexit__(self, exc_type: Any, exc_val: Any, exc_tb: Any) -> None:
        """Async context manager exit."""
        await self.close()
