import { z } from 'zod';

export const createTripSchema = z.object({
  vehicleId: z.string().min(1, 'Vehicle ID is required'),
  driverId: z.string().min(1, 'Driver ID is required'),
  source: z.string().min(1, 'Source location is required'),
  destination: z.string().min(1, 'Destination is required'),
  cargoType: z.string().optional(),
  cargoWeight: z.number().min(0).default(0),
  plannedDistance: z.number().min(0).default(0),
  revenue: z.number().min(0).default(0),
  startTime: z.string().optional(),
  eta: z.string().optional(),
});

export const updateTripSchema = z.object({
  source: z.string().min(1).optional(),
  destination: z.string().min(1).optional(),
  cargoType: z.string().optional(),
  cargoWeight: z.number().min(0).optional(),
  plannedDistance: z.number().min(0).optional(),
  actualDistance: z.number().min(0).optional(),
  fuelUsed: z.number().min(0).optional(),
  fuelCost: z.number().min(0).optional(),
  revenue: z.number().min(0).optional(),
});

export const completeTripSchema = z.object({
  actualDistance: z.number().min(0, 'Actual distance required'),
  fuelUsed: z.number().min(0, 'Fuel used required'),
  fuelCost: z.number().min(0).optional(),
});
