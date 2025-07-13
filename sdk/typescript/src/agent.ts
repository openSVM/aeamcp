import { PublicKey, Transaction } from '@solana/web3.js';
import { SolanaClient } from './client.js';
import { SdkError, ValidationError } from './errors.js';
import {
  AgentRegistrationData,
  AgentUpdateData,
  AgentRegistryEntry,
  AgentStatus,
  AgentTier,
  StakingInfo,
  TransactionResult,
  ProgramAccount,
  A2AMPLAmount,
  CONSTANTS,
} from './types.js';
import { Validator } from './utils/validation.js';
import { RegistryError, AccountError } from './errors.js';

/**
 * Agent Registry API for managing autonomous agents
 */
export class AgentAPI {
  constructor(private client: SolanaClient) {}

  /**
   * Register a new agent
   */
  async registerAgent(data: AgentRegistrationData, stakingTier?: AgentTier): Promise<TransactionResult> {
    // Validate input data
    Validator.validateAgentRegistrationData(data);

    try {
      const program = this.client.getAgentRegistryProgram();
      const provider = this.client.getProvider();

      // Derive PDA for agent account
      const [agentPda] = PublicKey.findProgramAddressSync(
        [
          Buffer.from(CONSTANTS.AGENT_REGISTRY_PDA_SEED),
          Buffer.from(data.agentId),
          provider.wallet.publicKey.toBuffer(),
        ],
        program.programId
      );

      // Check if agent already exists
      if (await this.client.accountExists(agentPda)) {
        throw new RegistryError(`Agent with ID '${data.agentId}' already exists`);
      }

      // Calculate registration fee
      const registrationFee = CONSTANTS.AGENT_REGISTRATION_FEE;
      
      // Calculate staking amount if tier is specified
      let stakingAmount = 0n;
      if (stakingTier) {
        stakingAmount = this.getStakingAmountForTier(stakingTier);
      }

      // Build transaction
      const transaction = new Transaction();

      // Add agent registration instruction
      if (!program.methods) {
        throw new ValidationError('Program methods not available');
      }
      const registerInstruction = await program.methods
        .registerAgent({
          agentId: data.agentId,
          name: data.name,
          description: data.description,
          version: data.version,
          providerName: data.providerName,
          providerUrl: data.providerUrl,
          documentationUrl: data.documentationUrl,
          serviceEndpoints: data.serviceEndpoints,
          supportedModes: data.supportedModes,
          skills: data.skills,
          securityInfoUri: data.securityInfoUri,
          aeaAddress: data.aeaAddress,
          economicIntent: data.economicIntent,
          extendedMetadataUri: data.extendedMetadataUri,
          tags: data.tags,
        })
        .accounts({
          agentAccount: agentPda,
          owner: provider.wallet.publicKey,
          systemProgram: PublicKey.default, // SystemProgram.programId
        })
        .instruction();

      transaction.add(registerInstruction);

      // Add staking instruction if required
      if (stakingAmount > 0n) {
        const stakingInstruction = await this.createStakingInstruction(
          agentPda,
          stakingAmount,
          stakingTier!
        );
        transaction.add(stakingInstruction);
      }

      return await this.client.sendAndConfirmTransaction(transaction);
    } catch (error) {
      throw new RegistryError(
        `Failed to register agent: ${error instanceof Error ? error.message : 'Unknown error'}`,
        undefined,
        undefined,
        error instanceof Error ? error : undefined
      );
    }
  }

  /**
   * Update an existing agent
   */
  async updateAgent(agentId: string, data: AgentUpdateData): Promise<TransactionResult> {
    // Validate inputs
    Validator.validateAgentId(agentId);
    Validator.validateAgentUpdateData(data);

    try {
      const program = this.client.getAgentRegistryProgram();
      const provider = this.client.getProvider();

      // Derive PDA for agent account
      const [agentPda] = PublicKey.findProgramAddressSync(
        [
          Buffer.from(CONSTANTS.AGENT_REGISTRY_PDA_SEED),
          Buffer.from(agentId),
          provider.wallet.publicKey.toBuffer(),
        ],
        program.programId
      );

      // Check if agent exists
      if (!(await this.client.accountExists(agentPda))) {
        throw new RegistryError(`Agent with ID '${agentId}' not found`);
      }

      // Get current agent data for version checking
      const currentAgent = await this.getAgent(agentId);
      
      // Build update instruction
      if (!program.methods) {
        throw new ValidationError('Program methods not available');
      }
      const updateInstruction = await program.methods
        .updateAgent({
          name: data.name,
          description: data.description,
          version: data.version,
          providerName: data.providerName,
          providerUrl: data.providerUrl,
          documentationUrl: data.documentationUrl,
          serviceEndpoints: data.serviceEndpoints,
          supportedModes: data.supportedModes,
          skills: data.skills,
          securityInfoUri: data.securityInfoUri,
          aeaAddress: data.aeaAddress,
          economicIntent: data.economicIntent,
          extendedMetadataUri: data.extendedMetadataUri,
          tags: data.tags,
          expectedStateVersion: currentAgent.stateVersion,
        })
        .accounts({
          agentAccount: agentPda,
          owner: provider.wallet.publicKey,
        })
        .instruction();

      const transaction = new Transaction().add(updateInstruction);
      return await this.client.sendAndConfirmTransaction(transaction);
    } catch (error) {
      throw new RegistryError(
        `Failed to update agent: ${error instanceof Error ? error.message : 'Unknown error'}`,
        undefined,
        undefined,
        error instanceof Error ? error : undefined
      );
    }
  }

  /**
   * Deregister an agent
   */
  async deregisterAgent(agentId: string): Promise<TransactionResult> {
    Validator.validateAgentId(agentId);

    try {
      const program = this.client.getAgentRegistryProgram();
      const provider = this.client.getProvider();

      // Derive PDA for agent account
      const [agentPda] = PublicKey.findProgramAddressSync(
        [
          Buffer.from(CONSTANTS.AGENT_REGISTRY_PDA_SEED),
          Buffer.from(agentId),
          provider.wallet.publicKey.toBuffer(),
        ],
        program.programId
      );

      // Check if agent exists
      if (!(await this.client.accountExists(agentPda))) {
        throw new RegistryError(`Agent with ID '${agentId}' not found`);
      }

      const deregisterInstruction = await program.methods
        .deregisterAgent()
        .accounts({
          agentAccount: agentPda,
          owner: provider.wallet.publicKey,
        })
        .instruction();

      const transaction = new Transaction().add(deregisterInstruction);
      return await this.client.sendAndConfirmTransaction(transaction);
    } catch (error) {
      throw new RegistryError(
        `Failed to deregister agent: ${error instanceof Error ? error.message : 'Unknown error'}`,
        undefined,
        undefined,
        error instanceof Error ? error : undefined
      );
    }
  }

  /**
   * Update agent status (matches Rust SDK)
   */
  async updateAgentStatus(agentId: string, status: AgentStatus): Promise<TransactionResult> {
    Validator.validateAgentId(agentId);

    try {
      const program = this.client.getAgentRegistryProgram();
      const provider = this.client.getProvider();

      // Derive PDA for agent account
      const [agentPda] = PublicKey.findProgramAddressSync(
        [
          Buffer.from(CONSTANTS.AGENT_REGISTRY_PDA_SEED),
          Buffer.from(agentId),
          provider.wallet.publicKey.toBuffer(),
        ],
        program.programId
      );

      const updateStatusInstruction = await program.methods
        .updateAgentStatus(status)
        .accounts({
          agentAccount: agentPda,
          owner: provider.wallet.publicKey,
        })
        .instruction();

      const transaction = new Transaction().add(updateStatusInstruction);
      return await this.client.sendAndConfirmTransaction(transaction);
    } catch (error) {
      throw new RegistryError(
        `Failed to update agent status: ${error instanceof Error ? error.message : 'Unknown error'}`,
        undefined,
        undefined,
        error instanceof Error ? error : undefined
      );
    }
  }

  /**
   * Get agent by ID (matches Rust SDK signature with explicit owner)
   */
  async getAgentByOwner(owner: PublicKey, agentId: string): Promise<AgentRegistryEntry | null> {
    Validator.validateAgentId(agentId);

    try {
      const program = this.client.getAgentRegistryProgram();

      // Derive PDA for agent account
      const [agentPda] = PublicKey.findProgramAddressSync(
        [
          Buffer.from(CONSTANTS.AGENT_REGISTRY_PDA_SEED),
          Buffer.from(agentId),
          owner.toBuffer(),
        ],
        program.programId
      );

      try {
        const account = await (program.account as any).agentRegistryEntryV1.fetch(agentPda);
        return this.parseAgentAccount(account, agentPda);
      } catch (error) {
        // Return null if account not found (matches Rust SDK Option<T> pattern)
        return null;
      }
    } catch (error) {
      throw new AccountError(
        `Failed to get agent '${agentId}' for owner '${owner.toBase58()}': ${error instanceof Error ? error.message : 'Unknown error'}`,
        error instanceof Error ? error : undefined
      );
    }
  }

  /**
   * Get agent by ID
   */
  async getAgent(agentId: string): Promise<AgentRegistryEntry> {
    Validator.validateAgentId(agentId);

    try {
      const program = this.client.getAgentRegistryProgram();
      const provider = this.client.getProvider();

      // Derive PDA for agent account
      const [agentPda] = PublicKey.findProgramAddressSync(
        [
          Buffer.from(CONSTANTS.AGENT_REGISTRY_PDA_SEED),
          Buffer.from(agentId),
          provider.wallet.publicKey.toBuffer(),
        ],
        program.programId
      );

      const account = await (program.account as any).agentRegistryEntryV1.fetch(agentPda);
      
      return this.parseAgentAccount(account, agentPda);
    } catch (error) {
      throw new AccountError(
        `Failed to get agent '${agentId}': ${error instanceof Error ? error.message : 'Agent not found'}`,
        error instanceof Error ? error : undefined
      );
    }
  }

  /**
   * List agents by owner
   */
  async listAgentsByOwner(owner?: PublicKey): Promise<ProgramAccount<AgentRegistryEntry>[]> {
    try {
      const program = this.client.getAgentRegistryProgram();
      const provider = this.client.getProvider();
      const targetOwner = owner || provider.wallet.publicKey;

      const accounts = await (program.account as any).agentRegistryEntryV1.all([
        {
          memcmp: {
            offset: 8 + 32, // discriminator + agentId offset
            bytes: targetOwner.toBase58(),
          },
        },
      ]);

      return accounts.map(account =>  ({
        publicKey: account.publicKey,
        account: this.parseAgentAccount(account.account, account.publicKey),
      }));
    } catch (error) {
      throw new AccountError(
        `Failed to list agents: ${error instanceof Error ? error.message : 'Unknown error'}`,
        error instanceof Error ? error : undefined
      );
    }
  }

  /**
   * List agents by status
   */
  async listAgentsByStatus(status: AgentStatus): Promise<ProgramAccount<AgentRegistryEntry>[]> {
    try {
      const program = this.client.getAgentRegistryProgram();

      const accounts = await (program.account as any).agentRegistryEntryV1.all([
        {
          memcmp: {
            offset: 8 + 64 + 128 + 512 + 32, // approximate offset to status field
            bytes: Buffer.from([status]).toString('base64'),
          },
        },
      ]);

      return accounts.map(account =>  ({
        publicKey: account.publicKey,
        account: this.parseAgentAccount(account.account, account.publicKey),
      }));
    } catch (error) {
      throw new AccountError(
        `Failed to list agents by status: ${error instanceof Error ? error.message : 'Unknown error'}`,
        error instanceof Error ? error : undefined
      );
    }
  }

  /**
   * Search agents by tags
   */
  async searchAgentsByTags(tags: string[]): Promise<ProgramAccount<AgentRegistryEntry>[]> {
    try {
      const program = this.client.getAgentRegistryProgram();
      
      // Get all agents (in a real implementation, this would be more efficient)
      const allAgents = await (program.account as any).agentRegistryEntryV1.all();

      // Filter by tags
      const filteredAgents = allAgents.filter(account =>  {
        const agent = this.parseAgentAccount(account.account, account.publicKey);
        return tags.some(tag => agent.tags.includes(tag));
      });

      return filteredAgents.map(account =>  ({
        publicKey: account.publicKey,
        account: this.parseAgentAccount(account.account, account.publicKey),
      }));
    } catch (error) {
      throw new AccountError(
        `Failed to search agents by tags: ${error instanceof Error ? error.message : 'Unknown error'}`,
        error instanceof Error ? error : undefined
      );
    }
  }

  /**
   * Stake tokens for an agent
   */
  async stakeForAgent(agentId: string, amount: A2AMPLAmount, tier: AgentTier): Promise<TransactionResult> {
    Validator.validateAgentId(agentId);

    if (amount < this.getMinStakeForTier(tier)) {
      throw new ValidationError(`Stake amount too low for ${tier} tier`, 'amount');
    }

    try {
      const stakingInstruction = await this.createStakingInstruction(
        await this.getAgentPda(agentId),
        amount,
        tier
      );

      const transaction = new Transaction().add(stakingInstruction);
      return await this.client.sendAndConfirmTransaction(transaction);
    } catch (error) {
      throw new RegistryError(
        `Failed to stake for agent: ${error instanceof Error ? error.message : 'Unknown error'}`,
        undefined,
        undefined,
        error instanceof Error ? error : undefined
      );
    }
  }

  /**
   * Get staking information for an agent
   */
  async getStakingInfo(agentId: string): Promise<StakingInfo | null> {
    try {
      // This would fetch from a staking account associated with the agent
      // Implementation depends on the actual program structure
      const agentPda = await this.getAgentPda(agentId);
      
      // Derive staking PDA
      const program = this.client.getAgentRegistryProgram();
      const [stakingPda] = PublicKey.findProgramAddressSync(
        [
          Buffer.from(CONSTANTS.STAKING_VAULT_SEED),
          agentPda.toBuffer(),
        ],
        program.programId
      );

      // Check if staking account exists
      if (!(await this.client.accountExists(stakingPda))) {
        return null;
      }

      // This would be replaced with actual staking account parsing
      return {
        amount: 0n, // placeholder
        tier: AgentTier.Bronze, // placeholder
        lockPeriod: 0, // placeholder
        lockEndSlot: 0n, // placeholder
      };
    } catch (error) {
      return null;
    }
  }

  /**
   * Get agent PDA
   */
  private async getAgentPda(agentId: string): Promise<PublicKey> {
    const program = this.client.getAgentRegistryProgram();
    const provider = this.client.getProvider();

    const [agentPda] = PublicKey.findProgramAddressSync(
      [
        Buffer.from(CONSTANTS.AGENT_REGISTRY_PDA_SEED),
        Buffer.from(agentId),
        provider.wallet.publicKey.toBuffer(),
      ],
      program.programId
    );

    return agentPda;
  }

  /**
   * Parse agent account data
   */
  private parseAgentAccount(account: any, publicKey: PublicKey): AgentRegistryEntry {
    // This would parse the actual account data structure
    // For now, return a mock structure
    return {
      agentId: account.agentId || 'unknown',
      name: account.name || 'Unknown Agent',
      description: account.description || '',
      version: account.version || '1.0.0',
      status: account.status || AgentStatus.Pending,
      owner: account.owner || PublicKey.default,
      registrationSlot: BigInt(account.registrationSlot || 0),
      lastUpdateSlot: BigInt(account.lastUpdateSlot || 0),
      providerName: account.providerName || '',
      providerUrl: account.providerUrl || '',
      documentationUrl: account.documentationUrl,
      serviceEndpoints: account.serviceEndpoints || [],
      supportedModes: account.supportedModes || [],
      skills: account.skills || [],
      securityInfoUri: account.securityInfoUri,
      aeaAddress: account.aeaAddress,
      economicIntent: account.economicIntent,
      extendedMetadataUri: account.extendedMetadataUri,
      tags: account.tags || [],
      stateVersion: BigInt(account.stateVersion || 0),
    };
  }

  /**
   * Create staking instruction
   */
  private async createStakingInstruction(
    agentPda: PublicKey,
    amount: A2AMPLAmount,
    tier: AgentTier
  ): Promise<any> {
    // This would create the actual staking instruction
    // Implementation depends on the program structure
    throw new Error('Staking instruction creation not implemented');
  }

  /**
   * Get staking amount for tier
   */
  private getStakingAmountForTier(tier: AgentTier): A2AMPLAmount {
    switch (tier) {
      case AgentTier.Bronze:
        return CONSTANTS.BRONZE_TIER_STAKE;
      case AgentTier.Silver:
        return CONSTANTS.SILVER_TIER_STAKE;
      case AgentTier.Gold:
        return CONSTANTS.GOLD_TIER_STAKE;
      case AgentTier.Platinum:
        return CONSTANTS.PLATINUM_TIER_STAKE;
      default:
        throw new ValidationError(`Invalid tier: ${tier}`, 'tier');
    }
  }

  /**
   * Get minimum stake for tier
   */
  private getMinStakeForTier(tier: AgentTier): A2AMPLAmount {
    return this.getStakingAmountForTier(tier);
  }
}