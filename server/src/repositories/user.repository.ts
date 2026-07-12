import prisma from '../config/database.js';
import type { Prisma } from '@prisma/client';

export const userRepository = {
  findById(id: string) {
    return prisma.user.findUnique({
      where: { id },
      include: { role: true },
    });
  },

  findByMobile(mobileNumber: string) {
    return prisma.user.findUnique({
      where: { mobileNumber },
      include: { role: true },
    });
  },

  findByEmail(email: string) {
    return prisma.user.findFirst({
      where: { email },
      include: { role: true },
    });
  },

  findAll(params: {
    skip?: number;
    take?: number;
    where?: Prisma.UserWhereInput;
    orderBy?: Prisma.UserOrderByWithRelationInput;
  }) {
    return prisma.user.findMany({
      ...params,
      include: { role: true },
    });
  },

  count(where?: Prisma.UserWhereInput) {
    return prisma.user.count({ where });
  },

  create(data: Prisma.UserCreateInput) {
    return prisma.user.create({ data, include: { role: true } });
  },

  update(id: string, data: Prisma.UserUpdateInput) {
    return prisma.user.update({
      where: { id },
      data,
      include: { role: true },
    });
  },

  updateLastLogin(id: string) {
    return prisma.user.update({
      where: { id },
      data: { lastLogin: new Date(), isMobileVerified: true },
    });
  },
};
