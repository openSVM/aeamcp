"""
Compatibility shim for pytest_xprocess to fix anchorpy import issues.
"""
import tempfile
import os

def getrootdir():
    """Compatibility function for pytest_xprocess.getrootdir"""
    return tempfile.gettempdir()

# Mock the entire module structure that anchorpy expects
import sys
from types import ModuleType

# Create a mock pytest_xprocess module with getrootdir
mock_module = ModuleType('pytest_xprocess')
mock_module.getrootdir = getrootdir

# Patch sys.modules to use our mock
sys.modules['pytest_xprocess'] = mock_module