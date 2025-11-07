---
title: "Basic Docker Setup"
description: "Simple OnlyOffice setup with Docker for local development"
icon: "deployed_Code"
---

Complete setup for running FileBrowser Quantum with OnlyOffice using Docker Compose on your local network.

{{% alert context="warning" %}}
This guide uses HTTP which is **not secure** for production. Only use for local development or testing. For production deployments with HTTPS, see {{< doclink path="user-guides/office-integration/traefik-setup/" text="Traefik Setup" />}} or {{< doclink path="user-guides/office-integration/traefik-https/" text="Traefik with self-signed certificates" />}}.
{{% /alert %}}

## Prerequisites

- Docker and Docker Compose installed
- Basic understanding of Docker networking
- FileBrowser Quantum image: `gtstef/filebrowser`

## Quick Start

### Step 1: Generate JWT Secret

First, generate a strong secret for securing communication between FileBrowser and OnlyOffice:

```bash
# Method 1: Using OpenSSL
openssl rand -base64 32

# Example output:
# TevrjpRNMmKC0JxAwY7iZ2VXLrvG1gue
```

{{% alert context="info" %}}
Save this secret - you'll need it for both FileBrowser and OnlyOffice configuration.
{{% /alert %}}

### Step 2: Create Docker Compose File

Create a `docker-compose.yml` file:

```yaml
services:
  filebrowser:
    image: gtstef/filebrowser:latest
    ports:
      - "8080:80"
    volumes:
      - ./data:/home/filebrowser/data
      - ./data/config.yaml:/home/filebrowser/config.yaml
      - ./:/srv # Replace "./" with your file path, but leave ":/srv" on the right side
    restart: unless-stopped

  onlyoffice:
    image: onlyoffice/documentserver:latest
    container_name: onlyoffice
    ports:
      - "80:80"
    environment:
      - JWT_SECRET=TevrjpRNMmKC0JxAwY7iZ2VXLrvG1gue  # Replace with your secret
    restart: unless-stopped
```

### Step 3: Create FileBrowser Configuration

Create a `data` directory and add a new `config.yaml` file in the same directory:

```bash
mkdir data && touch data/config.yaml
```

Then populate the config

```yaml
server:
  port: 80
  database: data/database.db
  internalUrl: "http://filebrowser" # corrosponds to the filebrowser container name
  sources:
    - name: "files"
      path: "/srv" # corrosponds to the docker volume
      config:
        defaultEnabled: true

auth:
  adminPassword: yourpassword

integrations:
  office:
    url: "http://localhost"  # OnlyOffice accessible from browser
    internalUrl: "http://onlyoffice" # corrosponds to the onlyoffice container name
    secret: "TevrjpRNMmKC0JxAwY7iZ2VXLrvG1gue"  # Same secret as OnlyOffice
    viewOnly: false

userDefaults:
  preview:
    highQuality: true
    image: true
    video: true
    motionVideoPreview: true
    office: true
    popup: true
    folder: true
  permissions:
    api: false
    admin: false
    modify: false
    share: false
    realtime: false
    delete: false
    create: false
    download: true
  disableOnlyOfficeExt: ".md .txt .pdf"   # list of file extensions to disable onlyoffice editor for
```

### Step 4: Start Services

```bash
docker-compose up -d
```

Wait for OnlyOffice to fully start (takes 30-60 seconds on first run).

### Step 5: Verify Installation

If you are running docker compose on something like WSL or your local machine, you should be able to access http://localhost and see only office is ready

<img src="../office-welcome.png" alt="office" />

Or check via terminal:

**Check OnlyOffice Health:**
```bash
# Should return {"status":"ok"}
curl http://localhost/healthcheck

# Check welcome page
curl http://localhost/welcome
```

**Check FileBrowser:**
1. Open browser and navigate to `http://localhost:8080`
2. Login with default credentials (admin/yourpassword)
3. Upload a test document (`.docx`, `.xlsx`, or `.pptx`)
4. Click on the document to preview - should open in OnlyOffice editor

## Disable Editing for Specific Users

In FileBrowser user settings or config:

```yaml
integrations:
  office:
    viewOnly: true
```

## Next Steps

- **Production Setup**: See {{< doclink path="user-guides/office-integration/traefik-setup/" text="Traefik Full Setup Guide" />}} for complete services configuration ready for production.
- **Advanced Setup**: See {{< doclink path="user-guides/office-integration/traefik-https/" text="Traefik HTTPS Guide" />}} for advanced deployment using internal HTTPS for the services.
- **Troubleshooting**: See {{< doclink path="integrations/office/troubleshooting/" text="Office Troubleshooting" />}} for detailed solutions.
- **Configuration**: See {{< doclink path="integrations/office/configuration/" text="Office Configuration" />}} for all available options.

## Additional Resources

- [OnlyOffice Docker Documentation](https://github.com/ONLYOFFICE/Docker-DocumentServer)
- {{< doclink path="configuration/" text="FileBrowser Configuration Reference" />}}
- [Docker Compose Documentation](https://docs.docker.com/compose/)

