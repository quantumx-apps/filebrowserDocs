---
title: "Configuration"
description: "Configure OnlyOffice integration"
icon: "settings"
date: "2025-10-08T14:59:30Z"
lastmod: "2026-03-10T00:10:42Z"
---

Configure OnlyOffice Document Server for document editing.

## Basic Configuration

<div class="pattern-card">

{{% alert context="info" %}}
OnlyOffice is currently the only supported office integration. Collabora support is planned for the future.
{{% /alert %}}

```yaml
integrations:
  office:
    url: "http://onlyoffice:80"
    secret: "your_secret_here"
```

</div>

## Docker Setup

### Generate OnlyOffice Secret

Generate a secure secret via OpenSSL

```bash
openssl rand -base64 32
```

Output example:
```
TevrjpRNMmKC0JxAwY7iZ2VXLrvG1gue
```

### Docker Compose Example

<div class="pattern-card">

{{% alert context="info" %}}
Use the same secret value for `FILEBROWSER_ONLYOFFICE_SECRET` and OnlyOffice `JWT_SECRET` when JWT is enabled on the document server.
{{% /alert %}}

```yaml
services:
  filebrowser:
    image: gtstef/filebrowser:stable
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
```

</div>

## HTTPS Configuration

{{% alert context="danger" %}}
Never expose OnlyOffice HTTP to internet. Always use HTTPS. See [OnlyOffice HTTPS docs](https://helpcenter.onlyoffice.com/docs/installation/docs-community-install-docker.aspx).
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
    }
}
```

### External and Internal URLs

<div class="pattern-card">

```yaml
server:
  externalUrl: "https://files.yourdomain.com"  # Accessible from browser
  internalUrl: "http://192.168.1.100"         # Either use local network or docker network IP thats accessible from onlyoffice server.

integrations:
  office:
    url: "https://office.yourdomain.com"       # Accessible from browser
    internalUrl: # optional this should be a local network address that FileBrowser can access.
    secret: "your-jwt-secret"
```

**Why two URLs?**

- **Browser** → The browser always uses `integrations.office.url` to connect from your browser to only office server.
- **OnlyOffice** → Uses either `server.externalUrl` or `server.internalUrl` for downloading/saving files to FileBrowser server.
- **FileBrowser** → Uses either `integratons.office.internalUrl` or `integrations.office.url` to connect from the FileBrowser server to OnlyOffice server.

</div>


## Next Steps

- {{< doclink path="user-guides/office-integration/office-integration/" text="Office guides" />}}
- {{< doclink path="integrations/office/troubleshooting/" text="Troubleshooting" />}}
- {{< doclink path="integrations/office/about/" text="About onlyoffice" />}}
