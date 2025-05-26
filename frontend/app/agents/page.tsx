'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';

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
        return '[ACTIVE]';
      case 'Inactive':
        return '[INACTIVE]';
      case 'Pending':
        return '[PENDING]';
      default:
        return '[UNKNOWN]';
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8" style={{ fontFamily: "'Courier New', Courier, monospace" }}>
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-8">
        <div>
          <h1 className="ascii-section-title text-3xl mb-2">
            AI AGENTS REGISTRY
          </h1>
          <p className="ascii-body-text">
            Discover autonomous AI agents on the Solana blockchain
          </p>
        </div>
        <Link
          href="/agents/register"
          className="ascii-button-primary mt-4 sm:mt-0"
        >
          [+ REGISTER AGENT]
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

      {/* Agents Grid */}
      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[...Array(6)].map((_, i) => (
            <div key={i} className="ascii-card ascii-loading">
              <div className="h-4 w-3/4 mb-2" style={{ backgroundColor: '#D4D4D4' }}></div>
              <div className="h-3 w-1/2 mb-4" style={{ backgroundColor: '#D4D4D4' }}></div>
              <div className="h-3 w-full mb-2" style={{ backgroundColor: '#D4D4D4' }}></div>
              <div className="h-3 w-2/3" style={{ backgroundColor: '#D4D4D4' }}></div>
            </div>
          ))}
        </div>
      ) : filteredAgents.length === 0 ? (
        <div className="text-center py-12">
          <div className="ascii-card inline-block">
            <div className="ascii-logo w-16 h-12 mx-auto mb-4">
              <span className="text-2xl">[!]</span>
            </div>
            <h3 className="ascii-subsection-title">NO AGENTS FOUND</h3>
            <p className="ascii-body-text">
              {searchTerm || statusFilter
                ? 'Try adjusting your search or filters'
                : 'Be the first to register an agent'}
            </p>
          </div>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {filteredAgents.map((agent) => (
            <Link key={agent.id} href={`/agents/${agent.id}`}>
              <div className="ascii-card hover:shadow-lg transition-shadow cursor-pointer">
                {/* Compact Header */}
                <div className="flex items-center justify-between mb-2">
                  <div className="ascii-logo w-6 h-6">
                    <span className="text-sm font-bold">[BOT]</span>
                  </div>
                  <span className="ascii-status text-xs">
                    {getStatusDisplay(agent.status)}
                  </span>
                </div>
                
                {/* Title */}
                <h3 className="ascii-subsection-title text-sm mb-1 truncate">
                  {agent.name.toUpperCase()}
                </h3>
                
                {/* Version & Provider */}
                <p className="ascii-body-text text-xs mb-2" style={{ color: '#525252' }}>
                  v{agent.version} • {agent.provider}
                </p>
                
                {/* Compact Description */}
                <p className="ascii-body-text text-xs mb-3 line-clamp-2" style={{ fontSize: '0.75rem', lineHeight: '1.3' }}>
                  {agent.description.length > 80 ? `${agent.description.substring(0, 80)}...` : agent.description}
                </p>
                
                {/* Rating & Users Row */}
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center space-x-1">
                    <span className="font-bold text-xs">[*]</span>
                    <span className="ascii-body-text text-xs font-bold">
                      {agent.rating}
                    </span>
                  </div>
                  <div className="ascii-body-text text-xs">
                    {agent.users > 1000 ? `${Math.floor(agent.users/1000)}K` : agent.users} USERS
                  </div>
                </div>

                {/* Stake Required */}
                <div className="flex items-center space-x-1 mb-2">
                  <span className="font-bold text-xs">[$]</span>
                  <span className="ascii-body-text text-xs">
                    {agent.stakeRequired} $SVMAI
                  </span>
                </div>
                
                {/* Top Capabilities (max 2) */}
                <div className="mb-2">
                  <div className="flex flex-wrap gap-1">
                    {agent.capabilities.slice(0, 2).map((capability) => (
                      <span
                        key={capability}
                        className="ascii-status text-xs px-1 py-0"
                        style={{ backgroundColor: '#D4D4D4', color: '#171717', fontSize: '0.65rem' }}
                      >
                        {capability.toUpperCase()}
                      </span>
                    ))}
                    {agent.capabilities.length > 2 && (
                      <span className="ascii-status text-xs px-1 py-0" style={{ backgroundColor: '#E5E5E5', color: '#525252', fontSize: '0.65rem' }}>
                        +{agent.capabilities.length - 2}
                      </span>
                    )}
                  </div>
                </div>
                
                {/* Footer */}
                <div className="flex items-center justify-between pt-2" style={{ borderTop: '1px dotted #A3A3A3' }}>
                  <div className="ascii-body-text text-xs" style={{ color: '#525252' }}>
                    {new Date(agent.lastUpdate).toLocaleDateString()}
                  </div>
                  <div className="ascii-link text-xs">
                    VIEW →
                  </div>
                </div>
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}