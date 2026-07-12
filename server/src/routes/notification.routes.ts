import { Router } from 'express';
import { notificationController } from '../controllers/index.js';
import { authenticate } from '../middlewares/index.js';
import { asyncHandler } from '../middlewares/errorHandler.js';

const router = Router();

router.use(authenticate);

router.get('/', asyncHandler(notificationController.getAll));
router.post('/read-all', asyncHandler(notificationController.markAllAsRead));
router.patch('/:id/read', asyncHandler(notificationController.markAsRead));

export default router;
