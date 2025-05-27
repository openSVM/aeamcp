import { TourConfig } from './types';

export const developerTourConfig: TourConfig = {
  id: 'developer-onboarding',
  userType: 'developer',
  title: 'Build with AI Registries',
  description: 'Learn to integrate AI agents and MCP servers into your applications',
  estimatedDuration: 900, // 15 minutes
  steps: [
    {
      id: 'welcome',
      title: '🚀 Welcome, Developer!',
      content: `
        <div class="space-y-4">
          <h2 class="text-xl font-bold">Revolutionize your AI integration workflow</h2>
          <p>You're about to discover how Solana AI Registries can revolutionize your AI integration workflow.</p>
          
          <div class="bg-gray-100 p-3 border border-gray-300">
            <h3 class="font-bold mb-2">What you'll learn:</h3>
            <ul class="list-disc list-inside space-y-1 text-sm">
              <li>How to find and integrate verified AI agents</li>
              <li>Connecting to MCP servers for tools and resources</li>
              <li>Using $SVMAI tokens for payments and governance</li>
              <li>Best practices for production deployment</li>
            </ul>
          </div>
          
          <blockquote class="border-l-4 border-yellow-500 pl-4 italic">
            "Reduced our AI integration time from weeks to hours" - Sarah Chen, Lead Developer at DeFi Labs
          </blockquote>
          
          <p class="font-bold">Ready to build the future of AI applications?</p>
        </div>
      `,
      target: 'section:first-of-type',
      position: 'center',
      action: 'click',
      nextCondition: 'manual',
      duration: 60,
    },
    {
      id: 'agent-registry',
      title: '🤖 Agent Registry: Your AI Marketplace',
      content: `
        <div class="space-y-4">
          <h2 class="text-lg font-bold">Think of this as "npm for AI agents"</h2>
          <p>A decentralized registry where you can:</p>
          
          <div class="grid grid-cols-1 gap-3">
            <div class="flex items-start space-x-2">
              <span class="text-lg">🔍</span>
              <div>
                <strong>Smart Discovery:</strong> Find agents by skills, performance, and compatibility
              </div>
            </div>
            <div class="flex items-start space-x-2">
              <span class="text-lg">🔐</span>
              <div>
                <strong>Blockchain Verification:</strong> Cryptographic proof of agent authenticity
              </div>
            </div>
            <div class="flex items-start space-x-2">
              <span class="text-lg">📡</span>
              <div>
                <strong>Standardized APIs:</strong> A2A protocol compliance for seamless integration
              </div>
            </div>
            <div class="flex items-start space-x-2">
              <span class="text-lg">📊</span>
              <div>
                <strong>Real-time Monitoring:</strong> Live status, performance metrics, and SLA tracking
              </div>
            </div>
          </div>
          
          <div class="bg-blue-50 p-3 border border-blue-200">
            <h3 class="font-bold mb-2">Real-World Example:</h3>
            <p class="text-sm">Your DeFi app needs market analysis? Search for agents with "market-analysis" skills, verify their track record, and integrate via standardized endpoints.</p>
          </div>
        </div>
      `,
      target: '.ascii-card:first-of-type',
      position: 'right',
      action: 'click',
      nextCondition: 'manual',
      duration: 90,
      expandableSections: {
        advancedSearch: {
          title: '🔍 Advanced Search Filters',
          content: 'Learn about complex query examples and filtering options'
        },
        performanceMetrics: {
          title: '📊 Performance Metrics Explained',
          content: 'Detailed explanation of SLA tracking and monitoring'
        },
        security: {
          title: '🔐 Security & Verification',
          content: 'How cryptographic verification ensures agent authenticity'
        }
      }
    },
    {
      id: 'mcp-registry',
      title: '🔧 MCP Server Registry: Your AI Toolbox',
      content: `
        <div class="space-y-4">
          <h2 class="text-lg font-bold">Model Context Protocol (MCP) servers provide the building blocks</h2>
          
          <div class="space-y-3">
            <div>
              <h3 class="font-bold text-sm">🛠️ Tools (Functions your AI can call)</h3>
              <ul class="text-xs list-disc list-inside ml-4">
                <li><strong>APIs:</strong> External service integrations</li>
                <li><strong>Calculations:</strong> Mathematical and statistical functions</li>
                <li><strong>Data Processing:</strong> Transform, validate, and analyze data</li>
              </ul>
            </div>
            
            <div>
              <h3 class="font-bold text-sm">📊 Resources (Structured data sources)</h3>
              <ul class="text-xs list-disc list-inside ml-4">
                <li><strong>Databases:</strong> SQL, NoSQL, vector databases</li>
                <li><strong>Files:</strong> Documents, images, structured data</li>
                <li><strong>Real-time Feeds:</strong> Market data, news, social media</li>
              </ul>
            </div>
            
            <div>
              <h3 class="font-bold text-sm">💬 Prompts (Pre-built templates)</h3>
              <ul class="text-xs list-disc list-inside ml-4">
                <li><strong>Domain-specific:</strong> Finance, healthcare, legal</li>
                <li><strong>Task-oriented:</strong> Analysis, generation, classification</li>
                <li><strong>Multi-modal:</strong> Text, image, audio processing</li>
              </ul>
            </div>
          </div>
          
          <div class="bg-green-50 p-3 border border-green-200">
            <h3 class="font-bold mb-2 text-sm">Real Integration Example:</h3>
            <p class="text-xs">Building a financial chatbot? Find MCP servers offering stock price tools, economic data resources, and financial analysis prompts.</p>
          </div>
        </div>
      `,
      target: '.ascii-card:nth-of-type(2)',
      position: 'left',
      action: 'hover',
      nextCondition: 'manual',
      duration: 120,
    },
    {
      id: 'token-integration',
      title: '💰 $SVMAI: More Than Just Payment',
      content: `
        <div class="space-y-4">
          <h2 class="text-lg font-bold">Unlock the full potential of the ecosystem</h2>
          
          <div class="grid grid-cols-2 gap-3 text-xs">
            <div>
              <h3 class="font-bold">🗳️ Governance</h3>
              <p>Vote on protocol upgrades and new features</p>
            </div>
            <div>
              <h3 class="font-bold">💎 Staking</h3>
              <p>Earn rewards while securing the network</p>
            </div>
            <div>
              <h3 class="font-bold">🔐 Premium Access</h3>
              <p>Unlock advanced agents and priority support</p>
            </div>
            <div>
              <h3 class="font-bold">⚡ Gas Optimization</h3>
              <p>Reduced transaction costs for frequent users</p>
            </div>
          </div>
          
          <div class="bg-yellow-50 p-3 border border-yellow-200">
            <h3 class="font-bold mb-2 text-sm">Integration Benefits:</h3>
            <ul class="text-xs list-disc list-inside">
              <li>Built-in payment rails for AI services</li>
              <li>Reputation system for quality assurance</li>
              <li>Community-driven feature development</li>
            </ul>
          </div>
        </div>
      `,
      target: '.ascii-card:nth-of-type(3)',
      position: 'top',
      action: 'click',
      nextCondition: 'manual',
      duration: 90,
    },
    {
      id: 'sdk-integration',
      title: '📚 SDK Integration Made Simple',
      content: `
        <div class="space-y-4">
          <h2 class="text-lg font-bold">Everything you need for seamless integration</h2>
          
          <div class="bg-gray-100 p-3 border border-gray-300">
            <h3 class="font-bold mb-2 text-sm">Installation & Setup:</h3>
            <pre class="text-xs bg-black text-green-400 p-2 rounded">npm install @solana-ai/registries-sdk</pre>
          </div>
          
          <div class="bg-gray-100 p-3 border border-gray-300">
            <h3 class="font-bold mb-2 text-sm">Quick Start:</h3>
            <pre class="text-xs bg-black text-green-400 p-2 rounded overflow-x-auto">
const registry = new SolanaAIRegistries({
  network: 'devnet',
  wallet: yourWallet
});

// Find agents by skill
const agents = await registry.agents.findBySkill('trading');

// Connect to MCP server
const server = await registry.mcpServers.connect('financial-data');
            </pre>
          </div>
          
          <p class="text-sm">Next: See this in action with live examples!</p>
        </div>
      `,
      target: 'a[href="/docs.html"]',
      position: 'bottom',
      action: 'click',
      nextCondition: 'manual',
      duration: 180,
    },
  ],
};

export const endUserTourConfig: TourConfig = {
  id: 'enduser-onboarding',
  userType: 'enduser',
  title: 'Discover AI Services',
  description: 'Learn how to find and use AI agents and services',
  estimatedDuration: 600, // 10 minutes
  steps: [
    {
      id: 'welcome',
      title: '🌟 Welcome to the AI Marketplace!',
      content: `
        <div class="space-y-4">
          <h2 class="text-xl font-bold">Discover powerful AI agents and services</h2>
          <p>All verified and accessible through blockchain technology.</p>
          
          <div class="bg-blue-50 p-3 border border-blue-200">
            <h3 class="font-bold mb-2">What you can do here:</h3>
            <ul class="list-disc list-inside space-y-1 text-sm">
              <li>🤖 Find AI agents for any task</li>
              <li>🔧 Access specialized tools and data</li>
              <li>💰 Use $SVMAI tokens for premium features</li>
              <li>🗳️ Help govern the platform's future</li>
            </ul>
          </div>
          
          <p class="font-bold text-green-600">No technical knowledge required - just connect your wallet and explore!</p>
        </div>
      `,
      target: 'section:first-of-type',
      position: 'center',
      action: 'click',
      nextCondition: 'manual',
      duration: 45,
    },
    {
      id: 'understanding-agents',
      title: '🤖 What Are AI Agents?',
      content: `
        <div class="space-y-4">
          <h2 class="text-lg font-bold">Think of AI agents as specialized digital assistants</h2>
          
          <div class="grid grid-cols-1 gap-3">
            <div class="flex items-start space-x-2">
              <span class="text-lg">📈</span>
              <div>
                <strong>Trading Agents:</strong> Analyze markets and execute trades
              </div>
            </div>
            <div class="flex items-start space-x-2">
              <span class="text-lg">✍️</span>
              <div>
                <strong>Content Agents:</strong> Write articles, create social media posts
              </div>
            </div>
            <div class="flex items-start space-x-2">
              <span class="text-lg">🎨</span>
              <div>
                <strong>Creative Agents:</strong> Generate art, music, and designs
              </div>
            </div>
            <div class="flex items-start space-x-2">
              <span class="text-lg">📊</span>
              <div>
                <strong>Analysis Agents:</strong> Process data and generate insights
              </div>
            </div>
          </div>
          
          <p class="text-sm bg-gray-100 p-2 border">Each agent has verified capabilities and transparent pricing.</p>
        </div>
      `,
      target: '.ascii-card:first-of-type',
      position: 'right',
      action: 'hover',
      nextCondition: 'manual',
      duration: 75,
    },
  ],
};

export const providerTourConfig: TourConfig = {
  id: 'provider-onboarding',
  userType: 'provider',
  title: 'Monetize Your AI Services',
  description: 'Learn how to register and monetize your AI services',
  estimatedDuration: 720, // 12 minutes
  steps: [
    {
      id: 'welcome',
      title: '💼 Welcome, AI Service Provider!',
      content: `
        <div class="space-y-4">
          <h2 class="text-xl font-bold">Turn your AI capabilities into a thriving business</h2>
          <p>On the world's first decentralized AI marketplace.</p>
          
          <div class="bg-green-50 p-3 border border-green-200">
            <h3 class="font-bold mb-2">What you'll achieve:</h3>
            <ul class="list-disc list-inside space-y-1 text-sm">
              <li>🌍 Global marketplace reach</li>
              <li>💰 Direct monetization of your AI services</li>
              <li>🔒 Blockchain-verified authenticity</li>
              <li>📈 Community-driven growth</li>
              <li>🏆 Reputation-based success</li>
            </ul>
          </div>
          
          <div class="bg-yellow-50 p-3 border border-yellow-200">
            <h3 class="font-bold mb-2">Success Stories:</h3>
            <p class="text-sm">"DataFlow Analytics" - Went from 0 to $50K/month in 6 months</p>
          </div>
          
          <p class="font-bold">Ready to showcase your AI innovations to the world?</p>
        </div>
      `,
      target: 'section:first-of-type',
      position: 'center',
      action: 'click',
      nextCondition: 'manual',
      duration: 60,
    },
  ],
};

export const tourConfigs = {
  developer: developerTourConfig,
  enduser: endUserTourConfig,
  provider: providerTourConfig,
};

export function getTourConfig(userType: string): TourConfig | null {
  return tourConfigs[userType as keyof typeof tourConfigs] || null;
}