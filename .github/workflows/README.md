# GitHub Actions for Rust SDK

This repository includes automated GitHub Actions workflows for the Rust SDK located in the `rust/` directory.

## Workflows

### 1. Rust CI (`rust-ci.yml`)

**Triggers:**
- Push to `main` or `develop` branches (when Rust SDK files change)
- Pull requests to `main` or `develop` branches (when Rust SDK files change)

**What it does:**
- Tests the SDK on multiple Rust versions (stable and beta)
- Checks code formatting
- Builds with different feature combinations
- Runs comprehensive test suite (89 tests)
- Validates packaging

**Testing Matrix:**
- No default features: Core functionality only
- All features: Full feature set including payment systems
- Individual features: `pyg`, `prepay`, `stream`

### 2. Publish to crates.io (`publish-rust-sdk.yml`)

**Triggers:**
- New GitHub releases
- Tags matching pattern `rust-v*` (e.g., `rust-v0.1.0`, `rust-v1.2.0`)

**What it does:**
- Validates code quality (formatting, building, testing)
- Tests all feature flag combinations
- Packages the crate
- Publishes to crates.io

## Setup Requirements

### Required GitHub Secrets

To enable automatic publishing, you need to configure:

1. **`CRATES_TOKEN`** - Your crates.io API token
   - Go to [crates.io/me](https://crates.io/me)
   - Generate a new token with publish permissions
   - Add as repository secret in GitHub Settings → Secrets and variables → Actions

### Publishing Process

#### Automatic Publishing

1. **For releases:**
   ```bash
   # Create and push a new tag
   git tag rust-v0.1.1
   git push origin rust-v0.1.1
   
   # Or create a GitHub release with tag rust-v0.1.1
   ```

2. **For GitHub releases:**
   - Create a new release in the GitHub UI
   - The workflow will automatically trigger

#### Manual Publishing

For development or testing:

```bash
cd rust
export CRATES_TOKEN=your_token_here
cargo publish
```

## Workflow Features

### Smart Path Filtering

Both workflows only run when Rust SDK files change:
- `rust/**` - Any file in the Rust SDK directory
- `.github/workflows/rust-*.yml` - Workflow configuration changes

### Comprehensive Testing

The CI workflow ensures reliability across:
- Multiple Rust versions (stable, beta)
- All feature flag combinations
- Core functionality without optional features
- Full feature set with payment systems

### Error Handling

The workflows are designed to:
- Fail fast on formatting issues
- Validate all feature combinations
- Ensure package can be built and published
- Provide clear error messages

## Local Development

To run the same checks locally:

```bash
cd rust

# Check formatting
cargo fmt -- --check

# Build and test different feature combinations
cargo build --no-default-features
cargo build --all-features
cargo test --no-default-features
cargo test --all-features
cargo test --features pyg
cargo test --features prepay
cargo test --features stream

# Package validation
cargo package --allow-dirty
```

## Troubleshooting

### Common Issues

1. **Formatting failures:**
   ```bash
   cd rust
   cargo fmt
   git add .
   git commit -m "Fix formatting"
   ```

2. **Feature flag compilation errors:**
   - Check that conditional compilation (`#[cfg(feature = "...")]`) is correct
   - Ensure dependencies are properly feature-gated

3. **Publishing failures:**
   - Verify `CRATES_TOKEN` secret is configured
   - Check that version in `Cargo.toml` hasn't been published before
   - Ensure all required metadata is present in `Cargo.toml`

### Workflow Logs

Check workflow execution in:
- GitHub repository → Actions tab
- Look for detailed logs in failed steps
- Review test output for specific failures

## Version Management

The SDK uses semantic versioning:
- `0.x.y` - Pre-1.0 development versions
- `1.x.y` - Stable API versions

When publishing:
1. Update version in `rust/Cargo.toml`
2. Update documentation if needed
3. Create tag with format `rust-vX.Y.Z`
4. Push tag to trigger publishing workflow