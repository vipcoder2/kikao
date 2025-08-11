
export const setupConsoleWarning = () => {
  // Detect if in webview
  const userAgent = navigator.userAgent.toLowerCase();
  const isInWebView = 
    userAgent.includes('twitterandroid') ||
    userAgent.includes('twitter') ||
    userAgent.includes('fban') ||
    userAgent.includes('fbav') ||
    userAgent.includes('instagram') ||
    userAgent.includes('linkedin') ||
    userAgent.includes('telegram') ||
    userAgent.includes('whatsapp') ||
    userAgent.includes('webview') ||
    userAgent.includes('wv') ||
    window.top !== window.self;

  // Don't setup console detection in webviews
  if (isInWebView) {
    console.log('Webview detected, console protection disabled');
    return;
  }

  // Override console methods to detect usage (less aggressive)
  const originalLog = console.log;
  const originalError = console.error;
  const originalWarn = console.warn;
  
  let consoleAttempts = 0;

  console.log = function(...args) {
    consoleAttempts++;
    
    // Only trigger after multiple console attempts and suspicious window behavior
    if (consoleAttempts > 5 && document.readyState === 'complete') {
      setTimeout(() => {
        const suspiciousWindowSize = window.innerHeight < window.screen.height * 0.6;
        const hasDevToolsIndicators = window.outerWidth - window.innerWidth > 200 || 
                                     window.outerHeight - window.innerHeight > 200;
        
        if (suspiciousWindowSize && hasDevToolsIndicators) {
          document.body.innerHTML = '';
          window.location.href = 'about:blank';
        }
      }, 200);
    }
    
    return originalLog.apply(console, args);
  };

  console.error = function(...args) {
    return originalError.apply(console, args);
  };

  console.warn = function(...args) {
    return originalWarn.apply(console, args);
  };

  // Add a fake console warning (only if not in webview)
  setTimeout(() => {
    console.clear();
    console.log('%cSTOP!', 'color: red; font-size: 50px; font-weight: bold;');
    console.log('%cThis is a browser feature intended for developers. If someone told you to copy-paste something here, it is a scam and will give them access to your account.', 'color: red; font-size: 16px;');
  }, 2000); // Delayed to avoid issues
};

// Initialize on import only if not in webview
const userAgent = navigator.userAgent.toLowerCase();
const isInWebView = 
  userAgent.includes('twitterandroid') ||
  userAgent.includes('twitter') ||
  userAgent.includes('fban') ||
  userAgent.includes('fbav') ||
  userAgent.includes('webview') ||
  window.top !== window.self;

if (!isInWebView) {
  setupConsoleWarning();
}
