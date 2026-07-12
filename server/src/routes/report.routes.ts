import { Router } from 'express';
import { reportController } from '../controllers/index.js';
import { authenticate, requirePermissions } from '../middlewares/index.js';
import { asyncHandler } from '../middlewares/errorHandler.js';
import { PERMISSIONS } from '../constants/roles.js';

const router = Router();

router.use(authenticate);

router.get(
  '/dashboard',
  requirePermissions(PERMISSIONS.REPORT_VIEW),
  asyncHandler(reportController.getDashboard)
);

router.get(
  '/fleet',
  requirePermissions(PERMISSIONS.REPORT_VIEW),
  asyncHandler(reportController.getFleetReport)
);

router.get(
  '/export/csv',
  requirePermissions(PERMISSIONS.REPORT_EXPORT),
  asyncHandler(reportController.exportCSV)
);

router.get(
  '/export/pdf',
  requirePermissions(PERMISSIONS.REPORT_EXPORT),
  asyncHandler(reportController.exportPDF)
);

export default router;
