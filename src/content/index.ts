
import { SiteRule } from '../types';

// Function to detect paywalls by looking for common elements and patterns
function detectPaywall(): boolean {
  const paywalIndicators = [
    // Common paywall element selectors
    '.paywall',
    '.subscription',
    '#paywall',
    '.pay-meter',
    '.paid-content',
    '.register-wall',
    '.pw-curtain',
    '.subscriber-content',
    '.piano-closed',
    
    // Content restriction indicators
    'div[id*="paywall"]',
    'div[class*="paywall"]',
    'div[id*="subscription"]',
    'div[class*="subscription"]',
    'div[class*="regwall"]',
    'div[class*="unlock"]',
    'div[class*="locked"]',
    
    // Message text patterns
    'div:contains("Subscribe now")',
    'div:contains("Continue reading")',
    'div:contains("Already a subscriber")',
    'div:contains("Register now")',
    'div:contains("To continue reading")',
    'div:contains("Sign up now")',
    'div:contains("Subscribe to read")',
    'div:contains("members only")',
    'div:contains("premium content")',
    'div:contains("subscribe for full access")'
  ];
  
  // Check for presence of any paywall indicators
  for (const selector of paywalIndicators) {
    try {
      if (document.querySelector(selector)) {
        return true;
      }
    } catch (error) {
      // Some complex selectors might not be supported, like :contains
      continue;
    }
  }
  
  // Check for blurred or hidden content
  const blurredElements = document.querySelectorAll('[style*="blur"]');
  const fadedElements = document.querySelectorAll('[style*="opacity: 0"]');
  
  if (blurredElements.length > 0 || fadedElements.length > 0) {
    return true;
  }
  
  // Check for short article truncation (usually a sign of a paywall)
  const articleElements = document.querySelectorAll('article, .article, .post-content, .entry-content');
  if (articleElements.length > 0) {
    const articleText = Array.from(articleElements)
      .map(el => el.textContent)
      .join('')
      .trim();
    
    // If article is suspiciously short, it might be truncated by a paywall
    if (articleText.length < 1000 && articleText.includes('...')) {
      return true;
    }
  }
  
  return false;
}

// Function to remove specified elements based on rules
function removePaywallElements(selectors: string[]) {
  selectors.forEach(selector => {
    try {
      const elements = document.querySelectorAll(selector);
      elements.forEach(element => element.remove());
    } catch (error) {
      console.error(`Error removing element with selector ${selector}:`, error);
    }
  });
}

// Function to apply custom CSS to bypass paywalls
function applyCustomCSS(css: string) {
  const styleElement = document.createElement('style');
  styleElement.textContent = css;
  document.head.appendChild(styleElement);
}

// Function to bypass paywall using appropriate method based on the site rule
async function bypassPaywall(rule: SiteRule) {
  let bypassMethod = '';
  let success = false;
  
  // Remove paywall elements if specified in the rule
  if (rule.removeElements && rule.removeElements.length > 0) {
    removePaywallElements(rule.removeElements);
    bypassMethod = 'element_removal';
    success = true;
  }
  
  // Apply custom CSS if specified in the rule
  if (rule.customCSS) {
    applyCustomCSS(rule.customCSS);
    bypassMethod = bypassMethod || 'css_override';
    success = true;
  }
  
  // If the rule suggests using archive and other methods didn't work, try that
  if (rule.useArchive && !success) {
    const url = window.location.href;
    const archiveUrl = `https://archive.is/${url}`;
    
    // Notify background script to open archive version in a new tab
    chrome.runtime.sendMessage({
      type: 'OPEN_ARCHIVE',
      url: archiveUrl
    });
    
    bypassMethod = 'archive';
    success = true;
  }
  
  // Report bypass attempt to background script
  chrome.runtime.sendMessage({
    type: 'BYPASS_ATTEMPT',
    domain: window.location.hostname,
    success,
    method: bypassMethod
  });
  
  return { success, method: bypassMethod };
}

// Function to handle paywall for the current site
async function handleCurrentSite() {
  const domain = window.location.hostname.replace('www.', '');
  
  // Get rule for the current domain
  const response = await chrome.runtime.sendMessage({
    type: 'GET_RULE_FOR_DOMAIN',
    domain
  });
  
  // Get extension settings
  const settings = await chrome.runtime.sendMessage({
    type: 'GET_SETTINGS'
  });
  
  if (!settings.enabled) {
    console.log('Article Liberator Plus: Extension is disabled');
    return;
  }
  
  // If we have a rule for this site and paywall is detected, bypass it
  if (response && detectPaywall()) {
    console.log(`Article Liberator Plus: Paywall detected on ${domain}, applying bypass methods`);
    const result = await bypassPaywall(response);
    
    if (result.success) {
      console.log(`Article Liberator Plus: Successfully bypassed paywall using ${result.method}`);
    } else {
      console.log('Article Liberator Plus: Failed to bypass paywall');
    }
  }
}

// Default style rules to help with common paywall patterns
const defaultCSS = `
  /* Hide common paywall elements */
  .paywall, .subscription-required, .paid-content, .premium-content, 
  .signin-container, .login-form-container, #paywall, #subscribe-now,
  [class*="paywall"], [id*="paywall"], [class*="premium"], 
  .locked-content, .locked, .register-wall {
    display: none !important;
  }
  
  /* Remove blur effects */
  [style*="blur"], .blurred, .blur {
    filter: none !important;
    -webkit-filter: none !important;
    -moz-filter: none !important;
    -o-filter: none !important;
    -ms-filter: none !important;
    opacity: 1 !important;
  }
  
  /* Fix hidden content */
  body, html {
    overflow: auto !important;
    height: auto !important;
  }
  
  /* Make hidden text visible */
  .hidden-text, .truncated-text, .opacity-0 {
    display: block !important;
    opacity: 1 !important;
    visibility: visible !important;
  }
`;

// Apply default CSS to help with common paywall patterns
function applyDefaultStyles() {
  const styleElement = document.createElement('style');
  styleElement.textContent = defaultCSS;
  document.head.appendChild(styleElement);
}

// Main initialization
(function() {
  // Apply default styles as early as possible
  applyDefaultStyles();
  
  // Initial check when DOM is ready
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', handleCurrentSite);
  } else {
    handleCurrentSite();
  }
  
  // Re-check after a few seconds in case of delayed paywalls
  setTimeout(handleCurrentSite, 3000);
})();
