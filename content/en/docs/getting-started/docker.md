---
title: "Docker"
description: "Get started with FileBrowser using Docker"
icon: "deployed_code"
---

The fastest way to get started with FileBrowser Quantum.

## Available Images

Images from Docker Hub (`gtstef/filebrowser`) and GitHub Container Registry (`ghcr.io/gtsteffaniak/filebrowser`):

| Tag | Size | Features | Architectures |
|-----|------|----------|---------------|
| `latest`, `stable` | 60 MB | FFmpeg + document preview | arm64, amd64 |
| `stable-slim` | 15 MB | Core service only (no media/office) | arm64, arm32, amd64 |
| `beta` | 60 MB | FFmpeg + document preview | arm64, amd64 |
| `beta-slim` | 15 MB | Core service only (no media/office) | arm64, arm32, amd64 |

### Version Tags

In addition to the release type tags above, Docker images are also tagged with version numbers for more precise version control:

- **Full version tags**: `1.2.5-stable`, `1.1.3-beta` - Pin to a specific version
- **Major.minor tags**: `1.2-stable`, `1.1-beta` - Automatically receive patch updates within that minor version
- **Major tags**: `1-stable`, `2-beta` - Automatically receive all updates within that major version

The same versioning applies to slim images (e.g., `1.2.5-stable-slim`, `1.2-stable-slim`, `1-stable-slim`).

{{% alert context="info" %}}
**Recommended**: Use major.minor tags (e.g., `1.2-stable`) for production deployments. This ensures you receive important bug fixes and security patches while avoiding unexpected major version changes.
{{% /alert %}}

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

Create a `data` directory and add a new `config.yaml` file in the same directory:

```bash
mkdir data && touch data/config.yaml
```

Then fill out your config as needed, for example:
```yaml
server:
  sources:
    - path: /folder
      config:
        defaultEnabled: true
```

### Step 3: Create Docker Compose

{{% alert context="info" %}}
By default the config path is `./config.yaml`, but its recommended to use `FILEBROWSER_CONFIG` on docker to override this so you can mount a single folder as a volume with config and database.
{{% /alert %}}

Create `docker-compose.yaml`:

```yaml
services:
  filebrowser:
    image: gtstef/filebrowser:beta
    environment:
      FILEBROWSER_CONFIG: "data/config.yaml" # overrides the default path which is ./config.yaml
      FILEBROWSER_ADMIN_PASSWORD: "change-me"
      # TZ: "America/New_York"
    volumes:
      - /path/to/your/files:/folder # Do not use a root "/" directory or include the "/var" folder
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

FileBrowser Quantum docker images have a non-default  `filebrowser` user built-in. This user has UID:GID of 1000:1000. You can use it by specifying a user in docker compose.

Add to docker-compose.yaml:

```yaml
services:
  filebrowser:
    environment:
      FILEBROWSER_CONFIG: "data/config.yaml" # overrides the default path which is ./config.yaml
    user: filebrowser
    volumes:
      - /path/to/files:/folder
      - ./data:/home/filebrowser/data
```

You can also specify any user UID:GID, but you will also need to mount a temp directory that the user has filesystem permissions to. ({{< doclink path="configuration/server#cachedir" text="See cacheDir config" />}})


```yaml
services:
  filebrowser:
    environment:
      FILEBROWSER_CONFIG: "data/config.yaml" # overrides the default path which is ./config.yaml
    user: "${UID}:${GID}" # Using environment variables for flexibility
    volumes:
      - /path/to/files:/folder
      - ./data:/home/filebrowser/data
      - ./tmp:/home/filebrowser/tmp  # Required if uid other than 1000
```

## Next Steps

- {{< doclink path="configuration/sources/" text="Configure sources" />}}
- {{< doclink path="configuration/users/" text="Set up users" />}}
- {{< doclink path="integrations/" text="Enable integrations" />}}

