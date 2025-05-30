# Phase 1 Execution Plan - Git Registration System

## Execution Order & Subtasks

### Issue #1: GitHub Apps Authentication Setup (5 points)
**Assignee**: 👨‍💻 coder **Tester**: 🧪 qa **Priority**: 🎯 Critical

#### Subtask 1.1: GitHub App Configuration
- [ ] Create GitHub App in GitHub Developer Settings
- [ ] Configure permissions: `repository:read`, `metadata:read`
- [ ] Generate private key and app ID
- [ ] Set webhook URL for installation events
- [ ] Configure OAuth callback URLs

#### Subtask 1.2: Backend Auth Service
- [ ] Create `services/github-auth.service.ts`
- [ ] Implement GitHub Apps JWT token generation
- [ ] Create installation token exchange endpoint
- [ ] Add token storage with encryption (AES-256)
- [ ] Implement rate limiting for GitHub API calls

#### Subtask 1.3: Database Schema
- [ ] Create `github_installations` table
- [ ] Create `github_tokens` table with encryption
- [ ] Add user-installation relationship mapping
- [ ] Create indexes for performance

#### Subtask 1.4: API Endpoints
```typescript
POST /api/v1/auth/github/install    // Handle GitHub App installation
GET  /api/v1/auth/github/callback   // OAuth callback
POST /api/v1/auth/github/refresh    // Refresh installation token
GET  /api/v1/auth/github/repos      // List accessible repositories
```

#### Subtask 1.5: Frontend Integration
- [ ] Create GitHub Apps installation button
- [ ] Handle OAuth flow in React
- [ ] Store user installation state
- [ ] Display connected repositories

---

### Issue #2: Repository Cloning Service (6 points)
**Assignee**: 👨‍💻 coder **Tester**: 🧪 qa **Priority**: 🎯 Critical

#### Subtask 2.1: Git Service Foundation
- [ ] Create `services/git-clone.service.ts`
- [ ] Install and configure libgit2 (nodegit)
- [ ] Implement URL validation for Git repositories
- [ ] Add support for different Git providers (GitHub initially)

#### Subtask 2.2: Secure Cloning
- [ ] Create sandboxed temp directory structure
- [ ] Implement shallow cloning (depth=1)
- [ ] Add authentication for private repositories
- [ ] Set resource limits (CPU, memory, disk, time)

#### Subtask 2.3: Repository Handle System
```typescript
interface RepoHandle {
  id: string;
  url: string;
  branch: string;
  commitHash: string;
  localPath: string;
  metadata: RepoMetadata;
}
```

#### Subtask 2.4: Cleanup and Security
- [ ] Automatic cleanup after 1 hour TTL
- [ ] Docker containerization for isolation
- [ ] File system permissions and chroot jail
- [ ] Virus scanning integration (optional)

#### Subtask 2.5: Error Handling
- [ ] Timeout handling (5-minute max)
- [ ] Large repository handling (>100MB)
- [ ] Network failure recovery
- [ ] Invalid repository graceful failure

---

### Issue #4: Basic TypeScript/JavaScript Parser (8 points)
**Assignee**: 👨‍💻 coder **Tester**: 🧪 qa **Priority**: 🎯 Critical

#### Subtask 4.1: Parser Foundation
- [ ] Create `parsers/typescript-parser.ts`
- [ ] Install TypeScript compiler API
- [ ] Create AST analysis utilities
- [ ] Implement file discovery (*.ts, *.js, *.tsx, *.jsx)

#### Subtask 4.2: Package.json Analysis
- [ ] Parse package.json for MCP dependencies
- [ ] Extract project metadata (name, version, description)
- [ ] Identify MCP SDK versions
- [ ] Check for required scripts (start, build, test)

#### Subtask 4.3: MCP Pattern Detection
```typescript
// Patterns to detect:
// import { Server } from '@modelcontextprotocol/sdk/server/index.js'
// server.addTool(), server.addResource(), server.addPrompt()
// new Server({ name, version })
```

#### Subtask 4.4: Tool/Resource Extraction
- [ ] Parse `server.addTool()` calls
- [ ] Extract tool names and descriptions
- [ ] Parse input schemas from tool definitions
- [ ] Extract JSDoc/TSDoc comments
- [ ] Handle both sync and async tool handlers

#### Subtask 4.5: Result Structuring
```typescript
interface ParseResult {
  language: 'typescript' | 'javascript';
  mcpType: 'server' | 'agent' | 'both' | 'unknown';
  metadata: McpMetadata;
  tools: McpTool[];
  resources: McpResource[];
  prompts: McpPrompt[];
}
```

---

### Issue #3: Redis Caching Layer (4 points)
**Assignee**: 👨‍💻 coder **Tester**: 🧪 qa **Priority**: 🎯 High

#### Subtask 3.1: Redis Setup
- [ ] Install Redis client library (ioredis)
- [ ] Configure Redis connection with clustering
- [ ] Set up connection pooling
- [ ] Add health check for Redis connectivity

#### Subtask 3.2: Cache Service
- [ ] Create `services/cache.service.ts`
- [ ] Implement cache key strategy: `repo:${url}:${commitHash}`
- [ ] Set TTL to 1 hour for analysis results
- [ ] Add cache warming for popular repositories

#### Subtask 3.3: Cache Integration
- [ ] Cache repository analysis results
- [ ] Cache repository metadata
- [ ] Cache form mapping results
- [ ] Implement cache invalidation strategies

#### Subtask 3.4: Monitoring
- [ ] Add cache hit/miss rate metrics
- [ ] Monitor cache memory usage
- [ ] Set up alerts for cache failures
- [ ] Performance logging for cache operations

---

### Issue #5: Simple Production Readiness Scoring (6 points)
**Assignee**: 👨‍💻 coder **Tester**: 🧪 qa **Priority**: 🎯 High

#### Subtask 5.1: Scoring Engine Foundation
- [ ] Create `services/readiness-scorer.service.ts`
- [ ] Define scoring categories and weights
- [ ] Implement base scoring algorithm
- [ ] Create recommendation generation system

#### Subtask 5.2: Documentation Scoring (30%)
- [ ] Check README.md existence and quality
- [ ] Analyze README sections (installation, usage, API)
- [ ] Count and quality of code comments
- [ ] Check for CHANGELOG, LICENSE files

#### Subtask 5.3: Error Handling Scoring (25%)
- [ ] Detect try-catch blocks in code
- [ ] Check for error response patterns
- [ ] Validate error logging implementation
- [ ] Assess graceful degradation patterns

#### Subtask 5.4: Security Scoring (25%)
- [ ] Scan for hardcoded secrets/API keys
- [ ] Check for input validation patterns
- [ ] Validate environment variable usage
- [ ] Basic dependency vulnerability check

#### Subtask 5.5: Testing Scoring (20%)
- [ ] Detect test files and frameworks
- [ ] Check for test scripts in package.json
- [ ] Basic test coverage analysis (if available)
- [ ] CI/CD configuration detection

---

### Issue #6: Basic REST API Endpoints (5 points)
**Assignee**: 👨‍💻 coder **Tester**: 🧪 qa **Priority**: 🎯 High

#### Subtask 6.1: API Foundation
- [ ] Set up Express.js/Fastify server
- [ ] Configure CORS and security headers
- [ ] Add request/response validation middleware
- [ ] Implement rate limiting per user/IP

#### Subtask 6.2: Analysis Endpoints
```typescript
POST /api/v1/git/analyze
{
  "url": "https://github.com/user/mcp-server",
  "branch": "main",
  "auth": { "type": "app", "installationId": "12345" }
}

GET /api/v1/git/analysis/{repoId}
GET /api/v1/git/analyses?userId={userId}&page=1&limit=10
DELETE /api/v1/git/analysis/{repoId}
```

#### Subtask 6.3: Request Processing
- [ ] Async job queue for analysis (Bull/Agenda)
- [ ] Progress tracking for long-running analysis
- [ ] Result caching and retrieval
- [ ] Error handling and user feedback

#### Subtask 6.4: Response Formatting
- [ ] Consistent API response structure
- [ ] Error response standardization
- [ ] Pagination for list endpoints
- [ ] API versioning strategy

#### Subtask 6.5: API Documentation
- [ ] OpenAPI/Swagger specification
- [ ] Interactive API documentation
- [ ] Example requests and responses
- [ ] Authentication documentation

---

## Implementation Priority Order

### Week 1: Foundation
1. **Subtask 1.1-1.2**: GitHub App setup and auth service
2. **Subtask 3.1-3.2**: Redis caching foundation  
3. **Subtask 2.1-2.2**: Basic git cloning service

### Week 2: Core Analysis
1. **Subtask 4.1-4.3**: TypeScript parser foundation
2. **Subtask 5.1-5.2**: Basic scoring engine
3. **Subtask 6.1-6.2**: API endpoints foundation

### Week 3: Integration & Polish
1. **Subtask 4.4-4.5**: Complete TS parser
2. **Subtask 5.3-5.5**: Complete scoring system
3. **Subtask 6.3-6.5**: Complete API system
4. **Integration testing and bug fixes**

## Development Setup Requirements

### Backend Dependencies
```json
{
  "dependencies": {
    "@octokit/auth-app": "^6.0.0",
    "@octokit/rest": "^20.0.0",
    "nodegit": "^0.27.0",
    "ioredis": "^5.3.0",
    "typescript": "^5.0.0",
    "express": "^4.18.0",
    "bull": "^4.12.0"
  }
}
```

### Environment Variables
```env
GITHUB_APP_ID=123456
GITHUB_APP_PRIVATE_KEY="-----BEGIN RSA PRIVATE KEY-----"
REDIS_URL=redis://localhost:6379
DATABASE_URL=postgresql://localhost:5432/aeamcp
NODE_ENV=development
```

### Database Tables
```sql
CREATE TABLE github_installations (
  id SERIAL PRIMARY KEY,
  installation_id BIGINT UNIQUE NOT NULL,
  account_login VARCHAR(255) NOT NULL,
  account_type VARCHAR(50) NOT NULL,
  created_at TIMESTAMP DEFAULT NOW()
);

CREATE TABLE repository_analyses (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  repo_url VARCHAR(500) NOT NULL,
  commit_hash VARCHAR(40) NOT NULL,
  analysis_result JSONB NOT NULL,
  created_at TIMESTAMP DEFAULT NOW(),
  expires_at TIMESTAMP DEFAULT NOW() + INTERVAL '1 hour'
);
```

## Ready for Implementation

The subtasks are now ready for development. Each subtask has clear deliverables and can be implemented incrementally. 

**Next Steps:**
1. Set up development environment
2. Start with GitHub Apps authentication (Subtask 1.1)
3. Implement each subtask following the priority order
4. Test each component thoroughly before integration

Would you like me to switch to code mode to begin implementing these subtasks?