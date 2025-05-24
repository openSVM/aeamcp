//! Validation functions for the Agent Registry program

use aeamcp_common::{
    constants::*,
    error::RegistryError,
    serialization::{ServiceEndpointInput, AgentSkillInput},
    utils::{validate_string_field, validate_optional_string_field, validate_vec_length},
};

/// Validate agent registration data
pub fn validate_register_agent(
    agent_id: &str,
    name: &str,
    description: &str,
    agent_version: &str,
    provider_name: &Option<String>,
    provider_url: &Option<String>,
    documentation_url: &Option<String>,
    service_endpoints: &[ServiceEndpointInput],
    supported_input_modes: &[String],
    supported_output_modes: &[String],
    skills: &[AgentSkillInput],
    security_info_uri: &Option<String>,
    aea_address: &Option<String>,
    economic_intent_summary: &Option<String>,
    extended_metadata_uri: &Option<String>,
    tags: &[String],
) -> Result<(), RegistryError> {
    // Validate required string fields
    validate_string_field(agent_id, MAX_AGENT_ID_LEN, false, RegistryError::InvalidAgentIdLength)?;
    validate_string_field(name, MAX_AGENT_NAME_LEN, false, RegistryError::InvalidNameLength)?;
    validate_string_field(description, MAX_AGENT_DESCRIPTION_LEN, true, RegistryError::InvalidDescriptionLength)?;
    validate_string_field(agent_version, MAX_AGENT_VERSION_LEN, false, RegistryError::InvalidVersionLength)?;

    // Validate optional string fields
    validate_optional_string_field(provider_name, MAX_PROVIDER_NAME_LEN, RegistryError::InvalidProviderNameLength)?;
    validate_optional_string_field(provider_url, MAX_PROVIDER_URL_LEN, RegistryError::InvalidProviderUrlLength)?;
    validate_optional_string_field(documentation_url, MAX_DOCUMENTATION_URL_LEN, RegistryError::InvalidDocumentationUrlLength)?;
    validate_optional_string_field(security_info_uri, MAX_SECURITY_INFO_URI_LEN, RegistryError::InvalidSecurityInfoUriLength)?;
    validate_optional_string_field(aea_address, MAX_AEA_ADDRESS_LEN, RegistryError::InvalidAeaAddressLength)?;
    validate_optional_string_field(economic_intent_summary, MAX_ECONOMIC_INTENT_LEN, RegistryError::InvalidEconomicIntentLength)?;
    validate_optional_string_field(extended_metadata_uri, MAX_EXTENDED_METADATA_URI_LEN, RegistryError::InvalidExtendedMetadataUriLength)?;

    // Validate service endpoints
    validate_service_endpoints(service_endpoints)?;

    // Validate supported modes
    validate_supported_modes(supported_input_modes)?;
    validate_supported_modes(supported_output_modes)?;

    // Validate skills
    validate_skills(skills)?;

    // Validate tags
    validate_agent_tags(tags)?;

    Ok(())
}

/// Validate service endpoints
pub fn validate_service_endpoints(endpoints: &[ServiceEndpointInput]) -> Result<(), RegistryError> {
    validate_vec_length(endpoints, MAX_SERVICE_ENDPOINTS, RegistryError::TooManyServiceEndpoints)?;

    if endpoints.is_empty() {
        return Ok(());
    }

    let mut default_count = 0;
    for endpoint in endpoints {
        validate_string_field(&endpoint.protocol, MAX_ENDPOINT_PROTOCOL_LEN, false, RegistryError::InvalidEndpointProtocolLength)?;
        validate_string_field(&endpoint.url, MAX_ENDPOINT_URL_LEN, false, RegistryError::InvalidEndpointUrlLength)?;
        
        if endpoint.is_default {
            default_count += 1;
        }
    }

    if default_count == 0 {
        return Err(RegistryError::MissingDefaultEndpoint);
    }
    if default_count > 1 {
        return Err(RegistryError::MultipleDefaultEndpoints);
    }

    Ok(())
}

/// Validate supported modes (input or output)
pub fn validate_supported_modes(modes: &[String]) -> Result<(), RegistryError> {
    validate_vec_length(modes, MAX_SUPPORTED_MODES, RegistryError::TooManySupportedModes)?;

    for mode in modes {
        validate_string_field(mode, MAX_MODE_LEN, false, RegistryError::InvalidModeLength)?;
    }

    Ok(())
}

/// Validate agent skills
pub fn validate_skills(skills: &[AgentSkillInput]) -> Result<(), RegistryError> {
    validate_vec_length(skills, MAX_SKILLS, RegistryError::TooManySkills)?;

    for skill in skills {
        validate_string_field(&skill.id, MAX_SKILL_ID_LEN, false, RegistryError::InvalidSkillIdLength)?;
        validate_string_field(&skill.name, MAX_SKILL_NAME_LEN, false, RegistryError::InvalidSkillNameLength)?;
        validate_skill_tags(&skill.tags)?;
    }

    Ok(())
}

/// Validate skill tags
pub fn validate_skill_tags(tags: &[String]) -> Result<(), RegistryError> {
    validate_vec_length(tags, MAX_SKILL_TAGS, RegistryError::TooManySkillTags)?;

    for tag in tags {
        validate_string_field(tag, MAX_SKILL_TAG_LEN, false, RegistryError::InvalidSkillTagLength)?;
    }

    Ok(())
}

/// Validate agent tags
pub fn validate_agent_tags(tags: &[String]) -> Result<(), RegistryError> {
    validate_vec_length(tags, MAX_AGENT_TAGS, RegistryError::TooManyAgentTags)?;

    for tag in tags {
        validate_string_field(tag, MAX_AGENT_TAG_LEN, false, RegistryError::InvalidAgentTagLength)?;
    }

    Ok(())
}

/// Validate agent status
pub fn validate_agent_status(status: u8) -> Result<(), RegistryError> {
    match status {
        0..=3 => Ok(()),
        _ => Err(RegistryError::InvalidAgentStatus),
    }
}

/// Validate update details input
pub fn validate_update_details(
    name: &Option<String>,
    description: &Option<String>,
    agent_version: &Option<String>,
    provider_name: &Option<String>,
    provider_url: &Option<String>,
    documentation_url: &Option<String>,
    service_endpoints: &Option<Vec<ServiceEndpointInput>>,
    supported_input_modes: &Option<Vec<String>>,
    supported_output_modes: &Option<Vec<String>>,
    skills: &Option<Vec<AgentSkillInput>>,
    security_info_uri: &Option<String>,
    aea_address: &Option<String>,
    economic_intent_summary: &Option<String>,
    extended_metadata_uri: &Option<String>,
    tags: &Option<Vec<String>>,
) -> Result<(), RegistryError> {
    // Validate optional fields if provided
    if let Some(val) = name {
        validate_string_field(val, MAX_AGENT_NAME_LEN, false, RegistryError::InvalidNameLength)?;
    }
    if let Some(val) = description {
        validate_string_field(val, MAX_AGENT_DESCRIPTION_LEN, true, RegistryError::InvalidDescriptionLength)?;
    }
    if let Some(val) = agent_version {
        validate_string_field(val, MAX_AGENT_VERSION_LEN, false, RegistryError::InvalidVersionLength)?;
    }

    validate_optional_string_field(provider_name, MAX_PROVIDER_NAME_LEN, RegistryError::InvalidProviderNameLength)?;
    validate_optional_string_field(provider_url, MAX_PROVIDER_URL_LEN, RegistryError::InvalidProviderUrlLength)?;
    validate_optional_string_field(documentation_url, MAX_DOCUMENTATION_URL_LEN, RegistryError::InvalidDocumentationUrlLength)?;
    validate_optional_string_field(security_info_uri, MAX_SECURITY_INFO_URI_LEN, RegistryError::InvalidSecurityInfoUriLength)?;
    validate_optional_string_field(aea_address, MAX_AEA_ADDRESS_LEN, RegistryError::InvalidAeaAddressLength)?;
    validate_optional_string_field(economic_intent_summary, MAX_ECONOMIC_INTENT_LEN, RegistryError::InvalidEconomicIntentLength)?;
    validate_optional_string_field(extended_metadata_uri, MAX_EXTENDED_METADATA_URI_LEN, RegistryError::InvalidExtendedMetadataUriLength)?;

    if let Some(endpoints) = service_endpoints {
        validate_service_endpoints(endpoints)?;
    }
    if let Some(modes) = supported_input_modes {
        validate_supported_modes(modes)?;
    }
    if let Some(modes) = supported_output_modes {
        validate_supported_modes(modes)?;
    }
    if let Some(skills_val) = skills {
        validate_skills(skills_val)?;
    }
    if let Some(tags_val) = tags {
        validate_agent_tags(tags_val)?;
    }

    Ok(())
}

#[cfg(test)]
mod tests {
    use super::*;

    #[test]
    fn test_validate_agent_id() {
        // Valid agent ID
        assert!(validate_string_field("valid-agent-id", MAX_AGENT_ID_LEN, false, RegistryError::InvalidAgentIdLength).is_ok());

        // Empty agent ID (invalid)
        assert_eq!(
            validate_string_field("", MAX_AGENT_ID_LEN, false, RegistryError::InvalidAgentIdLength),
            Err(RegistryError::InvalidAgentIdLength)
        );

        // Too long agent ID
        let long_id = "a".repeat(MAX_AGENT_ID_LEN + 1);
        assert_eq!(
            validate_string_field(&long_id, MAX_AGENT_ID_LEN, false, RegistryError::InvalidAgentIdLength),
            Err(RegistryError::InvalidAgentIdLength)
        );
    }

    #[test]
    fn test_validate_service_endpoints() {
        // Empty endpoints (valid)
        assert!(validate_service_endpoints(&[]).is_ok());

        // Single default endpoint (valid)
        let endpoints = vec![ServiceEndpointInput {
            protocol: "http".to_string(),
            url: "https://example.com".to_string(),
            is_default: true,
        }];
        assert!(validate_service_endpoints(&endpoints).is_ok());

        // Multiple endpoints with one default (valid)
        let endpoints = vec![
            ServiceEndpointInput {
                protocol: "http".to_string(),
                url: "https://example.com".to_string(),
                is_default: true,
            },
            ServiceEndpointInput {
                protocol: "ws".to_string(),
                url: "wss://example.com".to_string(),
                is_default: false,
            },
        ];
        assert!(validate_service_endpoints(&endpoints).is_ok());

        // No default endpoint (invalid)
        let endpoints = vec![ServiceEndpointInput {
            protocol: "http".to_string(),
            url: "https://example.com".to_string(),
            is_default: false,
        }];
        assert_eq!(
            validate_service_endpoints(&endpoints),
            Err(RegistryError::MissingDefaultEndpoint)
        );

        // Multiple default endpoints (invalid)
        let endpoints = vec![
            ServiceEndpointInput {
                protocol: "http".to_string(),
                url: "https://example.com".to_string(),
                is_default: true,
            },
            ServiceEndpointInput {
                protocol: "ws".to_string(),
                url: "wss://example.com".to_string(),
                is_default: true,
            },
        ];
        assert_eq!(
            validate_service_endpoints(&endpoints),
            Err(RegistryError::MultipleDefaultEndpoints)
        );

        // Too many endpoints
        let endpoints = vec![ServiceEndpointInput {
            protocol: "http".to_string(),
            url: "https://example.com".to_string(),
            is_default: true,
        }; MAX_SERVICE_ENDPOINTS + 1];
        assert_eq!(
            validate_service_endpoints(&endpoints),
            Err(RegistryError::TooManyServiceEndpoints)
        );
    }

    #[test]
    fn test_validate_skills() {
        // Valid skills
        let skills = vec![AgentSkillInput {
            id: "skill1".to_string(),
            name: "Test Skill".to_string(),
            description_hash: None,
            tags: vec!["tag1".to_string()],
        }];
        assert!(validate_skills(&skills).is_ok());

        // Too many skills
        let skills = vec![AgentSkillInput {
            id: "skill".to_string(),
            name: "Test Skill".to_string(),
            description_hash: None,
            tags: vec![],
        }; MAX_SKILLS + 1];
        assert_eq!(
            validate_skills(&skills),
            Err(RegistryError::TooManySkills)
        );

        // Invalid skill ID
        let skills = vec![AgentSkillInput {
            id: "".to_string(),
            name: "Test Skill".to_string(),
            description_hash: None,
            tags: vec![],
        }];
        assert_eq!(
            validate_skills(&skills),
            Err(RegistryError::InvalidSkillIdLength)
        );
    }

    #[test]
    fn test_validate_agent_status() {
        // Valid statuses
        assert!(validate_agent_status(0).is_ok()); // Pending
        assert!(validate_agent_status(1).is_ok()); // Active
        assert!(validate_agent_status(2).is_ok()); // Inactive
        assert!(validate_agent_status(3).is_ok()); // Deregistered

        // Invalid status
        assert_eq!(
            validate_agent_status(4),
            Err(RegistryError::InvalidAgentStatus)
        );
    }

    #[test]
    fn test_validate_supported_modes() {
        // Valid modes
        let modes = vec!["text/plain".to_string(), "application/json".to_string()];
        assert!(validate_supported_modes(&modes).is_ok());

        // Too many modes
        let modes = vec!["mode".to_string(); MAX_SUPPORTED_MODES + 1];
        assert_eq!(
            validate_supported_modes(&modes),
            Err(RegistryError::TooManySupportedModes)
        );

        // Invalid mode (empty)
        let modes = vec!["".to_string()];
        assert_eq!(
            validate_supported_modes(&modes),
            Err(RegistryError::InvalidModeLength)
        );
    }
}