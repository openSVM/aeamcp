/**
 * @file client.hpp
 * @brief Client class for RPC communication and transaction building
 *
 * This header provides the main Client class for interacting with Solana
 * through RPC calls and building transactions for AI registry operations.
 *
 * @version 1.0.0
 * @author Solana AI Registries Team
 */

#pragma once

#include <aireg++/c_sdk_bridge.hpp>
#include <aireg++/common.hpp>
#include <chrono>
#include <memory>
#include <optional>
#include <string>
#include <vector>

namespace SolanaAiRegistries {

// Forward declarations for C SDK types
struct SolanaClient;
struct SolanaTransaction;
struct SolanaInstruction;

/**
 * @brief Configuration for the Solana client
 */
struct ClientConfig {
  Cluster cluster = Cluster::Devnet;  ///< Solana cluster to connect to
  std::optional<std::string>
      custom_rpc_url;  ///< Custom RPC URL (overrides cluster)
  std::chrono::milliseconds timeout{
      30000};  ///< Request timeout in milliseconds
  std::optional<std::string> commitment =
      "confirmed";           ///< Transaction commitment level
  bool enable_retry = true;  ///< Enable automatic retries
  int max_retries = 3;       ///< Maximum number of retries
};

/**
 * @brief Information about a Solana account
 */
struct AccountInfo {
  uint64_t lamports;          ///< Account balance in lamports
  PublicKey owner;            ///< Account owner program
  std::vector<uint8_t> data;  ///< Account data
  bool executable;            ///< Whether account is executable
  uint64_t rent_epoch;        ///< Rent epoch
};

/**
 * @brief Transaction result information
 */
struct TransactionResult {
  Signature signature;               ///< Transaction signature
  bool success;                      ///< Whether transaction succeeded
  std::optional<std::string> error;  ///< Error message if failed
  uint64_t slot;  ///< Slot number where transaction was processed
  std::optional<uint64_t> block_time;  ///< Block time (Unix timestamp)
};

/**
 * @brief Main client class for Solana AI Registries operations
 *
 * This class provides a high-level interface for RPC communication with
 * Solana and building transactions for AI registry operations. It uses
 * RAII principles for resource management and provides comprehensive
 * error handling.
 */
class Client {
 public:
  /**
   * @brief Construct client with configuration
   * @param config Client configuration
   * @throws RpcException if connection fails
   */
  explicit Client(const ClientConfig &config = {});

  /**
   * @brief Destructor - automatically cleans up resources
   */
  ~Client();

  /**
   * @brief Move constructor
   */
  Client(Client &&other) noexcept;

  /**
   * @brief Move assignment operator
   */
  Client &operator=(Client &&other) noexcept;

  // Delete copy constructor and assignment
  Client(const Client &) = delete;
  Client &operator=(const Client &) = delete;

  /**
   * @brief Get account information
   * @param public_key Account public key
   * @return Account information, or nullopt if account doesn't exist
   * @throws RpcException if RPC call fails
   */
  std::optional<AccountInfo> get_account_info(const PublicKey &public_key);

  /**
   * @brief Get account balance in lamports
   * @param public_key Account public key
   * @return Balance in lamports
   * @throws RpcException if RPC call fails
   */
  uint64_t get_balance(const PublicKey &public_key);

  /**
   * @brief Get latest blockhash
   * @return Latest blockhash as string
   * @throws RpcException if RPC call fails
   */
  std::string get_latest_blockhash();

  /**
   * @brief Get minimum rent exemption for data size
   * @param data_size Size of account data in bytes
   * @return Minimum lamports required for rent exemption
   * @throws RpcException if RPC call fails
   */
  uint64_t get_minimum_balance_for_rent_exemption(uint64_t data_size);

  /**
   * @brief Send and confirm transaction
   * @param transaction_data Serialized transaction data
   * @return Transaction result
   * @throws TransactionException if transaction fails or times out
   */
  TransactionResult send_and_confirm_transaction(
      const std::vector<uint8_t> &transaction_data);

  /**
   * @brief Send transaction without waiting for confirmation
   * @param transaction_data Serialized transaction data
   * @return Transaction signature
   * @throws TransactionException if send fails
   */
  Signature send_transaction(const std::vector<uint8_t> &transaction_data);

  /**
   * @brief Wait for transaction confirmation
   * @param signature Transaction signature to wait for
   * @param timeout_ms Timeout in milliseconds
   * @return Transaction result
   * @throws TransactionException if transaction fails or times out
   */
  TransactionResult confirm_transaction(
      const Signature &signature,
      std::chrono::milliseconds timeout_ms = std::chrono::milliseconds{30000});

  /**
   * @brief Get transaction status
   * @param signature Transaction signature
   * @return Transaction result, or nullopt if not found
   * @throws RpcException if RPC call fails
   */
  std::optional<TransactionResult> get_transaction(const Signature &signature);

  /**
   * @brief Get cluster information
   * @return RPC URL being used
   */
  std::string get_rpc_url() const;

  /**
   * @brief Check if client is connected
   * @return true if client can make RPC calls
   */
  bool is_connected() const;

 private:
  class Impl;
  std::unique_ptr<Impl> pimpl_;

  // Friend declarations for other SDK classes
  friend class Agent;
  friend class Mcp;
  friend class Payments;
  friend class TransactionBuilder;
};

/**
 * @brief Transaction builder for creating Solana transactions
 *
 * This class provides a fluent interface for building transactions
 * with proper instruction sequencing and fee calculation.
 */
class TransactionBuilder {
 public:
  /**
   * @brief Construct transaction builder
   * @param client Client to use for transaction operations
   */
  explicit TransactionBuilder(Client &client);

  /**
   * @brief Destructor
   */
  ~TransactionBuilder();

  /**
   * @brief Move constructor
   */
  TransactionBuilder(TransactionBuilder &&other) noexcept;

  /**
   * @brief Move assignment
   */
  TransactionBuilder &operator=(TransactionBuilder &&other) noexcept;

  // Delete copy constructor and assignment
  TransactionBuilder(const TransactionBuilder &) = delete;
  TransactionBuilder &operator=(const TransactionBuilder &) = delete;

  /**
   * @brief Set the fee payer for the transaction
   * @param payer Public key of the fee payer
   * @return Reference to this builder for chaining
   */
  TransactionBuilder &set_payer(const PublicKey &payer);

  /**
   * @brief Set recent blockhash (auto-fetched if not set)
   * @param blockhash Recent blockhash string
   * @return Reference to this builder for chaining
   */
  TransactionBuilder &set_recent_blockhash(const std::string &blockhash);

  /**
   * @brief Add an instruction to the transaction
   * @param program_id Program ID for the instruction
   * @param accounts List of account public keys for the instruction
   * @param data Instruction data
   * @return Reference to this builder for chaining
   */
  TransactionBuilder &add_instruction(const PublicKey &program_id,
                                      const std::vector<PublicKey> &accounts,
                                      const std::vector<uint8_t> &data);

  /**
   * @brief Build the transaction
   * @return Serialized transaction data ready for signing
   * @throws TransactionException if build fails
   */
  std::vector<uint8_t> build();

  /**
   * @brief Build and sign transaction with provided keypair
   * @param keypair_data Private key data (32 bytes)
   * @return Signed transaction data ready for sending
   * @throws TransactionException if signing fails
   */
  std::vector<uint8_t> build_and_sign(const std::vector<uint8_t> &keypair_data);

  /**
   * @brief Estimate transaction fee
   * @return Estimated fee in lamports
   * @throws RpcException if estimation fails
   */
  uint64_t estimate_fee();

  /**
   * @brief Clear all instructions and reset builder
   * @return Reference to this builder for chaining
   */
  TransactionBuilder &clear();

 private:
  class Impl;
  std::unique_ptr<Impl> pimpl_;
};

}  // namespace SolanaAiRegistries
