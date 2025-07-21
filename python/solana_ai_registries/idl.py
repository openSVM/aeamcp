"""
Dynamic IDL loading and type generation for Solana AI Registries.

Provides functionality to load Interface Definition Language (IDL) files
and generate Python types for Anchor programs.
"""

import json
import logging
from dataclasses import dataclass
from importlib import resources
from pathlib import Path
from typing import Any, Dict, List, Optional, Type, Union

from .exceptions import IDLError

logger = logging.getLogger(__name__)


@dataclass
class IdlInstruction:
    """Represents an IDL instruction definition."""

    name: str
    accounts: List[Dict[str, Any]]
    args: List[Dict[str, Any]]
    discriminant: Optional[int] = None


@dataclass
class IdlAccount:
    """Represents an IDL account definition."""

    name: str
    type: Dict[str, Any]
    discriminant: Optional[int] = None


@dataclass
class IdlType:
    """Represents an IDL type definition."""

    name: str
    type: Dict[str, Any]


@dataclass
class IdlError:
    """Represents an IDL error definition."""

    code: int
    name: str
    msg: str


@dataclass
class ParsedIdl:
    """Represents a parsed IDL structure."""

    version: str
    name: str
    instructions: List[IdlInstruction]
    accounts: List[IdlAccount]
    types: List[IdlType]
    errors: List[IdlError]
    metadata: Dict[str, Any]


class IDLLoader:
    """Dynamic IDL loader and type generator."""

    def __init__(self) -> None:
        """Initialize IDL loader."""
        self._cached_idls: Dict[str, ParsedIdl] = {}
        self._generated_types: Dict[str, Dict[str, Type]] = {}

    def load_idl(self, program_name: str) -> ParsedIdl:
        """
        Load IDL from embedded JSON files.

        Args:
            program_name: Name of the program (e.g., 'agent_registry')

        Returns:
            Parsed IDL structure

        Raises:
            IDLError: If IDL loading fails
        """
        if program_name in self._cached_idls:
            return self._cached_idls[program_name]

        try:
            # Try to load from package resources first
            idl_data = self._load_from_resources(program_name)
        except FileNotFoundError:
            try:
                # Fallback to loading from relative path
                idl_data = self._load_from_file(program_name)
            except FileNotFoundError:
                raise IDLError(f"IDL not found for program: {program_name}")

        try:
            parsed_idl = self._parse_idl(idl_data)
            self._cached_idls[program_name] = parsed_idl
            return parsed_idl
        except Exception as e:
            raise IDLError(f"Failed to parse IDL for {program_name}: {e}")

    def _load_from_resources(self, program_name: str) -> Dict[str, Any]:
        """Load IDL from package resources."""
        try:
            with resources.open_text(
                "solana_ai_registries.idl_files", f"{program_name}.json"
            ) as f:
                data = json.load(f)
                if isinstance(data, dict):
                    return data
                else:
                    raise ValueError(
                        f"IDL file for {program_name} does not contain a JSON object"
                    )
        except Exception as e:
            raise FileNotFoundError(f"Resource not found: {e}")

    def _load_from_file(self, program_name: str) -> Dict[str, Any]:
        """Load IDL from file system (fallback)."""
        # Try common IDL locations
        possible_paths = [
            Path(__file__).parent / "idl_files" / f"{program_name}.json",
            Path(__file__).parent.parent.parent / "idl" / f"{program_name}.json",
            Path(f"idl/{program_name}.json"),
        ]

        for idl_path in possible_paths:
            if idl_path.exists():
                with open(idl_path, "r") as f:
                    data = json.load(f)
                    if isinstance(data, dict):
                        return data
                    else:
                        raise ValueError(
                            f"IDL file {idl_path} does not contain a JSON object"
                        )

        raise FileNotFoundError(f"IDL file not found for {program_name}")

    def _parse_idl(self, idl_data: Dict[str, Any]) -> ParsedIdl:
        """Parse raw IDL data into structured format."""
        try:
            instructions = [
                IdlInstruction(
                    name=inst["name"],
                    accounts=inst.get("accounts", []),
                    args=inst.get("args", []),
                    discriminant=inst.get("discriminant"),
                )
                for inst in idl_data.get("instructions", [])
            ]

            accounts = [
                IdlAccount(
                    name=acc["name"],
                    type=acc["type"],
                    discriminant=acc.get("discriminant"),
                )
                for acc in idl_data.get("accounts", [])
            ]

            types = [
                IdlType(name=typ["name"], type=typ["type"])
                for typ in idl_data.get("types", [])
            ]

            errors = [
                IdlError(code=err["code"], name=err["name"], msg=err["msg"])
                for err in idl_data.get("errors", [])
            ]

            return ParsedIdl(
                version=idl_data.get("version", "0.1.0"),
                name=idl_data["name"],
                instructions=instructions,
                accounts=accounts,
                types=types,
                errors=errors,
                metadata=idl_data.get("metadata", {}),
            )

        except KeyError as e:
            raise IDLError(f"Missing required IDL field: {e}")

    def generate_types(self, idl: ParsedIdl) -> Dict[str, Type]:
        """
        Generate Python dataclasses from IDL structures.

        Args:
            idl: Parsed IDL structure

        Returns:
            Dictionary mapping type names to generated classes

        Raises:
            IDLError: If type generation fails
        """
        program_name = idl.name
        if program_name in self._generated_types:
            return self._generated_types[program_name]

        try:
            generated_types = {}

            # Generate types for account structures
            for account in idl.accounts:
                account_class = self._generate_account_class(account)
                generated_types[account.name] = account_class

            # Generate types for custom types
            for custom_type in idl.types:
                type_class = self._generate_type_class(custom_type)
                generated_types[custom_type.name] = type_class

            # Generate instruction classes
            for instruction in idl.instructions:
                instruction_class = self._generate_instruction_class(instruction)
                generated_types[f"{instruction.name}Instruction"] = instruction_class

            self._generated_types[program_name] = generated_types
            return generated_types

        except Exception as e:
            raise IDLError(f"Failed to generate types: {e}")

    def _generate_account_class(self, account: IdlAccount) -> Type:
        """Generate dataclass for account structure."""
        fields_dict = {}
        type_definition = account.type

        if "kind" in type_definition and type_definition["kind"] == "struct":
            for field in type_definition.get("fields", []):
                field_name = field["name"]
                field_type = self._map_idl_type_to_python(field["type"])
                fields_dict[field_name] = field_type

        # Create dataclass dynamically
        return dataclass(
            type(
                account.name,
                (),
                {
                    "__annotations__": fields_dict,
                    "__module__": __name__,
                },
            )
        )

    def _generate_type_class(self, custom_type: IdlType) -> Type:
        """Generate dataclass for custom type."""
        fields_dict = {}
        type_definition = custom_type.type

        if "kind" in type_definition:
            if type_definition["kind"] == "struct":
                for field in type_definition.get("fields", []):
                    field_name = field["name"]
                    field_type = self._map_idl_type_to_python(field["type"])
                    fields_dict[field_name] = field_type
            elif type_definition["kind"] == "enum":
                # For enums, create a simple class with variants
                variants = type_definition.get("variants", [])
                for variant in variants:
                    fields_dict[variant["name"]] = str

        return dataclass(
            type(
                custom_type.name,
                (),
                {
                    "__annotations__": fields_dict,
                    "__module__": __name__,
                },
            )
        )

    def _generate_instruction_class(self, instruction: IdlInstruction) -> Type:
        """Generate dataclass for instruction arguments."""
        fields_dict = {}

        for arg in instruction.args:
            arg_name = arg["name"]
            arg_type = self._map_idl_type_to_python(arg["type"])
            fields_dict[arg_name] = arg_type

        return dataclass(
            type(
                f"{instruction.name}Args",
                (),
                {
                    "__annotations__": fields_dict,
                    "__module__": __name__,
                },
            )
        )

    def _map_idl_type_to_python(self, idl_type: Union[str, Dict[str, Any]]) -> Type:
        """
        Map IDL type definitions to Python types.

        Args:
            idl_type: IDL type definition

        Returns:
            Corresponding Python type
        """
        if isinstance(idl_type, str):
            # Simple types
            type_mapping = {
                "bool": bool,
                "u8": int,
                "u16": int,
                "u32": int,
                "u64": int,
                "u128": int,
                "i8": int,
                "i16": int,
                "i32": int,
                "i64": int,
                "i128": int,
                "f32": float,
                "f64": float,
                "string": str,
                "publicKey": str,  # Solana PublicKey as string
                "bytes": bytes,
            }
            return type_mapping.get(idl_type, str)

        elif isinstance(idl_type, dict):
            # Complex types
            if "vec" in idl_type:
                # Return the generic List type; element type will be handled at runtime
                return List[Any]  # type: ignore[return-value]
            elif "option" in idl_type:
                # Return Optional type; inner type will be handled at runtime
                return Optional[Any]  # type: ignore[return-value]
            elif "array" in idl_type:
                # Return the generic List type; element type will be handled at runtime
                return List[Any]  # type: ignore[return-value]
            elif "defined" in idl_type:
                # Reference to custom type - return as string for now
                return str
            else:
                return Any

        return Any

    def get_instruction_discriminant(
        self, program_name: str, instruction_name: str
    ) -> Optional[int]:
        """
        Get instruction discriminant for a specific instruction.

        Args:
            program_name: Name of the program
            instruction_name: Name of the instruction

        Returns:
            Instruction discriminant or None if not found
        """
        try:
            idl = self.load_idl(program_name)
            for instruction in idl.instructions:
                if instruction.name == instruction_name:
                    return instruction.discriminant
            return None
        except Exception as e:
            logger.error(f"Failed to get discriminant for {instruction_name}: {e}")
            return None

    def get_account_layout(
        self, program_name: str, account_name: str
    ) -> Optional[Dict[str, Any]]:
        """
        Get account layout for deserialization.

        Args:
            program_name: Name of the program
            account_name: Name of the account

        Returns:
            Account layout definition or None if not found
        """
        try:
            idl = self.load_idl(program_name)
            for account in idl.accounts:
                if account.name == account_name:
                    return account.type
            return None
        except Exception as e:
            logger.error(f"Failed to get layout for {account_name}: {e}")
            return None

    def clear_cache(self) -> None:
        """Clear all cached IDLs and generated types."""
        self._cached_idls.clear()
        self._generated_types.clear()
        logger.info("IDL cache cleared")


# Global IDL loader instance
idl_loader = IDLLoader()
