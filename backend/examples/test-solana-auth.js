#!/usr/bin/env node

/**
 * Simple test script to validate the Solana authentication implementation
 * This tests the core utilities without external dependencies
 */

// Import our utilities
const {
  MockSolanaWallet,
  generateNonce,
  createAuthPayload,
  createSignatureMessage,
  createAuthHeaders
} = require('./solana-auth-example.js');

// Test utilities
function assert(condition, message) {
  if (!condition) {
    throw new Error(`Assertion failed: ${message}`);
  }
}

function testBasicFunctionality() {
  console.log('🧪 Testing basic functionality...');
  
  // Test nonce generation
  const nonce1 = generateNonce();
  const nonce2 = generateNonce();
  assert(nonce1 !== nonce2, 'Nonces should be unique');
  assert(nonce1.length > 0, 'Nonce should not be empty');
  console.log('  ✅ Nonce generation works');
  
  // Test payload creation
  const payload = createAuthPayload('/api/test');
  assert(payload.path === '/api/test', 'Path should be preserved');
  assert(typeof payload.ts === 'number', 'Timestamp should be a number');
  assert(payload.nonce.length > 0, 'Nonce should be included');
  console.log('  ✅ Payload creation works');
  
  // Test payload with data
  const payloadWithData = createAuthPayload('/api/test', { key: 'value' });
  assert(payloadWithData.data.key === 'value', 'Data should be preserved');
  console.log('  ✅ Payload with data works');
  
  // Test signature message creation
  const message = createSignatureMessage(payload);
  assert(typeof message === 'string', 'Message should be a string');
  assert(message.includes(payload.path), 'Message should include path');
  assert(message.includes(payload.nonce), 'Message should include nonce');
  console.log('  ✅ Signature message creation works');
  
  // Test deterministic message creation
  const message2 = createSignatureMessage(payload);
  assert(message === message2, 'Message should be deterministic');
  console.log('  ✅ Message creation is deterministic');
}

function testWalletOperations() {
  console.log('🧪 Testing wallet operations...');
  
  const wallet = new MockSolanaWallet();
  
  // Test public key
  const pubkey = wallet.getPublicKeyBase64();
  assert(pubkey.length > 0, 'Public key should not be empty');
  console.log('  ✅ Public key generation works');
  
  // Test signing
  const message = 'test message';
  const signature = wallet.signMessage(message);
  assert(signature.length === 64, 'Signature should be 64 bytes');
  console.log('  ✅ Message signing works');
  
  // Test signature consistency
  const signature2 = wallet.signMessage(message);
  assert(signature.toString('base64') === signature2.toString('base64'), 
         'Signatures should be consistent for same message');
  console.log('  ✅ Signature consistency works');
}

function testHeaderCreation() {
  console.log('🧪 Testing header creation...');
  
  const headers = createAuthHeaders('sig', 'pubkey', 1234567890, 'nonce123');
  
  assert(headers['x-solana-signature'] === 'sig', 'Signature header should be set');
  assert(headers['x-solana-pubkey'] === 'pubkey', 'Public key header should be set');
  assert(headers['x-solana-timestamp'] === '1234567890', 'Timestamp header should be set');
  assert(headers['x-solana-nonce'] === 'nonce123', 'Nonce header should be set');
  assert(headers['content-type'] === 'application/json', 'Content-type should be set');
  
  console.log('  ✅ Header creation works');
}

function testCompleteFlow() {
  console.log('🧪 Testing complete authentication flow...');
  
  const wallet = new MockSolanaWallet();
  
  // 1. Create payload
  const payload = createAuthPayload('/api/v1/protected/test', { action: 'test' });
  
  // 2. Create message
  const message = createSignatureMessage(payload);
  
  // 3. Sign message
  const signature = wallet.signMessage(message);
  
  // 4. Create headers
  const headers = createAuthHeaders(
    signature.toString('base64'),
    wallet.getPublicKeyBase64(),
    payload.ts,
    payload.nonce
  );
  
  // Verify all components are present
  assert(payload.path === '/api/v1/protected/test', 'Payload path correct');
  assert(payload.data.action === 'test', 'Payload data correct');
  assert(message.length > 0, 'Message generated');
  assert(signature.length === 64, 'Signature correct length');
  assert(headers['x-solana-signature'].length > 0, 'Headers contain signature');
  
  console.log('  ✅ Complete flow works');
  console.log(`  📝 Generated headers:`, Object.keys(headers).join(', '));
}

function testEdgeCases() {
  console.log('🧪 Testing edge cases...');
  
  // Empty payload data
  const emptyPayload = createAuthPayload('/api/test', {});
  assert(!emptyPayload.data, 'Empty data should not be included');
  console.log('  ✅ Empty data handling works');
  
  // Null payload data
  const nullPayload = createAuthPayload('/api/test', null);
  assert(!nullPayload.data, 'Null data should not be included');
  console.log('  ✅ Null data handling works');
  
  // Long path
  const longPath = '/api/' + 'a'.repeat(100);
  const longPathPayload = createAuthPayload(longPath);
  assert(longPathPayload.path === longPath, 'Long paths should be handled');
  console.log('  ✅ Long path handling works');
}

function runAllTests() {
  console.log('🚀 Running Solana Authentication Tests');
  console.log('=====================================\n');
  
  try {
    testBasicFunctionality();
    testWalletOperations();
    testHeaderCreation();
    testCompleteFlow();
    testEdgeCases();
    
    console.log('\n✅ All tests passed! The Solana authentication system is working correctly.');
    console.log('🎉 Ready for integration with your application.');
    
  } catch (error) {
    console.error('\n❌ Test failed:', error.message);
    console.error('Stack trace:', error.stack);
    process.exit(1);
  }
}

// Run tests if called directly
if (require.main === module) {
  runAllTests();
}

module.exports = {
  runAllTests,
  assert
};