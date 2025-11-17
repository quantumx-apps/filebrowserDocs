---
title: "macOS"
description: "Install FileBrowser on macOS"
icon: "laptop_mac"
---

Run FileBrowser Quantum natively on macOS.

## Download

1. Go to [releases page](https://github.com/gtsteffaniak/filebrowser/releases)
2. Download either stable or beta `filebrowser-darwin-amd64` (Intel) or `filebrowser-darwin-arm64` (Apple Silicon)
3. Save to a folder

## Enable Permissions

### Step 1: Make Executable

```bash
chmod +x filebrowser-darwin-arm64
```

### Step 2: Allow in Security Settings

On first run, macOS will block the app:

1. Try to run: `./filebrowser-darwin-arm64`
2. Go to **System Preferences** → **Security & Privacy**
3. Click **Allow** for FileBrowser

## Optional: Install FFmpeg

```bash
brew install ffmpeg
```

## Create Configuration

```bash
./filebrowser-darwin-arm64 setup
```

Or create `config.yaml`:

```yaml
server:
  port: 8080
  sources:
    - path: "/Users/yourname/Documents"
      config:
        defaultEnabled: true
auth:
  adminUsername: admin
```

## Run FileBrowser

```bash
./filebrowser-darwin-arm64 -c config.yaml
```

Access at `http://localhost:8080`

## Run as Service (launchd)

Create `/Library/LaunchDaemons/com.filebrowser.plist`:

```xml
<?xml version="1.0" encoding="UTF-8"?>
<!DOCTYPE plist PUBLIC "-//Apple//DTD PLIST 1.0//EN" "http://www.apple.com/DTDs/PropertyList-1.0.dtd">
<plist version="1.0">
<dict>
    <key>Label</key>
    <string>com.filebrowser</string>
    <key>ProgramArguments</key>
    <array>
        <string>/usr/local/bin/filebrowser</string>
        <string>-c</string>
        <string>/usr/local/etc/filebrowser/config.yaml</string>
    </array>
    <key>RunAtLoad</key>
    <true/>
    <key>KeepAlive</key>
    <true/>
</dict>
</plist>
```

Load service:

```bash
sudo launchctl load /Library/LaunchDaemons/com.filebrowser.plist
```

## Next Steps

- {{< doclink path="configuration/sources/" text="Configure sources" />}}
- {{< doclink path="configuration/users/" text="Set up users" />}}
- {{< doclink path="integrations/" text="Enable integrations" />}}

