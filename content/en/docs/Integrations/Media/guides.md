---
title: "Guides"
description: "Media integration how-to guides"
icon: "menu_book"
weight: 3
---

Practical guides for common media integration tasks.

## Enable Video Thumbnails

Video thumbnails are automatically generated when media integration is configured.

**Requirements**:
- FFmpeg installed
- `integrations.media.ffmpegPath` configured
- Writable cache directory

**Configuration**:
```yaml
integrations:
  media:
    ffmpegPath: "/usr/local/bin"

server:
  cacheDir: "/var/cache/filebrowser"
```

Thumbnails are generated on-demand and cached for subsequent requests.

## Extract Subtitles from Videos

Enable subtitle extraction for specific shares:

**Via configuration**:
```yaml
# Create share with subtitle extraction
shares:
  - path: "/movies"
    source: "files"
    extractEmbeddedSubtitles: true
```

**Via API**:
```bash
curl -X POST \
  -H "Authorization: Bearer ${TOKEN}" \
  -H "Content-Type: application/json" \
  -d '{
    "path": "/movies",
    "source": "files",
    "extractEmbeddedSubtitles": true
  }' \
  http://localhost:8080/api/share
```

**Supported formats**:
- SRT (SubRip)
- ASS/SSA (Advanced SubStation Alpha)
- WebVTT
- Embedded in MP4, MKV, AVI

## Optimize Performance

### Increase Processing Workers

For high-traffic sites, increase parallel workers:

```yaml
server:
  numImageProcessors: 8  # Increase from default 4
```

### Configure Cache Location

Use fast storage for cache:

```yaml
server:
  cacheDir: "/mnt/ssd/filebrowser-cache"
```

### Monitor Cache Size

Regularly monitor and clean cache:

```bash
# Check cache size
du -sh /var/cache/filebrowser

# Clean old cache files (optional)
find /var/cache/filebrowser -type f -mtime +30 -delete
```

## Docker Setup

Complete Docker Compose example with media integration:

```yaml
version: '3.8'

services:
  filebrowser:
    image: your-filebrowser:latest
    ports:
      - "8080:8080"
    volumes:
      - ./config.yaml:/config.yaml
      - ./data:/data
      - cache:/var/cache/filebrowser
    environment:
      - FILEBROWSER_FFMPEG_PATH=/usr/bin

volumes:
  cache:
    driver: local
```

## Supported Video Formats

FFmpeg supports most common video formats:

- MP4 (H.264, H.265)
- MKV (Matroska)
- AVI
- MOV (QuickTime)
- WebM
- FLV
- WMV
- MPEG

Thumbnail generation works for all formats FFmpeg can decode.

## Custom FFmpeg Options

FileBrowser uses standard FFmpeg commands for:

**Thumbnail generation**:
```bash
ffmpeg -i input.mp4 -vf "thumbnail,scale=320:-1" -frames:v 1 thumb.jpg
```

**Subtitle extraction**:
```bash
ffprobe -v error -show_entries stream=index:stream_tags=language -of json input.mp4
ffmpeg -i input.mp4 -map 0:s:0 output.srt
```

## Next Steps

- [Troubleshooting](/docs/integrations/media/troubleshooting/)
- [Office integration](/docs/integrations/office/)
- [Shares configuration](/docs/shares/)

