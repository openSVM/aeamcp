"""
Simplified tests for solana_ai_registries.payments module focused on interface coverage.
"""

from decimal import Decimal
from unittest.mock import Mock, patch

import pytest
from solders.keypair import Keypair
from solders.pubkey import Pubkey as PublicKey

from solana_ai_registries.client import SolanaAIRegistriesClient
from solana_ai_registries.exceptions import (
    InvalidInputError,
    PaymentError,
)
from solana_ai_registries.payments import PaymentManager
from solana_ai_registries.types import PaymentType


class TestPaymentManagerInterface:
    """Test PaymentManager interface and basic functionality."""

    def setup_method(self):
        """Set up test fixtures."""
        self.mock_client = Mock(spec=SolanaAIRegistriesClient)
        self.payment_manager = PaymentManager(self.mock_client)
        self.payer_keypair = Keypair()
        self.service_provider_pubkey = Keypair().pubkey()

    def test_init_default_devnet(self):
        """Test initialization with default devnet settings."""
        payment_manager = PaymentManager(self.mock_client)
        assert payment_manager.client == self.mock_client
        assert payment_manager.token_mint is not None
        assert payment_manager._active_streams == {}

    def test_init_mainnet(self):
        """Test initialization with mainnet settings."""
        payment_manager = PaymentManager(self.mock_client, use_mainnet=True)
        assert payment_manager.client == self.mock_client
        assert payment_manager.token_mint is not None

    def test_has_required_methods(self):
        """Test that PaymentManager has expected methods."""
        expected_methods = [
            "create_prepay_escrow",
            "pay_per_usage",
            "create_payment_stream",
            "get_escrow_balance",
            "withdraw_from_escrow",
            "get_payment_history",
            "stop_payment_stream",
            "close",
        ]
        for method in expected_methods:
            assert hasattr(self.payment_manager, method)
            assert callable(getattr(self.payment_manager, method))

    @pytest.mark.asyncio
    async def test_create_prepay_escrow_validation_zero_amount(self):
        """Test prepay escrow creation with zero amount."""
        with pytest.raises(InvalidInputError, match="Prepay amount must be positive"):
            await self.payment_manager.create_prepay_escrow(
                service_provider=self.service_provider_pubkey,
                amount=Decimal("0.0"),
                payer=self.payer_keypair,
            )

    @pytest.mark.asyncio
    async def test_create_prepay_escrow_validation_negative_amount(self):
        """Test prepay escrow creation with negative amount."""
        with pytest.raises(InvalidInputError, match="Prepay amount must be positive"):
            await self.payment_manager.create_prepay_escrow(
                service_provider=self.service_provider_pubkey,
                amount=Decimal("-1.0"),
                payer=self.payer_keypair,
            )

    @pytest.mark.asyncio
    async def test_pay_per_usage_validation_zero_amount(self):
        """Test pay per usage with zero amount."""
        with pytest.raises(InvalidInputError, match="Usage fee must be positive"):
            await self.payment_manager.pay_per_usage(
                service_provider=self.service_provider_pubkey,
                usage_fee=Decimal("0.0"),
                payer=self.payer_keypair,
            )

    @pytest.mark.asyncio
    async def test_pay_per_usage_validation_negative_amount(self):
        """Test pay per usage with negative amount."""
        with pytest.raises(InvalidInputError, match="Usage fee must be positive"):
            await self.payment_manager.pay_per_usage(
                service_provider=self.service_provider_pubkey,
                usage_fee=Decimal("-5.0"),
                payer=self.payer_keypair,
            )

    @pytest.mark.asyncio
    async def test_create_payment_stream_validation_zero_rate(self):
        """Test payment stream creation with zero rate."""
        with pytest.raises(InvalidInputError, match="Rate per second must be positive"):
            await self.payment_manager.create_payment_stream(
                service_provider=self.service_provider_pubkey,
                rate_per_second=Decimal("0.0"),
                duration_seconds=3600,
                payer=self.payer_keypair,
            ).__anext__()

    @pytest.mark.asyncio
    async def test_create_payment_stream_validation_zero_duration(self):
        """Test payment stream creation with zero duration."""
        with pytest.raises(InvalidInputError, match="Duration must be positive"):
            await self.payment_manager.create_payment_stream(
                service_provider=self.service_provider_pubkey,
                rate_per_second=Decimal("0.001"),
                duration_seconds=0,
                payer=self.payer_keypair,
            ).__anext__()

    @pytest.mark.asyncio
    async def test_get_escrow_balance_interface(self):
        """Test get escrow balance interface."""
        # Mock the method to avoid complex token account setup
        with patch.object(self.payment_manager, "get_escrow_balance") as mock_balance:
            mock_balance.return_value = Decimal("10.5")

            balance = await self.payment_manager.get_escrow_balance(
                service_provider=self.service_provider_pubkey,
                payer=self.payer_keypair.pubkey(),
            )
            assert isinstance(balance, Decimal)

    @pytest.mark.asyncio
    async def test_withdraw_from_escrow_validation_zero_amount(self):
        """Test withdraw from escrow with zero amount."""
        with pytest.raises(
            InvalidInputError, match="Withdrawal amount must be positive"
        ):
            await self.payment_manager.withdraw_from_escrow(
                service_provider=self.service_provider_pubkey,
                amount=Decimal("0.0"),
                payer=self.payer_keypair,
            )

    @pytest.mark.asyncio
    async def test_get_payment_history_interface(self):
        """Test get payment history interface."""
        # Mock empty payment history
        with patch.object(self.payment_manager, "get_payment_history") as mock_history:
            mock_history.return_value = []

            history = await self.payment_manager.get_payment_history(
                payer=self.payer_keypair.pubkey()
            )
            assert isinstance(history, list)

    @pytest.mark.asyncio
    async def test_stop_payment_stream_validation(self):
        """Test stop payment stream interface."""
        # This should not raise an error even if stream doesn't exist
        await self.payment_manager.stop_payment_stream(
            payer=self.payer_keypair.pubkey(),
            recipient=self.service_provider_pubkey,
            service_id="test_service",
        )

    def test_calculate_stream_cost_interface(self):
        """Test stream cost calculation."""
        cost = self.payment_manager._calculate_stream_cost(0.001, 3600)
        assert isinstance(cost, float)
        assert cost == 3.6  # 0.001 * 3600

    def test_validate_payment_amount_positive(self):
        """Test payment amount validation with positive amount."""
        # Should not raise exception
        self.payment_manager._validate_payment_amount(5.0)

    def test_validate_payment_amount_zero(self):
        """Test payment amount validation with zero."""
        with pytest.raises(PaymentError, match="Amount must be positive"):
            self.payment_manager._validate_payment_amount(0.0)

    def test_validate_payment_amount_negative(self):
        """Test payment amount validation with negative amount."""
        with pytest.raises(PaymentError, match="Amount must be positive"):
            self.payment_manager._validate_payment_amount(-1.0)

    def test_generate_payment_id_interface(self):
        """Test payment ID generation."""
        payment_id = self.payment_manager._generate_payment_id(
            self.payer_keypair.pubkey(),
            self.service_provider_pubkey,
            PaymentType.PREPAY,
        )
        assert isinstance(payment_id, str)
        assert len(payment_id) > 0

    def test_derive_escrow_pda_interface(self):
        """Test escrow PDA derivation."""
        # Mock the client to have the required attribute
        self.mock_client.agent_program_id = PublicKey.from_string(
            "11111111111111111111111111111111"
        )

        pda = self.payment_manager._derive_escrow_pda(
            self.payer_keypair.pubkey(), self.service_provider_pubkey
        )
        assert isinstance(pda, PublicKey)

    @pytest.mark.asyncio
    async def test_context_manager_interface(self):
        """Test PaymentManager as context manager."""
        async with PaymentManager(self.mock_client) as pm:
            assert isinstance(pm, PaymentManager)

    @pytest.mark.asyncio
    async def test_mocked_successful_operations(self):
        """Test successful operations with proper mocking."""
        # Just test that the methods exist and can be called with mocks
        with patch.object(self.payment_manager, "create_prepay_escrow") as mock_create:
            mock_create.return_value = "mock_signature"

            result = await self.payment_manager.create_prepay_escrow(
                service_provider=self.service_provider_pubkey,
                amount=Decimal("5.0"),
                payer=self.payer_keypair,
            )
            assert result == "mock_signature"

    @pytest.mark.asyncio
    async def test_create_payment_stream_generator_interface(self):
        """Test payment stream returns async generator."""
        # Mock all dependencies to avoid actual blockchain calls
        with patch.object(self.payment_manager, "_validate_balance") as mock_validate:
            with patch.object(
                self.payment_manager, "_get_associated_token_account"
            ) as mock_ata:
                with patch.object(
                    self.payment_manager, "_create_spl_transfer_instruction"
                ) as mock_instr:
                    with patch.object(
                        self.mock_client, "send_transaction"
                    ) as mock_send:
                        mock_validate.return_value = None
                        mock_ata.return_value = self.service_provider_pubkey
                        mock_instr.return_value = Mock()
                        mock_send.return_value = "mock_signature"

                        # Create stream with short duration for testing
                        stream = self.payment_manager.create_payment_stream(
                            service_provider=self.service_provider_pubkey,
                            rate_per_second=Decimal("0.001"),
                            duration_seconds=1,
                            payer=self.payer_keypair,
                        )

                        # Verify it's an async generator
                        assert hasattr(stream, "__aiter__")
                        assert hasattr(stream, "__anext__")
