# Solana AI Registries SDK - Reference Documentation Index

This directory contains detailed, atomic execution plans with comprehensive references for building multi-language SDKs for the Solana AI Registries protocol. Each file provides objective, independently verifiable acceptance criteria with links to relevant documentation, ensuring any agent can understand and implement the tasks without prior context.

## Overview

The Solana AI Registries SDK project aims to create comprehensive client libraries in six languages (Rust, TypeScript, Go, Python, C, C++) for interacting with the on-chain AI agent and MCP server registries. Each SDK includes:

- Full CRUD operations for agent and MCP server registries
- Payment integration supporting prepay, pay-as-you-go, and streaming models
- Type-safe interfaces generated from Anchor IDLs
- Comprehensive testing with >90% coverage
- Automated CI/CD for package publishing

## Reference Documentation

### 📋 [Common Artifacts](./common_artifacts_references.md)
Foundation tasks that all SDKs depend on:
- IDL extraction and validation
- Program constants documentation
- Unified API specification
- Test fixture setup

### 🦀 [Rust SDK](./rust_sdk_references.md)
Native Rust implementation with feature gates:
- Anchor-compatible client library
- Feature flags for payment modes
- Cargo publishing automation
- 12 atomic implementation tasks

### 📘 [TypeScript SDK](./typescript_sdk_references.md)
JavaScript/TypeScript implementation for web and Node.js:
- @svmai/registries npm package
- Runtime IDL loading
- Jest testing framework
- 7 atomic implementation tasks

### 🐹 [Go SDK](./go_sdk_references.md)
Go implementation with embedded IDLs:
- Native Go error handling
- go:embed for compile-time IDL inclusion
- Module versioning support
- 5 atomic implementation tasks

### 🐍 [Python SDK](./python_sdk_references.md)
Python implementation with dynamic typing:
- solana_ai_registries PyPI package
- Type hints and dataclasses
- pytest testing framework
- 5 atomic implementation tasks

### 🔧 [C SDK](./c_sdk_references.md)
Low-level C implementation:
- Memory-safe design with valgrind validation
- Compile-time struct generation
- Unity test framework
- 5 atomic implementation tasks

### ⚡ [C++ SDK](./cpp_sdk_references.md)
Modern C++ implementation:
- RAII and smart pointers
- Google Test framework
- Conan package manager support
- 5 atomic implementation tasks

### 🚀 [CI/CD Workflows](./cicd_references.md)
GitHub Actions for automated publishing:
- Language-specific publishing workflows
- Multi-platform builds
- Automated testing gates
- 6 workflow implementation tasks

### 💡 [Example Applications](./examples_references.md)
Practical demonstrations of SDK usage:
- Agent discovery examples
- MCP server integration
- Payment flow demonstrations
- Full end-to-end workflows
- 6 example implementation tasks

## Key References

- **Master Roadmap**: [`docs/SDK_ROADMAP_DETAILED.md`](../SDK_ROADMAP_DETAILED.md) - Technical specifications for all SDKs
- **Full Execution Plan**: [`docs/SDK_EXECUTION_PLAN_FULL.md`](../SDK_EXECUTION_PLAN_FULL.md) - Complete task breakdown
- **Implementation Status**: [`docs/IMPLEMENTATION_STATUS.md`](../IMPLEMENTATION_STATUS.md) - Core protocol documentation
- **Programs Source**: [`programs/`](../../programs/) - On-chain program implementations
- **IDL Files**: [`idl/`](../../idl/) - Anchor IDL definitions

## Usage

Each reference document follows a consistent format:

1. **Task Title**: Clear description of what needs to be implemented
2. **Acceptance Criteria**: Objective, measurable criteria for task completion
3. **References**: Direct links to relevant documentation and code

Example:
```markdown
### 1.1 Implement feature
- **Criterion description:**  
  Specific, measurable requirement.  
  **Reference:** [Link to docs], [Link to code]
```

## For Multi-Agent Execution

These documents are designed for parallel execution by multiple agents:
- Each task is completely self-contained
- No hidden dependencies between tasks
- All necessary context provided via references
- Clear, objective success criteria

Agents can select any task from any SDK and begin implementation immediately using the provided references to understand requirements and constraints.