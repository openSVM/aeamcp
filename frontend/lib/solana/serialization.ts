/**
 * Borsh Serialization Service
 * 
 * This module provides proper Borsh serialization and deserialization
 * for agent and MCP server registry data, replacing the placeholder
 * methods in the registry service.
 */

import { BorshCoder, Idl } from '@coral-xyz/anchor';
import { PublicKey } from '@solana/web3.js';
import {
  OnChainAgentEntry,
  OnChainMcpServerEntry,
  AgentRegistrationData,
  McpServerRegistrationData,
  isOnChainAgentEntry,
  isOnChainMcpServerEntry
} from '../types/onchain-types';
import {
  DeserializationError,
  SerializationError,
  ValidationResult,
  ErrorType
} from '../types/validation-types';

// Import IDL definitions
import AgentRegistryIDL from '../idl/agent_registry.json';
import McpServerRegistryIDL from '../idl/mcp_server_registry.json';

/**
 * Registry Data Serializer
 * 
 * Handles all Borsh serialization and deserialization operations
 * for both agent and MCP server registry data with comprehensive
 * error handling and validation.
 */
export class RegistryDataSerializer {
  private agentCoder!: BorshCoder;
  private mcpCoder!: BorshCoder;
  private initialized: boolean = false;

  constructor() {
    // Don't initialize coders in constructor to avoid startup errors
  }

  /**
   * Initialize Borsh coders with IDL definitions (lazy initialization)
   */
  private initializeCoders(): void {
    if (this.initialized) return;
    
    try {
      // Initialize agent registry coder with type assertion
      this.agentCoder = new BorshCoder(AgentRegistryIDL as unknown as Idl);
      
      // Initialize MCP server registry coder with type assertion
      this.mcpCoder = new BorshCoder(McpServerRegistryIDL as unknown as Idl);
      
      this.initialized = true;
    } catch (error) {
      console.error('Failed to initialize Borsh coders:', error);
      throw new SerializationError(
        'Failed to initialize serialization coders',
        error as Error
      );
    }
  }

  /**
   * Ensure coders are initialized
   */
  private ensureInitialized(): void {
    if (!this.initialized) {
      this.initializeCoders();
    }
  }

  // ============================================================================
  // AGENT SERIALIZATION/DESERIALIZATION
  // ============================================================================

  /**
   * Deserialize agent entry from blockchain account data
   * 
   * @param data - Raw account data buffer from blockchain
   * @returns Parsed agent entry data
   * @throws DeserializationError if parsing fails
   */
  deserializeAgentEntry(data: Buffer): OnChainAgentEntry {
    this.ensureInitialized();
    
    try {
      // Attempt to decode using the agent registry coder
      const decoded = this.agentCoder.accounts.decode('AgentRegistryEntryV1', data);
      
      // Transform decoded data to match our TypeScript interface
      const agentEntry: OnChainAgentEntry = {
        bump: decoded.bump,
        registryVersion: decoded.registryVersion,
        ownerAuthority: new PublicKey(decoded.ownerAuthority),
        agentId: decoded.agentId,
        name: decoded.name,
        description: decoded.description,
        agentVersion: decoded.agentVersion,
        providerName: decoded.providerName || undefined,
        providerUrl: decoded.providerUrl || undefined,
        documentationUrl: decoded.documentationUrl || undefined,
        serviceEndpoints: decoded.serviceEndpoints || [],
        capabilitiesFlags: BigInt(decoded.capabilitiesFlags || 0),
        supportedInputModes: decoded.supportedInputModes || [],
        supportedOutputModes: decoded.supportedOutputModes || [],
        skills: decoded.skills || [],
        securityInfoUri: decoded.securityInfoUri || undefined,
        aeaAddress: decoded.aeaAddress || undefined,
        economicIntentSummary: decoded.economicIntentSummary || undefined,
        supportedAeaProtocolsHash: decoded.supportedAeaProtocolsHash || undefined,
        status: decoded.status,
        registrationTimestamp: BigInt(decoded.registrationTimestamp),
        lastUpdateTimestamp: BigInt(decoded.lastUpdateTimestamp),
        extendedMetadataUri: decoded.extendedMetadataUri || undefined,
        tags: decoded.tags || []
      };

      // Validate the structure using type guard
      if (!isOnChainAgentEntry(agentEntry)) {
        throw new DeserializationError('Deserialized data does not match expected agent structure');
      }

      return agentEntry;
      
    } catch (error) {
      if (error instanceof DeserializationError) {
        throw error;
      }
      
      throw new DeserializationError(
        'Failed to deserialize agent entry from blockchain data',
        error as Error
      );
    }
  }

  /**
   * Serialize agent registration data for blockchain submission
   * 
   * @param data - Agent registration data
   * @returns Serialized instruction data buffer
   * @throws SerializationError if serialization fails
   */
  serializeAgentRegistration(data: AgentRegistrationData): Buffer {
    this.ensureInitialized();
    
    try {
      // Prepare data for serialization - ensure all fields match IDL expectations
      const instructionData = {
        agentId: data.agentId,
        name: data.name,
        description: data.description,
        agentVersion: data.agentVersion,
        providerName: data.providerName || null,
        providerUrl: data.providerUrl || null,
        documentationUrl: data.documentationUrl || null,
        serviceEndpoints: data.serviceEndpoints,
        capabilitiesFlags: data.capabilitiesFlags.toString(), // Convert BigInt to string for serialization
        supportedInputModes: data.supportedInputModes,
        supportedOutputModes: data.supportedOutputModes,
        skills: data.skills,
        securityInfoUri: data.securityInfoUri || null,
        aeaAddress: data.aeaAddress || null,
        economicIntentSummary: data.economicIntentSummary || null,
        supportedAeaProtocolsHash: data.supportedAeaProtocolsHash || null,
        extendedMetadataUri: data.extendedMetadataUri || null,
        tags: data.tags
      };

      // Encode the instruction
      const encoded = this.agentCoder.instruction.encode('registerAgent', instructionData);
      
      return encoded;
      
    } catch (error) {
      throw new SerializationError(
        'Failed to serialize agent registration data',
        error as Error
      );
    }
  }

  /**
   * Serialize agent update data
   */
  serializeAgentUpdate(agentId: string, updateData: any): Buffer {
    this.ensureInitialized();
    
    try {
      const encoded = this.agentCoder.instruction.encode('updateAgentDetails', {
        details: updateData
      });
      
      return encoded;
      
    } catch (error) {
      throw new SerializationError(
        'Failed to serialize agent update data',
        error as Error
      );
    }
  }

  // ============================================================================
  // MCP SERVER SERIALIZATION/DESERIALIZATION
  // ============================================================================

  /**
   * Deserialize MCP server entry from blockchain account data
   * 
   * @param data - Raw account data buffer from blockchain
   * @returns Parsed MCP server entry data
   * @throws DeserializationError if parsing fails
   */
  deserializeMcpServerEntry(data: Buffer): OnChainMcpServerEntry {
    this.ensureInitialized();
    
    try {
      // Attempt to decode using the MCP server registry coder
      const decoded = this.mcpCoder.accounts.decode('McpServerRegistryEntryV1', data);
      
      // Transform decoded data to match our TypeScript interface
      const serverEntry: OnChainMcpServerEntry = {
        bump: decoded.bump,
        registryVersion: decoded.registryVersion,
        ownerAuthority: new PublicKey(decoded.ownerAuthority),
        serverId: decoded.serverId,
        name: decoded.name,
        serverVersion: decoded.serverVersion,
        serviceEndpoint: decoded.serviceEndpoint,
        documentationUrl: decoded.documentationUrl || undefined,
        serverCapabilitiesSummary: decoded.serverCapabilitiesSummary || undefined,
        supportsResources: decoded.supportsResources,
        supportsTools: decoded.supportsTools,
        supportsPrompts: decoded.supportsPrompts,
        onchainToolDefinitions: decoded.onchainToolDefinitions || [],
        onchainResourceDefinitions: decoded.onchainResourceDefinitions || [],
        onchainPromptDefinitions: decoded.onchainPromptDefinitions || [],
        status: decoded.status,
        registrationTimestamp: BigInt(decoded.registrationTimestamp),
        lastUpdateTimestamp: BigInt(decoded.lastUpdateTimestamp),
        fullCapabilitiesUri: decoded.fullCapabilitiesUri || undefined,
        tags: decoded.tags || []
      };

      // Validate the structure using type guard
      if (!isOnChainMcpServerEntry(serverEntry)) {
        throw new DeserializationError('Deserialized data does not match expected MCP server structure');
      }

      return serverEntry;
      
    } catch (error) {
      if (error instanceof DeserializationError) {
        throw error;
      }
      
      throw new DeserializationError(
        'Failed to deserialize MCP server entry from blockchain data',
        error as Error
      );
    }
  }

  /**
   * Serialize MCP server registration data for blockchain submission
   * 
   * @param data - MCP server registration data
   * @returns Serialized instruction data buffer
   * @throws SerializationError if serialization fails
   */
  serializeMcpServerRegistration(data: McpServerRegistrationData): Buffer {
    this.ensureInitialized();
    
    try {
      // Prepare data for serialization - ensure all fields match IDL expectations
      const instructionData = {
        serverId: data.serverId,
        name: data.name,
        serverVersion: data.serverVersion,
        serviceEndpoint: data.serviceEndpoint,
        documentationUrl: data.documentationUrl || null,
        serverCapabilitiesSummary: data.serverCapabilitiesSummary || null,
        supportsResources: data.supportsResources,
        supportsTools: data.supportsTools,
        supportsPrompts: data.supportsPrompts,
        onchainToolDefinitions: data.onchainToolDefinitions,
        onchainResourceDefinitions: data.onchainResourceDefinitions,
        onchainPromptDefinitions: data.onchainPromptDefinitions,
        fullCapabilitiesUri: data.fullCapabilitiesUri || null,
        tags: data.tags
      };

      // Encode the instruction
      const encoded = this.mcpCoder.instruction.encode('registerMcpServer', instructionData);
      
      return encoded;
      
    } catch (error) {
      throw new SerializationError(
        'Failed to serialize MCP server registration data',
        error as Error
      );
    }
  }

  /**
   * Serialize MCP server update data
   */
  serializeMcpServerUpdate(serverId: string, updateData: any): Buffer {
    this.ensureInitialized();
    
    try {
      const encoded = this.mcpCoder.instruction.encode('updateMcpServerDetails', {
        details: updateData
      });
      
      return encoded;
      
    } catch (error) {
      throw new SerializationError(
        'Failed to serialize MCP server update data',
        error as Error
      );
    }
  }

  // ============================================================================
  // VALIDATION AND UTILITY METHODS
  // ============================================================================

  /**
   * Validate raw account data before deserialization
   */
  validateAccountData(data: Buffer, expectedType: 'agent' | 'mcp_server'): ValidationResult {
    try {
      // Basic size validation
      if (data.length === 0) {
        return {
          valid: false,
          error: 'Account data is empty',
          severity: 'HIGH'
        };
      }

      // Minimum size check (accounts should have at least some basic fields)
      const minSize = expectedType === 'agent' ? 200 : 150; // Rough estimates
      if (data.length < minSize) {
        return {
          valid: false,
          error: `Account data too small (${data.length} bytes, expected at least ${minSize})`,
          severity: 'MEDIUM'
        };
      }

      // Maximum size check (prevent memory issues)
      const maxSize = 10240; // 10KB max
      if (data.length > maxSize) {
        return {
          valid: false,
          error: `Account data too large (${data.length} bytes, maximum ${maxSize})`,
          severity: 'HIGH'
        };
      }

      return { valid: true };
      
    } catch (error) {
      return {
        valid: false,
        error: 'Failed to validate account data',
        severity: 'MEDIUM',
        details: { error: (error as Error).message }
      };
    }
  }

  /**
   * Get account discriminator for validation
   */
  getAccountDiscriminator(accountType: 'AgentRegistryEntryV1' | 'McpServerRegistryEntryV1'): Buffer {
    try {
      // Use sha256 hash of account name as discriminator (Anchor standard)
      const crypto = require('crypto');
      const discriminator = crypto.createHash('sha256')
        .update(`account:${accountType}`)
        .digest()
        .slice(0, 8); // First 8 bytes
      
      return Buffer.from(discriminator);
    } catch (error) {
      throw new SerializationError(`Failed to get discriminator for ${accountType}`);
    }
  }

  /**
   * Verify account discriminator matches expected type
   */
  verifyAccountDiscriminator(data: Buffer, expectedType: 'agent' | 'mcp_server'): boolean {
    try {
      const accountType = expectedType === 'agent' ? 'AgentRegistryEntryV1' : 'McpServerRegistryEntryV1';
      const expectedDiscriminator = this.getAccountDiscriminator(accountType);
      
      if (data.length < expectedDiscriminator.length) {
        return false;
      }
      
      const actualDiscriminator = data.slice(0, expectedDiscriminator.length);
      return actualDiscriminator.equals(expectedDiscriminator);
      
    } catch (error) {
      console.error('Error verifying account discriminator:', error);
      return false;
    }
  }

  /**
   * Safe deserialization with validation
   */
  safeDeserializeAgent(data: Buffer): { success: boolean; data?: OnChainAgentEntry; error?: string } {
    try {
      // Validate data first
      const validation = this.validateAccountData(data, 'agent');
      if (!validation.valid) {
        return { success: false, error: validation.error };
      }

      // Verify discriminator
      if (!this.verifyAccountDiscriminator(data, 'agent')) {
        return { success: false, error: 'Invalid account discriminator for agent entry' };
      }

      // Attempt deserialization
      const agentEntry = this.deserializeAgentEntry(data);
      return { success: true, data: agentEntry };
      
    } catch (error) {
      return { 
        success: false, 
        error: error instanceof Error ? error.message : 'Unknown deserialization error' 
      };
    }
  }

  /**
   * Safe deserialization with validation for MCP servers
   */
  safeDeserializeMcpServer(data: Buffer): { success: boolean; data?: OnChainMcpServerEntry; error?: string } {
    try {
      // Validate data first
      const validation = this.validateAccountData(data, 'mcp_server');
      if (!validation.valid) {
        return { success: false, error: validation.error };
      }

      // Verify discriminator
      if (!this.verifyAccountDiscriminator(data, 'mcp_server')) {
        return { success: false, error: 'Invalid account discriminator for MCP server entry' };
      }

      // Attempt deserialization
      const serverEntry = this.deserializeMcpServerEntry(data);
      return { success: true, data: serverEntry };
      
    } catch (error) {
      return { 
        success: false, 
        error: error instanceof Error ? error.message : 'Unknown deserialization error' 
      };
    }
  }
}

// Export lazy-initialized singleton instance
let _registrySerializer: RegistryDataSerializer | null = null;

export const getRegistrySerializer = (): RegistryDataSerializer => {
  if (!_registrySerializer) {
    _registrySerializer = new RegistryDataSerializer();
  }
  return _registrySerializer;
};

// Legacy export for backward compatibility (but lazy)
export const registrySerializer = {
  deserializeAgentEntry: (data: Buffer) => getRegistrySerializer().deserializeAgentEntry(data),
  serializeAgentRegistration: (data: AgentRegistrationData) => getRegistrySerializer().serializeAgentRegistration(data),
  serializeAgentUpdate: (agentId: string, updateData: any) => getRegistrySerializer().serializeAgentUpdate(agentId, updateData),
  deserializeMcpServerEntry: (data: Buffer) => getRegistrySerializer().deserializeMcpServerEntry(data),
  serializeMcpServerRegistration: (data: McpServerRegistrationData) => getRegistrySerializer().serializeMcpServerRegistration(data),
  serializeMcpServerUpdate: (serverId: string, updateData: any) => getRegistrySerializer().serializeMcpServerUpdate(serverId, updateData),
  validateAccountData: (data: Buffer, expectedType: 'agent' | 'mcp_server') => getRegistrySerializer().validateAccountData(data, expectedType),
  getAccountDiscriminator: (accountType: 'AgentRegistryEntryV1' | 'McpServerRegistryEntryV1') => getRegistrySerializer().getAccountDiscriminator(accountType),
  verifyAccountDiscriminator: (data: Buffer, expectedType: 'agent' | 'mcp_server') => getRegistrySerializer().verifyAccountDiscriminator(data, expectedType),
  safeDeserializeAgent: (data: Buffer) => getRegistrySerializer().safeDeserializeAgent(data),
  safeDeserializeMcpServer: (data: Buffer) => getRegistrySerializer().safeDeserializeMcpServer(data)
};
