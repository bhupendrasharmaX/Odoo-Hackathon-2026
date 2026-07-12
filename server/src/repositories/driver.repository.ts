import prisma from '../config/database.js';
import type { Prisma } from '@prisma/client';

export const driverRepository = {
  findById(id: string) {
    return prisma.driver.findUnique({
      where: { id },
      include: { trips: { orderBy: { createdAt: 'desc' }, take: 10 } },
    });
  },

  findByPhone(phone: string) {
    return prisma.driver.findUnique({ where: { phone } });
  },

  findByLicense(licenseNumber: string) {
    return prisma.driver.findUnique({ where: { licenseNumber } });
  },

  findAll(params: {
    skip?: number;
    take?: number;
    where?: Prisma.DriverWhereInput;
    orderBy?: Prisma.DriverOrderByWithRelationInput;
  }) {
    return prisma.driver.findMany(params);
  },

  count(where?: Prisma.DriverWhereInput) {
    return prisma.driver.count({ where });
  },

  create(data: Prisma.DriverCreateInput) {
    return prisma.driver.create({ data });
  },

  update(id: string, data: Prisma.DriverUpdateInput) {
    return prisma.driver.update({ where: { id }, data });
  },

  delete(id: string) {
    return prisma.driver.delete({ where: { id } });
  },

  findExpiring(daysFromNow: number) {
    const cutoff = new Date();
    cutoff.setDate(cutoff.getDate() + daysFromNow);
    return prisma.driver.findMany({
      where: {
        licenseExpiry: { lte: cutoff },
        status: { not: 'SUSPENDED' },
      },
    });
  },
};
