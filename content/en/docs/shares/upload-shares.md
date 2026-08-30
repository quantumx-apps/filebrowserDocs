---
title: "Upload Shares"
description: "Upload-only shares for collecting files"
icon: "upload"
date: "2025-10-08T14:59:30Z"
lastmod: "2026-02-04T23:33:08Z"
order: 4
---

Upload-only shares allow users to upload files to a specific location without viewing or accessing existing content.

## What Upload Shares Include

Upload shares provide:
- ✅ **File upload capability** - Users can upload files and folders
- ✅ **Upload progress indication** - Real-time upload progress
- ✅ **Upload confirmation** - Success/error feedback

Upload shares **do not** provide:
- ❌ **File browsing** - Cannot see existing files
- ❌ **File viewing** - Cannot preview or open files
- ❌ **Downloading** - Cannot download any files
- ❌ **Directory visibility** - Cannot see folder structure

{{% alert context="info" %}}
Upload shares are perfect for collecting submissions where privacy between uploaders is important.
{{% /alert %}}

## How to Create an Upload Share

1. Navigate to the **destination directory** where uploads should be stored
2. Click the **Share** button in the actions menu
3. Set **Share Type** to `Upload only`
4. Configure your desired options
5. Click **Share** to generate the link
6. Copy and share the upload URL with your users

## Available options

Upload shares support most {{< doclink path="shares/options/" text="common options" />}}. Set **Share Type** to `Upload only` in the dialog:

{{< fb-prompt-mock >}}

{{< fb-field label="Share Duration" type="duration" help="Duration before the share expires. Leave blank for a permanent share." />}}

{{< fb-field label="Optional Password" type="password" help="Optional password required to access this upload portal." />}}

{{< fb-field label="Share Type" type="select" options="Normal|Upload only" selected="Upload only" />}}

{{< fb-settings-group >}}

{{< fb-toggle name="Allow replacements" help="Allow replacing existing files when uploading." />}}

{{< fb-toggle name="Disable anonymous access" help="Only authenticated users can access the share." />}}

{{< fb-toggle name="Only share to certain users" help="Only the specified users can access the share." />}}

{{< fb-field label="Share Title" type="text" placeholder="Custom page title" />}}

{{< fb-field label="Share Description" type="textarea" placeholder="Short description" />}}

{{< fb-field label="Share Theme Color" type="text" placeholder="e.g., rgb(33,150,243)" />}}

{{< fb-field label="Share Banner" type="text" placeholder="Custom banner text or HTML" />}}

{{< /fb-settings-group >}}

{{< /fb-prompt-mock >}}

See {{< doclink path="shares/options/" text="Common options" />}} for the full list and {{< doclink path="shares/customization/" text="Customization" />}} for branding details.

## Public Access URL

Upload shares are accessible via:
```
https://your-domain.com/public/share/{hash}
```

Users see a clean upload interface with your custom branding but cannot browse, view, or download existing files.

## Security Best Practices

### 1. Set Expiration Dates

<div class="best-practice">
  <strong>Why:</strong> Automatically close submission windows<br>
  <strong>Example:</strong> Set 7-day expiration for weekly homework submissions
</div>

### 2. Use Password Protection

<div class="best-practice">
  <strong>Why:</strong> Prevent unauthorized uploads<br>
  <strong>Example:</strong> Share password separately via email or in class
</div>

### 3. Limit to Specific Users

<div class="best-practice">
  <strong>Why:</strong> Restrict to known users only<br>
  <strong>Example:</strong> Use <code>allowedUsernames</code> for internal submissions
</div>

### 4. Require Authentication

<div class="best-practice">
  <strong>Why:</strong> Track who uploaded what<br>
  <strong>Example:</strong> Enable <code>disableAnonymous</code> for accountability
</div>

### 5. Use Custom Instructions

<div class="best-practice">
  <strong>Why:</strong> Provide upload guidelines and requirements<br>
  <strong>Example:</strong> Banner with "Maximum file size: 100MB, PDF only"
</div>

## Tips and Best Practices

💡 **Clear Instructions**: Use the banner to provide upload guidelines (file types, size limits, naming conventions)

💡 **Set Expectations**: Include deadline information in the title or description

💡 **Professional Appearance**: Use custom branding for client-facing portals

💡 **Privacy Assurance**: Remind users that their uploads are private in the description

💡 **Track Submissions**: Use authenticated access for accountability

💡 **Temporary Links**: Set expiration dates for time-sensitive submissions

## Next Steps

- {{< doclink path="shares/normal-shares/" text="Normal shares" />}} - Create viewing/downloading shares
- {{< doclink path="shares/options/" text="Common options" />}} - Options available to all share types
- {{< doclink path="shares/customization/" text="Customization" />}} - Brand your shares with colors and logos

