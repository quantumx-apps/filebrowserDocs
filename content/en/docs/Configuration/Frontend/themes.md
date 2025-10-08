---
title: "Themes"
description: "User-selectable custom themes"
icon: "color_lens"
weight: 3
---

Create custom themes that users can select in their settings.

## Configuration

```yaml
frontend:
  styling:
    customThemes:
      default:
        description: "Default Theme"
        css: "default-theme.css"
      dark-blue:
        description: "Dark Blue"
        css: "dark-blue.css"
      corporate:
        description: "Corporate Theme"
        css: "corporate.css"
```

## How Themes Work

1. Define themes in `customThemes` map (key = theme ID)
2. Users select theme in **Settings** → **Profile**
3. Selected theme CSS is injected into HTML:

```html
<style>
  {{ .htmlVars.userSelectedTheme }}
</style>
```

## Theme Structure

Each theme requires:
- **Key**: Unique theme identifier (used internally)
- **description**: Display name shown to users
- **css**: Path to CSS file

```yaml
customThemes:
  theme-id:                        # Key (unique identifier)
    description: "Theme Name"      # Display name
    css: "path/to/theme.css"       # CSS file path
```

## Default Theme

Theme with key `"default"` is automatically applied to all logged-in users:

```yaml
customThemes:
  default:
    description: "Company Theme"
    css: "company-theme.css"
```

This overrides the default styling for all users who haven't selected a different theme.

## Creating Themes

### Minimal Theme

`minimal.css`:
```css
/* Simplified interface */
.card {
  box-shadow: none;
  border: 1px solid #e0e0e0;
}

.btn {
  border-radius: 2px;
}
```

### Dark Theme

`dark-theme.css`:
```css
/* Force dark colors */
body {
  background: #1a1a1a;
  color: #e0e0e0;
}

.card {
  background: #2d2d2d;
  border-color: #404040;
}
```

### Corporate Theme

`corporate.css`:
```css
/* Company branding */
:root {
  --primary-color: #0066cc;
  --secondary-color: #ff6600;
}

header {
  background: linear-gradient(135deg, #0066cc, #004999);
}

.btn-primary {
  background-color: #0066cc;
}
```

## Complete Example

```yaml
frontend:
  styling:
    customThemes:
      default:
        description: "Standard"
        css: "standard.css"
      high-contrast:
        description: "High Contrast"
        css: "high-contrast.css"
      minimal:
        description: "Minimal"
        css: "minimal.css"
      dark-blue:
        description: "Dark Blue"
        css: "dark-blue.css"
```

## User Experience

Users see themes in **Settings**:
1. Go to **Settings** → **Profile**
2. Select theme from dropdown
3. Theme applies immediately
4. Selection persists across sessions

## Theme Precedence

CSS is applied in this order (later overrides earlier):

1. Base application styles
2. `customCSS` (applies to all users)
3. Background colors (`lightBackground`, `darkBackground`)
4. User-selected theme (`userSelectedTheme`)

## Best Practices

**Theme naming**: Use descriptive keys
```yaml
# Good
light-modern:
  description: "Modern Light"

# Avoid
theme1:
  description: "Theme 1"
```

**Provide variety**: Offer different color schemes and densities
```yaml
customThemes:
  default: ...          # Default for all users
  compact: ...          # Dense/compact layout
  high-contrast: ...    # Accessibility
  dark: ...             # Dark mode variant
```

**Use CSS variables**: Makes themes more maintainable
```css
/* In theme CSS */
:root {
  --primary: #0066cc;
  --secondary: #ff6600;
}

.btn-primary {
  background: var(--primary);
}
```

## Combining with Custom CSS

Both `customCSS` and themes can be used together:

```yaml
frontend:
  styling:
    customCSS: "base-corporate.css"  # Applied to all users
    customThemes:
      default:
        description: "Light"
        css: "light-variant.css"     # User choice
      dark:
        description: "Dark"
        css: "dark-variant.css"      # User choice
```

## Next Steps

- [Configure styling](/docs/configuration/frontend/styling/)
- [Configure branding](/docs/configuration/frontend/branding/)
- [Interface options](/docs/configuration/frontend/interface/)

