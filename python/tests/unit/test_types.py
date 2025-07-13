"""Test suite for data types and structures."""

import pytest
from solana_ai_registries.types import (
    AgentRegistryEntry,
    AgentSkill,
    AgentStatus,
    McpCapabilities,
    McpPrompt,
    McpResource,
    McpServerRegistryEntry,
    McpServerStatus,
    McpTool,
    PaymentType,
    ServiceEndpoint,
    StakingTier,
)


class TestEnums:
    """Test enum classes."""

    def test_agent_status_values(self) -> None:
        """Test AgentStatus enum values."""
        assert AgentStatus.PENDING.value == 0
        assert AgentStatus.ACTIVE.value == 1
        assert AgentStatus.INACTIVE.value == 2
        assert AgentStatus.DEREGISTERED.value == 3

    def test_mcp_server_status_values(self) -> None:
        """Test McpServerStatus enum values."""
        assert McpServerStatus.PENDING.value == 0
        assert McpServerStatus.ACTIVE.value == 1
        assert McpServerStatus.INACTIVE.value == 2
        assert McpServerStatus.DEREGISTERED.value == 3

    def test_payment_type_values(self) -> None:
        """Test PaymentType enum values."""
        assert PaymentType.PREPAY.value == "prepay"
        assert PaymentType.PAY_AS_YOU_GO.value == "pyg"
        assert PaymentType.STREAM.value == "stream"

    def test_staking_tier_values(self) -> None:
        """Test StakingTier enum values."""
        assert StakingTier.BRONZE.value == "bronze"
        assert StakingTier.SILVER.value == "silver"
        assert StakingTier.GOLD.value == "gold"
        assert StakingTier.PLATINUM.value == "platinum"


class TestServiceEndpoint:
    """Test ServiceEndpoint dataclass."""

    def test_valid_endpoint(self) -> None:
        """Test creating a valid service endpoint."""
        endpoint = ServiceEndpoint(
            protocol="https",
            url="https://api.example.com/v1",
            description="Test API endpoint"
        )
        assert endpoint.protocol == "https"
        assert endpoint.url == "https://api.example.com/v1"
        assert endpoint.description == "Test API endpoint"

    def test_endpoint_without_description(self) -> None:
        """Test creating endpoint without description."""
        endpoint = ServiceEndpoint(
            protocol="grpc",
            url="https://grpc.example.com:443"
        )
        assert endpoint.protocol == "grpc"
        assert endpoint.url == "https://grpc.example.com:443"
        assert endpoint.description is None

    def test_protocol_too_long(self) -> None:
        """Test protocol validation - too long."""
        with pytest.raises(ValueError) as exc_info:
            ServiceEndpoint(
                protocol="x" * 65,  # Over 64 chars
                url="https://api.example.com"
            )
        assert "protocol exceeds maximum length" in str(exc_info.value)

    def test_url_too_long(self) -> None:
        """Test URL validation - too long."""
        with pytest.raises(ValueError) as exc_info:
            ServiceEndpoint(
                protocol="https",
                url="https://" + "x" * 250 + ".com"  # Over 256 chars
            )
        assert "endpoint URL exceeds maximum length" in str(exc_info.value)

    def test_invalid_url(self) -> None:
        """Test URL validation - invalid format."""
        with pytest.raises(ValueError) as exc_info:
            ServiceEndpoint(
                protocol="https",
                url="not-a-valid-url"
            )
        assert "endpoint URL must start with one of" in str(exc_info.value)

    def test_description_too_long(self) -> None:
        """Test description validation - too long."""
        with pytest.raises(ValueError) as exc_info:
            ServiceEndpoint(
                protocol="https",
                url="https://api.example.com",
                description="x" * 513  # Over 512 chars
            )
        assert "endpoint description exceeds maximum length" in str(exc_info.value)


class TestAgentSkill:
    """Test AgentSkill dataclass."""

    def test_valid_skill(self) -> None:
        """Test creating a valid agent skill."""
        skill = AgentSkill(
            skill_id="trading",
            name="Trading Agent",
            tags=["finance", "crypto"],
            metadata={"model": "gpt-4"}
        )
        assert skill.skill_id == "trading"
        assert skill.name == "Trading Agent"
        assert skill.tags == ["finance", "crypto"]
        assert skill.metadata == {"model": "gpt-4"}

    def test_skill_without_optional_fields(self) -> None:
        """Test creating skill without optional fields."""
        skill = AgentSkill(
            skill_id="analysis",
            name="Data Analysis"
        )
        assert skill.skill_id == "analysis"
        assert skill.name == "Data Analysis"
        assert skill.tags == []
        assert skill.metadata is None

    def test_skill_id_too_long(self) -> None:
        """Test skill ID validation - too long."""
        with pytest.raises(ValueError) as exc_info:
            AgentSkill(
                skill_id="x" * 65,  # Over 64 chars
                name="Test Skill"
            )
        assert "skill ID exceeds maximum length" in str(exc_info.value)

    def test_skill_name_too_long(self) -> None:
        """Test skill name validation - too long."""
        with pytest.raises(ValueError) as exc_info:
            AgentSkill(
                skill_id="test",
                name="x" * 129  # Over 128 chars
            )
        assert "skill name exceeds maximum length" in str(exc_info.value)

    def test_too_many_tags(self) -> None:
        """Test tag count validation - too many tags."""
        with pytest.raises(ValueError) as exc_info:
            AgentSkill(
                skill_id="test",
                name="Test Skill",
                tags=["tag1", "tag2", "tag3", "tag4", "tag5", "tag6"]  # Over 5 tags
            )
        assert "Maximum 5 tags allowed per skill" in str(exc_info.value)

    def test_tag_too_long(self) -> None:
        """Test individual tag validation - too long."""
        with pytest.raises(ValueError) as exc_info:
            AgentSkill(
                skill_id="test",
                name="Test Skill",
                tags=["x" * 33]  # Over 32 chars
            )
        assert "skill tag exceeds maximum length" in str(exc_info.value)


class TestAgentRegistryEntry:
    """Test AgentRegistryEntry dataclass."""

    def test_minimal_valid_agent(self) -> None:
        """Test creating a minimal valid agent."""
        agent = AgentRegistryEntry(
            agent_id="test_agent",
            name="Test Agent",
            description="A test agent for validation",
            agent_version="1.0.0",
            owner="owner_pubkey_string",
            status=AgentStatus.ACTIVE
        )
        assert agent.agent_id == "test_agent"
        assert agent.name == "Test Agent"
        assert agent.description == "A test agent for validation"
        assert agent.agent_version == "1.0.0"
        assert agent.owner == "owner_pubkey_string"
        assert agent.status == AgentStatus.ACTIVE
        assert agent.service_endpoints == []
        assert agent.skills == []
        assert agent.tags == []

    def test_full_agent(self) -> None:
        """Test creating a fully populated agent."""
        endpoint = ServiceEndpoint("https", "https://api.example.com")
        skill = AgentSkill("trading", "Trading Skill")
        
        agent = AgentRegistryEntry(
            agent_id="full_agent",
            name="Full Agent",
            description="A fully featured agent",
            agent_version="2.0.0",
            owner="owner_pubkey",
            status=AgentStatus.ACTIVE,
            provider_name="Test Provider",
            provider_url="https://provider.example.com",
            documentation_url="https://docs.example.com",
            service_endpoints=[endpoint],
            skills=[skill],
            tags=["ai", "trading"],
            capabilities_flags=7,
        )
        assert agent.provider_name == "Test Provider"
        assert agent.provider_url == "https://provider.example.com"
        assert agent.documentation_url == "https://docs.example.com"
        assert len(agent.service_endpoints) == 1
        assert len(agent.skills) == 1
        assert agent.tags == ["ai", "trading"]

    def test_agent_id_too_long(self) -> None:
        """Test agent ID validation - too long."""
        with pytest.raises(ValueError) as exc_info:
            AgentRegistryEntry(
                agent_id="x" * 65,  # Over 64 chars (MAX_AGENT_ID_LEN)
                name="Test Agent",
                description="Test description",
                agent_version="1.0.0",
                owner="owner",
                status=AgentStatus.ACTIVE
            )
        assert "agent_id exceeds maximum length" in str(exc_info.value)

    def test_agent_name_too_long(self) -> None:
        """Test agent name validation - too long."""
        with pytest.raises(ValueError) as exc_info:
            AgentRegistryEntry(
                agent_id="test",
                name="x" * 129,  # Over 128 chars (MAX_AGENT_NAME_LEN)
                description="Test description",
                agent_version="1.0.0",
                owner="owner",
                status=AgentStatus.ACTIVE
            )
        assert "name exceeds maximum length" in str(exc_info.value)

    def test_too_many_endpoints(self) -> None:
        """Test service endpoints validation - too many."""
        endpoints = [
            ServiceEndpoint("https", "https://api1.example.com"),
            ServiceEndpoint("grpc", "https://api2.example.com"),
            ServiceEndpoint("ws", "https://api3.example.com"),
            ServiceEndpoint("tcp", "https://api4.example.com"),  # 4th endpoint - over limit
        ]
        with pytest.raises(ValueError) as exc_info:
            AgentRegistryEntry(
                agent_id="test",
                name="Test Agent",
                description="Test description",
                agent_version="1.0.0",
                owner="owner",
                status=AgentStatus.ACTIVE,
                service_endpoints=endpoints
            )
        assert "Maximum 3 service endpoints allowed" in str(exc_info.value)

    def test_too_many_skills(self) -> None:
        """Test skills validation - too many."""
        skills = [AgentSkill(f"skill_{i}", f"Skill {i}") for i in range(11)]  # 11 skills - over limit
        with pytest.raises(ValueError) as exc_info:
            AgentRegistryEntry(
                agent_id="test",
                name="Test Agent",
                description="Test description",
                agent_version="1.0.0",
                owner="owner",
                status=AgentStatus.ACTIVE,
                skills=skills
            )
        assert "Maximum 10 skills allowed" in str(exc_info.value)

    def test_too_many_tags(self) -> None:
        """Test tags validation - too many."""
        tags = [f"tag{i}" for i in range(11)]  # 11 tags - over limit
        with pytest.raises(ValueError) as exc_info:
            AgentRegistryEntry(
                agent_id="test",
                name="Test Agent",
                description="Test description",
                agent_version="1.0.0",
                owner="owner",
                status=AgentStatus.ACTIVE,
                tags=tags
            )
        assert "Maximum 10 tags allowed" in str(exc_info.value)

    def test_tag_too_long(self) -> None:
        """Test individual tag validation - too long."""
        with pytest.raises(ValueError) as exc_info:
            AgentRegistryEntry(
                agent_id="test",
                name="Test Agent",
                description="Test description",
                agent_version="1.0.0",
                owner="owner",
                status=AgentStatus.ACTIVE,
                tags=["x" * 33]  # Over 32 chars
            )
        assert "agent tag exceeds maximum length" in str(exc_info.value)

    def test_from_account_data(self) -> None:
        """Test creating agent from account data."""
        data = {
            "agent_id": "test_agent",
            "name": "Test Agent",
            "description": "Test description",
            "agent_version": "1.0.0",
            "owner": "owner_pubkey",
            "status": 1,  # ACTIVE
            "provider_name": "Test Provider",
        }
        agent = AgentRegistryEntry.from_account_data(data)
        assert agent.agent_id == "test_agent"
        assert agent.name == "Test Agent"
        assert agent.status == AgentStatus.ACTIVE
        assert agent.provider_name == "Test Provider"


class TestMcpServerRegistryEntry:
    """Test McpServerRegistryEntry dataclass."""

    def test_minimal_valid_server(self) -> None:
        """Test creating a minimal valid MCP server."""
        server = McpServerRegistryEntry(
            server_id="test_server",
            name="Test Server",
            server_version="1.0.0",
            endpoint_url="https://server.example.com",
            owner="owner_pubkey",
            status=McpServerStatus.ACTIVE
        )
        assert server.server_id == "test_server"
        assert server.name == "Test Server"
        assert server.server_version == "1.0.0"
        assert server.endpoint_url == "https://server.example.com"
        assert server.owner == "owner_pubkey"
        assert server.status == McpServerStatus.ACTIVE

    def test_server_id_too_long(self) -> None:
        """Test server ID validation - too long."""
        with pytest.raises(ValueError) as exc_info:
            McpServerRegistryEntry(
                server_id="x" * 65,  # Over 64 chars (MAX_SERVER_ID_LEN)
                name="Test Server",
                server_version="1.0.0",
                endpoint_url="https://server.example.com",
                owner="owner",
                status=McpServerStatus.ACTIVE
            )
        assert "server_id exceeds maximum length" in str(exc_info.value)

    def test_server_name_too_long(self) -> None:
        """Test server name validation - too long."""
        with pytest.raises(ValueError) as exc_info:
            McpServerRegistryEntry(
                server_id="test",
                name="x" * 129,  # Over 128 chars (MAX_SERVER_NAME_LEN)
                server_version="1.0.0",
                endpoint_url="https://server.example.com",
                owner="owner",
                status=McpServerStatus.ACTIVE
            )
        assert "name exceeds maximum length" in str(exc_info.value)

    def test_invalid_endpoint_url(self) -> None:
        """Test endpoint URL validation - invalid format."""
        with pytest.raises(ValueError) as exc_info:
            McpServerRegistryEntry(
                server_id="test",
                name="Test Server",
                server_version="1.0.0",
                endpoint_url="not-a-valid-url",
                owner="owner",
                status=McpServerStatus.ACTIVE
            )
        assert "endpoint_url must start with one of" in str(exc_info.value)

    def test_from_account_data(self) -> None:
        """Test creating server from account data."""
        data = {
            "server_id": "test_server",
            "name": "Test Server",
            "server_version": "1.0.0",
            "endpoint_url": "https://server.example.com",
            "owner": "owner_pubkey",
            "status": 1,  # ACTIVE
        }
        server = McpServerRegistryEntry.from_account_data(data)
        assert server.server_id == "test_server"
        assert server.name == "Test Server"
        assert server.status == McpServerStatus.ACTIVE
        assert server.endpoint_url == "https://server.example.com"


class TestMcpTool:
    """Test McpTool dataclass."""

    def test_minimal_tool(self) -> None:
        """Test creating a minimal MCP tool."""
        tool = McpTool(name="test_tool")
        assert tool.name == "test_tool"
        assert tool.description is None
        assert tool.tags == []
        assert tool.input_schema is None
        assert tool.output_schema is None

    def test_full_tool(self) -> None:
        """Test creating a full MCP tool."""
        tool = McpTool(
            name="calculator",
            description="Basic math operations",
            tags=["math", "calc"],
            input_schema='{"type": "object"}',
            output_schema='{"type": "number"}'
        )
        assert tool.name == "calculator"
        assert tool.description == "Basic math operations"
        assert tool.tags == ["math", "calc"]
        assert tool.input_schema == '{"type": "object"}'
        assert tool.output_schema == '{"type": "number"}'

    def test_tool_name_too_long(self) -> None:
        """Test tool name validation - too long."""
        with pytest.raises(ValueError) as exc_info:
            McpTool(name="x" * 65)  # Over 64 chars
        assert "tool name exceeds maximum length" in str(exc_info.value)

    def test_too_many_tags(self) -> None:
        """Test tag count validation - too many tags."""
        with pytest.raises(ValueError) as exc_info:
            McpTool(name="test", tags=["tag1", "tag2", "tag3", "tag4"])  # Over 3 tags
        assert "Maximum 3 tags allowed per tool" in str(exc_info.value)

    def test_tag_too_long(self) -> None:
        """Test individual tag validation - too long."""
        with pytest.raises(ValueError) as exc_info:
            McpTool(name="test", tags=["x" * 33])  # Over 32 chars
        assert "tool tag exceeds maximum length" in str(exc_info.value)


class TestMcpResource:
    """Test McpResource dataclass."""

    def test_minimal_resource(self) -> None:
        """Test creating a minimal MCP resource."""
        resource = McpResource(uri_pattern="file://*.txt")
        assert resource.uri_pattern == "file://*.txt"
        assert resource.name is None
        assert resource.description is None
        assert resource.tags == []

    def test_full_resource(self) -> None:
        """Test creating a full MCP resource."""
        resource = McpResource(
            uri_pattern="http://api.example.com/*",
            name="API Resources",
            description="External API endpoints",
            tags=["api", "http"]
        )
        assert resource.uri_pattern == "http://api.example.com/*"
        assert resource.name == "API Resources"
        assert resource.description == "External API endpoints"
        assert resource.tags == ["api", "http"]

    def test_uri_pattern_too_long(self) -> None:
        """Test URI pattern validation - too long."""
        with pytest.raises(ValueError) as exc_info:
            McpResource(uri_pattern="x" * 129)  # Over 128 chars
        assert "URI pattern exceeds maximum length" in str(exc_info.value)

    def test_too_many_tags(self) -> None:
        """Test tag count validation - too many tags."""
        with pytest.raises(ValueError) as exc_info:
            McpResource(
                uri_pattern="test://*",
                tags=["tag1", "tag2", "tag3", "tag4"]  # Over 3 tags
            )
        assert "Maximum 3 tags allowed per resource" in str(exc_info.value)

    def test_tag_too_long(self) -> None:
        """Test individual tag validation - too long."""
        with pytest.raises(ValueError) as exc_info:
            McpResource(uri_pattern="test://*", tags=["x" * 33])  # Over 32 chars
        assert "resource tag exceeds maximum length" in str(exc_info.value)


class TestMcpPrompt:
    """Test McpPrompt dataclass."""

    def test_minimal_prompt(self) -> None:
        """Test creating a minimal MCP prompt."""
        prompt = McpPrompt(name="test_prompt")
        assert prompt.name == "test_prompt"
        assert prompt.description is None
        assert prompt.tags == []

    def test_full_prompt(self) -> None:
        """Test creating a full MCP prompt."""
        prompt = McpPrompt(
            name="code_review",
            description="Code review assistant",
            tags=["code", "review"]
        )
        assert prompt.name == "code_review"
        assert prompt.description == "Code review assistant"
        assert prompt.tags == ["code", "review"]

    def test_prompt_name_too_long(self) -> None:
        """Test prompt name validation - too long."""
        with pytest.raises(ValueError) as exc_info:
            McpPrompt(name="x" * 65)  # Over 64 chars
        assert "prompt name exceeds maximum length" in str(exc_info.value)

    def test_too_many_tags(self) -> None:
        """Test tag count validation - too many tags."""
        with pytest.raises(ValueError) as exc_info:
            McpPrompt(name="test", tags=["tag1", "tag2", "tag3", "tag4"])  # Over 3 tags
        assert "Maximum 3 tags allowed per prompt" in str(exc_info.value)

    def test_tag_too_long(self) -> None:
        """Test individual tag validation - too long."""
        with pytest.raises(ValueError) as exc_info:
            McpPrompt(name="test", tags=["x" * 33])  # Over 32 chars
        assert "prompt tag exceeds maximum length" in str(exc_info.value)


class TestMcpCapabilities:
    """Test McpCapabilities dataclass."""

    def test_default_capabilities(self) -> None:
        """Test creating default MCP capabilities."""
        caps = McpCapabilities()
        assert caps.supports_tools is False
        assert caps.supports_resources is False
        assert caps.supports_prompts is False
        assert caps.tool_count == 0
        assert caps.resource_count == 0
        assert caps.prompt_count == 0
        assert caps.tools == []
        assert caps.resources == []
        assert caps.prompts == []

    def test_full_capabilities(self) -> None:
        """Test creating full MCP capabilities."""
        tool = McpTool(name="test_tool")
        resource = McpResource(uri_pattern="test://*")
        prompt = McpPrompt(name="test_prompt")
        
        caps = McpCapabilities(
            supports_tools=True,
            supports_resources=True,
            supports_prompts=True,
            tool_count=1,
            resource_count=1,
            prompt_count=1,
            tools=[tool],
            resources=[resource],
            prompts=[prompt]
        )
        assert caps.supports_tools is True
        assert caps.supports_resources is True
        assert caps.supports_prompts is True
        assert caps.tool_count == 1
        assert caps.resource_count == 1
        assert caps.prompt_count == 1
        assert len(caps.tools) == 1
        assert len(caps.resources) == 1
        assert len(caps.prompts) == 1