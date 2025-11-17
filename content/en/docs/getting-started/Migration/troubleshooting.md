---
title: "Troubleshooting"
description: "Common issues and solutions for migration"
icon: "bug_report"
---

Common issues and solutions for migration.

## Database Migration Issues

**Permission denied**: Ensure the database file has correct ownership and permissions.

**Fatal error creating tmp directory**: Configure `server.cacheDir` in your config file and ensure filesystem permissions match.

**Database locked**: Ensure original FileBrowser instance is stopped.

## User Migration Issues

**Can't log in with old credentials**: Verify database migration was successful and database file has correct permissions. You can also {{< doclink path="reference/cli/#password-reset" text="reset via CLI" />}} if needed.

## Next Steps

- {{< doclink path="getting-started/migration/users/" text="User migration" />}}
- {{< doclink path="getting-started/migration/configuration/" text="Configuration migration" />}}