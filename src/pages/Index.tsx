
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";

const Index = () => {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-slate-100 p-6">
      <div className="w-full max-w-4xl bg-white rounded-xl shadow-lg overflow-hidden">
        <div className="bg-extension-primary text-white p-8 text-center">
          <h1 className="text-4xl font-bold mb-4">Article Liberator Plus</h1>
          <p className="text-xl mb-6">Advanced paywall circumvention toolkit</p>
          <div className="flex items-center justify-center space-x-4">
            <Button className="bg-white text-extension-primary hover:bg-extension-light">
              Install Extension
            </Button>
            <Button variant="outline" className="border-white text-white hover:bg-extension-secondary">
              View Source
            </Button>
          </div>
        </div>
        
        <div className="p-8">
          <h2 className="text-2xl font-bold text-gray-800 mb-6">Chrome Extension Development Guide</h2>
          
          <div className="space-y-6">
            <div className="bg-slate-50 p-5 rounded-lg">
              <h3 className="text-xl font-semibold text-extension-primary mb-3">Step 1: Download the Extension Files</h3>
              <p className="text-gray-700 mb-3">
                First, download all the extension files from this project. You'll need to package these
                files to create a Chrome extension.
              </p>
              <pre className="bg-gray-800 text-white p-3 rounded text-sm overflow-x-auto">
                git clone https://github.com/your-username/article-liberator-plus.git
              </pre>
            </div>
            
            <div className="bg-slate-50 p-5 rounded-lg">
              <h3 className="text-xl font-semibold text-extension-primary mb-3">Step 2: Build the Extension</h3>
              <p className="text-gray-700 mb-3">
                Navigate to the project directory and install dependencies, then build the extension:
              </p>
              <pre className="bg-gray-800 text-white p-3 rounded text-sm overflow-x-auto">
                cd article-liberator-plus
                npm install
                npm run build
              </pre>
            </div>
            
            <div className="bg-slate-50 p-5 rounded-lg">
              <h3 className="text-xl font-semibold text-extension-primary mb-3">Step 3: Load the Extension in Chrome</h3>
              <ol className="list-decimal list-inside text-gray-700 space-y-2">
                <li>Open Chrome and navigate to <code>chrome://extensions</code></li>
                <li>Enable "Developer mode" using the toggle in the top-right corner</li>
                <li>Click "Load unpacked" and select the <code>dist</code> folder from your project</li>
                <li>The extension should now appear in your browser toolbar</li>
              </ol>
            </div>
            
            <div className="bg-slate-50 p-5 rounded-lg">
              <h3 className="text-xl font-semibold text-extension-primary mb-3">Step 4: Using the Extension</h3>
              <p className="text-gray-700 mb-3">
                Once installed, you can use the extension to bypass paywalls:
              </p>
              <ol className="list-decimal list-inside text-gray-700 space-y-2">
                <li>Click the extension icon in your toolbar to open the popup</li>
                <li>Make sure the extension is enabled (toggle at the top)</li>
                <li>Configure settings as needed for different bypass methods</li>
                <li>Visit a paywall-protected news site and see the content unlock</li>
              </ol>
            </div>
            
            <div className="bg-slate-50 p-5 rounded-lg">
              <h3 className="text-xl font-semibold text-extension-primary mb-3">Step 5: Customizing Site Rules</h3>
              <p className="text-gray-700 mb-3">
                You can add custom rules for different websites:
              </p>
              <ol className="list-decimal list-inside text-gray-700 space-y-2">
                <li>Open the extension popup and go to the "Sites" tab</li>
                <li>Click "Add Site" to create a new rule</li>
                <li>Enter the domain name and configure bypass methods</li>
                <li>Save the rule to apply it automatically when visiting that site</li>
              </ol>
            </div>
          </div>
          
          <div className="mt-8 p-5 bg-blue-50 rounded-lg border border-blue-200">
            <h3 className="text-lg font-semibold text-extension-primary mb-2">Important Notice</h3>
            <p className="text-gray-700">
              This extension is developed for educational purposes. Please support journalism by subscribing
              to publications you read regularly. Use this tool responsibly and ethically.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Index;
