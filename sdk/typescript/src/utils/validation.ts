import { PublicKey } from '@solana/web3.js';
import { 
  AgentRegistrationData,
  AgentUpdateData,
  McpServerRegistrationData,
  McpServerUpdateData,
  AgentServiceEndpoint,
  AgentSkill,
  McpToolDefinition,
  McpResourceDefinition,
  McpPromptDefinition,
  CONSTANTS 
} from '../types.js';
import { ValidationError } from '../errors.js';

/**
 * Validation utilities for SDK inputs
 */
export class Validator {
  /**
   * Validates string length
   */
  static validateStringLength(value: string, maxLength: number, fieldName: string): void {
    if (value.length > maxLength) {
      throw new ValidationError(`${fieldName} exceeds maximum length of ${maxLength} characters`, fieldName);
    }
  }

  /**
   * Validates required string field
   */
  static validateRequiredString(value: string | undefined, fieldName: string, maxLength?: number): void {
    if (!value || value.trim().length === 0) {
      throw new ValidationError(`${fieldName} is required and cannot be empty`, fieldName);
    }
    if (maxLength) {
      this.validateStringLength(value, maxLength, fieldName);
    }
  }

  /**
   * Validates optional string field
   */
  static validateOptionalString(value: string | undefined, fieldName: string, maxLength: number): void {
    if (value !== undefined) {
      this.validateStringLength(value, maxLength, fieldName);
    }
  }

  /**
   * Validates URL format
   */
  static validateUrl(url: string, fieldName: string, allowedProtocols: string[] = ['http:', 'https:']): void {
    try {
      const urlObj = new URL(url);
      if (!allowedProtocols.includes(urlObj.protocol)) {
        throw new ValidationError(
          `${fieldName} must use one of the following protocols: ${allowedProtocols.join(', ')}`,
          fieldName
        );
      }
    } catch (error) {
      if (error instanceof ValidationError) throw error;
      throw new ValidationError(`${fieldName} is not a valid URL`, fieldName);
    }
  }

  /**
   * Validates array length
   */
  static validateArrayLength<T>(array: T[], maxLength: number, fieldName: string): void {
    if (array.length > maxLength) {
      throw new ValidationError(`${fieldName} exceeds maximum of ${maxLength} items`, fieldName);
    }
  }

  /**
   * Validates PublicKey
   */
  static validatePublicKey(key: PublicKey | string, fieldName: string): PublicKey {
    try {
      return typeof key === 'string' ? new PublicKey(key) : key;
    } catch (error) {
      throw new ValidationError(`${fieldName} is not a valid Solana public key`, fieldName);
    }
  }

  /**
   * Validates agent ID format (alphanumeric, hyphens, underscores only)
   */
  static validateAgentId(agentId: string): void {
    this.validateRequiredString(agentId, 'agentId', CONSTANTS.MAX_AGENT_ID_LEN);
    
    const validPattern = /^[a-zA-Z0-9_-]+$/;
    if (!validPattern.test(agentId)) {
      throw new ValidationError(
        'Agent ID can only contain alphanumeric characters, hyphens, and underscores',
        'agentId'
      );
    }
  }

  /**
   * Validates server ID format (same as agent ID)
   */
  static validateServerId(serverId: string): void {
    this.validateRequiredString(serverId, 'serverId', CONSTANTS.MAX_SERVER_ID_LEN);
    
    const validPattern = /^[a-zA-Z0-9_-]+$/;
    if (!validPattern.test(serverId)) {
      throw new ValidationError(
        'Server ID can only contain alphanumeric characters, hyphens, and underscores',
        'serverId'
      );
    }
  }

  /**
   * Validates service endpoint
   */
  static validateServiceEndpoint(endpoint: AgentServiceEndpoint, index: number): void {
    const fieldPrefix = `serviceEndpoints[${index}]`;
    
    this.validateRequiredString(endpoint.protocol, `${fieldPrefix}.protocol`, CONSTANTS.MAX_ENDPOINT_PROTOCOL_LEN);
    this.validateRequiredString(endpoint.url, `${fieldPrefix}.url`, CONSTANTS.MAX_ENDPOINT_URL_LEN);
    this.validateUrl(endpoint.url, `${fieldPrefix}.url`);
  }

  /**
   * Validates agent skill
   */
  static validateAgentSkill(skill: AgentSkill, index: number): void {
    const fieldPrefix = `skills[${index}]`;
    
    this.validateRequiredString(skill.id, `${fieldPrefix}.id`, CONSTANTS.MAX_SKILL_ID_LEN);
    this.validateRequiredString(skill.name, `${fieldPrefix}.name`, CONSTANTS.MAX_SKILL_NAME_LEN);
    this.validateArrayLength(skill.tags, CONSTANTS.MAX_SKILL_TAGS, `${fieldPrefix}.tags`);
    
    skill.tags.forEach((tag, tagIndex) => {
      this.validateRequiredString(tag, `${fieldPrefix}.tags[${tagIndex}]`, CONSTANTS.MAX_SKILL_TAG_LEN);
    });
  }

  /**
   * Validates MCP tool definition
   */
  static validateMcpToolDefinition(tool: McpToolDefinition, index: number): void {
    const fieldPrefix = `onchainToolDefinitions[${index}]`;
    
    this.validateRequiredString(tool.name, `${fieldPrefix}.name`, CONSTANTS.MAX_TOOL_NAME_LEN);
    this.validateArrayLength(tool.tags, CONSTANTS.MAX_TOOL_TAGS, `${fieldPrefix}.tags`);
    
    tool.tags.forEach((tag, tagIndex) => {
      this.validateRequiredString(tag, `${fieldPrefix}.tags[${tagIndex}]`, CONSTANTS.MAX_TOOL_TAG_LEN);
    });
  }

  /**
   * Validates MCP resource definition
   */
  static validateMcpResourceDefinition(resource: McpResourceDefinition, index: number): void {
    const fieldPrefix = `onchainResourceDefinitions[${index}]`;
    
    this.validateRequiredString(resource.uriPattern, `${fieldPrefix}.uriPattern`, CONSTANTS.MAX_RESOURCE_URI_PATTERN_LEN);
    this.validateArrayLength(resource.tags, CONSTANTS.MAX_RESOURCE_TAGS, `${fieldPrefix}.tags`);
    
    resource.tags.forEach((tag, tagIndex) => {
      this.validateRequiredString(tag, `${fieldPrefix}.tags[${tagIndex}]`, CONSTANTS.MAX_RESOURCE_TAG_LEN);
    });
  }

  /**
   * Validates MCP prompt definition
   */
  static validateMcpPromptDefinition(prompt: McpPromptDefinition, index: number): void {
    const fieldPrefix = `onchainPromptDefinitions[${index}]`;
    
    this.validateRequiredString(prompt.name, `${fieldPrefix}.name`, CONSTANTS.MAX_PROMPT_NAME_LEN);
    this.validateArrayLength(prompt.tags, CONSTANTS.MAX_PROMPT_TAGS, `${fieldPrefix}.tags`);
    
    prompt.tags.forEach((tag, tagIndex) => {
      this.validateRequiredString(tag, `${fieldPrefix}.tags[${tagIndex}]`, CONSTANTS.MAX_PROMPT_TAG_LEN);
    });
  }

  /**
   * Validates agent registration data
   */
  static validateAgentRegistrationData(data: AgentRegistrationData): void {
    // Basic required fields
    this.validateAgentId(data.agentId);
    this.validateRequiredString(data.name, 'name', CONSTANTS.MAX_AGENT_NAME_LEN);
    this.validateRequiredString(data.description, 'description', CONSTANTS.MAX_AGENT_DESCRIPTION_LEN);
    this.validateRequiredString(data.version, 'version', CONSTANTS.MAX_AGENT_VERSION_LEN);
    this.validateRequiredString(data.providerName, 'providerName', CONSTANTS.MAX_PROVIDER_NAME_LEN);
    this.validateRequiredString(data.providerUrl, 'providerUrl', CONSTANTS.MAX_PROVIDER_URL_LEN);
    
    // Validate provider URL format
    this.validateUrl(data.providerUrl, 'providerUrl');

    // Optional fields
    this.validateOptionalString(data.documentationUrl, 'documentationUrl', CONSTANTS.MAX_DOCUMENTATION_URL_LEN);
    if (data.documentationUrl) {
      this.validateUrl(data.documentationUrl, 'documentationUrl');
    }

    this.validateOptionalString(data.securityInfoUri, 'securityInfoUri', CONSTANTS.MAX_SECURITY_INFO_URI_LEN);
    if (data.securityInfoUri) {
      this.validateUrl(data.securityInfoUri, 'securityInfoUri', ['http:', 'https:', 'ipfs:', 'ar:']);
    }

    this.validateOptionalString(data.aeaAddress, 'aeaAddress', CONSTANTS.MAX_AEA_ADDRESS_LEN);
    this.validateOptionalString(data.economicIntent, 'economicIntent', CONSTANTS.MAX_ECONOMIC_INTENT_LEN);
    this.validateOptionalString(data.extendedMetadataUri, 'extendedMetadataUri', CONSTANTS.MAX_EXTENDED_METADATA_URI_LEN);
    if (data.extendedMetadataUri) {
      this.validateUrl(data.extendedMetadataUri, 'extendedMetadataUri', ['http:', 'https:', 'ipfs:', 'ar:']);
    }

    // Arrays
    this.validateArrayLength(data.serviceEndpoints, CONSTANTS.MAX_SERVICE_ENDPOINTS, 'serviceEndpoints');
    data.serviceEndpoints.forEach((endpoint, index) => {
      this.validateServiceEndpoint(endpoint, index);
    });

    this.validateArrayLength(data.supportedModes, CONSTANTS.MAX_SUPPORTED_MODES, 'supportedModes');
    data.supportedModes.forEach((mode, index) => {
      this.validateRequiredString(mode, `supportedModes[${index}]`, CONSTANTS.MAX_MODE_LEN);
    });

    this.validateArrayLength(data.skills, CONSTANTS.MAX_SKILLS, 'skills');
    data.skills.forEach((skill, index) => {
      this.validateAgentSkill(skill, index);
    });

    this.validateArrayLength(data.tags, CONSTANTS.MAX_AGENT_TAGS, 'tags');
    data.tags.forEach((tag, index) => {
      this.validateRequiredString(tag, `tags[${index}]`, CONSTANTS.MAX_AGENT_TAG_LEN);
    });
  }

  /**
   * Validates agent update data
   */
  static validateAgentUpdateData(data: AgentUpdateData): void {
    // Validate only the fields that are provided
    if (data.name !== undefined) {
      this.validateRequiredString(data.name, 'name', CONSTANTS.MAX_AGENT_NAME_LEN);
    }
    if (data.description !== undefined) {
      this.validateRequiredString(data.description, 'description', CONSTANTS.MAX_AGENT_DESCRIPTION_LEN);
    }
    if (data.version !== undefined) {
      this.validateRequiredString(data.version, 'version', CONSTANTS.MAX_AGENT_VERSION_LEN);
    }
    if (data.providerName !== undefined) {
      this.validateRequiredString(data.providerName, 'providerName', CONSTANTS.MAX_PROVIDER_NAME_LEN);
    }
    if (data.providerUrl !== undefined) {
      this.validateRequiredString(data.providerUrl, 'providerUrl', CONSTANTS.MAX_PROVIDER_URL_LEN);
      this.validateUrl(data.providerUrl, 'providerUrl');
    }
    if (data.documentationUrl !== undefined) {
      this.validateOptionalString(data.documentationUrl, 'documentationUrl', CONSTANTS.MAX_DOCUMENTATION_URL_LEN);
      if (data.documentationUrl) {
        this.validateUrl(data.documentationUrl, 'documentationUrl');
      }
    }
    if (data.securityInfoUri !== undefined) {
      this.validateOptionalString(data.securityInfoUri, 'securityInfoUri', CONSTANTS.MAX_SECURITY_INFO_URI_LEN);
      if (data.securityInfoUri) {
        this.validateUrl(data.securityInfoUri, 'securityInfoUri', ['http:', 'https:', 'ipfs:', 'ar:']);
      }
    }
    if (data.aeaAddress !== undefined) {
      this.validateOptionalString(data.aeaAddress, 'aeaAddress', CONSTANTS.MAX_AEA_ADDRESS_LEN);
    }
    if (data.economicIntent !== undefined) {
      this.validateOptionalString(data.economicIntent, 'economicIntent', CONSTANTS.MAX_ECONOMIC_INTENT_LEN);
    }
    if (data.extendedMetadataUri !== undefined) {
      this.validateOptionalString(data.extendedMetadataUri, 'extendedMetadataUri', CONSTANTS.MAX_EXTENDED_METADATA_URI_LEN);
      if (data.extendedMetadataUri) {
        this.validateUrl(data.extendedMetadataUri, 'extendedMetadataUri', ['http:', 'https:', 'ipfs:', 'ar:']);
      }
    }

    if (data.serviceEndpoints !== undefined) {
      this.validateArrayLength(data.serviceEndpoints, CONSTANTS.MAX_SERVICE_ENDPOINTS, 'serviceEndpoints');
      data.serviceEndpoints.forEach((endpoint, index) => {
        this.validateServiceEndpoint(endpoint, index);
      });
    }

    if (data.supportedModes !== undefined) {
      this.validateArrayLength(data.supportedModes, CONSTANTS.MAX_SUPPORTED_MODES, 'supportedModes');
      data.supportedModes.forEach((mode, index) => {
        this.validateRequiredString(mode, `supportedModes[${index}]`, CONSTANTS.MAX_MODE_LEN);
      });
    }

    if (data.skills !== undefined) {
      this.validateArrayLength(data.skills, CONSTANTS.MAX_SKILLS, 'skills');
      data.skills.forEach((skill, index) => {
        this.validateAgentSkill(skill, index);
      });
    }

    if (data.tags !== undefined) {
      this.validateArrayLength(data.tags, CONSTANTS.MAX_AGENT_TAGS, 'tags');
      data.tags.forEach((tag, index) => {
        this.validateRequiredString(tag, `tags[${index}]`, CONSTANTS.MAX_AGENT_TAG_LEN);
      });
    }
  }

  /**
   * Validates MCP server registration data
   */
  static validateMcpServerRegistrationData(data: McpServerRegistrationData): void {
    // Basic required fields
    this.validateServerId(data.serverId);
    this.validateRequiredString(data.name, 'name', CONSTANTS.MAX_SERVER_NAME_LEN);
    this.validateRequiredString(data.version, 'version', CONSTANTS.MAX_SERVER_VERSION_LEN);
    this.validateRequiredString(data.endpointUrl, 'endpointUrl', CONSTANTS.MAX_SERVER_ENDPOINT_URL_LEN);
    this.validateRequiredString(data.capabilitiesSummary, 'capabilitiesSummary', CONSTANTS.MAX_SERVER_CAPABILITIES_SUMMARY_LEN);

    // Validate endpoint URL format
    this.validateUrl(data.endpointUrl, 'endpointUrl');

    // Optional fields
    this.validateOptionalString(data.fullCapabilitiesUri, 'fullCapabilitiesUri', CONSTANTS.MAX_FULL_CAPABILITIES_URI_LEN);
    if (data.fullCapabilitiesUri) {
      this.validateUrl(data.fullCapabilitiesUri, 'fullCapabilitiesUri', ['http:', 'https:', 'ipfs:', 'ar:']);
    }

    this.validateOptionalString(data.documentationUrl, 'documentationUrl', CONSTANTS.MAX_DOCUMENTATION_URL_LEN);
    if (data.documentationUrl) {
      this.validateUrl(data.documentationUrl, 'documentationUrl');
    }

    // Arrays
    this.validateArrayLength(data.onchainToolDefinitions, CONSTANTS.MAX_ONCHAIN_TOOL_DEFINITIONS, 'onchainToolDefinitions');
    data.onchainToolDefinitions.forEach((tool, index) => {
      this.validateMcpToolDefinition(tool, index);
    });

    this.validateArrayLength(data.onchainResourceDefinitions, CONSTANTS.MAX_ONCHAIN_RESOURCE_DEFINITIONS, 'onchainResourceDefinitions');
    data.onchainResourceDefinitions.forEach((resource, index) => {
      this.validateMcpResourceDefinition(resource, index);
    });

    this.validateArrayLength(data.onchainPromptDefinitions, CONSTANTS.MAX_ONCHAIN_PROMPT_DEFINITIONS, 'onchainPromptDefinitions');
    data.onchainPromptDefinitions.forEach((prompt, index) => {
      this.validateMcpPromptDefinition(prompt, index);
    });

    this.validateArrayLength(data.tags, CONSTANTS.MAX_SERVER_TAGS, 'tags');
    data.tags.forEach((tag, index) => {
      this.validateRequiredString(tag, `tags[${index}]`, CONSTANTS.MAX_SERVER_TAG_LEN);
    });
  }

  /**
   * Validates MCP server update data
   */
  static validateMcpServerUpdateData(data: McpServerUpdateData): void {
    // Validate only the fields that are provided
    if (data.name !== undefined) {
      this.validateRequiredString(data.name, 'name', CONSTANTS.MAX_SERVER_NAME_LEN);
    }
    if (data.version !== undefined) {
      this.validateRequiredString(data.version, 'version', CONSTANTS.MAX_SERVER_VERSION_LEN);
    }
    if (data.endpointUrl !== undefined) {
      this.validateRequiredString(data.endpointUrl, 'endpointUrl', CONSTANTS.MAX_SERVER_ENDPOINT_URL_LEN);
      this.validateUrl(data.endpointUrl, 'endpointUrl');
    }
    if (data.capabilitiesSummary !== undefined) {
      this.validateRequiredString(data.capabilitiesSummary, 'capabilitiesSummary', CONSTANTS.MAX_SERVER_CAPABILITIES_SUMMARY_LEN);
    }
    if (data.fullCapabilitiesUri !== undefined) {
      this.validateOptionalString(data.fullCapabilitiesUri, 'fullCapabilitiesUri', CONSTANTS.MAX_FULL_CAPABILITIES_URI_LEN);
      if (data.fullCapabilitiesUri) {
        this.validateUrl(data.fullCapabilitiesUri, 'fullCapabilitiesUri', ['http:', 'https:', 'ipfs:', 'ar:']);
      }
    }
    if (data.documentationUrl !== undefined) {
      this.validateOptionalString(data.documentationUrl, 'documentationUrl', CONSTANTS.MAX_DOCUMENTATION_URL_LEN);
      if (data.documentationUrl) {
        this.validateUrl(data.documentationUrl, 'documentationUrl');
      }
    }

    if (data.onchainToolDefinitions !== undefined) {
      this.validateArrayLength(data.onchainToolDefinitions, CONSTANTS.MAX_ONCHAIN_TOOL_DEFINITIONS, 'onchainToolDefinitions');
      data.onchainToolDefinitions.forEach((tool, index) => {
        this.validateMcpToolDefinition(tool, index);
      });
    }

    if (data.onchainResourceDefinitions !== undefined) {
      this.validateArrayLength(data.onchainResourceDefinitions, CONSTANTS.MAX_ONCHAIN_RESOURCE_DEFINITIONS, 'onchainResourceDefinitions');
      data.onchainResourceDefinitions.forEach((resource, index) => {
        this.validateMcpResourceDefinition(resource, index);
      });
    }

    if (data.onchainPromptDefinitions !== undefined) {
      this.validateArrayLength(data.onchainPromptDefinitions, CONSTANTS.MAX_ONCHAIN_PROMPT_DEFINITIONS, 'onchainPromptDefinitions');
      data.onchainPromptDefinitions.forEach((prompt, index) => {
        this.validateMcpPromptDefinition(prompt, index);
      });
    }

    if (data.tags !== undefined) {
      this.validateArrayLength(data.tags, CONSTANTS.MAX_SERVER_TAGS, 'tags');
      data.tags.forEach((tag, index) => {
        this.validateRequiredString(tag, `tags[${index}]`, CONSTANTS.MAX_SERVER_TAG_LEN);
      });
    }
  }
}