---
title: "Password Authentication"
description: "Configure password authentication"
icon: "vpn_key"
weight: 1
---

Default authentication method using username and password.

## Basic Configuration

```yaml
auth:
  adminUsername: admin
  methods:
    password:
      enabled: true
      minLength: 8
      signup: false
```

## Options

| Option | Default | Description |
|--------|---------|-------------|
| `enabled` | `true` | Enable password authentication |
| `minLength` | `5` | Minimum password length |
| `signup` | `false` | Allow user self-registration |

## With User Signup

```yaml
auth:
  methods:
    password:
      enabled: true
      minLength: 12
      signup: true
```

## With reCAPTCHA

```yaml
auth:
  methods:
    password:
      enabled: true
      signup: true
      recaptcha:
        key: "your-site-key"
        secret: "your-secret"  # Use environment variable
```

## Set Admin Password

Best practice - use environment variable:

```bash
export FILEBROWSER_ADMIN_PASSWORD="secure-password"
```

## Next Steps

- [OIDC authentication](/docs/configuration/authentication/oidc/)
- [Manage users](/docs/configuration/users/)

