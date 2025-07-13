"""Tests for solana_ai_registries.payments module."""

import pytest
from unittest.mock import Mock

from solana_ai_registries.payments import PaymentManager
from solana_ai_registries.client import SolanaAIRegistriesClient


class TestPaymentManager:
    """Test the PaymentManager class."""

    def setup_method(self):
        """Set up test fixtures."""
        self.mock_client = Mock(spec=SolanaAIRegistriesClient)
        self.payment_manager = PaymentManager(self.mock_client)

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