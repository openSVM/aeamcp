//! Error types for the Solana AI Registries SDK
//!
//! This module provides error types that mirror the on-chain program error codes
//! and additional SDK-specific error handling.

use solana_client::client_error::ClientError;
use solana_sdk::program_error::ProgramError;
use thiserror::Error;

/// Result type alias for SDK operations
pub type SdkResult<T> = Result<T, SdkError>;

/// Main error type for the SDK
#[derive(Error, Debug)]
pub enum SdkError {
    // Client and network errors
    #[error("Solana client error: {0}")]
    ClientError(#[from] ClientError),

    #[error("Program error: {0}")]
    ProgramError(#[from] ProgramError),

    #[error("Network error: {0}")]
    NetworkError(String),

    #[error("RPC error: {0}")]
    RpcError(String),

    // Serialization errors
    #[error("Serialization error: {0}")]
    SerializationError(String),

    #[error("Deserialization error: {0}")]
    DeserializationError(String),

    // Registry-specific errors (mirroring on-chain errors)
    #[error("Agent ID length is invalid (empty or exceeds max)")]
    InvalidAgentIdLength,

    #[error("Name length is invalid (empty or exceeds max)")]
    InvalidNameLength,

    #[error("Description length exceeds max")]
    InvalidDescriptionLength,

    #[error("Version length exceeds max")]
    InvalidVersionLength,

    #[error("Provider name length exceeds max")]
    InvalidProviderNameLength,

    #[error("Provider URL length exceeds max")]
    InvalidProviderUrlLength,

    #[error("Documentation URL length exceeds max")]
    InvalidDocumentationUrlLength,

    #[error("Too many service endpoints provided")]
    TooManyServiceEndpoints,

    #[error("Service endpoint protocol length is invalid")]
    InvalidEndpointProtocolLength,

    #[error("Service endpoint URL length is invalid")]
    InvalidEndpointUrlLength,

    #[error("Too many supported input modes")]
    TooManySupportedInputModes,

    #[error("Input mode length is invalid")]
    InvalidInputModeLength,

    #[error("Too many supported output modes")]
    TooManySupportedOutputModes,

    #[error("Output mode length is invalid")]
    InvalidOutputModeLength,

    #[error("Too many skills provided")]
    TooManySkills,

    #[error("Skill ID length is invalid")]
    InvalidSkillIdLength,

    #[error("Skill name length is invalid")]
    InvalidSkillNameLength,

    #[error("Too many skill tags")]
    TooManySkillTags,

    #[error("Skill tag length is invalid")]
    InvalidSkillTagLength,

    #[error("Security info URI length exceeds max")]
    InvalidSecurityInfoUriLength,

    #[error("AEA address length is invalid")]
    InvalidAeaAddressLength,

    #[error("Economic intent summary length exceeds max")]
    InvalidEconomicIntentSummaryLength,

    #[error("Extended metadata URI length exceeds max")]
    InvalidExtendedMetadataUriLength,

    #[error("Too many tags provided")]
    TooManyTags,

    #[error("Tag length is invalid")]
    InvalidTagLength,

    #[error("Multiple default service endpoints specified")]
    MultipleDefaultEndpoints,

    #[error("No default service endpoint specified")]
    NoDefaultEndpoint,

    #[error("Invalid URL format")]
    InvalidUrlFormat,

    #[error("Invalid agent status")]
    InvalidAgentStatus,

    // MCP Server specific errors
    #[error("Server ID length is invalid")]
    InvalidServerIdLength,

    #[error("Server name length is invalid")]
    InvalidServerNameLength,

    #[error("Server version length exceeds max")]
    InvalidServerVersionLength,

    #[error("Service endpoint URL length exceeds max")]
    InvalidServiceEndpointUrlLength,

    #[error("Server capabilities summary length exceeds max")]
    InvalidServerCapabilitiesSummaryLength,

    #[error("Too many on-chain tool definitions")]
    TooManyOnChainToolDefinitions,

    #[error("Tool name length is invalid")]
    InvalidToolNameLength,

    #[error("Too many tool tags")]
    TooManyToolTags,

    #[error("Tool tag length is invalid")]
    InvalidToolTagLength,

    #[error("Too many on-chain resource definitions")]
    TooManyOnChainResourceDefinitions,

    #[error("Resource URI pattern length exceeds max")]
    InvalidResourceUriPatternLength,

    #[error("Too many resource tags")]
    TooManyResourceTags,

    #[error("Resource tag length is invalid")]
    InvalidResourceTagLength,

    #[error("Too many on-chain prompt definitions")]
    TooManyOnChainPromptDefinitions,

    #[error("Prompt name length is invalid")]
    InvalidPromptNameLength,

    #[error("Too many prompt tags")]
    TooManyPromptTags,

    #[error("Prompt tag length is invalid")]
    InvalidPromptTagLength,

    #[error("Full capabilities URI length exceeds max")]
    InvalidFullCapabilitiesUriLength,

    #[error("Invalid MCP server status")]
    InvalidMcpServerStatus,

    #[error("Server ID format is invalid (only alphanumeric, hyphens, and underscores allowed)")]
    InvalidServerIdFormat,

    // General program errors
    #[error("Unauthorized: Signer is not the owner of the entry")]
    Unauthorized,

    #[error("Account already exists")]
    AccountAlreadyExists,

    #[error("Account not found")]
    AccountNotFound,

    #[error("Invalid account data")]
    InvalidAccountData,

    #[error("Insufficient funds for rent exemption")]
    InsufficientFunds,

    #[error("Invalid PDA derivation")]
    InvalidPda,

    #[error("Missing required signature")]
    MissingRequiredSignature,

    #[error("State version mismatch - concurrent modification detected")]
    StateVersionMismatch,

    #[error("Operation already in progress - reentrancy prevented")]
    OperationInProgress,

    #[error("Account not owned by expected program")]
    IncorrectAccountOwner,

    #[error("PDA collision detected - insufficient entropy")]
    PdaCollision,

    // Token integration errors
    #[error("Insufficient stake amount")]
    InsufficientStake,

    #[error("Stake is still locked")]
    StakeLocked,

    #[error("Fee is below minimum allowed")]
    FeeTooLow,

    #[error("Invalid priority multiplier")]
    InvalidPriorityMultiplier,

    #[error("Token mint mismatch")]
    TokenMintMismatch,

    #[error("Insufficient token balance")]
    InsufficientTokenBalance,

    #[error("Invalid token account")]
    InvalidTokenAccount,

    #[error("Token transfer failed")]
    TokenTransferFailed,

    #[error("Staking period not yet expired")]
    StakingPeriodNotExpired,

    #[error("Invalid staking tier")]
    InvalidStakingTier,

    #[error("Lock period too short")]
    LockPeriodTooShort,

    #[error("Lock period too long")]
    LockPeriodTooLong,

    // SDK-specific errors
    #[error("Invalid configuration: {0}")]
    InvalidConfiguration(String),

    #[error("Feature not enabled: {0}")]
    FeatureNotEnabled(String),

    #[error("Build error: {0}")]
    BuildError(String),

    #[error("Validation error: {0}")]
    ValidationError(String),
}

impl SdkError {
    /// Convert a program error code to the corresponding SDK error
    pub fn from_program_error_code(code: u32) -> Self {
        match code {
            0 => SdkError::InvalidAgentIdLength,
            1 => SdkError::InvalidNameLength,
            2 => SdkError::InvalidDescriptionLength,
            3 => SdkError::InvalidVersionLength,
            4 => SdkError::InvalidProviderNameLength,
            5 => SdkError::InvalidProviderUrlLength,
            6 => SdkError::InvalidDocumentationUrlLength,
            7 => SdkError::TooManyServiceEndpoints,
            8 => SdkError::InvalidEndpointProtocolLength,
            9 => SdkError::InvalidEndpointUrlLength,
            10 => SdkError::TooManySupportedInputModes,
            11 => SdkError::InvalidInputModeLength,
            12 => SdkError::TooManySupportedOutputModes,
            13 => SdkError::InvalidOutputModeLength,
            14 => SdkError::TooManySkills,
            15 => SdkError::InvalidSkillIdLength,
            16 => SdkError::InvalidSkillNameLength,
            17 => SdkError::TooManySkillTags,
            18 => SdkError::InvalidSkillTagLength,
            19 => SdkError::InvalidSecurityInfoUriLength,
            20 => SdkError::InvalidAeaAddressLength,
            21 => SdkError::InvalidEconomicIntentSummaryLength,
            22 => SdkError::InvalidExtendedMetadataUriLength,
            23 => SdkError::TooManyTags,
            24 => SdkError::InvalidTagLength,
            25 => SdkError::MultipleDefaultEndpoints,
            26 => SdkError::NoDefaultEndpoint,
            27 => SdkError::InvalidUrlFormat,
            28 => SdkError::InvalidAgentStatus,
            29 => SdkError::Unauthorized,
            30 => SdkError::AccountAlreadyExists,
            31 => SdkError::AccountNotFound,
            32 => SdkError::InvalidAccountData,
            33 => SdkError::InsufficientFunds,
            34 => SdkError::InvalidPda,
            35 => SdkError::MissingRequiredSignature,
            36 => SdkError::StateVersionMismatch,
            37 => SdkError::OperationInProgress,
            38 => SdkError::IncorrectAccountOwner,
            39 => SdkError::PdaCollision,
            40 => SdkError::InsufficientStake,
            41 => SdkError::StakeLocked,
            42 => SdkError::FeeTooLow,
            43 => SdkError::InvalidPriorityMultiplier,
            44 => SdkError::TokenMintMismatch,
            45 => SdkError::InsufficientTokenBalance,
            46 => SdkError::InvalidTokenAccount,
            47 => SdkError::TokenTransferFailed,
            48 => SdkError::StakingPeriodNotExpired,
            49 => SdkError::InvalidStakingTier,
            50 => SdkError::LockPeriodTooShort,
            51 => SdkError::LockPeriodTooLong,
            _ => SdkError::InvalidAccountData,
        }
    }
}
