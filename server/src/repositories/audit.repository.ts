import prisma from '../config/database.js';
import type { Prisma } from '@prisma/client';

export const auditRepository = {
  create(data: {
    userId: string;
    action: string;
    entity: string;
    entityId?: string;
    metadata?: Prisma.InputJsonValue;
  }) {
    return prisma.auditLog.create({ data });
  },

  findAll(params: {
    skip?: number;
    take?: number;
    where?: Prisma.AuditLogWhereInput;
    orderBy?: Prisma.AuditLogOrderByWithRelationInput;
  }) {
    return prisma.auditLog.findMany({
      ...params,
      include: {
        user: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },
      },
    });
  },

  count(where?: Prisma.AuditLogWhereInput) {
    return prisma.auditLog.count({ where });
  },
};
