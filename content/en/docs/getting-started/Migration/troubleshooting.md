---
title: "Troubleshooting"
description: "Common issues and solutions for migration"
icon: "bug_report"
date: "2025-10-08T14:59:30Z"
lastmod: "2026-07-23T17:03:27Z"
---

Common issues and solutions for migration.

{{% alert context="info" %}}
**Upgrading to v2.0.0?** See the {{< doclink path="getting-started/v2/migration/" text="v2 migration guide" />}} for the full upgrade process and rollback policy before troubleshooting individual issues.
{{% /alert %}}

## Database Migration Issues

**Permission denied**: Ensure the database file has correct ownership and permissions.

**Fatal error creating tmp directory**: Configure `server.cacheDir` in your config file and ensure filesystem permissions match.

**Database locked**: Ensure original FileBrowser instance is stopped.

## User Migration Issues

**Can't log in with old credentials**: Verify database migration was successful and database file has correct permissions. You can also {{< doclink path="reference/cli/#password-reset" text="reset via CLI" />}} if needed.

## Permission changes (v2.0.0+)

{{% alert context="warning" title="v2.0.0 behavior change" %}}
File-operation permissions (**view**, **download**, **modify**, **create**, **delete**) moved from **global user permissions** to **per-source scopes**. Global permissions are now **admin**, **api**, **share**, and **realtime** only. **`view` is new in v2.0.0** — in v1.x, listing and browsing a source was always allowed; you can now deny **view** independently of **download**.
{{% /alert %}}

**Symptoms after upgrade:**

- WebDAV connects but folders are empty or files won't open — user may have **view** without **download**, or lack **view** on that source.
- User can browse but cannot upload/delete — check **modify**, **create**, or **delete** on the **specific source** in User Management, not only global flags.
- API scripts that create users with top-level `modify` / `create` / `delete` — update payloads to use `scopes[].permissions` (see {{< doclink path="configuration/users/" text="User Management" />}}).
- Init scripts or `userDefaults` still list modify/create/delete — those values now apply as **defaults for new scopes**, not as ongoing global enforcement.

**What migration does:** Existing global file permissions are copied onto each user scope during database migration. Review scopes in **User Management** after upgrading — especially users with multiple sources, API tokens used for WebDAV, and automation that assumed global modify/delete.

## Next Steps

- {{< doclink path="getting-started/migration/configuration/" text="Configuration migration" />}}