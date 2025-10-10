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

# Method 2: Using uuidgen
uuidgen

# Example output:
# TevrjpRNMmKC0JxAwY7iZ2VXLrvG1gue
```

{{% alert context="info" %}}
Save this secret - you'll need it for both FileBrowser and OnlyOffice configuration.
{{% /alert %}}

### Step 2: Create Docker Compose File

Create a `docker-compose.yml` file:

```yaml
version: '3.8'

services:
  filebrowser:
    image: gtstef/filebrowser:latest
    container_name: filebrowser
    ports:
      - "8080:80"
    volumes:
      - ./config.yaml:/home/filebrowser/config.yaml
      - ./data:/data
      - ./database.db:/home/filebrowser/database.db
    networks:
      - office-network
    restart: unless-stopped
    depends_on:
      - onlyoffice

  onlyoffice:
    image: onlyoffice/documentserver:latest
    container_name: onlyoffice
    ports:
      - "80:80"
    environment:
      - JWT_ENABLED=true
      - JWT_SECRET=TevrjpRNMmKC0JxAwY7iZ2VXLrvG1gue  # Replace with your secret
      - JWT_HEADER=Authorization
    volumes:
      - onlyoffice_data:/var/www/onlyoffice/Data
      - onlyoffice_logs:/var/log/onlyoffice
    networks:
      - office-network
    restart: unless-stopped

networks:
  office-network:
    driver: bridge

volumes:
  onlyoffice_data:
  onlyoffice_logs:
```

### Step 3: Create FileBrowser Configuration

Create a `config.yaml` file in the same directory:

```yaml
server:
  port: 80
  database: "/home/filebrowser/database.db"
  sources:
    - name: "files"
      path: "/data"
      config:
        defaultEnabled: true
        denyByDefault: false
        createUserDir: false
  # Required for OnlyOffice integration
  externalUrl: "http://localhost:8080"
  internalUrl: "http://filebrowser:80"

integrations:
  office:
    url: "http://localhost"  # OnlyOffice accessible from browser
    internalUrl: "http://onlyoffice:80"  # OnlyOffice accessible from container
    secret: "TevrjpRNMmKC0JxAwY7iZ2VXLrvG1gue"  # Same secret as OnlyOffice
    viewOnly: false
```

{{% alert context="info" %}}
**Key Configuration Points:**
- `server.externalUrl`: How users access FileBrowser in their browser
- `server.internalUrl`: How OnlyOffice connects to FileBrowser (uses Docker service name)
- `integrations.office.url`: How browser connects to OnlyOffice
- `integrations.office.internalUrl`: How FileBrowser connects to OnlyOffice (uses Docker service name)
{{% /alert %}}

### Step 4: Start Services

```bash
# Start services in background
docker-compose up -d

# View logs
docker-compose logs -f

# Check service status
docker-compose ps
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

## Directory Structure

Your project directory should look like this:

```
office-setup/
├── docker-compose.yml
├── config.yaml
├── database.db           # Created automatically
└── data/                 # Your files
    └── test.docx
```

## Testing the Integration

### Test Document Preview

1. Create a test document:
```bash
echo "Hello from FileBrowser Quantum!" > data/test.txt
```

2. Open FileBrowser at `http://localhost:8080`
3. Navigate to the file and click to preview
4. Document should open in OnlyOffice editor

### Test Document Editing

1. Open any office document
2. Make changes in the OnlyOffice editor
3. Changes save automatically
4. Refresh FileBrowser - file should show updated timestamp

### Enable Debug Mode

To troubleshoot issues:

1. Navigate to **Profile Settings** → **File Viewer Options**
2. Enable **"Debug OnlyOffice Editor"**
3. Open any document
4. View debug information in the tooltip

## Customization

### Change Ports

If port 80 or 8080 are already in use:

```yaml
services:
  filebrowser:
    ports:
      - "3000:80"  # FileBrowser now on port 3000
  
  onlyoffice:
    ports:
      - "8081:80"  # OnlyOffice now on port 8081
```

Update `config.yaml` accordingly:
```yaml
server:
  externalUrl: "http://localhost:3000"

integrations:
  office:
    url: "http://localhost:8081"
```

### Add More File Sources

```yaml
server:
  sources:
    - name: "files"
      path: "/data"
    - name: "documents"
      path: "/documents"
    - name: "shared"
      path: "/shared"
```

Update volumes:
```yaml
volumes:
  - ./data:/data
  - ./documents:/documents
  - ./shared:/shared
```

### Disable Editing for Specific Users

In FileBrowser user settings or config:

```yaml
userDefaults:
  permissions:
    modify: false  # Read-only access
  
# Or set OnlyOffice to view-only mode
integrations:
  office:
    viewOnly: true
```

## Common Issues

### OnlyOffice Not Ready

**Problem:** Documents fail to open immediately after starting

**Solution:** OnlyOffice takes time to initialize. Wait 30-60 seconds and try again.

```bash
# Check OnlyOffice logs
docker-compose logs onlyoffice

# Should see "Document Server is running"
```

### Connection Refused

**Problem:** FileBrowser can't connect to OnlyOffice

**Solution:** Verify both containers are on the same network:

```bash
# Inspect network
docker network inspect office-setup_office-network

# Both containers should be listed
```

### JWT Secret Mismatch

**Problem:** Documents open but show authentication error

**Solution:** Ensure JWT secrets match exactly in both configurations:

```bash
# Check OnlyOffice environment
docker exec onlyoffice env | grep JWT_SECRET

# Compare with config.yaml
cat config.yaml | grep secret
```

### Documents Won't Save

**Problem:** Edits don't persist

**Solution:** Check FileBrowser has write permissions:

```bash
# Check volume permissions
docker exec filebrowser ls -la /data

# Fix permissions if needed
sudo chown -R 1000:1000 ./data
```

## Stopping and Cleaning Up

```bash
# Stop services
docker-compose down

# Stop and remove volumes
docker-compose down -v

# Stop and remove everything including networks
docker-compose down -v --remove-orphans
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

