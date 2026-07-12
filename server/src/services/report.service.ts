import prisma from '../config/database.js';

export const reportService = {
  async getDashboardStats() {
    const now = new Date();
    const startOfCurrentMonth = new Date(now.getFullYear(), now.getMonth(), 1);

    // Get counts
    const totalVehicles = await prisma.vehicle.count();
    const activeVehicles = await prisma.vehicle.count({ where: { status: 'ON_TRIP' } });
    const availableVehicles = await prisma.vehicle.count({ where: { status: 'AVAILABLE' } });
    const inMaintenance = await prisma.vehicle.count({ where: { status: 'IN_SHOP' } });

    const activeTrips = await prisma.trip.count({ where: { status: 'DISPATCHED' } });
    const pendingTrips = await prisma.trip.count({ where: { status: 'DRAFT' } });
    
    // Drivers
    const driversOnDuty = await prisma.driver.count({ where: { status: 'ON_TRIP' } });

    // Utilization
    const fleetUtilization = totalVehicles > 0 ? Math.round((activeVehicles / totalVehicles) * 100) : 0;

    // Financial sums for current month
    const revenueAgg = await prisma.trip.aggregate({
      where: {
        status: 'COMPLETED',
        endTime: { gte: startOfCurrentMonth },
      },
      _sum: { revenue: true },
    });

    const fuelAgg = await prisma.fuelLog.aggregate({
      where: { date: { gte: startOfCurrentMonth } },
      _sum: { cost: true },
    });

    const maintenanceAgg = await prisma.maintenanceLog.aggregate({
      where: {
        status: 'COMPLETED',
        completedDate: { gte: startOfCurrentMonth },
      },
      _sum: { cost: true },
    });

    const monthlyRevenue = revenueAgg._sum.revenue || 0;
    const fuelCost = fuelAgg._sum.cost || 0;
    const maintenanceCost = maintenanceAgg._sum.cost || 0;

    return {
      activeVehicles,
      availableVehicles,
      inMaintenance,
      driversOnDuty,
      activeTrips,
      pendingTrips,
      fleetUtilization,
      monthlyRevenue,
      fuelCost,
      maintenanceCost,
    };
  },

  async getAnalyticsData() {
    // Generate data for past 7 months
    const revenueVsExpense = [];
    const now = new Date();

    for (let i = 6; i >= 0; i--) {
      const targetMonth = new Date(now.getFullYear(), now.getMonth() - i, 1);
      const start = new Date(targetMonth.getFullYear(), targetMonth.getMonth(), 1);
      const end = new Date(targetMonth.getFullYear(), targetMonth.getMonth() + 1, 0, 23, 59, 59);

      // Revenue
      const rev = await prisma.trip.aggregate({
        where: {
          status: 'COMPLETED',
          endTime: { gte: start, lte: end },
        },
        _sum: { revenue: true },
      });

      // Fuel Expenses
      const fuel = await prisma.fuelLog.aggregate({
        where: { date: { gte: start, lte: end } },
        _sum: { cost: true },
      });

      // Maintenance
      const maint = await prisma.maintenanceLog.aggregate({
        where: {
          status: 'COMPLETED',
          completedDate: { gte: start, lte: end },
        },
        _sum: { cost: true },
      });

      // Other Expenses
      const exp = await prisma.expense.aggregate({
        where: {
          status: 'APPROVED',
          date: { gte: start, lte: end },
          expenseType: { notIn: ['Fuel', 'Maintenance'] },
        },
        _sum: { amount: true },
      });

      const monthName = start.toLocaleString('default', { month: 'short' });
      const totalRevenue = rev._sum.revenue || 0;
      const totalExpenses = (fuel._sum.cost || 0) + (maint._sum.cost || 0) + (exp._sum.amount || 0);

      revenueVsExpense.push({
        month: monthName,
        revenue: totalRevenue,
        expense: totalExpenses,
      });
    }

    // Generate vehicle status chart data
    const active = await prisma.vehicle.count({ where: { status: 'ON_TRIP' } });
    const available = await prisma.vehicle.count({ where: { status: 'AVAILABLE' } });
    const maintenance = await prisma.vehicle.count({ where: { status: 'IN_SHOP' } });

    const vehicleStatus = [
      { name: 'Active', value: active, color: '#004bca' },
      { name: 'Available', value: available, color: '#006c49' },
      { name: 'Maintenance', value: maintenance, color: '#ba1a1a' },
    ];

    return {
      revenueVsExpense,
      vehicleStatus,
    };
  },

  async getFleetReport() {
    const vehicles = await prisma.vehicle.findMany({
      include: {
        trips: {
          where: { status: 'COMPLETED' },
        },
        maintenanceLogs: {
          where: { status: 'COMPLETED' },
        },
        fuelLogs: true,
      },
    });

    return vehicles.map((v) => {
      const totalDistance = v.trips.reduce((sum, t) => sum + (t.actualDistance || 0), 0);
      const totalFuelUsed = v.trips.reduce((sum, t) => sum + (t.fuelUsed || 0), 0);
      const totalRevenue = v.trips.reduce((sum, t) => sum + t.revenue, 0);

      const totalFuelCost = v.fuelLogs.reduce((sum, f) => sum + f.cost, 0);
      const totalMaintCost = v.maintenanceLogs.reduce((sum, m) => sum + m.cost, 0);

      // Calculations
      const fuelEfficiency = totalFuelUsed > 0 ? Number((totalDistance / totalFuelUsed).toFixed(2)) : 0;
      const operationalCost = totalFuelCost + totalMaintCost;
      const roi = v.purchaseCost > 0 ? Number(((totalRevenue - operationalCost) / v.purchaseCost).toFixed(2)) : 0;

      return {
        id: v.id,
        registrationNumber: v.registrationNumber,
        vehicleName: v.vehicleName,
        type: v.vehicleType,
        totalDistance,
        fuelEfficiency,
        operationalCost,
        roi,
        status: v.status,
      };
    });
  },

  async generateCSVReport(reportData: any[]): Promise<string> {
    if (reportData.length === 0) return '';
    const headers = Object.keys(reportData[0]).join(',');
    const rows = reportData.map((row) =>
      Object.values(row)
        .map((val) => `"${String(val).replace(/"/g, '""')}"`)
        .join(',')
    );
    return [headers, ...rows].join('\n');
  },
};

export default reportService;
