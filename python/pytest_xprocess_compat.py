"""
Compatibility shim for pytest_xprocess to fix anchorpy import issues.
This must be imported before any anchorpy imports.
"""

import os
import sys
import tempfile
from types import ModuleType


def getrootdir():
    """Compatibility function for pytest_xprocess.getrootdir"""
    return tempfile.gettempdir()


# Create a comprehensive mock pytest_xprocess module
mock_module = ModuleType("pytest_xprocess")
mock_module.getrootdir = getrootdir

# Add other commonly expected attributes to avoid import errors
mock_module.__version__ = "1.0.0"
mock_module.__file__ = __file__

# Patch sys.modules early to prevent import errors
sys.modules["pytest_xprocess"] = mock_module

# Also create a mock for any submodules that might be imported
sys.modules["pytest_xprocess.main"] = mock_module
