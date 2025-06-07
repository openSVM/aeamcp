# Python SDK - Atomic Execution Plan with References

## 4. Python SDK

### 4.1 Implement `solana_ai_registries.client` (RPC + Tx builder)
- **All public API calls succeed against devnet:**  
  Integration tests must demonstrate that all public API calls work against a live Solana devnet.  
  **Reference:** [`docs/SDK_ROADMAP_DETAILED.md`](../SDK_ROADMAP_DETAILED.md:97-98), [solana-py docs](https://michaelhly.github.io/solana-py/)
- **Handles errors:**  
  Error handling must use Python exceptions with clear error messages and proper exception hierarchies.  
  **Reference:** [Python Exception Best Practices](https://docs.python.org/3/tutorial/errors.html)
- **API documented:**  
  All public functions and classes must have comprehensive docstrings following PEP 257.  
  **Reference:** [PEP 257 - Docstring Conventions](https://www.python.org/dev/peps/pep-0257/)

### 4.2 Implement `solana_ai_registries.agent` / `solana_ai_registries.mcp` (high-level ops)
- **All CRUD ops implemented:**  
  Functions for create, read, update, and delete registry entries must be present and callable.  
  **Reference:** [`docs/IMPLEMENTATION_SUMMARY.md`](../IMPLEMENTATION_SUMMARY.md:153-162), [`programs/agent-registry/src/instruction.rs`](../../programs/agent-registry/src/instruction.rs)
- **Unit tests for each:**  
  Each function must have at least one unit test for both success and failure paths using pytest.  
  **Reference:** [pytest documentation](https://docs.pytest.org/)
- **API documented:**  
  All public functions and classes must have comprehensive docstrings following PEP 257.  
  **Reference:** [PEP 257 - Docstring Conventions](https://www.python.org/dev/peps/pep-0257/)

### 4.3 Implement `solana_ai_registries.payments` (all flows)
- **All payment flows implemented:**  
  Functions for prepay, pay-as-you-go, and stream payments must be present and callable.  
  **Reference:** [`docs/SDK_ROADMAP_DETAILED.md`](../SDK_ROADMAP_DETAILED.md:139-148)
- **Unit tests for each:**  
  Each payment flow must have at least one unit test for both success and failure using pytest.  
  **Reference:** [pytest documentation](https://docs.pytest.org/)
- **Handles edge cases:**  
  Tests must cover scenarios like insufficient balance, invalid mint, and unauthorized payer.  
  **Reference:** [`programs/svmai-token/src/lib.rs`](../../programs/svmai-token/src/lib.rs)
- **API documented:**  
  All public functions and classes must have comprehensive docstrings following PEP 257.  
  **Reference:** [PEP 257 - Docstring Conventions](https://www.python.org/dev/peps/pep-0257/)

### 4.4 Implement `solana_ai_registries.idl` (dynamic loader)
- **IDL loads:**  
  The IDL must be dynamically loaded from JSON files using importlib.resources.  
  **Reference:** [importlib.resources](https://docs.python.org/3/library/importlib.resources.html), [`idl/`](../../idl/)
- **Type mapping correct:**  
  Generated Python types must match the Anchor IDL structure exactly using dataclasses or Pydantic.  
  **Reference:** [Anchor IDL Format](https://www.anchor-lang.com/docs/idl), [dataclasses](https://docs.python.org/3/library/dataclasses.html)
- **Documented usage:**  
  The code must include docstrings explaining how the IDL is loaded and used.  
  **Reference:** [PEP 257 - Docstring Conventions](https://www.python.org/dev/peps/pep-0257/)

### 4.5 Write integration test: `pytest tests/integration/test_integration.py -m devnet`
- **All tests pass:**  
  Integration tests must run successfully against Solana devnet.  
  **Reference:** [`docs/SDK_ROADMAP_DETAILED.md`](../SDK_ROADMAP_DETAILED.md:109)
- **Coverage >90%:**  
  Use `pytest --cov` to verify code coverage exceeds 90%.  
  **Reference:** [pytest-cov documentation](https://pytest-cov.readthedocs.io/)
- **Output reproducible:**  
  Running the tests multiple times yields the same results.  
  **Reference:** [pytest best practices](https://docs.pytest.org/en/stable/goodpractices.html)