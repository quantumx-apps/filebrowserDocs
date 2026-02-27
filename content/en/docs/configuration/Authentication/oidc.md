---
title: "OIDC Authentication"
description: "OpenID Connect integration"
icon: "fingerprint"
---

Integrate with OpenID Connect providers for single sign-on.

## Basic Setup

```yaml
auth:
  methods:
    oidc:
      enabled: true
      clientId: "filebrowser-client"
      clientSecret: "xxx"  # Use environment variable
      issuerUrl: "https://sso.example.com/application/o/filebrowser/"
      scopes: "email openid profile groups"
      userIdentifier: "preferred_username"
```

{{% alert context="info" %}}
**Note**: Its common to configure a source with {{< doclink path="advanced/source-configuration/sources/#denybydefault" text="denyByDefault" />}} and use {{< doclink path="access-control/rules" text="access rules" />}} to enable group based access for OIDC users.
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
| `userGroups` | List of allowed groups (empty = allow all) - requires v1.3.x+ |
| `groupsClaim` | JSON field for groups (default: `groups`) |
| `disableVerifyTLS` | Disable TLS verification (testing only!) |
| `logoutRedirectUrl` | Provider logout URL |

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

If you a custom baseURL in your `config.yaml`:
```
https://your-domain.com/custom-base/api/auth/oidc/callback
```

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

### Authentik

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

### Authelia

```yaml
auth:
  methods:
    oidc:
      enabled: true
      clientId: "xxx"
      clientSecret: "xxx"
      issuerUrl: "https://auth.example.com"
```

## Group-Based Access Control

### Admin Group

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

### Restrict login to Specific Groups

{{% alert context="info" %}}
requires version `1.3.x`+
{{% /alert %}}

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

## Next Steps

- {{< doclink path="configuration/authentication/password/" text="Password authentication" />}}
- {{< doclink path="configuration/authentication/proxy/" text="Proxy authentication" />}}

