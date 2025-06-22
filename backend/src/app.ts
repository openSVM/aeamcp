import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import rateLimit from 'express-rate-limit';
import { GitHubAuthService } from './services/github-auth.service';
import { GitCloneService } from './services/git-clone.service';
import { CacheService } from './services/cache.service';
import { DatabaseService } from './services/database.service';
import { AnalysisController } from './controllers/analysis.controller';
import { createAnalysisRoutes } from './routes/analysis.routes';
import { Logger } from './utils/logger';

export class App {
  private app: express.Application;
  private logger = Logger.getInstance();

  // Services
  private cache: CacheService;
  private db: DatabaseService;
  private githubAuth: GitHubAuthService;
  private gitClone: GitCloneService;
  private analysisController: AnalysisController;

  constructor() {
    this.app = express();
    this.initializeServices();
    this.initializeMiddleware();
    this.initializeRoutes();
    this.initializeErrorHandling();
  }

  private initializeServices(): void {
    // Initialize core services
    this.cache = new CacheService(process.env.REDIS_URL || 'redis://localhost:6379');
    this.db = new DatabaseService(process.env.DATABASE_URL || 'postgresql://localhost:5432/aeamcp');
    
    // Initialize GitHub authentication
    this.githubAuth = new GitHubAuthService(
      {
        appId: process.env.GITHUB_APP_ID || '',
        privateKey: process.env.GITHUB_APP_PRIVATE_KEY || '',
        webhookSecret: process.env.GITHUB_WEBHOOK_SECRET || '',
      },
      this.cache,
      this.db
    );

    // Initialize Git cloning service
    this.gitClone = new GitCloneService(
      this.githubAuth,
      this.cache,
      {
        tempDir: process.env.TEMP_DIR || '/tmp/git-analysis',
        maxRepoSizeMB: parseInt(process.env.MAX_REPO_SIZE_MB || '100'),
        timeoutMs: parseInt(process.env.ANALYSIS_TIMEOUT_MS || '300000'),
      }
    );

    // Initialize controllers
    this.analysisController = new AnalysisController(
      this.githubAuth,
      this.gitClone,
      this.cache,
      this.db
    );
  }

  private initializeMiddleware(): void {
    // Security middleware
    this.app.use(helmet({
      contentSecurityPolicy: {
        directives: {
          defaultSrc: ["'self'"],
          styleSrc: ["'self'", "'unsafe-inline'"],
          scriptSrc: ["'self'"],
          imgSrc: ["'self'", "data:", "https:"],
        },
      },
    }));

    // CORS configuration
    this.app.use(cors({
      origin: process.env.FRONTEND_URL || 'http://localhost:3000',
      credentials: true,
      methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
      allowedHeaders: ['Content-Type', 'Authorization', 'x-user-id'],
    }));

    // Rate limiting
    const limiter = rateLimit({
      windowMs: parseInt(process.env.RATE_LIMIT_WINDOW_MS || '900000'), // 15 minutes
      max: parseInt(process.env.RATE_LIMIT_MAX_REQUESTS || '100'), // limit each IP to 100 requests per windowMs
      message: 'Too many requests from this IP, please try again later.',
      standardHeaders: true,
      legacyHeaders: false,
    });
    this.app.use(limiter);

    // Body parsing
    this.app.use(express.json({ limit: '10mb' }));
    this.app.use(express.urlencoded({ extended: true, limit: '10mb' }));

    // Request logging
    this.app.use((req, res, next) => {
      this.logger.info(`${req.method} ${req.path}`, {
        ip: req.ip,
        userAgent: req.get('User-Agent'),
        userId: req.headers['x-user-id'],
      });
      next();
    });

    // User ID middleware (simplified - in production you'd validate JWT tokens)
    this.app.use((req, res, next) => {
      // For development, use a default user ID if not provided
      if (!req.headers['x-user-id']) {
        req.headers['x-user-id'] = 'dev-user-' + Math.random().toString(36).substr(2, 9);
      }
      next();
    });
  }

  private initializeRoutes(): void {
    // Health check endpoint
    this.app.get('/health', async (req, res) => {
      try {
        const dbHealth = await this.db.healthCheck();
        const cacheStats = await this.cache.getStats();
        
        res.json({
          status: 'healthy',
          timestamp: new Date().toISOString(),
          services: {
            database: dbHealth ? 'healthy' : 'unhealthy',
            cache: cacheStats.keys >= 0 ? 'healthy' : 'unhealthy',
          },
          cache: {
            keys: cacheStats.keys,
            hitRate: cacheStats.hits / (cacheStats.hits + cacheStats.misses) || 0,
          },
        });
      } catch (error) {
        res.status(503).json({
          status: 'unhealthy',
          error: error instanceof Error ? error.message : 'Unknown error',
        });
      }
    });

    // API version info
    this.app.get('/api/v1', (req, res) => {
      res.json({
        name: 'AEAMCP Git Registration API',
        version: '1.0.0',
        description: 'Intelligent Git-based MCP server registration system',
        endpoints: {
          analysis: '/api/v1/git',
          health: '/health',
        },
      });
    });

    // Analysis routes
    this.app.use('/api/v1/git', createAnalysisRoutes(this.analysisController));

    // GitHub webhook endpoint (for future implementation)
    this.app.post('/webhooks/github', (req, res) => {
      // TODO: Implement GitHub webhook handling
      res.status(200).json({ message: 'Webhook received' });
    });

    // Catch-all for undefined routes
    this.app.use('*', (req, res) => {
      res.status(404).json({
        error: 'Endpoint not found',
        code: 'NOT_FOUND',
        path: req.originalUrl,
      });
    });
  }

  private initializeErrorHandling(): void {
    // Global error handler
    this.app.use((err: any, req: any, res: any, next: any) => {
      this.logger.error('Unhandled error:', {
        error: err.message,
        stack: err.stack,
        path: req.path,
        method: req.method,
        ip: req.ip,
      });

      res.status(err.status || 500).json({
        error: process.env.NODE_ENV === 'production' 
          ? 'Internal server error' 
          : err.message,
        code: err.code || 'INTERNAL_ERROR',
        ...(process.env.NODE_ENV !== 'production' && { stack: err.stack }),
      });
    });

    // Graceful shutdown handling
    process.on('SIGTERM', () => {
      this.logger.info('SIGTERM received, shutting down gracefully');
      this.shutdown();
    });

    process.on('SIGINT', () => {
      this.logger.info('SIGINT received, shutting down gracefully');
      this.shutdown();
    });

    // Unhandled promise rejections
    process.on('unhandledRejection', (reason, promise) => {
      this.logger.error('Unhandled promise rejection:', {
        reason,
        promise,
      });
    });

    // Uncaught exceptions
    process.on('uncaughtException', (error) => {
      this.logger.error('Uncaught exception:', error);
      process.exit(1);
    });
  }

  public async start(port: number = 3001): Promise<void> {
    try {
      // Ensure services are ready
      await this.healthCheck();

      this.app.listen(port, () => {
        this.logger.info(`Server started on port ${port}`, {
          environment: process.env.NODE_ENV || 'development',
          port,
        });
      });
    } catch (error) {
      this.logger.error('Failed to start server:', error);
      process.exit(1);
    }
  }

  private async healthCheck(): Promise<void> {
    try {
      // Check database connection
      const dbHealthy = await this.db.healthCheck();
      if (!dbHealthy) {
        throw new Error('Database health check failed');
      }

      // Check cache connection
      const cacheStats = await this.cache.getStats();
      if (cacheStats.keys < 0) {
        throw new Error('Cache health check failed');
      }

      this.logger.info('All services healthy');
    } catch (error) {
      this.logger.error('Health check failed:', error);
      throw error;
    }
  }

  private async shutdown(): Promise<void> {
    try {
      this.logger.info('Shutting down services...');
      
      // Close database connections
      await this.db.close();
      
      // Close cache connections
      await this.cache.close();
      
      this.logger.info('Shutdown complete');
      process.exit(0);
    } catch (error) {
      this.logger.error('Error during shutdown:', error);
      process.exit(1);
    }
  }

  public getExpressApp(): express.Application {
    return this.app;
  }
}