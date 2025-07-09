# GitHub Actions Workflows

This repository includes automated GitHub Actions workflows for both the Rust SDK and TypeScript SDK.

## Workflows

### Rust SDK

#### 1. Rust CI (`rust-ci.yml`)

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

#### 2. Publish to crates.io (`publish-rust-sdk.yml`)

**Triggers:**
- New GitHub releases
- Tags matching pattern `sdk/rust/v*` (e.g., `sdk/rust/v0.1.0`, `sdk/rust/v1.2.0`)

**What it does:**
- Validates code quality (formatting, building, testing)
- Tests all feature flag combinations
- Packages the crate
- Publishes to crates.io

### TypeScript SDK

#### 3. TypeScript CI (`typescript-ci.yml`)

**Triggers:**
- Push to `main` or `develop` branches (when TypeScript SDK files change)
- Pull requests to `main` or `develop` branches (when TypeScript SDK files change)

**What it does:**
- Tests the SDK on multiple Node.js versions (18, 20, 22)
- Checks code formatting with Prettier
- Runs ESLint code quality checks
- Performs TypeScript type checking
- Builds the package with Rollup
- Runs comprehensive test suite with Jest
- Generates coverage reports
- Validates npm package can be built

**Testing Matrix:**
- Node.js versions: 18, 20, 22
- Coverage threshold: 90% (lines, functions, branches, statements)

#### 4. Publish to npm (`publish-typescript-sdk.yml`)

**Triggers:**
- New GitHub releases
- Tags matching pattern `sdk/typescript/v*` (e.g., `sdk/typescript/v0.1.0`, `sdk/typescript/v1.2.0`)

**What it does:**
- Validates code quality (formatting, linting, type checking)
- Builds the package
- Runs comprehensive test suite
- Generates TypeDoc documentation
- Validates npm package
- Publishes to npm as `@svmai/registries`

## Setup Requirements

### Required GitHub Secrets

To enable automatic publishing, you need to configure:

#### For Rust SDK

1. **`CARGO_API_KEY`** - Your crates.io API token
   - Go to [crates.io/me](https://crates.io/me)
   - Generate a new token with publish permissions
   - Add as repository secret in GitHub Settings → Secrets and variables → Actions

#### For TypeScript SDK

1. **`NPM_TOKEN`** - Your npm API token
   - Go to [npmjs.com](https://www.npmjs.com/) and log in
   - Go to Access Tokens in your account settings
   - Generate a new token with "Automation" type (for CI/CD)
   - Add as repository secret in GitHub Settings → Secrets and variables → Actions

### Publishing Process

#### Rust SDK - Automatic Publishing

1. **For releases:**
   ```bash
   # Create and push a new tag
   git tag sdk/rust/v0.1.1
   git push origin sdk/rust/v0.1.1
   
   # Or create a GitHub release with tag sdk/rust/v0.1.1
   ```

2. **For GitHub releases:**
   - Create a new release in the GitHub UI
   - The workflow will automatically trigger

#### TypeScript SDK - Automatic Publishing

1. **For releases:**
   ```bash
   # Create and push a new tag
   git tag sdk/typescript/v0.1.1
   git push origin sdk/typescript/v0.1.1
   
   # Or create a GitHub release with tag sdk/typescript/v0.1.1
   ```

2. **For GitHub releases:**
   - Create a new release in the GitHub UI
   - The workflow will automatically trigger

#### Manual Publishing

##### Rust SDK
For development or testing:

```bash
cd rust
export CARGO_API_KEY=your_token_here
cargo publish
```

##### TypeScript SDK
For development or testing:

```bash
cd sdk/typescript
export NPM_TOKEN=your_token_here
npm publish --access public
```

## Workflow Features

### Smart Path Filtering

Both Rust and TypeScript workflows only run when their respective SDK files change:

**Rust SDK workflows:**
- `rust/**` - Any file in the Rust SDK directory
- `.github/workflows/rust-*.yml` - Rust workflow configuration changes

**TypeScript SDK workflows:**
- `sdk/typescript/**` - Any file in the TypeScript SDK directory
- `.github/workflows/typescript-*.yml` - TypeScript workflow configuration changes

### Comprehensive Testing

**Rust SDK CI** ensures reliability across:
- Multiple Rust versions (stable, beta)
- All feature flag combinations
- Core functionality without optional features
- Full feature set with payment systems

**TypeScript SDK CI** ensures reliability across:
- Multiple Node.js versions (18, 20, 22)
- Code quality with ESLint and Prettier
- Type safety with TypeScript strict mode
- >90% test coverage requirement
- Build compatibility with Rollup bundler

### Error Handling

The workflows are designed to:
- Fail fast on formatting issues
- Validate all feature combinations (Rust) / Node.js versions (TypeScript)
- Ensure packages can be built and published
- Provide clear error messages
- Generate comprehensive coverage reports

## Local Development

### Rust SDK

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

### TypeScript SDK

To run the same checks locally:

```bash
cd sdk/typescript

# Install dependencies
npm install --legacy-peer-deps

# Check formatting
npm run format -- --check

# Lint code
npm run lint

# Type check
npx tsc --noEmit

# Build package
npm run build

# Run tests
npm test

# Run tests with coverage
npm run test:coverage

# Generate documentation
npm run docs

# Package validation
npm pack --dry-run
```

## Troubleshooting

### Common Issues

#### Rust SDK

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
   - Verify `CARGO_API_KEY` secret is configured
   - Check that version in `Cargo.toml` hasn't been published before
   - Ensure all required metadata is present in `Cargo.toml`

#### TypeScript SDK

1. **Formatting failures:**
   ```bash
   cd sdk/typescript
   npm run format
   git add .
   git commit -m "Fix formatting"
   ```

2. **Type checking errors:**
   - Run `npx tsc --noEmit` to see detailed type errors
   - Ensure all dependencies are properly typed
   - Check `tsconfig.json` configuration

3. **Test coverage failures:**
   - Run `npm run test:coverage` to see coverage report
   - Add tests for uncovered lines/functions
   - Ensure coverage threshold is met (90%)

4. **Build failures:**
   - Check Rollup configuration in `rollup.config.js`
   - Ensure all imports are correctly resolved
   - Verify output directory structure

5. **Publishing failures:**
   - Verify `NPM_TOKEN` secret is configured
   - Check that version in `package.json` hasn't been published before
   - Ensure package name `@svmai/registries` is available

### Workflow Logs

Check workflow execution in:
- GitHub repository → Actions tab
- Look for detailed logs in failed steps
- Review test output for specific failures

## Version Management

Both SDKs use semantic versioning:
- `0.x.y` - Pre-1.0 development versions
- `1.x.y` - Stable API versions

When publishing:

### Rust SDK
1. Update version in `rust/Cargo.toml`
2. Update documentation if needed
3. Create tag with format `sdk/rust/vX.Y.Z`
4. Push tag to trigger publishing workflow

### TypeScript SDK
1. Update version in `sdk/typescript/package.json`
2. Update documentation if needed
3. Create tag with format `sdk/typescript/vX.Y.Z`
4. Push tag to trigger publishing workflow