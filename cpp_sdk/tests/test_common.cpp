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
  std::string base58_str = default_key.to_base58();
  EXPECT_FALSE(base58_str.empty()) << "Base58 string should not be empty";

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
  std::string base58_str = default_sig.to_base58();
  EXPECT_FALSE(base58_str.empty()) << "Base58 string should not be empty";

  // Test base58 constructor
  std::string sig_str =
      "5VERv8NMvzbJMEkV8xnrLkEaWRtSz9CosKDYjCJjBRnbJLgp8uirBg"
      "mQpjKhoR4tjF3ZpRzrFmBV6UjKdiSZkQUW";
  Signature test_sig(sig_str);
  EXPECT_EQ(test_sig.to_base58(), sig_str);
}

TEST_F(CommonTest, ClusterToUrl) {
  EXPECT_EQ(cluster_to_url(Cluster::Devnet), "https://api.devnet.solana.com");
  EXPECT_EQ(cluster_to_url(Cluster::Testnet), "https://api.testnet.solana.com");
  EXPECT_EQ(cluster_to_url(Cluster::MainnetBeta),
            "https://api.mainnet-beta.solana.com");
}

TEST_F(CommonTest, ExceptionHierarchy) {
  // Test base exception
  SdkException base_ex("Base error");
  EXPECT_STREQ(base_ex.what(), "Base error");

  // Test derived exceptions
  RpcException rpc_ex("Connection failed");
  EXPECT_TRUE(std::string(rpc_ex.what()).find("RPC Error") !=
              std::string::npos);
  EXPECT_TRUE(std::string(rpc_ex.what()).find("Connection failed") !=
              std::string::npos);

  TransactionException tx_ex("Invalid transaction");
  EXPECT_TRUE(std::string(tx_ex.what()).find("Transaction Error") !=
              std::string::npos);
  EXPECT_TRUE(std::string(tx_ex.what()).find("Invalid transaction") !=
              std::string::npos);

  PaymentException pay_ex("Insufficient funds");
  EXPECT_TRUE(std::string(pay_ex.what()).find("Payment Error") !=
              std::string::npos);
  EXPECT_TRUE(std::string(pay_ex.what()).find("Insufficient funds") !=
              std::string::npos);

  RegistryException reg_ex("Agent not found");
  EXPECT_TRUE(std::string(reg_ex.what()).find("Registry Error") !=
              std::string::npos);
  EXPECT_TRUE(std::string(reg_ex.what()).find("Agent not found") !=
              std::string::npos);
}

// Test helper for Resource tests
static bool resource_deleted = false;
static void test_deleter(int *ptr) {
  delete ptr;
  resource_deleted = true;
}

TEST_F(CommonTest, ResourceRaii) {
  resource_deleted = false;

  {
#pragma GCC diagnostic push
#pragma GCC diagnostic ignored "-Wdeprecated-declarations"
    Resource<int> resource(new int(42), test_deleter);
#pragma GCC diagnostic pop
    EXPECT_TRUE(resource.is_valid());
    EXPECT_EQ(*resource.get(), 42);
    EXPECT_FALSE(resource_deleted);
  }

  // Resource should be automatically deleted
  EXPECT_TRUE(resource_deleted);
}

TEST_F(CommonTest, ResourceMove) {
  resource_deleted = false;

#pragma GCC diagnostic push
#pragma GCC diagnostic ignored "-Wdeprecated-declarations"
  Resource<int> resource1(new int(42), test_deleter);
  Resource<int> resource2 = std::move(resource1);
#pragma GCC diagnostic pop

  EXPECT_FALSE(resource1.is_valid());
  EXPECT_TRUE(resource2.is_valid());
  EXPECT_EQ(*resource2.get(), 42);
  EXPECT_FALSE(resource_deleted);
}

TEST_F(CommonTest, ResourceRelease) {
  resource_deleted = false;

#pragma GCC diagnostic push
#pragma GCC diagnostic ignored "-Wdeprecated-declarations"
  Resource<int> resource(new int(42), test_deleter);
#pragma GCC diagnostic pop
  int *released_ptr = resource.release();

  EXPECT_FALSE(resource.is_valid());
  EXPECT_EQ(*released_ptr, 42);
  EXPECT_FALSE(resource_deleted);

  // Manual cleanup required after release
  delete released_ptr;
}
