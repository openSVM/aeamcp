/**
 * @file payment_flows.cpp
 * @brief Example demonstrating payment processing flows
 */

#include <aireg++/aireg++.hpp>
#include <iostream>

using namespace SolanaAiRegistries;

int main() {
    try {
        initialize();
        
        ClientConfig config;
        config.cluster = Cluster::Devnet;
        Client client(config);
        Payments payments(client);
        
        std::cout << "Payment Flows Example" << std::endl;
        std::cout << "====================" << std::endl;
        
        // Test payment method conversions
        std::cout << "\n1. Testing payment method conversions..." << std::endl;
        std::cout << "SOL: " << Payments::payment_method_to_string(PaymentMethod::Sol) << std::endl;
        std::cout << "SVMAI Token: " << Payments::payment_method_to_string(PaymentMethod::SvmaiToken) << std::endl;
        std::cout << "USDC: " << Payments::payment_method_to_string(PaymentMethod::Usdc) << std::endl;
        
        // Test payment status conversions
        std::cout << "\n2. Testing payment status conversions..." << std::endl;
        std::cout << "Pending: " << Payments::payment_status_to_string(PaymentStatus::Pending) << std::endl;
        std::cout << "Completed: " << Payments::payment_status_to_string(PaymentStatus::Completed) << std::endl;
        std::cout << "Failed: " << Payments::payment_status_to_string(PaymentStatus::Failed) << std::endl;
        
        // Test fee estimation
        std::cout << "\n3. Testing fee estimation..." << std::endl;
        uint64_t fee = payments.estimate_payment_fee(PaymentMethod::Sol, 1000000);
        std::cout << "Estimated fee for 1 SOL payment: " << fee << " lamports" << std::endl;
        
        std::cout << "\nPayment flows example completed successfully!" << std::endl;
        
    } catch (const std::exception& e) {
        std::cerr << "Error: " << e.what() << std::endl;
        return 1;
    }
    
    cleanup();
    return 0;
}