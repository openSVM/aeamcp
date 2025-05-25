import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';
import WalletProvider from '@/components/common/WalletProvider';
import Navigation from '@/components/common/Navigation';
import { Toaster } from 'react-hot-toast';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'AEAMCP - Solana AI Registries',
  description: 'Discover and register AI agents and MCP servers on Solana blockchain',
  manifest: '/manifest.json',
  themeColor: '#14F195',
  viewport: 'width=device-width, initial-scale=1, maximum-scale=1',
  icons: {
    icon: '/favicon.ico',
    apple: '/icons/icon-192x192.png',
  },
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
        <meta name="theme-color" content="#14F195" />
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-status-bar-style" content="default" />
        <meta name="apple-mobile-web-app-title" content="AEAMCP" />
      </head>
      <body className={`${inter.className} min-h-screen bg-gray-50 dark:bg-gray-900`}>
        <WalletProvider>
          <div className="flex flex-col min-h-screen">
            <Navigation />
            <main className="flex-1">
              {children}
            </main>
            <footer className="bg-white dark:bg-gray-900 border-t border-gray-200 dark:border-gray-700 py-8">
              <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="text-center text-gray-600 dark:text-gray-400">
                  <p>&copy; 2024 AEAMCP. Built on Solana blockchain.</p>
                  <div className="mt-2 space-x-4">
                    <a 
                      href="https://github.com/openSVM/aeamcp" 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="text-[#14F195] hover:underline"
                    >
                      GitHub
                    </a>
                    <a 
                      href="https://docs.solana.com" 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="text-[#14F195] hover:underline"
                    >
                      Solana Docs
                    </a>
                  </div>
                </div>
              </div>
            </footer>
          </div>
          <Toaster 
            position="bottom-right"
            toastOptions={{
              duration: 4000,
              style: {
                background: '#363636',
                color: '#fff',
              },
            }}
          />
        </WalletProvider>
      </body>
    </html>
  );
}