---
title: "Windows"
description: "Install FileBrowser on Windows"
icon: "desktop_windows"
---

Run FileBrowser Quantum natively on Windows.

## Download

1. Go to [releases page](https://github.com/gtsteffaniak/filebrowser/releases)
2. Download either stable or beta `filebrowser-windows-amd64.exe` (or arm64 for ARM processors)
3. Save to a folder (e.g., `C:\FileBrowser\`)

## Optional: Install FFmpeg

For video preview support, [install FFmpeg](https://phoenixnap.com/kb/ffmpeg-windows).

## Create Configuration

Interactive setup:

```bash
.\filebrowser.exe setup
```

Or Create `config.yaml` in the same folder:

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

## Troubleshooting

For common issues and solutions, see the {{< doclink path="getting-started/troubleshooting/" text="Troubleshooting guide" />}}.

## Next Steps

- {{< doclink path="configuration/sources/" text="Configure sources" />}}
- {{< doclink path="configuration/authentication/" text="Set up authentication" />}}
- {{< doclink path="integrations/media/" text="Enable media integration" />}}

