---
title: "Integrations Overview"
description: "Enable media and office document features"
icon: "extension"
---

Extend FileBrowser with powerful integrations for media and documents.

## Available Integrations

### [Media Integration](/docs/integrations/media/)
FFmpeg-based media processing for video thumbnails and subtitle extraction.

- [About](/docs/integrations/media/about/) - Overview and features
- [Configuration](/docs/integrations/media/configuration/) - Setup and options
- [Guides](/docs/integrations/media/guides/) - How-to guides
- [Troubleshooting](/docs/integrations/media/troubleshooting/) - Common issues

### [Office Integration](/docs/integrations/office/)
OnlyOffice Document Server integration for document preview and editing.

{{% alert context="info" %}}
OnlyOffice is currently the only supported office integration. Collabora support is planned for the future.
{{% /alert %}}

- [About](/docs/integrations/office/about/) - Overview and features
- [Configuration](/docs/integrations/office/configuration/) - Setup and options
- [Guides](/docs/integrations/office/guides/) - How-to guides
- [Troubleshooting](/docs/integrations/office/troubleshooting/) - Common issues

## Quick Start

Both integrations can be configured via `config.yaml`:

```yaml
integrations:
  # Media integration (uses FFmpeg from PATH or configured path)
  media:
    ffmpegPath: "/usr/local/bin"  # Optional if FFmpeg is in PATH
  
  # Office integration (OnlyOffice)
  office:
    enabled: true
    url: "http://onlyoffice:80"
    secret: "your-secret"
```

## Next Steps

- [Media integration setup](/docs/integrations/media/)
- [Office integration setup](/docs/integrations/office/)
- [User guides](/docs/user-guides/)
