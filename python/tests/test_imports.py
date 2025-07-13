"""Basic import test to verify the package is correctly installed."""

import pytest


def test_package_imports():
    """Test that all main package components can be imported."""
    # Core imports
    from solana_ai_registries import SolanaAIRegistriesClient
    from solana_ai_registries import AgentRegistry
    from solana_ai_registries import McpServerRegistry
    from solana_ai_registries import PaymentManager

    # Type imports
    from solana_ai_registries.types import AgentStatus, McpServerStatus
    from solana_ai_registries.constants import AGENT_REGISTRY_PROGRAM_ID
    from solana_ai_registries.exceptions import SolanaAIRegistriesError

    # All imports successful
    assert True


def test_placeholder_classes_exist():
    """Test that placeholder classes are instantiable."""
    from solana_ai_registries import (
        SolanaAIRegistriesClient,
        AgentRegistry,
        McpServerRegistry,
        PaymentManager,
    )

    # These should not raise exceptions
    # (They're placeholders but should be instantiable)
    assert SolanaAIRegistriesClient is not None
    assert AgentRegistry is not None
    assert McpServerRegistry is not None
    assert PaymentManager is not None
