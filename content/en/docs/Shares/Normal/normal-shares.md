---
title: "Normal Shares"
description: "Standard shares with viewing capabilities"
icon: "folder_shared"
weight: 1
---

Standard shares with full viewing and downloading capabilities for shared files and directories.

## What Normal Shares Include

Normal shares provide:
- File and directory browsing
- File viewing in browser
- File downloading
- Thumbnail previews
- Quick download buttons (optional)
- OnlyOffice document viewing/editing (optional)

## How to Create a Normal Share

1. Navigate to the file or directory you want to share
2. Click on the "Share" button in the actions menu
3. Ensure **Share Type** is set to `"normal"` (default)
4. Configure the desired options
5. Click "Create" to generate the share link
6. Copy the generated link and share it with others

## Basic Example

```json
{
  "shareType": "normal",
  "path": "/documents",
  "source": "files"
}
```

## Normal Share Options

These options **only apply** to normal shares:

### File Operations
- **Disable File Viewer** - Prevent viewing files in browser (download only)
- **Quick Download** - Enable quick download button for each file
- **Download Limit** - Limit number of downloads (0 = unlimited)
- **Per User Download Limit** - Apply download limit per user instead of globally
- **Max Bandwidth** - Limit bandwidth in bytes per second (0 = unlimited)

### Interface Options
- **View Mode** - Default view: `"normal"`, `"list"`, `"compact"`, `"gallery"`
- **Disable Sidebar** - Remove sidebar from share page
- **Disable Thumbnails** - Don't generate image thumbnails

### Media & Preview
- **Extract Embedded Subtitles** - Extract subtitles from videos (IO-intensive, 10-30s)

### OnlyOffice Integration
- **Enable OnlyOffice** - Enable OnlyOffice document viewer
- **Enable OnlyOffice Editing** - Enable editing (requires OnlyOffice enabled)

## Configuration Examples

### Download-Only Share

Disable file viewer to force downloads:

```json
{
  "shareType": "normal",
  "disableFileViewer": true,
  "quickDownload": true
}
```

### Limited Downloads (Global)

Limit total downloads across all users:

```json
{
  "shareType": "normal",
  "downloadsLimit": 100
}
```

### Limited Downloads (Per User)

Each authenticated user gets their own download counter:

```json
{
  "shareType": "normal",
  "downloadsLimit": 5,
  "perUserDownloadLimit": true
}
```

### Bandwidth Limited

Limit download bandwidth to 1 MB/s:

```json
{
  "shareType": "normal",
  "maxBandwidth": 1048576
}
```

### OnlyOffice Enabled

Allow viewing and editing office documents:

```json
{
  "shareType": "normal",
  "enableOnlyOffice": true,
  "enableOnlyOfficeEditing": true
}
```

### Gallery View

Perfect for image collections:

```json
{
  "shareType": "normal",
  "viewMode": "gallery",
  "disableThumbnails": false
}
```

### Client Delivery (Secure)

Password protected with limited downloads per user:

```json
{
  "shareType": "normal",
  "password": "client2025",
  "disableFileViewer": true,
  "downloadsLimit": 1,
  "perUserDownloadLimit": true,
  "allowedUsernames": ["client-user"]
}
```

## Public Access

Shared links are accessible via:
```
/public/share/{hash}
```

Where `{hash}` is the unique identifier for the share.

### Downloading Files

Download files using the `/public/dl` endpoint with the `files` query parameter. Use `||` to separate multiple files:

```
/public/dl/{hash}?files=file1.txt||folder/file2.pdf
```

### Password-Protected Downloads

For password-protected shares, use the token parameter:

```
/public/dl/{hash}?token={token}&files=file1.txt
```

## Use Cases

**Standard File Sharing**: Share documents, images, or folders with colleagues or clients.

**Client Deliverables**: Password-protected shares with download tracking.

**Public Resources**: Share company resources, documentation, or media files.

**Time-Limited Access**: Share files that expire after a set period.

**Branded Shares**: Corporate branding with custom colors, logos, and themes.

## Next Steps

- [Upload shares](/docs/shares/upload/upload-shares/)
- [Common options](/docs/shares/options/)
- [Customization](/docs/shares/customization/)
