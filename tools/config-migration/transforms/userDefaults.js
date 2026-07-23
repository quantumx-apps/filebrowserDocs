import {
  FLAT_USER_DEFAULTS_MAP,
  PREVIEW_SUBFIELD_MAP,
  FILE_LOADING_KEYS,
  GLOBAL_PERMISSION_KEYS,
  FILE_PERMISSION_KEYS,
} from '../constants.js';
import {
  userDefaultsMoveHighlight,
  previewSubfieldHighlight,
} from '../highlight-map.js';
import { setByPath, recordChange, recordRelocation } from '../utils.js';

/**
 * Extract file permission defaults before restructuring userDefaults.
 * @param {Record<string, unknown>|undefined} ud
 * @returns {{ perms: Record<string, boolean>, configured: boolean }}
 */
export function extractFilePermissionDefaults(ud) {
  const perms = {
    view: true,
    modify: false,
    create: false,
    delete: false,
    download: false,
  };
  let configured = false;

  if (!ud || typeof ud !== 'object') {
    return { perms, configured };
  }

  const permissions = ud.permissions;
  if (!permissions || typeof permissions !== 'object' || Array.isArray(permissions)) {
    return { perms, configured };
  }

  const p = /** @type {Record<string, unknown>} */ (permissions);
  for (const key of FILE_PERMISSION_KEYS) {
    if (key === 'view') {
      if (p.view !== undefined) {
        perms.view = Boolean(p.view);
        configured = true;
      }
      continue;
    }
    if (p[key] !== undefined) {
      perms[key] = Boolean(p[key]);
      configured = true;
    }
  }

  return { perms, configured };
}

/**
 * @param {Record<string, unknown>} config
 * @param {Array<{action: string, path: string, inputKey?: string, outputKey?: string}>} changes
 * @returns {{ filePerms: Record<string, boolean>, filePermsConfigured: boolean }}
 */
export function transformUserDefaults(config, changes) {
  const empty = { filePerms: extractFilePermissionDefaults(undefined).perms, filePermsConfigured: false };

  if (!config.userDefaults || typeof config.userDefaults !== 'object' || Array.isArray(config.userDefaults)) {
    return empty;
  }

  const oldUd = /** @type {Record<string, unknown>} */ (config.userDefaults);
  const fileExtract = extractFilePermissionDefaults(oldUd);
  const next = deepMergeExistingNested(oldUd);

  for (const [flatKey, dotPath] of Object.entries(FLAT_USER_DEFAULTS_MAP)) {
    if (oldUd[flatKey] !== undefined) {
      setByPath(next, dotPath, oldUd[flatKey]);
      recordRelocation(changes, dotPath, userDefaultsMoveHighlight(flatKey, dotPath));
    }
  }

  if (oldUd.preview && typeof oldUd.preview === 'object' && !Array.isArray(oldUd.preview)) {
    const preview = /** @type {Record<string, unknown>} */ (oldUd.preview);
    for (const [subKey, dotPath] of Object.entries(PREVIEW_SUBFIELD_MAP)) {
      if (preview[subKey] !== undefined) {
        setByPath(next, dotPath, preview[subKey]);
        recordRelocation(changes, dotPath, previewSubfieldHighlight(subKey, dotPath));
      }
    }
    recordChange(changes, 'removed', 'userDefaults.preview', {
      inputPath: 'userDefaults.preview',
      inputKey: 'preview',
    });
  }

  if (oldUd.fileLoading && typeof oldUd.fileLoading === 'object' && !Array.isArray(oldUd.fileLoading)) {
    const fl = /** @type {Record<string, unknown>} */ (oldUd.fileLoading);
    if (!next.fileLoading || typeof next.fileLoading !== 'object') {
      next.fileLoading = {};
    }
    const target = /** @type {Record<string, unknown>} */ (next.fileLoading);
    let movedAny = false;
    for (const key of FILE_LOADING_KEYS) {
      if (fl[key] !== undefined) {
        target[key] = fl[key];
        recordRelocation(changes, `userDefaults.fileLoading.${key}`, {
          inputPath: `userDefaults.fileLoading.${key}`,
          outputPath: `userDefaults.fileLoading.${key}`,
          inputKey: key,
          outputKey: key,
        });
        movedAny = true;
      }
    }
    if (movedAny) {
      recordChange(changes, 'removed', 'userDefaults.fileLoading', {
        inputPath: 'userDefaults.fileLoading',
        inputKey: 'fileLoading',
      });
    }
  }

  if (oldUd.permissions && typeof oldUd.permissions === 'object' && !Array.isArray(oldUd.permissions)) {
    const p = /** @type {Record<string, unknown>} */ (oldUd.permissions);
    if (!next.account || typeof next.account !== 'object') {
      next.account = {};
    }
    if (!next.account.permissions || typeof next.account.permissions !== 'object') {
      next.account.permissions = {};
    }
    const ap = /** @type {Record<string, unknown>} */ (next.account.permissions);
    for (const key of GLOBAL_PERMISSION_KEYS) {
      if (p[key] !== undefined) {
        ap[key] = p[key];
        recordChange(changes, 'moved', `account.permissions.${key}`);
      }
    }
    for (const key of FILE_PERMISSION_KEYS) {
      if (p[key] !== undefined) {
        recordRelocation(changes, `server.sources[].config.defaultPermissions.${key}`, {
          inputPath: `userDefaults.permissions.${key}`,
          outputPath: `server.sources[].config.defaultPermissions.${key}`,
          inputKey: key,
          outputKey: key,
        });
      }
    }
    recordChange(changes, 'removed', 'userDefaults.permissions', {
      inputPath: 'userDefaults.permissions',
      inputKey: 'permissions',
    });
  }

  config.userDefaults = next;
  return { filePerms: fileExtract.perms, filePermsConfigured: fileExtract.configured };
}

/**
 * Keep existing v2 nested sections from input when already structured.
 * @param {Record<string, unknown>} oldUd
 */
function deepMergeExistingNested(oldUd) {
  const sections = ['sidebar', 'listing', 'preview', 'fileViewer', 'search', 'ui', 'fileLoading', 'account'];
  const next = {};
  for (const section of sections) {
    if (oldUd[section] !== undefined && typeof oldUd[section] === 'object' && !Array.isArray(oldUd[section])) {
      next[section] = structuredClone(oldUd[section]);
    }
  }
  return next;
}

/** Prefer structuredClone when available */
function structuredClone(value) {
  if (typeof globalThis.structuredClone === 'function') {
    return globalThis.structuredClone(value);
  }
  return JSON.parse(JSON.stringify(value));
}
