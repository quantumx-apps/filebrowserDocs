import test from 'node:test';
import assert from 'node:assert/strict';
import { transformDatabase } from './transforms/database.js';

test('transformDatabase adds migrateFrom default only when server.database is absent', () => {
  /** @type {Record<string, unknown>} */
  const config = {
    server: {
      sources: [{ path: '/srv', name: 'files' }],
    },
  };
  const changes = [];
  const warnings = [];

  transformDatabase(config, changes, warnings);

  const db = /** @type {{ migrateFrom?: string, path?: string }} */ (config.server.database);
  assert.equal(db.migrateFrom, 'default');
  assert.equal(db.path, undefined);
});

test('transformDatabase moves legacy database string to migrateFrom', () => {
  /** @type {Record<string, unknown>} */
  const config = {
    server: {
      database: 'data/database.db',
      sources: [{ path: '/srv', name: 'files' }],
    },
  };
  const changes = [];
  const warnings = [];

  transformDatabase(config, changes, warnings);

  const db = /** @type {{ migrateFrom?: string, path?: string }} */ (config.server.database);
  assert.equal(db.migrateFrom, 'data/database.db.old');
  assert.equal(db.path, 'data/filebrowser.sqlite');
});
