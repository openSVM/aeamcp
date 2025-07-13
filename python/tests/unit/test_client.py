"""Tests for solana_ai_registries.client module."""

import pytest
from unittest.mock import AsyncMock, MagicMock, Mock, patch

from solders.keypair import Keypair
from solders.pubkey import Pubkey as PublicKey
from solders.transaction import Transaction
from solders.hash import Hash
from solana.rpc.commitment import Commitment
from solana.rpc.api import GetAccountInfoResp

from solana_ai_registries.client import SolanaAIRegistriesClient
from solana_ai_registries.constants import DEFAULT_DEVNET_RPC
from solana_ai_registries.exceptions import ConnectionError, InvalidPublicKeyError, TransactionError


class TestSolanaAIRegistriesClient:
    """Test the SolanaAIRegistriesClient class."""

    def test_init_default_params(self):
        """Test client initialization with default parameters."""
        client = SolanaAIRegistriesClient()
        assert client.rpc_url == DEFAULT_DEVNET_RPC
        assert client._client is None

    def test_init_custom_params(self):
        """Test client initialization with custom parameters."""
        custom_url = "https://api.mainnet-beta.solana.com"
        
        client = SolanaAIRegistriesClient(rpc_url=custom_url)
        assert client.rpc_url == custom_url

    def test_client_property(self):
        """Test the client property creates and returns AsyncClient."""
        client = SolanaAIRegistriesClient()
        
        # First access should create the client
        async_client = client.client
        assert async_client is not None
        
        # Second access should return same client
        assert client.client is async_client

    @pytest.mark.asyncio
    async def test_close_client(self):
        """Test closing the client connection."""
        client = SolanaAIRegistriesClient()
        
        # Mock the client
        mock_async_client = AsyncMock()
        client._client = mock_async_client
        
        await client.close()
        mock_async_client.close.assert_called_once()

    @pytest.mark.asyncio
    async def test_close_client_no_client(self):
        """Test closing when no client exists."""
        client = SolanaAIRegistriesClient()
        # Should not raise an exception when closing non-connected client
        await client.close()

    @pytest.mark.asyncio 
    async def test_context_manager_usage(self):
        """Test using client as async context manager."""
        with patch.object(SolanaAIRegistriesClient, 'close') as mock_close:
            async with SolanaAIRegistriesClient() as client:
                assert isinstance(client, SolanaAIRegistriesClient)
            mock_close.assert_called_once()

    @pytest.mark.asyncio
    async def test_get_account_info_success(self):
        """Test successful account info retrieval."""
        client = SolanaAIRegistriesClient()
        mock_client = AsyncMock()
        client._client = mock_client
        
        # Mock successful response
        mock_response = Mock()
        mock_response.value = Mock()
        mock_response.value.data = b"test_data"
        mock_response.value.executable = False
        mock_response.value.lamports = 1000000
        mock_response.value.owner = "owner_pubkey"
        mock_response.value.rent_epoch = 250
        mock_client.get_account_info.return_value = mock_response
        
        pubkey = Keypair().pubkey()
        result = await client.get_account_info(pubkey)
        
        expected = {
            "data": b"test_data",
            "executable": False,
            "lamports": 1000000,
            "owner": "owner_pubkey",
            "rent_epoch": 250,
        }
        assert result == expected
        mock_client.get_account_info.assert_called_once()

    @pytest.mark.asyncio
    async def test_get_account_info_not_found(self):
        """Test account info when account not found."""
        client = SolanaAIRegistriesClient()
        mock_client = AsyncMock()
        client._client = mock_client
        
        # Mock response with no account
        mock_response = Mock()
        mock_response.value = None
        mock_client.get_account_info.return_value = mock_response
        
        pubkey = Keypair().pubkey()
        result = await client.get_account_info(pubkey)
        
        assert result is None

    @pytest.mark.asyncio
    async def test_get_account_info_exception(self):
        """Test account info when RPC call fails."""
        client = SolanaAIRegistriesClient()
        mock_client = AsyncMock()
        client._client = mock_client
        
        # Mock RPC exception
        mock_client.get_account_info.side_effect = Exception("RPC Error")
        
        pubkey = Keypair().pubkey()
        with pytest.raises(ConnectionError):
            await client.get_account_info(pubkey)

    @pytest.mark.asyncio
    async def test_get_agent_registry_entry_success(self):
        """Test successful agent registry entry retrieval."""
        client = SolanaAIRegistriesClient()
        
        mock_account_info = {
            'data': b"raw_data",
            'executable': False,
            'lamports': 1000000,
            'owner': 'owner123',
            'rent_epoch': 250
        }
        
        with patch.object(client, 'get_account_info') as mock_get_account:
            mock_get_account.return_value = mock_account_info
            
            result = await client.get_agent_registry_entry("test-agent", Keypair().pubkey())
            
            assert result == mock_account_info
            mock_get_account.assert_called_once()

    @pytest.mark.asyncio
    async def test_get_agent_registry_entry_not_found(self):
        """Test agent registry entry when account not found."""
        client = SolanaAIRegistriesClient()
        
        with patch.object(client, 'get_account_info') as mock_get_account:
            mock_get_account.return_value = None
            
            result = await client.get_agent_registry_entry("test-agent", Keypair().pubkey())
            
            assert result is None

    @pytest.mark.asyncio
    async def test_get_mcp_server_registry_entry_success(self):
        """Test successful MCP server registry entry retrieval."""
        client = SolanaAIRegistriesClient()
        
        mock_account_info = {
            'data': b"raw_data",
            'executable': False,
            'lamports': 1000000,
            'owner': 'owner123',
            'rent_epoch': 250
        }
        
        with patch.object(client, 'get_account_info') as mock_get_account:
            mock_get_account.return_value = mock_account_info
            
            result = await client.get_mcp_server_registry_entry("test-server", Keypair().pubkey())
            
            assert result == mock_account_info
            mock_get_account.assert_called_once()

    @pytest.mark.asyncio
    async def test_send_transaction_success(self):
        """Test successful transaction sending."""
        client = SolanaAIRegistriesClient()
        mock_client = AsyncMock()
        client._client = mock_client
        
        # Mock transaction and keypair
        transaction = Mock()
        signer = Keypair()
        
        # Mock successful responses
        mock_blockhash_response = Mock()
        test_hash = Hash.default()
        mock_blockhash_response.value.blockhash = test_hash
        mock_client.get_latest_blockhash.return_value = mock_blockhash_response
        
        mock_send_response = Mock()
        mock_send_response.value = "test_signature"
        mock_client.send_transaction.return_value = mock_send_response
        
        result = await client.send_transaction(transaction, [signer])
        
        assert result == "test_signature"
        mock_client.get_latest_blockhash.assert_called_once()
        mock_client.send_transaction.assert_called_once()
        transaction.sign.assert_called_once_with([signer], test_hash)

    @pytest.mark.asyncio
    async def test_send_transaction_failure(self):
        """Test transaction sending failure."""
        client = SolanaAIRegistriesClient()
        mock_client = AsyncMock()
        client._client = mock_client
        
        transaction = Mock()
        signer = Keypair()
        
        # Mock blockhash success but send failure
        mock_blockhash_response = Mock()
        test_hash = Hash.default()
        mock_blockhash_response.value.blockhash = test_hash
        mock_client.get_latest_blockhash.return_value = mock_blockhash_response
        
        mock_client.send_transaction.side_effect = Exception("Transaction failed")
        
        with pytest.raises(TransactionError):
            await client.send_transaction(transaction, [signer])

    @pytest.mark.asyncio
    async def test_simulate_transaction_success(self):
        """Test successful transaction simulation."""
        client = SolanaAIRegistriesClient()
        mock_client = AsyncMock()
        client._client = mock_client
        
        transaction = Mock()
        
        # Mock successful simulation
        mock_response = Mock()
        mock_response.value.err = None
        mock_response.value.logs = ["Program log: Success"]
        mock_client.simulate_transaction.return_value = mock_response
        
        result = await client.simulate_transaction(transaction)
        
        assert result.value.err is None
        mock_client.simulate_transaction.assert_called_once()

    @pytest.mark.asyncio
    async def test_simulate_transaction_failure(self):
        """Test transaction simulation failure."""
        client = SolanaAIRegistriesClient()
        mock_client = AsyncMock()
        client._client = mock_client
        
        transaction = Mock()
        mock_client.simulate_transaction.side_effect = Exception("Simulation failed")
        
        with pytest.raises(TransactionError):
            await client.simulate_transaction(transaction)

    @pytest.mark.asyncio
    async def test_get_balance_success(self):
        """Test successful balance retrieval."""
        client = SolanaAIRegistriesClient()
        mock_client = AsyncMock()
        client._client = mock_client
        
        mock_response = Mock()
        mock_response.value = 1000000
        mock_client.get_balance.return_value = mock_response
        
        pubkey = Keypair().pubkey()
        result = await client.get_balance(pubkey)
        
        assert result == 1000000
        mock_client.get_balance.assert_called_once_with(pubkey, Commitment("confirmed"))

    @pytest.mark.asyncio
    async def test_get_balance_failure(self):
        """Test balance retrieval failure."""
        client = SolanaAIRegistriesClient()
        mock_client = AsyncMock()
        client._client = mock_client
        
        mock_client.get_balance.side_effect = Exception("RPC Error")
        
        pubkey = Keypair().pubkey()
        with pytest.raises(ConnectionError):
            await client.get_balance(pubkey)

    @pytest.mark.asyncio
    async def test_get_token_account_balance_success(self):
        """Test successful token account balance retrieval."""
        client = SolanaAIRegistriesClient()
        mock_client = AsyncMock()
        client._client = mock_client
        
        mock_response = Mock()
        mock_response.value.ui_amount = 100.5
        mock_client.get_token_account_balance.return_value = mock_response
        
        pubkey = Keypair().pubkey()
        result = await client.get_token_account_balance(pubkey)
        
        assert result == 100.5
        mock_client.get_token_account_balance.assert_called_once()

    @pytest.mark.asyncio
    async def test_get_token_account_balance_failure(self):
        """Test token account balance retrieval failure."""
        client = SolanaAIRegistriesClient()
        mock_client = AsyncMock()
        client._client = mock_client
        
        mock_client.get_token_account_balance.side_effect = Exception("RPC Error")
        
        pubkey = Keypair().pubkey()
        with pytest.raises(ConnectionError):
            await client.get_token_account_balance(pubkey)

    def test_derive_agent_pda_success(self):
        """Test successful agent PDA derivation."""
        client = SolanaAIRegistriesClient()
        
        agent_id = "test-agent"
        owner = Keypair().pubkey()
        
        result = client.derive_agent_pda(agent_id, owner)
        
        assert isinstance(result, PublicKey)
        
        # Should return same PDA for same inputs
        result2 = client.derive_agent_pda(agent_id, owner)
        assert result == result2

    def test_derive_agent_pda_invalid_agent_id(self):
        """Test agent PDA derivation with invalid agent ID."""
        client = SolanaAIRegistriesClient()
        
        # Agent ID too long
        long_agent_id = "a" * 65  # MAX_AGENT_ID_LEN is 64
        owner = Keypair().pubkey()
        
        with pytest.raises(InvalidPublicKeyError):
            client.derive_agent_pda(long_agent_id, owner)

    def test_derive_mcp_server_pda_success(self):
        """Test successful MCP server PDA derivation."""
        client = SolanaAIRegistriesClient()
        
        server_id = "test-server"
        owner = Keypair().pubkey()
        
        result = client.derive_mcp_server_pda(server_id, owner)
        
        assert isinstance(result, PublicKey)
        
        # Should return same PDA for same inputs
        result2 = client.derive_mcp_server_pda(server_id, owner)
        assert result == result2

    def test_derive_mcp_server_pda_invalid_server_id(self):
        """Test MCP server PDA derivation with invalid server ID."""
        client = SolanaAIRegistriesClient()
        
        # Server ID too long
        long_server_id = "s" * 65  # MAX_SERVER_ID_LEN is 64
        owner = Keypair().pubkey()
        
        with pytest.raises(InvalidPublicKeyError):
            client.derive_mcp_server_pda(long_server_id, owner)

    def test_build_register_agent_instruction(self):
        """Test building register agent instruction."""
        client = SolanaAIRegistriesClient()
        
        agent_id = "test-agent"
        name = "Test Agent"
        description = "A test agent"
        url = "https://example.com/agent"
        owner = Keypair().pubkey()
        
        instruction = client.build_register_agent_instruction(
            agent_id, name, description, url, owner
        )
        
        assert instruction.program_id == client.agent_program_id
        assert len(instruction.accounts) == 3  # agent_account, owner, system_program
        assert len(instruction.data) > 0

    def test_build_update_agent_instruction(self):
        """Test building update agent instruction."""
        client = SolanaAIRegistriesClient()
        
        agent_id = "test-agent"
        owner = Keypair().pubkey()
        updates = {"name": "Updated Agent Name"}
        
        instruction = client.build_update_agent_instruction(
            agent_id, owner, updates
        )
        
        assert instruction.program_id == client.agent_program_id
        assert len(instruction.accounts) == 2  # agent_account, owner
        assert len(instruction.data) > 0

    def test_build_register_mcp_server_instruction(self):
        """Test building register MCP server instruction."""
        client = SolanaAIRegistriesClient()
        
        server_id = "test-server"
        name = "Test Server"
        endpoint_url = "https://example.com/mcp"
        owner = Keypair().pubkey()
        
        instruction = client.build_register_mcp_server_instruction(
            server_id, name, endpoint_url, owner
        )
        
        assert instruction.program_id == client.mcp_program_id
        assert len(instruction.accounts) == 3  # server_account, owner, system_program
        assert len(instruction.data) > 0

    def test_build_update_mcp_server_instruction(self):
        """Test building update MCP server instruction."""
        client = SolanaAIRegistriesClient()
        
        server_id = "test-server"
        owner = Keypair().pubkey()
        updates = {"name": "Updated Server Name"}
        
        instruction = client.build_update_mcp_server_instruction(
            server_id, owner, updates
        )
        
        assert instruction.program_id == client.mcp_program_id
        assert len(instruction.accounts) == 2  # server_account, owner
        assert len(instruction.data) > 0

    @pytest.mark.asyncio
    async def test_send_and_confirm_transaction_success(self):
        """Test successful transaction sending and confirmation."""
        client = SolanaAIRegistriesClient()
        
        # Mock successful send
        mock_client = AsyncMock()
        mock_client.send_transaction.return_value.value = "mock_signature"
        mock_client.confirm_transaction.return_value.value = [None]  # Success
        
        client._client = mock_client
        
        transaction = Transaction.new_with_payer([], Keypair().pubkey())
        keypair = Keypair()
        
        signature = await client.send_and_confirm_transaction(transaction, [keypair])
        
        assert signature == "mock_signature"
        mock_client.send_transaction.assert_called_once()
        mock_client.confirm_transaction.assert_called_once()

    @pytest.mark.asyncio
    async def test_send_and_confirm_transaction_failure(self):
        """Test transaction sending failure."""
        client = SolanaAIRegistriesClient()
        
        # Mock send failure
        mock_client = AsyncMock()
        mock_client.send_transaction.side_effect = Exception("Send failed")
        
        client._client = mock_client
        
        transaction = Transaction.new_with_payer([], Keypair().pubkey())
        keypair = Keypair()
        
        with pytest.raises(TransactionError, match="Failed to send transaction"):
            await client.send_and_confirm_transaction(transaction, [keypair])

    @pytest.mark.asyncio
    async def test_send_and_confirm_transaction_confirmation_failure(self):
        """Test transaction confirmation failure."""
        client = SolanaAIRegistriesClient()
        
        # Mock successful send but confirmation failure
        mock_client = AsyncMock()
        mock_client.send_transaction.return_value.value = "mock_signature"
        mock_client.confirm_transaction.return_value.value = [{"err": "Transaction failed"}]
        
        client._client = mock_client
        
        transaction = Transaction.new_with_payer([], Keypair().pubkey())
        keypair = Keypair()
        
        with pytest.raises(TransactionError, match="Transaction failed"):
            await client.send_and_confirm_transaction(transaction, [keypair])

    @pytest.mark.asyncio
    async def test_get_multiple_accounts_success(self):
        """Test getting multiple accounts successfully."""
        client = SolanaAIRegistriesClient()
        
        mock_client = AsyncMock()
        mock_accounts = [
            Mock(value=Mock(data=b"account1_data")),
            Mock(value=Mock(data=b"account2_data")),
            None  # One account not found
        ]
        mock_client.get_multiple_accounts.return_value.value = mock_accounts
        
        client._client = mock_client
        
        pubkeys = [Keypair().pubkey() for _ in range(3)]
        
        result = await client.get_multiple_accounts(pubkeys)
        
        assert len(result) == 3
        assert result[0] is not None
        assert result[1] is not None
        assert result[2] is None
        mock_client.get_multiple_accounts.assert_called_once()

    @pytest.mark.asyncio
    async def test_get_multiple_accounts_rpc_error(self):
        """Test getting multiple accounts with RPC error."""
        client = SolanaAIRegistriesClient()
        
        mock_client = AsyncMock()
        mock_client.get_multiple_accounts.side_effect = Exception("RPC error")
        
        client._client = mock_client
        
        pubkeys = [Keypair().pubkey()]
        
        with pytest.raises(ConnectionError, match="Failed to get multiple accounts"):
            await client.get_multiple_accounts(pubkeys)

    @pytest.mark.asyncio
    async def test_get_program_accounts_with_filters(self):
        """Test getting program accounts with filters."""
        client = SolanaAIRegistriesClient()
        
        mock_client = AsyncMock()
        mock_accounts = [
            Mock(pubkey=Keypair().pubkey(), account=Mock(data=b"filtered_data"))
        ]
        mock_client.get_program_accounts.return_value.value = mock_accounts
        
        client._client = mock_client
        
        program_id = Keypair().pubkey()
        filters = [{"memcmp": {"offset": 0, "bytes": "test"}}]
        
        result = await client.get_program_accounts(program_id, filters=filters)
        
        assert len(result) == 1
        assert result[0].account.data == b"filtered_data"
        mock_client.get_program_accounts.assert_called_once()

    @pytest.mark.asyncio
    async def test_get_latest_blockhash_success(self):
        """Test getting latest blockhash successfully."""
        client = SolanaAIRegistriesClient()
        
        mock_client = AsyncMock()
        mock_hash = Hash.from_string("11111111111111111111111111111112")
        mock_client.get_latest_blockhash.return_value.value.blockhash = mock_hash
        
        client._client = mock_client
        
        result = await client.get_latest_blockhash()
        
        assert result == mock_hash
        mock_client.get_latest_blockhash.assert_called_once()

    @pytest.mark.asyncio
    async def test_get_latest_blockhash_rpc_error(self):
        """Test getting latest blockhash with RPC error."""
        client = SolanaAIRegistriesClient()
        
        mock_client = AsyncMock()
        mock_client.get_latest_blockhash.side_effect = Exception("RPC error")
        
        client._client = mock_client
        
        with pytest.raises(ConnectionError, match="Failed to get latest blockhash"):
            await client.get_latest_blockhash()

    def test_validate_transaction_success(self):
        """Test successful transaction validation."""
        client = SolanaAIRegistriesClient()
        
        transaction = Transaction.new_with_payer([], Keypair().pubkey())
        signers = [Keypair()]
        
        # Should not raise an exception
        client.validate_transaction(transaction, signers)

    def test_validate_transaction_no_instructions(self):
        """Test transaction validation with no instructions."""
        client = SolanaAIRegistriesClient()
        
        transaction = Transaction.new_with_payer([], Keypair().pubkey())
        signers = [Keypair()]
        
        with pytest.raises(TransactionError, match="Transaction must contain at least one instruction"):
            client.validate_transaction(transaction, signers)

    def test_validate_transaction_no_signers(self):
        """Test transaction validation with no signers."""
        client = SolanaAIRegistriesClient()
        
        instruction = client.build_register_agent_instruction(
            "test", "Test", "Description", "https://example.com", Keypair().pubkey()
        )
        transaction = Transaction.new_with_payer([instruction], Keypair().pubkey())
        
        with pytest.raises(TransactionError, match="Transaction must have at least one signer"):
            client.validate_transaction(transaction, [])

    def test_estimate_transaction_fee(self):
        """Test transaction fee estimation."""
        client = SolanaAIRegistriesClient()
        
        instruction = client.build_register_agent_instruction(
            "test", "Test", "Description", "https://example.com", Keypair().pubkey()
        )
        transaction = Transaction.new_with_payer([instruction], Keypair().pubkey())
        
        fee = client.estimate_transaction_fee(transaction)
        
        assert isinstance(fee, int)
        assert fee > 0

    @pytest.mark.asyncio
    async def test_build_and_send_transaction_with_retry_success(self):
        """Test building and sending transaction with retry logic."""
        client = SolanaAIRegistriesClient()
        
        # Mock successful transaction on first try
        with patch.object(client, 'get_latest_blockhash') as mock_blockhash:
            with patch.object(client, 'send_and_confirm_transaction') as mock_send:
                mock_blockhash.return_value = Hash.from_string("11111111111111111111111111111112")
                mock_send.return_value = "mock_signature"
                
                instruction = client.build_register_agent_instruction(
                    "test", "Test", "Description", "https://example.com", Keypair().pubkey()
                )
                signers = [Keypair()]
                
                signature = await client.build_and_send_transaction([instruction], signers)
                
                assert signature == "mock_signature"
                mock_send.assert_called_once()

    @pytest.mark.asyncio
    async def test_build_and_send_transaction_with_retry_failure(self):
        """Test building and sending transaction with retry exhaustion."""
        client = SolanaAIRegistriesClient()
        
        # Mock transaction failure on all retries
        with patch.object(client, 'get_latest_blockhash') as mock_blockhash:
            with patch.object(client, 'send_and_confirm_transaction') as mock_send:
                mock_blockhash.return_value = Hash.from_string("11111111111111111111111111111112")
                mock_send.side_effect = TransactionError("Transaction failed")
                
                instruction = client.build_register_agent_instruction(
                    "test", "Test", "Description", "https://example.com", Keypair().pubkey()
                )
                signers = [Keypair()]
                
                with pytest.raises(TransactionError, match="Transaction failed after 3 retries"):
                    await client.build_and_send_transaction([instruction], signers, max_retries=3)

    def test_instruction_encoding_edge_cases(self):
        """Test instruction encoding with edge case values."""
        client = SolanaAIRegistriesClient()
        
        # Test with maximum length strings
        long_agent_id = "a" * 64  # MAX_AGENT_ID_LEN
        long_name = "n" * 100
        long_description = "d" * 500
        long_url = "https://example.com/" + "x" * 200
        
        instruction = client.build_register_agent_instruction(
            long_agent_id, long_name, long_description, long_url, Keypair().pubkey()
        )
        
        assert len(instruction.data) > 0
        assert instruction.program_id == client.agent_program_id

    def test_pda_derivation_consistency(self):
        """Test that PDA derivation is consistent across calls."""
        client = SolanaAIRegistriesClient()
        
        agent_id = "test-agent"
        owner = Keypair().pubkey()
        
        # Generate PDA multiple times
        pda1 = client.derive_agent_pda(agent_id, owner)
        pda2 = client.derive_agent_pda(agent_id, owner)
        pda3 = client.derive_agent_pda(agent_id, owner)
        
        # All should be identical
        assert pda1 == pda2 == pda3

    def test_error_handling_edge_cases(self):
        """Test error handling with various edge cases."""
        client = SolanaAIRegistriesClient()
        
        # Test with None values
        with pytest.raises((TypeError, AttributeError)):
            client.derive_agent_pda(None, Keypair().pubkey())
        
        with pytest.raises((TypeError, AttributeError)):
            client.derive_agent_pda("test", None)

    @pytest.mark.asyncio
    async def test_connection_lifecycle(self):
        """Test complete connection lifecycle."""
        client = SolanaAIRegistriesClient()
        
        # Initial state
        assert client._client is None
        
        # Access client property
        async_client = client.client
        assert async_client is not None
        assert client._client is async_client
        
        # Close connection
        await client.close()
        assert client._client is None

    def test_commitment_parameter_handling(self):
        """Test that commitment parameters are handled correctly."""
        client = SolanaAIRegistriesClient()
        
        # Test with string commitment
        client_with_commitment = SolanaAIRegistriesClient(
            commitment="confirmed"
        )
        assert client_with_commitment.commitment == "confirmed"
        
        # Test with Commitment enum
        client_with_enum = SolanaAIRegistriesClient(
            commitment=Commitment("finalized")
        )
        assert client_with_enum.commitment == Commitment("finalized")

    def test_program_id_constants(self):
        """Test that program ID constants are properly set."""
        client = SolanaAIRegistriesClient()
        
        # Program IDs should be valid Pubkey objects
        assert isinstance(client.agent_program_id, PublicKey)
        assert isinstance(client.mcp_program_id, PublicKey)
        
        # They should be different
        assert client.agent_program_id != client.mcp_program_id
        client = SolanaAIRegistriesClient()
        
        agent_id = "test-agent"
        name = "Updated Agent"
        description = "An updated test agent"
        url = "https://example.com/updated-agent"
        owner = Keypair().pubkey()
        
        instruction = client.build_update_agent_instruction(
            agent_id, name, description, url, owner
        )
        
        assert instruction.program_id == client.agent_program_id
        assert len(instruction.accounts) == 2  # agent_account, owner
        assert len(instruction.data) > 0

    def test_build_deregister_agent_instruction(self):
        """Test building deregister agent instruction."""
        client = SolanaAIRegistriesClient()
        
        agent_id = "test-agent"
        owner = Keypair().pubkey()
        
        instruction = client.build_deregister_agent_instruction(agent_id, owner)
        
        assert instruction.program_id == client.agent_program_id
        assert len(instruction.accounts) == 2  # agent_account, owner
        assert len(instruction.data) > 0

    def test_build_register_mcp_server_instruction(self):
        """Test building register MCP server instruction."""
        client = SolanaAIRegistriesClient()
        
        server_id = "test-server"
        name = "Test Server"
        description = "A test MCP server"
        endpoint = "https://example.com/mcp"
        owner = Keypair().pubkey()
        
        instruction = client.build_register_mcp_server_instruction(
            server_id, name, description, endpoint, owner
        )
        
        assert instruction.program_id == client.mcp_program_id
        assert len(instruction.accounts) == 3  # server_account, owner, system_program
        assert len(instruction.data) > 0

    def test_build_deregister_mcp_server_instruction(self):
        """Test building deregister MCP server instruction."""
        client = SolanaAIRegistriesClient()
        
        server_id = "test-server"
        owner = Keypair().pubkey()
        
        instruction = client.build_deregister_mcp_server_instruction(server_id, owner)
        
        assert instruction.program_id == client.mcp_program_id
        assert len(instruction.accounts) == 2  # server_account, owner
        assert len(instruction.data) > 0

    def test_encode_register_agent_data(self):
        """Test encoding register agent data."""
        client = SolanaAIRegistriesClient()
        
        data = client._encode_register_agent_data(
            "test-agent", "Test Agent", "A test agent", "https://example.com/agent"
        )
        
        assert isinstance(data, bytes)
        assert len(data) > 0
        # First byte should be instruction discriminator
        assert data[0] == 0  # Register instruction

    def test_encode_update_agent_data(self):
        """Test encoding update agent data."""
        client = SolanaAIRegistriesClient()
        
        data = client._encode_update_agent_data(
            "Updated Agent", "An updated test agent", "https://example.com/updated"
        )
        
        assert isinstance(data, bytes)
        assert len(data) > 0
        # First byte should be instruction discriminator
        assert data[0] == 1  # Update instruction

    def test_encode_deregister_agent_data(self):
        """Test encoding deregister agent data."""
        client = SolanaAIRegistriesClient()
        
        data = client._encode_deregister_agent_data()
        
        assert isinstance(data, bytes)
        assert len(data) == 1  # Only discriminator
        assert data[0] == 2  # Deregister instruction

    def test_encode_register_mcp_server_data(self):
        """Test encoding register MCP server data."""
        client = SolanaAIRegistriesClient()
        
        data = client._encode_register_mcp_server_data(
            "test-server", "Test Server", "A test server", "https://example.com/mcp"
        )
        
        assert isinstance(data, bytes)
        assert len(data) > 0
        # First byte should be instruction discriminator
        assert data[0] == 0  # Register instruction

    def test_encode_deregister_mcp_server_data(self):
        """Test encoding deregister MCP server data."""
        client = SolanaAIRegistriesClient()
        
        data = client._encode_deregister_mcp_server_data()
        
        assert isinstance(data, bytes)
        assert len(data) == 1  # Only discriminator
        assert data[0] == 1  # Deregister instruction

    @pytest.mark.asyncio
    async def test_deserialize_agent_account_success(self):
        """Test successful agent account deserialization."""
        client = SolanaAIRegistriesClient()
        
        # Mock account data (simplified)
        account_data = b'\x00' * 300  # Placeholder data
        
        result = await client.deserialize_agent_account(account_data)
        
        assert isinstance(result, dict)
        assert 'agent_id' in result
        assert 'name' in result
        assert 'owner' in result

    @pytest.mark.asyncio
    async def test_deserialize_agent_account_invalid_data(self):
        """Test agent account deserialization with invalid data."""
        client = SolanaAIRegistriesClient()
        
        # Too short data
        account_data = b'\x00' * 10
        
        with pytest.raises(ValueError):
            await client.deserialize_agent_account(account_data)

    @pytest.mark.asyncio
    async def test_deserialize_mcp_server_account_success(self):
        """Test successful MCP server account deserialization."""
        client = SolanaAIRegistriesClient()
        
        # Mock account data (simplified)
        account_data = b'\x00' * 400  # Placeholder data
        
        result = await client.deserialize_mcp_server_account(account_data)
        
        assert isinstance(result, dict)
        assert 'server_id' in result
        assert 'name' in result
        assert 'owner' in result

    @pytest.mark.asyncio
    async def test_deserialize_mcp_server_account_invalid_data(self):
        """Test MCP server account deserialization with invalid data."""
        client = SolanaAIRegistriesClient()
        
        # Too short data
        account_data = b'\x00' * 10
        
        with pytest.raises(ValueError):
            await client.deserialize_mcp_server_account(account_data)