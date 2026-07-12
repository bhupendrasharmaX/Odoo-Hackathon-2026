// ─── Role Permission Constants ───

export const ROLES = {
  FLEET_MANAGER: 'Fleet Manager',
  DISPATCHER: 'Dispatcher',
  SAFETY_OFFICER: 'Safety Officer',
  FINANCIAL_ANALYST: 'Financial Analyst',
} as const;

export type RoleName = (typeof ROLES)[keyof typeof ROLES];

export const PERMISSIONS = {
  // Vehicle permissions
  VEHICLE_CREATE: 'vehicle:create',
  VEHICLE_READ: 'vehicle:read',
  VEHICLE_UPDATE: 'vehicle:update',
  VEHICLE_DELETE: 'vehicle:delete',

  // Maintenance permissions
  MAINTENANCE_CREATE: 'maintenance:create',
  MAINTENANCE_READ: 'maintenance:read',
  MAINTENANCE_UPDATE: 'maintenance:update',
  MAINTENANCE_DELETE: 'maintenance:delete',

  // Trip permissions
  TRIP_CREATE: 'trip:create',
  TRIP_READ: 'trip:read',
  TRIP_UPDATE: 'trip:update',
  TRIP_DELETE: 'trip:delete',
  TRIP_DISPATCH: 'trip:dispatch',
  TRIP_COMPLETE: 'trip:complete',
  TRIP_CANCEL: 'trip:cancel',

  // Driver permissions
  DRIVER_CREATE: 'driver:create',
  DRIVER_READ: 'driver:read',
  DRIVER_UPDATE: 'driver:update',
  DRIVER_DELETE: 'driver:delete',
  DRIVER_MONITOR: 'driver:monitor',

  // Financial permissions
  FUEL_CREATE: 'fuel:create',
  FUEL_READ: 'fuel:read',
  FUEL_UPDATE: 'fuel:update',
  FUEL_DELETE: 'fuel:delete',

  EXPENSE_CREATE: 'expense:create',
  EXPENSE_READ: 'expense:read',
  EXPENSE_UPDATE: 'expense:update',
  EXPENSE_DELETE: 'expense:delete',

  // Reports
  REPORT_VIEW: 'report:view',
  REPORT_EXPORT: 'report:export',
} as const;

export type Permission = (typeof PERMISSIONS)[keyof typeof PERMISSIONS];

export const ROLE_PERMISSIONS: Record<RoleName, Permission[]> = {
  [ROLES.FLEET_MANAGER]: [
    PERMISSIONS.VEHICLE_CREATE,
    PERMISSIONS.VEHICLE_READ,
    PERMISSIONS.VEHICLE_UPDATE,
    PERMISSIONS.VEHICLE_DELETE,
    PERMISSIONS.MAINTENANCE_CREATE,
    PERMISSIONS.MAINTENANCE_READ,
    PERMISSIONS.MAINTENANCE_UPDATE,
    PERMISSIONS.MAINTENANCE_DELETE,
    PERMISSIONS.TRIP_READ,
    PERMISSIONS.DRIVER_READ,
    PERMISSIONS.FUEL_READ,
    PERMISSIONS.EXPENSE_READ,
    PERMISSIONS.REPORT_VIEW,
    PERMISSIONS.REPORT_EXPORT,
  ],
  [ROLES.DISPATCHER]: [
    PERMISSIONS.TRIP_CREATE,
    PERMISSIONS.TRIP_READ,
    PERMISSIONS.TRIP_UPDATE,
    PERMISSIONS.TRIP_DELETE,
    PERMISSIONS.TRIP_DISPATCH,
    PERMISSIONS.TRIP_COMPLETE,
    PERMISSIONS.TRIP_CANCEL,
    PERMISSIONS.VEHICLE_READ,
    PERMISSIONS.DRIVER_READ,
  ],
  [ROLES.SAFETY_OFFICER]: [
    PERMISSIONS.DRIVER_CREATE,
    PERMISSIONS.DRIVER_READ,
    PERMISSIONS.DRIVER_UPDATE,
    PERMISSIONS.DRIVER_DELETE,
    PERMISSIONS.DRIVER_MONITOR,
    PERMISSIONS.VEHICLE_READ,
    PERMISSIONS.TRIP_READ,
  ],
  [ROLES.FINANCIAL_ANALYST]: [
    PERMISSIONS.FUEL_CREATE,
    PERMISSIONS.FUEL_READ,
    PERMISSIONS.FUEL_UPDATE,
    PERMISSIONS.FUEL_DELETE,
    PERMISSIONS.EXPENSE_CREATE,
    PERMISSIONS.EXPENSE_READ,
    PERMISSIONS.EXPENSE_UPDATE,
    PERMISSIONS.EXPENSE_DELETE,
    PERMISSIONS.REPORT_VIEW,
    PERMISSIONS.REPORT_EXPORT,
    PERMISSIONS.VEHICLE_READ,
    PERMISSIONS.TRIP_READ,
  ],
};
