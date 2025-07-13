import { describe, test, expect, beforeEach, afterEach, jest } from '@jest/globals';
import { PublicKey } from '@solana/web3.js';
import { Wallet } from '@coral-xyz/anchor';
import {
  SolanaAIRegistriesSDK,
  createSdk,
  DEFAULT_CONFIGS,
  AgentRegistrationData,
  McpServerRegistrationData,
  AgentStatus,
  McpServerStatus,
  PaymentMethod,
} from '../../src/index.js';

// Mock wallet
const mockWallet = {
  publicKey: new PublicKey('11111111111111111111111111111111'),
  signTransaction: jest.fn(),
  signAllTransactions: jest.fn(),
} as unknown as Wallet;

describe('SDK Integration Tests', () => {
  let sdk: SolanaAIRegistriesSDK;

  beforeEach(async () => {
    sdk = createSdk(DEFAULT_CONFIGS.devnet);
    await sdk.initialize(mockWallet);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('SDK initialization and health checks', () => {
    test('should create SDK with default config', () => {
      const devnetSdk = createSdk(DEFAULT_CONFIGS.devnet);
      expect(devnetSdk).toBeInstanceOf(SolanaAIRegistriesSDK);
      expect(devnetSdk.client.cluster).toBe('devnet');
    });

    test('should initialize SDK successfully', async () => {
      const newSdk = createSdk(DEFAULT_CONFIGS.devnet);
      await expect(newSdk.initialize(mockWallet)).resolves.not.toThrow();
    });

    test('should perform health check', async () => {
      const health = await sdk.healthCheck();
      
      expect(health).toHaveProperty('client');
      expect(health).toHaveProperty('agent');
      expect(health).toHaveProperty('mcp');
      expect(health).toHaveProperty('overall');
    });
  });

  describe('Agent Registry Integration', () => {
    const validAgentData: AgentRegistrationData = {
      agentId: 'test-agent-integration',
      name: 'Test Agent Integration',
      description: 'Integration test agent',
      version: '1.0.0',
      providerName: 'Test Provider',
      providerUrl: 'https://test-provider.example.com',
      documentationUrl: 'https://docs.test-provider.example.com',
      serviceEndpoints: [
        {
          protocol: 'https',
          url: 'https://api.test-agent.example.com',
        },
      ],
      supportedModes: ['text', 'image'],
      skills: [
        {
          id: 'text-processing',
          name: 'Text Processing',
          tags: ['nlp', 'text'],
        },
        {
          id: 'image-analysis',
          name: 'Image Analysis',
          tags: ['cv', 'image'],
        },
      ],
      securityInfoUri: 'https://security.test-provider.example.com',
      aeaAddress: 'test-aea-address',
      economicIntent: 'Provide AI services for testing',
      extendedMetadataUri: 'https://metadata.test-provider.example.com',
      tags: ['test', 'integration', 'ai'],
    };

    test('should register agent successfully', async () => {
      const result = await sdk.agent.registerAgent(validAgentData);
      
      expect(result.signature).toBe('mock-signature');
      expect(result.slot).toBe(123n);
      expect(result.confirmationStatus).toBe('confirmed');
    });

    test('should handle agent registration failure gracefully', async () => {
      // Mock failure
      (sdk.client.sendAndConfirmTransaction as jest.Mock)
        .mockRejectedValueOnce(new Error('Transaction failed'));

      await expect(sdk.agent.registerAgent(validAgentData))
        .rejects.toThrow();
    });

    test('should update agent successfully', async () => {
      // First register the agent
      await sdk.agent.registerAgent(validAgentData);

      // Then update it
      const updateData = {
        name: 'Updated Test Agent',
        version: '2.0.0',
        description: 'Updated integration test agent',
      };

      const result = await sdk.agent.updateAgent(validAgentData.agentId, updateData);
      expect(result.signature).toBeDefined();
    });

    test('should list agents by owner', async () => {
      await sdk.agent.registerAgent(validAgentData);
      
      const agents = await sdk.agent.listAgentsByOwner();
      expect(Array.isArray(agents)).toBe(true);
    });

    test('should search agents by tags', async () => {
      await sdk.agent.registerAgent(validAgentData);
      
      const agents = await sdk.agent.searchAgentsByTags(['test']);
      expect(Array.isArray(agents)).toBe(true);
    });

    test('should get agent by ID', async () => {
      await sdk.agent.registerAgent(validAgentData);
      
      const agent = await sdk.agent.getAgent(validAgentData.agentId);
      expect(agent.agentId).toBe(validAgentData.agentId);
    });

    test('should deregister agent', async () => {
      await sdk.agent.registerAgent(validAgentData);
      
      const result = await sdk.agent.deregisterAgent(validAgentData.agentId);
      expect(result.signature).toBeDefined();
    });
  });

  describe('MCP Server Registry Integration', () => {
    const validServerData: McpServerRegistrationData = {
      serverId: 'test-mcp-server-integration',
      name: 'Test MCP Server Integration',
      version: '1.0.0',
      endpointUrl: 'https://mcp.test-server.example.com',
      capabilitiesSummary: 'Test MCP server with various capabilities',
      onchainToolDefinitions: [
        {
          name: 'test-tool',
          tags: ['test', 'tool'],
        },
        {
          name: 'analysis-tool',
          tags: ['analysis'],
        },
      ],
      onchainResourceDefinitions: [
        {
          uriPattern: '/test/*',
          tags: ['test'],
        },
      ],
      onchainPromptDefinitions: [
        {
          name: 'test-prompt',
          tags: ['test', 'prompt'],
        },
      ],
      fullCapabilitiesUri: 'https://capabilities.test-server.example.com',
      documentationUrl: 'https://docs.test-server.example.com',
      tags: ['test', 'integration', 'mcp'],
    };

    test('should register MCP server successfully', async () => {
      const result = await sdk.mcp.registerServer(validServerData);
      
      expect(result.signature).toBe('mock-signature');
      expect(result.slot).toBe(123n);
      expect(result.confirmationStatus).toBe('confirmed');
    });

    test('should update MCP server successfully', async () => {
      await sdk.mcp.registerServer(validServerData);

      const updateData = {
        name: 'Updated Test MCP Server',
        version: '2.0.0',
        capabilitiesSummary: 'Updated test MCP server capabilities',
      };

      const result = await sdk.mcp.updateServer(validServerData.serverId, updateData);
      expect(result.signature).toBeDefined();
    });

    test('should list servers by owner', async () => {
      await sdk.mcp.registerServer(validServerData);
      
      const servers = await sdk.mcp.listServersByOwner();
      expect(Array.isArray(servers)).toBe(true);
    });

    test('should search servers by capabilities', async () => {
      await sdk.mcp.registerServer(validServerData);
      
      const servers = await sdk.mcp.searchServersByCapabilities(['test']);
      expect(Array.isArray(servers)).toBe(true);
    });

    test('should get servers by tool', async () => {
      await sdk.mcp.registerServer(validServerData);
      
      const servers = await sdk.mcp.getServersByTool('test-tool');
      expect(Array.isArray(servers)).toBe(true);
    });

    test('should get server by ID', async () => {
      await sdk.mcp.registerServer(validServerData);
      
      const server = await sdk.mcp.getServer(validServerData.serverId);
      expect(server.serverId).toBe(validServerData.serverId);
    });

    test('should deregister server', async () => {
      await sdk.mcp.registerServer(validServerData);
      
      const result = await sdk.mcp.deregisterServer(validServerData.serverId);
      expect(result.signature).toBeDefined();
    });
  });

  describe('Payment Flow Integration', () => {
    const mockPayer = new PublicKey('11111111111111111111111111111111');
    const mockRecipient = new PublicKey('22222222222222222222222222222222');

    test('should execute prepayment flow', async () => {
      const prepaymentConfig = {
        method: PaymentMethod.Prepay as const,
        payer: mockPayer,
        recipient: mockRecipient,
        amount: 1000000000n, // 1 A2AMPL
        pricing: {
          basePrice: 1000000000n,
          currency: 'A2AMPL' as const,
        },
      };

      const result = await sdk.payments.prepayment.executePrepayment(prepaymentConfig);
      expect(result.signature).toBeDefined();
    });

    test('should execute pay-as-you-go flow', async () => {
      const payAsYouGoConfig = {
        method: PaymentMethod.PayAsYouGo as const,
        payer: mockPayer,
        recipient: mockRecipient,
        perUsePrice: 100000000n, // 0.1 A2AMPL per use
        pricing: {
          basePrice: 100000000n,
          currency: 'A2AMPL' as const,
        },
      };

      // Record some usage
      sdk.payments.payAsYouGo.recordUsage('test-service', mockPayer, 100000000n);
      sdk.payments.payAsYouGo.recordUsage('test-service', mockPayer, 100000000n);

      const result = await sdk.payments.payAsYouGo.executeUsagePayment(
        payAsYouGoConfig,
        'test-service'
      );

      expect(result.result.signature).toBeDefined();
      expect(result.totalAmount).toBe(200000000n);
      expect(result.usageCount).toBe(2);
    });

    test('should execute stream payment flow', async () => {
      const streamConfig = {
        method: PaymentMethod.Stream as const,
        payer: mockPayer,
        recipient: mockRecipient,
        ratePerSecond: 1000000n, // 0.001 A2AMPL per second
        duration: 3600, // 1 hour
        pricing: {
          basePrice: 3600000000n,
          currency: 'A2AMPL' as const,
        },
      };

      // Create stream
      const { streamId } = await sdk.payments.stream.createStream(streamConfig);
      expect(streamId).toBeDefined();

      // Start stream
      const startResult = await sdk.payments.stream.startStream(streamId);
      expect(startResult.signature).toBeDefined();

      // Get stream status
      const status = sdk.payments.stream.getStreamStatus(streamId);
      expect(status.active).toBe(true);

      // Stop stream
      const stopResult = await sdk.payments.stream.stopStream(streamId);
      expect(stopResult.finalAmount).toBeDefined();
    });
  });

  describe('Error handling and edge cases', () => {
    test('should handle network failures gracefully', async () => {
      // Mock network failure
      (sdk.client.connection.getLatestBlockhash as jest.Mock)
        .mockRejectedValueOnce(new Error('Network timeout'));

      const invalidData: AgentRegistrationData = {
        agentId: 'network-test',
        name: 'Network Test',
        description: 'Test network failure',
        version: '1.0.0',
        providerName: 'Test',
        providerUrl: 'https://test.com',
        serviceEndpoints: [],
        supportedModes: [],
        skills: [],
        tags: [],
      };

      await expect(sdk.agent.registerAgent(invalidData)).rejects.toThrow();
    });

    test('should handle validation errors properly', async () => {
      const invalidData = {
        agentId: '', // Invalid: empty
        name: 'Test',
        description: 'Test',
        version: '1.0.0',
        providerName: 'Test',
        providerUrl: 'https://test.com',
        serviceEndpoints: [],
        supportedModes: [],
        skills: [],
        tags: [],
      } as AgentRegistrationData;

      await expect(sdk.agent.registerAgent(invalidData)).rejects.toThrow();
    });

    test('should handle account not found errors', async () => {
      await expect(sdk.agent.getAgent('non-existent-agent')).rejects.toThrow();
    });

    test('should handle transaction failures', async () => {
      // Mock transaction failure
      (sdk.client.sendAndConfirmTransaction as jest.Mock)
        .mockRejectedValueOnce(new Error('Transaction simulation failed'));

      const validData: AgentRegistrationData = {
        agentId: 'tx-failure-test',
        name: 'TX Failure Test',
        description: 'Test transaction failure',
        version: '1.0.0',
        providerName: 'Test',
        providerUrl: 'https://test.com',
        serviceEndpoints: [],
        supportedModes: [],
        skills: [],
        tags: [],
      };

      await expect(sdk.agent.registerAgent(validData)).rejects.toThrow();
    });
  });

  describe('Complex scenarios', () => {
    test('should handle complete agent lifecycle', async () => {
      const agentData: AgentRegistrationData = {
        agentId: 'lifecycle-test-agent',
        name: 'Lifecycle Test Agent',
        description: 'Agent for testing complete lifecycle',
        version: '1.0.0',
        providerName: 'Lifecycle Test Provider',
        providerUrl: 'https://lifecycle-test.example.com',
        serviceEndpoints: [
          {
            protocol: 'https',
            url: 'https://api.lifecycle-test.example.com',
          },
        ],
        supportedModes: ['text'],
        skills: [
          {
            id: 'test-skill',
            name: 'Test Skill',
            tags: ['test'],
          },
        ],
        tags: ['lifecycle', 'test'],
      };

      // 1. Register agent
      const registerResult = await sdk.agent.registerAgent(agentData);
      expect(registerResult.signature).toBeDefined();

      // 2. Get agent
      const retrievedAgent = await sdk.agent.getAgent(agentData.agentId);
      expect(retrievedAgent.agentId).toBe(agentData.agentId);

      // 3. Update agent
      const updateResult = await sdk.agent.updateAgent(agentData.agentId, {
        version: '2.0.0',
        description: 'Updated lifecycle test agent',
      });
      expect(updateResult.signature).toBeDefined();

      // 4. List agents
      const agents = await sdk.agent.listAgentsByOwner();
      expect(agents.some(a => a.account.agentId === agentData.agentId)).toBe(true);

      // 5. Search by tags
      const taggedAgents = await sdk.agent.searchAgentsByTags(['lifecycle']);
      expect(taggedAgents.some(a => a.account.agentId === agentData.agentId)).toBe(true);

      // 6. Deregister agent
      const deregisterResult = await sdk.agent.deregisterAgent(agentData.agentId);
      expect(deregisterResult.signature).toBeDefined();
    });

    test('should handle payment flow with real usage tracking', async () => {
      const payAsYouGoConfig = {
        method: PaymentMethod.PayAsYouGo as const,
        payer: mockWallet.publicKey,
        recipient: new PublicKey('22222222222222222222222222222222'),
        perUsePrice: 50000000n, // 0.05 A2AMPL per use
        pricing: {
          basePrice: 50000000n,
          currency: 'A2AMPL' as const,
        },
      };

      const serviceId = 'integration-test-service';

      // Simulate service usage over time
      for (let i = 0; i < 5; i++) {
        sdk.payments.payAsYouGo.recordUsage(
          serviceId,
          mockWallet.publicKey,
          50000000n,
          { 
            requestId: `req-${i}`, 
            timestamp: Date.now() + i * 1000,
            operation: 'test-operation'
          }
        );
      }

      // Check usage summary
      const summary = sdk.payments.payAsYouGo.getUsageSummary(serviceId);
      expect(summary.usageCount).toBe(5);
      expect(summary.totalCost).toBe(250000000n); // 5 * 50000000n
      expect(summary.averageCost).toBe(50000000n);

      // Execute payment for usage
      const paymentResult = await sdk.payments.payAsYouGo.executeUsagePayment(
        payAsYouGoConfig,
        serviceId
      );

      expect(paymentResult.result.signature).toBeDefined();
      expect(paymentResult.totalAmount).toBe(250000000n);
      expect(paymentResult.usageCount).toBe(5);

      // Verify usage is cleared after payment
      const postPaymentSummary = sdk.payments.payAsYouGo.getUsageSummary(serviceId);
      expect(postPaymentSummary.usageCount).toBe(0);
      expect(postPaymentSummary.totalCost).toBe(0n);
    });
  });

  describe('Concurrent operations', () => {
    test('should handle concurrent agent registrations', async () => {
      const agents = [
        {
          agentId: 'concurrent-agent-1',
          name: 'Concurrent Agent 1',
          description: 'First concurrent agent',
          version: '1.0.0',
          providerName: 'Concurrent Provider',
          providerUrl: 'https://concurrent1.example.com',
          serviceEndpoints: [],
          supportedModes: ['text'],
          skills: [],
          tags: ['concurrent'],
        },
        {
          agentId: 'concurrent-agent-2',
          name: 'Concurrent Agent 2',
          description: 'Second concurrent agent',
          version: '1.0.0',
          providerName: 'Concurrent Provider',
          providerUrl: 'https://concurrent2.example.com',
          serviceEndpoints: [],
          supportedModes: ['text'],
          skills: [],
          tags: ['concurrent'],
        },
      ] as AgentRegistrationData[];

      // Register agents concurrently
      const results = await Promise.all(
        agents.map(agent => sdk.agent.registerAgent(agent))
      );

      expect(results).toHaveLength(2);
      results.forEach(result => {
        expect(result.signature).toBeDefined();
      });
    });

    test('should handle concurrent usage recording', () => {
      const serviceId = 'concurrent-usage-service';
      const usageAmount = 10000000n; // 0.01 A2AMPL

      // Record usage concurrently
      const promises = [];
      for (let i = 0; i < 10; i++) {
        promises.push(
          Promise.resolve().then(() => {
            sdk.payments.payAsYouGo.recordUsage(
              serviceId,
              mockWallet.publicKey,
              usageAmount,
              { iteration: i }
            );
          })
        );
      }

      return Promise.all(promises).then(() => {
        const summary = sdk.payments.payAsYouGo.getUsageSummary(serviceId);
        expect(summary.usageCount).toBe(10);
        expect(summary.totalCost).toBe(100000000n); // 10 * 10000000n
      });
    });
  });
});