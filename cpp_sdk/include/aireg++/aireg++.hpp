/**
 * @file aireg++.hpp
 * @brief Main header file for the Solana AI Registries C++ SDK
 * 
 * This header provides a modern C++17 wrapper around the libaireg C SDK,
 * implementing RAII principles and type safety for interacting with
 * Solana AI Registries.
 * 
 * @version 1.0.0
 * @author Solana AI Registries Team
 * @copyright Copyright (c) 2025 Solana AI Registries
 */

#pragma once

#include <aireg++/client.hpp>
#include <aireg++/agent.hpp>
#include <aireg++/mcp.hpp>
#include <aireg++/payments.hpp>
#include <aireg++/idl.hpp>
#include <aireg++/common.hpp>

/**
 * @namespace SolanaAiRegistries
 * @brief Main namespace for the Solana AI Registries C++ SDK
 * 
 * This namespace contains all classes and functions for interacting with
 * Solana AI Registries through a type-safe, RAII-compliant C++ interface.
 */
namespace SolanaAiRegistries {

/**
 * @brief SDK version information
 */
struct Version {
    static constexpr int major = 1;     ///< Major version number
    static constexpr int minor = 0;     ///< Minor version number
    static constexpr int patch = 0;     ///< Patch version number
    
    /**
     * @brief Get version string
     * @return Version string in format "major.minor.patch"
     */
    static std::string string() {
        return std::to_string(major) + "." + 
               std::to_string(minor) + "." + 
               std::to_string(patch);
    }
};

/**
 * @brief Initialize the SDK
 * 
 * This function must be called before using any other SDK functionality.
 * It initializes the underlying C SDK and sets up necessary resources.
 * 
 * @throws SdkException if initialization fails
 */
void initialize();

/**
 * @brief Cleanup the SDK
 * 
 * This function should be called when done using the SDK to properly
 * cleanup resources and shutdown the underlying C SDK.
 */
void cleanup() noexcept;

} // namespace SolanaAiRegistries