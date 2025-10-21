---
title: "Themes"
description: "User-selectable custom themes"
icon: "color_lens"
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

### "Reduced Rounded Corners" Theme

You can view the included by default theme [here on github](https://github.com/gtsteffaniak/filebrowser/blob/main/backend/reduce-rounded-corners.css) to see how it works.

You can also override variables provided by filebrowser:

```
    /* Basic Styles */
    :root {
      --background: {{ .htmlVars.lightBackground }};
      --alt-background: #ddd;
      --surfacePrimary: gray;
      --surfaceSecondary: lightgray;
      --textPrimary: #546e7a;
      --textSecondary: gray;
      --iconBackground: #dddddd;
      --activeWhiteIcon: gray;
    }
    .dark-mode {
      --background: {{ .htmlVars.darkBackground }};
      --alt-background: #283136;
      --surfacePrimary: #20292F;
      --surfaceSecondary: #3A4147;
      --divider: rgba(255, 255, 255, 0.12);
      --textPrimary: rgba(255, 255, 255, 0.87);
      --textSecondary: rgba(255, 255, 255, 0.6);
      --iconBackground: #1e1f20;
      --activeWhiteIcon: white;
    }
```

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

- {{< doclink path="configuration/frontend/styling/" text="Configure styling" />}}
- {{< doclink path="configuration/frontend/branding/" text="Configure branding" />}}
- {{< doclink path="configuration/frontend/interface/" text="Interface options" />}}

