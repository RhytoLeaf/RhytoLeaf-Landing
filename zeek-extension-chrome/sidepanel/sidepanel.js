// Zeek RSVP Speed Reader — Side Panel Controller

import { parseText, renderORPWord, escapeHtml } from '../lib/text-parser.js';
import { RSVPEngine } from '../lib/rsvp-engine.js';

// ==================== STATE ====================
const state = {
  portraitMode: false,
  textSize: 'md',
  touchStartX: 0,
  touchStartY: 0,
  cameraStream: null,
  torchEnabled: false,
  facingMode: 'environment'
};

// ==================== DOM REFS ====================
const dom = {
  inputView: document.getElementById('inputView'),
  readerView: document.getElementById('readerView'),
  cameraModal: document.getElementById('cameraModal'),
  textInput: document.getElementById('textInput'),
  zeekBtn: document.getElementById('zeekBtn'),
  scanBtn: document.getElementById('scanBtn'),
  pasteBtn: document.getElementById('pasteBtn'),
  backBtn: document.getElementById('backBtn'),
  wordDisplay: document.getElementById('wordDisplay'),
  wpmDisplay: document.getElementById('wpmDisplay'),
  wordCounter: document.getElementById('wordCounter'),
  wordQueue: document.getElementById('wordQueue'),
  progressTrack: document.getElementById('progressTrack'),
  progressFill: document.getElementById('progressFill'),
  progressThumb: document.getElementById('progressThumb'),
  playPauseBtn: document.getElementById('playPauseBtn'),
  playIcon: document.getElementById('playIcon'),
  pauseIcon: document.getElementById('pauseIcon'),
  rewindBtn: document.getElementById('rewindBtn'),
  forwardBtn: document.getElementById('forwardBtn'),
  speedTrack: document.getElementById('speedTrack'),
  speedFill: document.getElementById('speedFill'),
  speedThumb: document.getElementById('speedThumb'),
  speedValueText: document.getElementById('speedValueText'),
  textSizeBtn: document.getElementById('textSizeBtn'),
  textSizeLabel: document.getElementById('textSizeLabel'),
  portraitToggle: document.getElementById('portraitToggle'),
  portraitIcon: document.getElementById('portraitIcon'),
  landscapeIcon: document.getElementById('landscapeIcon'),
  swipeArea: document.getElementById('swipeArea'),
  // Camera
  cameraFeed: document.getElementById('cameraFeed'),
  captureCanvas: document.getElementById('captureCanvas'),
  capturePreview: document.getElementById('capturePreview'),
  viewfinderGuide: document.getElementById('viewfinderGuide'),
  cameraControls: document.getElementById('cameraControls'),
  previewControls: document.getElementById('previewControls'),
  closeCameraBtn: document.getElementById('closeCameraBtn'),
  torchBtn: document.getElementById('torchBtn'),
  captureBtn: document.getElementById('captureBtn'),
  switchCameraBtn: document.getElementById('switchCameraBtn'),
  retakeBtn: document.getElementById('retakeBtn'),
  scanTextBtn: document.getElementById('scanTextBtn'),
  processingOverlay: document.getElementById('processingOverlay'),
  processingStatus: document.getElementById('processingStatus'),
  processingPercent: document.getElementById('processingPercent')
};

// ==================== RSVP ENGINE ====================
const engine = new RSVPEngine({
  onWordChange(word, index, total) {
    dom.wordDisplay.innerHTML = renderORPWord(word);
    dom.wordCounter.textContent = `${index + 1} / ${total}`;
    const progress = total > 1 ? (index / (total - 1)) * 100 : 0;
    dom.progressFill.style.width = `${progress}%`;
    dom.progressThumb.style.left = `calc(${progress}% - 6px)`;
    updateWordQueue(index);
  },
  onPlaybackEnd() {
    updatePlayPauseIcon(false);
  },
  onStateChange(s) {
    updatePlayPauseIcon(s === 'playing');
  }
});

function updatePlayPauseIcon(playing) {
  dom.playIcon.classList.toggle('hidden', playing);
  dom.pauseIcon.classList.toggle('hidden', !playing);
}

// ==================== WORD QUEUE ====================
function updateWordQueue(currentIndex) {
  const words = engine.words;
  const queueSize = 4;
  let html = '';
  for (let i = currentIndex - queueSize; i < currentIndex; i++) {
    if (i >= 0 && words[i]) {
      html += `<span class="queue-word" data-index="${i}">${escapeHtml(words[i])}</span>`;
    }
  }
  html += `<span class="queue-word current">${escapeHtml(words[currentIndex] || '')}</span>`;
  for (let i = currentIndex + 1; i <= currentIndex + queueSize; i++) {
    if (i < words.length && words[i]) {
      html += `<span class="queue-word" data-index="${i}">${escapeHtml(words[i])}</span>`;
    }
  }
  dom.wordQueue.innerHTML = html;
  dom.wordQueue.querySelectorAll('[data-index]').forEach(el => {
    el.addEventListener('click', () => {
      engine.seekTo(parseInt(el.dataset.index, 10));
    });
  });
}

// ==================== VIEW MANAGEMENT ====================
function showInputView() {
  engine.stop();
  dom.inputView.style.display = 'flex';
  dom.readerView.classList.add('hidden');
  dom.cameraModal.classList.add('hidden');
}

function showReaderView() {
  dom.inputView.style.display = 'none';
  dom.readerView.classList.remove('hidden');
  dom.cameraModal.classList.add('hidden');
}

function loadAndStartReader(text) {
  const words = parseText(text);
  if (words.length === 0) return;

  // Save raw text for potential resume
  chrome.storage.session.set({ raw_text: text });

  engine.loadText(words);
  dom.wpmDisplay.textContent = `${engine.wpm} wpm`;
  updateSpeedBar(engine.wpm);
  showReaderView();
}

// ==================== SPEED DIAL ====================
function updateSpeedBar(wpm) {
  const percent = ((wpm - 200) / 700) * 100;
  dom.speedFill.style.width = `${percent}%`;
  dom.speedThumb.style.left = `calc(${percent}% - 8px)`;
  dom.speedValueText.textContent = wpm;
}

function setupSpeedDial() {
  let isDragging = false;

  function getWPMFromPosition(clientX) {
    const rect = dom.speedTrack.getBoundingClientRect();
    const percent = Math.max(0, Math.min(1, (clientX - rect.left) / rect.width));
    return Math.round(200 + percent * 700);
  }

  function handleDrag(e) {
    if (!isDragging) return;
    e.preventDefault();
    const clientX = e.touches ? e.touches[0].clientX : e.clientX;
    const wpm = getWPMFromPosition(clientX);
    engine.setWPM(wpm);
    dom.wpmDisplay.textContent = `${wpm} wpm`;
    updateSpeedBar(wpm);
    savePreferences();
  }

  dom.speedTrack.addEventListener('mousedown', e => { isDragging = true; handleDrag(e); });
  dom.speedThumb.addEventListener('mousedown', e => { isDragging = true; e.stopPropagation(); });
  document.addEventListener('mousemove', handleDrag);
  document.addEventListener('mouseup', () => { if (isDragging) { isDragging = false; } });

  dom.speedTrack.addEventListener('touchstart', e => { isDragging = true; handleDrag(e); }, { passive: false });
  dom.speedThumb.addEventListener('touchstart', e => { isDragging = true; e.stopPropagation(); }, { passive: false });
  document.addEventListener('touchmove', e => { if (isDragging) handleDrag(e); }, { passive: false });
  document.addEventListener('touchend', () => { if (isDragging) { isDragging = false; } });

  updateSpeedBar(engine.wpm);
}

// ==================== PROGRESS BAR ====================
function setupProgressDrag() {
  let isDragging = false;

  function updateFromPosition(clientX) {
    const rect = dom.progressTrack.getBoundingClientRect();
    const percent = Math.max(0, Math.min(1, (clientX - rect.left) / rect.width));
    engine.seekToPercent(percent);
  }

  dom.progressTrack.addEventListener('mousedown', e => { isDragging = true; updateFromPosition(e.clientX); });
  dom.progressThumb.addEventListener('mousedown', e => { isDragging = true; e.stopPropagation(); });
  document.addEventListener('mousemove', e => { if (isDragging) updateFromPosition(e.clientX); });
  document.addEventListener('mouseup', () => { isDragging = false; });

  dom.progressTrack.addEventListener('touchstart', e => { isDragging = true; updateFromPosition(e.touches[0].clientX); });
  dom.progressThumb.addEventListener('touchstart', e => { isDragging = true; e.stopPropagation(); });
  document.addEventListener('touchmove', e => { if (isDragging) updateFromPosition(e.touches[0].clientX); });
  document.addEventListener('touchend', () => { isDragging = false; });
}

// ==================== PORTRAIT MODE ====================
function togglePortraitMode() {
  state.portraitMode = !state.portraitMode;
  dom.readerView.classList.toggle('portrait-mode', state.portraitMode);
  dom.portraitIcon.classList.toggle('hidden', state.portraitMode);
  dom.landscapeIcon.classList.toggle('hidden', !state.portraitMode);
  savePreferences();
}

// ==================== TEXT SIZE ====================
const TEXT_SIZES = ['md', 'lg', 'sm'];
const TEXT_SIZE_LABELS = { sm: 'S', md: 'M', lg: 'L' };

function cycleTextSize() {
  const idx = TEXT_SIZES.indexOf(state.textSize);
  state.textSize = TEXT_SIZES[(idx + 1) % TEXT_SIZES.length];
  applyTextSize();
  savePreferences();
}

function applyTextSize() {
  dom.readerView.classList.remove('text-sm', 'text-lg');
  if (state.textSize !== 'md') {
    dom.readerView.classList.add(`text-${state.textSize}`);
  }
  dom.textSizeLabel.textContent = TEXT_SIZE_LABELS[state.textSize];
}

// ==================== SWIPE GESTURES ====================
function setupSwipeGestures() {
  const minSwipeDistance = 50;

  dom.swipeArea.addEventListener('touchstart', e => {
    state.touchStartX = e.touches[0].clientX;
    state.touchStartY = e.touches[0].clientY;
  }, { passive: true });

  dom.swipeArea.addEventListener('touchend', e => {
    const dx = e.changedTouches[0].clientX - state.touchStartX;
    const dy = e.changedTouches[0].clientY - state.touchStartY;
    if (Math.abs(dx) > Math.abs(dy) && Math.abs(dx) > minSwipeDistance) {
      engine.skip(dx > 0 ? -1 : 1);
    }
  }, { passive: true });

  dom.swipeArea.addEventListener('click', e => {
    if (e.target === dom.swipeArea || e.target === dom.wordDisplay || e.target.closest('#wordDisplay')) {
      engine.toggle();
    }
  });
}

// ==================== KEYBOARD SHORTCUTS ====================
function setupKeyboardShortcuts() {
  document.addEventListener('keydown', e => {
    if (dom.readerView.classList.contains('hidden')) return;
    if (e.target.tagName === 'TEXTAREA' || e.target.tagName === 'INPUT') return;

    switch (e.code) {
      case 'Space':
        e.preventDefault();
        engine.toggle();
        break;
      case 'ArrowLeft':
        e.preventDefault();
        engine.skip(-1);
        break;
      case 'ArrowRight':
        e.preventDefault();
        engine.skip(1);
        break;
      case 'ArrowUp':
        e.preventDefault();
        engine.setWPM(Math.min(900, engine.wpm + 10));
        dom.wpmDisplay.textContent = `${engine.wpm} wpm`;
        updateSpeedBar(engine.wpm);
        savePreferences();
        break;
      case 'ArrowDown':
        e.preventDefault();
        engine.setWPM(Math.max(200, engine.wpm - 10));
        dom.wpmDisplay.textContent = `${engine.wpm} wpm`;
        updateSpeedBar(engine.wpm);
        savePreferences();
        break;
      case 'KeyT':
        e.preventDefault();
        cycleTextSize();
        break;
      case 'KeyP':
        e.preventDefault();
        togglePortraitMode();
        break;
      case 'Escape':
        showInputView();
        break;
    }
  });
}

// ==================== CAMERA / OCR ====================
async function startCamera() {
  try {
    state.cameraStream = await navigator.mediaDevices.getUserMedia({
      video: { facingMode: state.facingMode, width: { ideal: 1280 }, height: { ideal: 720 } }
    });
    dom.cameraFeed.srcObject = state.cameraStream;
  } catch (err) {
    console.error('Camera error:', err);
    alert('Could not access camera. Please check permissions.');
    hideCameraModal();
  }
}

function stopCamera() {
  if (state.cameraStream) {
    state.cameraStream.getTracks().forEach(track => track.stop());
    state.cameraStream = null;
  }
  state.torchEnabled = false;
}

function showCameraModal() {
  dom.cameraModal.classList.remove('hidden');
  resetCameraToLive();
  startCamera();
}

function hideCameraModal() {
  dom.cameraModal.classList.add('hidden');
  stopCamera();
  resetCameraToLive();
}

function resetCameraToLive() {
  dom.cameraFeed.classList.remove('hidden');
  dom.capturePreview.classList.add('hidden');
  dom.viewfinderGuide.classList.remove('hidden');
  dom.cameraControls.style.display = 'flex';
  dom.previewControls.classList.add('hidden');
}

function showCapturePreview() {
  dom.cameraFeed.classList.add('hidden');
  dom.capturePreview.classList.remove('hidden');
  dom.viewfinderGuide.classList.add('hidden');
  dom.cameraControls.style.display = 'none';
  dom.previewControls.classList.remove('hidden');
}

async function toggleTorch() {
  if (!state.cameraStream) return;
  const track = state.cameraStream.getVideoTracks()[0];
  const capabilities = track.getCapabilities();
  if (!capabilities.torch) { alert('Torch not available on this device'); return; }
  state.torchEnabled = !state.torchEnabled;
  await track.applyConstraints({ advanced: [{ torch: state.torchEnabled }] });
  dom.torchBtn.classList.toggle('active', state.torchEnabled);
}

async function switchCamera() {
  stopCamera();
  state.facingMode = state.facingMode === 'environment' ? 'user' : 'environment';
  await startCamera();
}

function capturePhoto() {
  const video = dom.cameraFeed;
  const canvas = dom.captureCanvas;
  canvas.width = video.videoWidth;
  canvas.height = video.videoHeight;
  canvas.getContext('2d').drawImage(video, 0, 0);
  dom.capturePreview.src = canvas.toDataURL('image/jpeg', 0.9);
  showCapturePreview();
}

async function scanText() {
  dom.processingOverlay.classList.remove('hidden');
  dom.processingStatus.textContent = 'Loading OCR engine...';
  dom.processingPercent.textContent = '0%';

  try {
    // Dynamically load Tesseract.js if not already loaded
    if (typeof Tesseract === 'undefined') {
      await loadScript(chrome.runtime.getURL('lib/tesseract/tesseract.min.js'));
    }

    const workerPath = chrome.runtime.getURL('lib/tesseract/tesseract-worker.min.js');
    const result = await Tesseract.recognize(dom.captureCanvas, 'eng', {
      workerPath,
      logger: m => {
        if (m.status === 'recognizing text') {
          dom.processingPercent.textContent = `${Math.round(m.progress * 100)}%`;
          dom.processingStatus.textContent = 'Recognizing text...';
        } else if (m.status === 'loading language traineddata') {
          dom.processingStatus.textContent = 'Downloading language data...';
        } else if (m.status === 'loading tesseract core') {
          dom.processingStatus.textContent = 'Loading OCR core...';
        }
      }
    });

    const text = result.data.text.trim();
    if (text) {
      dom.textInput.value = text;
      hideCameraModal();
    } else {
      alert('No text detected. Try adjusting lighting or position.');
      resetCameraToLive();
    }
  } catch (err) {
    console.error('OCR error:', err);
    alert('OCR failed. Please try again.');
    resetCameraToLive();
  } finally {
    dom.processingOverlay.classList.add('hidden');
  }
}

function loadScript(src) {
  return new Promise((resolve, reject) => {
    const script = document.createElement('script');
    script.src = src;
    script.onload = resolve;
    script.onerror = reject;
    document.head.appendChild(script);
  });
}

// ==================== PERSISTENCE ====================
async function loadPreferences() {
  try {
    const { preferences } = await chrome.storage.local.get('preferences');
    if (preferences) {
      if (preferences.wpm) {
        engine.setWPM(preferences.wpm);
      }
      if (preferences.portraitMode) {
        state.portraitMode = true;
        dom.readerView.classList.add('portrait-mode');
        dom.portraitIcon.classList.add('hidden');
        dom.landscapeIcon.classList.remove('hidden');
      }
      if (preferences.textSize && TEXT_SIZES.includes(preferences.textSize)) {
        state.textSize = preferences.textSize;
        applyTextSize();
      }
    }
  } catch (e) {
    // Preferences unavailable
  }
}

function savePreferences() {
  try {
    chrome.storage.local.set({
      preferences: {
        wpm: engine.wpm,
        portraitMode: state.portraitMode,
        textSize: state.textSize
      }
    });
  } catch (e) {
    // Storage unavailable
  }
}

async function checkPendingText() {
  try {
    const { pending_text } = await chrome.storage.session.get('pending_text');
    if (pending_text) {
      await chrome.storage.session.remove('pending_text');
      loadAndStartReader(pending_text);
      return true;
    }
  } catch (e) {
    // No pending text
  }
  return false;
}

async function checkResumableState() {
  try {
    const { reading_state, raw_text } = await chrome.storage.session.get(['reading_state', 'raw_text']);
    if (reading_state && raw_text) {
      const words = parseText(raw_text);
      if (words.length > 0) {
        engine.loadText(words, reading_state.currentIndex || 0);
        dom.wpmDisplay.textContent = `${engine.wpm} wpm`;
        updateSpeedBar(engine.wpm);
        showReaderView();
        return true;
      }
    }
  } catch (e) {
    // No resumable state
  }
  return false;
}

// Listen for new pending text while panel is open
chrome.storage.session.onChanged.addListener((changes) => {
  if (changes.pending_text?.newValue) {
    chrome.storage.session.remove('pending_text');
    loadAndStartReader(changes.pending_text.newValue);
  }
});

// Save state when panel becomes hidden
document.addEventListener('visibilitychange', () => {
  if (document.hidden && engine.words.length > 0) {
    engine._saveState();
  }
});

// ==================== EYE BLINK ====================
function initEyeBlink() {
  const eyes = document.querySelectorAll('.eye-blinker');
  if (!eyes.length) return;

  function blink() {
    eyes.forEach(eye => {
      eye.classList.add('blink');
      eye.addEventListener('animationend', () => {
        eye.classList.remove('blink');
      }, { once: true });
    });
  }

  function scheduleBlink() {
    const delay = 3000 + Math.random() * 3000;
    setTimeout(() => {
      blink();
      scheduleBlink();
    }, delay);
  }

  eyes.forEach(eye => eye.addEventListener('click', blink));
  setTimeout(() => { blink(); scheduleBlink(); }, 1500);
}

// ==================== INIT ====================
async function init() {
  // Load saved preferences first
  await loadPreferences();

  // Wire up input view
  dom.zeekBtn.addEventListener('click', () => loadAndStartReader(dom.textInput.value));
  dom.scanBtn.addEventListener('click', showCameraModal);
  dom.pasteBtn.addEventListener('click', async () => {
    try {
      dom.textInput.value = await navigator.clipboard.readText();
      dom.textInput.focus();
    } catch (err) {
      dom.textInput.focus();
      alert('Clipboard access denied. Please use Ctrl+V / Cmd+V to paste.');
    }
  });

  // Wire up camera
  dom.closeCameraBtn.addEventListener('click', hideCameraModal);
  dom.torchBtn.addEventListener('click', toggleTorch);
  dom.switchCameraBtn.addEventListener('click', switchCamera);
  dom.captureBtn.addEventListener('click', capturePhoto);
  dom.retakeBtn.addEventListener('click', resetCameraToLive);
  dom.scanTextBtn.addEventListener('click', scanText);

  // Wire up reader controls
  dom.backBtn.addEventListener('click', showInputView);
  dom.playPauseBtn.addEventListener('click', () => engine.toggle());
  dom.rewindBtn.addEventListener('click', () => engine.skip(-10));
  dom.forwardBtn.addEventListener('click', () => engine.skip(10));
  dom.textSizeBtn.addEventListener('click', cycleTextSize);
  dom.portraitToggle.addEventListener('click', togglePortraitMode);

  // Setup interactions
  setupProgressDrag();
  setupSpeedDial();
  setupSwipeGestures();
  setupKeyboardShortcuts();
  initEyeBlink();

  // Check for pending text from popup/context menu
  const hasPending = await checkPendingText();
  if (!hasPending) {
    // Try to resume a previous reading session
    await checkResumableState();
  }
}

init();
