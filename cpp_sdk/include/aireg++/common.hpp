/**
 * @file common.hpp
 * @brief Common utilities, types, and error handling for the Solana AI
 * Registries C++ SDK
 *
 * This header provides shared utilities, exception classes, and common types
 * used throughout the SDK.
 *
 * @version 1.0.0
 * @author Solana AI Registries Team
 */

#pragma once

#include <array>
#include <cstdint>
#include <memory>
#include <optional>
#include <stdexcept>
#include <string>

namespace SolanaAiRegistries {

/**
 * @brief Base exception class for all SDK errors
 */
class SdkException : public std::runtime_error {
public:
  /**
   * @brief Construct exception with error message
   * @param message Error message
   */
  explicit SdkException(const std::string &message)
      : std::runtime_error(message) {}
};

/**
 * @brief Exception thrown for RPC-related errors
 */
class RpcException : public SdkException {
public:
  explicit RpcException(const std::string &message)
      : SdkException("RPC Error: " + message) {}
};

/**
 * @brief Exception thrown for transaction-related errors
 */
class TransactionException : public SdkException {
public:
  explicit TransactionException(const std::string &message)
      : SdkException("Transaction Error: " + message) {}
};

/**
 * @brief Exception thrown for payment-related errors
 */
class PaymentException : public SdkException {
public:
  explicit PaymentException(const std::string &message)
      : SdkException("Payment Error: " + message) {}
};

/**
 * @brief Exception thrown for registry operation errors
 */
class RegistryException : public SdkException {
public:
  explicit RegistryException(const std::string &message)
      : SdkException("Registry Error: " + message) {}
};

/**
 * @brief Represents a Solana public key
 */
class PublicKey {
public:
  static constexpr size_t SIZE = 32; ///< Size of a public key in bytes

  /**
   * @brief Default constructor - creates zero public key
   */
  PublicKey();

  /**
   * @brief Construct from base58 string
   * @param base58 Base58-encoded public key string
   * @throws SdkException if string is invalid
   */
  explicit PublicKey(const std::string &base58);

  /**
   * @brief Construct from byte array
   * @param bytes Pointer to 32-byte array
   * @throws SdkException if bytes is null
   */
  explicit PublicKey(const uint8_t *bytes);

  /**
   * @brief Get base58 string representation
   * @return Base58-encoded string
   */
  std::string to_base58() const;

  /**
   * @brief Get raw bytes
   * @return Pointer to 32-byte array
   */
  const uint8_t *bytes() const noexcept { return data_.data(); }

  /**
   * @brief Equality comparison
   */
  bool operator==(const PublicKey &other) const noexcept;

  /**
   * @brief Inequality comparison
   */
  bool operator!=(const PublicKey &other) const noexcept {
    return !(*this == other);
  }

private:
  std::array<uint8_t, SIZE> data_;
};

/**
 * @brief Represents a transaction signature
 */
class Signature {
public:
  static constexpr size_t SIZE = 64; ///< Size of a signature in bytes

  /**
   * @brief Default constructor
   */
  Signature();

  /**
   * @brief Construct from base58 string
   * @param base58 Base58-encoded signature string
   */
  explicit Signature(const std::string &base58);

  /**
   * @brief Construct from byte array
   * @param bytes Pointer to 64-byte array
   */
  explicit Signature(const uint8_t *bytes);

  /**
   * @brief Get base58 string representation
   * @return Base58-encoded string
   */
  std::string to_base58() const;

  /**
   * @brief Get raw bytes
   * @return Pointer to 64-byte array
   */
  const uint8_t *bytes() const noexcept { return data_.data(); }

  /**
   * @brief Equality comparison
   */
  bool operator==(const Signature &other) const noexcept;

private:
  std::array<uint8_t, SIZE> data_;
};

/**
 * @brief Represents a Solana cluster/network
 */
enum class Cluster {
  Devnet,     ///< Solana devnet
  Testnet,    ///< Solana testnet
  MainnetBeta ///< Solana mainnet-beta
};

/**
 * @brief Convert cluster to RPC URL
 * @param cluster Cluster to convert
 * @return RPC URL string
 */
std::string cluster_to_url(Cluster cluster);

/**
 * @brief Transaction confirmation status
 */
enum class ConfirmationStatus {
  Processed, ///< Transaction processed
  Confirmed, ///< Transaction confirmed
  Finalized  ///< Transaction finalized
};

/**
 * @brief RAII wrapper for C SDK resources (deprecated)
 *
 * This template is deprecated. Use the custom deleters with std::unique_ptr
 * in c_sdk_bridge.hpp instead for better RAII compliance.
 *
 * @deprecated Use Bridge::*Ptr types from c_sdk_bridge.hpp instead
 */
template <typename T>
class [[deprecated(
    "Use Bridge::*Ptr types from c_sdk_bridge.hpp instead")]] Resource {
public:
  using Deleter = void (*)(T *);

  /**
   * @brief Construct with resource and deleter
   * @param resource Pointer to C SDK resource
   * @param deleter Function to delete the resource
   */
  Resource(T *resource, Deleter deleter)
      : resource_(resource), deleter_(deleter) {}

  /**
   * @brief Move constructor
   */
  Resource(Resource &&other) noexcept
      : resource_(other.resource_), deleter_(other.deleter_) {
    other.resource_ = nullptr;
  }

  /**
   * @brief Move assignment
   */
  Resource &operator=(Resource &&other) noexcept {
    if (this != &other) {
      reset();
      resource_ = other.resource_;
      deleter_ = other.deleter_;
      other.resource_ = nullptr;
    }
    return *this;
  }

  /**
   * @brief Destructor - automatically cleans up resource
   */
  ~Resource() { reset(); }

  /**
   * @brief Get the underlying resource
   * @return Pointer to resource
   */
  T *get() const noexcept { return resource_; }

  /**
   * @brief Release ownership of the resource
   * @return Pointer to released resource
   */
  T *release() noexcept {
    T *resource = resource_;
    resource_ = nullptr;
    return resource;
  }

  /**
   * @brief Reset the resource
   */
  void reset() noexcept {
    if (resource_ && deleter_) {
      deleter_(resource_);
      resource_ = nullptr;
    }
  }

  /**
   * @brief Check if resource is valid
   * @return true if resource is not null
   */
  bool is_valid() const noexcept { return resource_ != nullptr; }

  /**
   * @brief Boolean conversion operator
   */
  explicit operator bool() const noexcept { return is_valid(); }

  // Delete copy constructor and assignment
  Resource(const Resource &) = delete;
  Resource &operator=(const Resource &) = delete;

private:
  T *resource_;
  Deleter deleter_;
};

} // namespace SolanaAiRegistries
