---
title: "Troubleshooting"
description: "Common OnlyOffice integration issues and solutions"
icon: "troubleshoot"
---

Solutions for common OnlyOffice integration problems including connectivity, authentication, and document opening issues.

## Debug Mode (Recommended First Step)

The easiest way to troubleshoot OnlyOffice issues is to use the built-in debug mode:

**Enable Debug Mode:**
1. Navigate to **Profile Settings** → **File Viewer Options**
2. Toggle **"Debug OnlyOffice Editor"** to ON
3. Open any document with OnlyOffice
4. View the debug tooltip that appears automatically

![Debug Mode Tooltip](https://github.com/user-attachments/assets/5c26b33d-1483-462f-8ad1-529cbbeac21d)

### What Debug Mode Shows

The debug tooltip provides:
- **Real-time trace** of the integration process
- **Network flow analysis** between components
- **Configuration details** including URLs and domains
- **Specific error detection** with troubleshooting advice
- **Connectivity testing** to OnlyOffice server

### Network Flow Diagram

![Office Integration Diagram](https://github.com/user-attachments/assets/dd22561d-c26e-4b20-9a84-18310596d625)

The diagram shows the communication flow:
1. **Browser** ↔ **OnlyOffice Server**: Editor interface
2. **OnlyOffice** → **FileBrowser** (download URL): Fetches document
3. **OnlyOffice** → **FileBrowser** (callback URL): Saves changes

## Quick Diagnostics

### Verify OnlyOffice is Running

```bash
# Check health endpoint
curl http://localhost/healthcheck

# Expected response:
{"status":"ok"}

# Check welcome page
curl http://localhost/welcome
```

### Test Network Connectivity

From FileBrowser container:

```bash
# Test connection to OnlyOffice
docker exec filebrowser curl http://onlyoffice/healthcheck

# Check DNS resolution
docker exec filebrowser nslookup onlyoffice
```

### Check Browser Console

Open browser developer tools (F12) and look for:

**Successful Config:**
```
OnlyOffice config request: source=downloads, path=/doc.docx, isShare=false
OnlyOffice: built download URL=http://localhost:8080/api/raw?...
OnlyOffice: successfully generated config for file=doc.docx
```

**Successful Save:**
```
OnlyOffice callback: source=downloads, path=/doc.docx, status=2
OnlyOffice: successfully saved updated document
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

{{< tabs tabTotal="3" >}}

{{< tab tabName="Check Service Status" >}}
Verify OnlyOffice is running:

```bash
# Check Docker container status
docker ps | grep onlyoffice

# Check service health
curl http://localhost:80/healthcheck
```

Expected response:
```json
{"status":"ok"}
```

If not running, start OnlyOffice:
```bash
docker-compose up -d onlyoffice
```
{{< /tab >}}

{{< tab tabName="Verify URL Configuration" >}}
FileBrowser needs correct URLs:

```yaml
integrations:
  office:
    url: "http://onlyoffice"       # Must be accessible from browser
    internalUrl: "http://onlyoffice" # Must be accessible from FileBrowser container
    secret: "your-jwt-secret"
```

{{% alert context="warning" %}}
`localhost` will NOT work if services are in separate containers. Use Docker service name or IP address.
{{% /alert %}}

Test the URL from your browser: Navigate to the OnlyOffice URL - you should see a welcome page.
{{< /tab >}}

{{< tab tabName="Check Docker Network" >}}
Ensure containers are on the same network:

```bash
# List networks
docker network ls

# Inspect network
docker network inspect <network-name>
```

Example `docker-compose.yml`:
```yaml
services:
  filebrowser:
    networks:
      - office-network
  
  onlyoffice:
    networks:
      - office-network

networks:
  office-network:
    driver: bridge
```
{{< /tab >}}

{{< /tabs >}}

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

### Documents Won't Open

{{% alert context="danger" %}}
**Problem:** Clicking document shows error or nothing happens

**Symptoms:**
- No response when clicking document
- Blank screen or error message
- Document viewer doesn't load
{{% /alert %}}

**Solutions:**

**1. Check File Format Support**

OnlyOffice supports these formats:

| Document Type | Supported Formats |
|--------------|-------------------|
| Documents | `.doc`, `.docm`, `.docx`, `.dot`, `.dotm`, `.dotx`, `.epub`, `.fb2`, `.fodt`, `.htm`, `.html`, `.mht`, `.odt`, `.ott`, `.rtf`, `.txt`, `.xml` |
| Spreadsheets | `.csv`, `.et`, `.ett`, `.fods`, `.ods`, `.ots`, `.sxc`, `.xls`, `.xlsb`, `.xlsm`, `.xlsx`, `.xlt`, `.xltm`, `.xltx` |
| Presentations | `.dps`, `.dpt`, `.fodp`, `.odp`, `.otp`, `.pot`, `.potm`, `.potx`, `.pps`, `.ppsm`, `.ppsx`, `.ppt`, `.pptm`, `.pptx`, `.sxi` |
| Other | `.djvu`, `.docxf`, `.oform`, `.oxps`, `.pdf`, `.xps` |

{{% alert context="info" %}}
Use `disableOnlyOfficeExt` in user defaults to exclude specific extensions from opening in OnlyOffice.
{{% /alert %}}

**2. Verify File Permissions**

```bash
# Check file permissions
ls -l /path/to/document.docx

# FileBrowser user must have read access
-rw-r--r-- 1 user group 12345 date document.docx
```

**3. Check File Size Limits**

Large files may timeout. Increase limits:

```yaml
onlyoffice:
  environment:
    - MAX_FILE_SIZE=100  # MB
```

**4. Review Logs**

```bash
# FileBrowser logs
docker logs filebrowser --tail 100

# OnlyOffice logs
docker logs onlyoffice --tail 100

# Follow logs in real-time
docker-compose logs -f
```

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
        
        # WebSocket support
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection "upgrade";
        
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

{{% alert context="info" %}}
**Required for v0.8.4+**: Both `externalUrl` and `internalUrl` must be set in server configuration for OnlyOffice to work properly.
{{% /alert %}}

```yaml
server:
  externalUrl: "https://files.yourdomain.com"  # Accessible from browser
  internalUrl: "http://filebrowser:80"         # Accessible from OnlyOffice container

integrations:
  office:
    url: "https://office.yourdomain.com"       # Accessible from browser
    internalUrl: "https://files.yourdomain.com" # For OnlyOffice → FileBrowser callbacks
    secret: "your-jwt-secret"
```

**Why two URLs?**

- **Browser** → OnlyOffice: Uses `integrations.office.url`
- **OnlyOffice** → FileBrowser: Uses `internalUrl` for downloading/saving files
- Internal URLs can use Docker service names for better performance

## Performance Issues

### Slow Document Loading

{{% alert context="warning" %}}
**Problem:** Documents take long time to open or edit

**Symptoms:**
- Long delays before document loads
- Laggy editing experience
- Frequent timeouts
{{% /alert %}}

**Solutions:**

**1. Increase OnlyOffice Resources**

```yaml
onlyoffice:
  deploy:
    resources:
      limits:
        memory: 4G
        cpus: '2.0'
      reservations:
        memory: 2G
        cpus: '1.0'
```

**2. Use Persistent Storage**

```yaml
onlyoffice:
  volumes:
    - onlyoffice_data:/var/www/onlyoffice/Data
    - onlyoffice_logs:/var/log/onlyoffice

volumes:
  onlyoffice_data:
  onlyoffice_logs:
```

**3. Optimize Timeouts**

```yaml
# Traefik
serversTransport:
  forwardingTimeouts:
    dialTimeout: "60s"
    responseHeaderTimeout: "75s"
    idleConnTimeout: "90s"

# nginx
proxy_connect_timeout 300s;
proxy_send_timeout 300s;
proxy_read_timeout 300s;
```

### Connection Timeouts

{{% alert context="warning" %}}
**Problem:** Gateway timeout or connection timeout errors
{{% /alert %}}

Check and increase timeouts at multiple levels:

**Traefik:**
```yaml
http:
  serversTransports:
    default:
      forwardingTimeouts:
        dialTimeout: "30s"
        responseHeaderTimeout: "60s"
        idleConnTimeout: "90s"
```

**OnlyOffice:**
```yaml
environment:
  - TIMEOUT=300
```

**Test Network Latency:**
```bash
# Test response time
time curl http://onlyoffice/healthcheck

# Check network path
docker exec filebrowser ping onlyoffice
```

## Troubleshooting Checklist

Use this checklist when debugging OnlyOffice issues:

- [ ] **Enable debug mode** in FileBrowser profile settings
- [ ] **Check OnlyOffice is running**: `docker ps | grep onlyoffice`
- [ ] **Verify health endpoint**: `curl http://onlyoffice/healthcheck`
- [ ] **Test from browser**: Navigate to OnlyOffice URL, see welcome page
- [ ] **Check JWT secrets match** in both configurations
- [ ] **Verify network connectivity** between containers
- [ ] **Check browser console** for JavaScript errors
- [ ] **Review logs** from both FileBrowser and OnlyOffice
- [ ] **Verify file format** is supported
- [ ] **Check file permissions** and size limits
- [ ] **Test with HTTPS disabled** (if using SSL)
- [ ] **Verify externalUrl and internalUrl** are set correctly

## Getting Help

### Gather Information

When asking for help, provide:

1. **FileBrowser version:**
```bash
docker exec filebrowser ./filebrowser version
```

2. **OnlyOffice version:**
```bash
docker exec onlyoffice /var/www/onlyoffice/documentserver/npm/json -f /var/www/onlyoffice/documentserver/package.json version
```

3. **Configuration** (sanitized - remove secrets):
```yaml
integrations:
  office:
    url: "https://office.example.com"
    secret: "REDACTED"
```

4. **Logs:**
```bash
docker logs onlyoffice --tail 100
docker logs filebrowser --tail 100
```

5. **Debug mode output** (screenshot from browser)

6. **Browser console errors** (F12 → Console tab)

### Test OnlyOffice Independently

Verify OnlyOffice works standalone:

```bash
# Visit welcome page
curl http://localhost/welcome

# Should return HTML with OnlyOffice welcome page
```

### Enable Verbose Logging

```yaml
onlyoffice:
  environment:
    - LOG_LEVEL=DEBUG
```

### Community Resources

- [GitHub Issues](https://github.com/gtsteffaniak/filebrowser/issues) - Report bugs
- [GitHub Discussions](https://github.com/gtsteffaniak/filebrowser/discussions) - Ask questions
- [OnlyOffice Documentation](https://helpcenter.onlyoffice.com/) - Official OnlyOffice docs
- [Community Configurations](https://github.com/gtsteffaniak/filebrowser/discussions/1237) - Working examples

## Next Steps

- [Configuration](/docs/integrations/office/configuration/) - Set up OnlyOffice integration
- [Office guides](/docs/integrations/office/guides/) - Usage examples and best practices
- [About OnlyOffice](/docs/integrations/office/about/) - Features and capabilities
