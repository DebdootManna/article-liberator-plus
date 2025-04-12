
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

// Listen for web requests to modify headers
chrome.webRequest.onBeforeSendHeaders.addListener(
  async (details) => {
    const { settings, rules } = await chrome.storage.local.get(['settings', 'rules']);
    
    if (!settings?.enabled) return { requestHeaders: details.requestHeaders };
    
    const url = new URL(details.url);
    const domain = url.hostname.replace('www.', '');
    
    // Find matching rule
    const matchingRule = rules?.find((rule: SiteRule) => 
      domain.includes(rule.domain) && rule.enabled
    );
    
    if (matchingRule?.useGoogleBotUA && settings.googleBotEnabled) {
      const googleBotUA = "Mozilla/5.0 (compatible; Googlebot/2.1; +http://www.google.com/bot.html)";
      
      const requestHeaders = details.requestHeaders || [];
      
      // Remove existing User-Agent header
      const uaIndex = requestHeaders.findIndex(header => 
        header.name.toLowerCase() === 'user-agent'
      );
      
      if (uaIndex > -1) {
        requestHeaders[uaIndex].value = googleBotUA;
      } else {
        requestHeaders.push({ name: 'User-Agent', value: googleBotUA });
      }
      
      // Adjust referer
      const refererIndex = requestHeaders.findIndex(header => 
        header.name.toLowerCase() === 'referer'
      );
      
      if (refererIndex > -1) {
        requestHeaders[refererIndex].value = 'https://www.google.com/';
      } else {
        requestHeaders.push({ name: 'Referer', value: 'https://www.google.com/' });
      }
      
      return { requestHeaders };
    }
    
    return { requestHeaders: details.requestHeaders };
  },
  { urls: ["<all_urls>"] },
  ["blocking", "requestHeaders"]
);

// Clear cookies for specified domains
chrome.webNavigation.onCompleted.addListener(async (details) => {
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
});

// Listen for messages from content scripts or popup
chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  if (message.type === 'BYPASS_ATTEMPT') {
    updateBypassCounter();
  }
  
  if (message.type === 'GET_RULE_FOR_DOMAIN') {
    getRuleForDomain(message.domain).then(sendResponse);
    return true; // Keep the message channel open for async response
  }
  
  if (message.type === 'GET_SETTINGS') {
    getSettings().then(sendResponse);
    return true;
  }
  
  if (message.type === 'UPDATE_SETTINGS') {
    updateSettings(message.settings).then(sendResponse);
    return true;
  }
  
  if (message.type === 'UPDATE_RULE') {
    updateRule(message.rule).then(sendResponse);
    return true;
  }
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

// Initialize extension on install
chrome.runtime.onInstalled.addListener(() => {
  initializeExtension();
});
