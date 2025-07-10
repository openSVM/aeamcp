cmake_minimum_required(VERSION 3.16)

# Find Google Test - handle vcpkg on Windows
if(WIN32)
    find_package(GTest CONFIG REQUIRED)
else()
    find_package(GTest REQUIRED)
endif()
include(GoogleTest)

# Create test executable
add_executable(aireg++_tests
    test_main.cpp
    test_common.cpp
    test_base58.cpp
    test_url_validation.cpp
    test_c_sdk_bridge.cpp
    test_client.cpp
    test_agent.cpp
    test_mcp.cpp
    test_payments.cpp
    test_idl.cpp
    test_integration.cpp
)

# Link libraries
target_link_libraries(aireg++_tests
    aireg++
    GTest::gtest
    GTest::gtest_main
    ${LIBSODIUM_LIBRARIES}
)

# Add test properties
set_target_properties(aireg++_tests PROPERTIES
    CXX_STANDARD 17
    CXX_STANDARD_REQUIRED ON
)

# Register tests with CTest
gtest_discover_tests(aireg++_tests)

# Create integration test target
add_test(NAME integration_tests
    COMMAND aireg++_tests --gtest_filter="*Integration*"
)

set_tests_properties(integration_tests PROPERTIES
    LABELS "integration"
    TIMEOUT 300
)