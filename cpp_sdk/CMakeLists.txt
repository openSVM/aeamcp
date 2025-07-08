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

# Sanitizer options
option(ENABLE_SANITIZERS "Enable sanitizers (AddressSanitizer, UBSanitizer)" OFF)
option(ENABLE_VALGRIND "Enable Valgrind support" OFF)

# Compiler-specific options
if(CMAKE_CXX_COMPILER_ID STREQUAL "GNU" OR CMAKE_CXX_COMPILER_ID STREQUAL "Clang")
    add_compile_options(-Wall -Wextra -Wpedantic)
    # Only enable -Werror in CI/Release builds
    if(DEFINED ENV{CI} OR CMAKE_BUILD_TYPE STREQUAL "Release")
        add_compile_options(-Werror)
    endif()
    if(CMAKE_BUILD_TYPE STREQUAL "Debug")
        add_compile_options(-g -O0 --coverage)
        add_link_options(--coverage)
    endif()
    
    # Enable sanitizers if requested
    if(ENABLE_SANITIZERS)
        add_compile_options(-fsanitize=address,undefined -fno-omit-frame-pointer)
        add_link_options(-fsanitize=address,undefined)
    endif()
endif()

# Valgrind support
if(ENABLE_VALGRIND)
    find_program(VALGRIND_EXECUTABLE valgrind)
    if(VALGRIND_EXECUTABLE)
        set(VALGRIND_ARGS --tool=memcheck --leak-check=full --error-exitcode=1)
        message(STATUS "Valgrind found: ${VALGRIND_EXECUTABLE}")
    else()
        message(WARNING "Valgrind not found, but ENABLE_VALGRIND is ON")
    endif()
endif()

# Find required packages
find_package(PkgConfig)

# Find libsodium
if(PkgConfig_FOUND)
    pkg_check_modules(LIBSODIUM libsodium)
    if(LIBSODIUM_FOUND)
        message(STATUS "Found libsodium via pkg-config: ${LIBSODIUM_LIBRARIES}")
    endif()
endif()

# Fallback for systems without pkg-config or if libsodium is not found via pkg-config
if(NOT LIBSODIUM_FOUND)
    # Add macOS brew paths
    if(APPLE)
        # Try to find brew prefix
        execute_process(
            COMMAND brew --prefix
            OUTPUT_VARIABLE BREW_PREFIX
            OUTPUT_STRIP_TRAILING_WHITESPACE
            ERROR_QUIET
        )
        if(BREW_PREFIX)
            list(APPEND CMAKE_PREFIX_PATH ${BREW_PREFIX})
        endif()
    endif()
    
    find_path(LIBSODIUM_INCLUDE_DIR sodium.h
        PATHS /usr/include /usr/local/include /opt/local/include /opt/homebrew/include
              ${CMAKE_PREFIX_PATH}/include
        PATH_SUFFIXES sodium
    )
    
    find_library(LIBSODIUM_LIBRARY
        NAMES sodium libsodium
        PATHS /usr/lib /usr/local/lib /opt/local/lib /opt/homebrew/lib
              ${CMAKE_PREFIX_PATH}/lib
    )
    
    if(LIBSODIUM_INCLUDE_DIR AND LIBSODIUM_LIBRARY)
        set(LIBSODIUM_FOUND TRUE)
        set(LIBSODIUM_INCLUDE_DIRS ${LIBSODIUM_INCLUDE_DIR})
        set(LIBSODIUM_LIBRARIES ${LIBSODIUM_LIBRARY})
        message(STATUS "Found libsodium: ${LIBSODIUM_LIBRARY}")
    endif()
endif()

if(NOT LIBSODIUM_FOUND)
    message(FATAL_ERROR "libsodium not found! Please install libsodium development package.")
endif()

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
    src/c_sdk_impl.cpp
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
    COMMAND ${CMAKE_COMMAND} -E make_directory docs/doxygen
    COMMAND doxygen ${CMAKE_CURRENT_SOURCE_DIR}/docs/Doxyfile
    COMMENT "Generating API documentation"
)

# Memory safety targets
if(ENABLE_SANITIZERS)
    add_custom_target(test-sanitizers
        COMMAND ${CMAKE_CTEST_COMMAND} --verbose
        COMMENT "Running tests with sanitizers"
    )
endif()

if(ENABLE_VALGRIND AND VALGRIND_EXECUTABLE)
    add_custom_target(test-valgrind
        COMMAND ${VALGRIND_EXECUTABLE} ${VALGRIND_ARGS} $<TARGET_FILE:aireg++_tests>
        COMMENT "Running tests with Valgrind"
        DEPENDS aireg++_tests
    )
endif()

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