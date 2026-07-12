import express from 'express';
import helmet from 'helmet';
import cors from 'cors';
import morgan from 'morgan';
import cookieParser from 'cookie-parser';
import path from 'path';
import { corsOptions } from './config/cors.js';
import { errorHandler } from './middlewares/errorHandler.js';
import routes from './routes/index.js';
import logger from './utils/logger.js';
import swaggerUi from 'swagger-ui-express';
import fs from 'fs';

const app = express();

// Security middlewares
app.use(helmet());
app.use(cors(corsOptions));

// Logging middleware
const morganFormat = process.env.NODE_ENV === 'production' ? 'combined' : 'dev';
app.use(
  morgan(morganFormat, {
    stream: {
      write: (message) => logger.info(message.trim()),
    },
  })
);

// Body parsers
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

// Serve uploads static folder
const uploadsDir = path.resolve(__dirname, '../uploads');
if (!fs.existsSync(uploadsDir)) {
  fs.mkdirSync(uploadsDir, { recursive: true });
}
app.use('/uploads', express.static(uploadsDir));

// Swagger API Documentation (if swagger.json exists)
const swaggerPath = path.resolve(__dirname, '../swagger.json');
if (fs.existsSync(swaggerPath)) {
  try {
    const swaggerDocument = JSON.parse(fs.readFileSync(swaggerPath, 'utf8'));
    app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument));
    logger.info('Swagger API docs registered at /api-docs');
  } catch (err) {
    logger.error('Failed to register Swagger UI', err);
  }
}

// API Routes
app.use('/api', routes);

// Global Error Handler
app.use(errorHandler);

export default app;
export { app };
