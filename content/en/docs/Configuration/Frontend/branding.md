---
title: "Branding"
description: "Configure name, description, and favicon"
icon: "branding_watermark"
---

Customize branding elements that appear in the UI and HTML metadata.

## Configuration

```yaml
frontend:
  name: "Company Files"
  description: "Secure file storage"
  favicon: "/path/to/favicon.png"
  externalLinks:
    - text: "Support"
      title: "Get support"
      url: "https://support.example.com"
```

## Options

| Option | Default | Description |
|--------|---------|-------------|
| `name` | "FileBrowser Quantum" | Display name in header and PWA manifest |
| `description` | "" | HTML meta description for SEO/link previews |
| `favicon` | Built-in | Path to custom favicon image |
| `externalLinks` | `[]` | Custom links in sidebar |

## Name

Display name appears in:
- Application header
- Browser tab title
- PWA manifest
- Mobile home screen

```yaml
frontend:
  name: "Acme Corp Files"
```

## Description

HTML meta description used for:
- Search engine results
- Social media link previews
- Browser metadata

```yaml
frontend:
  description: "Secure file sharing and storage for Acme Corporation"
```

## Favicon

Custom favicon (PNG recommended):

```yaml
frontend:
  favicon: "/path/to/favicon.png"
```

**Recommended size**: 256x256 pixels

## External Links

Add custom sidebar links:

```yaml
frontend:
  externalLinks:
    - text: "Documentation"        # Link text (required)
      title: "View documentation"  # Hover tooltip (required)
      url: "https://docs.example.com"  # URL (required)
    - text: "Support Portal"
      title: "Get help"
      url: "https://support.example.com"
```

**Fields**:
- `text` - Link text displayed in sidebar (required)
- `title` - Tooltip shown on hover (required)
- `url` - Destination URL (required)

## Complete Example

```yaml
frontend:
  name: "Acme Corp Storage"
  description: "Secure enterprise file management system"
  favicon: "/custom/favicon.png"
  externalLinks:
    - text: "Intranet"
      title: "Company intranet"
      url: "https://intranet.acme.com"
    - text: "IT Support"
      title: "Get IT help"
      url: "https://support.acme.com"
    - text: "Policies"
      title: "File storage policies"
      url: "https://policies.acme.com/storage"
```

## Next Steps

- [Configure styling](/docs/configuration/frontend/styling/)
- [Set up themes](/docs/configuration/frontend/themes/)
- [Interface options](/docs/configuration/frontend/interface/)

