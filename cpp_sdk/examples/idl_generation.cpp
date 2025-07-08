/**
 * @file idl_generation.cpp
 * @brief Example demonstrating IDL parsing and code generation
 */

#include <aireg++/aireg++.hpp>
#include <iostream>

using namespace SolanaAiRegistries;

int main() {
  try {
    initialize();

    std::cout << "IDL Generation Example" << std::endl;
    std::cout << "=====================" << std::endl;

    // Load built-in IDL definitions
    std::cout << "\n1. Loading built-in IDL definitions..." << std::endl;

    IdlDefinition agent_idl = Idl::load_agent_registry_idl();
    std::cout << "Agent Registry IDL: " << agent_idl.name << " v"
              << agent_idl.version << std::endl;
    std::cout << "  Instructions: " << agent_idl.instructions.size()
              << std::endl;
    std::cout << "  Account types: " << agent_idl.accounts.size() << std::endl;

    IdlDefinition mcp_idl = Idl::load_mcp_server_registry_idl();
    std::cout << "MCP Registry IDL: " << mcp_idl.name << " v" << mcp_idl.version
              << std::endl;
    std::cout << "  Instructions: " << mcp_idl.instructions.size() << std::endl;
    std::cout << "  Account types: " << mcp_idl.accounts.size() << std::endl;

    // Test type conversions
    std::cout << "\n2. Testing IDL type conversions..." << std::endl;
    std::cout << "Bool -> " << Idl::get_cpp_type_name(IdlType::Bool)
              << std::endl;
    std::cout << "U64 -> " << Idl::get_cpp_type_name(IdlType::U64) << std::endl;
    std::cout << "String -> " << Idl::get_cpp_type_name(IdlType::String)
              << std::endl;
    std::cout << "PublicKey -> " << Idl::get_cpp_type_name(IdlType::PublicKey)
              << std::endl;

    // Test serialization sizes
    std::cout << "\n3. Testing serialization sizes..." << std::endl;
    auto bool_size = Idl::get_serialization_size(IdlType::Bool);
    std::cout << "Bool size: "
              << (bool_size ? std::to_string(*bool_size) : "variable")
              << " bytes" << std::endl;

    auto u64_size = Idl::get_serialization_size(IdlType::U64);
    std::cout << "U64 size: "
              << (u64_size ? std::to_string(*u64_size) : "variable") << " bytes"
              << std::endl;

    auto string_size = Idl::get_serialization_size(IdlType::String);
    std::cout << "String size: "
              << (string_size ? std::to_string(*string_size) : "variable")
              << " bytes" << std::endl;

    // Generate code for agent IDL
    std::cout << "\n4. Generating C++ code..." << std::endl;
    CodeGenOptions options;
    options.namespace_name = "AgentRegistry";
    options.generate_serializers = true;
    options.generate_builders = true;

    GeneratedCode code = Idl::generate_cpp_code(agent_idl, options);
    std::cout << "Generated header size: " << code.header_content.length()
              << " characters" << std::endl;
    std::cout << "Generated source size: " << code.source_content.length()
              << " characters" << std::endl;
    std::cout << "Dependencies: " << code.dependencies.size() << std::endl;

    std::cout << "\nIDL generation example completed successfully!"
              << std::endl;

  } catch (const std::exception &e) {
    std::cerr << "Error: " << e.what() << std::endl;
    return 1;
  }

  cleanup();
  return 0;
}
