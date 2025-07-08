import { SdkErrorDetails } from './types.js';

/**
 * Base SDK error class
 */
export abstract class SdkError extends Error {
  public readonly code: string;
  public readonly programErrorCode?: number;
  public readonly transactionSignature?: string;
  public readonly cause?: Error;

  constructor(details: SdkErrorDetails) {
    super(details.message);
    this.name = this.constructor.name;
    this.code = details.code;
    this.programErrorCode = details.programErrorCode;
    this.transactionSignature = details.transactionSignature;
    this.cause = details.cause;

    // Maintains proper stack trace for where our error was thrown (only available on V8)
    if (Error.captureStackTrace) {
      Error.captureStackTrace(this, this.constructor);
    }
  }

  toJSON(): Record<string, unknown> {
    return {
      name: this.name,
      message: this.message,
      code: this.code,
      programErrorCode: this.programErrorCode,
      transactionSignature: this.transactionSignature,
      stack: this.stack,
      cause: this.cause?.message,
    };
  }
}

/**
 * Validation errors for input parameters
 */
export class ValidationError extends SdkError {
  constructor(message: string, field?: string) {
    super({
      code: 'VALIDATION_ERROR',
      message: field ? `Validation failed for field '${field}': ${message}` : message,
    });
  }
}

/**
 * Network/RPC related errors
 */
export class NetworkError extends SdkError {
  constructor(message: string, cause?: Error) {
    super({
      code: 'NETWORK_ERROR',
      message: `Network error: ${message}`,
      cause,
    });
  }
}

/**
 * Transaction related errors
 */
export class TransactionError extends SdkError {
  constructor(message: string, signature?: string, programErrorCode?: number, cause?: Error) {
    super({
      code: 'TRANSACTION_ERROR',
      message: `Transaction error: ${message}`,
      transactionSignature: signature,
      programErrorCode,
      cause,
    });
  }
}

/**
 * Program execution errors
 */
export class ProgramError extends SdkError {
  constructor(message: string, programErrorCode: number, signature?: string, cause?: Error) {
    super({
      code: 'PROGRAM_ERROR',
      message: `Program error: ${message}`,
      programErrorCode,
      transactionSignature: signature,
      cause,
    });
  }
}

/**
 * Account related errors
 */
export class AccountError extends SdkError {
  constructor(message: string, cause?: Error) {
    super({
      code: 'ACCOUNT_ERROR',
      message: `Account error: ${message}`,
      cause,
    });
  }
}

/**
 * IDL loading/parsing errors
 */
export class IdlError extends SdkError {
  constructor(message: string, cause?: Error) {
    super({
      code: 'IDL_ERROR',
      message: `IDL error: ${message}`,
      cause,
    });
  }
}

/**
 * Payment flow related errors
 */
export class PaymentError extends SdkError {
  constructor(message: string, cause?: Error) {
    super({
      code: 'PAYMENT_ERROR',
      message: `Payment error: ${message}`,
      cause,
    });
  }
}

/**
 * Configuration errors
 */
export class ConfigError extends SdkError {
  constructor(message: string) {
    super({
      code: 'CONFIG_ERROR',
      message: `Configuration error: ${message}`,
    });
  }
}

/**
 * Registry specific errors
 */
export class RegistryError extends SdkError {
  constructor(message: string, programErrorCode?: number, signature?: string, cause?: Error) {
    super({
      code: 'REGISTRY_ERROR',
      message: `Registry error: ${message}`,
      programErrorCode,
      transactionSignature: signature,
      cause,
    });
  }
}

/**
 * Maps Solana program error codes to meaningful error messages
 */
export function mapProgramError(errorCode: number): string {
  const errorMap: Record<number, string> = {
    // Common Anchor errors
    100: 'Invalid instruction data',
    101: 'Invalid account data',
    102: 'Invalid program id',
    103: 'Invalid account owner',
    104: 'Invalid account info',
    
    // Agent Registry specific errors (these would come from the actual program)
    6000: 'Agent ID already exists',
    6001: 'Agent ID too long',
    6002: 'Agent name too long',
    6003: 'Agent description too long',
    6004: 'Invalid agent status',
    6005: 'Unauthorized agent update',
    6006: 'Agent not found',
    6007: 'Invalid service endpoint',
    6008: 'Too many service endpoints',
    6009: 'Invalid skill definition',
    6010: 'Too many skills',
    6011: 'Invalid tag format',
    6012: 'Too many tags',
    6013: 'Invalid URL format',
    6014: 'Insufficient stake amount',
    6015: 'Invalid lock period',
    6016: 'Stake still locked',
    6017: 'Invalid tier for stake amount',

    // MCP Server Registry specific errors
    6100: 'Server ID already exists', 
    6101: 'Server ID too long',
    6102: 'Server name too long',
    6103: 'Invalid server status',
    6104: 'Unauthorized server update',
    6105: 'Server not found',
    6106: 'Invalid endpoint URL',
    6107: 'Invalid capabilities summary',
    6108: 'Too many tool definitions',
    6109: 'Too many resource definitions',
    6110: 'Too many prompt definitions',
    6111: 'Invalid tool definition',
    6112: 'Invalid resource definition',
    6113: 'Invalid prompt definition',

    // Payment and fee errors
    6200: 'Insufficient balance',
    6201: 'Invalid payment amount',
    6202: 'Payment already completed',
    6203: 'Payment expired',
    6204: 'Invalid recipient',
    6205: 'Fee calculation error',
    6206: 'Invalid pricing configuration',

    // Token and staking errors
    6300: 'Invalid token mint',
    6301: 'Invalid token account',
    6302: 'Token transfer failed',
    6303: 'Invalid stake amount',
    6304: 'Stake account not found',
    6305: 'Staking period not elapsed',
    6306: 'Invalid unstake request',
  };

  return errorMap[errorCode] ?? `Unknown program error: ${errorCode}`;
}

/**
 * Error factory for creating appropriate error types
 */
export class ErrorFactory {
  static createFromProgramError(errorCode: number, signature?: string, cause?: Error): ProgramError {
    const message = mapProgramError(errorCode);
    return new ProgramError(message, errorCode, signature, cause);
  }

  static createFromTransactionError(error: Error, signature?: string): TransactionError {
    // Try to extract program error code from Solana transaction error
    const programErrorMatch = error.message.match(/custom program error: 0x([0-9a-fA-F]+)/);
    if (programErrorMatch) {
      const errorCode = parseInt(programErrorMatch[1], 16);
      return this.createFromProgramError(errorCode, signature, error);
    }

    return new TransactionError(error.message, signature, undefined, error);
  }

  static createFromNetworkError(error: Error): NetworkError {
    return new NetworkError(error.message, error);
  }

  static createValidationError(message: string, field?: string): ValidationError {
    return new ValidationError(message, field);
  }
}