# Program Constants Reference

This document contains all constants extracted from the AEAMCP (Agent Economy & MCP) Solana programs for use in SDK implementations. These constants ensure consistency across all SDKs and match the on-chain program values exactly.

## Overview

The AEAMCP project consists of two main registry programs:
- **Agent Registry**: For registering autonomous agents
- **MCP Server Registry**: For registering Model Context Protocol servers

Both programs share common infrastructure and token integration with A2AMPL tokens.

---

## Agent Registry Constants

### Size Limits

| Constant | Value | Purpose |
|----------|--------|---------|
| `MAX_AGENT_ID_LEN` | 64 | Maximum length for agent identifiers |
| `MAX_AGENT_NAME_LEN` | 128 | Maximum length for agent names |
| `MAX_AGENT_DESCRIPTION_LEN` | 512 | Maximum length for agent descriptions |
| `MAX_AGENT_VERSION_LEN` | 32 | Maximum length for agent version strings |
| `MAX_PROVIDER_NAME_LEN` | 128 | Maximum length for provider names |
| `MAX_PROVIDER_URL_LEN` | 256 | Maximum length for provider URLs |
| `MAX_DOCUMENTATION_URL_LEN` | 256 | Maximum length for documentation URLs (shared) |
| `MAX_SERVICE_ENDPOINTS` | 3 | Maximum number of service endpoints per agent |
| `MAX_ENDPOINT_PROTOCOL_LEN` | 64 | Maximum length for endpoint protocol identifiers |
| `MAX_ENDPOINT_URL_LEN` | 256 | Maximum length for endpoint URLs |
| `MAX_SUPPORTED_MODES` | 5 | Maximum number of supported input/output modes |
| `MAX_MODE_LEN` | 64 | Maximum length for mode identifiers |
| `MAX_SKILLS` | 10 | Maximum number of skills per agent |
| `MAX_SKILL_ID_LEN` | 64 | Maximum length for skill identifiers |
| `MAX_SKILL_NAME_LEN` | 128 | Maximum length for skill names |
| `MAX_SKILL_TAGS` | 5 | Maximum number of tags per skill |
| `MAX_SKILL_TAG_LEN` | 32 | Maximum length for skill tags |
| `MAX_SECURITY_INFO_URI_LEN` | 256 | Maximum length for security information URIs |
| `MAX_AEA_ADDRESS_LEN` | 128 | Maximum length for AEA addresses |
| `MAX_ECONOMIC_INTENT_LEN` | 256 | Maximum length for economic intent summaries |
| `MAX_EXTENDED_METADATA_URI_LEN` | 256 | Maximum length for extended metadata URIs |
| `MAX_AGENT_TAGS` | 10 | Maximum number of tags per agent |
| `MAX_AGENT_TAG_LEN` | 32 | Maximum length for agent tags |

### Agent Status Values

| Status | Value | Description |
|--------|--------|-------------|
| `Pending` | 0 | Agent registered but not yet active |
| `Active` | 1 | Agent is active and operational |
| `Inactive` | 2 | Agent is temporarily inactive |
| `Deregistered` | 3 | Agent has been deregistered |

### Agent Account Size

| Constant | Value | Purpose |
|----------|--------|---------|
| `AgentRegistryEntryV1::SPACE` | ~2048 bytes | Total space required for agent account |

---

## MCP Server Registry Constants

### Size Limits

| Constant | Value | Purpose |
|----------|--------|---------|
| `MAX_SERVER_ID_LEN` | 64 | Maximum length for MCP server identifiers |
| `MAX_SERVER_NAME_LEN` | 128 | Maximum length for server names |
| `MAX_SERVER_VERSION_LEN` | 32 | Maximum length for server version strings |
| `MAX_SERVER_ENDPOINT_URL_LEN` | 256 | Maximum length for server endpoint URLs |
| `MAX_SERVER_CAPABILITIES_SUMMARY_LEN` | 256 | Maximum length for server capabilities summaries |
| `MAX_ONCHAIN_TOOL_DEFINITIONS` | 5 | Maximum number of on-chain tool definitions |
| `MAX_TOOL_NAME_LEN` | 64 | Maximum length for tool names |
| `MAX_TOOL_TAGS` | 3 | Maximum number of tags per tool |
| `MAX_TOOL_TAG_LEN` | 32 | Maximum length for tool tags |
| `MAX_ONCHAIN_RESOURCE_DEFINITIONS` | 5 | Maximum number of on-chain resource definitions |
| `MAX_RESOURCE_URI_PATTERN_LEN` | 128 | Maximum length for resource URI patterns |
| `MAX_RESOURCE_TAGS` | 3 | Maximum number of tags per resource |
| `MAX_RESOURCE_TAG_LEN` | 32 | Maximum length for resource tags |
| `MAX_ONCHAIN_PROMPT_DEFINITIONS` | 5 | Maximum number of on-chain prompt definitions |
| `MAX_PROMPT_NAME_LEN` | 64 | Maximum length for prompt names |
| `MAX_PROMPT_TAGS` | 3 | Maximum number of tags per prompt |
| `MAX_PROMPT_TAG_LEN` | 32 | Maximum length for prompt tags |
| `MAX_FULL_CAPABILITIES_URI_LEN` | 256 | Maximum length for full capabilities URIs |
| `MAX_SERVER_TAGS` | 10 | Maximum number of tags per MCP server |
| `MAX_SERVER_TAG_LEN` | 32 | Maximum length for server tags |

### MCP Server Status Values

| Status | Value | Description |
|--------|--------|-------------|
| `Pending` | 0 | Server registered but not yet active |
| `Active` | 1 | Server is active and operational |
| `Inactive` | 2 | Server is temporarily inactive |
| `Deregistered` | 3 | Server has been deregistered |

### MCP Server Account Size

| Constant | Value | Purpose |
|----------|--------|---------|
| `McpServerRegistryEntryV1::SPACE` | ~3072 bytes | Total space required for MCP server account |

---

## Shared Constants

### Serialization

| Constant | Value | Purpose |
|----------|--------|---------|
| `HASH_SIZE` | 32 | Size of SHA256 hash in bytes |
| `STRING_LEN_PREFIX_SIZE` | 4 | Size of String/Vec length prefix in Borsh |
| `OPTION_DISCRIMINATOR_SIZE` | 1 | Size of Option discriminator in Borsh |

### PDA Seeds

| Constant | Value | Purpose |
|----------|--------|---------|
| `AGENT_REGISTRY_PDA_SEED` | `b"agent_reg_v1"` | Seed prefix for Agent Registry PDAs |
| `MCP_SERVER_REGISTRY_PDA_SEED` | `b"mcp_srv_reg_v1"` | Seed prefix for MCP Server Registry PDAs |

---

## Token Integration Constants

### A2AMPL Token

| Constant | Value | Purpose |
|----------|--------|---------|
| `A2AMPL_DECIMALS` | 9 | Number of decimal places for A2AMPL |
| `A2AMPL_BASE_UNIT` | 1,000,000,000 | 1 A2AMPL = 10^9 base units |
| `A2AMPL_TOKEN_MINT_MAINNET` | `"Cpzvdx6pppc9TNArsGsqgShCsKC9NCCjA2gtzHvUpump"` | Mainnet token mint address |
| `A2AMPL_TOKEN_MINT_DEVNET` | `"A2AMPLyncKHwfSnwRNsJ2qsjsetgo9fGkP8YZPsDZ9mE"` | Devnet token mint address |

### Agent Registry Fees

| Constant | Value (A2AMPL) | Value (Base Units) | Purpose |
|----------|----------------|-------------------|---------|
| `AGENT_REGISTRATION_FEE` | 100 | 100,000,000,000 | Fee to register an agent |

### Agent Staking Tiers

| Tier | Constant | Value (A2AMPL) | Value (Base Units) | Lock Period |
|------|----------|----------------|-------------------|-------------|
| Bronze | `BRONZE_TIER_STAKE` | 1,000 | 1,000,000,000,000 | 30 days |
| Silver | `SILVER_TIER_STAKE` | 10,000 | 10,000,000,000,000 | 90 days |
| Gold | `GOLD_TIER_STAKE` | 50,000 | 50,000,000,000,000 | 180 days |
| Platinum | `PLATINUM_TIER_STAKE` | 100,000 | 100,000,000,000,000 | 365 days |

### Agent Lock Periods (seconds)

| Constant | Value | Duration |
|----------|--------|----------|
| `BRONZE_LOCK_PERIOD` | 2,592,000 | 30 days |
| `SILVER_LOCK_PERIOD` | 7,776,000 | 90 days |
| `GOLD_LOCK_PERIOD` | 15,552,000 | 180 days |
| `PLATINUM_LOCK_PERIOD` | 31,536,000 | 365 days |

### MCP Server Registry Fees

| Constant | Value (A2AMPL) | Value (Base Units) | Purpose |
|----------|----------------|-------------------|---------|
| `MCP_REGISTRATION_FEE` | 50 | 50,000,000,000 | Fee to register an MCP server |

### MCP Server Verification Stakes

| Tier | Constant | Value (A2AMPL) | Value (Base Units) | Description |
|------|----------|----------------|-------------------|-------------|
| Basic | `BASIC_SERVER_STAKE` | 500 | 500,000,000,000 | Basic verification level |
| Verified | `VERIFIED_SERVER_STAKE` | 5,000 | 5,000,000,000,000 | Verified server level |
| Premium | `PREMIUM_SERVER_STAKE` | 25,000 | 25,000,000,000,000 | Premium server level |

### Staking Limits

| Constant | Value (Base Units) | Purpose |
|----------|-------------------|---------|
| `MIN_STAKE_AMOUNT` | 500,000,000,000 | Minimum stake (500 A2AMPL) |
| `MIN_LOCK_PERIOD` | 604,800 | 7 days minimum lock |
| `MAX_LOCK_PERIOD` | 63,072,000 | 2 years maximum lock |

### Service Fees

| Constant | Value (A2AMPL) | Value (Base Units) | Purpose |
|----------|----------------|-------------------|---------|
| `MIN_SERVICE_FEE` | 1.0 | 1,000,000,000 | Minimum service fee |
| `MIN_TOOL_FEE` | 1.0 | 1,000,000,000 | Minimum tool usage fee |
| `MIN_RESOURCE_FEE` | 0.5 | 500,000,000 | Minimum resource access fee |
| `MIN_PROMPT_FEE` | 2.0 | 2,000,000,000 | Minimum prompt usage fee |
| `MAX_BULK_DISCOUNT` | 50 | N/A | Maximum bulk discount percentage |

### Quality Metrics

| Constant | Value | Purpose |
|----------|--------|---------|
| `QUALITY_UPDATE_INTERVAL` | 86,400 | Quality update interval (24 hours) |
| `MIN_UPTIME_FOR_PREMIUM` | 95 | Minimum uptime % for premium status |

### Priority Multipliers

| Constant | Value | Description |
|----------|--------|-------------|
| `MIN_PRIORITY_MULTIPLIER` | 100 | 1.0x minimum multiplier |
| `MAX_PRIORITY_MULTIPLIER` | 300 | 3.0x maximum multiplier |

### Token Vault Seeds

| Constant | Value | Purpose |
|----------|--------|---------|
| `STAKING_VAULT_SEED` | `b"staking_vault"` | PDA seed for staking vault |
| `FEE_VAULT_SEED` | `b"fee_vault"` | PDA seed for fee vault |
| `REGISTRATION_VAULT_SEED` | `b"registration_vault"` | PDA seed for registration vault |

---

## Program IDs

### Registry Programs

| Program | Program ID | Purpose |
|---------|------------|---------|
| Agent Registry | `AgentReg11111111111111111111111111111111111` | Agent registration and management |
| MCP Server Registry | TBD | MCP server registration and management |

### Authorized External Programs

| Constant | Value | Purpose |
|----------|--------|---------|
| `AUTHORIZED_ESCROW_PROGRAM_ID` | `"11111111111111111111111111111111"` | Placeholder for escrow program |
| `AUTHORIZED_DDR_PROGRAM_ID` | `"11111111111111111111111111111111"` | Placeholder for DDR program |

> **Note**: The external program IDs are currently placeholders and need to be updated with actual production program IDs.

---

## Compute Unit Costs

> **Note**: No explicit compute unit costs are defined in the program source code. These would typically be determined through testing and optimization of each instruction.

---

## Usage Notes for SDK Developers

### Validation Rules

1. **String Fields**: All string fields must respect their maximum length limits
2. **Required vs Optional**: Some fields are required (non-empty), others are optional
3. **URL Validation**: URLs must start with `http://` or `https://` (some support `ipfs://` and `ar://`)
4. **Character Restrictions**: Server IDs only allow alphanumeric, hyphens, and underscores

### Account Size Calculations

The account sizes are calculated including:
- Anchor discriminator (8 bytes)
- All fixed-size fields
- Variable-size fields at their maximum capacity
- Borsh serialization overhead (length prefixes, option discriminators)

### Token Amount Conversions

Always use the base unit values (with 9 decimals) when working with token amounts in transactions. The human-readable A2AMPL values are provided for reference only.

### PDA Derivation

Both registries use deterministic PDA derivation with:
- Program-specific seed prefix
- Entity identifier (agent_id or server_id)  
- Owner authority pubkey
- Program ID

### Version Management

Both account types include `state_version` fields for optimistic locking and race condition prevention. Always check and increment this field during updates.

---

## Implementation Checklist

When implementing SDK functions, ensure:

- [ ] All string length validations are implemented
- [ ] Token amounts use base units (not decimal A2AMPL)
- [ ] PDA derivation matches program implementation
- [ ] Status enums match program constants
- [ ] Account size calculations are accurate
- [ ] Version checking is implemented for updates
- [ ] Error handling covers all validation cases