const BASE_URL = import.meta.env.VITE_API_URL
  ? `${import.meta.env.VITE_API_URL}/api`
  : 'http://localhost:5000/api';

function getHeaders(): HeadersInit {
  const headers: HeadersInit = { 'Content-Type': 'application/json' };
  const token = localStorage.getItem('transitops_access_token');
  if (token) headers['Authorization'] = `Bearer ${token}`;
  return headers;
}

export const api = {
  isOnline: () => true,
  checkConnection: async () => true,

  auth: {
    async sendOtp(mobileNumber: string): Promise<boolean> {
      const res = await fetch(`${BASE_URL}/auth/send-otp`, {
        method: 'POST',
        headers: getHeaders(),
        body: JSON.stringify({ mobileNumber }),
      });
      const data = await res.json();
      return data.success;
    },
    async verifyOtp(mobileNumber: string, otp: string): Promise<any> {
      const res = await fetch(`${BASE_URL}/auth/verify-otp`, {
        method: 'POST',
        headers: getHeaders(),
        body: JSON.stringify({ mobileNumber, otp }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || 'OTP verification failed');
      localStorage.setItem('transitops_access_token', data.data.accessToken);
      localStorage.setItem('transitops_refresh_token', data.data.refreshToken);
      return data.data;
    },
    async loginWithPassword(email: string, password: string): Promise<any> {
      const res = await fetch(`${BASE_URL}/auth/login`, {
        method: 'POST',
        headers: getHeaders(),
        body: JSON.stringify({ email, password }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || 'Login failed');
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
      const res = await fetch(`${BASE_URL}/reports/dashboard`, { headers: getHeaders() });
      if (!res.ok) throw new Error('Failed to fetch stats');
      const data = await res.json();
      return data.data;
    }
  },

  vehicles: {
    async getAll(): Promise<any[]> {
      const res = await fetch(`${BASE_URL}/vehicles?limit=100`, { headers: getHeaders() });
      const data = await res.json();
      return data.data;
    },
    async getById(id: string): Promise<any> {
      const res = await fetch(`${BASE_URL}/vehicles/${id}`, { headers: getHeaders() });
      const data = await res.json();
      return data.data;
    },
    async create(vehicleData: any): Promise<any> {
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
      const res = await fetch(`${BASE_URL}/drivers?limit=100`, { headers: getHeaders() });
      const data = await res.json();
      return data.data;
    },
    async getById(id: string): Promise<any> {
      const res = await fetch(`${BASE_URL}/drivers/${id}`, { headers: getHeaders() });
      const data = await res.json();
      return data.data;
    },
    async create(driverData: any): Promise<any> {
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
      const res = await fetch(`${BASE_URL}/trips?limit=100`, { headers: getHeaders() });
      const data = await res.json();
      return data.data;
    },
    async getById(id: string): Promise<any> {
      const res = await fetch(`${BASE_URL}/trips/${id}`, { headers: getHeaders() });
      const data = await res.json();
      return data.data;
    },
    async create(tripData: any): Promise<any> {
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
      const res = await fetch(`${BASE_URL}/trips/${id}/dispatch`, {
        method: 'PUT',
        headers: getHeaders(),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || 'Failed to dispatch trip');
      return data.data;
    },
    async complete(id: string, completionData: any): Promise<any> {
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
      const res = await fetch(`${BASE_URL}/maintenance?limit=100`, { headers: getHeaders() });
      const data = await res.json();
      return data.data;
    },
    async create(logData: any): Promise<any> {
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
      const res = await fetch(`${BASE_URL}/fuel?limit=100`, { headers: getHeaders() });
      const data = await res.json();
      return data.data;
    },
    async create(fuelData: any): Promise<any> {
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
      const res = await fetch(`${BASE_URL}/expenses?limit=100`, { headers: getHeaders() });
      const data = await res.json();
      return data.data;
    },
    async create(expenseData: any): Promise<any> {
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
