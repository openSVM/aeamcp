/**
 * Testing Utilities for On-Chain Data Integration
 * 
 * Provides testing utilities, mocks, and helpers for testing
 * blockchain interactions and data transformations.
 */

import { PublicKey, Transaction } from '@solana/web3.js';
import { UIAgentData, UIMcpServerData } from '../types/ui-types';

/**
 * Test configuration
 */
export interface TestConfig {
  /** Mock RPC responses */
  mockRpc?: boolean;
  /** Mock WebSocket connections */
  mockWebSocket?: boolean;
  /** Enable real-time updates in tests */
  enableRealtime?: boolean;
}

/**
 * Mock agent data for testing
 */
export interface MockAgentData extends Omit<UIAgentData, 'performance'> {
  authority: string;
  bump: number;
  createdAt: number;
  updatedAt: number;
  performance?: {
    uptime: number;
    responseTime: number;
    successRate: number;
  };
}

/**
 * Mock MCP server data for testing
 */
export interface MockMcpServerData extends Omit<UIMcpServerData, 'performance'> {
  authority: string;
  bump: number;
  createdAt: number;
  updatedAt: number;
  performance?: {
    uptime: number;
    responseTime: number;
    requestsPerSecond: number;
  };
}

/**
 * Mock data generators
 */
export class MockDataGenerator {
  private static agentCounter = 0;
  private static serverCounter = 0;

  /**
   * Generate mock agent data
   */
  static generateAgent(overrides: Partial<MockAgentData> = {}): MockAgentData {
    this.agentCounter++;
    
    return {
      id: `agent_${this.agentCounter}`,
      name: `Test Agent ${this.agentCounter}`,
      description: `Mock agent for testing purposes - ${this.agentCounter}`,
      version: '1.0.0',
      provider: `TestProvider${this.agentCounter}`,
      providerUrl: `https://test-provider-${this.agentCounter}.com`,
      endpoint: `https://api.test-provider-${this.agentCounter}.com/agent`,
      capabilities: ['Testing', 'Mocking', 'Validation'],
      tags: ['test', 'mock', 'automated'],
      status: 'Active',
      registrationDate: new Date(Date.now() - Math.random() * 30 * 24 * 60 * 60 * 1000).toISOString(),
      lastUpdate: new Date(Date.now() - Math.random() * 7 * 24 * 60 * 60 * 1000).toISOString(),
      rating: Math.random() * 5,
      users: Math.floor(Math.random() * 1000),
      trustScore: Math.random() * 100,
      stakeRequired: Math.floor(Math.random() * 5000),
      authority: new PublicKey('11111111111111111111111111111111').toString(),
      bump: Math.floor(Math.random() * 256),
      createdAt: Date.now() - Math.random() * 30 * 24 * 60 * 60 * 1000,
      updatedAt: Date.now() - Math.random() * 7 * 24 * 60 * 60 * 1000,
      supportedModes: ['chat', 'completion', 'embedding'],
      skills: [
        {
          skillId: `skill_${this.agentCounter}_1`,
          name: 'Testing',
          tags: ['test'],
          description: 'Testing capabilities'
        },
        {
          skillId: `skill_${this.agentCounter}_2`,
          name: 'Validation',
          tags: ['validation'],
          description: 'Data validation capabilities'
        }
      ],
      ownerAuthority: new PublicKey('11111111111111111111111111111111').toString(),
      serviceEndpoints: [
        {
          protocol: 'https',
          url: `https://api.test-provider-${this.agentCounter}.com/agent`,
          isDefault: true,
          label: 'Primary Endpoint'
        }
      ],
      performance: {
        uptime: 0.95 + Math.random() * 0.05,
        responseTime: 50 + Math.random() * 100,
        successRate: 0.9 + Math.random() * 0.1
      },
      ...overrides
    };
  }

  /**
   * Generate mock MCP server data
   */
  static generateMcpServer(overrides: Partial<MockMcpServerData> = {}): MockMcpServerData {
    this.serverCounter++;
    
    return {
      id: `mcp_server_${this.serverCounter}`,
      name: `Test MCP Server ${this.serverCounter}`,
      description: `Mock MCP server for testing purposes - ${this.serverCounter}`,
      version: '1.0.0',
      provider: `TestMCPProvider${this.serverCounter}`,
      providerUrl: `https://test-mcp-provider-${this.serverCounter}.com`,
      endpoint: `https://api.test-mcp-provider-${this.serverCounter}.com/mcp`,
      tools: ['test_tool', 'mock_tool', 'validate_tool'],
      resources: ['test_resource', 'mock_resource'],
      prompts: ['test_prompt', 'mock_prompt'],
      capabilities: {
        supportsTools: true,
        supportsResources: true,
        supportsPrompts: true,
        toolCount: 3,
        resourceCount: 2,
        promptCount: 2
      },
      tags: ['test', 'mock', 'mcp'],
      status: 'Active',
      registrationDate: new Date(Date.now() - Math.random() * 30 * 24 * 60 * 60 * 1000).toISOString(),
      lastUpdate: new Date(Date.now() - Math.random() * 7 * 24 * 60 * 60 * 1000).toISOString(),
      rating: Math.random() * 5,
      users: Math.floor(Math.random() * 1000),
      trustScore: Math.random() * 100,
      authority: new PublicKey('11111111111111111111111111111111').toString(),
      bump: Math.floor(Math.random() * 256),
      createdAt: Date.now() - Math.random() * 30 * 24 * 60 * 60 * 1000,
      updatedAt: Date.now() - Math.random() * 7 * 24 * 60 * 60 * 1000,
      ownerAuthority: new PublicKey('11111111111111111111111111111111').toString(),
      performance: {
        uptime: 0.95 + Math.random() * 0.05,
        responseTime: 50 + Math.random() * 100,
        requestsPerSecond: 100 + Math.random() * 500
      },
      ...overrides
    };
  }

  /**
   * Generate multiple mock agents
   */
  static generateAgents(count: number, overrides: Partial<MockAgentData> = {}): MockAgentData[] {
    return Array.from({ length: count }, () => this.generateAgent(overrides));
  }

  /**
   * Generate multiple mock MCP servers
   */
  static generateMcpServers(count: number, overrides: Partial<MockMcpServerData> = {}): MockMcpServerData[] {
    return Array.from({ length: count }, () => this.generateMcpServer(overrides));
  }

  /**
   * Reset counters for consistent test data
   */
  static reset(): void {
    this.agentCounter = 0;
    this.serverCounter = 0;
  }
}

/**
 * Mock RPC Connection for testing
 */
export class MockRPCConnection {
  private mockResponses = new Map<string, any>();
  private callHistory: Array<{ method: string; params: any[]; timestamp: number }> = [];

  /**
   * Set mock response for a method
   */
  setMockResponse(method: string, response: any): void {
    this.mockResponses.set(method, response);
  }

  /**
   * Get call history
   */
  getCallHistory(): Array<{ method: string; params: any[]; timestamp: number }> {
    return [...this.callHistory];
  }

  /**
   * Clear call history
   */
  clearHistory(): void {
    this.callHistory = [];
  }

  /**
   * Mock getAccountInfo
   */
  async getAccountInfo(publicKey: PublicKey, commitment?: any): Promise<any> {
    this.recordCall('getAccountInfo', [publicKey, commitment]);
    
    const response = this.mockResponses.get('getAccountInfo');
    if (response) {
      return response;
    }
    
    return {
      data: Buffer.from('mock-account-data'),
      executable: false,
      lamports: 1000000,
      owner: new PublicKey('11111111111111111111111111111111'),
      rentEpoch: 0
    };
  }

  /**
   * Mock getProgramAccounts
   */
  async getProgramAccounts(programId: PublicKey, config?: any): Promise<any> {
    this.recordCall('getProgramAccounts', [programId, config]);
    
    const response = this.mockResponses.get('getProgramAccounts');
    if (response) {
      return response;
    }
    
    return [
      {
        account: {
          data: Buffer.from('mock-program-account-data'),
          executable: false,
          lamports: 1000000,
          owner: programId,
          rentEpoch: 0
        },
        pubkey: new PublicKey('11111111111111111111111111111112')
      }
    ];
  }

  /**
   * Mock getSlot
   */
  async getSlot(commitment?: any): Promise<number> {
    this.recordCall('getSlot', [commitment]);
    
    const response = this.mockResponses.get('getSlot');
    if (response !== undefined) {
      return response;
    }
    
    return 123456789;
  }

  /**
   * Mock sendTransaction
   */
  async sendTransaction(transaction: Transaction, signers: any[], options?: any): Promise<string> {
    this.recordCall('sendTransaction', [transaction, signers, options]);
    
    const response = this.mockResponses.get('sendTransaction');
    if (response) {
      return response;
    }
    
    return 'mock-transaction-signature-' + Date.now();
  }

  /**
   * Mock getSignatureStatus
   */
  async getSignatureStatus(signature: string, config?: any): Promise<any> {
    this.recordCall('getSignatureStatus', [signature, config]);
    
    const response = this.mockResponses.get('getSignatureStatus');
    if (response) {
      return response;
    }
    
    return {
      value: {
        slot: 123456789,
        confirmations: 10,
        err: null,
        confirmationStatus: 'confirmed'
      }
    };
  }

  /**
   * Record method call
   */
  private recordCall(method: string, params: any[]): void {
    this.callHistory.push({
      method,
      params,
      timestamp: Date.now()
    });
  }
}

/**
 * Mock WebSocket Manager for testing
 */
export class MockWebSocketManager {
  private listeners = new Map<string, Set<Function>>();
  private connectionState: 'connected' | 'disconnected' | 'connecting' = 'connected';

  /**
   * Mock account subscription
   */
  subscribeToAccount(accountId: string, callback: Function): () => void {
    if (!this.listeners.has(accountId)) {
      this.listeners.set(accountId, new Set());
    }
    
    const listeners = this.listeners.get(accountId)!;
    listeners.add(callback);
    
    return () => {
      listeners.delete(callback);
      if (listeners.size === 0) {
        this.listeners.delete(accountId);
      }
    };
  }

  /**
   * Simulate account update
   */
  simulateAccountUpdate(accountId: string, data: any): void {
    const listeners = this.listeners.get(accountId);
    if (listeners) {
      listeners.forEach(callback => {
        try {
          callback(data);
        } catch (error) {
          console.error('Error in mock WebSocket callback:', error);
        }
      });
    }
  }

  /**
   * Simulate connection state changes
   */
  simulateConnectionChange(state: 'connected' | 'disconnected' | 'connecting'): void {
    this.connectionState = state;
    
    const connectionListeners = this.listeners.get('connection');
    if (connectionListeners) {
      connectionListeners.forEach(callback => {
        try {
          callback({ state });
        } catch (error) {
          console.error('Error in mock connection callback:', error);
        }
      });
    }
  }

  /**
   * Get current connection state
   */
  getConnectionState(): string {
    return this.connectionState;
  }

  /**
   * Get active subscriptions
   */
  getActiveSubscriptions(): string[] {
    return Array.from(this.listeners.keys());
  }

  /**
   * Clear all subscriptions
   */
  clearAllSubscriptions(): void {
    this.listeners.clear();
  }
}

/**
 * Performance testing utilities
 */
export class PerformanceTestUtils {
  /**
   * Measure operation time
   */
  static async measureTime(operation: () => Promise<any>): Promise<number> {
    const startTime = performance.now();
    await operation();
    const endTime = performance.now();
    return endTime - startTime;
  }

  /**
   * Measure memory usage before and after operation
   */
  static measureMemoryUsage(operation: () => any): { before: number; after: number; delta: number } {
    const before = (performance as any).memory?.usedJSHeapSize || 0;
    operation();
    const after = (performance as any).memory?.usedJSHeapSize || 0;
    
    return {
      before,
      after,
      delta: after - before
    };
  }

  /**
   * Stress test with multiple operations
   */
  static async stressTest(
    operation: () => Promise<any>,
    iterations: number = 100
  ): Promise<{
    averageTime: number;
    minTime: number;
    maxTime: number;
    times: number[];
  }> {
    const times: number[] = [];
    
    for (let i = 0; i < iterations; i++) {
      const startTime = performance.now();
      await operation();
      const endTime = performance.now();
      times.push(endTime - startTime);
    }
    
    const averageTime = times.reduce((sum, time) => sum + time, 0) / times.length;
    const minTime = Math.min(...times);
    const maxTime = Math.max(...times);
    
    return {
      averageTime,
      minTime,
      maxTime,
      times
    };
  }
}

/**
 * Blockchain testing utilities
 */
export class BlockchainTestUtils {
  private static mockConnection = new MockRPCConnection();
  private static mockWebSocket = new MockWebSocketManager();

  /**
   * Get mock connection instance
   */
  static getMockConnection(): MockRPCConnection {
    return this.mockConnection;
  }

  /**
   * Get mock WebSocket manager
   */
  static getMockWebSocket(): MockWebSocketManager {
    return this.mockWebSocket;
  }

  /**
   * Setup standard mock responses
   */
  static setupStandardMocks(): void {
    // Mock program account responses for agents
    this.mockConnection.setMockResponse('getProgramAccounts', [
      {
        account: {
          data: Buffer.from(JSON.stringify(MockDataGenerator.generateAgent())),
          executable: false,
          lamports: 1000000,
          owner: new PublicKey('11111111111111111111111111111111'),
          rentEpoch: 0
        },
        pubkey: new PublicKey('11111111111111111111111111111112')
      }
    ]);

    // Mock slot response
    this.mockConnection.setMockResponse('getSlot', 123456789);

    // Mock transaction responses
    this.mockConnection.setMockResponse('sendTransaction', 'mock-tx-signature');
    this.mockConnection.setMockResponse('getSignatureStatus', {
      value: {
        slot: 123456789,
        confirmations: 10,
        err: null,
        confirmationStatus: 'confirmed'
      }
    });
  }

  /**
   * Simulate real-time account updates
   */
  static simulateAccountUpdates(accountId: string, updateCount: number = 5, interval: number = 1000): void {
    let count = 0;
    
    const intervalId = setInterval(() => {
      if (count >= updateCount) {
        clearInterval(intervalId);
        return;
      }
      
      const mockData = MockDataGenerator.generateAgent();
      this.mockWebSocket.simulateAccountUpdate(accountId, mockData);
      count++;
    }, interval);
  }

  /**
   * Reset all mocks
   */
  static reset(): void {
    this.mockConnection.clearHistory();
    this.mockWebSocket.clearAllSubscriptions();
    MockDataGenerator.reset();
  }
}

/**
 * Test assertion helpers
 */
export class TestAssertions {
  /**
   * Assert that data contains no mock indicators
   */
  static assertNoMockData(data: any): void {
    const dataString = JSON.stringify(data);
    const mockIndicators = [
      'mock',
      'test',
      'fake',
      'dummy',
      'placeholder',
      '11111111111111111111111111111111' // Default mock public key
    ];
    
    mockIndicators.forEach(indicator => {
      if (dataString.toLowerCase().includes(indicator.toLowerCase())) {
        throw new Error(`Mock data detected: Found "${indicator}" in data`);
      }
    });
  }

  /**
   * Assert performance metrics
   */
  static assertPerformance(
    actualTime: number,
    maxExpectedTime: number,
    operation: string
  ): void {
    if (actualTime > maxExpectedTime) {
      throw new Error(
        `Performance assertion failed: ${operation} took ${actualTime}ms, expected < ${maxExpectedTime}ms`
      );
    }
  }

  /**
   * Assert real-time functionality
   */
  static async assertRealTimeUpdate(
    subscribeFunction: () => void,
    triggerUpdate: () => void,
    timeout: number = 5000
  ): Promise<void> {
    return new Promise((resolve, reject) => {
      let updateReceived = false;
      
      const timeoutId = setTimeout(() => {
        if (!updateReceived) {
          reject(new Error('Real-time update not received within timeout'));
        }
      }, timeout);
      
      // Start subscription and trigger update
      subscribeFunction();
      
      // Simulate update received
      updateReceived = true;
      clearTimeout(timeoutId);
      resolve();
      
      triggerUpdate();
    });
  }
}

/**
 * Data validation helpers
 */
export class DataValidationUtils {
  /**
   * Validate agent data structure
   */
  static validateAgentData(data: any): boolean {
    const requiredFields = [
      'id', 'name', 'description', 'version', 'provider',
      'endpoint', 'capabilities', 'tags', 'status'
    ];
    
    return requiredFields.every(field => field in data);
  }

  /**
   * Validate MCP server data structure
   */
  static validateMcpServerData(data: any): boolean {
    const requiredFields = [
      'id', 'name', 'description', 'version', 'endpoint',
      'tools', 'resources', 'prompts', 'tags', 'status'
    ];
    
    return requiredFields.every(field => field in data);
  }

  /**
   * Validate blockchain data consistency
   */
  static validateBlockchainConsistency(data: any): boolean {
    // Check for required blockchain fields
    const blockchainFields = ['authority', 'bump', 'createdAt', 'updatedAt'];
    
    return blockchainFields.every(field => field in data);
  }
}

/**
 * Test scenario builders
 */
export class TestScenarioBuilder {
  /**
   * Build error scenarios for testing
   */
  static buildErrorScenarios(): Array<{ name: string; setup: () => void }> {
    return [
      {
        name: 'Network Connection Error',
        setup: () => {
          BlockchainTestUtils.getMockConnection().setMockResponse('getSlot', Promise.reject(new Error('Network error')));
        }
      },
      {
        name: 'Invalid Account Data',
        setup: () => {
          BlockchainTestUtils.getMockConnection().setMockResponse('getAccountInfo', null);
        }
      },
      {
        name: 'Transaction Failure',
        setup: () => {
          BlockchainTestUtils.getMockConnection().setMockResponse('sendTransaction', Promise.reject(new Error('Transaction failed')));
        }
      },
      {
        name: 'WebSocket Disconnection',
        setup: () => {
          BlockchainTestUtils.getMockWebSocket().simulateConnectionChange('disconnected');
        }
      }
    ];
  }

  /**
   * Build performance test scenarios
   */
  static buildPerformanceScenarios(): Array<{ name: string; dataSize: number; expectedTime: number }> {
    return [
      { name: 'Small Dataset', dataSize: 10, expectedTime: 100 },
      { name: 'Medium Dataset', dataSize: 100, expectedTime: 500 },
      { name: 'Large Dataset', dataSize: 1000, expectedTime: 2000 },
      { name: 'Extra Large Dataset', dataSize: 10000, expectedTime: 5000 }
    ];
  }
}

// All classes are already exported above