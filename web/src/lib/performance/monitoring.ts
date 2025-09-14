/**
 * Smart Tourist Safety System - Performance Monitoring & Analytics
 * Comprehensive performance tracking, error logging, and user analytics for web dashboard
 */

'use client';

// ============================================================================
// INTERFACES & TYPES
// ============================================================================

export interface PerformanceMetrics {
  // Page Performance
  pageLoadTime: number;
  firstContentfulPaint: number;
  largestContentfulPaint: number;
  cumulativeLayoutShift: number;
  firstInputDelay: number;
  
  // API Performance
  apiResponseTimes: { [endpoint: string]: number[] };
  apiErrorRates: { [endpoint: string]: number };
  
  // User Interaction
  userActions: UserAction[];
  sessionDuration: number;
  bounceRate: number;
  
  // System Resources
  memoryUsage: number;
  networkCondition: string;
  deviceType: string;
  
  // Emergency System Performance
  emergencyResponseTime: number;
  alertProcessingTime: number;
  blockchainTransactionTime: number;
}

export interface UserAction {
  type: 'click' | 'navigation' | 'form_submit' | 'api_call' | 'emergency_action';
  element: string;
  timestamp: number;
  duration?: number;
  success: boolean;
  metadata?: Record<string, any>;
}

export interface ErrorLog {
  id: string;
  type: 'javascript' | 'api' | 'network' | 'security' | 'emergency';
  message: string;
  stack?: string;
  url: string;
  userAgent: string;
  userId?: string;
  touristId?: string;
  timestamp: number;
  severity: 'low' | 'medium' | 'high' | 'critical';
  resolved: boolean;
}

export interface AnalyticsData {
  // User Demographics
  userTypes: { [key: string]: number };
  deviceDistribution: { [key: string]: number };
  browserDistribution: { [key: string]: number };
  locationDistribution: { [key: string]: number };
  
  // Usage Patterns
  peakUsageHours: number[];
  mostUsedFeatures: { [feature: string]: number };
  averageSessionTime: number;
  
  // Emergency Analytics
  emergencyTypes: { [type: string]: number };
  responseTimesAverage: number;
  successfulResolutions: number;
  
  // System Health
  uptime: number;
  errorRate: number;
  performanceScore: number;
}

// ============================================================================
// PERFORMANCE MONITORING CLASS
// ============================================================================

export class PerformanceMonitor {
  private static instance: PerformanceMonitor;
  private metrics: PerformanceMetrics;
  private startTime: number;
  private observers: PerformanceObserver[] = [];

  private constructor() {
    this.startTime = performance.now();
    this.metrics = this.initializeMetrics();
    this.setupPerformanceObservers();
    this.startSessionTracking();
  }

  static getInstance(): PerformanceMonitor {
    if (!PerformanceMonitor.instance) {
      PerformanceMonitor.instance = new PerformanceMonitor();
    }
    return PerformanceMonitor.instance;
  }

  private initializeMetrics(): PerformanceMetrics {
    return {
      pageLoadTime: 0,
      firstContentfulPaint: 0,
      largestContentfulPaint: 0,
      cumulativeLayoutShift: 0,
      firstInputDelay: 0,
      apiResponseTimes: {},
      apiErrorRates: {},
      userActions: [],
      sessionDuration: 0,
      bounceRate: 0,
      memoryUsage: 0,
      networkCondition: this.getNetworkCondition(),
      deviceType: this.getDeviceType(),
      emergencyResponseTime: 0,
      alertProcessingTime: 0,
      blockchainTransactionTime: 0
    };
  }

  /**
   * Setup Web Performance API observers
   */
  private setupPerformanceObservers() {
    if (typeof window === 'undefined') return;

    // Core Web Vitals Observer
    try {
      const vitalsObserver = new PerformanceObserver((list) => {
        list.getEntries().forEach((entry) => {
          switch (entry.entryType) {
            case 'paint':
              if (entry.name === 'first-contentful-paint') {
                this.metrics.firstContentfulPaint = entry.startTime;
              }
              break;
            case 'largest-contentful-paint':
              this.metrics.largestContentfulPaint = entry.startTime;
              break;
            case 'layout-shift':
              if (!(entry as any).hadRecentInput) {
                this.metrics.cumulativeLayoutShift += (entry as any).value;
              }
              break;
            case 'first-input':
              this.metrics.firstInputDelay = (entry as any).processingStart - entry.startTime;
              break;
          }
        });
      });

      vitalsObserver.observe({ 
        entryTypes: ['paint', 'largest-contentful-paint', 'layout-shift', 'first-input'] 
      });
      this.observers.push(vitalsObserver);
    } catch (error) {
      console.warn('Performance observer not supported:', error);
    }

    // Navigation Timing
    window.addEventListener('load', () => {
      const navigation = performance.getEntriesByType('navigation')[0] as PerformanceNavigationTiming;
      this.metrics.pageLoadTime = navigation.loadEventEnd - navigation.fetchStart;
    });
  }

  /**
   * Track user session and interactions
   */
  private startSessionTracking() {
    if (typeof window === 'undefined') return;

    // Track session duration
    setInterval(() => {
      this.metrics.sessionDuration = performance.now() - this.startTime;
      this.updateMemoryUsage();
    }, 30000); // Update every 30 seconds

    // Track user interactions
    ['click', 'submit', 'change'].forEach(eventType => {
      document.addEventListener(eventType, (event) => {
        this.trackUserAction({
          type: eventType as any,
          element: this.getElementSelector(event.target as Element),
          timestamp: Date.now(),
          success: true
        });
      });
    });

    // Track page visibility changes
    document.addEventListener('visibilitychange', () => {
      if (document.hidden) {
        this.saveMetricsToStorage();
      }
    });

    // Track beforeunload
    window.addEventListener('beforeunload', () => {
      this.saveMetricsToStorage();
    });
  }

  /**
   * Track API call performance
   */
  trackApiCall(endpoint: string, startTime: number, endTime: number, success: boolean) {
    const responseTime = endTime - startTime;
    
    if (!this.metrics.apiResponseTimes[endpoint]) {
      this.metrics.apiResponseTimes[endpoint] = [];
      this.metrics.apiErrorRates[endpoint] = 0;
    }
    
    this.metrics.apiResponseTimes[endpoint].push(responseTime);
    
    if (!success) {
      this.metrics.apiErrorRates[endpoint]++;
    }

    // Keep only last 100 entries per endpoint
    if (this.metrics.apiResponseTimes[endpoint].length > 100) {
      this.metrics.apiResponseTimes[endpoint].shift();
    }
  }

  /**
   * Track emergency system performance
   */
  trackEmergencyResponse(type: 'alert' | 'response' | 'blockchain', duration: number) {
    switch (type) {
      case 'alert':
        this.metrics.alertProcessingTime = duration;
        break;
      case 'response':
        this.metrics.emergencyResponseTime = duration;
        break;
      case 'blockchain':
        this.metrics.blockchainTransactionTime = duration;
        break;
    }
  }

  /**
   * Track user actions
   */
  trackUserAction(action: UserAction) {
    this.metrics.userActions.push(action);
    
    // Keep only last 1000 actions
    if (this.metrics.userActions.length > 1000) {
      this.metrics.userActions.shift();
    }
  }

  /**
   * Get current performance metrics
   */
  getMetrics(): PerformanceMetrics {
    return { ...this.metrics };
  }

  /**
   * Generate performance report
   */
  generateReport(): string {
    const report = {
      timestamp: new Date().toISOString(),
      session: {
        duration: this.metrics.sessionDuration,
        userActions: this.metrics.userActions.length,
        bounceRate: this.calculateBounceRate()
      },
      performance: {
        pageLoad: this.metrics.pageLoadTime,
        fcp: this.metrics.firstContentfulPaint,
        lcp: this.metrics.largestContentfulPaint,
        cls: this.metrics.cumulativeLayoutShift,
        fid: this.metrics.firstInputDelay
      },
      api: {
        endpoints: Object.keys(this.metrics.apiResponseTimes).length,
        averageResponseTime: this.calculateAverageResponseTime(),
        errorRate: this.calculateApiErrorRate()
      },
      emergency: {
        alertProcessing: this.metrics.alertProcessingTime,
        responseTime: this.metrics.emergencyResponseTime,
        blockchainTime: this.metrics.blockchainTransactionTime
      },
      system: {
        memory: this.metrics.memoryUsage,
        network: this.metrics.networkCondition,
        device: this.metrics.deviceType
      }
    };

    return JSON.stringify(report, null, 2);
  }

  // ============================================================================
  // HELPER METHODS
  // ============================================================================

  private getDeviceType(): string {
    if (typeof window === 'undefined') return 'unknown';
    
    const userAgent = navigator.userAgent;
    if (/tablet|ipad|playbook|silk/i.test(userAgent)) return 'tablet';
    if (/mobile|iphone|ipod|android|blackberry|opera|mini|windows\sce|palm|smartphone|iemobile/i.test(userAgent)) return 'mobile';
    return 'desktop';
  }

  private getNetworkCondition(): string {
    if (typeof window === 'undefined' || !('connection' in navigator)) return 'unknown';
    
    const connection = (navigator as any).connection;
    return connection.effectiveType || 'unknown';
  }

  private updateMemoryUsage() {
    if (typeof window !== 'undefined' && 'memory' in performance) {
      const memory = (performance as any).memory;
      this.metrics.memoryUsage = memory.usedJSHeapSize / memory.jsHeapSizeLimit;
    }
  }

  private getElementSelector(element: Element): string {
    if (!element) return 'unknown';
    
    let selector = element.tagName.toLowerCase();
    if (element.id) selector += `#${element.id}`;
    if (element.className) selector += `.${element.className.split(' ').join('.')}`;
    
    return selector;
  }

  private calculateBounceRate(): number {
    const totalActions = this.metrics.userActions.length;
    if (totalActions < 2) return 100;
    
    const navigationActions = this.metrics.userActions.filter(a => a.type === 'navigation').length;
    return navigationActions === 1 ? 100 : 0;
  }

  private calculateAverageResponseTime(): number {
    const allTimes = Object.values(this.metrics.apiResponseTimes).flat();
    return allTimes.length > 0 ? allTimes.reduce((sum, time) => sum + time, 0) / allTimes.length : 0;
  }

  private calculateApiErrorRate(): number {
    const totalErrors = Object.values(this.metrics.apiErrorRates).reduce((sum, errors) => sum + errors, 0);
    const totalRequests = Object.values(this.metrics.apiResponseTimes).reduce((sum, times) => sum + times.length, 0);
    return totalRequests > 0 ? (totalErrors / totalRequests) * 100 : 0;
  }

  private saveMetricsToStorage() {
    try {
      localStorage.setItem('sts_performance_metrics', JSON.stringify(this.metrics));
    } catch (error) {
      console.warn('Could not save metrics to storage:', error);
    }
  }
}

// ============================================================================
// ERROR LOGGING CLASS
// ============================================================================

export class ErrorLogger {
  private static instance: ErrorLogger;
  private errors: ErrorLog[] = [];
  private maxErrors = 1000;

  private constructor() {
    this.setupGlobalErrorHandlers();
  }

  static getInstance(): ErrorLogger {
    if (!ErrorLogger.instance) {
      ErrorLogger.instance = new ErrorLogger();
    }
    return ErrorLogger.instance;
  }

  private setupGlobalErrorHandlers() {
    if (typeof window === 'undefined') return;

    // JavaScript errors
    window.addEventListener('error', (event) => {
      this.logError({
        type: 'javascript',
        message: event.message,
        stack: event.error?.stack,
        url: event.filename || window.location.href,
        severity: 'high'
      });
    });

    // Unhandled promise rejections
    window.addEventListener('unhandledrejection', (event) => {
      this.logError({
        type: 'javascript',
        message: `Unhandled promise rejection: ${event.reason}`,
        url: window.location.href,
        severity: 'high'
      });
    });

    // Network errors (fetch wrapper)
    this.wrapFetch();
  }

  /**
   * Log an error
   */
  logError(error: Partial<ErrorLog>) {
    const fullError: ErrorLog = {
      id: this.generateId(),
      type: error.type || 'javascript',
      message: error.message || 'Unknown error',
      stack: error.stack,
      url: error.url || window.location.href,
      userAgent: navigator.userAgent,
      userId: error.userId,
      touristId: error.touristId,
      timestamp: Date.now(),
      severity: error.severity || 'medium',
      resolved: false
    };

    this.errors.push(fullError);

    // Keep only the latest errors
    if (this.errors.length > this.maxErrors) {
      this.errors.shift();
    }

    // Log critical errors immediately
    if (fullError.severity === 'critical') {
      this.sendErrorToServer(fullError);
    }

    console.error('Error logged:', fullError);
  }

  /**
   * Get all errors or filter by type/severity
   */
  getErrors(filter?: { type?: string; severity?: string; resolved?: boolean }): ErrorLog[] {
    if (!filter) return [...this.errors];

    return this.errors.filter(error => {
      if (filter.type && error.type !== filter.type) return false;
      if (filter.severity && error.severity !== filter.severity) return false;
      if (filter.resolved !== undefined && error.resolved !== filter.resolved) return false;
      return true;
    });
  }

  /**
   * Mark error as resolved
   */
  resolveError(errorId: string) {
    const error = this.errors.find(e => e.id === errorId);
    if (error) {
      error.resolved = true;
    }
  }

  /**
   * Clear all errors
   */
  clearErrors() {
    this.errors = [];
  }

  private wrapFetch() {
    const originalFetch = window.fetch;
    window.fetch = async (...args) => {
      try {
        const response = await originalFetch(...args);
        if (!response.ok) {
          this.logError({
            type: 'network',
            message: `HTTP ${response.status}: ${response.statusText}`,
            url: args[0].toString(),
            severity: response.status >= 500 ? 'high' : 'medium'
          });
        }
        return response;
      } catch (error) {
        this.logError({
          type: 'network',
          message: `Network error: ${error}`,
          url: args[0].toString(),
          severity: 'high'
        });
        throw error;
      }
    };
  }

  private generateId(): string {
    return `error_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  }

  private async sendErrorToServer(error: ErrorLog) {
    try {
      await fetch('/api/errors', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(error)
      });
    } catch (e) {
      console.warn('Could not send error to server:', e);
    }
  }
}

// ============================================================================
// ANALYTICS COLLECTOR
// ============================================================================

export class AnalyticsCollector {
  private static instance: AnalyticsCollector;
  private data: AnalyticsData;

  private constructor() {
    this.data = this.initializeAnalytics();
    this.startDataCollection();
  }

  static getInstance(): AnalyticsCollector {
    if (!AnalyticsCollector.instance) {
      AnalyticsCollector.instance = new AnalyticsCollector();
    }
    return AnalyticsCollector.instance;
  }

  private initializeAnalytics(): AnalyticsData {
    return {
      userTypes: {},
      deviceDistribution: {},
      browserDistribution: {},
      locationDistribution: {},
      peakUsageHours: new Array(24).fill(0),
      mostUsedFeatures: {},
      averageSessionTime: 0,
      emergencyTypes: {},
      responseTimesAverage: 0,
      successfulResolutions: 0,
      uptime: 100,
      errorRate: 0,
      performanceScore: 0
    };
  }

  private startDataCollection() {
    // Collect browser info
    if (typeof window !== 'undefined') {
      this.trackBrowser();
      this.trackDevice();
      this.trackUsageTime();
    }
  }

  /**
   * Track feature usage
   */
  trackFeatureUsage(feature: string) {
    this.data.mostUsedFeatures[feature] = (this.data.mostUsedFeatures[feature] || 0) + 1;
  }

  /**
   * Track emergency alert
   */
  trackEmergencyAlert(type: string, responseTime: number, resolved: boolean) {
    this.data.emergencyTypes[type] = (this.data.emergencyTypes[type] || 0) + 1;
    
    // Update average response time
    const currentAvg = this.data.responseTimesAverage;
    const totalAlerts = Object.values(this.data.emergencyTypes).reduce((sum, count) => sum + count, 0);
    this.data.responseTimesAverage = ((currentAvg * (totalAlerts - 1)) + responseTime) / totalAlerts;
    
    if (resolved) {
      this.data.successfulResolutions++;
    }
  }

  /**
   * Update system health metrics
   */
  updateSystemHealth(uptime: number, errorRate: number, performanceScore: number) {
    this.data.uptime = uptime;
    this.data.errorRate = errorRate;
    this.data.performanceScore = performanceScore;
  }

  /**
   * Get analytics data
   */
  getAnalytics(): AnalyticsData {
    return { ...this.data };
  }

  /**
   * Generate analytics report
   */
  generateAnalyticsReport(): string {
    return JSON.stringify({
      timestamp: new Date().toISOString(),
      summary: {
        totalUsers: Object.values(this.data.userTypes).reduce((sum, count) => sum + count, 0),
        totalEmergencies: Object.values(this.data.emergencyTypes).reduce((sum, count) => sum + count, 0),
        averageResponseTime: this.data.responseTimesAverage,
        systemHealth: {
          uptime: this.data.uptime,
          errorRate: this.data.errorRate,
          performanceScore: this.data.performanceScore
        }
      },
      details: this.data
    }, null, 2);
  }

  private trackBrowser() {
    const userAgent = navigator.userAgent;
    let browser = 'unknown';
    
    if (userAgent.includes('Chrome')) browser = 'Chrome';
    else if (userAgent.includes('Firefox')) browser = 'Firefox';
    else if (userAgent.includes('Safari')) browser = 'Safari';
    else if (userAgent.includes('Edge')) browser = 'Edge';
    
    this.data.browserDistribution[browser] = (this.data.browserDistribution[browser] || 0) + 1;
  }

  private trackDevice() {
    const performanceMonitor = PerformanceMonitor.getInstance();
    const deviceType = performanceMonitor.getMetrics().deviceType;
    this.data.deviceDistribution[deviceType] = (this.data.deviceDistribution[deviceType] || 0) + 1;
  }

  private trackUsageTime() {
    const hour = new Date().getHours();
    this.data.peakUsageHours[hour]++;
  }
}

// ============================================================================
// MONITORING HOOKS & UTILITIES
// ============================================================================

/**
 * React hook for performance monitoring
 */
export function usePerformanceMonitoring() {
  const performanceMonitor = PerformanceMonitor.getInstance();
  const errorLogger = ErrorLogger.getInstance();
  const analytics = AnalyticsCollector.getInstance();

  return {
    trackApiCall: performanceMonitor.trackApiCall.bind(performanceMonitor),
    trackUserAction: performanceMonitor.trackUserAction.bind(performanceMonitor),
    trackEmergencyResponse: performanceMonitor.trackEmergencyResponse.bind(performanceMonitor),
    logError: errorLogger.logError.bind(errorLogger),
    trackFeature: analytics.trackFeatureUsage.bind(analytics),
    trackEmergency: analytics.trackEmergencyAlert.bind(analytics),
    getMetrics: performanceMonitor.getMetrics.bind(performanceMonitor),
    getErrors: errorLogger.getErrors.bind(errorLogger),
    getAnalytics: analytics.getAnalytics.bind(analytics)
  };
}

/**
 * Initialize monitoring system
 */
export function initializeMonitoring() {
  if (typeof window === 'undefined') return;
  
  const performance = PerformanceMonitor.getInstance();
  const errors = ErrorLogger.getInstance();
  const analytics = AnalyticsCollector.getInstance();
  
  console.log('Smart Tourist Safety monitoring system initialized');
  
  // Send initial metrics after 5 seconds
  setTimeout(() => {
    const report = {
      performance: performance.generateReport(),
      analytics: analytics.generateAnalyticsReport(),
      errors: errors.getErrors({ resolved: false })
    };
    
    console.log('Initial monitoring report:', report);
  }, 5000);
}

// ============================================================================
// EXPORTS
// ============================================================================

export default PerformanceMonitor;