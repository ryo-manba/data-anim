// Track which tabs have the inspector injected
const injectedTabs = new Set();

chrome.action.onClicked.addListener(async (tab) => {
  if (!tab.id) return;

  if (injectedTabs.has(tab.id)) {
    // Toggle off: send message to deactivate and clean up
    await chrome.tabs.sendMessage(tab.id, { type: 'da-inspector-toggle' }).catch(() => {});
    injectedTabs.delete(tab.id);
    chrome.action.setBadgeText({ text: '', tabId: tab.id }).catch(() => {});
  } else {
    // Toggle on: inject the inspector script
    try {
      await chrome.scripting.executeScript({
        target: { tabId: tab.id },
        files: ['content.js'],
      });
    } catch {
      // Cannot inject into chrome://, edge://, about: pages — silently ignore
      return;
    }
    injectedTabs.add(tab.id);
    chrome.action.setBadgeText({ text: 'ON', tabId: tab.id });
    chrome.action.setBadgeBackgroundColor({ color: '#2563eb', tabId: tab.id });
  }
});

// Listen for close messages from the content script (e.g. panel close button)
chrome.runtime.onMessage.addListener((msg, sender) => {
  if (sender.id !== chrome.runtime.id) return;
  if (msg.type === 'da-inspector-closed' && sender.tab?.id) {
    const tabId = sender.tab.id;
    injectedTabs.delete(tabId);
    chrome.action.setBadgeText({ text: '', tabId }).catch(() => {});
  }
});

// Clean up when tab is closed or navigated
chrome.tabs.onRemoved.addListener((tabId) => {
  injectedTabs.delete(tabId);
});

chrome.tabs.onUpdated.addListener((tabId, changeInfo) => {
  if (changeInfo.status === 'loading') {
    injectedTabs.delete(tabId);
    chrome.action.setBadgeText({ text: '', tabId }).catch(() => {});
  }
});
