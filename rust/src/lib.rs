//! # Solana AI Registries SDK
//! 
//! This crate provides a Rust SDK for interacting with the Solana AI Registries,
//! which includes both Agent Registry and MCP Server Registry protocols.
//! 
//! ## Features
//! 
//! - **Agent Registry**: Register, update, and manage autonomous agents
//! - **MCP Server Registry**: Register, update, and manage Model Context Protocol servers
//! - **Payment Systems**: Support for prepay, pay-as-you-go, and streaming payments
//! - **Type Safety**: Fully typed requests and responses
//! - **Error Handling**: Comprehensive error types matching on-chain program errors
//! 
//! ## Feature Flags
//! 
//! - `stream`: Enable streaming payment functionality
//! - `pyg`: Enable pay-as-you-go payment functionality  
//! - `prepay`: Enable prepaid payment functionality
//! 
//! ## Example Usage
//! 
//! ```rust,no_run
//! use solana_ai_registries::{SolanaAiRegistriesClient, AgentBuilder};
//! use solana_sdk::signer::keypair::Keypair;
//! 
//! #[tokio::main]
//! async fn main() -> Result<(), Box<dyn std::error::Error>> {
//!     // Create a client
//!     let client = SolanaAiRegistriesClient::new("https://api.devnet.solana.com");
//!     
//!     // Build and register an agent
//!     let agent = AgentBuilder::new("my-agent", "My AI Agent")
//!         .description("An AI agent that does useful things")
//!         .version("1.0.0")
//!         .build()?;
//!     
//!     let keypair = Keypair::new();
//!     let signature = client.register_agent(&keypair, agent).await?;
//!     println!("Agent registered with signature: {}", signature);
//!     
//!     Ok(())
//! }
//! ```

// Core modules
pub mod client;
pub mod errors;
pub mod idl;

// Registry modules
pub mod agent;
pub mod mcp;

// Payment modules
#[cfg(any(feature = "stream", feature = "pyg", feature = "prepay"))]
pub mod payments;

// Re-export commonly used types
pub use client::SolanaAiRegistriesClient;
pub use errors::{SdkError, SdkResult};

// Re-export agent types
pub use agent::{
    AgentBuilder, AgentRegistry, AgentArgs, AgentPatch, AgentStatus,
    ServiceEndpoint, AgentSkill, AgentEntry
};

// Re-export MCP types  
pub use mcp::{
    McpServerBuilder, McpServerRegistry, McpServerArgs, McpServerPatch, McpServerStatus,
    McpToolDefinition, McpResourceDefinition, McpPromptDefinition, McpServerEntry
};

// Re-export payment types conditionally
#[cfg(feature = "stream")]
pub use payments::stream::*;

#[cfg(feature = "pyg")]
pub use payments::pyg::*;

#[cfg(feature = "prepay")]
pub use payments::prepay::*;

// Re-export Solana types for convenience
pub use solana_sdk::{
    pubkey::Pubkey,
    signature::{Signature, Signer},
    signer::keypair::Keypair,
};

/// SDK version
pub const VERSION: &str = env!("CARGO_PKG_VERSION");

/// Current registry versions supported
pub const AGENT_REGISTRY_VERSION: u8 = 1;
pub const MCP_SERVER_REGISTRY_VERSION: u8 = 1;