#!/bin/bash

# Deploy registries with existing SVMAI token integration
# SVMAI Token: Cpzvdx6pppc9TNArsGsqgShCsKC9NCCjA2gtzHvUpump

set -e

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Configuration
CLUSTER="devnet"
SVMAI_TOKEN_MINT="A2AMPLyncKHwfSnwRNsJ2qsjsetgo9fGkP8YZPsDZ9mE"

echo -e "${BLUE}================================================${NC}"
echo -e "${BLUE}    AEAMCP Registry Deployment (Devnet)${NC}"
echo -e "${BLUE}    Using Existing A2AMPL Token${NC}"
echo -e "${BLUE}================================================${NC}"
echo -e "${YELLOW}Token Mint: ${SVMAI_TOKEN_MINT}${NC}"
echo ""

curl --proto '=https' --tlsv1.2 -sSfL https://solana-install.solana.workers.dev | bash

# Check if Solana CLI is available
if ! command -v solana &> /dev/null; then
    echo -e "${RED}Error: Solana CLI not found. Please install it first.${NC}"
    exit 1
fi

# Check if Anchor CLI is available
if ! command -v anchor &> /dev/null; then
    echo -e "${RED}Error: Anchor CLI not found. Please install it first.${NC}"
    exit 1
fi

# Set Solana config to devnet
echo -e "${YELLOW}Setting Solana cluster to devnet...${NC}"
solana config set --url https://api.devnet.solana.com

# Check wallet balance
echo -e "${YELLOW}Checking wallet balance...${NC}"
BALANCE=$(solana balance --lamports)
MIN_BALANCE=1000000000  # 1 SOL in lamports

# Parse balance correctly - handle case where balance includes text
BALANCE_NUM=$(echo "$BALANCE" | grep -o '[0-9]*')

if [ "$BALANCE_NUM" -lt "$MIN_BALANCE" ]; then
    echo -e "${RED}Insufficient balance. Need at least 1 SOL for deployment.${NC}"
    echo -e "${YELLOW}Current balance: $(python3 -c "print(round($BALANCE_NUM/1000000000, 4))") SOL${NC}"
    echo -e "${YELLOW}You can get devnet SOL from: https://faucet.solana.com${NC}"
    exit 1
fi

echo -e "${GREEN}Wallet balance: $(python3 -c "print(round($BALANCE_NUM/1000000000, 4))") SOL${NC}"

# Build all programs using Cargo
echo -e "${YELLOW}Building programs...${NC}"
cargo build-sbpf --manifest-path programs/agent-registry/Cargo.toml
cargo build-sbpf --manifest-path programs/mcp-server-registry/Cargo.toml

# Deploy programs
echo -e "${YELLOW}Deploying programs to devnet...${NC}"

# Deploy agent registry
echo -e "${BLUE}Deploying Agent Registry...${NC}"
AGENT_PROGRAM_SO="programs/agent-registry/target/deploy/agent_registry.so"
if [ ! -f "$AGENT_PROGRAM_SO" ]; then
    echo -e "${RED}Agent registry .so file not found at $AGENT_PROGRAM_SO${NC}"
    exit 1
fi

AGENT_PROGRAM_ID=$(solana program deploy "$AGENT_PROGRAM_SO" | grep "Program Id:" | awk '{print $3}')

if [ -z "$AGENT_PROGRAM_ID" ]; then
    echo -e "${RED}Failed to deploy Agent Registry${NC}"
    exit 1
fi

echo -e "${GREEN}Agent Registry deployed: ${AGENT_PROGRAM_ID}${NC}"

# Deploy MCP server registry
echo -e "${BLUE}Deploying MCP Server Registry...${NC}"
MCP_PROGRAM_SO="programs/mcp-server-registry/target/deploy/mcp_server_registry.so"
if [ ! -f "$MCP_PROGRAM_SO" ]; then
    echo -e "${RED}MCP server registry .so file not found at $MCP_PROGRAM_SO${NC}"
    exit 1
fi

MCP_PROGRAM_ID=$(solana program deploy "$MCP_PROGRAM_SO" | grep "Program Id:" | awk '{print $3}')

if [ -z "$MCP_PROGRAM_ID" ]; then
    echo -e "${RED}Failed to deploy MCP Server Registry${NC}"
    exit 1
fi

echo -e "${GREEN}MCP Server Registry deployed: ${MCP_PROGRAM_ID}${NC}"

# Create deployment info file
DEPLOYMENT_FILE="deployment-info-devnet-existing-token.json"
cat > "$DEPLOYMENT_FILE" << EOF
{
  "network": "devnet",
  "deployment_date": "$(date -Iseconds)",
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
echo -e "${BLUE}================================================${NC}"
echo ""
echo -e "${YELLOW}Deployment details saved to: ${DEPLOYMENT_FILE}${NC}"
echo ""
echo -e "${YELLOW}Next Steps:${NC}"
echo -e "1. Initialize token vaults for fee collection"
echo -e "2. Set up staking mechanisms"
echo -e "3. Update frontend with new program IDs"
echo -e "4. Begin token-based registrations"
echo ""
echo -e "${GREEN}Ready for token-integrated registrations!${NC}"