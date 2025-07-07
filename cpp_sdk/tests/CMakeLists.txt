cmake_minimum_required(VERSION 3.16)

# Find Google Test
find_package(GTest REQUIRED)
include(GoogleTest)

# Enable coverage if in Debug mode
if(CMAKE_BUILD_TYPE STREQUAL "Debug")
    set(CMAKE_CXX_FLAGS "${CMAKE_CXX_FLAGS} --coverage")
    set(CMAKE_EXE_LINKER_FLAGS "${CMAKE_EXE_LINKER_FLAGS} --coverage")
endif()

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