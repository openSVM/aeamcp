# SVMAI Token Integration Architecture Diagram

## System Overview

```
┌─────────────────────────────────────────────────────────────────────────────────┐
│                          SVMAI Token Ecosystem Architecture                      │
├─────────────────────────────────────────────────────────────────────────────────┤
│                                                                                 │
│  ┌─────────────────────────────────────────────────────────────────────────┐  │
│  │                            Core Token Layer                               │  │
│  │  ┌─────────────────────┐  ┌─────────────────────┐  ┌─────────────────┐  │  │
│  │  │   SVMAI Token SPL   │  │  Token Metadata    │  │   Token Vault    │  │  │
│  │  │ Cpzvdx6pppc9TNA... │  │  - Symbol: SVMAI   │  │  - Treasury      │  │  │
│  │  │ - Supply: 1B       │  │  - Decimals: 6     │  │  - Escrow Pool   │  │  │
│  │  │ - 100% Circulated  │  │  - Authority: DAO  │  │  - Rewards Pool  │  │  │
│  │  └─────────────────────┘  └─────────────────────┘  └─────────────────┘  │  │
│  └─────────────────────────────────────────────────────────────────────────┘  │
│                                        │                                        │
│                    ┌───────────────────┴───────────────────┐                   │
│                    ▼                                       ▼                   │
│  ┌──────────────────────────────┐      ┌──────────────────────────────┐      │
│  │      Registry Integration     │      │    Economic Mechanisms      │      │
│  ├──────────────────────────────┤      ├──────────────────────────────┤      │
│  │                              │      │                              │      │
│  │  ┌────────────────────┐     │      │  ┌────────────────────┐     │      │
│  │  │  Agent Registry    │     │      │  │  Service Escrow    │     │      │
│  │  │  - Registration    │◄────┼──────┼─►│  - Client Stakes   │     │      │
│  │  │  - Staking         │     │      │  │  - Agent Fees      │     │      │
│  │  │  - Reputation      │     │      │  │  - Auto-release    │     │      │
│  │  └────────────────────┘     │      │  └────────────────────┘     │      │
│  │                              │      │                              │      │
│  │  ┌────────────────────┐     │      │  ┌────────────────────┐     │      │
│  │  │  MCP Server Reg    │     │      │  │  Staking System    │     │      │
│  │  │  - Verification    │◄────┼──────┼─►│  - Time-locked     │     │      │
│  │  │  - Usage Fees      │     │      │  │  - Yield: 8-12%    │     │      │
│  │  │  - Quality Score   │     │      │  │  - Tier Benefits   │     │      │
│  │  └────────────────────┘     │      │  └────────────────────┘     │      │
│  │                              │      │                              │      │
│  └──────────────────────────────┘      └──────────────────────────────┘      │
│                    │                                       │                   │
│                    └───────────────────┬───────────────────┘                   │
│                                        ▼                                        │
│  ┌─────────────────────────────────────────────────────────────────────────┐  │
│  │                         Governance & Resolution                          │  │
│  ├─────────────────────────────────────────────────────────────────────────┤  │
│  │                                                                          │  │
│  │  ┌──────────────────┐  ┌──────────────────┐  ┌──────────────────┐     │  │
│  │  │  DDR System      │  │  DAO Governance  │  │  Query Credits   │     │  │
│  │  │  - Juror Stakes  │  │  - Proposals     │  │  - API Access    │     │  │
│  │  │  - Evidence      │  │  - Voting Power  │  │  - Search Tiers  │     │  │
│  │  │  - Resolutions   │  │  - Treasury Mgmt │  │  - Rate Limits   │     │  │
│  │  └──────────────────┘  └──────────────────┘  └──────────────────┘     │  │
│  │                                                                          │  │
│  └─────────────────────────────────────────────────────────────────────────┘  │
│                                        │                                        │
│                                        ▼                                        │
│  ┌─────────────────────────────────────────────────────────────────────────┐  │
│  │                          Cross-Chain Infrastructure                      │  │
│  ├─────────────────────────────────────────────────────────────────────────┤  │
│  │                                                                          │  │
│  │  ┌─────────────┐  ┌─────────────┐  ┌─────────────┐  ┌─────────────┐   │  │
│  │  │  Ethereum   │  │   Polygon   │  │     BSC     │  │  Arbitrum   │   │  │
│  │  │   Bridge    │  │   Bridge    │  │   Bridge    │  │   Bridge    │   │  │
│  │  │  - Lock/    │  │  - Lock/    │  │  - Lock/    │  │  - Lock/    │   │  │
│  │  │    Mint     │  │    Mint     │  │    Mint     │  │    Mint     │   │  │
│  │  │  - 5/9 Sig  │  │  - 5/9 Sig  │  │  - 5/9 Sig  │  │  - 5/9 Sig  │   │  │
│  │  └─────────────┘  └─────────────┘  └─────────────┘  └─────────────┘   │  │
│  │                                                                          │  │
│  └─────────────────────────────────────────────────────────────────────────┘  │
│                                                                                 │
└─────────────────────────────────────────────────────────────────────────────────┘
```

## Data Flow Diagrams

### Registration Flow with Token Integration

```
┌─────────┐      ┌─────────────┐      ┌──────────────┐      ┌─────────────┐
│  User   │      │   Wallet    │      │  Registry    │      │Token Vault  │
└────┬────┘      └──────┬──────┘      └──────┬───────┘      └──────┬──────┘
     │                   │                     │                      │
     │ 1. Register Agent │                     │                      │
     │──────────────────►│                     │                      │
     │                   │                     │                      │
     │                   │ 2. Check Balance    │                      │
     │                   │────────────────────►│                      │
     │                   │                     │                      │
     │                   │ 3. Transfer Fee     │                      │
     │                   │─────────────────────┼─────────────────────►│
     │                   │                     │                      │
     │                   │ 4. Create PDA       │                      │
     │                   │────────────────────►│                      │
     │                   │                     │                      │
     │                   │ 5. Emit Event       │                      │
     │◄──────────────────┼─────────────────────┤                      │
     │                   │                     │                      │
```

### Service Escrow Lifecycle

```
┌────────────────────────────────────────────────────────────────────────────┐
│                          Service Escrow State Machine                       │
├────────────────────────────────────────────────────────────────────────────┤
│                                                                             │
│    ┌─────────┐         ┌─────────┐         ┌──────────┐                   │
│    │Initiated│────────►│ Active  │────────►│  Under   │                   │
│    │         │         │         │         │  Review  │                   │
│    └─────────┘         └─────────┘         └────┬─────┘                   │
│         │                   │                    │                         │
│         │                   │                    ├─────────┐               │
│         │                   │                    │         ▼               │
│         │                   │              ┌─────┴────┐ ┌──────────┐       │
│         │                   │              │Completed │ │ Disputed │       │
│         │                   │              └──────────┘ └────┬─────┘       │
│         │                   │                                │             │
│         │                   │                                ▼             │
│         │                   │                          ┌──────────┐       │
│         ▼                   ▼                          │ Resolved │       │
│    ┌─────────┐         ┌─────────┐                    └──────────┘       │
│    │Cancelled│         │ Expired │                                        │
│    └─────────┘         └─────────┘                                        │
│                                                                             │
│ Token Flows:                                                               │
│ • Initiated → Active: Client + Agent stakes locked                         │
│ • Under Review → Completed: Agent receives fee, Client gets stake back     │
│ • Under Review → Disputed: Additional dispute stake required               │
│ • Disputed → Resolved: Funds distributed per DDR outcome                   │
│                                                                             │
└────────────────────────────────────────────────────────────────────────────┘
```

### Staking Tiers and Benefits

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                            Agent Staking Hierarchy                           │
├─────────────────────────────────────────────────────────────────────────────┤
│                                                                              │
│  ┌────────────────┐                                                         │
│  │   Platinum     │  100,000+ SVMAI │ 365 days lock                        │
│  │  ─────────────  │  • Governance voting rights                            │
│  │  ║█████████║   │  • Maximum visibility                                   │
│  │  ─────────────  │  • Lowest platform fees                               │
│  └────────────────┘  • Priority dispute resolution                          │
│          ▲                                                                   │
│          │                                                                   │
│  ┌────────────────┐                                                         │
│  │     Gold       │  50,000+ SVMAI │ 180 days lock                         │
│  │  ─────────────  │  • Featured placement                                  │
│  │  ║███████║     │  • Enhanced search ranking                             │
│  │  ─────────────  │  • Reduced platform fees                              │
│  └────────────────┘                                                         │
│          ▲                                                                   │
│          │                                                                   │
│  ┌────────────────┐                                                         │
│  │    Silver      │  10,000+ SVMAI │ 90 days lock                          │
│  │  ─────────────  │  • Priority in search results                         │
│  │  ║█████║       │  • Badge verification                                  │
│  │  ─────────────  │  • Standard platform fees                             │
│  └────────────────┘                                                         │
│          ▲                                                                   │
│          │                                                                   │
│  ┌────────────────┐                                                         │
│  │    Bronze      │  1,000+ SVMAI │ 30 days lock                           │
│  │  ─────────────  │  • Basic listing                                      │
│  │  ║███║         │  • Standard visibility                                 │
│  │  ─────────────  │  • Full platform fees                                  │
│  └────────────────┘                                                         │
│                                                                              │
└─────────────────────────────────────────────────────────────────────────────┘
```

### Dispute Resolution Process

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                      Decentralized Dispute Resolution Flow                   │
├─────────────────────────────────────────────────────────────────────────────┤
│                                                                              │
│  1. Dispute Initiation                                                       │
│  ┌──────────┐        ┌──────────────┐        ┌───────────────┐            │
│  │  Client  │───────►│ Stake SVMAI  │───────►│Submit Evidence│            │
│  └──────────┘        │  (10% min)   │        └───────────────┘            │
│                      └──────────────┘                                       │
│                                                                              │
│  2. Juror Selection                                                          │
│  ┌─────────────────────────────────────────────────────────┐               │
│  │     Juror Pool      │    Random Selection Algorithm     │               │
│  │  ┌───┐ ┌───┐ ┌───┐ │  • Weighted by stake amount      │               │
│  │  │ J1│ │ J2│ │ J3│ │  • Specialization matching       │               │
│  │  └───┘ └───┘ └───┘ │  • Minimum 3 jurors              │               │
│  │  ┌───┐ ┌───┐ ┌───┐ │  • No recent case overlap        │               │
│  │  │ J4│ │ J5│ │ J6│ │                                   │               │
│  │  └───┘ └───┘ └───┘ │        Selected: J2, J4, J6      │               │
│  └─────────────────────────────────────────────────────────┘               │
│                                                                              │
│  3. Voting Process (Commit-Reveal)                                          │
│  ┌────────────┐      ┌────────────┐      ┌────────────┐                   │
│  │   Commit   │      │   Reveal   │      │  Tally &   │                   │
│  │   Hashes   │─────►│   Votes    │─────►│  Execute   │                   │
│  │  (48 hrs)  │      │  (24 hrs)  │      │            │                   │
│  └────────────┘      └────────────┘      └────────────┘                   │
│                                                                              │
│  4. Resolution Outcomes                                                      │
│  ┌─────────────────────────────────────────────────────────┐               │
│  │  • Agent Wins: Receives fee + client loses dispute stake │               │
│  │  • Client Wins: Gets stake back + agent fee adjustment  │               │
│  │  • Partial: Custom percentage split (e.g., 70/30)       │               │
│  │  • Bad Faith: Penalty to malicious party                │               │
│  └─────────────────────────────────────────────────────────┘               │
│                                                                              │
└─────────────────────────────────────────────────────────────────────────────┘
```

## Integration Points Summary

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                         Key Integration Components                           │
├─────────────────────────────────────────────────────────────────────────────┤
│                                                                              │
│  Frontend (TypeScript/React)                                                 │
│  ├── lib/token.ts ─────────────► Token balance & transactions               │
│  ├── lib/solana/registry.ts ───► Registry interactions with fees            │
│  ├── lib/escrow/ ──────────────► Escrow UI components                      │
│  └── lib/dispute/ ─────────────► DDR interface                             │
│                                                                              │
│  Smart Contracts (Rust)                                                      │
│  ├── agent-registry/ ──────────► + Token staking fields                    │
│  ├── mcp-server-registry/ ─────► + Fee collection logic                    │
│  ├── token-integration/ ───────► New escrow & staking programs             │
│  └── dispute-resolution/ ──────► DDR implementation                        │
│                                                                              │
│  Off-Chain Services                                                          │
│  ├── Indexer ──────────────────► Track token flows & stakes                │
│  ├── Price Oracle ─────────────► USD value calculations                    │
│  └── Bridge Relayers ──────────► Cross-chain token movement                │
│                                                                              │
└─────────────────────────────────────────────────────────────────────────────┘