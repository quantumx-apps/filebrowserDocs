import {
  REMOVED_INTEGRATION_KEYS,
  DEPRECATED_SOURCE_CONFIG_KEYS,
  DEPRECATED_RULE_KEYS,
  VALID_TOP_LEVEL_KEYS,
  FLAT_USER_DEFAULTS_MAP,
  FILE_PERMISSION_KEYS,
} from '../constants.js';
import { recordChange } from '../utils.js';

/**
 * @param {Record<string, unknown>} config
 * @param {Array<{action: string, path: string, lineKey: string}>} changes
 * @param {string[]} warnings
 */
export function transformCleanup(config, changes, warnings) {
  for (const key of Object.keys(config)) {
    if (!VALID_TOP_LEVEL_KEYS.has(key)) {
      warnings.push(`Unknown top-level key "${key}" — review manually (v2 may reject unknown fields).`);
    }
  }

  if (config.integrations && typeof config.integrations === 'object' && !Array.isArray(config.integrations)) {
    const integrations = /** @type {Record<string, unknown>} */ (config.integrations);
    if (integrations.media && typeof integrations.media === 'object' && !Array.isArray(integrations.media)) {
      const media = /** @type {Record<string, unknown>} */ (integrations.media);
      for (const key of REMOVED_INTEGRATION_KEYS) {
        if (media[key] !== undefined) {
          recordChange(changes, 'removed', `integrations.media.${key}`, {
            inputPath: `integrations.media.${key}`,
            inputKey: key,
          });
          delete media[key];
        }
      }
    }
  }

  if (config.server && typeof config.server === 'object' && !Array.isArray(config.server)) {
    const server = /** @type {Record<string, unknown>} */ (config.server);
    const sources = server.sources;
    if (Array.isArray(sources)) {
      for (const source of sources) {
        if (!source || typeof source !== 'object') {
          continue;
        }
        const src = /** @type {Record<string, unknown>} */ (source);
        if (!src.config || typeof src.config !== 'object') {
          continue;
        }
        const cfg = /** @type {Record<string, unknown>} */ (src.config);
        for (const depKey of DEPRECATED_SOURCE_CONFIG_KEYS) {
          if (cfg[depKey] !== undefined) {
            if (depKey !== 'conditionals') {
              recordChange(changes, 'removed', `server.sources[].config.${depKey}`, {
                inputPath: `server.sources[].config.${depKey}`,
                inputKey: depKey,
              });
            }
            delete cfg[depKey];
          }
        }
        if (Array.isArray(cfg.rules)) {
          for (const rule of cfg.rules) {
            if (!rule || typeof rule !== 'object') {
              continue;
            }
            const r = /** @type {Record<string, unknown>} */ (rule);
            for (const depKey of DEPRECATED_RULE_KEYS) {
              if (r[depKey] !== undefined) {
                delete r[depKey];
              }
            }
          }
        }
        stripConfiguredUnlessDenyAll(cfg);
      }
    }
  }

  stripConsumedFlatUserDefaults(config, changes);
}

/**
 * Remove internal `configured` marker unless all file permissions are explicitly false (deny-all).
 * @param {Record<string, unknown>} cfg
 */
function stripConfiguredUnlessDenyAll(cfg) {
  if (!cfg.defaultPermissions || typeof cfg.defaultPermissions !== 'object' || Array.isArray(cfg.defaultPermissions)) {
    return;
  }
  const perms = /** @type {Record<string, unknown>} */ (cfg.defaultPermissions);
  const denyAll = FILE_PERMISSION_KEYS.every((key) => perms[key] === false);
  if (!denyAll) {
    delete perms.configured;
  }
}

/**
 * @param {Record<string, unknown>} config
 * @param {Array<{action: string, path: string, lineKey: string}>} changes
 */
function stripConsumedFlatUserDefaults(config, changes) {
  if (!config.userDefaults || typeof config.userDefaults !== 'object' || Array.isArray(config.userDefaults)) {
    return;
  }
  const ud = /** @type {Record<string, unknown>} */ (config.userDefaults);

  for (const flatKey of Object.keys(FLAT_USER_DEFAULTS_MAP)) {
    if (ud[flatKey] !== undefined) {
      delete ud[flatKey];
    }
  }

  const removeKeys = ['permissions', 'preview', 'fileLoading', 'loginMethod'];
  for (const key of removeKeys) {
    if (ud[key] !== undefined) {
      delete ud[key];
    }
  }

  stripInvalidAccountPermissions(ud, changes);
}

/**
 * Remove file-scoped permission keys that must live on source defaultPermissions only.
 * @param {Record<string, unknown>} ud
 * @param {Array<{action: string, path: string, lineKey: string}>} changes
 */
function stripInvalidAccountPermissions(ud, changes) {
  if (!ud.account || typeof ud.account !== 'object' || Array.isArray(ud.account)) {
    return;
  }
  const account = /** @type {Record<string, unknown>} */ (ud.account);
  if (!account.permissions || typeof account.permissions !== 'object' || Array.isArray(account.permissions)) {
    return;
  }
  const permissions = /** @type {Record<string, unknown>} */ (account.permissions);
  for (const key of FILE_PERMISSION_KEYS) {
    if (permissions[key] === undefined) {
      continue;
    }
    recordChange(changes, 'removed', `userDefaults.account.permissions.${key}`, {
      inputPath: `userDefaults.account.permissions.${key}`,
      inputKey: key,
    });
    delete permissions[key];
  }
  if (Object.keys(permissions).length === 0) {
    delete account.permissions;
  }
  if (Object.keys(account).length === 0) {
    delete ud.account;
  }
}
