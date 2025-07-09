/**
 * @file c_sdk_bridge.hpp
 * @brief C SDK bridge with custom deleters and RAII wrappers
 *
 * This header provides custom deleters and RAII wrappers for C SDK resources
 * using std::unique_ptr as recommended in the implementation guidelines.
 *
 * @version 1.0.0
 * @author Solana AI Registries Team
 */

#pragma once

#include <cstdint>
#include <memory>

extern "C" {
// Forward declarations for C SDK types
typedef struct aireg_client_t aireg_client_t;
typedef struct aireg_transaction_builder_t aireg_transaction_builder_t;
typedef struct aireg_agent_t aireg_agent_t;
typedef struct aireg_mcp_t aireg_mcp_t;
typedef struct aireg_payments_t aireg_payments_t;
typedef struct aireg_account_info_t aireg_account_info_t;
typedef struct aireg_transaction_result_t aireg_transaction_result_t;
typedef struct aireg_agent_info_t aireg_agent_info_t;
typedef struct aireg_mcp_server_info_t aireg_mcp_server_info_t;
typedef struct aireg_payment_info_t aireg_payment_info_t;
typedef struct aireg_balance_info_t aireg_balance_info_t;

// C SDK function declarations

// Client functions
aireg_client_t *aireg_client_create(const char *rpc_url, uint32_t cluster);
void aireg_client_destroy(aireg_client_t *client);

// Transaction builder functions
aireg_transaction_builder_t *
aireg_transaction_builder_create(aireg_client_t *client);
void aireg_transaction_builder_destroy(aireg_transaction_builder_t *builder);

// Agent functions
aireg_agent_t *aireg_agent_create(aireg_client_t *client);
void aireg_agent_destroy(aireg_agent_t *agent);

// MCP functions
aireg_mcp_t *aireg_mcp_create(aireg_client_t *client);
void aireg_mcp_destroy(aireg_mcp_t *mcp);

// Payments functions
aireg_payments_t *aireg_payments_create(aireg_client_t *client);
void aireg_payments_destroy(aireg_payments_t *payments);

// Account info functions
aireg_account_info_t *aireg_account_info_create(void);
void aireg_account_info_destroy(aireg_account_info_t *info);

// Transaction result functions
aireg_transaction_result_t *aireg_transaction_result_create(void);
void aireg_transaction_result_destroy(aireg_transaction_result_t *result);

// Agent info functions
aireg_agent_info_t *aireg_agent_info_create(void);
void aireg_agent_info_destroy(aireg_agent_info_t *info);

// MCP server info functions
aireg_mcp_server_info_t *aireg_mcp_server_info_create(void);
void aireg_mcp_server_info_destroy(aireg_mcp_server_info_t *info);

// Payment info functions
aireg_payment_info_t *aireg_payment_info_create(void);
void aireg_payment_info_destroy(aireg_payment_info_t *info);

// Balance info functions
aireg_balance_info_t *aireg_balance_info_create(void);
void aireg_balance_info_destroy(aireg_balance_info_t *info);
}

namespace SolanaAiRegistries {
namespace Bridge {

// Custom deleters for C SDK resources following RAII principles
struct ClientDeleter {
  void operator()(aireg_client_t *client) const noexcept {
    if (client) {
      aireg_client_destroy(client);
    }
  }
};

struct TransactionBuilderDeleter {
  void operator()(aireg_transaction_builder_t *builder) const noexcept {
    if (builder) {
      aireg_transaction_builder_destroy(builder);
    }
  }
};

struct AgentDeleter {
  void operator()(aireg_agent_t *agent) const noexcept {
    if (agent) {
      aireg_agent_destroy(agent);
    }
  }
};

struct McpDeleter {
  void operator()(aireg_mcp_t *mcp) const noexcept {
    if (mcp) {
      aireg_mcp_destroy(mcp);
    }
  }
};

struct PaymentsDeleter {
  void operator()(aireg_payments_t *payments) const noexcept {
    if (payments) {
      aireg_payments_destroy(payments);
    }
  }
};

struct AccountInfoDeleter {
  void operator()(aireg_account_info_t *info) const noexcept {
    if (info) {
      aireg_account_info_destroy(info);
    }
  }
};

struct TransactionResultDeleter {
  void operator()(aireg_transaction_result_t *result) const noexcept {
    if (result) {
      aireg_transaction_result_destroy(result);
    }
  }
};

struct AgentInfoDeleter {
  void operator()(aireg_agent_info_t *info) const noexcept {
    if (info) {
      aireg_agent_info_destroy(info);
    }
  }
};

struct McpServerInfoDeleter {
  void operator()(aireg_mcp_server_info_t *info) const noexcept {
    if (info) {
      aireg_mcp_server_info_destroy(info);
    }
  }
};

struct PaymentInfoDeleter {
  void operator()(aireg_payment_info_t *info) const noexcept {
    if (info) {
      aireg_payment_info_destroy(info);
    }
  }
};

struct BalanceInfoDeleter {
  void operator()(aireg_balance_info_t *info) const noexcept {
    if (info) {
      aireg_balance_info_destroy(info);
    }
  }
};

// Type aliases for RAII wrappers using std::unique_ptr with custom deleters
using ClientPtr = std::unique_ptr<aireg_client_t, ClientDeleter>;
using TransactionBuilderPtr =
    std::unique_ptr<aireg_transaction_builder_t, TransactionBuilderDeleter>;
using AgentPtr = std::unique_ptr<aireg_agent_t, AgentDeleter>;
using McpPtr = std::unique_ptr<aireg_mcp_t, McpDeleter>;
using PaymentsPtr = std::unique_ptr<aireg_payments_t, PaymentsDeleter>;
using AccountInfoPtr =
    std::unique_ptr<aireg_account_info_t, AccountInfoDeleter>;
using TransactionResultPtr =
    std::unique_ptr<aireg_transaction_result_t, TransactionResultDeleter>;
using AgentInfoPtr = std::unique_ptr<aireg_agent_info_t, AgentInfoDeleter>;
using McpServerInfoPtr =
    std::unique_ptr<aireg_mcp_server_info_t, McpServerInfoDeleter>;
using PaymentInfoPtr =
    std::unique_ptr<aireg_payment_info_t, PaymentInfoDeleter>;
using BalanceInfoPtr =
    std::unique_ptr<aireg_balance_info_t, BalanceInfoDeleter>;

// Factory functions for creating RAII wrappers
/**
 * @brief Create a client with automatic resource management
 * @param rpc_url RPC URL for the client
 * @param cluster Cluster ID (0=devnet, 1=testnet, 2=mainnet)
 * @return RAII wrapper for client
 */
inline ClientPtr make_client(const char *rpc_url, uint32_t cluster) {
  return ClientPtr(aireg_client_create(rpc_url, cluster));
}

/**
 * @brief Create a transaction builder with automatic resource management
 * @param client Client to use for the builder
 * @return RAII wrapper for transaction builder
 */
inline TransactionBuilderPtr make_transaction_builder(aireg_client_t *client) {
  return TransactionBuilderPtr(aireg_transaction_builder_create(client));
}

/**
 * @brief Create an agent with automatic resource management
 * @param client Client to use for the agent
 * @return RAII wrapper for agent
 */
inline AgentPtr make_agent(aireg_client_t *client) {
  return AgentPtr(aireg_agent_create(client));
}

/**
 * @brief Create an MCP with automatic resource management
 * @param client Client to use for the MCP
 * @return RAII wrapper for MCP
 */
inline McpPtr make_mcp(aireg_client_t *client) {
  return McpPtr(aireg_mcp_create(client));
}

/**
 * @brief Create a payments with automatic resource management
 * @param client Client to use for the payments
 * @return RAII wrapper for payments
 */
inline PaymentsPtr make_payments(aireg_client_t *client) {
  return PaymentsPtr(aireg_payments_create(client));
}

/**
 * @brief Create an account info with automatic resource management
 * @return RAII wrapper for account info
 */
inline AccountInfoPtr make_account_info() {
  return AccountInfoPtr(aireg_account_info_create());
}

/**
 * @brief Create a transaction result with automatic resource management
 * @return RAII wrapper for transaction result
 */
inline TransactionResultPtr make_transaction_result() {
  return TransactionResultPtr(aireg_transaction_result_create());
}

/**
 * @brief Create an agent info with automatic resource management
 * @return RAII wrapper for agent info
 */
inline AgentInfoPtr make_agent_info() {
  return AgentInfoPtr(aireg_agent_info_create());
}

/**
 * @brief Create an MCP server info with automatic resource management
 * @return RAII wrapper for MCP server info
 */
inline McpServerInfoPtr make_mcp_server_info() {
  return McpServerInfoPtr(aireg_mcp_server_info_create());
}

/**
 * @brief Create a payment info with automatic resource management
 * @return RAII wrapper for payment info
 */
inline PaymentInfoPtr make_payment_info() {
  return PaymentInfoPtr(aireg_payment_info_create());
}

/**
 * @brief Create a balance info with automatic resource management
 * @return RAII wrapper for balance info
 */
inline BalanceInfoPtr make_balance_info() {
  return BalanceInfoPtr(aireg_balance_info_create());
}

} // namespace Bridge
} // namespace SolanaAiRegistries