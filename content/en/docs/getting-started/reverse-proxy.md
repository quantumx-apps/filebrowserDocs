---
title: "Running behind a reverse proxy"
description: "Complete guide for configuring FileBrowser Quantum behind reverse proxies"
icon: "other_houses"
---

Complete guide for running FileBrowser Quantum behind reverse proxies including nginx, Traefik, and Caddy with authentication, SSL, and performance optimizations.

{{% alert context="info" %}}
FileBrowser Quantum is designed to work seamlessly behind reverse proxies with proper configuration. This guide covers all major proxy types with complete examples.
{{% /alert %}}

## Overview

FileBrowser Quantum separates public and private endpoints to work efficiently with reverse proxies:

- **Public endpoints** (`/public/api`, `/public/share`) - No authentication required
- **Cookie-based authentication** - Requires proper Host header forwarding
- **Real-time features** - SSE support with proper proxy configuration

## Basic Requirements

### Essential Headers

All reverse proxy configurations must include these headers:

```yaml
# Required headers for FileBrowser Quantum
proxy_set_header Host $host;                                  # Cookie domain scoping
proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;  # IP chain
proxy_set_header X-Forwarded-Proto $scheme;                   # HTTP/HTTPS protocol
```

{{% alert context="info" %}}
**Note**: FileBrowser Quantum also supports `X-Forwarded-Host` as an alternative to the `Host` header for cookie domain scoping.
{{% /alert %}}

### FileBrowser Configuration

Configure FileBrowser to work with your reverse proxy:

```yaml
server:
  baseURL: "/files"                          # Base path for reverse proxy
  externalUrl: "https://files.example.com"   # External URL (used when generated public links)
```

## nginx Configuration

Minimal nginx configuration for FileBrowser Quantum:

```nginx
server {
    listen 80;
    server_name files.example.com;

    # Public endpoints (no authentication required)
    location /files/public/ {
        proxy_pass http://filebrowser:8080/files/public/;
        proxy_set_header Host $host;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
        proxy_buffering off;
    }

    # Private endpoints (authentication required)
    location /files/ {
        proxy_pass http://filebrowser:8080/files/;
        proxy_set_header Host $host;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
        proxy_buffering off;
        client_max_body_size 10G;
    }
}
```

### With Authentication Proxy

For environments using external authentication:

```nginx
server {
    listen 80;
    server_name files.example.com;

    # Authentication endpoint
    location = /auth/authorize {
        internal;
        proxy_pass http://auth.example.com:8080/authorize;
        proxy_pass_request_body off;
        proxy_set_header Content-Length "";
    }

    # Public endpoints (no auth)
    location /files/public/ {
        proxy_pass http://filebrowser:8080/files/public/;
        proxy_set_header Host $host;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
        proxy_buffering off;
    }

    # Private endpoints (with auth)
    location /files/ {
        auth_request /auth/authorize;
        auth_request_set $user $upstream_http_x_forwarded_user;

        proxy_pass http://filebrowser:8080/files/;
        proxy_set_header Host $host;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
        proxy_set_header X-Forwarded-User $user;
        proxy_buffering off;
        client_max_body_size 10G;
    }
}
```

{{% alert context="warning" %}}
When using external authentication, ensure your auth service sets the `X-Forwarded-User` header with the username. FileBrowser will use this for {{< doclink path="configuration/authentication/proxy/" text="proxy authentication" />}}.
{{% /alert %}}

## Traefik Configuration

Basic Traefik labels for FileBrowser Quantum:

```yaml
# Basic routing
- "traefik.enable=true"
- "traefik.http.routers.filebrowser.rule=Host(`files.example.com`)"
- "traefik.http.services.filebrowser.loadbalancer.server.port=80"

# Public endpoints (no auth)
- "traefik.http.routers.filebrowser-public.rule=Host(`files.example.com`) && PathPrefix(`/public`)"
- "traefik.http.services.filebrowser-public.loadbalancer.server.port=80"
```

## Caddy Configuration

Minimal Caddy configuration:

```caddy
files.example.com {
    # Public endpoints (no authentication)
    handle_path /public/* {
        reverse_proxy filebrowser:80 {
            header_up Host {host}
            header_up X-Forwarded-For {remote_host}
            header_up X-Forwarded-Proto {scheme}
        }
    }
    
    # Private endpoints (with authentication)
    handle /* {
        reverse_proxy filebrowser:80 {
            header_up Host {host}
            header_up X-Forwarded-For {remote_host}
            header_up X-Forwarded-Proto {scheme}
        }
    }
}
```


## Upload Configuration

Essential settings for file uploads:

<div class="config-section">
  <h4>Nginx</h4>
  <pre><code>client_max_body_size 10G;
proxy_buffering off;</code></pre>
</div>

<div class="config-section">
  <h4>Traefik</h4>
  <pre><code>- "traefik.http.middlewares.filebrowser-buffering.buffering.maxRequestBodyBytes=0"</code></pre>
</div>

<div class="config-section">
  <h4>Caddy</h4>
  <pre><code>reverse_proxy filebrowser:80 {
    header_up Connection {>Connection}
    header_up Transfer-Encoding {>Transfer-Encoding}
}</code></pre>
</div>

## Server-Sent Events (SSE) Configuration

FileBrowser Quantum uses SSE for real-time features. Essential settings:

```nginx
location /files/ {
    proxy_pass http://filebrowser:8080/files/;
    proxy_set_header Host $host;
    proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
    proxy_set_header X-Forwarded-Proto $scheme;
    proxy_buffering off;
}
```

- Traefik should handle most of this automatically if is configured properly.

### Authorization Header Handling

{{% alert context="info" %}}
If your reverse proxy sets authorization headers, you may need to clear them for FileBrowser to avoid conflicts with its own authentication system.
{{% /alert %}}

```nginx
location /files/ {
    proxy_set_header Authorization "";  # Clear authorization header
    proxy_pass http://filebrowser:8080/files/;
    proxy_set_header Host $host;
    proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
    proxy_set_header X-Forwarded-Proto $scheme;
}
```

## Troubleshooting

### Common Issues

<div class="troubleshooting-section">
  <h4>Authentication Failures</h4>
  <p><strong>Symptoms:</strong> Users can't log in, cookies not working.</p>
  <p><strong>Solution:</strong> Ensure <code>Host</code> header is properly forwarded:</p>

{{< tabs tabTotal="3" >}}
{{< tab tabName="NGINX" >}}
```nginx
proxy_set_header Host $host;
```
{{< /tab >}}

{{< tab tabName="Traefik" >}}
```yaml
- "traefik.http.services.filebrowser.loadbalancer.passhostheader=true"
```

{{< /tab >}}
{{< /tabs >}}
</div>

<div class="troubleshooting-section">
  <h4>Upload Failures</h4>
  <p><strong>Symptoms:</strong> Large file uploads fail</p>
  <p><strong>Solution:</strong> Increase file size limit and disable buffering:</p>

{{< tabs tabTotal="2" >}}
{{< tab tabName="NGINX" >}}
```nginx
client_max_body_size 10G;
proxy_buffering off;
```
{{< /tab >}}
{{< tab tabName="Traefik" >}}
```yaml
http:
  middlewares:
    limit:
      buffering:
        maxRequestBodyBytes: 0
        maxResponseBodyBytes: 0
        memRequestBodyBytes: 0
        memResponseBodyBytes: 0
```
{{< /tab >}}
{{< /tabs >}}
</div>

<div class="troubleshooting-section">
  <h4>SSE Not Working</h4>
  <p><strong>Symptoms:</strong> Real-time features not updating</p>
  <p><strong>Solution:</strong> Disable buffering and enable websockets:</p>
{{< tabs tabTotal="2" >}}
{{< tab tabName="NGINX" >}}
```nginx
proxy_buffering off;
```
{{< /tab >}}
{{< tab tabName="Traefik" >}}
```yaml
http:
  middlewares:
    limit:
      buffering:
        maxRequestBodyBytes: 0
        maxResponseBodyBytes: 0
        memRequestBodyBytes: 0
        memResponseBodyBytes: 0
```
{{< /tab >}}
{{< /tabs >}}
</div>

## Next Steps

- {{< doclink path="configuration/authentication/proxy/" text="Proxy Authentication" />}} - Configure header-based authentication
- {{< doclink path="integrations/office/troubleshooting/" text="Office Integration" />}} - OnlyOffice behind reverse proxy
- {{< doclink path="user-guides/office-integration/traefik-setup/" text="Traefik Setup" />}} - Filebrowser + OnlyOffice behind reverse proxy.

<style>
.config-section {
  margin: 1.5em 0;
  padding: 1em;
  border-left: 3px solid var(--primary, #0ea5e9);
  background: rgba(14, 165, 233, 0.06);
  border-radius: 4px;
}

.config-section h4 {
  margin-top: 0;
  margin-bottom: 0.5em;
  color: var(--primary);
  font-size: 1.1em;
}

.config-section pre {
  margin: 0.5em 0 0 0;
  padding: 0.75em;
  background: var(--code-block-bg);
  border-radius: 4px;
  overflow-x: auto;
}

.config-section pre code {
  background: none;
  padding: 0;
  font-size: 0.85em;
}

.troubleshooting-section {
  margin: 1em 0;
  padding: 1em;
  background: rgba(244, 67, 54, 0.05);
  border-left: 3px solid #f44336;
  border-radius: 4px;
}

.troubleshooting-section h4 {
  margin-top: 0;
  margin-bottom: 0.5em;
  color: #f44336;
  font-size: 1.1em;
}

.troubleshooting-section p {
  margin: 0.5em 0;
}

/* Dark mode support */
[data-dark-mode] .config-section {
  background: rgba(14, 165, 233, 0.12);
}

[data-dark-mode] .troubleshooting-section {
  background: rgba(244, 67, 54, 0.1);
}
</style>
