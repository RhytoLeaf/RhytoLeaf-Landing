// Zeek RSVP Speed Reader — Popup Controller

const dom = {
  selectionBanner: document.getElementById('selectionBanner'),
  selectionPreview: document.getElementById('selectionPreview'),
  readSelectionBtn: document.getElementById('readSelectionBtn'),
  textInput: document.getElementById('textInput'),
  zeekBtn: document.getElementById('zeekBtn'),
  pasteBtn: document.getElementById('pasteBtn')
};

let selectedText = '';

// Try to get selected text from the active tab
async function checkSelection() {
  try {
    const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
    if (!tab || tab.url.startsWith('chrome://') || tab.url.startsWith('chrome-extension://')) {
      return;
    }
    const response = await chrome.tabs.sendMessage(tab.id, { action: 'get_selection' });
    if (response?.text) {
      selectedText = response.text;
      // Show preview (truncated)
      const preview = selectedText.length > 120
        ? selectedText.slice(0, 120) + '...'
        : selectedText;
      dom.selectionPreview.textContent = preview;
      dom.selectionBanner.classList.remove('hidden');
    }
  } catch (e) {
    // Content script not available on this page
  }
}

// Send text to the side panel and open it
async function sendToSidePanel(text) {
  if (!text || !text.trim()) {
    alert('Please enter some text to read.');
    return;
  }
  await chrome.storage.session.set({ pending_text: text.trim() });

  // Open side panel directly from popup (preserves user gesture context)
  try {
    const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
    if (tab) {
      await chrome.sidePanel.open({ tabId: tab.id });
    }
  } catch (e) {
    console.warn('Could not open side panel:', e);
  }
  window.close();
}

// Event listeners
dom.readSelectionBtn.addEventListener('click', () => {
  sendToSidePanel(selectedText);
});

dom.zeekBtn.addEventListener('click', () => {
  sendToSidePanel(dom.textInput.value);
});

dom.pasteBtn.addEventListener('click', async () => {
  try {
    dom.textInput.value = await navigator.clipboard.readText();
    dom.textInput.focus();
  } catch (err) {
    dom.textInput.focus();
  }
});

// Allow Enter key in textarea to trigger Zeek (with Ctrl/Cmd)
dom.textInput.addEventListener('keydown', (e) => {
  if ((e.ctrlKey || e.metaKey) && e.key === 'Enter') {
    sendToSidePanel(dom.textInput.value);
  }
});

// Init
checkSelection();
