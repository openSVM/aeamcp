# Chapter 14: Appendices

## Appendix A: Complete Registry Data Structures

### A.1 Agent Registry Data Structures

Below is the complete Rust code for the Agent Registry data structures, including all fields, types, and documentation comments:

```rust
/// Agent Registry Entry (Version 1)
/// This is the primary data structure for storing agent information on-chain
#[account]
#[derive(InitSpace)]
pub struct AgentRegistryEntryV1 {
    /// Bump seed used for PDA derivation
    pub bump: u8,
    
    /// Registry version (currently 1)
    pub registry_version: u8,
    
    /// Current status of the agent (Active, Inactive, Deprecated)
    pub status: u8,
    
    /// Authority that can update or close this entry
    pub owner_authority: Pubkey,
    
    /// Unique identifier for this agent
    #[max_len(64)]
    pub agent_id: String,
    
    /// Human-readable name of the agent
    #[max_len(64)]
    pub name: String,
    
    /// Brief description of the agent's purpose and capabilities
    #[max_len(256)]
    pub description: String,
    
    /// Version identifier for the agent
    #[max_len(32)]
    pub agent_version: String,
    
    /// Bit flags representing agent capabilities
    pub capabilities_flags: u64,
    
    /// List of protocols supported by this agent (e.g., "a2a", "mcp")
    #[max_len(5)]
    pub supported_protocols: Vec<String>,
    
    /// List of skill tags describing agent capabilities
    #[max_len(10)]
    pub skill_tags: Vec<String>,
    
    /// List of service endpoints for connecting to this agent
    #[max_len(3)]
    pub service_endpoints: Vec<ServiceEndpoint>,
    
    /// Optional URL to documentation
    pub documentation_url: Option<String>,
    
    /// Optional URI pointing to extended metadata (e.g., IPFS, Arweave)
    pub extended_metadata_uri: Option<String>,
    
    /// Unix timestamp when this entry was created
    pub created_at: i64,
    
    /// Unix timestamp when this entry was last updated
    pub updated_at: i64,
}

/// Service endpoint information for connecting to an agent
#[derive(AnchorSerialize, AnchorDeserialize, Clone, InitSpace)]
pub struct ServiceEndpoint {
    /// Protocol used by this endpoint (e.g., "http", "grpc", "websocket")
    #[max_len(64)]
    pub protocol: String,
    
    /// URL or connection string for this endpoint
    #[max_len(256)]
    pub url: String,
    
    /// Whether this is the default endpoint for the agent
    pub is_default: bool,
}

/// Agent capability flags as bit positions
pub mod AgentCapabilityFlags {
    /// Agent supports A2A messaging protocol
    pub const A2A_MESSAGING: u64 = 1 << 0;
    
    /// Agent can act as an MCP client
    pub const MCP_CLIENT: u64 = 1 << 1;
    
    /// Agent can execute tasks
    pub const TASK_EXECUTION: u64 = 1 << 2;
    
    /// Agent can publish events
    pub const EVENT_PUBLISHING: u64 = 1 << 3;
    
    /// Agent supports direct user interaction
    pub const USER_INTERACTION: u64 = 1 << 4;
    
    /// Agent has payment capabilities
    pub const PAYMENT_PROCESSING: u64 = 1 << 5;
    
    /// Agent can interact with smart contracts
    pub const CONTRACT_INTERACTION: u64 = 1 << 6;
    
    /// Agent has data storage capabilities
    pub const DATA_STORAGE: u64 = 1 << 7;
    
    /// Agent can perform data analysis
    pub const DATA_ANALYSIS: u64 = 1 << 8;
    
    /// Agent has machine learning capabilities
    pub const MACHINE_LEARNING: u64 = 1 << 9;
    
    // Additional flags can be added up to 64 total (u64 limit)
}

/// Agent status values
pub enum AgentStatus {
    /// Agent is not currently active
    Inactive = 0,
    
    /// Agent is active and available
    Active = 1,
    
    /// Agent is deprecated and may be removed in the future
    Deprecated = 2,
}
```

### A.2 MCP Server Registry Data Structures

Below is the complete Rust code for the MCP Server Registry data structures:

```rust
/// MCP Server Registry Entry (Version 1)
/// This is the primary data structure for storing MCP server information on-chain
#[account]
#[derive(InitSpace)]
pub struct MCPServerRegistryEntryV1 {
    /// Bump seed used for PDA derivation
    pub bump: u8,
    
    /// Registry version (currently 1)
    pub registry_version: u8,
    
    /// Current status of the server (Active, Maintenance, Offline)
    pub status: u8,
    
    /// Authority that can update or close this entry
    pub owner_authority: Pubkey,
    
    /// Unique identifier for this MCP server
    #[max_len(64)]
    pub server_id: String,
    
    /// Human-readable name of the MCP server
    #[max_len(64)]
    pub name: String,
    
    /// Brief description of the server's purpose and capabilities
    #[max_len(256)]
    pub description: String,
    
    /// Version of the MCP protocol implemented by this server
    #[max_len(32)]
    pub mcp_version: String,
    
    /// Primary endpoint URL for connecting to this MCP server
    #[max_len(256)]
    pub endpoint_url: String,
    
    /// List of models supported by this MCP server
    #[max_len(20)]
    pub supported_models: Vec<ModelInfo>,
    
    /// Optional URL to documentation
    pub documentation_url: Option<String>,
    
    /// Optional URI pointing to extended metadata (e.g., IPFS, Arweave)
    pub extended_metadata_uri: Option<String>,
    
    /// Bit flags representing server capabilities
    pub capabilities_flags: u64,
    
    /// Unix timestamp when this entry was created
    pub created_at: i64,
    
    /// Unix timestamp when this entry was last updated
    pub updated_at: i64,
}

/// Information about a model supported by an MCP server
#[derive(AnchorSerialize, AnchorDeserialize, Clone, InitSpace)]
pub struct ModelInfo {
    /// Unique identifier for this model
    #[max_len(64)]
    pub model_id: String,
    
    /// Human-readable name of the model
    #[max_len(64)]
    pub name: String,
    
    /// Version identifier for the model
    #[max_len(32)]
    pub version: String,
    
    /// List of tools supported by this model
    #[max_len(10)]
    pub supported_tools: Vec<ToolInfo>,
}

/// Information about a tool supported by a model
#[derive(AnchorSerialize, AnchorDeserialize, Clone, InitSpace)]
pub struct ToolInfo {
    /// Unique identifier for this tool
    #[max_len(64)]
    pub tool_id: String,
    
    /// Human-readable name of the tool
    #[max_len(64)]
    pub name: String,
    
    /// Brief description of the tool's purpose
    #[max_len(256)]
    pub description: String,
    
    /// Hash of the tool's schema for verification
    #[max_len(64)]
    pub schema_hash: String,
}

/// MCP server capability flags as bit positions
pub mod MCPServerCapabilityFlags {
    /// Server supports streaming responses
    pub const STREAMING: u64 = 1 << 0;
    
    /// Server supports tool execution
    pub const TOOL_EXECUTION: u64 = 1 << 1;
    
    /// Server supports multi-modal inputs
    pub const MULTI_MODAL: u64 = 1 << 2;
    
    /// Server supports parallel requests
    pub const PARALLEL_REQUESTS: u64 = 1 << 3;
    
    /// Server supports request batching
    pub const BATCHING: u64 = 1 << 4;
    
    /// Server supports fine-tuning
    pub const FINE_TUNING: u64 = 1 << 5;
    
    /// Server supports model customization
    pub const CUSTOMIZATION: u64 = 1 << 6;
    
    /// Server supports usage analytics
    pub const ANALYTICS: u64 = 1 << 7;
    
    // Additional flags can be added up to 64 total (u64 limit)
}

/// MCP server status values
pub enum MCPServerStatus {
    /// Server is offline and not accepting requests
    Offline = 0,
    
    /// Server is active and available
    Active = 1,
    
    /// Server is in maintenance mode
    Maintenance = 2,
}
```

## Appendix B: Registry Instruction Definitions

### B.1 Agent Registry Instructions

Below are the complete instruction definitions for the Agent Registry:

```rust
#[program]
pub mod agent_registry {
    use super::*;

    /// Register a new agent in the registry
    pub fn register_agent(ctx: Context<RegisterAgent>, args: RegisterAgentArgs) -> Result<()> {
        // Implementation details...
    }

    /// Update an existing agent entry
    pub fn update_agent(ctx: Context<UpdateAgent>, args: UpdateAgentArgs) -> Result<()> {
        // Implementation details...
    }

    /// Update the status of an agent
    pub fn update_agent_status(ctx: Context<UpdateAgentStatus>, new_status: u8) -> Result<()> {
        // Implementation details...
    }

    /// Close an agent entry and reclaim rent
    pub fn close_agent_entry(ctx: Context<CloseAgentEntry>) -> Result<()> {
        // Implementation details...
    }

    /// Transfer ownership of an agent entry to a new authority
    pub fn transfer_agent_ownership(ctx: Context<TransferAgentOwnership>) -> Result<()> {
        // Implementation details...
    }
}

/// Accounts required for the register_agent instruction
#[derive(Accounts)]
#[instruction(args: RegisterAgentArgs)]
pub struct RegisterAgent<'info> {
    /// The account that will pay for the transaction and rent
    #[account(mut)]
    pub payer: Signer<'info>,

    /// The authority that will own this agent entry
    pub owner_authority: Signer<'info>,

    /// The agent entry account (PDA)
    #[account(
        init,
        payer = payer,
        space = 8 + AgentRegistryEntryV1::INIT_SPACE,
        seeds = [
            b"agent_registry",
            args.agent_id.as_bytes(),
            owner_authority.key().as_ref()
        ],
        bump
    )]
    pub entry: Account<'info, AgentRegistryEntryV1>,

    /// System program for creating the entry account
    pub system_program: Program<'info, System>,
}

/// Arguments for the register_agent instruction
#[derive(AnchorSerialize, AnchorDeserialize, Clone)]
pub struct RegisterAgentArgs {
    /// Unique identifier for this agent
    pub agent_id: String,
    
    /// Human-readable name of the agent
    pub name: String,
    
    /// Brief description of the agent's purpose and capabilities
    pub description: String,
    
    /// Version identifier for the agent
    pub agent_version: String,
    
    /// Bit flags representing agent capabilities
    pub capabilities_flags: u64,
    
    /// List of protocols supported by this agent
    pub supported_protocols: Vec<String>,
    
    /// List of skill tags describing agent capabilities
    pub skill_tags: Vec<String>,
    
    /// List of service endpoints for connecting to this agent
    pub service_endpoints: Vec<ServiceEndpoint>,
    
    /// Optional URL to documentation
    pub documentation_url: Option<String>,
    
    /// Optional URI pointing to extended metadata
    pub extended_metadata_uri: Option<String>,
}

/// Accounts required for the update_agent instruction
#[derive(Accounts)]
pub struct UpdateAgent<'info> {
    /// The agent entry account (PDA)
    #[account(
        mut,
        seeds = [
            b"agent_registry",
            entry.agent_id.as_bytes(),
            owner_authority.key().as_ref()
        ],
        bump = entry.bump,
        has_one = owner_authority @ ErrorCode::Unauthorized
    )]
    pub entry: Account<'info, AgentRegistryEntryV1>,

    /// The authority that owns this agent entry
    pub owner_authority: Signer<'info>,
}

/// Arguments for the update_agent instruction
#[derive(AnchorSerialize, AnchorDeserialize, Clone)]
pub struct UpdateAgentArgs {
    /// Optional updated name
    pub name: Option<String>,
    
    /// Optional updated description
    pub description: Option<String>,
    
    /// Optional updated agent version
    pub agent_version: Option<String>,
    
    /// Optional updated capabilities flags
    pub capabilities_flags: Option<u64>,
    
    /// Optional updated supported protocols
    pub supported_protocols: Option<Vec<String>>,
    
    /// Optional updated skill tags
    pub skill_tags: Option<Vec<String>>,
    
    /// Optional updated service endpoints
    pub service_endpoints: Option<Vec<ServiceEndpoint>>,
    
    /// Optional updated documentation URL
    pub documentation_url: Option<Option<String>>,
    
    /// Optional updated extended metadata URI
    pub extended_metadata_uri: Option<Option<String>>,
}

/// Accounts required for the update_agent_status instruction
#[derive(Accounts)]
pub struct UpdateAgentStatus<'info> {
    /// The agent entry account (PDA)
    #[account(
        mut,
        seeds = [
            b"agent_registry",
            entry.agent_id.as_bytes(),
            owner_authority.key().as_ref()
        ],
        bump = entry.bump,
        has_one = owner_authority @ ErrorCode::Unauthorized
    )]
    pub entry: Account<'info, AgentRegistryEntryV1>,

    /// The authority that owns this agent entry
    pub owner_authority: Signer<'info>,
}

/// Accounts required for the close_agent_entry instruction
#[derive(Accounts)]
pub struct CloseAgentEntry<'info> {
    /// The agent entry account (PDA)
    #[account(
        mut,
        seeds = [
            b"agent_registry",
            entry.agent_id.as_bytes(),
            owner_authority.key().as_ref()
        ],
        bump = entry.bump,
        has_one = owner_authority @ ErrorCode::Unauthorized,
        close = recipient
    )]
    pub entry: Account<'info, AgentRegistryEntryV1>,

    /// The authority that owns this agent entry
    pub owner_authority: Signer<'info>,
    
    /// The account that will receive the reclaimed rent
    #[account(mut)]
    pub recipient: SystemAccount<'info>,
}

/// Accounts required for the transfer_agent_ownership instruction
#[derive(Accounts)]
pub struct TransferAgentOwnership<'info> {
    /// The agent entry account (PDA)
    #[account(
        mut,
        seeds = [
            b"agent_registry",
            entry.agent_id.as_bytes(),
            current_owner_authority.key().as_ref()
        ],
        bump = entry.bump,
        has_one = current_owner_authority @ ErrorCode::Unauthorized
    )]
    pub entry: Account<'info, AgentRegistryEntryV1>,

    /// The current authority that owns this agent entry
    pub current_owner_authority: Signer<'info>,
    
    /// The new authority that will own this agent entry
    /// CHECK: This is just a pubkey, no need to validate it's a signer
    pub new_owner_authority: AccountInfo<'info>,
}
```

### B.2 MCP Server Registry Instructions

Below are the complete instruction definitions for the MCP Server Registry:

```rust
#[program]
pub mod mcp_server_registry {
    use super::*;

    /// Register a new MCP server in the registry
    pub fn register_mcp_server(ctx: Context<RegisterMCPServer>, args: RegisterMCPServerArgs) -> Result<()> {
        // Implementation details...
    }

    /// Update an existing MCP server entry
    pub fn update_mcp_server(ctx: Context<UpdateMCPServer>, args: UpdateMCPServerArgs) -> Result<()> {
        // Implementation details...
    }

    /// Update the status of an MCP server
    pub fn update_mcp_server_status(ctx: Context<UpdateMCPServerStatus>, new_status: u8) -> Result<()> {
        // Implementation details...
    }

    /// Close an MCP server entry and reclaim rent
    pub fn close_mcp_server_entry(ctx: Context<CloseMCPServerEntry>) -> Result<()> {
        // Implementation details...
    }

    /// Transfer ownership of an MCP server entry to a new authority
    pub fn transfer_mcp_server_ownership(ctx: Context<TransferMCPServerOwnership>) -> Result<()> {
        // Implementation details...
    }
}

/// Accounts required for the register_mcp_server instruction
#[derive(Accounts)]
#[instruction(args: RegisterMCPServerArgs)]
pub struct RegisterMCPServer<'info> {
    /// The account that will pay for the transaction and rent
    #[account(mut)]
    pub payer: Signer<'info>,

    /// The authority that will own this MCP server entry
    pub owner_authority: Signer<'info>,

    /// The MCP server entry account (PDA)
    #[account(
        init,
        payer = payer,
        space = 8 + MCPServerRegistryEntryV1::INIT_SPACE,
        seeds = [
            b"mcp_server_registry",
            args.server_id.as_bytes(),
            owner_authority.key().as_ref()
        ],
        bump
    )]
    pub entry: Account<'info, MCPServerRegistryEntryV1>,

    /// System program for creating the entry account
    pub system_program: Program<'info, System>,
}

/// Arguments for the register_mcp_server instruction
#[derive(AnchorSerialize, AnchorDeserialize, Clone)]
pub struct RegisterMCPServerArgs {
    /// Unique identifier for this MCP server
    pub server_id: String,
    
    /// Human-readable name of the MCP server
    pub name: String,
    
    /// Brief description of the server's purpose and capabilities
    pub description: String,
    
    /// Version of the MCP protocol implemented by this server
    pub mcp_version: String,
    
    /// Primary endpoint URL for connecting to this MCP server
    pub endpoint_url: String,
    
    /// List of models supported by this MCP server
    pub supported_models: Vec<ModelInfo>,
    
    /// Optional URL to documentation
    pub documentation_url: Option<String>,
    
    /// Optional URI pointing to extended metadata
    pub extended_metadata_uri: Option<String>,
    
    /// Bit flags representing server capabilities
    pub capabilities_flags: u64,
}

/// Accounts required for the update_mcp_server instruction
#[derive(Accounts)]
pub struct UpdateMCPServer<'info> {
    /// The MCP server entry account (PDA)
    #[account(
        mut,
        seeds = [
            b"mcp_server_registry",
            entry.server_id.as_bytes(),
            owner_authority.key().as_ref()
        ],
        bump = entry.bump,
        has_one = owner_authority @ ErrorCode::Unauthorized
    )]
    pub entry: Account<'info, MCPServerRegistryEntryV1>,

    /// The authority that owns this MCP server entry
    pub owner_authority: Signer<'info>,
}

/// Arguments for the update_mcp_server instruction
#[derive(AnchorSerialize, AnchorDeserialize, Clone)]
pub struct UpdateMCPServerArgs {
    /// Optional updated name
    pub name: Option<String>,
    
    /// Optional updated description
    pub description: Option<String>,
    
    /// Optional updated MCP version
    pub mcp_version: Option<String>,
    
    /// Optional updated endpoint URL
    pub endpoint_url: Option<String>,
    
    /// Optional updated supported models
    pub supported_models: Option<Vec<ModelInfo>>,
    
    /// Optional updated documentation URL
    pub documentation_url: Option<Option<String>>,
    
    /// Optional updated extended metadata URI
    pub extended_metadata_uri: Option<Option<String>>,
    
    /// Optional updated capabilities flags
    pub capabilities_flags: Option<u64>,
}

/// Accounts required for the update_mcp_server_status instruction
#[derive(Accounts)]
pub struct UpdateMCPServerStatus<'info> {
    /// The MCP server entry account (PDA)
    #[account(
        mut,
        seeds = [
            b"mcp_server_registry",
            entry.server_id.as_bytes(),
            owner_authority.key().as_ref()
        ],
        bump = entry.bump,
        has_one = owner_authority @ ErrorCode::Unauthorized
    )]
    pub entry: Account<'info, MCPServerRegistryEntryV1>,

    /// The authority that owns this MCP server entry
    pub owner_authority: Signer<'info>,
}

/// Accounts required for the close_mcp_server_entry instruction
#[derive(Accounts)]
pub struct CloseMCPServerEntry<'info> {
    /// The MCP server entry account (PDA)
    #[account(
        mut,
        seeds = [
            b"mcp_server_registry",
            entry.server_id.as_bytes(),
            owner_authority.key().as_ref()
        ],
        bump = entry.bump,
        has_one = owner_authority @ ErrorCode::Unauthorized,
        close = recipient
    )]
    pub entry: Account<'info, MCPServerRegistryEntryV1>,

    /// The authority that owns this MCP server entry
    pub owner_authority: Signer<'info>,
    
    /// The account that will receive the reclaimed rent
    #[account(mut)]
    pub recipient: SystemAccount<'info>,
}

/// Accounts required for the transfer_mcp_server_ownership instruction
#[derive(Accounts)]
pub struct TransferMCPServerOwnership<'info> {
    /// The MCP server entry account (PDA)
    #[account(
        mut,
        seeds = [
            b"mcp_server_registry",
            entry.server_id.as_bytes(),
            current_owner_authority.key().as_ref()
        ],
        bump = entry.bump,
        has_one = current_owner_authority @ ErrorCode::Unauthorized
    )]
    pub entry: Account<'info, MCPServerRegistryEntryV1>,

    /// The current authority that owns this MCP server entry
    pub current_owner_authority: Signer<'info>,
    
    /// The new authority that will own this MCP server entry
    /// CHECK: This is just a pubkey, no need to validate it's a signer
    pub new_owner_authority: AccountInfo<'info>,
}
```

## Appendix C: Error Codes

Below is the complete list of error codes for both registries:

```rust
/// Error codes for the Agent and MCP Server Registries
#[error_code]
pub enum ErrorCode {
    /// String exceeds maximum allowed length
    #[msg("String exceeds maximum allowed length")]
    StringTooLong = 6000,

    /// Collection contains too many items
    #[msg("Collection contains too many items")]
    TooManyItems = 6001,

    /// Agent ID format is invalid
    #[msg("Agent ID format is invalid")]
    InvalidAgentId = 6002,

    /// Server ID format is invalid
    #[msg("Server ID format is invalid")]
    InvalidServerId = 6003,

    /// URL format is invalid
    #[msg("URL format is invalid")]
    InvalidUrl = 6004,

    /// Status value is invalid
    #[msg("Status value is invalid")]
    InvalidStatus = 6005,

    /// No default endpoint specified
    #[msg("No default endpoint specified")]
    NoDefaultEndpoint = 6006,

    /// Multiple default endpoints specified
    #[msg("Multiple default endpoints specified")]
    MultipleDefaultEndpoints = 6007,

    /// Unauthorized operation
    #[msg("Unauthorized operation")]
    Unauthorized = 6008,

    /// Cannot transfer ownership to self
    #[msg("Cannot transfer ownership to self")]
    CannotTransferToSelf = 6009,

    /// Invalid model ID format
    #[msg("Invalid model ID format")]
    InvalidModelId = 6010,

    /// Invalid tool ID format
    #[msg("Invalid tool ID format")]
    InvalidToolId = 6011,

    /// Invalid schema hash format
    #[msg("Invalid schema hash format")]
    InvalidSchemaHash = 6012,

    /// Invalid protocol format
    #[msg("Invalid protocol format")]
    InvalidProtocol = 6013,

    /// Invalid skill tag format
    #[msg("Invalid skill tag format")]
    InvalidSkillTag = 6014,

    /// Invalid version format
    #[msg("Invalid version format")]
    InvalidVersion = 6015,
}
```

## Appendix D: Client SDK Examples

### D.1 TypeScript Client SDK for Agent Registry

Below is an example TypeScript client SDK for interacting with the Agent Registry:

```typescript
import * as anchor from '@project-serum/anchor';
import { Program } from '@project-serum/anchor';
import { PublicKey, Keypair, Connection, SystemProgram } from '@solana/web3.js';
import { AgentRegistry, IDL } from './agent_registry'; // Generated IDL

export class AgentRegistryClient {
  private program: Program<AgentRegistry>;
  private connection: Connection;

  constructor(
    connection: Connection,
    wallet: anchor.Wallet,
    programId: PublicKey
  ) {
    this.connection = connection;
    const provider = new anchor.AnchorProvider(
      connection,
      wallet,
      { commitment: 'confirmed' }
    );
    this.program = new Program<AgentRegistry>(IDL, programId, provider);
  }

  /**
   * Find the PDA for an agent entry
   */
  async findAgentEntryPDA(agentId: string, ownerAuthority: PublicKey): Promise<[PublicKey, number]> {
    return await PublicKey.findProgramAddress(
      [
        Buffer.from('agent_registry'),
        Buffer.from(agentId),
        ownerAuthority.toBuffer()
      ],
      this.program.programId
    );
  }

  /**
   * Register a new agent
   */
  async registerAgent(
    payer: Keypair,
    ownerAuthority: Keypair,
    args: {
      agentId: string;
      name: string;
      description: string;
      agentVersion: string;
      capabilitiesFlags: anchor.BN;
      supportedProtocols: string[];
      skillTags: string[];
      serviceEndpoints: {
        protocol: string;
        url: string;
        isDefault: boolean;
      }[];
      documentationUrl?: string;
      extendedMetadataUri?: string;
    }
  ): Promise<string> {
    const [entryPDA, _] = await this.findAgentEntryPDA(
      args.agentId,
      ownerAuthority.publicKey
    );

    const tx = await this.program.methods
      .registerAgent({
        agentId: args.agentId,
        name: args.name,
        description: args.description,
        agentVersion: args.agentVersion,
        capabilitiesFlags: args.capabilitiesFlags,
        supportedProtocols: args.supportedProtocols,
        skillTags: args.skillTags,
        serviceEndpoints: args.serviceEndpoints,
        documentationUrl: args.documentationUrl ? args.documentationUrl : null,
        extendedMetadataUri: args.extendedMetadataUri ? args.extendedMetadataUri : null,
      })
      .accounts({
        payer: payer.publicKey,
        ownerAuthority: ownerAuthority.publicKey,
        entry: entryPDA,
        systemProgram: SystemProgram.programId,
      })
      .signers([payer, ownerAuthority])
      .rpc();

    return tx;
  }

  /**
   * Update an existing agent
   */
  async updateAgent(
    ownerAuthority: Keypair,
    agentId: string,
    args: {
      name?: string;
      description?: string;
      agentVersion?: string;
      capabilitiesFlags?: anchor.BN;
      supportedProtocols?: string[];
      skillTags?: string[];
      serviceEndpoints?: {
        protocol: string;
        url: string;
        isDefault: boolean;
      }[];
      documentationUrl?: string | null;
      extendedMetadataUri?: string | null;
    }
  ): Promise<string> {
    const [entryPDA, _] = await this.findAgentEntryPDA(
      agentId,
      ownerAuthority.publicKey
    );

    const tx = await this.program.methods
      .updateAgent({
        name: args.name ? args.name : null,
        description: args.description ? args.description : null,
        agentVersion: args.agentVersion ? args.agentVersion : null,
        capabilitiesFlags: args.capabilitiesFlags ? args.capabilitiesFlags : null,
        supportedProtocols: args.supportedProtocols ? args.supportedProtocols : null,
        skillTags: args.skillTags ? args.skillTags : null,
        serviceEndpoints: args.serviceEndpoints ? args.serviceEndpoints : null,
        documentationUrl: args.documentationUrl !== undefined ? args.documentationUrl : null,
        extendedMetadataUri: args.extendedMetadataUri !== undefined ? args.extendedMetadataUri : null,
      })
      .accounts({
        entry: entryPDA,
        ownerAuthority: ownerAuthority.publicKey,
      })
      .signers([ownerAuthority])
      .rpc();

    return tx;
  }

  /**
   * Update agent status
   */
  async updateAgentStatus(
    ownerAuthority: Keypair,
    agentId: string,
    newStatus: number
  ): Promise<string> {
    const [entryPDA, _] = await this.findAgentEntryPDA(
      agentId,
      ownerAuthority.publicKey
    );

    const tx = await this.program.methods
      .updateAgentStatus(newStatus)
      .accounts({
        entry: entryPDA,
        ownerAuthority: ownerAuthority.publicKey,
      })
      .signers([ownerAuthority])
      .rpc();

    return tx;
  }

  /**
   * Close agent entry
   */
  async closeAgentEntry(
    ownerAuthority: Keypair,
    agentId: string,
    recipient: PublicKey
  ): Promise<string> {
    const [entryPDA, _] = await this.findAgentEntryPDA(
      agentId,
      ownerAuthority.publicKey
    );

    const tx = await this.program.methods
      .closeAgentEntry()
      .accounts({
        entry: entryPDA,
        ownerAuthority: ownerAuthority.publicKey,
        recipient: recipient,
      })
      .signers([ownerAuthority])
      .rpc();

    return tx;
  }

  /**
   * Transfer agent ownership
   */
  async transferAgentOwnership(
    currentOwnerAuthority: Keypair,
    agentId: string,
    newOwnerAuthority: PublicKey
  ): Promise<string> {
    const [entryPDA, _] = await this.findAgentEntryPDA(
      agentId,
      currentOwnerAuthority.publicKey
    );

    const tx = await this.program.methods
      .transferAgentOwnership()
      .accounts({
        entry: entryPDA,
        currentOwnerAuthority: currentOwnerAuthority.publicKey,
        newOwnerAuthority: newOwnerAuthority,
      })
      .signers([currentOwnerAuthority])
      .rpc();

    return tx;
  }

  /**
   * Fetch agent entry
   */
  async fetchAgentEntry(agentId: string, ownerAuthority: PublicKey): Promise<any> {
    const [entryPDA, _] = await this.findAgentEntryPDA(
      agentId,
      ownerAuthority
    );

    try {
      return await this.program.account.agentRegistryEntryV1.fetch(entryPDA);
    } catch (e) {
      console.error('Error fetching agent entry:', e);
      return null;
    }
  }

  /**
   * Find all agents by owner
   */
  async findAgentsByOwner(ownerAuthority: PublicKey): Promise<any[]> {
    const accounts = await this.program.account.agentRegistryEntryV1.all([
      {
        memcmp: {
          offset: 8 + 1 + 1, // After discriminator, bump, and registry_version
          bytes: ownerAuthority.toBase58(),
        },
      },
    ]);
    return accounts;
  }

  /**
   * Find agents by skill tag
   */
  async findAgentsBySkillTag(skillTag: string): Promise<any[]> {
    // Note: This is inefficient and should be done through an indexer
    // This is just for demonstration purposes
    const allAccounts = await this.program.account.agentRegistryEntryV1.all();
    return allAccounts.filter(account => 
      account.account.skillTags.some((tag: string) => tag === skillTag)
    );
  }
}
```

### D.2 Python Client SDK for MCP Server Registry

Below is an example Python client SDK for interacting with the MCP Server Registry:

```python
from solana.rpc.api import Client
from solana.rpc.types import TxOpts
from solana.keypair import Keypair
from solana.publickey import PublicKey
from solana.system_program import SYS_PROGRAM_ID
from solana.transaction import Transaction
from solana.rpc.commitment import Confirmed
from anchorpy import Program, Provider, Wallet
import json
import base64
import struct

class MCPServerRegistryClient:
    def __init__(self, rpc_url, program_id):
        self.client = Client(rpc_url)
        self.program_id = PublicKey(program_id)
        
        # Load IDL (in a real implementation, this would be loaded from a file)
        with open('mcp_server_registry.json', 'r') as f:
            self.idl = json.load(f)
        
        # Create provider and program
        self.provider = Provider(self.client, Wallet.local(), opts=TxOpts(skip_preflight=False, preflight_commitment=Confirmed))
        self.program = Program(self.idl, self.program_id, self.provider)
    
    def find_mcp_server_entry_pda(self, server_id, owner_authority):
        """Find the PDA for an MCP server entry"""
        seeds = [
            b"mcp_server_registry",
            server_id.encode('utf-8'),
            bytes(owner_authority)
        ]
        return PublicKey.find_program_address(seeds, self.program_id)
    
    def register_mcp_server(self, payer, owner_authority, args):
        """Register a new MCP server"""
        entry_pda, bump = self.find_mcp_server_entry_pda(
            args['server_id'],
            owner_authority.public_key
        )
        
        # Create instruction
        ix = self.program.instruction['register_mcp_server'](
            args,
            {
                'payer': payer.public_key,
                'owner_authority': owner_authority.public_key,
                'entry': entry_pda,
                'system_program': SYS_PROGRAM_ID,
            }
        )
        
        # Create and send transaction
        tx = Transaction().add(ix)
        signers = [payer, owner_authority]
        
        return self.client.send_transaction(
            tx, *signers, opts=TxOpts(skip_preflight=False, preflight_commitment=Confirmed)
        )
    
    def update_mcp_server(self, owner_authority, server_id, args):
        """Update an existing MCP server"""
        entry_pda, bump = self.find_mcp_server_entry_pda(
            server_id,
            owner_authority.public_key
        )
        
        # Create instruction
        ix = self.program.instruction['update_mcp_server'](
            args,
            {
                'entry': entry_pda,
                'owner_authority': owner_authority.public_key,
            }
        )
        
        # Create and send transaction
        tx = Transaction().add(ix)
        signers = [owner_authority]
        
        return self.client.send_transaction(
            tx, *signers, opts=TxOpts(skip_preflight=False, preflight_commitment=Confirmed)
        )
    
    def update_mcp_server_status(self, owner_authority, server_id, new_status):
        """Update MCP server status"""
        entry_pda, bump = self.find_mcp_server_entry_pda(
            server_id,
            owner_authority.public_key
        )
        
        # Create instruction
        ix = self.program.instruction['update_mcp_server_status'](
            new_status,
            {
                'entry': entry_pda,
                'owner_authority': owner_authority.public_key,
            }
        )
        
        # Create and send transaction
        tx = Transaction().add(ix)
        signers = [owner_authority]
        
        return self.client.send_transaction(
            tx, *signers, opts=TxOpts(skip_preflight=False, preflight_commitment=Confirmed)
        )
    
    def close_mcp_server_entry(self, owner_authority, server_id, recipient):
        """Close MCP server entry"""
        entry_pda, bump = self.find_mcp_server_entry_pda(
            server_id,
            owner_authority.public_key
        )
        
        # Create instruction
        ix = self.program.instruction['close_mcp_server_entry'](
            {
                'entry': entry_pda,
                'owner_authority': owner_authority.public_key,
                'recipient': recipient,
            }
        )
        
        # Create and send transaction
        tx = Transaction().add(ix)
        signers = [owner_authority]
        
        return self.client.send_transaction(
            tx, *signers, opts=TxOpts(skip_preflight=False, preflight_commitment=Confirmed)
        )
    
    def transfer_mcp_server_ownership(self, current_owner_authority, server_id, new_owner_authority):
        """Transfer MCP server ownership"""
        entry_pda, bump = self.find_mcp_server_entry_pda(
            server_id,
            current_owner_authority.public_key
        )
        
        # Create instruction
        ix = self.program.instruction['transfer_mcp_server_ownership'](
            {
                'entry': entry_pda,
                'current_owner_authority': current_owner_authority.public_key,
                'new_owner_authority': new_owner_authority,
            }
        )
        
        # Create and send transaction
        tx = Transaction().add(ix)
        signers = [current_owner_authority]
        
        return self.client.send_transaction(
            tx, *signers, opts=TxOpts(skip_preflight=False, preflight_commitment=Confirmed)
        )
    
    def fetch_mcp_server_entry(self, server_id, owner_authority):
        """Fetch MCP server entry"""
        entry_pda, bump = self.find_mcp_server_entry_pda(
            server_id,
            owner_authority
        )
        
        try:
            return self.program.account['mcp_server_registry_entry_v1'].fetch(entry_pda)
        except Exception as e:
            print(f"Error fetching MCP server entry: {e}")
            return None
    
    def find_mcp_servers_by_owner(self, owner_authority):
        """Find all MCP servers by owner"""
        # Calculate offset for owner_authority field
        # 8 bytes discriminator + 1 byte bump + 1 byte registry_version
        offset = 8 + 1 + 1
        
        filters = [
            {
                'memcmp': {
                    'offset': offset,
                    'bytes': str(owner_authority)
                }
            }
        ]
        
        return self.program.account['mcp_server_registry_entry_v1'].all(filters)
    
    def find_mcp_servers_by_model(self, model_id):
        """Find MCP servers supporting a specific model"""
        # Note: This is inefficient and should be done through an indexer
        # This is just for demonstration purposes
        all_accounts = self.program.account['mcp_server_registry_entry_v1'].all()
        
        matching_servers = []
        for account in all_accounts:
            for model in account.account.supported_models:
                if model.model_id == model_id:
                    matching_servers.append(account)
                    break
        
        return matching_servers
```

## Appendix E: Glossary of Terms

**A2A (Agent-to-Agent)**: A protocol for communication between autonomous agents, enabling them to exchange messages, requests, and responses.

**Account**: In Solana, a data structure that holds state. All data in Solana is stored in accounts.

**Anchor**: A framework for Solana program development that provides higher-level abstractions and safety features.

**AEA (Autonomous Economic Agent)**: A software agent capable of making economic decisions and interacting with other agents and systems autonomously.

**Agent**: An autonomous software entity that can perform tasks, make decisions, and interact with other agents and systems.

**Agent Registry**: A decentralized directory of autonomous agents, storing their metadata, capabilities, and connection information.

**Capabilities**: The specific functionalities or services an agent can provide, often represented as bit flags in the registry.

**CPI (Cross-Program Invocation)**: A mechanism in Solana that allows one program to call another program.

**Decentralized Identity (DID)**: A system for creating and managing digital identities without relying on a central authority.

**Discovery**: The process of finding agents or MCP servers that match specific criteria or requirements.

**Indexer**: An off-chain service that processes and indexes on-chain data to enable efficient querying.

**Instruction**: In Solana, a command that tells a program what operation to perform.

**MCP (Model Context Protocol)**: A protocol for interacting with AI models, standardizing requests and responses.

**MCP Server**: A server that implements the Model Context Protocol, providing access to one or more AI models.

**MCP Server Registry**: A decentralized directory of MCP servers, storing their metadata, supported models, and connection information.

**Model**: An AI model that can process inputs and generate outputs, often accessed through an MCP server.

**Owner Authority**: The public key that has permission to update or close a registry entry.

**PDA (Program Derived Address)**: An account address derived from a program ID and additional seeds, allowing programs to control specific accounts.

**Registry Entry**: A record in a registry containing metadata about an agent or MCP server.

**Service Endpoint**: A URL or connection string that specifies how to connect to an agent or server.

**Skill Tags**: Keywords or phrases that describe an agent's capabilities or areas of expertise.

**Solana**: A high-performance blockchain platform with fast transaction processing and low fees.

**Tool**: A function or capability that an AI model can use to perform specific tasks.

---
*End of Appendices*
