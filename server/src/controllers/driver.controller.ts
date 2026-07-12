import type { Response } from 'express';
import { driverService, auditService } from '../services/index.js';
import { sendSuccess, sendCreated } from '../utils/response.js';
import type { AuthRequest } from '../types/index.js';

export const driverController = {
  async getAll(req: AuthRequest, res: Response) {
    const { formatted, total, page, limit } = await driverService.getDrivers(req.query);
    res.setHeader('X-Total-Count', total);
    sendSuccess(res, formatted, 'Drivers list retrieved', 200, {
      page,
      limit,
      total,
      totalPages: Math.ceil(total / limit),
    });
  },

  async getById(req: AuthRequest, res: Response) {
    const id = req.params.id as string;
    const driver = await driverService.getDriverById(id);
    sendSuccess(res, driver, 'Driver details retrieved');
  },

  async create(req: AuthRequest, res: Response) {
    const driver = await driverService.createDriver(req.body);
    await auditService.log(req.user!.userId, 'CREATE', 'Driver', driver.id, { name: driver.name });
    sendCreated(res, driver, 'Driver registered successfully');
  },

  async update(req: AuthRequest, res: Response) {
    const id = req.params.id as string;
    const driver = await driverService.updateDriver(id, req.body);
    await auditService.log(req.user!.userId, 'UPDATE', 'Driver', driver.id, req.body);
    sendSuccess(res, driver, 'Driver updated successfully');
  },

  async delete(req: AuthRequest, res: Response) {
    const id = req.params.id as string;
    await driverService.deleteDriver(id);
    await auditService.log(req.user!.userId, 'DELETE', 'Driver', id);
    sendSuccess(res, null, 'Driver deleted successfully');
  },
};

export default driverController;
