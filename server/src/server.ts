import app from './app.js';
import { env } from './config/env.js';
import logger from './utils/logger.js';
import prisma from './config/database.js';
import { startCronJobs } from './cron/scheduler.js';

const server = app.listen(env.PORT, async () => {
  logger.info(`🚀 TransitOps Backend running in ${env.NODE_ENV} mode on port ${env.PORT}`);
  
  try {
    // Database connection verification
    await prisma.$connect();
    logger.info('🔌 Connected to PostgreSQL database via Prisma ORM.');
  } catch (error) {
    logger.error('❌ Database connection failed', error);
  }

  // Start the background cron jobs
  startCronJobs();
});

// Process terminations & graceful shut-down handling
const gracefulShutdown = async (signal: string) => {
  logger.warn(`Received ${signal}. Shutting down server gracefully...`);
  
  server.close(async () => {
    logger.info('HTTP server closed.');
    await prisma.$disconnect();
    logger.info('Database connections closed.');
    process.exit(0);
  });

  // Timeout shutdown after 10s
  setTimeout(() => {
    logger.error('Could not close connections in time, forcefully shutting down');
    process.exit(1);
  }, 10000);
};

process.on('SIGTERM', () => gracefulShutdown('SIGTERM'));
process.on('SIGINT', () => gracefulShutdown('SIGINT'));
