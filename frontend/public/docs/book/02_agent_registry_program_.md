# Chapter 2: Agent Registry Program

Welcome back! In [Chapter 1: Registry Entry Accounts](01_registry_entry_accounts_.md), we learned that **Registry Entry Accounts** are like digital passports on the Solana blockchain, holding the key information for individual AI agents and MCP servers. But who manages these passports? Who decides who gets one, who can update their information, and who can remove one?

This is where the **Agent Registry Program** comes in.

## What is a Solana Program? (Quick Peek)

Before we dive into the Agent Registry Program specifically, let's quickly understand what a "program" means on Solana.

In the world of Solana, programs are essentially **smart contracts**. They are pieces of code deployed onto the blockchain that contain logic and rules. They don't store data themselves; instead, they interact with data stored in separate **accounts** (like the Registry Entry Accounts we saw in Chapter 1).

Think of a program like an automated rulebook or a machine. You send it instructions (like "register this agent" or "update this agent's status"), along with the accounts it needs to interact with (like the agent's entry account, your wallet account to pay fees, etc.), and the program executes its logic according to its code.

## The Agent Registry Program's Role

The **Agent Registry Program** is the *specific* smart contract on the Solana blockchain that is responsible *only* for managing the **Agent Registry Entry** accounts. It's the official authority and the only piece of code allowed to create, modify, or delete data within those particular types of accounts.

Its core job is to define and enforce the rules for AI agents participating in the AEAMCP ecosystem's decentralized registry.

Imagine it as the central office that handles all agent registrations.

## What Does "Managing" Mean?

Managing the Agent Registry Entry accounts involves several key operations, which are defined as **instructions** that users (or applications acting on behalf of users/agents) can send to the program.

Here are some of the main instructions the Agent Registry Program understands:

*   **RegisterAgent:** Create a brand new `AgentRegistryEntryV1` account and fill it with the initial information about an AI agent.
*   **UpdateAgentDetails:** Modify specific fields (like name, description, endpoints, skills) in an *existing* `AgentRegistryEntryV1` account.
*   **UpdateAgentStatus:** Change the status of an agent (e.g., from "Pending" to "Active", or to "Inactive").
*   **DeregisterAgent:** Mark an agent's entry as "Deregistered" (usually a soft delete, marking it as inactive).
*   **StakeTokens / UnstakeTokens:** Manage staking of the project's token (A2AMPL/SVMAI, more in [Chapter 7: A2AMPL (SVMAI) Token](07_a2ampl__svmai__token_.md)) associated with an agent entry for benefits.
*   **UpdateServiceFees:** Configure how the agent charges for its services.
*   **RecordServiceCompletion / RecordDisputeOutcome:** Allow authorized programs (like an Escrow or Dispute Resolution program) to update the agent's reputation based on service performance and dispute results.

## How to Register an Agent

Let's take the core use case: registering a new AI agent. As an agent owner, you need to tell the Agent Registry Program that your agent exists and provide its details.

To do this, you interact with the program by sending a **transaction** containing a `RegisterAgent` or `RegisterAgentWithToken` instruction.

This instruction needs a few things:

1.  **The Instruction Data:** This is the information about your agent (agent ID, name, description, endpoints, skills, etc.) that you want to store in the `AgentRegistryEntryV1` account.
2.  **A List of Accounts:** The program needs to know which accounts it should work with. For registration, this includes:
    *   Your wallet account (the *payer* who pays the transaction fee).
    *   Your wallet account again (as the *owner authority* who will control the new agent entry).
    *   Crucially, the address of the *new* `AgentRegistryEntryV1` account that will be created. (We'll see in [Chapter 4: Program Derived Addresses (PDAs)](04_program_derived_addresses__pdas__.md) how this address is determined!).
    *   The Solana System Program account (a special account needed to create new accounts).
    *   If using `RegisterAgentWithToken`, additional accounts are needed for the token transfer (your token account, the program's token vault, the token mint, the SPL Token program).

When you send this transaction, the Solana network routes it to the Agent Registry Program.

## Inside the Program: Processing Registration

What happens inside the Agent Registry Program when it receives your `RegisterAgent` instruction?

Here's a simplified walkthrough:

1.  **Receive:** The program receives the instruction data and the list of accounts you provided.
2.  **Validate Inputs:** It checks if the `agent_id`, `name`, `description`, and other provided details meet the program's requirements (e.g., are they too long? Are endpoints valid?).
    *   *See the `validate_register_agent` function call in `processor.rs`.*
3.  **Verify Accounts:** It checks if the accounts provided are correct. Is the *payer* signing? Is the *owner authority* signing? Is the correct System Program account provided?
    *   *See `verify_signer_authority` calls in `processor.rs`.*
4.  **Derive & Verify PDA:** It calculates the *expected* address for the new agent entry account based on the `agent_id` and `owner_authority`. This is a special type of address called a Program Derived Address (PDA). It verifies that the `agent_entry_info` account you provided matches this calculated PDA. (More on this crucial concept in [Chapter 4: Program Derived Addresses (PDAs)](04_program_derived_addresses__pdas__.md)).
    *   *See `get_agent_pda_secure` call in `processor.rs`.*
5.  **Check Existence:** It checks if an account *already exists* at the expected PDA address. If one does, it means this agent ID is already registered by this owner, and the program will return an error (you can't register the same agent twice!).
    *   *See `!agent_entry_info.data_is_empty()` check in `processor.rs`.*
6.  **Create Account:** If everything is valid and the account doesn't exist, the program requests the Solana System Program to create a new account at the PDA address. It specifies how much space (`AgentRegistryEntryV1::SPACE`) is needed to store the agent's data and sets the Agent Registry Program as the *owner* of this new account. The *payer* provides the necessary lamports (Solana's native currency) for rent exemption.
    *   *See the `invoke(&system_instruction::create_account(...))` call in `processor.rs`.*
7.  **Write Data:** The program then writes the initial agent information (name, description, endpoints, etc.) into the newly created account. It uses the `AgentRegistryEntryV1::new` function to structure the data correctly.
    *   *See the `AgentRegistryEntryV1::new(...)` call and `agent_entry.serialize(...)` in `processor.rs`.*
8.  **Handle Token Payment (if applicable):** If it was a `RegisterAgentWithToken` instruction, the program also handles transferring the registration fee from the owner's token account to the program's designated registration vault account using the SPL Token program.
    *   *See the `transfer_tokens_with_account_info` call in `processor.rs` within `process_register_agent_with_token`.*
9.  **Emit Event:** To signal that the registration was successful and to allow applications to easily track registrations, the program emits an event ([Chapter 8: Program Events](08_program_events_.md)).
    *   *See the `emit_agent_registered` call in `processor.rs`.*
10. **Finish:** The program finishes execution, and the transaction is confirmed on the blockchain. The new `AgentRegistryEntryV1` account now exists with the agent's details.

Here's a simplified flow diagram for the `RegisterAgent` process:

```mermaid:diagrams/ch2-agent-register-sequence.mmd
```
*This diagram shows the sequence of interactions when a user registers an agent via the program.*

## Exploring the Code (Simplified)

Let's look at tiny snippets from the code to see where these steps happen.

The entry point of the program (`lib.rs`) simply forwards instructions to the `processor`:

```rust
// from programs/agent-registry/src/lib.rs
entrypoint!(process_instruction);

pub fn process_instruction(
    program_id: &Pubkey,
    accounts: &[AccountInfo],
    instruction_data: &[u8],
) -> ProgramResult {
    // Unpack the instruction data and then call the appropriate processor function
    processor::Processor::process(program_id, accounts, instruction_data)
}
```
*This code shows how the program starts. It receives instructions and accounts and passes them to a 'processor' to handle the logic.*

The `processor.rs` file contains the main logic for each instruction. The `process` function matches the instruction type and calls the relevant handling function:

```rust
// from programs/agent-registry/src/processor.rs
impl Processor {
    pub fn process(
        program_id: &Pubkey,
        accounts: &[AccountInfo],
        instruction_data: &[u8],
    ) -> ProgramResult {
        let instruction = AgentRegistryInstruction::unpack(instruction_data)?; // Get instruction type
        match instruction {
            AgentRegistryInstruction::RegisterAgent { ... } => {
                Self::process_register_agent(program_id, accounts, ...) // Call registration logic
            }
            AgentRegistryInstruction::UpdateAgentDetails { details } => {
                Self::process_update_agent_details(program_id, accounts, details) // Call update logic
            }
            // ... other instructions like UpdateAgentStatus, DeregisterAgent, etc.
            _ => return Err(ProgramError::InvalidInstructionData), // Handle unknown instructions
        }
    }
    // ... process_register_agent and other functions below ...
}
```
*This code shows how the program identifies which action (like Register or Update) to perform based on the instruction data.*

The `process_register_agent` function gets the accounts it needs:

```rust
// from programs/agent-registry/src/processor.rs (inside process_register_agent)
let account_info_iter = &mut accounts.iter();
let agent_entry_info = next_account_info(account_info_iter)?; // The account that will hold the agent data
let owner_authority_info = next_account_info(account_info_iter)?; // The agent owner's wallet
let payer_info = next_account_info(account_info_iter)?; // The account paying for rent (often same as owner)
let system_program_info = next_account_info(account_info_iter)?; // The System Program
```
*This code shows how the program accesses the accounts provided in the transaction.*

And it performs the account creation:

```rust
// from programs/agent-registry/src/processor.rs (inside process_register_agent)
// Calculate rent exemption needed for the account size
let rent = Rent::get()?;
let required_lamports = rent.minimum_balance(AgentRegistryEntryV1::SPACE);

// Create the account by invoking the System Program
invoke(
    &system_instruction::create_account(
        payer_info.key, // Payer's public key
        agent_entry_info.key, // New account's public key (the PDA)
        required_lamports, // Lamports for rent exemption
        AgentRegistryEntryV1::SPACE as u64, // Size of the account data
        program_id, // Program ID that will own the account
    ),
    &[
        payer_info.clone(), // Pass account infos needed by System Program
        agent_entry_info.clone(),
        system_program_info.clone(),
    ],
)?;
```
*This snippet shows the program asking the Solana System Program to create the actual data account on the blockchain.*

Finally, it writes the data using the structure defined in `state.rs`:

```rust
// from programs/agent-registry/src/processor.rs (inside process_register_agent)
// Create the agent entry structure in memory
let agent_entry = AgentRegistryEntryV1::new(
    bump, // PDA bump seed
    *owner_authority_info.key, // Owner's public key
    agent_id.clone(),
    name.clone(),
    description.clone(),
    agent_version.clone(),
    // ... other fields from instruction ...
    timestamp, // Current time
);

// Serialize the structure and store it in the account's data
let mut data = agent_entry_info.try_borrow_mut_data()?; // Get mutable access to account data
agent_entry.serialize(&mut &mut data[..])?; // Write the data
```
*This code shows how the program prepares the agent's data and saves it into the new account.*

These snippets demonstrate that the program's job is to orchestrate the process: validate inputs, check permissions (signers, ownership - not fully shown here but crucial), interact with other necessary programs (like System Program, Token Program), write data to the correct account structure (`AgentRegistryEntryV1`), and confirm the action by emitting events.

## Why Have a Program?

Could you just create a generic Solana account and store agent data in it without a program? Yes, you *could*, but then anyone who knows the account address could potentially change the data.

By having the Agent Registry Program *own* the `AgentRegistryEntryV1` accounts, we achieve crucial guarantees:

*   **Authorization:** Only the program's code can modify the data in these accounts.
*   **Validation:** The program enforces rules on *what* data can be written (e.g., max lengths, valid formats, requiring a default endpoint).
*   **Logic:** The program can handle complex operations like updating reputation, managing staking tiers, or tracking service fees, all according to defined on-chain logic.
*   **State Management:** Features like the `state_version` and `operation_in_progress` fields in `AgentRegistryEntryV1` ([state.rs](programs/agent-registry/src/state.rs)) are used by the program to prevent common smart contract exploits like reentrancy or inconsistent state updates.

The program acts as the gatekeeper and rule enforcer for the agent registry data.

## Summary Table

Let's refine our understanding:

| Component             | Role                                     | Lives On Solana? | Managed By             | Primary Function                |
| :-------------------- | :--------------------------------------- | :--------------- | :--------------------- | :------------------------------ |
| **Registry Entry Account** | Stores structured data for one entity (Agent or MCP Server) | Yes              | Its owning Program     | Data storage, Discovery source  |
| **Agent Registry Program** | Contains the logic and rules for managing **Agent** Registry Entry Accounts | Yes              | The Program's code     | Create, Update, Query (via account reads), Enforce Rules |

## Conclusion

The Agent Registry Program is the smart contract heartbeat of the AEAMCP agent registry. It defines the operations (instructions) like registering, updating, and changing the status of AI agents, and it enforces the rules for storing agent data in the dedicated `AgentRegistryEntryV1` accounts. Understanding this program is key because it's the *only* way agent information can be officially changed on-chain.

In the next chapter, we'll look at a similar program that manages a different set of accounts: the **MCP Server Registry Program**.

[MCP Server Registry Program](03_mcp_server_registry_program_.md)

---
