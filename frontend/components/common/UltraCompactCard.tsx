'use client';

import React from 'react';
import Link from 'next/link';

interface BaseCardData {
  id: string;
  name: string;
  description: string;
  status: string;
  version: string;
  provider: string;
  rating: number;
  users: number;
  lastUpdate: string;
}

interface AgentCardData extends BaseCardData {
  capabilities: string[];
  stakeRequired: number;
  performance?: {
    uptime: number;
    responseTime: number;
    successRate: number;
  };
}

interface MCPServerCardData extends BaseCardData {
  tools: string[];
  resources: string[];
  prompts: string[];
  performance?: {
    uptime: number;
    responseTime: number;
    requestsPerSecond: number;
  };
}

type CardData = AgentCardData | MCPServerCardData;

interface UltraCompactCardProps {
  data: CardData;
  type: 'agent' | 'mcp_server';
  href?: string;
}

const UltraCompactCard: React.FC<UltraCompactCardProps> = ({
  data,
  type,
  href,
}) => {
  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Active': return '#22c55e';
      case 'Inactive': return '#ef4444';
      case 'Pending': return '#f59e0b';
      default: return '#6b7280';
    }
  };

  const formatUsers = (users: number): string => {
    if (users >= 1000000) return `${(users / 1000000).toFixed(1)}M`;
    if (users >= 1000) return `${(users / 1000).toFixed(1)}K`;
    return users.toString();
  };

  const calculateUptime = (data: CardData): number => {
    return Math.floor((data.performance?.uptime || 0.95) * 100);
  };

  const getFeatures = () => {
    if (type === 'agent') {
      const agentData = data as AgentCardData;
      return agentData.capabilities || [];
    } else {
      const mcpData = data as MCPServerCardData;
      return mcpData.tools || [];
    }
  };

  const features = getFeatures();

  const cardContent = (
    <div 
      className="ultra-compact-card"
      style={{ '--status-color': getStatusColor(data.status) } as React.CSSProperties}
    >
      {/* Ultra-Compact Header */}
      <div className="card-header">
        <div className="header-left">
          <span className="type-indicator">
            {type === 'agent' ? '[A]' : '[M]'}
          </span>
          <span 
            className="status-dot"
            style={{ backgroundColor: getStatusColor(data.status) }}
          />
        </div>
        <div className="rating-compact">
          <span className="rating-icon">★</span>
          <span className="rating-value">{data.rating.toFixed(1)}</span>
        </div>
      </div>

      {/* Compact Title */}
      <div className="card-title">
        <h3 className="title-text" title={data.name}>
          {data.name.toUpperCase()}
        </h3>
        <span className="version-text">v{data.version}</span>
      </div>

      {/* Essential Metrics */}
      <div className="metrics-row">
        <div className="metric-item">
          <span className="metric-value">{formatUsers(data.users)}</span>
          <span className="metric-label">USR</span>
        </div>
        {type === 'agent' && (
          <div className="metric-item">
            <span className="metric-value">{(data as AgentCardData).stakeRequired}</span>
            <span className="metric-label">STK</span>
          </div>
        )}
        <div className="metric-item">
          <span className="metric-value">{calculateUptime(data)}</span>
          <span className="metric-label">UP%</span>
        </div>
      </div>

      {/* Compact Features */}
      <div className="features-compact">
        <div className="feature-tags">
          {features.slice(0, 2).map((feature, i) => (
            <span key={i} className="feature-tag" title={feature}>
              {feature.substring(0, 3).toUpperCase()}
            </span>
          ))}
          {features.length > 2 && (
            <span className="feature-tag-more" title={`${features.length - 2} more`}>
              +{features.length - 2}
            </span>
          )}
        </div>
      </div>

      {/* Minimal Footer */}
      <div className="card-footer">
        <span className="provider-text" title={data.provider}>
          {data.provider.substring(0, 8)}
        </span>
        <span className="view-link">→</span>
      </div>
    </div>
  );

  if (href) {
    return (
      <Link href={href} className="card-link">
        {cardContent}
      </Link>
    );
  }

  return cardContent;
};

export default UltraCompactCard;