---
title: "Traefik with Labels"
description: "Complete production setup with Traefik using Docker labels and Let's Encrypt"
icon: "dns"
---

Production-ready setup for FileBrowser Quantum and OnlyOffice behind Traefik reverse proxy with automatic HTTPS certificates from Let's Encrypt.

{{% alert context="info" %}}
This guide is based on a community-contributed configuration. Special thanks to @Kurami32 for sharing this working setup!
{{% /alert %}}

## Overview

This configuration provides:
- ✅ **Automatic HTTPS** with Let's Encrypt certificates
- ✅ **Automatic certificate renewal** every 80-90 days
- ✅ **Secure JWT authentication** between services
- ✅ **Docker labels-based** configuration (no manual Traefik files)
- ✅ **Production-ready** with proper security headers
- ✅ **DDNS support** (Dynu, Cloudflare, etc.)

## Prerequisites

- Docker and Docker Compose installed
- **Domain name** with DNS configured
- **DDNS provider** (Dynu, Cloudflare, Route53, etc.) - [See supported providers](https://doc.traefik.io/traefik/https/acme/#providers)
- Basic understanding of Traefik and Docker networking

{{% alert context="warning" %}}
You **must** have a valid domain name and DDNS configuration for Let's Encrypt to work. Localhost or IP addresses will not work with automatic SSL.
{{% /alert %}}

## Directory Structure

Create the following directory structure:

```
docker_apps/
├── filebrowser/
│   ├── data/
│   │   ├── config.yaml
│   │   ├── config.yaml.bak
│   │   └── database.db
│   ├── docker-compose.yml
│   └── .env
├── onlyoffice/
│   ├── docker-compose.yml
│   └── .env
└── traefik/
    ├── certs/
    │   ├── acme.json          # chmod 600
    │   └── acme.json.bak
    ├── config/
    │   ├── dynamic/
    │   │   └── services.yaml
    │   └── static/
    │       └── traefik.yaml
    ├── docker-compose.yaml
    └── .env
```

## Step 1: Create Docker Network

All three services must be on the same network:

```bash
docker network create \
  --driver=bridge \
  --subnet=172.18.0.0/24 \
  --gateway=172.18.0.1 \
  --ip-range=172.18.0.128/25 \
  --label=Reserved_IPs="172.18.0.2-127" \
  proxy_network
```

{{% alert context="info" %}}
**Network Explanation:**
- `subnet`: Network range for all containers
- `gateway`: Router IP for the network
- `ip-range`: Dynamic IPs for containers without static assignment
- `label`: Documentation for reserved IPs
{{% /alert %}}

## Step 2: Setup Traefik

### Create Traefik Directory

```bash
cd docker_apps
mkdir -p traefik/certs traefik/config/dynamic traefik/config/static
```

### Create Certificate File

```bash
touch traefik/certs/acme.json
chmod 600 traefik/certs/acme.json
```

{{% alert context="danger" %}}
The `acme.json` file **must** have `600` permissions or Traefik will refuse to start!
{{% /alert %}}

### Traefik Environment File

Create `traefik/.env`:

```bash
# DDNS API Key (example uses Dynu)
DYNU_API_KEY=your-dynu-api-key-here

# Traefik Dashboard Credentials
# Generate with: docker run --rm httpd:alpine htpasswd -nb admin your-password | sed -e 's/\$/\$\$/g'
TRAEFIK_DASHBOARD_CREDENTIALS=admin:$$apr1$$H6uskkkW$$IgXLP6ewTrSuBkTrqE8wj/
```

**Generate dashboard credentials:**
```bash
docker run --rm httpd:alpine htpasswd -nb admin YourPasswordHere | sed -e 's/\$/\$\$/g'
```

### Traefik Static Configuration

Create `traefik/config/static/traefik.yaml`:

```yaml
global:
  checkNewVersion: true
  sendAnonymousUsage: false

log:
  level: INFO

api:
  dashboard: true
  insecure: true

entryPoints:
  web:
    address: :80
    http:
      redirections:
        entryPoint:
          to: websecure
          scheme: https
          permanent: true
    http2:
      maxConcurrentStreams: 500

  websecure:
    address: :443
    http:
      tls:
        certResolver: letsencrypt
    transport:
      respondingTimeouts:
        readTimeout: "0"
        writeTimeout: "0"
        idleTimeout: "300s"
      lifeCycle:
        graceTimeOut: "20s"
    http2:
      maxConcurrentStreams: 500
    asDefault: true

serversTransport:
  insecureSkipVerify: true
  forwardingTimeouts:
    dialTimeout: "60s"
    responseHeaderTimeout: "75s"
    idleConnTimeout: "90s"

providers:
  docker:
    endpoint: "unix:///var/run/docker.sock"
    network: "proxy_network"
    exposedByDefault: false
  file:
    directory: "/etc/traefik/config/dynamic"
    watch: true

http:
  serversTransports:
    default:
      insecureSkipVerify: true
      forwardingTimeouts:
        dialTimeout: "30s"
        responseHeaderTimeout: "60s"
        idleConnTimeout: "90s"
        readIdleTimeout: "3600s"
  timeouts:
    readTimeout: "3600s"
    writeTimeout: "3600s"
    idleTimeout: "3600s"
  middlewares:
    security-headers:
      headers:
        frameDeny: true
        sslRedirect: true
        browserXssFilter: true
        contentTypeNosniff: true
        forceSTSHeader: true
        stsIncludeSubdomains: true
        stsPreload: true
        stsSeconds: 15552000
        customFrameOptionsValue: "SAMEORIGIN"
        customRequestHeaders:
          X-Forwarded-Proto: "https"
  routers:
    http:
      middlewares:
        - "security-headers"

certificatesResolvers:
  letsencrypt:
    acme:
      email: your-email@provider.com  # Replace with your email
      storage: /var/traefik/certs/acme.json
      # Use staging first for testing
      # caServer: https://acme-staging-v02.api.letsencrypt.org/directory
      # Then switch to production:
      caServer: https://acme-v02.api.letsencrypt.org/directory
      dnsChallenge:
        provider: dynu  # Change to your DDNS provider
        resolvers:
          - "1.1.1.1:53"
          - "1.0.0.1:53"
        # Uncomment if having issues:
        # disablePropagationCheck: true
        # delayBeforeCheck: "60s"
```

{{% alert context="warning" %}}
**Important Configuration Updates:**
1. Replace `your-email@provider.com` with your actual email
2. Change `dynu` to your DDNS provider
3. Start with staging `caServer` for testing, then switch to production
{{% /alert %}}

### Traefik Docker Compose

Create `traefik/docker-compose.yaml`:

```yaml
services:
  traefik:
    image: traefik:latest
    container_name: traefik
    security_opt:
      - no-new-privileges: true
    ports:
      - "80:80"
      - "443:443"
    environment:
      - DYNU_API_KEY=${DYNU_API_KEY}
      - TRAEFIK_DASHBOARD_CREDENTIALS=${TRAEFIK_DASHBOARD_CREDENTIALS}
    volumes:
      - /etc/localtime:/etc/localtime:ro
      - /var/run/docker.sock:/var/run/docker.sock:ro
      - ./config/static/traefik.yaml:/etc/traefik/traefik.yaml:ro
      - ./certs/acme.json:/var/traefik/certs/acme.json:rw
      - ./config/dynamic:/etc/traefik/config:ro
    networks:
      - proxy_network
    labels:
      - "traefik.enable=true"
      - "traefik.http.routers.traefik.tls=true"
      - "traefik.http.routers.traefik.entrypoints=websecure"
      - "traefik.http.routers.traefik.tls.certresolver=letsencrypt"
      - "traefik.http.routers.traefik.rule=Host(`traefik.yourdomain.com`)"
      - "traefik.http.routers.traefik.tls.domains[0].main=yourdomain.com"
      - "traefik.http.routers.traefik.tls.domains[0].sans=*.yourdomain.com"
      - "traefik.http.routers.traefik.service=api@internal"
      - "traefik.http.services.traefik.loadbalancer.server.port=8080"
      # Basic auth for dashboard
      - "traefik.http.routers.traefik.middlewares=traefik-auth"
      - "traefik.http.middlewares.traefik-auth.basicauth.users=${TRAEFIK_DASHBOARD_CREDENTIALS}"
    restart: unless-stopped

networks:
  proxy_network:
    external: true
```

## Step 3: Setup OnlyOffice

### Generate JWT Secret

```bash
openssl rand -base64 32
# Example output: KDSpcNwKAos2moijgdfi9jf9wr3wek=
```

### OnlyOffice Environment File

Create `onlyoffice/.env`:

```bash
TRAEFIK_SERVICE_NAME=onlyoffice
TRAEFIK_SERVICE_PORT=80
DOMAIN_NAME=`office.yourdomain.com`
ONLYOFFICE_SECRET=KDSpcNwKAos2moijgdfi9jf9wr3wek=
TZ=America/New_York  # Your timezone
```

### OnlyOffice Docker Compose

Create `onlyoffice/docker-compose.yaml`:

```yaml
services:
  onlyoffice:
    container_name: onlyoffice
    image: onlyoffice/documentserver
    env_file: .env
    environment:
      TZ: ${TZ}
      ONLYOFFICE_HTTPS_HSTS_ENABLED: false
      JWT_ENABLED: true
      JWT_SECRET: ${ONLYOFFICE_SECRET}
      JWT_HEADER: Authorization
    stdin_open: true
    labels:
      - "traefik.enable=true"
      - "traefik.http.routers.${TRAEFIK_SERVICE_NAME}.tls=true"
      - "traefik.http.routers.${TRAEFIK_SERVICE_NAME}.entrypoints=websecure"
      - "traefik.http.routers.${TRAEFIK_SERVICE_NAME}.tls.certresolver=letsencrypt"
      - "traefik.http.routers.${TRAEFIK_SERVICE_NAME}.rule=Host(${DOMAIN_NAME})"
      - "traefik.http.routers.${TRAEFIK_SERVICE_NAME}.service=${TRAEFIK_SERVICE_NAME}"
      - "traefik.http.services.${TRAEFIK_SERVICE_NAME}.loadbalancer.server.port=${TRAEFIK_SERVICE_PORT}"
      - "traefik.http.services.${TRAEFIK_SERVICE_NAME}.loadbalancer.passhostheader=true"
      
      # Required headers for OnlyOffice
      - "traefik.http.routers.${TRAEFIK_SERVICE_NAME}.middlewares=${TRAEFIK_SERVICE_NAME}-headers"
      - "traefik.http.middlewares.${TRAEFIK_SERVICE_NAME}-headers.headers.customrequestheaders.X-Forwarded-Proto=https"
      - "traefik.http.middlewares.${TRAEFIK_SERVICE_NAME}-headers.headers.accesscontrolalloworiginlist=*"
    networks:
      proxy_network:
    restart: unless-stopped

networks:
  proxy_network:
    external: true
```

{{% alert context="info" %}}
**Critical OnlyOffice Labels:**
- `accesscontrolalloworiginlist=*`: Required for CORS with FileBrowser
- `X-Forwarded-Proto=https`: Tells OnlyOffice it's behind HTTPS proxy
- `ONLYOFFICE_HTTPS_HSTS_ENABLED: false`: Traefik handles HTTPS, not OnlyOffice
{{% /alert %}}

## Step 4: Setup FileBrowser

### FileBrowser Environment File

Create `filebrowser/.env`:

```bash
FILEBROWSER_ADMIN_PASSWORD=YourSecurePasswordHere
DOMAIN_NAME=`files.yourdomain.com`
TRAEFIK_SERVICE_NAME=filebrowser
TRAEFIK_SERVICE_PORT=80
TZ=America/New_York
```

### FileBrowser Docker Compose

Create `filebrowser/docker-compose.yml`:

```yaml
services:
  filebrowser:
    container_name: filebrowser
    image: gtstef/filebrowser
    env_file: .env
    environment:
      FILEBROWSER_CONFIG: "data/config.yaml"
      FILEBROWSER_ADMIN_PASSWORD: ${FILEBROWSER_ADMIN_PASSWORD}
      TZ: ${TZ}
    volumes:
      - '/files:/files'
      - '/files/Shared:/shared'
      - './data:/home/filebrowser/data'
    user: filebrowser
    labels:
      - "traefik.enable=true"
      - "traefik.http.routers.${TRAEFIK_SERVICE_NAME}.tls=true"
      - "traefik.http.routers.${TRAEFIK_SERVICE_NAME}.entrypoints=websecure"
      - "traefik.http.routers.${TRAEFIK_SERVICE_NAME}.tls.certresolver=letsencrypt"
      - "traefik.http.routers.${TRAEFIK_SERVICE_NAME}.rule=Host(${DOMAIN_NAME})"
      - "traefik.http.routers.${TRAEFIK_SERVICE_NAME}.service=${TRAEFIK_SERVICE_NAME}"
      - "traefik.http.services.${TRAEFIK_SERVICE_NAME}.loadbalancer.server.port=${TRAEFIK_SERVICE_PORT}"
      - "traefik.http.services.${TRAEFIK_SERVICE_NAME}.loadbalancer.passhostheader=true"
    networks:
      proxy_network:
    restart: unless-stopped

networks:
  proxy_network:
    external: true
```

### FileBrowser Configuration

Create `filebrowser/data/config.yaml`:

```yaml
server:
  port: 80
  baseURL: "/"
  database: "/home/filebrowser/data/database.db"
  sources:
    - path: "/files"
      name: "Data"
      config:
        defaultEnabled: true
        denyByDefault: false
        createUserDir: true
    - path: "/shared"
      name: "Shared"
      config:
        defaultEnabled: false
        denyByDefault: false
        createUserDir: false
  
  # Critical for OnlyOffice integration
  externalUrl: "https://files.yourdomain.com"
  internalUrl: "http://filebrowser:80"
  cacheDir: "tmp"

auth:
  tokenExpirationHours: 6
  adminUsername: admin
  methods:
    password:
      enabled: true
      minLength: 8
      signup: false

userDefaults:
  darkMode: true
  locale: "en"
  disableOnlyOfficeExt: ".txt .html .md"
  debugOffice: false  # Enable for troubleshooting

integrations:
  office:
    url: "https://office.yourdomain.com"
    internalUrl: "https://files.yourdomain.com"
    secret: "KDSpcNwKAos2moijgdfi9jf9wr3wek="  # Same as OnlyOffice
    viewOnly: false
```

{{% alert context="warning" %}}
**Critical Configuration:**
- `server.externalUrl`: Must match your FileBrowser domain
- `server.internalUrl`: Uses Docker service name `filebrowser`
- `integrations.office.url`: Must match your OnlyOffice domain
- `integrations.office.secret`: Must match OnlyOffice `JWT_SECRET` exactly
{{% /alert %}}

## Step 5: Deploy Services

### Start in Order

```bash
# 1. Start Traefik first
cd traefik
docker-compose up -d
docker-compose logs -f  # Watch for certificate generation

# Wait for "Server configuration reloaded" message

# 2. Start OnlyOffice
cd ../onlyoffice
docker-compose up -d
docker-compose logs -f  # Wait for "Document Server is running"

# 3. Start FileBrowser
cd ../filebrowser
docker-compose up -d
docker-compose logs -f
```

### Verify Deployment

**Check Traefik Dashboard:**
```
https://traefik.yourdomain.com
Login with credentials from .env
```

**Check OnlyOffice:**
```bash
curl https://office.yourdomain.com/healthcheck
# Should return: {"status":"ok"}
```

**Check FileBrowser:**
```
https://files.yourdomain.com
Login with admin and FILEBROWSER_ADMIN_PASSWORD
```

## Testing the Integration

1. Navigate to `https://files.yourdomain.com`
2. Upload a test `.docx` file
3. Click to preview - should open in OnlyOffice editor
4. Make edits and save
5. Verify changes persisted

### Enable Debug Mode

If issues occur:

1. Edit `config.yaml`:
```yaml
userDefaults:
  debugOffice: true
```

2. Restart FileBrowser:
```bash
docker-compose restart filebrowser
```

3. Open any document and check debug tooltip

## Certificate Management

### Check Certificate Status

```bash
# View certificate details
docker exec traefik cat /var/traefik/certs/acme.json | jq

# Check certificate expiry
openssl s_client -connect files.yourdomain.com:443 -servername files.yourdomain.com < /dev/null 2>/dev/null | openssl x509 -noout -dates
```

### Certificate Renewal

Traefik automatically renews certificates 30 days before expiry. No manual action needed!

**Force Renewal (if needed):**
```bash
# Stop Traefik
docker-compose -f traefik/docker-compose.yaml down

# Backup and clear certificates
cp traefik/certs/acme.json traefik/certs/acme.json.bak
echo "" > traefik/certs/acme.json
chmod 600 traefik/certs/acme.json

# Restart Traefik (will request new certificates)
docker-compose -f traefik/docker-compose.yaml up -d
```

## Maintenance

### Update Services

```bash
# Update all images
docker-compose pull
docker-compose up -d

# Update specific service
docker-compose pull filebrowser
docker-compose up -d filebrowser
```

### View Logs

```bash
# All services
docker-compose logs -f

# Specific service
docker-compose logs -f filebrowser

# Last 100 lines
docker-compose logs --tail 100 onlyoffice
```

### Backup Configuration

```bash
# Backup script
#!/bin/bash
BACKUP_DIR="./backups/$(date +%Y%m%d)"
mkdir -p $BACKUP_DIR

cp -r filebrowser/data $BACKUP_DIR/
cp traefik/certs/acme.json $BACKUP_DIR/
cp */.env $BACKUP_DIR/
```

## Troubleshooting

### Certificates Not Generating

**Check Traefik logs:**
```bash
docker-compose -f traefik/docker-compose.yaml logs | grep acme
```

**Common issues:**
- Wrong DDNS API key
- Domain DNS not propagated yet
- Rate limit reached (use staging first)
- Wrong `acme.json` permissions

### OnlyOffice Shows Blank Screen

1. Check if OnlyOffice is healthy:
```bash
docker-compose -f onlyoffice/docker-compose.yaml ps
curl https://office.yourdomain.com/healthcheck
```

2. Verify JWT secrets match
3. Check browser console for CORS errors
4. Enable debug mode in FileBrowser

### Mixed Content Errors

Ensure all URLs use `https://` in production:
- `server.externalUrl`
- `integrations.office.url`
- All domain references

## Next Steps

- {{< doclink path="user-guides/office-integration/traefik-https/" text="Advanced HTTPS Configuration" />}} - Self-signed certificates and file providers
- {{< doclink path="integrations/office/troubleshooting/" text="Office Troubleshooting" />}} - Detailed troubleshooting guide
- {{< doclink path="integrations/office/configuration/" text="Configuration Reference" />}} - All configuration options

## Credits

This guide is based on a community-contributed configuration by [@Kurami32](https://github.com/gtsteffaniak/filebrowser/discussions/1237). Thank you for sharing your working setup!

