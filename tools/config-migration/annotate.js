import { buildYamlLinePaths, yamlPathMatches } from './yaml-paths.js';

/**
 * @typedef {'removed'|'moved'|'added'} ChangeAction
 * @typedef {{ action: ChangeAction, path: string, inputKey?: string, outputKey?: string, inputPath?: string, outputPath?: string }} Change
 */

/**
 * Build per-line highlight classes from change log.
 * @param {string} text
 * @param {Change[]} changes
 * @param {'input'|'output'} panel
 * @returns {string[]}
 */
export function buildLineHighlights(text, changes, panel) {
  const lines = text.split('\n');
  const classes = lines.map(() => '');
  const linePaths = buildYamlLinePaths(text);

  /** @type {Map<number, ChangeAction>} */
  const lineActions = new Map();

  for (let i = 0; i < changes.length; i++) {
    const change = changes[i];
    if (panel === 'input') {
      if (change.action !== 'removed' && change.action !== 'moved') {
        continue;
      }
      if (!change.inputPath) {
        continue;
      }
      for (let line = 0; line < lines.length; line++) {
        const linePath = linePaths[line];
        if (!linePath || !yamlPathMatches(change.inputPath, linePath)) {
          continue;
        }
        const existing = lineActions.get(line);
        if (change.action === 'removed' || existing !== 'removed') {
          lineActions.set(line, change.action === 'removed' ? 'removed' : 'moved');
        }
      }
      continue;
    }

    if (change.action !== 'added' && change.action !== 'moved') {
      continue;
    }
    if (!change.outputPath) {
      continue;
    }
    for (let line = 0; line < lines.length; line++) {
      const linePath = linePaths[line];
      if (linePath && yamlPathMatches(change.outputPath, linePath)) {
        lineActions.set(line, 'added');
      }
    }
  }

  for (const [line, action] of lineActions) {
    classes[line] = `hl-${action}`;
  }

  return classes;
}

/**
 * @param {string} str
 * @returns {string}
 */
function escapeHtml(str) {
  return str
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;');
}

/**
 * @param {Change[]} changes
 * @returns {string}
 */
export function formatChangesSummary(changes) {
  if (changes.length === 0) {
    return '';
  }
  const seen = new Set();
  const lines = [];
  for (const c of changes) {
    const id = `${c.action}:${c.path}`;
    if (seen.has(id)) {
      continue;
    }
    seen.add(id);
    lines.push(`${c.action}: ${c.path}`);
  }
  return lines.join('\n');
}

/**
 * @param {Change[]} changes
 * @returns {string}
 */
export function renderChangesSummaryHtml(changes) {
  if (changes.length === 0) {
    return '';
  }
  const seen = new Set();
  /** @type {string[]} */
  const items = [];
  for (const c of changes) {
    const id = `${c.action}:${c.path}`;
    if (seen.has(id)) {
      continue;
    }
    seen.add(id);
    items.push(
      `<div class="changes-summary__item changes-summary__item--${c.action}" role="listitem">` +
        `<span class="changes-summary__label">${c.action}</span>` +
        `<span class="changes-summary__path">${escapeHtml(c.path)}</span>` +
      '</div>',
    );
  }
  return items.join('');
}
