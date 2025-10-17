---
title: "Conditional Rules"
description: "Control which files and folders are indexed using conditional rules"
icon: "rule"
date: "2024-10-17T10:00:00Z"
lastmod: "2024-10-17T10:00:00Z"
---

## Overview

Conditional rules allow you to control which files and folders are indexed by FileBrowser Quantum. Use rules to exclude system files, temporary directories, or large archives while keeping your UI clean and search results relevant.

## Basic Structure

Rules are configured under `conditionals` in your source configuration:

```yaml
sources:
  - path: "/data"
    config:
      conditionals:
        ignoreHidden: true
        ignoreZeroSizeFolders: false
        rules:
          - folderPath: "excluded"
          - fileNames: ".DS_Store"
```

## Global Flags

These flags apply to the entire source:

### `ignoreHidden`

```yaml
conditionals:
  ignoreHidden: true
```

Skip all hidden files and folders (those starting with `.`). Hidden items don't appear in UI or search. Defaults to `false`. Useful for automatically excluding system files like `.git` and `.DS_Store`.

### `ignoreZeroSizeFolders`

```yaml
conditionals:
  ignoreZeroSizeFolders: true
```

Skip folders with zero calculated size. Empty folders or folders containing only empty folders are ignored. Defaults to `false`. Cleans up UI by hiding empty directory structures.

{{% alert context="info" %}}
You can still create folders via the UI. They must be populated by the next index scan to remain visible.
{{% /alert %}}

## Rule Types

Individual rules are specified in the `rules` array. Each rule targets specific files or folders.

### Path-Based Rules

Target specific paths within your source.

#### `folderPath`

```yaml
rules:
  - folderPath: "temp"
  - folderPath: "cache/build"
```

Matches exact folder path relative to source root. For example, `folderPath: "logs"` matches `/data/logs` but not `/data/project/logs`. Use this to exclude specific known directories.

#### `filePath`

```yaml
rules:
  - filePath: "config/secrets.txt"
  - filePath: "data.db"
```

Matches exact file path relative to source root. For example, `filePath: "data.db"` matches `/data/data.db` but not `/data/backup/data.db`. Use this to exclude specific known files.

### Name-Based Rules (Global)

These rules apply anywhere within the source.

#### `folderNames`

```yaml
rules:
  - folderNames: "node_modules"
  - folderNames: "__pycache__"
  - folderNames: ".git"
```

Matches any folder with this exact name, anywhere in the source. For example, `folderNames: "node_modules"` excludes all `node_modules` directories. Useful for excluding common folder names like cache or build directories.

#### `fileNames`

```yaml
rules:
  - fileNames: ".DS_Store"
  - fileNames: "Thumbs.db"
  - fileNames: "desktop.ini"
```

Matches any file with this exact name, anywhere in the source. For example, `fileNames: ".DS_Store"` excludes all `.DS_Store` files. Useful for excluding system or temporary files by name.

### Pattern-Based Rules (Global)

Match files and folders based on name patterns.

#### `folderStartsWith`

```yaml
rules:
  - folderStartsWith: "tmp-"
  - folderStartsWith: "backup-"
  - folderStartsWith: "."
```

Matches folders whose names start with the specified prefix, anywhere in the source. For example, `folderStartsWith: "tmp-"` excludes `tmp-cache`, `tmp-build`, etc. Useful for excluding folders with naming conventions.

#### `folderEndsWith`

```yaml
rules:
  - folderEndsWith: ".git"
  - folderEndsWith: ".cache"
  - folderEndsWith: "-backup"
```

Matches folders whose names end with the specified suffix, anywhere in the source. For example, `folderEndsWith: ".git"` excludes `.git` folders. Useful for excluding folders by suffix pattern.

#### `fileStartsWith`

```yaml
rules:
  - fileStartsWith: "temp-"
  - fileStartsWith: "~"
  - fileStartsWith: "._"
```

Matches files whose names start with the specified prefix, anywhere in the source. For example, `fileStartsWith: "._"` excludes macOS metadata files. Useful for excluding temporary or system files.

#### `fileEndsWith`

```yaml
rules:
  - fileEndsWith: ".tmp"
  - fileEndsWith: ".log"
  - fileEndsWith: "~"
```

Matches files whose names end with the specified suffix, anywhere in the source. For example, `fileEndsWith: ".tmp"` excludes all temporary files. Useful for excluding files by extension or suffix.

### Special Rules

#### `includeRootItem`

```yaml
rules:
  - includeRootItem: "public"
  - includeRootItem: "downloads"
  - includeRootItem: "README.md"
```

Only show specified items at the root level of the source. For example, with the rules above, only `public` and `downloads` folders appear at source root. Useful for restricting visibility to specific root directories or files.

{{% alert context="warning" %}}
When using `includeRootItem`, **only** the specified items are visible at the root level. All other root items are hidden.
{{% /alert %}}

#### `neverWatchPath`

```yaml
rules:
  - neverWatchPath: "archives"
  - neverWatchPath: "historical/2020"
```

Folder is indexed once initially, then never rescanned automatically. You can still manually refresh by viewing the folder in the UI. Useful for large, rarely-changing directories to save resources.

Example:
```yaml
rules:
  - neverWatchPath: "photo-archive"  # 500GB of old photos
```

#### `viewable`

```yaml
rules:
  - folderPath: "archive"
    viewable: true
  - folderPath: "temp"
    viewable: true
```

Can be added to any rule type. Folder/file appears in UI but is excluded from search and size calculations. Useful for showing directories for browsing without indexing their contents.

Example:
```yaml
rules:
  - folderPath: "old-projects"
    viewable: true
```

Users can browse `old-projects` but it won't appear in search results or affect folder sizes.

## Complete Examples

### Clean Development Environment

Exclude common development artifacts:

```yaml
sources:
  - path: "/projects"
    config:
      conditionals:
        ignoreHidden: true
        rules:
          # Node.js
          - folderNames: "node_modules"
          - folderNames: "dist"
          - folderNames: "build"
          
          # Python
          - folderNames: "__pycache__"
          - folderNames: ".pytest_cache"
          - folderEndsWith: ".egg-info"
          
          # General
          - folderNames: ".git"
          - fileNames: ".DS_Store"
          - fileEndsWith: ".log"
```

### Media Library with Archives

Show archive folders but don't index them:

```yaml
sources:
  - path: "/media"
    config:
      conditionals:
        ignoreHidden: true
        ignoreZeroSizeFolders: true
        rules:
          # System files
          - fileNames: ".DS_Store"
          - fileNames: "Thumbs.db"
          - folderNames: "@eaDir"
          
          # Show but don't index archives
          - folderPath: "2020-archive"
            viewable: true
          - folderPath: "2021-archive"
            viewable: true
          
          # Never rescan large stable folders
          - neverWatchPath: "historical-collection"
```

### Restricted Public Share

Only expose specific directories:

```yaml
sources:
  - path: "/shared"
    config:
      conditionals:
        rules:
          # Only these folders visible at root
          - includeRootItem: "public"
          - includeRootItem: "downloads"
          - includeRootItem: "README.md"
```

### Enterprise File Server

Comprehensive exclusions for corporate environment:

```yaml
sources:
  - path: "/fileserver"
    config:
      conditionals:
        ignoreHidden: true
        ignoreZeroSizeFolders: true
        rules:
          # Windows system files
          - fileNames: "desktop.ini"
          - fileNames: "Thumbs.db"
          - folderNames: "System Volume Information"
          - folderNames: "$RECYCLE.BIN"
          
          # macOS system files
          - fileNames: ".DS_Store"
          - fileStartsWith: "._"
          - folderNames: ".Trashes"
          
          # Synology NAS
          - folderNames: "@eaDir"
          - folderNames: "#recycle"
          
          # Temporary and backup files
          - fileEndsWith: "~"
          - fileEndsWith: ".tmp"
          - fileEndsWith: ".bak"
          - folderStartsWith: "~"
          
          # Archives - visible but not searchable
          - folderPath: "archives/2020"
            viewable: true
          - folderPath: "archives/2021"
            viewable: true
```

## Rule Priority and Behavior

### How Rules Are Applied

1. **Global flags first:** `ignoreHidden` and `ignoreZeroSizeFolders` are checked first
2. **Rules are OR-based:** If any rule matches an item, it's excluded
3. **Path rules are exact:** `folderPath: "temp"` only matches `/temp`, not `/project/temp`
4. **Name rules are global:** `folderNames: "temp"` matches any `temp` folder anywhere
5. **Viewable overrides exclusion:** Adding `viewable: true` shows the item in UI

### Common Patterns

<div class="pattern-grid">

<div class="pattern-card">
<h4>Exclude by Extension</h4>

```yaml
rules:
  - fileEndsWith: ".log"
  - fileEndsWith: ".tmp"
  - fileEndsWith: ".bak"
```

Removes temporary and log files.

</div>

<div class="pattern-card">
<h4>Exclude System Files</h4>

```yaml
ignoreHidden: true
rules:
  - fileNames: ".DS_Store"
  - fileNames: "Thumbs.db"
```

Clean UI without system clutter.

</div>

<div class="pattern-card">
<h4>Show Large Archives</h4>

```yaml
rules:
  - folderPath: "archive"
    viewable: true
  - neverWatchPath: "archive"
```

Browsable but not indexed or rescanned.

</div>

<div class="pattern-card">
<h4>Development Projects</h4>

```yaml
rules:
  - folderNames: "node_modules"
  - folderNames: ".git"
  - folderEndsWith: ".cache"
```

Exclude build artifacts and dependencies.

</div>

</div>

## Best Practices

1. **Start with hidden files:** Enable `ignoreHidden: true` for cleaner UI
2. **Use global rules for common patterns:** `folderNames` and `fileNames` work everywhere
3. **Path rules for specific exclusions:** Use `folderPath` for known directories
4. **Consider viewable for archives:** Show large stable folders without indexing overhead
5. **Test your rules:** Verify excluded items don't appear in search

## Performance Tips

- **Use `neverWatchPath`** for large, stable directories to save resources
- **Enable `ignoreZeroSizeFolders`** if you have many empty directories
- **Exclude large development folders** like `node_modules` to speed up scans
- **Use `viewable` for archives** to show them without search overhead

## Next Steps

- {{< doclink path="advanced/source-configuration/sources/" text="Source Configuration" />}}
- {{< doclink path="advanced/indexing/" text="Understanding Indexing" />}}
- {{< doclink path="user-guides/general-configuration/exclusion-rules/" text="Migrating from Old Format" />}}

<style>
.pattern-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(260px, 1fr));
  gap: 1.5em;
  margin: 2em 0;
}

.pattern-card {
  padding: 1.5em;
  border: 1px solid var(--gray-300);
  border-radius: 8px;
  background: var(--surfaceSecondary);
}

.pattern-card h4 {
  margin-top: 0;
  margin-bottom: 1em;
  color: var(--primary);
  font-size: 1.1em;
}

.pattern-card p {
  margin: 1em 0 0 0;
  font-size: 0.9em;
  color: var(--textSecondary);
}

.pattern-card pre {
  margin: 0.5em 0;
}

/* Dark mode support */
[data-dark-mode] .rule-section {
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

