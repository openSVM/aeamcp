#!/usr/bin/env python3
"""
Test runner script that ensures pytest_xprocess compatibility.
"""

import os
import sys

# Add current directory to Python path
sys.path.insert(0, os.path.dirname(__file__))

# Import compatibility shim BEFORE importing pytest
import pytest_xprocess_compat  # noqa: F401, E402
import pytest  # noqa: E402

if __name__ == "__main__":
    # Run pytest with the provided arguments
    sys.exit(pytest.main(sys.argv[1:]))
