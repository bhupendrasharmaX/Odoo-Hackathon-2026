// ─── Vehicle Types ───
export type VehicleStatus = 'Active' | 'Available' | 'In Maintenance' | 'Retired';
export type VehicleType = 'Truck' | 'Van' | 'Bus' | 'Car' | 'Trailer';

export interface Vehicle {
  id: string;
  registrationNumber: string;
  name: string;
  model: string;
  type: VehicleType;
  capacity: number;
  purchaseCost: number;
  odometer: number;
  status: VehicleStatus;
  image?: string;
  insuranceExpiry: string;
  yearOfManufacture: number;
}

// ─── Driver Types ───
export type DriverStatus = 'Active' | 'On Leave' | 'Suspended' | 'Inactive';

export interface Driver {
  id: string;
  name: string;
  phone: string;
  email: string;
  licenseNumber: string;
  licenseCategory: string;
  licenseExpiry: string;
  safetyScore: number;
  status: DriverStatus;
  avatar?: string;
  totalTrips: number;
  onTimeRate: number;
  rating: number;
  joinedDate: string;
  experience: number;
}

// ─── Trip Types ───
export type TripStatus = 'Scheduled' | 'Dispatched' | 'In Transit' | 'Delivered' | 'Completed' | 'Cancelled';

export interface Trip {
  id: string;
  source: string;
  destination: string;
  vehicleId: string;
  vehicleName: string;
  driverId: string;
  driverName: string;
  distance: number;
  cargoType: string;
  cargoWeight: number;
  revenue: number;
  fuelUsed: number;
  fuelCost: number;
  status: TripStatus;
  startDate: string;
  eta: string;
  completedDate?: string;
}

// ─── Maintenance Types ───
export type MaintenanceStatus = 'Scheduled' | 'In Progress' | 'Completed' | 'Overdue';
export type MaintenancePriority = 'Low' | 'Medium' | 'High' | 'Urgent';

export interface Maintenance {
  id: string;
  vehicleId: string;
  vehicleName: string;
  type: string;
  description: string;
  priority: MaintenancePriority;
  status: MaintenanceStatus;
  scheduledDate: string;
  estimatedCost: number;
  actualCost?: number;
  mechanic: string;
}

// ─── Fuel Types ───
export type FuelType = 'Diesel' | 'Petrol' | 'CNG' | 'Electric';

export interface FuelLog {
  id: string;
  vehicleId: string;
  vehicleName: string;
  driverName: string;
  date: string;
  fuelType: FuelType;
  quantity: number;
  costPerLiter: number;
  totalCost: number;
  odometer: number;
  station: string;
}

// ─── Expense Types ───
export type ExpenseCategory = 'Fuel' | 'Maintenance' | 'Insurance' | 'Toll' | 'Driver Allowance' | 'Parking' | 'Fines' | 'Other';
export type ExpenseStatus = 'Approved' | 'Pending' | 'Rejected';

export interface Expense {
  id: string;
  date: string;
  category: ExpenseCategory;
  description: string;
  vehicleId?: string;
  vehicleName?: string;
  amount: number;
  status: ExpenseStatus;
}

// ─── Dashboard Types ───
export interface KPICard {
  label: string;
  value: string | number;
  change?: string;
  changeType?: 'positive' | 'negative' | 'neutral';
  icon: string;
}
