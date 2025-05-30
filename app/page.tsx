import Link from 'next/link';
import { Bot, Server, Search, Plus, Users, Globe } from 'lucide-react';

export default function HomePage() {
  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="bg-gradient-to-br from-[#14F195]/10 to-[#9945FF]/10 py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h1 className="text-4xl md:text-6xl font-bold text-gray-900 dark:text-white mb-6">
              Solana AI Registries
            </h1>
            <p className="text-xl md:text-2xl text-gray-600 dark:text-gray-300 mb-8 max-w-3xl mx-auto">
              Discover and register autonomous AI agents and Model Context Protocol (MCP) servers on the Solana blockchain
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link
                href="/agents"
                className="inline-flex items-center px-6 py-3 border border-transparent text-base font-medium rounded-md text-white bg-gradient-to-r from-[#14F195] to-[#9945FF] hover:opacity-90 transition-opacity"
              >
                <Bot className="mr-2" size={20} />
                Browse Agents
              </Link>
              <Link
                href="/servers"
                className="inline-flex items-center px-6 py-3 border border-gray-300 dark:border-gray-600 text-base font-medium rounded-md text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-800 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
              >
                <Server className="mr-2" size={20} />
                Browse MCP Servers
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 bg-white dark:bg-gray-900">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-4">
              Decentralized AI Discovery
            </h2>
            <p className="text-lg text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
              Built on Solana for fast, secure, and cost-effective AI service discovery and registration
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {/* Agent Registry */}
            <div className="bg-gray-50 dark:bg-gray-800 rounded-lg p-6">
              <div className="w-12 h-12 bg-gradient-to-r from-[#14F195] to-[#9945FF] rounded-lg flex items-center justify-center mb-4">
                <Bot className="text-white" size={24} />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
                Agent Registry
              </h3>
              <p className="text-gray-600 dark:text-gray-300 mb-4">
                Discover autonomous AI agents with verified capabilities, endpoints, and economic intents
              </p>
              <Link
                href="/agents"
                className="text-[#14F195] hover:underline font-medium"
              >
                Explore Agents →
              </Link>
            </div>

            {/* MCP Server Registry */}
            <div className="bg-gray-50 dark:bg-gray-800 rounded-lg p-6">
              <div className="w-12 h-12 bg-gradient-to-r from-[#14F195] to-[#9945FF] rounded-lg flex items-center justify-center mb-4">
                <Server className="text-white" size={24} />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
                MCP Server Registry
              </h3>
              <p className="text-gray-600 dark:text-gray-300 mb-4">
                Find Model Context Protocol servers offering tools, resources, and prompts for AI applications
              </p>
              <Link
                href="/servers"
                className="text-[#14F195] hover:underline font-medium"
              >
                Explore Servers →
              </Link>
            </div>

            {/* Search & Discovery */}
            <div className="bg-gray-50 dark:bg-gray-800 rounded-lg p-6">
              <div className="w-12 h-12 bg-gradient-to-r from-[#14F195] to-[#9945FF] rounded-lg flex items-center justify-center mb-4">
                <Search className="text-white" size={24} />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
                Advanced Search
              </h3>
              <p className="text-gray-600 dark:text-gray-300 mb-4">
                Filter by capabilities, status, tags, and more to find exactly what you need
              </p>
              <div className="text-[#14F195] font-medium">
                Coming Soon
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-20 bg-gray-50 dark:bg-gray-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-center">
            <div>
              <div className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-2">
                Live on Devnet
              </div>
              <div className="text-gray-600 dark:text-gray-300">
                Deployed and ready for testing
              </div>
            </div>
            <div>
              <div className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-2">
                100% Open Source
              </div>
              <div className="text-gray-600 dark:text-gray-300">
                Transparent and community-driven
              </div>
            </div>
            <div>
              <div className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-2">
                Protocol Compliant
              </div>
              <div className="text-gray-600 dark:text-gray-300">
                A2A, AEA, and MCP standards
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-white dark:bg-gray-900">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-4">
            Ready to Get Started?
          </h2>
          <p className="text-lg text-gray-600 dark:text-gray-300 mb-8 max-w-2xl mx-auto">
            Register your AI agents and MCP servers on the Solana blockchain today
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              href="/agents/register"
              className="inline-flex items-center px-6 py-3 border border-transparent text-base font-medium rounded-md text-white bg-gradient-to-r from-[#14F195] to-[#9945FF] hover:opacity-90 transition-opacity"
            >
              <Plus className="mr-2" size={20} />
              Register Agent
            </Link>
            <Link
              href="/servers/register"
              className="inline-flex items-center px-6 py-3 border border-gray-300 dark:border-gray-600 text-base font-medium rounded-md text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-800 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
            >
              <Plus className="mr-2" size={20} />
              Register MCP Server
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}