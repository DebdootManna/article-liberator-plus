
import { useState, useEffect } from 'react';
import { Switch } from "@/components/ui/switch";
import { ExtensionSettings } from '@/types';
import { Separator } from "@/components/ui/separator";

interface SettingsPanelProps {
  settings: ExtensionSettings;
  onSettingsChange: (settings: ExtensionSettings) => void;
}

export function SettingsPanel({ settings, onSettingsChange }: SettingsPanelProps) {
  const [localSettings, setLocalSettings] = useState<ExtensionSettings>(settings);

  useEffect(() => {
    setLocalSettings(settings);
  }, [settings]);

  const handleSettingChange = (key: keyof ExtensionSettings, value: boolean) => {
    const updatedSettings = { ...localSettings, [key]: value };
    setLocalSettings(updatedSettings);
    onSettingsChange(updatedSettings);
  };

  return (
    <div className="p-4 bg-white rounded-b-lg">
      <h2 className="text-lg font-semibold mb-3 text-extension-primary">Bypass Settings</h2>
      
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="font-medium">GoogleBot User-Agent</h3>
            <p className="text-sm text-gray-500">Bypass paywalls by acting as GoogleBot</p>
          </div>
          <Switch 
            checked={localSettings?.googleBotEnabled}
            onCheckedChange={(checked) => handleSettingChange('googleBotEnabled', checked)}
            className="data-[state=checked]:bg-extension-primary"
          />
        </div>
        
        <Separator />
        
        <div className="flex items-center justify-between">
          <div>
            <h3 className="font-medium">Cookie Cleaning</h3>
            <p className="text-sm text-gray-500">Remove tracking and paywall cookies</p>
          </div>
          <Switch 
            checked={localSettings?.cookieCleaningEnabled}
            onCheckedChange={(checked) => handleSettingChange('cookieCleaningEnabled', checked)}
            className="data-[state=checked]:bg-extension-primary"
          />
        </div>
        
        <Separator />
        
        <div className="flex items-center justify-between">
          <div>
            <h3 className="font-medium">Archive Integration</h3>
            <p className="text-sm text-gray-500">Use archived versions when available</p>
          </div>
          <Switch 
            checked={localSettings?.archiveEnabled}
            onCheckedChange={(checked) => handleSettingChange('archiveEnabled', checked)}
            className="data-[state=checked]:bg-extension-primary"
          />
        </div>
        
        <Separator />
        
        <div className="flex items-center justify-between">
          <div>
            <h3 className="font-medium">Site-Specific Rules</h3>
            <p className="text-sm text-gray-500">Apply specialized rules for each site</p>
          </div>
          <Switch 
            checked={localSettings?.customRulesEnabled}
            onCheckedChange={(checked) => handleSettingChange('customRulesEnabled', checked)}
            className="data-[state=checked]:bg-extension-primary"
          />
        </div>
        
        <Separator />
        
        <div className="flex items-center justify-between">
          <div>
            <h3 className="font-medium">Notifications</h3>
            <p className="text-sm text-gray-500">Show bypass status notifications</p>
          </div>
          <Switch 
            checked={localSettings?.notificationsEnabled}
            onCheckedChange={(checked) => handleSettingChange('notificationsEnabled', checked)}
            className="data-[state=checked]:bg-extension-primary"
          />
        </div>
      </div>
    </div>
  );
}
