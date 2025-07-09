import { describe, test, expect } from '@jest/globals';
import {
  SdkError,
  ValidationError,
  NetworkError,
  TransactionError,
  ProgramError,
  AccountError,
  IdlError,
  PaymentError,
  ConfigError,
  RegistryError,
  ErrorFactory,
  mapProgramError,
} from '../../src/errors.js';

describe('Error System', () => {
  describe('SdkError base class', () => {
    class TestError extends SdkError {
      constructor(message: string) {
        super({
          code: 'TEST_ERROR',
          message,
        });
      }
    }

    test('should create error with required properties', () => {
      const error = new TestError('Test message');
      expect(error.message).toBe('Test message');
      expect(error.code).toBe('TEST_ERROR');
      expect(error.name).toBe('TestError');
      expect(error).toBeInstanceOf(Error);
      expect(error).toBeInstanceOf(SdkError);
    });

    test('should include optional properties when provided', () => {
      class DetailedError extends SdkError {
        constructor() {
          super({
            code: 'DETAILED_ERROR',
            message: 'Detailed error',
            programErrorCode: 6000,
            transactionSignature: 'sig123',
            cause: new Error('Root cause'),
          });
        }
      }

      const error = new DetailedError();
      expect(error.programErrorCode).toBe(6000);
      expect(error.transactionSignature).toBe('sig123');
      expect(error.cause).toBeInstanceOf(Error);
      expect(error.cause?.message).toBe('Root cause');
    });

    test('should serialize to JSON correctly', () => {
      const error = new TestError('Test message');
      const json = error.toJSON();
      
      expect(json.name).toBe('TestError');
      expect(json.message).toBe('Test message');
      expect(json.code).toBe('TEST_ERROR');
      expect(json.stack).toBeDefined();
    });
  });

  describe('ValidationError', () => {
    test('should create validation error without field', () => {
      const error = new ValidationError('Invalid input');
      expect(error.message).toBe('Invalid input');
      expect(error.code).toBe('VALIDATION_ERROR');
    });

    test('should create validation error with field', () => {
      const error = new ValidationError('Too long', 'agentName');
      expect(error.message).toBe("Validation failed for field 'agentName': Too long");
      expect(error.code).toBe('VALIDATION_ERROR');
    });
  });

  describe('NetworkError', () => {
    test('should create network error', () => {
      const error = new NetworkError('Connection failed');
      expect(error.message).toBe('Network error: Connection failed');
      expect(error.code).toBe('NETWORK_ERROR');
    });

    test('should include cause', () => {
      const cause = new Error('Socket timeout');
      const error = new NetworkError('Connection failed', cause);
      expect(error.cause).toBe(cause);
    });
  });

  describe('TransactionError', () => {
    test('should create transaction error', () => {
      const error = new TransactionError('Transaction failed');
      expect(error.message).toBe('Transaction error: Transaction failed');
      expect(error.code).toBe('TRANSACTION_ERROR');
    });

    test('should include transaction signature and program error', () => {
      const error = new TransactionError(
        'Insufficient funds',
        'sig123',
        6200,
        new Error('Root cause')
      );
      expect(error.transactionSignature).toBe('sig123');
      expect(error.programErrorCode).toBe(6200);
      expect(error.cause).toBeInstanceOf(Error);
    });
  });

  describe('ProgramError', () => {
    test('should create program error', () => {
      const error = new ProgramError('Invalid instruction', 6000);
      expect(error.message).toBe('Program error: Invalid instruction');
      expect(error.code).toBe('PROGRAM_ERROR');
      expect(error.programErrorCode).toBe(6000);
    });

    test('should include signature and cause', () => {
      const cause = new Error('Root cause');
      const error = new ProgramError('Custom error', 6001, 'sig123', cause);
      expect(error.transactionSignature).toBe('sig123');
      expect(error.cause).toBe(cause);
    });
  });

  describe('AccountError', () => {
    test('should create account error', () => {
      const error = new AccountError('Account not found');
      expect(error.message).toBe('Account error: Account not found');
      expect(error.code).toBe('ACCOUNT_ERROR');
    });
  });

  describe('IdlError', () => {
    test('should create IDL error', () => {
      const error = new IdlError('Failed to parse IDL');
      expect(error.message).toBe('IDL error: Failed to parse IDL');
      expect(error.code).toBe('IDL_ERROR');
    });
  });

  describe('PaymentError', () => {
    test('should create payment error', () => {
      const error = new PaymentError('Insufficient balance');
      expect(error.message).toBe('Payment error: Insufficient balance');
      expect(error.code).toBe('PAYMENT_ERROR');
    });
  });

  describe('ConfigError', () => {
    test('should create config error', () => {
      const error = new ConfigError('Invalid RPC URL');
      expect(error.message).toBe('Configuration error: Invalid RPC URL');
      expect(error.code).toBe('CONFIG_ERROR');
    });
  });

  describe('RegistryError', () => {
    test('should create registry error', () => {
      const error = new RegistryError('Agent already exists');
      expect(error.message).toBe('Registry error: Agent already exists');
      expect(error.code).toBe('REGISTRY_ERROR');
    });

    test('should include all optional parameters', () => {
      const cause = new Error('Root cause');
      const error = new RegistryError('Registry error', 6000, 'sig123', cause);
      expect(error.programErrorCode).toBe(6000);
      expect(error.transactionSignature).toBe('sig123');
      expect(error.cause).toBe(cause);
    });
  });

  describe('mapProgramError', () => {
    test('should map known error codes', () => {
      expect(mapProgramError(6000)).toBe('Agent ID already exists');
      expect(mapProgramError(6001)).toBe('Agent ID too long');
      expect(mapProgramError(6100)).toBe('Server ID already exists');
      expect(mapProgramError(6200)).toBe('Insufficient balance');
      expect(mapProgramError(6300)).toBe('Invalid token mint');
    });

    test('should handle unknown error codes', () => {
      expect(mapProgramError(9999)).toBe('Unknown program error: 9999');
    });

    test('should handle Anchor common errors', () => {
      expect(mapProgramError(100)).toBe('Invalid instruction data');
      expect(mapProgramError(101)).toBe('Invalid account data');
    });
  });

  describe('ErrorFactory', () => {
    test('should create ProgramError from error code', () => {
      const error = ErrorFactory.createFromProgramError(6000, 'sig123');
      expect(error).toBeInstanceOf(ProgramError);
      expect(error.message).toBe('Program error: Agent ID already exists');
      expect(error.programErrorCode).toBe(6000);
      expect(error.transactionSignature).toBe('sig123');
    });

    test('should create ProgramError from transaction error with custom program error', () => {
      const txError = new Error('Transaction failed: custom program error: 0x1770');
      const error = ErrorFactory.createFromTransactionError(txError, 'sig123');
      
      expect(error).toBeInstanceOf(ProgramError);
      expect(error.programErrorCode).toBe(0x1770);
      expect(error.transactionSignature).toBe('sig123');
      expect(error.cause).toBe(txError);
    });

    test('should create TransactionError from generic transaction error', () => {
      const txError = new Error('Network timeout');
      const error = ErrorFactory.createFromTransactionError(txError, 'sig123');
      
      expect(error).toBeInstanceOf(TransactionError);
      expect(error.message).toBe('Transaction error: Network timeout');
      expect(error.transactionSignature).toBe('sig123');
      expect(error.programErrorCode).toBeUndefined();
    });

    test('should create NetworkError from network error', () => {
      const netError = new Error('Connection refused');
      const error = ErrorFactory.createFromNetworkError(netError);
      
      expect(error).toBeInstanceOf(NetworkError);
      expect(error.message).toBe('Network error: Connection refused');
      expect(error.cause).toBe(netError);
    });

    test('should create ValidationError', () => {
      const error = ErrorFactory.createValidationError('Invalid format', 'agentId');
      expect(error).toBeInstanceOf(ValidationError);
      expect(error.message).toBe("Validation failed for field 'agentId': Invalid format");
    });
  });

  describe('error inheritance and instanceof checks', () => {
    test('all custom errors should be instances of SdkError', () => {
      const errors = [
        new ValidationError('test'),
        new NetworkError('test'),
        new TransactionError('test'),
        new ProgramError('test', 6000),
        new AccountError('test'),
        new IdlError('test'),
        new PaymentError('test'),
        new ConfigError('test'),
        new RegistryError('test'),
      ];

      errors.forEach(error => {
        expect(error).toBeInstanceOf(SdkError);
        expect(error).toBeInstanceOf(Error);
      });
    });

    test('should maintain proper error types for instanceof checks', () => {
      const validationError = new ValidationError('test');
      const networkError = new NetworkError('test');
      
      expect(validationError instanceof ValidationError).toBe(true);
      expect(validationError instanceof NetworkError).toBe(false);
      expect(networkError instanceof NetworkError).toBe(true);
      expect(networkError instanceof ValidationError).toBe(false);
    });
  });

  describe('error stack traces', () => {
    test('should preserve stack traces', () => {
      const error = new ValidationError('test');
      expect(error.stack).toBeDefined();
      expect(error.stack).toContain('ValidationError');
    });

    test('should maintain original stack trace with cause', () => {
      const originalError = new Error('Original error');
      const wrappedError = new NetworkError('Wrapped error', originalError);
      
      expect(wrappedError.stack).toBeDefined();
      expect(wrappedError.cause).toBe(originalError);
    });
  });
});