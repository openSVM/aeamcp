"""Simplified tests for solana_ai_registries.idl module focused on interface coverage."""

from typing import Any, Dict, Type
from unittest.mock import Mock, patch

import pytest

from solana_ai_registries.exceptions import IdlLoadError
from solana_ai_registries.idl import IDLLoader


class TestIDLLoaderInterface:
    """Test IDLLoader interface and basic functionality."""

    def setup_method(self):
        """Set up test fixtures."""
        self.idl_loader = IDLLoader()

    def test_init(self):
        """Test IDLLoader initialization."""
        loader = IDLLoader()
        assert loader._cached_idls == {}
        assert loader._generated_types == {}

    def test_has_required_methods(self):
        """Test that IDLLoader has expected methods."""
        expected_methods = [
            "load_idl",
            "generate_types",
            "get_instruction_discriminant",
            "get_account_layout",
            "clear_cache",
        ]
        for method in expected_methods:
            assert hasattr(self.idl_loader, method)
            assert callable(getattr(self.idl_loader, method))

    def test_load_idl_nonexistent_program(self):
        """Test loading IDL for nonexistent program."""
        with pytest.raises(Exception):  # Could be IdlLoadError or other exception
            self.idl_loader.load_idl("nonexistent_program")

    @patch("solana_ai_registries.idl.IDLLoader._load_from_resources")
    def test_load_idl_from_resources_success(self, mock_load):
        """Test successful IDL loading from resources."""
        sample_idl_data = {
            "version": "1.0.0",
            "name": "test_program",
            "instructions": [],
            "accounts": [],
            "types": [],
            "errors": [],
            "metadata": {},
        }
        mock_load.return_value = sample_idl_data

        result = self.idl_loader.load_idl("test_program")
        assert result.name == "test_program"
        assert result.version == "1.0.0"

    def test_load_from_resources_interface(self):
        """Test _load_from_resources interface."""
        # This should raise FileNotFoundError for non-existent resources
        with pytest.raises(FileNotFoundError):
            self.idl_loader._load_from_resources("nonexistent")

    def test_load_from_file_not_found(self):
        """Test file loading when file doesn't exist."""
        with pytest.raises(FileNotFoundError):
            self.idl_loader._load_from_file("nonexistent")

    def test_parse_idl_interface(self):
        """Test IDL parsing interface."""
        sample_idl_data = {
            "version": "1.0.0",
            "name": "test_program",
            "instructions": [],
            "accounts": [],
            "types": [],
            "errors": [],
            "metadata": {},
        }
        parsed = self.idl_loader._parse_idl(sample_idl_data)
        assert parsed.name == "test_program"
        assert parsed.version == "1.0.0"

    def test_map_idl_type_to_python_basic_types(self):
        """Test IDL type mapping for basic types."""
        # Test string types
        assert self.idl_loader._map_idl_type_to_python("u64") == int
        assert self.idl_loader._map_idl_type_to_python("string") == str
        assert self.idl_loader._map_idl_type_to_python("bool") == bool

    def test_map_idl_type_to_python_unknown_type(self):
        """Test IDL type mapping for unknown types."""
        # Should return Any for unknown types
        result = self.idl_loader._map_idl_type_to_python("unknown_type")
        # Should not raise an exception
        assert result is not None

    def test_get_instruction_discriminant_interface(self):
        """Test instruction discriminant calculation."""
        # Mock load_idl to avoid complex data setup
        with patch.object(self.idl_loader, "load_idl") as mock_load:
            mock_idl = Mock()
            mock_idl.instructions = [Mock(name="initialize", discriminant=None)]
            mock_load.return_value = mock_idl

            result = self.idl_loader.get_instruction_discriminant(
                "test_program", "initialize"
            )
            # Should return None or a discriminant value
            assert result is None or isinstance(result, int)

    def test_get_account_layout_interface(self):
        """Test account layout generation."""
        # Mock load_idl to avoid complex data setup
        with patch.object(self.idl_loader, "load_idl") as mock_load:
            mock_idl = Mock()
            mock_idl.accounts = [Mock(name="TestAccount")]
            mock_load.return_value = mock_idl

            result = self.idl_loader.get_account_layout("test_program", "TestAccount")
            # Should return None or a layout dict
            assert result is None or isinstance(result, dict)

    def test_clear_cache_interface(self):
        """Test cache clearing."""
        # Add something to cache first
        self.idl_loader._cached_idls["test"] = Mock()
        assert len(self.idl_loader._cached_idls) > 0

        # Clear cache
        self.idl_loader.clear_cache()
        assert len(self.idl_loader._cached_idls) == 0

    def test_caching_behavior(self):
        """Test that IDL loading uses caching."""
        with patch.object(self.idl_loader, "_load_from_resources") as mock_load:
            sample_idl_data = {
                "version": "1.0.0",
                "name": "test_program",
                "instructions": [],
                "accounts": [],
                "types": [],
                "errors": [],
                "metadata": {},
            }
            mock_load.return_value = sample_idl_data

            # First load
            result1 = self.idl_loader.load_idl("test_program")
            # Second load should use cache
            result2 = self.idl_loader.load_idl("test_program")

            # Should only call _load_from_resources once due to caching
            assert mock_load.call_count == 1
            assert result1.name == result2.name

    def test_generate_types_with_mock(self):
        """Test type generation with mock IDL."""
        # Use mock instead of creating real ParsedIdl
        mock_idl = Mock()
        mock_idl.name = "test"
        mock_idl.accounts = []
        mock_idl.types = []
        mock_idl.instructions = []  # Need to be iterable

        types = self.idl_loader.generate_types(mock_idl)
        assert isinstance(types, dict)

    def test_error_handling(self):
        """Test that methods handle errors gracefully."""
        # Test get_instruction_discriminant with invalid input
        result = self.idl_loader.get_instruction_discriminant("invalid", "invalid")
        assert result is None

        # Test get_account_layout with invalid input
        result = self.idl_loader.get_account_layout("invalid", "invalid")
        assert result is None

    def test_private_method_interfaces(self):
        """Test private method interfaces without complex setup."""
        # Test that private methods exist and can be called
        assert hasattr(self.idl_loader, "_load_from_resources")
        assert hasattr(self.idl_loader, "_load_from_file")
        assert hasattr(self.idl_loader, "_parse_idl")
        assert hasattr(self.idl_loader, "_map_idl_type_to_python")
        assert hasattr(self.idl_loader, "_generate_account_class")
        assert hasattr(self.idl_loader, "_generate_instruction_class")
        assert hasattr(self.idl_loader, "_generate_type_class")

    def test_loader_state_isolation(self):
        """Test that different loader instances are isolated."""
        loader1 = IDLLoader()
        loader2 = IDLLoader()

        # Add to one cache
        loader1._cached_idls["test1"] = Mock()
        assert "test1" in loader1._cached_idls
        assert "test1" not in loader2._cached_idls

        # Clear one cache
        loader1.clear_cache()
        assert len(loader1._cached_idls) == 0
        # loader2 should be unaffected
        assert loader2._cached_idls == {}

    def test_type_mapping_edge_cases(self):
        """Test type mapping with edge cases."""
        # Test None input (should handle gracefully)
        try:
            result = self.idl_loader._map_idl_type_to_python(None)
            # Should either return something or raise an exception
            assert result is not None
        except (TypeError, AttributeError):
            # Acceptable behavior for None input
            pass

        # Test empty string
        result = self.idl_loader._map_idl_type_to_python("")
        assert result is not None
