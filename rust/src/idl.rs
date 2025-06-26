//! IDL definitions for compile-time inclusion
//!
//! This module provides compile-time inclusion of the program IDLs,
//! enabling type-safe interaction with the on-chain programs.

use crate::errors::{SdkError, SdkResult};
use serde::{Deserialize, Serialize};
use serde_json::Value;

/// Agent Registry IDL
pub const AGENT_REGISTRY_IDL: &str = include_str!("../idl/agent_registry.json");

/// MCP Server Registry IDL  
pub const MCP_SERVER_REGISTRY_IDL: &str = include_str!("../idl/mcp_server_registry.json");

/// Parsed IDL structure
#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct Idl {
    pub version: String,
    pub name: String,
    pub instructions: Vec<IdlInstruction>,
    pub accounts: Option<Vec<IdlAccount>>,
    pub types: Option<Vec<IdlType>>,
    pub events: Option<Vec<IdlEvent>>,
    pub errors: Option<Vec<IdlError>>,
    pub constants: Option<Vec<IdlConstant>>,
}

/// IDL instruction definition
#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct IdlInstruction {
    pub name: String,
    pub accounts: Vec<IdlAccountItem>,
    pub args: Vec<IdlField>,
    pub docs: Option<Vec<String>>,
}

/// IDL account item
#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct IdlAccountItem {
    pub name: String,
    #[serde(rename = "isMut")]
    pub is_mut: bool,
    #[serde(rename = "isSigner")]
    pub is_signer: bool,
    pub docs: Option<Vec<String>>,
    pub desc: Option<String>,
}

/// IDL account definition
#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct IdlAccount {
    pub name: String,
    #[serde(rename = "type")]
    pub ty: IdlAccountType,
    pub docs: Option<Vec<String>>,
}

/// IDL account type
#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct IdlAccountType {
    pub kind: String,
    pub fields: Vec<IdlField>,
}

/// IDL field definition
#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct IdlField {
    pub name: String,
    #[serde(rename = "type")]
    pub ty: Value,
    pub docs: Option<Vec<String>>,
}

/// IDL type definition
#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct IdlType {
    pub name: String,
    #[serde(rename = "type")]
    pub ty: IdlTypeDefinition,
    pub docs: Option<Vec<String>>,
}

/// IDL type definition variants
#[derive(Debug, Clone, Serialize, Deserialize)]
#[serde(tag = "kind")]
pub enum IdlTypeDefinition {
    #[serde(rename = "struct")]
    Struct { fields: Vec<IdlField> },
    #[serde(rename = "enum")]
    Enum { variants: Vec<IdlEnumVariant> },
}

/// IDL enum variant
#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct IdlEnumVariant {
    pub name: String,
    pub fields: Option<Vec<IdlField>>,
}

/// IDL event definition
#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct IdlEvent {
    pub name: String,
    pub fields: Vec<IdlField>,
    pub docs: Option<Vec<String>>,
}

/// IDL error definition
#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct IdlError {
    pub code: u32,
    pub name: String,
    pub msg: String,
}

/// IDL constant definition
#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct IdlConstant {
    pub name: String,
    #[serde(rename = "type")]
    pub ty: String,
    pub value: String,
}

/// IDL registry containing all program IDLs
pub struct IdlRegistry {
    agent_registry: Idl,
    mcp_server_registry: Idl,
}

impl IdlRegistry {
    /// Create a new IDL registry with all program IDLs loaded
    pub fn new() -> SdkResult<Self> {
        let agent_registry = Self::parse_idl(AGENT_REGISTRY_IDL)?;
        let mcp_server_registry = Self::parse_idl(MCP_SERVER_REGISTRY_IDL)?;

        Ok(Self {
            agent_registry,
            mcp_server_registry,
        })
    }

    /// Get the Agent Registry IDL
    pub fn agent_registry(&self) -> &Idl {
        &self.agent_registry
    }

    /// Get the MCP Server Registry IDL
    pub fn mcp_server_registry(&self) -> &Idl {
        &self.mcp_server_registry
    }

    /// Parse an IDL from JSON string
    fn parse_idl(idl_json: &str) -> SdkResult<Idl> {
        serde_json::from_str(idl_json)
            .map_err(|e| SdkError::DeserializationError(format!("Failed to parse IDL: {}", e)))
    }

    /// Find an instruction by name in the specified program
    pub fn find_instruction(&self, program: &str, name: &str) -> Option<&IdlInstruction> {
        let idl = match program {
            "agent_registry" => &self.agent_registry,
            "mcp_server_registry" => &self.mcp_server_registry,
            _ => return None,
        };

        idl.instructions.iter().find(|instr| instr.name == name)
    }

    /// Get all instruction names for a program
    pub fn instruction_names(&self, program: &str) -> Vec<&str> {
        let idl = match program {
            "agent_registry" => &self.agent_registry,
            "mcp_server_registry" => &self.mcp_server_registry,
            _ => return vec![],
        };

        idl.instructions
            .iter()
            .map(|instr| instr.name.as_str())
            .collect()
    }

    /// Validate that the IDLs are properly formatted and contain expected instructions
    pub fn validate(&self) -> SdkResult<()> {
        // Validate agent registry IDL
        let required_agent_instructions = [
            "registerAgent",
            "updateAgentDetails",
            "updateAgentStatus",
            "deregisterAgent",
        ];

        for instruction in &required_agent_instructions {
            if self
                .find_instruction("agent_registry", instruction)
                .is_none()
            {
                return Err(SdkError::ValidationError(format!(
                    "Missing required agent registry instruction: {}",
                    instruction
                )));
            }
        }

        // Validate MCP server registry IDL
        let required_mcp_instructions = [
            "registerMcpServer",
            "updateMcpServerDetails",
            "updateMcpServerStatus",
            "deregisterMcpServer",
        ];

        for instruction in &required_mcp_instructions {
            if self
                .find_instruction("mcp_server_registry", instruction)
                .is_none()
            {
                return Err(SdkError::ValidationError(format!(
                    "Missing required MCP server registry instruction: {}",
                    instruction
                )));
            }
        }

        Ok(())
    }
}

impl Default for IdlRegistry {
    fn default() -> Self {
        Self::new().expect("Failed to load IDLs")
    }
}

/// Lazy-loaded global IDL registry
static mut IDL_REGISTRY: Option<IdlRegistry> = None;
static mut IDL_REGISTRY_INIT: std::sync::Once = std::sync::Once::new();

/// Get the global IDL registry instance
pub fn get_idl_registry() -> &'static IdlRegistry {
    unsafe {
        IDL_REGISTRY_INIT.call_once(|| {
            IDL_REGISTRY = Some(IdlRegistry::new().expect("Failed to initialize IDL registry"));
        });
        IDL_REGISTRY.as_ref().unwrap()
    }
}

#[cfg(test)]
mod tests {
    use super::*;

    #[test]
    fn test_idl_loading() {
        let registry = IdlRegistry::new().unwrap();

        // Verify basic structure
        assert_eq!(registry.agent_registry().name, "agent_registry");
        assert_eq!(registry.mcp_server_registry().name, "mcp_server_registry");

        // Verify instructions exist
        assert!(!registry.agent_registry().instructions.is_empty());
        assert!(!registry.mcp_server_registry().instructions.is_empty());
    }

    #[test]
    fn test_instruction_lookup() {
        let registry = IdlRegistry::new().unwrap();

        // Test finding instructions
        let register_agent = registry.find_instruction("agent_registry", "registerAgent");
        assert!(register_agent.is_some());

        let register_mcp = registry.find_instruction("mcp_server_registry", "registerMcpServer");
        assert!(register_mcp.is_some());

        // Test non-existent instruction
        let non_existent = registry.find_instruction("agent_registry", "nonExistentInstruction");
        assert!(non_existent.is_none());
    }

    #[test]
    fn test_validation() {
        let registry = IdlRegistry::new().unwrap();
        registry.validate().unwrap();
    }

    #[test]
    fn test_global_registry() {
        let registry = get_idl_registry();
        assert_eq!(registry.agent_registry().name, "agent_registry");
    }
}
