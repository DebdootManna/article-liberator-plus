
export interface SiteRule {
  domain: string;
  name: string;
  useGoogleBotUA?: boolean;
  removeCookies?: boolean;
  removeElements?: string[];
  useArchive?: boolean;
  customCSS?: string;
  enabled: boolean;
}

export interface ExtensionSettings {
  enabled: boolean;
  googleBotEnabled: boolean;
  cookieCleaningEnabled: boolean;
  archiveEnabled: boolean;
  customRulesEnabled: boolean;
  notificationsEnabled: boolean;
  bypassCounter: number;
  lastUpdated: string;
}

export interface BypassResult {
  success: boolean;
  method?: string;
  message?: string;
  url?: string;
}

export interface BypassStats {
  totalAttempts: number;
  successful: number;
  byDomain: Record<string, number>;
  byMethod: Record<string, number>;
}
