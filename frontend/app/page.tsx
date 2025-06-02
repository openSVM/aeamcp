'use client';

import Link from 'next/link';
import { useI18nContext } from '@/components/common/I18nProvider';

export default function HomePage() {
  const { t } = useI18nContext();
  return (
    <div className="min-h-screen" style={{ fontFamily: "'Courier New', Courier, monospace" }}>
      {/* Hero Section */}
      <section className="py-20 section-glass" style={{ borderBottom: '2px solid #A3A3A3' }}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h1 className="ascii-section-title text-4xl md:text-6xl mb-6">
              {t('home.hero.title').toUpperCase()}
            </h1>
            <p className="ascii-lead-text text-xl md:text-2xl mb-8 max-w-3xl mx-auto">
              {t('home.hero.subtitle')}
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center mb-8">
              <Link
                href="/agents"
                className="ascii-button-primary"
              >
                [{t('home.hero.browse.agents').toUpperCase()}]
              </Link>
              <Link
                href="/servers"
                className="ascii-button-secondary"
              >
                [{t('home.hero.browse.servers').toUpperCase()}]
              </Link>
            </div>
            <div className="flex flex-col sm:flex-row gap-4 justify-center mb-4">
              <Link
                href="/aeamcp.html"
                className="ascii-button-secondary"
              >
                [{t('home.hero.view.website').toUpperCase()}]
              </Link>
              <Link
                href="/docs.html"
                className="ascii-button-secondary"
                style={{ backgroundColor: '#525252', color: '#FFFFFF', borderColor: '#525252' }}
              >
                [{t('home.hero.view.docs').toUpperCase()}]
              </Link>
            </div>
            <div className="ascii-info-box inline-block">
              <span className="ascii-info-box-text">
                <strong>{t('home.hero.powered').toUpperCase()}</strong> •
                <Link href="/tokenomics" className="ascii-link ml-2">
                  {t('home.hero.learn').toUpperCase()} →
                </Link>
              </span>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 section-glass">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="ascii-section-title text-3xl md:text-4xl mb-4">
              {t('home.features.title').toUpperCase()}
            </h2>
            <p className="ascii-body-text text-lg max-w-2xl mx-auto">
              {t('home.features.subtitle')}
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {/* Agent Registry */}
            <div className="ascii-card">
              <div className="ascii-logo w-16 h-12 mb-4">
                <span className="text-lg font-bold">[BOT]</span>
              </div>
              <h3 className="ascii-subsection-title text-xl mb-2">
                {t('home.features.agents.title').toUpperCase()}
              </h3>
              <p className="ascii-body-text mb-4">
                {t('home.features.agents.desc')}
              </p>
              <Link
                href="/agents"
                className="ascii-link"
              >
                {t('home.features.agents.cta').toUpperCase()} →
              </Link>
            </div>

            {/* MCP Server Registry */}
            <div className="ascii-card">
              <div className="ascii-logo w-16 h-12 mb-4">
                <span className="text-lg font-bold">[SRV]</span>
              </div>
              <h3 className="ascii-subsection-title text-xl mb-2">
                {t('home.features.mcp.title').toUpperCase()}
              </h3>
              <p className="ascii-body-text mb-4">
                {t('home.features.mcp.desc')}
              </p>
              <Link
                href="/servers"
                className="ascii-link"
              >
                {t('home.features.mcp.cta').toUpperCase()} →
              </Link>
            </div>

            {/* $SVMAI Token */}
            <div className="ascii-card">
              <div className="ascii-logo w-16 h-12 mb-4">
                <span className="text-lg font-bold">[$$$]</span>
              </div>
              <h3 className="ascii-subsection-title text-xl mb-2">
                {t('home.features.token.title').toUpperCase()}
              </h3>
              <p className="ascii-body-text mb-4">
                {t('home.features.token.desc')}
              </p>
              <Link
                href="/tokenomics"
                className="ascii-link"
              >
                {t('home.features.token.cta').toUpperCase()} →
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* $SVMAI Token Benefits */}
      <section className="py-20 section-glass">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="ascii-section-title text-3xl md:text-4xl mb-4">
              {t('home.benefits.title').toUpperCase()}
            </h2>
            <p className="ascii-body-text text-lg max-w-2xl mx-auto">
              {t('home.benefits.subtitle')}
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            <div className="text-center">
              <div className="ascii-logo w-16 h-16 mx-auto mb-4">
                <span className="text-xl font-bold">[⚡]</span>
              </div>
              <h3 className="ascii-subsection-title text-lg mb-2">
                {t('home.benefits.governance.title').toUpperCase()}
              </h3>
              <p className="ascii-body-text text-sm">
                {t('home.benefits.governance.desc')}
              </p>
            </div>

            <div className="text-center">
              <div className="ascii-logo w-16 h-16 mx-auto mb-4">
                <span className="text-xl font-bold">[⚡]</span>
              </div>
              <h3 className="ascii-subsection-title text-lg mb-2">
                {t('home.benefits.staking.title').toUpperCase()}
              </h3>
              <p className="ascii-body-text text-sm">
                {t('home.benefits.staking.desc')}
              </p>
            </div>

            <div className="text-center">
              <div className="ascii-logo w-16 h-16 mx-auto mb-4">
                <span className="text-xl font-bold">[↗]</span>
              </div>
              <h3 className="ascii-subsection-title text-lg mb-2">
                {t('home.benefits.premium.title').toUpperCase()}
              </h3>
              <p className="ascii-body-text text-sm">
                {t('home.benefits.premium.desc')}
              </p>
            </div>

            <div className="text-center">
              <div className="ascii-logo w-16 h-16 mx-auto mb-4">
                <span className="text-xl font-bold">[👥]</span>
              </div>
              <h3 className="ascii-subsection-title text-lg mb-2">
                {t('home.benefits.community.title').toUpperCase()}
              </h3>
              <p className="ascii-body-text text-sm">
                {t('home.benefits.community.desc')}
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-20 section-glass">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-center">
            <div className="ascii-card">
              <div className="ascii-subsection-title text-3xl md:text-4xl mb-2">
                {t('home.stats.devnet.title').toUpperCase()}
              </div>
              <div className="ascii-body-text">
                {t('home.stats.devnet.desc')}
              </div>
            </div>
            <div className="ascii-card">
              <div className="ascii-subsection-title text-3xl md:text-4xl mb-2">
                {t('home.stats.opensource.title').toUpperCase()}
              </div>
              <div className="ascii-body-text">
                {t('home.stats.opensource.desc')}
              </div>
            </div>
            <div className="ascii-card">
              <div className="ascii-subsection-title text-3xl md:text-4xl mb-2">
                {t('home.stats.compliant.title').toUpperCase()}
              </div>
              <div className="ascii-body-text">
                {t('home.stats.compliant.desc')}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 section-glass" style={{ borderTop: '2px solid #A3A3A3' }}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="ascii-section-title text-3xl md:text-4xl mb-4">
            {t('home.cta.title').toUpperCase()}
          </h2>
          <p className="ascii-body-text text-lg mb-8 max-w-2xl mx-auto">
            {t('home.cta.subtitle')}
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              href="/agents/register"
              className="ascii-button-primary"
            >
              [+ {t('home.cta.register.agent').toUpperCase()}]
            </Link>
            <Link
              href="/servers/register"
              className="ascii-button-secondary"
            >
              [+ {t('home.cta.register.server').toUpperCase()}]
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
