/**
 * @file test_integration.cpp
 * @brief Integration tests for the C++ SDK
 */

#include <aireg++/aireg++.hpp>
#include <gtest/gtest.h>

using namespace SolanaAiRegistries;

class IntegrationTest : public ::testing::Test {
protected:
  void SetUp() override {
    ClientConfig config;
    config.cluster = Cluster::Devnet;
    config.timeout = std::chrono::milliseconds{
        60000}; // Longer timeout for integration tests

    client_ = std::make_unique<Client>(config);
    agent_ = std::make_unique<Agent>(*client_);
    mcp_ = std::make_unique<Mcp>(*client_);
    payments_ = std::make_unique<Payments>(*client_);
  }

  void TearDown() override {}

  std::unique_ptr<Client> client_;
  std::unique_ptr<Agent> agent_;
  std::unique_ptr<Mcp> mcp_;
  std::unique_ptr<Payments> payments_;
};

TEST_F(IntegrationTest, DevnetConnectivity) {
  // Test basic connectivity to Solana devnet
  EXPECT_TRUE(client_->is_connected());

  // Test RPC calls work
  EXPECT_NO_THROW({
    std::string blockhash = client_->get_latest_blockhash();
    EXPECT_FALSE(blockhash.empty());
  });

  // Test rent exemption calculation
  EXPECT_NO_THROW({
    uint64_t min_balance = client_->get_minimum_balance_for_rent_exemption(100);
    EXPECT_GT(min_balance, 0);
  });
}

TEST_F(IntegrationTest, SystemAccountQuery) {
  // Query well-known system program account
  PublicKey system_program("11111111111111111111111111111112");

  EXPECT_NO_THROW({
    auto account_info = client_->get_account_info(system_program);
    if (account_info) {
      EXPECT_TRUE(account_info->executable);
      EXPECT_EQ(account_info->owner, system_program);
      EXPECT_GE(account_info->lamports, 1);
    }
  });

  EXPECT_NO_THROW({
    uint64_t balance = client_->get_balance(system_program);
    EXPECT_GE(balance, 1);
  });
}

TEST_F(IntegrationTest, RegistryQueries) {
  // Test querying registry data (may be empty on devnet)
  EXPECT_NO_THROW({
    uint64_t agent_count = agent_->get_agent_count();
    // Count may be 0 on fresh devnet
    EXPECT_GE(agent_count, 0);
  });

  EXPECT_NO_THROW({
    uint64_t server_count = mcp_->get_server_count();
    // Count may be 0 on fresh devnet
    EXPECT_GE(server_count, 0);
  });
}

TEST_F(IntegrationTest, SearchOperations) {
  // Test search operations (should not throw even with empty results)
  EXPECT_NO_THROW({
    AgentSearchFilters agent_filters;
    agent_filters.active_only = true;
    auto agents = agent_->search_agents(agent_filters, 10, 0);
    // Results may be empty
  });

  EXPECT_NO_THROW({
    McpSearchFilters mcp_filters;
    mcp_filters.active_only = true;
    auto servers = mcp_->search_servers(mcp_filters, 10, 0);
    // Results may be empty
  });

  EXPECT_NO_THROW({
    PaymentSearchFilters payment_filters;
    payment_filters.status = PaymentStatus::Completed;
    auto payments = payments_->search_payments(payment_filters, 10, 0);
    // Results may be empty
  });
}

TEST_F(IntegrationTest, TransactionBuilding) {
  // Test building a transaction (without sending)
  TransactionBuilder builder(*client_);

  PublicKey payer("11111111111111111111111111111112");
  std::vector<PublicKey> accounts = {payer};
  std::vector<uint8_t> data = {0x00}; // Minimal instruction data

  EXPECT_NO_THROW({
    auto transaction_data =
        builder.set_payer(payer).add_instruction(payer, accounts, data).build();

    EXPECT_FALSE(transaction_data.empty());
  });
}

TEST_F(IntegrationTest, BalanceQueries) {
  // Test balance queries for different payment methods
  PublicKey account("11111111111111111111111111111112");

  EXPECT_NO_THROW({
    BalanceInfo sol_balance =
        payments_->get_balance(account, PaymentMethod::Sol);
    EXPECT_EQ(sol_balance.method, PaymentMethod::Sol);
    EXPECT_TRUE(sol_balance.is_native);
    EXPECT_EQ(sol_balance.account, account);
  });

  EXPECT_NO_THROW({
    auto all_balances = payments_->get_all_balances(account);
    // Should at least have SOL balance
    EXPECT_GE(all_balances.size(), 1);
  });
}

TEST_F(IntegrationTest, IdlOperations) {
  // Test loading built-in IDL definitions
  EXPECT_NO_THROW({
    IdlDefinition agent_idl = Idl::load_agent_registry_idl();
    EXPECT_FALSE(agent_idl.name.empty());
    EXPECT_FALSE(agent_idl.instructions.empty());

    // Validate the IDL
    std::vector<std::string> errors = Idl::validate_idl(agent_idl);
    EXPECT_TRUE(errors.empty())
        << "IDL validation errors: " << (errors.empty() ? "none" : errors[0]);
  });

  EXPECT_NO_THROW({
    IdlDefinition mcp_idl = Idl::load_mcp_server_registry_idl();
    EXPECT_FALSE(mcp_idl.name.empty());
    EXPECT_FALSE(mcp_idl.instructions.empty());

    // Validate the IDL
    std::vector<std::string> errors = Idl::validate_idl(mcp_idl);
    EXPECT_TRUE(errors.empty())
        << "IDL validation errors: " << (errors.empty() ? "none" : errors[0]);
  });
}

TEST_F(IntegrationTest, ErrorHandling) {
  // Test error handling with invalid operations

  // Invalid public key should throw
  EXPECT_THROW({ PublicKey invalid_key("invalid"); }, SdkException);

  // Query non-existent account should return nullopt, not throw
  EXPECT_NO_THROW({
    // Generate a random-looking but invalid account
    PublicKey fake_account("9WzDXwBbmkg8ZTbNMqUxvQRAyrZzDsGYdLVL9zYtAWWM");
    auto account_info = client_->get_account_info(fake_account);
    // Should be nullopt for non-existent account
    EXPECT_FALSE(account_info.has_value());
  });
}
