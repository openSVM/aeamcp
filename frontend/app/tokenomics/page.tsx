import { Coins, Users, Shield, Zap, TrendingUp, Lock, Gift, Vote, ExternalLink, Copy } from 'lucide-react';
import { SVMAI_TOKEN_MINT, EXTERNAL_LINKS } from '@/lib/constants';

export default function TokenomicsPage() {
  return (
    <div className="min-h-screen bg-white dark:bg-gray-900">
      {/* Hero Section */}
      <section className="bg-gradient-to-br from-[#14F195]/10 to-[#9945FF]/10 py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <div className="flex items-center justify-center mb-6">
              <div className="w-16 h-16 bg-gradient-to-r from-[#14F195] to-[#9945FF] rounded-full flex items-center justify-center">
                <Coins className="text-white" size={32} />
              </div>
            </div>
            <h1 className="text-4xl md:text-6xl font-bold text-gray-900 dark:text-white mb-6">
              $SVMAI Token
            </h1>
            <p className="text-xl md:text-2xl text-gray-600 dark:text-gray-300 mb-8 max-w-3xl mx-auto">
              The native utility token powering the Solana AI Registries ecosystem. Governance, staking, and premium access all in one.
            </p>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-4xl mx-auto">
              <div className="bg-white dark:bg-gray-800 rounded-lg p-6">
                <div className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
                  1,000,000,000
                </div>
                <div className="text-gray-600 dark:text-gray-400">
                  Total Supply
                </div>
              </div>
              <div className="bg-white dark:bg-gray-800 rounded-lg p-6">
                <div className="text-sm font-semibold text-gray-900 dark:text-white mb-2">
                  Contract Address
                </div>
                <div className="flex items-center space-x-2 mb-3">
                  <code className="text-xs bg-gray-100 dark:bg-gray-700 px-2 py-1 rounded font-mono">
                    {SVMAI_TOKEN_MINT.toString()}
                  </code>
                  <button
                    onClick={() => navigator.clipboard.writeText(SVMAI_TOKEN_MINT.toString())}
                    className="text-gray-400 hover:text-[#14F195] transition-colors"
                    title="Copy address"
                  >
                    <Copy size={16} />
                  </button>
                </div>
                <div className="flex space-x-2">
                  <a
                    href={EXTERNAL_LINKS.SOLSCAN_TOKEN}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center px-3 py-1 text-xs bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200 rounded hover:opacity-80 transition-opacity"
                  >
                    Solscan <ExternalLink size={12} className="ml-1" />
                  </a>
                  <a
                    href={EXTERNAL_LINKS.JUPITER_SWAP}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center px-3 py-1 text-xs bg-green-100 dark:bg-green-900 text-green-800 dark:text-green-200 rounded hover:opacity-80 transition-opacity"
                  >
                    Jupiter <ExternalLink size={12} className="ml-1" />
                  </a>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Token Utility */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-4">
              Token Utility
            </h2>
            <p className="text-lg text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
              $SVMAI serves multiple critical functions within the AEAMCP ecosystem
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            <div className="bg-gray-50 dark:bg-gray-800 rounded-lg p-6 text-center">
              <div className="w-12 h-12 bg-gradient-to-r from-[#14F195] to-[#9945FF] rounded-lg flex items-center justify-center mx-auto mb-4">
                <Vote className="text-white" size={24} />
              </div>
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                Governance
              </h3>
              <p className="text-gray-600 dark:text-gray-300 text-sm">
                Vote on protocol upgrades, parameter changes, and ecosystem proposals
              </p>
            </div>

            <div className="bg-gray-50 dark:bg-gray-800 rounded-lg p-6 text-center">
              <div className="w-12 h-12 bg-gradient-to-r from-[#14F195] to-[#9945FF] rounded-lg flex items-center justify-center mx-auto mb-4">
                <Lock className="text-white" size={24} />
              </div>
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                Staking
              </h3>
              <p className="text-gray-600 dark:text-gray-300 text-sm">
                Stake tokens to secure the network and earn rewards from protocol fees
              </p>
            </div>

            <div className="bg-gray-50 dark:bg-gray-800 rounded-lg p-6 text-center">
              <div className="w-12 h-12 bg-gradient-to-r from-[#14F195] to-[#9945FF] rounded-lg flex items-center justify-center mx-auto mb-4">
                <Zap className="text-white" size={24} />
              </div>
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                Premium Access
              </h3>
              <p className="text-gray-600 dark:text-gray-300 text-sm">
                Access premium AI agents, advanced features, and priority support
              </p>
            </div>

            <div className="bg-gray-50 dark:bg-gray-800 rounded-lg p-6 text-center">
              <div className="w-12 h-12 bg-gradient-to-r from-[#14F195] to-[#9945FF] rounded-lg flex items-center justify-center mx-auto mb-4">
                <Gift className="text-white" size={24} />
              </div>
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                Incentives
              </h3>
              <p className="text-gray-600 dark:text-gray-300 text-sm">
                Earn tokens for registering quality agents and contributing to the ecosystem
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Token Distribution */}
      <section className="py-20 bg-gray-50 dark:bg-gray-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-4">
              Token Distribution
            </h2>
            <p className="text-lg text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
              Fair and sustainable distribution designed for long-term ecosystem growth
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            <div className="bg-white dark:bg-gray-900 rounded-lg p-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                  Community & Ecosystem
                </h3>
                <span className="text-2xl font-bold text-[#14F195]">40%</span>
              </div>
              <p className="text-gray-600 dark:text-gray-300 text-sm mb-4">
                Rewards for users, developers, and ecosystem participants
              </p>
              <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                <div className="bg-gradient-to-r from-[#14F195] to-[#9945FF] h-2 rounded-full" style={{width: '40%'}}></div>
              </div>
            </div>

            <div className="bg-white dark:bg-gray-900 rounded-lg p-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                  Development Team
                </h3>
                <span className="text-2xl font-bold text-[#14F195]">20%</span>
              </div>
              <p className="text-gray-600 dark:text-gray-300 text-sm mb-4">
                Core team allocation with 4-year vesting schedule
              </p>
              <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                <div className="bg-gradient-to-r from-[#14F195] to-[#9945FF] h-2 rounded-full" style={{width: '20%'}}></div>
              </div>
            </div>

            <div className="bg-white dark:bg-gray-900 rounded-lg p-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                  Treasury & DAO
                </h3>
                <span className="text-2xl font-bold text-[#14F195]">15%</span>
              </div>
              <p className="text-gray-600 dark:text-gray-300 text-sm mb-4">
                Protocol treasury managed by the DAO
              </p>
              <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                <div className="bg-gradient-to-r from-[#14F195] to-[#9945FF] h-2 rounded-full" style={{width: '15%'}}></div>
              </div>
            </div>

            <div className="bg-white dark:bg-gray-900 rounded-lg p-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                  Liquidity & Market Making
                </h3>
                <span className="text-2xl font-bold text-[#14F195]">10%</span>
              </div>
              <p className="text-gray-600 dark:text-gray-300 text-sm mb-4">
                DEX liquidity and market making operations
              </p>
              <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                <div className="bg-gradient-to-r from-[#14F195] to-[#9945FF] h-2 rounded-full" style={{width: '10%'}}></div>
              </div>
            </div>

            <div className="bg-white dark:bg-gray-900 rounded-lg p-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                  Advisors & Partners
                </h3>
                <span className="text-2xl font-bold text-[#14F195]">10%</span>
              </div>
              <p className="text-gray-600 dark:text-gray-300 text-sm mb-4">
                Strategic advisors and ecosystem partners
              </p>
              <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                <div className="bg-gradient-to-r from-[#14F195] to-[#9945FF] h-2 rounded-full" style={{width: '10%'}}></div>
              </div>
            </div>

            <div className="bg-white dark:bg-gray-900 rounded-lg p-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                  Reserve Fund
                </h3>
                <span className="text-2xl font-bold text-[#14F195]">5%</span>
              </div>
              <p className="text-gray-600 dark:text-gray-300 text-sm mb-4">
                Emergency reserve for unforeseen circumstances
              </p>
              <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                <div className="bg-gradient-to-r from-[#14F195] to-[#9945FF] h-2 rounded-full" style={{width: '5%'}}></div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Staking & Rewards */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-4">
              Staking & Rewards
            </h2>
            <p className="text-lg text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
              Earn rewards by participating in network security and governance
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="bg-gray-50 dark:bg-gray-800 rounded-lg p-8 text-center">
              <div className="text-3xl font-bold text-[#14F195] mb-2">8-12%</div>
              <div className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                Annual Staking Yield
              </div>
              <p className="text-gray-600 dark:text-gray-300 text-sm">
                Competitive rewards for long-term stakers
              </p>
            </div>

            <div className="bg-gray-50 dark:bg-gray-800 rounded-lg p-8 text-center">
              <div className="text-3xl font-bold text-[#14F195] mb-2">30 Days</div>
              <div className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                Minimum Staking Period
              </div>
              <p className="text-gray-600 dark:text-gray-300 text-sm">
                Flexible staking with reasonable lock-up
              </p>
            </div>

            <div className="bg-gray-50 dark:bg-gray-800 rounded-lg p-8 text-center">
              <div className="text-3xl font-bold text-[#14F195] mb-2">1,000</div>
              <div className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                Minimum Stake
              </div>
              <p className="text-gray-600 dark:text-gray-300 text-sm">
                Accessible staking for all community members
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Roadmap */}
      <section className="py-20 bg-gray-50 dark:bg-gray-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-4">
              Token Roadmap
            </h2>
            <p className="text-lg text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
              Our planned milestones for $SVMAI token development and adoption
            </p>
          </div>

          <div className="space-y-8">
            <div className="flex items-start space-x-4">
              <div className="w-8 h-8 bg-gradient-to-r from-[#14F195] to-[#9945FF] rounded-full flex items-center justify-center flex-shrink-0">
                <span className="text-white text-sm font-bold">1</span>
              </div>
              <div>
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                  Q1 2024 - Token Launch & Initial Distribution
                </h3>
                <p className="text-gray-600 dark:text-gray-300">
                  Launch $SVMAI token on Solana, initial distribution to early adopters, and basic staking functionality.
                </p>
              </div>
            </div>

            <div className="flex items-start space-x-4">
              <div className="w-8 h-8 bg-gradient-to-r from-[#14F195] to-[#9945FF] rounded-full flex items-center justify-center flex-shrink-0">
                <span className="text-white text-sm font-bold">2</span>
              </div>
              <div>
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                  Q2 2024 - Governance Implementation
                </h3>
                <p className="text-gray-600 dark:text-gray-300">
                  Launch DAO governance system, enable community voting on protocol parameters and upgrades.
                </p>
              </div>
            </div>

            <div className="flex items-start space-x-4">
              <div className="w-8 h-8 bg-gradient-to-r from-[#14F195] to-[#9945FF] rounded-full flex items-center justify-center flex-shrink-0">
                <span className="text-white text-sm font-bold">3</span>
              </div>
              <div>
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                  Q3 2024 - Premium Features & Marketplace
                </h3>
                <p className="text-gray-600 dark:text-gray-300">
                  Launch premium AI agent marketplace, implement token-gated features and advanced analytics.
                </p>
              </div>
            </div>

            <div className="flex items-start space-x-4">
              <div className="w-8 h-8 bg-gray-300 dark:bg-gray-600 rounded-full flex items-center justify-center flex-shrink-0">
                <span className="text-gray-600 dark:text-gray-400 text-sm font-bold">4</span>
              </div>
              <div>
                <h3 className="text-lg font-semibold text-gray-600 dark:text-gray-400 mb-2">
                  Q4 2024 - Cross-Chain Integration
                </h3>
                <p className="text-gray-500 dark:text-gray-500">
                  Expand to other blockchains, implement cross-chain bridges and multi-chain governance.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}