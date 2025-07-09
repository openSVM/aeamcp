// TypeScript types generated from IDL files
// These would typically be auto-generated from the actual IDL files

export interface IdlInstruction {
  name: string;
  accounts: IdlAccount[];
  args: IdlArg[];
}

export interface IdlAccount {
  name: string;
  isMut: boolean;
  isSigner: boolean;
  docs?: string[];
}

export interface IdlArg {
  name: string;
  type: IdlType;
}

export type IdlType =
  | 'bool'
  | 'u8'
  | 'u16'
  | 'u32'
  | 'u64'
  | 'u128'
  | 'i8'
  | 'i16'
  | 'i32'
  | 'i64'
  | 'i128'
  | 'string'
  | 'publicKey'
  | { vec: IdlType }
  | { option: IdlType }
  | { defined: string }
  | { array: [IdlType, number] };

export interface IdlTypeDefinition {
  name: string;
  type: {
    kind: 'struct' | 'enum';
    fields?: IdlField[];
    variants?: IdlEnumVariant[];
  };
}

export interface IdlField {
  name: string;
  type: IdlType;
}

export interface IdlEnumVariant {
  name: string;
  fields?: IdlType[] | IdlField[];
}

export interface IdlError {
  code: number;
  name: string;
  msg: string;
}

export interface Idl {
  version: string;
  name: string;
  instructions: IdlInstruction[];
  accounts: IdlTypeDefinition[];
  types: IdlTypeDefinition[];
  events?: IdlTypeDefinition[];
  errors?: IdlError[];
  constants?: IdlConstant[];
}

export interface IdlConstant {
  name: string;
  type: IdlType;
  value: string;
}

// Agent Registry specific types
export interface AgentRegistryIdl extends Idl {
  name: 'agent_registry';
}

// MCP Server Registry specific types
export interface McpServerRegistryIdl extends Idl {
  name: 'mcp_server_registry';
}
