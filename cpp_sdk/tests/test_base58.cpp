/**
 * @file test_base58.cpp
 * @brief Comprehensive tests for base58 encoding/decoding
 */

#include <gtest/gtest.h>

#include <aireg++/common.hpp>
#include <algorithm>
#include <cstdlib>
#include <random>
#include <string>
#include <vector>

using namespace SolanaAiRegistries;

class Base58Test : public ::testing::Test {
protected:
  void SetUp() override {
    // Initialize random number generator
    generator_.seed(std::random_device{}());
  }

  std::mt19937 generator_;

  // Generate random bytes
  std::vector<uint8_t> generate_random_bytes(size_t size) {
    std::vector<uint8_t> bytes(size);
    std::uniform_int_distribution<uint8_t> dist(0, 255);
    for (size_t i = 0; i < size; ++i) {
      bytes[i] = dist(generator_);
    }
    return bytes;
  }
};

// Test vectors from Bitcoin base58 test suite - adjusted for 32-byte keys
TEST_F(Base58Test, KnownVectors) {
  struct TestVector {
    std::vector<uint8_t> input;
    std::string expected;
  };

  std::vector<TestVector> test_vectors = {
      // Test all zeros (32 bytes)
      {{0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00,
        0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00,
        0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00},
       "111111111111111111111111111111111"},

      // Test system program ID (32 bytes)
      {{0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00,
        0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00,
        0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x01},
       "11111111111111111111111111111112"},
  };

  for (const auto &test : test_vectors) {
    PublicKey key(test.input.data());
    EXPECT_EQ(key.to_base58(), test.expected)
        << "Failed for input size " << test.input.size();

    // Round-trip test
    if (!test.expected.empty()) {
      PublicKey key2(test.expected);
      EXPECT_EQ(key, key2) << "Round-trip failed for: " << test.expected;
    }
  }
}

TEST_F(Base58Test, PublicKeyRoundTrip) {
  // Test 1000 random 32-byte public keys
  for (int i = 0; i < 1000; ++i) {
    auto random_bytes = generate_random_bytes(32);
    PublicKey original(random_bytes.data());

    std::string base58_str = original.to_base58();
    EXPECT_FALSE(base58_str.empty()) << "Base58 string should not be empty";

    PublicKey decoded(base58_str);
    EXPECT_EQ(original, decoded) << "Round-trip failed for iteration " << i;
  }
}

TEST_F(Base58Test, SignatureRoundTrip) {
  // Test 1000 random 64-byte signatures
  for (int i = 0; i < 1000; ++i) {
    auto random_bytes = generate_random_bytes(64);
    Signature original(random_bytes.data());

    std::string base58_str = original.to_base58();
    EXPECT_FALSE(base58_str.empty()) << "Base58 string should not be empty";

    Signature decoded(base58_str);
    EXPECT_EQ(original, decoded) << "Round-trip failed for iteration " << i;
  }
}

TEST_F(Base58Test, InvalidBase58Characters) {
  // Test invalid characters (0, O, I, l not in base58 alphabet)
  std::vector<std::string> invalid_strings = {
      "0",
      "O",
      "I",
      "l",
      "11111111111111111111111111111110", // Has '0'
      "1111111111111111111111111111111O", // Has 'O'
      "1111111111111111111111111111111I", // Has 'I'
      "1111111111111111111111111111111l", // Has 'l'
      "!@#$%^&*()",                       // Special characters
      "123456789ABCDEFGHJKLMNPQRSTUVWXYZabcdefghijkmnopqrstuvwxyz0", // Valid
                                                                     // chars +
                                                                     // invalid
                                                                     // '0'
  };

  for (const auto &invalid : invalid_strings) {
    EXPECT_THROW(PublicKey invalid_key{invalid}, SdkException)
        << "Should throw for invalid string: " << invalid;
    EXPECT_THROW(Signature invalid_sig{invalid}, SdkException)
        << "Should throw for invalid string: " << invalid;
  }
}

TEST_F(Base58Test, InvalidLengthHandling) {
  // Test strings that decode to wrong length
  std::vector<std::string> wrong_length_strings = {
      "2",                               // Too short for PublicKey (32 bytes)
      "22",                              // Still too short
      "1111111111111111111111111111111", // 31 chars, still too short
      "111111111111111111111111111111111111111111111111111111111111111111111111"
      "11111111111111111111111111111111111111111111111111111111111111111111111"
      "1", // Too long
  };

  for (const auto &wrong_length : wrong_length_strings) {
    EXPECT_THROW(PublicKey wrong_key{wrong_length}, SdkException)
        << "Should throw for wrong length string: " << wrong_length;
  }
}

TEST_F(Base58Test, EmptyStringHandling) {
  EXPECT_THROW(PublicKey empty_key{""}, SdkException)
      << "Should throw for empty string";
  EXPECT_THROW(Signature empty_sig{""}, SdkException)
      << "Should throw for empty string";
}

TEST_F(Base58Test, LeadingZerosHandling) {
  // Test that leading zeros are properly handled
  std::vector<uint8_t> with_leading_zeros = {0x00, 0x00, 0x00, 0x01};
  with_leading_zeros.resize(32, 0x00); // Pad to 32 bytes

  PublicKey key(with_leading_zeros.data());
  std::string base58_str = key.to_base58();

  // Should start with multiple '1's for leading zeros
  EXPECT_TRUE(base58_str.substr(0, 3) == "111")
      << "Should have leading 1's: " << base58_str;

  // Round-trip test
  PublicKey decoded(base58_str);
  EXPECT_EQ(key, decoded) << "Round-trip failed for leading zeros";
}

TEST_F(Base58Test, AllZerosHandling) {
  // Test all-zeros public key
  std::vector<uint8_t> all_zeros(32, 0x00);
  PublicKey key(all_zeros.data());

  std::string base58_str = key.to_base58();

  // Should be all '1's for all zeros
  EXPECT_TRUE(std::all_of(base58_str.begin(), base58_str.end(),
                          [](char c) { return c == '1'; }))
      << "All zeros should be all 1's, got: " << base58_str;

  // Round-trip test - this is the most important
  PublicKey decoded(base58_str);
  EXPECT_EQ(key, decoded) << "Round-trip failed for all zeros";
}

TEST_F(Base58Test, AllOnesHandling) {
  // Test all-ones public key
  std::vector<uint8_t> all_ones(32, 0xFF);
  PublicKey key(all_ones.data());

  std::string base58_str = key.to_base58();
  EXPECT_FALSE(base58_str.empty()) << "All ones should not be empty";

  // Round-trip test
  PublicKey decoded(base58_str);
  EXPECT_EQ(key, decoded) << "Round-trip failed for all ones";
}

TEST_F(Base58Test, NullPointerHandling) {
  // Test null pointer handling
  EXPECT_THROW(PublicKey null_key{static_cast<const uint8_t *>(nullptr)},
               SdkException)
      << "Should throw for null pointer";
  EXPECT_THROW(Signature null_sig{static_cast<const uint8_t *>(nullptr)},
               SdkException)
      << "Should throw for null pointer";
}

// Fuzz testing for base58 encoding/decoding
TEST_F(Base58Test, FuzzTesting) {
  // Test 10,000 random byte sequences
  for (int i = 0; i < 10000; ++i) {
    // Random size between 1 and 100 bytes
    std::uniform_int_distribution<size_t> size_dist(1, 100);
    size_t size = size_dist(generator_);

    auto random_bytes = generate_random_bytes(size);

    // For PublicKey, we need exactly 32 bytes
    if (size == 32) {
      PublicKey key(random_bytes.data());
      std::string base58_str = key.to_base58();

      // Should not be empty
      EXPECT_FALSE(base58_str.empty())
          << "Base58 string should not be empty for iteration " << i;

      // Should only contain valid base58 characters
      std::string valid_chars =
          "123456789ABCDEFGHJKLMNPQRSTUVWXYZabcdefghijkmnopqrstuvwxyz";
      for (char c : base58_str) {
        EXPECT_NE(valid_chars.find(c), std::string::npos)
            << "Invalid base58 character: " << c << " in iteration " << i;
      }

      // Round-trip test
      PublicKey decoded(base58_str);
      EXPECT_EQ(key, decoded) << "Round-trip failed for iteration " << i;
    }

    // For Signature, we need exactly 64 bytes
    if (size == 64) {
      Signature sig(random_bytes.data());
      std::string base58_str = sig.to_base58();

      // Should not be empty
      EXPECT_FALSE(base58_str.empty())
          << "Base58 string should not be empty for iteration " << i;

      // Should only contain valid base58 characters
      std::string valid_chars =
          "123456789ABCDEFGHJKLMNPQRSTUVWXYZabcdefghijkmnopqrstuvwxyz";
      for (char c : base58_str) {
        EXPECT_NE(valid_chars.find(c), std::string::npos)
            << "Invalid base58 character: " << c << " in iteration " << i;
      }

      // Round-trip test
      Signature decoded(base58_str);
      EXPECT_EQ(sig, decoded) << "Round-trip failed for iteration " << i;
    }
  }
}

// Performance test for base58 operations
TEST_F(Base58Test, PerformanceTest) {
  // Generate 1000 random 32-byte keys
  std::vector<std::vector<uint8_t>> test_keys;
  for (int i = 0; i < 1000; ++i) {
    test_keys.push_back(generate_random_bytes(32));
  }

  auto start = std::chrono::high_resolution_clock::now();

  // Encode all keys
  std::vector<std::string> encoded_keys;
  for (const auto &key_bytes : test_keys) {
    PublicKey key(key_bytes.data());
    encoded_keys.push_back(key.to_base58());
  }

  auto encode_end = std::chrono::high_resolution_clock::now();

  // Decode all keys
  std::vector<PublicKey> decoded_keys;
  for (const auto &encoded : encoded_keys) {
    decoded_keys.emplace_back(encoded);
  }

  auto decode_end = std::chrono::high_resolution_clock::now();

  auto encode_time =
      std::chrono::duration_cast<std::chrono::microseconds>(encode_end - start);
  auto decode_time = std::chrono::duration_cast<std::chrono::microseconds>(
      decode_end - encode_end);

  // Performance expectations (adjust based on requirements and environment)
  // If CI env var set, we more chill on timing
  if (std::getenv("CI")) {
    EXPECT_LT(encode_time.count(), 200000) // 200ms on CI
        << "Encoding 1000 keys should take < 200ms on CI";
    EXPECT_LT(decode_time.count(), 200000) // 200ms on CI
        << "Decoding 1000 keys should take < 200ms on CI";
  } else {
    EXPECT_LT(encode_time.count(), 50000) // 50ms local
        << "Encoding 1000 keys should take < 50ms";
    EXPECT_LT(decode_time.count(), 50000) // 50ms local
        << "Decoding 1000 keys should take < 50ms";
  }

  // Verify all keys round-tripped correctly
  for (size_t i = 0; i < test_keys.size(); ++i) {
    PublicKey original(test_keys[i].data());
    EXPECT_EQ(original, decoded_keys[i])
        << "Performance test round-trip failed for key " << i;
  }
}

// Test base58 alphabet edge cases
TEST_F(Base58Test, AlphabetEdgeCases) {
  // Test with bytes that map to first and last characters of base58 alphabet
  std::vector<uint8_t> first_char_bytes(32, 0x00);
  first_char_bytes[31] = 0x01; // Should result in '2' at the end

  PublicKey first_key(first_char_bytes.data());
  std::string first_base58 = first_key.to_base58();
  EXPECT_TRUE(first_base58.back() == '2')
      << "Should end with '2': " << first_base58;

  std::vector<uint8_t> last_char_bytes(32, 0x00);
  last_char_bytes[31] = 0x39; // Should result in 'z' at the end

  PublicKey last_key(last_char_bytes.data());
  std::string last_base58 = last_key.to_base58();
  EXPECT_TRUE(last_base58.back() == 'z')
      << "Should end with 'z': " << last_base58;
}