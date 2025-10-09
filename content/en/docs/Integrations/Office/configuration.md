---
title: "Configuration"
description: "Configure OnlyOffice integration"
icon: "settings"
---

Configure OnlyOffice Document Server for document editing.

{{% alert context="info" %}}
OnlyOffice is currently the only supported office integration. Collabora support is planned for the future.
{{% /alert %}}

## Basic Configuration

```yaml
integrations:
  office:
    enabled: true
    url: "http://onlyoffice:80"
    secret: "your_secret_here"
```

## Environment Variables

```bash
export FILEBROWSER_OFFICE_URL="http://onlyoffice:80"
export FILEBROWSER_ONLYOFFICE_SECRET="your_secret_here"
```

## Docker Setup

### Generate OnlyOffice Secret

Start OnlyOffice temporarily:

```bash
docker run -d -p 8080:80 --rm --name onlyoffice onlyoffice/documentserver
```

Wait a few seconds, then get secret:

```bash
docker exec onlyoffice /var/www/onlyoffice/documentserver/npm/json \
  -f /etc/onlyoffice/documentserver/local.json \
  'services.CoAuthoring.secret.session.string'
```

Output example:
```
TevrjpRNMmKC0JxAwY7iZ2VXLrvG1gue
```

### Docker Compose Example

```yaml
version: '3.8'

services:
  filebrowser:
    image: gtstef/filebrowser:latest
    ports:
      - "80:80"
    volumes:
      - ./config.yaml:/home/filebrowser/config.yaml
      - ./data:/data
      - ./database.db:/home/filebrowser/database.db
    environment:
      - FILEBROWSER_ONLYOFFICE_SECRET=your_secret_here

  onlyoffice:
    image: onlyoffice/documentserver:latest
    ports:
      - "8080:80"
    environment:
      - JWT_ENABLED=true
      - JWT_SECRET=your_secret_here
    volumes:
      - onlyoffice_data:/var/www/onlyoffice/Data
      - onlyoffice_logs:/var/log/onlyoffice

volumes:
  onlyoffice_data:
  onlyoffice_logs:
```

## Configuration Options

### Basic Configuration

```yaml
integrations:
  office:
    enabled: true
    url: "http://onlyoffice:80"
    secret: "your_secret_here"  # Use environment variable!
```

### With Environment Variable

Best practice for secrets:

```yaml
integrations:
  office:
    enabled: true
    url: "http://onlyoffice:80"
    # Secret from FILEBROWSER_ONLYOFFICE_SECRET env var
```

### External URL Configuration

For reverse proxy setups:

```yaml
server:
  internalUrl: "http://filebrowser:80"

integrations:
  office:
    enabled: true
    url: "http://onlyoffice:80"
    externalUrl: "https://office.example.com"
```

### Complete Example

```yaml
server:
  port: 80
  internalUrl: "http://filebrowser:80"

integrations:
  office:
    enabled: true
    url: "http://onlyoffice:80"
    externalUrl: "https://office.example.com"
    # secret set via FILEBROWSER_ONLYOFFICE_SECRET

auth:
  key: "your-jwt-secret"  # Use environment variable!
```

## Security Configuration

### JWT Authentication

**FileBrowser**:
```yaml
integrations:
  office:
    enabled: true
    url: "http://onlyoffice:80"
    secret: "your-secret-key-min-32-chars"
```

**OnlyOffice**:
```yaml
environment:
  - JWT_ENABLED=true
  - JWT_SECRET=your-secret-key-min-32-chars
```

### HTTPS Configuration

{{% alert context="danger" %}}
Never expose OnlyOffice HTTP to internet. Always use HTTPS. See [OnlyOffice HTTPS docs](https://helpcenter.onlyoffice.com/installation/groups-https-docker.aspx).
{{% /alert %}}

For production, use HTTPS with reverse proxy (nginx example):

```nginx
server {
    listen 443 ssl;
    server_name office.yourdomain.com;

    ssl_certificate /path/to/cert.pem;
    ssl_certificate_key /path/to/key.pem;

    location / {
        proxy_pass http://onlyoffice:80;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
        
        # WebSocket support
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection "upgrade";
    }
}
```

## Verification

### Check OnlyOffice Health

```bash
curl http://localhost:80/healthcheck
```

### Test Document Opening

1. Start FileBrowser with office integration configured
2. Navigate to a document (`.docx`, `.xlsx`, `.pptx`)
3. Click to preview
4. Document should open in the OnlyOffice editor

## User Settings

Users can enable/disable OnlyOffice in their settings:

1. Go to **Settings** → **Office Integration**
2. Toggle **Enable OnlyOffice**
3. Save changes

## Share Configuration

Enable OnlyOffice for specific shares:

1. Create or edit share
2. Enable **OnlyOffice** option
3. Optionally enable **OnlyOffice Editing**
4. Save share

## Next Steps

- {{< doclink path="integrations/office/guides/" text="Office guides" />}}
- {{< doclink path="integrations/office/troubleshooting/" text="Troubleshooting" />}}
- {{< doclink path="user-guides/office-setup/" text="User setup guide" />}}
