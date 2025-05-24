//! Common utilities and types for the Solana AI Registries

pub mod constants;
pub mod error;
pub mod serialization;
pub mod utils;

// Re-export commonly used items
pub use constants::*;
pub use error::*;
pub use serialization::*;
pub use utils::*;

/// Status of an agent in the Agent Registry
#[repr(u8)]
#[derive(Clone, Copy, Debug, PartialEq, Eq)]
pub enum AgentStatus {
    /// Agent is pending verification or initialization
    Pending = 0,
    /// Agent is active and operational
    Active = 1,
    /// Agent is temporarily inactive
    Inactive = 2,
    /// Agent has been deregistered and is no longer available
    Deregistered = 3,
}

impl AgentStatus {
    /// Convert a u8 value to an AgentStatus enum variant
    pub fn from_u8(value: u8) -> Option<Self> {
        match value {
            0 => Some(AgentStatus::Pending),
            1 => Some(AgentStatus::Active),
            2 => Some(AgentStatus::Inactive),
            3 => Some(AgentStatus::Deregistered),
            _ => None,
        }
    }
}

impl Default for AgentStatus {
    fn default() -> Self {
        AgentStatus::Pending
    }
}

/// Status of an MCP server in the MCP Server Registry
#[repr(u8)]
#[derive(Clone, Copy, Debug, PartialEq, Eq)]
pub enum McpServerStatus {
    /// Server is pending verification or initialization
    Pending = 0,
    /// Server is active and operational
    Active = 1,
    /// Server is temporarily inactive
    Inactive = 2,
    /// Server has been deregistered and is no longer available
    Deregistered = 3,
}

impl McpServerStatus {
    /// Convert a u8 value to a McpServerStatus enum variant
    pub fn from_u8(value: u8) -> Option<Self> {
        match value {
            0 => Some(McpServerStatus::Pending),
            1 => Some(McpServerStatus::Active),
            2 => Some(McpServerStatus::Inactive),
            3 => Some(McpServerStatus::Deregistered),
            _ => None,
        }
    }
}

impl Default for McpServerStatus {
    fn default() -> Self {
        McpServerStatus::Pending
    }
}

#[cfg(test)]
mod tests {
    use super::*;

    #[test]
    fn test_agent_status_conversion() {
        assert_eq!(AgentStatus::from_u8(0), Some(AgentStatus::Pending));
        assert_eq!(AgentStatus::from_u8(1), Some(AgentStatus::Active));
        assert_eq!(AgentStatus::from_u8(2), Some(AgentStatus::Inactive));
        assert_eq!(AgentStatus::from_u8(3), Some(AgentStatus::Deregistered));
        assert_eq!(AgentStatus::from_u8(4), None);
    }

    #[test]
    fn test_mcp_server_status_conversion() {
        assert_eq!(McpServerStatus::from_u8(0), Some(McpServerStatus::Pending));
        assert_eq!(McpServerStatus::from_u8(1), Some(McpServerStatus::Active));
        assert_eq!(McpServerStatus::from_u8(2), Some(McpServerStatus::Inactive));
        assert_eq!(McpServerStatus::from_u8(3), Some(McpServerStatus::Deregistered));
        assert_eq!(McpServerStatus::from_u8(4), None);
    }

    #[test]
    fn test_default_status() {
        assert_eq!(AgentStatus::default(), AgentStatus::Pending);
        assert_eq!(McpServerStatus::default(), McpServerStatus::Pending);
    }
}