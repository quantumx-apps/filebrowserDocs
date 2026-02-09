---
title: "rclone with FileBrowser"
description: "A guide to using FileBrowser with rclone."
icon: "cloud_sync"
---

{{% alert context="warning" %}}
WebDAV is only available as of `v1.3.0-beta` version of FileBrowser. It's enabled by default and no additional configuration is needed. This banner (and the "experimental" status) will be removed once WebDAV is implemented for `stable` version as well.
{{% /alert %}}

[rclone](https://rclone.org/) is an open-source command-line tool that syncs files to and from over 70 cloud storage providers, including WebDAV. This makes it compactible with FileBrowser. Apart from syncing, it can also be used to mount the cloud storage to a volume or directory enabling users to use their native apps on the file and folders.

## Prerequisites

You need a working FileBrowser setup with WebDAV enabled and an API Token (without any customization) to access it.

## Installing rclone

Download and install the latest rclone from the [official website](https://rclone.org/downloads/#release) for your OS and architecture. For command line install (only for Linux/macOS/BSD systems), rclone provides an installation script.

```bash
sudo -v ; curl https://rclone.org/install.sh | sudo bash
```

For Windows, you will need to download `rclone` from the releases.

### Additional steps for Windows

Adding `rclone` to PATH is optional but recommended. So you can run `rclone` commands in your terminal directly like for amy other OS.

First, create a folder named `rclone` in `C:` or any drive letter and move the `rclone.exe` file to that folder. This allows us to have shorter PATH.

1. Right-click My Computer (either on the Desktop or the Start menu). Click Properties and then Advanced system settings. In the System Properties dialog box, click the Advanced tab. Alternatively, you can search for `edit environment variable` in start.
1. Click Environment Variables.
1. In the top list, scroll down to the PATH variable under user variables, select it, and click Edit.
1. Click New and paste in the folder that contains `rclone.exe`. For example, `C:\rclone` or `D:\rclone` depending on where you set up.
1. Click OK to close each dialog box.
1. Now you can run `rclone` in Windows the same way as any other OS.

If you do not follow the above steps, then whenever you want to access `rclone`, you have to

1. Open the folder in Windows File Explorer and locate `rclone.exe` file.
1. Copy that file with <kbd>Ctrl</kbd>+<kbd>C</kbd> (or via context menu).
1. Open the Terminal or Powershell window via Start.
1. Paste with <kbd>Ctrl</kbd>+<kbd>V</kbd>. This will paste the path to `rclone.exe` in the terminal.
1. Now, the Terminal or Powershell will know where `rclone` is and execute commands correctly.

    For example,

    ```bash
    # All commands like
    rclone <COMMAND> <ARGS>
    # Will become
    D:\Users\Me\Downloads\rclone\rclone.exe <COMMAND> <ARGS>
    ```

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
- User => Fill your username or leave blank
- Pass => Send `y` (Do not paste the API Token here)
- Pass (contd.) => Paste the API Token now. You need to paste again for confirmation, and the text may be hidden so do not paste multiple times by accident.
- Bearer Token => Leave blank
- Edit advanced config => Leave blank
- Keep config => Leave blank

You should now see your configuration in the list.

Alternatively, you can directly pass the required values as key value pairs as shown here.

```bash
rclone config create filebrowser webdav vendor=other url=https://files.example.com/dav/data/  pass=<PASTE_API_KEY>
```

Now, you have successfully configured a remote for FileBrowser in `rclone`.

## Creating mounts

{{% alert context="info" %}}
For windows, you need to install [winfsp](https://winfsp.dev/rel/) as instructed in [official docs](https://rclone.org/commands/rclone_mount/#installing-on-windows).
{{% /alert %}}

For Windows, you can run the below command in PowerShell.

```powershell
rclone mount filebrowser:/ X: --vfs-cache-mode writes
```

`filebrowser` in `filebrowser:/` is the name of the remote and `/` means we are mounting `/dav/data/` as a whole. We can also mount a sub folder in `data` like `filebrowser:/sub/folder`. `X:` is the drive letter in the Windows system. The letter must be unused when you mount using rclone.


In `--vfs-cache-mode writes` mode files opened for read only are still read directly from the remote, write only and read/write files are buffered to disk first. Another supported option is `--vfs-cache-mode full` which read/write files are buffered to disk always.

For other systems,

```bash
rclone mount filebrowser:/ /mnt/files --vfs-cache-mode writes
```

`/mnt/files` **MUST** exist and be empty. The user should have read/write permissions to that folder. You can run below command to change the folder permissions.

```bash
sudo chown -R $(id -u):$(id -g) /mnt/files
```

You are not limited to mounting in `/mnt` folder, you can choose any path as long as you have read/write permissions for it.

{{% alert context="info" %}}
Terminal window must not be closed for the connection to be intact. Leave it minimized till you are done with your work.
{{% /alert %}}

You can now edit FileBrowser contents with desktop apps via rclone mount!

## Updating passwords

If the API Token is expired or deleted, you can update the remote configuration via `rclone config` command itself.

Follow the steps below:

- Make sure you generate another API Token first and copy it.
- Run `rclone config` in terminal.
- You have to select `Edit existing remote` with `e` **NOT** `Set configuration password`.
- Enter the number corresponding to the remote you need to update.
- You can leave everything as blank expect when asked for `Pass/Password`.
- Similar to how you configured, `y` followed by pasting API Token twice.
- Finally, `q` to quit.

## Next Steps

- [Official docs for rclone](https://rclone.org/commands/) - Learn about other `rclone` commands like move, sync, etc.
- {{< doclink path="/en/docs/user-guides/webdav-clients/" text="WebDAV Clients Guides" />}} - Learn about other WebDAV clients
