import { SolanaAuthPayload } from '../types/solana-auth.types';

/**
 * Utility functions for creating and validating Solana authentication payloads
 */

/**
 * Generate a cryptographically secure nonce
 */
export function generateNonce(): string {
  // Generate 16 random bytes and encode as base64
  const buffer = new Uint8Array(16);
  if (typeof crypto !== 'undefined' && crypto.getRandomValues) {
    crypto.getRandomValues(buffer);
  } else {
    // Node.js fallback
    const crypto = require('crypto');
    const randomBytes = crypto.randomBytes(16);
    buffer.set(randomBytes);
  }
  return Buffer.from(buffer).toString('base64');
}

/**
 * Create a canonical payload for signing
 */
export function createAuthPayload(
  path: string,
  data?: Record<string, any>,
  customTimestamp?: number
): SolanaAuthPayload {
  const payload: SolanaAuthPayload = {
    path,
    ts: customTimestamp || Math.floor(Date.now() / 1000),
    nonce: generateNonce()
  };

  if (data && Object.keys(data).length > 0) {
    payload.data = data;
  }

  return payload;
}

/**
 * Create canonical message string for signing
 * This must match the implementation in SolanaAuthService
 */
export function createSignatureMessage(payload: SolanaAuthPayload): string {
  // Create a deterministic string representation of the payload
  const canonicalPayload = {
    path: payload.path,
    ts: payload.ts,
    nonce: payload.nonce,
    ...(payload.data && Object.keys(payload.data).length > 0 ? { data: payload.data } : {})
  };
  
  return JSON.stringify(canonicalPayload, Object.keys(canonicalPayload).sort());
}

/**
 * Validate payload structure
 */
export function validateAuthPayload(payload: any): payload is SolanaAuthPayload {
  if (typeof payload !== 'object' || payload === null) {
    return false;
  }

  // Check required fields
  if (typeof payload.path !== 'string' || payload.path.length === 0) {
    return false;
  }

  if (typeof payload.ts !== 'number' || payload.ts <= 0) {
    return false;
  }

  if (typeof payload.nonce !== 'string' || payload.nonce.length === 0) {
    return false;
  }

  // Check optional data field
  if (payload.data !== undefined && (typeof payload.data !== 'object' || payload.data === null)) {
    return false;
  }

  return true;
}

/**
 * Check if a payload timestamp is still valid
 */
export function isPayloadTimestampValid(
  timestamp: number,
  maxAge: number = 300 // 5 minutes default
): boolean {
  const now = Math.floor(Date.now() / 1000);
  const age = now - timestamp;
  
  // Allow some clock skew (30 seconds in the future)
  if (age < -30) {
    return false;
  }
  
  return age <= maxAge;
}

/**
 * Create headers object for HTTP requests
 */
export function createAuthHeaders(
  signature: string,
  publicKey: string,
  timestamp: number,
  nonce: string
): Record<string, string> {
  return {
    'x-solana-signature': signature,
    'x-solana-pubkey': publicKey,
    'x-solana-timestamp': timestamp.toString(),
    'x-solana-nonce': nonce,
    'content-type': 'application/json'
  };
}

/**
 * Example usage and documentation
 */
export const SOLANA_AUTH_EXAMPLE = {
  // Example of creating a payload for a GET request
  createGetPayload: (path: string) => createAuthPayload(path),
  
  // Example of creating a payload for a POST request with data
  createPostPayload: (path: string, data: Record<string, any>) => 
    createAuthPayload(path, data),
  
  // Example of the complete flow (pseudo-code)
  exampleFlow: `
    // 1. Create payload
    const payload = createAuthPayload('/api/protected-resource');
    
    // 2. Create message to sign
    const message = createSignatureMessage(payload);
    
    // 3. Sign with wallet (this would be done in the frontend)
    // const signature = await wallet.signMessage(message);
    // const publicKey = wallet.publicKey.toBase58();
    
    // 4. Create headers
    const headers = createAuthHeaders(signature, publicKey, payload.ts, payload.nonce);
    
    // 5. Make request
    // fetch('/api/protected-resource', { headers });
  `
};

/**
 * Validation helpers for common scenarios
 */
export const VALIDATION_HELPERS = {
  /**
   * Validate that a path is allowed for authentication
   */
  isValidPath: (path: string): boolean => {
    if (!path || typeof path !== 'string') return false;
    if (!path.startsWith('/')) return false;
    if (path.length > 500) return false; // Reasonable limit
    return true;
  },

  /**
   * Validate nonce format
   */
  isValidNonce: (nonce: string): boolean => {
    if (!nonce || typeof nonce !== 'string') return false;
    if (nonce.length < 8 || nonce.length > 64) return false;
    // Should be base64-like string
    return /^[A-Za-z0-9+/]+=*$/.test(nonce);
  },

  /**
   * Validate base64 signature format
   */
  isValidSignature: (signature: string): boolean => {
    if (!signature || typeof signature !== 'string') return false;
    try {
      const bytes = Buffer.from(signature, 'base64');
      return bytes.length === 64; // Ed25519 signature length
    } catch {
      return false;
    }
  },

  /**
   * Validate base64 public key format
   */
  isValidPublicKey: (publicKey: string): boolean => {
    if (!publicKey || typeof publicKey !== 'string') return false;
    try {
      const bytes = Buffer.from(publicKey, 'base64');
      return bytes.length === 32; // Ed25519 public key length
    } catch {
      return false;
    }
  }
};