---
title: "Uploading Files on the go"
description: "A example of using HTTP Shorcuts app to upload files to FileBrowser bypassing Filepicker"
icon: "deployed_Code"
---

Uploading files from Android can be very difficult. You have to use the android file picker to navigate even if you want share a photo that you opened and its in front of you, but you can't because it is a photo from a few years back that is deep buried down, etc. This guide will demonstrate how to use the share button to upload to FileBrowser instead.

{{% alert context="important" %}}
This only works for a single **FILE** not folders. If you really need to upload a folder or a number of files, you will need to zip them first. While you can choose multiple files and share, this configuration will only accept the first file in the list.
{{% /alert %}}

{{% alert context="info" %}}
This will work with any share button that opens a popup (in technical terms, `Share Intent`) as long as it's a file.
{{% /alert %}}

To share files from Android's share button, you need to download another app called [HTTP Shortcuts](https://http-shortcuts.rmy.ch/). The download links are in that link.

## Steps to follow

1. Once you install and open it, click the three dots in top right corner then choose `Import/Export`.
2. Click Import from URL. Paste in this [url](https://gist.githubusercontent.com/BaccanoMob/83f083b5a021d5c71aa19fbb09b9fc12/raw/626f6c06b77957c52ba806cccd0be45f634d4007/filebrowser-quantum-http-shortcut.json). Leads to the gist (https://gist.github.com/BaccanoMob/83f083b5a021d5c71aa19fbb09b9fc12), which you can technically download the file and use the Import from File option.
3. Go back to App's home screen (not your phone's), click the three dots again, but this time choose `Global variables` and update the variables' value according to your instance (leave the other checkboxes as is).
    - `filebrowser_instance` => `https://quantum.domain.tld/` (can be HTTP/HTTPS based on how you set up but MUST end with a `/`)
    - `filebrowser_api` => API Key from WebUI. Settings > API Keys > New > Choose the dates. It should work with only the API checked.
    - `filebrowser_sources` => List all sources in your FileBrowser.
4. Other variables do not need to be set now. But for information,
    - `upload_file_name` => Name of the file (do not worry, it would automatically retrieve from share intent)
5. On upload, it will upload to the selected source at `/Uploads` folder. If the folder does not exist, FileBrowser will create it if the user of the API has the permission to do so.
5.  Now to your messaging app or gallery or FileBrowser. Share a file, you may see `Upload to Filebrowser` (name of the shortcut btw) or find `HTTP Shortcuts` the app itself. Now you will be prompted for the remaining variables. Type in the source and path. After a couple of seconds you should see a notification that its successful.
6. Optional, you can set Filebrowser logo to your shortcut. First, you need to download the [logo](https://raw.githubusercontent.com/gtsteffaniak/filebrowser/refs/heads/main/frontend/public/img/icons/favicon-256x256.png). Then, open the App > Hold on the shortcut > Edit > Click the icon > Custom Icon > Round > Find the icon you download in the file picker.

## Current drawbacks

1. Can only upload only 1 file. (HTTP shortcut's limitation).
2. Doesnt resolve conflict. Just throws a 409 status code. AKA, you can't upload a file with a same name multiple times.([#1865](https://github.com/gtsteffaniak/filebrowser/issues/1865))
3. If you upload a zip, you cant unzip it in the WebUI. You will need to unzip in the terminal/GUI in the system. ([#335](https://github.com/gtsteffaniak/filebrowser/issues/335) and [#1252](https://github.com/gtsteffaniak/filebrowser/issues/1252))
