/**
 * Content Security Validation Layer
 * 
 * Provides content sanitization and security validation to protect
 * against XSS, injection attacks, and other content-based security threats.
 */

import { ValidationResult, ErrorType } from '../types/validation-types';

/**
 * Content Security Validator class
 * 
 * Handles sanitization and validation of user-generated content,
 * URLs, and metadata to prevent security vulnerabilities.
 */
export class ContentSecurityValidator {
  
  // ============================================================================
  // CONTENT SANITIZATION METHODS
  // ============================================================================

  /**
   * Sanitize and validate user-generated content
   * 
   * @param content - Raw content string
   * @param allowedTags - HTML tags that are allowed (default: none)
   * @returns Sanitized content string
   */
  sanitizeContent(content: string, allowedTags: string[] = []): string {
    if (typeof content !== 'string') return '';
    
    // Remove potentially dangerous content
    let sanitized = content
      // Remove script tags and their content
      .replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, '')
      // Remove javascript: protocol
      .replace(/javascript:/gi, '')
      // Remove event handlers (onclick, onload, etc.)
      .replace(/on\w+\s*=/gi, '')
      // Remove data URLs pointing to HTML
      .replace(/data:text\/html/gi, '')
      // Remove potentially dangerous tags
      .replace(/<(iframe|object|embed|form|meta|link|style)[^>]*>/gi, '')
      // Remove comments that might contain code
      .replace(/<!--[\s\S]*?-->/g, '')
      // Normalize whitespace
      .replace(/\s+/g, ' ')
      .trim();

    // If no tags are allowed, strip all HTML
    if (allowedTags.length === 0) {
      sanitized = sanitized.replace(/<[^>]*>/g, '');
    } else {
      // Only allow specified tags (basic implementation)
      const allowedPattern = allowedTags.join('|');
      const tagRegex = new RegExp(`<(?!\/?(?:${allowedPattern})\\b)[^>]*>`, 'gi');
      sanitized = sanitized.replace(tagRegex, '');
    }

    return sanitized;
  }

  /**
   * Check content for malicious patterns
   */
  containsMaliciousPatterns(content: string): boolean {
    if (typeof content !== 'string') return false;
    
    const maliciousPatterns = [
      // Script injection patterns
      /<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi,
      /javascript:/gi,
      /vbscript:/gi,
      /data:text\/html/gi,
      
      // Event handler patterns
      /on\w+\s*=/gi,
      
      // Dangerous tags
      /<(iframe|object|embed|applet|meta|link|style|base|form|input|textarea|button|select|option|frame|frameset)/gi,
      
      // Code execution patterns
      /eval\s*\(/gi,
      /Function\s*\(/gi,
      /setTimeout\s*\(/gi,
      /setInterval\s*\(/gi,
      
      // Data exfiltration patterns
      /document\s*\.\s*(cookie|domain|referrer)/gi,
      /window\s*\.\s*(location|open|eval)/gi,
      /localStorage/gi,
      /sessionStorage/gi,
      
      // Protocol handlers
      /chrome-extension:/gi,
      /moz-extension:/gi,
      /ms-browser-extension:/gi,
    ];
    
    return maliciousPatterns.some(pattern => pattern.test(content));
  }

  // ============================================================================
  // URL VALIDATION METHODS
  // ============================================================================

  /**
   * Validate URLs for security
   * 
   * @param url - URL string to validate
   * @param allowedProtocols - List of allowed protocols
   * @returns Validation result
   */
  validateURL(url: string, allowedProtocols: string[] = ['https', 'http']): ValidationResult {
    try {
      if (typeof url !== 'string' || url.trim().length === 0) {
        return {
          valid: false,
          error: 'URL cannot be empty',
          severity: 'MEDIUM'
        };
      }

      const parsedUrl = new URL(url);
      
      // Protocol validation
      const protocol = parsedUrl.protocol.slice(0, -1); // Remove trailing ':'
      if (!allowedProtocols.includes(protocol)) {
        return {
          valid: false,
          error: 'Disallowed URL protocol',
          severity: 'HIGH',
          details: { 
            protocol, 
            allowed: allowedProtocols,
            type: ErrorType.INVALID_URL
          }
        };
      }

      // Check for suspicious URL patterns
      const suspiciousPatterns = this.getSuspiciousUrlPatterns();
      for (const pattern of suspiciousPatterns) {
        if (pattern.regex.test(url)) {
          return {
            valid: false,
            error: pattern.message,
            severity: pattern.severity,
            details: { type: ErrorType.INVALID_URL, pattern: pattern.name }
          };
        }
      }

      // Localhost/private IP blocking for production
      if (process.env.NODE_ENV === 'production') {
        const hostname = parsedUrl.hostname;
        if (this.isPrivateOrLocalhost(hostname)) {
          return {
            valid: false,
            error: 'Private or localhost URLs not allowed in production',
            severity: 'MEDIUM',
            details: { hostname, type: ErrorType.INVALID_URL }
          };
        }
      }

      // Check URL length
      if (url.length > 2048) {
        return {
          valid: false,
          error: 'URL too long (max 2048 characters)',
          severity: 'MEDIUM',
          details: { length: url.length, type: ErrorType.INVALID_URL }
        };
      }

      return { valid: true };
      
    } catch (error) {
      return {
        valid: false,
        error: 'Invalid URL format',
        severity: 'MEDIUM',
        details: { 
          originalError: (error as Error).message,
          type: ErrorType.INVALID_URL 
        }
      };
    }
  }

  /**
   * Get suspicious URL patterns
   */
  private getSuspiciousUrlPatterns() {
    return [
      {
        name: 'url_shorteners',
        regex: /(?:bit\.ly|tinyurl|t\.co|goo\.gl|short\.link|ow\.ly|is\.gd|buff\.ly)/i,
        message: 'URL shorteners are not allowed',
        severity: 'MEDIUM' as const
      },
      {
        name: 'suspicious_tlds',
        regex: /\.(?:tk|ml|ga|cf|click|download|zip|rar)$/i,
        message: 'Suspicious top-level domain detected',
        severity: 'MEDIUM' as const
      },
      {
        name: 'ip_addresses',
        regex: /^https?:\/\/(?:[0-9]{1,3}\.){3}[0-9]{1,3}/,
        message: 'Raw IP addresses are not allowed',
        severity: 'MEDIUM' as const
      },
      {
        name: 'excessive_subdomains',
        regex: /^https?:\/\/(?:[a-zA-Z0-9-]+\.){5,}/,
        message: 'Excessive subdomain nesting detected',
        severity: 'LOW' as const
      },
      {
        name: 'suspicious_ports',
        regex: /:[0-9]+\/.*(?:admin|login|config|setup|install|backup)/i,
        message: 'Suspicious port and path combination',
        severity: 'HIGH' as const
      }
    ];
  }

  /**
   * Check if hostname is private or localhost
   */
  private isPrivateOrLocalhost(hostname: string): boolean {
    const privateRanges = [
      /^localhost$/i,
      /^127\./,
      /^10\./,
      /^192\.168\./,
      /^172\.(1[6-9]|2[0-9]|3[0-1])\./,
      /^169\.254\./, // Link-local
      /^::1$/, // IPv6 localhost
      /^fc00::/i, // IPv6 private
      /^fe80::/i  // IPv6 link-local
    ];
    
    return privateRanges.some(range => range.test(hostname));
  }

  // ============================================================================
  // METADATA VALIDATION METHODS
  // ============================================================================

  /**
   * Validate and fetch metadata from URI
   * 
   * @param uri - Metadata URI to validate
   * @param options - Validation options
   * @returns Validation result with metadata info
   */
  async validateMetadataURI(
    uri: string,
    options: {
      maxSize?: number;
      timeout?: number;
      allowedContentTypes?: string[];
    } = {}
  ): Promise<ValidationResult> {
    const {
      maxSize = 1024 * 1024, // 1MB default
      timeout = 5000, // 5 seconds
      allowedContentTypes = ['application/json', 'text/plain']
    } = options;

    // First validate the URL itself
    const urlValidation = this.validateURL(uri, ['https']);
    if (!urlValidation.valid) {
      return urlValidation;
    }

    try {
      // Create abort controller for timeout
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), timeout);

      try {
        // Fetch with HEAD request first to check headers
        const response = await fetch(uri, {
          method: 'HEAD',
          signal: controller.signal,
          headers: {
            'User-Agent': 'AEAMCP-Registry-Validator/1.0'
          }
        });

        clearTimeout(timeoutId);

        if (!response.ok) {
          return {
            valid: false,
            error: `Metadata URI returned ${response.status}: ${response.statusText}`,
            severity: 'MEDIUM',
            details: { 
              status: response.status, 
              statusText: response.statusText,
              type: ErrorType.INVALID_URL
            }
          };
        }

        // Check content type
        const contentType = response.headers.get('content-type');
        if (contentType) {
          const isAllowedType = allowedContentTypes.some(type => 
            contentType.toLowerCase().includes(type.toLowerCase())
          );
          
          if (!isAllowedType) {
            return {
              valid: false,
              error: 'Invalid metadata content type',
              severity: 'MEDIUM',
              details: { 
                contentType, 
                allowed: allowedContentTypes,
                type: ErrorType.INVALID_URL
              }
            };
          }
        }

        // Check content length
        const contentLength = response.headers.get('content-length');
        if (contentLength) {
          const size = parseInt(contentLength, 10);
          if (size > maxSize) {
            return {
              valid: false,
              error: `Metadata file too large (${size} bytes, max ${maxSize})`,
              severity: 'MEDIUM',
              details: { 
                size, 
                maxSize,
                type: ErrorType.SIZE_LIMIT_EXCEEDED
              }
            };
          }
        }

        return { 
          valid: true,
          details: {
            contentType,
            contentLength: contentLength ? parseInt(contentLength, 10) : undefined,
            status: response.status
          }
        };

      } catch (fetchError) {
        clearTimeout(timeoutId);
        
        if (fetchError instanceof Error && fetchError.name === 'AbortError') {
          return {
            valid: false,
            error: 'Metadata URI request timed out',
            severity: 'MEDIUM',
            details: { timeout, type: ErrorType.NETWORK_ERROR }
          };
        }
        
        throw fetchError;
      }
      
    } catch (error) {
      return {
        valid: false,
        error: 'Failed to validate metadata URI',
        severity: 'LOW',
        details: { 
          originalError: (error as Error).message,
          type: ErrorType.NETWORK_ERROR
        }
      };
    }
  }

  // ============================================================================
  // FILE VALIDATION METHODS
  // ============================================================================

  /**
   * Validate file content for safety
   */
  validateFileContent(content: string, fileType: 'json' | 'text' | 'markdown'): ValidationResult {
    try {
      // Check for malicious patterns
      if (this.containsMaliciousPatterns(content)) {
        return {
          valid: false,
          error: 'File content contains potentially malicious patterns',
          severity: 'HIGH',
          details: { type: ErrorType.MALICIOUS_CONTENT_DETECTED }
        };
      }

      // Size check
      if (content.length > 10 * 1024 * 1024) { // 10MB
        return {
          valid: false,
          error: 'File content too large',
          severity: 'MEDIUM',
          details: { type: ErrorType.SIZE_LIMIT_EXCEEDED }
        };
      }

      // Type-specific validation
      switch (fileType) {
        case 'json':
          try {
            JSON.parse(content);
          } catch {
            return {
              valid: false,
              error: 'Invalid JSON format',
              severity: 'MEDIUM',
              details: { type: ErrorType.VALIDATION_ERROR }
            };
          }
          break;
          
        case 'text':
        case 'markdown':
          // Basic text validation - check for binary content
          if (content.includes('\0')) {
            return {
              valid: false,
              error: 'File appears to contain binary data',
              severity: 'MEDIUM',
              details: { type: ErrorType.VALIDATION_ERROR }
            };
          }
          break;
      }

      return { valid: true };
      
    } catch (error) {
      return {
        valid: false,
        error: 'File validation failed',
        severity: 'MEDIUM',
        details: { 
          originalError: (error as Error).message,
          type: ErrorType.VALIDATION_ERROR
        }
      };
    }
  }

  // ============================================================================
  // UTILITY METHODS
  // ============================================================================

  /**
   * Escape HTML entities
   */
  escapeHtml(text: string): string {
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
  }

  /**
   * Generate content hash for integrity checking
   */
  async generateContentHash(content: string): Promise<string> {
    const encoder = new TextEncoder();
    const data = encoder.encode(content);
    const hashBuffer = await crypto.subtle.digest('SHA-256', data);
    const hashArray = Array.from(new Uint8Array(hashBuffer));
    return hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
  }

  /**
   * Validate content against hash
   */
  async validateContentHash(content: string, expectedHash: string): Promise<ValidationResult> {
    try {
      const actualHash = await this.generateContentHash(content);
      
      if (actualHash !== expectedHash.toLowerCase()) {
        return {
          valid: false,
          error: 'Content hash mismatch',
          severity: 'HIGH',
          details: { 
            expected: expectedHash,
            actual: actualHash,
            type: ErrorType.HASH_MISMATCH
          }
        };
      }
      
      return { valid: true };
      
    } catch (error) {
      return {
        valid: false,
        error: 'Hash validation failed',
        severity: 'MEDIUM',
        details: { 
          originalError: (error as Error).message,
          type: ErrorType.CRYPTOGRAPHIC_ERROR
        }
      };
    }
  }

  /**
   * Get content security policy headers
   */
  getCSPHeaders(): Record<string, string> {
    return {
      'Content-Security-Policy': [
        "default-src 'self'",
        "script-src 'self' 'unsafe-inline'", // Needed for Next.js
        "style-src 'self' 'unsafe-inline'",
        "img-src 'self' data: https:",
        "connect-src 'self' https:",
        "font-src 'self' data:",
        "object-src 'none'",
        "media-src 'self'",
        "frame-src 'none'",
        "base-uri 'self'",
        "form-action 'self'"
      ].join('; '),
      'X-Content-Type-Options': 'nosniff',
      'X-Frame-Options': 'DENY',
      'X-XSS-Protection': '1; mode=block',
      'Referrer-Policy': 'strict-origin-when-cross-origin'
    };
  }
}

// Export singleton instance
export const contentSecurityValidator = new ContentSecurityValidator();