---
title: "Customization"
description: "Branding and appearance options"
icon: "auto_awesome"
date: "2025-10-08T14:59:30Z"
lastmod: "2026-04-21T20:01:57Z"
order: 1
---

Customize share appearance with branding elements, colors, and custom content. These options appear in the **Advanced options** section of the share creation dialog.

## Customization options

{{< fb-prompt-mock >}}

{{< fb-field label="Share Theme Color" type="text" placeholder="e.g., red, rgb(33,150,243)" help="CSS color value applied to the share theme." />}}

{{< fb-field label="Share Title" type="text" placeholder="Custom page title" help="Custom page title shown on the share page." />}}

{{< fb-field label="Share Description" type="textarea" placeholder="Short description" help="Short description shown on the share page (may be used in meta tags)." />}}

{{< fb-field label="Share Banner" type="text" placeholder="https://domain.com/banner.png or /path/to/banner.png" help="Banner image URL or path accessible by the client." />}}

{{< fb-field label="Share Favicon" type="text" placeholder="https://domain.com/favicon.png or /path/to/favicon.png" help="Favicon URL or path accessible by the client." />}}

{{< /fb-prompt-mock >}}

The theme color is applied to:
- Buttons and interactive elements
- Links and accents
- Progress indicators
- Active states
- Navigation highlights

**Examples:**
- Hex: `#0066cc`, `#e91e63`
- RGB: `rgb(0, 102, 204)`
- Named colors: `red`, `blue`, `green`

### Page title

The title appears in:
- Browser tabs
- Bookmarks
- Browser history
- Window titles

**Default if not set:**
- Normal share: `"Shared files - {filename}"`
- Upload share: `"Upload Files"`

**Examples:**
- `"Q4 Financial Reports"`
- `"Project Alpha Deliverables"`
- `"Event Photos Upload"`

### Page description

The description is used for:
- Social media link previews
- Messaging app previews
- Search engine results
- Browser tooltips

**Default values:**
- Normal share: `"A share has been sent to you to view or download."`
- Upload share: `"A share has been sent to you to upload files."`

**Best practices:**
- Keep under 160 characters
- Include relevant keywords
- Be descriptive and clear
- Avoid sensitive information

### Custom banner

Display a custom banner at the top of the share page. Supports both plain text and HTML.

**Image URLs:**
- Absolute: `https://company.com/banner.png`
- Index path: `/images/banner.png`

### Custom favicon

Set a custom favicon that appears in browser tabs and bookmarks.

**URL formats:**
- Absolute: `https://example.com/favicon.ico`
- Index path: `/icons/favicon.png`

**Requirements:**
- Must be publicly accessible by clients
- Recommended sizes: 16x16, 32x32, or 48x48 pixels
- Supported formats: `.ico`, `.png`, `.svg`

## Common Use Cases

### Password-Protected Client Delivery

Combine customization with security:
- Set theme color to match client branding
- Add banner with instructions for password
- Set descriptive title and description
- Enable password protection
- Set expiration date

### Public File Gallery

Create an attractive public gallery:
- Add banner with description
- Enforce gallery view mode

### Internal Document Portal

Professional internal sharing:
- Use corporate theme color
- Add banner with department info
- Restrict to allowed usernames
- Disable anonymous access
- Keep after expiration for auditing

## Next Steps

- {{< doclink path="shares/options/" text="Common options" />}}
- {{< doclink path="shares/normal-shares/" text="Normal shares" />}}
- {{< doclink path="shares/upload-shares/" text="Upload shares" />}}

