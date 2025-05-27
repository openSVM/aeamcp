'use client';

import React, { useState, useRef, useEffect } from 'react';
import { Connection, PublicKey } from '@solana/web3.js';
import { toast } from 'react-hot-toast';
import { AGENT_REGISTRY_PROGRAM_ID, MCP_SERVER_REGISTRY_PROGRAM_ID } from '../../lib/constants';
import { useI18nContext } from './I18nProvider';

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
  const [isMounted, setIsMounted] = useState(false);
  
  useEffect(() => {
    setIsMounted(true);
  }, []);
  const [command, setCommand] = useState('');
  const [commandHistory, setCommandHistory] = useState<string[]>([]);
  const [historyIndex, setHistoryIndex] = useState(-1);
  const [isExpanded, setIsExpanded] = useState(false);
  const [commandOutput, setCommandOutput] = useState<string[]>([]);
  const [agents, setAgents] = useState<Agent[]>([]);
  const [mcpServers, setMcpServers] = useState<MCPServer[]>([]);
  const [networkStats, setNetworkStats] = useState<NetworkStats>({
    network: 'devnet',
    blockHeight: 0,
    latency: 0,
    tps: 0,
    health: 'healthy',
    lastUpdate: new Date(0) // Use epoch time for consistent SSR
  });
  const [protocolStats, setProtocolStats] = useState<ProtocolStats>({
    totalAgents: 0,
    activeAgents: 0,
    totalMCPServers: 0,
    activeMCPServers: 0,
    recentTransactions: 0,
    successRate: 0
  });
  const [isConnecting, setIsConnecting] = useState(false);
  const [isClient, setIsClient] = useState(false);
  const [programInfo, setProgramInfo] = useState<ProgramInfo>({
    agentRegistry: {
      address: 'BCBVehUHR3yhbDbvhV3QHS3s27k3LTbpX5CrXQ2sR2SR', // devnet
      version: 'v1.0.0',
      totalTransactions: 0
    },
    mcpServerRegistry: {
      address: 'BruRLHGfNaf6C5HKUqFu6md5ePJNELafm1vZdhctPkpr', // devnet
      version: 'v1.0.0',
      totalTransactions: 0
    }
  });
  
  const inputRef = useRef<HTMLInputElement>(null);
  const connectionRef = useRef<Connection | null>(null);
  const outputRef = useRef<HTMLDivElement>(null);

  // Detect client-side rendering to prevent hydration mismatch
  useEffect(() => {
    setIsClient(true);
  }, []);

  // Manage body class for proper spacing
  useEffect(() => {
    const body = document.body;
    body.classList.add('dos-status-body');
    
    return () => {
      body.classList.remove('dos-status-body');
    };
  }, []);

  // Initialize with mock data and start polling
  useEffect(() => {
    initializeMockData();
    initializeMockAgentsAndMCP();
    const interval = setInterval(updateStats, 5000);
    return () => clearInterval(interval);
  }, [isClient]);

  // Auto-scroll command output to bottom
  useEffect(() => {
    if (outputRef.current) {
      outputRef.current.scrollTop = outputRef.current.scrollHeight;
    }
  }, [commandOutput]);

  // Update network connection when network changes
  useEffect(() => {
    connectToNetwork();
  }, [networkStats.network, networkStats.customUrl]);

  const initializeMockData = () => {
    setProtocolStats({
      totalAgents: 24,
      activeAgents: 18,
      totalMCPServers: 12,
      activeMCPServers: 9,
      recentTransactions: 1247,
      successRate: 94.2
    });
    
    setNetworkStats(prev => ({
      ...prev,
      blockHeight: 285432156,
      latency: 45,
      tps: 2847,
      health: 'healthy',
      lastUpdate: isClient ? new Date() : new Date(0)
    }));
  };

  const initializeMockAgentsAndMCP = () => {
    // Mock agents data
    const mockAgents: Agent[] = [
      {
        id: '1',
        name: 'Trading Bot Alpha',
        description: 'Automated trading agent for DeFi protocols',
        owner: '9WzDXwBbmkg8ZTbNMqUxvQRAyrZzDsGYdLVL9zYtAWWM',
        endpoint: 'https://api.tradingbot.com/alpha',
        status: 'active',
        createdAt: new Date('2024-01-15')
      },
      {
        id: '2',
        name: 'NFT Monitor',
        description: 'Real-time NFT collection monitoring agent',
        owner: 'TokenkegQfeZyiNwAJbNbGKPFXCWuBvf9Ss623VQ5DA',
        endpoint: 'https://nft-monitor.io/api',
        status: 'active',
        createdAt: new Date('2024-02-20')
      },
      {
        id: '3',
        name: 'Yield Optimizer',
        description: 'Automated yield farming optimization',
        owner: 'ATokenGPvbdGVxr1b2hvZbsiqW5xWH25efTNsLJA8knL',
        endpoint: 'https://yield-opt.com/agent',
        status: 'inactive',
        createdAt: new Date('2024-03-10')
      }
    ];

    // Mock MCP servers data
    const mockMCPServers: MCPServer[] = [
      {
        id: '1',
        name: 'Solana RPC Gateway',
        description: 'High-performance Solana RPC gateway',
        owner: '11111111111111111111111111111112',
        endpoint: 'https://gateway.solana.com/mcp',
        protocolVersion: 'v1.2.0',
        status: 'active',
        createdAt: new Date('2024-01-10')
      },
      {
        id: '2',
        name: 'DeFi Data Provider',
        description: 'Real-time DeFi protocol data aggregator',
        owner: 'So1endDq2YkqhipRh3WViPa8hdiSpxWy6z3Z6tMCpAo',
        endpoint: 'https://defi-data.com/mcp',
        protocolVersion: 'v1.1.5',
        status: 'active',
        createdAt: new Date('2024-02-05')
      }
    ];

    setAgents(mockAgents);
    setMcpServers(mockMCPServers);
  };

  const connectToNetwork = async () => {
    setIsConnecting(true);
    try {
      let rpcUrl: string;
      
      switch (networkStats.network) {
        case 'mainnet':
          rpcUrl = process.env.NEXT_PUBLIC_SOLANA_MAINNET_RPC || 'https://api.mainnet-beta.solana.com';
          // Update program addresses for mainnet (placeholder - update with actual mainnet addresses)
          setProgramInfo({
            agentRegistry: {
              address: 'MAINNET_AGENT_REGISTRY_ADDRESS', // Replace with actual mainnet address
              version: 'v1.0.0',
              totalTransactions: 0
            },
            mcpServerRegistry: {
              address: 'MAINNET_MCP_REGISTRY_ADDRESS', // Replace with actual mainnet address
              version: 'v1.0.0',
              totalTransactions: 0
            }
          });
          break;
        case 'devnet':
          rpcUrl = process.env.NEXT_PUBLIC_SOLANA_DEVNET_RPC || 'https://api.devnet.solana.com';
          setProgramInfo({
            agentRegistry: {
              address: 'BCBVehUHR3yhbDbvhV3QHS3s27k3LTbpX5CrXQ2sR2SR',
              version: 'v1.0.0',
              totalTransactions: 0
            },
            mcpServerRegistry: {
              address: 'BruRLHGfNaf6C5HKUqFu6md5ePJNELafm1vZdhctPkpr',
              version: 'v1.0.0',
              totalTransactions: 0
            }
          });
          break;
        case 'custom':
          rpcUrl = networkStats.customUrl || 'https://api.devnet.solana.com';
          break;
        default:
          rpcUrl = 'https://api.devnet.solana.com';
      }

      connectionRef.current = new Connection(rpcUrl, 'confirmed');
      await fetchNetworkData();
      await fetchProgramTransactions();
    } catch (error) {
      console.error('Failed to connect to network:', error);
      setNetworkStats(prev => ({ ...prev, health: 'down' }));
    } finally {
      setIsConnecting(false);
    }
  };

  const fetchNetworkData = async () => {
    if (!connectionRef.current) return;

    try {
      const startTime = Date.now();
      const blockHeight = await connectionRef.current.getBlockHeight();
      const latency = Date.now() - startTime;

      let tps = 0;
      try {
        const recentPerformance = await connectionRef.current.getRecentPerformanceSamples(1);
        tps = recentPerformance[0]?.numTransactions || 0;
      } catch (error) {
        console.warn('Could not fetch TPS data');
      }

      const health: 'healthy' | 'degraded' | 'down' =
        latency < 1000 ? 'healthy' :
        latency < 3000 ? 'degraded' : 'down';

      setNetworkStats(prev => ({
        ...prev,
        blockHeight,
        latency,
        tps,
        health,
        lastUpdate: isClient ? new Date() : new Date(0)
      }));
    } catch (error) {
      console.error('Failed to fetch network data:', error);
      setNetworkStats(prev => ({ ...prev, health: 'down' }));
    }
  };

  const fetchProgramTransactions = async () => {
    if (!connectionRef.current || !isClient) return;

    try {
      // Fetch signatures for both programs to get transaction counts
      const agentRegistryPubkey = new PublicKey(programInfo.agentRegistry.address);
      const mcpServerRegistryPubkey = new PublicKey(programInfo.mcpServerRegistry.address);

      const [agentSignatures, mcpSignatures] = await Promise.all([
        connectionRef.current.getSignaturesForAddress(agentRegistryPubkey, { limit: 1000 }).catch(() => []),
        connectionRef.current.getSignaturesForAddress(mcpServerRegistryPubkey, { limit: 1000 }).catch(() => [])
      ]);

      setProgramInfo(prev => ({
        ...prev,
        agentRegistry: {
          ...prev.agentRegistry,
          totalTransactions: agentSignatures.length
        },
        mcpServerRegistry: {
          ...prev.mcpServerRegistry,
          totalTransactions: mcpSignatures.length
        }
      }));
    } catch (error) {
      console.warn('Could not fetch program transaction counts:', error);
    }
  };

  const updateStats = () => {
    // Only update stats on client to prevent hydration mismatch
    if (!isClient) return;
    
    // Simulate real-time updates
    setProtocolStats(prev => ({
      ...prev,
      activeAgents: Math.max(0, prev.activeAgents + (Math.random() > 0.5 ? 1 : -1)),
      activeMCPServers: Math.max(0, prev.activeMCPServers + (Math.random() > 0.7 ? 1 : 0)),
      recentTransactions: prev.recentTransactions + Math.floor(Math.random() * 10),
      successRate: Math.max(85, Math.min(99, prev.successRate + (Math.random() - 0.5) * 2))
    }));

    if (connectionRef.current) {
      fetchNetworkData();
      fetchProgramTransactions();
    }
  };

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
        if (args[0] === 'mainnet' || args[0] === 'main') {
          setNetworkStats(prev => ({ ...prev, network: 'mainnet' }));
          addOutput(t('message.switchedToMainnet'));
          addOutput(t('message.mainnetWarning'));
        } else if (args[0] === 'devnet' || args[0] === 'dev') {
          setNetworkStats(prev => ({ ...prev, network: 'devnet' }));
          addOutput(t('message.switchedToDevnet'));
        } else if (args[0] === 'custom' && args[1]) {
          setNetworkStats(prev => ({ ...prev, network: 'custom', customUrl: args[1] }));
          addOutput(`${t('message.switchedToCustom')} ${args[1]}`);
        } else {
          addOutput('Usage: network [mainnet|devnet|custom <url>]', 'error');
        }
        break;

      case 'programs':
      case 'prog':
        addOutput('=== PROGRAM INFORMATION ===');
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
        break;

      case 'add_agent':
        handleAddAgent(args);
        break;

      case 'add_mcp':
        handleAddMCP(args);
        break;

      case 'find':
        handleFind(args);
        break;

      case 'list':
        handleList(args);
        break;

      case 'status':
      case 'stat':
        addOutput(`Network: ${networkStats.network.toUpperCase()}`);
        addOutput(`Block Height: ${networkStats.blockHeight.toLocaleString()}`);
        addOutput(`Latency: ${networkStats.latency}ms`);
        addOutput(`TPS: ${networkStats.tps}`);
        addOutput(`Health: ${networkStats.health}`);
        break;

      case 'refresh':
      case 'update':
        updateStats();
        addOutput('Stats refreshed');
        break;

      case 'clear':
      case 'cls':
        setCommandOutput([]);
        addOutput('Terminal cleared');
        break;

      case 'help':
      case '?':
        addOutput(t('command.help.title'));
        addOutput(`  ${t('command.help.network')}`);
        addOutput(`  ${t('command.help.programs')}`);
        addOutput(`  ${t('command.help.addAgent')}`);
        addOutput(`  ${t('command.help.addMcp')}`);
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

  const handleAddAgent = (args: string[]) => {
    if (args.length < 3) {
      addOutput('Usage: /add_agent <name> <endpoint> <description>', 'error');
      return;
    }

    const [name, endpoint, ...descParts] = args;
    const description = descParts.join(' ');

    const newAgent: Agent = {
      id: String(agents.length + 1),
      name,
      description,
      owner: 'CurrentWalletAddress', // In real implementation, get from wallet
      endpoint,
      status: 'active',
      createdAt: isClient ? new Date() : new Date(0)
    };

    setAgents(prev => [...prev, newAgent]);
    addOutput(`Agent "${name}" added successfully!`);
    addOutput(`ID: ${newAgent.id}`);
    addOutput(`Endpoint: ${endpoint}`);
    addOutput(`Description: ${description}`);
  };

  const handleAddMCP = (args: string[]) => {
    if (args.length < 4) {
      addOutput('Usage: /add_mcp <name> <endpoint> <version> <description>', 'error');
      return;
    }

    const [name, endpoint, version, ...descParts] = args;
    const description = descParts.join(' ');

    const newMCP: MCPServer = {
      id: String(mcpServers.length + 1),
      name,
      description,
      owner: 'CurrentWalletAddress', // In real implementation, get from wallet
      endpoint,
      protocolVersion: version,
      status: 'active',
      createdAt: isClient ? new Date() : new Date(0)
    };

    setMcpServers(prev => [...prev, newMCP]);
    addOutput(`MCP Server "${name}" added successfully!`);
    addOutput(`ID: ${newMCP.id}`);
    addOutput(`Endpoint: ${endpoint}`);
    addOutput(`Version: ${version}`);
    addOutput(`Description: ${description}`);
  };

  const handleFind = (args: string[]) => {
    if (args.length < 2) {
      addOutput('Usage: /find [agent|mcp] <search_term>', 'error');
      return;
    }

    const [type, ...searchParts] = args;
    const searchTerm = searchParts.join(' ').toLowerCase();

    if (type === 'agent' || type === 'agents') {
      const results = agents.filter(agent => 
        agent.name.toLowerCase().includes(searchTerm) ||
        agent.description.toLowerCase().includes(searchTerm) ||
        agent.endpoint.toLowerCase().includes(searchTerm)
      );

      if (results.length === 0) {
        addOutput(`No agents found matching "${searchTerm}"`);
      } else {
        addOutput(`Found ${results.length} agent(s):`);
        results.forEach(agent => {
          addOutput(`  [${agent.id}] ${agent.name} - ${agent.status}`);
          addOutput(`      ${agent.endpoint}`);
          addOutput(`      ${agent.description}`);
        });
      }
    } else if (type === 'mcp' || type === 'mcps') {
      const results = mcpServers.filter(mcp => 
        mcp.name.toLowerCase().includes(searchTerm) ||
        mcp.description.toLowerCase().includes(searchTerm) ||
        mcp.endpoint.toLowerCase().includes(searchTerm)
      );

      if (results.length === 0) {
        addOutput(`No MCP servers found matching "${searchTerm}"`);
      } else {
        addOutput(`Found ${results.length} MCP server(s):`);
        results.forEach(mcp => {
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
      addOutput(`Total agents: ${agents.length}`);
      agents.forEach(agent => {
        addOutput(`[${agent.id}] ${agent.name} - ${agent.status}`);
        addOutput(`    Owner: ${agent.owner.substring(0, 8)}...`);
        addOutput(`    Endpoint: ${agent.endpoint}`);
        addOutput(`    Created: ${isClient ? agent.createdAt.toLocaleDateString() : agent.createdAt.toISOString().split('T')[0]}`);
      });
    } else if (type === 'mcp' || type === 'mcps') {
      addOutput(`Total MCP servers: ${mcpServers.length}`);
      mcpServers.forEach(mcp => {
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
                const newNetwork = networkStats.network === 'mainnet' ? 'devnet' : 'mainnet';
                setNetworkStats(prev => ({ ...prev, network: newNetwork }));
                toast.success(`Switched to ${newNetwork.toUpperCase()}`);
              }}
              title="Click to switch network"
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