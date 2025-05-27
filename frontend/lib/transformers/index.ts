/**
 * Data Transformation Pipeline
 * 
 * This module provides transformation functions to convert on-chain data
 * structures to UI-compatible formats while maintaining type safety and
 * handling all edge cases appropriately.
 */

import {
  OnChainAgentEntry,
  OnChainMcpServerEntry,
  AgentStatus,
  McpServerStatus,
  AgentCapabilityFlags
} from '../types/onchain-types';
import {
  UIAgentData,
  UIMcpServerData,
  UIAgentSkill,
  UIServiceEndpoint,
  UIMcpCapabilities,
  UIMcpTool,
  UIMcpResource,
  UIMcpPrompt
} from '../types/ui-types';

/**
 * Main Data Transformer class
 * 
 * Contains static methods for transforming different types of on-chain data
 * to UI-compatible formats with comprehensive error handling and validation.
 */
export class DataTransformer {
  
  // ============================================================================
  // AGENT TRANSFORMATION METHODS
  // ============================================================================

  /**
   * Transform on-chain agent data to UI-compatible format
   * 
   * @param onChainData - Raw agent data from blockchain
   * @returns UI-compatible agent data structure
   */
  static transformAgentEntry(onChainData: OnChainAgentEntry): UIAgentData {
    try {
      return {
        id: onChainData.agentId,
        name: this.sanitizeDisplayText(onChainData.name),
        description: this.sanitizeDisplayText(onChainData.description),
        version: onChainData.agentVersion,
        provider: onChainData.providerName || 'Unknown Provider',
        providerUrl: onChainData.providerUrl,
        endpoint: this.extractPrimaryEndpoint(onChainData.serviceEndpoints),
        capabilities: this.parseCapabilitiesFlags(onChainData.capabilitiesFlags),
        supportedModes: this.combineSupportedModes(
          onChainData.supportedInputModes,
          onChainData.supportedOutputModes
        ),
        skills: this.transformAgentSkills(onChainData.skills),
        tags: this.sanitizeTags(onChainData.tags),
        status: this.parseAgentStatus(onChainData.status),
        registrationDate: this.formatTimestamp(onChainData.registrationTimestamp),
        lastUpdate: this.formatTimestamp(onChainData.lastUpdateTimestamp),
        ownerAuthority: onChainData.ownerAuthority.toBase58(),
        securityInfoUri: onChainData.securityInfoUri,
        aeaAddress: onChainData.aeaAddress,
        economicIntent: onChainData.economicIntentSummary,
        extendedMetadataUri: onChainData.extendedMetadataUri,
        serviceEndpoints: this.transformServiceEndpoints(onChainData.serviceEndpoints),
        // Optional fields that may be populated by external systems
        trustScore: this.calculateTrustScore(onChainData),
        rating: undefined, // Will be populated from external metrics
        users: undefined,  // Will be populated from external metrics
        stakeRequired: undefined // Will be populated from external metrics
      };
    } catch (error) {
      console.error('Error transforming agent entry:', error);
      // Return a safe fallback structure
      return this.createFallbackAgentData(onChainData);
    }
  }

  /**
   * Transform agent skills to UI format
   */
  private static transformAgentSkills(skills: any[]): UIAgentSkill[] {
    if (!Array.isArray(skills)) return [];
    
    return skills.map(skill => ({
      skillId: skill.id || 'unknown',
      name: this.sanitizeDisplayText(skill.name || 'Unnamed Skill'),
      tags: this.sanitizeTags(skill.tags || []),
      description: undefined // Can be populated from metadata later
    }));
  }

  /**
   * Transform service endpoints to UI format
   */
  private static transformServiceEndpoints(endpoints: any[]): UIServiceEndpoint[] {
    if (!Array.isArray(endpoints)) return [];
    
    return endpoints.map(endpoint => ({
      protocol: endpoint.protocol || 'https',
      url: endpoint.url || '',
      isDefault: endpoint.isDefault || false,
      label: this.generateEndpointLabel(endpoint)
    }));
  }

  // ============================================================================
  // MCP SERVER TRANSFORMATION METHODS
  // ============================================================================

  /**
   * Transform on-chain MCP server data to UI-compatible format
   * 
   * @param onChainData - Raw MCP server data from blockchain
   * @returns UI-compatible MCP server data structure
   */
  static transformMcpServerEntry(onChainData: OnChainMcpServerEntry): UIMcpServerData {
    try {
      return {
        id: onChainData.serverId,
        name: this.sanitizeDisplayText(onChainData.name),
        description: this.sanitizeDisplayText(
          onChainData.serverCapabilitiesSummary || 'No description available'
        ),
        version: onChainData.serverVersion,
        provider: this.extractProviderFromMetadata(onChainData),
        providerUrl: this.extractProviderUrlFromMetadata(onChainData),
        endpoint: onChainData.serviceEndpoint,
        tools: this.extractToolNames(onChainData.onchainToolDefinitions),
        resources: this.extractResourcePatterns(onChainData.onchainResourceDefinitions),
        prompts: this.extractPromptNames(onChainData.onchainPromptDefinitions),
        capabilities: this.transformMcpCapabilities(onChainData),
        status: this.parseMcpServerStatus(onChainData.status),
        registrationDate: this.formatTimestamp(onChainData.registrationTimestamp),
        lastUpdate: this.formatTimestamp(onChainData.lastUpdateTimestamp),
        ownerAuthority: onChainData.ownerAuthority.toBase58(),
        tags: this.sanitizeTags(onChainData.tags),
        fullCapabilitiesUri: onChainData.fullCapabilitiesUri,
        documentationUrl: onChainData.documentationUrl,
        // Optional fields that may be populated by external systems
        trustScore: this.calculateMcpTrustScore(onChainData),
        rating: undefined, // Will be populated from external metrics
        users: undefined   // Will be populated from external metrics
      };
    } catch (error) {
      console.error('Error transforming MCP server entry:', error);
      // Return a safe fallback structure
      return this.createFallbackMcpServerData(onChainData);
    }
  }

  /**
   * Transform MCP capabilities to UI format
   */
  private static transformMcpCapabilities(serverData: OnChainMcpServerEntry): UIMcpCapabilities {
    return {
      supportsTools: serverData.supportsTools,
      supportsResources: serverData.supportsResources,
      supportsPrompts: serverData.supportsPrompts,
      toolCount: serverData.onchainToolDefinitions?.length || 0,
      resourceCount: serverData.onchainResourceDefinitions?.length || 0,
      promptCount: serverData.onchainPromptDefinitions?.length || 0
    };
  }

  /**
   * Transform tool definitions to UI format
   */
  static transformMcpTools(toolDefinitions: any[]): UIMcpTool[] {
    if (!Array.isArray(toolDefinitions)) return [];
    
    return toolDefinitions.map(tool => ({
      name: tool.name || 'Unnamed Tool',
      description: undefined, // Can be populated from metadata
      tags: this.sanitizeTags(tool.tags || []),
      inputSchema: undefined,  // Can be populated from schema hash
      outputSchema: undefined  // Can be populated from schema hash
    }));
  }

  /**
   * Transform resource definitions to UI format
   */
  static transformMcpResources(resourceDefinitions: any[]): UIMcpResource[] {
    if (!Array.isArray(resourceDefinitions)) return [];
    
    return resourceDefinitions.map(resource => ({
      uriPattern: resource.uriPattern || '',
      description: undefined, // Can be populated from metadata
      tags: this.sanitizeTags(resource.tags || []),
      examples: this.generateUriExamples(resource.uriPattern)
    }));
  }

  /**
   * Transform prompt definitions to UI format
   */
  static transformMcpPrompts(promptDefinitions: any[]): UIMcpPrompt[] {
    if (!Array.isArray(promptDefinitions)) return [];
    
    return promptDefinitions.map(prompt => ({
      name: prompt.name || 'Unnamed Prompt',
      description: undefined, // Can be populated from metadata
      tags: this.sanitizeTags(prompt.tags || []),
      template: undefined     // Can be populated from metadata
    }));
  }

  // ============================================================================
  // UTILITY AND PARSING METHODS
  // ============================================================================

  /**
   * Parse capabilities flags to human-readable strings
   */
  private static parseCapabilitiesFlags(flags: bigint): string[] {
    const capabilities: string[] = [];
    
    // Define capability flag mappings
    const flagMappings = [
      { flag: AgentCapabilityFlags.Trading, name: 'Trading' },
      { flag: AgentCapabilityFlags.Analysis, name: 'Analysis' },
      { flag: AgentCapabilityFlags.Automation, name: 'Automation' },
      { flag: AgentCapabilityFlags.RiskManagement, name: 'Risk Management' },
      { flag: AgentCapabilityFlags.DataProcessing, name: 'Data Processing' },
      { flag: AgentCapabilityFlags.MachineLearning, name: 'Machine Learning' },
      { flag: AgentCapabilityFlags.NaturalLanguage, name: 'Natural Language' },
      { flag: AgentCapabilityFlags.ImageProcessing, name: 'Image Processing' },
      { flag: AgentCapabilityFlags.AudioProcessing, name: 'Audio Processing' },
      { flag: AgentCapabilityFlags.VideoProcessing, name: 'Video Processing' }
    ];

    for (const mapping of flagMappings) {
      if (flags & BigInt(mapping.flag)) {
        capabilities.push(mapping.name);
      }
    }

    return capabilities.length > 0 ? capabilities : ['General Purpose'];
  }

  /**
   * Parse agent status code to human-readable string
   */
  private static parseAgentStatus(status: number): string {
    switch (status) {
      case AgentStatus.Inactive:
        return 'Inactive';
      case AgentStatus.Active:
        return 'Active';
      case AgentStatus.Suspended:
        return 'Suspended';
      case AgentStatus.Deprecated:
        return 'Deprecated';
      default:
        return 'Unknown';
    }
  }

  /**
   * Parse MCP server status code to human-readable string
   */
  private static parseMcpServerStatus(status: number): string {
    switch (status) {
      case McpServerStatus.Inactive:
        return 'Inactive';
      case McpServerStatus.Active:
        return 'Active';
      case McpServerStatus.Maintenance:
        return 'Maintenance';
      case McpServerStatus.Deprecated:
        return 'Deprecated';
      default:
        return 'Unknown';
    }
  }

  /**
   * Combine supported input/output modes for display
   */
  private static combineSupportedModes(inputModes: string[], outputModes: string[]): string[] {
    const combined: string[] = [];
    
    if (Array.isArray(inputModes)) {
      combined.push(...inputModes.map(mode => `Input: ${mode}`));
    }
    
    if (Array.isArray(outputModes)) {
      combined.push(...outputModes.map(mode => `Output: ${mode}`));
    }
    
    return combined;
  }

  /**
   * Extract primary service endpoint URL
   */
  private static extractPrimaryEndpoint(endpoints: any[]): string {
    if (!Array.isArray(endpoints) || endpoints.length === 0) {
      return '';
    }
    
    // Look for default endpoint first
    const defaultEndpoint = endpoints.find(ep => ep.isDefault);
    if (defaultEndpoint?.url) {
      return defaultEndpoint.url;
    }
    
    // Fall back to first available endpoint
    return endpoints[0]?.url || '';
  }

  /**
   * Format blockchain timestamp to ISO string
   */
  private static formatTimestamp(timestamp: bigint): string {
    try {
      // Convert from Unix timestamp (seconds) to milliseconds
      const ms = Number(timestamp) * 1000;
      return new Date(ms).toISOString();
    } catch (error) {
      console.error('Error formatting timestamp:', error);
      return new Date().toISOString(); // Fallback to current time
    }
  }

  /**
   * Sanitize display text for security
   */
  private static sanitizeDisplayText(text: string): string {
    if (typeof text !== 'string') return '';
    
    // Basic sanitization - remove potentially dangerous content
    return text
      .replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, '')
      .replace(/javascript:/gi, '')
      .replace(/on\w+\s*=/gi, '')
      .trim();
  }

  /**
   * Sanitize and validate tags
   */
  private static sanitizeTags(tags: string[]): string[] {
    if (!Array.isArray(tags)) return [];
    
    return tags
      .filter(tag => typeof tag === 'string' && tag.trim().length > 0)
      .map(tag => this.sanitizeDisplayText(tag))
      .slice(0, 20); // Limit to 20 tags max
  }

  /**
   * Extract tool names from definitions
   */
  private static extractToolNames(toolDefinitions: any[]): string[] {
    if (!Array.isArray(toolDefinitions)) return [];
    
    return toolDefinitions
      .map(tool => tool.name)
      .filter(name => typeof name === 'string' && name.length > 0);
  }

  /**
   * Extract resource URI patterns
   */
  private static extractResourcePatterns(resourceDefinitions: any[]): string[] {
    if (!Array.isArray(resourceDefinitions)) return [];
    
    return resourceDefinitions
      .map(resource => resource.uriPattern)
      .filter(pattern => typeof pattern === 'string' && pattern.length > 0);
  }

  /**
   * Extract prompt names
   */
  private static extractPromptNames(promptDefinitions: any[]): string[] {
    if (!Array.isArray(promptDefinitions)) return [];
    
    return promptDefinitions
      .map(prompt => prompt.name)
      .filter(name => typeof name === 'string' && name.length > 0);
  }

  /**
   * Generate endpoint label for display
   */
  private static generateEndpointLabel(endpoint: any): string {
    const protocol = endpoint.protocol || 'https';
    const isDefault = endpoint.isDefault ? ' (Default)' : '';
    return `${protocol.toUpperCase()}${isDefault}`;
  }

  /**
   * Generate URI examples from pattern
   */
  private static generateUriExamples(pattern: string): string[] {
    if (!pattern) return [];
    
    // Simple example generation - can be enhanced
    const examples = [];
    if (pattern.includes('**')) {
      examples.push(pattern.replace('**', 'example/path'));
    }
    if (pattern.includes('*')) {
      examples.push(pattern.replace('*', 'example'));
    }
    
    return examples.slice(0, 3); // Limit to 3 examples
  }

  /**
   * Extract provider information from metadata
   */
  private static extractProviderFromMetadata(serverData: OnChainMcpServerEntry): string | undefined {
    // This could be enhanced to parse provider info from extended metadata
    return undefined;
  }

  /**
   * Extract provider URL from metadata
   */
  private static extractProviderUrlFromMetadata(serverData: OnChainMcpServerEntry): string | undefined {
    // This could be enhanced to parse provider URL from extended metadata
    return undefined;
  }

  /**
   * Calculate basic trust score
   */
  private static calculateTrustScore(agentData: OnChainAgentEntry): number {
    let score = 50; // Base score
    
    // Add points for completeness
    if (agentData.providerName) score += 10;
    if (agentData.providerUrl) score += 10;
    if (agentData.documentationUrl) score += 10;
    if (agentData.securityInfoUri) score += 10;
    if (agentData.serviceEndpoints.length > 0) score += 10;
    
    return Math.min(100, score);
  }

  /**
   * Calculate basic trust score for MCP servers
   */
  private static calculateMcpTrustScore(serverData: OnChainMcpServerEntry): number {
    let score = 50; // Base score
    
    // Add points for completeness
    if (serverData.documentationUrl) score += 15;
    if (serverData.fullCapabilitiesUri) score += 15;
    if (serverData.serverCapabilitiesSummary) score += 10;
    if (serverData.onchainToolDefinitions.length > 0) score += 10;
    
    return Math.min(100, score);
  }

  // ============================================================================
  // FALLBACK DATA CREATION
  // ============================================================================

  /**
   * Create safe fallback agent data
   */
  private static createFallbackAgentData(onChainData: OnChainAgentEntry): UIAgentData {
    return {
      id: onChainData.agentId || 'unknown',
      name: 'Agent (Display Error)',
      description: 'Unable to parse agent data',
      version: '0.0.0',
      provider: 'Unknown',
      endpoint: '',
      capabilities: [],
      supportedModes: [],
      skills: [],
      tags: [],
      status: 'Unknown',
      registrationDate: new Date().toISOString(),
      lastUpdate: new Date().toISOString(),
      ownerAuthority: onChainData.ownerAuthority?.toBase58() || '',
      serviceEndpoints: [],
      trustScore: 0
    };
  }

  /**
   * Create safe fallback MCP server data
   */
  private static createFallbackMcpServerData(onChainData: OnChainMcpServerEntry): UIMcpServerData {
    return {
      id: onChainData.serverId || 'unknown',
      name: 'Server (Display Error)',
      description: 'Unable to parse server data',
      version: '0.0.0',
      endpoint: onChainData.serviceEndpoint || '',
      tools: [],
      resources: [],
      prompts: [],
      capabilities: {
        supportsTools: false,
        supportsResources: false,
        supportsPrompts: false,
        toolCount: 0,
        resourceCount: 0,
        promptCount: 0
      },
      status: 'Unknown',
      registrationDate: new Date().toISOString(),
      lastUpdate: new Date().toISOString(),
      ownerAuthority: onChainData.ownerAuthority?.toBase58() || '',
      tags: [],
      trustScore: 0
    };
  }
}

// Export utility functions for external use
export const transformerUtils = {
  sanitizeDisplayText: DataTransformer['sanitizeDisplayText'],
  sanitizeTags: DataTransformer['sanitizeTags'],
  formatTimestamp: DataTransformer['formatTimestamp'],
  parseCapabilitiesFlags: DataTransformer['parseCapabilitiesFlags']
};