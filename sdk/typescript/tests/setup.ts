// Jest setup file
import { jest } from '@jest/globals';

// Mock Solana Web3.js
jest.mock('@solana/web3.js', () => ({
  Connection: jest.fn().mockImplementation(() => ({
    getLatestBlockhash: jest.fn().mockResolvedValue({ blockhash: 'mock-blockhash' }),
    sendTransaction: jest.fn().mockResolvedValue('mock-signature'),
    getSignatureStatus: jest.fn().mockResolvedValue({
      value: { slot: 123, confirmationStatus: 'confirmed' }
    }),
    getAccountInfo: jest.fn().mockResolvedValue(null),
    getMultipleAccountsInfo: jest.fn().mockResolvedValue([]),
    getSlot: jest.fn().mockResolvedValue(123),
    getVersion: jest.fn().mockResolvedValue({ 'solana-core': '1.18.0' }),
    getHealth: jest.fn().mockResolvedValue('ok'),
    getTransaction: jest.fn().mockResolvedValue(null),
    getFeeForMessage: jest.fn().mockResolvedValue({ value: 5000 }),
  })),
  PublicKey: jest.fn().mockImplementation((key) => ({
    toBase58: () => key || 'mock-pubkey',
    toBuffer: () => Buffer.from(key || 'mock-pubkey'),
    equals: jest.fn().mockReturnValue(false),
  })),
  Transaction: jest.fn().mockImplementation(() => ({
    add: jest.fn(),
    compileMessage: jest.fn().mockReturnValue({}),
  })),
  SystemProgram: {
    programId: 'mock-system-program',
  },
  clusterApiUrl: jest.fn().mockReturnValue('https://api.devnet.solana.com'),
}));

// Mock Anchor
jest.mock('@coral-xyz/anchor', () => ({
  AnchorProvider: jest.fn().mockImplementation(() => ({
    wallet: { publicKey: 'mock-wallet-pubkey' },
    connection: {},
    sendAndConfirm: jest.fn().mockResolvedValue('mock-signature'),
  })),
  Program: jest.fn().mockImplementation(() => ({
    programId: 'mock-program-id',
    account: {
      agentRegistryEntryV1: {
        fetch: jest.fn().mockResolvedValue({}),
        all: jest.fn().mockResolvedValue([]),
      },
      mcpServerRegistryEntryV1: {
        fetch: jest.fn().mockResolvedValue({}),
        all: jest.fn().mockResolvedValue([]),
      },
    },
    methods: {
      registerAgent: jest.fn().mockReturnValue({
        accounts: jest.fn().mockReturnValue({
          instruction: jest.fn().mockResolvedValue({}),
        }),
      }),
      updateAgent: jest.fn().mockReturnValue({
        accounts: jest.fn().mockReturnValue({
          instruction: jest.fn().mockResolvedValue({}),
        }),
      }),
      deregisterAgent: jest.fn().mockReturnValue({
        accounts: jest.fn().mockReturnValue({
          instruction: jest.fn().mockResolvedValue({}),
        }),
      }),
      registerServer: jest.fn().mockReturnValue({
        accounts: jest.fn().mockReturnValue({
          instruction: jest.fn().mockResolvedValue({}),
        }),
      }),
      updateServer: jest.fn().mockReturnValue({
        accounts: jest.fn().mockReturnValue({
          instruction: jest.fn().mockResolvedValue({}),
        }),
      }),
      deregisterServer: jest.fn().mockReturnValue({
        accounts: jest.fn().mockReturnValue({
          instruction: jest.fn().mockResolvedValue({}),
        }),
      }),
    },
  })),
  Wallet: jest.fn(),
}));

// Mock SPL Token
jest.mock('@solana/spl-token', () => ({
  TOKEN_PROGRAM_ID: 'mock-token-program-id',
  getAssociatedTokenAddress: jest.fn().mockResolvedValue('mock-token-account'),
  createTransferInstruction: jest.fn().mockReturnValue({}),
  createAssociatedTokenAccountInstruction: jest.fn().mockReturnValue({}),
}));

// Mock file system for IDL loading
jest.mock('fs', () => ({
  readFileSync: jest.fn().mockReturnValue(JSON.stringify({
    version: '0.1.0',
    name: 'mock_program',
    instructions: [],
    accounts: [],
    types: [],
  })),
}));

// Set up global test timeout
jest.setTimeout(30000);