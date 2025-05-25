import { PublicKey } from '@solana/web3.js';

// Agent Types
export interface ServiceEndpoint {
  protocol: string;
  url: string;
  is_default: boolean;
}

export interface AgentSkill {
  id: string;
  name: string;
  description_hash?: number[];
  tags: string[];
}

export interface AgentRegistryEntry {
  agent_id: string;
  name: string;
  description: string;
  agent_version: string;
  owner_authority: PublicKey;
  provider_name?: string;
  provider_url?: string;
  documentation_url?: string;
  service_endpoints: ServiceEndpoint[];
  capabilities_flags: number;
  supported_input_modes: string[];
  supported_output_modes: string[];
  skills: AgentSkill[];
  security_info_uri?: string;
  aea_address?: PublicKey;
  economic_intent_summary?: string;
  supported_aea_protocols_hash?: number[];
  extended_metadata_uri?: string;
  tags: string[];
  status: number;
  registration_timestamp: number;
  last_update_timestamp: number;
}

// MCP Server Types
export interface McpToolDefinition {
  name: string;
  description_hash: number[];
  input_schema_hash: number[];
  output_schema_hash: number[];
  tags: string[];
}

export interface McpResourceDefinition {
  uri_pattern: string;
  description_hash: number[];
  tags: string[];
}

export interface McpPromptDefinition {
  name: string;
  description_hash: number[];
  tags: string[];
}

export interface McpServerRegistryEntry {
  server_id: string;
  name: string;
  server_version: string;
  owner_authority: PublicKey;
  service_endpoint: string;
  documentation_url?: string;
  server_capabilities_summary?: string;
  supports_resources: boolean;
  supports_tools: boolean;
  supports_prompts: boolean;
  onchain_tool_definitions: McpToolDefinition[];
  onchain_resource_definitions: McpResourceDefinition[];
  onchain_prompt_definitions: McpPromptDefinition[];
  full_capabilities_uri?: string;
  tags: string[];
  status: number;
  registration_timestamp: number;
  last_update_timestamp: number;
}

// Form Types
export interface AgentFormData {
  agent_id: string;
  name: string;
  description: string;
  agent_version: string;
  provider_name?: string;
  provider_url?: string;
  documentation_url?: string;
  service_endpoints: ServiceEndpoint[];
  capabilities_flags: number;
  supported_input_modes: string[];
  supported_output_modes: string[];
  skills: AgentSkill[];
  security_info_uri?: string;
  aea_address?: string;
  economic_intent_summary?: string;
  supported_aea_protocols_hash?: string;
  extended_metadata_uri?: string;
  tags: string[];
}

export interface McpServerFormData {
  server_id: string;
  name: string;
  server_version: string;
  service_endpoint: string;
  documentation_url?: string;
  server_capabilities_summary?: string;
  supports_resources: boolean;
  supports_tools: boolean;
  supports_prompts: boolean;
  onchain_tool_definitions: McpToolDefinition[];
  onchain_resource_definitions: McpResourceDefinition[];
  onchain_prompt_definitions: McpPromptDefinition[];
  full_capabilities_uri?: string;
  tags: string[];
}

// UI Types
export interface FilterOptions {
  status?: number;
  tags?: string[];
  search?: string;
  sortBy?: 'name' | 'date' | 'status';
  sortOrder?: 'asc' | 'desc';
}

export interface PaginationState {
  currentPage: number;
  totalPages: number;
  itemsPerPage: number;
  totalItems: number;
}