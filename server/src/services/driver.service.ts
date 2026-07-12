import { driverRepository } from '../repositories/index.js';
import { AppError } from '../middlewares/errorHandler.js';
import type { Prisma } from '@prisma/client';
import { buildSearchFilter, parsePagination, parseSort } from '../utils/helpers.js';

export const driverService = {
  async getDrivers(query: any) {
    const { page, limit, skip } = parsePagination(query);
    const { field, order } = parseSort(query, ['id', 'name', 'safetyScore', 'experience'], 'name', 'asc');

    const where: Prisma.DriverWhereInput = {};

    if (query.status && query.status !== 'All') {
      const statusMap: Record<string, Prisma.EnumDriverStatusFilter> = {
        'Active': { equals: 'AVAILABLE' },
        'On Leave': { equals: 'OFF_DUTY' },
        'Suspended': { equals: 'SUSPENDED' },
        'Inactive': { equals: 'OFF_DUTY' }, // map inactive to off duty for db
      };
      if (statusMap[query.status]) {
        where.status = statusMap[query.status];
      }
    }

    if (query.search) {
      where.OR = buildSearchFilter(query.search, ['id', 'name', 'phone', 'licenseNumber']);
    }

    const [items, total] = await Promise.all([
      driverRepository.findAll({
        skip,
        take: limit,
        where,
        orderBy: { [field]: order },
      }),
      driverRepository.count(where),
    ]);

    const formatted = items.map((d) => ({
      id: d.id,
      name: d.name,
      phone: d.phone,
      email: d.email || '',
      licenseNumber: d.licenseNumber,
      licenseCategory: d.licenseCategory,
      licenseExpiry: d.licenseExpiry.toISOString().split('T')[0],
      safetyScore: d.safetyScore,
      status: d.status === 'AVAILABLE' ? 'Active' : d.status === 'ON_TRIP' ? 'Active' : d.status === 'OFF_DUTY' ? 'On Leave' : 'Suspended',
      totalTrips: d.totalTrips,
      onTimeRate: d.onTimeRate,
      rating: d.rating,
      joinedDate: d.joinedDate.toISOString().split('T')[0],
      experience: d.experience,
    }));

    return { formatted, total, page, limit };
  },

  async getDriverById(id: string) {
    const d = await driverRepository.findById(id);
    if (!d) {
      throw new AppError('Driver not found', 404, 'NOT_FOUND');
    }
    return {
      id: d.id,
      name: d.name,
      phone: d.phone,
      email: d.email || '',
      licenseNumber: d.licenseNumber,
      licenseCategory: d.licenseCategory,
      licenseExpiry: d.licenseExpiry.toISOString().split('T')[0],
      safetyScore: d.safetyScore,
      status: d.status === 'AVAILABLE' ? 'Active' : d.status === 'ON_TRIP' ? 'Active' : d.status === 'OFF_DUTY' ? 'On Leave' : 'Suspended',
      totalTrips: d.totalTrips,
      onTimeRate: d.onTimeRate,
      rating: d.rating,
      joinedDate: d.joinedDate.toISOString().split('T')[0],
      experience: d.experience,
      trips: d.trips,
    };
  },

  async createDriver(data: any) {
    const existingPhone = await driverRepository.findByPhone(data.phone);
    if (existingPhone) {
      throw new AppError('Driver with this phone number already exists', 409, 'CONFLICT');
    }

    const existingLicense = await driverRepository.findByLicense(data.licenseNumber);
    if (existingLicense) {
      throw new AppError('Driver with this license number already exists', 409, 'CONFLICT');
    }

    const created = await driverRepository.create({
      name: data.name,
      phone: data.phone,
      email: data.email,
      licenseNumber: data.licenseNumber,
      licenseCategory: data.licenseCategory,
      licenseExpiry: new Date(data.licenseExpiry),
      safetyScore: data.safetyScore,
      status: data.status || 'AVAILABLE',
      experience: data.experience,
    });

    return created;
  },

  async updateDriver(id: string, data: any) {
    const driver = await driverRepository.findById(id);
    if (!driver) {
      throw new AppError('Driver not found', 404, 'NOT_FOUND');
    }

    if (data.phone && data.phone !== driver.phone) {
      const existingPhone = await driverRepository.findByPhone(data.phone);
      if (existingPhone) {
        throw new AppError('Driver with this phone number already exists', 409, 'CONFLICT');
      }
    }

    if (data.licenseNumber && data.licenseNumber !== driver.licenseNumber) {
      const existingLicense = await driverRepository.findByLicense(data.licenseNumber);
      if (existingLicense) {
        throw new AppError('Driver with this license number already exists', 409, 'CONFLICT');
      }
    }

    const updated = await driverRepository.update(id, {
      name: data.name,
      phone: data.phone,
      email: data.email,
      licenseNumber: data.licenseNumber,
      licenseCategory: data.licenseCategory,
      licenseExpiry: data.licenseExpiry ? new Date(data.licenseExpiry) : undefined,
      safetyScore: data.safetyScore,
      status: data.status,
      experience: data.experience,
    });

    return updated;
  },

  async deleteDriver(id: string) {
    const driver = await driverRepository.findById(id);
    if (!driver) {
      throw new AppError('Driver not found', 404, 'NOT_FOUND');
    }
    await driverRepository.delete(id);
    return true;
  },
};

export default driverService;
