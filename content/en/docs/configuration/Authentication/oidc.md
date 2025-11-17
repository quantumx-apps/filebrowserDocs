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
      createUser: true
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
| `createUser` | Auto-create users on first login |
| `adminGroup` | OIDC group name for admin rights |
| `groupsClaim` | JSON field for groups (default: `groups`) |
| `disableVerifyTLS` | Disable TLS verification (testing only!) |
| `logoutRedirectUrl` | Provider logout URL |

## Issuer URL Examples

**Authentik/Authelia**:
```
https://domain.com/application/o/filebrowser/
```

**Pocket ID**:
```
https://domain.com/
```

## Callback URL

Configure in your OIDC provider:

```
https://your-domain.com/api/auth/oidc/callback
```

With custom baseURL:
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

## Next Steps

- {{< doclink path="configuration/authentication/password/" text="Password authentication" />}}
- {{< doclink path="configuration/authentication/proxy/" text="Proxy authentication" />}}

