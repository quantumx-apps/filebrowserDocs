---
title: "Sources"
description: "Configure file system sources"
icon: "folder_open"
---

Sources are the core concept in FileBrowser - each source represents a file system location users can access.

## Basic Configuration

### Single Source

```yaml
server:
  sources:
    - path: "/path/to/files"
      config:
        defaultEnabled: true
auth:
  adminUsername: admin
```

### Multiple Sources

```yaml
server:
  port: 80
  sources:
    - path: "/path/to/source1"
    - path: "/path/to/source2"
```

## Source Configuration Options

```yaml
server:
  sources:
    - path: "/mnt/folder"
      name: "mysource"              # Optional display name
      config:
        defaultEnabled: false       # Give to all users by default
        defaultUserScope: "/"       # Default access scope
        createUserDir: false        # Auto-create user directories
        disableIndexing: false      # Disable search indexing
        denyByDefault: false        # Deny all access unless explicitly allowed
```

## Understanding Defaults

### defaultEnabled
Controls which users get access automatically.

### defaultUserScope  
Sets the default directory for new users.

### createUserDir
When `true`, creates `/path/username` directories automatically and scopes users to their directory.

## Exclusion Rules

Exclude specific files and folders:

```yaml
server:
  sources:
    - path: "/mnt/folder"
      config:
        exclude:
          filePaths:
            - "myfile.txt"
            - "subfolder/another.txt"
          folderPaths:
            - "subfolder/ignoreMe"
          fileNames:
            - "ignoreMe.txt"
          folderNames:
            - "ignoreAllFolders"
          fileEndsWith:
            - ".zip"
            - ".tar.gz"
          folderEndsWith:
            - "-backups"
```

## Common Patterns

### Personal User Directories

```yaml
server:
  sources:
    - path: "/home/users"
      config:
        defaultEnabled: true
        createUserDir: true
        defaultUserScope: "/"
```

### Shared + Personal

```yaml
server:
  sources:
    - path: "/shared/common"
      name: "Shared Files"
      config:
        defaultEnabled: true
    - path: "/shared/users"
      name: "My Files"
      config:
        defaultEnabled: true
        createUserDir: true
```

## Next Steps

- [Configure authentication](/docs/configuration/authentication/)
- [Manage users](/docs/configuration/users/)
- [Set up access rules](/docs/access-control/rules/)

