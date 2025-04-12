
// Chrome extension content script
/// <reference types="chrome" />

// Default values for site-specific selectors
const DEFAULT_PAYWALL_SELECTORS = [
  '.paywall',
  '.subscription-required',
  '.subscription-banner',
  '#paywall',
  '#subscribe-banner',
  '.modal-paywall',
  '.register-wall',
  '.registration-wall'
];

// Helper function to remove paywall elements
function removePaywallElements(selectors: string[]) {
  selectors.forEach(selector => {
    const elements = document.querySelectorAll(selector);
    elements.forEach(el => {
      el.remove();
    });
  });
}

// Helper function to enable scrolling
function enableScrolling() {
  // Common ways sites disable scrolling
  document.documentElement.style.overflow = 'auto';
  document.body.style.overflow = 'auto';
  document.documentElement.style.position = 'static';
  document.body.style.position = 'static';
  
  // Remove any height restrictions
  document.documentElement.style.maxHeight = 'none';
  document.body.style.maxHeight = 'none';
}

// Helper function to reveal hidden content
function revealHiddenContent() {
  // Find elements with blur, hidden overflow, or other hiding techniques
  const blurredElements = document.querySelectorAll<HTMLElement>(
    '[style*="blur"], [class*="blur"], [class*="hidden"], [class*="paywall"], [style*="overflow: hidden"]'
  );
  
  blurredElements.forEach(el => {
    el.style.filter = 'none';
    el.style.blur = 'none';
    el.style.webkitFilter = 'none';
    el.style.overflow = 'visible';
    el.style.maxHeight = 'none';
    el.style.opacity = '1';
    
    // Remove classes that might be hiding content
    ['blur', 'hidden', 'paywall', 'restricted'].forEach(className => {
      el.classList.remove(className);
    });
  });
}

// Main bypass function
async function bypassPaywall() {
  try {
    console.log('Article Liberator Plus: Attempting to bypass paywall...');
    
    // Get domain from current URL
    const domain = window.location.hostname.replace('www.', '');
    
    // Check if we need to apply site-specific rules
    const message = { type: 'GET_RULE_FOR_DOMAIN', domain };
    const rule = await new Promise<any>(resolve => {
      chrome.runtime.sendMessage(message, (response) => {
        resolve(response);
      });
    });

    // Get extension settings
    const settings = await new Promise<any>(resolve => {
      chrome.runtime.sendMessage({ type: 'GET_SETTINGS' }, (response) => {
        resolve(response);
      });
    });
    
    if (!settings?.enabled) {
      console.log('Article Liberator Plus: Extension is disabled');
      return;
    }
    
    // Apply general bypass methods
    enableScrolling();
    revealHiddenContent();
    
    // Apply site-specific rules if available
    if (rule && rule.enabled) {
      console.log(`Article Liberator Plus: Applying rule for ${rule.name}`);
      
      if (rule.removeElements && rule.removeElements.length > 0) {
        removePaywallElements(rule.removeElements);
      } else {
        // Use default selectors if no specific ones are provided
        removePaywallElements(DEFAULT_PAYWALL_SELECTORS);
      }
      
      // Apply custom CSS if defined for the site
      if (rule.customCSS) {
        const style = document.createElement('style');
        style.id = 'article-liberator-custom-css';
        style.textContent = rule.customCSS;
        document.head.appendChild(style);
      }
    } else {
      // Apply general rules
      removePaywallElements(DEFAULT_PAYWALL_SELECTORS);
    }
    
    // Notify the background script of bypass attempt
    chrome.runtime.sendMessage({ type: 'BYPASS_ATTEMPT' });
    
    console.log('Article Liberator Plus: Bypass attempt complete');
  } catch (error) {
    console.error('Article Liberator Plus: Error bypassing paywall', error);
  }
}

// Run on page load
window.addEventListener('DOMContentLoaded', () => {
  bypassPaywall();
});

// Also run on dynamic content changes
const observer = new MutationObserver(() => {
  bypassPaywall();
});

// Start observing once the DOM is ready
document.addEventListener('DOMContentLoaded', () => {
  observer.observe(document.body, {
    childList: true,
    subtree: true
  });
});

// Initial run in case DOMContentLoaded already fired
if (document.readyState === 'interactive' || document.readyState === 'complete') {
  bypassPaywall();
}
