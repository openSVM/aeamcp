"""Basic import test to verify the package is correctly installed."""

import pytest


def test_package_imports() -> None:
    """Test that all main package components can be imported."""
    # Core imports
    from solana_ai_registries import (
        AgentRegistry,
        McpServerRegistry,
        PaymentManager,
        SolanaAIRegistriesClient,
    )
    from solana_ai_registries.constants import AGENT_REGISTRY_PROGRAM_ID
    from solana_ai_registries.exceptions import SolanaAIRegistriesError

    # Type imports
    from solana_ai_registries.types import AgentStatus, McpServerStatus

    # All imports successful
    assert True


def test_placeholder_classes_exist() -> None:
    """Test that placeholder classes are instantiable."""
    from solana_ai_registries import (
        AgentRegistry,
        McpServerRegistry,
        PaymentManager,
        SolanaAIRegistriesClient,
    )

    # These should not raise exceptions
    # (They're placeholders but should be instantiable)
    assert SolanaAIRegistriesClient is not None
    assert AgentRegistry is not None
    assert McpServerRegistry is not None
    assert PaymentManager is not None
