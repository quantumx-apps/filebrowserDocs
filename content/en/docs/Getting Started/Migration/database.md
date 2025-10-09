---
title: "Database Migration"
description: "Migrate your FileBrowser database"
icon: "storage"
---

Step-by-step guide for migrating your database from original FileBrowser.

## Prerequisites

- Backup your original database file
- Stop the original FileBrowser instance
- Have FileBrowser Quantum configuration ready

## Migration Steps

### 1. Locate Original Database

Find your original FileBrowser database file (typically `filebrowser.db`):

```bash
# Common locations
~/.filebrowser/filebrowser.db
/var/lib/filebrowser/filebrowser.db
./database/filebrowser.db
```

### 2. Backup Database

**Always create a backup before migration:**

```bash
cp /path/to/filebrowser.db /path/to/filebrowser.db.backup
```

### 3. Copy Database

Copy the database to your FileBrowser Quantum data directory:

```bash
cp /path/to/filebrowser.db /path/to/quantum/database/database.db
```

### 4. Update Configuration

Update `config.yaml` to point to the database:

```yaml
server:
  database: "/database/database.db"
  cacheDir: "/tmp/filebrowser"  # Required in Quantum
```

### 5. Set Permissions

Ensure proper permissions:

```bash
chown filebrowser:filebrowser /path/to/quantum/database/database.db
chmod 644 /path/to/quantum/database/database.db
```

### 6. Start FileBrowser Quantum

```bash
filebrowser -c config.yaml
```

Or with Docker:

```bash
docker-compose up -d
```

## Verification

After migration, verify:

1. You can log in with existing credentials
2. User accounts are preserved
3. File permissions work correctly
4. Sources are accessible

## Troubleshooting

For common issues and solutions, see the {{< doclink path="getting-started/migration/troubleshooting/" text="Troubleshooting guide" />}}.

## Things that won't work on successful migration

* share links (need to be re-created)
* branding (needs to be re-created)
* theme (needs to be re-created)
* Rules
* Runners

The filebrowser Quantum application should run with the same users
you have from the original. But keep in mind the differences that may not work 
the same way, but all user configuration should be available.

## Migrating back to original 

You cannot migrate back. Make sure you have a backup.

## Next Steps

- {{< doclink path="configuration/server/" text="Configure cache directory" />}}
- {{< doclink path="shares/" text="Recreate shares" />}}
- {{< doclink path="configuration/frontend/branding/" text="Recreate branding" />}}

