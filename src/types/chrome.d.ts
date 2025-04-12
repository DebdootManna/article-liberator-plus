
// This file provides TypeScript definitions for Chrome extension APIs
/// <reference types="chrome" />

// Extend the Window interface to include chrome
declare interface Window {
  chrome: typeof chrome;
}
