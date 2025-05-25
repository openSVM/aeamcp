# AEAMCP Frontend - Solana AI Registries

A modern React/Next.js Progressive Web Application (PWA) for the Autonomous Economic Agent Model Context Protocol (AEAMCP) - a decentralized registry system for AI agents and MCP servers built on Solana blockchain.

## 🌟 What is AEAMCP?

AEAMCP (Autonomous Economic Agent Model Context Protocol) is a revolutionary platform that enables the discovery, registration, and interaction with AI agents and Model Context Protocol (MCP) servers on the Solana blockchain. It serves as a decentralized marketplace and registry where developers can publish their AI services and users can discover and interact with them.

## 🚀 Key Features

### 🤖 AI Agent Registry
- **Discover AI Agents**: Browse autonomous AI agents with verified capabilities
- **Agent Profiles**: Detailed information including endpoints, capabilities, and economic intents
- **Real-time Status**: Live status monitoring and performance metrics
- **Search & Filter**: Advanced search by capabilities, tags, and status

### 🖥️ MCP Server Registry
- **MCP Server Discovery**: Find Model Context Protocol servers offering tools, resources, and prompts
- **Capability Mapping**: Clear visualization of server capabilities (tools, resources, prompts)
- **Integration Ready**: Direct endpoints for seamless integration
- **Quality Assurance**: Community-driven ratings and reviews

### 💰 $SVMAI Token Integration
- **Governance**: Vote on protocol upgrades and ecosystem decisions
- **Staking**: Stake tokens to secure the network and earn rewards
- **Premium Access**: Access premium AI agents and advanced features
- **Economic Incentives**: Earn tokens for quality contributions

### 🔐 Solana Blockchain Benefits
- **Fast Transactions**: Sub-second transaction finality
- **Low Costs**: Minimal transaction fees
- **Decentralized**: No central authority or single point of failure
- **Transparent**: All registrations and interactions are on-chain

## 🏗️ How It Works

### For AI Agent Developers
1. **Connect Wallet**: Connect your Solana wallet (Phantom, Solflare, etc.)
2. **Stake $SVMAI**: Stake required tokens to register your agent
3. **Register Agent**: Provide agent details, capabilities, and endpoints
4. **Go Live**: Your agent becomes discoverable in the registry
5. **Earn Rewards**: Receive $SVMAI tokens based on usage and ratings

### For MCP Server Providers
1. **Connect Wallet**: Connect your Solana wallet
2. **Stake Tokens**: Stake $SVMAI tokens for server registration
3. **Define Capabilities**: Specify tools, resources, and prompts offered
4. **Register Server**: Submit server details and endpoints
5. **Serve Community**: Provide valuable AI services to the ecosystem

### For Users & Developers
1. **Browse Registry**: Explore available AI agents and MCP servers
2. **Filter & Search**: Find services matching your specific needs
3. **Connect & Integrate**: Use provided endpoints for integration
4. **Rate & Review**: Provide feedback to improve service quality
5. **Participate in Governance**: Use $SVMAI tokens to vote on proposals

## 💎 $SVMAI Token - The Heart of the Ecosystem

### Token Utility
- **🗳️ Governance**: Participate in DAO decisions and protocol upgrades
- **🔒 Staking**: Secure the network and earn 8-12% annual rewards
- **⚡ Premium Access**: Unlock advanced features and priority support
- **🎁 Incentives**: Earn rewards for quality contributions and usage

### Token Economics
- **Total Supply**: 1,000,000,000 $SVMAI
- **Contract Address**: `Cpzvdx6pppc9TNArsGsqgShCsKC9NCCjA2gtzHvUpump`
- **Network**: Solana
- **Decimals**: 6
- **Distribution**:
  - 40% - Community & Ecosystem rewards
  - 20% - Development team (4-year vesting)
  - 15% - Treasury & DAO
  - 10% - Liquidity & Market making
  - 10% - Advisors & Partners
  - 5% - Reserve fund

### Where to Get $SVMAI
- **Jupiter Swap**: [Trade on Jupiter](https://jup.ag/swap/SOL-Cpzvdx6pppc9TNArsGsqgShCsKC9NCCjA2gtzHvUpump)
- **Raydium**: [Trade on Raydium](https://raydium.io/swap/?inputCurrency=sol&outputCurrency=Cpzvdx6pppc9TNArsGsqgShCsKC9NCCjA2gtzHvUpump)
- **View on Solscan**: [Token Details](https://solscan.io/token/Cpzvdx6pppc9TNArsGsqgShCsKC9NCCjA2gtzHvUpump)

### Staking Benefits
- **Minimum Stake**: 1,000 $SVMAI
- **Lock Period**: 30 days minimum
- **Rewards**: 8-12% annual yield
- **Governance Power**: Voting weight based on stake amount

## 🛠️ Technical Architecture

### Frontend Stack
- **Framework**: Next.js 14+ with App Router
- **Language**: TypeScript for type safety
- **Styling**: Tailwind CSS for responsive design
- **Icons**: Lucide React for consistent iconography
- **PWA**: Next-PWA for offline capabilities

### Blockchain Integration
- **Network**: Solana (Devnet for testing, Mainnet for production)
- **Wallet Support**: Phantom, Solflare, Torus, Ledger
- **Programs**: Custom Solana programs for agent and server registries
- **RPC**: Direct connection to Solana RPC endpoints

### Key Components
- **WalletProvider**: Solana wallet integration and management
- **Navigation**: Responsive navigation with wallet connection
- **Registry Pages**: Agent and server discovery interfaces
- **Tokenomics**: $SVMAI token information and staking

## 🚀 Getting Started

### Prerequisites
- Node.js 18+ and npm
- Solana wallet (Phantom recommended)
- Some SOL for transaction fees
- $SVMAI tokens for staking (testnet tokens available)

### Installation
```bash
# Clone the repository
git clone https://github.com/your-org/aeamcp-frontend.git
cd aeamcp-frontend

# Install dependencies
npm install

# Start development server
npm run dev

# Build for production
npm run build

# Start production server
npm start
```

### Environment Setup
Create a `.env.local` file:
```env
NEXT_PUBLIC_SOLANA_NETWORK=devnet
NEXT_PUBLIC_RPC_ENDPOINT=https://api.devnet.solana.com
NEXT_PUBLIC_AGENT_PROGRAM_ID=your_agent_program_id
NEXT_PUBLIC_MCP_PROGRAM_ID=your_mcp_program_id
```

## 📱 PWA Features

### Offline Capabilities
- **Service Worker**: Caches essential resources for offline access
- **Manifest**: Proper PWA manifest for installation
- **Responsive**: Works seamlessly on mobile and desktop
- **Fast Loading**: Optimized for performance

### Installation
Users can install the app directly from their browser:
1. Visit the website
2. Click "Install" when prompted
3. Use as a native app on mobile/desktop

## 🔐 Security & Best Practices

### Wallet Security
- **Non-custodial**: Users maintain full control of their wallets
- **Secure Connections**: All wallet interactions use secure protocols
- **Permission-based**: Users approve each transaction explicitly

### Smart Contract Security
- **Audited Code**: Smart contracts undergo security audits
- **Immutable Logic**: Core protocol logic is immutable
- **Upgradeable Components**: Non-critical components can be upgraded via governance

## 🌐 Deployment

### Vercel (Recommended)
```bash
# Deploy to Vercel
npm run build
vercel --prod
```

### Docker
```bash
# Build Docker image
docker build -t aeamcp-frontend .

# Run container
docker run -p 3000:3000 aeamcp-frontend
```

### Static Export
```bash
# Generate static files
npm run build
npm run export
```

## 🤝 Contributing

We welcome contributions from the community! Please see our [Contributing Guide](CONTRIBUTING.md) for details.

### Development Workflow
1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🔗 Links

- **Website**: [https://aeamcp.com](https://aeamcp.com)
- **Documentation**: [https://docs.aeamcp.com](https://docs.aeamcp.com)
- **GitHub**: [https://github.com/your-org/aeamcp](https://github.com/your-org/aeamcp)
- **Discord**: [https://discord.gg/aeamcp](https://discord.gg/aeamcp)
- **Twitter**: [@AEAMCP](https://twitter.com/aeamcp)

## 🆘 Support

- **Documentation**: Check our comprehensive docs
- **Discord**: Join our community for real-time help
- **GitHub Issues**: Report bugs and request features
- **Email**: support@aeamcp.com

---

**Built with ❤️ by the AEAMCP community on Solana blockchain**
