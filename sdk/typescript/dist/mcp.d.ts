import { PublicKey } from '@solana/web3.js';
import { SolanaClient } from './client.js';
import { McpServerRegistrationData, McpServerUpdateData, McpServerRegistryEntry, McpServerStatus, TransactionResult, ProgramAccount } from './types.js';
/**
 * MCP Server Registry API for managing Model Context Protocol servers
 */
export declare class McpAPI {
    private client;
    constructor(client: SolanaClient);
    /**
     * Register a new MCP server
     */
    registerServer(data: McpServerRegistrationData): Promise<TransactionResult>;
    /**
     * Update an existing MCP server
     */
    updateServer(serverId: string, data: McpServerUpdateData): Promise<TransactionResult>;
    /**
     * Deregister an MCP server
     */
    deregisterServer(serverId: string): Promise<TransactionResult>;
    /**
     * Get MCP server by ID
     */
    getServer(serverId: string): Promise<McpServerRegistryEntry>;
    /**
     * List MCP servers by owner
     */
    listServersByOwner(owner?: PublicKey): Promise<ProgramAccount<McpServerRegistryEntry>[]>;
    /**
     * List MCP servers by status
     */
    listServersByStatus(status: McpServerStatus): Promise<ProgramAccount<McpServerRegistryEntry>[]>;
    /**
     * Search MCP servers by capabilities
     */
    searchServersByCapabilities(keywords: string[]): Promise<ProgramAccount<McpServerRegistryEntry>[]>;
    /**
     * Search MCP servers by tags
     */
    searchServersByTags(tags: string[]): Promise<ProgramAccount<McpServerRegistryEntry>[]>;
    /**
     * Get servers that provide specific tools
     */
    getServersByTool(toolName: string): Promise<ProgramAccount<McpServerRegistryEntry>[]>;
    /**
     * Get servers that provide specific resources
     */
    getServersByResource(resourcePattern: string): Promise<ProgramAccount<McpServerRegistryEntry>[]>;
    /**
     * Get servers that provide specific prompts
     */
    getServersByPrompt(promptName: string): Promise<ProgramAccount<McpServerRegistryEntry>[]>;
    /**
     * Update server status (admin function)
     */
    updateServerStatus(serverId: string, status: McpServerStatus): Promise<TransactionResult>;
    /**
     * Get server PDA
     */
    private getServerPda;
    /**
     * Parse server account data
     */
    private parseServerAccount;
}
//# sourceMappingURL=mcp.d.ts.map