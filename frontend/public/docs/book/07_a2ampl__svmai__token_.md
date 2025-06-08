# Chapter 7: A2AMPL (SVMAI) Token

Welcome back! In our previous chapter, [Chapter 6: Solana Wallet Integration](06_solana_wallet_integration_.md), we learned how a frontend application helps you connect your Solana wallet and sign transactions to interact with the blockchain. We saw how you might initiate actions like registering an agent, which requires sending data to the Agent Registry Program.

But what does it actually cost to register an agent or an MCP server in the AEAMCP ecosystem? How do you incentivize participation and ensure that the registry isn't just filled with spam? This is where the ecosystem's native utility token comes in: the **A2AMPL (SVMAI) Token**.

## What is a Utility Token? (A Simple Analogy)

Imagine a community fair. To ride the Ferris wheel, play games, or buy snacks, you need special fair tokens instead of regular cash. You buy these fair tokens with cash, and then you use the tokens for activities within the fair. These fair tokens are **utility tokens** – they have no value outside the fair itself (you can't use them at the grocery store), but they unlock services and participation *within that specific ecosystem*.

In the world of blockchain, utility tokens work similarly. They are specific tokens created for a particular project or ecosystem, designed to be used for specific purposes *within that ecosystem*. They are not typically meant to be a general currency, but rather a key to access services, pay fees, or participate in governance within the project's world.

## Introducing the A2AMPL (SVMAI) Token

The **A2AMPL Token** (pronounced "A-two-AMPL") is the native utility token of the AEAMCP ecosystem. You'll sometimes see it referred to as **$SVMAI** in the frontend interfaces and community discussions, which is a branding name (short for "Solana Vision AI"). However, the underlying technical programs and configurations often use the `A2AMPL` name. They both refer to the exact same token.

Think of the A2AMPL ($SVMAI) token as the economic "fuel" or "currency" that powers interactions within the AEAMCP decentralized registry and the broader ecosystem being built around it.

This token is a standard **SPL Token** on the Solana blockchain. SPL stands for Solana Program Library, and it's a set of on-chain programs (smart contracts) that define common functionalities like creating, managing, and transferring tokens. The A2AMPL ($SVMAI) token was created using the SPL Token Program.

Key details about the token:

*   **Token Mint Address:** `Cpzvdx6pppc9TNArsqgShCsKC9NCCjA2gtzHvUpump` (on Mainnet-Beta, a different one is used on Devnet like `A2AMPLyncKHwfSnwRNsJ2qsjsetgo9fGkP8YZPsDZ9mE` for testing). This is the unique identifier on the blockchain for this specific token type.
*   **Decimals:** 9. This means that for every whole A2AMPL token you see (like 1.00 SVMAI), it's represented on the blockchain as a very large number (1 followed by 9 zeros) of the smallest unit, often called "lamports" or "base units" for that token. This high precision is common for tokens.
*   **Total Supply:** 1,000,000,000 (1 billion) A2AMPL tokens.

You can see where some of this is defined in the frontend code's constants:

```typescript
// from frontend/lib/constants.ts
export const A2AMPL_TOKEN_MINT = new PublicKey(getA2amplTokenMint());
// Legacy alias for backward compatibility
export const SVMAI_TOKEN_MINT = A2AMPL_TOKEN_MINT;

export const A2AMPL_TOKEN_DECIMALS = 9; // Matches our implementation
export const A2AMPL_TOKEN_SYMBOL = 'A2AMPL';
export const A2AMPL_TOKEN_NAME = 'Agentic Economy Amplifier Token';

// Legacy aliases for backward compatibility
export const SVMAI_TOKEN_DECIMALS = A2AMPL_TOKEN_DECIMALS;
export const SVMAI_TOKEN_SYMBOL = A2AMPL_TOKEN_SYMBOL;
export const SVMAI_TOKEN_NAME = A2AMPL_TOKEN_NAME;

// Token Economics (all amounts in base units - multiply by 10^9 for lamports)
// NOTE: The values below are shown in WHOLE tokens in the UI/code for simplicity,
// but they must be converted to base units (multiplied by 10^DECIMALS) for transactions.
export const A2AMPL_REGISTRATION_FEE_AGENT = 100; // 100 A2AMPL for agent registration
export const A2AMPL_REGISTRATION_FEE_SERVER = 50; // 50 A2AMPL for server registration

// Agent Staking Tiers (in A2AMPL tokens)
export const A2AMPL_STAKING_TIERS = {
  BRONZE: 1_000,    // 1,000 A2AMPL
  SILVER: 10_000,   // 10,000 A2AMPL
  GOLD: 50_000,     // 50,000 A2AMPL
  PLATINUM: 100_000 // 100,000 A2AMPL
} as const;

// ... other constants like vault seeds ...
```
*This code defines the token's key properties and the amounts required for certain actions (like registration fees) in whole tokens. These amounts are converted to the token's base units (lamports) when building transactions.*

## Token Utility in AEAMCP

The A2AMPL (SVMAI) token has several roles within the ecosystem, designed to incentivize participation and maintain the health and quality of the registry:

1.  **Registration Fees:** This is the most fundamental current use. Registering a new AI agent or an MCP server on the blockchain requires paying a small fee in A2AMPL tokens.
    *   **Why?** This acts as a barrier to spam. It requires anyone wanting to add an entry to the registry to have some economic commitment to the ecosystem by acquiring the token. It also provides a mechanism for value capture within the protocol.
    *   **Current Fees:** As seen in the constants above, it costs 100 A2AMPL to register an agent and 50 A2AMPL to register an MCP server.
2.  **Staking for Verification/Tiers:** Agent and MCP server owners can stake (lock up) A2AMPL tokens to achieve higher verification tiers.
    *   **Why?** Staking demonstrates a stronger commitment to the ecosystem and the quality/reliability of the registered entity. Higher tiers can unlock benefits like enhanced visibility in search results, access to premium features, or higher trust scores. The staked tokens can also potentially be used in future dispute resolution mechanisms (see the `svmai-tokenomics.md` document for a detailed analysis of potential models).
    *   **Staking Amounts:** Different tiers (like Bronze, Silver, Gold, Platinum for agents, or Basic, Verified, Premium for servers) require staking increasingly larger amounts of A2AMPL tokens, as defined in the constants.
3.  **Future Uses:** The token is also designed with potential future utility in mind, such as:
    *   **Service Usage Fees:** Agents or servers might charge fees in A2AMPL for providing their services.
    *   **Governance:** A2AMPL holders could gain the ability to vote on proposals related to the registry's rules, fees, or future development (as described in the `svmai-token.md` document).
    *   **Curation/Verification Incentives:** Rewarding users who help curate or verify the quality of entries.

For a beginner, the most important utility to grasp right now is the **registration fee**. When you register an agent or server, you need A2AMPL tokens in your wallet to pay the required amount.

## Solving the Use Case: Paying the Registration Fee

Let's revisit the process of registering an AI agent from [Chapter 6: Solana Wallet Integration](06_solana_wallet_integration_.md). We saw that the frontend prepares a transaction and asks your wallet to sign it.

Part of preparing that transaction involves ensuring the required A2AMPL fee is paid. The AEAMCP programs often use instructions that combine the registration logic with the token transfer logic. This is handled by the frontend's `tokenRegistryService` (`frontend/lib/solana/token-registry.ts`).

When you call a function like `tokenRegistryService.registerAgentWithToken` ([frontend/lib/solana/token-registry.ts](frontend/lib/solana/token-registry.ts)), this service does several things:

1.  **Checks Token Balance:** It first checks if your wallet has enough A2AMPL tokens using the SPL Token Program's functionality.
2.  **Calculates PDAs:** It calculates the necessary Program Derived Addresses (PDAs) for the new agent entry account and for the program's token "vault" account (a special account where fee tokens are sent). Remember PDAs from [Chapter 4: Program Derived Addresses (PDAs)](04_program_derived_addresses__pdas__.md)? The program needs its own special token account to receive and hold the A2AMPL fees, and this token account is a PDA owned by the program.
3.  **Gets Token Account Addresses:** It figures out the address of your **Associated Token Account** for A2AMPL (this is the standard type of account that holds your specific balance of A2AMPL) and the address of the program's A2AMPL vault account. If either account doesn't exist, the service might add instructions to the transaction to create them first.
4.  **Builds Token Transfer Instruction:** It creates a standard instruction for the SPL Token Program to transfer the required A2AMPL amount from *your* A2AMPL token account to the *program's* A2AMPL vault token account.
5.  **Builds Registry Instruction:** It creates the instruction for the Agent Registry Program (or MCP Server Registry Program) that contains the agent/server details. This instruction often includes accounts needed for the token transfer as well, so the registry program can verify the fee was paid.
6.  **Combines Instructions:** It adds both the token transfer instruction and the registry instruction into a single Solana transaction.
7.  **Prepares Transaction:** It sets the `feePayer`, `recentBlockhash`, etc., on the transaction object.

This transaction is then returned to the calling code (like the registration page), which sends it to your wallet for signing, and then broadcasts it to the network.

Here's a simplified look at how `tokenRegistryService` prepares the transaction with the token transfer instruction:

```typescript
// from frontend/lib/solana/token-registry.ts (simplified)
async registerAgentWithToken(data, walletPublicKey) {
  // ... (balance check, PDA calculation, get token accounts) ...

  const transaction = new Transaction();

  // Add instruction to create vault token account if needed
  // Add instruction to create user token account if needed

  // Calculate fee amount in base units
  const feeAmountLamports = SVMAI_REGISTRATION_FEE_AGENT * Math.pow(10, SVMAI_TOKEN_DECIMALS);

  // Create the SPL Token transfer instruction
  const transferInstruction = createTransferInstruction(
    userTokenAccount,     // Source: User's A2AMPL token account
    vaultTokenAccount,    // Destination: Program's A2AMPL vault token account (a PDA token account)
    walletPublicKey,      // Authority: The user's wallet public key (signing this authorizes the transfer)
    feeAmountLamports     // Amount: The registration fee in base units
  );

  // Create the Agent Registry Program instruction
  // This instruction expects the token transfer to happen in the same transaction
  const registrationInstruction = new TransactionInstruction({
    keys: [
      // ... accounts for the agent entry PDA, owner authority, system program, etc. ...
      { pubkey: userTokenAccount, isSigner: false, isWritable: true }, // Include user's token account
      { pubkey: vaultTokenAccount, isSigner: false, isWritable: true }, // Include vault token account
      { pubkey: SVMAI_TOKEN_MINT, isSigner: false, isWritable: false }, // Include token mint
      { pubkey: TOKEN_PROGRAM_ID, isSigner: false, isWritable: false }, // Include SPL Token Program ID
      // ...
    ],
    programId: AGENT_REGISTRY_PROGRAM_ID,
    data: this.serializeAgentDataWithToken(data), // Instruction specific data
  });

  // Add BOTH instructions to the transaction
  transaction.add(transferInstruction);
  transaction.add(registrationInstruction);

  // ... (set feePayer, blockhash) ...

  return transaction; // Return the unsigned transaction to the wallet for signing
}
```
*This code snippet shows how the `tokenRegistryService` constructs a transaction that includes both a token transfer instruction (handled by the SPL Token Program) and the specific program instruction (handled by the Agent Registry Program). Both are needed for a token-gated registration.*

Here is a simplified sequence diagram showing the token transfer step integrated into the registration flow:

```mermaid:diagrams/ch7-token-register-sequence.mmd
```
*This diagram adds the token transfer step to the registration flow. The frontend service builds a transaction with two instructions (SPL Token transfer and Registry Program call), the wallet signs it, and Solana executes both instructions atomically.*

## Under the Hood: Token Accounts and Vaults

To hold and manage SPL tokens like A2AMPL, Solana uses specific types of accounts.

1.  **The Token Mint Account:** This is the master account that defines the token itself (its name, symbol, decimals, total supply, and who has permission to mint or freeze tokens). There is only *one* A2AMPL Mint account on Solana.
2.  **Associated Token Accounts (ATAs):** Every user who holds A2AMPL tokens needs their own specific account to hold their balance. The standard way to do this is using an Associated Token Account (ATA). An ATA's address is a PDA derived from the user's wallet address, the token mint address, and the SPL Associated Token Program ID. This ensures each user has a unique, standard account for each token type. Your wallet application usually manages creating these ATAs for you when you first receive a token.
3.  **Program PDA Token Accounts (Vaults):** Just like users need token accounts, programs also need them if they are designed to hold or manage tokens on behalf of the program itself. The registry programs need accounts to hold the A2AMPL collected from registration fees or staked for tiers. These are created as Associated Token Accounts owned by the program's own PDA ([Chapter 4](04_program_derived_addresses__pdas__.md)), using specific seeds like `agent_registry_vault`, `mcp_server_registry_vault`, or `staking_vault`. This allows the program (not a private key) to control the tokens within these "vault" accounts.

The `tokenRegistryService` contains helper functions to get the addresses of these vault PDAs:

```typescript
// from frontend/lib/solana/token-registry.ts (simplified)
getAgentRegistryVaultPDA(): [PublicKey, number] {
  return PublicKey.findProgramAddressSync(
    [Buffer.from(AGENT_REGISTRY_VAULT_SEED)], // Seed: "agent_registry_vault"
    AGENT_REGISTRY_PROGRAM_ID // Program ID
  );
}

getMcpServerRegistryVaultPDA(): [PublicKey, number] {
  return PublicKey.findProgramAddressSync(
    [Buffer.from(MCP_SERVER_REGISTRY_VAULT_SEED)], // Seed: "mcp_server_registry_vault"
    MCP_SERVER_REGISTRY_PROGRAM_ID // Program ID
  );
}

// Staking vault is typically derived from the specific entry's PDA
// getStakingVaultPDA(entryPDA): [PublicKey, number] { ... }
```
*These functions show how the addresses of the program's token vault accounts are determined using specific seeds and the program's ID. These are PDAs.*

The actual **SVMAI Token Program** (`programs/svmai-token/src/lib.rs`) mentioned earlier is primarily responsible for the *initial* creation and distribution of the token. Its main instructions, like `initialize_token` and `mint_initial_supply`, are typically called only once right after deployment. Once the initial supply is minted and distributed, and the mint authority is transferred (often to a DAO or a neutral address) and the freeze authority is disabled, this specific program's direct role in day-to-day operations is minimal. Most token interactions (transfers, checking balances) happen via the standard **SPL Token Program**, which is a system-level program on Solana, not specific to AEAMCP.

You can look at the `svmai-token.md` and `svmai-tokenomics.md` documents in the `public/docs` folder for a deeper dive into the token's overall economic model, distribution, and future potential utilities, but for understanding the registry's mechanics, knowing its role in fees and staking is key.

## Summary Table: Token Accounts

| Account Type                 | Purpose                                      | Owned By                                   | Address Type        | Example in AEAMCP Context                    |
| :--------------------------- | :------------------------------------------- | :----------------------------------------- | :------------------ | :------------------------------------------- |
| **Token Mint Account**       | Defines the token type (A2AMPL/SVMAI)        | Initial deployer, then often transferred   | Regular PublicKey   | The single A2AMPL Mint address               |
| **Associated Token Account (ATA)** | Holds a specific user's balance of a token | The User's Wallet Public Key               | PDA (from User PK, Mint PK) | Your wallet's A2AMPL balance account         |
| **Program PDA Token Account (Vault)** | Holds tokens owned/managed by a program | The Program's PDA                          | PDA (from Program ID, specific seeds) | Registry Program's fee collection accounts, Staking accounts |

## Conclusion

The A2AMPL (SVMAI) token is the economic engine of the AEAMCP ecosystem. It's a standard SPL Token on Solana used for essential interactions within the registry, primarily paying registration fees for agents and servers and for staking to achieve verification tiers. Understanding that registering involves a transaction that includes a transfer of A2AMPL tokens to the program's dedicated vault account, and how different types of token accounts work on Solana, is crucial for grasping the financial layer of the registry.

Now that we've covered the core on-chain data, the programs that manage it, the concept of PDAs, how the frontend reads data, how wallets enable writing data via transactions, and the token used for economic interaction, we'll look at how the programs signal important events occurring on-chain. In the next chapter, we'll explore **Program Events**.

[Program Events](08_program_events_.md)

---
