import { Request, Response, NextFunction } from 'express';
import { 
  SolanaAuthPayload,
  SolanaAuthHeaders,
  SolanaAuthContext,
  SolanaAuthError,
  SolanaAuthErrorType
} from '../types/solana-auth.types';
import { SolanaAuthService } from '../services/solana-auth.service';
import { Logger } from '../utils/logger';

/**
 * Middleware factory for Solana wallet signature-based authentication
 */
export function createSolanaAuthMiddleware(authService: SolanaAuthService) {
  const logger = Logger.getInstance();

  return async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      // Extract signature headers
      const signature = req.headers['x-solana-signature'] as string;
      const publicKey = req.headers['x-solana-pubkey'] as string;
      const timestamp = req.headers['x-solana-timestamp'] as string;
      const nonce = req.headers['x-solana-nonce'] as string;

      // Check if all required headers are present
      if (!signature || !publicKey || !timestamp || !nonce) {
        logger.warn('Missing Solana authentication headers', {
          path: req.path,
          ip: req.ip,
          headers: {
            hasSignature: !!signature,
            hasPublicKey: !!publicKey,
            hasTimestamp: !!timestamp,
            hasNonce: !!nonce
          }
        });

        return res.status(401).json({
          error: 'Missing required Solana authentication headers',
          code: SolanaAuthErrorType.MISSING_HEADERS,
          required: ['x-solana-signature', 'x-solana-pubkey', 'x-solana-timestamp', 'x-solana-nonce']
        });
      }

      // Parse timestamp
      const timestampNum = parseInt(timestamp, 10);
      if (isNaN(timestampNum)) {
        return res.status(400).json({
          error: 'Invalid timestamp format',
          code: SolanaAuthErrorType.INVALID_PAYLOAD
        });
      }

      // Create payload from request
      const payload: SolanaAuthPayload = {
        path: req.path,
        ts: timestampNum,
        nonce,
        // Include request body if present for POST/PUT requests
        ...(req.body && Object.keys(req.body).length > 0 ? { data: req.body } : {})
      };

      // Verify authentication
      const authResult = await authService.verifyAuthPayload(payload, signature, publicKey);

      if (!authResult.isValid || !authResult.publicKey || !authResult.accessResult) {
        logger.warn('Solana authentication failed', {
          path: req.path,
          ip: req.ip,
          publicKey: publicKey.substring(0, 16) + '...',
          error: authResult.error
        });

        return res.status(403).json({
          error: authResult.error || 'Authentication failed',
          code: SolanaAuthErrorType.ACCESS_DENIED
        });
      }

      // Add authentication context to request
      req.solanaAuth = {
        walletPublicKey: authResult.publicKey,
        walletAddress: authResult.publicKey.toBase58(),
        payload,
        accessResult: authResult.accessResult,
        verifiedAt: Math.floor(Date.now() / 1000)
      };

      logger.info('Solana authentication successful', {
        path: req.path,
        wallet: authResult.publicKey.toBase58(),
        resource: payload.path,
        ip: req.ip
      });

      next();

    } catch (error) {
      logger.error('Solana authentication middleware error', {
        path: req.path,
        ip: req.ip,
        error: error instanceof Error ? error.message : 'Unknown error'
      });

      if (error instanceof SolanaAuthError) {
        return res.status(403).json({
          error: error.message,
          code: error.type,
          details: error.details
        });
      }

      return res.status(500).json({
        error: 'Internal authentication error',
        code: SolanaAuthErrorType.NETWORK_ERROR
      });
    }
  };
}

/**
 * Optional middleware to require Solana authentication
 * Use this to protect specific routes that must have wallet-based auth
 */
export function requireSolanaAuth(req: Request, res: Response, next: NextFunction): void {
  if (!req.solanaAuth) {
    return res.status(401).json({
      error: 'Solana wallet authentication required',
      code: SolanaAuthErrorType.MISSING_HEADERS
    });
  }
  next();
}

/**
 * Middleware to make Solana authentication optional
 * Use this for routes that can work with or without wallet auth
 */
export function optionalSolanaAuth(authService: SolanaAuthService) {
  const solanaAuthMiddleware = createSolanaAuthMiddleware(authService);
  
  return (req: Request, res: Response, next: NextFunction): void => {
    // Check if Solana auth headers are present
    const hasAuthHeaders = req.headers['x-solana-signature'] && 
                          req.headers['x-solana-pubkey'] && 
                          req.headers['x-solana-timestamp'] && 
                          req.headers['x-solana-nonce'];

    if (hasAuthHeaders) {
      // Apply Solana auth middleware
      solanaAuthMiddleware(req, res, next);
    } else {
      // Continue without Solana auth
      next();
    }
  };
}

/**
 * Utility function to check if request has valid Solana authentication
 */
export function hasValidSolanaAuth(req: Request): boolean {
  return !!(req.solanaAuth && req.solanaAuth.accessResult.hasAccess);
}

/**
 * Utility function to get wallet address from request
 */
export function getWalletAddress(req: Request): string | null {
  return req.solanaAuth?.walletAddress || null;
}

/**
 * Rate limiting middleware specifically for Solana signature endpoints
 */
export function createSolanaRateLimit() {
  // This would integrate with the existing rate limiter
  // For now, return a simple implementation
  return (req: Request, res: Response, next: NextFunction): void => {
    // TODO: Implement more sophisticated rate limiting based on wallet address
    // For now, rely on the existing IP-based rate limiting
    next();
  };
}