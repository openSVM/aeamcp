# Go SDK - Atomic Execution Plan with References

## 3. Go SDK

### 3.1 Implement `client` (RPC + Tx builder)
- **All public API calls succeed against devnet:**  
  Integration tests must demonstrate that all public API calls work against a live Solana devnet.  
  **Reference:** [`docs/SDK_ROADMAP_DETAILED.md`](../SDK_ROADMAP_DETAILED.md:81-82), [solana-go docs](https://pkg.go.dev/github.com/gagliardetto/solana-go)
- **Handles errors:**  
  Error handling must be robust, with clear error messages and proper Go error patterns.  
  **Reference:** [Effective Go - Errors](https://golang.org/doc/effective_go#errors)
- **API documented:**  
  All public functions and types must have GoDoc comments.  
  **Reference:** [GoDoc Guidelines](https://go.dev/blog/godoc)

### 3.2 Implement `agent` / `mcp` (high-level ops)
- **All CRUD ops implemented:**  
  Functions for create, read, update, and delete registry entries must be present and callable.  
  **Reference:** [`docs/IMPLEMENTATION_SUMMARY.md`](../IMPLEMENTATION_SUMMARY.md:153-162), [`programs/agent-registry/src/instruction.rs`](../../programs/agent-registry/src/instruction.rs)
- **Unit tests for each:**  
  Each function must have at least one unit test for both success and failure paths.  
  **Reference:** [Go Testing Package](https://golang.org/pkg/testing/)
- **API documented:**  
  All public functions and types must have GoDoc comments.  
  **Reference:** [GoDoc Guidelines](https://go.dev/blog/godoc)

### 3.3 Implement `payments` (all flows)
- **All payment flows implemented:**  
  Functions for prepay, pay-as-you-go, and stream payments must be present and callable.  
  **Reference:** [`docs/SDK_ROADMAP_DETAILED.md`](../SDK_ROADMAP_DETAILED.md:139-148)
- **Unit tests for each:**  
  Each payment flow must have at least one unit test for both success and failure.  
  **Reference:** [Go Testing Package](https://golang.org/pkg/testing/)
- **Handles edge cases:**  
  Tests must cover scenarios like insufficient balance, invalid mint, and unauthorized payer.  
  **Reference:** [`programs/svmai-token/src/lib.rs`](../../programs/svmai-token/src/lib.rs)
- **API documented:**  
  All public functions and types must have GoDoc comments.  
  **Reference:** [GoDoc Guidelines](https://go.dev/blog/godoc)

### 3.4 Implement `idl` (go:embed structs)
- **IDL loads:**  
  The IDL must be embedded at compile time using go:embed directive.  
  **Reference:** [go:embed package](https://pkg.go.dev/embed), [`idl/`](../../idl/)
- **Struct mapping correct:**  
  Generated Go structs must match the Anchor IDL structure exactly.  
  **Reference:** [Anchor IDL Format](https://www.anchor-lang.com/docs/idl)
- **Documented usage:**  
  The code must include comments explaining how the IDL is loaded and used.  
  **Reference:** [GoDoc Guidelines](https://go.dev/blog/godoc)

### 3.5 Write integration test: `go test ./... -run TestIntegration -tags=devnet`
- **All tests pass:**  
  Integration tests must run successfully against Solana devnet.  
  **Reference:** [`docs/SDK_ROADMAP_DETAILED.md`](../SDK_ROADMAP_DETAILED.md:93)
- **Coverage >90%:**  
  Use `go test -cover` to verify code coverage exceeds 90%.  
  **Reference:** [Go Coverage Tool](https://go.dev/blog/cover)
- **Output reproducible:**  
  Running the tests multiple times yields the same results.  
  **Reference:** [Go Testing Best Practices](https://dave.cheney.net/2019/05/07/prefer-table-driven-tests)