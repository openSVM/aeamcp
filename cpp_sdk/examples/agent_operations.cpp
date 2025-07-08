/**
 * @file agent_operations.cpp
 * @brief Example demonstrating agent registry operations
 */

#include <aireg++/aireg++.hpp>
#include <iostream>
#include <vector>

using namespace SolanaAiRegistries;

int main() {
  try {
    initialize();

    ClientConfig config;
    config.cluster = Cluster::Devnet;
    Client client(config);
    Agent agent(client);

    std::cout << "Agent Registry Operations Example" << std::endl;
    std::cout << "=================================" << std::endl;

    // Search for existing agents
    std::cout << "\n1. Searching for existing agents..." << std::endl;
    AgentSearchFilters filters;
    filters.active_only = true;
    filters.capabilities = {AgentCapability::TextGeneration};

    auto agents = agent.search_agents(filters, 10, 0);
    std::cout << "Found " << agents.size() << " text generation agents"
              << std::endl;

    for (const auto &agent_info : agents) {
      std::cout << "  Agent: " << agent_info.name << std::endl;
      std::cout << "    ID: " << agent_info.agent_id.to_base58() << std::endl;
      std::cout << "    Version: " << agent_info.version << std::endl;
      std::cout << "    Pricing: "
                << Agent::pricing_model_to_string(agent_info.pricing_model)
                << std::endl;

      if (agent_info.pricing_model == PricingModel::PerRequest) {
        std::cout << "    Price: " << agent_info.price_per_request
                  << " lamports/request" << std::endl;
      }

      std::cout << "    Capabilities: ";
      for (size_t i = 0; i < agent_info.capabilities.size(); ++i) {
        if (i > 0)
          std::cout << ", ";
        std::cout << Agent::capability_to_string(agent_info.capabilities[i]);
      }
      std::cout << std::endl;

      std::cout << "    Tags: ";
      for (size_t i = 0; i < agent_info.tags.size(); ++i) {
        if (i > 0)
          std::cout << ", ";
        std::cout << agent_info.tags[i];
      }
      std::cout << std::endl << std::endl;
    }

    // Demonstrate parameter validation
    std::cout << "2. Demonstrating parameter validation..." << std::endl;

    AgentRegistrationParams valid_params;
    valid_params.name = "Example Text Agent";
    valid_params.description = "An example agent for text generation";
    valid_params.version = "1.0.0";
    valid_params.capabilities = {AgentCapability::TextGeneration,
                                 AgentCapability::CodeGeneration};
    valid_params.api_endpoint = "https://api.example.com/agent";
    valid_params.pricing_model = PricingModel::PerRequest;
    valid_params.price_per_request = 1000;
    valid_params.tags = {"ai", "text", "generation"};

    try {
      Agent::validate_registration_params(valid_params);
      std::cout << "  ✓ Valid parameters passed validation" << std::endl;
    } catch (const std::exception &e) {
      std::cout << "  ✗ Validation failed: " << e.what() << std::endl;
    }

    // Test invalid parameters
    AgentRegistrationParams invalid_params = valid_params;
    invalid_params.name = ""; // Invalid empty name

    try {
      Agent::validate_registration_params(invalid_params);
      std::cout << "  ✗ Invalid parameters incorrectly passed validation"
                << std::endl;
    } catch (const std::exception &e) {
      std::cout << "  ✓ Invalid parameters correctly rejected: " << e.what()
                << std::endl;
    }

    // Search by different criteria
    std::cout << "\n3. Searching by different criteria..." << std::endl;

    // Search by pricing model
    AgentSearchFilters pricing_filters;
    pricing_filters.pricing_model = PricingModel::Free;
    pricing_filters.active_only = true;

    auto free_agents = agent.search_agents(pricing_filters, 5, 0);
    std::cout << "Found " << free_agents.size() << " free agents" << std::endl;

    // Search by capability
    AgentSearchFilters capability_filters;
    capability_filters.capabilities = {AgentCapability::ImageGeneration};
    capability_filters.active_only = true;

    auto image_agents = agent.search_agents(capability_filters, 5, 0);
    std::cout << "Found " << image_agents.size() << " image generation agents"
              << std::endl;

    // Search by tags
    AgentSearchFilters tag_filters;
    tag_filters.tags = {"ai", "ml"};
    tag_filters.active_only = true;

    auto tagged_agents = agent.search_agents(tag_filters, 5, 0);
    std::cout << "Found " << tagged_agents.size() << " agents with AI/ML tags"
              << std::endl;

    // Demonstrate capability and pricing model conversions
    std::cout << "\n4. Testing capability and pricing model conversions..."
              << std::endl;

    std::vector<AgentCapability> capabilities = {
        AgentCapability::TextGeneration, AgentCapability::ImageGeneration,
        AgentCapability::CodeGeneration, AgentCapability::DataAnalysis,
        AgentCapability::WebSearch};

    std::cout << "Available capabilities:" << std::endl;
    for (const auto &cap : capabilities) {
      std::string cap_str = Agent::capability_to_string(cap);
      AgentCapability parsed_cap = Agent::string_to_capability(cap_str);
      std::cout << "  " << cap_str << " -> " << (parsed_cap == cap ? "✓" : "✗")
                << std::endl;
    }

    std::vector<PricingModel> pricing_models = {
        PricingModel::PerRequest, PricingModel::PerToken,
        PricingModel::Subscription, PricingModel::Free};

    std::cout << "\nAvailable pricing models:" << std::endl;
    for (const auto &model : pricing_models) {
      std::string model_str = Agent::pricing_model_to_string(model);
      PricingModel parsed_model = Agent::string_to_pricing_model(model_str);
      std::cout << "  " << model_str << " -> "
                << (parsed_model == model ? "✓" : "✗") << std::endl;
    }

    std::cout << "\nAgent operations example completed successfully!"
              << std::endl;

  } catch (const std::exception &e) {
    std::cerr << "Error: " << e.what() << std::endl;
    return 1;
  }

  cleanup();
  return 0;
}
