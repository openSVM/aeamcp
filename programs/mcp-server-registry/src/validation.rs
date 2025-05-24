//! Validation functions for the MCP Server Registry program

use aeamcp_common::{
    constants::*,
    error::RegistryError,
    serialization::{
        McpToolDefinitionOnChainInput, McpResourceDefinitionOnChainInput,
        McpPromptDefinitionOnChainInput
    },
};

/// Validate MCP server registration input
pub fn validate_register_mcp_server(
    server_id: &str,
    name: &str,
    server_version: &str,
    service_endpoint: &str,
    documentation_url: &Option<String>,
    server_capabilities_summary: &Option<String>,
    onchain_tool_definitions: &[McpToolDefinitionOnChainInput],
    onchain_resource_definitions: &[McpResourceDefinitionOnChainInput],
    onchain_prompt_definitions: &[McpPromptDefinitionOnChainInput],
    full_capabilities_uri: &Option<String>,
    tags: &[String],
) -> Result<(), RegistryError> {
    // Validate server_id
    validate_server_id(server_id)?;
    
    // Validate name
    validate_server_name(name)?;
    
    // Validate server_version
    validate_server_version(server_version)?;
    
    // Validate service_endpoint
    validate_service_endpoint(service_endpoint)?;
    
    // Validate optional fields
    if let Some(url) = documentation_url {
        validate_documentation_url(url)?;
    }
    
    if let Some(summary) = server_capabilities_summary {
        validate_server_capabilities_summary(summary)?;
    }
    
    if let Some(uri) = full_capabilities_uri {
        validate_full_capabilities_uri(uri)?;
    }
    
    // Validate tool definitions
    validate_tool_definitions(onchain_tool_definitions)?;
    
    // Validate resource definitions
    validate_resource_definitions(onchain_resource_definitions)?;
    
    // Validate prompt definitions
    validate_prompt_definitions(onchain_prompt_definitions)?;
    
    // Validate tags
    validate_server_tags(tags)?;
    
    Ok(())
}

/// Validate server ID
pub fn validate_server_id(server_id: &str) -> Result<(), RegistryError> {
    if server_id.is_empty() {
        return Err(RegistryError::InvalidServerIdLength);
    }
    if server_id.len() > MAX_SERVER_ID_LEN {
        return Err(RegistryError::InvalidServerIdLength);
    }
    
    // Check for valid characters (alphanumeric, hyphens, underscores)
    if !server_id.chars().all(|c| c.is_alphanumeric() || c == '-' || c == '_') {
        return Err(RegistryError::InvalidServerIdLength);
    }
    
    Ok(())
}

/// Validate server name
pub fn validate_server_name(name: &str) -> Result<(), RegistryError> {
    if name.is_empty() {
        return Err(RegistryError::InvalidNameLength);
    }
    if name.len() > MAX_SERVER_NAME_LEN {
        return Err(RegistryError::InvalidNameLength);
    }
    Ok(())
}

/// Validate server version
pub fn validate_server_version(version: &str) -> Result<(), RegistryError> {
    if version.is_empty() {
        return Err(RegistryError::InvalidVersionLength);
    }
    if version.len() > MAX_SERVER_VERSION_LEN {
        return Err(RegistryError::InvalidVersionLength);
    }
    Ok(())
}

/// Validate service endpoint
pub fn validate_service_endpoint(endpoint: &str) -> Result<(), RegistryError> {
    if endpoint.is_empty() {
        return Err(RegistryError::InvalidEndpointUrlLength);
    }
    if endpoint.len() > MAX_SERVER_ENDPOINT_URL_LEN {
        return Err(RegistryError::InvalidEndpointUrlLength);
    }
    
    // Basic URL validation - should start with http:// or https://
    if !endpoint.starts_with("http://") && !endpoint.starts_with("https://") {
        return Err(RegistryError::InvalidEndpointUrlLength);
    }
    
    Ok(())
}

/// Validate documentation URL
pub fn validate_documentation_url(url: &str) -> Result<(), RegistryError> {
    if url.len() > MAX_DOCUMENTATION_URL_LEN {
        return Err(RegistryError::InvalidDocumentationUrlLength);
    }
    
    // Basic URL validation if not empty
    if !url.is_empty() && !url.starts_with("http://") && !url.starts_with("https://") {
        return Err(RegistryError::InvalidDocumentationUrlLength);
    }
    
    Ok(())
}

/// Validate server capabilities summary
pub fn validate_server_capabilities_summary(summary: &str) -> Result<(), RegistryError> {
    if summary.len() > MAX_SERVER_CAPABILITIES_SUMMARY_LEN {
        return Err(RegistryError::InvalidServerCapabilitiesSummaryLength);
    }
    Ok(())
}

/// Validate full capabilities URI
pub fn validate_full_capabilities_uri(uri: &str) -> Result<(), RegistryError> {
    if uri.len() > MAX_FULL_CAPABILITIES_URI_LEN {
        return Err(RegistryError::InvalidFullCapabilitiesUriLength);
    }
    
    // Basic URI validation if not empty
    if !uri.is_empty() && !uri.starts_with("http://") && !uri.starts_with("https://") 
        && !uri.starts_with("ipfs://") && !uri.starts_with("ar://") {
        return Err(RegistryError::InvalidFullCapabilitiesUriLength);
    }
    
    Ok(())
}

/// Validate tool definitions
pub fn validate_tool_definitions(tools: &[McpToolDefinitionOnChainInput]) -> Result<(), RegistryError> {
    if tools.len() > MAX_ONCHAIN_TOOL_DEFINITIONS {
        return Err(RegistryError::TooManyToolDefinitions);
    }
    
    for tool in tools {
        validate_tool_definition(tool)?;
    }
    
    Ok(())
}

/// Validate a single tool definition
pub fn validate_tool_definition(tool: &McpToolDefinitionOnChainInput) -> Result<(), RegistryError> {
    // Validate tool name
    if tool.name.is_empty() {
        return Err(RegistryError::InvalidToolNameLength);
    }
    if tool.name.len() > MAX_TOOL_NAME_LEN {
        return Err(RegistryError::InvalidToolNameLength);
    }
    
    // Validate tags
    if tool.tags.len() > MAX_TOOL_TAGS {
        return Err(RegistryError::TooManyToolTags);
    }
    
    for tag in &tool.tags {
        if tag.is_empty() {
            return Err(RegistryError::InvalidToolTagLength);
        }
        if tag.len() > MAX_TOOL_TAG_LEN {
            return Err(RegistryError::InvalidToolTagLength);
        }
    }
    
    Ok(())
}

/// Validate resource definitions
pub fn validate_resource_definitions(resources: &[McpResourceDefinitionOnChainInput]) -> Result<(), RegistryError> {
    if resources.len() > MAX_ONCHAIN_RESOURCE_DEFINITIONS {
        return Err(RegistryError::TooManyResourceDefinitions);
    }
    
    for resource in resources {
        validate_resource_definition(resource)?;
    }
    
    Ok(())
}

/// Validate a single resource definition
pub fn validate_resource_definition(resource: &McpResourceDefinitionOnChainInput) -> Result<(), RegistryError> {
    // Validate URI pattern
    if resource.uri_pattern.is_empty() {
        return Err(RegistryError::InvalidResourceUriPatternLength);
    }
    if resource.uri_pattern.len() > MAX_RESOURCE_URI_PATTERN_LEN {
        return Err(RegistryError::InvalidResourceUriPatternLength);
    }
    
    // Validate tags
    if resource.tags.len() > MAX_RESOURCE_TAGS {
        return Err(RegistryError::TooManyResourceTags);
    }
    
    for tag in &resource.tags {
        if tag.is_empty() {
            return Err(RegistryError::InvalidResourceTagLength);
        }
        if tag.len() > MAX_RESOURCE_TAG_LEN {
            return Err(RegistryError::InvalidResourceTagLength);
        }
    }
    
    Ok(())
}

/// Validate prompt definitions
pub fn validate_prompt_definitions(prompts: &[McpPromptDefinitionOnChainInput]) -> Result<(), RegistryError> {
    if prompts.len() > MAX_ONCHAIN_PROMPT_DEFINITIONS {
        return Err(RegistryError::TooManyPromptDefinitions);
    }
    
    for prompt in prompts {
        validate_prompt_definition(prompt)?;
    }
    
    Ok(())
}

/// Validate a single prompt definition
pub fn validate_prompt_definition(prompt: &McpPromptDefinitionOnChainInput) -> Result<(), RegistryError> {
    // Validate prompt name
    if prompt.name.is_empty() {
        return Err(RegistryError::InvalidPromptNameLength);
    }
    if prompt.name.len() > MAX_PROMPT_NAME_LEN {
        return Err(RegistryError::InvalidPromptNameLength);
    }
    
    // Validate tags
    if prompt.tags.len() > MAX_PROMPT_TAGS {
        return Err(RegistryError::TooManyPromptTags);
    }
    
    for tag in &prompt.tags {
        if tag.is_empty() {
            return Err(RegistryError::InvalidPromptTagLength);
        }
        if tag.len() > MAX_PROMPT_TAG_LEN {
            return Err(RegistryError::InvalidPromptTagLength);
        }
    }
    
    Ok(())
}

/// Validate server tags
pub fn validate_server_tags(tags: &[String]) -> Result<(), RegistryError> {
    if tags.len() > MAX_SERVER_TAGS {
        return Err(RegistryError::TooManyServerTags);
    }
    
    for tag in tags {
        if tag.is_empty() {
            return Err(RegistryError::InvalidServerTagLength);
        }
        if tag.len() > MAX_SERVER_TAG_LEN {
            return Err(RegistryError::InvalidServerTagLength);
        }
    }
    
    Ok(())
}

/// Validate MCP server status
pub fn validate_mcp_server_status(status: u8) -> Result<(), RegistryError> {
    match status {
        0..=3 => Ok(()), // Pending, Active, Inactive, Deregistered
        _ => Err(RegistryError::InvalidMcpServerStatus),
    }
}

#[cfg(test)]
mod tests {
    use super::*;

    #[test]
    fn test_validate_server_id() {
        // Valid server IDs
        assert!(validate_server_id("test-server").is_ok());
        assert!(validate_server_id("test_server").is_ok());
        assert!(validate_server_id("testserver123").is_ok());
        assert!(validate_server_id("a").is_ok());
        
        // Invalid server IDs
        assert!(validate_server_id("").is_err()); // Empty
        assert!(validate_server_id(&"a".repeat(MAX_SERVER_ID_LEN + 1)).is_err()); // Too long
        assert!(validate_server_id("test server").is_err()); // Space
        assert!(validate_server_id("test@server").is_err()); // Special character
    }

    #[test]
    fn test_validate_server_name() {
        // Valid names
        assert!(validate_server_name("Test Server").is_ok());
        assert!(validate_server_name("A").is_ok());
        
        // Invalid names
        assert!(validate_server_name("").is_err()); // Empty
        assert!(validate_server_name(&"a".repeat(MAX_SERVER_NAME_LEN + 1)).is_err()); // Too long
    }

    #[test]
    fn test_validate_service_endpoint() {
        // Valid endpoints
        assert!(validate_service_endpoint("https://example.com/mcp").is_ok());
        assert!(validate_service_endpoint("http://localhost:8080").is_ok());
        
        // Invalid endpoints
        assert!(validate_service_endpoint("").is_err()); // Empty
        assert!(validate_service_endpoint("ftp://example.com").is_err()); // Wrong protocol
        assert!(validate_service_endpoint("example.com").is_err()); // No protocol
        assert!(validate_service_endpoint(&format!("https://{}.com", "a".repeat(300))).is_err()); // Too long
    }

    #[test]
    fn test_validate_tool_definition() {
        let valid_tool = McpToolDefinitionOnChainInput {
            name: "test-tool".to_string(),
            description_hash: [0; 32],
            input_schema_hash: [0; 32],
            output_schema_hash: [0; 32],
            tags: vec!["test".to_string()],
        };
        assert!(validate_tool_definition(&valid_tool).is_ok());
        
        // Invalid tool - empty name
        let invalid_tool = McpToolDefinitionOnChainInput {
            name: "".to_string(),
            description_hash: [0; 32],
            input_schema_hash: [0; 32],
            output_schema_hash: [0; 32],
            tags: vec![],
        };
        assert!(validate_tool_definition(&invalid_tool).is_err());
        
        // Invalid tool - too many tags
        let invalid_tool = McpToolDefinitionOnChainInput {
            name: "test".to_string(),
            description_hash: [0; 32],
            input_schema_hash: [0; 32],
            output_schema_hash: [0; 32],
            tags: vec!["tag".to_string(); MAX_TOOL_TAGS + 1],
        };
        assert!(validate_tool_definition(&invalid_tool).is_err());
    }

    #[test]
    fn test_validate_server_tags() {
        // Valid tags
        assert!(validate_server_tags(&vec!["test".to_string(), "example".to_string()]).is_ok());
        assert!(validate_server_tags(&vec![]).is_ok()); // Empty is ok
        
        // Invalid tags
        assert!(validate_server_tags(&vec!["".to_string()]).is_err()); // Empty tag
        assert!(validate_server_tags(&vec!["tag".to_string(); MAX_SERVER_TAGS + 1]).is_err()); // Too many
        assert!(validate_server_tags(&vec!["a".repeat(MAX_SERVER_TAG_LEN + 1)]).is_err()); // Tag too long
    }

    #[test]
    fn test_validate_mcp_server_status() {
        // Valid statuses
        assert!(validate_mcp_server_status(0).is_ok()); // Pending
        assert!(validate_mcp_server_status(1).is_ok()); // Active
        assert!(validate_mcp_server_status(2).is_ok()); // Inactive
        assert!(validate_mcp_server_status(3).is_ok()); // Deregistered
        
        // Invalid statuses
        assert!(validate_mcp_server_status(4).is_err());
        assert!(validate_mcp_server_status(255).is_err());
    }

    #[test]
    fn test_validate_full_capabilities_uri() {
        // Valid URIs
        assert!(validate_full_capabilities_uri("https://example.com/capabilities.json").is_ok());
        assert!(validate_full_capabilities_uri("ipfs://QmHash").is_ok());
        assert!(validate_full_capabilities_uri("ar://arweave-hash").is_ok());
        assert!(validate_full_capabilities_uri("").is_ok()); // Empty is ok
        
        // Invalid URIs
        assert!(validate_full_capabilities_uri("invalid-uri").is_err());
        assert!(validate_full_capabilities_uri(&"https://".repeat(100)).is_err()); // Too long
    }
}