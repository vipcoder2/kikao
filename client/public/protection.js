
(function() {
  'use strict';
  
  // Detect if running in webview
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
    userAgent.includes('snapchat') ||
    userAgent.includes('tiktok') ||
    userAgent.includes('webview') ||
    userAgent.includes('wv') ||
    window.top !== window.self ||
    window.AndroidInterface ||
    (window.webkit && window.webkit.messageHandlers);

  // Don't run protection in webviews
  if (isInWebView) {
    console.log('Webview detected, protection disabled');
    return;
  }

  let keyAttempts = 0;
  let rightClickAttempts = 0;

  // Block common developer tools (but count attempts first)
  document.addEventListener('keydown', function(e) {
    // Block F12, Ctrl+Shift+I, Ctrl+Shift+J, Ctrl+U, Ctrl+Shift+C
    if (e.keyCode === 123 || 
        (e.ctrlKey && e.shiftKey && e.keyCode === 73) ||
        (e.ctrlKey && e.shiftKey && e.keyCode === 74) ||
        (e.ctrlKey && e.keyCode === 85) ||
        (e.ctrlKey && e.shiftKey && e.keyCode === 67)) {
      e.preventDefault();
      keyAttempts++;
      
      // Only trigger after multiple attempts
      if (keyAttempts >= 3) {
        document.body.innerHTML = '<div style="position:fixed;top:0;left:0;width:100%;height:100%;background:#1a1a1a;color:#fff;display:flex;align-items:center;justify-content:center;font-family:sans-serif;z-index:999999;"><div style="text-align:center;"><h1>🚫 Access Denied</h1><p>Developer tools are not allowed on this site.</p></div></div>';
      }
      return false;
    }
  });

  // Disable right-click (but count attempts)
  document.addEventListener('contextmenu', function(e) {
    e.preventDefault();
    rightClickAttempts++;
    
    // Only trigger after multiple attempts
    if (rightClickAttempts >= 3) {
      document.body.innerHTML = '<div style="position:fixed;top:0;left:0;width:100%;height:100%;background:#1a1a1a;color:#fff;display:flex;align-items:center;justify-content:center;font-family:sans-serif;z-index:999999;"><div style="text-align:center;"><h1>⚠️ Connection Error</h1><p>Unable to connect to server. Please try again later.</p></div></div>';
    }
    return false;
  });

  // Disable text selection (less aggressive)
  document.addEventListener('selectstart', function(e) {
    if (e.target.tagName === 'INPUT' || e.target.tagName === 'TEXTAREA') {
      return true; // Allow selection in input fields
    }
    e.preventDefault();
    return false;
  });

  // Disable drag
  document.addEventListener('dragstart', function(e) {
    e.preventDefault();
    return false;
  });

  // Monitor for devtools (only after user interaction attempts)
  let devtools = {open: false};
  let monitoringStarted = false;
  
  const startMonitoring = () => {
    if (monitoringStarted) return;
    monitoringStarted = true;
    
    setInterval(function() {
      // More lenient thresholds and only trigger if user has attempted to inspect
      if ((window.outerHeight - window.innerHeight > 250 || 
           window.outerWidth - window.innerWidth > 250) &&
          (keyAttempts > 0 || rightClickAttempts > 0) &&
          document.hasFocus()) {
        if (!devtools.open) {
          devtools.open = true;
          document.documentElement.innerHTML = '<div style="position:fixed;top:0;left:0;width:100%;height:100%;background:#1a1a1a;color:#fff;display:flex;align-items:center;justify-content:center;font-family:sans-serif;z-index:999999;"><div style="text-align:center;"><h1>⚠️ Connection Error</h1><p>Unable to connect to server. Please try again later.</p></div></div>';
        }
      } else {
        devtools.open = false;
      }
    }, 1000);
  };

  // Start monitoring only after user attempts to inspect
  document.addEventListener('keydown', function() {
    if (keyAttempts >= 1) startMonitoring();
  });
  
  document.addEventListener('contextmenu', function() {
    if (rightClickAttempts >= 1) startMonitoring();
  });
})();
