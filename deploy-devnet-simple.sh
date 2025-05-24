#!/bin/bash

# Simple Devnet Deployment Script
# This script attempts to deploy to devnet using alternative methods

set -e

echo "🚀 Simple Devnet Deployment for Solana AI Registries..."

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

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
    echo -e "${BLUE}[DEPLOY]${NC} $1"
}

# Check Solana configuration
print_status "Checking Solana configuration..."
solana config get

# Check wallet balance
BALANCE=$(solana balance --lamports)
print_status "Current wallet balance: $BALANCE lamports"

if [ "$BALANCE" -lt 10000000000 ]; then  # 10 SOL in lamports
    print_warning "Low balance detected. Requesting airdrop..."
    solana airdrop 10
    sleep 5
fi

# Create keypairs for program IDs if they don't exist
mkdir -p keypairs

if [ ! -f "keypairs/agent-registry-keypair.json" ]; then
    print_status "Generating Agent Registry keypair..."
    solana-keygen new --no-bip39-passphrase --outfile keypairs/agent-registry-keypair.json
fi

if [ ! -f "keypairs/mcp-server-registry-keypair.json" ]; then
    print_status "Generating MCP Server Registry keypair..."
    solana-keygen new --no-bip39-passphrase --outfile keypairs/mcp-server-registry-keypair.json
fi

# Get program IDs
AGENT_REGISTRY_ID=$(solana-keygen pubkey keypairs/agent-registry-keypair.json)
MCP_SERVER_REGISTRY_ID=$(solana-keygen pubkey keypairs/mcp-server-registry-keypair.json)

print_header "Program IDs:"
echo "  Agent Registry: $AGENT_REGISTRY_ID"
echo "  MCP Server Registry: $MCP_SERVER_REGISTRY_ID"

# Check if we have .so files
if [ ! -f "target/deploy/solana_agent_registry.so" ] || [ ! -f "target/deploy/solana_mcp.so" ]; then
    print_error "Program binaries not found. You need to build the programs first."
    print_warning "Due to GLIBC compatibility issues, you have several options:"
    echo ""
    echo "1. Use Docker (recommended):"
    echo "   docker build -t solana-ai-registries ."
    echo "   docker run --rm -v \$(pwd)/target:/workspace/target solana-ai-registries"
    echo ""
    echo "2. Use GitHub Actions (see .github/workflows/build-and-deploy.yml)"
    echo ""
    echo "3. Use Solana Playground (https://beta.solpg.io/)"
    echo ""
    echo "4. Use a different environment with GLIBC 2.32+"
    echo ""
    print_status "For now, creating placeholder deployment info..."
    
    # Create deployment info with placeholder
    cat > deployment-info-devnet.json << EOF
{
  "network": "devnet",
  "timestamp": "$(date -u +%Y-%m-%dT%H:%M:%SZ)",
  "status": "ready_for_deployment",
  "programs": {
    "agent_registry": {
      "program_id": "$AGENT_REGISTRY_ID",
      "keypair_file": "keypairs/agent-registry-keypair.json",
      "status": "keypair_generated"
    },
    "mcp_server_registry": {
      "program_id": "$MCP_SERVER_REGISTRY_ID",
      "keypair_file": "keypairs/mcp-server-registry-keypair.json",
      "status": "keypair_generated"
    }
  },
  "rpc_url": "https://api.devnet.solana.com",
  "explorer_base": "https://explorer.solana.com",
  "next_steps": [
    "Build programs using Docker or alternative method",
    "Run deployment script with built .so files"
  ]
}
EOF

    print_status "Deployment preparation completed!"
    print_warning "Build the programs using one of the methods above, then run this script again."
    exit 0
fi

# If we have .so files, proceed with deployment
print_header "Deploying Agent Registry..."
solana program deploy \
    --program-id keypairs/agent-registry-keypair.json \
    target/deploy/solana_agent_registry.so

if [ $? -eq 0 ]; then
    print_status "✅ Agent Registry deployed successfully"
else
    print_error "❌ Failed to deploy Agent Registry"
    exit 1
fi

print_header "Deploying MCP Server Registry..."
solana program deploy \
    --program-id keypairs/mcp-server-registry-keypair.json \
    target/deploy/solana_mcp.so

if [ $? -eq 0 ]; then
    print_status "✅ MCP Server Registry deployed successfully"
else
    print_error "❌ Failed to deploy MCP Server Registry"
    exit 1
fi

# Save deployment info
cat > deployment-info-devnet.json << EOF
{
  "network": "devnet",
  "timestamp": "$(date -u +%Y-%m-%dT%H:%M:%SZ)",
  "status": "deployed",
  "programs": {
    "agent_registry": {
      "program_id": "$AGENT_REGISTRY_ID",
      "keypair_file": "keypairs/agent-registry-keypair.json",
      "status": "deployed"
    },
    "mcp_server_registry": {
      "program_id": "$MCP_SERVER_REGISTRY_ID",
      "keypair_file": "keypairs/mcp-server-registry-keypair.json",
      "status": "deployed"
    }
  },
  "rpc_url": "https://api.devnet.solana.com",
  "explorer_base": "https://explorer.solana.com"
}
EOF

print_status "Deployment info saved to deployment-info-devnet.json"

# Display final information
print_header "🎉 Deployment completed successfully!"
echo ""
echo "📋 Deployment Summary:"
echo "  Network: Devnet"
echo "  Agent Registry: $AGENT_REGISTRY_ID"
echo "  MCP Server Registry: $MCP_SERVER_REGISTRY_ID"
echo ""
echo "🔗 Explorer Links:"
echo "  Agent Registry: https://explorer.solana.com/address/$AGENT_REGISTRY_ID?cluster=devnet"
echo "  MCP Server Registry: https://explorer.solana.com/address/$MCP_SERVER_REGISTRY_ID?cluster=devnet"
echo ""
echo "📁 Important Files:"
echo "  • keypairs/agent-registry-keypair.json (keep secure!)"
echo "  • keypairs/mcp-server-registry-keypair.json (keep secure!)"
echo "  • deployment-info-devnet.json"
echo ""
print_warning "⚠️  Keep your keypair files secure and backed up!"