"""
pytest configuration and fixtures.
"""

import asyncio
from typing import Generator

import pytest

# Import compatibility shim before any other imports
import pytest_xprocess_compat  # noqa: F401


@pytest.fixture(scope="session")
def event_loop() -> Generator[asyncio.AbstractEventLoop, None, None]:
    """Create an instance of the default event loop for the test session."""
    loop = asyncio.get_event_loop_policy().new_event_loop()
    yield loop
    loop.close()


@pytest.fixture(autouse=True)
def mock_environment():
    """Set up mock environment variables for testing."""
    import os

    os.environ.setdefault("SOLANA_RPC_URL", "https://api.devnet.solana.com")
    os.environ.setdefault("ANCHOR_WALLET", "/tmp/test-keypair.json")
