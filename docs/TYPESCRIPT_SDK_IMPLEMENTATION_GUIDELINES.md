# TypeScript SDK Implementation Guidelines

## Overview

This document provides comprehensive implementation guidelines for the TypeScript SDK (`@svmai/registries`) for Solana AI Registries. These guidelines are based on the atomic execution plan detailed in [`docs/sdk_refs/typescript_sdk_references.md`](./sdk_refs/typescript_sdk_references.md) and the master plan outlined in [`docs/SDK_ROADMAP_DETAILED.md`](./SDK_ROADMAP_DETAILED.md).

## Project Structure

The TypeScript SDK should be implemented with the following directory structure:

```
@svmai/registries/
├── src/
│   ├── agent.ts              # AgentAPI class
│   ├── mcp.ts                # MCPAPI class  
│   ├── client.ts             # Connection wrapper
│   ├── errors.ts             # Typed errors
│   ├── index.ts              # Main exports
│   ├── payments/
│   │   ├── prepay.ts         # Prepayment flow
│   │   ├── pyg.ts            # Pay-as-you-go flow
│   │   └── stream.ts         # Stream payment flow
│   ├── idl/
│   │   ├── index.ts          # IDL loader and types
│   │   └── types.ts          # Generated TypeScript types
│   └── utils/
│       ├── idl.ts            # Cached IDL loader
│       └── borsh.ts          # Borsh serialization helpers
├── examples/
│   ├── register-agent.ts     # Agent registration example
│   ├── update-server.ts      # Server update example
│   └── pay-pyg.ts           # Pay-as-you-go example
├── tests/
│   ├── unit/                # Unit tests
│   ├── integration/         # Integration tests
│   └── fixtures/            # Test fixtures
├── package.json
├── tsconfig.json
├── jest.config.js
└── README.md
```

## Prerequisites

### System Requirements
- Node.js 18.x or higher
- npm 8.x or higher  
- TypeScript 5.5+
- Solana CLI tools (for testing)

### Dependencies
- `@solana/web3.js` - Solana JavaScript SDK
- `@coral-xyz/anchor` - Anchor framework for TypeScript
- `@solana/spl-token` - SPL Token program bindings
- `borsh` - Borsh serialization library

### Development Dependencies
- `jest` - Testing framework
- `@types/jest` - Jest type definitions
- `ts-jest` - TypeScript preprocessor for Jest
- `typedoc` - Documentation generator
- `@solana/web3.js` - Local validator fixture support

## Implementation Tasks

### 1. Project Setup

#### 1.1 Initialize npm Package

```bash
npm init -y
npm install --save @solana/web3.js @coral-xyz/anchor @solana/spl-token borsh
npm install --save-dev jest @types/jest ts-jest typescript typedoc
```

#### 1.2 Configure TypeScript

**Reference:** [`docs/SDK_ROADMAP_DETAILED.md`](./SDK_ROADMAP_DETAILED.md)

Create `tsconfig.json`:
```json
{
  "compilerOptions": {
    "target": "ES2022",
    "module": "ESNext",
    "moduleResolution": "node",
    "esModuleInterop": true,
    "allowSyntheticDefaultImports": true,
    "strict": true,
    "skipLibCheck": true,
    "forceConsistentCasingInFileNames": true,
    "declaration": true,
    "outDir": "./dist",
    "rootDir": "./src",
    "resolveJsonModule": true
  },
  "include": ["src/**/*"],
  "exclude": ["node_modules", "dist", "tests"]
}
```

#### 1.3 Configure Jest

Create `jest.config.js`:
```javascript
module.exports = {
  preset: 'ts-jest',
  testEnvironment: 'node',
  roots: ['<rootDir>/src', '<rootDir>/tests'],
  testMatch: ['**/__tests__/**/*.ts', '**/?(*.)+(spec|test).ts'],
  collectCoverageFrom: [
    'src/**/*.ts',
    '!src/**/*.d.ts',
    '!src/**/index.ts'
  ],
  coverageReporters: ['text', 'lcov', 'html'],
  coverageThreshold: {
    global: {
      branches: 90,
      functions: 90,
      lines: 90,
      statements: 90
    }
  }
};
```

#### 1.4 Package.json Configuration

**Reference:** [`docs/SDK_ROADMAP_DETAILED.md`](./SDK_ROADMAP_DETAILED.md)

```json
{
  "name": "@svmai/registries",
  "version": "1.0.0",
  "description": "TypeScript SDK for Solana AI Registries",
  "main": "dist/index.js",
  "types": "dist/index.d.ts",
  "type": "module",
  "exports": {
    ".": {
      "import": "./dist/index.js",
      "types": "./dist/index.d.ts"
    }
  },
  "scripts": {
    "build": "tsc",
    "test": "jest",
    "test:unit": "jest --testPathPattern=tests/unit",
    "test:integration": "jest --testPathPattern=tests/integration --testTimeout=60000",
    "test:coverage": "jest --coverage",
    "docs": "typedoc --out docs src/index.ts",
    "lint": "eslint src/**/*.ts",
    "prepublishOnly": "npm run build && npm run test"
  },
  "keywords": ["solana", "ai", "registry", "blockchain", "typescript"],
  "author": "openSVM",
  "license": "MIT"
}
```

### 2. Core Implementation

#### 2.1 Implement `src/agent.ts` (AgentAPI)

**Acceptance Criteria:**
- All agent CRUD operations implemented
- Unit tests for each function  
- JSDoc documentation for all public APIs
- 100% branch coverage

**Reference:** [`docs/IMPLEMENTATION_SUMMARY.md`](./IMPLEMENTATION_SUMMARY.md), [`programs/agent-registry/src/instruction.rs`](../programs/agent-registry/src/instruction.rs)

```typescript
import { Connection, PublicKey, Transaction, Signer } from '@solana/web3.js';
import { Program } from '@coral-xyz/anchor';

/**
 * Agent card interface matching on-chain structure
 */
export interface AgentCard {
  id: string;
  name: string;
  description: string;
  endpoint: string;
  capabilities: string[];
  pricing: PricingInfo;
}

/**
 * AgentAPI class for managing agent registry operations
 */
export class AgentAPI {
  constructor(
    private connection: Connection,
    private program: Program
  ) {}

  /**
   * Register a new agent in the registry
   * @param signer - Transaction signer
   * @param card - Agent card data
   * @returns Transaction signature
   */
  async registerAgent(signer: Signer, card: AgentCard): Promise<string> {
    // Implementation details
  }

  /**
   * Update an existing agent
   * @param signer - Transaction signer  
   * @param agentId - Agent ID to update
   * @param updates - Partial agent card updates
   * @returns Transaction signature
   */
  async updateAgent(signer: Signer, agentId: string, updates: Partial<AgentCard>): Promise<string> {
    // Implementation details
  }

  /**
   * Delete an agent from the registry
   * @param signer - Transaction signer
   * @param agentId - Agent ID to delete
   * @returns Transaction signature
   */
  async deleteAgent(signer: Signer, agentId: string): Promise<string> {
    // Implementation details
  }

  /**
   * Get agent information by ID
   * @param agentId - Agent ID to retrieve
   * @returns Agent card or null if not found
   */
  async getAgent(agentId: string): Promise<AgentCard | null> {
    // Implementation details
  }

  /**
   * List all agents in the registry
   * @returns Array of agent cards
   */
  async listAgents(): Promise<AgentCard[]> {
    // Implementation details
  }
}
```

#### 2.2 Implement `src/mcp.ts` (MCPAPI)

**Acceptance Criteria:**
- All MCP CRUD operations implemented
- Unit tests for each function
- JSDoc documentation for all public APIs
- 100% branch coverage

**Reference:** [`docs/IMPLEMENTATION_SUMMARY.md`](./IMPLEMENTATION_SUMMARY.md), [`programs/mcp-server-registry/src/instruction.rs`](../programs/mcp-server-registry/src/instruction.rs)

```typescript
/**
 * MCP Server card interface
 */
export interface McpServerCard {
  id: string;
  name: string;
  description: string;
  endpoint: string;
  capabilities: string[];
  pricing: PricingInfo;
}

/**
 * MCPAPI class for managing MCP server registry operations
 */
export class MCPAPI {
  constructor(
    private connection: Connection,
    private program: Program
  ) {}

  /**
   * Register a new MCP server in the registry
   */
  async registerServer(signer: Signer, card: McpServerCard): Promise<string> {
    // Implementation details
  }

  /**
   * Update an existing MCP server
   */
  async updateServer(signer: Signer, serverId: string, updates: Partial<McpServerCard>): Promise<string> {
    // Implementation details
  }

  /**
   * Delete an MCP server from the registry
   */
  async deleteServer(signer: Signer, serverId: string): Promise<string> {
    // Implementation details
  }

  /**
   * Get MCP server information by ID
   */
  async getServer(serverId: string): Promise<McpServerCard | null> {
    // Implementation details
  }

  /**
   * List all MCP servers in the registry
   */
  async listServers(): Promise<McpServerCard[]> {
    // Implementation details
  }
}
```

#### 2.3 Implement Payment Flows

**Acceptance Criteria:**
- All payment flows implemented (prepay, pay-as-you-go, stream)
- Unit tests for each flow including edge cases
- Proper error handling for insufficient balance, invalid mint, unauthorized payer
- JSDoc documentation

**Reference:** [`docs/SDK_ROADMAP_DETAILED.md`](./SDK_ROADMAP_DETAILED.md), [`programs/svmai-token/src/lib.rs`](../programs/svmai-token/src/lib.rs)

##### `src/payments/prepay.ts`
```typescript
/**
 * Prepayment configuration
 */
export interface PrepayConfig {
  amount: number;
  mint: PublicKey;
  recipient: PublicKey;
  escrowDuration: number;
}

/**
 * Execute prepayment flow
 * @param connection - Solana connection
 * @param signer - Transaction signer
 * @param config - Prepayment configuration
 * @returns Transaction signature
 */
export async function executePrepayment(
  connection: Connection,
  signer: Signer,
  config: PrepayConfig
): Promise<string> {
  // Implementation details
}
```

##### `src/payments/pyg.ts`
```typescript
/**
 * Pay-as-you-go configuration
 */
export interface PygConfig {
  amount: number;
  mint: PublicKey;
  recipient: PublicKey;
  serviceId: string;
}

/**
 * Execute pay-as-you-go payment
 * @param connection - Solana connection
 * @param signer - Transaction signer
 * @param config - Pay-as-you-go configuration
 * @returns Transaction signature
 */
export async function executePayAsYouGo(
  connection: Connection,
  signer: Signer,
  config: PygConfig
): Promise<string> {
  // Implementation details
}
```

##### `src/payments/stream.ts`
```typescript
/**
 * Stream payment configuration
 */
export interface StreamConfig {
  flowRate: number;
  mint: PublicKey;
  recipient: PublicKey;
  duration: number;
}

/**
 * Execute stream payment
 * @param connection - Solana connection
 * @param signer - Transaction signer
 * @param config - Stream payment configuration
 * @returns Transaction signature
 */
export async function executeStreamPayment(
  connection: Connection,
  signer: Signer,
  config: StreamConfig
): Promise<string> {
  // Implementation details
}
```

#### 2.4 Implement `src/client.ts` (Connection Wrapper)

**Acceptance Criteria:**
- All public API calls succeed against devnet
- Robust error handling with clear error messages
- Proper TypeScript error types
- JSDoc documentation

**Reference:** [`docs/SDK_ROADMAP_DETAILED.md`](./SDK_ROADMAP_DETAILED.md), [@solana/web3.js docs](https://solana-labs.github.io/solana-web3.js/)

```typescript
/**
 * Enhanced Solana connection wrapper with retry logic and error handling
 */
export class SolanaClient {
  private connection: Connection;
  private retryAttempts: number = 3;
  private retryDelay: number = 1000;

  constructor(rpcUrl: string, commitment: Commitment = 'confirmed') {
    this.connection = new Connection(rpcUrl, commitment);
  }

  /**
   * Send and confirm transaction with retry logic
   */
  async sendAndConfirmTransaction(
    transaction: Transaction,
    signers: Signer[]
  ): Promise<string> {
    // Implementation with retry logic
  }

  /**
   * Get account info with error handling
   */
  async getAccountInfo(publicKey: PublicKey): Promise<AccountInfo<Buffer> | null> {
    // Implementation with error handling
  }

  /**
   * Get program accounts with pagination
   */
  async getProgramAccounts(
    programId: PublicKey,
    filters?: GetProgramAccountsFilter[]
  ): Promise<{ pubkey: PublicKey; account: AccountInfo<Buffer> }[]> {
    // Implementation details
  }
}
```

#### 2.5 Implement `src/errors.ts` (Typed Errors)

**Acceptance Criteria:**
- Error types match on-chain error codes
- Unit tests for error mapping
- JSDoc documentation for each error type

**Reference:** [`programs/common/src/error.rs`](../programs/common/src/error.rs), [`programs/agent-registry/src/error.rs`](../programs/agent-registry/src/error.rs)

```typescript
/**
 * Base SDK error class
 */
export class SdkError extends Error {
  constructor(message: string, public code: number) {
    super(message);
    this.name = 'SdkError';
  }
}

/**
 * Agent registry specific errors
 */
export class AgentRegistryError extends SdkError {
  static readonly AGENT_NOT_FOUND = new AgentRegistryError('Agent not found', 6000);
  static readonly AGENT_ALREADY_EXISTS = new AgentRegistryError('Agent already exists', 6001);
  static readonly INVALID_AGENT_DATA = new AgentRegistryError('Invalid agent data', 6002);
  static readonly UNAUTHORIZED_UPDATE = new AgentRegistryError('Unauthorized update', 6003);
}

/**
 * MCP registry specific errors
 */
export class McpRegistryError extends SdkError {
  static readonly SERVER_NOT_FOUND = new McpRegistryError('Server not found', 6100);
  static readonly SERVER_ALREADY_EXISTS = new McpRegistryError('Server already exists', 6101);
  static readonly INVALID_SERVER_DATA = new McpRegistryError('Invalid server data', 6102);
  static readonly UNAUTHORIZED_UPDATE = new McpRegistryError('Unauthorized update', 6103);
}

/**
 * Payment specific errors
 */
export class PaymentError extends SdkError {
  static readonly INSUFFICIENT_BALANCE = new PaymentError('Insufficient balance', 6200);
  static readonly INVALID_MINT = new PaymentError('Invalid mint', 6201);
  static readonly UNAUTHORIZED_PAYER = new PaymentError('Unauthorized payer', 6202);
  static readonly PAYMENT_FAILED = new PaymentError('Payment failed', 6203);
}
```

#### 2.6 Implement Runtime IDL Loading

**Acceptance Criteria:**
- IDL loads from JSON files at runtime
- TypeScript types match Anchor IDL structure exactly
- Documented usage with comments

**Reference:** [Anchor IDL Format](https://www.anchor-lang.com/docs/idl), [`idl/`](../idl/)

##### `src/idl/index.ts`
```typescript
import { Idl } from '@coral-xyz/anchor';
import agentRegistryIdl from '../../idl/agent_registry.json';
import mcpServerRegistryIdl from '../../idl/mcp_server_registry.json';

/**
 * Load and cache IDL files
 */
export class IdlLoader {
  private static instance: IdlLoader;
  private idlCache: Map<string, Idl> = new Map();

  private constructor() {}

  static getInstance(): IdlLoader {
    if (!IdlLoader.instance) {
      IdlLoader.instance = new IdlLoader();
    }
    return IdlLoader.instance;
  }

  /**
   * Get Agent Registry IDL
   * @returns Agent Registry IDL
   */
  getAgentRegistryIdl(): Idl {
    if (!this.idlCache.has('agent_registry')) {
      this.idlCache.set('agent_registry', agentRegistryIdl as Idl);
    }
    return this.idlCache.get('agent_registry')!;
  }

  /**
   * Get MCP Server Registry IDL
   * @returns MCP Server Registry IDL
   */
  getMcpServerRegistryIdl(): Idl {
    if (!this.idlCache.has('mcp_server_registry')) {
      this.idlCache.set('mcp_server_registry', mcpServerRegistryIdl as Idl);
    }
    return this.idlCache.get('mcp_server_registry')!;
  }

  /**
   * Validate IDL hash against expected value
   * @param idlName - Name of the IDL
   * @param expectedHash - Expected hash value
   * @returns Whether hash matches
   */
  validateIdlHash(idlName: string, expectedHash: string): boolean {
    const idl = idlName === 'agent_registry' 
      ? this.getAgentRegistryIdl() 
      : this.getMcpServerRegistryIdl();
    
    // Calculate hash of IDL content
    const crypto = require('crypto');
    const idlString = JSON.stringify(idl);
    const actualHash = crypto.createHash('sha256').update(idlString).digest('hex');
    
    return actualHash.startsWith(expectedHash);
  }

  /**
   * Get all available IDL names
   * @returns Array of IDL names
   */
  getAvailableIdls(): string[] {
    return ['agent_registry', 'mcp_server_registry'];
  }
}

// Export singleton instance
export const idlLoader = IdlLoader.getInstance();

// Export types for the IDLs
export type AgentRegistryIdl = typeof agentRegistryIdl;
export type McpServerRegistryIdl = typeof mcpServerRegistryIdl;
```

##### `src/utils/idl.ts`
```typescript
/**
 * Cached IDL loader utility
 */
export class CachedIdlLoader {
  private static cache: Map<string, Idl> = new Map();

  /**
   * Load IDL with caching
   */
  static async loadIdl(programId: string): Promise<Idl> {
    if (this.cache.has(programId)) {
      return this.cache.get(programId)!;
    }

    const idl = await this.fetchIdl(programId);
    this.cache.set(programId, idl);
    return idl;
  }

  private static async fetchIdl(programId: string): Promise<Idl> {
    // Implementation details
  }
}
```

### 3. Testing Implementation

#### 3.1 Unit Tests

**Acceptance Criteria:**
- Each function has success and failure tests
- 100% branch coverage
- Uses Jest testing framework

Create tests in `tests/unit/`:

##### `tests/unit/agent.test.ts`
```typescript
import { AgentAPI } from '../../src/agent';
import { Connection, Keypair } from '@solana/web3.js';

describe('AgentAPI', () => {
  let agentAPI: AgentAPI;
  let mockConnection: jest.Mocked<Connection>;
  let signer: Keypair;

  beforeEach(() => {
    mockConnection = {
      sendTransaction: jest.fn(),
      getAccountInfo: jest.fn(),
      // ... other mocked methods
    } as any;
    signer = Keypair.generate();
    agentAPI = new AgentAPI(mockConnection, {} as any);
  });

  describe('registerAgent', () => {
    it('should register agent successfully', async () => {
      // Test implementation
    });

    it('should throw error when agent already exists', async () => {
      // Test implementation
    });

    it('should handle invalid agent data', async () => {
      // Test implementation
    });
  });

  // ... more test cases
});
```

#### 3.2 Integration Tests

**Acceptance Criteria:**
- All tests pass against Solana devnet
- Coverage >90%
- Reproducible output

**Reference:** [`docs/SDK_ROADMAP_DETAILED.md`](./SDK_ROADMAP_DETAILED.md)

##### `tests/integration/devnet.test.ts`
```typescript
import { Connection, Keypair, clusterApiUrl } from '@solana/web3.js';
import { AgentAPI, MCPAPI } from '../../src';

describe('Devnet Integration Tests', () => {
  let connection: Connection;
  let payer: Keypair;
  let agentAPI: AgentAPI;
  let mcpAPI: MCPAPI;

  beforeAll(async () => {
    connection = new Connection(clusterApiUrl('devnet'), 'confirmed');
    payer = Keypair.generate();
    
    // Request airdrop for testing
    await connection.requestAirdrop(payer.publicKey, 2000000000);
    
    // Initialize APIs
    agentAPI = new AgentAPI(connection, program);
    mcpAPI = new MCPAPI(connection, program);
  });

  it('should register and retrieve agent', async () => {
    // Integration test implementation
  });

  it('should execute payment flows', async () => {
    // Integration test implementation
  });
});
```

### 4. Documentation and Examples

#### 4.1 Example Scripts

**Reference:** [`docs/SDK_ROADMAP_DETAILED.md`](./SDK_ROADMAP_DETAILED.md)

##### `examples/register-agent.ts`
```typescript
import { Connection, Keypair, clusterApiUrl } from '@solana/web3.js';
import { AgentAPI } from '@svmai/registries';

async function main() {
  const connection = new Connection(clusterApiUrl('devnet'), 'confirmed');
  const payer = Keypair.generate();
  
  // Request airdrop
  await connection.requestAirdrop(payer.publicKey, 2000000000);
  
  const agentAPI = new AgentAPI(connection, program);
  
  const agentCard = {
    id: 'my-agent-001',
    name: 'My AI Agent',
    description: 'A helpful AI assistant',
    endpoint: 'https://api.example.com/agent',
    capabilities: ['chat', 'analysis'],
    pricing: {
      model: 'pay-per-use',
      rate: 0.001
    }
  };
  
  const signature = await agentAPI.registerAgent(payer, agentCard);
  console.log('Agent registered with signature:', signature);
  
  // Verify registration
  const retrievedAgent = await agentAPI.getAgent('my-agent-001');
  console.log('Retrieved agent:', retrievedAgent);
}

main().catch(console.error);
```

#### 4.2 API Documentation

**Acceptance Criteria:**
- TypeDoc generates documentation
- All public APIs covered
- Published to docs site

Configure TypeDoc in `typedoc.json`:
```json
{
  "entryPoints": ["src/index.ts"],
  "out": "docs",
  "theme": "default",
  "exclude": ["**/*.test.ts", "**/*.spec.ts"],
  "excludePrivate": true,
  "excludeProtected": true,
  "includeVersion": true,
  "readme": "README.md"
}
```

### 5. CI/CD Configuration

#### 5.1 GitHub Actions Workflow

**Reference:** [`.github/workflows/`](../.github/workflows/)

Create `.github/workflows/typescript-sdk.yml`:
```yaml
name: TypeScript SDK CI

on:
  push:
    branches: [ main, develop ]
    paths: [ 'typescript-sdk/**' ]
  pull_request:
    branches: [ main ]
    paths: [ 'typescript-sdk/**' ]

jobs:
  test:
    runs-on: ubuntu-latest
    strategy:
      matrix:
        node-version: [18.x, 20.x]
    
    steps:
    - uses: actions/checkout@v3
    
    - name: Setup Node.js
      uses: actions/setup-node@v3
      with:
        node-version: ${{ matrix.node-version }}
        cache: 'npm'
        cache-dependency-path: 'typescript-sdk/package-lock.json'
    
    - name: Install dependencies
      run: npm ci
      working-directory: ./typescript-sdk
    
    - name: Run linter
      run: npm run lint
      working-directory: ./typescript-sdk
    
    - name: Run unit tests
      run: npm run test:unit
      working-directory: ./typescript-sdk
    
    - name: Run integration tests
      run: npm run test:integration
      working-directory: ./typescript-sdk
      env:
        SOLANA_RPC_URL: ${{ secrets.SOLANA_DEVNET_RPC_URL }}
    
    - name: Check coverage
      run: npm run test:coverage
      working-directory: ./typescript-sdk
    
    - name: Build package
      run: npm run build
      working-directory: ./typescript-sdk
    
    - name: Generate docs
      run: npm run docs
      working-directory: ./typescript-sdk

  publish:
    needs: test
    runs-on: ubuntu-latest
    if: github.ref == 'refs/heads/main'
    
    steps:
    - uses: actions/checkout@v3
    
    - name: Setup Node.js
      uses: actions/setup-node@v3
      with:
        node-version: '18.x'
        registry-url: 'https://registry.npmjs.org'
    
    - name: Install dependencies
      run: npm ci
      working-directory: ./typescript-sdk
    
    - name: Build package
      run: npm run build
      working-directory: ./typescript-sdk
    
    - name: Publish to npm
      run: npm publish --access public
      working-directory: ./typescript-sdk
      env:
        NODE_AUTH_TOKEN: ${{ secrets.NPM_TOKEN }}
```

#### 5.2 IDL Hash Verification

**Acceptance Criteria:**
- CI job blocks merge if IDL hash drift detected
- Documented in contributing guide

Add to existing workflow:
```yaml
  verify-idl:
    runs-on: ubuntu-latest
    steps:
    - uses: actions/checkout@v3
    
    - name: Verify IDL Hash
      run: |
        # Calculate hash of IDL files
        AGENT_HASH=$(shasum -a 256 idl/agent_registry.json | cut -d' ' -f1)
        MCP_HASH=$(shasum -a 256 idl/mcp_server_registry.json | cut -d' ' -f1)
        
        # Compare with expected hashes (from SDK_ROADMAP_DETAILED.md)
        # Note: Update these hashes when IDL files are finalized
        EXPECTED_AGENT_HASH="b6e4..."  # Placeholder from roadmap
        EXPECTED_MCP_HASH="c1fd..."    # Placeholder from roadmap
        
        if [[ "$AGENT_HASH" != "$EXPECTED_AGENT_HASH" ]]; then
          echo "Agent Registry IDL hash mismatch: expected $EXPECTED_AGENT_HASH, got $AGENT_HASH"
          exit 1
        fi
        
        if [[ "$MCP_HASH" != "$EXPECTED_MCP_HASH" ]]; then
          echo "MCP Server Registry IDL hash mismatch: expected $EXPECTED_MCP_HASH, got $MCP_HASH"
          exit 1
        fi
        
        echo "IDL hash verification passed"
```

### 6. Code Style and Review Requirements

#### 6.1 ESLint Configuration

Create `.eslintrc.js`:
```javascript
module.exports = {
  parser: '@typescript-eslint/parser',
  extends: [
    'eslint:recommended',
    '@typescript-eslint/recommended',
    'prettier'
  ],
  plugins: ['@typescript-eslint'],
  rules: {
    '@typescript-eslint/no-unused-vars': 'error',
    '@typescript-eslint/no-explicit-any': 'warn',
    '@typescript-eslint/explicit-function-return-type': 'error',
    'prefer-const': 'error',
    'no-var': 'error'
  }
};
```

#### 6.2 Prettier Configuration

Create `.prettierrc`:
```json
{
  "semi": true,
  "trailingComma": "es5",
  "singleQuote": true,
  "printWidth": 80,
  "tabWidth": 2
}
```

#### 6.3 Code Review Checklist

- [ ] All functions have JSDoc comments
- [ ] Unit tests cover success and failure cases
- [ ] Integration tests pass against devnet
- [ ] Code coverage >90%
- [ ] ESLint rules pass
- [ ] TypeScript strict mode enabled
- [ ] Error handling implemented
- [ ] Performance considerations addressed
- [ ] Security best practices followed

### 7. Publishing Requirements

#### 7.1 npm Package Configuration

**Reference:** [`docs/SDK_ROADMAP_DETAILED.md`](./SDK_ROADMAP_DETAILED.md)

- Package name: `@svmai/registries`
- Scoped package under `@svmai` organization
- Strict ESM + type exports
- Built with TypeScript 5.5, target ES2022

#### 7.2 Version Management

Follow semantic versioning:
- Major version: Breaking changes
- Minor version: New features
- Patch version: Bug fixes

#### 7.3 Release Process

1. Update version in `package.json`
2. Run full test suite
3. Generate documentation
4. Create release tag
5. Publish to npm registry
6. Update changelog

### 8. Reference Links

#### Related Documentation Files
- [`docs/sdk_refs/typescript_sdk_references.md`](./sdk_refs/typescript_sdk_references.md) - Atomic execution plan
- [`docs/SDK_ROADMAP_DETAILED.md`](./SDK_ROADMAP_DETAILED.md) - Master plan
- [`docs/SDK_EXECUTION_PLAN_DETAILED.md`](./SDK_EXECUTION_PLAN_DETAILED.md) - Detailed execution plan
- [`docs/IMPLEMENTATION_SUMMARY.md`](./IMPLEMENTATION_SUMMARY.md) - Implementation summary

#### Program Files
- [`programs/agent-registry/src/instruction.rs`](../programs/agent-registry/src/instruction.rs) - Agent registry instructions
- [`programs/mcp-server-registry/src/instruction.rs`](../programs/mcp-server-registry/src/instruction.rs) - MCP server instructions
- [`programs/common/src/error.rs`](../programs/common/src/error.rs) - Common error definitions
- [`programs/svmai-token/src/lib.rs`](../programs/svmai-token/src/lib.rs) - SVMAI token program

#### IDL Files
- [`idl/agent_registry.json`](../idl/agent_registry.json) - Agent registry IDL
- [`idl/mcp_server_registry.json`](../idl/mcp_server_registry.json) - MCP server registry IDL

#### CI/CD Files
- [`.github/workflows/`](../.github/workflows/) - GitHub Actions workflows
- [`.github/workflows/rust-ci.yml`](../.github/workflows/rust-ci.yml) - Rust CI workflow
- [`.github/workflows/publish-rust-sdk.yml`](../.github/workflows/publish-rust-sdk.yml) - Rust SDK publish workflow

#### External References
- [Solana Web3.js Documentation](https://solana-labs.github.io/solana-web3.js/)
- [Anchor Framework Documentation](https://www.anchor-lang.com/docs/)
- [Jest Testing Framework](https://jestjs.io/)
- [TypeScript Handbook](https://www.typescriptlang.org/docs/)
- [JSDoc Guide](https://jsdoc.app/)

#### Notes on Missing Artifacts
The following artifacts are referenced in the SDK roadmap but do not yet exist in the repository:
- `schemas/payment-metadata.schema.json` - Should be created as part of common artifacts
- `fixtures/` directory with test fixtures - Should be created as part of common artifacts
- Agent registry error definitions - Currently only common errors exist in `programs/common/src/error.rs`

## Summary

These implementation guidelines provide a comprehensive roadmap for building the TypeScript SDK for Solana AI Registries. The guidelines emphasize:

1. **Atomic Implementation**: Each task is clearly defined with specific acceptance criteria
2. **Quality Assurance**: Comprehensive testing with >90% coverage requirement
3. **Documentation**: JSDoc comments and TypeDoc generation
4. **CI/CD Integration**: Automated testing and publishing workflows
5. **Code Quality**: ESLint, Prettier, and TypeScript strict mode
6. **Runtime Safety**: Proper error handling and type safety

Follow these guidelines to ensure a production-ready TypeScript SDK that meets all requirements and maintains consistency with the broader Solana AI Registries ecosystem.