import yaml from 'https://cdn.jsdelivr.net/npm/js-yaml@4.1.0/+esm';
import {
  deepClone,
  normalizeYamlForParse,
  ensureAnchorStubs,
  usesYamlAnchorsOrAliases,
  anchorProtectedTopLevelKeys,
  missingAnchorNames,
} from './utils.js';
import { transformDatabase } from './transforms/database.js';
import { transformHttp } from './transforms/http.js';
import { transformUserDefaults } from './transforms/userDefaults.js';
import { transformSources } from './transforms/sources.js';
import { transformCleanup } from './transforms/cleanup.js';
import { emitYaml, emitYamlPreservingAnchors, setYamlDumper } from './emit.js';
import { buildLineHighlights, formatChangesSummary } from './annotate.js';

setYamlDumper((doc) =>
  yaml.dump(doc, {
    indent: 2,
    lineWidth: 120,
    noRefs: true,
    sortKeys: false,
    quotingType: '"',
    forceQuotes: true,
  }),
);

/**
 * @typedef {{ ok: true, yaml: string, changes: import('./annotate.js').Change[], warnings: string[], inputHighlights: string[], outputHighlights: string[] } | { ok: false, error: string }} MigrateResult
 */

/**
 * @param {string} raw
 * @returns {MigrateResult}
 */
export function migrateConfig(raw) {
  const trimmed = raw.trim();
  if (!trimmed) {
    return { ok: false, error: 'Paste a config.yaml on the left first.' };
  }

  /** @type {Record<string, unknown>} */
  let parsed;
  const preserveAnchors = usesYamlAnchorsOrAliases(trimmed);
  const protectedTopLevelKeys = preserveAnchors ? anchorProtectedTopLevelKeys(trimmed) : new Set();
  const transformOptions = { protectedTopLevelKeys };
  const normalized = normalizeYamlForParse(ensureAnchorStubs(trimmed));
  try {
    parsed = yaml.load(normalized);
  } catch (err) {
    const message = err instanceof Error ? err.message : String(err);
    return { ok: false, error: `YAML parse error: ${message}` };
  }

  if (!parsed || typeof parsed !== 'object' || Array.isArray(parsed)) {
    return { ok: false, error: 'Config root must be a YAML mapping (object).' };
  }

  /** @type {import('./annotate.js').Change[]} */
  const changes = [];
  /** @type {string[]} */
  const warnings = [];

  const config = deepClone(parsed);
  for (const stubKey of missingAnchorNames(trimmed)) {
    delete config[stubKey];
  }
  transformDatabase(config, changes, warnings, transformOptions);
  transformHttp(config, changes, transformOptions);
  const { filePerms, filePermsConfigured } = transformUserDefaults(config, changes);
  transformSources(config, filePerms, filePermsConfigured, changes, warnings);
  transformCleanup(config, changes, warnings);

  const outputYaml =
    preserveAnchors && protectedTopLevelKeys.size > 0
      ? emitYamlPreservingAnchors(trimmed, config, protectedTopLevelKeys)
      : emitYaml(config);
  const inputHighlights = buildLineHighlights(trimmed, changes, 'input');
  const outputHighlights = buildLineHighlights(outputYaml, changes, 'output');

  if (config.http && !parsed.http) {
    // ensure http top-level line is highlighted when newly created
    const httpLine = outputHighlights.findIndex((_, i) => outputYaml.split('\n')[i]?.match(/^\s*http\s*:/));
    if (httpLine >= 0 && !outputHighlights[httpLine]) {
      outputHighlights[httpLine] = 'hl-added';
    }
  }

  return {
    ok: true,
    yaml: outputYaml,
    changes,
    warnings,
    inputHighlights,
    outputHighlights,
    summary: formatChangesSummary(changes),
  };
}

export { formatChangesSummary };
