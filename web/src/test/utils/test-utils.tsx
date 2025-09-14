/**
 * Test Utilities and Helper Functions
 * Provides common testing utilities and mock data factories
 */

// ============================================================================
// MOCK DATA FACTORIES
// ============================================================================

export const createMockTourist = (overrides: any = {}) => ({
  id: 'tourist-1',
  name: 'John Doe',
  email: 'john@example.com',
  phone: '+1234567890',
  passportNumber: 'P12345678',
  nationality: 'USA',
  status: 'active',
  digitalIdHash: '0x1234567890abcdef',
  emergencyContact: {
    name: 'Jane Doe',
    phone: '+1234567891',
    relationship: 'Spouse'
  },
  currentLocation: {
    latitude: 40.7128,
    longitude: -74.0060,
    address: 'New York, NY',
    timestamp: new Date().toISOString(),
    accuracy: 10
  },
  safetyScore: 85,
  checkInTime: new Date().toISOString(),
  lastActivity: new Date().toISOString(),
  itinerary: {
    destination: 'New York City',
    startDate: '2024-01-15',
    endDate: '2024-01-22',
    accommodation: 'Hotel ABC'
  },
  riskLevel: 'low',
  preferences: {
    language: 'en',
    notifications: true,
    tracking: true
  },
  kycDocuments: [
    {
      type: 'passport',
      url: '/documents/passport.jpg',
      verified: true
    }
  ],
  createdAt: new Date().toISOString(),
  updatedAt: new Date().toISOString(),
  ...overrides
});

export const createMockAlert = (overrides: any = {}) => ({
  id: 'alert-1',
  touristId: 'tourist-1',
  type: 'emergency',
  severity: 'high',
  title: 'Emergency Alert',
  description: 'Tourist in distress',
  status: 'active',
  location: {
    latitude: 40.7128,
    longitude: -74.0060,
    address: 'Emergency Location'
  },
  metadata: {
    source: 'panic_button',
    deviceId: 'device-123'
  },
  assignedTo: 'officer-1',
  responseTime: undefined,
  resolvedAt: undefined,
  createdAt: new Date().toISOString(),
  updatedAt: new Date().toISOString(),
  ...overrides
});

export const createMockTourists = (count: number = 5) => {
  return Array.from({ length: count }, (_, index) => 
    createMockTourist({
      id: `tourist-${index + 1}`,
      name: `Tourist ${index + 1}`,
      email: `tourist${index + 1}@example.com`,
      status: index % 3 === 0 ? 'inactive' : 'active',
      safetyScore: 70 + (index * 5),
      riskLevel: index % 4 === 0 ? 'high' : index % 3 === 0 ? 'medium' : 'low'
    })
  );
};

// ============================================================================
// MOCK API RESPONSES
// ============================================================================

export const mockApiResponses = {
  getTourists: {
    success: {
      data: createMockTourists(10),
      total: 10,
      page: 1,
      limit: 10
    },
    error: {
      error: 'Failed to fetch tourists',
      code: 'FETCH_ERROR'
    }
  },
  
  login: {
    success: {
      token: 'mock-jwt-token',
      user: {
        id: 'user-1',
        email: 'test@example.com',
        role: 'admin'
      }
    },
    error: {
      error: 'Invalid credentials',
      code: 'INVALID_CREDENTIALS'
    }
  }
};

// ============================================================================
// UTILITY FUNCTIONS
// ============================================================================

export const mockFetch = (response: any, ok: boolean = true) => {
  return jest.fn().mockResolvedValue({
    ok,
    json: async () => response,
    text: async () => JSON.stringify(response),
    status: ok ? 200 : 400,
    statusText: ok ? 'OK' : 'Bad Request',
  });
};

export const mockLocalStorage = () => {
  const store: Record<string, string> = {};
  
  return {
    getItem: jest.fn((key: string) => store[key] || null),
    setItem: jest.fn((key: string, value: string) => {
      store[key] = value;
    }),
    removeItem: jest.fn((key: string) => {
      delete store[key];
    }),
    clear: jest.fn(() => {
      Object.keys(store).forEach(key => delete store[key]);
    }),
  };
};