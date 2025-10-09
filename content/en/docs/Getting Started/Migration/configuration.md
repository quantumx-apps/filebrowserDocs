---
title: "Configuration Migration"
description: "Migrate configuration from original FileBrowser"
icon: "settings_suggest"
---

Migrate your configuration from the original FileBrowser to Quantum.

## Configuration Format Changes

FileBrowser Quantum uses a YAML-based configuration file instead of command-line flags and database settings.

## Migration Process

### 1. Export Current Settings

If running original FileBrowser, note your current settings:

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
  database: "/database/database.db"
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

### 4. Environment Variables

Original environment variables need updating:

| Original | Quantum |
|----------|---------|
| `FB_PORT` | `FILEBROWSER_SERVER_PORT` |
| `FB_BASEURL` | `FILEBROWSER_SERVER_BASEURL` |
| `FB_DATABASE` | `FILEBROWSER_SERVER_DATABASE` |

## Features Removed

The following features from original FileBrowser are not available in Quantum:

- **Terminal** - Removed for security
- **Runners** - Removed (replaced with better job system)
- **Command line user management** - Use config file or API

## New Required Settings

FileBrowser Quantum requires:

```yaml
server:
  cacheDir: "/tmp/filebrowser"  # Mandatory cache directory
```

## Docker Migration

Update your docker-compose.yml:

**Original:**
```yaml
environment:
  - FB_PORT=8080
  - FB_BASEURL=/
  - FB_DATABASE=/database.db
```

**Quantum:**
```yaml
volumes:
  - ./config.yaml:/config.yaml
command: ["-c", "/config.yaml"]
```


## Next Steps

- [Set up sources](/docs/configuration/sources/)
- [Configure authentication](/docs/configuration/authentication/)
- [Customize frontend](/docs/configuration/frontend/)

