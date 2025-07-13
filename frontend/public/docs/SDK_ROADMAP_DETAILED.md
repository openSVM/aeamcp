# Solana AI Registries – **SDK Master Plan**  
*(coverage = 100 % on-chain instructions + 100 % payment flows)*  

---

## 0. Common Artifacts (central repo = `sdk-assets`)
* `idl/agent_registry.json` – Anchor IDL (v1 hash: `b6e4…`)  
* `idl/mcp_server_registry.json` – Anchor IDL (v1 hash: `c1fd…`)  
* `idl/svmai_token.json` – SPL-mint interface  
* `schemas/payment-metadata.schema.json` – strict JSON Schema (draft-2020-12)  
* `fixtures/`  
  * `agent-card.valid.json` / `agent-card.invalid.json`  
  * `mcp-card.valid.json` / `mcp-card.invalid.json`  
  * `pricing-metadata.valid.json`  
* CI job `verify-idl-hash` → blocks merge if IDL hash drift detected.

---

## 1. **Rust crate** `solana_ai_registries`  
### 1.1 Crate layout (`src/`)
| File | Purpose |
| ---- | ------- |
| `lib.rs` | re-exports + feature gates |
| `agent/mod.rs` | high-level builder, typed requests |
| `mcp/mod.rs` | same for servers |
| `payments/mod.rs` | three flow engines |
| `client.rs` | wrapper around `solana_client::rpc_client::RpcClient` |
| `errors.rs` | `#[error_code]` mirrored enums |
| `idl.rs` | compile-time inclusion of JSON IDLs |

### 1.2 Public API (excerpt)
```rust
pub fn register_agent(cx: &Signer, args: AgentArgs) -> Result<Signature>;
pub fn update_agent(cx: &Signer, id: &str, patch: AgentPatch) -> Result<Signature>;
pub fn pay_pyg(cx: &Signer, mint: Pubkey, lamports: u64, treasury: Pubkey) -> Result<Signature>;
```

### 1.3 Tests
* `tests/agent_flow.rs` – covers full CRUD, 26 cases.  
* `tests/payment_pyg.rs` – CU budget + balance assertions.  
* Snapshot tests against devnet ledger replay (`ledger/devnet/`).

### 1.4 Release
* Feature flags: `stream`, `pyg`, `prepay`.  
* `cargo publish` gated by `cargo deny` and MSRV 1.74.

---

## 2. **TypeScript package** `@svmai/registries`
### 2.1 Directory tree
```
src/
  agent.ts            // AgentAPI class
  mcp.ts              // MCPAPI class
  payments/
    prepay.ts
    pyg.ts
    stream.ts
  utils/
    idl.ts            // cached IDL loader
    borsh.ts          // Borsh helpers
examples/
  register-agent.ts
  update-server.ts
  pay-pyg.ts
```
### 2.2 Key functions
```ts
registerAgent(connection, signer, card: AgentCard): Promise<string>;
payAsYouGo(connection, signer, cfg: PayCfg): Promise<string>;
```
### 2.3 Tooling
* Built with TS 5.5, target ES2022.  
* Strict ESM + type exports.  
* Jest + `@solana/web3.js` local validator fixture.  
* `npm run docs` → typedoc.

---

## 3. **Go module** `github.com/svmai/registries`
### 3.1 Packages
* `client` – RPC + Tx builder  
* `agent` / `mcp` – high-level ops  
* `payments` – flow implementations  
* `idl` – generated `go:embed` structs

### 3.2 Example
```go
agent.Register(ctx, rpc, signer, agent.Card{ID:"bot-1", …})
payments.PayPYG(ctx, rpc, signer, payments.Config{Mint: svmaiMint, …})
```
### 3.3 QA
`go test ./... -run TestIntegration -tags=devnet`

---

## 4. **Python package** `svmai-registries`
### 4.1 Modules
* `ai_registries.agent` / `ai_registries.mcp`  
* `ai_registries.payments` (async)  
* `ai_registries.idl` – lazy-loaded via `anchorpy.Idl`.

### 4.2 API surfaces
```python
sig = await Agent.register(agent_card, payer, client)
await Payments.pay_pyg(amount=1_000_000, mint=SVMAI_MINT, payer=payer)
```
### 4.3 Docs
* Sphinx → RTD publish.  
* Jupyter notebooks under `examples/`.

---

## 5. **C SDK** `libaireg`
### 5.1 Files
```
include/aireg.h      // 62 exported funcs
src/agent.c
src/mcp.c
src/payments.c
bindings/solana/      // from anchor-gen
examples/register.c
```
### 5.2 Build
```bash
cmake -B build && cmake --build build
```
### 5.3 ABI
* Follows `solana-c` account structs; all pointers validated; returns `AI_ERR_*` codes.

---

## 6. **C++17 wrapper** `aireg++`
* Header-only `aireg.hpp`, uses namespaces and RAII.  
* Bridges to `libaireg` via `extern "C"`.

---

## 7. Payment Flow Support (matrix)

| SDK | Pre-pay | Pay-as-you-go | Stream (Lights.so) |
|-----|---------|--------------|--------------------|
| Rust | ✓ `payments::prepay` | ✓ `payments::pyg` | ✓ feature `stream` |
| TS   | ✓ | ✓ | ✓ |
| Go   | ✓ | ✓ | ✓ via interface |
| Py   | ✓ | ✓ | ✓ (async tasks) |
| C    | ✓ | ✓ | ✗ (planned Q3) |
| C++  | ✓ | ✓ | ✗ (inherits C) |

---

## 8. Example Scenario Walkthrough (`demos/e2e/`)
1. `01_mint_svmai.sh` → creates mint + treasury ATA.  
2. `02_register_mcp.<lang>` → register server, attach `pricing-metadata.json` (Arweave upload script).  
3. `03_client_pay_and_call.<lang>` → perform PYG payment, then HTTP RPC call, then parse JSON response.

---

## 9. Milestones (calendar-week granularity)

| Week | Deliverable | Owner | Exit Criteria |
|------|-------------|-------|---------------|
| 24-25 | Rust core + tests | Core team | 100 % instruction coverage |
| 25-26 | TS parity | Frontend | npm v0.1 published |
| 26-27 | Python + Go autogen | SDK guild | devnet demo passes |
| 27-28 | C base + C++ wrapper | Systems | CI on Ubuntu + macOS |
| 29 | Cross-lang e2e + docs | Docs squad | All demos succeed on CI |

---

## 10. CI Matrix (`.github/workflows/sdk.yml`)
* Linux & macOS runners  
* Job 1 Rust → `cargo test --all --features stream`  
* Job 2 Node 20 → `npm test`  
* Job 3 Go 1.22 → `go test ./...`  
* Job 4 Python 3.12 → `pytest`  
* Job 5 C/C++ → `cmake --build` + `ctest`  
* Job 6 E2E devnet spin-up → shell scripts execute demos in all languages.

---
## 11. GitHub Actions – *Package-manager Publishing*

```yaml
# .github/workflows/publish.yml
name: Publish SDKs

on:
  push:
    tags:
      - 'sdk/**'          # e.g. sdk/ts/v0.1.2, sdk/rust/v1.0.0 …

permissions:
  contents: read
  id-token: write        # OIDC for crates.io / PyPI / npm / etc.

jobs:
  # ───────────────────────────────────────── Rust ─────────────────────────────────────────
  rust-crate:
    if: startsWith(github.ref, 'refs/tags/sdk/rust/')
    runs-on: ubuntu-latest
    defaults: { run: { working-directory: rust } }
    steps:
      - uses: actions/checkout@v4
      - uses: dtolnay/rust-toolchain@stable
      - run: cargo publish --token ${{ secrets.CARGO_TOKEN }}

  # ─────────────────────────────────── TypeScript / npm ───────────────────────────────────
  node-package:
    if: startsWith(github.ref, 'refs/tags/sdk/ts/')
    runs-on: ubuntu-latest
    defaults: { run: { working-directory: typescript } }
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-node@v4
        with:
          registry-url: 'https://registry.npmjs.org'
          node-version: '20'
      - run: npm ci
      - run: npm publish --access public
        env:
          NODE_AUTH_TOKEN: ${{ secrets.NPM_TOKEN }}

  # ───────────────────────────────────────── Go / goproxy ─────────────────────────────────
  go-module:
    if: startsWith(github.ref, 'refs/tags/sdk/go/')
    runs-on: ubuntu-latest
    defaults: { run: { working-directory: go } }
    steps:
      - uses: actions/checkout@v4
      - run: go test ./...
      - name: Create version tag for Go proxy
        run: git tag $(echo $GITHUB_REF | cut -d'/' -f4) && git push --tags

  # ───────────────────────────────────────── Python / PyPI ────────────────────────────────
  python-package:
    if: startsWith(github.ref, 'refs/tags/sdk/py/')
    runs-on: ubuntu-latest
    defaults: { run: { working-directory: python } }
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-python@v5
        with: { python-version: '3.12' }
      - run: pip install build
      - run: python -m build
      - uses: pypa/gh-action-pypi-publish@release/v1
        with:
          api-token: ${{ secrets.PYPI_TOKEN }}

  # ───────────────────────────────────────── C / C++ artefacts ────────────────────────────
  c-binaries:
    if: startsWith(github.ref, 'refs/tags/sdk/c/')
    runs-on: ubuntu-latest
    defaults: { run: { working-directory: c } }
    steps:
      - uses: actions/checkout@v4
      - run: cmake -B build && cmake --build build --target package
      - uses: softprops/action-gh-release@v1
        with:
          files: build/*.tar.gz

  cpp-binaries:
    if: startsWith(github.ref, 'refs/tags/sdk/cpp/')
    runs-on: ubuntu-latest
    defaults: { run: { working-directory: cpp } }
    steps:
      - uses: actions/checkout@v4
      - run: cmake -B build && cmake --build build --target package
      - uses: softprops/action-gh-release@v1
        with:
          files: build/*.tar.gz
```

**Tag convention**

| SDK | Tag prefix example |
| --- | ------------------ |
| Rust | `sdk/rust/v1.0.0` |
| TypeScript | `sdk/ts/v0.3.1` |
| Go | `sdk/go/v1.2.0` |
| Python | `sdk/py/v0.2.4` |
| C | `sdk/c/v0.1.0` |
| C++ | `sdk/cpp/v0.1.0` |

Each job is gated by prefix match and publishes to the corresponding ecosystem using OIDC-based secrets (`CARGO_TOKEN`, `NPM_TOKEN`, `PYPI_TOKEN`).