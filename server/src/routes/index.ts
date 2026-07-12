import { Router } from 'express';
import authRoutes from './auth.routes.js';
import vehicleRoutes from './vehicle.routes.js';
import driverRoutes from './driver.routes.js';
import tripRoutes from './trip.routes.js';
import maintenanceRoutes from './maintenance.routes.js';
import fuelRoutes from './fuel.routes.js';
import expenseRoutes from './expense.routes.js';
import reportRoutes from './report.routes.js';
import { sendSuccess } from '../utils/response.js';

const router = Router();

// Health check endpoint
router.get('/health', (_req, res) => {
  sendSuccess(res, { uptime: process.uptime() }, 'TransitOps Backend Server is Healthy');
});

router.use('/auth', authRoutes);
router.use('/vehicles', vehicleRoutes);
router.use('/drivers', driverRoutes);
router.use('/trips', tripRoutes);
router.use('/maintenance', maintenanceRoutes);
router.use('/fuel', fuelRoutes);
router.use('/expenses', expenseRoutes);
router.use('/reports', reportRoutes);

export default router;
