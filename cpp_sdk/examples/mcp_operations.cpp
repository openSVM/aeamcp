/**
 * @file mcp_operations.cpp
 * @brief Example demonstrating MCP server registry operations
 */

#include <aireg++/aireg++.hpp>
#include <iostream>

using namespace SolanaAiRegistries;

int main() {
  try {
    initialize();

    ClientConfig config;
    config.cluster = Cluster::Devnet;
    Client client(config);
    Mcp mcp(client);

    std::cout << "MCP Server Registry Operations Example" << std::endl;
    std::cout << "======================================" << std::endl;

    // Search for existing MCP servers
    std::cout << "\n1. Searching for MCP servers..." << std::endl;
    auto servers = mcp.search_servers({}, 10, 0);
    std::cout << "Found " << servers.size() << " MCP servers" << std::endl;

    // Test protocol and capability conversions
    std::cout << "\n2. Testing protocol conversions..." << std::endl;
    std::cout << "HTTP: " << Mcp::protocol_to_string(McpProtocol::Http)
              << std::endl;
    std::cout << "WebSocket: "
              << Mcp::protocol_to_string(McpProtocol::WebSocket) << std::endl;
    std::cout << "Stdio: " << Mcp::protocol_to_string(McpProtocol::Stdio)
              << std::endl;

    std::cout << "\n3. Testing capability conversions..." << std::endl;
    std::cout << "Resources: "
              << Mcp::capability_to_string(McpCapability::Resources)
              << std::endl;
    std::cout << "Tools: " << Mcp::capability_to_string(McpCapability::Tools)
              << std::endl;
    std::cout << "Prompts: "
              << Mcp::capability_to_string(McpCapability::Prompts) << std::endl;

    std::cout << "\nMCP operations example completed successfully!"
              << std::endl;

  } catch (const std::exception &e) {
    std::cerr << "Error: " << e.what() << std::endl;
    return 1;
  }

  cleanup();
  return 0;
}
