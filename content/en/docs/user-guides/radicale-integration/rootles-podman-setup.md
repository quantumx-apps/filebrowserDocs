---
title: "Rootles Podman Setup"
description: "Simple Radicale setup with Podman for local development"
icon: "deployed_Code"
---

# Still under Construction!

This guide is not finished yet and is still under active development.

For the current state and related resources, please see:  
https://github.com/cryinkfly/podman-rootless-quadlets/tree/main/quadlets/filebrowser-quantum

The integration of **[Radicale](https://radicale.org/v3.html)** into **[FileBrowser Quantum](https://filebrowserquantum.com/en/)** was created by **[@cryinkfly](https://github.com/cryinkfly)**.

---

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

`filebrowser-quantum.network`:

```
[Unit]
Description=Podman network for FileBrowser Quantum

# Network dependency is handled via podman-user-wait-network-online.service
# Wants/After network-online.target have no effect for rootless containers
# See: https://github.com/cryinkfly/podman-rootless-quadlets/issues/1

[Network]
NetworkName=filebrowser-quantum.net
```

---

`filebrowser-quantum.pod`:

```
[Unit]
Description=FileBrowser Quantum Pod (internal, no ports)
After=filebrowser-quantum-network.service
BindsTo=filebrowser-quantum-network.service
Requires=filebrowser-quantum-network.service

[Pod]
PodName=filebrowser-quantum
Network=filebrowser-quantum.network
ServiceName=filebrowser-quantum

[Service]
Restart=always
RestartSec=30

[Install]
WantedBy=default.target
```

---

`filebrowser-quantum-server.container`:

```
[Unit]
Description=FileBrowser Quantum (Rootless Podman)

[Container]
# Container settings
ContainerName=filebrowser-quantum-server
Image=docker.io/gtstef/filebrowser:latest

# Automatical Updates
# To enable automatic updates for all containers, start the systemd timer:
# systemctl --user start --now podman-auto-update.timer
AutoUpdate=registry

# Pod
# [Container] Pod= automatically sets up the dependency for this container.
# You don’t need After= or Requires= entries for this container regarding the Pod.
# The Pod provides a shared network, localhost, and all other resources to its containers.
# Once the Pod is running, this container starts automatically.
# All containers are fully orchestrated and can communicate internally.
Pod=filebrowser-quantum.pod

# Network via Pod
#Network=filebrowser-quantum.net

# Internal container port 80 is used by FileBrowser Quantum
# Container name (filebrowser-quantum-server) is selected in Nginx Proxy Manager as Forward Hostname
# Forward Port in Nginx Proxy Manager should be 80
# No need to publish host ports when using Nginx Proxy Manager
# PublishPort=80   # NOT required!

# Timezone
# This option tells Podman to set the time zone based on the local system's time zone where Podman is running.
Timezone=local

# This container is executed with a non-root user context (UID:GID 1000:1000) to match the container's expected runtime permissions.
#User=1000:1000 # Is activated by default with FileBrowser Quantum image

# Volumes
# Persistent data (config, database, user files)
Volume=filebrowser-quantum_data:/home/filebrowser/data:Z
Volume=filebrowser-quantum_files:/srv:Z

# Environments
Environment=FILEBROWSER_CONFIG="data/config.yaml"
# Run this command before you start this container:
# echo -n 'password123' | podman secret create filebrowser_admin_pwd -
Secret=filebrowser_admin_pwd,type=env,target=FILEBROWSER_ADMIN_PASSWORD

[Service]
# Restart automatically on crash
Restart=always
RestartSec=10

[Install]
# Enable at boot
WantedBy=default.target
```

---

`filebrowser-quantum-radicale.container`:

```
[Unit]
Description=Radicale (Rootless Podman)

[Container]
ContainerName=filebrowser-quantum-radicale
# Official Radicale image from Kozea (GHCR)
Image=ghcr.io/kozea/radicale:latest

# Automatical Updates
# To enable automatic updates for all containers, start the systemd timer:
# systemctl --user start --now podman-auto-update.timer
AutoUpdate=registry

# Pod
# [Container] Pod= automatically sets up the dependency for this container.
# You don’t need After= or Requires= entries for this container regarding the Pod.
# The Pod provides a shared network, localhost, and all other resources to its containers.                                                                                             
# Once the Pod is running, this container starts automatically.
# All containers are fully orchestrated and can communicate internally.
Pod=filebrowser-quantum.pod

# Network via Pod
#Network=filebrowser-quantum.net

# Timezone
# This option tells Podman to set the time zone based on the local system's time zone where Podman is running.
Timezone=local

# Volumes
Volume=radicale_data:/var/lib/radicale
# The :ro suffix makes the radicale_config volume read-only inside the container!
# The config file cannot be changed from within the container; the file must be edited on the host system.
# Example: podman unshare nano ~/.local/share/containers/storage/volumes/radicale_config/_data/config
# You need this config settings: https://raw.githubusercontent.com/cryinkfly/podman-rootless-quadlets/refs/heads/main/quadlets/filebrowser-quantum/radicale/config
# Documentation: https://radicale.org/v3.html#configuration
Volume=radicale_config:/etc/radicale:ro

[Service]
# Limit tasks and memory for Rootless container
TasksMax=50
MemoryHigh=256M

# Restart policy
Restart=always
RestartSec=20
```
