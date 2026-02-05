---
title: "Branding"
description: "Configure share options and branding"
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

Custom favicon supports multiple image formats. Non-PNG raster formats are automatically converted to PNG for PWA icon generation.

### Supported Formats

**Raster formats** (can be used directly as favicon):
- PNG (`.png`)
- JPEG (`.jpg`, `.jpeg`)
- WebP (`.webp`)
- GIF (`.gif`)
- TIFF (`.tiff`)
- BMP (`.bmp`)
- HEIC (`.heic`)
- PBM (`.pbm`)
- PGM (`.pgm`)
- PPM (`.ppm`)
- PAM (`.pam`)

**Vector format**:
- SVG (`.svg`) - should include a companion PNG file in the same directory for maximum compatibility.

{{% alert context="info" %}}
All non-PNG raster formats are automatically converted to PNG internally for PWA icon generation (192x192, 256x256, 512x512) and platform-specific icons. The original format is used for the favicon display in the browser.
{{% /alert %}}

### Image Favicon

Simple favicon:

```yaml
frontend:
  favicon: "/path/to/favicon.png"
```

**Recommended size**: 256x256 pixels

### Other Formats

You can use any supported format directly:

```yaml
frontend:
  favicon: "/path/to/favicon.jpg"   # JPEG
  # or
  favicon: "/path/to/favicon.webp" # WebP
```

The system will automatically convert the file to PNG for generating PWA icons (192x192, 256x256, 512x512) and platform-specific icons.

### SVG Favicon with PNG Companion

For SVG favicons, you should provide a PNG file with the same name in the same directory. The system will use the SVG for modern browsers and generate compatibility icons from the PNG companion file.

```yaml
frontend:
  favicon: "/path/to/favicon.svg"  # SVG for modern browsers
```

**Requirements:**
- SVG file: `/path/to/favicon.svg`
- PNG companion: `/path/to/favicon.png` (must exist in the same directory with the same base name)
- The PNG file is used to generate PWA icons and other compatibility formats

**Example:**
If you configure:
```yaml
frontend:
  favicon: "/home/filebrowser/myicon.svg"
```

The system will:
1. Use `myicon.svg` for the favicon in modern browsers
2. Look for `myicon.png` in the same directory (`/home/filebrowser/myicon.png`)
3. Convert the PNG to generate PWA icons (192x192, 256x256, 512x512) and platform-specific icons

{{% alert context="warning" %}}
**Important**: SVG favicons should include a companion PNG file with the same base name in the same directory. If the PNG companion is not found, the system will fall back to the default favicon.
{{% /alert %}}

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
- `url` - Destination URL (required)
- `title` - Tooltip shown on hover

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

- {{< doclink path="configuration/frontend/styling/" text="Configure styling" />}}
- {{< doclink path="configuration/frontend/themes/" text="Set up themes" />}}
- {{< doclink path="configuration/frontend/interface/" text="Interface options" />}}

