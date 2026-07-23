import {
  REMOVED_RULE_KEYS,
  CONDITIONALS_GLOBAL_KEYS,
} from '../constants.js';
import { renamedRuleFieldHighlight } from '../highlight-map.js';
import { recordChange, recordRelocation } from '../utils.js';

/**
 * @param {Record<string, unknown>} config
 * @param {Record<string, boolean>} filePerms
 * @param {boolean} filePermsConfigured
 * @param {Array<{action: string, path: string, inputKey?: string, outputKey?: string, inputPath?: string, outputPath?: string}>} changes
 * @param {string[]} warnings
 */
export function transformSources(config, filePerms, filePermsConfigured, changes, warnings) {
  if (!config.server || typeof config.server !== 'object') {
    return;
  }

  const server = /** @type {Record<string, unknown>} */ (config.server);
  const sources = server.sources;
  if (!Array.isArray(sources)) {
    return;
  }

  for (let i = 0; i < sources.length; i++) {
    const source = sources[i];
    if (!source || typeof source !== 'object') {
      continue;
    }
    const src = /** @type {Record<string, unknown>} */ (source);
    if (!src.config || typeof src.config !== 'object' || Array.isArray(src.config)) {
      src.config = {};
    }
    const cfg = /** @type {Record<string, unknown>} */ (src.config);

    const rulesFromConditionals = hoistConditionalsRules(cfg, changes, i);
    if (Array.isArray(cfg.rules)) {
      cfg.rules = migrateRulesArray(cfg.rules, changes, warnings, rulesFromConditionals);
    }

    if (!cfg.defaultPermissions || typeof cfg.defaultPermissions !== 'object') {
      cfg.defaultPermissions = { ...filePerms };
      if (filePermsConfigured) {
        cfg.defaultPermissions.configured = true;
      }
      recordChange(changes, 'added', `server.sources[${i}].config.defaultPermissions`, {
        outputPath: 'server.sources[].config.defaultPermissions',
        outputKey: 'defaultPermissions',
      });
      if (filePermsConfigured) {
        recordChange(changes, 'added', `server.sources[${i}].config.defaultPermissions.configured`, {
          outputPath: 'server.sources[].config.defaultPermissions.configured',
          outputKey: 'configured',
        });
      }
    }
  }
}

/**
 * @param {Record<string, unknown>} cfg
 * @param {Array<{action: string, path: string, inputKey?: string, outputKey?: string, inputPath?: string, outputPath?: string}>} changes
 * @param {number} sourceIndex
 * @returns {boolean}
 */
function hoistConditionalsRules(cfg, changes, sourceIndex) {
  if (!cfg.conditionals || typeof cfg.conditionals !== 'object' || Array.isArray(cfg.conditionals)) {
    return false;
  }

  const cond = /** @type {Record<string, unknown>} */ (cfg.conditionals);
  const fromCond = Array.isArray(cond.rules) ? cond.rules : [];
  const existing = Array.isArray(cfg.rules) ? cfg.rules : [];
  let hoistedRules = false;

  if (fromCond.length > 0) {
    cfg.rules = existing.length > 0 ? [...existing, ...fromCond] : fromCond;
    hoistedRules = true;
    recordRelocation(changes, `server.sources[${sourceIndex}].config.rules`, {
      inputPath: 'server.sources[].config.conditionals.rules',
      outputPath: 'server.sources[].config.rules',
      inputKey: 'rules',
      outputKey: 'rules',
    });
  }

  /** @type {Record<string, unknown>} */
  const globalRule = { folderPath: '/' };
  let hasGlobal = false;

  for (const key of CONDITIONALS_GLOBAL_KEYS) {
    if (cond[key] === undefined) {
      continue;
    }
    if (key === 'hidden') {
      globalRule.ignoreHidden = Boolean(cond[key]);
      recordRelocation(
        changes,
        `server.sources[${sourceIndex}].config.rules[].ignoreHidden`,
        renamedRuleFieldHighlight('hidden', 'ignoreHidden', 'server.sources[].config.conditionals'),
      );
      hasGlobal = true;
      continue;
    }
    globalRule[key] = cond[key];
    recordRelocation(changes, `server.sources[${sourceIndex}].config.rules[].${key}`, {
      inputPath: `server.sources[].config.conditionals.${key}`,
      outputPath: `server.sources[].config.rules[].${key}`,
      inputKey: key,
      outputKey: key,
    });
    hasGlobal = true;
  }

  if (hasGlobal) {
    if (!Array.isArray(cfg.rules)) {
      cfg.rules = [];
    }
    cfg.rules.unshift(globalRule);
    if (!hoistedRules) {
      recordChange(changes, 'added', `server.sources[${sourceIndex}].config.rules`, {
        outputPath: 'server.sources[].config.rules',
        outputKey: 'rules',
      });
    }
  }

  recordChange(changes, 'removed', `server.sources[${sourceIndex}].config.conditionals`, {
    inputPath: 'server.sources[].config.conditionals',
    inputKey: 'conditionals',
  });

  return hoistedRules;
}

/**
 * @param {unknown[]} rules
 * @param {Array<{action: string, path: string, inputKey?: string, outputKey?: string, inputPath?: string, outputPath?: string}>} changes
 * @param {string[]} warnings
 * @param {boolean} rulesFromConditionals
 */
function migrateRulesArray(rules, changes, warnings, rulesFromConditionals) {
  /** @type {unknown[]} */
  const migrated = [];
  for (const rule of rules) {
    migrated.push(...migrateRule(rule, changes, warnings, rulesFromConditionals));
  }
  return migrated;
}

/**
 * @param {unknown} rule
 * @param {Array<{action: string, path: string, inputKey?: string, outputKey?: string, inputPath?: string, outputPath?: string}>} changes
 * @param {string[]} warnings
 * @param {boolean} rulesFromConditionals
 * @returns {unknown[]}
 */
function migrateRule(rule, changes, warnings, rulesFromConditionals) {
  if (!rule || typeof rule !== 'object' || Array.isArray(rule)) {
    return [rule];
  }

  const rulesPath = rulesFromConditionals
    ? 'server.sources[].config.conditionals.rules[]'
    : 'server.sources[].config.rules[]';

  const base = /** @type {Record<string, unknown>} */ ({ ...rule });

  for (const key of REMOVED_RULE_KEYS) {
    if (base[key] !== undefined) {
      recordChange(changes, 'removed', `server.sources[].config.rules.${key}`, {
        inputPath: `${rulesPath}.${key}`,
        inputKey: key,
      });
      delete base[key];
      warnings.push(
        `Removed rule field "${key}" — not valid in v2 config.rules (path access rules are managed via API/CLI, not config.yaml).`,
      );
    }
  }

  if (base.hidden !== undefined) {
    base.ignoreHidden = base.hidden;
    delete base.hidden;
    recordRelocation(
      changes,
      'server.sources[].config.rules.ignoreHidden',
      renamedRuleFieldHighlight('hidden', 'ignoreHidden', rulesPath),
    );
  }

  const fileNames = base.fileNames;
  const folderNames = base.folderNames;
  delete base.fileNames;
  delete base.folderNames;

  const fileNameList = toNameList(fileNames);
  const folderNameList = toNameList(folderNames);

  if (fileNames !== undefined) {
    recordRelocation(
      changes,
      'server.sources[].config.rules.fileName',
      renamedRuleFieldHighlight('fileNames', 'fileName', rulesPath),
    );
  }
  if (folderNames !== undefined) {
    recordRelocation(
      changes,
      'server.sources[].config.rules.folderName',
      renamedRuleFieldHighlight('folderNames', 'folderName', rulesPath),
    );
  }

  if (fileNameList.length === 0 && folderNameList.length === 0) {
    return [base];
  }

  const names = fileNameList.length > 0 ? fileNameList : [undefined];
  const folders = folderNameList.length > 0 ? folderNameList : [undefined];
  /** @type {Record<string, unknown>[]} */
  const expanded = [];

  for (const fileName of names) {
    for (const folderName of folders) {
      const next = { ...base };
      if (fileName !== undefined) {
        next.fileName = fileName;
      }
      if (folderName !== undefined) {
        next.folderName = folderName;
      }
      expanded.push(next);
    }
  }

  return expanded;
}

/**
 * @param {unknown} value
 * @returns {string[]}
 */
function toNameList(value) {
  if (value === undefined || value === null) {
    return [];
  }
  if (Array.isArray(value)) {
    return value.map((item) => String(item));
  }
  return [String(value)];
}
