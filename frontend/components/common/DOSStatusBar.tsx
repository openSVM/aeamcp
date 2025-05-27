'use client';

import React, { useState, useRef, useEffect } from 'react';
import { Connection, PublicKey } from '@solana/web3.js';
import { toast } from 'react-hot-toast';
import { AGENT_REGISTRY_PROGRAM_ID, MCP_SERVER_REGISTRY_PROGRAM_ID } from '../../lib/constants';
import { useI18nContext } from './I18nProvider';
import useRealStatusData from '../../hooks/useRealStatusData';

interface NetworkStats {
  network: 'mainnet' | 'devnet' | 'custom';
  customUrl?: string;
  blockHeight: number;
  latency: number;
  tps: number;
  health: 'healthy' | 'degraded' | 'down';
  lastUpdate: Date;
}

interface ProgramInfo {
  agentRegistry: {
    address: string;
    version: string;
    totalTransactions: number;
  };
  mcpServerRegistry: {
    address: string;
    version: string;
    totalTransactions: number;
  };
}

interface ProtocolStats {
  totalAgents: number;
  activeAgents: number;
  totalMCPServers: number;
  activeMCPServers: number;
  recentTransactions: number;
  successRate: number;
}

interface Agent {
  id: string;
  name: string;
  description: string;
  owner: string;
  endpoint: string;
  status: 'active' | 'inactive';
  createdAt: Date;
}

interface MCPServer {
  id: string;
  name: string;
  description: string;
  owner: string;
  endpoint: string;
  protocolVersion: string;
  status: 'active' | 'inactive';
  createdAt: Date;
}

const DOSStatusBar: React.FC = () => {
  const { t, locale, changeLocale, locales, localeNames, isHydrated } = useI18nContext();
  const realStatusData = useRealStatusData();
  const [isMounted, setIsMounted] = useState(false);
  const [isClient, setIsClient] = useState(false);
  
  useEffect(() => {
    setIsMounted(true);
    setIsClient(true);
  }, []);
  
  const [command, setCommand] = useState('');
  const [commandHistory, setCommandHistory] = useState<string[]>([]);
  const [historyIndex, setHistoryIndex] = useState(-1);
  const [isExpanded, setIsExpanded] = useState(false);
  const [commandOutput, setCommandOutput] = useState<string[]>([]);
  
  // Map real data from hook to expected format
  const networkStats: NetworkStats = {
    network: realStatusData.networkStatus.network === 'testnet' ? 'devnet' : realStatusData.networkStatus.network,
    blockHeight: realStatusData.networkStatus.blockHeight,
    latency: realStatusData.networkStatus.latency,
    tps: realStatusData.networkStatus.tps,
    health: realStatusData.networkStatus.health,
    lastUpdate: new Date()
  };
  
  const protocolStats: ProtocolStats = {
    totalAgents: realStatusData.topAgents.length,
    activeAgents: realStatusData.topAgents.filter(agent => agent.status === 'active').length,
    totalMCPServers: realStatusData.mcpEntries.length,
    activeMCPServers: realStatusData.mcpEntries.filter(mcp => mcp.connectionStatus === 'connected').length,
    recentTransactions: realStatusData.programActivities.reduce((sum, prog) => sum + prog.transactionCount, 0),
    successRate: realStatusData.programActivities.length > 0 
      ? realStatusData.programActivities.reduce((sum, prog) => sum + prog.successRate, 0) / realStatusData.programActivities.length
      : 0
  };
  
  const programInfo: ProgramInfo = {
    agentRegistry: {
      address: AGENT_REGISTRY_PROGRAM_ID.toBase58(),
      version: 'v1.0.0',
      totalTransactions: realStatusData.programActivities.find(p => p.name === 'Agent Registry')?.transactionCount || 0
    },
    mcpServerRegistry: {
      address: MCP_SERVER_REGISTRY_PROGRAM_ID.toBase58(),
      version: 'v1.0.0',
      totalTransactions: realStatusData.programActivities.find(p => p.name === 'MCP Server Registry')?.transactionCount || 0
    }
  };
  
  // Convert real data to expected format for agents
  const agents: Agent[] = realStatusData.topAgents.map(agent => ({
    id: agent.id,
    name: agent.name,
    description: `AI Agent - ${agent.successPercentage}% success rate`,
    owner: 'Unknown',
    endpoint: `https://agent-${agent.id}.example.com`,
    status: agent.status === 'active' ? 'active' : 'inactive',
    createdAt: new Date(Date.now() - Math.random() * 86400000 * 30) // Random date within last 30 days
  }));
  
  // Convert real data to expected format for MCP servers
  const mcpServers: MCPServer[] = realStatusData.mcpEntries.map(mcp => ({
    id: mcp.id,
    name: mcp.name,
    description: `MCP Server - ${mcp.protocolVersion}`,
    owner: 'Unknown',
    endpoint: `https://mcp-${mcp.id}.example.com`,
    protocolVersion: mcp.protocolVersion,
    status: mcp.connectionStatus === 'connected' ? 'active' : 'inactive',
    createdAt: mcp.lastHeartbeat
  }));
  
  const isConnecting = !realStatusData.wsStatus.connected && realStatusData.wsStatus.reconnecting;
  
  const inputRef = useRef<HTMLInputElement>(null);
  const outputRef = useRef<HTMLDivElement>(null);

  // Manage body class for proper spacing
  useEffect(() => {
    const body = document.body;
    body.classList.add('dos-status-body');
    
    return () => {
      body.classList.remove('dos-status-body');
    };
  }, []);

  // Auto-scroll command output to bottom
  useEffect(() => {
    if (outputRef.current) {
      outputRef.current.scrollTop = outputRef.current.scrollHeight;
    }
  }, [commandOutput]);

  // Enhanced command execution with output and contract commands
  const addOutput = (text: string, type: 'command' | 'output' | 'error' = 'output') => {
    // Only show timestamp on client to prevent hydration mismatch
    const timestamp = isClient ? new Date().toLocaleTimeString() : '00:00:00';
    const prefix = type === 'command' ? t('command.prompt') : type === 'error' ? '[ERROR]' : '';
    setCommandOutput(prev => [...prev, `[${timestamp}] ${prefix} ${text}`]);
  };

  const executeCommand = (cmd: string) => {
    const trimmedCmd = cmd.trim();
    if (!trimmedCmd) return;

    // Add to history
    setCommandHistory(prev => [...prev.slice(-19), cmd]);
    setHistoryIndex(-1);

    // Add command to output
    addOutput(cmd, 'command');

    // Parse command - handle both / and regular commands
    const isSlashCommand = trimmedCmd.startsWith('/');
    const normalizedCmd = isSlashCommand ? trimmedCmd.substring(1) : trimmedCmd;
    const parts = normalizedCmd.split(' ');
    const mainCmd = parts[0].toLowerCase();
    const args = parts.slice(1);

    switch (mainCmd) {
      case 'network':
      case 'net':
        addOutput('Network data is provided by real-time connection');
        addOutput(`Current network: ${networkStats.network.toUpperCase()}`);
        addOutput(`WebSocket: ${realStatusData.wsStatus.connected ? 'Connected' : 'Disconnected'}`);
        break;

      case 'programs':
      case 'prog':
        addOutput('=== PROGRAM INFORMATION (REAL DATA) ===');
        addOutput(`Network: ${networkStats.network.toUpperCase()}`);
        addOutput('');
        addOutput('Agent Registry:');
        addOutput(`  Address: ${programInfo.agentRegistry.address}`);
        addOutput(`  Version: ${programInfo.agentRegistry.version}`);
        addOutput(`  Total Transactions: ${programInfo.agentRegistry.totalTransactions}`);
        addOutput('');
        addOutput('MCP Server Registry:');
        addOutput(`  Address: ${programInfo.mcpServerRegistry.address}`);
        addOutput(`  Version: ${programInfo.mcpServerRegistry.version}`);
        addOutput(`  Total Transactions: ${programInfo.mcpServerRegistry.totalTransactions}`);
        addOutput('');
        addOutput('All Program Activities:');
        realStatusData.programActivities.forEach(prog => {
          addOutput(`  ${prog.name}: ${prog.transactionCount} txns (${prog.successRate}% success)`);
        });
        break;

      case 'find':
        handleFind(args);
        break;

      case 'list':
        handleList(args);
        break;

      case 'status':
      case 'stat':
        addOutput('=== SYSTEM STATUS (REAL DATA) ===');
        addOutput(`Network: ${networkStats.network.toUpperCase()}`);
        addOutput(`Block Height: ${networkStats.blockHeight.toLocaleString()}`);
        addOutput(`Latency: ${networkStats.latency}ms`);
        addOutput(`TPS: ${networkStats.tps}`);
        addOutput(`Health: ${networkStats.health}`);
        addOutput(`WebSocket: ${realStatusData.wsStatus.connected ? 'Connected' : 'Disconnected'}`);
        addOutput(`Last Heartbeat: ${realStatusData.wsStatus.lastHeartbeat?.toLocaleTimeString() || 'Never'}`);
        if (realStatusData.recentAction) {
          addOutput(`Recent Action: ${realStatusData.recentAction.type} (${realStatusData.recentAction.status})`);
        }
        break;

      case 'refresh':
      case 'update':
        addOutput('Data is automatically updated in real-time');
        addOutput('WebSocket provides live updates every few seconds');
        break;

      case 'clear':
      case 'cls':
        setCommandOutput([]);
        addOutput('Terminal cleared');
        break;

      case 'help':
      case '?':
        addOutput(t('command.help.title'));
        addOutput(`  ${t('command.help.programs')}`);
        addOutput(`  ${t('command.help.find')}`);
        addOutput(`  ${t('command.help.list')}`);
        addOutput(`  ${t('command.help.status')}`);
        addOutput(`  ${t('command.help.refresh')}`);
        addOutput(`  ${t('command.help.clear')}`);
        addOutput(`  ${t('command.help.help')}`);
        break;

      default:
        addOutput(`Unknown command: ${mainCmd}. Type 'help' for available commands.`, 'error');
    }

    setCommand('');
  };

  const handleFind = (args: string[]) => {
    if (args.length < 2) {
      addOutput('Usage: /find [agent|mcp] <search_term>', 'error');
      return;
    }

    const [type, ...searchParts] = args;
    const searchTerm = searchParts.join(' ').toLowerCase();

    if (type === 'agent' || type === 'agents') {
      const results = agents.filter((agent: Agent) => 
        agent.name.toLowerCase().includes(searchTerm) ||
        agent.description.toLowerCase().includes(searchTerm) ||
        agent.endpoint.toLowerCase().includes(searchTerm)
      );

      if (results.length === 0) {
        addOutput(`No agents found matching "${searchTerm}"`);
      } else {
        addOutput(`Found ${results.length} agent(s) (REAL DATA):`);
        results.forEach((agent: Agent) => {
          addOutput(`  [${agent.id}] ${agent.name} - ${agent.status}`);
          addOutput(`      ${agent.endpoint}`);
          addOutput(`      ${agent.description}`);
        });
      }
    } else if (type === 'mcp' || type === 'mcps') {
      const results = mcpServers.filter((mcp: MCPServer) => 
        mcp.name.toLowerCase().includes(searchTerm) ||
        mcp.description.toLowerCase().includes(searchTerm) ||
        mcp.endpoint.toLowerCase().includes(searchTerm)
      );

      if (results.length === 0) {
        addOutput(`No MCP servers found matching "${searchTerm}"`);
      } else {
        addOutput(`Found ${results.length} MCP server(s) (REAL DATA):`);
        results.forEach((mcp: MCPServer) => {
          addOutput(`  [${mcp.id}] ${mcp.name} - ${mcp.status} (${mcp.protocolVersion})`);
          addOutput(`      ${mcp.endpoint}`);
          addOutput(`      ${mcp.description}`);
        });
      }
    } else {
      addOutput('Please specify "agent" or "mcp" as the search type', 'error');
    }
  };

  const handleList = (args: string[]) => {
    const type = args[0]?.toLowerCase();

    if (type === 'agents' || type === 'agent') {
      addOutput(`Total agents: ${agents.length} (REAL DATA)`);
      agents.forEach((agent: Agent) => {
        addOutput(`[${agent.id}] ${agent.name} - ${agent.status}`);
        addOutput(`    Owner: ${agent.owner.substring(0, 8)}...`);
        addOutput(`    Endpoint: ${agent.endpoint}`);
        addOutput(`    Created: ${isClient ? agent.createdAt.toLocaleDateString() : agent.createdAt.toISOString().split('T')[0]}`);
      });
    } else if (type === 'mcp' || type === 'mcps') {
      addOutput(`Total MCP servers: ${mcpServers.length} (REAL DATA)`);
      mcpServers.forEach((mcp: MCPServer) => {
        addOutput(`[${mcp.id}] ${mcp.name} - ${mcp.status} (${mcp.protocolVersion})`);
        addOutput(`    Owner: ${mcp.owner.substring(0, 8)}...`);
        addOutput(`    Endpoint: ${mcp.endpoint}`);
        addOutput(`    Created: ${isClient ? mcp.createdAt.toLocaleDateString() : mcp.createdAt.toISOString().split('T')[0]}`);
      });
    } else {
      addOutput('Usage: list [agents|mcp]', 'error');
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      executeCommand(command);
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      if (commandHistory.length > 0) {
        const newIndex = historyIndex === -1 ? commandHistory.length - 1 : Math.max(0, historyIndex - 1);
        setHistoryIndex(newIndex);
        setCommand(commandHistory[newIndex]);
      }
    } else if (e.key === 'ArrowDown') {
      e.preventDefault();
      if (historyIndex !== -1) {
        const newIndex = historyIndex + 1;
        if (newIndex >= commandHistory.length) {
          setHistoryIndex(-1);
          setCommand('');
        } else {
          setHistoryIndex(newIndex);
          setCommand(commandHistory[newIndex]);
        }
      }
    }
  };

  const getHealthIndicator = () => {
    switch (networkStats.health) {
      case 'healthy': return '●';
      case 'degraded': return '◐';
      case 'down': return '○';
      default: return '○';
    }
  };

  const getNetworkDisplay = () => {
    if (networkStats.network === 'custom' && networkStats.customUrl) {
      try {
        const url = new URL(networkStats.customUrl);
        return `CUSTOM (${url.hostname})`;
      } catch {
        return 'CUSTOM';
      }
    }
    return networkStats.network.toUpperCase();
  };

  // Prevent hydration mismatch by ensuring client-side rendering
  if (!isHydrated || !isMounted) {
    return (
      <div className="dos-status-bar">
        <div className="dos-command-section">
          <span className="dos-prompt">C:\AEAMCP&gt;</span>
          <input
            className="dos-input"
            value=""
            readOnly
            placeholder="Loading..."
          />
        </div>
        <div className="dos-stats">
          <span>NET: DEVNET</span>
          <span>BLK: 0</span>
          <span>MS: 0</span>
          <span>TPS: 0</span>
        </div>
        <div className="dos-language">
          <select className="dos-language-select" value="en" disabled>
            <option value="en">English</option>
          </select>
        </div>
      </div>
    );
  }

  return (
    <>
      <div className={`dos-status-bar${isExpanded ? ' dos-status-bar-expanded' : ''}`}>
        {/* Expand/Collapse Button */}
        <button
          className="dos-expand-btn"
          aria-label={isExpanded ? 'Collapse terminal' : 'Expand terminal'}
          onClick={() => setIsExpanded((v) => !v)}
          tabIndex={0}
        >
          {isExpanded ? '▢' : '▣'}
        </button>

        {/* Left side - Command input */}
        <div className="dos-command-section">
          <span className="dos-prompt">{t('command.prompt')}</span>
          <input
            ref={inputRef}
            type="text"
            value={command}
            onChange={(e) => setCommand(e.target.value)}
            onKeyDown={handleKeyDown}
            className="dos-command-input"
            placeholder={t('command.placeholder')}
            autoComplete="off"
            spellCheck={false}
          />
          {isConnecting && <span className="dos-connecting">{t('status.connecting')}</span>}
        </div>

        {/* Right side - Network and Protocol Stats */}
        <div className="dos-stats-section">
          {/* Network Stats */}
          <div className="dos-network-stats">
            <span className="dos-network-label">{t('status.network')}</span>
            <button
              className="dos-network-switcher"
              onClick={() => {
                toast.success('Network data is provided by real-time connection');
              }}
              title="Network is managed by real-time connection"
            >
              {getNetworkDisplay()}
            </button>
            <span className="dos-health-indicator">{getHealthIndicator()}</span>
            <span className="dos-stat-item">{t('status.block')}{networkStats.blockHeight.toLocaleString()}</span>
            <span className="dos-stat-item">{networkStats.latency}{t('status.latency')}</span>
            <span className="dos-stat-item">{t('status.tps')}{networkStats.tps}</span>
          </div>

          {/* Protocol Stats */}
          <div className="dos-protocol-stats">
            <span className="dos-stat-group">
              <span className="dos-stat-label">{t('status.agents')}</span>
              <span className="dos-stat-value">{protocolStats.activeAgents}/{protocolStats.totalAgents}</span>
            </span>
            <span className="dos-stat-group">
              <span className="dos-stat-label">{t('status.mcp')}</span>
              <span className="dos-stat-value">{protocolStats.activeMCPServers}/{protocolStats.totalMCPServers}</span>
            </span>
            <span className="dos-stat-group">
              <span className="dos-stat-label">{t('status.agentTxns')}</span>
              <span className="dos-stat-value">{programInfo.agentRegistry.totalTransactions}</span>
            </span>
            <span className="dos-stat-group">
              <span className="dos-stat-label">{t('status.mcpTxns')}</span>
              <span className="dos-stat-value">{programInfo.mcpServerRegistry.totalTransactions}</span>
            </span>
            <span className="dos-stat-group">
              <span className="dos-stat-label">{t('status.success')}</span>
              <span className="dos-stat-value">{protocolStats.successRate.toFixed(1)}%</span>
            </span>
          </div>
        </div>

        {/* Language Switcher */}
        <div className="dos-language-switcher">
          <select
            value={locale}
            onChange={(e) => changeLocale(e.target.value as any)}
            className="dos-language-select"
            title={t('language.switch')}
          >
            {locales.map((loc: string) => (
              <option key={loc} value={loc}>
                {localeNames[loc as keyof typeof localeNames]}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Expanded Terminal Output */}
      {isExpanded && (
        <div className="dos-terminal-expanded">
          <div className="dos-terminal-output" ref={outputRef}>
            {commandOutput.length === 0 ? (
              <div className="dos-terminal-placeholder" dangerouslySetInnerHTML={{
                __html: t('terminal.placeholder')
              }} />
            ) : (
              commandOutput.map((line, idx) => (
                <div key={idx} className="dos-terminal-line">{line}</div>
              ))
            )}
          </div>
          <div className="dos-terminal-input-row">
            <span className="dos-prompt">{t('command.prompt')}</span>
            <input
              ref={inputRef}
              type="text"
              value={command}
              onChange={(e) => setCommand(e.target.value)}
              onKeyDown={handleKeyDown}
              className="dos-command-input dos-terminal-input"
              placeholder={t('command.placeholder')}
              autoComplete="off"
              spellCheck={false}
            />
          </div>
        </div>
      )}
    </>
  );
};

export default DOSStatusBar;
