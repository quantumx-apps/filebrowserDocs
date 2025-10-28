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
    url: "http://onlyoffice:80"
    secret: "your_secret_here"
```

## Docker Setup

### Generate OnlyOffice Secret

Generate a secure secet via OpenSSL

```bash
openssl rand -base64 32
```

Output example:
```
TevrjpRNMmKC0JxAwY7iZ2VXLrvG1gue
```

### Docker Compose Example

```yaml
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
```

## HTTPS Configuration

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
    }
}
```

## Next Steps

- {{< doclink path="integrations/office/guides/" text="Office guides" />}}
- {{< doclink path="integrations/office/troubleshooting/" text="Troubleshooting" />}}
- {{< doclink path="user-guides/office-setup/" text="User setup guide" />}}
