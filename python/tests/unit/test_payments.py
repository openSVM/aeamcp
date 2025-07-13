"""Comprehensive tests for solana_ai_registries.payments module."""

import pytest
from unittest.mock import AsyncMock, Mock, patch, MagicMock
from typing import AsyncGenerator
from decimal import Decimal
import asyncio

from solders.keypair import Keypair
from solders.pubkey import Pubkey
from solders.transaction import Transaction
from solders.instruction import Instruction

from solana_ai_registries.payments import PaymentManager
from solana_ai_registries.client import SolanaAIRegistriesClient
from solana_ai_registries.exceptions import (
    InsufficientFundsError,
    PaymentError,
    InvalidInputError,
    SolanaAIRegistriesError,
)
from solana_ai_registries.types import PaymentType


class TestPaymentManager:
    """Comprehensive test coverage for PaymentManager class."""

    def setup_method(self):
        """Set up test fixtures."""
        self.mock_client = Mock(spec=SolanaAIRegistriesClient)
        self.payment_manager = PaymentManager(self.mock_client)
        
        # Create real keypairs and public keys for testing
        self.payer_keypair = Keypair()
        self.service_provider_pubkey = Keypair().pubkey()
        
        # Mock client methods
        self.mock_client.get_account_info = AsyncMock()
        self.mock_client.build_and_send_transaction = AsyncMock()
        self.mock_client.get_program_accounts = AsyncMock()

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

    def test_init_token_mint_difference(self):
        """Test token mint assignment based on network."""
        devnet_manager = PaymentManager(self.mock_client, use_mainnet=False)
        mainnet_manager = PaymentManager(self.mock_client, use_mainnet=True)
        assert devnet_manager.token_mint != mainnet_manager.token_mint

    def test_payment_manager_has_required_methods(self):
        """Test that PaymentManager has the expected methods."""
        assert hasattr(self.payment_manager, 'create_prepay_escrow')
        assert hasattr(self.payment_manager, 'pay_per_usage')
        assert hasattr(self.payment_manager, 'create_payment_stream')
        assert hasattr(self.payment_manager, 'get_escrow_balance')
        assert hasattr(self.payment_manager, 'withdraw_from_escrow')
        assert hasattr(self.payment_manager, 'get_payment_history')
        assert hasattr(self.payment_manager, 'stop_payment_stream')
        assert hasattr(self.payment_manager, 'close')

    # Prepay Escrow Tests
    @pytest.mark.asyncio
    async def test_create_prepay_escrow_success(self):
        """Test successful prepay escrow creation."""
        with patch.object(self.payment_manager, '_validate_balance', new_callable=AsyncMock):
            with patch.object(self.payment_manager, '_get_associated_token_account') as mock_get_ata:
                mock_get_ata.return_value = Keypair().pubkey()
                self.mock_client.build_and_send_transaction.return_value = "mock_tx_signature"
                
                result = await self.payment_manager.create_prepay_escrow(
                    service_provider=self.service_provider_pubkey,
                    amount=Decimal("5.0"),
                    payer=self.payer_keypair
                )
                
                assert result == "mock_tx_signature"

    @pytest.mark.asyncio
    async def test_create_prepay_escrow_invalid_amount(self):
        """Test prepay escrow creation with invalid amount."""
        with pytest.raises(InvalidInputError, match="Prepay amount must be positive"):
            await self.payment_manager.create_prepay_escrow(
                service_provider=self.service_provider_pubkey,
                amount=Decimal("-1.0"),
                payer=self.payer_keypair
            )

    @pytest.mark.asyncio
    async def test_create_prepay_escrow_zero_amount(self):
        """Test prepay escrow creation with zero amount."""
        with pytest.raises(InvalidInputError, match="Prepay amount must be positive"):
            await self.payment_manager.create_prepay_escrow(
                service_provider=self.service_provider_pubkey,
                amount=Decimal("0.0"),
                payer=self.payer_keypair
            )

    @pytest.mark.asyncio
    async def test_create_prepay_escrow_insufficient_funds(self):
        """Test prepay escrow creation with insufficient funds."""
        with patch.object(self.payment_manager, '_validate_balance', new_callable=AsyncMock) as mock_validate:
            mock_validate.side_effect = InsufficientFundsError(
                required=1000000,
                available=500000,
                token_mint=str(self.payment_manager.token_mint)
            )
            
            with pytest.raises(InsufficientFundsError):
                await self.payment_manager.create_prepay_escrow(
                    service_provider=self.service_provider_pubkey,
                    amount=Decimal("10.0"),
                    payer=self.payer_keypair
                )

    @pytest.mark.asyncio
    async def test_create_prepay_escrow_with_metadata(self):
        """Test prepay escrow creation with metadata."""
        metadata = {"purpose": "test", "duration": "30 days"}
        
        with patch.object(self.payment_manager, '_validate_balance', new_callable=AsyncMock):
            with patch.object(self.payment_manager, '_get_associated_token_account') as mock_get_ata:
                mock_get_ata.return_value = Keypair().pubkey()
                self.mock_client.build_and_send_transaction.return_value = "mock_tx_signature"
                
                result = await self.payment_manager.create_prepay_escrow(
                    service_provider=self.service_provider_pubkey,
                    amount=Decimal("5.0"),
                    payer=self.payer_keypair,
                    duration_days=30,
                    metadata=metadata
                )
                
                assert result == "mock_tx_signature"

    @pytest.mark.asyncio
    async def test_create_prepay_escrow_payment_error(self):
        """Test prepay escrow creation when payment processing fails."""
        with patch.object(self.payment_manager, '_validate_balance', new_callable=AsyncMock):
            with patch.object(self.payment_manager, '_get_associated_token_account') as mock_get_ata:
                mock_get_ata.return_value = Keypair().pubkey()
                self.mock_client.build_and_send_transaction.side_effect = Exception("Transaction failed")
                
                with pytest.raises(PaymentError, match="Failed to create prepay escrow"):
                    await self.payment_manager.create_prepay_escrow(
                        service_provider=self.service_provider_pubkey,
                        amount=Decimal("5.0"),
                        payer=self.payer_keypair
                    )

    # Pay Per Usage Tests
    @pytest.mark.asyncio
    async def test_pay_per_usage_success(self):
        """Test successful pay-per-usage payment."""
        with patch.object(self.payment_manager, '_validate_balance', new_callable=AsyncMock):
            with patch.object(self.payment_manager, '_get_associated_token_account') as mock_get_ata:
                mock_get_ata.return_value = Keypair().pubkey()
                self.mock_client.build_and_send_transaction.return_value = "mock_tx_signature"
                
                result = await self.payment_manager.pay_per_usage(
                    service_provider=self.service_provider_pubkey,
                    usage_fee=Decimal("1.0"),
                    payer=self.payer_keypair
                )
                
                assert result == "mock_tx_signature"

    @pytest.mark.asyncio
    async def test_pay_per_usage_with_service_id(self):
        """Test pay-per-usage payment with service ID."""
        with patch.object(self.payment_manager, '_validate_balance', new_callable=AsyncMock):
            with patch.object(self.payment_manager, '_get_associated_token_account') as mock_get_ata:
                mock_get_ata.return_value = Keypair().pubkey()
                self.mock_client.build_and_send_transaction.return_value = "mock_tx_signature"
                
                result = await self.payment_manager.pay_per_usage(
                    service_provider=self.service_provider_pubkey,
                    usage_fee=Decimal("1.0"),
                    payer=self.payer_keypair,
                    service_id="test_service_123",
                    usage_data={"tokens": 1000, "model": "gpt-4"}
                )
                
                assert result == "mock_tx_signature"

    @pytest.mark.asyncio
    async def test_pay_per_usage_invalid_amount(self):
        """Test pay-per-usage with invalid amount."""
        with pytest.raises(Exception):  # Should be caught by _validate_payment_amount
            await self.payment_manager.pay_per_usage(
                service_provider=self.service_provider_pubkey,
                usage_fee=Decimal("-1.0"),
                payer=self.payer_keypair
            )

    # Escrow Balance Tests
    @pytest.mark.asyncio
    async def test_get_escrow_balance_success(self):
        """Test successful escrow balance retrieval."""
        # Mock PDA derivation
        with patch.object(self.payment_manager, '_derive_escrow_pda') as mock_derive:
            mock_escrow_pda = Keypair().pubkey()
            mock_derive.return_value = mock_escrow_pda
            
            # Mock account info with balance
            mock_account_info = Mock()
            mock_account_info.value = Mock()
            mock_account_info.value.data = b'\x00' * 8 + (5000000).to_bytes(8, 'little') + b'\x00' * 149
            self.mock_client.get_account_info.return_value = mock_account_info
            
            balance = await self.payment_manager.get_escrow_balance(
                payer=self.payer_keypair.pubkey(),
                service_provider=self.service_provider_pubkey
            )
            
            assert isinstance(balance, Decimal)

    @pytest.mark.asyncio
    async def test_get_escrow_balance_not_found(self):
        """Test escrow balance retrieval when escrow doesn't exist."""
        with patch.object(self.payment_manager, '_derive_escrow_pda') as mock_derive:
            mock_escrow_pda = Keypair().pubkey()
            mock_derive.return_value = mock_escrow_pda
            
            # Mock no account found
            self.mock_client.get_account_info.return_value = None
            
            balance = await self.payment_manager.get_escrow_balance(
                payer=self.payer_keypair.pubkey(),
                service_provider=self.service_provider_pubkey
            )
            
            assert balance == Decimal("0.0")

    @pytest.mark.asyncio
    async def test_get_escrow_balance_error(self):
        """Test escrow balance retrieval with error."""
        with patch.object(self.payment_manager, '_derive_escrow_pda') as mock_derive:
            mock_derive.side_effect = Exception("PDA derivation failed")
            
            with pytest.raises(PaymentError, match="Failed to get escrow balance"):
                await self.payment_manager.get_escrow_balance(
                    payer=self.payer_keypair.pubkey(),
                    service_provider=self.service_provider_pubkey
                )

    # Withdraw from Escrow Tests
    @pytest.mark.asyncio
    async def test_withdraw_from_escrow_success(self):
        """Test successful withdrawal from escrow."""
        with patch.object(self.payment_manager, '_derive_escrow_pda') as mock_derive:
            mock_derive.return_value = Keypair().pubkey()
            self.mock_client.build_and_send_transaction.return_value = "mock_tx_signature"
            
            result = await self.payment_manager.withdraw_from_escrow(
                service_provider=self.service_provider_pubkey,
                amount=Decimal("2.0"),
                payer=self.payer_keypair
            )
            
            assert result == "mock_tx_signature"

    @pytest.mark.asyncio
    async def test_withdraw_from_escrow_invalid_amount(self):
        """Test withdrawal with invalid amount."""
        with pytest.raises(Exception):  # Should be caught by _validate_payment_amount
            await self.payment_manager.withdraw_from_escrow(
                service_provider=self.service_provider_pubkey,
                amount=Decimal("-1.0"),
                payer=self.payer_keypair
            )

    # Payment History Tests  
    @pytest.mark.asyncio
    async def test_get_payment_history_success(self):
        """Test successful payment history retrieval."""
        mock_accounts = [
            Mock(
                pubkey=Keypair().pubkey(),
                account=Mock(data=b'\x00' * 100)  # Mock payment record data
            )
        ]
        self.mock_client.get_program_accounts.return_value = mock_accounts
        
        history = await self.payment_manager.get_payment_history(
            payer=self.payer_keypair.pubkey()
        )
        
        assert isinstance(history, list)

    @pytest.mark.asyncio
    async def test_get_payment_history_with_filters(self):
        """Test payment history with filters."""
        mock_accounts = []
        self.mock_client.get_program_accounts.return_value = mock_accounts
        
        history = await self.payment_manager.get_payment_history(
            payer=self.payer_keypair.pubkey(),
            service_provider=self.service_provider_pubkey,
            payment_type=PaymentType.PAY_AS_YOU_GO,
            limit=50
        )
        
        assert isinstance(history, list)

    @pytest.mark.asyncio
    async def test_get_payment_history_error(self):
        """Test payment history retrieval with error."""
        self.mock_client.get_program_accounts.side_effect = Exception("RPC error")
        
        with pytest.raises(PaymentError, match="Failed to get payment history"):
            await self.payment_manager.get_payment_history(
                payer=self.payer_keypair.pubkey()
            )

    # Payment Stream Tests
    @pytest.mark.asyncio
    async def test_create_payment_stream_success(self):
        """Test successful payment stream creation."""
        with patch.object(self.payment_manager, '_validate_balance', new_callable=AsyncMock):
            with patch.object(self.payment_manager, '_execute_payment_stream') as mock_execute:
                async def mock_stream():
                    yield "payment_1"
                    yield "payment_2"
                
                mock_execute.return_value = mock_stream()
                
                stream = self.payment_manager.create_payment_stream(
                    service_provider=self.service_provider_pubkey,
                    rate_per_second=Decimal("0.1"),
                    payer=self.payer_keypair,
                    duration_seconds=60
                )
                
                assert hasattr(stream, '__aiter__')

    @pytest.mark.asyncio
    async def test_create_payment_stream_invalid_rate(self):
        """Test payment stream with invalid rate."""
        with pytest.raises(Exception):  # Should be caught by validation
            stream = self.payment_manager.create_payment_stream(
                service_provider=self.service_provider_pubkey,
                rate_per_second=Decimal("-0.1"),
                payer=self.payer_keypair,
                duration_seconds=60
            )

    def test_stop_payment_stream(self):
        """Test stopping a payment stream."""
        # Create a mock stream ID
        stream_id = "test_stream_123"
        mock_task = Mock()
        self.payment_manager._active_streams[stream_id] = mock_task
        
        with patch.object(self.payment_manager, '_generate_payment_id', return_value=stream_id):
            self.payment_manager.stop_payment_stream(
                payer=self.payer_keypair.pubkey(),
                recipient=self.service_provider_pubkey,
                service_id="test_service"
            )
            
            mock_task.cancel.assert_called_once()

    def test_stop_payment_stream_not_found(self):
        """Test stopping a non-existent payment stream."""
        # Should not raise an error, just log
        self.payment_manager.stop_payment_stream(
            payer=self.payer_keypair.pubkey(),
            recipient=self.service_provider_pubkey,
            service_id="nonexistent_service"
        )

    # Close Tests
    def test_close(self):
        """Test closing payment manager."""
        # Add some mock active streams
        mock_task1 = Mock()
        mock_task2 = Mock()
        self.payment_manager._active_streams = {
            "stream1": mock_task1,
            "stream2": mock_task2
        }
        
        self.payment_manager.close()
        
        mock_task1.cancel.assert_called_once()
        mock_task2.cancel.assert_called_once()
        assert len(self.payment_manager._active_streams) == 0

    # Private Method Tests
    def test_derive_escrow_pda(self):
        """Test PDA derivation for escrow account."""
        pda = self.payment_manager._derive_escrow_pda(
            payer=self.payer_keypair.pubkey(),
            service_provider=self.service_provider_pubkey
        )
        
        assert isinstance(pda, Pubkey)

    def test_get_associated_token_account(self):
        """Test associated token account derivation."""
        ata = self.payment_manager._get_associated_token_account(
            owner=self.payer_keypair.pubkey()
        )
        
        assert isinstance(ata, Pubkey)

    @pytest.mark.asyncio
    async def test_validate_balance_sufficient(self):
        """Test balance validation with sufficient funds."""
        # Mock account with sufficient balance
        mock_account_info = Mock()
        mock_account_info.value = Mock()
        mock_account_info.value.data = b'\x00' * 64 + (10000000).to_bytes(8, 'little') + b'\x00' * 93
        self.mock_client.get_account_info.return_value = mock_account_info
        
        with patch.object(self.payment_manager, '_get_associated_token_account') as mock_get_ata:
            mock_get_ata.return_value = Keypair().pubkey()
            
            # Should not raise an exception
            await self.payment_manager._validate_balance(
                payer=self.payer_keypair.pubkey(),
                required_amount=5000000
            )

    @pytest.mark.asyncio
    async def test_validate_balance_insufficient(self):
        """Test balance validation with insufficient funds."""
        # Mock account with insufficient balance
        mock_account_info = Mock()
        mock_account_info.value = Mock()
        mock_account_info.value.data = b'\x00' * 64 + (1000000).to_bytes(8, 'little') + b'\x00' * 93
        self.mock_client.get_account_info.return_value = mock_account_info
        
        with patch.object(self.payment_manager, '_get_associated_token_account') as mock_get_ata:
            mock_get_ata.return_value = Keypair().pubkey()
            
            with pytest.raises(InsufficientFundsError):
                await self.payment_manager._validate_balance(
                    payer=self.payer_keypair.pubkey(),
                    required_amount=5000000
                )

    @pytest.mark.asyncio
    async def test_validate_balance_no_account(self):
        """Test balance validation when account doesn't exist."""
        self.mock_client.get_account_info.return_value = None
        
        with patch.object(self.payment_manager, '_get_associated_token_account') as mock_get_ata:
            mock_get_ata.return_value = Keypair().pubkey()
            
            with pytest.raises(InsufficientFundsError):
                await self.payment_manager._validate_balance(
                    payer=self.payer_keypair.pubkey(),
                    required_amount=5000000
                )

    def test_validate_payment_amount_valid(self):
        """Test payment amount validation with valid amount."""
        # Should not raise an exception
        self.payment_manager._validate_payment_amount(1.0)
        self.payment_manager._validate_payment_amount(0.1)
        self.payment_manager._validate_payment_amount(1000.0)

    def test_validate_payment_amount_invalid(self):
        """Test payment amount validation with invalid amount."""
        with pytest.raises(InvalidInputError):
            self.payment_manager._validate_payment_amount(-1.0)
            
        with pytest.raises(InvalidInputError):
            self.payment_manager._validate_payment_amount(0.0)

    def test_calculate_stream_cost(self):
        """Test stream cost calculation."""
        cost = self.payment_manager._calculate_stream_cost(
            rate_per_second=0.1,
            duration_seconds=60
        )
        
        assert cost == 6.0  # 0.1 * 60

    def test_generate_payment_id(self):
        """Test payment ID generation."""
        payment_id = self.payment_manager._generate_payment_id(
            payer=self.payer_keypair.pubkey(),
            recipient=self.service_provider_pubkey,
            service_id="test_service"
        )
        
        assert isinstance(payment_id, str)
        assert len(payment_id) > 0

    def test_create_spl_transfer_instruction(self):
        """Test SPL transfer instruction creation."""
        source = Keypair().pubkey()
        destination = Keypair().pubkey()
        owner = self.payer_keypair.pubkey()
        
        instruction = self.payment_manager._create_spl_transfer_instruction(
            source=source,
            destination=destination,
            owner=owner,
            amount=1000000
        )
        
        assert isinstance(instruction, Instruction)