import { Connection, PublicKey } from '@solana/web3.js';
import * as nacl from 'tweetnacl';
import { Buffer } from 'buffer';
import { 
  SolanaAuthPayload,
  SolanaSignatureVerificationResult,
  OnChainAccessResult,
  SolanaAuthConfig,
  SolanaAuthError,
  SolanaAuthErrorType
} from '../types/solana-auth.types';
import { CacheService } from './cache.service';
import { Logger } from '../utils/logger';

/**
 * Service for Solana wallet signature verification and on-chain access control
 */
export class SolanaAuthService {
  private connection: Connection;
  private logger = Logger.getInstance();
  private registryProgramId: PublicKey;
  private config: Required<SolanaAuthConfig>;

  constructor(config: SolanaAuthConfig, private cache: CacheService) {
    this.config = {
      maxSignatureAge: 300, // 5 minutes
      accessCacheTtl: 60, // 1 minute
      enableSignatureVerification: true,
      ...config
    };
    
    this.connection = new Connection(this.config.rpcEndpoint, 'confirmed');
    this.registryProgramId = new PublicKey(this.config.registryProgramId);
  }

  /**
   * Create canonical message for signing
   */
  createSignatureMessage(payload: SolanaAuthPayload): string {
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
   * Verify a Solana wallet signature
   */
  async verifySignature(
    message: string,
    signature: string,
    publicKeyString: string
  ): Promise<SolanaSignatureVerificationResult> {
    try {
      if (!this.config.enableSignatureVerification) {
        this.logger.warn('Signature verification disabled - allowing all signatures');
        return {
          isValid: true,
          publicKey: new PublicKey(publicKeyString)
        };
      }

      // Decode base64 signature and public key
      const signatureBytes = Buffer.from(signature, 'base64');
      const publicKeyBytes = Buffer.from(publicKeyString, 'base64');
      
      if (signatureBytes.length !== 64) {
        return {
          isValid: false,
          publicKey: null,
          error: 'Invalid signature length'
        };
      }

      if (publicKeyBytes.length !== 32) {
        return {
          isValid: false,
          publicKey: null,
          error: 'Invalid public key length'
        };
      }

      // Create message buffer
      const messageBytes = Buffer.from(message, 'utf8');
      
      // Verify signature using nacl
      const isValid = nacl.sign.detached.verify(
        messageBytes,
        signatureBytes,
        publicKeyBytes
      );

      if (!isValid) {
        return {
          isValid: false,
          publicKey: null,
          error: 'Signature verification failed'
        };
      }

      // Create PublicKey object
      const publicKey = new PublicKey(publicKeyBytes);
      
      return {
        isValid: true,
        publicKey
      };
      
    } catch (error) {
      this.logger.error('Signature verification error:', error);
      return {
        isValid: false,
        publicKey: null,
        error: error instanceof Error ? error.message : 'Unknown verification error'
      };
    }
  }

  /**
   * Check if a timestamp is within the allowed age
   */
  isTimestampValid(timestamp: number): boolean {
    const now = Math.floor(Date.now() / 1000);
    const age = now - timestamp;
    
    // Allow some clock skew (30 seconds in the future)
    if (age < -30) {
      return false;
    }
    
    return age <= this.config.maxSignatureAge;
  }

  /**
   * Check if nonce has been used (replay attack protection)
   */
  async isNonceUsed(nonce: string, publicKey: PublicKey): Promise<boolean> {
    const cacheKey = `nonce:${publicKey.toBase58()}:${nonce}`;
    const exists = await this.cache.get(cacheKey);
    return exists !== null;
  }

  /**
   * Mark nonce as used
   */
  async markNonceUsed(nonce: string, publicKey: PublicKey): Promise<void> {
    const cacheKey = `nonce:${publicKey.toBase58()}:${nonce}`;
    // Store nonce with TTL slightly longer than max signature age
    await this.cache.set(cacheKey, 'used', this.config.maxSignatureAge + 60);
  }

  /**
   * Check on-chain access permissions for a wallet and resource
   */
  async checkOnChainAccess(
    walletPublicKey: PublicKey,
    resource: string
  ): Promise<OnChainAccessResult> {
    const cacheKey = `access:${walletPublicKey.toBase58()}:${resource}`;
    
    try {
      // Check cache first
      const cachedResult = await this.cache.get(cacheKey);
      if (cachedResult) {
        const parsed = JSON.parse(cachedResult);
        this.logger.debug('Using cached access result', { walletPublicKey: walletPublicKey.toBase58(), resource });
        return parsed;
      }

      // Derive PDA for access control entry
      // This follows the pattern from the existing registry programs
      const [accessPda] = PublicKey.findProgramAddressSync(
        [
          Buffer.from('access_control_v1'),
          walletPublicKey.toBuffer(),
          Buffer.from(resource)
        ],
        this.registryProgramId
      );

      // Check if the PDA account exists
      const accountInfo = await this.connection.getAccountInfo(accessPda);
      
      const result: OnChainAccessResult = {
        hasAccess: accountInfo !== null,
        walletAddress: walletPublicKey.toBase58(),
        resource,
        checkedAt: Math.floor(Date.now() / 1000),
        metadata: accountInfo ? {
          accessType: 'registered', // Could be parsed from account data
          onChainData: {
            owner: accountInfo.owner.toBase58(),
            lamports: accountInfo.lamports,
            dataLength: accountInfo.data.length
          }
        } : undefined
      };

      // Cache the result
      await this.cache.set(cacheKey, JSON.stringify(result), this.config.accessCacheTtl);
      
      this.logger.info('On-chain access check completed', {
        wallet: walletPublicKey.toBase58(),
        resource,
        hasAccess: result.hasAccess,
        pda: accessPda.toBase58()
      });

      return result;
      
    } catch (error) {
      this.logger.error('On-chain access check failed', {
        wallet: walletPublicKey.toBase58(),
        resource,
        error: error instanceof Error ? error.message : 'Unknown error'
      });
      
      throw new SolanaAuthError(
        SolanaAuthErrorType.ONCHAIN_CHECK_FAILED,
        'Failed to check on-chain access permissions',
        { wallet: walletPublicKey.toBase58(), resource, error }
      );
    }
  }

  /**
   * Verify complete authentication payload
   */
  async verifyAuthPayload(
    payload: SolanaAuthPayload,
    signature: string,
    publicKeyString: string
  ): Promise<{
    isValid: boolean;
    publicKey: PublicKey | null;
    accessResult?: OnChainAccessResult;
    error?: string;
  }> {
    try {
      // 1. Validate timestamp
      if (!this.isTimestampValid(payload.ts)) {
        throw new SolanaAuthError(
          SolanaAuthErrorType.SIGNATURE_EXPIRED,
          'Signature timestamp is too old or too far in the future'
        );
      }

      // 2. Create canonical message
      const message = this.createSignatureMessage(payload);

      // 3. Verify signature
      const verificationResult = await this.verifySignature(message, signature, publicKeyString);
      if (!verificationResult.isValid || !verificationResult.publicKey) {
        throw new SolanaAuthError(
          SolanaAuthErrorType.INVALID_SIGNATURE,
          verificationResult.error || 'Signature verification failed'
        );
      }

      // 4. Check for replay attacks
      const nonceUsed = await this.isNonceUsed(payload.nonce, verificationResult.publicKey);
      if (nonceUsed) {
        throw new SolanaAuthError(
          SolanaAuthErrorType.REPLAY_ATTACK,
          'Nonce has already been used'
        );
      }

      // 5. Mark nonce as used
      await this.markNonceUsed(payload.nonce, verificationResult.publicKey);

      // 6. Check on-chain access
      const accessResult = await this.checkOnChainAccess(verificationResult.publicKey, payload.path);
      if (!accessResult.hasAccess) {
        throw new SolanaAuthError(
          SolanaAuthErrorType.ACCESS_DENIED,
          'Wallet does not have access to this resource'
        );
      }

      return {
        isValid: true,
        publicKey: verificationResult.publicKey,
        accessResult
      };

    } catch (error) {
      if (error instanceof SolanaAuthError) {
        return {
          isValid: false,
          publicKey: null,
          error: error.message
        };
      }
      
      this.logger.error('Authentication verification failed', error);
      return {
        isValid: false,
        publicKey: null,
        error: 'Authentication verification failed'
      };
    }
  }

  /**
   * Get connection for direct RPC access
   */
  getConnection(): Connection {
    return this.connection;
  }
}