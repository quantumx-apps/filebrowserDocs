---
title: "Docker"
description: "Get started with FileBrowser using Docker"
icon: "sailing"
---

The fastest way to get started with FileBrowser Quantum.

## Available Images

Images from Docker Hub (`gtstef/filebrowser`) and GitHub Container Registry (`ghcr.io/gtsteffaniak/filebrowser`):

| Tag | Size | Features | Architectures |
|-----|------|----------|---------------|
| `latest`, `beta` | 60 MB | FFmpeg + document preview | arm64, amd64 |
| `beta-slim` | 15 MB | Core only (no media/office) | arm64, arm32, amd64 |
| `dev` | 60 MB | Unstable development | arm64, amd64 |

## Quick Try

Test without persistence (changes not saved):

```bash
docker run -d \
  -v /path/to/your/folder:/srv \
  -p 80:80 \
  gtstef/filebrowser:beta
```

Access at `http://localhost` with `admin` / `admin`

## Production Setup with Docker Compose

### Step 1: Create Structure

```bash
mkdir -p filebrowser/data
cd filebrowser
```

### Step 2: Create Config

Create `data/config.yaml`:

```yaml
server:
  sources:
    - path: /folder
      config:
        defaultEnabled: true
auth:
  adminUsername: admin
```

### Step 3: Create Docker Compose

Create `docker-compose.yaml`:

```yaml
services:
  filebrowser:
    image: gtstef/filebrowser:beta
    environment:
      FILEBROWSER_CONFIG: "data/config.yaml"
      FILEBROWSER_ADMIN_PASSWORD: "change-me"
      # TZ: "America/New_York"
    volumes:
      - /path/to/your/files:/folder
      - ./data:/home/filebrowser/data
    ports:
      - 80:80
    restart: unless-stopped
```

### Step 4: Start

```bash
docker compose up -d
```

## Running as Non-Root

Add to docker-compose.yaml:

```yaml
services:
  filebrowser:
    user: filebrowser
    volumes:
      - /path/to/files:/folder
      - ./data:/home/filebrowser/data
      - ./tmp:/home/filebrowser/tmp  # Required for non-root
```

Update config.yaml:

```yaml
server:
  cacheDir: /home/filebrowser/tmp
```

## Next Steps

- [Configure sources](/docs/configuration/sources/)
- [Set up users](/docs/configuration/users/)
- [Enable integrations](/docs/integrations/)

