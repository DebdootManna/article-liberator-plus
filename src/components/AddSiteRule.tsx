
import { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Textarea } from '@/components/ui/textarea';
import { SiteRule } from '@/types';

interface AddSiteRuleProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSave: (rule: SiteRule) => void;
  editRule?: SiteRule | null;
}

export function AddSiteRule({ open, onOpenChange, onSave, editRule }: AddSiteRuleProps) {
  const [rule, setRule] = useState<SiteRule>(editRule || {
    domain: '',
    name: '',
    useGoogleBotUA: true,
    removeCookies: true,
    removeElements: [],
    useArchive: true,
    enabled: true
  } as SiteRule);

  const isEditing = !!editRule;

  const handleChange = (field: keyof SiteRule, value: any) => {
    setRule(prev => ({ ...prev, [field]: value }));
  };

  const handleElementsChange = (elementsString: string) => {
    const elements = elementsString.split(',').map(el => el.trim()).filter(Boolean);
    setRule(prev => ({ ...prev, removeElements: elements }));
  };

  const handleSave = () => {
    onSave(rule);
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>{isEditing ? 'Edit Site Rule' : 'Add New Site Rule'}</DialogTitle>
        </DialogHeader>
        
        <div className="space-y-4 py-2">
          <div className="space-y-2">
            <Label htmlFor="name">Site Name</Label>
            <Input 
              id="name" 
              value={rule.name} 
              onChange={(e) => handleChange('name', e.target.value)}
              placeholder="e.g. New York Times"
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="domain">Domain</Label>
            <Input 
              id="domain" 
              value={rule.domain} 
              onChange={(e) => handleChange('domain', e.target.value)}
              placeholder="e.g. nytimes.com"
            />
            <p className="text-xs text-gray-500">Do not include 'www.' or 'https://'</p>
          </div>
          
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <Label htmlFor="useGoogleBotUA" className="cursor-pointer">Use GoogleBot User-Agent</Label>
              <Switch 
                id="useGoogleBotUA"
                checked={rule.useGoogleBotUA}
                onCheckedChange={(checked) => handleChange('useGoogleBotUA', checked)}
                className="data-[state=checked]:bg-extension-primary"
              />
            </div>
            
            <div className="flex items-center justify-between">
              <Label htmlFor="removeCookies" className="cursor-pointer">Remove Cookies</Label>
              <Switch 
                id="removeCookies"
                checked={rule.removeCookies}
                onCheckedChange={(checked) => handleChange('removeCookies', checked)}
                className="data-[state=checked]:bg-extension-primary"
              />
            </div>
            
            <div className="flex items-center justify-between">
              <Label htmlFor="useArchive" className="cursor-pointer">Use Archive</Label>
              <Switch 
                id="useArchive"
                checked={rule.useArchive}
                onCheckedChange={(checked) => handleChange('useArchive', checked)}
                className="data-[state=checked]:bg-extension-primary"
              />
            </div>
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="elements">Elements to Remove</Label>
            <Textarea 
              id="elements" 
              value={rule.removeElements?.join(', ') || ''}
              onChange={(e) => handleElementsChange(e.target.value)}
              placeholder=".paywall, #subscription-overlay"
              className="h-20"
            />
            <p className="text-xs text-gray-500">Comma-separated CSS selectors</p>
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="customCSS">Custom CSS</Label>
            <Textarea 
              id="customCSS" 
              value={rule.customCSS || ''}
              onChange={(e) => handleChange('customCSS', e.target.value)}
              placeholder=".article { overflow: visible !important; }"
              className="h-20"
            />
          </div>
        </div>
        
        <DialogFooter>
          <Button onClick={() => onOpenChange(false)} variant="outline">Cancel</Button>
          <Button 
            onClick={handleSave} 
            className="bg-extension-primary hover:bg-extension-secondary"
          >
            {isEditing ? 'Update Rule' : 'Add Rule'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
