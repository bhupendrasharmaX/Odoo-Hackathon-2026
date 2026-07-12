import { z } from 'zod';

export const createFuelSchema = z.object({
  vehicleId: z.string().min(1, 'Vehicle ID is required'),
  tripId: z.string().optional(),
  driverName: z.string().optional(),
  fuelType: z.string().default('Diesel'),
  liters: z.number().positive('Liters must be positive'),
  costPerLiter: z.number().min(0).default(0),
  cost: z.number().min(0, 'Cost must be non-negative'),
  odometer: z.number().min(0).optional(),
  station: z.string().optional(),
  date: z.string().min(1, 'Date is required'),
});

export const updateFuelSchema = createFuelSchema.partial();
