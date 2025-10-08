---
title: "Troubleshooting"
description: "Common media integration issues"
icon: "troubleshoot"
weight: 4
---

Solutions for common media integration problems.

## FFmpeg Not Found

**Symptoms**: No video thumbnails, error messages about FFmpeg.

**Solutions**:

1. **Verify FFmpeg is installed**:
```bash
ffmpeg -version
ffprobe -version
```

2. **Check path configuration**:
```yaml
integrations:
  media:
    ffmpegPath: "/usr/local/bin"  # Correct path to FFmpeg
```

3. **Find FFmpeg location**:
```bash
which ffmpeg
which ffprobe
```

4. **Set correct path**:
```yaml
integrations:
  media:
    ffmpegPath: "/path/from/which/command"
```

## Thumbnails Not Generating

**Symptoms**: Video files show no preview thumbnails.

**Solutions**:

1. **Check FFmpeg permissions**:
```bash
# Verify FFmpeg is executable
ls -l /usr/local/bin/ffmpeg
ls -l /usr/local/bin/ffprobe

# Make executable if needed
chmod +x /usr/local/bin/ffmpeg
chmod +x /usr/local/bin/ffprobe
```

2. **Verify cache directory**:
```bash
# Check cache directory exists and is writable
ls -ld /var/cache/filebrowser

# Create if missing
mkdir -p /var/cache/filebrowser
chown filebrowser:filebrowser /var/cache/filebrowser
chmod 755 /var/cache/filebrowser
```

3. **Check disk space**:
```bash
df -h /var/cache/filebrowser
```

4. **Review logs for errors**:
```bash
# Check FileBrowser logs
journalctl -u filebrowser -f

# Or Docker logs
docker-compose logs -f filebrowser
```

## Subtitle Extraction Fails

**Symptoms**: Subtitles not appearing for videos, extraction errors.

**Solutions**:

1. **Verify video has embedded subtitles**:
```bash
ffprobe -v error -show_entries stream=codec_type input.mp4
```

Look for `codec_type=subtitle` in the output.

2. **Check FFmpeg codec support**:
```bash
ffmpeg -codecs | grep subtitle
```

3. **Verify sufficient disk space**:
```bash
df -h /var/cache/filebrowser
```

4. **Enable subtitle extraction in share**:
```yaml
# In share settings
extractEmbeddedSubtitles: true
```

## Slow Thumbnail Generation

**Symptoms**: Thumbnails take a long time to appear.

**Solutions**:

1. **Increase processing workers**:
```yaml
server:
  numImageProcessors: 8  # Increase from default 4
```

2. **Use faster storage for cache**:
```yaml
server:
  cacheDir: "/mnt/ssd/filebrowser-cache"
```

3. **Check system resources**:
```bash
# CPU usage
top

# Memory usage
free -h

# Disk I/O
iostat -x 1
```

## Permission Errors

**Symptoms**: "Permission denied" errors when generating thumbnails.

**Solutions**:

1. **Check file permissions**:
```bash
ls -l /path/to/video/file.mp4
```

2. **Verify FileBrowser user has read access**:
```bash
# Test as FileBrowser user
sudo -u filebrowser ffmpeg -i /path/to/video/file.mp4 -frames:v 1 test.jpg
```

3. **Check cache directory permissions**:
```bash
ls -ld /var/cache/filebrowser
chown -R filebrowser:filebrowser /var/cache/filebrowser
```

## Docker-Specific Issues

**FFmpeg not found in Docker**:

Verify FFmpeg is in the image:
```bash
docker exec filebrowser which ffmpeg
docker exec filebrowser ffmpeg -version
```

If missing, use official image or install:
```dockerfile
RUN apt-get update && apt-get install -y ffmpeg
```

**Cache not persisting**:

Use named volume:
```yaml
volumes:
  - cache:/var/cache/filebrowser

volumes:
  cache:
    driver: local
```

## Performance Issues

**High CPU usage during thumbnail generation**:

1. Reduce number of workers
2. Limit concurrent requests
3. Use lower resolution thumbnails
4. Consider pre-generating thumbnails

**Large cache size**:

Implement cache cleanup:
```bash
# Remove old cache files
find /var/cache/filebrowser -type f -mtime +30 -delete
```

## Getting Help

If you continue experiencing issues:

1. Check logs for error messages
2. Verify FFmpeg works standalone
3. Test with different video files
4. Review [GitHub Issues](https://github.com/gtsteffaniak/filebrowser/issues)
5. Ask in [GitHub Discussions](https://github.com/gtsteffaniak/filebrowser/discussions)

## Next Steps

- [Media guides](/docs/integrations/media/guides/)
- [Configuration](/docs/integrations/media/configuration/)
- [Help & Support](/docs/help/)

