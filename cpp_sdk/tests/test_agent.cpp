/**
 * @file test_agent.cpp
 * @brief Tests for the Agent class
 */

#include <gtest/gtest.h>

#include <aireg++/agent.hpp>
#include <aireg++/client.hpp>

using namespace SolanaAiRegistries;

class AgentTest : public ::testing::Test {
protected:
  void SetUp() override {
    ClientConfig config;
    config.cluster = Cluster::Devnet;
    client_ = std::make_unique<Client>(config);
    agent_ = std::make_unique<Agent>(*client_);
  }

  void TearDown() override {}

  std::unique_ptr<Client> client_;
  std::unique_ptr<Agent> agent_;
};

TEST_F(AgentTest, CapabilityConversion) {
  EXPECT_EQ(Agent::capability_to_string(AgentCapability::TextGeneration),
            "TextGeneration");
  EXPECT_EQ(Agent::capability_to_string(AgentCapability::ImageGeneration),
            "ImageGeneration");
  EXPECT_EQ(Agent::capability_to_string(AgentCapability::CodeGeneration),
            "CodeGeneration");

  EXPECT_EQ(Agent::string_to_capability("TextGeneration"),
            AgentCapability::TextGeneration);
  EXPECT_EQ(Agent::string_to_capability("ImageGeneration"),
            AgentCapability::ImageGeneration);
  EXPECT_EQ(Agent::string_to_capability("CodeGeneration"),
            AgentCapability::CodeGeneration);

  EXPECT_THROW(Agent::string_to_capability("InvalidCapability"),
               std::invalid_argument);
}

TEST_F(AgentTest, PricingModelConversion) {
  EXPECT_EQ(Agent::pricing_model_to_string(PricingModel::PerRequest),
            "PerRequest");
  EXPECT_EQ(Agent::pricing_model_to_string(PricingModel::PerToken), "PerToken");
  EXPECT_EQ(Agent::pricing_model_to_string(PricingModel::Subscription),
            "Subscription");
  EXPECT_EQ(Agent::pricing_model_to_string(PricingModel::Free), "Free");

  EXPECT_EQ(Agent::string_to_pricing_model("PerRequest"),
            PricingModel::PerRequest);
  EXPECT_EQ(Agent::string_to_pricing_model("PerToken"), PricingModel::PerToken);

  EXPECT_THROW(Agent::string_to_pricing_model("InvalidModel"),
               std::invalid_argument);
}

TEST_F(AgentTest, ParameterValidation) {
  AgentRegistrationParams params;
  params.name = "Test Agent";
  params.description = "A test agent";
  params.version = "1.0.0";
  params.capabilities.clear();
  params.capabilities.push_back(AgentCapability::TextGeneration);
  params.api_endpoint = "https://api.example.com";
  params.pricing_model = PricingModel::PerRequest;
  params.price_per_request = 1000;

  // Valid parameters should not throw
  EXPECT_NO_THROW(Agent::validate_registration_params(params));

  // Invalid parameters should throw
  params.name = ""; // Empty name
  EXPECT_THROW(Agent::validate_registration_params(params),
               std::invalid_argument);

  params.name = "Test Agent";
  params.api_endpoint = "invalid-url"; // Invalid URL
  EXPECT_THROW(Agent::validate_registration_params(params),
               std::invalid_argument);
}

TEST_F(AgentTest, SearchFilters) {
  AgentSearchFilters filters;
  std::vector<AgentCapability> caps;
  caps.push_back(AgentCapability::TextGeneration);
  caps.push_back(AgentCapability::CodeGeneration);
  filters.capabilities = caps;
  filters.pricing_model = PricingModel::PerRequest;
  filters.max_price_per_request = 5000;
  filters.active_only = true;

  // Search should not throw even with no results
  EXPECT_NO_THROW({
    auto results = agent_->search_agents(filters, 10, 0);
    // Results may be empty on devnet
  });
}

TEST_F(AgentTest, AgentCount) {
  EXPECT_NO_THROW({
    uint64_t count = agent_->get_agent_count();
    EXPECT_GE(count, 0);
  });
}
