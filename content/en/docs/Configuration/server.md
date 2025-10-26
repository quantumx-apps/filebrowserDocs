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
Temporary cache directory for file operations

{{% alert context="warning" %}}
**unRAID Users**: If you're using unRAID, you must mount a volume for the cache directory. The default container user (uid 1000) needs write access to this directory.
{{% /alert %}}

The `cacheDir` is a critical configuration that defines where FileBrowser stores temporary files during various operations. This directory is used for:

- **Chunked file uploads**: Each upload chunk is temporarily stored here before being assembled
- **Image preview generation**: Thumbnails and processed images are cached
- **Archive operations**: ZIP extraction and compression temporary files
- **Document processing**: Temporary files during PDF/image conversion
- **Video processing**: Some media files during video operations

```yaml
server:
  cacheDir: "/home/filebrowser/data/temp"
```

#### Important Considerations

{{% alert context="warning" %}}
**Permissions**: The FileBrowser process must have read/write/execute permissions on the cache directory. This is especially critical in Docker environments.
{{% /alert %}}

{{% alert context="warning" %}}
**Disk Space**: The cache directory can grow significantly during large file operations. Monitor disk usage and ensure adequate space. If you are using docker -- consider mounting a sufficient volume for temp directory if you need more space.
{{% /alert %}}

#### Docker Examples

**Basic Docker Setup:**
```yaml
# docker-compose.yaml
services:
  filebrowser:
    image: gtstef/filebrowser:beta
    volumes:
      - '/path/to/your/data:/srv'
      - '/var/cache/filebrowser:/tmp/filebrowser'  # Mount cache directory
    environment:
      FILEBROWSER_CONFIG: "/config/config.yaml"
```

**Corresponding config.yaml:**

```yaml
server:
  cacheDir: /tmp/filebrowser # corrosponds to above
```

**With Non-Root User (Recommended):**
```yaml
# docker-compose.yaml
services:
  filebrowser:
    image: gtstef/filebrowser:beta
    user: filebrowser  # Run as non-root user
    volumes:
      - '/path/to/your/data:/srv'
      - './cache:/home/filebrowser/cache'  # Mount cache directory
      - './data:/home/filebrowser/data'     # Mount data directory
    environment:
      FILEBROWSER_CONFIG: "/home/filebrowser/data/config.yaml"
```

**Corresponding config.yaml:**
```yaml
server:
  cacheDir: "/home/filebrowser/cache" # corrosponds to above
```

#### Troubleshooting

**Permission Issues:**

By default, filebrowser uses uid 1000 for the user (you can change that):
```bash
# Fix permissions for cache directory
sudo chown -R 1000:1000 /var/cache/filebrowser
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

- {{< doclink path="configuration/sources/" text="Configure sources" />}}
- {{< doclink path="configuration/authentication/" text="Set up authentication" />}}
- {{< doclink path="configuration/logging/" text="Configure logging" />}}

