"""
Compatibility shim for pytest_xprocess to fix anchorpy import issues.
This must be imported before any anchorpy imports.
"""

import sys
from types import ModuleType
from typing import Any

# Create the pytest_xprocess module by directly importing from xprocess.pytest_xprocess
try:
    # Import the entire module directly
    import xprocess.pytest_xprocess as pytest_xprocess_module  # isort:skip
    from xprocess.pytest_xprocess import *  # noqa: F401, F403, isort:skip
    # Add it to sys.modules as pytest_xprocess
    sys.modules["pytest_xprocess"] = pytest_xprocess_module

except ImportError:
    # Fallback if xprocess.pytest_xprocess isn't available
    import tempfile

    def getrootdir(config: Any = None) -> str:
        """Compatibility function for pytest_xprocess.getrootdir"""
        return tempfile.gettempdir()

    # Create a minimal mock module
    mock_module = ModuleType("pytest_xprocess")
    mock_module.getrootdir = getrootdir  # type: ignore
    mock_module.__version__ = "1.0.0"  # type: ignore
    mock_module.__file__ = __file__
    sys.modules["pytest_xprocess"] = mock_module
