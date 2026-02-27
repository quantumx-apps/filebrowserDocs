---
title: "Proxy Authentication"
description: "Header-based authentication"
icon: "security"
order: 2
---

Authenticate based on HTTP headers -- strictly designed to be used behind a reverse proxy.

{{% alert context="warning" %}}
If proxy authentication is enabled and a server is accessed without a proxy, FileBrowser will blindly accept the headers. If anyone can bypass the proxy, they can login as any proxy-based user. Take care to configure your environment securely when using this method.
{{% /alert %}}

## Configuration

```yaml
auth:
  methods:
    proxy:
      enabled: true
      header: "X-Forwarded-User"  # or "Remote-User"
```

## Use Cases

- Corporate SSO via proxy
- Kubernetes ingress authentication
- Nginx auth_request module
- Traefik ForwardAuth

## Traefik Example

```yaml
http:
  middlewares:
    auth:
      forwardAuth:
        address: "https://auth.example.com/verify"
        trustForwardHeader: true
```

## Nginx Example

```
map $remote_addr $uuid {
    default "demo-${remote_addr}";
}

server {
    listen 80;
    server_name localhost 127.0.0.1;

    location / {
        proxy_set_header X-Username $uuid;
        add_header X-Forwarded-User $uuid;
        proxy_pass http://filebrowser:8080/subpath;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
    }
}

```

FileBrowser config:
```yaml
auth:
  methods:
    proxy:
      enabled: true
      header: "X-Forwarded-User"
    password:
      enabled: false
```

## Next Steps

- {{< doclink path="configuration/authentication/oidc/" text="OIDC authentication" />}}
- {{< doclink path="configuration/users/" text="Configure users" />}}

