#!/bin/bash

# Deploy script for Mainnet
set -e

echo "🚀 Deploying Solana AI Registries to Mainnet..."

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
MAGENTA='\033[0;35m'
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

print_critical() {
    echo -e "${MAGENTA}[CRITICAL]${NC} $1"
}

# Critical warnings
print_critical "🚨 MAINNET DEPLOYMENT WARNING 🚨"
echo ""
echo -e "${RED}You are about to deploy to SOLANA MAINNET${NC}"
echo "This deployment will:"
echo "  • Use REAL SOL tokens (significant cost)"
echo "  • Create PERMANENT programs on mainnet"
echo "  • Be PUBLICLY ACCESSIBLE to all users"
echo "  • Require SIGNIFICANT SOL for deployment (~10-50 SOL)"
echo ""
print_warning "⚠️  Ensure you have thoroughly tested on devnet and testnet first!"
print_warning "⚠️  Make sure your programs are audited and production-ready!"
print_warning "⚠️  Have sufficient SOL balance for deployment costs!"
echo ""

# Multiple confirmations
read -p "Have you tested thoroughly on devnet and testnet? (y/N): " -n 1 -r
echo
if [[ ! $REPLY =~ ^[Yy]$ ]]; then
    echo "Please test on devnet and testnet first."
    exit 0
fi

read -p "Are your programs audited and production-ready? (y/N): " -n 1 -r
echo
if [[ ! $REPLY =~ ^[Yy]$ ]]; then
    echo "Please ensure your programs are audited before mainnet deployment."
    exit 0
fi

read -p "Do you have sufficient SOL for deployment costs? (y/N): " -n 1 -r
echo
if [[ ! $REPLY =~ ^[Yy]$ ]]; then
    echo "Please ensure you have sufficient SOL balance."
    exit 0
fi

echo ""
print_critical "FINAL CONFIRMATION"
read -p "Type 'DEPLOY TO MAINNET' to confirm: " confirmation
if [ "$confirmation" != "DEPLOY TO MAINNET" ]; then
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

# Set Solana config for mainnet
print_status "Configuring Solana for mainnet..."
solana config set --url mainnet-beta

# Check wallet balance
BALANCE=$(solana balance --lamports)
BALANCE_SOL=$(echo "scale=2; $BALANCE / 1000000000" | bc)
print_status "Current wallet balance: $BALANCE_SOL SOL"

if [ "$BALANCE" -lt 20000000000 ]; then  # 20 SOL in lamports
    print_error "Insufficient balance for mainnet deployment. You need at least 20 SOL."
    echo "Mainnet deployment costs are significant. Please fund your wallet."
    exit 1
fi

# Create keypairs for program IDs if they don't exist
mkdir -p keypairs

if [ ! -f "keypairs/agent-registry-mainnet-keypair.json" ]; then
    print_status "Generating Agent Registry keypair for mainnet..."
    solana-keygen new --no-bip39-passphrase --outfile keypairs/agent-registry-mainnet-keypair.json
    print_warning "🔐 BACKUP THIS KEYPAIR IMMEDIATELY!"
fi

if [ ! -f "keypairs/mcp-server-registry-mainnet-keypair.json" ]; then
    print_status "Generating MCP Server Registry keypair for mainnet..."
    solana-keygen new --no-bip39-passphrase --outfile keypairs/mcp-server-registry-mainnet-keypair.json
    print_warning "🔐 BACKUP THIS KEYPAIR IMMEDIATELY!"
fi

# Get program IDs
AGENT_REGISTRY_ID=$(solana-keygen pubkey keypairs/agent-registry-mainnet-keypair.json)
MCP_SERVER_REGISTRY_ID=$(solana-keygen pubkey keypairs/mcp-server-registry-mainnet-keypair.json)

print_header "Program IDs for Mainnet:"
echo "  Agent Registry: $AGENT_REGISTRY_ID"
echo "  MCP Server Registry: $MCP_SERVER_REGISTRY_ID"

# Calculate deployment costs
AGENT_REGISTRY_SIZE=$(stat -c%s target/deploy/solana_agent_registry.so)
MCP_SERVER_REGISTRY_SIZE=$(stat -c%s target/deploy/solana_mcp.so)
TOTAL_SIZE=$((AGENT_REGISTRY_SIZE + MCP_SERVER_REGISTRY_SIZE))

# More accurate mainnet cost estimate
ESTIMATED_COST=$((TOTAL_SIZE * 10))  # Higher multiplier for mainnet
ESTIMATED_COST_SOL=$(echo "scale=4; $ESTIMATED_COST / 1000000000" | bc)

print_status "Estimated deployment cost: ~$ESTIMATED_COST_SOL SOL"
print_warning "Actual costs may be higher due to network congestion"

echo ""
read -p "Continue with MAINNET deployment? (y/N): " -n 1 -r
echo
if [[ ! $REPLY =~ ^[Yy]$ ]]; then
    echo "Deployment cancelled."
    exit 0
fi

# Create backup of keypairs
print_status "Creating backup of keypairs..."
mkdir -p backups
cp keypairs/agent-registry-mainnet-keypair.json backups/agent-registry-mainnet-keypair-$(date +%Y%m%d-%H%M%S).json
cp keypairs/mcp-server-registry-mainnet-keypair.json backups/mcp-server-registry-mainnet-keypair-$(date +%Y%m%d-%H%M%S).json

# Deploy Agent Registry
print_header "Deploying Agent Registry to MAINNET..."
print_warning "This may take several minutes and cost significant SOL..."

solana program deploy \
    --program-id keypairs/agent-registry-mainnet-keypair.json \
    target/deploy/solana_agent_registry.so \
    --max-sign-attempts 200 \
    --with-compute-unit-price 1000

if [ $? -eq 0 ]; then
    print_status "✅ Agent Registry deployed successfully to MAINNET"
else
    print_error "❌ Failed to deploy Agent Registry to MAINNET"
    exit 1
fi

# Deploy MCP Server Registry
print_header "Deploying MCP Server Registry to MAINNET..."
print_warning "This may take several minutes and cost significant SOL..."

solana program deploy \
    --program-id keypairs/mcp-server-registry-mainnet-keypair.json \
    target/deploy/solana_mcp.so \
    --max-sign-attempts 200 \
    --with-compute-unit-price 1000

if [ $? -eq 0 ]; then
    print_status "✅ MCP Server Registry deployed successfully to MAINNET"
else
    print_error "❌ Failed to deploy MCP Server Registry to MAINNET"
    exit 1
fi

# Save deployment info
cat > deployment-info-mainnet.json << EOF
{
  "network": "mainnet-beta",
  "timestamp": "$(date -u +%Y-%m-%dT%H:%M:%SZ)",
  "programs": {
    "agent_registry": {
      "program_id": "$AGENT_REGISTRY_ID",
      "keypair_file": "keypairs/agent-registry-mainnet-keypair.json"
    },
    "mcp_server_registry": {
      "program_id": "$MCP_SERVER_REGISTRY_ID",
      "keypair_file": "keypairs/mcp-server-registry-mainnet-keypair.json"
    }
  },
  "rpc_url": "https://api.mainnet-beta.solana.com",
  "explorer_base": "https://explorer.solana.com",
  "deployment_cost_estimate": "$ESTIMATED_COST_SOL SOL",
  "backup_location": "backups/"
}
EOF

print_status "Deployment info saved to deployment-info-mainnet.json"

# Final balance check
FINAL_BALANCE=$(solana balance --lamports)
FINAL_BALANCE_SOL=$(echo "scale=2; $FINAL_BALANCE / 1000000000" | bc)
COST_SOL=$(echo "scale=2; ($BALANCE - $FINAL_BALANCE) / 1000000000" | bc)

# Display final information
print_header "🎉 MAINNET DEPLOYMENT COMPLETED SUCCESSFULLY! 🎉"
echo ""
echo "📋 Deployment Summary:"
echo "  Network: Mainnet Beta"
echo "  Agent Registry: $AGENT_REGISTRY_ID"
echo "  MCP Server Registry: $MCP_SERVER_REGISTRY_ID"
echo "  Deployment Cost: $COST_SOL SOL"
echo "  Remaining Balance: $FINAL_BALANCE_SOL SOL"
echo ""
echo "🔗 Explorer Links:"
echo "  Agent Registry: https://explorer.solana.com/address/$AGENT_REGISTRY_ID"
echo "  MCP Server Registry: https://explorer.solana.com/address/$MCP_SERVER_REGISTRY_ID"
echo ""
echo "📁 Important Files (KEEP SECURE!):"
echo "  • keypairs/agent-registry-mainnet-keypair.json"
echo "  • keypairs/mcp-server-registry-mainnet-keypair.json"
echo "  • deployment-info-mainnet.json"
echo "  • backups/ (timestamped backups)"
echo ""
print_critical "🔐 CRITICAL SECURITY REMINDERS:"
echo "  • Store keypairs in multiple secure locations"
echo "  • Never share keypair files publicly"
echo "  • Consider using hardware wallets for program authority"
echo "  • Monitor your programs for any issues"
echo ""
print_status "🌟 Your Solana AI Registries are now LIVE on MAINNET!"
print_status "🌟 Users worldwide can now discover and register agents and MCP servers!"