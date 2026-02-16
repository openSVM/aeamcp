# Research Summary

## Prompt
# PR #58: [WIP] Integrate MCP registry server into our system

## Description
Thanks for assigning this issue to me. I'm starting to work on it and will keep this PR's description up to date as I form a plan and make progress.

<!-- START COPILOT CODING AGENT SUFFIX -->



<details>

<summary>Original prompt</summary>

> 
> ----
> 
> *This section details on the original issue you should resolve*
> 
> <issue_title>integrate mcp registry server</issue_title>
> <issue_description>here is registry example, study it and integrate in our server
> https://github.com/modelcontextprotocol/registry</issue_description>
> 
> ## Comments on the Issue (you are @copilot in this section)
> 
> <comments>
> </comments>
> 


</details>

- Fixes openSVM/aeamcp#57

<!-- START COPILOT CODING AGENT TIPS -->
---

💡 You can make Copilot smarter by setting up custom instructions, customizing its development environment and configuring Model Context Protocol (MCP) servers. Learn more [Copilot coding agent tips](https://gh.io/copilot-coding-agent-tips) in the docs.

## Task
Thanks for assigning this issue to me. I'm starting to work on it and will keep this PR's description up to date as I form a plan and make progress.

<!-- START COPILOT CODING AGENT SUFFIX -->



<details>

<summary>Original prompt</summary>

> 
> ----
> 
> *This section details on the original issue you should resolve*
> 
> <issue_title>integrate mcp registry server</issue_title>
> <issue_description>here is registry example, study it and integrate in our server
> https://github.com/modelcontextprotocol/registry</issue_description>
> 
> ## Comments on the Issue (you are @copilot in this section)
> 
> <comments>
> </comments>
> 


</details>

- Fixes openSVM/aeamcp#57

<!-- START COPILOT CODING AGENT TIPS -->
---

💡 You can make Copilot smarter by setting up custom instructions, customizing its development environment and configuring Model Context Protocol (MCP) servers. Learn more [Copilot coding agent tips](https://gh.io/copilot-coding-agent-tips) in the docs.


## Findings
## Research Summary: MCP Registry Integration Task

### 1. Project Overview

This is an **Solana blockchain project** (aeamcp) with an existing MCP Server Registry program that needs to integrate the community MCP Registry server from https://github.com/modelcontextprotocol/registry.

### 2. Existing Project Structure

**Workspace: `/tmp/claudev-pr-47382/`**

The project uses a **Cargo workspace** with the following members:
- `programs/svmai-token`
- `programs/agent-registry` 
- `programs/mcp-server-registry` ← **This is the focus**
- `programs/common`
- `rust`

**Key Dependencies (from Cargo.toml):**
```toml
solana-program = "1.18"
borsh = "0.10"
thiserror = "1.0"
serde = { version = "1.0", features = ["derive"] }
serde_json = "1.0"
getrandom = { version = "0.2", features = ["js"] }
```

### 3. Existing mcp-server-registry Program

**Location:** `/tmp/claudev-pr-47382/programs/mcp-server-registry/`

**Module Structure:**
- `src/lib.rs` - Program entrypoint with `process_instruction` function
- `src/instruction.rs` - Instruction definitions (10,498 bytes)
- `src/processor.rs` - Instruction processing logic (40,468 bytes)
- `src/state.rs` - On-chain state structures (22,810 bytes) 
- `src/validation.rs` - Validation logic (13,720 bytes)
- `src/events.rs` - Event definitions (8,723 bytes)

**Existing State Structure (`McpServerRegistryEntryV1`):**
The program already stores on-chain data for MCP servers including:
- Owner authority, server ID, name, version, endpoints
- MCP capabilities (tools, resources, prompts)
- Token-related fields (SVMAI staking, verification tiers)
- Quality metrics (uptime, response time, error rate)
- Fee structures

### 4. External MCP Registry Repository

**URL:** https://github.com/modelcontextprotocol/registry

**Project Type:** Go-based registry service (NOT a Solana program)

**Key Details:**
- Provides MCP clients with a list of MCP servers (like an app store)
- API version v0.1 is **frozen for stability** (as of 2025-10-24)
- Current status: Preview release, GA coming later

**Repository Structure:**
```
cmd/          - Command-line entry points
data/         - Data storage
deploy/       - Deployment configurations  
docs/         - API documentation
internal/     - Internal packages
pkg/          - Public packages
scripts/      - Utility scripts
tests/integration/ - Integration tests
tools/        - Development tools
```

**Key Files:**
- `docker-compose.yml` - Local development
- `go.mod` - Go dependencies
- `CLAUDE.md` - AI assistant instructions
- `docs/` - API documentation

### 5. What Needs Integration

Based on the task description "integrate mcp registry server into our server", this appears to be about:

1. **Connecting to the external MCP Registry API** - The external registry is a Go HTTP service that provides discovery of MCP servers
2. The existing on-chain registry stores server metadata on Solana blockchain
3. Integration likely involves either:
   - Fetching servers from the external registry and storing them on-chain
   - Syncing data between the on-chain registry and external registry
   - Adding the external registry as a data source

### 6. API Considerations

The external MCP Registry has a **REST API** for:
- Listing available MCP servers
- Publishing MCP servers to the registry
- Server metadata and capabilities

**No direct Solana integration** exists in the external registry - it's a standalone Go service.

### 7. Gotchas & Important Notes

1. **Two Different Systems**: The external registry is a Go HTTP service, while the existing program is a Solana Rust program - they are not directly compatible
2. **API Freeze**: The external registry's v0.1 API is stable for the next month+ - good time to integrate
3. **On-chain vs Off-chain**: The existing mcp-server-registry stores data on Solana, while the external registry is a traditional REST API
4. **Dependencies**: External registry uses Go (check `go.mod`), project uses Rust/Cargo
5. **Data Synchronization**: Integration likely needs a bridge/service to sync between the two registries

### 8. Suggested Next Steps

1. Read the external registry's API documentation in the `docs/` folder
2. Determine the integration pattern (sync, lookup, or hybrid)
3. Build a Rust service or Solana program extension that communicates with the external Registry API
4. Consider using HTTP client in Rust (e.g., `reqwest`) to call the external registry API
