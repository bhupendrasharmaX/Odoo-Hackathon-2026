import type { Response } from 'express';
import { vehicleService, auditService } from '../services/index.js';
import { sendSuccess, sendCreated } from '../utils/response.js';
import type { AuthRequest } from '../types/index.js';

export const vehicleController = {
  async getAll(req: AuthRequest, res: Response) {
    const { formatted, total, page, limit } = await vehicleService.getVehicles(req.query);
    res.setHeader('X-Total-Count', total);
    sendSuccess(res, formatted, 'Vehicles list retrieved', 200, {
      page,
      limit,
      total,
      totalPages: Math.ceil(total / limit),
    });
  },

  async getById(req: AuthRequest, res: Response) {
    const id = req.params.id as string;
    const vehicle = await vehicleService.getVehicleById(id);
    sendSuccess(res, vehicle, 'Vehicle details retrieved');
  },

  async create(req: AuthRequest, res: Response) {
    const vehicle = await vehicleService.createVehicle(req.body);
    await auditService.log(req.user!.userId, 'CREATE', 'Vehicle', vehicle.id, { reg: vehicle.registrationNumber });
    sendCreated(res, vehicle, 'Vehicle registered successfully');
  },

  async update(req: AuthRequest, res: Response) {
    const id = req.params.id as string;
    const vehicle = await vehicleService.updateVehicle(id, req.body);
    await auditService.log(req.user!.userId, 'UPDATE', 'Vehicle', vehicle.id, req.body);
    sendSuccess(res, vehicle, 'Vehicle updated successfully');
  },

  async delete(req: AuthRequest, res: Response) {
    const id = req.params.id as string;
    await vehicleService.deleteVehicle(id);
    await auditService.log(req.user!.userId, 'DELETE', 'Vehicle', id);
    sendSuccess(res, null, 'Vehicle deleted successfully');
  },
};

export default vehicleController;
