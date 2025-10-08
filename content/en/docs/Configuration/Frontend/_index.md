---
title: "Frontend Customization"
description: "Customize the user interface"
icon: "palette"
weight: 6
---

Customize the FileBrowser interface with branding, themes, and styling.

## Configuration Overview

```yaml
frontend:
  name: "My FileBrowser"
  description: "Company file storage"
  favicon: "/path/to/favicon.png"
  disableDefaultLinks: false
  disableUsedPercentage: false
  disableNavButtons: false
  externalLinks:
    - text: "Documentation"
      title: "View docs"
      url: "https://docs.example.com"
  styling:
    customCSS: "custom.css"
    lightBackground: "white"
    darkBackground: "#141D24"
    customThemes:
      default:
        description: "Default theme"
        css: "theme.css"
```

## Topics

- [Branding](branding/) - Name, description, favicon, external links
- [Styling](styling/) - Custom CSS and background colors
- [Themes](themes/) - User-selectable themes
- [Interface Options](interface/) - Toggle UI elements

## Quick Examples

**Simple branding**:
```yaml
frontend:
  name: "Company Files"
  description: "Secure file storage"
```

**Custom styling**:
```yaml
frontend:
  styling:
    customCSS: "custom.css"
    lightBackground: "#f5f5f5"
    darkBackground: "#1a1a1a"
```

## Next Steps

- [Configure branding](/docs/configuration/frontend/branding/)
- [Set up themes](/docs/configuration/frontend/themes/)

