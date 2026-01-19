---
title: "Configuration"
description: "Configure media integration settings"
icon: "settings"
---

Configure FFmpeg paths, subtitle extraction, and media processing options for video thumbnails and subtitle support.

## Basic Configuration

Path to the directory where ffmpeg and ffprobe executables are installed (only needed if not in PATH):

```yaml
integrations:
  media:
    ffmpegPath: "/usr/local/bin"  # Directory containing ffmpeg and ffprobe
```

## Subtitle Extraction

{{% alert context="warning" %}}
Large videos can take 10-30 seconds to process, because the server reads the whole file -- can be i/o intensive.
{{% /alert %}}

For large videos, you may notice a 20-30 second delay loading a video for the first time if you enable this. Subsequent views within a 24 hour period will load cached subtitles for faster load times.

This feature is very useful -- but can be demanding if many different videos are previewed at once. So, this is also disabled by default for shares and must be configured at the share level if you want share link users to view embedded subtitles as well.

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


## Installation by Platform

{{< tabs tabTotal="4" >}}

{{< tab tabName="Docker" >}}

FFmpeg is included in the official FileBrowser image, no installation or configuration needed.

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
        heic: false  # Enable HEIC image preview conversion (default false)
      videoPreview:
        mp4: false    # Disables MP4 video thumbnails (default: true)
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

A high perfomrance directory for caching is needed -- see [CacheDir](https://filebrowserquantum.com/en/docs/configuration/server/#cachedir) config for more details. 

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
```

## Complete Configuration Example

Full media integration configuration:

```yaml
server:
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
2. Ensure user profile settings have "video previews" enabled
3. Check if a thumbnail preview is generated
4. For subtitle extraction, enable it in share settings and verify subtitles appear in the video player

## Next Steps

- {{< doclink path="integrations/media/guides/" text="Media guides" />}} - Usage examples and guides
- {{< doclink path="integrations/media/troubleshooting/" text="Troubleshooting" />}} - Common issues and solutions
