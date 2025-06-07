# C++ SDK - Atomic Execution Plan with References

## 6. C++ SDK

### 6.1 Implement `SolanaAiRegistries::Client` (RPC + Tx builder)
- **All public API calls succeed against devnet:**  
  Integration tests must demonstrate that all public API calls work against a live Solana devnet.  
  **Reference:** [`docs/SDK_ROADMAP_DETAILED.md`](../SDK_ROADMAP_DETAILED.md:129-130), [libsodium crypto](https://doc.libsodium.org/)
- **Memory safe:**  
  Use RAII principles, smart pointers, and avoid raw memory management. No memory leaks detected by valgrind.  
  **Reference:** [C++ Core Guidelines - Resource Management](https://isocpp.github.io/CppCoreGuidelines/CppCoreGuidelines#S-resource)
- **Handles errors:**  
  Error handling must use exceptions or std::expected/std::optional with clear error messages.  
  **Reference:** [C++ Core Guidelines - Error Handling](https://isocpp.github.io/CppCoreGuidelines/CppCoreGuidelines#S-errors)
- **API documented:**  
  All public classes and methods must have comprehensive Doxygen comments.  
  **Reference:** [Doxygen documentation](https://www.doxygen.nl/manual/docblocks.html)

### 6.2 Implement `SolanaAiRegistries::Agent` / `SolanaAiRegistries::Mcp` (high-level ops)
- **All CRUD ops implemented:**  
  Methods for create, read, update, and delete registry entries must be present and callable.  
  **Reference:** [`docs/IMPLEMENTATION_SUMMARY.md`](../IMPLEMENTATION_SUMMARY.md:153-162), [`programs/agent-registry/src/instruction.rs`](../../programs/agent-registry/src/instruction.rs)
- **Unit tests for each:**  
  Each method must have at least one unit test for both success and failure paths using Google Test.  
  **Reference:** [Google Test documentation](https://google.github.io/googletest/)
- **Memory safe:**  
  Use RAII principles, smart pointers, and avoid raw memory management. No memory leaks detected by valgrind.  
  **Reference:** [C++ Core Guidelines - Resource Management](https://isocpp.github.io/CppCoreGuidelines/CppCoreGuidelines#S-resource)
- **API documented:**  
  All public classes and methods must have comprehensive Doxygen comments.  
  **Reference:** [Doxygen documentation](https://www.doxygen.nl/manual/docblocks.html)

### 6.3 Implement `SolanaAiRegistries::Payments` (all flows)
- **All payment flows implemented:**  
  Methods for prepay, pay-as-you-go, and stream payments must be present and callable.  
  **Reference:** [`docs/SDK_ROADMAP_DETAILED.md`](../SDK_ROADMAP_DETAILED.md:139-148)
- **Unit tests for each:**  
  Each payment flow must have at least one unit test for both success and failure using Google Test.  
  **Reference:** [Google Test documentation](https://google.github.io/googletest/)
- **Handles edge cases:**  
  Tests must cover scenarios like insufficient balance, invalid mint, and unauthorized payer.  
  **Reference:** [`programs/svmai-token/src/lib.rs`](../../programs/svmai-token/src/lib.rs)
- **Memory safe:**  
  Use RAII principles, smart pointers, and avoid raw memory management. No memory leaks detected by valgrind.  
  **Reference:** [C++ Core Guidelines - Resource Management](https://isocpp.github.io/CppCoreGuidelines/CppCoreGuidelines#S-resource)
- **API documented:**  
  All public classes and methods must have comprehensive Doxygen comments.  
  **Reference:** [Doxygen documentation](https://www.doxygen.nl/manual/docblocks.html)

### 6.4 Implement `SolanaAiRegistries::Idl` (compile-time structs)
- **IDL loads:**  
  The IDL must be converted to C++ structures at compile time using code generation or constexpr.  
  **Reference:** [C++20 constexpr](https://en.cppreference.com/w/cpp/language/constexpr), [`idl/`](../../idl/)
- **Struct mapping correct:**  
  Generated C++ structs must match the Anchor IDL structure exactly.  
  **Reference:** [Anchor IDL Format](https://www.anchor-lang.com/docs/idl)
- **Documented usage:**  
  The code must include comments explaining how the IDL structures are generated and used.  
  **Reference:** [Doxygen documentation](https://www.doxygen.nl/manual/docblocks.html)

### 6.5 Write integration test: `cmake --build . --target test-integration`
- **All tests pass:**  
  Integration tests must run successfully against Solana devnet.  
  **Reference:** [`docs/SDK_ROADMAP_DETAILED.md`](../SDK_ROADMAP_DETAILED.md:141)
- **Coverage >90%:**  
  Use gcov, lcov, or similar tool to verify code coverage exceeds 90%.  
  **Reference:** [gcov documentation](https://gcc.gnu.org/onlinedocs/gcc/Gcov.html), [lcov documentation](http://ltp.sourceforge.net/coverage/lcov.php)
- **No memory leaks:**  
  Valgrind must report zero memory leaks or errors.  
  **Reference:** [Valgrind documentation](https://valgrind.org/docs/manual/manual.html)
- **Output reproducible:**  
  Running the tests multiple times yields the same results.  
  **Reference:** [C++ Testing Best Practices](https://github.com/cpp-best-practices/cppbestpractices/blob/master/03-Style.md#testing)