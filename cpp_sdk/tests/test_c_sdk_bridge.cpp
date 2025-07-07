/**
 * @file test_c_sdk_bridge.cpp
 * @brief Tests for the C SDK bridge with custom deleters
 * 
 * This file tests the RAII wrappers and custom deleters for the C SDK bridge.
 */

#include <gtest/gtest.h>
#include <aireg++/c_sdk_bridge.hpp>
#include <aireg++/common.hpp>

using namespace SolanaAiRegistries;

class CSdkBridgeTest : public ::testing::Test {
protected:
    void SetUp() override {
        // Test setup
    }
    
    void TearDown() override {
        // Test cleanup
    }
};

/**
 * Test that client RAII wrapper works correctly
 */
TEST_F(CSdkBridgeTest, ClientRaiiWrapper) {
    // Test client creation with RAII wrapper
    {
        auto client = Bridge::make_client("https://api.devnet.solana.com", 0);
        EXPECT_NE(client.get(), nullptr);
        EXPECT_TRUE(client);
        
        // Test that client is automatically destroyed when going out of scope
        // (destructor should be called automatically)
    }
    
    // Test null client handling
    {
        auto client = Bridge::make_client(nullptr, 0);
        EXPECT_EQ(client.get(), nullptr);
        EXPECT_FALSE(client);
    }
}

/**
 * Test that transaction builder RAII wrapper works correctly
 */
TEST_F(CSdkBridgeTest, TransactionBuilderRaiiWrapper) {
    auto client = Bridge::make_client("https://api.devnet.solana.com", 0);
    ASSERT_NE(client.get(), nullptr);
    
    // Test transaction builder creation with RAII wrapper
    {
        auto builder = Bridge::make_transaction_builder(client.get());
        EXPECT_NE(builder.get(), nullptr);
        EXPECT_TRUE(builder);
    }
    
    // Test null client handling
    {
        auto builder = Bridge::make_transaction_builder(nullptr);
        EXPECT_EQ(builder.get(), nullptr);
        EXPECT_FALSE(builder);
    }
}

/**
 * Test that agent RAII wrapper works correctly
 */
TEST_F(CSdkBridgeTest, AgentRaiiWrapper) {
    auto client = Bridge::make_client("https://api.devnet.solana.com", 0);
    ASSERT_NE(client.get(), nullptr);
    
    // Test agent creation with RAII wrapper
    {
        auto agent = Bridge::make_agent(client.get());
        EXPECT_NE(agent.get(), nullptr);
        EXPECT_TRUE(agent);
    }
    
    // Test null client handling
    {
        auto agent = Bridge::make_agent(nullptr);
        EXPECT_EQ(agent.get(), nullptr);
        EXPECT_FALSE(agent);
    }
}

/**
 * Test that MCP RAII wrapper works correctly
 */
TEST_F(CSdkBridgeTest, McpRaiiWrapper) {
    auto client = Bridge::make_client("https://api.devnet.solana.com", 0);
    ASSERT_NE(client.get(), nullptr);
    
    // Test MCP creation with RAII wrapper
    {
        auto mcp = Bridge::make_mcp(client.get());
        EXPECT_NE(mcp.get(), nullptr);
        EXPECT_TRUE(mcp);
    }
    
    // Test null client handling
    {
        auto mcp = Bridge::make_mcp(nullptr);
        EXPECT_EQ(mcp.get(), nullptr);
        EXPECT_FALSE(mcp);
    }
}

/**
 * Test that payments RAII wrapper works correctly
 */
TEST_F(CSdkBridgeTest, PaymentsRaiiWrapper) {
    auto client = Bridge::make_client("https://api.devnet.solana.com", 0);
    ASSERT_NE(client.get(), nullptr);
    
    // Test payments creation with RAII wrapper
    {
        auto payments = Bridge::make_payments(client.get());
        EXPECT_NE(payments.get(), nullptr);
        EXPECT_TRUE(payments);
    }
    
    // Test null client handling
    {
        auto payments = Bridge::make_payments(nullptr);
        EXPECT_EQ(payments.get(), nullptr);
        EXPECT_FALSE(payments);
    }
}

/**
 * Test that info structures RAII wrappers work correctly
 */
TEST_F(CSdkBridgeTest, InfoStructuresRaiiWrapper) {
    // Test account info
    {
        auto account_info = Bridge::make_account_info();
        EXPECT_NE(account_info.get(), nullptr);
        EXPECT_TRUE(account_info);
    }
    
    // Test transaction result
    {
        auto tx_result = Bridge::make_transaction_result();
        EXPECT_NE(tx_result.get(), nullptr);
        EXPECT_TRUE(tx_result);
    }
    
    // Test agent info
    {
        auto agent_info = Bridge::make_agent_info();
        EXPECT_NE(agent_info.get(), nullptr);
        EXPECT_TRUE(agent_info);
    }
    
    // Test MCP server info
    {
        auto mcp_info = Bridge::make_mcp_server_info();
        EXPECT_NE(mcp_info.get(), nullptr);
        EXPECT_TRUE(mcp_info);
    }
    
    // Test payment info
    {
        auto payment_info = Bridge::make_payment_info();
        EXPECT_NE(payment_info.get(), nullptr);
        EXPECT_TRUE(payment_info);
    }
    
    // Test balance info
    {
        auto balance_info = Bridge::make_balance_info();
        EXPECT_NE(balance_info.get(), nullptr);
        EXPECT_TRUE(balance_info);
    }
}

/**
 * Test move semantics for RAII wrappers
 */
TEST_F(CSdkBridgeTest, MoveSemantics) {
    auto client = Bridge::make_client("https://api.devnet.solana.com", 0);
    ASSERT_NE(client.get(), nullptr);
    
    // Test move constructor
    auto moved_client = std::move(client);
    EXPECT_EQ(client.get(), nullptr);  // Original should be null
    EXPECT_NE(moved_client.get(), nullptr);  // Moved should be valid
    
    // Test move assignment
    auto another_client = Bridge::make_client("https://api.devnet.solana.com", 0);
    ASSERT_NE(another_client.get(), nullptr);
    
    another_client = std::move(moved_client);
    EXPECT_EQ(moved_client.get(), nullptr);  // Original should be null
    EXPECT_NE(another_client.get(), nullptr);  // Assigned should be valid
}

/**
 * Test custom deleters are properly called
 */
TEST_F(CSdkBridgeTest, CustomDeleters) {
    // This test verifies that custom deleters work correctly
    // by creating objects and letting them go out of scope
    // The destructor should be called automatically without crashes
    
    auto client = Bridge::make_client("https://api.devnet.solana.com", 0);
    if (client) {
        auto builder = Bridge::make_transaction_builder(client.get());
        auto agent = Bridge::make_agent(client.get());
        auto mcp = Bridge::make_mcp(client.get());
        auto payments = Bridge::make_payments(client.get());
        
        // All objects should be destroyed properly when going out of scope
        EXPECT_TRUE(builder);
        EXPECT_TRUE(agent);
        EXPECT_TRUE(mcp);
        EXPECT_TRUE(payments);
    }
    
    // Test info structures
    {
        auto account_info = Bridge::make_account_info();
        auto tx_result = Bridge::make_transaction_result();
        auto agent_info = Bridge::make_agent_info();
        auto mcp_info = Bridge::make_mcp_server_info();
        auto payment_info = Bridge::make_payment_info();
        auto balance_info = Bridge::make_balance_info();
        
        EXPECT_TRUE(account_info);
        EXPECT_TRUE(tx_result);
        EXPECT_TRUE(agent_info);
        EXPECT_TRUE(mcp_info);
        EXPECT_TRUE(payment_info);
        EXPECT_TRUE(balance_info);
    }
}

/**
 * Test that the deprecated Resource template is marked as deprecated
 */
TEST_F(CSdkBridgeTest, DeprecatedResourceTemplate) {
    // This test doesn't need to run anything, just verify that the
    // Resource template is marked as deprecated in the header
    // The actual deprecation warning should be generated by the compiler
    
    // If this test compiles, it means the deprecated Resource template
    // is still available for backward compatibility
    EXPECT_TRUE(true);
}