/**
 * @file test_mcp.cpp
 * @brief Tests for the MCP server registry class
 */

#include <gtest/gtest.h>
#include <aireg++/mcp.hpp>
#include <aireg++/client.hpp>

using namespace SolanaAiRegistries;

class McpTest : public ::testing::Test {
protected:
    void SetUp() override {
        ClientConfig config;
        config.cluster = Cluster::Devnet;
        client_ = std::make_unique<Client>(config);
        mcp_ = std::make_unique<Mcp>(*client_);
    }
    
    void TearDown() override {}
    
    std::unique_ptr<Client> client_;
    std::unique_ptr<Mcp> mcp_;
};

TEST_F(McpTest, ProtocolConversion) {
    EXPECT_EQ(Mcp::protocol_to_string(McpProtocol::Http), "Http");
    EXPECT_EQ(Mcp::protocol_to_string(McpProtocol::WebSocket), "WebSocket");
    EXPECT_EQ(Mcp::protocol_to_string(McpProtocol::Stdio), "Stdio");
    
    EXPECT_EQ(Mcp::string_to_protocol("Http"), McpProtocol::Http);
    EXPECT_EQ(Mcp::string_to_protocol("WebSocket"), McpProtocol::WebSocket);
    EXPECT_EQ(Mcp::string_to_protocol("Stdio"), McpProtocol::Stdio);
    
    EXPECT_THROW(Mcp::string_to_protocol("InvalidProtocol"), std::invalid_argument);
}

TEST_F(McpTest, CapabilityConversion) {
    EXPECT_EQ(Mcp::capability_to_string(McpCapability::Resources), "Resources");
    EXPECT_EQ(Mcp::capability_to_string(McpCapability::Tools), "Tools");
    EXPECT_EQ(Mcp::capability_to_string(McpCapability::Prompts), "Prompts");
    
    EXPECT_EQ(Mcp::string_to_capability("Resources"), McpCapability::Resources);
    EXPECT_EQ(Mcp::string_to_capability("Tools"), McpCapability::Tools);
    
    EXPECT_THROW(Mcp::string_to_capability("InvalidCapability"), std::invalid_argument);
}

TEST_F(McpTest, EndpointValidation) {
    // Valid HTTP endpoint
    EXPECT_NO_THROW(Mcp::validate_endpoint(McpProtocol::Http, "https://api.example.com"));
    
    // Valid WebSocket endpoint
    EXPECT_NO_THROW(Mcp::validate_endpoint(McpProtocol::WebSocket, "wss://api.example.com"));
    
    // Valid Stdio endpoint
    EXPECT_NO_THROW(Mcp::validate_endpoint(McpProtocol::Stdio, "python mcp_server.py"));
    
    // Invalid HTTP endpoint
    EXPECT_THROW(Mcp::validate_endpoint(McpProtocol::Http, "invalid-url"), std::invalid_argument);
    
    // Invalid WebSocket endpoint
    EXPECT_THROW(Mcp::validate_endpoint(McpProtocol::WebSocket, "http://example.com"), std::invalid_argument);
}

TEST_F(McpTest, ParameterValidation) {
    McpRegistrationParams params;
    params.name = "Test MCP Server";
    params.description = "A test MCP server";
    params.version = "1.0.0";
    params.protocol = McpProtocol::Http;
    params.endpoint = "https://api.example.com";
    params.capabilities = {McpCapability::Resources};
    
    // Valid parameters should not throw
    EXPECT_NO_THROW(Mcp::validate_registration_params(params));
    
    // Invalid parameters should throw
    params.name = ""; // Empty name
    EXPECT_THROW(Mcp::validate_registration_params(params), std::invalid_argument);
    
    params.name = "Test MCP Server";
    params.endpoint = "invalid-url"; // Invalid endpoint
    EXPECT_THROW(Mcp::validate_registration_params(params), std::invalid_argument);
}

TEST_F(McpTest, SearchFilters) {
    McpSearchFilters filters;
    filters.protocol = McpProtocol::Http;
    filters.capabilities = {McpCapability::Resources, McpCapability::Tools};
    filters.active_only = true;
    
    // Search should not throw even with no results
    EXPECT_NO_THROW({
        auto results = mcp_->search_servers(filters, 10, 0);
        // Results may be empty on devnet
    });
}

TEST_F(McpTest, ServerCount) {
    EXPECT_NO_THROW({
        uint64_t count = mcp_->get_server_count();
        EXPECT_GE(count, 0);
    });
}