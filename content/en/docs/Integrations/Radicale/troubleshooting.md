---
title: "Troubleshooting"
description: "Common Radicale integration issues and solutions"
icon: "troubleshoot"
---

## Troubleshooting with Nginx Proxy Manager as Proxy

When using Nginx Proxy Manager (NPM) to proxy a domain such as:

| Domain            | Target Container    | SSL           | Access | Port | Status |    |
|-------------------|---------------------|---------------|--------|------|--------|--- |
| cloud.yourdomain.com | filebrowser-quantum-server | Let's Encrypt | Puplic |  80  | Online | ⚙️ |

⚙️ → Indicates that the settings for this proxy (custom locations, etc.) are configured via the Nginx Proxy Manager GUI.

Even though these custom locations work in the GUI, you may encounter issues after restarting NPM. Although NPM itself starts correctly, the proxy to FileBrowser Quantum may fail, often returning 502 or 504 errors.

### Cause

- FileBrowser Quantum runs in a Docker container, Docker Compose service or a Podman container / Podman pod.
- NPM relies on the internal Docker/Podman network hostname (filebrowser-quantum-server) for its custom locations.
- If NPM starts before the FileBrowser container is fully running, it cannot resolve the hostname, causing the proxy to fail.
- This typically happens on system boot or when NPM is restarted independently of the containers.

### Solution

- Ensure that your FileBrowser container is started automatically by Docker or Podman (e.g., via restart: always in Compose).
- NPM does not need to wait for FileBrowser with After= or other systemd dependencies.
- As long as the FileBrowser container is running in the same Docker or Podman network as NPM, its internal hostname (filebrowser-quantum-server) is resolvable, and your Custom Locations in the NPM GUI will work.

### Key takeaway:

- Let Docker or Podman handle container startup: always (or docker-compose up -d).
- Avoid trying to create service dependencies between NPM and FileBrowser — this can cause startup conflicts.
- Once the container is running, NPM can immediately use the internal hostnames for proxying, and the CalDAV/CardDAV locations will work correctly.

## Getting Help

### Gather Information

When asking for help, provide:

1. **Logs:** Most imprtantly relevant debug logs from the server, as well as Radicale server logs.
1. **Debug mode output** (screenshot from browser)
2. **Browser console errors** (F12 → Console tab)

### Community Resources

- [GitHub Issues](https://github.com/gtsteffaniak/filebrowser/issues) - Report bugs
- [GitHub Discussions](https://github.com/gtsteffaniak/filebrowser/discussions) - Ask questions
- [Radicale Documentation](https://radicale.org/v3.html) - Official Radicale docs
- [Community Configurations](https://github.com/cryinkfly/podman-rootless-quadlets/tree/main/quadlets/filebrowser-quantum) - Working example

## Next Steps

- {{< doclink path="integrations/radicale/configuration/" text="Configuration" />}} - Set up OnlyOffice integration
- {{< doclink path="user-guides/radicale-integration/radicale-integration/" text="Office guides" />}} - Usage examples and best practices
- {{< doclink path="integrations/radicale/about/" text="About Radicale" />}} - Features and capabilities
