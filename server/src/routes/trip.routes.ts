import { Router } from 'express';
import { tripController } from '../controllers/index.js';
import { authenticate, requirePermissions, validate, validateId } from '../middlewares/index.js';
import { createTripSchema, updateTripSchema, completeTripSchema } from '../validators/trip.validator.js';
import { asyncHandler } from '../middlewares/errorHandler.js';
import { PERMISSIONS } from '../constants/roles.js';

const router = Router();

router.use(authenticate);

router.get('/', asyncHandler(tripController.getAll));
router.get('/:id', validateId('id'), asyncHandler(tripController.getById));

router.post(
  '/',
  requirePermissions(PERMISSIONS.TRIP_CREATE),
  validate(createTripSchema),
  asyncHandler(tripController.create)
);

router.put(
  '/:id/dispatch',
  validateId('id'),
  requirePermissions(PERMISSIONS.TRIP_DISPATCH),
  asyncHandler(tripController.dispatch)
);

router.put(
  '/:id/complete',
  validateId('id'),
  requirePermissions(PERMISSIONS.TRIP_COMPLETE),
  validate(completeTripSchema),
  asyncHandler(tripController.complete)
);

router.put(
  '/:id/cancel',
  validateId('id'),
  requirePermissions(PERMISSIONS.TRIP_CANCEL),
  asyncHandler(tripController.cancel)
);

export default router;
