/**
 * Performance Monitoring System
 * 
 * Comprehensive monitoring of application performance, blockchain connectivity,
 * user experience metrics, and system health with real-time alerts.
 */

import { Connection } from '@solana/web3.js';
import { rpcConnectionManager } from '../rpc/connection-manager';

/**
 * Performance metric types
 */
export interface PerformanceMetrics {
  /** Connection metrics */
  connection: {
    latency: number;
    uptime: number;
    failureRate: number;
    throughput: number;
    lastError?: string;
    errorCount: number;
  };
  
  /** RPC metrics */
  rpc: {
    averageResponseTime: number;
    requestsPerSecond: number;
    successRate: number;
    retryRate: number;
    cacheHitRate: number;
  };
  
  /** UI metrics */
  ui: {
    loadTime: number;
    renderTime: number;
    interactionLatency: number;
    memoryUsage: number;
    fpsCount: number;
  };
  
  /** Data metrics */
  data: {
    fetchLatency: number;
    cacheEfficiency: number;
    transformationTime: number;
    validationTime: number;
    serializationTime: number;
  };
  
  /** User experience metrics */
  ux: {
    timeToInteractive: number;
    firstContentfulPaint: number;
    largestContentfulPaint: number;
    cumulativeLayoutShift: number;
    firstInputDelay: number;
  };
}

/**
 * Alert configuration
 */
export interface AlertConfig {
  /** Alert threshold values */
  thresholds: {
    connectionLatency: number;
    rpcResponseTime: number;
    uiLoadTime: number;
    memoryUsage: number;
    errorRate: number;
  };
  
  /** Alert handlers */
  handlers: {
    onConnectionIssue?: (metrics: PerformanceMetrics) => void;
    onPerformanceDegradation?: (metrics: PerformanceMetrics) => void;
    onMemoryLeak?: (metrics: PerformanceMetrics) => void;
    onCriticalError?: (error: Error, context: string) => void;
  };
}

/**
 * Performance entry for historical tracking
 */
interface PerformanceHistoryEntry {
  timestamp: Date;
  metrics: PerformanceMetrics;
  version: string;
  userAgent: string;
  sessionId: string;
}

/**
 * Performance Monitor class
 */
export class PerformanceMonitor {
  private metrics: PerformanceMetrics;
  private history: PerformanceHistoryEntry[] = [];
  private alerts: AlertConfig;
  private monitoring = false;
  private intervalId?: NodeJS.Timeout;
  private sessionId: string;
  private startTime: number;
  
  // Performance observers
  private performanceObserver?: PerformanceObserver;
  private memoryMonitor?: NodeJS.Timeout;
  private connectionMonitor?: NodeJS.Timeout;
  
  // Metric collection intervals
  private readonly COLLECTION_INTERVAL = 5000; // 5 seconds
  private readonly HISTORY_LIMIT = 1000; // Keep last 1000 entries
  private readonly MEMORY_CHECK_INTERVAL = 10000; // 10 seconds

  constructor(alertConfig: Partial<AlertConfig> = {}) {
    this.sessionId = this.generateSessionId();
    this.startTime = performance.now();
    
    // Initialize metrics
    this.metrics = this.createEmptyMetrics();
    
    // Setup alert configuration
    this.alerts = {
      thresholds: {
        connectionLatency: 1000, // 1 second
        rpcResponseTime: 2000, // 2 seconds
        uiLoadTime: 3000, // 3 seconds
        memoryUsage: 100 * 1024 * 1024, // 100MB
        errorRate: 0.05 // 5%
      },
      handlers: {},
      ...alertConfig
    };
    
    this.initializeMonitoring();
  }

  // ============================================================================
  // INITIALIZATION
  // ============================================================================

  /**
   * Initialize performance monitoring
   */
  private initializeMonitoring(): void {
    this.setupPerformanceObserver();
    this.setupVitalMetrics();
    this.collectInitialMetrics();
  }

  /**
   * Setup performance observer for Web Vitals
   */
  private setupPerformanceObserver(): void {
    if (typeof window === 'undefined' || !('PerformanceObserver' in window)) {
      return;
    }

    try {
      this.performanceObserver = new PerformanceObserver((list) => {
        const entries = list.getEntries();
        
        entries.forEach((entry) => {
          switch (entry.entryType) {
            case 'navigation':
              this.processNavigationTiming(entry as PerformanceNavigationTiming);
              break;
            case 'paint':
              this.processPaintTiming(entry);
              break;
            case 'largest-contentful-paint':
              this.processLCPTiming(entry);
              break;
            case 'layout-shift':
              this.processCLSTiming(entry);
              break;
            case 'first-input':
              this.processFIDTiming(entry);
              break;
            case 'measure':
              this.processCustomMeasure(entry);
              break;
          }
        });
      });

      // Observe various performance entry types
      const entryTypes = [
        'navigation',
        'paint',
        'largest-contentful-paint',
        'layout-shift',
        'first-input',
        'measure'
      ];

      entryTypes.forEach(type => {
        try {
          this.performanceObserver!.observe({ entryTypes: [type] });
        } catch (e) {
          // Some entry types might not be supported
          console.warn(`Performance entry type ${type} not supported`);
        }
      });
    } catch (error) {
      console.warn('Performance Observer setup failed:', error);
    }
  }

  /**
   * Setup Core Web Vitals monitoring
   */
  private setupVitalMetrics(): void {
    if (typeof window === 'undefined') return;

    // Monitor CLS (Cumulative Layout Shift)
    let clsValue = 0;
    let clsEntries: any[] = [];

    const observer = new PerformanceObserver((list) => {
      for (const entry of list.getEntries()) {
        const layoutShiftEntry = entry as any;
        if (!layoutShiftEntry.hadRecentInput) {
          clsValue += layoutShiftEntry.value;
          clsEntries.push(entry);
        }
      }
      this.metrics.ux.cumulativeLayoutShift = clsValue;
    });

    try {
      observer.observe({ entryTypes: ['layout-shift'] });
    } catch (e) {
      console.warn('CLS monitoring not supported');
    }
  }

  /**
   * Collect initial performance metrics
   */
  private collectInitialMetrics(): void {
    if (typeof window === 'undefined') return;

    // Get navigation timing
    const navigation = performance.getEntriesByType('navigation')[0] as PerformanceNavigationTiming;
    if (navigation) {
      this.processNavigationTiming(navigation);
    }

    // Get paint timing
    const paintEntries = performance.getEntriesByType('paint');
    paintEntries.forEach(entry => this.processPaintTiming(entry));

    // Initial memory check
    this.checkMemoryUsage();
  }

  // ============================================================================
  // METRIC COLLECTION
  // ============================================================================

  /**
   * Start performance monitoring
   */
  startMonitoring(): void {
    if (this.monitoring) return;

    this.monitoring = true;
    
    // Start periodic metric collection
    this.intervalId = setInterval(() => {
      this.collectMetrics();
    }, this.COLLECTION_INTERVAL);

    // Start memory monitoring
    this.memoryMonitor = setInterval(() => {
      this.checkMemoryUsage();
    }, this.MEMORY_CHECK_INTERVAL);

    // Start connection monitoring
    this.connectionMonitor = setInterval(() => {
      this.checkConnectionHealth();
    }, this.COLLECTION_INTERVAL);

    console.log('Performance monitoring started');
  }

  /**
   * Stop performance monitoring
   */
  stopMonitoring(): void {
    if (!this.monitoring) return;

    this.monitoring = false;

    if (this.intervalId) {
      clearInterval(this.intervalId);
      this.intervalId = undefined;
    }

    if (this.memoryMonitor) {
      clearInterval(this.memoryMonitor);
      this.memoryMonitor = undefined;
    }

    if (this.connectionMonitor) {
      clearInterval(this.connectionMonitor);
      this.connectionMonitor = undefined;
    }

    if (this.performanceObserver) {
      this.performanceObserver.disconnect();
    }

    console.log('Performance monitoring stopped');
  }

  /**
   * Collect all performance metrics
   */
  private async collectMetrics(): Promise<void> {
    try {
      await Promise.all([
        this.collectConnectionMetrics(),
        this.collectRPCMetrics(),
        this.collectUIMetrics(),
        this.collectDataMetrics()
      ]);

      // Store in history
      this.addToHistory();

      // Check alerts
      this.checkAlerts();
    } catch (error) {
      console.error('Error collecting metrics:', error);
    }
  }

  /**
   * Collect connection metrics
   */
  private async collectConnectionMetrics(): Promise<void> {
    try {
      const startTime = performance.now();
      
      // Test connection latency
      const connection = await rpcConnectionManager.getConnection();
      const slot = await connection.getSlot();
      
      const latency = performance.now() - startTime;
      
      this.metrics.connection.latency = latency;
      this.metrics.connection.uptime = this.calculateUptime();
      
      // Update failure rate based on recent errors
      this.updateConnectionFailureRate();
    } catch (error) {
      this.metrics.connection.lastError = error instanceof Error ? error.message : 'Connection failed';
      this.metrics.connection.errorCount++;
    }
  }

  /**
   * Collect RPC metrics
   */
  private async collectRPCMetrics(): Promise<void> {
    // These metrics would be collected from the RPC connection manager
    // For now, we'll use placeholder values
    const manager = rpcConnectionManager as any;
    
    if (manager.getMetrics) {
      const rpcMetrics = manager.getMetrics();
      this.metrics.rpc = {
        averageResponseTime: rpcMetrics.averageResponseTime || 0,
        requestsPerSecond: rpcMetrics.requestsPerSecond || 0,
        successRate: rpcMetrics.successRate || 1,
        retryRate: rpcMetrics.retryRate || 0,
        cacheHitRate: rpcMetrics.cacheHitRate || 0
      };
    }
  }

  /**
   * Collect UI metrics
   */
  private collectUIMetrics(): void {
    if (typeof window === 'undefined') return;

    // Measure render time using performance API
    const renderStart = performance.now();
    
    requestAnimationFrame(() => {
      const renderTime = performance.now() - renderStart;
      this.metrics.ui.renderTime = renderTime;
    });

    // Measure interaction latency
    this.measureInteractionLatency();
    
    // Update FPS count
    this.updateFPSCount();
  }

  /**
   * Collect data processing metrics
   */
  private collectDataMetrics(): void {
    // These would typically be collected during data operations
    // For now, we'll maintain running averages
    this.metrics.data.fetchLatency = this.calculateAverageMetric('fetchLatency');
    this.metrics.data.cacheEfficiency = this.calculateAverageMetric('cacheEfficiency');
    this.metrics.data.transformationTime = this.calculateAverageMetric('transformationTime');
    this.metrics.data.validationTime = this.calculateAverageMetric('validationTime');
    this.metrics.data.serializationTime = this.calculateAverageMetric('serializationTime');
  }

  // ============================================================================
  // SPECIFIC METRIC PROCESSORS
  // ============================================================================

  /**
   * Process navigation timing
   */
  private processNavigationTiming(entry: PerformanceNavigationTiming): void {
    this.metrics.ux.timeToInteractive = entry.loadEventEnd - entry.fetchStart;
    this.metrics.ui.loadTime = entry.loadEventEnd - entry.fetchStart;
  }

  /**
   * Process paint timing
   */
  private processPaintTiming(entry: PerformanceEntry): void {
    if (entry.name === 'first-contentful-paint') {
      this.metrics.ux.firstContentfulPaint = entry.startTime;
    }
  }

  /**
   * Process Largest Contentful Paint
   */
  private processLCPTiming(entry: any): void {
    this.metrics.ux.largestContentfulPaint = entry.startTime;
  }

  /**
   * Process Cumulative Layout Shift
   */
  private processCLSTiming(entry: any): void {
    if (!entry.hadRecentInput) {
      this.metrics.ux.cumulativeLayoutShift += entry.value;
    }
  }

  /**
   * Process First Input Delay
   */
  private processFIDTiming(entry: any): void {
    this.metrics.ux.firstInputDelay = entry.processingStart - entry.startTime;
  }

  /**
   * Process custom performance measures
   */
  private processCustomMeasure(entry: PerformanceEntry): void {
    const duration = entry.duration;
    
    switch (entry.name) {
      case 'data-fetch':
        this.updateMetricAverage('fetchLatency', duration);
        break;
      case 'data-transform':
        this.updateMetricAverage('transformationTime', duration);
        break;
      case 'data-validate':
        this.updateMetricAverage('validationTime', duration);
        break;
      case 'data-serialize':
        this.updateMetricAverage('serializationTime', duration);
        break;
    }
  }

  // ============================================================================
  // HELPER METHODS
  // ============================================================================

  /**
   * Check memory usage
   */
  private checkMemoryUsage(): void {
    if (typeof window === 'undefined' || !(performance as any).memory) return;

    const memory = (performance as any).memory;
    this.metrics.ui.memoryUsage = memory.usedJSHeapSize;
  }

  /**
   * Check connection health
   */
  private async checkConnectionHealth(): Promise<void> {
    try {
      // Simple health check by testing connection
      const connection = await rpcConnectionManager.getConnection();
      await connection.getSlot();
      
      // If successful, maintain or improve uptime
      this.metrics.connection.uptime = Math.min(1, this.metrics.connection.uptime + 0.01);
      this.metrics.connection.throughput = this.metrics.connection.throughput || 100;
    } catch (error) {
      this.metrics.connection.uptime = Math.max(0, this.metrics.connection.uptime - 0.1);
      this.metrics.connection.throughput = Math.max(0, this.metrics.connection.throughput - 10);
    }
  }

  /**
   * Measure interaction latency
   */
  private measureInteractionLatency(): void {
    // This would typically be measured during actual user interactions
    // For now, we'll use a placeholder
    this.metrics.ui.interactionLatency = this.calculateAverageMetric('interactionLatency');
  }

  /**
   * Update FPS count
   */
  private updateFPSCount(): void {
    let fps = 0;
    let lastTime = performance.now();
    let frameCount = 0;

    const countFPS = () => {
      frameCount++;
      const currentTime = performance.now();
      
      if (currentTime - lastTime >= 1000) {
        fps = frameCount;
        frameCount = 0;
        lastTime = currentTime;
        this.metrics.ui.fpsCount = fps;
      }
      
      requestAnimationFrame(countFPS);
    };

    requestAnimationFrame(countFPS);
  }

  /**
   * Calculate uptime
   */
  private calculateUptime(): number {
    const currentTime = performance.now();
    const totalTime = currentTime - this.startTime;
    const errorTime = this.metrics.connection.errorCount * 1000; // Assume 1s per error
    return Math.max(0, (totalTime - errorTime) / totalTime);
  }

  /**
   * Update connection failure rate
   */
  private updateConnectionFailureRate(): void {
    const recentHistory = this.history.slice(-20); // Last 20 entries
    if (recentHistory.length === 0) return;

    const failures = recentHistory.filter(entry => 
      entry.metrics.connection.lastError !== undefined
    ).length;

    this.metrics.connection.failureRate = failures / recentHistory.length;
  }

  /**
   * Calculate average metric
   */
  private calculateAverageMetric(metricName: string): number {
    const recentHistory = this.history.slice(-10);
    if (recentHistory.length === 0) return 0;

    const sum = recentHistory.reduce((acc, entry) => {
      const value = this.getNestedMetricValue(entry.metrics, metricName);
      return acc + (value || 0);
    }, 0);

    return sum / recentHistory.length;
  }

  /**
   * Update metric average
   */
  private updateMetricAverage(metricName: string, newValue: number): void {
    // Implement exponential moving average
    const current = this.getNestedMetricValue(this.metrics, metricName) || 0;
    const alpha = 0.1; // Smoothing factor
    const updated = alpha * newValue + (1 - alpha) * current;
    this.setNestedMetricValue(this.metrics, metricName, updated);
  }

  /**
   * Get nested metric value
   */
  private getNestedMetricValue(metrics: any, path: string): number | undefined {
    const parts = path.split('.');
    let value = metrics;
    
    for (const part of parts) {
      value = value?.[part];
    }
    
    return typeof value === 'number' ? value : undefined;
  }

  /**
   * Set nested metric value
   */
  private setNestedMetricValue(metrics: any, path: string, value: number): void {
    const parts = path.split('.');
    let current = metrics;
    
    for (let i = 0; i < parts.length - 1; i++) {
      if (!current[parts[i]]) {
        current[parts[i]] = {};
      }
      current = current[parts[i]];
    }
    
    current[parts[parts.length - 1]] = value;
  }

  /**
   * Add current metrics to history
   */
  private addToHistory(): void {
    const entry: PerformanceHistoryEntry = {
      timestamp: new Date(),
      metrics: JSON.parse(JSON.stringify(this.metrics)),
      version: process.env.REACT_APP_VERSION || '1.0.0',
      userAgent: typeof navigator !== 'undefined' ? navigator.userAgent : 'unknown',
      sessionId: this.sessionId
    };

    this.history.push(entry);

    // Limit history size
    if (this.history.length > this.HISTORY_LIMIT) {
      this.history = this.history.slice(-this.HISTORY_LIMIT);
    }
  }

  /**
   * Check alert thresholds
   */
  private checkAlerts(): void {
    const { thresholds, handlers } = this.alerts;

    // Connection latency alert
    if (this.metrics.connection.latency > thresholds.connectionLatency) {
      handlers.onConnectionIssue?.(this.metrics);
    }

    // RPC response time alert
    if (this.metrics.rpc.averageResponseTime > thresholds.rpcResponseTime) {
      handlers.onPerformanceDegradation?.(this.metrics);
    }

    // UI load time alert
    if (this.metrics.ui.loadTime > thresholds.uiLoadTime) {
      handlers.onPerformanceDegradation?.(this.metrics);
    }

    // Memory usage alert
    if (this.metrics.ui.memoryUsage > thresholds.memoryUsage) {
      handlers.onMemoryLeak?.(this.metrics);
    }

    // Error rate alert
    if (this.metrics.connection.failureRate > thresholds.errorRate) {
      handlers.onConnectionIssue?.(this.metrics);
    }
  }

  /**
   * Create empty metrics structure
   */
  private createEmptyMetrics(): PerformanceMetrics {
    return {
      connection: {
        latency: 0,
        uptime: 1,
        failureRate: 0,
        throughput: 0,
        errorCount: 0
      },
      rpc: {
        averageResponseTime: 0,
        requestsPerSecond: 0,
        successRate: 1,
        retryRate: 0,
        cacheHitRate: 0
      },
      ui: {
        loadTime: 0,
        renderTime: 0,
        interactionLatency: 0,
        memoryUsage: 0,
        fpsCount: 60
      },
      data: {
        fetchLatency: 0,
        cacheEfficiency: 0,
        transformationTime: 0,
        validationTime: 0,
        serializationTime: 0
      },
      ux: {
        timeToInteractive: 0,
        firstContentfulPaint: 0,
        largestContentfulPaint: 0,
        cumulativeLayoutShift: 0,
        firstInputDelay: 0
      }
    };
  }

  /**
   * Generate unique session ID
   */
  private generateSessionId(): string {
    return `session_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  }

  // ============================================================================
  // PUBLIC API
  // ============================================================================

  /**
   * Get current metrics
   */
  getCurrentMetrics(): PerformanceMetrics {
    return JSON.parse(JSON.stringify(this.metrics));
  }

  /**
   * Get performance history
   */
  getHistory(limit?: number): PerformanceHistoryEntry[] {
    const history = [...this.history];
    return limit ? history.slice(-limit) : history;
  }

  /**
   * Get performance summary
   */
  getSummary(): {
    averages: PerformanceMetrics;
    trends: Record<string, 'improving' | 'degrading' | 'stable'>;
    alerts: string[];
  } {
    const recentHistory = this.history.slice(-20);
    
    // Calculate averages
    const averages = this.calculateAverageMetrics(recentHistory);
    
    // Calculate trends
    const trends = this.calculateTrends(recentHistory);
    
    // Get active alerts
    const alerts = this.getActiveAlerts();

    return { averages, trends, alerts };
  }

  /**
   * Calculate average metrics from history
   */
  private calculateAverageMetrics(entries: PerformanceHistoryEntry[]): PerformanceMetrics {
    if (entries.length === 0) return this.createEmptyMetrics();

    const sums = this.createEmptyMetrics();
    const counts = this.createEmptyMetrics();

    entries.forEach(entry => {
      this.addToSums(sums, counts, entry.metrics);
    });

    return this.divideSumsByCounts(sums, counts);
  }

  /**
   * Add metrics to running sums
   */
  private addToSums(sums: any, counts: any, metrics: any, path = ''): void {
    Object.keys(metrics).forEach(key => {
      const value = metrics[key];
      const currentPath = path ? `${path}.${key}` : key;
      
      if (typeof value === 'number') {
        this.incrementNestedValue(sums, currentPath, value);
        this.incrementNestedValue(counts, currentPath, 1);
      } else if (typeof value === 'object' && value !== null) {
        this.addToSums(sums, counts, value, currentPath);
      }
    });
  }

  /**
   * Increment nested value
   */
  private incrementNestedValue(obj: any, path: string, increment: number): void {
    const parts = path.split('.');
    let current = obj;
    
    for (let i = 0; i < parts.length - 1; i++) {
      if (!current[parts[i]]) {
        current[parts[i]] = {};
      }
      current = current[parts[i]];
    }
    
    const lastPart = parts[parts.length - 1];
    current[lastPart] = (current[lastPart] || 0) + increment;
  }

  /**
   * Divide sums by counts to get averages
   */
  private divideSumsByCounts(sums: any, counts: any): any {
    const result: any = {};
    
    Object.keys(sums).forEach(key => {
      if (typeof sums[key] === 'object' && sums[key] !== null) {
        result[key] = this.divideSumsByCounts(sums[key], counts[key]);
      } else {
        result[key] = counts[key] > 0 ? sums[key] / counts[key] : 0;
      }
    });
    
    return result;
  }

  /**
   * Calculate performance trends
   */
  private calculateTrends(entries: PerformanceHistoryEntry[]): Record<string, 'improving' | 'degrading' | 'stable'> {
    if (entries.length < 2) return {};

    const first = entries[0];
    const last = entries[entries.length - 1];
    const trends: Record<string, 'improving' | 'degrading' | 'stable'> = {};

    // Compare key metrics
    const keyMetrics = [
      'connection.latency',
      'rpc.averageResponseTime',
      'ui.loadTime',
      'ui.memoryUsage',
      'connection.failureRate'
    ];

    keyMetrics.forEach(metric => {
      const firstValue = this.getNestedMetricValue(first.metrics, metric) || 0;
      const lastValue = this.getNestedMetricValue(last.metrics, metric) || 0;
      
      const change = (lastValue - firstValue) / (firstValue || 1);
      
      if (Math.abs(change) < 0.1) {
        trends[metric] = 'stable';
      } else if (change > 0) {
        trends[metric] = 'degrading';
      } else {
        trends[metric] = 'improving';
      }
    });

    return trends;
  }

  /**
   * Get active alerts
   */
  private getActiveAlerts(): string[] {
    const alerts: string[] = [];
    const { thresholds } = this.alerts;

    if (this.metrics.connection.latency > thresholds.connectionLatency) {
      alerts.push(`High connection latency: ${this.metrics.connection.latency.toFixed(0)}ms`);
    }

    if (this.metrics.rpc.averageResponseTime > thresholds.rpcResponseTime) {
      alerts.push(`Slow RPC responses: ${this.metrics.rpc.averageResponseTime.toFixed(0)}ms`);
    }

    if (this.metrics.ui.loadTime > thresholds.uiLoadTime) {
      alerts.push(`Slow UI load time: ${this.metrics.ui.loadTime.toFixed(0)}ms`);
    }

    if (this.metrics.ui.memoryUsage > thresholds.memoryUsage) {
      alerts.push(`High memory usage: ${(this.metrics.ui.memoryUsage / 1024 / 1024).toFixed(1)}MB`);
    }

    if (this.metrics.connection.failureRate > thresholds.errorRate) {
      alerts.push(`High error rate: ${(this.metrics.connection.failureRate * 100).toFixed(1)}%`);
    }

    return alerts;
  }

  /**
   * Record custom metric
   */
  recordCustomMetric(name: string, value: number, category: keyof PerformanceMetrics = 'data'): void {
    performance.mark(`${name}-start`);
    performance.mark(`${name}-end`);
    performance.measure(name, `${name}-start`, `${name}-end`);
    
    this.updateMetricAverage(`${category}.${name}`, value);
  }

  /**
   * Export metrics for external analysis
   */
  exportMetrics(): {
    current: PerformanceMetrics;
    history: PerformanceHistoryEntry[];
    summary: ReturnType<PerformanceMonitor['getSummary']>;
    sessionInfo: {
      sessionId: string;
      startTime: number;
      duration: number;
    };
  } {
    return {
      current: this.getCurrentMetrics(),
      history: this.getHistory(),
      summary: this.getSummary(),
      sessionInfo: {
        sessionId: this.sessionId,
        startTime: this.startTime,
        duration: performance.now() - this.startTime
      }
    };
  }
}

// Export singleton instance
export const performanceMonitor = new PerformanceMonitor({
  thresholds: {
    connectionLatency: 1000,
    rpcResponseTime: 2000,
    uiLoadTime: 3000,
    memoryUsage: 100 * 1024 * 1024,
    errorRate: 0.05
  },
  handlers: {
    onConnectionIssue: (metrics) => {
      console.warn('Connection issue detected:', metrics.connection);
    },
    onPerformanceDegradation: (metrics) => {
      console.warn('Performance degradation detected:', metrics);
    },
    onMemoryLeak: (metrics) => {
      console.warn('Memory leak detected:', metrics.ui.memoryUsage);
    },
    onCriticalError: (error, context) => {
      console.error('Critical error:', error, 'Context:', context);
    }
  }
});

// Auto-start monitoring
if (typeof window !== 'undefined') {
  performanceMonitor.startMonitoring();
}