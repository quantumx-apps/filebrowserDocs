---
title: "Server Settings"
description: "Configure server options"
icon: "dns"
order: 2
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

### listen
Server listen address (default: 0.0.0.0)

```yaml
server:
  listen: "localhost" # override the default 0.0.0.0
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

### maxArchiveSize

FileBrowser limits the maxiumum size of archive -- this affects folder downloads. This is limited to 50GB by default, which means the pre-archive combined size of a directory to be downloaded must be 50GB or less. This is necessary because archiving will store temporary files
and that could exhaust the server if left unlimited.

Ensure you have enough free space available if you choose to increase this further.

```yaml
server:
  maxArchiveSize: 50 # max pre-archive combined size of files/folder that are allowed to be archived (in GB)
```

### cacheDir

The `cacheDir` is a critical configuration that defines where FileBrowser stores temporary files during various operations. By default, a `tmp` folder is created in the same directory as the program is run, but this may not be ideal. For example unRAID uses a different user by default and that causes permission issues with the default cache directory creation process.

#### Important Considerations

{{% alert context="warning" %}}
**Permissions**: The user running the FileBrowser process must have read/write permissions on the cache directory. This is especially critical in Docker environments.

**Disk Space**: The cache directory can grow significantly during large file operations. Monitor disk usage and ensure adequate space. If you are using docker -- consider mounting a sufficient volume for temp directory if you need more space.

**Reliable**: Must be available and not tampered with during operation. Make sure its not in a location that could be moved or modified by accident. Do not use network locations!

**unRAID Users**: If you're using unRAID, you must mount a volume for the cache directory. The default container user (if not uid 1000) needs write access to this directory.

{{% /alert %}}


The cacheDir is used by:

- **Chunked file uploads**: Each upload chunk is temporarily stored here before being assembled
- **Image preview generation**: Thumbnails and processed images are cached
- **Archive operations**: ZIP extraction and compression temporary files
- **Document processing**: Temporary files during PDF/image conversion
- **Video processing**: Some media files during video operations

```yaml
server:
  cacheDir: "tmp" # this is default when not configured.
```

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
Internal URL for integrations to access filebrowser (Currently just OnlyOffice)

this could be a docker network dns name or a local IP address on the network. This address should allow the integration to communicate directly with the service.

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

