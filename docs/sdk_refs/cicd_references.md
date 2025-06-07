# CI/CD - Atomic Execution Plan with References

## 7. CI/CD

### 7.1 Create `.github/workflows/rust-publish.yml` for Crates.io
- **Workflow file exists:**  
  The file must exist at `.github/workflows/rust-publish.yml` with valid YAML syntax.  
  **Reference:** [GitHub Actions syntax](https://docs.github.com/en/actions/using-workflows/workflow-syntax-for-github-actions)
- **Publishes on tag:**  
  The workflow must trigger on version tags (e.g., `v*`) and publish to crates.io.  
  **Reference:** [`docs/SDK_ROADMAP_DETAILED.md`](../SDK_ROADMAP_DETAILED.md:151-161), [Publishing to crates.io](https://doc.rust-lang.org/cargo/reference/publishing.html)
- **Tests pass first:**  
  The workflow must run all tests before attempting to publish.  
  **Reference:** [GitHub Actions - Job dependencies](https://docs.github.com/en/actions/using-jobs/using-jobs-in-a-workflow)
- **Uses secrets:**  
  The workflow must use GitHub secrets for the crates.io API token.  
  **Reference:** [GitHub Actions - Encrypted secrets](https://docs.github.com/en/actions/security-guides/encrypted-secrets)

### 7.2 Create `.github/workflows/typescript-publish.yml` for npm
- **Workflow file exists:**  
  The file must exist at `.github/workflows/typescript-publish.yml` with valid YAML syntax.  
  **Reference:** [GitHub Actions syntax](https://docs.github.com/en/actions/using-workflows/workflow-syntax-for-github-actions)
- **Publishes on tag:**  
  The workflow must trigger on version tags (e.g., `v*`) and publish to npm.  
  **Reference:** [`docs/SDK_ROADMAP_DETAILED.md`](../SDK_ROADMAP_DETAILED.md:163-173), [npm publish docs](https://docs.npmjs.com/cli/v8/commands/npm-publish)
- **Tests pass first:**  
  The workflow must run all tests before attempting to publish.  
  **Reference:** [GitHub Actions - Job dependencies](https://docs.github.com/en/actions/using-jobs/using-jobs-in-a-workflow)
- **Uses secrets:**  
  The workflow must use GitHub secrets for the npm authentication token.  
  **Reference:** [GitHub Actions - Encrypted secrets](https://docs.github.com/en/actions/security-guides/encrypted-secrets)

### 7.3 Create `.github/workflows/go-publish.yml` for Go modules
- **Workflow file exists:**  
  The file must exist at `.github/workflows/go-publish.yml` with valid YAML syntax.  
  **Reference:** [GitHub Actions syntax](https://docs.github.com/en/actions/using-workflows/workflow-syntax-for-github-actions)
- **Tags version:**  
  The workflow must create git tags for Go module versioning.  
  **Reference:** [`docs/SDK_ROADMAP_DETAILED.md`](../SDK_ROADMAP_DETAILED.md:175-183), [Go module versioning](https://go.dev/doc/modules/version-numbers)
- **Tests pass first:**  
  The workflow must run all tests before attempting to tag.  
  **Reference:** [GitHub Actions - Job dependencies](https://docs.github.com/en/actions/using-jobs/using-jobs-in-a-workflow)

### 7.4 Create `.github/workflows/python-publish.yml` for PyPI
- **Workflow file exists:**  
  The file must exist at `.github/workflows/python-publish.yml` with valid YAML syntax.  
  **Reference:** [GitHub Actions syntax](https://docs.github.com/en/actions/using-workflows/workflow-syntax-for-github-actions)
- **Publishes on tag:**  
  The workflow must trigger on version tags (e.g., `v*`) and publish to PyPI.  
  **Reference:** [`docs/SDK_ROADMAP_DETAILED.md`](../SDK_ROADMAP_DETAILED.md:185-195), [PyPI publishing guide](https://packaging.python.org/en/latest/tutorials/packaging-projects/)
- **Tests pass first:**  
  The workflow must run all tests before attempting to publish.  
  **Reference:** [GitHub Actions - Job dependencies](https://docs.github.com/en/actions/using-jobs/using-jobs-in-a-workflow)
- **Uses secrets:**  
  The workflow must use GitHub secrets for the PyPI API token.  
  **Reference:** [GitHub Actions - Encrypted secrets](https://docs.github.com/en/actions/security-guides/encrypted-secrets)

### 7.5 Create `.github/workflows/c-release.yml` for GitHub Releases
- **Workflow file exists:**  
  The file must exist at `.github/workflows/c-release.yml` with valid YAML syntax.  
  **Reference:** [GitHub Actions syntax](https://docs.github.com/en/actions/using-workflows/workflow-syntax-for-github-actions)
- **Creates release:**  
  The workflow must create GitHub releases with compiled binaries.  
  **Reference:** [`docs/SDK_ROADMAP_DETAILED.md`](../SDK_ROADMAP_DETAILED.md:197-207), [GitHub Releases API](https://docs.github.com/en/rest/releases/releases)
- **Multi-platform:**  
  The workflow must build for Linux, macOS, and Windows.  
  **Reference:** [GitHub Actions - Matrix builds](https://docs.github.com/en/actions/using-jobs/using-a-matrix-for-your-jobs)
- **Tests pass first:**  
  The workflow must run all tests before attempting to create release.  
  **Reference:** [GitHub Actions - Job dependencies](https://docs.github.com/en/actions/using-jobs/using-jobs-in-a-workflow)

### 7.6 Create `.github/workflows/cpp-release.yml` for GitHub Releases + Conan
- **Workflow file exists:**  
  The file must exist at `.github/workflows/cpp-release.yml` with valid YAML syntax.  
  **Reference:** [GitHub Actions syntax](https://docs.github.com/en/actions/using-workflows/workflow-syntax-for-github-actions)
- **Creates release:**  
  The workflow must create GitHub releases with compiled binaries.  
  **Reference:** [`docs/SDK_ROADMAP_DETAILED.md`](../SDK_ROADMAP_DETAILED.md:209-219), [GitHub Releases API](https://docs.github.com/en/rest/releases/releases)
- **Publishes to Conan:**  
  The workflow must also publish to Conan Center.  
  **Reference:** [Conan packaging guide](https://docs.conan.io/en/latest/creating_packages.html)
- **Multi-platform:**  
  The workflow must build for Linux, macOS, and Windows.  
  **Reference:** [GitHub Actions - Matrix builds](https://docs.github.com/en/actions/using-jobs/using-a-matrix-for-your-jobs)
- **Tests pass first:**  
  The workflow must run all tests before attempting to create release.  
  **Reference:** [GitHub Actions - Job dependencies](https://docs.github.com/en/actions/using-jobs/using-jobs-in-a-workflow)