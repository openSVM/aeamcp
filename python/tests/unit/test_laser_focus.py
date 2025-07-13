"""
Laser-focused tests to reach 95% coverage by targeting specific missing lines.
"""

import pytest
from decimal import Decimal
from solders.keypair import Keypair
from solders.pubkey import Pubkey


class TestDirectLineCoverage:
    """Tests that directly target specific missing lines."""

    def test_mcp_server_all_optional_fields(self):
        """Test McpServerRegistryEntry with ALL optional fields to hit missing lines."""
        from solana_ai_registries.types import McpServerRegistryEntry, McpServerStatus
        
        # This will hit lines 350, 354, 359, 371 in types.py
        server = McpServerRegistryEntry(
            server_id="test_server",
            name="Test Server",
            server_version="1.0.0", 
            endpoint_url="https://test.com",
            owner=str(Pubkey.default()),
            status=McpServerStatus.ACTIVE,
            description="Test description",  # Line 348
            capabilities_summary="Test capabilities",  # Line 350-352
            full_capabilities_uri="https://capabilities.com",  # Line 354-359
            metadata_uri="https://metadata.com",  # Line 361-366
            tags=["tag1", "tag2"]  # Line 371
        )
        
        assert server.capabilities_summary == "Test capabilities"
        assert server.full_capabilities_uri == "https://capabilities.com"
        assert server.metadata_uri == "https://metadata.com"
        assert len(server.tags) == 2

    def test_all_exception_str_methods(self):
        """Test __str__ methods of all exceptions."""
        from solana_ai_registries.exceptions import (
            SolanaAIRegistriesError, ValidationError, ConnectionError,
            InvalidPublicKeyError, InvalidInputError, RegistrationError,
            AgentNotFoundError, AgentExistsError, McpServerNotFoundError,
            McpServerExistsError, PaymentError, IDLError, TransactionError,
            InsufficientFundsError, AccountNotFoundError, IdlLoadError,
            ConfigurationError
        )
        
        # Test all exception string representations to hit missing lines
        errors = [
            SolanaAIRegistriesError("base error"),
            ValidationError("field", "value", "constraint"),  # Fixed order
            ConnectionError("connection failed"),
            InvalidPublicKeyError("invalid pubkey"),
            InvalidInputError("field", "constraint", "value"),
            RegistrationError("registration failed"),
            AgentNotFoundError("agent_id", "owner"),
            AgentExistsError("agent_id", "owner"),
            McpServerNotFoundError("server_id", "owner"),
            McpServerExistsError("server_id", "owner"),
            PaymentError("payment failed"),
            IDLError("idl error"),
            TransactionError("tx error", "signature"),
            InsufficientFundsError(1000, 500, "token_mint"),
            AccountNotFoundError("account", "not found"),
            IdlLoadError("program_name", "load error"),
            ConfigurationError("setting", "config error", "expected value")
        ]
        
        # Call str() on each to exercise __str__ methods
        for error in errors:
            str_repr = str(error)
            assert isinstance(str_repr, str)
            assert len(str_repr) > 0

    def test_all_exception_details_properties(self):
        """Test details properties of exceptions."""
        from solana_ai_registries.exceptions import (
            InvalidInputError, InsufficientFundsError, TransactionError,
            AgentNotFoundError, AgentExistsError, McpServerNotFoundError,
            McpServerExistsError, AccountNotFoundError
        )
        
        # Test InvalidInputError details
        error = InvalidInputError("test_field", "test_constraint", "test_value")
        details = error.details
        assert "field" in details
        assert "constraint" in details
        assert "value" in details
        
        # Test InsufficientFundsError details
        error = InsufficientFundsError(1000, 500, "mint")
        details = error.details
        assert "required" in details
        assert "available" in details
        assert "token_mint" in details
        
        # Test TransactionError details
        error = TransactionError("error message", "sig123")
        details = error.details
        assert "signature" in details
        assert details["signature"] == "sig123"
        
        # Test other error details
        for error_class, args in [
            (AgentNotFoundError, ("agent1", "owner1")),
            (AgentExistsError, ("agent1", "owner1")),
            (McpServerNotFoundError, ("server1", "owner1")),
            (McpServerExistsError, ("server1", "owner1")),
            (AccountNotFoundError, ("account1", "message1"))
        ]:
            error = error_class(*args)
            details = error.details
            assert isinstance(details, dict)

    def test_constant_edge_cases_comprehensive(self):
        """Test all edge cases in constants module."""
        from solana_ai_registries.constants import (
            a2ampl_to_base_units, base_units_to_a2ampl,
            get_token_mint_for_cluster, validate_string_length, validate_url
        )
        
        # Test conversion functions with various inputs
        assert a2ampl_to_base_units(0.0) == 0
        assert a2ampl_to_base_units(1.0) == 1000000000
        assert a2ampl_to_base_units(0.000000001) == 1
        
        assert base_units_to_a2ampl(0) == 0.0
        assert base_units_to_a2ampl(1000000000) == 1.0
        assert base_units_to_a2ampl(1) == 0.000000001
        
        # Test cluster function with valid clusters only
        for cluster in ["devnet", "testnet", "mainnet-beta"]:
            mint = get_token_mint_for_cluster(cluster)
            assert isinstance(mint, str)
            assert len(mint) > 0
            
        # Test unknown cluster (should raise error)  
        with pytest.raises(ValueError, match="Unsupported cluster"):
            get_token_mint_for_cluster("unknown")
        
        # Test string validation edge cases
        validate_string_length("", 10, "empty")  # Empty string
        validate_string_length("test", 10, "normal")  # Normal string
        
        with pytest.raises(Exception):
            validate_string_length("a" * 100, 5, "too_long")
        
        # Test URL validation with all supported protocols
        valid_urls = [
            "https://example.com",
            "http://example.com", 
            "ipfs://QmHash",
            "ar://ArweaveHash",
            "https://",  # Minimal
            "http://",   # Minimal
        ]
        
        for url in valid_urls:
            validate_url(url, "test_url")
        
        # Test invalid URL
        with pytest.raises(Exception):
            validate_url("ftp://invalid.com", "test_url")

    def test_all_enum_values_comprehensive(self):
        """Test all enum values to ensure complete coverage."""
        from solana_ai_registries.types import (
            AgentStatus, McpServerStatus, PaymentType, PaymentStatus, StakingTier
        )
        
        # Test every enum value
        agent_statuses = [AgentStatus.PENDING, AgentStatus.ACTIVE, AgentStatus.INACTIVE, AgentStatus.DEREGISTERED]
        mcp_statuses = [McpServerStatus.PENDING, McpServerStatus.ACTIVE, McpServerStatus.INACTIVE, McpServerStatus.DEREGISTERED]
        payment_types = [PaymentType.PREPAY, PaymentType.PAY_AS_YOU_GO, PaymentType.PAY_PER_USAGE, PaymentType.STREAM]
        payment_statuses = [PaymentStatus.PENDING, PaymentStatus.COMPLETED, PaymentStatus.FAILED, PaymentStatus.CANCELLED]
        staking_tiers = [StakingTier.BRONZE, StakingTier.SILVER, StakingTier.GOLD, StakingTier.PLATINUM]
        
        # Access all values to ensure coverage
        for status in agent_statuses:
            assert isinstance(status.value, int)
        
        for status in mcp_statuses:
            assert isinstance(status.value, int)
            
        for ptype in payment_types:
            assert isinstance(ptype.value, str)
            
        for pstatus in payment_statuses:
            assert isinstance(pstatus.value, int)
            
        for tier in staking_tiers:
            assert isinstance(tier.value, str)

    def test_complete_data_type_validation(self):
        """Test complete validation in all data types."""
        from solana_ai_registries.types import (
            ServiceEndpoint, AgentSkill, McpTool, McpResource, McpPrompt,
            AgentRegistryEntry, AgentStatus, McpServerRegistryEntry, McpServerStatus
        )
        
        # Test ServiceEndpoint with all fields and validations
        endpoint = ServiceEndpoint(
            url="https://api.example.com/v1",
            protocol="https",  # Will be overridden by auto-detection
            description="A" * 512,  # Max length
            auth_type="bearer",
            auth_config={"token": "secret"}
        )
        assert endpoint.protocol == "https"
        assert len(endpoint.description) == 512
        
        # Test AgentSkill with all fields
        skill = AgentSkill(
            skill_id="a" * 64,  # Max length
            name="b" * 128,     # Max length
            description="c" * 256,  # Max length  
            category="d" * 64,  # Max length
            tags=["tag1", "tag2", "tag3", "tag4", "tag5"],  # Max 5 tags
            metadata={"key": "value"}
        )
        assert len(skill.skill_id) == 64
        assert len(skill.tags) == 5
        
        # Test MCP components with max validations
        tool = McpTool(
            name="e" * 64,  # Max length
            description="Tool description",
            tags=["t1", "t2", "t3"],  # Max 3 tags
            input_schema="{}",
            output_schema="{}"
        )
        assert len(tool.tags) == 3
        
        resource = McpResource(
            uri_pattern="f" * 128,  # Max length
            name="Resource name",
            description="Resource description", 
            tags=["r1", "r2", "r3"]  # Max 3 tags
        )
        assert len(resource.tags) == 3
        
        prompt = McpPrompt(
            name="g" * 64,  # Max length
            description="Prompt description",
            tags=["p1", "p2", "p3"]  # Max 3 tags
        )
        assert len(prompt.tags) == 3
        
        # Test AgentRegistryEntry with maximum everything
        agent = AgentRegistryEntry(
            agent_id="h" * 32,  # Max agent ID length
            name="i" * 64,     # Max name length
            description="j" * 256,  # Max description length
            agent_version="1.0.0",
            owner=str(Pubkey.default()),
            status=AgentStatus.ACTIVE,
            provider_name="k" * 128,  # Max provider name
            provider_url="https://provider.example.com",
            documentation_url="https://docs.example.com",
            service_endpoints=[endpoint, endpoint, endpoint],  # Max 3 endpoints
            skills=[skill] * 10,  # Max 10 skills
            tags=["tag"] * 10,  # Max 10 tags
            security_info_uri="https://security.example.com",
            aea_address="aea_address",
            economic_intent_summary="Economic summary",
            extended_metadata_uri="https://metadata.example.com"
        )
        assert len(agent.service_endpoints) == 3
        assert len(agent.skills) == 10
        assert len(agent.tags) == 10

    def test_error_boundary_conditions(self):
        """Test boundary conditions that trigger errors."""
        from solana_ai_registries.types import (
            ServiceEndpoint, AgentSkill, McpTool, McpResource, McpPrompt,
            AgentRegistryEntry, AgentStatus
        )
        
        # Test too many service endpoints
        with pytest.raises(ValueError, match="Maximum 3 service endpoints"):
            AgentRegistryEntry(
                agent_id="test",
                name="Test", 
                description="Test",
                agent_version="1.0",
                owner=str(Pubkey.default()),
                status=AgentStatus.ACTIVE,
                service_endpoints=[ServiceEndpoint(url="https://test.com")] * 4
            )
        
        # Test too many skills
        with pytest.raises(ValueError, match="Maximum 10 skills"):
            AgentRegistryEntry(
                agent_id="test",
                name="Test",
                description="Test", 
                agent_version="1.0",
                owner=str(Pubkey.default()),
                status=AgentStatus.ACTIVE,
                skills=[AgentSkill(skill_id="s", name="skill")] * 11
            )
        
        # Test too many agent tags
        with pytest.raises(ValueError, match="Maximum 10 tags"):
            AgentRegistryEntry(
                agent_id="test",
                name="Test",
                description="Test",
                agent_version="1.0", 
                owner=str(Pubkey.default()),
                status=AgentStatus.ACTIVE,
                tags=["tag"] * 11
            )
        
        # Test too many skill tags
        with pytest.raises(ValueError, match="Maximum 5 tags"):
            AgentSkill(
                skill_id="test",
                name="Test Skill",
                tags=["tag"] * 6
            )
        
        # Test too many tool tags
        with pytest.raises(ValueError, match="Maximum 3 tags"):
            McpTool(name="test", tags=["tag"] * 4)
        
        # Test too many resource tags  
        with pytest.raises(ValueError, match="Maximum 3 tags"):
            McpResource(uri_pattern="test/*", tags=["tag"] * 4)
        
        # Test too many prompt tags
        with pytest.raises(ValueError, match="Maximum 3 tags"):
            McpPrompt(name="test", tags=["tag"] * 4)

    def test_from_account_data_comprehensive(self):
        """Test from_account_data methods with comprehensive data."""
        from solana_ai_registries.types import (
            AgentRegistryEntry, McpServerRegistryEntry, McpCapabilities,
            McpTool, McpResource, McpPrompt
        )
        
        # Test AgentRegistryEntry.from_account_data with complete data
        agent_data = {
            "agent_id": "comprehensive_agent",
            "name": "Comprehensive Test Agent", 
            "description": "A fully featured test agent",
            "agent_version": "2.0.0",
            "owner": str(Pubkey.default()),
            "status": 1,  # ACTIVE
            "provider_name": "Test Provider Inc",
            "provider_url": "https://testprovider.com",
            "documentation_url": "https://docs.testprovider.com",
            "service_endpoints": [
                {
                    "url": "https://api.testprovider.com",
                    "protocol": "https",
                    "description": "Main API endpoint",
                    "auth_type": "api_key",
                    "auth_config": {"key": "secret"}
                },
                {
                    "url": "https://backup.testprovider.com", 
                    "description": "Backup endpoint"
                }
            ],
            "capabilities_flags": 123,
            "supported_input_modes": ["text", "voice"],
            "supported_output_modes": ["text", "image"],
            "skills": [
                {
                    "skill_id": "nlp_processing",
                    "name": "Natural Language Processing",
                    "description": "Advanced NLP capabilities",
                    "category": "language",
                    "tags": ["nlp", "text", "ai"],
                    "metadata": {"version": "1.0"}
                },
                {
                    "skill_id": "image_gen", 
                    "name": "Image Generation"
                }
            ],
            "security_info_uri": "https://security.testprovider.com",
            "aea_address": "aea_test_address",
            "economic_intent_summary": "Provides AI services for compensation",
            "supported_aea_protocols_hash": b"protocol_hash_bytes",
            "extended_metadata_uri": "https://metadata.testprovider.com",
            "tags": ["ai", "nlp", "image", "premium"],
            "created_at": 1640995200,
            "updated_at": 1640995300,
            "state_version": 2
        }
        
        agent = AgentRegistryEntry.from_account_data(agent_data)
        assert agent.provider_name == "Test Provider Inc"
        assert len(agent.service_endpoints) == 2
        assert len(agent.skills) == 2
        assert agent.skills[0].description == "Advanced NLP capabilities"
        assert agent.skills[0].category == "language"
        assert len(agent.tags) == 4
        
        # Test McpServerRegistryEntry.from_account_data with capabilities
        server_data = {
            "server_id": "comprehensive_server",
            "name": "Comprehensive MCP Server",
            "server_version": "3.0.0",
            "endpoint_url": "https://mcp.testprovider.com",
            "owner": str(Pubkey.default()),
            "status": 1,  # ACTIVE
            "description": "A comprehensive MCP server with all features",
            "capabilities_summary": "Full MCP capabilities with tools, resources, and prompts",
            "capabilities": {
                "supports_tools": True,
                "supports_resources": True, 
                "supports_prompts": True,
                "tool_count": 2,
                "resource_count": 1,
                "prompt_count": 1,
                "tools": [
                    {
                        "name": "calculate",
                        "description": "Mathematical calculator",
                        "tags": ["math", "utility"],
                        "input_schema": '{"type": "number"}',
                        "output_schema": '{"type": "number"}'
                    },
                    {
                        "name": "search",
                        "description": "Web search tool"
                    }
                ],
                "resources": [
                    {
                        "uri_pattern": "data://*",
                        "name": "Data Resource",
                        "description": "Access to data files",
                        "tags": ["data"]
                    }
                ],
                "prompts": [
                    {
                        "name": "summarize",
                        "description": "Text summarization prompt",
                        "tags": ["text"]
                    }
                ]
            },
            "full_capabilities_uri": "https://capabilities.testprovider.com",
            "metadata_uri": "https://mcp-metadata.testprovider.com",
            "tags": ["mcp", "tools", "comprehensive"],
            "created_at": 1640995400,
            "updated_at": 1640995500,
            "state_version": 3
        }
        
        server = McpServerRegistryEntry.from_account_data(server_data)
        assert server.description == "A comprehensive MCP server with all features"
        assert server.capabilities_summary == "Full MCP capabilities with tools, resources, and prompts"
        assert server.capabilities.supports_tools is True
        assert server.capabilities.tool_count == 2
        assert len(server.capabilities.tools) == 2
        assert len(server.capabilities.resources) == 1
        assert len(server.capabilities.prompts) == 1
        assert server.full_capabilities_uri == "https://capabilities.testprovider.com"
        assert server.metadata_uri == "https://mcp-metadata.testprovider.com"
        assert len(server.tags) == 3