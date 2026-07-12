import type { Request } from 'express';

export interface AuthPayload {
  userId: string;
  roleId: string;
  roleName: string;
  permissions: string[];
}

export interface AuthRequest extends Request {
  user?: AuthPayload;
}

export interface PaginationQuery {
  page?: string;
  limit?: string;
  search?: string;
  sortBy?: string;
  sortOrder?: 'asc' | 'desc';
  status?: string;
  type?: string;
}
