import React, { useState, useEffect } from 'react';
import { X, Download, Smartphone, Plus } from 'lucide-react';

interface BeforeInstallPromptEvent extends Event {
  prompt(): Promise<void>;
  userChoice: Promise<{ outcome: 'accepted' | 'dismissed' }>;
}

const PWAInstallPrompt: React.FC = () => {
  const [deferredPrompt, setDeferredPrompt] = useState<BeforeInstallPromptEvent | null>(null);
  const [showPrompt, setShowPrompt] = useState(false);
  const [isIOS, setIsIOS] = useState(false);
  const [isAndroid, setIsAndroid] = useState(false);
  const [isStandalone, setIsStandalone] = useState(false);

  useEffect(() => {
    // Check device types
    const userAgent = navigator.userAgent.toLowerCase();
    const isIOSDevice = /ipad|iphone|ipod/.test(userAgent);
    const isAndroidDevice = /android/.test(userAgent);
    const isInStandaloneMode = window.matchMedia('(display-mode: standalone)').matches ||
                              (window.navigator as any).standalone === true;

    setIsIOS(isIOSDevice);
    setIsAndroid(isAndroidDevice);
    setIsStandalone(isInStandaloneMode);

    // Don't show if already installed
    if (isInStandaloneMode) return;

    // Listen for the beforeinstallprompt event
    const handleBeforeInstallPrompt = (e: Event) => {
      e.preventDefault();
      setDeferredPrompt(e as BeforeInstallPromptEvent);
      setShowPrompt(true);
    };

    window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt);

    // Show prompt for mobile users after 5 seconds
    if (isIOSDevice || isAndroidDevice) {
      const timer = setTimeout(() => {
        if (!isInStandaloneMode) {
          setShowPrompt(true);
        }
      }, 5000);
      return () => clearTimeout(timer);
    }

    return () => {
      window.removeEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
    };
  }, []);

  const handleInstallClick = async () => {
    if (deferredPrompt) {
      deferredPrompt.prompt();
      const { outcome } = await deferredPrompt.userChoice;
      if (outcome === 'accepted') {
        setDeferredPrompt(null);
      }
    }
    setShowPrompt(false);
  };

  const handleCloseClick = () => {
    setShowPrompt(false);
    // Don't show again for 2 hours
    localStorage.setItem('pwa-prompt-dismissed', Date.now().toString());
  };

  // Check if prompt was recently dismissed (2 hours)
  useEffect(() => {
    const dismissed = localStorage.getItem('pwa-prompt-dismissed');
    if (dismissed) {
      const dismissedTime = parseInt(dismissed);
      const now = Date.now();
      const hoursPassed = (now - dismissedTime) / (1000 * 60 * 60);
      if (hoursPassed < 2) {
        setShowPrompt(false);
        return;
      } else {
        // Clear old timestamp if 2 hours passed
        localStorage.removeItem('pwa-prompt-dismissed');
      }
    }
  }, []);

  if (!showPrompt || isStandalone) return null;

  const getInstructions = () => {
    if (isIOS) {
      return (
        <div className="text-sm text-gray-600 space-y-2">
          <p className="font-medium">To install KikaSports:</p>
          <ol className="list-decimal list-inside space-y-1 text-xs">
            <li>Tap the Share button <span className="inline-block">📤</span> in Safari</li>
            <li>Scroll down and tap "Add to Home Screen"</li>
            <li>Tap "Add" to install</li>
          </ol>
        </div>
      );
    } else if (isAndroid) {
      return (
        <div className="text-sm text-gray-600 space-y-2">
          <p className="font-medium">Install KikaSports for better experience:</p>
          <p className="text-xs">Fast access, offline support, and native app experience</p>
        </div>
      );
    }
    return (
      <p className="text-sm text-gray-600">
        Install our app for faster access and offline functionality.
      </p>
    );
  };

  return (
    <div className="fixed bottom-4 left-4 right-4 md:left-auto md:right-4 md:max-w-sm bg-white border border-gray-200 rounded-lg shadow-lg p-2 z-50 animate-in slide-in-from-bottom-2">
      <div className="flex items-center justify-between gap-2">
        <div className="flex items-center gap-2 flex-1 min-w-0">
          <div className="p-1 bg-red-50 rounded">
            <Smartphone className="w-3 h-3 text-red-600" />
          </div>
          <div className="flex-1 min-w-0">
            <h3 className="text-xs font-medium text-gray-800 truncate">Install KikaSports</h3>
            <p className="text-xs text-gray-500 leading-tight">
              {isIOS ? 'Share → Add to Home Screen' : 'Fast access & offline'}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-1">
          {!isIOS && deferredPrompt && (
            <button
              onClick={handleInstallClick}
              className="flex items-center gap-1 bg-red-600 hover:bg-red-700 text-white text-xs font-medium py-1 px-2 rounded transition-colors"
            >
              <Download className="w-2.5 h-2.5" />
              <span className="hidden sm:inline">Install</span>
            </button>
          )}
          <button
            onClick={handleCloseClick}
            className="text-gray-400 hover:text-gray-600 p-0.5"
          >
            <X className="w-3 h-3" />
          </button>
        </div>
      </div>
    </div>
  );
};

export default PWAInstallPrompt;