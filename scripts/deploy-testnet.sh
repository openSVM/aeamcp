#!/bin/bash

# Deploy script for Testnet
set -e

echo "🚀 Deploying Solana AI Registries to Testnet..."

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

# Confirmation prompt
echo -e "${YELLOW}⚠️  You are about to deploy to TESTNET${NC}"
echo "This will use real SOL tokens for deployment costs."
echo ""
read -p "Are you sure you want to continue? (y/N): " -n 1 -r
echo
if [[ ! $REPLY =~ ^[Yy]$ ]]; then
    echo "Deployment cancelled."
    exit 0
fi

# Check if programs are built
if [ ! -f "target/deploy/solana_agent_registry.so" ]; then
    print_error "Agent Registry program not found. Run ./scripts/build.sh first"
    exit 1
fi

if [ ! -f "target/deploy/solana_mcp.so" ]; then
    print_error "MCP Server Registry program not found. Run ./scripts/build.sh first"
    exit 1
fi

# Set Solana config for testnet
print_status "Configuring Solana for testnet..."
solana config set --url testnet

# Check wallet balance
BALANCE=$(solana balance --lamports)
BALANCE_SOL=$(echo "scale=2; $BALANCE / 1000000000" | bc)
print_status "Current wallet balance: $BALANCE_SOL SOL"

if [ "$BALANCE" -lt 5000000000 ]; then  # 5 SOL in lamports
    print_error "Insufficient balance for deployment. You need at least 5 SOL."
    echo "Please fund your wallet and try again."
    exit 1
fi

# Create keypairs for program IDs if they don't exist
mkdir -p keypairs

if [ ! -f "keypairs/agent-registry-testnet-keypair.json" ]; then
    print_status "Generating Agent Registry keypair for testnet..."
    solana-keygen new --no-bip39-passphrase --outfile keypairs/agent-registry-testnet-keypair.json
fi

if [ ! -f "keypairs/mcp-server-registry-testnet-keypair.json" ]; then
    print_status "Generating MCP Server Registry keypair for testnet..."
    solana-keygen new --no-bip39-passphrase --outfile keypairs/mcp-server-registry-testnet-keypair.json
fi

# Get program IDs
AGENT_REGISTRY_ID=$(solana-keygen pubkey keypairs/agent-registry-testnet-keypair.json)
MCP_SERVER_REGISTRY_ID=$(solana-keygen pubkey keypairs/mcp-server-registry-testnet-keypair.json)

print_header "Program IDs for Testnet:"
echo "  Agent Registry: $AGENT_REGISTRY_ID"
echo "  MCP Server Registry: $MCP_SERVER_REGISTRY_ID"

# Calculate deployment costs
AGENT_REGISTRY_SIZE=$(stat -c%s target/deploy/solana_agent_registry.so)
MCP_SERVER_REGISTRY_SIZE=$(stat -c%s target/deploy/solana_mcp.so)
TOTAL_SIZE=$((AGENT_REGISTRY_SIZE + MCP_SERVER_REGISTRY_SIZE))

# Rough estimate: 1 lamport per byte + buffer
ESTIMATED_COST=$((TOTAL_SIZE * 2))
ESTIMATED_COST_SOL=$(echo "scale=4; $ESTIMATED_COST / 1000000000" | bc)

print_status "Estimated deployment cost: ~$ESTIMATED_COST_SOL SOL"

echo ""
read -p "Continue with deployment? (y/N): " -n 1 -r
echo
if [[ ! $REPLY =~ ^[Yy]$ ]]; then
    echo "Deployment cancelled."
    exit 0
fi

# Deploy Agent Registry
print_header "Deploying Agent Registry to testnet..."
solana program deploy \
    --program-id keypairs/agent-registry-testnet-keypair.json \
    target/deploy/solana_agent_registry.so \
    --max-sign-attempts 100

if [ $? -eq 0 ]; then
    print_status "✅ Agent Registry deployed successfully"
else
    print_error "❌ Failed to deploy Agent Registry"
    exit 1
fi

# Deploy MCP Server Registry
print_header "Deploying MCP Server Registry to testnet..."
solana program deploy \
    --program-id keypairs/mcp-server-registry-testnet-keypair.json \
    target/deploy/solana_mcp.so \
    --max-sign-attempts 100

if [ $? -eq 0 ]; then
    print_status "✅ MCP Server Registry deployed successfully"
else
    print_error "❌ Failed to deploy MCP Server Registry"
    exit 1
fi

# Save deployment info
cat > deployment-info-testnet.json << EOF
{
  "network": "testnet",
  "timestamp": "$(date -u +%Y-%m-%dT%H:%M:%SZ)",
  "programs": {
    "agent_registry": {
      "program_id": "$AGENT_REGISTRY_ID",
      "keypair_file": "keypairs/agent-registry-testnet-keypair.json"
    },
    "mcp_server_registry": {
      "program_id": "$MCP_SERVER_REGISTRY_ID",
      "keypair_file": "keypairs/mcp-server-registry-testnet-keypair.json"
    }
  },
  "rpc_url": "https://api.testnet.solana.com",
  "explorer_base": "https://explorer.solana.com"
}
EOF

print_status "Deployment info saved to deployment-info-testnet.json"

# Display final information
print_header "🎉 Testnet deployment completed successfully!"
echo ""
echo "📋 Deployment Summary:"
echo "  Network: Testnet"
echo "  Agent Registry: $AGENT_REGISTRY_ID"
echo "  MCP Server Registry: $MCP_SERVER_REGISTRY_ID"
echo ""
echo "🔗 Explorer Links:"
echo "  Agent Registry: https://explorer.solana.com/address/$AGENT_REGISTRY_ID?cluster=testnet"
echo "  MCP Server Registry: https://explorer.solana.com/address/$MCP_SERVER_REGISTRY_ID?cluster=testnet"
echo ""
echo "📁 Important Files:"
echo "  • keypairs/agent-registry-testnet-keypair.json (keep secure!)"
echo "  • keypairs/mcp-server-registry-testnet-keypair.json (keep secure!)"
echo "  • deployment-info-testnet.json"
echo ""
print_warning "⚠️  Keep your keypair files secure and backed up!"
print_warning "⚠️  These are testnet deployments - not for production use!"