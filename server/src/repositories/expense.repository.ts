import prisma from '../config/database.js';
import type { Prisma } from '@prisma/client';

export const expenseRepository = {
  findById(id: string) {
    return prisma.expense.findUnique({
      where: { id },
      include: { vehicle: true, trip: true },
    });
  },

  findAll(params: {
    skip?: number;
    take?: number;
    where?: Prisma.ExpenseWhereInput;
    orderBy?: Prisma.ExpenseOrderByWithRelationInput;
  }) {
    return prisma.expense.findMany({
      ...params,
      include: { vehicle: true },
    });
  },

  count(where?: Prisma.ExpenseWhereInput) {
    return prisma.expense.count({ where });
  },

  create(data: Prisma.ExpenseCreateInput) {
    return prisma.expense.create({
      data,
      include: { vehicle: true },
    });
  },

  update(id: string, data: Prisma.ExpenseUpdateInput) {
    return prisma.expense.update({
      where: { id },
      data,
      include: { vehicle: true },
    });
  },

  delete(id: string) {
    return prisma.expense.delete({ where: { id } });
  },

  sumCost(since: Date) {
    return prisma.expense.aggregate({
      where: {
        date: { gte: since },
        status: 'APPROVED',
      },
      _sum: {
        amount: true,
      },
    });
  },
};
