---
title: "Guides"
description: "OnlyOffice integration how-to guides"
icon: "menu_book"
weight: 3
---

Practical guides for setting up and using OnlyOffice integration.

> **Note**: OnlyOffice is currently the only supported office integration. Collabora support is planned for the future.

## Deploy OnlyOffice with Docker

Complete setup for OnlyOffice with Docker:

**1. Create `docker-compose.yml`**:

```yaml
version: '3.8'

services:
  filebrowser:
    image: gtstef/filebrowser:latest
    ports:
      - "8080:8080"
    volumes:
      - ./config.yaml:/home/filebrowser/config.yaml
      - ./data:/data
      - ./database.db:/home/filebrowser/database.db
    environment:
      - FILEBROWSER_ONLYOFFICE_SECRET=your_secret_here

  onlyoffice:
    image: onlyoffice/documentserver:latest
    ports:
      - "80:80"
    environment:
      - JWT_ENABLED=true
      - JWT_SECRET=your_secret_here
    volumes:
      - onlyoffice_data:/var/www/onlyoffice/Data
      - onlyoffice_logs:/var/log/onlyoffice
    restart: unless-stopped

volumes:
  onlyoffice_data:
  onlyoffice_logs:
```

**2. Create `config.yaml`**:

```yaml
server:
  port: 8080
  sources:
    - name: "files"
      path: "/data"

integrations:
  office:
    enabled: true
    url: "http://onlyoffice:80"
```

**3. Start services**:

```bash
docker-compose up -d
docker-compose logs -f
```

**4. Test**:
- Navigate to `http://localhost:8080`
- Upload or open a `.docx` file
- Click to preview - should open in OnlyOffice

## Enable JWT Security

Secure communication between FileBrowser and OnlyOffice:

**Generate secret**:
```bash
openssl rand -base64 32
```

**FileBrowser config**:
```yaml
integrations:
  office:
    enabled: true
    url: "http://onlyoffice:80"
    secret: "your-generated-secret-here"
```

**OnlyOffice config**:
```yaml
environment:
  - JWT_ENABLED=true
  - JWT_SECRET=your-generated-secret-here
```

## Production Deployment with HTTPS

**1. Set up reverse proxy** (nginx example):

```nginx
# OnlyOffice
server {
    listen 443 ssl;
    server_name office.yourdomain.com;

    ssl_certificate /etc/letsencrypt/live/yourdomain.com/fullchain.pem;
    ssl_certificate_key /etc/letsencrypt/live/yourdomain.com/privkey.pem;

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

# FileBrowser
server {
    listen 443 ssl;
    server_name files.yourdomain.com;

    ssl_certificate /etc/letsencrypt/live/yourdomain.com/fullchain.pem;
    ssl_certificate_key /etc/letsencrypt/live/yourdomain.com/privkey.pem;

    location / {
        proxy_pass http://filebrowser:8080;
        proxy_set_header Host $host;
    }
}
```

**2. Update FileBrowser config**:

```yaml
server:
  internalUrl: "http://filebrowser:8080"

integrations:
  office:
    enabled: true
    url: "http://onlyoffice:80"
    externalUrl: "https://office.yourdomain.com"
    secret: "your-secret"
```

**3. Update OnlyOffice config**:

```yaml
environment:
  - JWT_ENABLED=true
  - JWT_SECRET=your-secret
```

## Customize Office Integration

### Disable Office for Specific Users

Configure in user settings or via access rules:

```yaml
# User without office preview
permissions:
  preview:
    office: false
```

### Enable Office for Shares

When creating a share, enable OnlyOffice options:

1. Create or edit share
2. Enable **OnlyOffice** option
3. Optionally enable **OnlyOffice Editing** for collaborative editing
4. Save share

## Troubleshoot Common Issues

See [Office Troubleshooting](/docs/integrations/office/troubleshooting/) for detailed solutions.

## Next Steps

- [Troubleshooting](/docs/integrations/office/troubleshooting/)
- [Configuration reference](/docs/integrations/office/configuration/)
- [Media integration](/docs/integrations/media/)
