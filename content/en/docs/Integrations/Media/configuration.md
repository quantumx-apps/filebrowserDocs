---
title: "Configuration"
description: "Configure media integration settings"
icon: "settings"
weight: 2
---

Configure FFmpeg paths and media processing options.

## Basic Configuration

```yaml
integrations:
  media:
    ffmpegPath: "/usr/local/bin"  # Path where ffmpeg and ffprobe are installed
```

## Installation by Platform

### Docker

FFmpeg is included in the official image:

```yaml
integrations:
  media:
    ffmpegPath: "/usr/bin"
```

### Ubuntu/Debian

```bash
sudo apt update && sudo apt install ffmpeg
```

Configuration:
```yaml
integrations:
  media:
    ffmpegPath: "/usr/bin"
```

### macOS

```bash
brew install ffmpeg
```

Configuration:
```yaml
integrations:
  media:
    ffmpegPath: "/usr/local/bin"
```

### Windows

Download from [ffmpeg.org](https://ffmpeg.org/download.html) and add to PATH.

Configuration:
```yaml
integrations:
  media:
    ffmpegPath: "C:\\Program Files\\ffmpeg\\bin"
```

## Environment Variables

```bash
export FILEBROWSER_FFMPEG_PATH="/usr/local/bin"
```

## Performance Configuration

Configure cache and processing workers:

```yaml
server:
  cacheDir: "/var/cache/filebrowser"
  numImageProcessors: 4  # Parallel processing workers
```

### Cache Directory

**Location**: `server.cacheDir`
- Stores generated thumbnails
- Stores extracted subtitles
- Should have sufficient disk space
- Must be writable by FileBrowser process

### Processing Workers

**Number of workers**: `server.numImageProcessors`
- Controls parallel thumbnail generation
- Default: 4 workers
- Increase for high-traffic sites
- Decrease for resource-constrained systems

## Share-Level Configuration

Enable subtitle extraction per share:

```yaml
# In share settings
extractEmbeddedSubtitles: true
```

> **Note**: Subtitle extraction is IO-intensive and can take 10-30 seconds for large files.

## Verification

Verify FFmpeg installation:

```bash
# Check FFmpeg
ffmpeg -version

# Check FFprobe
ffprobe -version
```

Both commands should return version information.

## Next Steps

- [Media guides](/docs/integrations/media/guides/)
- [Troubleshooting](/docs/integrations/media/troubleshooting/)

