import { z } from 'zod';

export const createDriverSchema = z.object({
  name: z.string().min(1, 'Name is required'),
  phone: z.string().regex(/^[6-9]\d{9}$/, 'Valid 10-digit phone required'),
  email: z.string().email().optional(),
  licenseNumber: z.string().min(1, 'License number is required'),
  licenseCategory: z.string().min(1, 'License category is required'),
  licenseExpiry: z.string().min(1, 'License expiry date is required'),
  safetyScore: z.number().min(0).max(100).default(0),
  status: z.enum(['AVAILABLE', 'ON_TRIP', 'OFF_DUTY', 'SUSPENDED']).optional().default('AVAILABLE'),
  experience: z.number().int().min(0).default(0),
});

export const updateDriverSchema = createDriverSchema.partial();
