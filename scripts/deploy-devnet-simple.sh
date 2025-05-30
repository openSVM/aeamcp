#!/bin/bash

# Simple deployment script for devnet with existing SVMAI token
# SVMAI Token: Cpzvdx6pppc9TNArsGsqgShCsKC9NCCjA2gtzHvUpump

set -e

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Add Solana to PATH
export PATH="/home/codespace/.local/share/solana/install/active_release/bin:$PATH"

# Configuration
CLUSTER="devnet"
SVMAI_TOKEN_MINT="Cpzvdx6pppc9TNArsGsqgShCsKC9NCCjA2gtzHvUpump"

echo -e "${BLUE}================================================${NC}"
echo -e "${BLUE}    AEAMCP Registry Deployment (Devnet)${NC}"
echo -e "${BLUE}    Using Existing SVMAI Token${NC}"
echo -e "${BLUE}================================================${NC}"
echo -e "${YELLOW}Token Mint: ${SVMAI_TOKEN_MINT}${NC}"
echo ""

# Check if Solana CLI is working
echo -e "${YELLOW}Checking Solana CLI...${NC}"
if ! solana --version; then
    echo -e "${RED}Error: Solana CLI not working${NC}"
    exit 1
fi

# Set Solana config to devnet
echo -e "${YELLOW}Setting Solana cluster to devnet...${NC}"
solana config set --url https://api.devnet.solana.com

# Check if we have a keypair
echo -e "${YELLOW}Checking wallet configuration...${NC}"
if ! solana address; then
    echo -e "${YELLOW}No keypair found, generating one...${NC}"
    solana-keygen new --no-bip39-passphrase --silent
fi

# Check wallet balance
echo -e "${YELLOW}Checking wallet balance...${NC}"
BALANCE=$(solana balance --lamports 2>/dev/null || echo "0")
MIN_BALANCE=1000000000  # 1 SOL in lamports

# Parse balance correctly
BALANCE_NUM=$(echo "$BALANCE" | grep -o '[0-9]*' | head -1)

if [ "$BALANCE_NUM" -lt "$MIN_BALANCE" ]; then
    echo -e "${RED}Insufficient balance. Need at least 1 SOL for deployment.${NC}"
    echo -e "${YELLOW}Current balance: $(echo "scale=4; $BALANCE_NUM/1000000000" | bc -l) SOL${NC}"
    echo -e "${YELLOW}You can get devnet SOL from: https://faucet.solana.com${NC}"
    echo -e "${YELLOW}Wallet address: $(solana address)${NC}"
    exit 1
fi

echo -e "${GREEN}Wallet balance: $(echo "scale=4; $BALANCE_NUM/1000000000" | bc -l) SOL${NC}"
echo -e "${GREEN}Wallet address: $(solana address)${NC}"

# Build programs
echo -e "${YELLOW}Building programs...${NC}"

echo -e "${BLUE}Building Agent Registry...${NC}"
if ! cargo build-sbf --manifest-path programs/agent-registry/Cargo.toml; then
    echo -e "${RED}Failed to build Agent Registry${NC}"
    exit 1
fi

echo -e "${BLUE}Building MCP Server Registry...${NC}"
if ! cargo build-sbf --manifest-path programs/mcp-server-registry/Cargo.toml; then
    echo -e "${RED}Failed to build MCP Server Registry${NC}"
    exit 1
fi

# Deploy programs
echo -e "${YELLOW}Deploying programs to devnet...${NC}"

# Deploy agent registry
echo -e "${BLUE}Deploying Agent Registry...${NC}"
AGENT_PROGRAM_SO="target/deploy/agent_registry.so"
if [ ! -f "$AGENT_PROGRAM_SO" ]; then
    echo -e "${RED}Agent registry .so file not found at $AGENT_PROGRAM_SO${NC}"
    exit 1
fi

AGENT_DEPLOY_OUTPUT=$(solana program deploy "$AGENT_PROGRAM_SO" --output json-compact)
AGENT_PROGRAM_ID=$(echo "$AGENT_DEPLOY_OUTPUT" | grep -o '"programId":"[^"]*"' | cut -d'"' -f4)

if [ -z "$AGENT_PROGRAM_ID" ]; then
    echo -e "${RED}Failed to deploy Agent Registry${NC}"
    echo "Deploy output: $AGENT_DEPLOY_OUTPUT"
    exit 1
fi

echo -e "${GREEN}Agent Registry deployed: ${AGENT_PROGRAM_ID}${NC}"

# Deploy MCP server registry
echo -e "${BLUE}Deploying MCP Server Registry...${NC}"
MCP_PROGRAM_SO="target/deploy/mcp_server_registry.so"
if [ ! -f "$MCP_PROGRAM_SO" ]; then
    echo -e "${RED}MCP server registry .so file not found at $MCP_PROGRAM_SO${NC}"
    exit 1
fi

MCP_DEPLOY_OUTPUT=$(solana program deploy "$MCP_PROGRAM_SO" --output json-compact)
MCP_PROGRAM_ID=$(echo "$MCP_DEPLOY_OUTPUT" | grep -o '"programId":"[^"]*"' | cut -d'"' -f4)

if [ -z "$MCP_PROGRAM_ID" ]; then
    echo -e "${RED}Failed to deploy MCP Server Registry${NC}"
    echo "Deploy output: $MCP_DEPLOY_OUTPUT"
    exit 1
fi

echo -e "${GREEN}MCP Server Registry deployed: ${MCP_PROGRAM_ID}${NC}"

# Create deployment info file
DEPLOYMENT_FILE="deployment-info-devnet-new.json"
cat > "$DEPLOYMENT_FILE" << EOF
{
  "network": "devnet",
  "deployment_date": "$(date -Iseconds)",
  "deployer_address": "$(solana address)",
  "svmai_token_mint": "$SVMAI_TOKEN_MINT",
  "programs": {
    "agent_registry": {
      "program_id": "$AGENT_PROGRAM_ID",
      "source": "programs/agent-registry/"
    },
    "mcp_server_registry": {
      "program_id": "$MCP_PROGRAM_ID", 
      "source": "programs/mcp-server-registry/"
    }
  },
  "token_integration": {
    "agent_registration_fee": "100 SVMAI",
    "mcp_registration_fee": "50 SVMAI",
    "staking_tiers": {
      "bronze": "1,000 SVMAI",
      "silver": "10,000 SVMAI", 
      "gold": "50,000 SVMAI",
      "platinum": "100,000 SVMAI"
    }
  },
  "explorer_urls": {
    "agent_registry": "https://explorer.solana.com/address/$AGENT_PROGRAM_ID?cluster=devnet",
    "mcp_server_registry": "https://explorer.solana.com/address/$MCP_PROGRAM_ID?cluster=devnet"
  },
  "next_steps": [
    "Initialize token vaults for each registry",
    "Set up fee collection mechanisms",
    "Configure staking parameters",
    "Begin token-based registrations"
  ]
}
EOF

echo ""
echo -e "${GREEN}✅ Deployment Complete!${NC}"
echo -e "${BLUE}================================================${NC}"
echo -e "${GREEN}Agent Registry Program ID: ${AGENT_PROGRAM_ID}${NC}"
echo -e "${GREEN}MCP Server Registry Program ID: ${MCP_PROGRAM_ID}${NC}"
echo -e "${GREEN}SVMAI Token Mint: ${SVMAI_TOKEN_MINT}${NC}"
echo -e "${GREEN}Deployer Address: $(solana address)${NC}"
echo -e "${BLUE}================================================${NC}"
echo ""
echo -e "${YELLOW}Deployment details saved to: ${DEPLOYMENT_FILE}${NC}"
echo ""
echo -e "${YELLOW}Explorer Links:${NC}"
echo -e "Agent Registry: https://explorer.solana.com/address/$AGENT_PROGRAM_ID?cluster=devnet"
echo -e "MCP Server Registry: https://explorer.solana.com/address/$MCP_PROGRAM_ID?cluster=devnet"
echo ""
echo -e "${YELLOW}Next Steps:${NC}"
echo -e "1. Initialize token vaults for fee collection"
echo -e "2. Set up staking mechanisms"
echo -e "3. Update frontend with new program IDs"
echo -e "4. Begin token-based registrations"
echo ""
echo -e "${GREEN}Ready for token-integrated registrations!${NC}"
