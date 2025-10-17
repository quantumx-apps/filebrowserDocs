---
title: "Migrating Conditional Rules"
description: "How to migrate from old exclude/include format to new conditional rules"
icon: "filter_alt"
date: "2024-10-17T10:00:00Z"
lastmod: "2024-10-17T10:00:00Z"
---

## Overview

FileBrowser Quantum v0.8.9 introduces a new, simplified conditional rules format. The old `exclude`/`include` configuration has been replaced with a unified `conditionals` structure that is more flexible and easier to maintain.

{{% alert context="info" %}}
**Migration Required:** If you're upgrading from a version prior to v0.8.9, you'll need to update your configuration file to use the new format.
{{% /alert %}}

## Quick Comparison

Here's a side-by-side comparison of the old and new formats:

<div class="comparison-grid">
  <div class="comparison-card old-format">
    <h4>❌ Old Format (Pre v0.8.9)</h4>

```yaml
sources:
  - path: "/data"
    config:
      exclude:
        folderPaths:
          - "excluded"
          - "backup"
        fileNames:
          - ".DS_Store"
```
  </div>

  <div class="comparison-card new-format">
    <h4>✅ New Format (v0.8.9+)</h4>

```yaml
sources:
  - path: "/data"
    config:
      conditionals:
        rules:
          - folderPath: "excluded"
          - folderPath: "backup"
          - fileNames: ".DS_Store"
```
  </div>
</div>

**Key Difference:** Instead of arrays of strings grouped by type, each rule is now an individual object with specific properties.

## What Changed?

### Old Structure (Pre v0.8.9)

The old format used separate arrays for different exclusion/inclusion types:

{{< highlight yaml >}}
server:
  sources:
    - path: "/data"
      config:
        exclude:
          hidden: true
          ignoreZeroSizeFolders: false
          filePaths:
            - "folder1/file.txt"
          folderPaths:
            - "excluded"
            - "backup"
          fileNames:
            - ".DS_Store"
          folderNames:
            - "@eadir"
          fileEndsWith:
            - ".tmp"
{{< /highlight >}}

### New Structure (v0.8.9+)

The new format uses a single `rules` array where each rule is an object:

{{< highlight yaml >}}
server:
  sources:
    - path: "/data"
      config:
        conditionals:
          hidden: true
          ignoreZeroSizeFolders: false
          rules:
            - filePath: "folder1/file.txt"
            - folderPath: "excluded"
            - folderPath: "backup"
            - fileNames: ".DS_Store"
            - folderNames: "@eadir"
            - fileEndsWith: ".tmp"
{{< /highlight >}}

## Migration Examples

### Example 1: Basic Folder Exclusion

{{< tabs tabTotal="2" >}}
{{< tab tabName="Old Format" >}}
```yaml
sources:
  - path: "/data"
    name: "storage"
    config:
      defaultEnabled: true
      exclude:
        folderPaths:
          - "excluded"
          - "temp"
          - "cache"
```
{{< /tab >}}

{{< tab tabName="New Format" >}}
```yaml
sources:
  - path: "/data"
    name: "storage"
    config:
      defaultEnabled: true
      conditionals:
        rules:
          - folderPath: "excluded"
          - folderPath: "temp"
          - folderPath: "cache"
```
{{< /tab >}}
{{< /tabs >}}

### Example 2: Hidden Files and Global Exclusions

{{< tabs tabTotal="2" >}}
{{< tab tabName="Old Format" >}}
```yaml
sources:
  - path: "/media"
    config:
      exclude:
        hidden: true
        fileNames:
          - ".DS_Store"
          - "Thumbs.db"
        folderNames:
          - "@eadir"
          - ".thumbnails"
```
{{< /tab >}}

{{< tab tabName="New Format" >}}
```yaml
sources:
  - path: "/media"
    config:
      conditionals:
        hidden: true
        rules:
          - fileNames: ".DS_Store"
          - fileNames: "Thumbs.db"
          - folderNames: "@eadir"
          - folderNames: ".thumbnails"
```
{{< /tab >}}
{{< /tabs >}}

### Example 3: Pattern-Based Exclusions

{{< tabs tabTotal="2" >}}
{{< tab tabName="Old Format" >}}
```yaml
sources:
  - path: "/documents"
    config:
      exclude:
        fileStartsWith:
          - "archive-"
          - "backup-"
        fileEndsWith:
          - ".tmp"
          - ".bak"
        folderEndsWith:
          - ".git"
          - ".cache"
```
{{< /tab >}}

{{< tab tabName="New Format" >}}
```yaml
sources:
  - path: "/documents"
    config:
      conditionals:
        rules:
          - fileStartsWith: "archive-"
          - fileStartsWith: "backup-"
          - fileEndsWith: ".tmp"
          - fileEndsWith: ".bak"
          - folderEndsWith: ".git"
          - folderEndsWith: ".cache"
```
{{< /tab >}}
{{< /tabs >}}

### Example 4: Include Rules (Root Items Only)

{{< tabs tabTotal="2" >}}
{{< tab tabName="Old Format" >}}
```yaml
sources:
  - path: "/shared"
    config:
      include:
        rootFolders:
          - "public"
          - "downloads"
        rootFiles:
          - "README.md"
```
{{< /tab >}}

{{< tab tabName="New Format" >}}
```yaml
sources:
  - path: "/shared"
    config:
      conditionals:
        rules:
          - includeRootItem: "public"
          - includeRootItem: "downloads"
          - includeRootItem: "README.md"
```
{{< /tab >}}
{{< /tabs >}}

{{% alert context="success" %}}
**Simplified:** The new format combines both folder and file root items into a single `includeRootItem` property.
{{% /alert %}}

### Example 5: Advanced Configuration

{{< tabs tabTotal="2" >}}
{{< tab tabName="Old Format" >}}
```yaml
sources:
  - path: "/projects"
    config:
      neverWatchPaths:
        - "large-archive"
        - "readonly-data"
      exclude:
        hidden: true
        ignoreZeroSizeFolders: true
        folderPaths:
          - "node_modules"
          - "build"
        fileEndsWith:
          - ".log"
```
{{< /tab >}}

{{< tab tabName="New Format" >}}
```yaml
sources:
  - path: "/projects"
    config:
      conditionals:
        hidden: true
        ignoreZeroSizeFolders: true
        rules:
          - neverWatchPath: "large-archive"
          - neverWatchPath: "readonly-data"
          - folderPath: "node_modules"
          - folderPath: "build"
          - fileEndsWith: ".log"
```
{{< /tab >}}
{{< /tabs >}}

{{% alert context="info" %}}
**Note:** `neverWatchPaths` has been moved into the rules array as individual `neverWatchPath` entries.
{{% /alert %}}

### Example 6: Viewable but Not Indexed

The new format introduces the `viewable` property, which allows items to be visible in the UI but excluded from search indexing:

```yaml
sources:
  - path: "/data"
    config:
      conditionals:
        rules:
          - folderPath: "excludedButVisible"
            viewable: true
          - folderPath: "/subfolders/archived"
            viewable: true
```

{{% alert context="success" %}}
**New Feature:** The `viewable: true` option is only available in the new format. It allows you to show items in the file browser without indexing them for search.
{{% /alert %}}

## Complete Migration Reference

### Old Format Properties → New Format Equivalents

<div class="migration-table">

| Old Property | New Property | Notes |
|-------------|--------------|-------|
| `exclude.filePaths[]` | `rules[].filePath` | One rule per path |
| `exclude.folderPaths[]` | `rules[].folderPath` | One rule per path |
| `exclude.fileNames[]` | `rules[].fileNames` | One rule per name |
| `exclude.folderNames[]` | `rules[].folderNames` | One rule per name |
| `exclude.fileEndsWith[]` | `rules[].fileEndsWith` | One rule per suffix |
| `exclude.folderEndsWith[]` | `rules[].folderEndsWith` | One rule per suffix |
| `exclude.fileStartsWith[]` | `rules[].fileStartsWith` | One rule per prefix |
| `exclude.folderStartsWith[]` | `rules[].folderStartsWith` | One rule per prefix |
| `exclude.hidden` | `conditionals.hidden` | Moved up one level |
| `exclude.ignoreZeroSizeFolders` | `conditionals.ignoreZeroSizeFolders` | Moved up one level |
| `neverWatchPaths[]` | `rules[].neverWatchPath` | Moved into rules |
| `include.rootFolders[]` | `rules[].includeRootItem` | Combined with rootFiles |
| `include.rootFiles[]` | `rules[].includeRootItem` | Combined with rootFolders |
| *(not available)* | `rules[].viewable` | New property |

</div>

## Migration Steps

Follow these steps to migrate your configuration:

1. **Backup your config file**
   ```bash
   cp config.yaml config.yaml.backup
   ```

2. **Locate your sources** in the config file

3. **For each source with `exclude` or `include`:**
   - Replace `exclude:` or `include:` with `conditionals:`
   - Move `hidden` and `ignoreZeroSizeFolders` up one level (if present)
   - Create a `rules:` array
   - Convert each array entry into an individual rule object

4. **Convert `neverWatchPaths`:**
   - Move from source-level to inside `rules` array
   - Create one `neverWatchPath` rule per entry

5. **Convert `include.rootFolders` and `include.rootFiles`:**
   - Combine into single `includeRootItem` rules

6. **Test your configuration**
   ```bash
   ./filebrowser config check config.yaml
   ```

## Next Steps

- {{< doclink path="reference/fullconfig/" text="Full Configuration Reference" />}}
- {{< doclink path="advanced/source-configuration/sources/" text="Source Configuration Guide" />}}
- {{< doclink path="advanced/indexing/" text="Understanding Indexing" />}}

<style>
/* Comparison Grid */
.comparison-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: 1.5em;
  margin: 2em 0;
}

.comparison-card {
  padding: 1.5em;
  border-radius: 8px;
  border: 2px solid var(--gray-300);
}

.comparison-card.old-format {
  border-color: #ef4444;
  background: rgba(239, 68, 68, 0.05);
}

.comparison-card.new-format {
  border-color: #10b981;
  background: rgba(16, 185, 129, 0.05);
}

.comparison-card h4 {
  margin-top: 0;
  margin-bottom: 1em;
  font-size: 1.1em;
}

.comparison-card.old-format h4 {
  color: #ef4444;
}

.comparison-card.new-format h4 {
  color: #10b981;
}

/* Migration Table */
.migration-table {
  margin: 2em 0;
  overflow-x: auto;
}

.migration-table table {
  width: 100%;
  border-collapse: collapse;
}

.migration-table th,
.migration-table td {
  padding: 0.75em;
  text-align: left;
  border: 1px solid var(--gray-300);
}

.migration-table th {
  background: var(--surfaceSecondary);
  font-weight: 600;
}

.migration-table code {
  background: var(--surfaceSecondary);
  padding: 0.2em 0.4em;
  border-radius: 3px;
  font-size: 0.9em;
}

/* Pattern Cards */
.pattern-card {
  margin: 1.5em 0;
  padding: 1.5em;
  border-left: 4px solid var(--primary);
  background: rgba(14, 165, 233, 0.06);
  border-radius: 4px;
}

.pattern-card h4 {
  margin-top: 0;
  margin-bottom: 1em;
  color: var(--primary);
}

.pattern-card strong {
  display: block;
  margin-top: 1em;
  margin-bottom: 0.5em;
  color: var(--textPrimary);
}

/* Benefits Grid */
.benefits-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 1.5em;
  margin: 2em 0;
}

.benefit-card {
  padding: 1.5em;
  border: 1px solid var(--gray-300);
  border-radius: 8px;
  background: var(--surfaceSecondary);
}

.benefit-card h4 {
  margin-top: 0;
  margin-bottom: 0.75em;
  color: var(--primary);
  font-size: 1.1em;
}

.benefit-card p {
  margin: 0;
  color: var(--textSecondary);
  line-height: 1.5;
}

.benefit-card code {
  background: rgba(14, 165, 233, 0.1);
  padding: 0.2em 0.4em;
  border-radius: 3px;
  font-size: 0.9em;
}

/* Dark mode support */
[data-dark-mode] .comparison-card {
  border-color: var(--gray-700);
}

[data-dark-mode] .comparison-card.old-format {
  border-color: #dc2626;
  background: rgba(220, 38, 38, 0.1);
}

[data-dark-mode] .comparison-card.new-format {
  border-color: #059669;
  background: rgba(5, 150, 105, 0.1);
}

[data-dark-mode] .pattern-card {
  background: rgba(14, 165, 233, 0.12);
}

[data-dark-mode] .benefit-card {
  background: rgba(255, 255, 255, 0.03);
  border-color: var(--gray-700);
}

[data-dark-mode] .migration-table th,
[data-dark-mode] .migration-table td {
  border-color: var(--gray-700);
}

/* Responsive */
@media (max-width: 768px) {
  .comparison-grid {
    grid-template-columns: 1fr;
  }

  .benefits-grid {
    grid-template-columns: 1fr;
  }
}
</style>