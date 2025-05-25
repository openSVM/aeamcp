'use client';

import { useState, useEffect } from 'react';
import { Search, Filter, Plus, Bot } from 'lucide-react';
import Link from 'next/link';
import { AgentRegistryEntry, FilterOptions } from '@/types';
import { AgentStatus } from '@/lib/constants';

// Mock data for now - will be replaced with actual Solana data fetching
const mockAgents: AgentRegistryEntry[] = [
  {
    agent_id: 'trading-bot-v1',
    name: 'Advanced Trading Agent',
    description: 'AI agent for automated trading strategies with risk management',
    agent_version: '1.0.0',
    owner_authority: {} as any,
    provider_name: 'TradingCorp',
    provider_url: 'https://tradingcorp.com',
    documentation_url: 'https://docs.tradingcorp.com/agent',
    service_endpoints: [
      {
        protocol: 'a2a_http_jsonrpc',
        url: 'https://api.tradingcorp.com/agent',
        is_default: true,
      }
    ],
    capabilities_flags: 1,
    supported_input_modes: ['application/json'],
    supported_output_modes: ['application/json'],
    skills: [
      {
        id: 'market-analysis',
        name: 'Market Analysis',
        tags: ['trading', 'analysis'],
      }
    ],
    tags: ['trading', 'defi', 'automated'],
    status: AgentStatus.Active,
    registration_timestamp: Date.now() / 1000,
    last_update_timestamp: Date.now() / 1000,
  },
];

export default function AgentsPage() {
  const [agents, setAgents] = useState<AgentRegistryEntry[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [filters, setFilters] = useState<FilterOptions>({});

  useEffect(() => {
    // Simulate loading
    setTimeout(() => {
      setAgents(mockAgents);
      setLoading(false);
    }, 1000);
  }, []);

  const filteredAgents = agents.filter(agent => {
    if (searchTerm && !agent.name.toLowerCase().includes(searchTerm.toLowerCase()) &&
        !agent.description.toLowerCase().includes(searchTerm.toLowerCase())) {
      return false;
    }
    if (filters.status !== undefined && agent.status !== filters.status) {
      return false;
    }
    return true;
  });

  const getStatusColor = (status: number) => {
    switch (status) {
      case AgentStatus.Active:
        return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200';
      case AgentStatus.Inactive:
        return 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200';
      case AgentStatus.Pending:
        return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200';
      case AgentStatus.Deregistered:
        return 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200';
      default:
        return 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200';
    }
  };

  const getStatusText = (status: number) => {
    switch (status) {
      case AgentStatus.Active:
        return 'Active';
      case AgentStatus.Inactive:
        return 'Inactive';
      case AgentStatus.Pending:
        return 'Pending';
      case AgentStatus.Deregistered:
        return 'Deregistered';
      default:
        return 'Unknown';
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
            AI Agents
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
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="flex-1">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
              <input
                type="text"
                placeholder="Search agents..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:ring-2 focus:ring-[#14F195] focus:border-transparent dark:bg-gray-700 dark:text-white"
              />
            </div>
          </div>
          <div className="flex gap-2">
            <select
              value={filters.status ?? ''}
              onChange={(e) => setFilters({ ...filters, status: e.target.value ? Number(e.target.value) : undefined })}
              className="px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:ring-2 focus:ring-[#14F195] focus:border-transparent dark:bg-gray-700 dark:text-white"
            >
              <option value="">All Status</option>
              <option value={AgentStatus.Active}>Active</option>
              <option value={AgentStatus.Inactive}>Inactive</option>
              <option value={AgentStatus.Pending}>Pending</option>
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
            {searchTerm || filters.status !== undefined
              ? 'Try adjusting your search or filters'
              : 'Be the first to register an agent'}
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredAgents.map((agent) => (
            <div key={agent.agent_id} className="bg-white dark:bg-gray-800 rounded-lg shadow hover:shadow-lg transition-shadow p-6">
              <div className="flex items-start justify-between mb-4">
                <div className="flex-1">
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-1">
                    {agent.name}
                  </h3>
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    v{agent.agent_version} • {agent.provider_name}
                  </p>
                </div>
                <span className={`px-2 py-1 text-xs font-medium rounded-full ${getStatusColor(agent.status)}`}>
                  {getStatusText(agent.status)}
                </span>
              </div>
              
              <p className="text-gray-600 dark:text-gray-300 text-sm mb-4 line-clamp-3">
                {agent.description}
              </p>
              
              <div className="flex flex-wrap gap-1 mb-4">
                {agent.tags.slice(0, 3).map((tag) => (
                  <span
                    key={tag}
                    className="px-2 py-1 text-xs bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded"
                  >
                    {tag}
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
                  {agent.skills.length} skill{agent.skills.length !== 1 ? 's' : ''}
                </div>
                <Link
                  href={`/agents/${agent.agent_id}`}
                  className="text-[#14F195] hover:underline text-sm font-medium"
                >
                  View Details →
                </Link>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}