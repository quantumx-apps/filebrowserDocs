---
title: "Troubleshooting"
description: "Common media integration issues and solutions"
icon: "troubleshoot"
---

Solutions for common media integration problems with FFmpeg, thumbnails, and subtitle extraction.

## Quick Diagnostics

### Verify FFmpeg Installation

Check that FFmpeg and FFprobe are installed and accessible:

```bash
# Check FFmpeg version
ffmpeg -version

# Check FFprobe version
ffprobe -version
```

Both commands should return version information. If they fail, FFmpeg is not installed or not in your PATH.

### Find FFmpeg Location

If FFmpeg is installed but FileBrowser can't find it:

```bash
# On Linux/macOS
which ffmpeg
which ffprobe

# On Windows (PowerShell)
where.exe ffmpeg
where.exe ffprobe
```

Use the directory path (not the full file path) in your configuration.

## Common Issues

### Thumbnails Not Generating

{{% alert context="danger" %}}
**Problem:** Video thumbnails don't appear

**Symptoms:**
- Videos show generic icon instead of thumbnail
- No preview images in gallery view
- Blank thumbnail placeholders
{{% /alert %}}

**Solutions:**

{{< tabs tabTotal="4" >}}

{{< tab tabName="Check FFmpeg Path" >}}
Verify the `ffmpegPath` configuration is correct:

```yaml
integrations:
  media:
    ffmpegPath: "/usr/bin"  # Must be correct directory path
```

Test FFmpeg from that path:
```bash
/usr/bin/ffmpeg -version
/usr/bin/ffprobe -version
```
{{< /tab >}}

{{< tab tabName="Check Permissions" >}}
Ensure FFmpeg executables have proper permissions:

```bash
# Check permissions
ls -l /usr/bin/ffmpeg
ls -l /usr/bin/ffprobe

# Make executable if needed
sudo chmod +x /usr/bin/ffmpeg
sudo chmod +x /usr/bin/ffprobe
```
{{< /tab >}}

{{< tab tabName="Verify Cache Directory" >}}
Check that the cache directory exists and is writable:

```bash
# Check cache directory
ls -ld /var/cache/filebrowser

# Create if missing
mkdir -p /var/cache/filebrowser

# Set correct ownership (adjust user/group)
chown -R filebrowser:filebrowser /var/cache/filebrowser
chmod 755 /var/cache/filebrowser
```
{{< /tab >}}

{{< tab tabName="Enable Debug Mode" >}}
Enable debug output to see FFmpeg errors:

```yaml
integrations:
  media:
    debug: true  # Enable FFmpeg debug output
```

Check logs for FFmpeg error messages:
```bash
# System logs
journalctl -u filebrowser -f

# Docker logs
docker logs -f filebrowser

# Docker Compose logs
docker-compose logs -f filebrowser
```
{{< /tab >}}

{{< /tabs >}}

### Subtitles Not Extracting

{{% alert context="danger" %}}
**Problem:** Embedded subtitles don't appear in video player

**Symptoms:**
- No subtitle tracks available in video player
- Long wait times followed by no subtitles
- Error messages about subtitle extraction
{{% /alert %}}

**Solutions:**

**Step 1: Verify Server Configuration**

```yaml
integrations:
  media:
    extractEmbeddedSubtitles: true  # Must be enabled
```

**Step 2: Enable in Share Settings (for shares)**

When creating a share, enable "Extract embedded subtitles" option.

{{% alert context="info" %}}
**Remember:** For shares, subtitle extraction must be enabled in **both** places:
- Server level configuration
- Share creation settings
{{% /alert %}}

**Step 3: Verify Video Has Subtitles**

Check if the video file actually contains embedded subtitles:

```bash
ffprobe -v error -show_entries stream=codec_type video.mp4
```

Look for `codec_type=subtitle` in the output.

**Step 4: Check Subtitle Codec Support**

Verify FFmpeg supports the subtitle codec:

```bash
ffmpeg -codecs | grep subtitle
```

**Step 5: Check Cache Directory**

Ensure the cache directory has enough space and is writable:

```bash
df -h /var/cache/filebrowser
ls -ld /var/cache/filebrowser
```

### FFmpeg Not Found

{{% alert context="danger" %}}
**Problem:** FileBrowser can't find FFmpeg

**Symptoms:**
- Error messages mentioning FFmpeg not found
- No video thumbnails at all
- Media features don't work
{{% /alert %}}

**Solutions:**

{{< tabs tabTotal="4" >}}

{{< tab tabName="Docker" >}}
Verify FFmpeg is in the Docker container:

```bash
# Check FFmpeg in container
docker exec filebrowser which ffmpeg
docker exec filebrowser ffmpeg -version
```

If not found, ensure you're using the official FileBrowser image or install it:

```dockerfile
RUN apt-get update && apt-get install -y ffmpeg
```

Then configure:
```yaml
integrations:
  media:
    ffmpegPath: "/usr/bin"
```
{{< /tab >}}

{{< tab tabName="Ubuntu/Debian" >}}
Install FFmpeg:

```bash
sudo apt update
sudo apt install ffmpeg
```

Then configure:
```yaml
integrations:
  media:
    ffmpegPath: "/usr/bin"
```
{{< /tab >}}

{{< tab tabName="macOS" >}}
Install FFmpeg via Homebrew:

```bash
brew install ffmpeg
```

Then configure:
```yaml
integrations:
  media:
    ffmpegPath: "/usr/local/bin"
```

Or for Apple Silicon:
```yaml
integrations:
  media:
    ffmpegPath: "/opt/homebrew/bin"
```
{{< /tab >}}

{{< tab tabName="Windows" >}}
1. Download FFmpeg from [ffmpeg.org](https://ffmpeg.org/download.html)
2. Extract to `C:\Program Files\ffmpeg`
3. Add `C:\Program Files\ffmpeg\bin` to system PATH

Configure:
```yaml
integrations:
  media:
    ffmpegPath: "C:\\Program Files\\ffmpeg\\bin"
```
{{< /tab >}}

{{< /tabs >}}

## Performance Issues

### Slow Thumbnail Generation

{{% alert context="warning" %}}
**Problem:** Thumbnails take a long time to appear

**Symptoms:**
- Long delays before thumbnails appear
- FileBrowser feels slow when browsing videos
- High CPU usage during thumbnail generation
{{% /alert %}}

**Solutions:**

**1. Adjust Processing Workers**

```yaml
server:
  numImageProcessors: 8  # Increase from default (number of CPU cores)
```

**When to adjust:**
- **Increase**: If you have spare CPU capacity and want faster processing
- **Decrease**: If CPU is maxed out or system is slow

**2. Use Faster Storage for Cache**

Move the cache directory to faster storage (SSD):

```yaml
server:
  cacheDir: "/mnt/ssd/filebrowser-cache"
```

**3. Check System Resources**

Monitor system performance:

```bash
# CPU usage
top
htop  # Better interface

# Memory usage
free -h

# Disk I/O
iostat -x 1

# Disk space
df -h
```

**4. Consider Disabling Heavy Features**

For very large video files, subtitle extraction can be slow:

```yaml
integrations:
  media:
    extractEmbeddedSubtitles: false  # Disable if too slow
```

### High Memory Usage

{{% alert context="warning" %}}
**Problem:** FileBrowser uses too much memory during media processing
{{% /alert %}}

**Solutions:**

1. **Reduce concurrent processors:**
```yaml
server:
  numImageProcessors: 2  # Lower than CPU count
```

2. **Limit video file sizes** - Use file size limits in user settings

3. **Regular cache cleanup:**
```bash
# Remove old cache files (older than 30 days)
find /var/cache/filebrowser -type f -mtime +30 -delete
```

### Large Cache Size

{{% alert context="warning" %}}
**Problem:** Cache directory consuming too much disk space
{{% /alert %}}

**Solutions:**

**1. Implement Automatic Cleanup**

Create a cleanup script:

```bash
#!/bin/bash
# cleanup-cache.sh
find /var/cache/filebrowser -type f -mtime +30 -delete
```

Add to cron:
```bash
# Clean cache daily at 2 AM
0 2 * * * /path/to/cleanup-cache.sh
```

**2. Use Cache Size Limits**

Monitor and set alerts:

```bash
# Check cache size
du -sh /var/cache/filebrowser

# Set up monitoring
watch -n 60 'du -sh /var/cache/filebrowser'
```

**3. Selective Caching**

Disable thumbnails for certain file types using user settings.

## Permission Errors

{{% alert context="danger" %}}
**Problem:** "Permission denied" errors when generating thumbnails

**Symptoms:**
- Thumbnails fail to generate
- Error messages about permission denied
- Some videos work, others don't
{{% /alert %}}

**Solutions:**

**1. Check Video File Permissions**

```bash
# Check file permissions
ls -l /path/to/video/file.mp4

# Make readable if needed
chmod 644 /path/to/video/file.mp4
```

**2. Test as FileBrowser User**

Verify the FileBrowser user can access files:

```bash
# Test thumbnail generation as FileBrowser user
sudo -u filebrowser ffmpeg -i /path/to/video/file.mp4 -frames:v 1 test.jpg
```

**3. Fix Cache Directory Permissions**

```bash
# Check cache directory ownership
ls -ld /var/cache/filebrowser

# Fix ownership (adjust username/group)
sudo chown -R filebrowser:filebrowser /var/cache/filebrowser
sudo chmod 755 /var/cache/filebrowser
```

**4. SELinux Issues (Linux)**

If using SELinux, check context:

```bash
# Check SELinux context
ls -Z /var/cache/filebrowser

# Fix if needed
sudo semanage fcontext -a -t httpd_sys_rw_content_t "/var/cache/filebrowser(/.*)?"
sudo restorecon -R /var/cache/filebrowser
```

## Docker-Specific Issues

### FFmpeg Not Found in Docker

{{% alert context="danger" %}}
**Problem:** FFmpeg not available inside Docker container
{{% /alert %}}

**Verify FFmpeg in Container:**

```bash
docker exec filebrowser which ffmpeg
docker exec filebrowser ffmpeg -version
```

**If Missing:**

Use the official FileBrowser image (includes FFmpeg) or add to your Dockerfile:

```dockerfile
FROM filebrowser/filebrowser:latest

# If building custom image and FFmpeg is missing
RUN apt-get update && apt-get install -y ffmpeg && rm -rf /var/lib/apt/lists/*
```

### Cache Not Persisting

{{% alert context="warning" %}}
**Problem:** Thumbnails regenerate every time container restarts
{{% /alert %}}

**Solution: Use Named Volumes**

```yaml
# docker-compose.yml
services:
  filebrowser:
    image: filebrowser/filebrowser
    volumes:
      - ./config:/config
      - ./data:/srv
      - cache:/tmp  # Named volume for cache

volumes:
  cache:
    driver: local
```

Or use bind mount:

```yaml
volumes:
  - ./cache:/tmp
```

### Volume Mount Permissions

{{% alert context="danger" %}}
**Problem:** Permission denied errors with Docker volumes
{{% /alert %}}

**Solutions:**

**1. Set Correct UID/GID**

```yaml
# docker-compose.yml
services:
  filebrowser:
    image: filebrowser/filebrowser
    user: "1000:1000"  # Match your host user
    volumes:
      - ./cache:/tmp
```

**2. Fix Host Directory Permissions**

```bash
# On host machine
sudo chown -R 1000:1000 ./cache
sudo chmod -R 755 ./cache
```

## Format-Specific Issues

### HEIC Images Not Converting

{{% alert context="info" %}}
**Problem:** HEIC images don't show thumbnails
{{% /alert %}}

Enable HEIC conversion:

```yaml
integrations:
  media:
    convert:
      imagePreview:
        heic: true  # Enable HEIC conversion
```

Verify FFmpeg supports HEIC:

```bash
ffmpeg -codecs | grep hevc
```

### Specific Video Format Not Working

{{% alert context="info" %}}
**Problem:** Certain video formats don't generate thumbnails
{{% /alert %}}

**Check Format Support:**

```bash
# List all supported video formats
ffmpeg -formats | grep -E "mp4|mkv|avi|mov"

# Check specific codec
ffmpeg -codecs | grep h264
```

**Enable Format:**

```yaml
integrations:
  media:
    convert:
      videoPreview:
        mkv: true
        avi: true
        # Add other formats as needed
```

## Getting Help

If you continue experiencing issues after trying these solutions:

### 1. Check Logs

Enable debug mode and check logs:

```yaml
integrations:
  media:
    debug: true
```

```bash
# View logs
journalctl -u filebrowser -f
docker logs -f filebrowser
docker-compose logs -f filebrowser
```

### 2. Test FFmpeg Standalone

Verify FFmpeg works independently:

```bash
# Generate test thumbnail
ffmpeg -i /path/to/video.mp4 -vframes 1 -f image2 test.jpg

# Extract subtitles
ffmpeg -i /path/to/video.mp4 -map 0:s:0 subtitles.srt
```

### 3. Gather Information

When asking for help, provide:
- FileBrowser version
- FFmpeg version (`ffmpeg -version`)
- Operating system
- Docker version (if applicable)
- Configuration (sanitized)
- Error messages from logs
- Steps to reproduce

### 4. Community Support

- [GitHub Issues](https://github.com/gtsteffaniak/filebrowser/issues) - Report bugs
- [GitHub Discussions](https://github.com/gtsteffaniak/filebrowser/discussions) - Ask questions
- [Documentation](/docs/) - Browse guides

## Next Steps

- {{< doclink path="integrations/media/configuration/" text="Configuration" />}} - Set up media integration
- {{< doclink path="integrations/media/guides/" text="Media guides" />}} - Usage examples
- {{< doclink path="advanced/logging/troubleshooting/" text="General troubleshooting" />}} - Other issues
