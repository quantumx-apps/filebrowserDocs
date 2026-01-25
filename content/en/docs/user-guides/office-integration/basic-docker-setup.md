---
title: "Basic Docker Setup"
description: "Simple OnlyOffice setup with Docker for local development"
icon: "deployed_Code"
---

Complete setup for running FileBrowser Quantum with OnlyOffice using Docker Compose on your local network.

{{% alert context="warning" %}}
This guide uses HTTP which is **not secure** for production. Only use for local development or testing. For production deployments with HTTPS. See {{< doclink path="user-guides/office-integration/traefik-setup/" text="Traefik Setup" />}}
{{% /alert %}}

## Prerequisites

- Docker and Docker Compose installed
- Basic understanding of Docker networking
- FileBrowser Quantum image: `gtstef/filebrowser`

## Quick Start

### Step 01: Generate JWT Secret

First, generate a strong secret for securing communication between FileBrowser and OnlyOffice:

```bash
# Using OpenSSL
openssl rand -base64 32

# Example output:
# TevrjpRNMmKC0JxAwY7iZ2VXLrvG1gue=
```

{{% alert context="info" %}}
Save this secret - you'll need it for both FileBrowser and OnlyOffice configuration.
{{% /alert %}}

### Step 02: Create Docker Compose File

Create a `docker-compose.yaml` file:

```yaml
services:
  filebrowser:
    image: gtstef/filebrowser:latest
    ports:
      - "8080:80"
    environment:
      FILEBROWSER_CONFIG: "data/config.yaml"
      FILEBROWSER_DATABASE: "data/database.db"
    user: filebrowser # non-root user
    volumes:
      - ./data:/home/filebrowser/data
      - /path/to/folder:/srv # Replace "/path/to/folder" with your desired path, you can also change the internal path '/srv' with another path.
    restart: unless-stopped

  onlyoffice:
    image: onlyoffice/documentserver:latest
    container_name: onlyoffice
    ports:
      - "8081:80" # You can do the same with the ports, you can replace "8081" in the left side if is used, but don't change the right side.
    environment:
      - JWT_SECRET=TevrjpRNMmKC0JxAwY7iZ2VXLrvG1gue=  # Replace with your generated secret
    restart: unless-stopped
```

### Step 03: Create FileBrowser Configuration

Create a `data` directory, and create two new files: 

- `config.yaml`: The configuration file that we will modify.  
- `database.db`: The database, used for store settings, users, and more. Is needed for persist them.

```bash
mkdir data && touch data/config.yaml && touch data/database.db
```

Then populate the config, see {{< doclink path="getting-started/config/" text="Getting started" />}}.

```yaml
server:
  port: 80 # Should be 80, this is the internal port.
  externalUrl: "http://localhost:8080" # External filebrowser URL
  internalUrl: "http://filebrowser:80" # The filebrowser container name with the internal port.
  sources:
    - name: "files" # You can change this name
      path: "/srv" # The docker volume for your files.
      config:
        defaultEnabled: true

auth:
  adminPassword: yourpassword # Change this with a strong password.

integrations:
  office:
    url: "http://localhost:8081"  # Office URL with the external port which should be accesible from browser -- You can use 'localhost' if you are in the same machine, but if you will use another device, use the IP adress of your machine with port. (eg. 192.168.1.128:8081)
    internalUrl: "http://onlyoffice:80" # This is the container name for only office docker service + its internal port.
    secret: "TevrjpRNMmKC0JxAwY7iZ2VXLrvG1gue="  # Same secret as OnlyOffice
    viewOnly: false

userDefaults:
  permissions:
    api: false
    admin: false
    modify: false
    share: false
    realtime: false
    delete: false
    create: false
    download: true
  disableOnlyOfficeExt: ".md .txt .pdf"   # List of file extensions to disable onlyoffice editor for - only applied to new users.
```

### Step 4: Start Services

```bash
docker-compose up -d
```

Wait for OnlyOffice to fully start (usually takes 30-60 seconds if you create or recreate the container).

### Step 5: Verify Installation

If you are running docker compose on something like WSL or your local machine, you should be able to access http://localhost:8081 and see only office is ready.

<img src="../assets/office-welcome.png" alt="office" />

Or check via terminal:

**Check OnlyOffice Health:**
```bash
# Should return {"status":"ok"} or true
curl http://localhost:8081/healthcheck

# Check welcome page
curl http://localhost:8081/welcome
```

**Check FileBrowser:**
1. Open browser and navigate to `http://localhost:8080`
2. Login with default credentials (admin/yourpassword)
3. Upload a test document (could be a `.docx`, `.xlsx`, or `.pptx`)
4. Click on the document to preview - should open in OnlyOffice editor

You should see something like this:

<img src="../assets/office-document-editor.png" alt="office-editor" />

## Disable Editing - View Only

In FileBrowser config:

```yaml
integrations:
  office:
    viewOnly: true
```

## Next Steps

- **Production Setup**: See {{< doclink path="user-guides/office-integration/traefik-setup/" text="Traefik Full Setup Guide" />}} for complete services configuration ready for production.
- **Internal Office HTTPS**: See {{< doclink path="user-guides/office-integration/office-internal-https/" text="Office Internal HTTPS Guide" />}} for advanced deployment using internal HTTPS for onlyoffice.
- **Troubleshooting**: See {{< doclink path="integrations/office/troubleshooting/" text="Office Troubleshooting" />}} for detailed solutions.
- **Configuration**: See {{< doclink path="integrations/office/configuration/" text="Office Configuration" />}} for all available options.

## Additional Resources

- [OnlyOffice Docker Documentation](https://github.com/ONLYOFFICE/Docker-DocumentServer)
- {{< doclink path="configuration/" text="FileBrowser Configuration Reference" />}}
- [Docker Compose Documentation](https://docs.docker.com/compose/)

