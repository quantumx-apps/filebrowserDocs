import { SERVER_HTTP_KEYS } from '../constants.js';
import { serverToHttpHighlight, authToHttpHighlight } from '../highlight-map.js';
import { recordChange, recordRelocation } from '../utils.js';

/**
 * @param {Record<string, unknown>} config
 * @param {Array<{action: string, path: string, inputKey?: string, outputKey?: string, inputPath?: string, outputPath?: string}>} changes
 * @param {{ protectedTopLevelKeys?: Set<string> }} [options]
 */
export function transformHttp(config, changes, options = {}) {
  const protectedKeys = options.protectedTopLevelKeys;
  if (protectedKeys?.has('http') || protectedKeys?.has('server')) {
    return;
  }

  if (!config.server || typeof config.server !== 'object') {
    return;
  }

  const server = /** @type {Record<string, unknown>} */ (config.server);

  const hadHttpBlock =
    config.http &&
    typeof config.http === 'object' &&
    !Array.isArray(config.http) &&
    Object.keys(config.http).length > 0;

  if (!config.http || typeof config.http !== 'object' || Array.isArray(config.http)) {
    config.http = {};
  }
  const http = /** @type {Record<string, unknown>} */ (config.http);

  for (const key of SERVER_HTTP_KEYS) {
    if (server[key] !== undefined) {
      if (http[key] === undefined) {
        http[key] = server[key];
        recordRelocation(changes, `http.${key}`, serverToHttpHighlight(key));
      }
      delete server[key];
    }
  }

  if (config.auth && typeof config.auth === 'object' && !Array.isArray(config.auth)) {
    const auth = /** @type {Record<string, unknown>} */ (config.auth);
    if (auth.disableRateLimit !== undefined) {
      if (http.disableRateLimit === undefined) {
        http.disableRateLimit = auth.disableRateLimit;
        recordRelocation(changes, 'http.disableRateLimit', authToHttpHighlight('disableRateLimit'));
      }
      delete auth.disableRateLimit;
    }
  }

  if (!hadHttpBlock && Object.keys(http).length > 0) {
    recordChange(changes, 'added', 'http', { outputPath: 'http', outputKey: 'http' });
  }
}
