// Zeek RSVP Speed Reader — Content Script
// Responds to messages requesting the current text selection.

chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  if (message.action === 'get_selection') {
    const selection = window.getSelection().toString().trim();
    sendResponse({ text: selection });
  }
  return true;
});
