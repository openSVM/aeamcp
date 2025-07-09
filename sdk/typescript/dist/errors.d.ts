import { SdkErrorDetails } from './types.js';
/**
 * Base SDK error class
 */
export declare abstract class SdkError extends Error {
    readonly code: string;
    readonly programErrorCode?: number;
    readonly transactionSignature?: string;
    readonly cause?: Error;
    constructor(details: SdkErrorDetails);
    toJSON(): Record<string, unknown>;
}
/**
 * Validation errors for input parameters
 */
export declare class ValidationError extends SdkError {
    constructor(message: string, field?: string);
}
/**
 * Network/RPC related errors
 */
export declare class NetworkError extends SdkError {
    constructor(message: string, cause?: Error);
}
/**
 * Transaction related errors
 */
export declare class TransactionError extends SdkError {
    constructor(message: string, signature?: string, programErrorCode?: number, cause?: Error);
}
/**
 * Program execution errors
 */
export declare class ProgramError extends SdkError {
    constructor(message: string, programErrorCode: number, signature?: string, cause?: Error);
}
/**
 * Account related errors
 */
export declare class AccountError extends SdkError {
    constructor(message: string, cause?: Error);
}
/**
 * IDL loading/parsing errors
 */
export declare class IdlError extends SdkError {
    constructor(message: string, cause?: Error);
}
/**
 * Payment flow related errors
 */
export declare class PaymentError extends SdkError {
    constructor(message: string, cause?: Error);
}
/**
 * Configuration errors
 */
export declare class ConfigError extends SdkError {
    constructor(message: string);
}
/**
 * Registry specific errors
 */
export declare class RegistryError extends SdkError {
    constructor(message: string, programErrorCode?: number, signature?: string, cause?: Error);
}
/**
 * Maps Solana program error codes to meaningful error messages
 */
export declare function mapProgramError(errorCode: number): string;
/**
 * Error factory for creating appropriate error types
 */
export declare class ErrorFactory {
    static createFromProgramError(errorCode: number, signature?: string, cause?: Error): ProgramError;
    static createFromTransactionError(error: Error, signature?: string): TransactionError;
    static createFromNetworkError(error: Error): NetworkError;
    static createValidationError(message: string, field?: string): ValidationError;
}
//# sourceMappingURL=errors.d.ts.map