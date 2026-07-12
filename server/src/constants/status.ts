// ─── Status & Error Constants ───

export const VEHICLE_STATUS_MAP: Record<string, string> = {
  AVAILABLE: 'Available',
  ON_TRIP: 'Active',
  IN_SHOP: 'In Maintenance',
  RETIRED: 'Retired',
};

export const DRIVER_STATUS_MAP: Record<string, string> = {
  AVAILABLE: 'Active',
  ON_TRIP: 'Active',
  OFF_DUTY: 'On Leave',
  SUSPENDED: 'Suspended',
};

export const TRIP_STATUS_MAP: Record<string, string> = {
  DRAFT: 'Scheduled',
  DISPATCHED: 'Dispatched',
  IN_TRANSIT: 'In Transit',
  COMPLETED: 'Completed',
  CANCELLED: 'Cancelled',
};

export const MAINTENANCE_STATUS_MAP: Record<string, string> = {
  SCHEDULED: 'Scheduled',
  IN_PROGRESS: 'In Progress',
  COMPLETED: 'Completed',
  OVERDUE: 'Overdue',
};

export const EXPENSE_STATUS_MAP: Record<string, string> = {
  APPROVED: 'Approved',
  PENDING: 'Pending',
  REJECTED: 'Rejected',
};

export const ERROR_CODES = {
  INTERNAL_ERROR: 'INTERNAL_ERROR',
  VALIDATION_ERROR: 'VALIDATION_ERROR',
  NOT_FOUND: 'NOT_FOUND',
  UNAUTHORIZED: 'UNAUTHORIZED',
  FORBIDDEN: 'FORBIDDEN',
  CONFLICT: 'CONFLICT',
  RATE_LIMIT: 'RATE_LIMIT',
  OTP_EXPIRED: 'OTP_EXPIRED',
  OTP_INVALID: 'OTP_INVALID',
  OTP_MAX_ATTEMPTS: 'OTP_MAX_ATTEMPTS',
  OTP_RATE_LIMITED: 'OTP_RATE_LIMITED',
  USER_NOT_FOUND: 'USER_NOT_FOUND',
  VEHICLE_NOT_AVAILABLE: 'VEHICLE_NOT_AVAILABLE',
  DRIVER_NOT_AVAILABLE: 'DRIVER_NOT_AVAILABLE',
  DRIVER_LICENSE_EXPIRED: 'DRIVER_LICENSE_EXPIRED',
  CARGO_EXCEEDS_CAPACITY: 'CARGO_EXCEEDS_CAPACITY',
  TRIP_CANNOT_DISPATCH: 'TRIP_CANNOT_DISPATCH',
} as const;
