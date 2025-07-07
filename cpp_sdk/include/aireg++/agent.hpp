/**
 * @file agent.hpp
 * @brief Agent registry operations for Solana AI Registries
 * 
 * This header provides the Agent class for managing AI agent registrations,
 * including CRUD operations and registry queries.
 * 
 * @version 1.0.0
 * @author Solana AI Registries Team
 */

#pragma once

#include <aireg++/common.hpp>
#include <aireg++/client.hpp>
#include <string>
#include <memory>
#include <optional>
#include <vector>
#include <chrono>

namespace SolanaAiRegistries {

/**
 * @brief Agent capability types
 */
enum class AgentCapability {
    TextGeneration,     ///< Text generation capabilities
    ImageGeneration,    ///< Image generation capabilities
    CodeGeneration,     ///< Code generation capabilities
    DataAnalysis,       ///< Data analysis capabilities
    WebSearch,          ///< Web search capabilities
    Custom              ///< Custom capabilities
};

/**
 * @brief Agent pricing model
 */
enum class PricingModel {
    PerRequest,         ///< Per-request pricing
    PerToken,           ///< Per-token pricing
    Subscription,       ///< Subscription-based pricing
    Free               ///< Free usage
};

/**
 * @brief Agent registry entry information
 */
struct AgentInfo {
    PublicKey agent_id;                              ///< Unique agent identifier
    std::string name;                                ///< Agent display name
    std::string description;                         ///< Agent description
    std::string version;                             ///< Agent version
    PublicKey owner;                                 ///< Agent owner public key
    std::vector<AgentCapability> capabilities;       ///< Agent capabilities
    std::string api_endpoint;                        ///< Agent API endpoint URL
    PricingModel pricing_model;                      ///< Pricing model
    uint64_t price_per_request;                      ///< Price per request in lamports
    uint64_t price_per_token;                        ///< Price per token in lamports
    bool is_active;                                  ///< Whether agent is active
    std::chrono::system_clock::time_point created_at; ///< Creation timestamp
    std::chrono::system_clock::time_point updated_at; ///< Last update timestamp
    std::optional<std::string> metadata_uri;         ///< URI to additional metadata
    std::vector<std::string> tags;                   ///< Agent tags for categorization
};

/**
 * @brief Agent search filters
 */
struct AgentSearchFilters {
    std::optional<std::string> name_contains;           ///< Filter by name containing text
    std::optional<std::vector<AgentCapability>> capabilities; ///< Filter by capabilities
    std::optional<PricingModel> pricing_model;          ///< Filter by pricing model
    std::optional<uint64_t> max_price_per_request;      ///< Maximum price per request
    std::optional<uint64_t> max_price_per_token;        ///< Maximum price per token
    std::optional<bool> active_only;                    ///< Show only active agents
    std::optional<std::vector<std::string>> tags;       ///< Filter by tags
    std::optional<PublicKey> owner;                     ///< Filter by owner
};

/**
 * @brief Agent registration parameters
 */
struct AgentRegistrationParams {
    std::string name;                                ///< Agent name (required)
    std::string description;                         ///< Agent description (required)
    std::string version;                             ///< Agent version (required)
    std::vector<AgentCapability> capabilities;       ///< Agent capabilities (required)
    std::string api_endpoint;                        ///< API endpoint URL (required)
    PricingModel pricing_model;                      ///< Pricing model (required)
    uint64_t price_per_request = 0;                  ///< Price per request in lamports
    uint64_t price_per_token = 0;                    ///< Price per token in lamports
    std::optional<std::string> metadata_uri;         ///< URI to additional metadata
    std::vector<std::string> tags;                   ///< Agent tags
};

/**
 * @brief Agent update parameters
 */
struct AgentUpdateParams {
    std::optional<std::string> name;                 ///< New agent name
    std::optional<std::string> description;          ///< New agent description
    std::optional<std::string> version;              ///< New agent version
    std::optional<std::vector<AgentCapability>> capabilities; ///< New capabilities
    std::optional<std::string> api_endpoint;         ///< New API endpoint
    std::optional<PricingModel> pricing_model;       ///< New pricing model
    std::optional<uint64_t> price_per_request;       ///< New price per request
    std::optional<uint64_t> price_per_token;         ///< New price per token
    std::optional<bool> is_active;                   ///< New active status
    std::optional<std::string> metadata_uri;         ///< New metadata URI
    std::optional<std::vector<std::string>> tags;    ///< New tags
};

/**
 * @brief Agent class for managing AI agent registrations
 * 
 * This class provides comprehensive CRUD operations for managing AI agent
 * registrations in the Solana AI Registries. It handles agent registration,
 * updates, queries, and deactivation with proper error handling and validation.
 */
class Agent {
public:
    /**
     * @brief Construct Agent with client
     * @param client Client instance for blockchain operations
     */
    explicit Agent(Client& client);
    
    /**
     * @brief Destructor
     */
    ~Agent();
    
    /**
     * @brief Move constructor
     */
    Agent(Agent&& other) noexcept;
    
    /**
     * @brief Move assignment
     */
    Agent& operator=(Agent&& other) noexcept;
    
    // Delete copy constructor and assignment
    Agent(const Agent&) = delete;
    Agent& operator=(const Agent&) = delete;
    
    /**
     * @brief Register a new agent
     * @param params Agent registration parameters
     * @param owner_keypair Owner's private key for signing (32 bytes)
     * @return Agent ID (public key) of the registered agent
     * @throws RegistryException if registration fails
     */
    PublicKey register_agent(const AgentRegistrationParams& params,
                            const std::vector<uint8_t>& owner_keypair);
    
    /**
     * @brief Update an existing agent
     * @param agent_id Agent ID to update
     * @param params Update parameters
     * @param owner_keypair Owner's private key for signing (32 bytes)
     * @return Transaction signature
     * @throws RegistryException if update fails or caller is not the owner
     */
    Signature update_agent(const PublicKey& agent_id,
                          const AgentUpdateParams& params,
                          const std::vector<uint8_t>& owner_keypair);
    
    /**
     * @brief Get agent information
     * @param agent_id Agent ID to query
     * @return Agent information, or nullopt if not found
     * @throws RegistryException if query fails
     */
    std::optional<AgentInfo> get_agent(const PublicKey& agent_id);
    
    /**
     * @brief Search for agents with filters
     * @param filters Search filters
     * @param limit Maximum number of results (default: 100)
     * @param offset Offset for pagination (default: 0)
     * @return List of matching agents
     * @throws RegistryException if search fails
     */
    std::vector<AgentInfo> search_agents(const AgentSearchFilters& filters = {},
                                        size_t limit = 100,
                                        size_t offset = 0);
    
    /**
     * @brief Get all agents owned by a public key
     * @param owner Owner public key
     * @param active_only Whether to return only active agents
     * @return List of owned agents
     * @throws RegistryException if query fails
     */
    std::vector<AgentInfo> get_agents_by_owner(const PublicKey& owner,
                                              bool active_only = false);
    
    /**
     * @brief Deactivate an agent
     * @param agent_id Agent ID to deactivate
     * @param owner_keypair Owner's private key for signing (32 bytes)
     * @return Transaction signature
     * @throws RegistryException if deactivation fails or caller is not the owner
     */
    Signature deactivate_agent(const PublicKey& agent_id,
                              const std::vector<uint8_t>& owner_keypair);
    
    /**
     * @brief Reactivate an agent
     * @param agent_id Agent ID to reactivate
     * @param owner_keypair Owner's private key for signing (32 bytes)
     * @return Transaction signature
     * @throws RegistryException if reactivation fails or caller is not the owner
     */
    Signature reactivate_agent(const PublicKey& agent_id,
                              const std::vector<uint8_t>& owner_keypair);
    
    /**
     * @brief Delete an agent permanently
     * @param agent_id Agent ID to delete
     * @param owner_keypair Owner's private key for signing (32 bytes)
     * @return Transaction signature
     * @throws RegistryException if deletion fails or caller is not the owner
     */
    Signature delete_agent(const PublicKey& agent_id,
                          const std::vector<uint8_t>& owner_keypair);
    
    /**
     * @brief Get agent statistics
     * @return Total number of registered agents
     * @throws RegistryException if query fails
     */
    uint64_t get_agent_count();
    
    /**
     * @brief Get agent capabilities as strings
     * @param capability Agent capability enum
     * @return Human-readable capability name
     */
    static std::string capability_to_string(AgentCapability capability);
    
    /**
     * @brief Parse capability from string
     * @param capability_str Capability string
     * @return Agent capability enum
     * @throws std::invalid_argument if string is invalid
     */
    static AgentCapability string_to_capability(const std::string& capability_str);
    
    /**
     * @brief Get pricing model as string
     * @param model Pricing model enum
     * @return Human-readable pricing model name
     */
    static std::string pricing_model_to_string(PricingModel model);
    
    /**
     * @brief Parse pricing model from string
     * @param model_str Pricing model string
     * @return Pricing model enum
     * @throws std::invalid_argument if string is invalid
     */
    static PricingModel string_to_pricing_model(const std::string& model_str);
    
    /**
     * @brief Validate agent registration parameters
     * @param params Parameters to validate
     * @throws std::invalid_argument if parameters are invalid
     */
    static void validate_registration_params(const AgentRegistrationParams& params);

private:
    class Impl;
    std::unique_ptr<Impl> pimpl_;
};

} // namespace SolanaAiRegistries
