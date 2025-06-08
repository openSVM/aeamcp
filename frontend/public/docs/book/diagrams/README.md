# Mermaid Diagrams

This directory contains external mermaid diagram files (.mmd) used in the tutorial book chapters.

## Files

- `intro-overview.mmd` - System overview flowchart (intro chapter)
- `ch1-register-sequence.mmd` - Registration sequence diagram (Chapter 1)
- `ch2-agent-register-sequence.mmd` - Agent registration sequence (Chapter 2)
- `ch3-mcp-register-sequence.mmd` - MCP server registration sequence (Chapter 3)
- `ch5-rpc-fetch-sequence.mmd` - RPC data fetching sequence (Chapter 5)
- `ch6-wallet-sequence.mmd` - Wallet integration sequence (Chapter 6)
- `ch7-token-register-sequence.mmd` - Token-based registration sequence (Chapter 7)
- `ch8-events-sequence.mmd` - Event system sequence (Chapter 8)

## Usage

In markdown files, reference external diagrams using:

```
```mermaid:diagrams/filename.mmd
```
```

This syntax is processed by the documentation system to load and render the external mermaid file.

## Benefits

- **Maintainability**: Diagrams can be edited independently of markdown content
- **Reusability**: Diagrams can be referenced from multiple locations
- **Version Control**: Changes to diagrams are tracked separately from text changes
- **ID Collision Prevention**: Enhanced rendering system prevents mermaid ID conflicts