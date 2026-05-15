---
title: "Access Control Overview"
description: "User permissions, source access, and path-based access rules in FileBrowser Quantum"
icon: "security"
date: "2025-10-08T14:59:30Z"
lastmod: "2026-01-30T13:20:14Z"
order: 1
---

# Access control in FileBrowser Quantum

FileBrowser combines three separate ideas. Together they decide whether someone can see a source, open a path, and perform actions there:

1. **User permissions** — What the user is generally allowed to do in the app (for example admin, API usage, creating shares, modifying files). These apply **across** sources and are not tied to individual folders.
2. **Source-level access** — Whether the user even **has** a given source (scopes and defaults such as {{< doclink path="configuration/sources/" text="source configuration" />}}, including `defaultEnabled` and `denyByDefault`). This is **broad**: it gates the whole source or the user’s subtree under it, not individual paths inside the tree.
3. **Access control rules** — **Additional, path-specific** allow/deny rules for directories under a source, optionally scoped to users or groups. Use these when you need fine control (“this folder, for this user or group”) rather than changing global user capabilities or whole-source defaults.

Access rules are meant to refine **which paths** under a source are reachable once the user already has that source and sufficient **user permissions** for the action (read, modify, share, and so on).

{{% alert context="info" %}}
Access rules for shares apply based on the user that created the share.
{{% /alert %}}

{{% alert context="warning" %}}
FileBrowser Quantum access rules differ entirely from those in the original FileBrowser. Rules do not carry over when migrating from the legacy project and must be recreated.
{{% /alert %}}

**Keep reading this page** for how path-based rules are evaluated, how they combine with `denyByDefault`, and worked examples. For the full rule-type reference and precedence details, see {{< doclink path="access-control/rules/" text="Access rules" />}}.

## Source default behavior

A user's access to files depends on:

1. **User scope** — Users do not see or use a source until it is part of their scopes. New users can get sources automatically when {{< doclink path="configuration/sources#defaultenabled" text="defaultEnabled is true for that source" />}}, or an admin can assign sources in user management.
2. **`denyByDefault`** — With a source scope, paths are normally reachable unless the source sets `denyByDefault: true`. Then the user can still see that the source exists, but file access requires explicit **allow** rules for the paths they need.
3. **Access rules** — Per-path allow/deny (and deny-all) rules for users or groups, as described below.

## How access rules work

Directory-level control uses **allow** and **deny** rules attached to paths under a source. When someone accesses a file or directory, evaluation proceeds in this order:

1. **Direct path** — Rules that match the exact path are considered first.
2. **Parent paths** — If nothing applies directly, parent directories are walked toward the root until a matching rule appears or the tree ends.
3. **Default** — If no rule applies along that chain, access follows the source default (allow unless `denyByDefault` is enabled).

## Rule precedence and overriding

More specific paths override broader ones: a rule on `/folder/subfolder` wins over a rule on `/folder`.

**Allow** overrides **deny** when both would apply.

## Examples

### Example 1: Basic deny

- **Rule:** Deny user `graham` access to `/`.
- **Result:** `graham` cannot access any files or directories under that scope.

### Example 2: Overriding a deny with an allow

- **Rule 1:** Deny user `graham` access to `/`.
- **Rule 2:** Allow user `graham` access to `/subpath`.
- **Result:** `graham` can only use `/subpath` and its subdirectories.

### Example 3: Deny-all as a blacklist

- **Rule:** Deny-all on `/vip`.
- **Result:** No one can access `/vip` until an explicit **allow** rule overrides it for a given user or group.

## Configuration

Access rules are configured in the admin UI or via the API: per user or group, per directory, allow/deny/deny-all, with more specific paths overriding broader ones.

## Next steps

- {{< doclink path="access-control/rules/" text="Access rules" />}}
- {{< doclink path="access-control/troubleshooting/" text="Troubleshooting" />}}
- {{< doclink path="configuration/users/" text="User management" />}}
