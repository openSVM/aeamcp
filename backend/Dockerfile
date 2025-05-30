# Use Node.js 18 Alpine for smaller image size
FROM node:18-alpine

# Install system dependencies for git operations and nodegit
RUN apk add --no-cache \
    git \
    openssh-client \
    python3 \
    make \
    g++ \
    libgit2-dev \
    curl

# Create app directory
WORKDIR /app

# Copy package files
COPY package*.json ./
COPY tsconfig.json ./

# Install dependencies
RUN npm ci --only=production && npm cache clean --force

# Create necessary directories
RUN mkdir -p logs /tmp/git-analysis

# Copy source code
COPY src/ ./src/
COPY migrations/ ./migrations/

# Build the application
RUN npm run build

# Create non-root user for security
RUN addgroup -g 1001 -S nodejs && \
    adduser -S aeamcp -u 1001 -G nodejs

# Change ownership of app directory
RUN chown -R aeamcp:nodejs /app /tmp/git-analysis

# Switch to non-root user
USER aeamcp

# Expose port
EXPOSE 3001

# Health check
HEALTHCHECK --interval=30s --timeout=10s --start-period=40s --retries=3 \
    CMD curl -f http://localhost:3001/health || exit 1

# Start the application
CMD ["npm", "start"]