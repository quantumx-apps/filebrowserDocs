---
title: "Sources"
description: "Configure file system sources"
icon: "folder_open"
order: 3
---

Sources are the core concept in FileBrowser - each source represents a file system location users can access.


{{% alert context="warning" %}}
A source should not be a root directory or include "/var" directory on linux.
{{% /alert %}}

## Basic Configuration

### Single Source

```yaml
server:
  sources:
    - path: "/path/to/files" # Do not use a root "/" directory or include the "/var" folder
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

## Source Configuration Options

### path
File system path. Can be relative or absolute. Required.

```yaml
server:
  sources:
    - path: "/data/files"
```

### name
Display name for the source. Optional. If not set, uses the base name of the path.

```yaml
server:
  sources:
    - path: "/data/files"
      name: "My Files"
```

### config.defaultEnabled
Should be added as a default source for new users? Default: `false`.

```yaml
server:
  sources:
    - path: "/data/files"
      config:
        defaultEnabled: true
```

### config.defaultUserScope

This is the directory path that a user is given access to by default. This is also the parent directory path used if you enable `createUserDir`.

For example if the source is `/`, and you configure `defaultUserScope: /users` and also enable `createUserDir`, then a user named `graham` will have a scope directory created at `/users/graham` and that will be their root directory.

Defaults to root of index `/`. Should match folders under path. Used when `createUserDir` is `false`.

```yaml
server:
  sources:
    - path: "/home/users"
      config:
        defaultUserScope: "/"
```

### config.createUserDir
Create a user directory for each user under `defaultUserScope` + `/`+ `username`. Default: `false`.

```yaml
server:
  sources:
    - path: "/home/users"
      config:
        defaultEnabled: true
        createUserDir: true
        defaultUserScope: "/"
```

This creates `/home/users/username` for each user. For example, a user `graham` would get a folder created at `/home/users/graham` and that would be their user scope. They wouldn't be able to access `/home/users/` folder.

### config.denyByDefault
Deny access unless an "allow" access rule was specifically created. Default: `false`.

```yaml
server:
  sources:
    - path: "/data"
      config:
        denyByDefault: true
```

See {{< doclink path="access-control/rules/" text="Access Rules" />}} for more information.

### config.private
Designate source as private -- currently just means no sharing permitted. Default: `false`.

```yaml
server:
  sources:
    - path: "/private/data"
      config:
        private: true
```

### config.disabled
Disable the source. Useful so you don't need to remove it from the config file. Default: `false`.

```yaml
server:
  sources:
    - path: "/old/data"
      config:
        disabled: true
```

### config.useLogicalSize
Calculate sizes based on logical size instead of disk utilization (du -sh). Folders will be 0 bytes when empty. Default: `false`.

```yaml
server:
  sources:
    - path: "/data"
      config:
        useLogicalSize: false
```

### config.rules
List of item rules to apply to specific paths. See {{< doclink path="advanced/source-configuration/sources" text="Advanced Source Configuration" />}} for detailed information on rule options.

```yaml
server:
  sources:
    - path: "/data"
      config:
        rules:
          - neverWatchPath: ""
            includeRootItem: ""
            fileStartsWith: ""
            folderStartsWith: ""
            fileEndsWith: ""
            folderEndsWith: ""
            folderPath: ""
            filePath: ""
            fileName: ""
            folderName: ""
            viewable: false
            ignoreHidden: false
            ignoreZeroSizeFolders: false
            ignoreSymlinks: false
```

{{% alert context="info" %}}
**Note on `ignoreSymlinks`:** FileBrowser Quantum does not follow symbolic links during indexing by default. The `ignoreSymlinks` option allows you to exclude symlinks from the index entirely. See {{< doclink path="features/indexing/#symbolic-links" text="Symbolic Links documentation" />}} for more information.
{{% /alert %}}

## Next Steps

- {{< doclink path="advanced/source-configuration/sources" text="Advanced Source Configuration" />}}
- {{< doclink path="configuration/authentication/" text="Configure authentication" />}}
- {{< doclink path="configuration/users/" text="Manage users" />}}
- {{< doclink path="access-control/rules/" text="Set up access rules" />}}

