---
title: "Docker"
description: "Get started with FileBrowser using Docker"
icon: "deployed_code"
order: 1
---

The fastest way to get started with FileBrowser Quantum.

## Available Images

Images from Docker Hub (`gtstef/filebrowser`) and GitHub Container Registry (`ghcr.io/gtsteffaniak/filebrowser`):

| Tag                | Size  | Features                            | Architectures       |
| ------------------ | ----- | ----------------------------------- | ------------------- |
| `latest`, `stable` | 60 MB | FFmpeg + document preview           | arm64, amd64        |
| `stable-slim`      | 15 MB | Core service only (no media/office) | arm64, arm32, amd64 |
| `beta`             | 60 MB | FFmpeg + document preview           | arm64, amd64        |
| `beta-slim`        | 15 MB | Core service only (no media/office) | arm64, arm32, amd64 |

Learn more about the versions and tags {{< doclink path="getting-started/version#docker-version-tags" text="here." />}}

## Quick Try

Test without persistence (changes not saved). In this example we run it mounting the local path:

```bash
docker run -d \
  -v $(pwd):/srv \
  -p 80:80 \
  gtstef/filebrowser:stable
```

Access at `http://localhost` with `admin` / `admin`

## Basic Setup with Docker Compose

{{% alert context="warning" %}}
This set up is just to get the feel of FileBrowser before you get into customization, defining access control, etc. For regular use, Check out the slightly upgraded guide {{< doclink path="user-guides/other/standalone" text="here." />}}
{{% /alert %}}


### Step 1: Create a base folder for FileBrowser

```bash
mkdir -p filebrowser/data && cd filebrowser
```

{{% alert context="info" %}}
**Default Config Location**: In Docker, the default config location is `/home/filebrowser/data/config.yaml`. So we create a `data` directory so we can mount the config, database files, and cacheDir in the same volume. If you don't want to follow this process, you can use {{< doclink path="reference/environment-variables" text="environment variables" />}} to set the config path and database path manually.
{{% /alert %}}

### Step 2: Create Config

Add a `config.yaml` file inside the `data` directory:

```bash
touch ./data/config.yaml
```

Then fill out your config as needed, for example:

```yaml
server:
  cacheDir: /home/filebrowser/data/tmp # using the data volume so it can persist across restarts
  sources:
    - path: /folder # Do not use a root "/" directory or include the "/var" folder
      config:
        defaultEnabled: true
```

{{% alert context="info" %}}
**Important**: Source path specified in the `config.yaml` are in terms of container point of view. ({{< doclink path="getting-started/config" text="Check this page for more information on configurations." />}})
{{% /alert %}}

### Step 3: Create Docker Compose

Create `docker-compose.yaml` in the  directory.

```bash
touch docker-compose.yaml
```

Then type in the below docker configuration.

```yaml
services:
  filebrowser:
    image: gtstef/filebrowser:stable
    volumes:
      - /path/to/your/folder:/folder # Do not use a root "/" directory or include the "/var" folder
      - ./data:/home/filebrowser/data
    ports:
      - 80:80 # exposes port 80 to host, the left-side number can be changed without config.yaml changes.
    restart: unless-stopped
```

### Step 4: Start

```bash
docker compose up -d
```

### Healthcheck Configuration

{{% alert context="warning" %}}
This is only needed if you change the `server.port` in the `config.yaml` -- this is not needed for the above guide where the port remains `80` in the `config.yaml`
{{% /alert %}}

The FileBrowser Docker image includes a default healthcheck that uses port 80:

```dockerfile
HEALTHCHECK --interval=30s --timeout=3s --start-period=10s --retries=3 \
  CMD curl -f http://localhost:80/health || exit 1
```

If you configure FileBrowser to use a different port in your `config.yaml`, you must override the healthcheck in your `docker-compose.yaml` to match:

```yaml
services:
  filebrowser:
    image: gtstef/filebrowser:stable
    volumes:
      - /path/to/your/folder:/folder
      - ./data:/home/filebrowser/data
    ports:
      - 80:8080  # Filebrowser listens on 8080 inside docker, but here we are exposing the host port as 80 still.
    healthcheck:
      test: ["CMD", "curl", "-f", "http://localhost:8080/health"] # port should match the internal port 8080 
      interval: 30s
      timeout: 3s
      start_period: 10s
      retries: 3
    restart: unless-stopped
```

**Healthcheck options:**
- `test` - Command to run (must match your configured port)
- `interval` - Time between health checks (default: 30s)
- `timeout` - Time to wait for response (default: 3s)
- `start_period` - Grace period on startup (default: 10s)
- `retries` - Number of failures before marking unhealthy (default: 3)

## Database Location

{{% alert context="info" %}}
**Default Database Location**: In Docker, the default database location is `/home/filebrowser/data/database.db`. This is different from the standalone default of `./database.db` in the current directory.

To persist your database, mount a volume to `/home/filebrowser/data`:

```yaml
services:
  filebrowser:
    image: gtstef/filebrowser:stable
    volumes:
      - /path/to/files:/folder
      - ./data:/home/filebrowser/data  # Database and config stored here
```

See {{< doclink path="configuration/server/#database" text="Server configuration" />}} and {{< doclink path="getting-started/config/#how-to-specify-a-config-file" text="configuration file priority" />}} for more information on database paths.
{{% /alert %}}

## Running container with a different user

{{% alert context="info" %}}
On `v1.2.x` and earlier, the default user is `root`.
On `v1.3.x` and later, the default user is `filebrowser` (1000:1000).
{{% /alert %}}

FileBrowser Quantum docker images have a non-default `filebrowser` user built-in. This user has UID:GID of 1000:1000. In `v1.2.x` and earlier you need to specify this user manually:

Add to docker-compose.yaml:
```yaml
services:
  filebrowser:
    image: gtstef/filebrowser:stable
    user: filebrowser
    volumes:
      - /path/to/files:/folder
      - ./data:/home/filebrowser/data
    ports:
      - 80:80
    restart: unless-stopped
```

You can also specify any user UID:GID, but if you choose a UID other than 1000, you will need to make sure the mounted `data` directory has the same permissions ({{< doclink path="configuration/server#cachedir" text="See cacheDir config" />}})

for example if you wanted to use `1001:1001` user for Unraid installs.
```bash
chown -R 1001:1001 ./data
```

## Next Steps

- {{< doclink path="configuration/sources/" text="Configure sources" />}}
- {{< doclink path="configuration/users/" text="Set up users" />}}
- {{< doclink path="integrations/" text="Enable integrations" />}}

