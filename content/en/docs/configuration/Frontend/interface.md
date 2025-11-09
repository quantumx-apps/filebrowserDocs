---
title: "Interface Options"
description: "Change characteristics of the UI"
icon: "tune"
---

Show or hide specific UI elements.

## Configuration

```yaml
frontend:
  disableDefaultLinks: false   # hides the default filebrowser links on the sidebar
  disableUsedPercentage: false # hides the used-percentage bar for each source on the sidebar
  disableNavButtons: false     # disables nav buttons on the header bar for clean minimalistic look
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

### Default Links

<img src="../images/sidebar-links-default.jpg" width=300px>

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

- {{< doclink path="configuration/frontend/branding/" text="Configure branding" />}}
- {{< doclink path="configuration/frontend/styling/" text="Configure styling" />}}

