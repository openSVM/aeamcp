# Common Artifacts - Atomic Execution Plan with References

## 0. Common Artifacts

### 0.1 Download all Anchor IDL JSON files
- **IDL files exist at `idl/`:**  
  The `idl/` directory must contain valid JSON files for agent_registry.json and mcp_server_registry.json.  
  **Reference:** [`docs/IMPLEMENTATION_SUMMARY.md`](../IMPLEMENTATION_SUMMARY.md:184-193), [Anchor IDL docs](https://www.anchor-lang.com/docs/idl)
- **JSON is valid and parseable:**  
  Each IDL file must be valid JSON that can be parsed without errors.  
  **Reference:** [JSON specification](https://www.json.org/json-en.html)
- **Matches on-chain programs:**  
  The IDL must match the deployed programs on devnet/mainnet.  
  **Reference:** [`programs/`](../../programs/), [Anchor verify](https://www.anchor-lang.com/docs/verifiable-builds)

### 0.2 Extract program constants (CU, sizes)
- **Constants documented:**  
  A constants file must list all compute units, sizes, and limits from the programs.  
  **Reference:** [`programs/agent-registry/src/constants.rs`](../../programs/agent-registry/src/constants.rs), [`programs/mcp-server-registry/src/constants.rs`](../../programs/mcp-server-registry/src/constants.rs)
- **Matches on-chain:**  
  Constants must match those defined in the deployed programs.  
  **Reference:** [`docs/IMPLEMENTATION_STATUS.md`](../IMPLEMENTATION_STATUS.md:195-204)
- **Used by all SDKs:**  
  All SDKs must reference these constants instead of hardcoding values.  
  **Reference:** [`docs/SDK_ROADMAP_DETAILED.md`](../SDK_ROADMAP_DETAILED.md:15-16)

### 0.3 Generate Solana Kinobi RPC structure (docs/kinobi.md)
- **Kinobi config exists:**  
  A Kinobi configuration file must be present and valid.  
  **Reference:** [Kinobi documentation](https://github.com/metaplex-foundation/kinobi), [`docs/SDK_ROADMAP_DETAILED.md`](../SDK_ROADMAP_DETAILED.md:259-262)
- **RPC structure documented:**  
  The generated docs/kinobi.md must contain all RPC methods and their signatures.  
  **Reference:** [Solana RPC docs](https://docs.solana.com/developing/clients/jsonrpc-api)
- **Covers all instructions:**  
  Every program instruction must have corresponding RPC documentation.  
  **Reference:** [`programs/agent-registry/src/instruction.rs`](../../programs/agent-registry/src/instruction.rs), [`programs/mcp-server-registry/src/instruction.rs`](../../programs/mcp-server-registry/src/instruction.rs)

### 0.4 Create unified accounts list (agent, MCP)
- **Account structures documented:**  
  All account types from both programs must be listed with their fields and sizes.  
  **Reference:** [`programs/agent-registry/src/state.rs`](../../programs/agent-registry/src/state.rs), [`programs/mcp-server-registry/src/state.rs`](../../programs/mcp-server-registry/src/state.rs)
- **PDA derivations included:**  
  Program Derived Address seeds and bump calculations must be documented.  
  **Reference:** [`docs/IMPLEMENTATION_SUMMARY.md`](../IMPLEMENTATION_SUMMARY.md:205-214)
- **Used by all SDKs:**  
  All SDKs must use these account definitions.  
  **Reference:** [`docs/SDK_ROADMAP_DETAILED.md`](../SDK_ROADMAP_DETAILED.md:17-18)

### 0.5 Prototype unified API shape (REST-like spec)
- **OpenAPI spec exists:**  
  An OpenAPI 3.0 specification file must define all endpoints.  
  **Reference:** [OpenAPI Specification](https://swagger.io/specification/), [`docs/SDK_ROADMAP_DETAILED.md`](../SDK_ROADMAP_DETAILED.md:264-267)
- **Covers all operations:**  
  Every CRUD operation for agents and MCP servers must have an endpoint.  
  **Reference:** [`docs/IMPLEMENTATION_SUMMARY.md`](../IMPLEMENTATION_SUMMARY.md:153-162)
- **Consistent across SDKs:**  
  All SDKs must implement this same API shape.  
  **Reference:** [`docs/SDK_ROADMAP_DETAILED.md`](../SDK_ROADMAP_DETAILED.md:19)

### 0.6 Create test fixtures (wallet, mint)
- **Test wallets created:**  
  At least 3 test wallets with SOL balance must be available for testing.  
  **Reference:** [`docs/DEPLOYMENT_AND_TESTING_GUIDE.md`](../DEPLOYMENT_AND_TESTING_GUIDE.md:27-36), [Solana CLI wallet docs](https://docs.solana.com/cli/wallets)
- **SVMAI mint configured:**  
  A test SVMAI token mint must be deployed with test tokens minted to wallets.  
  **Reference:** [`programs/svmai-token/`](../../programs/svmai-token/), [`docs/IMPLEMENTATION_SUMMARY.md`](../IMPLEMENTATION_SUMMARY.md:215-224)
- **Documented in README:**  
  Test setup instructions must be clear and reproducible.  
  **Reference:** [`README.md`](../README.md), [`docs/DEPLOYMENT_AND_TESTING_GUIDE.md`](../DEPLOYMENT_AND_TESTING_GUIDE.md)
- **Scripts provided:**  
  Setup scripts must automate wallet and mint creation.  
  **Reference:** [`scripts/`](../../scripts/)