# C SDK - Atomic Execution Plan with References

## 5. C SDK

### 5.1 Implement `solana_ai_registries.h` + `client.c` (RPC + Tx builder)
- **All public API calls succeed against devnet:**  
  Integration tests must demonstrate that all public API calls work against a live Solana devnet.  
  **Reference:** [`docs/SDK_ROADMAP_DETAILED.md`](../SDK_ROADMAP_DETAILED.md:113-114), [libsodium crypto](https://doc.libsodium.org/)
- **Memory safe:**  
  All memory allocations must be properly freed, with no memory leaks detected by valgrind.  
  **Reference:** [Valgrind documentation](https://valgrind.org/docs/manual/manual.html)
- **Handles errors:**  
  Error handling must use standard C error codes with clear error messages.  
  **Reference:** [C Error Handling Best Practices](https://wiki.sei.cmu.edu/confluence/display/c/ERR00-C.+Adopt+and+implement+a+consistent+and+comprehensive+error-handling+policy)
- **API documented:**  
  All public functions must have comprehensive Doxygen comments.  
  **Reference:** [Doxygen documentation](https://www.doxygen.nl/manual/docblocks.html)

### 5.2 Implement `agent.h` / `mcp.h` (high-level ops)
- **All CRUD ops implemented:**  
  Functions for create, read, update, and delete registry entries must be present and callable.  
  **Reference:** [`docs/IMPLEMENTATION_SUMMARY.md`](../IMPLEMENTATION_SUMMARY.md:153-162), [`programs/agent-registry/src/instruction.rs`](../../programs/agent-registry/src/instruction.rs)
- **Unit tests for each:**  
  Each function must have at least one unit test for both success and failure paths.  
  **Reference:** [Unity Test Framework](http://www.throwtheswitch.org/unity)
- **Memory safe:**  
  All memory allocations must be properly freed, with no memory leaks detected by valgrind.  
  **Reference:** [Valgrind documentation](https://valgrind.org/docs/manual/manual.html)
- **API documented:**  
  All public functions must have comprehensive Doxygen comments.  
  **Reference:** [Doxygen documentation](https://www.doxygen.nl/manual/docblocks.html)

### 5.3 Implement `payments.h` (all flows)
- **All payment flows implemented:**  
  Functions for prepay, pay-as-you-go, and stream payments must be present and callable.  
  **Reference:** [`docs/SDK_ROADMAP_DETAILED.md`](../SDK_ROADMAP_DETAILED.md:139-148)
- **Unit tests for each:**  
  Each payment flow must have at least one unit test for both success and failure.  
  **Reference:** [Unity Test Framework](http://www.throwtheswitch.org/unity)
- **Handles edge cases:**  
  Tests must cover scenarios like insufficient balance, invalid mint, and unauthorized payer.  
  **Reference:** [`programs/svmai-token/src/lib.rs`](../../programs/svmai-token/src/lib.rs)
- **Memory safe:**  
  All memory allocations must be properly freed, with no memory leaks detected by valgrind.  
  **Reference:** [Valgrind documentation](https://valgrind.org/docs/manual/manual.html)
- **API documented:**  
  All public functions must have comprehensive Doxygen comments.  
  **Reference:** [Doxygen documentation](https://www.doxygen.nl/manual/docblocks.html)

### 5.4 Implement `idl.h` (compile-time structs)
- **IDL loads:**  
  The IDL must be converted to C structures at compile time using code generation.  
  **Reference:** [C Code Generation Techniques](https://stackoverflow.com/questions/1476820/code-generation-in-c), [`idl/`](../../idl/)
- **Struct mapping correct:**  
  Generated C structs must match the Anchor IDL structure exactly.  
  **Reference:** [Anchor IDL Format](https://www.anchor-lang.com/docs/idl)
- **Documented usage:**  
  The code must include comments explaining how the IDL structures are generated and used.  
  **Reference:** [Doxygen documentation](https://www.doxygen.nl/manual/docblocks.html)

### 5.5 Write integration test: `make test-integration`
- **All tests pass:**  
  Integration tests must run successfully against Solana devnet.  
  **Reference:** [`docs/SDK_ROADMAP_DETAILED.md`](../SDK_ROADMAP_DETAILED.md:125)
- **Coverage >90%:**  
  Use gcov or similar tool to verify code coverage exceeds 90%.  
  **Reference:** [gcov documentation](https://gcc.gnu.org/onlinedocs/gcc/Gcov.html)
- **No memory leaks:**  
  Valgrind must report zero memory leaks or errors.  
  **Reference:** [Valgrind documentation](https://valgrind.org/docs/manual/manual.html)
- **Output reproducible:**  
  Running the tests multiple times yields the same results.  
  **Reference:** [C Testing Best Practices](https://stackoverflow.com/questions/65820/unit-testing-c-code)