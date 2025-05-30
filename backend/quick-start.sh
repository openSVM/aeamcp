#!/bin/bash
set -e

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

echo -e "${BLUE}🚀 AEAMCP Git Registration - Quick Start${NC}"
echo "=========================================="
echo ""

# Check if we're in the backend directory
if [ ! -f "package.json" ]; then
    echo -e "${RED}❌ Please run this script from the backend directory${NC}"
    exit 1
fi

# Option selection
echo -e "${YELLOW}Choose deployment method:${NC}"
echo "1. 🐳 Docker (Recommended - includes database & Redis)"
echo "2. 💻 Local Development (requires manual database setup)"
echo "3. 🧪 Test existing deployment"
echo ""
read -p "Enter your choice (1-3): " choice

case $choice in
    1)
        echo -e "${BLUE}Starting Docker deployment...${NC}"
        
        # Check if Docker is installed
        if ! command -v docker &> /dev/null || ! command -v docker-compose &> /dev/null; then
            echo -e "${RED}❌ Docker and Docker Compose are required but not installed${NC}"
            echo "Please install Docker Desktop from: https://www.docker.com/products/docker-desktop"
            exit 1
        fi
        
        # Create .env if it doesn't exist
        if [ ! -f .env ]; then
            echo -e "${YELLOW}Creating .env file...${NC}"
            cp .env.example .env
            echo -e "${GREEN}✅ Created .env file${NC}"
            echo -e "${YELLOW}⚠️  For full functionality, edit .env with your GitHub App credentials${NC}"
            echo ""
        fi
        
        # Start services
        echo -e "${YELLOW}Starting services with Docker Compose...${NC}"
        docker-compose up -d
        
        echo -e "${YELLOW}Waiting for services to be ready (30 seconds)...${NC}"
        sleep 30
        
        # Test deployment
        echo -e "${YELLOW}Testing deployment...${NC}"
        if curl -s http://localhost:3001/health > /dev/null; then
            echo -e "${GREEN}🎉 Deployment successful!${NC}"
            echo ""
            echo -e "${BLUE}Service URLs:${NC}"
            echo "- API: http://localhost:3001"
            echo "- Health: http://localhost:3001/health"
            echo "- API Info: http://localhost:3001/api/v1"
            echo ""
            echo -e "${YELLOW}Next steps:${NC}"
            echo "1. Edit .env with your GitHub App credentials (optional)"
            echo "2. Test the API: npm run test:api"
            echo "3. View logs: docker-compose logs -f"
            echo "4. Stop services: docker-compose down"
        else
            echo -e "${RED}❌ Deployment failed - services not responding${NC}"
            echo "Check logs: docker-compose logs"
            exit 1
        fi
        ;;
        
    2)
        echo -e "${BLUE}Setting up local development...${NC}"
        
        # Run setup script
        if [ -f "scripts/setup.sh" ]; then
            chmod +x scripts/setup.sh
            ./scripts/setup.sh
        else
            echo -e "${YELLOW}Running manual setup...${NC}"
            npm install
            mkdir -p logs /tmp/git-analysis
            if [ ! -f .env ]; then
                cp .env.example .env
            fi
            npm run build
        fi
        
        echo -e "${YELLOW}⚠️  Make sure PostgreSQL and Redis are running locally${NC}"
        echo "PostgreSQL: postgresql://aeamcp_user:password@localhost:5432/aeamcp_git_registration"
        echo "Redis: redis://localhost:6379"
        echo ""
        echo -e "${YELLOW}To start the server:${NC}"
        echo "npm run dev"
        ;;
        
    3)
        echo -e "${BLUE}Testing existing deployment...${NC}"
        
        # Check if server is running
        if curl -s http://localhost:3001/health > /dev/null; then
            echo -e "${GREEN}✅ Server is running${NC}"
            
            # Run comprehensive tests
            if [ -f "scripts/test-api.sh" ]; then
                chmod +x scripts/test-api.sh
                ./scripts/test-api.sh all
            else
                echo -e "${YELLOW}Running basic tests...${NC}"
                curl -s http://localhost:3001/health | head -c 100
                echo ""
                curl -s http://localhost:3001/api/v1 | head -c 100
                echo ""
            fi
        else
            echo -e "${RED}❌ Server is not running${NC}"
            echo "Please start the server first:"
            echo "- Docker: docker-compose up -d"
            echo "- Local: npm run dev"
            exit 1
        fi
        ;;
        
    *)
        echo -e "${RED}❌ Invalid choice${NC}"
        exit 1
        ;;
esac

echo ""
echo -e "${GREEN}🎯 Quick start completed!${NC}"
echo ""
echo -e "${BLUE}Useful commands:${NC}"
echo "- Test API: npm run test:api"
echo "- View logs: docker-compose logs -f (Docker) or tail -f logs/combined.log (Local)"
echo "- Stop services: docker-compose down (Docker) or Ctrl+C (Local)"
echo "- Check health: curl http://localhost:3001/health"
echo ""
echo -e "${YELLOW}For detailed documentation, see:${NC}"
echo "- README.md - Complete setup guide"
echo "- docs/DEPLOYMENT_AND_TESTING_GUIDE.md - Comprehensive deployment guide"