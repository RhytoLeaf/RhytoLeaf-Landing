// Zeek RSVP Speed Reader — Background Script (Safari)

// Register context menu on install
browser.runtime.onInstalled.addListener(() => {
  browser.menus.create({
    id: 'zeek-read-selection',
    title: 'Read with Zeek',
    contexts: ['selection']
  });
});

// Context menu click: store selected text and open reader window
browser.menus.onClicked.addListener((info, tab) => {
  if (info.menuItemId === 'zeek-read-selection' && info.selectionText) {
    browser.storage.session.set({ pending_text: info.selectionText });
    openReaderWindow();
  }
});

// Global keyboard command: Alt+Z to read selection
browser.commands.onCommand.addListener(async (command) => {
  if (command === 'read-selection') {
    const [tab] = await browser.tabs.query({ active: true, currentWindow: true });
    if (!tab) return;

    try {
      const response = await browser.tabs.sendMessage(tab.id, { action: 'get_selection' });
      if (response?.text) {
        await browser.storage.session.set({ pending_text: response.text });
        await openReaderWindow();
      }
    } catch (e) {
      console.warn('[Zeek] Could not get selection:', e);
    }
  }
});

// Handle messages from popup
browser.runtime.onMessage.addListener((message, sender, sendResponse) => {
  if (message.action === 'open_reader_window') {
    openReaderWindow()
      .then(() => sendResponse({ ok: true }))
      .catch(e => sendResponse({ ok: false, error: e.message }));
    return true; // async response
  }
});

// Open or focus the reader window
// Uses storage.session for the window ID since background page is non-persistent
async function openReaderWindow() {
  // Check if an existing reader window is still open
  const { _readerWindowId } = await browser.storage.session.get('_readerWindowId');

  if (_readerWindowId) {
    try {
      const win = await browser.windows.get(_readerWindowId);
      if (win) {
        // Window exists — focus it.
        // The reader will pick up pending_text via storage.session.onChanged.
        await browser.windows.update(_readerWindowId, { focused: true });
        return;
      }
    } catch (e) {
      // Window was closed — clear stored ID
      await browser.storage.session.remove('_readerWindowId');
    }
  }

  // Create new reader window
  const win = await browser.windows.create({
    url: browser.runtime.getURL('reader/reader.html'),
    type: 'popup',
    width: 420,
    height: 700
  });

  // Store the window ID for reuse
  await browser.storage.session.set({ _readerWindowId: win.id });

  // Track window close so we clear the stored ID
  const onRemoved = (windowId) => {
    if (windowId === win.id) {
      browser.storage.session.remove('_readerWindowId');
      browser.windows.onRemoved.removeListener(onRemoved);
    }
  };
  browser.windows.onRemoved.addListener(onRemoved);
}
