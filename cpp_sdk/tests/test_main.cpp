/**
 * @file test_main.cpp
 * @brief Main test file for the C++ SDK
 */

#include <gtest/gtest.h>

#include <aireg++/aireg++.hpp>

int main(int argc, char **argv) {
  ::testing::InitGoogleTest(&argc, argv);

  // Initialize the SDK before running tests
  try {
    SolanaAiRegistries::initialize();
  } catch (const std::exception &e) {
    std::cerr << "Failed to initialize SDK: " << e.what() << std::endl;
    return 1;
  }

  // Run tests
  int result = RUN_ALL_TESTS();

  // Cleanup the SDK
  SolanaAiRegistries::cleanup();

  return result;
}
