---
title: "Troubleshooting"
description: "Common issues and solutions for migration"
icon: "bug_report"
---

Common issues and solutions for migration.

## Database Migration Issues

**Permission denied**: Ensure the database file has correct ownership and permissions.

**Fatal error creating tmp directory**: Configure `server.cacheDir` in your config file.

**Database locked**: Ensure original FileBrowser instance is stopped.

## User Migration Issues

**Can't log in with old credentials**: Verify database migration was successful and database file has correct permissions.

**User permissions not working**: Check `userDefaults` in config.yaml doesn't override individual user settings.

**2FA blocking access**: Disable 2FA temporarily by updating user in database or via API.

## Next Steps

- {{< doclink path="getting-started/migration/database/" text="Database migration" />}}
- {{< doclink path="getting-started/migration/users/" text="User migration" />}}
- {{< doclink path="getting-started/migration/configuration/" text="Configuration migration" />}}