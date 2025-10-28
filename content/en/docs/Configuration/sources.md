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
    - path: "/path/to/source1" # enabled for all users
      name: "My Files"
      config:
        defaultEnabled: true
    - path: "/path/to/source2" # not default enabled!
      name: "Secured Files"
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

- {{< doclink path="advanced/source-configuration/sources" text="Advanced Source Configuration" />}}
- {{< doclink path="configuration/authentication/" text="Configure authentication" />}}
- {{< doclink path="configuration/users/" text="Manage users" />}}
- {{< doclink path="access-control/rules/" text="Set up access rules" />}}

