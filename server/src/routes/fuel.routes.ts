import { Router } from 'express';
import { fuelController } from '../controllers/index.js';
import { authenticate, requirePermissions, validate, validateId } from '../middlewares/index.js';
import { createFuelSchema, updateFuelSchema } from '../validators/fuel.validator.js';
import { asyncHandler } from '../middlewares/errorHandler.js';
import { PERMISSIONS } from '../constants/roles.js';

const router = Router();

router.use(authenticate);

router.get('/', asyncHandler(fuelController.getAll));

router.post(
  '/',
  requirePermissions(PERMISSIONS.FUEL_CREATE),
  validate(createFuelSchema),
  asyncHandler(fuelController.create)
);

router.put(
  '/:id',
  validateId('id'),
  requirePermissions(PERMISSIONS.FUEL_UPDATE),
  validate(updateFuelSchema),
  asyncHandler(fuelController.update)
);

router.delete(
  '/:id',
  validateId('id'),
  requirePermissions(PERMISSIONS.FUEL_DELETE),
  asyncHandler(fuelController.delete)
);

export default router;
