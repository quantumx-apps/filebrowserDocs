---
title: "Upload Shares"
description: "Upload-only shares for collecting files"
icon: "upload"
weight: 2
---

Upload-only shares allow users to upload files without viewing existing content.

## What Upload Shares Include

Upload shares provide:
- File upload capability
- Upload progress indication
- Upload confirmation

Upload shares **do not** provide:
- File browsing
- File viewing
- Downloading existing files
- Directory contents visibility

## How to Create an Upload Share

1. Navigate to the directory where uploads should go
2. Click on the "Share" button in the actions menu
3. Set **Share Type** to `"upload"`
4. Configure the desired options
5. Click "Create" to generate the share link
6. Copy the generated link and share it with others

## Basic Example

```json
{
  "shareType": "upload",
  "path": "/submissions",
  "source": "files"
}
```

## Options NOT Available

These normal share options **do not apply** to upload shares because there is no viewing:

- ❌ `disableFileViewer` (no viewer to disable)
- ❌ `quickDownload` (no downloads available)
- ❌ `downloadsLimit` (no downloads possible)
- ❌ `perUserDownloadLimit` (no downloads possible)
- ❌ `maxBandwidth` (only applies to downloads)
- ❌ `disableThumbnails` (no browsing available)
- ❌ `disableSidebar` (no sidebar shown)
- ❌ `viewMode` (no viewing available)
- ❌ `enableOnlyOffice` (no viewing available)
- ❌ `enableOnlyOfficeEditing` (no viewing available)
- ❌ `extractEmbeddedSubtitles` (no viewing available)

## Configuration Examples

### Basic Upload Portal

```json
{
  "shareType": "upload",
  "path": "/submissions/homework",
  "source": "files",
  "expires": "7",
  "unit": "days"
}
```

### Authenticated Upload Only

Require users to be logged in:

```json
{
  "shareType": "upload",
  "disableAnonymous": true
}
```

### Specific Users Only

Restrict to specific usernames:

```json
{
  "shareType": "upload",
  "allowedUsernames": ["student1", "student2", "student3"]
}
```

### Password Protected

Require password for upload access:

```json
{
  "shareType": "upload",
  "password": "upload2025"
}
```

### With Custom Branding

```json
{
  "shareType": "upload",
  "title": "Homework Submission Portal",
  "description": "Upload your assignment files here",
  "banner": "<h3>Assignment Due: Friday</h3>",
  "themeColor": "#0066cc"
}
```

### Event Photo Collection

```json
{
  "shareType": "upload",
  "title": "Event Photos Upload",
  "description": "Share your photos from the company event",
  "banner": "<h2>📸 Company Event 2025</h2><p>Upload your photos here!</p>",
  "themeColor": "#28a745",
  "expires": "30",
  "unit": "days"
}
```

### Complete Example

```json
{
  "shareType": "upload",
  "path": "/submissions/project-2025",
  "source": "files",
  "password": "project2025",
  "expires": "14",
  "unit": "days",
  "disableAnonymous": false,
  "allowedUsernames": [],
  "title": "Project Submission",
  "description": "Upload your project files",
  "banner": "Maximum file size: 100MB per file",
  "themeColor": "#6c757d",
  "keepAfterExpiration": true
}
```

## Use Cases

### Homework/Assignment Submissions
Collect student assignments without allowing them to see other submissions.

### Resume/Application Collection
Allow job applicants to upload resumes without viewing other applications.

### Event Photo Gathering
Collect photos from event participants without exposing all submissions.

### Client File Submissions
Allow clients to upload documents, designs, or other files securely.

### Anonymous Feedback with Attachments
Enable file uploads for anonymous feedback or reports.

## Public Access

Upload shares are accessible via:
```
/public/share/{hash}
```

Users see an upload interface but cannot browse or download existing files.

## Security Best Practices

1. **Set Expiration Dates** - Automatically close submission windows
2. **Use Password Protection** - Prevent unauthorized uploads
3. **Limit to Specific Users** - Use `allowedUsernames` for internal submissions
4. **Require Authentication** - Use `disableAnonymous: true` for logged-in users only
5. **Custom Instructions** - Use banner to provide upload guidelines

## Next Steps

- [Normal shares](/docs/shares/normal/normal-shares/)
- [Common options](/docs/shares/options/)
- [Customization](/docs/shares/customization/)
