import type { Request, Response, NextFunction } from 'express';
import { ZodSchema, ZodError } from 'zod';
import { sendValidationError } from '../utils/response.js';

/**
 * Zod validation middleware factory
 * Validates request body, query, or params against a Zod schema
 */
export function validate(schema: ZodSchema, source: 'body' | 'query' | 'params' = 'body') {
  return (req: Request, res: Response, next: NextFunction): void => {
    try {
      const data = schema.parse(req[source]);
      // Replace with parsed/coerced values
      (req as any)[source] = data;
      next();
    } catch (error) {
      if (error instanceof ZodError) {
        const details = error.errors.map((e) => ({
          field: e.path.join('.'),
          message: e.message,
        }));
        sendValidationError(res, details);
        return;
      }
      next(error);
    }
  };
}

/**
 * Validate route parameters (usually just :id)
 */
export function validateId(paramName = 'id') {
  return (req: Request, res: Response, next: NextFunction): void => {
    const id = req.params[paramName];
    if (!id || (typeof id === 'string' && id.trim() === '') || Array.isArray(id)) {
      sendValidationError(res, [{ field: paramName, message: `${paramName} is required and must be a string` }]);
      return;
    }
    next();
  };
}
