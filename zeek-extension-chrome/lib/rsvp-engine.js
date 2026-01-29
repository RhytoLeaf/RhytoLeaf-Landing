// Zeek — RSVP Playback Engine
// Decoupled state machine for RSVP word display.

export class RSVPEngine {
  constructor({ onWordChange, onPlaybackEnd, onStateChange }) {
    this.words = [];
    this.currentIndex = 0;
    this.isPlaying = false;
    this.wpm = 200;
    this.intervalId = null;
    this.onWordChange = onWordChange;
    this.onPlaybackEnd = onPlaybackEnd;
    this.onStateChange = onStateChange;
    this._saveDebounceId = null;
  }

  loadText(words, startIndex = 0) {
    this.stop();
    this.words = words;
    this.currentIndex = Math.min(startIndex, words.length - 1);
    this._notify();
  }

  play() {
    if (this.isPlaying || this.words.length === 0) return;
    this.isPlaying = true;
    this.onStateChange?.('playing');
    this._startInterval();
  }

  stop() {
    this.isPlaying = false;
    this.onStateChange?.('paused');
    this._clearInterval();
    this._saveState();
  }

  toggle() {
    this.isPlaying ? this.stop() : this.play();
  }

  seekTo(index) {
    this.currentIndex = Math.max(0, Math.min(this.words.length - 1, index));
    this._notify();
    this._saveState();
  }

  seekToPercent(percent) {
    const index = Math.round(percent * (this.words.length - 1));
    this.seekTo(index);
  }

  skip(delta) {
    this.seekTo(this.currentIndex + delta);
  }

  setWPM(wpm) {
    this.wpm = Math.max(100, Math.min(1200, parseInt(wpm, 10) || 200));
    if (this.isPlaying) {
      this._clearInterval();
      this._startInterval();
    }
  }

  get currentWord() { return this.words[this.currentIndex] || ''; }

  get progress() {
    return this.words.length > 1
      ? this.currentIndex / (this.words.length - 1)
      : 0;
  }

  get wordCount() { return this.words.length; }

  // --- Private ---

  _startInterval() {
    this._clearInterval();
    const msPerWord = 60000 / this.wpm;
    this.intervalId = setInterval(() => {
      if (this.currentIndex < this.words.length - 1) {
        this.currentIndex++;
        this._notify();
        this._debounceSave();
      } else {
        this.stop();
        this.onPlaybackEnd?.();
      }
    }, msPerWord);
  }

  _clearInterval() {
    if (this.intervalId) {
      clearInterval(this.intervalId);
      this.intervalId = null;
    }
  }

  _notify() {
    this.onWordChange?.(this.currentWord, this.currentIndex, this.words.length);
  }

  _debounceSave() {
    clearTimeout(this._saveDebounceId);
    this._saveDebounceId = setTimeout(() => this._saveState(), 500);
  }

  _saveState() {
    try {
      chrome.storage.session.set({
        reading_state: {
          currentIndex: this.currentIndex,
          isPlaying: this.isPlaying,
          wordCount: this.words.length
        }
      });
    } catch (e) {
      // Storage may not be available in all contexts
    }
  }

  destroy() {
    this._clearInterval();
    clearTimeout(this._saveDebounceId);
  }
}
