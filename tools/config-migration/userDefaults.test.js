import test from 'node:test';
import assert from 'node:assert/strict';
import { transformUserDefaults } from './transforms/userDefaults.js';
import { transformSources } from './transforms/sources.js';
import { transformCleanup } from './transforms/cleanup.js';
import { FILE_PERMISSION_KEYS, GLOBAL_PERMISSION_KEYS } from './constants.js';

function migrateUserDefaultsSection(config) {
  const changes = [];
  const warnings = [];
  const { filePerms, filePermsConfigured } = transformUserDefaults(config, changes);
  transformSources(config, filePerms, filePermsConfigured, changes, warnings);
  transformCleanup(config, changes, warnings);
  return { config, changes, warnings };
}

test('transformUserDefaults relocates file permissions to source defaultPermissions', () => {
  /** @type {Record<string, unknown>} */
  const config = {
    userDefaults: {
      permissions: {
        admin: true,
        share: false,
        modify: true,
        view: false,
        download: true,
      },
    },
    server: {
      sources: [{ path: '/srv', name: 'files', config: { defaultEnabled: true } }],
    },
  };

  migrateUserDefaultsSection(config);

  const ud = /** @type {Record<string, unknown>} */ (config.userDefaults);
  const account = /** @type {{ permissions?: Record<string, unknown> }} */ (ud.account);
  assert.equal(account?.permissions?.admin, true);
  assert.equal(account?.permissions?.share, false);
  assert.equal(ud.permissions, undefined);

  for (const key of FILE_PERMISSION_KEYS) {
    assert.equal(account?.permissions?.[key], undefined, `expected no ${key} on account.permissions`);
  }

  const source = /** @type {{ config: { defaultPermissions: Record<string, boolean> } }} */ (
    /** @type {{ sources: unknown[] }} */ (config.server).sources[0]
  );
  assert.equal(source.config.defaultPermissions.modify, true);
  assert.equal(source.config.defaultPermissions.view, false);
  assert.equal(source.config.defaultPermissions.download, true);
});

test('transformCleanup strips stale file permission keys from account.permissions', () => {
  /** @type {Record<string, unknown>} */
  const config = {
    userDefaults: {
      account: {
        permissions: {
          admin: true,
          modify: true,
          view: false,
        },
      },
      listing: {
        showHidden: true,
      },
    },
    server: {
      sources: [{ path: '/srv', name: 'files', config: {} }],
    },
  };
  const changes = [];
  const warnings = [];

  transformCleanup(config, changes, warnings);

  const ud = /** @type {Record<string, unknown>} */ (config.userDefaults);
  const account = /** @type {{ permissions?: Record<string, unknown> }} */ (ud.account);
  assert.equal(account?.permissions?.admin, true);
  for (const key of FILE_PERMISSION_KEYS) {
    assert.equal(account?.permissions?.[key], undefined, `expected no ${key} on account.permissions`);
  }
  assert.ok(
    changes.some((change) => change.path === 'userDefaults.account.permissions.modify'),
    'expected cleanup to record removed modify permission',
  );
});

test('transformUserDefaults keeps global permission keys on account.permissions', () => {
  /** @type {Record<string, unknown>} */
  const config = {
    userDefaults: {
      permissions: {
        admin: true,
        api: true,
        realtime: false,
        share: true,
      },
    },
    server: {
      sources: [{ path: '/srv', name: 'files', config: {} }],
    },
  };

  migrateUserDefaultsSection(config);

  const ud = /** @type {Record<string, unknown>} */ (config.userDefaults);
  const account = /** @type {{ permissions?: Record<string, unknown> }} */ (ud.account);
  for (const key of GLOBAL_PERMISSION_KEYS) {
    if (key === 'realtime') {
      assert.equal(account?.permissions?.[key], false);
      continue;
    }
    assert.equal(account?.permissions?.[key], true, `expected global key ${key}`);
  }
});
