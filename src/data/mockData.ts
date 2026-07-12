import type { Vehicle, Driver, Trip, Maintenance, FuelLog, Expense } from '../types';

export const vehicles: Vehicle[] = [
  { id: 'V-104', registrationNumber: 'MH-01-AB-1234', name: 'Tata Prima 4928', model: 'Prima 4928.S', type: 'Truck', capacity: 28, purchaseCost: 3200000, odometer: 89420, status: 'Active', insuranceExpiry: '2027-03-15', yearOfManufacture: 2022 },
  { id: 'V-092', registrationNumber: 'MH-02-CD-5678', name: 'Ashok Leyland 3520', model: 'AVTR 3520', type: 'Truck', capacity: 35, purchaseCost: 3800000, odometer: 124500, status: 'Available', insuranceExpiry: '2026-11-20', yearOfManufacture: 2021 },
  { id: 'V-215', registrationNumber: 'MH-04-EF-9012', name: 'Eicher Pro 3019', model: 'Pro 3019', type: 'Truck', capacity: 19, purchaseCost: 2100000, odometer: 56780, status: 'In Maintenance', insuranceExpiry: '2027-01-10', yearOfManufacture: 2023 },
  { id: 'V-204', registrationNumber: 'MH-03-GH-3456', name: 'Tata Prima 5530', model: 'Prima 5530.S', type: 'Truck', capacity: 40, purchaseCost: 4200000, odometer: 67890, status: 'Active', insuranceExpiry: '2027-06-30', yearOfManufacture: 2023 },
  { id: 'V-118', registrationNumber: 'DL-01-JK-7890', name: 'BharatBenz 1617R', model: '1617R', type: 'Truck', capacity: 16, purchaseCost: 2600000, odometer: 98760, status: 'Active', insuranceExpiry: '2026-09-25', yearOfManufacture: 2022 },
  { id: 'V-301', registrationNumber: 'GJ-05-LM-2345', name: 'Mahindra Blazo X 35', model: 'Blazo X 35', type: 'Truck', capacity: 35, purchaseCost: 3500000, odometer: 45230, status: 'Available', insuranceExpiry: '2027-08-12', yearOfManufacture: 2024 },
  { id: 'V-155', registrationNumber: 'KA-01-NP-6789', name: 'Tata Ace Gold', model: 'Ace Gold Diesel', type: 'Van', capacity: 1, purchaseCost: 450000, odometer: 32100, status: 'Active', insuranceExpiry: '2026-12-05', yearOfManufacture: 2023 },
  { id: 'V-089', registrationNumber: 'TN-07-QR-0123', name: 'Force Traveller 3700', model: 'Traveller 3700', type: 'Bus', capacity: 26, purchaseCost: 1800000, odometer: 78900, status: 'Active', insuranceExpiry: '2027-02-18', yearOfManufacture: 2022 },
  { id: 'V-267', registrationNumber: 'RJ-14-ST-4567', name: 'Eicher Pro 2049', model: 'Pro 2049', type: 'Truck', capacity: 14, purchaseCost: 1700000, odometer: 112340, status: 'Retired', insuranceExpiry: '2025-07-20', yearOfManufacture: 2019 },
  { id: 'V-340', registrationNumber: 'UP-32-UV-8901', name: 'Ashok Leyland Dost+', model: 'Dost+ Strong', type: 'Van', capacity: 2, purchaseCost: 680000, odometer: 41560, status: 'Active', insuranceExpiry: '2027-04-22', yearOfManufacture: 2024 },
];

export const drivers: Driver[] = [
  { id: 'DRV-1042', name: 'Rajesh Kumar', phone: '+91 98765 43210', email: 'rajesh.kumar@transitops.com', licenseNumber: 'DL-1420110012345', licenseCategory: 'Class A', licenseExpiry: '2026-12-15', safetyScore: 92, status: 'Active', totalTrips: 847, onTimeRate: 96.2, rating: 4.8, joinedDate: '2021-03-15', experience: 12 },
  { id: 'DRV-1108', name: 'Amit Verma', phone: '+91 87654 32109', email: 'amit.verma@transitops.com', licenseNumber: 'HR-0620130067890', licenseCategory: 'Class A', licenseExpiry: '2027-06-20', safetyScore: 88, status: 'Active', totalTrips: 623, onTimeRate: 94.5, rating: 4.6, joinedDate: '2022-01-10', experience: 8 },
  { id: 'DRV-1205', name: 'Priya Singh', phone: '+91 76543 21098', email: 'priya.singh@transitops.com', licenseNumber: 'MH-0320150034567', licenseCategory: 'Class B', licenseExpiry: '2027-09-30', safetyScore: 95, status: 'Active', totalTrips: 412, onTimeRate: 98.1, rating: 4.9, joinedDate: '2022-08-01', experience: 6 },
  { id: 'DRV-1089', name: 'Suresh Patel', phone: '+91 65432 10987', email: 'suresh.patel@transitops.com', licenseNumber: 'GJ-0120120056789', licenseCategory: 'Class A', licenseExpiry: '2026-04-10', safetyScore: 78, status: 'On Leave', totalTrips: 534, onTimeRate: 91.3, rating: 4.3, joinedDate: '2021-11-20', experience: 10 },
  { id: 'DRV-1156', name: 'Deepak Sharma', phone: '+91 54321 09876', email: 'deepak.sharma@transitops.com', licenseNumber: 'RJ-1420140023456', licenseCategory: 'Class A', licenseExpiry: '2027-11-05', safetyScore: 85, status: 'Active', totalTrips: 389, onTimeRate: 93.7, rating: 4.5, joinedDate: '2023-02-15', experience: 7 },
  { id: 'DRV-1312', name: 'Kavita Nair', phone: '+91 43210 98765', email: 'kavita.nair@transitops.com', licenseNumber: 'KA-0120160045678', licenseCategory: 'Class B', licenseExpiry: '2028-01-20', safetyScore: 91, status: 'Active', totalTrips: 278, onTimeRate: 97.4, rating: 4.7, joinedDate: '2023-06-01', experience: 5 },
  { id: 'DRV-1078', name: 'Ravi Tiwari', phone: '+91 32109 87654', email: 'ravi.tiwari@transitops.com', licenseNumber: 'UP-3220110078901', licenseCategory: 'Class A', licenseExpiry: '2026-08-15', safetyScore: 72, status: 'Suspended', totalTrips: 156, onTimeRate: 87.2, rating: 3.9, joinedDate: '2024-01-10', experience: 15 },
  { id: 'DRV-1234', name: 'Meera Joshi', phone: '+91 21098 76543', email: 'meera.joshi@transitops.com', licenseNumber: 'TN-0720170012345', licenseCategory: 'Class C', licenseExpiry: '2027-03-25', safetyScore: 89, status: 'Active', totalTrips: 198, onTimeRate: 95.8, rating: 4.6, joinedDate: '2023-09-15', experience: 4 },
];

export const trips: Trip[] = [
  { id: 'TR-8829', source: 'Mumbai, Maharashtra', destination: 'Pune, Maharashtra', vehicleId: 'V-204', vehicleName: 'Tata Prima 5530', driverId: 'DRV-1042', driverName: 'Rajesh Kumar', distance: 148, cargoType: 'Electronics', cargoWeight: 8.5, revenue: 24500, fuelUsed: 42, fuelCost: 4200, status: 'In Transit', startDate: '2026-07-12', eta: '2026-07-12' },
  { id: 'TR-8801', source: 'Delhi, NCR', destination: 'Jaipur, Rajasthan', vehicleId: 'V-104', vehicleName: 'Tata Prima 4928', driverId: 'DRV-1108', driverName: 'Amit Verma', distance: 281, cargoType: 'Textiles', cargoWeight: 15.2, revenue: 38000, fuelUsed: 78, fuelCost: 7800, status: 'Completed', startDate: '2026-07-10', eta: '2026-07-10', completedDate: '2026-07-10' },
  { id: 'TR-8795', source: 'Ahmedabad, Gujarat', destination: 'Surat, Gujarat', vehicleId: 'V-301', vehicleName: 'Mahindra Blazo X 35', driverId: 'DRV-1205', driverName: 'Priya Singh', distance: 265, cargoType: 'Chemicals', cargoWeight: 22.0, revenue: 42000, fuelUsed: 85, fuelCost: 8500, status: 'Completed', startDate: '2026-07-09', eta: '2026-07-09', completedDate: '2026-07-09' },
  { id: 'TR-8830', source: 'Bangalore, Karnataka', destination: 'Chennai, Tamil Nadu', vehicleId: 'V-118', vehicleName: 'BharatBenz 1617R', driverId: 'DRV-1156', driverName: 'Deepak Sharma', distance: 346, cargoType: 'Auto Parts', cargoWeight: 12.8, revenue: 52000, fuelUsed: 95, fuelCost: 9500, status: 'Scheduled', startDate: '2026-07-13', eta: '2026-07-13' },
  { id: 'TR-8812', source: 'Kolkata, West Bengal', destination: 'Patna, Bihar', vehicleId: 'V-092', vehicleName: 'Ashok Leyland 3520', driverId: 'DRV-1089', driverName: 'Suresh Patel', distance: 590, cargoType: 'FMCG', cargoWeight: 28.0, revenue: 68000, fuelUsed: 165, fuelCost: 16500, status: 'Completed', startDate: '2026-07-08', eta: '2026-07-09', completedDate: '2026-07-09' },
  { id: 'TR-8835', source: 'Hyderabad, Telangana', destination: 'Vizag, Andhra Pradesh', vehicleId: 'V-340', vehicleName: 'Ashok Leyland Dost+', driverId: 'DRV-1312', driverName: 'Kavita Nair', distance: 625, cargoType: 'Pharmaceuticals', cargoWeight: 1.5, revenue: 18000, fuelUsed: 32, fuelCost: 3200, status: 'Dispatched', startDate: '2026-07-12', eta: '2026-07-13' },
  { id: 'TR-8820', source: 'Pune, Maharashtra', destination: 'Nagpur, Maharashtra', vehicleId: 'V-155', vehicleName: 'Tata Ace Gold', driverId: 'DRV-1234', driverName: 'Meera Joshi', distance: 714, cargoType: 'Food Products', cargoWeight: 0.8, revenue: 12000, fuelUsed: 28, fuelCost: 2800, status: 'Cancelled', startDate: '2026-07-11', eta: '2026-07-12' },
  { id: 'TR-8840', source: 'Lucknow, UP', destination: 'Varanasi, UP', vehicleId: 'V-089', vehicleName: 'Force Traveller 3700', driverId: 'DRV-1042', driverName: 'Rajesh Kumar', distance: 320, cargoType: 'Passengers', cargoWeight: 0, revenue: 15000, fuelUsed: 45, fuelCost: 4500, status: 'Scheduled', startDate: '2026-07-14', eta: '2026-07-14' },
];

export const maintenanceRecords: Maintenance[] = [
  { id: 'MNT-501', vehicleId: 'V-104', vehicleName: 'Tata Prima 4928', type: 'Engine Diagnostic', description: 'Check engine light on, diagnostic required', priority: 'Urgent', status: 'Scheduled', scheduledDate: '2026-07-12', estimatedCost: 15000, mechanic: 'Suresh Patel' },
  { id: 'MNT-502', vehicleId: 'V-092', vehicleName: 'Ashok Leyland 3520', type: 'Routine Check', description: 'Regular 50,000 km service', priority: 'Medium', status: 'Scheduled', scheduledDate: '2026-07-13', estimatedCost: 8500, mechanic: 'Amit Sharma' },
  { id: 'MNT-503', vehicleId: 'V-215', vehicleName: 'Eicher Pro 3019', type: 'Brake Pad Replacement', description: 'Front and rear brake pad replacement', priority: 'High', status: 'In Progress', scheduledDate: '2026-07-11', estimatedCost: 12000, actualCost: 11500, mechanic: 'Priya Nair' },
  { id: 'MNT-504', vehicleId: 'V-204', vehicleName: 'Tata Prima 5530', type: 'Oil Change', description: 'Regular oil change and filter replacement', priority: 'Low', status: 'Completed', scheduledDate: '2026-07-08', estimatedCost: 4500, actualCost: 4200, mechanic: 'Suresh Patel' },
  { id: 'MNT-505', vehicleId: 'V-118', vehicleName: 'BharatBenz 1617R', type: 'Tire Replacement', description: 'Replace all 6 tires', priority: 'High', status: 'Scheduled', scheduledDate: '2026-07-15', estimatedCost: 72000, mechanic: 'Amit Sharma' },
  { id: 'MNT-506', vehicleId: 'V-155', vehicleName: 'Tata Ace Gold', type: 'Full Service', description: 'Annual comprehensive service', priority: 'Medium', status: 'Overdue', scheduledDate: '2026-07-05', estimatedCost: 6000, mechanic: 'Priya Nair' },
];

export const fuelLogs: FuelLog[] = [
  { id: 'FL-1001', vehicleId: 'V-104', vehicleName: 'Tata Prima 4928', driverName: 'Amit Verma', date: '2026-07-12', fuelType: 'Diesel', quantity: 120, costPerLiter: 89.50, totalCost: 10740, odometer: 89420, station: 'Indian Oil, Andheri' },
  { id: 'FL-1002', vehicleId: 'V-204', vehicleName: 'Tata Prima 5530', driverName: 'Rajesh Kumar', date: '2026-07-12', fuelType: 'Diesel', quantity: 150, costPerLiter: 89.50, totalCost: 13425, odometer: 67890, station: 'HP Petrol, Thane' },
  { id: 'FL-1003', vehicleId: 'V-092', vehicleName: 'Ashok Leyland 3520', driverName: 'Suresh Patel', date: '2026-07-11', fuelType: 'Diesel', quantity: 200, costPerLiter: 90.20, totalCost: 18040, odometer: 124500, station: 'BPCL, Pune' },
  { id: 'FL-1004', vehicleId: 'V-155', vehicleName: 'Tata Ace Gold', driverName: 'Meera Joshi', date: '2026-07-11', fuelType: 'Diesel', quantity: 30, costPerLiter: 89.50, totalCost: 2685, odometer: 32100, station: 'Indian Oil, Bandra' },
  { id: 'FL-1005', vehicleId: 'V-118', vehicleName: 'BharatBenz 1617R', driverName: 'Deepak Sharma', date: '2026-07-10', fuelType: 'Diesel', quantity: 100, costPerLiter: 91.00, totalCost: 9100, odometer: 98760, station: 'Shell, Connaught Place' },
  { id: 'FL-1006', vehicleId: 'V-301', vehicleName: 'Mahindra Blazo X 35', driverName: 'Priya Singh', date: '2026-07-10', fuelType: 'Diesel', quantity: 180, costPerLiter: 88.75, totalCost: 15975, odometer: 45230, station: 'Reliance, Ahmedabad' },
  { id: 'FL-1007', vehicleId: 'V-340', vehicleName: 'Ashok Leyland Dost+', driverName: 'Kavita Nair', date: '2026-07-09', fuelType: 'Diesel', quantity: 40, costPerLiter: 89.50, totalCost: 3580, odometer: 41560, station: 'BPCL, Hyderabad' },
  { id: 'FL-1008', vehicleId: 'V-089', vehicleName: 'Force Traveller 3700', driverName: 'Rajesh Kumar', date: '2026-07-09', fuelType: 'Diesel', quantity: 80, costPerLiter: 90.00, totalCost: 7200, odometer: 78900, station: 'Indian Oil, Chennai' },
];

export const expenses: Expense[] = [
  { id: 'EXP-2001', date: '2026-07-12', category: 'Fuel', description: 'Diesel refill for trip TR-8829', vehicleId: 'V-204', vehicleName: 'Tata Prima 5530', amount: 4200, status: 'Approved' },
  { id: 'EXP-2002', date: '2026-07-12', category: 'Toll', description: 'Mumbai-Pune Expressway toll', vehicleId: 'V-204', vehicleName: 'Tata Prima 5530', amount: 850, status: 'Approved' },
  { id: 'EXP-2003', date: '2026-07-12', category: 'Driver Allowance', description: 'Daily allowance - Rajesh Kumar', amount: 500, status: 'Approved' },
  { id: 'EXP-2004', date: '2026-07-11', category: 'Maintenance', description: 'Brake pad replacement - V-215', vehicleId: 'V-215', vehicleName: 'Eicher Pro 3019', amount: 11500, status: 'Approved' },
  { id: 'EXP-2005', date: '2026-07-11', category: 'Insurance', description: 'Quarterly insurance premium - V-301', vehicleId: 'V-301', vehicleName: 'Mahindra Blazo X 35', amount: 28000, status: 'Pending' },
  { id: 'EXP-2006', date: '2026-07-10', category: 'Parking', description: 'Warehouse parking fee', vehicleId: 'V-118', vehicleName: 'BharatBenz 1617R', amount: 200, status: 'Approved' },
  { id: 'EXP-2007', date: '2026-07-10', category: 'Fines', description: 'Overloading fine - highway checkpoint', vehicleId: 'V-092', vehicleName: 'Ashok Leyland 3520', amount: 5000, status: 'Rejected' },
  { id: 'EXP-2008', date: '2026-07-09', category: 'Toll', description: 'NH-48 toll charges', vehicleId: 'V-301', vehicleName: 'Mahindra Blazo X 35', amount: 1200, status: 'Approved' },
  { id: 'EXP-2009', date: '2026-07-09', category: 'Fuel', description: 'CNG refill for city delivery', vehicleId: 'V-155', vehicleName: 'Tata Ace Gold', amount: 2685, status: 'Pending' },
  { id: 'EXP-2010', date: '2026-07-08', category: 'Other', description: 'Vehicle washing and cleaning', vehicleId: 'V-204', vehicleName: 'Tata Prima 5530', amount: 800, status: 'Approved' },
];

export const dashboardStats = {
  activeVehicles: 248,
  availableVehicles: 86,
  inMaintenance: 14,
  driversOnDuty: 310,
  activeTrips: 112,
  pendingTrips: 45,
  fleetUtilization: 82,
  monthlyRevenue: 12400000,
  fuelCost: 342000,
  maintenanceCost: 85000,
};

export const chartData = {
  revenueVsExpense: [
    { month: 'Jan', revenue: 980000, expense: 420000 },
    { month: 'Feb', revenue: 1050000, expense: 380000 },
    { month: 'Mar', revenue: 1120000, expense: 450000 },
    { month: 'Apr', revenue: 1080000, expense: 410000 },
    { month: 'May', revenue: 1200000, expense: 480000 },
    { month: 'Jun', revenue: 1150000, expense: 440000 },
    { month: 'Jul', revenue: 1240000, expense: 427000 },
  ],
  fuelTrend: [
    { month: 'Jan', diesel: 280000, petrol: 45000, cng: 17000 },
    { month: 'Feb', diesel: 260000, petrol: 42000, cng: 18000 },
    { month: 'Mar', diesel: 310000, petrol: 48000, cng: 19000 },
    { month: 'Apr', diesel: 295000, petrol: 44000, cng: 21000 },
    { month: 'May', diesel: 320000, petrol: 50000, cng: 22000 },
    { month: 'Jun', diesel: 305000, petrol: 46000, cng: 20000 },
    { month: 'Jul', diesel: 342000, petrol: 51000, cng: 23000 },
  ],
  tripsPerMonth: [
    { month: 'Jan', completed: 142, cancelled: 8 },
    { month: 'Feb', completed: 158, cancelled: 5 },
    { month: 'Mar', completed: 165, cancelled: 12 },
    { month: 'Apr', completed: 149, cancelled: 7 },
    { month: 'May', completed: 178, cancelled: 9 },
    { month: 'Jun', completed: 172, cancelled: 6 },
    { month: 'Jul', completed: 112, cancelled: 3 },
  ],
  vehicleStatus: [
    { name: 'Active', value: 248, color: '#004bca' },
    { name: 'Available', value: 86, color: '#006c49' },
    { name: 'Maintenance', value: 14, color: '#ba1a1a' },
  ],
};
