---
title: "About"
description: "Overview of media integration features"
icon: "info"
---

Overview of FFmpeg-based media processing features.

## Overview

FileBrowser Quantum uses FFmpeg for media processing capabilities including video thumbnail generation and subtitle extraction.

**FFmpeg Discovery**: FileBrowser will automatically use the FFmpeg binary in your system PATH if available. If FFmpeg is not in PATH, you can configure a specific path in your configuration.

## Features

**Video Thumbnails**: Automatic thumbnail generation for video files, cached for performance.

**Subtitle Extraction**: Extract embedded subtitles from video files (IO-intensive, 10-30 seconds for large files).

**Conversion Support**: Convert support is currently limited, only heic image conversion is supported for non-safari browsers to be able to view images.

## Requirements

- FFmpeg and FFprobe must be installed and accessible
- Either in system PATH or configured via `integrations.media.ffmpegPath`

**Docker**: FFmpeg is included in the official docker image.

## Quick Start

If FFmpeg is in your PATH, media integration works automatically. Otherwise, configure the path:

```yaml
integrations:
  media:
    ffmpegPath: "/home/graham/Downloads/ffmpeg/bin"
```
