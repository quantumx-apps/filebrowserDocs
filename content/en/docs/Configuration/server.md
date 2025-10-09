---
title: "Server Settings"
description: "Configure server options"
icon: "dns"
---

Configure server settings including port, address, database, and caching.

## Basic Server Configuration

```yaml
server:
  port: 80
  address: 0.0.0.0
  baseURL: ""
  database: "database.db"
  cacheDir: "tmp"
```

## Configuration Options

### port
Server port (default: 8080)

```yaml
server:
  port: 80
```

### address  
Bind address (default: 0.0.0.0 for all interfaces)

```yaml
server:
  address: 127.0.0.1  # Localhost only
```

### baseURL
Base URL for reverse proxy setups

```yaml
server:
  baseURL: "/filebrowser"
```

### database
Database file path (SQLite)

```yaml
server:
  database: "/var/lib/filebrowser/database.db"
```

### cacheDir
Temporary cache directory

```yaml
server:
  cacheDir: "/var/cache/filebrowser"
```

### internalUrl
Internal URL for integrations (OnlyOffice)

```yaml
server:
  internalUrl: "http://filebrowser:80"
```

### TLS Configuration

```yaml
server:
  tlsCert: "/path/to/cert.pem"
  tlsKey: "/path/to/key.pem"
```

### Performance Settings

```yaml
server:
  numImageProcessors: 4  # Parallel image processing workers
```

## Common Configurations

### Default (Development)

```yaml
server:
  port: 8080
  address: 0.0.0.0
```

### Production

```yaml
server:
  port: 443
  address: 0.0.0.0
  database: "/var/lib/filebrowser/database.db"
  cacheDir: "/var/cache/filebrowser"
  tlsCert: "/etc/ssl/certs/filebrowser.crt"
  tlsKey: "/etc/ssl/private/filebrowser.key"
```

### Behind Reverse Proxy

```yaml
server:
  port: 8080
  address: 127.0.0.1
  baseURL: "/files"
  internalUrl: "http://localhost:8080"
```

## Next Steps

- [Configure sources](/docs/configuration/sources/)
- [Set up authentication](/docs/configuration/authentication/)
- [Configure logging](/docs/configuration/logging/)

