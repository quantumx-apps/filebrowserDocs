---
title: "Radicale Integration Guides"
description: "Step-by-step guides for setting up Radicale integration"
icon: "menu_book"
order: 1
---

Practical, community-tested guides for deploying FileBrowser Quantum with Radicale (CarlDav/CardDav) server.

{{% alert context="info" %}}
These guides are based on real-world configurations contributed by the FileBrowser community. Choose the guide that matches your deployment scenario.
{{% /alert %}}

## Available Guides

### 1. Rootles Podman Setup (Recommended for beginners and advanced users)

**Best for:** Local development, testing, learning.

Simple HTTP-based setup, perfect for:
- Getting started with Radicale.
- Testing on your local machine.
- Development environments.
- Internal network deployments.

{{< doclink path="user-guides/radicale-integration/rootles-podman-setup/" text="Start Rootles Podman Setup →" />}}

**What you'll learn:**
- Generate podman secrets.
- Generate API-Tokens for serveral CalDav/CardDav clients.
- Configure a rootles podman pod.
- Set up FileBrowser and Radicale.
- Verify CalDAV/CardDAV functionality.

**Time:** 15-30 minutes

---

### 2. Behind Nginx Proxy Manager Reverse-proxy (Recommended for Production)

**Best for:** Production deployments, internet-facing servers.

Production-ready setup with automatic HTTPS:
- Let's Encrypt SSL certificates.
- Automatic certificate renewal.
- Secure JWT authentication.
- DDNS support (Dynu, Cloudflare, DuckDNS, etc).

{{< doclink path="user-guides/radicale-integration/npm-setup/" text="Start NPM Setup →" />}}

**What you'll learn:**
- All from the {{< doclink path="user-guides/radicale-integration/radicale-integration#1-rootles-podman-setup-recommended-for-beginners-and-advanced-users" text="Rootles Podman Setup" />}}.
- Configure and deploy Nginx Proxy Manager for your services and configure them with podman quadlets.
- Set up IPs and custom /locations for containers.
- How to configure and use NPM for your services.
- Secure production deployment.

**Time:** 45-60 minutes

---

### 3. Radicale configuration

**Best for:** Advanced users, custom security requirements

Configuration Settings:

```
[server]
hosts = 0.0.0.0:5232

[auth]
type = http_x_remote_user

[web]
type = none
```

> Note: This is only a partial excerpt. The full Radicale configuration can be viewed [here](https://raw.githubusercontent.com/cryinkfly/podman-rootless-quadlets/refs/heads/main/quadlets/filebrowser-quantum/radicale/config).

{{< doclink path="user-guides/radicale-integration/radicale-setup/" text="Start Radicale Setup →" />}}

**What you'll learn:**
- Configure Radicale for multi-user calendar and contact access.
- Understand authentication and server settings.
- Deploy Radicale securely in a rootless Podman environment.
- Integrate Radicale with FileBrowser Quantum and other CalDAV/CardDAV clients.

**Time:** 15-20 minutes

---

## Quick Decision Matrix

| Scenario | Recommended Guide |
|----------|-------------------|
| "I want to try Radicale quickly" | {{< doclink path="user-guides/radicale-integration/rootles-podman-setup/" text="Rootles Podman Setup" />}} |
| "I need production deployment with HTTPS" | {{< doclink path="user-guides/radicale-integration/npm-setup/" text="NPM Setup" />}} |
| "I'm deploying on internal network only" | {{< doclink path="user-guides/office-integration/basic-docker-setup/" text="Rootles Podman Setup" />}} |
...

## Prerequisites for All Guides

Before starting any guide, ensure you have:

- ✅ **Podman** installed (version 5.4.2+).
- ✅ **Rootless Podman setup** for running containers without root.
- ✅ **Systemd support** for managing rootless pods via quadlets.
- ✅ **Basic terminal/command line** knowledge.
- ✅ **Text editor** for configuration files.
- ✅ **At least 4GB RAM** available (2GB for OnlyOffice minimum).
- ✅ **10GB disk space** for Docker images.

**For production guides, additionally:**
- ✅ **Domain name** registered.
- ✅ **DDNS provider** account (Dynu, Cloudflare, DuckDNS, etc).
- ✅ **Email address** for Let's Encrypt.

## What is Radicale?

Radicale is a lightweight, open-source CalDAV/CardDAV server that provides:
- **Multi-user support** with multiple calendars and address books
- **Easy integration** with FileBrowser Quantum and other CalDAV/CardDAV clients

{{< doclink path="integrations/radicale/about/" text="Learn more about Radicale →" />}}

## Integration Architecture

Here's how FileBrowser Quantum integrates with Radicale:

```
┌──────────────────────────────────────────────────────────────┐
│                     Client / DAV-Client                      │
│           Browser · Thunderbird · iOS · DAVx⁵ · App          │
└──────────────────────────────────────────────────────────────┘
                               ▲
                               │ HTTPS Request / Response (Port 443)
                               │ cloud.example.org/caldav
                               │ cloud.example.org/carddav
                               ▼
┌──────────────────────────────────────────────────────────────┐
│              Nginx Proxy Manager (NPM)                       │
│──────────────────────────────────────────────────────────────└─────────┐
│ Podman Container                                                       │
│ Multi-Network:                                                         │
│   • Public Access via Host-Exposed Ports:                              │
│       • 80 / 443 / 81                                                  │
│   • filebrowser-quantum.net (internal) 10.89.2.x                       │
│   • other networks (internal)                                          │
│                                                                        │
│ Locations / Routing:                                                   │
│   /caldav/       → filebrowser-quantum-radicale:5232                   │
│   /carddav/      → filebrowser-quantum-radicale:5232                   │
│   /.well-known/* → filebrowser-quantum-radicale:5232                   │
└────────────────────────────────────────────────────────────────────────┘
                               ▲
                               │ Internal HTTP / DAV
                               │ Request / Response
                               │ X-Script-Name / X-Remote-User / API-Token
                               ▼
┌───────────────────────────────────────────────────────────────────────────────────────────┐
│               Podman Network: filebrowser-quantum.net                                     │
│───────────────────────────────────────────────────────────────────────────────────────────│
│ NPM 10.89.2.2 ◀── HTTP/DAV ──▶ filebrowser-quantum-infra (Pod-Master container) 10.89.2.3 │
│                                  └─ Internal communication happens via the Pod:           │
│                                    └─ **PodName=filebrowser-quantum**                     │
└───────────────────────────────────────────────────────────────────────────────────────────┘
                               ▲
                               │ internal
                               ▼
┌──────────────────────────────────────────────────────────────┐
│               Podman Pod: filebrowser-quantum                │
│──────────────────────────────────────────────────────────────│
│ Shared Network Namespace                                     │
│                                                              │
│ ┌───────────────────────────────────────────────────────┐    │
│ │ filebrowser-quantum-server Container ◀── ▲/▼ ──▶      │    │
│ │ IP (internal): 10.89.2.3                              │    │
│ │ • Calendar & Contacts Integration                     │    │
│ │ • User & API Tokens for Radicale                      │    │
│ │ • Internal Port: 80 (Filebrowser Quantum)             │    │
│ │ ↕ Internal API Calls / Tokens / Headers ▼/▲           │    │
│ └───────────────────────────────────────────────────────┘    │
│                 ▲                                            │
│                 │ internal                       │
│                 ▼                                            │
│ ┌────────────────────────────────────────────────────────────┐    
│ │ filebrowser-quantum-radicale Container ◀── ▲/▼ ──▶    │    │
│ │ IP (internal): 10.89.2.3                              │    │
│ │ • CalDAV / CardDAV Backend                            │    │
│ │ • Web Interface: none (type = none)                   │    │
│ │ • Path Mapping via X-Script-Name (/caldav, /carddav)  │    │
│ │ • User Authentication via X-Remote-User / API Tokens  │    │
│ │ • Accessible only through FileBrowser Quantum         │    │
│ │ ↕ DAV Request / Response / Token Validation ▼/▲       │    │
│ └───────────────────────────────────────────────────────┘    │
└──────────────────────────────────────────────────────────────┘
```


















---

### Create an API Token for Calendar and Contacts Apps

1. Open FileBrowser Quantum in your browser.
2. Go to Settings → API Tokens.
3. Click the “Create New Token” button.
4. Enter a name or description for the token (e.g., “Mobile Calendar App”).
5. The system will generate a username and token:
    - Username: test
    - Password: the token string
6. Use the copy-to-clipboard button to copy the token for easy setup on your mobile device or CalDAV/CardDAV client.
7. Paste the token in your app when asked for username/password.

Important Notes:

- You can create multiple tokens for different devices or users.
- Each token can have a different lifetime – set an expiration date as needed.
- Treat the token like a password – it grants full access to your calendars and contacts.

<img width="3806" height="1949" alt="create-user-api-token-radicale" src="https://github.com/user-attachments/assets/e5cf5274-9d47-4338-aa3c-d1d958724868" />

© 2026 by [Steve Zabka](https://github.com/cryinkfly). All rights reserved.

---

### Example for connecting GNOME Calendar & Contacts to Radicale

<img width="960" height="921" alt="gnome-online-accounts-add" src="https://github.com/user-attachments/assets/d60b54a0-f713-41ac-a756-6f39467159db" />
<img width="1184" height="1729" alt="gnome-online-add-carldav" src="https://github.com/user-attachments/assets/c4afe06f-3aad-455d-ad3f-a3a4dee69616" />
<img width="1473" height="1636" alt="gnome-online-settings-carddav" src="https://github.com/user-attachments/assets/54de2dbe-3518-4425-b1a2-3273baeed18c" />
<img width="1473" height="1636" alt="gnome-online-add-carddav" src="https://github.com/user-attachments/assets/f7aa3884-385a-4212-bd4f-03044a9987fe" />
<img width="1473" height="1636" alt="gnome-online-settings-carldav" src="https://github.com/user-attachments/assets/4cc070ab-70ba-4e93-8895-52d065caae5e" />
<img width="1760" height="957" alt="calender-login" src="https://github.com/user-attachments/assets/d09f79c0-9103-43dd-bfb4-c12d7748e8e7" />
<img width="3806" height="1949" alt="gnome-calendar-with-radicale-sync" src="https://github.com/user-attachments/assets/517fa799-e22c-40ae-a503-1526e1bce56d" />

#### List all users (usernames/nicknames) who have any collection (CarlDav & CardDav)

```
ls -1 ./radicale-data/collections/collection-root | grep -v '^admin$'
```

Example output:

```
steve
test
```

#### Backup a user collection (CarlDav & CardDav)

```
cp -a ./radicale-data/collections/collection-root/test ~/radicale-backups/
```

Delete a user collection (CarlDav & CardDav)

And if, for example, test is deleted from the Quantum file browser, the data in Radicale remains unchanged. This is a security feature.
However, if Lisa is deleted from the Quantum file browser and you are certain that test's data can and should also be deleted from Radicale, then you can do so with the following command:

```
rm -rf ./radicale-data/collections/collection-root/test
```

## Further Resources

For more information on setting up a rootless Podman environment, see the [User Guide by cryinkfly](https://github.com/cryinkfly/podman-rootless-quadlets/tree/main/quadlets/filebrowser-quantum)

