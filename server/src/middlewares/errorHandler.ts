import type { Request, Response, NextFunction } from 'express';
import { sendError } from '../utils/response.js';
import logger from '../utils/logger.js';

export class AppError extends Error {
  public statusCode: number;
  public code: string;
  public isOperational: boolean;

  constructor(
    message: string,
    statusCode = 500,
    code = 'INTERNAL_ERROR',
    isOperational = true
  ) {
    super(message);
    this.statusCode = statusCode;
    this.code = code;
    this.isOperational = isOperational;
    Object.setPrototypeOf(this, AppError.prototype);
  }
}

export function errorHandler(
  err: Error | AppError,
  _req: Request,
  res: Response,
  _next: NextFunction
): void {
  if (err instanceof AppError) {
    sendError(res, err.message, err.statusCode, err.code);
    return;
  }

  // Prisma known request errors
  if ((err as any).code === 'P2002') {
    const target = (err as any).meta?.target;
    sendError(
      res,
      `Duplicate value for field: ${Array.isArray(target) ? target.join(', ') : target}`,
      409,
      'CONFLICT'
    );
    return;
  }

  if ((err as any).code === 'P2025') {
    sendError(res, 'Record not found', 404, 'NOT_FOUND');
    return;
  }

  // Unexpected errors
  logger.error('Unhandled error:', err);
  sendError(
    res,
    process.env.NODE_ENV === 'production'
      ? 'Internal server error'
      : err.message,
    500,
    'INTERNAL_ERROR'
  );
}

/**
 * Async handler wrapper — catches async errors and forwards to errorHandler
 */
export function asyncHandler(
  fn: (req: Request, res: Response, next: NextFunction) => Promise<any>
) {
  return (req: Request, res: Response, next: NextFunction) => {
    Promise.resolve(fn(req, res, next)).catch(next);
  };
}
