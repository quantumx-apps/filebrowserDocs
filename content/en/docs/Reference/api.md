---
title: "API Reference"
description: "REST API documentation"
icon: "api"
---

FileBrowser provides a comprehensive REST API for programmatic access.

## API Documentation

**Primary Documentation**: Swagger UI (self-documenting)

Access Swagger docs at: `/swagger/` (requires authentication)

Example: `https://your-domain.com/swagger/`

Regardless of whether a user has API permissions, anyone can visit the swagger page which is found at `/swagger`. This swagger page uses a short-live token (2-hour exp) that the UI uses, but allows for quick access to all the API's and their described usage and requirements.

## API Base URL

**Default**: `/api/`

**With baseURL**: `/{baseURL}/api/`

Example configurations:
- Root: `https://domain.com/api/`
- Custom: `https://domain.com/files/api/`

## Authentication

### JWT Token Authentication

Most endpoints require JWT token authentication.

**Get token** via `/api/auth/login`:

```bash
curl -H "X-Password: password" \
  "https://domain.com/api/auth/login?username=admin"
```

Response:
```
eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...  # JWT token (200 OK)
```

**For TOTP/2FA**:
```bash
curl -H "X-Password: password" \
     -H "X-Secret: 123456" \
  "https://domain.com/api/auth/login?username=admin"
```

**Use token** in subsequent requests:

```bash
curl -H "Authorization: Bearer YOUR_TOKEN" \
  https://domain.com/api/resources
```

### API Key Authentication

Create API key in **Settings** → **API Management** section. This section will only show up if the user has "API" permissions, which can be granted by editing the user in user management.

**Use API key**:

```bash
curl -H "X-Auth: YOUR_API_KEY" \
  https://domain.com/api/resources
```

API keys don't expire (until revoked).

## API Groups

### Authentication Endpoints

**Base**: `/api/auth/`

- `POST /login` - User login
- `POST /logout` - User logout
- `POST /signup` - User registration (if enabled)
- `POST /renew` - Renew JWT token
- `POST /otp/generate` - Generate 2FA QR code
- `POST /otp/verify` - Verify 2FA code
- `PUT /token` - Create API key
- `GET /tokens` - List API keys
- `DELETE /token` - Delete API key
- `GET /oidc/login` - OIDC login redirect
- `GET /oidc/callback` - OIDC callback

### User Endpoints

**Base**: `/api/users`

- `GET /users` - Get user info
- `POST /users` - Create user (admin)
- `PUT /users` - Update user
- `DELETE /users` - Delete user (admin)

### Resource Endpoints

**Base**: `/api/resources`

- `GET /resources` - Get file/directory info
- `POST /resources` - Create file/directory or upload
- `PUT /resources` - Move/rename file
- `PATCH /resources` - Update file content
- `DELETE /resources` - Delete file/directory
- `GET /raw` - Download file
- `GET /preview` - Get file preview

### Share Endpoints

**Base**: `/api/shares`

- `GET /shares` - List shares
- `GET /share` - Get share details
- `POST /share` - Create share
- `DELETE /share` - Delete share
- `GET /share/direct` - Direct download link

### Access Control Endpoints

**Base**: `/api/access`

- `GET /access` - Get access rules (admin)
- `POST /access` - Create access rule (admin)
- `DELETE /access` - Delete access rule (admin)
- `GET /access/groups` - Get groups (admin)
- `POST /access/group` - Create group (admin)
- `DELETE /access/group` - Delete group (admin)

### Settings Endpoints

**Base**: `/api/settings`

- `GET /settings` - Get settings (admin)
- `GET /settings/config` - Get config (admin)

### Search Endpoint

- `GET /api/search` - Search files

### Events Endpoint

- `GET /api/events` - Server-Sent Events stream

## Public API

Public endpoints accessible via share hash.

**Base**: `/public/api/`

**Authentication**: Hash-based (no JWT required)

- `GET /raw?hash=xxx` - Download shared file
- `GET /resources?hash=xxx` - Get shared resource info
- `GET /preview?hash=xxx` - Preview shared file
- `POST /resources?hash=xxx` - Upload to shared folder

## Example Usage

### Login and Get Files

```bash
# Login
TOKEN=$(curl -s -H "X-Password: password" \
  "https://domain.com/api/auth/login?username=admin")

# Get files
curl -H "Authorization: Bearer $TOKEN" \
  "https://domain.com/api/resources?path=/folder"
```

### Upload File

```bash
curl -X POST \
  -H "Authorization: Bearer $TOKEN" \
  -F "file=@localfile.txt" \
  "https://domain.com/api/resources?path=/folder/newfile.txt"
```

### Create Directory

```bash
curl -X POST \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json" \
  -d '{"path":"/newfolder"}' \
  "https://domain.com/api/resources"
```

### Download File

```bash
curl -H "Authorization: Bearer $TOKEN" \
  "https://domain.com/api/raw?path=/file.txt" \
  -o downloaded.txt
```

### Create Share

```bash
curl -X POST \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "path": "/folder/file.txt",
    "source": "main",
    "expire": 86400,
    "password": "secret"
  }' \
  "https://domain.com/api/share"
```

### Search Files

```bash
curl -H "Authorization: Bearer $TOKEN" \
  "https://domain.com/api/search?query=document&path=/folder"
```

## Response Format

### Success Response

**Status**: 200-299

```json
{
  "data": { ... }
}
```

### Error Response

**Status**: 400-599

```json
{
  "status": 404,
  "message": "File not found"
}
```

## Rate Limiting

No built-in rate limiting. Configure at reverse proxy level if needed.

## CORS

CORS configured for same-origin by default.

For cross-origin access, configure your reverse proxy.

## Swagger Documentation

**Recommended**: Use Swagger UI for interactive API exploration.

**Access**: Login to FileBrowser → Navigate to `/swagger/`

Features:
- Interactive testing
- Complete parameter documentation
- Response examples
- Authentication integration

## API Patterns

### Middleware Stack

From `httpRouter.go`:

```
Request → Logging → Authentication → Authorization → Handler
```

**Authentication middlewares**:
- `withUser` - Requires authenticated user
- `withAdmin` - Requires admin user
- `withOrWithoutUser` - Optional authentication
- `withHashFile` - Hash-based (public shares)

### Path Parameters

Most endpoints use query parameters:

```
GET /api/resources?path=/folder/file.txt&source=main
```

### Request Context

Each request includes:
- User information
- File information
- Share context
- JWT token

## Security Considerations

1. **Always use HTTPS** in production
2. **Rotate JWT secrets** regularly
3. **Limit API key scope** when possible
4. **Monitor API usage** for anomalies
5. **Use API keys** for automation (not user tokens)

## Next Steps

- {{< doclink path="reference/cli/" text="CLI commands" />}}
- {{< doclink path="reference/environment-variables/" text="Environment variables" />}}
- {{< doclink path="configuration/authentication/" text="Authentication setup" />}}

