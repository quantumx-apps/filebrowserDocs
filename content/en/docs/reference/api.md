---
title: "API Reference"
description: "REST API documentation"
icon: "api"
---

FileBrowser provides a comprehensive REST API for programmatic access.

## API Routes Overview

FileBrowser Quantum separates API routes into **standard** and **public** endpoints:

### Standard API Routes (`/api/`)

Standard API routes generally require user authentication and are used for authenticated operations:

- `/api/users` - User management
- `/api/resources` - File and folder operations
- `/api/shares` - Share management
- `/api/settings` - System settings
- `/api/access` - Access control rules
- `/api/events` - Server-sent events (SSE)
- `/api/search` - File search
- `/api/auth/*` - Authentication endpoints

### Public API Routes (`/public/api/`)

Public API routes use hash-based authentication for share access and do not require user login:

- `/public/api/resources` - Access shared files (hash-based)
- `/public/api/raw` - Direct file download (hash-based)
- `/public/api/preview` - File previews (hash-based)
- `/public/api/shareinfo` - Share information
- `/public/api/onlyoffice/*` - OnlyOffice callbacks for shares

{{% alert context="info" %}}
Public API routes are designed for share functionality and use stricter logging to prevent sensitive information leakage. These routes allow shares to function without requiring authentication at the reverse proxy level.
{{% /alert %}}

## Route Structure

```
Standard Routes (Authentication Required):
├── /api/*              - Private API endpoints
├── /dav/*              - WebDAV access
└── /swagger/           - API documentation

Public Routes (Hash-based or Optional Auth):
├── /public/api/*       - Public API (share hash authentication)
├── /public/share/*     - Share pages (optional authentication)
└── /public/static/*   - Static assets (no authentication)

Other Routes:
├── /                   - Main UI (optional authentication)
└── /health             - Health check (no authentication)
```

## API Documentation

**Primary Documentation**: Swagger UI

Access Swagger docs at: `/swagger/` (requires API user permissions)

Example: `https://your-domain.com/swagger/`

This swagger page uses a short-live token (2-hour exp) that the UI uses, but allows for quick access to all the API's and their described usage and requirements.

{{% alert context="info" %}}

If you frequently use the API docs, you can make a custom link at the sidebar for easy access. ({{< doclink path="features/sidebar-links/#link-types" text="See sidebar features." />}})

{{% /alert %}}

### API authentication

For **standard API routes** (`/api/`), authentication has 3 options, checked in this order:

1. `filebrowser_quantum_jwt` cookie in the request with the token value
2. `&auth=<token>` in the query parameter
3. `Bearer <token>` in the authorization header

For **public API routes** (`/public/api/`), authentication is hash-based:
- Share hash provided in query parameter: `?hash=<share-hash>`
- Optional password token for password-protected shares: `&token=<password-token>`

## Next Steps

- {{< doclink path="reference/cli/" text="CLI commands" />}}
- {{< doclink path="reference/environment-variables/" text="Environment variables" />}}
- {{< doclink path="configuration/authentication/" text="Authentication setup" />}}

