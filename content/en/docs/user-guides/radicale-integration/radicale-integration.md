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

**Flow:**
1. User accesses calendar/contact in a client or FileBrowser Quantum.
2. FileBrowser requests Radicale configuration.
3. Client syncs calendars and contacts from Radicale.
4. User creates/edits events or contacts.
5. Changes are saved back to the Radicale server and synced across devices.

{{< doclink path="integrations/radicale/troubleshooting/#network-flow-diagram" text="See detailed troubleshooting diagram →" />}}

## After Setup

Once Radicale is installed and configured:

### Enable Features

**User Settings:**

- Configure which calendars or contact groups are visible
- Enable read-only or full access per calendar/contact
- Set default notifications for events

**Admin Settings:**

- Manage server-wide access and authentication options
- Configure default permissions for users and groups
- Customize logging and sync behavior

### Test Integration

- **Create test events and contacts** – Add new entries to verify creation works.
- **Edit existing entries** – Make changes and check they sync across clients.
- **Test multi-user access** – Ensure multiple users can access and modify shared calendars/contacts.
- **Check sync support** – Verify changes propagate to all connected devices/clients.
- **Enable debug mode** – Troubleshoot authentication, sync, or network issues.

### Monitor Health

```
# Run curl inside the Radicale container/pod
podman exec -it radicale curl -i http://localhost:5232/

# View logs
podman logs filebrowser-quantum-server
podman logs filebrowser-quantum-radicale

# Check resource usage for all running pods/containers
podman stats
```

## Community Contributions

These guides are based on configurations shared by FileBrowser community members:

- [@cryinkfly](https://github.com/gtsteffaniak/filebrowser/discussions/1752) - Complete setup guide.

Want to contribute your configuration? Share it in [GitHub Discussions](https://github.com/gtsteffaniak/filebrowser/discussions)!

## Additional Resources

### Documentation

- {{< doclink path="integrations/radicale/configuration/" text="Configuration Reference" />}} - All configuration options.
- {{< doclink path="integrations/radicale/troubleshooting/" text="Troubleshooting Guide" />}} - Common issues and solutions.
- {{< doclink path="integrations/radicale/about/" text="Radicale Features" />}} - What Radicale can do.

### External Resources

- [Radicale GitHub](https://github.com/Kozea/Radicale)
- [Radicale Documentation](https://radicale.org/master.html)
- [NPM Documentation](https://nginxproxymanager.com/guide/)
- [Rootles Podman Documentation](https://github.com/cryinkfly/podman-rootless-quadlets)

### Community

- [GitHub Issues](https://github.com/gtsteffaniak/filebrowser/issues) - Report bugs.
- [GitHub Discussions](https://github.com/gtsteffaniak/filebrowser/discussions) - Ask questions.
- [Wiki](https://github.com/gtsteffaniak/filebrowser/wiki) - Community documentation.

## Getting Help

If you encounter issues:

1. **Enable debug mode** in FileBrowser profile settings.
2. **Check troubleshooting guide** for common solutions.
3. **Review logs** from both FileBrowser and OnlyOffice.
4. **Search existing issues** on GitHub.
5. **Ask in discussions** with your configuration details.

{{< doclink path="integrations/radicale/troubleshooting/" text="Go to Troubleshooting →" />}}

## Ready to Start?

Choose your guide and begin setting up Radicale integration:

<div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(280px, 1fr)); gap: 1.5rem; margin: 2rem 0;">

<div style="border: 1px solid var(--gray-400); border-radius: 8px; padding: 1.5rem;">
<h3 style="margin-top: 0;">🚀 Rootles Podman Setup</h3>
<p>Quick Radicale setup for local testing</p>
{{< doclink path="user-guides/radicale-integration/rootles-podman-setup/" text="Start Guide →" />}}
</div>

<div style="border: 1px solid var(--gray-400); border-radius: 8px; padding: 1.5rem;">
<h3 style="margin-top: 0;">⭐ Production Setup</h3>
<p>Behind Nginx Proxy Manager Reverse-proxy</p>
{{< doclink path="user-guides/radicaleintegration/npm-setup" text="Start Guide →" />}}
</div>

<div style="border: 1px solid var(--gray-400); border-radius: 8px; padding: 1.5rem;">
<h3 style="margin-top: 0;">📅 Radicale configuration</h3>
<p>Configure Radicale for calendars and contacts</p>
{{< doclink path="user-guides/radicale-integration/radicale-setup/" text="Start Guide →" />}}
</div>

</div>
