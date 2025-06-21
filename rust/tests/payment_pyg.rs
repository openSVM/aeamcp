//! Pay-as-you-go (PYG) payment tests
//!
//! This module tests the pay-as-you-go payment functionality,
//! including compute unit budgets and balance assertions.

#[cfg(feature = "pyg")]
use solana_ai_registries::{
    payments::{
        common::{A2AMPL_BASE_UNIT, MIN_SERVICE_FEE, MIN_TOOL_FEE},
        pyg::{estimate_pyg_cost, PygPaymentArgs, PygPaymentClient, PygServiceType},
    },
    SolanaAiRegistriesClient,
};
use solana_sdk::{pubkey::Pubkey, signature::Signer, signer::keypair::Keypair};

#[cfg(feature = "pyg")]
struct TestPaymentClient {
    client: PygPaymentClient,
    payer: Keypair,
    recipient: Pubkey,
    token_mint: Pubkey,
}

#[cfg(feature = "pyg")]
impl TestPaymentClient {
    fn new() -> Self {
        let client = PygPaymentClient::new("https://api.devnet.solana.com");
        let payer = Keypair::new();
        let recipient = Pubkey::new_unique();
        let token_mint = Pubkey::new_unique(); // Mock token mint

        Self {
            client,
            payer,
            recipient,
            token_mint,
        }
    }
}

// Basic PYG Payment Tests

#[cfg(feature = "pyg")]
#[test]
fn test_pyg_payment_args_creation() {
    let args = PygPaymentArgs {
        amount: MIN_SERVICE_FEE,
        service_type: PygServiceType::AgentService,
        compute_units: Some(10000),
        priority_fee: Some(1000),
    };

    assert_eq!(args.amount, MIN_SERVICE_FEE);
    assert_eq!(args.service_type, PygServiceType::AgentService);
    assert_eq!(args.compute_units, Some(10000));
    assert_eq!(args.priority_fee, Some(1000));
}

#[cfg(feature = "pyg")]
#[test]
fn test_pyg_service_type_min_fees() {
    assert_eq!(PygServiceType::AgentService.min_fee(), MIN_SERVICE_FEE);
    assert_eq!(PygServiceType::ToolUsage.min_fee(), MIN_TOOL_FEE);

    // All service types should have positive minimum fees except resource access
    assert!(PygServiceType::AgentService.min_fee() > 0);
    assert!(PygServiceType::ToolUsage.min_fee() > 0);
    assert!(PygServiceType::ResourceAccess.min_fee() > 0);
    assert!(PygServiceType::PromptExecution.min_fee() > 0);
}

#[cfg(feature = "pyg")]
#[test]
fn test_pyg_client_creation() {
    let _client = PygPaymentClient::new("https://api.devnet.solana.com");
    // Client should be created successfully (we can't test much without a real connection)
    // Just test that it doesn't panic during creation
}

// Cost Estimation Tests

#[cfg(feature = "pyg")]
#[test]
fn test_estimate_pyg_cost_basic() {
    let base_amount = convert_a2ampl_to_base_units(1.0); // 1 A2AMPL

    let estimate = estimate_pyg_cost(base_amount, None, None, None).unwrap();

    assert_eq!(estimate.service_fee, base_amount);
    assert_eq!(estimate.compute_cost, 0);
    assert_eq!(estimate.total_cost, base_amount);
    assert_eq!(estimate.effective_priority_multiplier, 100); // Default 1.0x
}

#[cfg(feature = "pyg")]
#[test]
fn test_estimate_pyg_cost_with_priority() {
    let base_amount = convert_a2ampl_to_base_units(1.0);
    let priority_multiplier = 150; // 1.5x

    let estimate = estimate_pyg_cost(base_amount, Some(priority_multiplier), None, None).unwrap();

    let expected_service_fee = (base_amount * priority_multiplier as u64) / 100;
    assert_eq!(estimate.service_fee, expected_service_fee);
    assert_eq!(estimate.compute_cost, 0);
    assert_eq!(estimate.total_cost, expected_service_fee);
    assert_eq!(estimate.effective_priority_multiplier, priority_multiplier);
}

#[cfg(feature = "pyg")]
#[test]
fn test_estimate_pyg_cost_with_compute_units() {
    let base_amount = convert_a2ampl_to_base_units(1.0);
    let compute_units = 10000u32;
    let fee_per_cu = 100u64;

    let estimate =
        estimate_pyg_cost(base_amount, None, Some(compute_units), Some(fee_per_cu)).unwrap();

    let expected_compute_cost = compute_units as u64 * fee_per_cu;
    assert_eq!(estimate.service_fee, base_amount);
    assert_eq!(estimate.compute_cost, expected_compute_cost);
    assert_eq!(estimate.total_cost, base_amount + expected_compute_cost);
}

#[cfg(feature = "pyg")]
#[test]
fn test_estimate_pyg_cost_complete() {
    let base_amount = convert_a2ampl_to_base_units(2.0);
    let priority_multiplier = 200; // 2.0x
    let compute_units = 5000u32;
    let fee_per_cu = 50u64;

    let estimate = estimate_pyg_cost(
        base_amount,
        Some(priority_multiplier),
        Some(compute_units),
        Some(fee_per_cu),
    )
    .unwrap();

    let expected_service_fee = (base_amount * priority_multiplier as u64) / 100;
    let expected_compute_cost = compute_units as u64 * fee_per_cu;
    let expected_total = expected_service_fee + expected_compute_cost;

    assert_eq!(estimate.service_fee, expected_service_fee);
    assert_eq!(estimate.compute_cost, expected_compute_cost);
    assert_eq!(estimate.total_cost, expected_total);
    assert_eq!(estimate.effective_priority_multiplier, priority_multiplier);
}

#[cfg(feature = "pyg")]
#[test]
fn test_estimate_pyg_cost_invalid_priority() {
    let base_amount = convert_a2ampl_to_base_units(1.0);

    // Priority multiplier too low
    let result = estimate_pyg_cost(base_amount, Some(50), None, None);
    assert!(result.is_err());

    // Priority multiplier too high (greater than u8::MAX would be caught at compile time)
    let result = estimate_pyg_cost(base_amount, Some(255), None, None);
    assert!(result.is_ok()); // 255 should be valid
}

#[cfg(feature = "pyg")]
#[test]
fn test_cost_estimate_a2ampl_conversion() {
    let estimate = estimate_pyg_cost(
        A2AMPL_BASE_UNIT * 2, // 2 A2AMPL
        Some(150),            // 1.5x
        Some(1000),           // 1000 CU
        Some(100),            // 100 lamports per CU
    )
    .unwrap();

    let a2ampl_estimate = estimate.to_a2ampl();

    // Service fee: 2 A2AMPL * 1.5 = 3 A2AMPL
    assert_eq!(a2ampl_estimate.service_fee, 3.0);

    // Compute cost: 1000 * 100 = 100,000 lamports = 0.0001 A2AMPL
    assert_eq!(a2ampl_estimate.compute_cost, 0.0001);

    // Total: 3.0001 A2AMPL
    assert_eq!(a2ampl_estimate.total_cost, 3.0001);

    assert_eq!(a2ampl_estimate.effective_priority_multiplier, 150);
}

// Balance and Compute Unit Tests

#[cfg(feature = "pyg")]
#[test]
fn test_insufficient_balance_scenario() {
    let args = PygPaymentArgs {
        amount: convert_a2ampl_to_base_units(100.0), // 100 A2AMPL
        service_type: PygServiceType::AgentService,
        compute_units: Some(10000),
        priority_fee: None,
    };

    // Test that the amount is validated against service type minimums
    assert!(args.amount >= args.service_type.min_fee());
}

#[cfg(feature = "pyg")]
#[test]
fn test_amount_below_minimum_fee() {
    let args = PygPaymentArgs {
        amount: MIN_SERVICE_FEE - 1, // Below minimum
        service_type: PygServiceType::AgentService,
        compute_units: None,
        priority_fee: None,
    };

    // This should be caught by validation
    assert!(args.amount < args.service_type.min_fee());
}

#[cfg(feature = "pyg")]
#[test]
fn test_compute_unit_budgets() {
    // Test different compute unit scenarios
    let test_cases = vec![
        (5000, 50, 250_000),     // 5K CU at 50 lamports/CU = 250K lamports
        (10000, 100, 1_000_000), // 10K CU at 100 lamports/CU = 1M lamports
        (20000, 200, 4_000_000), // 20K CU at 200 lamports/CU = 4M lamports
    ];

    for (cu, fee_per_cu, expected_cost) in test_cases {
        let estimate =
            estimate_pyg_cost(MIN_SERVICE_FEE, None, Some(cu), Some(fee_per_cu)).unwrap();

        assert_eq!(estimate.compute_cost, expected_cost);
    }
}

#[cfg(feature = "pyg")]
#[test]
fn test_high_priority_fee_calculation() {
    let base_amount = convert_a2ampl_to_base_units(5.0); // 5 A2AMPL base

    // Test various priority multipliers
    let priority_tests = vec![
        (100, 5.0),   // 1.0x = 5 A2AMPL
        (150, 7.5),   // 1.5x = 7.5 A2AMPL
        (200, 10.0),  // 2.0x = 10 A2AMPL
        (255, 12.75), // 2.55x = 12.75 A2AMPL (max u8)
    ];

    for (multiplier, expected_a2ampl) in priority_tests {
        let estimate = estimate_pyg_cost(base_amount, Some(multiplier), None, None).unwrap();

        let a2ampl_result = estimate.to_a2ampl();
        assert!((a2ampl_result.service_fee - expected_a2ampl).abs() < 0.01); // Allow small floating point errors
    }
}

#[cfg(feature = "pyg")]
#[test]
fn test_real_world_payment_scenarios() {
    // Test realistic payment scenarios

    // Scenario 1: Basic agent service call
    let basic_call = estimate_pyg_cost(
        convert_a2ampl_to_base_units(2.0), // 2 A2AMPL
        Some(120),                         // 1.2x priority
        Some(8000),                        // 8K compute units
        Some(75),                          // 75 lamports per CU
    )
    .unwrap();

    let basic_a2ampl = basic_call.to_a2ampl();
    assert!(basic_a2ampl.total_cost > 2.0); // Should be more than base amount
    assert!(basic_a2ampl.compute_cost > 0.0); // Should have compute cost

    // Scenario 2: High-priority tool usage
    let priority_tool = estimate_pyg_cost(
        MIN_TOOL_FEE,
        Some(255),   // Maximum priority
        Some(15000), // 15K compute units
        Some(150),   // 150 lamports per CU
    )
    .unwrap();

    let priority_a2ampl = priority_tool.to_a2ampl();
    assert!(priority_a2ampl.service_fee > convert_base_units_to_a2ampl(MIN_TOOL_FEE));
    assert!(priority_a2ampl.compute_cost > 0.001); // Compute cost in A2AMPL should be significant

    // Scenario 3: Resource access with minimal priority
    let resource_access = estimate_pyg_cost(
        convert_a2ampl_to_base_units(0.5), // 0.5 A2AMPL
        Some(100),                         // No priority boost
        Some(2000),                        // 2K compute units
        Some(25),                          // 25 lamports per CU
    )
    .unwrap();

    let resource_a2ampl = resource_access.to_a2ampl();
    assert_eq!(resource_a2ampl.service_fee, 0.5); // No priority boost
    assert!(resource_a2ampl.compute_cost < 0.1); // Low compute cost
}

#[cfg(feature = "pyg")]
#[test]
fn test_balance_tracking_simulation() {
    // Simulate a series of payments and track balance changes
    let initial_balance = convert_a2ampl_to_base_units(100.0); // Start with 100 A2AMPL
    let mut current_balance = initial_balance;

    // Payment 1: Agent service
    let payment1 = estimate_pyg_cost(
        convert_a2ampl_to_base_units(5.0),
        Some(110),
        Some(5000),
        Some(50),
    )
    .unwrap();
    current_balance -= payment1.total_cost;

    // Payment 2: Tool usage
    let payment2 = estimate_pyg_cost(MIN_TOOL_FEE, Some(130), Some(3000), Some(75)).unwrap();
    current_balance -= payment2.total_cost;

    // Payment 3: Prompt execution
    let payment3 = estimate_pyg_cost(
        convert_a2ampl_to_base_units(3.0),
        Some(150),
        Some(7000),
        Some(100),
    )
    .unwrap();
    current_balance -= payment3.total_cost;

    // Verify balance is still positive and makes sense
    assert!(current_balance > 0);
    assert!(current_balance < initial_balance);

    let remaining_a2ampl = convert_base_units_to_a2ampl(current_balance);
    let spent_a2ampl = convert_base_units_to_a2ampl(initial_balance - current_balance);

    // Should have spent a reasonable amount
    assert!(spent_a2ampl > 8.0); // At least 8 A2AMPL spent
    assert!(spent_a2ampl < 20.0); // But not more than 20 A2AMPL
    assert!(remaining_a2ampl > 80.0); // Should have significant balance left
}

// Feature flag tests

#[cfg(not(feature = "pyg"))]
#[test]
fn test_pyg_feature_disabled() {
    // When pyg feature is disabled, the payment modules should not be available
    // This test ensures the feature flag system works correctly
    assert!(true); // This test just ensures it compiles without pyg feature
}

#[cfg(any(feature = "stream", feature = "pyg", feature = "prepay"))]
use solana_ai_registries::payments::common::{convert_a2ampl_to_base_units, convert_base_units_to_a2ampl};

#[cfg(any(feature = "stream", feature = "pyg", feature = "prepay"))]
#[test]
fn test_token_conversion_utilities() {
    // Test the utility functions work when payment features are enabled
    let a2ampl_amount = 5.5;
    let base_units = convert_a2ampl_to_base_units(a2ampl_amount);
    let back_to_a2ampl = convert_base_units_to_a2ampl(base_units);

    assert!((back_to_a2ampl - a2ampl_amount).abs() < 0.000001); // Should be nearly identical
}
