'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useParams } from 'next/navigation';

// Mock data for agent details
const getAgentDetails = (id: string) => {
  const agents = {
    'ai-trading-bot': {
      id: 'ai-trading-bot',
      name: 'AI Trading Bot',
      version: '2.1.0',
      provider: 'TradingCorp',
      description: 'Advanced AI trading bot with machine learning capabilities for automated cryptocurrency trading on Solana DEXs.',
      longDescription: 'This sophisticated AI trading bot leverages advanced machine learning algorithms to analyze market patterns, execute trades, and manage risk across multiple Solana-based decentralized exchanges. The bot features real-time market analysis, portfolio optimization, and automated rebalancing capabilities.',
      status: 'Active',
      rating: 4.8,
      users: 15420,
      stakeRequired: 100,
      capabilities: ['Trading', 'Analysis', 'Risk Management', 'Portfolio Optimization', 'Market Prediction'],
      tags: ['defi', 'trading', 'ai', 'solana'],
      providerUrl: 'https://tradingcorp.ai',
      lastUpdate: '2024-01-15',
      owner: {
        name: 'TradingCorp Inc.',
        wallet: '7xKXtg2CW87d97TXJSDpbD5jBkheTqA83TZRuJosgHkv',
        verified: true,
        joinDate: '2023-06-15'
      },
      versions: [
        { version: '2.1.0', date: '2024-01-15', changes: 'Added portfolio optimization features' },
        { version: '2.0.5', date: '2024-01-10', changes: 'Bug fixes and performance improvements' },
        { version: '2.0.0', date: '2023-12-20', changes: 'Major update with ML improvements' },
        { version: '1.9.2', date: '2023-12-01', changes: 'Enhanced risk management' },
        { version: '1.9.0', date: '2023-11-15', changes: 'Added new trading strategies' }
      ],
      activity: [
        { type: 'update', message: 'Version 2.1.0 released', timestamp: '2024-01-15T10:30:00Z' },
        { type: 'transaction', message: 'Stake increased by 50 $SVMAI', timestamp: '2024-01-14T15:45:00Z' },
        { type: 'usage', message: '1,250 new users this week', timestamp: '2024-01-13T09:20:00Z' },
        { type: 'transaction', message: 'Revenue distribution: 125 $SVMAI', timestamp: '2024-01-12T14:15:00Z' },
        { type: 'update', message: 'Documentation updated', timestamp: '2024-01-11T11:00:00Z' }
      ],
      metrics: {
        totalTransactions: 45230,
        totalRevenue: 2340,
        averageRating: 4.8,
        uptime: 99.7,
        responseTime: 120
      }
    }
  };
  
  return agents[id as keyof typeof agents] || null;
};

// Mock real-time activity data
const useRealTimeActivity = (agentId: string) => {
  const [activity, setActivity] = useState<any[]>([]);
  
  useEffect(() => {
    const agent = getAgentDetails(agentId);
    if (agent) {
      setActivity(agent.activity);
      
      // Simulate real-time updates
      const interval = setInterval(() => {
        const newActivity = {
          type: Math.random() > 0.5 ? 'usage' : 'transaction',
          message: Math.random() > 0.5 ? 
            `${Math.floor(Math.random() * 50)} new users joined` : 
            `Transaction: ${Math.floor(Math.random() * 10)} $SVMAI`,
          timestamp: new Date().toISOString()
        };
        
        setActivity(prev => [newActivity, ...prev.slice(0, 9)]);
      }, 10000); // Update every 10 seconds
      
      return () => clearInterval(interval);
    }
  }, [agentId]);
  
  return activity;
};

export default function AgentDetailsPage() {
  const params = useParams();
  const agentId = params.id as string;
  const [agent, setAgent] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('overview');
  
  const activity = useRealTimeActivity(agentId);
  
  useEffect(() => {
    const agentData = getAgentDetails(agentId);
    setAgent(agentData);
    setLoading(false);
  }, [agentId]);

  const getActivityIcon = (type: string) => {
    switch (type) {
      case 'update': return '[↑]';
      case 'transaction': return '[$]';
      case 'usage': return '[👤]';
      default: return '[•]';
    }
  };

  const formatTimeAgo = (timestamp: string) => {
    const now = new Date();
    const time = new Date(timestamp);
    const diffMs = now.getTime() - time.getTime();
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMs / 3600000);
    const diffDays = Math.floor(diffMs / 86400000);
    
    if (diffMins < 1) return 'JUST NOW';
    if (diffMins < 60) return `${diffMins}M AGO`;
    if (diffHours < 24) return `${diffHours}H AGO`;
    return `${diffDays}D AGO`;
  };

  if (loading) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="ascii-card ascii-loading">
          <div className="h-8 w-1/2 mb-4" style={{ backgroundColor: '#D4D4D4' }}></div>
          <div className="h-4 w-3/4 mb-2" style={{ backgroundColor: '#D4D4D4' }}></div>
          <div className="h-4 w-1/2" style={{ backgroundColor: '#D4D4D4' }}></div>
        </div>
      </div>
    );
  }

  if (!agent) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="text-center py-12">
          <div className="ascii-card inline-block">
            <div className="ascii-logo w-16 h-12 mx-auto mb-4">
              <span className="text-2xl">[!]</span>
            </div>
            <h3 className="ascii-subsection-title">AGENT NOT FOUND</h3>
            <p className="ascii-body-text mb-4">
              The requested agent could not be found.
            </p>
            <Link href="/agents" className="ascii-button-primary">
              [← BACK TO AGENTS]
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8" style={{ fontFamily: "'Courier New', Courier, monospace" }}>
      {/* Header */}
      <div className="mb-8">
        <div className="flex items-center mb-4">
          <Link href="/agents" className="ascii-link mr-4">
            [← BACK TO AGENTS]
          </Link>
          <div className="ascii-logo w-8 h-8 mr-3">
            <span className="text-lg font-bold">[BOT]</span>
          </div>
        </div>
        
        <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between">
          <div className="flex-1">
            <h1 className="ascii-section-title text-3xl mb-2">
              {agent.name.toUpperCase()}
            </h1>
            <p className="ascii-body-text text-lg mb-4">
              v{agent.version} • {agent.provider}
            </p>
            <p className="ascii-body-text mb-4">
              {agent.longDescription}
            </p>
          </div>
          
          <div className="lg:ml-8 mt-4 lg:mt-0">
            <div className="ascii-card">
              <div className="grid grid-cols-2 gap-4 text-center">
                <div>
                  <div className="ascii-subsection-title text-2xl">{agent.rating}</div>
                  <div className="ascii-body-text text-sm">RATING</div>
                </div>
                <div>
                  <div className="ascii-subsection-title text-2xl">{agent.users.toLocaleString()}</div>
                  <div className="ascii-body-text text-sm">USERS</div>
                </div>
                <div>
                  <div className="ascii-subsection-title text-2xl">{agent.stakeRequired}</div>
                  <div className="ascii-body-text text-sm">$SVMAI STAKE</div>
                </div>
                <div>
                  <div className="ascii-subsection-title text-2xl">{agent.metrics.uptime}%</div>
                  <div className="ascii-body-text text-sm">UPTIME</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="mb-8">
        <div className="flex space-x-1 mb-4">
          {[
            { id: 'overview', label: 'OVERVIEW' },
            { id: 'versions', label: 'VERSIONS' },
            { id: 'owner', label: 'OWNER' },
            { id: 'activity', label: 'ACTIVITY' }
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`ascii-tab ${activeTab === tab.id ? 'ascii-tab-active' : ''}`}
            >
              [{tab.label}]
            </button>
          ))}
        </div>
      </div>

      {/* Tab Content */}
      {activeTab === 'overview' && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2">
            {/* Capabilities */}
            <div className="ascii-card mb-6">
              <h3 className="ascii-subsection-title mb-4">CAPABILITIES</h3>
              <div className="flex flex-wrap gap-2">
                {agent.capabilities.map((capability: string) => (
                  <span
                    key={capability}
                    className="ascii-status"
                    style={{ backgroundColor: '#D4D4D4', color: '#171717' }}
                  >
                    {capability.toUpperCase()}
                  </span>
                ))}
              </div>
            </div>

            {/* Tags */}
            <div className="ascii-card mb-6">
              <h3 className="ascii-subsection-title mb-4">TAGS</h3>
              <div className="flex flex-wrap gap-2">
                {agent.tags.map((tag: string) => (
                  <span
                    key={tag}
                    className="ascii-status"
                    style={{ backgroundColor: '#E5E5E5', color: '#525252' }}
                  >
                    #{tag.toUpperCase()}
                  </span>
                ))}
              </div>
            </div>

            {/* Metrics */}
            <div className="ascii-card">
              <h3 className="ascii-subsection-title mb-4">PERFORMANCE METRICS</h3>
              <div className="grid grid-cols-2 gap-4">
                <div className="ascii-info-box">
                  <div className="ascii-body-text text-sm">TOTAL TRANSACTIONS</div>
                  <div className="ascii-subsection-title">{agent.metrics.totalTransactions.toLocaleString()}</div>
                </div>
                <div className="ascii-info-box">
                  <div className="ascii-body-text text-sm">TOTAL REVENUE</div>
                  <div className="ascii-subsection-title">{agent.metrics.totalRevenue} $SVMAI</div>
                </div>
                <div className="ascii-info-box">
                  <div className="ascii-body-text text-sm">AVG RESPONSE TIME</div>
                  <div className="ascii-subsection-title">{agent.metrics.responseTime}ms</div>
                </div>
                <div className="ascii-info-box">
                  <div className="ascii-body-text text-sm">UPTIME</div>
                  <div className="ascii-subsection-title">{agent.metrics.uptime}%</div>
                </div>
              </div>
            </div>
          </div>

          <div>
            {/* Quick Actions */}
            <div className="ascii-card mb-6">
              <h3 className="ascii-subsection-title mb-4">QUICK ACTIONS</h3>
              <div className="space-y-3">
                <button className="ascii-button-primary w-full">
                  [USE AGENT]
                </button>
                <button className="ascii-button-secondary w-full">
                  [STAKE $SVMAI]
                </button>
                <a
                  href={agent.providerUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="ascii-button-secondary w-full block text-center"
                >
                  [EXTERNAL LINK]
                </a>
              </div>
            </div>

            {/* Status */}
            <div className="ascii-card">
              <h3 className="ascii-subsection-title mb-4">STATUS</h3>
              <div className="space-y-2">
                <div className="flex justify-between">
                  <span className="ascii-body-text">STATUS:</span>
                  <span className="ascii-status ascii-status-active">{agent.status.toUpperCase()}</span>
                </div>
                <div className="flex justify-between">
                  <span className="ascii-body-text">LAST UPDATE:</span>
                  <span className="ascii-body-text">{new Date(agent.lastUpdate).toLocaleDateString()}</span>
                </div>
                <div className="flex justify-between">
                  <span className="ascii-body-text">VERIFIED:</span>
                  <span className="ascii-status" style={{ backgroundColor: '#D4D4D4', color: '#171717' }}>
                    {agent.owner.verified ? 'YES' : 'NO'}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {activeTab === 'versions' && (
        <div className="ascii-card">
          <h3 className="ascii-subsection-title mb-6">VERSION HISTORY</h3>
          <div className="space-y-4">
            {agent.versions.map((version: any, index: number) => (
              <div
                key={version.version}
                className="ascii-info-box"
                style={{ borderLeft: index === 0 ? '4px solid #404040' : '4px solid #D4D4D4' }}
              >
                <div className="flex items-center justify-between mb-2">
                  <div className="ascii-subsection-title">v{version.version}</div>
                  <div className="ascii-body-text text-sm">{new Date(version.date).toLocaleDateString()}</div>
                  {index === 0 && (
                    <span className="ascii-status" style={{ backgroundColor: '#404040', color: '#FFFFFF' }}>
                      CURRENT
                    </span>
                  )}
                </div>
                <p className="ascii-body-text">{version.changes}</p>
              </div>
            ))}
          </div>
        </div>
      )}

      {activeTab === 'owner' && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <div className="ascii-card">
            <h3 className="ascii-subsection-title mb-6">OWNER INFORMATION</h3>
            <div className="space-y-4">
              <div>
                <div className="ascii-body-text text-sm mb-1">NAME:</div>
                <div className="ascii-subsection-title">{agent.owner.name}</div>
              </div>
              <div>
                <div className="ascii-body-text text-sm mb-1">WALLET ADDRESS:</div>
                <div className="ascii-body-text font-mono text-sm break-all">
                  {agent.owner.wallet}
                </div>
              </div>
              <div>
                <div className="ascii-body-text text-sm mb-1">VERIFIED:</div>
                <span className="ascii-status" style={{ backgroundColor: agent.owner.verified ? '#D4D4D4' : '#E5E5E5', color: '#171717' }}>
                  {agent.owner.verified ? 'VERIFIED' : 'UNVERIFIED'}
                </span>
              </div>
              <div>
                <div className="ascii-body-text text-sm mb-1">JOINED:</div>
                <div className="ascii-body-text">{new Date(agent.owner.joinDate).toLocaleDateString()}</div>
              </div>
            </div>
          </div>

          <div className="ascii-card">
            <h3 className="ascii-subsection-title mb-6">OWNER ACTIONS</h3>
            <div className="space-y-3">
              <button className="ascii-button-secondary w-full">
                [VIEW PROFILE]
              </button>
              <button className="ascii-button-secondary w-full">
                [CONTACT OWNER]
              </button>
              <button className="ascii-button-secondary w-full">
                [VIEW OTHER AGENTS]
              </button>
            </div>
          </div>
        </div>
      )}

      {activeTab === 'activity' && (
        <div className="ascii-card">
          <div className="flex items-center justify-between mb-6">
            <h3 className="ascii-subsection-title">REAL-TIME ACTIVITY</h3>
            <div className="flex items-center space-x-2">
              <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></div>
              <span className="ascii-body-text text-sm">LIVE</span>
            </div>
          </div>
          <div className="space-y-3 max-h-96 overflow-y-auto">
            {activity.map((item: any, index: number) => (
              <div key={index} className="ascii-info-box">
                <div className="flex items-start justify-between">
                  <div className="flex items-start space-x-3">
                    <span className="font-bold">{getActivityIcon(item.type)}</span>
                    <div>
                      <p className="ascii-body-text">{item.message}</p>
                      <p className="ascii-body-text text-xs" style={{ color: '#525252' }}>
                        {formatTimeAgo(item.timestamp)}
                      </p>
                    </div>
                  </div>
                  <span
                    className="ascii-status text-xs"
                    style={{
                      backgroundColor: item.type === 'transaction' ? '#D4D4D4' : 
                                     item.type === 'update' ? '#E5E5E5' : '#F5F5F5',
                      color: '#171717'
                    }}
                  >
                    {item.type.toUpperCase()}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}