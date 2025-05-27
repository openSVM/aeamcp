# Solana AI Registries Documentation

Welcome to the documentation for the Solana AI Registries protocol. This documentation covers the core specifications, use cases, token utility, and developer resources for working with the Agent Registry and MCP Server Registry protocols.

## Documentation Contents

### Protocol Specifications
- [Protocol Specification](protocol-specification.md) - Comprehensive technical specification of the registry protocols

### Use Cases & Applications
- [Use Cases](use-cases.md) - Detailed exploration of the key use cases and applications

### Token Economics 
- [$SVMAI Token](svmai-token.md) - The utility and tokenomics of the $SVMAI token

### Developer Resources
- [Developer Guide](developer-guide.md) - Integration guide for developers building with the registry protocols

## Introduction

The Solana AI Registries protocol is designed to provide essential infrastructure for discovering, verifying, and interacting with autonomous AI agents and Model Context Protocol (MCP) servers. The protocol consists of two interconnected on-chain registries:

1. **Agent Registry**: A decentralized directory for autonomous agents operating on Solana, supporting the advertisement of agent capabilities, endpoints, identity, and metadata following the Autonomous Economic Agent (AEA) and Agent-to-Agent (A2A) paradigms.

2. **MCP Server Registry**: A directory for Model Context Protocol (MCP) compliant servers, enabling the discovery of AI tools, resources, and prompts following the MCP specification.

## Protocol Highlights

- **Hybrid Storage Model**: Essential data on-chain, detailed metadata off-chain with verification hashes
- **Comprehensive Events**: Detailed events for off-chain indexing and querying
- **Standardized Metadata**: Aligned with A2A, AEA, and MCP specifications
- **Ownership Verification**: Clear ownership and access control through Solana key-pairs
- **Extensibility**: Designed for future protocol enhancements and integrations

## Getting Started

For developers looking to integrate with the Solana AI Registries protocol:

1. Start with the [Protocol Specification](protocol-specification.md) to understand the core concepts
2. Explore the [Use Cases](use-cases.md) to identify relevant applications for your project
3. Read the [Developer Guide](developer-guide.md) for integration examples and best practices
4. Learn about the [$SVMAI Token](svmai-token.md) to understand the economic model

## Community & Support

- GitHub Repository: [openSVM/aeamcp](https://github.com/openSVM/aeamcp)
- Documentation Issues: Please report documentation issues via GitHub issues

## Contributing

We welcome contributions to improve the protocol and its documentation:

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request