import { 
  Connection, 
  PublicKey, 
  Transaction, 
  TransactionInstruction,
  SystemProgram,
  SYSVAR_RENT_PUBKEY
} from '@solana/web3.js';
import { 
  AGENT_REGISTRY_PROGRAM_ID, 
  MCP_SERVER_REGISTRY_PROGRAM_ID,
  AGENT_REGISTRY_PDA_SEED,
  MCP_SERVER_REGISTRY_PDA_SEED,
  RPC_ENDPOINT 
} from '@/lib/constants';
import { getAgentPDA, getMcpServerPDA } from './utils';

// Agent Registration Data Structure
export interface AgentRegistrationData {
  agentId: string;
  name: string;
  description: string;
  version: string;
  providerName: string;
  providerUrl: string;
  documentationUrl: string;
  serviceEndpoints: Array<{
    protocol: string;
    url: string;
  }>;
  supportedModes: string[];
  skills: Array<{
    skillId: string;
    name: string;
    tags: string[];
  }>;
  securityInfoUri: string;
  aeaAddress: string;
  economicIntent: string;
  extendedMetadataUri: string;
  tags: string[];
}

// MCP Server Registration Data Structure
export interface McpServerRegistrationData {
  serverId: string;
  name: string;
  description: string;
  version: string;
  providerName: string;
  providerUrl: string;
  documentationUrl: string;
  endpointUrl: string;
  capabilitiesSummary: string;
  toolDefinitions: Array<{
    name: string;
    tags: string[];
  }>;
  resourceDefinitions: Array<{
    uriPattern: string;
    tags: string[];
  }>;
  promptDefinitions: Array<{
    name: string;
    tags: string[];
  }>;
  fullCapabilitiesUri: string;
  tags: string[];
}

// Registry Service Class
export class RegistryService {
  public connection: Connection; // Changed to public

  constructor() {
    this.connection = new Connection(RPC_ENDPOINT, 'confirmed');
  }

  /**
   * Register an AI Agent on the Solana blockchain
   */
  async registerAgent(
    data: AgentRegistrationData,
    walletPublicKey: PublicKey
  ): Promise<Transaction> {
    try {
      // Get the PDA for this agent
      const [agentPDA] = getAgentPDA(data.agentId);

      // Create the instruction data buffer
      const instructionData = this.serializeAgentData(data);

      // Create the register agent instruction
      const instruction = new TransactionInstruction({
        keys: [
          {
            pubkey: agentPDA,
            isSigner: false,
            isWritable: true,
          },
          {
            pubkey: walletPublicKey,
            isSigner: true,
            isWritable: true,
          },
          {
            pubkey: SystemProgram.programId,
            isSigner: false,
            isWritable: false,
          },
          {
            pubkey: SYSVAR_RENT_PUBKEY,
            isSigner: false,
            isWritable: false,
          },
        ],
        programId: AGENT_REGISTRY_PROGRAM_ID,
        data: instructionData,
      });

      // Create and return the transaction
      const transaction = new Transaction().add(instruction);
      transaction.feePayer = walletPublicKey;
      
      // Get recent blockhash
      const { blockhash } = await this.connection.getLatestBlockhash();
      transaction.recentBlockhash = blockhash;

      return transaction;
    } catch (error) {
      console.error('Error creating agent registration transaction:', error);
      throw new Error('Failed to create agent registration transaction');
    }
  }

  /**
   * Register an MCP Server on the Solana blockchain
   */
  async registerMcpServer(
    data: McpServerRegistrationData,
    walletPublicKey: PublicKey
  ): Promise<Transaction> {
    try {
      // Get the PDA for this MCP server
      const [serverPDA] = getMcpServerPDA(data.serverId);

      // Create the instruction data buffer
      const instructionData = this.serializeMcpServerData(data);

      // Create the register MCP server instruction
      const instruction = new TransactionInstruction({
        keys: [
          {
            pubkey: serverPDA,
            isSigner: false,
            isWritable: true,
          },
          {
            pubkey: walletPublicKey,
            isSigner: true,
            isWritable: true,
          },
          {
            pubkey: SystemProgram.programId,
            isSigner: false,
            isWritable: false,
          },
          {
            pubkey: SYSVAR_RENT_PUBKEY,
            isSigner: false,
            isWritable: false,
          },
        ],
        programId: MCP_SERVER_REGISTRY_PROGRAM_ID,
        data: instructionData,
      });

      // Create and return the transaction
      const transaction = new Transaction().add(instruction);
      transaction.feePayer = walletPublicKey;
      
      // Get recent blockhash
      const { blockhash } = await this.connection.getLatestBlockhash();
      transaction.recentBlockhash = blockhash;

      return transaction;
    } catch (error) {
      console.error('Error creating MCP server registration transaction:', error);
      throw new Error('Failed to create MCP server registration transaction');
    }
  }

  /**
   * Get agent data from the blockchain
   */
  async getAgent(agentId: string): Promise<any> {
    try {
      const [agentPDA] = getAgentPDA(agentId);
      const accountInfo = await this.connection.getAccountInfo(agentPDA);
      
      if (!accountInfo) {
        return null;
      }

      // TODO: Deserialize the account data based on the Rust struct
      return this.deserializeAgentData(accountInfo.data);
    } catch (error) {
      console.error('Error fetching agent data:', error);
      return null;
    }
  }

  /**
   * Get MCP server data from the blockchain
   */
  async getMcpServer(serverId: string): Promise<any> {
    try {
      const [serverPDA] = getMcpServerPDA(serverId);
      const accountInfo = await this.connection.getAccountInfo(serverPDA);
      
      if (!accountInfo) {
        return null;
      }

      // TODO: Deserialize the account data based on the Rust struct
      return this.deserializeMcpServerData(accountInfo.data);
    } catch (error) {
      console.error('Error fetching MCP server data:', error);
      return null;
    }
  }

  /**
   * Get all registered agents (paginated)
   */
  async getAllAgents(limit: number = 50, offset: number = 0): Promise<any[]> {
    try {
      // Get all program accounts for the agent registry
      const accounts = await this.connection.getProgramAccounts(
        AGENT_REGISTRY_PROGRAM_ID,
        {
          filters: [
            {
              dataSize: 1000, // Approximate size, adjust based on actual struct size
            },
          ],
        }
      );

      // Deserialize and return the data
      return accounts
        .slice(offset, offset + limit)
        .map(account => this.deserializeAgentData(account.account.data))
        .filter(data => data !== null);
    } catch (error) {
      console.error('Error fetching all agents:', error);
      return [];
    }
  }

  /**
   * Get all registered MCP servers (paginated)
   */
  async getAllMcpServers(limit: number = 50, offset: number = 0): Promise<any[]> {
    try {
      // Get all program accounts for the MCP server registry
      const accounts = await this.connection.getProgramAccounts(
        MCP_SERVER_REGISTRY_PROGRAM_ID,
        {
          filters: [
            {
              dataSize: 1000, // Approximate size, adjust based on actual struct size
            },
          ],
        }
      );

      // Deserialize and return the data
      return accounts
        .slice(offset, offset + limit)
        .map(account => this.deserializeMcpServerData(account.account.data))
        .filter(data => data !== null);
    } catch (error) {
      console.error('Error fetching all MCP servers:', error);
      return [];
    }
  }

  /**
   * Serialize agent data for blockchain storage
   * This is a simplified version - in production, you'd use proper Borsh serialization
   */
  private serializeAgentData(data: AgentRegistrationData): Buffer {
    // Instruction discriminator (0 for RegisterAgent)
    const discriminator = Buffer.from([0]);
    
    // Serialize the data (simplified - use proper Borsh in production)
    const agentIdBuffer = Buffer.from(data.agentId);
    const nameBuffer = Buffer.from(data.name);
    const descriptionBuffer = Buffer.from(data.description);
    const versionBuffer = Buffer.from(data.version);
    
    // For now, return a simple concatenation
    // In production, implement proper Borsh serialization matching the Rust struct
    return Buffer.concat([
      discriminator,
      Buffer.from([agentIdBuffer.length]),
      agentIdBuffer,
      Buffer.from([nameBuffer.length]),
      nameBuffer,
      Buffer.from([descriptionBuffer.length]),
      descriptionBuffer,
      Buffer.from([versionBuffer.length]),
      versionBuffer,
    ]);
  }

  /**
   * Serialize MCP server data for blockchain storage
   */
  private serializeMcpServerData(data: McpServerRegistrationData): Buffer {
    // Instruction discriminator (0 for RegisterMcpServer)
    const discriminator = Buffer.from([0]);
    
    // Serialize the data (simplified - use proper Borsh in production)
    const serverIdBuffer = Buffer.from(data.serverId);
    const nameBuffer = Buffer.from(data.name);
    const descriptionBuffer = Buffer.from(data.description);
    const versionBuffer = Buffer.from(data.version);
    
    // For now, return a simple concatenation
    return Buffer.concat([
      discriminator,
      Buffer.from([serverIdBuffer.length]),
      serverIdBuffer,
      Buffer.from([nameBuffer.length]),
      nameBuffer,
      Buffer.from([descriptionBuffer.length]),
      descriptionBuffer,
      Buffer.from([versionBuffer.length]),
      versionBuffer,
    ]);
  }

  /**
   * Deserialize agent data from blockchain
   */
  private deserializeAgentData(data: Buffer): any {
    try {
      // TODO: Implement proper Borsh deserialization matching the Rust struct
      // This is a placeholder implementation
      return {
        agentId: 'placeholder',
        name: 'Placeholder Agent',
        description: 'This is placeholder data',
        version: '1.0.0',
        status: 'Active',
      };
    } catch (error) {
      console.error('Error deserializing agent data:', error);
      return null;
    }
  }

  /**
   * Deserialize MCP server data from blockchain
   */
  private deserializeMcpServerData(data: Buffer): any {
    try {
      // TODO: Implement proper Borsh deserialization matching the Rust struct
      // This is a placeholder implementation
      return {
        serverId: 'placeholder',
        name: 'Placeholder Server',
        description: 'This is placeholder data',
        version: '1.0.0',
        status: 'Active',
      };
    } catch (error) {
      console.error('Error deserializing MCP server data:', error);
      return null;
    }
  }

  /**
   * Check if an agent ID is already taken
   */
  async isAgentIdTaken(agentId: string): Promise<boolean> {
    try {
      const agent = await this.getAgent(agentId);
      return agent !== null;
    } catch (error) {
      console.error('Error checking agent ID availability:', error);
      return false;
    }
  }

  /**
   * Check if a server ID is already taken
   */
  async isServerIdTaken(serverId: string): Promise<boolean> {
    try {
      const server = await this.getMcpServer(serverId);
      return server !== null;
    } catch (error) {
      console.error('Error checking server ID availability:', error);
      return false;
    }
  }

  /**
   * Estimate transaction fee for agent registration
   */
  async estimateAgentRegistrationFee(): Promise<number> {
    try {
      // Get recent blockhash for fee calculation
      const { feeCalculator } = await this.connection.getRecentBlockhash();
      
      // Estimate based on typical transaction size
      // Agent registration typically requires ~1000 bytes
      const estimatedSize = 1000;
      return feeCalculator.lamportsPerSignature * 2; // Base fee + some buffer
    } catch (error) {
      console.error('Error estimating registration fee:', error);
      return 5000; // Default fallback fee in lamports
    }
  }

  /**
   * Estimate transaction fee for MCP server registration
   */
  async estimateMcpServerRegistrationFee(): Promise<number> {
    try {
      // Get recent blockhash for fee calculation
      const { feeCalculator } = await this.connection.getRecentBlockhash();
      
      // Estimate based on typical transaction size
      const estimatedSize = 1200; // MCP servers typically have more data
      return feeCalculator.lamportsPerSignature * 2;
    } catch (error) {
      console.error('Error estimating registration fee:', error);
      return 5000; // Default fallback fee in lamports
    }
  }
}

// Export a singleton instance
export const registryService = new RegistryService();
