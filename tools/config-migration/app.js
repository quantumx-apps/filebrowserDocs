import { migrateConfig } from './migrate.js';
import { renderChangesSummaryHtml } from './annotate.js';
import {
  updateEditorHighlight,
  bindEditorScrollSync,
} from './highlight.js';

const inputEl = document.getElementById('input');
const outputEl = document.getElementById('output');
const inputHighlightEl = document.getElementById('input-highlight');
const outputHighlightEl = document.getElementById('output-highlight');
const convertBtn = document.getElementById('convert-btn');
const copyBtn = document.getElementById('copy-btn');
const clearBtn = document.getElementById('clear-btn');
const statusEl = document.getElementById('status');
const changesSummaryEl = document.getElementById('changes-summary');
const changesSummaryBodyEl = document.getElementById('changes-summary-body');

function setStatus(message, isError) {
  statusEl.textContent = message;
  statusEl.classList.toggle('toolbar__status--error', Boolean(isError));
}

function refreshInputHighlight(classes = []) {
  updateEditorHighlight(inputHighlightEl, inputEl, inputEl.value, classes);
}

function refreshOutputHighlight(classes = []) {
  updateEditorHighlight(outputHighlightEl, outputEl, outputEl.value, classes);
}

function runConvert() {
  const result = migrateConfig(inputEl.value);
  if (!result.ok) {
    outputEl.value = '';
    copyBtn.disabled = true;
    refreshInputHighlight([]);
    refreshOutputHighlight([]);
    changesSummaryBodyEl.innerHTML = '';
    changesSummaryEl.hidden = true;
    setStatus(result.error, true);
    return;
  }

  outputEl.value = result.yaml;
  copyBtn.disabled = false;
  refreshInputHighlight(result.inputHighlights);
  refreshOutputHighlight(result.outputHighlights);

  if (result.changes.length > 0) {
    changesSummaryBodyEl.innerHTML = renderChangesSummaryHtml(result.changes);
    changesSummaryEl.hidden = false;
  } else {
    changesSummaryBodyEl.innerHTML = '';
    changesSummaryEl.hidden = true;
  }

  const changeCount = result.changes.length;
  const warningText =
    result.warnings.length > 0 ? ` Warnings: ${result.warnings.join(' ')}` : '';
  setStatus(`Converted (${changeCount} change${changeCount === 1 ? '' : 's'}).${warningText}`, false);
}

async function copyOutput() {
  const text = outputEl.value;
  if (!text) {
    return;
  }

  try {
    await navigator.clipboard.writeText(text);
    setStatus('Copied to clipboard.', false);
  } catch {
    outputEl.select();
    document.execCommand('copy');
    setStatus('Copied to clipboard.', false);
  }
}

function clearAll() {
  inputEl.value = '';
  outputEl.value = '';
  copyBtn.disabled = true;
  refreshInputHighlight([]);
  refreshOutputHighlight([]);
  changesSummaryBodyEl.innerHTML = '';
  changesSummaryEl.hidden = true;
  setStatus('', false);
  inputEl.focus();
}

convertBtn.addEventListener('click', runConvert);
copyBtn.addEventListener('click', copyOutput);
clearBtn.addEventListener('click', clearAll);

bindEditorScrollSync(inputHighlightEl, inputEl);
bindEditorScrollSync(outputHighlightEl, outputEl);

inputEl.addEventListener('input', () => {
  refreshInputHighlight([]);
});

inputEl.addEventListener('keydown', (event) => {
  if ((event.metaKey || event.ctrlKey) && event.key === 'Enter') {
    event.preventDefault();
    runConvert();
  }
});

inputEl.focus();
