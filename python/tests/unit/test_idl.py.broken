"""Comprehensive tests for solana_ai_registries.idl module."""

import pytest
from unittest.mock import AsyncMock, Mock, patch, mock_open
import json
import tempfile
import os
from pathlib import Path
from typing import Dict, Any, Type

from solana_ai_registries.idl import IDLLoader, ParsedIdl, IdlInstruction, IdlAccount, IdlType
from solana_ai_registries.exceptions import IDLError


class TestIDLLoader:
    """Comprehensive test coverage for IDLLoader class."""

    def setup_method(self):
        """Set up test fixtures."""
        self.idl_loader = IDLLoader()
        
        # Sample minimal IDL data
        self.sample_idl_data = {
            "version": "0.1.0",
            "name": "test_program",
            "instructions": [
                {
                    "name": "initialize",
                    "accounts": [
                        {"name": "authority", "isMut": False, "isSigner": True},
                        {"name": "dataAccount", "isMut": True, "isSigner": False}
                    ],
                    "args": [
                        {"name": "value", "type": "u64"}
                    ]
                }
            ],
            "accounts": [
                {
                    "name": "DataAccount",
                    "type": {
                        "kind": "struct",
                        "fields": [
                            {"name": "value", "type": "u64"},
                            {"name": "authority", "type": "publicKey"}
                        ]
                    }
                }
            ],
            "types": [
                {
                    "name": "CustomType",
                    "type": {
                        "kind": "struct",
                        "fields": [
                            {"name": "id", "type": "u32"},
                            {"name": "name", "type": "string"}
                        ]
                    }
                }
            ],
            "errors": [
                {
                    "code": 6000,
                    "name": "InvalidInput",
                    "msg": "Invalid input provided"
                }
            ],
            "metadata": {
                "address": "11111111111111111111111111111112"
            }
        }

    def test_init(self):
        """Test IDLLoader initialization."""
        loader = IDLLoader()
        assert loader._cached_idls == {}

    def test_init_with_custom_path(self):
        """Test IDLLoader initialization with custom IDL path."""
        custom_path = "/custom/idl/path"
        loader = IDLLoader(idl_path=custom_path)
        assert loader.idl_path == custom_path

    def test_clear_cache(self):
        """Test clearing the IDL cache."""
        # Add some cached data
        self.idl_loader._cached_idls["test"] = Mock()
        assert len(self.idl_loader._cached_idls) == 1
        
        # Clear cache
        self.idl_loader.clear_cache()
        assert len(self.idl_loader._cached_idls) == 0

    @pytest.mark.asyncio
    async def test_load_idl_from_cache(self):
        """Test loading IDL from cache."""
        # Mock cached IDL
        mock_parsed_idl = Mock(spec=ParsedIdl)
        self.idl_loader._cached_idls["test_program"] = mock_parsed_idl
        
        result = await self.idl_loader.load_idl("test_program")
        assert result == mock_parsed_idl

    @pytest.mark.asyncio
    async def test_load_idl_from_file(self):
        """Test loading IDL from file system."""
        with patch.object(self.idl_loader, '_load_from_file') as mock_load_file:
            with patch.object(self.idl_loader, '_parse_idl') as mock_parse:
                mock_load_file.return_value = self.sample_idl_data
                mock_parsed = Mock(spec=ParsedIdl)
                mock_parse.return_value = mock_parsed
                
                result = await self.idl_loader.load_idl("test_program")
                
                mock_load_file.assert_called_once_with("test_program")
                mock_parse.assert_called_once_with(self.sample_idl_data)
                assert result == mock_parsed
                assert self.idl_loader._cached_idls["test_program"] == mock_parsed

    @pytest.mark.asyncio
    async def test_load_idl_from_resources(self):
        """Test loading IDL from package resources."""
        with patch.object(self.idl_loader, '_load_from_file') as mock_load_file:
            with patch.object(self.idl_loader, '_load_from_resources') as mock_load_resources:
                with patch.object(self.idl_loader, '_parse_idl') as mock_parse:
                    # File load fails, resources load succeeds
                    mock_load_file.side_effect = FileNotFoundError()
                    mock_load_resources.return_value = self.sample_idl_data
                    mock_parsed = Mock(spec=ParsedIdl)
                    mock_parse.return_value = mock_parsed
                    
                    result = await self.idl_loader.load_idl("test_program")
                    
                    mock_load_file.assert_called_once_with("test_program")
                    mock_load_resources.assert_called_once_with("test_program")
                    mock_parse.assert_called_once_with(self.sample_idl_data)
                    assert result == mock_parsed

    @pytest.mark.asyncio
    async def test_load_idl_not_found(self):
        """Test loading IDL when not found."""
        with patch.object(self.idl_loader, '_load_from_file') as mock_load_file:
            with patch.object(self.idl_loader, '_load_from_resources') as mock_load_resources:
                mock_load_file.side_effect = FileNotFoundError()
                mock_load_resources.side_effect = FileNotFoundError()
                
                with pytest.raises(IDLError, match="IDL not found for program"):
                    await self.idl_loader.load_idl("nonexistent_program")

    def test_load_from_file_success(self):
        """Test loading IDL from file successfully."""
        mock_data = json.dumps(self.sample_idl_data)
        
        with patch("builtins.open", mock_open(read_data=mock_data)):
            with patch("os.path.exists", return_value=True):
                result = self.idl_loader._load_from_file("test_program")
                assert result == self.sample_idl_data

    def test_load_from_file_not_found(self):
        """Test loading IDL from file when file doesn't exist."""
        with patch("os.path.exists", return_value=False):
            with pytest.raises(FileNotFoundError):
                self.idl_loader._load_from_file("nonexistent_program")

    def test_load_from_file_invalid_json(self):
        """Test loading IDL from file with invalid JSON."""
        with patch("builtins.open", mock_open(read_data="invalid json")):
            with patch("os.path.exists", return_value=True):
                with pytest.raises(IDLError, match="Invalid IDL JSON format"):
                    self.idl_loader._load_from_file("test_program")

    def test_load_from_resources_success(self):
        """Test loading IDL from package resources."""
        mock_data = json.dumps(self.sample_idl_data)
        
        with patch("importlib.resources.files") as mock_files:
            mock_path = Mock()
            mock_file = Mock()
            mock_file.read_text.return_value = mock_data
            mock_path.__truediv__.return_value = mock_file
            mock_files.return_value = mock_path
            
            result = self.idl_loader._load_from_resources("test_program")
            assert result == self.sample_idl_data

    def test_load_from_resources_not_found(self):
        """Test loading IDL from resources when not found."""
        with patch("importlib.resources.files") as mock_files:
            mock_path = Mock()
            mock_file = Mock()
            mock_file.read_text.side_effect = FileNotFoundError()
            mock_path.__truediv__.return_value = mock_file
            mock_files.return_value = mock_path
            
            with pytest.raises(FileNotFoundError):
                self.idl_loader._load_from_resources("nonexistent_program")

    def test_parse_idl_success(self):
        """Test successful IDL parsing."""
        result = self.idl_loader._parse_idl(self.sample_idl_data)
        
        assert isinstance(result, ParsedIdl)
        assert result.name == "test_program"
        assert result.version == "0.1.0"
        assert len(result.instructions) == 1
        assert len(result.accounts) == 1
        assert len(result.types) == 1
        assert len(result.errors) == 1
        assert result.metadata["address"] == "11111111111111111111111111111112"

    def test_parse_idl_missing_required_fields(self):
        """Test IDL parsing with missing required fields."""
        invalid_idl = {"version": "0.1.0"}  # Missing name and other required fields
        
        with pytest.raises(IDLError, match="Invalid IDL structure"):
            self.idl_loader._parse_idl(invalid_idl)

    def test_map_idl_type_to_python_primitives(self):
        """Test mapping IDL types to Python types for primitives."""
        # Test primitive types
        assert self.idl_loader._map_idl_type_to_python("u8") == int
        assert self.idl_loader._map_idl_type_to_python("u16") == int
        assert self.idl_loader._map_idl_type_to_python("u32") == int
        assert self.idl_loader._map_idl_type_to_python("u64") == int
        assert self.idl_loader._map_idl_type_to_python("i8") == int
        assert self.idl_loader._map_idl_type_to_python("i16") == int
        assert self.idl_loader._map_idl_type_to_python("i32") == int
        assert self.idl_loader._map_idl_type_to_python("i64") == int
        assert self.idl_loader._map_idl_type_to_python("f32") == float
        assert self.idl_loader._map_idl_type_to_python("f64") == float
        assert self.idl_loader._map_idl_type_to_python("bool") == bool
        assert self.idl_loader._map_idl_type_to_python("string") == str
        assert self.idl_loader._map_idl_type_to_python("publicKey") == str

    def test_map_idl_type_to_python_complex_types(self):
        """Test mapping IDL types to Python types for complex types."""
        from typing import List, Optional, Any
        
        # Test vec (array) type
        vec_type = {"vec": "u32"}
        result = self.idl_loader._map_idl_type_to_python(vec_type)
        assert str(result).startswith("typing.List")
        
        # Test option type
        option_type = {"option": "string"}
        result = self.idl_loader._map_idl_type_to_python(option_type)
        assert str(result).startswith("typing.Union")
        
        # Test array type
        array_type = {"array": ["u8", 32]}
        result = self.idl_loader._map_idl_type_to_python(array_type)
        assert str(result).startswith("typing.List")

    def test_map_idl_type_to_python_unknown_type(self):
        """Test mapping unknown IDL type."""
        result = self.idl_loader._map_idl_type_to_python("unknown_type")
        assert result == type(None)  # Should return Any for unknown types

    @pytest.mark.asyncio
    async def test_get_instruction_discriminant_success(self):
        """Test getting instruction discriminant successfully."""
        # Mock loaded IDL
        mock_instruction = Mock()
        mock_instruction.name = "initialize"
        mock_parsed_idl = Mock(spec=ParsedIdl)
        mock_parsed_idl.instructions = [mock_instruction]
        
        with patch.object(self.idl_loader, 'load_idl', return_value=mock_parsed_idl):
            with patch('hashlib.sha256') as mock_sha:
                mock_sha.return_value.digest.return_value = b'\x01' * 32
                
                result = await self.idl_loader.get_instruction_discriminant(
                    "test_program", "initialize"
                )
                
                assert isinstance(result, int)

    @pytest.mark.asyncio
    async def test_get_instruction_discriminant_not_found(self):
        """Test getting instruction discriminant when instruction not found."""
        mock_parsed_idl = Mock(spec=ParsedIdl)
        mock_parsed_idl.instructions = []
        
        with patch.object(self.idl_loader, 'load_idl', return_value=mock_parsed_idl):
            result = await self.idl_loader.get_instruction_discriminant(
                "test_program", "nonexistent"
            )
            
            assert result is None

    @pytest.mark.asyncio
    async def test_get_account_layout_success(self):
        """Test getting account layout successfully."""
        mock_account = Mock()
        mock_account.name = "DataAccount"
        mock_account.type = {"kind": "struct", "fields": []}
        mock_parsed_idl = Mock(spec=ParsedIdl)
        mock_parsed_idl.accounts = [mock_account]
        
        with patch.object(self.idl_loader, 'load_idl', return_value=mock_parsed_idl):
            result = await self.idl_loader.get_account_layout(
                "test_program", "DataAccount"
            )
            
            assert result is not None
            assert isinstance(result, dict)

    @pytest.mark.asyncio
    async def test_get_account_layout_not_found(self):
        """Test getting account layout when account not found."""
        mock_parsed_idl = Mock(spec=ParsedIdl)
        mock_parsed_idl.accounts = []
        
        with patch.object(self.idl_loader, 'load_idl', return_value=mock_parsed_idl):
            result = await self.idl_loader.get_account_layout(
                "test_program", "NonexistentAccount"
            )
            
            assert result is None

    def test_generate_types_success(self):
        """Test generating types from IDL successfully."""
        # Create a real ParsedIdl object
        parsed_idl = self.idl_loader._parse_idl(self.sample_idl_data)
        
        result = self.idl_loader.generate_types(parsed_idl)
        
        assert isinstance(result, dict)
        assert len(result) > 0

    def test_generate_types_empty_idl(self):
        """Test generating types from empty IDL."""
        empty_idl_data = {
            "version": "0.1.0",
            "name": "empty_program",
            "instructions": [],
            "accounts": [],
            "types": [],
            "errors": [],
            "metadata": {}
        }
        
        parsed_idl = self.idl_loader._parse_idl(empty_idl_data)
        result = self.idl_loader.generate_types(parsed_idl)
        
        assert isinstance(result, dict)

    def test_generate_instruction_class(self):
        """Test generating instruction class."""
        instruction_data = {
            "name": "initialize",
            "accounts": [
                {"name": "authority", "isMut": False, "isSigner": True}
            ],
            "args": [
                {"name": "value", "type": "u64"}
            ]
        }
        
        idl_instruction = IdlInstruction(
            name=instruction_data["name"],
            accounts=instruction_data["accounts"],
            args=instruction_data["args"]
        )
        
        result = self.idl_loader._generate_instruction_class(idl_instruction)
        
        assert isinstance(result, type)
        assert result.__name__ == "InitializeInstruction"

    def test_generate_account_class(self):
        """Test generating account class."""
        account_data = {
            "name": "DataAccount",
            "type": {
                "kind": "struct",
                "fields": [
                    {"name": "value", "type": "u64"}
                ]
            }
        }
        
        idl_account = IdlAccount(
            name=account_data["name"],
            type=account_data["type"]
        )
        
        result = self.idl_loader._generate_account_class(idl_account)
        
        assert isinstance(result, type)
        assert result.__name__ == "DataAccount"

    def test_generate_type_class(self):
        """Test generating custom type class."""
        type_data = {
            "name": "CustomType",
            "type": {
                "kind": "struct",
                "fields": [
                    {"name": "id", "type": "u32"}
                ]
            }
        }
        
        idl_type = IdlType(
            name=type_data["name"],
            type=type_data["type"]
        )
        
        result = self.idl_loader._generate_type_class(idl_type)
        
        assert isinstance(result, type)
        assert result.__name__ == "CustomType"


class TestParsedIdl:
    """Test the ParsedIdl dataclass."""

    def test_parsed_idl_creation(self):
        """Test creating ParsedIdl instance."""
        instructions = [Mock()]
        accounts = [Mock()]
        types = [Mock()]
        errors = [Mock()]
        metadata = {"address": "test"}
        
        parsed_idl = ParsedIdl(
            name="test",
            version="0.1.0",
            instructions=instructions,
            accounts=accounts,
            types=types,
            errors=errors,
            metadata=metadata
        )
        
        assert parsed_idl.name == "test"
        assert parsed_idl.version == "0.1.0"
        assert parsed_idl.instructions == instructions
        assert parsed_idl.accounts == accounts
        assert parsed_idl.types == types
        assert parsed_idl.errors == errors
        assert parsed_idl.metadata == metadata

    def test_parsed_idl_defaults(self):
        """Test ParsedIdl with default values."""
        parsed_idl = ParsedIdl(
            name="test",
            version="0.1.0",
            instructions=[],
            accounts=[],
            types=[],
            errors=[],
            metadata={}
        )
        
        assert parsed_idl.instructions == []
        assert parsed_idl.accounts == []
        assert parsed_idl.types == []
        assert parsed_idl.errors == []
        assert parsed_idl.metadata == {}

    def test_parsed_idl_equality(self):
        """Test ParsedIdl equality comparison."""
        instructions = [Mock()]
        accounts = [Mock()]
        types = [Mock()]
        errors = [Mock()]
        metadata = {"address": "test"}
        
        parsed_idl1 = ParsedIdl(
            name="test",
            version="0.1.0",
            instructions=instructions,
            accounts=accounts,
            types=types,
            errors=errors,
            metadata=metadata
        )
        
        parsed_idl2 = ParsedIdl(
            name="test",
            version="0.1.0",
            instructions=instructions,
            accounts=accounts,
            types=types,
            errors=errors,
            metadata=metadata
        )
        
        assert parsed_idl1 == parsed_idl2

    def test_parsed_idl_inequality(self):
        """Test ParsedIdl inequality comparison."""
        parsed_idl1 = ParsedIdl(
            name="test1",
            version="0.1.0",
            instructions=[],
            accounts=[],
            types=[],
            errors=[],
            metadata={}
        )
        
        parsed_idl2 = ParsedIdl(
            name="test2",
            version="0.1.0",
            instructions=[],
            accounts=[],
            types=[],
            errors=[],
            metadata={}
        )
        
        assert parsed_idl1 != parsed_idl2


class TestIdlDataClasses:
    """Test IDL data classes."""

    def test_idl_instruction(self):
        """Test IdlInstruction dataclass."""
        instruction = IdlInstruction(
            name="test",
            accounts=[{"name": "test", "isMut": False, "isSigner": True}],
            args=[{"name": "value", "type": "u64"}]
        )
        
        assert instruction.name == "test"
        assert len(instruction.accounts) == 1
        assert len(instruction.args) == 1

    def test_idl_account(self):
        """Test IdlAccount dataclass."""
        account = IdlAccount(
            name="TestAccount",
            type={"kind": "struct", "fields": []}
        )
        
        assert account.name == "TestAccount"
        assert account.type["kind"] == "struct"

    def test_idl_type(self):
        """Test IdlType dataclass."""
        idl_type = IdlType(
            name="TestType",
            type={"kind": "struct", "fields": []}
        )
        
        assert idl_type.name == "TestType"
        assert idl_type.type["kind"] == "struct"


class TestIDLErrorHandling:
    """Test error handling in IDL module."""

    def test_idl_error_creation(self):
        """Test IDLError exception creation."""
        error = IDLError("Test error message")
        assert str(error) == "Test error message"
        assert isinstance(error, Exception)

    def test_idl_error_with_details(self):
        """Test IDLError with additional details."""
        details = {"program": "test", "instruction": "initialize"}
        error = IDLError("Test error", details)
        
        assert str(error) == "Test error"
        assert error.details == details