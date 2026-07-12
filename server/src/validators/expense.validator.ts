import { z } from 'zod';

export const createExpenseSchema = z.object({
  vehicleId: z.string().optional(),
  tripId: z.string().optional(),
  expenseType: z.string().min(1, 'Expense type is required'),
  amount: z.number().positive('Amount must be positive'),
  description: z.string().optional(),
  status: z.enum(['APPROVED', 'PENDING', 'REJECTED']).optional().default('PENDING'),
  date: z.string().min(1, 'Date is required'),
});

export const updateExpenseSchema = createExpenseSchema.partial();
