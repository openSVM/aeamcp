import { PublicKey } from '@solana/web3.js';

/**
 * Canonical payload structure for Solana wallet signature-based authentication
 */
export interface SolanaAuthPayload {
  /** The API path being accessed */
  path: string;
  /** Timestamp when the request was created (Unix timestamp in seconds) */
  ts: number;
  /** Unique nonce to prevent replay attacks */
  nonce: string;
  /** Optional additional data specific to the request */
  data?: Record<string, any>;
}

/**
 * Solana signature verification result
 */
export interface SolanaSignatureVerificationResult {
  /** Whether the signature is valid */
  isValid: boolean;
  /** The recovered public key from the signature */
  publicKey: PublicKey | null;
  /** Any error message if verification failed */
  error?: string;
}

/**
 * On-chain access control result
 */
export interface OnChainAccessResult {
  /** Whether access is granted */
  hasAccess: boolean;
  /** The wallet address that was checked */
  walletAddress: string;
  /** Resource being accessed */
  resource: string;
  /** Timestamp when access was checked */
  checkedAt: number;
  /** Additional metadata about the access permission */
  metadata?: {
    /** Type of access (read, write, admin, etc.) */
    accessType?: string;
    /** Expiration timestamp if access is temporary */
    expiresAt?: number;
    /** Any additional on-chain data */
    onChainData?: Record<string, any>;
  };
}

/**
 * Solana authentication request headers
 */
export interface SolanaAuthHeaders {
  /** Base64 encoded signature */
  'x-solana-signature': string;
  /** Base64 encoded public key */
  'x-solana-pubkey': string;
  /** Unix timestamp when the signature was created */
  'x-solana-timestamp': string;
  /** Unique nonce for replay protection */
  'x-solana-nonce': string;
}

/**
 * Configuration for Solana authentication middleware
 */
export interface SolanaAuthConfig {
  /** RPC endpoint for Solana network */
  rpcEndpoint: string;
  /** Program ID for the access control registry */
  registryProgramId: string;
  /** Maximum age of signature in seconds (default: 300 = 5 minutes) */
  maxSignatureAge?: number;
  /** Cache TTL for access control checks in seconds (default: 60) */
  accessCacheTtl?: number;
  /** Whether to enable signature verification (can be disabled for development) */
  enableSignatureVerification?: boolean;
}

/**
 * Solana authentication context added to Express request
 */
export interface SolanaAuthContext {
  /** The verified wallet public key */
  walletPublicKey: PublicKey;
  /** The wallet address as a string */
  walletAddress: string;
  /** The original payload that was signed */
  payload: SolanaAuthPayload;
  /** On-chain access verification result */
  accessResult: OnChainAccessResult;
  /** When the authentication was verified */
  verifiedAt: number;
}

/**
 * Extended Express Request with Solana authentication context
 */
declare global {
  namespace Express {
    interface Request {
      solanaAuth?: SolanaAuthContext;
    }
  }
}

/**
 * Solana authentication error types
 */
export enum SolanaAuthErrorType {
  MISSING_HEADERS = 'MISSING_HEADERS',
  INVALID_SIGNATURE = 'INVALID_SIGNATURE',
  INVALID_PUBKEY = 'INVALID_PUBKEY',
  SIGNATURE_EXPIRED = 'SIGNATURE_EXPIRED',
  INVALID_NONCE = 'INVALID_NONCE',
  REPLAY_ATTACK = 'REPLAY_ATTACK',
  ACCESS_DENIED = 'ACCESS_DENIED',
  ONCHAIN_CHECK_FAILED = 'ONCHAIN_CHECK_FAILED',
  INVALID_PAYLOAD = 'INVALID_PAYLOAD',
  NETWORK_ERROR = 'NETWORK_ERROR'
}

/**
 * Solana authentication error class
 */
export class SolanaAuthError extends Error {
  constructor(
    public type: SolanaAuthErrorType,
    message: string,
    public details?: Record<string, any>
  ) {
    super(message);
    this.name = 'SolanaAuthError';
  }
}