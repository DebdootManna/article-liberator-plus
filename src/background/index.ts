import { ExtensionSettings, SiteRule } from '../types';

// Default settings
const defaultSettings: ExtensionSettings = {
  enabled: true,
  googleBotEnabled: true,
  cookieCleaningEnabled: true,
  archiveEnabled: true,
  customRulesEnabled: true,
  notificationsEnabled: true,
  bypassCounter: 0,
  lastUpdated: new Date().toISOString()
};

// Default rules for popular sites
const defaultRules: SiteRule[] = [
  {
    domain: "nytimes.com",
    name: "New York Times",
    useGoogleBotUA: true,
    removeCookies: true,
    removeElements: [".css-mcm29f", "#gateway-content", ".css-gx5sib"],
    useArchive: true,
    enabled: true
  },
  {
    domain: "wsj.com",
    name: "Wall Street Journal",
    useGoogleBotUA: true,
    removeCookies: true,
    removeElements: [".snippet-promotion", "#cx-snippet-overlay"],
    useArchive: true,
    enabled: true
  },
  {
    domain: "washingtonpost.com",
    name: "Washington Post",
    useGoogleBotUA: true,
    removeCookies: true,
    removeElements: [".paywall", ".regwall-overlay"],
    useArchive: true,
    enabled: true
  },
  {
    domain: "medium.com",
    name: "Medium",
    useGoogleBotUA: true,
    removeCookies: true,
    removeElements: [".meteredContent", ".overlay-message", ".js-overlayBanner"],
    useArchive: true,
    enabled: true
  },
  {
    domain: "bloomberg.com",
    name: "Bloomberg",
    useGoogleBotUA: true,
    removeCookies: true,
    removeElements: [".paywall-inline", ".paywall"],
    useArchive: true,
    enabled: true
  }
];

// Initialize extension settings
async function initializeExtension() {
  const { settings, rules } = await chrome.storage.local.get(['settings', 'rules']);
  
  if (!settings) {
    await chrome.storage.local.set({ settings: defaultSettings });
  }
  
  if (!rules) {
    await chrome.storage.local.set({ rules: defaultRules });
  }
  
  console.log('Article Liberator Plus: Extension initialized');
}

// Set up declarative net request rules for Manifest V3
chrome.runtime.onInstalled.addListener(() => {
  // Initialize extension settings
  initializeExtension();
  
  console.log('Article Liberator Plus: Extension installed and initialized');
});

// Clear cookies for specified domains
chrome.webNavigation.onCompleted.addListener(async (details) => {
  try {
    const { settings, rules } = await chrome.storage.local.get(['settings', 'rules']);
    
    if (!settings?.enabled || !settings.cookieCleaningEnabled) return;
    
    const url = new URL(details.url);
    const domain = url.hostname.replace('www.', '');
    
    // Find matching rule
    const matchingRule = rules?.find((rule: SiteRule) => 
      domain.includes(rule.domain) && rule.enabled && rule.removeCookies
    );
    
    if (matchingRule) {
      const cookies = await chrome.cookies.getAll({ domain: `.${matchingRule.domain}` });
      
      for (const cookie of cookies) {
        await chrome.cookies.remove({
          url: url.origin,
          name: cookie.name
        });
      }
      
      console.log(`Article Liberator Plus: Cleared cookies for ${domain}`);
    }
  } catch (error) {
    console.error('Error in webNavigation handler:', error);
  }
});

// Listen for messages from content scripts or popup
chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  if (message.type === 'BYPASS_ATTEMPT') {
    updateBypassCounter().then(() => {
      console.log('Bypass counter updated');
    }).catch(err => {
      console.error('Error updating bypass counter:', err);
    });
    return false; // Don't keep the message channel open
  }
  
  if (message.type === 'GET_RULE_FOR_DOMAIN') {
    getRuleForDomain(message.domain).then(sendResponse).catch(err => {
      console.error('Error getting rule for domain:', err);
      sendResponse(null);
    });
    return true; // Keep the message channel open for async response
  }
  
  if (message.type === 'GET_SETTINGS') {
    getSettings().then(sendResponse).catch(err => {
      console.error('Error getting settings:', err);
      sendResponse(defaultSettings);
    });
    return true;
  }
  
  if (message.type === 'UPDATE_SETTINGS') {
    updateSettings(message.settings).then(sendResponse).catch(err => {
      console.error('Error updating settings:', err);
      sendResponse({ success: false, error: err.message });
    });
    return true;
  }
  
  if (message.type === 'UPDATE_RULE') {
    updateRule(message.rule).then(sendResponse).catch(err => {
      console.error('Error updating rule:', err);
      sendResponse({ success: false, message: err.message });
    });
    return true;
  }
  
  return false;
});

async function updateBypassCounter() {
  const { settings } = await chrome.storage.local.get(['settings']);
  
  if (settings) {
    settings.bypassCounter = (settings.bypassCounter || 0) + 1;
    settings.lastUpdated = new Date().toISOString();
    
    await chrome.storage.local.set({ settings });
  }
}

async function getRuleForDomain(domain: string) {
  const { rules } = await chrome.storage.local.get(['rules']);
  
  if (!rules) return null;
  
  const matchingRule = rules.find((rule: SiteRule) => 
    domain.includes(rule.domain)
  );
  
  return matchingRule || null;
}

async function getSettings() {
  const { settings } = await chrome.storage.local.get(['settings']);
  return settings || defaultSettings;
}

async function updateSettings(newSettings: ExtensionSettings) {
  await chrome.storage.local.set({ settings: newSettings });
  return { success: true };
}

async function updateRule(updatedRule: SiteRule) {
  const { rules } = await chrome.storage.local.get(['rules']);
  
  if (!rules) return { success: false, message: 'No rules found' };
  
  const ruleIndex = rules.findIndex((rule: SiteRule) => 
    rule.domain === updatedRule.domain
  );
  
  if (ruleIndex >= 0) {
    rules[ruleIndex] = updatedRule;
  } else {
    rules.push(updatedRule);
  }
  
  await chrome.storage.local.set({ rules });
  return { success: true };
}

// Log that the background script has initialized
console.log('Article Liberator Plus: Background script initialized');
