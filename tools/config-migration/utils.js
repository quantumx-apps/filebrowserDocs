/**
 * YAML 1.2 allows only specific escapes inside double-quoted strings.
 * Regex patterns like "^\\." often use invalid sequences (e.g. "\\.").
 * @param {string} inner
 * @returns {string}
 */
function fixDoubleQuotedContent(inner) {
  const validSingle = '0abtnvfre"/\\N_LP';
  let out = '';
  for (let i = 0; i < inner.length; i++) {
    const ch = inner[i];
    if (ch !== '\\') {
      out += ch;
      continue;
    }
    if (i + 1 >= inner.length) {
      out += '\\\\';
      continue;
    }
    const next = inner[i + 1];
    if (next === 'x' && i + 3 < inner.length && /^[0-9A-Fa-f]{2}$/.test(inner.slice(i + 2, i + 4))) {
      out += inner.slice(i, i + 4);
      i += 3;
      continue;
    }
    if (next === 'u' && i + 5 < inner.length && /^[0-9A-Fa-f]{4}$/.test(inner.slice(i + 2, i + 6))) {
      out += inner.slice(i, i + 6);
      i += 5;
      continue;
    }
    if (next === 'U' && i + 9 < inner.length && /^[0-9A-Fa-f]{8}$/.test(inner.slice(i + 2, i + 10))) {
      out += inner.slice(i, i + 10);
      i += 9;
      continue;
    }
    if (validSingle.includes(next)) {
      out += '\\' + next;
      i += 1;
      continue;
    }
    out += '\\\\' + next;
    i += 1;
  }
  return out;
}

/**
 * @param {string} raw
 * @returns {boolean}
 */
export function usesYamlAnchorsOrAliases(raw) {
  return /<<:\s*\*[A-Za-z0-9_-]+|&[A-Za-z0-9_-]+|(?:^|[\s:])\*[A-Za-z0-9_-]+/m.test(raw);
}

/**
 * Alias names referenced with * but not defined with & in the same file.
 * @param {string} raw
 * @returns {string[]}
 */
export function missingAnchorNames(raw) {
  /** @type {Set<string>} */
  const defined = new Set();
  for (const match of raw.matchAll(/&([A-Za-z0-9_-]+)/g)) {
    defined.add(match[1]);
  }

  /** @type {Set<string>} */
  const referenced = new Set();
  for (const match of raw.matchAll(/\*([A-Za-z0-9_-]+)/g)) {
    referenced.add(match[1]);
  }

  return [...referenced].filter((name) => !defined.has(name));
}

/**
 * Prepend empty anchor definitions for aliases referenced but not defined in this file.
 * @param {string} raw
 * @returns {string}
 */
export function ensureAnchorStubs(raw) {
  const missing = missingAnchorNames(raw);
  if (missing.length === 0) {
    return raw;
  }

  const stubs = missing.map((name) => `${name}: &${name} {}`).join('\n');
  return `# Anchor stubs for migration parsing (anchor may be defined elsewhere)\n${stubs}\n\n${raw}`;
}

/**
 * @param {string} raw
 * @returns {{ preamble: string, sections: Map<string, string>, keyOrder: string[] }}
 */
export function extractTopLevelSections(raw) {
  const lines = raw.split('\n');
  /** @type {string[]} */
  const preambleLines = [];
  /** @type {Map<string, string>} */
  const sections = new Map();
  /** @type {string[]} */
  const keyOrder = [];

  /** @type {string|null} */
  let currentKey = null;
  /** @type {string[]} */
  let currentLines = [];

  const flush = () => {
    if (currentKey !== null) {
      sections.set(currentKey, currentLines.join('\n'));
      keyOrder.push(currentKey);
    }
    currentKey = null;
    currentLines = [];
  };

  for (const line of lines) {
    const topMatch = line.match(/^([A-Za-z0-9_.-]+):\s*(.*)$/);
    if (topMatch && !line.startsWith(' ') && !line.startsWith('\t')) {
      flush();
      currentKey = topMatch[1];
      currentLines = [line];
      continue;
    }

    if (currentKey === null) {
      preambleLines.push(line);
    } else {
      currentLines.push(line);
    }
  }
  flush();

  return { preamble: preambleLines.join('\n'), sections, keyOrder };
}

/**
 * Top-level sections that reference YAML anchors/aliases — left unchanged in output.
 * @param {string} raw
 * @returns {Set<string>}
 */
export function anchorProtectedTopLevelKeys(raw) {
  const { sections } = extractTopLevelSections(raw);
  /** @type {Set<string>} */
  const protectedKeys = new Set();
  for (const [key, text] of sections.entries()) {
    if (/<<:\s*\*[A-Za-z0-9_-]+|&[A-Za-z0-9_-]+|\*[A-Za-z0-9_-]+/.test(text)) {
      protectedKeys.add(key);
    }
  }
  return protectedKeys;
}

/**
 * Normalize double-quoted YAML strings so js-yaml can parse common regex escapes.
 * @param {string} raw
 * @returns {string}
 */
export function normalizeYamlForParse(raw) {
  return raw.replace(/"((?:[^"\\]|\\.)*)"/g, (match, inner) => {
    const fixed = fixDoubleQuotedContent(inner);
    return fixed === inner ? match : `"${fixed}"`;
  });
}

/**
 * @param {object} obj
 * @param {string} dotPath e.g. "sidebar.sticky"
 * @param {unknown} value
 */
export function setByPath(obj, dotPath, value) {
  const parts = dotPath.split('.');
  let cur = obj;
  for (let i = 0; i < parts.length - 1; i++) {
    const p = parts[i];
    if (cur[p] === undefined || cur[p] === null || typeof cur[p] !== 'object') {
      cur[p] = {};
    }
    cur = cur[p];
  }
  cur[parts[parts.length - 1]] = value;
}

/**
 * @param {object} obj
 * @param {string} dotPath
 * @returns {unknown}
 */
export function getByPath(obj, dotPath) {
  const parts = dotPath.split('.');
  let cur = obj;
  for (const p of parts) {
    if (cur === undefined || cur === null || typeof cur !== 'object') {
      return undefined;
    }
    cur = cur[p];
  }
  return cur;
}

/**
 * @param {object} obj
 * @param {string} dotPath
 */
export function deleteByPath(obj, dotPath) {
  const parts = dotPath.split('.');
  let cur = obj;
  for (let i = 0; i < parts.length - 1; i++) {
    const p = parts[i];
    if (cur[p] === undefined || cur[p] === null || typeof cur[p] !== 'object') {
      return;
    }
    cur = cur[p];
  }
  delete cur[parts[parts.length - 1]];
}

/**
 * Deep clone plain objects/arrays (config-safe).
 * @param {unknown} value
 */
export function deepClone(value) {
  if (value === null || typeof value !== 'object') {
    return value;
  }
  if (Array.isArray(value)) {
    return value.map(deepClone);
  }
  const out = {};
  for (const [k, v] of Object.entries(value)) {
    out[k] = deepClone(v);
  }
  return out;
}

/**
 * @param {string} dbPath
 * @returns {{ path: string, migrateFrom: string }}
 */
export function sqlitePathsFromLegacyDatabase(dbPath) {
  const trimmed = String(dbPath).trim();
  if (!trimmed) {
    return { path: 'filebrowser.sqlite', migrateFrom: 'database.db.old' };
  }
  const lastSlash = Math.max(trimmed.lastIndexOf('/'), trimmed.lastIndexOf('\\'));
  const dir = lastSlash >= 0 ? trimmed.slice(0, lastSlash + 1) : '';
  const base = lastSlash >= 0 ? trimmed.slice(lastSlash + 1) : trimmed;
  const migrateFrom = base.endsWith('.db')
    ? `${dir}${base.slice(0, -3)}.db.old`
    : `${dir}${base}.old`;
  const path = `${dir}filebrowser.sqlite`;
  return { path, migrateFrom };
}

/**
 * @typedef {'removed'|'moved'|'added'} ChangeAction
 * @typedef {{ action: ChangeAction, path: string, inputKey?: string, outputKey?: string, inputPath?: string, outputPath?: string }} Change
 */

/**
 * @param {Change[]} changes
 * @param {ChangeAction} action
 * @param {string} path
 * @param {{ inputKey?: string, outputKey?: string, inputPath?: string, outputPath?: string }} [keys]
 */
export function recordChange(changes, action, path, keys = {}) {
  /** @type {Change} */
  const entry = { action, path };
  for (const key of ['inputKey', 'outputKey', 'inputPath', 'outputPath']) {
    if (keys[key]) {
      entry[key] = keys[key];
    }
  }
  changes.push(entry);
}

/**
 * Record a relocation shown as moved (input) and added (output).
 * @param {Change[]} changes
 * @param {string} path
 * @param {{ inputKey?: string, outputKey?: string, inputPath?: string, outputPath?: string }} keys
 */
export function recordRelocation(changes, path, keys) {
  recordChange(changes, 'moved', path, keys);
}
