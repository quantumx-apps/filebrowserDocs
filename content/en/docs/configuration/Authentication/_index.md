---
title: "Authentication"
description: "Configure authentication methods"
icon: "lock"
date: "2025-10-08T14:59:30Z"
lastmod: "2026-08-12T15:00:00Z"
order: 4
---

## Group claims

OIDC, JWT, and LDAP authentication all support group-based authorization through `adminGroup`, `userGroups`, and `groupsClaim`. When `groupsClaim` is omitted, FileBrowser defaults it to `groups` for every method that uses these shared options.

| Method | Default `groupsClaim` | Notes |
|--------|----------------------|-------|
| OIDC | `groups` | Set `groupsClaim` to match your provider's claim name. Add the `groups` scope to `scopes` when your provider requires it (for example PocketID). |
| JWT | `groups` | Include a `groups` array (or your custom claim) in the external JWT payload. |
| LDAP | `groups` | Override with `memberOf` or another LDAP attribute when your directory does not use a `groups` attribute. |

On successful login, groups are synced into the access-control GroupMap for {{< doclink path="access-control/rules" text="group allow/deny rules" />}}. See each method's page for provider-specific examples.
