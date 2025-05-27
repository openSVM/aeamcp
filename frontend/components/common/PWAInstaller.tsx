'use client';

import { useState, useEffect } from 'react';

interface BeforeInstallPromptEvent extends Event {
  readonly platforms: string[];
  readonly userChoice: Promise<{
    outcome: 'accepted' | 'dismissed';
    platform: string;
  }>;
  prompt(): Promise<void>;
}

export default function PWAInstaller() {
  const [deferredPrompt, setDeferredPrompt] = useState<BeforeInstallPromptEvent | null>(null);
  const [showInstallButton, setShowInstallButton] = useState(false);
  const [isInstalled, setIsInstalled] = useState(false);

  useEffect(() => {
    // Check if app is already installed
    if (window.matchMedia && window.matchMedia('(display-mode: standalone)').matches) {
      setIsInstalled(true);
      return;
    }

    // Listen for the beforeinstallprompt event
    const handleBeforeInstallPrompt = (e: Event) => {
      e.preventDefault();
      setDeferredPrompt(e as BeforeInstallPromptEvent);
      setShowInstallButton(true);
    };

    // Listen for app installed event
    const handleAppInstalled = () => {
      setIsInstalled(true);
      setShowInstallButton(false);
      setDeferredPrompt(null);
      console.log('PWA was installed');
    };

    window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
    window.addEventListener('appinstalled', handleAppInstalled);

    return () => {
      window.removeEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
      window.removeEventListener('appinstalled', handleAppInstalled);
    };
  }, []);

  const handleInstallClick = async () => {
    if (!deferredPrompt) return;

    deferredPrompt.prompt();
    const { outcome } = await deferredPrompt.userChoice;
    
    if (outcome === 'accepted') {
      console.log('User accepted the install prompt');
    } else {
      console.log('User dismissed the install prompt');
    }
    
    setDeferredPrompt(null);
    setShowInstallButton(false);
  };

  const handleDismiss = () => {
    setShowInstallButton(false);
  };

  if (isInstalled || !showInstallButton) {
    return null;
  }

  return (
    <div 
      className="fixed bottom-4 right-4 z-50 ascii-card p-4 max-w-sm"
      style={{ backgroundColor: '#F5F5F5', border: '2px solid #404040' }}
    >
      <div className="flex items-start justify-between mb-3">
        <div className="ascii-logo w-8 h-8 mr-3">
          <span className="text-lg font-bold">[+]</span>
        </div>
        <button
          onClick={handleDismiss}
          className="ascii-link text-sm"
          style={{ color: '#737373' }}
        >
          [X]
        </button>
      </div>
      
      <h3 className="ascii-subsection-title text-sm mb-2">
        INSTALL AEAMCP APP
      </h3>
      
      <p className="ascii-body-text text-xs mb-4">
        Install this app on your device for quick access and offline functionality.
      </p>
      
      <div className="flex gap-2">
        <button
          onClick={handleInstallClick}
          className="ascii-button-primary text-xs px-3 py-2"
        >
          [INSTALL]
        </button>
        <button
          onClick={handleDismiss}
          className="ascii-button-secondary text-xs px-3 py-2"
        >
          [LATER]
        </button>
      </div>
    </div>
  );
}