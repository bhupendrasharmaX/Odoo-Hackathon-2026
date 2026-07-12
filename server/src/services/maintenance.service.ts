import { maintenanceRepository, vehicleRepository } from '../repositories/index.js';
import { AppError } from '../middlewares/errorHandler.js';
import type { Prisma } from '@prisma/client';
import { parsePagination, parseSort } from '../utils/helpers.js';
import prisma from '../config/database.js';

export const maintenanceService = {
  async getMaintenanceLogs(query: any) {
    const { page, limit, skip } = parsePagination(query);
    const { field, order } = parseSort(query, ['id', 'startDate', 'cost', 'priority'], 'startDate', 'desc');

    const where: Prisma.MaintenanceLogWhereInput = {};

    if (query.status && query.status !== 'All') {
      where.status = query.status.toUpperCase().replace(' ', '_') as any;
    }

    if (query.search) {
      where.OR = [
        { id: { contains: query.search, mode: 'insensitive' } },
        { title: { contains: query.search, mode: 'insensitive' } },
        { vehicleId: { contains: query.search, mode: 'insensitive' } },
      ];
    }

    const [items, total] = await Promise.all([
      maintenanceRepository.findAll({
        skip,
        take: limit,
        where,
        orderBy: { [field]: order },
      }),
      maintenanceRepository.count(where),
    ]);

    const formatted = items.map((m) => ({
      id: m.id,
      vehicleId: m.vehicleId,
      vehicleName: m.vehicle.vehicleName,
      type: m.title,
      description: m.description || '',
      priority: m.priority,
      status: m.status === 'SCHEDULED' ? 'Scheduled' : m.status === 'IN_PROGRESS' ? 'In Progress' : m.status === 'COMPLETED' ? 'Completed' : 'Overdue',
      scheduledDate: m.startDate.toISOString().split('T')[0],
      estimatedCost: m.cost,
      actualCost: m.status === 'COMPLETED' ? m.cost : undefined,
      mechanic: m.mechanic || 'Unassigned',
    }));

    return { formatted, total, page, limit };
  },

  async createMaintenanceLog(data: any) {
    return prisma.$transaction(async (tx) => {
      const vehicle = await tx.vehicle.findUnique({
        where: { id: data.vehicleId },
      });

      if (!vehicle) {
        throw new AppError('Vehicle not found', 404, 'NOT_FOUND');
      }

      // Check if vehicle can go in maintenance
      if (vehicle.status === 'RETIRED') {
        throw new AppError('Cannot schedule maintenance for retired vehicle', 400, 'BAD_REQUEST');
      }

      const created = await tx.maintenanceLog.create({
        data: {
          vehicleId: data.vehicleId,
          title: data.title,
          description: data.description,
          priority: data.priority || 'Medium',
          cost: data.cost || 0,
          status: data.status || 'SCHEDULED',
          startDate: new Date(data.startDate),
          mechanic: data.mechanic,
        },
      });

      // Update vehicle status
      await tx.vehicle.update({
        where: { id: data.vehicleId },
        data: { status: 'IN_SHOP' },
      });

      return created;
    });
  },

  async updateMaintenanceLog(id: string, data: any) {
    return prisma.$transaction(async (tx) => {
      const log = await tx.maintenanceLog.findUnique({
        where: { id },
      });

      if (!log) {
        throw new AppError('Maintenance log not found', 404, 'NOT_FOUND');
      }

      const updated = await tx.maintenanceLog.update({
        where: { id },
        data: {
          title: data.title,
          description: data.description,
          priority: data.priority,
          cost: data.cost,
          status: data.status,
          startDate: data.startDate ? new Date(data.startDate) : undefined,
          completedDate: data.completedDate ? new Date(data.completedDate) : undefined,
          mechanic: data.mechanic,
        },
      });

      // If closed, update vehicle back to AVAILABLE (unless retired)
      if (data.status === 'COMPLETED') {
        const vehicle = await tx.vehicle.findUnique({
          where: { id: log.vehicleId },
        });

        if (vehicle && vehicle.status !== 'RETIRED') {
          await tx.vehicle.update({
            where: { id: log.vehicleId },
            data: { status: 'AVAILABLE' },
          });
        }
      }

      return updated;
    });
  },

  async deleteMaintenanceLog(id: string) {
    const log = await maintenanceRepository.findById(id);
    if (!log) {
      throw new AppError('Maintenance log not found', 404, 'NOT_FOUND');
    }
    await maintenanceRepository.delete(id);
    return true;
  },
};

export default maintenanceService;
