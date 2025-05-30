#!/bin/bash

# Build script for Solana AI Registries
set -e

echo "🔨 Building Solana AI Registries..."

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Function to print colored output
print_status() {
    echo -e "${GREEN}[INFO]${NC} $1"
}

print_warning() {
    echo -e "${YELLOW}[WARN]${NC} $1"
}

print_error() {
    echo -e "${RED}[ERROR]${NC} $1"
}

print_header() {
    echo -e "${BLUE}[BUILD]${NC} $1"
}

# Check if Rust is installed
if ! command -v rustc &> /dev/null; then
    print_error "Rust is not installed. Please install Rust first:"
    echo "curl --proto '=https' --tlsv1.2 -sSf https://sh.rustup.rs | sh"
    exit 1
fi

# Check if Solana CLI is installed
if ! command -v solana &> /dev/null; then
    print_error "Solana CLI is not installed. Please install Solana CLI first:"
    echo "curl --proto '=https' --tlsv1.2 -sSfL https://solana-install.solana.workers.dev | bash"
    exit 1
fi

# Check if Cargo is available
if ! command -v cargo &> /dev/null; then
    print_error "Cargo is not available. Please ensure Rust is properly installed."
    exit 1
fi

print_header "Environment Check"
print_status "Rust version: $(rustc --version)"
print_status "Cargo version: $(cargo --version)"
print_status "Solana CLI version: $(solana --version)"

# Set up Solana for BPF compilation
print_header "Setting up Solana BPF toolchain..."
# Modern Solana CLI doesn't need explicit install command

# Clean previous builds
print_header "Cleaning previous builds..."
cargo clean

# Build the programs
print_header "Building Agent Registry program..."
cargo build-sbf --manifest-path programs/agent-registry/Cargo.toml

print_header "Building MCP Server Registry program..."
cargo build-sbf --manifest-path programs/mcp-server-registry/Cargo.toml

# Verify builds
print_header "Verifying builds..."
if [ -f "programs/agent-registry/target/deploy/agent_registry.so" ]; then
    AGENT_SIZE=$(stat -c%s programs/agent-registry/target/deploy/agent_registry.so 2>/dev/null || stat -f%z programs/agent-registry/target/deploy/agent_registry.so 2>/dev/null || echo "unknown")
    print_status "✅ Agent Registry built successfully (${AGENT_SIZE} bytes)"
else
    print_error "❌ Agent Registry build failed"
    exit 1
fi

if [ -f "programs/mcp-server-registry/target/deploy/mcp_server_registry.so" ]; then
    MCP_SIZE=$(stat -c%s programs/mcp-server-registry/target/deploy/mcp_server_registry.so 2>/dev/null || stat -f%z programs/mcp-server-registry/target/deploy/mcp_server_registry.so 2>/dev/null || echo "unknown")
    print_status "✅ MCP Server Registry built successfully (${MCP_SIZE} bytes)"
else
    print_error "❌ MCP Server Registry build failed"
    exit 1
fi

# Run tests
print_header "Running tests..."
cargo test --verbose

print_header "🎉 Build completed successfully!"
echo ""
echo "📋 Build Summary:"
echo "  Agent Registry: programs/agent-registry/target/deploy/agent_registry.so (${AGENT_SIZE} bytes)"
echo "  MCP Server Registry: programs/mcp-server-registry/target/deploy/mcp_server_registry.so (${MCP_SIZE} bytes)"
echo ""
echo "🚀 Ready for deployment:"
echo "  • Devnet with existing token: ./scripts/deploy-devnet-with-existing-token.sh"
echo "  • Devnet: ./scripts/deploy-devnet.sh"
echo "  • Testnet: ./scripts/deploy-testnet.sh"
echo ""
print_warning "⚠️  Remember to fund your wallet before deployment!"