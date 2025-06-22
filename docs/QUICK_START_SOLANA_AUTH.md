# Solana Wallet Authentication - Quick Start Guide

This quick start guide will help you integrate Solana wallet signature-based authentication into your AEAMCP application.

## Overview

The AEAMCP protocol now supports decentralized, stateless authentication using Solana wallet signatures. This enables:

- ✅ **No cookies or sessions** - completely stateless
- ✅ **On-chain access control** - permissions stored on Solana blockchain  
- ✅ **Wallet-based identity** - users authenticate with their existing Solana wallets
- ✅ **Replay protection** - prevents signature reuse attacks
- ✅ **Transferable access** - supports lending/borrowing access rights

## Files Added

### Backend Implementation
- `backend/src/types/solana-auth.types.ts` - TypeScript definitions
- `backend/src/services/solana-auth.service.ts` - Core authentication service
- `backend/src/middleware/solana-auth.middleware.ts` - Express middleware
- `backend/src/utils/solana-auth.utils.ts` - Utility functions
- `backend/examples/solana-auth-example.js` - Working demo (✅ tested)
- `backend/examples/test-solana-auth.js` - Test suite (✅ all tests pass)

### Documentation
- `docs/SOLANA_WALLET_AUTHENTICATION.md` - Complete implementation guide
- `backend/.env.example` - Updated with Solana configuration

## Quick Integration

### 1. Install Dependencies

```bash
cd backend
npm install @solana/web3.js tweetnacl
```

### 2. Environment Configuration

Copy `.env.example` to `.env` and configure:

```bash
# Solana Authentication
SOLANA_RPC_ENDPOINT=https://api.devnet.solana.com
SOLANA_REGISTRY_PROGRAM_ID=2CyuaQMyxJNg637bYSR1ZhwfDFd3ssCvTJHMBTbCH8D4
SOLANA_ENABLE_SIGNATURE_VERIFICATION=true
```

### 3. Backend Integration

The middleware is already integrated in `src/app.ts`:

```typescript
// Optional Solana auth on existing routes
app.use('/api/v1/git', optionalSolanaAuth(solanaAuth));

// Protected routes requiring Solana auth  
app.use('/api/v1/protected', createSolanaAuthMiddleware(solanaAuth));
```

### 4. Frontend Integration

```javascript
// 1. Create payload
const payload = {
  path: '/api/v1/protected/profile',
  ts: Math.floor(Date.now() / 1000),
  nonce: generateNonce()
};

// 2. Sign with wallet
const message = JSON.stringify(payload, Object.keys(payload).sort());
const signature = await wallet.signMessage(new TextEncoder().encode(message));

// 3. Make request
const response = await fetch('/api/v1/protected/profile', {
  headers: {
    'x-solana-signature': Buffer.from(signature).toString('base64'),
    'x-solana-pubkey': Buffer.from(wallet.publicKey.toBytes()).toString('base64'),
    'x-solana-timestamp': payload.ts.toString(),
    'x-solana-nonce': payload.nonce
  }
});
```

## Testing

### Run the Demo

```bash
cd backend
node examples/solana-auth-example.js
```

### Run Tests  

```bash
cd backend
node examples/test-solana-auth.js
```

Both should work immediately without additional dependencies!

## API Endpoints

### Existing Endpoints (Enhanced)
- `GET /api/v1/git/*` - Now supports optional Solana authentication
- `POST /api/v1/git/*` - Enhanced with wallet-based permissions

### New Protected Endpoints
- `GET /api/v1/protected/profile` - Requires Solana wallet authentication
- `GET /api/v1` - Shows authentication capabilities

## Error Handling

The system returns structured errors:

```json
{
  "error": "Signature timestamp is too old",
  "code": "SIGNATURE_EXPIRED",
  "details": { "maxAge": 300, "actualAge": 350 }
}
```

Common error codes:
- `MISSING_HEADERS` - Required auth headers missing
- `INVALID_SIGNATURE` - Signature verification failed  
- `SIGNATURE_EXPIRED` - Signature too old
- `REPLAY_ATTACK` - Nonce already used
- `ACCESS_DENIED` - No on-chain access permission

## On-Chain Access Control

Access permissions are stored as PDAs:

```rust
// PDA derivation
seeds = [
  b"access_control_v1",
  wallet_pubkey.as_ref(),
  resource_path.as_bytes()
]
```

If the PDA account exists, access is granted.

## Security Features

### Replay Protection
- Each nonce can only be used once per wallet
- Signatures expire after configurable time (default: 5 minutes)
- Nonces cached with TTL to prevent reuse

### Signature Verification
- Uses Ed25519 cryptographic verification
- Verifies signature matches payload and public key
- Can be disabled for development/testing

### Access Control Caching
- On-chain permission checks are cached (default: 1 minute)
- Reduces RPC calls while maintaining security
- Cache invalidation when permissions change

## Next Steps

1. **Deploy Access Control Program** - Create and deploy your Solana program for managing permissions
2. **Frontend Integration** - Add wallet connection and signature creation to your UI
3. **Permission Management** - Build admin interface for granting/revoking access
4. **Monitoring** - Set up logging and monitoring for authentication events
5. **Testing** - Create comprehensive test suite for your specific use cases

## Support

- 📖 Full documentation: `docs/SOLANA_WALLET_AUTHENTICATION.md`
- 💻 Working examples: `backend/examples/`
- 🧪 Test suite: `backend/examples/test-solana-auth.js`
- 🔧 Configuration: `backend/.env.example`

## Deployment Checklist

For production deployment:

- [ ] Set `NODE_ENV=production`
- [ ] Use mainnet Solana RPC endpoint  
- [ ] Deploy access control program to mainnet
- [ ] Set `SOLANA_ENABLE_SIGNATURE_VERIFICATION=true`
- [ ] Configure secure database and Redis
- [ ] Set up proper CORS origins
- [ ] Enable HTTPS
- [ ] Set up monitoring and logging
- [ ] Test thoroughly with real wallets

---

**Ready to go!** 🚀 The authentication system is fully implemented and tested.