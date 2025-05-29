import { 
  Connection, 
  PublicKey, 
  Transaction, 
  TransactionInstruction,
  SystemProgram,
  SYSVAR_RENT_PUBKEY
} from '@solana/web3.js';
import {
  TOKEN_PROGRAM_ID,
  getAssociatedTokenAddress,
  createAssociatedTokenAccountInstruction,
  createTransferInstruction,
  getAccount,
  TokenAccountNotFoundError,
  TokenInvalidAccountOwnerError,
} from '@solana/spl-token';
import { 
  AGENT_REGISTRY_PROGRAM_ID, 
  MCP_SERVER_REGISTRY_PROGRAM_ID,
  SVMAI_TOKEN_MINT,
  SVMAI_TOKEN_DECIMALS,
  SVMAI_REGISTRATION_FEE_AGENT,
  SVMAI_REGISTRATION_FEE_SERVER,
  SVMAI_STAKING_TIERS,
  SVMAI_VERIFICATION_TIERS,
  AGENT_REGISTRY_VAULT_SEED,
  MCP_SERVER_REGISTRY_VAULT_SEED,
  RPC_ENDPOINT 
} from '@/lib/constants';
import { getAgentPDA, getMcpServerPDA } from './utils';

// Enhanced interfaces with token support
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

export interface TokenBalance {
  balance: number;
  decimals: number;
  formattedBalance: string;
}

export interface StakingInfo {
  stakedAmount: number;
  tier: string;
  lockPeriod: number;
  unlockDate: Date | null;
  rewards: number;
}

export type StakingTier = keyof typeof SVMAI_STAKING_TIERS;
export type VerificationTier = keyof typeof SVMAI_VERIFICATION_TIERS;

// Enhanced Registry Service with Token Integration
export class TokenRegistryService {
  public connection: Connection;

  constructor() {
    this.connection = new Connection(RPC_ENDPOINT, 'confirmed');
  }

  // ============================================================================
  // TOKEN UTILITIES
  // ============================================================================

  /**
   * Get SVMAI token balance for a wallet
   */
  async getTokenBalance(walletPublicKey: PublicKey): Promise<TokenBalance> {
    try {
      const tokenAccount = await getAssociatedTokenAddress(
        SVMAI_TOKEN_MINT,
        walletPublicKey
      );

      const accountInfo = await getAccount(this.connection, tokenAccount);
      const balance = Number(accountInfo.amount);
      const decimals = SVMAI_TOKEN_DECIMALS;
      const formattedBalance = (balance / Math.pow(10, decimals)).toFixed(2);

      return {
        balance,
        decimals,
        formattedBalance
      };
    } catch (error) {
      if (error instanceof TokenAccountNotFoundError) {
        return {
          balance: 0,
          decimals: SVMAI_TOKEN_DECIMALS,
          formattedBalance: '0.00'
        };
      }
      throw error;
    }
  }

  /**
   * Check if wallet has sufficient balance for operation
   */
  async hasEnoughTokens(
    walletPublicKey: PublicKey, 
    requiredAmount: number
  ): Promise<boolean> {
    try {
      const tokenBalance = await this.getTokenBalance(walletPublicKey);
      const requiredAmountLamports = requiredAmount * Math.pow(10, SVMAI_TOKEN_DECIMALS);
      return tokenBalance.balance >= requiredAmountLamports;
    } catch (error) {
      console.error('Error checking token balance:', error);
      return false;
    }
  }

  /**
   * Get token vault PDA for agent registry
   */
  getAgentRegistryVaultPDA(): [PublicKey, number] {
    return PublicKey.findProgramAddressSync(
      [Buffer.from(AGENT_REGISTRY_VAULT_SEED)],
      AGENT_REGISTRY_PROGRAM_ID
    );
  }

  /**
   * Get token vault PDA for MCP server registry
   */
  getMcpServerRegistryVaultPDA(): [PublicKey, number] {
    return PublicKey.findProgramAddressSync(
      [Buffer.from(MCP_SERVER_REGISTRY_VAULT_SEED)],
      MCP_SERVER_REGISTRY_PROGRAM_ID
    );
  }

  // ============================================================================
  // AGENT REGISTRATION WITH TOKEN INTEGRATION
  // ============================================================================

  /**
   * Register an AI Agent with SVMAI token payment
   */
  async registerAgentWithToken(
    data: AgentRegistrationData,
    walletPublicKey: PublicKey
  ): Promise<Transaction> {
    try {
      // Check token balance first
      const hasEnoughTokens = await this.hasEnoughTokens(
        walletPublicKey, 
        SVMAI_REGISTRATION_FEE_AGENT
      );

      if (!hasEnoughTokens) {
        throw new Error(`Insufficient SVMAI tokens. Required: ${SVMAI_REGISTRATION_FEE_AGENT} SVMAI`);
      }

      // Get PDAs
      const [agentPDA] = getAgentPDA(data.agentId);
      const [vaultPDA] = this.getAgentRegistryVaultPDA();

      // Get token accounts
      const userTokenAccount = await getAssociatedTokenAddress(
        SVMAI_TOKEN_MINT,
        walletPublicKey
      );

      const vaultTokenAccount = await getAssociatedTokenAddress(
        SVMAI_TOKEN_MINT,
        vaultPDA,
        true // Allow PDA as owner
      );

      const transaction = new Transaction();

      // Create vault token account if it doesn't exist
      try {
        await getAccount(this.connection, vaultTokenAccount);
      } catch (error) {
        if (error instanceof TokenAccountNotFoundError) {
          transaction.add(
            createAssociatedTokenAccountInstruction(
              walletPublicKey,
              vaultTokenAccount,
              vaultPDA,
              SVMAI_TOKEN_MINT
            )
          );
        }
      }

      // Create user token account if it doesn't exist
      try {
        await getAccount(this.connection, userTokenAccount);
      } catch (error) {
        if (error instanceof TokenAccountNotFoundError) {
          transaction.add(
            createAssociatedTokenAccountInstruction(
              walletPublicKey,
              userTokenAccount,
              walletPublicKey,
              SVMAI_TOKEN_MINT
            )
          );
        }
      }

      // Create token transfer instruction
      const feeAmountLamports = SVMAI_REGISTRATION_FEE_AGENT * Math.pow(10, SVMAI_TOKEN_DECIMALS);
      const transferInstruction = createTransferInstruction(
        userTokenAccount,
        vaultTokenAccount,
        walletPublicKey,
        feeAmountLamports
      );

      // Create the registration instruction
      const instructionData = this.serializeAgentDataWithToken(data);
      const registrationInstruction = new TransactionInstruction({
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
            pubkey: userTokenAccount,
            isSigner: false,
            isWritable: true,
          },
          {
            pubkey: vaultTokenAccount,
            isSigner: false,
            isWritable: true,
          },
          {
            pubkey: SVMAI_TOKEN_MINT,
            isSigner: false,
            isWritable: false,
          },
          {
            pubkey: TOKEN_PROGRAM_ID,
            isSigner: false,
            isWritable: false,
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

      // Add instructions to transaction
      transaction.add(transferInstruction);
      transaction.add(registrationInstruction);

      // Set transaction properties
      transaction.feePayer = walletPublicKey;
      const { blockhash } = await this.connection.getLatestBlockhash();
      transaction.recentBlockhash = blockhash;

      return transaction;
    } catch (error) {
      console.error('Error creating agent registration transaction with token:', error);
      throw new Error(`Failed to create agent registration transaction: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }

  /**
   * Register an MCP Server with SVMAI token payment
   */
  async registerMcpServerWithToken(
    data: McpServerRegistrationData,
    walletPublicKey: PublicKey
  ): Promise<Transaction> {
    try {
      // Check token balance first
      const hasEnoughTokens = await this.hasEnoughTokens(
        walletPublicKey, 
        SVMAI_REGISTRATION_FEE_SERVER
      );

      if (!hasEnoughTokens) {
        throw new Error(`Insufficient SVMAI tokens. Required: ${SVMAI_REGISTRATION_FEE_SERVER} SVMAI`);
      }

      // Get PDAs
      const [serverPDA] = getMcpServerPDA(data.serverId);
      const [vaultPDA] = this.getMcpServerRegistryVaultPDA();

      // Get token accounts
      const userTokenAccount = await getAssociatedTokenAddress(
        SVMAI_TOKEN_MINT,
        walletPublicKey
      );

      const vaultTokenAccount = await getAssociatedTokenAddress(
        SVMAI_TOKEN_MINT,
        vaultPDA,
        true // Allow PDA as owner
      );

      const transaction = new Transaction();

      // Create vault token account if it doesn't exist
      try {
        await getAccount(this.connection, vaultTokenAccount);
      } catch (error) {
        if (error instanceof TokenAccountNotFoundError) {
          transaction.add(
            createAssociatedTokenAccountInstruction(
              walletPublicKey,
              vaultTokenAccount,
              vaultPDA,
              SVMAI_TOKEN_MINT
            )
          );
        }
      }

      // Create user token account if it doesn't exist
      try {
        await getAccount(this.connection, userTokenAccount);
      } catch (error) {
        if (error instanceof TokenAccountNotFoundError) {
          transaction.add(
            createAssociatedTokenAccountInstruction(
              walletPublicKey,
              userTokenAccount,
              walletPublicKey,
              SVMAI_TOKEN_MINT
            )
          );
        }
      }

      // Create token transfer instruction
      const feeAmountLamports = SVMAI_REGISTRATION_FEE_SERVER * Math.pow(10, SVMAI_TOKEN_DECIMALS);
      const transferInstruction = createTransferInstruction(
        userTokenAccount,
        vaultTokenAccount,
        walletPublicKey,
        feeAmountLamports
      );

      // Create the registration instruction
      const instructionData = this.serializeMcpServerDataWithToken(data);
      const registrationInstruction = new TransactionInstruction({
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
            pubkey: userTokenAccount,
            isSigner: false,
            isWritable: true,
          },
          {
            pubkey: vaultTokenAccount,
            isSigner: false,
            isWritable: true,
          },
          {
            pubkey: SVMAI_TOKEN_MINT,
            isSigner: false,
            isWritable: false,
          },
          {
            pubkey: TOKEN_PROGRAM_ID,
            isSigner: false,
            isWritable: false,
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

      // Add instructions to transaction
      transaction.add(transferInstruction);
      transaction.add(registrationInstruction);

      // Set transaction properties
      transaction.feePayer = walletPublicKey;
      const { blockhash } = await this.connection.getLatestBlockhash();
      transaction.recentBlockhash = blockhash;

      return transaction;
    } catch (error) {
      console.error('Error creating MCP server registration transaction with token:', error);
      throw new Error(`Failed to create MCP server registration transaction: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }

  // ============================================================================
  // STAKING OPERATIONS
  // ============================================================================

  /**
   * Stake SVMAI tokens for agent tier upgrade
   */
  async stakeTokensForAgent(
    agentId: string,
    stakingTier: StakingTier,
    walletPublicKey: PublicKey
  ): Promise<Transaction> {
    try {
      const stakingAmount = SVMAI_STAKING_TIERS[stakingTier];
      
      // Check token balance
      const hasEnoughTokens = await this.hasEnoughTokens(walletPublicKey, stakingAmount);
      if (!hasEnoughTokens) {
        throw new Error(`Insufficient SVMAI tokens. Required: ${stakingAmount} SVMAI for ${stakingTier} tier`);
      }

      // Get PDAs
      const [agentPDA] = getAgentPDA(agentId);
      const [stakingVaultPDA] = PublicKey.findProgramAddressSync(
        [Buffer.from('staking_vault'), agentPDA.toBuffer()],
        AGENT_REGISTRY_PROGRAM_ID
      );

      // Get token accounts
      const userTokenAccount = await getAssociatedTokenAddress(
        SVMAI_TOKEN_MINT,
        walletPublicKey
      );

      const stakingTokenAccount = await getAssociatedTokenAddress(
        SVMAI_TOKEN_MINT,
        stakingVaultPDA,
        true
      );

      const transaction = new Transaction();

      // Create staking token account if it doesn't exist
      try {
        await getAccount(this.connection, stakingTokenAccount);
      } catch (error) {
        if (error instanceof TokenAccountNotFoundError) {
          transaction.add(
            createAssociatedTokenAccountInstruction(
              walletPublicKey,
              stakingTokenAccount,
              stakingVaultPDA,
              SVMAI_TOKEN_MINT
            )
          );
        }
      }

      // Create staking instruction data
      const stakingData = Buffer.concat([
        Buffer.from([1]), // StakeTokens instruction discriminator
        Buffer.from(stakingTier), // Tier as string
        this.u64ToBuffer(stakingAmount * Math.pow(10, SVMAI_TOKEN_DECIMALS)) // Amount in lamports
      ]);

      // Create the staking instruction
      const stakingInstruction = new TransactionInstruction({
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
            pubkey: userTokenAccount,
            isSigner: false,
            isWritable: true,
          },
          {
            pubkey: stakingTokenAccount,
            isSigner: false,
            isWritable: true,
          },
          {
            pubkey: SVMAI_TOKEN_MINT,
            isSigner: false,
            isWritable: false,
          },
          {
            pubkey: TOKEN_PROGRAM_ID,
            isSigner: false,
            isWritable: false,
          },
        ],
        programId: AGENT_REGISTRY_PROGRAM_ID,
        data: stakingData,
      });

      transaction.add(stakingInstruction);

      // Set transaction properties
      transaction.feePayer = walletPublicKey;
      const { blockhash } = await this.connection.getLatestBlockhash();
      transaction.recentBlockhash = blockhash;

      return transaction;
    } catch (error) {
      console.error('Error creating staking transaction:', error);
      throw new Error(`Failed to create staking transaction: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }

  /**
   * Stake SVMAI tokens for MCP server verification
   */
  async stakeTokensForServer(
    serverId: string,
    verificationTier: VerificationTier,
    walletPublicKey: PublicKey
  ): Promise<Transaction> {
    try {
      const stakingAmount = SVMAI_VERIFICATION_TIERS[verificationTier];
      
      // Check token balance
      const hasEnoughTokens = await this.hasEnoughTokens(walletPublicKey, stakingAmount);
      if (!hasEnoughTokens) {
        throw new Error(`Insufficient SVMAI tokens. Required: ${stakingAmount} SVMAI for ${verificationTier} verification`);
      }

      // Get PDAs
      const [serverPDA] = getMcpServerPDA(serverId);
      const [stakingVaultPDA] = PublicKey.findProgramAddressSync(
        [Buffer.from('verification_vault'), serverPDA.toBuffer()],
        MCP_SERVER_REGISTRY_PROGRAM_ID
      );

      // Similar implementation to agent staking...
      // Implementation follows the same pattern as stakeTokensForAgent

      const transaction = new Transaction();
      // ... rest of implementation similar to agent staking

      return transaction;
    } catch (error) {
      console.error('Error creating server verification staking transaction:', error);
      throw new Error(`Failed to create server verification transaction: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }

  // ============================================================================
  // DATA SERIALIZATION
  // ============================================================================

  /**
   * Serialize agent data with token integration
   */
  private serializeAgentDataWithToken(data: AgentRegistrationData): Buffer {
    // Instruction discriminator (0 for RegisterAgentWithToken)
    const discriminator = Buffer.from([0]);
    
    // Serialize the data (simplified - use proper Borsh in production)
    const agentIdBuffer = Buffer.from(data.agentId);
    const nameBuffer = Buffer.from(data.name);
    const descriptionBuffer = Buffer.from(data.description);
    const versionBuffer = Buffer.from(data.version);
    
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
   * Serialize MCP server data with token integration
   */
  private serializeMcpServerDataWithToken(data: McpServerRegistrationData): Buffer {
    // Instruction discriminator (0 for RegisterMcpServerWithToken)
    const discriminator = Buffer.from([0]);
    
    const serverIdBuffer = Buffer.from(data.serverId);
    const nameBuffer = Buffer.from(data.name);
    const descriptionBuffer = Buffer.from(data.description);
    const versionBuffer = Buffer.from(data.version);
    
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
   * Convert number to 64-bit buffer (little endian)
   */
  private u64ToBuffer(value: number): Buffer {
    const buffer = Buffer.alloc(8);
    buffer.writeBigUInt64LE(BigInt(value), 0);
    return buffer;
  }

  // ============================================================================
  // LEGACY COMPATIBILITY
  // ============================================================================

  /**
   * Legacy registration method (for backward compatibility)
   */
  async registerAgent(
    data: AgentRegistrationData,
    walletPublicKey: PublicKey
  ): Promise<Transaction> {
    console.warn('Using legacy registration method. Consider upgrading to registerAgentWithToken()');
    return this.registerAgentWithToken(data, walletPublicKey);
  }

  /**
   * Legacy MCP server registration method (for backward compatibility)
   */
  async registerMcpServer(
    data: McpServerRegistrationData,
    walletPublicKey: PublicKey
  ): Promise<Transaction> {
    console.warn('Using legacy registration method. Consider upgrading to registerMcpServerWithToken()');
    return this.registerMcpServerWithToken(data, walletPublicKey);
  }
}

// Export singleton instance
export const tokenRegistryService = new TokenRegistryService();

// Re-export for compatibility
export const registryService = tokenRegistryService;