---
title: "Interface Options"
description: "Toggle UI elements"
icon: "tune"
weight: 4
---

Show or hide specific UI elements.

## Configuration

```yaml
frontend:
  disableDefaultLinks: false
  disableUsedPercentage: false
  disableNavButtons: false
```

## Options

| Option | Default | Description |
|--------|---------|-------------|
| `disableDefaultLinks` | `false` | Hide default sidebar links |
| `disableUsedPercentage` | `false` | Hide storage usage indicators |
| `disableNavButtons` | `false` | Hide back/forward navigation buttons |

## Disable Default Links

Hide built-in sidebar links:

```yaml
frontend:
  disableDefaultLinks: true
```

Use with `externalLinks` to show only custom links.

## Disable Used Percentage

Hide storage usage indicators for sources:

```yaml
frontend:
  disableUsedPercentage: true
```

Useful when disk usage info is not relevant or accurate.

## Disable Nav Buttons

Hide back/forward navigation buttons:

```yaml
frontend:
  disableNavButtons: true
```

Creates cleaner, simpler interface.

## Examples

### Minimal Interface

```yaml
frontend:
  disableDefaultLinks: true
  disableUsedPercentage: true
  disableNavButtons: true
```

### Custom Links Only

```yaml
frontend:
  disableDefaultLinks: true
  externalLinks:
    - text: "Home"
      title: "Go home"
      url: "https://company.com"
    - text: "Support"
      title: "Get help"
      url: "https://support.company.com"
```

## Next Steps

- [Configure branding](/docs/configuration/frontend/branding/)
- [Configure styling](/docs/configuration/frontend/styling/)

