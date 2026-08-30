---
title: "Normal Shares"
description: "Standard shares with viewing capabilities"
icon: "folder_shared"
date: "2025-10-08T14:59:30Z"
lastmod: "2026-02-04T23:33:08Z"
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

## Normal share-specific options

These options **only apply** to normal shares. They appear in the share dialog in the same order as the application. See {{< doclink path="shares/options/" text="Common options" />}} for the full dialog including shared settings.

{{< fb-prompt-mock >}}

<div class="settings-items">

{{< fb-toggle name="Allow modify" help="Allow editing and modifying files in the share." />}}

{{< fb-toggle name="Allow create" help="Allow creating new files and folders, and uploading files to the share." />}}

{{< fb-toggle name="Allow delete" help="Allow deleting files and folders from the share." />}}

</div>

{{< fb-settings-group >}}

{{< fb-field label="Default view mode" type="select" options="Normal View|List View|Compact View|Gallery View" selected="Normal View" help="Set the default view mode for anonymous users viewing this share." />}}

{{< fb-toggle name="Allow replacements" help="Allow replacing existing files when uploading (only when Allow create is enabled)." />}}

{{< fb-toggle name="Disable download" help="Prevent downloading files from this share." />}}

{{< fb-toggle name="Disable File Viewer" help="Prevent viewing files in the browser — users can only download files." />}}

{{< fb-toggle name="Show Quick Download" help="Display quick download buttons for files in the share." />}}

{{< fb-toggle name="Enable OnlyOffice viewer" help="Allow viewing office files using OnlyOffice (when OnlyOffice is configured)." />}}

{{< fb-toggle name="Disable Thumbnails" help="Preview thumbnails will not be shown in the share." />}}

{{< fb-toggle name="Show hidden files" help="Show hidden files and folders in the share." />}}

{{< fb-toggle name="Apply the downloads limit to each user" help="Each authenticated user gets their own download counter. Anonymous users are blocked." />}}

{{< fb-toggle name="Extract embedded subtitles" help="Extract embedded subtitles from media files on load — this can be slow for large files." />}}

{{< fb-field label="Downloads Limit" type="number" placeholder="Leave empty for unlimited" />}}

{{< fb-field label="Max Bandwidth" type="number" placeholder="kbps" />}}

{{< /fb-settings-group >}}

{{< /fb-prompt-mock >}}

## Next Steps

- {{< doclink path="shares/upload-shares/" text="Upload shares" />}} - Create upload-only shares
- {{< doclink path="shares/options/" text="Common options" />}} - Options available to all share types
- {{< doclink path="shares/customization/" text="Customization" />}} - Brand your shares with colors and logos

