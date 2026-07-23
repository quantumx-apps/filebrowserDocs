---
title: "Activity"
description: "Audit log, charts, and reports for user and file activity in FileBrowser Quantum v2.0.0"
icon: "monitoring"
date: "2026-07-17T00:00:00Z"
lastmod: "2026-07-17T00:00:00Z"
order: 5
---

{{% alert context="warning" title="v2.0.0 only" %}}
The Activity Viewer and semantic activity audit log were introduced in **v2.0.0**. They require the SQLite database migration from v1.x. If you are still on v1.x, see {{< doclink path="getting-started/v2/migration/" text="Migration guide" />}} before upgrading.
{{% /alert %}}

## Overview

Activity logging records **semantic events** — downloads, uploads, share changes, logins, and similar actions — in the main SQLite database. The **Activity Viewer** tool turns that history into a searchable table, charts, and CSV exports.

Events are buffered in memory and written to SQLite in batches. Old rows are purged automatically based on retention settings. Activity is separate from the file index database; both live under `server.database` in config.

## Opening the Activity Viewer

There are several ways to open the tool:

1. **Tools menu** — Open **Tools** from the sidebar and choose **Activity Viewer** (`/tools/activityViewer`).
2. **Settings shortcuts** — Admins see an activity button on:
   - **Settings → Users** — user create/update/delete events
   - **Settings → Shares** — share lifecycle and share downloads
   - **Settings → API Tokens** — token create/delete events
   - **Settings → Access** — access rule changes for the selected source
3. **Context shortcuts** — While browsing or editing:
   - **File info** — activity for the current file or folder
   - **Share editor** — activity for a specific share or path
   - **Access editor** — access changes for the current path

Shortcuts open the viewer with filters pre-filled (scope, source, path, share hash, or event types).

## Who can see what

| Capability | Admin | Non-admin |
| --- | --- | --- |
| View all users' activity | Yes | No — only their own rows |
| Filter by username | Yes | No |
| Path glob filter (`pathGlob`) | Yes | No |
| Share filter on others' shares | Yes | Only shares they own |
| Full paths in results | Yes | Paths trimmed to their per-source scope |
| CSV `details` column (JSON) | Yes | No |

Non-admin users always query with their own user ID enforced on the server. Admins can filter by any username, including the anonymous user.

## Activity scopes

Scopes limit which event types appear. Use them in the viewer or in API query parameters.

| Scope | Includes |
| --- | --- |
| **all** | Every event type (default) |
| **files** | Download, move, copy, rename, upload, delete, bulk delete, archive, unarchive |
| **access** | Access create, update, delete |
| **shares** | Share create, update, delete, and **download** events tied to a share (via `shareHash` in details) |

When `scope=shares` and no event types are selected, the viewer shows all share-related events including share downloads. Other scopes apply their event-type set automatically unless you pick specific types in the filter.

## View types

The Activity Viewer supports five layouts:

- **Table** — Paginated list with optional columns (source, path, share hash, token name, IP address). Click a row for full event details.
- **Bar chart** — Counts over time, split by event type, user, or total.
- **Line chart** — Same time-series data as the bar chart in line form.
- **Pie chart** — Distribution of counts for the selected range and filters.
- **Summary** — Aggregated totals without a time axis.

Chart views support time buckets of **minute** (up to 48 hours), **hour**, or **day** (ranges up to 90 days). Split-by options include event type, user (admins only), or total.

## Filters

Common filters work together:

- **Time range** — Unix `from` / `to` timestamps (default last 7 days in the API).
- **Event type** — One or more types, comma-separated.
- **Source and path** — Browse to a folder or type a path prefix under a source.
- **Path glob** — Admin-only glob patterns (for example `/docs/*`) scoped to the selected source.
- **Share** — Pick a share to limit to that link's activity (non-admins: own shares only).
- **User** — Admin-only username filter.

Changing filters and clicking **Refresh** reloads data. Table view also supports **Export CSV**.

## What gets logged

Activity covers file operations, administration, authentication, and tool usage. WebDAV operations are logged the same way as Web UI actions when performed by an authenticated user.

### File and path operations

- **download** — File or folder download (including share and token-based downloads)
- **upload** — New file or folder upload
- **move**, **copy**, **rename** — PATCH actions on resources
- **delete**, **bulkDelete** — Single or multi-item deletion
- **archive**, **unarchive** — Archive tool actions

### Shares and access

- **shareCreate**, **shareUpdate**, **shareDelete** — Share lifecycle (field-level changes on update)
- **accessCreate**, **accessUpdate**, **accessDelete** — Per-path access rules

### Users, tokens, and auth

- **userCreate**, **userUpdate**, **userDelete** — User administration (scope and permission changes appear in details)
- **tokenCreate**, **tokenDelete** — API token lifecycle
- **login**, **logout**, **signup** — Authentication events
- **passkeyRegister**, **passkeyDelete** — Passkey changes

### Tools

- **duplicateFinder** — Duplicate finder tool runs

Each row stores the actor username, event type, timestamp, client IP, and structured **details** (paths, share hash, field diffs, and so on). Admins see the richest detail in the UI and in CSV export.

## What is not logged

These actions do **not** create activity rows:

- **Inline viewing** via `viewToken` (`GET /api/resources/view` and related share/public view endpoints) — previewing in the UI does not count as a download and is not audited as activity.
- **Disabled logging** — When `server.database.activity.disabled` is `true`, new events are not recorded (existing rows remain until retention purge).

Ordinary **downloads** (including forced download and WebDAV GET of file content) are logged.

## Configuration

Activity settings live under `server.database.activity` in `config.yaml`:

```yaml
server:
  database:
    path: "filebrowser.sqlite"
    activity:
      disabled: false              # set true to stop recording new events
      retentionDays: 30              # purge rows older than this (default 30)
      flushIntervalSeconds: 10     # background flush interval (default 10)
      maxBufferSize: 10000         # flush immediately when buffer reaches this size
```

- **`disabled`** — When `true`, the recorder does not accept new events.
- **`retentionDays`** — On startup and during periodic purges, rows older than this many days are deleted.
- **`flushIntervalSeconds`** / **`maxBufferSize`** — Control how often buffered events are written to SQLite.

See also {{< doclink path="configuration/server/#database" text="Server database settings" />}} and {{< doclink path="getting-started/v2/about/" text="About v2.0.0" />}} for the SQLite migration context.

## CSV export

In **table** view, **Export CSV** downloads activity for the current filters. Exports:

- Paginate through the result set in chunks (up to **100,000** rows total; larger exports are truncated with a `TRUNCATED` marker row).
- Include optional columns you enabled in the table: **source**, **path**, **shareHash**, **tokenName**.
- Include a **details** JSON column **for admins only** (full structured payload).

Base columns are always: `id`, `createdAt`, `username`, `eventType`, and `ipAddress`.

## API

Authenticated users can query activity through the REST API (same filters as the UI):

| Endpoint | Purpose |
| --- | --- |
| `GET /api/tools/activity` | Paginated event list (`page`, `limit` up to 500) |
| `GET /api/tools/activity/grouped` | Chart buckets (`interval`, `splitBy`, `groupBy`) |
| `GET /api/tools/activity/export` | CSV stream (`rows` for optional columns) |

Query parameters include `from`, `to`, `scope`, `eventType`, `source`, `path`, `pathGlob` (admin), `shareHash`, and `username` (admin). Non-admins cannot override the user filter.

See {{< doclink path="reference/api/" text="API reference" />}} for authentication and general API usage.

## Related topics

- {{< doclink path="getting-started/v2/migration/" text="v2 migration guide" />}} — SQLite upgrade required for activity
- {{< doclink path="configuration/users/" text="User management" />}} — per-source permissions and scopes shown in activity paths
- {{< doclink path="features/webdav/" text="WebDAV" />}} — WebDAV file operations appear in activity when logged in
- {{< doclink path="features/sidebar-links/#tool-link-configuration" text="Sidebar tool links" />}} — pin the Activity Viewer in the sidebar
