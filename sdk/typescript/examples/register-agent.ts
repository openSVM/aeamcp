/**
 * Example: Register an AI agent with the Solana AI Registries
 */

import { PublicKey, Keypair } from '@solana/web3.js';
import { Wallet } from '@coral-xyz/anchor';
import { createSdk, DEFAULT_CONFIGS, AgentRegistrationData, AgentTier } from '@svmai/registries';

async function registerAgentExample() {
  // Initialize SDK with devnet configuration
  const sdk = createSdk(DEFAULT_CONFIGS.devnet);

  // Create or load wallet (in production, use proper key management)
  const keypair = Keypair.generate(); // Don't do this in production!
  const wallet = new Wallet(keypair);

  // Initialize SDK with wallet
  await sdk.initialize(wallet);

  // Define agent registration data
  const agentData: AgentRegistrationData = {
    agentId: 'example-ai-agent-001',
    name: 'Example AI Assistant',
    description: 'A powerful AI assistant capable of text processing, data analysis, and task automation',
    version: '1.2.0',
    providerName: 'Example AI Company',
    providerUrl: 'https://example-ai.com',
    documentationUrl: 'https://docs.example-ai.com/agent',
    serviceEndpoints: [
      {
        protocol: 'https',
        url: 'https://api.example-ai.com/v1/chat',
      },
      {
        protocol: 'wss',
        url: 'wss://api.example-ai.com/v1/stream',
      },
    ],
    supportedModes: ['text', 'multimodal', 'structured'],
    skills: [
      {
        id: 'text-processing',
        name: 'Advanced Text Processing',
        tags: ['nlp', 'text', 'analysis'],
      },
      {
        id: 'data-analysis',
        name: 'Data Analysis & Visualization',
        tags: ['data', 'analytics', 'charts'],
      },
      {
        id: 'task-automation',
        name: 'Task Automation',
        tags: ['automation', 'workflow', 'productivity'],
      },
    ],
    securityInfoUri: 'https://security.example-ai.com/agent-security',
    aeaAddress: 'aea://example-ai-agent',
    economicIntent: 'Provide high-quality AI assistance for productivity and analysis tasks',
    extendedMetadataUri: 'https://metadata.example-ai.com/agent/extended.json',
    tags: ['ai', 'assistant', 'productivity', 'enterprise'],
  };

  try {
    console.log('🤖 Registering AI agent...');
    
    // Register the agent with Silver tier staking
    const result = await sdk.agent.registerAgent(agentData, AgentTier.Silver);
    
    console.log('✅ Agent registered successfully!');
    console.log('📝 Transaction signature:', result.signature);
    console.log('🏷️  Agent ID:', agentData.agentId);
    console.log('⏰ Slot:', result.slot.toString());
    
    // Retrieve the registered agent to verify
    console.log('\n🔍 Retrieving registered agent...');
    const retrievedAgent = await sdk.agent.getAgent(agentData.agentId);
    
    console.log('📊 Agent details:');
    console.log('   Name:', retrievedAgent.name);
    console.log('   Status:', retrievedAgent.status);
    console.log('   Version:', retrievedAgent.version);
    console.log('   Skills:', retrievedAgent.skills.length);
    console.log('   Tags:', retrievedAgent.tags.join(', '));
    
    // Check staking information
    console.log('\n💰 Checking staking information...');
    const stakingInfo = await sdk.agent.getStakingInfo(agentData.agentId);
    if (stakingInfo) {
      console.log('   Stake amount:', stakingInfo.amount.toString(), 'base units');
      console.log('   Tier:', stakingInfo.tier);
      console.log('   Lock period:', stakingInfo.lockPeriod, 'seconds');
    }
    
    return {
      agentId: agentData.agentId,
      signature: result.signature,
      agent: retrievedAgent,
    };
    
  } catch (error) {
    console.error('❌ Failed to register agent:', error);
    throw error;
  }
}

// Example of updating an agent
async function updateAgentExample(agentId: string) {
  const sdk = createSdk(DEFAULT_CONFIGS.devnet);
  const keypair = Keypair.generate();
  const wallet = new Wallet(keypair);
  await sdk.initialize(wallet);

  try {
    console.log('🔄 Updating agent...');
    
    const updateData = {
      version: '1.3.0',
      description: 'Enhanced AI assistant with improved capabilities and performance',
      skills: [
        {
          id: 'text-processing',
          name: 'Advanced Text Processing',
          tags: ['nlp', 'text', 'analysis', 'multilingual'],
        },
        {
          id: 'data-analysis',
          name: 'Advanced Data Analysis & Visualization',
          tags: ['data', 'analytics', 'charts', 'ml'],
        },
        {
          id: 'task-automation',
          name: 'Intelligent Task Automation',
          tags: ['automation', 'workflow', 'productivity', 'ai'],
        },
        {
          id: 'code-generation',
          name: 'Code Generation & Review',
          tags: ['code', 'programming', 'review'],
        },
      ],
      tags: ['ai', 'assistant', 'productivity', 'enterprise', 'enhanced'],
    };
    
    const result = await sdk.agent.updateAgent(agentId, updateData);
    
    console.log('✅ Agent updated successfully!');
    console.log('📝 Transaction signature:', result.signature);
    
    // Retrieve updated agent
    const updatedAgent = await sdk.agent.getAgent(agentId);
    console.log('📊 Updated agent version:', updatedAgent.version);
    console.log('🏷️  Updated tags:', updatedAgent.tags.join(', '));
    
    return result;
    
  } catch (error) {
    console.error('❌ Failed to update agent:', error);
    throw error;
  }
}

// Example of searching for agents
async function searchAgentsExample() {
  const sdk = createSdk(DEFAULT_CONFIGS.devnet);
  const keypair = Keypair.generate();
  const wallet = new Wallet(keypair);
  await sdk.initialize(wallet);

  try {
    console.log('🔍 Searching for AI agents...');
    
    // Search by tags
    const aiAgents = await sdk.agent.searchAgentsByTags(['ai', 'assistant']);
    console.log(`Found ${aiAgents.length} AI assistant agents`);
    
    // List your own agents
    const myAgents = await sdk.agent.listAgentsByOwner();
    console.log(`You own ${myAgents.length} agents`);
    
    // Display agent information
    for (const agentAccount of aiAgents.slice(0, 5)) { // Show first 5
      const agent = agentAccount.account;
      console.log(`\n🤖 ${agent.name} (${agent.agentId})`);
      console.log(`   Provider: ${agent.providerName}`);
      console.log(`   Version: ${agent.version}`);
      console.log(`   Skills: ${agent.skills.length}`);
      console.log(`   Status: ${agent.status}`);
    }
    
    return aiAgents;
    
  } catch (error) {
    console.error('❌ Failed to search agents:', error);
    throw error;
  }
}

// Run the examples
async function main() {
  try {
    console.log('🚀 Starting agent registration example...\n');
    
    // Register an agent
    const registration = await registerAgentExample();
    
    console.log('\n⏳ Waiting before update...');
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    // Update the agent
    await updateAgentExample(registration.agentId);
    
    console.log('\n⏳ Waiting before search...');
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    // Search for agents
    await searchAgentsExample();
    
    console.log('\n🎉 All examples completed successfully!');
    
  } catch (error) {
    console.error('\n💥 Example failed:', error);
    process.exit(1);
  }
}

// Only run if this file is executed directly
if (require.main === module) {
  main().catch(console.error);
}

export {
  registerAgentExample,
  updateAgentExample,
  searchAgentsExample,
};