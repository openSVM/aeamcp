import Link from 'next/link';

export default function HomePage() {
  return (
    <div className="min-h-screen" style={{ fontFamily: "'Courier New', Courier, monospace" }}>
      {/* Hero Section */}
      <section className="py-20" style={{ backgroundColor: '#F5F5F5', borderBottom: '2px solid #A3A3A3' }}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h1 className="ascii-section-title text-4xl md:text-6xl mb-6">
              SOLANA AI REGISTRIES
            </h1>
            <p className="ascii-lead-text text-xl md:text-2xl mb-8 max-w-3xl mx-auto">
              Discover and register autonomous AI agents and Model Context Protocol (MCP) servers on the Solana blockchain. Powered by $SVMAI token.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center mb-8">
              <Link
                href="/agents"
                className="ascii-button-primary"
              >
                [BROWSE AGENTS]
              </Link>
              <Link
                href="/servers"
                className="ascii-button-secondary"
              >
                [BROWSE MCP SERVERS]
              </Link>
            </div>
            <div className="flex flex-col sm:flex-row gap-4 justify-center mb-4">
              <Link
                href="/aeamcp.html"
                className="ascii-button-secondary"
              >
                [VIEW PROJECT WEBSITE]
              </Link>
              <Link
                href="/docs.html"
                className="ascii-button-secondary"
                style={{ backgroundColor: '#525252', color: '#FFFFFF', borderColor: '#525252' }}
              >
                [VIEW DOCUMENTATION]
              </Link>
            </div>
            <div className="ascii-info-box inline-block">
              <span className="ascii-info-box-text">
                <strong>POWERED BY $SVMAI TOKEN</strong> • 
                <Link href="/tokenomics" className="ascii-link ml-2">
                  LEARN MORE →
                </Link>
              </span>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20" style={{ backgroundColor: '#FFFFFF' }}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="ascii-section-title text-3xl md:text-4xl mb-4">
              DECENTRALIZED AI DISCOVERY
            </h2>
            <p className="ascii-body-text text-lg max-w-2xl mx-auto">
              Built on Solana for fast, secure, and cost-effective AI service discovery and registration
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {/* Agent Registry */}
            <div className="ascii-card">
              <div className="ascii-logo w-16 h-12 mb-4">
                <span className="text-lg font-bold">[BOT]</span>
              </div>
              <h3 className="ascii-subsection-title text-xl mb-2">
                AGENT REGISTRY
              </h3>
              <p className="ascii-body-text mb-4">
                Discover autonomous AI agents with verified capabilities, endpoints, and economic intents
              </p>
              <Link
                href="/agents"
                className="ascii-link"
              >
                EXPLORE AGENTS →
              </Link>
            </div>

            {/* MCP Server Registry */}
            <div className="ascii-card">
              <div className="ascii-logo w-16 h-12 mb-4">
                <span className="text-lg font-bold">[SRV]</span>
              </div>
              <h3 className="ascii-subsection-title text-xl mb-2">
                MCP SERVER REGISTRY
              </h3>
              <p className="ascii-body-text mb-4">
                Find Model Context Protocol servers offering tools, resources, and prompts for AI applications
              </p>
              <Link
                href="/servers"
                className="ascii-link"
              >
                EXPLORE SERVERS →
              </Link>
            </div>

            {/* $SVMAI Token */}
            <div className="ascii-card">
              <div className="ascii-logo w-16 h-12 mb-4">
                <span className="text-lg font-bold">[$$$]</span>
              </div>
              <h3 className="ascii-subsection-title text-xl mb-2">
                $SVMAI TOKEN
              </h3>
              <p className="ascii-body-text mb-4">
                Native utility token for governance, staking, and accessing premium AI services
              </p>
              <Link
                href="/tokenomics"
                className="ascii-link"
              >
                LEARN ABOUT $SVMAI →
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* $SVMAI Token Benefits */}
      <section className="py-20" style={{ backgroundColor: '#F5F5F5' }}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="ascii-section-title text-3xl md:text-4xl mb-4">
              WHY $SVMAI TOKEN?
            </h2>
            <p className="ascii-body-text text-lg max-w-2xl mx-auto">
              The native utility token that powers the entire AEAMCP ecosystem
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            <div className="text-center">
              <div className="ascii-logo w-16 h-16 mx-auto mb-4">
                <span className="text-xl font-bold">[⚡]</span>
              </div>
              <h3 className="ascii-subsection-title text-lg mb-2">
                GOVERNANCE
              </h3>
              <p className="ascii-body-text text-sm">
                Vote on protocol upgrades and ecosystem decisions
              </p>
            </div>

            <div className="text-center">
              <div className="ascii-logo w-16 h-16 mx-auto mb-4">
                <span className="text-xl font-bold">[⚡]</span>
              </div>
              <h3 className="ascii-subsection-title text-lg mb-2">
                STAKING REWARDS
              </h3>
              <p className="ascii-body-text text-sm">
                Earn rewards by staking tokens and securing the network
              </p>
            </div>

            <div className="text-center">
              <div className="ascii-logo w-16 h-16 mx-auto mb-4">
                <span className="text-xl font-bold">[↗]</span>
              </div>
              <h3 className="ascii-subsection-title text-lg mb-2">
                PREMIUM ACCESS
              </h3>
              <p className="ascii-body-text text-sm">
                Access premium AI agents and advanced features
              </p>
            </div>

            <div className="text-center">
              <div className="ascii-logo w-16 h-16 mx-auto mb-4">
                <span className="text-xl font-bold">[👥]</span>
              </div>
              <h3 className="ascii-subsection-title text-lg mb-2">
                COMMUNITY
              </h3>
              <p className="ascii-body-text text-sm">
                Join a thriving community of AI developers and users
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-20" style={{ backgroundColor: '#FFFFFF' }}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-center">
            <div className="ascii-card">
              <div className="ascii-subsection-title text-3xl md:text-4xl mb-2">
                LIVE ON DEVNET
              </div>
              <div className="ascii-body-text">
                Deployed and ready for testing
              </div>
            </div>
            <div className="ascii-card">
              <div className="ascii-subsection-title text-3xl md:text-4xl mb-2">
                100% OPEN SOURCE
              </div>
              <div className="ascii-body-text">
                Transparent and community-driven
              </div>
            </div>
            <div className="ascii-card">
              <div className="ascii-subsection-title text-3xl md:text-4xl mb-2">
                PROTOCOL COMPLIANT
              </div>
              <div className="ascii-body-text">
                A2A, AEA, and MCP standards
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20" style={{ backgroundColor: '#E5E5E5', borderTop: '2px solid #A3A3A3' }}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="ascii-section-title text-3xl md:text-4xl mb-4">
            READY TO GET STARTED?
          </h2>
          <p className="ascii-body-text text-lg mb-8 max-w-2xl mx-auto">
            Register your AI agents and MCP servers on the Solana blockchain today
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              href="/agents/register"
              className="ascii-button-primary"
            >
              [+ REGISTER AGENT]
            </Link>
            <Link
              href="/servers/register"
              className="ascii-button-secondary"
            >
              [+ REGISTER MCP SERVER]
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
