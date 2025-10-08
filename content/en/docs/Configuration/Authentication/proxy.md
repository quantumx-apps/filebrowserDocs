---
title: "Proxy Authentication"
description: "Header-based authentication"
icon: "security"
weight: 3
---

Authenticate based on HTTP headers from reverse proxy.

## Configuration

```yaml
auth:
  methods:
    proxy:
      enabled: true
      header: "X-Forwarded-User"  # or "Remote-User"
      createUser: true
```

## Use Cases

- Corporate SSO via proxy
- Kubernetes ingress authentication
- Nginx auth_request module
- Traefik ForwardAuth

## Traefik Example

Traefik middleware:
```yaml
http:
  middlewares:
    auth:
      forwardAuth:
        address: "https://auth.example.com/verify"
        trustForwardHeader: true
```

FileBrowser config:
```yaml
auth:
  methods:
    proxy:
      enabled: true
      header: "X-Forwarded-User"
      createUser: true
```

## Next Steps

- [OIDC authentication](/docs/configuration/authentication/oidc/)
- [Configure users](/docs/configuration/users/)

