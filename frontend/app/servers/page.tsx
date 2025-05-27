'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import UltraCompactCard from '../../components/common/UltraCompactCard';
import UltraCompactGrid from '../../components/common/UltraCompactGrid';
import { useI18nContext } from '../../components/common/I18nProvider';

// Mock data for demonstration
const mockServers = [
  {
    id: 'file-manager-mcp',
    name: 'File Manager MCP Server',
    description: 'Comprehensive file management server providing tools for reading, writing, and organizing files across various storage systems.',
    version: '2.1.0',
    provider: 'FileSystemCorp',
    providerUrl: 'https://filesystemcorp.com',
    endpoint: 'https://api.filesystemcorp.com/mcp',
    tools: ['read_file', 'write_file', 'list_directory', 'create_folder'],
    resources: ['file_content', 'directory_structure', 'file_metadata'],
    prompts: ['file_summary', 'directory_analysis'],
    status: 'Active',
    registrationDate: '2024-01-12',
    lastUpdate: '2024-01-22',
    rating: 4.7,
    users: 850,
  },
  {
    id: 'database-connector-mcp',
    name: 'Database Connector MCP',
    description: 'Universal database connector supporting PostgreSQL, MySQL, MongoDB, and Redis with advanced querying capabilities.',
    version: '1.8.2',
    provider: 'DataBridge',
    providerUrl: 'https://databridge.io',
    endpoint: 'https://api.databridge.io/mcp',
    tools: ['execute_query', 'create_table', 'insert_data', 'backup_database'],
    resources: ['schema_info', 'query_results', 'connection_status'],
    prompts: ['query_optimization', 'schema_design'],
    status: 'Active',
    registrationDate: '2024-01-08',
    lastUpdate: '2024-01-21',
    rating: 4.9,
    users: 1420,
  },
  {
    id: 'api-gateway-mcp',
    name: 'API Gateway MCP Server',
    description: 'Powerful API gateway and proxy server with rate limiting, authentication, and request transformation capabilities.',
    version: '3.0.1',
    provider: 'GatewayTech',
    providerUrl: 'https://gatewaytech.com',
    endpoint: 'https://api.gatewaytech.com/mcp',
    tools: ['proxy_request', 'rate_limit', 'authenticate', 'transform_data'],
    resources: ['api_specs', 'rate_limits', 'auth_tokens'],
    prompts: ['api_documentation', 'security_analysis'],
    status: 'Active',
    registrationDate: '2024-01-03',
    lastUpdate: '2024-01-20',
    rating: 4.5,
    users: 670,
  },
];

export default function ServersPage() {
  const { t } = useI18nContext();
  const [servers, setServers] = useState(mockServers);
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

  const filteredServers = servers
    .filter(server => {
      if (searchTerm && !server.name.toLowerCase().includes(searchTerm.toLowerCase()) &&
          !server.description.toLowerCase().includes(searchTerm.toLowerCase()) &&
          !server.tools.some(tool => tool.toLowerCase().includes(searchTerm.toLowerCase()))) {
        return false;
      }
      if (statusFilter && server.status !== statusFilter) {
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
            {t('servers.title')}
          </h1>
          <p className="ascii-body-text">
            {t('servers.subtitle')}
          </p>
        </div>
        <Link
          href="/servers/register"
          className="ascii-button-primary mt-4 sm:mt-0"
        >
          [+ {t('servers.register.button')}]
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
                placeholder="SEARCH SERVERS BY NAME, DESCRIPTION, OR TOOLS..."
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

      {/* Ultra-Compact Servers Grid */}
      {loading ? (
        <UltraCompactGrid loading={true} loadingItems={12} />
      ) : filteredServers.length === 0 ? (
        <div className="text-center py-8">
          <div className="ascii-card inline-block">
            <div className="ascii-logo w-12 h-8 mx-auto mb-2">
              <span className="text-lg">[!]</span>
            </div>
            <h3 className="ascii-subsection-title text-sm">NO SERVERS FOUND</h3>
            <p className="ascii-body-text text-xs">
              {searchTerm || statusFilter
                ? 'Try adjusting your search or filters'
                : 'Be the first to register an MCP server'}
            </p>
          </div>
        </div>
      ) : (
        <UltraCompactGrid>
          {filteredServers.map((server) => (
            <UltraCompactCard
              key={server.id}
              data={{
                ...server,
                performance: {
                  uptime: 0.95 + Math.random() * 0.05,
                  responseTime: 50 + Math.random() * 100,
                  requestsPerSecond: 100 + Math.random() * 500,
                }
              }}
              type="mcp_server"
              href={`/servers/${server.id}`}
            />
          ))}
        </UltraCompactGrid>
      )}
    </div>
  );
}