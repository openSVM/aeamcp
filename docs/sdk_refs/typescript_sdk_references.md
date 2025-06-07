# TypeScript SDK - Atomic Execution Plan with References

## 2. TypeScript SDK

### 2.1 Implement `@svmai/registries` `src/agent.ts` (AgentAPI)
- **All agent CRUD ops implemented:**  
  Functions for create, read, update, and delete agent registry entries must be present and callable.  
  **Reference:** [`docs/IMPLEMENTATION_SUMMARY.md`](../IMPLEMENTATION_SUMMARY.md:153-162), [`programs/agent-registry/src/instruction.rs`](../../programs/agent-registry/src/instruction.rs)
- **Unit tests for each:**  
  Each function must have at least one unit test for both success and failure using Jest.  
  **Reference:** [`frontend/components/onboarding/`](../../frontend/components/onboarding/), [Jest documentation](https://jestjs.io/)
- **API documented with JSDoc:**  
  All public functions and types must have JSDoc comments.  
  **Reference:** [JSDoc Guide](https://jsdoc.app/), [TypeScript JSDoc Reference](https://www.typescriptlang.org/docs/handbook/jsdoc-supported-types.html)
- **100% branch coverage:**  
  Use Jest coverage reports to ensure all code branches are tested.  
  **Reference:** [Jest Coverage](https://jestjs.io/docs/code-coverage)

### 2.2 Implement `src/mcp.ts` (MCPAPI)
- **All MCP CRUD ops implemented:**  
  Functions for create, read, update, and delete MCP server registry entries must be present and callable.  
  **Reference:** [`docs/IMPLEMENTATION_SUMMARY.md`](../IMPLEMENTATION_SUMMARY.md:174-183), [`programs/mcp-server-registry/src/instruction.rs`](../../programs/mcp-server-registry/src/instruction.rs)
- **Unit tests for each:**  
  Each function must have at least one unit test for both success and failure using Jest.  
  **Reference:** [`frontend/components/onboarding/`](../../frontend/components/onboarding/), [Jest documentation](https://jestjs.io/)
- **API documented:**  
  All public functions and types must have JSDoc comments.  
  **Reference:** [JSDoc Guide](https://jsdoc.app/), [TypeScript JSDoc Reference](https://www.typescriptlang.org/docs/handbook/jsdoc-supported-types.html)
- **100% branch coverage:**  
  Use Jest coverage reports to ensure all code branches are tested.  
  **Reference:** [Jest Coverage](https://jestjs.io/docs/code-coverage)

### 2.3 Implement `payments/prepay.ts`, `pyg.ts`, `stream.ts`
- **All payment flows implemented:**  
  Functions for prepay, pay-as-you-go, and stream payments must be present and callable.  
  **Reference:** [`docs/SDK_ROADMAP_DETAILED.md`](../SDK_ROADMAP_DETAILED.md:139-148)
- **Unit tests for each:**  
  Each payment flow must have at least one unit test for both success and failure using Jest.  
  **Reference:** [Jest documentation](https://jestjs.io/)
- **Handles edge cases:**  
  Tests must cover scenarios like insufficient balance, invalid mint, and unauthorized payer.  
  **Reference:** [`programs/svmai-token/src/lib.rs`](../../programs/svmai-token/src/lib.rs)
- **API documented:**  
  All public functions and types must have JSDoc comments.  
  **Reference:** [JSDoc Guide](https://jsdoc.app/), [TypeScript JSDoc Reference](https://www.typescriptlang.org/docs/handbook/jsdoc-supported-types.html)

### 2.4 Implement `client.ts` (Connection wrapper)
- **All public API calls succeed against devnet:**  
  Integration tests must demonstrate that all public API calls work against a live Solana devnet.  
  **Reference:** [`docs/SDK_ROADMAP_DETAILED.md`](../SDK_ROADMAP_DETAILED.md:81-82), [@solana/web3.js docs](https://solana-labs.github.io/solana-web3.js/)
- **Handles errors:**  
  Error handling must be robust, with clear error messages and proper TypeScript error types.  
  **Reference:** [TypeScript Error Handling](https://www.typescriptlang.org/docs/handbook/2/narrowing.html#using-type-predicates)
- **API documented:**  
  All public functions and types must have JSDoc comments.  
  **Reference:** [JSDoc Guide](https://jsdoc.app/), [TypeScript JSDoc Reference](https://www.typescriptlang.org/docs/handbook/jsdoc-supported-types.html)

### 2.5 Implement `errors.ts` (typed errors)
- **All error codes match on-chain:**  
  The error types must match the error codes defined in the on-chain program.  
  **Reference:** [`programs/common/src/error.rs`](../../programs/common/src/error.rs), [`programs/agent-registry/src/error.rs`](../../programs/agent-registry/src/error.rs)
- **Unit tests for error mapping:**  
  Tests must verify that each error code is correctly mapped and handled.  
  **Reference:** [Jest documentation](https://jestjs.io/)
- **Documented in code:**  
  Each error type must have JSDoc comments explaining its meaning.  
  **Reference:** [JSDoc Guide](https://jsdoc.app/)

### 2.6 Implement `idl/` (runtime IDL loader)
- **IDL loads:**  
  The IDL must be loaded at runtime from JSON files.  
  **Reference:** [TypeScript JSON imports](https://www.typescriptlang.org/docs/handbook/modules.html#importing-types), [`idl/`](../../idl/)
- **Type safety:**  
  Generated TypeScript types must match the Anchor IDL structure exactly.  
  **Reference:** [Anchor IDL Format](https://www.anchor-lang.com/docs/idl), [@coral-xyz/anchor](https://www.npmjs.com/package/@coral-xyz/anchor)
- **Documented usage:**  
  The code must include comments explaining how the IDL is loaded and used.  
  **Reference:** [JSDoc Guide](https://jsdoc.app/)

### 2.7 Write integration test: `npm test:integration`
- **All tests pass:**  
  Integration tests must run successfully against Solana devnet.  
  **Reference:** [`docs/SDK_ROADMAP_DETAILED.md`](../SDK_ROADMAP_DETAILED.md:93)
- **Coverage >90%:**  
  Use Jest coverage reports to verify code coverage exceeds 90%.  
  **Reference:** [Jest Coverage](https://jestjs.io/docs/code-coverage)
- **Output reproducible:**  
  Running the tests multiple times yields the same results.  
  **Reference:** [Jest Best Practices](https://jestjs.io/docs/best-practices)