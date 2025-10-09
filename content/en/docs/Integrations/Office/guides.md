---
title: "Guides"
description: "OnlyOffice integration how-to guides"
icon: "menu_book"
---

Step-by-step guides for setting up OnlyOffice integration with FileBrowser Quantum.

{{% alert context="info" %}}
**New!** Complete setup guides with community-contributed configurations are now available in the [User Guides section](/docs/user-guides/office-integration/).
{{% /alert %}}

## Available Setup Guides

We've created comprehensive, community-tested guides for different deployment scenarios:

### 🚀 [Basic Docker Setup](/docs/user-guides/office-integration/basic-docker-setup/)

**Perfect for:** Local development, testing, and learning

Quick HTTP-based setup to get started with OnlyOffice integration in 15-20 minutes. Ideal for:
- First-time OnlyOffice users
- Local testing and development
- Internal network deployments

[View Basic Setup Guide →](/docs/user-guides/office-integration/basic-docker-setup/)

---

### ⭐ [Production Setup with Traefik](/docs/user-guides/office-integration/traefik-labels/)

**Perfect for:** Production deployments with automatic HTTPS

Complete production-ready setup with:
- Automatic Let's Encrypt SSL certificates
- Automatic certificate renewal
- Traefik reverse proxy configuration
- DDNS support

[View Traefik Guide →](/docs/user-guides/office-integration/traefik-labels/)

---

### 🔒 [Advanced HTTPS Configuration](/docs/user-guides/office-integration/traefik-https/)

**Perfect for:** Advanced users with custom security requirements

Advanced HTTPS configurations including:
- Self-signed certificates
- Custom CA certificates
- Full certificate verification
- Multiple security methods

[View Advanced Guide →](/docs/user-guides/office-integration/traefik-https/)

---

## Quick Start

Not sure which guide to follow? Here's a quick decision tree:

| Your Situation | Recommended Guide |
|----------------|-------------------|
| Just trying out OnlyOffice | [Basic Docker Setup](/docs/user-guides/office-integration/basic-docker-setup/) |
| Deploying to production | [Traefik Production](/docs/user-guides/office-integration/traefik-labels/) |
| Need custom certificates | [Advanced HTTPS](/docs/user-guides/office-integration/traefik-https/) |
| Internal network only | [Basic Docker Setup](/docs/user-guides/office-integration/basic-docker-setup/) |

## Additional Resources

- [Configuration Reference](/docs/integrations/office/configuration/) - Detailed configuration options
- [Troubleshooting Guide](/docs/integrations/office/troubleshooting/) - Common issues and solutions
- [About OnlyOffice](/docs/integrations/office/about/) - Features and capabilities

## Community Contributions

These guides are based on real-world configurations shared by the FileBrowser community. Special thanks to:
- @Kurami32 - Complete Traefik production setup
- @BaccanoMob - Advanced HTTPS methods and troubleshooting

Want to contribute? Share your configuration in [GitHub Discussions](https://github.com/gtsteffaniak/filebrowser/discussions)!
