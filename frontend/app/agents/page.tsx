'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import UltraCompactCard from '../../components/common/UltraCompactCard';
import UltraCompactGrid from '../../components/common/UltraCompactGrid';
import { useI18nContext } from '../../components/common/I18nProvider';

// Mock data for demonstration
const mockAgents = [
  {
    id: 'trading-bot-v1',
    name: 'Advanced Trading Agent',
    description: 'AI agent for automated trading strategies with risk management and portfolio optimization. Supports multiple DEXs and advanced order types.',
    version: '1.2.0',
    provider: 'TradingCorp',
    providerUrl: 'https://tradingcorp.com',
    endpoint: 'https://api.tradingcorp.com/agent',
    capabilities: ['Trading', 'Risk Management', 'Portfolio Analysis'],
    tags: ['trading', 'defi', 'automated', 'solana'],
    status: 'Active',
    stakeRequired: 1000,
    registrationDate: '2024-01-15',
    lastUpdate: '2024-01-20',
    rating: 4.8,
    users: 1250,
  },
  {
    id: 'nft-analyzer-pro',
    name: 'NFT Market Analyzer',
    description: 'Comprehensive NFT market analysis agent providing real-time pricing, rarity scoring, and trend predictions across major marketplaces.',
    version: '2.0.1',
    provider: 'NFTLabs',
    providerUrl: 'https://nftlabs.io',
    endpoint: 'https://api.nftlabs.io/analyzer',
    capabilities: ['Market Analysis', 'Rarity Scoring', 'Price Prediction'],
    tags: ['nft', 'analysis', 'marketplace', 'solana'],
    status: 'Active',
    stakeRequired: 500,
    registrationDate: '2024-01-10',
    lastUpdate: '2024-01-18',
    rating: 4.6,
    users: 890,
  },
  {
    id: 'defi-yield-optimizer',
    name: 'DeFi Yield Optimizer',
    description: 'Intelligent yield farming agent that automatically finds and executes optimal yield strategies across Solana DeFi protocols.',
    version: '1.5.3',
    provider: 'YieldMax',
    providerUrl: 'https://yieldmax.fi',
    endpoint: 'https://api.yieldmax.fi/optimizer',
    capabilities: ['Yield Farming', 'Strategy Optimization', 'Risk Assessment'],
    tags: ['defi', 'yield', 'farming', 'optimization'],
    status: 'Active',
    stakeRequired: 2000,
    registrationDate: '2024-01-05',
    lastUpdate: '2024-01-19',
    rating: 4.9,
    users: 2100,
  },
];

export default function AgentsPage() {
  const { t } = useI18nContext();
  const [agents, setAgents] = useState(mockAgents);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [sortBy, setSortBy] = useState('rating');

  useEffect(() => {
    // Simulate loading
    setTimeout(() => {
      setLoading(false);
    }, 1000);
  }, []);

  const filteredAgents = agents
    .filter(agent => {
      if (searchTerm && !agent.name.toLowerCase().includes(searchTerm.toLowerCase()) &&
          !agent.description.toLowerCase().includes(searchTerm.toLowerCase()) &&
          !agent.tags.some(tag => tag.toLowerCase().includes(searchTerm.toLowerCase()))) {
        return false;
      }
      if (statusFilter && agent.status !== statusFilter) {
        return false;
      }
      return true;
    })
    .sort((a, b) => {
      switch (sortBy) {
        case 'rating':
          return b.rating - a.rating;
        case 'users':
          return b.users - a.users;
        case 'recent':
          return new Date(b.lastUpdate).getTime() - new Date(a.lastUpdate).getTime();
        default:
          return 0;
      }
    });

  const getStatusDisplay = (status: string) => {
    switch (status) {
      case 'Active':
        return t('agents.status.active');
      case 'Inactive':
        return t('agents.status.inactive');
      case 'Pending':
        return t('agents.status.pending');
      default:
        return t('agents.status.unknown');
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8" style={{ fontFamily: "'Courier New', Courier, monospace" }}>
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-8">
        <div>
          <h1 className="ascii-section-title text-3xl mb-2">
            {t('agents.title')}
          </h1>
          <p className="ascii-body-text">
            {t('agents.subtitle')}
          </p>
        </div>
        <Link
          href="/agents/register"
          className="ascii-button-primary mt-4 sm:mt-0"
        >
          [+ {t('agents.register.button')}]
        </Link>
      </div>

      {/* Search and Filters */}
      <div className="ascii-card mb-8">
        <div className="flex flex-col lg:flex-row gap-4">
          <div className="flex-1">
            <div className="relative">
              <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500 font-bold">[?]</span>
              <input
                type="text"
                placeholder="SEARCH AGENTS BY NAME, DESCRIPTION, OR TAGS..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="ascii-input w-full pl-10 pr-4"
              />
            </div>
          </div>
          <div className="flex gap-2">
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="ascii-select"
            >
              <option value="">ALL STATUS</option>
              <option value="Active">ACTIVE</option>
              <option value="Inactive">INACTIVE</option>
              <option value="Pending">PENDING</option>
            </select>
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="ascii-select"
            >
              <option value="rating">SORT BY RATING</option>
              <option value="users">SORT BY USERS</option>
              <option value="recent">SORT BY RECENT</option>
            </select>
          </div>
        </div>
      </div>

      {/* Ultra-Compact Agents Grid */}
      {loading ? (
        <UltraCompactGrid loading={true} loadingItems={12} />
      ) : filteredAgents.length === 0 ? (
        <div className="text-center py-8">
          <div className="ascii-card inline-block">
            <div className="ascii-logo w-12 h-8 mx-auto mb-2">
              <span className="text-lg">[!]</span>
            </div>
            <h3 className="ascii-subsection-title text-sm">NO AGENTS FOUND</h3>
            <p className="ascii-body-text text-xs">
              {searchTerm || statusFilter
                ? 'Try adjusting your search or filters'
                : 'Be the first to register an agent'}
            </p>
          </div>
        </div>
      ) : (
        <UltraCompactGrid>
          {filteredAgents.map((agent) => (
            <UltraCompactCard
              key={agent.id}
              data={{
                ...agent,
                performance: {
                  uptime: 0.95 + Math.random() * 0.05,
                  responseTime: 50 + Math.random() * 100,
                  successRate: 0.9 + Math.random() * 0.1,
                }
              }}
              type="agent"
              href={`/agents/${agent.id}`}
            />
          ))}
        </UltraCompactGrid>
      )}
    </div>
  );
}