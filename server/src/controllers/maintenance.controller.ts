import type { Response } from 'express';
import { maintenanceService, auditService } from '../services/index.js';
import { sendSuccess, sendCreated } from '../utils/response.js';
import type { AuthRequest } from '../types/index.js';

export const maintenanceController = {
  async getAll(req: AuthRequest, res: Response) {
    const { formatted, total, page, limit } = await maintenanceService.getMaintenanceLogs(req.query);
    res.setHeader('X-Total-Count', total);
    sendSuccess(res, formatted, 'Maintenance logs list retrieved', 200, {
      page,
      limit,
      total,
      totalPages: Math.ceil(total / limit),
    });
  },

  async create(req: AuthRequest, res: Response) {
    const log = await maintenanceService.createMaintenanceLog(req.body);
    await auditService.log(req.user!.userId, 'CREATE_MAINTENANCE', 'Vehicle', log.vehicleId, { title: log.title });
    sendCreated(res, log, 'Maintenance log created successfully');
  },

  async update(req: AuthRequest, res: Response) {
    const id = req.params.id as string;
    const log = await maintenanceService.updateMaintenanceLog(id, req.body);
    await auditService.log(req.user!.userId, 'UPDATE_MAINTENANCE', 'Vehicle', log.vehicleId, req.body);
    sendSuccess(res, log, 'Maintenance log updated successfully');
  },

  async delete(req: AuthRequest, res: Response) {
    const id = req.params.id as string;
    await maintenanceService.deleteMaintenanceLog(id);
    await auditService.log(req.user!.userId, 'DELETE_MAINTENANCE', 'MaintenanceLog', id);
    sendSuccess(res, null, 'Maintenance log deleted successfully');
  },
};

export default maintenanceController;
