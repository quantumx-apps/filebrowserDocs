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

### baseURL
Base URL -- primarily for reverse proxy

```yaml
server:
  baseURL: "/filebrowser"
```

### database
Database file path

```yaml
server:
  database: "data/database.db"
```

### cacheDir
Temporary cache directory for file operations

{{% alert context="warning" %}}
**unRAID Users**: If you're using unRAID, you must mount a volume for the cache directory. The default container user (if not uid 1000) needs write access to this directory.
{{% /alert %}}

The `cacheDir` is a critical configuration that defines where FileBrowser stores temporary files during various operations. This directory is used for:

- **Chunked file uploads**: Each upload chunk is temporarily stored here before being assembled
- **Image preview generation**: Thumbnails and processed images are cached
- **Archive operations**: ZIP extraction and compression temporary files
- **Document processing**: Temporary files during PDF/image conversion
- **Video processing**: Some media files during video operations

```yaml
server:
  cacheDir: "data/temp"
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
Internal URL for integrations (Currently just OnlyOffice)

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

## Next Steps

- {{< doclink path="configuration/sources/" text="Configure sources" />}}
- {{< doclink path="configuration/authentication/" text="Set up authentication" />}}
- {{< doclink path="configuration/logging/" text="Configure logging" />}}

