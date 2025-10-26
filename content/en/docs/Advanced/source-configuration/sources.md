---
title: "Source Configuration"
description: "Understanding and configuring sources in FileBrowser Quantum"
icon: "storage"
date: "2024-10-17T10:00:00Z"
lastmod: "2024-10-17T10:00:00Z"
order: 1
---

## What are Sources?

Sources are the directories that FileBrowser Quantum makes available to users. Each source represents a filesystem path that can be browsed, searched, and managed through the web interface.

{{% alert context="info" %}}
**Getting Started:** For basic usage, you only need to define the `path` and optionally set `defaultEnabled: true`. Most other configuration options can be left at their defaults.
{{% /alert %}}

## Source Basics

### Unique Paths Required

Each source must have a **unique real filesystem path**. FileBrowser uses the actual resolved path on the filesystem to identify sources internally, not the name you assign.

```yaml
sources:
  - path: "/data"        # ✅ Valid
  - path: "/mnt/storage" # ✅ Valid - different path
  - path: "/data"        # ❌ Invalid - duplicate path
```

### Source Names

**Automatic naming:** If you don't specify a `name`, FileBrowser automatically assigns one based on the base folder name.

```yaml
sources:
  - path: "/mnt/documents"  # Name: "documents"
  - path: "/data/photos"    # Name: "photos"
```

**Custom naming:** You can specify a custom display name:

```yaml
sources:
  - path: "/mnt/documents"
    name: "Company Files"   # Custom name
```

{{% alert context="success" %}}
**Name Changes Safe:** You can change a source's `name` at any time. The backend matches sources by their real filesystem path, so existing access rules and shares will continue to work.
{{% /alert %}}

## Minimal Configuration

The simplest source configuration:

```yaml
server:
  sources:
    - path: "/data"
      config:
        defaultEnabled: true
```

This creates a source that:
- Is available to all new users
- Has indexing enabled
- Uses all default settings

## Indexing Overview

Sources are indexed by default, which enables:
- **Search functionality** - Fast full-text and filename search
- **Folder size calculations** - Accurate directory size reporting
- **Folder previews** - Thumbnail previews for image directories
- **Health monitoring** - Source statistics and health information

**Performance:** Indexing uses adaptive scanning intervals based on filesystem complexity. For typical filesystems (under 50,000 items), expect scan times under 30 seconds with minimal memory usage (100-300MB). Larger filesystems may require more resources but benefit from smart interval adjustments that reduce scan frequency.

For detailed indexing information, see {{< doclink path="advanced/indexing/" text="Understanding Indexing" />}}.

## Configuration Options

### `path` (required)

```yaml
path: "/data"
```

The filesystem path to the directory you want to serve. Can be absolute or relative, but must exist and be readable by FileBrowser.

### `name`

```yaml
name: "My Files"
```

Display name shown in the UI. If not specified, uses the base folder name from the path. Useful for providing user-friendly names like "Company Files" instead of just "documents".

### `defaultEnabled`

```yaml
config:
  defaultEnabled: true
```

Whether new users automatically get access to this source. Defaults to `false`. Set to `true` for shared sources that all users should see.

### `denyByDefault`

```yaml
config:
  denyByDefault: true
```

Deny access unless an explicit "allow" access rule exists. Defaults to `false`. Use this for high-security sources where access must be explicitly granted per user or group.

{{% alert context="warning" %}}
When `denyByDefault: true`, users need explicit allow rules to access the source.
{{% /alert %}}

See {{< doclink path="access-control/access-control-overview/" text="Access Control Guide" />}} for more information.

### `private`

```yaml
config:
  private: true
```

Designate source as private, which disables sharing. Defaults to `false`. Use this to prevent users from creating public shares for sensitive data.

### `defaultUserScope`

```yaml
config:
  defaultUserScope: "/subfolder"
```

Default scope path for new users created automatically via API or CLI. Defaults to `"/"` (root of source). This restricts where new users can access within the source. Include the leading slash.

Works with `createUserDir` to place users in specific locations:

```yaml
sources:
  - path: "/shared"
    config:
      defaultUserScope: "/users"
      defaultEnabled: true
```

New users will only see `/shared/users` and its subdirectories.

### `createUserDir`

```yaml
config:
  createUserDir: true
  defaultUserScope: "/home"
```

Automatically create a directory for each new user. Defaults to `false`. When enabled:

- Creates `{defaultUserScope}/{username}` on user creation
- Updates user scope to their personal directory  
- Directory persists even if user is deleted

Example:
```yaml
config:
  createUserDir: true
  defaultUserScope: "/home"
```

Creates `/home/john` for user "john" and sets their scope to that directory.

### `disabled`

```yaml
config:
  disabled: true
```

Disable the source without removing it from config. Defaults to `false`. Useful for temporarily disabling a source for maintenance or testing. Users cannot access disabled sources.

### `disableIndexing`

```yaml
config:
  disableIndexing: true
```

Completely disable indexing for this source. Defaults to `false`.

{{% alert context="danger" %}}
When indexing is disabled, these features **will not work**:
- Search functionality
- Folder size calculations
- Folder preview images
- Source statistics and health monitoring
- Many future enhancements

Users can still browse files, but with significantly reduced functionality.
{{% /alert %}}

Only disable if you have specific performance requirements and don't need search or size information.

### `indexingIntervalMinutes`

```yaml
config:
  indexingIntervalMinutes: 30
```

Force a specific scan interval in minutes. Defaults to `0` which uses smart scanning.

{{% alert context="warning" %}}
**Not Recommended:** The default smart scanning behavior adapts to your filesystem and is optimal for most use cases. Only set this if you have specific requirements.
{{% /alert %}}

When to use:
- You need guaranteed scan intervals for compliance
- Your filesystem has predictable, regular update patterns
- Smart scanning doesn't suit your specific workload

How it works: Performs 4 quick scans at the specified interval, then 1 full scan.

### `conditionals`

```yaml
config:
  conditionals:
    ignoreHidden: true
    ignoreZeroSizeFolders: true
    rules:
      - folderPath: "excluded"
      - fileNames: ".DS_Store"
```

Control which files and folders are indexed. See {{< doclink path="advanced/source-configuration/conditional-rules/" text="Conditional Rules Guide" />}} for complete documentation.

**`ignoreHidden`** (default: `false`) - Skip all hidden files and folders during indexing. Hidden items won't appear in search or UI.

**`ignoreZeroSizeFolders`** (default: `false`) - Skip folders with zero calculated size. Empty folders or folders containing only empty folders are ignored. You can still create folders via the UI; they must be populated by the next scan to remain visible.

**`rules`** - Array of conditional rules. See the {{< doclink path="advanced/source-configuration/conditional-rules/" text="Conditional Rules Guide" />}} for details.

## Configuration Examples

### Public Shared Source

A source available to all users with basic settings:

```yaml
sources:
  - path: "/public"
    name: "Shared Files"
    config:
      defaultEnabled: true
      conditionals:
        ignoreHidden: true
```

### User Home Directories

Automatically create isolated user directories:

```yaml
sources:
  - path: "/home"
    name: "User Files"
    config:
      defaultEnabled: true
      defaultUserScope: "/"
      createUserDir: true
      conditionals:
        ignoreHidden: true
        ignoreZeroSizeFolders: true
```

Each user gets `/home/{username}` as their private space.

### High-Security Source

Restrict access with explicit allow rules:

```yaml
sources:
  - path: "/confidential"
    name: "Confidential"
    config:
      private: true           # No sharing allowed
      denyByDefault: true     # Require explicit access rules
      conditionals:
        ignoreHidden: true
```

### Development/Media Source

Exclude common development artifacts and system files:

```yaml
sources:
  - path: "/projects"
    name: "Projects"
    config:
      defaultEnabled: true
      conditionals:
        ignoreHidden: true
        ignoreZeroSizeFolders: true
        rules:
          - folderNames: "node_modules"
          - folderNames: "__pycache__"
          - folderNames: ".git"
          - folderEndsWith: ".cache"
          - fileNames: ".DS_Store"
          - fileNames: "Thumbs.db"
```

### Archive Source with Minimal Rescanning

A source with large, rarely-changing archives:

```yaml
sources:
  - path: "/archives"
    name: "Archives"
    config:
      defaultEnabled: false
      conditionals:
        rules:
          - neverWatchPath: "historical-data"
          - neverWatchPath: "backups-2020"
```

The `neverWatchPath` folders are indexed once but never rescanned, saving resources.

### Mixed Visibility Source

Show certain folders in UI but exclude from search:

```yaml
sources:
  - path: "/storage"
    config:
      conditionals:
        rules:
          - folderPath: "working"         # Fully indexed
          - folderPath: "archive"         # Hidden from UI and search
          - folderPath: "temp"
            viewable: true                # Visible in UI but not in search
```

## Common Configuration Patterns

<div class="pattern-grid">

<div class="pattern-card">

### Single Shared Source
**Use case:** Simple shared file access

```yaml
sources:
  - path: "/data"
    config:
      defaultEnabled: true
```

</div>

<div class="pattern-card">

### Multi-User with Personal Directories
**Use case:** Each user gets private space

```yaml
sources:
  - path: "/home"
    config:
      defaultEnabled: true
      createUserDir: true
```

</div>

<div class="pattern-card">

### Departmental Sources
**Use case:** Multiple departments with access control

```yaml
sources:
  - path: "/dept/sales"
    name: "Sales"
  - path: "/dept/engineering"
    name: "Engineering"
```

Use access rules to control who sees what.

</div>

<div class="pattern-card">

### Mixed Public/Private
**Use case:** Some sources public, others restricted

```yaml
sources:
  - path: "/public"
    config:
      defaultEnabled: true
  - path: "/private"
    config:
      denyByDefault: true
      private: true
```

</div>

</div>

## Best Practices

1. **Start Simple** - Begin with minimal configuration and add options as needed
2. **Use Real Paths** - Always use absolute paths for production deployments
3. **Plan Access Control** - Design your access strategy before creating multiple sources
4. **Monitor Resources** - Watch memory/CPU usage after adding sources with large filesystems

## Next Steps

- {{< doclink path="advanced/source-configuration/conditional-rules/" text="Conditional Rules Guide" />}}
- {{< doclink path="access-control/access-control-overview/" text="Access Control" />}}
- {{< doclink path="advanced/indexing/" text="Understanding Indexing" />}}
- {{< doclink path="reference/fullconfig/" text="Full Config Reference" />}}

<style>
.pattern-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
  gap: 1.5em;
  margin: 2em 0;
}

.pattern-card {
  padding: 1.5em;
  border: 1px solid var(--gray-300);
  border-radius: 8px;
  background: var(--surfaceSecondary);
}

.pattern-card h3 {
  margin-top: 0;
  margin-bottom: 0.5em;
  color: var(--primary);
  font-size: 1.1em;
}

.pattern-card p {
  margin: 0.5em 0 1em 0;
  font-size: 0.9em;
  color: var(--textSecondary);
}

.pattern-card pre {
  margin: 0;
}

/* Dark mode support */
[data-dark-mode] .config-section {
  background: rgba(14, 165, 233, 0.12);
}

[data-dark-mode] .pattern-card {
  background: rgba(255, 255, 255, 0.03);
  border-color: var(--gray-700);
}

/* Responsive */
@media (max-width: 768px) {
  .pattern-grid {
    grid-template-columns: 1fr;
  }
}
</style>

