import type { Response } from 'express';

interface ApiResponse<T = unknown> {
  success: boolean;
  data?: T;
  message?: string;
  error?: {
    code: string;
    details?: unknown;
  };
  meta?: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}

export function sendSuccess<T>(
  res: Response,
  data: T,
  message = 'Success',
  statusCode = 200,
  meta?: ApiResponse['meta']
): void {
  const response: ApiResponse<T> = {
    success: true,
    data,
    message,
  };
  if (meta) response.meta = meta;
  res.status(statusCode).json(response);
}

export function sendCreated<T>(
  res: Response,
  data: T,
  message = 'Resource created successfully'
): void {
  sendSuccess(res, data, message, 201);
}

export function sendError(
  res: Response,
  message: string,
  statusCode = 400,
  code = 'BAD_REQUEST',
  details?: unknown
): void {
  const response: ApiResponse = {
    success: false,
    message,
    error: { code, details },
  };
  res.status(statusCode).json(response);
}

export function sendNotFound(res: Response, entity = 'Resource'): void {
  sendError(res, `${entity} not found`, 404, 'NOT_FOUND');
}

export function sendUnauthorized(res: Response, message = 'Unauthorized'): void {
  sendError(res, message, 401, 'UNAUTHORIZED');
}

export function sendForbidden(res: Response, message = 'Forbidden'): void {
  sendError(res, message, 403, 'FORBIDDEN');
}

export function sendConflict(res: Response, message: string): void {
  sendError(res, message, 409, 'CONFLICT');
}

export function sendValidationError(res: Response, details: unknown): void {
  sendError(res, 'Validation failed', 422, 'VALIDATION_ERROR', details);
}

export function sendPaginated<T>(
  res: Response,
  data: T[],
  total: number,
  page: number,
  limit: number,
  message = 'Success'
): void {
  sendSuccess(res, data, message, 200, {
    page,
    limit,
    total,
    totalPages: Math.ceil(total / limit),
  });
}
