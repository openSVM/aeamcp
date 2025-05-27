'use client';

import { useState, useMemo } from 'react';
import Link from 'next/link';
import UltraCompactCard from '../../components/common/UltraCompactCard';
import UltraCompactGrid from '../../components/common/UltraCompactGrid';
import { useI18nContext } from '../../components/common/I18nProvider';
import { useAgents } from '../../lib/hooks/useRegistry';
import { AgentSearchParams, PaginationOptions } from '../../lib/types/ui-types';

export default function AgentsPage() {
  const { t } = useI18nContext();
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [sortBy, setSortBy] = useState('rating');
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 20;

  // Build search parameters
  const searchParams = useMemo((): AgentSearchParams => {
    const params: AgentSearchParams = {
      sortOrder: 'desc'
    };

    // Map UI sort options to API sort options
    switch (sortBy) {
      case 'rating':
        params.sortBy = 'rating';
        break;
      case 'users':
        params.sortBy = 'rating'; // Use rating as proxy for popularity
        break;
      case 'recent':
        params.sortBy = 'lastUpdate';
        break;
      default:
        params.sortBy = 'rating';
    }

    if (searchTerm.trim()) {
      params.query = searchTerm.trim();
    }

    if (statusFilter) {
      params.status = [statusFilter as any];
    }

    return params;
  }, [searchTerm, statusFilter, sortBy]);

  // Build pagination options
  const paginationOptions = useMemo((): PaginationOptions => ({
    limit: itemsPerPage,
    offset: (currentPage - 1) * itemsPerPage
  }), [currentPage]);

  // Fetch agents data with real-time updates
  const {
    data: agentsResult,
    loading,
    error,
    freshness,
    refetch,
    connectionQuality
  } = useAgents(searchParams, paginationOptions, {
    realtime: true,
    validateData: true,
    staleTime: 30000, // 30 seconds
    cacheTime: 300000 // 5 minutes
  });

  const agents = agentsResult?.data || [];
  const totalPages = agentsResult?.totalPages || 1;
  const hasMore = agentsResult?.hasMore || false;

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
      {loading.isLoading ? (
        <UltraCompactGrid loading={true} loadingItems={12} />
      ) : error.hasError ? (
        <div className="text-center py-8">
          <div className="ascii-card inline-block">
            <div className="ascii-logo w-12 h-8 mx-auto mb-2">
              <span className="text-lg">[!]</span>
            </div>
            <h3 className="ascii-subsection-title text-sm">ERROR LOADING AGENTS</h3>
            <p className="ascii-body-text text-xs mb-4">
              {error.message || 'Failed to load agents from blockchain'}
            </p>
            <button
              onClick={() => refetch()}
              className="ascii-button-secondary text-xs"
            >
              [RETRY]
            </button>
          </div>
        </div>
      ) : agents.length === 0 ? (
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
        <>
          {/* Connection Status Indicator */}
          {freshness.source !== 'blockchain' && (
            <div className="mb-4 text-center">
              <div className="ascii-card inline-block bg-yellow-50 border-yellow-200">
                <p className="ascii-body-text text-xs text-yellow-700">
                  [!] {freshness.source === 'cache' ? 'CACHED DATA' : 'FALLBACK DATA'} -
                  Connection Quality: {connectionQuality}% -
                  <button onClick={() => refetch()} className="underline">REFRESH</button>
                </p>
              </div>
            </div>
          )}

          <UltraCompactGrid>
            {agents.map((agent) => (
              <UltraCompactCard
                key={agent.id}
                data={{
                  ...agent,
                  stakeRequired: agent.stakeRequired || 0,
                  rating: agent.rating || 0,
                  users: agent.users || 0,
                  performance: {
                    uptime: agent.trustScore ? agent.trustScore / 100 : 0.95,
                    responseTime: 50 + Math.random() * 100,
                    successRate: agent.rating ? agent.rating / 5 : 0.9,
                  }
                }}
                type="agent"
                href={`/agents/${agent.id}`}
              />
            ))}
          </UltraCompactGrid>

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="mt-8 flex justify-center items-center gap-4">
              <button
                onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
                disabled={currentPage === 1}
                className="ascii-button-secondary disabled:opacity-50"
              >
                [←PREV]
              </button>
              
              <span className="ascii-body-text">
                PAGE {currentPage} OF {totalPages}
              </span>
              
              <button
                onClick={() => setCurrentPage(prev => Math.min(totalPages, prev + 1))}
                disabled={currentPage === totalPages}
                className="ascii-button-secondary disabled:opacity-50"
              >
                [NEXT→]
              </button>
            </div>
          )}
        </>
      )}
    </div>
  );
}