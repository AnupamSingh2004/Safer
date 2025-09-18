/**
 * API Service Tests
 * Comprehensive testing for API service functionality including authentication,
 * error handling, and data operations
 */

import apiClient from '../../services/api';
import { mockFetch, mockApiResponses, mockLocalStorage, createMockAlert } from '../utils/test-utils';

// Mock global fetch
const mockGlobalFetch = jest.fn();
global.fetch = mockGlobalFetch;

// Mock localStorage
const mockStorage = mockLocalStorage();
Object.defineProperty(window, 'localStorage', {
  value: mockStorage,
});

describe('API Service', () => {

  // ============================================================================
  // SETUP AND TEARDOWN
  // ============================================================================

  beforeEach(() => {
    jest.clearAllMocks();
    mockGlobalFetch.mockClear();
    mockStorage.clear();
  });

  afterEach(() => {
    jest.restoreAllMocks();
  });

  // ============================================================================
  // AUTHENTICATION TESTS
  // ============================================================================

  describe('Authentication', () => {
    
    test('should login successfully with valid credentials', async () => {
      const credentials = { email: 'test@example.com', password: 'password123' };
      const expectedResponse = mockApiResponses.login.success;

      mockGlobalFetch.mockResolvedValueOnce({
        ok: true,
        status: 200,
        headers: new Headers({ 'content-type': 'application/json' }),
        json: async () => expectedResponse,
      });

      const result = await apiClient.login(credentials);

      expect(mockGlobalFetch).toHaveBeenCalledWith(
        expect.stringContaining('/api/auth/login'),
        expect.objectContaining({
          method: 'POST',
          headers: expect.objectContaining({
            'Content-Type': 'application/json',
          }),
          body: JSON.stringify(credentials),
        })
      );

      expect(result.data).toEqual(expectedResponse);
      expect(mockStorage.setItem).toHaveBeenCalledWith('accessToken', expectedResponse.token);
    });

    test('should handle login failure', async () => {
      const credentials = { email: 'wrong@example.com', password: 'wrongpass' };
      const errorResponse = mockApiResponses.login.error;

      mockGlobalFetch.mockResolvedValueOnce({
        ok: false,
        status: 401,
        headers: new Headers({ 'content-type': 'application/json' }),
        json: async () => errorResponse,
      });

      await expect(apiClient.login(credentials)).rejects.toMatchObject({
        message: errorResponse.error,
        status: 401,
        code: errorResponse.code,
      });

      expect(mockStorage.setItem).not.toHaveBeenCalled();
    });

    test('should register new user successfully', async () => {
      const userData = {
        name: 'John Doe',
        email: 'john@example.com',
        password: 'password123',
        role: 'admin'
      };

      const expectedResponse = {
        user: {
          id: 'user-1',
          ...userData,
          password: undefined // Password should not be returned
        }
      };

      mockGlobalFetch.mockResolvedValueOnce({
        ok: true,
        status: 201,
        headers: new Headers({ 'content-type': 'application/json' }),
        json: async () => expectedResponse,
      });

      const result = await apiClient.register(userData);

      expect(mockGlobalFetch).toHaveBeenCalledWith(
        expect.stringContaining('/api/auth/register'),
        expect.objectContaining({
          method: 'POST',
          body: JSON.stringify(userData),
        })
      );

      expect(result.data).toEqual(expectedResponse);
    });

    test('should logout and clear tokens', async () => {
      // Set initial tokens
      mockStorage.setItem('accessToken', 'test-token');
      mockStorage.setItem('refreshToken', 'test-refresh-token');

      mockGlobalFetch.mockResolvedValueOnce({
        ok: true,
        status: 200,
        headers: new Headers({ 'content-type': 'application/json' }),
        json: async () => ({ message: 'Logged out successfully' }),
      });

      await apiClient.logout();

      expect(mockGlobalFetch).toHaveBeenCalledWith(
        expect.stringContaining('/api/auth/logout'),
        expect.objectContaining({
          method: 'POST',
        })
      );

      expect(mockStorage.removeItem).toHaveBeenCalledWith('accessToken');
      expect(mockStorage.removeItem).toHaveBeenCalledWith('refreshToken');
    });

    test('should refresh access token', async () => {
      const refreshToken = 'test-refresh-token';
      const newToken = 'new-access-token';

      mockStorage.setItem('refreshToken', refreshToken);

      mockGlobalFetch.mockResolvedValueOnce({
        ok: true,
        status: 200,
        headers: new Headers({ 'content-type': 'application/json' }),
        json: async () => ({ token: newToken }),
      });

      const result = await apiClient.refreshToken();

      expect(mockGlobalFetch).toHaveBeenCalledWith(
        expect.stringContaining('/api/auth/refresh'),
        expect.objectContaining({
          method: 'POST',
          body: JSON.stringify({ refreshToken }),
        })
      );

      expect(result.data.token).toBe(newToken);
      expect(mockStorage.setItem).toHaveBeenCalledWith('accessToken', newToken);
    });

  });

  // ============================================================================
  // TOURIST OPERATIONS TESTS
  // ============================================================================

  describe('Tourist Operations', () => {
    
    beforeEach(() => {
      // Set auth token for authenticated requests
      mockStorage.setItem('accessToken', 'test-token');
    });

    test('should fetch tourists with pagination', async () => {
      const params = { page: 1, limit: 10, status: 'active' };
      const expectedResponse = mockApiResponses.getTourists.success;

      mockGlobalFetch.mockResolvedValueOnce({
        ok: true,
        status: 200,
        headers: new Headers({ 'content-type': 'application/json' }),
        json: async () => expectedResponse,
      });

      const result = await apiClient.getTourists(params);

      expect(mockGlobalFetch).toHaveBeenCalledWith(
        expect.stringContaining('/api/tourists?page=1&limit=10&status=active'),
        expect.objectContaining({
          method: 'GET',
          headers: expect.objectContaining({
            'Authorization': 'Bearer test-token',
          }),
        })
      );

      expect(result.data).toEqual(expectedResponse);
    });

    test('should fetch single tourist by ID', async () => {
      const touristId = 'tourist-123';
      const expectedTourist = {
        id: touristId,
        name: 'John Doe',
        email: 'john@example.com',
        status: 'active'
      };

      mockGlobalFetch.mockResolvedValueOnce({
        ok: true,
        status: 200,
        headers: new Headers({ 'content-type': 'application/json' }),
        json: async () => expectedTourist,
      });

      const result = await apiClient.getTourist(touristId);

      expect(mockGlobalFetch).toHaveBeenCalledWith(
        expect.stringContaining(`/api/tourists/${touristId}`),
        expect.objectContaining({
          method: 'GET',
        })
      );

      expect(result.data).toEqual(expectedTourist);
    });

    test('should create new tourist', async () => {
      const touristData = {
        name: 'Jane Smith',
        email: 'jane@example.com',
        phone: '+1234567890',
        passportNumber: 'AB123456',
        nationality: 'USA'
      };

      const expectedResponse = {
        ...touristData,
        id: 'tourist-new',
        createdAt: new Date().toISOString()
      };

      mockGlobalFetch.mockResolvedValueOnce({
        ok: true,
        status: 201,
        headers: new Headers({ 'content-type': 'application/json' }),
        json: async () => expectedResponse,
      });

      const result = await apiClient.createTourist(touristData);

      expect(mockGlobalFetch).toHaveBeenCalledWith(
        expect.stringContaining('/api/tourists'),
        expect.objectContaining({
          method: 'POST',
          body: JSON.stringify(touristData),
        })
      );

      expect(result.data).toEqual(expectedResponse);
    });

    test('should update tourist data', async () => {
      const touristId = 'tourist-123';
      const updateData = { status: 'inactive', safetyScore: 95 };

      mockGlobalFetch.mockResolvedValueOnce({
        ok: true,
        status: 200,
        headers: new Headers({ 'content-type': 'application/json' }),
        json: async () => ({ ...updateData, id: touristId, updatedAt: new Date().toISOString() }),
      });

      const result = await apiClient.updateTourist(touristId, updateData);

      expect(mockGlobalFetch).toHaveBeenCalledWith(
        expect.stringContaining(`/api/tourists/${touristId}`),
        expect.objectContaining({
          method: 'PUT',
          body: JSON.stringify(updateData),
        })
      );

      expect(result.data.id).toBe(touristId);
      expect(result.data.status).toBe(updateData.status);
    });

    test('should delete tourist', async () => {
      const touristId = 'tourist-123';

      mockGlobalFetch.mockResolvedValueOnce({
        ok: true,
        status: 204,
        headers: new Headers({ 'content-type': 'application/json' }),
        json: async () => ({}),
      });

      await apiClient.deleteTourist(touristId);

      expect(mockGlobalFetch).toHaveBeenCalledWith(
        expect.stringContaining(`/api/tourists/${touristId}`),
        expect.objectContaining({
          method: 'DELETE',
        })
      );
    });

  });

  // ============================================================================
  // ALERT OPERATIONS TESTS
  // ============================================================================

  describe('Alert Operations', () => {
    
    beforeEach(() => {
      mockStorage.setItem('accessToken', 'test-token');
    });

    test('should fetch alerts with filters', async () => {
      const params = { status: 'active', severity: 'high', touristId: 'tourist-123' };
      const expectedResponse = {
        data: [createMockAlert()],
        total: 1
      };

      mockGlobalFetch.mockResolvedValueOnce({
        ok: true,
        status: 200,
        headers: new Headers({ 'content-type': 'application/json' }),
        json: async () => expectedResponse,
      });

      const result = await apiClient.getAlerts(params);

      expect(mockGlobalFetch).toHaveBeenCalledWith(
        expect.stringContaining('/api/alerts?status=active&severity=high&touristId=tourist-123'),
        expect.objectContaining({
          method: 'GET',
        })
      );

      expect(result.data).toEqual(expectedResponse);
    });

    test('should create new alert', async () => {
      const alertData = {
        touristId: 'tourist-123',
        type: 'emergency',
        severity: 'high',
        title: 'Tourist in distress',
        description: 'Emergency situation detected',
        location: {
          latitude: 40.7128,
          longitude: -74.0060,
          address: 'Guwahati, Assam'
        }
      };

      const expectedResponse = {
        ...alertData,
        id: 'alert-new',
        status: 'active',
        createdAt: new Date().toISOString()
      };

      mockGlobalFetch.mockResolvedValueOnce({
        ok: true,
        status: 201,
        headers: new Headers({ 'content-type': 'application/json' }),
        json: async () => expectedResponse,
      });

      const result = await apiClient.createAlert(alertData);

      expect(mockGlobalFetch).toHaveBeenCalledWith(
        expect.stringContaining('/api/alerts'),
        expect.objectContaining({
          method: 'POST',
          body: JSON.stringify(alertData),
        })
      );

      expect(result.data).toEqual(expectedResponse);
    });

    test('should resolve alert', async () => {
      const alertId = 'alert-123';
      const resolution = {
        notes: 'Tourist found safe',
        action: 'emergency_response_dispatched'
      };

      mockGlobalFetch.mockResolvedValueOnce({
        ok: true,
        status: 200,
        headers: new Headers({ 'content-type': 'application/json' }),
        json: async () => ({ 
          id: alertId, 
          status: 'resolved', 
          resolvedAt: new Date().toISOString(),
          resolution 
        }),
      });

      const result = await apiClient.resolveAlert(alertId, resolution);

      expect(mockGlobalFetch).toHaveBeenCalledWith(
        expect.stringContaining(`/api/alerts/${alertId}/resolve`),
        expect.objectContaining({
          method: 'POST',
          body: JSON.stringify(resolution),
        })
      );

      expect(result.data.status).toBe('resolved');
    });

  });

  // ============================================================================
  // BLOCKCHAIN OPERATIONS TESTS
  // ============================================================================

  describe('Blockchain Operations', () => {
    
    beforeEach(() => {
      mockStorage.setItem('accessToken', 'test-token');
    });

    test('should generate digital ID', async () => {
      const touristData = {
        name: 'John Doe',
        passportNumber: 'AB123456',
        nationality: 'USA'
      };

      const expectedResponse = {
        digitalId: '0x1234567890abcdef',
        transactionHash: '0xabcdef1234567890'
      };

      mockGlobalFetch.mockResolvedValueOnce({
        ok: true,
        status: 201,
        headers: new Headers({ 'content-type': 'application/json' }),
        json: async () => expectedResponse,
      });

      const result = await apiClient.generateDigitalId(touristData);

      expect(mockGlobalFetch).toHaveBeenCalledWith(
        expect.stringContaining('/api/blockchain/generate-identity'),
        expect.objectContaining({
          method: 'POST',
          body: JSON.stringify(touristData),
        })
      );

      expect(result.data).toEqual(expectedResponse);
    });

    test('should verify digital ID', async () => {
      const digitalId = '0x1234567890abcdef';
      const expectedResponse = {
        isValid: true,
        touristData: {
          name: 'John Doe',
          passportNumber: 'AB123456'
        }
      };

      mockGlobalFetch.mockResolvedValueOnce({
        ok: true,
        status: 200,
        headers: new Headers({ 'content-type': 'application/json' }),
        json: async () => expectedResponse,
      });

      const result = await apiClient.verifyDigitalId(digitalId);

      expect(mockGlobalFetch).toHaveBeenCalledWith(
        expect.stringContaining(`/api/blockchain/verify-identity/${digitalId}`),
        expect.objectContaining({
          method: 'GET',
        })
      );

      expect(result.data).toEqual(expectedResponse);
    });

  });

  // ============================================================================
  // ERROR HANDLING TESTS
  // ============================================================================

  describe('Error Handling', () => {
    
    test('should handle network errors', async () => {
      mockGlobalFetch.mockRejectedValueOnce(new Error('Network failed'));

      await expect(apiClient.getTourists()).rejects.toMatchObject({
        message: 'Network error',
        status: 0,
        code: 'NETWORK_ERROR',
      });
    });

    test('should handle timeout errors', async () => {
      // Mock a slow response that exceeds timeout
      mockGlobalFetch.mockImplementationOnce(
        () => new Promise(resolve => setTimeout(resolve, 15000))
      );

      await expect(
        apiClient.getTourists()
      ).rejects.toMatchObject({
        message: 'Request timeout',
        status: 408,
        code: 'TIMEOUT_ERROR',
      });
    });

    test('should handle HTTP error responses', async () => {
      const errorResponse = {
        error: 'Tourist not found',
        code: 'NOT_FOUND',
        details: 'The requested tourist ID does not exist'
      };

      mockGlobalFetch.mockResolvedValueOnce({
        ok: false,
        status: 404,
        headers: new Headers({ 'content-type': 'application/json' }),
        json: async () => errorResponse,
      });

      await expect(apiClient.getTourist('invalid-id')).rejects.toMatchObject({
        message: errorResponse.error,
        status: 404,
        code: errorResponse.code,
        details: errorResponse.details,
      });
    });

    test('should handle non-JSON responses', async () => {
      mockGlobalFetch.mockResolvedValueOnce({
        ok: false,
        status: 500,
        headers: new Headers({ 'content-type': 'text/plain' }),
        json: async () => { throw new Error('Not JSON'); },
        text: async () => 'Internal Server Error',
      });

      await expect(apiClient.getTourists()).rejects.toMatchObject({
        message: 'Internal Server Error',
        status: 500,
        code: 'API_ERROR',
      });
    });

    test('should handle missing auth tokens gracefully', async () => {
      // Clear auth tokens
      mockStorage.clear();

      mockGlobalFetch.mockResolvedValueOnce({
        ok: false,
        status: 401,
        headers: new Headers({ 'content-type': 'application/json' }),
        json: async () => ({ error: 'Unauthorized', code: 'UNAUTHORIZED' }),
      });

      await expect(apiClient.getTourists()).rejects.toMatchObject({
        message: 'Unauthorized',
        status: 401,
        code: 'UNAUTHORIZED',
      });
    });

  });

  // ============================================================================
  // REQUEST BUILDING TESTS
  // ============================================================================

  describe('Request Building', () => {
    
    test('should build correct URL with query parameters', async () => {
      const params = {
        page: 2,
        limit: 25,
        status: 'active',
        search: 'john doe',
        sortBy: 'name',
        sortOrder: 'desc' as const
      };

      mockGlobalFetch.mockResolvedValueOnce({
        ok: true,
        status: 200,
        headers: new Headers({ 'content-type': 'application/json' }),
        json: async () => mockApiResponses.getTourists.success,
      });

      await apiClient.getTourists(params);

      const expectedUrl = expect.stringContaining(
        '/api/tourists?page=2&limit=25&status=active&search=john+doe&sortBy=name&sortOrder=desc'
      );

      expect(mockGlobalFetch).toHaveBeenCalledWith(expectedUrl, expect.any(Object));
    });

    test('should include auth headers when token is available', async () => {
      const token = 'test-auth-token';
      mockStorage.setItem('accessToken', token);

      mockGlobalFetch.mockResolvedValueOnce({
        ok: true,
        status: 200,
        headers: new Headers({ 'content-type': 'application/json' }),
        json: async () => ({}),
      });

      await apiClient.getTourists();

      expect(mockGlobalFetch).toHaveBeenCalledWith(
        expect.any(String),
        expect.objectContaining({
          headers: expect.objectContaining({
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json',
          }),
        })
      );
    });

    test('should handle custom headers', async () => {
      // This test would require modifying the API client to accept custom headers
      // For now, we'll test that default headers are applied correctly
      mockGlobalFetch.mockResolvedValueOnce({
        ok: true,
        status: 200,
        headers: new Headers({ 'content-type': 'application/json' }),
        json: async () => ({}),
      });

      await apiClient.getTourists();

      expect(mockGlobalFetch).toHaveBeenCalledWith(
        expect.any(String),
        expect.objectContaining({
          headers: expect.objectContaining({
            'Content-Type': 'application/json',
          }),
        })
      );
    });

  });

  // ============================================================================
  // ANALYTICS TESTS
  // ============================================================================

  describe('Analytics Operations', () => {
    
    beforeEach(() => {
      mockStorage.setItem('accessToken', 'test-token');
    });

    test('should fetch dashboard analytics', async () => {
      const expectedResponse = {
        totalTourists: 150,
        activeTourists: 120,
        alertsCount: 5,
        safetyScore: 87,
        trends: [
          { date: '2024-01-01', value: 100 },
          { date: '2024-01-02', value: 110 }
        ]
      };

      mockGlobalFetch.mockResolvedValueOnce({
        ok: true,
        status: 200,
        headers: new Headers({ 'content-type': 'application/json' }),
        json: async () => expectedResponse,
      });

      const result = await apiClient.getDashboardAnalytics();

      expect(mockGlobalFetch).toHaveBeenCalledWith(
        expect.stringContaining('/api/analytics/dashboard'),
        expect.objectContaining({
          method: 'GET',
        })
      );

      expect(result.data).toEqual(expectedResponse);
    });

    test('should fetch heatmap data with parameters', async () => {
      const params = {
        startDate: '2024-01-01',
        endDate: '2024-01-31',
        zoneId: 'zone-123'
      };

      const expectedResponse = [
        { lat: 40.7128, lng: -74.0060, intensity: 0.8 },
        { lat: 40.7589, lng: -73.9851, intensity: 0.6 }
      ];

      mockGlobalFetch.mockResolvedValueOnce({
        ok: true,
        status: 200,
        headers: new Headers({ 'content-type': 'application/json' }),
        json: async () => expectedResponse,
      });

      const result = await apiClient.getHeatmapData(params);

      expect(mockGlobalFetch).toHaveBeenCalledWith(
        expect.stringContaining('/api/analytics/heatmap?startDate=2024-01-01&endDate=2024-01-31&zoneId=zone-123'),
        expect.objectContaining({
          method: 'GET',
        })
      );

      expect(result.data).toEqual(expectedResponse);
    });

  });

});