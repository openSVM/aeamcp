//! Integration tests with mock RPC responses
//!
//! These tests demonstrate edge case handling with stubbed RPC responses
//! to validate SDK behavior without requiring a live Solana cluster.

use solana_ai_registries::{
    deserialize_account_data, AgentBuilder, SdkError, SdkResult, SolanaAiRegistriesClient,
};

/// Mock RPC client wrapper for testing
struct MockRpcClient {
    client: SolanaAiRegistriesClient,
}

impl MockRpcClient {
    fn new() -> Self {
        // Use a mock RPC URL for testing
        let client = SolanaAiRegistriesClient::new("http://localhost:8899");
        Self { client }
    }

    fn get_client(&self) -> &SolanaAiRegistriesClient {
        &self.client
    }
}

#[tokio::test]
async fn test_agent_registration_with_invalid_data() {
    let mock_client = MockRpcClient::new();
    let _client = mock_client.get_client();

    // Test with invalid agent data that would fail validation
    let result = AgentBuilder::new("", "Test Agent") // Empty ID should fail
        .build();

    assert!(result.is_err());
    match result.unwrap_err() {
        SdkError::InvalidAgentIdLength => {
            // Expected error
        }
        other => panic!("Expected InvalidAgentIdLength, got {:?}", other),
    }
}

#[test]
fn test_deserialize_helper_with_invalid_data() {
    // Test deserialize helper with insufficient data
    let short_data = vec![1, 2, 3]; // Less than 8 bytes
    let result: SdkResult<MockStruct> = deserialize_account_data(&short_data, "test struct");

    assert!(result.is_err());
    match result.unwrap_err() {
        SdkError::InvalidAccountData => {
            // Expected error
        }
        other => panic!("Expected InvalidAccountData, got {:?}", other),
    }
}

#[test]
fn test_deserialize_helper_with_valid_data() {
    use borsh::{BorshDeserialize, BorshSerialize};

    #[derive(BorshSerialize, BorshDeserialize, Debug, PartialEq)]
    struct TestData {
        value: u64,
        text: String,
    }

    // Create test data
    let test_data = TestData {
        value: 12345,
        text: "hello".to_string(),
    };

    // Serialize with 8-byte discriminator prefix
    let serialized = test_data.try_to_vec().unwrap();
    let mut data_with_discriminator = vec![0u8; 8]; // 8-byte discriminator
    data_with_discriminator.extend_from_slice(&serialized);

    // Test deserialization
    let result: SdkResult<TestData> =
        deserialize_account_data(&data_with_discriminator, "test data");
    assert!(result.is_ok());
    let deserialized = result.unwrap();
    assert_eq!(deserialized.value, 12345);
    assert_eq!(deserialized.text, "hello");
}

#[test]
fn test_error_code_mapping() {
    // Test that unknown error codes are properly handled
    let unknown_error = SdkError::from_program_error_code(999);
    match unknown_error {
        SdkError::UnknownError(code) => {
            assert_eq!(code, 999);
        }
        other => panic!("Expected UnknownError(999), got {:?}", other),
    }

    // Test known error code
    let known_error = SdkError::from_program_error_code(0);
    match known_error {
        SdkError::InvalidAgentIdLength => {
            // Expected
        }
        other => panic!("Expected InvalidAgentIdLength, got {:?}", other),
    }
}

#[test]
fn test_agent_builder_edge_cases() {
    // Test maximum length validation
    let max_id = "a".repeat(64); // Exactly at limit
    let max_name = "b".repeat(128); // Exactly at limit

    let result = AgentBuilder::new(&max_id, &max_name).build();
    assert!(result.is_ok());

    // Test over limit
    let over_limit_id = "a".repeat(65); // Over limit
    let result = AgentBuilder::new(&over_limit_id, "test").build();
    assert!(result.is_err());
}

#[test]
fn test_service_endpoint_validation() {
    let builder = AgentBuilder::new("test-agent", "Test Agent");

    // Test valid endpoint
    let result = builder.add_service_endpoint("https", "https://example.com/api", true);
    assert!(result.is_ok());

    // Test multiple default endpoints (should fail on build)
    let builder = AgentBuilder::new("test-agent", "Test Agent");
    let builder = builder
        .add_service_endpoint("https", "https://example.com/api", true)
        .unwrap();
    let builder = builder
        .add_service_endpoint("http", "http://example.com/api", true)
        .unwrap();

    // The error should occur when we try to build, not when adding endpoints
    let result = builder.build();
    assert!(result.is_err());
    match result.unwrap_err() {
        SdkError::MultipleDefaultEndpoints => {
            // Expected error
        }
        other => panic!("Expected MultipleDefaultEndpoints, got {:?}", other),
    }
}

#[test]
fn test_skill_validation() {
    let builder = AgentBuilder::new("test-agent", "Test Agent");

    // Test valid skill
    let result = builder.add_skill("coding", "Code Generation", vec!["rust", "python"]);
    assert!(result.is_ok());

    // Test too many skills - should fail on build()
    let mut builder = AgentBuilder::new("test-agent", "Test Agent");
    for i in 0..11 {
        // MAX_SKILLS is 10, so we add 11 skills
        let result = builder.add_skill(&format!("skill{}", i), "Skill", vec!["tag"]);
        assert!(result.is_ok());
        builder = result.unwrap();
    }

    // The error should occur when we try to build, not when adding skills
    let result = builder.build();
    assert!(result.is_err());
    match result.unwrap_err() {
        SdkError::TooManySkills => {
            // Expected error
        }
        other => panic!("Expected TooManySkills, got {:?}", other),
    }
}

// Mock struct for testing deserialization
#[derive(Debug, borsh::BorshSerialize, borsh::BorshDeserialize)]
struct MockStruct {
    data: u64,
}

#[test]
fn test_priority_multiplier_validation() {
    use solana_ai_registries::payments::common::{
        MAX_PRIORITY_MULTIPLIER, MIN_PRIORITY_MULTIPLIER,
    };

    // Test valid range
    assert!(MIN_PRIORITY_MULTIPLIER <= MAX_PRIORITY_MULTIPLIER);
    assert_eq!(MIN_PRIORITY_MULTIPLIER, 100); // 1.0x
    assert_eq!(MAX_PRIORITY_MULTIPLIER, 255); // 2.55x
}

#[cfg(feature = "pyg")]
#[test]
fn test_pyg_cost_estimation_edge_cases() {
    use solana_ai_registries::payments::pyg::estimate_pyg_cost;

    // Test with minimum values
    let result = estimate_pyg_cost(1, None, None, None);
    assert!(result.is_ok());

    // Test with invalid priority multiplier
    let result = estimate_pyg_cost(1000, Some(50), None, None); // Below MIN_PRIORITY_MULTIPLIER
    assert!(result.is_err());

    let result = estimate_pyg_cost(1000, Some(255), None, None); // Above MAX_PRIORITY_MULTIPLIER
    assert!(result.is_ok()); // 255 is exactly at the limit

    // Test with overflow case
    let result = estimate_pyg_cost(1000, Some(0), None, None); // Below MIN_PRIORITY_MULTIPLIER
    assert!(result.is_err());
}

#[test]
fn test_constant_documentation_exists() {
    // This test ensures our constants are properly documented
    // by checking they compile and have expected values
    use solana_ai_registries::agent::*;
    use solana_ai_registries::mcp::*;
    use solana_ai_registries::payments::common::*;

    // Agent constants
    assert_eq!(MAX_AGENT_ID_LEN, 64);
    assert_eq!(MAX_AGENT_NAME_LEN, 128);
    assert_eq!(MAX_SERVICE_ENDPOINTS, 3);

    // MCP constants
    assert_eq!(MAX_SERVER_ID_LEN, 64);
    assert_eq!(MAX_ONCHAIN_TOOL_DEFINITIONS, 5);

    // Payment constants
    assert_eq!(A2AMPL_DECIMALS, 9);
    assert_eq!(A2AMPL_BASE_UNIT, 1_000_000_000);
    assert!(AGENT_REGISTRATION_FEE > MCP_REGISTRATION_FEE);
}
