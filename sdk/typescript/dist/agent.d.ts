import { PublicKey } from '@solana/web3.js';
import { SolanaClient } from './client.js';
import { AgentRegistrationData, AgentUpdateData, AgentRegistryEntry, AgentStatus, AgentTier, StakingInfo, TransactionResult, ProgramAccount, A2AMPLAmount } from './types.js';
/**
 * Agent Registry API for managing autonomous agents
 */
export declare class AgentAPI {
    private client;
    constructor(client: SolanaClient);
    /**
     * Register a new agent
     */
    registerAgent(data: AgentRegistrationData, stakingTier?: AgentTier): Promise<TransactionResult>;
    /**
     * Update an existing agent
     */
    updateAgent(agentId: string, data: AgentUpdateData): Promise<TransactionResult>;
    /**
     * Deregister an agent
     */
    deregisterAgent(agentId: string): Promise<TransactionResult>;
    /**
     * Get agent by ID
     */
    getAgent(agentId: string): Promise<AgentRegistryEntry>;
    /**
     * List agents by owner
     */
    listAgentsByOwner(owner?: PublicKey): Promise<ProgramAccount<AgentRegistryEntry>[]>;
    /**
     * List agents by status
     */
    listAgentsByStatus(status: AgentStatus): Promise<ProgramAccount<AgentRegistryEntry>[]>;
    /**
     * Search agents by tags
     */
    searchAgentsByTags(tags: string[]): Promise<ProgramAccount<AgentRegistryEntry>[]>;
    /**
     * Stake tokens for an agent
     */
    stakeForAgent(agentId: string, amount: A2AMPLAmount, tier: AgentTier): Promise<TransactionResult>;
    /**
     * Get staking information for an agent
     */
    getStakingInfo(agentId: string): Promise<StakingInfo | null>;
    /**
     * Get agent PDA
     */
    private getAgentPda;
    /**
     * Parse agent account data
     */
    private parseAgentAccount;
    /**
     * Create staking instruction
     */
    private createStakingInstruction;
    /**
     * Get staking amount for tier
     */
    private getStakingAmountForTier;
    /**
     * Get minimum stake for tier
     */
    private getMinStakeForTier;
}
//# sourceMappingURL=agent.d.ts.map