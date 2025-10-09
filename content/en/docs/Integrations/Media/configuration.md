---
title: "Configuration"
description: "Configure media integration settings"
icon: "settings"
---

Configure FFmpeg paths, subtitle extraction, and media processing options for video thumbnails and subtitle support.

## Basic Configuration

Path to the directory where ffmpeg and ffprobe executables are installed:

```yaml
integrations:
  media:
    ffmpegPath: "/usr/local/bin"  # Directory containing ffmpeg and ffprobe
```

## Subtitle Extraction

Subtitle extraction requires configuration at **two levels**:

### Server-Level Configuration

```yaml
integrations:
  media:
    extractEmbeddedSubtitles: false  # Enable server-wide subtitle extraction
```

Must be enabled at the server level first to allow subtitle extraction functionality.

### Share-Level Configuration

For **shares**, subtitle extraction must be enabled in both places:

{{% alert context="info" %}}
**Requirements for shares:**
- ✅ Server level: `integrations.media.extractEmbeddedSubtitles: true`
- ✅ Share level: Enable "Extract embedded subtitles" option when creating the share
{{% /alert %}}

For **non-share file viewing**, only server-level configuration is needed:

{{% alert context="success" %}}
**Requirements for regular viewing:**
- ✅ Server level: `integrations.media.extractEmbeddedSubtitles: true`
- Share level: Not applicable
{{% /alert %}}

{{% alert context="warning" %}}
Subtitle extraction is IO-intensive and can take 10-30 seconds for large video files.
{{% /alert %}}

## Installation by Platform

{{< tabs tabTotal="4" >}}

{{< tab tabName="Docker" >}}
FFmpeg is included in the official FileBrowser image:

```yaml
integrations:
  media:
    ffmpegPath: "/usr/bin"
```

No installation needed - ffmpeg is pre-installed in the Docker image.
{{< /tab >}}

{{< tab tabName="Ubuntu/Debian" >}}
**Installation:**
```bash
sudo apt update && sudo apt install ffmpeg
```

**Configuration:**
```yaml
integrations:
  media:
    ffmpegPath: "/usr/bin"
```
{{< /tab >}}

{{< tab tabName="macOS" >}}
**Installation (using Homebrew):**
```bash
brew install ffmpeg
```

**Configuration:**
```yaml
integrations:
  media:
    ffmpegPath: "/usr/local/bin"
```
{{< /tab >}}

{{< tab tabName="Windows" >}}
**Installation:**
1. Download FFmpeg from [ffmpeg.org](https://ffmpeg.org/download.html)
2. Extract to a directory (e.g., `C:\Program Files\ffmpeg`)
3. Add the `bin` directory to your system PATH

**Configuration:**
```yaml
integrations:
  media:
    ffmpegPath: "C:\\Program Files\\ffmpeg\\bin"
```
{{< /tab >}}

{{< /tabs >}}

## Advanced Configuration

### Format Support

Control which media formats support thumbnail previews:

```yaml
integrations:
  media:
    convert:
      imagePreview:
        heic: false  # Enable HEIC image preview conversion
      videoPreview:
        mp4: true    # Enable MP4 video thumbnails (default: true)
        mkv: true    # Enable MKV video thumbnails (default: true)
        avi: true    # Enable AVI video thumbnails (default: true)
        # ... more formats available
```

{{% alert context="info" %}}
Video formats default to **enabled**. Image formats default to **disabled** unless explicitly enabled.
{{% /alert %}}

**Supported video formats:**
`3g2`, `3gp`, `asf`, `avi`, `f4v`, `flv`, `m2ts`, `m4v`, `mkv`, `mov`, `mp4`, `mpeg`, `mpg`, `ogv`, `ts`, `vob`, `webm`, `wmv`

### Debug Mode

Enable debug output for troubleshooting:

```yaml
integrations:
  media:
    debug: false  # Enable FFmpeg debug output
```

{{% alert context="warning" %}}
Debug mode produces large amounts of FFmpeg stdout output. Only enable for troubleshooting.
{{% /alert %}}

## Performance Settings

### Cache Directory

```yaml
server:
  cacheDir: "tmp"  # Path to cache directory
```

**What's stored:**
- Generated video thumbnails
- Extracted subtitles from media files
- Processed image previews

**Requirements:**
- Must be writable by the FileBrowser process
- Should have sufficient disk space for thumbnails
- Can be cleared periodically to free space

### Processing Workers

```yaml
server:
  numImageProcessors: 4  # Number of parallel thumbnail processors
```

Defaults to the number of CPU cores available. FFmpeg operations use half this number (minimum 1 worker).

## Environment Variables

Configure via environment variables instead of config file:

```bash
# FFmpeg path
export FILEBROWSER_FFMPEG_PATH="/usr/local/bin"

# Cache directory
export FILEBROWSER_CACHE_DIR="/var/cache/filebrowser"

# Enable subtitle extraction
export FILEBROWSER_EXTRACT_EMBEDDED_SUBTITLES="true"
```

## Complete Configuration Example

Full media integration configuration:

```yaml
server:
  cacheDir: "/var/cache/filebrowser"
  numImageProcessors: 4

integrations:
  media:
    ffmpegPath: "/usr/bin"
    debug: false
    extractEmbeddedSubtitles: true  # Enable subtitle extraction
    convert:
      imagePreview:
        heic: true  # Enable HEIC conversion
      videoPreview:
        mp4: true
        mkv: true
        avi: true
        mov: true
        webm: true
```

### Test in FileBrowser

1. Navigate to a video file in FileBrowser
2. Check if a thumbnail preview is generated
3. For subtitle extraction, enable it in share settings and verify subtitles appear in the video player

## Next Steps

- {{< doclink path="integrations/media/guides/" text="Media guides" />}} - Usage examples and guides
- {{< doclink path="integrations/media/troubleshooting/" text="Troubleshooting" />}} - Common issues and solutions
