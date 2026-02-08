---
title: "WebDAV"
description: "Access FileBrowser Quantum as WebDAV Storage"
icon: "storage"
order: 4
date: "2026-02-08"
lastmod: "2026-02-08"
---

{{% alert context="warning" %}}
WebDAV is only available as of `v1.3.0-beta` version of FileBrowser. It's enabled by default and no additional configuration is needed. This banner (and the "experimental" status) will be removed once WebDAV is implemented for `stable` version as well.
{{% /alert %}}

## What is WebDAV?

[WebDAV](https://en.wikipedia.org/wiki/WebDAV) is a feature in FileBrowser that will let you access and manage **all** your files directly from your devices remotely.

It's also an alternative to the WebUI since you can mount one (or multiples) of your {{< doclink path="/configuration/sources/" text="sources" />}} directly on your Filesystem and manage the files stored in them. This allows you the use of native applications to create/edit/organize files via WebDAV that are not possible via WebUI. For example, you can edit documents using native office suites without {{< doclink path="/integrations/office/about/" text="Office Integration" />}} enabled, or organize folders/files using native apps like Explorer on Windows (In versions before Nov 2023), Finder on MacOS, Thunar/Dolphin in Linux, etc. You can also use any third party client or app that support WebDAV to access your files!

## How to use WebDAV

WebDAV is enabled by default and can be accessed from various clients in your devices via Basic Auth with an API Token being the password. You'll need to follow these steps:

### 01. Create API Token

- Login into FileBrowser and go to `Settings` -> `API Tokens`:

<img src="/images/features/webdav/create-api-token.png">

### 02. Tokens without customization

Enter a suitable name and set a duration for the expiration of the token according to your requirements.

When creating an API Token for WebDAV you need to create a Token _without_ customization by disabling the "Customize Token" option. The option is disabled by default, but make sure that you have it disabled.

When creating a Token this way, will inherit the user permissions and is **much shorter** than the regular tokens with customization enabled, this is necessary since not all WebDAV clients/apps support larger passwords for authentication.

<img src="/images/features/webdav/customization-disabled.png">

### 03. Copy Token

Once you created the Token, copy it to your clipboard and use it as password for you preferred WebDAV client.

<img src="/images/features/webdav/copy-token.png">

{{% alert context="info" %}}
When authenticating to WebDAV clients, the `username` field will be completly _ignored_ by FileBrowser, you can fill it with anything. Setting your username itself will be ideal, but the only required fields are the URL to the server and the password for authentication. Some clients may have extra configurations to add (most of them optional), such as DAV protocol: DAV or DAVS (`http` or `https` in simpler words), ports, etc.
{{% /alert %}}

### 04. Server URL

The remote path set for WebDAV is basically the starting point when you open a client:

- `/dav`: This is required for FileBrowser to know that you are trying to access WebDAV.
- `/<source_name>`: Required to set the name of the source (case-sensitive).

{{% alert context="info" %}}
If your user has {{< doclink path="/configuration/users/#user-scopes" text="user scopes" />}} configured, FileBrowser will return the path of your user scope automatically based in who created the Token, there's no need to specify the full path including the scope folder.
{{% /alert %}}

- `/` -- Trailing slash: This is optional though some clients may require `/` at the end.

So, the final URL to enter in the server field could be like:
- `https://files.example.com/dav/<source-name>`
- `http://192.168.1.210:8080/dav/<source-name>`
- `http://localhost/dav/<source-name>`

If you don't want to use the _whole_ source and just map a specific folder, you can too, for example:

- `https://files.example.com/dav/<source-name>/my-folder`

An easy way to set the URL is open the WebUI in your browser, navigate to your desired folder, copy the URL, and replace `/files/` with `/dav/`. For example:

- `https://files.example.com/files/data/folder` becomes `https://files.example.com/dav/data/folder/`

{{% alert context="warning" %}}
You'll only have access to folders and sources that your user have access to -- You can't access a folder/source if your user has no access to it, or also if you user lacks the neccesary permissions.
{{% /alert %}}

## Tested Clients

{{% alert context="warning" %}}
Windows doesn't support mounting WebDAV as a drive natively in Windows Explorer. This feature was [deprecated](https://learn.microsoft.com/en-us/windows/whats-new/deprecated-features) since Nov 2023. Will only work in older windows version before that date.
{{% /alert %}}

Some clients working with FileBrowser are:

- [rclone](https://rclone.org/) - Cross-platform (desktop only) and supports mount.
- [WinSCP](https://winscp.net/) - Third party client for Windows.
- [MixPlorer](https://mixplorer.com/) - File manager for Android.
- [Symfonium](https://www.symfonium.app/) - Music Player for Android.
- [Material Files](https://github.com/zhanghai/MaterialFiles) - File Manager for Android.
- [ONLYOFFICE Mobile apps](https://helpcenter.onlyoffice.com/mobile) - Mobile devices only. (Clouds > Sign in > Other WebDAV storage)
- Linux and MacOS file managers such as Finder, Thunar, Dolphin, Nemo, Nautilus, etc.

You may need to omit `https://` or `http://` when setting the server URL depending on the client you are trying to connect. If you use `https` you will need to use port `443`, or the port number that was used with FileBrowser.

Some clients also may use DAVS or DAV instead of https or http.

{{% alert context="info" %}}
For guides on how to setup clients, you can check our guides {{< doclink path="/user-guides/webdav-clients/" text="here" />}} --
You can also check [awesome-webdav](https://github.com/fstanis/awesome-webdav?tab=readme-ov-file).
{{% /alert %}}

## Disable WebDAV

WebDAV feature in FileBrowser is enabled by default, to disable this feature you'll need to edit a option in your {{< doclink path="/getting-started/config/" text="config file" />}}, the option can be found under the `server` section:

```yaml
server:
  disableWebDAV: true # Set it to true to disable WebDAV
```

After edit the option, restart FileBrowser to take effect.

## Troubleshooting

### Mount as a drive for Windows

WebDAV support was [deprecated](https://learn.microsoft.com/en-us/windows/whats-new/deprecated-features) since November 2023, so this is not currently supported in newer versions of Windows when trying from the File Explorer. You'll need to install [rclone](https://rclone.org/) and [winfsp](https://winfsp.dev/rel/) to mount WebDAV as a drive. You can see {{< doclink path="/user-guides/other/rclone" text="this guide" />}} to set up rclone for WebDAV.

Alternatively, you can use [WinSCP](https://winscp.net/eng/download.php) as file manager itself without mapping as a drive. The only downside is that you can't manage files with any other software more than WinSCP interface.

### Access Denied

If you get access denied could be for the following reasons:

- The API Token expired: Try setting a longer duration time for the API Token.
- The path that you're trying to access is not valid: Make sure that you access to the path by checking in the WebUI.
- You don't have enough permissions: Check that your user has the necessary permissions to access WebDAV, you'll need `download` permission to view (read-only), and `modify/create/delete` permission to modify the files. Also see {{< doclink path="/access-control/access-control-overview/" text="Access control" />}}.

## Next Steps

- {{< doclink path="/user-guides/webdav-guides/" text="WebDAV Guides" />}} - How-to guides to connect filebrowser with some WebDAV supported software.
- {{< doclink path="/user-guides/other/rclone/" text="rclone guide" />}} - Full rclone guide for Windows and Linux.