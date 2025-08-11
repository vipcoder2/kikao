
export class AntiInspect {
  private isDevToolsOpen = false;
  private threshold = 200;
  private checkInterval: number | null = null;
  private isInWebView = false;
  private rightClickAttempts = 0;
  private keyboardAttempts = 0;

  constructor() {
    this.detectWebView();
    if (!this.isInWebView) {
      this.init();
    }
  }

  private detectWebView(): void {
    const userAgent = navigator.userAgent.toLowerCase();
    const isWebView = 
      // Twitter webview
      userAgent.includes('twitterandroid') ||
      userAgent.includes('twitter') ||
      // Facebook webview
      userAgent.includes('fban') ||
      userAgent.includes('fbav') ||
      userAgent.includes('instagram') ||
      // Other social media webviews
      userAgent.includes('linkedin') ||
      userAgent.includes('telegram') ||
      userAgent.includes('whatsapp') ||
      userAgent.includes('snapchat') ||
      userAgent.includes('tiktok') ||
      // Generic webview indicators
      userAgent.includes('webview') ||
      userAgent.includes('wv') ||
      // Check if it's an embedded view
      window.top !== window.self ||
      // Check for common webview properties
      (window as any).AndroidInterface ||
      (window as any).webkit?.messageHandlers;

    this.isInWebView = isWebView;
    
    // Log for debugging (remove in production)
    if (isWebView) {
      console.log('Webview detected, disabling anti-inspection');
    }
  }

  private init() {
    // Only setup event blockers initially
    this.setupEventBlockers();
    
    // Only start aggressive detection after user interaction attempts
    this.setupDelayedProtection();
  }

  private setupDelayedProtection() {
    // Start more aggressive detection only after suspicious activity
    document.addEventListener('contextmenu', () => {
      this.rightClickAttempts++;
      if (this.rightClickAttempts >= 2) {
        this.setupWindowSizeDetection();
        this.setupDebuggerDetection();
      }
    });

    document.addEventListener('keydown', (e) => {
      if (this.isInspectKey(e)) {
        this.keyboardAttempts++;
        if (this.keyboardAttempts >= 2) {
          this.setupWindowSizeDetection();
          this.setupDebuggerDetection();
        }
      }
    });
  }

  private isInspectKey(e: KeyboardEvent): boolean {
    return (
      e.key === 'F12' ||
      (e.ctrlKey && e.shiftKey && (e.key === 'I' || e.key === 'J' || e.key === 'C')) ||
      (e.ctrlKey && e.key === 'U')
    );
  }

  private setupWindowSizeDetection() {
    if (this.checkInterval) return; // Already setup
    
    this.checkInterval = window.setInterval(() => {
      // More lenient thresholds to avoid false positives
      const widthThreshold = window.outerWidth - window.innerWidth > this.threshold;
      const heightThreshold = window.outerHeight - window.innerHeight > this.threshold;
      
      // Additional check: only trigger if window is focused and user is actively trying to inspect
      const isWindowFocused = document.hasFocus();
      
      if ((widthThreshold || heightThreshold) && isWindowFocused) {
        if (!this.isDevToolsOpen && (this.rightClickAttempts > 0 || this.keyboardAttempts > 0)) {
          this.isDevToolsOpen = true;
          this.triggerAntiInspect();
        }
      } else {
        this.isDevToolsOpen = false;
      }
    }, 1000); // Less frequent checking
  }

  private setupDebuggerDetection() {
    // Only run debugger detection occasionally and after user attempts
    const debuggerCheck = () => {
      if (this.rightClickAttempts > 1 || this.keyboardAttempts > 1) {
        const start = Date.now();
        debugger;
        const end = Date.now();
        
        if (end - start > 100) {
          this.triggerAntiInspect();
        }
      }
    };

    // Run less frequently to reduce performance impact
    setInterval(debuggerCheck, 3000);
  }

  private setupEventBlockers() {
    // Block right-click but don't immediately trigger anti-inspect
    document.addEventListener('contextmenu', (e) => {
      e.preventDefault();
      this.rightClickAttempts++;
      
      // Only trigger after multiple attempts
      if (this.rightClickAttempts >= 3) {
        this.triggerAntiInspect();
      }
    });

    // Block developer shortcuts but be more lenient
    document.addEventListener('keydown', (e) => {
      if (this.isInspectKey(e)) {
        e.preventDefault();
        this.keyboardAttempts++;
        
        // Only trigger after multiple attempts
        if (this.keyboardAttempts >= 3) {
          this.triggerAntiInspect();
        }
      }
    });
  }

  private triggerAntiInspect() {
    // Don't trigger if in webview
    if (this.isInWebView) return;
    
    // Clear the page content
    document.body.innerHTML = '';
    
    // Create error page
    const errorPage = document.createElement('div');
    errorPage.style.cssText = `
      position: fixed;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
      background: #ffffffff;
      color: #ffffff;
      font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      z-index: 999999;
    `;

    errorPage.innerHTML = `
      <div style="text-align: center; max-width: 600px; padding: 40px;">
        <h1 style="font-size: 48px; margin-bottom: 20px; color: #ff4444;">⚠️</h1>
        <h2 style="font-size: 32px; margin-bottom: 20px;">Hmm. We're having trouble finding that site.</h2>
        <p style="font-size: 18px; line-height: 1.6; margin-bottom: 30px; color: #cccccc;">
          We can't connect to the server at ${window.location.hostname}.
        </p>
        <div style="text-align: left; background: #000000ff; padding: 20px; border-radius: 8px; margin-bottom: 30px;">
          <p style="margin-bottom: 15px; color: #ffffff;">If you entered the right address, you can:</p>
          <ul style="margin: 0; padding-left: 20px; color: #cccccc;">
            <li style="margin-bottom: 8px;">Try again later</li>
            <li style="margin-bottom: 8px;">Check your network connection</li>
            <li style="margin-bottom: 8px;">Check that your browser has permission to access the web (you might be connected but behind a firewall)</li>
          </ul>
        </div>
        <button onclick="window.location.reload()" style="
          background: #0066cc;
          color: white;
          border: none;
          padding: 12px 24px;
          font-size: 16px;
          border-radius: 6px;
          cursor: pointer;
          transition: background 0.3s;
        " onmouseover="this.style.background='#0052a3'" onmouseout="this.style.background='#0066cc'">
          Try Again
        </button>
      </div>
    `;

    document.body.appendChild(errorPage);

    // Clear intervals to prevent further detection
    if (this.checkInterval) {
      clearInterval(this.checkInterval);
    }

    // Optional: Redirect to another page after a delay
    setTimeout(() => {
      window.location.href = 'about:blank';
    }, 3000);
  }

  public destroy() {
    if (this.checkInterval) {
      clearInterval(this.checkInterval);
    }
  }
}

// Only initialize if not in webview
export const antiInspect = new AntiInspect();
