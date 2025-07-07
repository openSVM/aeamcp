/**
 * @file test_payments.cpp
 * @brief Tests for the Payments class
 */

#include <gtest/gtest.h>
#include <aireg++/payments.hpp>
#include <aireg++/client.hpp>

using namespace SolanaAiRegistries;

class PaymentsTest : public ::testing::Test {
protected:
    void SetUp() override {
        ClientConfig config;
        config.cluster = Cluster::Devnet;
        client_ = std::make_unique<Client>(config);
        payments_ = std::make_unique<Payments>(*client_);
    }
    
    void TearDown() override {}
    
    std::unique_ptr<Client> client_;
    std::unique_ptr<Payments> payments_;
};

TEST_F(PaymentsTest, PaymentMethodConversion) {
    EXPECT_EQ(Payments::payment_method_to_string(PaymentMethod::Sol), "Sol");
    EXPECT_EQ(Payments::payment_method_to_string(PaymentMethod::SvmaiToken), "SvmaiToken");
    EXPECT_EQ(Payments::payment_method_to_string(PaymentMethod::Usdc), "Usdc");
    
    EXPECT_EQ(Payments::string_to_payment_method("Sol"), PaymentMethod::Sol);
    EXPECT_EQ(Payments::string_to_payment_method("SvmaiToken"), PaymentMethod::SvmaiToken);
    
    EXPECT_THROW(Payments::string_to_payment_method("InvalidMethod"), std::invalid_argument);
}

TEST_F(PaymentsTest, PaymentStatusConversion) {
    EXPECT_EQ(Payments::payment_status_to_string(PaymentStatus::Pending), "Pending");
    EXPECT_EQ(Payments::payment_status_to_string(PaymentStatus::Completed), "Completed");
    EXPECT_EQ(Payments::payment_status_to_string(PaymentStatus::Failed), "Failed");
}

TEST_F(PaymentsTest, PaymentTypeConversion) {
    EXPECT_EQ(Payments::payment_type_to_string(PaymentType::Prepay), "Prepay");
    EXPECT_EQ(Payments::payment_type_to_string(PaymentType::PayAsYouGo), "PayAsYouGo");
    EXPECT_EQ(Payments::payment_type_to_string(PaymentType::Subscription), "Subscription");
    EXPECT_EQ(Payments::payment_type_to_string(PaymentType::Stream), "Stream");
}

TEST_F(PaymentsTest, PrepayParameterValidation) {
    PrepayParams params;
    params.recipient = PublicKey("11111111111111111111111111111112");
    params.amount = 1000000; // 1 SOL in lamports
    params.method = PaymentMethod::Sol;
    
    // Valid parameters should not throw
    EXPECT_NO_THROW(Payments::validate_prepay_params(params));
    
    // Invalid parameters should throw
    params.amount = 0; // Zero amount
    EXPECT_THROW(Payments::validate_prepay_params(params), std::invalid_argument);
    
    params.amount = 1000000;
    params.method = PaymentMethod::Custom;
    // Custom method without token mint
    EXPECT_THROW(Payments::validate_prepay_params(params), std::invalid_argument);
}

TEST_F(PaymentsTest, PayAsYouGoParameterValidation) {
    PayAsYouGoParams params;
    params.service_provider = PublicKey("11111111111111111111111111111112");
    params.amount_per_request = 1000;
    params.method = PaymentMethod::Sol;
    
    // Valid parameters should not throw
    EXPECT_NO_THROW(Payments::validate_pay_as_you_go_params(params));
    
    // Invalid parameters should throw
    params.amount_per_request = 0; // Zero amount
    EXPECT_THROW(Payments::validate_pay_as_you_go_params(params), std::invalid_argument);
}

TEST_F(PaymentsTest, SubscriptionParameterValidation) {
    SubscriptionParams params;
    params.service_provider = PublicKey("11111111111111111111111111111112");
    params.amount_per_period = 1000000;
    params.billing_period = std::chrono::seconds{86400}; // 1 day
    params.method = PaymentMethod::Sol;
    
    // Valid parameters should not throw
    EXPECT_NO_THROW(Payments::validate_subscription_params(params));
    
    // Invalid parameters should throw
    params.billing_period = std::chrono::seconds{0}; // Zero period
    EXPECT_THROW(Payments::validate_subscription_params(params), std::invalid_argument);
}

TEST_F(PaymentsTest, StreamParameterValidation) {
    StreamParams params;
    params.recipient = PublicKey("11111111111111111111111111111112");
    params.rate_per_second = 100;
    params.duration = std::chrono::seconds{3600}; // 1 hour
    params.method = PaymentMethod::Sol;
    
    // Valid parameters should not throw
    EXPECT_NO_THROW(Payments::validate_stream_params(params));
    
    // Invalid parameters should throw
    params.rate_per_second = 0; // Zero rate
    EXPECT_THROW(Payments::validate_stream_params(params), std::invalid_argument);
}

TEST_F(PaymentsTest, FeeEstimation) {
    EXPECT_NO_THROW({
        uint64_t fee = payments_->estimate_payment_fee(PaymentMethod::Sol, 1000000);
        EXPECT_GT(fee, 0);
    });
}

TEST_F(PaymentsTest, BalanceQuery) {
    PublicKey account("11111111111111111111111111111112");
    
    EXPECT_NO_THROW({
        BalanceInfo balance = payments_->get_balance(account, PaymentMethod::Sol);
        EXPECT_EQ(balance.method, PaymentMethod::Sol);
        EXPECT_TRUE(balance.is_native);
    });
}
