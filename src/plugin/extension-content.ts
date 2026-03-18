/**
 * Chrome Extension content script for data-anim Inspector.
 *
 * Injected by the background service worker when the extension icon is clicked.
 * Auto-activates the inspector and listens for toggle messages.
 */

import { activate, destroy, isActive } from './inspector';

declare const chrome: {
  runtime: {
    onMessage: {
      addListener(cb: (msg: { type: string }) => void): void;
    };
  };
};

// eslint-disable-next-line @typescript-eslint/no-explicit-any -- global flag
const w = window as any;

// Prevent double-injection
if (!w.__daInspectorLoaded) {
  w.__daInspectorLoaded = true;

  // Auto-activate on injection (no toggle button needed — the extension icon is the toggle)
  activate();

  // Listen for toggle messages from the background service worker
  chrome.runtime.onMessage.addListener((msg) => {
    if (msg.type === 'da-inspector-toggle') {
      if (isActive()) {
        destroy();
        w.__daInspectorLoaded = false;
      } else {
        activate();
      }
    }
  });
}
