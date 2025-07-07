/**
 * @file test_client.cpp
 * @brief Tests for the Client class
 */

#include <gtest/gtest.h>
#include <aireg++/client.hpp>

using namespace SolanaAiRegistries;

class ClientTest : public ::testing::Test {
protected:
    void SetUp() override {
        config_.cluster = Cluster::Devnet;
        config_.timeout = std::chrono::milliseconds{10000};
    }
    
    void TearDown() override {}
    
    ClientConfig config_;
};

TEST_F(ClientTest, Construction) {
    // Test default construction
    EXPECT_NO_THROW({
        Client client;
    });
    
    // Test construction with config
    EXPECT_NO_THROW({
        Client client(config_);
    });
}

TEST_F(ClientTest, MoveSemantics) {
    Client client1(config_);
    
    // Test move constructor
    Client client2 = std::move(client1);
    EXPECT_TRUE(client2.is_connected());
    
    // Test move assignment
    Client client3(config_);
    client3 = std::move(client2);
    EXPECT_TRUE(client3.is_connected());
}

TEST_F(ClientTest, BasicRpcCalls) {
    Client client(config_);
    
    // Test get_latest_blockhash
    EXPECT_NO_THROW({
        std::string blockhash = client.get_latest_blockhash();
        EXPECT_FALSE(blockhash.empty());
    });
    
    // Test get_minimum_balance_for_rent_exemption
    EXPECT_NO_THROW({
        uint64_t min_balance = client.get_minimum_balance_for_rent_exemption(0);
        EXPECT_GT(min_balance, 0);
    });
}

TEST_F(ClientTest, AccountOperations) {
    Client client(config_);
    
    // Test with system program account
    PublicKey system_program("11111111111111111111111111111112");
    
    EXPECT_NO_THROW({
        auto account_info = client.get_account_info(system_program);
        if (account_info) {
            EXPECT_TRUE(account_info->executable);
            EXPECT_EQ(account_info->owner, system_program);
        }
    });
    
    EXPECT_NO_THROW({
        uint64_t balance = client.get_balance(system_program);
        // System program account should have 1 lamport
        EXPECT_GE(balance, 1);
    });
}

TEST_F(ClientTest, TransactionBuilder) {
    Client client(config_);
    TransactionBuilder builder(client);
    
    // Test setting payer
    PublicKey payer("11111111111111111111111111111112");
    EXPECT_NO_THROW({
        builder.set_payer(payer);
    });
    
    // Test setting recent blockhash
    std::string blockhash = client.get_latest_blockhash();
    EXPECT_NO_THROW({
        builder.set_recent_blockhash(blockhash);
    });
    
    // Test adding instruction
    std::vector<PublicKey> accounts = {payer};
    std::vector<uint8_t> data = {0x01, 0x02, 0x03};
    EXPECT_NO_THROW({
        builder.add_instruction(payer, accounts, data);
    });
    
    // Test fee estimation
    EXPECT_NO_THROW({
        uint64_t fee = builder.estimate_fee();
        EXPECT_GT(fee, 0);
    });
    
    // Test building transaction
    EXPECT_NO_THROW({
        auto transaction_data = builder.build();
        EXPECT_FALSE(transaction_data.empty());
    });
}

TEST_F(ClientTest, ErrorHandling) {
    Client client(config_);
    
    // Test with invalid public key format
    EXPECT_THROW({
        PublicKey invalid_key("invalid");
        client.get_account_info(invalid_key);
    }, SdkException);
}

class ClientIntegrationTest : public ::testing::Test {
protected:
    void SetUp() override {
        config_.cluster = Cluster::Devnet;
        config_.timeout = std::chrono::milliseconds{30000};
    }
    
    ClientConfig config_;
};

TEST_F(ClientIntegrationTest, DevnetConnectivity) {
    Client client(config_);
    
    EXPECT_TRUE(client.is_connected());
    EXPECT_EQ(client.get_rpc_url(), "https://api.devnet.solana.com");
    
    // Test actual devnet call
    EXPECT_NO_THROW({
        std::string blockhash = client.get_latest_blockhash();
        EXPECT_EQ(blockhash.length(), 44); // Base58 encoded 32 bytes
    });
}