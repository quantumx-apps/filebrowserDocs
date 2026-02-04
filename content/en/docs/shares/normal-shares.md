---
title: "Normal Shares"
description: "Standard shares with viewing capabilities"
icon: "folder_shared"
order: 3
---

Standard shares with full viewing and downloading capabilities for shared files and directories.

## What Normal Shares Include

Normal shares provide:
- **File and directory browsing** - Navigate through folders
- **File viewing in browser** - Preview files without downloading
- **File downloading** - Download individual files or entire folders
- **Thumbnail previews** - Image thumbnails for quick identification
- **Quick download buttons** - One-click download actions (optional)
- **OnlyOffice integration** - View and edit office documents (optional)

## How to Create a Normal Share

1. Navigate to the file or directory you want to share
2. Click the **Share** button in the actions menu
3. Ensure **Share Type** is set to `Normal` (default)
4. Configure your desired options
5. Click **Share** to generate the link
6. Copy and share the generated URL

## Normal Share-Specific Options

These options **only apply** to normal shares and appear in the share creation dialog:

### File Viewer Control

<div class="option-field">
  <label>
    <input type="checkbox" /> Disable File Viewer
  </label>
  <p class="help-text">Prevent viewing files in the browser - users can only download files.</p>
</div>

**Use case:** Force downloads for security or when you don't want files viewed in-browser.

### Quick Download

<div class="option-field">
  <label>
    <input type="checkbox" /> Show Quick Download
  </label>
  <p class="help-text">Display quick download buttons for files in the share.</p>
</div>

**Use case:** Make it easier for users to download files with a prominent button.

### Download Limits

<div class="option-field">
  <label>Downloads Limit</label>
  <input type="number" placeholder="0 = unlimited" />
  <p class="help-text">The maximum number of times any file/folder from the share can be downloaded. Leave empty for unlimited.</p>
</div>

<div class="option-field">
  <label>
    <input type="checkbox" /> Apply the downloads limit to each user
  </label>
  <p class="help-text">When enabled, the downloads limit will be applied to each user. Anonymous users will not be able to download any files from this share.</p>
</div>

**Global limit:** All users share the same download counter.
**Per-user limit:** Each authenticated user gets their own counter. Anonymous users are blocked.

### Bandwidth Control

<div class="option-field">
  <label>Max Bandwidth</label>
  <input type="number" placeholder="kbps" />
  <p class="help-text">The maximum download bandwidth in kbps. Leave empty for unlimited.</p>
</div>

**Example:** Enter `1024` for 1 MB/s (1024 kbps) bandwidth limit.

### View Mode

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

**View modes:**
- **Normal** - Standard grid with icons and names
- **List** - Detailed list with file information
- **Compact** - Dense grid for many files
- **Gallery** - Large thumbnails, perfect for images

### Interface Customization

<div class="option-field">
  <label>
    <input type="checkbox" /> Disable Thumbnails
  </label>
  <p class="help-text">Preview thumbnails will not be shown in the share.</p>
</div>

<div class="option-field">
  <label>
    <input type="checkbox" /> Disable sidebar
  </label>
  <p class="help-text">Disable the sidebar on the shared page.</p>
</div>

**Use case:** Create a cleaner, more focused interface for file access.

### Media Features

<div class="option-field">
  <label>
    <input type="checkbox" /> Extract embedded subtitles
  </label>
  <p class="help-text">Extract embedded subtitles from media files on load -- this can be slow for large files.</p>
</div>

{{% alert context="warning" %}}
Extracting subtitles is IO-intensive and can take 10-30 seconds for large video files.
{{% /alert %}}

### File Permissions

Control what actions users can perform on files in the share:

<div class="option-field">
  <label>
    <input type="checkbox" /> Allow Modify
  </label>
  <p class="help-text">Allow editing and modifying files in the share.</p>
</div>

<div class="option-field">
  <label>
    <input type="checkbox" /> Allow Create
  </label>
  <p class="help-text">Allow creating new files and folders, and uploading files to the share.</p>
</div>

<div class="option-field">
  <label>
    <input type="checkbox" /> Allow Delete
  </label>
  <p class="help-text">Allow deleting files and folders from the share.</p>
</div>

<div class="option-field">
  <label>
    <input type="checkbox" /> Allow Replacements
  </label>
  <p class="help-text">Allow replacing existing files when uploading (only applies when Allow Create is enabled).</p>
</div>

### File Visibility

<div class="option-field">
  <label>
    <input type="checkbox" /> Show Hidden Files
  </label>
  <p class="help-text">Show hidden files and folders in the share. On Windows this includes files starting with a dot and Windows hidden files.</p>
</div>

### OnlyOffice Integration

If OnlyOffice is configured on your FileBrowser instance:

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

**Supported formats:** DOCX, XLSX, PPTX, and more office document types.

## Configuration Examples

### Download-Only Share

Force users to download files instead of viewing them in the browser:

<div class="example-card">
  <h4>Download-only configuration</h4>

  <div class="example-field">
    <strong>Share Type:</strong> Normal
  </div>

  <div class="example-field">
    <strong>Options:</strong>
    <ul>
      <li>☑ Disable File Viewer</li>
      <li>☑ Show Quick Download</li>
    </ul>
  </div>

  <div class="example-field">
    <strong>Use case:</strong> Security-sensitive files where you don't want browser caching
  </div>
</div>

### Limited Downloads (Global Counter)

Limit total downloads across all users:

<div class="example-card">
  <h4>Global download limit</h4>

  <div class="example-field">
    <strong>Downloads Limit:</strong> 100
  </div>

  <div class="example-field">
    <strong>Per User Limit:</strong> ☐ Disabled
  </div>

  <div class="example-field">
    <strong>Behavior:</strong> Once 100 downloads occur (from any combination of users), the share stops allowing downloads
  </div>
</div>

### Limited Downloads (Per User)

Each authenticated user gets their own download counter:

<div class="example-card">
  <h4>Per-user download limit</h4>

  <div class="example-field">
    <strong>Downloads Limit:</strong> 5
  </div>

  <div class="example-field">
    <strong>Per User Limit:</strong> ☑ Enabled
  </div>

  <div class="example-field">
    <strong>Behavior:</strong> Each authenticated user can download up to 5 times. Anonymous users cannot download.
  </div>
</div>

### Bandwidth Limited Share

Limit download bandwidth to prevent server overload:

<div class="example-card">
  <h4>Bandwidth control</h4>

  <div class="example-field">
    <strong>Max Bandwidth:</strong> 1024 kbps (1 MB/s)
  </div>

  <div class="example-field">
    <strong>Use case:</strong> Prevent a single download from consuming all server bandwidth
  </div>
</div>

### OnlyOffice Enabled Share

Allow viewing and editing of office documents:

<div class="example-card">
  <h4>Office document collaboration</h4>

  <div class="example-field">
    <strong>Options:</strong>
    <ul>
      <li>☑ Enable OnlyOffice viewer</li>
      <li>☑ Enable OnlyOffice editing</li>
    </ul>
  </div>

  <div class="example-field">
    <strong>Use case:</strong> Share documents that recipients need to review or edit
  </div>
</div>

### Image Gallery

Perfect for sharing photo collections:

<div class="example-card">
  <h4>Image gallery configuration</h4>

  <div class="example-field">
    <strong>View Mode:</strong> Gallery View
  </div>

  <div class="example-field">
    <strong>Options:</strong>
    <ul>
      <li>☐ Disable Thumbnails (keep enabled)</li>
    </ul>
  </div>

  <div class="example-field">
    <strong>Result:</strong> Large, beautiful thumbnail grid perfect for browsing images
  </div>
</div>

### Secure Client Delivery

Password-protected with per-user download tracking:

<div class="example-card">
  <h4>Secure client file delivery</h4>

  <div class="example-field">
    <strong>Password:</strong> client2025
  </div>

  <div class="example-field">
    <strong>Options:</strong>
    <ul>
      <li>☑ Disable File Viewer</li>
      <li>☑ Show Quick Download</li>
    </ul>
  </div>

  <div class="example-field">
    <strong>Downloads Limit:</strong> 1 per user
  </div>

  <div class="example-field">
    <strong>Allowed Users:</strong> client-user
  </div>

  <div class="example-field">
    <strong>Security features:</strong> Password + user restriction + single download
  </div>
</div>

## Public Access URLs

### Share Link

Shared links are accessible via:
```
https://your-domain.com/public/share/{hash}
```

Where `{hash}` is the unique identifier generated for the share.

### Direct Download Links

Download specific files using the `/public/dl` endpoint:

**Single file:**
```
/public/dl/{hash}?files=document.pdf
```

**Multiple files** (use `||` separator):
```
/public/dl/{hash}?files=file1.txt||folder/file2.pdf||images/photo.jpg
```

### Password-Protected Downloads

For password-protected shares, include the token parameter:

```
/public/dl/{hash}?token={authentication-token}&files=file.pdf
```

The token is obtained after entering the correct password on the share page.

## Common Use Cases

### Standard File Sharing

<div class="use-case">
  <strong>Scenario:</strong> Share documents, images, or folders with colleagues or clients<br>
  <strong>Configuration:</strong> Default settings with optional password protection<br>
  <strong>Best for:</strong> General purpose file sharing
</div>

### Client Deliverables

<div class="use-case">
  <strong>Scenario:</strong> Deliver files to clients with tracking<br>
  <strong>Configuration:</strong> Password protection + download limits + expiration<br>
  <strong>Best for:</strong> Professional client file delivery with accountability
</div>

### Public Resources

<div class="use-case">
  <strong>Scenario:</strong> Share company resources, documentation, or media files<br>
  <strong>Configuration:</strong> No password, permanent share, gallery/list view<br>
  <strong>Best for:</strong> Public-facing file repositories
</div>

### Time-Limited Access

<div class="use-case">
  <strong>Scenario:</strong> Share files that expire after a set period<br>
  <strong>Configuration:</strong> Set expiration time (hours/days/weeks)<br>
  <strong>Best for:</strong> Temporary file access, event materials
</div>

### Branded Corporate Shares

<div class="use-case">
  <strong>Scenario:</strong> Professional file sharing with company branding<br>
  <strong>Configuration:</strong> Custom theme color, logo banner, favicon<br>
  <strong>Best for:</strong> Client-facing shares requiring brand consistency
</div>

## Next Steps

- {{< doclink path="shares/upload-shares/" text="Upload shares" />}} - Create upload-only shares
- {{< doclink path="shares/options/" text="Common options" />}} - Options available to all share types
- {{< doclink path="shares/customization/" text="Customization" />}} - Brand your shares with colors and logos

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
.option-field input[type="number"],
.option-field select {
  width: 100%;
  padding: 0.5em;
  border: 1px solid var(--gray-400);
  border-radius: 4px;
  font-family: inherit;
  background: var(--white);
  color: var(--text-default);
}

.help-text {
  margin-top: 0.5em;
  font-size: 0.9em;
  color: var(--text-muted);
  font-style: italic;
}

.example-card {
  margin: 2em 0;
  padding: 1.5em;
  border: 2px solid var(--gray-300);
  border-radius: 8px;
  background: rgba(0, 0, 0, 0.02);
}

.example-card h4 {
  margin-top: 0;
  margin-bottom: 1em;
  color: var(--primary);
  font-size: 1.1em;
}

.example-field {
  margin: 1em 0;
  padding: 0.5em 0;
}

.example-field strong {
  display: inline-block;
  min-width: 140px;
  color: var(--text-default);
}

.example-field ul {
  margin: 0.5em 0 0 0;
  padding-left: 1.5em;
}

.use-case {
  margin: 1em 0;
  padding: 1em;
  background: rgba(14, 165, 233, 0.04);
  border-left: 3px solid var(--primary);
  border-radius: 4px;
}

/* Dark mode support using theme's selector */
[data-dark-mode] .option-field {
  background: rgba(14, 165, 233, 0.12);
}

[data-dark-mode] .option-field input[type="text"],
[data-dark-mode] .option-field input[type="number"],
[data-dark-mode] .option-field select {
  background: var(--surfaceSecondary);
  border: 1px solid var(--gray-700);
  color: var(--text-default);
}

[data-dark-mode] .example-card {
  background: rgba(255, 255, 255, 0.03);
  border-color: var(--gray-700);
}

[data-dark-mode] .use-case {
  background: rgba(14, 165, 233, 0.08);
}
</style>
