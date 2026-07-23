/**
 * @param {string} segment
 * @returns {string}
 */
function escapeRegexSegment(segment) {
  return segment.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}

/**
 * @param {string} pattern e.g. server.sources[].config.rules
 * @param {string} linePath e.g. server.sources[0].config.rules
 * @returns {boolean}
 */
export function yamlPathMatches(pattern, linePath) {
  if (!pattern || !linePath) {
    return false;
  }
  const re = pattern
    .split('.')
    .map((segment) => {
      if (segment.endsWith('[]')) {
        const name = segment.slice(0, -2);
        return `${escapeRegexSegment(name)}\\[\\d+\\]`;
      }
      return escapeRegexSegment(segment);
    })
    .join('\\.');
  return new RegExp(`^${re}$`).test(linePath);
}

/**
 * Build a YAML dot path for each line (array items use [0], [1], …).
 * @param {string} text
 * @returns {(string|null)[]}
 */
export function buildYamlLinePaths(text) {
  const lines = text.split('\n');
  /** @type {(string|null)[]} */
  const paths = [];
  /** @type {{ indent: number, part: string }[]} */
  const stack = [];
  /** @type {Map<string, number>} */
  const listIndexes = new Map();

  for (const line of lines) {
    if (!line.trim() || line.trim().startsWith('#')) {
      paths.push(null);
      continue;
    }

    const indent = line.search(/\S/);
    while (stack.length > 0 && stack[stack.length - 1].indent >= indent) {
      stack.pop();
    }

    const dashKey = line.match(/^(\s*)-\s+([A-Za-z0-9_.-]+)\s*:/);
    if (dashKey) {
      pushListItem(stack, listIndexes, dashKey[1].length, dashKey[2]);
      paths.push(formatYamlPath(stack));
      continue;
    }

    if (/^(\s*)-\s+/.test(line)) {
      const listIndent = line.match(/^(\s*)-\s+/)?.[1].length ?? 0;
      pushListIndex(stack, listIndexes, listIndent);
      paths.push(formatYamlPath(stack));
      continue;
    }

    const keyMatch = line.match(/^(\s*)([A-Za-z0-9_.-]+)\s*:/);
    if (!keyMatch) {
      paths.push(stack.length ? formatYamlPath(stack) : null);
      continue;
    }

    stack.push({ indent: keyMatch[1].length, part: keyMatch[2] });
    paths.push(formatYamlPath(stack));
  }

  return paths;
}

/**
 * @param {{ indent: number, part: string }[]} stack
 * @param {Map<string, number>} listIndexes
 * @param {number} listIndent
 * @param {string} [key]
 */
function pushListItem(stack, listIndexes, listIndent, key) {
  while (stack.length > 0 && stack[stack.length - 1].indent >= listIndent) {
    stack.pop();
  }
  pushListIndex(stack, listIndexes, listIndent);
  stack.push({ indent: listIndent + 2, part: key });
}

/**
 * @param {{ indent: number, part: string }[]} stack
 * @param {Map<string, number>} listIndexes
 * @param {number} listIndent
 */
function pushListIndex(stack, listIndexes, listIndent) {
  const parentKey = formatYamlPath(stack);
  const listKey = `${parentKey}@${listIndent}`;
  const idx = listIndexes.get(listKey) ?? 0;
  listIndexes.set(listKey, idx + 1);
  stack.push({ indent: listIndent, part: `[${idx}]` });
}

/**
 * @param {{ indent: number, part: string }[]} stack
 * @returns {string}
 */
function formatYamlPath(stack) {
  let out = '';
  for (const { part } of stack) {
    if (part.startsWith('[')) {
      out += part;
    } else {
      out += (out ? '.' : '') + part;
    }
  }
  return out;
}
