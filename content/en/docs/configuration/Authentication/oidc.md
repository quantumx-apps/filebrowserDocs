---
title: "OIDC Authentication"
description: "OpenID Connect integration"
icon: "fingerprint"
date: "2025-10-08T14:59:30Z"
lastmod: "2026-08-05T15:34:23Z"
---

Integrate with OpenID Connect providers for single sign-on.

{{% alert context="info" %}}
**OIDC callback URL:** FileBrowser does **not** use `http.externalUrl` for OIDC. Register your provider callback from the URL you actually use to log in (for example `https://files.example.com/files/api/auth/oidc/callback`). See [Callback URL](#callback-url) below.
{{% /alert %}}

## Basic Setup

```yaml
auth:
  methods:
    oidc:
      enabled: true
      clientId: "filebrowser-client"
      clientSecret: "xxx"  # Use environment variable
      issuerUrl: "https://sso.example.com/application/o/filebrowser/"
      scopes: "openid email profile"
      userIdentifier: "preferred_username"
```

If you need group claims, add them to `scopes` (for example `groups`) per your provider.

{{% alert context="info" %}}
**Note**: Its common to configure a source with {{< doclink path="configuration/sources#denybydefault" text="denyByDefault" />}} and use {{< doclink path="access-control/rules" text="access rules" />}} to enable group based access for OIDC users.
{{% /alert %}}

## Configuration Options

| Option | Description |
|--------|-------------|
| `enabled` | Enable OIDC authentication |
| `clientId` | OIDC client ID |
| `clientSecret` | OIDC client secret (use env var) |
| `issuerUrl` | OIDC provider URL |
| `scopes` | Requested scopes |
| `userIdentifier` | User field (`preferred_username`, `email`, `username`, `phone`) |
| `adminGroup` | OIDC group name for admin rights |
| `userGroups` | List of allowed groups (empty = allow all) |
| `groupsClaim` | JSON field for groups (default: `groups`) |
| `disableVerifyTLS` | Disable TLS verification (testing only!) |
| `logoutRedirectUrl` | Provider logout URL |

**Defaults (when omitted):** `groupsClaim` is `groups`, `userIdentifier` is `preferred_username`, and `scopes` defaults to `openid email profile`.

{{% alert context="warning" %}}
**Deprecated:** `createUser` in this block is deprecated — omit it; new users are created automatically when OIDC login succeeds.
{{% /alert %}}

## Issuer URL Examples

**Authentik**:
```
https://domain.com/application/o/filebrowser/
```

**Pocket ID/Authelia**:
```
https://domain.com
```

## Callback URL

Append `/api/auth/oidc/callback` to the end of your base URL to get FileBrowser's OIDC callback URL.

Configure in your OIDC provider:

```
https://your-domain.com/api/auth/oidc/callback
```

If you use a custom `baseURL` in your `config.yaml`:
```
https://your-domain.com/custom-base/api/auth/oidc/callback
```

## Reverse proxy

When FileBrowser sits behind HTTPS nginx, Traefik, or Caddy, the incoming request often arrives as `http://` with the proxy's internal host. Configure forwarded headers so the request-derived callback uses the browser-facing scheme and host.

**v2.0.0+** — single boolean (replaces the v1.5.x list):

```yaml
http:
  baseURL: "/files"
  trustProxyHeaders: true
```

**v1.5.x** (current stable) — list the forwarding headers your proxy sets:

```yaml
http:
  baseURL: "/files"
  trustedHeaders:
    - X-Forwarded-Proto
    - X-Forwarded-Host
    - X-Forwarded-For
    - X-Real-IP
```

Your proxy must send at least `X-Forwarded-Proto: https` and `X-Forwarded-Host` matching the browser URL. Without header trust enabled, the callback may register as `http://` or the wrong host and your OIDC provider will reject login.

On **v2.0.0+**, FileBrowser logs a **warning** when OIDC is enabled but `trustProxyHeaders` is false.

See {{< doclink path="getting-started/reverse-proxy/" text="Running behind a reverse proxy" />}} and {{< doclink path="configuration/http/#trustproxyheaders" text="HTTP reverse-proxy headers" />}}.

## Auto-Redirect

When OIDC is the only auth method, users are automatically redirected to the OIDC provider.

```yaml
auth:
  methods:
    password:
      enabled: false
    oidc:
      enabled: true
```

## Provider Examples

<div class="pattern-card">

### Authentik

Typical settings when Authentik exposes groups and an optional admin group mapping:

```yaml
auth:
  methods:
    oidc:
      enabled: true
      clientId: "xxx"
      clientSecret: "xxx"
      issuerUrl: "https://auth.example.com/application/o/filebrowser/"
      adminGroup: "authentik Admins"
```

</div>

<div class="pattern-card">

### Authelia

Minimal Authelia client configuration:

```yaml
auth:
  methods:
    oidc:
      enabled: true
      clientId: "xxx"
      clientSecret: "xxx"
      issuerUrl: "https://auth.example.com"
```

</div>

## Group-Based Access Control

### Admin Group

<div class="pattern-card">

Grant admin privileges to users in a specific OIDC group:

```yaml
auth:
  methods:
    oidc:
      enabled: true
      clientId: "xxx"
      clientSecret: "xxx"
      issuerUrl: "https://auth.example.com"
      adminGroup: "FileBrowser Admins"
```

</div>

### Restrict login to Specific Groups

<div class="pattern-card">

Only allow users in specific OIDC groups to access FileBrowser:

```yaml
auth:
  methods:
    oidc:
      enabled: true
      clientId: "xxx"
      clientSecret: "xxx"
      issuerUrl: "https://auth.example.com"
      userGroups: ["FileBrowser Users", "guests"]
```

Users not in these groups will be denied access even with valid OIDC authentication.

</div>

## Next Steps

- {{< doclink path="configuration/authentication/password/" text="Password authentication" />}}
- {{< doclink path="configuration/authentication/proxy/" text="Proxy authentication" />}}

