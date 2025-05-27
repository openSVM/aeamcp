/**
 * Advanced Search and Filtering System
 * 
 * Provides sophisticated search capabilities for agents and MCP servers
 * with real-time filtering, faceted search, and intelligent ranking.
 */

import { 
  UIAgentData, 
  UIMcpServerData, 
  AgentSearchParams, 
  McpServerSearchParams,
  PaginatedResult
} from '../types/ui-types';

/**
 * Search filters interface
 */
export interface SearchFilters {
  /** Text query */
  query?: string;
  /** Status filters */
  status?: string[];
  /** Capability filters */
  capabilities?: string[];
  /** Tag filters */
  tags?: string[];
  /** Provider filters */
  providers?: string[];
  /** Rating range */
  ratingRange?: [number, number];
  /** Trust score range */
  trustScoreRange?: [number, number];
  /** Registration date range */
  dateRange?: [Date, Date];
  /** Stake requirement range (for agents) */
  stakeRange?: [number, number];
  /** Tool filters (for MCP servers) */
  tools?: string[];
}

/**
 * Search facets for dynamic filtering
 */
export interface SearchFacets {
  /** Available statuses with counts */
  statuses: Array<{ value: string; label: string; count: number }>;
  /** Available capabilities with counts */
  capabilities: Array<{ value: string; label: string; count: number }>;
  /** Available tags with counts */
  tags: Array<{ value: string; label: string; count: number }>;
  /** Available providers with counts */
  providers: Array<{ value: string; label: string; count: number }>;
  /** Available tools with counts (for MCP servers) */
  tools?: Array<{ value: string; label: string; count: number }>;
  /** Rating distribution */
  ratingDistribution: Array<{ range: string; count: number }>;
  /** Trust score distribution */
  trustScoreDistribution: Array<{ range: string; count: number }>;
}

/**
 * Search result with ranking information
 */
export interface SearchResult<T> {
  /** The item data */
  item: T;
  /** Search relevance score (0-1) */
  relevanceScore: number;
  /** Matching highlights */
  highlights: Array<{
    field: string;
    snippet: string;
    matchedTerms: string[];
  }>;
  /** Ranking factors */
  rankingFactors: {
    textMatch: number;
    popularity: number;
    trustScore: number;
    recency: number;
    overall: number;
  };
}

/**
 * Search configuration
 */
export interface SearchConfig {
  /** Enable fuzzy matching */
  fuzzyMatch?: boolean;
  /** Fuzzy matching threshold (0-1) */
  fuzzyThreshold?: number;
  /** Enable stemming */
  stemming?: boolean;
  /** Enable synonym expansion */
  synonyms?: boolean;
  /** Boost factors for different fields */
  fieldBoosts?: {
    name?: number;
    description?: number;
    tags?: number;
    provider?: number;
    capabilities?: number;
  };
  /** Ranking weights */
  rankingWeights?: {
    textMatch?: number;
    popularity?: number;
    trustScore?: number;
    recency?: number;
  };
}

/**
 * Advanced Search Engine class
 */
export class AdvancedSearchEngine {
  private readonly defaultConfig: SearchConfig = {
    fuzzyMatch: true,
    fuzzyThreshold: 0.7,
    stemming: true,
    synonyms: false,
    fieldBoosts: {
      name: 2.0,
      description: 1.0,
      tags: 1.5,
      provider: 0.8,
      capabilities: 1.3
    },
    rankingWeights: {
      textMatch: 0.4,
      popularity: 0.2,
      trustScore: 0.3,
      recency: 0.1
    }
  };

  private config: SearchConfig;

  constructor(config: Partial<SearchConfig> = {}) {
    this.config = { ...this.defaultConfig, ...config };
  }

  // ============================================================================
  // AGENT SEARCH
  // ============================================================================

  /**
   * Search agents with advanced filtering and ranking
   */
  searchAgents(
    agents: UIAgentData[],
    filters: SearchFilters,
    config: Partial<SearchConfig> = {}
  ): SearchResult<UIAgentData>[] {
    const searchConfig = { ...this.config, ...config };
    
    // Apply filters
    let filteredAgents = this.applyAgentFilters(agents, filters);
    
    // Apply text search with ranking
    if (filters.query?.trim()) {
      const searchResults = filteredAgents.map(agent => {
        const result = this.searchAgentText(agent, filters.query!.trim(), searchConfig);
        return result;
      }).filter(result => result.relevanceScore > 0);
      
      // Sort by relevance score
      return searchResults.sort((a, b) => b.relevanceScore - a.relevanceScore);
    }
    
    // No text search - return all filtered results with basic ranking
    return filteredAgents.map(agent => ({
      item: agent,
      relevanceScore: this.calculateAgentRelevanceScore(agent, '', searchConfig),
      highlights: [],
      rankingFactors: this.calculateAgentRankingFactors(agent, '', searchConfig)
    })).sort((a, b) => b.relevanceScore - a.relevanceScore);
  }

  /**
   * Apply filters to agents
   */
  private applyAgentFilters(agents: UIAgentData[], filters: SearchFilters): UIAgentData[] {
    return agents.filter(agent => {
      // Status filter
      if (filters.status?.length && !filters.status.includes(agent.status)) {
        return false;
      }
      
      // Capabilities filter
      if (filters.capabilities?.length) {
        const hasCapability = filters.capabilities.some(cap => 
          agent.capabilities.some(agentCap => 
            agentCap.toLowerCase().includes(cap.toLowerCase())
          )
        );
        if (!hasCapability) return false;
      }
      
      // Tags filter
      if (filters.tags?.length) {
        const hasTag = filters.tags.some(tag => 
          agent.tags.some(agentTag => 
            agentTag.toLowerCase().includes(tag.toLowerCase())
          )
        );
        if (!hasTag) return false;
      }
      
      // Provider filter
      if (filters.providers?.length && !filters.providers.includes(agent.provider)) {
        return false;
      }
      
      // Rating range filter
      if (filters.ratingRange) {
        const rating = agent.rating || 0;
        if (rating < filters.ratingRange[0] || rating > filters.ratingRange[1]) {
          return false;
        }
      }
      
      // Trust score range filter
      if (filters.trustScoreRange) {
        const trustScore = agent.trustScore || 0;
        if (trustScore < filters.trustScoreRange[0] || trustScore > filters.trustScoreRange[1]) {
          return false;
        }
      }
      
      // Date range filter
      if (filters.dateRange) {
        const regDate = new Date(agent.registrationDate);
        if (regDate < filters.dateRange[0] || regDate > filters.dateRange[1]) {
          return false;
        }
      }
      
      // Stake range filter
      if (filters.stakeRange && agent.stakeRequired !== undefined) {
        if (agent.stakeRequired < filters.stakeRange[0] || agent.stakeRequired > filters.stakeRange[1]) {
          return false;
        }
      }
      
      return true;
    });
  }

  /**
   * Search agent text content with relevance scoring
   */
  private searchAgentText(
    agent: UIAgentData,
    query: string,
    config: SearchConfig
  ): SearchResult<UIAgentData> {
    const queryTerms = this.normalizeQuery(query);
    const highlights: Array<{ field: string; snippet: string; matchedTerms: string[] }> = [];
    
    // Search in different fields with boosts
    const fieldMatches = {
      name: this.searchInField(agent.name, queryTerms, config),
      description: this.searchInField(agent.description, queryTerms, config),
      tags: this.searchInField(agent.tags.join(' '), queryTerms, config),
      provider: this.searchInField(agent.provider, queryTerms, config),
      capabilities: this.searchInField(agent.capabilities.join(' '), queryTerms, config)
    };
    
    // Calculate text match score
    const textMatchScore = this.calculateTextMatchScore(fieldMatches, config.fieldBoosts!);
    
    // Generate highlights
    Object.entries(fieldMatches).forEach(([field, match]) => {
      if (match.score > 0 && match.matchedTerms.length > 0) {
        highlights.push({
          field,
          snippet: this.generateSnippet(match.text, match.matchedTerms),
          matchedTerms: match.matchedTerms
        });
      }
    });
    
    // Calculate ranking factors
    const rankingFactors = this.calculateAgentRankingFactors(agent, query, config);
    
    // Calculate overall relevance score
    const relevanceScore = this.calculateAgentRelevanceScore(agent, query, config);
    
    return {
      item: agent,
      relevanceScore,
      highlights,
      rankingFactors
    };
  }

  // ============================================================================
  // MCP SERVER SEARCH
  // ============================================================================

  /**
   * Search MCP servers with advanced filtering and ranking
   */
  searchMcpServers(
    servers: UIMcpServerData[],
    filters: SearchFilters,
    config: Partial<SearchConfig> = {}
  ): SearchResult<UIMcpServerData>[] {
    const searchConfig = { ...this.config, ...config };
    
    // Apply filters
    let filteredServers = this.applyMcpServerFilters(servers, filters);
    
    // Apply text search with ranking
    if (filters.query?.trim()) {
      const searchResults = filteredServers.map(server => {
        const result = this.searchMcpServerText(server, filters.query!.trim(), searchConfig);
        return result;
      }).filter(result => result.relevanceScore > 0);
      
      // Sort by relevance score
      return searchResults.sort((a, b) => b.relevanceScore - a.relevanceScore);
    }
    
    // No text search - return all filtered results with basic ranking
    return filteredServers.map(server => ({
      item: server,
      relevanceScore: this.calculateMcpServerRelevanceScore(server, '', searchConfig),
      highlights: [],
      rankingFactors: this.calculateMcpServerRankingFactors(server, '', searchConfig)
    })).sort((a, b) => b.relevanceScore - a.relevanceScore);
  }

  /**
   * Apply filters to MCP servers
   */
  private applyMcpServerFilters(servers: UIMcpServerData[], filters: SearchFilters): UIMcpServerData[] {
    return servers.filter(server => {
      // Status filter
      if (filters.status?.length && !filters.status.includes(server.status)) {
        return false;
      }
      
      // Tools filter
      if (filters.tools?.length) {
        const hasTool = filters.tools.some(tool => 
          server.tools.some(serverTool => 
            serverTool.toLowerCase().includes(tool.toLowerCase())
          )
        );
        if (!hasTool) return false;
      }
      
      // Tags filter
      if (filters.tags?.length) {
        const hasTag = filters.tags.some(tag => 
          server.tags.some(serverTag => 
            serverTag.toLowerCase().includes(tag.toLowerCase())
          )
        );
        if (!hasTag) return false;
      }
      
      // Provider filter
      if (filters.providers?.length && server.provider && !filters.providers.includes(server.provider)) {
        return false;
      }
      
      // Rating range filter
      if (filters.ratingRange) {
        const rating = server.rating || 0;
        if (rating < filters.ratingRange[0] || rating > filters.ratingRange[1]) {
          return false;
        }
      }
      
      // Trust score range filter
      if (filters.trustScoreRange) {
        const trustScore = server.trustScore || 0;
        if (trustScore < filters.trustScoreRange[0] || trustScore > filters.trustScoreRange[1]) {
          return false;
        }
      }
      
      // Date range filter
      if (filters.dateRange) {
        const regDate = new Date(server.registrationDate);
        if (regDate < filters.dateRange[0] || regDate > filters.dateRange[1]) {
          return false;
        }
      }
      
      return true;
    });
  }

  /**
   * Search MCP server text content with relevance scoring
   */
  private searchMcpServerText(
    server: UIMcpServerData,
    query: string,
    config: SearchConfig
  ): SearchResult<UIMcpServerData> {
    const queryTerms = this.normalizeQuery(query);
    const highlights: Array<{ field: string; snippet: string; matchedTerms: string[] }> = [];
    
    // Search in different fields with boosts
    const fieldMatches = {
      name: this.searchInField(server.name, queryTerms, config),
      description: this.searchInField(server.description, queryTerms, config),
      tags: this.searchInField(server.tags.join(' '), queryTerms, config),
      provider: this.searchInField(server.provider || '', queryTerms, config),
      tools: this.searchInField(server.tools.join(' '), queryTerms, config)
    };
    
    // Calculate text match score
    const textMatchScore = this.calculateTextMatchScore(fieldMatches, config.fieldBoosts!);
    
    // Generate highlights
    Object.entries(fieldMatches).forEach(([field, match]) => {
      if (match.score > 0 && match.matchedTerms.length > 0) {
        highlights.push({
          field,
          snippet: this.generateSnippet(match.text, match.matchedTerms),
          matchedTerms: match.matchedTerms
        });
      }
    });
    
    // Calculate ranking factors
    const rankingFactors = this.calculateMcpServerRankingFactors(server, query, config);
    
    // Calculate overall relevance score
    const relevanceScore = this.calculateMcpServerRelevanceScore(server, query, config);
    
    return {
      item: server,
      relevanceScore,
      highlights,
      rankingFactors
    };
  }

  // ============================================================================
  // FACET GENERATION
  // ============================================================================

  /**
   * Generate search facets for agents
   */
  generateAgentFacets(agents: UIAgentData[]): SearchFacets {
    const statusCounts = new Map<string, number>();
    const capabilityCounts = new Map<string, number>();
    const tagCounts = new Map<string, number>();
    const providerCounts = new Map<string, number>();
    const ratingRanges = [0, 0, 0, 0, 0]; // 0-1, 1-2, 2-3, 3-4, 4-5
    const trustScoreRanges = [0, 0, 0, 0, 0]; // 0-20, 20-40, 40-60, 60-80, 80-100

    agents.forEach(agent => {
      // Count statuses
      statusCounts.set(agent.status, (statusCounts.get(agent.status) || 0) + 1);
      
      // Count capabilities
      agent.capabilities.forEach(cap => {
        capabilityCounts.set(cap, (capabilityCounts.get(cap) || 0) + 1);
      });
      
      // Count tags
      agent.tags.forEach(tag => {
        tagCounts.set(tag, (tagCounts.get(tag) || 0) + 1);
      });
      
      // Count providers
      providerCounts.set(agent.provider, (providerCounts.get(agent.provider) || 0) + 1);
      
      // Rating distribution
      const rating = agent.rating || 0;
      const ratingIndex = Math.min(Math.floor(rating), 4);
      ratingRanges[ratingIndex]++;
      
      // Trust score distribution
      const trustScore = agent.trustScore || 0;
      const trustIndex = Math.min(Math.floor(trustScore / 20), 4);
      trustScoreRanges[trustIndex]++;
    });

    return {
      statuses: Array.from(statusCounts.entries()).map(([value, count]) => ({
        value,
        label: value,
        count
      })),
      capabilities: Array.from(capabilityCounts.entries())
        .sort(([,a], [,b]) => b - a)
        .slice(0, 20) // Top 20 capabilities
        .map(([value, count]) => ({
          value,
          label: value,
          count
        })),
      tags: Array.from(tagCounts.entries())
        .sort(([,a], [,b]) => b - a)
        .slice(0, 30) // Top 30 tags
        .map(([value, count]) => ({
          value,
          label: value,
          count
        })),
      providers: Array.from(providerCounts.entries())
        .sort(([,a], [,b]) => b - a)
        .map(([value, count]) => ({
          value,
          label: value,
          count
        })),
      ratingDistribution: [
        { range: '0-1', count: ratingRanges[0] },
        { range: '1-2', count: ratingRanges[1] },
        { range: '2-3', count: ratingRanges[2] },
        { range: '3-4', count: ratingRanges[3] },
        { range: '4-5', count: ratingRanges[4] }
      ],
      trustScoreDistribution: [
        { range: '0-20', count: trustScoreRanges[0] },
        { range: '20-40', count: trustScoreRanges[1] },
        { range: '40-60', count: trustScoreRanges[2] },
        { range: '60-80', count: trustScoreRanges[3] },
        { range: '80-100', count: trustScoreRanges[4] }
      ]
    };
  }

  /**
   * Generate search facets for MCP servers
   */
  generateMcpServerFacets(servers: UIMcpServerData[]): SearchFacets {
    const statusCounts = new Map<string, number>();
    const toolCounts = new Map<string, number>();
    const tagCounts = new Map<string, number>();
    const providerCounts = new Map<string, number>();
    const ratingRanges = [0, 0, 0, 0, 0];
    const trustScoreRanges = [0, 0, 0, 0, 0];

    servers.forEach(server => {
      // Count statuses
      statusCounts.set(server.status, (statusCounts.get(server.status) || 0) + 1);
      
      // Count tools
      server.tools.forEach(tool => {
        toolCounts.set(tool, (toolCounts.get(tool) || 0) + 1);
      });
      
      // Count tags
      server.tags.forEach(tag => {
        tagCounts.set(tag, (tagCounts.get(tag) || 0) + 1);
      });
      
      // Count providers
      if (server.provider) {
        providerCounts.set(server.provider, (providerCounts.get(server.provider) || 0) + 1);
      }
      
      // Rating distribution
      const rating = server.rating || 0;
      const ratingIndex = Math.min(Math.floor(rating), 4);
      ratingRanges[ratingIndex]++;
      
      // Trust score distribution
      const trustScore = server.trustScore || 0;
      const trustIndex = Math.min(Math.floor(trustScore / 20), 4);
      trustScoreRanges[trustIndex]++;
    });

    return {
      statuses: Array.from(statusCounts.entries()).map(([value, count]) => ({
        value,
        label: value,
        count
      })),
      capabilities: [], // Not applicable for MCP servers
      tags: Array.from(tagCounts.entries())
        .sort(([,a], [,b]) => b - a)
        .slice(0, 30)
        .map(([value, count]) => ({
          value,
          label: value,
          count
        })),
      providers: Array.from(providerCounts.entries())
        .sort(([,a], [,b]) => b - a)
        .map(([value, count]) => ({
          value,
          label: value,
          count
        })),
      tools: Array.from(toolCounts.entries())
        .sort(([,a], [,b]) => b - a)
        .slice(0, 50) // Top 50 tools
        .map(([value, count]) => ({
          value,
          label: value,
          count
        })),
      ratingDistribution: [
        { range: '0-1', count: ratingRanges[0] },
        { range: '1-2', count: ratingRanges[1] },
        { range: '2-3', count: ratingRanges[2] },
        { range: '3-4', count: ratingRanges[3] },
        { range: '4-5', count: ratingRanges[4] }
      ],
      trustScoreDistribution: [
        { range: '0-20', count: trustScoreRanges[0] },
        { range: '20-40', count: trustScoreRanges[1] },
        { range: '40-60', count: trustScoreRanges[2] },
        { range: '60-80', count: trustScoreRanges[3] },
        { range: '80-100', count: trustScoreRanges[4] }
      ]
    };
  }

  // ============================================================================
  // UTILITY METHODS
  // ============================================================================

  /**
   * Normalize search query
   */
  private normalizeQuery(query: string): string[] {
    return query
      .toLowerCase()
      .replace(/[^\w\s]/g, ' ')
      .split(/\s+/)
      .filter(term => term.length > 1);
  }

  /**
   * Search in a text field
   */
  private searchInField(
    text: string,
    queryTerms: string[],
    config: SearchConfig
  ): { text: string; score: number; matchedTerms: string[] } {
    const normalizedText = text.toLowerCase();
    const matchedTerms: string[] = [];
    let score = 0;

    queryTerms.forEach(term => {
      if (normalizedText.includes(term)) {
        matchedTerms.push(term);
        // Exact word match gets higher score
        const wordBoundaryRegex = new RegExp(`\\b${term}\\b`);
        if (wordBoundaryRegex.test(normalizedText)) {
          score += 1.0;
        } else {
          score += 0.5;
        }
      } else if (config.fuzzyMatch) {
        // Fuzzy matching
        const fuzzyScore = this.calculateFuzzyMatch(term, normalizedText);
        if (fuzzyScore >= (config.fuzzyThreshold || 0.7)) {
          matchedTerms.push(term);
          score += fuzzyScore * 0.3;
        }
      }
    });

    return { text, score, matchedTerms };
  }

  /**
   * Calculate fuzzy match score
   */
  private calculateFuzzyMatch(term: string, text: string): number {
    // Simple Levenshtein distance-based fuzzy matching
    const words = text.split(/\s+/);
    let bestScore = 0;

    words.forEach(word => {
      const distance = this.levenshteinDistance(term, word);
      const maxLength = Math.max(term.length, word.length);
      const similarity = 1 - (distance / maxLength);
      bestScore = Math.max(bestScore, similarity);
    });

    return bestScore;
  }

  /**
   * Calculate Levenshtein distance
   */
  private levenshteinDistance(a: string, b: string): number {
    const matrix = Array(b.length + 1).fill(null).map(() => Array(a.length + 1).fill(null));

    for (let i = 0; i <= a.length; i++) matrix[0][i] = i;
    for (let j = 0; j <= b.length; j++) matrix[j][0] = j;

    for (let j = 1; j <= b.length; j++) {
      for (let i = 1; i <= a.length; i++) {
        const substitutionCost = a[i - 1] === b[j - 1] ? 0 : 1;
        matrix[j][i] = Math.min(
          matrix[j][i - 1] + 1, // insertion
          matrix[j - 1][i] + 1, // deletion
          matrix[j - 1][i - 1] + substitutionCost // substitution
        );
      }
    }

    return matrix[b.length][a.length];
  }

  /**
   * Calculate text match score with field boosts
   */
  private calculateTextMatchScore(
    fieldMatches: Record<string, { score: number; matchedTerms: string[] }>,
    fieldBoosts: Record<string, number>
  ): number {
    let totalScore = 0;
    let totalWeight = 0;

    Object.entries(fieldMatches).forEach(([field, match]) => {
      const boost = fieldBoosts[field] || 1.0;
      totalScore += match.score * boost;
      totalWeight += boost;
    });

    return totalWeight > 0 ? totalScore / totalWeight : 0;
  }

  /**
   * Generate text snippet with highlights
   */
  private generateSnippet(text: string, matchedTerms: string[]): string {
    const maxLength = 150;
    
    if (text.length <= maxLength) {
      return text;
    }

    // Find the first match position
    const normalizedText = text.toLowerCase();
    let firstMatchPos = text.length;
    
    matchedTerms.forEach(term => {
      const pos = normalizedText.indexOf(term.toLowerCase());
      if (pos >= 0 && pos < firstMatchPos) {
        firstMatchPos = pos;
      }
    });

    // Extract snippet around the first match
    const start = Math.max(0, firstMatchPos - 50);
    const end = Math.min(text.length, start + maxLength);
    
    let snippet = text.slice(start, end);
    
    if (start > 0) snippet = '...' + snippet;
    if (end < text.length) snippet = snippet + '...';
    
    return snippet;
  }

  /**
   * Calculate agent ranking factors
   */
  private calculateAgentRankingFactors(
    agent: UIAgentData,
    query: string,
    config: SearchConfig
  ) {
    const popularity = Math.min((agent.users || 0) / 1000, 1); // Normalize to 0-1
    const trustScore = (agent.trustScore || 0) / 100; // Already 0-1
    const rating = (agent.rating || 0) / 5; // Normalize to 0-1
    
    // Recency factor (newer is better)
    const daysSinceUpdate = (Date.now() - new Date(agent.lastUpdate).getTime()) / (1000 * 60 * 60 * 24);
    const recency = Math.max(0, 1 - (daysSinceUpdate / 30)); // Decay over 30 days
    
    const textMatch = query ? this.searchAgentText(agent, query, config).relevanceScore : 0;

    return {
      textMatch,
      popularity,
      trustScore,
      recency,
      overall: (textMatch * (config.rankingWeights?.textMatch || 0.4)) +
               (popularity * (config.rankingWeights?.popularity || 0.2)) +
               (trustScore * (config.rankingWeights?.trustScore || 0.3)) +
               (recency * (config.rankingWeights?.recency || 0.1))
    };
  }

  /**
   * Calculate MCP server ranking factors
   */
  private calculateMcpServerRankingFactors(
    server: UIMcpServerData,
    query: string,
    config: SearchConfig
  ) {
    const popularity = Math.min((server.users || 0) / 1000, 1);
    const trustScore = (server.trustScore || 0) / 100;
    const rating = (server.rating || 0) / 5;
    
    const daysSinceUpdate = (Date.now() - new Date(server.lastUpdate).getTime()) / (1000 * 60 * 60 * 24);
    const recency = Math.max(0, 1 - (daysSinceUpdate / 30));
    
    const textMatch = query ? this.searchMcpServerText(server, query, config).relevanceScore : 0;

    return {
      textMatch,
      popularity,
      trustScore,
      recency,
      overall: (textMatch * (config.rankingWeights?.textMatch || 0.4)) +
               (popularity * (config.rankingWeights?.popularity || 0.2)) +
               (trustScore * (config.rankingWeights?.trustScore || 0.3)) +
               (recency * (config.rankingWeights?.recency || 0.1))
    };
  }

  /**
   * Calculate agent relevance score
   */
  private calculateAgentRelevanceScore(agent: UIAgentData, query: string, config: SearchConfig): number {
    const factors = this.calculateAgentRankingFactors(agent, query, config);
    return factors.overall;
  }

  /**
   * Calculate MCP server relevance score
   */
  private calculateMcpServerRelevanceScore(server: UIMcpServerData, query: string, config: SearchConfig): number {
    const factors = this.calculateMcpServerRankingFactors(server, query, config);
    return factors.overall;
  }
}

// Export singleton instance
export const advancedSearchEngine = new AdvancedSearchEngine();