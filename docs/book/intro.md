# Tutorial: aeamcp

The AEAMCP project builds a decentralized ecosystem for AI agents and MCP servers on the
Solana blockchain. It uses two core smart contracts (**Agent Registry Program** and
**MCP Server Registry Program**) to manage on-chain records (*Registry Entry Accounts*)
for registered entities, derived using *Program Derived Addresses (PDAs)*. A
*Registry RPC Service* in the frontend interacts with these programs and account data,
leveraging *Solana Wallet Integration* for user authentication and transaction signing.
Key actions on the blockchain emit *Program Events*, enabling real-time updates. The
entire system is economically underpinned by the *A2AMPL ($SVMAI) Token*, used for
registration fees, staking, and potentially service payments.


## Visual Overview

```mermaid
flowchart TD
    A0["Agent Registry Program
"]
    A1["MCP Server Registry Program
"]
    A2["Registry Entry Accounts
"]
    A3["Program Derived Addresses (PDAs)
"]
    A4["Registry RPC Service (Frontend)
"]
    A5["Solana Wallet Integration
"]
    A6["Program Events
"]
    A7["A2AMPL (SVMAI) Token
"]
    A0 -- "Manages data in" --> A2
    A1 -- "Manages data in" --> A2
    A0 -- "Derives account addresses" --> A3
    A1 -- "Derives account addresses" --> A3
    A4 -- "Interacts with" --> A0
    A4 -- "Interacts with" --> A1
    A4 -- "Fetches data from" --> A2
    A4 -- "Uses to locate accounts" --> A3
    A5 -- "Provides transaction signing" --> A4
    A0 -- "Emits" --> A6
    A1 -- "Emits" --> A6
    A4 -- "Listens for" --> A6
    A7 -- "Required for operations" --> A0
    A7 -- "Required for operations" --> A1
    A5 -- "Holds user's tokens" --> A7
```

## Chapters

1. [Registry Entry Accounts
](01_registry_entry_accounts_.md)
2. [Agent Registry Program
](02_agent_registry_program_.md)
3. [MCP Server Registry Program
](03_mcp_server_registry_program_.md)
4. [Program Derived Addresses (PDAs)
](04_program_derived_addresses__pdas__.md)
5. [Registry RPC Service (Frontend)
](05_registry_rpc_service__frontend__.md)
6. [Solana Wallet Integration
](06_solana_wallet_integration_.md)
7. [A2AMPL (SVMAI) Token
](07_a2ampl__svmai__token_.md)
8. [Program Events
](08_program_events_.md)

---
