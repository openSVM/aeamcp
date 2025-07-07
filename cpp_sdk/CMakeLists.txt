cmake_minimum_required(VERSION 3.16)
project(aireg++ VERSION 1.0.0 LANGUAGES CXX)

# Set C++17 standard
set(CMAKE_CXX_STANDARD 17)
set(CMAKE_CXX_STANDARD_REQUIRED ON)
set(CMAKE_CXX_EXTENSIONS OFF)

# Enable testing
enable_testing()

# Set build type to Release if not specified
if(NOT CMAKE_BUILD_TYPE)
    set(CMAKE_BUILD_TYPE Release)
endif()

# Compiler-specific options
if(CMAKE_CXX_COMPILER_ID STREQUAL "GNU" OR CMAKE_CXX_COMPILER_ID STREQUAL "Clang")
    add_compile_options(-Wall -Wextra -Wpedantic)
    # Only enable -Werror in CI/Release builds
    if(DEFINED ENV{CI} OR CMAKE_BUILD_TYPE STREQUAL "Release")
        add_compile_options(-Werror)
    endif()
    if(CMAKE_BUILD_TYPE STREQUAL "Debug")
        add_compile_options(-g -O0 --coverage)
    endif()
endif()

# Find required packages
find_package(PkgConfig REQUIRED)

# Find libsodium
pkg_check_modules(LIBSODIUM REQUIRED libsodium)

# Include directories
include_directories(${CMAKE_CURRENT_SOURCE_DIR}/include)
include_directories(${LIBSODIUM_INCLUDE_DIRS})

# Header-only library target
add_library(aireg++ INTERFACE)
target_include_directories(aireg++ INTERFACE 
    $<BUILD_INTERFACE:${CMAKE_CURRENT_SOURCE_DIR}/include>
    $<INSTALL_INTERFACE:include>
)
target_compile_features(aireg++ INTERFACE cxx_std_17)
target_link_libraries(aireg++ INTERFACE ${LIBSODIUM_LIBRARIES})

# Implementation library (for non-header-only parts)
add_library(aireg++_impl STATIC
    src/aireg++.cpp
    src/stubs.cpp
)
target_include_directories(aireg++_impl PUBLIC
    $<BUILD_INTERFACE:${CMAKE_CURRENT_SOURCE_DIR}/include>
    $<INSTALL_INTERFACE:include>
)
target_compile_features(aireg++_impl PUBLIC cxx_std_17)
target_link_libraries(aireg++_impl PUBLIC ${LIBSODIUM_LIBRARIES})

# Link the implementation to the interface
target_link_libraries(aireg++ INTERFACE aireg++_impl)

# Add subdirectories
add_subdirectory(tests)
add_subdirectory(examples)

# Custom targets
add_custom_target(test-integration
    COMMAND ${CMAKE_CTEST_COMMAND} -L integration
    COMMENT "Running integration tests"
)

add_custom_target(coverage
    COMMAND gcov -r *.gcno
    COMMAND lcov --capture --directory . --output-file coverage.info
    COMMAND genhtml coverage.info --output-directory coverage_html
    COMMENT "Generating coverage report"
)

add_custom_target(docs
    COMMAND doxygen ${CMAKE_CURRENT_SOURCE_DIR}/docs/Doxyfile
    COMMENT "Generating API documentation"
)

# Install configuration
install(TARGETS aireg++ aireg++_impl EXPORT aireg++Targets)
install(DIRECTORY include/ DESTINATION include)
install(EXPORT aireg++Targets
    FILE aireg++Targets.cmake
    NAMESPACE aireg++::
    DESTINATION lib/cmake/aireg++
)

# Create config file
include(CMakePackageConfigHelpers)
write_basic_package_version_file(
    aireg++ConfigVersion.cmake
    VERSION ${PROJECT_VERSION}
    COMPATIBILITY AnyNewerVersion
)

configure_package_config_file(
    cmake/aireg++Config.cmake.in
    aireg++Config.cmake
    INSTALL_DESTINATION lib/cmake/aireg++
)

install(FILES
    ${CMAKE_CURRENT_BINARY_DIR}/aireg++Config.cmake
    ${CMAKE_CURRENT_BINARY_DIR}/aireg++ConfigVersion.cmake
    DESTINATION lib/cmake/aireg++
)