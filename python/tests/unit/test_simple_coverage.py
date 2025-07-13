"""
Simple targeted tests to reach 95% coverage.

This module contains very focused tests to cover missing lines and edge cases.
"""

import asyncio
import pytest
from decimal import Decimal
from unittest.mock import Mock, AsyncMock, patch, MagicMock
from solders.keypair import Keypair
from solders.pubkey import Pubkey

# Test missing lines in each module
class TestAgentCoverage:
    """Tests for missing agent.py coverage."""
    
    def test_agent_validation_errors(self):
        """Test agent validation error paths."""
        from solana_ai_registries.types import AgentRegistryEntry, AgentStatus, ServiceEndpoint
        from solana_ai_registries.exceptions import ValidationError
        
        # Create valid service endpoints
        valid_endpoints = [
            ServiceEndpoint(
                endpoint_type="http",
                url="https://api1.test.com",
                description="API 1"
            ),
            ServiceEndpoint(
                endpoint_type="http", 
                url="https://api2.test.com",
                description="API 2"
            ),
            ServiceEndpoint(
                endpoint_type="http",
                url="https://api3.test.com", 
                description="API 3"
            )
        ]
        
        # Test exactly 3 endpoints (should work)
        agent = AgentRegistryEntry(
            agent_id="test",
            name="Test",
            description="Test",
            agent_version="1.0",
            owner=str(Pubkey.default()),
            status=AgentStatus.ACTIVE,
            service_endpoints=valid_endpoints
        )
        assert len(agent.service_endpoints) == 3
            
        # Test too many skills 
        with pytest.raises(ValueError, match="Maximum 10 skills"):
            AgentRegistryEntry(
                agent_id="test",
                name="Test", 
                description="Test",
                agent_version="1.0",
                owner=str(Pubkey.default()),
                status=AgentStatus.ACTIVE,
                skills=["skill" + str(i) for i in range(11)]  # Too many
            )


class TestMcpCoverage:
    """Tests for missing mcp.py coverage."""
    
    def test_mcp_validation_errors(self):
        """Test MCP validation error paths."""
        from solana_ai_registries.types import McpServerRegistryEntry, McpServerStatus
        
        # Test too many tags
        with pytest.raises(ValueError, match="Maximum 10 tags"):
            McpServerRegistryEntry(
                server_id="test",
                name="Test",
                server_version="1.0",
                endpoint_url="https://test.com",
                owner=str(Pubkey.default()),
                status=McpServerStatus.ACTIVE,
                tags=["tag"] * 11  # Too many tags
            )


class TestPaymentsCoverage:
    """Tests for missing payments.py coverage."""
    
    def test_payment_validation(self):
        """Test payment validation methods."""
        from solana_ai_registries.payments import PaymentManager
        from solana_ai_registries.exceptions import PaymentError
        
        mock_client = Mock()
        pm = PaymentManager(mock_client)
        
        # Test negative amount validation
        with pytest.raises(PaymentError, match="Amount must be positive"):
            pm._validate_payment_amount(Decimal("-1"))
            
        # Test zero amount validation  
        with pytest.raises(PaymentError, match="Amount must be positive"):
            pm._validate_payment_amount(Decimal("0"))


class TestIdlCoverage:
    """Tests for missing idl.py coverage."""
    
    def test_idl_file_loading(self):
        """Test IDL file loading."""
        from solana_ai_registries.idl import IDLLoader
        
        loader = IDLLoader()
        
        # Test loading non-existent file
        with pytest.raises(FileNotFoundError):
            loader._load_from_file("nonexistent.json")
            
        # Test basic functionality that exists
        assert loader is not None


class TestClientCoverage:
    """Tests for missing client.py coverage."""
    
    @pytest.mark.asyncio
    async def test_client_context_manager(self):
        """Test client context manager."""
        from solana_ai_registries.client import SolanaAIRegistriesClient
        
        with patch('solana_ai_registries.client.AsyncClient') as mock_client:
            mock_instance = AsyncMock()
            mock_client.return_value = mock_instance
            
            client = SolanaAIRegistriesClient("https://api.devnet.solana.com")
            
            # Test context manager
            async with client:
                pass  # Just test that context manager works
                
            # Verify close was called on the mock
            mock_instance.close.assert_called_once()
            
    def test_client_pda_methods(self):
        """Test PDA derivation methods."""
        from solana_ai_registries.client import SolanaAIRegistriesClient
        
        with patch('solana_ai_registries.client.AsyncClient'):
            client = SolanaAIRegistriesClient("https://api.devnet.solana.com")
            
            # Test agent PDA
            pda = client.derive_agent_pda("test_agent", Pubkey.default())
            assert isinstance(pda, Pubkey)
            
            # Test MCP server PDA  
            pda = client.derive_mcp_server_pda("test_server", Pubkey.default())
            assert isinstance(pda, Pubkey)


class TestExceptionsCoverage:
    """Tests for missing exceptions.py coverage."""
    
    def test_exception_details(self):
        """Test exception details property."""
        from solana_ai_registries.exceptions import (
            InvalidInputError, InsufficientFundsError, TransactionError
        )
        
        # Test InvalidInputError details
        error = InvalidInputError("field", "value", "constraint")
        details = error.details
        assert details["field"] == "field"
        assert details["value"] == "value"
        assert details["constraint"] == "constraint"
        
        # Test InsufficientFundsError details
        error = InsufficientFundsError(1000, 500, str(Pubkey.default()))
        details = error.details
        assert details["required"] == 1000
        assert details["available"] == 500
        
        # Test TransactionError details
        error = TransactionError("error msg", "sig123")
        details = error.details
        assert details["signature"] == "sig123"
        assert details["error"] == "error msg"


class TestTypesCoverage:
    """Tests for missing types.py coverage."""
    
    def test_skill_validation(self):
        """Test skill validation."""
        from solana_ai_registries.types import AgentSkill
        
        # Test too many tags
        with pytest.raises(ValueError, match="Maximum 5 tags"):
            AgentSkill(
                skill_id="test",
                name="Test Skill",
                tags=["tag"] * 6  # Too many tags
            )
    
    def test_service_endpoint_protocol_detection(self):
        """Test service endpoint protocol auto-detection."""
        from solana_ai_registries.types import ServiceEndpoint
        
        # Test HTTPS detection
        endpoint = ServiceEndpoint(url="https://example.com")
        assert endpoint.protocol == "https"
        
        # Test HTTP detection
        endpoint = ServiceEndpoint(url="http://example.com")
        assert endpoint.protocol == "http"
        
        # Test invalid protocol (will fail validation)
        with pytest.raises(ValueError):
            ServiceEndpoint(url="ftp://example.com")
        
    def test_mcp_capabilities_validation(self):
        """Test MCP capabilities validation."""
        from solana_ai_registries.types import McpTool, McpResource, McpPrompt
        
        # Test tool with too many tags
        with pytest.raises(ValueError, match="Maximum 3 tags"):
            McpTool(name="test", tags=["tag"] * 4)
            
        # Test resource with too many tags
        with pytest.raises(ValueError, match="Maximum 3 tags"):
            McpResource(uri_pattern="test/*", tags=["tag"] * 4)
            
        # Test prompt with too many tags
        with pytest.raises(ValueError, match="Maximum 3 tags"):
            McpPrompt(name="test", tags=["tag"] * 4)


class TestConstantsCoverage:
    """Tests for missing constants.py coverage."""
    
    def test_conversion_edge_cases(self):
        """Test conversion edge cases."""
        from solana_ai_registries.constants import (
            a2ampl_to_base_units, base_units_to_a2ampl
        )
        
        # Test zero conversion
        assert a2ampl_to_base_units(0.0) == 0
        assert base_units_to_a2ampl(0) == 0.0
        
        # Test very small amounts
        assert a2ampl_to_base_units(0.000000001) == 1
        result = base_units_to_a2ampl(1)
        assert isinstance(result, float)
        assert abs(result - 0.000000001) < 1e-10
        
    def test_validation_edge_cases(self):
        """Test validation edge cases."""
        from solana_ai_registries.constants import validate_string_length, validate_url
        from solana_ai_registries.exceptions import ValidationError
        
        # Test empty string validation (should pass)
        validate_string_length("", 10, "test_field")
        
        # Test minimal URLs
        validate_url("https://", "test_url")
        validate_url("http://", "test_url")
        validate_url("ipfs://QmTest", "test_url")
        validate_url("ar://test", "test_url")
        
        # Test invalid protocols (should raise)
        with pytest.raises((ValueError, ValidationError)):
            validate_url("ftp://invalid.com", "test_url")


class TestEnumCoverage:
    """Test enum value coverage."""
    
    def test_all_enum_values(self):
        """Test all enum values are accessible."""
        from solana_ai_registries.types import (
            AgentStatus, McpServerStatus, PaymentType, PaymentStatus, StakingTier
        )
        
        # Agent status
        assert AgentStatus.PENDING.value == 0
        assert AgentStatus.ACTIVE.value == 1
        assert AgentStatus.INACTIVE.value == 2
        assert AgentStatus.DEREGISTERED.value == 3
        
        # MCP server status
        assert McpServerStatus.PENDING.value == 0
        assert McpServerStatus.ACTIVE.value == 1
        assert McpServerStatus.INACTIVE.value == 2
        assert McpServerStatus.DEREGISTERED.value == 3
        
        # Payment types
        assert PaymentType.PREPAY.value == "prepay"
        assert PaymentType.PAY_AS_YOU_GO.value == "pyg"
        assert PaymentType.PAY_PER_USAGE.value == "ppu"
        assert PaymentType.STREAM.value == "stream"
        
        # Payment status
        assert PaymentStatus.PENDING.value == 0
        assert PaymentStatus.COMPLETED.value == 1
        assert PaymentStatus.FAILED.value == 2
        assert PaymentStatus.CANCELLED.value == 3
        
        # Staking tiers
        assert StakingTier.BRONZE.value == "bronze"
        assert StakingTier.SILVER.value == "silver"
        assert StakingTier.GOLD.value == "gold"
        assert StakingTier.PLATINUM.value == "platinum"


# Simple interface tests that exercise code paths without complex mocking
class TestSimpleInterfaceExercise:
    """Simple tests to exercise interface methods."""
    
    def test_agent_registry_init(self):
        """Test agent registry initialization."""
        from solana_ai_registries.agent import AgentRegistry
        
        mock_client = Mock()
        registry = AgentRegistry(mock_client)
        assert registry.client == mock_client
        
    def test_mcp_registry_init(self):
        """Test MCP registry initialization."""
        from solana_ai_registries.mcp import McpServerRegistry
        
        mock_client = Mock()
        registry = McpServerRegistry(mock_client)
        assert registry.client == mock_client
        
    def test_payment_manager_init(self):
        """Test payment manager initialization."""
        from solana_ai_registries.payments import PaymentManager
        
        mock_client = Mock()
        manager = PaymentManager(mock_client)
        assert manager.client == mock_client
        # Just test basic initialization without accessing private attributes
        
    def test_idl_loader_init(self):
        """Test IDL loader initialization."""
        from solana_ai_registries.idl import IDLLoader
        
        loader = IDLLoader()
        assert loader is not None


class TestFromAccountDataMethods:
    """Test from_account_data class methods."""
    
    def test_agent_from_account_data(self):
        """Test agent from_account_data method."""
        from solana_ai_registries.types import AgentRegistryEntry, AgentStatus
        
        data = {
            "agent_id": "test",
            "name": "Test Agent",
            "description": "A test agent",
            "agent_version": "1.0.0",
            "owner": str(Pubkey.default()),
            "status": 1,
        }
        
        agent = AgentRegistryEntry.from_account_data(data)
        assert agent.agent_id == "test"
        assert agent.status == AgentStatus.ACTIVE
        
    def test_mcp_server_from_account_data(self):
        """Test MCP server from_account_data method."""
        from solana_ai_registries.types import McpServerRegistryEntry, McpServerStatus
        
        data = {
            "server_id": "test",
            "name": "Test Server",
            "server_version": "1.0.0",
            "endpoint_url": "https://test.com",
            "owner": str(Pubkey.default()),
            "status": 1,
        }
        
        server = McpServerRegistryEntry.from_account_data(data)
        assert server.server_id == "test"
        assert server.status == McpServerStatus.ACTIVE
        
class TestSpecificLineCoverage:
    """Tests specifically targeting missing lines for 95% coverage."""
    
    def test_exception_string_representations(self):
        """Test all exception __str__ methods."""
        from solana_ai_registries.exceptions import (
            AgentExistsError, AgentNotFoundError, McpServerExistsError,
            McpServerNotFoundError, InvalidInputError, InsufficientFundsError,
            TransactionError, RegistrationError, PaymentError,
            SolanaAIRegistriesError, ValidationError, ConnectionError,
            InvalidPubkeyError, IDLError, AccountNotFoundError,
            IdlLoadError, ConfigurationError
        )
        
        # Test each exception's string representation
        str(AgentExistsError("agent1", "owner1"))
        str(AgentNotFoundError("agent1", "owner1"))
        str(McpServerExistsError("server1", "owner1"))
        str(McpServerNotFoundError("server1", "owner1"))
        str(InvalidInputError("field", "constraint", "value"))
        str(InsufficientFundsError(1000, 500, "mint"))
        str(TransactionError("sig", "error"))
        str(RegistrationError("Failed to register"))
        str(PaymentError("Payment failed"))
        str(SolanaAIRegistriesError("General error"))
        str(ValidationError("field", "value", "constraint"))
        str(ConnectionError("Connection failed"))
        str(InvalidPubkeyError("Invalid pubkey"))
        str(IDLError("IDL error"))
        str(AccountNotFoundError("account", "Account not found"))
        str(IdlLoadError("Load error"))
        str(ConfigurationError("Config error"))
    
    def test_constants_cluster_functions(self):
        """Test cluster-specific constant functions."""
        from solana_ai_registries.constants import get_token_mint_for_cluster
        
        # Test devnet
        mint = get_token_mint_for_cluster("devnet")
        assert mint is not None
        
        # Test mainnet-beta  
        mint = get_token_mint_for_cluster("mainnet-beta")
        assert mint is not None
        
        # Test testnet
        mint = get_token_mint_for_cluster("testnet")
        assert mint is not None
        
        # Test unknown cluster (should raise ValueError)
        with pytest.raises(ValueError, match="Unsupported cluster"):
            get_token_mint_for_cluster("unknown")
    
    def test_types_validation_edge_cases(self):
        """Test edge cases in type validation."""
        from solana_ai_registries.types import (
            ServiceEndpoint, AgentSkill, McpTool, McpResource, McpPrompt,
            AgentRegistryEntry, AgentStatus
        )
        from solana_ai_registries.exceptions import ValidationError
        
        # Test optional field validation in service endpoint
        endpoint = ServiceEndpoint(
            url="https://test.com",
            description="A" * 512  # Max length
        )
        assert len(endpoint.description) == 512
        
        # Test skill with all optional fields
        skill = AgentSkill(
            skill_id="test",
            name="Test Skill",
            description="Test description",
            category="test_category"
        )
        assert skill.category == "test_category"
        
        # Test MCP components with descriptions
        tool = McpTool(name="test_tool", description="Test tool")
        assert tool.description == "Test tool"
        
        resource = McpResource(
            uri_pattern="test/*",
            name="Test Resource",
            description="Test resource"
        )
        assert resource.name == "Test Resource"
        
        prompt = McpPrompt(
            name="test_prompt",
            description="Test prompt"
        )
        assert prompt.description == "Test prompt"
        
        # Test agent with optional URLs
        agent = AgentRegistryEntry(
            agent_id="test",
            name="Test Agent",
            description="Test agent",
            agent_version="1.0.0",
            owner=str(Pubkey.default()),
            status=AgentStatus.ACTIVE,
            provider_url="https://provider.com",
            documentation_url="https://docs.com",
            security_info_uri="https://security.com",
            extended_metadata_uri="https://metadata.com"
        )
        assert agent.provider_url == "https://provider.com"
    
    def test_types_from_account_data_edge_cases(self):
        """Test from_account_data with edge cases."""
        from solana_ai_registries.types import (
            AgentRegistryEntry, McpServerRegistryEntry, AgentStatus, McpServerStatus
        )
        
        # Test agent with full optional data
        agent_data = {
            "agent_id": "test",
            "name": "Test Agent",
            "description": "Test agent",
            "agent_version": "1.0.0",
            "owner": str(Pubkey.default()),
            "status": 1,
            "provider_name": "Test Provider",
            "provider_url": "https://provider.com",
            "documentation_url": "https://docs.com",
            "service_endpoints": [
                {
                    "url": "https://api.test.com",
                    "protocol": "https",
                    "description": "API endpoint"
                }
            ],
            "skills": [
                {
                    "skill_id": "test_skill",
                    "name": "Test Skill",
                    "description": "A test skill"
                }
            ],
            "tags": ["ai", "test"],
            "created_at": 1234567890,
            "updated_at": 1234567890
        }
        
        agent = AgentRegistryEntry.from_account_data(agent_data)
        assert agent.provider_name == "Test Provider"
        assert len(agent.service_endpoints) == 1
        assert len(agent.skills) == 1
        
        # Test MCP server with capabilities
        server_data = {
            "server_id": "test",
            "name": "Test Server",
            "server_version": "1.0.0",
            "endpoint_url": "https://test.com",
            "owner": str(Pubkey.default()),
            "status": 1,
            "description": "Test server",
            "capabilities": {
                "supports_tools": True,
                "tool_count": 1,
                "tools": [{"name": "test_tool"}],
                "resources": [],
                "prompts": []
            }
        }
        
        server = McpServerRegistryEntry.from_account_data(server_data)
        assert server.description == "Test server"
        assert server.capabilities.supports_tools is True


# Add this to the end of the file