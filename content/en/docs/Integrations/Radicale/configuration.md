---
title: "Configuration"
description: "Configure Radicale integration"
icon: "settings"
---

Configure **CalDAV** and **CardDAV** integration using **Radicale**.

{{% alert context="info" %}}
Radicale is a lightweight CalDAV/CardDAV server supporting calendars and address books.
{{% /alert %}}

## Basic Configuration

For using Radicale (CalDAV & CardDAV), no special configuration in FileBrowser is required.

Only the following steps are necessary:

- Create a Radicale container
- Adjust the Radicale configuration (authentication, storage, server)
- Configure the required reverse proxy locations for Filebrowser Quantum container

FileBrowser itself acts solely as a host application and does not require any additional integration logic.

## Docker Setup

For running FileBrowser Quantum and Radicale, you can use Docker or Podman. Using a rootless container runtime improves security by avoiding running containers as root.

If you want to set up a rootless Podman environment, see the official guide: {{< doclink path="user-guides/radicale-integration/rootles-podman-setup/" text="Start Rootles Podman Setup →" />}}

### Docker Compose Example

```
version: "3.9"

networks:
  filebrowser-quantum:
    name: filebrowser-quantum.net
    driver: bridge
    external: true

services:
  npm:
    image: docker.io/jc21/nginx-proxy-manager:latest
    container_name: npm
    restart: always
    ports:
      - "80:80"       # HTTP
      - "443:443"     # HTTPS
      - "81:81"       # NPM Dashboard
    environment:
      TZ: "Europe/Berlin"
    volumes:
      - npm_data:/data
      - npm_letsencrypt:/etc/letsencrypt
    networks:
      - filebrowser-quantum

  radicale:
    image: ghcr.io/kozea/radicale:latest
    container_name: filebrowser-quantum-radicale
    restart: always
    volumes:
      - radicale_data:/var/lib/radicale
      - radicale_config:/etc/radicale:ro
    networks:
      - filebrowser-quantum
    deploy:
      resources:
        limits:
          memory: 256M

  filebrowser:
    image: docker.io/gtstef/filebrowser:latest
    container_name: filebrowser-quantum-server
    restart: always
    environment:
      FILEBROWSER_CONFIG: "data/config.yaml"
    volumes:
      - filebrowser_quantum_data:/home/filebrowser/data
      - filebrowser_quantum_files:/srv
    networks:
      - filebrowser-quantum

volumes:
  npm_data:
  npm_letsencrypt:
  radicale_data:
  radicale_config:
  filebrowser_quantum_data:
  filebrowser_quantum_files:
```

## Proxy Configuration for Example with Nginx Proxy Manager

{{% alert context="danger" %}}
Never expose FileBrowser Quantum directly over plain HTTP to the internet. Always use HTTPS.
Radicale should only communicate internally within the Docker network and must not be exposed directly to the internet.
All external access to Radicale should go through the reverse proxy or FileBrowser Cloud endpoint with a valid TLS/SSL certificate.
{{% /alert %}}

```
server {
    listen 80;
    server_name cloud.yourdomain.com;

    ...
    }

    # Radicale CalDAV (Calendars)
    location /caldav/ {
        proxy_pass http://filebrowser-quantum-radicale:5232/;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
        proxy_set_header X-Remote-User $remote_user;
        proxy_set_header X-Script-Name /caldav;
    }

    # Radicale CardDAV (Contacts / Address Books)
    location /carddav/ {
        proxy_pass http://filebrowser-quantum-radicale:5232/;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
        proxy_set_header X-Remote-User $remote_user;
        proxy_set_header X-Script-Name /carddav;
    }

    # Well-Known Auto-Discovery for CalDAV
    location /.well-known/caldav {
        proxy_pass http://filebrowser-quantum-radicale:5232/;
        proxy_set_header Host $host;
        proxy_set_header X-Remote-User $remote_user;
        proxy_set_header X-Script-Name /caldav;
    }

    # Well-Known Auto-Discovery for CardDAV
    location /.well-known/carddav {
        proxy_pass http://filebrowser-quantum-radicale:5232/;
        proxy_set_header Host $host;
        proxy_set_header X-Remote-User $remote_user;
        proxy_set_header X-Script-Name /carddav;
    }
}
```

### External and Internal URLs

FileBrowser Quantum (Web UI):

```
https://cloud.yourdomain.com
```

Radicale CalDAV (Calendars):
```
https://cloud.yourdomain.com/caldav
```

Radicale CardDAV (Contacts/Address Books):
```
https://cloud.yourdomain.com/darddav
```

**Why separate URLs?**

- FileBrowser Quantum → Accessed via /
- Radicale CalDAV → Accessed via /caldav
- Radicale CardDAV → Accessed via /carddav

This separation allows clients (e.g., Thunderbird, Apple Calendar, DAVx⁵) to connect directly to the correct service endpoint without conflicts.

---

## Radicale Configuration

After setting up the Nginx Proxy and FileBrowser Quantum, configure Radicale to work internally and securely.

1. Radicale Config File

Create or edit the configuration file in your Docker volume `radicale_config` (for example: `~/.local/share/containers/storage/volumes/radicale_config/_data/config`) with the following content:

```
[server]
# Listen on all interfaces inside the Docker network
hosts = 0.0.0.0:5232

[auth]
# Trust the X-Remote-User header sent by Nginx/FileBrowser Quantum
type = http_x_remote_user

[web]
# Deactivate the Web UI of Radicale
# Disable internal web UI
type = none
```

---

## Create an API Token for Authentication

After configuring Radicale and the proxy, you need to create an API token for each FileBrowser user. This token will be used by CalDAV and CardDAV clients to authenticate.

1. Open FileBrowser Quantum GUI

    - Log in to FileBrowser Quantum as an admin.

    - Go to Users → select the user for whom you want to create an API token.

2. Generate API Token

    - Click Create API Token (or Generate Token, depending on your version).

    - Copy the token — this is the only time it will be fully visible.

3. Use API Token in Clients

    - When setting up a CalDAV or CardDAV client (e.g., Apple Calendar, Thunderbird, DAVx⁵):

      - Username: FileBrowser username
      - Password: API token you just created

    - Server URL:

      - CalDAV: https://cloud.yourdomain.com/caldav/
      - CardDAV: https://cloud.yourdomain.com/carddav/

The client will now authenticate using the API token, and all calendar and contact data is synced through FileBrowser Quantum to Radicale internally.

✅ Notes:

- Each user should have their own API token.
- Tokens can be revoked or regenerated at any time in the FileBrowser GUI.
- This method avoids exposing real passwords to third-party clients.
- Ensure HTTPS is enabled — API tokens should never be sent over plain HTTP.


## Next Steps

- {{< doclink path="user-guides/radicale-integration/radicale-integration/" text="Radicale guides" />}}
- {{< doclink path="integrations/radicale/troubleshooting/" text="Troubleshooting" />}}
- {{< doclink path="integrations/radicale/about/" text="About Radicale" />}}
