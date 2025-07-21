"""
Pytest plugin to ensure pytest_xprocess compatibility.
This plugin loads before anchorpy's plugin.
"""

# Import the compatibility shim to register pytest_xprocess module
import pytest_xprocess_compat  # noqa: F401
