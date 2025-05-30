# AEAMCP Git Registration Backend

Intelligent Git-based registration system for MCP servers and agents on the Solana blockchain.

## Overview

This backend service provides automated analysis of Git repositories to extract MCP (Model Context Protocol) metadata and generate registration forms for the AEAMCP platform.

## Features

### Phase 1 Implementation ✅

- **GitHub Apps Authentication**: Secure access to private repositories
- **Repository Cloning**: Sandboxed git cloning with resource limits  
- **TypeScript/JavaScript Parser**: Extract MCP tools, resources, and prompts
- **Production Readiness Scoring**: Automated quality assessment
- **Redis Caching**: Performance optimization for repeated analyses
- **RESTful API**: Complete analysis workflow endpoints

### Core Workflow

1. User provides Git URL → `https://github.com/user/mcp-weather-server.git`
2. System clones and analyzes repository automatically
3. Extracts MCP metadata (tools, resources, prompts)
4. Scores production readiness (0-100)
5. Auto-generates registration form data
6. Returns structured results for frontend integration

## Architecture

```
┌─────────────────────────────────────────────────────────┐
│                    Frontend (Next.js)                   │
├─────────────────────────────────────────────────────────┤
│                    REST API Layer                       │
├─────────────────────────────────────────────────────────┤
│  GitHub Auth │  Git Clone  │  TS Parser │  Readiness    │
│   Service    │   Service   │   Engine   │   Scorer      │
├─────────────────────────────────────────────────────────┤
│     Redis Cache        │        PostgreSQL DB           │
└─────────────────────────────────────────────────────────┘
```

## Quick Start

### Prerequisites

- Node.js 18+
- PostgreSQL 12+
- Redis 6+
- Git command line tools

### 1. Environment Setup

```bash
# Copy environment template
cp .env.example .env

# Configure required variables
GITHUB_APP_ID=your_github_app_id
GITHUB_APP_PRIVATE_KEY="-----BEGIN RSA PRIVATE KEY-----\n...\n-----END RSA PRIVATE KEY-----"
DATABASE_URL=postgresql://username:password@localhost:5432/aeamcp
REDIS_URL=redis://localhost:6379
```

### 2. GitHub App Setup

1. Go to GitHub Developer Settings → GitHub Apps
2. Create new GitHub App with permissions:
   - Repository: Read
   - Metadata: Read
3. Generate private key and update `.env`
4. Install app on target repositories

### 3. Database Setup

```bash
# Install dependencies
npm install

# Run database migrations
npm run migrate

# Start development server
npm run dev
```

### 4. Test the API

```bash
# Health check
curl http://localhost:3001/health

# Start repository analysis
curl -X POST http://localhost:3001/api/v1/git/analyze \
  -H "Content-Type: application/json" \
  -H "x-user-id: test-user" \
  -d '{
    "url": "https://github.com/user/mcp-server.git",
    "auth": {
      "type": "app",
      "installationId": "12345"
    }
  }'

# Get analysis results
curl http://localhost:3001/api/v1/git/analysis/{repoId} \
  -H "x-user-id: test-user"
```

## API Reference

### POST /api/v1/git/analyze

Start repository analysis.

**Request:**
```json
{
  "url": "https://github.com/user/mcp-server.git",
  "branch": "main",
  "auth": {
    "type": "app",
    "installationId": "12345"
  }
}
```

**Response:**
```json
{
  "repoId": "uuid-v4",
  "status": "pending",
  "analysisUrl": "/api/v1/git/analysis/uuid-v4"
}
```

### GET /api/v1/git/analysis/:repoId

Get analysis status and results.

**Response:**
```json
{
  "repoId": "uuid-v4",
  "status": "completed",
  "analysis": {
    "mcpType": "server",
    "metadata": {
      "name": "weather-server",
      "tools": [...],
      "resources": [...],
      "prompts": [...]
    },
    "productionReadiness": {
      "overall": 85,
      "isProductionReady": true,
      "recommendations": [...]
    }
  },
  "formData": {
    "serverId": "weather-server",
    "name": "Weather MCP Server",
    "capabilities": {
      "supportsTools": true,
      "supportsResources": true,
      "supportsPrompts": false
    }
  }
}
```

## Development

### Project Structure

```
backend/
├── src/
│   ├── controllers/     # Request handlers
│   ├── services/        # Business logic
│   ├── parsers/         # Code analysis engines
│   ├── routes/          # API route definitions
│   ├── types/           # TypeScript type definitions
│   ├── utils/           # Utility functions
│   ├── app.ts           # Express app setup
│   └── index.ts         # Application entry point
├── migrations/          # Database schema migrations
├── tests/              # Test files
└── package.json
```

### Services Overview

**GitHubAuthService**: Manages GitHub Apps authentication, installation tokens, and repository access validation.

**GitCloneService**: Handles secure repository cloning with sandboxing, resource limits, and cleanup.

**TypeScriptMcpParser**: Analyzes TypeScript/JavaScript code to extract MCP patterns, tools, resources, and prompts.

**ReadinessScorer**: Evaluates production readiness across 6 categories:
- Documentation (20%)
- Error Handling (25%) 
- Security (25%)
- Testing (15%)
- Configuration (10%)
- Performance (5%)

**CacheService**: Redis-based caching for analysis results and GitHub API responses.

**DatabaseService**: PostgreSQL integration with connection pooling and transaction support.

### Running Tests

```bash
# Unit tests
npm test

# Integration tests
npm run test:integration

# Coverage report
npm run test:coverage
```

### Performance Optimization

- **Repository Caching**: Analysis results cached for 1 hour
- **Shallow Cloning**: `--depth=1` for faster downloads
- **Size Limits**: Repositories > 100MB rejected
- **Timeout Protection**: 5-minute analysis timeout
- **Rate Limiting**: 100 requests per 15 minutes per IP

### Security Features

- **Sandboxed Cloning**: Temporary directories with cleanup
- **Secret Detection**: Scans for hardcoded API keys/passwords
- **Input Validation**: All API inputs validated with Joi
- **Rate Limiting**: Protection against abuse
- **CORS Configuration**: Restricted to frontend domain

## Production Deployment

### Environment Variables

```bash
# Production settings
NODE_ENV=production
PORT=3001

# Security
JWT_SECRET=your-jwt-secret-min-32-chars
ENCRYPTION_KEY=your-32-char-encryption-key

# Database
DATABASE_URL=postgresql://user:pass@host:5432/db
DATABASE_SSL=true

# Redis
REDIS_URL=rediss://user:pass@host:6380

# GitHub
GITHUB_APP_ID=123456
GITHUB_APP_PRIVATE_KEY="..."
GITHUB_WEBHOOK_SECRET=webhook-secret

# Limits
MAX_REPO_SIZE_MB=100
ANALYSIS_TIMEOUT_MS=300000
RATE_LIMIT_MAX_REQUESTS=100
```

### Health Monitoring

The `/health` endpoint provides service status:

```json
{
  "status": "healthy",
  "services": {
    "database": "healthy",
    "cache": "healthy"
  },
  "cache": {
    "keys": 42,
    "hitRate": 0.85
  }
}
```

### Scaling Considerations

- **Horizontal Scaling**: Stateless design supports multiple instances
- **Database Pooling**: Connection pool configured for high concurrency
- **Background Jobs**: Analysis runs asynchronously to prevent blocking
- **Cache Warming**: Popular repositories pre-analyzed

## Future Enhancements

### Phase 2: Advanced Analysis
- Multi-language support (Python, Rust, Go, Java)
- Dependency vulnerability scanning
- Advanced security analysis
- Integration testing detection

### Phase 3: Cloud Deployment
- Automated container deployment
- Health monitoring and auto-scaling
- Fee collection integration (4.2069% fee sharing)
- Multi-cloud support (AWS, GCP, Azure)

## Contributing

1. Fork the repository
2. Create feature branch: `git checkout -b feature/amazing-feature`
3. Commit changes: `git commit -m 'Add amazing feature'`
4. Push to branch: `git push origin feature/amazing-feature`
5. Open Pull Request

### Code Style

- Use TypeScript strict mode
- Follow ESLint configuration
- Add tests for new features
- Update documentation

## License

MIT License - see LICENSE file for details.

## Support

- GitHub Issues: Report bugs and feature requests
- Documentation: Check `/docs` folder for detailed guides
- API Reference: OpenAPI spec available at `/api/v1/docs`