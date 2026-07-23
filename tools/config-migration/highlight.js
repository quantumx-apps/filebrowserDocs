/**
 * @param {string} text
 * @param {string[]} lineClasses
 * @returns {string}
 */
export function renderHighlightedHtml(text, lineClasses) {
  const lines = text.split('\n');
  const parts = lines.map((line, i) => {
    const cls = lineClasses[i] || '';
    const escaped = escapeHtml(line);
    if (cls) {
      return `<span class="${cls}">${escaped || ' '}</span>`;
    }
    return escaped || ' ';
  });
  return parts.join('\n');
}

/**
 * @param {HTMLElement} highlightEl
 * @param {HTMLTextAreaElement} textareaEl
 * @param {string} text
 * @param {string[]} lineClasses
 */
export function updateEditorHighlight(highlightEl, textareaEl, text, lineClasses) {
  highlightEl.textContent = '';
  highlightEl.innerHTML = renderHighlightedHtml(text, lineClasses) + '\n';
  syncHighlightScroll(highlightEl, textareaEl);
}

/**
 * @param {HTMLElement} highlightEl
 * @param {HTMLTextAreaElement} textareaEl
 */
export function syncHighlightScroll(highlightEl, textareaEl) {
  highlightEl.scrollTop = textareaEl.scrollTop;
  highlightEl.scrollLeft = textareaEl.scrollLeft;
}

/**
 * Wire scroll sync between highlight layer and textarea.
 * @param {HTMLElement} highlightEl
 * @param {HTMLTextAreaElement} textareaEl
 */
export function bindEditorScrollSync(highlightEl, textareaEl) {
  textareaEl.addEventListener('scroll', () => {
    syncHighlightScroll(highlightEl, textareaEl);
  });
}

/**
 * @param {string} str
 */
function escapeHtml(str) {
  return str
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;');
}
