import type { Response } from 'express';
import { fuelService, auditService } from '../services/index.js';
import { sendSuccess, sendCreated } from '../utils/response.js';
import type { AuthRequest } from '../types/index.js';

export const fuelController = {
  async getAll(req: AuthRequest, res: Response) {
    const { formatted, total, page, limit } = await fuelService.getFuelLogs(req.query);
    res.setHeader('X-Total-Count', total);
    sendSuccess(res, formatted, 'Fuel logs list retrieved', 200, {
      page,
      limit,
      total,
      totalPages: Math.ceil(total / limit),
    });
  },

  async create(req: AuthRequest, res: Response) {
    const log = await fuelService.createFuelLog(req.body);
    await auditService.log(req.user!.userId, 'CREATE_FUEL_LOG', 'Vehicle', log.vehicleId, { liters: log.liters });
    sendCreated(res, log, 'Fuel log added successfully');
  },

  async update(req: AuthRequest, res: Response) {
    const id = req.params.id as string;
    const log = await fuelService.updateFuelLog(id, req.body);
    await auditService.log(req.user!.userId, 'UPDATE_FUEL_LOG', 'Vehicle', log.vehicleId, req.body);
    sendSuccess(res, log, 'Fuel log updated successfully');
  },

  async delete(req: AuthRequest, res: Response) {
    const id = req.params.id as string;
    await fuelService.deleteFuelLog(id);
    await auditService.log(req.user!.userId, 'DELETE_FUEL_LOG', 'FuelLog', id);
    sendSuccess(res, null, 'Fuel log deleted successfully');
  },
};

export default fuelController;
