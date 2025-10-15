---
title: "Traefik with Labels"
description: "Complete production setup with Traefik using Docker provider and Let's Encrypt"
icon: "dns"
date: "2025-09-24"
lastmod: "2025-10-14"
toc: true
order: 3
---

Production-ready setup for FileBrowser Quantum and OnlyOffice behind Traefik reverse proxy with automatic HTTPS certificates from Let's Encrypt.

{{% alert context="info" %}}
This guide is based on a community-contributed configuration. Special thanks to [@Kurami32](https://github.com/Kurami32) for sharing this working setup!
{{% /alert %}}

## Overview

In this guide we will setup **Traefik** with **Docker provider** and **Labels** within **FileBrowser Quantum** and **OnlyOffice**. You can use this guide as reference, or if you want you can copy-paste all from here, but remember to change all the fake info here with your own.

This configuration will give you:
- ✅ **Automatic HTTPS and certificate renewal** with Let's Encrypt certificates, all managed automatically by Traefik.
- ✅ **Secure JWT authentication** between services.
- ✅ **Docker labels-based** configuration.
- ✅ **Production-ready** with proper security headers.

## Pre-requisites

- Docker and Docker Compose installed.
- **Domain name** with a DDNS provider configured.
- **DDNS provider** ([Dynu](https://www.dynu.com/Resources/Tutorials/DynamicDNS/GettingStarted), Cloudflare, DuckDNS, etc) - [See supported providers](https://doc.traefik.io/traefik/https/acme/#providers)
- Basic understanding of Traefik, Docker, and Docker compose in general.

{{% alert context="warning" %}}
You **must** have a valid domain name and have your DDNS provider configured for Let's Encrypt to work. Local IP addresses directly will not work.

However, if you don't have you own domain, you can bind your local IP or hostname to your DDNS provider, and use one free domain that they offer **but** I'm not sure how will work when exposing services publicly.
{{% /alert %}}

## Directory Structure

This should be your final directory structure if you followed all the steps well:

{{% alert context="info" %}}
**Note:** The `.env` files on each directory of the services are docker environment files, they should go on the root folder of each service that you want to deploy (they are with fake info, so make sure that you replace that info with your own), in this case we are deploying three services **Traefik**, **Filebrowser Quantum** and **OnlyOffice**.
{{% /alert %}}

```
services/
├── filebrowser/
│   ├── data/
│   │   ├── config.yaml        # Your filebrowser configuration
│   │   └── database.db        # Database of filebrowser
│   ├── docker-compose.yaml    # Filebrowser compose file
│   └── .env                   # environment file for filebrowser
├── onlyoffice/
│   ├── docker-compose.yaml    # Onlyoffice compose file
│   └── .env                   # Environment file for onlyofffice
└── traefik/
    ├── certs/        
    │   └── acme.json          # Should have chmod 600 permissions, all the certificates will be stored on this file.
    ├── config/
    │   ├── dynamic/
    │   │   └── services.yaml  # Dynamic config of traefik - Unused - Here you can use the file provider of traefik.
    │   └── static/
    │       └── traefik.yaml   # Static config of traefik - This is what we will use alongside with the labels.
    ├── docker-compose.yaml    # Traefik compose file
    └── .env                   # Environment file for Traefik
```

## Step 1: Create Docker Network

All three services must be on the same network:

```shell
docker network create \ 
  --driver=bridge \ 
  --subnet=192.168.2.0/24 \ 
  --gateway=192.168.2.1 \ 
  --ip-range=192.168.2.128/25 \ 
  --label=Reserved_IPs="192.168.2.2-127" \ 
  proxy_network 
```

{{% alert context="info" %}}
**Network Explanation:**
- `subnet`: Network range for all the containers.
- `gateway`: Router IP for the network.
- `ip-range`: Dynamic IPs for containers without static assignment
- `label`: Reserved IPs for containers that need them.

Which this command do is create a virtual docker network with the subnet `192.168.2.0` and reserve half of the IP addresses available (from `192.168.2.2` to `192.168.2.127`) for containers that you don't want to be changing its IP each time that you restart them. For assing static IPs to a container, you will need to specify the IP on the docker compose file of your service, below of the name of your docker network. For example:

```yaml
services:
  filebrowser:
    image: gtstef/filebrowser:latest
    networks:
      proxy_network:                # Name of the docker network
        ipv4_address: 192.168.1.5   # IP adress that you want to use with that service
```

If you don't want to use this complex command, you can use this simplified version:

```shell
docker network create --driver=bridge proxy_network
```

Docker will manage **all** the IPs dynamically and assing a subnet automatically. You will not have static or reserved IPs, but is fine, on this guide we will use the containers with dynamic IPs, but if you want to use a static IP, you can add the ipv4 option on the docker compose files.

{{% /alert %}}

## Step 2: Setup Traefik

### Create Traefik Directory

```bash
mkdir services && cd services
mkdir -p traefik/certs traefik/config/dynamic traefik/config/static
```

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
      - "traefik.http.routers.traefik.rule=Host(`traefik.${DOMAIN_NAME}`)"
      - "traefik.http.routers.traefik.tls.domains[0].main=${DOMAIN_NAME}"
      - "traefik.http.routers.traefik.tls.domains[0].sans=*.${DOMAIN_NAME}"
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

### Traefik Environment File

Create `traefik/.env`:

```bash
DOMAIN_NAME=your-domain.com
# DDNS API Key (we are using dynu)
DYNU_API_KEY=your-dynu-api-key-here

# Traefik Dashboard Credentials
# Generate with: docker run --rm httpd:alpine htpasswd -nb your-username your-password | sed -e 's/\$/\$\$/g'
TRAEFIK_DASHBOARD_CREDENTIALS=admin:$$apr1$$H6uskkkW$$IgXLP6ewTrSuBkTrqE8wj/
```

**Generate dashboard credentials:**
```bash
# Replace `your-username` and `your-password` with your own user and password.
docker run --rm httpd:alpine htpasswd -nb your-username your-password | sed -e 's/\$/\$\$/g'
```

### Create Certificate File

```bash
touch traefik/certs/acme.json
chmod 600 traefik/certs/acme.json
```

{{% alert context="danger" %}}
The `acme.json` file **must** have `600` permissions, this is for **security**. With that permission only the Traefik process (and you user) can access (read an write) the certificates stored on that file. 

Also **BE SURE** that you have a copy of that file, because there is where the certificates will be stored.
{{% /alert %}}

### Traefik Configuration

Create `traefik/config/static/traefik.yaml`:

```yaml
global:
  checkNewVersion: true
  sendAnonymousUsage: false

# Log level. You can use DEBUG initially for see if the certificates are being pulled correctly
log:
  level: INFO # DEBUG, INFO, WARN, ERROR, FATAL, PANIC

api:
  dashboard: true
  insecure: false

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
      keepAliveMaxTime: "0"
      keepAliveMaxRequests: "0"
    http2:
      maxConcurrentStreams: 500
    asDefault: true

serversTransport:
  insecureSkipVerify: false
  forwardingTimeouts:
    dialTimeout: "60s" # Time to establish TCP connection
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
      insecureSkipVerify: false
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
        referrerPolicy: "strict-origin-when-cross-origin"
        customRequestHeaders:
          X-Forwarded-Proto: "https"

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
        # Uncomment if having issues with the certificates.
        # disablePropagationCheck: true
        # delayBeforeCheck: "60s"
```

{{% alert context="warning" %}}
**Important Configuration Updates:**
1. Replace `your-email@provider.com` with your actual email.
2. Change `dynu` to your DDNS provider.
3. Start with staging `caServer` for testing, then switch to production. Let's encrypt has a rate-limit, so if something goes wrong you are testing first.

The staging `caServer` will not give you valid TLS certificates, but you can see that they are coming from Let's encrypt on your browser, so that is how you test that is working.
{{% /alert %}}

### Deploy Traefik

Just like any other docker compose service, you should be on the directory where you `docker-compose.yaml` is and:

```shell
docker compose up -d --force-recreate 
```

See the logs of traefik to see what is happening (CTRL+C to exit):

```shell
docker compose logs traefik
```

#### Test that traefik is working

For test if traefik is working you can visit the dashboard of traefik at: `https://traefik.your-domain.com` (the domain that you used on the `.env` file), and log in with the credentials that you generated before.

![Traefik dashboard](https://private-user-images.githubusercontent.com/178341547/501216161-662ae0d8-836d-46b9-b762-b66045c1978e.png?jwt=eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJpc3MiOiJnaXRodWIuY29tIiwiYXVkIjoicmF3LmdpdGh1YnVzZXJjb250ZW50LmNvbSIsImtleSI6ImtleTUiLCJleHAiOjE3NjA0ODkxOTIsIm5iZiI6MTc2MDQ4ODg5MiwicGF0aCI6Ii8xNzgzNDE1NDcvNTAxMjE2MTYxLTY2MmFlMGQ4LTgzNmQtNDZiOS1iNzYyLWI2NjA0NWMxOTc4ZS5wbmc_WC1BbXotQWxnb3JpdGhtPUFXUzQtSE1BQy1TSEEyNTYmWC1BbXotQ3JlZGVudGlhbD1BS0lBVkNPRFlMU0E1M1BRSzRaQSUyRjIwMjUxMDE1JTJGdXMtZWFzdC0xJTJGczMlMkZhd3M0X3JlcXVlc3QmWC1BbXotRGF0ZT0yMDI1MTAxNVQwMDQxMzJaJlgtQW16LUV4cGlyZXM9MzAwJlgtQW16LVNpZ25hdHVyZT1mMjUwMzFhZWVjZDVkZTRjNmQ1MmJlZGNkNDU2OWE5OTYzZDA5ODM0ZmE4NWRmM2MwMWRjNWM4MTc4YWNmYTkyJlgtQW16LVNpZ25lZEhlYWRlcnM9aG9zdCJ9.cGKuCfd_u6mLf0J5tozzIK2lPW-xN6ApYLtFBfR5JB4)


Or if you want to test it further, you can deploy the other two services first (filebrowser and onlyoffice), and verify that all is working fine.

{{% alert context="danger" %}}
Once you tested that all is working on the staging server, before you change to production **MAKE SURE** that you deleted the `acme.json` file first before pulling the new production certificates, otherwise will not work. You can just delete the content inside, or recreate the file again:

```shell
rm -rf traefik/certs/acme.json
touch traefik/certs/acme.json
chmod 600 traefik/certs/acme.json
```

{{% /alert %}}

## Step 3: Setup OnlyOffice

### Create OnlyOffice Directory

```bash
cd services # the same directory where the directory of traefik is
mkdir -p onlyoffice
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
      - "traefik.http.routers.${TRAEFIK_SERVICE_NAME}.rule=Host(`${DOMAIN_NAME}`)"
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

### Generate JWT Secret

```bash
openssl rand -base64 32
# Example output: KDSpcNwKAos2moijgdfi9jf9wr3wek=
```

{{% alert context="info" %}}
Save this secret - you'll need it for both FileBrowser, and OnlyOffice configuration `.env` file.
{{% /alert %}}


### OnlyOffice Environment File

Create `onlyoffice/.env`:

```bash
TRAEFIK_SERVICE_NAME=onlyoffice
TRAEFIK_SERVICE_PORT=80
DOMAIN_NAME=office.yourdomain.com
ONLYOFFICE_SECRET=KDSpcNwKAos2moijgdfi9jf9wr3wek=  # Your output of the openssl command
TZ=America/New_York  # Your timezone
```

### Deploy OnlyOffice

```shell
docker compose up -d --force-recreate 
```

Check the logs to see what is happening (CTRL+C to exit):

```shell
docker compose logs onlyoffice
```

#### Test that OnlyOffice is working

- Visit your onlyoffice URL on your browser (`https://onlyoffice.yourdomain.com`) 

![OnlyOffice](https://private-user-images.githubusercontent.com/178341547/501219762-f93d5248-df60-4a2b-b5d4-f2a77b6215cf.png?jwt=eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJpc3MiOiJnaXRodWIuY29tIiwiYXVkIjoicmF3LmdpdGh1YnVzZXJjb250ZW50LmNvbSIsImtleSI6ImtleTUiLCJleHAiOjE3NjA0ODk3NDAsIm5iZiI6MTc2MDQ4OTQ0MCwicGF0aCI6Ii8xNzgzNDE1NDcvNTAxMjE5NzYyLWY5M2Q1MjQ4LWRmNjAtNGEyYi1iNWQ0LWYyYTc3YjYyMTVjZi5wbmc_WC1BbXotQWxnb3JpdGhtPUFXUzQtSE1BQy1TSEEyNTYmWC1BbXotQ3JlZGVudGlhbD1BS0lBVkNPRFlMU0E1M1BRSzRaQSUyRjIwMjUxMDE1JTJGdXMtZWFzdC0xJTJGczMlMkZhd3M0X3JlcXVlc3QmWC1BbXotRGF0ZT0yMDI1MTAxNVQwMDUwNDBaJlgtQW16LUV4cGlyZXM9MzAwJlgtQW16LVNpZ25hdHVyZT1iNjk3OTFiNmRkNWRhZDU3OWJmZGNmZTA1NzJmZGRjYmExMGUzZGQ2YmEyYmJlYWRhZGNjMDA0ZGNjNGNmYjI2JlgtQW16LVNpZ25lZEhlYWRlcnM9aG9zdCJ9.7pzPnwWtwRytljpD2lUVtrNhcEm8hjR-Xkh9PECZh-c)

- Or verify with curl. Should return: `{"status":"ok"}`

```shell
curl https://office.yourdomain.com/healthcheck
```

## Step 4: Setup FileBrowser Quantum

### Create Filebrowser Directory

```bash
cd services  # the same directory where traefik and only office are.
mkdir -p filebrowser/data
```

### FileBrowser Docker Compose

Also see [filebrowser docker](https://filebrowserquantum.com/en/docs/getting-started/docker/).

Create `filebrowser/docker-compose.yaml`:

```yaml
services:
  filebrowser:
    container_name: filebrowser
    image: gtstef/filebrowser:latest
    env_file: .env
    environment:
      FILEBROWSER_CONFIG: "data/config.yaml"
      FILEBROWSER_ADMIN_PASSWORD: ${FILEBROWSER_ADMIN_PASSWORD}
      TZ: ${TZ}
    volumes:
      - '/files:/files'
      - '/files/media:/media'
      - './data:/home/filebrowser/data'
    user: filebrowser
    labels:
      - "traefik.enable=true"
      - "traefik.http.routers.${TRAEFIK_SERVICE_NAME}.tls=true"
      - "traefik.http.routers.${TRAEFIK_SERVICE_NAME}.entrypoints=websecure"
      - "traefik.http.routers.${TRAEFIK_SERVICE_NAME}.tls.certresolver=letsencrypt"
      - "traefik.http.routers.${TRAEFIK_SERVICE_NAME}.rule=Host(`${DOMAIN_NAME}`)"
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

### FileBrowser Environment File

Create `filebrowser/.env`:

```bash
FILEBROWSER_ADMIN_PASSWORD=YourSecurePasswordHere
DOMAIN_NAME=files.yourdomain.com
TRAEFIK_SERVICE_NAME=filebrowser
TRAEFIK_SERVICE_PORT=80
TZ=America/New_York # Your Timezone
```

### FileBrowser Configuration

See [configuration overview](https://filebrowserquantum.com/en/docs/configuration/configuration-overview/)

Create `filebrowser/data/config.yaml`:

```yaml
server:
  port: 80
  baseURL: "/"
  sources:
    - path: "/files"
      name: "Files"
      config:
        defaultEnabled: true
        createUserDir: true
    - path: "/media"
      name: "Media"
      config:
        defaultEnabled: false
        createUserDir: false

  # Critical for OnlyOffice integration
  externalUrl: "https://files.yourdomain.com"
  internalUrl: "http://filebrowser:80"

auth:
  tokenExpirationHours: 6
  adminUsername: admin   # Your admin username
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
    url: "https://office.yourdomain.com"       # The URL to the OnlyOffice Server
    internalUrl: "http://onlyoffice:80"
    secret: "KDSpcNwKAos2moijgdfi9jf9wr3wek="  # Same as OnlyOffice
    viewOnly: false
```

{{% alert context="warning" %}}
**Critical Configuration:**
- `server.externalUrl`: Must match your FileBrowser domain configured on the `.env` file.
- `server.internalUrl`: Uses Docker service name `onlyoffice` and its internal port.
- `integrations.office.url`: Must match your OnlyOffice domain configured on the `.env` file of OnlyOffice.
- `integrations.office.secret`: Must match OnlyOffice `JWT_SECRET` exactly.
{{% /alert %}}

### Deploy FileBrowser

```shell
docker compose up -d --force-recreate 
```

Check the logs to see what is happening (CTRL+C to exit):

```shell
docker compose logs filebrowser
```

#### Test that FileBrowser is working

- Open your filebrowser domain on your browser (`https://files.yourdomain.com`), the page should load.
- Login with admin (or your username that you configured on the config file) and `FILEBROWSER_ADMIN_PASSWORD` from `.env`

## Testing the Integration

1. Navigate to your filebrowser domain (`https://files.yourdomain.com`)
2. Upload a test `.docx` file.
3. Click to preview - should open in OnlyOffice editor.
4. Make edits and save.
5. Verify changes persisted.

### Enable Debug Mode

If issues occur:

1. Edit `config.yaml` of filebrowser:

```yaml
userDefaults:
  debugOffice: true
```

2. Restart FileBrowser:

```bash
docker compose restart filebrowser
```

3. Open any document and check on the debug window.

## Certificate Management

### Check Certificate Status

You will need to have the `jq` package installed if you want a colored output.

```bash
# View certificate details
docker exec traefik cat /var/traefik/certs/acme.json | jq

# Check certificate expiry
openssl s_client -connect files.yourdomain.com:443 -servername files.yourdomain.com < /dev/null 2>/dev/null | openssl x509 -noout -dates
```

### Certificate Renewal

Traefik automatically renews certificates 30 days before expiration. No manual action needed!

**Force Renewal (if needed):**

Navigate to your traefik directory (where the `docker-compose.yaml` is)

```bash
# Stop Traefik
docker compose down -v

# Backup and clear certificates
cp certs/acme.json certs/acme.json.bak
rm -rf certs/acme.json
touch certs/acme.json
chmod 600 certs/acme.json

# Restart Traefik (will request new certificates)
docker compose up -d
```

## Maintenance

### Update Services

{{% alert context="info" %}}
You will need to navigate to the directory of each service (where the `docker-compose.yaml` is) and do the next commands on each.
{{% /alert %}}

```bash
docker compose pull                             # Pull the latest image available of the service.
docker compose up -d --force-recreate           # Re-create the container and restart it automatically.
```

### View Logs

```bash
docker compose logs -f filebrowser # or onlyoffice, traefik (is 1by service name)

# Last 100 lines
docker compose logs --tail 100 onlyoffice
```

### Backup Configuration

Backup script

```bash
#!/bin/bash
BACKUP_DIR="./backups/$(date +%Y%m%d)" # You can modify the location of the backups
mkdir -p $BACKUP_DIR

cd services # Or the location where your services are.
cp -r filebrowser/data $BACKUP_DIR/
cp traefik/certs/acme.json $BACKUP_DIR/
cp */.env $BACKUP_DIR/
```

## Troubleshooting

### Certificates Not Generating

**Check Traefik logs:**

{{% alert context="info" %}}
First enable `DEBUG` logs on the `traefik.yaml` config file:
```yaml
# Log level. You can use DEBUG initially for see if the certificates are being pulled correctly
log:
  level: DEBUG # DEBUG, INFO, WARN, ERROR, FATAL, PANIC
```
{{% /alert %}}

Then check the logs:

```bash
docker compose logs -f | grep acme
```

- **Also try uncommenting the last lines on the `traefik.yaml` config file**
- **And check the `acme.json` file. You should see the certificates there**

First navigate to the directory where your services are, then:
```shell
cat traefik/certs/acme.json | jq
```

**Common issues:**
- Wrong DDNS API key, make sure that you copied it correctly from your DDNS provider.
- TXT records could not be propagated yet, you will need to wait a bit if is the first pulling the certificates, that take around 5 minutes.
- Rate limit reached (use staging first).
- Wrong `acme.json` permissions.
- Wrong domain.

### OnlyOffice Shows Blank Screen

1. Check if OnlyOffice is healthy:
```bash
curl https://office.yourdomain.com/healthcheck
```

Or visit your onlyoffice domain on the browser, the page should load.

2. Verify JWT secrets match. Should be same on onlyoffice and filebrowser.
3. Check browser console for CORS errors.
4. Enable office debug mode in FileBrowser.

### Mixed Content Errors

Ensure all URLs use `https://` in production:
- `server.externalUrl`
- `integrations.office.url`

## Next Steps

- {{< doclink path="user-guides/office-integration/traefik-https/" text="Advanced HTTPS Configuration" />}} - Self-signed certificates and traefik file provider
- {{< doclink path="integrations/office/troubleshooting/" text="Office Troubleshooting" />}} - Detailed troubleshooting guide
- {{< doclink path="integrations/office/configuration/" text="Configuration Reference" />}} - All configuration options

## Credits

This guide is a community-contributed configuration by [@Kurami32](https://github.com/gtsteffaniak/filebrowser/discussions/1237#discussioncomment-14447935). Thank you for sharing your working setup!