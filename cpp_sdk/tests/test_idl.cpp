/**
 * @file test_idl.cpp
 * @brief Tests for the IDL class
 */

#include <gtest/gtest.h>

#include <aireg++/idl.hpp>

using namespace SolanaAiRegistries;

class IdlTest : public ::testing::Test {
 protected:
  void SetUp() override {}
  void TearDown() override {}
};

TEST_F(IdlTest, TypeConversion) {
  EXPECT_EQ(Idl::idl_type_to_string(IdlType::Bool), "Bool");
  EXPECT_EQ(Idl::idl_type_to_string(IdlType::U8), "U8");
  EXPECT_EQ(Idl::idl_type_to_string(IdlType::String), "String");
  EXPECT_EQ(Idl::idl_type_to_string(IdlType::PublicKey), "PublicKey");

  EXPECT_EQ(Idl::string_to_idl_type("Bool"), IdlType::Bool);
  EXPECT_EQ(Idl::string_to_idl_type("U8"), IdlType::U8);
  EXPECT_EQ(Idl::string_to_idl_type("String"), IdlType::String);

  EXPECT_THROW(Idl::string_to_idl_type("InvalidType"), std::invalid_argument);
}

TEST_F(IdlTest, CppTypeMapping) {
  EXPECT_EQ(Idl::get_cpp_type_name(IdlType::Bool), "bool");
  EXPECT_EQ(Idl::get_cpp_type_name(IdlType::U8), "uint8_t");
  EXPECT_EQ(Idl::get_cpp_type_name(IdlType::U32), "uint32_t");
  EXPECT_EQ(Idl::get_cpp_type_name(IdlType::U64), "uint64_t");
  EXPECT_EQ(Idl::get_cpp_type_name(IdlType::String), "std::string");
  EXPECT_EQ(Idl::get_cpp_type_name(IdlType::PublicKey),
            "SolanaAiRegistries::PublicKey");
  EXPECT_EQ(Idl::get_cpp_type_name(IdlType::Bytes), "std::vector<uint8_t>");

  // Test with struct name
  EXPECT_EQ(Idl::get_cpp_type_name(IdlType::Struct, "TestStruct"),
            "TestStruct");

  // Test with enum name
  EXPECT_EQ(Idl::get_cpp_type_name(IdlType::Enum, std::nullopt, "TestEnum"),
            "TestEnum");
}

TEST_F(IdlTest, SerializationSize) {
  EXPECT_EQ(Idl::get_serialization_size(IdlType::Bool), 1);
  EXPECT_EQ(Idl::get_serialization_size(IdlType::U8), 1);
  EXPECT_EQ(Idl::get_serialization_size(IdlType::U32), 4);
  EXPECT_EQ(Idl::get_serialization_size(IdlType::U64), 8);
  EXPECT_EQ(Idl::get_serialization_size(IdlType::PublicKey), 32);

  // Variable-size types should return nullopt
  EXPECT_EQ(Idl::get_serialization_size(IdlType::String), std::nullopt);
  EXPECT_EQ(Idl::get_serialization_size(IdlType::Bytes), std::nullopt);
  EXPECT_EQ(Idl::get_serialization_size(IdlType::Vec), std::nullopt);

  // Array with size
  EXPECT_EQ(Idl::get_serialization_size(IdlType::Array, 10), 10);
}

TEST_F(IdlTest, BuiltinIdlLoading) {
  // Test loading built-in IDL definitions
  EXPECT_NO_THROW({
    IdlDefinition agent_idl = Idl::load_agent_registry_idl();
    EXPECT_FALSE(agent_idl.name.empty());
    EXPECT_FALSE(agent_idl.instructions.empty());
  });

  EXPECT_NO_THROW({
    IdlDefinition mcp_idl = Idl::load_mcp_server_registry_idl();
    EXPECT_FALSE(mcp_idl.name.empty());
    EXPECT_FALSE(mcp_idl.instructions.empty());
  });

  EXPECT_NO_THROW({
    IdlDefinition token_idl = Idl::load_svmai_token_idl();
    EXPECT_FALSE(token_idl.name.empty());
    EXPECT_FALSE(token_idl.instructions.empty());
  });
}

TEST_F(IdlTest, JsonParsing) {
  // Test parsing a simple IDL JSON
  std::string simple_idl = R"({
        "version": "0.1.0",
        "name": "test_program",
        "programId": "11111111111111111111111111111112",
        "instructions": [
            {
                "name": "initialize",
                "accounts": [
                    {
                        "name": "authority",
                        "isMut": false,
                        "isSigner": true
                    }
                ],
                "args": [
                    {
                        "name": "bump",
                        "type": "u8"
                    }
                ]
            }
        ],
        "accounts": [],
        "types": [],
        "errors": []
    })";

  EXPECT_NO_THROW({
    IdlDefinition idl = Idl::parse_from_json(simple_idl);
    EXPECT_EQ(idl.name, "test_program");
    EXPECT_EQ(idl.version, "0.1.0");
    EXPECT_EQ(idl.instructions.size(), 1);
    EXPECT_EQ(idl.instructions[0].name, "initialize");
    EXPECT_EQ(idl.instructions[0].accounts.size(), 1);
    EXPECT_EQ(idl.instructions[0].args.size(), 1);
    EXPECT_EQ(idl.instructions[0].args[0].name, "bump");
    EXPECT_EQ(idl.instructions[0].args[0].type, IdlType::U8);
  });
}

TEST_F(IdlTest, InvalidJsonParsing) {
  // Test parsing invalid JSON
  std::string invalid_json = "{ invalid json }";

  EXPECT_THROW(Idl::parse_from_json(invalid_json), SdkException);
}

TEST_F(IdlTest, CodeGeneration) {
  // Create a simple IDL definition
  IdlDefinition idl;
  idl.name = "test_program";
  idl.version = "0.1.0";
  idl.program_id = PublicKey("11111111111111111111111111111112");

  // Add a simple instruction
  IdlInstruction instruction;
  instruction.name = "initialize";

  IdlAccount account;
  account.name = "authority";
  account.is_mut = false;
  account.is_signer = true;
  instruction.accounts.push_back(account);

  IdlInstructionArg arg;
  arg.name = "bump";
  arg.type = IdlType::U8;
  instruction.args.push_back(arg);

  idl.instructions.push_back(instruction);

  // Test code generation
  EXPECT_NO_THROW({
    CodeGenOptions options;
    options.namespace_name = "TestProgram";

    GeneratedCode code = Idl::generate_cpp_code(idl, options);
    EXPECT_FALSE(code.header_content.empty());
    EXPECT_TRUE(code.header_content.find("namespace TestProgram") !=
                std::string::npos);
    EXPECT_TRUE(code.header_content.find("initialize") != std::string::npos);
  });
}

TEST_F(IdlTest, IdlValidation) {
  // Test with valid IDL
  IdlDefinition valid_idl;
  valid_idl.name = "test_program";
  valid_idl.version = "0.1.0";
  valid_idl.program_id = PublicKey("11111111111111111111111111111112");

  std::vector<std::string> errors = Idl::validate_idl(valid_idl);
  EXPECT_TRUE(errors.empty());

  // Test with invalid IDL (empty name)
  IdlDefinition invalid_idl = valid_idl;
  invalid_idl.name = "";

  errors = Idl::validate_idl(invalid_idl);
  EXPECT_FALSE(errors.empty());
  EXPECT_TRUE(errors[0].find("name") != std::string::npos);
}
