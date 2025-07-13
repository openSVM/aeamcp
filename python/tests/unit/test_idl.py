"""Tests for solana_ai_registries.idl module."""

import pytest
from unittest.mock import AsyncMock, Mock, patch, mock_open
import json
import tempfile
import os
from pathlib import Path

from solana_ai_registries.idl import IDLLoader, ParsedIdl
from solana_ai_registries.exceptions import IDLError, SolanaAIRegistriesError


class TestIDLLoader:
    """Test the IDLLoader class."""

    def setup_method(self):
        """Set up test fixtures."""
        self.idl_loader = IDLLoader()
        
        # Sample IDL data
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
                            {"name": "field1", "type": "string"},
                            {"name": "field2", "type": "u32"}
                        ]
                    }
                }
            ],
            "errors": [
                {"code": 6000, "name": "InvalidValue", "msg": "Invalid value provided"}
            ],
            "metadata": {
                "address": "11111111111111111111111111111112"
            }
        }

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
        assert hasattr(self.idl_loader, 'parse_idl_json')
        assert hasattr(self.idl_loader, 'get_cached_idl')
        assert hasattr(self.idl_loader, 'clear_cache')

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

    @pytest.mark.asyncio
    async def test_load_idl_from_file_success(self):
        """Test successful IDL loading from file."""
        with tempfile.NamedTemporaryFile(mode='w', suffix='.json', delete=False) as f:
            json.dump(self.sample_idl_data, f)
            f.flush()
            
            try:
                result = await self.idl_loader.load_idl(f.name)
                
                assert isinstance(result, ParsedIdl)
                assert result.name == "test_program"
                assert result.version == "0.1.0"
                assert len(result.instructions) == 1
                assert len(result.accounts) == 1
                assert len(result.types) == 1
                assert len(result.errors) == 1
                
                # Should be cached
                assert "test_program" in self.idl_loader._cached_idls
            finally:
                os.unlink(f.name)

    @pytest.mark.asyncio
    async def test_load_idl_from_url_success(self):
        """Test successful IDL loading from URL."""
        with patch('httpx.AsyncClient') as mock_http:
            mock_response = Mock()
            mock_response.status_code = 200
            mock_response.json.return_value = self.sample_idl_data
            mock_http.return_value.__aenter__.return_value.get.return_value = mock_response
            
            result = await self.idl_loader.load_idl("https://example.com/idl.json")
            
            assert isinstance(result, ParsedIdl)
            assert result.name == "test_program"
            mock_http.return_value.__aenter__.return_value.get.assert_called_once()

    @pytest.mark.asyncio
    async def test_load_idl_from_program_name(self):
        """Test IDL loading from program name (built-in IDL files)."""
        # Mock built-in IDL file
        mock_idl_path = Path("solana_ai_registries/idl_files/agent_registry.json")
        
        with patch('pathlib.Path.exists', return_value=True):
            with patch('pathlib.Path.read_text', return_value=json.dumps(self.sample_idl_data)):
                result = await self.idl_loader.load_idl("agent_registry")
                
                assert isinstance(result, ParsedIdl)
                assert result.name == "test_program"

    @pytest.mark.asyncio
    async def test_load_idl_cached_result(self):
        """Test IDL loading returns cached result."""
        # Pre-cache an IDL
        cached_idl = ParsedIdl(
            version="0.1.0", name="cached_program",
            instructions=[], accounts=[], types=[], errors=[], metadata={}
        )
        self.idl_loader._cached_idls["cached_program"] = cached_idl
        
        result = await self.idl_loader.load_idl("cached_program")
        
        assert result == cached_idl

    @pytest.mark.asyncio
    async def test_load_idl_file_not_found(self):
        """Test IDL loading with non-existent file."""
        with pytest.raises(IDLError, match="IDL file not found"):
            await self.idl_loader.load_idl("/nonexistent/file.json")

    @pytest.mark.asyncio
    async def test_load_idl_invalid_json(self):
        """Test IDL loading with invalid JSON."""
        with tempfile.NamedTemporaryFile(mode='w', suffix='.json', delete=False) as f:
            f.write("invalid json content")
            f.flush()
            
            try:
                with pytest.raises(IDLError, match="Invalid JSON"):
                    await self.idl_loader.load_idl(f.name)
            finally:
                os.unlink(f.name)

    @pytest.mark.asyncio
    async def test_load_idl_url_error(self):
        """Test IDL loading from URL with network error."""
        with patch('httpx.AsyncClient') as mock_http:
            mock_http.return_value.__aenter__.return_value.get.side_effect = Exception("Network error")
            
            with pytest.raises(IDLError, match="Failed to fetch IDL from URL"):
                await self.idl_loader.load_idl("https://example.com/idl.json")

    @pytest.mark.asyncio
    async def test_load_idl_url_http_error(self):
        """Test IDL loading from URL with HTTP error."""
        with patch('httpx.AsyncClient') as mock_http:
            mock_response = Mock()
            mock_response.status_code = 404
            mock_response.raise_for_status.side_effect = Exception("404 Not Found")
            mock_http.return_value.__aenter__.return_value.get.return_value = mock_response
            
            with pytest.raises(IDLError, match="HTTP error"):
                await self.idl_loader.load_idl("https://example.com/idl.json")

    def test_parse_idl_json_success(self):
        """Test successful IDL JSON parsing."""
        result = self.idl_loader.parse_idl_json(self.sample_idl_data)
        
        assert isinstance(result, ParsedIdl)
        assert result.name == "test_program"
        assert result.version == "0.1.0"
        assert len(result.instructions) == 1
        assert result.instructions[0]["name"] == "initialize"

    def test_parse_idl_json_missing_required_fields(self):
        """Test IDL JSON parsing with missing required fields."""
        incomplete_idl = {"version": "0.1.0"}  # Missing name
        
        with pytest.raises(IDLError, match="Missing required field"):
            self.idl_loader.parse_idl_json(incomplete_idl)

    def test_parse_idl_json_invalid_structure(self):
        """Test IDL JSON parsing with invalid structure."""
        invalid_idl = {
            "version": "0.1.0",
            "name": "test",
            "instructions": "not_a_list"  # Should be a list
        }
        
        with pytest.raises(IDLError, match="Invalid IDL structure"):
            self.idl_loader.parse_idl_json(invalid_idl)

    @pytest.mark.asyncio
    async def test_generate_types_success(self):
        """Test successful type generation from IDL."""
        idl = ParsedIdl(
            version="0.1.0",
            name="test_program",
            instructions=[],
            accounts=[
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
            types=[
                {
                    "name": "CustomType",
                    "type": {
                        "kind": "struct",
                        "fields": [
                            {"name": "field1", "type": "string"},
                            {"name": "field2", "type": "u32"}
                        ]
                    }
                }
            ],
            errors=[],
            metadata={}
        )
        
        types = await self.idl_loader.generate_types(idl)
        
        assert "DataAccount" in types
        assert "CustomType" in types
        assert callable(types["DataAccount"])
        assert callable(types["CustomType"])

    @pytest.mark.asyncio
    async def test_generate_types_cached_result(self):
        """Test type generation returns cached result."""
        idl = ParsedIdl(
            version="0.1.0", name="cached_types",
            instructions=[], accounts=[], types=[], errors=[], metadata={}
        )
        
        # Pre-cache types
        cached_types = {"TestType": Mock}
        self.idl_loader._generated_types["cached_types"] = cached_types
        
        result = await self.idl_loader.generate_types(idl)
        
        assert result == cached_types

    def test_get_cached_idl_success(self):
        """Test successful cached IDL retrieval."""
        cached_idl = ParsedIdl(
            version="0.1.0", name="cached",
            instructions=[], accounts=[], types=[], errors=[], metadata={}
        )
        self.idl_loader._cached_idls["cached"] = cached_idl
        
        result = self.idl_loader.get_cached_idl("cached")
        assert result == cached_idl

    def test_get_cached_idl_not_found(self):
        """Test cached IDL retrieval when not cached."""
        result = self.idl_loader.get_cached_idl("not_cached")
        assert result is None

    def test_clear_cache(self):
        """Test cache clearing."""
        # Add some cached data
        self.idl_loader._cached_idls["test"] = Mock()
        self.idl_loader._generated_types["test"] = Mock()
        
        assert len(self.idl_loader._cached_idls) > 0
        assert len(self.idl_loader._generated_types) > 0
        
        self.idl_loader.clear_cache()
        
        assert len(self.idl_loader._cached_idls) == 0
        assert len(self.idl_loader._generated_types) == 0

    def test_create_dataclass_from_struct(self):
        """Test dataclass creation from struct definition."""
        struct_def = {
            "kind": "struct",
            "fields": [
                {"name": "value", "type": "u64"},
                {"name": "name", "type": "string"},
                {"name": "active", "type": "bool"}
            ]
        }
        
        dataclass_type = self.idl_loader._create_dataclass_from_struct("TestStruct", struct_def)
        
        assert dataclass_type is not None
        assert dataclass_type.__name__ == "TestStruct"
        
        # Test instantiation
        instance = dataclass_type(value=123, name="test", active=True)
        assert instance.value == 123
        assert instance.name == "test"
        assert instance.active is True

    def test_map_idl_type_to_python_basic_types(self):
        """Test IDL type mapping to Python types."""
        assert self.idl_loader._map_idl_type_to_python("u64") == int
        assert self.idl_loader._map_idl_type_to_python("string") == str
        assert self.idl_loader._map_idl_type_to_python("bool") == bool
        assert self.idl_loader._map_idl_type_to_python("bytes") == bytes

    def test_map_idl_type_to_python_complex_types(self):
        """Test IDL type mapping for complex types."""
        # Vec types
        assert self.idl_loader._map_idl_type_to_python({"vec": "u32"}) == list
        
        # Option types
        assert self.idl_loader._map_idl_type_to_python({"option": "string"}) == str
        
        # Array types
        assert self.idl_loader._map_idl_type_to_python({"array": ["u8", 32]}) == list

    def test_validate_idl_structure_valid(self):
        """Test IDL structure validation with valid IDL."""
        # Should not raise exception
        self.idl_loader._validate_idl_structure(self.sample_idl_data)

    def test_validate_idl_structure_invalid_version(self):
        """Test IDL structure validation with invalid version."""
        invalid_idl = {**self.sample_idl_data, "version": 123}  # Should be string
        
        with pytest.raises(IDLError, match="version must be a string"):
            self.idl_loader._validate_idl_structure(invalid_idl)

    def test_validate_idl_structure_invalid_instructions(self):
        """Test IDL structure validation with invalid instructions."""
        invalid_idl = {**self.sample_idl_data, "instructions": "not_a_list"}
        
        with pytest.raises(IDLError, match="instructions must be a list"):
            self.idl_loader._validate_idl_structure(invalid_idl)

    def test_build_instruction_from_idl(self):
        """Test instruction building from IDL definition."""
        instruction_def = {
            "name": "initialize",
            "accounts": [
                {"name": "authority", "isMut": False, "isSigner": True},
                {"name": "dataAccount", "isMut": True, "isSigner": False}
            ],
            "args": [
                {"name": "value", "type": "u64"}
            ]
        }
        
        instruction_builder = self.idl_loader._build_instruction_from_idl(instruction_def)
        
        assert callable(instruction_builder)
        # The function should accept the expected arguments
        # This is a basic test since we can't easily test the full instruction building


class TestParsedIdl:
    """Test the ParsedIdl dataclass."""

    def test_parsed_idl_creation(self):
        """Test ParsedIdl creation with all fields."""
        idl = ParsedIdl(
            version="0.1.0",
            name="test_program",
            instructions=[{"name": "test"}],
            accounts=[{"name": "TestAccount"}],
            types=[{"name": "TestType"}],
            errors=[{"code": 6000, "name": "TestError"}],
            metadata={"address": "11111111111111111111111111111112"}
        )
        
        assert idl.version == "0.1.0"
        assert idl.name == "test_program"
        assert len(idl.instructions) == 1
        assert len(idl.accounts) == 1
        assert len(idl.types) == 1
        assert len(idl.errors) == 1
        assert idl.metadata["address"] == "11111111111111111111111111111112"

    def test_parsed_idl_defaults(self):
        """Test ParsedIdl with default values."""
        idl = ParsedIdl(version="0.1.0", name="test")
        
        assert idl.instructions == []
        assert idl.accounts == []
        assert idl.types == []
        assert idl.errors == []
        assert idl.metadata == {}

    def test_parsed_idl_equality(self):
        """Test ParsedIdl equality comparison."""
        idl1 = ParsedIdl(version="0.1.0", name="test")
        idl2 = ParsedIdl(version="0.1.0", name="test")
        idl3 = ParsedIdl(version="0.2.0", name="test")
        
        assert idl1 == idl2
        assert idl1 != idl3