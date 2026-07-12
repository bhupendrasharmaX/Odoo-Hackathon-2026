import { expenseRepository, vehicleRepository } from '../repositories/index.js';
import { AppError } from '../middlewares/errorHandler.js';
import type { Prisma } from '@prisma/client';
import { parsePagination, parseSort } from '../utils/helpers.js';

export const expenseService = {
  async getExpenses(query: any) {
    const { page, limit, skip } = parsePagination(query);
    const { field, order } = parseSort(query, ['id', 'date', 'amount'], 'date', 'desc');

    const where: Prisma.ExpenseWhereInput = {};

    if (query.status && query.status !== 'All') {
      where.status = query.status.toUpperCase() as any;
    }

    if (query.search) {
      where.OR = [
        { id: { contains: query.search, mode: 'insensitive' } },
        { description: { contains: query.search, mode: 'insensitive' } },
        { expenseType: { contains: query.search, mode: 'insensitive' } },
      ];
    }

    const [items, total] = await Promise.all([
      expenseRepository.findAll({
        skip,
        take: limit,
        where,
        orderBy: { [field]: order },
      }),
      expenseRepository.count(where),
    ]);

    const formatted = items.map((e) => ({
      id: e.id,
      date: e.date.toISOString().split('T')[0],
      category: e.expenseType as any,
      description: e.description || '',
      vehicleId: e.vehicleId || undefined,
      vehicleName: e.vehicle?.vehicleName || undefined,
      amount: e.amount,
      status: e.status === 'APPROVED' ? 'Approved' : e.status === 'PENDING' ? 'Pending' : 'Rejected',
    }));

    return { formatted, total, page, limit };
  },

  async createExpense(data: any) {
    if (data.vehicleId) {
      const vehicle = await vehicleRepository.findById(data.vehicleId);
      if (!vehicle) {
        throw new AppError('Vehicle not found', 404, 'NOT_FOUND');
      }
    }

    const created = await expenseRepository.create({
      vehicle: data.vehicleId ? { connect: { id: data.vehicleId } } : undefined,
      trip: data.tripId ? { connect: { id: data.tripId } } : undefined,
      expenseType: data.expenseType,
      amount: data.amount,
      description: data.description,
      status: data.status || 'PENDING',
      date: new Date(data.date),
    });

    return created;
  },

  async updateExpense(id: string, data: any) {
    const log = await expenseRepository.findById(id);
    if (!log) {
      throw new AppError('Expense not found', 404, 'NOT_FOUND');
    }

    const updated = await expenseRepository.update(id, {
      expenseType: data.expenseType,
      amount: data.amount,
      description: data.description,
      status: data.status,
      date: data.date ? new Date(data.date) : undefined,
    });

    return updated;
  },

  async deleteExpense(id: string) {
    const log = await expenseRepository.findById(id);
    if (!log) {
      throw new AppError('Expense not found', 404, 'NOT_FOUND');
    }
    await expenseRepository.delete(id);
    return true;
  },
};

export default expenseService;
