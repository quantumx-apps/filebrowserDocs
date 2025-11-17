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

When only one source is configured, source paths will be available at `http://your-server/files/path/to/file`.

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

When multiple sources are configured, source paths include the souree name. For example `http://your-server/files/My%20Files/path/to/file`.

## Common Patterns

### Personal User Directories

Creating user directories for each user where 

```yaml
server:
  sources:
    - path: "/home/users"
      config:
        defaultEnabled: true
        createUserDir: true
        #defaultUserScope: "/" # when createUserDir is false
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
        private: true
```

## Next Steps

- {{< doclink path="advanced/source-configuration/sources" text="Advanced Source Configuration" />}}
- {{< doclink path="configuration/authentication/" text="Configure authentication" />}}
- {{< doclink path="configuration/users/" text="Manage users" />}}
- {{< doclink path="access-control/rules/" text="Set up access rules" />}}

