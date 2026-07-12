import prisma from '../config/database.js';
import type { Prisma } from '@prisma/client';

export const vehicleRepository = {
  findById(id: string) {
    return prisma.vehicle.findUnique({
      where: { id },
      include: {
        maintenanceLogs: { orderBy: { startDate: 'desc' }, take: 5 },
        fuelLogs: { orderBy: { date: 'desc' }, take: 5 },
        vehicleDocuments: true,
      },
    });
  },

  findByRegistration(registrationNumber: string) {
    return prisma.vehicle.findUnique({ where: { registrationNumber } });
  },

  findAll(params: {
    skip?: number;
    take?: number;
    where?: Prisma.VehicleWhereInput;
    orderBy?: Prisma.VehicleOrderByWithRelationInput;
  }) {
    return prisma.vehicle.findMany(params);
  },

  count(where?: Prisma.VehicleWhereInput) {
    return prisma.vehicle.count({ where });
  },

  create(data: Prisma.VehicleCreateInput) {
    return prisma.vehicle.create({ data });
  },

  update(id: string, data: Prisma.VehicleUpdateInput) {
    return prisma.vehicle.update({ where: { id }, data });
  },

  delete(id: string) {
    return prisma.vehicle.delete({ where: { id } });
  },

  countByStatus() {
    return prisma.vehicle.groupBy({
      by: ['status'],
      _count: { status: true },
    });
  },
};
