#!/bin/bash

# Deploy script for Devnet
set -e

echo "🚀 Deploying Solana AI Registries to Devnet..."

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
    echo -e "${BLUE}[DEPLOY]${NC} $1"
}

# Check if programs are built
if [ ! -f "target/deploy/solana_a2a.so" ]; then
    print_error "Agent Registry program not found. Run ./scripts/build.sh first"
    exit 1
fi

if [ ! -f "target/deploy/solana_mcp.so" ]; then
    print_error "MCP Server Registry program not found. Run ./scripts/build.sh first"
    exit 1
fi

# Set Solana config for devnet
print_status "Configuring Solana for devnet..."
solana config set --url devnet

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

# Deploy Agent Registry
print_header "Deploying Agent Registry..."
solana program deploy \
    --program-id keypairs/agent-registry-keypair.json \
    target/deploy/solana_a2a.so

if [ $? -eq 0 ]; then
    print_status "✅ Agent Registry deployed successfully"
else
    print_error "❌ Failed to deploy Agent Registry"
    exit 1
fi

# Deploy MCP Server Registry
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
  "programs": {
    "agent_registry": {
      "program_id": "$AGENT_REGISTRY_ID",
      "keypair_file": "keypairs/agent-registry-keypair.json"
    },
    "mcp_server_registry": {
      "program_id": "$MCP_SERVER_REGISTRY_ID",
      "keypair_file": "keypairs/mcp-server-registry-keypair.json"
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