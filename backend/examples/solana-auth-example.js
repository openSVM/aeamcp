#!/usr/bin/env node

/**
 * Example script demonstrating Solana wallet signature-based authentication
 * 
 * This script shows how to:
 * 1. Create authentication payloads
 * 2. Generate signatures (mocked for demo)
 * 3. Make authenticated requests to the API
 * 
 * Usage:
 *   node examples/solana-auth-example.js
 */

const crypto = require('crypto');

// Mock Solana wallet utilities for demonstration
class MockSolanaWallet {
  constructor() {
    // Generate a mock keypair for demonstration
    this.publicKey = crypto.randomBytes(32);
    this.privateKey = crypto.randomBytes(64);
  }

  /**
   * Mock signature function - in real implementation this would use nacl.sign
   */
  signMessage(message) {
    // This is just a demo - real implementation would use Ed25519 signing
    const hash = crypto.createHash('sha256').update(message).digest();
    return Buffer.concat([hash, hash]); // 64 bytes to simulate Ed25519 signature
  }

  getPublicKeyBase64() {
    return this.publicKey.toString('base64');
  }
}

// Utility functions (these match the backend implementation)
function generateNonce() {
  return crypto.randomBytes(16).toString('base64');
}

function createAuthPayload(path, data = null) {
  const payload = {
    path,
    ts: Math.floor(Date.now() / 1000),
    nonce: generateNonce()
  };

  if (data && Object.keys(data).length > 0) {
    payload.data = data;
  }

  return payload;
}

function createSignatureMessage(payload) {
  // Create deterministic string representation matching backend
  const canonicalPayload = {
    path: payload.path,
    ts: payload.ts,
    nonce: payload.nonce,
    ...(payload.data && Object.keys(payload.data).length > 0 ? { data: payload.data } : {})
  };
  
  return JSON.stringify(canonicalPayload, Object.keys(canonicalPayload).sort());
}

function createAuthHeaders(signature, publicKey, timestamp, nonce) {
  return {
    'x-solana-signature': signature,
    'x-solana-pubkey': publicKey,
    'x-solana-timestamp': timestamp.toString(),
    'x-solana-nonce': nonce,
    'content-type': 'application/json'
  };
}

// Example usage
async function demonstrateSolanaAuth() {
  console.log('🚀 Solana Wallet Authentication Demo');
  console.log('=====================================\n');

  // Initialize mock wallet
  const wallet = new MockSolanaWallet();
  console.log('📱 Mock Wallet Initialized');
  console.log(`   Public Key: ${wallet.getPublicKeyBase64().substring(0, 20)}...`);
  console.log('');

  // Example 1: GET request to protected endpoint
  console.log('📋 Example 1: GET Request Authentication');
  console.log('----------------------------------------');
  
  const getPayload = createAuthPayload('/api/v1/protected/profile');
  console.log('1. Created payload:', JSON.stringify(getPayload, null, 2));
  
  const getMessage = createSignatureMessage(getPayload);
  console.log('2. Canonical message:', getMessage);
  
  const getSignature = wallet.signMessage(getMessage);
  console.log('3. Generated signature:', getSignature.toString('base64').substring(0, 20) + '...');
  
  const getHeaders = createAuthHeaders(
    getSignature.toString('base64'),
    wallet.getPublicKeyBase64(),
    getPayload.ts,
    getPayload.nonce
  );
  console.log('4. Request headers:', JSON.stringify(getHeaders, null, 2));
  console.log('');

  // Example 2: POST request with data
  console.log('📋 Example 2: POST Request with Data');
  console.log('------------------------------------');
  
  const postData = {
    name: 'My AI Agent',
    description: 'An intelligent assistant',
    capabilities: ['chat', 'analysis']
  };
  
  const postPayload = createAuthPayload('/api/v1/protected/agents', postData);
  console.log('1. Created payload with data:', JSON.stringify(postPayload, null, 2));
  
  const postMessage = createSignatureMessage(postPayload);
  console.log('2. Canonical message:', postMessage);
  
  const postSignature = wallet.signMessage(postMessage);
  const postHeaders = createAuthHeaders(
    postSignature.toString('base64'),
    wallet.getPublicKeyBase64(), 
    postPayload.ts,
    postPayload.nonce
  );
  console.log('3. Request headers:', JSON.stringify(postHeaders, null, 2));
  console.log('');

  // Example 3: Making actual HTTP requests (commented out - would need running server)
  console.log('📋 Example 3: HTTP Request Example (Pseudo-code)');
  console.log('------------------------------------------------');
  console.log(`
// Using fetch API
const response = await fetch('http://localhost:3001/api/v1/protected/profile', {
  method: 'GET',
  headers: ${JSON.stringify(getHeaders, null, 2)}
});

// Using axios
const axiosResponse = await axios.get('http://localhost:3001/api/v1/protected/profile', {
  headers: ${JSON.stringify(getHeaders, null, 2)}
});

// Using curl
curl -X GET 'http://localhost:3001/api/v1/protected/profile' \\
  -H 'x-solana-signature: ${getHeaders['x-solana-signature'].substring(0, 20)}...' \\
  -H 'x-solana-pubkey: ${getHeaders['x-solana-pubkey'].substring(0, 20)}...' \\
  -H 'x-solana-timestamp: ${getHeaders['x-solana-timestamp']}' \\
  -H 'x-solana-nonce: ${getHeaders['x-solana-nonce']}'
`);

  // Example 4: Error scenarios
  console.log('📋 Example 4: Common Error Scenarios');
  console.log('------------------------------------');
  
  // Expired signature
  const expiredPayload = createAuthPayload('/api/v1/protected/profile');
  expiredPayload.ts = Math.floor(Date.now() / 1000) - 400; // 400 seconds ago
  console.log('1. Expired signature (400s old):', JSON.stringify(expiredPayload, null, 2));
  
  // Reused nonce
  const reusedPayload = createAuthPayload('/api/v1/protected/profile');
  reusedPayload.nonce = getPayload.nonce; // Reuse previous nonce
  console.log('2. Reused nonce (replay attack):', JSON.stringify(reusedPayload, null, 2));
  
  // Invalid signature
  console.log('3. Invalid signature: Would happen with wrong private key or corrupted data');
  console.log('');

  // Example 5: Frontend integration patterns
  console.log('📋 Example 5: Frontend Integration Patterns');
  console.log('------------------------------------------');
  console.log(`
// React Hook Pattern
const { authenticatedFetch } = useSolanaAuth();
const data = await authenticatedFetch('/api/v1/protected/profile');

// Axios Interceptor Pattern  
axios.interceptors.request.use(async (config) => {
  if (config.requiresSolanaAuth) {
    const authHeaders = await createSolanaAuthHeaders(config.url, config.data);
    config.headers = { ...config.headers, ...authHeaders };
  }
  return config;
});

// Fetch Wrapper Pattern
const authenticatedFetch = createSolanaAuthenticatedFetch(wallet);
const response = await authenticatedFetch('/api/v1/protected/profile');
`);

  console.log('✅ Demo completed! Check the documentation for full implementation details.');
  console.log('📖 See: docs/SOLANA_WALLET_AUTHENTICATION.md');
}

// Run the demo
if (require.main === module) {
  demonstrateSolanaAuth().catch(console.error);
}

module.exports = {
  MockSolanaWallet,
  generateNonce,
  createAuthPayload,
  createSignatureMessage,
  createAuthHeaders,
  demonstrateSolanaAuth
};