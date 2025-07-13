import { describe, test, expect, beforeEach, jest } from '@jest/globals';
import { PublicKey, Transaction } from '@solana/web3.js';
import { SolanaClient } from '../../src/client.js';
import { 
  PrepaymentFlow, 
  PayAsYouGoFlow, 
  StreamPaymentFlow 
} from '../../src/payments/index.js';
import { 
  PrepaymentConfig, 
  PayAsYouGoConfig, 
  StreamConfig, 
  PaymentMethod,
  SdkConfig 
} from '../../src/types.js';
import { PaymentError, ValidationError } from '../../src/errors.js';

// Mock SolanaClient
const mockClient = {
  cluster: 'devnet',
  connection: {
    getLatestBlockhash: jest.fn().mockResolvedValue({ blockhash: 'mock-blockhash' }),
    getFeeForMessage: jest.fn().mockResolvedValue({ value: 5000 }),
    getTransaction: jest.fn().mockResolvedValue({
      slot: 123,
      transaction: {},
    }),
  },
  sendAndConfirmTransaction: jest.fn().mockResolvedValue({
    signature: 'mock-signature',
    slot: 123n,
    confirmationStatus: 'confirmed' as const,
  }),
  getAccountInfo: jest.fn().mockResolvedValue({
    data: Buffer.from([]),
    executable: false,
    lamports: 1000000,
    owner: new PublicKey('11111111111111111111111111111111'),
  }),
  accountExists: jest.fn().mockResolvedValue(true),
} as unknown as SolanaClient;

describe('Payment Flows', () => {
  const mockPayer = new PublicKey('11111111111111111111111111111111');
  const mockRecipient = new PublicKey('22222222222222222222222222222222');

  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('PrepaymentFlow', () => {
    let prepaymentFlow: PrepaymentFlow;

    beforeEach(() => {
      prepaymentFlow = new PrepaymentFlow(mockClient);
    });

    describe('createPrepayment', () => {
      const validConfig: PrepaymentConfig = {
        method: PaymentMethod.Prepay,
        payer: mockPayer,
        recipient: mockRecipient,
        amount: 1000000000n, // 1 A2AMPL
        pricing: {
          basePrice: 1000000000n,
          currency: 'A2AMPL',
        },
      };

      test('should create prepayment transaction for valid config', async () => {
        const transaction = await prepaymentFlow.createPrepayment(validConfig);
        
        expect(transaction).toBeInstanceOf(Transaction);
        expect(mockClient.connection.getLatestBlockhash).toHaveBeenCalled();
      });

      test('should throw ValidationError for invalid amount', async () => {
        const invalidConfig = {
          ...validConfig,
          amount: 0n,
        };

        await expect(prepaymentFlow.createPrepayment(invalidConfig))
          .rejects.toThrow(ValidationError);
      });

      test('should throw ValidationError for same payer and recipient', async () => {
        const invalidConfig = {
          ...validConfig,
          recipient: mockPayer,
        };

        await expect(prepaymentFlow.createPrepayment(invalidConfig))
          .rejects.toThrow(ValidationError);
      });

      test('should handle network errors gracefully', async () => {
        (mockClient.connection.getLatestBlockhash as jest.Mock)
          .mockRejectedValueOnce(new Error('Network error'));

        await expect(prepaymentFlow.createPrepayment(validConfig))
          .rejects.toThrow(PaymentError);
      });
    });

    describe('executePrepayment', () => {
      const validConfig: PrepaymentConfig = {
        method: PaymentMethod.Prepay,
        payer: mockPayer,
        recipient: mockRecipient,
        amount: 1000000000n,
        pricing: {
          basePrice: 1000000000n,
          currency: 'A2AMPL',
        },
      };

      test('should execute prepayment successfully', async () => {
        const result = await prepaymentFlow.executePrepayment(validConfig);
        
        expect(result.signature).toBe('mock-signature');
        expect(result.slot).toBe(123n);
        expect(result.confirmationStatus).toBe('confirmed');
        expect(mockClient.sendAndConfirmTransaction).toHaveBeenCalled();
      });

      test('should handle transaction failure', async () => {
        (mockClient.sendAndConfirmTransaction as jest.Mock)
          .mockRejectedValueOnce(new Error('Transaction failed'));

        await expect(prepaymentFlow.executePrepayment(validConfig))
          .rejects.toThrow(PaymentError);
      });
    });

    describe('estimatePrepaymentCost', () => {
      const validConfig: PrepaymentConfig = {
        method: PaymentMethod.Prepay,
        payer: mockPayer,
        recipient: mockRecipient,
        amount: 1000000000n,
        pricing: {
          basePrice: 1000000000n,
          currency: 'A2AMPL',
        },
      };

      test('should estimate cost correctly', async () => {
        const estimate = await prepaymentFlow.estimatePrepaymentCost(validConfig);
        
        expect(estimate.paymentAmount).toBe(1000000000n);
        expect(estimate.networkFee).toBe(5000n);
        expect(estimate.totalCost).toBe(1000000000n);
      });

      test('should handle fee estimation failure gracefully', async () => {
        (mockClient.connection.getFeeForMessage as jest.Mock)
          .mockResolvedValueOnce({ value: null });

        const estimate = await prepaymentFlow.estimatePrepaymentCost(validConfig);
        expect(estimate.networkFee).toBe(5000n); // Default fallback
      });
    });
  });

  describe('PayAsYouGoFlow', () => {
    let payAsYouGoFlow: PayAsYouGoFlow;

    beforeEach(() => {
      payAsYouGoFlow = new PayAsYouGoFlow(mockClient);
    });

    describe('usage tracking', () => {
      test('should record usage correctly', () => {
        payAsYouGoFlow.recordUsage('service1', mockPayer, 100000000n, { type: 'api_call' });
        
        const records = payAsYouGoFlow.getUsageRecords('service1');
        expect(records).toHaveLength(1);
        expect(records[0]?.amount).toBe(100000000n);
        expect(records[0]?.metadata?.type).toBe('api_call');
      });

      test('should calculate usage cost correctly', () => {
        payAsYouGoFlow.recordUsage('service1', mockPayer, 100000000n);
        payAsYouGoFlow.recordUsage('service1', mockPayer, 200000000n);
        
        const totalCost = payAsYouGoFlow.calculateUsageCost('service1');
        expect(totalCost).toBe(300000000n);
      });

      test('should filter usage by timestamp', () => {
        const now = Date.now();
        payAsYouGoFlow.recordUsage('service1', mockPayer, 100000000n);
        
        // Simulate time passing
        jest.spyOn(Date, 'now').mockReturnValue(now + 1000);
        payAsYouGoFlow.recordUsage('service1', mockPayer, 200000000n);
        
        const recentCost = payAsYouGoFlow.calculateUsageCost('service1', now + 500);
        expect(recentCost).toBe(200000000n);
      });
    });

    describe('createUsagePayment', () => {
      const validConfig: PayAsYouGoConfig = {
        method: PaymentMethod.PayAsYouGo,
        payer: mockPayer,
        recipient: mockRecipient,
        perUsePrice: 100000000n,
        pricing: {
          basePrice: 100000000n,
          currency: 'A2AMPL',
        },
      };

      test('should create payment for accumulated usage', async () => {
        payAsYouGoFlow.recordUsage('service1', mockPayer, 100000000n);
        payAsYouGoFlow.recordUsage('service1', mockPayer, 200000000n);
        
        const result = await payAsYouGoFlow.createUsagePayment(validConfig, 'service1');
        
        expect(result.transaction).toBeInstanceOf(Transaction);
        expect(result.totalAmount).toBe(300000000n);
        expect(result.usageCount).toBe(2);
      });

      test('should throw error for no usage', async () => {
        await expect(payAsYouGoFlow.createUsagePayment(validConfig, 'nonexistent'))
          .rejects.toThrow(PaymentError);
      });
    });

    describe('createInstantPayment', () => {
      const validConfig: PayAsYouGoConfig = {
        method: PaymentMethod.PayAsYouGo,
        payer: mockPayer,
        recipient: mockRecipient,
        perUsePrice: 100000000n,
        pricing: {
          basePrice: 100000000n,
          currency: 'A2AMPL',
        },
      };

      test('should create instant payment transaction', async () => {
        const transaction = await payAsYouGoFlow.createInstantPayment(validConfig);
        
        expect(transaction).toBeInstanceOf(Transaction);
        expect(mockClient.connection.getLatestBlockhash).toHaveBeenCalled();
      });

      test('should validate config before creating transaction', async () => {
        const invalidConfig = {
          ...validConfig,
          perUsePrice: 0n,
        };

        await expect(payAsYouGoFlow.createInstantPayment(invalidConfig))
          .rejects.toThrow(ValidationError);
      });
    });

    describe('getUsageSummary', () => {
      test('should return correct usage summary', () => {
        payAsYouGoFlow.recordUsage('service1', mockPayer, 100000000n);
        payAsYouGoFlow.recordUsage('service1', mockPayer, 200000000n);
        payAsYouGoFlow.recordUsage('service1', mockPayer, 300000000n);
        
        const summary = payAsYouGoFlow.getUsageSummary('service1');
        
        expect(summary.totalCost).toBe(600000000n);
        expect(summary.usageCount).toBe(3);
        expect(summary.averageCost).toBe(200000000n);
        expect(summary.firstUsage).toBeDefined();
        expect(summary.lastUsage).toBeDefined();
      });

      test('should return empty summary for no usage', () => {
        const summary = payAsYouGoFlow.getUsageSummary('nonexistent');
        
        expect(summary.totalCost).toBe(0n);
        expect(summary.usageCount).toBe(0);
        expect(summary.averageCost).toBe(0n);
        expect(summary.firstUsage).toBeUndefined();
        expect(summary.lastUsage).toBeUndefined();
      });
    });
  });

  describe('StreamPaymentFlow', () => {
    let streamFlow: StreamPaymentFlow;

    beforeEach(() => {
      streamFlow = new StreamPaymentFlow(mockClient);
    });

    describe('createStream', () => {
      const validConfig: StreamConfig = {
        method: PaymentMethod.Stream,
        payer: mockPayer,
        recipient: mockRecipient,
        ratePerSecond: 1000000n, // 0.001 A2AMPL per second
        duration: 3600, // 1 hour
        pricing: {
          basePrice: 3600000000n,
          currency: 'A2AMPL',
        },
      };

      test('should create stream successfully', async () => {
        const result = await streamFlow.createStream(validConfig);
        
        expect(result.streamId).toBeDefined();
        expect(result.streamId).toMatch(/^stream_\d+_[a-z0-9]+$/);
        expect(result.initialTransaction).toBeInstanceOf(Transaction);
      });

      test('should validate stream configuration', async () => {
        const invalidConfig = {
          ...validConfig,
          ratePerSecond: 0n,
        };

        await expect(streamFlow.createStream(invalidConfig))
          .rejects.toThrow(ValidationError);
      });

      test('should reject too long duration', async () => {
        const invalidConfig = {
          ...validConfig,
          duration: 86401, // > 24 hours
        };

        await expect(streamFlow.createStream(invalidConfig))
          .rejects.toThrow(ValidationError);
      });

      test('should reject same payer and recipient', async () => {
        const invalidConfig = {
          ...validConfig,
          recipient: mockPayer,
        };

        await expect(streamFlow.createStream(invalidConfig))
          .rejects.toThrow(ValidationError);
      });
    });

    describe('startStream', () => {
      const validConfig: StreamConfig = {
        method: PaymentMethod.Stream,
        payer: mockPayer,
        recipient: mockRecipient,
        ratePerSecond: 1000000n,
        duration: 3600,
        pricing: {
          basePrice: 3600000000n,
          currency: 'A2AMPL',
        },
      };

      test('should start stream successfully', async () => {
        const { streamId } = await streamFlow.createStream(validConfig);
        const result = await streamFlow.startStream(streamId);
        
        expect(result.signature).toBe('mock-signature');
        expect(result.slot).toBe(123n);
        
        const status = streamFlow.getStreamStatus(streamId);
        expect(status.active).toBe(true);
      });

      test('should throw error for non-existent stream', async () => {
        await expect(streamFlow.startStream('non-existent'))
          .rejects.toThrow(PaymentError);
      });

      test('should throw error for already active stream', async () => {
        const { streamId } = await streamFlow.createStream(validConfig);
        await streamFlow.startStream(streamId);
        
        await expect(streamFlow.startStream(streamId))
          .rejects.toThrow(PaymentError);
      });
    });

    describe('stopStream', () => {
      const validConfig: StreamConfig = {
        method: PaymentMethod.Stream,
        payer: mockPayer,
        recipient: mockRecipient,
        ratePerSecond: 1000000n,
        duration: 3600,
        pricing: {
          basePrice: 3600000000n,
          currency: 'A2AMPL',
        },
      };

      test('should stop stream with refund', async () => {
        const { streamId } = await streamFlow.createStream(validConfig);
        await streamFlow.startStream(streamId);
        
        // Simulate stopping stream early
        const result = await streamFlow.stopStream(streamId);
        
        expect(result.finalAmount).toBeDefined();
        expect(result.refund).toBeDefined();
        
        const status = streamFlow.getStreamStatus(streamId);
        expect(status.active).toBe(false);
      });

      test('should throw error for non-existent stream', async () => {
        await expect(streamFlow.stopStream('non-existent'))
          .rejects.toThrow(PaymentError);
      });

      test('should throw error for inactive stream', async () => {
        const { streamId } = await streamFlow.createStream(validConfig);
        
        await expect(streamFlow.stopStream(streamId))
          .rejects.toThrow(PaymentError);
      });
    });

    describe('getStreamStatus', () => {
      const validConfig: StreamConfig = {
        method: PaymentMethod.Stream,
        payer: mockPayer,
        recipient: mockRecipient,
        ratePerSecond: 1000000n,
        duration: 3600,
        pricing: {
          basePrice: 3600000000n,
          currency: 'A2AMPL',
        },
      };

      test('should return correct stream status', async () => {
        const { streamId } = await streamFlow.createStream(validConfig);
        const status = streamFlow.getStreamStatus(streamId);
        
        expect(status.id).toBe(streamId);
        expect(status.payer.equals(mockPayer)).toBe(true);
        expect(status.recipient.equals(mockRecipient)).toBe(true);
        expect(status.ratePerSecond).toBe(1000000n);
        expect(status.duration).toBe(3600);
        expect(status.active).toBe(false);
        expect(status.progress).toBeGreaterThanOrEqual(0);
        expect(status.progress).toBeLessThanOrEqual(1);
      });

      test('should throw error for non-existent stream', () => {
        expect(() => streamFlow.getStreamStatus('non-existent'))
          .toThrow(PaymentError);
      });
    });

    describe('stream management', () => {
      test('should list streams correctly', async () => {
        const config1: StreamConfig = {
          method: PaymentMethod.Stream,
          payer: mockPayer,
          recipient: mockRecipient,
          ratePerSecond: 1000000n,
          duration: 3600,
          pricing: { basePrice: 3600000000n, currency: 'A2AMPL' },
        };

        const config2: StreamConfig = {
          method: PaymentMethod.Stream,
          payer: mockRecipient,
          recipient: mockPayer,
          ratePerSecond: 2000000n,
          duration: 1800,
          pricing: { basePrice: 3600000000n, currency: 'A2AMPL' },
        };

        const { streamId: id1 } = await streamFlow.createStream(config1);
        const { streamId: id2 } = await streamFlow.createStream(config2);
        await streamFlow.startStream(id1);

        const allStreams = streamFlow.listStreams();
        expect(allStreams).toHaveLength(2);

        const activeStreams = streamFlow.listStreams(true);
        expect(activeStreams).toHaveLength(1);
        expect(activeStreams[0]?.id).toBe(id1);
      });

      test('should get streams by payer', async () => {
        const config: StreamConfig = {
          method: PaymentMethod.Stream,
          payer: mockPayer,
          recipient: mockRecipient,
          ratePerSecond: 1000000n,
          duration: 3600,
          pricing: { basePrice: 3600000000n, currency: 'A2AMPL' },
        };

        await streamFlow.createStream(config);
        
        const payerStreams = streamFlow.getStreamsByPayer(mockPayer);
        expect(payerStreams).toHaveLength(1);
        expect(payerStreams[0]?.payer.equals(mockPayer)).toBe(true);

        const otherStreams = streamFlow.getStreamsByPayer(mockRecipient);
        expect(otherStreams).toHaveLength(0);
      });

      test('should clean up completed streams', async () => {
        const config: StreamConfig = {
          method: PaymentMethod.Stream,
          payer: mockPayer,
          recipient: mockRecipient,
          ratePerSecond: 1000000n,
          duration: 1, // 1 second
          pricing: { basePrice: 1000000n, currency: 'A2AMPL' },
        };

        const { streamId } = await streamFlow.createStream(config);
        
        // Simulate time passage (streams are cleaned up 1 hour after completion)
        const stream = streamFlow.listStreams().find(s => s.id === streamId);
        if (stream) {
          stream.endTime = Date.now() - 3700000; // 1 hour and 1 minute ago
          stream.active = false;
        }

        const cleaned = streamFlow.cleanupCompletedStreams();
        expect(cleaned).toBe(1);
        
        const remainingStreams = streamFlow.listStreams();
        expect(remainingStreams).toHaveLength(0);
      });
    });
  });
});