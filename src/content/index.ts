
import { SiteRule } from '../types';

// Bypass paywall by removing paywall elements and restoring scrolling
function bypassPaywall() {
  try {
    // Common paywall selectors
    const paywallSelectors = [
      '.paywall',
      '.subscription-required',
      '.premium-content',
      '#paywall-container',
      '#subscribe-container',
      '.tp-modal',
      '.tp-backdrop',
      '.tp-container',
      '.fade-in',
      '.popup-paywall',
      '#gateway-content',
      '[class*="paywall"]',
      '[id*="paywall"]',
      '[class*="subscribe"]',
      '[id*="subscribe"]'
    ];

    // Remove paywall elements
    paywallSelectors.forEach(selector => {
      const elements = document.querySelectorAll(selector);
      elements.forEach(el => {
        if (el instanceof HTMLElement) {
          el.style.display = 'none';
        }
      });
    });

    // Enable scrolling
    const htmlElement = document.querySelector('html');
    if (htmlElement instanceof HTMLElement) {
      htmlElement.style.overflow = 'auto';
      htmlElement.style.height = 'auto';
    }

    const bodyElement = document.body;
    if (bodyElement) {
      bodyElement.style.overflow = 'auto';
      bodyElement.style.height = 'auto';
      bodyElement.style.position = 'static';
    }

    // Remove blur effects by finding elements with blur or filter styles
    const allElements = document.querySelectorAll('*');
    allElements.forEach(el => {
      if (el instanceof HTMLElement) {
        const computedStyle = window.getComputedStyle(el);
        // Check if the element has a blur filter applied
        if (computedStyle.filter && computedStyle.filter.includes('blur')) {
          el.style.filter = 'none';
        }
        // Check for backdrop-filter
        if (computedStyle.backdropFilter && computedStyle.backdropFilter.includes('blur')) {
          el.style.backdropFilter = 'none';
        }
      }
    });

    // Show hidden content
    const hiddenContent = document.querySelectorAll('.hide, [style*="display: none"], [style*="visibility: hidden"]');
    hiddenContent.forEach(el => {
      if (el instanceof HTMLElement && !el.className.includes('paywall')) {
        el.style.display = 'block';
        el.style.visibility = 'visible';
        el.style.opacity = '1';
      }
    });

    console.log('Article Liberator Plus: Paywall bypassed');
  } catch (error) {
    console.error('Error bypassing paywall:', error);
  }
}

// Apply site-specific rules
async function applySiteRules() {
  try {
    const domain = window.location.hostname.replace('www.', '');
    
    // Get rules from extension storage
    chrome.runtime.sendMessage({
      type: 'GET_RULE_FOR_DOMAIN',
      domain: domain
    }, (response) => {
      if (response) {
        const rule = response as SiteRule;
        
        if (rule.enabled) {
          // Apply element removal rules
          if (rule.removeElements && rule.removeElements.length > 0) {
            rule.removeElements.forEach(selector => {
              const elements = document.querySelectorAll(selector);
              elements.forEach(el => {
                if (el instanceof HTMLElement) {
                  el.style.display = 'none';
                }
              });
            });
          }
          
          // Report bypass attempt
          chrome.runtime.sendMessage({ type: 'BYPASS_ATTEMPT' });
          
          console.log(`Article Liberator Plus: Applied rules for ${rule.name}`);
        }
      }
    });
  } catch (error) {
    console.error('Article Liberator Plus: Error applying site rules', error);
  }
}

// Run bypass code when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
  setTimeout(() => {
    bypassPaywall();
    applySiteRules();
  }, 500);
});

// Run again after page is fully loaded to catch dynamic paywalls
window.addEventListener('load', () => {
  setTimeout(() => {
    bypassPaywall();
    applySiteRules();
  }, 1500);
});

// Monitor for dynamic changes and re-apply bypass techniques
const observer = new MutationObserver(() => {
  bypassPaywall();
});

// Start observing after short delay
setTimeout(() => {
  observer.observe(document.body, {
    childList: true,
    subtree: true
  });
}, 2000);

// Log that the content script has initialized
console.log('Article Liberator Plus: Content script initialized');
