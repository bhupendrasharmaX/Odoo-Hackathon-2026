import { fuelRepository, vehicleRepository } from '../repositories/index.js';
import { AppError } from '../middlewares/errorHandler.js';
import type { Prisma } from '@prisma/client';
import { parsePagination, parseSort } from '../utils/helpers.js';

export const fuelService = {
  async getFuelLogs(query: any) {
    const { page, limit, skip } = parsePagination(query);
    const { field, order } = parseSort(query, ['id', 'date', 'cost', 'liters'], 'date', 'desc');

    const where: Prisma.FuelLogWhereInput = {};

    if (query.search) {
      where.OR = [
        { id: { contains: query.search, mode: 'insensitive' } },
        { vehicleId: { contains: query.search, mode: 'insensitive' } },
        { station: { contains: query.search, mode: 'insensitive' } },
      ];
    }

    const [items, total] = await Promise.all([
      fuelRepository.findAll({
        skip,
        take: limit,
        where,
        orderBy: { [field]: order },
      }),
      fuelRepository.count(where),
    ]);

    const formatted = items.map((f) => ({
      id: f.id,
      vehicleId: f.vehicleId,
      vehicleName: f.vehicle.vehicleName,
      driverName: f.driverName || 'Unknown Driver',
      date: f.date.toISOString().split('T')[0],
      fuelType: f.fuelType as any,
      quantity: f.liters,
      costPerLiter: f.costPerLiter,
      totalCost: f.cost,
      odometer: f.odometer || 0,
      station: f.station || 'Unspecified Station',
    }));

    return { formatted, total, page, limit };
  },

  async createFuelLog(data: any) {
    const vehicle = await vehicleRepository.findById(data.vehicleId);
    if (!vehicle) {
      throw new AppError('Vehicle not found', 404, 'NOT_FOUND');
    }

    const created = await fuelRepository.create({
      vehicle: { connect: { id: data.vehicleId } },
      trip: data.tripId ? { connect: { id: data.tripId } } : undefined,
      driverName: data.driverName,
      fuelType: data.fuelType,
      liters: data.liters,
      costPerLiter: data.costPerLiter || (data.cost / data.liters),
      cost: data.cost,
      odometer: data.odometer,
      station: data.station,
      date: new Date(data.date),
    });

    return created;
  },

  async updateFuelLog(id: string, data: any) {
    const log = await fuelRepository.findById(id);
    if (!log) {
      throw new AppError('Fuel log not found', 404, 'NOT_FOUND');
    }

    const updated = await fuelRepository.update(id, {
      driverName: data.driverName,
      fuelType: data.fuelType,
      liters: data.liters,
      costPerLiter: data.costPerLiter,
      cost: data.cost,
      odometer: data.odometer,
      station: data.station,
      date: data.date ? new Date(data.date) : undefined,
    });

    return updated;
  },

  async deleteFuelLog(id: string) {
    const log = await fuelRepository.findById(id);
    if (!log) {
      throw new AppError('Fuel log not found', 404, 'NOT_FOUND');
    }
    await fuelRepository.delete(id);
    return true;
  },
};

export default fuelService;
