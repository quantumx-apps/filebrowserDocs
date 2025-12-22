---
title: "Integrations Overview"
description: "Enable media and office document features"
icon: "extension"
---

Extend FileBrowser with powerful integrations for media and documents.

## Available Integrations

### {{< doclink path="integrations/media/" text="Media Integration" />}}
FFmpeg-based media processing for video thumbnails and subtitle extraction.

- {{< doclink path="integrations/media/about/" text="About" />}} - Overview and features
- {{< doclink path="integrations/media/configuration/" text="Configuration" />}} - Setup and options
- {{< doclink path="integrations/media/guides/" text="Guides" />}} - How-to guides
- {{< doclink path="integrations/media/troubleshooting/" text="Troubleshooting" />}} - Common issues

### {{< doclink path="integrations/office/" text="Office Integration" />}}
OnlyOffice Document Server integration for document preview and editing.

{{% alert context="info" %}}
OnlyOffice is currently the only supported office integration. Collabora support is planned for the future.
{{% /alert %}}

- {{< doclink path="integrations/office/about/" text="About" />}} - Overview and features
- {{< doclink path="integrations/office/configuration/" text="Configuration" />}} - Setup and options
- {{< doclink path="user-guides/office-integration/office-integration/" text="Guides" />}} - How-to guides
- {{< doclink path="integrations/office/troubleshooting/" text="Troubleshooting" />}} - Common issues

## Quick Start

Both integrations can be configured via `config.yaml`:

```yaml
integrations:
  # Media integration (uses FFmpeg from PATH or configured path)
  media:
    ffmpegPath: "/usr/local/bin"  # Optional if FFmpeg is in PATH
  
  # Office integration (OnlyOffice)
  office:
    url: "http://onlyoffice:80"
    secret: "your-secret"
```

## Next Steps

- {{< doclink path="integrations/media/" text="Media integration setup" />}}
- {{< doclink path="integrations/office/" text="Office integration setup" />}}
- {{< doclink path="user-guides/office-integration/office-integration/" text="Office guides" />}}
