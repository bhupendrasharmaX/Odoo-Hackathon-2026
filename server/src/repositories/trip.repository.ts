import prisma from '../config/database.js';
import type { Prisma } from '@prisma/client';

export const tripRepository = {
  findById(id: string) {
    return prisma.trip.findUnique({
      where: { id },
      include: {
        vehicle: true,
        driver: true,
        fuelLogs: true,
        expenses: true,
      },
    });
  },

  findAll(params: {
    skip?: number;
    take?: number;
    where?: Prisma.TripWhereInput;
    orderBy?: Prisma.TripOrderByWithRelationInput;
  }) {
    return prisma.trip.findMany({
      ...params,
      include: {
        vehicle: true,
        driver: true,
      },
    });
  },

  count(where?: Prisma.TripWhereInput) {
    return prisma.trip.count({ where });
  },

  create(data: Prisma.TripCreateInput) {
    return prisma.trip.create({
      data,
      include: {
        vehicle: true,
        driver: true,
      },
    });
  },

  update(id: string, data: Prisma.TripUpdateInput) {
    return prisma.trip.update({
      where: { id },
      data,
      include: {
        vehicle: true,
        driver: true,
      },
    });
  },

  delete(id: string) {
    return prisma.trip.delete({ where: { id } });
  },

  findActiveTripsCount() {
    return prisma.trip.count({
      where: {
        status: { in: ['DISPATCHED', 'IN_TRANSIT'] },
      },
    });
  },

  aggregateRevenueAndFuel(since: Date) {
    return prisma.trip.aggregate({
      where: {
        status: 'COMPLETED',
        createdAt: { gte: since },
      },
      _sum: {
        revenue: true,
        fuelCost: true,
        fuelUsed: true,
        actualDistance: true,
      },
    });
  },
};
