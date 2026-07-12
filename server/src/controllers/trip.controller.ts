import type { Response } from 'express';
import { tripService, auditService } from '../services/index.js';
import { sendSuccess, sendCreated } from '../utils/response.js';
import type { AuthRequest } from '../types/index.js';

export const tripController = {
  async getAll(req: AuthRequest, res: Response) {
    const { formatted, total, page, limit } = await tripService.getTrips(req.query);
    res.setHeader('X-Total-Count', total);
    sendSuccess(res, formatted, 'Trips list retrieved', 200, {
      page,
      limit,
      total,
      totalPages: Math.ceil(total / limit),
    });
  },

  async getById(req: AuthRequest, res: Response) {
    const id = req.params.id as string;
    const trip = await tripService.getTripById(id);
    sendSuccess(res, trip, 'Trip details retrieved');
  },

  async create(req: AuthRequest, res: Response) {
    const trip = await tripService.createTrip(req.body);
    await auditService.log(req.user!.userId, 'CREATE', 'Trip', trip.id, { route: `${trip.source} -> ${trip.destination}` });
    sendCreated(res, trip, 'Trip created successfully');
  },

  async dispatch(req: AuthRequest, res: Response) {
    const id = req.params.id as string;
    const trip = await tripService.dispatchTrip(id);
    await auditService.log(req.user!.userId, 'DISPATCH', 'Trip', trip.id);
    sendSuccess(res, trip, 'Trip dispatched successfully');
  },

  async complete(req: AuthRequest, res: Response) {
    const id = req.params.id as string;
    const trip = await tripService.completeTrip(id, req.body);
    await auditService.log(req.user!.userId, 'COMPLETE', 'Trip', trip.id, req.body);
    sendSuccess(res, trip, 'Trip completed successfully');
  },

  async cancel(req: AuthRequest, res: Response) {
    const id = req.params.id as string;
    const trip = await tripService.cancelTrip(id);
    await auditService.log(req.user!.userId, 'CANCEL', 'Trip', trip.id);
    sendSuccess(res, trip, 'Trip cancelled successfully');
  },
};

export default tripController;
