/**
 * @file payments.hpp
 * @brief Payment processing for Solana AI Registries
 *
 * This header provides the Payments class for handling different payment flows
 * including prepay, pay-as-you-go, and stream payments.
 *
 * @version 1.0.0
 * @author Solana AI Registries Team
 */

#pragma once

#include <aireg++/client.hpp>
#include <aireg++/common.hpp>
#include <chrono>
#include <memory>
#include <optional>
#include <string>
#include <vector>

namespace SolanaAiRegistries {

/**
 * @brief Payment method types
 */
enum class PaymentMethod {
  Sol,        ///< Native SOL payments
  SvmaiToken, ///< SVMAI token payments
  Usdc,       ///< USDC payments
  Custom      ///< Custom SPL token payments
};

/**
 * @brief Payment status
 */
enum class PaymentStatus {
  Pending,   ///< Payment is pending
  Completed, ///< Payment completed successfully
  Failed,    ///< Payment failed
  Refunded,  ///< Payment was refunded
  Expired    ///< Payment expired
};

/**
 * @brief Payment type
 */
enum class PaymentType {
  Prepay,       ///< One-time prepayment
  PayAsYouGo,   ///< Pay-as-you-go per request
  Subscription, ///< Recurring subscription
  Stream        ///< Continuous streaming payment
};

/**
 * @brief Payment information
 */
struct PaymentInfo {
  PublicKey payment_id; ///< Unique payment identifier
  PublicKey payer;      ///< Payer public key
  PublicKey recipient;  ///< Recipient public key
  PaymentMethod method; ///< Payment method used
  PaymentType type;     ///< Payment type
  uint64_t amount;      ///< Payment amount (in base units)
  PaymentStatus status; ///< Current payment status
  std::chrono::system_clock::time_point created_at; ///< Creation timestamp
  std::chrono::system_clock::time_point updated_at; ///< Last update timestamp
  std::optional<Signature>
      transaction_signature;       ///< Transaction signature if completed
  std::optional<std::string> memo; ///< Payment memo
  std::optional<std::chrono::system_clock::time_point>
      expires_at; ///< Expiration time
};

/**
 * @brief Prepayment parameters
 */
struct PrepayParams {
  PublicKey recipient; ///< Payment recipient
  uint64_t amount;     ///< Amount to prepay (in base units)
  PaymentMethod method = PaymentMethod::Sol; ///< Payment method
  std::optional<PublicKey>
      token_mint;                  ///< Custom token mint (if method is Custom)
  std::optional<std::string> memo; ///< Payment memo
  std::optional<std::chrono::minutes> expires_in; ///< Expiration time from now
};

/**
 * @brief Pay-as-you-go payment parameters
 */
struct PayAsYouGoParams {
  PublicKey service_provider;  ///< Service provider public key
  uint64_t amount_per_request; ///< Amount per request (in base units)
  PaymentMethod method = PaymentMethod::Sol; ///< Payment method
  std::optional<PublicKey>
      token_mint; ///< Custom token mint (if method is Custom)
  std::optional<uint64_t> max_requests; ///< Maximum number of requests
  std::optional<std::string> memo;      ///< Payment memo
};

/**
 * @brief Subscription parameters
 */
struct SubscriptionParams {
  PublicKey service_provider; ///< Service provider public key
  uint64_t amount_per_period; ///< Amount per billing period (in base units)
  std::chrono::seconds billing_period;       ///< Billing period duration
  PaymentMethod method = PaymentMethod::Sol; ///< Payment method
  std::optional<PublicKey>
      token_mint; ///< Custom token mint (if method is Custom)
  std::optional<uint32_t> max_periods; ///< Maximum number of billing periods
  std::optional<std::string> memo;     ///< Payment memo
};

/**
 * @brief Stream payment parameters
 */
struct StreamParams {
  PublicKey recipient;           ///< Payment recipient
  uint64_t rate_per_second;      ///< Payment rate per second (in base units)
  std::chrono::seconds duration; ///< Stream duration
  PaymentMethod method = PaymentMethod::Sol; ///< Payment method
  std::optional<PublicKey>
      token_mint;                  ///< Custom token mint (if method is Custom)
  std::optional<std::string> memo; ///< Payment memo
};

/**
 * @brief Payment search filters
 */
struct PaymentSearchFilters {
  std::optional<PublicKey> payer;      ///< Filter by payer
  std::optional<PublicKey> recipient;  ///< Filter by recipient
  std::optional<PaymentMethod> method; ///< Filter by payment method
  std::optional<PaymentType> type;     ///< Filter by payment type
  std::optional<PaymentStatus> status; ///< Filter by status
  std::optional<std::chrono::system_clock::time_point>
      created_after; ///< Created after timestamp
  std::optional<std::chrono::system_clock::time_point>
      created_before;                 ///< Created before timestamp
  std::optional<uint64_t> min_amount; ///< Minimum amount
  std::optional<uint64_t> max_amount; ///< Maximum amount
};

/**
 * @brief Balance information for an account
 */
struct BalanceInfo {
  PublicKey account;                   ///< Account public key
  uint64_t balance;                    ///< Account balance (in base units)
  PaymentMethod method;                ///< Token/currency type
  std::optional<PublicKey> token_mint; ///< Token mint (for SPL tokens)
  bool is_native;                      ///< Whether this is native SOL
};

/**
 * @brief Payments class for handling various payment flows
 *
 * This class provides comprehensive payment processing capabilities for
 * Solana AI Registries, including prepayments, pay-as-you-go, subscriptions,
 * and streaming payments with proper error handling and validation.
 */
class Payments {
public:
  /**
   * @brief Construct Payments with client
   * @param client Client instance for blockchain operations
   */
  explicit Payments(Client &client);

  /**
   * @brief Destructor
   */
  ~Payments();

  /**
   * @brief Move constructor
   */
  Payments(Payments &&other) noexcept;

  /**
   * @brief Move assignment
   */
  Payments &operator=(Payments &&other) noexcept;

  // Delete copy constructor and assignment
  Payments(const Payments &) = delete;
  Payments &operator=(const Payments &) = delete;

  /**
   * @brief Create a prepayment
   * @param params Prepayment parameters
   * @param payer_keypair Payer's private key for signing (32 bytes)
   * @return Payment ID and transaction signature
   * @throws PaymentException if payment creation fails
   */
  std::pair<PublicKey, Signature>
  create_prepayment(const PrepayParams &params,
                    const std::vector<uint8_t> &payer_keypair);

  /**
   * @brief Execute a pay-as-you-go payment
   * @param params Pay-as-you-go parameters
   * @param payer_keypair Payer's private key for signing (32 bytes)
   * @return Payment ID and transaction signature
   * @throws PaymentException if payment fails
   */
  std::pair<PublicKey, Signature>
  pay_as_you_go(const PayAsYouGoParams &params,
                const std::vector<uint8_t> &payer_keypair);

  /**
   * @brief Create a subscription
   * @param params Subscription parameters
   * @param payer_keypair Payer's private key for signing (32 bytes)
   * @return Subscription ID and initial payment signature
   * @throws PaymentException if subscription creation fails
   */
  std::pair<PublicKey, Signature>
  create_subscription(const SubscriptionParams &params,
                      const std::vector<uint8_t> &payer_keypair);

  /**
   * @brief Start a stream payment
   * @param params Stream parameters
   * @param payer_keypair Payer's private key for signing (32 bytes)
   * @return Stream ID and transaction signature
   * @throws PaymentException if stream creation fails
   */
  std::pair<PublicKey, Signature>
  start_stream(const StreamParams &params,
               const std::vector<uint8_t> &payer_keypair);

  /**
   * @brief Stop a stream payment
   * @param stream_id Stream ID to stop
   * @param payer_keypair Payer's private key for signing (32 bytes)
   * @return Transaction signature
   * @throws PaymentException if stream stop fails
   */
  Signature stop_stream(const PublicKey &stream_id,
                        const std::vector<uint8_t> &payer_keypair);

  /**
   * @brief Cancel a subscription
   * @param subscription_id Subscription ID to cancel
   * @param payer_keypair Payer's private key for signing (32 bytes)
   * @return Transaction signature
   * @throws PaymentException if cancellation fails
   */
  Signature cancel_subscription(const PublicKey &subscription_id,
                                const std::vector<uint8_t> &payer_keypair);

  /**
   * @brief Get payment information
   * @param payment_id Payment ID to query
   * @return Payment information, or nullopt if not found
   * @throws PaymentException if query fails
   */
  std::optional<PaymentInfo> get_payment(const PublicKey &payment_id);

  /**
   * @brief Search for payments with filters
   * @param filters Search filters
   * @param limit Maximum number of results (default: 100)
   * @param offset Offset for pagination (default: 0)
   * @return List of matching payments
   * @throws PaymentException if search fails
   */
  std::vector<PaymentInfo>
  search_payments(const PaymentSearchFilters &filters = {}, size_t limit = 100,
                  size_t offset = 0);

  /**
   * @brief Get account balance for different payment methods
   * @param account Account public key
   * @param method Payment method to check
   * @param token_mint Token mint (required if method is Custom)
   * @return Balance information
   * @throws PaymentException if balance query fails
   */
  BalanceInfo get_balance(const PublicKey &account,
                          PaymentMethod method = PaymentMethod::Sol,
                          std::optional<PublicKey> token_mint = std::nullopt);

  /**
   * @brief Get all balances for an account
   * @param account Account public key
   * @return List of all token balances
   * @throws PaymentException if query fails
   */
  std::vector<BalanceInfo> get_all_balances(const PublicKey &account);

  /**
   * @brief Estimate payment fees
   * @param method Payment method
   * @param amount Payment amount
   * @return Estimated fee in lamports
   * @throws PaymentException if estimation fails
   */
  uint64_t estimate_payment_fee(PaymentMethod method, uint64_t amount);

  /**
   * @brief Request refund for a payment
   * @param payment_id Payment ID to refund
   * @param reason Refund reason
   * @param recipient_keypair Recipient's private key for signing (32 bytes)
   * @return Transaction signature
   * @throws PaymentException if refund fails
   */
  Signature request_refund(const PublicKey &payment_id,
                           const std::string &reason,
                           const std::vector<uint8_t> &recipient_keypair);

  /**
   * @brief Get payment method as string
   * @param method Payment method enum
   * @return Human-readable payment method name
   */
  static std::string payment_method_to_string(PaymentMethod method);

  /**
   * @brief Parse payment method from string
   * @param method_str Payment method string
   * @return Payment method enum
   * @throws std::invalid_argument if string is invalid
   */
  static PaymentMethod string_to_payment_method(const std::string &method_str);

  /**
   * @brief Get payment status as string
   * @param status Payment status enum
   * @return Human-readable status name
   */
  static std::string payment_status_to_string(PaymentStatus status);

  /**
   * @brief Get payment type as string
   * @param type Payment type enum
   * @return Human-readable type name
   */
  static std::string payment_type_to_string(PaymentType type);

  /**
   * @brief Validate prepayment parameters
   * @param params Parameters to validate
   * @throws std::invalid_argument if parameters are invalid
   */
  static void validate_prepay_params(const PrepayParams &params);

  /**
   * @brief Validate pay-as-you-go parameters
   * @param params Parameters to validate
   * @throws std::invalid_argument if parameters are invalid
   */
  static void validate_pay_as_you_go_params(const PayAsYouGoParams &params);

  /**
   * @brief Validate subscription parameters
   * @param params Parameters to validate
   * @throws std::invalid_argument if parameters are invalid
   */
  static void validate_subscription_params(const SubscriptionParams &params);

  /**
   * @brief Validate stream parameters
   * @param params Parameters to validate
   * @throws std::invalid_argument if parameters are invalid
   */
  static void validate_stream_params(const StreamParams &params);

private:
  class Impl;
  std::unique_ptr<Impl> pimpl_;
};

} // namespace SolanaAiRegistries
