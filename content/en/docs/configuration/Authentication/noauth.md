---
title: "No Authentication"
description: "Disable all authentication (generally unsafe)"
icon: "lock_open"
---

Disable all authentication methods to allow unrestricted access to FileBrowser.

{{% alert context="warning" %}}
**Security Warning**: No authentication mode disables all security checks and allows unrestricted access to your FileBrowser instance. This should **only** be used in controlled testing environments or isolated networks where security is not a concern.
{{% /alert %}}

## Configuration

Enable no authentication mode:

```yaml
auth:
  methods:
    noauth: true  # disables all authentication methods
```

When `noauth: true` is set:
- All authentication methods are disabled
- All users can access FileBrowser without login
- The system automatically uses user ID 1 for all requests
- Overrides all other authentication methods (password, OIDC, proxy)

## Use Cases

### Testing Environments

Useful for local development or testing where authentication is not needed:

```yaml
auth:
  methods:
    noauth: true # disables all authentication methods
```

## Security Considerations

⚠️ **Never use in production** unless:
- The instance is completely isolated from the internet
- All network access is restricted via firewall
- You understand the security implications
- No sensitive data is stored

## Disabling No Auth

To re-enable authentication, set `noauth: false` or remove the setting:

```yaml
auth:
  methods:
    noauth: false
    password:
      enabled: true
```

## Next Steps

- {{< doclink path="configuration/authentication/password/" text="Configure password authentication" />}}
- {{< doclink path="configuration/authentication/oidc/" text="Set up OIDC authentication" />}}
- {{< doclink path="configuration/authentication/proxy/" text="Configure proxy authentication" />}}
