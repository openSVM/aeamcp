/**
 * Example: Register and manage MCP servers with the Solana AI Registries
 */

import { PublicKey, Keypair } from '@solana/web3.js';
import { Wallet } from '@coral-xyz/anchor';
import { createSdk, DEFAULT_CONFIGS, McpServerRegistrationData } from '@svmai/registries';

async function registerMcpServerExample() {
  // Initialize SDK with devnet configuration
  const sdk = createSdk(DEFAULT_CONFIGS.devnet);

  // Create or load wallet (in production, use proper key management)
  const keypair = Keypair.generate();
  const wallet = new Wallet(keypair);

  // Initialize SDK with wallet
  await sdk.initialize(wallet);

  // Define MCP server registration data
  const serverData: McpServerRegistrationData = {
    serverId: 'example-mcp-server-001',
    name: 'Example Data Analysis MCP Server',
    version: '2.1.0',
    endpointUrl: 'https://mcp.example-data.com/v2',
    capabilitiesSummary: 'Advanced data analysis, visualization, and reporting tools for business intelligence',
    onchainToolDefinitions: [
      {
        name: 'analyze-dataset',
        tags: ['data', 'analysis'],
      },
      {
        name: 'generate-chart',
        tags: ['visualization', 'charts'],
      },
      {
        name: 'export-report',
        tags: ['export', 'reporting'],
      },
      {
        name: 'query-database',
        tags: ['database', 'sql'],
      },
    ],
    onchainResourceDefinitions: [
      {
        uriPattern: '/datasets/*',
        tags: ['data'],
      },
      {
        uriPattern: '/reports/*',
        tags: ['reports'],
      },
      {
        uriPattern: '/visualizations/*',
        tags: ['charts'],
      },
    ],
    onchainPromptDefinitions: [
      {
        name: 'data-analysis-prompt',
        tags: ['analysis'],
      },
      {
        name: 'report-generation-prompt',
        tags: ['reporting'],
      },
    ],
    fullCapabilitiesUri: 'https://capabilities.example-data.com/mcp/full.json',
    documentationUrl: 'https://docs.example-data.com/mcp-server',
    tags: ['data', 'analytics', 'business-intelligence', 'mcp'],
  };

  try {
    console.log('🖥️ Registering MCP server...');
    
    // Register the MCP server
    const result = await sdk.mcp.registerServer(serverData);
    
    console.log('✅ MCP server registered successfully!');
    console.log('📝 Transaction signature:', result.signature);
    console.log('🏷️  Server ID:', serverData.serverId);
    console.log('⏰ Slot:', result.slot.toString());
    
    // Retrieve the registered server to verify
    console.log('\n🔍 Retrieving registered MCP server...');
    const retrievedServer = await sdk.mcp.getServer(serverData.serverId);
    
    console.log('📊 Server details:');
    console.log('   Name:', retrievedServer.name);
    console.log('   Status:', retrievedServer.status);
    console.log('   Version:', retrievedServer.version);
    console.log('   Endpoint:', retrievedServer.endpointUrl);
    console.log('   Tools:', retrievedServer.onchainToolDefinitions.length);
    console.log('   Resources:', retrievedServer.onchainResourceDefinitions.length);
    console.log('   Prompts:', retrievedServer.onchainPromptDefinitions.length);
    console.log('   Tags:', retrievedServer.tags.join(', '));
    
    return {
      serverId: serverData.serverId,
      signature: result.signature,
      server: retrievedServer,
    };
    
  } catch (error) {
    console.error('❌ Failed to register MCP server:', error);
    throw error;
  }
}

// Example of updating an MCP server
async function updateMcpServerExample(serverId: string) {
  const sdk = createSdk(DEFAULT_CONFIGS.devnet);
  const keypair = Keypair.generate();
  const wallet = new Wallet(keypair);
  await sdk.initialize(wallet);

  try {
    console.log('🔄 Updating MCP server...');
    
    const updateData = {
      version: '2.2.0',
      capabilitiesSummary: 'Enhanced data analysis with machine learning capabilities and real-time processing',
      onchainToolDefinitions: [
        {
          name: 'analyze-dataset',
          tags: ['data', 'analysis'],
        },
        {
          name: 'generate-chart',
          tags: ['visualization', 'charts'],
        },
        {
          name: 'export-report',
          tags: ['export', 'reporting'],
        },
        {
          name: 'query-database',
          tags: ['database', 'sql'],
        },
        {
          name: 'ml-predict',
          tags: ['ml', 'prediction'],
        },
      ],
      onchainResourceDefinitions: [
        {
          uriPattern: '/datasets/*',
          tags: ['data'],
        },
        {
          uriPattern: '/reports/*',
          tags: ['reports'],
        },
        {
          uriPattern: '/visualizations/*',
          tags: ['charts'],
        },
        {
          uriPattern: '/models/*',
          tags: ['ml'],
        },
      ],
      tags: ['data', 'analytics', 'business-intelligence', 'mcp', 'ml', 'realtime'],
    };
    
    const result = await sdk.mcp.updateServer(serverId, updateData);
    
    console.log('✅ MCP server updated successfully!');
    console.log('📝 Transaction signature:', result.signature);
    
    // Retrieve updated server
    const updatedServer = await sdk.mcp.getServer(serverId);
    console.log('📊 Updated server version:', updatedServer.version);
    console.log('🔧 Updated tools count:', updatedServer.onchainToolDefinitions.length);
    console.log('🏷️  Updated tags:', updatedServer.tags.join(', '));
    
    return result;
    
  } catch (error) {
    console.error('❌ Failed to update MCP server:', error);
    throw error;
  }
}

// Example of searching for MCP servers
async function searchMcpServersExample() {
  const sdk = createSdk(DEFAULT_CONFIGS.devnet);
  const keypair = Keypair.generate();
  const wallet = new Wallet(keypair);
  await sdk.initialize(wallet);

  try {
    console.log('🔍 Searching for MCP servers...');
    
    // Search by capabilities
    const dataServers = await sdk.mcp.searchServersByCapabilities(['data', 'analysis']);
    console.log(`Found ${dataServers.length} data analysis servers`);
    
    // Search by specific tools
    const chartServers = await sdk.mcp.getServersByTool('generate-chart');
    console.log(`Found ${chartServers.length} servers with chart generation tools`);
    
    // Search by resource patterns
    const datasetServers = await sdk.mcp.getServersByResource('datasets');
    console.log(`Found ${datasetServers.length} servers providing dataset resources`);
    
    // Search by prompts
    const reportServers = await sdk.mcp.getServersByPrompt('report');
    console.log(`Found ${reportServers.length} servers with reporting prompts`);
    
    // List your own servers
    const myServers = await sdk.mcp.listServersByOwner();
    console.log(`You own ${myServers.length} MCP servers`);
    
    // Display server information
    console.log('\n📋 Data Analysis Servers:');
    for (const serverAccount of dataServers.slice(0, 3)) { // Show first 3
      const server = serverAccount.account;
      console.log(`\n🖥️ ${server.name} (${server.serverId})`);
      console.log(`   Version: ${server.version}`);
      console.log(`   Endpoint: ${server.endpointUrl}`);
      console.log(`   Status: ${server.status}`);
      console.log(`   Capabilities: ${server.capabilitiesSummary}`);
      console.log(`   Tools: ${server.onchainToolDefinitions.map(t => t.name).join(', ')}`);
      console.log(`   Resources: ${server.onchainResourceDefinitions.length} defined`);
    }
    
    return {
      dataServers,
      chartServers,
      datasetServers,
      reportServers,
      myServers,
    };
    
  } catch (error) {
    console.error('❌ Failed to search MCP servers:', error);
    throw error;
  }
}

// Example of using MCP server tools (simulation)
async function useMcpServerToolsExample(serverId: string) {
  const sdk = createSdk(DEFAULT_CONFIGS.devnet);
  const keypair = Keypair.generate();
  const wallet = new Wallet(keypair);
  await sdk.initialize(wallet);

  try {
    console.log('🔧 Simulating MCP server tool usage...');
    
    // Get server information
    const server = await sdk.mcp.getServer(serverId);
    console.log(`Using tools from: ${server.name}`);
    
    // Simulate tool usage with pay-as-you-go billing
    const payAsYouGoConfig = {
      method: 'pay_as_you_go' as const,
      payer: wallet.publicKey,
      recipient: server.owner,
      perUsePrice: 10000000n, // 0.01 A2AMPL per tool use
      pricing: {
        basePrice: 10000000n,
        currency: 'A2AMPL' as const,
      },
    };

    // Simulate using different tools
    const toolUsages = [
      { tool: 'analyze-dataset', cost: 20000000n, metadata: { dataset: 'sales_data_2024.csv' } },
      { tool: 'generate-chart', cost: 15000000n, metadata: { chartType: 'bar', dataPoints: 100 } },
      { tool: 'export-report', cost: 10000000n, metadata: { format: 'pdf', pages: 5 } },
    ];

    for (const usage of toolUsages) {
      console.log(`\n🔨 Using tool: ${usage.tool}`);
      
      // Record the usage
      sdk.payments.payAsYouGo.recordUsage(
        serverId,
        wallet.publicKey,
        usage.cost,
        usage.metadata
      );
      
      console.log(`   Cost: ${usage.cost.toString()} base units`);
      console.log(`   Metadata:`, usage.metadata);
    }

    // Get usage summary
    const usageSummary = sdk.payments.payAsYouGo.getUsageSummary(serverId);
    console.log('\n💰 Usage Summary:');
    console.log(`   Total cost: ${usageSummary.totalCost.toString()} base units`);
    console.log(`   Tool uses: ${usageSummary.usageCount}`);
    console.log(`   Average cost: ${usageSummary.averageCost.toString()} base units`);

    // Execute payment for the usage
    console.log('\n💳 Processing payment...');
    const paymentResult = await sdk.payments.payAsYouGo.executeUsagePayment(
      payAsYouGoConfig,
      serverId
    );

    console.log('✅ Payment processed successfully!');
    console.log('📝 Transaction signature:', paymentResult.result.signature);
    console.log('💰 Total amount paid:', paymentResult.totalAmount.toString(), 'base units');
    console.log('🔢 Tool uses paid for:', paymentResult.usageCount);

    return {
      server,
      usageSummary,
      paymentResult,
    };
    
  } catch (error) {
    console.error('❌ Failed to use MCP server tools:', error);
    throw error;
  }
}

// Run the examples
async function main() {
  try {
    console.log('🚀 Starting MCP server examples...\n');
    
    // Register an MCP server
    const registration = await registerMcpServerExample();
    
    console.log('\n⏳ Waiting before update...');
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    // Update the MCP server
    await updateMcpServerExample(registration.serverId);
    
    console.log('\n⏳ Waiting before search...');
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    // Search for MCP servers
    await searchMcpServersExample();
    
    console.log('\n⏳ Waiting before tool usage...');
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    // Simulate tool usage
    await useMcpServerToolsExample(registration.serverId);
    
    console.log('\n🎉 All MCP server examples completed successfully!');
    
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
  registerMcpServerExample,
  updateMcpServerExample,
  searchMcpServersExample,
  useMcpServerToolsExample,
};