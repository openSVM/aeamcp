/**
 * Validation Types
 * 
 * These interfaces define the validation result structures, error types,
 * and security-related interfaces used throughout the data validation
 * and integrity checking systems.
 */

import { PublicKey } from '@solana/web3.js';

// ============================================================================
// VALIDATION RESULT TYPES
// ============================================================================

/**
 * Base validation result interface
 */
export interface ValidationResult {
  /** Whether the validation passed */
  valid: boolean;
  /** Error message if validation failed */
  error?: string;
  /** Severity level of the validation issue */
  severity?: 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL';
  /** Additional details about the validation */
  details?: Record<string, any>;
}

/**
 * Security validation result with comprehensive scoring
 */
export interface SecurityValidationResult {
  /** Overall validation status */
  overall: boolean;
  /** Individual validation results for each layer */
  validationResults: ValidationResult[];
  /** Authority verification information */
  authorityVerification: AuthorityVerificationResult;
  /** Calculated security score (0-100) */
  securityScore: number;
  /** Timestamp of validation */
  timestamp: number;
  /** Risk level assessment */
  riskLevel?: 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL';
  /** Recommendations for improvement */
  recommendations?: string[];
}

/**
 * Validation context for comprehensive validation
 */
export interface ValidationContext {
  /** Account PDA for verification */
  accountPDA?: PublicKey;
  /** Seeds used for PDA derivation */
  seeds?: (string | Buffer | Uint8Array)[];
  /** Expected program ID */
  programId?: PublicKey;
  /** Validation mode */
  mode?: 'strict' | 'relaxed' | 'development';
  /** Additional context data */
  metadata?: Record<string, any>;
}

// ============================================================================
// ERROR TYPES AND CLASSIFICATIONS
// ============================================================================

/**
 * User-friendly error structure
 */
export interface UserFriendlyError {
  /** Type of error for handling */
  type: ErrorType;
  /** User-friendly error message */
  message: string;
  /** Suggestion for resolving the error */
  suggestion?: string;
  /** Whether the error is recoverable */
  recoverable: boolean;
  /** Technical details for debugging */
  technicalDetails?: Record<string, any>;
  /** Error code for programmatic handling */
  code?: string;
}

/**
 * Error type enumeration
 */
export enum ErrorType {
  // Network and connection errors
  NETWORK_ERROR = 'NETWORK_ERROR',
  RPC_TIMEOUT = 'RPC_TIMEOUT',
  CONNECTION_FAILED = 'CONNECTION_FAILED',
  
  // Blockchain-specific errors
  ACCOUNT_NOT_FOUND = 'ACCOUNT_NOT_FOUND',
  INSUFFICIENT_BALANCE = 'INSUFFICIENT_BALANCE',
  TRANSACTION_FAILED = 'TRANSACTION_FAILED',
  PROGRAM_ERROR = 'PROGRAM_ERROR',
  
  // Data integrity errors
  DESERIALIZATION_ERROR = 'DESERIALIZATION_ERROR',
  SCHEMA_VALIDATION_ERROR = 'SCHEMA_VALIDATION_ERROR',
  DATA_CORRUPTION = 'DATA_CORRUPTION',
  HASH_MISMATCH = 'HASH_MISMATCH',
  
  // Security errors
  CRYPTOGRAPHIC_ERROR = 'CRYPTOGRAPHIC_ERROR',
  AUTHORITY_VERIFICATION_FAILED = 'AUTHORITY_VERIFICATION_FAILED',
  MALICIOUS_CONTENT_DETECTED = 'MALICIOUS_CONTENT_DETECTED',
  SUSPICIOUS_ACTIVITY = 'SUSPICIOUS_ACTIVITY',
  
  // Business logic errors
  BUSINESS_RULE_VIOLATION = 'BUSINESS_RULE_VIOLATION',
  RATE_LIMIT_EXCEEDED = 'RATE_LIMIT_EXCEEDED',
  PERMISSION_DENIED = 'PERMISSION_DENIED',
  INVALID_STATE = 'INVALID_STATE',
  
  // Content security errors
  INVALID_URL = 'INVALID_URL',
  UNSAFE_CONTENT = 'UNSAFE_CONTENT',
  SIZE_LIMIT_EXCEEDED = 'SIZE_LIMIT_EXCEEDED',
  
  // Unknown or generic errors
  UNKNOWN_ERROR = 'UNKNOWN_ERROR',
  VALIDATION_ERROR = 'VALIDATION_ERROR'
}

/**
 * Detailed error information with context
 */
export interface DetailedError extends Error {
  /** Error type classification */
  type: ErrorType;
  /** Error severity level */
  severity: 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL';
  /** Whether the error is recoverable */
  recoverable: boolean;
  /** Context where the error occurred */
  context?: string;
  /** Additional metadata */
  metadata?: Record<string, any>;
  /** Timestamp when error occurred */
  timestamp: number;
}

/**
 * Custom error classes for different scenarios
 */
export class DeserializationError extends Error {
  public readonly type = ErrorType.DESERIALIZATION_ERROR;
  public readonly severity = 'HIGH';
  public readonly recoverable = false;
  
  constructor(message: string, public readonly originalError?: Error) {
    super(message);
    this.name = 'DeserializationError';
  }
}

export class SerializationError extends Error {
  public readonly type = ErrorType.DESERIALIZATION_ERROR;
  public readonly severity = 'HIGH';
  public readonly recoverable = true;
  
  constructor(message: string, public readonly originalError?: Error) {
    super(message);
    this.name = 'SerializationError';
  }
}

export class SecurityValidationError extends Error {
  public readonly type = ErrorType.CRYPTOGRAPHIC_ERROR;
  public readonly severity = 'CRITICAL';
  public readonly recoverable = false;
  
  constructor(message: string, public readonly validationResults?: ValidationResult[]) {
    super(message);
    this.name = 'SecurityValidationError';
  }
}

// ============================================================================
// AUTHORITY AND REPUTATION TYPES
// ============================================================================

/**
 * Authority verification result
 */
export interface AuthorityVerificationResult {
  /** Base58 encoded authority address */
  authority: string;
  /** Whether the authority is in the trusted list */
  isTrusted: boolean;
  /** Trust level assessment */
  trustLevel: 'HIGH' | 'MEDIUM' | 'LOW' | 'UNKNOWN';
  /** Reputation score and history */
  reputation: ReputationScore;
  /** Whether the authority is blacklisted */
  isBlacklisted: boolean;
  /** Timestamp of verification */
  verificationTimestamp: number;
  /** Additional verification metadata */
  metadata?: Record<string, any>;
}

/**
 * Reputation scoring system
 */
export interface ReputationScore {
  /** Overall reputation score (0-100) */
  score: number;
  /** Number of successful registrations */
  registrationCount: number;
  /** Timestamp of last activity */
  lastActivity: number;
  /** Number of violations/issues */
  violations: number;
  /** Historical performance metrics */
  metrics?: ReputationMetrics;
}

/**
 * Detailed reputation metrics
 */
export interface ReputationMetrics {
  /** Average response time for services */
  avgResponseTime?: number;
  /** Uptime percentage */
  uptime?: number;
  /** User satisfaction score */
  userSatisfaction?: number;
  /** Number of successful transactions */
  successfulTransactions?: number;
  /** Number of failed transactions */
  failedTransactions?: number;
}

// ============================================================================
// CACHE AND PERFORMANCE TYPES
// ============================================================================

/**
 * Cache entry structure
 */
export interface CacheEntry<T> {
  /** Cached data */
  data: T;
  /** Timestamp when cached */
  timestamp: number;
  /** Time to live in seconds */
  ttl: number;
  /** Cache version for invalidation */
  version: string;
  /** Size of the cached data in bytes */
  size?: number;
  /** Number of times accessed */
  accessCount?: number;
}

/**
 * Cache options for storing data
 */
export interface CacheOptions {
  /** Time to live in seconds */
  ttl?: number;
  /** Cache version for invalidation */
  version?: string;
  /** Priority level for eviction */
  priority?: 'LOW' | 'MEDIUM' | 'HIGH';
  /** Whether to compress the data */
  compress?: boolean;
}

/**
 * Performance metrics for monitoring
 */
export interface PerformanceMetrics {
  /** Operation duration in milliseconds */
  duration: number;
  /** Memory usage in bytes */
  memoryUsage?: number;
  /** Number of RPC calls made */
  rpcCalls?: number;
  /** Cache hit ratio */
  cacheHitRatio?: number;
  /** Error count */
  errorCount?: number;
  /** Timestamp of measurement */
  timestamp: number;
}

// ============================================================================
// FALLBACK AND RELIABILITY TYPES
// ============================================================================

/**
 * Fallback result with source information
 */
export interface FallbackResult<T> {
  /** The actual data */
  data: T;
  /** Source of the data */
  source: 'blockchain' | 'blockchain-secondary' | 'cache-fresh' | 'cache-stale' | 'default';
  /** Confidence level in the data (0-100) */
  confidence: number;
  /** Additional metadata about the fallback */
  metadata?: Record<string, any>;
}

/**
 * Data operation interface for fallback systems
 */
export interface DataOperation<T> {
  /** Cache key for this operation */
  cacheKey: string;
  /** Function to get default data if all else fails */
  getDefaultData: () => T;
  /** Operation timeout in milliseconds */
  timeout?: number;
  /** Retry configuration */
  retryConfig?: RetryConfig;
}

/**
 * Retry configuration
 */
export interface RetryConfig {
  /** Maximum number of retries */
  maxRetries: number;
  /** Initial delay in milliseconds */
  initialDelay: number;
  /** Maximum delay in milliseconds */
  maxDelay: number;
  /** Backoff multiplier */
  backoffMultiplier: number;
  /** Jitter to add to delays */
  jitter?: boolean;
}

// ============================================================================
// TRANSACTION AND STATE MANAGEMENT TYPES
// ============================================================================

/**
 * Transaction state enumeration
 */
export enum TransactionState {
  PENDING = 'pending',
  SUBMITTED = 'submitted',
  CONFIRMED = 'confirmed',
  FINALIZED = 'finalized',
  FAILED = 'failed',
  CANCELLED = 'cancelled'
}

/**
 * Transaction result information
 */
export interface TransactionResult {
  /** Whether the transaction was successful */
  success: boolean;
  /** Transaction signature */
  signature?: string;
  /** Error information if failed */
  error?: UserFriendlyError;
  /** Transaction state */
  state: TransactionState;
  /** Confirmation information */
  confirmation?: any;
  /** Gas/fee information */
  fee?: number;
  /** Timestamp of completion */
  timestamp?: number;
}

// ============================================================================
// FEATURE FLAG TYPES
// ============================================================================

/**
 * Feature flag configuration
 */
export interface FeatureFlag {
  /** Feature flag identifier */
  id: string;
  /** Human-readable name */
  name: string;
  /** Feature description */
  description: string;
  /** Whether the flag is enabled */
  enabled: boolean;
  /** Rollout percentage (0-100) */
  rolloutPercentage: number;
  /** Environment restrictions */
  environments?: string[];
  /** User restrictions */
  userRestrictions?: string[];
  /** Expiration date */
  expirationDate?: Date;
}

/**
 * Feature flag context for evaluation
 */
export interface FeatureFlagContext {
  /** User identifier */
  userId?: string;
  /** Current environment */
  environment: string;
  /** Additional context data */
  properties?: Record<string, any>;
}

// ============================================================================
// TYPE UTILITY FUNCTIONS
// ============================================================================

/**
 * Type guard for ValidationResult
 */
export function isValidationResult(value: any): value is ValidationResult {
  return (
    typeof value === 'object' &&
    value !== null &&
    typeof value.valid === 'boolean'
  );
}

/**
 * Type guard for UserFriendlyError
 */
export function isUserFriendlyError(value: any): value is UserFriendlyError {
  return (
    typeof value === 'object' &&
    value !== null &&
    typeof value.type === 'string' &&
    typeof value.message === 'string' &&
    typeof value.recoverable === 'boolean'
  );
}

/**
 * Type guard for CacheEntry
 */
export function isCacheEntry<T>(value: any): value is CacheEntry<T> {
  return (
    typeof value === 'object' &&
    value !== null &&
    value.data !== undefined &&
    typeof value.timestamp === 'number' &&
    typeof value.ttl === 'number' &&
    typeof value.version === 'string'
  );
}