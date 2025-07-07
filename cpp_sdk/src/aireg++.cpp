/**
 * @file aireg++.cpp
 * @brief Implementation of core SDK initialization and utility functions
 * 
 * This file provides the implementation of the main SDK initialization,
 * cleanup, and utility functions that are required for the header-only
 * library to function properly.
 */

#include <aireg++/aireg++.hpp>
#include <aireg++/common.hpp>
#include <iostream>
#include <stdexcept>
#include <cstring>
#include <sodium.h>

namespace SolanaAiRegistries {

// SDK initialization state
static bool sdk_initialized = false;

void initialize() {
    if (sdk_initialized) {
        return; // Already initialized
    }
    
    // Initialize libsodium
    if (sodium_init() < 0) {
        throw SdkException("Failed to initialize libsodium");
    }
    
    // TODO: Initialize C SDK (libaireg) when available
    // For now, just mark as initialized
    sdk_initialized = true;
}

void cleanup() noexcept {
    if (!sdk_initialized) {
        return; // Already cleaned up
    }
    
    // TODO: Cleanup C SDK (libaireg) when available
    // libsodium doesn't need explicit cleanup
    
    sdk_initialized = false;
}

// PublicKey implementation
PublicKey::PublicKey() {
    // Create zero public key
    std::memset(data_.data(), 0, SIZE);
}

PublicKey::PublicKey(const std::string& base58) {
    // TODO: Implement base58 decoding
    // For now, create a mock implementation
    if (base58.empty() || base58.length() != 44) {
        throw SdkException("Invalid base58 public key format");
    }
    
    // Mock implementation - in real implementation, decode base58
    std::memset(data_.data(), 0, SIZE);
    
    // Special case for system program ID
    if (base58 == "11111111111111111111111111111112") {
        data_[0] = 0x00;
        data_[1] = 0x00;
        data_[2] = 0x00;
        data_[3] = 0x00;
        // ... rest remains zero
    }
}

PublicKey::PublicKey(const uint8_t* bytes) {
    if (!bytes) {
        throw SdkException("Null pointer provided for public key bytes");
    }
    std::memcpy(data_.data(), bytes, SIZE);
}

std::string PublicKey::to_base58() const {
    // TODO: Implement base58 encoding
    // For now, return a mock base58 string
    
    // Special case for zero key (system program)
    bool is_zero = true;
    for (size_t i = 0; i < SIZE; ++i) {
        if (data_[i] != 0) {
            is_zero = false;
            break;
        }
    }
    
    if (is_zero) {
        return "11111111111111111111111111111112";
    }
    
    // Mock base58 encoding - in real implementation, encode to base58
    return "9WzDXwBbmkg8ZTbNMqUxvQRAyrZzDsGYdLVL9zYtAWWM";
}

bool PublicKey::operator==(const PublicKey& other) const noexcept {
    return std::memcmp(data_.data(), other.data_.data(), SIZE) == 0;
}

// Signature implementation
Signature::Signature() {
    std::memset(data_.data(), 0, SIZE);
}

Signature::Signature(const std::string& base58) {
    // TODO: Implement base58 decoding for signatures
    if (base58.empty() || base58.length() != 88) {
        throw SdkException("Invalid base58 signature format");
    }
    
    // Mock implementation
    std::memset(data_.data(), 0, SIZE);
}

Signature::Signature(const uint8_t* bytes) {
    if (!bytes) {
        throw SdkException("Null pointer provided for signature bytes");
    }
    std::memcpy(data_.data(), bytes, SIZE);
}

std::string Signature::to_base58() const {
    // TODO: Implement base58 encoding for signatures
    // Mock implementation
    return "5VERv8NMvzbJMEkV8xnrLkEaWRtSz9CosKDYjCJjBRnbJLgp8uirBgmQpjKhoR4tjF3ZpRzrFmBV6UjKdiSZkQUW";
}

bool Signature::operator==(const Signature& other) const noexcept {
    return std::memcmp(data_.data(), other.data_.data(), SIZE) == 0;
}

// Utility functions
std::string cluster_to_url(Cluster cluster) {
    switch (cluster) {
        case Cluster::Devnet:
            return "https://api.devnet.solana.com";
        case Cluster::Testnet:
            return "https://api.testnet.solana.com";
        case Cluster::MainnetBeta:
            return "https://api.mainnet-beta.solana.com";
        default:
            throw SdkException("Unknown cluster type");
    }
}

} // namespace SolanaAiRegistries