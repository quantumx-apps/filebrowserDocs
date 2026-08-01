import { recordChange, sqlitePathsFromLegacyDatabase } from '../utils.js';

const MIGRATE_FROM_DEFAULT = 'default';

/**
 * @param {Record<string, unknown>} config
 * @param {Array<{action: string, path: string, inputKey?: string, outputKey?: string, inputPath?: string, outputPath?: string}>} changes
 * @param {string[]} warnings
 * @param {{ protectedTopLevelKeys?: Set<string> }} [options]
 */
export function transformDatabase(config, changes, warnings, options = {}) {
  if (options.protectedTopLevelKeys?.has('server')) {
    return;
  }

  if (!config.server || typeof config.server !== 'object') {
    return;
  }

  const server = /** @type {Record<string, unknown>} */ (config.server);
  const db = server.database;

  if (typeof db === 'string') {
    const { path, migrateFrom } = sqlitePathsFromLegacyDatabase(db);
    server.database = { path, migrateFrom };
    recordChange(changes, 'removed', 'server.database', {
      inputPath: 'server.database',
      inputKey: 'database',
    });
    recordChange(changes, 'added', 'server.database', {
      outputPath: 'server.database',
      outputKey: 'database',
    });
    recordChange(changes, 'added', 'server.database.path', {
      outputPath: 'server.database.path',
      outputKey: 'path',
    });
    recordChange(changes, 'added', 'server.database.migrateFrom', {
      outputPath: 'server.database.migrateFrom',
      outputKey: 'migrateFrom',
    });
    warnings.push(
      'Renamed BoltDB path for migration: set migrateFrom to your renamed file (e.g. database.db.old) on disk before first v2 start.',
    );
    return;
  }

  if (db && typeof db === 'object' && !Array.isArray(db)) {
    const dbObj = /** @type {Record<string, unknown>} */ (db);
    if (!dbObj.path) {
      dbObj.path = 'filebrowser.sqlite';
      recordChange(changes, 'added', 'server.database.path', {
        outputPath: 'server.database.path',
        outputKey: 'path',
      });
    }
    if (dbObj.migrateFrom === undefined || dbObj.migrateFrom === '') {
      dbObj.migrateFrom = MIGRATE_FROM_DEFAULT;
      recordChange(changes, 'added', 'server.database.migrateFrom', {
        outputPath: 'server.database.migrateFrom',
        outputKey: 'migrateFrom',
      });
    }
    return;
  }

  server.database = { migrateFrom: MIGRATE_FROM_DEFAULT };
  recordChange(changes, 'added', 'server.database', {
    outputPath: 'server.database',
    outputKey: 'database',
  });
  recordChange(changes, 'added', 'server.database.migrateFrom', {
    outputPath: 'server.database.migrateFrom',
    outputKey: 'migrateFrom',
  });
  warnings.push(
    'Added server.database.migrateFrom: "default". v2 uses FILEBROWSER_DATABASE or database.db on first start.',
  );
}
