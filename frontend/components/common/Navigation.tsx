'use client';

import { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { WalletMultiButton } from '@solana/wallet-adapter-react-ui';
import { useOnboardingTrigger } from '@/components/onboarding';

export default function Navigation() {
  const [isOpen, setIsOpen] = useState(false);
  const pathname = usePathname();
  const { startOnboarding } = useOnboardingTrigger();

  const navigation = [
    { name: 'Home', href: '/' },
    { name: 'AI Agents', href: '/agents' },
    { name: 'MCP Servers', href: '/servers' },
    { name: '$SVMAI Token', href: '/tokenomics' },
  ];

  const isActive = (href: string) => {
    if (href === '/') {
      return pathname === '/';
    }
    return pathname.startsWith(href);
  };

  return (
    <nav className="ascii-header">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex items-center">
            <Link href="/" className="flex items-center space-x-2">
              <div className="ascii-logo w-8 h-8">
                <span className="text-sm">A</span>
              </div>
              <span className="ascii-brand-text text-xl">
                AEAMCP
              </span>
            </Link>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-1">
            {navigation.map((item) => (
              <Link
                key={item.name}
                href={item.href}
                className={`ascii-nav-link ${isActive(item.href) ? 'active' : ''}`}
              >
                {item.name.toUpperCase()}
              </Link>
            ))}
          </div>

          {/* Wallet Button and Help - Desktop */}
          <div className="hidden md:flex items-center space-x-3">
            <button
              onClick={startOnboarding}
              className="ascii-help-button"
              title="Start Interactive Tutorial"
            >
              [? HELP]
            </button>
            <div className="ascii-wallet-button-container">
              <WalletMultiButton className="ascii-wallet-button" />
            </div>
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden flex items-center space-x-2">
            <button
              onClick={startOnboarding}
              className="ascii-help-button-mobile"
              title="Start Interactive Tutorial"
            >
              [?]
            </button>
            <div className="ascii-wallet-button-container">
              <WalletMultiButton className="ascii-wallet-button-mobile" />
            </div>
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="ascii-mobile-menu-button"
            >
              {isOpen ? '[X]' : '[≡]'}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Navigation */}
      {isOpen && (
        <div className="md:hidden ascii-mobile-nav">
          <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3">
            {navigation.map((item) => (
              <Link
                key={item.name}
                href={item.href}
                onClick={() => setIsOpen(false)}
                className={`ascii-nav-link-mobile ${isActive(item.href) ? 'active' : ''}`}
              >
                {item.name.toUpperCase()}
              </Link>
            ))}
            <button
              onClick={() => {
                startOnboarding();
                setIsOpen(false);
              }}
              className="ascii-nav-link-mobile"
            >
              HELP & TUTORIAL
            </button>
          </div>
        </div>
      )}

      <style jsx>{`
        .ascii-wallet-button-container :global(.wallet-adapter-button) {
          background-color: #404040 !important;
          color: #FFFFFF !important;
          border: 1px solid #A3A3A3 !important;
          border-radius: 0 !important;
          font-family: 'Courier New', Courier, monospace !important;
          font-weight: bold !important;
          text-transform: uppercase !important;
          padding: 0.5rem 1rem !important;
          font-size: 0.875rem !important;
          box-shadow: 2px 2px 0px #A3A3A3 !important;
          transition: all 0.3s ease !important;
        }

        .ascii-wallet-button-container :global(.wallet-adapter-button:hover) {
          background-color: #737373 !important;
          border-color: #737373 !important;
          box-shadow: 1px 1px 0px #A3A3A3 !important;
        }

        .ascii-wallet-button-container :global(.wallet-adapter-button:not([disabled]):hover) {
          background-color: #737373 !important;
        }

        .ascii-wallet-button-container :global(.wallet-adapter-button-trigger) {
          background-color: #404040 !important;
          color: #FFFFFF !important;
        }

        .ascii-mobile-menu-button {
          color: #E5E5E5;
          font-family: 'Courier New', Courier, monospace;
          font-weight: bold;
          font-size: 1.2rem;
          padding: 0.5rem;
          border: 1px solid #404040;
          background-color: transparent;
          transition: all 0.3s ease;
        }

        .ascii-mobile-menu-button:hover {
          background-color: #737373;
          color: #FFFFFF;
          border-color: #737373;
        }

        .ascii-mobile-nav {
          background-color: #404040;
          border-top: 1px solid #A3A3A3;
        }

        .ascii-nav-link-mobile {
          color: #E5E5E5;
          display: block;
          padding: 0.75rem 1rem;
          border: 1px solid transparent;
          font-weight: normal;
          text-transform: uppercase;
          text-decoration: none;
          font-family: 'Courier New', Courier, monospace;
          transition: all 0.3s ease;
          margin-bottom: 0.25rem;
        }

        .ascii-nav-link-mobile:hover {
          background-color: #737373;
          color: #FFFFFF;
          border-color: #737373;
        }

        .ascii-nav-link-mobile.active {
          background-color: #525252;
          color: #FFFFFF;
          font-weight: bold;
          border-color: #525252;
        }

        /* Mobile wallet button styling */
        .ascii-wallet-button-mobile :global(.wallet-adapter-button) {
          background-color: #404040 !important;
          color: #FFFFFF !important;
          border: 1px solid #A3A3A3 !important;
          border-radius: 0 !important;
          font-family: 'Courier New', Courier, monospace !important;
          font-weight: bold !important;
          text-transform: uppercase !important;
          padding: 0.375rem 0.75rem !important;
          font-size: 0.75rem !important;
          box-shadow: 1px 1px 0px #A3A3A3 !important;
        }

        .ascii-help-button {
          background-color: #525252;
          color: #FFFFFF;
          border: 1px solid #A3A3A3;
          font-family: 'Courier New', Courier, monospace;
          font-weight: bold;
          text-transform: uppercase;
          padding: 0.5rem 1rem;
          font-size: 0.875rem;
          box-shadow: 2px 2px 0px #A3A3A3;
          transition: all 0.3s ease;
          cursor: pointer;
        }

        .ascii-help-button:hover {
          background-color: #737373;
          border-color: #737373;
          box-shadow: 1px 1px 0px #A3A3A3;
        }

        .ascii-help-button-mobile {
          background-color: #525252;
          color: #FFFFFF;
          border: 1px solid #A3A3A3;
          font-family: 'Courier New', Courier, monospace;
          font-weight: bold;
          text-transform: uppercase;
          padding: 0.375rem 0.5rem;
          font-size: 0.75rem;
          box-shadow: 1px 1px 0px #A3A3A3;
          transition: all 0.3s ease;
          cursor: pointer;
        }

        .ascii-help-button-mobile:hover {
          background-color: #737373;
          border-color: #737373;
        }
      `}</style>
    </nav>
  );
}