'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useParams } from 'next/navigation';
import { useI18nContext } from '../../../components/common/I18nProvider';

// Mock data for server details
const getServerDetails = (id: string) => {
  const servers = {
    'file-manager-mcp': {
      id: 'file-manager-mcp',
      name: 'File Manager MCP',
      version: '1.5.2',
      provider: 'DevTools Inc',
      description: 'Comprehensive file management MCP server with advanced file operations and cloud storage integration.',
      longDescription: 'A powerful Model Context Protocol server that provides comprehensive file management capabilities including local file operations, cloud storage integration, file compression, and advanced search functionality. Supports multiple storage backends and provides secure file handling with encryption.',
      status: 'Active',
      rating: 4.6,
      users: 8750,
      stakeRequired: 75,
      tools: ['read_file', 'write_file', 'list_files', 'delete_file', 'compress_file'],
      resources: ['file://', 'cloud://', 'ftp://'],
      prompts: ['file_search', 'batch_operations'],
      tags: ['files', 'storage', 'cloud', 'management'],
      providerUrl: 'https://devtools.inc',
      lastUpdate: '2024-01-12',
      owner: {
        name: 'DevTools Inc.',
        wallet: '9yKXtg2CW87d97TXJSDpbD5jBkheTqA83TZRuJosgHkv',
        verified: true,
        joinDate: '2023-08-20'
      },
      versions: [
        { version: '1.5.2', date: '2024-01-12', changes: 'Added cloud storage encryption support' },
        { version: '1.5.1', date: '2024-01-08', changes: 'Performance optimizations for large files' },
        { version: '1.5.0', date: '2023-12-28', changes: 'New batch operations and file compression' },
        { version: '1.4.3', date: '2023-12-15', changes: 'Bug fixes in file permissions handling' },
        { version: '1.4.0', date: '2023-11-30', changes: 'Added FTP and cloud storage support' }
      ],
      activity: [
        { type: 'update', message: 'Version 1.5.2 released with encryption', timestamp: '2024-01-12T14:20:00Z' },
        { type: 'transaction', message: 'Stake increased by 25 $SVMAI', timestamp: '2024-01-11T16:30:00Z' },
        { type: 'usage', message: '850 new integrations this week', timestamp: '2024-01-10T10:45:00Z' },
        { type: 'transaction', message: 'Revenue distribution: 87 $SVMAI', timestamp: '2024-01-09T13:25:00Z' },
        { type: 'update', message: 'API documentation updated', timestamp: '2024-01-08T09:15:00Z' }
      ],
      metrics: {
        totalRequests: 125680,
        totalRevenue: 1850,
        averageRating: 4.6,
        uptime: 99.9,
        responseTime: 85
      },
      endpoints: [
        { name: 'read_file', description: 'Read file contents', usage: 45230 },
        { name: 'write_file', description: 'Write data to file', usage: 32150 },
        { name: 'list_files', description: 'List directory contents', usage: 28940 },
        { name: 'delete_file', description: 'Delete file or directory', usage: 12680 },
        { name: 'compress_file', description: 'Compress files and folders', usage: 6680 }
      ]
    }
  };
  
  return servers[id as keyof typeof servers] || null;
};

// Mock real-time activity data
const useRealTimeActivity = (serverId: string) => {
  const [activity, setActivity] = useState<any[]>([]);
  
  useEffect(() => {
    const server = getServerDetails(serverId);
    if (server) {
      setActivity(server.activity);
      
      // Simulate real-time updates
      const interval = setInterval(() => {
        const newActivity = {
          type: Math.random() > 0.6 ? 'usage' : Math.random() > 0.3 ? 'transaction' : 'request',
          message: Math.random() > 0.6 ? 
            `${Math.floor(Math.random() * 25)} new integrations` : 
            Math.random() > 0.3 ?
            `Transaction: ${Math.floor(Math.random() * 5)} $SVMAI` :
            `${Math.floor(Math.random() * 100)} API requests processed`,
          timestamp: new Date().toISOString()
        };
        
        setActivity(prev => [newActivity, ...prev.slice(0, 9)]);
      }, 8000); // Update every 8 seconds
      
      return () => clearInterval(interval);
    }
  }, [serverId]);
  
  return activity;
};

export default function ServerDetailsPage() {
  const { t } = useI18nContext();
  const params = useParams();
  const serverId = params.id as string;
  const [server, setServer] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('overview');
  
  const activity = useRealTimeActivity(serverId);
  
  useEffect(() => {
    const serverData = getServerDetails(serverId);
    setServer(serverData);
    setLoading(false);
  }, [serverId]);

  const getActivityIcon = (type: string) => {
    switch (type) {
      case 'update': return '[↑]';
      case 'transaction': return '[$]';
      case 'usage': return '[👤]';
      case 'request': return '[⚡]';
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
    
    if (diffMins < 1) return t('common.time.just.now');
    if (diffMins < 60) return t('common.time.minutes.ago').replace('{minutes}', diffMins.toString());
    if (diffHours < 24) return t('common.time.hours.ago').replace('{hours}', diffHours.toString());
    return t('common.time.days.ago').replace('{days}', diffDays.toString());
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

  if (!server) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="text-center py-12">
          <div className="ascii-card inline-block">
            <div className="ascii-logo w-16 h-12 mx-auto mb-4">
              <span className="text-2xl">[!]</span>
            </div>
            <h3 className="ascii-subsection-title">{t('server.details.not.found')}</h3>
            <p className="ascii-body-text mb-4">
              {t('server.details.not.found.desc')}
            </p>
            <Link href="/servers" className="ascii-button-primary">
              [← {t('server.details.back')}]
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
          <Link href="/servers" className="ascii-link mr-4">
            [← {t('server.details.back')}]
          </Link>
          <div className="ascii-logo w-8 h-8 mr-3">
            <span className="text-lg font-bold">[SRV]</span>
          </div>
        </div>
        
        <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between">
          <div className="flex-1">
            <h1 className="ascii-section-title text-3xl mb-2">
              {server.name.toUpperCase()}
            </h1>
            <p className="ascii-body-text text-lg mb-4">
              v{server.version} • {server.provider}
            </p>
            <p className="ascii-body-text mb-4">
              {server.longDescription}
            </p>
          </div>
          
          <div className="lg:ml-8 mt-4 lg:mt-0">
            <div className="ascii-card">
              <div className="grid grid-cols-2 gap-4 text-center">
                <div>
                  <div className="ascii-subsection-title text-2xl">{server.rating}</div>
                  <div className="ascii-body-text text-sm">{t('server.details.rating')}</div>
                </div>
                <div>
                  <div className="ascii-subsection-title text-2xl">{server.users.toLocaleString()}</div>
                  <div className="ascii-body-text text-sm">{t('server.details.users')}</div>
                </div>
                <div>
                  <div className="ascii-subsection-title text-2xl">{server.stakeRequired}</div>
                  <div className="ascii-body-text text-sm">{t('server.details.stake')}</div>
                </div>
                <div>
                  <div className="ascii-subsection-title text-2xl">{server.metrics.uptime}%</div>
                  <div className="ascii-body-text text-sm">{t('server.details.uptime')}</div>
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
            { id: 'overview', label: t('server.details.tabs.overview') },
            { id: 'endpoints', label: t('server.details.tabs.endpoints') },
            { id: 'versions', label: t('server.details.tabs.versions') },
            { id: 'owner', label: t('server.details.tabs.owner') },
            { id: 'activity', label: t('server.details.tabs.activity') }
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
            {/* Tools */}
            <div className="ascii-card mb-6">
              <h3 className="ascii-subsection-title mb-4">{t('server.details.tools')}</h3>
              <div className="flex flex-wrap gap-2">
                {server.tools.map((tool: string) => (
                  <span
                    key={tool}
                    className="ascii-status"
                    style={{ backgroundColor: '#D4D4D4', color: '#171717' }}
                  >
                    {tool.toUpperCase()}
                  </span>
                ))}
              </div>
            </div>

            {/* Resources */}
            <div className="ascii-card mb-6">
              <h3 className="ascii-subsection-title mb-4">{t('server.details.resources')}</h3>
              <div className="flex flex-wrap gap-2">
                {server.resources.map((resource: string) => (
                  <span
                    key={resource}
                    className="ascii-status"
                    style={{ backgroundColor: '#E5E5E5', color: '#525252' }}
                  >
                    {resource.toUpperCase()}
                  </span>
                ))}
              </div>
            </div>

            {/* Prompts */}
            <div className="ascii-card mb-6">
              <h3 className="ascii-subsection-title mb-4">{t('server.details.prompts')}</h3>
              <div className="flex flex-wrap gap-2">
                {server.prompts.map((prompt: string) => (
                  <span
                    key={prompt}
                    className="ascii-status"
                    style={{ backgroundColor: '#F5F5F5', color: '#404040' }}
                  >
                    {prompt.toUpperCase()}
                  </span>
                ))}
              </div>
            </div>

            {/* Metrics */}
            <div className="ascii-card">
              <h3 className="ascii-subsection-title mb-4">{t('server.details.metrics')}</h3>
              <div className="grid grid-cols-2 gap-4">
                <div className="ascii-info-box">
                  <div className="ascii-body-text text-sm">{t('server.details.metrics.requests')}</div>
                  <div className="ascii-subsection-title">{server.metrics.totalRequests.toLocaleString()}</div>
                </div>
                <div className="ascii-info-box">
                  <div className="ascii-body-text text-sm">{t('server.details.metrics.revenue')}</div>
                  <div className="ascii-subsection-title">{server.metrics.totalRevenue} $SVMAI</div>
                </div>
                <div className="ascii-info-box">
                  <div className="ascii-body-text text-sm">{t('server.details.metrics.response')}</div>
                  <div className="ascii-subsection-title">{server.metrics.responseTime}ms</div>
                </div>
                <div className="ascii-info-box">
                  <div className="ascii-body-text text-sm">{t('server.details.metrics.uptime')}</div>
                  <div className="ascii-subsection-title">{server.metrics.uptime}%</div>
                </div>
              </div>
            </div>
          </div>

          <div>
            {/* Quick Actions */}
            <div className="ascii-card mb-6">
              <h3 className="ascii-subsection-title mb-4">{t('server.details.actions')}</h3>
              <div className="space-y-3">
                <button className="ascii-button-primary w-full">
                  [{t('server.details.actions.connect')}]
                </button>
                <button className="ascii-button-secondary w-full">
                  [{t('server.details.actions.stake')}]
                </button>
                <a
                  href={server.providerUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="ascii-button-secondary w-full block text-center"
                >
                  [{t('server.details.actions.external')}]
                </a>
              </div>
            </div>

            {/* Status */}
            <div className="ascii-card">
              <h3 className="ascii-subsection-title mb-4">{t('server.details.status')}</h3>
              <div className="space-y-2">
                <div className="flex justify-between">
                  <span className="ascii-body-text">{t('server.details.status')}:</span>
                  <span className="ascii-status ascii-status-active">{server.status.toUpperCase()}</span>
                </div>
                <div className="flex justify-between">
                  <span className="ascii-body-text">{t('server.details.status.last.update')}:</span>
                  <span className="ascii-body-text">{new Date(server.lastUpdate).toLocaleDateString()}</span>
                </div>
                <div className="flex justify-between">
                  <span className="ascii-body-text">{t('server.details.status.verified')}:</span>
                  <span className="ascii-status" style={{ backgroundColor: '#D4D4D4', color: '#171717' }}>
                    {server.owner.verified ? t('common.yes') : t('common.no')}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {activeTab === 'endpoints' && (
        <div className="ascii-card">
          <h3 className="ascii-subsection-title mb-6">{t('server.details.endpoints.title')}</h3>
          <div className="space-y-4">
            {server.endpoints.map((endpoint: any) => (
              <div key={endpoint.name} className="ascii-info-box">
                <div className="flex items-center justify-between mb-2">
                  <div className="ascii-subsection-title">{endpoint.name}</div>
                  <div className="ascii-body-text text-sm">{endpoint.usage.toLocaleString()} {t('server.details.endpoints.calls')}</div>
                </div>
                <p className="ascii-body-text">{endpoint.description}</p>
                <div className="mt-2">
                  <div className="w-full bg-gray-200 h-2">
                    <div 
                      className="h-2" 
                      style={{ 
                        backgroundColor: '#404040', 
                        width: `${(endpoint.usage / Math.max(...server.endpoints.map((e: any) => e.usage))) * 100}%` 
                      }}
                    ></div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {activeTab === 'versions' && (
        <div className="ascii-card">
          <h3 className="ascii-subsection-title mb-6">{t('server.details.versions.title')}</h3>
          <div className="space-y-4">
            {server.versions.map((version: any, index: number) => (
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
                      {t('server.details.versions.current')}
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
            <h3 className="ascii-subsection-title mb-6">{t('server.details.owner.title')}</h3>
            <div className="space-y-4">
              <div>
                <div className="ascii-body-text text-sm mb-1">{t('server.details.owner.name')}:</div>
                <div className="ascii-subsection-title">{server.owner.name}</div>
              </div>
              <div>
                <div className="ascii-body-text text-sm mb-1">{t('server.details.owner.wallet')}:</div>
                <div className="ascii-body-text font-mono text-sm break-all">
                  {server.owner.wallet}
                </div>
              </div>
              <div>
                <div className="ascii-body-text text-sm mb-1">{t('server.details.owner.verified')}:</div>
                <span className="ascii-status" style={{ backgroundColor: server.owner.verified ? '#D4D4D4' : '#E5E5E5', color: '#171717' }}>
                  {server.owner.verified ? t('common.verified') : t('common.unverified')}
                </span>
              </div>
              <div>
                <div className="ascii-body-text text-sm mb-1">{t('server.details.owner.joined')}:</div>
                <div className="ascii-body-text">{new Date(server.owner.joinDate).toLocaleDateString()}</div>
              </div>
            </div>
          </div>

          <div className="ascii-card">
            <h3 className="ascii-subsection-title mb-6">{t('server.details.owner.actions')}</h3>
            <div className="space-y-3">
              <button className="ascii-button-secondary w-full">
                [{t('server.details.owner.actions.profile')}]
              </button>
              <button className="ascii-button-secondary w-full">
                [{t('server.details.owner.actions.contact')}]
              </button>
              <button className="ascii-button-secondary w-full">
                [{t('server.details.owner.actions.other')}]
              </button>
            </div>
          </div>
        </div>
      )}

      {activeTab === 'activity' && (
        <div className="ascii-card">
          <div className="flex items-center justify-between mb-6">
            <h3 className="ascii-subsection-title">{t('server.details.activity.title')}</h3>
            <div className="flex items-center space-x-2">
              <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></div>
              <span className="ascii-body-text text-sm">{t('server.details.activity.live')}</span>
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
                                     item.type === 'update' ? '#E5E5E5' : 
                                     item.type === 'request' ? '#F5F5F5' : '#FAFAFA',
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