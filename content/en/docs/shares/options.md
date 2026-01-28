---
title: "Common Options"
description: "Options available to all share types"
icon: "checklist"
order: 2
---

Configuration options available to both normal and upload shares. These options appear in the share creation dialog when you click the share button.

## Basic Settings

### Share Duration

<div class="option-field">
  <label>Share Duration</label>
  <div class="field-group">
    <input type="number" placeholder="0" />
    <select>
      <option>minutes</option>
      <option>hours</option>
      <option>days</option>
    </select>
  </div>
  <p class="help-text">Duration before the share expires. Leave blank for a permanent share.</p>
</div>

**Available time units:** minutes, hours, days

### Optional Password

<div class="option-field">
  <label>Optional Password</label>
  <input type="password" />
  <p class="help-text">Optional password required to access this share, including authenticated users.</p>
</div>

### Share Type

<div class="option-field">
  <label>Share Type</label>
  <select>
    <option>Normal</option>
    <option>Upload only</option>
  </select>
  <p class="help-text">The type of share to create. Normal shares allow viewing and downloading files. Upload shares allow uploading files to the share.</p>
</div>

## Access Control

### Disable Anonymous Access

<div class="option-field">
  <label>
    <input type="checkbox" /> Disable anonymous access
  </label>
  <p class="help-text">Only authenticated users can access the share. The user must have access to the source of the share.</p>
</div>

### Only Share to Certain Users

<div class="option-field">
  <label>
    <input type="checkbox" /> Only share to certain users
  </label>
  <p class="help-text">Only the specified users can access the share. The user must have access to the source of the share.</p>
  <input type="text" placeholder="Enter usernames, comma-separated" />
</div>

When enabled, enter comma-separated usernames (e.g., `john, mary, admin`).

## Appearance

### Enforce Theme Mode

<div class="option-field">
  <label>Enforce theme mode</label>
  <select>
    <option>Use user preference</option>
    <option>Dark</option>
    <option>Light</option>
  </select>
  <p class="help-text">Force a specific theme mode (dark or light) for this share, overriding user preferences.</p>
</div>

### Share Theme

<div class="option-field">
  <label>Share Theme</label>
  <select>
    <option>Default theme</option>
    <option>Custom themes...</option>
  </select>
  <p class="help-text">The theme to use for the share link.</p>
</div>

Choose from available themes configured in your FileBrowser instance.

### Default View Mode

<div class="option-field">
  <label>Default view mode</label>
  <select>
    <option>Normal View</option>
    <option>List View</option>
    <option>Compact View</option>
    <option>Gallery View</option>
  </select>
  <p class="help-text">Set the default view mode for anonymous users viewing this share. Logged-in users can still change their view preference.</p>
</div>

{{% alert context="info" %}}
Only available for normal shares.
{{% /alert %}}

## Advanced Options

These options are available under the **Show More** section:

### Keep After Expiration

<div class="option-field">
  <label>
    <input type="checkbox" /> Do not delete share after it expires
  </label>
  <p class="help-text">The share will not be deleted after it expires. This is useful if you want to extend a share's expiration or edit it further after it expires.</p>
</div>

### Interface Options

<div class="option-field">
  <label>
    <input type="checkbox" /> Disable Thumbnails
  </label>
  <p class="help-text">Preview thumbnails will not be shown in the share.</p>
</div>

<div class="option-field">
  <label>
    <input type="checkbox" /> Hide navigation buttons
  </label>
  <p class="help-text">Hide the navigation buttons on the navbar in the share to create a minimalistic look.</p>
</div>

<div class="option-field">
  <label>
    <input type="checkbox" /> Disable share card
  </label>
  <p class="help-text">Disable the share card on the shared page in the sidebar or at the top of the page on mobile.</p>
</div>

<div class="option-field">
  <label>
    <input type="checkbox" /> Disable sidebar
  </label>
  <p class="help-text">Disable the sidebar on the shared page.</p>
</div>

{{% alert context="info" %}}
Some interface options only apply to normal shares.
{{% /alert %}}

### Download Controls

<div class="option-field">
  <label>Downloads Limit</label>
  <input type="number" placeholder="Leave empty for unlimited" />
  <p class="help-text">The maximum number of times any file/folder from the share can be downloaded. Leave empty for unlimited.</p>
</div>

<div class="option-field">
  <label>
    <input type="checkbox" /> Apply the downloads limit to each user
  </label>
  <p class="help-text">When enabled, the downloads limit will be applied to each user. Anonymous users will not be able to download any files from this share.</p>
</div>

<div class="option-field">
  <label>Max Bandwidth</label>
  <input type="number" placeholder="kbps" />
  <p class="help-text">The maximum download bandwidth in kbps. Leave empty for unlimited.</p>
</div>

### Feature Toggles

<div class="option-field">
  <label>
    <input type="checkbox" /> Disable File Viewer
  </label>
  <p class="help-text">Disable the built-in file viewer for this share.</p>
</div>

<div class="option-field">
  <label>
    <input type="checkbox" /> Show Quick Download
  </label>
  <p class="help-text">Display quick download buttons for files in the share.</p>
</div>

<div class="option-field">
  <label>
    <input type="checkbox" /> Extract embedded subtitles
  </label>
  <p class="help-text">Extract embedded subtitles from media files on load -- this can be slow for large files.</p>
</div>

### OnlyOffice Integration

If OnlyOffice is configured:

<div class="option-field">
  <label>
    <input type="checkbox" /> Enable OnlyOffice viewer
  </label>
  <p class="help-text">Allow viewing office files using OnlyOffice in this share.</p>
</div>

<div class="option-field">
  <label>
    <input type="checkbox" /> Enable OnlyOffice editing
  </label>
  <p class="help-text">Allow editing of office files using OnlyOffice in this share.</p>
</div>

## Customization

Additional branding options (see {{< doclink path="shares/customization/" text="Customization" />}} for detailed examples):

### Theme Color

<div class="option-field">
  <label>Share Theme Color</label>
  <input type="text" placeholder="e.g., red, #0ea5e9, rgb(14,165,233)" />
  <p class="help-text">CSS color value applied to the share's theme.</p>
</div>

### Page Metadata

<div class="option-field">
  <label>Share Title</label>
  <input type="text" placeholder="Custom page title" />
  <p class="help-text">Custom page title shown on the share page.</p>
</div>

<div class="option-field">
  <label>Share Description</label>
  <textarea placeholder="Short description"></textarea>
  <p class="help-text">Short description shown on the share page (may be used in meta tags).</p>
</div>

### Custom Assets

<div class="option-field">
  <label>Share Banner</label>
  <input type="text" placeholder="https://domain.com/banner.png or /path/to/banner.png" />
  <p class="help-text">Banner image URL or path accessible by the client.</p>
</div>

<div class="option-field">
  <label>Share Favicon</label>
  <input type="text" placeholder="https://domain.com/favicon.png or /path/to/favicon.png" />
  <p class="help-text">Favicon URL or path accessible by the client.</p>
</div>

Paths can be absolute URLs (`https://domain.com/image.png`) or index paths (`/path/to/image.png`).

## Share Expiration Behavior

By default, share links are permanent. When you set an expiration:

1. The share becomes inaccessible after the expiration time
2. Expired shares are automatically removed during system startup
3. Enable **Keep After Expiration** to retain expired shares in your list

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

- {{< doclink path="shares/customization/" text="Customize appearance" />}}
- {{< doclink path="shares/normal/" text="Normal shares" />}}
- {{< doclink path="shares/upload/" text="Upload shares" />}}

<style>
/* Light mode (default) */
.option-field {
  margin: 1.5em 0;
  padding: 1em;
  border-left: 3px solid var(--primary, #0ea5e9);
  background: rgba(14, 165, 233, 0.06);
  border-radius: 4px;
}

.option-field label {
  font-weight: 600;
  display: block;
  margin-bottom: 0.5em;
  color: var(--text-default);
}

.option-field input[type="checkbox"] {
  margin-right: 0.5em;
}

.option-field input[type="text"],
.option-field input[type="password"],
.option-field input[type="number"],
.option-field textarea,
.option-field select {
  width: 100%;
  padding: 0.5em;
  border: 1px solid var(--gray-400);
  border-radius: 4px;
  font-family: inherit;
  background: var(--white);
  color: var(--text-default);
}

.option-field textarea {
  min-height: 80px;
  resize: vertical;
}

.field-group {
  display: flex;
  gap: 0.5em;
}

.field-group input {
  flex: 2;
}

.field-group select {
  flex: 1;
}

.help-text {
  margin-top: 0.5em;
  font-size: 0.9em;
  color: var(--text-muted);
  font-style: italic;
}

/* Dark mode support using theme's selector */
[data-dark-mode] .option-field {
  background: rgba(14, 165, 233, 0.12);
}

[data-dark-mode] .option-field input[type="text"],
[data-dark-mode] .option-field input[type="password"],
[data-dark-mode] .option-field input[type="number"],
[data-dark-mode] .option-field textarea,
[data-dark-mode] .option-field select {
  background: var(--surfaceSecondary);
  border: 1px solid var(--gray-700);
  color: var(--text-default);
}

[data-dark-mode] .option-field input[type="text"]::placeholder,
[data-dark-mode] .option-field input[type="password"]::placeholder,
[data-dark-mode] .option-field input[type="number"]::placeholder,
[data-dark-mode] .option-field textarea::placeholder {
  color: var(--text-muted);
}
</style>
