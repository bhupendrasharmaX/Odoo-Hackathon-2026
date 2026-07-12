import prisma from '../config/database.js';
import type { Prisma } from '@prisma/client';

export const fuelRepository = {
  findById(id: string) {
    return prisma.fuelLog.findUnique({
      where: { id },
      include: { vehicle: true, trip: true },
    });
  },

  findAll(params: {
    skip?: number;
    take?: number;
    where?: Prisma.FuelLogWhereInput;
    orderBy?: Prisma.FuelLogOrderByWithRelationInput;
  }) {
    return prisma.fuelLog.findMany({
      ...params,
      include: { vehicle: true },
    });
  },

  count(where?: Prisma.FuelLogWhereInput) {
    return prisma.fuelLog.count({ where });
  },

  create(data: Prisma.FuelLogCreateInput) {
    return prisma.fuelLog.create({
      data,
      include: { vehicle: true },
    });
  },

  update(id: string, data: Prisma.FuelLogUpdateInput) {
    return prisma.fuelLog.update({
      where: { id },
      data,
      include: { vehicle: true },
    });
  },

  delete(id: string) {
    return prisma.fuelLog.delete({ where: { id } });
  },

  sumCost(since: Date) {
    return prisma.fuelLog.aggregate({
      where: {
        date: { gte: since },
      },
      _sum: {
        cost: true,
      },
    });
  },
};
