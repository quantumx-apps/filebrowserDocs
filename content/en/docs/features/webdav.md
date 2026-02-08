---
title: "WebDAV"
description: "Access Filebrowser Quantum as WebDAV Storage"
icon: "storage"
order: 4
date: "2026-02-07"
lastmod: "2026-02-07"
---

{{% alert context="warning" %}}
WebDAV is only available as of `v1.2.0-beta` version of FileBrowser. It is enabled by default and no additional configuration is needed. This banner (and the "experimental" status) will be removed once WebDAV is implemented for `stable` version as well.
{{% /alert %}}

## What is WebDAV?

[WebDAV](https://en.wikipedia.org/wiki/WebDAV) is a Feature in Filebrowser that will let you access and manage **all** your files directly from your devices remotely.

It's also an alternative to the WebUI since you can mount one (or multiples) of your {{< doclink path="/en/docs/configuration/sources/" text="sources" />}} directly on your Filesystem to manage them.

For example, you can edit documents using native office suites, or organize folders/files using native apps like Explorer on Windows, Finder on MacOS, Thunar/Dolphin in Linux, etc. You can also use third party clients that support WebDAV to access your files as well.

## How to use WebDAV

To use WebDAV is simple, you'll need to follow this steps:

### Create API Key

- Login into Filebrowser and go to Settings -> API Keys:

<img src="/images/features/webdav/create-api-key.png">

### Use minimal tokens

When creating an API key for WebDAV you need to _**always**_ turn on the minimal token option.

This option will use your user permissions and is **more short** than the regular tokens, this is necessary since not all
WebDAV clients/apps support larger passwords -- The generated API token will act as the password.

<img src="/images/features/webdav/minimal-token.png">

Also enter a suitable name and set a duration for the expiration of the token, this is to your preference.

### Copy Token

Once you created the API key, copy the token to clipboard and use it as password for you prefered WebDAV client.

<img src="/images/features/webdav/copy-token.png">

{{% alert context="info" %}}
When authenticating to WebDAV clients, the `username` field will be completly _ignored_ by Filebrowser, you can fill it with anything. The only required fields are the URL to the server and the password for authentication. Some clients may have extra options (most of them optional), such as DAV protocol: DAV or DAVS (`http` or `https` in simpler words) ports, etc.
{{% /alert %}}

Check [awesome-webdav](https://github.com/fstanis/awesome-webdav?tab=readme-ov-file) for guides on setting up clients for desktop and mobile devices.

### Server URL
The remote path set for WebDAV is basically the starting point when you open the client:

- `/dav`: This is required for FileBrowser to know that you are trying to access WebDAV.
- `/<source_name>`: Required to set the name of the source (case-sensitive). 

{{% alert context="info" %}}
If you user has `user-scopes` configured, Filebrowser will return the path of your user scope automatically based in the user who created the API Key, there's no need to specify the full path including the scope folder.
{{% /alert %}}

- `/` -- Trailing slash: This is optional since some clients may require `/` at the end.

So, the final URL to enter in the server field could be like:
- `https://files.example.com/dav/<source-name>` 
- `http://192.168.1.210:8080/dav/<source-name>`
- `http://localhost/dav/<source-name>`

If you don't want to use the _whole_ source and just map a specific folder, you can too, for example:

- `https://files.example.com/dav/<source-name>/my-folder`

An easy way to set the URL is open the WebUI in your browser, navigate to your desired folder, copy the URL, and replace `/files/` with `/dav/`. For example:

- `https://files.example.com/files/data/folder` becomes `https://files.example.com/dav/data/folder/`

{{% alert context="warning" %}}
You'll only have access to all folders and sources that you user have access to -- You can't access a folder/source if your user has no access to it.
{{% /alert %}}

## Tested Clients

Some clients working with filebrowser are:

- [rclone](https://rclone.org/) - Cross-platform (desktop only) and supports mount.
- [WinSCP](https://winscp.net/) - Third party client for Windows.
- [MixPlorer](https://mixplorer.com/) - File manager for Android.
- [Symfonium](https://www.symfonium.app/) - Music Player for Android.
- [Material Files](https://github.com/zhanghai/MaterialFiles) - File Manager for Android.
- [ONLYOFFICE Mobile apps](https://helpcenter.onlyoffice.com/mobile) - Mobile devices only. (Clouds > Sign in > Other WebDAV storage)
- Windows Explorer: For Windows versions before Nov 2023.
- Linux and MacOS file managers such as Finder, Thunar, Dolphin, Nemo, Nautilus, etc.

{{% alert context="info" %}}
You may need to omit `https://` or `http://` when setting the server URL depending of the cient you are trying to connect. If you use `https` you will need to use port `443` or the port number that was used with FileBrowser.

Some clients also may use DAVS or DAV instead of https or http.
{{% /alert %}}

<!-- 

This is commentend out for now since the guides don't exist yet, they will be available in the path below:

{{% alert context="info" %}}
For guides on how to setup some clients, you can check {{< doclink path="/en/docs/user-guides/webdav-clients/" text="WebDAV Clients" />}}
{{% /alert %}}

-->


## Trobleshooting

### Map as a network Drive for Windows

WebDAV support was deprecated since November 2023, so this is not currently supported in newer versions of windows when trying from Windows File Explorer. You need to install [rclone](https://rclone.org/) and [winfsp](https://winfsp.dev/rel/) to mount WebDAV as a network drive. Alternatively, you can use [WinSCP](https://winscp.net/eng/download.php) as file manager itself without mapping as a network drive.

### Access Denied

If you get access denied could be for the following reasons:

- The API key expired: Try setting a more long duration time for the API key.
- The path that you're trying to access is not valid: Make sure that you access to the path by checking in the WebUI.
- You don't have enought permissions: Check that you user has the permissions to access WebDAV, you'll need `download` permission to view, and `modify/create/delete` permission to modify the files.