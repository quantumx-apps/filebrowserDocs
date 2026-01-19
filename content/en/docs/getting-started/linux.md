---
title: "Linux"
description: "Install FileBrowser on Linux"
icon: "terminal"
---

Run FileBrowser Quantum natively on Linux using the binary releases.

## Download

1. Go to [releases page](https://github.com/gtsteffaniak/filebrowser/releases)
2. Download the appropriate binary (stable or beta):
   - `linux-amd64-filebrowser` (64-bit)
   - `linux-arm64-filebrowser` (64-bit)
   - `linux-armv6-filebrowser` (32-bit)
   - `linux-armv7-filebrowser` (32-bit)

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
  port: 80
  sources:
    - path: "/home/user/files" # Do not use a root "/" directory or include the "/var" folder
      config:
        defaultEnabled: true
auth:
  adminUsername: admin
```

## Run FileBrowser

```bash
./filebrowser-linux-amd64 -c config.yaml
```

Access at `http://localhost:80`

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

- {{< doclink path="configuration/sources/" text="Configure sources" />}}
- {{< doclink path="configuration/users/" text="Set up users" />}}
- {{< doclink path="integrations/" text="Enable integrations" />}}

