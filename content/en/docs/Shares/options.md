---
title: "Common Options"
description: "Options available to all share types"
icon: "checklist"
weight: 3
---

{{% alert context="info" %}}
**Note:** requires version v0.8.0 or higher
{{% /alert %}}


Configuration options available to both normal and upload shares.

## Access Control Options

Options that control who can access the share and for how long.

### Password Protection

Set a password to restrict access:

```json
{
  "password": "secret123"
}
```

Users must enter the password before accessing the content.

### Expiration Time

Set the link to expire after a certain time:

```json
{
  "expires": "24",
  "unit": "hours"
}
```

**Time units**: `"minutes"`, `"hours"`, `"days"`, `"months"`, `"years"`

**Permanent share** (no expiration):
```json
{
  "expires": "0"
}
```

### Disable Anonymous Access

Require users to be logged in:

```json
{
  "disableAnonymous": true
}
```

This restricts access to authenticated users only.

### Allowed Usernames

Specify which users can access the share:

```json
{
  "allowedUsernames": ["user1", "user2", "user3"]
}
```

Useful for controlled access within your organization.

## Interface Options

Customize the appearance and behavior of the share page.

### Hide Navigation Buttons

Remove back/forward navigation buttons:

```json
{
  "hideNavButtons": true
}
```

Simplifies the interface for focused file access.

### Disable Share Card

Hide the share information card:

```json
{
  "disableShareCard": true
}
```

Provides a cleaner, more focused view without share details.

### Keep After Expiration

Keep the share link in your list even after it expires:

```json
{
  "keepAfterExpiration": true
}
```

By default, expired links are automatically removed. Enable this to track expired shares or renew them later.

## Theme Options

Control the visual appearance of the share.

### Share Theme

Select a specific theme:

```json
{
  "shareTheme": "dark-blue"
}
```

Choose from available themes configured in your FileBrowser instance.

### Enforce Dark/Light Mode

Force the share to display in a specific mode:

**Dark mode**:
```json
{
  "enforceDarkLightMode": "dark"
}
```

**Light mode**:
```json
{
  "enforceDarkLightMode": "light"
}
```

**Auto-detect** (user's system preference):
```json
{
  "enforceDarkLightMode": "default"
}
```

## Customization Options

Additional branding and appearance options (see [Customization](/docs/shares/customization/) for details):

- `themeColor` - Primary color (hex codes)
- `banner` - Custom banner text or HTML
- `title` - HTML page title (browser tab)
- `description` - Meta description (link previews)
- `favicon` - Custom favicon URL

## Complete Example

Share with multiple common options:

```json
{
  "shareType": "normal",
  "path": "/documents/report.pdf",
  "source": "files",
  "password": "report2025",
  "expires": "48",
  "unit": "hours",
  "disableAnonymous": false,
  "allowedUsernames": [],
  "hideNavButtons": false,
  "disableShareCard": false,
  "keepAfterExpiration": true,
  "shareTheme": "default",
  "enforceDarkLightMode": "default"
}
```

## Share Expiration Behavior

By default, share links are permanent. When you set an expiration:

1. The share becomes inaccessible after the expiration time
2. Expired shares are automatically removed during system startup
3. Use `keepAfterExpiration: true` to retain expired shares in your list

This allows you to:
- Track how many times expired shares were accessed
- Easily re-enable expired shares with new expiration dates
- Maintain a history of shares for audit purposes

## Security Best Practices

1. **Use Password Protection** for sensitive content
2. **Set Expiration Dates** for temporary shares
3. **Use Allowed Usernames** for controlled organizational access
4. **Disable Anonymous Access** for internal company shares
5. **Keep After Expiration** for tracking and auditing

## Next Steps

- [Customize appearance](/docs/shares/customization/)
- [Normal shares](/docs/shares/normal/)
- [Upload shares](/docs/shares/upload/)
