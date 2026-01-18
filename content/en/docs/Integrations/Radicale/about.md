---
title: "About"
description: "Overview of Radicale integration features"
icon: "info"
---

Overview of calendar (CalDAV) and contact (CardDAV) management with Radicale.

{{% alert context="info" %}}
Radicale is a lightweight, free and open-source CalDAV/CardDAV server. 
It supports multiple users, each with multiple calendars and contact groups accessible via standard clients such as Thunderbird, Apple Calendar, ...
{{% /alert %}}

## Overview

FileBrowser Quantum can integrate with [Radicale](https://radicale.org/) to provide calendar and contact management directly in your environment.

## Support Levels

**Without Integration (Default)**
- Image preview for certain formats
- Basic DOCX and EPUB viewer

**With Radicale Integration**
- Full CalDAV calendar support
- Full CardDAV contact support
- Access via compatible clients (Outlook, Mozilla Thunderbird, ...)

## Features

- ✅ Manage personal and shared calendars
- ✅ Manage personal and shared contacts
- ✅ Support for multiple users
- ✅ Access via standard CalDAV/CardDAV clients
- ✅ Optional authentication and encryption
- ✅ Sync across devices

## Supported Clients

- Apple: macOS Calendar & Contacts, iOS Calendar & Contacts
- Android with DAVx⁵ (formerly DAVdroid)
- GNOME Calendar, Contacts and Evolution
- KDE PIM Applications, KDE Merkuro
- Mozilla Thunderbird (Thunderbird/Radicale) with CardBook and Lightning
- InfCloud (InfCloud/Radicale), CalDavZAP, CardDavMATE and Open Calendar
- pimsync (pimsync/Radicale)

For more details on client compatibility and setup: [Radicale Supported Clients](https://radicale.org/v3.html#supported-clients) 🔗

## Configuration

To enable Radicale features, you need:

1. A running Radicale server (Docker or Podman container)
3. Configure FileBrowser Quantum to communicate with Radicale
4. Configure your CalDAV/CardDAV client

### Basic Configuration

#### Example for Radicale docker `compose.yaml` with network `fb-network`:

```
version: "3.9"

services:
  filebrowser:
    image: gtstef/filebrowser:beta
    container_name: filebrowser-quantum
    environment:
      FILEBROWSER_CONFIG: "/home/filebrowser/data/config.yaml"
      FILEBROWSER_ADMIN_PASSWORD: "change-me"
      TZ: "Europe/Berlin"
    volumes:
      - /path/to/your/files:/folder # User files
      - ./filebrowser-data:/home/filebrowser/data
    ports:
      - "80:80"
    restart: unless-stopped
    networks:
      - fb-network

  radicale:
    image: ghcr.io/kozea/radicale:latest
    container_name: radicale
    environment:
      RADICALE_CONFIG: /config/config
    volumes:
      - ./radicale-data:/data       # Persistent calendar/contact data
      - ./radicale-config:/config   # Radicale configuration
    ports:
      - "5232:5232"
    restart: unless-stopped
    mem_limit: 256M
    pids_limit: 50
    read_only: true
    security_opt:
      - no-new-privileges:true
    healthcheck:
      test: ["CMD", "curl", "--fail", "http://localhost:5232"]
      interval: 30s
      retries: 3
    networks:
      - fb-network

networks:
  fb-network:
    driver: bridge
```

---

#### Example for Reverse Proxy (Nginx Proxy Manager)

When configuring the reverse proxy for FileBrowser Quantum, set the following settings in Nginx Proxy Manager:

- **Forward Hostname / IP:** localhost (or the container name if internal networking is used)
- **Forward Port:** 80

Under Advanced Settings in Nginx Proxy Manager, forward /caldav/ and /carddav/ requests to Radicale using this configuration:

```
# CalDAV
location /caldav/ {
    proxy_pass http://radicale:5232;
    proxy_set_header Host $host;
    proxy_set_header X-Real-IP $remote_addr;
    proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
    proxy_set_header X-Forwarded-Proto $scheme;
    proxy_set_header X-Remote-User $remote_user;
    proxy_set_header X-Script-Name /caldav;
}

location /.well-known/caldav {
    proxy_pass http://radicale:5232;
    proxy_set_header Host $host;
    proxy_set_header X-Remote-User $remote_user;
    proxy_set_header X-Script-Name /caldav;
}

# CardDAV
location /carddav/ {
    proxy_pass http://radicale:5232;
    proxy_set_header Host $host;
    proxy_set_header X-Real-IP $remote_addr;
    proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
    proxy_set_header X-Forwarded-Proto $scheme;
    proxy_set_header X-Remote-User $remote_user;
    proxy_set_header X-Script-Name /carddav;
}

location /.well-known/carddav {
    proxy_pass http://radicale:5232;
    proxy_set_header Host $host;
    proxy_set_header X-Remote-User $remote_user;
    proxy_set_header X-Script-Name /carddav;
}
```

#### Radicale Key Settings

The following are the key settings required for FileBrowser Quantum and client integration:

```
[server]
hosts = 0.0.0.0:5232

[auth]
type = http_x_remote_user

[web]
type = none
```

> Note: This is only an excerpt. The [full Radicale configuration](https://raw.githubusercontent.com/cryinkfly/podman-rootless-quadlets/refs/heads/main/quadlets/filebrowser-quantum/radicale/config) can be viewed in your config file inside the container or volume.

Example command:

```
nano /path/to/config
```

#### Create an API Token for Calendar and Contacts Apps

1. Open FileBrowser Quantum in your browser.
2. Go to Settings → API Tokens.
3. Click the “Create New Token” button.
4. Enter a name or description for the token (e.g., “Mobile Calendar App”).
5. The system will generate a username and token:
    - Username: test
    - Password: the token string
6. Use the copy-to-clipboard button to copy the token for easy setup on your mobile device or CalDAV/CardDAV client.
7. Paste the token in your app when asked for username/password.

Important Notes:

- You can create multiple tokens for different devices or users.
- Each token can have a different lifetime – set an expiration date as needed.
- Treat the token like a password – it grants full access to your calendars and contacts.

<img width="3806" height="1949" alt="create-user-api-token-radicale" src="https://github.com/user-attachments/assets/e5cf5274-9d47-4338-aa3c-d1d958724868" />

© 2026 by [Steve Zabka](https://github.com/cryinkfly). All rights reserved.
