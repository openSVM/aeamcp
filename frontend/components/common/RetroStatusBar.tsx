'use client';

import React, { useState, useRef, useEffect } from 'react';
import { toast } from 'react-hot-toast';
import useRealStatusData, { 
  ProgramActivity, 
  AgentMetrics, 
  MCPEntry 
} from '@/hooks/useRealStatusData';

const RetroStatusBar: React.FC = () => {
  const {
    networkStatus,
    programActivities,
    topAgents,
    mcpEntries,
    recentAction,
    wsStatus
  } = useRealStatusData();
  
  const [isCollapsed, setIsCollapsed] = useState(false);
  const scrollContainerRef = useRef<HTMLDivElement>(null);

  // Manage body class for proper spacing
  useEffect(() => {
    const body = document.body;
    body.classList.add('retro-status-body');
    
    if (isCollapsed) {
      body.classList.add('collapsed');
    } else {
      body.classList.remove('collapsed');
    }
    
    return () => {
      body.classList.remove('retro-status-body', 'collapsed');
    };
  }, [isCollapsed]);

  // Copy to clipboard functionality
  const copyToClipboard = async (text: string, label: string) => {
    try {
      await navigator.clipboard.writeText(text);
      toast.success(`${label} copied to clipboard!`);
    } catch (error) {
      toast.error('Failed to copy to clipboard');
    }
  };

  // Network health color
  const getNetworkHealthColor = (health: string) => {
    switch (health) {
      case 'healthy': return '#00ff41';
      case 'degraded': return '#ffff00';
      case 'down': return '#ff0040';
      default: return '#00ff41';
    }
  };

  // Agent status color
  const getAgentStatusColor = (status: string) => {
    switch (status) {
      case 'active': return '#00ff41';
      case 'idle': return '#ffff00';
      case 'error': return '#ff0040';
      default: return '#00ff41';
    }
  };

  // MCP connection status color
  const getMCPStatusColor = (status: string) => {
    switch (status) {
      case 'connected': return '#00ff41';
      case 'connecting': return '#ffff00';
      case 'disconnected': return '#ff0040';
      default: return '#00ff41';
    }
  };

  return (
    <>
      {/* Status Bar */}
      <div className="retro-status-bar">
        <div className="retro-scanlines"></div>
        
        {/* Main Content */}
        <div className="retro-status-content">
          {/* Left Section - Network Status */}
          <div className="retro-status-section">
            <div className="retro-network-status">
              <div 
                className="retro-network-orb"
                style={{ backgroundColor: getNetworkHealthColor(networkStatus.health) }}
              ></div>
              <span className="retro-network-text">
                {networkStatus.network.toUpperCase()} • {networkStatus.latency}ms
              </span>
              {wsStatus.connected && (
                <div className="retro-ws-indicator">
                  <div className="retro-ws-dot"></div>
                  <span>LIVE</span>
                </div>
              )}
            </div>
          </div>

          {/* Center Section - Scrollable Programs */}
          <div className="retro-status-section retro-programs-section">
            <div className="retro-programs-container" ref={scrollContainerRef}>
              <div className="retro-programs-scroll">
                {programActivities.slice(0, 24).map((program, index) => (
                  <div
                    key={index}
                    className="retro-program-item"
                    onClick={() => copyToClipboard(program.address, 'Program address')}
                    title={`${program.name} • ${program.transactionCount} txns • ${program.successRate}% success • Last: ${program.lastActivity.toLocaleTimeString()}`}
                  >
                    <div className="retro-program-address">
                      {program.address}
                    </div>
                    <div className="retro-program-stats">
                      {program.transactionCount} • {program.successRate}%
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Right Section - Agents, MCP, Recent Action */}
          <div className="retro-status-section retro-metrics-section">
            {/* Top Agents */}
            <div className="retro-agents">
              <span className="retro-section-label">AGENTS</span>
              {topAgents.map((agent, index) => (
                <div key={agent.id} className="retro-agent-item">
                  <div 
                    className="retro-agent-status"
                    style={{ backgroundColor: getAgentStatusColor(agent.status) }}
                  ></div>
                  <span className="retro-agent-name">{agent.name}</span>
                  <div className="retro-agent-metrics">
                    <div className="retro-progress-bar">
                      <div 
                        className="retro-progress-fill"
                        style={{ width: `${agent.successPercentage}%` }}
                      ></div>
                    </div>
                    <span className="retro-agent-stats">
                      {agent.successPercentage}% • {agent.responseTime}ms • {agent.activeTasks}
                    </span>
                  </div>
                </div>
              ))}
            </div>

            {/* MCP Entries */}
            <div className="retro-mcp">
              <span className="retro-section-label">MCP</span>
              {mcpEntries.map((mcp, index) => (
                <div key={mcp.id} className="retro-mcp-item">
                  <div 
                    className="retro-mcp-status"
                    style={{ backgroundColor: getMCPStatusColor(mcp.connectionStatus) }}
                  ></div>
                  <span className="retro-mcp-name">{mcp.name}</span>
                  <div className="retro-mcp-activity">
                    <div className="retro-vu-meter">
                      {Array.from({ length: 10 }, (_, i) => (
                        <div
                          key={i}
                          className={`retro-vu-bar ${i < (mcp.activityLevel / 10) ? 'active' : ''}`}
                        ></div>
                      ))}
                    </div>
                    <span className="retro-mcp-version">{mcp.protocolVersion}</span>
                  </div>
                </div>
              ))}
            </div>

            {/* Recent Action */}
            {recentAction && (
              <div className="retro-recent-action">
                <span className="retro-section-label">RECENT</span>
                <div className="retro-action-item">
                  <div className="retro-action-status">
                    {recentAction.status === 'success' && <span className="retro-icon-success">✓</span>}
                    {recentAction.status === 'pending' && <span className="retro-icon-pending">⟳</span>}
                    {recentAction.status === 'failed' && <span className="retro-icon-failed">✗</span>}
                  </div>
                  <div className="retro-action-details">
                    <span className="retro-action-type">{recentAction.type}</span>
                    <span className="retro-action-time">
                      {recentAction.timestamp.toLocaleTimeString()}
                    </span>
                    {recentAction.transactionHash && (
                      <span 
                        className="retro-action-hash"
                        onClick={() => copyToClipboard(recentAction.transactionHash!, 'Transaction hash')}
                      >
                        {recentAction.transactionHash}
                      </span>
                    )}
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Collapse Toggle */}
          <button
            className="retro-collapse-btn"
            onClick={() => setIsCollapsed(!isCollapsed)}
            aria-label={isCollapsed ? 'Expand status bar' : 'Collapse status bar'}
          >
            {isCollapsed ? '▲' : '▼'}
          </button>
        </div>
      </div>

      {/* Collapsed State */}
      {isCollapsed && (
        <div className="retro-status-bar-collapsed">
          <div className="retro-collapsed-content">
            <div 
              className="retro-network-orb-small"
              style={{ backgroundColor: getNetworkHealthColor(networkStatus.health) }}
            ></div>
            <span className="retro-collapsed-text">
              {networkStatus.network.toUpperCase()} • {topAgents.length} AGENTS • {mcpEntries.length} MCP
            </span>
            <button
              className="retro-expand-btn"
              onClick={() => setIsCollapsed(false)}
              aria-label="Expand status bar"
            >
              ▼
            </button>
          </div>
        </div>
      )}
    </>
  );
};

export default RetroStatusBar;
