/**
 * @file mcp.hpp
 * @brief MCP (Model Context Protocol) server registry operations
 *
 * This header provides the Mcp class for managing MCP server registrations,
 * including CRUD operations and server discovery.
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
 * @brief MCP server protocol types
 */
enum class McpProtocol {
  Http,      ///< HTTP-based protocol
  WebSocket, ///< WebSocket protocol
  Stdio,     ///< Standard I/O protocol
  Custom     ///< Custom protocol
};

/**
 * @brief MCP server capability types
 */
enum class McpCapability {
  Resources, ///< Resource management
  Tools,     ///< Tool execution
  Prompts,   ///< Prompt templates
  Sampling,  ///< Text sampling
  Logging,   ///< Logging capabilities
  Custom     ///< Custom capabilities
};

/**
 * @brief MCP server registry entry information
 */
struct McpServerInfo {
  PublicKey server_id;     ///< Unique server identifier
  std::string name;        ///< Server display name
  std::string description; ///< Server description
  std::string version;     ///< Server version
  PublicKey owner;         ///< Server owner public key
  McpProtocol protocol;    ///< Communication protocol
  std::string endpoint;    ///< Server endpoint (URL, command, etc.)
  std::vector<McpCapability> capabilities; ///< Server capabilities
  bool is_active;                          ///< Whether server is active
  std::chrono::system_clock::time_point created_at; ///< Creation timestamp
  std::chrono::system_clock::time_point updated_at; ///< Last update timestamp
  std::optional<std::string> schema_uri; ///< URI to MCP schema definition
  std::optional<std::string> documentation_uri; ///< URI to documentation
  std::vector<std::string> tags;             ///< Server tags for categorization
  std::optional<std::string> license;        ///< License information
  std::optional<std::string> repository_uri; ///< Source code repository URI
};

/**
 * @brief MCP server search filters
 */
struct McpSearchFilters {
  std::optional<std::string> name_contains; ///< Filter by name containing text
  std::optional<McpProtocol> protocol;      ///< Filter by protocol type
  std::optional<std::vector<McpCapability>>
      capabilities;                             ///< Filter by capabilities
  std::optional<bool> active_only;              ///< Show only active servers
  std::optional<std::vector<std::string>> tags; ///< Filter by tags
  std::optional<PublicKey> owner;               ///< Filter by owner
  std::optional<std::string> license;           ///< Filter by license
};

/**
 * @brief MCP server registration parameters
 */
struct McpRegistrationParams {
  std::string name;        ///< Server name (required)
  std::string description; ///< Server description (required)
  std::string version;     ///< Server version (required)
  McpProtocol protocol;    ///< Communication protocol (required)
  std::string endpoint;    ///< Server endpoint (required)
  std::vector<McpCapability> capabilities; ///< Server capabilities (required)
  std::optional<std::string> schema_uri;   ///< MCP schema definition URI
  std::optional<std::string> documentation_uri; ///< Documentation URI
  std::vector<std::string> tags;                ///< Server tags
  std::optional<std::string> license;           ///< License information
  std::optional<std::string> repository_uri;    ///< Source code repository URI
};

/**
 * @brief MCP server update parameters
 */
struct McpUpdateParams {
  std::optional<std::string> name;        ///< New server name
  std::optional<std::string> description; ///< New server description
  std::optional<std::string> version;     ///< New server version
  std::optional<McpProtocol> protocol;    ///< New communication protocol
  std::optional<std::string> endpoint;    ///< New server endpoint
  std::optional<std::vector<McpCapability>> capabilities; ///< New capabilities
  std::optional<bool> is_active;                          ///< New active status
  std::optional<std::string> schema_uri;                  ///< New schema URI
  std::optional<std::string> documentation_uri; ///< New documentation URI
  std::optional<std::vector<std::string>> tags; ///< New tags
  std::optional<std::string> license;           ///< New license
  std::optional<std::string> repository_uri;    ///< New repository URI
};

/**
 * @brief MCP class for managing Model Context Protocol server registrations
 *
 * This class provides comprehensive CRUD operations for managing MCP server
 * registrations in the Solana AI Registries. It handles server registration,
 * updates, queries, and discovery with proper error handling and validation.
 */
class Mcp {
public:
  /**
   * @brief Construct Mcp with client
   * @param client Client instance for blockchain operations
   */
  explicit Mcp(Client &client);

  /**
   * @brief Destructor
   */
  ~Mcp();

  /**
   * @brief Move constructor
   */
  Mcp(Mcp &&other) noexcept;

  /**
   * @brief Move assignment
   */
  Mcp &operator=(Mcp &&other) noexcept;

  // Delete copy constructor and assignment
  Mcp(const Mcp &) = delete;
  Mcp &operator=(const Mcp &) = delete;

  /**
   * @brief Register a new MCP server
   * @param params Server registration parameters
   * @param owner_keypair Owner's private key for signing (32 bytes)
   * @return Server ID (public key) of the registered server
   * @throws RegistryException if registration fails
   */
  PublicKey register_server(const McpRegistrationParams &params,
                            const std::vector<uint8_t> &owner_keypair);

  /**
   * @brief Update an existing MCP server
   * @param server_id Server ID to update
   * @param params Update parameters
   * @param owner_keypair Owner's private key for signing (32 bytes)
   * @return Transaction signature
   * @throws RegistryException if update fails or caller is not the owner
   */
  Signature update_server(const PublicKey &server_id,
                          const McpUpdateParams &params,
                          const std::vector<uint8_t> &owner_keypair);

  /**
   * @brief Get MCP server information
   * @param server_id Server ID to query
   * @return Server information, or nullopt if not found
   * @throws RegistryException if query fails
   */
  std::optional<McpServerInfo> get_server(const PublicKey &server_id);

  /**
   * @brief Search for MCP servers with filters
   * @param filters Search filters
   * @param limit Maximum number of results (default: 100)
   * @param offset Offset for pagination (default: 0)
   * @return List of matching servers
   * @throws RegistryException if search fails
   */
  std::vector<McpServerInfo>
  search_servers(const McpSearchFilters &filters = {}, size_t limit = 100,
                 size_t offset = 0);

  /**
   * @brief Get all servers owned by a public key
   * @param owner Owner public key
   * @param active_only Whether to return only active servers
   * @return List of owned servers
   * @throws RegistryException if query fails
   */
  std::vector<McpServerInfo> get_servers_by_owner(const PublicKey &owner,
                                                  bool active_only = false);

  /**
   * @brief Get servers by capability
   * @param capability Desired capability
   * @param active_only Whether to return only active servers
   * @return List of servers with the specified capability
   * @throws RegistryException if query fails
   */
  std::vector<McpServerInfo> get_servers_by_capability(McpCapability capability,
                                                       bool active_only = true);

  /**
   * @brief Deactivate a server
   * @param server_id Server ID to deactivate
   * @param owner_keypair Owner's private key for signing (32 bytes)
   * @return Transaction signature
   * @throws RegistryException if deactivation fails or caller is not the owner
   */
  Signature deactivate_server(const PublicKey &server_id,
                              const std::vector<uint8_t> &owner_keypair);

  /**
   * @brief Reactivate a server
   * @param server_id Server ID to reactivate
   * @param owner_keypair Owner's private key for signing (32 bytes)
   * @return Transaction signature
   * @throws RegistryException if reactivation fails or caller is not the owner
   */
  Signature reactivate_server(const PublicKey &server_id,
                              const std::vector<uint8_t> &owner_keypair);

  /**
   * @brief Delete a server permanently
   * @param server_id Server ID to delete
   * @param owner_keypair Owner's private key for signing (32 bytes)
   * @return Transaction signature
   * @throws RegistryException if deletion fails or caller is not the owner
   */
  Signature delete_server(const PublicKey &server_id,
                          const std::vector<uint8_t> &owner_keypair);

  /**
   * @brief Get server statistics
   * @return Total number of registered servers
   * @throws RegistryException if query fails
   */
  uint64_t get_server_count();

  /**
   * @brief Get protocol as string
   * @param protocol MCP protocol enum
   * @return Human-readable protocol name
   */
  static std::string protocol_to_string(McpProtocol protocol);

  /**
   * @brief Parse protocol from string
   * @param protocol_str Protocol string
   * @return MCP protocol enum
   * @throws std::invalid_argument if string is invalid
   */
  static McpProtocol string_to_protocol(const std::string &protocol_str);

  /**
   * @brief Get capability as string
   * @param capability MCP capability enum
   * @return Human-readable capability name
   */
  static std::string capability_to_string(McpCapability capability);

  /**
   * @brief Parse capability from string
   * @param capability_str Capability string
   * @return MCP capability enum
   * @throws std::invalid_argument if string is invalid
   */
  static McpCapability string_to_capability(const std::string &capability_str);

  /**
   * @brief Validate server registration parameters
   * @param params Parameters to validate
   * @throws std::invalid_argument if parameters are invalid
   */
  static void validate_registration_params(const McpRegistrationParams &params);

  /**
   * @brief Validate endpoint for given protocol
   * @param protocol Protocol type
   * @param endpoint Endpoint string
   * @throws std::invalid_argument if endpoint is invalid for protocol
   */
  static void validate_endpoint(McpProtocol protocol,
                                const std::string &endpoint);

private:
  class Impl;
  std::unique_ptr<Impl> pimpl_;
};

} // namespace SolanaAiRegistries
