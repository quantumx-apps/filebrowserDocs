---
title: "HTTP Settings"
description: "Configure HTTP listening, URLs, TLS, WebDAV, reverse-proxy headers, and auth rate limiting"
icon: "http"
date: "2026-05-22T15:32:14Z"
lastmod: "2026-07-23T23:13:35Z"
order: 4
---

{{% alert context="warning" %}}
**v2.0.0 behavior change**

All HTTP-related options moved from `server` to the top-level `http` key: `port`, `listen`, `baseURL`, `socket`, `tlsCert`, `tlsKey`, `externalUrl`, `internalUrl`, `disableWebDAV`, `trustedHeaders`, and `disableRateLimit`. If your config still has these under `server`, run the {{< doclink path="getting-started/v2/config-migration/" text="config migration tool" />}} or move them manually — see {{< doclink path="getting-started/v2/migration/" text="v2 migration guide" />}}.
{{% /alert %}}

Configure how FileBrowser listens for HTTP traffic, how URLs are built for shares and integrations, and how the server behaves behind a reverse proxy.

```yaml
http:
  port: 80
  listen: ""                    # default: 0.0.0.0
  baseURL: "/"
  externalUrl: ""
  internalUrl: ""
  socket: ""
  tlsCert: ""
  tlsKey: ""
  disableWebDAV: false
  trustedHeaders:
    - X-Forwarded-For
    - X-Real-IP
  disableRateLimit: false
```

## Configuration Options

<div class="pattern-card">

### port

TCP port FileBrowser listens on (default: `80`).

```yaml
http:
  port: 80
```

Ignored when `http.socket` is set (Unix socket mode).

{{% alert context="info" %}}
**Docker healthcheck**: If you change the port from the default (`80`), update the Docker healthcheck in your `docker-compose.yaml` to match. See {{< doclink path="getting-started/docker/#healthcheck-configuration" text="Docker healthcheck configuration" />}}.
{{% /alert %}}

{{% alert context="warning" %}}
**Privileged ports**: For ports **below 1024**, Linux only allows a non-root process to bind if it has the **`NET_BIND_SERVICE`** capability (or `net.ipv4.ip_unprivileged_port_start` is lowered). **Rootful** Docker Engine / Docker Desktop usually includes `NET_BIND_SERVICE` in the default profile. **`bind: permission denied` is more typical with rootless engines** (Docker rootless, Podman rootless).
{{% /alert %}}

</div>

<div class="pattern-card">

### listen

Address FileBrowser binds to (default: `0.0.0.0` — all interfaces).

```yaml
http:
  listen: "127.0.0.1"   # localhost only
```

Use `127.0.0.1` when a reverse proxy on the same host forwards traffic to FileBrowser.

</div>

<div class="pattern-card">

### baseURL

Subpath FileBrowser is served under (default: `/`). Required when running behind a reverse proxy on a path prefix.

```yaml
http:
  baseURL: "/files"
```

FileBrowser normalizes this to leading and trailing slashes (e.g. `/files/`). Routes, static assets, and API paths are all prefixed with this value.

</div>

<div class="pattern-card">

### socket

Unix domain socket to listen on instead of TCP `port` (default: empty — use TCP).

```yaml
http:
  socket: "/var/run/filebrowser.sock"
```

When set, `http.port` is not used. **Cannot be combined** with `tlsCert` / `tlsKey` — the server exits at startup if both are configured.

</div>

<div class="pattern-card">

### tlsCert and tlsKey

Paths to TLS certificate and private key for HTTPS. Both must be set to enable TLS.

```yaml
http:
  tlsCert: "/path/to/cert.pem"
  tlsKey: "/path/to/key.pem"
  port: 443
```

When TLS is enabled, the server logs an `https://` URL. **Cannot be combined** with `http.socket`.

</div>

<div class="pattern-card">

### externalUrl

Public base URL used when generating share links (optional). Include scheme and host; `baseURL` is appended automatically when needed.

```yaml
http:
  externalUrl: "https://files.example.com"
  baseURL: "/files"
```

If unset, share links are built from the incoming request (`Host` header and scheme).

</div>

<div class="pattern-card">

### internalUrl

Base URL integration services use to reach FileBrowser on the network (optional). Used by OnlyOffice and similar integrations when the public URL is not reachable from the integration container.

```yaml
http:
  internalUrl: "http://filebrowser:80"
```

Typically a Docker service name, internal DNS name, or LAN IP. See {{< doclink path="integrations/office/configuration/" text="OnlyOffice configuration" />}}.

</div>

<div class="pattern-card">

### disableWebDAV

Disable WebDAV support (default: `false`). When `true`, the `/dav` route is not registered.

```yaml
http:
  disableWebDAV: true
```

</div>

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

{{% alert context="info" %}}
**Authentication rate limiting**: Login and other auth routes are rate-limited by default. Configure `http.trustedHeaders` so per-IP limits apply to real client addresses — not the proxy.
{{% /alert %}}

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
http:
  port: 8080
  baseURL: "/files"
  externalUrl: "https://files.example.com/files"
  trustedHeaders:
    - X-Forwarded-For
    - X-Real-IP
  disableRateLimit: false

server:
  cacheDir: "tmp"
  sources:
    - path: "/srv"
```

## Related documentation

- {{< doclink path="getting-started/reverse-proxy/" text="Running behind a reverse proxy" />}} — proxy header configuration
- {{< doclink path="configuration/server/" text="Server settings" />}} — database, cache, indexing, and sources
- {{< doclink path="configuration/authentication/" text="Authentication" />}} — login methods and password policy
- {{< doclink path="features/webdav/" text="WebDAV" />}} — WebDAV usage when `disableWebDAV` is `false`
