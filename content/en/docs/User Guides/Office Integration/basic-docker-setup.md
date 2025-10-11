---
title: "Basic Docker Setup"
description: "Simple OnlyOffice setup with Docker for local development"
icon: "square"
---

Complete setup for running FileBrowser Quantum with OnlyOffice using Docker Compose on your local network.

{{% alert context="warning" %}}
This guide uses HTTP which is **not secure** for production. Only use for local development or testing. For production deployments with HTTPS, see the {{< doclink path="user-guides/office-integration/traefik-https/" text="Traefik HTTPS guide" />}}.
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
    restart: unless-stopped

  onlyoffice:
    image: onlyoffice/documentserver:latest
    container_name: onlyoffice
    ports:
      - "80:80"
    environment:
      - JWT_ENABLED=true
      - JWT_SECRET=TevrjpRNMmKC0JxAwY7iZ2VXLrvG1gue  # Replace with your secret
      - JWT_HEADER=Authorization
    restart: unless-stopped
```

### Step 3: Create FileBrowser Configuration

Create a `config.yaml` file in the same directory:

```yaml
server:
  port: 80
  sources:
    - name: "files"
      path: "/srv"
      config:
        defaultEnabled: true

integrations:
  office:
    url: "http://localhost"  # OnlyOffice accessible from browser
    secret: "TevrjpRNMmKC0JxAwY7iZ2VXLrvG1gue"  # Same secret as OnlyOffice
    viewOnly: false
```

### Step 4: Start Services

```bash
# Start services in background
docker-compose up -d
```

Wait for OnlyOffice to fully start (takes 30-60 seconds on first run).

### Step 5: Verify Installation

**Check OnlyOffice Health:**
```bash
# Should return {"status":"ok"}
curl http://localhost/healthcheck

# Check welcome page
curl http://localhost/welcome
```

**Check FileBrowser:**
1. Open browser and navigate to `http://localhost:8080`
2. Login with default credentials (admin/admin)
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

- **Production Setup**: See {{< doclink path="user-guides/office-integration/traefik-https/" text="Traefik HTTPS Guide" />}} for secure deployment
- **Advanced Labels**: See {{< doclink path="user-guides/office-integration/traefik-labels/" text="Traefik Labels Guide" />}} for complete Traefik configuration
- **Troubleshooting**: See {{< doclink path="integrations/office/troubleshooting/" text="Office Troubleshooting" />}} for detailed solutions
- **Configuration**: See {{< doclink path="integrations/office/configuration/" text="Office Configuration" />}} for all available options

## Additional Resources

- [OnlyOffice Docker Documentation](https://github.com/ONLYOFFICE/Docker-DocumentServer)
- {{< doclink path="configuration/" text="FileBrowser Configuration Reference" />}}
- [Docker Compose Documentation](https://docs.docker.com/compose/)

