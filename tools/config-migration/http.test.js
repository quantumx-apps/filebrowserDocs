import test from 'node:test';
import assert from 'node:assert/strict';
import { transformHttp } from './transforms/http.js';

test('transformHttp moves server.externalUrl and trustedHeaders to http', () => {
  /** @type {Record<string, unknown>} */
  const config = {
    server: {
      externalUrl: 'https://files.example.com',
      trustedHeaders: ['X-Forwarded-Proto', 'X-Forwarded-Host'],
    },
  };
  const changes = [];
  const warnings = [];

  transformHttp(config, changes, warnings);

  assert.equal(config.http.externalUrl, 'https://files.example.com');
  assert.deepEqual(config.http.trustedHeaders, ['X-Forwarded-Proto', 'X-Forwarded-Host']);
  assert.equal(config.server.externalUrl, undefined);
  assert.equal(config.server.trustedHeaders, undefined);
  assert.equal(warnings.length, 0);
});

test('transformHttp warns when OIDC enabled without reverse-proxy trusted headers', () => {
  /** @type {Record<string, unknown>} */
  const config = {
    server: { port: 80 },
    auth: {
      methods: {
        oidc: { enabled: true, clientId: 'id', issuerUrl: 'https://idp.example.com' },
      },
    },
  };
  const changes = [];
  const warnings = [];

  transformHttp(config, changes, warnings);

  assert.equal(warnings.length, 1);
  assert.match(warnings[0], /OIDC is enabled/);
  assert.match(warnings[0], /X-Forwarded-Proto/);
});
