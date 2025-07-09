/**
 * @file basic_usage.cpp
 * @brief Basic usage example for the Solana AI Registries C++ SDK
 */

#include <aireg++/aireg++.hpp>
#include <iostream>
#include <stdexcept>

using namespace SolanaAiRegistries;

int main() {
  try {
    // Initialize the SDK
    std::cout << "Initializing Solana AI Registries C++ SDK v"
              << Version::string() << std::endl;
    initialize();

    // Create client configuration for devnet
    ClientConfig config;
    config.cluster = Cluster::Devnet;
    config.timeout = std::chrono::milliseconds{30000};

    std::cout << "Connecting to " << cluster_to_url(config.cluster)
              << std::endl;

    // Create client
    Client client(config);
    std::cout << "Connected to Solana devnet: " << client.is_connected()
              << std::endl;

    // Get latest blockhash
    std::string blockhash = client.get_latest_blockhash();
    std::cout << "Latest blockhash: " << blockhash << std::endl;

    // Query system program account
    PublicKey system_program("11111111111111111111111111111112");
    std::cout << "System program ID: " << system_program.to_base58()
              << std::endl;

    auto account_info = client.get_account_info(system_program);
    if (account_info) {
      std::cout << "System program account:" << std::endl;
      std::cout << "  - Lamports: " << account_info->lamports << std::endl;
      std::cout << "  - Owner: " << account_info->owner.to_base58()
                << std::endl;
      std::cout << "  - Executable: "
                << (account_info->executable ? "true" : "false") << std::endl;
      std::cout << "  - Data size: " << account_info->data.size() << " bytes"
                << std::endl;
    }

    // Get balance
    uint64_t balance = client.get_balance(system_program);
    std::cout << "System program balance: " << balance << " lamports"
              << std::endl;

    // Calculate rent exemption
    uint64_t rent_exemption =
        client.get_minimum_balance_for_rent_exemption(100);
    std::cout << "Rent exemption for 100 bytes: " << rent_exemption
              << " lamports" << std::endl;

    // Create registry components
    std::cout << "\nInitializing registry components..." << std::endl;

    Agent agent(client);
    std::cout << "Agent registry initialized" << std::endl;

    Mcp mcp(client);
    std::cout << "MCP registry initialized" << std::endl;

    Payments payments(client);
    std::cout << "Payments initialized" << std::endl;

    // Query registry statistics
    uint64_t agent_count = agent.get_agent_count();
    std::cout << "Total registered agents: " << agent_count << std::endl;

    uint64_t server_count = mcp.get_server_count();
    std::cout << "Total registered MCP servers: " << server_count << std::endl;

    // Search for agents
    std::cout << "\nSearching for active agents..." << std::endl;
    AgentSearchFilters agent_filters;
    agent_filters.active_only = true;

    auto agents = agent.search_agents(agent_filters, 5, 0);
    std::cout << "Found " << agents.size() << " active agents" << std::endl;

    for (const auto &agent_info : agents) {
      std::cout << "  - " << agent_info.name << " (v" << agent_info.version
                << ")" << std::endl;
      std::cout << "    ID: " << agent_info.agent_id.to_base58() << std::endl;
      std::cout << "    Endpoint: " << agent_info.api_endpoint << std::endl;
      std::cout << "    Pricing: "
                << Agent::pricing_model_to_string(agent_info.pricing_model)
                << std::endl;
      if (agent_info.pricing_model == PricingModel::PerRequest) {
        std::cout << "    Price per request: " << agent_info.price_per_request
                  << " lamports" << std::endl;
      }
    }

    // Search for MCP servers
    std::cout << "\nSearching for active MCP servers..." << std::endl;
    McpSearchFilters mcp_filters;
    mcp_filters.active_only = true;

    auto servers = mcp.search_servers(mcp_filters, 5, 0);
    std::cout << "Found " << servers.size() << " active MCP servers"
              << std::endl;

    for (const auto &server_info : servers) {
      std::cout << "  - " << server_info.name << " (v" << server_info.version
                << ")" << std::endl;
      std::cout << "    ID: " << server_info.server_id.to_base58() << std::endl;
      std::cout << "    Protocol: "
                << Mcp::protocol_to_string(server_info.protocol) << std::endl;
      std::cout << "    Endpoint: " << server_info.endpoint << std::endl;
    }

    // Test transaction building (without sending)
    std::cout << "\nTesting transaction building..." << std::endl;
    TransactionBuilder builder(client);

    PublicKey payer("11111111111111111111111111111112");
    std::vector<PublicKey> accounts = {payer};
    std::vector<uint8_t> instruction_data = {0x00}; // Minimal instruction

    auto transaction_data =
        builder.set_payer(payer)
            .add_instruction(payer, accounts, instruction_data)
            .build();

    std::cout << "Built transaction with " << transaction_data.size()
              << " bytes" << std::endl;

    uint64_t estimated_fee = builder.estimate_fee();
    std::cout << "Estimated transaction fee: " << estimated_fee << " lamports"
              << std::endl;

    // Test payment fee estimation
    std::cout << "\nTesting payment fee estimation..." << std::endl;
    uint64_t payment_fee =
        payments.estimate_payment_fee(PaymentMethod::Sol, 1000000);
    std::cout << "Estimated payment fee for 1 SOL: " << payment_fee
              << " lamports" << std::endl;

    // Test balance query
    BalanceInfo sol_balance =
        payments.get_balance(system_program, PaymentMethod::Sol);
    std::cout << "SOL balance query successful: " << sol_balance.balance
              << " lamports" << std::endl;

    // Load and display built-in IDL information
    std::cout << "\nLoading built-in IDL definitions..." << std::endl;

    IdlDefinition agent_idl = Idl::load_agent_registry_idl();
    std::cout << "Agent registry IDL: " << agent_idl.name << " v"
              << agent_idl.version << std::endl;
    std::cout << "  Instructions: " << agent_idl.instructions.size()
              << std::endl;
    std::cout << "  Account types: " << agent_idl.accounts.size() << std::endl;
    std::cout << "  Custom types: " << agent_idl.types.size() << std::endl;

    IdlDefinition mcp_idl = Idl::load_mcp_server_registry_idl();
    std::cout << "MCP registry IDL: " << mcp_idl.name << " v" << mcp_idl.version
              << std::endl;
    std::cout << "  Instructions: " << mcp_idl.instructions.size() << std::endl;
    std::cout << "  Account types: " << mcp_idl.accounts.size() << std::endl;

    IdlDefinition token_idl = Idl::load_svmai_token_idl();
    std::cout << "SVMAI token IDL: " << token_idl.name << " v"
              << token_idl.version << std::endl;
    std::cout << "  Instructions: " << token_idl.instructions.size()
              << std::endl;

    std::cout << "\nAll operations completed successfully!" << std::endl;

  } catch (const SdkException &e) {
    std::cerr << "SDK Error: " << e.what() << std::endl;
    return 1;
  } catch (const std::exception &e) {
    std::cerr << "Error: " << e.what() << std::endl;
    return 1;
  }

  // Cleanup
  cleanup();
  std::cout << "SDK cleanup completed." << std::endl;

  return 0;
}
