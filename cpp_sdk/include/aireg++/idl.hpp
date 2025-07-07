/**
 * @file idl.hpp
 * @brief IDL (Interface Definition Language) support for compile-time structs
 * 
 * This header provides the Idl class for working with Solana program IDL
 * definitions and generating compile-time type-safe structs for program
 * instructions and account data.
 * 
 * @version 1.0.0
 * @author Solana AI Registries Team
 */

#pragma once

#include <aireg++/common.hpp>
#include <string>
#include <memory>
#include <optional>
#include <vector>
#include <variant>
#include <unordered_map>

namespace SolanaAiRegistries {

/**
 * @brief IDL field types
 */
enum class IdlType {
    Bool,               ///< Boolean type
    U8,                 ///< 8-bit unsigned integer
    I8,                 ///< 8-bit signed integer
    U16,                ///< 16-bit unsigned integer
    I16,                ///< 16-bit signed integer
    U32,                ///< 32-bit unsigned integer
    I32,                ///< 32-bit signed integer
    U64,                ///< 64-bit unsigned integer
    I64,                ///< 64-bit signed integer
    U128,               ///< 128-bit unsigned integer
    I128,               ///< 128-bit signed integer
    Bytes,              ///< Byte array
    String,             ///< UTF-8 string
    PublicKey,          ///< Solana public key
    Array,              ///< Fixed-size array
    Vec,                ///< Variable-size vector
    Option,             ///< Optional type
    Struct,             ///< Custom struct
    Enum                ///< Custom enum
};

/**
 * @brief IDL field definition
 */
struct IdlField {
    std::string name;                                ///< Field name
    IdlType type;                                    ///< Field type
    std::optional<size_t> array_size;               ///< Array size (for Array type)
    std::optional<std::string> struct_name;         ///< Struct name (for Struct type)
    std::optional<std::string> enum_name;           ///< Enum name (for Enum type)
    std::optional<IdlType> inner_type;              ///< Inner type (for Vec, Option)
    std::optional<std::string> docs;                ///< Documentation
};

/**
 * @brief IDL struct definition
 */
struct IdlStruct {
    std::string name;                                ///< Struct name
    std::vector<IdlField> fields;                    ///< Struct fields
    std::optional<std::string> docs;                ///< Documentation
};

/**
 * @brief IDL enum variant
 */
struct IdlEnumVariant {
    std::string name;                                ///< Variant name
    std::optional<std::vector<IdlField>> fields;    ///< Variant fields (for struct-like variants)
    std::optional<std::string> docs;                ///< Documentation
};

/**
 * @brief IDL enum definition
 */
struct IdlEnum {
    std::string name;                                ///< Enum name
    std::vector<IdlEnumVariant> variants;           ///< Enum variants
    std::optional<std::string> docs;                ///< Documentation
};

/**
 * @brief IDL instruction argument
 */
struct IdlInstructionArg {
    std::string name;                                ///< Argument name
    IdlType type;                                    ///< Argument type
    std::optional<std::string> struct_name;         ///< Struct name (for Struct type)
    std::optional<std::string> enum_name;           ///< Enum name (for Enum type)
    std::optional<std::string> docs;                ///< Documentation
};

/**
 * @brief IDL account info
 */
struct IdlAccount {
    std::string name;                                ///< Account name
    bool is_mut;                                     ///< Whether account is mutable
    bool is_signer;                                  ///< Whether account is signer
    std::optional<std::string> docs;                ///< Documentation
};

/**
 * @brief IDL instruction definition
 */
struct IdlInstruction {
    std::string name;                                ///< Instruction name
    std::vector<IdlAccount> accounts;                ///< Required accounts
    std::vector<IdlInstructionArg> args;            ///< Instruction arguments
    std::optional<std::string> docs;                ///< Documentation
};

/**
 * @brief IDL error definition
 */
struct IdlError {
    uint32_t code;                                   ///< Error code
    std::string name;                                ///< Error name
    std::optional<std::string> msg;                 ///< Error message
};

/**
 * @brief Complete IDL definition
 */
struct IdlDefinition {
    std::string version;                             ///< IDL version
    std::string name;                                ///< Program name
    PublicKey program_id;                            ///< Program ID
    std::vector<IdlInstruction> instructions;       ///< Program instructions
    std::vector<IdlStruct> accounts;                 ///< Account structs
    std::vector<IdlStruct> types;                    ///< Custom types
    std::vector<IdlEnum> enums;                      ///< Custom enums
    std::vector<IdlError> errors;                    ///< Error definitions
    std::optional<std::string> docs;                ///< Documentation
};

/**
 * @brief Code generation options
 */
struct CodeGenOptions {
    std::string namespace_name = "Generated";        ///< Generated namespace name
    bool generate_serializers = true;               ///< Generate serialization code
    bool generate_builders = true;                  ///< Generate builder patterns
    bool generate_validators = true;                ///< Generate validation code
    bool use_exceptions = true;                      ///< Use exceptions for errors
    std::string header_guard_prefix = "AIREG_GENERATED"; ///< Header guard prefix
};

/**
 * @brief Generated code information
 */
struct GeneratedCode {
    std::string header_content;                      ///< Generated header file content
    std::string source_content;                      ///< Generated source file content (if needed)
    std::vector<std::string> dependencies;          ///< Required dependencies
};

/**
 * @brief IDL class for working with Interface Definition Language
 * 
 * This class provides functionality for parsing IDL definitions and
 * generating compile-time type-safe C++ structs and functions for
 * interacting with Solana programs.
 */
class Idl {
public:
    /**
     * @brief Default constructor
     */
    Idl();
    
    /**
     * @brief Destructor
     */
    ~Idl();
    
    /**
     * @brief Move constructor
     */
    Idl(Idl&& other) noexcept;
    
    /**
     * @brief Move assignment
     */
    Idl& operator=(Idl&& other) noexcept;
    
    // Delete copy constructor and assignment
    Idl(const Idl&) = delete;
    Idl& operator=(const Idl&) = delete;
    
    /**
     * @brief Parse IDL from JSON string
     * @param json_content IDL JSON content
     * @return Parsed IDL definition
     * @throws SdkException if parsing fails
     */
    static IdlDefinition parse_from_json(const std::string& json_content);
    
    /**
     * @brief Parse IDL from file
     * @param file_path Path to IDL JSON file
     * @return Parsed IDL definition
     * @throws SdkException if file reading or parsing fails
     */
    static IdlDefinition parse_from_file(const std::string& file_path);
    
    /**
     * @brief Generate C++ code from IDL definition
     * @param idl IDL definition
     * @param options Code generation options
     * @return Generated C++ code
     * @throws SdkException if code generation fails
     */
    static GeneratedCode generate_cpp_code(const IdlDefinition& idl,
                                          const CodeGenOptions& options = {});
    
    /**
     * @brief Generate header file from IDL
     * @param idl IDL definition
     * @param options Code generation options
     * @return Generated header file content
     * @throws SdkException if generation fails
     */
    static std::string generate_header(const IdlDefinition& idl,
                                      const CodeGenOptions& options = {});
    
    /**
     * @brief Generate instruction builders from IDL
     * @param idl IDL definition
     * @param options Code generation options
     * @return Generated instruction builder code
     * @throws SdkException if generation fails
     */
    static std::string generate_instruction_builders(const IdlDefinition& idl,
                                                    const CodeGenOptions& options = {});
    
    /**
     * @brief Generate account deserializers from IDL
     * @param idl IDL definition
     * @param options Code generation options
     * @return Generated deserializer code
     * @throws SdkException if generation fails
     */
    static std::string generate_account_deserializers(const IdlDefinition& idl,
                                                     const CodeGenOptions& options = {});
    
    /**
     * @brief Validate IDL definition
     * @param idl IDL definition to validate
     * @return List of validation errors (empty if valid)
     */
    static std::vector<std::string> validate_idl(const IdlDefinition& idl);
    
    /**
     * @brief Get C++ type name for IDL type
     * @param type IDL type
     * @param struct_name Struct name (for Struct type)
     * @param enum_name Enum name (for Enum type)
     * @return C++ type name
     */
    static std::string get_cpp_type_name(IdlType type,
                                        const std::optional<std::string>& struct_name = std::nullopt,
                                        const std::optional<std::string>& enum_name = std::nullopt);
    
    /**
     * @brief Get serialization size for IDL type
     * @param type IDL type
     * @param array_size Array size (for Array type)
     * @return Size in bytes, or nullopt for variable-size types
     */
    static std::optional<size_t> get_serialization_size(IdlType type,
                                                        std::optional<size_t> array_size = std::nullopt);
    
    /**
     * @brief Convert IDL type to string
     * @param type IDL type enum
     * @return Human-readable type name
     */
    static std::string idl_type_to_string(IdlType type);
    
    /**
     * @brief Parse IDL type from string
     * @param type_str Type string
     * @return IDL type enum
     * @throws std::invalid_argument if string is invalid
     */
    static IdlType string_to_idl_type(const std::string& type_str);
    
    /**
     * @brief Create instruction data from arguments
     * @param instruction Instruction definition
     * @param args Argument values as byte vectors
     * @return Serialized instruction data
     * @throws SdkException if serialization fails
     */
    static std::vector<uint8_t> create_instruction_data(const IdlInstruction& instruction,
                                                       const std::vector<std::vector<uint8_t>>& args);
    
    /**
     * @brief Deserialize account data according to IDL struct
     * @param struct_def Struct definition
     * @param data Account data to deserialize
     * @return Deserialized field values
     * @throws SdkException if deserialization fails
     */
    static std::unordered_map<std::string, std::vector<uint8_t>> 
    deserialize_account_data(const IdlStruct& struct_def, const std::vector<uint8_t>& data);
    
    /**
     * @brief Load built-in agent registry IDL
     * @return Agent registry IDL definition
     */
    static IdlDefinition load_agent_registry_idl();
    
    /**
     * @brief Load built-in MCP server registry IDL
     * @return MCP server registry IDL definition
     */
    static IdlDefinition load_mcp_server_registry_idl();
    
    /**
     * @brief Load built-in SVMAI token IDL
     * @return SVMAI token IDL definition
     */
    static IdlDefinition load_svmai_token_idl();

private:
    class Impl;
    std::unique_ptr<Impl> pimpl_;
};

} // namespace SolanaAiRegistries