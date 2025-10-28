---
title: "Troubleshooting"
description: "Common OnlyOffice integration issues and solutions"
icon: "troubleshoot"
---

Solutions for common OnlyOffice integration problems including connectivity, authentication, and document opening issues.

## Enable Debug logging and Debug Mode

If you are having persistent issues with OnlyOffice, the first thing should be to enable debug logging on all of the related components:

1. The frontend Debug Mode
2. The FileBrowser server debug logs
3. The OnlyOffice server debug logs

### Enable Frontend Debug Mode

**Enable Debug Mode:**
1. Navigate to **Profile Settings** → **File Viewer Options**
2. Toggle **"Debug OnlyOffice Editor"** to ON
3. Open any document with OnlyOffice
4. View the debug tooltip that appears automatically

![Debug Mode Tooltip]()

#### What Debug Mode Shows

The debug tooltip provides:
- **Real-time trace** of the integration process
- **Network flow analysis** between components
- **Configuration details** including URLs and domains
- **Specific error detection** with troubleshooting advice
- **Connectivity testing** to OnlyOffice server

#### Network Flow Diagram

![Office Integration Diagram](https://github.com/user-attachments/assets/dd22561d-c26e-4b20-9a84-18310596d625)

The diagram shows the communication flow:
1. **Browser** ↔ **OnlyOffice Server**: Editor interface
2. **OnlyOffice** → **FileBrowser** (download URL): Fetches document
3. **OnlyOffice** → **FileBrowser** (callback URL): Saves changes

### Enable FileBrowser server debug logs

Configure filebrowser to run with {{< doclink path="advanced/logging/debug-logging/" text="debug logging" />}}

### Enable OnlyOffice service debug logs

```yaml
onlyoffice:
  environment:
    - LOG_LEVEL=DEBUG
```

## Quick Diagnostics

### Verify OnlyOffice is Running

```bash
# Check health endpoint
curl http://<onlyoffice-server>/healthcheck

# Expected response:
{"status":"ok"}

# Check welcome page
curl http://<onlyoffice-server>/welcome
```

## Common Issues

### OnlyOffice Server Not Found

{{% alert context="danger" %}}
**Problem:** Documents don't open, connection refused errors

**Symptoms:**
- Error messages about connection refused
- Can't reach OnlyOffice server
- Documents fail to load
- Empty preview screen when opening documents
{{% /alert %}}

**Solutions:**

Verify OnlyOffice is running:

```bash
# Check Docker container status
docker ps | grep onlyoffice

# Check service health
curl http://<onlyoffice-server>/healthcheck
```

Expected response:
```json
{"status":"ok"}
```

FileBrowser needs correct URLs:

```yaml
integrations:
  office:
    url: "http://<onlyoffice-server>"       # Must be accessible from browser
    secret: "your-jwt-secret"
```

{{% alert context="warning" %}}
`localhost` will NOT work if services are in separate containers. Use Docker service name or IP address.
{{% /alert %}}

Test the URL from your browser: Navigate to the OnlyOffice URL - you should see a welcome page.

### JWT Authentication Errors

{{% alert context="danger" %}}
**Problem:** "JWT verification failed" or "Invalid token" errors

**Symptoms:**
- Documents won't open
- Authentication errors in logs
- Token validation failures
{{% /alert %}}

**Step 1: Generate JWT Secret**

Create a strong random secret:

```bash
# Generate 32-byte base64 secret
openssl rand -base64 32

# Or use uuidgen
uuidgen
```

**Step 2: Configure FileBrowser**

```yaml
integrations:
  office:
    url: "http://onlyoffice"
    secret: "your-generated-secret"  # Use the secret from Step 1
```

**Step 3: Configure OnlyOffice**

```yaml
onlyoffice:
  environment:
    - JWT_ENABLED=true
    - JWT_SECRET=your-generated-secret  # MUST match FileBrowser exactly
    - JWT_HEADER=Authorization
```

{{% alert context="warning" %}}
The JWT secret must be **identical** in both configurations, including capitalization and special characters. Any mismatch will cause authentication failures.
{{% /alert %}}

### HTTPS and SSL/TLS Issues

{{% alert context="danger" %}}
**Problem:** Mixed content errors, SSL handshake failures

**Symptoms:**
- "Mixed content" warnings in browser
- Documents load partially then fail
- SSL certificate errors
- CORS errors with HTTPS
{{% /alert %}}

OnlyOffice does not work with HTTPS out of the box when behind a reverse proxy. You need proper SSL configuration.

{{< tabs tabTotal="3" >}}

{{< tab tabName="Development (HTTP)" >}}
For local development without SSL:

```yaml
integrations:
  office:
    url: "http://localhost:8080"

onlyoffice:
  environment:
    - JWT_ENABLED=true
    - JWT_SECRET=your-secret
```

{{% alert context="warning" %}}
HTTP is **not secure** for production. Only use for local testing. Never expose HTTP OnlyOffice to the internet.
{{% /alert %}}
{{< /tab >}}

{{< tab tabName="Production (Traefik)" >}}
Community-contributed Traefik configuration with automatic SSL:

**FileBrowser Service:**
```yaml
filebrowser:
  image: gtstef/filebrowser
  labels:
    - "traefik.enable=true"
    - "traefik.http.routers.filebrowser.rule=Host(`files.yourdomain.com`)"
    - "traefik.http.routers.filebrowser.entrypoints=websecure"
    - "traefik.http.routers.filebrowser.tls.certresolver=letsencrypt"
    - "traefik.http.services.filebrowser.loadbalancer.server.port=80"
  networks:
    - proxy

onlyoffice:
  image: onlyoffice/documentserver
  environment:
    - JWT_ENABLED=true
    - JWT_SECRET=your-secret
    - JWT_HEADER=Authorization
    - ONLYOFFICE_HTTPS_HSTS_ENABLED=false
  labels:
    - "traefik.enable=true"
    - "traefik.http.routers.onlyoffice.rule=Host(`office.yourdomain.com`)"
    - "traefik.http.routers.onlyoffice.entrypoints=websecure"
    - "traefik.http.routers.onlyoffice.tls.certresolver=letsencrypt"
    - "traefik.http.services.onlyoffice.loadbalancer.server.port=80"
    # Required headers for OnlyOffice
    - "traefik.http.routers.onlyoffice.middlewares=onlyoffice-headers"
    - "traefik.http.middlewares.onlyoffice-headers.headers.customrequestheaders.X-Forwarded-Proto=https"
    - "traefik.http.middlewares.onlyoffice-headers.headers.accesscontrolalloworiginlist=*"
  networks:
    - proxy

networks:
  proxy:
    external: true
```

**FileBrowser Config:**
```yaml
server:
  externalUrl: "https://files.yourdomain.com"
  internalUrl: "http://filebrowser:80"

integrations:
  office:
    url: "https://office.yourdomain.com"
    internalUrl: "https://files.yourdomain.com"
    secret: "your-secret"
```

{{% alert context="info" %}}
Key points:
- Both services behind Traefik with automatic Let's Encrypt certificates
- Custom headers required for OnlyOffice CORS
- `internalUrl` set for server-to-server communication
{{% /alert %}}
{{< /tab >}}

{{< tab tabName="Production (nginx)" >}}
nginx reverse proxy configuration:

```nginx
# OnlyOffice upstream
upstream onlyoffice {
    server onlyoffice:80;
}

server {
    listen 443 ssl http2;
    server_name office.yourdomain.com;

    ssl_certificate /path/to/cert.pem;
    ssl_certificate_key /path/to/key.pem;

    location / {
        proxy_pass http://onlyoffice;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;

        # Timeouts
        proxy_connect_timeout 300s;
        proxy_send_timeout 300s;
        proxy_read_timeout 300s;
    }
}
```

**FileBrowser Config:**
```yaml
integrations:
  office:
    url: "https://office.yourdomain.com"
    internalUrl: "http://onlyoffice:80"
    secret: "your-secret"
```
{{< /tab >}}

{{< /tabs >}}

## Advanced Configuration

### External and Internal URLs

```yaml
server:
  externalUrl: "https://files.yourdomain.com"  # Accessible from browser
  internalUrl: "http://192.168.1.100"         # Either use local network or docker network IP thats accessible from onlyoffice server.

integrations:
  office:
    url: "https://office.yourdomain.com"       # Accessible from browser
    secret: "your-jwt-secret"
```

**Why two URLs?**

- **Browser** → The browser always uses `integrations.office.url` to connect from your browser to only office server.
- **OnlyOffice** → Uses either `server.externalUrl` or `server.internalUrl` for downloading/saving files to FileBrowser server.
- **FileBrowser** → Uses either `integratons.office.internalUrl` or `integrations.office.url` to connect from the filebrowser server to OnlyOffice server.

## Performance Issues

### Slow Document Loading

Document loading can be quite slow because of the many components onlyoffice needs to talk to. The best way to improve document loading times it to set `server.internalUrl` so OnlyOffice can communicate directly with filebrowser (it's possible on same private network).

## Getting Help

### Gather Information

When asking for help, provide:

1. **Logs:** Most imprtantly relevant debug logs from the server, as well as OnlyOffice server logs.
1. **Debug mode output** (screenshot from browser)
2. **Browser console errors** (F12 → Console tab)

### Community Resources

- [GitHub Issues](https://github.com/gtsteffaniak/filebrowser/issues) - Report bugs
- [GitHub Discussions](https://github.com/gtsteffaniak/filebrowser/discussions) - Ask questions
- [OnlyOffice Documentation](https://helpcenter.onlyoffice.com/) - Official OnlyOffice docs
- [Community Configurations](https://github.com/gtsteffaniak/filebrowser/discussions/1237) - Working examples

## Next Steps

- {{< doclink path="integrations/office/configuration/" text="Configuration" />}} - Set up OnlyOffice integration
- {{< doclink path="integrations/office/guides/" text="Office guides" />}} - Usage examples and best practices
- {{< doclink path="integrations/office/about/" text="About OnlyOffice" />}} - Features and capabilities
