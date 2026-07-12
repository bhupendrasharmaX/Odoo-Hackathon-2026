import { Router } from 'express';
import { expenseController } from '../controllers/index.js';
import { authenticate, requirePermissions, validate, validateId } from '../middlewares/index.js';
import { createExpenseSchema, updateExpenseSchema } from '../validators/expense.validator.js';
import { asyncHandler } from '../middlewares/errorHandler.js';
import { PERMISSIONS } from '../constants/roles.js';

const router = Router();

router.use(authenticate);

router.get('/', asyncHandler(expenseController.getAll));

router.post(
  '/',
  requirePermissions(PERMISSIONS.EXPENSE_CREATE),
  validate(createExpenseSchema),
  asyncHandler(expenseController.create)
);

router.put(
  '/:id',
  validateId('id'),
  requirePermissions(PERMISSIONS.EXPENSE_UPDATE),
  validate(updateExpenseSchema),
  asyncHandler(expenseController.update)
);

router.delete(
  '/:id',
  validateId('id'),
  requirePermissions(PERMISSIONS.EXPENSE_DELETE),
  asyncHandler(expenseController.delete)
);

export default router;
