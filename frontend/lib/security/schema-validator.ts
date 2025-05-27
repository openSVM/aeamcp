/**
 * Schema Validation Layer
 * 
 * Provides comprehensive validation of on-chain data using Zod schemas
 * to ensure data integrity and prevent malicious content from being
 * processed by the application.
 */

import { z } from 'zod';
import { PublicKey } from '@solana/web3.js';
import { ValidationResult, ErrorType } from '../types/validation-types';

/**
 * Custom Zod validators for blockchain-specific types
 */
const zodValidators = {
  /**
   * Validate Solana PublicKey
   */
  publicKey: () => z.custom<PublicKey>((val) => {
    try {
      if (val instanceof PublicKey) return true;
      if (typeof val === 'string') {
        new PublicKey(val);
        return true;
      }
      return false;
    } catch {
      return false;
    }
  }, 'Invalid Solana PublicKey'),

  /**
   * Validate hash arrays (32 bytes)
   */
  hash32: () => z.instanceof(Uint8Array).refine(
    (val) => val.length === 32,
    'Hash must be exactly 32 bytes'
  ),

  /**
   * Validate version strings (semantic versioning)
   */
  semanticVersion: () => z.string().regex(
    /^\d+\.\d+\.\d+(-[a-zA-Z0-9-]+)?(\+[a-zA-Z0-9-]+)?$/,
    'Invalid semantic version format'
  ),

  /**
   * Validate URLs with security checks
   */
  secureUrl: (allowedProtocols: string[] = ['https', 'http']) => z.string().url().refine(
    (url) => {
      try {
        const parsed = new URL(url);
        return allowedProtocols.includes(parsed.protocol.slice(0, -1));
      } catch {
        return false;
      }
    },
    `URL must use one of: ${allowedProtocols.join(', ')}`
  ),

  /**
   * Validate content for malicious patterns
   */
  safeContent: (maxLength: number = 1024) => z.string()
    .max(maxLength, `Content too long (max ${maxLength} characters)`)
    .refine(
      (content) => !containsMaliciousPatterns(content),
      'Content contains potentially malicious patterns'
    ),

  /**
   * Validate tags array
   */
  tagsArray: (maxTags: number = 20, maxTagLength: number = 32) => z.array(
    z.string()
      .min(1, 'Tag cannot be empty')
      .max(maxTagLength, `Tag too long (max ${maxTagLength} characters)`)
      .regex(/^[a-zA-Z0-9_-]+$/, 'Tag contains invalid characters')
  ).max(maxTags, `Too many tags (max ${maxTags})`),

  /**
   * Validate bigint within reasonable bounds
   */
  safeBigInt: (max: bigint = BigInt('0xFFFFFFFFFFFFFFFF')) => z.bigint()
    .min(BigInt(0), 'Value cannot be negative')
    .max(max, 'Value too large'),

  /**
   * Validate timestamp
   */
  timestamp: () => z.bigint().refine(
    (ts) => {
      const now = BigInt(Math.floor(Date.now() / 1000));
      const maxFuture = now + BigInt(300); // 5 minutes in future tolerance
      const minPast = BigInt(1600000000); // September 2020 (reasonable minimum)
      return ts >= minPast && ts <= maxFuture;
    },
    'Timestamp is outside reasonable range'
  )
};

/**
 * Check for malicious patterns in content
 */
function containsMaliciousPatterns(content: string): boolean {
  const maliciousPatterns = [
    /<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi,
    /javascript:/gi,
    /on\w+\s*=/gi,
    /data:text\/html/gi,
    /<iframe/gi,
    /<object/gi,
    /<embed/gi,
    /<form/gi,
    /eval\s*\(/gi,
    /document\./gi,
    /window\./gi
  ];
  
  return maliciousPatterns.some(pattern => pattern.test(content));
}

/**
 * Comprehensive validation schemas for registry data
 */
export const ValidationSchemas = {
  
  /**
   * Agent Registry Entry Validation Schema
   */
  AgentRegistryEntry: z.object({
    bump: z.number().min(0).max(255),
    registryVersion: z.number().min(1).max(255),
    ownerAuthority: zodValidators.publicKey(),
    agentId: z.string()
      .min(1, 'Agent ID cannot be empty')
      .max(64, 'Agent ID too long')
      .regex(/^[a-zA-Z0-9_-]+$/, 'Agent ID contains invalid characters'),
    name: zodValidators.safeContent(128),
    description: zodValidators.safeContent(1024),
    agentVersion: zodValidators.semanticVersion(),
    providerName: zodValidators.safeContent(128).optional(),
    providerUrl: zodValidators.secureUrl(['https']).optional(),
    documentationUrl: zodValidators.secureUrl(['https', 'http']).optional(),
    serviceEndpoints: z.array(z.object({
      protocol: z.string().max(32),
      url: zodValidators.secureUrl(['https', 'http', 'wss', 'ws']),
      isDefault: z.boolean()
    })).max(10, 'Too many service endpoints'),
    capabilitiesFlags: zodValidators.safeBigInt(),
    supportedInputModes: z.array(z.string().max(64)).max(20),
    supportedOutputModes: z.array(z.string().max(64)).max(20),
    skills: z.array(z.object({
      id: z.string().max(64),
      name: zodValidators.safeContent(128),
      descriptionHash: zodValidators.hash32().optional(),
      tags: zodValidators.tagsArray(10, 32)
    })).max(50, 'Too many skills'),
    securityInfoUri: zodValidators.secureUrl(['https']).optional(),
    aeaAddress: z.string().max(256).optional(),
    economicIntentSummary: zodValidators.safeContent(512).optional(),
    supportedAeaProtocolsHash: zodValidators.hash32().optional(),
    status: z.number().min(0).max(255),
    registrationTimestamp: zodValidators.timestamp(),
    lastUpdateTimestamp: zodValidators.timestamp(),
    extendedMetadataUri: zodValidators.secureUrl(['https']).optional(),
    tags: zodValidators.tagsArray(20, 32)
  }).refine(
    (data) => data.lastUpdateTimestamp >= data.registrationTimestamp,
    {
      message: 'Last update timestamp cannot be before registration timestamp',
      path: ['lastUpdateTimestamp']
    }
  ).refine(
    (data) => {
      const defaultEndpoints = data.serviceEndpoints.filter(ep => ep.isDefault);
      return defaultEndpoints.length <= 1;
    },
    {
      message: 'Only one default service endpoint allowed',
      path: ['serviceEndpoints']
    }
  ),

  /**
   * MCP Server Registry Entry Validation Schema
   */
  McpServerRegistryEntry: z.object({
    bump: z.number().min(0).max(255),
    registryVersion: z.number().min(1).max(255),
    ownerAuthority: zodValidators.publicKey(),
    serverId: z.string()
      .min(1, 'Server ID cannot be empty')
      .max(64, 'Server ID too long')
      .regex(/^[a-zA-Z0-9_-]+$/, 'Server ID contains invalid characters'),
    name: zodValidators.safeContent(128),
    serverVersion: zodValidators.semanticVersion(),
    serviceEndpoint: zodValidators.secureUrl(['https', 'http']),
    documentationUrl: zodValidators.secureUrl(['https', 'http']).optional(),
    serverCapabilitiesSummary: zodValidators.safeContent(512).optional(),
    supportsResources: z.boolean(),
    supportsTools: z.boolean(),
    supportsPrompts: z.boolean(),
    onchainToolDefinitions: z.array(z.object({
      name: z.string().max(64),
      descriptionHash: zodValidators.hash32(),
      inputSchemaHash: zodValidators.hash32(),
      outputSchemaHash: zodValidators.hash32(),
      tags: zodValidators.tagsArray(10, 32)
    })).max(100),
    onchainResourceDefinitions: z.array(z.object({
      uriPattern: z.string().max(256),
      descriptionHash: zodValidators.hash32(),
      tags: zodValidators.tagsArray(10, 32)
    })).max(100),
    onchainPromptDefinitions: z.array(z.object({
      name: z.string().max(64),
      descriptionHash: zodValidators.hash32(),
      tags: zodValidators.tagsArray(10, 32)
    })).max(100),
    status: z.number().min(0).max(255),
    registrationTimestamp: zodValidators.timestamp(),
    lastUpdateTimestamp: zodValidators.timestamp(),
    fullCapabilitiesUri: zodValidators.secureUrl(['https']).optional(),
    tags: zodValidators.tagsArray(20, 32)
  }).refine(
    (data) => data.lastUpdateTimestamp >= data.registrationTimestamp,
    {
      message: 'Last update timestamp cannot be before registration timestamp',
      path: ['lastUpdateTimestamp']
    }
  ).refine(
    (data) => {
      // At least one capability must be supported
      return data.supportsResources || data.supportsTools || data.supportsPrompts;
    },
    {
      message: 'Server must support at least one capability (resources, tools, or prompts)',
      path: ['supportsResources']
    }
  ).refine(
    (data) => {
      // If supports tools but no tool definitions, that's suspicious
      if (data.supportsTools && data.onchainToolDefinitions.length === 0) {
        return false;
      }
      return true;
    },
    {
      message: 'Server claims to support tools but provides no tool definitions',
      path: ['onchainToolDefinitions']
    }
  ),

  /**
   * Agent Registration Input Validation Schema
   */
  AgentRegistrationInput: z.object({
    agentId: z.string()
      .min(1, 'Agent ID cannot be empty')
      .max(64, 'Agent ID too long')
      .regex(/^[a-zA-Z0-9_-]+$/, 'Agent ID contains invalid characters'),
    name: zodValidators.safeContent(128),
    description: zodValidators.safeContent(1024),
    agentVersion: zodValidators.semanticVersion(),
    providerName: zodValidators.safeContent(128).optional(),
    providerUrl: zodValidators.secureUrl(['https']).optional(),
    documentationUrl: zodValidators.secureUrl(['https', 'http']).optional(),
    serviceEndpoints: z.array(z.object({
      protocol: z.string().max(32),
      url: zodValidators.secureUrl(['https', 'http', 'wss', 'ws']),
      isDefault: z.boolean()
    })).min(1, 'At least one service endpoint required').max(10),
    capabilitiesFlags: zodValidators.safeBigInt(),
    supportedInputModes: z.array(z.string().max(64)).max(20),
    supportedOutputModes: z.array(z.string().max(64)).max(20),
    skills: z.array(z.object({
      id: z.string().max(64),
      name: zodValidators.safeContent(128),
      descriptionHash: zodValidators.hash32().optional(),
      tags: zodValidators.tagsArray(10, 32)
    })).max(50),
    securityInfoUri: zodValidators.secureUrl(['https']).optional(),
    aeaAddress: z.string().max(256).optional(),
    economicIntentSummary: zodValidators.safeContent(512).optional(),
    supportedAeaProtocolsHash: zodValidators.hash32().optional(),
    extendedMetadataUri: zodValidators.secureUrl(['https']).optional(),
    tags: zodValidators.tagsArray(20, 32)
  }),

  /**
   * MCP Server Registration Input Validation Schema
   */
  McpServerRegistrationInput: z.object({
    serverId: z.string()
      .min(1, 'Server ID cannot be empty')
      .max(64, 'Server ID too long')
      .regex(/^[a-zA-Z0-9_-]+$/, 'Server ID contains invalid characters'),
    name: zodValidators.safeContent(128),
    serverVersion: zodValidators.semanticVersion(),
    serviceEndpoint: zodValidators.secureUrl(['https', 'http']),
    documentationUrl: zodValidators.secureUrl(['https', 'http']).optional(),
    serverCapabilitiesSummary: zodValidators.safeContent(512).optional(),
    supportsResources: z.boolean(),
    supportsTools: z.boolean(),
    supportsPrompts: z.boolean(),
    onchainToolDefinitions: z.array(z.object({
      name: z.string().max(64),
      descriptionHash: zodValidators.hash32(),
      inputSchemaHash: zodValidators.hash32(),
      outputSchemaHash: zodValidators.hash32(),
      tags: zodValidators.tagsArray(10, 32)
    })).max(100),
    onchainResourceDefinitions: z.array(z.object({
      uriPattern: z.string().max(256),
      descriptionHash: zodValidators.hash32(),
      tags: zodValidators.tagsArray(10, 32)
    })).max(100),
    onchainPromptDefinitions: z.array(z.object({
      name: z.string().max(64),
      descriptionHash: zodValidators.hash32(),
      tags: zodValidators.tagsArray(10, 32)
    })).max(100),
    fullCapabilitiesUri: zodValidators.secureUrl(['https']).optional(),
    tags: zodValidators.tagsArray(20, 32)
  })
};

/**
 * Schema Validator class
 */
export class SchemaValidator {
  
  /**
   * Validate agent entry against schema
   */
  validateAgentEntry(data: any): ValidationResult {
    try {
      ValidationSchemas.AgentRegistryEntry.parse(data);
      return { valid: true };
    } catch (error) {
      if (error instanceof z.ZodError) {
        return {
          valid: false,
          error: 'Schema validation failed',
          severity: 'MEDIUM',
          details: {
            type: ErrorType.SCHEMA_VALIDATION_ERROR,
            issues: error.issues.map(issue => ({
              path: issue.path.join('.'),
              message: issue.message,
              code: issue.code
            }))
          }
        };
      }
      
      return {
        valid: false,
        error: 'Unknown validation error',
        severity: 'HIGH',
        details: { originalError: (error as Error).message }
      };
    }
  }
  
  /**
   * Validate MCP server entry against schema
   */
  validateMcpServerEntry(data: any): ValidationResult {
    try {
      ValidationSchemas.McpServerRegistryEntry.parse(data);
      return { valid: true };
    } catch (error) {
      if (error instanceof z.ZodError) {
        return {
          valid: false,
          error: 'Schema validation failed',
          severity: 'MEDIUM',
          details: {
            type: ErrorType.SCHEMA_VALIDATION_ERROR,
            issues: error.issues.map(issue => ({
              path: issue.path.join('.'),
              message: issue.message,
              code: issue.code
            }))
          }
        };
      }
      
      return {
        valid: false,
        error: 'Unknown validation error',
        severity: 'HIGH',
        details: { originalError: (error as Error).message }
      };
    }
  }

  /**
   * Validate agent registration input
   */
  validateAgentRegistrationInput(data: any): ValidationResult {
    try {
      ValidationSchemas.AgentRegistrationInput.parse(data);
      return { valid: true };
    } catch (error) {
      if (error instanceof z.ZodError) {
        return {
          valid: false,
          error: 'Registration data validation failed',
          severity: 'MEDIUM',
          details: {
            type: ErrorType.VALIDATION_ERROR,
            issues: error.issues.map(issue => ({
              path: issue.path.join('.'),
              message: issue.message,
              code: issue.code
            }))
          }
        };
      }
      
      return {
        valid: false,
        error: 'Unknown validation error',
        severity: 'HIGH'
      };
    }
  }

  /**
   * Validate MCP server registration input
   */
  validateMcpServerRegistrationInput(data: any): ValidationResult {
    try {
      ValidationSchemas.McpServerRegistrationInput.parse(data);
      return { valid: true };
    } catch (error) {
      if (error instanceof z.ZodError) {
        return {
          valid: false,
          error: 'Registration data validation failed',
          severity: 'MEDIUM',
          details: {
            type: ErrorType.VALIDATION_ERROR,
            issues: error.issues.map(issue => ({
              path: issue.path.join('.'),
              message: issue.message,
              code: issue.code
            }))
          }
        };
      }
      
      return {
        valid: false,
        error: 'Unknown validation error',
        severity: 'HIGH'
      };
    }
  }

  /**
   * Validate specific fields of data (simplified version)
   */
  validateFields(data: any, requiredFields: string[]): ValidationResult {
    try {
      // Basic validation for required fields
      for (const field of requiredFields) {
        if (data[field] === undefined || data[field] === null) {
          return {
            valid: false,
            error: `Required field '${field}' is missing`,
            severity: 'MEDIUM',
            details: { field, type: ErrorType.VALIDATION_ERROR }
          };
        }
      }
      
      return { valid: true };
    } catch (error) {
      return {
        valid: false,
        error: 'Field validation failed',
        severity: 'HIGH',
        details: { originalError: (error as Error).message }
      };
    }
  }
}

// Export singleton instance
export const schemaValidator = new SchemaValidator();