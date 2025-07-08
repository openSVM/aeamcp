import { PublicKey, Transaction } from '@solana/web3.js';
import { SolanaClient } from './client.js';
import {
  McpServerRegistrationData,
  McpServerUpdateData,
  McpServerRegistryEntry,
  McpServerStatus,
  TransactionResult,
  ProgramAccount,
  A2AMPLAmount,
  CONSTANTS,
} from './types.js';
import { Validator } from './utils/validation.js';
import { RegistryError, ValidationError, AccountError } from './errors.js';

/**
 * MCP Server Registry API for managing Model Context Protocol servers
 */
export class McpAPI {
  constructor(private client: SolanaClient) {}

  /**
   * Register a new MCP server
   */
  async registerServer(data: McpServerRegistrationData): Promise<TransactionResult> {
    // Validate input data
    Validator.validateMcpServerRegistrationData(data);

    try {
      const program = this.client.getMcpRegistryProgram();
      const provider = this.client.getProvider();

      // Derive PDA for server account
      const [serverPda] = PublicKey.findProgramAddressSync(
        [
          Buffer.from(CONSTANTS.MCP_SERVER_REGISTRY_PDA_SEED),
          Buffer.from(data.serverId),
          provider.wallet.publicKey.toBuffer(),
        ],
        program.programId
      );

      // Check if server already exists
      if (await this.client.accountExists(serverPda)) {
        throw new RegistryError(`MCP server with ID '${data.serverId}' already exists`);
      }

      // Calculate registration fee
      const registrationFee = CONSTANTS.MCP_REGISTRATION_FEE;

      // Build registration instruction
      const registerInstruction = await program.methods
        .registerServer({
          serverId: data.serverId,
          name: data.name,
          version: data.version,
          endpointUrl: data.endpointUrl,
          capabilitiesSummary: data.capabilitiesSummary,
          onchainToolDefinitions: data.onchainToolDefinitions,
          onchainResourceDefinitions: data.onchainResourceDefinitions,
          onchainPromptDefinitions: data.onchainPromptDefinitions,
          fullCapabilitiesUri: data.fullCapabilitiesUri,
          documentationUrl: data.documentationUrl,
          tags: data.tags,
        })
        .accounts({
          serverAccount: serverPda,
          owner: provider.wallet.publicKey,
          systemProgram: PublicKey.default, // SystemProgram.programId
        })
        .instruction();

      const transaction = new Transaction().add(registerInstruction);
      return await this.client.sendAndConfirmTransaction(transaction);
    } catch (error) {
      throw new RegistryError(
        `Failed to register MCP server: ${error instanceof Error ? error.message : 'Unknown error'}`,
        undefined,
        undefined,
        error instanceof Error ? error : undefined
      );
    }
  }

  /**
   * Update an existing MCP server
   */
  async updateServer(serverId: string, data: McpServerUpdateData): Promise<TransactionResult> {
    // Validate inputs
    Validator.validateServerId(serverId);
    Validator.validateMcpServerUpdateData(data);

    try {
      const program = this.client.getMcpRegistryProgram();
      const provider = this.client.getProvider();

      // Derive PDA for server account
      const [serverPda] = PublicKey.findProgramAddressSync(
        [
          Buffer.from(CONSTANTS.MCP_SERVER_REGISTRY_PDA_SEED),
          Buffer.from(serverId),
          provider.wallet.publicKey.toBuffer(),
        ],
        program.programId
      );

      // Check if server exists
      if (!(await this.client.accountExists(serverPda))) {
        throw new RegistryError(`MCP server with ID '${serverId}' not found`);
      }

      // Get current server data for version checking
      const currentServer = await this.getServer(serverId);

      // Build update instruction
      const updateInstruction = await program.methods
        .updateServer({
          name: data.name,
          version: data.version,
          endpointUrl: data.endpointUrl,
          capabilitiesSummary: data.capabilitiesSummary,
          onchainToolDefinitions: data.onchainToolDefinitions,
          onchainResourceDefinitions: data.onchainResourceDefinitions,
          onchainPromptDefinitions: data.onchainPromptDefinitions,
          fullCapabilitiesUri: data.fullCapabilitiesUri,
          documentationUrl: data.documentationUrl,
          tags: data.tags,
          expectedStateVersion: currentServer.stateVersion,
        })
        .accounts({
          serverAccount: serverPda,
          owner: provider.wallet.publicKey,
        })
        .instruction();

      const transaction = new Transaction().add(updateInstruction);
      return await this.client.sendAndConfirmTransaction(transaction);
    } catch (error) {
      throw new RegistryError(
        `Failed to update MCP server: ${error instanceof Error ? error.message : 'Unknown error'}`,
        undefined,
        undefined,
        error instanceof Error ? error : undefined
      );
    }
  }

  /**
   * Deregister an MCP server
   */
  async deregisterServer(serverId: string): Promise<TransactionResult> {
    Validator.validateServerId(serverId);

    try {
      const program = this.client.getMcpRegistryProgram();
      const provider = this.client.getProvider();

      // Derive PDA for server account
      const [serverPda] = PublicKey.findProgramAddressSync(
        [
          Buffer.from(CONSTANTS.MCP_SERVER_REGISTRY_PDA_SEED),
          Buffer.from(serverId),
          provider.wallet.publicKey.toBuffer(),
        ],
        program.programId
      );

      // Check if server exists
      if (!(await this.client.accountExists(serverPda))) {
        throw new RegistryError(`MCP server with ID '${serverId}' not found`);
      }

      const deregisterInstruction = await program.methods
        .deregisterServer()
        .accounts({
          serverAccount: serverPda,
          owner: provider.wallet.publicKey,
        })
        .instruction();

      const transaction = new Transaction().add(deregisterInstruction);
      return await this.client.sendAndConfirmTransaction(transaction);
    } catch (error) {
      throw new RegistryError(
        `Failed to deregister MCP server: ${error instanceof Error ? error.message : 'Unknown error'}`,
        undefined,
        undefined,
        error instanceof Error ? error : undefined
      );
    }
  }

  /**
   * Get MCP server by ID
   */
  async getServer(serverId: string): Promise<McpServerRegistryEntry> {
    Validator.validateServerId(serverId);

    try {
      const program = this.client.getMcpRegistryProgram();
      const provider = this.client.getProvider();

      // Derive PDA for server account
      const [serverPda] = PublicKey.findProgramAddressSync(
        [
          Buffer.from(CONSTANTS.MCP_SERVER_REGISTRY_PDA_SEED),
          Buffer.from(serverId),
          provider.wallet.publicKey.toBuffer(),
        ],
        program.programId
      );

      const account = await program.account.mcpServerRegistryEntryV1.fetch(serverPda);
      
      return this.parseServerAccount(account, serverPda);
    } catch (error) {
      throw new AccountError(
        `Failed to get MCP server '${serverId}': ${error instanceof Error ? error.message : 'Server not found'}`,
        error instanceof Error ? error : undefined
      );
    }
  }

  /**
   * List MCP servers by owner
   */
  async listServersByOwner(owner?: PublicKey): Promise<ProgramAccount<McpServerRegistryEntry>[]> {
    try {
      const program = this.client.getMcpRegistryProgram();
      const provider = this.client.getProvider();
      const targetOwner = owner || provider.wallet.publicKey;

      const accounts = await program.account.mcpServerRegistryEntryV1.all([
        {
          memcmp: {
            offset: 8 + 32, // discriminator + serverId offset
            bytes: targetOwner.toBase58(),
          },
        },
      ]);

      return accounts.map(account => ({
        publicKey: account.publicKey,
        account: this.parseServerAccount(account.account, account.publicKey),
      }));
    } catch (error) {
      throw new AccountError(
        `Failed to list MCP servers: ${error instanceof Error ? error.message : 'Unknown error'}`,
        error instanceof Error ? error : undefined
      );
    }
  }

  /**
   * List MCP servers by status
   */
  async listServersByStatus(status: McpServerStatus): Promise<ProgramAccount<McpServerRegistryEntry>[]> {
    try {
      const program = this.client.getMcpRegistryProgram();

      const accounts = await program.account.mcpServerRegistryEntryV1.all([
        {
          memcmp: {
            offset: 8 + 64 + 128 + 32, // approximate offset to status field
            bytes: Buffer.from([status]).toString('base64'),
          },
        },
      ]);

      return accounts.map(account => ({
        publicKey: account.publicKey,
        account: this.parseServerAccount(account.account, account.publicKey),
      }));
    } catch (error) {
      throw new AccountError(
        `Failed to list MCP servers by status: ${error instanceof Error ? error.message : 'Unknown error'}`,
        error instanceof Error ? error : undefined
      );
    }
  }

  /**
   * Search MCP servers by capabilities
   */
  async searchServersByCapabilities(keywords: string[]): Promise<ProgramAccount<McpServerRegistryEntry>[]> {
    try {
      const program = this.client.getMcpRegistryProgram();
      
      // Get all servers (in a real implementation, this would be more efficient)
      const allServers = await program.account.mcpServerRegistryEntryV1.all();

      // Filter by capabilities keywords
      const filteredServers = allServers.filter(account => {
        const server = this.parseServerAccount(account.account, account.publicKey);
        const searchText = `${server.capabilitiesSummary} ${server.tags.join(' ')}`.toLowerCase();
        return keywords.some(keyword => searchText.includes(keyword.toLowerCase()));
      });

      return filteredServers.map(account => ({
        publicKey: account.publicKey,
        account: this.parseServerAccount(account.account, account.publicKey),
      }));
    } catch (error) {
      throw new AccountError(
        `Failed to search MCP servers by capabilities: ${error instanceof Error ? error.message : 'Unknown error'}`,
        error instanceof Error ? error : undefined
      );
    }
  }

  /**
   * Search MCP servers by tags
   */
  async searchServersByTags(tags: string[]): Promise<ProgramAccount<McpServerRegistryEntry>[]> {
    try {
      const program = this.client.getMcpRegistryProgram();
      
      // Get all servers (in a real implementation, this would be more efficient)
      const allServers = await program.account.mcpServerRegistryEntryV1.all();

      // Filter by tags
      const filteredServers = allServers.filter(account => {
        const server = this.parseServerAccount(account.account, account.publicKey);
        return tags.some(tag => server.tags.includes(tag));
      });

      return filteredServers.map(account => ({
        publicKey: account.publicKey,
        account: this.parseServerAccount(account.account, account.publicKey),
      }));
    } catch (error) {
      throw new AccountError(
        `Failed to search MCP servers by tags: ${error instanceof Error ? error.message : 'Unknown error'}`,
        error instanceof Error ? error : undefined
      );
    }
  }

  /**
   * Get servers that provide specific tools
   */
  async getServersByTool(toolName: string): Promise<ProgramAccount<McpServerRegistryEntry>[]> {
    try {
      const program = this.client.getMcpRegistryProgram();
      
      // Get all servers
      const allServers = await program.account.mcpServerRegistryEntryV1.all();

      // Filter by tool definitions
      const filteredServers = allServers.filter(account => {
        const server = this.parseServerAccount(account.account, account.publicKey);
        return server.onchainToolDefinitions.some(tool => 
          tool.name.toLowerCase().includes(toolName.toLowerCase())
        );
      });

      return filteredServers.map(account => ({
        publicKey: account.publicKey,
        account: this.parseServerAccount(account.account, account.publicKey),
      }));
    } catch (error) {
      throw new AccountError(
        `Failed to get servers by tool: ${error instanceof Error ? error.message : 'Unknown error'}`,
        error instanceof Error ? error : undefined
      );
    }
  }

  /**
   * Get servers that provide specific resources
   */
  async getServersByResource(resourcePattern: string): Promise<ProgramAccount<McpServerRegistryEntry>[]> {
    try {
      const program = this.client.getMcpRegistryProgram();
      
      // Get all servers
      const allServers = await program.account.mcpServerRegistryEntryV1.all();

      // Filter by resource definitions
      const filteredServers = allServers.filter(account => {
        const server = this.parseServerAccount(account.account, account.publicKey);
        return server.onchainResourceDefinitions.some(resource => 
          resource.uriPattern.toLowerCase().includes(resourcePattern.toLowerCase())
        );
      });

      return filteredServers.map(account => ({
        publicKey: account.publicKey,
        account: this.parseServerAccount(account.account, account.publicKey),
      }));
    } catch (error) {
      throw new AccountError(
        `Failed to get servers by resource: ${error instanceof Error ? error.message : 'Unknown error'}`,
        error instanceof Error ? error : undefined
      );
    }
  }

  /**
   * Get servers that provide specific prompts
   */
  async getServersByPrompt(promptName: string): Promise<ProgramAccount<McpServerRegistryEntry>[]> {
    try {
      const program = this.client.getMcpRegistryProgram();
      
      // Get all servers
      const allServers = await program.account.mcpServerRegistryEntryV1.all();

      // Filter by prompt definitions
      const filteredServers = allServers.filter(account => {
        const server = this.parseServerAccount(account.account, account.publicKey);
        return server.onchainPromptDefinitions.some(prompt => 
          prompt.name.toLowerCase().includes(promptName.toLowerCase())
        );
      });

      return filteredServers.map(account => ({
        publicKey: account.publicKey,
        account: this.parseServerAccount(account.account, account.publicKey),
      }));
    } catch (error) {
      throw new AccountError(
        `Failed to get servers by prompt: ${error instanceof Error ? error.message : 'Unknown error'}`,
        error instanceof Error ? error : undefined
      );
    }
  }

  /**
   * Update server status (admin function)
   */
  async updateServerStatus(serverId: string, status: McpServerStatus): Promise<TransactionResult> {
    Validator.validateServerId(serverId);

    try {
      const program = this.client.getMcpRegistryProgram();
      const provider = this.client.getProvider();

      // Derive PDA for server account
      const [serverPda] = PublicKey.findProgramAddressSync(
        [
          Buffer.from(CONSTANTS.MCP_SERVER_REGISTRY_PDA_SEED),
          Buffer.from(serverId),
          provider.wallet.publicKey.toBuffer(),
        ],
        program.programId
      );

      const updateStatusInstruction = await program.methods
        .updateServerStatus(status)
        .accounts({
          serverAccount: serverPda,
          authority: provider.wallet.publicKey, // Assuming authority check
        })
        .instruction();

      const transaction = new Transaction().add(updateStatusInstruction);
      return await this.client.sendAndConfirmTransaction(transaction);
    } catch (error) {
      throw new RegistryError(
        `Failed to update server status: ${error instanceof Error ? error.message : 'Unknown error'}`,
        undefined,
        undefined,
        error instanceof Error ? error : undefined
      );
    }
  }

  /**
   * Get server PDA
   */
  private async getServerPda(serverId: string): Promise<PublicKey> {
    const program = this.client.getMcpRegistryProgram();
    const provider = this.client.getProvider();

    const [serverPda] = PublicKey.findProgramAddressSync(
      [
        Buffer.from(CONSTANTS.MCP_SERVER_REGISTRY_PDA_SEED),
        Buffer.from(serverId),
        provider.wallet.publicKey.toBuffer(),
      ],
      program.programId
    );

    return serverPda;
  }

  /**
   * Parse server account data
   */
  private parseServerAccount(account: any, publicKey: PublicKey): McpServerRegistryEntry {
    // This would parse the actual account data structure
    // For now, return a mock structure
    return {
      serverId: account.serverId || 'unknown',
      name: account.name || 'Unknown Server',
      version: account.version || '1.0.0',
      status: account.status || McpServerStatus.Pending,
      owner: account.owner || PublicKey.default,
      registrationSlot: BigInt(account.registrationSlot || 0),
      lastUpdateSlot: BigInt(account.lastUpdateSlot || 0),
      endpointUrl: account.endpointUrl || '',
      capabilitiesSummary: account.capabilitiesSummary || '',
      onchainToolDefinitions: account.onchainToolDefinitions || [],
      onchainResourceDefinitions: account.onchainResourceDefinitions || [],
      onchainPromptDefinitions: account.onchainPromptDefinitions || [],
      fullCapabilitiesUri: account.fullCapabilitiesUri,
      documentationUrl: account.documentationUrl,
      tags: account.tags || [],
      stateVersion: BigInt(account.stateVersion || 0),
    };
  }
}