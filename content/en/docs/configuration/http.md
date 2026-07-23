---
title: "HTTP Settings"
description: "Configure HTTP options including trusted proxy headers and auth rate limiting"
icon: "http"
date: "2026-05-22T15:40:53Z"
lastmod: "2026-05-22T16:24:35Z"
order: 4
---

Configure HTTP-level options for reverse-proxy integration and authentication rate limiting.

```yaml
http:
  trustedHeaders:
    - X-Forwarded-For
    - X-Real-IP
  disableRateLimit: false
```

## Configuration Options

<div class="pattern-card">

### trustedHeaders

List of request headers FileBrowser should trust when resolving the client IP address (default: none).

```yaml
http:
  trustedHeaders:
    - X-Forwarded-For
    - X-Real-IP
```

When a header is listed, FileBrowser uses it instead of the direct connection address (`RemoteAddr`). This is required for correct client IP detection when FileBrowser runs behind a reverse proxy.

Supported headers:

| Header | Behavior |
|--------|----------|
| `X-Forwarded-For` | Uses the **first** IP in the comma-separated chain as the client address |
| `X-Real-IP` | Uses the header value as the client address |

{{% alert context="warning" %}}
Only enable headers your reverse proxy **sets or overwrites**. If FileBrowser is reachable directly from the internet, trusting `X-Forwarded-For` or `X-Real-IP` lets clients spoof their IP by sending those headers themselves — which weakens per-IP rate limiting and failed-login lockout.
{{% /alert %}}

When running behind a proxy, configure your proxy to forward client IPs and list the matching headers here. See {{< doclink path="getting-started/reverse-proxy/#client-ip-and-trusted-headers" text="Reverse proxy: client IP and trusted headers" />}} for nginx, Traefik, and Caddy examples.

</div>

<div class="pattern-card">

### disableRateLimit

Turns off built-in auth route rate limiting and failed-login lockout (default: `false`).

```yaml
http:
  disableRateLimit: false
```

Leave this `false` in production. Setting it to `true` removes HTTP 429 throttling and account lockout on authentication endpoints.

</div>

## Built-in authentication rate limiting

When `disableRateLimit` is `false` and password (or other credential) auth is enabled, FileBrowser applies **per-process, in-memory** limits on `/api/auth/*` routes. Limits are not configurable via YAML; they are built into the server.

### Credential tier (login, OTP verify)

Used by `POST /api/auth/login` and `POST /api/auth/otp/verify`.

| Control | Limit |
|---------|-------|
| Per-IP token bucket | 10 requests/minute, burst 8 |
| Per-username token bucket | 10 requests/minute, burst 8 |
| Failed-login lockout | 8 consecutive `401` responses for the same IP **and** username → 15-minute lockout |

Behavior:

- **Rapid automated attempts** exhaust the token bucket and receive **HTTP 429** with a short `Retry-After` (seconds).
- **Slower guessing** that stays under the per-minute rate is blocked by **failed-login lockout**, which returns **HTTP 429** with `Retry-After=900` (15 minutes).
- A successful login clears the lockout counter for that IP and username.

Passkey login endpoints use the credential token buckets without failed-login lockout.

### Other auth tiers

| Tier | Routes (examples) | Per-key limit |
|------|-------------------|---------------|
| Moderate | logout, signup, OTP generate | 30/min, burst 10 (per IP) |
| OIDC | OIDC login and callback | 60/min, burst 20 (per IP) |
| Authenticated | token management, session renew, passkey register | 180/min, burst 60 (per logged-in username) |

### Limitations

- Limits apply **per FileBrowser process**. Restarting the server clears counters. Multiple replicas do not share state.
- Failed-login lockout is keyed by **IP + username**, not username alone. Per-username token buckets still apply when an attacker rotates IPs against one account.
- Rate limiting is disabled when `http.disableRateLimit` is `true` or when `auth.methods.noAuth` is enabled.

## Example: reverse proxy deployment

```yaml
server:
  port: 8080
  baseURL: "/files"
  externalUrl: "https://files.example.com/files"

http:
  trustedHeaders:
    - X-Forwarded-For
    - X-Real-IP
  disableRateLimit: false
```

## Related documentation

- {{< doclink path="getting-started/reverse-proxy/" text="Running behind a reverse proxy" />}} — proxy header configuration
- {{< doclink path="configuration/authentication/" text="Authentication" />}} — login methods and password policy
