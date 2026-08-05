import test from 'node:test';
import assert from 'node:assert/strict';
import { transformHttp } from './transforms/http.js';

test('transformHttp moves server.externalUrl and converts trustedHeaders to trustProxyHeaders', () => {
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
  assert.equal(config.http.trustProxyHeaders, true);
  assert.equal(config.http.trustedHeaders, undefined);
  assert.equal(config.server.externalUrl, undefined);
  assert.equal(config.server.trustedHeaders, undefined);
});

test('transformHttp warns when OIDC enabled without trustProxyHeaders', () => {
  const config = {
    server: { port: 8080 },
    auth: {
      methods: {
        oidc: { enabled: true },
      },
    },
  };
  const warnings = [];

  transformHttp(config, [], warnings);

  assert.match(warnings.join(' '), /trustProxyHeaders/);
});
