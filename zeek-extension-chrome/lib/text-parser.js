// Zeek — Text Parsing & ORP Calculation
// Ported from zeek.html

export function getORPIndex(word) {
  const len = word.length;
  if (len <= 1) return 0;
  if (len <= 5) return 1;
  if (len <= 9) return 2;
  if (len <= 13) return 3;
  return 4;
}

export function escapeHtml(text) {
  const div = document.createElement('div');
  div.textContent = text;
  return div.innerHTML;
}

export function renderORPWord(word) {
  if (!word) return '';
  const orpIndex = getORPIndex(word);
  const before = word.slice(0, orpIndex);
  const orp = word[orpIndex] || '';
  const after = word.slice(orpIndex + 1);
  return `${escapeHtml(before)}<span class="orp-letter">${escapeHtml(orp)}</span>${escapeHtml(after)}`;
}

export function parseText(text) {
  const rawWords = text.trim().split(/\s+/).filter(w => w.length > 0);
  const words = [];
  for (const word of rawWords) {
    if (word.includes('-')) {
      const parts = word.split(/(-)/);
      let current = '';
      for (let i = 0; i < parts.length; i++) {
        if (parts[i] === '-') {
          current += '-';
        } else if (parts[i]) {
          if (current) { words.push(current); current = ''; }
          current = parts[i];
        }
      }
      if (current) words.push(current);
    } else {
      words.push(word);
    }
  }
  return words;
}
