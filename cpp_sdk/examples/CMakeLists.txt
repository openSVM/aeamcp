cmake_minimum_required(VERSION 3.16)

# Find required packages - handle Windows/vcpkg differently
if(WIN32)
    # On Windows, vcpkg should provide libsodium via find_package
    find_package(unofficial-sodium CONFIG QUIET)
    if(unofficial-sodium_FOUND)
        set(LIBSODIUM_FOUND TRUE)
        set(LIBSODIUM_LIBRARIES unofficial-sodium::sodium)
        message(STATUS "Found libsodium via vcpkg for examples")
    else()
        message(WARNING "libsodium not found via vcpkg. Trying fallback...")
        # Fallback for Windows if vcpkg doesn't work
        find_path(LIBSODIUM_INCLUDE_DIR sodium.h)
        find_library(LIBSODIUM_LIBRARY NAMES sodium libsodium)
        if(LIBSODIUM_INCLUDE_DIR AND LIBSODIUM_LIBRARY)
            set(LIBSODIUM_FOUND TRUE)
            set(LIBSODIUM_LIBRARIES ${LIBSODIUM_LIBRARY})
            set(LIBSODIUM_INCLUDE_DIRS ${LIBSODIUM_INCLUDE_DIR})
            message(STATUS "Found libsodium via fallback: ${LIBSODIUM_LIBRARY}")
        else()
            message(FATAL_ERROR "libsodium not found. Please install with: vcpkg install libsodium:x64-windows")
        endif()
    endif()
else()
    # Unix systems: use pkg-config
    find_package(PkgConfig REQUIRED)
    pkg_check_modules(LIBSODIUM REQUIRED libsodium)
endif()

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
    
    # Add include directories for Windows fallback
    if(WIN32 AND LIBSODIUM_INCLUDE_DIRS)
        target_include_directories(${EXAMPLE} PRIVATE ${LIBSODIUM_INCLUDE_DIRS})
    endif()
    
    set_target_properties(${EXAMPLE} PROPERTIES
        CXX_STANDARD 17
        CXX_STANDARD_REQUIRED ON
    )
endforeach()

# Install examples
install(TARGETS ${EXAMPLES}
    RUNTIME DESTINATION bin/examples
)