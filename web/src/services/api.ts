/**
 * API Service
 * Centralized service for all API communication
 */

import { ApiResponse, ApiError } from '@/types/api';

// ============================================================================
// CONFIGURATION
// ============================================================================

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001';
const API_TIMEOUT = 10000; // 10 seconds

// ============================================================================
// TYPES
// ============================================================================

interface RequestOptions {
  method?: 'GET' | 'POST' | 'PUT' | 'DELETE' | 'PATCH';
  headers?: Record<string, string>;
  body?: any;
  timeout?: number;
}

interface AuthTokens {
  accessToken?: string;
  refreshToken?: string;
}

// ============================================================================
// UTILITY FUNCTIONS
// ============================================================================

const getAuthTokens = (): AuthTokens => {
  if (typeof window === 'undefined') return {};
  
  return {
    accessToken: localStorage.getItem('accessToken') || undefined,
    refreshToken: localStorage.getItem('refreshToken') || undefined,
  };
};

const setAuthTokens = (tokens: AuthTokens) => {
  if (typeof window === 'undefined') return;
  
  if (tokens.accessToken) {
    localStorage.setItem('accessToken', tokens.accessToken);
  }
  if (tokens.refreshToken) {
    localStorage.setItem('refreshToken', tokens.refreshToken);
  }
};

const clearAuthTokens = () => {
  if (typeof window === 'undefined') return;
  
  localStorage.removeItem('accessToken');
  localStorage.removeItem('refreshToken');
};

// ============================================================================
// REQUEST HELPERS
// ============================================================================

const createTimeoutPromise = (timeout: number) => {
  return new Promise((_, reject) => {
    setTimeout(() => reject(new Error('Request timeout')), timeout);
  });
};

const buildUrl = (endpoint: string): string => {
  const cleanEndpoint = endpoint.startsWith('/') ? endpoint.slice(1) : endpoint;
  return `${API_BASE_URL}/${cleanEndpoint}`;
};

const buildHeaders = (customHeaders: Record<string, string> = {}): Record<string, string> => {
  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
    ...customHeaders,
  };

  const { accessToken } = getAuthTokens();
  if (accessToken) {
    headers.Authorization = `Bearer ${accessToken}`;
  }

  return headers;
};

// ============================================================================
// CORE API CLIENT
// ============================================================================

class ApiClient {
  private async makeRequest<T>(
    endpoint: string, 
    options: RequestOptions = {}
  ): Promise<ApiResponse<T>> {
    const {
      method = 'GET',
      headers = {},
      body,
      timeout = API_TIMEOUT,
    } = options;

    const url = buildUrl(endpoint);
    const requestHeaders = buildHeaders(headers);

    const fetchOptions: RequestInit = {
      method,
      headers: requestHeaders,
    };

    if (body && method !== 'GET') {
      fetchOptions.body = JSON.stringify(body);
    }

    try {
      const fetchPromise = fetch(url, fetchOptions);
      const timeoutPromise = createTimeoutPromise(timeout);

      const response = await Promise.race([fetchPromise, timeoutPromise]) as Response;

      const contentType = response.headers.get('content-type');
      const isJson = contentType?.includes('application/json');

      let data;
      if (isJson) {
        data = await response.json();
      } else {
        data = await response.text();
      }

      if (!response.ok) {
        const error: ApiError = {
          message: data.message || data.error || 'Request failed',
          status: response.status,
          code: data.code || 'API_ERROR',
          details: data.details,
        };
        throw error;
      }

      return {
        data,
        status: response.status,
        message: data.message || 'Success',
      };

    } catch (error) {
      if (error instanceof Error && error.message === 'Request timeout') {
        const timeoutError: ApiError = {
          message: 'Request timeout',
          status: 408,
          code: 'TIMEOUT_ERROR',
        };
        throw timeoutError;
      }

      if ((error as ApiError).status) {
        throw error;
      }

      const networkError: ApiError = {
        message: 'Network error',
        status: 0,
        code: 'NETWORK_ERROR',
        details: error instanceof Error ? error.message : 'Unknown error',
      };
      throw networkError;
    }
  }

  // ============================================================================
  // AUTHENTICATION METHODS
  // ============================================================================

  async login(credentials: { email: string; password: string }) {
    const response = await this.makeRequest<{ token: string; user: any }>('/api/auth/login', {
      method: 'POST',
      body: credentials,
    });

    if (response.data.token) {
      setAuthTokens({ accessToken: response.data.token });
    }

    return response;
  }

  async register(userData: { name: string; email: string; password: string; role?: string }) {
    return this.makeRequest<{ user: any }>('/api/auth/register', {
      method: 'POST',
      body: userData,
    });
  }

  async logout() {
    try {
      await this.makeRequest('/api/auth/logout', { method: 'POST' });
    } finally {
      clearAuthTokens();
    }
  }

  async refreshToken() {
    const { refreshToken } = getAuthTokens();
    if (!refreshToken) {
      throw new Error('No refresh token available');
    }

    const response = await this.makeRequest<{ token: string }>('/api/auth/refresh', {
      method: 'POST',
      body: { refreshToken },
    });

    if (response.data.token) {
      setAuthTokens({ accessToken: response.data.token });
    }

    return response;
  }

  // ============================================================================
  // TOURIST METHODS
  // ============================================================================

  async getTourists(params?: { 
    page?: number; 
    limit?: number; 
    status?: string; 
    search?: string;
    sortBy?: string;
    sortOrder?: 'asc' | 'desc';
  }) {
    const queryParams = new URLSearchParams();
    
    if (params) {
      Object.entries(params).forEach(([key, value]) => {
        if (value !== undefined && value !== null) {
          queryParams.append(key, String(value));
        }
      });
    }

    const endpoint = `/api/tourists${queryParams.toString() ? `?${queryParams.toString()}` : ''}`;
    return this.makeRequest<{ data: any[]; total: number; page: number; limit: number }>(endpoint);
  }

  async getTourist(id: string) {
    return this.makeRequest<any>(`/api/tourists/${id}`);
  }

  async createTourist(touristData: any) {
    return this.makeRequest<any>('/api/tourists', {
      method: 'POST',
      body: touristData,
    });
  }

  async updateTourist(id: string, touristData: any) {
    return this.makeRequest<any>(`/api/tourists/${id}`, {
      method: 'PUT',
      body: touristData,
    });
  }

  async deleteTourist(id: string) {
    return this.makeRequest<void>(`/api/tourists/${id}`, {
      method: 'DELETE',
    });
  }

  // ============================================================================
  // ALERT METHODS
  // ============================================================================

  async getAlerts(params?: {
    page?: number;
    limit?: number;
    status?: string;
    severity?: string;
    touristId?: string;
  }) {
    const queryParams = new URLSearchParams();
    
    if (params) {
      Object.entries(params).forEach(([key, value]) => {
        if (value !== undefined && value !== null) {
          queryParams.append(key, String(value));
        }
      });
    }

    const endpoint = `/api/alerts${queryParams.toString() ? `?${queryParams.toString()}` : ''}`;
    return this.makeRequest<{ data: any[]; total: number }>(endpoint);
  }

  async getAlert(id: string) {
    return this.makeRequest<any>(`/api/alerts/${id}`);
  }

  async createAlert(alertData: any) {
    return this.makeRequest<any>('/api/alerts', {
      method: 'POST',
      body: alertData,
    });
  }

  async updateAlert(id: string, alertData: any) {
    return this.makeRequest<any>(`/api/alerts/${id}`, {
      method: 'PUT',
      body: alertData,
    });
  }

  async resolveAlert(id: string, resolution: { notes?: string; action?: string }) {
    return this.makeRequest<any>(`/api/alerts/${id}/resolve`, {
      method: 'POST',
      body: resolution,
    });
  }

  // ============================================================================
  // BLOCKCHAIN METHODS
  // ============================================================================

  async generateDigitalId(touristData: any) {
    return this.makeRequest<{ digitalId: string; transactionHash: string }>('/api/blockchain/generate-identity', {
      method: 'POST',
      body: touristData,
    });
  }

  async verifyDigitalId(digitalId: string) {
    return this.makeRequest<{ isValid: boolean; touristData: any }>(`/api/blockchain/verify-identity/${digitalId}`);
  }

  async getBlockchainRecords(touristId: string) {
    return this.makeRequest<any[]>(`/api/blockchain/records/${touristId}`);
  }

  // ============================================================================
  // ANALYTICS METHODS
  // ============================================================================

  async getDashboardAnalytics() {
    return this.makeRequest<{
      totalTourists: number;
      activeTourists: number;
      alertsCount: number;
      safetyScore: number;
      trends: any[];
    }>('/api/analytics/dashboard');
  }

  async getHeatmapData(params?: { startDate?: string; endDate?: string; zoneId?: string }) {
    const queryParams = new URLSearchParams();
    
    if (params) {
      Object.entries(params).forEach(([key, value]) => {
        if (value !== undefined && value !== null) {
          queryParams.append(key, String(value));
        }
      });
    }

    const endpoint = `/api/analytics/heatmap${queryParams.toString() ? `?${queryParams.toString()}` : ''}`;
    return this.makeRequest<any[]>(endpoint);
  }

  // ============================================================================
  // ZONE METHODS
  // ============================================================================

  async getZones() {
    return this.makeRequest<any[]>('/api/zones');
  }

  async getZone(id: string) {
    return this.makeRequest<any>(`/api/zones/${id}`);
  }

  async createZone(zoneData: any) {
    return this.makeRequest<any>('/api/zones', {
      method: 'POST',
      body: zoneData,
    });
  }

  async updateZone(id: string, zoneData: any) {
    return this.makeRequest<any>(`/api/zones/${id}`, {
      method: 'PUT',
      body: zoneData,
    });
  }

  async deleteZone(id: string) {
    return this.makeRequest<void>(`/api/zones/${id}`, {
      method: 'DELETE',
    });
  }
}

// ============================================================================
// SINGLETON INSTANCE
// ============================================================================

const apiClient = new ApiClient();

export default apiClient;

// Named exports for convenience
export const {
  login,
  register,
  logout,
  refreshToken,
  getTourists,
  getTourist,
  createTourist,
  updateTourist,
  deleteTourist,
  getAlerts,
  getAlert,
  createAlert,
  updateAlert,
  resolveAlert,
  generateDigitalId,
  verifyDigitalId,
  getBlockchainRecords,
  getDashboardAnalytics,
  getHeatmapData,
  getZones,
  getZone,
  createZone,
  updateZone,
  deleteZone,
} = apiClient;