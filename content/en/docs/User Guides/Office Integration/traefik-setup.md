---
title: "Traefik Setup"
description: "Complete production setup with Traefik using Docker and Let's Encrypt"
icon: "dns"
order: 3
---

Production-ready setup for FileBrowser Quantum and OnlyOffice behind Traefik reverse proxy with automatic HTTPS certificates from Let's Encrypt.

{{% alert context="info" %}}
This guide is community-contributed. Special thanks to [@Kurami32](https://github.com/Kurami32) for sharing this working setup!
{{% /alert %}}

## Overview

In this guide we'll use Docker (compose) for setup **FileBrowser Quantum** and **OnlyOffice** behind **Traefik** Reverse Proxy for a production-ready deployment. You can use this guide as reference, if you want you can copy-paste all from here, but remember to change all the fake/changed info here with your own.

This guide will cover:
- ✅ **Automatic HTTPS and certificate renewal** with Let's Encrypt certificates, this is managed automatically by Traefik.
- ✅ **Secure JWT authentication** between services (FileBrowser and OnlyOffice).
- ✅ **Docker with Traefik labels** configuration for the services.
- ✅ **Production-ready** with proper security headers.

## Pre-requisites

- Docker and Docker Compose installed.
- A valid **Domain name** with a DDNS provider configured. Required for Let's Encrypt DNS Challenge.
- **DDNS provider** ([Dynu](https://www.dynu.com/Resources/Tutorials/DynamicDNS/GettingStarted), Cloudflare, DuckDNS, etc) - [See supported providers](https://doc.traefik.io/traefik/https/acme/#providers)
- Basic understanding of Traefik, Docker, and Docker compose in general.

{{% alert context="warning" %}}
You **must** have a valid domain name, and have your DDNS provider configured pointing to your domain for Let's Encrypt to work. If your use Local IPs directly in Traefik, will not work.

However, if you don't have you own domain, you can bind your local IP or hostname to your DDNS provider and use one of the free domains that they offer **but** I'm not sure if will work when exposing services publicly.
{{% /alert %}}

## Directory Structure

This should be your final directory structure if you followed all the steps correctly:

{{% alert context="info" %}}
**Note:** The `.env` files on each directory of the services are environment files used for store sensitive information, they should go on the root folder of each service that you want to deploy, in this case, we are deploying three services **Traefik**, **Filebrowser Quantum** and **OnlyOffice**.

Make sure to replace all the info of the `.env` files with your own.
{{% /alert %}}

```
services/
├── filebrowser/
│   ├── data/
│   │   ├── config.yaml        # Your filebrowser configuration
│   │   └── database.db        # Database of filebrowser
│   ├── docker-compose.yaml    # Filebrowser compose file
│   └── .env                   # Environment file for filebrowser
├── onlyoffice/
│   ├── docker-compose.yaml    # Onlyoffice compose file
│   └── .env                   # Environment file for onlyofffice
└── traefik/
    ├── certs/        
    │   └── acme.json          # Should have chmod 600 permissions, all the certificates will be stored on this file.
    ├── config/
    │   ├── dynamic/
    │   │   └── middlewares.yaml  # Dynamic config (File provider) of traefik, used for the security headers.
    │   └── static/
    │       └── traefik.yaml   # Static config of traefik
    ├── docker-compose.yaml    # Traefik compose file
    └── .env                   # Environment file for Traefik
```

## Step 1: Create Docker Network

All the three services must be on the same network:

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
- `ip-range`: Dynamic IPs for containers without static assignment - from 128 to 255.
- `label`: Reserved IPs for containers that need them - from 2 to 127.

Which this command do is create a virtual docker network with the subnet `192.168.2.0` and reserve half of the IP addresses available (from `192.168.2.2` to `192.168.2.127`) for containers that you don't want to be changing its IP each time that you restart them - For assing static IPs to a container, you will need to specify the IP on the docker compose file of your service, below of the name of your docker network. For example:

```yaml
services:
  filebrowser:
    image: gtstef/filebrowser:latest
    networks:
      proxy_network:                # Name of the docker network
        ipv4_address: 192.168.1.5   # IP adress that you want to use with that service, the IP will be static, don't will change.
```

If you don't want to use this complex command, you can use this simplified version:

```shell
docker network create --driver=bridge proxy_network
```

Docker will manage **all** the IPs dynamically and assing a available subnet automatically. You will not have static or reserved IPs, but is fine, on this guide we will use the containers with dynamic IPs, but if you want to use a static IP, you can add the ipv4 option on the docker compose files.

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
      - "traefik.http.routers.traefik.tls.options=default"
      - "traefik.http.routers.traefik.rule=Host(`traefik.${DOMAIN_NAME}`)"
      - "traefik.http.routers.traefik.tls.domains[0].main=${DOMAIN_NAME}"
      - "traefik.http.routers.traefik.tls.domains[0].sans=*.${DOMAIN_NAME}"
      - "traefik.http.routers.traefik.service=api@internal"
      - "traefik.http.services.traefik.loadbalancer.server.port=8080"
      - "traefik.http.services.traefik.loadbalancer.passhostheader=true"
      - "traefik.http.routers.traefik.middlewares=security-headers@file,compress@file"

      # Basic auth on dashboard
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
DOMAIN_NAME=your-domain.com         # Your root domain here.
DYNU_API_KEY=your-dynu-api-key-here # DDNS API Key (we are using dynu - check the traefik documentation about other providers)

# Traefik Dashboard Credentials
# Generate with: docker run --rm httpd:alpine htpasswd -nb your-username your-password | sed -e 's/\$/\$\$/g'
TRAEFIK_DASHBOARD_CREDENTIALS=admin:$$apr1$$H6uskkkW$$IgXLP6ewTrSuBkTrqE8wj/
```

**Generate dashboard credentials:**
```bash
# Replace `your-username` and `your-password` with your own user and password, then paste the output in the `,env` file for the traefik dashboard.
docker run --rm httpd:alpine htpasswd -nb your-username your-password | sed -e 's/\$/\$\$/g'
```

### Create Certificate File

```bash
touch traefik/certs/acme.json
chmod 600 traefik/certs/acme.json
```

{{% alert context="danger" %}}
The `acme.json` file **must** have `600` permissions, this is for **security**. With that permissions only the Traefik process (and you user) can access (read an write) the certificates stored on that file. 

Also **BE SURE** that you have a copy of that file, because there is where the certificates will be stored.
{{% /alert %}}

### Traefik Configuration

Create `traefik/config/static/traefik.yaml`:

```yaml
global:
  checkNewVersion: true      # Check if new version of traefik is available
  sendAnonymousUsage: false

api:
  dashboard: true
  insecure: false

# Log level. You can use DEBUG initially for see if the certificates are being pulled correctly
log:
  level: INFO # DEBUG, INFO, WARN, ERROR, FATAL, PANIC
  
entryPoints:
  web:
    address: :80
    http:
      redirections:
        entryPoint:
          to: websecure
          scheme: https
          permanent: true

  websecure:
    address: :443
    http:
      tls:
        certResolver: letsencrypt
    transport:
      respondingTimeouts:
        readTimeout: "300s"
        writeTimeout: "300s"
        idleTimeout: "360s"
    http2:
      maxConcurrentStreams: 500
    asDefault: true

serversTransport:
  insecureSkipVerify: false
  forwardingTimeouts:
    dialTimeout: "60s"           # Time to establish TCP connection
    responseHeaderTimeout: "60s" # Time for backend to send headers
    idleConnTimeout: "90s"       

http:
  serversTransports:
    default:
      insecureSkipVerify: false
      forwardingTimeouts:
        dialTimeout: "60s"
        responseHeaderTimeout: "75s"
        idleConnTimeout: "90s"
        readIdleTimeout: "360s"
  timeouts:
    readTimeout: "300s"
    writeTimeout: "300s"
    idleTimeout: "360s"

tls:
  options:
    modern:
      minVersion: 'VersionTLS13'
    default:
      minVersion: 'VersionTLS12'
      cipherSuites:
        - 'TLS_ECDHE_ECDSA_WITH_AES_128_GCM_SHA256'
        - 'TLS_ECDHE_RSA_WITH_AES_128_GCM_SHA256'
        - 'TLS_ECDHE_ECDSA_WITH_AES_256_GCM_SHA384'
        - 'TLS_ECDHE_RSA_WITH_AES_256_GCM_SHA384'
        - 'TLS_ECDHE_ECDSA_WITH_CHACHA20_POLY1305'
        - 'TLS_ECDHE_RSA_WITH_CHACHA20_POLY1305'

providers:
  docker:
    endpoint: "unix:///var/run/docker.sock"
    network: "proxy_network"
    exposedByDefault: false    
  file:
    directory: "/etc/traefik/config" # Directory mounted in the compose file, here we will define our security headers for the services.
    watch: true

certificatesResolvers:
  letsencrypt:
    acme:
      email: your-email@provider.com  # Replace with your email
      storage: /var/traefik/certs/acme.json
      # Use staging first for testing first:
      # caServer: https://acme-staging-v02.api.letsencrypt.org/directory
      # Then switch to production:
      caServer: https://acme-v02.api.letsencrypt.org/directory # certificates for production
      dnsChallenge:
        provider: dynu
        resolvers:
        - "1.1.1.1:53"
        - "1.0.0.1:53"
        # Uncomment if having issues when pulling the certificates.
        # disablePropagationCheck: true
        # delayBeforeCheck: "60s"
```

{{% alert context="warning" %}}
**Important Configuration Updates:**
1. Replace `your-email@provider.com` with your actual email.
2. Change `dynu` with your DDNS provider.
3. Start with staging `caServer` for testing, then switch to production. Let's encrypt has a rate-limit, so if something goes wrong you are testing first.

The staging `caServer` will not give you valid TLS certificates (you will have a warning saying that the site is not secure), but you can see that they are coming from Let's encrypt on your browser, so that is how you test that is working.
{{% /alert %}}

#### Define the security middleware headers:
They will go in the dynamic config directory of traefik (Also called File Provider).

Create `traefik/config/dynamic/middlewares.yaml`:

```yaml
http:
  middlewares:
    # Global security headers, you'll need to refernce it on each service via labels for use it
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
          X-Real-IP: "true"
          X-Forwarded-For: "true"

    # Same as security headers, but letting the site being embedded - Onlyoffice needs that.
    no-frame-block:
      headers:
        sslRedirect: true
        browserXssFilter: true
        contentTypeNosniff: true
        forceSTSHeader: true
        stsIncludeSubdomains: true
        stsPreload: true
        stsSeconds: 15552000
        referrerPolicy: "strict-origin-when-cross-origin"
        customRequestHeaders:
          X-Forwarded-Proto: "https"
          X-Real-IP: "true"
          X-Forwarded-For: "true"

    # This is more for internal services, like APIs or databases.
    security-minimal:
      headers:
        sslRedirect: true
        contentTypeNosniff: true
        stsPreload: true
        customRequestHeaders:
          X-Forwarded-Proto: "https"

    # Compression header for better performance
    compress:
      compress: {}
```


### Deploy Traefik

Just like any other docker compose service, you should be on the directory where you `docker-compose.yaml` is and:

```shell
docker compose up -d
```

See the logs of traefik to see what is happening (CTRL+C to exit):

```shell
docker logs -f traefik
```

#### Test that traefik is working

For test if traefik is working you can visit the dashboard of traefik at: `https://traefik.your-domain.com` (the domain that you used on the `.env` file), and log in with the credentials that you generated before.

![Traefik dashboard](https://private-user-images.githubusercontent.com/178341547/505771423-db82e7fb-083b-467c-8c9f-c4061dbe79b4.png?jwt=eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJpc3MiOiJnaXRodWIuY29tIiwiYXVkIjoicmF3LmdpdGh1YnVzZXJjb250ZW50LmNvbSIsImtleSI6ImtleTUiLCJleHAiOjE3NjE1MTg0OTksIm5iZiI6MTc2MTUxODE5OSwicGF0aCI6Ii8xNzgzNDE1NDcvNTA1NzcxNDIzLWRiODJlN2ZiLTA4M2ItNDY3Yy04YzlmLWM0MDYxZGJlNzliNC5wbmc_WC1BbXotQWxnb3JpdGhtPUFXUzQtSE1BQy1TSEEyNTYmWC1BbXotQ3JlZGVudGlhbD1BS0lBVkNPRFlMU0E1M1BRSzRaQSUyRjIwMjUxMDI2JTJGdXMtZWFzdC0xJTJGczMlMkZhd3M0X3JlcXVlc3QmWC1BbXotRGF0ZT0yMDI1MTAyNlQyMjM2MzlaJlgtQW16LUV4cGlyZXM9MzAwJlgtQW16LVNpZ25hdHVyZT1mZDJjMjBmNWJhNzM3MzI0Zjc4NzY3MzJjMWJlYWZlNmE1YmJlMDIxMjQ3YzNhNzE4MTljNDEwOTE3NTI3ZGFjJlgtQW16LVNpZ25lZEhlYWRlcnM9aG9zdCJ9.7hgJEJQgdUffQ_SXn-DgsOo5g9C977sHJEOgTFEGats)


Or if you want to test it further, you can deploy the other two services first (filebrowser and onlyoffice), and verify that all is working fine.

{{% alert context="danger" %}}
Once you tested that all is working on the staging server, before you change to production **BE SURE** that you deleted the `acme.json` file first before pulling the new production certificates, otherwise will not work. You can just delete the content inside, or recreate the file again:

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
    environment:
      TZ: $TZ
      JWT_SECRET: $ONLYOFFICE_SECRET
      ONLYOFFICE_HTTPS_HSTS_ENABLED: false
    #ports:
     # - '8081:80'  # Commented out because traefik will handle it.
    labels:
      - "traefik.enable=true"
      - "traefik.http.routers.${TRAEFIK_SERVICE_NAME}.tls=true"
      - "traefik.http.routers.${TRAEFIK_SERVICE_NAME}.entrypoints=websecure"
      - "traefik.http.routers.${TRAEFIK_SERVICE_NAME}.tls.certresolver=letsencrypt"
      - "traefik.http.routers.${TRAEFIK_SERVICE_NAME}.tls.options=default"
      - "traefik.http.routers.${TRAEFIK_SERVICE_NAME}.rule=Host(${DOMAIN_NAME})"
      - "traefik.http.routers.${TRAEFIK_SERVICE_NAME}.service=${TRAEFIK_SERVICE_NAME}"
      - "traefik.http.services.${TRAEFIK_SERVICE_NAME}.loadbalancer.server.port=${TRAEFIK_SERVICE_PORT}"
      - "traefik.http.services.${TRAEFIK_SERVICE_NAME}.loadbalancer.passhostheader=true"
      - "traefik.http.routers.${TRAEFIK_SERVICE_NAME}.middlewares=no-frame-block@file,compress@file"   # no-frame-block header that we defined in the middlewares.yaml config file.

      # Headers for onlyoffice, see https://github.com/ONLYOFFICE/onlyoffice-nextcloud/issues/151 for details
      - "traefik.http.middlewares.${TRAEFIK_SERVICE_NAME}-headers.headers.accesscontrolalloworiginlist=*"
    networks:
      proxy_network:
    restart: unless-stopped

networks:
  proxy_network:
    external: true
```

{{% alert context="info" %}}
**Critical for OnlyOffice:**
- `accesscontrolalloworiginlist=*`: Middleware required for CORS - without this onlyoffice don't will work with filebrowser and you will run into issues.
- `ONLYOFFICE_HTTPS_HSTS_ENABLED: false`: Traefik handles HTTPS, not OnlyOffice.
- We should use the `no-frame-block` middleware instead of `security-headers` for onlyoffice to be embedded into FileBrowser. 
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
DOMAIN_NAME=`office.yourdomain.com`   # Don't forget the backticks, they are critical
ONLYOFFICE_SECRET=KDSpcNwKAos2moijgdfi9jf9wr3wek=  # Your output of the openssl command
TZ=America/New_York  # Your timezone
```

### Deploy OnlyOffice

```shell
docker compose up -d
```

Check the logs to see what is happening (CTRL+C to exit):

```shell
docker logs onlyoffice
```

#### Test that OnlyOffice is working

- Visit your onlyoffice URL on your browser (`https://onlyoffice.yourdomain.com`) 

![OnlyOffice](https://private-user-images.githubusercontent.com/178341547/505771448-f4347076-8fe1-4051-947d-3c73476a5084.png?jwt=eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJpc3MiOiJnaXRodWIuY29tIiwiYXVkIjoicmF3LmdpdGh1YnVzZXJjb250ZW50LmNvbSIsImtleSI6ImtleTUiLCJleHAiOjE3NjE1MTg1MjAsIm5iZiI6MTc2MTUxODIyMCwicGF0aCI6Ii8xNzgzNDE1NDcvNTA1NzcxNDQ4LWY0MzQ3MDc2LThmZTEtNDA1MS05NDdkLTNjNzM0NzZhNTA4NC5wbmc_WC1BbXotQWxnb3JpdGhtPUFXUzQtSE1BQy1TSEEyNTYmWC1BbXotQ3JlZGVudGlhbD1BS0lBVkNPRFlMU0E1M1BRSzRaQSUyRjIwMjUxMDI2JTJGdXMtZWFzdC0xJTJGczMlMkZhd3M0X3JlcXVlc3QmWC1BbXotRGF0ZT0yMDI1MTAyNlQyMjM3MDBaJlgtQW16LUV4cGlyZXM9MzAwJlgtQW16LVNpZ25hdHVyZT01NzYxZDUyNjdkOTA0YzM2YThlNTk3YTMwNzNjMDU4MDBlOGIyNGVlMGMwNDgwMDZhM2IwNjU1NTQ1OWZjYWU5JlgtQW16LVNpZ25lZEhlYWRlcnM9aG9zdCJ9.UIWbsQQDc0aeeHRL-lyEVZ_blctY4Q3XITWeLZmhJGw)

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

{{% alert context="info" %}}
Is similar to {{< doclink path="user-guides/office-integration/basic-docker-setup/" text="getting started docker guide" />}} but this one is customized for work with traefik. And also, remember to change the `volumes` block with your actual data/folders, the ones below are an example.
{{% /alert %}}

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
      - "traefik.http.routers.${TRAEFIK_SERVICE_NAME}.tls.options=default"
      - "traefik.http.routers.${TRAEFIK_SERVICE_NAME}.rule=Host(${DOMAIN_NAME})"
      - "traefik.http.routers.${TRAEFIK_SERVICE_NAME}.service=${TRAEFIK_SERVICE_NAME}"
      - "traefik.http.services.${TRAEFIK_SERVICE_NAME}.loadbalancer.server.port=${TRAEFIK_SERVICE_PORT}"
      - "traefik.http.services.${TRAEFIK_SERVICE_NAME}.loadbalancer.passhostheader=true"
      - "traefik.http.routers.${TRAEFIK_SERVICE_NAME}.middlewares=security-headers@file,compress@file" # Security headers

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

Also see {{< doclink path="configuration/configuration-overview/" text="configuration overview" />}} for understand better.

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
    secret: "KDSpcNwKAos2moijgdfi9jf9wr3wek="  # Same as OnlyOffice secret
    viewOnly: false
```

{{% alert context="warning" %}}
**Critical Configuration:**
- `server.externalUrl`: Must match your FileBrowser domain configured on the `.env` file.
- `server.internalUrl`: Uses Docker service name `onlyoffice` and its internal port (80).
- `integrations.office.url`: Must match your OnlyOffice domain configured on the `.env` file of OnlyOffice.
- `integrations.office.secret`: Must match OnlyOffice `JWT_SECRET` exactly (also in the onlyoffice `.env`)
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

### External Resources
- [OnlyOffice Documentation](https://helpcenter.onlyoffice.com/docs)
- [Traefik Documentation](https://doc.traefik.io/traefik/)
- [Docker Compose Documentation](https://docs.docker.com/compose/)

## Next Steps

- {{< doclink path="user-guides/office-integration/traefik-https/" text="Advanced HTTPS Configuration" />}} - Self-signed certificates and traefik file provider
- {{< doclink path="integrations/office/troubleshooting/" text="Office Troubleshooting" />}} - Detailed troubleshooting guide
- {{< doclink path="integrations/office/configuration/" text="Configuration Reference" />}} - All configuration options

## Credits

This guide is a community-contributed guide by [@Kurami32](https://github.com/gtsteffaniak/filebrowser/discussions/1237#discussioncomment-14447935). Thank you for sharing your working setup!