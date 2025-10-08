---
title: "Customization"
description: "Branding and appearance options"
icon: "auto_awesome"
weight: 4
---

Customize share appearance with branding elements, colors, and custom content.

## Customization Options

Available customization options for shares:

| Option | Type | Description |
|--------|------|-------------|
| `themeColor` | string | Primary color (hex codes) |
| `banner` | string | Custom banner text or HTML |
| `title` | string | HTML page title (browser tab) |
| `description` | string | Meta description (link previews) |
| `favicon` | string | Custom favicon URL |

## Theme Color

Set the primary color for the share page using hex color format:

```json
{
  "themeColor": "#0066cc"
}
```

This color is applied to:
- Buttons and interactive elements
- Links and accents
- Progress indicators
- Active states

## Banner

Display a custom banner at the top of the share page. Supports both plain text and HTML.

### Simple Text Banner

```json
{
  "banner": "Please download the files below"
}
```

### HTML Banner

```json
{
  "banner": "<h2>Welcome to Our File Share</h2>"
}
```

### Styled HTML Banner

```json
{
  "banner": "<div style='background:#f0f0f0;padding:1em;'>Important: Files expire in 24 hours</div>"
}
```

### Banner with Logo

```json
{
  "banner": "<img src='https://company.com/logo.png' width='200'><br><strong>Confidential Files</strong>"
}
```

## Title

Set the HTML page title that appears in browser tabs and bookmarks:

```json
{
  "title": "Q4 Financial Reports"
}
```

**Default if not set**:
- Normal share: `"Share - {filename}"`
- Upload share: `"Upload Files"`

## Description

Set the meta description used for link previews on social media and messaging apps:

```json
{
  "description": "Financial reports for Q4 2025 - Company confidential"
}
```

**Default values**:
- Normal share: `"View and download shared files"`
- Upload share: `"Upload files to this shared location"`

## Favicon

Set a custom favicon for the share page:

```json
{
  "favicon": "https://example.com/logo.png"
}
```

**Requirements**:
- Must be a publicly accessible URL
- Recommended sizes: 16x16, 32x32, or 48x48 pixels
- Supported formats: `.ico`, `.png`, `.svg`

## Complete Branding Examples

### Corporate Share

```json
{
  "shareType": "normal",
  "path": "/client-deliverables",
  "source": "files",
  "themeColor": "#003366",
  "title": "Acme Corp - Secure File Transfer",
  "description": "Secure file sharing portal",
  "banner": "<img src='https://acme.com/logo.png' width='200'><br><strong>Confidential Files</strong>",
  "favicon": "https://acme.com/favicon.ico"
}
```

### Event File Collection

```json
{
  "shareType": "upload",
  "themeColor": "#28a745",
  "title": "Event Photos Upload",
  "description": "Share your photos from the company event",
  "banner": "<h2>📸 Company Event 2025</h2><p>Upload your photos here!</p>",
  "expires": "30",
  "unit": "days"
}
```

### Client Portal

```json
{
  "shareType": "normal",
  "themeColor": "#6c757d",
  "title": "Client Portal - ABC Project",
  "description": "Project files and documentation",
  "banner": "<h3>ABC Project Files</h3><p>Last updated: January 2025</p>",
  "disableShareCard": true,
  "viewMode": "list"
}
```

### Branded Project Delivery

```json
{
  "shareType": "normal",
  "path": "/projects/alpha",
  "themeColor": "#0066cc",
  "title": "Project Alpha Deliverables",
  "description": "Final deliverables for Project Alpha",
  "banner": "<h2>Project Alpha</h2><p>All files are confidential</p>",
  "favicon": "https://company.com/favicon.png",
  "password": "alpha2025",
  "expires": "7",
  "unit": "days"
}
```

### Marketing Materials

```json
{
  "shareType": "normal",
  "themeColor": "#e91e63",
  "title": "Marketing Assets Q1 2025",
  "description": "Downloadable marketing materials and brand assets",
  "banner": "<h2>Brand Assets</h2><p>For internal use only</p>",
  "quickDownload": true,
  "viewMode": "gallery"
}
```

## Best Practices

### Color Selection
- Use hex color codes (`#0066cc`)
- Match your brand colors
- Ensure sufficient contrast for readability
- Test in both light and dark modes

### Banner Content
- Keep it concise and relevant
- Use HTML for better formatting
- Include important instructions or deadlines
- Consider responsive design for mobile

### Title and Description
- Use clear, descriptive titles
- Keep descriptions under 160 characters
- Include relevant keywords
- Consider SEO if publicly shared

### Favicon
- Use consistent branding across all shares
- Ensure favicon is accessible from share URL
- Test favicon appears correctly in browsers
- Use appropriate image format and size

## Security Considerations

When using custom HTML in banners:
- Avoid including sensitive information
- Don't embed third-party scripts
- Use HTTPS URLs for images and resources
- Test for XSS vulnerabilities

## Next Steps

- [Common options](/docs/shares/options/)
- [Normal shares](/docs/shares/normal/)
- [Upload shares](/docs/shares/upload/)
