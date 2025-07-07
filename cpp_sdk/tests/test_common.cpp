/**
 * @file test_common.cpp
 * @brief Tests for common utilities and error handling
 */

#include <gtest/gtest.h>
#include <aireg++/common.hpp>

using namespace SolanaAiRegistries;

class CommonTest : public ::testing::Test {
protected:
    void SetUp() override {}
    void TearDown() override {}
};

TEST_F(CommonTest, PublicKeyCreation) {
    // Test default constructor
    PublicKey default_key;
    EXPECT_EQ(default_key.to_base58().length(), 44); // Base58 encoded 32 bytes
    
    // Test base58 constructor with known Solana system program ID
    std::string system_program_id = "11111111111111111111111111111112";
    PublicKey system_key(system_program_id);
    EXPECT_EQ(system_key.to_base58(), system_program_id);
    
    // Test equality
    PublicKey system_key2(system_program_id);
    EXPECT_EQ(system_key, system_key2);
    
    // Test inequality
    PublicKey different_key;
    EXPECT_NE(system_key, different_key);
}

TEST_F(CommonTest, PublicKeyInvalidBase58) {
    // Test invalid base58 string
    EXPECT_THROW(PublicKey("invalid_base58"), SdkException);
    
    // Test empty string
    EXPECT_THROW(PublicKey(""), SdkException);
    
    // Test string too short
    EXPECT_THROW(PublicKey("short"), SdkException);
}

TEST_F(CommonTest, SignatureCreation) {
    // Test default constructor
    Signature default_sig;
    EXPECT_EQ(default_sig.to_base58().length(), 88); // Base58 encoded 64 bytes
    
    // Test base58 constructor
    std::string sig_str = "5VERv8NMvzbJMEkV8xnrLkEaWRtSz9CosKDYjCJjBRnbJLgp8uirBgmQpjKhoR4tjF3ZpRzrFmBV6UjKdiSZkQUW";
    Signature test_sig(sig_str);
    EXPECT_EQ(test_sig.to_base58(), sig_str);
}

TEST_F(CommonTest, ClusterToUrl) {
    EXPECT_EQ(cluster_to_url(Cluster::Devnet), "https://api.devnet.solana.com");
    EXPECT_EQ(cluster_to_url(Cluster::Testnet), "https://api.testnet.solana.com");
    EXPECT_EQ(cluster_to_url(Cluster::MainnetBeta), "https://api.mainnet-beta.solana.com");
}

TEST_F(CommonTest, ExceptionHierarchy) {
    // Test base exception
    SdkException base_ex("Base error");
    EXPECT_STREQ(base_ex.what(), "Base error");
    
    // Test derived exceptions
    RpcException rpc_ex("Connection failed");
    EXPECT_THAT(rpc_ex.what(), ::testing::HasSubstr("RPC Error"));
    EXPECT_THAT(rpc_ex.what(), ::testing::HasSubstr("Connection failed"));
    
    TransactionException tx_ex("Invalid transaction");
    EXPECT_THAT(tx_ex.what(), ::testing::HasSubstr("Transaction Error"));
    EXPECT_THAT(tx_ex.what(), ::testing::HasSubstr("Invalid transaction"));
    
    PaymentException pay_ex("Insufficient funds");
    EXPECT_THAT(pay_ex.what(), ::testing::HasSubstr("Payment Error"));
    EXPECT_THAT(pay_ex.what(), ::testing::HasSubstr("Insufficient funds"));
    
    RegistryException reg_ex("Agent not found");
    EXPECT_THAT(reg_ex.what(), ::testing::HasSubstr("Registry Error"));
    EXPECT_THAT(reg_ex.what(), ::testing::HasSubstr("Agent not found"));
}

TEST_F(CommonTest, ResourceRaii) {
    bool deleted = false;
    auto deleter = [&deleted](int* ptr) {
        delete ptr;
        deleted = true;
    };
    
    {
        Resource<int> resource(new int(42), deleter);
        EXPECT_TRUE(resource.is_valid());
        EXPECT_EQ(*resource.get(), 42);
        EXPECT_FALSE(deleted);
    }
    
    // Resource should be automatically deleted
    EXPECT_TRUE(deleted);
}

TEST_F(CommonTest, ResourceMove) {
    bool deleted = false;
    auto deleter = [&deleted](int* ptr) {
        delete ptr;
        deleted = true;
    };
    
    Resource<int> resource1(new int(42), deleter);
    Resource<int> resource2 = std::move(resource1);
    
    EXPECT_FALSE(resource1.is_valid());
    EXPECT_TRUE(resource2.is_valid());
    EXPECT_EQ(*resource2.get(), 42);
    EXPECT_FALSE(deleted);
}

TEST_F(CommonTest, ResourceRelease) {
    bool deleted = false;
    auto deleter = [&deleted](int* ptr) {
        delete ptr;
        deleted = true;
    };
    
    Resource<int> resource(new int(42), deleter);
    int* released_ptr = resource.release();
    
    EXPECT_FALSE(resource.is_valid());
    EXPECT_EQ(*released_ptr, 42);
    EXPECT_FALSE(deleted);
    
    // Manual cleanup required after release
    delete released_ptr;
}