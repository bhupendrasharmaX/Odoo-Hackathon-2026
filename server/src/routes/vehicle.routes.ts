import { Router } from 'express';
import { vehicleController } from '../controllers/index.js';
import { authenticate, requirePermissions, validate, validateId } from '../middlewares/index.js';
import { createVehicleSchema, updateVehicleSchema } from '../validators/vehicle.validator.js';
import { asyncHandler } from '../middlewares/errorHandler.js';
import { PERMISSIONS } from '../constants/roles.js';

const router = Router();

router.use(authenticate);

router.get('/', asyncHandler(vehicleController.getAll));
router.get('/:id', validateId('id'), asyncHandler(vehicleController.getById));

router.post(
  '/',
  requirePermissions(PERMISSIONS.VEHICLE_CREATE),
  validate(createVehicleSchema),
  asyncHandler(vehicleController.create)
);

router.put(
  '/:id',
  validateId('id'),
  requirePermissions(PERMISSIONS.VEHICLE_UPDATE),
  validate(updateVehicleSchema),
  asyncHandler(vehicleController.update)
);

router.delete(
  '/:id',
  validateId('id'),
  requirePermissions(PERMISSIONS.VEHICLE_DELETE),
  asyncHandler(vehicleController.delete)
);

export default router;
