"""
pytest configuration and fixtures.
"""

import asyncio
from typing import Generator

import pytest

# Import compatibility shim before any other imports
import pytest_xprocess_compat  # noqa: F401


@pytest.fixture(scope="session")  # type: ignore[misc]
def event_loop() -> Generator[asyncio.AbstractEventLoop, None, None]:
    """Create an instance of the default event loop for the test session."""
    # Create a new event loop policy to avoid conflicts
    policy = asyncio.get_event_loop_policy()
    loop = policy.new_event_loop()
    asyncio.set_event_loop(loop)

    try:
        yield loop
    finally:
        # Ensure we close the loop properly, handling any pending tasks
        try:
            # Cancel all pending tasks
            pending = asyncio.all_tasks(loop)
            for task in pending:
                task.cancel()

            # Wait for all tasks to complete or be cancelled
            if pending:
                loop.run_until_complete(
                    asyncio.gather(*pending, return_exceptions=True)
                )
        except Exception as e:
            # Log errors but don't fail tests due to cleanup issues
            print(f"Warning: Event loop cleanup error: {e}")
        finally:
            if not loop.is_closed():
                loop.close()


@pytest.fixture(autouse=True)  # type: ignore[misc]
def mock_environment() -> None:
    """Set up mock environment variables for testing."""
    import os

    os.environ.setdefault("SOLANA_RPC_URL", "https://api.devnet.solana.com")
    os.environ.setdefault("ANCHOR_WALLET", "/tmp/test-keypair.json")
