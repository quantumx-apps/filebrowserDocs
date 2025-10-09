---
title: "Guides"
description: "OnlyOffice integration how-to guides"
icon: "menu_book"
---

Step-by-step guides for setting up OnlyOffice integration with FileBrowser Quantum.

{{% alert context="info" %}}
**New!** Complete setup guides with community-contributed configurations are now available in the {{< doclink path="user-guides/office-integration/" text="User Guides section" />}}.
{{% /alert %}}

## Available Setup Guides

We've created comprehensive, community-tested guides for different deployment scenarios:

### 🚀 {{< doclink path="user-guides/office-integration/basic-docker-setup/" text="Basic Docker Setup" />}}

**Perfect for:** Local development, testing, and learning

Quick HTTP-based setup to get started with OnlyOffice integration in 15-20 minutes. Ideal for:
- First-time OnlyOffice users
- Local testing and development
- Internal network deployments

{{< doclink path="user-guides/office-integration/basic-docker-setup/" text="View Basic Setup Guide →" />}}

---

### ⭐ {{< doclink path="user-guides/office-integration/traefik-labels/" text="Production Setup with Traefik" />}}

**Perfect for:** Production deployments with automatic HTTPS

Complete production-ready setup with:
- Automatic Let's Encrypt SSL certificates
- Automatic certificate renewal
- Traefik reverse proxy configuration
- DDNS support

{{< doclink path="user-guides/office-integration/traefik-labels/" text="View Traefik Guide →" />}}

---

### 🔒 {{< doclink path="user-guides/office-integration/traefik-https/" text="Advanced HTTPS Configuration" />}}

**Perfect for:** Advanced users with custom security requirements

Advanced HTTPS configurations including:
- Self-signed certificates
- Custom CA certificates
- Full certificate verification
- Multiple security methods

{{< doclink path="user-guides/office-integration/traefik-https/" text="View Advanced Guide →" />}}

---

## Quick Start

Not sure which guide to follow? Here's a quick decision tree:

| Your Situation | Recommended Guide |
|----------------|-------------------|
| Just trying out OnlyOffice | {{< doclink path="user-guides/office-integration/basic-docker-setup/" text="Basic Docker Setup" />}} |
| Deploying to production | {{< doclink path="user-guides/office-integration/traefik-labels/" text="Traefik Production" />}} |
| Need custom certificates | {{< doclink path="user-guides/office-integration/traefik-https/" text="Advanced HTTPS" />}} |
| Internal network only | {{< doclink path="user-guides/office-integration/basic-docker-setup/" text="Basic Docker Setup" />}} |

## Additional Resources

- {{< doclink path="integrations/office/configuration/" text="Configuration Reference" />}} - Detailed configuration options
- {{< doclink path="integrations/office/troubleshooting/" text="Troubleshooting Guide" />}} - Common issues and solutions
- {{< doclink path="integrations/office/about/" text="About OnlyOffice" />}} - Features and capabilities

## Community Contributions

These guides are based on real-world configurations shared by the FileBrowser community. Special thanks to:
- @Kurami32 - Complete Traefik production setup
- @BaccanoMob - Advanced HTTPS methods and troubleshooting

Want to contribute? Share your configuration in [GitHub Discussions](https://github.com/gtsteffaniak/filebrowser/discussions)!
