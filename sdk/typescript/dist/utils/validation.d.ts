import { PublicKey } from '@solana/web3.js';
import { AgentRegistrationData, AgentUpdateData, McpServerRegistrationData, McpServerUpdateData, AgentServiceEndpoint, AgentSkill, McpToolDefinition, McpResourceDefinition, McpPromptDefinition } from '../types.js';
/**
 * Validation utilities for SDK inputs
 */
export declare class Validator {
    /**
     * Validates string length
     */
    static validateStringLength(value: string, maxLength: number, fieldName: string): void;
    /**
     * Validates required string field
     */
    static validateRequiredString(value: string | undefined, fieldName: string, maxLength?: number): void;
    /**
     * Validates optional string field
     */
    static validateOptionalString(value: string | undefined, fieldName: string, maxLength: number): void;
    /**
     * Validates URL format
     */
    static validateUrl(url: string, fieldName: string, allowedProtocols?: string[]): void;
    /**
     * Validates array length
     */
    static validateArrayLength<T>(array: T[], maxLength: number, fieldName: string): void;
    /**
     * Validates PublicKey
     */
    static validatePublicKey(key: PublicKey | string, fieldName: string): PublicKey;
    /**
     * Validates agent ID format (alphanumeric, hyphens, underscores only)
     */
    static validateAgentId(agentId: string): void;
    /**
     * Validates server ID format (same as agent ID)
     */
    static validateServerId(serverId: string): void;
    /**
     * Validates service endpoint
     */
    static validateServiceEndpoint(endpoint: AgentServiceEndpoint, index: number): void;
    /**
     * Validates agent skill
     */
    static validateAgentSkill(skill: AgentSkill, index: number): void;
    /**
     * Validates MCP tool definition
     */
    static validateMcpToolDefinition(tool: McpToolDefinition, index: number): void;
    /**
     * Validates MCP resource definition
     */
    static validateMcpResourceDefinition(resource: McpResourceDefinition, index: number): void;
    /**
     * Validates MCP prompt definition
     */
    static validateMcpPromptDefinition(prompt: McpPromptDefinition, index: number): void;
    /**
     * Validates agent registration data
     */
    static validateAgentRegistrationData(data: AgentRegistrationData): void;
    /**
     * Validates agent update data
     */
    static validateAgentUpdateData(data: AgentUpdateData): void;
    /**
     * Validates MCP server registration data
     */
    static validateMcpServerRegistrationData(data: McpServerRegistrationData): void;
    /**
     * Validates MCP server update data
     */
    static validateMcpServerUpdateData(data: McpServerUpdateData): void;
}
//# sourceMappingURL=validation.d.ts.map