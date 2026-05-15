---
title: "Proxy Authentication"
description: "Header-based authentication"
icon: "security"
date: "2025-10-08T14:59:30Z"
lastmod: "2026-04-20T18:55:31Z"
order: 2
---

Authenticate based on HTTP headers -- strictly designed to be used behind a reverse proxy.

## Configuration

{{% alert context="warning" %}}
If proxy authentication is enabled and a server is accessed without a proxy, FileBrowser will blindly accept the headers. If anyone can bypass the proxy, they can login as any proxy-based user. Take care to configure your environment securely when using this method.
{{% /alert %}}

```yaml
auth:
  methods:
    proxy:
      enabled: true
      header: "X-Forwarded-User"  # or "Remote-User"
      # Optional (same shared fields as OIDC / LDAP / JWT):
      # adminGroup: ""
      # userGroups: []
      # groupsClaim: "groups"
      # userIdentifier: ""
      # disableVerifyTLS: false   # testing only
      # logoutRedirectUrl: ""
```

## Options

| Option | Description |
|--------|-------------|
| `enabled` | Enable proxy authentication |
| `header` | **Required.** Header whose value is trusted as the username (must sit behind a trusted proxy) |
| `adminGroup` | Group name that grants admin (if your proxy/IdP also sends group claims — integration-dependent) |
| `userGroups` | If set, only users in these groups may log in |
| `groupsClaim` | JSON field name for groups when reading group data (default: `groups`) |
| `userIdentifier` | Field to use as username when not using the raw header value in composite setups |
| `disableVerifyTLS` | Disable TLS verification for any outbound calls (testing only) |
| `logoutRedirectUrl` | Optional URL to redirect after logout |

{{% alert context="warning" %}}
**Deprecated:** `createUser` in this block is deprecated and ignored for new configs — user provisioning behavior is always on for supported methods.
{{% /alert %}}

## Example Use Cases

- Corporate SSO via proxy
- Kubernetes ingress authentication
- Nginx auth_request module
- Traefik ForwardAuth

<div class="pattern-card">

## Traefik Example

```yaml
http:
  middlewares:
    auth:
      forwardAuth:
        address: "https://auth.example.com/verify"
        trustForwardHeader: true
```

</div>

<div class="pattern-card">

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

</div>

## Next Steps

- {{< doclink path="configuration/authentication/oidc/" text="OIDC authentication" />}}
- {{< doclink path="configuration/users/" text="Configure users" />}}

