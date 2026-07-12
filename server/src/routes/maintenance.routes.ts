import { Router } from 'express';
import { maintenanceController } from '../controllers/index.js';
import { authenticate, requirePermissions, validate, validateId } from '../middlewares/index.js';
import { createMaintenanceSchema, updateMaintenanceSchema } from '../validators/maintenance.validator.js';
import { asyncHandler } from '../middlewares/errorHandler.js';
import { PERMISSIONS } from '../constants/roles.js';

const router = Router();

router.use(authenticate);

router.get('/', asyncHandler(maintenanceController.getAll));

router.post(
  '/',
  requirePermissions(PERMISSIONS.MAINTENANCE_CREATE),
  validate(createMaintenanceSchema),
  asyncHandler(maintenanceController.create)
);

router.put(
  '/:id',
  validateId('id'),
  requirePermissions(PERMISSIONS.MAINTENANCE_UPDATE),
  validate(updateMaintenanceSchema),
  asyncHandler(maintenanceController.update)
);

router.delete(
  '/:id',
  validateId('id'),
  requirePermissions(PERMISSIONS.MAINTENANCE_DELETE),
  asyncHandler(maintenanceController.delete)
);

export default router;
