import prisma from '../config/database.js';
import type { Prisma } from '@prisma/client';

export const maintenanceRepository = {
  findById(id: string) {
    return prisma.maintenanceLog.findUnique({
      where: { id },
      include: { vehicle: true },
    });
  },

  findAll(params: {
    skip?: number;
    take?: number;
    where?: Prisma.MaintenanceLogWhereInput;
    orderBy?: Prisma.MaintenanceLogOrderByWithRelationInput;
  }) {
    return prisma.maintenanceLog.findMany({
      ...params,
      include: { vehicle: true },
    });
  },

  count(where?: Prisma.MaintenanceLogWhereInput) {
    return prisma.maintenanceLog.count({ where });
  },

  create(data: Prisma.MaintenanceLogCreateInput) {
    return prisma.maintenanceLog.create({
      data,
      include: { vehicle: true },
    });
  },

  update(id: string, data: Prisma.MaintenanceLogUpdateInput) {
    return prisma.maintenanceLog.update({
      where: { id },
      data,
      include: { vehicle: true },
    });
  },

  delete(id: string) {
    return prisma.maintenanceLog.delete({ where: { id } });
  },

  sumCost(since: Date) {
    return prisma.maintenanceLog.aggregate({
      where: {
        createdAt: { gte: since },
        status: 'COMPLETED',
      },
      _sum: {
        cost: true,
      },
    });
  },
};
