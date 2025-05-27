/**
 * Cryptographic Security Validator
 * 
 * Provides cryptographic validation for hashes, signatures, and data integrity
 * checking to ensure the authenticity and integrity of on-chain data.
 */

import { PublicKey } from '@solana/web3.js';
import {
  ValidationResult,
  ErrorType,
  AuthorityVerificationResult,
  ReputationScore,
  SecurityValidationResult
} from '../types/validation-types';

/**
 * Cryptographic Validator class
 * 
 * Handles cryptographic operations including hash verification,
 * authority validation, and signature checking for registry data.
 */
export class CryptographicValidator {
  
  // Known trusted authorities (can be expanded)
  private trustedAuthorities: Set<string> = new Set([
    // Add known trusted authority public keys here
    // These would be official registry maintainers, verified organizations, etc.
  ]);

  // Blacklisted authorities (known malicious)
  private blacklistedAuthorities: Set<string> = new Set([
    // Add known malicious authority public keys here
  ]);

  // ============================================================================
  // HASH VALIDATION METHODS
  // ============================================================================

  /**
   * Validate SHA-256 hash format and content
   * 
   * @param hash - Hash to validate (as Uint8Array or hex string)
   * @param expectedLength - Expected hash length in bytes (default: 32 for SHA-256)
   * @returns Validation result
   */
  validateHash(hash: Uint8Array | string, expectedLength: number = 32): ValidationResult {
    try {
      let hashBytes: Uint8Array;
      
      // Convert string to Uint8Array if needed
      if (typeof hash === 'string') {
        // Remove 0x prefix if present
        const cleanHash = hash.startsWith('0x') ? hash.slice(2) : hash;
        
        // Validate hex format
        if (!/^[0-9a-fA-F]+$/.test(cleanHash)) {
          return {
            valid: false,
            error: 'Hash contains invalid hexadecimal characters',
            severity: 'HIGH',
            details: { type: ErrorType.CRYPTOGRAPHIC_ERROR }
          };
        }
        
        // Convert hex to bytes
        if (cleanHash.length !== expectedLength * 2) {
          return {
            valid: false,
            error: `Hash length invalid (expected ${expectedLength * 2} hex chars, got ${cleanHash.length})`,
            severity: 'HIGH',
            details: { 
              expected: expectedLength * 2,
              actual: cleanHash.length,
              type: ErrorType.CRYPTOGRAPHIC_ERROR
            }
          };
        }
        
        hashBytes = new Uint8Array(cleanHash.match(/.{2}/g)!.map(byte => parseInt(byte, 16)));
      } else {
        hashBytes = hash;
      }
      
      // Validate byte length
      if (hashBytes.length !== expectedLength) {
        return {
          valid: false,
          error: `Hash byte length invalid (expected ${expectedLength}, got ${hashBytes.length})`,
          severity: 'HIGH',
          details: { 
            expected: expectedLength,
            actual: hashBytes.length,
            type: ErrorType.CRYPTOGRAPHIC_ERROR
          }
        };
      }
      
      // Check for all-zero hash (suspicious)
      if (hashBytes.every(byte => byte === 0)) {
        return {
          valid: false,
          error: 'Hash is all zeros (suspicious)',
          severity: 'MEDIUM',
          details: { type: ErrorType.CRYPTOGRAPHIC_ERROR }
        };
      }
      
      return { valid: true };
      
    } catch (error) {
      return {
        valid: false,
        error: 'Hash validation failed',
        severity: 'HIGH',
        details: { 
          originalError: (error as Error).message,
          type: ErrorType.CRYPTOGRAPHIC_ERROR
        }
      };
    }
  }

  /**
   * Generate SHA-256 hash of content
   * 
   * @param content - Content to hash
   * @returns Promise resolving to hash as Uint8Array
   */
  async generateSHA256Hash(content: string | Uint8Array): Promise<Uint8Array> {
    try {
      const encoder = new TextEncoder();
      const data = typeof content === 'string' ? encoder.encode(content) : content;
      const hashBuffer = await crypto.subtle.digest('SHA-256', data);
      return new Uint8Array(hashBuffer);
    } catch (error) {
      throw new Error(`Failed to generate hash: ${(error as Error).message}`);
    }
  }

  /**
   * Verify content against provided hash
   * 
   * @param content - Original content
   * @param expectedHash - Expected hash
   * @returns Validation result
   */
  async verifyContentHash(
    content: string | Uint8Array,
    expectedHash: Uint8Array | string
  ): Promise<ValidationResult> {
    try {
      // First validate the expected hash format
      const hashValidation = this.validateHash(expectedHash);
      if (!hashValidation.valid) {
        return hashValidation;
      }
      
      // Generate hash of the content
      const actualHash = await this.generateSHA256Hash(content);
      
      // Convert expected hash to Uint8Array if needed
      let expectedHashBytes: Uint8Array;
      if (typeof expectedHash === 'string') {
        const cleanHash = expectedHash.startsWith('0x') ? expectedHash.slice(2) : expectedHash;
        expectedHashBytes = new Uint8Array(cleanHash.match(/.{2}/g)!.map(byte => parseInt(byte, 16)));
      } else {
        expectedHashBytes = expectedHash;
      }
      
      // Compare hashes
      if (actualHash.length !== expectedHashBytes.length) {
        return {
          valid: false,
          error: 'Hash length mismatch',
          severity: 'HIGH',
          details: { type: ErrorType.HASH_MISMATCH }
        };
      }
      
      for (let i = 0; i < actualHash.length; i++) {
        if (actualHash[i] !== expectedHashBytes[i]) {
          return {
            valid: false,
            error: 'Content hash verification failed',
            severity: 'CRITICAL',
            details: { 
              type: ErrorType.HASH_MISMATCH,
              expectedHash: Array.from(expectedHashBytes).map(b => b.toString(16).padStart(2, '0')).join(''),
              actualHash: Array.from(actualHash).map(b => b.toString(16).padStart(2, '0')).join('')
            }
          };
        }
      }
      
      return { valid: true };
      
    } catch (error) {
      return {
        valid: false,
        error: 'Hash verification failed',
        severity: 'HIGH',
        details: { 
          originalError: (error as Error).message,
          type: ErrorType.CRYPTOGRAPHIC_ERROR
        }
      };
    }
  }

  // ============================================================================
  // AUTHORITY VALIDATION METHODS
  // ============================================================================

  /**
   * Verify and assess the trustworthiness of an authority
   * 
   * @param authority - PublicKey or base58 string of the authority
   * @returns Authority verification result
   */
  verifyAuthority(authority: PublicKey | string): AuthorityVerificationResult {
    try {
      // Convert to base58 string for consistent handling
      const authorityString = authority instanceof PublicKey 
        ? authority.toBase58() 
        : authority;
      
      // Validate PublicKey format
      try {
        new PublicKey(authorityString);
      } catch {
        return {
          authority: authorityString,
          isTrusted: false,
          trustLevel: 'UNKNOWN',
          reputation: this.getDefaultReputation(),
          isBlacklisted: false,
          verificationTimestamp: Date.now()
        };
      }

      // Check blacklist first
      const isBlacklisted = this.blacklistedAuthorities.has(authorityString);
      if (isBlacklisted) {
        return {
          authority: authorityString,
          isTrusted: false,
          trustLevel: 'LOW',
          reputation: { ...this.getDefaultReputation(), score: 0, violations: 10 },
          isBlacklisted: true,
          verificationTimestamp: Date.now(),
          metadata: { reason: 'Authority is blacklisted' }
        };
      }

      // Check trusted list
      const isTrusted = this.trustedAuthorities.has(authorityString);
      
      // Get reputation (this would typically come from external data)
      const reputation = this.calculateReputation(authorityString);
      
      // Determine trust level
      let trustLevel: 'HIGH' | 'MEDIUM' | 'LOW' | 'UNKNOWN';
      if (isTrusted) {
        trustLevel = 'HIGH';
      } else if (reputation.score >= 80) {
        trustLevel = 'HIGH';
      } else if (reputation.score >= 60) {
        trustLevel = 'MEDIUM';
      } else if (reputation.score >= 30) {
        trustLevel = 'LOW';
      } else {
        trustLevel = 'UNKNOWN';
      }

      return {
        authority: authorityString,
        isTrusted,
        trustLevel,
        reputation,
        isBlacklisted: false,
        verificationTimestamp: Date.now()
      };
      
    } catch (error) {
      return {
        authority: authority.toString(),
        isTrusted: false,
        trustLevel: 'UNKNOWN',
        reputation: this.getDefaultReputation(),
        isBlacklisted: false,
        verificationTimestamp: Date.now(),
        metadata: { error: (error as Error).message }
      };
    }
  }

  /**
   * Calculate reputation score for an authority
   * In a production system, this would query external reputation databases
   */
  private calculateReputation(authority: string): ReputationScore {
    // This is a placeholder implementation
    // In production, this would:
    // 1. Query on-chain history for this authority
    // 2. Check external reputation services
    // 3. Analyze past registrations and their quality
    // 4. Consider user feedback and reports
    
    return {
      score: 50, // Default neutral score
      registrationCount: 0,
      lastActivity: 0,
      violations: 0
    };
  }

  /**
   * Get default reputation score
   */
  private getDefaultReputation(): ReputationScore {
    return {
      score: 50,
      registrationCount: 0,
      lastActivity: 0,
      violations: 0
    };
  }

  // ============================================================================
  // COMPREHENSIVE SECURITY VALIDATION
  // ============================================================================

  /**
   * Perform comprehensive security validation
   * 
   * @param data - Data to validate
   * @param options - Validation options
   * @returns Comprehensive security validation result
   */
  async performSecurityValidation(
    data: any,
    options: {
      authority?: PublicKey | string;
      expectedHashes?: { [field: string]: string };
      validateContent?: boolean;
      strictMode?: boolean;
    } = {}
  ): Promise<SecurityValidationResult> {
    const validationResults: ValidationResult[] = [];
    let overallValid = true;
    let securityScore = 100;
    const recommendations: string[] = [];

    try {
      // Authority verification
      let authorityVerification: AuthorityVerificationResult;
      if (options.authority) {
        authorityVerification = this.verifyAuthority(options.authority);
        
        if (authorityVerification.isBlacklisted) {
          validationResults.push({
            valid: false,
            error: 'Authority is blacklisted',
            severity: 'CRITICAL'
          });
          overallValid = false;
          securityScore -= 50;
        } else if (authorityVerification.trustLevel === 'LOW') {
          securityScore -= 20;
          recommendations.push('Authority has low trust score - verify authenticity');
        } else if (authorityVerification.trustLevel === 'UNKNOWN') {
          securityScore -= 10;
          recommendations.push('Authority is unverified - proceed with caution');
        }
      } else {
        authorityVerification = {
          authority: 'unknown',
          isTrusted: false,
          trustLevel: 'UNKNOWN',
          reputation: this.getDefaultReputation(),
          isBlacklisted: false,
          verificationTimestamp: Date.now()
        };
        securityScore -= 15;
        recommendations.push('No authority provided for verification');
      }

      // Hash validation
      if (options.expectedHashes) {
        for (const [field, expectedHash] of Object.entries(options.expectedHashes)) {
          const hashValidation = this.validateHash(expectedHash);
          validationResults.push(hashValidation);
          
          if (!hashValidation.valid) {
            overallValid = false;
            securityScore -= 25;
          }
        }
      }

      // Content validation (if enabled)
      if (options.validateContent && data) {
        const contentValidation = this.validateDataStructure(data);
        validationResults.push(contentValidation);
        
        if (!contentValidation.valid) {
          overallValid = false;
          securityScore -= 20;
        }
      }

      // Strict mode additional checks
      if (options.strictMode) {
        const strictValidation = this.performStrictValidation(data);
        validationResults.push(strictValidation);
        
        if (!strictValidation.valid) {
          securityScore -= 15;
        }
      }

      // Determine risk level
      let riskLevel: 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL';
      if (securityScore >= 90) {
        riskLevel = 'LOW';
      } else if (securityScore >= 70) {
        riskLevel = 'MEDIUM';
      } else if (securityScore >= 50) {
        riskLevel = 'HIGH';
      } else {
        riskLevel = 'CRITICAL';
      }

      return {
        overall: overallValid,
        validationResults,
        authorityVerification,
        securityScore: Math.max(0, securityScore),
        timestamp: Date.now(),
        riskLevel,
        recommendations
      };
      
    } catch (error) {
      return {
        overall: false,
        validationResults: [{
          valid: false,
          error: 'Security validation failed',
          severity: 'CRITICAL',
          details: { originalError: (error as Error).message }
        }],
        authorityVerification: {
          authority: 'error',
          isTrusted: false,
          trustLevel: 'UNKNOWN',
          reputation: this.getDefaultReputation(),
          isBlacklisted: false,
          verificationTimestamp: Date.now()
        },
        securityScore: 0,
        timestamp: Date.now(),
        riskLevel: 'CRITICAL',
        recommendations: ['Security validation encountered errors - manual review required']
      };
    }
  }

  /**
   * Validate data structure for security issues
   */
  private validateDataStructure(data: any): ValidationResult {
    try {
      // Check for overly nested structures (potential DOS)
      const maxDepth = 10;
      if (this.getObjectDepth(data) > maxDepth) {
        return {
          valid: false,
          error: 'Data structure too deeply nested',
          severity: 'MEDIUM',
          details: { type: ErrorType.SUSPICIOUS_ACTIVITY }
        };
      }

      // Check for excessively large objects
      const serialized = JSON.stringify(data);
      if (serialized.length > 1024 * 1024) { // 1MB
        return {
          valid: false,
          error: 'Data structure too large',
          severity: 'MEDIUM',
          details: { type: ErrorType.SIZE_LIMIT_EXCEEDED }
        };
      }

      return { valid: true };
      
    } catch (error) {
      return {
        valid: false,
        error: 'Data structure validation failed',
        severity: 'HIGH',
        details: { originalError: (error as Error).message }
      };
    }
  }

  /**
   * Perform strict validation checks
   */
  private performStrictValidation(data: any): ValidationResult {
    try {
      // Check for suspicious patterns in string fields
      const stringFields = this.extractStringFields(data);
      for (const field of stringFields) {
        if (this.containsSuspiciousPatterns(field)) {
          return {
            valid: false,
            error: 'Suspicious patterns detected in data',
            severity: 'HIGH',
            details: { type: ErrorType.MALICIOUS_CONTENT_DETECTED }
          };
        }
      }

      return { valid: true };
      
    } catch (error) {
      return {
        valid: false,
        error: 'Strict validation failed',
        severity: 'MEDIUM',
        details: { originalError: (error as Error).message }
      };
    }
  }

  // ============================================================================
  // UTILITY METHODS
  // ============================================================================

  /**
   * Get object nesting depth
   */
  private getObjectDepth(obj: any, depth: number = 0): number {
    if (obj === null || typeof obj !== 'object') {
      return depth;
    }
    
    if (Array.isArray(obj)) {
      return Math.max(...obj.map(item => this.getObjectDepth(item, depth + 1)));
    }
    
    const depths = Object.values(obj).map(value => this.getObjectDepth(value, depth + 1));
    return depths.length > 0 ? Math.max(...depths) : depth;
  }

  /**
   * Extract all string fields from an object
   */
  private extractStringFields(obj: any): string[] {
    const strings: string[] = [];
    
    const extract = (value: any) => {
      if (typeof value === 'string') {
        strings.push(value);
      } else if (Array.isArray(value)) {
        value.forEach(extract);
      } else if (value && typeof value === 'object') {
        Object.values(value).forEach(extract);
      }
    };
    
    extract(obj);
    return strings;
  }

  /**
   * Check for suspicious patterns in strings
   */
  private containsSuspiciousPatterns(text: string): boolean {
    const suspiciousPatterns = [
      /\b(eval|exec|system|shell_exec|passthru)\s*\(/i,
      /<script|javascript:|vbscript:/i,
      /\$\{.*\}/,  // Template injection
      /\{\{.*\}\}/, // Template injection
      /\b(rm\s+-rf|del\s+\/|format\s+c:)/i,
      /\b(password|secret|token|key)\s*[:=]\s*[^\s]+/i
    ];
    
    return suspiciousPatterns.some(pattern => pattern.test(text));
  }

  /**
   * Add trusted authority
   */
  addTrustedAuthority(authority: string): void {
    this.trustedAuthorities.add(authority);
  }

  /**
   * Add blacklisted authority
   */
  addBlacklistedAuthority(authority: string): void {
    this.blacklistedAuthorities.add(authority);
  }

  /**
   * Check if authority is trusted
   */
  isTrustedAuthority(authority: string): boolean {
    return this.trustedAuthorities.has(authority);
  }

  /**
   * Check if authority is blacklisted
   */
  isBlacklistedAuthority(authority: string): boolean {
    return this.blacklistedAuthorities.has(authority);
  }

  /**
   * Convert Uint8Array to hex string
   */
  uint8ArrayToHex(bytes: Uint8Array): string {
    return Array.from(bytes).map(b => b.toString(16).padStart(2, '0')).join('');
  }

  /**
   * Convert hex string to Uint8Array
   */
  hexToUint8Array(hex: string): Uint8Array {
    const cleanHex = hex.startsWith('0x') ? hex.slice(2) : hex;
    if (cleanHex.length % 2 !== 0) {
      throw new Error('Invalid hex string length');
    }
    return new Uint8Array(cleanHex.match(/.{2}/g)!.map(byte => parseInt(byte, 16)));
  }
}

// Export singleton instance
export const cryptographicValidator = new CryptographicValidator();