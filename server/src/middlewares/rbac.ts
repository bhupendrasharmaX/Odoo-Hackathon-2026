import type { Response, NextFunction } from 'express';
import type { AuthRequest } from '../types/index.js';
import type { Permission } from '../constants/roles.js';
import { sendForbidden, sendUnauthorized } from '../utils/response.js';

/**
 * RBAC middleware — checks if the authenticated user has ALL required permissions
 */
export function requirePermissions(...requiredPermissions: Permission[]) {
  return (req: AuthRequest, res: Response, next: NextFunction): void => {
    if (!req.user) {
      sendUnauthorized(res, 'Authentication required');
      return;
    }

    const userPermissions = req.user.permissions || [];

    const hasAll = requiredPermissions.every((perm) =>
      userPermissions.includes(perm)
    );

    if (!hasAll) {
      sendForbidden(
        res,
        `Insufficient permissions. Required: ${requiredPermissions.join(', ')}`
      );
      return;
    }

    next();
  };
}

/**
 * Checks if user has ANY of the required permissions
 */
export function requireAnyPermission(...permissions: Permission[]) {
  return (req: AuthRequest, res: Response, next: NextFunction): void => {
    if (!req.user) {
      sendUnauthorized(res, 'Authentication required');
      return;
    }

    const userPermissions = req.user.permissions || [];

    const hasAny = permissions.some((perm) =>
      userPermissions.includes(perm)
    );

    if (!hasAny) {
      sendForbidden(res, 'Insufficient permissions');
      return;
    }

    next();
  };
}
