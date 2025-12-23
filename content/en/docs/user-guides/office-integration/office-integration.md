---
title: "Office Integration Guides"
description: "Step-by-step guides for setting up OnlyOffice integration"
icon: "menu_book"
order: 1
---

Practical, community-tested guides for deploying FileBrowser Quantum with OnlyOffice document server.

{{% alert context="info" %}}
These guides are based on real-world configurations contributed by the FileBrowser community. Choose the guide that matches your deployment scenario.
{{% /alert %}}

## Available Guides

### 1. Basic Docker Setup (Recommended for Beginners)

**Best for:** Local development, testing, learning.

Simple HTTP-based setup, perfect for:
- Getting started with OnlyOffice.
- Testing on your local machine.
- Development environments.
- Internal network deployments.

{{< doclink path="user-guides/office-integration/basic-docker-setup/" text="Start Basic Setup →" />}}

**What you'll learn:**
- Generate JWT secrets.
- Configure Docker Compose.
- Set up FileBrowser and OnlyOffice.
- Test document editing.

**Time:** 15-20 minutes

---

### 2. Behind Traefik Reverse-proxy (Recommended for Production)

**Best for:** Production deployments, internet-facing servers.

Production-ready setup with automatic HTTPS:
- Let's Encrypt SSL certificates.
- Automatic certificate renewal.
- Secure JWT authentication.
- DDNS support (Dynu, Cloudflare, DuckDNS, etc).

{{< doclink path="user-guides/office-integration/traefik-setup/" text="Start Traefik Setup →" />}}

**What you'll learn:**
- All from the {{< doclink path="user-guides/office-integration/office-integration#1-basic-docker-setup-recommended-for-beginners" text="Basic Docker Setup" />}}.
- Configure and deploy Traefik for your services and configure them with docker compose.
- Set up static IPs for containers.
- How to configure and use traefik for your services.
- Secure production deployment.

**Time:** 45-60 minutes

---

### 3. Internal HTTPS Office configuration 

**Best for:** Advanced users, custom security requirements

Advanced HTTPS configurations for special needs:
- Onlyoffice with Internal HTTPS communication.
- Self-signed and custom CA certificates.
- Optional Full office certificate velidation.

{{< doclink path="user-guides/office-integration/office-internal-https/" text="Start internal office HTTPS Setup →" />}}

**What you'll learn:**
- All from {{< doclink path="user-guides/office-integration/office-integration/#2-behind-traefik-reverse-proxy-recommended-for-production" text="Traefik Setup Guide" />}}
- Generate self-signed certificates.
- Set up static IPs for containers.

**Time:** 60-90 minutes

---

## Quick Decision Matrix

| Scenario | Recommended Guide |
|----------|-------------------|
| "I want to try OnlyOffice quickly" | {{< doclink path="user-guides/office-integration/basic-docker-setup/" text="Basic Docker Setup" />}} |
| "I need production deployment with HTTPS" | {{< doclink path="user-guides/office-integration/traefik-setup/" text="Traefik Setup" />}} |
| "I'm deploying on internal network only" | {{< doclink path="user-guides/office-integration/basic-docker-setup/" text="Basic Docker Setup" />}} |
| "I need custom CA certificates" | {{< doclink path="user-guides/office-integration/office-internal-https/" text="Internal office HTTPS" />}} |
| "I want automatic SSL renewal" | {{< doclink path="user-guides/office-integration/traefik-setup/" text="Traefik Setup" />}} |
| "I need internal HTTPS communication" | {{< doclink path="user-guides/office-integration/office-internal-https/" text="Internal Office HTTPS" />}} |

## Prerequisites for All Guides

Before starting any guide, ensure you have:

- ✅ **Docker** installed (version 20.10+).
- ✅ **Docker Compose** installed (version 2.0+).
- ✅ **Basic terminal/command line** knowledge.
- ✅ **Text editor** for configuration files.
- ✅ **At least 4GB RAM** available (2GB for OnlyOffice minimum).
- ✅ **10GB disk space** for Docker images.

**For production guides, additionally:**
- ✅ **Domain name** registered.
- ✅ **DDNS provider** account (Dynu, Cloudflare, DuckDNS, etc).
- ✅ **Email address** for Let's Encrypt.

## What is OnlyOffice?

OnlyOffice is a powerful open-source office suite that provides:
- **Document editing**: Word, Excel, PowerPoint-like functionality
- **Collaborative editing**: Multiple users editing simultaneously
- **Format support**: .docx, .xlsx, .pptx, .odt, .pdf, and more
- **Web-based**: No software installation for end users
- **Self-hosted**: Full control over your data

{{< doclink path="integrations/office/about/" text="Learn more about OnlyOffice →" />}}

## Integration Architecture

Here's how FileBrowser Quantum integrates with OnlyOffice:

```
┌─────────────────┐
│   Browser       │
│  (You)          │
└────────┬────────┘
         │ HTTPS
         ↓
┌─────────────────┐
│   Traefik       │ ← Manages SSL/TLS
│  (Reverse Proxy)│ ← Routes traffic
└────────┬────────┘
         │
    ┌────┴─────┐
    ↓          ↓
┌─────────┐ ┌──────────────┐
│FileBrowser│ │  OnlyOffice  │
│ Quantum │←→│Document Server│
└─────────┘ └──────────────┘
    │              │
    ↓              ↓
┌─────────┐    ┌──────┐
│  Files  │    │Cache │
└─────────┘    └──────┘
```

**Flow:**
1. User clicks document in FileBrowser
2. FileBrowser requests OnlyOffice config
3. OnlyOffice downloads document from FileBrowser
4. User edits in OnlyOffice editor
5. OnlyOffice saves changes back to FileBrowser

{{< doclink path="integrations/office/troubleshooting/#network-flow-diagram" text="See detailed troubleshooting diagram →" />}}

## After Setup

Once you've completed a guide:

### Enable Features

**User Settings:**
- Configure which file types open in OnlyOffice
- Enable/disable debug mode
- Set view-only defaults

**Admin Settings:**
- Configure server-level OnlyOffice options
- Set default permissions
- Customize UI behavior

### Test Integration

1. **Upload test documents** - Try .docx, .xlsx, .pptx
2. **Edit documents** - Make changes and verify saves
3. **Test collaborative editing** - Multiple users editing simultaneously
4. **Check preview support** - Verify document previews work
5. **Enable debug mode** - Troubleshoot if needed

### Monitor Health

```bash
# Check OnlyOffice health
curl https://office.yourdomain.com/healthcheck

# View logs
docker logs -f onlyoffice
docker logs -f filebrowser

# Check resource usage
docker stats
```

## Community Contributions

These guides are based on configurations shared by FileBrowser community members:

- [@Kurami32](https://github.com/gtsteffaniak/filebrowser/discussions/1237#discussioncomment-14447935) - Complete Traefik setup guide.
- [@BaccanoMob](https://github.com/gtsteffaniak/filebrowser/discussions/1237#discussion-8913996) - Office internal HTTPS methods. 

Want to contribute your configuration? Share it in [GitHub Discussions](https://github.com/gtsteffaniak/filebrowser/discussions)!

## Additional Resources

### Documentation

- {{< doclink path="integrations/office/configuration/" text="Configuration Reference" />}} - All configuration options.
- {{< doclink path="integrations/office/troubleshooting/" text="Troubleshooting Guide" />}} - Common issues and solutions.
- {{< doclink path="integrations/office/about/" text="OnlyOffice Features" />}} - What OnlyOffice can do.

### External Resources

- [OnlyOffice Docker Hub](https://hub.docker.com/r/onlyoffice/documentserver)
- [OnlyOffice Documentation](https://helpcenter.onlyoffice.com/)
- [Traefik Documentation](https://doc.traefik.io/traefik/)
- [Docker Compose Documentation](https://docs.docker.com/compose/)

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

{{< doclink path="integrations/office/troubleshooting/" text="Go to Troubleshooting →" />}}

## Ready to Start?

Choose your guide and begin setting up OnlyOffice integration:

<div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(280px, 1fr)); gap: 1.5rem; margin: 2rem 0;">

<div style="border: 1px solid var(--gray-400); border-radius: 8px; padding: 1.5rem;">
<h3 style="margin-top: 0;">🚀 Basic Setup</h3>
<p>Quick HTTP setup for local testing</p>
<a href="/docs/user-guides/office-integration/basic-docker-setup/" style="display: inline-block; margin-top: 1rem; padding: 0.5rem 1rem; background: var(--primary); color: white; border-radius: 4px; text-decoration: none;">Start Guide →</a>
</div>

<div style="border: 1px solid var(--gray-400); border-radius: 8px; padding: 1.5rem;">
<h3 style="margin-top: 0;">⭐ Production Setup</h3>
<p>Behind Traefik Reverse-proxy</p>
<a href="/docs/user-guides/office-integration/traefik-setup/" style="display: inline-block; margin-top: 1rem; padding: 0.5rem 1rem; background: var(--primary); color: white; border-radius: 4px; text-decoration: none;">Start Guide →</a>
</div>

<div style="border: 1px solid var(--gray-400); border-radius: 8px; padding: 1.5rem;">
<h3 style="margin-top: 0;">🔒 Internal office HTTPS</h3>
<p>Custom certificates</p>
<a href="/docs/user-guides/office-integration/office-internal-https/" style="display: inline-block; margin-top: 1rem; padding: 0.5rem 1rem; background: var(--primary); color: white; border-radius: 4px; text-decoration: none;">Start Guide →</a>
</div>

</div>
