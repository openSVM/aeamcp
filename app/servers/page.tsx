'use client';

import { useState, useEffect } from 'react';
import { Search, Filter, Plus, Server } from 'lucide-react';
import Link from 'next/link';
import { McpServerRegistryEntry, FilterOptions } from '@/types';
import { McpServerStatus } from '@/lib/constants';

// Mock data for now - will be replaced with actual Solana data fetching
const mockServers: McpServerRegistryEntry[] = [
  {
    server_id: 'financial-data-server',
    name: 'Financial Data MCP Server',
    server_version: '2.1.0',
    owner_authority: {} as any,
    service_endpoint: 'https://api.findata.com/mcp',
    documentation_url: 'https://docs.findata.com',
    server_capabilities_summary: 'Real-time financial data and analysis tools',
    supports_resources: true,
    supports_tools: true,
    supports_prompts: false,
    onchain_tool_definitions: [
      {
        name: 'get-stock-price',
        description_hash: [1, 2, 3],
        input_schema_hash: [4, 5, 6],
        output_schema_hash: [7, 8, 9],
        tags: ['stocks', 'price'],
      }
    ],
    onchain_resource_definitions: [
      {
        uri_pattern: 'stock://symbol/*',
        description_hash: [10, 11, 12],
        tags: ['stocks'],
      }
    ],
    onchain_prompt_definitions: [],
    full_capabilities_uri: 'https://ipfs.io/ipfs/QmServer...',
    tags: ['finance', 'data', 'real-time'],
    status: McpServerStatus.Active,
    registration_timestamp: Date.now() / 1000,
    last_update_timestamp: Date.now() / 1000,
  },
];

export default function ServersPage() {
  const [servers, setServers] = useState<McpServerRegistryEntry[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [filters, setFilters] = useState<FilterOptions>({});

  useEffect(() => {
    // Simulate loading
    setTimeout(() => {
      setServers(mockServers);
      setLoading(false);
    }, 1000);
  }, []);

  const filteredServers = servers.filter(server => {
    if (searchTerm && !server.name.toLowerCase().includes(searchTerm.toLowerCase()) &&
        !server.server_capabilities_summary?.toLowerCase().includes(searchTerm.toLowerCase())) {
      return false;
    }
    if (filters.status !== undefined && server.status !== filters.status) {
      return false;
    }
    return true;
  });

  const getStatusColor = (status: number) => {
    switch (status) {
      case McpServerStatus.Active:
        return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200';
      case McpServerStatus.Inactive:
        return 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200';
      case McpServerStatus.Pending:
        return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200';
      case McpServerStatus.Deregistered:
        return 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200';
      default:
        return 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200';
    }
  };

  const getStatusText = (status: number) => {
    switch (status) {
      case McpServerStatus.Active:
        return 'Active';
      case McpServerStatus.Inactive:
        return 'Inactive';
      case McpServerStatus.Pending:
        return 'Pending';
      case McpServerStatus.Deregistered:
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
            MCP Servers
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
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="flex-1">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
              <input
                type="text"
                placeholder="Search servers..."
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
              <option value={McpServerStatus.Active}>Active</option>
              <option value={McpServerStatus.Inactive}>Inactive</option>
              <option value={McpServerStatus.Pending}>Pending</option>
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
            {searchTerm || filters.status !== undefined
              ? 'Try adjusting your search or filters'
              : 'Be the first to register a server'}
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredServers.map((server) => (
            <div key={server.server_id} className="bg-white dark:bg-gray-800 rounded-lg shadow hover:shadow-lg transition-shadow p-6">
              <div className="flex items-start justify-between mb-4">
                <div className="flex-1">
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-1">
                    {server.name}
                  </h3>
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    v{server.server_version}
                  </p>
                </div>
                <span className={`px-2 py-1 text-xs font-medium rounded-full ${getStatusColor(server.status)}`}>
                  {getStatusText(server.status)}
                </span>
              </div>
              
              <p className="text-gray-600 dark:text-gray-300 text-sm mb-4 line-clamp-3">
                {server.server_capabilities_summary || 'No description available'}
              </p>
              
              {/* Capabilities */}
              <div className="flex gap-2 mb-4">
                {server.supports_tools && (
                  <span className="px-2 py-1 text-xs bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200 rounded">
                    Tools
                  </span>
                )}
                {server.supports_resources && (
                  <span className="px-2 py-1 text-xs bg-green-100 dark:bg-green-900 text-green-800 dark:text-green-200 rounded">
                    Resources
                  </span>
                )}
                {server.supports_prompts && (
                  <span className="px-2 py-1 text-xs bg-purple-100 dark:bg-purple-900 text-purple-800 dark:text-purple-200 rounded">
                    Prompts
                  </span>
                )}
              </div>
              
              <div className="flex flex-wrap gap-1 mb-4">
                {server.tags.slice(0, 3).map((tag) => (
                  <span
                    key={tag}
                    className="px-2 py-1 text-xs bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded"
                  >
                    {tag}
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
                  {server.onchain_tool_definitions.length} tool{server.onchain_tool_definitions.length !== 1 ? 's' : ''}
                </div>
                <Link
                  href={`/servers/${server.server_id}`}
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