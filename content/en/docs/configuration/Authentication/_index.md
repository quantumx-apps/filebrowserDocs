---
title: "Authentication"
description: "Configure authentication methods"
icon: "lock"
date: "2025-10-08T14:59:30Z"
lastmod: "2026-08-12T15:00:00Z"
order: 4
---

Choose one or more login methods under `auth.methods`. Password, OIDC, LDAP, JWT, proxy, passkey, and no-auth are documented in the pages below.

## Auto-created users and sources (v2.0.1+)

OIDC, LDAP, JWT, and proxy authentication **create users on first successful login**. Those users receive sources the same way as password users:

- Every source with {{< doclink path="configuration/sources#defaultenabled" text="defaultEnabled: true" />}} is added to the user’s scopes when the user is **created**.
- On **every server startup**, FileBrowser merges any missing `defaultEnabled` sources into **all** existing users’ scopes (so adding a new default-enabled source in config takes effect after restart without editing each user).
- Sources with `defaultEnabled: false` are never auto-added; an admin must assign them.

Path-level isolation inside a source still uses {{< doclink path="access-control/rules" text="access rules" />}} and {{< doclink path="configuration/sources#denybydefault" text="denyByDefault" />}}.

## Groups (OIDC, LDAP, JWT)

OIDC, LDAP, and JWT share `groupsClaim`, `adminGroup`, and `userGroups`. On successful login, IdP groups are synced into the access-control GroupMap (write-through to the database) so group allow/deny rules apply. See each method’s page for claim/attribute details.
