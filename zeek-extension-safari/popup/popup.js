// Zeek RSVP Speed Reader — Popup Controller (Safari)

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
    const [tab] = await browser.tabs.query({ active: true, currentWindow: true });
    if (!tab || tab.url.startsWith('safari-web-extension://') || !tab.url) {
      return;
    }
    const response = await browser.tabs.sendMessage(tab.id, { action: 'get_selection' });
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

// Send text to the reader window and open it
async function sendToReader(text) {
  if (!text || !text.trim()) {
    alert('Please enter some text to read.');
    return;
  }
  await browser.storage.session.set({ pending_text: text.trim() });

  // Ask background to open the reader window
  try {
    await browser.runtime.sendMessage({ action: 'open_reader_window' });
  } catch (e) {
    console.warn('Could not open reader window:', e);
  }
  window.close();
}

// Event listeners
dom.readSelectionBtn.addEventListener('click', () => {
  sendToReader(selectedText);
});

dom.zeekBtn.addEventListener('click', () => {
  sendToReader(dom.textInput.value);
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
    sendToReader(dom.textInput.value);
  }
});

// Init
checkSelection();
