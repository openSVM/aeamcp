import type { Metadata } from 'next';
import './globals.css';
import './onboarding.css';
import WalletProvider from '@/components/common/WalletProvider';
import Navigation from '@/components/common/Navigation';
import PWAInstaller from '@/components/common/PWAInstaller';
import { OnboardingProvider, OnboardingManager } from '@/components/onboarding';
import { Toaster } from 'react-hot-toast';

export const metadata: Metadata = {
  title: 'AEAMCP - Solana AI Registries',
  description: 'Discover and register AI agents and MCP servers on Solana blockchain. Powered by $SVMAI token.',
  manifest: '/manifest.json',
  icons: {
    icon: '/favicon.svg',
    apple: '/icons/icon-192x192.svg',
  },
};

export const viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 1,
  themeColor: '#404040',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <head>
        <link rel="manifest" href="/manifest.json" />
        <meta name="theme-color" content="#404040" />
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-status-bar-style" content="default" />
        <meta name="apple-mobile-web-app-title" content="AEAMCP" />
        <link rel="apple-touch-icon" href="/icons/icon-192x192.svg" />
        <link rel="icon" type="image/svg+xml" href="/favicon.svg" />
      </head>
      <body className="min-h-screen" style={{ fontFamily: "'Courier New', Courier, monospace", backgroundColor: '#FFFFFF', color: '#262626' }}>
        <OnboardingProvider>
          <WalletProvider>
            <div className="flex flex-col min-h-screen">
              <Navigation />
              <main className="flex-1">
                {children}
              </main>
            <footer className="ascii-footer py-8">
              <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="text-center ascii-footer-text">
                  <p>&copy; 2024 AEAMCP. Built on Solana blockchain. Powered by $SVMAI token. • PWA Enabled</p>
                  <div className="mt-2 space-x-4">
                    <a
                      href="https://github.com/openSVM/aeamcp"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="ascii-footer-link"
                    >
                      GitHub
                    </a>
                    <a
                      href="/aeamcp.html"
                      className="ascii-footer-link"
                    >
                      Project Website
                    </a>
                    <a
                      href="/docs.html"
                      className="ascii-footer-link"
                    >
                      Documentation
                    </a>
                    <a
                      href="/tokenomics"
                      className="ascii-footer-link"
                    >
                      $SVMAI Tokenomics
                    </a>
                  </div>
                </div>
              </div>
            </footer>
            </div>
            <PWAInstaller />
            <Toaster
              position="bottom-right"
              toastOptions={{
                duration: 4000,
                style: {
                  background: '#404040',
                  color: '#FFFFFF',
                  fontFamily: "'Courier New', Courier, monospace",
                  border: '1px solid #A3A3A3',
                  borderRadius: '0',
                },
              }}
            />
          </WalletProvider>
          <OnboardingManager autoStart={true} showOnFirstVisit={true} />
        </OnboardingProvider>
        
        <script
          dangerouslySetInnerHTML={{
            __html: `
              if ('serviceWorker' in navigator) {
                window.addEventListener('load', function() {
                  navigator.serviceWorker.register('/sw.js')
                    .then(function(registration) {
                      console.log('SW registered: ', registration);
                    })
                    .catch(function(registrationError) {
                      console.log('SW registration failed: ', registrationError);
                    });
                });
              }
            `,
          }}
        />
      </body>
    </html>
  );
}
