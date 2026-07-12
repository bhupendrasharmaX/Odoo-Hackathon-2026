import type { Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { env } from '../config/env.js';
import type { AuthPayload, AuthRequest } from '../types/index.js';
import { sendUnauthorized } from '../utils/response.js';

export function authenticate(req: AuthRequest, res: Response, next: NextFunction): void {
  try {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      sendUnauthorized(res, 'Access token is required');
      return;
    }

    const token = authHeader.split(' ')[1];

    if (!token) {
      sendUnauthorized(res, 'Access token is missing');
      return;
    }

    const decoded = jwt.verify(token, env.JWT_SECRET) as AuthPayload;

    req.user = {
      userId: decoded.userId,
      roleId: decoded.roleId,
      roleName: decoded.roleName,
      permissions: decoded.permissions,
    };

    next();
  } catch (error) {
    if (error instanceof jwt.TokenExpiredError) {
      sendUnauthorized(res, 'Access token has expired');
      return;
    }
    if (error instanceof jwt.JsonWebTokenError) {
      sendUnauthorized(res, 'Invalid access token');
      return;
    }
    sendUnauthorized(res, 'Authentication failed');
  }
}

/**
 * Optional authentication — sets req.user if token present, but doesn't block
 */
export function optionalAuth(req: AuthRequest, _res: Response, next: NextFunction): void {
  try {
    const authHeader = req.headers.authorization;
    if (authHeader?.startsWith('Bearer ')) {
      const token = authHeader.split(' ')[1];
      if (token) {
        const decoded = jwt.verify(token, env.JWT_SECRET) as AuthPayload;
        req.user = decoded;
      }
    }
  } catch {
    // Silently ignore — user is not authenticated
  }
  next();
}
