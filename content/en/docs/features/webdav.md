---
title: "WebDAV"
description: "Access FileBrowser Quantum as WebDAV Storage"
icon: "storage"
order: 4
date: "2026-02-27"
lastmod: "2026-04-30"
---

## What is WebDAV?

[WebDAV](https://en.wikipedia.org/wiki/WebDAV) is a feature in FileBrowser that will let you access and manage your files directly from your devices remotely.

It's also an alternative to the WebUI since you can mount/use one (or multiples) of your {{< doclink path="/configuration/sources/" text="sources" />}} directly on your devices and manage the files stored in them. This allows the use of native applications to create/edit/organize files via WebDAV that are not possible via WebUI. For example, you can edit documents using native office suites without {{< doclink path="/integrations/office/about/" text="Office Integration" />}} enabled, or organize folders/files using native apps like Explorer on Windows (In versions before Nov 2023), Finder on macOS, Thunar/Dolphin in Linux, etc. You can also use any third party client or app that support WebDAV to access your files!

## How to use WebDAV

WebDAV is enabled by default. Clients connect with **Basic Auth**: the **password must be a full, uncustomized API token** issued in the Web UI. Before you configure a client, make sure these line up:

1. **Server URL** — Starts with `/dav/<source name>` and matches how you reach FileBrowser (direct host, port, or path behind a **reverse proxy**). See [Server URL](#server-url) below.
2. **HTTP or HTTPS** — Use the same scheme (and port) as in the browser. Some clients call this **WebDAV** vs **WebDAVS** or plain **HTTP** vs **HTTPS**; pick the one that matches your deployment (TLS on 443 vs plain HTTP on your FileBrowser port).
3. **Password** — The uncustomized API token. Customized tokens may not work with many webdav clients.

For a step-by-step example on WinSCP, see the {{< doclink path="/user-guides/webdav-guides/winscp/" text="WinSCP guide" />}}.

### API tokens

**Settings → API Tokens** is only available if your user has `api` or `admin` permissions. If you are logged in as a normal user and do not see API Tokens, make sure your user has permissions set correctly.

### Create an API token for WebDAV

- Log in to FileBrowser and open **Settings → API Tokens**:

<img src="/images/features/webdav/create-api-token.png">

Enter a name and an expiration that fits your use case.

**Important:** Create the token **without** customization enabled (the option is off by default). WebDAV needs the **short/minimal** token form; many clients cannot use the long customized tokens as a password.

<img src="/images/features/webdav/token-customization-disabled.png">

When you create the token, **copy the full value** and use it only as the **password** in your WebDAV client.

<img src="/images/features/webdav/copy-token.png">

### Username and password

FileBrowser **ignores the WebDAV username**. It can be left empty, or set to any placeholder (for example `a`). Some clients require a non-empty username—in that case, any value is fine.

The **password** must be the **complete** minimal API token string, with no extra spaces or truncation.

{{% alert context="info" %}}
If your user has {{< doclink path="/configuration/users/#user-scopes" text="user scopes" />}} configured, FileBrowser resolves paths according to the user who **created** the token; you do not need to add a scope folder to the path manually when that applies.
{{% /alert %}}

### Server URL

Examples:

- `https://files.example.com/dav/<source-name>/`
- `http://192.168.1.210:8080/dav/<source-name>/`
- `http://localhost/dav/<source-name>/`

**Reverse proxy:** If FileBrowser is served under a host or path prefix, use the same origin you use in the browser. For example:

- `https://sub.example.com/dav/<source-name>/`
- `https://sub.example.com/prefix/dav/<source-name>/` — when the app is mounted under `/prefix`

That pattern is valid for clients such as DAVx5 as long as the URL matches how you reach the instance.

To open a folder inside a source instead of the whole source:

- `https://files.example.com/dav/<source-name>/my-folder/`

**Quick method:** In the Web UI, open the folder you want, copy the address bar URL, then replace `/files/` with `/dav/`. Example: `https://files.example.com/files/data/folder/` → `https://files.example.com/dav/data/folder/`

{{% alert context="warning" %}}
You only see folders and sources your user can access. You need `download` to read and `modify` / `create` / `delete` to change files.
{{% /alert %}}

## Tested Clients

{{% alert context="warning" %}}
Windows Explorer supports mounting WebDAV as a drive natively in Windows Explorer. But this feature was [deprecated](https://learn.microsoft.com/en-us/windows/whats-new/deprecated-features) since Nov 2023. Will only work in older Windows versions before that date. We can still mounting WebDAV natively in modern Windows versions, but is more tricker and has several limitations. Is recommended to use other methods such as rclone, or WinSCP instead.
{{% /alert %}}

Some clients working with FileBrowser are:

- [rclone](https://rclone.org/) - Cross-platform (desktop only) and supports mount.
- {{< doclink path="/user-guides/webdav-guides/winscp/" text="WinSCP" />}} - Third party client for Windows (see the linked guide).
- [MixPlorer](https://mixplorer.com/) - File manager for Android.
- [Symfonium](https://www.symfonium.app/) - Music Player for Android.
- [Material Files](https://github.com/zhanghai/MaterialFiles) - File Manager for Android.
- [ONLYOFFICE Mobile apps](https://helpcenter.onlyoffice.com/mobile) - Mobile devices only. (Clouds > Sign in > Other WebDAV storage)
- Desktop file managers such as Finder in macOS and Thunar, Dolphin, Nemo, Nautilus... in Linux.

You may need to omit `https://` or `http://` when setting the server URL depending on the client you are trying to connect. If you use `https` you will need to use port `443`, or the port number that was used with FileBrowser.

Some clients also may use DAVS or DAV instead of https or http.

{{% alert context="info" %}}
For guides on how to setup some clients, you can check {{< doclink path="/user-guides/webdav-guides/" text="our guides" />}} --
You can also check [awesome-webdav](https://github.com/fstanis/awesome-webdav?tab=readme-ov-file).
{{% /alert %}}

## Disable WebDAV

The WebDAV feature in FileBrowser is enabled by default, if you want to disable it you'll need to edit an option in your {{< doclink path="/getting-started/config/" text="config file" />}}, the option can be found under the `server` section:

```yaml
server:
  disableWebDAV: true # Set to true to disable WebDAV
```

After you edit the config file, remember to restart FileBrowser for the changes to take effect.

## Troubleshooting

### Mount as a drive for Windows

WebDAV support was [deprecated](https://learn.microsoft.com/en-us/windows/whats-new/deprecated-features) since November 2023, so this is not currently supported in newer versions of Windows when trying from the File Explorer. You'll need to install [rclone](https://rclone.org/) and [winfsp](https://winfsp.dev/rel/) to mount WebDAV as a drive. You can see {{< doclink path="/user-guides/other/rclone" text="this guide" />}} to set up rclone for WebDAV.

Alternatively, you can use [WinSCP](https://winscp.net/eng/download.php) as file manager itself without mapping as a drive. The only downside is that you can't manage files with any other software more than WinSCP interface.

### Access Denied

If you get access denied could be for the following reasons:

- The API Token expired: Try setting a longer duration time for the API Token.
- The path that you're trying to access is not valid: Make sure that you access to the path by checking in the WebUI.
- You don't have enough permissions: Check that your user has the necessary permissions to access WebDAV, you'll need `download` permission to view, and `modify/create/delete` permission to modify files. Also see {{< doclink path="/access-control/access-control-overview/" text="Access control" />}}.

### Connection or configuration issues

If WebDAV still fails after checking URL, scheme (HTTP/HTTPS), and a fresh minimal token, inspect **FileBrowser server logs** around the time of the request. Failed auth, wrong paths, or proxy misconfiguration often show up there. Log configuration is described in {{< doclink path="/configuration/logging/" text="Logging configuration" />}}.

## Next Steps

- {{< doclink path="/user-guides/webdav-guides/" text="WebDAV Guides" />}} - How-to guides to connect filebrowser with some WebDAV supported software.
- {{< doclink path="/user-guides/other/rclone/" text="rclone guide" />}} - Basic rclone guide for desktop.
