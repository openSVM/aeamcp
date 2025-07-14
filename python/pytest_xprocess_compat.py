"""
Compatibility shim for pytest_xprocess to fix anchorpy import issues.
This must be imported before any anchorpy imports.
"""

import sys
import tempfile
from types import ModuleType


def getrootdir(config=None) -> str:
    """Compatibility function for pytest_xprocess.getrootdir"""
    return tempfile.gettempdir()


# Try to import the real module from xprocess package structure
try:
    from xprocess.pytest_xprocess import getrootdir as real_getrootdir  # noqa: F401

    # Create module alias for pytest_xprocess at top level
    if "pytest_xprocess" not in sys.modules:
        import xprocess.pytest_xprocess as pytest_xprocess_module

        sys.modules["pytest_xprocess"] = pytest_xprocess_module
except ImportError:
    # If that fails, create a mock module
    if "pytest_xprocess" not in sys.modules:
        mock_module = ModuleType("pytest_xprocess")
        mock_module.getrootdir = getrootdir  # type: ignore
        mock_module.__version__ = "1.0.0"  # type: ignore
        mock_module.__file__ = __file__
        sys.modules["pytest_xprocess"] = mock_module
