import dotenv from 'dotenv';
import { App } from './app';
import { Logger } from './utils/logger';

// Load environment variables
dotenv.config();

const logger = Logger.getInstance();

async function main(): Promise<void> {
  try {
    // Validate required environment variables
    const requiredEnvVars = [
      'GITHUB_APP_ID',
      'GITHUB_APP_PRIVATE_KEY',
      'DATABASE_URL',
      'REDIS_URL',
    ];

    const missingEnvVars = requiredEnvVars.filter(envVar => !process.env[envVar]);
    
    if (missingEnvVars.length > 0) {
      logger.error('Missing required environment variables:', { missingEnvVars });
      process.exit(1);
    }

    // Create and start the application
    const app = new App();
    const port = parseInt(process.env.PORT || '3001');
    
    await app.start(port);
  } catch (error) {
    logger.error('Failed to start application:', error);
    process.exit(1);
  }
}

// Handle cleanup on exit
process.on('SIGTERM', () => {
  logger.info('SIGTERM received');
  process.exit(0);
});

process.on('SIGINT', () => {
  logger.info('SIGINT received');
  process.exit(0);
});

// Start the application
main().catch((error) => {
  logger.error('Unhandled error in main:', error);
  process.exit(1);
});