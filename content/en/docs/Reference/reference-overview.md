---
title: "Reference Overview"
description: "Complete technical reference documentation"
icon: "library_books"
---

Complete technical reference for FileBrowser Quantum.

## Reference Documentation

### [Environment Variables](/docs/reference/environment-variables/)
Complete list of environment variables for configuration.

- Server configuration
- Authentication settings
- Integration configuration
- Source definitions
- Logging options

### [CLI Commands](/docs/reference/cli/)
Command-line interface reference.

- Server command
- Configuration options
- Version information
- Help command

### [API Documentation](/docs/reference/api/)
RESTful API reference and Swagger documentation.

- Authentication endpoints
- User management
- Resource operations
- Share management
- Settings endpoints

## Quick Reference

### Configuration File

Primary configuration via `config.yaml`:

```yaml
server:
  port: 8080
  sources:
    - name: "files"
      path: "/data"

auth:
  adminUsername: "admin"
  adminPassword: "admin"

integrations:
  media:
    ffmpegPath: "/usr/local/bin"
  office:
    enabled: true
    url: "http://onlyoffice:80"
```

### Environment Variable Format

All config options available as environment variables:

```bash
FILEBROWSER_SERVER_PORT=8080
FILEBROWSER_AUTH_ADMINUSERNAME=admin
FILEBROWSER_OFFICE_URL=http://onlyoffice:80
```

Format: `FILEBROWSER_` + UPPER_SNAKE_CASE path to config key.

### API Access

**Swagger UI**: `http://localhost:8080/swagger/`

**Authentication**:
```bash
# Login
curl -H "X-Password: password" \
  "http://localhost:8080/api/auth/login?username=admin"

# Use token
curl -H "Authorization: Bearer ${TOKEN}" \
  http://localhost:8080/api/users
```

### CLI Usage

```bash
# Run with config file
./filebrowser -c config.yaml

# Show version
./filebrowser version

# Show help
./filebrowser --help
```

## Configuration Examples

Complete examples for common scenarios:

### Basic Setup

```yaml
server:
  port: 8080
  sources:
    - name: "files"
      path: "/srv/files"
```

### Multi-Source

```yaml
server:
  sources:
    - name: "documents"
      path: "/srv/documents"
    - name: "media"
      path: "/mnt/media"
```

### With Authentication

```yaml
auth:
  methods:
    passwordAuth:
      enabled: true
      signup: false
      enforcedOtp: false
    oidc:
      enabled: true
      issuer: "https://auth.example.com"
      clientId: "filebrowser"
```

### With Integrations

```yaml
integrations:
  media:
    ffmpegPath: "/usr/bin"
  
  office:
    enabled: true
    url: "http://onlyoffice:80"
    secret: "jwt-secret"
```

## Next Steps

- [Environment variables](/docs/reference/environment-variables/)
- [CLI commands](/docs/reference/cli/)
- [API documentation](/docs/reference/api/)
