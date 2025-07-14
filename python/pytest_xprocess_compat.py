"""
Compatibility shim for pytest_xprocess to fix anchorpy import issues.
This must be imported before any anchorpy imports.
"""

import sys
import tempfile
from types import ModuleType
from typing import Any


def getrootdir(config: Any = None) -> str:
    """Compatibility function for pytest_xprocess.getrootdir"""
    return tempfile.gettempdir()


# Try to import from the new xprocess structure
try:
    import xprocess

    # Create a mock pytest_xprocess module that maps to xprocess functionality
    if "pytest_xprocess" not in sys.modules:
        mock_module = ModuleType("pytest_xprocess")

        # Map the getrootdir function
        if hasattr(xprocess, "getrootdir"):
            mock_module.getrootdir = xprocess.getrootdir  # type: ignore
        else:
            mock_module.getrootdir = getrootdir  # type: ignore

        # Try to find other attributes that might be needed
        if hasattr(xprocess, "__version__"):
            mock_module.__version__ = xprocess.__version__  # type: ignore
        else:
            mock_module.__version__ = "1.0.0"  # type: ignore

        mock_module.__file__ = __file__
        sys.modules["pytest_xprocess"] = mock_module

except ImportError:
    # If xprocess isn't available, create a full mock module
    if "pytest_xprocess" not in sys.modules:
        mock_module = ModuleType("pytest_xprocess")
        mock_module.getrootdir = getrootdir  # type: ignore
        mock_module.__version__ = "1.0.0"  # type: ignore
        mock_module.__file__ = __file__
        sys.modules["pytest_xprocess"] = mock_module
