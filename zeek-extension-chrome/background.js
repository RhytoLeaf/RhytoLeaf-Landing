// Zeek RSVP Speed Reader — Service Worker (Background)

// Register context menu on install
chrome.runtime.onInstalled.addListener(() => {
  chrome.contextMenus.create({
    id: 'zeek-read-selection',
    title: 'Read with Zeek',
    contexts: ['selection']
  });

  // Allow side panel to be opened programmatically
  chrome.sidePanel.setPanelBehavior({ openPanelOnActionClick: false })
    .catch(() => {});
});

// Context menu click: store selected text and open side panel
// IMPORTANT: sidePanel.open() must be called synchronously within the user gesture.
// Do NOT await anything before calling it, or Chrome rejects it.
chrome.contextMenus.onClicked.addListener((info, tab) => {
  console.log('[Zeek] Context menu clicked, selectionText:', !!info.selectionText);
  if (info.menuItemId === 'zeek-read-selection' && info.selectionText) {
    // Fire storage write without awaiting -- side panel open must happen first
    chrome.storage.session.set({ pending_text: info.selectionText });
    console.log('[Zeek] Stored pending_text, opening side panel...');
    openSidePanel(tab);
  }
});

// Global keyboard command: Alt+Z to read selection
chrome.commands.onCommand.addListener(async (command) => {
  if (command === 'read-selection') {
    const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
    if (!tab) return;

    try {
      const response = await chrome.tabs.sendMessage(tab.id, { action: 'get_selection' });
      if (response?.text) {
        await chrome.storage.session.set({ pending_text: response.text });
        await openSidePanel(tab);
      }
    } catch (e) {
      console.warn('[Zeek] Could not get selection:', e);
    }
  }
});

// Handle messages from popup
chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  if (message.action === 'open_side_panel') {
    chrome.tabs.query({ active: true, currentWindow: true }).then(async ([tab]) => {
      if (tab) {
        try {
          await openSidePanel(tab);
          sendResponse({ ok: true });
        } catch (e) {
          sendResponse({ ok: false, error: e.message });
        }
      } else {
        sendResponse({ ok: false, error: 'No active tab' });
      }
    });
    return true;
  }
});

// Open side panel for a given tab
// Must be called synchronously in the user gesture chain -- no awaits before open()
function openSidePanel(tab) {
  // Set options without awaiting (it resolves quickly, and open() doesn't depend on it)
  chrome.sidePanel.setOptions({
    tabId: tab.id,
    path: 'sidepanel/sidepanel.html',
    enabled: true
  });

  const windowId = tab.windowId;
  console.log('[Zeek] Opening side panel for windowId:', windowId);
  chrome.sidePanel.open({ windowId })
    .then(() => console.log('[Zeek] Side panel opened successfully'))
    .catch(e => console.error('[Zeek] sidePanel.open() failed:', e));
}
