---
title: "Nginx Proxy Manager Setup"
description: "Complete production setup with Nginx Proxy Manager using Podman and Let's Encrypt"
icon: "dns"
order: 3
date: "2026-01-23"
lastmod: "2026-01-23"
---

## Proxy Configuration for Example with Nginx Proxy Manager

{{% alert context="danger" %}}
Never expose FileBrowser Quantum directly over plain HTTP to the internet. Always use HTTPS.
Radicale should only communicate internally within the Docker or Podman network and must not be exposed directly to the internet.
All external access to Radicale should go through the reverse proxy or FileBrowser Cloud endpoint with a valid TLS/SSL certificate.
{{% /alert %}}

> In my setup, the `Radicale container runs inside the same network of Filebrowser-Quantum` (filebrowser-quantum.pod).
> Since all containers inside a Docker or Podman pod share the same network namespace, Radicale is not reachable by its own container name (radicale) from outside the pod.
> Instead, it must be accessed via the pod name.

| Domain            | Target Container    | SSL           | Access | Port | Status |    |
|-------------------|---------------------|---------------|--------|------|--------|--- |
| cloud.example.org | filebrowser-quantum | Let's Encrypt | Puplic |  80  | Online | ⚙️ |

>⚙️ Indicates that the proxy settings, including custom locations, etc. are configured under the “Locations” tab in the NPM GUI.

| Location          | Schema | Forward Hostname / IP    | Forward Port  |    |
|-------------------|--------|--------------------------|---------------|--- |
| /caldav/          | http   | filebrowser-quantum      | 5232          | ⚙️ |

<br/>

```
# WebDAV Standard Headers
proxy_set_header Host $host;
proxy_set_header X-Real-IP $remote_addr;
proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
proxy_set_header X-Forwarded-Proto $scheme;

# Radicale Headers
proxy_set_header X-Remote-User $remote_user;
proxy_set_header X-Script-Name /caldav;
```

<br/>

| Location          | Schema | Forward Hostname / IP    | Forward Port  |    |
|-------------------|--------|--------------------------|---------------|--- |
| /carddav/         | http   | filebrowser-quantum      | 5232          | ⚙️ |

```
# WebDAV Standard Headers
proxy_set_header Host $host;
proxy_set_header X-Real-IP $remote_addr;
proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
proxy_set_header X-Forwarded-Proto $scheme;

# Radicale Headers
proxy_set_header X-Remote-User $remote_user;
proxy_set_header X-Script-Name /carddav;
```

<br/>

| Location          | Schema | Forward Hostname / IP    | Forward Port  |    |
|-------------------|--------|--------------------------|---------------|--- |
| /.well-known/caldav         | http   | filebrowser-quantum      | 5232          | ⚙️ |

```
# WebDAV Standard Headers
proxy_set_header Host $host;

# Radicale Headers
proxy_set_header X-Remote-User $remote_user;
proxy_set_header X-Script-Name /caldav;
```

<br/>

| Location          | Schema | Forward Hostname / IP    | Forward Port  |    |
|-------------------|--------|--------------------------|---------------|--- |
| /.well-known/carddav         | http   | filebrowser-quantum      | 5232          | ⚙️ |

```
# WebDAV Standard Headers
proxy_set_header Host $host;

# Radicale Headers
proxy_set_header X-Remote-User $remote_user;
proxy_set_header X-Script-Name /carddav;
```

<br/>

If the `Radicale container runs outside of the filebrowser-quantum pod`, for example container `radicale`:

- Radicale must be attached to the same network as Nginx Proxy Manager and Filebrowser Quantum!
- In this case, Radicale can be resolved via its container name
- The `Forward Hostname / IP` must set to `radicale`

<br/>

And if Radicale and all other containers works, then you can open your web browser and check if Radicale works:

```
https://cloud.example.org/caldav/.web
```

...and you will receive a response:

```
Radicale works!
```

### External and Internal URLs

FileBrowser Quantum (Web UI):

```
https://cloud.yourdomain.com
```

Radicale CalDAV (Calendars):
```
https://cloud.yourdomain.com/caldav
```

Radicale CardDAV (Contacts/Address Books):
```
https://cloud.yourdomain.com/darddav
```

**Why separate URLs?**

- FileBrowser Quantum → Accessed via /
- Radicale CalDAV → Accessed via /caldav
- Radicale CardDAV → Accessed via /carddav

This separation allows clients (e.g., Thunderbird, Apple Calendar, DAVx⁵) to connect directly to the correct service endpoint without conflicts.
