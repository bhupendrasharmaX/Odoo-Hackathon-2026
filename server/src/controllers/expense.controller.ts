import type { Response } from 'express';
import { expenseService, auditService } from '../services/index.js';
import { sendSuccess, sendCreated } from '../utils/response.js';
import type { AuthRequest } from '../types/index.js';

export const expenseController = {
  async getAll(req: AuthRequest, res: Response) {
    const { formatted, total, page, limit } = await expenseService.getExpenses(req.query);
    res.setHeader('X-Total-Count', total);
    sendSuccess(res, formatted, 'Expenses list retrieved', 200, {
      page,
      limit,
      total,
      totalPages: Math.ceil(total / limit),
    });
  },

  async create(req: AuthRequest, res: Response) {
    const log = await expenseService.createExpense(req.body);
    if (log.vehicleId) {
      await auditService.log(req.user!.userId, 'CREATE_EXPENSE', 'Vehicle', log.vehicleId, { amount: log.amount });
    } else {
      await auditService.log(req.user!.userId, 'CREATE_EXPENSE', 'General', log.id, { amount: log.amount });
    }
    sendCreated(res, log, 'Expense added successfully');
  },

  async update(req: AuthRequest, res: Response) {
    const id = req.params.id as string;
    const log = await expenseService.updateExpense(id, req.body);
    await auditService.log(req.user!.userId, 'UPDATE_EXPENSE', 'Expense', log.id, req.body);
    sendSuccess(res, log, 'Expense updated successfully');
  },

  async delete(req: AuthRequest, res: Response) {
    const id = req.params.id as string;
    await expenseService.deleteExpense(id);
    await auditService.log(req.user!.userId, 'DELETE_EXPENSE', 'Expense', id);
    sendSuccess(res, null, 'Expense deleted successfully');
  },
};

export default expenseController;
