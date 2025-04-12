
import { useState, useEffect } from 'react';
import { SiteRule } from '@/types';
import { Switch } from '@/components/ui/switch';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { CirclePlus } from 'lucide-react';

interface SiteRulesListProps {
  rules: SiteRule[];
  onRuleChange: (rule: SiteRule) => void;
  onAddRule: () => void;
}

export function SiteRulesList({ rules, onRuleChange, onAddRule }: SiteRulesListProps) {
  const [localRules, setLocalRules] = useState<SiteRule[]>(rules || []);

  useEffect(() => {
    setLocalRules(rules || []);
  }, [rules]);

  const handleRuleToggle = (domain: string, enabled: boolean) => {
    const ruleIndex = localRules.findIndex(rule => rule.domain === domain);
    if (ruleIndex >= 0) {
      const updatedRule = { ...localRules[ruleIndex], enabled };
      onRuleChange(updatedRule);
    }
  };

  return (
    <div className="p-4 bg-white mt-4 rounded-lg">
      <div className="flex items-center justify-between mb-3">
        <h2 className="text-lg font-semibold text-extension-primary">Site Rules</h2>
        <Button 
          onClick={onAddRule}
          className="bg-extension-primary hover:bg-extension-secondary"
          size="sm"
        >
          <CirclePlus className="mr-1 h-4 w-4" /> Add Site
        </Button>
      </div>

      <div className="space-y-3 max-h-60 overflow-y-auto pr-1">
        {localRules && localRules.length > 0 ? (
          localRules.map((rule) => (
            <div key={rule.domain} className="bg-gray-50 p-3 rounded-md">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="font-medium text-gray-900">{rule.name}</h3>
                  <p className="text-xs text-gray-500">{rule.domain}</p>
                </div>
                <Switch 
                  checked={rule.enabled}
                  onCheckedChange={(checked) => handleRuleToggle(rule.domain, checked)}
                  className="data-[state=checked]:bg-extension-primary"
                />
              </div>
              <div className="mt-2 text-xs text-gray-600 space-x-2 flex flex-wrap">
                {rule.useGoogleBotUA && <span className="bg-extension-light px-2 py-1 rounded-full">GoogleBot</span>}
                {rule.removeCookies && <span className="bg-extension-light px-2 py-1 rounded-full">Cookie Clean</span>}
                {rule.useArchive && <span className="bg-extension-light px-2 py-1 rounded-full">Archive</span>}
                {rule.removeElements && rule.removeElements.length > 0 && 
                  <span className="bg-extension-light px-2 py-1 rounded-full">Element Removal</span>
                }
                {rule.customCSS && <span className="bg-extension-light px-2 py-1 rounded-full">Custom CSS</span>}
              </div>
            </div>
          ))
        ) : (
          <div className="text-center py-4 text-gray-500">
            No site rules found. Add your first rule.
          </div>
        )}
      </div>
    </div>
  );
}
