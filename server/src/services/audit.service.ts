import { auditRepository } from '../repositories/index.js';
import type { Prisma } from '@prisma/client';

export const auditService = {
  async log(userId: string, action: string, entity: string, entityId?: string, metadata?: any) {
    try {
      await auditRepository.create({
        userId,
        action,
        entity,
        entityId,
        metadata: metadata ? (metadata as Prisma.InputJsonValue) : undefined,
      });
    } catch (err) {
      console.error('Failed to write audit log:', err);
      // Fail silently to avoid breaking main business transactions
    }
  },

  async getLogs(query: any) {
    const page = Math.max(1, Number(query.page) || 1);
    const limit = Math.min(100, Math.max(1, Number(query.limit) || 20));
    const skip = (page - 1) * limit;

    const where: Prisma.AuditLogWhereInput = {};

    if (query.userId) {
      where.userId = query.userId;
    }
    if (query.entity) {
      where.entity = query.entity;
    }
    if (query.action) {
      where.action = query.action;
    }

    const [items, total] = await Promise.all([
      auditRepository.findAll({
        skip,
        take: limit,
        where,
        orderBy: { createdAt: 'desc' },
      }),
      auditRepository.count(where),
    ]);

    return { items, total, page, limit };
  },
};

export default auditService;
