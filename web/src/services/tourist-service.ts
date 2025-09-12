/**
 * Smart Tourist Safety System - Tourist Service
 * Comprehensive service for tourist data management and API interactions
 */

import { 
  Tourist, 
  TouristId, 
  TouristStatus, 
  VerificationStatus,
  TouristSearchFilters,
  TouristSearchResult,
  TouristStatistics,
  TouristAlert,
  LocationData,
  LocationHistory,
  CreateTouristRequest,
  UpdateTouristRequest,
  TouristLocationUpdate,
  CheckInRequest,
  EmergencyRequest,
  AlertLevel,
  BulkTouristOperation,
  BulkOperationResult,
  EmergencyContact,
  IdentityDocument,
  DeviceInfo
} from '@/types/tourist';
import { API_ENDPOINTS, API_CONFIG } from '@/lib/constants';

// ============================================================================
// SERVICE INTERFACES
// ============================================================================

export interface TouristApiResponse<T = any> {
  success: boolean;
  data?: T;
  message?: string;
  error?: {
    code: string;
    message: string;
    details?: any;
  };
  metadata?: {
    timestamp: string;
    requestId: string;
    totalCount?: number;
    page?: number;
    limit?: number;
  };
}

export interface TouristExportOptions {
  format: 'csv' | 'excel' | 'json' | 'pdf';
  fields: string[];
  filters?: TouristSearchFilters;
  includePersonalData: boolean;
  includeLocationHistory: boolean;
  includeAlerts: boolean;
  dateRange?: {
    start: string;
    end: string;
  };
}

export interface TouristImportOptions {
  file: File;
  format: 'csv' | 'excel' | 'json';
  validateOnly: boolean;
  updateExisting: boolean;
  skipErrors: boolean;
}

export interface TouristImportResult {
  totalProcessed: number;
  successful: number;
  failed: number;
  errors: Array<{
    row: number;
    field?: string;
    message: string;
    data?: any;
  }>;
  warnings: Array<{
    row: number;
    message: string;
  }>;
  importedTourists: Tourist[];
}

// ============================================================================
// HTTP CLIENT
// ============================================================================

class ApiClient {
  private baseURL: string;
  private timeout: number;

  constructor() {
    this.baseURL = API_CONFIG.baseURL;
    this.timeout = API_CONFIG.timeout;
  }

  private async request<T>(
    endpoint: string, 
    options: RequestInit = {}
  ): Promise<TouristApiResponse<T>> {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), this.timeout);

    try {
      const token = this.getAuthToken();
      
      const response = await fetch(`${this.baseURL}${endpoint}`, {
        ...options,
        headers: {
          'Content-Type': 'application/json',
          ...(token && { Authorization: `Bearer ${token}` }),
          ...options.headers,
        },
        signal: controller.signal,
      });

      clearTimeout(timeoutId);

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || `HTTP ${response.status}: ${response.statusText}`);
      }

      return data;
    } catch (error) {
      clearTimeout(timeoutId);
      
      if (error instanceof Error) {
        if (error.name === 'AbortError') {
          throw new Error('Request timeout');
        }
        throw error;
      }
      
      throw new Error('Unknown error occurred');
    }
  }

  private getAuthToken(): string | null {
    if (typeof window !== 'undefined') {
      return localStorage.getItem('auth_token');
    }
    return null;
  }

  async get<T>(endpoint: string): Promise<TouristApiResponse<T>> {
    return this.request<T>(endpoint, { method: 'GET' });
  }

  async post<T>(endpoint: string, data?: any): Promise<TouristApiResponse<T>> {
    return this.request<T>(endpoint, {
      method: 'POST',
      body: data ? JSON.stringify(data) : undefined,
    });
  }

  async put<T>(endpoint: string, data?: any): Promise<TouristApiResponse<T>> {
    return this.request<T>(endpoint, {
      method: 'PUT',
      body: data ? JSON.stringify(data) : undefined,
    });
  }

  async patch<T>(endpoint: string, data?: any): Promise<TouristApiResponse<T>> {
    return this.request<T>(endpoint, {
      method: 'PATCH',
      body: data ? JSON.stringify(data) : undefined,
    });
  }

  async delete<T>(endpoint: string): Promise<TouristApiResponse<T>> {
    return this.request<T>(endpoint, { method: 'DELETE' });
  }

  async upload<T>(endpoint: string, formData: FormData): Promise<TouristApiResponse<T>> {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), this.timeout * 2); // Double timeout for uploads

    try {
      const token = this.getAuthToken();
      
      const response = await fetch(`${this.baseURL}${endpoint}`, {
        method: 'POST',
        headers: {
          ...(token && { Authorization: `Bearer ${token}` }),
        },
        body: formData,
        signal: controller.signal,
      });

      clearTimeout(timeoutId);

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || `HTTP ${response.status}: ${response.statusText}`);
      }

      return data;
    } catch (error) {
      clearTimeout(timeoutId);
      
      if (error instanceof Error) {
        if (error.name === 'AbortError') {
          throw new Error('Upload timeout');
        }
        throw error;
      }
      
      throw new Error('Upload failed');
    }
  }
}

// ============================================================================
// TOURIST SERVICE
// ============================================================================

export class TouristService {
  private api: ApiClient;
  private cache: Map<string, { data: any; timestamp: number; ttl: number }>;
  private websocket: WebSocket | null = null;
  private locationUpdateQueue: TouristLocationUpdate[] = [];
  private queueProcessingInterval: NodeJS.Timeout | null = null;

  constructor() {
    this.api = new ApiClient();
    this.cache = new Map();
    this.initializeLocationQueue();
  }

  // ============================================================================
  // CACHING UTILITIES
  // ============================================================================

  private getCacheKey(endpoint: string, params?: any): string {
    return `${endpoint}${params ? `?${JSON.stringify(params)}` : ''}`;
  }

  private setCache(key: string, data: any, ttl: number = 5 * 60 * 1000): void {
    this.cache.set(key, {
      data,
      timestamp: Date.now(),
      ttl,
    });
  }

  private getCache(key: string): any | null {
    const cached = this.cache.get(key);
    if (!cached) return null;

    if (Date.now() - cached.timestamp > cached.ttl) {
      this.cache.delete(key);
      return null;
    }

    return cached.data;
  }

  private clearCache(pattern?: string): void {
    if (!pattern) {
      this.cache.clear();
      return;
    }

    for (const key of this.cache.keys()) {
      if (key.includes(pattern)) {
        this.cache.delete(key);
      }
    }
  }

  // ============================================================================
  // BASIC CRUD OPERATIONS
  // ============================================================================

  async getAllTourists(filters?: TouristSearchFilters): Promise<Tourist[]> {
    try {
      const cacheKey = this.getCacheKey('/tourists', filters);
      const cached = this.getCache(cacheKey);
      if (cached) return cached;

      const queryParams = filters ? new URLSearchParams(
        Object.entries(filters).reduce((acc, [key, value]) => {
          if (value !== undefined && value !== null) {
            if (Array.isArray(value)) {
              acc[key] = value.join(',');
            } else if (typeof value === 'object') {
              acc[key] = JSON.stringify(value);
            } else {
              acc[key] = String(value);
            }
          }
          return acc;
        }, {} as Record<string, string>)
      ).toString() : '';

      const endpoint = `${API_ENDPOINTS.tourists.list}${queryParams ? `?${queryParams}` : ''}`;
      const response = await this.api.get<Tourist[]>(endpoint);

      if (response.success && response.data) {
        this.setCache(cacheKey, response.data);
        return response.data;
      }

      throw new Error(response.error?.message || 'Failed to fetch tourists');
    } catch (error) {
      console.error('Failed to fetch tourists:', error);
      throw error;
    }
  }

  async getTouristById(id: TouristId, includeHistory: boolean = false): Promise<Tourist> {
    try {
      const cacheKey = this.getCacheKey(`/tourists/${id}`, { includeHistory });
      const cached = this.getCache(cacheKey);
      if (cached) return cached;

      const endpoint = `${API_ENDPOINTS.tourists.get(id)}${includeHistory ? '?include_history=true' : ''}`;
      const response = await this.api.get<Tourist>(endpoint);

      if (response.success && response.data) {
        this.setCache(cacheKey, response.data, 2 * 60 * 1000); // 2 minutes for individual tourists
        return response.data;
      }

      throw new Error(response.error?.message || 'Tourist not found');
    } catch (error) {
      console.error(`Failed to fetch tourist ${id}:`, error);
      throw error;
    }
  }

  async createTourist(request: CreateTouristRequest): Promise<Tourist> {
    try {
      const response = await this.api.post<Tourist>(API_ENDPOINTS.tourists.create, request);

      if (response.success && response.data) {
        this.clearCache('/tourists');
        return response.data;
      }

      throw new Error(response.error?.message || 'Failed to create tourist');
    } catch (error) {
      console.error('Failed to create tourist:', error);
      throw error;
    }
  }

  async updateTourist(request: UpdateTouristRequest): Promise<Tourist> {
    try {
      const response = await this.api.put<Tourist>(
        API_ENDPOINTS.tourists.update(request.id), 
        request
      );

      if (response.success && response.data) {
        this.clearCache('/tourists');
        return response.data;
      }

      throw new Error(response.error?.message || 'Failed to update tourist');
    } catch (error) {
      console.error(`Failed to update tourist ${request.id}:`, error);
      throw error;
    }
  }

  async deleteTourist(id: TouristId, reason?: string): Promise<void> {
    try {
      const endpoint = `${API_ENDPOINTS.tourists.delete(id)}${reason ? `?reason=${encodeURIComponent(reason)}` : ''}`;
      const response = await this.api.delete(endpoint);

      if (!response.success) {
        throw new Error(response.error?.message || 'Failed to delete tourist');
      }

      this.clearCache('/tourists');
    } catch (error) {
      console.error(`Failed to delete tourist ${id}:`, error);
      throw error;
    }
  }

  // ============================================================================
  // SEARCH AND FILTERING
  // ============================================================================

  async searchTourists(filters: TouristSearchFilters): Promise<TouristSearchResult> {
    try {
      const response = await this.api.post<TouristSearchResult>(
        API_ENDPOINTS.tourists.search, 
        filters
      );

      if (response.success && response.data) {
        return response.data;
      }

      throw new Error(response.error?.message || 'Search failed');
    } catch (error) {
      console.error('Failed to search tourists:', error);
      throw error;
    }
  }

  async getTouristStatistics(): Promise<TouristStatistics> {
    try {
      const cacheKey = this.getCacheKey('/tourists/statistics');
      const cached = this.getCache(cacheKey);
      if (cached) return cached;

      const response = await this.api.get<TouristStatistics>(API_ENDPOINTS.tourists.statistics);

      if (response.success && response.data) {
        this.setCache(cacheKey, response.data, 1 * 60 * 1000); // 1 minute for statistics
        return response.data;
      }

      throw new Error(response.error?.message || 'Failed to fetch statistics');
    } catch (error) {
      console.error('Failed to fetch tourist statistics:', error);
      throw error;
    }
  }

  // ============================================================================
  // VERIFICATION AND STATUS MANAGEMENT
  // ============================================================================

  async verifyTourist(
    id: TouristId, 
    method: string, 
    details: Record<string, any>
  ): Promise<void> {
    try {
      const response = await this.api.post(`${API_ENDPOINTS.tourists.get(id)}/verify`, {
        method,
        details,
        verifiedAt: new Date().toISOString(),
      });

      if (!response.success) {
        throw new Error(response.error?.message || 'Failed to verify tourist');
      }

      this.clearCache('/tourists');
    } catch (error) {
      console.error(`Failed to verify tourist ${id}:`, error);
      throw error;
    }
  }

  async updateTouristStatus(
    id: TouristId, 
    status: TouristStatus, 
    reason?: string
  ): Promise<void> {
    try {
      const response = await this.api.patch(`${API_ENDPOINTS.tourists.get(id)}/status`, {
        status,
        reason,
        updatedAt: new Date().toISOString(),
      });

      if (!response.success) {
        throw new Error(response.error?.message || 'Failed to update status');
      }

      this.clearCache('/tourists');
    } catch (error) {
      console.error(`Failed to update tourist status ${id}:`, error);
      throw error;
    }
  }

  // ============================================================================
  // LOCATION AND TRACKING
  // ============================================================================

  private initializeLocationQueue(): void {
    // Process location updates every 5 seconds
    this.queueProcessingInterval = setInterval(() => {
      this.processLocationQueue();
    }, 5000);
  }

  private async processLocationQueue(): Promise<void> {
    if (this.locationUpdateQueue.length === 0) return;

    const updates = [...this.locationUpdateQueue];
    this.locationUpdateQueue = [];

    try {
      const response = await this.api.post('/tourists/locations/batch', {
        updates,
        timestamp: new Date().toISOString(),
      });

      if (!response.success) {
        // Re-queue failed updates
        this.locationUpdateQueue.unshift(...updates);
        console.error('Failed to process location updates:', response.error);
      }
    } catch (error) {
      // Re-queue on error
      this.locationUpdateQueue.unshift(...updates);
      console.error('Location update batch failed:', error);
    }
  }

  async updateTouristLocation(update: TouristLocationUpdate): Promise<void> {
    try {
      // Add to queue for batch processing
      this.locationUpdateQueue.push(update);

      // For critical updates, send immediately
      if ((update.location.coordinates.accuracy && update.location.coordinates.accuracy < 50) || // High accuracy location
          (update.batteryLevel && update.batteryLevel < 20) ||
          update.location.source === 'manual') { // Manual check-ins are critical
        await this.api.post(API_ENDPOINTS.tourists.location(update.touristId), update);
      }

      this.clearCache(`/tourists/${update.touristId}`);
    } catch (error) {
      console.error(`Failed to queue location update for ${update.touristId}:`, error);
      throw error;
    }
  }

  async checkInTourist(request: CheckInRequest): Promise<void> {
    try {
      const response = await this.api.post(
        `${API_ENDPOINTS.tourists.get(request.touristId)}/checkin`, 
        request
      );

      if (!response.success) {
        throw new Error(response.error?.message || 'Check-in failed');
      }

      this.clearCache(`/tourists/${request.touristId}`);
    } catch (error) {
      console.error(`Failed to check in tourist ${request.touristId}:`, error);
      throw error;
    }
  }

  async getLocationHistory(
    id: TouristId, 
    limit: number = 100, 
    startDate?: string, 
    endDate?: string
  ): Promise<LocationHistory[]> {
    try {
      const params = new URLSearchParams({
        limit: limit.toString(),
        ...(startDate && { start_date: startDate }),
        ...(endDate && { end_date: endDate }),
      });

      const response = await this.api.get<LocationHistory[]>(
        `${API_ENDPOINTS.tourists.get(id)}/location-history?${params.toString()}`
      );

      if (response.success && response.data) {
        return response.data;
      }

      throw new Error(response.error?.message || 'Failed to fetch location history');
    } catch (error) {
      console.error(`Failed to fetch location history for ${id}:`, error);
      throw error;
    }
  }

  // ============================================================================
  // ALERTS AND EMERGENCY
  // ============================================================================

  async createAlert(touristId: TouristId, alert: Omit<TouristAlert, 'id' | 'timestamp'>): Promise<TouristAlert> {
    try {
      const response = await this.api.post<TouristAlert>(
        API_ENDPOINTS.tourists.alerts(touristId), 
        {
          ...alert,
          timestamp: new Date().toISOString(),
        }
      );

      if (response.success && response.data) {
        this.clearCache(`/tourists/${touristId}`);
        return response.data;
      }

      throw new Error(response.error?.message || 'Failed to create alert');
    } catch (error) {
      console.error(`Failed to create alert for tourist ${touristId}:`, error);
      throw error;
    }
  }

  async acknowledgeAlert(touristId: TouristId, alertId: string, acknowledgedBy: string): Promise<void> {
    try {
      const response = await this.api.patch(
        `${API_ENDPOINTS.tourists.alerts(touristId)}/${alertId}/acknowledge`, 
        {
          acknowledgedBy,
          acknowledgedAt: new Date().toISOString(),
        }
      );

      if (!response.success) {
        throw new Error(response.error?.message || 'Failed to acknowledge alert');
      }

      this.clearCache(`/tourists/${touristId}`);
    } catch (error) {
      console.error(`Failed to acknowledge alert ${alertId}:`, error);
      throw error;
    }
  }

  async resolveAlert(touristId: TouristId, alertId: string, resolution?: string): Promise<void> {
    try {
      const response = await this.api.patch(
        `${API_ENDPOINTS.tourists.alerts(touristId)}/${alertId}/resolve`, 
        {
          resolution,
          resolvedAt: new Date().toISOString(),
        }
      );

      if (!response.success) {
        throw new Error(response.error?.message || 'Failed to resolve alert');
      }

      this.clearCache(`/tourists/${touristId}`);
    } catch (error) {
      console.error(`Failed to resolve alert ${alertId}:`, error);
      throw error;
    }
  }

  async createEmergencyRequest(request: EmergencyRequest): Promise<void> {
    try {
      const response = await this.api.post('/emergency', {
        ...request,
        timestamp: new Date().toISOString(),
        priority: 'high',
      });

      if (!response.success) {
        throw new Error(response.error?.message || 'Failed to create emergency request');
      }

      this.clearCache(`/tourists/${request.touristId}`);
    } catch (error) {
      console.error(`Failed to create emergency request for ${request.touristId}:`, error);
      throw error;
    }
  }

  // ============================================================================
  // BULK OPERATIONS
  // ============================================================================

  async performBulkOperation(operation: BulkTouristOperation): Promise<BulkOperationResult> {
    try {
      const response = await this.api.post<BulkOperationResult>('/tourists/bulk', {
        ...operation,
        performedAt: new Date().toISOString(),
      });

      if (response.success && response.data) {
        this.clearCache('/tourists');
        return response.data;
      }

      throw new Error(response.error?.message || 'Bulk operation failed');
    } catch (error) {
      console.error('Failed to perform bulk operation:', error);
      throw error;
    }
  }

  // ============================================================================
  // IMPORT/EXPORT OPERATIONS
  // ============================================================================

  async exportTourists(options: TouristExportOptions): Promise<Blob> {
    try {
      const response = await fetch(`${this.api['baseURL']}/tourists/export`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${this.api['getAuthToken']()}`,
        },
        body: JSON.stringify(options),
      });

      if (!response.ok) {
        throw new Error(`Export failed: ${response.statusText}`);
      }

      return await response.blob();
    } catch (error) {
      console.error('Failed to export tourists:', error);
      throw error;
    }
  }

  async importTourists(options: TouristImportOptions): Promise<TouristImportResult> {
    try {
      const formData = new FormData();
      formData.append('file', options.file);
      formData.append('format', options.format);
      formData.append('validateOnly', String(options.validateOnly));
      formData.append('updateExisting', String(options.updateExisting));
      formData.append('skipErrors', String(options.skipErrors));

      const response = await this.api.upload<TouristImportResult>('/tourists/import', formData);

      if (response.success && response.data) {
        if (!options.validateOnly) {
          this.clearCache('/tourists');
        }
        return response.data;
      }

      throw new Error(response.error?.message || 'Import failed');
    } catch (error) {
      console.error('Failed to import tourists:', error);
      throw error;
    }
  }

  // ============================================================================
  // REAL-TIME FEATURES
  // ============================================================================

  connectWebSocket(onMessage?: (data: any) => void): void {
    if (this.websocket) {
      this.disconnectWebSocket();
    }

    const wsUrl = `${API_CONFIG.baseURL.replace('http', 'ws')}/tourists/ws`;
    this.websocket = new WebSocket(wsUrl);

    this.websocket.onopen = () => {
      console.log('Tourist WebSocket connected');
    };

    this.websocket.onmessage = (event) => {
      try {
        const data = JSON.parse(event.data);
        if (onMessage) {
          onMessage(data);
        }
        
        // Invalidate relevant cache
        if (data.touristId) {
          this.clearCache(`/tourists/${data.touristId}`);
        }
        if (data.type === 'tourist_update' || data.type === 'location_update') {
          this.clearCache('/tourists');
        }
      } catch (error) {
        console.error('Failed to parse WebSocket message:', error);
      }
    };

    this.websocket.onerror = (error) => {
      console.error('Tourist WebSocket error:', error);
    };

    this.websocket.onclose = () => {
      console.log('Tourist WebSocket disconnected');
      
      // Attempt to reconnect after 5 seconds
      setTimeout(() => {
        if (!this.websocket || this.websocket.readyState === WebSocket.CLOSED) {
          this.connectWebSocket(onMessage);
        }
      }, 5000);
    };
  }

  disconnectWebSocket(): void {
    if (this.websocket) {
      this.websocket.close();
      this.websocket = null;
    }
  }

  // ============================================================================
  // UTILITY METHODS
  // ============================================================================

  async validateTouristData(data: Partial<Tourist>): Promise<{ isValid: boolean; errors: string[] }> {
    try {
      const response = await this.api.post<{ isValid: boolean; errors: string[] }>(
        '/tourists/validate', 
        data
      );

      if (response.success && response.data) {
        return response.data;
      }

      return { isValid: false, errors: ['Validation service unavailable'] };
    } catch (error) {
      console.error('Failed to validate tourist data:', error);
      return { isValid: false, errors: ['Validation failed'] };
    }
  }

  async getSafetyScore(id: TouristId): Promise<number> {
    try {
      const response = await this.api.get<{ score: number }>(
        API_ENDPOINTS.tourists.safetyScore(id)
      );

      if (response.success && response.data) {
        return response.data.score;
      }

      throw new Error(response.error?.message || 'Failed to fetch safety score');
    } catch (error) {
      console.error(`Failed to fetch safety score for ${id}:`, error);
      throw error;
    }
  }

  async updateEmergencyContacts(id: TouristId, contacts: EmergencyContact[]): Promise<void> {
    try {
      const response = await this.api.put(
        `${API_ENDPOINTS.tourists.get(id)}/emergency-contacts`, 
        { contacts }
      );

      if (!response.success) {
        throw new Error(response.error?.message || 'Failed to update emergency contacts');
      }

      this.clearCache(`/tourists/${id}`);
    } catch (error) {
      console.error(`Failed to update emergency contacts for ${id}:`, error);
      throw error;
    }
  }

  async uploadDocument(id: TouristId, file: File, documentType: string): Promise<IdentityDocument> {
    try {
      const formData = new FormData();
      formData.append('document', file);
      formData.append('type', documentType);

      const response = await this.api.upload<IdentityDocument>(
        `${API_ENDPOINTS.tourists.get(id)}/documents`, 
        formData
      );

      if (response.success && response.data) {
        this.clearCache(`/tourists/${id}`);
        return response.data;
      }

      throw new Error(response.error?.message || 'Failed to upload document');
    } catch (error) {
      console.error(`Failed to upload document for ${id}:`, error);
      throw error;
    }
  }

  // ============================================================================
  // CLEANUP
  // ============================================================================

  destroy(): void {
    this.disconnectWebSocket();
    
    if (this.queueProcessingInterval) {
      clearInterval(this.queueProcessingInterval);
      this.queueProcessingInterval = null;
    }
    
    this.cache.clear();
    this.locationUpdateQueue = [];
  }
}

// ============================================================================
// SINGLETON INSTANCE
// ============================================================================

export const touristService = new TouristService();

// ============================================================================
// CONVENIENCE FUNCTIONS
// ============================================================================

export const createTourist = (request: CreateTouristRequest) => 
  touristService.createTourist(request);

export const updateTourist = (request: UpdateTouristRequest) => 
  touristService.updateTourist(request);

export const deleteTourist = (id: TouristId, reason?: string) => 
  touristService.deleteTourist(id, reason);

export const getTouristById = (id: TouristId, includeHistory?: boolean) => 
  touristService.getTouristById(id, includeHistory);

export const getAllTourists = (filters?: TouristSearchFilters) => 
  touristService.getAllTourists(filters);

export const searchTourists = (filters: TouristSearchFilters) => 
  touristService.searchTourists(filters);

export const updateTouristLocation = (update: TouristLocationUpdate) => 
  touristService.updateTouristLocation(update);

export const checkInTourist = (request: CheckInRequest) => 
  touristService.checkInTourist(request);

export const createEmergencyRequest = (request: EmergencyRequest) => 
  touristService.createEmergencyRequest(request);

export const getTouristStatistics = () => 
  touristService.getTouristStatistics();

export const performBulkOperation = (operation: BulkTouristOperation) => 
  touristService.performBulkOperation(operation);

export const exportTourists = (options: TouristExportOptions) => 
  touristService.exportTourists(options);

export const importTourists = (options: TouristImportOptions) => 
  touristService.importTourists(options);

export default touristService;
