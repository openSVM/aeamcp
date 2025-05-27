'use client';

import { useState, useEffect, useRef, useCallback } from 'react';
import { Connection, PublicKey } from '@solana/web3.js';

// Types for status bar data
export interface NetworkStatus {
  network: 'mainnet' | 'devnet' | 'testnet';
  health: 'healthy' | 'degraded' | 'down';
  latency: number;
  blockHeight: number;
  tps: number;
}

export interface ProgramActivity {
  address: string;
  name: string;
  transactionCount: number;
  successRate: number;
  lastActivity: Date;
  volume24h: number;
}

export interface AgentMetrics {
  id: string;
  name: string;
  successPercentage: number;
  responseTime: number;
  activeTasks: number;
  status: 'active' | 'idle' | 'error';
  uptime: number;
}

export interface MCPEntry {
  id: string;
  name: string;
  connectionStatus: 'connected' | 'connecting' | 'disconnected';
  activityLevel: number;
  protocolVersion: string;
  lastHeartbeat: Date;
}

export interface RecentAction {
  id: string;
  type: string;
  timestamp: Date;
  status: 'success' | 'pending' | 'failed';
  transactionHash?: string;
  details?: string;
}

export interface WebSocketStatus {
  connected: boolean;
  reconnecting: boolean;
  lastHeartbeat: Date | null;
  connectionAttempts: number;
}

interface StatusData {
  networkStatus: NetworkStatus;
  programActivities: ProgramActivity[];
  topAgents: AgentMetrics[];
  mcpEntries: MCPEntry[];
  recentAction: RecentAction | null;
  wsStatus: WebSocketStatus;
}

const useRetroStatusData = () => {
  const [data, setData] = useState<StatusData>({
    networkStatus: {
      network: 'devnet',
      health: 'healthy',
      latency: 0,
      blockHeight: 0,
      tps: 0
    },
    programActivities: [],
    topAgents: [],
    mcpEntries: [],
    recentAction: null,
    wsStatus: {
      connected: false,
      reconnecting: false,
      lastHeartbeat: null,
      connectionAttempts: 0
    }
  });

  const wsRef = useRef<WebSocket | null>(null);
  const reconnectTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const heartbeatIntervalRef = useRef<NodeJS.Timeout | null>(null);
  const connectionRef = useRef<Connection | null>(null);

  // Initialize Solana connection
  const initializeSolanaConnection = useCallback(() => {
    try {
      // Use environment variable or default to devnet
      const rpcUrl = process.env.NEXT_PUBLIC_SOLANA_RPC_URL || 'https://api.devnet.solana.com';
      connectionRef.current = new Connection(rpcUrl, 'confirmed');
      
      // Determine network from RPC URL
      let network: 'mainnet' | 'devnet' | 'testnet' = 'devnet';
      if (rpcUrl.includes('mainnet')) network = 'mainnet';
      else if (rpcUrl.includes('testnet')) network = 'testnet';
      
      setData(prev => ({
        ...prev,
        networkStatus: { ...prev.networkStatus, network }
      }));
    } catch (error) {
      console.error('Failed to initialize Solana connection:', error);
    }
  }, []);

  // Fetch real Solana network data
  const fetchNetworkStatus = useCallback(async () => {
    if (!connectionRef.current) return;

    try {
      const startTime = Date.now();
      const blockHeight = await connectionRef.current.getBlockHeight();
      const latency = Date.now() - startTime;

      // Get TPS (simplified calculation)
      let tps = 0;
      try {
        const recentPerformance = await connectionRef.current.getRecentPerformanceSamples(1);
        tps = recentPerformance[0]?.numTransactions || 0;
      } catch (perfError) {
        console.warn('Could not fetch performance samples:', perfError);
      }

      // Determine health based on latency and successful connection
      let health: 'healthy' | 'degraded' | 'down' = 'healthy';
      if (latency > 2000) health = 'degraded';
      if (latency > 5000) health = 'down';

      setData(prev => ({
        ...prev,
        networkStatus: {
          ...prev.networkStatus,
          blockHeight,
          latency,
          tps,
          health
        }
      }));
    } catch (error) {
      console.error('Failed to fetch network status:', error);
      setData(prev => ({
        ...prev,
        networkStatus: {
          ...prev.networkStatus,
          health: 'down',
          latency: 9999
        }
      }));
    }
  }, []);

  // WebSocket connection management
  const connectWebSocket = useCallback(() => {
    // In production, this would connect to your actual WebSocket server
    const wsUrl = process.env.NEXT_PUBLIC_WS_URL || 'wss://api.your-domain.com/ws';
    
    try {
      const ws = new WebSocket(wsUrl);
      
      ws.onopen = () => {
        setData(prev => ({
          ...prev,
          wsStatus: {
            connected: true,
            reconnecting: false,
            lastHeartbeat: new Date(),
            connectionAttempts: 0
          }
        }));
        
        // Start heartbeat
        heartbeatIntervalRef.current = setInterval(() => {
          if (ws.readyState === WebSocket.OPEN) {
            ws.send(JSON.stringify({ type: 'ping' }));
          }
        }, 30000);
        
        console.log('WebSocket connected');
      };
      
      ws.onmessage = (event) => {
        try {
          const message = JSON.parse(event.data);
          handleWebSocketMessage(message);
          
          setData(prev => ({
            ...prev,
            wsStatus: { ...prev.wsStatus, lastHeartbeat: new Date() }
          }));
        } catch (error) {
          console.error('Error parsing WebSocket message:', error);
        }
      };
      
      ws.onclose = () => {
        setData(prev => ({
          ...prev,
          wsStatus: { ...prev.wsStatus, connected: false }
        }));
        
        if (heartbeatIntervalRef.current) {
          clearInterval(heartbeatIntervalRef.current);
        }
        
        console.log('WebSocket disconnected');
        
        // Auto-reconnect with exponential backoff
        const attempts = data.wsStatus.connectionAttempts;
        const delay = Math.min(1000 * Math.pow(2, attempts), 30000);
        
        reconnectTimeoutRef.current = setTimeout(() => {
          setData(prev => ({
            ...prev,
            wsStatus: {
              ...prev.wsStatus,
              reconnecting: true,
              connectionAttempts: attempts + 1
            }
          }));
          connectWebSocket();
        }, delay);
      };
      
      ws.onerror = (error) => {
        console.error('WebSocket error:', error);
        setData(prev => ({
          ...prev,
          wsStatus: { ...prev.wsStatus, connected: false }
        }));
      };
      
      wsRef.current = ws;
    } catch (error) {
      console.error('Failed to connect WebSocket:', error);
      // Fall back to mock data if WebSocket fails
      initializeMockData();
    }
  }, [data.wsStatus.connectionAttempts]);

  // Handle WebSocket messages
  const handleWebSocketMessage = useCallback((message: any) => {
    switch (message.type) {
      case 'network_status':
        setData(prev => ({
          ...prev,
          networkStatus: { ...prev.networkStatus, ...message.payload }
        }));
        break;
      case 'program_activities':
        setData(prev => ({
          ...prev,
          programActivities: message.payload
        }));
        break;
      case 'agent_metrics':
        setData(prev => ({
          ...prev,
          topAgents: message.payload
        }));
        break;
      case 'mcp_entries':
        setData(prev => ({
          ...prev,
          mcpEntries: message.payload
        }));
        break;
      case 'recent_action':
        setData(prev => ({
          ...prev,
          recentAction: message.payload
        }));
        break;
      case 'pong':
        // Heartbeat response
        break;
    }
  }, []);

  // Initialize mock data for development/fallback
  const initializeMockData = useCallback(() => {
    // Mock program activities
    const mockPrograms: ProgramActivity[] = Array.from({ length: 24 }, (_, i) => ({
      address: `${Math.random().toString(36).substring(2, 15)}...${Math.random().toString(36).substring(2, 7)}`,
      name: `Program ${i + 1}`,
      transactionCount: Math.floor(Math.random() * 10000) + 100,
      successRate: Math.floor(Math.random() * 20) + 80,
      lastActivity: new Date(Date.now() - Math.random() * 3600000),
      volume24h: Math.floor(Math.random() * 1000000) + 10000
    }));

    // Mock agents
    const mockAgents: AgentMetrics[] = Array.from({ length: 3 }, (_, i) => ({
      id: `agent-${i + 1}`,
      name: `AI Agent ${i + 1}`,
      successPercentage: Math.floor(Math.random() * 20) + 80,
      responseTime: Math.floor(Math.random() * 500) + 50,
      activeTasks: Math.floor(Math.random() * 10) + 1,
      status: ['active', 'idle', 'error'][Math.floor(Math.random() * 3)] as any,
      uptime: Math.floor(Math.random() * 100) + 90
    }));

    // Mock MCP entries
    const mockMCP: MCPEntry[] = Array.from({ length: 3 }, (_, i) => ({
      id: `mcp-${i + 1}`,
      name: `MCP Server ${i + 1}`,
      connectionStatus: ['connected', 'connecting', 'disconnected'][Math.floor(Math.random() * 3)] as any,
      activityLevel: Math.floor(Math.random() * 100),
      protocolVersion: `v1.${Math.floor(Math.random() * 5)}.0`,
      lastHeartbeat: new Date(Date.now() - Math.random() * 60000)
    }));

    // Mock recent action
    const mockAction: RecentAction = {
      id: 'action-1',
      type: 'Agent Registration',
      timestamp: new Date(),
      status: 'success',
      transactionHash: '5KJp7z8mN2qR4vL1xF9eH3wC6tY8uI0pA7sD2fG5hJ9k',
      details: 'New AI agent successfully registered'
    };

    setData(prev => ({
      ...prev,
      programActivities: mockPrograms,
      topAgents: mockAgents,
      mcpEntries: mockMCP,
      recentAction: mockAction
    }));
  }, []);

  // Simulate real-time updates for mock data
  const simulateUpdates = useCallback(() => {
    const interval = setInterval(() => {
      // Update random program activity
      setData(prev => ({
        ...prev,
        programActivities: prev.programActivities.map(program => ({
          ...program,
          transactionCount: program.transactionCount + Math.floor(Math.random() * 5),
          lastActivity: Math.random() > 0.8 ? new Date() : program.lastActivity
        }))
      }));

      // Update agent metrics
      setData(prev => ({
        ...prev,
        topAgents: prev.topAgents.map(agent => ({
          ...agent,
          activeTasks: Math.max(0, agent.activeTasks + (Math.random() > 0.5 ? 1 : -1)),
          responseTime: Math.max(10, agent.responseTime + (Math.random() - 0.5) * 20)
        }))
      }));

      // Update MCP activity levels
      setData(prev => ({
        ...prev,
        mcpEntries: prev.mcpEntries.map(mcp => ({
          ...mcp,
          activityLevel: Math.max(0, Math.min(100, mcp.activityLevel + (Math.random() - 0.5) * 20)),
          lastHeartbeat: mcp.connectionStatus === 'connected' ? new Date() : mcp.lastHeartbeat
        }))
      }));
    }, 5000);

    return () => clearInterval(interval);
  }, []);

  // Initialize everything
  useEffect(() => {
    initializeSolanaConnection();
    initializeMockData();
    connectWebSocket();

    // Start network status polling
    const networkInterval = setInterval(fetchNetworkStatus, 10000);
    fetchNetworkStatus(); // Initial fetch

    // Start mock data simulation
    const cleanupSimulation = simulateUpdates();

    return () => {
      if (wsRef.current) {
        wsRef.current.close();
      }
      if (reconnectTimeoutRef.current) {
        clearTimeout(reconnectTimeoutRef.current);
      }
      if (heartbeatIntervalRef.current) {
        clearInterval(heartbeatIntervalRef.current);
      }
      clearInterval(networkInterval);
      cleanupSimulation();
    };
  }, [initializeSolanaConnection, fetchNetworkStatus, connectWebSocket, simulateUpdates]);

  return data;
};

export default useRetroStatusData;