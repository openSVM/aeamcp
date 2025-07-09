use anchor_lang::prelude::*;

#[error_code]
pub enum AccessControlError {
    #[msg("Signature verification failed")]
    InvalidSignature,
    
    #[msg("Timestamp is from the future")]
    TimestampFromFuture,
    
    #[msg("Signature has expired")]
    SignatureExpired,
    
    #[msg("Timestamp drift is too large")]
    TimestampDriftTooLarge,
    
    #[msg("Nonce has already been used")]
    NonceAlreadyUsed,
    
    #[msg("Nonce overflow detected")]
    NonceOverflow,
    
    #[msg("Delegation chain is too deep")]
    DelegationChainTooDeep,
    
    #[msg("Circular delegation detected")]
    CircularDelegationDetected,
    
    #[msg("Permission denied")]
    PermissionDenied,
    
    #[msg("Resource not found")]
    ResourceNotFound,
    
    #[msg("Invalid resource ID")]
    InvalidResourceId,
    
    #[msg("Invalid operation")]
    InvalidOperation,
    
    #[msg("Permission grant has expired")]
    PermissionExpired,
    
    #[msg("Maximum delegation depth reached")]
    MaxDelegationDepthReached,
    
    #[msg("Cannot delegate this permission")]
    CannotDelegate,
    
    #[msg("Invalid delegation chain")]
    InvalidDelegationChain,
    
    #[msg("Concurrent nonce update detected")]
    ConcurrentNonceUpdate,
    
    #[msg("Invalid nonce window")]
    InvalidNonceWindow,
    
    #[msg("Resource ID too long")]
    ResourceIdTooLong,
    
    #[msg("Operation name too long")]
    OperationTooLong,
    
    #[msg("Too many permissions")]
    TooManyPermissions,
    
    #[msg("Invalid permission format")]
    InvalidPermissionFormat,
    
    #[msg("Unauthorized access")]
    Unauthorized,
    
    #[msg("Account space calculation error")]
    AccountSpaceError,
    
    #[msg("CPI execution failed")]
    CpiExecutionFailed,
    
    #[msg("Invalid message format")]
    InvalidMessageFormat,
    
    #[msg("Message reconstruction failed")]
    MessageReconstructionFailed,
}

/// Security-related error codes for audit purposes
#[error_code]
pub enum SecurityError {
    #[msg("Replay attack detected")]
    ReplayAttack,
    
    #[msg("Invalid cryptographic signature")]
    InvalidCryptographicSignature,
    
    #[msg("Nonce window manipulation detected")]
    NonceWindowManipulation,
    
    #[msg("Delegation privilege escalation attempt")]
    DelegationPrivilegeEscalation,
    
    #[msg("Timing attack protection triggered")]
    TimingAttackProtection,
    
    #[msg("Rate limit exceeded")]
    RateLimitExceeded,
    
    #[msg("Suspicious activity detected")]
    SuspiciousActivity,
}