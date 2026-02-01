---
title: "Mount with rclone"
description: "A guide to mount FileBrowser as a network drive."
icon: "cloud_sync"
---

{{% alert context="warning" %}}
WebDAV is only available as of `v1.2.0-beta` version of FileBrowser. It is enabled by default and no additional configuration is needed. This banner will be removed once WebDAV is implemented for `stable` version as well.
{{% /alert %}}

## Prerequisites

You need a working FileBrowser setup and an API Key (`minimal` version) to access FileBrowser's WebDAV.

## Installing rclone

Download and install the latest rclone from the [official website](https://rclone.org/downloads/#release) for your OS and architecture. For command line install (only for  Linux/macOS/BSD systems), rclone provides an installation script.

```bash
sudo -v ; curl https://rclone.org/install.sh | sudo bash
```

For Windows, you will need to download rclone from the releases.

### Additional steps for Windows

This is optional but recommended, so you can run `rclone` commands in your terminal directly. Otherwise, you will need to run the commands in the folder of rclone.

Create a folder named `rclone` in `C:` or any drive letter and move the rclone executable to that folder.

1. Right-click My Computer (either on the Desktop or the Start menu). Click Properties and then Advanced system settings. In the System Properties dialog box, click the Advanced tab. Alternatively, you can search for `edit environment variable` in start.
1. Click Environment Variables.
1. In the top list, scroll down to the PATH variable under user variables, select it, and click Edit.
1. Click New and paste in the folder that contains `rclone.exe`. For example, `C:\rclone` or `D:\rclone` depending on where you setup.
1. Click OK to close each dialog box.

If you do not follow the above steps, whenever you want to access rclone, you have to open the folder in explorer and right click `Open in Terminal`. The commands will be `.\rclone` instead of just `rclone`.

## Configuration

We need to create a configuration for rclone to access FileBrowser's WebDAV. To configure with interactive prompts, run below command.

```bash
rclone config
```

Send `n` to create a new remote and fill the following details when prompted for it.

- Name => `filebrowser` (keep lowercase and without spaces)
- Storage => `webdav`'s number
- URL => `https://files.example.com/dav/data/` (change the URL to your use case)
- Vendor => `other`'s number
- User => Leave blank
- Pass => Send `y` (Do not paste the API key here)
- Pass (contd.) => Paste the API Key now. You need to paste twice, and the text will be hidden so do not paste multiple times by accident.
- Bearer Token => Leave blank
- Edit advanced config => Leave blank
- Keep config => Leave blank

You should now see your configuration in the list.

Alternatively, you can directly pass the required values as key value pairs as shown here.

```bash
rclone config create filebrowser webdav vendor=other url=https://files.example.com/dav/data/  pass=<PASTE_API_KEY>
```

Now, you have successfully configured a remote for rclone.

## Creating mounts

{{% alert context="info" %}}
For windows, you need to install [winfsp](https://winfsp.dev/rel/) as instructed in [official docs](https://rclone.org/commands/rclone_mount/#installing-on-windows)
{{% /alert %}}

For Windows, you can run the below command in PowerShell.

```powershell
rclone mount filebrowser:/ X: --vfs-cache-mode writes
```

`filebrowser` in `filebrowser:/` is the name of the remote and `/` means we are mounting `/dav/data/` as a whole. We can also mount a sub folder in `data` like `filebrowser:/sub/folder`. `X:` is the drive letter in the Windows system. The letter must be unused when you mount using rclone.


In `--vfs-cache-mode writes` mode files opened for read only are still read directly from the remote, write only and read/write files are buffered to disk first.

For other systems,

```bash
rclone mount filebrowser:/ /mnt/files --vfs-cache-mode writes
```

`/mnt/files` **MUST** exist and be empty. The user should have write permissions to that folder. You can run below command to change the folder permissions.

```bash
sudo chown -R $(id -u):$(id -g) /mnt/files
```

You are not limited to mounting in `/mnt` folder, you can choose any path as long as you have read/write permissions for it.

{{% alert context="info" %}}
Terminal window must not be closed for the connection to be intact. Leave it minimized till you are done with your work.
{{% /alert %}}

You can now edit FileBrowser contents with desktop apps via rclone mount!
