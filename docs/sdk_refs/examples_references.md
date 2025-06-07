# Examples - Atomic Execution Plan with References

## 8. Examples

### 8.1 Create `examples/agent-discovery` (find and use agents)
- **Example runs:**  
  The example must execute successfully with `cargo run`, `npm start`, `go run`, `python main.py`, `make run` as appropriate.  
  **Reference:** [`docs/SDK_ROADMAP_DETAILED.md`](../SDK_ROADMAP_DETAILED.md:223-227)
- **Shows discovery:**  
  The example must demonstrate searching for agents by capabilities or keywords.  
  **Reference:** [`docs/IMPLEMENTATION_SUMMARY.md`](../IMPLEMENTATION_SUMMARY.md:164-173)
- **Shows usage:**  
  The example must demonstrate how to retrieve and use agent metadata.  
  **Reference:** [`programs/agent-registry/src/state.rs`](../../programs/agent-registry/src/state.rs)
- **Well commented:**  
  Code must include comprehensive comments explaining each step.  
  **Reference:** Language-specific documentation standards

### 8.2 Create `examples/mcp-integration` (register and query MCP servers)
- **Example runs:**  
  The example must execute successfully with `cargo run`, `npm start`, `go run`, `python main.py`, `make run` as appropriate.  
  **Reference:** [`docs/SDK_ROADMAP_DETAILED.md`](../SDK_ROADMAP_DETAILED.md:229-233)
- **Shows registration:**  
  The example must demonstrate registering an MCP server with metadata.  
  **Reference:** [`docs/IMPLEMENTATION_SUMMARY.md`](../IMPLEMENTATION_SUMMARY.md:174-183)
- **Shows querying:**  
  The example must demonstrate searching for and retrieving MCP servers.  
  **Reference:** [`programs/mcp-registry/src/state.rs`](../../programs/mcp-registry/src/state.rs)
- **Well commented:**  
  Code must include comprehensive comments explaining each step.  
  **Reference:** Language-specific documentation standards

### 8.3 Create `examples/payment-prepay` (prepay flow)
- **Example runs:**  
  The example must execute successfully with `cargo run`, `npm start`, `go run`, `python main.py`, `make run` as appropriate.  
  **Reference:** [`docs/SDK_ROADMAP_DETAILED.md`](../SDK_ROADMAP_DETAILED.md:235-239)
- **Shows prepay:**  
  The example must demonstrate creating a prepay account and using credits.  
  **Reference:** [`docs/SDK_ROADMAP_DETAILED.md`](../SDK_ROADMAP_DETAILED.md:139-141)
- **Handles errors:**  
  The example must show proper error handling for insufficient balance.  
  **Reference:** Language-specific error handling patterns
- **Well commented:**  
  Code must include comprehensive comments explaining each step.  
  **Reference:** Language-specific documentation standards

### 8.4 Create `examples/payment-paygo` (pay-as-you-go flow)
- **Example runs:**  
  The example must execute successfully with `cargo run`, `npm start`, `go run`, `python main.py`, `make run` as appropriate.  
  **Reference:** [`docs/SDK_ROADMAP_DETAILED.md`](../SDK_ROADMAP_DETAILED.md:241-245)
- **Shows pay-as-you-go:**  
  The example must demonstrate direct SPL token transfers for each transaction.  
  **Reference:** [`docs/SDK_ROADMAP_DETAILED.md`](../SDK_ROADMAP_DETAILED.md:142-144)
- **Shows authorization:**  
  The example must demonstrate checking user authorization before payment.  
  **Reference:** [`programs/svmai-token/src/lib.rs`](../../programs/svmai-token/src/lib.rs)
- **Well commented:**  
  Code must include comprehensive comments explaining each step.  
  **Reference:** Language-specific documentation standards

### 8.5 Create `examples/payment-stream` (streaming flow)
- **Example runs:**  
  The example must execute successfully with `cargo run`, `npm start`, `go run`, `python main.py`, `make run` as appropriate.  
  **Reference:** [`docs/SDK_ROADMAP_DETAILED.md`](../SDK_ROADMAP_DETAILED.md:247-251)
- **Shows streaming:**  
  The example must demonstrate setting up a time-based payment stream.  
  **Reference:** [`docs/SDK_ROADMAP_DETAILED.md`](../SDK_ROADMAP_DETAILED.md:145-147)
- **Shows monitoring:**  
  The example must show how to monitor stream status and remaining balance.  
  **Reference:** Language-specific async/streaming patterns
- **Well commented:**  
  Code must include comprehensive comments explaining each step.  
  **Reference:** Language-specific documentation standards

### 8.6 Create `examples/full-workflow` (discovery → integration → payment)
- **Example runs:**  
  The example must execute successfully with `cargo run`, `npm start`, `go run`, `python main.py`, `make run` as appropriate.  
  **Reference:** [`docs/SDK_ROADMAP_DETAILED.md`](../SDK_ROADMAP_DETAILED.md:253-257)
- **Shows full flow:**  
  The example must demonstrate: discover agent → connect → authorize payment → use service.  
  **Reference:** All previous examples combined
- **Error handling:**  
  The example must show comprehensive error handling at each step.  
  **Reference:** Language-specific error handling patterns
- **Production ready:**  
  The example should follow production best practices for the language.  
  **Reference:** Language-specific best practices guides
- **Well commented:**  
  Code must include comprehensive comments explaining each step.  
  **Reference:** Language-specific documentation standards