#!/bin/bash
set -e

echo "🚀 Setting up AEAMCP Git Registration Backend..."

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Check if required tools are installed
check_dependencies() {
    echo -e "${YELLOW}Checking dependencies...${NC}"
    
    # Check Node.js
    if ! command -v node &> /dev/null; then
        echo -e "${RED}❌ Node.js is not installed. Please install Node.js 18+ first.${NC}"
        exit 1
    fi
    
    NODE_VERSION=$(node -v | cut -d'v' -f2 | cut -d'.' -f1)
    if [ "$NODE_VERSION" -lt 18 ]; then
        echo -e "${RED}❌ Node.js version $NODE_VERSION is too old. Please install Node.js 18+${NC}"
        exit 1
    fi
    echo -e "${GREEN}✅ Node.js $(node -v) found${NC}"
    
    # Check npm
    if ! command -v npm &> /dev/null; then
        echo -e "${RED}❌ npm is not installed${NC}"
        exit 1
    fi
    echo -e "${GREEN}✅ npm $(npm -v) found${NC}"
    
    # Check PostgreSQL
    if ! command -v psql &> /dev/null; then
        echo -e "${YELLOW}⚠️  PostgreSQL client not found. Make sure PostgreSQL is accessible.${NC}"
    else
        echo -e "${GREEN}✅ PostgreSQL client found${NC}"
    fi
    
    # Check Redis
    if ! command -v redis-cli &> /dev/null; then
        echo -e "${YELLOW}⚠️  Redis client not found. Make sure Redis is accessible.${NC}"
    else
        echo -e "${GREEN}✅ Redis client found${NC}"
    fi
    
    # Check Git
    if ! command -v git &> /dev/null; then
        echo -e "${RED}❌ Git is not installed${NC}"
        exit 1
    fi
    echo -e "${GREEN}✅ Git $(git --version) found${NC}"
}

# Install Node.js dependencies
install_dependencies() {
    echo -e "${YELLOW}Installing Node.js dependencies...${NC}"
    npm install
    echo -e "${GREEN}✅ Dependencies installed${NC}"
}

# Setup environment variables
setup_environment() {
    echo -e "${YELLOW}Setting up environment variables...${NC}"
    
    if [ ! -f .env ]; then
        cp .env.example .env
        echo -e "${GREEN}✅ Created .env file from template${NC}"
        echo -e "${YELLOW}⚠️  Please edit .env file with your actual configuration values${NC}"
        echo -e "${YELLOW}   Required: GITHUB_APP_ID, GITHUB_APP_PRIVATE_KEY, DATABASE_URL, REDIS_URL${NC}"
    else
        echo -e "${GREEN}✅ .env file already exists${NC}"
    fi
}

# Create logs directory
setup_logs() {
    echo -e "${YELLOW}Setting up logs directory...${NC}"
    mkdir -p logs
    echo -e "${GREEN}✅ Logs directory created${NC}"
}

# Create temp directory for git operations
setup_temp() {
    echo -e "${YELLOW}Setting up temporary directory...${NC}"
    mkdir -p /tmp/git-analysis
    echo -e "${GREEN}✅ Temporary directory created${NC}"
}

# Build TypeScript
build_project() {
    echo -e "${YELLOW}Building TypeScript project...${NC}"
    npm run build
    echo -e "${GREEN}✅ Project built successfully${NC}"
}

# Main setup function
main() {
    echo -e "${GREEN}Starting AEAMCP Backend Setup${NC}"
    echo "================================"
    
    check_dependencies
    install_dependencies
    setup_environment
    setup_logs
    setup_temp
    build_project
    
    echo ""
    echo -e "${GREEN}🎉 Setup completed successfully!${NC}"
    echo ""
    echo -e "${YELLOW}Next steps:${NC}"
    echo "1. Edit .env file with your configuration"
    echo "2. Set up PostgreSQL database and Redis"
    echo "3. Run database migrations: npm run migrate"
    echo "4. Start development server: npm run dev"
    echo ""
    echo -e "${YELLOW}For testing:${NC}"
    echo "- Run health check: npm run test:health"
    echo "- Run API tests: npm run test:api"
    echo "- Check logs: tail -f logs/combined.log"
}

main "$@"