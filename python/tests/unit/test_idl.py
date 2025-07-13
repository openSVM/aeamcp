"""Tests for solana_ai_registries.idl module."""

import pytest
from unittest.mock import Mock, patch

from solana_ai_registries.idl import IDLLoader, ParsedIdl


class TestIDLLoader:
    """Test the IDLLoader class."""

    def setup_method(self):
        """Set up test fixtures."""
        self.idl_loader = IDLLoader()

    def test_init(self):
        """Test IDLLoader initialization."""
        assert hasattr(self.idl_loader, '_cached_idls')
        assert hasattr(self.idl_loader, '_generated_types')
        assert isinstance(self.idl_loader._cached_idls, dict)
        assert isinstance(self.idl_loader._generated_types, dict)

    def test_idl_loader_has_required_methods(self):
        """Test that IDLLoader has the expected methods."""
        assert hasattr(self.idl_loader, 'load_idl')
        assert hasattr(self.idl_loader, 'generate_types')

    def test_cache_functionality(self):
        """Test IDL caching."""
        program_name = "test_cache"
        
        # Initially not cached
        assert program_name not in self.idl_loader._cached_idls
        
        # Can add to cache
        mock_idl = ParsedIdl(
            version="0.1.0", name=program_name,
            instructions=[], accounts=[], types=[], errors=[], metadata={}
        )
        self.idl_loader._cached_idls[program_name] = mock_idl
        
        assert program_name in self.idl_loader._cached_idls
        assert self.idl_loader._cached_idls[program_name] == mock_idl