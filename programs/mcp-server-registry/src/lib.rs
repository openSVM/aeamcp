//! MCP Server Registry program for Solana AI Registries

// Temporarily disable missing docs for faster development
// #![deny(missing_docs)]
#![allow(missing_docs)]

use solana_program::{
    account_info::AccountInfo, entrypoint::ProgramResult, msg, pubkey::Pubkey,
};

pub mod instruction;
pub mod processor;
pub mod state;
pub mod validation;
pub mod events;

#[cfg(not(feature = "no-entrypoint"))]
use solana_program::entrypoint;

#[cfg(not(feature = "no-entrypoint"))]
entrypoint!(process_instruction);

/// Program entrypoint
pub fn process_instruction(
    program_id: &Pubkey,
    accounts: &[AccountInfo],
    instruction_data: &[u8],
) -> ProgramResult {
    msg!("MCP Server Registry program entrypoint");
    processor::process_instruction(program_id, accounts, instruction_data)
}

// Export commonly used items
pub use instruction::*;
pub use state::*;
pub use validation::*;
pub use events::*;