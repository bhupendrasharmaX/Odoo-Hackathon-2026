import { vehicleRepository } from '../repositories/index.js';
import { AppError } from '../middlewares/errorHandler.js';
import type { Prisma } from '@prisma/client';
import { buildSearchFilter, parsePagination, parseSort } from '../utils/helpers.js';

export const vehicleService = {
  async getVehicles(query: any) {
    const { page, limit, skip } = parsePagination(query);
    const { field, order } = parseSort(query, ['id', 'registrationNumber', 'vehicleName', 'odometer', 'purchaseCost'], 'id', 'asc');

    const where: Prisma.VehicleWhereInput = {};

    if (query.status && query.status !== 'All') {
      // Map status from frontend to backend DB status enums
      const statusMap: Record<string, Prisma.EnumVehicleStatusFilter> = {
        'Active': { in: ['ON_TRIP', 'AVAILABLE'] },
        'Available': { equals: 'AVAILABLE' },
        'In Maintenance': { equals: 'IN_SHOP' },
        'Retired': { equals: 'RETIRED' },
      };
      if (statusMap[query.status]) {
        where.status = statusMap[query.status];
      }
    }

    if (query.type && query.type !== 'All') {
      where.vehicleType = query.type.toUpperCase() as any;
    }

    if (query.search) {
      where.OR = buildSearchFilter(query.search, ['id', 'registrationNumber', 'vehicleName', 'model']);
    }

    const [items, total] = await Promise.all([
      vehicleRepository.findAll({
        skip,
        take: limit,
        where,
        orderBy: { [field]: order },
      }),
      vehicleRepository.count(where),
    ]);

    // Map output to match frontend interface
    const formatted = items.map((v) => ({
      id: v.id,
      registrationNumber: v.registrationNumber,
      name: v.vehicleName,
      model: v.model,
      type: v.vehicleType.charAt(0) + v.vehicleType.slice(1).toLowerCase(), // e.g. TRUCK -> Truck
      capacity: v.maximumCapacity,
      purchaseCost: v.purchaseCost,
      odometer: v.odometer,
      status: v.status === 'AVAILABLE' ? 'Available' : v.status === 'ON_TRIP' ? 'Active' : v.status === 'IN_SHOP' ? 'In Maintenance' : 'Retired',
      insuranceExpiry: v.insuranceExpiry?.toISOString().split('T')[0] || '',
      yearOfManufacture: v.yearOfManufacture || 0,
    }));

    return { formatted, total, page, limit };
  },

  async getVehicleById(id: string) {
    const vehicle = await vehicleRepository.findById(id);
    if (!vehicle) {
      throw new AppError('Vehicle not found', 404, 'NOT_FOUND');
    }
    return {
      id: vehicle.id,
      registrationNumber: vehicle.registrationNumber,
      name: vehicle.vehicleName,
      model: vehicle.model,
      type: vehicle.vehicleType.charAt(0) + vehicle.vehicleType.slice(1).toLowerCase(),
      capacity: vehicle.maximumCapacity,
      purchaseCost: vehicle.purchaseCost,
      odometer: vehicle.odometer,
      status: vehicle.status === 'AVAILABLE' ? 'Available' : vehicle.status === 'ON_TRIP' ? 'Active' : vehicle.status === 'IN_SHOP' ? 'In Maintenance' : 'Retired',
      insuranceExpiry: vehicle.insuranceExpiry?.toISOString().split('T')[0] || '',
      yearOfManufacture: vehicle.yearOfManufacture || 0,
      maintenanceLogs: vehicle.maintenanceLogs,
      fuelLogs: vehicle.fuelLogs,
      documents: vehicle.vehicleDocuments,
    };
  },

  async createVehicle(data: any) {
    const existing = await vehicleRepository.findByRegistration(data.registrationNumber);
    if (existing) {
      throw new AppError('Vehicle with this registration number already exists', 409, 'CONFLICT');
    }

    const created = await vehicleRepository.create({
      registrationNumber: data.registrationNumber,
      vehicleName: data.vehicleName,
      model: data.model,
      vehicleType: data.vehicleType.toUpperCase() as any,
      maximumCapacity: data.maximumCapacity,
      odometer: data.odometer,
      purchaseCost: data.purchaseCost,
      status: (data.status || 'AVAILABLE') as any,
      insuranceExpiry: data.insuranceExpiry ? new Date(data.insuranceExpiry) : null,
      yearOfManufacture: data.yearOfManufacture,
    });

    return created;
  },

  async updateVehicle(id: string, data: any) {
    const vehicle = await vehicleRepository.findById(id);
    if (!vehicle) {
      throw new AppError('Vehicle not found', 404, 'NOT_FOUND');
    }

    if (data.registrationNumber && data.registrationNumber !== vehicle.registrationNumber) {
      const existing = await vehicleRepository.findByRegistration(data.registrationNumber);
      if (existing) {
        throw new AppError('Vehicle with this registration number already exists', 409, 'CONFLICT');
      }
    }

    const updated = await vehicleRepository.update(id, {
      registrationNumber: data.registrationNumber,
      vehicleName: data.vehicleName,
      model: data.model,
      vehicleType: data.vehicleType?.toUpperCase() as any,
      maximumCapacity: data.maximumCapacity,
      odometer: data.odometer,
      purchaseCost: data.purchaseCost,
      status: data.status,
      insuranceExpiry: data.insuranceExpiry ? new Date(data.insuranceExpiry) : undefined,
      yearOfManufacture: data.yearOfManufacture,
    });

    return updated;
  },

  async deleteVehicle(id: string) {
    const vehicle = await vehicleRepository.findById(id);
    if (!vehicle) {
      throw new AppError('Vehicle not found', 404, 'NOT_FOUND');
    }
    await vehicleRepository.delete(id);
    return true;
  },
};

export default vehicleService;
