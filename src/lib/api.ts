import * as mock from '../data/mockData';

const BASE_URL = import.meta.env.VITE_API_URL
  ? `${import.meta.env.VITE_API_URL}/api`
  : 'http://localhost:5000/api';

// Simple helper to check if backend is online
let isBackendOnline = false;

async function checkHealth(): Promise<boolean> {
  try {
    const res = await fetch(`${BASE_URL}/health`, { signal: AbortSignal.timeout(1000) });
    const data = await res.json();
    isBackendOnline = data.success === true;
  } catch {
    isBackendOnline = false;
  }
  return isBackendOnline;
}

// Initial health check
checkHealth();

// Helper to set auth headers
function getHeaders(): HeadersInit {
  const headers: HeadersInit = {
    'Content-Type': 'application/json',
  };
  const token = localStorage.getItem('transitops_access_token');
  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }
  return headers;
}

export const api = {
  isOnline: () => isBackendOnline,
  checkConnection: checkHealth,

  auth: {
    async sendOtp(mobileNumber: string): Promise<boolean> {
      const online = await checkHealth();
      if (!online) {
        // Fallback simulated success
        return true;
      }
      try {
        const res = await fetch(`${BASE_URL}/auth/send-otp`, {
          method: 'POST',
          headers: getHeaders(),
          body: JSON.stringify({ mobileNumber }),
        });
        const data = await res.json();
        return data.success;
      } catch {
        return true; // fallback
      }
    },

    async verifyOtp(mobileNumber: string, otp: string): Promise<any> {
      const online = await checkHealth();
      if (!online) {
        // Fallback mock check
        if (mobileNumber === '9876543210' && otp === '123456') {
          return {
            user: { name: 'Rajesh Sharma', role: 'Fleet Manager', mobileNumber },
            accessToken: 'mock_token',
          };
        }
        throw new Error('Invalid OTP code. Please use the sent code: 123456');
      }

      const res = await fetch(`${BASE_URL}/auth/verify-otp`, {
        method: 'POST',
        headers: getHeaders(),
        body: JSON.stringify({ mobileNumber, otp }),
      });
      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.message || 'OTP verification failed');
      }

      localStorage.setItem('transitops_access_token', data.data.accessToken);
      localStorage.setItem('transitops_refresh_token', data.data.refreshToken);
      return data.data;
    },

    async loginWithPassword(email: string, password: string): Promise<any> {
      const online = await checkHealth();
      if (!online) {
        if (email === 'admin@transitops.com' && password === 'password123') {
          return {
            user: { name: 'Rajesh Sharma', role: 'Fleet Manager', email },
            accessToken: 'mock_token',
          };
        }
        throw new Error('Invalid credentials');
      }

      const res = await fetch(`${BASE_URL}/auth/login`, {
        method: 'POST',
        headers: getHeaders(),
        body: JSON.stringify({ email, password }),
      });
      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.message || 'Login failed');
      }

      localStorage.setItem('transitops_access_token', data.data.accessToken);
      localStorage.setItem('transitops_refresh_token', data.data.refreshToken);
      return data.data;
    },

    logout() {
      localStorage.removeItem('transitops_access_token');
      localStorage.removeItem('transitops_refresh_token');
    }
  },

  dashboard: {
    async getStats(): Promise<any> {
      const online = await checkHealth();
      if (!online) {
        return {
          stats: mock.dashboardStats,
          charts: mock.chartData,
        };
      }
      try {
        const res = await fetch(`${BASE_URL}/reports/dashboard`, { headers: getHeaders() });
        const data = await res.json();
        return data.data;
      } catch {
        return {
          stats: mock.dashboardStats,
          charts: mock.chartData,
        };
      }
    }
  },

  vehicles: {
    async getAll(): Promise<any[]> {
      const online = await checkHealth();
      if (!online) return mock.vehicles;
      try {
        const res = await fetch(`${BASE_URL}/vehicles?limit=100`, { headers: getHeaders() });
        const data = await res.json();
        return data.data;
      } catch {
        return mock.vehicles;
      }
    },

    async getById(id: string): Promise<any> {
      const online = await checkHealth();
      if (!online) return mock.vehicles.find(v => v.id === id) || mock.vehicles[0];
      try {
        const res = await fetch(`${BASE_URL}/vehicles/${id}`, { headers: getHeaders() });
        const data = await res.json();
        return data.data;
      } catch {
        return mock.vehicles.find(v => v.id === id) || mock.vehicles[0];
      }
    },

    async create(vehicleData: any): Promise<any> {
      const online = await checkHealth();
      if (!online) return vehicleData;
      const res = await fetch(`${BASE_URL}/vehicles`, {
        method: 'POST',
        headers: getHeaders(),
        body: JSON.stringify(vehicleData),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || 'Failed to create vehicle');
      return data.data;
    }
  },

  drivers: {
    async getAll(): Promise<any[]> {
      const online = await checkHealth();
      if (!online) return mock.drivers;
      try {
        const res = await fetch(`${BASE_URL}/drivers?limit=100`, { headers: getHeaders() });
        const data = await res.json();
        return data.data;
      } catch {
        return mock.drivers;
      }
    },

    async getById(id: string): Promise<any> {
      const online = await checkHealth();
      if (!online) return mock.drivers.find(d => d.id === id) || mock.drivers[0];
      try {
        const res = await fetch(`${BASE_URL}/drivers/${id}`, { headers: getHeaders() });
        const data = await res.json();
        return data.data;
      } catch {
        return mock.drivers.find(d => d.id === id) || mock.drivers[0];
      }
    },

    async create(driverData: any): Promise<any> {
      const online = await checkHealth();
      if (!online) return driverData;
      const res = await fetch(`${BASE_URL}/drivers`, {
        method: 'POST',
        headers: getHeaders(),
        body: JSON.stringify(driverData),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || 'Failed to create driver');
      return data.data;
    }
  },

  trips: {
    async getAll(): Promise<any[]> {
      const online = await checkHealth();
      if (!online) return mock.trips;
      try {
        const res = await fetch(`${BASE_URL}/trips?limit=100`, { headers: getHeaders() });
        const data = await res.json();
        return data.data;
      } catch {
        return mock.trips;
      }
    },

    async getById(id: string): Promise<any> {
      const online = await checkHealth();
      if (!online) return mock.trips.find(t => t.id === id) || mock.trips[0];
      try {
        const res = await fetch(`${BASE_URL}/trips/${id}`, { headers: getHeaders() });
        const data = await res.json();
        return data.data;
      } catch {
        return mock.trips.find(t => t.id === id) || mock.trips[0];
      }
    },

    async create(tripData: any): Promise<any> {
      const online = await checkHealth();
      if (!online) return tripData;
      const res = await fetch(`${BASE_URL}/trips`, {
        method: 'POST',
        headers: getHeaders(),
        body: JSON.stringify(tripData),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || 'Failed to create trip');
      return data.data;
    },

    async dispatch(id: string): Promise<any> {
      const online = await checkHealth();
      if (!online) return { id, status: 'Dispatched' };
      const res = await fetch(`${BASE_URL}/trips/${id}/dispatch`, {
        method: 'PUT',
        headers: getHeaders(),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || 'Failed to dispatch trip');
      return data.data;
    },

    async complete(id: string, completionData: any): Promise<any> {
      const online = await checkHealth();
      if (!online) return { id, status: 'Completed' };
      const res = await fetch(`${BASE_URL}/trips/${id}/complete`, {
        method: 'PUT',
        headers: getHeaders(),
        body: JSON.stringify(completionData),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || 'Failed to complete trip');
      return data.data;
    },

    async cancel(id: string): Promise<any> {
      const online = await checkHealth();
      if (!online) return { id, status: 'Cancelled' };
      const res = await fetch(`${BASE_URL}/trips/${id}/cancel`, {
        method: 'PUT',
        headers: getHeaders(),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || 'Failed to cancel trip');
      return data.data;
    }
  },

  maintenance: {
    async getAll(): Promise<any[]> {
      const online = await checkHealth();
      if (!online) return mock.maintenanceRecords;
      try {
        const res = await fetch(`${BASE_URL}/maintenance?limit=100`, { headers: getHeaders() });
        const data = await res.json();
        return data.data;
      } catch {
        return mock.maintenanceRecords;
      }
    },

    async create(logData: any): Promise<any> {
      const online = await checkHealth();
      if (!online) return logData;
      const res = await fetch(`${BASE_URL}/maintenance`, {
        method: 'POST',
        headers: getHeaders(),
        body: JSON.stringify(logData),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || 'Failed to create log');
      return data.data;
    }
  },

  fuel: {
    async getAll(): Promise<any[]> {
      const online = await checkHealth();
      if (!online) return mock.fuelLogs;
      try {
        const res = await fetch(`${BASE_URL}/fuel?limit=100`, { headers: getHeaders() });
        const data = await res.json();
        return data.data;
      } catch {
        return mock.fuelLogs;
      }
    },

    async create(fuelData: any): Promise<any> {
      const online = await checkHealth();
      if (!online) return fuelData;
      const res = await fetch(`${BASE_URL}/fuel`, {
        method: 'POST',
        headers: getHeaders(),
        body: JSON.stringify(fuelData),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || 'Failed to log fuel');
      return data.data;
    }
  },

  expenses: {
    async getAll(): Promise<any[]> {
      const online = await checkHealth();
      if (!online) return mock.expenses;
      try {
        const res = await fetch(`${BASE_URL}/expenses?limit=100`, { headers: getHeaders() });
        const data = await res.json();
        return data.data;
      } catch {
        return mock.expenses;
      }
    },

    async create(expenseData: any): Promise<any> {
      const online = await checkHealth();
      if (!online) return expenseData;
      const res = await fetch(`${BASE_URL}/expenses`, {
        method: 'POST',
        headers: getHeaders(),
        body: JSON.stringify(expenseData),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || 'Failed to record expense');
      return data.data;
    }
  }
};
