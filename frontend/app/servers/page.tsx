'use client';

import { useState, useEffect } from 'react';
import { Search, Filter, Plus, Server, ExternalLink, Coins, Wrench, Database, MessageSquare } from 'lucide-react';
import Link from 'next/link';

// Mock data for demonstration
const mockServers = [
  {
    id: 'financial-data-server',
    name: 'Financial Data MCP Server',
    description: 'Comprehensive financial data server providing real-time market data, historical prices, and financial analysis tools for trading applications.',
    version: '2.1.0',
    provider: 'FinanceAPI',
    providerUrl: 'https://financeapi.com',
    endpoint: 'https://api.financeapi.com/mcp',
    capabilities: {
      tools: true,
      resources: true,
      prompts: false,
    },
    toolsCount: 15,
    resourcesCount: 8,
    promptsCount: 0,
    tags: ['finance', 'data', 'real-time', 'trading'],
    status: 'Active',
    stakeRequired: 750,
    registrationDate: '2024-01-12',
    lastUpdate: '2024-01-21',
    rating: 4.7,
    users: 980,
  },
  {
    id: 'ai-model-hub',
    name: 'AI Model Hub Server',
    description: 'Access to various AI models including LLMs, image generation, and specialized AI tools through a unified MCP interface.',
    version: '1.8.2',
    provider: 'AIHub',
    providerUrl: 'https://aihub.io',
    endpoint: 'https://api.aihub.io/mcp',
    capabilities: {
      tools: true,
      resources: true,
      prompts: true,
    },
    toolsCount: 25,
    resourcesCount: 12,
    promptsCount: 18,
    tags: ['ai', 'models', 'llm', 'generation'],
    status: 'Active',
    stakeRequired: 1500,
    registrationDate: '2024-01-08',
    lastUpdate: '2024-01-20',
    rating: 4.9,
    users: 1850,
  },
  {
    id: 'blockchain-analytics',
    name: 'Blockchain Analytics Server',
    description: 'On-chain analytics and blockchain data server providing transaction analysis, wallet tracking, and DeFi protocol insights.',
    version: '3.0.1',
    provider: 'ChainAnalytics',
    providerUrl: 'https://chainanalytics.com',
    endpoint: 'https://api.chainanalytics.com/mcp',
    capabilities: {
      tools: true,
      resources: true,
      prompts: false,
    },
    toolsCount: 20,
    resourcesCount: 15,
    promptsCount: 0,
    tags: ['blockchain', 'analytics', 'defi', 'solana'],
    status: 'Active',
    stakeRequired: 1000,
    registrationDate: '2024-01-06',
    lastUpdate: '2024-01-19',
    rating: 4.8,
    users: 1420,
  },
];

export default function ServersPage() {
  const [servers, setServers] = useState(mockServers);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [capabilityFilter, setCapabilityFilter] = useState('');
  const [sortBy, setSortBy] = useState('rating');

  useEffect(() => {
    // Simulate loading
    setTimeout(() => {
      setLoading(false);
    }, 1000);
  }, []);

  const filteredServers = servers
    .filter(server => {
      if (searchTerm && !server.name.toLowerCase().includes(searchTerm.toLowerCase()) &&
          !server.description.toLowerCase().includes(searchTerm.toLowerCase()) &&
          !server.tags.some(tag => tag.toLowerCase().includes(searchTerm.toLowerCase()))) {
        return false;
      }
      if (statusFilter && server.status !== statusFilter) {
        return false;
      }
      if (capabilityFilter) {
        switch (capabilityFilter) {
          case 'tools':
            return server.capabilities.tools;
          case 'resources':
            return server.capabilities.resources;
          case 'prompts':
            return server.capabilities.prompts;
          default:
            return true;
        }
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
            MCP Servers Registry
          </h1>
          <p className="mt-2 text-gray-600 dark:text-gray-300">
            Discover Model Context Protocol servers offering AI tools and resources
          </p>
        </div>
        <Link
          href="/servers/register"
          className="mt-4 sm:mt-0 inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-gradient-to-r from-[#14F195] to-[#9945FF] hover:opacity-90 transition-opacity"
        >
          <Plus className="mr-2" size={16} />
          Register Server
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
                placeholder="Search servers by name, description, or tags..."
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
              value={capabilityFilter}
              onChange={(e) => setCapabilityFilter(e.target.value)}
              className="px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:ring-2 focus:ring-[#14F195] focus:border-transparent dark:bg-gray-700 dark:text-white"
            >
              <option value="">All Capabilities</option>
              <option value="tools">Tools</option>
              <option value="resources">Resources</option>
              <option value="prompts">Prompts</option>
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

      {/* Servers Grid */}
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
      ) : filteredServers.length === 0 ? (
        <div className="text-center py-12">
          <Server className="mx-auto h-12 w-12 text-gray-400" />
          <h3 className="mt-2 text-sm font-medium text-gray-900 dark:text-white">No servers found</h3>
          <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
            {searchTerm || statusFilter || capabilityFilter
              ? 'Try adjusting your search or filters'
              : 'Be the first to register a server'}
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredServers.map((server) => (
            <div key={server.id} className="bg-white dark:bg-gray-800 rounded-lg shadow hover:shadow-lg transition-shadow p-6">
              <div className="flex items-start justify-between mb-4">
                <div className="flex-1">
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-1">
                    {server.name}
                  </h3>
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    v{server.version} • {server.provider}
                  </p>
                </div>
                <span className={`px-2 py-1 text-xs font-medium rounded-full ${getStatusColor(server.status)}`}>
                  {server.status}
                </span>
              </div>
              
              <p className="text-gray-600 dark:text-gray-300 text-sm mb-4 line-clamp-3">
                {server.description}
              </p>
              
              {/* Rating and Users */}
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center space-x-1">
                  <span className="text-yellow-400">★</span>
                  <span className="text-sm font-medium text-gray-900 dark:text-white">
                    {server.rating}
                  </span>
                </div>
                <div className="text-sm text-gray-600 dark:text-gray-400">
                  {server.users.toLocaleString()} users
                </div>
              </div>

              {/* Stake Required */}
              <div className="flex items-center space-x-1 mb-4">
                <Coins className="text-[#14F195]" size={16} />
                <span className="text-sm text-gray-600 dark:text-gray-400">
                  {server.stakeRequired} $SVMAI required
                </span>
              </div>
              
              {/* Capabilities */}
              <div className="flex gap-2 mb-4">
                {server.capabilities.tools && (
                  <div className="flex items-center space-x-1 px-2 py-1 text-xs bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200 rounded">
                    <Wrench size={12} />
                    <span>{server.toolsCount} Tools</span>
                  </div>
                )}
                {server.capabilities.resources && (
                  <div className="flex items-center space-x-1 px-2 py-1 text-xs bg-green-100 dark:bg-green-900 text-green-800 dark:text-green-200 rounded">
                    <Database size={12} />
                    <span>{server.resourcesCount} Resources</span>
                  </div>
                )}
                {server.capabilities.prompts && (
                  <div className="flex items-center space-x-1 px-2 py-1 text-xs bg-purple-100 dark:bg-purple-900 text-purple-800 dark:text-purple-200 rounded">
                    <MessageSquare size={12} />
                    <span>{server.promptsCount} Prompts</span>
                  </div>
                )}
              </div>

              {/* Tags */}
              <div className="flex flex-wrap gap-1 mb-4">
                {server.tags.slice(0, 3).map((tag) => (
                  <span
                    key={tag}
                    className="px-2 py-1 text-xs bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded"
                  >
                    #{tag}
                  </span>
                ))}
                {server.tags.length > 3 && (
                  <span className="px-2 py-1 text-xs bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded">
                    +{server.tags.length - 3}
                  </span>
                )}
              </div>
              
              <div className="flex items-center justify-between">
                <div className="text-xs text-gray-500 dark:text-gray-400">
                  Updated {new Date(server.lastUpdate).toLocaleDateString()}
                </div>
                <div className="flex space-x-2">
                  <a
                    href={server.providerUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-gray-400 hover:text-[#14F195] transition-colors"
                  >
                    <ExternalLink size={16} />
                  </a>
                  <Link
                    href={`/servers/${server.id}`}
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