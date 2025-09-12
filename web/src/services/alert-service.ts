/**
 * Smart Tourist Safety System - Alert Service
 * Comprehensive service for alert creation, management, and emergency response coordination
 */

import {
  Alert,
  AlertId,
  AlertType,
  AlertSeverity,
  AlertStatus,
  NotificationChannel,
  NotificationStatus,
  CreateAlertRequest,
  UpdateAlertRequest,
  AlertSearchFilters,
  AlertSearchResult,
  BulkAlertOperation,
  BulkAlertResult,
  EmergencyBroadcast,
  AlertMetrics,
  NotificationMetrics,
  AlertTemplate,
  EscalationRule,
  AlertWorkflow,
  AlertSubscription,
  AlertTarget,
  TriggerType,
  Notification,
  AlertLocation
} from '@/types/alert';
import { TouristId } from '@/types/tourist';
import { API_ENDPOINTS, API_CONFIG } from '@/lib/constants';

// ============================================================================
// SERVICE INTERFACES
// ============================================================================

export interface AlertApiResponse<T = any> {
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

export interface EmergencyDispatchRequest {
  alertId: AlertId;
  serviceType: 'police' | 'medical' | 'fire' | 'rescue' | 'security' | 'tourism_police';
  priority: 'low' | 'medium' | 'high' | 'critical' | 'emergency';
  location: AlertLocation;
  description: string;
  requiredResources?: string[];
  estimatedPersons?: number;
  specialInstructions?: string;
  contactPerson?: {
    name: string;
    phone: string;
    role: string;
  };
}

export interface AlertEscalationRequest {
  alertId: AlertId;
  currentLevel: number;
  newLevel: number;
  reason: string;
  escalatedBy: string;
  additionalContext?: string;
  urgencyLevel?: 'normal' | 'urgent' | 'critical';
  requiredApproval?: boolean;
}

export interface AutomatedTriggerConfig {
  id: string;
  name: string;
  type: TriggerType;
  conditions: Record<string, any>;
  alertTemplate: Partial<CreateAlertRequest>;
  isActive: boolean;
  cooldownMinutes: number;
  maxTriggersPerDay: number;
  priority: number;
  metadata?: {
    lastTriggered?: string;
    todayTriggers?: number;
    totalTriggers?: number;
  };
}

export interface NotificationBatchRequest {
  alertId: AlertId;
  recipients: Array<{
    id: string;
    type: 'tourist' | 'staff' | 'authority' | 'external';
    channels: NotificationChannel[];
    personalizedData?: Record<string, any>;
  }>;
  priority: 'low' | 'normal' | 'high' | 'urgent';
  scheduledAt?: string;
  batchSize?: number;
  delayBetweenBatches?: number;
}

export interface AlertAnalysisResult {
  alertId: AlertId;
  riskScore: number; // 0-100
  urgencyScore: number; // 0-100
  impactAssessment: {
    peopleAffected: number;
    areaAffected: number; // square km
    severityLevel: AlertSeverity;
    potentialCasualties: number;
  };
  recommendedActions: Array<{
    action: string;
    priority: number;
    estimatedTime: number; // minutes
    requiredResources: string[];
  }>;
  similarIncidents: Array<{
    alertId: AlertId;
    similarity: number; // 0-1
    outcome: string;
    resolutionTime: number;
  }>;
  mlPredictions?: {
    escalationProbability: number;
    estimatedResolutionTime: number;
    resourceRequirements: string[];
  };
}

// ============================================================================
// HTTP CLIENT
// ============================================================================

class AlertApiClient {
  private baseURL: string;
  private timeout: number;

  constructor() {
    this.baseURL = API_CONFIG.baseURL;
    this.timeout = API_CONFIG.timeout;
  }

  private async request<T>(
    endpoint: string,
    options: RequestInit = {}
  ): Promise<AlertApiResponse<T>> {
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

  async get<T>(endpoint: string): Promise<AlertApiResponse<T>> {
    return this.request<T>(endpoint, { method: 'GET' });
  }

  async post<T>(endpoint: string, data?: any): Promise<AlertApiResponse<T>> {
    return this.request<T>(endpoint, {
      method: 'POST',
      body: data ? JSON.stringify(data) : undefined,
    });
  }

  async put<T>(endpoint: string, data?: any): Promise<AlertApiResponse<T>> {
    return this.request<T>(endpoint, {
      method: 'PUT',
      body: data ? JSON.stringify(data) : undefined,
    });
  }

  async patch<T>(endpoint: string, data?: any): Promise<AlertApiResponse<T>> {
    return this.request<T>(endpoint, {
      method: 'PATCH',
      body: data ? JSON.stringify(data) : undefined,
    });
  }

  async delete<T>(endpoint: string): Promise<AlertApiResponse<T>> {
    return this.request<T>(endpoint, { method: 'DELETE' });
  }
}

// ============================================================================
// ALERT SERVICE
// ============================================================================

export class AlertService {
  private api: AlertApiClient;
  private cache: Map<string, { data: any; timestamp: number; ttl: number }>;
  private websocket: WebSocket | null = null;
  private automatedTriggers: Map<string, AutomatedTriggerConfig> = new Map();
  private escalationRules: EscalationRule[] = [];
  private notificationQueue: Array<{ notification: Notification; retryCount: number }> = [];
  private queueProcessingInterval: NodeJS.Timeout | null = null;

  constructor() {
    this.api = new AlertApiClient();
    this.cache = new Map();
    this.initializeNotificationQueue();
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
  // ALERT CRUD OPERATIONS
  // ============================================================================

  async getAllAlerts(filters?: AlertSearchFilters): Promise<Alert[]> {
    try {
      const cacheKey = this.getCacheKey('/alerts', filters);
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

      const endpoint = `${API_ENDPOINTS.alerts?.list || '/alerts'}${queryParams ? `?${queryParams}` : ''}`;
      const response = await this.api.get<Alert[]>(endpoint);

      if (response.success && response.data) {
        this.setCache(cacheKey, response.data);
        return response.data;
      }

      throw new Error(response.error?.message || 'Failed to fetch alerts');
    } catch (error) {
      console.error('Failed to fetch alerts:', error);
      throw error;
    }
  }

  async getAlertById(id: AlertId): Promise<Alert> {
    try {
      const cacheKey = this.getCacheKey(`/alerts/${id}`);
      const cached = this.getCache(cacheKey);
      if (cached) return cached;

      const endpoint = API_ENDPOINTS.alerts?.get?.(id) || `/alerts/${id}`;
      const response = await this.api.get<Alert>(endpoint);

      if (response.success && response.data) {
        this.setCache(cacheKey, response.data, 2 * 60 * 1000); // 2 minutes for individual alerts
        return response.data;
      }

      throw new Error(response.error?.message || 'Alert not found');
    } catch (error) {
      console.error(`Failed to fetch alert ${id}:`, error);
      throw error;
    }
  }

  async createAlert(request: CreateAlertRequest): Promise<Alert> {
    try {
      // Validate request
      this.validateCreateAlertRequest(request);

      // Check for automated triggers
      const triggerId = this.checkAutomatedTriggers(request);
      if (triggerId) {
        request.metadata = {
          ...request.metadata,
          automatedTrigger: true,
          triggerId
        };
      }

      const endpoint = API_ENDPOINTS.alerts?.create || '/alerts';
      const response = await this.api.post<Alert>(endpoint, request);

      if (response.success && response.data) {
        this.clearCache('/alerts');
        
        // Automatically analyze the alert
        this.analyzeAlert(response.data.id).catch(console.error);
        
        // Check escalation rules
        this.checkEscalationRules(response.data).catch(console.error);
        
        return response.data;
      }

      throw new Error(response.error?.message || 'Failed to create alert');
    } catch (error) {
      console.error('Failed to create alert:', error);
      throw error;
    }
  }

  async updateAlert(request: UpdateAlertRequest): Promise<Alert> {
    try {
      const endpoint = API_ENDPOINTS.alerts?.update?.(request.id) || `/alerts/${request.id}`;
      const response = await this.api.put<Alert>(endpoint, request);

      if (response.success && response.data) {
        this.clearCache('/alerts');
        this.clearCache(`/alerts/${request.id}`);
        
        // If status changed to resolved, log resolution analytics
        if (request.updates?.status === AlertStatus.RESOLVED) {
          this.logResolutionMetrics(response.data).catch(console.error);
        }
        
        return response.data;
      }

      throw new Error(response.error?.message || 'Failed to update alert');
    } catch (error) {
      console.error(`Failed to update alert ${request.id}:`, error);
      throw error;
    }
  }

  async deleteAlert(id: AlertId, reason?: string): Promise<void> {
    try {
      const endpoint = `${API_ENDPOINTS.alerts?.delete?.(id) || `/alerts/${id}`}${reason ? `?reason=${encodeURIComponent(reason)}` : ''}`;
      const response = await this.api.delete(endpoint);

      if (!response.success) {
        throw new Error(response.error?.message || 'Failed to delete alert');
      }

      this.clearCache('/alerts');
      this.clearCache(`/alerts/${id}`);
    } catch (error) {
      console.error(`Failed to delete alert ${id}:`, error);
      throw error;
    }
  }

  // ============================================================================
  // ALERT STATUS MANAGEMENT
  // ============================================================================

  async acknowledgeAlert(id: AlertId, acknowledgedBy: string, message?: string): Promise<void> {
    try {
      const endpoint = `${API_ENDPOINTS.alerts?.get?.(id) || `/alerts/${id}`}/acknowledge`;
      const response = await this.api.post(endpoint, {
        acknowledgedBy,
        message,
        acknowledgedAt: new Date().toISOString(),
      });

      if (!response.success) {
        throw new Error(response.error?.message || 'Failed to acknowledge alert');
      }

      this.clearCache('/alerts');
      this.clearCache(`/alerts/${id}`);
    } catch (error) {
      console.error(`Failed to acknowledge alert ${id}:`, error);
      throw error;
    }
  }

  async resolveAlert(id: AlertId, resolvedBy: string, resolution: string, outcome?: string): Promise<void> {
    try {
      const endpoint = `${API_ENDPOINTS.alerts?.get?.(id) || `/alerts/${id}`}/resolve`;
      const response = await this.api.post(endpoint, {
        resolvedBy,
        resolution,
        outcome,
        resolvedAt: new Date().toISOString(),
      });

      if (!response.success) {
        throw new Error(response.error?.message || 'Failed to resolve alert');
      }

      this.clearCache('/alerts');
      this.clearCache(`/alerts/${id}`);
      
      // Log resolution for analytics
      const alert = await this.getAlertById(id);
      this.logResolutionMetrics(alert).catch(console.error);
    } catch (error) {
      console.error(`Failed to resolve alert ${id}:`, error);
      throw error;
    }
  }

  async escalateAlert(request: AlertEscalationRequest): Promise<void> {
    try {
      // Check if escalation requires approval
      if (request.requiredApproval && request.newLevel > 2) {
        await this.requestEscalationApproval(request);
        return;
      }

      const endpoint = `${API_ENDPOINTS.alerts?.get?.(request.alertId) || `/alerts/${request.alertId}`}/escalate`;
      const response = await this.api.post(endpoint, {
        ...request,
        escalatedAt: new Date().toISOString(),
      });

      if (!response.success) {
        throw new Error(response.error?.message || 'Failed to escalate alert');
      }

      this.clearCache('/alerts');
      this.clearCache(`/alerts/${request.alertId}`);
      
      // Notify relevant authorities about escalation
      this.notifyEscalation(request).catch(console.error);
    } catch (error) {
      console.error(`Failed to escalate alert ${request.alertId}:`, error);
      throw error;
    }
  }

  // ============================================================================
  // SEARCH AND FILTERING
  // ============================================================================

  async searchAlerts(filters: AlertSearchFilters): Promise<AlertSearchResult> {
    try {
      const response = await this.api.post<AlertSearchResult>(
        '/alerts/search',
        filters
      );

      if (response.success && response.data) {
        return response.data;
      }

      throw new Error(response.error?.message || 'Search failed');
    } catch (error) {
      console.error('Failed to search alerts:', error);
      throw error;
    }
  }

  // ============================================================================
  // EMERGENCY RESPONSE COORDINATION
  // ============================================================================

  async dispatchEmergencyServices(request: EmergencyDispatchRequest): Promise<string> {
    try {
      const response = await this.api.post<{ dispatchId: string }>('/emergency/dispatch', {
        ...request,
        dispatchedAt: new Date().toISOString(),
        status: 'dispatched'
      });

      if (response.success && response.data) {
        // Update alert with dispatch information
        await this.updateAlert({
          id: request.alertId,
          updates: {
            metadata: {
              dispatchId: response.data.dispatchId,
              serviceDispatched: request.serviceType,
              dispatchedAt: new Date().toISOString(),
              estimatedArrival: this.calculateEstimatedArrival(request.location, request.serviceType)
            }
          }
        });

        return response.data.dispatchId;
      }

      throw new Error(response.error?.message || 'Failed to dispatch emergency services');
    } catch (error) {
      console.error('Failed to dispatch emergency services:', error);
      throw error;
    }
  }

  async trackEmergencyResponse(dispatchId: string): Promise<any> {
    try {
      const response = await this.api.get<any>(`/emergency/dispatch/${dispatchId}/status`);

      if (response.success && response.data) {
        return response.data;
      }

      throw new Error(response.error?.message || 'Failed to track emergency response');
    } catch (error) {
      console.error(`Failed to track emergency response ${dispatchId}:`, error);
      throw error;
    }
  }

  async coordinateMultiAgencyResponse(alertId: AlertId, agencies: string[]): Promise<void> {
    try {
      const response = await this.api.post(`/emergency/coordinate`, {
        alertId,
        agencies,
        coordinatedAt: new Date().toISOString(),
        coordinationType: 'multi_agency'
      });

      if (!response.success) {
        throw new Error(response.error?.message || 'Failed to coordinate response');
      }

      // Update alert with coordination information
      await this.updateAlert({
        id: alertId,
        updates: {
          metadata: {
            multiAgencyResponse: true,
            coordinatedAgencies: agencies,
            coordinatedAt: new Date().toISOString()
          }
        }
      });
    } catch (error) {
      console.error('Failed to coordinate multi-agency response:', error);
      throw error;
    }
  }

  // ============================================================================
  // NOTIFICATION MANAGEMENT
  // ============================================================================

  private initializeNotificationQueue(): void {
    // Process notification queue every 2 seconds
    this.queueProcessingInterval = setInterval(() => {
      this.processNotificationQueue();
    }, 2000);
  }

  private async processNotificationQueue(): Promise<void> {
    if (this.notificationQueue.length === 0) return;

    const batch = this.notificationQueue.splice(0, 10); // Process 10 notifications at a time

    for (const { notification, retryCount } of batch) {
      try {
        await this.sendNotification(notification);
      } catch (error) {
        if (retryCount < 3) {
          // Re-queue with incremented retry count
          this.notificationQueue.push({ notification, retryCount: retryCount + 1 });
        } else {
          console.error(`Failed to send notification ${notification.id} after 3 retries:`, error);
          // Mark notification as failed
          await this.updateNotificationStatus(notification.id, NotificationStatus.FAILED, error instanceof Error ? error.message : 'Unknown error');
        }
      }
    }
  }

  async sendBatchNotifications(request: NotificationBatchRequest): Promise<void> {
    try {
      const alert = await this.getAlertById(request.alertId);
      
      for (const recipient of request.recipients) {
        for (const channel of recipient.channels) {
          const notification: Notification = {
            id: `notif-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
            alertId: request.alertId,
            recipientId: recipient.id,
            recipientType: recipient.type,
            channel,
            channelData: {},
            title: alert.title,
            message: this.personalizeMessage(alert.message, recipient.personalizedData || {}),
            status: NotificationStatus.PENDING,
            attempts: 0,
            maxAttempts: 3,
            scheduledAt: request.scheduledAt || new Date().toISOString()
          };

          // Add to processing queue
          this.notificationQueue.push({ notification, retryCount: 0 });
        }
      }
    } catch (error) {
      console.error('Failed to send batch notifications:', error);
      throw error;
    }
  }

  private async sendNotification(notification: Notification): Promise<void> {
    const response = await this.api.post('/notifications/send', notification);

    if (!response.success) {
      throw new Error(response.error?.message || 'Failed to send notification');
    }

    await this.updateNotificationStatus(notification.id, NotificationStatus.SENT);
  }

  private async updateNotificationStatus(id: string, status: NotificationStatus, error?: string): Promise<void> {
    try {
      await this.api.patch(`/notifications/${id}/status`, {
        status,
        error,
        updatedAt: new Date().toISOString()
      });
    } catch (err) {
      console.error(`Failed to update notification ${id} status:`, err);
    }
  }

  private personalizeMessage(template: string, data: Record<string, any>): string {
    let message = template;
    
    // Replace placeholders like {{name}}, {{location}}, etc.
    Object.entries(data).forEach(([key, value]) => {
      message = message.replace(new RegExp(`{{${key}}}`, 'g'), String(value));
    });
    
    return message;
  }

  // ============================================================================
  // AUTOMATED TRIGGERS AND RULES
  // ============================================================================

  async configureAutomatedTrigger(config: AutomatedTriggerConfig): Promise<void> {
    try {
      const response = await this.api.post('/alerts/triggers', config);

      if (response.success) {
        this.automatedTriggers.set(config.id, config);
      } else {
        throw new Error(response.error?.message || 'Failed to configure trigger');
      }
    } catch (error) {
      console.error('Failed to configure automated trigger:', error);
      throw error;
    }
  }

  private checkAutomatedTriggers(alertData: CreateAlertRequest): string | null {
    for (const [triggerId, config] of this.automatedTriggers) {
      if (!config.isActive) continue;

      // Check if conditions match
      if (this.evaluateTriggerConditions(config.conditions, alertData)) {
        // Check cooldown
        const lastTriggered = config.metadata?.lastTriggered;
        if (lastTriggered) {
          const cooldownExpired = Date.now() - new Date(lastTriggered).getTime() > config.cooldownMinutes * 60 * 1000;
          if (!cooldownExpired) continue;
        }

        // Check daily limit
        const todayTriggers = config.metadata?.todayTriggers || 0;
        if (todayTriggers >= config.maxTriggersPerDay) continue;

        return triggerId;
      }
    }

    return null;
  }

  private evaluateTriggerConditions(conditions: Record<string, any>, alertData: CreateAlertRequest): boolean {
    // Simple condition evaluation - can be enhanced with a proper rule engine
    for (const [key, expectedValue] of Object.entries(conditions)) {
      const actualValue = this.getNestedValue(alertData, key);
      if (actualValue !== expectedValue) {
        return false;
      }
    }
    return true;
  }

  private getNestedValue(obj: any, path: string): any {
    return path.split('.').reduce((current, key) => current?.[key], obj);
  }

  async loadEscalationRules(): Promise<void> {
    try {
      const response = await this.api.get<EscalationRule[]>('/alerts/escalation-rules');

      if (response.success && response.data) {
        this.escalationRules = response.data;
      }
    } catch (error) {
      console.error('Failed to load escalation rules:', error);
    }
  }

  private async checkEscalationRules(alert: Alert): Promise<void> {
    for (const rule of this.escalationRules) {
      if (!rule.isActive) continue;

      // Check if rule applies to this alert
      if (rule.alertTypes.includes(alert.type) && rule.severities.includes(alert.severity)) {
        // Schedule escalation check
        setTimeout(() => {
          this.evaluateEscalationRule(alert.id, rule);
        }, rule.conditions.noAcknowledgment * 60 * 1000);
      }
    }
  }

  private async evaluateEscalationRule(alertId: AlertId, rule: EscalationRule): Promise<void> {
    try {
      const currentAlert = await this.getAlertById(alertId);
      
      // Check if alert still needs escalation
      if (currentAlert.status === AlertStatus.RESOLVED || currentAlert.acknowledgedAt) {
        return;
      }

      const timeSinceCreated = Date.now() - new Date(currentAlert.createdAt).getTime();
      const shouldEscalate = timeSinceCreated > rule.conditions.noAcknowledgment * 60 * 1000;

      if (shouldEscalate) {
        await this.escalateAlert({
          alertId,
          currentLevel: currentAlert.escalationLevel,
          newLevel: currentAlert.escalationLevel + 1,
          reason: `Automatic escalation due to rule: ${rule.name}`,
          escalatedBy: 'system',
          urgencyLevel: 'urgent'
        });
      }
    } catch (error) {
      console.error(`Failed to evaluate escalation rule for alert ${alertId}:`, error);
    }
  }

  // ============================================================================
  // ANALYTICS AND ANALYSIS
  // ============================================================================

  async analyzeAlert(alertId: AlertId): Promise<AlertAnalysisResult> {
    try {
      const response = await this.api.post<AlertAnalysisResult>(`/alerts/${alertId}/analyze`);

      if (response.success && response.data) {
        return response.data;
      }

      throw new Error(response.error?.message || 'Failed to analyze alert');
    } catch (error) {
      console.error(`Failed to analyze alert ${alertId}:`, error);
      throw error;
    }
  }

  async getAlertMetrics(dateRange?: { start: string; end: string }): Promise<AlertMetrics> {
    try {
      const params = dateRange ? `?start=${dateRange.start}&end=${dateRange.end}` : '';
      const response = await this.api.get<AlertMetrics>(`/alerts/metrics${params}`);

      if (response.success && response.data) {
        return response.data;
      }

      throw new Error(response.error?.message || 'Failed to fetch alert metrics');
    } catch (error) {
      console.error('Failed to fetch alert metrics:', error);
      throw error;
    }
  }

  async getNotificationMetrics(dateRange?: { start: string; end: string }): Promise<NotificationMetrics> {
    try {
      const params = dateRange ? `?start=${dateRange.start}&end=${dateRange.end}` : '';
      const response = await this.api.get<NotificationMetrics>(`/notifications/metrics${params}`);

      if (response.success && response.data) {
        return response.data;
      }

      throw new Error(response.error?.message || 'Failed to fetch notification metrics');
    } catch (error) {
      console.error('Failed to fetch notification metrics:', error);
      throw error;
    }
  }

  // ============================================================================
  // BULK OPERATIONS
  // ============================================================================

  async performBulkOperation(operation: BulkAlertOperation): Promise<BulkAlertResult> {
    try {
      const response = await this.api.post<BulkAlertResult>('/alerts/bulk', {
        ...operation,
        performedAt: new Date().toISOString(),
      });

      if (response.success && response.data) {
        this.clearCache('/alerts');
        return response.data;
      }

      throw new Error(response.error?.message || 'Bulk operation failed');
    } catch (error) {
      console.error('Failed to perform bulk operation:', error);
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

    const wsUrl = `${API_CONFIG.baseURL.replace('http', 'ws')}/alerts/ws`;
    this.websocket = new WebSocket(wsUrl);

    this.websocket.onopen = () => {
      console.log('Alert WebSocket connected');
    };

    this.websocket.onmessage = (event) => {
      try {
        const data = JSON.parse(event.data);
        if (onMessage) {
          onMessage(data);
        }

        // Invalidate relevant cache
        if (data.alertId) {
          this.clearCache(`/alerts/${data.alertId}`);
        }
        if (data.type === 'alert_update' || data.type === 'new_alert') {
          this.clearCache('/alerts');
        }
      } catch (error) {
        console.error('Failed to parse WebSocket message:', error);
      }
    };

    this.websocket.onerror = (error) => {
      console.error('Alert WebSocket error:', error);
    };

    this.websocket.onclose = () => {
      console.log('Alert WebSocket disconnected');

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

  private validateCreateAlertRequest(request: CreateAlertRequest): void {
    if (!request.type || !request.severity || !request.title || !request.message) {
      throw new Error('Missing required fields: type, severity, title, message');
    }

    if (!request.target) {
      throw new Error('Alert target is required');
    }

    // Additional validation logic
    if (request.severity === AlertSeverity.CRITICAL && !request.location) {
      console.warn('Critical alerts should include location information');
    }
  }

  private calculateEstimatedArrival(location: AlertLocation, serviceType: string): string {
    // Simple estimation based on service type and distance
    // In a real implementation, this would use routing APIs and real-time traffic data
    const baseResponseTimes = {
      police: 8,
      medical: 12,
      fire: 15,
      rescue: 20,
      security: 5,
      tourism_police: 10
    };

    const baseTime = baseResponseTimes[serviceType as keyof typeof baseResponseTimes] || 15;
    const estimatedMinutes = baseTime + Math.random() * 10; // Add some variability

    const arrivalTime = new Date(Date.now() + estimatedMinutes * 60 * 1000);
    return arrivalTime.toISOString();
  }

  private async requestEscalationApproval(request: AlertEscalationRequest): Promise<void> {
    // Send approval request to appropriate authorities
    await this.api.post('/alerts/escalation/approval-request', {
      ...request,
      requestedAt: new Date().toISOString(),
      status: 'pending_approval'
    });
  }

  private async notifyEscalation(request: AlertEscalationRequest): Promise<void> {
    // Notify relevant stakeholders about escalation
    const notificationRequest: NotificationBatchRequest = {
      alertId: request.alertId,
      recipients: [
        {
          id: 'escalation-team',
          type: 'authority',
          channels: [NotificationChannel.EMAIL, NotificationChannel.SMS]
        }
      ],
      priority: 'urgent'
    };

    await this.sendBatchNotifications(notificationRequest);
  }

  private async logResolutionMetrics(alert: Alert): Promise<void> {
    try {
      const resolutionTime = alert.resolvedAt && alert.createdAt
        ? new Date(alert.resolvedAt).getTime() - new Date(alert.createdAt).getTime()
        : null;

      await this.api.post('/alerts/metrics/resolution', {
        alertId: alert.id,
        alertType: alert.type,
        severity: alert.severity,
        resolutionTime: resolutionTime ? Math.round(resolutionTime / (1000 * 60)) : null, // in minutes
        escalationLevel: alert.escalationLevel,
        resolvedAt: alert.resolvedAt,
        wasEscalated: alert.escalationLevel > 0
      });
    } catch (error) {
      console.error('Failed to log resolution metrics:', error);
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
    this.notificationQueue = [];
    this.automatedTriggers.clear();
    this.escalationRules = [];
  }
}

// ============================================================================
// SINGLETON INSTANCE
// ============================================================================

export const alertService = new AlertService();

// ============================================================================
// CONVENIENCE FUNCTIONS
// ============================================================================

export const createAlert = (request: CreateAlertRequest) =>
  alertService.createAlert(request);

export const updateAlert = (request: UpdateAlertRequest) =>
  alertService.updateAlert(request);

export const deleteAlert = (id: AlertId, reason?: string) =>
  alertService.deleteAlert(id, reason);

export const getAlertById = (id: AlertId) =>
  alertService.getAlertById(id);

export const getAllAlerts = (filters?: AlertSearchFilters) =>
  alertService.getAllAlerts(filters);

export const searchAlerts = (filters: AlertSearchFilters) =>
  alertService.searchAlerts(filters);

export const acknowledgeAlert = (id: AlertId, acknowledgedBy: string, message?: string) =>
  alertService.acknowledgeAlert(id, acknowledgedBy, message);

export const resolveAlert = (id: AlertId, resolvedBy: string, resolution: string, outcome?: string) =>
  alertService.resolveAlert(id, resolvedBy, resolution, outcome);

export const escalateAlert = (request: AlertEscalationRequest) =>
  alertService.escalateAlert(request);

export const dispatchEmergencyServices = (request: EmergencyDispatchRequest) =>
  alertService.dispatchEmergencyServices(request);

export const sendBatchNotifications = (request: NotificationBatchRequest) =>
  alertService.sendBatchNotifications(request);

export const analyzeAlert = (alertId: AlertId) =>
  alertService.analyzeAlert(alertId);

export const getAlertMetrics = (dateRange?: { start: string; end: string }) =>
  alertService.getAlertMetrics(dateRange);

export const performBulkOperation = (operation: BulkAlertOperation) =>
  alertService.performBulkOperation(operation);

export default alertService;
