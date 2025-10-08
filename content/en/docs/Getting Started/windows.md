---
title: "Windows"
description: "Install FileBrowser on Windows"
icon: "desktop_windows"
weight: 2
---

Run FileBrowser Quantum natively on Windows.

## Download

1. Go to [releases page](https://github.com/gtsteffaniak/filebrowser/releases)
2. Download `filebrowser-windows-amd64.exe` (or arm64 for ARM processors)
3. Save to a folder (e.g., `C:\FileBrowser\`)

## Optional: Install FFmpeg

For video preview support, [install FFmpeg](https://phoenixnap.com/kb/ffmpeg-windows).

## Create Configuration

Create `config.yaml` in the same folder:

```yaml
server:
  port: 8080
  sources:
    - path: "C:\\Users\\YourName\\Documents"
      config:
        defaultEnabled: true
auth:
  adminUsername: admin
```

Or generate interactively:

```cmd
.\filebrowser.exe setup
```

## Run FileBrowser

```cmd
.\filebrowser.exe -c config.yaml
```

Access at `http://localhost:8080` with `admin` / `admin`

## Run as Windows Service

Using [NSSM](https://nssm.cc/download):

```cmd
nssm install FileBrowser "C:\FileBrowser\filebrowser.exe" "-c C:\FileBrowser\config.yaml"
nssm start FileBrowser
```

## Troubleshooting

For common issues and solutions, see the [Troubleshooting guide](/docs/getting-started/troubleshooting/).

## Next Steps

- [Configure sources](/docs/configuration/sources/)
- [Set up authentication](/docs/configuration/authentication/)
- [Enable media integration](/docs/integrations/media/)

