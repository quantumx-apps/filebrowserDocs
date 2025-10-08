---
title: "Linux"
description: "Install FileBrowser on Linux"
icon: "terminal"
weight: 4
---

Run FileBrowser Quantum natively on Linux.

## Download

1. Go to [releases page](https://github.com/gtsteffaniak/filebrowser/releases)
2. Download the appropriate binary:
   - `filebrowser-linux-amd64` (x86_64)
   - `filebrowser-linux-arm64` (ARM64)
   - `filebrowser-linux-arm32` (ARM32)

## Make Executable

```bash
chmod +x filebrowser-linux-amd64
```

## Optional: Install FFmpeg

```bash
# Debian/Ubuntu
sudo apt install ffmpeg

# RHEL/CentOS/Fedora
sudo dnf install ffmpeg

# Arch Linux
sudo pacman -S ffmpeg
```

## Create Configuration

Interactive setup:

```bash
./filebrowser-linux-amd64 setup
```

Or create `config.yaml`:

```yaml
server:
  port: 8080
  sources:
    - path: "/home/user/files"
      config:
        defaultEnabled: true
auth:
  adminUsername: admin
```

## Run FileBrowser

```bash
./filebrowser-linux-amd64 -c config.yaml
```

Access at `http://localhost:8080`

## Run as Systemd Service

### Step 1: Move Binary

```bash
sudo mv filebrowser-linux-amd64 /usr/local/bin/filebrowser
sudo chmod +x /usr/local/bin/filebrowser
```

### Step 2: Create Service File

Create `/etc/systemd/system/filebrowser.service`:

```ini
[Unit]
Description=FileBrowser Quantum
After=network.target

[Service]
Type=simple
User=filebrowser
WorkingDirectory=/opt/filebrowser
ExecStart=/usr/local/bin/filebrowser -c /opt/filebrowser/config.yaml
Restart=on-failure

[Install]
WantedBy=multi-user.target
```

### Step 3: Create User and Directory

```bash
sudo useradd -r -s /bin/false filebrowser
sudo mkdir -p /opt/filebrowser
sudo chown filebrowser:filebrowser /opt/filebrowser
```

### Step 4: Move Config

```bash
sudo mv config.yaml /opt/filebrowser/
sudo chown filebrowser:filebrowser /opt/filebrowser/config.yaml
```

### Step 5: Enable and Start

```bash
sudo systemctl daemon-reload
sudo systemctl enable filebrowser
sudo systemctl start filebrowser
```

### Check Status

```bash
sudo systemctl status filebrowser
```

## Next Steps

- [Configure sources](/docs/configuration/sources/)
- [Set up users](/docs/configuration/users/)
- [Enable integrations](/docs/integrations/)

