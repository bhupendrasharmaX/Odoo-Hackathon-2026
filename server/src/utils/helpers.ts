import crypto from 'crypto';

/**
 * Generate a cryptographically secure 6-digit OTP
 */
export function generateOtp(): string {
  return crypto.randomInt(100000, 999999).toString();
}

/**
 * Parse pagination query params with defaults
 */
export function parsePagination(query: Record<string, unknown>): {
  page: number;
  limit: number;
  skip: number;
} {
  const page = Math.max(1, Number(query.page) || 1);
  const limit = Math.min(100, Math.max(1, Number(query.limit) || 10));
  const skip = (page - 1) * limit;
  return { page, limit, skip };
}

/**
 * Parse sort query params
 */
export function parseSort(
  query: Record<string, unknown>,
  allowedFields: string[],
  defaultField = 'createdAt',
  defaultOrder: 'asc' | 'desc' = 'desc'
): { field: string; order: 'asc' | 'desc' } {
  const field = allowedFields.includes(query.sortBy as string)
    ? (query.sortBy as string)
    : defaultField;
  const order = query.sortOrder === 'asc' ? 'asc' : defaultOrder;
  return { field, order };
}

/**
 * Build search filter for Prisma 'contains' queries
 */
export function buildSearchFilter(
  search: string | undefined,
  fields: string[]
): object[] {
  if (!search || search.trim() === '') return [];
  const term = search.trim();
  return fields.map((field) => ({
    [field]: { contains: term, mode: 'insensitive' },
  }));
}

/**
 * Format date to ISO string safely
 */
export function toISODate(date: Date | string | null | undefined): string | null {
  if (!date) return null;
  const d = typeof date === 'string' ? new Date(date) : date;
  return isNaN(d.getTime()) ? null : d.toISOString();
}
