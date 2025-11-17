---
title: "Configuration Migration"
description: "Migrate configuration from original FileBrowser"
icon: "settings_suggest"
---

Migrate your configuration from the original FileBrowser to Quantum.

## Configuration Format Changes

FileBrowser Quantum uses a YAML-based configuration file instead of command-line flags and database settings.

See {{< doclink path="getting-started/config" text="About FileBrowser Quantum config file" />}}

## Migration Process

### 1. Export Current Settings

If you are running original FileBrowser, note your current settings:

```bash
# Check command-line flags
ps aux | grep filebrowser

# Common flags to note:
# --port, --address, --baseurl, --database, --root
```

also reference your `config.json`

### 2. Create config.yaml

Create a new `config.yaml` file with your settings:

```yaml
server:
  port: 8080
  baseURL: "/"
  database: "data/database.db"
  sources:
    - name: "files"
      path: "/srv"

auth:
  methods:
    passwordAuth:
      enabled: true

userDefaults:
  permissions:
    modify: true
    share: true
```

### 3. Map Old Flags to New Config

| Original Flag | Quantum Config |
|--------------|----------------|
| `--port` | `server.port` |
| `--address` | `server.address` |
| `--baseurl` | `server.baseURL` |
| `--database` | `server.database` |
| `--root` | `server.sources[0].path` |
| `--log` | `server.logging[0].levels` |

## Features Removed

The following features from original FileBrowser are not available in Quantum:

- **Terminal** - Removed for security
- **Runners** - Removed (to be replaced with better job system)
- **Command line user management** - Use config file or API

## Next Steps

- {{< doclink path="configuration/sources/" text="Set up sources" />}}
- {{< doclink path="configuration/authentication/" text="Configure authentication" />}}
- {{< doclink path="configuration/frontend/" text="Customize frontend" />}}

