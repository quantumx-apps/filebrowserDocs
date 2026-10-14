---
title: "ZIP filename encoding on extract"
description: "Choose how non-Unicode ZIP entry names are decoded when extracting on the server"
icon: "folder_zip"
date: "2026-10-12T00:00:00Z"
lastmod: "2026-10-12T00:00:00Z"
---

{{% alert context="info" %}}
**v2.1.x**
{{% /alert %}}

When you **extract** a `.zip` archive on the server (**Extract archive** in the file menu), FileBrowser can decode entry names using several legacy encodings. ZIP **Unicode Path** extra fields and the UTF-8 flag still take precedence over any fallback you pick.

`.tar.gz` and `.tgz` extracts use the same unarchive API but do not show filename encoding options.

## Web UI

1. Select a `.zip` file and choose **Extract archive**.
2. Pick the destination folder (**Extract to**).
3. The prompt loads a **Filename encoding** preview (`POST /api/resources/unarchive` with `"preview": true`).
4. Choose an encoding from the dropdown (the server **suggested** option is marked when it recommends one).
5. Review **Filename preview**, then confirm **Extract**.

**Extract** stays disabled until preview loading finishes, no preview error is shown, and an encoding is selected. If preview fails, use **Retry preview**.

Supported **`filenameEncoding`** values (same as the API):

| Value | Typical use |
|-------|-------------|
| `utf-8` | Unicode / modern archives |
| `cp932` | Japanese (Shift JIS) |
| `gb18030` | Simplified Chinese |
| `big5` | Traditional Chinese |
| `euc-kr` | Korean |
| `cp437` | DOS Latin US |
| `windows-1252` | Western European |

**Create archive** does not expose encoding options; only server-side extraction does.

## API

`POST /api/resources/unarchive` accepts the usual unarchive fields (`fromSource`, `path`, `destination`, optional `toSource`, optional `deleteAfter`) plus:

- **`preview`** (boolean, optional): when `true`, inspects a **`.zip`** archive only and returns encoding candidates without extracting or deleting files. Requires the same source/destination permissions as extraction.
- **`filenameEncoding`** (string, optional): fallback encoding for ZIP entry names that lack Unicode metadata. Allowed values: `utf-8`, `cp932`, `gb18030`, `big5`, `euc-kr`, `cp437`, `windows-1252`. Omit on extract to apply the server’s suggested encoding; if the archive is ambiguous and no suggestion is available, extraction returns an error asking you to choose an encoding.

Preview response (200):

```json
{
  "suggested": "cp932",
  "candidates": [
    { "encoding": "cp932", "names": ["example.txt", "…"] }
  ]
}
```

Each **`candidates`** entry includes an **`encoding`** and up to five sample **`names`** decoded the same way as during extraction. An empty **`suggested`** string means you must pick a compatible encoding from **`candidates`** before extracting.

Successful extraction returns `{"path": "<destination>", "source": "<toSource>"}`.

## Related

- {{< doclink path="configuration/server/#maxarchivesize" text="server.maxArchiveSize" />}} — size cap for archive and unarchive actions
- {{< doclink path="user-preferences/listing-options/#delete-source-files-after-creationextraction-of-archives" text="Delete after archive (profile)" />}} — optional removal of the archive file after extract
