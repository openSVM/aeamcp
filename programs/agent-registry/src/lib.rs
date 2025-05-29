//! Solana Agent Registry Program
//! 
//! This program implements a decentralized registry for autonomous agents operating on Solana,
//! supporting the advertisement of agent capabilities, endpoints, identity, and metadata
//! following the Autonomous Economic Agent (AEA) and Agent-to-Agent (A2A) paradigms.

use solana_program::{
    account_info::AccountInfo,
    entrypoint,
    entrypoint::ProgramResult,
    pubkey::Pubkey,
};

pub mod instruction;
pub mod processor;
pub mod state;
pub mod validation;
pub mod events;

#[cfg(test)]
pub mod tests;


use processor::Processor;

// Declare and export the program's entrypoint
entrypoint!(process_instruction);

// Program entrypoint's implementation
pub fn process_instruction(
    program_id: &Pubkey,
    accounts: &[AccountInfo],
    instruction_data: &[u8],
) -> ProgramResult {
    Processor::process(program_id, accounts, instruction_data)
}

// Export the program ID
solana_program::declare_id!("AgentReg11111111111111111111111111111111111");