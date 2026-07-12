import { z } from 'zod';

export const createVehicleSchema = z.object({
  registrationNumber: z.string().min(1, 'Registration number is required'),
  vehicleName: z.string().min(1, 'Vehicle name is required'),
  model: z.string().min(1, 'Model is required'),
  vehicleType: z.enum(['TRUCK', 'VAN', 'BUS', 'CAR', 'TRAILER']),
  maximumCapacity: z.number().positive('Capacity must be positive'),
  odometer: z.number().min(0).default(0),
  purchaseCost: z.number().min(0).default(0),
  status: z.enum(['AVAILABLE', 'ON_TRIP', 'IN_SHOP', 'RETIRED']).optional().default('AVAILABLE'),
  insuranceExpiry: z.string().datetime().optional(),
  yearOfManufacture: z.number().int().min(1900).max(2100).optional(),
});

export const updateVehicleSchema = createVehicleSchema.partial();
