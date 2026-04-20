---
title: "Authentication"
description: "Configure authentication methods"
icon: "lock"
order: 4
---

FileBrowser Quantum supports several authentication methods. They are configured under `auth` in your main config file (see `config.generated.yaml` in the application repo for the full, up-to-date shape).

## Top-level `auth` options

These apply regardless of which login methods you enable:

| Option | Default | Description |
|--------|---------|-------------|
| `tokenExpirationHours` | `2` | Lifetime of web UI session tokens (hours). |
| `key` | *(random if unset)* | Secret used to sign **application** session JWTs. Use an env var in production. |
| `adminUsername` | `admin` | Bootstrap admin username (also used when resetting admin from config). |
| `adminPassword` | `admin` | Bootstrap admin password when set (prefer env vars). |
| `totpSecret` | *(empty)* | Encrypts stored TOTP secrets for password users with 2FA; required before users can enable 2FA. |

```yaml
auth:
  tokenExpirationHours: 2
  key: ""                    # secret: session signing key
  adminUsername: "admin"     # secret
  adminPassword: "admin"     # secret
  totpSecret: ""             # secret: TOTP encryption
  methods:
    noauth: false
    password: { ... }
    proxy: { ... }
    oidc: { ... }
    ldap: { ... }
    jwt: { ... }
```

{{% alert context="warning" %}}
**Deprecated:** On methods that embed the shared “auth common” block, `createUser` is deprecated and treated as always enabled for supported methods — omit it from new configs.
{{% /alert %}}

## Choosing a method

| Method | Doc | Typical use |
|--------|-----|-------------|
| Password | {{< doclink path="configuration/authentication/password/" text="Password" />}} | Local users, 2FA, optional signup + reCAPTCHA |
| OIDC | {{< doclink path="configuration/authentication/oidc/" text="OIDC" />}} | SSO with OpenID Connect providers |
| Proxy header | {{< doclink path="configuration/authentication/proxy/" text="Proxy" />}} | Trusted reverse proxy sets username header |
| JWT | {{< doclink path="configuration/authentication/jwt/" text="JWT" />}} | Signed tokens in a header or `?jwt=` |
| LDAP | {{< doclink path="configuration/authentication/ldap/" text="LDAP" />}} | Directory login (bind + search) |
| No auth | {{< doclink path="configuration/authentication/noauth/" text="No auth" />}} | **Unsafe** — only isolated testing |

When `auth.methods.noauth` is `true`, it **overrides** all other methods.

## Shared options on proxy, OIDC, LDAP, and JWT

These fields come from the same embedded config block (`AuthCommon`):

- `enabled` — turn the method on (password uses this; `noauth` is a separate boolean).
- `adminGroup` — group name/DN that grants admin.
- `userGroups` — if non-empty, only members of these groups may log in.
- `groupsClaim` — claim/attribute name for groups (defaults vary by method; see each guide).
- `userIdentifier` — claim/attribute used as FileBrowser username (defaults vary).
- `disableVerifyTLS` — **insecure**; skip TLS verification for outbound auth calls (testing only).
- `logoutRedirectUrl` — optional provider logout URL after sign-out.

## Next steps

- {{< doclink path="configuration/users/" text="User defaults and permissions" />}}
- {{< doclink path="configuration/server/" text="Server settings" />}}
