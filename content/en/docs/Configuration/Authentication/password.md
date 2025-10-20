---
title: "Password Authentication"
description: "Configure password authentication"
icon: "vpn_key"
---

Password authentication uses the typical `username` and `password` to login a user. Password authentication also supports **Signup**, **recaptcha**, and **Two-Factor Authentication** features.

## Basic Configuration

```yaml
auth:
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

If password authentication is enabled, by default filebrowser will create a default `admin` user. This admin user is uniquely able to have the password set by the config. This happens automatically on startup if you specify an admin password via environment variable or config file.

### Best practice - use environment variable:

```bash
export FILEBROWSER_ADMIN_PASSWORD="secure-password"
```

### Config based admin password

```
auth:
  adminUsername: admin
  adminPassword: admin # if set it will get reset on startup.
```

## Next Steps

- {{< doclink path="configuration/authentication/oidc/" text="OIDC authentication" />}}
- {{< doclink path="configuration/users/" text="Manage users" />}}

