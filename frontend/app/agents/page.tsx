'use client';

import { useState, useEffect } from 'react';
import { Search, Filter, Plus, Bot, ExternalLink, Coins } from 'lucide-react';
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

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Active':
        return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200';
      case 'Inactive':
        return 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200';
      case 'Pending':
        return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200';
      default:
        return 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200';
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
            AI Agents Registry
          </h1>
          <p className="mt-2 text-gray-600 dark:text-gray-300">
            Discover autonomous AI agents on the Solana blockchain
          </p>
        </div>
        <Link
          href="/agents/register"
          className="mt-4 sm:mt-0 inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-gradient-to-r from-[#14F195] to-[#9945FF] hover:opacity-90 transition-opacity"
        >
          <Plus className="mr-2" size={16} />
          Register Agent
        </Link>
      </div>

      {/* Search and Filters */}
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6 mb-8">
        <div className="flex flex-col lg:flex-row gap-4">
          <div className="flex-1">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
              <input
                type="text"
                placeholder="Search agents by name, description, or tags..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:ring-2 focus:ring-[#14F195] focus:border-transparent dark:bg-gray-700 dark:text-white"
              />
            </div>
          </div>
          <div className="flex gap-2">
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:ring-2 focus:ring-[#14F195] focus:border-transparent dark:bg-gray-700 dark:text-white"
            >
              <option value="">All Status</option>
              <option value="Active">Active</option>
              <option value="Inactive">Inactive</option>
              <option value="Pending">Pending</option>
            </select>
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:ring-2 focus:ring-[#14F195] focus:border-transparent dark:bg-gray-700 dark:text-white"
            >
              <option value="rating">Sort by Rating</option>
              <option value="users">Sort by Users</option>
              <option value="recent">Sort by Recent</option>
            </select>
          </div>
        </div>
      </div>

      {/* Agents Grid */}
      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[...Array(6)].map((_, i) => (
            <div key={i} className="bg-white dark:bg-gray-800 rounded-lg shadow p-6 animate-pulse">
              <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-3/4 mb-2"></div>
              <div className="h-3 bg-gray-200 dark:bg-gray-700 rounded w-1/2 mb-4"></div>
              <div className="h-3 bg-gray-200 dark:bg-gray-700 rounded w-full mb-2"></div>
              <div className="h-3 bg-gray-200 dark:bg-gray-700 rounded w-2/3"></div>
            </div>
          ))}
        </div>
      ) : filteredAgents.length === 0 ? (
        <div className="text-center py-12">
          <Bot className="mx-auto h-12 w-12 text-gray-400" />
          <h3 className="mt-2 text-sm font-medium text-gray-900 dark:text-white">No agents found</h3>
          <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
            {searchTerm || statusFilter
              ? 'Try adjusting your search or filters'
              : 'Be the first to register an agent'}
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredAgents.map((agent) => (
            <div key={agent.id} className="bg-white dark:bg-gray-800 rounded-lg shadow hover:shadow-lg transition-shadow p-6">
              <div className="flex items-start justify-between mb-4">
                <div className="flex-1">
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-1">
                    {agent.name}
                  </h3>
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    v{agent.version} • {agent.provider}
                  </p>
                </div>
                <span className={`px-2 py-1 text-xs font-medium rounded-full ${getStatusColor(agent.status)}`}>
                  {agent.status}
                </span>
              </div>
              
              <p className="text-gray-600 dark:text-gray-300 text-sm mb-4 line-clamp-3">
                {agent.description}
              </p>
              
              {/* Rating and Users */}
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center space-x-1">
                  <span className="text-yellow-400">★</span>
                  <span className="text-sm font-medium text-gray-900 dark:text-white">
                    {agent.rating}
                  </span>
                </div>
                <div className="text-sm text-gray-600 dark:text-gray-400">
                  {agent.users.toLocaleString()} users
                </div>
              </div>

              {/* Stake Required */}
              <div className="flex items-center space-x-1 mb-4">
                <Coins className="text-[#14F195]" size={16} />
                <span className="text-sm text-gray-600 dark:text-gray-400">
                  {agent.stakeRequired} $SVMAI required
                </span>
              </div>
              
              {/* Capabilities */}
              <div className="flex flex-wrap gap-1 mb-4">
                {agent.capabilities.slice(0, 3).map((capability) => (
                  <span
                    key={capability}
                    className="px-2 py-1 text-xs bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200 rounded"
                  >
                    {capability}
                  </span>
                ))}
                {agent.capabilities.length > 3 && (
                  <span className="px-2 py-1 text-xs bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded">
                    +{agent.capabilities.length - 3}
                  </span>
                )}
              </div>

              {/* Tags */}
              <div className="flex flex-wrap gap-1 mb-4">
                {agent.tags.slice(0, 3).map((tag) => (
                  <span
                    key={tag}
                    className="px-2 py-1 text-xs bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded"
                  >
                    #{tag}
                  </span>
                ))}
                {agent.tags.length > 3 && (
                  <span className="px-2 py-1 text-xs bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded">
                    +{agent.tags.length - 3}
                  </span>
                )}
              </div>
              
              <div className="flex items-center justify-between">
                <div className="text-xs text-gray-500 dark:text-gray-400">
                  Updated {new Date(agent.lastUpdate).toLocaleDateString()}
                </div>
                <div className="flex space-x-2">
                  <a
                    href={agent.providerUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-gray-400 hover:text-[#14F195] transition-colors"
                  >
                    <ExternalLink size={16} />
                  </a>
                  <Link
                    href={`/agents/${agent.id}`}
                    className="text-[#14F195] hover:underline text-sm font-medium"
                  >
                    View Details →
                  </Link>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}