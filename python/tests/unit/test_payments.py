"""Tests for solana_ai_registries.payments module."""

import pytest
from unittest.mock import AsyncMock, Mock, patch
from typing import AsyncGenerator
from decimal import Decimal

from solders.keypair import Keypair
from solders.pubkey import Pubkey
from solders.transaction import Transaction

from solana_ai_registries.payments import PaymentManager
from solana_ai_registries.client import SolanaAIRegistriesClient
from solana_ai_registries.exceptions import (
    InsufficientFundsError,
    PaymentError,
    SolanaAIRegistriesError,
)
from solana_ai_registries.types import PaymentRecord, PaymentStatus, PaymentType


class TestPaymentManager:
    """Test the PaymentManager class."""

    def setup_method(self):
        """Set up test fixtures."""
        self.mock_client = Mock(spec=SolanaAIRegistriesClient)
        self.payment_manager = PaymentManager(self.mock_client)
        
        # Mock keypairs and public keys
        self.mock_payer = Mock(spec=Keypair)
        self.mock_payer_pubkey = Mock(spec=Pubkey)
        self.mock_payer.pubkey.return_value = self.mock_payer_pubkey
        
        self.mock_recipient = Mock(spec=Pubkey)

    def test_init_default_devnet(self):
        """Test initialization with default devnet settings."""
        payment_manager = PaymentManager(self.mock_client)
        
        # Should use devnet token mint by default
        assert payment_manager.client == self.mock_client
        assert payment_manager.token_mint is not None

    def test_init_mainnet(self):
        """Test initialization with mainnet settings."""
        payment_manager = PaymentManager(self.mock_client, use_mainnet=True)
        
        # Should use mainnet token mint
        assert payment_manager.client == self.mock_client
        assert payment_manager.token_mint is not None

    def test_payment_manager_has_required_methods(self):
        """Test that PaymentManager has the expected methods."""
        assert hasattr(self.payment_manager, 'create_prepay_escrow')
        assert hasattr(self.payment_manager, 'pay_per_usage')
        assert hasattr(self.payment_manager, 'create_payment_stream')
        assert hasattr(self.payment_manager, 'get_escrow_balance')
        assert hasattr(self.payment_manager, 'withdraw_from_escrow')
        assert hasattr(self.payment_manager, 'get_payment_history')

    def test_payment_manager_has_stream_tracking(self):
        """Test that payment manager tracks active streams."""
        assert hasattr(self.payment_manager, '_active_streams')
        assert isinstance(self.payment_manager._active_streams, dict)

    def test_payment_manager_token_mint_assignment(self):
        """Test token mint assignment based on network."""
        # Devnet by default
        devnet_manager = PaymentManager(self.mock_client, use_mainnet=False)
        assert devnet_manager.token_mint is not None
        
        # Mainnet when specified
        mainnet_manager = PaymentManager(self.mock_client, use_mainnet=True)
        assert mainnet_manager.token_mint is not None
        
        # Should be different token mints
        assert devnet_manager.token_mint != mainnet_manager.token_mint

    @pytest.mark.asyncio
    async def test_create_prepay_escrow_success(self):
        """Test successful prepay escrow creation."""
        # Mock sufficient balance
        self.mock_client.get_token_account_balance = AsyncMock(
            return_value={"ui_amount": 10.0}
        )
        self.mock_client.build_create_escrow_instruction = Mock()
        self.mock_client.send_transaction = AsyncMock(return_value="tx_signature")
        
        with patch('solders.transaction.Transaction.new_with_payer'):
            result = await self.payment_manager.create_prepay_escrow(
                service_provider=self.mock_recipient,
                amount=Decimal("5.0"),
                payer=self.mock_payer
            )
            
            assert result == "tx_signature"

    @pytest.mark.asyncio
    async def test_pay_per_usage_success(self):
        """Test successful pay-per-usage payment."""
        # Mock sufficient balance
        self.mock_client.get_token_account_balance = AsyncMock(
            return_value={"ui_amount": 10.0}
        )
        self.mock_client.build_spl_transfer_instruction = Mock()
        self.mock_client.send_transaction = AsyncMock(return_value="tx_signature")
        
        with patch('solders.transaction.Transaction.new_with_payer'):
            result = await self.payment_manager.pay_per_usage(
                service_provider=self.mock_recipient,
                usage_fee=Decimal("1.0"),
                payer=self.mock_payer
            )
            
            assert result == "tx_signature"

    @pytest.mark.asyncio
    async def test_get_escrow_balance_success(self):
        """Test successful escrow balance retrieval."""
        self.mock_client.get_escrow_account = AsyncMock(
            return_value={"balance": 5000000}  # 5 A2AMPL in base units
        )
        
        balance = await self.payment_manager.get_escrow_balance(
            self.mock_payer_pubkey, self.mock_recipient
        )
        
        assert balance == Decimal("5.0")  # Should be converted to UI amount

    @pytest.mark.asyncio
    async def test_get_escrow_balance_not_found(self):
        """Test escrow balance retrieval when escrow doesn't exist."""
        self.mock_client.get_escrow_account = AsyncMock(return_value=None)
        
        balance = await self.payment_manager.get_escrow_balance(
            self.mock_payer_pubkey, self.mock_recipient
        )
        
        assert balance == Decimal("0.0")

    @pytest.mark.asyncio
    async def test_get_payment_history_success(self):
        """Test successful payment history retrieval."""
        mock_payments = [
            {
                "payment_id": "payment123",
                "payer": str(self.mock_payer_pubkey),
                "recipient": str(self.mock_recipient),
                "amount": 1000000,
                "payment_type": PaymentType.PAY_AS_YOU_GO,
                "status": PaymentStatus.COMPLETED,
                "timestamp": 1640995200,
            }
        ]
        self.mock_client.get_payment_records = AsyncMock(return_value=mock_payments)
        
        history = await self.payment_manager.get_payment_history(self.mock_payer_pubkey)
        
        assert len(history) == 1
        assert history[0]["payment_id"] == "payment123"

    @pytest.mark.asyncio
    async def test_calculate_stream_cost(self):
        """Test stream cost calculation."""
        cost = self.payment_manager._calculate_stream_cost(
            rate_per_second=0.1, duration_seconds=100
        )
        assert cost == 10.0

    @pytest.mark.asyncio
    async def test_validate_payment_amount_valid(self):
        """Test payment amount validation with valid amount."""
        # Should not raise exception
        self.payment_manager._validate_payment_amount(1.0)
        self.payment_manager._validate_payment_amount(0.000001)  # Minimum amount

    @pytest.mark.asyncio
    async def test_validate_payment_amount_invalid(self):
        """Test payment amount validation with invalid amounts."""
        with pytest.raises(PaymentError, match="Amount must be positive"):
            self.payment_manager._validate_payment_amount(0.0)
        
        with pytest.raises(PaymentError, match="Amount must be positive"):
            self.payment_manager._validate_payment_amount(-1.0)

    @pytest.mark.asyncio
    async def test_generate_payment_id(self):
        """Test payment ID generation."""
        payment_id = self.payment_manager._generate_payment_id(
            self.mock_payer_pubkey, self.mock_recipient, "test_service"
        )
        
        assert isinstance(payment_id, str)
        assert len(payment_id) > 0

    @pytest.mark.asyncio
    async def test_stop_payment_stream(self):
        """Test stopping a payment stream."""
        # Add a mock stream
        stream_id = f"{self.mock_payer_pubkey}:{self.mock_recipient}:test_service"
        mock_task = Mock()
        mock_task.done.return_value = False
        self.payment_manager._active_streams[stream_id] = mock_task
        
        # Stop the stream
        await self.payment_manager.stop_payment_stream(
            self.mock_payer_pubkey, self.mock_recipient, "test_service"
        )
        
        assert stream_id not in self.payment_manager._active_streams
        mock_task.cancel.assert_called_once()

    @pytest.mark.asyncio
    async def test_context_manager_usage(self):
        """Test PaymentManager as async context manager."""
        async with PaymentManager(self.mock_client) as payment_manager:
            assert payment_manager.client == self.mock_client
            assert len(payment_manager._active_streams) == 0
        
        # All streams should be stopped after exiting context
        assert len(payment_manager._active_streams) == 0

    def test_derive_escrow_pda(self):
        """Test escrow PDA derivation."""
        pda = self.payment_manager._derive_escrow_pda(
            self.mock_payer_pubkey, self.mock_recipient
        )
        assert pda is not None

    @pytest.mark.asyncio
    async def test_validate_balance_sufficient(self):
        """Test balance validation with sufficient funds."""
        self.mock_client.get_token_account_balance = AsyncMock(
            return_value={"ui_amount": 10.0}
        )
        
        # Should not raise exception
        await self.payment_manager._validate_balance(self.mock_payer_pubkey, 5000000)

    @pytest.mark.asyncio
    async def test_validate_balance_insufficient(self):
        """Test balance validation with insufficient funds."""
        self.mock_client.get_token_account_balance = AsyncMock(
            return_value={"ui_amount": 1.0}
        )
        
        with pytest.raises(InsufficientFundsError):
            await self.payment_manager._validate_balance(self.mock_payer_pubkey, 5000000)

    @pytest.mark.asyncio
    async def test_get_associated_token_account(self):
        """Test associated token account derivation."""
        ata = await self.payment_manager._get_associated_token_account(self.mock_payer_pubkey)
        assert ata is not None

    def test_create_spl_transfer_instruction(self):
        """Test SPL transfer instruction creation."""
        instruction = self.payment_manager._create_spl_transfer_instruction(
            source=self.mock_payer_pubkey,
            destination=self.mock_recipient,
            owner=self.mock_payer_pubkey,
            amount=1000000
        )
        assert instruction is not None