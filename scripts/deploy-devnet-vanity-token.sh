#!/bin/bash

# Deploy A2AMPL token with vanity address and registries for devnet
# Vanity Token: A2AMPLyncKHwfSnwRNsJ2qsjsetgo9fGkP8YZPsDZ9mE

set -e

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Configuration
CLUSTER="devnet"
VANITY_TOKEN="A2AMPLyncKHwfSnwRNsJ2qsjsetgo9fGkP8YZPsDZ9mE"
TOKEN_SUPPLY=1000000000  # 1 billion tokens
TOKEN_DECIMALS=9

echo -e "${BLUE}================================================${NC}"
echo -e "${BLUE}    AEAMCP Complete Deployment (Devnet)${NC}"
echo -e "${BLUE}    Creating Vanity A2AMPL Token${NC}"
echo -e "${BLUE}================================================${NC}"
echo -e "${YELLOW}Vanity Token: ${VANITY_TOKEN}${NC}"
echo ""

# Check if Solana CLI is available
if ! command -v solana &> /dev/null; then
    echo -e "${RED}Error: Solana CLI not found. Please install it first.${NC}"
    exit 1
fi

# Check if SPL Token CLI is available
if ! command -v spl-token &> /dev/null; then
    echo -e "${RED}Error: SPL Token CLI not found. Please install it first.${NC}"
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
MIN_BALANCE=2000000000  # 2 SOL in lamports

if [ "$BALANCE" -lt "$MIN_BALANCE" ]; then
    echo -e "${RED}Insufficient balance. Need at least 2 SOL for deployment.${NC}"
    echo -e "${YELLOW}Current balance: $(echo "scale=9; $BALANCE/1000000000" | bc) SOL${NC}"
    echo -e "${YELLOW}You can get devnet SOL from: https://faucet.solana.com${NC}"
    exit 1
fi

echo -e "${GREEN}Wallet balance: $(echo "scale=9; $BALANCE/1000000000" | bc) SOL${NC}"

# Step 1: Create A2AMPL Token with vanity address
echo -e "${YELLOW}Creating A2AMPL token with vanity address...${NC}"

# Check if vanity token keypair exists
if [ ! -f "A2AMPLyncKHwfSnwRNsJ2qsjsetgo9fGkP8YZPsDZ9mE.json" ]; then
    echo -e "${YELLOW}Generating vanity token keypair...${NC}"
    # Generate a keypair that produces the vanity address
    # Note: This would normally require a vanity generator tool
    # For now, we'll create a token and note the difference
    spl-token create-token --decimals $TOKEN_DECIMALS
    ACTUAL_TOKEN=$(spl-token create-token --decimals $TOKEN_DECIMALS | grep "Creating token" | awk '{print $3}')
    echo -e "${RED}Note: Generated token ${ACTUAL_TOKEN} instead of vanity address${NC}"
    echo -e "${YELLOW}Using generated token for devnet testing...${NC}"
    A2AMPL_TOKEN_MINT=$ACTUAL_TOKEN
else
    echo -e "${YELLOW}Using existing vanity token keypair...${NC}"
    A2AMPL_TOKEN_MINT=$VANITY_TOKEN
    # Create token with specific keypair
    spl-token create-token --decimals $TOKEN_DECIMALS A2AMPLyncKHwfSnwRNsJ2qsjsetgo9fGkP8YZPsDZ9mE.json
fi

echo -e "${GREEN}A2AMPL Token created: ${A2AMPL_TOKEN_MINT}${NC}"

# Step 2: Create initial token supply
echo -e "${YELLOW}Minting initial token supply...${NC}"
MINT_TO=$(solana address)
spl-token create-account $A2AMPL_TOKEN_MINT
spl-token mint $A2AMPL_TOKEN_MINT $TOKEN_SUPPLY

echo -e "${GREEN}Minted ${TOKEN_SUPPLY} A2AMPL tokens to ${MINT_TO}${NC}"

# Step 3: Build all programs
echo -e "${YELLOW}Building programs...${NC}"
anchor build

# Step 4: Deploy programs
echo -e "${YELLOW}Deploying programs to devnet...${NC}"

# Deploy agent registry
echo -e "${BLUE}Deploying Agent Registry...${NC}"
AGENT_PROGRAM_ID=$(solana program deploy --program-id target/deploy/solana_a2a-keypair.json target/deploy/solana_a2a.so | grep "Program Id:" | awk '{print $3}')

if [ -z "$AGENT_PROGRAM_ID" ]; then
    echo -e "${RED}Failed to deploy Agent Registry${NC}"
    exit 1
fi

echo -e "${GREEN}Agent Registry deployed: ${AGENT_PROGRAM_ID}${NC}"

# Deploy MCP server registry  
echo -e "${BLUE}Deploying MCP Server Registry...${NC}"
MCP_PROGRAM_ID=$(solana program deploy --program-id target/deploy/solana_mcp-keypair.json target/deploy/solana_mcp.so | grep "Program Id:" | awk '{print $3}')

if [ -z "$MCP_PROGRAM_ID" ]; then
    echo -e "${RED}Failed to deploy MCP Server Registry${NC}"
    exit 1
fi

echo -e "${GREEN}MCP Server Registry deployed: ${MCP_PROGRAM_ID}${NC}"

# Step 5: Create deployment info file
DEPLOYMENT_FILE="deployment-info-devnet-vanity.json"
cat > "$DEPLOYMENT_FILE" << EOF
{
  "network": "devnet",
  "deployment_date": "$(date -Iseconds)",
  "a2ampl_token": {
    "mint": "$A2AMPL_TOKEN_MINT",
    "intended_vanity": "$VANITY_TOKEN",
    "decimals": $TOKEN_DECIMALS,
    "initial_supply": $TOKEN_SUPPLY
  },
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
    "agent_registration_fee": "100 A2AMPL",
    "mcp_registration_fee": "50 A2AMPL",
    "staking_tiers": {
      "bronze": "1,000 A2AMPL",
      "silver": "10,000 A2AMPL",
      "gold": "50,000 A2AMPL",
      "platinum": "100,000 A2AMPL"
    }
  },
  "wallet_setup": {
    "mint_authority": "$(solana address)",
    "initial_token_holder": "$(solana address)"
  },
  "next_steps": [
    "Initialize token vaults for each registry",
    "Set up fee collection mechanisms",
    "Configure staking parameters",
    "Begin token-based registrations",
    "Test token transfers and fees"
  ]
}
EOF

echo ""
echo -e "${GREEN}✅ Complete Deployment Successful!${NC}"
echo -e "${BLUE}================================================${NC}"
echo -e "${GREEN}A2AMPL Token Mint: ${A2AMPL_TOKEN_MINT}${NC}"
echo -e "${GREEN}Agent Registry Program ID: ${AGENT_PROGRAM_ID}${NC}"
echo -e "${GREEN}MCP Server Registry Program ID: ${MCP_PROGRAM_ID}${NC}"
echo -e "${GREEN}Initial Supply: ${TOKEN_SUPPLY} A2AMPL${NC}"
echo -e "${BLUE}================================================${NC}"
echo ""
echo -e "${YELLOW}Deployment details saved to: ${DEPLOYMENT_FILE}${NC}"
echo ""
echo -e "${YELLOW}Token Information:${NC}"
echo -e "• Decimals: ${TOKEN_DECIMALS}"
echo -e "• Supply: ${TOKEN_SUPPLY} A2AMPL"
echo -e "• Holder: $(solana address)"
echo ""
echo -e "${YELLOW}Next Steps:${NC}"
echo -e "1. Initialize token vaults for fee collection"
echo -e "2. Test token transfers"
echo -e "3. Set up staking mechanisms"
echo -e "4. Update frontend with new program IDs"
echo -e "5. Begin token-based registrations"
echo ""
echo -e "${GREEN}Ready for full token-integrated operations!${NC}"