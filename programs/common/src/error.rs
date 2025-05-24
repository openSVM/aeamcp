//! Error types for the Solana AI Registries

use solana_program::program_error::ProgramError;
use thiserror::Error;

/// Custom error types for the registry programs
#[derive(Error, Debug, Clone, PartialEq)]
pub enum RegistryError {
    // Agent Registry Errors
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
    #[error("Service endpoint protocol length is invalid (empty or exceeds max)")]
    InvalidEndpointProtocolLength,
    #[error("Service endpoint URL length is invalid (empty or exceeds max)")]
    InvalidEndpointUrlLength,
    #[error("Only one service endpoint can be marked as default")]
    MultipleDefaultEndpoints,
    #[error("If service endpoints are provided, one must be marked as default")]
    MissingDefaultEndpoint,
    #[error("Too many supported modes (input/output) provided")]
    TooManySupportedModes,
    #[error("Supported mode string length is invalid (empty or exceeds max)")]
    InvalidModeLength,
    #[error("Too many skills provided")]
    TooManySkills,
    #[error("Skill ID length is invalid (empty or exceeds max)")]
    InvalidSkillIdLength,
    #[error("Skill name length is invalid (empty or exceeds max)")]
    InvalidSkillNameLength,
    #[error("Too many tags for a skill")]
    TooManySkillTags,
    #[error("Skill tag length is invalid (empty or exceeds max)")]
    InvalidSkillTagLength,
    #[error("Security info URI length exceeds max")]
    InvalidSecurityInfoUriLength,
    #[error("AEA address length exceeds max")]
    InvalidAeaAddressLength,
    #[error("Economic intent summary length exceeds max")]
    InvalidEconomicIntentLength,
    #[error("Extended metadata URI length exceeds max")]
    InvalidExtendedMetadataUriLength,
    #[error("Too many agent tags provided")]
    TooManyAgentTags,
    #[error("Agent tag length is invalid (empty or exceeds max)")]
    InvalidAgentTagLength,

    // MCP Server Registry Errors
    #[error("Server ID length is invalid (empty or exceeds max)")]
    InvalidServerIdLength,
    #[error("Server capabilities summary length exceeds max")]
    InvalidServerCapabilitiesSummaryLength,
    #[error("Too many on-chain tool definitions")]
    TooManyToolDefinitions,
    #[error("Tool name length is invalid (empty or exceeds max)")]
    InvalidToolNameLength,
    #[error("Too many tags for a tool")]
    TooManyToolTags,
    #[error("Tool tag length is invalid (empty or exceeds max)")]
    InvalidToolTagLength,
    #[error("Too many on-chain resource definitions")]
    TooManyResourceDefinitions,
    #[error("Resource URI pattern length is invalid (empty or exceeds max)")]
    InvalidResourceUriPatternLength,
    #[error("Too many tags for a resource")]
    TooManyResourceTags,
    #[error("Resource tag length is invalid (empty or exceeds max)")]
    InvalidResourceTagLength,
    #[error("Too many on-chain prompt definitions")]
    TooManyPromptDefinitions,
    #[error("Prompt name length is invalid (empty or exceeds max)")]
    InvalidPromptNameLength,
    #[error("Too many tags for a prompt")]
    TooManyPromptTags,
    #[error("Prompt tag length is invalid (empty or exceeds max)")]
    InvalidPromptTagLength,
    #[error("Full capabilities URI length exceeds max")]
    InvalidFullCapabilitiesUriLength,
    #[error("Too many server tags provided")]
    TooManyServerTags,
    #[error("Server tag length is invalid (empty or exceeds max)")]
    InvalidServerTagLength,

    // General Errors
    #[error("Invalid agent status value")]
    InvalidAgentStatus,
    #[error("Invalid MCP server status value")]
    InvalidMcpServerStatus,
    #[error("Bump seed not found in hash map")]
    BumpSeedNotInHashMap,
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
}

impl From<RegistryError> for ProgramError {
    fn from(e: RegistryError) -> Self {
        ProgramError::Custom(e as u32)
    }
}

impl From<ProgramError> for RegistryError {
    fn from(e: ProgramError) -> Self {
        match e {
            ProgramError::Custom(code) => {
                // Try to convert back to RegistryError
                // This is a simplified conversion - in practice you might want
                // a more robust mapping
                match code {
                    0 => RegistryError::InvalidAgentIdLength,
                    1 => RegistryError::InvalidNameLength,
                    // ... add more mappings as needed
                    _ => RegistryError::InvalidAccountData,
                }
            }
            ProgramError::MissingRequiredSignature => RegistryError::MissingRequiredSignature,
            ProgramError::InsufficientFunds => RegistryError::InsufficientFunds,
            _ => RegistryError::InvalidAccountData,
        }
    }
}

/// Result type for registry operations
pub type RegistryResult<T> = Result<T, RegistryError>;