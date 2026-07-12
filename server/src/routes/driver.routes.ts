import { Router } from 'express';
import { driverController } from '../controllers/index.js';
import { authenticate, requirePermissions, validate, validateId } from '../middlewares/index.js';
import { createDriverSchema, updateDriverSchema } from '../validators/driver.validator.js';
import { asyncHandler } from '../middlewares/errorHandler.js';
import { PERMISSIONS } from '../constants/roles.js';

const router = Router();

router.use(authenticate);

router.get('/', asyncHandler(driverController.getAll));
router.get('/:id', validateId('id'), asyncHandler(driverController.getById));

router.post(
  '/',
  requirePermissions(PERMISSIONS.DRIVER_CREATE),
  validate(createDriverSchema),
  asyncHandler(driverController.create)
);

router.put(
  '/:id',
  validateId('id'),
  requirePermissions(PERMISSIONS.DRIVER_UPDATE),
  validate(updateDriverSchema),
  asyncHandler(driverController.update)
);

router.delete(
  '/:id',
  validateId('id'),
  requirePermissions(PERMISSIONS.DRIVER_DELETE),
  asyncHandler(driverController.delete)
);

export default router;
