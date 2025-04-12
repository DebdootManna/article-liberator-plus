
import { useState, useEffect } from 'react';
import { Switch } from "@/components/ui/switch";
import { ExtensionSettings } from '@/types';

interface ExtensionHeaderProps {
  settings: ExtensionSettings;
  onSettingsChange: (settings: ExtensionSettings) => void;
}

export function ExtensionHeader({ settings, onSettingsChange }: ExtensionHeaderProps) {
  const [enabled, setEnabled] = useState(settings?.enabled || false);

  useEffect(() => {
    setEnabled(settings?.enabled || false);
  }, [settings]);

  const handleToggleExtension = (checked: boolean) => {
    setEnabled(checked);
    onSettingsChange({ ...settings, enabled: checked });
  };

  return (
    <div className="bg-extension-primary text-white p-4 rounded-t-lg">
      <div className="flex items-center justify-between mb-2">
        <h1 className="text-xl font-bold">Article Liberator Plus</h1>
        <Switch 
          checked={enabled} 
          onCheckedChange={handleToggleExtension} 
          className="data-[state=checked]:bg-white data-[state=checked]:text-extension-primary"
        />
      </div>
      <p className="text-sm text-extension-light">
        {enabled 
          ? "Active and ready to bypass paywalls" 
          : "Currently disabled - turn on to bypass paywalls"
        }
      </p>
      <div className="mt-2 text-xs">
        <p>Bypassed articles: {settings?.bypassCounter || 0}</p>
      </div>
    </div>
  );
}
