---
title: "Styling"
description: "Custom CSS and background colors"
icon: "brush"
---

Apply custom CSS and configure background colors for light/dark modes.

## Configuration

```yaml
frontend:
  styling:
    customCSS: "custom.css"
    lightBackground: "white"
    darkBackground: "#141D24"
```

## Options

| Option | Default | Description |
|--------|---------|-------------|
| `customCSS` | "" | Path to CSS file applied to all users |
| `lightBackground` | Default | Background color for light mode (CSS color value) |
| `darkBackground` | `#141D24` | Background color for dark mode (CSS color value) |

## Custom CSS

Apply CSS file to all users:

```yaml
frontend:
  styling:
    customCSS: "custom.css"
```

Place `custom.css` in your working directory or provide full path.

**How it works**: CSS content is injected into `<style>` tag in HTML `<head>`:

```html
<style>
  {{ .htmlVars.customCSS }}
</style>
```

## Background Colors

### Light Background

Default background for light mode:

```yaml
frontend:
  styling:
    lightBackground: "#f5f5f5"
```

Accepts any valid CSS color:
- Hex: `"#f5f5f5"`
- RGB: `"rgb(245, 245, 245)"`
- Named: `"white"`, `"lightgray"`

Applied as CSS variable:
```css
:root {
  --background: {{ .htmlVars.lightBackground }};
}
```

### Dark Background

Default background for dark mode:

```yaml
frontend:
  styling:
    darkBackground: "#1a1a1a"
```

Applied to dark mode class:
```css
.dark-mode {
  --background: {{ .htmlVars.darkBackground }};
}
```

## CSS Examples

### Reduce Rounded Corners

`custom.css`:
```css
.card, .btn, input, select {
  border-radius: 4px !important;
}
```

### Custom Primary Colors

```css
:root {
  --primary-color: #007bff;
  --secondary-color: #6c757d;
  --success-color: #28a745;
}
```

### Hide Specific Elements

```css
.file-size {
  display: none !important;
}
```

### Corporate Branding

```css
header {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
}

.btn-primary {
  background-color: #667eea;
  border-color: #667eea;
}
```

## Complete Example

```yaml
frontend:
  styling:
    customCSS: "acme-brand.css"
    lightBackground: "#ffffff"
    darkBackground: "#002244"
```

`acme-brand.css`:
```css
/* Corporate colors */
:root {
  --primary-color: #0066cc;
  --secondary-color: #ff6600;
}

/* Reduce border radius */
* {
  border-radius: 2px !important;
}

/* Custom header styling */
header {
  font-weight: 600;
  letter-spacing: 0.5px;
}
```

## CSS Variable Reference

Available CSS variables:

**Light mode**:
```css
:root {
  --background: /* from lightBackground */
  --alt-background: #ddd;
  --surfacePrimary: gray;
  --surfaceSecondary: lightgray;
  --textPrimary: #546e7a;
  --textSecondary: gray;
}
```

**Dark mode**:
```css
.dark-mode {
  --background: /* from darkBackground */
  --alt-background: #283136;
  --surfacePrimary: #20292F;
  --surfaceSecondary: #3A4147;
  --textPrimary: rgba(255, 255, 255, 0.87);
  --textSecondary: rgba(255, 255, 255, 0.6);
}
```

## Next Steps

- {{< doclink path="configuration/frontend/themes/" text="Set up themes" />}}
- {{< doclink path="configuration/frontend/branding/" text="Configure branding" />}}
- {{< doclink path="configuration/frontend/interface/" text="Interface options" />}}

