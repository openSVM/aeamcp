'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';

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
            MCP SERVERS REGISTRY
          </h1>
          <p className="ascii-body-text">
            Discover Model Context Protocol servers on the Solana blockchain
          </p>
        </div>
        <Link
          href="/servers/register"
          className="ascii-button-primary mt-4 sm:mt-0"
        >
          [+ REGISTER MCP SERVER]
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

      {/* Servers Grid */}
      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {[...Array(6)].map((_, i) => (
            <div key={i} className="ascii-card ascii-loading">
              <div className="h-4 w-3/4 mb-2" style={{ backgroundColor: '#D4D4D4' }}></div>
              <div className="h-3 w-1/2 mb-4" style={{ backgroundColor: '#D4D4D4' }}></div>
              <div className="h-3 w-full mb-2" style={{ backgroundColor: '#D4D4D4' }}></div>
              <div className="h-3 w-2/3" style={{ backgroundColor: '#D4D4D4' }}></div>
            </div>
          ))}
        </div>
      ) : filteredServers.length === 0 ? (
        <div className="text-center py-12">
          <div className="ascii-card inline-block">
            <div className="ascii-logo w-16 h-12 mx-auto mb-4">
              <span className="text-2xl">[!]</span>
            </div>
            <h3 className="ascii-subsection-title">NO SERVERS FOUND</h3>
            <p className="ascii-body-text">
              {searchTerm || statusFilter
                ? 'Try adjusting your search or filters'
                : 'Be the first to register an MCP server'}
            </p>
          </div>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {filteredServers.map((server) => (
            <div key={server.id} className="ascii-card">
              {/* Server Header */}
              <div className="flex items-start justify-between mb-4">
                <div className="flex-1">
                  <h3 className="ascii-subsection-title text-lg mb-1">
                    {server.name.toUpperCase()}
                  </h3>
                  <p className="ascii-body-text text-sm" style={{ color: '#525252' }}>
                    v{server.version} • {server.provider}
                  </p>
                </div>
                <span className="ascii-status ascii-status-active">
                  {getStatusDisplay(server.status)}
                </span>
              </div>
              
              {/* Description */}
              <p className="ascii-body-text text-sm mb-4" style={{ fontSize: '0.875rem', lineHeight: '1.5' }}>
                {server.description}
              </p>
              
              {/* Rating and Users */}
              <div className="ascii-info-box mb-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-1">
                    <span className="font-bold">[*]</span>
                    <span className="ascii-body-text font-bold">
                      {server.rating}
                    </span>
                  </div>
                  <div className="ascii-body-text text-sm">
                    {server.users.toLocaleString()} USERS
                  </div>
                </div>
              </div>
              
              {/* Tools */}
              <div className="mb-4">
                <div className="ascii-body-text text-sm font-bold mb-2">TOOLS:</div>
                <div className="flex flex-wrap gap-1">
                  {server.tools.slice(0, 3).map((tool) => (
                    <span
                      key={tool}
                      className="ascii-status"
                      style={{ backgroundColor: '#D4D4D4', color: '#171717' }}
                    >
                      {tool.toUpperCase()}
                    </span>
                  ))}
                  {server.tools.length > 3 && (
                    <span className="ascii-status" style={{ backgroundColor: '#E5E5E5', color: '#525252' }}>
                      +{server.tools.length - 3}
                    </span>
                  )}
                </div>
              </div>

              {/* Resources */}
              <div className="mb-4">
                <div className="ascii-body-text text-sm font-bold mb-2">RESOURCES:</div>
                <div className="flex flex-wrap gap-1">
                  {server.resources.slice(0, 3).map((resource) => (
                    <span
                      key={resource}
                      className="ascii-status"
                      style={{ backgroundColor: '#E5E5E5', color: '#525252' }}
                    >
                      {resource.toUpperCase()}
                    </span>
                  ))}
                  {server.resources.length > 3 && (
                    <span className="ascii-status" style={{ backgroundColor: '#E5E5E5', color: '#525252' }}>
                      +{server.resources.length - 3}
                    </span>
                  )}
                </div>
              </div>

              {/* Prompts */}
              <div className="mb-4">
                <div className="ascii-body-text text-sm font-bold mb-2">PROMPTS:</div>
                <div className="flex flex-wrap gap-1">
                  {server.prompts.slice(0, 2).map((prompt) => (
                    <span
                      key={prompt}
                      className="ascii-status"
                      style={{ backgroundColor: '#F5F5F5', color: '#404040' }}
                    >
                      {prompt.toUpperCase()}
                    </span>
                  ))}
                  {server.prompts.length > 2 && (
                    <span className="ascii-status" style={{ backgroundColor: '#E5E5E5', color: '#525252' }}>
                      +{server.prompts.length - 2}
                    </span>
                  )}
                </div>
              </div>
              
              {/* Footer */}
              <div className="flex items-center justify-between pt-4" style={{ borderTop: '1px dotted #A3A3A3' }}>
                <div className="ascii-body-text text-xs" style={{ color: '#525252' }}>
                  UPDATED {new Date(server.lastUpdate).toLocaleDateString().toUpperCase()}
                </div>
                <div className="flex space-x-2">
                  <a
                    href={server.providerUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="ascii-link text-sm"
                  >
                    [EXT]
                  </a>
                  <Link
                    href={`/servers/${server.id}`}
                    className="ascii-link text-sm"
                  >
                    VIEW DETAILS →
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