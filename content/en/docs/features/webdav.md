---
title: "Webdav"
description: "Accessing Filebrowser as a WebDav"
icon: "cloud"
order: 4
---

As of `v1.2.0-beta`, FileBrowser can be accessed as a WebDav via API Keys.

Check [awesome-webdav](https://github.com/fstanis/awesome-webdav?tab=readme-ov-file) for guides on setting up clients for desktop and mobile devices. For example,

- [WinSCP](https://winscp.net/eng/download.php) (Windows Only)
- Linux file browsers (usually have an option to `Connect to Server`)
- davfs2 (to mount as Volume in Linux)
- [MixPlorer](https://mixplorer.com/) (for Android)

## Configurations

WebDav is enabled by default from `v1.2.0-beta`. Currently,

- Adds support for Basic auth with API key for authentication
- WebDAV handler on `/dav/<scope>/` path.

### Create API Key

Generate a new API Key from Settings. This API key will serve as the password for WebDav basic authentication.

FileBrowser's WebDav only depends on password field for authentication and user field is ignored. This makes WebDav accessible for any users that use SSO authentication backend as well.

{{% alert context="info" %}}
If the WebDav client does not allow you to keep the user field blank, you can fill it with anything. FileBrowser will only use the password field which is the API Key for fetching user information.
{{% /alert %}}


### WebDav Path

The remote path set for WebDav is basically the starting point when you open the client. It is of 3 parts:

- `/dav` - required for FileBrowser to know you are trying to access WebDav
- `/<scope>` - required to set the name of the source. It is case-sensitive.
- `/` - Optional to set the path inside the source. Make sure you have access to the folder you set the path to. Note some clients may require `/` at the end.

{{% alert context="warning" %}}
The path inside the source, is only a starting point when you open the WebDav. You will have access to all folders that the API Key allows you to, that is, all the folders you have access to. If the path points to an inaccessible path, then you will not be able to use WebDav.
{{% /alert %}}
