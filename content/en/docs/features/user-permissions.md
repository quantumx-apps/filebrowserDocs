---
title: "User Permissions"
description: "Global and per-source permissions in FileBrowser Quantum v2.0.0, including the new view grant"
icon: "lock"
date: "2026-08-07T16:57:00Z"
lastmod: "2026-08-07T17:43:00Z"
order: 2
---

FileBrowser Quantum **v2.0.0** splits permissions into two layers: **global capabilities** that apply everywhere, and **per-source file permissions** that apply to each source in a user's scopes. The new **view** grant controls whether someone can browse and preview content in the UI without downloading.

{{% alert context="warning" %}}
**v2.0.0 behavior change**

In v1.x, file-operation permissions (**modify**, **create**, **delete**, **download**) were global checkboxes on the user. v2.0.0 moves all file operations — including the new **view** permission — to **each source**. Migration from v1.x copies former global file permissions to each source.
{{% /alert %}}

## Two permission layers

### Global permissions

These apply to the user account everywhere. Configure them in **Settings → User Management** when creating or editing a user.

| Permission | Purpose |
|---|---|
| **Admin** | Full system access, user management, configuration |
| **API** | Create API tokens, REST API access |
| **Share** | Create and manage share links |
| **Realtime** | Real-time connections and live updates |

### Per-source file permissions (v2.0.0+)

These permissions apply to each source.

| Permission | Typical use |
|---|---|
| **View** | Browse folders, list files, see properties, preview in the UI, WebDAV. **New in v2.0.0** — in v1.x this was always granted for any source in the user's scopes |
| **Download** | Read or download file contents (`GET /api/resources/download`, archives, WebDAV file reads, share download limits) |
| **Modify** | Edit, upload/overwrite, rename, move within or across sources |
| **Create** | Create files and folders, copy into this source |
| **Delete** | Delete files and folders |

## View vs download

**View** and **download** are separate permissions in v2.0.0+. A user can browse and preview without being allowed to save file bytes — useful for read-only galleries, internal document review, or limiting share recipients to in-browser viewing. This also extends to office integrations.

| Action | Permission required | Counts as download? | Activity logged? |
|---|---|---|---|
| Browse folders in the Web UI | **View** | No | No |
| Open file preview / media player (`viewToken`) | **View** | No | No |
| Save file, download folder, archive | **Download** | Yes | Yes (`download` event) |
| WebDAV list directories | **View** | No | No |
| WebDAV read file content | **Download** | Yes | No (WebDAV reads are not audit-logged today) |

Inline viewing uses `GET /api/resources/view` and `GET /api/media/stream` with a `viewToken` minted from file metadata. Those endpoints never increment share download counters and never create activity rows. See {{< doclink path="features/activity/" text="Activity Viewer" />}} and {{< doclink path="features/previewing-files/" text="Previewing files" />}}.

## Which Settings page controls what

Permission-related options appear in more than one place. Use this table to find the right page:

| What you're setting | Where to find it | What it does |
|---|---|---|
| **Default file permissions** | **Access management** → Permissions (collapsible section) | Starting values for view, download, modify, create, and delete on **new scopes** and users created via OIDC, LDAP, JWT, or proxy. Use **Enforce** to lock a value for all non-admin users. |
| **A specific user's permissions** | **User management** → edit user → expand each source | What **this user** may do on **this source** — can match or differ from the defaults. Use this when one person needs different access than everyone else. |
| **Path allow/deny rules** | **Access management** → rules table | Controls **which folders** a user or group can reach. Does **not** turn on create, modify, or delete by itself. |

**User defaults** (profile theme, preview toggles, global admin/api/share/realtime) are a third, separate template — see {{< doclink path="features/user-defaults/" text="User defaults" />}}.

{{% alert context="warning" %}}
**Defaults do not rewrite existing users**

Changing a **default** — whether in **User defaults** or **Access management → default permissions** — updates the template for **new** users and **newly added scopes** only. It does **not** push changes onto users who already exist with stored values. That is intentional: a default is a starting point, not a bulk user edit.

To apply a policy to **all existing non-admin users**, use **Enforce** on that field in User defaults or Access management. To change one person, edit their user record in **User management**.
{{% /alert %}}

## Where to configure permissions

### Per-user scopes

1. Open **Settings → User Management**
2. Create or edit a user
3. Assign sources and scope paths
4. Expand each source row and set **view**, **download**, **modify**, **create**, and **delete**

### Default permissions for new scopes

**Settings → Access management** defines **default permissions** used when:

- A **new scope** is added to a user in the user editor (pre-filled from these defaults)
- A user is **auto-created** on first OIDC, LDAP, JWT, or proxy login
- Permissions are **omitted** on API user create for a scope

Built-in defaults when nothing is configured: **view** and **download** are **true**; **modify**, **create**, and **delete** are **false**.

Changing these defaults **does not** update permissions on scopes that users already have. After changing defaults, either edit affected users in **User management** or enable **Enforce** (below).

```yaml
server:
  sources:
    - path: "/data"
      config:
        defaultPermissions:
          view: true
          download: true
          modify: false
          create: false
          delete: false
```

See {{< doclink path="configuration/users/" text="User management" />}} for the full config reference.

## Enforced source permissions

Admins can **enforce** individual per-source permission flags in **Settings → Access management** (enforce toggle next to each default). When enforcement is **enabled** for a flag:

- The enforced value is taken from the current **default** for that flag
- **All non-admin users** are resynced immediately — existing scope values are overwritten to match
- Non-admins **cannot override** enforced flags in User management
- **Admin users are exempt** from enforcement

When enforcement is **disabled** for a flag, changing the default alone does **not** resync existing users — only toggling enforce on (or editing users individually) pushes values out.

Use enforcement when you need a deployment-wide policy (for example, enable **create** for everyone, or disable **delete** on every scope).

{{% alert context="info" %}}
Enforced source permissions are separate from **user defaults** (profile preferences like theme and preview settings). See {{< doclink path="features/user-defaults/" text="User defaults" />}} for enforceable profile settings.
{{% /alert %}}

## How this relates to access rules

Per-source permissions gate **what actions** a user may perform on files in a source. **Access control rules** (allow/deny on specific paths) further refine **which paths** under that source are reachable. Both must pass for an action to succeed.

An **allow** rule on a path does **not** substitute for **create**, **modify**, or **delete** permission on the user's scope. If create is disabled on the user's scope row, New file / New folder stays hidden even when an allow rule exists on that folder.

See {{< doclink path="access-control/access-control-overview/" text="Access control overview" />}} for path-based rules and {{< doclink path="features/webdav/" text="WebDAV" />}} for how each capability maps to client operations.

## Troubleshooting: missing New file / New folder

Common causes when a user can browse but cannot create:

1. **Create is off on the user's scope** — Open **User management** → edit the user → expand the source → enable **Create**. Access management defaults alone do not update existing users.
2. **Defaults were changed after the user was created** — OIDC and other auto-provisioned users receive permissions at **first login**. Change the user record, or **Enforce** create in Access management to resync all non-admins.
3. **Allow rule mistaken for create permission** — Path allow rules control visibility; **create** is a separate scope permission.
4. **View without create** — **View** allows browsing and preview; **Create** is required for new files and folders in the Web UI.

After fixing permissions, the user may need to refresh the browser session so the sidebar picks up updated scope data.

## After upgrading from v1.x

Migration copies each user's former global file permissions onto **every** existing scope and sets **view** to **true** unless you configured otherwise. After upgrading:

1. Open **Settings → User Management** for each non-admin user
2. Confirm per-source permissions on every scope row
3. Set **default permissions** and enforcement in **Access management** if you want deployment-wide caps

## Related topics

- {{< doclink path="features/user-defaults/" text="User defaults" />}} — profile preferences and global admin/api/share/realtime template
- {{< doclink path="configuration/users/" text="User management" />}} — YAML config, CLI, and API user shapes
- {{< doclink path="access-control/access-control-overview/" text="Access control overview" />}} — path-based allow/deny rules
- {{< doclink path="features/webdav/" text="WebDAV" />}} — per-source permission matrix for WebDAV clients
- {{< doclink path="getting-started/v2/about/" text="About v2.0.0" />}} — full release summary
