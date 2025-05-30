# 🚀 Deployment and Testing Guide

Complete guide for deploying and testing the AEAMCP Git Registration Backend system.

## 📋 Prerequisites

### System Requirements
- **Node.js 18+** - Runtime environment
- **PostgreSQL 12+** - Database
- **Redis 6+** - Caching layer
- **Git** - Repository operations
- **Docker & Docker Compose** (optional but recommended)
- **curl** - API testing
- **jq** - JSON processing (optional but helpful)

### GitHub Requirements
- GitHub account with repository access
- GitHub App created (for private repository support)

## 🐳 Option 1: Docker Deployment (Recommended)

### Quick Start with Docker

```bash
# 1. Navigate to backend directory
cd backend

# 2. Create environment file
cp .env.example .env

# 3. Edit environment variables (see configuration section below)
nano .env

# 4. Start all services with Docker Compose
npm run docker:up

# 5. Wait for services to be healthy (30-60 seconds)
npm run docker:logs

# 6. Test the deployment
npm run test:health
```

### Docker Commands

```bash
# Start services in background
npm run docker:up

# Stop services
npm run docker:down

# View logs
npm run docker:logs

# Rebuild containers
npm run docker:build

# Start with fresh database
npm run docker:down && docker volume rm backend_postgres_data backend_redis_data && npm run docker:up
```

## 💻 Option 2: Local Development Setup

### 1. Install Dependencies

```bash
# Navigate to backend directory
cd backend

# Run setup script (checks dependencies and creates directories)
chmod +x scripts/setup.sh
npm run setup

# Alternative manual installation
npm install
```

### 2. Database Setup

#### PostgreSQL Setup
```bash
# Install PostgreSQL (Ubuntu/Debian)
sudo apt-get install postgresql postgresql-contrib

# Create database and user
sudo -u postgres psql
```

```sql
CREATE DATABASE aeamcp_git_registration;
CREATE USER aeamcp_user WITH PASSWORD 'your_password';
GRANT ALL PRIVILEGES ON DATABASE aeamcp_git_registration TO aeamcp_user;
\q
```

#### Redis Setup
```bash
# Install Redis (Ubuntu/Debian)
sudo apt-get install redis-server

# Start Redis
sudo systemctl start redis-server
sudo systemctl enable redis-server

# Test Redis
redis-cli ping
```

### 3. Environment Configuration

```bash
# Copy environment template
cp .env.example .env

# Edit with your actual values
nano .env
```

Required environment variables:
```bash
# GitHub App Configuration (required for private repos)
GITHUB_APP_ID=123456
GITHUB_APP_PRIVATE_KEY="-----BEGIN RSA PRIVATE KEY-----\n...\n-----END RSA PRIVATE KEY-----"
GITHUB_WEBHOOK_SECRET=your_webhook_secret

# Database
DATABASE_URL=postgresql://aeamcp_user:your_password@localhost:5432/aeamcp_git_registration

# Redis
REDIS_URL=redis://localhost:6379

# Security
JWT_SECRET=your-secure-jwt-secret-min-32-characters
ENCRYPTION_KEY=your-32-character-encryption-key

# Server
NODE_ENV=development
PORT=3001
```

### 4. Build and Start

```bash
# Build TypeScript
npm run build

# Start development server
npm run dev

# Or start production server
npm start
```

## 🔧 GitHub App Configuration

### Creating a GitHub App

1. Go to GitHub Settings → Developer settings → GitHub Apps
2. Click "New GitHub App"
3. Fill in the details:
   - **App name**: `AEAMCP Git Registration`
   - **Homepage URL**: Your application URL
   - **Webhook URL**: `https://yourdomain.com/webhooks/github`
   - **Webhook secret**: Generate a secure secret

4. Set permissions:
   - **Repository permissions**:
     - Contents: Read
     - Metadata: Read
   - **Account permissions**: None

5. Generate private key and download it
6. Note the App ID
7. Install the app on repositories you want to analyze

### Environment Configuration

```bash
# Extract App ID from the app settings page
GITHUB_APP_ID=123456

# Convert private key to environment format
GITHUB_APP_PRIVATE_KEY="$(cat private-key.pem | tr '\n' '\\n')"

# Set webhook secret
GITHUB_WEBHOOK_SECRET=your_webhook_secret_here
```

## 🧪 Testing the Deployment

### Automated Testing

```bash
# Run all API tests
npm run test:api

# Test individual endpoints
npm run test:health
./scripts/test-api.sh analysis
./scripts/test-api.sh error
```

### Manual Testing

#### 1. Health Check
```bash
curl http://localhost:3001/health
```

Expected response:
```json
{
  "status": "healthy",
  "timestamp": "2025-05-30T03:20:00.000Z",
  "services": {
    "database": "healthy",
    "cache": "healthy"
  },
  "cache": {
    "keys": 0,
    "hitRate": 0
  }
}
```

#### 2. API Info
```bash
curl http://localhost:3001/api/v1
```

#### 3. Repository Analysis
```bash
# Test with public repository
curl -X POST http://localhost:3001/api/v1/git/analyze \
  -H "Content-Type: application/json" \
  -H "x-user-id: test-user" \
  -d '{
    "url": "https://github.com/modelcontextprotocol/servers.git",
    "branch": "main"
  }'
```

Expected response:
```json
{
  "repoId": "uuid-here",
  "status": "pending",
  "message": "Analysis started. Use WebSocket or polling to get updates.",
  "analysisUrl": "/api/v1/git/analysis/uuid-here"
}
```

#### 4. Check Analysis Status
```bash
# Replace {repoId} with actual ID from step 3
curl http://localhost:3001/api/v1/git/analysis/{repoId} \
  -H "x-user-id: test-user"
```

#### 5. List Analyses
```bash
curl http://localhost:3001/api/v1/git/analyses \
  -H "x-user-id: test-user"
```

## 🔍 Monitoring and Debugging

### Log Files

```bash
# View application logs
tail -f logs/combined.log

# View error logs only
tail -f logs/error.log

# Docker logs
docker-compose logs -f backend
```

### Health Monitoring

```bash
# Continuous health monitoring
watch -n 5 'curl -s http://localhost:3001/health | jq .'

# Database connection test
curl -s http://localhost:3001/health | jq '.services.database'

# Cache performance
curl -s http://localhost:3001/health | jq '.cache'
```

### Performance Testing

```bash
# Load testing with curl (basic)
for i in {1..10}; do
  curl -s http://localhost:3001/health > /dev/null &
done
wait

# Monitor resource usage
docker stats aeamcp-backend aeamcp-postgres aeamcp-redis
```

## 🚨 Troubleshooting

### Common Issues

#### 1. "Cannot connect to database"
```bash
# Check PostgreSQL status
sudo systemctl status postgresql

# Check connection
psql -h localhost -U aeamcp_user -d aeamcp_git_registration

# Verify environment variables
echo $DATABASE_URL
```

#### 2. "Redis connection failed"
```bash
# Check Redis status
sudo systemctl status redis-server

# Test Redis connection
redis-cli ping

# Check Redis URL
echo $REDIS_URL
```

#### 3. "GitHub App authentication failed"
```bash
# Verify GitHub App configuration
echo $GITHUB_APP_ID
echo $GITHUB_APP_PRIVATE_KEY | head -c 50

# Check app installation
curl -H "Authorization: Bearer $(generate_jwt_token)" \
  https://api.github.com/app/installations
```

#### 4. "Repository cloning failed"
```bash
# Check disk space
df -h /tmp/git-analysis

# Verify git installation
git --version

# Test git clone manually
git clone --depth=1 https://github.com/user/repo.git /tmp/test-clone
```

#### 5. "Analysis timeout"
```bash
# Check analysis timeout setting
echo $ANALYSIS_TIMEOUT_MS

# Monitor running processes
ps aux | grep node

# Check temporary directory
ls -la /tmp/git-analysis/
```

### Debug Mode

```bash
# Start with debug logging
LOG_LEVEL=debug npm run dev

# Enable request tracing
DEBUG=* npm run dev

# Monitor in real-time
tail -f logs/combined.log | jq '.'
```

## 📊 Performance Optimization

### Database Optimization

```sql
-- Check database performance
SELECT schemaname, tablename, n_tup_ins, n_tup_upd, n_tup_del 
FROM pg_stat_user_tables;

-- Analyze table performance
ANALYZE repository_analyses;
ANALYZE github_installations;
```

### Cache Optimization

```bash
# Monitor cache hit rate
redis-cli info stats | grep hit

# Check cache memory usage
redis-cli info memory

# Monitor key distribution
redis-cli --scan --pattern "repo:*" | wc -l
```

### Resource Monitoring

```bash
# Monitor API response times
curl -w "@curl-format.txt" -s http://localhost:3001/health

# Check memory usage
ps aux | grep node | awk '{print $4, $11}'

# Monitor disk usage
du -sh /tmp/git-analysis/* | sort -h
```

## 🔒 Security Considerations

### Environment Security

```bash
# Secure file permissions
chmod 600 .env
chmod 700 logs/

# Verify no secrets in logs
grep -r "password\|secret\|key" logs/ || echo "No secrets found"

# Check for exposed endpoints
nmap -p 3001 localhost
```

### Rate Limiting Test

```bash
# Test rate limiting
for i in {1..150}; do
  curl -s -w "%{http_code}\n" http://localhost:3001/health
done | grep 429 | wc -l
```

## 🚀 Production Deployment

### Environment Setup

```bash
# Production environment variables
NODE_ENV=production
PORT=3001
LOG_LEVEL=info

# Secure secrets
JWT_SECRET=$(openssl rand -hex 32)
ENCRYPTION_KEY=$(openssl rand -hex 16)

# Database with SSL
DATABASE_URL=postgresql://user:pass@host:5432/db?sslmode=require

# Redis with authentication
REDIS_URL=rediss://user:pass@host:6380
```

### Process Management

```bash
# Using PM2 for process management
npm install -g pm2

# Start with PM2
pm2 start dist/index.js --name aeamcp-backend

# Monitor
pm2 status
pm2 logs aeamcp-backend

# Auto-restart on reboot
pm2 startup
pm2 save
```

### Reverse Proxy (Nginx)

```nginx
server {
    listen 80;
    server_name api.yourdomain.com;

    location / {
        proxy_pass http://localhost:3001;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
        proxy_cache_bypass $http_upgrade;
    }
}
```

## ✅ Deployment Checklist

- [ ] Node.js 18+ installed
- [ ] PostgreSQL database created and accessible
- [ ] Redis server running
- [ ] Environment variables configured
- [ ] GitHub App created and installed
- [ ] Dependencies installed (`npm install`)
- [ ] Project built successfully (`npm run build`)
- [ ] Health check passes (`npm run test:health`)
- [ ] API tests pass (`npm run test:api`)
- [ ] Repository analysis works with public repo
- [ ] Logs directory created and writable
- [ ] Temporary directory accessible
- [ ] Rate limiting functioning
- [ ] Error handling working correctly
- [ ] Production secrets configured (if deploying to production)
- [ ] Process manager configured (PM2 for production)
- [ ] Reverse proxy configured (Nginx for production)
- [ ] SSL certificates installed (for production)
- [ ] Monitoring and alerting set up
- [ ] Backup procedures established

## 🎯 Next Steps

1. **Frontend Integration**: Connect the React frontend to these backend APIs
2. **Testing**: Add comprehensive unit and integration tests
3. **Monitoring**: Set up application monitoring (Prometheus, Grafana)
4. **CI/CD**: Implement automated deployment pipeline
5. **Documentation**: API documentation with OpenAPI/Swagger
6. **Phase 2**: Implement multi-language support and advanced features

---

## 🆘 Support

If you encounter issues:

1. Check the troubleshooting section above
2. Review logs: `tail -f logs/combined.log`
3. Verify environment configuration
4. Test individual components (database, Redis, GitHub App)
5. Run the automated test suite: `npm run test:api`

The backend is now ready for development, testing, and production deployment! 🚀