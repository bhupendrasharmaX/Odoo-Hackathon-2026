import { tripRepository, vehicleRepository, driverRepository } from '../repositories/index.js';
import { AppError } from '../middlewares/errorHandler.js';
import type { Prisma } from '@prisma/client';
import { parsePagination, parseSort } from '../utils/helpers.js';
import prisma from '../config/database.js';

export const tripService = {
  async getTrips(query: any) {
    const { page, limit, skip } = parsePagination(query);
    const { field, order } = parseSort(query, ['id', 'source', 'destination', 'revenue', 'createdAt'], 'createdAt', 'desc');

    const where: Prisma.TripWhereInput = {};

    if (query.status && query.status !== 'All') {
      const statusMap: Record<string, Prisma.EnumTripStatusFilter> = {
        'Scheduled': { equals: 'DRAFT' },
        'Dispatched': { equals: 'DISPATCHED' },
        'In Transit': { equals: 'IN_TRANSIT' },
        'Completed': { equals: 'COMPLETED' },
        'Cancelled': { equals: 'CANCELLED' },
      };
      if (statusMap[query.status]) {
        where.status = statusMap[query.status];
      }
    }

    if (query.search) {
      where.OR = [
        { id: { contains: query.search, mode: 'insensitive' } },
        { source: { contains: query.search, mode: 'insensitive' } },
        { destination: { contains: query.search, mode: 'insensitive' } },
      ];
    }

    const [items, total] = await Promise.all([
      tripRepository.findAll({
        skip,
        take: limit,
        where,
        orderBy: { [field]: order },
      }),
      tripRepository.count(where),
    ]);

    const formatted = items.map((t) => ({
      id: t.id,
      source: t.source,
      destination: t.destination,
      vehicleId: t.vehicleId,
      vehicleName: t.vehicle.vehicleName,
      driverId: t.driverId,
      driverName: t.driver.name,
      distance: t.plannedDistance,
      cargoType: t.cargoType || 'General',
      cargoWeight: t.cargoWeight,
      revenue: t.revenue,
      fuelUsed: t.fuelUsed || 0,
      fuelCost: t.fuelCost || 0,
      status: t.status === 'DRAFT' ? 'Scheduled' : t.status === 'DISPATCHED' ? 'Dispatched' : t.status === 'IN_TRANSIT' ? 'In Transit' : t.status === 'COMPLETED' ? 'Completed' : 'Cancelled',
      startDate: t.startTime?.toISOString().split('T')[0] || t.createdAt.toISOString().split('T')[0],
      eta: t.eta?.toISOString().split('T')[0] || '',
      completedDate: t.endTime?.toISOString().split('T')[0] || undefined,
    }));

    return { formatted, total, page, limit };
  },

  async getTripById(id: string) {
    const t = await tripRepository.findById(id);
    if (!t) {
      throw new AppError('Trip not found', 404, 'NOT_FOUND');
    }
    return {
      id: t.id,
      source: t.source,
      destination: t.destination,
      vehicleId: t.vehicleId,
      vehicleName: t.vehicle.vehicleName,
      driverId: t.driverId,
      driverName: t.driver.name,
      distance: t.plannedDistance,
      actualDistance: t.actualDistance,
      cargoType: t.cargoType || 'General',
      cargoWeight: t.cargoWeight,
      revenue: t.revenue,
      fuelUsed: t.fuelUsed || 0,
      fuelCost: t.fuelCost || 0,
      status: t.status === 'DRAFT' ? 'Scheduled' : t.status === 'DISPATCHED' ? 'Dispatched' : t.status === 'IN_TRANSIT' ? 'In Transit' : t.status === 'COMPLETED' ? 'Completed' : 'Cancelled',
      startDate: t.startTime?.toISOString().split('T')[0] || t.createdAt.toISOString().split('T')[0],
      eta: t.eta?.toISOString().split('T')[0] || '',
      completedDate: t.endTime?.toISOString().split('T')[0] || undefined,
      fuelLogs: t.fuelLogs,
      expenses: t.expenses,
    };
  },

  async createTrip(data: any) {
    const vehicle = await vehicleRepository.findById(data.vehicleId);
    if (!vehicle) {
      throw new AppError('Vehicle not found', 404, 'NOT_FOUND');
    }

    const driver = await driverRepository.findById(data.driverId);
    if (!driver) {
      throw new AppError('Driver not found', 404, 'NOT_FOUND');
    }

    // ─── Verification of Asset Status & Capacity ───
    if (vehicle.status === 'RETIRED') {
      throw new AppError('Cannot assign a retired vehicle to a trip', 400, 'VEHICLE_NOT_AVAILABLE');
    }
    if (vehicle.status === 'IN_SHOP') {
      throw new AppError('Cannot assign a vehicle in maintenance to a trip', 400, 'VEHICLE_NOT_AVAILABLE');
    }
    if (vehicle.status === 'ON_TRIP') {
      throw new AppError('Vehicle is already on another active trip', 400, 'VEHICLE_NOT_AVAILABLE');
    }

    if (driver.status === 'SUSPENDED') {
      throw new AppError('Cannot assign a suspended driver to a trip', 400, 'DRIVER_NOT_AVAILABLE');
    }
    if (driver.status === 'ON_TRIP') {
      throw new AppError('Driver is already assigned to another active trip', 400, 'DRIVER_NOT_AVAILABLE');
    }

    if (new Date(driver.licenseExpiry) < new Date()) {
      throw new AppError("Cannot assign driver with expired license to a trip", 400, 'DRIVER_LICENSE_EXPIRED');
    }

    if (data.cargoWeight > vehicle.maximumCapacity) {
      throw new AppError(`Cargo weight (${data.cargoWeight} Tons) exceeds vehicle maximum capacity (${vehicle.maximumCapacity} Tons)`, 400, 'CARGO_EXCEEDS_CAPACITY');
    }

    // Create the trip in DRAFT (Scheduled) status
    const created = await tripRepository.create({
      vehicle: { connect: { id: vehicle.id } },
      driver: { connect: { id: driver.id } },
      source: data.source,
      destination: data.destination,
      cargoType: data.cargoType,
      cargoWeight: data.cargoWeight,
      plannedDistance: data.plannedDistance,
      revenue: data.revenue,
      status: 'DRAFT',
      eta: data.eta ? new Date(data.eta) : null,
      startTime: data.startTime ? new Date(data.startTime) : null,
    });

    return created;
  },

  async dispatchTrip(id: string) {
    return prisma.$transaction(async (tx) => {
      const trip = await tx.trip.findUnique({
        where: { id },
        include: { vehicle: true, driver: true },
      });

      if (!trip) {
        throw new AppError('Trip not found', 404, 'NOT_FOUND');
      }

      if (trip.status !== 'DRAFT') {
        throw new AppError(`Trip cannot be dispatched in status ${trip.status}`, 400, 'TRIP_CANNOT_DISPATCH');
      }

      // Re-verify eligibility under transaction context
      if (trip.vehicle.status === 'ON_TRIP' || trip.vehicle.status === 'RETIRED' || trip.vehicle.status === 'IN_SHOP') {
        throw new AppError('Vehicle is not available for dispatch', 400, 'VEHICLE_NOT_AVAILABLE');
      }
      if (trip.driver.status === 'ON_TRIP' || trip.driver.status === 'SUSPENDED') {
        throw new AppError('Driver is not available for dispatch', 400, 'DRIVER_NOT_AVAILABLE');
      }

      // Update statuses
      await tx.vehicle.update({
        where: { id: trip.vehicleId },
        data: { status: 'ON_TRIP' },
      });

      await tx.driver.update({
        where: { id: trip.driverId },
        data: { status: 'ON_TRIP' },
      });

      const updatedTrip = await tx.trip.update({
        where: { id },
        data: { status: 'DISPATCHED', startTime: new Date() },
        include: { vehicle: true, driver: true },
      });

      return updatedTrip;
    });
  },

  async completeTrip(id: string, completionData: { actualDistance: number; fuelUsed: number; fuelCost?: number }) {
    return prisma.$transaction(async (tx) => {
      const trip = await tx.trip.findUnique({
        where: { id },
        include: { vehicle: true, driver: true },
      });

      if (!trip) {
        throw new AppError('Trip not found', 404, 'NOT_FOUND');
      }

      if (trip.status !== 'DISPATCHED' && trip.status !== 'IN_TRANSIT') {
        throw new AppError('Only active trips can be completed', 400, 'BAD_REQUEST');
      }

      // Release assets
      await tx.vehicle.update({
        where: { id: trip.vehicleId },
        data: {
          status: 'AVAILABLE',
          odometer: { increment: completionData.actualDistance },
        },
      });

      await tx.driver.update({
        where: { id: trip.driverId },
        data: {
          status: 'AVAILABLE',
          totalTrips: { increment: 1 },
        },
      });

      const updatedTrip = await tx.trip.update({
        where: { id },
        data: {
          status: 'COMPLETED',
          actualDistance: completionData.actualDistance,
          fuelUsed: completionData.fuelUsed,
          fuelCost: completionData.fuelCost || (completionData.fuelUsed * 90), // default INR 90/L
          endTime: new Date(),
        },
        include: { vehicle: true, driver: true },
      });

      return updatedTrip;
    });
  },

  async cancelTrip(id: string) {
    return prisma.$transaction(async (tx) => {
      const trip = await tx.trip.findUnique({
        where: { id },
      });

      if (!trip) {
        throw new AppError('Trip not found', 404, 'NOT_FOUND');
      }

      if (trip.status === 'COMPLETED' || trip.status === 'CANCELLED') {
        throw new AppError(`Cannot cancel a trip that is already ${trip.status}`, 400, 'BAD_REQUEST');
      }

      // Restore assets to AVAILABLE if they were dispatched
      if (trip.status === 'DISPATCHED' || trip.status === 'IN_TRANSIT') {
        await tx.vehicle.update({
          where: { id: trip.vehicleId },
          data: { status: 'AVAILABLE' },
        });

        await tx.driver.update({
          where: { id: trip.driverId },
          data: { status: 'AVAILABLE' },
        });
      }

      const updatedTrip = await tx.trip.update({
        where: { id },
        data: { status: 'CANCELLED', endTime: new Date() },
      });

      return updatedTrip;
    });
  },
};

export default tripService;
