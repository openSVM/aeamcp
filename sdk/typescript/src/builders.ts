import {
  AgentRegistrationData,
  AgentServiceEndpoint,
  AgentSkill,
  McpServerRegistrationData,
  McpToolDefinition,
  McpResourceDefinition,
  McpPromptDefinition,
} from './types.js';
import { ValidationError } from './errors.js';
import { Validator } from './utils/validation.js';

/**
 * Builder for creating agent registration data (matches Rust AgentBuilder)
 */
export class AgentBuilder {
  private data: Partial<AgentRegistrationData>;

  constructor(agentId: string, name: string) {
    this.data = {
      agentId,
      name,
      description: '',
      version: '1.0.0',
      providerName: '',
      providerUrl: '',
      serviceEndpoints: [],
      supportedModes: [],
      skills: [],
      tags: [],
    };
  }

  /**
   * Create a new agent builder with required fields
   */
  static new(agentId: string, name: string): AgentBuilder {
    return new AgentBuilder(agentId, name);
  }

  /**
   * Set the agent description
   */
  description(description: string): AgentBuilder {
    this.data.description = description;
    return this;
  }

  /**
   * Set the agent version
   */
  version(version: string): AgentBuilder {
    this.data.version = version;
    return this;
  }

  /**
   * Set the provider name
   */
  providerName(providerName: string): AgentBuilder {
    this.data.providerName = providerName;
    return this;
  }

  /**
   * Set the provider URL
   */
  providerUrl(providerUrl: string): AgentBuilder {
    this.data.providerUrl = providerUrl;
    return this;
  }

  /**
   * Set the documentation URL
   */
  documentationUrl(documentationUrl: string): AgentBuilder {
    this.data.documentationUrl = documentationUrl;
    return this;
  }

  /**
   * Add a service endpoint
   */
  addServiceEndpoint(endpoint: AgentServiceEndpoint): AgentBuilder {
    if (!this.data.serviceEndpoints) {
      this.data.serviceEndpoints = [];
    }
    this.data.serviceEndpoints.push(endpoint);
    return this;
  }

  /**
   * Set service endpoints
   */
  serviceEndpoints(endpoints: AgentServiceEndpoint[]): AgentBuilder {
    this.data.serviceEndpoints = endpoints;
    return this;
  }

  /**
   * Add a supported mode
   */
  addSupportedMode(mode: string): AgentBuilder {
    if (!this.data.supportedModes) {
      this.data.supportedModes = [];
    }
    this.data.supportedModes.push(mode);
    return this;
  }

  /**
   * Set supported modes
   */
  supportedModes(modes: string[]): AgentBuilder {
    this.data.supportedModes = modes;
    return this;
  }

  /**
   * Add a skill
   */
  addSkill(skill: AgentSkill): AgentBuilder {
    if (!this.data.skills) {
      this.data.skills = [];
    }
    this.data.skills.push(skill);
    return this;
  }

  /**
   * Set skills
   */
  skills(skills: AgentSkill[]): AgentBuilder {
    this.data.skills = skills;
    return this;
  }

  /**
   * Set security info URI
   */
  securityInfoUri(securityInfoUri: string): AgentBuilder {
    this.data.securityInfoUri = securityInfoUri;
    return this;
  }

  /**
   * Set AEA address
   */
  aeaAddress(aeaAddress: string): AgentBuilder {
    this.data.aeaAddress = aeaAddress;
    return this;
  }

  /**
   * Set economic intent
   */
  economicIntent(economicIntent: string): AgentBuilder {
    this.data.economicIntent = economicIntent;
    return this;
  }

  /**
   * Set extended metadata URI
   */
  extendedMetadataUri(extendedMetadataUri: string): AgentBuilder {
    this.data.extendedMetadataUri = extendedMetadataUri;
    return this;
  }

  /**
   * Add a tag
   */
  addTag(tag: string): AgentBuilder {
    if (!this.data.tags) {
      this.data.tags = [];
    }
    this.data.tags.push(tag);
    return this;
  }

  /**
   * Set tags
   */
  tags(tags: string[]): AgentBuilder {
    this.data.tags = tags;
    return this;
  }

  /**
   * Build and validate the agent registration data
   */
  build(): AgentRegistrationData {
    // Ensure required fields are set
    if (!this.data.agentId || !this.data.name || !this.data.description || 
        !this.data.version || !this.data.providerName || !this.data.providerUrl ||
        !this.data.serviceEndpoints || !this.data.supportedModes || 
        !this.data.skills || !this.data.tags) {
      throw new ValidationError('Missing required fields for agent registration');
    }

    const agentData = this.data as AgentRegistrationData;
    
    // Validate the data
    Validator.validateAgentRegistrationData(agentData);
    
    return agentData;
  }
}

/**
 * Builder for creating MCP server registration data (matches Rust McpServerBuilder)
 */
export class McpServerBuilder {
  private data: Partial<McpServerRegistrationData>;

  constructor(serverId: string, name: string, endpointUrl: string) {
    this.data = {
      serverId,
      name,
      version: '1.0.0',
      endpointUrl,
      capabilitiesSummary: '',
      onchainToolDefinitions: [],
      onchainResourceDefinitions: [],
      onchainPromptDefinitions: [],
      tags: [],
    };
  }

  /**
   * Create a new MCP server builder with required fields
   */
  static new(serverId: string, name: string, endpointUrl: string): McpServerBuilder {
    return new McpServerBuilder(serverId, name, endpointUrl);
  }

  /**
   * Set the server version
   */
  version(version: string): McpServerBuilder {
    this.data.version = version;
    return this;
  }

  /**
   * Set the capabilities summary
   */
  capabilitiesSummary(capabilitiesSummary: string): McpServerBuilder {
    this.data.capabilitiesSummary = capabilitiesSummary;
    return this;
  }

  /**
   * Add a tool definition
   */
  addToolDefinition(tool: McpToolDefinition): McpServerBuilder {
    if (!this.data.onchainToolDefinitions) {
      this.data.onchainToolDefinitions = [];
    }
    this.data.onchainToolDefinitions.push(tool);
    return this;
  }

  /**
   * Set tool definitions
   */
  toolDefinitions(tools: McpToolDefinition[]): McpServerBuilder {
    this.data.onchainToolDefinitions = tools;
    return this;
  }

  /**
   * Add a resource definition
   */
  addResourceDefinition(resource: McpResourceDefinition): McpServerBuilder {
    if (!this.data.onchainResourceDefinitions) {
      this.data.onchainResourceDefinitions = [];
    }
    this.data.onchainResourceDefinitions.push(resource);
    return this;
  }

  /**
   * Set resource definitions
   */
  resourceDefinitions(resources: McpResourceDefinition[]): McpServerBuilder {
    this.data.onchainResourceDefinitions = resources;
    return this;
  }

  /**
   * Add a prompt definition
   */
  addPromptDefinition(prompt: McpPromptDefinition): McpServerBuilder {
    if (!this.data.onchainPromptDefinitions) {
      this.data.onchainPromptDefinitions = [];
    }
    this.data.onchainPromptDefinitions.push(prompt);
    return this;
  }

  /**
   * Set prompt definitions
   */
  promptDefinitions(prompts: McpPromptDefinition[]): McpServerBuilder {
    this.data.onchainPromptDefinitions = prompts;
    return this;
  }

  /**
   * Set full capabilities URI
   */
  fullCapabilitiesUri(fullCapabilitiesUri: string): McpServerBuilder {
    this.data.fullCapabilitiesUri = fullCapabilitiesUri;
    return this;
  }

  /**
   * Set documentation URL
   */
  documentationUrl(documentationUrl: string): McpServerBuilder {
    this.data.documentationUrl = documentationUrl;
    return this;
  }

  /**
   * Add a tag
   */
  addTag(tag: string): McpServerBuilder {
    if (!this.data.tags) {
      this.data.tags = [];
    }
    this.data.tags.push(tag);
    return this;
  }

  /**
   * Set tags
   */
  tags(tags: string[]): McpServerBuilder {
    this.data.tags = tags;
    return this;
  }

  /**
   * Build and validate the MCP server registration data
   */
  build(): McpServerRegistrationData {
    // Ensure required fields are set
    if (!this.data.serverId || !this.data.name || !this.data.version || 
        !this.data.endpointUrl || this.data.capabilitiesSummary === undefined ||
        !this.data.onchainToolDefinitions || !this.data.onchainResourceDefinitions ||
        !this.data.onchainPromptDefinitions || !this.data.tags) {
      throw new ValidationError('Missing required fields for MCP server registration');
    }

    const serverData = this.data as McpServerRegistrationData;
    
    // Validate the data
    Validator.validateMcpServerRegistrationData(serverData);
    
    return serverData;
  }
}