---
title: "API Reference"
description: "REST API documentation"
icon: "api"
---

FileBrowser provides a comprehensive REST API for programmatic access.

## API Documentation

**Primary Documentation**: Swagger UI

Access Swagger docs at: `/swagger/` (requires API user permissions)

Example: `https://your-domain.com/swagger/`

This swagger page uses a short-live token (2-hour exp) that the UI uses, but allows for quick access to all the API's and their described usage and requirements.

{{% alert context="info" %}}

If you frequently use the API docs, you can make a custom link at the sidebar for easy access. ({{< doclink path="features/sidebar-links/#link-types" text="See sidebar features." />}})

{{% /alert %}}

### API authentication

An API request has 3 options for authentication, checked in this order:

1. `filebrowser_quantum_jwt` cookie in the request with the token value
2. `&auth=<token>` in the query parameter
3. `Bearer <token>` in the authorization header

## Next Steps

- {{< doclink path="reference/cli/" text="CLI commands" />}}
- {{< doclink path="reference/environment-variables/" text="Environment variables" />}}
- {{< doclink path="configuration/authentication/" text="Authentication setup" />}}

