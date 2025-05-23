# Chapter 6: Implementation Guide

## 6.1 Setting Up the Development Environment

### 6.1.1 Required Tools and Dependencies

Implementing the Agent and MCP Server Registry protocols on Solana requires a specific set of tools and dependencies. Setting up the development environment correctly is the first step towards building and deploying these programs.

**Core Solana Development Tools:**

1.  **Rust Programming Language**: Solana programs are primarily written in Rust. Install the latest stable version using `rustup`:
    ```bash
    curl --proto "=https" --tlsv1.2 -sSf https://sh.rustup.rs | sh
    source $HOME/.cargo/env
    rustup update stable
    ```

2.  **Solana Tool Suite**: This suite includes the Solana CLI, validator tools, and SDKs. Install it following the official Solana documentation:
    ```bash
    sh -c "$(curl -sSfL https://release.solana.com/v1.18.4/install)" # Replace v1.18.4 with the desired version
    export PATH="$HOME/.local/share/solana/install/active_release/bin:$PATH"
    solana --version
    ```

3.  **Anchor Framework**: Anchor simplifies Solana program development by providing a framework with macros, IDL generation, and client libraries.
    -   **AVM (Anchor Version Manager)**: Recommended for managing multiple Anchor versions.
        ```bash
        cargo install --git https://github.com/coral-xyz/anchor avm --locked --force
        avm install latest
        avm use latest
        ```
    -   **Verify Installation**:
        ```bash
        anchor --version
        ```

**Node.js and Client-Side Tools:**

1.  **Node.js**: Required for running client-side JavaScript/TypeScript code and interacting with the Anchor framework.
    ```bash
    # Install Node Version Manager (nvm)
    curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.39.3/install.sh | bash
    export NVM_DIR="$HOME/.nvm"
    [ -s "$NVM_DIR/nvm.sh" ] && \. "$NVM_DIR/nvm.sh"
    
    # Install Node.js (LTS recommended)
    nvm install --lts
    node --version
    npm --version
    ```

2.  **Yarn or npm**: Package managers for Node.js projects.
    ```bash
    npm install -g yarn # Or use npm directly
    ```

3.  **TypeScript**: Strongly recommended for client-side development for type safety.
    ```bash
    npm install -g typescript
    tsc --version
    ```

**Development Environment Setup:**

1.  **Code Editor**: Visual Studio Code (VS Code) with the `rust-analyzer` and `Anchor Snippets` extensions is highly recommended.

2.  **Local Solana Cluster**: For testing, run a local validator:
    ```bash
    solana-test-validator
    ```
    This command starts a local cluster and provides an RPC endpoint (usually `http://127.0.0.1:8899`) and a faucet for obtaining test SOL.

3.  **Configuration**: Configure the Solana CLI to point to your desired cluster (local, devnet, testnet, or mainnet-beta):
    ```bash
    solana config set --url localhost # Or devnet, testnet, mainnet-beta
    solana config get
    ```

**Project Structure (Anchor):**

An Anchor project typically has the following structure:

```
my_registry_project/
├── Anchor.toml        # Project configuration
├── Cargo.toml         # Rust dependencies
├── migrations/        # Deployment scripts (optional)
│   └── deploy.ts
├── programs/
│   └── my_registry/   # Solana program source code
│       ├── Cargo.toml
│       └── src/
│           └── lib.rs # Main program logic
├── target/            # Build artifacts
├── tests/             # Integration tests (TypeScript/JavaScript)
│   └── my_registry.ts
└── app/               # Optional frontend application
```

```
+---------------------------+
|      Development PC       |
+---------------------------+
|   Operating System (Linux,| 
|   macOS, Windows/WSL)     |
+---------------------------+
| Tools Installed:          |
| - Rust + Cargo            |
| - Solana Tool Suite       |
| - Anchor Framework (AVM)  |
| - Node.js + npm/yarn    |
| - TypeScript              |
| - Code Editor (VS Code)   |
+---------------------------+
| Configuration:            |
| - Solana CLI (url, key) |
| - Anchor.toml           |
+---------------------------+
| Running Processes:        |
| - solana-test-validator | 
|   (Local Cluster)         |
+---------------------------+
```

With these tools installed and configured, you are ready to start implementing the Agent and MCP Server Registry programs using the Anchor framework.

### 6.1.2 Anchor Project Initialization

Anchor provides commands to initialize a new Solana program project with the standard directory structure and configuration files.

**Initializing a New Project:**

Use the `anchor init` command to create a new project:

```bash
anchor init agent-registry --program-name agent_registry
cd agent-registry
```

This command creates a new directory named `agent-registry` with the following key components:

-   **`Anchor.toml`**: The main configuration file for the Anchor project. It defines the program(s), provider settings, testing configurations, and cluster URLs.

    ```toml
    [features]
    seeds = false
    skip-lint = false
    
    [programs.localnet] # Configuration for localnet cluster
    agent_registry = "Fg6PaFpoGXkYsidMpWxqSWpba3f2Jp5jVnXNCSr9NMSB" # Placeholder Program ID
    
    [programs.devnet]   # Configuration for devnet cluster
    agent_registry = "Fg6PaFpoGXkYsidMpWxqSWpba3f2Jp5jVnXNCSr9NMSB" # Placeholder Program ID
    
    [registry]
    url = "https://api.apr.dev"
    
    [provider]
    cluster = "Localnet" # Default cluster (can be Localnet, Devnet, Testnet, Mainnet)
    wallet = "~/.config/solana/id.json" # Default wallet path
    
    [scripts]
    test = "yarn run ts-mocha -p ./tsconfig.json -t 1000000 tests/**/*.ts"
    ```

-   **`programs/agent_registry/src/lib.rs`**: The main Rust source file for your Solana program. Anchor initializes it with a basic example instruction.

    ```rust
    use anchor_lang::prelude::*;
    
    declare_id!("Fg6PaFpoGXkYsidMpWxqSWpba3f2Jp5jVnXNCSr9NMSB"); // Placeholder Program ID
    
    #[program]
    pub mod agent_registry {
        use super::*;
    
        pub fn initialize(ctx: Context<Initialize>) -> Result<()> {
            Ok(())
        }
    }
    
    #[derive(Accounts)]
    pub struct Initialize {}
    ```

-   **`tests/agent_registry.ts`**: An example integration test file written in TypeScript, demonstrating how to interact with the program using the Anchor client library.

-   **`Cargo.toml` (Root and Program)**: Define Rust dependencies for the workspace and the specific program.

-   **`package.json`**: Defines Node.js dependencies for testing and client-side interaction (e.g., `@coral-xyz/anchor`, `@solana/web3.js`, `mocha`, `chai`).

**Building the Project:**

Use the `anchor build` command to compile the Rust program into Solana BPF bytecode and generate the Interface Definition Language (IDL) file:

```bash
anchor build
```

This command performs several actions:

1.  Compiles the Rust code in `programs/agent_registry/`.
2.  Generates the BPF bytecode file (`target/deploy/agent_registry.so`).
3.  Generates the IDL file (`target/idl/agent_registry.json`), which describes the program's instructions, accounts, types, and events.
4.  Generates TypeScript type definitions based on the IDL (`target/types/agent_registry.ts`).

**Deploying the Program (Localnet):**

Before deploying, ensure your local validator is running (`solana-test-validator`).

Use the `anchor deploy` command:

```bash
anchor deploy
```

This command:

1.  Builds the program if necessary.
2.  Deploys the BPF bytecode (`agent_registry.so`) to the configured cluster (Localnet by default).
3.  Outputs the Program ID of the deployed program.
4.  Updates `Anchor.toml` and `lib.rs` with the new Program ID.

**Running Tests:**

Use the `anchor test` command to run the integration tests defined in the `tests/` directory:

```bash
anchor test
```

This command:

1.  Starts a local validator if one isn't running.
2.  Builds and deploys the program to the local validator.
3.  Executes the TypeScript tests using the configured test runner (Mocha by default).

Initializing the project correctly with Anchor sets the stage for efficient development, providing the necessary structure, configuration, and build tools to implement the registry protocols.

## 6.2 Implementing Agent Registry Program

### 6.2.1 Defining Account Structures

Based on the protocol design in Chapter 3, we define the `AgentRegistryEntryV1` account structure using Anchor's `#[account]` macro. This structure holds all the metadata for a registered agent.

```rust
// programs/agent_registry/src/lib.rs

use anchor_lang::prelude::*;
use anchor_lang::solana_program::clock::Clock;

// Replace with the actual deployed Program ID after first deploy
declare_id!("AGENTregxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx");

// Define constants for max lengths to avoid magic numbers
const MAX_AGENT_ID_LEN: usize = 64;
const MAX_NAME_LEN: usize = 128;
const MAX_DESCRIPTION_LEN: usize = 512;
const MAX_VERSION_LEN: usize = 32;
const MAX_ENDPOINT_LEN: usize = 256;
const MAX_SKILL_TAG_LEN: usize = 32;
const MAX_SKILL_TAGS: usize = 10;
const MAX_SERVICE_ENDPOINTS: usize = 3;

#[program]
pub mod agent_registry {
    use super::*;
    // Instructions will be defined here
}

// --- Account Structures --- 

#[account]
#[derive(InitSpace)] // Automatically calculate space for account initialization
pub struct AgentRegistryEntryV1 {
    // Metadata
    pub bump: u8,
    pub registry_version: u8,
    pub owner_authority: Pubkey,
    pub status: u8, // Enum AgentStatus
    pub capabilities_flags: u64, // Bitfield AgentCapabilityFlags
    pub created_at: i64,
    pub updated_at: i64,
    
    // Identity
    #[max_len(MAX_AGENT_ID_LEN)]
    pub agent_id: String,
    #[max_len(MAX_NAME_LEN)]
    pub name: String,
    #[max_len(MAX_DESCRIPTION_LEN)]
    pub description: String,
    #[max_len(MAX_VERSION_LEN)]
    pub agent_version: String,
    
    // Technical Details
    pub supported_protocols: Vec<String>, // Max 5 protocols, each max 64 chars
    #[max_len(MAX_SKILL_TAGS)]
    pub skill_tags: Vec<String>, // Each tag max MAX_SKILL_TAG_LEN
    
    // Endpoints
    #[max_len(MAX_SERVICE_ENDPOINTS)]
    pub service_endpoints: Vec<ServiceEndpoint>,
    
    // Optional Metadata
    pub documentation_url: Option<String>, // Max 256 chars
    pub extended_metadata_uri: Option<String>, // Max 256 chars
}

#[derive(AnchorSerialize, AnchorDeserialize, Clone, InitSpace)]
pub struct ServiceEndpoint {
    #[max_len(64)] // Max protocol name length
    pub protocol: String,
    #[max_len(MAX_ENDPOINT_LEN)]
    pub url: String,
    pub is_default: bool,
}

// --- Enums and Flags --- 

#[derive(AnchorSerialize, AnchorDeserialize, Clone, PartialEq, Eq)]
pub enum AgentStatus {
    Inactive = 0,
    Active = 1,
    Deprecated = 2,
}

pub mod AgentCapabilityFlags {
    pub const A2A_MESSAGING: u64 = 1 << 0; // Supports Agent-to-Agent protocol
    pub const MCP_CLIENT: u64 = 1 << 1;    // Can act as an MCP client
    pub const TASK_EXECUTION: u64 = 1 << 2; // Can execute tasks
    pub const DATA_QUERYING: u64 = 1 << 3;  // Can query data sources
    // Add more flags as needed
}

// --- Events --- 
// Events will be defined here

// --- Errors --- 
#[error_code]
pub enum ErrorCode {
    #[msg("String exceeds maximum length.")]
    StringTooLong,
    #[msg("Too many items in collection.")]
    TooManyItems,
    #[msg("Invalid Agent ID format.")]
    InvalidAgentId,
    #[msg("Invalid status value.")]
    InvalidStatus,
    #[msg("No default service endpoint provided.")]
    NoDefaultEndpoint,
    #[msg("Unauthorized operation.")]
    Unauthorized,
    #[msg("Cannot transfer ownership to the same owner.")]
    CannotTransferToSelf,
    #[msg("Invalid protocol name.")]
    InvalidProtocolName,
    #[msg("Invalid skill tag.")]
    InvalidSkillTag,
}

// Helper function for validation (example)
fn is_valid_agent_id(id: &str) -> bool {
    id.len() > 0 && id.len() <= MAX_AGENT_ID_LEN && id.chars().all(|c| c.is_ascii_alphanumeric() || c == '-' || c == '_')
}

// Instruction contexts and handlers will follow...
```

**Key Aspects:**

1.  **`#[account]` Macro**: Marks the struct as a Solana account data structure that Anchor can manage.
2.  **`#[derive(InitSpace)]`**: Automatically calculates the required space for the account based on its fields, including `Option` and `Vec` types with `#[max_len]` annotations. This is crucial for the `init` constraint in instruction contexts.
3.  **`#[max_len(...)]`**: Specifies the maximum size for variable-length fields like `String` and `Vec`. This is essential for `InitSpace` calculation and preventing unbounded account growth.
4.  **Constants**: Using constants (`MAX_AGENT_ID_LEN`, etc.) improves readability and maintainability.
5.  **Enums and Flags**: Define enums (`AgentStatus`) and bitflags (`AgentCapabilityFlags`) for structured representation of status and capabilities.
6.  **Nested Structs**: Define nested structs like `ServiceEndpoint` and derive necessary traits (`AnchorSerialize`, `AnchorDeserialize`, `Clone`, `InitSpace`).
7.  **Error Codes**: Define custom error codes using `#[error_code]` for clear error reporting.

This structure provides a solid foundation for storing agent metadata on-chain, balancing comprehensiveness with storage efficiency.

### 6.2.2 Implementing Registration Instruction

The `register_agent` instruction initializes a new `AgentRegistryEntryV1` PDA account.

**Instruction Context (`RegisterAgent`):**

Defines the accounts required for the instruction.

```rust
// --- Instruction Contexts --- 

#[derive(Accounts)]
#[instruction(args: RegisterAgentArgs)] // Link to instruction arguments struct
pub struct RegisterAgent<'info> {
    #[account(
        init, // Initialize the account
        payer = payer, // Account funding the initialization
        space = 8 + AgentRegistryEntryV1::INIT_SPACE, // Calculate space (8 bytes for discriminator)
        seeds = [
            b"agent_registry".as_ref(),
            args.agent_id.as_bytes(),
            owner_authority.key().as_ref(),
        ],
        bump // Store the bump seed
    )]
    pub entry: Account<'info, AgentRegistryEntryV1>,

    #[account(mut)] // Payer needs to be mutable to sign and pay for account creation
    pub payer: Signer<'info>,

    /// CHECK: The owner authority is validated as a signer.
    /// It doesn't need to be an existing account, just a valid keypair signing the tx.
    pub owner_authority: Signer<'info>,

    pub system_program: Program<'info, System>, // Required for account initialization
}
```

**Instruction Arguments (`RegisterAgentArgs`):**

Defines the data passed into the instruction.

```rust
// --- Instruction Arguments --- 

#[derive(AnchorSerialize, AnchorDeserialize, Clone)]
pub struct RegisterAgentArgs {
    pub agent_id: String,
    pub name: String,
    pub description: String,
    pub agent_version: String,
    pub supported_protocols: Vec<String>,
    pub skill_tags: Vec<String>,
    pub service_endpoints: Vec<ServiceEndpoint>,
    pub capabilities_flags: u64,
    pub documentation_url: Option<String>,
    pub extended_metadata_uri: Option<String>,
}
```

**Instruction Handler (`register_agent`):**

Contains the core logic for validation and initialization.

```rust
// --- Instruction Handlers --- 

impl AgentRegistryEntryV1 {
    // Helper to validate string lengths within the main struct
    fn validate_lengths(&self) -> Result<()> {
        require!(self.agent_id.len() <= MAX_AGENT_ID_LEN, ErrorCode::StringTooLong);
        require!(self.name.len() <= MAX_NAME_LEN, ErrorCode::StringTooLong);
        // ... other length checks ...
        Ok(())
    }
}

impl ServiceEndpoint {
     // Helper to validate string lengths within the nested struct
    fn validate_lengths(&self) -> Result<()> {
        require!(self.protocol.len() <= 64, ErrorCode::StringTooLong);
        require!(self.url.len() <= MAX_ENDPOINT_LEN, ErrorCode::StringTooLong);
        Ok(())
    }
}

pub fn register_agent(ctx: Context<RegisterAgent>, args: RegisterAgentArgs) -> Result<()> {
    // --- Validation --- 
    require!(is_valid_agent_id(&args.agent_id), ErrorCode::InvalidAgentId);
    require!(args.name.len() <= MAX_NAME_LEN, ErrorCode::StringTooLong);
    require!(args.description.len() <= MAX_DESCRIPTION_LEN, ErrorCode::StringTooLong);
    require!(args.agent_version.len() <= MAX_VERSION_LEN, ErrorCode::StringTooLong);
    
    require!(args.supported_protocols.len() <= 5, ErrorCode::TooManyItems);
    for proto in &args.supported_protocols {
        require!(proto.len() <= 64, ErrorCode::StringTooLong);
        // Add more specific protocol validation if needed
    }

    require!(args.skill_tags.len() <= MAX_SKILL_TAGS, ErrorCode::TooManyItems);
    for tag in &args.skill_tags {
        require!(tag.len() > 0 && tag.len() <= MAX_SKILL_TAG_LEN, ErrorCode::InvalidSkillTag);
        // Add more specific tag validation if needed
    }

    require!(args.service_endpoints.len() > 0 && args.service_endpoints.len() <= MAX_SERVICE_ENDPOINTS, ErrorCode::TooManyItems);
    require!(args.service_endpoints.iter().filter(|ep| ep.is_default).count() == 1, ErrorCode::NoDefaultEndpoint);
    for ep in &args.service_endpoints {
       ep.validate_lengths()?; // Validate nested struct lengths
       // Add URL validation if needed
    }

    if let Some(url) = &args.documentation_url {
        require!(url.len() <= 256, ErrorCode::StringTooLong);
    }
    if let Some(uri) = &args.extended_metadata_uri {
        require!(uri.len() <= 256, ErrorCode::StringTooLong);
    }

    // --- Initialization --- 
    let entry = &mut ctx.accounts.entry;
    let clock = Clock::get()?;

    entry.bump = *ctx.bumps.get("entry").ok_or(ProgramError::InvalidSeeds)?; // Get bump from context
    entry.registry_version = 1;
    entry.owner_authority = ctx.accounts.owner_authority.key();
    entry.status = AgentStatus::Active as u8;
    entry.capabilities_flags = args.capabilities_flags;
    entry.created_at = clock.unix_timestamp;
    entry.updated_at = clock.unix_timestamp;
    
    entry.agent_id = args.agent_id;
    entry.name = args.name;
    entry.description = args.description;
    entry.agent_version = args.agent_version;
    
    entry.supported_protocols = args.supported_protocols;
    entry.skill_tags = args.skill_tags;
    entry.service_endpoints = args.service_endpoints;
    
    entry.documentation_url = args.documentation_url;
    entry.extended_metadata_uri = args.extended_metadata_uri;

    // --- Event Emission --- 
    emit!(AgentRegisteredEvent {
        agent_id: entry.agent_id.clone(),
        owner: entry.owner_authority,
        timestamp: entry.created_at,
    });

    msg!("Agent registered: {}", entry.agent_id);
    Ok(())
}

// --- Event Definition --- 
#[event]
pub struct AgentRegisteredEvent {
    pub agent_id: String,
    pub owner: Pubkey,
    pub timestamp: i64,
}
```

**Key Logic:**

1.  **Validation**: Thoroughly validates all input arguments against defined constraints (lengths, formats, counts).
2.  **PDA Initialization**: The `#[account(init...)]` macro handles the creation of the PDA account, space allocation, and rent payment.
3.  **Data Population**: Populates the fields of the newly created `entry` account with validated data from `args` and context (bump, owner, timestamps).
4.  **Event Emission**: Emits an `AgentRegisteredEvent` using `emit!` for off-chain indexers.
5.  **Logging**: Uses `msg!` for on-chain program logging (useful for debugging).

### 6.2.3 Implementing Update and Deregistration

**Update Instruction:**

Allows the owner to modify certain fields of an existing entry.

```rust
// --- Update Instruction --- 

#[derive(Accounts)]
#[instruction(args: UpdateAgentArgs)]
pub struct UpdateAgent<'info> {
    #[account(
        mut, // Entry needs to be mutable to be updated
        seeds = [
            b"agent_registry".as_ref(),
            entry.agent_id.as_bytes(), // Use agent_id from the existing entry
            owner_authority.key().as_ref(),
        ],
        bump = entry.bump, // Use the stored bump for verification
        has_one = owner_authority @ ErrorCode::Unauthorized // Verify signer is the owner
    )]
    pub entry: Account<'info, AgentRegistryEntryV1>,

    pub owner_authority: Signer<'info>,
}

#[derive(AnchorSerialize, AnchorDeserialize, Clone)]
pub struct UpdateAgentArgs {
    // Use Option<> for fields that can be updated selectively
    pub name: Option<String>,
    pub description: Option<String>,
    pub agent_version: Option<String>,
    pub supported_protocols: Option<Vec<String>>,
    pub skill_tags: Option<Vec<String>>,
    pub service_endpoints: Option<Vec<ServiceEndpoint>>,
    pub capabilities_flags: Option<u64>,
    pub documentation_url: Option<Option<String>>, // Option<Option<T>> to allow setting to None
    pub extended_metadata_uri: Option<Option<String>>,
}

pub fn update_agent(ctx: Context<UpdateAgent>, args: UpdateAgentArgs) -> Result<()> {
    let entry = &mut ctx.accounts.entry;
    let clock = Clock::get()?;
    let mut updated_fields = Vec::new();

    // Selectively update fields if Some(value) is provided
    if let Some(name) = args.name {
        require!(name.len() <= MAX_NAME_LEN, ErrorCode::StringTooLong);
        entry.name = name;
        updated_fields.push("name".to_string());
    }
    if let Some(description) = args.description {
        require!(description.len() <= MAX_DESCRIPTION_LEN, ErrorCode::StringTooLong);
        entry.description = description;
        updated_fields.push("description".to_string());
    }
    // ... update other optional fields similarly, performing validation ...
    if let Some(endpoints) = args.service_endpoints {
        require!(endpoints.len() > 0 && endpoints.len() <= MAX_SERVICE_ENDPOINTS, ErrorCode::TooManyItems);
        require!(endpoints.iter().filter(|ep| ep.is_default).count() == 1, ErrorCode::NoDefaultEndpoint);
        for ep in &endpoints {
           ep.validate_lengths()?;
        }
        entry.service_endpoints = endpoints;
        updated_fields.push("service_endpoints".to_string());
    }
    if let Some(flags) = args.capabilities_flags {
        entry.capabilities_flags = flags;
        updated_fields.push("capabilities_flags".to_string());
    }
    // Handle Option<Option<T>> for optional fields that can be unset
    if let Some(maybe_url) = args.documentation_url {
        if let Some(url) = &maybe_url {
             require!(url.len() <= 256, ErrorCode::StringTooLong);
        }
        entry.documentation_url = maybe_url;
        updated_fields.push("documentation_url".to_string());
    }
     if let Some(maybe_uri) = args.extended_metadata_uri {
        if let Some(uri) = &maybe_uri {
             require!(uri.len() <= 256, ErrorCode::StringTooLong);
        }
        entry.extended_metadata_uri = maybe_uri;
        updated_fields.push("extended_metadata_uri".to_string());
    }

    // Always update the timestamp
    entry.updated_at = clock.unix_timestamp;

    // Emit event
    emit!(AgentUpdatedEvent {
        agent_id: entry.agent_id.clone(),
        owner: entry.owner_authority,
        updated_fields,
        timestamp: entry.updated_at,
    });

    msg!("Agent updated: {}", entry.agent_id);
    Ok(())
}

#[event]
pub struct AgentUpdatedEvent {
    pub agent_id: String,
    pub owner: Pubkey,
    pub updated_fields: Vec<String>,
    pub timestamp: i64,
}
```

**Deregistration (Close Account) Instruction:**

Allows the owner to close the PDA account and reclaim rent.

```rust
// --- Deregistration Instruction --- 

#[derive(Accounts)]
pub struct CloseAgentEntry<'info> {
    #[account(
        mut,
        seeds = [
            b"agent_registry".as_ref(),
            entry.agent_id.as_bytes(),
            owner_authority.key().as_ref(),
        ],
        bump = entry.bump,
        has_one = owner_authority @ ErrorCode::Unauthorized,
        close = recipient // Close account and transfer lamports to recipient
    )]
    pub entry: Account<'info, AgentRegistryEntryV1>,

    pub owner_authority: Signer<'info>,

    #[account(mut)] // Recipient needs to be mutable to receive lamports
    pub recipient: SystemAccount<'info>,
}

pub fn close_agent_entry(ctx: Context<CloseAgentEntry>) -> Result<()> {
    let entry = &ctx.accounts.entry; // Borrow entry to read data before close

    // Emit event before account is closed
    emit!(AgentRemovedEvent {
        agent_id: entry.agent_id.clone(),
        owner: entry.owner_authority,
        timestamp: Clock::get()?.unix_timestamp,
    });

    msg!("Agent removed: {}", entry.agent_id);
    // Anchor handles the actual account closing via the `close = recipient` constraint
    Ok(())
}

#[event]
pub struct AgentRemovedEvent {
    pub agent_id: String,
    pub owner: Pubkey,
    pub timestamp: i64,
}
```

**Key Logic:**

1.  **Authorization**: Both instructions use `has_one = owner_authority` to ensure only the registered owner can perform the action.
2.  **PDA Verification**: The `seeds` and `bump` constraints verify that the correct PDA account is being accessed.
3.  **Selective Updates**: The `update_agent` instruction uses `Option` in its arguments to allow partial updates.
4.  **Account Closure**: The `close_agent_entry` instruction uses Anchor's `close = recipient` constraint to handle the secure closure of the account and rent reclamation.
5.  **Event Emission**: Events (`AgentUpdatedEvent`, `AgentRemovedEvent`) are emitted to notify indexers.

These instructions provide the necessary mechanisms for managing the lifecycle of agent entries after registration.

## 6.3 Implementing MCP Server Registry Program

### 6.3.1 Defining Account Structures

The process mirrors the Agent Registry, defining the `MCPServerRegistryEntryV1` account structure based on Chapter 4.

```rust
// programs/mcp_server_registry/src/lib.rs (assuming separate program)

use anchor_lang::prelude::*;
use anchor_lang::solana_program::clock::Clock;

// Replace with the actual deployed Program ID
declare_id!("MCPSRregxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx");

// Define constants (similar to Agent Registry, adjust as needed)
const MAX_SERVER_ID_LEN: usize = 64;
const MAX_NAME_LEN: usize = 128;
const MAX_DESCRIPTION_LEN: usize = 512;
const MAX_VERSION_LEN: usize = 32;
const MAX_ENDPOINT_LEN: usize = 256;
const MAX_MCP_VERSION_LEN: usize = 16;
const MAX_MCP_VERSIONS: usize = 5;
const MAX_MODEL_ID_LEN: usize = 64;
const MAX_MODEL_NAME_LEN: usize = 128;
const MAX_MODEL_TYPE_LEN: usize = 32;
const MAX_MODELS: usize = 10;
const MAX_TOOL_ID_LEN: usize = 64;
const MAX_TOOL_NAME_LEN: usize = 128;
const MAX_TOOL_DESC_LEN: usize = 256;
const MAX_TOOL_VERSION_LEN: usize = 32;
const MAX_TOOL_SCHEMA_URI_LEN: usize = 256;
const MAX_TOOLS: usize = 20;
const MAX_PROVIDER_NAME_LEN: usize = 128;
const MAX_PROVIDER_URL_LEN: usize = 256;
const MAX_DOCS_URL_LEN: usize = 256;
const MAX_SECURITY_URI_LEN: usize = 256;
const MAX_PRICING_URI_LEN: usize = 256;
const MAX_EXTENDED_URI_LEN: usize = 256;
const MAX_SERVICE_ENDPOINTS: usize = 3;

#[program]
pub mod mcp_server_registry {
    use super::*;
    // Instructions will be defined here
}

// --- Account Structures --- 

#[account]
#[derive(InitSpace)]
pub struct MCPServerRegistryEntryV1 {
    // Metadata
    pub bump: u8,
    pub registry_version: u8,
    pub owner_authority: Pubkey,
    pub status: u8, // Enum ServerStatus
    pub capabilities_flags: u64, // Bitfield ServerCapabilityFlags
    pub created_at: i64,
    pub updated_at: i64,
    
    // Identity
    #[max_len(MAX_SERVER_ID_LEN)]
    pub server_id: String,
    #[max_len(MAX_NAME_LEN)]
    pub name: String,
    #[max_len(MAX_VERSION_LEN)]
    pub server_version: String,
    
    // MCP Specific
    #[max_len(MAX_MCP_VERSIONS)]
    pub supported_mcp_versions: Vec<String>, // Each max MAX_MCP_VERSION_LEN
    pub max_context_length: u32,
    pub max_token_limit: u32,
    
    // Description
    #[max_len(MAX_DESCRIPTION_LEN)]
    pub description: String,
    
    // Models
    #[max_len(MAX_MODELS)]
    pub models: Vec<ModelInfo>,
    
    // Tools
    #[max_len(MAX_TOOLS)]
    pub supported_tools: Vec<ToolInfo>,
    
    // Optional Metadata
    pub provider_name: Option<String>, // Max MAX_PROVIDER_NAME_LEN
    pub provider_url: Option<String>, // Max MAX_PROVIDER_URL_LEN
    pub documentation_url: Option<String>, // Max MAX_DOCS_URL_LEN
    pub security_info_uri: Option<String>, // Max MAX_SECURITY_URI_LEN
    
    // Operational Parameters
    pub rate_limit_requests: Option<u32>,
    pub rate_limit_tokens: Option<u32>,
    pub pricing_info_uri: Option<String>, // Max MAX_PRICING_URI_LEN
    
    // Endpoints
    #[max_len(MAX_SERVICE_ENDPOINTS)]
    pub service_endpoints: Vec<ServiceEndpoint>,
    
    // Off-chain Extension
    pub extended_metadata_uri: Option<String>, // Max MAX_EXTENDED_URI_LEN
}

#[derive(AnchorSerialize, AnchorDeserialize, Clone, InitSpace)]
pub struct ModelInfo {
    #[max_len(MAX_MODEL_ID_LEN)]
    pub model_id: String,
    #[max_len(MAX_MODEL_NAME_LEN)]
    pub display_name: String,
    #[max_len(MAX_MODEL_TYPE_LEN)]
    pub model_type: String,
    pub capabilities_flags: u64, // Bitfield ModelCapabilityFlags
    pub context_window: u32,
    pub max_output_tokens: u32,
    pub description_hash: Option<[u8; 32]>,
}

#[derive(AnchorSerialize, AnchorDeserialize, Clone, InitSpace)]
pub struct ToolInfo {
    #[max_len(MAX_TOOL_ID_LEN)]
    pub tool_id: String,
    #[max_len(MAX_TOOL_NAME_LEN)]
    pub name: String,
    #[max_len(MAX_TOOL_DESC_LEN)]
    pub description: String,
    #[max_len(MAX_TOOL_VERSION_LEN)]
    pub version: String,
    pub schema_hash: [u8; 32],
    #[max_len(MAX_TOOL_SCHEMA_URI_LEN)]
    pub schema_uri: String,
}

// Re-use ServiceEndpoint struct from Agent Registry or define here if separate program
#[derive(AnchorSerialize, AnchorDeserialize, Clone, InitSpace)]
pub struct ServiceEndpoint {
    #[max_len(64)]
    pub protocol: String,
    #[max_len(MAX_ENDPOINT_LEN)]
    pub url: String,
    pub is_default: bool,
}

// --- Enums and Flags --- 

#[derive(AnchorSerialize, AnchorDeserialize, Clone, PartialEq, Eq)]
pub enum ServerStatus {
    Inactive = 0,
    Active = 1,
    Maintenance = 2,
    Deprecated = 3,
}

pub mod ServerCapabilityFlags {
    pub const STREAMING: u64 = 1 << 0;
    pub const BATCHING: u64 = 1 << 1;
    pub const FUNCTION_CALLING: u64 = 1 << 2;
    pub const VISION: u64 = 1 << 3;
    pub const AUDIO: u64 = 1 << 4;
    pub const EMBEDDINGS: u64 = 1 << 5;
    pub const FINE_TUNING: u64 = 1 << 6;
    pub const CUSTOM_TOOLS: u64 = 1 << 7;
}

pub mod ModelCapabilityFlags {
    pub const TEXT_GENERATION: u64 = 1 << 0;
    pub const IMAGE_UNDERSTANDING: u64 = 1 << 1;
    pub const CODE_GENERATION: u64 = 1 << 2;
    pub const FUNCTION_CALLING: u64 = 1 << 3; // Model-level function calling support
    pub const EMBEDDINGS: u64 = 1 << 4;
}

// --- Errors --- 
#[error_code]
pub enum ErrorCode {
    #[msg("String exceeds maximum length.")]
    StringTooLong,
    #[msg("Too many items in collection.")]
    TooManyItems,
    #[msg("Invalid Server ID format.")]
    InvalidServerId,
    #[msg("Invalid status value.")]
    InvalidStatus,
    #[msg("No default service endpoint provided.")]
    NoDefaultEndpoint,
    #[msg("Unauthorized operation.")]
    Unauthorized,
    #[msg("Invalid MCP version format.")]
    InvalidMCPVersion,
    #[msg("Invalid Model Info.")]
    InvalidModelInfo,
    #[msg("Invalid Tool Info.")]
    InvalidToolInfo,
    #[msg("Invalid URI format.")]
    InvalidUri,
}

// Helper function for validation (example)
fn is_valid_mcp_version(version: &str) -> bool {
    // Basic check for YYYY-MM-DD format
    version.len() == 10 && version.chars().filter(|&c| c == '-').count() == 2
    // Add more robust date parsing/validation if needed
}

// Instruction contexts and handlers will follow...
```

**Key Differences from Agent Registry:**

-   Different PDA seeds (`b
