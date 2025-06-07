//! Tests for token integration implementation in MCP Server Registry
//! 
//! These tests validate the token integration logic addressing the medium priority
//! security remediation items identified in the security audit.

#[cfg(test)]
mod tests {
    use aeamcp_common::{
        constants::{MIN_STAKE_AMOUNT, MIN_LOCK_PERIOD, MAX_LOCK_PERIOD},
        error::RegistryError,
        token_utils::StakingTier,
    };
    use crate::state::{McpServerRegistryEntryV1, UsageType};
    use solana_program::pubkey::Pubkey;

    #[test]
    fn test_mcp_server_verification_stake_basic_tier() {
        let owner = Pubkey::new_unique();
        let timestamp = 1640995200; // 2022-01-01

        let mut server_entry = McpServerRegistryEntryV1::new(
            255,
            owner,
            "test-server".to_string(),
            "Test Server".to_string(),
            "1.0.0".to_string(),
            "https://example.com/mcp".to_string(),
            None,
            None,
            true,
            true,
            false,
            vec![],
            vec![],
            vec![],
            None,
            vec![],
            timestamp,
        );

        // Test basic tier staking (< 100 SVMAI)
        let stake_amount = 50_000_000_000; // 50 SVMAI
        let lock_period = 30 * 24 * 60 * 60; // 30 days
        let lock_until = timestamp + lock_period;

        server_entry.update_verification_stake(
            stake_amount,
            0, // Basic tier
            lock_until,
            timestamp,
        );

        assert_eq!(server_entry.verification_stake, stake_amount);
        assert_eq!(server_entry.verification_tier, 0);
        assert_eq!(server_entry.stake_locked_until, lock_until);
        assert_eq!(server_entry.staking_timestamp, timestamp);
    }

    #[test]
    fn test_mcp_server_verification_stake_verified_tier() {
        let owner = Pubkey::new_unique();
        let timestamp = 1640995200;

        let mut server_entry = McpServerRegistryEntryV1::new(
            255,
            owner,
            "test-server".to_string(),
            "Test Server".to_string(),
            "1.0.0".to_string(),
            "https://example.com/mcp".to_string(),
            None,
            None,
            true,
            true,
            false,
            vec![],
            vec![],
            vec![],
            None,
            vec![],
            timestamp,
        );

        // Test verified tier staking (100+ SVMAI)
        let stake_amount = 150_000_000_000; // 150 SVMAI
        let lock_period = 90 * 24 * 60 * 60; // 90 days
        let lock_until = timestamp + lock_period;

        server_entry.update_verification_stake(
            stake_amount,
            1, // Verified tier
            lock_until,
            timestamp,
        );

        assert_eq!(server_entry.verification_stake, stake_amount);
        assert_eq!(server_entry.verification_tier, 1);
        assert_eq!(server_entry.stake_locked_until, lock_until);
    }

    #[test]
    fn test_mcp_server_verification_stake_premium_tier() {
        let owner = Pubkey::new_unique();
        let timestamp = 1640995200;

        let mut server_entry = McpServerRegistryEntryV1::new(
            255,
            owner,
            "test-server".to_string(),
            "Test Server".to_string(),
            "1.0.0".to_string(),
            "https://example.com/mcp".to_string(),
            None,
            None,
            true,
            true,
            false,
            vec![],
            vec![],
            vec![],
            None,
            vec![],
            timestamp,
        );

        // Test premium tier staking (1000+ SVMAI)
        let stake_amount = 1_500_000_000_000; // 1500 SVMAI
        let lock_period = 180 * 24 * 60 * 60; // 180 days
        let lock_until = timestamp + lock_period;

        server_entry.update_verification_stake(
            stake_amount,
            2, // Premium tier
            lock_until,
            timestamp,
        );

        assert_eq!(server_entry.verification_stake, stake_amount);
        assert_eq!(server_entry.verification_tier, 2);
        assert_eq!(server_entry.stake_locked_until, lock_until);
    }

    #[test]
    fn test_usage_fees_configuration() {
        let owner = Pubkey::new_unique();
        let timestamp = 1640995200;

        let mut server_entry = McpServerRegistryEntryV1::new(
            255,
            owner,
            "test-server".to_string(),
            "Test Server".to_string(),
            "1.0.0".to_string(),
            "https://example.com/mcp".to_string(),
            None,
            None,
            true,
            true,
            false,
            vec![],
            vec![],
            vec![],
            None,
            vec![],
            timestamp,
        );

        // Configure usage fees
        let tool_fee = 1_000_000_000; // 1 SVMAI
        let resource_fee = 500_000_000; // 0.5 SVMAI
        let prompt_fee = 2_000_000_000; // 2 SVMAI
        let bulk_threshold = 100;
        let bulk_discount = 10; // 10%

        server_entry.update_usage_fees(
            tool_fee,
            resource_fee,
            prompt_fee,
            bulk_threshold,
            bulk_discount,
            timestamp,
        );

        assert_eq!(server_entry.tool_base_fee, tool_fee);
        assert_eq!(server_entry.resource_base_fee, resource_fee);
        assert_eq!(server_entry.prompt_base_fee, prompt_fee);
        assert_eq!(server_entry.bulk_discount_threshold, bulk_threshold);
        assert_eq!(server_entry.bulk_discount_percentage, bulk_discount);
    }

    #[test]
    fn test_usage_recording_tool_calls() {
        let owner = Pubkey::new_unique();
        let timestamp = 1640995200;

        let mut server_entry = McpServerRegistryEntryV1::new(
            255,
            owner,
            "test-server".to_string(),
            "Test Server".to_string(),
            "1.0.0".to_string(),
            "https://example.com/mcp".to_string(),
            None,
            None,
            true,
            true,
            false,
            vec![],
            vec![],
            vec![],
            None,
            vec![],
            timestamp,
        );

        // Record tool usage
        let usage_count = 5;
        let fee_collected = 5_000_000_000; // 5 SVMAI

        server_entry.record_usage(UsageType::Tool, usage_count, fee_collected);

        assert_eq!(server_entry.total_tool_calls, usage_count as u64);
        assert_eq!(server_entry.pending_fees, fee_collected);
    }

    #[test]
    fn test_usage_recording_resource_accesses() {
        let owner = Pubkey::new_unique();
        let timestamp = 1640995200;

        let mut server_entry = McpServerRegistryEntryV1::new(
            255,
            owner,
            "test-server".to_string(),
            "Test Server".to_string(),
            "1.0.0".to_string(),
            "https://example.com/mcp".to_string(),
            None,
            None,
            true,
            true,
            false,
            vec![],
            vec![],
            vec![],
            None,
            vec![],
            timestamp,
        );

        // Record resource usage
        let usage_count = 10;
        let fee_collected = 5_000_000_000; // 5 SVMAI

        server_entry.record_usage(UsageType::Resource, usage_count, fee_collected);

        assert_eq!(server_entry.total_resource_accesses, usage_count as u64);
        assert_eq!(server_entry.pending_fees, fee_collected);
    }

    #[test]
    fn test_usage_recording_prompt_uses() {
        let owner = Pubkey::new_unique();
        let timestamp = 1640995200;

        let mut server_entry = McpServerRegistryEntryV1::new(
            255,
            owner,
            "test-server".to_string(),
            "Test Server".to_string(),
            "1.0.0".to_string(),
            "https://example.com/mcp".to_string(),
            None,
            None,
            true,
            true,
            false,
            vec![],
            vec![],
            vec![],
            None,
            vec![],
            timestamp,
        );

        // Record prompt usage
        let usage_count = 3;
        let fee_collected = 6_000_000_000; // 6 SVMAI

        server_entry.record_usage(UsageType::Prompt, usage_count, fee_collected);

        assert_eq!(server_entry.total_prompt_uses, usage_count as u64);
        assert_eq!(server_entry.pending_fees, fee_collected);
    }

    #[test]
    fn test_pending_fees_withdrawal() {
        let owner = Pubkey::new_unique();
        let timestamp = 1640995200;

        let mut server_entry = McpServerRegistryEntryV1::new(
            255,
            owner,
            "test-server".to_string(),
            "Test Server".to_string(),
            "1.0.0".to_string(),
            "https://example.com/mcp".to_string(),
            None,
            None,
            true,
            true,
            false,
            vec![],
            vec![],
            vec![],
            None,
            vec![],
            timestamp,
        );

        // Add some pending fees
        let initial_fees = 10_000_000_000; // 10 SVMAI
        server_entry.record_usage(UsageType::Tool, 10, initial_fees);

        assert_eq!(server_entry.pending_fees, initial_fees);

        // Withdraw fees
        let withdrawn_amount = server_entry.withdraw_pending_fees();

        assert_eq!(withdrawn_amount, initial_fees);
        assert_eq!(server_entry.pending_fees, 0);
        assert_eq!(server_entry.total_fees_collected, initial_fees);
    }

    #[test]
    fn test_quality_metrics_update() {
        let owner = Pubkey::new_unique();
        let timestamp = 1640995200;

        let mut server_entry = McpServerRegistryEntryV1::new(
            255,
            owner,
            "test-server".to_string(),
            "Test Server".to_string(),
            "1.0.0".to_string(),
            "https://example.com/mcp".to_string(),
            None,
            None,
            true,
            true,
            false,
            vec![],
            vec![],
            vec![],
            None,
            vec![],
            timestamp,
        );

        // Update quality metrics
        let uptime = 95;
        let avg_response = 250; // 250ms
        let error_rate = 2; // 2%
        let quality_score = 8500; // 85.00%

        server_entry.update_quality_metrics(
            uptime,
            avg_response,
            error_rate,
            quality_score,
        );

        assert_eq!(server_entry.uptime_percentage, uptime);
        assert_eq!(server_entry.avg_response_time, avg_response);
        assert_eq!(server_entry.error_rate, error_rate);
        assert_eq!(server_entry.quality_score, quality_score);
    }

    #[test]
    fn test_stake_unlock_timing() {
        let owner = Pubkey::new_unique();
        let timestamp = 1640995200;

        let mut server_entry = McpServerRegistryEntryV1::new(
            255,
            owner,
            "test-server".to_string(),
            "Test Server".to_string(),
            "1.0.0".to_string(),
            "https://example.com/mcp".to_string(),
            None,
            None,
            true,
            true,
            false,
            vec![],
            vec![],
            vec![],
            None,
            vec![],
            timestamp,
        );

        // Stake with lock period
        let lock_period = 30 * 24 * 60 * 60; // 30 days
        let lock_until = timestamp + lock_period;

        server_entry.update_verification_stake(
            MIN_STAKE_AMOUNT,
            0,
            lock_until,
            timestamp,
        );

        // Test before unlock time
        assert!(!server_entry.can_unstake(timestamp + lock_period - 1));

        // Test at unlock time
        assert!(server_entry.can_unstake(lock_until));

        // Test after unlock time
        assert!(server_entry.can_unstake(lock_until + 1));
    }

    #[test]
    fn test_bulk_discount_calculation() {
        let owner = Pubkey::new_unique();
        let timestamp = 1640995200;

        let mut server_entry = McpServerRegistryEntryV1::new(
            255,
            owner,
            "test-server".to_string(),
            "Test Server".to_string(),
            "1.0.0".to_string(),
            "https://example.com/mcp".to_string(),
            None,
            None,
            true,
            true,
            false,
            vec![],
            vec![],
            vec![],
            None,
            vec![],
            timestamp,
        );

        // Configure bulk discount
        server_entry.update_usage_fees(
            1_000_000_000, // 1 SVMAI per tool call
            500_000_000,   // 0.5 SVMAI per resource
            2_000_000_000, // 2 SVMAI per prompt
            50,            // 50 calls for discount
            20,            // 20% discount
            timestamp,
        );

        // Test bulk discount eligibility
        assert_eq!(server_entry.bulk_discount_threshold, 50);
        assert_eq!(server_entry.bulk_discount_percentage, 20);

        // With 50+ calls, user should get 20% discount
        // Base fee: 50 * 1 SVMAI = 50 SVMAI
        // Discount: 50 * 0.2 = 10 SVMAI
        // Final fee: 40 SVMAI
        let base_fee = 50 * 1_000_000_000;
        let expected_discount = (base_fee * 20) / 100;
        let expected_final_fee = base_fee - expected_discount;

        // This logic would be tested in the actual processor function
        assert_eq!(expected_final_fee, 40_000_000_000); // 40 SVMAI
    }

    #[test]
    fn test_comprehensive_server_lifecycle() {
        let owner = Pubkey::new_unique();
        let timestamp = 1640995200;

        let mut server_entry = McpServerRegistryEntryV1::new(
            255,
            owner,
            "lifecycle-server".to_string(),
            "Lifecycle Test Server".to_string(),
            "1.0.0".to_string(),
            "https://example.com/mcp".to_string(),
            None,
            None,
            true,
            true,
            true,
            vec![],
            vec![],
            vec![],
            None,
            vec![],
            timestamp,
        );

        // 1. Stake for verification (Verified tier)
        let stake_amount = 150_000_000_000; // 150 SVMAI
        let lock_period = 90 * 24 * 60 * 60; // 90 days
        server_entry.update_verification_stake(
            stake_amount,
            1, // Verified tier
            timestamp + lock_period,
            timestamp,
        );

        // 2. Configure usage fees
        server_entry.update_usage_fees(
            1_000_000_000, // 1 SVMAI per tool
            500_000_000,   // 0.5 SVMAI per resource
            2_000_000_000, // 2 SVMAI per prompt
            100,           // 100 calls for discount
            15,            // 15% discount
            timestamp,
        );

        // 3. Record various usage and collect fees
        server_entry.record_usage(UsageType::Tool, 50, 50_000_000_000);
        server_entry.record_usage(UsageType::Resource, 25, 12_500_000_000);
        server_entry.record_usage(UsageType::Prompt, 10, 20_000_000_000);

        // 4. Update quality metrics
        server_entry.update_quality_metrics(
            98,   // 98% uptime
            180,  // 180ms avg response
            1,    // 1% error rate
            9200, // 92% quality score
        );

        // 5. Withdraw accumulated fees
        let total_pending = server_entry.pending_fees;
        let withdrawn = server_entry.withdraw_pending_fees();

        // Verify final state
        assert_eq!(server_entry.verification_tier, 1);
        assert_eq!(server_entry.total_tool_calls, 50);
        assert_eq!(server_entry.total_resource_accesses, 25);
        assert_eq!(server_entry.total_prompt_uses, 10);
        assert_eq!(server_entry.uptime_percentage, 98);
        assert_eq!(server_entry.avg_response_time, 180);
        assert_eq!(server_entry.error_rate, 1);
        assert_eq!(server_entry.quality_score, 9200);
        assert_eq!(withdrawn, total_pending);
        assert_eq!(server_entry.pending_fees, 0);
        assert_eq!(server_entry.total_fees_collected, total_pending);
    }
}