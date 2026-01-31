---
title: "WebDAV"
description: "Accessing Filebrowser as a WebDAV"
icon: "cloud"
order: 4
---

{{% alert context="warning" %}}
WebDAV is only available as of `v1.2.0-beta` version of FileBrowser. It is enabled by default and no additional configuration is needed. This banner will be removed once WebDAV is implemented for `stable` version as well.
{{% /alert %}}

WebDAV currently supports:

- Basic auth with API key for authentication
- WebDAV handler on `/dav/<source_name>/` path.
- User of the API key must have full access (read and write) to the folder path for WebDAV to work.

Check [awesome-webdav](https://github.com/fstanis/awesome-webdav?tab=readme-ov-file) for guides on setting up clients for desktop and mobile devices.

## Create API Key

Login to your account and go to Settings > API Keys. Click on `New` to generate a new API key for WebDAV.

Enter a suitable name and set a duration for the expiration of the API Key. Enable `minimal` option for maximum compatibility with the WebDAV clients.

## Username for WebDAV

FileBrowser's WebDAV only depends on password field for authentication and user field is ignored. This makes WebDAV accessible for any users that use SSO authentication backend as well.

{{% alert context="info" %}}
If the WebDAV client does not allow you to keep the user field blank, you can fill it with anything. FileBrowser will only use the password field which contains the necessary information to access the WebDAV.
{{% /alert %}}

## WebDAV Path

The remote path set for WebDAV is basically the starting point when you open the client. It is of 3 parts:

- `/dav` - required for FileBrowser to know you are trying to access WebDAV
- `/<source_name>` - required to set the name of the source. It is case-sensitive.
- `/` - Optional to set the path inside the source. Make sure you have full read write access to the folder you set the path to. Note that some clients may require `/` at the end.

{{% alert context="warning" %}}
The path inside the source, is only a starting point when you open the WebDAV. You will have access to all folders that the API Key allows you to, that is, all the folders and sources you have access to. If the path points to an inaccessible path, then you will not be able to use WebDAV.
{{% /alert %}}

## Tested Clients

- [rclone](https://rclone.org/) - cross-platform (desktop only) and supports mount
- [WinSCP](https://winscp.net/eng/download.php) - Windows only and requires minimal API key to work
- [MixPlorer](https://mixplorer.com/) - Android only
- [Symfonium](https://www.symfonium.app/) - Android only (for accessing music only)
- [Material Files](https://github.com/zhanghai/MaterialFiles) - Android only and supports mount via DAVx⁵
- davfs2 - Linux only and requires minimal API key to work
- Linux and macOS file managers (via `Connect to Server` or similar option)

## Trobleshooting

### Map as a network Drive for Windows

This is not currently supported when trying from Windows File Explorer. You need to install [rclone](https://rclone.org/) and [winfsp](https://winfsp.dev/rel/) to mount WebDAV as a network drive. Alternatively, you can use [WinSCP](https://winscp.net/eng/download.php) as file manager itself without mapping as a network drive.

### Writing WebDAV URL

- It is recommended to write the URL in a text file first and then copy and paste it into the URL field of the clients. This way it autoconfigures the WebDAV path into its corresponding field for the client. For example, WinSCP automatically removes `/dav/<source_name>/` and sets `RemoteDirectory` inside advanced settings. Similar can be seen in MixPlorer, but it sets `remote` inside advanced settings.
- You may need to omit `https://` or `http://` depending on your setup. If you use `https` you will need to use port `443` or the port number that was used with FileBrowser. For example,
  1. `https://files.example.com/files/data/folder` becomes `files.example.com/dav/data/folder/` with port `443`.
  2. `http://files.local:8080/files/data` becomes `files.example.com/dav/data/` with port `8080`.
  3. `http://files.local/files/data` becomes `files.example.com/dav/data/` with port `80`.

### Access Denied for WinSCP

Make sure you are using `minimal` API key. If you are, then re-enter the API key again in the prompt.

### Access Denied in general

- Check whether the API key expired
- Make sure the path is valid for you in the WebUI.
- Check if you can read/write in the path.
