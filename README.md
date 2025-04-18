* This is still in development
# Article Liberator Plus

Article Liberator Plus is a Chrome extension that helps users bypass paywalls on news websites and other content platforms. This extension is designed to provide educational insights into web technologies and browser extension development.

## Features

- **Dynamic Paywall Detection**: Identifies paywall patterns in DOM structures
- **Stealth Request Handling**: Modifies HTTP headers to bypass paywall restrictions
- **Custom Rules Engine**: JSON-based site-specific handlers for different websites
- **Anti-Detection Measures**: Various techniques to prevent detection by anti-paywall systems

## Installation

### Development Installation

1. Clone this repository:
   ```
   git clone https://github.com/DebdootManna/article-liberator-plus.git
   ```

2. Install dependencies:
   ```
   cd article-liberator-plus
   npm install
   ```

3. Build the extension:
   ```
   npm run build
   ```

4. Load the extension in Chrome:
   - Open Chrome and navigate to `chrome://extensions`
   - Enable "Developer mode" using the toggle in the top-right corner
   - Click "Load unpacked" and select the `dist` folder from your project

### End-User Installation

Once the extension is published to the Chrome Web Store, users can install it directly from there.

## Usage

1. Click the extension icon in your browser toolbar to open the popup interface
2. Make sure the extension is enabled (toggle switch at the top)
3. Configure settings as needed:
   - GoogleBot User-Agent: Mimics Google's crawler to bypass detection
   - Cookie Cleaning: Removes tracking and paywall cookies
   - Archive Integration: Uses web archives to retrieve content
   - Site-Specific Rules: Apply specialized rules for different websites
4. Visit a news site with a paywall, and the extension will attempt to bypass it automatically
5. Add custom rules for specific sites as needed in the "Sites" tab

## Technical Details

This extension uses several methods to bypass paywalls:

1. **User-Agent Spoofing**: Changes the browser's User-Agent to appear as GoogleBot
2. **Cookie Management**: Removes or modifies cookies that track article views
3. **Element Removal**: Removes DOM elements associated with paywalls
4. **CSS Overrides**: Applies custom CSS to restore hidden content
5. **Archive Retrieval**: Accesses cached versions when other methods fail

## Ethical Guidelines

Please use this extension responsibly:

- Consider supporting quality journalism by subscribing to publications you read regularly
- Use this tool primarily for educational and research purposes
- Do not redistribute paid content commercially
- Be aware of and respect copyright laws in your jurisdiction

## Development

### Project Structure

- `src/background/` - Background service worker scripts
- `src/content/` - Content scripts injected into web pages
- `src/components/` - React components for the popup UI
- `src/types/` - TypeScript interfaces and type definitions
- `public/` - Static assets and extension manifest

### Building

```
npm run build
```

This will generate a `dist` folder containing the built extension.

### Testing

```
npm test
```

## Credits

This project is inspired by various open-source paywall bypass extensions, including:

- Bypass Paywalls Clean by magnolia1234
- FCF Pass by carlosabalde

## License

This project is licensed under the MIT License - see the LICENSE file for details.

## Disclaimer

This extension is provided for educational purposes only. The developers are not responsible for any misuse or legal issues that may arise from using this extension. Always respect copyright laws and terms of service of websites you visit.
