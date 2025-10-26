---
title: "Self-signed certs with Traefik"
description: "Advanced HTTPS setup with self-signed certificates and traefik file provider"
icon: "lock"
order: 4
---

Advanced OnlyOffice HTTPS configuration using Traefik and self-signed certificates for internal OnlyOffice communication.

{{% alert context="info" %}}
This guide is community-contributed. Special thanks to [@BaccanoMob](https://github.com/gtsteffaniak/filebrowser/discussions/1237) for documenting these methods!
{{% /alert %}}

## Overview

We have two methods for have self-signed certs, ordered by complexity (easiest first)

| Method | Description | Difficulty | Security |
|--------|-------------|------------|----------|
| **Method 1** | Self-signed certs + skip verification | ⭐⭐ Medium | Good |
| **Method 2** | Self-signed certs + full verification | ⭐⭐⭐ Advanced | Best |

{{% alert context="success" %}}
**Recommended:** Only use this guide if you have specific security requirements. Otherwise check the {{< doclink path="user-guides/office-integration/traefik-setup/" text="Traefik Setup Guide" />}} which covers full deployment of all the services, this is the most **easy** and **recommended** way.
{{% /alert %}}

## Method 1: Self-Signed Certificates (Skip Verification)

Use this when:
- You need custom certificates.
- You're not using Let's Encrypt.
- Internal network deployment.
- Corporate CA requirements.

### Step 1: Generate Self-Signed Certificates

Create certificates directory:

```bash
mkdir -p certs && cd certs
```

Generate OnlyOffice certificates:

```bash
openssl req -x509 -nodes -days 20000 -subj "/CN=onlyoffice" \
  -newkey rsa:2048 \
  -keyout onlyoffice.key \
  -out onlyoffice.crt
```

**Command Breakdown:**

| Flag | Purpose |
|------|---------|
| `-x509` | Create self-signed certificate (not a request) |
| `-nodes` | No passphrase required |
| `-days 20000` | Valid for ~50 years (only for internal use) |
| `-subj "/CN=onlyoffice"` | Set Common Name without prompts |
| `-newkey rsa:2048` | Generate RSA 2048-bit key pair |

{{% alert context="warning" %}}
**Security Note:** Setting expiry to 20,000 days is bad practice for public certificates, but acceptable here since:
- Traefik sees these certs only for internal verification
- Browser sees Traefik's Let's Encrypt certificate
- These certs are never exposed publicly
{{% /alert %}}

### Step 2: Configure OnlyOffice with Certificates

Update `docker-compose.yaml`:

```yaml
services:
  onlyoffice:
    image: onlyoffice/documentserver
    container_name: onlyoffice
    environment:
      - JWT_ENABLED=true
      - JWT_SECRET=your-secret-here
      - JWT_HEADER=Authorization
      - ONLYOFFICE_HTTPS_HSTS_ENABLED=false
    volumes:
      - ./certs:/var/www/onlyoffice/Data/certs  # Mount certificates
      - onlyoffice_data:/var/www/onlyoffice/Data
    networks:
      - proxy_network
```

{{% alert context="info" %}}
The certificates **must** be mounted at `/var/www/onlyoffice/Data/certs` and named `onlyoffice.key` and `onlyoffice.crt`.
{{% /alert %}}

### Step 3: Configure Traefik File Provider

Traefik needs to be told to skip certificate verification. This requires **dynamic configuration** which can be done via file provider.

**Add file provider to `traefik.yaml`:**

```yaml
providers:
  docker:
    endpoint: "unix:///var/run/docker.sock"
    network: "proxy_network"
    exposedByDefault: false
  file:  # Add this
    directory: /etc/traefik/config
    watch: true
```

**Update Traefik `docker-compose.yml`:**

```yaml
traefik:
  image: traefik:latest
  volumes:
    - /var/run/docker.sock:/var/run/docker.sock:ro
    - ./config/static/traefik.yaml:/etc/traefik/traefik.yaml:ro
    - ./config/dynamic:/etc/traefik/config:ro  # Add this
```

### Step 4: Create OnlyOffice Dynamic Configuration

Create `dynamic/onlyoffice.yml`:

```yaml
http:
  routers:
    onlyoffice:
      entrypoints:
        - websecure  # or 'https' depending on your config
      rule: Host(`onlyoffice.yourdomain.com`)
      tls:
        certResolver: letsencrypt  # Your cert resolver name
      service: onlyoffice
      # This is the critical setting:
      middlewares:
        - onlyoffice-headers

  services:
    onlyoffice:
      loadBalancer:
        servers:
          - url: "https://onlyoffice"  # Note: HTTPS, not HTTP
        serversTransport: onlyoffice  # Reference to transport below

  middlewares:
    onlyoffice-headers:
      headers:
        customRequestHeaders:
          X-Forwarded-Proto: "https"
        accessControlAllowOriginList:
          - "*"

  serversTransports:
    onlyoffice:
      insecureSkipVerify: true  # This skips certificate verification
```

{{% alert context="warning" %}}
**Security Consideration:** `insecureSkipVerify: true` means Traefik won't validate OnlyOffice's certificate. This is acceptable because:
- Communication stays within Docker network
- OnlyOffice is not directly exposed
- Browser still sees valid Let's Encrypt certificate
{{% /alert %}}

### Step 5: Update FileBrowser Configuration

```yaml
integrations:
  office:
    url: "https://onlyoffice.yourdomain.com"  # External HTTPS URL
    internalUrl: "https://onlyoffice:80"     # Internal HTTPS (Docker service name)
    secret: "your-jwt-secret"
```

### Step 6: Restart Services

```bash
# Restart Traefik to load file provider
docker restart traefik

# Restart OnlyOffice with certificates
docker restart onlyoffice

# Restart FileBrowser
docker restart filebrowser
```

### Verify Configuration

```bash
# Check OnlyOffice is using HTTPS
docker exec onlyoffice cat /etc/onlyoffice/documentserver/nginx/ds.conf | grep ssl

# Test from Traefik perspective
docker exec traefik wget --no-check-certificate https://onlyoffice/healthcheck
```

## Method 2: Self-Signed Certificates (Full Verification)

Use this for maximum security when you want Traefik to verify OnlyOffice's certificate.

### Step 1: Create Certificate Configuration

Create `certs/cert.conf`:

```ini
[req]
default_bits = 2048
prompt = no
default_md = sha256
distinguished_name = dn
x509_extensions = v3_req

[dn]
CN = onlyoffice

[v3_req]
subjectAltName = @alt_names

[alt_names]
IP.1 = 172.18.0.255  # Static IP for OnlyOffice container
DNS.1 = onlyoffice   # Docker service name
```

{{% alert context="info" %}}
**Why IP and DNS?**
- `IP.1`: Allows verification via IP address
- `DNS.1`: Allows verification via Docker service name
- Both are required for proper certificate validation
{{% /alert %}}

### Step 2: Generate Certificates with Config

```bash
cd certs
openssl req -x509 -nodes -days 20000 \
  -keyout onlyoffice.key \
  -out onlyoffice.crt \
  -config cert.conf
```

### Step 3: Assign Static IP to OnlyOffice

Update `onlyoffice/docker-compose.yaml`:

```yaml
services:
  onlyoffice:
    image: onlyoffice/documentserver
    container_name: onlyoffice
    environment:
      - JWT_ENABLED=true
      - JWT_SECRET=your-secret
      - ONLYOFFICE_HTTPS_HSTS_ENABLED=false
    volumes:
      - ./certs:/var/www/onlyoffice/Data/certs
    networks:
      proxy_network:
        ipv4_address: 172.18.0.255  # Must match cert.conf
```

{{% alert context="warning" %}}
**IP Address Rules:**
- Must be in your Docker network subnet (e.g., `172.18.0.0/24`)
- Use high numbers (>100) to avoid Docker's auto-allocation range
- Must match exactly what's in `cert.conf`
{{% /alert %}}

### Step 4: Mount Certificate in Traefik

Traefik needs access to the certificate to verify it:

```yaml
traefik:
  image: traefik:latest
  volumes:
    - /var/run/docker.sock:/var/run/docker.sock:ro
    - ./config/static/traefik.yaml:/etc/traefik/traefik.yaml:ro
    - ./config/dynamic:/dynamic:ro
    - /path/to/certs/onlyoffice.crt:/certs/onlyoffice.crt:ro  # Add this
```

### Step 5: Update Traefik Dynamic Config

Create `dynamic/onlyoffice.yml`:

```yaml
http:
  routers:
    onlyoffice:
      entrypoints:
        - websecure
      rule: Host(`office.yourdomain.com`)
      tls:
        certResolver: letsencrypt
      service: onlyoffice

  services:
    onlyoffice:
      loadBalancer:
        servers:
          - url: "https://onlyoffice"  # Or https://172.18.0.255
        serversTransport: onlyoffice

  middlewares:
    onlyoffice-headers:
      headers:
        customRequestHeaders:
          X-Forwarded-Proto: "https"
        accessControlAllowOriginList:
          - "*"

  serversTransports:
    onlyoffice:
      rootCAs:
        - /certs/onlyoffice.crt  # Path inside Traefik container
      # insecureSkipVerify NOT set (defaults to false)
```

{{% alert context="success" %}}
**Security Improvement:** Now Traefik fully validates OnlyOffice's certificate using the provided CA, ensuring encrypted and authenticated communication.
{{% /alert %}}

### Step 6: Restart containers

```bash
# Restart all services
docker compose restart traefik 
docker compose restart onlyoffice
docker compose restart filebrowser

# Check Traefik can verify certificate
docker exec traefik wget https://onlyoffice/healthcheck
# Should succeed without certificate errors
```

## Method 3: Extract Certificates from Traefik for onlyoffice

{{% alert context="info" %}}
**Experimental:** This method extracts Let's Encrypt certificates from Traefik and provides them to OnlyOffice for internal communication.
{{% /alert %}}

**Concept:**
1. Traefik obtains Let's Encrypt certificates.
2. Extract certificates from `acme.json`.
3. Mount extracted certificates to OnlyOffice.
4. Automate re-extraction on renewal.

**Challenges:**
- Certificates renew every 90 days, so you will need to repeat these steps (unless automated).
- Requires automation script.
- OnlyOffice restart needed after renewal.
- More complexity than needed.

**Script Example:**

```bash
#!/bin/bash
# extract-certs.sh

ACME_FILE="traefik/certs/acme.json"
DOMAIN="office.yourdomain.com"
OUTPUT_DIR="certs/extracted"

# Extract certificate and key from acme.json
jq -r ".letsencrypt.Certificates[] | select(.domain.main==\"$DOMAIN\") | .certificate" "$ACME_FILE" | base64 -d > "$OUTPUT_DIR/cert.pem"
jq -r ".letsencrypt.Certificates[] | select(.domain.main==\"$DOMAIN\") | .key" "$ACME_FILE" | base64 -d > "$OUTPUT_DIR/key.pem"

# Restart OnlyOffice to load new certificates
docker-compose -f onlyoffice/docker-compose.yaml restart
```

{{% alert context="danger" %}}
This method is **not recommended** for production. Use {{< doclink path="user-guides/office-integration/traefik-setup/" text="Traefik Setup Guide" />}} instead, which handles everything automatically.
{{% /alert %}}

## Comparison Table

| Feature | Method 1 | Method 2 | Method 3 |
|---------|----------|----------|----------|------------|
| **Setup Complexity** | ⭐⭐ Medium | ⭐⭐⭐ Advanced | ⭐⭐⭐⭐ Complex |
| **Security** | Good | Excellent | Excellent |
| **Maintenance** | None | None | High |
| **Certificate Renewal** | Never expires | Never expires | Every 90 days |
| **Use Case** | Custom CA | Maximum security | Not recommended |
| **Browser SSL** | Let's Encrypt | Let's Encrypt | Let's Encrypt |
| **Internal SSL** | HTTPS | HTTPS | HTTPS |

## Troubleshooting

### Certificate Errors in Traefik Logs

```bash
# Check Traefik logs
docker logs traefik | grep -i certificate

# Common errors:
# - "x509: certificate signed by unknown authority" → Need rootCAs in transport
# - "x509: certificate is valid for X, not Y" → DNS/IP mismatch in cert
# - "tls: bad certificate" → Wrong certificate mounted
```

### OnlyOffice Not Starting with HTTPS

```bash
# Check OnlyOffice nginx config
docker exec onlyoffice cat /etc/onlyoffice/documentserver/nginx/ds.conf

# Check certificate files
docker exec onlyoffice ls -la /var/www/onlyoffice/Data/certs/

# Should show:
# -rw-r--r-- onlyoffice.crt
# -rw-r--r-- onlyoffice.key
```

### Mixed Content Errors

Ensure all URLs use `https://` in FileBrowser config:

```yaml
server:
  externalUrl: "https://files.yourdomain.com"

integrations:
  office:
    url: "https://onlyoffice.yourdomain.com"
    internalUrl: "https://onlyoffice:80"  # Method 1/2 only
```

### Verify Certificate Details

```bash
# Check certificate subject and SAN
openssl x509 -in certs/onlyoffice.crt -noout -text | grep -A1 "Subject:"
openssl x509 -in certs/onlyoffice.crt -noout -text | grep -A2 "Subject Alternative"

# Should show:
# Subject: CN = onlyoffice
# Subject Alternative Name:
#   DNS:onlyoffice, IP Address:172.18.0.255
```

## Configuration Summary

### Method 1 (Skip Verify)

```yaml
# OnlyOffice: HTTPS with self-signed cert.
volumes:
  - ./certs:/var/www/onlyoffice/Data/certs

# Traefik: Skip verification
serversTransports:
  onlyoffice:
    insecureSkipVerify: true
```

### Method 2 (Full Verify)

```yaml
# OnlyOffice: HTTPS with SAN cert
networks:
  proxy_network:
    ipv4_address: 172.18.0.255

# Traefik: Verify with CA
serversTransports:
  onlyoffice:
    rootCAs:
      - /certs/onlyoffice.crt
```

## Best Practices

1. **Start Simple**: Use {{< doclink path="user-guides/office-integration/traefik-setup/" text="Traefik Setup Guide" />}} unless you have specific requirements.
2. **Test Staging First**: Use Let's Encrypt staging for initial testing.
3. **Monitor Logs**: Watch logs during first deployment.
4. **Backup Certificates**: Keep `acme.json` backed up.
5. **Document Setup**: Note which method you used for future reference.

## Next Steps

- {{< doclink path="user-guides/office-integration/basic-docker-setup/" text="Basic Docker Setup" />}} - Start here if new to Docker.
- {{< doclink path="user-guides/office-integration/traefik-setup/" text="Traefik Setup Guide" />}} - Complete services setup behind Traefik.
- {{< doclink path="integrations/office/troubleshooting/" text="Office Troubleshooting" />}} - Detailed problem solving.
- {{< doclink path="integrations/office/configuration/" text="Configuration Reference" />}} - All config options.

## Credits

This guide is based on community contributions from:
- [@BaccanoMob](https://github.com/gtsteffaniak/filebrowser/discussions/1237) - HTTPS methods documentation
- [@Kurami32](https://github.com/gtsteffaniak/filebrowser/discussions/1237) - Working Traefik configuration

Thank you for sharing your knowledge with the community!

