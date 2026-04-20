---
title: "User Management"
description: "Manage users and permissions"
icon: "group"
order: 5
---

Configure users, permissions, and default user settings.

## User Management

Users can be managed through:
- Web UI (User Management section)
- CLI commands
- API

## Default User Settings

There's two main areas that user settings are configured.

### User Source configuration

Configure defaults applied to new users:

```yaml
server:
  sources:
    - path: "/data"
      config:
        defaultEnabled: true         # Give to all new users
        defaultUserScope: "/"       # Default access path under the source
```

{{% alert context="warning" %}}
**Deprecated:** `createUserDir` on source `config` is deprecated (user directories under `defaultUserScope` are always created for new users when applicable). Prefer setting `defaultUserScope` only; remove `createUserDir` from new configs.
{{% /alert %}}

### User Defaults

User defaults are configured on the `config.yaml` and are the default initial values for users when they are created.

{{% alert context="info" %}}
**Note**: userDefaults do NOT update or enforce a user's settings after one has been created. Its more accurately, "user create settings" than user defaults.
{{% /alert %}}

These values match the shape of the generated config reference (`frontend/public/config.generated.yaml` in the main repo). Only a subset is shown; omit keys you want to leave at defaults.

```yaml
userDefaults:
  editorQuickSave: false
  hideSidebarFileActions: false
  disableQuickToggles: false
  disableSearchOptions: false
  stickySidebar: true
  hideFilesInTree: false
  darkMode: true
  locale: "en"
  viewMode: "normal"
  singleClick: false
  showHidden: false
  dateFormat: false
  gallerySize: 3
  themeColor: "var(--blue)"
  quickDownload: false
  disablePreviewExt: ""
  disableViewingExt: ""
  lockPassword: false
  disableSettings: false
  preview:
    disableHideSidebar: false
    image: true
    video: true
    audio: true
    motionVideoPreview: true
    office: true
    popup: true
    autoplayMedia: true
    defaultMediaPlayer: false
    folder: true
    models: true
  permissions:
    api: false
    admin: false
    modify: false
    share: false
    realtime: false
    delete: false
    create: false
    download: true
  loginMethod: "password"
  disableUpdateNotifications: false
  deleteWithoutConfirming: false
  deleteAfterArchive: true
  fileLoading:
    maxConcurrentUpload: 10
    uploadChunkSizeMb: 10
    clearAll: false
    downloadChunkSizeMb: 0
  disableOnlyOfficeExt: ".md .txt .pdf .html .xml"
  customTheme: ""
  showSelectMultiple: false
  debugOffice: false
  preferEditorForMarkdown: false
```

{{% alert context="info" %}}
**Deprecated:** `disableOfficePreviewExt` is deprecated; use `disablePreviewExt` (and/or `disableOnlyOfficeExt` for the OnlyOffice editor) instead. **`preview.highQuality`** is deprecated and treated as always on in v1.3.0+.
{{% /alert %}}

`permissions` are not editable by the user unless they are admin, but all other settings are modifyable in profile settings in the UI.

## Creating Users

### Via Web UI

1. Log in as admin
2. Go to **User Management**
3. Click **Create User**
4. Set username, password, permissions
5. Assign sources and scopes

### Via CLI

```bash
./filebrowser set -u username,password -c config.yaml
```

Create as admin:
```bash
./filebrowser set -u username,password -a -c config.yaml
```

## User Permissions

### Admin Permissions

```
- Full system access
- User management
- Configuration access
- All file operations
```

### Standard Permissions

Configure per user:
- **Create** - Create files and folders
- **Rename** - Rename files and folders
- **Modify** - Edit and modify files
- **Delete** - Delete files and folders
- **Share** - Create share links
- **Download** - Download files
- **API** - Access REST API

## User Scopes

Scopes define which sources and paths a user can access.

### Assign Scope

In User Management:
1. Edit user
2. Select source
3. Set scope path (e.g., `/`, `/subfolder`, `/users/john`)
4. Save

### Auto-Create User Directories

Per-user directories are created under each source’s `defaultUserScope` using the username (the old `createUserDir` toggle is deprecated). Example:

```yaml
server:
  sources:
    - path: "/home/users"
      config:
        defaultEnabled: true
        defaultUserScope: "/"
```

This creates `/home/users/<username>` for each new user and scopes them to that folder.

## User Groups

Groups are currently managed and provided by the LDAP or OIDC provider. Adding groups manually in technically supported via API (see swagger), but not yet implemented as a feature in the UI. Stay tuned.

## Password Management

### Set Password Requirements

```yaml
auth:
  methods:
    password:
      minLength: 12
```

### Reset User Password

```bash
./filebrowser set -u username,newpassword -c config.yaml
```

## Two-Factor Authentication

Users can enable 2FA in their profile settings:
1. Go to **Profile** → **Security**
2. Click **Enable 2FA**
3. Scan QR code
4. Enter verification code

## API Tokens

Users with API permission can create tokens:
1. Go to **Settings** → **API Management**
2. Click **Create Token**
3. Copy and save securely

## Next Steps

- {{< doclink path="access-control/rules/" text="Configure access rules" />}}
- {{< doclink path="access-control/groups/" text="Set up groups" />}}
- {{< doclink path="configuration/authentication/" text="Configure authentication" />}}

