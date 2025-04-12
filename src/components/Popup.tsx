
import { useState, useEffect } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useToast } from "@/components/ui/use-toast";
import { ExtensionHeader } from './ExtensionHeader';
import { SettingsPanel } from './SettingsPanel';
import { SiteRulesList } from './SiteRulesList';
import { AddSiteRule } from './AddSiteRule';
import { AboutPanel } from './AboutPanel';
import { ExtensionSettings, SiteRule } from '@/types';

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

export function Popup() {
  const { toast } = useToast();
  const [settings, setSettings] = useState<ExtensionSettings>(defaultSettings);
  const [rules, setRules] = useState<SiteRule[]>([]);
  const [isAddRuleOpen, setIsAddRuleOpen] = useState(false);
  const [editingRule, setEditingRule] = useState<SiteRule | null>(null);
  
  useEffect(() => {
    // Load settings and rules on component mount
    chrome?.storage?.local.get(['settings', 'rules'], (result) => {
      if (result.settings) {
        setSettings(result.settings);
      }
      
      if (result.rules) {
        setRules(result.rules);
      }
    });
  }, []);
  
  const handleSettingsChange = (newSettings: ExtensionSettings) => {
    // Update settings in local state and storage
    setSettings(newSettings);
    
    chrome?.storage?.local.set({ settings: newSettings }, () => {
      if (newSettings.notificationsEnabled) {
        toast({
          title: "Settings Updated",
          description: "Your extension settings have been saved.",
        });
      }
    });
    
    // Send message to background script
    chrome?.runtime?.sendMessage({
      type: 'UPDATE_SETTINGS',
      settings: newSettings
    });
  };
  
  const handleRuleChange = (updatedRule: SiteRule) => {
    // Update rule in local state
    const updatedRules = rules.map(rule => 
      rule.domain === updatedRule.domain ? updatedRule : rule
    );
    
    setRules(updatedRules);
    
    // Update rules in storage
    chrome?.storage?.local.set({ rules: updatedRules }, () => {
      if (settings.notificationsEnabled) {
        toast({
          title: "Rule Updated",
          description: `Updated rule for ${updatedRule.name}.`,
        });
      }
    });
    
    // Send message to background script
    chrome?.runtime?.sendMessage({
      type: 'UPDATE_RULE',
      rule: updatedRule
    });
  };
  
  const handleAddRule = () => {
    setEditingRule(null);
    setIsAddRuleOpen(true);
  };
  
  const handleEditRule = (rule: SiteRule) => {
    setEditingRule(rule);
    setIsAddRuleOpen(true);
  };
  
  const handleSaveRule = (rule: SiteRule) => {
    if (editingRule) {
      // Update existing rule
      handleRuleChange(rule);
    } else {
      // Add new rule
      const newRules = [...rules, rule];
      setRules(newRules);
      
      // Update rules in storage
      chrome?.storage?.local.set({ rules: newRules }, () => {
        if (settings.notificationsEnabled) {
          toast({
            title: "Rule Added",
            description: `Added new rule for ${rule.name}.`,
          });
        }
      });
      
      // Send message to background script
      chrome?.runtime?.sendMessage({
        type: 'UPDATE_RULE',
        rule
      });
    }
  };
  
  const isExtensionEnvironment = typeof chrome !== 'undefined' && chrome.storage;

  return (
    <div className="extension-body bg-slate-100">
      <ExtensionHeader 
        settings={settings} 
        onSettingsChange={handleSettingsChange} 
      />
      
      <Tabs defaultValue="settings" className="w-full">
        <TabsList className="w-full bg-white border-b">
          <TabsTrigger value="settings" className="flex-1">Settings</TabsTrigger>
          <TabsTrigger value="sites" className="flex-1">Sites</TabsTrigger>
          <TabsTrigger value="about" className="flex-1">About</TabsTrigger>
        </TabsList>
        
        <TabsContent value="settings" className="p-0">
          <SettingsPanel 
            settings={settings} 
            onSettingsChange={handleSettingsChange} 
          />
        </TabsContent>
        
        <TabsContent value="sites" className="p-0">
          <SiteRulesList 
            rules={rules} 
            onRuleChange={handleRuleChange} 
            onAddRule={handleAddRule} 
          />
          
          <AddSiteRule 
            open={isAddRuleOpen} 
            onOpenChange={setIsAddRuleOpen}
            onSave={handleSaveRule}
            editRule={editingRule}
          />
        </TabsContent>
        
        <TabsContent value="about" className="p-0">
          <AboutPanel />
        </TabsContent>
      </Tabs>
      
      {!isExtensionEnvironment && (
        <div className="p-4 mt-4 bg-yellow-50 text-yellow-800 rounded-lg text-sm">
          <p className="font-medium">Development Mode</p>
          <p>You're viewing this in a browser environment, not as an extension. Some features may not work correctly.</p>
        </div>
      )}
    </div>
  );
}
