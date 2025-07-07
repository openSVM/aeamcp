cmake_minimum_required(VERSION 3.16)

# Find required packages
find_package(PkgConfig REQUIRED)
pkg_check_modules(LIBSODIUM REQUIRED libsodium)

# Example executables
set(EXAMPLES
    basic_usage
    agent_operations
    mcp_operations
    payment_flows
    idl_generation
)

foreach(EXAMPLE ${EXAMPLES})
    add_executable(${EXAMPLE} ${EXAMPLE}.cpp)
    target_link_libraries(${EXAMPLE} 
        aireg++
        ${LIBSODIUM_LIBRARIES}
    )
    set_target_properties(${EXAMPLE} PROPERTIES
        CXX_STANDARD 17
        CXX_STANDARD_REQUIRED ON
    )
endforeach()

# Install examples
install(TARGETS ${EXAMPLES}
    RUNTIME DESTINATION bin/examples
)