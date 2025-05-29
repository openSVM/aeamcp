# Cross-Chain Bridge Architecture Specification

## Executive Summary

This document specifies the architecture for bridging SVMAI tokens from Solana to Ethereum, Polygon, BSC, and Arbitrum. The bridge design prioritizes security, decentralization, and user experience while maintaining the token's utility across all supported chains.

## 1. Architecture Overview

### 1.1 Bridge Components

```
┌────────────────────────────────────────────────────────────────────────┐
│                     SVMAI Cross-Chain Bridge Architecture               │
├────────────────────────────────────────────────────────────────────────┤
│                                                                         │
│  Solana (Native Chain)                    EVM Chains                   │
│  ┌─────────────────┐                     ┌─────────────────┐         │
│  │  SVMAI Token    │                     │  Wrapped SVMAI  │         │
│  │  (SPL Token)    │                     │  (ERC20 Token)  │         │
│  └────────┬────────┘                     └────────┬────────┘         │
│           │                                        │                   │
│  ┌────────▼────────┐                     ┌────────▼────────┐         │
│  │ Bridge Program  │◄────────────────────►│ Bridge Contract │         │
│  │  - Lock tokens  │                     │  - Mint/Burn    │         │
│  │  - Verify sigs  │                     │  - Verify sigs  │         │
│  └────────┬────────┘                     └────────┬────────┘         │
│           │                                        │                   │
│           └────────────┬──────────┬───────────────┘                   │
│                        │          │                                    │
│                   ┌────▼──────────▼────┐                              │
│                   │  Validator Network  │                              │
│                   │  - 9 Validators     │                              │
│                   │  - 5/9 Consensus    │                              │
│                   │  - Stake Required   │                              │
│                   └────────────────────┘                              │
│                                                                         │
└────────────────────────────────────────────────────────────────────────┘
```

### 1.2 Supported Chains

| Chain | Network ID | Contract Standard | Block Time | Finality |
|-------|------------|-------------------|------------|----------|
| Solana | Mainnet | SPL Token | ~400ms | ~2.5s |
| Ethereum | 1 | ERC20 | ~12s | ~15 min |
| Polygon | 137 | ERC20 | ~2s | ~256 blocks |
| BSC | 56 | BEP20 | ~3s | ~15 blocks |
| Arbitrum | 42161 | ERC20 | ~250ms | ~7 days* |

*Arbitrum has optimistic rollup finality

## 2. Solana Bridge Program

### 2.1 Program Structure

```rust
// programs/bridge/src/state.rs
#[derive(BorshSerialize, BorshDeserialize)]
pub struct BridgeState {
    pub authority: Pubkey,
    pub token_mint: Pubkey,
    pub total_locked: u64,
    pub total_bridged_out: u64,
    pub total_bridged_in: u64,
    pub validators: Vec<Validator>,
    pub nonce: u64,
    pub paused: bool,
    pub daily_limit: u64,
    pub daily_volume: u64,
    pub last_reset: i64,
}

#[derive(BorshSerialize, BorshDeserialize)]
pub struct Validator {
    pub address: Pubkey,
    pub eth_address: [u8; 20],
    pub stake: u64,
    pub active: bool,
    pub missed_attestations: u16,
}

#[derive(BorshSerialize, BorshDeserialize)]
pub struct BridgeRequest {
    pub request_id: [u8; 32],
    pub sender: Pubkey,
    pub recipient: [u8; 20], // EVM address
    pub amount: u64,
    pub target_chain: u16,
    pub timestamp: i64,
    pub signatures: Vec<ValidatorSignature>,
    pub status: RequestStatus,
}

#[derive(BorshSerialize, BorshDeserialize)]
pub enum RequestStatus {
    Pending,
    Signed,
    Completed,
    Expired,
}
```

### 2.2 Bridge Instructions

```rust
pub enum BridgeInstruction {
    /// Initialize bridge with validators
    Initialize {
        validators: Vec<Validator>,
        daily_limit: u64,
    },
    
    /// Lock tokens to bridge to EVM chain
    LockTokens {
        amount: u64,
        recipient: [u8; 20],
        target_chain: u16,
    },
    
    /// Release tokens from EVM chain
    ReleaseTokens {
        request_id: [u8; 32],
        amount: u64,
        recipient: Pubkey,
        signatures: Vec<ValidatorSignature>,
    },
    
    /// Update validator set (governance)
    UpdateValidators {
        add: Vec<Validator>,
        remove: Vec<Pubkey>,
    },
    
    /// Emergency pause (multisig)
    EmergencyPause,
    
    /// Resume operations (governance)
    Resume,
}
```

## 3. EVM Bridge Contracts

### 3.1 Core Contract Interface

```solidity
// SPDX-License-Identifier: MIT
pragma solidity ^0.8.19;

interface ISVMAIBridge {
    event TokensLocked(
        bytes32 indexed requestId,
        address indexed sender,
        bytes32 recipient, // Solana address
        uint256 amount,
        uint256 timestamp
    );
    
    event TokensMinted(
        bytes32 indexed requestId,
        address indexed recipient,
        uint256 amount,
        uint256 timestamp
    );
    
    function lockTokens(
        bytes32 recipient,
        uint256 amount
    ) external;
    
    function mintTokens(
        bytes32 requestId,
        address recipient,
        uint256 amount,
        bytes[] calldata signatures
    ) external;
    
    function pause() external;
    function unpause() external;
    function updateValidators(
        address[] calldata add,
        address[] calldata remove
    ) external;
}
```

### 3.2 Wrapped Token Contract

```solidity
contract WrappedSVMAI is ERC20, AccessControl {
    bytes32 public constant MINTER_ROLE = keccak256("MINTER_ROLE");
    bytes32 public constant BRIDGE_ROLE = keccak256("BRIDGE_ROLE");
    
    constructor() ERC20("Wrapped SVMAI", "wSVMAI") {
        _setupRole(DEFAULT_ADMIN_ROLE, msg.sender);
    }
    
    function mint(address to, uint256 amount) external onlyRole(BRIDGE_ROLE) {
        _mint(to, amount);
    }
    
    function burn(address from, uint256 amount) external onlyRole(BRIDGE_ROLE) {
        _burn(from, amount);
## 4. Validator Network

### 4.1 Validator Requirements

| Requirement | Specification |
|-------------|--------------|
| Minimum Stake | 100,000 SVMAI |
| Infrastructure | 99.9% uptime SLA |
| Response Time | < 5 seconds |
| Key Management | HSM required |
| Monitoring | 24/7 alerting |

### 4.2 Validator Responsibilities

1. **Transaction Monitoring**
   - Watch Solana lock events
   - Watch EVM burn events
   - Validate transaction finality

2. **Signature Generation**
   - Sign valid bridge requests
   - Maintain signature threshold
   - Participate in key ceremonies

3. **Security Monitoring**
   - Detect anomalous patterns
   - Report suspicious activity
   - Participate in incident response

### 4.3 Consensus Mechanism

```
┌─────────────────────────────────────────────────────────┐
│                  Validator Consensus Flow                │
├─────────────────────────────────────────────────────────┤
│                                                          │
│  1. Event Detection                                      │
│     └─► Validators monitor blockchain events             │
│                                                          │
│  2. Validation                                           │
│     ├─► Verify transaction finality                     │
│     ├─► Check amount and recipient                      │
│     └─► Validate against daily limits                   │
│                                                          │
│  3. Signature Collection                                 │
│     ├─► Each validator signs if valid                   │
│     └─► Broadcast signature to peers                    │
│                                                          │
│  4. Threshold Achievement                                │
│     ├─► Collect 5/9 signatures                          │
│     └─► Submit to destination chain                     │
│                                                          │
│  5. Execution                                            │
│     └─► Bridge contract executes with signatures        │
│                                                          │
└─────────────────────────────────────────────────────────┘
```

## 5. Security Architecture

### 5.1 Multi-Layer Security

```
┌─────────────────────────────────────────────────────────┐
│                   Security Layers                        │
├─────────────────────────────────────────────────────────┤
│                                                          │
│  Layer 1: Transaction Validation                         │
│  ├─► Amount limits (daily/per-tx)                       │
│  ├─► Address whitelist (optional)                       │
│  └─► Finality confirmation                              │
│                                                          │
│  Layer 2: Validator Security                             │
│  ├─► Multi-signature requirement (5/9)                  │
│  ├─► Stake slashing for misbehavior                     │
│  └─► Key rotation schedule                              │
│                                                          │
│  Layer 3: Smart Contract Security                        │
│  ├─► Reentrancy guards                                  │
│  ├─► Access control (roles)                             │
│  └─► Emergency pause mechanism                          │
│                                                          │
│  Layer 4: Operational Security                           │
│  ├─► Rate limiting                                      │
│  ├─► Anomaly detection                                  │
│  └─► Incident response plan                             │
│                                                          │
└─────────────────────────────────────────────────────────┘
```

### 5.2 Rate Limiting

| Limit Type | Value | Enforcement |
|------------|-------|-------------|
| Daily Volume | 10% of supply | Smart contract |
| Per Transaction | 1% of supply | Smart contract |
| Per User Daily | 0.1% of supply | Smart contract |
| Cool-down Period | 1 hour | After large tx |

### 5.3 Emergency Procedures

1. **Circuit Breaker**
   - Automatic pause on anomaly detection
   - Manual pause by 3/9 validators
   - Governance unpause after review

2. **Key Compromise**
   - Immediate validator removal
   - Emergency key rotation
   - Fund recovery procedures

3. **Chain Reorganization**
   - Extended finality requirements
   - Manual review for large amounts
   - Rollback procedures if needed

## 6. Bridge Operations

### 6.1 Solana to EVM Flow

```
User Journey: Bridging SVMAI from Solana to Ethereum

1. User connects Solana wallet
2. Enters amount and Ethereum address
3. Reviews fees and estimated time
4. Approves transaction

Backend Process:
1. Lock tokens in Solana vault
2. Emit LockTokens event
3. Validators detect and validate
4. 5/9 validators sign attestation
5. Submit signatures to Ethereum
6. Mint wrapped tokens to user
```

### 6.2 EVM to Solana Flow

```
User Journey: Bridging wSVMAI from Ethereum to Solana

1. User connects Ethereum wallet
2. Enters amount and Solana address
3. Reviews fees and estimated time
4. Approves and burns tokens

Backend Process:
1. Burn wrapped tokens on Ethereum
2. Emit BurnTokens event
3. Validators detect and validate
4. 5/9 validators sign attestation
5. Submit signatures to Solana
6. Release native tokens to user
```

### 6.3 Fee Structure

| Operation | Fee | Recipient |
|-----------|-----|-----------|
| Bridge Out (Solana→EVM) | 0.1% | Validators |
| Bridge In (EVM→Solana) | 0.1% | Validators |
| Minimum Fee | 10 SVMAI | Prevents dust |
| Rush Fee | +0.2% | Priority queue |

## 7. Technical Implementation Details

### 7.1 Solana Program Implementation

```rust
// Key security checks for lock_tokens
pub fn process_lock_tokens(
    program_id: &Pubkey,
    accounts: &[AccountInfo],
    amount: u64,
    recipient: [u8; 20],
    target_chain: u16,
) -> ProgramResult {
    // Validate accounts
    let account_info_iter = &mut accounts.iter();
    let user = next_account_info(account_info_iter)?;
    let user_token = next_account_info(account_info_iter)?;
    let vault = next_account_info(account_info_iter)?;
    let bridge_state = next_account_info(account_info_iter)?;
    
    // Security checks
    if !user.is_signer {
        return Err(ProgramError::MissingRequiredSignature);
    }
    
    // Load and validate bridge state
    let mut state = BridgeState::unpack(&bridge_state.data.borrow())?;
    if state.paused {
        return Err(BridgeError::BridgePaused.into());
    }
    
    // Check daily limits
    let clock = Clock::get()?;
    if clock.unix_timestamp > state.last_reset + 86400 {
        state.daily_volume = 0;
        state.last_reset = clock.unix_timestamp;
    }
    
    if state.daily_volume + amount > state.daily_limit {
        return Err(BridgeError::DailyLimitExceeded.into());
    }
    
    // Check per-transaction limit
    let max_per_tx = state.daily_limit / 10; // 10% of daily
    if amount > max_per_tx {
        return Err(BridgeError::AmountTooLarge.into());
    }
    
    // Transfer tokens to vault
    invoke(
        &spl_token::instruction::transfer(
            &spl_token::id(),
            user_token.key,
            vault.key,
            user.key,
            &[],
            amount,
        )?,
        &[user_token.clone(), vault.clone(), user.clone()],
    )?;
    
    // Update state
    state.total_locked += amount;
    state.total_bridged_out += amount;
    state.daily_volume += amount;
    state.nonce += 1;
    
    // Generate request ID
    let request_id = generate_request_id(
        user.key,
        amount,
        recipient,
        target_chain,
        state.nonce,
    );
    
    // Emit event
    emit!(BridgeEvent::TokensLocked {
        request_id,
        sender: *user.key,
        recipient,
        amount,
        target_chain,
        timestamp: clock.unix_timestamp,
    });
    
    // Save state
    BridgeState::pack(state, &mut bridge_state.data.borrow_mut())?;
    
    Ok(())
}
```

### 7.2 EVM Contract Implementation

```solidity
contract SVMAIBridge is ISVMAIBridge, AccessControl, Pausable {
    using ECDSA for bytes32;
    
    bytes32 public constant VALIDATOR_ROLE = keccak256("VALIDATOR_ROLE");
    bytes32 public constant ADMIN_ROLE = keccak256("ADMIN_ROLE");
    
    WrappedSVMAI public immutable token;
    
    mapping(bytes32 => bool) public processedRequests;
    mapping(address => uint256) public dailyVolume;
    mapping(address => uint256) public lastActivity;
    
    uint256 public constant DAILY_LIMIT = 100_000_000 * 10**6; // 100M tokens
    uint256 public constant MAX_PER_TX = 10_000_000 * 10**6; // 10M tokens
    uint256 public constant SIGNATURE_THRESHOLD = 5;
    
    constructor(address _token) {
        token = WrappedSVMAI(_token);
        _setupRole(DEFAULT_ADMIN_ROLE, msg.sender);
        _setupRole(ADMIN_ROLE, msg.sender);
    }
    
    function mintTokens(
        bytes32 requestId,
        address recipient,
        uint256 amount,
        bytes[] calldata signatures
    ) external whenNotPaused {
        // Prevent replay
        require(!processedRequests[requestId], "Already processed");
        processedRequests[requestId] = true;
        
        // Validate amount
        require(amount <= MAX_PER_TX, "Amount too large");
        
        // Check daily limit for recipient
        if (block.timestamp > lastActivity[recipient] + 1 days) {
            dailyVolume[recipient] = 0;
            lastActivity[recipient] = block.timestamp;
        }
        require(
            dailyVolume[recipient] + amount <= DAILY_LIMIT / 10,
            "Daily limit exceeded"
        );
        
        // Verify signatures
        bytes32 messageHash = keccak256(
            abi.encodePacked(requestId, recipient, amount)
        );
        bytes32 ethSignedHash = messageHash.toEthSignedMessageHash();
        
        uint256 validSignatures = 0;
        address[] memory signers = new address[](signatures.length);
        
        for (uint256 i = 0; i < signatures.length; i++) {
            address signer = ethSignedHash.recover(signatures[i]);
            
            // Check if valid validator and not duplicate
            if (hasRole(VALIDATOR_ROLE, signer)) {
                bool isDuplicate = false;
                for (uint256 j = 0; j < i; j++) {
                    if (signers[j] == signer) {
                        isDuplicate = true;
                        break;
                    }
                }
                
                if (!isDuplicate) {
                    signers[i] = signer;
                    validSignatures++;
                }
            }
        }
        
        require(
            validSignatures >= SIGNATURE_THRESHOLD,
            "Insufficient signatures"
        );
        
        // Update volume tracking
        dailyVolume[recipient] += amount;
        
        // Mint tokens
        token.mint(recipient, amount);
        
        emit TokensMinted(requestId, recipient, amount, block.timestamp);
    }
}
```

## 8. Monitoring and Analytics

### 8.1 Key Metrics

| Metric | Target | Alert Threshold |
|--------|--------|-----------------|
| Bridge Volume (24h) | < 10% supply | > 8% supply |
| Validator Response Time | < 5s | > 10s |
| Failed Transactions | < 0.1% | > 1% |
| Validator Uptime | > 99.9% | < 99.5% |

### 8.2 Dashboard Requirements

Real-time monitoring dashboard showing:
- Total locked value per chain
- Active bridge requests
- Validator status and performance
- Historical volume charts
- Fee revenue distribution

## 9. Deployment Plan

### 9.1 Testnet Phase (Month 1-2)

1. Deploy contracts on testnets
2. Recruit validator operators
3. Conduct security testing
4. Run incentivized testnet

### 9.2 Mainnet Beta (Month 3-4)

1. Deploy with conservative limits
2. Gradual limit increases
3. Monitor for issues
4. Bug bounty program

### 9.3 Full Production (Month 5+)

1. Remove beta restrictions
2. Add additional chains
3. Implement governance
4. Decentralize validators

## 10. Risk Mitigation

### 10.1 Technical Risks

| Risk | Mitigation |
|------|------------|
| Smart contract bugs | Multiple audits, formal verification |
| Validator collusion | Economic incentives, reputation system |
| Chain reorganization | Extended finality requirements |
| Key compromise | HSM usage, key rotation |

### 10.2 Economic Risks

| Risk | Mitigation |
|------|------------|
| Liquidity fragmentation | Incentivized liquidity pools |
| Fee manipulation | Governance oversight |
| Token price volatility | Stable fee options |

## Conclusion

This cross-chain bridge architecture provides a secure, decentralized solution for SVMAI token interoperability across major blockchain networks. The multi-layer security approach, combined with careful validator selection and economic incentives, ensures the bridge can operate safely while maintaining user trust and token utility across all supported chains.
    }
    
    function decimals() public pure override returns (uint8) {
        return 6; // Match Solana token decimals
    }
}
