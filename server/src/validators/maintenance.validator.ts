import { z } from 'zod';

export const createMaintenanceSchema = z.object({
  vehicleId: z.string().min(1, 'Vehicle ID is required'),
  title: z.string().min(1, 'Title is required'),
  description: z.string().optional(),
  priority: z.enum(['Low', 'Medium', 'High', 'Urgent']).default('Medium'),
  cost: z.number().min(0).default(0),
  status: z.enum(['SCHEDULED', 'IN_PROGRESS', 'COMPLETED', 'OVERDUE']).optional().default('SCHEDULED'),
  startDate: z.string().min(1, 'Start date is required'),
  completedDate: z.string().optional(),
  mechanic: z.string().optional(),
});

export const updateMaintenanceSchema = createMaintenanceSchema.partial();
