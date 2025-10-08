---
title: "Troubleshooting"
description: "Common office integration issues"
icon: "troubleshoot"
weight: 4
---

Solutions for common office integration problems.

## Office Server Not Found

**Symptoms**: Documents don't open, error messages about connection refused.

**Solutions**:

1. **Verify office server is running**:
```bash
# Check Collabora
curl http://localhost:9980/hosting/discovery

# Check OnlyOffice
curl http://localhost:80/healthcheck
```

2. **Check URL configuration**:
```yaml
integrations:
  office:
    url: "http://collabora:9980"  # Correct hostname and port
```

3. **Test network connectivity**:
```bash
# From FileBrowser container
docker exec filebrowser curl http://collabora:9980/hosting/discovery
```

4. **Check Docker network**:
```bash
docker network ls
docker network inspect <network-name>
```

## CORS Errors

**Symptoms**: "Cross-Origin Request Blocked" errors in browser console.

**Solutions**:

1. **Configure Collabora domain**:
```yaml
environment:
  - domain=filebrowser\\.localhost|files\\.yourdomain\\.com
```

Use pipe `|` to separate multiple domains.

2. **Configure OnlyOffice CORS**:
```yaml
environment:
  - WOPI_ENABLED=true
  - ALLOW_CORS=true
```

3. **Check reverse proxy headers**:
```nginx
proxy_set_header Host $host;
proxy_set_header X-Real-IP $remote_addr;
proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
proxy_set_header X-Forwarded-Proto $scheme;
```

## JWT Errors

**Symptoms**: "JWT verification failed", "Invalid token" errors.

**Solutions**:

1. **Verify JWT secret matches**:

FileBrowser:
```yaml
integrations:
  office:
    jwtSecret: "exact-same-secret"
```

Office server:
```yaml
environment:
  - JWT_SECRET=exact-same-secret
```

2. **Ensure JWT is enabled on both sides**:

Collabora:
```yaml
environment:
  - extra_params=--o:jwt.enabled=true --o:jwt.secret=your-secret
```

OnlyOffice:
```yaml
environment:
  - JWT_ENABLED=true
  - JWT_SECRET=your-secret
```

3. **Generate strong JWT secret**:
```bash
openssl rand -base64 32
```

## Documents Won't Open

**Symptoms**: Clicking document does nothing or shows error.

**Solutions**:

1. **Check file format is supported**:

Supported formats:
- Documents: `.doc`, `.docx`, `.odt`, `.rtf`, `.txt`
- Spreadsheets: `.xls`, `.xlsx`, `.ods`, `.csv`
- Presentations: `.ppt`, `.pptx`, `.odp`

2. **Verify file permissions**:
```bash
ls -l /path/to/document.docx
```

FileBrowser user must have read access.

3. **Check file size**:

Large files may timeout. Increase timeouts:

```yaml
# In office server config
environment:
  - MAX_FILE_SIZE=100  # MB
```

4. **Review logs**:
```bash
# FileBrowser logs
docker-compose logs filebrowser

# Collabora logs
docker-compose logs collabora

# OnlyOffice logs
docker-compose logs onlyoffice
```

## SSL/TLS Errors

**Symptoms**: "SSL handshake failed", "Certificate verification failed".

**Solutions**:

1. **For development, disable SSL verification** (not for production):

Collabora:
```yaml
environment:
  - extra_params=--o:ssl.enable=false
```

2. **For production, use valid certificates**:

```yaml
integrations:
  office:
    url: "https://collabora.yourdomain.com"
```

Ensure certificates are:
- Valid and not expired
- Trusted by system CA store
- Include full certificate chain

3. **Configure SSL termination at reverse proxy**:

```yaml
environment:
  - extra_params=--o:ssl.enable=true --o:ssl.termination=true
```

## Performance Issues

**Symptoms**: Slow document loading, timeouts.

**Solutions**:

1. **Increase office server resources**:

```yaml
onlyoffice:
  deploy:
    resources:
      limits:
        memory: 4G
        cpus: '2'
```

2. **Configure document cache**:

OnlyOffice:
```yaml
volumes:
  - onlyoffice_data:/var/www/onlyoffice/Data
```

3. **Use faster storage**:

Mount cache volumes on SSD.

4. **Enable compression**:

```nginx
gzip on;
gzip_types text/plain application/json application/javascript;
```

## Connection Timeouts

**Symptoms**: "Gateway timeout", "Connection timeout" errors.

**Solutions**:

1. **Increase proxy timeouts**:

nginx:
```nginx
proxy_connect_timeout 300s;
proxy_send_timeout 300s;
proxy_read_timeout 300s;
```

2. **Increase office server timeout**:

```yaml
environment:
  - TIMEOUT=300
```

## Provider-Specific Issues

### Collabora

**Discovery endpoint fails**:
```bash
# Test discovery
curl -v http://localhost:9980/hosting/discovery

# Should return XML with capabilities
```

**Font rendering issues**:
```yaml
volumes:
  - /usr/share/fonts:/usr/share/fonts:ro
```

### OnlyOffice

**Database connection errors**:

OnlyOffice requires PostgreSQL for multi-server setups:
```yaml
onlyoffice:
  environment:
    - DB_TYPE=postgres
    - DB_HOST=postgres
    - DB_NAME=onlyoffice
    - DB_USER=onlyoffice
    - DB_PWD=password
```

**License errors**:

For commercial use, ensure valid license is configured.

## Docker-Specific Issues

**Container can't resolve hostname**:

Use IP address or ensure containers are on same network:
```yaml
networks:
  - filebrowser-network

networks:
  filebrowser-network:
    driver: bridge
```

**Port conflicts**:

Change ports if 80 or 9980 are in use:
```yaml
ports:
  - "9981:9980"  # Use 9981 externally
```

Update URL in config:
```yaml
integrations:
  office:
    url: "http://collabora:9981"
```

## Getting Help

If you continue experiencing issues:

1. Enable debug logging in office server
2. Check both FileBrowser and office server logs
3. Test office server independently
4. Review [GitHub Issues](https://github.com/gtsteffaniak/filebrowser/issues)
5. Ask in [GitHub Discussions](https://github.com/gtsteffaniak/filebrowser/discussions)

## Next Steps

- [Office guides](/docs/integrations/office/guides/)
- [Configuration](/docs/integrations/office/configuration/)
- [Help & Support](/docs/help/)

