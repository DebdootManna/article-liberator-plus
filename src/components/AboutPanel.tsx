
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { ExternalLink, Heart } from "lucide-react";

export function AboutPanel() {
  return (
    <div className="p-4 bg-white mt-4 rounded-lg">
      <h2 className="text-lg font-semibold mb-3 text-extension-primary">About</h2>
      
      <p className="text-sm text-gray-600 mb-3">
        Article Liberator Plus helps you bypass paywalls and access content that's 
        artificially restricted on the web. This extension is provided for educational purposes.
      </p>
      
      <Separator className="my-3" />
      
      <div className="text-sm space-y-2">
        <p className="font-medium text-gray-700">How it works:</p>
        <ul className="list-disc list-inside space-y-1 text-gray-600 pl-2">
          <li>Disguises as a search engine crawler</li>
          <li>Removes tracking cookies</li>
          <li>Eliminates paywall overlays</li>
          <li>Retrieves archived versions of articles</li>
          <li>Applies site-specific bypass techniques</li>
        </ul>
      </div>
      
      <Separator className="my-3" />
      
      <div className="text-sm space-y-2">
        <p className="font-medium text-gray-700">Ethical Use Guidelines:</p>
        <ul className="list-disc list-inside space-y-1 text-gray-600 pl-2">
          <li>Consider supporting publishers you read regularly</li>
          <li>Use responsibly for research and education</li>
          <li>Don't redistribute paid content commercially</li>
        </ul>
      </div>
      
      <div className="mt-4 flex justify-between">
        <Button variant="outline" size="sm" className="text-extension-primary border-extension-primary">
          <Heart className="mr-1 h-4 w-4" /> Support Project
        </Button>
        <Button variant="outline" size="sm" className="text-extension-primary border-extension-primary">
          <ExternalLink className="mr-1 h-4 w-4" /> Documentation
        </Button>
      </div>
    </div>
  );
}
