import { SERVER_HTTP_KEYS } from '../constants.js';
import { serverToHttpHighlight, authToHttpHighlight } from '../highlight-map.js';
import { recordChange, recordRelocation } from '../utils.js';

/**
 * @param {Record<string, unknown>} config
 * @param {Array<{action: string, path: string, inputKey?: string, outputKey?: string, inputPath?: string, outputPath?: string}>} changes
 * @param {string[]} warnings
 * @param {{ protectedTopLevelKeys?: Set<string> }} [options]
 */
export function transformHttp(config, changes, warnings, options = {}) {
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

  migrateTrustedHeadersToTrustProxy(http, server, changes, warnings);

  if (!hadHttpBlock && Object.keys(http).length > 0) {
    recordChange(changes, 'added', 'http', { outputPath: 'http', outputKey: 'http' });
  }

  emitOidcTrustProxyHeadersWarnings(config, http, warnings);
}

/**
 * v1.5.x used http.trustedHeaders (or server.trustedHeaders) as a string list.
 * v2.0.0+ uses http.trustProxyHeaders: true instead.
 *
 * @param {Record<string, unknown>} http
 * @param {Record<string, unknown>} server
 * @param {Array<{action: string, path: string, inputKey?: string, outputKey?: string, inputPath?: string, outputPath?: string}>} changes
 * @param {string[]} warnings
 */
function migrateTrustedHeadersToTrustProxy(http, server, changes, warnings) {
  let legacy = http.trustedHeaders;
  if (legacy === undefined && server.trustedHeaders !== undefined) {
    legacy = server.trustedHeaders;
    delete server.trustedHeaders;
  }
  if (legacy === undefined) {
    return;
  }

  const hadEntries = Array.isArray(legacy) && legacy.length > 0;
  if (hadEntries && http.trustProxyHeaders === undefined) {
    http.trustProxyHeaders = true;
    recordChange(changes, 'replaced', 'http.trustProxyHeaders', {
      inputPath: 'http.trustedHeaders',
      inputKey: 'trustedHeaders',
      outputPath: 'http.trustProxyHeaders',
      outputKey: 'trustProxyHeaders',
    });
  }

  delete http.trustedHeaders;

  if (hadEntries) {
    warnings.push(
      'http.trustedHeaders (v1.5.x) was replaced with http.trustProxyHeaders: true. Remove any leftover trustedHeaders entries from v2 configs.',
    );
  }
}

/**
 * @param {Record<string, unknown>} config
 * @param {Record<string, unknown>} http
 * @param {string[]} warnings
 */
function emitOidcTrustProxyHeadersWarnings(config, http, warnings) {
  if (!isOidcEnabled(config)) {
    return;
  }

  if (http.trustProxyHeaders !== true) {
    warnings.push(
      'OIDC is enabled but http.trustProxyHeaders is not true. Set trustProxyHeaders: true when FileBrowser sits behind HTTPS termination (fixes http:// redirect_uri behind nginx).',
    );
  }
}

/**
 * @param {Record<string, unknown>} config
 */
function isOidcEnabled(config) {
  if (!config.auth || typeof config.auth !== 'object' || Array.isArray(config.auth)) {
    return false;
  }
  const auth = /** @type {Record<string, unknown>} */ (config.auth);
  if (!auth.methods || typeof auth.methods !== 'object' || Array.isArray(auth.methods)) {
    return false;
  }
  const methods = /** @type {Record<string, unknown>} */ (auth.methods);
  const oidc = methods.oidc;
  if (!oidc || typeof oidc !== 'object' || Array.isArray(oidc)) {
    return false;
  }
  return /** @type {{ enabled?: boolean }} */ (oidc).enabled === true;
}
